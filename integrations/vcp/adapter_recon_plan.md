# v0.3.0 Adapter Recon Plan

本文定义 v0.3.0-adapter-recon 的前置规划边界。当前阶段只在 Agent Image Lab 项目内准备授权记录模板和验收规则，不读取真实 VCPToolBox，不读取真实 VCPChat，不读取真实 manifest，不调用插件，不调用 API，不写 DailyNote，不创建图片文件。

## 目标

v0.3.0-adapter-recon 的唯一目标是为未来单一候选 manifest 的受控读取做准备。它不选择真实插件，不确认真实插件能力，不推进真实执行状态。

本阶段只允许形成：

- recon 计划说明。
- 授权记录草案。
- 可摘录字段和禁止字段清单。
- Gatekeeper / Review Console / Archivist 审查链说明。
- no-execution / no-external-read 验收项。

## 默认锁定值

所有 v0.3.0-adapter-recon 记录默认必须保持：

```yaml
source_authorized: false
source_read_performed: false
real_manifest_read: false
real_execution_allowed: false
selected_plugin: null
max_plugin_calls: 0
api_called: false
vcp_plugin_called: false
daily_note_called: false
```

这些字段不能由本阶段自动改变。真实 manifest 读取必须作为后续独立授权点。

## 允许范围

本阶段允许记录未来授权时需要填写的结构：

- 唯一候选 ID。
- 脱敏目标引用。
- 只读读取方式说明。
- 允许摘录字段列表。
- 禁止摘录字段列表。
- 人工审查人与 Gatekeeper 复查要求。
- Review Console 展示要求。
- Archivist 记忆草案复查要求。

所有说明必须是中文脱敏摘要，不得包含真实 manifest 原文、真实插件路径、真实插件能力结论或敏感配置原文。

## 允许摘录字段

未来即使获得独立授权，也只能摘录以下脱敏摘要字段：

- 脱敏插件显示名摘要。
- 命令集合中文摘要。
- 输入输出模式中文摘要。
- 权限风险中文摘要。
- Gatekeeper 需要复查的风险点。

## 禁止字段

任何阶段都不得复制或保存：

- API key、token、cookie、密码。
- 私密路径。
- 客户隐私或客户未公开信息。
- webhook、数据库地址或服务端点原文。
- manifest 敏感配置原文。
- 图片二进制。
- 真实插件输出。
- 真实运行日志。

拒绝原因也必须脱敏，例如：

```text
本候选 manifest 含无法脱敏的敏感配置字段，拒绝进入 manifest 审查。
```

## 状态边界

v0.3.0-adapter-recon 当前状态只能保持：

```text
pending_manifest_review
```

不得因为本阶段的模板或计划自动进入：

- `manifest_reviewed_safe`
- `dry_run_checked`
- `tested`

`manifest_reviewed_safe` 只能在未来单独授权读取真实 manifest，并完成脱敏审查后产生。`dry_run_checked` 只能在保持 `max_plugin_calls=0` 的 dry-run 验收完成后产生。`tested` 仍不代表真实执行授权。

## 审查链

未来授权读取真实 manifest 前必须经过：

1. 人工确认唯一候选。
2. Gatekeeper_Agent 确认可读范围、禁止字段和拒绝条件。
3. Review Console 仅展示授权草案，不触发读取或执行。
4. Archivist_Agent 只生成中文脱敏 memory_delta 草案，不写 DailyNote。
5. ImageLab_Master 最终确认是否进入独立读取授权点。

## 明确禁止

本阶段不授权：

- 读取真实 VCPToolBox。
- 读取真实 VCPChat。
- 读取真实 manifest。
- 调用真实插件。
- 调用外部 API。
- 写 DailyNote。
- 写 VCP 长期记忆。
- 写文件或创建图片。
- 创建真实插件执行入口。
- 更新真实插件能力结论。

## 验收口径

v0.3.0-adapter-recon 验收必须确认：

- 只新增项目内 recon 文档、样例和验收清单。
- 未出现真实插件名、真实 manifest 原文或真实能力结论。
- 未出现私密路径、密钥、token、cookie、密码或客户隐私。
- 所有记忆正文和审计摘要均为中文脱敏内容。
- 所有外部动作字段保持 false 或 0。
- `selected_plugin` 保持 `null`。
- 当前状态保持 `pending_manifest_review`。
