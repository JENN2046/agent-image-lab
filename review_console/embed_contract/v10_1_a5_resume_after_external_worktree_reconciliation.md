# v10.1 A5 Resume After External Worktree Reconciliation Contract

本文定义 v10.1 A5 resume after external worktree reconciliation contract。它只描述从 v10.0 blocked preflight 恢复到下一次 preflight 的条件，不执行真实 bridge、插件、记忆、图片或远端动作。

```yaml
contract:
  name: v10_1_a5_resume_after_external_worktree_reconciliation
  version: v10.1-a5-resume-after-external-worktree-reconciliation-contract
  status: local_resume_package_ready_preflight_required
  resume_record: docs/200_v10_1_a5_resume_after_external_worktree_reconciliation.md
  previous_record: docs/199_v10_0_a5_end_to_end_activation_package_readiness.md
  validation_file: scripts/validate_v10_1_a5_resume_after_external_worktree_reconciliation.js
  active_a5_authorization_package_present: true
  user_will_reconcile_external_worktrees: true
  user_reported_external_worktrees_clean: true
  a5_resume_ready: false
  a5_execution_started: false
  a5_preflight_rerun_required: true
  raw_real_paths_recorded_in_git: false
  production_actions_blocked: true
```

## Recheck Contract

```yaml
recheck_contract:
  repo_reality_recheck_required: true
  target_branch_recheck_required: true
  tag_conflict_recheck_required: true
  output_directory_collision_recheck_required: true
  external_worktree_clean_recheck_required: true
  raw_sensitive_value_recheck_required: true
  bridge_policy_recheck_required: true
  github_release_recheck_required: true
```

## Carry-forward Allowed Surface

```yaml
carry_forward_allowed_surface:
  selected_plugin_id: DoubaoGen
  selected_plugin_command: generate
  selected_plugin_model: doubao-seedream-5-0-260128
  max_plugin_calls: 1
  output_directory_ref: runs/a5_complete_delivery_photo_studio_os
  overwrite_existing_files_allowed: false
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
  github_release_allowed: false
```

## Current No-action Boundary

```yaml
current_no_action_boundary:
  external_worktree_recheck_performed_by_this_phase: false
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
