# VCPChat Remote-debug Relaunch Runtime Verification Record Contract

本文定义 v7.46 remote-debug relaunch runtime verification record contract。它记录用户授权关闭并以 remote-debug 端口重启 VCPChat 后，一次本机 CDP 只读 targets 读取和 `Runtime.evaluate` runtime surface 验证。

```yaml
contract:
  name: vcpchat_remote_debug_relaunch_runtime_verification_record
  version: v7.46-remote-debug-relaunch-runtime-verification-record-contract
  status: completed_validated_read_only_runtime_surface
  source_attempt_record: docs/197_v7_45_cdp_read_only_attempt_record.md
  execution_record: docs/198_v7_46_remote_debug_relaunch_runtime_verification_record.md
  process_stop_authorized_by_this_phase: true
  process_stop_performed_by_this_phase: true
  remote_debug_relaunch_authorized_by_this_phase: true
  remote_debug_relaunch_performed_by_this_phase: true
  cdp_read_only_access_authorized_by_this_phase: true
  cdp_endpoint_accessed_by_this_phase: true
  cdp_endpoint_access_succeeded_by_this_phase: true
  cdp_targets_list_read_by_this_phase: true
  runtime_evaluate_authorized_by_this_phase: true
  runtime_evaluate_performed_by_this_phase: true
  bridge_method_presence_checked_by_this_phase: true
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
  next_safe_phase: "BLOCKED before bridge invocation, source read, plugin/API/DailyNote/VCP memory/image, push/tag/release"
```

## Contract Boundary

v7.46 只允许记录 remote-debug relaunch 和 CDP read-only runtime surface 结果。`Runtime.evaluate` 只能执行类型、键名和方法存在性检查。任何 bridge 方法调用、源码读取、VCPChat/VCPToolBox 修改、真实插件/API/DailyNote/VCP memory/图片动作、push/tag/release 都不属于本契约授权范围。
