# P6H Push Review Warning Fixes

## Status

```yaml
phase: p6h_push_review_warning_fixes
status: completed_validated_pending_guarded_local_commit
mode: A4.8_local_validator_hardening
source_review: quick_push_readiness_code_review
```

P6H fixes two non-blocking review warnings found before pushing the P5/P6 product-mainline batch.

## Fix 1: Failure Capsule Chain Binding

`scripts/validate_failure_sample_capsule_registry.js` now parses and validates:

- `failure_record.json`
- `review_record.json`
- record type
- `sample_id`
- failure route
- production / memory / DailyNote guards
- provider / plugin / API / image generation guards

The registry no longer treats chain files as valid merely because they exist. A mismatched `sample_id` is now classified as `chain_record_mismatch` and fails closed.

`scripts/validate_capsule_registry_report_v2.js` also carries `chain_record_mismatch` into the unified failure-class summary so report consumers can see the chain binding failure class.

## Fix 2: Transactional Failure Capsule Creation

`scripts/create_failure_sample_capsule.js` now creates a capsule under a temporary `.tmp-*` target inside `asset_archive/failure_samples/`, writes and validates the preview and JSON records there, then renames the completed directory into the final capsule path.

If creation fails before final placement, the temporary directory is removed. This prevents half-created final capsules from blocking future retries.

## Negative Coverage

`scripts/validate_failure_sample_capsule_registry_negative_cases.js` now includes a mismatched chain-record scenario:

```yaml
negative_case: mismatched_records
expected:
  - failure_record_sample_id_matches fails
  - review_record_sample_id_matches fails
  - chain_record_mismatch is reported
```

## Boundaries

This phase did not:

- create a third capsule
- mutate real capsule files
- create or convert `preview.webp`
- call provider / plugin / API
- generate images
- write DailyNote or VCP memory
- read runtime / real manifest / VCPChat / VCPToolBox
- create production candidates
- push, tag, release, or deploy

## Validation

Required validation:

```text
node --check scripts/create_failure_sample_capsule.js
node --check scripts/validate_failure_sample_capsule_registry.js
node --check scripts/validate_failure_sample_capsule_registry_negative_cases.js
node scripts/validate_failure_sample_capsule_registry.js --require-at-least=2
node scripts/validate_failure_sample_capsule_registry_negative_cases.js
node scripts/validate_failure_sample_capsule_creator_dry_run.js
node scripts/validate_capsule_registry_report_v2.js
node scripts/validate_agent_board_state.js
git diff --check
powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
```

## Next

After this fix, the batch should return to push safety gate or Review Console negative-state visibility design.
