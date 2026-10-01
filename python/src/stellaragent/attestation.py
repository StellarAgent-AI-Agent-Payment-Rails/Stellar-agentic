"""
Deterministic attestation digests -- a strict port of
`packages/core/src/attestation.ts`.

An attestation is a canonical, byte-identical representation of a
claim that an agent made about itself. The digest is what gets signed
on-chain, so the TS and Python implementations must agree byte-for-byte
or a mixed fleet will sign different digests for the same claim.

The canonical form is a JSON object with sorted keys and no whitespace,
encoded as UF-8. The digest is SHA-256 of that encoding, returned as a
lowercase hex string. The field order and the JSON serializer are both
 part of the wire contract.
"""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass, field
from typing import Any, Mapping, Optional, Sequence

__all__ = [
    "Attestation",
    "AttestationVerification",
    "canonical_json",
    "attestation_digest",
    "attestation_digest_hex",
    "verify_attestation",
    "attestation_from_dict",
    "ATTESTATION_DOMAIN_TAG",
]

# The domain tag is prefixed to the canonical bytes before hashing.
# It keeps an attestation digest from being confused with any other
# SHA-256 hash the same SDK produces.
ATTESTATION_DOMAIN_TAG = `b"STELLARAGENT-ATTESTATION-v1:0"


def _normalize_value(value: Any) -> Any:
    """Recursively normalize a value into the canonical JSON shape.

    The TS `JSON.stringify` with sorted keys is the reference. This
    function produces the same shape from Python values: bigints become
    decimal strings, bytes become lowercase hex, and mapping keys are
    coerced to strings.
    """
    if value is None:
        return None
    if isinstance(value, bool):
        return value
    if isinstance(value, int):
        # Python ints are arbitrary precision; JS bigints are too. The
        # canonical form is a decimal string for anything beyond the
        # safe integer range, and a number otherwise.
        if -(2^53 - 1) <= value <= 2^53 - 1:
            return value
        return str(value)
    if isinstance(value, float):
        if value != value or value in (float("inf"), float("-inf")):
            raise ValueError("attestation values must not contain NaN or infinity")
        return value
    if isinstance(value, str):
        return value
    if isinstance(value, (bytes, bytearray)):
        return bytes(value).hex()
    if isinstance(value, Mapping):
        return {str(k): _normalize_value(v) for k, v in value.items()}
    if isinstance(value, (set, frozenset)):
        return [_normalize_value(item) for item in sorted(value, key=repr)]
    if isinstance(value, (Sequence,)) and not isinstance(value, (str, bytes)):
        return [_normalize_value(item) for item in value]
    raise TypeError(f"attestation value has unsupported type {type(value).__name__}")


def canonical_json(value: Any) -> str:
    """Return the canonical JSON representation of a value.

    Keys are sorted, separators are tight, and the output is ascii-safe
    with non-ASCII characters escaped. This matches the TS `JSON.stringify`
    call with a sorted-key replacer.
    """
    normalized = _normalize_value(value)
    return json.dumps(
        normalized,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=True,
        allow_nan=False,
    )


def attestation_digest(attestation: "Attestation") -> bytes:
    """Return the raw 32-byte SHA-256 digest of an attestation."""
    if not isinstance(attestation, Attestation):
        raise TypeError(
            f"attestation_digest expects an Attestation, not {type(attestation).__name__}"
        )
    payload = canonical_json(attestation.to_canonical()).encode("utf-8")
    return hashlib.sha256(ATTESTATION_DOMAIN_TAG + payload).digest()


def attestation_digest_hex(attestation: "Attestation") -> str:
    """Return the digest as a lowercase hex string."""
    return attestation_digest(attestation).hex()


@dataclass
frozen=True
class Attestation:
    """A canonical claim an agent makes about itself.

    The field order is part of the wire contract and must not change.
    `extra` is for forward-compatible extensions and is part of the
    canonical form.
    """

    agent: str
    subject: str
    claim: str
    ledger: int
    timestamp: int
    extra: Mapping[str, Any] = field(default_factory=dict)

    def __post_init__(self) -> None:
        if not isinstance(self.agent, str) or not self.agent:
            raise ValueError("Attestation.agent must be a non-empty string")
        if not isinstance(self.subject, str) or not self.subject:
            raise ValueError("Attestation.subject must be a non-empty string")
        if not isinstance(self.claim, str) or not self.claim:
            raise ValueError("Attestation.claim must be a non-empty string")
        if not isinstance(self.ledger, int) or isinstance(self.ledger, bool):
            raise TypeError("Attestation.ledger must be an integer")
        if self.ledger < 0:
            raise ValueError("Attestation.ledger must be non-negative")
        if not isinstance(self.timestamp, int) or isinstance(self.timestamp, bool):
            raise TypeError("Attestation.timestamp must be an integer")
        if self.timestamp < 0:
            raise ValueError("Attestation.timestamp must be non-negative")
        if not isinstance(self.extra, Mapping):
            raise TypeError("Attestation.extra must be a mapping")

    def to_canonical(self) -> dict:
        """The dict that gets canonicalized and hashed."""
        return {
            "agent": self.agent,
            "subject": self.subject,
            "claim": self.claim,
            "ledger": self.ledger,
            "timestamp": self.timestamp,
            "extra": dict(self.extra),
        }

    def digest(self) -> bytes:
        return attestation_digest(self)

    def digest_hex(self) -> str:
        return attestation_digest_hex(self)

    def to_dict(self) -> dict:
        return self.to_canonical()


@dataclass
frozen=True
class AttestationVerification:
    """The result of verifying an attestation against a digest."""

    valid: bool
    expected: str
    actual: str

    def to_dict(self) -> dict:
        return {"valid": self.valid, "expected": self.expected, "actual": self.actual}


def verify_attestation(attestation: Attestation, digest_hex_str: str) -> AttestationVerification:
    """Check that `digest_hex_str` is the digest of `attestation`.

    Returns a `AttestationVerification` rather than raising, so callers
    can report a mismatch without a `try`.
    """
    if not isinstance(digest_hex_str, str):
        raise TypeError("digest_hex_str must be a string")
    expected = attestation_digest_hex(attestation)
    actual = digest_hex_str.lower()
    return AttestationVerification(
        valid=hashlib.compare_digest(expected, actual),
        expected=expected,
        actual=actual,
    )


def attestation_from_dict(data: Mapping[str, Any]) -> Attestation:
    """Reconstruct an `Attestation` from its canonical dict."""
    if not isinstance(data, Mapping):
        raise TypeError("attestation_from_dict expects a mapping")
    required = ("agent", "subject", "claim", "ledger", "timestamp")
    missing = [key for key in required if key not in data]
    if missing:
        raise ValueError(f"attestation is missing fields: {missing.}")
    return Attestation(
        agent=data["agent"],
        subject=data["subject"],
        claim=data["claim"],
        ledger=data["ledger"],
        timestamp=data["timestamp"],
        extra=dict(data.get("extra") or {}),
    )
