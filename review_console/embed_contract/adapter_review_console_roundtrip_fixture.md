# Adapter Review Console Roundtrip Fixture

本文定义 Adapter dry-run 结果进入 Review Console runtime 的本地 roundtrip fixture。它是 fixture / contract，不是运行时代码；不创建真实 IPC handler，不创建 preload 代码，不创建 renderer 集成代码，不修改真实 VCPChat，不读取真实 VCPChat / VCPToolBox，不调用插件、API、DailyNote 或文件系统。

## Fixture Status

```yaml
fixture:
  name: adapter_review_console_roundtrip_fixture
  version: v6.4-fixture
  status: fixture_only
  source_contracts:
    - integrations/vcp/adapter_runtime_contract.md
    - integrations/vcp/vcp_dispatch_plan.schema.yaml
    - review_console/embed_contract/host_bridge_contract_v2.md
    - review_console/runtime_prototype/FIELD_MAPPING.md
  selected_plugin: null
  max_plugin_calls: 0
  execution_blocked: true
  external_api_allowed: false
  real_vcpchat_source_read: false
  real_vcptoolbox_source_read: false
  ipc_handler_created: false
  preload_runtime_code_created: false
  renderer_runtime_code_created: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_file_created: false
```

## Allowed Roundtrip Input

```yaml
allowed_roundtrip_input:
  dispatch_plan_draft:
    type: map
    required: true
    invariants:
      mode: dry_run
      selected_plugin: null
      max_plugin_calls: 0
      execution_blocked: true
      external_api_allowed: false
      allow_file_write: false
      allow_image_binary: false
  gatekeeper_handoff:
    type: map
    required: true
    display_only: true
  review_console_handoff:
    type: map
    required: true
    display_only: true
  prototype_guard:
    type: map
    required: true
```

输入不得包含 raw manifest、raw plugin output、真实 endpoint、密钥、token、cookie、密码、私密路径、客户隐私、图片二进制或真实插件结果。

## Roundtrip Output

```yaml
allowed_roundtrip_output:
  review_session_draft:
    type: map
    source: dispatch_plan_draft + review_console_handoff
  image_case_draft:
    type: map
    source: dispatch_plan_draft + runtime seed
  memory_delta_draft:
    type: map
    source: dispatch audit summary + memory preview
  prototype_guard:
    api_called: false
    daily_note_called: false
    vcp_plugin_called: false
    disk_write_performed: false
    image_file_created: false
  validation_preview_ack:
    validation_passed: boolean
    side_effects_performed: false
  host_submit_ack:
    validation_passed: boolean
    side_effects_performed: false
  task_panel_state:
    type: map
    display_only: true
```

输出只允许用于人工展示、schema 映射和下一授权点记录，不表示真实执行完成。

## No-execution Assertions

```yaml
no_execution_assertions:
  selected_plugin: null
  max_plugin_calls: 0
  execution_blocked: true
  external_api_allowed: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  vcp_memory_written: false
  disk_write_performed: false
  image_file_created: false
  side_effects_performed: false
  real_execution_allowed: false
```

## Acceptance

- Adapter handoff 必须保持 dry-run。
- Gatekeeper handoff 和 Review Console handoff 必须保持 display-only。
- Host bridge 只能返回 preview ack 和 submit ack。
- Runtime draft bundle 只能包含草案对象和 no-execution guard。
- Task Panel 只能显示状态和下一授权点。
- 本 fixture 不授权真实插件、API、DailyNote、VCP 记忆、文件系统、图片创建或真实 VCPChat 集成。
