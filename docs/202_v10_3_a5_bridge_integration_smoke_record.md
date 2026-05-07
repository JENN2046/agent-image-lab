# v10.3 A5 Bridge Integration Smoke Record

本文记录 Agent Image Lab v10.3 A5 bridge integration smoke record。用户明确授权读取/修改 VCPChat bridge 集成的最小文件集后，本阶段在 VCPChat 授权范围内完成最小 no-write bridge surface 补丁，并通过严格 allowlist-only runtime smoke。

本阶段只修改 VCPChat 的一个已授权 renderer 文件，未读取或修改 VCPToolBox，未调用插件/API/DailyNote，未写 VCP memory，未创建图片，未 commit/tag/push/PR/release。VCPChat remote-debug 运行时在 smoke 后已关闭，启动产生的工作树副作用已恢复。

```yaml
status: completed_validated_v10_3_a5_bridge_integration_smoke_record_with_human_review_gate
version: v10.3
current_phase: "v10.3 A5 bridge integration smoke record"
validation_file: scripts/validate_v10_3_a5_bridge_integration_smoke_record.js
previous_phase: "v10.2 A5 bridge smoke blocked record"
previous_record: docs/201_v10_2_a5_bridge_smoke_blocked_record.md
default_next_phase: "BLOCKED for human review before DoubaoGen because an initial rejected submitDraft probe occurred"
```

## Authorization Applied

```yaml
authorization_applied:
  vcpchat_bridge_file_set_authorized: true
  authorization_mode: read_and_modify_minimal_bridge_file_set
  raw_vcpchat_root_recorded_in_git: false
  allowed_modify_surface_used:
    - renderer_file
  modified_vcpchat_file_count: 1
  modified_vcpchat_file_ref: redacted_vcpchat_renderer_file
  dependency_changed: false
  package_manifest_changed: false
  lockfile_changed: false
```

## Bridge Patch Result

```yaml
bridge_patch_result:
  no_write_bridge_exposed: true
  imageLabReview_present_after_patch: true
  imageLabReviewRuntime_present_after_patch: true
  imageLabReviewMount_present_after_patch: true
  bridge_methods_present:
    cancel: true
    loadSession: true
    previewDraft: true
    submitDraft: true
  submitDraft_behavior: rejected_no_write
  plugin_call_capability_added: false
  api_call_capability_added: false
  daily_note_write_capability_added: false
  vcp_memory_write_capability_added: false
  image_creation_capability_added: false
```

## Strict Allowlist Smoke Result

```yaml
strict_allowlist_smoke_result:
  strict_allowlist_smoke_performed: true
  selected_methods:
    - cancel
    - loadSession
    - previewDraft
  bridge_calls_observed: 3
  submitDraft_called: false
  cancel_ack_status: accepted
  loadSession_ack_status: accepted
  previewDraft_ack_status: accepted
  side_effects_performed: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  daily_note_written: false
  vcp_memory_written: false
  image_created: false
  output_file_written: false
```

## Protocol Deviation Record

```yaml
protocol_deviation_record:
  initial_submitDraft_rejection_probe_performed: true
  initial_submitDraft_probe_result: rejected_no_write
  initial_submitDraft_external_side_effects: false
  reason_cn: "初始 smoke 脚本额外探测了一次 submitDraft 的拒绝返回；该探针没有外部写入，但超出 A5 原始 allowlist 字面边界。"
  strict_allowlist_smoke_reran_after_deviation: true
  human_review_required_before_production_continuation: true
  doubaogen_continuation_blocked: true
```

## Runtime Cleanup

```yaml
runtime_cleanup:
  remote_debug_runtime_started_for_smoke: true
  remote_debug_runtime_closed_after_smoke: true
  cdp_port_still_listening_after_cleanup: false
  startup_marker_side_effect_restored: true
  raw_endpoint_recorded_in_git: false
  raw_websocket_url_recorded_in_git: false
  raw_runtime_log_recorded_in_git: false
```

## Result Meaning

v10.3 表示：VCPChat bridge surface 已经通过最小 no-write 补丁暴露，严格 allowlist-only smoke 已通过，`cancel/loadSession/previewDraft` 均能返回脱敏 no-write ack。

但由于初始 smoke 中曾额外调用一次 `submitDraft` 的拒绝探针，本阶段不继续进入 DoubaoGen 或记忆写入。下一步必须由人工复核该偏差后，重新授权是否恢复 A5 生产链路。
