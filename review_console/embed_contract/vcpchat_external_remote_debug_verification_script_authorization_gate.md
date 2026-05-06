# VCPChat External Remote Debug Verification Script Authorization Gate Contract

本文定义 v7.37 external remote-debug verification script authorization gate contract。它只约束未来脚本创建和执行前的授权字段，不创建真实脚本、不启动 VCPChat、不访问 CDP、不修改 VCPChat。

```yaml
contract:
  name: vcpchat_external_remote_debug_verification_script_authorization_gate
  version: v7.37-external-remote-debug-verification-script-authorization-gate-contract
  status: planned_validated_external_script_authorization_gate
  source_record: docs/188_v7_36_external_remote_debug_verification_script_plan.md
  target_repository_name: VCPChat
  target_branch: main
  recommended_script_candidate: scripts/run_vcpchat_review_console_remote_debug_smoke.ps1
  script_creation_authorized_by_this_phase: false
  script_created_by_this_phase: false
  app_launch_authorized_by_this_phase: false
  app_launch_performed_by_this_phase: false
  remote_debug_authorized_by_this_phase: false
  remote_debug_used_by_this_phase: false
  cdp_access_authorized_by_this_phase: false
  cdp_endpoint_accessed_by_this_phase: false
  runtime_evaluate_authorized_by_this_phase: false
  runtime_evaluate_performed_by_this_phase: false
  bridge_method_invocation_allowed: false
  vcpchat_modification_authorized_by_this_phase: false
  vcpchat_modified_by_this_phase: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_created: false
  dependency_changed: false
  vcpchat_pushed: false
  next_safe_phase: "v7.38 External Remote Debug Verification Script Creation Preflight"
```

## Contract Boundary

v7.37 是授权门槛，不是脚本实现。任何真实脚本创建、VCPChat 启动、CDP 访问、Runtime.evaluate、VCPChat 文件修改或 VCPChat 正式 smoke test，都必须进入后续独立阶段。
