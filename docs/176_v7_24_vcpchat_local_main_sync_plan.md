# v7.24 VCPChat Local Main Sync Plan

本文记录 v7.24 VCPChat Local Main Sync Plan。该阶段只在 Agent Image Lab 内规划如何安全同步本地 VCPChat `main` 到远端 squash merge 后的 `main`；不修改 VCPChat / VCPToolBox，不执行 `git fetch`、`git switch`、`git pull`、`git branch -f`、`git reset`，不删除 feature branch，不调用插件、API、DailyNote，不写 VCP 记忆，不创建图片，不修改依赖，不发布 release。

```yaml
status: completed_validated_v7_24_vcpchat_local_main_sync_plan
version: v7.24
current_phase: "v7.24 vcpchat local main sync plan"
validation_file: scripts/validate_v7_24_vcpchat_local_main_sync_plan.js
current_head: ae7e5d6
previous_phase: "v7.23 vcpchat review console post-merge record"
previous_record: docs/175_v7_23_vcpchat_review_console_post_merge_record.md
default_next_phase: "v7.25 VCPChat Local Main Sync Execution Preflight"
local_main_sync_plan_only: true
local_main_sync_performed: false
branch_pointer_changed_by_this_phase: false
```

## Current Sync Problem

```yaml
current_sync_problem:
  target_repository_name: VCPChat
  current_local_branch: codex/image-lab-review-console-bridge
  current_local_head_short: 426a2a9
  local_main_head_short: 426a2a9
  local_origin_main_head_short_before_fetch: c97ff0c
  remote_main_head_short_observed_via_ls_remote: b320e39
  remote_feature_branch_head_short_observed_via_ls_remote: 426a2a9
  pr_34_state: MERGED
  merge_method: squash
  reason_sync_is_not_simple_fast_forward_cn: "本地 main 指向 PR 源 commit 426a2a9，远端 main 指向 squash merge commit b320e39。两者包含同一组变更意图，但提交身份不同，因此后续同步需要先备份本地 main，再显式把 main 指向远端 main。"
```

## Recommended Safe Sync Strategy

```yaml
recommended_safe_sync_strategy:
  strategy_name: backup_then_realign_local_main_to_origin_main
  destructive_sync_allowed_by_this_phase: false
  future_execution_requires_explicit_authorization: true
  preserve_direct_commit_before_realignment: true
  preserve_feature_branch: true
  expected_safe_order:
    - "确认 VCPChat 工作树干净，且当前不在 main 上。"
    - "从当前本地 main 创建备份分支，例如 backup/vcpchat-main-before-review-console-sync-20260506。"
    - "执行 git fetch origin main codex/image-lab-review-console-bridge，只更新远端 tracking refs。"
    - "确认 origin/main 更新为 b320e39，feature branch 仍为 426a2a9。"
    - "在仍不位于 main 的情况下，将本地 main 指针显式对齐 origin/main。"
    - "切换到 main，并确认本地 main 为 b320e39。"
    - "保留 feature branch 和 backup branch，直到 runtime smoke test 和发布决策完成。"
```

## Future Commands For Explicit Authorization

```yaml
future_commands_for_explicit_authorization:
  preflight_read_only_commands:
    - git status --short --branch
    - git branch --show-current
    - git show-ref --abbrev refs/heads/main refs/remotes/origin/main refs/heads/codex/image-lab-review-console-bridge refs/remotes/origin/codex/image-lab-review-console-bridge
    - git ls-remote --heads origin main codex/image-lab-review-console-bridge
  candidate_sync_commands_after_authorization:
    - git branch backup/vcpchat-main-before-review-console-sync-20260506 main
    - git fetch origin main codex/image-lab-review-console-bridge
    - git branch -f main origin/main
    - git switch main
  commands_not_recommended:
    - git pull --ff-only
  reason_not_recommended_cn: "fetch 后本地 main 与 origin/main 预期会表现为 squash merge 后的分叉；直接 pull --ff-only 很可能失败，非 fast-forward merge/rebase 又会把本地 direct commit 与 squash commit 混在一起。"
```

## Stop Conditions

```yaml
stop_conditions:
  stop_if_worktree_dirty: true
  stop_if_current_branch_is_main_before_backup: true
  stop_if_backup_branch_already_exists: true
  stop_if_remote_main_not_b320e39: true
  stop_if_feature_branch_missing: true
  stop_if_origin_main_after_fetch_not_b320e39: true
  stop_if_any_secret_or_env_file_would_be_read: true
  stop_if_command_requires_force_push_or_reset_hard: true
```

## Rollback and Recovery Plan

```yaml
rollback_and_recovery_plan:
  backup_branch_required_before_main_realign: true
  backup_branch_name_example: backup/vcpchat-main-before-review-console-sync-20260506
  recover_local_main_from_backup_if_needed:
    - git branch -f main backup/vcpchat-main-before-review-console-sync-20260506
  destructive_rollback_allowed: false
  force_push_allowed: false
  delete_branch_allowed_by_this_phase: false
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
  branch_deleted: false
  github_release_performed: false
```

## Acceptance Meaning

v7.24 表示本地 VCPChat `main` 同步问题已经被拆解成可授权、可回滚的执行方案。它不代表已经同步本地 `main`，不代表执行了 fetch / branch realignment / switch，也不代表已运行 runtime smoke test 或发布 release。
