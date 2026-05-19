# P5K Review Console Static Failure Capsule Display

```yaml
phase: p5k_review_console_static_failure_capsule_display
status: completed_validated_pending_guarded_local_commit
mode: A4.8_static_prototype_only
sample_id: failure_french_summer_rattan_bag_v7_29_001
capsule_root: asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/
```

## Purpose

Make the Review Console static prototype display the first Git-portable failure
sample preview capsule as in-memory mock evidence.

This is a display-only bridge from the portable failure capsule lane into the
static review desk. It does not load `preview.webp`, read `asset_archive/`,
fetch data, write files, call runtime, or promote anything to production.

## Displayed Evidence

```yaml
portable_failure_capsule:
  sample_id: failure_french_summer_rattan_bag_v7_29_001
  manifest_ref: asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/manifest.json
  preview_ref: asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/preview.webp
  failure_record_ref: asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/failure_record.json
  review_record_ref: asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/review_record.json
  preview:
    format: webp
    dimensions: 512x512
    long_edge: 512
    sha256: 8addc3084099c1f2aab11a27c7b730f475ced21f80fff0b2e67d877c49d8c43e
  clone_portable_validation_status: passed
  final_route: failure_learning_only_never_production
  resolved_by_accepted_sample: accepted_french_summer_rattan_bucket_bag_001
```

## UI Surface

- `Artifact Evidence` summary now shows accepted capsule count and failure
  capsule count.
- `Failure State` workbench now shows the portable failure capsule alongside the
  existing negative ReviewReport / adapter negative static records.
- `Draft Output` now carries:
  - `portable_failure_capsule_evidence`
  - `portable_failure_capsule_evidence_list`
  - `failure_state_static_workbench_state.portable_failure_capsule_records`

## Guard

```yaml
static_mock_only: true
in_memory_only: true
fetch_performed: false
file_write_performed: false
preview_loaded_or_rendered: false
asset_archive_read_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
runtime_execution_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
production_candidate_created: false
push_tag_release_deploy_performed: false
```

## Validation

Required validation for this stage:

```text
node --check review_console/static_prototype/app.js
node --check review_console/static_prototype/mock_data.js
node scripts/validate_v14_135_review_console_import_reader_safety_review.js
node scripts/validate_v14_227_review_console_failure_state_static_workbench.js
node scripts/validate_v14_228_review_console_failure_state_snapshot_static_regression.js
node scripts/validate_failure_sample_capsule_registry.js --require-at-least=1
node scripts/validate_failure_sample_capsule_registry_negative_cases.js
npm run validate-preview-capsule-registry
npm run validate-preview-capsule-negative-cases
node scripts/validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
git diff --check
```

## Next

The next product-mainline step can be a static Review Console capsule reader
snapshot validator, or the second lane can move toward multi-capsule accepted /
failure dashboard reporting. Push remains separately authorized only.
