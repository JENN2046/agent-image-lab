# Validation Checklist

## 结构检查

- [ ] 所有任务书要求的 MVP 文件存在。
- [ ] 文件直接位于项目根目录下，没有创建第二套 `agent-image-lab/` 嵌套目录。
- [ ] 未修改 `codex/00_MASTER_TASK.md`。
- [ ] 未修改 VCPToolBox。
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
- [ ] `exports/vcptoolbox/` 只包含导出草案，不代表真实 VCPToolBox 已修改。
- [ ] AgentImageLabAdapter 只允许 `dry_run` 命令。
- [ ] AgentImageLabAdapter 不包含 execution mode。
- [ ] AgentImageLabAdapter 没有 `index.js` 或其他真实执行入口。
- [ ] `plugin-manifest.json` 中 `external_api_allowed=false`。
- [ ] `plugin-manifest.json` 中 `execution_blocked=true`。
- [ ] `plugin-manifest.json` 中 `max_plugin_calls=0`。
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
- [ ] 能力矩阵仍保持 `待实测` / `pending_manifest_review` / `dry_run_checked` / `tested` 的人工推进语义。
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
- [ ] Phase 8 状态推进样例未完成 dry-run 前禁止进入 `dry_run_checked` 或 `tested`。
- [ ] Phase 8 状态推进样例明确 `selected_plugin=null`、`max_plugin_calls=0`、`execution_blocked=true`。
- [ ] 未新增真实插件名称或真实插件能力结论。
- [ ] 未新增真实 manifest 原文。
- [ ] 未新增 `index.js` 或其他真实 Adapter 可执行入口。
- [ ] 未调用 API、VCP 插件或 DailyNote。
- [ ] 未创建图片文件。
- [ ] 未修改真实 VCPToolBox。
- [ ] 未修改真实 VCPChat。

## 无执行闭环检查

- [ ] `tests/schema_examples/task_envelope.example.yaml` 是 Photo Studio OS 无执行样例。
- [ ] `tests/schema_examples/review_score.example.yaml` 有分项评分和中文评审。
- [ ] `tests/schema_examples/memory_delta.example.yaml` 有中文正文和安全检查。
- [ ] MVP-A 闭环能串联：用户需求 → task_envelope → prompt_package → review_score → human_review → memory_delta → case_summary。
