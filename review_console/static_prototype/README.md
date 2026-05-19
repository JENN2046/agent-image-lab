# Review Console 静态原型

本目录是 Phase 2 的隔离静态原型，用于验证 ImageLab Review Console 的页面结构、人工评分覆盖、中文评论、资产审批和记忆写入预览流程。

它不是 VCPChat 子窗口实现，也不是 VCPToolBox 插件或适配器。

## 边界

- 不接入 VCPChat。
- 不接入 VCPToolBox。
- 不调用 VCP 插件。
- 不调用 API。
- 不调用 DailyNote。
- 不写文件。
- 不保存图片，不创建图片文件。
- 不包含 API key、token、cookie、密码、私密路径或客户隐私。
- 所有数据都是 mock 草案，仅用于审片台交互验证。
- 页面只在浏览器内生成 `review_session` / `image_case` / `memory_delta` 草案。
- 草案输出不代表保存、入库、插件执行或写入长期记忆。

## 未来 Electron / VCPChat 边界

后续如果进入 VCPChat 子窗口，必须遵守：

- `contextIsolation=true`。
- `nodeIntegration=false`。
- IPC handler 必须校验 IPC sender。
- 不得通过 URL query 传 key、token、cookie、私密路径或客户隐私。
- renderer 不得直接调用 DailyNote。
- renderer 不得直接调用 VCP 插件。
- renderer 不得直接写文件或保存图片。

## 使用方式

直接用浏览器打开：

```text
review_console/static_prototype/index.html
```

页面内的“草案输出”只是在浏览器中生成 `review_session` / `image_case` / `memory_delta` 的预览文本，不代表保存、入库或写入长期记忆。
页面内的“本地导入记录读取”只解析用户粘贴、用户选择的本地 JSON 文件，或项目内置 v14.105 import record seed。解析结果只留在浏览器内存和草案输出中，不 fetch、不写文件、不调用 runtime / VCP / plugin / API / DailyNote / VCP memory。
页面内的“真实样片证据”只展示 v14.131 真实 artifact recoverability validator 证明过的 accepted sample 证据；它不能从 `PROJECT_MASTER_PLAN.md`、文档数量或 token 数量提升产品进度，也不代表 VCP runtime integration。
v14.169 新增 `artifact_lifecycle_state_reader` / Review Console artifact lifecycle state reader：它只读取静态 mock 或 fixture 中的 lifecycle state，到浏览器内存里展示 2 个 recoverable accepted sample 和 1 个 blocked third candidate；不 fetch、不写文件、不调用 runtime、不读 VCPChat/VCPToolBox，也不能把 pending candidate 算作 accepted sample。
v14.170 新增 `artifact_lifecycle_state_reader` draft output snapshot：用 `tests/schema_examples/v14_170_review_console_artifact_lifecycle_state_reader_draft_output_snapshot.example.json` 固化草案输出中的 lifecycle reader 结构，防止后续 UI 或 mock 漂移。
v14.171 新增 lifecycle 本地筛选控件：只在已经加载到浏览器内存的静态记录上筛选 `all` / `recoverable` / `blocked`，不 fetch、不写文件、不触发任何 registry 或 runtime 动作。
v14.172 新增 Prompt 到成片完成度静态面板：展示每条 lifecycle 记录的 prompt ref、artifact ref、完成度分数、证据和 blocker；只用于本地审查，不代表 accepted_samples 写入或 production_candidate 晋级。
v14.173 新增 Prompt 完成度 snapshot 回归：固定 `artifact_prompt_completion_state` 的 record count、blocked count、平均完成度和灯图 blocker，防止后续漂移。
v14.174 新增本地样片详情 drawer：点击 lifecycle 或 Prompt 完成度卡片，只展示已加载静态记录的 artifact、hash、prompt/import/review/category 等详情；不读取文件、不 fetch、不写入。
v14.175 新增详情 drawer snapshot 回归：固定 `artifact_detail_drawer_state` 的 selected artifact、hash、detail field count、selectable count 和灯图 blocker，防止后续漂移。
v14.176 新增样片证据对比面板：并排展示当前 selected recoverable sample 与被 `human_approval_missing` 阻断的灯图候选，帮助审查 2 个已恢复样片和第 3 个 pending candidate 的差异；只读、不写入、不升级状态。
v14.177 新增 compare state snapshot 回归：固定 `artifact_evidence_compare_state` 的 recoverable-vs-blocked pair、10 个对比字段、灯图 blocker 和三样片未完成状态。
v14.178 新增 compare filter lock：`artifact_evidence_compare_state` 固定对比被 `human_approval_missing` 阻断的灯图候选，不随本地 lifecycle filter 切换而隐藏第 3 个样片缺口。
v14.179 新增 compare filter lock snapshot 回归：固定 blocked lamp candidate、filter lock、blocker 和三样片未完成状态，防止后续改动把本地筛选显示误当正式通过。
v14.180 新增 artifact evidence status sort：本地证据视图按状态排序，把被 `human_approval_missing` 阻断的灯图候选排在前面；只改变静态显示顺序，不改变样片状态或登记结果。
v14.181 新增 status sort snapshot 回归：固定 blocked-candidates-first 排序、灯图 blocker、2 recoverable + 1 blocked 计数和三样片未完成状态。
v14.182 新增 status sort/filter interaction：固定 `all`、`recoverable`、`blocked` 三种本地筛选结果与 blocked-first 排序的关系，确保筛选只是本地 UI 范围，不改变样片状态。
v14.183 新增 status sort/filter interaction snapshot 回归：固定三种本地筛选语义、可见数量和灯图阻断候选，防止后续 UI/mock 漂移。
v14.184 新增 artifact evidence review notes panel：从已加载 lifecycle 静态记录生成审查意见摘要，明确 2 个 approved 样片和 1 个被 `human_approval_missing` 阻断的灯图候选；只读、不读取 review 文件、不写 accepted_samples。
v14.185 新增 artifact evidence review notes snapshot 回归：固定 2 个 approved note、1 个 pending/blocked lamp note、灯图 blocker 和未登记/未晋级 production 状态。
v14.186 新增 three-sample gap summary panel：直接展示当前硬验收需要 3 个完整可恢复样片、现有 2 个、剩余缺口 1 个，且 pending 灯图不能算作 accepted。
v14.187 新增 three-sample gap snapshot 回归：固定 required=3、recoverable=2、remaining_gap=1、灯图 blocker 和未登记/未晋级 production 状态，防止后续看板或 UI 漂移。
v14.188 新增 third-sample acceptance readiness panel：展示灯图作为第 3 个 accepted sample 的准备度，明确还缺 Jenn human approval，且 accepted_samples / production_candidate 写入仍被阻断。
v14.189 新增 third-sample acceptance readiness snapshot 回归：固定灯图 readiness 仍为 blocked_missing_human_approval，防止后续把 pending approval 漂移成 registration ready。
v14.191 新增 Review Console accepted_samples authorization package panel：展示 v14.190 第 3 样片登记授权包草案，保持 prepared_blocked_not_granted、authorization_granted=false、execution_ready=false，且只读显示精确授权语句和阻断边界。
v14.192 新增 accepted_samples authorization package snapshot 回归：固定 v14.191 面板仍为 golden_static_snapshot，防止后续把授权包漂移成 granted、execution_ready 或 accepted_samples 已写入。
v14.216 新增 Review Console post-approval gate 静态面板：展示 v14.215 第 3 样片批准后门禁，明确必须先通过 v14.214 user-submission intake，当前仍 blocked / human_approval_missing；只读、不写 accepted_samples、不晋级 production、不证明 VCP runtime integration。
v14.217 新增 post-approval gate snapshot 回归：固定 `third_sample_post_approval_gate_state` 仍为 golden_static_snapshot，防止后续把 human approval 缺失漂移成 approval captured、registration ready、accepted_samples write 或 VCP runtime integration。
v14.218 新增 human approval blocker queue 静态面板：把第 3 样片的 `human_approval_missing` 阻断项聚合成 `human_approval_blocker_queue_state`，让 Review Console 能直接展示所需 Jenn user-submission evidence、下一步本地动作和当前禁止写入状态。
v14.219 新增 human approval blocker queue snapshot 回归：固定 `human_approval_blocker_queue_state` 仍为 golden_static_snapshot，防止后续把 blocker queue 漂移成 approval captured、registration ready、write allowed 或 VCP runtime integration。
v14.221 新增 recoverability matrix 静态工作台：把 3 个样片逐行映射到 artifact、sha256、dimensions、mime、prompt、import、review、human approval、category index 和 registry 字段，明确当前只有 2 个 complete recoverable sample，第 3 个灯图仍被 `human_approval_missing` 阻断；只读、不写 accepted_samples、不晋级 production、不证明 VCP runtime integration。
v14.222 新增 recoverability matrix snapshot 回归：固定 `recoverability_matrix_state` 仍为 2 complete recoverable samples + 1 blocked lamp candidate，防止后续把 pending 灯图误算为第 3 个 accepted sample。
v14.223 新增 schema binding coverage 静态面板：把 `SCHEMA_BINDING.md` 绑定的 import record、local review record、accepted sample registry schema 显示到 Review Console，并核对 recoverability matrix 的 10 个必需字段均有 schema 覆盖；只读、不 fetch、不写文件、不调用 runtime。
v14.224 新增 schema binding coverage snapshot 回归：固定 `review_console_schema_binding_coverage_state` 仍为 3 个 schema、10 / 10 字段覆盖、无缺失字段，防止后续把 schema 覆盖漂移成 accepted_samples 写入或 VCP runtime integration。
v14.225 新增 6 个月目标缺口静态面板：把 Month 1-6 的产品目标映射到真实 recoverability/schema/authorization/dry-run 证据和剩余缺口，明确第 1 个月仍被第 3 样片 human approval 缺失阻断，且本地 recoverability、dry-run adapter、Review Console 静态读取、授权包 draft/preflight 都不等于 VCP runtime integration。
v14.226 新增 6 个月目标缺口 snapshot 回归：固定 `six_month_goal_gap_state` 仍为 Month 1 被 human approval 缺失阻断、2 / 3 可恢复样片、Month 5 需要 Jenn A5、VCP runtime integration 未证明，防止后续看板过度宣称。
v14.227 新增 failure state 静态工作台：从负向 ReviewReport 和 adapter negative guard mock 中展示失败候选、failure tags、memory forbidden、never production 和 production exclusion 状态；只读、不写 `failure_samples`、不晋级 production、不调用 runtime。
v14.228 新增 failure state snapshot 回归：固定 `failure_state_static_workbench_state` 仍为 2 个失败候选、1 个 memory-forbidden、2 个 never-production、2 个 production exclusion，防止后续把静态失败审查漂移成 `failure_samples` 写入、production 晋级或 VCP runtime integration。
P4 新增 portable preview capsule evidence 静态展示：`portable_preview_capsule_evidence` 只从 `mock_data.js` 展示 `asset_archive/accepted_samples/<sample_id>/manifest.json + preview.webp + import/review/approval records` 的 Git-portable 证据摘要；不 fetch、不写文件、不读取真实 manifest / VCPChat / VCPToolBox、不创建或复制图片。
P4b 将静态 evidence 扩展为 `portable_preview_capsule_evidence_list`，展示两颗已 clone-portable 验证的 accepted preview capsules；仍只读静态 seed，不读取 `asset_archive/` 文件。
P5K 新增 portable failure capsule evidence 静态展示：`portable_failure_capsule_evidence` 只从 `mock_data.js` 展示 `asset_archive/failure_samples/<sample_id>/manifest.json + preview.webp + failure/review records` 的 Git-portable 失败样本证据摘要；不加载 preview、不 fetch、不写文件、不读取 `asset_archive/`、不调用 runtime、不创建或复制图片。
草案输出还会携带 `review_result_protocol_static_handoff`，用于展示每个候选为什么 pass、为什么 reject、如何进入记忆草案，以及何时必须永远不得进入 production。
审片结果协议面板还会显示 `review_protocol_guard_summary`：包括 `memory_forbidden_count`、`memory_forbidden_candidate_ids`、`never_production_candidate_ids`、`negative_guard_observed` 和 production candidate 创建阻断状态。
草案输出还会携带 `review_decision_package_static_handoff`，用于展示 accepted/rejected sample 草案、memory delta 草案、production exclusion register，以及 `production_candidate_created=false`、`direct_memory_write_performed=false`、`accepted_samples_write_performed=false` 的决策包阻断状态。
草案输出还会携带 `review_evidence_blocker_contract_static_handoff`，用于展示 EvidenceRecord、BlockerDecision、ProductionExclusionRegister，以及 `evidence_record_is_not_approval`、`blocker_decision_is_not_write`、`no_production_without_human_review` 的证据仲裁边界。
草案输出还会携带 `review_blocker_arbiter_static_handoff`，用于展示最终 candidate route：pass 只进入待人工 review 草案，reject 只进入 failure learning 且永远不得进入 production。
草案输出还会携带 `review_report_static_handoff`，用于展示最终 ReviewReport：每张候选图为什么 pass 或 reject、当前为何不得进入记忆或 production、哪些写入和执行路径仍被阻断。
草案输出还会携带 `review_report_negative_guard_static_handoff`，用于展示负向 ReviewReport：memory-forbidden 候选为什么不得进入记忆、两个 rejected candidates 为什么永远不得进入 production，以及 unknown failure tag 如何触发硬阻断。
草案输出还会携带 `review_evidence_blocker_adapter_negative_static_handoff`，用于展示 adapter negative guard fixture 中的 memory-forbidden 候选、never-production 候选、production exclusion IDs，以及 evidence blocker golden fixture match 状态。
v14.055 还用 `tests/schema_examples/review_console_adapter_negative_fixture_draft_output_snapshot.example.json` 固化草案输出 snapshot，验证 `#draftOutput` 中的 adapter negative handoff 与静态 mock 和 adapter negative fixture 保持一致。
v14.061 还用 `tests/schema_examples/review_console_blocker_arbiter_draft_output_snapshot.example.json` 固化草案输出 snapshot，验证 `#draftOutput` 中的 blocker arbiter handoff 与静态 mock 和 PVOS adapter handoff 保持一致。
v14.070 还用 `tests/schema_examples/review_console_review_report_draft_output_snapshot.example.json` 固化草案输出 snapshot，验证 `#draftOutput` 中的 ReviewReport handoff 与静态 mock 和 PVOS adapter handoff 保持一致。
v14.072 还用 `tests/schema_examples/review_console_review_report_negative_guard_draft_output_snapshot.example.json` 固化草案输出 snapshot，验证 `#draftOutput` 中的 negative ReviewReport handoff 与静态 mock 和 PVOS negative adapter handoff 保持一致。
v14.073 还用 `tests/schema_examples/review_report_negative_guard_regression_matrix.example.json` 固化四表面一致性矩阵，验证 adapter contract、Review Console guard、static mock 和 draft output snapshot 的 negative ReviewReport 不漂移。
v14.074 还用 `tests/schema_examples/review_report_route_summary.example.json` 固化 ReviewReport 路由摘要，验证 pass、mapped reject 和 unknown reject 分别保持在草案审阅、failure learning 或 memory-forbidden never-production 路线。
v14.075 还用 `tests/schema_examples/review_report_admission_control_matrix.example.json` 固化 ReviewReport admission 阻断矩阵，验证当前所有 memory、production、accepted_samples 和 production candidate 写入都被阻断，并区分未来人工审批与永久禁止路线。
v14.076 还用 `tests/schema_examples/review_report_production_exclusion_register.example.json` 固化 ReviewReport production exclusion register，验证所有 rejected / never-production 候选被登记，pass 候选不被永久排除，unknown failure 同时阻断 memory 与 production。
v14.077 还用 `tests/schema_examples/review_report_memory_admission_register.example.json` 固化 ReviewReport memory admission register，验证 pass 只能进入 memory_delta 草案、mapped reject 只能进入 failure lesson 草案、unknown failure 永久不得进入 memory，且所有真实记忆写入仍被阻断。
v14.078 还用 `tests/schema_examples/review_report_memory_delta_draft_register.example.json` 固化 ReviewReport memory_delta 草案 register，验证可起草候选都有中文草案、unknown failure 不创建草案，且所有真实记忆写入仍被阻断。
v14.079 还用 `tests/schema_examples/review_report_protocol_final_closeout.example.json` 固化 ReviewReport 本地协议链 closeout，验证 route、admission、production exclusion、memory admission 和 memory draft 五层证据闭合。

## 文件说明

- `index.html`：静态页面结构。
- `styles.css`：静态样式。
- `mock_data.js`：固定 mock 数据，不包含真实图片、真实插件、API 或客户信息。
- `app.js`：浏览器内交互和草案文本生成。
- `artifact_lifecycle_state_reader.js`：本地静态样片生命周期读取器，不 fetch、不写文件、不调用 runtime。
- `FIELD_MAPPING.md`：草案输出到 schema 的字段映射验收说明。
- `SCHEMA_BINDING.md`：v14.144 静态 schema binding，绑定 import record、local review record 和 accepted sample registry schema。

## 字段映射验收

草案输出必须覆盖：

- `review_session`
- `image_case`
- `memory_delta`
- `review_result_protocol_static_handoff`
- `review_decision_package_static_handoff`
- `review_evidence_blocker_contract_static_handoff`
- `review_blocker_arbiter_static_handoff`
- `review_report_static_handoff`
- `review_report_negative_guard_static_handoff`
- `review_evidence_blocker_adapter_negative_static_handoff`
- `codex_session_import_record_reader`
- `artifact_recoverability_dashboard_evidence`
- `artifact_lifecycle_state_reader`
- `artifact_detail_drawer_state`
- `artifact_evidence_compare_state`
- `artifact_evidence_review_notes_state`
- `failure_state_static_workbench_state`
- `portable_preview_capsule_evidence`
- `portable_preview_capsule_evidence_list`
- `portable_failure_capsule_evidence`
- `portable_failure_capsule_evidence_list`
- `three_sample_gap_summary_state`
- `recoverability_matrix_state`
- `six_month_goal_gap_state`
- `third_sample_acceptance_readiness_state`
- `third_sample_accepted_samples_authorization_package_state`
- `third_sample_post_approval_gate_state`
- `human_approval_blocker_queue_state`

其中 `review_session` 必须能映射到 `schemas/review_session.schema.yaml` 和 `review_console/review_session.schema.yaml` 的字段语义。`FIELD_MAPPING.md` 是人工验收依据。
`review_result_protocol_static_handoff` 必须保留 pass/reject reasons、memory route、production route 和 `never_production` 边界。
`review_protocol_guard_summary` 必须作为可见 UI guard 呈现；它只显示阻断证据，不代表允许写入记忆、创建 production candidate 或执行插件。
`review_decision_package_static_handoff` 必须作为可见 UI guard 呈现；它只显示 sample/memory/exclusion 草案证据，不代表允许写入 accepted_samples、写入记忆或创建 production candidate。
`review_evidence_blocker_contract_static_handoff` 必须作为可见 UI guard 呈现；它只显示 evidence/blocker/arbitration 证据，不代表 approval、write、production promotion、accepted_samples 写入、记忆写入或插件执行。
`review_blocker_arbiter_static_handoff` 必须作为可见 UI guard 呈现；它只显示 final route、memory decision、production decision 和 blocker guard，不代表 production approval、accepted_samples 写入、记忆写入或插件执行。
`review_report_static_handoff` 必须作为可见 UI guard 呈现；它只显示 ReviewReport 的 pass/reject 解释、memory/production 阻断、never-production 和 no-execution guard，不代表 production approval、accepted_samples 写入、记忆写入、provider contact、插件调用或图片生成。
`review_report_negative_guard_static_handoff` 必须作为可见 UI guard 呈现；它只显示负向 ReviewReport 的 reject 解释、memory-forbidden、unknown failure tags、never-production 和 no-execution guard，不代表 production approval、accepted_samples 写入、记忆写入、provider contact、插件调用或图片生成。
`review_evidence_blocker_adapter_negative_static_handoff` 必须作为可见 UI guard 呈现；它只显示 adapter negative fixture 的阻断证据，不代表真实 adapter runtime、provider contact、plugin/API 调用、图片生成、accepted_samples 写入、记忆写入或 production promotion。
`codex_session_import_record_reader` 必须作为本地静态读取者呈现；它只解析 import record JSON 到内存摘要，不读取 real manifest / VCPChat / VCPToolBox，不 fetch，不写文件，不调用 runtime、provider、plugin、API、DailyNote 或 VCP memory。
`artifact_recoverability_dashboard_evidence` 必须作为本地静态 dashboard 证据呈现；它只能展示 v14.131 validator、真实 artifact、sha256、dimensions、review record、human approval、registry 和 category index 证据，不能把文档存在、旧 ledger 或 token 数量当成产品进度，也不能声称 VCP runtime integration。
`portable_preview_capsule_evidence` 必须作为本地静态 preview capsule 证据呈现；它只能展示 Git-tracked `preview.webp`、manifest、import/review/approval records、clone-portable validation 和 registry validation 状态，不得读取文件、不得 fetch、不得创建/复制/转换图片、不得写 accepted_samples、不得晋级 production_candidate 或声称 VCP runtime integration。
`portable_failure_capsule_evidence` 必须作为本地静态 failure preview capsule 证据呈现；它只能展示 Git-tracked `preview.webp`、manifest、failure/review records、clone-portable validation、failure tags、resolved accepted sample 和 never-production route，不得读取文件、不得 fetch、不得加载 preview、不得创建/复制/转换图片、不得写 failure_samples、不得写 DailyNote/VCP memory、不得晋级 production_candidate 或声称 VCP runtime integration。
`artifact_lifecycle_state_reader` 必须作为本地静态 lifecycle 读取者呈现；它只能展示 import/review/accepted_samples/blocker state 的内存解析结果，不能 fetch、写文件、调用 runtime、读取 VCPChat/VCPToolBox、写 accepted_samples、写 failure_samples、写 production_candidate、写 DailyNote 或写 VCP memory。
`review_console_artifact_lifecycle_state_reader_draft_output_snapshot.example.json` 必须与 v14.169 reader 输出保持一致；它是静态回归证据，不是浏览器执行、accepted_samples 写入或 VCP runtime integration。
`review_console_lifecycle_state_local_filter_controls.example.json` 必须验证本地筛选状态不会改变底层样片状态：`recoverable` 只显示 2 个已通过样片，`blocked` 只显示 pending lamp candidate，未知 filter 回落到 `all`。
`review_console_prompt_to_artifact_completion_static_panel.example.json` 必须验证 Prompt 到成片完成度面板只展示静态审查证据：2 条 review_complete、1 条 pending_human_review，灯图 blocker 仍是 `human_approval_missing`。
`review_console_prompt_completion_snapshot_static_regression.example.json` 必须与 v14.172 完成度面板保持一致；它是静态回归证据，不是 accepted_samples 写入、production_candidate 晋级或 VCP runtime integration。
`review_console_local_artifact_detail_drawer.example.json` 必须验证详情 drawer 只显示已加载静态记录，不得 fetch、写文件、写 accepted_samples、写 production_candidate 或声称 VCP runtime integration。
`review_console_artifact_detail_drawer_snapshot_static_regression.example.json` 必须与 v14.174 详情 drawer 保持一致；它是静态回归证据，不是 accepted_samples 写入、production_candidate 晋级或 VCP runtime integration。
`review_console_artifact_evidence_side_by_side_compare.example.json` 必须验证样片证据对比面板只并排展示已加载静态记录，不得 fetch、写文件、写 accepted_samples、写 production_candidate 或声称 VCP runtime integration。
`review_console_compare_state_snapshot_static_regression.example.json` 必须与 v14.176 对比面板保持一致；它是静态回归证据，不是 accepted_samples 写入、production_candidate 晋级或 VCP runtime integration。
`review_console_artifact_evidence_review_notes_panel.example.json` 必须验证 Review Notes 面板只从已加载 lifecycle 静态记录生成摘要：2 条 approved、1 条 pending/blocked，灯图 blocker 仍是 `human_approval_missing`，且不读取 review 文件、不写 accepted_samples、不晋级 production_candidate。
`review_console_artifact_evidence_review_notes_snapshot_static_regression.example.json` 必须与 v14.184 Review Notes 面板保持一致；它是静态回归证据，不是灯图人工通过、accepted_samples 写入、production_candidate 晋级或 VCP runtime integration。
`review_console_three_sample_gap_summary_panel.example.json` 必须验证三样片缺口摘要仍是 required=3、recoverable=2、remaining_gap=1、pending_candidate_counted_as_accepted=false，且灯图 blocker 仍是 `human_approval_missing`。
`review_console_three_sample_gap_snapshot_static_regression.example.json` 必须与 v14.186 三样片缺口摘要保持一致；它是静态回归证据，不是 accepted_samples 写入、production_candidate 晋级或 VCP runtime integration。
`review_console_third_sample_acceptance_readiness.example.json` 必须验证第 3 样片准备度仍被 Jenn human approval 缺失阻断，且 accepted_samples、failure_samples、production_candidate、DailyNote、VCP memory 和 runtime 写入均未执行。
`review_console_third_sample_acceptance_readiness_snapshot_static_regression.example.json` 必须与 v14.188 readiness 面板保持一致；它是静态回归证据，不是 Jenn approval、accepted_samples 写入、production_candidate 晋级或 VCP runtime integration。
`review_console_accepted_samples_authorization_package_panel.example.json` 必须验证第 3 样片 accepted_samples 授权包面板只展示 v14.190 草案：authorization package 仍为 prepared_blocked_not_granted，Jenn approval 和精确授权仍缺失，且 accepted_samples、category index、image copy、failure_samples、production_candidate、DailyNote、VCP memory、provider/API/plugin/MCP、real manifest/VCPChat/VCPToolBox、push/tag/release/deploy 均未执行。
`review_console_accepted_samples_authorization_package_snapshot_static_regression.example.json` 必须与 v14.191 授权包面板保持一致；它是静态回归证据，不是 Jenn approval、accepted_samples 写入、production_candidate 晋级或 VCP runtime integration。
`review_console_post_approval_gate_static_panel.example.json` 必须验证 `third_sample_post_approval_gate_state` 只展示 v14.215 post-approval gate：当前 blocker 仍是 `human_approval_missing`，v14.214 user-submission approval 尚未捕获，accepted_samples/category/failure/production/DailyNote/VCP memory/runtime/external/remote 动作均未执行。
`review_console_post_approval_gate_snapshot_static_regression.example.json` 必须与 v14.216 post-approval gate 面板保持一致；它是静态回归证据，不是 Jenn approval、accepted_samples 写入、production_candidate 晋级或 VCP runtime integration。
`review_console_human_approval_blocker_queue_static_panel.example.json` 必须验证 `human_approval_blocker_queue_state` 仍是只读阻断队列：当前唯一 blocker 是第 3 样片 `human_approval_missing`，下一步只能等待 Jenn user-submission 并运行 v14.214 intake，不允许现在写 accepted_samples 或声称 VCP runtime integration。
`review_console_human_approval_blocker_queue_snapshot_static_regression.example.json` 必须与 v14.218 blocker queue 面板保持一致；它是静态回归证据，不是 Jenn approval、accepted_samples 写入、production_candidate 晋级或 VCP runtime integration。
`review_console_recoverability_matrix_static_workbench.example.json` 必须验证 `recoverability_matrix_state` 仍按真实字段完整性计数：2 个 complete recoverable sample、1 个 blocked lamp candidate、remaining_gap=1，pending candidate 不得计入 accepted sample，且不得写 accepted_samples、failure_samples、production_candidate、DailyNote、VCP memory 或声称 VCP runtime integration。
`review_console_recoverability_matrix_snapshot_static_regression.example.json` 必须与 v14.221 recoverability matrix 保持一致；它是静态回归证据，不是 Jenn approval、accepted_samples 写入、production_candidate 晋级或 VCP runtime integration。
`review_console_schema_binding_coverage_static_panel.example.json` 必须验证 `review_console_schema_binding_coverage_state` 只展示静态 schema 覆盖：3 个 bound schemas、10 / 10 matrix required fields covered、无缺失字段、pending 灯图不计 accepted，且不得写 accepted_samples、failure_samples、production_candidate、DailyNote、VCP memory 或声称 VCP runtime integration。
`review_console_schema_binding_coverage_snapshot_static_regression.example.json` 必须与 v14.223 schema binding coverage 面板保持一致；它是静态回归证据，不是 Jenn approval、accepted_samples 写入、production_candidate 晋级或 VCP runtime integration。
`review_console_six_month_goal_gap_static_panel.example.json` 必须验证 `six_month_goal_gap_state` 只展示 6 个月目标缺口：Month 1 仍是 2/3 可恢复样片且被 `human_approval_missing` 阻断，Month 2-4 只能展示本地静态/授权草案/dry-run 进展，Month 5 需要 Jenn A5，Month 6 尚未证明 v1 闭环；不得把本地 recoverability、dry-run adapter、Review Console 静态读取或授权包 draft/preflight 声称为 VCP runtime integration。
`review_console_six_month_goal_gap_snapshot_static_regression.example.json` 必须与 v14.225 目标缺口面板保持一致；它是静态回归证据，不是 Jenn approval、accepted_samples 写入、production_candidate 晋级或 VCP runtime integration。
`review_console_failure_state_static_workbench.example.json` 必须验证 `failure_state_static_workbench_state` 只展示静态失败状态：失败候选、failure tags、unknown tags、memory forbidden、never production 和 production exclusion；不得写 `failure_samples`、DailyNote、VCP memory、accepted_samples、production_candidate，也不得声称 VCP runtime integration。
`review_console_failure_state_snapshot_static_regression.example.json` 必须与 v14.227 failure state 工作台保持一致；它是静态回归证据，不是 `failure_samples` 写入、DailyNote/VCP memory 写入、production_candidate 晋级或 VCP runtime integration。
`review_console_static_schema_binding` 必须绑定 `schemas/codex_session_image_import.schema.yaml`、`schemas/local_review_record.schema.yaml` 和 `schemas/accepted_sample_registry.schema.yaml`；它只做静态展示和草案映射，不 fetch、不写文件、不调用 runtime，不读取 real manifest / VCPChat / VCPToolBox，也不写 accepted_samples、DailyNote、VCP memory 或 production_candidate。
`review_console_adapter_negative_fixture_draft_output_snapshot.example.json` 必须与静态 mock 的 adapter negative handoff 和 `#draftOutput` 渲染结果一致；它是回归证据，不是执行授权。
`review_console_blocker_arbiter_draft_output_snapshot.example.json` 必须与静态 mock 的 blocker arbiter handoff、PVOS adapter handoff 和 `#draftOutput` 渲染结果一致；它是回归证据，不是执行授权。
`review_console_review_report_draft_output_snapshot.example.json` 必须与静态 mock 的 ReviewReport handoff、PVOS adapter handoff 和 `#draftOutput` 渲染结果一致；它是回归证据，不是执行授权。
`review_console_review_report_negative_guard_draft_output_snapshot.example.json` 必须与静态 mock 的 negative ReviewReport handoff、PVOS negative adapter handoff 和 `#draftOutput` 渲染结果一致；它是回归证据，不是执行授权。
`review_report_negative_guard_regression_matrix.example.json` 必须验证 negative ReviewReport 在 adapter contract、Review Console guard、static mock 和 draft output snapshot 之间一致；它是回归证据，不是执行授权。
`review_report_route_summary.example.json` 必须验证 positive / negative ReviewReport 的 pass、mapped reject 和 unknown reject 路由一致；它是回归证据，不是执行授权。
`review_report_admission_control_matrix.example.json` 必须验证 ReviewReport route summary 的 memory、production、accepted_samples 和 production candidate admission 全部保持阻断；它是回归证据，不是执行授权。
`review_report_production_exclusion_register.example.json` 必须验证 ReviewReport admission matrix 的 rejected candidates 都进入 production exclusion register，且 pass candidate 不进入永久 exclusion；它是回归证据，不是执行授权。
`review_report_memory_admission_register.example.json` 必须验证 ReviewReport admission matrix 的 memory 路径只产生草案或永久禁止记录，且不允许 DailyNote、VCP memory、direct memory、accepted_samples 或 production candidate 写入；它是回归证据，不是执行授权。
`review_report_memory_delta_draft_register.example.json` 必须验证 ReviewReport memory admission 的可起草候选只产生待人工审批的中文 memory_delta / failure lesson 草案，memory-forbidden 候选不得创建草案，且不允许任何真实记忆或生产写入；它是回归证据，不是执行授权。
`review_report_protocol_final_closeout.example.json` 必须验证 ReviewReport 从 route summary 到 memory draft register 的本地证据链闭合，且不允许任何真实记忆、生产、provider、plugin、API 或图片动作；它是回归证据，不是执行授权。
