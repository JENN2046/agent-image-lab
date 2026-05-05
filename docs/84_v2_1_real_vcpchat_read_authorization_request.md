# 84 v2.1 Real VCPChat Read Authorization Request

本文定义 Agent Image Lab v2.1 第五阶段的真实 VCPChat 读取授权请求模板。该阶段只补齐授权请求记录形态，不填写真实路径，不读取外部源码，不复制 raw source，不修改真实 VCPChat，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Request Decision

```yaml
v2_1_real_vcpchat_read_authorization_request:
  status: request_template_only
  user_authorized: false
  source_read_performed: false
  real_vcpchat_source_read: false
  real_vcpchat_modified: false
  exact_real_paths: []
  selected_source_categories: []
  raw_source_copy_allowed: false
  real_execution_allowed: false
```

## Goal

本阶段只创建“未来真实读取授权请求”的模板。模板用于让用户之后填写或批准：

- 真实 VCPChat 根目录。
- 精确允许读取文件清单。
- 候选源码类别。
- 允许摘录字段。
- 禁止摘录字段。
- 停止条件。
- 审查人。
- 读取后边界。

本阶段不填真实路径，也不读取外部源码。

## Non-goals

本阶段不做以下事项：

- 不读取真实 VCPChat。
- 不填写真实 VCPChat 根目录。
- 不填写真实文件路径。
- 不复制 raw source。
- 不读取配置、日志、环境变量、credential 或客户数据。
- 不修改 VCPChat 或 VCPToolBox。
- 不创建 IPC handler 或 preload 代码。
- 不调用插件、API、DailyNote 或文件系统。
- 不创建图片文件。

## Authorization Request Template

```yaml
authorization_request_template:
  request_id: string
  authorization_required: true
  user_authorized: false
  target_repository_root: null
  selected_source_categories: []
  exact_real_paths: []
  allowed_sanitized_output_fields: []
  forbidden_outputs:
    - raw_source_code
    - real_local_path
    - endpoint_raw_value
    - env_value
    - secret_raw_value
    - private_path_raw_value
    - customer_private_data
    - raw_runtime_log
    - raw_ipc_payload
    - raw_plugin_output
    - image_binary
  stop_conditions_required: true
  reviewer_required: true
  raw_source_copy_allowed: false
  source_read_performed: false
```

`target_repository_root` 和 `exact_real_paths` 必须保持空值，直到用户在独立授权中明确提供。

## Required User Inputs For Future Read

未来真实读取前，用户必须明确提供：

- 真实 VCPChat 根目录。
- 允许读取的精确文件路径列表。
- 允许读取的候选源码类别。
- 禁止读取的文件类别。
- 允许输出的中文脱敏字段。
- 禁止输出的字段。
- 读取停止条件。
- 是否允许执行只读读取命令。

没有这些输入，不得读取真实 VCPChat。

## Candidate Source Categories

模板允许选择的类别仍只限：

```yaml
candidate_source_categories:
  - review_console_child_window_candidate
  - ipc_handler_candidate
  - preload_boundary_candidate
  - window_lifecycle_candidate
  - schema_bridge_candidate
```

本阶段 `selected_source_categories=[]`。

## Allowed Sanitized Output Fields

未来可申请的输出字段：

```yaml
allowed_sanitized_output_field_candidates:
  - sanitized_module_purpose_cn
  - sanitized_window_lifecycle_summary_cn
  - sanitized_ipc_channel_summary_cn
  - sanitized_preload_boundary_summary_cn
  - sanitized_schema_validation_summary_cn
  - sanitized_security_risk_notes_cn
  - sanitized_required_change_summary_cn
  - sanitized_stop_condition_summary_cn
```

本阶段 `allowed_sanitized_output_fields=[]`。

## Stop Conditions

未来读取中如发现以下内容，必须停止摘录并只保留中文脱敏摘要：

- secret-like 内容。
- endpoint 原文。
- 私密路径。
- 客户隐私。
- raw runtime log。
- raw IPC payload。
- credential 或配置原文。
- 未授权文件类别。

## Rejection Conditions

授权请求必须被拒绝的情况：

- 请求中已经填写真实路径但未经过用户确认。
- 请求中允许复制 raw source。
- 请求中允许读取配置、日志、环境变量、credential 或客户数据。
- 请求中允许修改 VCPChat。
- 请求中允许创建 IPC handler 或 preload 代码。
- 请求中允许调用插件、API、DailyNote 或写文件。
- 请求中包含 secret、endpoint 原文、私密路径或客户隐私。

## Acceptance

- authorization request 文档存在。
- authorization request contract 存在。
- authorization request 样例存在。
- validation checklist 包含 v2.1 authorization request 检查项。
- 样例保持 `user_authorized=false`。
- 样例保持 `source_read_performed=false`。
- 样例保持 `real_vcpchat_source_read=false`。
- 样例保持 `target_repository_root=null`。
- 样例保持 `exact_real_paths=[]`。
- 样例保持 `selected_source_categories=[]`。
- 样例保持 `raw_source_copy_allowed=false`。
- 不包含真实路径、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v2_1_patch_06_real_vcpchat_read_user_filled_request
  authorization_required: true
  requires_user_to_provide:
    - real VCPChat root
    - exact allowed file paths
    - selected source categories
    - allowed sanitized outputs
    - reviewer
  forbidden_without_authorization:
    - read real VCPChat source
    - fill real paths
    - copy raw source
    - modify VCPChat
    - create IPC handler
    - call plugin
    - call API
    - call DailyNote
```
