# Capsule Static Product Smoke Fixture Closeout

## Status

`completed_validated_pending_commit`.

## Objective

Create a checked-in fixture for `unified_capsule_contract_report` that represents the current accepted/failure capsule product smoke contract.

## Added fixture

- `tests/schema_examples/CAPSULE_STATIC_PRODUCT_SMOKE_UNIFIED_CONTRACT.example.json`

The fixture preserves:

- accepted: `2`
- failure: `2`
- total: `4`
- passed: `4`
- failed: `0`

It includes:

- four capsule rows
- per-row `reviewer_action`
- pass action label: `accept_contract_baseline`
- fail-closed labels:
  - `inspect_manifest_failure`
  - `repair_relation_link`
  - `block_production_guard_violation`
  - `rerun_local_validator_outside_ui`

## Added validator

- `scripts/validate_capsule_static_product_smoke_fixture.js`

The validator compares the fixture against local `scripts/validate_capsule_registry_report_v2.js` output and verifies:

- totals match
- sample ids match
- contract statuses match
- pass reviewer action is present
- fail-closed reviewer action labels are present
- static guard forbids browser runtime validator, UI asset reads, preview load, provider/plugin/API, image generation, DailyNote/VCP memory, runtime, VCPChat/VCPToolBox, production candidate, and push/tag/release/deploy.

## Boundary

- No browser runtime validator.
- No UI read from `asset_archive/`.
- No preview load.
- No provider/plugin/API.
- No image generation.
- No DailyNote/VCP memory.
- No production candidate.
- No VCPChat/VCPToolBox runtime.

## Validation

Pending final validation:

- `node --check scripts\validate_capsule_static_product_smoke_fixture.js`
- `node scripts\validate_capsule_static_product_smoke_fixture.js`
- `node scripts\validate_review_console_unified_capsule_contract.js`
- `git diff --check`
- `node scripts\validate_agent_board_state.js`
- `powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1`

## Result

The Review Console product smoke flow now has a checked-in static fixture that can be validated against the current capsule report outputs without adding UI runtime reads or execution paths.
