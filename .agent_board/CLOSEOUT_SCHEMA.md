# CLOSEOUT_SCHEMA.md — Agent Image Lab

## A4.8 Closeout Schema

```yaml
closeout:
  phase:
  commit_hash:
  commit_message:
  branch:
  source_commit:
  push:
  local_equals_origin:
  ahead_behind:
  git_status:

  instruction_sources_checked:
    AGENTS_loaded:
    autopilot_overlay_loaded_or_read:
    agent_board_loaded:
    README_autopilot_loaded_or_reviewed:

  agent_board:
    checked:
    updated:
    stale_risk:
    handoff_current:
    run_state_current:
    task_queue_current:
    checkpoint_current:
    validation_log_updated:

  staging:
    used_git_add_dot: false
    staged_exact_files_only:

  validation:
    recommender:
      command: npm run recommend:validation:next-commands
      source: validation_decision_summary.next_commands
      primary_profile:
      primary_command:
      next_commands: []
      deferred_commands: []
      usage_decision: followed | broadened | narrowed | deferred | skipped
      usage_reason:
    git_status:
    git_diff_check:
    exact_diff_reviewed:
    agent_board_state_validator:
    current_state_alignment_validator:
    native_doubao_sandbox_validator:
    local_project_validator:
    mvp_validator:

  safety:
    A5_execution: false
    provider_contact: false
    plugin_call: false
    image_generation: false
    env_local_secret_value_read: false
    DailyNote_write: false
    VCP_memory_write: false
    memory_write_path: false
    production_candidate_002: false
    Batch_005: false
    accepted_samples_write: false
    runs_output_committed: false
    runtime_execution: false
    VCPChat_runtime: false
    VCPToolBox_runtime: false
    CDP_bridge_MCP: false
    real_manifest_read: false
    package_json_modified: false
    dependency_change: false
    tag_release_deploy: false

  recommended_next:
    phase:
    auto_execution_allowed:
    purpose:

  final_state:
    next_phase_started: false
```

## Rule

The closeout must not claim validation that was not run. If a validator is skipped, record `not_run` and the reason.
