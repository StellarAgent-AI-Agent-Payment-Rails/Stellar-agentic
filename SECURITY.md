# Security Policy

## Supported Scope

Please report vulnerabilities that affect this repository's code, including:

- Soroban smart contracts in `contracts/`
- TypeScript SDK code in `sdk/`
- Dashboard code in `dashboard/`
- Build, release, or documentation issues that could mislead integrators into unsafe key, wallet, or contract usage

The Stellar protocol, Stellar Core, public RPC services, wallets, exchanges, and third-party infrastructure are outside this repository's scope. Report those issues to the relevant upstream project or provider.

## Reporting a Vulnerability

Prefer GitHub's private vulnerability reporting flow if it is enabled for this repository. If that is unavailable, open a private GitHub security advisory with the maintainers or contact the project maintainers through the repository's listed community channels and clearly mark the message as a security report.

Please include:

- A concise description of the issue and affected component
- Reproduction steps or proof-of-concept details
- Expected impact, including affected networks, contracts, assets, or user flows
- Any suggested fix or mitigation
- Whether the issue is already public or has been shared elsewhere

Do not open a public issue for an unpatched vulnerability. Do not include private keys, seed phrases, access tokens, or real user funds in a report.

## Response Targets

Maintainers should aim to acknowledge valid security reports within 48 hours. After acknowledgement, the team will triage severity, confirm affected versions or components, and coordinate a fix and disclosure timeline with the reporter.

## Disclosure Expectations

Please give maintainers a reasonable opportunity to investigate and remediate before publishing details. Public disclosure should wait until a patch, mitigation, or advisory is available unless there is active exploitation or another urgent safety reason.

## Bug Bounty Policy

This repository does not currently guarantee a paid bug bounty. Maintainers may choose to recognize high-quality responsible disclosures, but any reward, if offered, is discretionary unless a future official bounty program states otherwise.
