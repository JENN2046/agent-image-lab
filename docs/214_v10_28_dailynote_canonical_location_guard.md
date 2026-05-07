# v10.28 DailyNote Canonical Location Guard

本文记录 Agent Image Lab v10.28 DailyNote canonical location guard。v10.25 暴露出一个重要问题：插件返回 `success` 并不等于 VCP canonical DailyNote 位置写入完成。v10.28 将后续 DailyNote/VCP memory 写入的成功判定改为三段式：writer root preflight、canonical location post-write check、content hash match。

本阶段只新增本地规则、schema example、Review Console handoff 和 validator；不读取外部配置，不重跑 DailyNoteWrite，不再次写 DailyNote/VCP memory，不调用插件/API，不创建图片，不执行 submitDraft，不执行 commit/tag/push/PR/release。

```yaml
status: completed_validated_local_guard
version: v10.28
current_phase: "v10.28 DailyNote canonical location guard"
validation_file: scripts/validate_v10_28_dailynote_canonical_location_guard.js
previous_phase: "v10.27 DailyNoteWrite root path correction"
guard_reason: "plugin success alone is insufficient for memory write completion"
```

## Success Definition

```yaml
success_definition:
  plugin_success_required: true
  plugin_success_sufficient: false
  writer_root_class_required_before_write: vcp_root_dailynote
  canonical_target_file_exists_required: true
  canonical_target_hash_match_required: true
  wrong_location_file_is_success: false
  wrong_location_requires_status: plugin_success_wrong_location
  wrong_location_repair_requires_new_authorization: true
```

## Pre-write Guard

```yaml
pre_write_guard:
  root_recomputation_required: true
  expected_root_class: vcp_root_dailynote
  expected_notebook: Image_Case_Archive
  output_location_must_be_canonical: true
  output_directory_must_exist_or_be_authorized_to_create: true
  overwrite_existing_files_allowed_default: false
  raw_config_value_recording_allowed: false
  raw_external_path_recording_allowed_in_git: false
```

## Post-write Guard

```yaml
post_write_guard:
  canonical_location_check_required: true
  canonical_file_hash_required: true
  source_payload_or_expected_content_hash_required: true
  wrong_plugin_local_location_check_required: true
  success_record_requires_canonical_location: true
  success_record_requires_hash_match: true
  success_record_requires_no_retry_unless_authorized: true
```

## Failure Handling

```yaml
failure_handling:
  if_plugin_success_but_wrong_location:
    status: plugin_success_wrong_location
    declare_vcp_memory_write_complete: false
    copy_or_move_allowed_without_authorization: false
    retry_allowed_without_authorization: false
    required_next_action: human-approved repair or new write authorization
  if_hash_mismatch:
    status: rejected_integrity_mismatch
    declare_vcp_memory_write_complete: false
    retry_allowed_without_authorization: false
```

## Boundary Confirmation

```yaml
boundary_confirmation:
  external_config_read_performed: false
  dailynotewrite_rerun_performed: false
  daily_note_write_performed_in_v10_28: false
  vcp_memory_write_performed_in_v10_28: false
  plugin_or_api_generation_called: false
  image_created_in_this_phase: false
  submitDraft_called: false
  raw_config_value_recorded: false
  raw_external_path_recorded: false
  secret_value_recorded: false
  commit_performed: false
  tag_performed: false
  push_performed: false
  pr_created: false
  release_created: false
```

## Next Gate

```yaml
next_gate:
  next_safe_action: local validation, docs closeout, or explicit new write authorization
  blocked_without_new_authorization:
    - DailyNoteWrite rerun
    - additional DailyNote write
    - additional VCP memory write
    - repair copy or move after wrong location
    - submitDraft
    - plugin/API generation
    - image creation
    - commit/tag/push/PR/release
```
