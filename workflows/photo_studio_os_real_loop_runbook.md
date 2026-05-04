# Photo Studio OS 最小真实闭环 Runbook

本文定义 v0.7 的 Photo Studio OS 最小真实闭环步骤。当前文件只是 runbook，不调用插件、不调用 API、不写 DailyNote、不创建图片。

## 进入条件

- VCPToolBox Adapter dry-run 已通过 v0.5 no-execution 验收。
- 单一真实生图插件 manifest 已通过 v0.6 脱敏审查。
- 用户授权真实插件、最大调用次数、输入引用、输出目录和回滚方案。
- Gatekeeper 和 Review Console 均已批准。

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
