// lint-staged runs these against staged files only, so a commit stays fast
// regardless of repo size. Each entry invokes that workspace package's own
// local eslint binary directly (by path) rather than a hoisted one, since
// pnpm's workspace install doesn't hoist bins and each package pins its own
// ESLint/plugin versions.
//
// packages/indexer is deliberately excluded: it has a "lint" script but no
// eslint devDependency or .eslintrc of its own, so `eslint` errors out with
// "couldn't find a configuration file" today (`pnpm lint` at the repo root
// already fails on this pre-existing gap, and it's outside this hook's
// scope). Wiring it into lint-staged would block commits to files this hook
// has no way to actually lint.
module.exports = {
  'packages/core/**/*.{ts,tsx}': 'packages/core/node_modules/.bin/eslint',
  'packages/cli/**/*.{ts,tsx}': 'packages/cli/node_modules/.bin/eslint',
  'packages/react/**/*.{ts,tsx}': 'packages/react/node_modules/.bin/eslint',
  'dashboard/**/*.{ts,tsx}': 'dashboard/node_modules/.bin/eslint',
};
