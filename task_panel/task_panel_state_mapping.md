# Task Panel State Mapping

本文说明 v1.5 Task Panel 如何从现有 schema、样例和草案记录映射出统一状态。它只描述字段关系，不实现 UI，不读取外部仓库，不调用插件、API、DailyNote 或文件系统。

## Source Records

| 来源 | Task Panel 区块 | 说明 |
| --- | --- | --- |
| `schemas/task_envelope.schema.yaml` | `task_status` | 任务目标、task_id、case_id、来源 Agent |
| `schemas/dispatch_plan.schema.yaml` | `dispatch_status` | dry-run、execution_blocked、max_plugin_calls、禁止动作 |
| `schemas/review_session.schema.yaml` | `review_status` | ai_review、human_review、final_review、approval、archive_decision |
| `schemas/memory_delta.schema.yaml` | `memory_status` | write_mode、approval_status、should_write_to_vcp、DailyNote 边界 |
| `schemas/image_case.schema.yaml` | `asset_status` | asset_state、human_approval、资产引用 |
| `integrations/vcp/v1_4_multi_plugin_candidate_evaluation.md` | `plugin_candidate_status` | 候选数量、manifest 授权状态、真实执行状态 |
| `tests/schema_examples/v1_4_candidate_decision_packet.example.yaml` | `gatekeeper_status` | risk_level、blocked_until_human_review、禁止动作 |

## Mapping Rules

### task_status

- `task_id` 来自 `task_envelope.task_id` 或当前 review session。
- `case_id` 来自 `task_envelope.case_id`、`image_case.case_id` 或 review session。
- `task_goal_cn` 必须是中文摘要，不复制客户隐私。
- `current_step` 使用当前阶段，例如 `v1.5_task_panel_status_backbone`。

### dispatch_status

- `dry_run_required` 必须保持 true。
- `execution_blocked` 必须保持 true。
- `external_api_allowed` 必须保持 false。
- `max_plugin_calls` 必须保持 0。
- `forbidden_actions` 至少包含执行插件、调用 API、写 DailyNote、创建图片和写文件。

### review_status

- `ai_review_available` 只表示 AI 建议存在。
- `human_review_available` 决定 `final_review_source` 是否可以是 `human_review`。
- `human_review_overrides_ai` 必须为 true。
- `accepted_requires_human_approval` 必须为 true。

### memory_status

- `should_write_to_vcp=true` 只表示写入申请，不代表已写入。
- `daily_note_write_authorized` 在 v1.5 必须为 false。
- `daily_note_called` 在 v1.5 必须为 false。
- 如果 `write_mode=confirmed`，仍必须展示后续 Archivist_Agent 和 ImageLab_Master 复查状态。

### asset_status

- `asset_ref` 只能是路径引用或占位引用。
- `asset_sha256` 可为空，后续 v1.6 再完善资产索引。
- `asset_state=accepted` 时必须有 `human_approval.approved=true`。
- `image_binary_saved` 必须为 false。

### plugin_candidate_status

- `selected_plugin` 在本阶段必须为 null。
- `manifest_read_count` 只能统计已授权的脱敏读取记录，不得批量读取。
- `real_execution_allowed` 必须为 false。
- `tested` 不代表真实执行授权。

### gatekeeper_status

- `risk_level` 可以是 `low`、`medium`、`high`、`blocked` 或 `unknown`。
- `execution_blocked` 应在需要授权时保持 true。
- `blocker_cn` 必须是中文脱敏说明。

### next_authorization_point

下一授权点必须写清：

- 授权动作名称。
- 为什么需要授权。
- 授权前必须满足什么。
- 授权后最多允许进入什么状态。
- 当前仍禁止什么。

## No-execution Guard

Task Panel 状态必须始终包含：

```yaml
no_execution_guard:
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  file_write_performed: false
  image_file_created: false
  real_manifest_read: false
  real_execution_allowed: false
  max_plugin_calls: 0
```

该 guard 只是状态证据，不是权限授予。
