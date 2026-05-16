# 静态原型字段映射

本文件用于验收 Phase 2 静态原型的草案输出是否能映射到核心 schema。它只描述字段关系，不代表真实写入、真实入库或真实插件执行。

## review_session 映射

| schema 字段 | 静态原型来源 | 说明 |
| --- | --- | --- |
| `session_id` | `mock_data.js.review_session.session_id` | 审片会话 ID |
| `task_id` | `mock_data.js.review_session.task_id` | 关联任务 ID |
| `case_id` | `mock_data.js.review_session.case_id` | 关联案例 ID |
| `project` | `mock_data.js.review_session.project` | 项目名 |
| `status` | `mock_data.js.review_session.status` | 当前状态 |
| `image_versions` | `mock_data.js.review_session.image_versions` | 仅使用占位路径，不引用真实图片 |
| `current_version_id` | `state.currentVersionId` | 由版本按钮切换 |
| `compare_version_id` | `mock_data.js.review_session.compare_version_id` | 对比版本 |
| `ai_review` | `mock_data.js.review_session.ai_review` | AI 评分只是建议 |
| `human_review` | 评分滑块生成 | 人工评分覆盖 AI 评分 |
| `final_review` | `buildReviewSession()` | 固定优先采用 `human_review` |
| `comments` | mock 评论 + 页面新增中文评论 | 评论正文必须中文 |
| `annotation_notes` | `mock_data.js.review_session.annotation_notes` | MVP 仅文字批注 |
| `version_comparison` | `mock_data.js.review_session.version_comparison` | 版本差异摘要 |
| `approval` | 审批按钮状态 | 仅生成审批草案 |
| `archive_decision` | 资产审批按钮状态 | AI 入库建议不能替代人工批准 |
| `memory_preview` | 页面标题 / 正文输入 + mock 安全字段 | 只作为中文预览 |
| `memory_approval` | 记忆审批按钮状态 | 未 approved 时不得调用 DailyNote |
| `next_iteration` | `mock_data.js.review_session.next_iteration` | 下一轮中文建议 |
| `audit_log` | mock 审计 + 草案刷新记录 | 仅记录静态原型操作摘要 |

## image_case 映射

| schema 字段 | 静态原型来源 | 说明 |
| --- | --- | --- |
| `case_id` / `task_id` / `project` | `state` | 与 review_session 保持一致 |
| `image_type` | 固定 mock 文本 | Photo Studio OS dashboard |
| `input_assets` | `image_case_seed.input_assets` | 占位路径 |
| `output_assets` | 当前版本 `asset_ref` | 占位路径 |
| `plugin_used` | `null` | 静态原型不调用插件 |
| `prompt_package_id` | `image_case_seed.prompt_package_id` | 占位 ID |
| `review_ids` | `image_case_seed.review_ids` | 占位 ID |
| `final_score` | 人工评分总分 | 人工评分优先 |
| `asset_status` | 资产审批按钮状态 | `accepted` 必须人工批准 |
| `human_approval` | 资产审批按钮状态 | 未批准时不允许 accepted |
| `strengths_cn` / `weaknesses_cn` / `reusable_rules_cn` | `image_case_seed` | 中文摘要 |
| `memory_entries` | 固定 mock delta ID | 仅草案引用 |
| `git_promotion_candidate` | `false` | 不自动升级 Git 规则 |

## memory_delta 映射

| schema 字段 | 静态原型来源 | 说明 |
| --- | --- | --- |
| `delta_id` | 固定 mock ID | 仅草案 |
| `task_id` / `case_id` / `project` | `state` | 与 review_session 保持一致 |
| `agent_name` / `agent_role` | 固定静态原型署名 | 明确不是正式 VCP Agent |
| `target_notebook` | `memory_preview.target_notebook` | 目标记忆本 |
| `write_mode` | `memory_approval.status` 推导 | approved 为 confirmed，rejected 为 forbidden，其余为 draft |
| `approval_status` / `approved_by` / `approved_at` | 记忆审批按钮状态 | approved 时才有审批人和审批时间 |
| `chinese_diary_title` / `chinese_diary_content` | 页面输入 | 正文必须中文 |
| `preserved_original` | 空值和占位路径 | 不保留敏感原文 |
| `tags` | `memory_preview.tags` | 不包含敏感原文 |
| `memory_safety` | `memory_preview.safety` | 全部为安全 mock 标记 |
| `promotion` | 固定 false | 不自动升级 Git 规则 |
| `final_decision.should_write_to_vcp` | `memory_approval.status === approved` | 未 approved 时为 false |

## Phase 9 审批记录映射

本节用于规划单插件候选 no-execution 评估进入 Review Console 后的审批记录映射。它只描述草案字段关系，不读取真实 manifest，不选择真实插件，不调用 VCP 插件、API、DailyNote 或文件写入。

| Phase 9 来源 | Review Console 字段 | 说明 |
| --- | --- | --- |
| `phase9_single_plugin_dry_run_package.package_metadata` | `review_session.task_id` / `case_id` / `project` / `audit_log` | 只记录占位候选和测试包草案来源 |
| `candidate_snapshot.candidate_id` | `approval.candidate_id` | 使用 `candidate-plugin-placeholder-001` 等占位 ID，不记录真实插件名 |
| `candidate_snapshot.manifest_review_status` | `approval.manifest_review_status` | 未授权读取前保持 `pending_manifest_review` |
| `manifest_review_gate.source_authorized` | `approval.source_authorized` | 默认 `false`，不能代表已授权读取 |
| `manifest_review_gate.source_read_performed` | `approval.source_read_performed` | 默认 `false`，不能代表已读取真实 manifest |
| `dispatch_plan_draft` | `audit_log.dispatch_guard` | 固定展示 `selected_plugin=null`、`max_plugin_calls=0`、`execution_blocked=true` |
| `gatekeeper_review_draft` | `approval.gatekeeper_status` / `audit_log` | 只记录 Gatekeeper 待复查状态和中文脱敏风险摘要 |
| `review_console_handoff_draft.allowed_actions` | `approval.allowed_actions` | 只允许标记候选、拒绝候选、申请 manifest 授权、请求 Gatekeeper 复查、请求记忆修改 |
| `review_console_handoff_draft.forbidden_actions` | `approval.forbidden_actions` | 必须禁止执行插件、调用 API、写 DailyNote、保存图片 |
| `phase9_manifest_authorization_precheck.authorization_request` | `approval.manifest_authorization_request` | 只生成授权申请草案，不触发读取 |
| `phase9_manifest_authorization_precheck.approval_chain` | `approval.approval_chain` | `approval_status=pending` 时不得推进状态 |
| `memory_delta_draft` | `memory_preview` / `memory_approval` | `memory_approval.status=pending` 时只能生成 `write_mode=draft` 的记忆草案 |

Phase 9 审批记录必须满足：

- `archive_decision.asset_status` 只能是 `candidate`、`rejected` 或 `draft`，未人工批准时不得是 `accepted`。
- `archive_decision.human_approval.approved=false` 时，AI 建议不能替代人工批准。
- `memory_approval.status` 未等于 `approved` 时，`memory_delta.write_mode=draft` 且 `final_decision.should_write_to_vcp=false`。
- `audit_log` 必须保留 no-execution 证据：未读取真实源、未调用插件、未调用 API、未调用 DailyNote、未写文件、未创建图片。
- 任何审批记录都不得复制真实 manifest 原文、密钥、token、cookie、密码、私密路径、客户隐私或客户未公开信息。
- Review Console 的审批动作只能生成草案或授权请求，不能直接执行真实插件或写入长期记忆。

## v5.3 Adapter Dry-Run Handoff 映射

本节用于验收 Adapter dry-run 输出进入静态 Review Console 草案输出的最小 handoff surface。它只读取项目内 fixture，不调用真实 VCP 插件、API、DailyNote 或文件写入。

| Adapter dry-run 字段 | Review Console 字段 | 说明 |
| --- | --- | --- |
| `adapter_dry_run_response.status` | `adapter_dry_run_handoff.status` | 必须为 `accepted_draft`，只代表草案可展示 |
| `dispatch_plan_draft` | `adapter_dry_run_handoff.dispatch_plan_draft` | 固定 `selected_plugin=null`、`max_plugin_calls=0`、`execution_blocked=true` |
| `gatekeeper_handoff` | `adapter_dry_run_handoff.gatekeeper_handoff` | 只显示 Gatekeeper 风险摘要和阻断动作 |
| `review_console_handoff.allowed_actions` | `adapter_dry_run_handoff.review_console_handoff.allowed_actions` | 只允许标记候选、拒绝候选、请求 Gatekeeper 复查和请求记忆修改 |
| `review_console_handoff.forbidden_actions` | `adapter_dry_run_handoff.review_console_handoff.forbidden_actions` | 必须禁止执行插件、调用 API、写 DailyNote、保存图片 |
| `audit_record` | `adapter_dry_run_handoff.audit_record` | 只保存中文脱敏审计摘要 |
| `no_execution_guard` | `adapter_dry_run_handoff.no_execution_guard` | 所有执行副作用字段必须保持 false 或 0 |

`accepted_draft` 不等于真实执行授权。静态 Review Console 只能展示 handoff 和审批动作草案，不能触发插件执行、API 调用、DailyNote 写入、文件写入或图片创建。

## v14.041 Review Result Protocol Static Handoff 映射

本节用于验收 PVOS adapter 输出中的硬审片结果协议进入静态 Review Console 草案输出。它只读取项目内 fixture，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote，不写文件，不保存图片。

| PVOS adapter / protocol 字段 | Review Console 草案字段 | 说明 |
| --- | --- | --- |
| `review_result_protocol_report.candidate_review_results` | `review_result_protocol_static_handoff.candidate_review_results` | 每个候选必须有 `review_outcome`、`pass_reasons` 或 `reject_reasons` |
| `review_result_protocol_report.report_summary` | `review_result_protocol_static_handoff.report_summary` | 必须保留 `pass_count`、`reject_count`、`never_production_count` |
| `review_result_protocol_handoff_draft.required_review_fields` | `review_result_protocol_static_handoff.required_review_fields` | 静态审片台必须展示/携带 `review_outcome`、`pass_reasons`、`reject_reasons`、`memory_route`、`production_route` |
| pass candidate `memory_route` | `candidate_review_results[].memory_route` | pass 只能进入 `draft_memory_candidate`，且不得直接写 DailyNote 或 VCP memory |
| reject candidate `memory_route` | `candidate_review_results[].memory_route` | reject 只能进入 `audit_only_failure_learning` 草案 |
| reject candidate `production_route.status` | `candidate_review_results[].production_route.status` | 带 mapped failure tags 的 reject 必须是 `never_production` |
| `production_candidate_created` | `review_result_protocol_static_handoff.report_summary.production_candidate_created` | 必须为 `false` |

静态 Review Console 只能生成草案输出；协议 pass 不等于生产批准，协议 reject 不得被 promotion 流程绕过。任何 `never_production` 候选都只能作为失败学习或审计信息，不能进入 production。

## 原型防越界标记

草案输出包含：

```json
{
  "prototype_guard": {
    "api_called": false,
    "daily_note_called": false,
    "vcp_plugin_called": false,
    "disk_write_performed": false,
    "image_file_created": false
  }
}
```

该标记只用于人工验收，不代表运行时权限。
