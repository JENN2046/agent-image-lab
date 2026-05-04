# v0.7 Gatekeeper Risk Boundary

本文定义 Photo Studio OS 最小真实闭环前的 Gatekeeper 风险边界。当前文件只形成真实执行前置审查，不调用插件、不调用 API、不写 DailyNote、不写文件、不创建图片。

## 审查对象

```yaml
gatekeeper_scope:
  phase: v0.7_preflight
  business_scenario: Photo Studio OS
  candidate_id: DoubaoGen
  manifest_review_status: manifest_reviewed_safe
  dry_run_status: not_completed
  real_execution_authorized: false
```

## 风险等级

```yaml
risk_boundary:
  overall_risk_level: high
  reason_cn:
    - "候选插件属于真实图像生成链路，后续真实执行可能触发外部服务、消耗额度并产生图片资产。"
    - "v0.6 仅完成 manifest 脱敏审查，尚未完成 dry-run 评估、真实输出目录确认或回滚演练。"
    - "manifest 审查已发现凭据类配置声明和服务地址类配置声明，真实执行前必须确认凭据注入方式和 endpoint 脱敏边界。"
```

## 必须批准的边界

进入真实执行前必须全部满足：

```yaml
required_approvals:
  user_real_execution_authorization:
    required: true
    current_status: pending
  selected_plugin_confirmation:
    required: true
    current_status: pending
  max_plugin_calls_confirmation:
    required: true
    current_status: pending
    default_until_approved: 0
  controlled_input_reference:
    required: true
    current_status: pending
  controlled_output_directory:
    required: true
    current_status: pending
  rollback_plan:
    required: true
    current_status: pending
  review_console_human_approval:
    required: true
    current_status: pending
  memory_write_boundary:
    required: true
    current_status: pending
```

## 必须拒绝的情况

Gatekeeper 发现以下任一情况必须拒绝：

- 没有用户单独授权真实执行。
- 真实执行插件、最大调用次数、输入引用或输出目录不明确。
- 输出目录不可控、不可回滚或可能覆盖现有资产。
- 插件需要未授权 API、未授权文件写入或直接写 DailyNote。
- 请求中包含密钥、token、cookie、密码、私密路径或客户隐私原文。
- 请求要求保存图片二进制到 Git、DailyNote 或 VCP 长期记忆。
- Review Console 没有人工审批记录。
- 回滚方案只写“重试”而没有恢复路径。

## 当前结论

```yaml
gatekeeper_decision:
  status: blocked_until_authorized
  real_execution_allowed: false
  selected_plugin_for_execution: null
  max_plugin_calls_authorized: 0
  api_call_authorized: false
  daily_note_write_authorized: false
  file_write_authorized: false
  image_file_creation_authorized: false
  decision_cn: "v0.7 前置风险边界已定义，但真实执行尚未授权。"
```

## 后续允许推进

本文件完成后，只允许进入 Review Console 人工审批记录和真实执行前确认表的准备阶段。不得直接调用真实插件。
