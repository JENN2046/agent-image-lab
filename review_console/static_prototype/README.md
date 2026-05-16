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
草案输出还会携带 `review_result_protocol_static_handoff`，用于展示每个候选为什么 pass、为什么 reject、如何进入记忆草案，以及何时必须永远不得进入 production。
审片结果协议面板还会显示 `review_protocol_guard_summary`：包括 `memory_forbidden_count`、`memory_forbidden_candidate_ids`、`never_production_candidate_ids`、`negative_guard_observed` 和 production candidate 创建阻断状态。
草案输出还会携带 `review_decision_package_static_handoff`，用于展示 accepted/rejected sample 草案、memory delta 草案、production exclusion register，以及 `production_candidate_created=false`、`direct_memory_write_performed=false`、`accepted_samples_write_performed=false` 的决策包阻断状态。
草案输出还会携带 `review_evidence_blocker_contract_static_handoff`，用于展示 EvidenceRecord、BlockerDecision、ProductionExclusionRegister，以及 `evidence_record_is_not_approval`、`blocker_decision_is_not_write`、`no_production_without_human_review` 的证据仲裁边界。

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

其中 `review_session` 必须能映射到 `schemas/review_session.schema.yaml` 和 `review_console/review_session.schema.yaml` 的字段语义。`FIELD_MAPPING.md` 是人工验收依据。
`review_result_protocol_static_handoff` 必须保留 pass/reject reasons、memory route、production route 和 `never_production` 边界。
`review_protocol_guard_summary` 必须作为可见 UI guard 呈现；它只显示阻断证据，不代表允许写入记忆、创建 production candidate 或执行插件。
`review_decision_package_static_handoff` 必须作为可见 UI guard 呈现；它只显示 sample/memory/exclusion 草案证据，不代表允许写入 accepted_samples、写入记忆或创建 production candidate。
`review_evidence_blocker_contract_static_handoff` 必须作为可见 UI guard 呈现；它只显示 evidence/blocker/arbitration 证据，不代表 approval、write、production promotion、accepted_samples 写入、记忆写入或插件执行。
