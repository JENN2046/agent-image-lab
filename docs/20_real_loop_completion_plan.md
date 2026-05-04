# 20 真实闭环完成计划

本文把 Agent Image Lab 从当前 dry-run 项目推进到真实闭环版。执行顺序固定为：先 Adapter，再真实插件，再 Photo Studio OS 首跑，最后 release。

## v0.4：可导出的 Adapter dry-run

目标：把项目内 `adapter_dry_run_lab` 收束成 VCPToolBox 导出草案。

完成标准：

- `exports/vcptoolbox/Plugin/AgentImageLabAdapter/dry-run-adapter.js` 存在。
- 该文件保留 `dryRun(input)` 模块 API；v0.5 允许增加 VCPToolBox stdio dry-run 包装，但仍不读文件、不写文件、不调用 API、不调用 VCP 插件、不写 DailyNote。
- `plugin-manifest.json` 保持 `dry-run-only`、`execution_blocked=true`、`max_plugin_calls=0`。
- Review Console handoff fixture 能说明 Adapter 输出如何展示，但不能触发执行。

## v0.5：VCPToolBox dry-run Adapter 授权安装

目标：在用户单独授权后，把 Adapter dry-run 草案安装到真实 VCPToolBox 进行 no-execution 验证。

进入条件：

- 用户明确授权目标 VCPToolBox 路径。
- 已确认备份和回滚方式。
- 只允许安装 Adapter dry-run 文件，不允许安装真实生图插件。
- 只允许调用 `dry_run`。

完成标准：

- `integrations/vcp/v0_5_adapter_install_verification.md` 形成中文脱敏安装验证记录。
- 真实插件调用次数为 0。
- 外部 API 调用为 0。
- DailyNote 写入为 0。
- 文件和图片写入为 0。
- accepted fixture 返回 `accepted_draft`，rejected fixture 返回 `rejected`。

当前结果：

- 已完成一次用户授权的 Adapter-only dry-run 安装验证。
- 目标工作线采用 VCPToolBox 现有预发布候选线；没有切分支、没有提交、没有推送。
- 未安装真实生图插件，未修改 Agent map、配置、DailyNote 或运行数据。

## v0.6：真实生图插件 manifest 授权审查

目标：在用户单独授权后，只读取一个真实生图插件 manifest，并只保存中文脱敏摘要。

进入条件：

- 用户指定唯一候选 manifest。
- 授权读取方式为只读。
- 明确允许摘录字段和禁止摘录字段。
- Gatekeeper 先确认读取范围。

完成标准：

- 形成 `manifest_reviewed_safe` 或 `rejected` 记录。
- 不保存 raw manifest 原文。
- 不保存密钥、token、endpoint、私密路径、客户隐私或运行日志。
- 不进入真实执行。

当前结果：

- 已完成一次用户授权的单一真实生图插件 manifest 只读脱敏审查。
- 记录位于 `integrations/vcp/v0_6_real_plugin_manifest_sanitized_review.md`。
- 候选可进入后续 dry-run 评估规划，但尚未完成 dry-run、尚未测试、尚未允许真实执行。

## v0.7：Photo Studio OS 最小真实闭环

目标：完成一次受控 Photo Studio OS 真实任务闭环。

进入条件：

- Adapter dry-run 已在 VCPToolBox 中通过 no-execution 验证。
- 单一真实插件 manifest 已完成脱敏审查。
- 用户授权真实插件、最大调用次数、输入引用、输出目录和回滚方案。
- Review Console 完成人工审批。

完成标准：

- 只执行一次最小任务。
- 只使用一个插件。
- 输出资产只记录路径引用、评分、摘要和规则。
- 不把图片二进制写入 Git 或 VCP 长期记忆。
- `memory_delta` 只生成写入申请，不直接写 DailyNote。

前置包完成标准：

- `integrations/vcp/v0_7_gatekeeper_risk_boundary.md` 明确高风险边界、拒绝条件和当前阻断状态。
- `review_console/v0_7_human_approval_preflight.md` 明确人工审批记录字段和禁止动作。
- `workflows/v0_7_real_execution_preflight_confirmation.md` 明确真实执行前用户必须再次授权的字段。
- 前置包默认保持 `real_execution_allowed=false`、`selected_plugin_for_execution=null`、`max_plugin_calls_authorized=0`。

当前结果：

- v0.7 前置包已可生成，但尚未获得真实执行授权。
- 下一步必须由用户单独授权真实插件、调用次数、输入引用、输出目录和回滚方案。

## v1.0：发布与验收

目标：形成可交付 release。

完成标准：

- README 写清安装、dry-run、审片、真实执行授权边界。
- release notes 写清 v0.4-v1.0 变化。
- `scripts/validate_mvp.ps1` 通过。
- Review Console、Adapter、manifest 审查、真实闭环都有验收记录。
- 打 tag 并生成发布包。

## 永久停止条件

出现以下任一情况必须停止推进并回滚到上一个 dry-run 草案：

- 发现密钥、token、cookie、密码、私密路径或客户隐私。
- 真实插件调用超出授权次数。
- 输出目录不明确。
- 插件尝试写 DailyNote 或长期记忆。
- 插件尝试保存未授权图片或运行日志。
- Gatekeeper 或人工审批拒绝。
