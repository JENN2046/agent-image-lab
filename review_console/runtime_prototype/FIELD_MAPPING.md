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

## Host Submit Ack

v3.7 runtime patch 增加 host bridge mock 回执。该回执不是核心 schema 字段，只用于证明浏览器原型把草案交给受控 host mock 前后都保持无副作用。

| ack 字段 | 来源 | 说明 |
| --- | --- | --- |
| `accepted_by_host_mock` | `host_bridge_mock.submitDraft()` | 只有草案包含三份 draft、guard 清洁、accepted 有人工审批、memory write 有审批时才为 true |
| `draft_received` | `host_bridge_mock.submitDraft()` | 只表示 mock 收到了草案对象 |
| `validation_passed` | `host_bridge_mock.draftIsSafe()` | host mock 的二次安全检查 |
| `side_effects_performed` | 固定 false | mock 不写磁盘、不调用外部系统 |
| `received_at` | host mock 当前时间 | 仅用于 UI 状态展示 |
| `status_cn` | host mock 中文摘要 | 脱敏中文回执，不包含路径、源码或敏感信息 |

Host ack 不代表真实 VCPChat 接入、不代表 IPC handler 已创建、不代表 DailyNote 已写入。
