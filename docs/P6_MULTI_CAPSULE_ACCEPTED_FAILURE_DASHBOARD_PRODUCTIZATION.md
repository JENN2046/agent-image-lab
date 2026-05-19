# P6 Multi-Capsule Accepted / Failure Dashboard Productization

## Status

```yaml
phase: p6_multi_capsule_accepted_failure_dashboard_productization
status: completed_validated_pending_guarded_local_commit
mode: A4.8_safe_project_operator_rail
surface: review_console_static_prototype
accepted_capsule_count: 2
failure_capsule_count: 2
total_capsule_count: 4
```

P6 turns the existing Git-portable capsule evidence into a clearer static Review Console product surface. It does not create new capsules, does not generate or convert images, and does not read runtime systems.

## Static Dashboard Scope

The Review Console now exposes `multi_capsule_dashboard_state` from static mock / in-memory data only.

It summarizes:

- accepted capsule count: `2`
- failure capsule count: `2`
- total capsule count: `4`
- accepted sample ids:
  - `accepted_french_summer_rattan_bucket_bag_001`
  - `accepted_product_still_life_tennis_wallet_001`
- failure sample ids:
  - `failure_french_summer_rattan_bag_v7_29_001`
  - `failure_tennis_wallet_v7_21_001`
- clone-portable validation status
- registry validator status
- per-sample manifest / preview / chain refs
- accepted/failure resolved-by links

The old `runs/` source path is no longer required for portable validation. It can remain historical source evidence, but the portable product surface is the Git-tracked capsule under `asset_archive/`.

## Accepted / Failure Relation

The current side-by-side relation is:

```yaml
failure_sample_id: failure_french_summer_rattan_bag_v7_29_001
resolved_by_accepted_sample: accepted_french_summer_rattan_bucket_bag_001
relation_status: linked
failure_final_route: failure_learning_only_never_production
failure_never_production: true
accepted_is_reusable_positive_example: true
---
failure_sample_id: failure_tennis_wallet_v7_21_001
resolved_by_accepted_sample: accepted_product_still_life_tennis_wallet_001
relation_status: linked
failure_final_route: failure_learning_only_never_production
failure_never_production: true
accepted_is_reusable_positive_example: true
```

The failure capsule remains failure-learning evidence only. It must not become a production candidate. The accepted capsule is the reusable positive example for future visual memory and product workflow design.

## Failure Track Expansion Plan

P6 prepares the next failure sample track without creating the next failure capsule.

Future candidate selection should require:

- source failure has a review record
- source failure has meaningful failure tags
- source failure has or can justify a resolved accepted sample link
- preview can be produced with `long_edge=512` without provider contact or image generation
- target capsule path does not already exist

Future second failure capsule creation still requires a separate explicit authorization package naming:

- `sample_id`
- exact `source_image`
- exact target capsule root
- exact allowed write paths
- validation commands
- rollback plan
- stop conditions

## Unified Report Shape

Future accepted/failure registry reporting should converge on:

```yaml
report_version: accepted_failure_capsule_report_v1
total: <number>
passed: <number>
failed: <number>
per_sample_result:
  - lane: accepted | failure
    sample_id: <id>
    registry_validator_status: <status>
    clone_portable_validation_status: <status>
    manifest_ref: <path>
    preview_ref: <path>
    chain_refs: []
    resolved_by_accepted_sample: <id_or_null>
failure_class_summary:
  accepted_failed: <number>
  failure_failed: <number>
  missing_resolved_by_link: <number>
  production_or_memory_guard_violation: <number>
resolved_by_links:
  - failure_sample_id: <id>
    accepted_sample_id: <id>
    relation_status: linked | missing_accepted_capsule
```

Directory-as-registry remains sufficient for the current `accepted=2 / failure=2` state. A separate `registry.json` can be reconsidered after more capsules exist or after reporting needs exceed directory scanning.

## Hard Stops

P6 does not authorize:

- provider/plugin/API calls
- image generation
- `preview.webp` creation, copy, or conversion
- DailyNote or VCP memory writes
- runtime integration
- real manifest / VCPChat / VCPToolBox reads
- production candidate creation
- tag, release, deploy, or push
- moving or deleting `docs/archive` records

## Validation

Required validators:

```text
node scripts/validate_multi_capsule_dashboard.js
node scripts/validate_review_console_failure_capsule_snapshot.js
npm run validate-preview-capsule-registry
npm run validate-preview-capsule-negative-cases
node scripts/validate_failure_sample_capsule_registry.js --require-at-least=1
node scripts/validate_failure_sample_capsule_registry_negative_cases.js
node scripts/validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
```
