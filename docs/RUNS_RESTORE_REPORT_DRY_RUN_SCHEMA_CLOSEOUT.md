# Runs Restore Report Dry-Run Schema Closeout

```yaml
phase: runs_restore_report_dry_run_schema_gate
status: completed_validated
mode: A4.8 schema/docs only
base_contract: AGENTS.md
```

## Result

Defined a redacted, user-reported restore report contract for recording what the user says was restored under `runs/` without using the report as filesystem evidence.

## Added surfaces

```yaml
schema_ref: schemas/runs_restore_report.schema.yaml
example_ref: tests/schema_examples/runs_restore_report.example.json
validator_ref: scripts/validate_runs_restore_report_dry_run_schema.js
mvp_wiring: scripts/validate_mvp.ps1
```

## Required fields

```yaml
required_fields:
  - report_version
  - report_id
  - reported_at_local
  - reporter
  - restore_root_project_relative
  - restored_path_summary
  - restored_path_examples
  - user_reported_counts
  - verification_handoff
  - forbidden_fields
  - guard
```

## Forbidden fields

```yaml
forbidden_fields_must_be_null:
  - absolute_source_path
  - absolute_restore_path
  - cloud_drive_path
  - secret
  - token
  - cookie
  - password
  - api_key
  - provider_credential
  - raw_chat_history
  - customer_private_data
  - image_binary_inline
  - base64_image
  - extracted_sha256
  - extracted_width
  - extracted_height
  - preview_binary
  - production_candidate_path
```

## Boundary

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

## Later verification handoff

```yaml
later_verification_required: true
authorization_required_before_verification: true
allowed_future_verification:
  - project_relative_path_existence_check_after_authorization
  - hash_verification_after_separate_image_binary_read_authorization
  - dimensions_verification_after_separate_image_binary_read_authorization
```
## Validation

```yaml
validated_now:
  - node --check scripts/validate_runs_restore_report_dry_run_schema.js
  - node scripts/validate_runs_restore_report_dry_run_schema.js
  - git diff --check
  - powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
status: passed
```
