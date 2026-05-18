# v7.195 Smart Commander Backlog Selection Gate

## Executive Verdict

```yaml
executive_verdict:
  overall_status: pass
  base_contract: AGENTS.md
  gate_model: fixed_A4_docs_only_gate_template_plus_phase_delta
  execution_mode_selected_by_commander: direct_commander_execution
  selection_reason: "single-file A4 docs-only gate with clear write set and new backlog-selection value"
  smart_commander_backlog_selection_defined: true
  AGENTS_md_update_allowed_now: false
  image_generation_allowed_now: false
  plugin_call_allowed_now: false
  provider_contact_allowed_now: false
  memory_write_path_allowed_now: false
  runtime_execution_allowed_now: false
  recommended_next_phase: choose_by_backlog_selection_policy
```

This gate defines how Smart Commander selects the next best task from the local
backlog. It balances project state, recent closeout, pending push state, task
value, redundancy, risk boundaries, and the user's current goal.

## Fixed Gate Template

```yaml
gate_template:
  phase: v7.195_smart_commander_backlog_selection_gate
  base_contract: AGENTS.md
  mode: A4
  intent: local_implementation
  risk_level: R0
  allowed_files:
    - docs/v7_195_smart_commander_backlog_selection_gate.md
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
    - create docs-only smart commander backlog selection gate
    - define next-best-task inputs
    - define backlog scoring policy
    - define redundancy and consolidation checks
    - define risk boundary filters
    - define user-goal priority rules
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
      - git diff -- docs/v7_195_smart_commander_backlog_selection_gate.md
      - git diff --check
    forbidden:
      - validator execution
      - script execution
      - PowerShell script execution
      - runtime execution
  commit:
    allowed: true
    message: "docs: add v7.195 smart commander backlog selection"
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
  phase: v7.195_smart_commander_backlog_selection_gate
  purpose: >
    Define how Smart Commander chooses the next best task from the local
    backlog by evaluating project state, recent closeout, pending push, task
    value, redundancy, risk boundaries, and the user's explicit goal.
  creates:
    - backlog_selection_inputs
    - next_best_task_scoring
    - user_goal_priority_rule
    - pending_push_handling_rule
    - redundancy_filter
    - risk_boundary_filter
    - commander_backlog_decision_matrix
  does_not_create:
    - AGENTS_update
    - backlog_file
    - remote_issue
    - push_execution
    - runtime_execution
```

## Backlog Selection Inputs

```yaml
backlog_selection_inputs:
  project_state:
    - current_branch
    - git_status_short
    - latest_commit
    - pending_push_state
    - known_docs_only_gate_sequence

  recent_closeout:
    - previous_phase
    - previous_closeout_status
    - validation_result
    - changed_files
    - boundary_result
    - recommended_next

  task_candidate:
    - phase_id
    - task_type
    - expected_write_set
    - expected_validation
    - new_decision_value
    - consolidation_value
    - redundancy_risk
    - boundary_risk

  user_goal:
    - explicit_current_request
    - allowed_scope
    - forbidden_scope
    - requested_commit_message
    - requested_closeout_shape
```

The explicit user goal is the top task-priority signal inside safety boundaries.
Backlog selection is used to choose the best safe next task, not to override the
user's requested scope.

## Next Best Task Scoring

```yaml
next_best_task_scoring:
  positive_signals:
    user_explicitly_requested_task: 100
    fixes_failed_or_incomplete_previous_closeout: 80
    unlocks_clear_next_docs_only_boundary: 60
    consolidates_stable_repeated_rules: 50
    adds_new_decision_or_boundary_value: 40
    improves_future_commander_worker_safety: 30
    low_risk_single_file_write_set: 20

  negative_signals:
    repeats_existing_template_without_new_value: -50
    pending_push_requires_decision: -40
    unclear_write_set: -80
    requires_validator_script_or_PowerShell: -90
    requires_dependency_or_config_change: -100
    requires_push_A5_runtime_or_external_read: -100
    suspected_secret_or_sensitive_data_risk: -100

  selection_rule: >
    Choose the highest-value candidate only if it remains inside A4 docs-only
    boundaries and passes all hard filters. If no candidate passes, stop and ask.
```

Scoring is advisory. Hard stops always override score.

## User Goal Priority Rule

```yaml
user_goal_priority_rule:
  rule: >
    The current explicit user request is the commander backlog anchor. The
    commander may infer the next safe local docs-only task only when the user's
    goal authorizes continuation and all continuation conditions pass.
  commander_must_not:
    - replace_user_goal_with_private_backlog_preference
    - start_unrequested_push_or_A5_work
    - update_AGENTS_md_without_explicit_gate
    - open_runtime_or_external_reads_as_backlog_tasks
```

When the user names a phase, that phase wins unless it is blocked by safety or
repository reality.

## Pending Push Handling Rule

```yaml
pending_push_handling_rule:
  pending_push_state_can_be:
    - none
    - known_docs_only_pending_commits
    - unknown_or_mixed_pending_commits
    - push_requested_by_user

  commander_may_continue_docs_only_when:
    - pending_push_state in [none, known_docs_only_pending_commits]
    - working_tree_clean
    - next_task_is_A4_docs_only
    - user_has_not_requested_push

  commander_must_stop_when:
    - push_requested_by_user
    - pending_commits_unknown_or_mixed
    - push_safety_gate_required_before_next_action
    - remote_sync_status_is_required_for_truthful_closeout
```

Pending push is not automatically a blocker for more local docs-only work, but
it is always a blocker for remote action without explicit authorization.

## Redundancy Filter

```yaml
redundancy_filter:
  reject_candidate_when:
    - repeats_previous_gate_without_new_decision
    - only_changes_phase_number_and_closeout
    - adds_non_authorization_statement_without_new_boundary
    - restates_commander_worker_rules_already_ready_for_consolidation

  prefer_candidate_when:
    - resolves_repetition_by_consolidation
    - creates_a_clear_index_or_policy_summary
    - removes_future_ambiguity
    - establishes_a_new_stop_condition_or_decision_test
```

The commander should not produce gates as paperwork confetti. A new gate must
earn its place.

## Risk Boundary Filter

```yaml
risk_boundary_filter:
  hard_reject_when_candidate_requires:
    - push
    - tag
    - release
    - A5
    - runtime_execution
    - plugin_call
    - provider_contact
    - image_generation
    - DailyNote_write
    - VCP_memory_write
    - VCPChat_read
    - VCPToolBox_read
    - real_manifest_read
    - validator_execution
    - script_execution
    - PowerShell_script_execution
    - dependency_change
    - config_change
    - env_or_secret_change
    - multi_file_overreach
```

Hard-rejected candidates require user confirmation or a different authorization
gate before any work begins.

## Commander Backlog Decision Matrix

```yaml
commander_backlog_decision_matrix:
  explicit_user_docs_only_single_file_task:
    decision: execute_requested_gate
    mode: direct_commander_execution

  explicit_user_docs_only_large_single_file_task:
    decision: execute_requested_gate
    mode: direct_or_single_worker_based_on_drafting_value

  multiple_independent_docs_only_candidates:
    decision: choose_highest_value_or_parallelize_if_disjoint
    mode: direct_or_multiple_workers

  stable_repeated_rules_detected:
    decision: propose_or_execute_consolidation_gate_when_authorized
    mode: direct_commander_execution

  pending_push_requested:
    decision: stop_for_push_authorization_or_push_safety_gate
    mode: stop_and_ask

  unclear_scope_or_rising_risk:
    decision: stop_and_ask
    mode: stop_and_ask
```

## Explicit Non-Authorization Statement

```yaml
not_authorized_by_v7_195:
  AGENTS_md_update: false
  backlog_file_creation: false
  remote_issue_creation: false
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

Backlog selection is a local planning policy. It does not authorize remote,
runtime, memory, dependency, config, or governance-file changes.

## Pass Conditions

```yaml
pass_conditions:
  - only docs/v7_195_smart_commander_backlog_selection_gate.md modified
  - fixed_gate_template_used
  - phase_delta_defined
  - backlog_selection_inputs_defined
  - next_best_task_scoring_defined
  - user_goal_priority_rule_defined
  - pending_push_handling_rule_defined
  - redundancy_filter_defined
  - risk_boundary_filter_defined
  - commander_backlog_decision_matrix_defined
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
  - dirty_tree_detected_before_start
  - write_set_unclear
  - scope_expansion_required
  - push_or_A5_required
  - runtime_plugin_provider_image_memory_required
  - VCPChat_or_VCPToolBox_or_real_manifest_read_required
  - dependency_or_config_change_required
  - validator_or_script_required
  - suspected_secret_detected
```

## Closeout Template

```yaml
closeout:
  phase: v7.195_smart_commander_backlog_selection_gate
  execution_mode_selected_by_commander: direct_commander_execution
  commit_hash: <hash_or_null_if_not_committed>
  commit_message: "docs: add v7.195 smart commander backlog selection"
  branch: master
  git_status: <status>
  changed_files: 1
  local_scope_result: passed | failed
  push: not_performed

  backlog_selection:
    backlog_selection_inputs_defined: true
    next_best_task_scoring_defined: true
    user_goal_priority_rule_defined: true
    pending_push_handling_rule_defined: true
    redundancy_filter_defined: true
    risk_boundary_filter_defined: true
    commander_backlog_decision_matrix_defined: true

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
