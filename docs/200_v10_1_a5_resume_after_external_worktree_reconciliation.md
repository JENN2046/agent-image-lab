# v10.1 A5 Resume After External Worktree Reconciliation

本文记录 Agent Image Lab v10.1 A5 resume after external worktree reconciliation。该阶段只在仓库内固化 A5 被外部目标工作树阻断后的恢复条件、重新预检顺序和停止边界；它不重新读取外部 VCPChat / VCPToolBox 源码，不调用 bridge 方法，不调用插件/API/DailyNote，不写 VCP memory，不创建图片，不 commit/tag/push/PR/release。

用户已明确表示会处理外部工作树干净问题，并随后报告外部目标工作树已经干净。本阶段因此只准备本仓库内的接续材料：下一次 A5 恢复必须先重新执行 preflight，而不是从上一次 blocked 状态直接跳到真实生产步骤。

```yaml
status: local_validated_v10_1_a5_resume_after_external_worktree_reconciliation
version: v10.1
current_phase: "v10.1 A5 resume after external worktree reconciliation"
validation_file: scripts/validate_v10_1_a5_resume_after_external_worktree_reconciliation.js
previous_phase: "v10.0 A5 end-to-end activation package readiness"
previous_record: docs/199_v10_0_a5_end_to_end_activation_package_readiness.md
default_next_phase: "rerun A5 preflight after external worktree reconciliation"
```

## Resume State

```yaml
a5_resume_state:
  active_a5_authorization_package_present: true
  user_will_reconcile_external_worktrees: true
  user_reported_external_worktrees_clean: true
  external_worktree_reconciliation_performed_by_this_phase: false
  external_worktree_recheck_performed_by_this_phase: false
  a5_resume_ready: false
  a5_execution_started: false
  a5_preflight_rerun_required: true
  previous_a5_preflight_blocked: true
  real_vcpchat_root_provided: true
  real_vcptoolbox_root_provided: true
  raw_real_paths_recorded_in_git: false
  external_target_worktrees_clean_last_observed: false
  external_target_worktrees_clean_current: not_rechecked_by_this_phase
  vcpchat_worktree_clean_current: not_rechecked_by_this_phase
  vcptoolbox_worktree_clean_current: not_rechecked_by_this_phase
  production_actions_blocked: true
```

## Required Recheck Before Resume

```yaml
required_recheck_before_resume:
  - confirm_agent_image_lab_branch_and_worktree
  - fetch_remote_and_check_target_branch
  - confirm_working_branch_still_valid
  - confirm_tag_absent_locally_and_remotely
  - confirm_output_directory_has_no_collision
  - confirm_vcpchat_target_worktree_clean
  - confirm_vcptoolbox_target_worktree_clean
  - confirm_no_raw_sensitive_values_would_be_recorded
  - confirm_bridge_allowlist_unchanged
  - confirm_submitDraft_still_forbidden
  - confirm_github_release_still_forbidden
```

## Carry-forward A5 Package

```yaml
carry_forward_a5_package:
  mode: single_batch_a5_end_to_end
  target_repo: agent_image_lab
  target_branch: master
  working_branch: codex/a5-complete-delivery-20260507
  pr_target_branch: master
  real_vcpchat_root: required_external_value_not_recorded_in_git
  real_vcptoolbox_root: required_external_value_not_recorded_in_git
  selected_plugin_id: DoubaoGen
  selected_plugin_command: generate
  selected_plugin_model: doubao-seedream-5-0-260128
  max_plugin_calls: 1
  output_directory_ref: runs/a5_complete_delivery_photo_studio_os
  overwrite_existing_files_allowed: false
  bridge_methods_allowed:
    - cancel
    - loadSession
    - previewDraft
  bridge_methods_forbidden:
    - submitDraft
  max_bridge_calls_per_method: 1
  daily_note_write_allowed: true
  vcp_memory_write_allowed: true
  max_daily_note_writes: 1
  max_vcp_memory_writes: 1
  git_commit_allowed: true
  git_tag_allowed: true
  git_push_allowed: true
  github_pr_allowed: true
  github_release_allowed: false
  tag: v10.0.0-a5-complete-delivery-rc1
  commit_message: "feat: complete a5 end-to-end delivery candidate"
```

## Resume Execution Order

```yaml
resume_execution_order:
  - id: repo_reality_recheck
    purpose_cn: "重新确认 Agent Image Lab 分支、工作树、远端状态、tag 和输出目录。"
    required_before_any_external_action: true
  - id: external_worktree_clean_recheck
    purpose_cn: "只确认授权目标工作树是否已经干净或已被明确处置。"
    source_read_allowed: false
    source_modification_allowed: false
  - id: bridge_smoke_reentry_gate
    purpose_cn: "只有重新 preflight 通过后，才允许进入 cancel / loadSession / previewDraft。"
    submitDraft_allowed: false
  - id: doubaogen_single_call_gate
    purpose_cn: "只有 bridge no-write handoff 通过后，才允许 DoubaoGen 单次调用。"
    max_plugin_calls: 1
  - id: memory_write_gate
    purpose_cn: "只有生成资产通过审片后，才允许至多一条中文脱敏 DailyNote 和一条 VCP memory。"
    image_binary_in_memory_allowed: false
  - id: version_action_gate
    purpose_cn: "只有全套本地校验通过后，才允许 commit、tag、push 和 PR；GitHub Release 仍禁止。"
    github_release_allowed: false
```

## This Phase Boundary

```yaml
this_phase_boundary:
  external_worktree_reconciliation_performed_by_this_phase: false
  external_worktree_recheck_performed_by_this_phase: false
  vcpchat_source_read: false
  vcpchat_modified_by_this_phase: false
  vcptoolbox_source_read: false
  vcptoolbox_modified_by_this_phase: false
  bridge_method_invocation_performed: false
  bridge_cancel_called: false
  bridge_load_session_called: false
  bridge_preview_draft_called: false
  bridge_submit_draft_called: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  daily_note_written: false
  vcp_memory_written: false
  image_created: false
  output_file_written: false
  commit_performed: false
  tag_created: false
  push_performed: false
  pr_created: false
  github_release_performed: false
```

## Result Meaning

v10.1 表示：A5 的授权包和 v10.0 preflight 结果已被接续成一个可恢复的本地状态。外部工作树清理由用户处理；清理完成后仍不能直接执行生产步骤，必须重新跑 A5 preflight，并重新确认分支、tag、输出目录、外部目标工作树和所有禁止项。
