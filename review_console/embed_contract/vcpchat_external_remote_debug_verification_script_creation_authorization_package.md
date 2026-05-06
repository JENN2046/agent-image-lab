# VCPChat External Remote Debug Verification Script Creation Authorization Package Contract

本文定义 v7.42 external remote-debug verification script creation authorization package contract。它只保存未激活的授权包模板；不创建真实脚本、不启动 VCPChat、不访问 CDP、不修改 VCPChat。

```yaml
contract:
  name: vcpchat_external_remote_debug_verification_script_creation_authorization_package
  version: v7.42-external-remote-debug-verification-script-creation-authorization-package-contract
  status: planned_validated_inactive_authorization_package_template
  source_record: docs/193_v7_41_external_remote_debug_verification_script_creation_record.md
  script_path_under_review: scripts/run_vcpchat_review_console_remote_debug_smoke.ps1
  package_record_created: true
  package_template_only: true
  package_active: false
  user_approved_script_creation_now: false
  active_a5_authorization_package_present: false
  active_script_creation_authorization_package_present: false
  executable_script_creation_allowed_now: false
  remote_debug_script_created: false
  app_launch_allowed_now: false
  cdp_access_allowed_now: false
  bridge_method_invocation_allowed: false
  vcpchat_modified_by_this_phase: false
  vcptoolbox_modified_by_this_phase: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_created: false
  dependency_changed: false
  push_performed: false
  next_safe_phase: "BLOCKED until explicit script creation authorization"
```

## Contract Boundary

v7.42 只记录授权包模板。创建 `scripts/run_vcpchat_review_console_remote_debug_smoke.ps1` 是下一阶段硬边界，必须等待明确授权。
