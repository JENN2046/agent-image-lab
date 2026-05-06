# VCPChat One-time Remote Debug Runtime Verification Preflight Contract

本文定义 v7.32 one-time remote-debug runtime verification preflight contract。它只记录下一阶段的远程调试验证门槛，不执行 remote-debug。

```yaml
contract:
  name: vcpchat_one_time_remote_debug_runtime_verification_preflight
  version: v7.32-one-time-remote-debug-runtime-verification-preflight-contract
  status: completed_validated_remote_debug_runtime_verification_preflight
  source_record: docs/183_v7_31_vcpchat_renderer_global_verification_gate.md
  target_repository_name: VCPChat
  target_branch: main
  target_head_short: b320e39
  selected_strategy: one_time_remote_debug
  candidate_remote_debug_port: 9222
  app_launch_performed_by_this_phase: false
  remote_debug_used_by_this_phase: false
  cdp_endpoint_accessed_by_this_phase: false
  runtime_evaluate_performed_by_this_phase: false
  vcpchat_modified_by_this_phase: false
  test_harness_created_by_this_phase: false
  review_console_bridge_load_session_called: false
  review_console_bridge_preview_draft_called: false
  review_console_bridge_submit_draft_called: false
  review_console_bridge_cancel_called: false
  review_console_bridge_plugin_called: false
  review_console_bridge_api_called: false
  review_console_bridge_daily_note_called: false
  review_console_bridge_vcp_memory_written: false
  review_console_bridge_disk_write_performed: false
  review_console_bridge_image_created: false
  dependency_changed: false
  vcpchat_pushed: false
  next_safe_phase: "v7.33 VCPChat One-time Remote Debug Runtime Verification Execution"
```

## Contract Boundary

The next phase may only use local read-only `Runtime.evaluate` expressions. It must not invoke Review Console bridge IPC methods, mutate DOM, navigate pages, install dependencies, or modify VCPChat files.
