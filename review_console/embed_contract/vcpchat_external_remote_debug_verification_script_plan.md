# VCPChat External Remote Debug Verification Script Plan Contract

本文定义 v7.36 external remote-debug verification script plan contract。它只规划未来 Agent Image Lab 外部验证脚本的职责、输出形状和边界，不创建真实脚本、不启动 VCPChat、不访问 CDP、不修改 VCPChat。

```yaml
contract:
  name: vcpchat_external_remote_debug_verification_script_plan
  version: v7.36-external-remote-debug-verification-script-plan-contract
  status: planned_validated_external_script_plan
  source_record: docs/187_v7_35_vcpchat_review_console_runtime_followup_planning.md
  target_repository_name: VCPChat
  target_branch: main
  target_head_short: b320e39
  recommended_script_candidate: scripts/run_vcpchat_review_console_remote_debug_smoke.ps1
  script_created_by_this_phase: false
  output_style: sanitized_json
  allowed_cdp_method_family: Runtime.evaluate
  bridge_method_invocation_allowed: false
  app_launch_performed_by_this_phase: false
  remote_debug_used_by_this_phase: false
  cdp_endpoint_accessed_by_this_phase: false
  runtime_evaluate_performed_by_this_phase: false
  external_script_created_by_this_phase: false
  vcpchat_modified_by_this_phase: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_created: false
  dependency_changed: false
  vcpchat_pushed: false
  next_safe_phase: "v7.37 External Remote Debug Verification Script Authorization Gate"
```

## Contract Boundary

v7.36 只定义未来脚本计划。创建 `scripts/run_vcpchat_review_console_remote_debug_smoke.ps1`、启动 VCPChat、访问 CDP endpoint、运行 Runtime.evaluate、修改 VCPChat 或把测试纳入 VCPChat 正式 smoke test，都需要后续独立授权。
