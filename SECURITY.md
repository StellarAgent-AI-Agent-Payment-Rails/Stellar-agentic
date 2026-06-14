# Security Policy

## Reporting a Vulnerability

We take security seriously. If you discover a vulnerability in the Stellar-agentic SDK or smart contracts, please report it responsibly.

**Preferred method:** Use GitHub's [private security advisory](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/security/advisories/new) feature.

**Alternative:** Email the maintainers at the address listed in the repository owner's profile.

Please do **not** open a public issue for security vulnerabilities.

## Response SLA

We aim to:

- Acknowledge your report within **48 hours**
- Provide an initial assessment within **5 business days**
- Issue a fix or mitigation plan within **30 days**, depending on severity

We will keep you informed of progress throughout the process.

## Scope

### In Scope

- **Smart contracts** in the `contracts/` directory
- **SDK code** in the `sdk/` directory
- Authentication and authorization logic
- Transaction signing and submission flows
- Any code that handles user funds or private keys

### Out of Scope

- The Stellar network itself (report to [Stellar Development Foundation](https://www.stellar.org/security))
- Third-party dependencies (report upstream)
- Social engineering attacks
- Denial of service via network-level attacks
- Issues already publicly disclosed

## Bug Bounty Policy

At this time, we do not offer a formal bug bounty program with guaranteed payouts. However, we deeply appreciate responsible disclosure and are happy to:

- Publicly acknowledge your contribution (if you wish) in our release notes
- Consider rewards for critical vulnerabilities on a case-by-case basis

## Safe Harbor

We consider security research conducted in good faith under this policy to be:

- Authorized under applicable anti-hacking laws
- Exempt from restrictions in our Terms of Service that would otherwise prohibit such activity
- Conducted with our full support — we will not pursue legal action against researchers who follow this policy

Please act in good faith: avoid data destruction, service interruption, or privacy violations.
