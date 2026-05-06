# VCPChat Local Main Sync Execution Preflight Contract

本文定义 v7.25 local main sync execution preflight contract。它只记录同步执行前复查结果；不创建备份分支、不 fetch、不移动 main、不切换分支。

```yaml
contract:
  name: vcpchat_local_main_sync_execution_preflight
  version: v7.25-local-main-sync-execution-preflight-contract
  status: completed_validated_local_main_sync_execution_preflight
  source_record: docs/176_v7_24_vcpchat_local_main_sync_plan.md
  target_repository_name: VCPChat
  worktree_clean: true
  current_local_branch: codex/image-lab-review-console-bridge
  current_branch_is_main: false
  backup_branch_name: backup/vcpchat-main-before-review-console-sync-20260506
  backup_branch_exists: false
  local_main_head_short: 426a2a9
  local_origin_main_head_short_before_fetch: c97ff0c
  remote_main_head_short_observed_via_ls_remote: b320e39
  sync_execution_candidate: true
  sync_execution_ready: true
  local_main_sync_performed: false
  git_fetch_performed: false
  git_switch_performed: false
  branch_pointer_changed_by_this_phase: false
  backup_branch_created_by_this_phase: false
  branch_deleted: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_created: false
  github_release_performed: false
  next_safe_phase: "v7.26 VCPChat Local Main Sync Execution Record"
```
