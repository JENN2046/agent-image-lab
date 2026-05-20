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

## Current minimal A5 path-existence package

This is the current next-phase package for `capsule_product_core_autonomous_hardening_train_v3`.

It supersedes the fake example path list below for future execution planning. It is still inactive because no exact real `runs/` paths have been supplied by the user in this turn.

```yaml
runs_restore_path_existence_verification_A5:
  authorization_state: draft_inactive_not_executable
  phase: runs_restore_path_existence_verification_A5
  target_repository: agent-image-lab
  target_branch: master
  purpose: verify only whether explicitly listed project-relative runs paths exist
  exact_allowed_project_relative_paths_under_runs: []
  exact_path_list_required_before_activation: true
  path_policy:
    project_relative_only: true
    required_prefix: runs/
    absolute_paths_allowed: false
    parent_directory_escape_allowed: false
    wildcard_paths_allowed: false
    recursive_scan_allowed: false
    directory_enumeration_allowed: false
    glob_expansion_allowed: false
  max_scan_scope:
    mode: listed_paths_only
    max_path_count: "<TO_BE_FILLED_BY_USER>"
    max_directory_depth_below_runs: "<TO_BE_FILLED_BY_USER>"
    unlisted_path_access_allowed: false
  allowed_operations_after_explicit_activation:
    - path_existence_metadata_check_for_exact_listed_paths_only
    - write_named_json_report_only
  forbidden_operations:
    - directory_tree_scan
    - wildcard_or_glob_expansion
    - image_binary_read
    - json_text_read_unless_separately_authorized
    - sha256_hash_extraction
    - image_dimensions_extraction
    - preview_generation
    - runs_mutation
    - source_image_copy
    - cloud_drive_read
    - cloud_drive_write
    - provider_contact
    - plugin_call
    - api_call
    - DailyNote_write
    - VCP_memory_write
    - production_candidate_write
    - dependency_change
    - git_add_dot
    - force_push_or_history_rewrite
    - tag_release_deploy
  explicit_booleans_required_before_execution:
    path_existence_metadata_check_allowed: true
    image_binary_read_allowed: false
    hash_extraction_allowed: false
    dimensions_extraction_allowed: false
    preview_generation_allowed: false
    runs_mutation_allowed: false
  output_report_path:
    project_relative_path: "<TO_BE_FILLED_BY_USER_UNDER_reports/runs_path_existence_verification/>"
    overwrite_existing_allowed: false
    create_parent_directory_allowed: true_after_explicit_activation_only
  validation_required_if_later_authorized:
    - git status --short --branch
    - confirm exact allowed paths are project-relative and under runs/
    - confirm no wildcard, recursive scan, directory enumeration, or glob expansion
    - confirm image/hash/dimension/preview/runs-mutation booleans remain false
    - write only the named output report path
    - node scripts/validate_agent_board_state.js
    - powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
    - powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1
  stop_conditions:
    - exact path list is empty
    - max_path_count is missing
    - output report path is missing
    - any allowed path is absolute
    - any allowed path does not start with runs/
    - any path contains .. or private local drive material
    - any wildcard or recursive scan is requested
    - any unlisted runs/ path must be inspected
    - image binary read is needed
    - hash extraction is needed
    - dimensions extraction is needed
    - preview generation is requested
    - cloud-drive read/write is requested
    - provider/plugin/API call is requested
    - DailyNote or VCP memory write is requested
    - production candidate promotion is requested
  reviewer: "<TO_BE_FILLED_BY_USER>"
```

Activation requires a future user message that supplies the exact path list, maximum path count, output report path, reviewer, and explicitly keeps image/hash/dimension/preview/runs-mutation permissions false.

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
