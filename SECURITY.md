# Security Policy

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Use [GitHub's private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
to submit a report directly to the maintainers.

Alternatively, email the maintainers directly. If you are unsure whether a
behaviour qualifies as a security issue, report it privately anyway — it is
better to over-report.

### Response timeline

| Stage | Target |
|-------|--------|
| Acknowledgement | 48 hours |
| Initial assessment | 7 days |
| Fix or mitigation | 30 days |

We will keep you informed at each stage. If a report is declined, we will
explain why.

## Scope

The following components are in scope:

| Component | Path |
|-----------|------|
| Soroban smart contracts | `contracts/` |
| TypeScript SDK (core) | `packages/core/` |
| React hooks | `packages/react/` |
| CLI | `packages/cli/` |
| Deployment script | `scripts/` |
| Dashboard | `dashboard/` |
| Python SDK | `python/` |
| Zero-knowledge circuits | `zk/` |

## Out of scope

- Vulnerabilities in third-party dependencies — report upstream
- Social engineering or physical attacks
- Denial of Service without a proof of concept
- Issues in testnet-only configurations that cannot affect mainnet

## Reward

StellarAgent participates in GrantFox OSS campaigns. Issues labelled
`Maybe Rewarded` may be eligible for USDC rewards upon merge. Security
reports are handled separately and are not part of the bounty program.
