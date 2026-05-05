# Validation Checklist

## 结构检查

- [ ] `docs/00_project_roadmap.md` 存在，并明确当前已完成层级、未完成层级和后续授权点。
- [ ] 所有任务书要求的 MVP 文件存在。
- [ ] 文件直接位于项目根目录下，没有创建第二套 `agent-image-lab/` 嵌套目录。
- [ ] 可运行 `scripts/validate_mvp.ps1` 完成只读自动检查；该脚本不是 Adapter、VCP 插件或真实执行入口。
- [ ] 未修改 `codex/00_MASTER_TASK.md`。
- [ ] 除用户授权的 v0.5 Adapter-only dry-run 安装外，未修改 VCPToolBox 其他路径。
- [ ] 未修改 VCPChat。

## 安全检查

- [ ] 没有 API key、token、cookie、密码、私密路径或客户隐私。
- [ ] 没有真实插件执行代码。
- [ ] 没有真实 VCP 生图 API 调用。
- [ ] 没有真实图片文件。
- [ ] asset_archive 只包含 README 和 `.gitkeep`。

## 记忆检查

- [ ] 所有 DailyNote / memory_delta 示例正文都是中文。
- [ ] `memory_delta.example.yaml` 包含 `agent_name`、`target_notebook`、`write_mode`、`approval_required`、`chinese_diary_content`、`tags`、`memory_safety`。
- [ ] 所有子 Agent 文件都包含 `memory_delta` 要求。
- [ ] 禁止写入长期记忆清单包含密钥、私密路径、客户隐私、图片二进制、未经确认的核心风格规则、单次 AI 推测和插件偶发失败结论。

## 视觉规则检查

- [ ] Photo Studio OS 视觉规则出现在 `docs/08_photo_studio_os_visual_rules.md`。
- [ ] Photo Studio OS 视觉规则出现在 `style_memory_seed/photo_studio_os.md`。
- [ ] Photo Studio OS 禁止方向出现在 `prompt_templates/photo_studio_os/negative_prompt.md`。
- [ ] 三处规则没有互相矛盾。

## Review Console 检查

- [ ] Review Console 规格和 schema 与静态原型边界一致。
- [ ] Phase 2 静态原型保持隔离，不接 VCPChat，不接 VCPToolBox。
- [ ] 明确人工评分覆盖 AI 评分。
- [ ] 明确 renderer 不直接写 DailyNote。
- [ ] 明确不直接调用 VCP 插件。

## Phase 2 静态原型检查

- [ ] `review_console/static_prototype/app.js` 通过 `node --check`。
- [ ] `review_console/static_prototype/mock_data.js` 通过 `node --check`。
- [ ] `git diff --check` 通过。
- [ ] 无真实 secret。
- [ ] 无图片文件。
- [ ] 无 API 调用。
- [ ] 无 DailyNote 调用。
- [ ] 无 VCP 插件调用。
- [ ] 静态原型没有写磁盘。
- [ ] `memory_preview.chinese_diary_content` 是中文。
- [ ] `human_review` 能覆盖 `ai_review`。
- [ ] `memory_approval.status` 未等于 `approved` 时不得写 DailyNote。
- [ ] 原型输出字段能映射 `review_session.schema.yaml`。
- [ ] `review_console/static_prototype/FIELD_MAPPING.md` 覆盖 `review_session`、`image_case`、`memory_delta`。
- [ ] `review_session` 草案输出包含 `image_versions`、`current_version_id`、`compare_version_id`、`final_review`、`annotation_notes`、`version_comparison`、`approval`、`archive_decision`、`memory_preview`、`memory_approval`、`next_iteration`、`audit_log`。
- [ ] 草案输出包含 `prototype_guard`，且 `api_called`、`daily_note_called`、`vcp_plugin_called`、`disk_write_performed`、`image_file_created` 均为 `false`。

## Phase 3 VCPChat 接入设计检查

- [ ] 每个 Phase 先有任务面板计划，再执行，再做只读 closeout。
- [ ] `review_console/vcpchat_integration_notes.md` 已从占位变成设计草案。
- [ ] Phase 3 只写 VCPChat 接入设计，不实现真实 VCPChat 子窗口。
- [ ] 未创建真实 IPC handler。
- [ ] 未修改真实 VCPChat。
- [ ] 未修改真实 VCPToolBox。
- [ ] 输入契约只允许受控 `review_session` 草案对象。
- [ ] 输出契约只返回 `review_session_draft`、`image_case_draft`、`memory_delta_draft`。
- [ ] renderer 不直接调用 DailyNote。
- [ ] renderer 不直接调用 VCP 插件。
- [ ] renderer 不发起外部 API 请求。
- [ ] renderer 不写文件，不保存图片。
- [ ] Electron 边界包含 `contextIsolation=true`、`nodeIntegration=false`、IPC sender 校验。
- [ ] 不通过 URL query、hash 或窗口标题传 key、token、cookie、私密路径或客户隐私。

## VCP dry-run 检查

- [ ] `integrations/vcp/` 只包含文档和 schema 草案。
- [ ] `exports/vcptoolbox/` 只包含 Adapter-only dry-run 包，不代表真实生图能力已启用。
- [ ] AgentImageLabAdapter 只允许 `dry_run` 命令。
- [ ] AgentImageLabAdapter 不包含 execution mode。
- [ ] AgentImageLabAdapter 没有 `index.js` 或真实生图执行入口。
- [ ] AgentImageLabAdapter 可以包含 `dry-run-adapter.js` VCP stdio dry-run 入口，但该入口只能返回草案并保持 no-execution guard。
- [ ] `plugin-manifest.json` 中 `external_api_allowed=false`。
- [ ] `plugin-manifest.json` 中 `execution_blocked=true`。
- [ ] `plugin-manifest.json` 中 `max_plugin_calls=0`。
- [ ] `plugin-manifest.json` 只允许 `dry_run`，且 `entryPoint.command=node dry-run-adapter.js`。
- [ ] 插件能力矩阵仅包含待实测 / 占位行，不推测真实插件能力。
- [ ] VCP 工具请求示例标注不代表真实执行、不含真实插件调用、不含密钥。

## Phase 4 MVP-B dry-run planning 检查

- [ ] Phase 4 只做 MVP-B / Adapter dry-run integration planning，不实现真实执行。
- [ ] 未创建真实插件执行入口。
- [ ] 未创建 `index.js` 或其他可执行 Adapter 逻辑。
- [ ] `vcp_task_envelope.schema.yaml` 包含 `mode=dry_run`。
- [ ] `vcp_task_envelope.schema.yaml` 包含 `max_plugin_calls=0`。
- [ ] `vcp_task_envelope.schema.yaml` 包含 `allow_external_api=false`、`allow_file_write=false`、`allow_image_binary=false`。
- [ ] `vcp_dispatch_plan.schema.yaml` 包含 `selected_plugin=null`。
- [ ] `vcp_dispatch_plan.schema.yaml` 包含 `execution_blocked=true`、`external_api_allowed=false`、`max_plugin_calls=0`。
- [ ] Adapter preflight 流程包含字段检查、安全检查、能力矩阵占位读取和拒绝路径。
- [ ] Gatekeeper handoff 和 Review Console handoff 已写清。
- [ ] 未来单插件接入前置条件已写清，但没有选择真实插件。
- [ ] rollback 只定义为丢弃 dry-run 草案，不撤销真实外部动作。
- [ ] audit 只记录中文脱敏摘要，不保存敏感原文。
- [ ] no-execution 矩阵覆盖 API、插件调用、DailyNote、文件写入、图片写入和 VCPToolBox / VCPChat 修改。

## Phase 7 单插件候选评估检查

- [ ] Phase 7 只做单插件候选评估与 dry-run 验收设计，不执行真实插件。
- [ ] `integrations/vcp/adapter_runtime_contract.md` 是契约说明，不是插件实现。
- [ ] `adapter_runtime_contract.md` 明确唯一允许命令是 `dry_run`。
- [ ] `adapter_runtime_contract.md` 明确禁止 `execute`、`generate`、`run`、`call_plugin`、`write_memory`、`write_image_file`。
- [ ] `adapter_runtime_contract.md` 明确 `selected_plugin=null`、`max_plugin_calls=0`、`external_api_allowed=false`、`execution_blocked=true`。
- [ ] `adapter_runtime_contract.md` 明确不写文件、不写图片、不写 DailyNote、不写 VCP 长期记忆。
- [ ] `adapter_runtime_contract.md` 明确 Gatekeeper handoff 不传敏感原文。
- [ ] `adapter_runtime_contract.md` 明确 Review Console handoff 只用于人工展示，不触发真实执行。
- [ ] `integrations/vcp/plugin_test_results.md` 是评估模板，不是真实测试结果。
- [ ] `plugin_test_results.md` 未填写真实插件名称或真实能力结论。
- [ ] `plugin_test_results.md` 的占位记录保持 `selected_plugin=null` 和 `max_plugin_calls_observed=0`。
- [ ] `plugin_test_results.md` 明确 manifest 读取需要另行授权。
- [ ] `plugin_test_results.md` 明确不复制 manifest 中的 API key、token、cookie、密码、私密路径或客户隐私。
- [ ] `plugin_test_results.md` 明确 `tested` 不自动表示允许真实执行。
- [ ] 能力矩阵仍保持 `待实测` / `pending_manifest_review` / `manifest_reviewed_safe` / `dry_run_checked` / `tested` 的人工推进语义。
- [ ] `tests/schema_examples/phase7_dry_run_review_memory.example.yaml` 串联 `vcp_task_envelope`、`vcp_dispatch_plan`、`review_session`、`memory_delta`。
- [ ] Phase 7 验收用例中 `task_id` 在四段对象中保持一致。
- [ ] Phase 7 验收用例中 `dispatch_plan` 保持 `selected_plugin=null`、`max_plugin_calls=0`、`execution_blocked=true`。
- [ ] Phase 7 验收用例中 `final_review` 明确使用 `human_review` 覆盖 `ai_review`。
- [ ] Phase 7 验收用例中 `memory_preview.chinese_diary_content` 是中文正文。
- [ ] Phase 7 验收用例中 `memory_delta.write_mode=confirmed` 时满足 `approval_status=approved`、`approved_by`、`approved_at`、`final_decision.should_write_to_vcp=true`。
- [ ] Phase 7 验收用例中 DailyNote / VCP 长期记忆写入仍标记为未执行。
- [ ] 未新增 `index.js` 或其他真实 Adapter 可执行入口。
- [ ] 未修改真实 VCPToolBox。
- [ ] 未修改真实 VCPChat。
- [ ] 未创建图片文件。
- [ ] 未调用 API、VCP 插件或 DailyNote。

## Phase 8 manifest 审查流程检查

- [ ] Phase 8 只设计 manifest 审查流程，不读取真实 VCPToolBox。
- [ ] Phase 8 不读取真实 VCPChat。
- [ ] `integrations/vcp/manifest_review_checklist.md` 存在。
- [ ] manifest 审查清单明确真实 manifest 读取必须另行授权。
- [ ] manifest 审查清单明确不得复制密钥、令牌、cookie、密码、私密路径或客户隐私原文。
- [ ] manifest 审查清单明确只允许保存中文脱敏摘要。
- [ ] manifest 审查清单明确 `tested` 不代表允许真实执行。
- [ ] 能力矩阵状态包含 `pending_manifest_review`、`manifest_reviewed_safe`、`dry_run_checked`、`tested`、`rejected`。
- [ ] 能力矩阵明确 `manifest_reviewed_safe`、`dry_run_checked`、`tested` 均不代表真实执行授权。
- [ ] `vcp_dispatch_plan.schema.yaml` 包含 `manifest_review` 字段。
- [ ] `manifest_review.sensitive_original_copied` 必须为 `false`。
- [ ] `manifest_review.real_execution_allowed` 必须为 `false`。
- [ ] `capability_matrix_status` 新状态不允许改变 `selected_plugin=null`、`max_plugin_calls=0`、`execution_blocked=true`。
- [ ] `tests/schema_examples/phase8_manifest_review_to_capability_matrix.example.yaml` 存在。
- [ ] Phase 8 状态推进样例明确 `real_manifest_read=false`。
- [ ] Phase 8 状态推进样例不包含真实 manifest 原文。
- [ ] Phase 8 状态推进样例只允许从 `待实测` 推进到 `pending_manifest_review`、`manifest_reviewed_safe` 或 `rejected`。
- [ ] Phase 8 的 `manifest_reviewed_safe` 示例如未读取真实 manifest，必须标记为模板字段，不得作为状态推进证据。
- [ ] Phase 8 状态推进样例未完成 dry-run 前禁止进入 `dry_run_checked` 或 `tested`。
- [ ] Phase 8 状态推进样例明确 `selected_plugin=null`、`max_plugin_calls=0`、`execution_blocked=true`。
- [ ] 未新增真实插件名称或真实插件能力结论。
- [ ] 未新增真实 manifest 原文。
- [ ] 未新增 `index.js` 或其他真实 Adapter 可执行入口。
- [ ] 未调用 API、VCP 插件或 DailyNote。
- [ ] 未创建图片文件。
- [ ] 未修改真实 VCPToolBox。
- [ ] 未修改真实 VCPChat。

## Phase 9 单插件 dry-run 准备前置检查

- [ ] Phase 9 只准备单插件 dry-run 实测结构，不读取真实 VCPToolBox。
- [ ] Phase 9 不读取真实 VCPChat。
- [ ] Phase 9 不调用真实插件、API、DailyNote 或文件写入。
- [ ] `plugin_test_results.md` 的 `manifest_review_status` 使用 `not_started` / `pending_manifest_review` / `manifest_reviewed_safe` / `rejected`。
- [ ] `plugin_test_results.md` 的 `capability_status` 使用 `待实测` / `pending_manifest_review` / `manifest_reviewed_safe` / `dry_run_checked` / `tested` / `rejected`。
- [ ] 旧式“批准进入 dry-run only”命名不再作为状态词使用。
- [ ] 未获得单独授权前，真实候选插件只能停留在 `待实测` 或 `pending_manifest_review`。
- [ ] `manifest_reviewed_safe` 只能由已授权的真实 manifest 脱敏审查产生，模板示例不能自动推进状态。
- [ ] 未完成 dry-run 验收前，不得进入 `dry_run_checked` 或 `tested`。
- [ ] 进入任何真实 manifest 读取任务前，必须先列出读取对象、读取方式、可摘录字段和禁止摘录字段。
- [ ] Phase 9 前置检查仍保持 `selected_plugin=null`、`max_plugin_calls=0`、`execution_blocked=true`。
- [ ] Phase 9 不新增真实插件名称、真实 manifest 原文或真实插件能力结论。
- [ ] `integrations/vcp/plugin_test_results.md` 包含 Phase 9 dry-run 测试包结构说明。
- [ ] `tests/schema_examples/phase9_single_plugin_dry_run_package.example.yaml` 存在。
- [ ] Phase 9 测试包样例包含 `package_metadata`、`no_execution_guard`、`candidate_snapshot`、`manifest_review_gate`、`dispatch_plan_draft`、`gatekeeper_review_draft`、`review_console_handoff_draft`、`memory_delta_draft` 和 `acceptance_assertions`。
- [ ] Phase 9 测试包样例中 `real_manifest_read=false`、`source_read_performed=false`、`vcp_toolbox_read=false`、`vcpchat_read=false`。
- [ ] Phase 9 测试包样例中 `selected_plugin=null`、`max_plugin_calls=0`、`execution_blocked=true`。
- [ ] Phase 9 测试包样例中 `memory_delta_draft.write_mode=draft` 且 `final_decision.should_write_to_vcp=false`。
- [ ] Phase 9 测试包样例只包含中文脱敏审计摘要和中文记忆正文。
- [ ] Phase 9 测试包样例未把 `pending_manifest_review` 自动推进到 `manifest_reviewed_safe`、`dry_run_checked` 或 `tested`。

## Phase 9 manifest 授权读取前置检查

- [ ] Phase 9 manifest 授权读取前置检查只规划门槛，不读取真实 VCPToolBox。
- [ ] Phase 9 manifest 授权读取前置检查不读取真实 VCPChat。
- [ ] Phase 9 manifest 授权读取前置检查不读取真实 manifest。
- [ ] `integrations/vcp/manifest_review_checklist.md` 包含 Phase 9 manifest 授权读取前置门槛。
- [ ] `tests/schema_examples/phase9_manifest_authorization_precheck.example.yaml` 存在。
- [ ] 授权前置样例包含 `authorization_request`、`read_scope_gate`、`extract_policy`、`safety_gate`、`approval_chain`、`next_state_rules` 和 `acceptance_assertions`。
- [ ] 授权前置样例包含 `authorization_request_id`、`candidate_id`、`requested_phase`、`target_manifest_ref`、`target_repository_ref`、`allowed_read_scope_cn`、`allowed_extract_fields`、`forbidden_extract_fields`、`next_allowed_state`、`real_execution_allowed` 和 `audit_summary_cn`。
- [ ] 授权前置样例保持 `source_authorized=false`、`source_read_performed=false`、`next_allowed_state=pending_manifest_review`、`real_execution_allowed=false`。
- [ ] 授权前置样例不包含真实插件名称、真实插件路径、真实 manifest 原文或真实插件能力结论。
- [ ] 授权前置样例不包含 API key、token、cookie、密码、私密路径、客户隐私或客户未公开信息。
- [ ] 授权前置样例不调用 API、VCP 插件、DailyNote，不写文件，不创建图片。
- [ ] 授权前置样例不得把 `pending_manifest_review` 自动推进到 `manifest_reviewed_safe`、`dry_run_checked` 或 `tested`。
- [ ] `manifest_reviewed_safe` 只能在未来真实 manifest 被单独授权读取并完成脱敏审查后产生。

## Phase 9 Review Console 审批记录映射检查

- [ ] Phase 9 Review Console 审批记录映射只写文档和验收样例，不实现 UI 或执行逻辑。
- [ ] `review_console/static_prototype/FIELD_MAPPING.md` 包含 Phase 9 审批记录映射说明。
- [ ] `tests/schema_examples/phase9_review_console_approval_mapping.example.yaml` 存在。
- [ ] 映射样例包含 `review_session_draft`、`approval`、`archive_decision`、`memory_preview`、`memory_approval`、`audit_log` 和 `memory_delta_draft`。
- [ ] 映射样例使用 `candidate-plugin-placeholder-001`，不记录真实插件名、真实路径或真实 manifest 原文。
- [ ] 映射样例保持 `source_authorized=false`、`source_read_performed=false`、`real_plugin_selected=false`。
- [ ] 映射样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`disk_write_performed=false`、`image_file_created=false`。
- [ ] 映射样例中的 `approval.status` 只代表授权申请草案，不代表已读取真实 manifest。
- [ ] 映射样例中的 `archive_decision.asset_status` 未人工批准时保持 `candidate`，不得为 `accepted`。
- [ ] 映射样例中的 `memory_approval.status=pending` 时，`memory_delta_draft.write_mode=draft`。
- [ ] 映射样例中的 `memory_delta_draft.final_decision.should_write_to_vcp=false`。
- [ ] 映射样例的记忆预览和审计摘要均为中文脱敏内容。
- [ ] Phase 9 Review Console 审批记录映射不得调用 API、VCP 插件、DailyNote，不得写文件或创建图片。
- [ ] Phase 9 Review Console 审批记录映射不得自动推进到 `manifest_reviewed_safe`、`dry_run_checked` 或 `tested`。

## Phase 10 manifest authorization gate 检查

- [ ] Phase 10 只固化 manifest 读取前置授权门槛，不读取真实 VCPToolBox。
- [ ] Phase 10 不读取真实 VCPChat。
- [ ] Phase 10 不读取真实 manifest。
- [ ] `integrations/vcp/manifest_review_checklist.md` 明确 canonical pre-read gate。
- [ ] `tests/schema_examples/phase10_manifest_authorization_gate.example.yaml` 存在。
- [ ] Phase 10 样例包含 `canonical_gate`、`authorization_requirements`、`extract_policy`、`no_execution_guard`、`state_rules`、`review_console_handoff`、`memory_delta_draft` 和 `acceptance_assertions`。
- [ ] Phase 10 样例保持 `source_authorized=false`、`source_read_performed=false`、`real_execution_allowed=false`。
- [ ] Phase 10 样例保持 `selected_plugin=null`、`max_plugin_calls=0`。
- [ ] Phase 10 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`。
- [ ] Phase 10 样例不得把状态推进到 `manifest_reviewed_safe`、`dry_run_checked` 或 `tested`。
- [ ] Phase 10 样例不得记录真实插件名、真实 manifest 原文、真实插件路径或真实能力结论。
- [ ] Phase 10 样例不得包含 API key、token、cookie、密码、私密路径、客户隐私或客户未公开信息。
- [ ] Phase 10 样例的记忆正文和审计摘要必须为中文脱敏内容。
- [ ] Phase 10 不调用 API、VCP 插件、DailyNote，不写文件，不创建图片。

## Phase 11 manifest review record template 检查

- [ ] Phase 11 只补齐 no-read manifest review record template，不读取真实 VCPToolBox。
- [ ] Phase 11 不读取真实 VCPChat。
- [ ] Phase 11 不读取真实 manifest。
- [ ] `integrations/vcp/manifest_review_checklist.md` 包含 Phase 11 no-read manifest review record template。
- [ ] `tests/schema_examples/phase11_manifest_review_record_template.example.yaml` 存在。
- [ ] Phase 11 样例包含 `source_scope`、`sanitized_review_record`、`state_control`、`no_execution_guard`、`forbidden_raw_fields`、`review_console_handoff`、`memory_delta_draft` 和 `acceptance_assertions`。
- [ ] Phase 11 样例只允许中文脱敏摘要字段：`plugin_display_name_summary_cn`、`command_summary_cn`、`input_output_summary_cn`、`permission_risk_cn`、`gatekeeper_notes_cn`、`sanitized_review_summary_cn`。
- [ ] Phase 11 样例保持 `source_authorized=false`、`source_read_performed=false`、`real_execution_allowed=false`。
- [ ] Phase 11 样例保持 `selected_plugin=null`、`max_plugin_calls=0`。
- [ ] Phase 11 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`。
- [ ] Phase 11 样例不得把状态推进到 `manifest_reviewed_safe`、`dry_run_checked` 或 `tested`。
- [ ] Phase 11 样例不得记录真实插件名、真实 manifest 原文、真实插件路径或真实能力结论。
- [ ] Phase 11 样例不得包含 API key、token、cookie、密码、私密路径、客户隐私或客户未公开信息。
- [ ] Phase 11 样例的记忆正文和审计摘要必须为中文脱敏内容。
- [ ] Phase 11 不调用 API、VCP 插件、DailyNote，不写文件，不创建图片。

## Phase 12 capability matrix state governance 检查

- [ ] Phase 12 只固化能力矩阵状态治理规则，不读取真实 VCPToolBox。
- [ ] Phase 12 不读取真实 VCPChat。
- [ ] Phase 12 不读取真实 manifest。
- [ ] `integrations/vcp/vcp_plugin_capability_matrix.md` 包含 Phase 12 state governance。
- [ ] `tests/schema_examples/phase12_capability_state_governance.example.yaml` 存在。
- [ ] Phase 12 样例包含 `state_catalog`、`positive_transition_rules`、`forbidden_transition_rules`、`rejected_transition_rule`、`capability_matrix_update_draft`、`review_console_handoff`、`memory_delta_draft` 和 `acceptance_assertions`。
- [ ] Phase 12 样例保持 `source_authorized=false`、`source_read_performed=false`、`real_execution_allowed=false`。
- [ ] Phase 12 样例保持 `selected_plugin=null`、`max_plugin_calls=0`。
- [ ] Phase 12 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`。
- [ ] Phase 12 样例只允许 `待实测`、`pending_manifest_review` 或 `rejected` 作为 v0.2 当前状态。
- [ ] Phase 12 样例证明未授权读取真实 manifest 时不得进入 `manifest_reviewed_safe`。
- [ ] Phase 12 样例证明未完成 dry-run 验收时不得进入 `dry_run_checked`。
- [ ] Phase 12 样例证明未完成人工确认时不得进入 `tested`。
- [ ] Phase 12 样例不得记录真实插件名、真实 manifest 原文、真实插件路径或真实能力结论。
- [ ] Phase 12 样例的记忆正文和审计摘要必须为中文脱敏内容。
- [ ] Phase 12 不调用 API、VCP 插件、DailyNote，不写文件，不创建图片。

## Phase 13 dry-run dispatch readiness 检查

- [ ] Phase 13 只补齐 dry-run dispatch readiness fixture，不读取真实 VCPToolBox。
- [ ] Phase 13 不读取真实 VCPChat。
- [ ] Phase 13 不读取真实 manifest。
- [ ] `integrations/vcp/vcp_tool_request_examples.md` 包含 Phase 13 dry-run dispatch readiness 说明。
- [ ] `tests/schema_examples/phase13_dry_run_dispatch_readiness.example.yaml` 存在。
- [ ] Phase 13 样例包含 `capability_state_snapshot`、`dispatch_readiness_input`、`dispatch_plan_draft`、`gatekeeper_handoff`、`review_console_handoff`、`memory_delta_draft`、`no_execution_guard` 和 `acceptance_assertions`。
- [ ] Phase 13 样例只消费 sanitized placeholder capability data，不选择真实插件。
- [ ] Phase 13 样例保持 `selected_plugin=null`、`max_plugin_calls=0`、`execution_blocked=true`。
- [ ] Phase 13 样例保持 `external_api_allowed=false`、`allow_file_write=false`、`allow_image_binary=false`。
- [ ] Phase 13 样例保持 `real_execution_allowed=false`、`api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`。
- [ ] Phase 13 样例不得把 `pending_manifest_review` 解释为可执行插件。
- [ ] Phase 13 样例不得进入 `dry_run_checked` 或 `tested`。
- [ ] Phase 13 样例的 Gatekeeper / Review Console handoff 必须是 display-only。
- [ ] Phase 13 样例不得记录真实插件名、真实 manifest 原文、真实插件路径或真实能力结论。
- [ ] Phase 13 样例的记忆正文和审计摘要必须为中文脱敏内容。
- [ ] Phase 13 不调用 API、VCP 插件、DailyNote，不写文件，不创建图片。

## Phase 14 Review Console approval closure 检查

- [ ] Phase 14 只补齐 Review Console 审批路径样例，不实现 UI 或执行逻辑。
- [ ] `review_console/review_console_product_spec.md` 包含 Phase 14 审批路径闭环说明。
- [ ] `tests/schema_examples/phase14_review_console_approval_paths.example.yaml` 存在。
- [ ] Phase 14 样例包含 `approve_as_candidate`、`reject`、`request_manifest_authorization` 和 `request_memory_edit` 四条审批路径。
- [ ] Phase 14 样例保持 `selected_plugin=null`、`max_plugin_calls=0`、`execution_blocked=true`。
- [ ] Phase 14 样例保持 `source_authorized=false`、`source_read_performed=false`、`real_manifest_read=false`、`real_execution_allowed=false`。
- [ ] Phase 14 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`disk_write_performed=false`、`image_file_created=false`。
- [ ] `approve_as_candidate` 只能输出 `asset_status=candidate`，不得等同于正式 `accepted`。
- [ ] `accepted` 必须有人类批准，AI 的 `archive_recommendation` 不能替代人工批准。
- [ ] `request_manifest_authorization` 只能生成独立授权申请草案，不能读取真实 manifest。
- [ ] `request_memory_edit` 中 `memory_approval.status != approved` 时，`memory_delta_draft.write_mode=draft`。
- [ ] 拒绝路径只能保留中文审计草案，不写 DailyNote 或 VCP 长期记忆。
- [ ] Phase 14 样例不得记录真实插件名、真实 manifest 原文、真实插件路径或真实能力结论。
- [ ] Phase 14 样例的记忆正文和审计摘要必须为中文脱敏内容。
- [ ] Phase 14 不调用 API、VCP 插件、DailyNote，不写文件，不创建图片。

## Phase 15 Memory / DailyNote handoff closure 检查

- [ ] Phase 15 只补齐 Memory / DailyNote no-write handoff 样例与边界说明，不实现写入逻辑。
- [ ] `memory_policy/write_permissions.md` 明确 `final_decision.should_write_to_vcp=true` 只表示写入请求获批，不是执行证明。
- [ ] `memory_policy/write_permissions.md` 明确 v0.2 保持 `daily_note_called=false`、`vcp_memory_written=false`、`actual_write_performed=false`。
- [ ] `tests/schema_examples/phase15_memory_handoff_no_write.example.yaml` 存在。
- [ ] Phase 15 样例包含 `approved_memory_request_no_write` 和 `sensitive_manifest_rejection`。
- [ ] 已批准写入请求样例允许 `write_mode=confirmed`、`approval_status=approved`、`approved_by`、`approved_at` 和 `final_decision.should_write_to_vcp=true`，但必须同时保持未执行写入。
- [ ] 已批准写入请求样例保持 `daily_note_called=false`、`vcp_memory_written=false`、`actual_write_performed=false`。
- [ ] 敏感 manifest 拒绝样例使用 `write_mode=forbidden`、`approval_status=rejected`、`final_decision.should_write_to_vcp=false`。
- [ ] 敏感 manifest 拒绝样例不得复制真实 manifest 原文、密钥、token、cookie、密码、私密路径、客户隐私或客户未公开信息。
- [ ] 敏感原文不得进入 `memory_delta`、`preserved_original`、`tags`、审计日志、拒绝原因或 DailyNote 中文正文。
- [ ] Phase 15 样例保持 `selected_plugin=null`、`max_plugin_calls=0`、`source_authorized=false`、`source_read_performed=false`。
- [ ] Phase 15 样例保持 `real_manifest_read=false`、`real_execution_allowed=false`、`api_called=false`、`vcp_plugin_called=false`。
- [ ] Phase 15 样例的记忆正文、拒绝原因和审计摘要必须为中文脱敏内容。
- [ ] Phase 15 不读取真实 VCPToolBox，不读取真实 VCPChat，不读取真实 manifest。
- [ ] Phase 15 不调用 API、VCP 插件、DailyNote，不写文件，不创建图片。

## v0.3.0-adapter-recon 检查

- [ ] v0.3.0-adapter-recon 只补齐 Adapter recon 前置规划，不读取真实 VCPToolBox。
- [ ] v0.3.0-adapter-recon 不读取真实 VCPChat。
- [ ] v0.3.0-adapter-recon 不读取真实 manifest。
- [ ] `integrations/vcp/adapter_recon_plan.md` 存在。
- [ ] `tests/schema_examples/v0_3_adapter_recon_authorization.example.yaml` 存在。
- [ ] recon 计划明确真实 manifest 读取必须作为后续独立授权点。
- [ ] recon 计划明确唯一目标是为未来单一候选 manifest 读取做授权准备。
- [ ] 授权样例包含 `recon_request`、`target_scope_gate`、`extract_policy`、`safety_gate`、`approval_chain`、`state_rules`、`review_console_handoff`、`memory_delta_draft` 和 `acceptance_assertions`。
- [ ] 授权样例保持 `source_authorized=false`、`source_read_performed=false`、`real_manifest_read=false`。
- [ ] 授权样例保持 `external_repo_access_allowed=false`、`allowed_source_paths=[]`、`allowed_file_types=[]`、`sensitive_path_redaction_required=true`。
- [ ] 授权样例保持 `real_execution_allowed=false`、`selected_plugin=null`、`max_plugin_calls=0`。
- [ ] 授权样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`。
- [ ] 授权样例当前状态保持 `pending_manifest_review`。
- [ ] 授权样例不得进入 `manifest_reviewed_safe`、`dry_run_checked` 或 `tested`。
- [ ] 授权样例只写未来允许摘录的脱敏字段名，不写真实摘录值。
- [ ] 允许摘录字段仅限脱敏显示名摘要、命令集合中文摘要、输入输出模式中文摘要、权限风险中文摘要和 Gatekeeper 复查点。
- [ ] 禁止字段覆盖 API key、token、cookie、密码、私密路径、客户隐私、服务端点原文、manifest 敏感配置原文、图片二进制和真实插件输出。
- [ ] 授权样例不包含真实插件名、真实 manifest 原文、真实插件路径或真实能力结论。
- [ ] 授权样例不包含密钥、token、cookie、密码、私密路径、客户隐私或客户未公开信息。
- [ ] Review Console handoff 只能 display-only，不能读取 manifest 或触发执行。
- [ ] `memory_delta_draft.write_mode=draft` 且 `final_decision.should_write_to_vcp=false`。
- [ ] 授权样例的记忆正文和审计摘要必须为中文脱敏内容。
- [ ] v0.3.0-adapter-recon 不新增 `index.js`、`.exe` 或其他真实执行入口；`scripts/validate_mvp.ps1` 仅作为仓库只读校验工具，不属于 Adapter 执行入口。
- [ ] v0.3.0-adapter-recon 不调用 API、VCP 插件、DailyNote，不写文件，不创建图片。

## v0.3.0 manifest read authorization gate 检查

- [ ] v0.3.0 manifest read authorization gate 只补齐真实 manifest 读取授权门槛，不读取真实 VCPToolBox。
- [ ] v0.3.0 manifest read authorization gate 不读取真实 VCPChat。
- [ ] v0.3.0 manifest read authorization gate 不读取真实 manifest。
- [ ] `integrations/vcp/manifest_read_authorization_gate.md` 存在。
- [ ] `tests/schema_examples/v0_3_manifest_read_authorization_gate.example.yaml` 存在。
- [ ] 授权门槛文档明确“准备授权读取”和“实际读取 manifest”是两个不同阶段。
- [ ] 授权门槛样例包含 `authorization_request`、`target_scope`、`read_method_gate`、`extract_policy`、`forbidden_content_policy`、`approval_chain`、`state_transition_rules`、`no_execution_guard`、`audit_record`、`memory_delta_draft` 和 `acceptance_assertions`。
- [ ] 授权门槛样例保持 `read_authorized=false`、`read_performed=false`、`source_authorized=false`、`source_read_performed=false`、`real_manifest_read=false`。
- [ ] 授权门槛样例保持 `external_repo_access_allowed=false`、`allowed_source_paths=[]`、`allowed_file_types=[]`、`sensitive_path_redaction_required=true`。
- [ ] 授权门槛样例保持 `raw_manifest_copy_allowed=false`、`real_execution_allowed=false`、`selected_plugin=null`、`max_plugin_calls=0`。
- [ ] 授权门槛样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`。
- [ ] 授权门槛样例当前状态保持 `pending_manifest_review`。
- [ ] 授权门槛样例不得进入 `manifest_reviewed_safe`、`dry_run_checked` 或 `tested`。
- [ ] 授权门槛样例只列出未来允许摘录字段名，不写真实摘录值。
- [ ] 允许摘录字段仅限脱敏显示名摘要、命令集合中文摘要、输入输出模式中文摘要、权限风险中文摘要和 Gatekeeper 复查点。
- [ ] 禁止字段覆盖 API key、token、cookie、密码、私密路径、客户隐私、服务端点原文、manifest 敏感配置原文、图片二进制、真实插件输出和真实运行日志。
- [ ] 授权门槛样例不包含真实插件名、真实 manifest 原文、真实插件路径或真实能力结论。
- [ ] 授权门槛样例不包含密钥、token、cookie、密码、私密路径、客户隐私或客户未公开信息。
- [ ] 授权门槛样例不新增 `index.js`、`.exe` 或其他真实执行入口；`scripts/validate_mvp.ps1` 仅作为仓库只读校验工具，不属于 manifest 读取或 Adapter 执行入口。
- [ ] 授权门槛样例不创建图片文件。
- [ ] 授权门槛样例的记忆正文、拒绝原因和审计摘要必须为中文脱敏内容。
- [ ] `index.js`、`.exe`、图片扩展如被扫描命中，只能作为负面检查项出现，不得是真实文件证据；`scripts/validate_mvp.ps1` 是唯一允许的只读校验脚本。
- [ ] 本阶段不调用 API、VCP 插件、DailyNote，不写文件，不创建图片。

## v0.3.0 manifest sanitized read preflight 检查

- [ ] v0.3.0 manifest sanitized read preflight 只补齐真实 manifest 脱敏读取执行前授权规划，不读取真实 VCPToolBox。
- [ ] v0.3.0 manifest sanitized read preflight 不读取真实 VCPChat。
- [ ] v0.3.0 manifest sanitized read preflight 不读取真实 manifest。
- [ ] `integrations/vcp/manifest_sanitized_read_preflight.md` 存在。
- [ ] `tests/schema_examples/v0_3_manifest_sanitized_read_preflight.example.yaml` 存在。
- [ ] preflight 文档明确 Patch 03 不构成读取授权，也不开始读取。
- [ ] preflight 样例包含 `preflight_request`、`source_scope_guard`、`read_method_preflight`、`sanitized_output_policy`、`approval_chain`、`state_rules`、`no_execution_guard`、`memory_delta_draft` 和 `acceptance_assertions`。
- [ ] preflight 样例保持 `read_execution_authorized=false`、`read_execution_started=false`、`read_completed=false`。
- [ ] preflight 样例保持 `source_authorized=false`、`source_read_performed=false`、`real_manifest_read=false`、`raw_manifest_copied=false`。
- [ ] preflight 样例保持 `external_repo_access_allowed=false`、`allowed_source_paths=[]`、`allowed_file_types=[]`、`sensitive_path_redaction_required=true`。
- [ ] preflight 样例保持 `real_execution_allowed=false`、`selected_plugin=null`、`max_plugin_calls=0`。
- [ ] preflight 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`。
- [ ] preflight 样例当前状态保持 `pending_manifest_review`。
- [ ] preflight 样例不得进入 `manifest_reviewed_safe`、`dry_run_checked`、`tested`、`plugin_selected`、`execution_ready` 或 `real_execution_ready`。
- [ ] preflight 样例只列出未来允许输出的中文脱敏字段名，不写真实摘录值。
- [ ] 允许输出仅限脱敏显示名摘要、命令集合中文摘要、输入输出模式中文摘要、权限风险中文摘要、Gatekeeper 复查点和中文脱敏审计摘要。
- [ ] 禁止输出覆盖 raw manifest 原文、真实私密路径、API key、token、cookie、密码、endpoint 原文、客户隐私、图片二进制、真实插件输出、运行日志和真实插件能力结论。
- [ ] preflight 样例不包含真实插件名、真实 manifest 原文、真实插件路径或真实能力结论。
- [ ] preflight 样例不包含密钥、token、cookie、密码、私密路径、客户隐私或客户未公开信息。
- [ ] preflight 样例不新增 `index.js`、`.exe` 或其他真实执行入口；`scripts/validate_mvp.ps1` 仅作为仓库只读校验工具，不属于读取或执行入口。
- [ ] preflight 样例不创建图片文件。
- [ ] preflight 样例的记忆正文、拒绝原因和审计摘要必须为中文脱敏内容。
- [ ] 本阶段不调用 API、VCP 插件、DailyNote，不写文件，不创建图片。

## v0.3.0 authorization planning closeout 检查

- [ ] `integrations/vcp/v0_3_authorization_closeout.md` 存在。
- [ ] closeout 只确认 no-read / no-execution 边界，不读取真实 VCPToolBox、VCPChat 或 manifest。
- [ ] closeout 确认所有 v0.3 样例保持 `source_authorized=false`、`source_read_performed=false`、`real_manifest_read=false`。
- [ ] closeout 确认所有 v0.3 样例保持 `real_execution_allowed=false`、`selected_plugin=null`、`max_plugin_calls=0`。
- [ ] closeout 确认未出现真实插件名、真实 manifest 原文、真实插件路径或真实能力结论。
- [ ] `scripts/validate_mvp.ps1` 会扫描 v0.3 授权文档和样例中的越权锁定值。

## Phase C manifest 脱敏读取授权检查

- [ ] `integrations/vcp/phase_c_manifest_sanitized_read_contract.md` 存在。
- [ ] `tests/schema_examples/phase_c_manifest_read_authorization_request.example.yaml` 存在。
- [ ] `integrations/vcp/phase_c_manifest_sanitized_review_record.md` 存在。
- [ ] `tests/schema_examples/phase_c_manifest_sanitized_review_record.example.yaml` 存在。
- [ ] Phase C 合约明确没有唯一候选和用户明确授权时不得读取真实 manifest。
- [ ] Phase C 授权样例保持 `user_authorized=false`、`source_authorized=false`、`source_read_performed=false`、`real_manifest_read=false`。
- [ ] Phase C 授权样例保持 `selected_plugin=null`、`max_plugin_calls=0`、`api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`。
- [ ] Phase C 只允许未来输出中文脱敏摘要，不允许保存 raw manifest 原文。
- [ ] Phase C 审查记录可以进入 `manifest_reviewed_safe`，但必须保持 `real_execution_allowed=false`。
- [ ] Phase C 审查记录不得保存 raw manifest 原文，不得写 DailyNote，不得选择真实插件。

## Phase D Adapter dry-run 最小契约检查

- [ ] `adapter_dry_run_lab/adapter_dry_run.js` 存在，且只属于项目内实验目录。
- [ ] `exports/vcptoolbox/Plugin/AgentImageLabAdapter/dry-run-adapter.js` 存在，且不读文件、不写文件、不调用 API、不调用插件。
- [ ] `adapter_dry_run_lab/fixtures/accepted_request.json` 和 `adapter_dry_run_lab/fixtures/rejected_request.json` 存在。
- [ ] `integrations/vcp/phase_d_adapter_dry_run_minimal_contract.md` 存在。
- [ ] `tests/schema_examples/phase_d_adapter_dry_run_minimal.example.yaml` 存在。
- [ ] Phase D 契约明确唯一允许命令是 `dry_run`。
- [ ] `adapter_dry_run_lab/adapter_dry_run.js` 通过 `node --check`。
- [ ] accepted fixture 返回 `accepted_draft`，rejected fixture 返回 `rejected`。
- [ ] 导出候选 `dryRun(input)` 使用 accepted fixture 返回 `accepted_draft`。
- [ ] Phase D 样例保持 `selected_plugin=null`、`max_plugin_calls=0`、`external_api_allowed=false`、`execution_blocked=true`。
- [ ] Phase D 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`file_write_performed=false`、`image_file_created=false`。
- [ ] 未在 `exports/vcptoolbox/Plugin/AgentImageLabAdapter/` 下创建 `index.js` 或其他真实执行入口。

## v0.5-v1.0 完成计划检查

- [ ] `docs/20_real_loop_completion_plan.md` 存在。
- [ ] `integrations/vcp/v0_5_adapter_install_authorization.md` 存在，且默认 `user_authorized=false`。
- [ ] `integrations/vcp/v0_5_adapter_install_verification.md` 存在，并记录 accepted/rejected dry-run 验收。
- [ ] `tests/schema_examples/v0_5_adapter_install_verification.example.yaml` 存在，并保持 no-execution guard 全为 false / 0。
- [ ] `integrations/vcp/v0_6_real_plugin_manifest_authorization.md` 存在，且默认 `user_authorized=false`。
- [ ] `integrations/vcp/v0_6_real_plugin_manifest_sanitized_review.md` 存在，并只保存中文脱敏摘要。
- [ ] `tests/schema_examples/v0_6_real_plugin_manifest_sanitized_review.example.yaml` 存在，并保持 `real_execution_allowed=false`。
- [ ] `integrations/vcp/v0_7_gatekeeper_risk_boundary.md` 存在。
- [ ] `integrations/vcp/v0_7_real_execution_authorization_gate.md` 存在。
- [ ] `integrations/vcp/v0_7_photo_studio_os_dry_run_rehearsal.md` 存在。
- [ ] `review_console/v0_7_human_approval_preflight.md` 存在。
- [ ] `workflows/v0_7_real_execution_preflight_confirmation.md` 存在。
- [ ] v0.7 schema examples 存在，并保持 `real_execution_allowed=false`、`max_plugin_calls_authorized=0` 或 `max_plugin_calls=0`。
- [ ] `workflows/photo_studio_os_real_loop_runbook.md` 存在。
- [ ] `RELEASE_NOTES.md` 存在，并明确当前只完成 Adapter dry-run 安装验证和 manifest 脱敏审查，未调用插件、未写 DailyNote。

## v0.6 单一真实 manifest 脱敏审查检查

- [ ] v0.6 只读取一个用户授权的真实生图插件 manifest。
- [ ] v0.6 不执行插件、不调用 API、不读 config.env、不读运行日志、不读 VCPChat。
- [ ] v0.6 审查记录不包含 raw manifest 原文。
- [ ] v0.6 审查记录不包含本地绝对路径、endpoint 原文、密钥、token、cookie、密码或客户隐私。
- [ ] v0.6 审查记录只包含中文脱敏显示名摘要、命令摘要、输入输出摘要、权限风险和 Gatekeeper 复查点。
- [ ] v0.6 可以推进到 `manifest_reviewed_safe`，但不得推进到 `dry_run_checked` 或 `tested`。
- [ ] v0.6 保持 `selected_plugin=null`、`max_plugin_calls=0`、`api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`。
- [ ] v0.6 不授权真实执行，不创建图片文件。

## v0.7 真实执行前置包检查

- [ ] v0.7 前置包只定义 Gatekeeper、Review Console 和真实执行前确认表，不调用真实插件。
- [ ] Gatekeeper 风险边界当前状态为 `blocked_until_authorized`。
- [ ] Review Console 人工审批当前状态为 `pending`。
- [ ] 真实执行前确认表当前状态为 `waiting_for_user_real_execution_authorization`。
- [ ] v0.7 前置包默认保持 `selected_plugin_for_execution=null`。
- [ ] v0.7 前置包默认保持 `max_plugin_calls_authorized=0`。
- [ ] v0.7 前置包默认保持 `real_execution_allowed=false`。
- [ ] v0.7 dry-run rehearsal 返回 `accepted_draft`，但保持 `selected_plugin=null`、`max_plugin_calls=0`。
- [ ] v0.7 独立授权门保持 `waiting_for_explicit_user_authorization`。
- [ ] v0.7 前置包不得包含真实本地路径、endpoint 原文、密钥、token、cookie、密码或客户隐私。
- [ ] v0.7 前置包不得把 Review Console approval、accepted_draft 或 manifest_reviewed_safe 解释为真实执行授权。
- [ ] v0.7 前置包不写 DailyNote、不写文件、不创建图片。

## 无执行闭环检查

- [ ] `tests/schema_examples/task_envelope.example.yaml` 是 Photo Studio OS 无执行样例。
- [ ] `tests/schema_examples/review_score.example.yaml` 有分项评分和中文评审。
- [ ] `tests/schema_examples/memory_delta.example.yaml` 有中文正文和安全检查。
- [ ] MVP-A 闭环能串联：用户需求 → task_envelope → prompt_package → review_score → human_review → memory_delta → case_summary。

## v1.1 VCPChat Review Console Integration Plan 检查

- [ ] `review_console/v1_1_vcpchat_review_console_contract.md` 存在。
- [ ] v1.1 只做 VCPChat 子窗口接入规划，不修改真实 VCPChat。
- [ ] IPC 草案只包含 `imageLabReview.loadSession`、`imageLabReview.previewDraft`、`imageLabReview.submitDraft` 和 `imageLabReview.cancel`。
- [ ] Electron 边界明确 `contextIsolation=true`、`nodeIntegration=false`、preload 最小 allowlist API 和 IPC sender 校验。
- [ ] renderer 不直接调用 DailyNote、VCP 插件、API 或文件系统。
- [ ] 不通过 URL query、hash 或窗口标题传 key、token、cookie、私密路径或客户隐私。

## v1.2 Review Console Runtime Prototype 检查

- [ ] `review_console/runtime_prototype/` 存在。
- [ ] `review_console/runtime_prototype/FIELD_MAPPING.md` 存在，并覆盖 `review_session_draft`、`image_case_draft`、`memory_delta_draft`。
- [ ] `tests/schema_examples/v1_2_runtime_prototype_output.example.yaml` 存在。
- [ ] `node --check review_console/runtime_prototype/host_bridge_mock.js` 通过。
- [ ] `node --check review_console/runtime_prototype/app.js` 通过。
- [ ] runtime prototype 输出 `review_session_draft`、`image_case_draft`、`memory_delta_draft` 和 `prototype_guard`。
- [ ] `prototype_guard` 保持 `api_called=false`、`daily_note_called=false`、`vcp_plugin_called=false`、`disk_write_performed=false`、`image_file_created=false`。
- [ ] runtime prototype 不使用外部 API、DailyNote、VCP 插件、Node 文件系统或图片二进制。
- [ ] `review_session_draft` 包含 `status`、`image_versions`、`comments`、`approval`、`archive_decision`、`memory_preview`、`memory_approval`、`next_iteration` 和 `audit_log`。
- [ ] `image_case_draft` 包含 `image_type`、`input_assets`、`output_assets`、`plugin_used`、`review_ids`、`human_approval`、中文优缺点和可复用规则。
- [ ] `memory_delta_draft` 包含 `created_at`、`agent_role`、`memory_type`、`approval_required`、`source`、`preserved_original`、`visibility`、`promotion` 和 `final_decision`。
- [ ] `human_review` 覆盖 `ai_review`，`final_review.source=human_review`。
- [ ] 未人工批准时不得生成正式 `accepted`。
- [ ] `memory_approval.status != approved` 时，`memory_delta.write_mode=draft`。
- [ ] `memory_approval.status != approved` 时，`memory_delta.final_decision.should_write_to_vcp=false`。

## v1.3 DailyNote / VCP Memory Handoff 检查

- [ ] `memory_policy/v1_3_daily_note_handoff_contract.md` 存在。
- [ ] `tests/schema_examples/v1_3_memory_handoff_preflight.example.yaml` 存在。
- [ ] `tests/schema_examples/v1_3_memory_write_authorization_chain.example.yaml` 存在。
- [ ] v1.3 记录集覆盖写入申请、Review Console 审批、Archivist_Agent 复查、ImageLab_Master 复核、DailyNote 写入前授权、执行审计占位、撤销计划和拒绝审计。
- [ ] `should_write_to_vcp=true` 只表示写入申请已批准，不代表已经写入。
- [ ] `daily_note_called=false` 保持到未来独立写入授权点。
- [ ] `actual_write_performed=false` 保持到未来独立写入授权点。
- [ ] `daily_note_write_authorized=false` 保持到未来独立写入授权点。
- [ ] `vcp_memory_written=false` 保持到未来独立写入授权点。
- [ ] 所有记忆正文、拒绝原因和审计摘要为中文脱敏内容。
- [ ] 敏感字段不得进入 `memory_delta`、`preserved_original`、tags、拒绝原因或审计日志。

## v1.4 Multi-plugin Candidate Evaluation 检查

- [ ] `integrations/vcp/v1_4_multi_plugin_candidate_evaluation.md` 存在。
- [ ] `tests/schema_examples/v1_4_multi_plugin_candidate_matrix.example.yaml` 存在。
- [ ] `tests/schema_examples/v1_4_candidate_decision_packet.example.yaml` 存在。
- [ ] 多插件候选评估不批量读取真实 VCPToolBox / VCPChat。
- [ ] 每个真实 manifest 读取都必须单独授权。
- [ ] 候选 decision packet 包含 manifest 授权状态、脱敏审查模板、Gatekeeper 风险分类、表现评分维度和 Review Console handoff。
- [ ] 能力矩阵只记录中文脱敏摘要和风险分类。
- [ ] 不保存 raw manifest、endpoint 原文、密钥、私密路径或客户隐私。
- [ ] `read_authorized=false` 时，`read_performed=false`。
- [ ] `dry_run_planned` 只能在 `manifest_reviewed_safe` 后出现。
- [ ] Review Console 只能生成候选审批草案或授权请求，不触发读取、执行或写入。
- [ ] `tested` 不等于真实执行授权。

## v1.5 Task Panel Status Backbone 检查

- [ ] `task_panel/task_panel_product_spec.md` 存在。
- [ ] `task_panel/task_panel_state.schema.yaml` 存在。
- [ ] `task_panel/task_panel_state_mapping.md` 存在。
- [ ] `tests/schema_examples/v1_5_task_panel_state.example.yaml` 存在。
- [ ] Task Panel 只展示状态和下一授权点，不实现 UI。
- [ ] Task Panel 状态覆盖 `task_status`、`dispatch_status`、`review_status`、`memory_status`、`asset_status`、`plugin_candidate_status`、`gatekeeper_status` 和 `next_authorization_point`。
- [ ] `no_execution_guard` 保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`file_write_performed=false`、`image_file_created=false`、`real_manifest_read=false`、`real_execution_allowed=false`、`max_plugin_calls=0`。
- [ ] `selected_plugin=null`，不得自动选择真实插件。
- [ ] `daily_note_write_authorized=false`，不得把写入申请解释为已写入 DailyNote。
- [ ] `image_binary_saved=false`，不得保存图片二进制。
- [ ] 下一授权点必须写明授权名称、原因、授权前条件、授权后允许动作和当前禁止动作。

## v1.6 Asset Index + Review Console Embed Readiness 检查

- [ ] `asset_index/asset_index_policy.md` 存在。
- [ ] `asset_index/asset_index.schema.yaml` 存在。
- [ ] `tests/schema_examples/v1_6_asset_index.example.yaml` 存在。
- [ ] `review_console/v1_6_embed_boundary_contract.md` 存在。
- [ ] `review_console/embed_readiness_checklist.md` 存在。
- [ ] `tests/schema_examples/v1_6_review_console_embed_readiness.example.yaml` 存在。
- [ ] Asset Index 只记录资产引用、SHA256、评分、状态、人工审批和已知视觉偏差。
- [ ] Asset Index 不保存图片二进制、raw 插件输出、runtime log 原文、endpoint 原文、密钥、私密路径或客户隐私。
- [ ] `asset_status=accepted` 必须有 `human_approval.approved=true`、`approved_by` 和 `approved_at`。
- [ ] Review Console embed readiness 不修改真实 VCPChat / VCPToolBox。
- [ ] Review Console embed readiness 不创建真实 IPC handler 或执行入口。
- [ ] Electron 边界必须包含 `contextIsolation=true`、`nodeIntegration=false`、preload allowlist 和 IPC sender 校验。
- [ ] 不通过 URL query/hash/window title/localStorage/sessionStorage/clipboard/raw IPC 传递敏感信息。
- [ ] v1.6 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`file_write_performed=false`、`image_file_created=false`。

## v1.7 Plugin Performance + Release Automation Readiness 检查

- [ ] `integrations/vcp/plugin_performance_score.schema.yaml` 存在。
- [ ] `integrations/vcp/plugin_performance_score_policy.md` 存在。
- [ ] `tests/schema_examples/v1_7_plugin_performance_score.example.yaml` 存在。
- [ ] `release_automation/release_preflight_contract.md` 存在。
- [ ] `release_automation/package_validation_checklist.md` 存在。
- [ ] `tests/schema_examples/v1_7_release_preflight.example.yaml` 存在。
- [ ] Plugin Performance Score 不把 `tested`、`dry_run_checked` 或 `accepted_by_human` 解释为真实执行授权。
- [ ] Plugin Performance Score 不保存 raw 插件输出、endpoint 原文、secret、私密路径、客户隐私、runtime log 原文或图片二进制。
- [ ] v1.7 插件评分样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`real_execution_allowed=false`。
- [ ] Release Automation 只停留在 preflight contract，不创建 tag、zip、sha256 或 GitHub Release。
- [ ] v1.7 发布样例保持 `tag_created=false`、`package_created=false`、`sha256_created=false`、`release_published=false`、`release_assets_uploaded=false`。
- [ ] `release_packages/` 必须保持 Git ignored，发布包不得提交进 Git。
- [ ] 任何 tag、push、package、GitHub Release 或 asset upload 都必须单独授权。

## v1.8 v2.0 Productization Baseline Readiness 检查

- [ ] `docs/60_v2_0_productization_baseline_readiness.md` 存在。
- [ ] `tests/schema_examples/v1_8_v2_0_baseline_readiness.example.yaml` 存在。
- [ ] v1.8 readiness 汇总 v1.1 到 v1.7 的完成轨道。
- [ ] v1.8 readiness 覆盖 Task Panel、Review Console、Asset Index、Style Memory、Plugin Performance Score 和 Release Automation。
- [ ] v1.8 readiness 保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`real_execution_allowed=false`。
- [ ] v1.8 readiness 保持 `tag_created=false`、`package_created=false`、`sha256_created=false`、`release_published=false`、`release_assets_uploaded=false`。
- [ ] v1.8 readiness 明确 v2.0 baseline 仍需独立授权。
- [ ] v1.8 readiness 不修改真实 VCPChat / VCPToolBox，不读取真实 manifest，不调用插件、API、DailyNote 或发布 GitHub Release。

## v2.0 Productization Plan 检查

- [ ] `docs/50_v2_0_productization_plan.md` 存在。
- [ ] v2.0 不默认包含自动真实生图、自动 DailyNote 写入或自动插件选择。
- [ ] v2.0 产品化入口条件包含 v1.1、v1.2、v1.3、v1.4 完成。

## v2.0 Productization Baseline 检查

- [ ] `docs/70_v2_0_productization_baseline.md` 存在。
- [ ] `tests/schema_examples/v2_0_productization_baseline.example.yaml` 存在。
- [ ] v2.0 baseline 汇总 v1.1 到 v1.8 的完成轨道。
- [ ] v2.0 baseline 覆盖 Task Panel、Review Console、Asset Index、Style Memory、Plugin Performance Score 和 Release Automation。
- [ ] v2.0 baseline 保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`real_execution_allowed=false`。
- [ ] v2.0 baseline 保持 `vcpchat_modified=false`、`vcptoolbox_modified=false`。
- [ ] v2.0 baseline 保持 `tag_created=false`、`package_created=false`、`sha256_created=false`、`release_published=false`、`release_assets_uploaded=false`。
- [ ] v2.0 baseline 不新增真实执行能力、不创建发布资产、不修改真实外部仓库。

## v2.1 VCPChat Embed Preflight Contract 检查

- [ ] `docs/80_v2_1_vcpchat_embed_preflight.md` 存在。
- [ ] `review_console/embed_contract/vcpchat_embed_contract.md` 存在。
- [ ] `tests/schema_examples/v2_1_vcpchat_embed_preflight.example.yaml` 存在。
- [ ] v2.1 只做 VCPChat 子窗口嵌入前置契约，不修改真实 VCPChat。
- [ ] v2.1 不读取真实 VCPChat 或 VCPToolBox 源码。
- [ ] v2.1 不创建真实 Electron IPC handler、preload 执行代码或执行入口。
- [ ] IPC channel allowlist 只包含 `imageLabReview.loadSession`、`imageLabReview.previewDraft`、`imageLabReview.submitDraft` 和 `imageLabReview.cancel`。
- [ ] Electron 边界明确 `contextIsolation=true`、`nodeIntegration=false`、preload 最小 allowlist、IPC sender 校验、来源窗口校验和 payload schema 校验。
- [ ] renderer 不直接调用 DailyNote、VCP 插件、API、Node 文件系统或磁盘写入。
- [ ] 不通过 URL query、hash、window title、localStorage、sessionStorage、clipboard、renderer console log、raw IPC、crash report 或 runtime log 原文传递敏感信息。
- [ ] 输入只允许受控 `review_session_draft`。
- [ ] 输出只允许 `review_session_draft`、`image_case_draft`、`memory_delta_draft` 和 `prototype_guard`。
- [ ] v2.1 样例保持 `real_vcpchat_source_read=false`、`real_vcpchat_modified=false`、`ipc_handler_created=false`、`preload_runtime_code_created=false`。
- [ ] v2.1 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`disk_write_performed=false`、`image_file_created=false`。
- [ ] v2.1 样例保持 `selected_plugin=null`、`max_plugin_calls=0`、`real_execution_allowed=false`、`real_manifest_read=false`。
- [ ] v2.1 样例不包含 key、token、cookie、密码、私密路径、客户隐私、endpoint 原文、raw manifest、raw 插件输出或图片二进制。
- [ ] v2.1 样例中的审计摘要、记忆正文和授权说明为中文脱敏内容。
- [ ] 进入真实 VCPChat 源码读取、真实 VCPChat 修改或真实 IPC handler 创建前必须另行授权。

## v2.1 VCPChat Source Read Authorization Gate 检查

- [ ] `docs/81_v2_1_vcpchat_source_read_authorization.md` 存在。
- [ ] `review_console/embed_contract/vcpchat_source_read_authorization_gate.md` 存在。
- [ ] `tests/schema_examples/v2_1_vcpchat_source_read_authorization.example.yaml` 存在。
- [ ] v2.1 source read authorization 只定义真实 VCPChat 源码读取前授权门槛，不读取真实源码。
- [ ] v2.1 source read authorization 不修改真实 VCPChat 或 VCPToolBox。
- [ ] v2.1 source read authorization 不创建真实 IPC handler、preload 执行代码或执行入口。
- [ ] 授权样例保持 `authorization_required=true`、`user_authorized=false`、`authorization_status=pending`。
- [ ] 授权样例保持 `source_read_performed=false`、`real_vcpchat_source_read=false`、`real_vcpchat_modified=false`。
- [ ] 授权样例保持 `real_vcptoolbox_source_read=false`、`real_vcptoolbox_modified=false`。
- [ ] 授权样例保持 `allowed_source_files=[]`、`allowed_extract_fields=[]`、`raw_source_copy_allowed=false`。
- [ ] 授权样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`real_execution_allowed=false`。
- [ ] 授权样例不包含真实 VCPChat 本地路径、真实源码片段、endpoint 原文、环境变量值、secret、token、cookie、密码或客户隐私。
- [ ] 授权样例只允许未来中文脱敏摘要字段，不允许 raw source、raw runtime log、raw IPC payload、raw manifest 或 raw plugin output。
- [ ] `allowed_source_files=[]` 时，任何真实 VCPChat 源码读取都必须保持 forbidden。
- [ ] `user_authorized=true` 也不得自动授权真实 VCPChat 修改、真实 IPC handler 创建、插件执行、API 调用或 DailyNote 写入。
- [ ] 审计摘要、拒绝原因、memory_delta 草案正文必须为中文脱敏内容。

## v2.1 VCPChat Source Scope Review 检查

- [ ] `docs/82_v2_1_vcpchat_source_scope_review.md` 存在。
- [ ] `review_console/embed_contract/vcpchat_source_scope_review_contract.md` 存在。
- [ ] `tests/schema_examples/v2_1_vcpchat_source_scope_review.example.yaml` 存在。
- [ ] v2.1 source scope review 只规划未来候选源码类别，不读取真实 VCPChat 源码。
- [ ] v2.1 source scope review 不列真实 VCPChat 本地路径，不复制 raw source。
- [ ] v2.1 source scope review 不修改真实 VCPChat 或 VCPToolBox。
- [ ] v2.1 source scope review 不创建真实 IPC handler、preload 执行代码或执行入口。
- [ ] 候选类别只能使用 `review_console_child_window_candidate`、`ipc_handler_candidate`、`preload_boundary_candidate`、`window_lifecycle_candidate`、`schema_bridge_candidate` 等占位类别。
- [ ] 样例保持 `user_authorized=false`、`source_read_performed=false`、`real_vcpchat_source_read=false`、`real_vcpchat_modified=false`。
- [ ] 样例保持 `exact_real_paths_listed=false`、`exact_real_paths=[]`、`raw_source_copy_allowed=false`、`selected_source_categories=[]`。
- [ ] 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`real_execution_allowed=false`。
- [ ] 样例不包含真实本地路径、真实源码片段、endpoint 原文、环境变量值、secret、token、cookie、密码、客户隐私、raw runtime log、raw IPC payload 或图片二进制。
- [ ] 允许输出字段只能是中文脱敏摘要字段，不允许 raw source、真实路径或敏感原文。
- [ ] scope review 不得被解释为真实 VCPChat 读取、修改、IPC handler 创建、插件调用、API 调用或 DailyNote 写入授权。

## v2.1 Real VCPChat Read Preflight 检查

- [ ] `docs/83_v2_1_real_vcpchat_read_preflight.md` 存在。
- [ ] `review_console/embed_contract/real_vcpchat_read_preflight_contract.md` 存在。
- [ ] `tests/schema_examples/v2_1_real_vcpchat_read_preflight.example.yaml` 存在。
- [ ] real VCPChat read preflight 只定义最终读取前授权包，不读取真实 VCPChat 源码。
- [ ] real VCPChat read preflight 不列真实 VCPChat 本地路径，不复制 raw source。
- [ ] real VCPChat read preflight 不修改真实 VCPChat 或 VCPToolBox。
- [ ] real VCPChat read preflight 不创建真实 IPC handler、preload 执行代码或执行入口。
- [ ] 样例保持 `user_authorized=false`、`source_read_performed=false`、`real_vcpchat_source_read=false`、`real_vcpchat_modified=false`。
- [ ] 样例保持 `exact_real_paths=[]`、`exact_real_paths_listed=false`、`selected_source_categories=[]`、`raw_source_copy_allowed=false`。
- [ ] 样例保持 `allowed_sanitized_output_fields=[]`、`api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`real_execution_allowed=false`。
- [ ] 样例不包含真实本地路径、真实源码片段、endpoint 原文、环境变量值、secret、token、cookie、密码、客户隐私、raw runtime log、raw IPC payload、raw plugin output 或图片二进制。
- [ ] 未来读取命令政策必须保持只读、只读取授权 allowlist、不得递归扫描未授权目录。
- [ ] stop conditions 必须覆盖 secret-like 内容、endpoint 原文、私密路径、客户隐私、raw runtime log、raw IPC payload、credential/config 原文和未授权文件类别。
- [ ] 读取完成也不得自动授权真实 VCPChat 修改、IPC handler 创建、preload 代码创建、插件调用、API 调用、DailyNote 写入或 VCP 长期记忆写入。

## v2.1 Real VCPChat Read Authorization Request 检查

- [ ] `docs/84_v2_1_real_vcpchat_read_authorization_request.md` 存在。
- [ ] `review_console/embed_contract/real_vcpchat_read_authorization_request.md` 存在。
- [ ] `tests/schema_examples/v2_1_real_vcpchat_read_authorization_request.example.yaml` 存在。
- [ ] authorization request 只定义未来真实读取授权请求模板，不读取真实 VCPChat 源码。
- [ ] authorization request 不填写真实 VCPChat 根目录，不列真实本地路径，不复制 raw source。
- [ ] authorization request 不修改真实 VCPChat 或 VCPToolBox。
- [ ] authorization request 不创建真实 IPC handler、preload 执行代码或执行入口。
- [ ] 样例保持 `user_authorized=false`、`target_repository_root=null`、`exact_real_paths=[]`、`selected_source_categories=[]`。
- [ ] 样例保持 `allowed_sanitized_output_fields=[]`、`source_read_performed=false`、`real_vcpchat_source_read=false`、`raw_source_copy_allowed=false`。
- [ ] 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`real_execution_allowed=false`。
- [ ] 样例不包含真实本地路径、真实源码片段、endpoint 原文、环境变量值、secret、token、cookie、密码、客户隐私、raw runtime log、raw IPC payload、raw plugin output 或图片二进制。
- [ ] future user-provided fields 必须保持 `required_later`，不得由本阶段代填。
- [ ] 用户未提供真实根目录、精确 allowlist、类别选择、允许输出字段、reviewer 和读取命令权限前，不得读取真实 VCPChat。
- [ ] 授权请求获批也只允许进入只读源码 intake，不得自动授权 VCPChat 修改、IPC handler、preload、插件、API、DailyNote 或记忆写入。

## v2.2 Real VCPChat Read Authorization Fill 检查

- [ ] `docs/85_v2_2_real_vcpchat_read_authorization_fill.md` 存在。
- [ ] `review_console/embed_contract/real_vcpchat_read_authorization_fill.md` 存在。
- [ ] `tests/schema_examples/v2_2_real_vcpchat_read_authorization_fill.example.yaml` 存在。
- [ ] authorization fill 只定义未来用户填写真实 VCPChat 读取授权包的字段，不读取真实 VCPChat 源码。
- [ ] authorization fill 不读取真实 VCPToolBox。
- [ ] authorization fill 不在仓库中写入真实 VCPChat 根目录、真实本地路径或 raw source。
- [ ] authorization fill 不修改真实 VCPChat 或 VCPToolBox。
- [ ] authorization fill 不创建真实 IPC handler、preload、renderer、Adapter 执行入口或其他执行代码。
- [ ] authorization fill 不调用插件、API、DailyNote、VCP 记忆或文件系统写入。
- [ ] 样例保持 `user_authorized=false`、`source_read_authorized=false`、`authorization_status=pending`。
- [ ] 样例保持 `target_repository_root_provided=false`、`target_repository_root_redacted=null`。
- [ ] 样例保持 `exact_allowed_paths=[]`、`exact_allowed_paths_redacted=[]`、`exact_allowed_paths_listed=false`。
- [ ] 样例保持 `allowed_source_categories=[]`、`allowed_sanitized_output_fields=[]`、`read_command_permission=false`。
- [ ] 样例保持 `source_read_performed=false`、`real_vcpchat_source_read=false`、`real_vcpchat_modified=false`。
- [ ] 样例保持 `real_vcptoolbox_source_read=false`、`real_vcptoolbox_modified=false`。
- [ ] 样例保持 `raw_source_copy_allowed=false`、`raw_source_copied=false`。
- [ ] 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`vcp_memory_written=false`、`real_execution_allowed=false`。
- [ ] 样例保持 `ipc_handler_created=false`、`preload_runtime_code_created=false`、`renderer_runtime_code_created=false`、`execution_entry_created=false`。
- [ ] 样例不包含真实本地路径、真实源码片段、endpoint 原文、环境变量值、secret、token、cookie、密码、客户隐私、raw runtime log、raw IPC payload、raw plugin output 或图片二进制。
- [ ] `forbidden_source_categories` 覆盖配置文件、credential 或 secret 文件、runtime logs、用户数据或聊天历史、二进制资产和无关模块。
- [ ] `stop_conditions` 覆盖真实路径写入仓库、secret-like 内容、endpoint 原文、私密路径、客户隐私、raw source 超范围、raw runtime log、raw IPC payload、credential/config 原文和未授权文件类别。
- [ ] 授权填写包获批也只允许进入“读取前最终复核”，不得自动触发真实 VCPChat 源码读取。
- [ ] 真实 VCPChat 读取仍必须等待下一独立授权点，且授权时必须明确精确 allowlist、读取命令权限和审查人。

## v2.2 Filled Authorization Review Gate 检查

- [ ] `docs/86_v2_2_filled_authorization_review_gate.md` 存在。
- [ ] `review_console/embed_contract/filled_authorization_review_gate.md` 存在。
- [ ] `tests/schema_examples/v2_2_filled_authorization_review_gate.example.yaml` 存在。
- [ ] filled authorization review gate 只定义已填写授权包的人工复核门槛，不读取真实 VCPChat 源码。
- [ ] filled authorization review gate 不读取真实 VCPToolBox。
- [ ] filled authorization review gate 不保存真实 VCPChat 根目录、真实 allowlist 路径或 raw source。
- [ ] filled authorization review gate 不修改真实 VCPChat 或 VCPToolBox。
- [ ] filled authorization review gate 不创建真实 IPC handler、preload、renderer、Adapter 执行入口或其他执行代码。
- [ ] filled authorization review gate 不调用插件、API、DailyNote、VCP 记忆或文件系统写入。
- [ ] 样例保持 `filled_request_received=false`、`filled_request_reviewed=false`、`filled_request_approved=false`。
- [ ] 样例保持 `source_read_authorized=false`、`authorization_status=pending_review`。
- [ ] 样例保持 `root_path_presence_confirmed=false`、`root_path_redaction_confirmed=false`。
- [ ] 样例保持 `exact_allowlist_presence_confirmed=false`、`exact_allowlist_redaction_confirmed=false`。
- [ ] 样例保持 `exact_real_paths_stored_in_git=false`、`target_repository_root_stored_in_git=false`。
- [ ] 样例保持 `source_read_performed=false`、`real_vcpchat_source_read=false`、`real_vcpchat_modified=false`。
- [ ] 样例保持 `real_vcptoolbox_source_read=false`、`real_vcptoolbox_modified=false`。
- [ ] 样例保持 `raw_source_copy_allowed=false`、`raw_source_copied=false`。
- [ ] 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`vcp_memory_written=false`、`real_execution_allowed=false`。
- [ ] 样例保持 `ipc_handler_created=false`、`preload_runtime_code_created=false`、`renderer_runtime_code_created=false`、`execution_entry_created=false`。
- [ ] 样例不包含真实本地路径、真实源码片段、完整函数体、endpoint 原文、环境变量值、secret、token、cookie、密码、客户隐私、raw runtime log、raw IPC payload、raw plugin output 或图片二进制。
- [ ] 人工复核必须确认路径已脱敏、allowlist 已脱敏、审查人已确认、停止条件已确认、读取后边界已确认。
- [ ] 人工复核通过也只允许进入真实读取最终授权 preflight，不得自动触发真实 VCPChat 源码读取。
- [ ] 真实读取最终授权仍必须单独请求，且不得自动授权 VCPChat 修改、IPC handler、preload、插件、API、DailyNote 或记忆写入。

## v2.2 Real VCPChat Read Final Authorization Preflight 检查

- [ ] `docs/87_v2_2_real_vcpchat_read_final_authorization_preflight.md` 存在。
- [ ] `review_console/embed_contract/real_vcpchat_read_final_authorization_preflight.md` 存在。
- [ ] `tests/schema_examples/v2_2_real_vcpchat_read_final_authorization_preflight.example.yaml` 存在。
- [ ] final authorization preflight 只定义真实读取前最后授权检查，不读取真实 VCPChat 源码。
- [ ] final authorization preflight 不读取真实 VCPToolBox。
- [ ] final authorization preflight 不保存真实 VCPChat 根目录、真实 allowlist 路径或 raw source。
- [ ] final authorization preflight 不修改真实 VCPChat 或 VCPToolBox。
- [ ] final authorization preflight 不创建真实 IPC handler、preload、renderer、Adapter 执行入口或其他执行代码。
- [ ] final authorization preflight 不调用插件、API、DailyNote、VCP 记忆或文件系统写入。
- [ ] 样例保持 `final_authorization_requested=false`、`final_authorization_granted=false`、`authorization_status=pending_final_authorization`。
- [ ] 样例保持 `source_read_authorized=false`、`authorized_by=null`、`authorized_at=null`。
- [ ] 样例保持 `filled_request_reviewed=false`、`filled_request_approved=false`。
- [ ] 样例保持 `root_path_redaction_confirmed=false`、`exact_allowlist_redaction_confirmed=false`。
- [ ] 样例保持 `read_command_permission_confirmed=false`、`reviewer_confirmed=false`、`stop_conditions_confirmed=false`、`post_read_boundaries_confirmed=false`。
- [ ] 样例保持 `read_command_ready=false`、`read_only_required=true`、`allowlist_only_required=true`。
- [ ] 样例保持 `recursive_scan_allowed=false`、`config_read_allowed=false`、`log_read_allowed=false`、`credential_read_allowed=false`、`customer_data_read_allowed=false`。
- [ ] 样例保持 `raw_source_output_allowed=false`、`file_write_allowed=false`、`vcpchat_launch_allowed=false`。
- [ ] 样例保持 `exact_real_paths_stored_in_git=false`、`target_repository_root_stored_in_git=false`。
- [ ] 样例保持 `source_read_performed=false`、`real_vcpchat_source_read=false`、`real_vcpchat_modified=false`。
- [ ] 样例保持 `real_vcptoolbox_source_read=false`、`real_vcptoolbox_modified=false`。
- [ ] 样例保持 `raw_source_copy_allowed=false`、`raw_source_copied=false`。
- [ ] 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`vcp_memory_written=false`、`real_execution_allowed=false`。
- [ ] 样例保持 `ipc_handler_created=false`、`preload_runtime_code_created=false`、`renderer_runtime_code_created=false`、`execution_entry_created=false`。
- [ ] 样例不包含真实本地路径、真实源码片段、完整函数体、endpoint 原文、环境变量值、secret、token、cookie、密码、客户隐私、raw runtime log、raw IPC payload、raw plugin output 或图片二进制。
- [ ] 最终授权 preflight 通过也只允许进入一次性真实读取授权请求，不得自动触发真实 VCPChat 源码读取。
- [ ] 一次性真实读取仍必须单独请求，且不得自动授权 VCPChat 修改、IPC handler、preload、插件、API、DailyNote 或记忆写入。

## v2.2 One-time Real VCPChat Read Authorization Request 检查

- [ ] `docs/88_v2_2_one_time_real_vcpchat_read_authorization_request.md` 存在。
- [ ] `review_console/embed_contract/one_time_real_vcpchat_read_authorization_request.md` 存在。
- [ ] `tests/schema_examples/v2_2_one_time_real_vcpchat_read_authorization_request.example.yaml` 存在。
- [ ] one-time read authorization request 只定义一次性真实 VCPChat 只读读取授权请求模板，不读取真实 VCPChat 源码。
- [ ] one-time read authorization request 不读取真实 VCPToolBox。
- [ ] one-time read authorization request 不保存真实 VCPChat 根目录、真实 allowlist 路径或 raw source。
- [ ] one-time read authorization request 不修改真实 VCPChat 或 VCPToolBox。
- [ ] one-time read authorization request 不创建真实 IPC handler、preload、renderer、Adapter 执行入口或其他执行代码。
- [ ] one-time read authorization request 不调用插件、API、DailyNote、VCP 记忆或文件系统写入。
- [ ] 样例保持 `one_time_read_requested=false`、`one_time_read_authorized=false`、`authorization_status=pending_one_time_read_authorization`。
- [ ] 样例保持 `source_read_authorized=false`、`authorized_by=null`、`authorized_at=null`。
- [ ] 样例保持 `final_authorization_requested=false`、`final_authorization_granted=false`。
- [ ] 样例保持 `root_path_redaction_confirmed=false`、`exact_allowlist_redaction_confirmed=false`。
- [ ] 样例保持 `read_command_permission_confirmed=false`、`reviewer_confirmed=false`、`stop_conditions_confirmed=false`、`post_read_boundaries_confirmed=false`。
- [ ] 样例保持 `read_command_approved=false`、`read_command_id=null`、`read_attempt_limit=1`。
- [ ] 样例保持 `read_only_required=true`、`allowlist_only_required=true`。
- [ ] 样例保持 `recursive_scan_allowed=false`、`config_read_allowed=false`、`log_read_allowed=false`、`credential_read_allowed=false`、`customer_data_read_allowed=false`。
- [ ] 样例保持 `raw_source_output_allowed=false`、`real_path_output_allowed=false`、`file_write_allowed=false`、`vcpchat_launch_allowed=false`。
- [ ] 样例保持 `exact_real_paths_stored_in_git=false`、`source_read_performed=false`、`real_vcpchat_source_read=false`。
- [ ] 样例保持 `real_vcpchat_modified=false`、`real_vcptoolbox_source_read=false`、`real_vcptoolbox_modified=false`。
- [ ] 样例保持 `raw_source_copy_allowed=false`、`raw_source_copied=false`。
- [ ] 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`vcp_memory_written=false`、`real_execution_allowed=false`。
- [ ] 样例保持 `ipc_handler_created=false`、`preload_runtime_code_created=false`、`renderer_runtime_code_created=false`、`execution_entry_created=false`。
- [ ] 样例不包含真实本地路径、真实源码片段、完整函数体、endpoint 原文、环境变量值、secret、token、cookie、密码、客户隐私、raw runtime log、raw IPC payload、raw plugin output 或图片二进制。
- [ ] 一次性读取授权请求获批也只允许进入读取执行 preflight，不得自动触发真实 VCPChat 源码读取。
- [ ] 一次性真实读取执行仍必须单独请求，且不得自动授权 VCPChat 修改、IPC handler、preload、插件、API、DailyNote 或记忆写入。

## v2.2 One-time Real VCPChat Read Execution Preflight 检查

- [ ] `docs/89_v2_2_one_time_real_vcpchat_read_execution_preflight.md` 存在。
- [ ] `review_console/embed_contract/one_time_real_vcpchat_read_execution_preflight.md` 存在。
- [ ] `tests/schema_examples/v2_2_one_time_real_vcpchat_read_execution_preflight.example.yaml` 存在。
- [ ] one-time read execution preflight 只定义一次性真实 VCPChat 读取执行前预检，不读取真实 VCPChat 源码。
- [ ] one-time read execution preflight 不读取真实 VCPToolBox。
- [ ] one-time read execution preflight 不保存真实 VCPChat 根目录、真实 allowlist 路径或 raw source。
- [ ] one-time read execution preflight 不修改真实 VCPChat 或 VCPToolBox。
- [ ] one-time read execution preflight 不创建真实 IPC handler、preload、renderer、Adapter 执行入口或其他执行代码。
- [ ] one-time read execution preflight 不调用插件、API、DailyNote、VCP 记忆或文件系统写入。
- [ ] 样例保持 `one_time_read_authorized=false`、`execution_preflight_requested=false`、`execution_preflight_passed=false`。
- [ ] 样例保持 `source_read_authorized=false`、`authorization_status=pending_execution_preflight`。
- [ ] 样例保持 `read_command_bound=false`、`read_command_id=null`、`read_attempt_limit=1`、`read_attempt_used=0`。
- [ ] 样例保持 `read_command_approved=false`、`authorized_by=null`、`authorized_at=null`。
- [ ] 样例保持 `root_path_redaction_confirmed=false`、`exact_allowlist_redaction_confirmed=false`。
- [ ] 样例保持 `stop_conditions_confirmed=false`、`post_read_boundaries_confirmed=false`。
- [ ] 样例保持 `read_only_required=true`、`allowlist_only_required=true`。
- [ ] 样例保持 `recursive_scan_allowed=false`、`config_read_allowed=false`、`log_read_allowed=false`、`credential_read_allowed=false`、`customer_data_read_allowed=false`。
- [ ] 样例保持 `raw_source_output_allowed=false`、`real_path_output_allowed=false`、`file_write_allowed=false`、`vcpchat_launch_allowed=false`、`vcpchat_modification_allowed=false`。
- [ ] 样例保持 `plugin_call_allowed=false`、`api_call_allowed=false`、`daily_note_call_allowed=false`、`vcp_memory_write_allowed=false`。
- [ ] 样例保持 `exact_real_paths_stored_in_git=false`、`source_read_performed=false`、`real_vcpchat_source_read=false`。
- [ ] 样例保持 `real_vcpchat_modified=false`、`real_vcptoolbox_source_read=false`、`real_vcptoolbox_modified=false`。
- [ ] 样例保持 `raw_source_copy_allowed=false`、`raw_source_copied=false`。
- [ ] 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`vcp_memory_written=false`、`real_execution_allowed=false`。
- [ ] 样例保持 `ipc_handler_created=false`、`preload_runtime_code_created=false`、`renderer_runtime_code_created=false`、`execution_entry_created=false`。
- [ ] 样例不包含真实本地路径、真实源码片段、完整函数体、endpoint 原文、环境变量值、secret、token、cookie、密码、客户隐私、raw runtime log、raw IPC payload、raw plugin output 或图片二进制。
- [ ] 执行 preflight 通过也只允许进入一次性真实读取执行授权点，不得自动触发真实 VCPChat 源码读取。
- [ ] 一次性真实读取执行仍必须独立授权，且不得自动授权 VCPChat 修改、IPC handler、preload、插件、API、DailyNote 或记忆写入。

## v2.3 Real VCPChat Execute-once Authorization Preplan 检查

- [ ] `docs/90_v2_3_real_vcpchat_execute_once_authorization_preplan.md` 存在。
- [ ] `review_console/embed_contract/real_vcpchat_execute_once_authorization_preplan.md` 存在。
- [ ] `tests/schema_examples/v2_3_real_vcpchat_execute_once_authorization_preplan.example.yaml` 存在。
- [ ] execute-once authorization preplan 只规划真实 VCPChat 一次性读取执行授权链，不读取真实 VCPChat 源码。
- [ ] execute-once authorization preplan 不读取真实 VCPToolBox。
- [ ] execute-once authorization preplan 不保存真实 VCPChat 根目录、真实 allowlist 路径、真实读取命令或 raw source。
- [ ] execute-once authorization preplan 不修改真实 VCPChat 或 VCPToolBox。
- [ ] execute-once authorization preplan 不创建真实 IPC handler、preload、renderer、Adapter 执行入口或其他执行代码。
- [ ] execute-once authorization preplan 不调用插件、API、DailyNote、VCP 记忆或文件系统写入。
- [ ] 样例保持 `execute_once_authorization_requested=false`、`execute_once_authorization_granted=false`。
- [ ] 样例保持 `one_time_read_authorized=false`、`execution_preflight_requested=false`、`execution_preflight_passed=false`。
- [ ] 样例保持 `source_read_authorized=false`、`authorization_status=pending_execute_once_authorization_preplan`。
- [ ] 样例保持 `read_command_bound=false`、`read_command_executed=false`、`read_attempt_limit=1`、`read_attempt_used=0`。
- [ ] 样例保持 `root_path_redaction_confirmed=false`、`exact_allowlist_redaction_confirmed=false`、`redacted_read_command_reference_confirmed=false`。
- [ ] 样例保持 `stop_conditions_confirmed=false`、`post_read_boundaries_confirmed=false`。
- [ ] 样例保持 `read_scope_held_outside_git=true`、`read_command_held_outside_git=true`。
- [ ] 样例保持 `recursive_scan_allowed=false`、`config_read_allowed=false`、`log_read_allowed=false`、`credential_read_allowed=false`、`customer_data_read_allowed=false`。
- [ ] 样例保持 `raw_source_output_allowed=false`、`real_path_output_allowed=false`、`file_write_allowed=false`、`vcpchat_launch_allowed=false`、`vcpchat_modification_allowed=false`。
- [ ] 样例保持 `plugin_call_allowed=false`、`api_call_allowed=false`、`daily_note_call_allowed=false`、`vcp_memory_write_allowed=false`。
- [ ] 样例保持 `direct_implementation_allowed=false`、`daily_note_write_allowed=false`、`vcp_memory_write_allowed=false`、`asset_write_allowed=false`。
- [ ] 样例保持 `exact_real_paths_stored_in_git=false`、`source_read_performed=false`、`real_vcpchat_source_read=false`。
- [ ] 样例保持 `real_vcpchat_modified=false`、`real_vcptoolbox_source_read=false`、`real_vcptoolbox_modified=false`。
- [ ] 样例保持 `raw_source_copy_allowed=false`、`raw_source_copied=false`。
- [ ] 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`vcp_memory_written=false`、`real_execution_allowed=false`。
- [ ] 样例保持 `ipc_handler_created=false`、`preload_runtime_code_created=false`、`renderer_runtime_code_created=false`、`execution_entry_created=false`。
- [ ] 样例不包含真实本地路径、真实读取命令、真实源码片段、完整函数体、endpoint 原文、环境变量值、secret、token、cookie、密码、客户隐私、raw runtime log、raw IPC payload、raw plugin output 或图片二进制。
- [ ] 授权前规划完成也只允许进入下一独立执行授权请求模板，不得自动触发真实 VCPChat 源码读取。

## v2.3 Execute-once Authorization Request Template 检查

- [ ] `docs/91_v2_3_execute_once_authorization_request_template.md` 存在。
- [ ] `review_console/embed_contract/execute_once_authorization_request_template.md` 存在。
- [ ] `tests/schema_examples/v2_3_execute_once_authorization_request_template.example.yaml` 存在。
- [ ] execute-once authorization request template 只定义真实 VCPChat 一次性读取执行授权请求模板，不读取真实 VCPChat 源码。
- [ ] execute-once authorization request template 不读取真实 VCPToolBox。
- [ ] execute-once authorization request template 不保存真实 VCPChat 根目录、真实 allowlist 路径、真实读取命令或 raw source。
- [ ] execute-once authorization request template 不修改真实 VCPChat 或 VCPToolBox。
- [ ] execute-once authorization request template 不创建真实 IPC handler、preload、renderer、Adapter 执行入口或其他执行代码。
- [ ] execute-once authorization request template 不调用插件、API、DailyNote、VCP 记忆或文件系统写入。
- [ ] 样例保持 `execute_once_authorization_requested=false`、`execute_once_authorization_granted=false`。
- [ ] 样例保持 `authorized_by=null`、`authorized_at=null`。
- [ ] 样例保持 `one_time_read_authorized=false`、`execution_preflight_passed=false`。
- [ ] 样例保持 `source_read_authorized=false`、`authorization_status=pending_execute_once_authorization_request`。
- [ ] 样例保持 `read_command_bound=false`、`read_command_executed=false`、`read_attempt_limit=1`、`read_attempt_used=0`。
- [ ] 样例保持 `read_scope_ref_confirmed=false`、`read_command_ref_confirmed=false`、`stop_conditions_confirmed=false`、`post_read_boundaries_confirmed=false`。
- [ ] 样例保持 `read_scope_held_outside_git=true`、`read_command_held_outside_git=true`。
- [ ] 样例保持 `recursive_scan_allowed=false`、`config_read_allowed=false`、`log_read_allowed=false`、`credential_read_allowed=false`、`customer_data_read_allowed=false`。
- [ ] 样例保持 `raw_source_output_allowed=false`、`real_path_output_allowed=false`、`file_write_allowed=false`、`vcpchat_launch_allowed=false`、`vcpchat_modification_allowed=false`。
- [ ] 样例保持 `plugin_call_allowed=false`、`api_call_allowed=false`、`daily_note_call_allowed=false`、`vcp_memory_write_allowed=false`。
- [ ] 样例保持 `direct_implementation_allowed=false`、`daily_note_write_allowed=false`、`vcp_memory_write_allowed=false`、`asset_write_allowed=false`。
- [ ] 样例保持 `exact_real_paths_stored_in_git=false`、`source_read_performed=false`、`real_vcpchat_source_read=false`。
- [ ] 样例保持 `real_vcpchat_modified=false`、`real_vcptoolbox_source_read=false`、`real_vcptoolbox_modified=false`。
- [ ] 样例保持 `raw_source_copy_allowed=false`、`raw_source_copied=false`。
- [ ] 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`vcp_memory_written=false`、`real_execution_allowed=false`。
- [ ] 样例保持 `ipc_handler_created=false`、`preload_runtime_code_created=false`、`renderer_runtime_code_created=false`、`execution_entry_created=false`。
- [ ] 样例不包含真实本地路径、真实读取命令、真实源码片段、完整函数体、endpoint 原文、环境变量值、secret、token、cookie、密码、客户隐私、raw runtime log、raw IPC payload、raw plugin output 或图片二进制。
- [ ] 授权请求模板获批也只允许进入下一独立命令绑定 preflight，不得自动触发真实 VCPChat 源码读取。

## v2.3 Execute-once Command Binding Preflight 检查

- [ ] `docs/92_v2_3_execute_once_command_binding_preflight.md` 存在。
- [ ] `review_console/embed_contract/execute_once_command_binding_preflight.md` 存在。
- [ ] `tests/schema_examples/v2_3_execute_once_command_binding_preflight.example.yaml` 存在。
- [ ] execute-once command binding preflight 只定义真实 VCPChat 一次性读取命令绑定预检，不读取真实 VCPChat 源码。
- [ ] execute-once command binding preflight 不读取真实 VCPToolBox。
- [ ] execute-once command binding preflight 不保存真实 VCPChat 根目录、真实 allowlist 路径、真实读取命令或 raw source。
- [ ] execute-once command binding preflight 不修改真实 VCPChat 或 VCPToolBox。
- [ ] execute-once command binding preflight 不创建真实 IPC handler、preload、renderer、Adapter 执行入口或其他执行代码。
- [ ] execute-once command binding preflight 不调用插件、API、DailyNote、VCP 记忆或文件系统写入。
- [ ] 样例保持 `command_binding_preflight_requested=false`、`command_binding_preflight_passed=false`。
- [ ] 样例保持 `execute_once_authorization_requested=false`、`execute_once_authorization_granted=false`。
- [ ] 样例保持 `authorized_by=null`、`authorized_at=null`。
- [ ] 样例保持 `source_read_authorized=false`、`authorization_status=pending_command_binding_preflight`。
- [ ] 样例保持 `read_command_bound=false`、`read_command_id=null`、`read_command_executed=false`。
- [ ] 样例保持 `read_attempt_limit=1`、`read_attempt_used=0`。
- [ ] 样例保持 `read_scope_ref_confirmed=false`、`read_command_ref_confirmed=false`、`stop_conditions_confirmed=false`、`post_read_boundaries_confirmed=false`。
- [ ] 样例保持 `read_scope_held_outside_git=true`、`read_command_held_outside_git=true`、`read_command_text_stored_in_git=false`。
- [ ] 样例保持 `recursive_scan_allowed=false`、`config_read_allowed=false`、`log_read_allowed=false`、`credential_read_allowed=false`、`customer_data_read_allowed=false`。
- [ ] 样例保持 `raw_source_output_allowed=false`、`real_path_output_allowed=false`、`file_write_allowed=false`、`vcpchat_launch_allowed=false`、`vcpchat_modification_allowed=false`。
- [ ] 样例保持 `plugin_call_allowed=false`、`api_call_allowed=false`、`daily_note_call_allowed=false`、`vcp_memory_write_allowed=false`。
- [ ] 样例保持 `direct_implementation_allowed=false`、`daily_note_write_allowed=false`、`vcp_memory_write_allowed=false`、`asset_write_allowed=false`。
- [ ] 样例保持 `exact_real_paths_stored_in_git=false`、`source_read_performed=false`、`real_vcpchat_source_read=false`。
- [ ] 样例保持 `real_vcpchat_modified=false`、`real_vcptoolbox_source_read=false`、`real_vcptoolbox_modified=false`。
- [ ] 样例保持 `raw_source_copy_allowed=false`、`raw_source_copied=false`。
- [ ] 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`vcp_memory_written=false`、`real_execution_allowed=false`。
- [ ] 样例保持 `ipc_handler_created=false`、`preload_runtime_code_created=false`、`renderer_runtime_code_created=false`、`execution_entry_created=false`。
- [ ] 样例不包含真实本地路径、真实读取命令、shell 命令文本、真实源码片段、完整函数体、endpoint 原文、环境变量值、secret、token、cookie、密码、客户隐私、raw runtime log、raw IPC payload、raw plugin output 或图片二进制。
- [ ] 命令绑定 preflight 通过也只允许进入下一独立最终读取授权门，不得自动触发真实 VCPChat 源码读取。

## v2.3 Execute-once Final Read Authorization Gate 检查

- [ ] `docs/93_v2_3_execute_once_final_read_authorization_gate.md` 存在。
- [ ] `review_console/embed_contract/execute_once_final_read_authorization_gate.md` 存在。
- [ ] `tests/schema_examples/v2_3_execute_once_final_read_authorization_gate.example.yaml` 存在。
- [ ] execute-once final read authorization gate 只定义真实 VCPChat 一次性读取最终授权门，不读取真实 VCPChat 源码。
- [ ] execute-once final read authorization gate 不读取真实 VCPToolBox。
- [ ] execute-once final read authorization gate 不保存真实 VCPChat 根目录、真实 allowlist 路径、真实读取命令或 raw source。
- [ ] execute-once final read authorization gate 不修改真实 VCPChat 或 VCPToolBox。
- [ ] execute-once final read authorization gate 不创建真实 IPC handler、preload、renderer、Adapter 执行入口或其他执行代码。
- [ ] execute-once final read authorization gate 不调用插件、API、DailyNote、VCP 记忆或文件系统写入。
- [ ] 样例保持 `final_read_authorization_gate_requested=false`、`final_read_authorization_gate_passed=false`。
- [ ] 样例保持 `execute_once_authorization_requested=false`、`execute_once_authorization_granted=false`。
- [ ] 样例保持 `authorized_by=null`、`authorized_at=null`。
- [ ] 样例保持 `final_authorizer=null`、`final_authorized_at=null`。
- [ ] 样例保持 `source_read_authorized=false`、`authorization_status=pending_final_read_authorization_gate`。
- [ ] 样例保持 `command_binding_preflight_requested=false`、`command_binding_preflight_passed=false`。
- [ ] 样例保持 `read_command_bound=false`、`read_command_id=null`、`read_command_executed=false`。
- [ ] 样例保持 `read_attempt_limit=1`、`read_attempt_used=0`。
- [ ] 样例保持 `read_scope_ref_confirmed=false`、`read_command_ref_confirmed=false`、`stop_conditions_confirmed=false`、`post_read_boundaries_confirmed=false`。
- [ ] 样例保持 `read_scope_held_outside_git=true`、`read_command_held_outside_git=true`、`read_command_text_stored_in_git=false`。
- [ ] 样例保持 `recursive_scan_allowed=false`、`config_read_allowed=false`、`log_read_allowed=false`、`credential_read_allowed=false`、`customer_data_read_allowed=false`。
- [ ] 样例保持 `raw_source_output_allowed=false`、`real_path_output_allowed=false`、`file_write_allowed=false`、`vcpchat_launch_allowed=false`、`vcpchat_modification_allowed=false`。
- [ ] 样例保持 `plugin_call_allowed=false`、`api_call_allowed=false`、`daily_note_call_allowed=false`、`vcp_memory_write_allowed=false`。
- [ ] 样例保持 `direct_implementation_allowed=false`、`daily_note_write_allowed=false`、`vcp_memory_write_allowed=false`、`asset_write_allowed=false`。
- [ ] 样例保持 `exact_real_paths_stored_in_git=false`、`source_read_performed=false`、`real_vcpchat_source_read=false`。
- [ ] 样例保持 `real_vcpchat_modified=false`、`real_vcptoolbox_source_read=false`、`real_vcptoolbox_modified=false`。
- [ ] 样例保持 `raw_source_copy_allowed=false`、`raw_source_copied=false`。
- [ ] 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`vcp_memory_written=false`、`real_execution_allowed=false`。
- [ ] 样例保持 `ipc_handler_created=false`、`preload_runtime_code_created=false`、`renderer_runtime_code_created=false`、`execution_entry_created=false`。
- [ ] 样例不包含真实本地路径、真实读取命令、shell 命令文本、真实源码片段、完整函数体、endpoint 原文、环境变量值、secret、token、cookie、密码、客户隐私、raw runtime log、raw IPC payload、raw plugin output 或图片二进制。
- [ ] 最终读取授权门通过也只允许进入下一独立真实读取执行授权点，不得自动触发真实 VCPChat 源码读取。

## v2.4 Execute-once Manual Parameter Fill Checklist 检查

- [ ] `docs/94_v2_4_execute_once_manual_parameter_fill_checklist.md` 存在。
- [ ] `review_console/embed_contract/execute_once_manual_parameter_fill_checklist.md` 存在。
- [ ] `tests/schema_examples/v2_4_execute_once_manual_parameter_fill_checklist.example.yaml` 存在。
- [ ] execute-once manual parameter fill checklist 只定义真实 VCPChat 一次性读取执行前人工填参清单，不读取真实 VCPChat 源码。
- [ ] execute-once manual parameter fill checklist 不读取真实 VCPToolBox。
- [ ] execute-once manual parameter fill checklist 不保存真实 VCPChat 根目录、真实 allowlist 路径、真实读取命令或 raw source。
- [ ] execute-once manual parameter fill checklist 不修改真实 VCPChat 或 VCPToolBox。
- [ ] execute-once manual parameter fill checklist 不创建真实 IPC handler、preload、renderer、Adapter 执行入口或其他执行代码。
- [ ] execute-once manual parameter fill checklist 不调用插件、API、DailyNote、VCP 记忆或文件系统写入。
- [ ] 样例保持 `manual_parameter_fill_required=true`、`manual_parameter_fill_completed=false`。
- [ ] 样例保持 `manual_parameter_review_passed=false`。
- [ ] 样例保持 `real_vcpchat_root_supplied_outside_git=false`。
- [ ] 样例保持 `allowed_read_paths_supplied_outside_git=false`。
- [ ] 样例保持 `read_command_supplied_outside_git=false`。
- [ ] 样例保持 `source_read_authorized=false`、`authorization_status=pending_manual_parameter_fill`。
- [ ] 样例保持 `final_read_authorization_gate_requested=false`、`final_read_authorization_gate_passed=false`。
- [ ] 样例保持 `execute_once_authorization_granted=false`、`command_binding_preflight_passed=false`。
- [ ] 样例保持 `read_command_bound=false`、`read_command_executed=false`。
- [ ] 样例保持 `read_attempt_limit=1`、`read_attempt_used=0`。
- [ ] 样例保持 `exact_real_paths_stored_in_git=false`、`raw_read_command_stored_in_git=false`。
- [ ] 样例保持 `git_storage_for_real_root_allowed=false`、`git_storage_for_real_allowlist_allowed=false`、`git_storage_for_raw_command_allowed=false`。
- [ ] 样例保持 `human_parameter_owner=null`、`parameter_filled_at=null`、`parameter_reviewed_by=null`、`parameter_reviewed_at=null`。
- [ ] 样例保持 `recursive_scan_allowed=false`、`config_read_allowed=false`、`log_read_allowed=false`、`credential_read_allowed=false`、`customer_data_read_allowed=false`。
- [ ] 样例保持 `raw_source_output_allowed=false`、`real_path_output_allowed=false`、`file_write_allowed=false`、`vcpchat_launch_allowed=false`、`vcpchat_modification_allowed=false`。
- [ ] 样例保持 `plugin_call_allowed=false`、`api_call_allowed=false`、`daily_note_call_allowed=false`、`vcp_memory_write_allowed=false`。
- [ ] 样例保持 `direct_implementation_allowed=false`、`daily_note_write_allowed=false`、`vcp_memory_write_allowed=false`、`asset_write_allowed=false`。
- [ ] 样例保持 `source_read_performed=false`、`real_vcpchat_source_read=false`。
- [ ] 样例保持 `real_vcpchat_modified=false`、`real_vcptoolbox_source_read=false`、`real_vcptoolbox_modified=false`。
- [ ] 样例保持 `raw_source_copy_allowed=false`、`raw_source_copied=false`。
- [ ] 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`vcp_memory_written=false`、`real_execution_allowed=false`。
- [ ] 样例保持 `ipc_handler_created=false`、`preload_runtime_code_created=false`、`renderer_runtime_code_created=false`、`execution_entry_created=false`。
- [ ] 样例不包含真实本地路径、真实读取命令、shell 命令文本、真实源码片段、完整函数体、endpoint 原文、环境变量值、secret、token、cookie、密码、客户隐私、raw runtime log、raw IPC payload、raw plugin output 或图片二进制。
- [ ] 人工填参清单完成也只允许进入下一独立参数复核门，不得自动触发真实 VCPChat 源码读取。

## v2.4 Execute-once Manual Parameter Review Gate 检查

- [ ] `docs/95_v2_4_execute_once_manual_parameter_review_gate.md` 存在。
- [ ] `review_console/embed_contract/execute_once_manual_parameter_review_gate.md` 存在。
- [ ] `tests/schema_examples/v2_4_execute_once_manual_parameter_review_gate.example.yaml` 存在。
- [ ] execute-once manual parameter review gate 只定义真实 VCPChat 一次性读取执行前人工参数复核门，不读取真实 VCPChat 源码。
- [ ] execute-once manual parameter review gate 不读取真实 VCPToolBox。
- [ ] execute-once manual parameter review gate 不保存真实 VCPChat 根目录、真实 allowlist 路径、真实读取命令或 raw source。
- [ ] execute-once manual parameter review gate 不修改真实 VCPChat 或 VCPToolBox。
- [ ] execute-once manual parameter review gate 不创建真实 IPC handler、preload、renderer、Adapter 执行入口或其他执行代码。
- [ ] execute-once manual parameter review gate 不调用插件、API、DailyNote、VCP 记忆或文件系统写入。
- [ ] 样例保持 `manual_parameter_fill_required=true`、`manual_parameter_fill_completed=false`。
- [ ] 样例保持 `manual_parameter_review_required=true`、`manual_parameter_review_requested=false`。
- [ ] 样例保持 `manual_parameter_review_passed=false`、`parameter_integrity_confirmed=false`。
- [ ] 样例保持 `real_vcpchat_root_supplied_outside_git=false`。
- [ ] 样例保持 `allowed_read_paths_supplied_outside_git=false`。
- [ ] 样例保持 `read_command_supplied_outside_git=false`。
- [ ] 样例保持 `source_read_authorized=false`、`authorization_status=pending_manual_parameter_review`。
- [ ] 样例保持 `parameter_reviewer=null`、`parameter_reviewed_at=null`。
- [ ] 样例保持 `root_ref_matches_authorization_context=false`、`allowlist_ref_matches_authorization_context=false`、`command_ref_matches_authorization_context=false`。
- [ ] 样例保持 `stop_conditions_confirmed=false`、`post_read_boundaries_confirmed=false`。
- [ ] 样例保持 `read_command_executed=false`、`read_attempt_limit=1`、`read_attempt_used=0`。
- [ ] 样例保持 `exact_real_paths_stored_in_git=false`、`raw_read_command_stored_in_git=false`。
- [ ] 样例保持 `git_storage_for_real_root_allowed=false`、`git_storage_for_real_allowlist_allowed=false`、`git_storage_for_raw_command_allowed=false`。
- [ ] 样例保持 `recursive_scan_allowed=false`、`config_read_allowed=false`、`log_read_allowed=false`、`credential_read_allowed=false`、`customer_data_read_allowed=false`。
- [ ] 样例保持 `raw_source_output_allowed=false`、`real_path_output_allowed=false`、`file_write_allowed=false`、`vcpchat_launch_allowed=false`、`vcpchat_modification_allowed=false`。
- [ ] 样例保持 `plugin_call_allowed=false`、`api_call_allowed=false`、`daily_note_call_allowed=false`、`vcp_memory_write_allowed=false`。
- [ ] 样例保持 `direct_implementation_allowed=false`、`daily_note_write_allowed=false`、`vcp_memory_write_allowed=false`、`asset_write_allowed=false`。
- [ ] 样例保持 `source_read_performed=false`、`real_vcpchat_source_read=false`。
- [ ] 样例保持 `real_vcpchat_modified=false`、`real_vcptoolbox_source_read=false`、`real_vcptoolbox_modified=false`。
- [ ] 样例保持 `raw_source_copy_allowed=false`、`raw_source_copied=false`。
- [ ] 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`vcp_memory_written=false`、`real_execution_allowed=false`。
- [ ] 样例保持 `ipc_handler_created=false`、`preload_runtime_code_created=false`、`renderer_runtime_code_created=false`、`execution_entry_created=false`。
- [ ] 样例不包含真实本地路径、真实读取命令、shell 命令文本、真实源码片段、完整函数体、endpoint 原文、环境变量值、secret、token、cookie、密码、客户隐私、raw runtime log、raw IPC payload、raw plugin output 或图片二进制。
- [ ] 人工参数复核门完成也只允许进入下一独立执行授权门，不得自动触发真实 VCPChat 源码读取。

## v2.4 Execute-once Execution Authorization Gate 检查

- [ ] `docs/96_v2_4_execute_once_execution_authorization_gate.md` 存在。
- [ ] `review_console/embed_contract/execute_once_execution_authorization_gate.md` 存在。
- [ ] `tests/schema_examples/v2_4_execute_once_execution_authorization_gate.example.yaml` 存在。
- [ ] execute-once execution authorization gate 只定义真实 VCPChat 一次性读取执行授权门，不读取真实 VCPChat 源码。
- [ ] execute-once execution authorization gate 不读取真实 VCPToolBox。
- [ ] execute-once execution authorization gate 不保存真实 VCPChat 根目录、真实 allowlist 路径、真实读取命令或 raw source。
- [ ] execute-once execution authorization gate 不修改真实 VCPChat 或 VCPToolBox。
- [ ] execute-once execution authorization gate 不创建真实 IPC handler、preload、renderer、Adapter 执行入口或其他执行代码。
- [ ] execute-once execution authorization gate 不调用插件、API、DailyNote、VCP 记忆或文件系统写入。
- [ ] 样例保持 `execution_authorization_required=true`、`execution_authorization_requested=false`。
- [ ] 样例保持 `execution_authorization_granted=false`、`one_time_read_attempt_authorized=false`。
- [ ] 样例保持 `execution_authorizer=null`、`execution_authorized_at=null`。
- [ ] 样例保持 `manual_parameter_review_passed=false`、`parameter_integrity_confirmed=false`。
- [ ] 样例保持 `root_ref_matches_authorization_context=false`、`allowlist_ref_matches_authorization_context=false`、`command_ref_matches_authorization_context=false`。
- [ ] 样例保持 `real_vcpchat_root_supplied_outside_git=false`、`allowed_read_paths_supplied_outside_git=false`、`read_command_supplied_outside_git=false`。
- [ ] 样例保持 `source_read_authorized=false`、`authorization_status=pending_execution_authorization`。
- [ ] 样例保持 `read_command_executed=false`、`read_attempt_limit=1`、`read_attempt_used=0`。
- [ ] 样例保持 `exact_real_paths_stored_in_git=false`、`raw_read_command_stored_in_git=false`。
- [ ] 样例保持 `git_storage_for_real_root_allowed=false`、`git_storage_for_real_allowlist_allowed=false`、`git_storage_for_raw_command_allowed=false`。
- [ ] 样例保持 `stop_conditions_confirmed=false`、`post_read_sanitization_route_required=true`。
- [ ] 样例保持 `recursive_scan_allowed=false`、`config_read_allowed=false`、`log_read_allowed=false`、`credential_read_allowed=false`、`customer_data_read_allowed=false`。
- [ ] 样例保持 `raw_source_output_allowed=false`、`real_path_output_allowed=false`、`file_write_allowed=false`、`vcpchat_launch_allowed=false`、`vcpchat_modification_allowed=false`。
- [ ] 样例保持 `plugin_call_allowed=false`、`api_call_allowed=false`、`daily_note_call_allowed=false`、`vcp_memory_write_allowed=false`。
- [ ] 样例保持 `direct_implementation_allowed=false`、`daily_note_write_allowed=false`、`vcp_memory_write_allowed=false`、`asset_write_allowed=false`。
- [ ] 样例保持 `source_read_performed=false`、`real_vcpchat_source_read=false`。
- [ ] 样例保持 `real_vcpchat_modified=false`、`real_vcptoolbox_source_read=false`、`real_vcptoolbox_modified=false`。
- [ ] 样例保持 `raw_source_copy_allowed=false`、`raw_source_copied=false`。
- [ ] 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`vcp_memory_written=false`、`real_execution_allowed=false`。
- [ ] 样例保持 `ipc_handler_created=false`、`preload_runtime_code_created=false`、`renderer_runtime_code_created=false`、`execution_entry_created=false`。
- [ ] 样例不包含真实本地路径、真实读取命令、shell 命令文本、真实源码片段、完整函数体、endpoint 原文、环境变量值、secret、token、cookie、密码、客户隐私、raw runtime log、raw IPC payload、raw plugin output 或图片二进制。
- [ ] 执行授权门完成也只允许进入下一独立真实读取运行授权点，不得自动触发真实 VCPChat 源码读取。

## v2.4 Execute-once Real Read Run Dry-run Readiness 检查

- [ ] `docs/97_v2_4_execute_once_real_read_run_dry_run_readiness.md` 存在。
- [ ] `review_console/embed_contract/execute_once_real_read_run_dry_run_readiness.md` 存在。
- [ ] `tests/schema_examples/v2_4_execute_once_real_read_run_dry_run_readiness.example.yaml` 存在。
- [ ] execute-once real read run dry-run readiness 只定义真实 VCPChat 一次性读取运行前 dry-run readiness，不读取真实 VCPChat 源码。
- [ ] execute-once real read run dry-run readiness 不读取真实 VCPToolBox。
- [ ] execute-once real read run dry-run readiness 不保存真实 VCPChat 根目录、真实 allowlist 路径、真实读取命令或 raw source。
- [ ] execute-once real read run dry-run readiness 不修改真实 VCPChat 或 VCPToolBox。
- [ ] execute-once real read run dry-run readiness 不创建真实 IPC handler、preload、renderer、Adapter 执行入口或其他执行代码。
- [ ] execute-once real read run dry-run readiness 不调用插件、API、DailyNote、VCP 记忆或文件系统写入。
- [ ] 样例保持 `real_read_run_dry_run_required=true`、`real_read_run_dry_run_requested=false`。
- [ ] 样例保持 `real_read_run_dry_run_passed=false`、`real_read_run_authorized=false`。
- [ ] 样例保持 `execution_authorization_granted=false`、`one_time_read_attempt_authorized=false`。
- [ ] 样例保持 `real_read_run_still_requires_hard_authorization=true`。
- [ ] 样例保持 `real_vcpchat_root_supplied_outside_git=false`、`allowed_read_paths_supplied_outside_git=false`、`read_command_supplied_outside_git=false`。
- [ ] 样例保持 `source_read_authorized=false`、`authorization_status=pending_real_read_run_dry_run_readiness`。
- [ ] 样例保持 `read_command_executed=false`、`read_attempt_limit=1`、`read_attempt_used=0`。
- [ ] 样例保持 `exact_real_paths_stored_in_git=false`、`raw_read_command_stored_in_git=false`。
- [ ] 样例保持 `git_storage_for_real_root_allowed=false`、`git_storage_for_real_allowlist_allowed=false`、`git_storage_for_raw_command_allowed=false`。
- [ ] 样例保持 `stop_conditions_confirmed=false`、`post_read_sanitization_route_required=true`。
- [ ] 样例保持 `recursive_scan_allowed=false`、`config_read_allowed=false`、`log_read_allowed=false`、`credential_read_allowed=false`、`customer_data_read_allowed=false`。
- [ ] 样例保持 `raw_source_output_allowed=false`、`real_path_output_allowed=false`、`file_write_allowed=false`、`vcpchat_launch_allowed=false`、`vcpchat_modification_allowed=false`。
- [ ] 样例保持 `plugin_call_allowed=false`、`api_call_allowed=false`、`daily_note_call_allowed=false`、`vcp_memory_write_allowed=false`。
- [ ] 样例保持 `direct_implementation_allowed=false`、`daily_note_write_allowed=false`、`vcp_memory_write_allowed=false`、`asset_write_allowed=false`。
- [ ] 样例保持 `source_read_performed=false`、`real_vcpchat_source_read=false`。
- [ ] 样例保持 `real_vcpchat_modified=false`、`real_vcptoolbox_source_read=false`、`real_vcptoolbox_modified=false`。
- [ ] 样例保持 `raw_source_copy_allowed=false`、`raw_source_copied=false`。
- [ ] 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`vcp_memory_written=false`、`real_execution_allowed=false`。
- [ ] 样例保持 `ipc_handler_created=false`、`preload_runtime_code_created=false`、`renderer_runtime_code_created=false`、`execution_entry_created=false`。
- [ ] 样例不包含真实本地路径、真实读取命令、shell 命令文本、真实源码片段、完整函数体、endpoint 原文、环境变量值、secret、token、cookie、密码、客户隐私、raw runtime log、raw IPC payload、raw plugin output 或图片二进制。
- [ ] dry-run readiness 完成也只允许进入下一独立真实读取运行授权点，不得自动触发真实 VCPChat 源码读取。

## v2.5 Post-read Sanitization and Evidence Chain 检查

- [ ] `docs/98_v2_5_post_read_sanitization_evidence_chain.md` 存在。
- [ ] `review_console/embed_contract/post_read_sanitization_evidence_chain.md` 存在。
- [ ] `tests/schema_examples/v2_5_post_read_sanitization_evidence_chain.example.yaml` 存在。
- [ ] post-read sanitization and evidence chain 只定义未来真实读取后的脱敏与证据处理链，不读取真实 VCPChat 源码。
- [ ] post-read sanitization and evidence chain 不读取真实 VCPToolBox。
- [ ] post-read sanitization and evidence chain 不保存真实 VCPChat 根目录、真实 allowlist 路径、真实读取命令或 raw source。
- [ ] post-read sanitization and evidence chain 不保存 raw evidence、raw runtime log、raw IPC payload 或 raw plugin output。
- [ ] post-read sanitization and evidence chain 不修改真实 VCPChat 或 VCPToolBox。
- [ ] post-read sanitization and evidence chain 不创建真实 IPC handler、preload、renderer、Adapter 执行入口或其他执行代码。
- [ ] post-read sanitization and evidence chain 不调用插件、API、DailyNote、VCP 记忆或文件系统写入。
- [ ] 样例保持 `post_read_sanitization_required=true`、`post_read_sanitization_requested=false`。
- [ ] 样例保持 `post_read_sanitization_performed=false`、`evidence_packet_created=false`。
- [ ] 样例保持 `sanitized_evidence_summary_created=false`、`sanitized_evidence_review_requested=false`、`sanitized_evidence_review_passed=false`。
- [ ] 样例保持 `raw_evidence_received=false`、`raw_evidence_retained=false`、`raw_source_retained=false`。
- [ ] 样例保持 `real_read_run_record_exists=false`、`real_read_run_authorized=false`。
- [ ] 样例保持 `source_read_authorized=false`、`authorization_status=pending_post_read_sanitization_chain`。
- [ ] 样例保持 `read_command_executed=false`、`read_attempt_limit=1`、`read_attempt_used=0`。
- [ ] 样例保持 `source_read_performed=false`、`real_vcpchat_source_read=false`。
- [ ] 样例保持 `exact_real_paths_stored_in_git=false`、`raw_read_command_stored_in_git=false`。
- [ ] 样例保持 `git_storage_for_raw_source_allowed=false`、`git_storage_for_raw_evidence_allowed=false`。
- [ ] 样例保持 `memory_delta_raw_source_allowed=false`、`daily_note_raw_source_allowed=false`、`audit_log_raw_source_allowed=false`。
- [ ] 样例保持 `implementation_from_unsanitized_evidence_allowed=false`、`memory_write_from_unsanitized_evidence_allowed=false`、`asset_write_from_unsanitized_evidence_allowed=false`。
- [ ] 样例保持 `preserved_original_allowed=false`。
- [ ] 样例保持 `direct_implementation_allowed=false`、`daily_note_write_allowed=false`、`vcp_memory_write_allowed=false`、`asset_write_allowed=false`。
- [ ] 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`vcp_memory_written=false`、`real_execution_allowed=false`。
- [ ] 样例保持 `implementation_code_created=false`、`ipc_handler_created=false`、`preload_runtime_code_created=false`、`renderer_runtime_code_created=false`、`execution_entry_created=false`。
- [ ] 样例不包含真实本地路径、真实读取命令、shell 命令文本、真实源码片段、完整函数体、endpoint 原文、环境变量值、secret、token、cookie、密码、客户隐私、raw runtime log、raw IPC payload、raw plugin output 或图片二进制。
- [ ] post-read 脱敏链完成也只允许进入下一独立脱敏证据人工复核门，不得自动触发实现、DailyNote、VCP 记忆或资产写入。

## v2.5 Sanitized Evidence Review Gate 检查

- [ ] `docs/99_v2_5_sanitized_evidence_review_gate.md` 存在。
- [ ] `review_console/embed_contract/sanitized_evidence_review_gate.md` 存在。
- [ ] `tests/schema_examples/v2_5_sanitized_evidence_review_gate.example.yaml` 存在。
- [ ] sanitized evidence review gate 只定义脱敏证据人工复核门，不读取真实 VCPChat 源码。
- [ ] sanitized evidence review gate 不读取真实 VCPToolBox。
- [ ] sanitized evidence review gate 不保存真实 VCPChat 根目录、真实 allowlist 路径、真实读取命令或 raw source。
- [ ] sanitized evidence review gate 不保存 raw evidence、raw runtime log、raw IPC payload 或 raw plugin output。
- [ ] sanitized evidence review gate 不修改真实 VCPChat 或 VCPToolBox。
- [ ] sanitized evidence review gate 不创建真实 IPC handler、preload、renderer、Adapter 执行入口或其他执行代码。
- [ ] sanitized evidence review gate 不调用插件、API、DailyNote、VCP 记忆或文件系统写入。
- [ ] 样例保持 `sanitized_evidence_review_required=true`、`sanitized_evidence_review_requested=false`。
- [ ] 样例保持 `sanitized_evidence_review_passed=false`、`sanitized_evidence_summary_exists=false`。
- [ ] 样例保持 `evidence_packet_created=false`、`raw_evidence_retained=false`、`raw_source_retained=false`。
- [ ] 样例保持 `review_result=pending`。
- [ ] 样例保持 `implementation_authorized=false`、`memory_write_authorized=false`、`daily_note_write_authorized=false`、`asset_write_authorized=false`。
- [ ] 样例保持 `design_discussion_authorized=false`。
- [ ] 样例保持 `post_read_sanitization_performed=false`、`sanitized_evidence_summary_created=false`。
- [ ] 样例保持 `raw_evidence_received=false`、`manual_safety_review_completed=false`。
- [ ] 样例保持 `implementation_from_unsanitized_evidence_allowed=false`、`memory_write_from_unsanitized_evidence_allowed=false`、`asset_write_from_unsanitized_evidence_allowed=false`。
- [ ] 样例保持 `direct_implementation_allowed=false`、`daily_note_write_allowed=false`、`vcp_memory_write_allowed=false`、`asset_write_allowed=false`。
- [ ] 样例保持 `preserved_original_allowed=false`。
- [ ] 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`vcp_memory_written=false`、`real_execution_allowed=false`。
- [ ] 样例保持 `implementation_code_created=false`、`ipc_handler_created=false`、`preload_runtime_code_created=false`、`renderer_runtime_code_created=false`、`execution_entry_created=false`。
- [ ] 样例不包含真实本地路径、真实读取命令、shell 命令文本、真实源码片段、完整函数体、endpoint 原文、环境变量值、secret、token、cookie、密码、客户隐私、raw runtime log、raw IPC payload、raw plugin output 或图片二进制。
- [ ] 脱敏证据人工复核门完成也只允许进入下一独立 post-read decision routing，不得自动触发实现、DailyNote、VCP 记忆或资产写入。

## v2.5 Post-read Decision Routing 检查

- [ ] `docs/100_v2_5_post_read_decision_routing.md` 存在。
- [ ] `review_console/embed_contract/post_read_decision_routing.md` 存在。
- [ ] `tests/schema_examples/v2_5_post_read_decision_routing.example.yaml` 存在。
- [ ] post-read decision routing 只定义读取后决策路由，不读取真实 VCPChat 源码。
- [ ] post-read decision routing 不读取真实 VCPToolBox。
- [ ] post-read decision routing 不保存真实 VCPChat 根目录、真实 allowlist 路径、真实读取命令或 raw source。
- [ ] post-read decision routing 不保存 raw evidence、raw runtime log、raw IPC payload 或 raw plugin output。
- [ ] post-read decision routing 不修改真实 VCPChat 或 VCPToolBox。
- [ ] post-read decision routing 不创建真实 IPC handler、preload、renderer、Adapter 执行入口或其他执行代码。
- [ ] post-read decision routing 不调用插件、API、DailyNote、VCP 记忆或文件系统写入。
- [ ] 样例保持 `post_read_decision_routing_required=true`、`post_read_decision_routing_requested=false`。
- [ ] 样例保持 `post_read_decision_routing_performed=false`。
- [ ] 样例保持 `sanitized_evidence_review_passed=false`、`sanitized_evidence_summary_exists=false`。
- [ ] 样例保持 `evidence_packet_created=false`、`raw_evidence_retained=false`、`raw_source_retained=false`。
- [ ] 样例保持 `selected_route=pending`、`review_result=pending`。
- [ ] 样例保持 `implementation_authorized=false`、`memory_handoff_authorized=false`、`daily_note_write_authorized=false`、`asset_write_authorized=false`。
- [ ] 样例保持 `design_discussion_authorized=false`、`archive_rejection_record_authorized=false`。
- [ ] 样例保持 `route_specific_authorization_required=true`、`route_specific_authorization_granted=false`。
- [ ] 样例保持 `implementation_request_is_authorization=false`、`memory_handoff_request_is_write=false`、`daily_note_request_is_write=false`。
- [ ] 样例保持 `reject_sensitive_content_keeps_raw_text=false`、`request_resanitization_keeps_raw_evidence=false`、`archive_rejection_keeps_original=false`。
- [ ] 样例保持 `direct_implementation_allowed=false`、`daily_note_write_allowed=false`、`vcp_memory_write_allowed=false`、`asset_write_allowed=false`。
- [ ] 样例保持 `preserved_original_allowed=false`。
- [ ] 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`vcp_memory_written=false`、`real_execution_allowed=false`。
- [ ] 样例保持 `implementation_code_created=false`、`ipc_handler_created=false`、`preload_runtime_code_created=false`、`renderer_runtime_code_created=false`、`execution_entry_created=false`。
- [ ] 样例不包含真实本地路径、真实读取命令、shell 命令文本、真实源码片段、完整函数体、endpoint 原文、环境变量值、secret、token、cookie、密码、客户隐私、raw runtime log、raw IPC payload、raw plugin output 或图片二进制。
- [ ] post-read decision routing 完成也只允许进入下一独立 route-specific authorization gate，不得自动触发实现、DailyNote、VCP 记忆或资产写入。

## v2.5 Route-specific Authorization Gate 检查

- [ ] `docs/101_v2_5_route_specific_authorization_gate.md` 存在。
- [ ] `review_console/embed_contract/route_specific_authorization_gate.md` 存在。
- [ ] `tests/schema_examples/v2_5_route_specific_authorization_gate.example.yaml` 存在。
- [ ] route-specific authorization gate 只定义路线专属授权门，不读取真实 VCPChat 源码。
- [ ] route-specific authorization gate 不读取真实 VCPToolBox。
- [ ] route-specific authorization gate 不保存真实 VCPChat 根目录、真实 allowlist 路径、真实读取命令或 raw source。
- [ ] route-specific authorization gate 不保存 raw evidence、raw runtime log、raw IPC payload 或 raw plugin output。
- [ ] route-specific authorization gate 不修改真实 VCPChat 或 VCPToolBox。
- [ ] route-specific authorization gate 不创建真实 IPC handler、preload、renderer、Adapter 执行入口或其他执行代码。
- [ ] route-specific authorization gate 不调用插件、API、DailyNote、VCP 记忆或文件系统写入。
- [ ] 样例保持 `route_specific_authorization_required=true`、`route_specific_authorization_requested=false`。
- [ ] 样例保持 `route_specific_authorization_granted=false`。
- [ ] 样例保持 `selected_route=pending`。
- [ ] 样例保持 `post_read_decision_routing_performed=false`。
- [ ] 样例保持 `sanitized_evidence_review_passed=false`、`sanitized_evidence_summary_exists=false`。
- [ ] 样例保持 `evidence_packet_created=false`、`raw_evidence_retained=false`、`raw_source_retained=false`。
- [ ] 样例保持 `implementation_authorized=false`、`memory_handoff_authorized=false`、`daily_note_write_authorized=false`、`asset_write_authorized=false`。
- [ ] 样例保持 `design_discussion_authorized=false`、`archive_rejection_record_authorized=false`。
- [ ] 样例保持 `route_selection_is_authorization=false`、`implementation_request_is_authorization=false`。
- [ ] 样例保持 `memory_handoff_request_is_write=false`、`daily_note_request_is_write=false`、`archive_rejection_keeps_original=false`。
- [ ] 样例保持 `direct_implementation_allowed=false`、`daily_note_write_allowed=false`、`vcp_memory_write_allowed=false`、`asset_write_allowed=false`。
- [ ] 样例保持 `preserved_original_allowed=false`。
- [ ] 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`vcp_memory_written=false`、`real_execution_allowed=false`。
- [ ] 样例保持 `implementation_code_created=false`、`ipc_handler_created=false`、`preload_runtime_code_created=false`、`renderer_runtime_code_created=false`、`execution_entry_created=false`。
- [ ] 样例不包含真实本地路径、真实读取命令、shell 命令文本、真实源码片段、完整函数体、endpoint 原文、环境变量值、secret、token、cookie、密码、客户隐私、raw runtime log、raw IPC payload、raw plugin output 或图片二进制。
- [ ] route-specific authorization gate 完成也只允许进入下一独立 closeout 或 v2.6 runtime planning，不得自动触发实现、DailyNote、VCP 记忆或资产写入。

## v2.6 Review Console Runtime Handoff Planning 检查

- [ ] `docs/102_v2_6_review_console_runtime_handoff_plan.md` 存在。
- [ ] `review_console/embed_contract/review_console_runtime_handoff.md` 存在。
- [ ] `tests/schema_examples/v2_6_review_console_runtime_handoff.example.yaml` 存在。
- [ ] Review Console runtime handoff planning 只定义 handoff 规划，不读取真实 VCPChat 源码。
- [ ] Review Console runtime handoff planning 不读取真实 VCPToolBox。
- [ ] Review Console runtime handoff planning 不保存真实根目录、真实 allowlist 路径、真实读取命令或 raw source。
- [ ] Review Console runtime handoff planning 不保存 raw evidence、raw runtime log、raw IPC payload 或 raw plugin output。
- [ ] Review Console runtime handoff planning 不修改真实 VCPChat 或 VCPToolBox。
- [ ] Review Console runtime handoff planning 不创建真实 IPC handler、preload、renderer runtime、Adapter 执行入口或其他执行代码。
- [ ] Review Console runtime handoff planning 不调用插件、API、DailyNote、VCP 记忆或文件系统写入。
- [ ] 样例保持 `runtime_handoff_planning_required=true`、`runtime_handoff_planning_completed=false`。
- [ ] 样例保持 `runtime_handoff_authorized=false`、`route_specific_authorization_granted=false`。
- [ ] 样例保持 `route_specific_authorization_requested=false`、`selected_route=pending`。
- [ ] 样例保持 `review_session_draft.raw_source_allowed=false`。
- [ ] 样例保持 `image_case_draft.image_binary_allowed=false`、`image_case_draft.real_path_allowed=false`。
- [ ] 样例保持 `memory_delta_draft.preserved_original_allowed=false`、`memory_delta_draft.direct_daily_note_write_allowed=false`。
- [ ] 样例保持 `prototype_guard.api_called=false`、`prototype_guard.vcp_plugin_called=false`、`prototype_guard.daily_note_called=false`。
- [ ] 样例保持 `route_specific_authorization_gate_ref.raw_gate_body_allowed=false`。
- [ ] 样例保持 `real_vcpchat_source_read=false`、`real_vcpchat_modified=false`。
- [ ] 样例保持 `real_vcptoolbox_source_read=false`、`real_vcptoolbox_modified=false`。
- [ ] 样例保持 `implementation_code_created=false`、`ipc_handler_created=false`、`preload_runtime_code_created=false`、`renderer_runtime_code_created=false`、`execution_entry_created=false`。
- [ ] 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`vcp_memory_written=false`、`real_execution_allowed=false`。
- [ ] 样例保持 `image_file_created=false`、`file_write_performed=false`、`disk_write_performed=false`。
- [ ] 样例保持 `selected_plugin=null`、`max_plugin_calls=0`、`real_manifest_read=false`。
- [ ] 样例不包含真实本地路径、真实读取命令、shell 命令文本、真实源码片段、完整函数体、endpoint 原文、环境变量值、secret、token、cookie、密码、客户隐私、raw runtime log、raw IPC payload、raw plugin output 或图片二进制。
- [ ] runtime handoff planning 完成也只允许进入下一独立 closeout 或 v2.7 runtime implementation planning，不得自动触发实现、DailyNote、VCP 记忆或资产写入。

## v2.6 Runtime Handoff Authorization Gate 检查

- [ ] `docs/103_v2_6_runtime_handoff_authorization_gate.md` 存在。
- [ ] `review_console/embed_contract/runtime_handoff_authorization_gate.md` 存在。
- [ ] `tests/schema_examples/v2_6_runtime_handoff_authorization_gate.example.yaml` 存在。
- [ ] runtime handoff authorization gate 只定义 handoff 授权门，不读取真实 VCPChat 源码。
- [ ] runtime handoff authorization gate 不读取真实 VCPToolBox。
- [ ] runtime handoff authorization gate 不保存真实根目录、真实 allowlist 路径、真实读取命令或 raw source。
- [ ] runtime handoff authorization gate 不保存 raw evidence、raw runtime log、raw IPC payload 或 raw plugin output。
- [ ] runtime handoff authorization gate 不修改真实 VCPChat 或 VCPToolBox。
- [ ] runtime handoff authorization gate 不创建真实 IPC handler、preload、renderer runtime、Adapter 执行入口或其他执行代码。
- [ ] runtime handoff authorization gate 不调用插件、API、DailyNote、VCP 记忆或文件系统写入。
- [ ] 样例保持 `runtime_handoff_authorization_required=true`、`runtime_handoff_authorization_requested=false`。
- [ ] 样例保持 `runtime_handoff_authorization_granted=false`。
- [ ] 样例保持 `runtime_handoff_planning_completed=false`、`runtime_handoff_authorized=false`。
- [ ] 样例保持 `route_specific_authorization_granted=false`。
- [ ] 样例保持 `schema_mapping_review_completed=false`、`electron_boundary_review_completed=false`。
- [ ] 样例保持 `implementation_planning_authorized=false`。
- [ ] 样例保持 `ipc_handler_creation_authorized=false`、`preload_runtime_creation_authorized=false`、`renderer_runtime_creation_authorized=false`。
- [ ] 样例保持 `real_vcpchat_modification_authorized=false`。
- [ ] 样例保持 `daily_note_write_authorized=false`、`vcp_memory_write_authorized=false`、`asset_write_authorized=false`。
- [ ] 样例保持 `handoff_planning_is_implementation_authorization=false`、`handoff_authorization_creates_runtime_code=false`。
- [ ] 样例保持 `handoff_authorization_modifies_vcpchat=false`、`implementation_planning_writes_code=false`。
- [ ] 样例保持 `real_vcpchat_source_read=false`、`real_vcpchat_modified=false`。
- [ ] 样例保持 `real_vcptoolbox_source_read=false`、`real_vcptoolbox_modified=false`。
- [ ] 样例保持 `implementation_code_created=false`、`ipc_handler_created=false`、`preload_runtime_code_created=false`、`renderer_runtime_code_created=false`、`execution_entry_created=false`。
- [ ] 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`vcp_memory_written=false`、`real_execution_allowed=false`。
- [ ] 样例保持 `image_file_created=false`、`file_write_performed=false`、`disk_write_performed=false`。
- [ ] 样例保持 `selected_plugin=null`、`max_plugin_calls=0`、`real_manifest_read=false`。
- [ ] 样例不包含真实本地路径、真实读取命令、shell 命令文本、真实源码片段、完整函数体、endpoint 原文、环境变量值、secret、token、cookie、密码、客户隐私、raw runtime log、raw IPC payload、raw plugin output 或图片二进制。
- [ ] runtime handoff authorization gate 完成也只允许进入下一独立 closeout 或 v2.7 runtime implementation planning gate，不得自动触发实现、DailyNote、VCP 记忆或资产写入。

## v2.7 Runtime Implementation Planning Gate 检查

- [ ] `docs/104_v2_7_runtime_implementation_planning_gate.md` 存在。
- [ ] `review_console/embed_contract/runtime_implementation_planning_gate.md` 存在。
- [ ] `tests/schema_examples/v2_7_runtime_implementation_planning_gate.example.yaml` 存在。
- [ ] runtime implementation planning gate 只定义实现规划门，不读取真实 VCPChat 源码。
- [ ] runtime implementation planning gate 不读取真实 VCPToolBox。
- [ ] runtime implementation planning gate 不保存真实根目录、真实 allowlist 路径、真实读取命令或 raw source。
- [ ] runtime implementation planning gate 不保存 raw evidence、raw runtime log、raw IPC payload 或 raw plugin output。
- [ ] runtime implementation planning gate 不修改真实 VCPChat 或 VCPToolBox。
- [ ] runtime implementation planning gate 不创建真实 IPC handler、preload、renderer runtime、Adapter 执行入口或其他执行代码。
- [ ] runtime implementation planning gate 不调用插件、API、DailyNote、VCP 记忆或文件系统写入。
- [ ] 样例保持 `runtime_implementation_planning_required=true`、`runtime_implementation_planning_requested=false`。
- [ ] 样例保持 `runtime_implementation_planning_approved=false`。
- [ ] 样例保持 `runtime_handoff_authorization_granted=false`。
- [ ] 样例保持 `implementation_file_scope_declared=false`、`rollback_plan_declared=false`、`validation_plan_declared=false`。
- [ ] 样例保持 `electron_boundary_review_completed=false`。
- [ ] 样例保持 `allowed_modify_files=[]`、`allowed_create_files=[]`、`allowed_ipc_channels=[]`。
- [ ] 样例保持 `implementation_planning_authorized=false`。
- [ ] 样例保持 `ipc_handler_creation_authorized=false`、`preload_runtime_creation_authorized=false`、`renderer_runtime_creation_authorized=false`。
- [ ] 样例保持 `real_vcpchat_modification_authorized=false`。
- [ ] 样例保持 `daily_note_write_authorized=false`、`vcp_memory_write_authorized=false`、`asset_write_authorized=false`。
- [ ] 样例保持 `implementation_planning_is_code_authorization=false`、`implementation_planning_writes_code=false`。
- [ ] 样例保持 `file_scope_declaration_writes_files=false`、`validation_plan_runs_commands=false`。
- [ ] 样例保持 `real_vcpchat_source_read=false`、`real_vcpchat_modified=false`。
- [ ] 样例保持 `real_vcptoolbox_source_read=false`、`real_vcptoolbox_modified=false`。
- [ ] 样例保持 `implementation_code_created=false`、`ipc_handler_created=false`、`preload_runtime_code_created=false`、`renderer_runtime_code_created=false`、`execution_entry_created=false`。
- [ ] 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`vcp_memory_written=false`、`real_execution_allowed=false`。
- [ ] 样例保持 `image_file_created=false`、`file_write_performed=false`、`disk_write_performed=false`。
- [ ] 样例保持 `selected_plugin=null`、`max_plugin_calls=0`、`real_manifest_read=false`。
- [ ] 样例不包含真实本地路径、真实读取命令、shell 命令文本、真实源码片段、完整函数体、endpoint 原文、环境变量值、secret、token、cookie、密码、客户隐私、raw runtime log、raw IPC payload、raw plugin output 或图片二进制。
- [ ] runtime implementation planning gate 完成也只允许进入下一独立 closeout 或 v2.8 runtime implementation task authorization，不得自动触发实现、DailyNote、VCP 记忆或资产写入。

## v2.8 Runtime Implementation Task Authorization 检查

- [ ] `docs/105_v2_8_runtime_implementation_task_authorization.md` 存在。
- [ ] `review_console/embed_contract/runtime_implementation_task_authorization.md` 存在。
- [ ] `tests/schema_examples/v2_8_runtime_implementation_task_authorization.example.yaml` 存在。
- [ ] runtime implementation task authorization 只定义具体实现任务授权点，不读取真实 VCPChat 源码。
- [ ] runtime implementation task authorization 不读取真实 VCPToolBox。
- [ ] runtime implementation task authorization 不保存真实根目录、真实 allowlist 路径、真实读取命令或 raw source。
- [ ] runtime implementation task authorization 不填真实路径，不填真实文件名。
- [ ] runtime implementation task authorization 不保存 raw evidence、raw runtime log、raw IPC payload 或 raw plugin output。
- [ ] runtime implementation task authorization 不修改真实 VCPChat 或 VCPToolBox。
- [ ] runtime implementation task authorization 不创建真实 IPC handler、preload、renderer runtime、Adapter 执行入口或其他执行代码。
- [ ] runtime implementation task authorization 不调用插件、API、DailyNote、VCP 记忆或文件系统写入。
- [ ] 样例保持 `runtime_implementation_task_authorization_required=true`、`runtime_implementation_task_authorization_requested=false`。
- [ ] 样例保持 `runtime_implementation_task_authorization_granted=false`。
- [ ] 样例保持 `runtime_implementation_planning_approved=false`。
- [ ] 样例保持 `authorized_task_id=null`、`authorized_file_scope_ref=null`。
- [ ] 样例保持 `authorized_rollback_plan_ref=null`、`authorized_validation_plan_ref=null`。
- [ ] 样例保持 `allowed_modify_files=[]`、`allowed_create_files=[]`、`allowed_ipc_channels=[]`。
- [ ] 样例保持 `allowed_preload_api_names=[]`、`allowed_renderer_entry_points=[]`。
- [ ] 样例保持 `ipc_handler_creation_authorized=false`、`preload_runtime_creation_authorized=false`、`renderer_runtime_creation_authorized=false`。
- [ ] 样例保持 `real_vcpchat_modification_authorized=false`。
- [ ] 样例保持 `daily_note_write_authorized=false`、`vcp_memory_write_authorized=false`、`asset_write_authorized=false`。
- [ ] 样例保持 `task_authorization_is_multi_patch_authorization=false`、`task_authorization_extends_to_unlisted_files=false`。
- [ ] 样例保持 `task_authorization_allows_scope_expansion_by_continue=false`。
- [ ] 样例保持 `task_authorization_calls_plugins=false`、`task_authorization_writes_daily_note=false`、`task_authorization_writes_vcp_memory=false`。
- [ ] 样例保持 `real_vcpchat_source_read=false`、`real_vcpchat_modified=false`。
- [ ] 样例保持 `real_vcptoolbox_source_read=false`、`real_vcptoolbox_modified=false`。
- [ ] 样例保持 `implementation_code_created=false`、`ipc_handler_created=false`、`preload_runtime_code_created=false`、`renderer_runtime_code_created=false`、`execution_entry_created=false`。
- [ ] 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`vcp_memory_written=false`、`real_execution_allowed=false`。
- [ ] 样例保持 `image_file_created=false`、`file_write_performed=false`、`disk_write_performed=false`。
- [ ] 样例保持 `selected_plugin=null`、`max_plugin_calls=0`、`real_manifest_read=false`。
- [ ] 样例不包含真实本地路径、真实读取命令、shell 命令文本、真实源码片段、完整函数体、endpoint 原文、环境变量值、secret、token、cookie、密码、客户隐私、raw runtime log、raw IPC payload、raw plugin output 或图片二进制。
- [ ] runtime implementation task authorization 完成也只允许进入下一独立 closeout 或 v2.9 runtime patch preflight，不得自动触发实现、DailyNote、VCP 记忆或资产写入。

## v2.9 Runtime Patch Preflight 检查

- [ ] `docs/106_v2_9_runtime_patch_preflight.md` 存在。
- [ ] `review_console/embed_contract/runtime_patch_preflight.md` 存在。
- [ ] `tests/schema_examples/v2_9_runtime_patch_preflight.example.yaml` 存在。
- [ ] runtime patch preflight 只定义真正写代码前的最后 preflight，不读取真实 VCPChat 源码。
- [ ] runtime patch preflight 不读取真实 VCPToolBox。
- [ ] runtime patch preflight 不保存真实根目录、真实 allowlist 路径、真实读取命令或 raw source。
- [ ] runtime patch preflight 不填真实路径，不填真实文件名。
- [ ] runtime patch preflight 不保存 raw evidence、raw runtime log、raw IPC payload 或 raw plugin output。
- [ ] runtime patch preflight 不修改真实 VCPChat 或 VCPToolBox。
- [ ] runtime patch preflight 不创建真实 IPC handler、preload、renderer runtime、Adapter 执行入口或其他执行代码。
- [ ] runtime patch preflight 不调用插件、API、DailyNote、VCP 记忆或文件系统写入。
- [ ] 样例保持 `runtime_patch_preflight_required=true`、`runtime_patch_preflight_requested=false`。
- [ ] 样例保持 `runtime_patch_preflight_passed=false`。
- [ ] 样例保持 `runtime_implementation_task_authorization_granted=false`。
- [ ] 样例保持 `authorized_task_id=null`、`authorized_file_scope_ref=null`。
- [ ] 样例保持 `authorized_rollback_plan_ref=null`、`authorized_validation_plan_ref=null`。
- [ ] 样例保持 `file_scope_ready=false`、`rollback_plan_ready=false`、`validation_plan_ready=false`。
- [ ] 样例保持 `electron_boundary_ready=false`、`stop_conditions_ready=false`。
- [ ] 样例保持 `implementation_patch_authorized=false`。
- [ ] 样例保持 `ipc_handler_creation_authorized=false`、`preload_runtime_creation_authorized=false`、`renderer_runtime_creation_authorized=false`。
- [ ] 样例保持 `real_vcpchat_modification_authorized=false`。
- [ ] 样例保持 `preflight_pass_is_code_authorization=false`、`preflight_pass_writes_code=false`。
- [ ] 样例保持 `implementation_patch_authorization_writes_code=false`、`preflight_expands_task_scope=false`。
- [ ] 样例保持 `preflight_calls_plugins=false`、`preflight_writes_daily_note=false`、`preflight_writes_vcp_memory=false`。
- [ ] 样例保持 `real_vcpchat_source_read=false`、`real_vcpchat_modified=false`。
- [ ] 样例保持 `real_vcptoolbox_source_read=false`、`real_vcptoolbox_modified=false`。
- [ ] 样例保持 `implementation_code_created=false`、`ipc_handler_created=false`、`preload_runtime_code_created=false`、`renderer_runtime_code_created=false`、`execution_entry_created=false`。
- [ ] 样例保持 `api_called=false`、`vcp_plugin_called=false`、`daily_note_called=false`、`vcp_memory_written=false`、`real_execution_allowed=false`。
- [ ] 样例保持 `image_file_created=false`、`file_write_performed=false`、`disk_write_performed=false`。
- [ ] 样例保持 `selected_plugin=null`、`max_plugin_calls=0`、`real_manifest_read=false`。
- [ ] 样例不包含真实本地路径、真实读取命令、shell 命令文本、真实源码片段、完整函数体、endpoint 原文、环境变量值、secret、token、cookie、密码、客户隐私、raw runtime log、raw IPC payload、raw plugin output 或图片二进制。
- [ ] runtime patch preflight 完成也只允许进入下一独立 closeout 或 v3.0 first runtime patch authorization，不得自动触发实现、DailyNote、VCP 记忆或资产写入。
