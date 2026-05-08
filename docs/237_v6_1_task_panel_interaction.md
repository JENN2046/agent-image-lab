# v6.1 Task Panel Interaction Implementation

在已有 Review Console 审片台上实现 Task Panel 的本地交互能力。

```yaml
v6_1:
  status: completed
  timestamp: "2026-05-08"
  phase: "v6.1 Task Panel Interaction"
  mode: "A4.5 Smart Local Autopilot"
  real_execution: false
```

## Implemented

| Feature | Input | Behavior |
| --- | --- | --- |
| 创建本地任务草案 | `v6TaskGoalInput` | visual_goal_cn 写入 draft |
| 编辑视觉目标 | `v6TaskGoalInput` (text, max 200) | 实时反映到 task_panel.visual_goal_cn |
| 切换阶段 | `v6TaskStageSelect` (draft/planning/in_review/blocked/completed) | 切换 current_stage |
| 编辑角色 | `v6TaskOwnerSelect` (5 roles) | 切换 owner_role |
| 编辑下一步 | `v6TaskNextInput` (text, max 200) | 反映到 next_action |
| 设置阻断原因 | `v6TaskBlockedInput` (text, max 200) | blocked 状态时必填 |
| 关联 Session | `v6TaskSessionInput` (text, max 64) | 自定义或自动匹配当前 session |

## Guard Rules

```yaml
guard:
  - "task_panel 必须存在"
  - "draft_only 必须为 true"
  - "side_effects_performed 必须为 false"
  - "no_execution_guard 必须 clean"
  - "current_stage 只能来自 [draft, planning, in_review, blocked, completed]"
  - "visual_goal_cn 必须是 string"
  - "blocked 状态必须有 blocked_reason_cn"
  - "非 blocked 状态可以 blocked_reason_cn=null"
```

## Files Changed

| File | Change |
| --- | --- |
| `index.html` | v6TaskPanel article replaced with interactive form (6 inputs/selects, 1 readout dl) |
| `app.js` | buildV6ProductRuntimeDraft reads from form DOM; renderV6ProductRuntime syncs form; new DOM refs |
| `runtime_guard.js` | v6ProductRuntimeIsSafe() + assertion in assertDraftSafe/draftIsSafe |
| `validate_runtime_prototype_smoke.js` | v6.1 interaction assertions (edit goal, switch stage, set blocked, reset) |
| `validate_v6_1_task_panel_interaction.js` | New validator (9 checks) |
| `FIELD_MAPPING.md` | task_panel field mapping |
| `docs/237_v6_1_task_panel_interaction.md` | This doc |

## Boundary

```yaml
boundary:
  draft_only: true
  no_execution: true
  no_plugin: true
  no_api: true
  no_dailynote: true
  no_vcp_memory: true
  no_image: true
  no_vcpchat_read: true
  no_vcptoolbox_read: true
```
