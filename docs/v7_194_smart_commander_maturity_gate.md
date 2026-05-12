# v7.194 Smart Commander Maturity Gate

## Executive Verdict

```yaml
executive_verdict:
  overall_status: pass
  base_contract: AGENTS.md
  gate_model: fixed_A4_docs_only_gate_template_plus_phase_delta
  execution_mode_selected_by_commander: direct_commander_execution
  selection_reason: "single-file A4 docs-only gate with clear write set and new decision value"
  smart_commander_maturity_model_defined: true
  AGENTS_md_update_allowed_now: false
  image_generation_allowed_now: false
  plugin_call_allowed_now: false
  provider_contact_allowed_now: false
  memory_write_path_allowed_now: false
  runtime_execution_allowed_now: false
  recommended_next_phase: propose_consolidation_gate_if_rules_are_stable
```

This gate upgrades Smart Commander from "keep executing" to "judge whether
continuation is still worth doing." It defines when to continue, delegate,
consolidate, or stop.

## Fixed Gate Template

```yaml
gate_template:
  phase: v7.194_smart_commander_maturity_gate
  base_contract: AGENTS.md
  mode: A4
  intent: local_implementation
  risk_level: R0
  allowed_files:
    - docs/v7_194_smart_commander_maturity_gate.md
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
    - create docs-only smart commander maturity gate
    - define should_continue criteria
    - define should_delegate criteria
    - define should_consolidate criteria
    - define should_stop criteria
    - define anti-redundancy and quality rules
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
    - env_or_secret_change
  validation:
    required:
      - git status --short
      - git diff -- docs/v7_194_smart_commander_maturity_gate.md
      - git diff --check
    forbidden:
      - validator execution
      - script execution
      - PowerShell script execution
      - runtime execution
  commit:
    allowed: true
    message: "docs: add v7.194 smart commander maturity gate"
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
  phase: v7.194_smart_commander_maturity_gate
  purpose: >
    Define a maturity model for Smart Commander so it can decide whether to
    continue, delegate, consolidate, or stop. The model prevents mechanical
    gate production when the next gate has low decision value, unclear scope, or
    rising boundary risk.
  creates:
    - maturity_inputs
    - continuation_value_test
    - delegation_value_test
    - consolidation_trigger
    - stop_conditions
    - anti_redundancy_rule
    - quality_floor
    - commander_decision_matrix
  does_not_create:
    - AGENTS_update
    - push_authorization
    - runtime_adapter
    - plugin_execution_path
    - provider_contact_path
    - image_generation_path
    - memory_write_path
```

## Maturity Inputs

```yaml
maturity_inputs:
  repository_state:
    - git_status_short
    - branch
    - previous_closeout_status
    - pending_push_state

  task_shape:
    - phase_id
    - mode
    - docs_only
    - file_count
    - write_set_clarity
    - validation_required

  value_signals:
    - new_decision_value
    - new_boundary_value
    - reduces_future_uncertainty
    - improves_commander_or_worker_protocol
    - consolidation_readiness

  risk_signals:
    - push_or_remote_risk
    - A5_risk
    - runtime_plugin_provider_image_memory_risk
    - VCPChat_VCPToolBox_manifest_read_risk
    - dependency_config_env_secret_risk
    - quality_or_redundancy_risk
```

The commander must evaluate value and risk together. A gate that is safe but
adds no decision value should not be created just to keep moving.

## Continuation Value Test

```yaml
continuation_value_test:
  should_continue_when_all_true:
    - current_task_is_v7_x_A4_docs_only
    - git_status_clean
    - previous_closeout_passed
    - write_set_clear
    - new_gate_produces_new_decision_or_new_boundary
    - not_repeating_template_or_closeout
    - git_only_validation_is_sufficient
    - no_push_risk
    - no_A5_risk
    - no_runtime_plugin_provider_image_memory_risk
    - no_dependency_config_secret_risk

  should_not_continue_when:
    - gate_would_only_restates_existing_rules
    - closeout_would_overclaim_validation
    - boundary_or_authority_is_unclear
    - quality_floor_cannot_be_met
```

Continuation is justified by new decision value, new boundary value, or clear
consolidation progress. It is not justified by momentum alone.

## Delegation Value Test

```yaml
delegation_value_test:
  should_delegate_when_all_true:
    - worker_is_more_useful_than_direct_commander_execution
    - write_set_is_disjoint
    - worker_task_can_be_single_file
    - worker_output_can_be_quickly_reviewed_by_commander
    - worker_can_complete_without_forbidden_tools
    - commander_can_stage_and_commit_after_review

  worker_must_not:
    - decide_next_phase
    - stage
    - commit
    - push
    - run_validator
    - run_script
    - run_PowerShell_script
    - touch_runtime_plugin_provider_image_memory

  prefer_direct_execution_when:
    - task_is_small_single_file_docs_only
    - commander_can_complete_faster_than_delegation_overhead
    - no_parallel_or_review_benefit_exists
```

Delegation is valuable when it adds drafting capacity, independent review, or
parallel throughput without increasing boundary risk.

## Consolidation Trigger

```yaml
consolidation_trigger:
  propose_consolidation_when:
    - multiple_consecutive_gates_have_passed
    - repeated_rules_are_now_stable
    - multiple_gates_start_repeating_content
    - rules_are_ready_for_AGENTS_or_index_document
    - marginal_value_of_new_gate_is_declining

  consolidation_requires:
    - independent_consolidation_gate
    - exact_file_allowlist
    - explicit_user_task_or_gate_scope
    - git_only_validation_when_docs_only

  commander_must_not:
    - automatically_modify_AGENTS_md
    - silently_merge_rules_into_governance_files
    - skip_review_because_rules_feel_stable
```

Consolidation is a maturity signal. It should be proposed or executed only under
its own authorized gate, not hidden inside another phase.

## Stop Conditions

```yaml
stop_conditions:
  repository:
    - dirty_tree
    - unexpected_file_change
    - pending_push_needs_handling

  validation:
    - validation_failed
    - required_validation_not_allowed
    - git_diff_check_failed

  scope:
    - write_set_unclear
    - scope_expansion_required
    - multi_file_overreach_required
    - next_step_enters_non_docs_only

  hard_boundary:
    - push_needed
    - A5_needed
    - runtime_needed
    - plugin_or_provider_needed
    - image_generation_needed
    - memory_or_DailyNote_needed
    - VCPChat_or_VCPToolBox_or_real_manifest_read_needed
    - dependency_or_config_or_env_change_needed
    - suspected_secret_detected

  quality:
    - document_quality_insufficient
    - gate_is_redundant
    - only_continuing_for_momentum
    - commander_cannot_state_new_value
```

If a stop condition appears, the commander must stop and request user
confirmation or a narrower task.

## Anti-Redundancy Rule

```yaml
anti_redundancy_rule:
  rule: >
    Do not create another gate if the only output is a renamed version of the
    previous gate's template, closeout, or non-authorization statement.
  new_gate_must_add_at_least_one:
    - new decision criterion
    - new boundary condition
    - new review procedure
    - new consolidation target
    - new validated operating rule
  redundant_gate_response:
    - stop
    - propose_consolidation_gate
    - ask_user_for_next_distinct_decision
```

The fixed gate template is a scaffold. It is not the substance.

## Quality Floor

```yaml
quality_floor:
  required:
    - phase_goal_is_answered
    - new_decision_value_is_visible
    - boundaries_are_unambiguous
    - allowed_and_forbidden_actions_are_clear
    - closeout_does_not_overclaim
    - no_filler_sections
    - no_contradiction_with_AGENTS_md
    - no_hidden_permission_escalation
    - git_diff_check_passes

  fail_response:
    - revise_before_commit_if_safe
    - otherwise_stop_and_report_quality_blocker
```

Quality is a safety property. Low-quality governance text creates future
execution risk.

## Commander Decision Matrix

```yaml
commander_decision_matrix:
  small_single_file_docs_only_with_new_value:
    decision: direct_commander_execution
    rationale: "Low overhead, clear write set, sufficient Git-only validation"

  large_single_file_docs_only_needing_drafting_help:
    decision: single_worker
    rationale: "Worker can draft one file; commander reviews and commits"

  multiple_disjoint_docs_only_files_with_clear_parallel_benefit:
    decision: multiple_workers
    rationale: "Parallel work is safe only with mutually exclusive write sets"

  stable_repeated_rules_ready_for_governance:
    decision: propose_consolidation_gate
    rationale: "Consolidation needs its own authorization and allowlist"

  redundant_or_low_quality_or_unclear_scope:
    decision: stop_and_ask
    rationale: "Continuing would create noise or risk"

  push_A5_runtime_plugin_provider_image_memory_or_external_read_needed:
    decision: stop_and_ask
    rationale: "Hard boundary requires explicit authorization"
```

## Explicit Non-Authorization Statement

```yaml
not_authorized_by_v7_194:
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
  env_or_secret_change: false
  multi_file_overreach: false
```

This maturity model improves local judgment. It does not authorize remote,
runtime, production, memory, dependency, config, env, secret, or AGENTS changes.

## Pass Conditions

```yaml
pass_conditions:
  - only docs/v7_194_smart_commander_maturity_gate.md modified
  - fixed_gate_template_used
  - phase_delta_defined
  - maturity_inputs_defined
  - continuation_value_test_defined
  - delegation_value_test_defined
  - consolidation_trigger_defined
  - stop_conditions_defined
  - anti_redundancy_rule_defined
  - quality_floor_defined
  - commander_decision_matrix_defined
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
  - dirty_tree_detected
  - validation_failed
  - write_set_unclear
  - scope_expansion_required
  - pending_push_needs_handling
  - next_step_enters_push_or_A5_or_non_docs_only
  - runtime_plugin_provider_image_memory_risk_detected
  - VCPChat_or_VCPToolBox_or_real_manifest_read_required
  - dependency_config_env_secret_risk_detected
  - document_quality_insufficient
  - gate_exists_only_to_continue_momentum
```

## Closeout Template

```yaml
closeout:
  phase: v7.194_smart_commander_maturity_gate
  execution_mode_selected_by_commander: direct_commander_execution
  commit_hash: <hash_or_null_if_not_committed>
  commit_message: "docs: add v7.194 smart commander maturity gate"
  branch: master
  git_status: <status>
  changed_files: 1
  local_scope_result: passed | failed
  push: not_performed

  maturity_model:
    maturity_inputs_defined: true
    continuation_value_test_defined: true
    delegation_value_test_defined: true
    consolidation_trigger_defined: true
    stop_conditions_defined: true
    anti_redundancy_rule_defined: true
    quality_floor_defined: true
    commander_decision_matrix_defined: true

  validation:
    git_diff_check: passed | failed
    validator_executed: false
    script_executed: false
    powershell_script_executed: false

  safety_boundaries:
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
    AGENTS_md_updated: false
    dependency_changed: false
    config_changed: false
    env_or_secret_changed: false

final_state:
  commit_completed: true | false
  push_completed: false
  next_phase_started: false
```
