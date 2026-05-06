# v7.35 VCPChat Review Console Runtime Follow-up Planning

本文记录 v7.35 VCPChat Review Console Runtime Follow-up Planning。目标是在 v7.34 已确认 Review Console bridge runtime-verified 后，规划后续是否把一次性 remote-debug 验证固化为 Agent Image Lab 外部脚本，或进一步给 VCPChat 增加正式 smoke test。本阶段只写规划，不启动 VCPChat，不访问 CDP，不修改 VCPChat。

```yaml
status: completed_validated_v7_35_runtime_followup_planning
version: v7.35
current_phase: "v7.35 vcpchat review console runtime followup planning"
validation_file: scripts/validate_v7_35_vcpchat_review_console_runtime_followup_planning.js
current_head: 4264a47
previous_phase: "v7.34 vcpchat review console runtime verification closeout"
previous_record: docs/186_v7_34_vcpchat_review_console_runtime_verification_closeout.md
default_next_phase: "v7.36 External Remote Debug Verification Script Plan"
```

## Current Verified Baseline

```yaml
current_verified_baseline:
  target_repository_name: VCPChat
  target_branch: main
  target_head_short: b320e39
  review_console_bridge_runtime_verified: true
  renderer_global_smoke: passed
  prototype_guard_smoke: passed
  safe_to_claim_production_e2e: false
  known_startup_side_effect_path: .vcp_ready
```

## Follow-up Options

```yaml
followup_options:
  external_agent_image_lab_remote_debug_script:
    description_cn: "在 Agent Image Lab 中固化一个外部只读 remote-debug 验证脚本，用于重复验证 VCPChat Review Console bridge runtime surface。"
    modifies_vcpchat: false
    app_launch_required_when_executed: true
    repeatability: high
    risk_level: medium
    benefits_cn:
      - "不改 VCPChat，适合先稳定验证流程。"
      - "可复用 v7.33 的 CDP 只读表达式和清理流程。"
      - "可以持续记录 .vcp_ready 普通启动副作用。"
    limitations_cn:
      - "仍需启动 VCPChat，不能作为纯静态测试。"
      - "仍需每次运行前确认端口、工作树和授权边界。"
  vcpchat_formal_smoke_test:
    description_cn: "在 VCPChat 内增加正式 smoke test 或 npm script，把 Review Console bridge runtime verification 纳入 VCPChat 自身测试体系。"
    modifies_vcpchat: true
    app_launch_required_when_executed: likely
    repeatability: high
    risk_level: high
    benefits_cn:
      - "更接近 VCPChat 原生工程体系。"
      - "未来可接入 CI 或本地 release preflight。"
    limitations_cn:
      - "需要修改 VCPChat 文件和 package scripts。"
      - "需要单独文件级写入授权。"
      - "需要处理 .vcp_ready 启动副作用和 Electron runtime 测试稳定性。"
```

## Recommendation

```yaml
recommendation:
  recommended_first_step: external_agent_image_lab_remote_debug_script
  reason_cn: "当前已经证明 remote-debug runtime verification 有效。先把它固化为 Agent Image Lab 外部脚本，可以在不修改 VCPChat 的情况下提高可重复性，并为后续 VCPChat 正式 smoke test 提供稳定输入。"
  defer_vcpchat_formal_smoke_test_until:
    - "外部脚本至少重复通过一次。"
    - ".vcp_ready 普通启动副作用处理策略明确。"
    - "用户明确授权 VCPChat 文件级写入。"
```

## Proposed External Script Scope

```yaml
proposed_external_script_scope:
  script_location_candidate: scripts/run_vcpchat_review_console_remote_debug_smoke.ps1
  record_location_candidate: docs/188_v7_36_external_remote_debug_verification_script_plan.md
  script_must:
    - "检查 VCPChat branch/head/worktree。"
    - "检查 remote-debug 端口空闲。"
    - "启动一次性 remote-debug Electron。"
    - "只用 Runtime.evaluate 读取允许的 renderer global。"
    - "不调用 bridge loadSession / previewDraft / submitDraft / cancel。"
    - "关闭启动进程树。"
    - "如果 .vcp_ready 被普通启动删除，则恢复并记录。"
    - "输出脱敏 JSON 结果。"
  script_must_not:
    - "修改 VCPChat 源码。"
    - "修改 VCPChat package.json。"
    - "调用插件、API、DailyNote 或 VCP 记忆。"
    - "创建图片或写入 VCPChat 项目资产。"
    - "推送 VCPChat 或 Agent Image Lab。"
```

## Future VCPChat Formal Smoke Test Gate

```yaml
future_vcpchat_formal_smoke_test_gate:
  allowed_now: false
  requires_separate_authorization: true
  minimum_future_write_scope:
    - "package.json 中新增或调整 smoke script。"
    - "受控 smoke test 文件，具体路径需后续读取和授权。"
    - "必要的文档或 checklist。"
  required_preconditions:
    - "外部 Agent Image Lab 脚本稳定通过。"
    - "明确是否接受 Electron app launch 作为测试前置。"
    - "明确 .vcp_ready 的预期所有权和启动副作用处理。"
```

## Side Effect Guard

```yaml
side_effect_guard:
  app_launch_performed_by_this_phase: false
  remote_debug_used_by_this_phase: false
  cdp_endpoint_accessed_by_this_phase: false
  vcpchat_modified_by_this_phase: false
  external_script_created_by_this_phase: false
  vcpchat_formal_smoke_test_created_by_this_phase: false
  bridge_load_session_called: false
  bridge_preview_draft_called: false
  bridge_submit_draft_called: false
  bridge_cancel_called: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_created: false
  dependency_changed: false
  package_manifest_changed: false
  lockfile_changed: false
  vcpchat_pushed: false
  github_release_performed: false
```

## Next Authorization Template

```yaml
next_authorization_template_cn: >
  我明确授权进入 v7.36，只在 Agent Image Lab 中规划 external remote-debug verification script，
  不启动 VCPChat、不修改 VCPChat、不创建真实执行脚本；只写文档、contract、样例和 validation checklist。
```

## Acceptance Meaning

v7.35 表示后续路线已经明确：推荐先做 Agent Image Lab 外部 remote-debug 验证脚本规划，再考虑 VCPChat 内置 smoke test。它不代表已经创建脚本，不代表可以修改 VCPChat，也不代表生产 E2E 验收完成。
