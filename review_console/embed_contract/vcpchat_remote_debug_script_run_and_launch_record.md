# VCPChat Remote Debug Script Run And Launch Record Contract

本文定义 v7.44 remote-debug script run and VCPChat launch record contract。它记录脚本已运行、VCPChat 已启动，但 CDP 未访问，bridge 未调用。

```yaml
contract:
  name: vcpchat_remote_debug_script_run_and_launch_record
  version: v7.44-remote-debug-script-run-and-vcpchat-launch-record-contract
  status: planned_validated_script_ran_vcpchat_launched_no_cdp
  source_script_creation_record: docs/195_v7_43_external_remote_debug_verification_script_creation_execution_record.md
  execution_record: docs/196_v7_44_remote_debug_script_run_and_vcpchat_launch_record.md
  script_path: scripts/run_vcpchat_review_console_remote_debug_smoke.ps1
  script_run_by_this_phase: true
  script_dry_run_result_only: true
  script_execution_blocked_by_design: true
  app_launch_performed_by_this_phase: true
  launch_command: npm run start:desktop:utf8
  launch_root_recorded_in_git: false
  remote_debug_used_by_this_phase: false
  cdp_endpoint_accessed_by_this_phase: false
  runtime_evaluate_performed_by_this_phase: false
  bridge_method_invocation_performed: false
  vcpchat_source_read: false
  vcpchat_modified_by_this_phase: false
  vcptoolbox_source_read: false
  vcptoolbox_modified_by_this_phase: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_created: false
  push_performed: false
  next_safe_phase: "BLOCKED until explicit CDP access and bridge runtime verification authorization"
```

## Contract Boundary

v7.44 只证明脚本运行和 VCPChat 启动已经发生。后续 CDP endpoint 访问、Runtime.evaluate、bridge surface 检查、bridge 方法调用或任何 VCPChat / VCPToolBox 源码读写，都必须另行授权。
