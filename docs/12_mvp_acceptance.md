# 12 MVP 验收标准

## MVP-A：无执行闭环

必须完成：

- 生成 task_envelope。
- 生成 prompt_package。
- 生成 review_score。
- 人工评分覆盖 AI 评分。
- 生成 memory_delta。
- 生成 case_summary。
- 不调用真实插件。

## MVP-B：最小真实执行闭环

必须完成：

- Adapter dry-run 可用。
- Review Console 可打开 review_session。
- 可人工评分。
- 可批准 / 拒绝 memory_delta。
- 只接一个真实插件。
- 可回滚 dry-run。

## Phase 4：MVP-B dry-run integration planning

Phase 4 不是 MVP-B 真实执行实现，只规划进入 MVP-B 前的 dry-run integration 条件。

必须完成：

- `vcp_task_envelope` 明确 `mode=dry_run`。
- `vcp_task_envelope` 明确 `max_plugin_calls=0`、`allow_external_api=false`、`allow_file_write=false`、`allow_image_binary=false`。
- `vcp_dispatch_plan` 明确 `selected_plugin=null`、`execution_blocked=true`、`external_api_allowed=false`。
- Adapter preflight 流程写清字段检查、安全检查和拒绝路径。
- Gatekeeper 与 Review Console 的交接点写清。
- 未来单插件接入前置条件写清，但不选择真实插件。
- rollback 只定义为丢弃 dry-run 草案，不撤销真实外部动作。
- audit 只写中文脱敏摘要，不保存敏感原文。

Phase 4 不允许：

- 调用 API。
- 调用 VCP 插件。
- 写 DailyNote。
- 写文件或图片。
- 修改 VCPToolBox。
- 修改 VCPChat。
- 创建真实插件执行入口。

## 不通过条件

- 出现英文 DailyNote 正文。
- 出现真实 API key / token。
- 真实调用未通过审批。
- 图片大文件进入长期记忆。
- 子 Agent 没有 memory_delta。
