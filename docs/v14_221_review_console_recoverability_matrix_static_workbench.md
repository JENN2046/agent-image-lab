# v14.221 Review Console Recoverability Matrix Static Workbench

## Purpose

Add a local read-only Review Console matrix that maps each visible sample to the recoverability fields required by the six-month visual production control layer goal.

This phase advances the Month 2 Review Console productization path while the Month 1 third accepted sample remains blocked by missing Jenn human approval.

## Scope

Allowed:

- Add `recoverability_matrix_state` to the static Review Console draft output.
- Render a local static matrix for the 2 recoverable accepted samples and the 1 blocked lamp candidate.
- Validate field completeness for artifact, hash, dimensions, mime, prompt, import record, review record, human approval, category index, and registry references.
- Keep the pending lamp candidate out of the accepted sample count.

Forbidden:

- Do not capture Jenn approval.
- Do not write `accepted_samples`.
- Do not write `failure_samples`.
- Do not write `production_candidate`.
- Do not copy or modify image files.
- Do not call provider, API, plugin, MCP, DailyNote, or VCP memory.
- Do not read `.env`, `.env.local`, real manifest, VCPChat, or VCPToolBox.
- Do not push, tag, release, or deploy.

## Evidence

- UI surface: `review_console/static_prototype/index.html`
- Static logic: `review_console/static_prototype/app.js`
- Static style: `review_console/static_prototype/styles.css`
- Static docs: `review_console/static_prototype/README.md`
- Fixture: `tests/schema_examples/v14_221_review_console_recoverability_matrix_static_workbench.example.json`
- Validator: `scripts/validate_v14_221_review_console_recoverability_matrix_static_workbench.js`

## Expected Result

```yaml
phase: v14_221_review_console_recoverability_matrix_static_workbench
draft_output_key: recoverability_matrix_state
row_count: 3
required_full_recoverable_sample_count: 3
complete_recoverable_sample_count: 2
blocked_registration_candidate_count: 1
remaining_full_recoverable_sample_gap: 1
hard_acceptance_three_full_samples_met: false
pending_candidate_counted_as_accepted: false
matrix_status: blocked_by_human_approval_missing
vcp_runtime_integration_proven: false
```

## Boundary Statement

This matrix is local static Review Console evidence only. It does not prove VCP runtime integration, does not register the lamp candidate as an accepted sample, and does not authorize any future write.
