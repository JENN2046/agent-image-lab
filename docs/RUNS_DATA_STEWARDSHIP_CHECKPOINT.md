# Runs Data Stewardship Checkpoint

```yaml
phase: runs_data_stewardship_checkpoint_gate
status: completed_validated
mode: A4.8 docs-light / no filesystem read
base_contract: AGENTS.md
```

## Sealed stack

```yaml
sealed_commits:
  - commit: 5408b9e
    title: docs: define runs backup restore protocol
    sealed_surface: docs/CAPSULE_RUNS_BACKUP_RESTORE_PROTOCOL.md
  - commit: ff5a934
    title: test: add runs backup manifest schema
    sealed_surface:
      - schemas/runs_backup_manifest.schema.yaml
      - tests/schema_examples/runs_backup_manifest.example.json
      - scripts/validate_runs_backup_manifest_schema.js
  - commit: c8a5193
    title: test: add runs restore report dry-run schema
    sealed_surface:
      - schemas/runs_restore_report.schema.yaml
      - tests/schema_examples/runs_restore_report.example.json
      - scripts/validate_runs_restore_report_dry_run_schema.js
```

## Current capability

```yaml
capability:
  backup_restore_protocol: sealed
  redacted_backup_manifest_schema: sealed
  user_reported_restore_report_schema: sealed
  fake_project_relative_examples_only: true
  mvp_validation_wired: true
  project_relative_runs_path_expectation: runs/
```

## What this stack can record

```yaml
can_record:
  - user-owned runs backup and restore naming policy
  - fake or user-reported project-relative runs/ paths
  - required manifest/report fields
  - forbidden sensitive or binary fields
  - later verification handoff requirements
```

## What this stack still cannot prove

```yaml
cannot_prove_without_future_authorization:
  - actual restored file existence
  - actual restored file count
  - image sha256
  - image dimensions
  - preview generation readiness
  - cloud-drive backup contents
```

## Future authorized verification conditions

```yaml
future_verification_requires:
  explicit_phase: runs_restore_verification_authorization_package
  exact_allowed_project_relative_paths_under_runs: required
  maximum_scan_scope: required
  allowed_read_types: required
  hash_extraction_allowed: explicit_boolean_required
  dimensions_extraction_allowed: explicit_boolean_required
  image_binary_read_allowed: explicit_boolean_required
  cloud_drive_read_write_allowed: false_by_default
  output_report_path: required
  reviewer: required
  stop_conditions:
    - path escapes runs/
    - absolute/private path appears
    - secret/token/customer data appears
    - image binary read not explicitly authorized
    - hash/dimensions extraction not explicitly authorized
    - preview generation requested
    - provider/plugin/API/memory/production path appears
```

## Boundary confirmation

```yaml
actual_runs_scan_performed: false
runs_mutation_performed: false
image_binary_read_performed: false
hash_extraction_performed: false
dimensions_extraction_performed: false
preview_generation_performed: false
cloud_drive_read_performed: false
cloud_drive_write_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
production_candidate_write_performed: false
```

## Next move decision

```yaml
selected_next_move: A_restore_verification_authorization_package_draft
reason: >-
  The protocol, redacted backup manifest schema, and user-reported restore report
  schema are now sealed. The next useful product move is to draft the exact
  authorization package that would allow a future verifier to inspect only
  explicitly named project-relative runs/ paths without widening into runtime,
  preview generation, cloud-drive operations, provider/API calls, memory writes,
  or production promotion.
not_selected:
  B_pause_and_audit_code_debt: useful later, but does not advance the runs stewardship handoff.
  C_return_to_capsule_product_core: useful later, but the current seam is the missing verification authorization package.
```
## Validation

```yaml
validated_now:
  - git diff --check
  - node scripts/validate_agent_board_state.js
  - powershell -ExecutionPolicy Bypass -File scripts\validate-agent-image-lab-local.ps1
status: passed_with_manual_review_warnings_only
```
