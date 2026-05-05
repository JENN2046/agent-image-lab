# 87 v2.2 Real VCPChat Read Final Authorization Preflight

本文定义 Agent Image Lab v2.2 第三阶段的“真实 VCPChat 读取最终授权 preflight”。该阶段只检查未来真实读取前的最终授权包是否完整，不读取真实 VCPChat，不读取真实 VCPToolBox，不复制 raw source，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Preflight Decision

```yaml
v2_2_real_vcpchat_read_final_authorization_preflight:
  status: final_authorization_preflight_only
  final_authorization_requested: false
  final_authorization_granted: false
  source_read_authorized: false
  source_read_performed: false
  real_vcpchat_source_read: false
  exact_real_paths_stored_in_git: false
  raw_source_copy_allowed: false
  read_command_ready: false
  real_execution_allowed: false
```

## Goal

本阶段把 v2.2 Patch 02 的“已填写授权包人工复核门槛”推进到“真实读取前最后检查”。它用于确认未来读取前是否已经具备：

- 已填写授权包的人工复核记录。
- 脱敏后的根目录确认。
- 脱敏后的精确 allowlist 确认。
- 只读读取命令权限确认。
- 审查人确认。
- 停止条件确认。
- 读取后边界确认。
- 输出字段脱敏政策确认。

本阶段不读取真实源码，也不保存真实路径。

## Non-goals

本阶段不做以下事项：

- 不读取真实 VCPChat。
- 不读取真实 VCPToolBox。
- 不保存真实 VCPChat 根目录。
- 不保存真实 allowlist 路径。
- 不复制 raw source、完整函数体、配置原文、日志原文或 IPC payload 原文。
- 不读取 `.env`、`config.env`、credential、token、cookie、密钥文件或客户数据。
- 不修改 VCPChat 或 VCPToolBox。
- 不创建 IPC handler、preload、renderer 或 Adapter 执行入口。
- 不调用插件、API、DailyNote 或 VCP 记忆。
- 不创建图片文件。

## Required Prior Gates

```yaml
required_prior_gates:
  authorization_fill_exists: true
  filled_authorization_review_gate_exists: true
  filled_request_reviewed: false
  filled_request_approved: false
  root_path_redaction_confirmed: false
  exact_allowlist_redaction_confirmed: false
  reviewer_confirmed: false
  stop_conditions_confirmed: false
  post_read_boundaries_confirmed: false
```

本阶段样例仍保持所有人工批准状态为 `false`。未来只有用户单独授权并完成人工复核后，才能进入实际读取授权请求。

## Final Authorization Packet Shape

```yaml
final_authorization_packet:
  packet_id: string
  request_id: string
  review_id: string
  final_authorization_required: true
  final_authorization_requested: false
  final_authorization_granted: false
  authorized_by: null
  authorized_at: null
  root_path_redaction_confirmed: false
  exact_allowlist_redaction_confirmed: false
  allowed_source_categories_confirmed: false
  allowed_sanitized_output_fields_confirmed: false
  read_command_permission_confirmed: false
  reviewer_confirmed: false
  stop_conditions_confirmed: false
  post_read_boundaries_confirmed: false
  source_read_performed: false
  real_vcpchat_source_read: false
```

`authorized_by` 和 `authorized_at` 只能在未来独立授权点由用户明确批准后填写。本阶段不得填写。

## Read Command Preflight

未来真实读取命令即使被授权，也必须满足：

- 只读。
- 只针对精确 allowlist。
- 不递归扫描未授权目录。
- 不读取配置、日志、环境变量、credential 或客户数据。
- 不输出真实路径。
- 不输出 raw source。
- 不写文件。
- 不修改 VCPChat。
- 不启动 VCPChat。
- 不调用插件、API、DailyNote 或 VCP 记忆。

本阶段 `read_command_ready=false`。

## Allowed Output After Future Read

未来读取后的输出只能是中文脱敏摘要字段：

```yaml
allowed_future_read_output_fields:
  - sanitized_module_purpose_cn
  - sanitized_window_lifecycle_summary_cn
  - sanitized_ipc_channel_summary_cn
  - sanitized_preload_boundary_summary_cn
  - sanitized_schema_validation_summary_cn
  - sanitized_security_risk_notes_cn
  - sanitized_required_change_summary_cn
  - sanitized_stop_condition_summary_cn
  - sanitized_followup_question_cn
```

禁止输出 raw source、真实路径、endpoint 原文、环境变量值、secret 原文、私密路径、客户隐私、runtime log 原文、IPC payload 原文、raw plugin output 或图片二进制。

## Rejection Conditions

最终授权 preflight 必须拒绝以下情况：

- 缺少已填写授权包。
- 缺少人工复核记录。
- 路径未确认脱敏。
- allowlist 未确认脱敏。
- 读取命令权限未确认。
- 审查人未确认。
- 停止条件未确认。
- 读取后边界未确认。
- 请求保存真实路径或 raw source。
- 请求允许读取配置、日志、环境变量、credential 或客户数据。
- 请求允许递归扫描未授权目录。
- 请求允许修改 VCPChat 或 VCPToolBox。
- 请求允许创建 IPC handler、preload、renderer 或 Adapter 执行入口。
- 请求允许调用插件、API、DailyNote、VCP 记忆或文件系统写入。

## Acceptance

- final authorization preflight 文档存在。
- final authorization preflight contract 存在。
- final authorization preflight 样例存在。
- validation checklist 包含 v2.2 final authorization preflight 检查项。
- 样例保持 `final_authorization_requested=false`。
- 样例保持 `final_authorization_granted=false`。
- 样例保持 `source_read_authorized=false`。
- 样例保持 `source_read_performed=false`。
- 样例保持 `real_vcpchat_source_read=false`。
- 样例保持 `read_command_ready=false`。
- 样例保持 `exact_real_paths_stored_in_git=false`。
- 样例不包含真实路径、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v2_2_patch_04_real_vcpchat_one_time_read_authorization_request
  authorization_required: true
  explicit_user_action_required: true
  requires:
    - final_authorization_requested
    - final_authorization_granted
    - authorized_by
    - authorized_at
    - exact allowlist held outside git
    - read command permission
  forbidden_without_next_authorization:
    - read real VCPChat source
    - copy raw source
    - modify VCPChat
    - create IPC handler
    - create preload code
    - call plugin
    - call API
    - call DailyNote
    - write VCP memory
```

