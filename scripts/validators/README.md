# Validator Layout Policy

This directory is the default home for new validators. The repository-wide
organization rules live in `docs/REPOSITORY_ORGANIZATION_STANDARD.md`; this
file is the validator-specific entry point for those rules.

Use `scripts/validators/VALIDATOR_INDEX.md` to inspect the current root
validator buckets before moving or wrapping any validator family.

Current reality:

- Existing historical validators remain at `scripts/validate_v*.js`.
- `scripts/validate_mvp.ps1` remains the aggregate validation entry point.
- `scripts/lib/` remains the shared helper location.
- No old validator is moved by this policy.

Default layout for new validators:

```text
scripts/validators/
  core/
  artifact_recoverability/
  governance/
  review_console/
  v14/
```

Current governance validators:

- `scripts/validators/governance/validate_repository_structure_governance.js`
  is the implementation for the repository organization standard guard.
- `scripts/validate_repository_structure_governance.js` is a root
  compatibility wrapper so existing commands keep working.

Current readonly operator console validators:

- `scripts/validators/readonly_operator_console/validate_readonly_operator_console_static_surface.js`
  is the implementation for the static readonly operator console surface guard.
- `scripts/validate_readonly_operator_console_static_surface.js` is a root
  compatibility wrapper so existing commands and README instructions keep
  working.

Current root validator index:

- `scripts/validators/VALIDATOR_INDEX.md` records the current root
  `validate_*.js` count and domain buckets.

Rules for new validators:

- Default to `scripts/validators/<domain_or_version>/`.
- Use root-level `scripts/validate_*.js` only for explicit compatibility,
  small repository-wide governance guards, or task-required consistency with an
  existing root-level validator family.
- If a root-level validator is added, document why it stays at root or how it
  will be wrapped later.
- Keep domain logic in shared helpers when it is reused by multiple validators.
- Keep validator outputs structured and machine-checkable.
- Avoid relying only on markdown token checks when a schema or JSON fixture can represent the state.
- Do not run provider, plugin, API, DailyNote, VCP memory, runtime, push, tag, release, or deploy actions from validators.
- Any real execution runner belongs behind an explicit A5 authorization boundary and should not be treated as a validator.
