"""Error types and mappings for the StellarAgent Python SDK.

This module mirrors the TypeScript SDK's error handling for the
escrow contract. The contract returns symbolic error codes (see
``contracts/escrow/src/lib.rs``) which are translated into typed
exceptions so callers can react programmatically.
"""

from __future__ import annotations

from typing import Any, Dict, Optional

__all__ = [
    "StellarAgentError",
    "EscrowError",
    "JobNotFoundError",
    "JobNotOpenError",
    "JobExpiredError",
    "NotAuthorizedError",
    "UnknownEscrowError",
    "map_escrow_error",
    "ESCROW_ERROR_CODES",
]


class StellarAgentError(Exception):
    """Base class for all StellarAgent SDK errors."""

    default_code: Optional[str] = None

    def __init__(
        self,
        message: str,
        *,
        code: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.code = code if code is not None else self.default_code
        self.details: Dict[str, Any] = dict(details or {})

    def __repr__(self) -> str:
        return f"{type(self).__name__}({self.message!r}, code={self.code!r})"


class EscrowError(StellarAgentError):
    """Base class for errors reported by the Escrow contract."""


class JobNotFoundError(EscrowError):
    """Raised when the requested job id does not exist."""

    default_code = "JOB_NOT_FOUND"


class JobNotOpenError(EscrowError):
    """Raised when a job is not in the expected open state."""

    default_code = "JOB_NOT_OPEN"


class JobExpiredError(EscrowError):
    """Raised when a job has expired."""

    default_code = "JOB_EXPIRED"


class NotAuthorizedError(EscrowError):
    """Raised when the caller is not authorized for the operation."""

    default_code = "NOT_AUTHORIZED"


class UnknownEscrowError(EscrowError):
    """Raised for any escrow error code we do not yet map."""


ESCROW_ERROR_CODES: Dict[str, type[EscrowError]] = {
    "JOB_NOT_FOUND": JobNotFoundError,
    "JOB_NOT_OPEN": JobNotOpenError,
    "JOB_EXPIRED": JobExpiredError,
    "NOT_AUTHORIZED": NotAuthorizedError,
}


def _extract_code(error: Any) -> Optional[str]:
    """Best-effort extraction of a contract error code from a raw error.

    The Soroban Python SDK surfaces contract errors in a few different
    shapes depending on the transport and version. We accept any of the
    following:

    * a plain string (already the code)
    * an exception with a `.code` attribute
    * an exception whose message contains the code
    * a dict with a `code` or `message` field
    """
    if error is None:
        return None

    if isinstance(error, str):
        return _match_code(error)

    if isinstance(error, dict):
        for key in ("code", "message", "error"):
            value = error.get(key)
            if isinstance(value, str):
                matched = _match_code(value)
                if matched is not None:
                    return matched
        return None

    code_attr = getattr(error, "code", None)
    if isinstance(code_attr, str):
        matched = _match_code(code_attr)
        if matched is not None:
            return matched

    message = getattr(error, "message", None)
    if isinstance(message, str):
        matched = _match_code(message)
        if matched is not None:
            return matched

    return None


def _match_code(text: str) -> Optional[str]:
    """Return the first known escrow code found in *text*."""
    for code in ESCROW_ERROR_CODES:
        if code in text:
            return code
    return None


def map_escrow_error(error: Any, *, context: Optional[str] = None) -> EscrowError:
    """Translate a raw error from the Escrow contract into a typed error.

    This mirrors the TypeScript SDK's error mapping: the four known
    contract codes become dedicated exception classes and everything else
    falls back to :class:`UnknownEscrowError`. If *error* is already an
: class:`EscrowError` it is returned unchanged so the function is idempotent.
    """
    if isinstance(error, EscrowError):
        return error

    code = _extract_code(error)
    details: Dict[str, Any] = {}
    if context is not None:
        details["context"] = context
    if error is not None:
        details["raw"] = str(error)

    error_cls = ESCROW_ERROR_CODES.get(code or "")
    if error_cls is None:
        message = f":{ra}" if error is not None else "Unknown escrow error"
        return UnknownEscrowError(message, code=code, details=details)

    message = f"{error_cls.default_code}: {error!r}"
    return error_cls(message, code=error_cls.default_code, details=details)
