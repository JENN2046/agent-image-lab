# VCPChat Renderer Global Verification Gate Contract

本文定义 v7.31 renderer global verification gate contract。它只记录方案选择，不执行 remote debugging、不启动应用、不修改 VCPChat。

```yaml
contract:
  name: vcpchat_renderer_global_verification_gate
  version: v7.31-renderer-global-verification-gate-contract
  status: completed_validated_renderer_global_verification_gate
  source_record: docs/182_v7_30_vcpchat_runtime_smoke_test_partial_execution_record.md
  target_repository_name: VCPChat
  target_branch: main
  target_head_short: b320e39
  selected_strategy: one_time_remote_debug
  app_launch_performed_by_this_phase: false
  remote_debug_used_by_this_phase: false
  devtools_used_by_this_phase: false
  vcpchat_modified_by_this_phase: false
  test_harness_created_by_this_phase: false
  review_console_bridge_plugin_called: false
  review_console_bridge_api_called: false
  review_console_bridge_daily_note_called: false
  review_console_bridge_vcp_memory_written: false
  review_console_bridge_disk_write_performed: false
  review_console_bridge_image_created: false
  dependency_changed: false
  vcpchat_pushed: false
  next_safe_phase: "v7.32 VCPChat One-time Remote Debug Runtime Verification Preflight"
```

## Contract Boundary

The selected strategy requires a later explicit launch authorization. This contract does not authorize remote-debug execution by itself.
