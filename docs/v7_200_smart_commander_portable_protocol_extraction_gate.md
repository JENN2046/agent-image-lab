# v7.200 Smart Commander Portable Protocol Extraction Gate

## Executive Verdict

```yaml
executive_verdict:
  overall_status: pass
  base_contract: AGENTS.md
  gate_model: fixed_A4_docs_only_gate_template_plus_phase_delta
  execution_mode_selected_by_commander: direct_commander_execution
  selection_reason: "single-file A4 docs-only portable protocol extraction with clear write set"
  source_plan: v7.198_smart_commander_consolidation_plan_gate
  source_hardening: v7.199_agents_smart_commander_slim_hardening_gate
  portable_protocol_extracted: true
  project_specific_content_removed: true
  AGENTS_md_update_allowed_now: false
  runtime_execution_allowed_now: false
  recommended_next_phase: optional_portable_template_index_gate
```

This gate extracts a project-independent Smart Sustained Commander portable
protocol. It removes VCP, image-production, and v7.x-specific assumptions while
preserving the reusable operating model.

## Fixed Gate Template

```yaml
gate_template:
  phase: v7.200_smart_commander_portable_protocol_extraction_gate
  base_contract: AGENTS.md
  mode: A4
  intent: local_implementation
  risk_level: R0
  allowed_files:
    - docs/v7_200_smart_commander_portable_protocol_extraction_gate.md
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
    - create docs-only portable protocol extraction gate
    - remove project-specific VCP/image/v7.x assumptions
    - define portable mode selection
    - define disjoint write set rule
    - define worker closeout protocol
    - define commander review protocol
    - define quality/redundancy/consolidation judgment
    - define guarded commit policy
    - define guarded push preconditions
    - define stop conditions
    - define reusable task template
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
    - plugin call
    - provider contact
    - image generation
    - memory write
    - dependency change
    - config change
  validation:
    required:
      - git status --short
      - git diff -- docs/v7_200_smart_commander_portable_protocol_extraction_gate.md
      - git diff --check
    forbidden:
      - validator execution
      - script execution
      - PowerShell script execution
      - runtime execution
  commit:
    allowed: true
    message: "docs: add v7.200 smart commander portable protocol extraction"
  push:
    allowed: false
  explicit_non_authorization:
    runtime: false
    external_write: false
    dependency_change: false
    config_change: false
```

## Phase Delta

```yaml
phase_delta:
  phase: v7.200_smart_commander_portable_protocol_extraction_gate
  purpose: >
    Extract a reusable Smart Sustained Commander protocol from project-specific
    training. The protocol should apply to local, reversible, validated work in
    other repositories without carrying Agent Image Lab's domain-specific VCP,
    image, or v7.x gate details.
  source_material:
    - v7.198_smart_commander_consolidation_plan_gate
    - v7.199_agents_smart_commander_slim_hardening_gate
  creates:
    - portable_mode_selection
    - portable_disjoint_write_set_rule
    - portable_worker_closeout_protocol
    - portable_commander_review_protocol
    - portable_quality_redundancy_consolidation_judgment
    - portable_guarded_commit_policy
    - portable_guarded_push_preconditions
    - portable_stop_conditions
    - reusable_task_template
  removes_from_portable_protocol:
    - VCP_specific_boundaries
    - image_generation_specific_boundaries
    - v7_x_phase_assumptions
    - Agent_Image_Lab_specific_file_surfaces
  does_not_create:
    - skill
    - global_config
    - AGENTS_update
    - automation
    - remote_action
```

## Portable Protocol Scope

```yaml
portable_protocol_scope:
  applies_to:
    - local_repository_work
    - reversible_changes
    - explicit_user_tasks
    - docs_or_code_tasks_with_clear_write_sets
    - validation_available_or_validation_gap_documented

  does_not_assume:
    - a specific project domain
    - a specific phase numbering system
    - a specific runtime platform
    - a specific external service
    - image_generation_work
    - VCP_or_agent_image_lab_infrastructure
```

The portable protocol is an execution-control pattern, not a project roadmap.

## Mode Selection

```yaml
mode_selection:
  direct_commander_execution:
    choose_when:
      - task_is_small_or_medium
      - write_set_is_clear
      - commander_can_complete_and_validate_efficiently
      - no_parallel_benefit
      - risk_is_low_or_medium_and_reversible

  commander_plus_single_worker:
    choose_when:
      - task_is_bounded
      - one_worker_can_own_one_clear_write_set
      - drafting_or_implementation_help_improves_quality_or_speed
      - commander_can_review_output_before_stage_or_commit

  commander_plus_multiple_workers:
    choose_when:
      - tasks_are_independent
      - write_sets_are_disjoint
      - parallel_benefit_is_clear
      - commander_can_integrate_serially

  stop_and_ask:
    choose_when:
      - authority_is_unclear
      - risk_is_high_or_irreversible
      - write_set_is_unclear_or_overlapping
      - validation_needed_is_not_allowed
      - remote_or_external_side_effect_is_needed
      - secret_or_sensitive_data_risk_exists
```

Mode selection is routing judgment, not permission escalation.

## Disjoint Write Set Rule

```yaml
disjoint_write_set_rule:
  required_for_workers: true
  rule: >
    Each worker must receive an exact, non-overlapping write set. If write sets
    overlap or become unclear, stop delegation and return control to the
    commander.
  commander_responsibilities:
    - define write set before delegation
    - avoid assigning the same file to multiple workers
    - pause edits to worker-owned files until worker returns
    - integrate results serially
  worker_responsibilities:
    - modify only assigned files
    - stop on required out-of-scope edits
    - report blockers instead of broadening scope
```

Clear write ownership is the core safety condition for parallel work.

## Worker Closeout Protocol

```yaml
worker_closeout_protocol:
  worker_must_report:
    - task_id
    - changed_files
    - files_intentionally_modified
    - validation_run
    - validation_result
    - validation_not_run
    - blockers
    - forbidden_actions_performed
    - commit_performed
    - push_performed
    - next_phase_decided

  worker_must_not:
    - stage_unless_explicitly_authorized_by_task
    - commit_unless_explicitly_authorized_by_task
    - push
    - decide_next_phase
    - broaden_scope
    - hide_validation_gaps
```

Worker closeout is evidence for commander review, not final completion by
itself.

## Commander Review Protocol

```yaml
commander_review_protocol:
  before_accepting_worker_output:
    - inspect_worker_closeout
    - inspect_repository_status
    - inspect_diff_for_assigned_write_set
    - confirm_no_unexpected_files_changed
    - confirm_validation_claims_match_observed_output
    - confirm_no_forbidden_actions_occurred
    - decide_accept_revise_or_stop

  commander_owns:
    - final_scope_judgment
    - final_validation_claim
    - final_stage_decision
    - final_commit_decision
    - final_user_closeout
```

The commander must verify repository reality instead of trusting summaries
blindly.

## Quality, Redundancy, And Consolidation Judgment

```yaml
quality_redundancy_consolidation_judgment:
  quality_floor:
    - task_goal_answered
    - diff_is_coherent
    - validation_status_clear
    - no_unrelated_change
    - no_overclaiming
    - closeout_is_truthful

  redundancy_check:
    - does_this_change_add_new_value
    - does_it_repeat_existing_text_or_logic
    - would_consolidation_be_better_than_another_artifact

  consolidation_trigger:
    - repeated_rules_are_stable
    - multiple_artifacts_overlap
    - future_execution_would_benefit_from_one_compact_rule
    - marginal_value_of_new_artifact_is_low
```

Sustained autonomy should reduce confusion, not generate paperwork.

## Guarded Commit Policy

```yaml
guarded_commit_policy:
  local_commit_allowed_when:
    - task_authorizes_local_commit
    - changes_are_inside_allowed_scope
    - diff_reviewed
    - validation_passed_or_gap_documented
    - no_unrelated_or_user_owned_changes_included
    - no_secret_or_sensitive_file_changed
    - no_dependency_or_config_change_unless_authorized
    - commit_is_coherent

  commander_before_commit:
    - git status --short
    - inspect_diff
    - run_required_validation
    - stage_only_reviewed_files
    - use_specific_commit_message
```

Local commit is a checkpoint after review, not a substitute for validation.

## Guarded Push Preconditions

```yaml
guarded_push_preconditions:
  push_allowed_only_when:
    - user_or_standing_authorization_explicitly_allows_push
    - branch_and_remote_target_are_exact
    - working_tree_clean
    - branch_not_behind_remote
    - pending_commits_are_known_and_authorized
    - required_validation_passed
    - no_force_push_needed
    - no_unreviewed_sensitive_or_large_artifacts
    - post_push_verification_is_planned

  always_forbidden_without_explicit_authorization:
    - force_push
    - tag_push
    - release
    - deployment
    - remote_delete
    - pushing_unknown_or_mixed_commits
```

Push is a remote side effect. It remains outside local autonomy unless
explicitly authorized.

## Stop Conditions

```yaml
stop_conditions:
  repository:
    - dirty_tree_with_unexplained_changes
    - user_owned_changes_at_risk
    - unclear_write_set
    - overlapping_worker_write_sets

  validation:
    - validation_failed
    - required_validation_unavailable
    - validation_requires_unapproved_tool_or_environment

  risk:
    - destructive_action_needed
    - remote_write_needed
    - credential_or_secret_risk
    - production_or_real_data_risk
    - dependency_or_global_config_change_needed
    - irreversible_migration_or_data_change_needed

  quality:
    - output_would_be_redundant
    - commander_cannot_truthfully_claim_completion
    - worker_output_conflicts_with_repository_reality
```

Stopping is a successful safety behavior when risk or value becomes unclear.

## Reusable Task Template

```yaml
reusable_task_template:
  task_id: <stable_task_id>
  mode_options:
    - direct_commander_execution
    - commander_plus_single_worker
    - commander_plus_multiple_workers
    - stop_and_ask
  intent: <discussion | planning | review | local_draft | local_implementation | remote_or_side_effectful_action>
  risk_level: <low | medium | high | critical>
  allowed_files: []
  forbidden_files: []
  allowed_commands: []
  forbidden_commands: []
  validation_required: []
  commit_allowed: false
  push_allowed: false
  worker_tasks:
    - id: <worker_task_id>
      write_set: []
      expected_closeout: []
  commander_review:
    - inspect_status
    - inspect_diff
    - verify_validation
    - verify_scope
    - decide_accept_revise_or_stop
  closeout_required:
    - changed_files
    - validation
    - not_validated
    - boundaries
    - next_step
```

This template is intentionally project-neutral.

## Explicit Non-Authorization Statement

```yaml
not_authorized_by_v7_200:
  AGENTS_md_update: false
  skill_creation: false
  global_config_change: false
  push: false
  tag: false
  release: false
  runtime_execution: false
  plugin_call: false
  provider_contact: false
  image_generation: false
  memory_write: false
  validator_execution: false
  script_execution: false
  PowerShell_script_execution: false
  dependency_change: false
  config_change: false
```

This gate extracts a protocol document only. It does not install, publish, or
apply the protocol outside this file.

## Pass Conditions

```yaml
pass_conditions:
  - only docs/v7_200_smart_commander_portable_protocol_extraction_gate.md modified
  - fixed_gate_template_used
  - phase_delta_defined
  - project_specific_content_removed
  - mode_selection_defined
  - disjoint_write_set_defined
  - worker_closeout_defined
  - commander_review_defined
  - quality_redundancy_consolidation_defined
  - guarded_commit_defined
  - guarded_push_preconditions_defined
  - stop_conditions_defined
  - reusable_task_template_defined
  - git_diff_check_passed
  - no_AGENTS_md_update
  - no runtime/plugin/provider/image/memory path opened
```

## Block Conditions

```yaml
block_conditions:
  - more_than_one_file_modified
  - AGENTS_md_update_attempted
  - project_specific_VCP_or_image_assumption_kept_as_portable_rule
  - push_attempted
  - validator_or_script_required
  - PowerShell_script_required
  - runtime_plugin_provider_image_memory_required
  - dependency_or_config_change_required
  - suspected_secret_detected
```

## Closeout Template

```yaml
closeout:
  phase: v7.200_smart_commander_portable_protocol_extraction_gate
  execution_mode_selected_by_commander: direct_commander_execution
  commit_hash: <hash_or_null_if_not_committed>
  commit_message: "docs: add v7.200 smart commander portable protocol extraction"
  branch: master
  git_status: <status>
  changed_files: 1
  local_scope_result: passed | failed
  push: not_performed

  portable_protocol:
    project_specific_content_removed: true
    mode_selection_defined: true
    disjoint_write_set_defined: true
    worker_closeout_defined: true
    commander_review_defined: true
    quality_redundancy_consolidation_defined: true
    guarded_commit_defined: true
    guarded_push_preconditions_defined: true
    stop_conditions_defined: true
    reusable_task_template_defined: true

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
    runtime_accessed: false
    plugin_called: false
    provider_contacted: false
    image_generated: false
    memory_written: false
    dependency_changed: false
    config_changed: false

final_state:
  commit_completed: true | false
  push_completed: false
  next_phase_started: false
```
