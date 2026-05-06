# v7.18 VCPChat Review Console Ready-for-review Authorization Gate

本文记录 v7.18 VCPChat Review Console Ready-for-review Authorization Gate。该阶段只在 Agent Image Lab 内整理将 VCPChat PR #34 从 draft 转为 ready-for-review 的前置门槛和授权请求；不修改 VCPChat / VCPToolBox，不改变 PR 状态，不 merge，不调用插件、API、DailyNote，不写 VCP 记忆，不创建图片，不修改依赖。

```yaml
status: completed_validated_v7_18_vcpchat_ready_for_review_authorization_gate
version: v7.18
current_phase: "v7.18 vcpchat review console ready-for-review authorization gate"
validation_file: scripts/validate_v7_18_vcpchat_review_console_ready_for_review_authorization_gate.js
current_head: 2aea837
previous_phase: "v7.17 vcpchat review console pr review follow-up"
previous_record: docs/169_v7_17_vcpchat_review_console_pr_review_follow_up.md
default_next_phase: "v7.19 VCPChat Review Console Ready-for-review Execution Record"
ready_for_review_authorization_gate_only: true
pr_state_changed_by_this_phase: false
pr_ready_for_review_performed: false
pr_merge_not_performed: true
```

## Current PR Gate Inputs

```yaml
current_pr_gate_inputs:
  target_repository_name: VCPChat
  target_repository_ref: JENN2046/VCPChat
  pr_number: 34
  pr_title: "[codex] add Image Lab Review Console bridge"
  pr_url: "https://github.com/JENN2046/VCPChat/pull/34"
  pr_state: OPEN
  pr_is_draft: true
  review_decision: none_recorded
  mergeable_state: MERGEABLE
  base_branch: main
  base_head_short: c97ff0c
  head_branch: codex/image-lab-review-console-bridge
  head_commit_short: 426a2a9
  status_checks_total: 2
  status_checks_success: 2
  status_checks_failed: 0
  status_checks_pending: 0
  all_observed_checks_success: true
```

## Authorization Request

```yaml
ready_for_review_authorization_request:
  approval_required_before_remote_pr_state_change: true
  target_action: mark_pr_ready_for_review
  target_pr_number: 34
  allowed_command_after_approval:
    - gh pr ready 34
  expected_before_action:
    pr_state: OPEN
    pr_is_draft: true
    head_commit_short: 426a2a9
    mergeable_state: MERGEABLE
  expected_after_action:
    pr_state: OPEN
    pr_is_draft: false
    pr_merge_performed: false
  forbidden_actions:
    - gh pr merge 34
    - gh pr close 34
    - git push --force
    - git push --force-with-lease
    - modify_vcpchat_code
    - publish_release
    - tag_creation
    - dependency_install_or_update
  required_user_approval_phrase_cn: "我明确授权将 VCPChat PR #34 转为 ready-for-review。"
  broad_no_approval_preference_is_not_merge_authorization: true
```

## Readiness Rationale

```yaml
readiness_rationale:
  ready_for_review_candidate: true
  reason_cn: "PR #34 当前仍为 draft，目标分支为 main，head commit 为 426a2a9，mergeable 状态为 MERGEABLE，已观察到的 2 个 GitHub checks 均为 SUCCESS。"
  known_blockers:
    - "尚未执行 ready-for-review 远端状态切换。"
    - "尚未进入正式 review / merge。"
  non_blockers:
    - "直接推 main 被保护分支拒绝，PR 流程已建立。"
    - "PR scope 仍限于已授权的五个 Review Console bridge 文件。"
```

## Scope Carried Forward

```yaml
scope_carried_forward:
  candidate_commit: 426a2a9
  changed_files_only_inside_allowed_scope: true
  changed_files:
    - main.js
    - modules/ipc/imageLabReviewHandlers.js
    - preloads/chat.js
    - main.html
    - modules/renderer/imageLabReviewMount.js
  files_explicitly_not_modified:
    - renderer.js
    - preloads/shared/apiFactory.js
    - preloads/shared/catalog.js
    - preloads/shared/roles.js
    - package.json
    - package-lock.json
    - config.env
    - .env
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
  pr_state_changed_by_this_phase: false
  pr_ready_for_review_performed: false
  pr_merge_performed: false
  github_release_performed: false
```

## Stop Point

```yaml
stop_point:
  stop_here: true
  reason_cn: "ready-for-review 门槛已整理完成，但 PR 远端状态切换必须作为独立动作执行并记录。"
  next_safe_phase: "v7.19 VCPChat Review Console Ready-for-review Execution Record"
  pr_ready_for_review_blocked_until_action: true
  pr_merge_blocked_until_separate_authorization: true
```

## Acceptance Meaning

v7.18 表示 PR #34 已具备转 ready-for-review 的前置条件，并且唯一允许的后续远端状态切换动作是 `gh pr ready 34`。它不代表 PR 已转 ready，不代表已 review，不代表已 merge，也不代表发布完成。
