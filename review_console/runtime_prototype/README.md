# Review Console Runtime Prototype

本目录是 v1.2 可嵌入式 Review Console runtime prototype。它用于模拟未来 VCPChat 子窗口的输入输出，但仍然完全隔离。

## Boundary

- 不接真实 VCPChat。
- 不接真实 VCPToolBox。
- 不调用 VCP 插件。
- 不调用 API。
- 不调用 DailyNote。
- 不写磁盘。
- 不保存图片。
- 不读取真实 manifest。
- 不读取密钥、token、cookie、密码、私密路径或客户隐私。

## Runtime Shape

`runtime_guard.js` 提供 renderer 与 host mock 共用的 no-execution guard、session normalize 和草案安全校验。`host_bridge_mock.js` 模拟未来 preload 暴露的最小 bridge。页面只在浏览器内读取 mock session，并输出：

```yaml
review_session_draft: map
image_case_draft: map
memory_delta_draft: map
memory_completion_state_draft: map
accepted_candidate_delivery_package_draft: map
human_override_traceability_draft: map
inactive_authorization_capsules_draft: map
runtime_review_state_draft: map
local_commit_scope_plan_draft: map
bridge_mock_roundtrip_candidate_draft: map
real_bridge_authorization_package_draft: map
plugin_reliability_prompt_discipline_draft: map
memory_write_completion_candidate_draft: map
single_real_generation_retry_gate_draft: map
real_memory_write_authorization_package_draft: map
asset_archive_candidate_draft: map
traceability_items: list
traceability_counts: map
traceability_summary_cn: string
traceability_boundary_cn: string
prototype_guard:
  api_called: false
  daily_note_called: false
  vcp_plugin_called: false
  disk_write_performed: false
  image_file_created: false
host_preview_ack:
  selected_method: previewDraft
  accepted_by_host_mock: true
  validation_passed: true
  side_effects_performed: false
```

`FIELD_MAPPING.md` 记录 runtime 输出到 `review_session`、`image_case`、`memory_delta` 和 `memory_completion_state` schema 的映射关系。`tests/schema_examples/v1_2_runtime_prototype_output.example.yaml` 是验收用的无外部副作用草案样例。

## Memory Completion State Split

v5.2 增加 `memory_completion_state_draft`，把记忆写入相关状态拆成独立草案面，避免把 `memory_delta_draft.final_decision.should_write_to_vcp` 当成完成态。

该区块只记录本地草案层面的拆分，不代表真实 DailyNote 或 VCP memory 已写入：

- `write_requested`：是否已经形成写入请求。
- `write_authorized`：是否已经获得写入授权。
- `write_performed`：是否已经真实执行写入。
- `canonical_location_verified`：是否已经验证 canonical location。
- `canonical_hash_matched`：是否已经验证 canonical hash。
- `plugin_success_sufficient=false`：插件 success 不能单独视为完成。

当前 runtime prototype 仍然保持 no-write 边界，所有完成态只作为可读草案记录。

## First Runtime Patch

v3.7 为 runtime prototype 增加了项目内 host bridge 草案提交回执；Batch 4A 后页面默认使用 `previewDraft` mock 回执，保留 `submitDraft` 仅用于负向校验：

- renderer 在每次草案重算后先校验 `prototype_guard`。
- host mock 再次校验草案结构、人工 accepted 条件和 memory write 条件。
- UI 展示 host ack 和预览时间。
- host mock 永远保持 `side_effects_performed=false`，不写磁盘、不调用外部系统。

## Runtime Guard Extraction

v3.9 将 renderer 与 host mock 的重复 guard 规则收束到 `runtime_guard.js`：

- `app.js` 在 preview 草案前调用同一套 `assertDraftSafe()`。
- `host_bridge_mock.js` 在接收草案后调用同一套 `draftIsSafe()`。
- smoke test 加载同一模块，并验证顶层 guard 和 audit guard 被污染时都会被拒绝。
- 该模块仍只在项目内浏览器原型中运行，不创建 IPC、插件调用、API 调用、DailyNote 写入或文件写入。

## Runtime Contract Smoke Hardening

v4.0 起，smoke test 从 `index.html` 读取实际 `<script>` 顺序执行 runtime prototype，并校验 `ImageLabRuntimeGuard` 的共享 API。页面脚本顺序必须保持：

```text
runtime_guard.js -> host_bridge_mock.js -> app.js
```

这保证浏览器实际入口和 Node fake-DOM smoke test 使用同一加载契约。

## Runtime Guard Unit Validation

v4.1 增加 `scripts/validate_runtime_guard_unit.js`，直接在 Node VM 中加载共享 guard 并验证核心规则：

- clean guard 通过，dirty guard 和额外字段 guard 被拒绝。
- `clone()` 保持 JSON 深拷贝。
- `normalizeSession()` 为可选列表字段提供数组默认值。
- accepted 必须有人工审批。
- memory write request 必须有 memory approval。
- audit guard 和必需 draft section 缺失会被拒绝。

## Runtime Validation Suite

v4.2 增加 `scripts/validate_runtime_prototype_suite.js`，把 runtime prototype 相关语法检查、guard unit validation 和 fake-DOM smoke test 聚合为一个本地入口。suite 只读取项目内源码并执行本地 Node 校验，不访问网络、不调用外部服务、不写文件。

## v5.1 Runtime Delivery Surface

v5.1 增加 `scripts/validate_runtime_delivery_surface.js`，把 runtime prototype 的交付面变成机器可查状态：

- `index.html`、`styles.css`、`runtime_guard.js`、`host_bridge_mock.js`、`app.js`、`FIELD_MAPPING.md` 和本 README 必须齐全。
- 页面脚本顺序仍为 `runtime_guard.js -> host_bridge_mock.js -> app.js`。
- 预期 DOM id、host ack 面板和 draft output 面板必须存在。
- `FIELD_MAPPING.md` 必须覆盖 `review_session_draft`、`image_case_draft`、`memory_delta_draft`、`prototype_guard`、Bridge Mock Roundtrip 和 Host Preview Ack。
- runtime prototype 不加载外部 URL，不包含 `fetch`、IPC、storage 或文件写入调用。
- 该校验仍只证明项目内浏览器原型可交付，不代表真实 VCPChat 子窗口、preload、IPC、DailyNote 或 VCP 记忆写入已经实现。

## Runtime Review Follow-up Batch 2A + 2C

Batch 2A/2C 增加两个本地草案面和一个队列级追踪矩阵：

- `accepted_candidate_delivery_package_draft`：汇总候选 ref、脱敏资产指纹、评分档、风险摘要、人工批准摘要、`memory_delta` 预览和可复用规则摘要。
- `human_override_traceability_draft`：记录人工结论来源、覆盖理由、已知偏差、prompt compliance 是否完整、是否适合进入记忆。
- `traceability_items` / `traceability_counts` / `traceability_summary_cn` / `traceability_boundary_cn`：队列级 Human Override 可追踪性矩阵，固定包含交付包草案行和各队列追踪行，供本地审片与验收使用。

两者都固定 `package_status=draft_only`，并保持 `submitDraft_called=false`、`side_effects_performed=false`、插件/API/DailyNote/VCP memory/图片动作全 false。

## Runtime Review Batch 3A + 3B + 3C

Batch 3A/3B/3C 增加三个本地控制面：未激活授权胶囊、Runtime 状态收敛、本地提交范围计划。

- `inactive_authorization_capsules_draft`：生成未来真实生图重试、DailyNote/VCP memory 写入、VCPChat bridge 调用、provider-side prompt fingerprint capture、commit/tag/push/PR 的未激活授权胶囊。所有胶囊在用户另行明确激活前都保持 `authorization_status=inactive_package`。
- `runtime_review_state_draft`：把资产状态、记忆状态、交付包状态和人工覆盖轨迹收敛成一个可读状态，同时避免把记忆状态误当资产状态。
- `local_commit_scope_plan_draft`：把当前本地 diff 分成 runtime prototype、validators、docs/indexes 和 agent-board 组，但不 stage、不 commit、不 tag、不 push、不开 PR、不 release。

三个区块都由 `runtime_guard.js` 校验，仍然只是 no-execution 草案。

## Runtime Review Batch 4A Bridge Mock Roundtrip

Batch 4A 增加 `bridge_mock_roundtrip_candidate_draft`，只用项目内 fixture 证明 Adapter dry-run handoff -> Review Console runtime draft -> host bridge mock `previewDraft` 的最小回环。

- `selected_methods=["loadSession","previewDraft"]`。
- `bridge_mode=project_local_mock`，`source_fixture_policy=project_local_fixtures_only`。
- `bridge_calls_observed` 固定记录 `loadSession=1`、`previewDraft=1`、`submitDraft=0`、`production_submitDraft=0`。
- `ack_summaries` 只保存方法名、ack keys 和 no-write flags，不保存 raw IPC payload、runtime log、endpoint、源码片段或敏感值。
- `submitDraft_called=false`，所有插件/API/DailyNote/VCP memory/image flag 均为 false。

该区块不读取真实 VCPChat/VCPToolBox，不连接 CDP，不调用真实 bridge，不创建 IPC 或 preload 集成。

## Runtime Review Batch 4B Real Bridge Authorization Package

Batch 4B 增加 `real_bridge_authorization_package_draft`，只准备未来真实 VCPChat bridge 调用的未激活授权包。

- `authorization_status=inactive_package`。
- 允许方法固定为 `cancel`、`loadSession`、`previewDraft`。
- `submitDraft` 固定禁止。
- 真实 VCPChat root 只能在未来执行授权消息中提供，仓库只保存脱敏 ref 策略。
- `production_bridge_invocation_performed=false`、`real_cdp_called=false`、`source_read_performed=false`。

## Runtime Review Batch 5A Plugin Reliability and Prompt Discipline

Batch 5A 增加 `plugin_reliability_prompt_discipline_draft`，把 DoubaoGen / Photo Studio OS 的 prompt 家族、lint 规则、模型锁和失败分类整理成可验证本地草案。

- `prompt_registry_status=local_registry_candidate`。
- `prompt_hash` 使用本地稳定指纹。
- `selected_plugin_id=DoubaoGen`、`requested_model=doubao-seedream-5-0-260128`。
- `max_plugin_calls_allowed=0`，不调用插件，不创建图片。
- provider-side capture 保持 `authorization_status=inactive_package`。

## Runtime Review Batch 6A Memory Write Completion Candidate

Batch 6A 增加 `memory_write_completion_candidate_draft`，把未来真实记忆写入完成判定拆成可审计序列。

- 完成条件必须依次覆盖 `write_requested`、`write_authorized`、`writer_executed`、`canonical_target_exists`、`canonical_target_hash_matches`。
- 当前 no-write prototype 中 `writer_executed=false`、`canonical_target_exists=false`、`canonical_target_hash_matches=false`。
- `plugin_success_sufficient=false` 固定保持。
- wrong-location 分类为 `plugin_success_wrong_location`，不得声明完成。

## Runtime Review Batch 5B Single Real Generation Retry Gate

Batch 5B 增加 `single_real_generation_retry_gate_draft`，只准备未来单插件单次真实生图重试的授权门。

- `gate_status=single_real_generation_retry_gate_inactive`。
- `authorization_status=inactive_package`。
- `selected_plugin_id=DoubaoGen`、`selected_plugin_command=generate`、`requested_model=doubao-seedream-5-0-260128`。
- `max_plugin_calls_per_run=1` 只表示未来授权上限；当前 `plugin_calls_observed=0`。
- `real_generation_performed=false`、`image_created=false`、`memory_write_allowed_by_this_record=false`。
- 输出目录只保存受控 ref 策略，`raw_path_stored=false`，`overwrite_existing_files_allowed=false`。

本批不调用 DoubaoGen、不调用 API、不创建图片、不写记忆。

## Runtime Review Batch 6B Real Memory Write Authorization Package

Batch 6B 增加 `real_memory_write_authorization_package_draft`，只准备未来 DailyNote / VCP memory 单写授权包。

- `authorization_status=inactive_package`。
- `max_daily_note_writes=1`、`max_vcp_memory_writes=1`、`max_retry_attempts=1`。
- 正文必须是中文脱敏摘要。
- 禁止 raw path、endpoint、runtime log、raw plugin output、secret、token、cookie、password、客户隐私和图片二进制。
- `no_success_fabrication_rule=true`，失败不得伪造完成。
- 当前 `daily_note_called=false`、`vcp_memory_written=false`、`write_complete_declared=false`。

本批不调用 DailyNote、不写 VCP memory、不读取外部配置。

## Runtime Review Batch 7A Asset Archive Candidate

Batch 7A 增加 `asset_archive_candidate_draft`，把资产归档候选收束成 metadata-only/no-binary 模板。

- `archive_status=asset_archive_candidate_no_binary`。
- `archive_policy=metadata_only_no_binary`。
- 只归档 `output_path_ref`、`asset_hash`、`review_score`、中文脱敏 review summary、可复用规则和人工覆盖理由。
- 包含 `accepted_candidate`、`needs_human_review`、`rejected` 三类 closeout 模板。
- `binary_storage_allowed=false`、`git_binary_stored=false`、`memory_binary_stored=false`。

本批不保存图片二进制，不写 Git 图片，不写 DailyNote/VCP memory。

## Validation

```powershell
node --check review_console\runtime_prototype\runtime_guard.js
node --check review_console\runtime_prototype\host_bridge_mock.js
node --check review_console\runtime_prototype\app.js
node scripts\validate_runtime_guard_unit.js
node scripts\validate_runtime_prototype_smoke.js
node scripts\validate_runtime_delivery_surface.js
node scripts\validate_runtime_prototype_suite.js
```

人工验收时还应确认：

- 页面输出包含 `review_session_draft`、`image_case_draft`、`memory_delta_draft` 和 `prototype_guard`。
- 页面展示 host ack，且 ack 保持 `accepted_by_host_mock=true`、`side_effects_performed=false`。
- `human_review` 覆盖 `ai_review`，`final_review.source=human_review`。
- 未勾选人工批准时，`image_case_draft.asset_status` 不得为 `accepted`。
- `memory_delta_draft.chinese_diary_content` 为中文。
- 未批准记忆时，`memory_delta_draft.write_mode=draft` 且 `final_decision.should_write_to_vcp=false`。
- 即使记忆被 approved，也只表示写入申请被批准，不代表 DailyNote 已执行。
