# v14.222 Review Console Recoverability Matrix Snapshot Static Regression

## Purpose

Freeze the v14.221 `recoverability_matrix_state` as a local static regression snapshot.

The snapshot prevents future Review Console or dashboard changes from counting the pending lamp candidate as an accepted sample, overclaiming Jenn approval, writing accepted_samples, or claiming VCP runtime integration.

## Scope

Allowed:

- Add a golden snapshot fixture for the v14.221 recoverability matrix.
- Add a validator that compares the snapshot against the v14.221 source workbench contract.
- Wire the validator into `scripts/validate_mvp.ps1`.

Forbidden:

- Do not capture Jenn approval.
- Do not write `accepted_samples`.
- Do not write `failure_samples`.
- Do not write `production_candidate`.
- Do not copy or modify image files.
- Do not call provider, API, plugin, MCP, DailyNote, or VCP memory.
- Do not read `.env`, `.env.local`, real manifest, VCPChat, or VCPToolBox.
- Do not push, tag, release, or deploy.

## Expected Result

```yaml
phase: v14_222_review_console_recoverability_matrix_snapshot_static_regression
snapshot_status: golden_static_snapshot
draft_output_key: recoverability_matrix_state
row_count: 3
complete_recoverable_sample_count: 2
blocked_registration_candidate_count: 1
remaining_full_recoverable_sample_gap: 1
pending_candidate_counted_as_accepted: false
blocked_sample_id: accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001
blocker: human_approval_missing
vcp_runtime_integration_proven: false
```

## Boundary Statement

This snapshot is regression evidence only. It is not Jenn approval, not accepted_samples registration, not production_candidate promotion, and not VCP runtime integration.
