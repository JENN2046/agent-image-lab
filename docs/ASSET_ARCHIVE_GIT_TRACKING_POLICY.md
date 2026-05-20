# Asset Archive Git Tracking Policy

```yaml
phase: asset_archive_git_tracking_policy_gate
status: completed_validated_pending_commit
decision: track verified durable original assets in Git
scope: asset_archive/original_assets/by_sha256/
source_execution_report: reports/durable_archive_copy_execution/2026-05-20_durable_archive_copy_A5_execution_report.json
validator: scripts/validate_durable_archive_copy_execution_report.js
```

## Decision

The 14 durable original asset binaries copied by `durable_archive_copy_A5_execution` are allowed to enter Git because each target is named by `sha256`, mapped from an exact authorized source path, and verified by the execution report.

This is not a general image-file allowance. Images remain blocked everywhere else unless a later tracking policy names a similarly exact evidence chain.

## Required Conditions

- The file must be under `asset_archive/original_assets/by_sha256/`.
- The filename stem must match the expected `sha256`.
- The file must appear in `reports/durable_archive_copy_execution/2026-05-20_durable_archive_copy_A5_execution_report.json`.
- `scripts/validate_durable_archive_copy_execution_report.js` must pass.
- `runs_mutation_performed`, `preview_generation_performed`, `DailyNote_write_performed`, `VCP_memory_write_performed`, and `production_candidate_write_performed` must remain false.

## Still Forbidden

```yaml
runs_mutation: false
source_move_or_delete: false
overwrite: false
preview_generation: false
provider_plugin_api: false
DailyNote_or_VCP_memory: false
production_candidate: false
unverified_image_files: false
```
