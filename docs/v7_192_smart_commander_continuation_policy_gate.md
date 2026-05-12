# v7.192 Smart Commander Continuation Policy Gate

## Executive Verdict

```yaml
executive_verdict:
  overall_status: pass
  base_contract: AGENTS.md
  gate_model: fixed_A4_docs_only_gate_template_plus_phase_delta
  execution_mode_selected_by_commander: direct_commander_execution
  selection_reason: "single-file A4 docs-only gate with clear write set and no parallel benefit"
  smart_commander_continuation_policy_defined: true
  AGENTS_md_update_allowed_now: false
  image_generation_allowed_now: false
  plugin_call_allowed_now: false
  provider_contact_allowed_now: false
  memory_write_path_allowed_now: false
  runtime_execution_allowed_now: false
  recommended_next_phase: v7.193_smart_commander_agreement_review_gate
```

This gate defines when Smart Commander may continue across consecutive v7.x A4
docs-only gates and when it must stop for user confirmation. It does not update
`AGENTS.md`, does not authorize push, and does not authorize A5, runtime,
plugin, provider, image, DailyNote, VCP memory, dependency, or config changes.

## Fixed Gate Template

```yaml
gate_template:
  phase: v7.192_smart_commander_continuation_policy_gate
  base_contract: AGENTS.md
  mode: A4
  intent: local_implementation
  risk_level: R0
  allowed_files:
    - docs/v7_192_smart_commander_continuation_policy_gate.md
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
  allowed_actions:
    - create docs-only smart commander continuation policy gate
    - define continuation preconditions
    - define continuation stop conditions
    - define mode selection during continuation
    - define pending-push handling boundary
    - define quality stop rules
    - run allowed Git checks
    - stage only allowlisted file
    - commit only allowlisted file
  forbidden_actions:
    - update AGENTS.md
    - push
    - tag
    - release
    - A5
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
      - git diff -- docs/v7_192_smart_commander_continuation_policy_gate.md
      - git diff --check
    forbidden:
      - validator execution
      - script execution
      - PowerShell script execution
      - runtime execution
  commit:
    allowed: true
    message: "docs: add v7.192 smart commander continuation policy"
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
  phase: v7.192_smart_commander_continuation_policy_gate
  purpose: >
    Define Smart Commander continuation policy for consecutive v7.x A4
    docs-only gates. The commander may continue when the repository is clean,
    the previous closeout passed, the next task remains docs-only, the write set
    is clear, and no push/A5/runtime/plugin/provider/image/memory/dependency/
    config risk appears. The commander must stop when safety, scope, validation,
    quality, or authority boundaries become unclear.
  creates:
    - continuation_preconditions
    - allowed_continuation_actions
    - continuation_mode_selection
    - mandatory_stop_conditions
    - pending_push_boundary
    - quality_stop_rule
  does_not_create:
    - AGENTS_update
    - worker_trial
    - runtime_adapter
    - plugin_execution_path
    - provider_contact_path
    - memory_write_path
```

## Continuation Preconditions

```yaml
continuation_preconditions:
  all_required:
    - git_status_short_clean_before_start
    - previous_closeout_status_passed
    - previous_closeout_reviewed_by_commander
    - next_task_is_v7_x
    - next_task_mode_is_A4
    - next_task_is_docs_only
    - write_set_is_exact_and_clear
    - no_push_tag_release_required
    - no_A5_required
    - no_runtime_required
    - no_plugin_or_provider_required
    - no_image_generation_required
    - no_memory_or_DailyNote_required
    - no_VCPChat_or_VCPToolBox_or_real_manifest_read_required
    - no_dependency_or_config_change_required
    - no_validator_or_script_required
    - no_suspected_secret
```

Smart Commander continuation is allowed only when every precondition is true.
Continuation is local, reversible docs-only movement, not permission escalation.

## Allowed Continuation Actions

```yaml
allowed_continuation_actions:
  commander_may:
    - choose_next_docs_only_gate
    - choose_execution_mode
    - generate_phase_delta
    - execute_directly_when_small_single_file
    - spawn_single_worker_when_scope_is_bounded
    - spawn_multiple_workers_when_write_sets_are_disjoint
    - review_worker_closeout
    - run_allowed_git_checks
    - stage_only_allowlisted_file
    - commit_only_allowlisted_file
    - output_commander_reviewed_closeout

  commander_must_preserve:
    - AGENTS_md_not_updated_by_this_gate
    - push_requires_explicit_user_authorization
    - A5_requires_explicit_A5_authorization
    - runtime_plugin_provider_image_memory_remain_hard_stop
    - VCPChat_VCPToolBox_real_manifest_reads_remain_hard_stop
```

## Continuation Mode Selection

```yaml
continuation_mode_selection:
  direct_execution:
    choose_when:
      - small_single_file_docs_only_gate
      - clear_write_set
      - git_only_validation
      - no_parallel_benefit

  single_worker:
    choose_when:
      - docs_only_gate_is_larger_or_review_benefits_from_worker
      - one_clear_allowlisted_file
      - worker_scope_is_disjoint
      - commander_can_review_before_stage_or_commit

  multiple_workers:
    choose_when:
      - multiple_docs_only_tasks_are_independent
      - every_worker_has_disjoint_write_set
      - parallel_benefit_is_clear
      - commander_can_integrate_serially

  stop_and_ask:
    choose_when:
      - any_precondition_fails
      - authority_or_quality_is_unclear
      - next_step_leaves_A4_docs_only
```

The commander chooses the smallest useful execution mode. Worker use is a tool,
not a default ritual.

## Mandatory Stop Conditions

```yaml
mandatory_stop_conditions:
  repository_state:
    - dirty_tree_detected_before_start
    - unexpected_file_changed
    - user_owned_change_detected
    - pending_push_needs_decision

  validation:
    - git_diff_check_failed
    - required_validation_not_allowed
    - validator_or_script_needed
    - PowerShell_script_needed

  scope:
    - write_set_unclear
    - multi_file_overreach_needed
    - scope_expansion_requested_or_required
    - non_docs_only_file_needed
    - dependency_or_config_change_needed

  boundary:
    - push_tag_release_needed
    - A5_needed
    - runtime_needed
    - plugin_or_provider_needed
    - image_generation_needed
    - memory_or_DailyNote_needed
    - VCPChat_or_VCPToolBox_or_real_manifest_read_needed
    - suspected_secret_detected

  quality:
    - generated_phase_delta_is_too_vague
    - closeout_is_inconsistent
    - worker_output_quality_insufficient
    - commander_cannot_truthfully_validate_completion
```

When a stop condition appears, the commander must stop and request user
confirmation or a narrowed task. It must not route unsafe uncertainty to a
worker.

## Pending Push Boundary

```yaml
pending_push_boundary:
  pending_push_may_exist_after_local_commits: true
  pending_push_does_not_authorize_push: true
  commander_may_continue_docs_only_gates_when:
    - working_tree_is_clean
    - pending_commits_are_known_local_docs_only_commits
    - next_task_remains_A4_docs_only
    - user_has_not_requested_push
  commander_must_stop_when:
    - user_requests_push
    - push_readiness_gate_is_required
    - remote_sync_or_origin_head_must_be_verified
    - pending_commit_set_is_unknown_or_mixed
```

Pending push is a boundary marker, not automatic remote authorization.

## Quality Stop Rule

```yaml
quality_stop_rule:
  commander_must_stop_or_rework_before_commit_when:
    - document_does_not_answer_the_phase_goal
    - required_sections_are_missing
    - boundary_rules_are_ambiguous
    - closeout_would_overclaim_validation
    - worker_summary_conflicts_with_repository_reality
    - diff_contains_unrelated_or_low_quality_filler
```

Autonomy is sustained only while quality remains high enough to review and
validate honestly.

## Explicit Non-Authorization Statement

```yaml
not_authorized_by_v7_192:
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
  multi_file_overreach: false
```

This policy allows continued local docs-only progress. It does not authorize
remote, runtime, production, memory, dependency, config, or governance-file
changes.

## Pass Conditions

```yaml
pass_conditions:
  - only docs/v7_192_smart_commander_continuation_policy_gate.md modified
  - fixed_gate_template_used
  - phase_delta_defined
  - continuation_preconditions_defined
  - allowed_continuation_actions_defined
  - continuation_mode_selection_defined
  - mandatory_stop_conditions_defined
  - pending_push_boundary_defined
  - quality_stop_rule_defined
  - explicit_non_authorization_statement_defined
  - git_diff_check_passed
  - no AGENTS_md_update
  - no runtime/plugin/provider/image/memory path opened
```

## Block Conditions

```yaml
block_conditions:
  - more_than_one_file_modified
  - AGENTS_md_update_attempted
  - dirty_tree_detected_before_start
  - validation_failed
  - write_set_unclear
  - scope_expansion_required
  - pending_push_requires_user_decision
  - quality_insufficient
  - next_step_enters_push_or_A5_or_non_docs_only
  - runtime_access_required
  - plugin_or_provider_or_image_or_memory_required
  - VCPChat_or_VCPToolBox_or_real_manifest_read_required
  - dependency_or_config_change_required
  - suspected_secret_detected
```

## Closeout Template

```yaml
closeout:
  phase: v7.192_smart_commander_continuation_policy_gate
  execution_mode_selected_by_commander: direct_commander_execution
  commit_hash: <hash_or_null_if_not_committed>
  commit_message: "docs: add v7.192 smart commander continuation policy"
  branch: master
  git_status: <status>
  changed_files: 1
  local_scope_result: passed | failed
  push: not_performed

  continuation_policy:
    continuation_preconditions_defined: true
    allowed_continuation_actions_defined: true
    continuation_mode_selection_defined: true
    mandatory_stop_conditions_defined: true
    pending_push_boundary_defined: true
    quality_stop_rule_defined: true

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
