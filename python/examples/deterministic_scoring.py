"""Runnable example: deterministic bid scoring against testnet config.

    python examples/deterministic_scoring.py
"""

from stellaragent import AgentBid, rank_bids

BIDS = [
    AgentBid("GALPHA", price="1", reputation="90",
             estimated_latency_seconds="3", success_rate="0.9"),
    AgentBid("GBRAVO", price="2", reputation="95",
             estimated_latency_seconds="1", success_rate="0.99"),
]

ranked = rank_bids(BIDS)
for bid in ranked:
    print(f"{bid.agent_address:8} score={bid.score}")
print("winner:", ranked[0].agent_address)
