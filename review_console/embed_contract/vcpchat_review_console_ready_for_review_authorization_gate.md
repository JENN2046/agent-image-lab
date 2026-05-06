# VCPChat Review Console Ready-for-review Authorization Gate Contract

本文定义 v7.18 ready-for-review authorization gate contract。它只整理 VCPChat PR #34 从 draft 转 ready-for-review 的授权门槛；不改变 PR 状态，不 merge，不修改真实 VCPChat / VCPToolBox。

```yaml
contract:
  name: vcpchat_review_console_ready_for_review_authorization_gate
  version: v7.18-ready-for-review-authorization-gate-contract
  status: completed_validated_ready_for_review_authorization_gate
  source_record: docs/169_v7_17_vcpchat_review_console_pr_review_follow_up.md
  target_repository_name: VCPChat
  target_repository_ref: JENN2046/VCPChat
  pr_number: 34
  pr_title: "[codex] add Image Lab Review Console bridge"
  pr_url: "https://github.com/JENN2046/VCPChat/pull/34"
  pr_state: OPEN
  pr_is_draft: true
  mergeable_state: MERGEABLE
  status_checks_success: 2
  ready_for_review_candidate: true
  ready_for_review_authorization_request_ready: true
  allowed_command_after_approval:
    - gh pr ready 34
  pr_state_changed_by_this_phase: false
  pr_ready_for_review_performed: false
  pr_merge_performed: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_created: false
  dependency_changed: false
  next_safe_phase: "v7.19 VCPChat Review Console Ready-for-review Execution Record"
```
