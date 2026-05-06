# VCPChat Local Main Sync Plan Contract

本文定义 v7.24 local main sync plan contract。它只规划本地 VCPChat `main` 如何安全对齐远端 squash merge 后的 `main`；不执行同步、不移动分支、不删除分支。

```yaml
contract:
  name: vcpchat_local_main_sync_plan
  version: v7.24-local-main-sync-plan-contract
  status: completed_validated_local_main_sync_plan
  source_record: docs/175_v7_23_vcpchat_review_console_post_merge_record.md
  target_repository_name: VCPChat
  current_local_branch: codex/image-lab-review-console-bridge
  local_main_head_short: 426a2a9
  local_origin_main_head_short_before_fetch: c97ff0c
  remote_main_head_short_observed_via_ls_remote: b320e39
  sync_strategy: backup_then_realign_local_main_to_origin_main
  backup_branch_required_before_main_realign: true
  preserve_feature_branch: true
  future_execution_requires_explicit_authorization: true
  local_main_sync_performed: false
  git_fetch_performed: false
  git_switch_performed: false
  branch_pointer_changed_by_this_phase: false
  branch_deleted: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_created: false
  github_release_performed: false
  next_safe_phase: "v7.25 VCPChat Local Main Sync Execution Preflight"
```
