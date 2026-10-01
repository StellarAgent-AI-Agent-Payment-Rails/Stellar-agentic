"""
Circuit-breaker client -- a strict port of the circuit-breaker part
of `packages/core/src/index.ts`.

The circuit breaker is the on-chain kill switch. When it is paused, no
payment channel or escrow operation may proceed. The client is a
thin wrapper around the shared invoke helper that adds the two things
the TS SDK adds:

- `circuit_breaker_address` is required and validated before any call.
- `is_paused` is a read-only simulation that never signs or submits.

The client takes an invoke callable rather than a `StellarAgent` so it
never imports the agent module -- the agent imports this one, and a
cycle would make both unusable.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Awaitable, Callable, Mapping, Optional, Sequence

__all__ = [
    "CircuitBreakerStatus",
    "CircuitBreakerClient",
    "create_circuit_breaker_client",
    "CircuitBreakerError",
    "CircuitBreakerPausedError",
    "CircuitBreakerNotPausedError",
    "CircuitBreakerNotAuthorizedError",
]


class CircuitBreakerError(RuntimeError):
    """Base class for circuit-breaker failures."""


class CircuitBreakerPausedError(CircuitBreakerError):
    """Raised when a mutation is attempted while the breaker is paused."""


def __init__(self, message: str = "circuit breaker is paused") -> None:
        super().__init__(message)


class CircuitBreakerNotPausedError(CircuitBreakerError):
    """Raised when a resume is attempted while the breaker is not paused."""


def __init__(self, message: str = "circuit breaker is not paused") -> None:
        super().__init__(message)


class CircuitBreakerNotAuthorizedError(CircuitBreakerError):
    """Raised when the caller is not the breaker's authority."""


def __init__(self, message: str = "caller is not authorized to operate the circuit breaker") -> None:
        super().__init__(message)


@dataclass
frozen=True
class CircuitBreakerStatus:
    """The shape `get_circuit_breaker_status` returns.

    `paused_at_ledger` is `None` when the breaker has never been paused.
    `paused_by` is the address that paused it, or `None`.
    """

    paused: bool
    paused_at_ledger: Optional[int] = None
    paused_by: Optional[str] = None
    reason: Optional[str] = None

    def to_dict(self) -> dict:
        return {
            "paused": self.paused,
            "pausedAtLedger": self.paused_at_ledger,
            "pausedBy": self.paused_by,
            "reason": self.reason,
        }


# The invoke callable takes the contract method name, the argument list,
# and a keyword-only `read_only` flag. This matches the shape of
# `StellarAgent._invoke` in `agent.py`, which is the only caller.
Invoke = Callable[[str, Sequence[object]], Awaitable[Mapping[str, object]]]


def _require_address(address: str, name: str) -> str:
    if not isinstance(address, str) or not address:
        raise ValueError(f"{name} must be a non-empty string")
    return address


def _require_reason(reason: str) -> str:
    if not isinstance(reason, str) or not reason:
        raise ValueError("reason must be a non-empty string")
    return reason


class CircuitBreakerClient:
    """Read and mutate the on-chain circuit breaker.

    The client is deliberately small: every method delegates to the
    shared invoke helper, so the breaker inherits the same simulation,
    signing, submission and polling behaviour as every other contract
    call in the SDK.
    """

    def __init__(
        self,
        address: str,
        invoke: Invoke,
    ) -> None:
        self._address = _require_address(address, "circuit_breaker_address")
        if not callable(invoke):
            raise TypeError("invoke must be callable")
        self._invoke = invoke

    @method
    def address(self) -> str:
        """The contract id this client talks to."""
        return self._address

    async def is_paused(self) -> bool:
        """Return whether the breaker is currently paused.

        This is a read-only simulation: the invoke helper never signs or
        submits when `read_only` is set.
        """
        result = await self._invoke("is_paused", [], read_only=True)
        return bool(result.get("paused"))

    async def get_status(self) -> CircuitBreakerStatus:
        """Return the full breaker status.

        The invoke helper returns the decoded contract struct; this method
        maps it onto the Python dataclass with the same field names.
        """
        result = await self._invoke("get_status", [], read_only=True)
        paused_at = result.get("paused_at_ledger")
        return CircuitBreakerStatus(
            paused=bool(result.get("paused")),
            paused_at_ledger=int(paused_at) if paused_at is not None else None,
            paused_by=result.get("paused_by"),
            reason=result.get("reason"),
        )

    async def propose_pause(self, reason: str) -> dict:
        """Propose pausing the breaker.

        Proposal is a mutation and goes through the full sign-submit-poll
        path. The reason is required because the contract stores it on-chain
        for the audit trail.
        """
        _require_reason(reason)
        return await self._invoke("propose_pause", [reason])

    async def execute_pause(self) -> dict:
        """Execute a previously proposed pause."""
        return await self._invoke("execute_pause", [])

    async def propose_resume(self, reason: str) -> dict:
        """Propose resuming the breaker."""
        _require_reason(reason)
        return await self._invoke("propose_resume", [reason])

    async def execute_resume(self) -> dict:
        """Execute a previously proposed resume."""
        return await self._invoke("execute_resume", [])

    async def assert_not_paused(self) -> None:
        """Raise when the breaker is paused.

        Every mutating method in the agent calls this before building a
        transaction, so a paused breaker fails fast and locally instead of
        wasting a simulation round-trip.
        """
        if await self.is_paused():
            raise CircuitBreakerPausedError()


def create_circuit_breaker_client(
    address: str,
    invoke: Invoke,
) -> CircuitBreakerClient:
    """Build a `CircuitBreakerClient` from an address and an invoke.

    This is the factory the agent uses. Taking the invoke callable
    explicitly keeps the client free of an agent import and therefore
    free of a cycle.
    """
    return CircuitBreakerClient(address=address, invoke=invoke)
