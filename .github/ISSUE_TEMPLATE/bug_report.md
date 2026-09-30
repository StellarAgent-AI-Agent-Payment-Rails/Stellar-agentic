---
name: Bug report
about: Something isn't working
labels: bug
just_before_submit:
  - type: checkbox
    id: searched
    attributes:
      label: I searched existing issues and this bug has not been reported yet
      required: true
  - type: checkbox
    id: milestone
    attributes:
      label: I checked the roadmap milestones and this bug is not already tracked
      required: true
---

## What's broken?

<!-- Clear description of the bug -->

## Steps to reproduce

1.
2.
3.

## Expected behavior

## Actual behavior

## Environment

- Component: `contracts` / `sdk` / `dashboard`
- OS:
- Rust version (for contracts): `rustc --version`
- Node version (for sdk/dashboard): `node --version`
- Stellar CLI version (if relevant):

## Logs / error output

```
paste here
```
