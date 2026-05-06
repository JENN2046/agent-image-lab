# v7.21 VCPChat Review Console Merge Authorization Preflight

本文记录 v7.21 VCPChat Review Console Merge Authorization Preflight。该阶段只在 Agent Image Lab 内记录 VCPChat PR #34 merge 前复查结果，并生成明确的 merge 授权门槛；不修改 VCPChat / VCPToolBox，不改变 PR 状态，不 merge，不调用插件、API、DailyNote，不写 VCP 记忆，不创建图片，不修改依赖，不发布 release。

```yaml
status: completed_validated_v7_21_vcpchat_merge_authorization_preflight
version: v7.21
current_phase: "v7.21 vcpchat review console merge authorization preflight"
validation_file: scripts/validate_v7_21_vcpchat_review_console_merge_authorization_preflight.js
current_head: b3dd2be
previous_phase: "v7.20 vcpchat review console review and ci response loop"
previous_record: docs/172_v7_20_vcpchat_review_console_review_ci_response_loop.md
default_next_phase: "v7.22 VCPChat Review Console Merge PR Execution"
merge_authorization_preflight_only: true
merge_performed_by_this_phase: false
release_performed_by_this_phase: false
```

## Merge Preflight Snapshot

```yaml
merge_preflight_snapshot:
  target_repository_name: VCPChat
  target_repository_ref: JENN2046/VCPChat
  pr_number: 34
  pr_title: "[codex] add Image Lab Review Console bridge"
  pr_url: "https://github.com/JENN2046/VCPChat/pull/34"
  pr_state: OPEN
  pr_is_draft: false
  mergeable_state: MERGEABLE
  review_decision: none_recorded
  reviews_total: 0
  latest_reviews_total: 0
  blocking_review_observed: false
  base_branch: main
  base_head_short: c97ff0c
  head_branch: codex/image-lab-review-console-bridge
  head_commit_short: 426a2a9
  vcpchat_local_branch_observed: codex/image-lab-review-console-bridge
  vcpchat_local_head_short: 426a2a9
```

## CI Confirmation

```yaml
ci_confirmation:
  status_checks_observed: true
  status_checks_total: 2
  status_checks_success: 2
  status_checks_failed: 0
  status_checks_pending: 0
  all_observed_checks_success: true
  observed_checks:
    - workflow_name: "VCPChat JS Smoke"
      check_name: "JS syntax and optional Photo Studio smoke"
      status: COMPLETED
      conclusion: SUCCESS
    - workflow_name: "VCPChat JS Smoke"
      check_name: "JS syntax and optional Photo Studio smoke"
      status: COMPLETED
      conclusion: SUCCESS
```

## Merge Readiness Decision

```yaml
merge_readiness_decision:
  merge_preflight_passed: true
  merge_candidate: true
  merge_authorization_ready: true
  reason_cn: "PR #34 当前为 OPEN、非 draft、MERGEABLE，head commit 仍为 426a2a9，已观察到的 2 个 GitHub checks 均为 SUCCESS，未观察到 review blocker。可以进入单独的 merge 授权点。"
  assumptions_cn:
    - "reviewDecision 为空时按未观察到阻塞性 review 记录处理；这不是人工代码审查结论。"
    - "如果仓库保护规则要求额外审批，merge 命令可能被 GitHub 拒绝。"
  must_reconfirm_before_merge:
    - PR 仍为 OPEN
    - PR 仍非 draft
    - head_commit_short 仍为 426a2a9
    - mergeable_state 仍为 MERGEABLE
    - observed checks 仍为 SUCCESS
    - 用户明确选择 merge 方式
```

## Merge Authorization Request

```yaml
merge_authorization_request:
  approval_required_before_merge: true
  target_action: merge_pr_34
  target_repository_name: VCPChat
  target_pr_number: 34
  allowed_merge_methods:
    - squash
    - merge
    - rebase
  recommended_merge_method: squash
  recommended_command_after_approval:
    - gh pr merge 34 --squash --delete-branch=false
  expected_after_success:
    pr_state: MERGED
    main_contains_review_console_bridge: true
    feature_branch_deletion_performed: false
  forbidden_without_separate_authorization:
    - delete_feature_branch
    - publish_release
    - tag_creation
    - modify_vcpchat_code
    - dependency_install_or_update
    - runtime_smoke_test_execution
  required_user_approval_phrase_cn: "我明确授权以 squash 方式 merge VCPChat PR #34，且不删除 feature branch。"
  broad_no_approval_preference_is_not_merge_authorization: true
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
  pr_merge_performed: false
  feature_branch_deleted: false
  vcpchat_code_modified_by_this_phase: false
  github_release_performed: false
```

## Stop Point

```yaml
stop_point:
  stop_here: true
  reason_cn: "merge 前复查通过，但 merge PR #34 是受保护远端动作，必须等待用户明确授权并指定 merge 方式。"
  next_safe_phase: "v7.22 VCPChat Review Console Merge PR Execution"
  merge_blocked_until_explicit_authorization: true
  release_blocked_until_explicit_authorization: true
```

## Acceptance Meaning

v7.21 表示 PR #34 已通过 merge authorization preflight：它当前为 `OPEN`、非 draft、`MERGEABLE`，checks 全绿，未观察到 review blocker。它不代表 PR 已 merge，不代表 feature branch 已删除，不代表已发布，也不代表运行时 smoke test 已执行。
