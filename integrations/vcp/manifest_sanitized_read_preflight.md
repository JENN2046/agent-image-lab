# v0.3.0 Manifest Sanitized Read Preflight

本文定义未来真实 manifest 脱敏读取执行前的授权规划。当前文件只是 preflight 规划，不读取真实 VCPToolBox，不读取真实 VCPChat，不读取真实 manifest，不调用插件，不调用 API，不写 DailyNote，不创建图片文件。

## 目标

本 preflight 用于说明：即使未来用户授权读取真实 manifest，读取动作也必须先通过一个执行前门槛。该门槛只允许单一候选 manifest、只读、脱敏摘要输出，不允许仓库级扫描或 raw manifest 保存。

Patch 03 本身不构成读取授权，也不开始读取。

## 默认锁定值

```yaml
read_execution_authorized: false
read_execution_started: false
read_completed: false
raw_manifest_copied: false
source_authorized: false
source_read_performed: false
real_manifest_read: false
external_repo_access_allowed: false
allowed_source_paths: []
allowed_file_types: []
sensitive_path_redaction_required: true
real_execution_allowed: false
selected_plugin: null
max_plugin_calls: 0
api_called: false
vcp_plugin_called: false
daily_note_called: false
```

## 执行前授权条件

未来真实读取前必须满足：

- 用户明确授权读取单一候选 manifest。
- 读取对象只能是一个脱敏候选引用。
- 读取方式必须是只读，不包含执行命令。
- 不允许仓库级扫描。
- 不允许读取 VCPChat。
- 不允许读取 `config.env`、日志、图片、运行态目录或客户目录。
- Gatekeeper_Agent 必须确认读取范围、禁止字段和拒绝条件。
- Review Console 只能展示授权草案，不得触发读取。
- Archivist_Agent 只能生成中文脱敏 memory_delta 草案，不写 DailyNote。

## 允许输出

未来即使授权读取，也只能输出中文脱敏摘要：

- 脱敏插件显示名摘要。
- 命令集合中文摘要。
- 输入输出模式中文摘要。
- 权限风险中文摘要。
- Gatekeeper 需要复查的风险点。
- 中文脱敏审计摘要。

## 禁止输出

不得输出或保存：

- raw manifest 原文。
- 真实私密路径。
- API key、token、cookie、密码。
- webhook、数据库地址或 endpoint 原文。
- 客户隐私或客户未公开信息。
- 图片二进制。
- 真实插件输出。
- 运行日志。
- 真实插件能力结论。

## 状态边界

Patch 03 当前状态必须保持：

```text
pending_manifest_review
```

不得进入：

- `manifest_reviewed_safe`
- `dry_run_checked`
- `tested`
- `plugin_selected`
- `execution_ready`
- `real_execution_ready`

`manifest_reviewed_safe` 只能在未来真实 manifest 被明确授权读取，并完成脱敏审查后再讨论。

## 拒绝条件

出现以下情况必须拒绝或保持 pending：

- 授权对象不是单一候选 manifest。
- 读取方式可能执行脚本或触发插件。
- 需要保存 raw manifest 原文。
- 需要读取配置、日志、图片或运行态目录。
- 需要保存 endpoint、密钥、token、cookie、密码、私密路径或客户隐私。
- 无法用中文脱敏摘要说明权限风险。
- Gatekeeper_Agent 要求拒绝。

## no-execution 边界

本 preflight 不授权：

- 调用真实插件。
- 调用外部 API。
- 写 DailyNote。
- 写 VCP 长期记忆。
- 写文件或创建图片。
- 创建 Adapter 执行入口。
- 修改真实 VCPToolBox。
- 修改真实 VCPChat。
- 更新真实插件能力结论。
