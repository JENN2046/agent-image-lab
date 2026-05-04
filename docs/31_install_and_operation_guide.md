# 31 Install And Operation Guide

本文说明如何使用当前 Agent Image Lab release-readiness 包。当前版本默认处于真实执行前状态，不调用真实插件、不调用 API、不写 DailyNote、不创建图片。

## 目录定位

核心入口：

- `README.md`：项目总览。
- `docs/00_project_roadmap.md`：阶段路线。
- `docs/20_real_loop_completion_plan.md`：v0.4 到 v1.0 完成计划。
- `integrations/vcp/`：VCPToolBox Adapter、manifest 审查和授权门记录。
- `review_console/`：Review Console 规格和审批前置记录。
- `workflows/`：Photo Studio OS runbook 和真实执行前确认表。
- `scripts/validate_mvp.ps1`：安全校验脚本。

## 校验

在仓库根目录运行：

```powershell
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
```

推荐附加检查：

```powershell
node --check adapter_dry_run_lab\adapter_dry_run.js
node --check review_console\static_prototype\app.js
node --check review_console\static_prototype\mock_data.js
node --check exports\vcptoolbox\Plugin\AgentImageLabAdapter\dry-run-adapter.js
git diff --check
```

## Adapter Dry-Run

项目内实验入口：

```powershell
node adapter_dry_run_lab\adapter_dry_run.js adapter_dry_run_lab\fixtures\photo_studio_os_v0_7_rehearsal_request.json
```

VCPToolBox stdio 包装入口：

```powershell
Get-Content -LiteralPath adapter_dry_run_lab\fixtures\photo_studio_os_v0_7_rehearsal_request.json -Encoding UTF8 | node exports\vcptoolbox\Plugin\AgentImageLabAdapter\dry-run-adapter.js
```

预期结果必须保持：

```yaml
status: accepted_draft
selected_plugin: null
max_plugin_calls: 0
real_execution_allowed: false
```

## VCPToolBox Adapter-only 安装边界

v0.5 已验证 Adapter-only dry-run 包可安装到 VCPToolBox 插件目录。该验证不代表真实生图插件已安装或已授权。

已验证安装文件：

- `Plugin/AgentImageLabAdapter/plugin-manifest.json`
- `Plugin/AgentImageLabAdapter/dry-run-adapter.js`
- `Plugin/AgentImageLabAdapter/README.md`

禁止：

- 覆盖用户已有插件。
- 安装真实生图插件。
- 修改真实配置。
- 写 DailyNote。
- 创建图片。

## 进入真实执行前

必须先完成并人工确认：

- `integrations/vcp/v0_7_real_execution_authorization_gate.md`
- `integrations/vcp/v0_7_gatekeeper_risk_boundary.md`
- `review_console/v0_7_human_approval_preflight.md`
- `workflows/v0_7_real_execution_preflight_confirmation.md`

用户必须另行授权真实执行，且明确：

- 真实插件 ID。
- 最大调用次数。
- 输入引用。
- 输出目录引用。
- 是否允许图片文件创建。
- 回滚方案。
- Gatekeeper 和 Review Console 审批状态。

## 记忆边界

执行前和 dry-run 阶段：

```yaml
memory_delta.write_mode: draft
daily_note_direct_write_allowed: false
```

执行后如需写 DailyNote，也必须走单独审批；图片二进制不得写入 Git、DailyNote 或 VCP 长期记忆。
