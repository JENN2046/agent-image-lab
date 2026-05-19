# Capsule Runs Backup Manifest Schema Closeout

```yaml
phase: capsule_runs_backup_manifest_schema_gate
base_contract: AGENTS.md
mode: A4.8 schema/docs only
status: completed_validated
objective: define a redacted runs backup manifest schema and fake-path example without reading or mutating runs
schema_ref: schemas/runs_backup_manifest.schema.yaml
example_ref: tests/schema_examples/runs_backup_manifest.example.json
validator_ref: scripts/validate_runs_backup_manifest_schema.js
required_fields:
  - manifest_version
  - backup_id
  - created_at_local
  - source_project_relative_root
  - restore_target_project_relative_root
  - selected_path_list
  - hash_algorithm
  - dimensions_recording_policy
  - verification_authorization_required
  - cloud_drive_boundary
  - forbidden_fields
  - guard
forbidden_fields:
  - absolute_source_path
  - absolute_backup_path
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
  - preview_binary
non_authorization:
  actual_runs_scan: false
  runs_mutation: false
  image_binary_read: false
  real_image_hashing: false
  preview_generation: false
  cloud_drive_read_write: false
  provider_plugin_api: false
  DailyNote_or_VCP_memory: false
  production_candidate: false
```
## Validation

```yaml
validated_now:
  - node --check scripts/validate_runs_backup_manifest_schema.js
  - node scripts/validate_runs_backup_manifest_schema.js
  - git diff --check
status: passed
```
