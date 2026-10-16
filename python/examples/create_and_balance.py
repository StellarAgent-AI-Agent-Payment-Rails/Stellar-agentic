"""Runnable example: create an agent on testnet and read its XLM balance.

    python examples/create_and_balance.py
"""

from stellaragent import StellarAgent

agent = StellarAgent.create(network="testnet", allow_unconfigured_contracts=True)
print("address:", agent.address)
print("balance:", agent.get_balance())
