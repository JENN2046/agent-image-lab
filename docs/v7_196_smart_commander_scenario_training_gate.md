# v7.196 Smart Commander Scenario Training Gate

## Executive Verdict

```yaml
executive_verdict:
  overall_status: pass
  base_contract: AGENTS.md
  gate_model: fixed_A4_docs_only_gate_template_plus_phase_delta
  execution_mode_selected_by_commander: direct_commander_execution
  selection_reason: "single-file A4 docs-only scenario matrix with clear write set"
  smart_commander_scenario_training_defined: true
  AGENTS_md_update_allowed_now: false
  image_generation_allowed_now: false
  plugin_call_allowed_now: false
  provider_contact_allowed_now: false
  memory_write_path_allowed_now: false
  runtime_execution_allowed_now: false
  recommended_next_phase: choose_by_backlog_selection_policy
```

This gate defines a scenario training matrix for Smart Commander. It turns the
mode selection, continuation, maturity, and backlog-selection rules into
practical scenarios with expected commander behavior.

## Fixed Gate Template

```yaml
gate_template:
  phase: v7.196_smart_commander_scenario_training_gate
  base_contract: AGENTS.md
  mode: A4
  intent: local_implementation
  risk_level: R0
  allowed_files:
    - docs/v7_196_smart_commander_scenario_training_gate.md
  forbidden_files:
    - AGENTS.md
    - README.md
    - package.json
    - package-lock.json
    - pnpm-lock.yaml
    - yarn.lock
    - scripts/**
    - .agent_board/**
    - review_console/**
    - integrations/**
    - schemas/**
    - fixtures/**
    - .env
    - "*.env"
  allowed_actions:
    - create docs-only smart commander scenario training gate
    - define scenario inputs
    - define scenario matrix
    - define expected commander behavior
    - define stop-and-ask scenarios
    - define anti-redundancy behavior
    - run allowed Git checks
    - stage only allowlisted file
    - commit only allowlisted file
  forbidden_actions:
    - modify AGENTS.md
    - modify any non-allowlisted file
    - push
    - tag
    - release
    - validator execution
    - script execution
    - PowerShell script execution
    - runtime execution
    - VCPChat access
    - VCPToolBox access
    - real manifest read
    - plugin call
    - provider contact
    - image generation
    - DailyNote write
    - VCP memory write
    - dependency change
    - config change
  validation:
    required:
      - git status --short
      - git diff -- docs/v7_196_smart_commander_scenario_training_gate.md
      - git diff --check
    forbidden:
      - validator execution
      - script execution
      - PowerShell script execution
      - runtime execution
  commit:
    allowed: true
    message: "docs: add v7.196 smart commander scenario training"
  push:
    allowed: false
  explicit_non_authorization:
    generation: false
    plugin_call: false
    provider_contact: false
    runtime: false
    memory_write: false
    DailyNote_write: false
```

## Phase Delta

```yaml
phase_delta:
  phase: v7.196_smart_commander_scenario_training_gate
  purpose: >
    Define scenario-based commander training for common local project states.
    Each scenario maps inputs to expected commander behavior so Smart Commander
    can decide when to execute directly, delegate, consolidate, continue, or
    stop and ask.
  creates:
    - scenario_training_inputs
    - scenario_matrix
    - expected_commander_behavior_rules
    - stop_and_ask_examples
    - scenario_closeout_expectations
  does_not_create:
    - AGENTS_update
    - runtime_behavior
    - push_execution
    - validator_execution
    - dependency_or_config_change
```

## Scenario Training Inputs

```yaml
scenario_training_inputs:
  repository:
    - git_status_short
    - branch
    - pending_push_state
    - latest_closeout_status

  task:
    - docs_only
    - file_count
    - write_set_clarity
    - task_size
    - new_value
    - redundancy
    - validation_need

  risk:
    - push_or_A5
    - runtime_plugin_provider_image_memory
    - VCPChat_VCPToolBox_manifest_read
    - dependency_or_config
    - secret_or_env
```

## Scenario Matrix

```yaml
scenario_matrix:
  clean_small_docs_gate:
    signals:
      git_status: clean
      docs_only: true
      file_count: 1
      write_set: clear
      task_size: small
      new_value: true
      validation: git_only
    expected_commander_behavior:
      mode: direct_commander_execution
      action: create_or_update_allowlisted_doc
      validation:
        - git status --short
        - git diff -- <allowlisted_file>
        - git diff --check
      commit: commander_commits_allowlisted_file
      stop_required: false

  large_single_docs_gate:
    signals:
      git_status: clean
      docs_only: true
      file_count: 1
      write_set: clear
      task_size: large
      new_value: true
      validation: git_only
    expected_commander_behavior:
      mode: direct_commander_execution_or_single_worker
      choose_direct_when: commander_can_write_and_review_efficiently
      choose_worker_when: drafting_help_materially_improves_quality_or_speed
      worker_limits:
        - one_allowlisted_file
        - no_stage
        - no_commit
        - no_push
        - no_next_phase_decision
      commander_must_review: true

  multiple_disjoint_docs_tasks:
    signals:
      git_status: clean
      docs_only: true
      file_count: multiple
      write_set: multiple_disjoint_files
      parallel_benefit: clear
      validation: git_only
    expected_commander_behavior:
      mode: multiple_workers_or_serial_direct_execution
      choose_multiple_workers_when: each_worker_has_disjoint_write_set
      integration: commander_reviews_serially
      commit_policy: commander_commits_after_review
      stop_required_if_write_sets_overlap: true

  dirty_tree:
    signals:
      git_status: dirty
      user_owned_changes_possible: true
    expected_commander_behavior:
      mode: stop_and_ask
      action: report_dirty_tree
      worker_spawn: false
      stage_or_commit: false
      stop_required: true

  pending_push_accumulated:
    signals:
      git_status: clean
      ahead_count: "> 0"
      pending_commits: docs_only_or_unknown
    expected_commander_behavior:
      mode: continue_docs_only_or_stop_for_push_context
      may_continue_when:
        - pending_commits_are_known_docs_only
        - user_has_not_requested_push
        - next_task_is_A4_docs_only
      must_stop_when:
        - push_requested
        - pending_commits_unknown_or_mixed
        - remote_sync_truth_is_needed
      push_performed: false_without_explicit_authorization

  repetitive_policy_gate:
    signals:
      docs_only: true
      repeated_rules: true
      new_value: low_or_none
      previous_gates_stable: true
    expected_commander_behavior:
      mode: stop_and_ask_or_propose_consolidation_gate
      action: avoid_redundant_gate
      may_propose: consolidation_gate
      must_not: auto_modify_AGENTS_md

  A5_runtime_needed:
    signals:
      requires_A5: true
      or_runtime_plugin_provider_image_memory_needed: true
      or_VCPChat_VCPToolBox_manifest_read_needed: true
    expected_commander_behavior:
      mode: stop_and_ask
      action: prepare_authorization_scope_summary
      worker_spawn: false
      local_docs_continuation: false_unless_user_reframes_task

  low_value_next_task:
    signals:
      docs_only: true
      new_value: low
      redundancy: high
      quality_floor_at_risk: true
    expected_commander_behavior:
      mode: stop_and_ask
      action: explain_low_value_and_request_next_distinct_goal
      may_recommend: consolidation_or_pause
      commit_policy: no_commit_for_low_value_noise
```

## Expected Commander Behavior Rules

```yaml
expected_commander_behavior_rules:
  direct_execution:
    use_when:
      - small_single_file_docs_only
      - clear_write_set
      - new_decision_or_boundary_value
      - git_only_validation_sufficient

  single_worker:
    use_when:
      - single_file_docs_only
      - task_is_large_or_benefits_from_drafting_help
      - commander_can_review_quickly
      - worker_boundary_is_crisp

  multiple_workers:
    use_when:
      - multiple_docs_only_tasks
      - write_sets_are_disjoint
      - parallel_benefit_is_clear
      - commander_can_integrate_serially

  stop_and_ask:
    use_when:
      - dirty_tree
      - unclear_write_set
      - failed_validation
      - push_or_A5_needed
      - non_docs_or_external_risk
      - dependency_or_config_needed
      - secret_risk
      - low_value_or_redundant_task
```

## Stop-And-Ask Examples

```yaml
stop_and_ask_examples:
  dirty_tree:
    commander_message: "Working tree is dirty; need user direction before continuing."

  overlapping_write_sets:
    commander_message: "Write set is unclear or overlapping; need narrowed file scope."

  push_requested:
    commander_message: "Push needs explicit authorization and push safety review."

  runtime_needed:
    commander_message: "Runtime or A5 action is outside A4 docs-only; need explicit authorization."

  repetitive_gate:
    commander_message: "Next gate appears redundant; recommend consolidation or a distinct goal."
```

## Anti-Redundancy And Quality Rule

```yaml
anti_redundancy_and_quality_rule:
  commander_must_check:
    - does_this_scenario_add_new_operating_clarity
    - is_the_expected_behavior_distinct
    - can_the_closeout_be_truthful
    - does_the_gate_reduce_future_uncertainty

  stop_when:
    - scenario_only_repeats_previous_policy
    - expected_behavior_is_generic
    - quality_floor_cannot_be_met
```

## Explicit Non-Authorization Statement

```yaml
not_authorized_by_v7_196:
  AGENTS_md_update: false
  push: false
  tag: false
  release: false
  A5: false
  runtime_execution: false
  plugin_call: false
  provider_contact: false
  image_generation: false
  DailyNote_write: false
  VCP_memory_write: false
  VCPChat_read: false
  VCPToolBox_read: false
  real_manifest_read: false
  validator_execution: false
  script_execution: false
  PowerShell_script_execution: false
  dependency_change: false
  config_change: false
```

Scenario training is a local decision aid. It does not authorize external,
runtime, memory, dependency, config, or governance-file changes.

## Pass Conditions

```yaml
pass_conditions:
  - only docs/v7_196_smart_commander_scenario_training_gate.md modified
  - fixed_gate_template_used
  - phase_delta_defined
  - scenario_training_inputs_defined
  - scenario_matrix_defined
  - clean_small_docs_gate_covered
  - large_single_docs_gate_covered
  - multiple_disjoint_docs_tasks_covered
  - dirty_tree_covered
  - pending_push_accumulated_covered
  - repetitive_policy_gate_covered
  - A5_runtime_needed_covered
  - low_value_next_task_covered
  - expected_commander_behavior_defined
  - explicit_non_authorization_statement_defined
  - git_diff_check_passed
  - no_AGENTS_md_update
  - no runtime/plugin/provider/image/memory path opened
```

## Block Conditions

```yaml
block_conditions:
  - more_than_one_file_modified
  - AGENTS_md_update_attempted
  - push_attempted
  - validator_or_script_required
  - PowerShell_script_required
  - runtime_plugin_provider_image_memory_required
  - VCPChat_or_VCPToolBox_or_real_manifest_read_required
  - dependency_or_config_change_required
  - suspected_secret_detected
```

## Closeout Template

```yaml
closeout:
  phase: v7.196_smart_commander_scenario_training_gate
  execution_mode_selected_by_commander: direct_commander_execution
  commit_hash: <hash_or_null_if_not_committed>
  commit_message: "docs: add v7.196 smart commander scenario training"
  branch: master
  git_status: <status>
  changed_files: 1
  local_scope_result: passed | failed
  push: not_performed

  scenario_training:
    scenario_training_inputs_defined: true
    scenario_matrix_defined: true
    clean_small_docs_gate_covered: true
    large_single_docs_gate_covered: true
    multiple_disjoint_docs_tasks_covered: true
    dirty_tree_covered: true
    pending_push_accumulated_covered: true
    repetitive_policy_gate_covered: true
    A5_runtime_needed_covered: true
    low_value_next_task_covered: true
    expected_commander_behavior_defined: true

  validation:
    git_diff_check: passed | failed
    validator_executed: false
    script_executed: false
    powershell_script_executed: false

  safety_boundaries:
    AGENTS_md_updated: false
    push_performed: false
    tag_performed: false
    release_performed: false
    A5_entered: false
    runtime_accessed: false
    plugin_called: false
    provider_contacted: false
    image_generated: false
    daily_note_written: false
    vcp_memory_written: false
    VCPChat_accessed: false
    VCPToolBox_accessed: false
    real_manifest_read: false
    dependency_changed: false
    config_changed: false

final_state:
  commit_completed: true | false
  push_completed: false
  next_phase_started: false
```
