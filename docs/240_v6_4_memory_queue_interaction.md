# v6.4 Memory Queue Interaction Implementation

## 任务标识

- **Task Name**: v6.4 Memory Queue Interaction Implementation
- **Phase**: v6.4
- **Status**: completed
- **Date**: 2026-05-09
- **Branch**: master
- **Base Commit**: 823c122

## 目标

在现有 Review Console + v6 Product Runtime 上，实现 Memory Queue 的本地交互草案层。

让 `memory_delta_draft` 从单条草案，升级为一个可以排队、审批、拒绝、阻断、追踪的 **draft-only 记忆队列**。

## 范围

### 已实现

1. Memory Queue 草案结构
2. queue entries，支持 1 个 primary memory item
3. memory_item_id / linked_task_id / linked_asset_ref / linked_session_id
4. chinese_diary_title / chinese_diary_content_preview
5. approval_status 切换: pending / approved / rejected / blocked
6. reviewer_role 切换: ImageLab_Master / Archivist_Agent / Gatekeeper / Human
7. block_reason_cn / reject_reason_cn 输入
8. should_write_to_vcp 作为"未来写入申请意图"
9. write_authorized=false / write_performed=false / canonical_location_verified=false
10. queue counts: total / pending / approved / rejected / blocked
11. Memory Queue 状态进入 v6_product_runtime_draft.memory_queue
12. runtime_guard v6MemoryQueueIsSafe 校验
13. validator validate_v6_4_memory_queue_interaction.js
14. 所有行为保持 draft_only / no-execution

### 未实现（禁止）

- 真实 DailyNote 写入
- 真实 VCP memory 写入
- canonical file 校验
- hash 校验
- 多条复杂队列批量操作
- Memory write authorization execution
- Plugin Dashboard / Release Panel / real bridge submitDraft

## 数据结构

```yaml
v6_product_runtime_draft:
  memory_queue:
    draft_only: true
    side_effects_performed: false
    no_execution_guard:
      api_called: false
      daily_note_called: false
      vcp_plugin_called: false
      disk_write_performed: false
      image_file_created: false
    queue_status: draft_queue
    entries:
      - memory_item_id: string
        linked_task_id: string | null
        linked_asset_ref: string | null
        linked_session_id: string | null
        chinese_diary_title: string
        chinese_diary_content_preview: string
        approval_status: pending | approved | rejected | blocked
        reviewer_role: ImageLab_Master | Archivist_Agent | Gatekeeper | Human
        should_write_to_vcp: boolean
        write_authorized: false
        write_performed: false
        canonical_location_verified: false
        canonical_hash_matched: false
        block_reason_cn: string | null
        reject_reason_cn: string | null
        contains_secret: false
        contains_private_path: false
        contains_customer_private_data: false
        image_binary_included: false
        raw_payload_stored: false
        created_at: string
        updated_at: string
    counts:
      total: number
      pending: number
      approved: number
      rejected: number
      blocked: number
    boundary_cn: string
```

## 字段铁律

```text
draft_only 必须永远 true
side_effects_performed 必须永远 false
write_authorized 必须永远 false
write_performed 必须永远 false
canonical_location_verified 必须永远 false
canonical_hash_matched 必须永远 false
contains_secret 必须永远 false
contains_private_path 必须永远 false
contains_customer_private_data 必须永远 false
image_binary_included 必须永远 false
raw_payload_stored 必须永远 false
should_write_to_vcp=true 只代表"未来写入申请意图"，不代表授权或执行
```

## UI 实现

在 v6 Product Runtime section 内新增 Memory Queue 区块，包含：

- memory_item_id display (readonly)
- linked_task_id / linked_asset_ref / linked_session_id inputs
- chinese_diary_title input
- chinese_diary_content_preview textarea
- approval_status select (pending/approved/rejected/blocked)
- reviewer_role select (ImageLab_Master/Archivist_Agent/Gatekeeper/Human)
- should_write_to_vcp checkbox
- block_reason_cn input
- reject_reason_cn input
- queue counts display (total/pending/approved/rejected/blocked)
- draft boundary text

## Guard 实现

v6MemoryQueueIsSafe() 校验:
- memory_queue 存在
- draft_only === true
- side_effects_performed === false
- no_execution_guard clean
- entries 是数组
- approval_status 来自允许枚举
- reviewer_role 来自允许枚举
- write_authorized/write_performed 为 false
- canonical_location_verified/hash_matched 为 false
- contains_secret/contains_private_path/contains_customer_private_data 为 false
- image_binary_included/raw_payload_stored 为 false
- blocked 状态必须有 block_reason_cn
- rejected 状态必须有 reject_reason_cn
- should_write_to_vcp 不得触发真实写入标志

已纳入 v6ProductRuntimeIsSafe / draftIsSafe / assertDraftSafe。

## 修改文件

- `review_console/runtime_prototype/app.js` — builder + renderer + event listeners
- `review_console/runtime_prototype/index.html` — DOM elements
- `review_console/runtime_prototype/styles.css` — styles
- `review_console/runtime_prototype/runtime_guard.js` — v6MemoryQueueIsSafe + enums
- `review_console/runtime_prototype/FIELD_MAPPING.md` — field mapping

## 新增文件

- `docs/240_v6_4_memory_queue_interaction.md` — 本设计文档
- `scripts/validate_v6_4_memory_queue_interaction.js` — validator
- `tests/schema_examples/v6_4_memory_queue_interaction.example.yaml` — example

## 验证

```powershell
node --check review_console/runtime_prototype/app.js
node --check review_console/runtime_prototype/runtime_guard.js
node scripts/validate_v6_4_memory_queue_interaction.js
node scripts/validate_v6_3_session_store_interaction.js
node scripts/validate_v6_2_asset_index_interaction.js
node scripts/validate_v6_1_task_panel_interaction.js
node scripts/validate_v6_0_product_runtime_kickoff.js
node scripts/validate_runtime_prototype_smoke.js
node scripts/validate_runtime_prototype_suite.js
node scripts/validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
```
