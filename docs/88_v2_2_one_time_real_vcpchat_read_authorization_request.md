# 88 v2.2 One-time Real VCPChat Read Authorization Request

本文定义 Agent Image Lab v2.2 第四阶段的“一次性真实 VCPChat 只读读取授权请求模板”。该阶段只创建未来一次性读取授权的请求记录形态，不读取真实 VCPChat，不读取真实 VCPToolBox，不复制 raw source，不创建 IPC handler，不调用插件、API、DailyNote 或文件系统。

## Request Decision

```yaml
v2_2_one_time_real_vcpchat_read_authorization_request:
  status: one_time_read_request_template_only
  one_time_read_requested: false
  one_time_read_authorized: false
  source_read_authorized: false
  source_read_performed: false
  real_vcpchat_source_read: false
  exact_real_paths_stored_in_git: false
  raw_source_copy_allowed: false
  read_command_approved: false
  real_execution_allowed: false
```

## Goal

本阶段把 v2.2 Patch 03 的“最终授权 preflight”推进到“一次性只读读取授权请求模板”。它用于未来在用户明确授权时限定：

- 读取只发生一次。
- 读取只针对精确 allowlist。
- 读取命令只读。
- 输出只能是中文脱敏摘要。
- 真实路径不得写入 Git。
- raw source 不得复制。
- 读取完成后不得自动修改 VCPChat。

本阶段只补齐模板，不执行读取。

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

## Required Preflight Inputs

```yaml
required_preflight_inputs:
  final_authorization_preflight_exists: true
  final_authorization_requested: false
  final_authorization_granted: false
  authorized_by: null
  authorized_at: null
  root_path_redaction_confirmed: false
  exact_allowlist_redaction_confirmed: false
  read_command_permission_confirmed: false
  reviewer_confirmed: false
  stop_conditions_confirmed: false
  post_read_boundaries_confirmed: false
```

本阶段样例仍保持授权未请求、未批准。未来只有这些输入全部在独立授权中通过，才能进入一次性读取执行 preflight。

## One-time Request Shape

```yaml
one_time_read_request:
  request_id: string
  based_on_final_preflight_packet_id: string
  one_time_read_required: true
  one_time_read_requested: false
  one_time_read_authorized: false
  authorized_by: null
  authorized_at: null
  read_scope_ref: redacted_allowlist_reference
  exact_real_paths_stored_in_git: false
  read_command_approved: false
  read_command_id: null
  read_attempt_limit: 1
  source_read_performed: false
  real_vcpchat_source_read: false
  raw_source_copy_allowed: false
  real_execution_allowed: false
```

`read_scope_ref` 只能引用脱敏 allowlist 标识，不得包含真实路径。`read_command_id` 只能在未来独立授权点绑定只读命令，不得在本阶段填写。

## One-time Read Constraints

未来一次性读取即使被授权，也必须满足：

- 读取次数最多一次。
- 只读。
- 只读取精确 allowlist。
- 不递归扫描未授权目录。
- 不读取配置、日志、环境变量、credential 或客户数据。
- 不输出真实路径。
- 不输出 raw source。
- 不写文件。
- 不启动 VCPChat。
- 不修改 VCPChat 或 VCPToolBox。
- 不创建 IPC handler、preload、renderer 或 Adapter 执行入口。
- 不调用插件、API、DailyNote 或 VCP 记忆。

## Allowed Result Shape

未来读取完成后的结果只允许保存脱敏摘要：

```yaml
allowed_one_time_read_result:
  read_attempt_id: string
  source_read_performed: boolean
  sanitized_module_purpose_cn: string
  sanitized_window_lifecycle_summary_cn: string
  sanitized_ipc_channel_summary_cn: string
  sanitized_preload_boundary_summary_cn: string
  sanitized_schema_validation_summary_cn: string
  sanitized_security_risk_notes_cn: string
  sanitized_required_change_summary_cn: string
  sanitized_stop_condition_summary_cn: string
  raw_source_copied: false
  real_local_path_copied: false
```

禁止保存 raw source、真实路径、endpoint 原文、环境变量值、secret 原文、私密路径、客户隐私、runtime log 原文、IPC payload 原文、raw plugin output 或图片二进制。

## Rejection Conditions

一次性读取授权请求必须拒绝以下情况：

- 未通过最终授权 preflight。
- 缺少明确 `authorized_by` 或 `authorized_at`。
- 请求保存真实路径或 raw source。
- 请求读取配置、日志、环境变量、credential 或客户数据。
- 请求递归扫描未授权目录。
- 请求读取次数超过一次。
- 请求允许写文件、启动 VCPChat 或修改 VCPChat。
- 请求允许创建 IPC handler、preload、renderer 或 Adapter 执行入口。
- 请求允许调用插件、API、DailyNote、VCP 记忆或图片写入。

## Acceptance

- one-time real VCPChat read authorization request 文档存在。
- one-time real VCPChat read authorization request contract 存在。
- one-time real VCPChat read authorization request 样例存在。
- validation checklist 包含 v2.2 one-time read authorization request 检查项。
- 样例保持 `one_time_read_requested=false`。
- 样例保持 `one_time_read_authorized=false`。
- 样例保持 `source_read_authorized=false`。
- 样例保持 `source_read_performed=false`。
- 样例保持 `real_vcpchat_source_read=false`。
- 样例保持 `read_command_approved=false`。
- 样例保持 `read_attempt_limit=1`。
- 样例保持 `exact_real_paths_stored_in_git=false`。
- 样例不包含真实路径、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v2_2_patch_05_one_time_real_vcpchat_read_execution_preflight
  authorization_required: true
  explicit_user_action_required: true
  requires:
    - one_time_read_authorized
    - authorized_by
    - authorized_at
    - read_command_approved
    - read scope held outside git
    - stop conditions accepted
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

