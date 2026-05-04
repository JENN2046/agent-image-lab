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

## 无执行闭环检查

- [ ] `tests/schema_examples/task_envelope.example.yaml` 是 Photo Studio OS 无执行样例。
- [ ] `tests/schema_examples/review_score.example.yaml` 有分项评分和中文评审。
- [ ] `tests/schema_examples/memory_delta.example.yaml` 有中文正文和安全检查。
- [ ] MVP-A 闭环能串联：用户需求 → task_envelope → prompt_package → review_score → human_review → memory_delta → case_summary。
