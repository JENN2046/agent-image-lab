# VCPChat Runtime Smoke Test Execution Record Contract

本文定义 v7.29 runtime smoke test execution record contract。它记录本次授权后的真实执行结果：启动前检查和静态检查通过，但应用启动因 API / 设置读取边界歧义被阻断。

```yaml
contract:
  name: vcpchat_runtime_smoke_test_execution_record
  version: v7.29-runtime-smoke-test-execution-record-contract
  status: blocked_before_app_launch
  source_record: docs/180_v7_28_vcpchat_runtime_smoke_test_execution_preflight.md
  target_repository_name: VCPChat
  target_branch: main
  target_head_short: b320e39
  requested_launch_command: npm run start:desktop:utf8
  app_launch_authorized_by_user: true
  pre_launch_checks_passed: true
  static_checks_passed: true
  app_launch_performed: false
  runtime_smoke_test_performed: false
  blocked_reason_cn: "常规应用启动可能触发模型拉取、WebSocket 或设置读取流程，与本次禁止 API / 敏感读取边界存在冲突。"
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  disk_write_performed: false
  image_created: false
  dependency_changed: false
  vcpchat_pushed: false
  next_safe_phase: "v7.30 VCPChat Runtime Smoke Test Revised Authorization Gate"
```

## Contract Boundary

This record is not a runtime pass. It is a blocked execution record. Future runtime smoke testing requires a revised authorization that distinguishes normal VCPChat startup behavior from Review Console bridge behavior.
