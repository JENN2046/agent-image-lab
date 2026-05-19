# Capsule Runtime Product Smoke Design

## Status

`completed_validated_pending_commit`.

## Objective

Define how Review Console should consume `unified_capsule_contract_report` in a real operator flow while staying static/design-only.

This gate does not implement runtime, browser validation, asset loading, provider calls, plugin calls, API calls, image generation, DailyNote writes, VCP memory writes, or production candidate promotion.

## Operator flow

### 1. Contract ingest

The operator starts from a prepared `unified_capsule_contract_report` object.

Allowed source for this design gate:

- static mock data
- checked-in fixture-style contract examples
- local validator output reviewed outside the UI

Forbidden source for this design gate:

- browser reads from `asset_archive/`
- direct preview image loading
- `fetch`
- VCPChat source reads
- VCPToolBox source reads
- real manifest reads from an external runtime
- provider, plugin, API, DailyNote, or VCP memory calls

### 2. Summary triage

The first operator decision reads only contract-level fields:

- `contract_status.registry_passed`
- `contract_status.manifest_passed`
- `contract_status.relation_passed`
- `contract_status.guard_passed`
- `contract_status.overall_passed`
- accepted / failure / total counts

If any status is false, the console must show the failed lane directly and must not hide it behind clean totals.

### 3. Per-capsule row review

Each capsule row should display:

- `lane`
- `sample_id`
- `manifest_validation_status`
- `relation_validation_status`
- `guard_validation_status`
- `preview_ref`
- `manifest_ref`
- `chain_refs`
- `failure_classes`
- `reviewer_action`

The row is an evidence index, not an asset reader. Preview refs are labels only in this design gate.

### 4. Failure relation review

For failure capsules, the operator checks:

- `resolved_by_accepted_sample`
- relation status
- failure tags
- final route

If relation status is missing, drifted, or unresolved, the row must require reviewer action before any future production flow.

### 5. Guard review

The operator confirms guard state before any future escalation:

- no production candidate
- no memory write
- no DailyNote write
- no runtime execution
- no provider/plugin/API
- no VCPChat/VCPToolBox read

Guard violations must be visible as blocking states even when registry totals are otherwise clean.

### 6. Reviewer action

The UI should map contract status to action labels:

- `accept_contract_baseline`: all contract statuses pass.
- `inspect_manifest_failure`: manifest status failed.
- `repair_relation_link`: relation status failed or missing.
- `block_production_guard_violation`: guard failed.
- `rerun_local_validator_outside_ui`: contract stale or missing validation timestamp.

These actions are instructions for local review, not executable buttons in this gate.

## Static Review Console contract

Review Console may display the product smoke flow using static mock data that mirrors `unified_capsule_contract_report`.

It must not:

- execute validators in the browser
- read `asset_archive/`
- load preview images
- write files
- call provider/plugin/API
- call DailyNote
- write VCP memory
- create or promote production candidates

## Future runtime handoff boundary

A future runtime implementation would require a separate authorization package naming:

- exact contract source
- exact allowed read path
- allowed file types
- UI process boundary
- IPC sender validation
- no direct renderer file writes
- no provider/plugin/API/DailyNote/VCP memory calls from renderer
- rollback and stop conditions

This design does not grant that authorization.

## Validation

This design is validated by local documentation and project validators only.

Required validation:

- `git diff --check`
- `node scripts\validate_agent_board_state.js`
- `powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1`

## Result

`unified_capsule_contract_report` now has a documented operator flow for a real product smoke review while preserving the current static, no-runtime boundary.
