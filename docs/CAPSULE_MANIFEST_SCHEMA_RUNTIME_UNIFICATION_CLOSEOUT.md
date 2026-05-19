# Capsule Manifest Schema Runtime Unification Closeout

## Status

`completed_validated_pending_commit`.

## Objective

Bind `schemas/capsule_manifest_contract.schema.yaml` to the JavaScript capsule manifest validator so schema and runtime rules cannot silently drift.

## Changed behavior

- `scripts/lib/capsule_manifest_contract.js` now loads `schemas/capsule_manifest_contract.schema.yaml`.
- Runtime validation now reports:
  - `schema_ref`
  - `schema_runtime_binding_status`
  - `schema_runtime_binding_failures`
- Schema/runtime binding verifies:
  - accepted manifest type
  - failure manifest type
  - accepted chain keys
  - failure chain keys
  - fail-closed classes
  - common guard false fields
  - manifest-only guard false fields
  - accepted top-level false fields
  - failure top-level false fields
- `scripts/validate_capsule_manifest_schema_runtime_binding.js` proves schema drift fails closed with synthetic in-memory schema mutations.
- `scripts/validate_mvp.ps1` now runs the manifest contract validator and schema/runtime binding validator directly.

## Baseline preserved

- accepted capsules: `2`
- failure capsules: `2`
- total capsules: `4`

## Boundary

- No capsule creation.
- No image generation.
- No preview copy or conversion.
- No provider, plugin, or API call.
- No DailyNote or VCP memory write.
- No real manifest, VCPChat, or VCPToolBox read.
- No runtime integration.
- No production candidate.

## Validation

Pending final validation:

- `node --check scripts\lib\capsule_manifest_contract.js`
- `node --check scripts\validate_capsule_manifest_schema_runtime_binding.js`
- `node scripts\validate_capsule_manifest_contract.js`
- `node scripts\validate_capsule_manifest_schema_runtime_binding.js`
- `node scripts\validate_capsule_manifest_contract_negative_cases.js`
- `node scripts\validate_capsule_registry_report_v2.js`
- `git diff --check`
- `node scripts\validate_agent_board_state.js`
- `powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1`

## Recommended next

Run final local validation and prepare an exact-file commit readiness report. Do not push, tag, release, or deploy under this gate.
