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
- `FIELD_MAPPING.md`：草案输出到 schema 的字段映射验收说明。

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
