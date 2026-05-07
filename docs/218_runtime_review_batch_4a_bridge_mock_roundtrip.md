# Runtime Review Batch 4A Bridge Mock Roundtrip

本文记录 Runtime Review long task line 的 Batch 4A 本地实现：Bridge Mock Roundtrip Candidate。

该批次只在项目内 runtime prototype、host bridge mock、guard 和 validators 中完成 no-write 回环证明。不读取真实 VCPChat / VCPToolBox，不连接 CDP，不调用插件/API/DailyNote/VCP memory，不创建图片，不提交或推送。

## Scope

```yaml
batch: runtime_review_batch_4a_bridge_mock_roundtrip
mode: local_a4_no_execution
flow:
  - adapter_dry_run_handoff
  - review_console_runtime_draft
  - host_bridge_mock_previewDraft
selected_methods:
  - loadSession
  - previewDraft
forbidden_methods:
  - submitDraft
bridge_mode: project_local_mock
source_fixture_policy: project_local_fixtures_only
```

## Runtime Surface

新增 `bridge_mock_roundtrip_candidate_draft`，用于把 Adapter dry-run handoff、Review Console runtime draft 和 host bridge mock 回执连成一个本地可验证候选。

必须保持：

```yaml
package_status: draft_only
roundtrip_status: mock_roundtrip_candidate
bridge_mode: project_local_mock
bridge_calls_observed:
  mock_only: true
  total: 2
  loadSession: 1
  previewDraft: 1
  submitDraft: 0
  production_submitDraft: 0
adapter_handoff_ref:
  selected_plugin: null
  max_plugin_calls: 0
  execution_blocked: true
side_effects_performed: false
plugin_called: false
api_called: false
daily_note_called: false
vcp_memory_written: false
image_created: false
```

## Host Bridge Mock

`host_bridge_mock.js` 现在提供 `previewDraft(draft)`，返回脱敏 mock ack：

- `selected_method`
- `accepted_by_host_mock`
- `draft_received`
- `validation_passed`
- `bridge_calls_observed`
- no-write flags
- `status_cn`

`submitDraft(draft)` 仍保留为 mock 负向校验入口，但 Batch 4A runtime render 不使用它，也不代表 production submit 语义已授权。

## Guard Rules

`runtime_guard.js` 新增 `bridgeMockRoundtripCandidateIsSafe()`，拒绝：

- 非 `draft_only` 或非 `mock_roundtrip_candidate`。
- 非 `project_local_mock`。
- 真实 CDP 或 production bridge 标记。
- `submitDraft_called=true`。
- `bridge_calls_observed.submitDraft != 0`。
- 插件/API/DailyNote/VCP memory/image 任一真实执行 flag。
- Adapter handoff 不是 `selected_plugin=null`、`max_plugin_calls=0`、`execution_blocked=true`。
- ack summary 缺少方法名、ack keys 或 no-write flags。

## Validation

本批次需要通过：

```powershell
node --check review_console\runtime_prototype\host_bridge_mock.js
node --check review_console\runtime_prototype\runtime_guard.js
node --check review_console\runtime_prototype\app.js
node --check scripts\validate_runtime_guard_unit.js
node --check scripts\validate_runtime_prototype_smoke.js
node --check scripts\validate_runtime_delivery_surface.js
node scripts\validate_runtime_guard_unit.js
node scripts\validate_runtime_prototype_smoke.js
node scripts\validate_runtime_delivery_surface.js
node scripts\validate_runtime_prototype_suite.js
node scripts\validate_local_commit_scope.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
powershell -ExecutionPolicy Bypass -File scripts\validate-agent-image-lab-local.ps1
git diff --check
```

## Stop Boundary

Batch 4A 不授权：

- 读取真实 VCPChat / VCPToolBox source。
- 启动、重启或连接真实 VCPChat。
- 读取 CDP endpoint 或 websocket URL。
- 调用真实 bridge。
- 调用 `submitDraft` production 语义。
- 调用 VCP 插件或 API。
- 写 DailyNote / VCP memory。
- 创建图片文件。
- commit、tag、push、PR 或 release。

## Next

下一项安全本地任务是 Batch 4B：Real Bridge Authorization Package。该任务只准备未来授权包，不进行真实 bridge 调用。
