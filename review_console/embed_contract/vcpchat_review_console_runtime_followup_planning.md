# VCPChat Review Console Runtime Follow-up Planning Contract

本文定义 v7.35 runtime follow-up planning contract。它只记录后续路线选择，不创建脚本、不启动应用、不修改 VCPChat。

```yaml
contract:
  name: vcpchat_review_console_runtime_followup_planning
  version: v7.35-runtime-followup-planning-contract
  status: completed_validated_runtime_followup_planning
  source_record: docs/186_v7_34_vcpchat_review_console_runtime_verification_closeout.md
  target_repository_name: VCPChat
  target_branch: main
  target_head_short: b320e39
  review_console_bridge_runtime_verified: true
  recommended_first_step: external_agent_image_lab_remote_debug_script
  vcpchat_formal_smoke_test_allowed_now: false
  app_launch_performed_by_this_phase: false
  remote_debug_used_by_this_phase: false
  cdp_endpoint_accessed_by_this_phase: false
  vcpchat_modified_by_this_phase: false
  external_script_created_by_this_phase: false
  vcpchat_formal_smoke_test_created_by_this_phase: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_created: false
  dependency_changed: false
  vcpchat_pushed: false
  next_safe_phase: "v7.36 External Remote Debug Verification Script Plan"
```

## Contract Boundary

v7.35 only chooses the next route. Creating an external script, modifying VCPChat, or adding a formal VCPChat smoke test all require separate future authorization.
