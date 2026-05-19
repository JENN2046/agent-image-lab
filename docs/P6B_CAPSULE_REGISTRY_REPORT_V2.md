# P6B Capsule Registry Report v2

## Status

```yaml
phase: p6b_capsule_registry_report_v2
status: completed_validated_pending_guarded_local_commit
mode: A4.8_local_validator
validator: scripts/validate_capsule_registry_report_v2.js
fixture: tests/schema_examples/P6B_CAPSULE_REGISTRY_REPORT_V2.example.json
```

P6B promotes the P6 static `future_registry_report_shape` into a real local validator output. It combines the accepted preview capsule registry and failure sample capsule registry into one accepted/failure report.

## Report Scope

The report uses only Git-tracked capsule files under:

```text
asset_archive/accepted_samples/<sample_id>/
asset_archive/failure_samples/<sample_id>/
```

It does not use old `runs/` source images for portable validation.

Current counts:

```yaml
accepted: 2
failure: 1
total: 3
passed: 3
failed: 0
```

## Formal Output

The validator outputs:

```yaml
phase: p6b_capsule_registry_report_v2
report_version: accepted_failure_capsule_registry_report_v2
status: accepted_failure_capsule_registry_report_v2_verified
totals:
  accepted: 2
  failure: 1
  total: 3
  passed: 3
  failed: 0
per_sample_results:
  - lane: accepted | failure
    sample_id: <id>
    passed: true | false
    registry_validator_status: <status>
    portable_validation_status: passed | failed
    manifest_ref: <path>
    preview_ref: <path>
    chain_refs: []
    resolved_by_accepted_sample: <id_or_null>
    failure_tags: []
    failure_classes: []
resolved_by_links:
  - failure_sample_id: failure_french_summer_rattan_bag_v7_29_001
    accepted_sample_id: accepted_french_summer_rattan_bucket_bag_001
    relation_status: linked
failure_class_summary:
  accepted_failed: 0
  failure_failed: 0
  missing_resolved_by_link: 0
  production_or_memory_guard_violation: 0
```

## Validator Composition

`scripts/validate_capsule_registry_report_v2.js` runs:

```text
node scripts/validate_preview_capsule_registry.js
node scripts/validate_failure_sample_capsule_registry.js --require-at-least=1
```

Then it enriches the combined report with:

- accepted/failure lane
- manifest / preview refs
- chain refs
- failure tags
- `resolved_by_accepted_sample`
- relation status
- unified failure class summary

## Boundaries

P6B does not authorize:

- provider/plugin/API calls
- image generation
- preview creation, copy, or conversion
- accepted/failure capsule mutation
- DailyNote or VCP memory writes
- runtime integration
- real manifest / VCPChat / VCPToolBox reads
- production candidate creation
- push, tag, release, or deploy

## Next

The next useful local step is either:

- expose this report in the Review Console dashboard as `registry_report_v2_state`, or
- prepare the second failure capsule authorization package.
