# v10.0 A5 End-to-end Activation Package Contract

本文定义 v10.0 A5 end-to-end activation package contract。它只描述未来单批 A5 生产自动化的可激活边界，不执行真实动作。

```yaml
contract:
  name: v10_0_a5_end_to_end_activation_package
  version: v10.0-a5-end-to-end-activation-package-contract
  status: active_package_preflight_blocked_contract
  readiness_record: docs/199_v10_0_a5_end_to_end_activation_package_readiness.md
  validation_file: scripts/validate_v10_0_a5_end_to_end_activation_package.js
  previous_runtime_record: docs/198_v7_46_remote_debug_relaunch_runtime_verification_record.md
  active_a5_authorization_package_present: true
  activation_ready: false
  a5_execution_started: false
  a5_preflight_started: true
  a5_preflight_blocked: true
  required_external_values:
    - real_vcpchat_root
    - real_vcptoolbox_root
  raw_real_paths_recorded_in_git: false
  external_target_worktrees_clean: false
  vcpchat_worktree_clean: false
  vcptoolbox_worktree_clean: false
```

## Allowed If Activated

```yaml
allowed_if_activated:
  execution_style: single_batch_a5_end_to_end
  selected_plugin_id: DoubaoGen
  selected_plugin_command: generate
  selected_plugin_model: doubao-seedream-5-0-260128
  max_plugin_calls: 1
  bridge_methods_allowed:
    - cancel
    - loadSession
    - previewDraft
  bridge_methods_forbidden:
    - submitDraft
  max_bridge_calls_per_method: 1
  daily_note_write_allowed: true
  vcp_memory_write_allowed: true
  max_daily_note_writes: 1
  max_vcp_memory_writes: 1
  git_commit_allowed: true
  git_tag_allowed: true
  git_push_allowed: true
  github_pr_allowed: true
  github_release_allowed: false
```

## Required Guards

```yaml
required_guards:
  output_directory_ref: runs/a5_complete_delivery_photo_studio_os
  overwrite_existing_files_allowed: false
  image_binary_in_git_or_memory: false
  daily_note_body_language: zh_cn
  memory_sanitization_required: true
  raw_path_persistence_allowed: false
  raw_endpoint_persistence_allowed: false
  raw_runtime_log_persistence_allowed: false
  raw_plugin_output_persistence_allowed: false
  raw_source_persistence_allowed: false
  github_release_allowed: false
```

## Stop Conditions

```yaml
stop_conditions:
  - missing_real_vcpchat_root
  - missing_real_vcptoolbox_root
  - dirty_unrelated_worktree
  - remote_diverged
  - tag_already_exists
  - output_directory_collision
  - raw_sensitive_value_would_be_recorded
  - bridge_submitDraft_required
  - plugin_call_count_would_exceed_one
  - daily_note_write_count_would_exceed_one
  - vcp_memory_write_count_would_exceed_one
  - github_release_requested
```

## Current Boundary

```yaml
current_boundary:
  active_a5_authorization_package_present: true
  a5_execution_started: false
  a5_preflight_started: true
  a5_preflight_blocked: true
  real_vcpchat_root_provided: true
  real_vcptoolbox_root_provided: true
  external_target_worktrees_clean: false
  vcpchat_worktree_clean: false
  vcptoolbox_worktree_clean: false
  production_actions_blocked: true
  bridge_method_invocation_performed: false
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
