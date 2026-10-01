"""
Deterministic ledger-time estimation -- a strict port of
`packages/core/src/ledgerTime.ts`.

Stellar closes a ledger roughly every five seconds. The exact cadence
varies with network conditions, so the TS SDY exposes a fallback constant
(`DEFAULT_LEDGER_CLOSE_SECONDS`) and a function that converts a ledger
delta into a wall-clock estimate. This module mirrors that contract exactly.

The fallback is load-bearing: a panel that displays "~2h" must be able to
say the number is a guess. The constant is therefore part of the wire
contract between the two SDKs.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

__all__ = [
    "DEFAULT_LEDGER_CLOSE_SECONDS",
    "MinimumLedgerCloseSeconds",
    "MaximumLedgerCloseSeconds",
    "LedgerCloseEstimate",
    "estimate_ledger_close_seconds",
    "estimate_time_until_ledger",
    "estimate_ledger_close_estimate",
    "clamp_ledger_close_seconds",
]

# The TS fallback. Stellar targets a 5s-close cadence; the SDK uses
# this when no observed average is available.
DEFAULT_LEDGER_CLOSE_SECONDS = 5

# The clamp bounds are the same as the TS module. A network that closes
# ledgers faster than one per second is not a Stellar testnet or mainnet,
# and a network that closes one every ten minutes is not one either.
MinimumLedgerCloseSeconds = 1.0
MaximumLedgerCloseSeconds = 600.0


def clamp_ledger_close_seconds(seconds: float) -> float:
    """Clamp an observed close cadence to the sane range."""
    if not isinstance(seconds, (float, int)) or isinstance(seconds, bool):
        raise TypeError(
            f"seconds must be a number, not {type(seconds).__name__}"
        )
    value = float(seconds)
    if value != value:  # NaN check without math.isnan
        return DEFAULT_LEDGER_CLOSE_SECONDS
    if value < MinimumLedgerCloseSeconds:
        return MinimumLedgerCloseSeconds
    if value > MaximumLedgerCloseSeconds:
        return MaximumLedgerCloseSeconds
    return value


def estimate_ledger_close_seconds(
    observed_avg_seconds: Optional[float] = None,
) -> float:
    """Return the close cadence to use for estimates.

    When `observed_avg_seconds` is provided and positive, it is clamped
    and returned. Otherwise the fallback constant is returned.
    """
    if observed_avg_seconds is None:
        return DEFAULT_LEDGER_CLOSE_SECONDS
    return clamp_ledger_close_seconds(observed_avg_seconds)


def estimate_time_until_ledger(
    current_ledger: int,
    target_ledger: int,
    avg_ledger_close_seconds: Optional[float] = None,
) -> float:
    """Estimate the number of seconds until `target_ledger` closes.

    Returns 0.0 when the target has already closed. The cadence is
    clamped through `estimate_ledger_close_seconds`.
    """
    if not isinstance(current_ledger, int) or isinstance(current_ledger, bool):
        raise TypeError("current_ledger must be an integer")
    if not isinstance(target_ledger, int) or isinstance(target_ledger, bool):
        raise TypeError("target_ledger must be an integer")
    if current_ledger < 0:
        raise ValueError("current_ledger must be non-negative")
    if target_ledger < 0:
        raise ValueError("target_ledger must be non-negative")

    remaining = target_ledger - current_ledger
    if remaining <= 0:
        return 0.0
    return remaining * estimate_ledger_close_seconds(avg_ledger_close_seconds)


@dataclass
frozen=True
class LedgerCloseEstimate:
    """The shape `STellarAgent.getLedgerCloseEstimate()` returns.

    `observed` distinguishes a measured cadence from the documented
    fallback, so a caller can tell the user the number is a guess.
    """

    current_ledger: int
    avg_ledger_close_seconds: float
    observed: bool

    def to_dict(self) -> dict:
        return {
            "currentLedger": self.current_ledger,
            "avgLedgerCloseSeconds": self.avg_ledger_close_seconds,
            "observed": self.observed,
        }


def estimate_ledger_close_estimate(
    current_ledger: int,
    observed_avg_seconds: Optional[float] = None,
) -> LedgerCloseEstimate:
    """Build the `LedgerCloseEstimate` the SDK returns.

    `observed` is true only when a positive observed average was
    supplied. The fallback is never reported as observed.
    """
    if not isinstance(current_ledger, int) or isinstance(current_ledger, bool):
        raise TypeError("current_ledger must be an integer")
    if current_ledger < 0:
        raise ValueError("current_ledger must be non-negative")

    observed = observed_avg_seconds is not None and observed_avg_seconds > 0
    cadence = estimate_ledger_close_seconds(observed_avg_seconds)
    return LedgerCloseEstimate(
        current_ledger=current_ledger,
        avg_ledger_close_seconds=cadence,
        observed=observed,
    )
