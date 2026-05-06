# v7.25 VCPChat Local Main Sync Execution Preflight

本文记录 v7.25 VCPChat Local Main Sync Execution Preflight。该阶段只在 Agent Image Lab 内记录本地 VCPChat `main` 同步执行前的最终复查结果和候选命令；不修改 VCPChat / VCPToolBox，不执行 `git fetch`，不移动本地 `main`，不切换分支，不删除 feature branch，不调用插件、API、DailyNote，不写 VCP 记忆，不创建图片，不修改依赖，不发布 release。

```yaml
status: completed_validated_v7_25_vcpchat_local_main_sync_execution_preflight
version: v7.25
current_phase: "v7.25 vcpchat local main sync execution preflight"
validation_file: scripts/validate_v7_25_vcpchat_local_main_sync_execution_preflight.js
current_head: 3e9edfb
previous_phase: "v7.24 vcpchat local main sync plan"
previous_record: docs/176_v7_24_vcpchat_local_main_sync_plan.md
default_next_phase: "v7.26 VCPChat Local Main Sync Execution Record"
execution_preflight_only: true
local_main_sync_performed: false
branch_pointer_changed_by_this_phase: false
```

## Preflight Observations

```yaml
preflight_observations:
  target_repository_name: VCPChat
  worktree_clean: true
  current_local_branch: codex/image-lab-review-console-bridge
  current_local_head_short: 426a2a9
  current_branch_is_main: false
  backup_branch_name: backup/vcpchat-main-before-review-console-sync-20260506
  backup_branch_exists: false
  local_main_head_short: 426a2a9
  local_feature_branch_head_short: 426a2a9
  local_origin_main_head_short_before_fetch: c97ff0c
  local_origin_feature_branch_head_short: 426a2a9
  remote_main_head_short_observed_via_ls_remote: b320e39
  remote_feature_branch_head_short_observed_via_ls_remote: 426a2a9
  pr_34_state: MERGED
  pr_34_merge_commit_short: b320e39
```

## Preflight Decision

```yaml
preflight_decision:
  sync_execution_candidate: true
  sync_execution_ready: true
  reason_cn: "VCPChat 工作树干净，当前不在 main，本地 main 仍保留 direct commit 426a2a9，备份分支尚不存在，远端 main 已为 squash merge commit b320e39；可以进入一次性同步执行授权点。"
  required_before_execution:
    - "确认仍要保留 feature branch。"
    - "确认允许创建 backup branch。"
    - "确认允许 fetch origin main 和 feature branch。"
    - "确认允许将本地 main 指针显式对齐 origin/main。"
    - "确认允许切换到 main。"
```

## Candidate Commands After Explicit Authorization

```yaml
candidate_commands_after_explicit_authorization:
  allowed_commands_in_order:
    - git branch backup/vcpchat-main-before-review-console-sync-20260506 main
    - git fetch origin main codex/image-lab-review-console-bridge
    - git rev-parse --short origin/main
    - git branch -f main origin/main
    - git switch main
    - git status --short --branch
    - git rev-parse --short HEAD
  expected_after_success:
    local_main_head_short: b320e39
    current_local_branch: main
    backup_branch_exists: true
    feature_branch_still_exists: true
    local_main_sync_status_after_success: completed
```

## Stop Conditions

```yaml
stop_conditions:
  stop_if_worktree_dirty: true
  stop_if_current_branch_is_main_before_backup: true
  stop_if_backup_branch_exists: true
  stop_if_remote_main_not_b320e39: true
  stop_if_feature_branch_missing: true
  stop_if_origin_main_after_fetch_not_b320e39: true
  stop_if_backup_branch_creation_fails: true
  stop_if_branch_force_update_would_target_current_branch: true
  stop_if_any_command_requests_force_push_or_reset_hard: true
```

## Prohibited Actions

```yaml
prohibited_actions:
  delete_feature_branch: true
  delete_backup_branch: true
  git_reset_hard: true
  git_clean: true
  force_push: true
  dependency_install_or_update: true
  read_env_or_secret_files: true
  runtime_smoke_test_execution: true
  github_release: true
```

## Side Effect Guard

```yaml
side_effect_guard:
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_created: false
  dependency_changed: false
  package_manifest_changed: false
  lockfile_changed: false
  env_or_secret_file_read: false
  secret_value_copied: false
  raw_local_path_saved: false
  local_main_sync_performed: false
  git_fetch_performed: false
  git_switch_performed: false
  git_pull_performed: false
  branch_pointer_changed_by_this_phase: false
  backup_branch_created_by_this_phase: false
  branch_deleted: false
  github_release_performed: false
```

## Stop Point

```yaml
stop_point:
  stop_here: true
  reason_cn: "本地 main 同步执行前复查通过，但创建备份分支、fetch、移动本地 main 指针和切换分支仍是 VCPChat 本地仓库状态修改，必须等待下一阶段执行授权。"
  next_safe_phase: "v7.26 VCPChat Local Main Sync Execution Record"
  local_main_sync_blocked_until_explicit_execution_authorization: true
```

## Acceptance Meaning

v7.25 表示本地 VCPChat `main` 同步的执行前复查通过，并且候选命令顺序已固定。它不代表已经创建备份分支，不代表已经 fetch，不代表本地 `main` 已对齐远端 `main`，也不代表已运行 smoke test 或发布 release。
