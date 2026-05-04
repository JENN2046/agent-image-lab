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
