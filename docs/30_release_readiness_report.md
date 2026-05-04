# 30 Release Readiness Report

本文是 Agent Image Lab 当前 release readiness 报告。它收束 v0.4 到 v0.7.1 的完成状态，并明确 v1.0 final 仍受真实执行授权门限制。

## 当前结论

```yaml
release_readiness:
  checkpoint: v0.8_release_readiness
  repo_state: ready_for_pre_execution_release
  true_real_loop_completed: false
  real_execution_allowed: false
  selected_plugin_for_execution: null
  max_plugin_calls_authorized: 0
```

当前项目已经可以作为“真实执行前 release candidate”交付：文档、Adapter dry-run、VCPToolBox Adapter-only 安装验证、单一 manifest 脱敏审查、Gatekeeper/Review Console 前置包和 Photo Studio OS 0 调用演练均已完成。

当前项目还不能声明为“真实闭环 v1.0 final”：尚未获得用户对真实插件调用、输入引用、输出目录和回滚方案的单独授权。

## 已完成阶段

| 阶段 | 状态 | 证据 |
|---|---|---|
| v0.4 Adapter dry-run export | 完成 | `exports/vcptoolbox/Plugin/AgentImageLabAdapter/` |
| v0.5 Adapter-only VCPToolBox 安装验证 | 完成 | `integrations/vcp/v0_5_adapter_install_verification.md` |
| v0.6 单一真实 manifest 脱敏审查 | 完成 | `integrations/vcp/v0_6_real_plugin_manifest_sanitized_review.md` |
| v0.7 前置包 | 完成 | Gatekeeper、Review Console、Preflight confirmation 三件套 |
| v0.7.1 dry-run rehearsal | 完成 | `integrations/vcp/v0_7_photo_studio_os_dry_run_rehearsal.md` |

## 仍未完成

- 真实插件选择用于执行。
- 用户授权真实插件调用次数。
- 受控输入引用确认。
- 受控输出目录确认。
- 回滚方案人工批准。
- Review Console 对真实执行申请的人工批准。
- 真实插件调用。
- 图片资产路径归档。
- 执行后评分、摘要和 memory_delta 写入申请。

## 验证命令

```powershell
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
node --check adapter_dry_run_lab\adapter_dry_run.js
node --check review_console\static_prototype\app.js
node --check review_console\static_prototype\mock_data.js
node --check exports\vcptoolbox\Plugin\AgentImageLabAdapter\dry-run-adapter.js
git diff --check
```

## Release 建议

```yaml
release_recommendation:
  can_release_as_pre_execution_checkpoint: true
  can_release_as_true_real_loop_final: false
  required_next_authorization: v0.7_photo_studio_os_minimal_real_execution
```

建议把当前状态作为 v0.8 release-readiness checkpoint，而不是 v1.0 final。v1.0 final 应在一次真实执行闭环完成并归档后再发布。
