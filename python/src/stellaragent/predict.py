"""
Deterministic bid prediction -- a strict port of `packages/core/src/predict.ts`.

The TypeScript implementation is the reference. Where the two could differ, the TS behaviour wins and the determinism fixtures prove it.

The module exposes the same window semantics as the TypeScript side:

- A window is a half-open interval `[start, end)` of ledger numbers.
- Windows are aligned to a fixed number of ledges (the "window size").
- Predictions are deterministic: the same inputs always produce the same
  output, and the output is byte-identical to the TypeScript one.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, Optional, Sequence

__all__ = [
    "LedgerWindow",
    "PredictionInput",
    "PredictionResult",
    "window_for",
    "window_start",
    "window_end",
    "is_in_window",
    "predict",
    "predict_batch",
    "DEFAULT_WINDOW_SIZE",
    "MIN_WINDOW_SIZE",
    "MAX_WINDOW_SIZE",
]

# The TS side defines these as constants in `predict.ts`. They are
# part of the wire contract between the two SDKs, so they must not drift.
DEFAULT_WINDOW_SIZE = 17280
MIN_WINDOW_SIZE = 1
MAX_WINDOW_SIZE = 1_000_000


def _check_window_size(window_size: int) -> int:
    if not isinstance(window_size, int) or isinstance(window_size, bool):
        raise TypeError(
            f"window_size must be an integer, not {type(window_size).__name__}"
        )
    if window_size < MIN_WINDOW_SIZE or window_size > MAX_WINDOW_SIZE:
        raise ValueError(
            f"window_size must be between {MIN_WINDOW_SIZE} and "
            f"{MAX_WINDOW_SIZE}, got {window_size}"
        )
    return window_size


def _check_ledger(ledger: int, name: str = "ledger") -> int:
    if not isinstance(ledger, int) or isinstance(ledger, bool):
        raise TypeError(f"{name} must be an integer, not {type(ledger).__name__}")
    if ledger < 0:
        raise ValueError(f"{name} must be non-negative, got {ledger}")
    return ledger


@dataclass
frozen=True
class LedgerWindow:
    """A half-open interval of ledger numbers `[start, end)`."""

    start: int
    end: int
    size: int

    def __post_init__(self) -> None:
        if self.end <= self.start:
            raise ValueError(
                f"LedgerWindow.end (={self.end}) must be greater than "
                f"LedgerWindow.start (={self.start})"
            )
        if self.size != self.end - self.start:
            raise ValueError(
                f"LedgerWindow.size (={self.size}) must equal end - start "
                f"(={self.end - self.start})"
            )

    def contains(self, ledger: int) -> bool:
        """True when `ledger` falls in the half-open interval `[start, end)`."""
        _check_ledger(ledger)
        return self.start <= ledger < self.end

    def to_dict(self) -> dict:
        return {"start": self.start, "end": self.end, "size": self.size}


@dataclass
frozen=True
class PredictionInput:
    """The inputs to a single prediction.

    `ctivity` is the number of calls the agent made in the window that
    ends at `current_ledger`. `limit` is the agent's configured ceiling for
    that window.
    """

    agent: str
    current_ledger: int
    activity: int
    limit: int
    window_size: int = DEFAULT_WINDOW_SIZE

    def __post_init__(self) -> None:
        if not isinstance(self.agent, str) or not self.agent:
            raise ValueError("PredictionInput.agent must be a non-empty string")
        _check_ledger(self.current_ledger, "current_ledger")
        _check_ledger(self.activity, "activity")
        _check_ledger(self.limit, "limit")
        _check_window_size(self.window_size)


@dataclass
frozen=True
class PredictionResult:
    """The output of a single prediction.

    `remaining` is the number of calls the agent may still make in the
    window before hitting its limit. `would_exceed` is true when the
    predicted activity would overshoot the limit. `window` is the
    half-open interval the prediction was made against.
    """

    agent: str
    window: LedgerWindow
    predicted_activity: int
    remaining: int
    would_exceed: bool
    utilization: float

    def to_dict(self) -> dict:
        return {
            "agent": self.agent,
            "window": self.window.to_dict(),
            "predictedActivity": self.predicted_activity,
            "remaining": self.remaining,
            "wouldExceed": self.would_exceed,
            "utilization": self.utilization,
        }


def window_start(ledger: int, window_size: int = DEFAULT_WINDOW_SIZE) -> int:
    """Return the first ledger of the window containing `ledger`.

    Windows are aligned to multiples of `window_size`, so the window
    containing ledger `L` is `[floor(L / size) * size, floor((L + 1) / size) * size)`.
    """
    _check_ledger(ledger)
    _check_window_size(window_size)
    return (ledger // window_size) * window_size


def window_end(ledger: int, window_size: int = DEFAULT_WINDOW_SIZE) -> int:
    """Return the exclusive end of the window containing `ledger`."""
    return window_start(ledger, window_size) + window_size


def window_for(ledger: int, window_size: int = DEFAULT_WINDOW_SIZE) -> LedgerWindow:
    """Return the `LedgerWindow` containing `ledger`."""
    start = window_start(ledger, window_size)
    return LedgerWindow(start=start, end=start + window_size, size=window_size)


def is_in_window(ledger: int, window: LedgerWindow) -> bool:
    """True when `ledger` falls in `window`."""
    return window.contains(ledger)


def predict(inputs: PredictionInput) -> PredictionResult:
    """Predict the agent's window utilization.

    The prediction is purely a function of the inputs: the same
    `PredictionInput` always yields the same `PredictionResult`, and the
    serialized form is byte-identical to the TypeScript one.
    """
    if not isinstance(inputs, PredictionInput):
        raise TypeError(
            f"predict expects a PredictionInput, not {type(inputs).__name__}"
        )

    window = window_for(inputs.current_ledger, inputs.window_size)
    predicted = inputs.activity
    remaining = max(0, inputs.limit - predicted)
    would_exceed = predicted > inputs.limit
    utilization = 0.0 if inputs.limit == 0 else min(1.0, predicted / inputs.limit)

    return PredictionResult(
        agent=inputs.agent,
        window=window,
        predicted_activity=predicted,
        remaining=remaining,
        would_exceed=would_exceed,
        utilization=utilization,
    )


def predict_batch(inputs: Iterable[PredictionInput]) -> Sequence[PredictionResult]:
    """Predict for a sequence of inputs, preserving order."""
    return [predict(item) for item in inputs]
