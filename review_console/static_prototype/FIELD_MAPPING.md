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

## P5K Portable Failure Capsule Static Display 映射

本节用于验收第一颗 Git-portable failure sample preview capsule 进入静态 Review Console 的可见 UI 与草案输出。它只读取 `mock_data.js` 内置静态 seed，不读取 `asset_archive/` 文件，不加载 `preview.webp`，不 fetch，不写文件，不调用 runtime、provider、plugin、API、DailyNote 或 VCP memory。

| Failure capsule seed 字段 | Review Console 可见/草案字段 | 说明 |
| --- | --- | --- |
| `portable_failure_capsule_evidence.sample_id` | `failure_state_static_workbench_state.portable_failure_capsule_records[].sample_id` / `failureStateBody` | 显示 failure capsule ID |
| `manifest_ref` | `portable_failure_capsule_records[].manifest_ref` / `failureStateBody` | 只显示 repo-relative manifest ref，不读取文件 |
| `preview_ref` | `portable_failure_capsule_records[].preview_ref` / `failureStateBody` | 只显示 preview ref，不加载图片二进制 |
| `preview_format` / `preview_dimensions` / `preview_long_edge` / `preview_sha256` | `portable_failure_capsule_records[].preview_*` / `failureStateBody` | 展示 512 WebP capsule metadata |
| `failure_record_ref` / `review_record_ref` | `portable_failure_capsule_records[].failure_record_ref` / `review_record_ref` | 展示证据链引用，不读取记录 |
| `failure_tags` | `portable_failure_capsule_records[].failure_tags` | 展示失败原因标签 |
| `resolved_by_accepted_sample` | `portable_failure_capsule_records[].resolved_by_accepted_sample` | 连接 accepted capsule 学习闭环 |
| `final_route` | `portable_failure_capsule_records[].final_route` | 必须保持 `failure_learning_only_never_production` |
| `clone_portable_validation_status` | `portable_failure_capsule_records[].clone_portable_validation_status` | 显示已通过 clean clone 验证 |
| `production_candidate_allowed` / `memory_write_allowed` / `DailyNote_write_allowed` | `portable_failure_capsule_records[]` | 必须为 false |

`portable_failure_capsule_evidence` 是静态显示层，不是 `failure_samples` 写入动作。它不得授权 production candidate、DailyNote/VCP memory、provider/plugin/API、runtime、real manifest、VCPChat 或 VCPToolBox。

`P5L_REVIEW_CONSOLE_FAILURE_CAPSULE_SNAPSHOT.example.json` 固定本节映射的 golden snapshot。后续如果 `portable_failure_capsule_evidence`、`portable_failure_capsule_evidence_list` 或 `failure_state_static_workbench_state.portable_failure_capsule_records` 发生结构漂移，必须同步更新 snapshot validator 并保持 no-fetch / no-write / no-runtime 边界。

## P6 Multi-Capsule Accepted / Failure Dashboard 映射

本节用于验收 accepted/failure Git-portable capsules 进入静态 Review Console 的总览面板和草案输出。它只汇总 `mock_data.js` 内置静态 seed，不读取 `asset_archive/` 文件，不加载 `preview.webp`，不 fetch，不写文件，不调用 runtime、provider、plugin、API、DailyNote 或 VCP memory。

| Static seed 字段 | Review Console 可见/草案字段 | 说明 |
| --- | --- | --- |
| `portable_preview_capsule_evidence_list` | `multi_capsule_dashboard_state.accepted_sample_ids` / `multiCapsuleReport` | 当前 accepted capsule count 必须为 2 |
| `portable_failure_capsule_evidence_list` | `multi_capsule_dashboard_state.failure_sample_ids` / `multiCapsuleReport` | 当前 failure capsule count 必须为 2 |
| accepted capsule `manifest_ref` / `preview_ref` / `import_record_ref` / `review_record_ref` / `approval_record_ref` | `multi_capsule_dashboard_state.per_sample_report[]` / `multiCapsuleReport` | 只显示 repo-relative refs，不读取文件 |
| failure capsule `manifest_ref` / `preview_ref` / `failure_record_ref` / `review_record_ref` | `multi_capsule_dashboard_state.per_sample_report[]` / `multiCapsuleReport` | 只显示 repo-relative refs，不读取文件 |
| `resolved_by_accepted_sample` | `multi_capsule_dashboard_state.resolved_by_links[]` / `multiCapsuleRelations` | 连接 `failure_french_summer_rattan_bag_v7_29_001` 到 `accepted_french_summer_rattan_bucket_bag_001` |
| `failure_tags` / `final_route` | `multi_capsule_dashboard_state.resolved_by_links[]` / `multiCapsuleRelations` | failure route 必须保持 `failure_learning_only_never_production` |
| `clone_portable_validation_status` | `multi_capsule_dashboard_state.clone_portable_statuses` / `multiCapsuleSummary` | 显示 clean clone 可验证状态 |
| `registry_validator_status` | `multi_capsule_dashboard_state.accepted_registry_statuses` / `failure_registry_statuses` | 显示 accepted/failure registry validator 状态 |
| `old_runs_source_required_for_portable_validation` | `multi_capsule_dashboard_state.old_runs_source_required_for_portable_validation` | 必须为 false，旧 `runs/` source 不再是 portable validation 必需项 |
| `future_registry_report_shape` | `multi_capsule_dashboard_state.future_registry_report_shape` | 设计 accepted/failure unified report shape |
| `failure_track_expansion_plan` | `multi_capsule_dashboard_state.failure_track_expansion_plan` | 第二颗 failure capsule 仍需单独授权 |

`P6_MULTI_CAPSULE_ACCEPTED_FAILURE_DASHBOARD.example.json` 固定本节映射的 golden snapshot。后续如果 accepted/failure capsule summary、resolved-by link、future report shape 或 failure expansion plan 发生结构漂移，必须同步更新 snapshot validator 并保持 no-fetch / no-write / no-runtime / no-image-generation 边界。

## P6C Registry Report v2 State 映射

本节用于验收 P6B 正式 registry report v2 形状进入静态 Review Console 可见 UI 与草案输出。它只从现有 static capsule mock 派生显示，不在浏览器内执行 validator，不读取 `asset_archive/` 文件，不加载 `preview.webp`，不 fetch，不写文件。

| Report v2 字段 | Review Console 可见/草案字段 | 说明 |
| --- | --- | --- |
| `report_version` | `registry_report_v2_state.report_version` / `registryReportV2Summary` | 必须为 `accepted_failure_capsule_registry_report_v2` |
| `totals.accepted` / `failure` / `total` / `passed` / `failed` | `registry_report_v2_state.totals` / `registryReportV2Summary` | 当前固定为 accepted=2、failure=2、total=4、passed=4、failed=0 |
| `per_sample_results[]` | `registry_report_v2_state.per_sample_results` / `registryReportV2Rows` | 展示 accepted/failure lane、status、registry status、portable status、manifest/preview/chain refs |
| `resolved_by_links[]` | `registry_report_v2_state.resolved_by_links` / `registryReportV2Relations` | 展示 failure -> accepted 关联 |
| `failure_class_summary` | `registry_report_v2_state.failure_class_summary` | 必须保持 clean summary，不得隐藏 missing link 或 guard violation |
| `guard` | `registry_report_v2_state.guard` / `registryReportV2Guard` | 必须保持 static-only、no fetch、no file write、no asset archive read、no runtime |

`P6C_REVIEW_CONSOLE_REGISTRY_REPORT_V2_STATE.example.json` 固定本节映射的 golden snapshot。后续如果 `registry_report_v2_state` 的 totals、relation、guard 或 draft output key 漂移，必须同步更新 snapshot validator 并保持 no-fetch / no-write / no-runtime / no-image-generation 边界。

## P6I Registry Report v2 Negative Visibility 映射

本节用于验收 P6G negative-state design 进入静态 Review Console 的可见面板与草案输出。它只展示静态 mock 中的合成 fail-closed 场景，不在浏览器内执行 validator，不读取 `asset_archive/` 文件，不加载 `preview.webp`，不 fetch，不写文件。

| Negative visibility 字段 | Review Console 可见/草案字段 | 说明 |
| --- | --- | --- |
| `negative_state_classes[]` | `registry_report_v2_negative_visibility_state.negative_state_classes` / `registryReportV2NegativeSummary` | 当前必须显示 `accepted_registry_failed`、`failure_registry_failed`、`missing_resolved_by_link`、`production_or_memory_guard_violation` 这 4 类 fail-closed negative states |
| `scenarios[]` | `registry_report_v2_negative_visibility_state.scenarios[]` / `registryReportV2NegativeRows` | 每个场景必须显示 failure class、severity、affected samples、expected status、visible reason 和 reviewer action |
| `baseline_totals` | `registry_report_v2_negative_visibility_state.baseline_totals` / `registryReportV2NegativeSummary` | 仍以 accepted=2 / failure=2 / total=4 为背景，不掩盖负向状态 |
| `fail_closed_contract` | `registry_report_v2_negative_visibility_state.fail_closed_contract` | 必须明确 report 不能假装保持绿色、relation 不能隐藏、guard violation 不能被摘要吞掉 |
| `guard` | `registry_report_v2_negative_visibility_state.guard` / `registryReportV2NegativeGuard` | 必须保持 static-only、no fetch、no file write、no asset archive read、no runtime |

`P6I_REVIEW_CONSOLE_REGISTRY_REPORT_V2_NEGATIVE_VISIBILITY.example.json` 固定本节映射的 golden snapshot。后续如果 `registry_report_v2_negative_visibility_state` 的 classes、scenario count、guard 或 draft output key 漂移，必须同步更新 snapshot validator 并保持 no-fetch / no-write / no-runtime / no-image-generation 边界。

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

## PVOS Evidence Collector + Blocker Pipeline Handoff 映射

本节用于验收 `kernel/pvos_evidence_collector_blocker_pipeline.js` 输出进入静态 Review Console 的最小组合 handoff。它只接受项目 allowlist 中的本地 fixture pair，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote，不写文件，不保存图片。

| Pipeline 字段 | Review Console 可见/草案字段 | 说明 |
| --- | --- | --- |
| `fixture_approval.approved_local_fixture` / `allowed_fixture_pair` | `pvos_evidence_collector_blocker_pipeline_handoff.fixture_approval` | 必须为 true，证明来源是项目内批准 fixture pair |
| `outputs.evidence_records` | `pvos_evidence_collector_blocker_pipeline_handoff.evidence_records` | 每个候选必须有 EvidenceRecord，证据记录不是生产批准 |
| `outputs.blocker_decisions` | `pvos_evidence_collector_blocker_pipeline_handoff.blocker_decisions` | 每个候选必须有 BlockerDecision，阻断决策不是写入动作 |
| `outputs.review_report` | `pvos_evidence_collector_blocker_pipeline_handoff.review_report` | ReviewReport 只用于 display-only 审片解释 |
| `outputs.memory_delta_drafts` | `pvos_evidence_collector_blocker_pipeline_handoff.memory_delta_drafts` | 只显示中文记忆草案，不写 DailyNote 或 VCP memory |
| `outputs.production_exclusion_drafts` | `pvos_evidence_collector_blocker_pipeline_handoff.production_exclusion_drafts` | rejected / never-production 候选必须保留 exclusion 证据 |
| `review_console_handoff_draft.guard_summary` | `pipelineGuardSummary` | 显示 evidence、blocker、ReviewReport、memory_delta、production_exclusion 计数和所有 no-write 标记 |
| `no_execution_guard` | `pipelineGuard` | provider/plugin/API/image/DailyNote/VCP memory/output/accepted_samples/production candidate 写入必须保持 false |

`pvos_evidence_collector_blocker_pipeline_handoff` 是本地证据收集与阻断仲裁的组合草案，不是生产执行记录。它不得授权 provider contact、plugin/API 调用、图片生成、accepted_samples 写入、记忆写入或 production promotion。

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

## v14.071 ReviewReport Negative Guard Static Handoff

本节用于验收 `tests/schema_examples/pvos_kernel_dry_run_adapter_negative_guard_response.example.json` 中的负向 `ReviewReport` 合同进入静态 Review Console 可见 UI 与草案输出。它仍然只读取项目内 mock / fixture，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote，不写文件，不保存图片。

| Negative ReviewReport 字段 | Review Console 可见/草案字段 | 说明 |
| --- | --- | --- |
| `review_report_contract.report_items` | `review_report_negative_guard_static_handoff.report_items` / `negativeReviewReportItemList` | 两个 rejected candidates 必须解释 reject 原因、evidence record、production blocker、memory blocker、failure tags、unknown failure tags 和 final controls |
| `review_report_contract.report_summary` | `review_report_negative_guard_static_handoff.report_summary` / `negativeReviewReportSummary` | 显示 candidate=2、pass=0、reject=2、never-production=2，并证明所有写入和 provider execution 被阻断 |
| `review_console_handoff_draft.review_report_guard_summary.memory_forbidden_candidate_ids` | `review_report_negative_guard_static_handoff.review_report_guard_summary` / `negativeReviewReportGuardSummary` | `candidate_reject_unknown_guard_001` 必须保持 memory forbidden，不能生成 memory draft 或 memory entry |
| `review_console_handoff_draft.review_report_guard_summary.never_production_candidate_ids` | `review_report_negative_guard_static_handoff.review_report_guard_summary` / `negativeReviewReportGuardSummary` | 两个 rejected candidates 必须永远不得进入 production |
| `review_report_contract.no_execution_guard` | `review_report_negative_guard_static_handoff.no_execution_guard` / `negativeReviewReportGuard` | provider/plugin/API/image/DailyNote/VCP memory/output/accepted_samples/production candidate 写入必须保持 false |

`review_report_negative_guard_static_handoff` 是负向审片结果的最终可读报告层。它让审片台直接看到 `reject_memory_forbidden_never_production`、`unmapped_identity_drift`、memory-forbidden ID 和 never-production ID；它不代表生产批准、accepted_samples 写入、记忆写入、插件调用、图片生成或 provider contact。

## v14.072 ReviewReport Negative Guard Draft Output Snapshot

本节用于验收静态 Review Console 的 `renderDraft()` 草案输出没有丢失负向 ReviewReport 字段。它仍然只执行本目录内静态 JS 的 mock DOM 校验，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote，不写文件，不保存图片。

| Snapshot 字段 | Review Console 草案字段 | 说明 |
| --- | --- | --- |
| `review_console_review_report_negative_guard_draft_output_snapshot.example.json.draft_output_required_keys` | `#draftOutput` JSON 顶层字段 | 草案输出必须继续携带 adapter handoff、review protocol、decision package、evidence blocker、blocker arbiter、ReviewReport、negative ReviewReport、adapter negative handoff、review_session、image_case、memory_delta 和 prototype_guard |
| `snapshot_assertions.review_report_negative_guard_handoff_present_in_draft_output` | `#draftOutput.review_report_negative_guard_static_handoff` | 必须为 true，证明 negative ReviewReport handoff 出现在草案输出中 |
| `snapshot_assertions.reject_candidate_ids` / `final_routes` | `review_report_negative_guard_static_handoff.report_items` | 两个 rejected candidates 必须继续携带 reject route，其中 unknown failure candidate 必须保持 `reject_memory_forbidden_never_production` |
| `snapshot_assertions.memory_forbidden_candidate_ids` / `unknown_failure_tags` | `review_report_negative_guard_static_handoff.review_report_guard_summary` / `report_items` | `candidate_reject_unknown_guard_001` 与 `unmapped_identity_drift` 必须继续触发 memory forbidden |
| `snapshot_assertions.never_production_candidate_ids` | `review_report_negative_guard_static_handoff.review_report_guard_summary.never_production_candidate_ids` | 两个 rejected candidates 必须保持 never-production |
| `review_report_negative_guard_draft_output_snapshot_matches_static_mock` | validator result flag | snapshot 必须与 `mock_data.js` 中的 negative ReviewReport handoff 完全一致 |
| `review_report_negative_guard_draft_output_snapshot_matches_adapter_fixture` | validator result flag | snapshot 必须继续匹配 PVOS negative adapter ReviewReport handoff |

`review_console_review_report_negative_guard_draft_output_snapshot.example.json` 是草案输出回归证据，不是生产执行记录。它不得授权 provider contact、plugin/API 调用、图片生成、accepted_samples 写入、记忆写入或 production promotion。

## v14.073 ReviewReport Negative Guard Regression Matrix

本节用于验收负向 ReviewReport 在多个本地表面之间不漂移。它仍然只读取项目内 mock / fixture / snapshot，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote，不写文件，不保存图片。

| Matrix 表面 | 对应本地来源 | 必须一致的字段 |
| --- | --- | --- |
| `adapter_review_report_contract` | `pvos_kernel_dry_run_adapter_negative_guard_response.example.json#review_report_contract` | rejected candidate IDs、final routes、unknown failure tags、memory forbidden、never-production 和 no-execution guard |
| `review_console_handoff_guard` | `pvos_kernel_dry_run_adapter_negative_guard_response.example.json#review_console_handoff_draft.review_report_guard_summary` | memory-forbidden IDs、never-production IDs、write counts 和 blocked write flags |
| `static_mock_negative_review_report` | `mock_data.js#review_report_negative_guard_static_handoff` | 静态 UI handoff 不得偏离 adapter contract |
| `draft_output_snapshot_negative_review_report` | `review_console_review_report_negative_guard_draft_output_snapshot.example.json` | `#draftOutput` snapshot 不得偏离 static mock 或 adapter contract |

`review_report_negative_guard_regression_matrix.example.json` 是本地一致性矩阵，不是生产执行记录。它只证明负向审片报告的 rejected route、memory-forbidden、unknown failure、never-production 和 no-execution guard 在四个表面上保持一致。

## v14.074 ReviewReport Route Summary

本节用于验收 ReviewReport 的最终路由摘要。它仍然只读取项目内 positive / negative fixture 与 v14.073 matrix，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote，不写文件，不保存图片。

| Source | Target | Rule |
| --- | --- | --- |
| positive `review_report_contract.report_items` | `review_report_route_summary.candidate_routes` | pass 候选必须保持 `pass_draft_only_pending_human_review`，只能进入草案审阅队列 |
| positive / negative reject report items | `review_report_route_summary.candidate_routes` | mapped reject 必须保持 `reject_failure_learning_only_never_production` |
| negative unknown report item | `review_report_route_summary.candidate_routes` | unknown failure 必须保持 `reject_memory_forbidden_never_production`，不得创建 memory draft |
| v14.073 negative matrix consensus | `review_report_route_summary.route_groups` | memory-forbidden ID、unknown failure tag、never-production IDs 必须一致 |
| `no_execution_guard` | `review_report_route_summary.no_execution_guard` | provider/plugin/API/image/DailyNote/VCP memory/output/accepted_samples/production candidate 写入必须保持 false |

`review_report_route_summary.example.json` 是本地路由仲裁摘要，不是生产执行记录。它只证明 ReviewReport 能把 pass、mapped reject、unknown reject 分别送入草案审阅、failure learning 或 memory-forbidden 永久阻断路线。

## v14.075 ReviewReport Admission Control Matrix

本节用于验收 ReviewReport 路由进入 memory / production / accepted_samples admission 之前的硬阻断矩阵。它仍然只读取项目内 route summary，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote，不写文件，不保存图片。

| Source | Target | Rule |
| --- | --- | --- |
| `review_report_route_summary.candidate_routes` | `review_report_admission_control_matrix.candidate_admissions` | 每个候选必须继承 review outcome、final route、memory state、production state 和 blocked execution |
| pass route | `memory_admission_state` / `production_admission_state` | pass 只能等待 human memory approval 与独立 production promotion gate，当前不得写入 |
| mapped reject route | `matrix_verdict` | mapped reject 只能进入 failure-learning draft，且永远不得进入 production |
| unknown reject route | `matrix_verdict` | unknown failure 必须 memory-forbidden，且永远不得进入 production |
| `no_execution_guard` | `review_report_admission_control_matrix.no_execution_guard` | provider/plugin/API/image/DailyNote/VCP memory/output/accepted_samples/production candidate 写入必须保持 false |

`review_report_admission_control_matrix.example.json` 是本地 admission 阻断矩阵，不是生产执行记录。它只证明当前所有写入都被阻断，并区分“未来需人工审批”和“永久禁止”的候选路径。

## v14.076 ReviewReport Production Exclusion Register

本节用于验收 ReviewReport 的 production exclusion register。它仍然只读取项目内 admission matrix / route summary，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote，不写文件，不保存图片。

| Source | Target | Rule |
| --- | --- | --- |
| reject rows in `review_report_admission_control_matrix.candidate_admissions` | `review_report_production_exclusion_register.exclusion_records` | 每个 rejected / never-production 候选必须有 production exclusion record |
| pass rows in `review_report_admission_control_matrix.candidate_admissions` | `review_report_production_exclusion_register.non_exclusion_records` | pass 候选当前 blocked，但不得被写入永久 exclusion register |
| unknown failure reject | `exclusion_records[].blocked_destinations` | unknown failure 必须同时阻断 `production_forever` 和 `memory_forever` |
| `register_summary` | Review Console guard summary | `all_rejects_registered=true`、`no_pass_candidates_registered=true`、`exclusion_removal_allowed_by_this_gate=false` |
| `no_execution_guard` | `review_report_production_exclusion_register.no_execution_guard` | provider/plugin/API/image/DailyNote/VCP memory/output/accepted_samples/production candidate 写入必须保持 false |

`review_report_production_exclusion_register.example.json` 是本地 production exclusion 证据，不是生产执行记录。它只证明哪些候选永远不得进入 production，并且本 gate 不允许移除 exclusion。

## v14.077 ReviewReport Memory Admission Register

本节用于验收 ReviewReport 的 memory admission register。它仍然只读取项目内 admission matrix / route summary / production exclusion register，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote，不写文件，不保存图片。

| Source | Target | Rule |
| --- | --- | --- |
| pass rows in `review_report_admission_control_matrix.candidate_admissions` | `review_report_memory_admission_register.memory_admission_records` | pass 候选只能生成 `memory_delta_draft_only`，并且必须等待人工 memory approval |
| mapped reject rows | `memory_admission_records[].memory_draft_type` | mapped reject 只能生成 failure lesson draft，不能写入 DailyNote 或 VCP memory |
| unknown failure reject | `memory_admission_records[].blocked_destinations` | unknown failure 必须 `memory_forbidden=true` 并阻断 `memory_forever` |
| `register_summary` | Review Console guard summary | `no_memory_entry_allowed_now=true`、`all_memory_writes_blocked_now=true`、`all_memory_drafts_require_human_approval=true` |
| `no_execution_guard` | `review_report_memory_admission_register.no_execution_guard` | provider/plugin/API/image/DailyNote/VCP memory/output/accepted_samples/production candidate 写入必须保持 false |

`review_report_memory_admission_register.example.json` 是本地 memory admission 证据，不是 memory 写入记录。它只证明哪些候选可形成草案、哪些候选永久 memory-forbidden，以及所有真实记忆写入仍被阻断。

## v14.078 ReviewReport Memory Delta Draft Register

本节用于验收 ReviewReport 的 memory_delta / failure lesson 草案 register。它仍然只读取项目内 memory admission register，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote，不写文件，不保存图片。

| Source | Target | Rule |
| --- | --- | --- |
| draftable memory admission rows | `review_report_memory_delta_draft_register.memory_delta_draft_records` | 每个可起草候选必须有且只有一个本地草案记录 |
| pass draft | `draft_kind=accepted_candidate_memory_delta` | pass 候选只能成为待人工审批的 accepted-candidate memory_delta 草案 |
| mapped reject draft | `draft_kind=failure_lesson_memory_delta` | mapped reject 只能成为待人工审批的 failure lesson 草案 |
| unknown failure admission row | `memory_forbidden_records` | unknown failure 不得创建草案，必须继续 memory-forbidden |
| `register_summary` | Review Console guard summary | `all_drafts_language_zh_cn=true`、`no_memory_entry_created=true`、`no_memory_forbidden_draft_created=true` |
| `no_execution_guard` | `review_report_memory_delta_draft_register.no_execution_guard` | provider/plugin/API/image/DailyNote/VCP memory/output/accepted_samples/production candidate 写入必须保持 false |

`review_report_memory_delta_draft_register.example.json` 是本地草案证据，不是 memory 写入记录。它只证明草案正文和候选映射可审计，并且所有真实记忆写入仍被阻断。

## v14.125 Codex Session memory_delta Draft Handoff

本节用于验收当前 Codex 会话正式样片审查经验草案进入 Review Console 的静态 handoff。来源是 `tests/schema_examples/v14_111_codex_session_memory_delta_draft.example.yaml`，它只能作为 display-only memory preview 和 pending memory approval 草案展示。

| Codex memory_delta draft 字段 | Review Console 字段 | 说明 |
| --- | --- | --- |
| `memory_delta.delta_id` | `memory_preview.delta_id` / `audit_log.memory_delta_ref` | 只显示草案 ID，不创建长期记忆 |
| `memory_delta.case_id` | `review_session.case_id` / `memory_preview.case_id` | 关联已登记 accepted sample metadata |
| `memory_delta.write_mode` | `memory_approval.write_mode` | 必须保持 `draft` |
| `memory_delta.approval_status` | `memory_approval.status` | 必须保持 `pending` |
| `memory_delta.chinese_diary_title` / `chinese_diary_content` | `memory_preview.title_cn` / `memory_preview.body_cn` | 只显示中文脱敏正文 |
| `memory_delta.final_decision.should_write_to_vcp` | `memory_approval.should_write_to_vcp` | 未批准时必须为 `false` |
| `memory_delta.final_decision.should_show_in_review_console` | `memory_preview.visible` | 可以在 Review Console 展示 |
| `boundary.daily_note_write_performed` / `vcp_memory_write_performed` | `audit_log.no_write_guard` | 必须保持 `false` |
| `boundary.accepted_samples_write_performed` / `production_candidate_write_performed` | `audit_log.production_guard` | 当前 handoff 不写 accepted_samples，不晋级 production |

v14.125 handoff 只刷新静态字段映射，不实现 runtime UI，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote，不写文件，不创建图片。Review Console 只能展示该草案并请求未来单独的 memory write authorization；不能直接写 DailyNote 或 VCP memory。

## v14.079 ReviewReport Final Local Closeout

本节用于验收 ReviewReport 本地协议链 closeout。它仍然只读取项目内 route summary、admission matrix、production exclusion、memory admission 和 memory delta draft register，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote，不写文件，不保存图片。

| Source | Target | Rule |
| --- | --- | --- |
| five ReviewReport local artifacts | `review_report_protocol_final_closeout.protocol_chain` | route、admission、production exclusion、memory admission、memory draft 五层必须全部 verified |
| every candidate id | `candidate_closeout_records` | 每个候选必须有最终 pass/reject、memory、production、blocker 解释 |
| pass closeout | `final_production_state` | pass 仍然只可待人工 review 和单独 promotion gate，不得现在 production |
| mapped reject closeout | `production_output_final` | mapped reject 只可 failure learning，永远不得 production |
| unknown failure closeout | `memory_output_final` | unknown failure 必须 `memory_forbidden_no_draft` 且永远不得 production |
| `no_execution_guard` | `review_report_protocol_final_closeout.no_execution_guard` | provider/plugin/API/image/DailyNote/VCP memory/output/accepted_samples/production candidate 写入必须保持 false |

`review_report_protocol_final_closeout.example.json` 是本地 closeout 证据，不是执行授权。它只证明审片结果协议在本地证据链上已经闭合。

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

## Codex Session Import Record Reader 映射

本节用于验收 v14.134 静态 Review Console 对 Codex-session import record 的本地读取能力。它只接受 textarea、浏览器 FileReader 选择的本地 JSON、或静态 mock 中的项目 v14.105 seed；不得 fetch，不得写文件，不得读取 real manifest / VCPChat / VCPToolBox，不得调用 runtime、provider、plugin、API、DailyNote 或 VCP memory。
换句话说：不 fetch，不写文件，不调用 runtime，不调用 provider/plugin/API/DailyNote/VCP memory。

| Import record 字段 | Review Console 字段 | 说明 |
| --- | --- | --- |
| `codex_session_image_import.import_id` | `codex_session_import_record_reader.parsed.import_id` | 只显示导入记录 ID |
| `provider_id` | `parsed.provider_id` | 必须保留 `codex_session_image`，不代表 provider/API 调用 |
| `prompt_package_ref` | `parsed.prompt_package_ref` | 只作为追踪引用 |
| `imported_asset.relative_path` | `parsed.asset_ref` | 只显示项目相对路径，不读取图片二进制 |
| `imported_asset.sha256` | `parsed.sha256` | 只显示 import record 内的 hash，不在浏览器内重新 hash |
| `imported_asset.width_px` / `height_px` | `parsed.dimensions` | 只显示尺寸摘要 |
| `imported_asset.mime_type` | `parsed.mime_type` | 只显示 MIME |
| `review_bridge.review_record_ref` | `parsed.review_record_ref` | 只显示 review record 引用 |
| `no_execution_guard` | `codex_session_import_record_reader.guard` | 所有 fetch、写文件、runtime、provider、plugin、API、DailyNote、VCP memory 行为保持 false |

`codex_session_import_record_reader` 是 artifact recoverability 的本地可视化入口，不是 artifact recoverability validator 的替代品，也不是 VCP runtime integration。

## v14.144 Review Console Static Schema Binding

本节用于验收静态 Review Console 将 v14.143 schema hardening 绑定到本地可审查字段。它只读取 `mock_data.js` 中的静态 seed 和项目内 schema 文档，不读取 real manifest / VCPChat / VCPToolBox，不 fetch，不写文件，不调用 runtime、provider、plugin、API、DailyNote 或 VCP memory。

详细绑定契约见 `SCHEMA_BINDING.md`。

| Schema | Review Console 静态字段 | 说明 |
| --- | --- | --- |
| `schemas/codex_session_image_import.schema.yaml` | `codex_session_import_record_reader.parsed` | 展示 import id、provider、prompt、artifact path、sha256、dimensions、MIME 和 review record ref |
| `schemas/local_review_record.schema.yaml` | `artifact_recoverability_dashboard_evidence.review_record_ref` | review record 只提供审查记录和 artifact link，`pending_human_review` 不等于人工批准 |
| `schemas/accepted_sample_registry.schema.yaml` | `artifact_recoverability_dashboard_evidence.accepted_sample_id` / `verified_sha256` / `verified_dimensions` / `verified_mime` | 只展示已验证 accepted sample metadata，不写 registry |
| `accepted_samples/categories/fashion_lookbook_portrait.yaml` | `artifact_recoverability_dashboard_evidence.category_index_ref` | category index 只作为可追踪证据引用 |
| `docs/v14_107_womens_resort_relaxed_knit_accepted_sample_closeout.md` | `artifact_recoverability_dashboard_evidence.human_approval_record_ref` | 人工批准证据来自 closeout，不来自 Review Console 自行推断 |

`review_console_static_schema_binding` 是静态 schema-to-display 合约，不是 artifact recoverability validator 的替代品，也不是 VCP runtime integration。任何 accepted_samples 写入、production_candidate 晋级、DailyNote/VCP memory 写入、provider/API/plugin/MCP 调用都必须停在单独授权边界。

## Artifact Recoverability Dashboard Evidence

`artifact_recoverability_dashboard_evidence` 只能从 v14.131 real artifact
recoverability validator 证明过的字段生成 dashboard 摘要：

- `accepted_sample_id`
- `import_record_ref`
- `artifact_ref`
- `verified_sha256`
- `verified_dimensions`
- `review_record_ref`
- `human_approval_record_ref`
- `category_index_ref`
- `accepted_registry_ref`
- `recoverability_status`
- `negative_case_hash_mismatch_fails`
- `negative_case_missing_artifact_fails`
- `negative_case_missing_human_approval_fails`

禁止 dashboard 用 `PROJECT_MASTER_PLAN.md`、文档存在、阶段 token 数量或旧
ledger 推高产品进度。该 evidence 只证明 artifact recoverability，不证明 VCP
runtime integration。

## P4 Portable Preview Capsule Evidence

`portable_preview_capsule_evidence` 和
`portable_preview_capsule_evidence_list` 只能从 `mock_data.js` 静态 seed
生成 preview capsule 摘要。它展示 Git-portable `preview.webp`、manifest、
import/review/approval record refs、clone-portable validation 和 registry
validation 状态。

| Static field | Review Console field | Notes |
| --- | --- | --- |
| `sample_id` | `portable_preview_capsule_evidence.sample_id` | 指向 accepted sample id |
| `sample_id[]` | `portable_preview_capsule_evidence_list[].sample_id` | 当前两颗 accepted preview capsules |
| `capsule_root` | `portable_preview_capsule_evidence.capsule_root` | 只作为 Git-portable evidence ref |
| `manifest_ref` | `portable_preview_capsule_evidence.manifest_ref` | 不读取文件 |
| `preview_ref` | `portable_preview_capsule_evidence.preview_ref` | 不创建、不复制、不转换 |
| `preview_sha256` | `portable_preview_capsule_evidence.preview_sha256` | 来自已验证 capsule seed |
| `preview_dimensions` | `portable_preview_capsule_evidence.preview_dimensions` | 当前 preview 为 `512x512` |
| `import_record_ref` / `review_record_ref` / `approval_record_ref` | same | 只展示 chain refs |
| `guard` | `portable_preview_capsule_evidence.guard` | 所有 external/runtime/write flags 必须为 false |

该 evidence 不读取 `asset_archive/` 文件，不 fetch，不写文件，不调用 runtime、
 provider、plugin、API、DailyNote 或 VCP memory，不写 accepted_samples /
 failure_samples / production_candidate，也不证明 VCP runtime integration。

## P4C Full Asset Archive Baseline Bridge

`full_asset_archive_baseline_state` 只把已经验证过的完整归档基线以静态面板和
draft output 形式暴露给 Review Console。它引用
`tests/schema_examples/full_asset_archive_manifest.example.json`、
`docs/FULL_ASSET_ARCHIVE_VERIFIED_GIT_TRACKED_BASELINE_GATE.md`、
`docs/ASSET_ARCHIVE_GIT_TRACKING_POLICY.md` 和
`reports/durable_archive_copy_execution/2026-05-20_durable_archive_copy_A5_execution_report.json`
作为链路证据，但浏览器本身不读取这些文件。

| Source | Review Console field | Rule |
| --- | --- | --- |
| `sample_id` | `full_asset_archive_baseline_state.sample_id` | 当前桥接样本固定为 `accepted_product_still_life_tennis_wallet_001` |
| `source_manifest_ref` | `full_asset_archive_baseline_state.source_manifest_ref` | 只展示 full archive manifest ref，不在浏览器读取 |
| `source_portable_preview_capsule_ref` | `fullAssetArchiveBaselineBody` | 只展示 Git-portable preview capsule ref |
| `durable_original_ref` | `fullAssetArchiveBaselineBody` | 只展示 `asset_archive/original_assets/by_sha256/` durable original ref |
| `archive_baseline_status` | `fullAssetArchiveBaselineSummary` | 必须保持 `verified_durable_archive_git_tracked` |
| `storage_strategy` | `fullAssetArchiveBaselineSummary` | 必须保持 `git_tracked_durable_archive` |
| `preview_clone_portable_validation_status` | `fullAssetArchiveBaselineSummary` | 必须继续证明 preview capsule clone-portable |
| `full_archive_readiness_status` | `fullAssetArchiveBaselineSummary` | 只证明 durable original 已被验证，不等于 production write 已开放 |
| `next_blockers[]` | `fullAssetArchiveBaselineBody` | 必须继续暴露 production / memory / runtime blocker |
| `guard` | `full_asset_archive_baseline_state.guard` / `fullAssetArchiveBaselineGuard` | 必须保持 static-only、no fetch、no file write、no asset archive read、no runtime |

本节只展示“完整归档基线已经在仓库里被证明存在”，不代表允许再次复制 durable
archive、也不代表 `production_candidate`、`DailyNote`、`VCP memory` 或 VCP
runtime integration 已经开放。它不得读取 `asset_archive/` 文件，不加载 preview，
不 fetch，不写文件，不调用 runtime、provider、plugin、API、DailyNote 或 VCP
memory。

## P6N Controlled Visual Production Loop Contract

`controlled_visual_production_loop_contract` 把当前已经本地对齐的 tennis wallet
canonical route 收束成一个单独的静态合同：accepted preview capsule、
failure-learning relation、`unified_capsule_contract_report`、verified durable
archive baseline，以及已经接上的 sample-bound review bridge。当前 route status
固定为 `capsule_archive_review_bridge_aligned_authorization_pending`。

| Source | Review Console field | Rule |
| --- | --- | --- |
| `accepted_product_still_life_tennis_wallet_001` | `controlled_visual_production_loop_contract.accepted_sample_id` | 当前 canonical accepted sample 固定为 tennis wallet |
| `failure_tennis_wallet_v7_21_001` | `controlled_visual_production_loop_contract.failure_sample_id` | 当前 canonical failure sample 必须继续解析到 tennis wallet |
| `full_asset_archive_baseline_state.archive_baseline_status` | `controlled_visual_production_loop_contract.route_segments[]` | durable archive segment 必须保持 `verified_durable_archive_git_tracked` |
| `unified_capsule_contract_report.contract_status.overall_passed` | `controlled_visual_production_loop_contract.route_segments[]` | capsule contract segment 必须保持 aligned |
| `review_report_static_handoff` | `controlled_visual_production_loop_contract.review_report_bridge` | 保留 generic handoff 存在性，但当前 canonical route 已通过独立 review bridge sample-bound |
| `sample_route_bound_static_only` | `controlled_visual_production_loop_contract.review_report_bridge.binding_status` | review bridge 必须以静态方式绑定到 tennis wallet route |

该合同只用于暴露当前本地受控闭环已经对齐到哪里、还差哪里。它不得读取
`asset_archive/` 文件，不加载 preview，不 fetch，不写文件，不调用 runtime、
provider、plugin、API、DailyNote 或 VCP memory，也不开放 production
candidate 写入。

## P6O Controlled Visual Production Loop Review Bridge

`controlled_visual_production_loop_review_bridge_state` 把当前 canonical route 的
review flow 绑定到样本级别，而不是继续停留在通用 candidate-template handoff：
accepted tennis wallet 样本作为 static positive example，failure tennis wallet
样本作为 failure-learning only / never-production。

| Source | Review Console field | Rule |
| --- | --- | --- |
| `accepted_product_still_life_tennis_wallet_001` | `controlled_visual_production_loop_review_bridge_state.bridge_rows[]` | accepted row 必须是 `pass`，但仍不得直接进入 memory 或 production |
| `failure_tennis_wallet_v7_21_001` | `controlled_visual_production_loop_review_bridge_state.bridge_rows[]` | failure row 必须是 `reject` 且 `never_production=true` |
| `review_report_static_handoff` | `controlled_visual_production_loop_review_bridge_state.source_links.generic_review_report_handoff_key` | generic handoff 继续保留，但不再承担 canonical route 的 sample-bound 表达 |
| `git_portable_preview_evidence_verified` / `git_portable_failure_preview_evidence_verified` | `review_evidence_status` | review bridge 只能复用现有本地验证结果，不得读取 asset 二进制 |
| `sample_route_bound_static_only` | `review_report_binding_status` | 当前桥接只证明本地静态绑定成立，不代表 runtime / production / memory 已开放 |

该 bridge 只对齐当前本地 review flow 合同，不替代旧的 adapter handoff 校验链，
也不得读取 `asset_archive/` 文件、加载 preview、fetch、写文件、调用 runtime、
provider、plugin、API、DailyNote 或 VCP memory。

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

## P6J Unified Capsule Contract

本节用于验收 `unified_capsule_contract_report` 静态 contract。它只从 mock 中模拟 `accepted_failure_capsule_registry_report_v2` + `capsule_manifest_contract_v1`，不得在浏览器执行 validator，不得读取 `asset_archive/`，不得加载 preview，不得写文件。

| Source | Review Console field | Rule |
| --- | --- | --- |
| `contract_status.registry_passed` | `unified_capsule_contract_report.contract_status.registry_passed` | accepted/failure registry 必须单独可见 |
| `contract_status.manifest_passed` | `unified_capsule_contract_report.contract_status.manifest_passed` | capsule manifest schema 结果必须单独可见 |
| `contract_status.relation_passed` | `unified_capsule_contract_report.contract_status.relation_passed` | failure -> accepted relation 不能被 totals 掩盖 |
| `contract_status.guard_passed` | `unified_capsule_contract_report.contract_status.guard_passed` | production / memory guard 不能被 clean summary 掩盖 |
| `samples[].manifest_validation_status` | `unifiedCapsuleContractRows` | 每个样本必须显示 manifest contract 状态 |
| `samples[].relation_validation_status` | `unifiedCapsuleContractRows` | failure sample 必须显示 resolved-by 状态 |
| `samples[].guard_validation_status` | `unifiedCapsuleContractRows` | 每个样本必须显示 no-production/no-memory guard 状态 |

## P6K Capsule Runtime Product Smoke Design

本节用于验收 `unified_capsule_contract_report` 的真实 operator flow 设计。它仍然是 static/design-only，不接浏览器 runtime validator，不读取 `asset_archive/`，不加载 preview，不 fetch，不写文件，不调用 provider/plugin/API/DailyNote/VCP memory，不创建 production candidate。

| Operator step | Review Console field | Rule |
| --- | --- | --- |
| Contract ingest | `unified_capsule_contract_report` | 只能来自 static mock / fixture / 外部本地 validator 输出，不由 UI 读取文件 |
| Summary triage | `contract_status.*` + totals | registry、manifest、relation、guard、overall 必须分开显示 |
| Per-capsule review | `samples[]` rows | 每行必须显示 manifest / relation / guard 状态和 reviewer action |
| Failure relation review | `resolved_by_accepted_sample` + `relation_validation_status` | failure -> accepted 断链不能被 totals 掩盖 |
| Guard review | `guard_validation_status` + guard summary | production / memory / runtime / provider guard 违规必须阻断 |
| Reviewer action | `reviewer_action` | action 是人工指令，不是可执行按钮 |

## P6L Capsule Static Product Smoke Fixture

本节用于验收 checked-in `unified_capsule_contract_report` fixture。fixture 位于 `tests/schema_examples/CAPSULE_STATIC_PRODUCT_SMOKE_UNIFIED_CONTRACT.example.json`，只作为静态输入，不由 UI 读取 `asset_archive/`，不加载 preview，不执行浏览器 validator。

| Fixture field | Review Console contract | Rule |
| --- | --- | --- |
| `totals.accepted/failure/total` | `unified_capsule_contract_report.totals` | 必须保持 accepted=2 / failure=2 / total=4 |
| `samples[].sample_id` | `unified_capsule_contract_report.samples[]` | 必须匹配本地 capsule registry report v2 输出 |
| `samples[].reviewer_action` | operator action label | pass 样本使用 `accept_contract_baseline` |
| `reviewer_action_catalog[].state=fail_closed` | fail-closed reviewer actions | 必须包含 manifest failure、relation repair、guard block、rerun local validator |
| `guard.asset_archive_ui_read_performed=false` | UI no-read boundary | UI 不读取 `asset_archive/` |
| `guard.preview_loaded_or_rendered=false` | preview boundary | UI 不加载 preview |

## Capsule static product smoke Review Console snapshot mapping

| Contract field | Static surface | Notes |
| --- | --- | --- |
| `unified_capsule_contract_report.totals` | Summary chips | Locked at accepted=2 / failure=2 / total=4 for the smoke fixture. |
| `samples[].reviewer_action` | Capsule row reviewer action | Uses fixture label `accept_contract_baseline`; fail-closed labels live in `reviewer_action_catalog`. |
| `reviewer_action_catalog[].state` | Snapshot validator action catalog | Requires pass and fail-closed labels to stay visible in static evidence. |
| `guard.asset_archive_ui_read_performed` | Static guard line | Must remain false; UI does not read asset archive. |
| `guard.preview_loaded_or_rendered` | Static guard line | Must remain false; no preview load. |
| `guard.browser_runtime_validator_executed` | Static guard line | Must remain false; validator is Node-only. |

## Capsule static operator checklist UI mapping

| Source field | Static checklist field | Rule |
| --- | --- | --- |
| `operator_actions[].label` | `operator_reviewer_checklist_state.checklist_items[].reviewer_action` | Every matrix action must appear exactly once as human checklist text. |
| `operator_actions[].human_action` | `checklist_items[].checklist_item` | Human reviewer instruction only; not an executable operation. |
| `operator_actions[].state` | `checklist_items[].state` | Keeps one pass item and four fail-closed items visible. |
| `checklist_items[].ui_affordance` | `static_text_only_not_executable_button` | Explicitly forbids executable UI buttons. |
| `operator_reviewer_checklist_state.guard.*` | static boundary flags | Runtime, browser validator, asset reads, preview load, provider/API, memory, and production remain false. |
| inspect_manifest_failure /
erun_local_validator_outside_ui | fail-closed checklist rows | Must stay static human instructions and never become executable buttons. |

| `inspect_manifest_failure` / `repair_relation_link` / `block_production_guard_violation` / `rerun_local_validator_outside_ui` | fail-closed checklist rows | Must stay static human instructions and never become executable buttons. |
