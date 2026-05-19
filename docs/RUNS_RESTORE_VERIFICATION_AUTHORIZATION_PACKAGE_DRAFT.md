# Runs Restore Verification Authorization Package Draft

```yaml
phase: runs_restore_verification_authorization_package_draft_gate
status: completed_validated
mode: A4.8 docs-only / authorization draft only
base_contract: AGENTS.md
authorization_state: draft_not_active
```

## Purpose

This draft defines the exact fields required before any future restore verification can inspect user-owned `runs/` data.

It is not an active authorization. It does not permit a filesystem scan, image binary read, hash extraction, dimension extraction, preview generation, cloud-drive operation, provider/API call, memory write, or production promotion.

## Draft authorization package

```yaml
runs_restore_verification_authorization_package:
  authorization_state: draft_not_active
  phase: runs_restore_verification_authorization_package
  target_repository: agent-image-lab
  target_branch: master
  restore_report_source: tests/schema_examples/runs_restore_report.example.json
  exact_allowed_project_relative_paths_under_runs:
    - runs/example_restored_batch_001/fake_user_reported_artifact_001.png
    - runs/example_restored_batch_001/fake_user_reported_artifact_001.import_record.json
  path_policy:
    project_relative_only: true
    required_prefix: runs/
    absolute_paths_allowed: false
    parent_directory_escape_allowed: false
    wildcard_paths_allowed: false
    recursive_scan_allowed: false
  max_scan_scope:
    mode: listed_paths_only
    max_path_count: 2
    max_directory_depth_below_runs: 2
    directory_enumeration_allowed: false
    glob_expansion_allowed: false
  allowed_read_types:
    path_existence_metadata_check: false
    directory_entry_listing: false
    json_text_read: false
    image_binary_read: false
    sha256_hash_extraction: false
    image_dimensions_extraction: false
  explicit_booleans_required_before_execution:
    image_binary_read_allowed: false
    hash_extraction_allowed: false
    dimensions_extraction_allowed: false
  output_report_path:
    project_relative_path: reports/runs_restore_verification/runs_restore_verification_report.example.json
    overwrite_existing_allowed: false
    create_parent_directory_allowed: false
  reviewer: highest_commander
  validation_required_if_later_authorized:
    - confirm worktree clean before verification
    - confirm exact allowed paths are project-relative and under runs/
    - confirm no wildcard, recursive scan, or directory enumeration unless separately authorized
    - confirm every read type boolean remains explicit
    - write only the named output report path if separately authorized
  stop_conditions:
    - any allowed path is absolute
    - any allowed path does not start with runs/
    - any path contains .. or private local drive material
    - any wildcard or recursive scan is requested
    - any unlisted runs/ path is encountered
    - secret/token/cookie/password/api_key/provider credential appears
    - raw chat history or customer private data appears
    - image binary read is needed while image_binary_read_allowed is false
    - hash extraction is needed while hash_extraction_allowed is false
    - dimensions extraction is needed while dimensions_extraction_allowed is false
    - preview generation is requested
    - cloud-drive read/write is requested
    - provider/plugin/API call is requested
    - DailyNote or VCP memory write is requested
    - production candidate promotion is requested
```

## Activation requirements

```yaml
activation_requires_future_user_authorization:
  explicit_command: required
  exact_allowed_project_relative_paths_under_runs: required
  max_scan_scope: required
  allowed_read_types: required
  image_binary_read_allowed: explicit_boolean_required
  hash_extraction_allowed: explicit_boolean_required
  dimensions_extraction_allowed: explicit_boolean_required
  output_report_path: required
  reviewer: required
```

## Boundary confirmation for this draft

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
## Validation

```yaml
validated_now:
  - git diff --check
  - node scripts/validate_agent_board_state.js
  - powershell -ExecutionPolicy Bypass -File scripts\validate-agent-image-lab-local.ps1
status: passed_with_manual_review_warnings_only
```
