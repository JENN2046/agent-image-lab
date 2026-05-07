# v10.0 A5 End-to-end Activation Package Readiness

本文记录 Agent Image Lab v10.0 A5 end-to-end activation package readiness。该阶段把未来单批 A5 端到端自动化所需的授权字段、执行顺序、验证矩阵、回滚路径和停止条件固定为本仓库内可校验材料。

本阶段接收了用户提供的单批 A5 授权包，并执行了 A5 preflight 的只读安全检查。preflight 因外部 VCPChat / VCPToolBox 工作树存在未提交或未跟踪变更而阻断；真实生产步骤未启动。本阶段不读取或修改真实 VCPChat / VCPToolBox 源码，不调用 bridge 方法，不调用插件/API/DailyNote，不写 VCP memory，不创建图片，不 commit/tag/push/PR/release。

```yaml
status: blocked_validated_v10_0_a5_end_to_end_activation_package_preflight
version: v10.0
current_phase: "v10.0 A5 end-to-end activation package readiness"
validation_file: scripts/validate_v10_0_a5_end_to_end_activation_package.js
previous_phase: "v7.46 remote-debug relaunch runtime verification record"
previous_record: docs/198_v7_46_remote_debug_relaunch_runtime_verification_record.md
default_next_phase: "BLOCKED until external target worktrees are clean or explicitly reconciled"
```

## Activation State

```yaml
a5_activation_state:
  activation_package_recorded: true
  active_a5_authorization_package_present: true
  activation_ready: false
  a5_execution_started: false
  a5_preflight_started: true
  a5_preflight_blocked: true
  missing_required_fields: []
  real_vcpchat_root_provided: true
  real_vcptoolbox_root_provided: true
  raw_real_paths_recorded_in_git: false
  external_target_worktrees_clean: false
  vcpchat_worktree_clean: false
  vcptoolbox_worktree_clean: false
  blocker_reason_cn: "外部目标工作树存在未提交或未跟踪变更；A5 真实执行停止。"
  production_actions_blocked: true
```

## Required Authorization Package

```yaml
a5_authorization_required:
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

## Execution Plan

```yaml
a5_execution_plan:
  execution_style: single_batch_a5_end_to_end
  stages:
    - id: a5_preflight
      purpose_cn: "确认仓库、分支、tag、输出目录和真实路径外部引用齐备。"
      performed_by_this_phase: true
      result: blocked
      stop_if_missing_authorization: true
    - id: vcpchat_runtime_bridge_verification
      purpose_cn: "在授权 VCPChat 根目录内验证 cancel、loadSession、previewDraft。"
      bridge_methods_allowed:
        - cancel
        - loadSession
        - previewDraft
      bridge_methods_forbidden:
        - submitDraft
    - id: review_console_runtime_handoff
      purpose_cn: "把脱敏 seed 和 no-write draft 通过 Review Console handoff 验证。"
      side_effects_allowed: false
    - id: doubaogen_single_real_generation
      purpose_cn: "使用 DoubaoGen 单插件、单任务、单调用生成 Photo Studio OS 候选资产。"
      max_plugin_calls: 1
    - id: review_and_archive_decision
      purpose_cn: "自动安全复核并只归档路径引用、hash、评分、摘要和规则。"
      image_binary_in_git_or_memory: false
    - id: daily_note_and_vcp_memory_write
      purpose_cn: "写入至多一条中文脱敏 DailyNote 和一条 VCP memory。"
      max_daily_note_writes: 1
      max_vcp_memory_writes: 1
    - id: delivery_candidate_closeout
      purpose_cn: "更新交付候选文档、索引、校验器和 agent board。"
    - id: version_actions
      purpose_cn: "提交、tag、push、PR；禁止 GitHub Release。"
      github_release_allowed: false
```

## Forbidden Outputs

```yaml
forbidden_outputs:
  - raw_local_path
  - raw_endpoint
  - raw_websocket_url
  - raw_runtime_log
  - raw_ipc_payload
  - raw_plugin_output
  - raw_source_code
  - secret
  - token
  - cookie
  - password
  - customer_private_data
  - image_binary_in_git_or_memory
```

## This Phase Boundary

```yaml
this_phase_boundary:
  active_a5_authorization_package_present: true
  a5_execution_started: false
  a5_preflight_started: true
  a5_preflight_blocked: true
  real_vcpchat_root_provided: true
  real_vcptoolbox_root_provided: true
  external_target_worktrees_clean: false
  vcpchat_worktree_clean: false
  vcptoolbox_worktree_clean: false
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

v10.0 readiness 表示 A5 端到端自动化的单批授权包形态已经在本仓库内固化，并且可以被机器校验。本轮用户已提供 active A5 授权包，但 preflight 发现外部目标工作树不干净，因此真实生产动作没有启动。

下一步只有在外部 VCPChat / VCPToolBox 工作树被清理、提交、切换到隔离分支，或用户对这些既有变更给出明确处置授权后，才能重新进入 A5 preflight。缺少该处置前必须继续停止。
