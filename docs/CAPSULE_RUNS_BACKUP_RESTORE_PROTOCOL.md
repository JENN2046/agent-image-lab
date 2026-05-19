# Capsule Runs Backup / Restore Protocol

```yaml
phase: capsule_runs_backup_restore_protocol_gate
base_contract: AGENTS.md
mode: A4.8 docs/protocol only
status: completed_validated
objective: define how user-owned runs data is backed up, named, restored, and checked without mutating runs
ownership:
  runs_owner: user
  codex_may_mutate_runs_by_default: false
  codex_may_read_image_binaries_by_default: false
path_contract:
  canonical_project_relative_root: runs/
  path_style: project_relative_first
  absolute_paths_allowed_in_protocol: false
  restored_paths_must_remain_under_runs: true
backup_naming:
  recommended_root: user_controlled_cloud_drive_or_external_backup
  recommended_folder_pattern: agent-image-lab-runs-backup-YYYYMMDD-HHMMSS
  recommended_manifest_name: runs_backup_manifest.json
  required_manifest_fields:
    - backup_id
    - created_at_local
    - source_project_relative_root
    - restore_target_project_relative_root
    - file_count
    - directory_count
    - selected_path_list
    - hash_algorithm
    - dimensions_recording_policy
    - operator_notes
restore_protocol:
  default_restore_mode: user_performed_manual_restore
  codex_restore_execution_allowed: false_without_separate_authorization
  restore_target: runs/
  overwrite_existing_runs_allowed: false_without_explicit_authorization
  delete_or_clean_runs_allowed: false
  partial_restore_allowed: true_with_manifest_note
hash_dimensions_handoff:
  hash_algorithm: sha256
  dimensions_policy: record_width_height_for_image_artifacts_when_operator_has_authorized_binary_read
  this_phase_hashing_performed: false
  this_phase_dimensions_read_performed: false
  verification_record_should_include:
    - project_relative_path
    - sha256
    - width_px
    - height_px
    - mime_or_extension
    - source_backup_id
    - verification_tool
    - verification_time
cloud_drive_boundary:
  cloud_drive_backup_allowed_as_user_manual_action: true
  codex_cloud_drive_write_allowed: false_without_separate_authorization
  codex_cloud_drive_read_allowed: false_without_separate_authorization
  secrets_or_tokens_in_backup_manifest_allowed: false
  customer_private_data_review_required_before_external_share: true
handoff_states:
  backup_needed: user decides whether to create or refresh cloud backup
  backup_recorded: manifest exists and is reviewed without exposing secrets
  restore_needed: user decides exact restore set
  restore_completed_by_user: user reports restored files/directories
  local_verification_requested: separate authorization required before Codex reads image binaries or hashes them
hard_boundaries:
  runs_mutation_performed: false
  image_binary_read_performed: false
  preview_generation_performed: false
  provider_plugin_api_performed: false
  DailyNote_or_VCP_memory_write_performed: false
  production_candidate_write_performed: false
  push_tag_release_deploy_performed: false
validated_now: git diff --check; node scripts/validate_agent_board_state.js; powershell -ExecutionPolicy Bypass -File scripts\\validate-agent-image-lab-local.ps1
recommended_next_phase:
  phase: capsule_runs_backup_manifest_schema_gate
  mode: A4.8 schema/docs only
  objective: define a checked-in example schema for a redacted runs backup manifest without reading or mutating runs data.
```

## Operator checklist

1. Keep `runs/` as user-owned restored data unless a later gate grants exact read/write authority.
2. Prefer project-relative paths in all records, for example `runs/<batch>/<artifact>`.
3. Create cloud-drive backups manually outside Codex unless a separate cloud-drive authorization names the target and action.
4. Do not include secrets, tokens, cookies, provider credentials, private chat logs, or customer-private material in backup manifests.
5. Record hashes and dimensions only after a separate verification authorization permits image binary reads.
6. Never overwrite or clean existing `runs/` during restore without an explicit exact-path authorization package.
7. Treat restore reports as handoff evidence, not proof of production readiness.

## Non-authorization statement

This protocol does not authorize Codex to read image binaries, hash files, inspect restored images, mutate `runs/`, generate previews, call providers/plugins/APIs, write DailyNote/VCP memory, promote production candidates, or push/tag/release/deploy.
