# VCPChat Runtime Smoke Test Partial Execution Record Contract

本文定义 v7.30 runtime smoke test partial execution record contract。它记录一次真实应用启动后的窗口级 smoke 结果，以及 renderer global 尚未自动验证的限制。

```yaml
contract:
  name: vcpchat_runtime_smoke_test_partial_execution_record
  version: v7.30-runtime-smoke-test-partial-execution-record-contract
  status: partial_pass_window_smoke_only
  source_record: docs/181_v7_29_vcpchat_runtime_smoke_test_execution_record.md
  target_repository_name: VCPChat
  target_branch: main
  target_head_short: b320e39
  launch_command_executed: npm run start:desktop:utf8
  app_launch_performed: true
  electron_process_observed: true
  main_window_observed: true
  renderer_global_automatic_verification_performed: false
  startup_side_effect_observed: true
  startup_side_effect_path: .vcp_ready
  startup_side_effect_restored: true
  vcpchat_worktree_clean_after_restore: true
  review_console_bridge_plugin_called: false
  review_console_bridge_api_called: false
  review_console_bridge_daily_note_called: false
  review_console_bridge_vcp_memory_written: false
  review_console_bridge_disk_write_performed: false
  review_console_bridge_image_created: false
  dependency_changed: false
  vcpchat_pushed: false
  next_safe_phase: "v7.31 VCPChat Renderer Global Verification Gate"
```

## Contract Boundary

This is a partial pass. It proves window-level startup only. Renderer global verification remains pending until a separately authorized observation method is selected.
