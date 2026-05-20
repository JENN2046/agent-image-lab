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

It supersedes the fake example path list below for future execution planning. It was filled from the existing v14.230 required target list after the user authorized Codex to find and scan paths.

```yaml
runs_restore_path_existence_verification_A5:
  authorization_state: filled_from_existing_docs_after_user_scan_authorization
  phase: runs_restore_path_existence_verification_A5
  target_repository: agent-image-lab
  target_branch: master
  purpose: verify only whether explicitly listed project-relative runs paths exist
  exact_allowed_project_relative_paths_under_runs_ref: reports/runs_path_existence_verification/20260520T092525Z_runs_path_existence_scan_report.json#exact_target_results
  exact_allowed_project_relative_paths_under_runs_count: 140
  exact_path_list_required_before_activation: satisfied_by_report_exact_target_results
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
    max_path_count: 140
    max_directory_depth_below_runs: 3
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
    project_relative_path: reports/runs_path_existence_verification/20260520T092525Z_runs_path_existence_scan_report.json
    overwrite_existing_allowed: false
    create_parent_directory_allowed: true
  latest_execution_result:
    report_path: reports/runs_path_existence_verification/20260520T092525Z_runs_path_existence_scan_report.json
    exact_path_count: 140
    exact_existing_count: 57
    exact_missing_count: 83
    matched_required_basename_count: 39
    scanned_file_count: 429
    scanned_directory_count: 292
    image_binary_read_performed: false
    hash_extraction_performed: false
    dimensions_extraction_performed: false
    preview_generation_performed: false
    runs_mutation_performed: false
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
  reviewer: Jenn
```

Any future rerun must explicitly keep image/hash/dimension/preview/runs-mutation permissions false unless a separate A5 package widens those permissions.

## Current A5 hash/dimensions verification package

This package was activated after the path-existence scan produced a bounded 14-image exact path list.

```yaml
asset_hash_dimensions_verification_A5:
  authorization_state: completed_validated
  source_report: reports/runs_path_existence_verification/20260520T092525Z_runs_path_existence_scan_report.json
  exact_allowed_paths_source: source_report.exact_target_results where existing=true and extension in [.png, .jpg, .jpeg, .webp]
  exact_allowed_path_count: 14
  max_file_count: 14
  output_report_path: reports/runs_asset_verification/2026-05-20_hash_dimensions_report.json
  validator_ref: scripts/validate_runs_asset_verification_report.js
  commit: ed00da4
  reviewer: Jenn
  allowed_operations_completed:
    - image_binary_read
    - sha256_hash_extraction
    - image_dimensions_extraction
    - image_format_and_mime_identification
  latest_execution_result:
    verified_file_count: 14
    failed_count: 0
    image_binary_read_performed: true
    hash_extraction_performed: true
    dimensions_extraction_performed: true
    preview_generation_performed: false
    runs_mutation_performed: false
    copy_move_delete_performed: false
    provider_contact_performed: false
    plugin_call_performed: false
    api_call_performed: false
    DailyNote_write_performed: false
    VCP_memory_write_performed: false
    production_candidate_write_performed: false
  validation:
    - node scripts/validate_runs_asset_verification_report.js reports/runs_asset_verification/2026-05-20_hash_dimensions_report.json
    - git diff --check
    - node scripts/validate_agent_board_state.js
    - powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
    - powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1
```

Follow-up archive work must use the report above as evidence. It must not reread source image binaries, recalculate hash/dimensions, copy originals, mutate `runs/`, or write production candidates unless a later package explicitly authorizes that exact action.

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
