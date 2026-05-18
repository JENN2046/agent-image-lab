# Validator Layout Policy

This directory is the preferred home for new validators.

Current reality:

- Existing historical validators remain at `scripts/validate_v*.js`.
- `scripts/validate_mvp.ps1` remains the aggregate validation entry point.
- `scripts/lib/` remains the shared helper location.
- No old validator is moved by this policy.

Preferred future layout:

```text
scripts/validators/
  core/
  artifact_recoverability/
  review_console/
  v14/
```

Rules for new validators:

- Keep domain logic in shared helpers when it is reused by multiple validators.
- Keep validator outputs structured and machine-checkable.
- Avoid relying only on markdown token checks when a schema or JSON fixture can represent the state.
- Do not run provider, plugin, API, DailyNote, VCP memory, runtime, push, tag, release, or deploy actions from validators.
- Any real execution runner belongs behind an explicit A5 authorization boundary and should not be treated as a validator.
