# VCPChat Runtime Smoke Test Execution Preflight Contract

本文定义 v7.28 runtime smoke test execution preflight contract。它只描述未来一次本地 runtime smoke test 的授权前契约；不启动应用，不执行 smoke test，不创建 IPC/preload/renderer 新代码。

```yaml
contract:
  name: vcpchat_runtime_smoke_test_execution_preflight
  version: v7.28-runtime-smoke-test-execution-preflight-contract
  status: completed_validated_runtime_smoke_test_execution_preflight
  source_record: docs/179_v7_27_vcpchat_runtime_smoke_test_preflight.md
  target_repository_name: VCPChat
  target_branch: main
  target_head_short: b320e39
  expected_launch_command_after_authorization: npm run start:desktop:utf8
  hard_authorization_required_before_launch: true
  hard_authorization_granted_by_this_phase: false
  app_launch_performed: false
  runtime_smoke_test_performed: false
  renderer_devtools_used: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  disk_write_performed: false
  image_created: false
  dependency_changed: false
  next_safe_phase: "v7.29 VCPChat Runtime Smoke Test Execution Record"
```

## Contract Boundary

Renderer observation, if later authorized, may only inspect the Review Console bridge surface and draft guard values. It must not invoke plugins, call external APIs, write DailyNote, write VCP memory, create images, install dependencies, alter branches, or push remote changes.
