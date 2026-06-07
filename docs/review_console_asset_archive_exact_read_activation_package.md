# Review Console Asset Archive Exact-read Activation Package

Status: activation package prepared, execution decision still required. This
document does not authorize or perform a real `asset_archive/` read.

This package turns the already sealed exact-read probe gate into an activation
packet shape. It keeps the actual read decision explicit and separate:

```yaml
read_execution_decision_state: undecided
actual_read_execution_authorized_now: false
can_execute_now: false
```

## Package Identity

```yaml
phase: review_console_asset_archive_exact_read_activation_package
package_status: prepared_execute_decision_required
package_type: exact_read_activation_package
source_probe_gate_ref: docs/review_console_asset_archive_exact_read_preview_probe_gate.md
source_probe_gate_fixture_ref: tests/schema_examples/ASSET_ARCHIVE_EXACT_READ_PREVIEW_PROBE_GATE.example.json
fixture_ref: tests/schema_examples/ASSET_ARCHIVE_EXACT_READ_ACTIVATION_PACKAGE.example.json
execution_mode: activation_package_no_read_execution
can_execute_now: false
actual_read_execution_authorized_now: false
read_execution_decision_state: undecided
```

## Exact Read Set

If the owner later chooses to execute the read-only probe, the execution must use
exactly these three repo-relative preview refs and their matching manifest refs:

```yaml
selected_preview_refs:
  - preview_ref: asset_archive/accepted_samples/accepted_french_summer_rattan_bucket_bag_001/preview.webp
    manifest_ref: asset_archive/accepted_samples/accepted_french_summer_rattan_bucket_bag_001/manifest.json
    lane: accepted
  - preview_ref: asset_archive/accepted_samples/accepted_product_still_life_tennis_wallet_001/preview.webp
    manifest_ref: asset_archive/accepted_samples/accepted_product_still_life_tennis_wallet_001/manifest.json
    lane: accepted
  - preview_ref: asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/preview.webp
    manifest_ref: asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/manifest.json
    lane: failure
```

The activation package does not verify these files exist. The refs remain
unread and unverified strings until an explicit execution decision is made.

## Future Execution Budget

```yaml
future_execution_budget:
  max_manifest_reads: 3
  max_preview_loads: 3
  max_directory_listings: 0
  max_original_asset_reads: 0
  max_writes_before_receipt: 0
  retry_allowed: false
  fallback_to_glob_allowed: false
  provider_plugin_api_allowed: false
```

Allowed operation if separately activated:

```yaml
allowed_operation_if_activated: read_selected_manifest_and_preview_refs_once
```

Forbidden even if the probe is activated:

- broad `asset_archive/**` reads
- directory listing
- original asset reads
- source image reads from `runs/`
- preview generation, copy, overwrite, delete, hash extraction, or dimension
  extraction
- provider/plugin/API/image generation
- DailyNote or VCP memory write
- production candidate write
- push, tag, release, deploy

## Receipt And Rollback

```yaml
receipt_plan:
  receipt_required_if_executed: true
  receipt_write_authorized_now: false
  planned_receipt_ref: reports/review_console_asset_archive_readonly_preview_probe/asset_archive_exact_read_preview_probe_receipt_20260607.json
  receipt_must_record:
    - selected refs repeated exactly
    - files read
    - missing refs
    - preview load outcome
    - guard flags
    - fallback decision

rollback_plan:
  no_persistent_state_before_execution: true
  if_executed_drop_in_memory_preview_overlay: true
  restore_css_skin_only_preview_display_fallback: true
  no_asset_archive_cleanup_needed_because_no_writes_allowed: true
```

The future receipt path is only a planned path. This package does not create it.

## Explicit Decision Required

Before any real read, the next user request must answer this exact question:

```text
Execute the exact-read preview probe now for the 3 selected refs, yes or no?
```

Only an explicit yes to that concrete question may open the read-only execution
step. Ambiguous continuation words do not execute this package.

## Validation

Local validation for this package:

```text
node --check scripts/validate_asset_archive_exact_read_activation_package.js
node --check scripts/validators/review_console/validate_asset_archive_exact_read_activation_package.js
node scripts/validate_asset_archive_exact_read_activation_package.js
```

The validator may read only this activation package, its fixture, the sealed
probe gate fixture, and its own source. It must not open, list, hash, inspect, or
load real `asset_archive/` contents.
