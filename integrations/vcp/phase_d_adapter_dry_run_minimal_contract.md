# Phase D Adapter Dry-Run Minimal Contract

本文定义 Phase D 的 Adapter dry-run 最小实现形状。当前文件是实现契约，不是 VCP 插件实现，不创建 `index.js`，不安装到真实 VCPToolBox，不调用任何真实插件、API、DailyNote 或文件写入。

## 目标

Phase D 的目标是把前期 dry-run 规划收束成一个最小、可验证、无外部动作的 Adapter dry-run 接口。

它只做：

- 输入字段检查。
- no-execution 不变量检查。
- 敏感字段拒绝。
- 生成 `vcp_dispatch_plan` 草案。
- 生成 Gatekeeper handoff 草案。
- 生成 Review Console handoff 草案。
- 生成中文脱敏 audit summary。

它不做：

- 选择真实插件。
- 调用真实插件。
- 调用外部 API。
- 读取真实 manifest。
- 写文件、写图片或写 DailyNote。
- 写 VCP 长期记忆。
- 修改 VCPToolBox 或 VCPChat。

## 最小命令

唯一允许命令：

```text
dry_run
```

所有其他命令必须拒绝：

```text
execute
generate
run
call_plugin
write_memory
write_image_file
read_manifest
```

## 输入对象

最小输入对象：

```yaml
adapter_dry_run_request:
  command: dry_run
  request_id: dry-run-request-placeholder-001
  task_envelope:
    task_id: task-placeholder-001
    task_type: photo_studio_os_review
    mode: dry_run
    user_request_cn: "中文需求摘要。"
    prompt_package_ref: prompt-package-placeholder-001
    dry_run_controls:
      max_plugin_calls: 0
      allow_external_api: false
      allow_file_write: false
      allow_image_binary: false
    approval_context:
      gatekeeper_required: true
      review_console_required: true
      daily_note_direct_write_allowed: false
    safety:
      contains_secret: false
      contains_private_path: false
      contains_customer_private_data: false
      contains_image_binary: false
```

## 输入拒绝条件

出现以下任一条件，必须返回 rejected dry-run response：

- `command` 不是 `dry_run`。
- `mode` 不是 `dry_run`。
- `max_plugin_calls` 不是 `0`。
- `allow_external_api=true`。
- `allow_file_write=true`。
- `allow_image_binary=true`。
- `daily_note_direct_write_allowed=true`。
- `contains_secret=true`。
- `contains_private_path=true`。
- `contains_customer_private_data=true`。
- `contains_image_binary=true`。
- 输入中要求真实插件名、真实 manifest 读取、真实 API 调用或真实图片输出。

拒绝结果必须只写中文脱敏原因，不复制敏感原文。

## 成功响应

最小成功响应：

```yaml
adapter_dry_run_response:
  request_id: dry-run-request-placeholder-001
  status: accepted_draft
  dispatch_plan_draft:
    dispatch_id: dispatch-placeholder-001
    task_id: task-placeholder-001
    mode: dry_run
    selected_plugin: null
    fallback_plugins: []
    capability_matrix_status: manifest_reviewed_safe
    reason_cn: "仅生成 dry-run 调度草案，未选择真实插件。"
    dry_run_required: true
    approval_required: true
    execution_blocked: true
    external_api_allowed: false
    gatekeeper_required: true
    review_console_required: true
    allow_file_write: false
    allow_image_binary: false
    max_plugin_calls: 0
    expected_outputs: 0
    max_outputs: 0
  gatekeeper_handoff:
    required: true
    display_only: true
    risk_level: medium
    risk_summary_cn: "候选仍处于 dry-run 草案状态，不能执行。"
    blocked_actions:
      - execute
      - call_plugin
      - call_api
      - write_daily_note
      - write_image_file
  review_console_handoff:
    required: true
    display_only: true
    allowed_actions:
      - mark_candidate
      - reject_candidate
      - request_manifest_authorization
      - request_gatekeeper_review
    forbidden_actions:
      - execute_plugin
      - call_api
      - write_daily_note
      - save_image
  audit_record:
    audit_summary_cn: "仅完成 Adapter dry-run 草案生成，未调用插件、API、DailyNote 或文件写入。"
    contains_sensitive_original: false
    max_plugin_calls_observed: 0
    external_api_observed: false
    file_write_observed: false
    image_binary_observed: false
```

## 拒绝响应

最小拒绝响应：

```yaml
adapter_dry_run_response:
  request_id: dry-run-request-placeholder-001
  status: rejected
  rejection_reason_cn: "输入不满足 no-execution 不变量，已拒绝生成 dispatch 草案。"
  execution_blocked: true
  selected_plugin: null
  max_plugin_calls: 0
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  file_write_performed: false
  image_file_created: false
```

## 实现位置边界

Phase D 的最小实现如果后续创建，只能先放在项目内的非导出实验目录，例如：

```text
adapter_dry_run_lab/
```

不得直接放入：

```text
exports/vcptoolbox/Plugin/AgentImageLabAdapter/index.js
```

原因：`exports/vcptoolbox/` 当前只是导出草案，不代表真实 VCPToolBox 已安装或可执行。

## 验收不变量

Phase D 必须保持：

```yaml
selected_plugin: null
max_plugin_calls: 0
external_api_allowed: false
execution_blocked: true
api_called: false
vcp_plugin_called: false
daily_note_called: false
file_write_performed: false
image_file_created: false
```

即使 dry-run response 为 `accepted_draft`，也不代表允许真实执行。

`capability_matrix_status=manifest_reviewed_safe` 只表示 Phase C 脱敏审查已通过；如果候选仍处于 `pending_manifest_review`，Adapter dry-run lab 必须保持 display-only，并由 Gatekeeper 决定是否拒绝或要求补审查。
