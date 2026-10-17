# Changesets

This repo uses [Changesets](https://github.com/changesets/changesets) to manage
versioning and changelog generation for the three publishable npm packages:

- `@stellaragent/core` (`packages/core`)
- `@stellaragent/react` (`packages/react`)
- `@stellaragent/cli` (`packages/cli`)

## How a release is cut

1. **Add a changeset.** In your feature branch, add a markdown file to
   `.changeset/` describing the user-facing change and which package(s) it
   bumps (patch / minor / major). Example:

   ```md
   ---
   '@stellaragent/core': patch
   '@stellaragent/cli': patch
   ---

   Add `payForAPI` to the SDK and expose it through the CLI.
   ```

2. **Version.** A maintainer runs `pnpm changeset version` (or the Changesets
   GitHub action opens a version PR). This bumps the affected `package.json`
   files, writes the changelog, and consumes the changeset files.

3. **Tag.** Once the version PR is merged to `main`, a maintainer tags the
   commit, e.g. `git tag v0.1.0-alpha.0 && git push --tags`.

4. **Publish.** The tag push triggers
   `.github/workflows/release.yml`, which builds every package and publishes
   them to npm with [npm provenance](https://github.com/npm/cli/blob/latest/docs/content/provenance.md).

## Versioning strategy

Packages version **independently** (Changesets default). A change to
`@stellaragent/core` bumps only core — plus the dependent packages' internal
`workspace:*` references (`@stellaragent/cli`, `@stellaragent/react`) via
`updateInternalDependencies: always`. Packages only release when they have
changes, so consumers can adopt each package on its own cadence.

The first release (`0.1.0-alpha.0`) publishes all three packages together
because none have been published yet.

See [`docs/releases.md`](../docs/releases.md) for the full release runbook.
