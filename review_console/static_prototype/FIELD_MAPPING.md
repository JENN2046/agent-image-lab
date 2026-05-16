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

## v14.045 Negative Guard UI Affordance 映射

本节用于验收 v14.044 adapter handoff 中的负向 guard 字段进入静态 Review Console 可见 UI。它仍然只读取项目内 mock / fixture，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote，不写文件，不保存图片。

| PVOS adapter / protocol 字段 | Review Console 可见字段 | 说明 |
| --- | --- | --- |
| `review_console_handoff_draft.review_protocol_guard_summary.never_production_count` | `protocolGuardSummary` | 显示永不进入 production 的候选数量 |
| `review_console_handoff_draft.review_protocol_guard_summary.never_production_candidate_ids` | `protocolGuardSummary` | 显示被永久阻断的候选 ID |
| `review_console_handoff_draft.review_protocol_guard_summary.memory_forbidden_count` | `protocolGuardSummary` | 显示不得进入记忆的候选数量 |
| `review_console_handoff_draft.review_protocol_guard_summary.memory_forbidden_candidate_ids` | `protocolGuard` | 显示不得进入记忆的候选 ID；空数组显示为 `none` |
| `review_result_protocol_static_handoff.review_protocol_guard_summary` | `protocolGuardSummary` / `protocolGuard` | 静态审片台携带并渲染负向 guard 汇总 |
| `review_result_protocol_handoff_draft.production_blocked_count` | `protocolGuardSummary` | 显示生产候选创建被阻断的数量 |
| `review_result_protocol_handoff_draft.all_production_candidate_creation_blocked` | `protocolGuard` | 显示所有候选创建 production candidate 都被阻断 |
| `review_console_handoff_draft.review_protocol_guard_summary.negative_guard_observed` | `protocolGuardSummary` | 显示负向 guard 是否被观察到 |
| `production_candidate_created` | `protocolGuard` / `protocolGuardSummary` | 必须为 `false` |
| `direct_memory_write_performed` | `protocolGuard` / `protocolGuardSummary` | 必须为 `false` |

负向 guard UI affordance 只负责让审片员看见阻断原因与阻断对象。它不创建 production candidate，不批准记忆写入，也不绕过 `memory_approval`。

## v14.048 Review Decision Package Static Handoff 映射

本节用于验收 PVOS adapter 输出中的 `review_decision_package` 进入静态 Review Console 可见 UI 与草案输出。它仍然只读取项目内 mock / fixture，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote，不写文件，不保存图片。

| PVOS adapter / decision package 字段 | Review Console 可见/草案字段 | 说明 |
| --- | --- | --- |
| `review_decision_package.accepted_sample_drafts` | `review_decision_package_static_handoff.accepted_sample_drafts` / `decisionPackageDraftList` | 只显示 accepted sample 草案 ID；`write_performed=false` |
| `review_decision_package.rejected_sample_drafts` | `review_decision_package_static_handoff.rejected_sample_drafts` / `decisionPackageDraftList` | 只显示 rejected sample 草案 ID；`production_candidate=false` |
| `review_decision_package.memory_delta_drafts` | `review_decision_package_static_handoff.memory_delta_drafts` / `decisionPackageDraftList` | 只显示中文记忆草案引用；不得直接写 DailyNote 或 VCP memory |
| `review_decision_package.memory_forbidden_records` | `review_decision_package_static_handoff.memory_forbidden_records` | 只作为不得入记忆的阻断记录；空数组也必须保留 |
| `review_decision_package.production_exclusion_register` | `review_decision_package_static_handoff.production_exclusion_register` / `decisionPackageDraftList` | `candidate_reject_metadata_001` 必须保持 `never_production` 和 `permanent_block=true` |
| `review_decision_package_handoff_draft` | `review_decision_package_static_handoff.decision_summary` | 保留 accepted/rejected/memory/exclusion 计数和所有 no-write 标记 |
| `review_console_handoff_draft.review_decision_package_guard_summary` | `review_decision_package_static_handoff.review_decision_package_guard_summary` / `decisionPackageGuardSummary` | 显示 production exclusion IDs、`production_candidate_created=false`、`direct_memory_write_performed=false`、`accepted_samples_write_performed=false` |
| `review_decision_package.promotion_guard.protocol_pass_is_not_production_approval` | `decisionPackageGuard` | 协议 pass 不等于生产批准 |
| `review_decision_package.promotion_guard.every_never_production_candidate_blocked` | `decisionPackageGuard` | 所有 `never_production` 候选必须保持生产阻断 |

`review_decision_package_static_handoff` 是 evidence/blocker 可视化层，不是 production promotion 层。它不得创建 production candidate，不得写 accepted_samples，不得写 memory，不得调用插件，也不得把 rejected / never-production 候选送入生产。

## v14.051 Evidence Blocker Contract Static Handoff 映射

本节用于验收 PVOS adapter 输出中的 `evidence_blocker_contract` 进入静态 Review Console 可见 UI 与草案输出。它仍然只读取项目内 mock / fixture，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote，不写文件，不保存图片。

| PVOS adapter / evidence blocker 字段 | Review Console 可见/草案字段 | 说明 |
| --- | --- | --- |
| `evidence_blocker_contract.evidence_records` | `review_evidence_blocker_contract_static_handoff.evidence_records` / `evidenceRecordList` | 每个候选必须携带 evidence codes；evidence record 不等于 approval |
| `evidence_blocker_contract.blocker_decisions` | `review_evidence_blocker_contract_static_handoff.blocker_decisions` / `blockerDecisionList` | 每个候选必须有 production blocker decision；blocker decision 不等于写入 |
| `evidence_blocker_contract.production_exclusion_register` | `review_evidence_blocker_contract_static_handoff.production_exclusion_register` | `candidate_reject_metadata_001` 必须保持 `never_production` 和 `permanent_block=true` |
| `evidence_blocker_contract.blocker_summary` | `review_evidence_blocker_contract_static_handoff.blocker_summary` / `evidenceBlockerSummary` | 显示 evidence record、blocker decision、permanent block、human review block 数量 |
| `review_console_handoff_draft.review_evidence_blocker_contract_guard_summary` | `review_evidence_blocker_contract_static_handoff.review_evidence_blocker_contract_guard_summary` / `evidenceBlockerGuardSummary` | 显示 production exclusion IDs、`production_candidate_created=false`、`direct_memory_write_performed=false`、`accepted_samples_write_performed=false` |
| `evidence_blocker_contract.arbitration_guard.evidence_record_is_not_approval` | `evidenceBlockerGuard` | 证据记录只是审片证据，不是生产批准 |
| `evidence_blocker_contract.arbitration_guard.blocker_decision_is_not_write` | `evidenceBlockerGuard` | 阻断决策只是仲裁结果，不是样本或记忆写入 |
| `evidence_blocker_contract.arbitration_guard.no_production_without_human_review` | `evidenceBlockerGuard` | 没有人工生产审批不得进入 production |

`review_evidence_blocker_contract_static_handoff` 是 evidence collector + blocker arbiter 的可视化层。它不得创建 production candidate，不得写 accepted_samples，不得写 memory，不得调用插件，也不得让 `never_production` 候选绕过 exclusion register。

## v14.060 Review Blocker Arbiter Static Handoff 映射

本节用于验收 `tests/schema_examples/pvos_kernel_dry_run_adapter_response.example.json` 中的审片阻断仲裁字段进入静态 Review Console 可见 UI 与草案输出。它仍然只读取项目内 mock / fixture，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote，不写文件，不保存图片。

| Adapter arbiter 字段 | Review Console 可见/草案字段 | 说明 |
| --- | --- | --- |
| `review_blocker_arbiter` | `review_blocker_arbiter_static_handoff.candidate_arbitrations` / `blockerArbiterRouteList` | 显示每个候选的 evidence record、production blocker、final route、memory decision 和 production decision |
| `review_blocker_arbiter_handoff_draft.final_route_by_candidate` | `review_blocker_arbiter_static_handoff.final_route_by_candidate` / `blockerArbiterRouteList` | `pass_draft_only_pending_human_review` 仍需人工 review，`reject_failure_learning_only_never_production` 永远不得进入 production |
| `review_blocker_arbiter_handoff_draft.production_blocked_candidate_ids` | `review_blocker_arbiter_static_handoff.production_blocked_candidate_ids` / `blockerArbiterGuardSummary` | 所有候选当前都不得 production promotion |
| `review_blocker_arbiter_handoff_draft.production_promotion_allowed_now` / `memory_entry_allowed_now` | `review_blocker_arbiter_static_handoff.review_blocker_arbiter_guard_summary` / `blockerArbiterGuard` | 当前不得生产提升，也不得直接进入记忆 |
| `review_console_handoff_draft.review_blocker_arbiter_guard_summary` | `review_blocker_arbiter_static_handoff.review_blocker_arbiter_guard_summary` / `blockerArbiterGuardSummary` | 显示 memory-forbidden、never-production、production-blocked 计数和候选 ID |
| `review_blocker_arbiter.promotion_guard.pass_is_not_production_approval` | `blockerArbiterGuard` | pass 不是生产批准 |
| `review_blocker_arbiter.promotion_guard.human_review_required_before_production` | `blockerArbiterGuard` | 进入 production 之前必须有人审 |
| `review_blocker_arbiter.no_execution_guard` | `review_blocker_arbiter_static_handoff.no_execution_guard` | provider/plugin/API/image/memory/output/production 写入保持 false |

`review_blocker_arbiter_static_handoff` 是审片最终路线的可视化层。它不得创建 production candidate，不得写 accepted_samples，不得写 memory，不得调用插件，也不得让 pass 候选绕过 human review 或让 reject 候选绕过 never-production。

## v14.069 ReviewReport Static Handoff 映射

本节用于验收 `tests/schema_examples/pvos_kernel_dry_run_adapter_response.example.json` 中的 `ReviewReport` 合同进入静态 Review Console 可见 UI 与草案输出。它仍然只读取项目内 mock / fixture，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote，不写文件，不保存图片。

| Adapter ReviewReport 字段 | Review Console 可见/草案字段 | 说明 |
| --- | --- | --- |
| `review_report_contract.report_items` | `review_report_static_handoff.report_items` / `reviewReportItemList` | 每个候选必须解释 pass 或 reject，携带 evidence record、production blocker、memory report、production report 和 final controls |
| `review_report_contract.report_summary` | `review_report_static_handoff.report_summary` / `reviewReportSummary` | 显示 candidate/pass/reject/never-production 数量，并保留 `all_memory_writes_blocked`、`all_production_writes_blocked`、`all_provider_execution_blocked` |
| `review_report_handoff_draft.required_review_report_fields` | `review_report_static_handoff.required_review_report_fields` | 静态审片台必须携带 `report_items`、`report_summary`、`memory_report`、`production_report`、`final_controls`、`no_execution_guard` |
| `review_console_handoff_draft.review_report_guard_summary` | `review_report_static_handoff.review_report_guard_summary` / `reviewReportGuardSummary` | 显示当前允许进入记忆、生产和写入的数量均为 0，并显示 never-production 候选 ID |
| `review_report_contract.no_execution_guard` | `review_report_static_handoff.no_execution_guard` / `reviewReportGuard` | provider/plugin/API/image/DailyNote/VCP memory/output/accepted_samples/production candidate 写入必须保持 false |

`review_report_static_handoff` 是审片结果的最终可读报告层。它只把 pass/reject 解释、memory/production admission 阻断、never-production 状态和 no-execution guard 展示给审片台，不代表生产批准、accepted_samples 写入、记忆写入、插件调用、图片生成或 provider contact。

## v14.070 ReviewReport Draft Output Snapshot

本节用于验收静态 Review Console 的 `renderDraft()` 草案输出没有丢失 ReviewReport 字段。它仍然只执行本目录内静态 JS 的 mock DOM 校验，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote，不写文件，不保存图片。

| Snapshot 字段 | Review Console 草案字段 | 说明 |
| --- | --- | --- |
| `review_console_review_report_draft_output_snapshot.example.json.draft_output_required_keys` | `#draftOutput` JSON 顶层字段 | 草案输出必须继续携带 adapter handoff、review protocol、decision package、evidence blocker、blocker arbiter、ReviewReport、adapter negative handoff、review_session、image_case、memory_delta 和 prototype_guard |
| `snapshot_assertions.review_report_handoff_present_in_draft_output` | `#draftOutput.review_report_static_handoff` | 必须为 true，证明 ReviewReport handoff 出现在草案输出中 |
| `snapshot_assertions.pass_candidate_ids` / `snapshot_assertions.reject_candidate_ids` | `review_report_static_handoff.report_items` | pass/reject 候选必须继续被解释，不能只保留静态结论 |
| `snapshot_assertions.never_production_candidate_ids` | `review_report_static_handoff.review_report_guard_summary.never_production_candidate_ids` | rejected 候选必须保持 never-production |
| `snapshot_assertions.memory_entry_allowed_now_count` / `production_promotion_allowed_now_count` / `writes_allowed_now_count` | `review_report_static_handoff.review_report_guard_summary` | 当前进入记忆、生产提升和写入数量必须均为 0 |
| `review_report_draft_output_snapshot_matches_static_mock` | validator result flag | snapshot 必须与 `mock_data.js` 中的 ReviewReport handoff 完全一致 |
| `review_report_draft_output_snapshot_matches_adapter_fixture` | validator result flag | snapshot 必须继续匹配 PVOS dry-run adapter ReviewReport handoff |

`review_console_review_report_draft_output_snapshot.example.json` 是草案输出回归证据，不是生产执行记录。它不得授权 provider contact、plugin/API 调用、图片生成、accepted_samples 写入、记忆写入或 production promotion。

## v14.061 Review Blocker Arbiter Draft Output Snapshot

本节用于验收静态 Review Console 的 `renderDraft()` 草案输出没有丢失审片阻断仲裁字段。它仍然只执行本目录内静态 JS 的 mock DOM 校验，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote，不写文件，不保存图片。

| Snapshot 字段 | Review Console 草案字段 | 说明 |
| --- | --- | --- |
| `review_console_blocker_arbiter_draft_output_snapshot.example.json.draft_output_required_keys` | `#draftOutput` JSON 顶层字段 | 草案输出必须继续携带 adapter handoff、review protocol、decision package、evidence blocker、blocker arbiter、adapter negative handoff、review_session、image_case、memory_delta 和 prototype_guard |
| `snapshot_assertions.blocker_arbiter_handoff_present_in_draft_output` | `#draftOutput.review_blocker_arbiter_static_handoff` | 必须为 true，证明 blocker arbiter handoff 出现在草案输出中 |
| `snapshot_assertions.final_route_by_candidate` | `review_blocker_arbiter_static_handoff.final_route_by_candidate` | pass 仍是待人工 review 草案；reject 仍是 failure-learning-only never-production |
| `snapshot_assertions.production_blocked_candidate_ids` | `review_blocker_arbiter_static_handoff.production_blocked_candidate_ids` | 两个候选当前都不得 production promotion |
| `snapshot_assertions.never_production_candidate_ids` | `review_blocker_arbiter_static_handoff.review_blocker_arbiter_guard_summary.never_production_candidate_ids` | rejected 候选必须保持 never-production |
| `snapshot_assertions.production_promotion_allowed_now` | `review_blocker_arbiter_static_handoff.review_blocker_arbiter_guard_summary.production_promotion_allowed_now` | 必须为 false |
| `snapshot_assertions.memory_entry_allowed_now` | `review_blocker_arbiter_static_handoff.review_blocker_arbiter_guard_summary.memory_entry_allowed_now` | 必须为 false |
| `blocker_arbiter_draft_output_snapshot_matches_static_mock` | validator result flag | snapshot 必须与 `mock_data.js` 中的静态 handoff 完全一致 |
| `blocker_arbiter_draft_output_snapshot_matches_adapter_fixture` | validator result flag | snapshot 必须继续匹配 PVOS dry-run adapter handoff |

`review_console_blocker_arbiter_draft_output_snapshot.example.json` 是草案输出回归证据，不是生产执行记录。它不得授权 provider contact、plugin/API 调用、图片生成、accepted_samples 写入、记忆写入或 production promotion。

## v14.054 Adapter Negative Fixture Static Handoff 映射

本节用于验收 `tests/schema_examples/pvos_kernel_dry_run_adapter_negative_guard_response.example.json` 中的负向 adapter handoff 进入静态 Review Console 可见 UI 与草案输出。它仍然只读取项目内 mock / fixture，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote，不写文件，不保存图片。

| Adapter negative fixture 字段 | Review Console 可见/草案字段 | 说明 |
| --- | --- | --- |
| `evidence_blocker_contract_handoff_draft.memory_forbidden_candidate_ids` | `review_evidence_blocker_adapter_negative_static_handoff.memory_forbidden_candidate_ids` / `adapterNegativeGuardSummary` | `candidate_reject_unknown_guard_001` 必须保持 memory forbidden |
| `evidence_blocker_contract_handoff_draft.production_exclusion_candidate_ids` | `review_evidence_blocker_adapter_negative_static_handoff.production_exclusion_candidate_ids` / `adapterNegativeGuardSummary` | 两个 rejected candidates 必须保持 production exclusion |
| `review_console_handoff_draft.review_evidence_blocker_contract_guard_summary` | `review_evidence_blocker_adapter_negative_static_handoff.guard_summary` / `adapterNegativeSummary` | 显示 evidence/blocker/exclusion/permanent/memory-forbidden 计数 |
| `audit_record.never_production_count` / `audit_record.memory_forbidden_count` | `review_evidence_blocker_adapter_negative_static_handoff.audit_summary` / `adapterNegativeSummary` | 显示 never-production 和 memory-forbidden 数量 |
| `evidence_blocker_contract` | `review_evidence_blocker_adapter_negative_static_handoff.evidence_blocker_contract_matches_fixture` / `adapterNegativeGuard` | 必须匹配 `evidence_blocker_contract_negative_guard.example.json` |
| `no_execution_guard` | `review_evidence_blocker_adapter_negative_static_handoff.no_execution_guard` | 所有 provider/plugin/API/image/memory/output/production 写入保持 false |

`review_evidence_blocker_adapter_negative_static_handoff` 是 adapter negative fixture 的可视化层。它不得创建 production candidate，不得写 accepted_samples，不得写 memory，不得调用插件，也不得把 memory-forbidden 或 never-production 候选送入生产。

## v14.055 Adapter Negative Fixture Draft Output Snapshot

本节用于验收静态 Review Console 的 `renderDraft()` 草案输出没有丢失 adapter negative fixture 的 evidence/blocker 阻断字段。它仍然只执行本目录内静态 JS 的 mock DOM 校验，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote，不写文件，不保存图片。

| Snapshot 字段 | Review Console 草案字段 | 说明 |
| --- | --- | --- |
| `review_console_adapter_negative_fixture_draft_output_snapshot.example.json.draft_output_required_keys` | `#draftOutput` JSON 顶层字段 | 草案输出必须继续携带 adapter handoff、review protocol、decision package、evidence blocker、adapter negative handoff、review_session、image_case、memory_delta 和 prototype_guard |
| `snapshot_assertions.adapter_negative_handoff_present_in_draft_output` | `#draftOutput.review_evidence_blocker_adapter_negative_static_handoff` | 必须为 true，证明 adapter negative handoff 出现在草案输出中 |
| `snapshot_assertions.memory_forbidden_candidate_ids` | `review_evidence_blocker_adapter_negative_static_handoff.memory_forbidden_candidate_ids` | `candidate_reject_unknown_guard_001` 必须保持 memory forbidden |
| `snapshot_assertions.production_exclusion_candidate_ids` | `review_evidence_blocker_adapter_negative_static_handoff.production_exclusion_candidate_ids` | 两个 rejected candidates 必须保持 production exclusion |
| `snapshot_assertions.never_production_count` | `review_evidence_blocker_adapter_negative_static_handoff.audit_summary.never_production_count` | 两个 rejected candidates 必须保持 never-production |
| `snapshot_assertions.production_candidate_created` | `review_evidence_blocker_adapter_negative_static_handoff.guard_summary.production_candidate_created` | 必须为 false |
| `snapshot_assertions.direct_memory_write_performed` | `review_evidence_blocker_adapter_negative_static_handoff.guard_summary.direct_memory_write_performed` | 必须为 false |
| `snapshot_assertions.accepted_samples_write_performed` | `review_evidence_blocker_adapter_negative_static_handoff.guard_summary.accepted_samples_write_performed` | 必须为 false |
| `adapter_negative_draft_output_snapshot_matches_static_mock` | validator result flag | snapshot 必须与 `mock_data.js` 中的静态 handoff 完全一致 |

`review_console_adapter_negative_fixture_draft_output_snapshot.example.json` 是草案输出回归证据，不是生产执行记录。它不得授权 provider contact、plugin/API 调用、图片生成、accepted_samples 写入、记忆写入或 production promotion。

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
