# v0.3.0 Manifest Read Authorization Gate

本文定义 v0.3.0 阶段真实 manifest 读取前的授权门槛。当前文件只描述授权条件和记录结构，不读取真实 VCPToolBox，不读取真实 VCPChat，不读取真实 manifest，不调用插件，不调用 API，不写 DailyNote，不创建图片文件。

## 目标

本门槛用于把“准备授权读取”和“实际读取 manifest”拆开。Patch 02 只能完成授权门槛记录，不构成读取授权，也不产生真实 manifest 审查结论。

未来若要读取真实 manifest，必须另开独立授权点，并在授权前确认：

- 唯一候选 ID。
- 脱敏目标仓库引用。
- 脱敏目标 manifest 引用。
- 只读读取方式。
- 读取人和审查人。
- 允许摘录字段。
- 禁止摘录字段。
- 拒绝条件。
- 状态是否允许从 `pending_manifest_review` 推进。

## 默认锁定值

所有授权门槛记录默认必须保持：

```yaml
read_authorized: false
read_performed: false
source_authorized: false
source_read_performed: false
real_manifest_read: false
raw_manifest_copy_allowed: false
real_execution_allowed: false
selected_plugin: null
max_plugin_calls: 0
api_called: false
vcp_plugin_called: false
daily_note_called: false
```

这些字段不能由本文件或样例自动改变。只有后续独立授权任务才能改变读取授权状态。

## 授权申请必须包含

授权申请至少必须包含：

- `authorization_request_id`：授权申请 ID。
- `candidate_id`：唯一候选 ID。
- `requested_phase`：请求阶段。
- `target_repository_ref`：脱敏仓库引用，不写私密路径。
- `target_manifest_ref`：脱敏 manifest 引用，不写真实 manifest 原文。
- `read_method_cn`：只读读取方式说明，不包含执行命令。
- `reader_role`：未来读取人角色。
- `reviewer_role`：人工审查人角色。
- `gatekeeper_required`：必须为 Gatekeeper 复查。
- `review_console_required`：必须在 Review Console 展示授权草案。
- `archivist_required_for_memory`：如生成记忆草案，必须由 Archivist 复查。

## 允许摘录字段

未来即使获得独立授权，也只能生成中文脱敏摘要：

- 脱敏插件显示名摘要。
- 命令集合中文摘要。
- 输入输出模式中文摘要。
- 权限风险中文摘要。
- Gatekeeper 需要复查的风险点。

授权门槛记录只能列出这些字段名，不得提前填写真实摘录值。

## 禁止摘录字段

任何授权门槛、审查记录、拒绝原因、审计记录或 memory_delta 草案都不得包含：

- API key、token、cookie、密码。
- 私密路径。
- 客户隐私或客户未公开信息。
- webhook、数据库地址或服务端点原文。
- manifest 敏感配置原文。
- 图片二进制。
- 真实插件输出。
- 真实运行日志。

## 拒绝条件

出现以下任一情况，授权申请必须保持拒绝或 pending，不得进入真实读取：

- 读取对象不是单一候选 manifest。
- 读取方式包含执行命令或可能触发插件运行。
- 需要保存 raw manifest 原文。
- 需要保存密钥、token、cookie、密码、私密路径或客户隐私。
- 权限、输入、输出或命令含义无法脱敏说明。
- manifest 暗示未授权外部调用、文件写入、图片写入或 DailyNote 写入。
- Gatekeeper_Agent 要求拒绝。
- Review Console 无人工确认记录。

拒绝原因必须是中文脱敏摘要，例如：

```text
本候选读取申请未能证明可脱敏审查，拒绝进入真实 manifest 读取。
```

## 状态边界

Patch 02 当前状态必须保持：

```text
pending_manifest_review
```

不得因为授权门槛记录进入：

- `manifest_reviewed_safe`
- `dry_run_checked`
- `tested`

`manifest_reviewed_safe` 只能在未来独立授权读取真实 manifest，并完成脱敏审查后产生。`dry_run_checked` 只能在真实插件调用仍为 0 的 dry-run 验收完成后产生。`tested` 仍不代表真实执行授权。

## no-execution 边界

本门槛不授权：

- 调用真实插件。
- 调用外部 API。
- 写 DailyNote。
- 写 VCP 长期记忆。
- 写文件或创建图片。
- 创建 Adapter 执行入口。
- 修改真实 VCPToolBox。
- 修改真实 VCPChat。
- 更新真实插件能力结论。

## 审计要求

审计记录只能保存中文脱敏摘要，并必须确认：

- 当前未读取真实 manifest。
- 当前未复制 manifest 原文。
- 当前未选择真实插件。
- 当前未调用插件、API 或 DailyNote。
- 当前未写文件或创建图片。
- 当前状态仍为 `pending_manifest_review`。
