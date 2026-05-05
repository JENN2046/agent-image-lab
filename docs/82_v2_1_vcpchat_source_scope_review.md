# 82 v2.1 VCPChat Source Scope Review

本文定义 Agent Image Lab v2.1 第三阶段的真实 VCPChat 源码读取范围审查规划。该阶段仍然只在本仓库内补齐范围审查文档、contract、样例和验收清单，不读取真实 VCPChat 源码，不写真实本地路径，不复制源码片段，不修改真实 VCPChat，不创建 IPC handler，不调用插件、API 或 DailyNote。

## Scope Review Decision

```yaml
v2_1_vcpchat_source_scope_review:
  status: scope_review_plan_only
  user_authorized: false
  source_read_performed: false
  real_vcpchat_source_read: false
  real_vcpchat_modified: false
  exact_real_paths_listed: false
  raw_source_copy_allowed: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  real_execution_allowed: false
```

## Goal

本阶段只规划未来可能读取的 VCPChat 源码类别，不列真实文件路径。目标是让下一次真实读取授权可以更精确地说明“读什么、为什么读、允许摘录什么、禁止摘录什么”。

本阶段产出应回答：

- 哪些源码类别未来可能与 Review Console 嵌入有关。
- 每类源码的读取目的是什么。
- 每类源码只能输出哪些中文脱敏摘要。
- 每类源码必须避开哪些敏感内容。
- 什么条件下不得进入真实读取。

## Non-goals

本阶段不做以下事项：

- 不读取真实 VCPChat 源码。
- 不列真实 VCPChat 本地路径。
- 不复制真实源码片段。
- 不读取真实配置、日志、环境变量或用户数据。
- 不修改真实 VCPChat 或 VCPToolBox。
- 不创建真实 IPC handler。
- 不创建 preload 可执行代码。
- 不调用插件、API、DailyNote 或文件系统。
- 不创建图片文件。

## Candidate Source Categories

未来可申请读取的候选类别只能是类别名，不是路径：

```yaml
candidate_source_categories:
  review_console_child_window_candidate:
    purpose_cn: "确认未来子窗口承载 Review Console 的生命周期和边界。"
    current_read_allowed: false
  ipc_handler_candidate:
    purpose_cn: "确认未来 IPC handler 的注册方式、sender 校验和 channel allowlist 接入点。"
    current_read_allowed: false
  preload_boundary_candidate:
    purpose_cn: "确认未来 preload allowlist API 的暴露边界。"
    current_read_allowed: false
  window_lifecycle_candidate:
    purpose_cn: "确认未来窗口创建、销毁、路由和来源校验边界。"
    current_read_allowed: false
  schema_bridge_candidate:
    purpose_cn: "确认 review_session 草案与 host payload 的 schema 校验衔接点。"
    current_read_allowed: false
```

`current_read_allowed=false` 表示这些类别只是未来授权候选，不代表已经允许读取。

## Allowed Sanitized Outputs

未来即使读取真实源码，也只能输出中文脱敏摘要：

```yaml
allowed_sanitized_outputs:
  - sanitized_module_purpose_cn
  - sanitized_window_lifecycle_summary_cn
  - sanitized_ipc_channel_summary_cn
  - sanitized_preload_boundary_summary_cn
  - sanitized_schema_validation_summary_cn
  - sanitized_security_risk_notes_cn
  - sanitized_required_change_summary_cn
```

不得输出 raw source、真实路径、endpoint 原文、环境变量值、运行日志原文、IPC payload 原文或客户隐私。

## Forbidden Scope

未来范围审查必须排除：

- 配置文件原文。
- 环境变量文件。
- credential 文件。
- cookie、token、key、密码。
- 客户数据、聊天记录、用户隐私和客户未公开信息。
- endpoint 原文。
- raw runtime log。
- raw IPC payload。
- raw plugin output。
- 图片、音频、视频或二进制资产。
- 与 Review Console 嵌入无关的业务模块。

## Authorization Preconditions

进入真实源码读取前必须补齐：

```yaml
authorization_preconditions:
  required_before_future_read:
    - user authorization recorded
    - exact source categories selected
    - exact real paths approved
    - allowed extract fields approved
    - forbidden extract fields approved
    - sensitive path redaction required
  raw_source_copy_allowed: false
  reviewer_and_stop_plan_required:
    - reviewer assigned
    - rollback or stop plan defined
```

任何一项未满足，都不得读取真实 VCPChat 源码。

## Rejection Conditions

出现任一情况时，必须拒绝推进：

- 试图在本阶段读取真实 VCPChat 源码。
- 试图在本阶段列真实本地路径。
- 试图复制 raw source。
- 试图读取配置、日志、环境变量或用户数据。
- 试图把源码读取授权解释为 VCPChat 修改授权。
- 试图把源码读取授权解释为插件、API、DailyNote 或文件系统调用授权。
- 试图把审查摘要写入 DailyNote 或 VCP 长期记忆。

## Acceptance

- source scope review 文档存在。
- source scope review contract 存在。
- source scope review 样例存在。
- validation checklist 包含 v2.1 source scope review 检查项。
- 样例保持 `user_authorized=false`。
- 样例保持 `source_read_performed=false`。
- 样例保持 `real_vcpchat_source_read=false`。
- 样例保持 `exact_real_paths_listed=false`。
- 样例保持 `raw_source_copy_allowed=false`。
- 不包含真实路径、真实源码片段、endpoint 原文、secret 或客户隐私。

## Next Authorization Point

```yaml
next_authorization_point:
  authorization_name: v2_1_patch_04_real_vcpchat_read_preflight
  authorization_required: true
  allowed_after_authorization:
    - select one or more candidate source categories
    - define exact future real path allowlist
    - define sanitized extract fields
    - assign reviewer and stop conditions
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
