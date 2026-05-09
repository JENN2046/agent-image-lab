# Runtime Prototype Field Mapping

本文用于验收 v1.2 runtime prototype 的草案输出是否能映射到核心 schema。它只描述项目内浏览器原型的字段关系，不代表真实 VCPChat 接入、真实插件调用、DailyNote 写入或文件写入。

## review_session_draft

| schema 字段 | runtime prototype 来源 | 说明 |
| --- | --- | --- |
| `session_id` / `task_id` / `case_id` / `project` | `host_bridge_mock.js` mock session | 受控占位输入 |
| `status` | `buildDraft()` | `accepted` 时为 `approved`，拒绝时为 `rejected`，否则为 `human_reviewing` |
| `image_versions` | mock session | 只保存占位资产引用，不加载图片二进制 |
| `current_version_id` | 当前版本 | 当前原型只展示一个受控版本 |
| `compare_version_id` | mock session | 当前为 `null` |
| `ai_review` | mock session | AI 评分只是建议 |
| `human_review` | 人工评分和中文评论输入 | 人工评分覆盖 AI 评分 |
| `final_review` | `human_review` 派生 | 固定优先采用人工评分 |
| `comments` | mock 评论 + 人工评论 | 评论正文必须是中文或脱敏摘要 |
| `annotation_notes` | mock session | v1.2 可为空 |
| `version_comparison` | mock session | 只记录中文摘要 |
| `approval` | 人工批准 checkbox | 未勾选时保持 `pending` |
| `archive_decision` | 人工批准 checkbox + 资产状态 select | AI 的 `archive_recommendation` 不能替代人工批准 |
| `memory_preview` | 记忆正文输入 + mock 安全字段 | 仅作为中文预览，不代表已写 DailyNote |
| `memory_approval` | 记忆审批 select | 未 `approved` 时不得触发写入 |
| `next_iteration` | mock session | 只写中文下一步说明 |
| `audit_log` | `buildDraft()` | 记录 no-execution guard |

## image_case_draft

| schema 字段 | runtime prototype 来源 | 说明 |
| --- | --- | --- |
| `case_id` / `task_id` / `project` | mock session | 与 `review_session_draft` 保持一致 |
| `image_type` | `image_case_seed` | 固定 Photo Studio OS dashboard |
| `input_assets` / `output_assets` | `image_case_seed` + 当前版本 | 全部是占位引用，不是图片文件 |
| `plugin_used` | `image_case_seed.plugin_used` | 当前为 `null` |
| `prompt_package_id` / `review_ids` | `image_case_seed` | 占位 ID |
| `final_score` | 人工评分 | 人工评分优先 |
| `asset_status` | 资产状态 + 人工批准 | 未人工批准时不能为 `accepted` |
| `human_approval` | 人工批准 checkbox | `accepted` 必须有 `approved=true`、`approved_by`、`approved_at` |
| `strengths_cn` / `weaknesses_cn` / `reusable_rules_cn` | `image_case_seed` | 中文摘要 |
| `memory_entries` | 当前 `memory_delta_draft.delta_id` | 仅草案引用 |
| `git_promotion_candidate` | `image_case_seed` | 当前固定 `false` |

## memory_delta_draft

| schema 字段 | runtime prototype 来源 | 说明 |
| --- | --- | --- |
| `delta_id` | 固定草案 ID | 仅浏览器草案 |
| `task_id` / `case_id` / `project` | mock session | 与 review session 一致 |
| `created_at` | `buildDraft()` | ISO 时间 |
| `agent_name` / `agent_role` | 固定 runtime 原型署名 | 不是正式 VCP Agent |
| `memory_type` / `target_notebook` | 固定类型 + mock preview | 记忆候选 |
| `write_mode` | `memory_approval.status` 派生 | `approved -> confirmed`，`rejected -> forbidden`，其余为 `draft` |
| `approval_status` / `approved_by` / `approved_at` | 记忆审批 select | `confirmed` 必须有审批人和审批时间 |
| `source` | session / task / case ID | 不包含外部路径或 raw manifest |
| `chinese_diary_title` / `chinese_diary_content` | 记忆输入 | 正文必须为中文 |
| `preserved_original` | 空值 + 占位资产引用 | 不保留敏感原文 |
| `tags` | mock preview | 不得包含 key、token、cookie、密码、私密路径或客户隐私 |
| `visibility` | 固定 `audit` | 原型阶段只保留审计草案 |
| `memory_safety` | mock safety | 固定无敏感信息和无图片二进制 |
| `promotion` | 固定 false | 不自动升级 Git 规则 |
| `final_decision` | 记忆审批 select | `should_write_to_vcp=true` 只表示写入申请被批准，不代表 DailyNote 已执行 |

## memory_completion_state_draft

该区块记录记忆写入完成态的拆分，只用于本地草案，不代表真实写入。

| 字段 | runtime prototype 来源 | 说明 |
| --- | --- | --- |
| `write_requested` | 记忆正文是否存在 | 已形成写入请求时为 `true` |
| `write_authorized` | 记忆审批 select | 只有 `approved` 时为 `true` |
| `write_performed` | no-write 完成态占位 | 本原型固定为 `false` |
| `canonical_location_verified` | no-write 完成态占位 | 本原型固定为 `false` |
| `canonical_hash_matched` | no-write 完成态占位 | 本原型固定为 `false` |
| `plugin_success_sufficient` | no-write 完成态占位 | 本原型固定为 `false`，不能把插件 success 当成完成态 |
| `boundary_cn` | runtime prototype 固定说明 | 中文边界说明，只描述本地草案边界 |

## accepted_candidate_delivery_package_draft

该区块是 Batch 2A 的 accepted candidate 交付包草案，只汇总本地可审计字段，不触发真实提交。

| 字段 | runtime prototype 来源 | 说明 |
| --- | --- | --- |
| `selected_candidate_ref` | 当前版本占位资产引用 | 只保存仓库内脱敏 ref，不保存图片二进制 |
| `sanitized_asset_hash` | `fingerprintString()` | 对候选 ref 和版本 ID 生成稳定脱敏指纹，不代表读取真实图片 |
| `review_score` / `review_score_band` | 人工评分 | 用于交付判断摘要 |
| `risk_summary_cn` | 当前候选风险标签 | 高风险标签会阻断 ready 状态 |
| `human_approval_summary` | 人工批准 checkbox | accepted 必须由人工批准 |
| `memory_delta_preview` | `memory_delta_draft` 摘要 | 只展示中文预览、审批状态和 completion_state 拆分，不写 DailyNote/VCP memory |
| `reusable_rule_summary_cn` | `image_case_seed.reusable_rules_cn` | 可复用规则中文摘要 |
| `draft_only` / `submitDraft_called` / side-effect flags | 固定 no-write 值 | 必须保持 `draft_only=true`、`submitDraft_called=false`、所有真实动作 false |

## human_override_traceability_draft

该区块是 Batch 2C 的人工覆盖轨迹，用于说明 accepted 是否来自人工覆盖接受，而不是完美 prompt compliance。

| 字段 | runtime prototype 来源 | 说明 |
| --- | --- | --- |
| `human_decision_source_cn` | 固定 `Review Console 人工评审表单` | 说明人工结论来源 |
| `override_reason_cn` | 人工批准、资产状态和偏差状态派生 | 记录是否发生人工覆盖接受 |
| `known_deviation_summary_cn` | 风险点、标注备注和风险标签 | 只保存中文脱敏摘要 |
| `prompt_compliance_complete` | 风险标签、已知偏差和评分派生 | 不能把人工接受误报为完美 prompt compliance |
| `memory_suitable` | 写入申请草案条件 | 只有人工批准、记忆审批和风险预检都通过才为 true |
| side-effect flags / `no_execution_guard` | 固定 no-write 值 | 不触发真实 submitDraft、DailyNote、VCP memory 或图片写入 |

## traceability_items / traceability_counts / traceability_summary_cn / traceability_boundary_cn

该区块是 Batch 2C 的队列级 Human Override 可追踪性矩阵。它固定包含交付包草案行和当前队列追踪行，用于本地审片、统计和验收，不代表真实执行。

| 字段 | runtime prototype 来源 | 说明 |
| --- | --- | --- |
| `traceability_items` | `buildHumanOverrideTraceabilityMatrix()` | 第一行固定为交付包草案，后续行来自队列追踪项 |
| `traceability_counts` | `buildHumanOverrideTraceabilityMatrix()` | 汇总 `accepted`、`accepted_candidate`、`human_override`、`rejected`、`needs_human_review`、`prompt_complete` 和 `memory_suitable` |
| `traceability_summary_cn` | `buildHumanOverrideTraceabilityMatrix()` | 中文统计摘要 |
| `traceability_boundary_cn` | `buildHumanOverrideTraceabilityMatrix()` | 说明该矩阵只用于本地可追踪审计，不触发真实执行 |

## inactive_authorization_capsules_draft

该区块是 Batch 3A 的未激活授权胶囊集合，只把未来高风险动作整理成可复核模板，不构成授权。

| 字段 | runtime prototype 来源 | 说明 |
| --- | --- | --- |
| `authorization_status` | 固定 `inactive_package` | 未被用户另行激活前不能执行 |
| `capsules` | `buildInactiveAuthorizationCapsulesDraft()` | 覆盖真实生图重试、记忆写入、bridge 调用、prompt 指纹捕获和版本动作 |
| `max_call_counts` | 胶囊定义 | 只描述未来授权上限，不代表当前已经允许调用 |
| `forbidden_actions_cn` / `forbidden_outputs_cn` | 胶囊定义 | 禁止 raw path、endpoint、runtime log、IPC payload、plugin output、source code、secret 和 image binary |
| `execution_flags` | 固定 false | bridge/plugin/API/DailyNote/VCP memory/image/version actions 均为 false |
| `no_execution_guard` | 固定 clean guard | 仍不触发任何真实动作 |

## runtime_review_state_draft

该区块是 Batch 3B 的状态收敛草案，用来把资产、记忆、交付和人工覆盖状态拆开解释。

| 字段 | runtime prototype 来源 | 说明 |
| --- | --- | --- |
| `convergence_status` | `buildRuntimeReviewStateDraft()` | `converged` 或 `mismatch_detected` |
| `normalized_state.asset_state_key` | 当前资产、风险和人工覆盖状态 | 只允许 `candidate`、`accepted_candidate`、`accepted_by_human_override`、`rejected`、`blocked` |
| `normalized_state.memory_status` | `memory_approval.status` | 记忆状态独立于资产状态 |
| `normalized_state.write_performed` | no-write 完成态 | 本原型必须保持 `false` |
| `mismatch_items_cn` | 状态规则检查 | 不允许写入授权被误报为写入完成，不允许人工覆盖被误报为 prompt compliance 完成 |
| `boundary_cn` | 固定中文说明 | 状态收敛不代表真实执行或 production `submitDraft` |

## local_commit_scope_plan_draft

该区块是 Batch 3C 的本地提交范围计划，只用于准备后续人工授权的 commit candidate。

| 字段 | runtime prototype 来源 | 说明 |
| --- | --- | --- |
| `plan_status` | 固定 `local_commit_scope_candidate` | 只是本地候选计划 |
| `scope_groups` | `buildLocalCommitScopePlanDraft()` | 按 runtime prototype、validators、docs/indexes、agent-board 分组 |
| `intentionally_untracked_refs` | 当前本地规划文档 | 记录预期未跟踪文档 ref |
| `staged_changes_present` | 固定 false | 本原型不执行 `git add` |
| `commit_allowed` / `tag_allowed` / `push_allowed` / `pr_allowed` / `release_allowed` | 固定 false | 版本动作仍需单独授权 |
| `rollback_guidance_cn` | 固定中文指导 | 不包含 `reset --hard` 或 `git clean` |

## bridge_mock_roundtrip_candidate_draft

该区块是 Batch 4A 的本地 bridge mock 回环候选，只证明项目内 Adapter dry-run handoff、Review Console runtime draft 和 host bridge mock `previewDraft` 之间的 no-write 交接关系。

| 字段 | runtime prototype 来源 | 说明 |
| --- | --- | --- |
| `roundtrip_status` | 固定 `mock_roundtrip_candidate` | 只表示本地候选草案 |
| `bridge_mode` | 固定 `project_local_mock` | 不连接真实 VCPChat、CDP、IPC 或 preload |
| `source_fixture_policy` | 固定 `project_local_fixtures_only` | 只使用仓库内 mock session 和 runtime draft |
| `selected_methods` | 固定 `["loadSession","previewDraft"]` | Batch 4A 只验证 seed 读取和 preview 回执 |
| `forbidden_methods` | 固定包含 `submitDraft` | production submitDraft 仍需单独授权 |
| `bridge_calls_observed` | `buildBridgeMockRoundtripCandidateDraft()` | `mock_only=true`，`loadSession=1`，`previewDraft=1`，`submitDraft=0` |
| `adapter_handoff_ref` | `adapter_dry_run_handoff_draft` 脱敏摘要 | 必须保持 `selected_plugin=null`、`max_plugin_calls=0`、`execution_blocked=true` |
| `load_session_fixture` / `preview_draft_fixture` | project-local mock 数据派生 | 不包含 raw path、endpoint、runtime log、IPC payload 或源码片段 |
| `ack_summaries` | 脱敏 ack 摘要 | 只记录方法名、ack keys、validation 标记和 no-write flags |
| side-effect flags / `no_execution_guard` | 固定 no-write 值 | 插件/API/DailyNote/VCP memory/image/CDP/production bridge 均未执行 |

## real_bridge_authorization_package_draft

该区块是 Batch 4B 的真实 bridge 授权包草案，只用于未来人工授权前复核。

| 字段 | runtime prototype 来源 | 说明 |
| --- | --- | --- |
| `authorization_status` | 固定 `inactive_package` | 本草案不能自动激活 |
| `allowed_methods` | 固定 `cancel` / `loadSession` / `previewDraft` | 未来真实 bridge smoke 的 allowlist |
| `forbidden_methods` | 固定包含 `submitDraft` | production submit 语义仍需单独授权 |
| `target_root_refs.raw_path_stored` | 固定 false | 真实 root 只能在执行授权消息中提供，不写入仓库 |
| `required_authorization_fields` | `buildRealBridgeAuthorizationPackageDraft()` | 未来授权必须包含 mode、root ref、方法、最大调用、脱敏规则和回滚计划 |
| `execution_authorized_by_this_record` | 固定 false | 本记录不授权执行 |
| `production_bridge_invocation_performed` / `real_cdp_called` / `source_read_performed` | 固定 false | 不启动 VCPChat、不连接 CDP、不读真实源码 |

## plugin_reliability_prompt_discipline_draft

该区块是 Batch 5A 的插件可靠性与 prompt discipline 草案，用于把真实生图失败转化为可复核规则。

| 字段 | runtime prototype 来源 | 说明 |
| --- | --- | --- |
| `reliability_status` | 固定 `local_prompt_reliability_candidate` | 只表示本地 prompt reliability 候选 |
| `prompt_registry_status` | 固定 `local_registry_candidate` | 只表示本地 registry 候选 |
| `prompt_families` | `buildPluginReliabilityPromptDisciplineDraft()` | 当前覆盖 Photo Studio OS 正向静物无文字 prompt 家族 |
| `prompt_hash` | `fingerprintString()` | 用稳定脱敏输入生成本地指纹 |
| `model_lock` | 固定 DoubaoGen / requested model | 记录请求模型，插件报告模型未观测 |
| `lint_result` | 本地规则统计 | 只定义规则，不执行 prompt |
| `failure_taxonomy` | 固定四类 | prompt 设计失败、模型遵循失败、插件传参失败、provider 侧未知 |
| `provider_side_capture.authorization_status` | 固定 `inactive_package` | provider-side 指纹捕获需另行授权 |
| `max_plugin_calls_allowed` | 固定 0 | Batch 5A 不调用插件、不生成图片 |

## memory_write_completion_candidate_draft

该区块是 Batch 6A 的记忆写入完成候选，用于防止把插件 success 或写入申请误当完成态。

| 字段 | runtime prototype 来源 | 说明 |
| --- | --- | --- |
| `candidate_status` | 固定 `memory_write_completion_preflight_candidate` | 只表示本地完成判定候选 |
| `completion_required_sequence` | 固定五步 | request、authorization、writer、canonical exists、hash match |
| `observed_state` | 当前 no-write runtime 状态 | writer 和 canonical 校验都保持 false |
| `completion_criteria.plugin_success_sufficient` | 固定 false | 插件 success 不是充分条件 |
| `wrong_location_classification` | 固定 `plugin_success_wrong_location` | success 但 canonical 位置错误时不能完成 |
| `failure_closeout_template_cn` | 中文 closeout 模板 | 失败时不得伪造 memory write complete |
| `daily_note_called` / `vcp_memory_written` / `write_complete_declared` | 固定 false | Batch 6A 不写 DailyNote/VCP memory |

## single_real_generation_retry_gate_draft

该区块是 Batch 5B 的单次真实生图重试授权门草案，只用于未来人工授权前复核。

| 字段 | runtime prototype 来源 | 说明 |
| --- | --- | --- |
| `gate_status` | 固定 `single_real_generation_retry_gate_inactive` | 授权门保持未激活 |
| `authorization_status` | 固定 `inactive_package` | 本草案不能自动激活 |
| `selected_plugin_id` / `selected_plugin_command` | 固定 DoubaoGen / generate | 未来真实重试只允许单插件单命令 |
| `requested_model` | 继承 prompt discipline model lock | 固定 `doubao-seedream-5-0-260128` |
| `prompt_family_ref` / `prompt_hash` | `plugin_reliability_prompt_discipline_draft` | 真实调用前必须复核 hash |
| `max_plugin_calls_per_run` | 固定 1 | 只表示未来授权上限 |
| `plugin_calls_observed` | 固定 0 | 当前不调用插件 |
| `output_directory_policy` | 固定受控 ref 策略 | `raw_path_stored=false` 且禁止 overwrite |
| `future_run_summary_schema` | 固定字段约束 | 未来只接收 output ref、hash、调用次数和脱敏摘要，不保存 raw plugin output |
| `memory_write_block` | 固定阻断 | 本记录不允许直接写 DailyNote/VCP memory |
| side-effect flags / `no_execution_guard` | 固定 no-write 值 | 插件/API/image/DailyNote/VCP memory 均未执行 |

## real_memory_write_authorization_package_draft

该区块是 Batch 6B 的真实记忆写入授权包草案，只准备未来单写授权，不执行写入。

| 字段 | runtime prototype 来源 | 说明 |
| --- | --- | --- |
| `authorization_status` | 固定 `inactive_package` | 未激活前不能写入 |
| `max_daily_note_writes` / `max_vcp_memory_writes` | 固定 1 / 1 | 每类最多一次 |
| `max_retry_attempts` | 固定 1 | 失败后最多一次安全重试，更多重试需另行授权 |
| `target_refs.raw_path_stored` | 固定 false | 只保存 notebook/category ref，不保存 raw 私密路径 |
| `content_rules_cn` | 固定中文规则 | 正文必须中文脱敏，不含敏感值或图片二进制 |
| `reject_path_cn` | 固定拒绝路径 | 非中文、未脱敏、缺 canonical ref 或写入失败均拒绝完成 |
| `no_success_fabrication_rule` | 固定 true | 不得伪造写入成功 |
| `completion_preflight_ref` | `memory_write_completion_candidate_draft` 摘要 | 继续保持 `plugin_success_sufficient=false` |
| `daily_note_called` / `vcp_memory_written` / `write_complete_declared` | 固定 false | Batch 6B 不写 DailyNote/VCP memory |

## asset_archive_candidate_draft

该区块是 Batch 7A 的资产归档候选草案，只保存 metadata，不保存二进制。

| 字段 | runtime prototype 来源 | 说明 |
| --- | --- | --- |
| `archive_status` | 固定 `asset_archive_candidate_no_binary` | 只表示 no-binary 归档候选 |
| `archive_policy` | 固定 `metadata_only_no_binary` | 只保存元数据 |
| `output_path_ref` | 当前版本占位 ref | 不保存 raw 输出路径 |
| `asset_hash` | 交付包脱敏 hash | 本地稳定指纹，不读取图片文件 |
| `review_score` / `review_score_band` | 人工评分 | 归档评分摘要 |
| `asset_status_classification` | 当前资产/人工/风险状态派生 | 只允许 accepted_candidate、needs_human_review、rejected |
| `archived_fields` | 固定字段清单 | 只包含 ref、hash、score、summary、rules、human override reason |
| `closeout_templates` | 固定三类模板 | accepted_candidate、needs_human_review、rejected 使用不同 closeout |
| `binary_storage_allowed` / `git_binary_stored` / `memory_binary_stored` | 固定 false | 不把图片二进制写入 Git、DailyNote 或 VCP memory |

## Prototype Guard

草案输出必须保持：

```yaml
prototype_guard:
  api_called: false
  daily_note_called: false
  vcp_plugin_called: false
  disk_write_performed: false
  image_file_created: false
```

该 guard 是验收证据，不是运行时权限授予。

v3.9 起，`runtime_guard.js` 是 renderer、host mock 和 smoke test 共用的 guard 规则来源。它统一检查：

- 顶层 `prototype_guard` 必须保持全 false。
- `review_session_draft.audit_log[0].prototype_guard` 必须保持全 false。
- `image_case_draft.asset_status=accepted` 时必须有 `human_approval.approved=true`。
- `memory_delta_draft.final_decision.should_write_to_vcp=true` 时必须有 `approval_status=approved`。

该共享模块不代表真实 VCPChat preload、IPC handler 或 DailyNote 写入已经存在。

## Host Submit Ack / Preview Ack

v3.7 runtime patch 增加 host bridge mock 回执。Batch 4A 后页面默认通过 `previewDraft()` 取得 no-write 预览回执；`submitDraft()` 仍保留为 mock 负向校验入口，不代表 production submit 语义已经授权。

| ack 字段 | 来源 | 说明 |
| --- | --- | --- |
| `selected_method` | `host_bridge_mock.previewDraft()` / `submitDraft()` | 当前 mock 方法名 |
| `accepted_by_host_mock` | `host_bridge_mock.previewDraft()` / `submitDraft()` | 只有草案包含必需 draft、guard 清洁、accepted 有人工审批、memory write 有审批时才为 true |
| `draft_received` | `host_bridge_mock.previewDraft()` / `submitDraft()` | 只表示 mock 收到了草案对象 |
| `validation_passed` | `host_bridge_mock.draftIsSafe()` | host mock 的二次安全检查 |
| `bridge_calls_observed` | host mock 回执 | 只记录 mock 方法调用计数；production `submitDraft` 固定为 0 |
| `side_effects_performed` | 固定 false | mock 不写磁盘、不调用外部系统 |
| `received_at` | host mock 当前时间 | 仅用于 UI 状态展示 |
| `status_cn` | host mock 中文摘要 | 脱敏中文回执，不包含路径、源码或敏感信息 |

Host ack 不代表真实 VCPChat 接入、不代表 IPC handler 已创建、不代表 DailyNote 已写入。

## v6_product_runtime_draft.task_panel

| 字段 | 来源 | 说明 |
| --- | --- | --- |
| `task_id` | `buildV6ProductRuntimeDraft()` | 自动生成或关联 review session |
| `visual_goal_cn` | `v6TaskGoalInput` | 用户输入，中文视觉目标，max 200 字 |
| `current_stage` | `v6TaskStageSelect` | draft / planning / in_review / blocked / completed |
| `owner_role` | `v6TaskOwnerSelect` | ImageLab_Master / Prompt_Designer / Gatekeeper / Archivist_Agent / Human |
| `next_action` | `v6TaskNextInput` | 用户输入，下一步动作描述 |
| `blocked_reason_cn` | `v6TaskBlockedInput` | blocked 状态时必填，否则可为 null |
| `linked_review_session_id` | `v6TaskSessionInput` | 关联 Review Session，默认自动匹配 |
| `draft_only` | 固定 true | 所有 v6 draft 保持 draft_only |
| `side_effects_performed` | 固定 false | 不写磁盘、不调用外部系统 |
| `no_execution_guard` | `runtimeGuard.clone(cleanGuard)` | 5 个 flag 全部 false |

v6 Task Panel 保持在 no-execution 边界内，不触发真实插件、API、DailyNote 或 VCP memory。

## v6_product_runtime_draft.asset_index

| 字段 | 来源 | 说明 |
| --- | --- | --- |
| `draft_only` | 固定 `true` | 所有 asset index 操作保持 draft_only |
| `side_effects_performed` | 固定 `false` | 不触发真实副作用 |
| `no_execution_guard` | `runtimeGuard.clone(cleanGuard)` | 5 个 flag 全部 false |
| `filter_status` | `v6AssetFilterSelect` | all / accepted_candidate / needs_human_review / rejected / memory_suitable |
| `entries[].asset_id` | 固定 `draft-001` | 当前只支持 1 个 primary entry |
| `entries[].asset_ref` | `v6AssetRefInput` | 手写资产引用，不允许 raw local absolute path |
| `entries[].asset_hash` | `v6AssetHashInput` | 脱敏字符串或 null，不能读取真实图片生成 |
| `entries[].asset_status` | `v6AssetStatusSelect` | draft / accepted_candidate / needs_human_review / rejected |
| `entries[].review_score` | `v6AssetScoreInput` | 0-100 或 null |
| `entries[].human_decision` | `v6AssetDecisionSelect` | pending / accepted / rejected / needs_review |
| `entries[].memory_suitability` | `v6AssetMemorySelect` | not_evaluated / suitable / unsuitable |
| `entries[].linked_case_id` | `v6AssetCaseInput` | 关联 case ID |
| `entries[].linked_task_id` | session task_id | 自动关联当前 task |
| `entries[].source` | 固定 `manual_draft` | 当前只支持手动草案 |
| `entries[].binary_stored` | 固定 `false` | 不存储图片二进制 |
| `entries[].raw_path_stored` | 固定 `false` | 不存储原始路径 |
| `entries[].created_at` / `updated_at` | `buildV6ProductRuntimeDraft()` | ISO 时间 |

筛选交互：`filter_status` 改变后，UI 显示匹配条目数和可见计数。当前 1 个 primary entry，代码为未来多 entry 扩展保留了 entries 数组结构。

## v6_product_runtime_draft.session_store

| 字段 | 来源 | 说明 |
| --- | --- | --- |
| `session_id` | `buildV6ProductRuntimeDraft()` | 自动生成或关联 review session |
| `fingerprint` | 固定 `null` | 当前草案阶段无真实指纹 |
| `draft_only` | 固定 `true` | 所有 session store 操作保持 draft_only |
| `side_effects_performed` | 固定 `false` | 不触发真实副作用 |
| `no_execution_guard` | `runtimeGuard.clone(cleanGuard)` | 5 个 flag 全部 false |
| `current_session.session_id` | 自动生成 | 当前会话 ID |
| `current_session.fingerprint` | 固定 `null` | 指纹待计算 |
| `current_session.linked_task_id` | `v6SessionTaskIdInput` | 关联任务 ID，默认自动匹配 |
| `current_session.linked_asset_refs` | `v6SessionAssetRefsInput` | 逗号分隔的资产引用列表 |
| `current_session.export_ready` | 固定 `true` | 当前草案可导出 |
| `current_session.import_compatible` | 固定 `true` | 当前草案兼容导入 |
| `current_session.restore_candidate` | `v6SessionRestoreCheck` | 是否标记为恢复候选 |
| `current_session.created_at` / `updated_at` | `buildV6ProductRuntimeDraft()` | ISO 时间 |
| `import_preview.status` | `v6SessionImportStatusSelect` | not_loaded / valid / stale / tampered / incompatible |
| `import_preview.reason_cn` | `v6SessionReasonInput` | 导入预览状态中文说明 |
| `import_preview.candidate_session_id` | 固定 `null` | 当前草案无候选会话 |
| `import_preview.candidate_fingerprint` | 固定 `null` | 当前草案无候选指纹 |
| `import_preview.side_effects_performed` | 固定 `false` | 导入预览不触发副作用 |
| `session_list.entries[].session_id` | 当前会话 ID | 1 个 primary entry，数组结构为未来扩展保留 |
| `session_list.entries[].linked_task_id` | linked_task_id | 关联任务 ID |
| `session_list.entries[].linked_asset_refs` | linked_asset_refs | 关联资产引用列表 |
| `session_list.entries[].source` | 固定 `current_runtime` | 当前只支持 current_runtime |
| `session_list.entries[].restore_candidate` | restore_candidate | 恢复候选标记 |
| `session_list.entries[].stale` / `tampered` / `incompatible` | 固定 `false` | 当前草案无篡改或过期标记 |
| `session_list.entries[].raw_payload_stored` | 固定 `false` | 不存储原始载荷 |
| `session_list.entries[].disk_write_performed` | 固定 `false` | 不写入磁盘 |
| `session_list.total_entries` / `visible_count` | 固定 `1` / `1` | 当前 1 个 primary entry |
| `boundary_cn` | 固定中文说明 | 所有变更保持 draft_only，raw_payload_stored=false，disk_write_performed=false |

## v6_product_runtime_draft.memory_queue

| 字段 | 来源 | 说明 |
| --- | --- | --- |
| `draft_only` | 固定 `true` | 所有 memory queue 操作保持 draft_only |
| `side_effects_performed` | 固定 `false` | 不触发真实副作用 |
| `no_execution_guard` | `runtimeGuard.clone(cleanGuard)` | 5 个 flag 全部 false |
| `queue_status` | 固定 `draft_queue` | 草案队列状态 |
| `entries[].memory_item_id` | `v6MQMemoryItemId` | 自动生成或只读 |
| `entries[].linked_task_id` | `v6MQLinkedTaskId` | 关联 Task ID |
| `entries[].linked_asset_ref` | `v6MQLinkedAssetRef` | 关联资产引用 |
| `entries[].linked_session_id` | `v6MQLinkedSessionId` | 关联 Session ID |
| `entries[].chinese_diary_title` | `v6MQDiaryTitle` | 中文日记标题 |
| `entries[].chinese_diary_content_preview` | `v6MQDiaryPreview` | 中文日记正文预览 |
| `entries[].approval_status` | `v6MQApprovalSelect` | pending / approved / rejected / blocked |
| `entries[].reviewer_role` | `v6MQReviewerRoleSelect` | ImageLab_Master / Archivist_Agent / Gatekeeper / Human |
| `entries[].should_write_to_vcp` | `v6MQShouldWriteCheck` | 未来写入申请意图，不代表已写入 |
| `entries[].write_authorized` | 固定 `false` | 不授予写入授权 |
| `entries[].write_performed` | 固定 `false` | 不执行写入 |
| `entries[].canonical_location_verified` | 固定 `false` | 不校验 canonical 位置 |
| `entries[].canonical_hash_matched` | 固定 `false` | 不匹配 hash |
| `entries[].block_reason_cn` | `v6MQBlockReasonInput` | blocked 状态时必填 |
| `entries[].reject_reason_cn` | `v6MQRejectReasonInput` | rejected 状态时必填 |
| `entries[].contains_secret` | 固定 `false` | 不包含 secret |
| `entries[].contains_private_path` | 固定 `false` | 不包含私密路径 |
| `entries[].contains_customer_private_data` | 固定 `false` | 不包含客户隐私数据 |
| `entries[].image_binary_included` | 固定 `false` | 不包含图片二进制 |
| `entries[].raw_payload_stored` | 固定 `false` | 不存储原始载荷 |
| `entries[].created_at` / `updated_at` | `buildV6ProductRuntimeDraft()` | ISO 时间 |
| `counts.total` / `pending` / `approved` / `rejected` / `blocked` | approval_status 派生 | 当前 1 个 primary entry |
| `boundary_cn` | 固定中文说明 | 所有行为保持 draft_only / no-execution |

交互要求：
1. 修改 approval_status 后，draft 输出同步变化
2. 修改 reviewer_role 后，draft 输出同步变化
3. 修改 should_write_to_vcp 后，draft 输出同步变化，但 write_authorized/write_performed 仍必须 false
4. blocked 状态必须有 block_reason_cn
5. rejected 状态必须有 reject_reason_cn
6. approved 状态可以 should_write_to_vcp=true，但仍不代表真实写入
7. queue counts 至少能反映 primary item 当前状态

## dispatch_plan_draft

该区块是 v6.8 Plugin Dashboard 的调度计划草案。所有字段保持 draft_only / no-execution。

| 字段 | runtime prototype 来源 | 说明 |
| --- | --- | --- |
| `draft_only` | 固定 true | 本区块不授权执行 |
| `side_effects_performed` | 固定 false | 本区块无副作用 |
| `dispatch_id` | `buildV6ProductRuntimeDraft()` | 自动生成 `dispatch-{timestamp}` |
| `linked_task_id` | `els.v6DispatchLinkedTaskId` | 关联 Task Panel task_id |
| `selected_plugin.plugin_id` | `els.v6DispatchSelectPlugin` | 从本地草案候选选择 |
| `selected_plugin.display_name` | `els.v6DispatchPluginName` | 插件显示名 |
| `selected_plugin.input_mode` | 固定 fixture 值 | 不读真实 plugin-manifest |
| `selected_plugin.output_mode` | 固定 fixture 值 | 不读真实 plugin-manifest |
| `selected_plugin.source` | 固定 `local_draft_fixture` | 非真实 PluginDir |
| `selected_plugin.real_manifest_loaded` | 固定 false | 不加载真实 manifest |
| `selected_plugin.real_plugin_available_confirmed` | 固定 false | 不确认真实插件可用性 |
| `fallback_plugins[]` | `pluginCandidates` 过滤当前选中 | 所有来源固定 `local_draft_fixture` |
| `reason_cn` | `els.v6DispatchReasonCn` | 中文选择理由 |
| `parameters[].key` | `els.v6DispatchParamKey` | 参数键 |
| `parameters[].value_preview` | `els.v6DispatchParamValue` | 参数值草案（非真实参数） |
| `parameters[].value_source` | 固定 `manual_draft` | 非真实配置 |
| `parameters[].raw_secret_stored` | 固定 false | 不存秘密 |
| `parameters[].raw_endpoint_stored` | 固定 false | 不存端点 |
| `parameters[].raw_path_stored` | 固定 false | 不存路径 |
| `expected_outputs` | `els.v6DispatchExpectedOutputs` | 预期输出数量 |
| `max_outputs` | `els.v6DispatchMaxOutputs` | 最大输出数量 |
| `dry_run_required` | 固定 true | 不可更改 |
| `execution_blocked` | 固定 true | 不可更改 |
| `max_plugin_calls` | 固定 0 | 不可更改 |
| `allow_file_write` | 固定 false | 不可更改 |
| `allow_image_binary` | 固定 false | 不可更改 |
| `risk_level` | 固定 `low` | 可扩展 |
| `gatekeeper_required` | 固定 true | Gatekeeper 必须审查 |
| `gatekeeper_status` | `els.v6DispatchGatekeeperStatus` | required / pending / reviewed / blocked |
| `dispatch_status` | `els.v6DispatchStatus` | draft / mapped / blocked / ready_for_human_review |
| `trace_state` | `els.v6DispatchTraceState` | dispatch_draft / plan_draft / review_draft |
| `forbidden_actions` | 固定清单 | execute / generate / run / call_plugin / write_memory / write_image_file |
| `boundary_cn` | 固定中文描述 | 说明 no-execution 边界 |

交互要求：
1. 修改 selected_plugin 后，fallback_plugins 自动过滤
2. 修改 param key/value 后，preview 同步更新
3. 所有安全字段（dry_run_required / execution_blocked / max_plugin_calls 等）只读，不可被用户解除
4. 不读取真实 PluginDir / plugin-manifest.json
5. `ready_for_human_review` 不代表可执行，只代表可进入人工复核

## release_readiness_draft

该区块是 v6.9A Release Panel 的发布准备状态草案。所有字段保持 draft_only / no-execution。

| 字段 | runtime prototype 来源 | 说明 |
| --- | --- | --- |
| `draft_only` | 固定 true | 本区块不授权发布 |
| `side_effects_performed` | 固定 false | 无副作用 |
| `current_commit` | `els.v6ReleaseCurrentCommit` | 当前 commit 草案输入 |
| `baseline_commit` | `els.v6ReleaseBaselineCommit` | 基线 commit 草案输入 |
| `candidate_label` | `els.v6ReleaseCandidateLabel` | 候选标签草案 |
| `validator_status.v6_9` | `els.v6ReleaseV6_9` | pending/passed/failed |
| `validator_status.v6_8` | `els.v6ReleaseV6_8` | pending/passed/failed |
| `validator_status.v6_7` | `els.v6ReleaseV6_7` | pending/passed/failed |
| `validator_status.runtime_suite` | `els.v6ReleaseRuntimeSuite` | pending/passed/failed |
| `validator_status.validate_mvp` | `els.v6ReleaseValidateMvp` | pending/passed/failed |
| `dirty_tree_status` | `els.v6ReleaseDirtyTree` | clean/dirty/unknown |
| `release_notes_status` | `els.v6ReleaseNotesStatus` | draft/ready/missing |
| `tag_candidate` | `els.v6ReleaseTagCandidate` | 候选 tag 草案 |
| `push_allowed` | 固定 false | 不可更改 |
| `tag_allowed` | 固定 false | 不可更改 |
| `release_allowed` | 固定 false | 不可更改 |
| `github_release_allowed` | 固定 false | 不可更改 |
| `deploy_allowed` | 固定 false | 不可更改 |
| `a5_production_execution_allowed` | 固定 false | 不可更改 |
| `boundary_cn` | 固定中文描述 | push/tag/release/deploy/A5 均被禁止 |

交互要求：
1. 所有安全字段（push/tag/release/github_release/deploy/A5）只读，不可被用户解除
2. 不运行真实 git 命令
3. 不调用 GitHub API
4. 不创建 tag/release
