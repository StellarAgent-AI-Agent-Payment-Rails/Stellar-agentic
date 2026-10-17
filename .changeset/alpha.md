---
'@stellaragent/core': patch
'@stellaragent/react': patch
'@stellaragent/cli': patch
tag: alpha
---

Initial alpha release of the StellarAgent TypeScript packages.

Publishes `@stellaragent/core`, `@stellaragent/react`, and `@stellaragent/cli`
to npm for the first time. All three packages move from `0.1.0` to
`0.1.0-alpha.0` together because none have been published yet; going forward
packages version independently (see `.changeset/README.md`).

Cutting this release:

1. `pnpm changeset version`  (bumps versions, writes the changelog, consumes this file)
2. `git tag v0.1.0-alpha.0 && git push --tags`
3. The `release.yml` workflow builds every package and publishes to npm with
   npm provenance.
