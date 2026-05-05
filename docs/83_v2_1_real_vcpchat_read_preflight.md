# 83 v2.1 Real VCPChat Read Preflight

本文定义 Agent Image Lab v2.1 第四阶段的真实 VCPChat 源码读取前最终 preflight。该阶段仍然只在本仓库内补齐读取前授权包，不读取真实 VCPChat，不列真实本地路径，不复制源码片段，不修改真实 VCPChat，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Preflight Decision

```yaml
v2_1_real_vcpchat_read_preflight:
  status: final_preflight_only
  user_authorized: false
  source_read_performed: false
  real_vcpchat_source_read: false
  real_vcpchat_modified: false
  exact_real_paths: []
  exact_real_paths_listed: false
  raw_source_copy_allowed: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  real_execution_allowed: false
```

## Goal

本阶段把未来真实读取动作封装为可审批的 preflight 记录。它只定义记录形态和验收门槛，不执行读取。

preflight 必须明确：

- 未来读取的候选源码类别。
- 未来精确路径 allowlist 字段，但当前必须为空。
- 未来允许输出的中文脱敏摘要字段。
- 未来禁止输出的敏感字段。
- 读取命令必须只读。
- 停止条件。
- 审查人。
- 读取后仍不得修改 VCPChat 或创建 IPC handler。

## Non-goals

本阶段不做以下事项：

- 不读取真实 VCPChat 源码。
- 不列真实 VCPChat 路径。
- 不复制 raw source。
- 不读取配置、日志、环境变量、token、cookie、密钥或客户数据。
- 不修改真实 VCPChat。
- 不创建 IPC handler。
- 不创建 preload 可执行代码。
- 不调用插件、API、DailyNote 或文件系统。
- 不创建图片文件。
- 不创建 tag、zip、SHA256 或 GitHub Release。

## Preflight Record

```yaml
real_vcpchat_read_preflight:
  preflight_id: string
  authorization_required: true
  user_authorized: false
  source_read_performed: false
  real_vcpchat_source_read: false
  real_vcpchat_modified: false
  selected_source_categories: []
  exact_real_paths: []
  exact_real_paths_listed: false
  allowed_sanitized_outputs: []
  forbidden_outputs: []
  read_command_must_be_read_only: documented_only
  raw_source_copy_allowed: false
  stop_conditions_required: true
  reviewer_required: true
```

`exact_real_paths` 必须保持空列表，直到未来独立授权明确列出真实路径 allowlist。

## Future Read Command Constraints

未来即使获准读取，也必须满足：

- 只读。
- 只读取授权 allowlist 中的文件。
- 不递归扫描未授权目录。
- 不读取配置、日志、环境变量、credential、客户记录或二进制资产。
- 不复制 raw source 到文档、样例、memory_delta、审计日志或 DailyNote。
- 只输出中文脱敏摘要。

本阶段不得写真实命令，不得写真实路径。

## Allowed Sanitized Output Fields

未来允许输出字段候选：

```yaml
allowed_sanitized_output_fields:
  - sanitized_module_purpose_cn
  - sanitized_window_lifecycle_summary_cn
  - sanitized_ipc_channel_summary_cn
  - sanitized_preload_boundary_summary_cn
  - sanitized_schema_validation_summary_cn
  - sanitized_security_risk_notes_cn
  - sanitized_required_change_summary_cn
  - sanitized_stop_condition_summary_cn
```

这些字段只能包含中文脱敏摘要。

## Forbidden Outputs

禁止输出：

- raw source。
- 真实本地路径。
- endpoint 原文。
- 环境变量值。
- key、token、cookie、密码。
- 私密路径。
- 客户隐私和客户未公开信息。
- raw runtime log。
- raw IPC payload。
- raw plugin output。
- 图片二进制。

## Stop Conditions

未来读取中一旦发现以下内容，必须停止摘录并只记录中文脱敏摘要：

- secret-like 内容。
- endpoint 原文。
- 私密路径。
- 客户隐私。
- raw runtime log。
- raw IPC payload。
- credential 文件。
- 配置文件原文。
- 与 Review Console 嵌入无关的业务模块。

## Post-read Boundary

即使未来完成真实读取，也仍不得自动进入：

- 修改真实 VCPChat。
- 创建 IPC handler。
- 创建 preload 代码。
- 调用插件。
- 调用 API。
- 调用 DailyNote。
- 写 VCP 长期记忆。
- 创建图片或写资产文件。

真实修改必须进入后续独立授权点。

## Acceptance

- real VCPChat read preflight 文档存在。
- read preflight contract 存在。
- read preflight 样例存在。
- validation checklist 包含 v2.1 real VCPChat read preflight 检查项。
- 样例保持 `user_authorized=false`。
- 样例保持 `source_read_performed=false`。
- 样例保持 `real_vcpchat_source_read=false`。
- 样例保持 `exact_real_paths=[]`。
- 样例保持 `raw_source_copy_allowed=false`。
- 样例保持 `real_execution_allowed=false`。
- 不包含真实路径、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v2_1_patch_05_real_vcpchat_read_authorization_request
  authorization_required: true
  allowed_after_authorization:
    - fill exact real path allowlist
    - choose selected source categories
    - assign reviewer
    - run read-only source intake under stop conditions
  forbidden_without_authorization:
    - read real VCPChat source
    - list real VCPChat paths
    - copy raw source
    - modify VCPChat
    - create IPC handler
    - call plugin
    - call API
    - call DailyNote
```
