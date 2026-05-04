# v0.7 Review Console Human Approval Preflight

本文定义 Photo Studio OS 最小真实闭环前，Review Console 必须呈现和记录的人工审批内容。当前文件只定义审批记录结构，不实现 UI、不调用插件、不调用 API、不写 DailyNote、不写文件、不创建图片。

## 审批原则

- Review Console 只能展示 `review_session_draft`、`dispatch_plan_draft`、Gatekeeper 风险摘要和 memory 写入草案。
- `approve_as_candidate` 不等于真实执行授权。
- `accepted_draft` 不等于真实执行授权。
- 真实执行前必须出现人工审批人、审批时间、最大调用次数、输出目录、回滚方案和停止条件确认。
- `memory_delta` 只能生成写入申请，不得直接写 DailyNote。

## 审批记录模板

```yaml
review_console_human_approval_preflight:
  phase: v0.7_preflight
  review_session_id: review-session-photo-studio-os-v0-7-preflight-001
  candidate_id: DoubaoGen
  manifest_review_status: manifest_reviewed_safe
  gatekeeper_status: blocked_until_authorized
  human_approval:
    execution_approval_status: pending
    approved_by: null
    approved_at: null
    approved_max_plugin_calls: 0
    approved_output_directory_ref: null
    rollback_plan_approved: false
    stop_conditions_approved: false
  allowed_actions_before_approval:
    - view_gatekeeper_boundary
    - request_changes
    - reject_execution_request
    - request_user_authorization
  forbidden_actions_before_approval:
    - execute_plugin
    - call_api
    - write_daily_note
    - save_image
    - increase_plugin_call_limit
```

## 必须展示给人工审批人的内容

- 候选插件的中文脱敏 manifest 审查摘要。
- Gatekeeper 风险等级和拒绝条件。
- 计划中的最大插件调用次数。
- 输入引用，不展示客户隐私或敏感原文。
- 输出目录引用，不展示私密路径原文。
- 回滚方案摘要。
- 图片二进制和长期记忆写入边界。
- `memory_delta` 草案，默认 `write_mode=draft`。

## 当前结论

```yaml
review_console_decision:
  execution_approval_status: pending
  real_execution_allowed: false
  selected_plugin_for_execution: null
  max_plugin_calls_authorized: 0
  daily_note_called: false
  vcp_plugin_called: false
  image_file_created: false
  note_cn: "Review Console 前置审批记录已定义，尚未获得人工真实执行批准。"
```
