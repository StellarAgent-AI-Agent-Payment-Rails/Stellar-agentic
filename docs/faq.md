# Frequently Asked Questions

## Why use Stellar instead of Ethereum for agent payments?

Stellar is designed for fast, low-cost transfers, so small agent payments can settle without Ethereum-style gas fees overwhelming the payment amount. This makes it a practical fit for metered API calls, agent-to-agent work, and other high-frequency workflows.

## What is the minimum viable payment amount?

The project examples use payments as small as `0.001 USDC` for API calls. The practical minimum depends on the asset, trustline requirements, destination service, and any business rules your application applies.

## Can I use tokens other than USDC?

Yes, the SDK and contracts should treat the asset as a configurable field where supported. USDC is the default example because it is widely understood as a stable payment asset on Stellar.

## What happens if my agent goes over the spend limit?

Spend limits are intended to stop or reject payments that exceed the configured amount for the selected period. Applications should surface the rejection to the agent controller and require a new limit or human approval before continuing.

## How do I monitor my agent's spending?

Use the dashboard for human-readable summaries and keep application-side logs for each payment request. For production systems, also reconcile against Stellar transaction history so the on-chain record and your internal ledger stay aligned.

## Is this audited?

No audit is listed in this repository. Treat the contracts and SDK as unaudited until an independent security review is published, and avoid putting production funds at risk without your own review.

## Which network should I use first?

Start on Stellar testnet while integrating and testing spend limits, payment flows, and monitoring. Move to mainnet only after you have completed application testing, key management checks, and operational runbooks.

## How should I store agent wallet keys?

Store private keys in a dedicated secret manager or secure wallet service, not in source code, logs, or frontend bundles. Rotate keys if they are exposed and separate testnet credentials from production credentials.

## How do agent-to-agent escrow jobs work?

A requesting agent can create a job with an escrow amount and a worker agent address. The escrow contract should hold funds until the job completes according to the rules your application enforces.

## What should I do if a payment fails?

Record the failed request, inspect the returned error, and decide whether it is safe to retry. Common causes include insufficient balance, missing trustlines, network/RPC errors, invalid asset configuration, or spend-limit rejection.

## Can I integrate StellarAgent with an existing backend?

Yes. Keep payment orchestration on the backend where secrets and policy checks are easier to protect, then expose narrow application APIs to agents or users that need to request payments.
