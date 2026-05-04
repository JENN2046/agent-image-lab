# Photo Studio OS 最小真实闭环 Runbook

本文定义 v0.7 的 Photo Studio OS 最小真实闭环步骤。当前文件只是 runbook，不调用插件、不调用 API、不写 DailyNote、不创建图片。

## 进入条件

- VCPToolBox Adapter dry-run 已通过 v0.5 no-execution 验收。
- 单一真实生图插件 manifest 已通过 v0.6 脱敏审查。
- v0.7 Gatekeeper 风险边界已形成，见 `integrations/vcp/v0_7_gatekeeper_risk_boundary.md`。
- v0.7 Review Console 人工审批前置记录已形成，见 `review_console/v0_7_human_approval_preflight.md`。
- v0.7 真实执行前确认表已形成，见 `workflows/v0_7_real_execution_preflight_confirmation.md`。
- 用户授权真实插件、最大调用次数、输入引用、输出目录和回滚方案。
- Gatekeeper 和 Review Console 均已批准。

当前 v0.7 前置状态仍为 `waiting_for_user_real_execution_authorization`。未获得新的真实执行授权前，本 runbook 不得进入执行步骤 6。

## 执行步骤

1. 创建 Photo Studio OS `task_envelope`。
2. Adapter dry-run 生成 `dispatch_plan_draft`。
3. Gatekeeper 复查最大调用次数、输出目录、回滚方案。
4. Review Console 展示执行申请。
5. 用户确认一次真实执行。
6. 调用单一插件一次。
7. Review Console 完成人工评分和资产状态决定。
8. Archivist 生成 `image_case` 和 `memory_delta` 草案。
9. 只记录输出路径、评分、摘要和规则。

## 禁止

- 不把图片二进制写入 Git。
- 不把图片二进制写入 VCP 长期记忆。
- 不绕过 Review Console 写 DailyNote。
- 不调用第二个插件。
- 不超过授权调用次数。

## 停止条件

- 插件需要未授权 API、文件写入或 DailyNote 写入。
- 输出目录不存在或不明确。
- 出现密钥、token、私密路径或客户隐私。
- Gatekeeper 或人工审批拒绝。

## v0.7 前置验收

- Gatekeeper 当前结论必须是 `blocked_until_authorized` 或后续明确人工批准。
- Review Console 当前结论必须是 `pending` 或后续明确人工批准。
- 真实执行前确认表必须保持 `real_execution_allowed=false`，直到用户另行授权。
- `memory_delta` 必须保持 `write_mode=draft`，不直接写 DailyNote。
