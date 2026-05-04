# 31 Install And Operation Guide

本文说明如何使用当前 Agent Image Lab v1.0 true-loop closeout 候选包。当前包已经记录一次受控真实闭环和一次人工接受资产，但默认操作仍是只读校验；任何新的真实执行都必须重新授权。

## 目录定位

核心入口：

- `README.md`：项目总览。
- `docs/00_project_roadmap.md`：阶段路线。
- `docs/20_real_loop_completion_plan.md`：v0.4 到 v1.0 完成计划。
- `docs/30_release_readiness_report.md`：当前 release readiness。
- `docs/32_final_acceptance_report.md`：最终验收报告。
- `docs/34_v1_0_true_loop_closeout.md`：v1.0 真实闭环收束记录。
- `integrations/vcp/`：VCPToolBox Adapter、manifest 审查、授权门和执行记录。
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
- 创建未授权图片。

## 已归档真实闭环

v1.0 closeout 记录的 accepted asset：

```yaml
accepted_asset:
  scenario: Photo Studio OS
  selected_plugin_id: DoubaoGen
  model_ref: doubao-seedream-5-0-260128
  generated_image_ref: runs/photo_studio_os_v0_10_doubao_retry/image/doubaogen/bcbe3b60-6f7b-4e92-8a9d-b5044a86b7c3.jpg
  accepted_as_project_cover: true
  acceptance_mode: human_override
```

该路径位于 ignored runtime 输出目录。项目文档只记录相对路径、哈希、摘要和验收状态。

## 发起新的真实执行

新的真实执行必须重新确认：

- 真实插件 ID。
- 命令和模型。
- 最大调用次数。
- 输入引用。
- 输出目录引用。
- 是否允许图片文件创建。
- 回滚方案。
- Gatekeeper 和 Review Console 审批状态。

仅说“继续”不构成新的真实执行授权。

## 记忆边界

执行前、dry-run 阶段和当前 closeout 阶段都保持：

```yaml
memory_delta.write_mode: draft
daily_note_direct_write_allowed: false
```

执行后如需写 DailyNote，也必须走单独审批；图片二进制不得写入 Git、DailyNote 或 VCP 长期记忆。
