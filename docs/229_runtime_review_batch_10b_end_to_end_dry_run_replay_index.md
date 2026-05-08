# Runtime Review Batch 10B End-To-End Dry-Run Replay Index

本文把 Adapter dry-run → Review Console → mock bridge preview → memory_delta draft 的完整回放路径做成可索引、可校验的本地链。目标是让任意未来 agent 在不接触真实 VCPChat、VCPToolBox、DoubaoGen、DailyNote 或 VCP memory 的前提下，从项目本地 fixture 一路重放到 session export。

本批只补文档和 validator，不修改真实 VCPChat / VCPToolBox，不调用 bridge / CDP / 插件 / API / DailyNote，不写 VCP memory，不创建图片，也不执行版本动作。

## Replay Index

```yaml
runtime_review_batch_10b_end_to_end_dry_run_replay_index:
  status: completed_validated_dry_run_replay_index
  current_phase: "Runtime Review Batch 10B end-to-end dry-run replay index"
  previous_phase: "Runtime Review Batch 9B runtime session compatibility matrix"
  replay_entrypoint: adapter_dry_run_lab/adapter_dry_run.js
  replay_path:
    - adapter_dry_run_lab/fixtures/accepted_request.json
    - adapter_dry_run_lab/fixtures/rejected_request.json
    - adapter_dry_run_lab/fixtures/photo_studio_os_v0_7_rehearsal_request.json
    - adapter_dry_run_lab/adapter_dry_run.js
    - review_console/runtime_prototype/host_bridge_mock.js
    - review_console/runtime_prototype/runtime_guard.js
    - review_console/runtime_prototype/app.js
    - review_console/runtime_prototype/index.html
    - review_console/runtime_prototype/styles.css
    - review_console/runtime_prototype/FIELD_MAPPING.md
    - review_console/runtime_prototype/README.md
  validator: scripts/validate_runtime_review_batch_10b_dry_run_replay_index.js
  real_vcpchat_read: false
  real_vcptoolbox_read: false
  bridge_or_cdp_call: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_created: false
  version_action_performed: false
```

## Fixture Chain Map

```
adapter_dry_run_lab/fixtures/*.json  (3 个本地 JSON fixture)
       |
       v
adapter_dry_run_lab/adapter_dry_run.js  (dry-run 适配器)
       |
       |  accepted → dispatch_plan_draft + gatekeeper_handoff + review_console_handoff
       |  rejected → rejection_reason_cn + execution_blocked=true
       |
       v
review_console/runtime_prototype/host_bridge_mock.js  (mock bridge: loadSession, previewDraft)
       |
       v
review_console/runtime_prototype/runtime_guard.js  (共享 guard: assertDraftSafe, draftIsSafe, normalizeSession)
       |
       v
review_console/runtime_prototype/app.js  (runtime prototype 渲染草案)
       |
       v
草案输出面:
  - review_session_draft
  - image_case_draft
  - memory_delta_draft
  - memory_completion_state_draft
  - accepted_candidate_delivery_package_draft
  - human_override_traceability_draft
  - inactive_authorization_capsules_draft
  - runtime_review_state_draft
  - local_commit_scope_plan_draft
  - bridge_mock_roundtrip_candidate_draft
  - real_bridge_authorization_package_draft
  - plugin_reliability_prompt_discipline_draft
  - memory_write_completion_candidate_draft
  - single_real_generation_retry_gate_draft
  - real_memory_write_authorization_package_draft
  - asset_archive_candidate_draft
  - traceability_items / traceability_counts / traceability_summary_cn / traceability_boundary_cn
  - prototype_guard
  - host_preview_ack
       |
       v
session export → runtime_review_session_v1 JSON
  - tests/schema_examples/runtime_review_session_v1_legacy_minimal.example.json
  - tests/schema_examples/runtime_review_session_v1_current_draft_rich.example.json
```

## Adapter Dry-Run Fixtures

| Fixture | 期望结果 | 用途 |
| --- | --- | --- |
| `accepted_request.json` | `status: accepted_draft`, `execution_blocked: true`, `selected_plugin: null`, `max_plugin_calls: 0` | 验证 accepted 路径的 dry-run 不变量 |
| `rejected_request.json` | `status: rejected`, `execution_blocked: true`, `selected_plugin: null`, `max_plugin_calls: 0` | 验证拒绝路径对违反 no-execution 不变量的输入正确处理 |
| `photo_studio_os_v0_7_rehearsal_request.json` | `status: accepted_draft`, `execution_blocked: true`, `selected_plugin: null`, `max_plugin_calls: 0` | 验证 rehearsal preflight 的 dry-run 路径 |

所有三个 fixture 都保持 `max_plugin_calls=0`、`selected_plugin=null`、`execution_blocked=true`，不调用真实插件、API、DailyNote 或文件写入。

## Runtime Prototype Component Index

| 组件 | 文件 | 说明 |
| --- | --- | --- |
| 页面入口 | `index.html` | 浏览器内原型入口，脚本顺序固定为 `runtime_guard.js → host_bridge_mock.js → app.js` |
| 样式 | `styles.css` | 原型 UI 样式 |
| 共享 guard | `runtime_guard.js` | 提供 `assertDraftSafe()`、`draftIsSafe()`、`normalizeSession()` 和 `clone()` |
| Mock bridge | `host_bridge_mock.js` | 模拟未来 preload bridge，支持 `loadSession` 和 `previewDraft`，`submitDraft` 固定返回 rejected |
| 应用逻辑 | `app.js` | 渲染草案输出面、管理审批状态、计算所有 draft surface |
| 字段映射 | `FIELD_MAPPING.md` | 记录 runtime 输出到核心 schema 的字段映射 |
| 说明文档 | `README.md` | runtime prototype 的边界、使用方式与验证命令 |

## Script Load Order

```text
runtime_guard.js → host_bridge_mock.js → app.js
```

该顺序在 `index.html` 中定义，smoke test (`validate_runtime_prototype_smoke.js`) 和 delivery surface validator (`validate_runtime_delivery_surface.js`) 都会校验。顺序错误会导致 `ImageLabRuntimeGuard` 在 `host_bridge_mock.js` 引用时未定义。

## Replay Checklist

回放 A → B → C → D → E 每一步：

### A. Adapter Dry-Run

```powershell
node adapter_dry_run_lab\adapter_dry_run.js adapter_dry_run_lab\fixtures\accepted_request.json
node adapter_dry_run_lab\adapter_dry_run.js adapter_dry_run_lab\fixtures\rejected_request.json
node adapter_dry_run_lab\adapter_dry_run.js adapter_dry_run_lab\fixtures\photo_studio_os_v0_7_rehearsal_request.json
```

验收点:
- `accepted_request` 输出 `status: "accepted_draft"`、`execution_blocked: true`、`selected_plugin: null`、`max_plugin_calls: 0`
- `rejected_request` 输出 `status: "rejected"`、`execution_blocked: true`、`selected_plugin: null`、`max_plugin_calls: 0`
- `photo_studio_os_v0_7_rehearsal_request` 输出 `status: "accepted_draft"`、`execution_blocked: true`、`max_plugin_calls: 0`
- `adapter_dry_run_response.no_execution_guard` 的五个 flag 全部为 false
- 三个输出中 `api_called`、`vcp_plugin_called`、`daily_note_called`、`file_write_performed`、`image_file_created` 全部为 false

### B. Adapter Delivery Surface

```powershell
node scripts\validate_adapter_delivery_surface.js
```

验收点:
- 校验 passed
- 确认 adapter 输出保持 `selected_plugin=null`、`max_plugin_calls=0`、`execution_blocked=true`

### C. Runtime Prototype Delivery Surface

```powershell
node scripts\validate_runtime_delivery_surface.js
```

验收点:
- 校验 passed
- `index.html`、`styles.css`、`runtime_guard.js`、`host_bridge_mock.js`、`app.js`、`FIELD_MAPPING.md`、`README.md` 齐全
- 脚本顺序正确
- 无 fetch、IPC、storage 或文件写入调用

### D. Runtime Prototype Smoke

```powershell
node scripts\validate_runtime_prototype_smoke.js
```

验收点:
- 校验 passed
- 页面脚本按 `runtime_guard.js → host_bridge_mock.js → app.js` 顺序加载
- `ImageLabRuntimeGuard` API 可访问
- fake-DOM 中 draft output 面板存在
- host ack 面板存在

### E. Runtime Prototype Suite

```powershell
node scripts\validate_runtime_prototype_suite.js
```

验收点:
- 所有子检查 passed
- `runtime_guard_syntax`、`host_bridge_mock_syntax`、`runtime_app_syntax` passed
- `runtime_guard_unit` passed
- `runtime_smoke` passed
- `runtime_delivery_surface` passed

## Acceptance Criteria

回放路径必须满足以下全部条件:

```yaml
acceptance:
  adapter_fixtures_available:
    - adapter_dry_run_lab/fixtures/accepted_request.json
    - adapter_dry_run_lab/fixtures/rejected_request.json
    - adapter_dry_run_lab/fixtures/photo_studio_os_v0_7_rehearsal_request.json
  adapter_dry_run_works: true
  runtime_prototype_files_complete: true
  script_load_order_correct: true
  submitDraft_blocked: true
  max_plugin_calls: 0
  no_real_vcpchat_read: true
  no_real_vcptoolbox_read: true
  no_doubaogen_call: true
  no_dailynote_call: true
  no_vcp_memory_write: true
  no_image_creation: true
  no_version_action: true
  replay_path_clear: true
```

## Validation

```powershell
node --check scripts\validate_runtime_review_batch_10b_dry_run_replay_index.js
node scripts\validate_runtime_review_batch_10b_dry_run_replay_index.js
node scripts\validate_runtime_prototype_smoke.js
node scripts\validate_runtime_delivery_surface.js
node scripts\validate_runtime_prototype_suite.js
git diff --check
```

人工验收时还应确认:
- 三个 adapter fixture 都能被 `adapter_dry_run.js` 正确处理
- runtime prototype 组件的脚本顺序在 `index.html` 中保持不变
- `submitDraft` 在 mock bridge 中保持 blocked
- 所有 no-execution guard 保持 clean
- 回放路径不读取任何项目外文件
