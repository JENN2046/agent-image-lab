# 81 v2.1 VCPChat Source Read Authorization

本文定义 Agent Image Lab v2.1 第二阶段的真实 VCPChat 源码读取前授权门槛。该阶段仍然只在本仓库内补齐授权规划、contract、样例和验收清单，不读取真实 VCPChat 源码，不修改真实 VCPChat，不读取真实 VCPToolBox，不创建真实 IPC handler，不调用插件、API 或 DailyNote。

## Authorization Decision

```yaml
v2_1_vcpchat_source_read_authorization:
  status: authorization_gate_only
  authorization_required: true
  user_authorized: false
  real_vcpchat_source_read: false
  real_vcpchat_modified: false
  real_vcptoolbox_source_read: false
  real_vcptoolbox_modified: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  real_execution_allowed: false
```

## Goal

本阶段只定义未来读取真实 VCPChat 源码之前必须满足的授权记录形态。

授权前必须明确：

- 读取对象。
- 读取方式。
- 允许读取的文件类别。
- 禁止读取的文件类别。
- 允许摘录字段。
- 禁止摘录字段。
- 敏感路径脱敏规则。
- raw source 禁止复制规则。
- 审查人。
- 拒绝条件。
- 回滚或撤销记录。

## Non-goals

本阶段不做以下事项：

- 不读取真实 VCPChat 源码。
- 不修改真实 VCPChat。
- 不读取真实 VCPToolBox 源码。
- 不读取配置、日志、环境变量、token、cookie 或密钥文件。
- 不复制真实源码片段。
- 不创建真实 IPC handler。
- 不创建 preload 可执行代码。
- 不调用插件、API 或 DailyNote。
- 不创建图片文件。
- 不创建 tag、zip、SHA256 或 GitHub Release。

## Required Authorization Record

未来任何真实 VCPChat 源码读取必须先形成授权记录：

```yaml
source_read_authorization:
  authorization_required: true
  user_authorized: false
  real_vcpchat_source_read: false
  real_vcpchat_modified: false
  real_vcptoolbox_source_read: false
  real_vcptoolbox_modified: false
  allowed_source_files: []
  forbidden_source_files: []
  allowed_extract_fields: []
  forbidden_extract_fields:
    - api_key
    - token
    - cookie
    - password
    - private_path
    - customer_private_data
    - endpoint_raw_value
    - raw_runtime_log
    - raw_ipc_payload
  sensitive_path_redaction_required: true
  raw_source_copy_allowed: false
  real_execution_allowed: false
```

`allowed_source_files` 和 `allowed_extract_fields` 为空时，任何真实源码读取都不得发生。

## Allowed Extract Fields

未来授权后也只能摘录脱敏摘要字段，不能摘录真实源码原文：

```yaml
allowed_extract_field_candidates:
  - sanitized_module_purpose_cn
  - sanitized_window_lifecycle_summary_cn
  - sanitized_ipc_channel_summary_cn
  - sanitized_preload_boundary_summary_cn
  - sanitized_security_risk_notes_cn
  - sanitized_review_console_integration_notes_cn
```

这些字段必须是中文脱敏摘要，不得包含真实路径、endpoint、secret、客户隐私、raw IPC payload 或 raw runtime log。

## Forbidden Extract Fields

禁止摘录或复制：

- key、token、cookie、密码。
- 私密路径。
- 客户隐私或客户未公开信息。
- endpoint 原文。
- raw source code 片段。
- raw manifest 原文。
- raw IPC payload。
- raw runtime log。
- 环境变量值。
- 配置文件原文。
- 图片二进制。
- 插件输出原文。

如未来读取范围内出现上述内容，只能记录中文脱敏拒绝摘要。

## Rejection Conditions

出现任一情况时，不得进入真实源码读取：

- `user_authorized=false`。
- `allowed_source_files=[]`。
- 未列出禁止读取文件类别。
- 未列出禁止摘录字段。
- 未指定审查人。
- 未要求敏感路径脱敏。
- 允许复制 raw source。
- 授权中包含真实 secret、endpoint、私密路径或客户隐私。
- 授权试图同时允许真实 IPC handler 创建、插件调用、API 调用或 DailyNote 写入。

## Audit Rules

- 审计摘要必须中文。
- 审计摘要只能写脱敏结论。
- 不得把敏感原文写入 memory_delta、preserved_original、tags、拒绝原因、审计日志或 DailyNote 正文。
- `real_vcpchat_source_read=false` 时，不得声称已经完成源码审查。
- `user_authorized=true` 也不等于允许修改真实 VCPChat。
- 源码读取授权不等于真实插件执行授权。

## Acceptance

- source read authorization 文档存在。
- source read authorization gate contract 存在。
- source read authorization 样例存在。
- validation checklist 包含 v2.1 source read authorization 检查项。
- 样例保持 `user_authorized=false`。
- 样例保持 `real_vcpchat_source_read=false`。
- 样例保持 `real_vcpchat_modified=false`。
- 样例保持 `raw_source_copy_allowed=false`。
- 样例保持 `real_execution_allowed=false`。
- 不包含真实源码片段、真实路径、endpoint 原文、secret 或客户隐私。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v2_1_patch_03_real_vcpchat_source_read_scope_review
  authorization_required: true
  allowed_after_authorization:
    - list exact future source read scope
    - list allowed sanitized extract fields
    - list reviewer and rejection rules
  forbidden_without_authorization:
    - read real VCPChat source
    - modify real VCPChat
    - create IPC handler
    - create preload runtime code
    - call plugin
    - call API
    - call DailyNote
```
