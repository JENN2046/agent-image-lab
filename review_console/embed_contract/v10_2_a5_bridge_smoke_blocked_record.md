# v10.2 A5 Bridge Smoke Blocked Contract

本文定义 v10.2 A5 bridge smoke blocked contract。它记录 clean preflight 后的最小 bridge smoke 失败边界：CDP 可用，但当前 VCPChat 运行时未暴露 `imageLabReview` bridge，因而没有调用任何 bridge 方法。

```yaml
contract:
  name: v10_2_a5_bridge_smoke_blocked_record
  version: v10.2-a5-bridge-smoke-blocked-contract
  status: blocked_bridge_surface_missing
  record: docs/201_v10_2_a5_bridge_smoke_blocked_record.md
  validation_file: scripts/validate_v10_2_a5_bridge_smoke_blocked_record.js
  preflight_recheck_performed: true
  external_target_worktrees_rechecked: true
  external_target_worktrees_clean_current: true
  selected_method: cancel
  max_bridge_calls: 1
  bridge_calls_observed: 0
  bridge_surface_missing: true
  bridge_method_invocation_performed: false
  production_actions_blocked: true
```

## No-execution Boundary

```yaml
no_execution_boundary:
  bridge_cancel_called: false
  bridge_load_session_called: false
  bridge_preview_draft_called: false
  bridge_submit_draft_called: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  daily_note_written: false
  vcp_memory_written: false
  image_created: false
  commit_performed: false
  tag_created: false
  push_performed: false
  pr_created: false
  github_release_performed: false
```

## Next Authorization Requirement

```yaml
next_authorization_requirement:
  option_a_use_bridge_bearing_vcpchat_build: true
  option_b_authorize_vcpchat_bridge_integration_file_set: true
  source_read_or_modification_allowed_by_this_record: false
  raw_source_code_persistence_allowed: false
  raw_endpoint_persistence_allowed: false
  raw_runtime_log_persistence_allowed: false
```
