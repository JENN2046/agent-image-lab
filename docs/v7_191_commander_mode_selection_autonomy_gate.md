# v7.191 Commander Mode Selection Autonomy Gate

## Executive Verdict

```yaml
executive_verdict:
  overall_status: pass
  base_contract: AGENTS.md
  gate_model: fixed_A4_docs_only_gate_template_plus_phase_delta
  execution_mode_selected_by_commander: direct_commander_execution
  selection_reason: "single-file A4 docs-only gate with clear write set and no parallel benefit"
  smart_commander_mode_selection_defined: true
  image_generation_allowed_now: false
  plugin_call_allowed_now: false
  provider_contact_allowed_now: false
  memory_write_path_allowed_now: false
  runtime_execution_allowed_now: false
  recommended_next_phase: v7.192_agents_smart_commander_update_gate
```

This gate defines Smart Commander mode selection. The commander may choose direct
execution, a single worker, multiple workers, or stop-and-ask based on task size,
risk, write-set clarity, validation needs, parallel benefit, and boundary risk.
This document is itself a direct commander execution because it is a small
single-file docs-only gate.

## Fixed Gate Template

```yaml
gate_template:
  phase: v7.191_commander_mode_selection_autonomy_gate
  base_contract: AGENTS.md
  mode: A4
  intent: local_implementation
  risk_level: R0
  allowed_files:
    - docs/v7_191_commander_mode_selection_autonomy_gate.md
  forbidden_files:
    - AGENTS.md
    - README.md
    - package.json
    - scripts/**
    - .agent_board/**
    - review_console/**
    - integrations/**
    - schemas/**
    - fixtures/**
  allowed_actions:
    - create docs-only commander mode selection autonomy gate
    - define direct commander execution criteria
    - define single worker criteria
    - define multiple worker criteria
    - define stop-and-ask criteria
    - define boundary risk rules
    - run allowed Git checks
    - stage only allowlisted file
    - commit only allowlisted file
  forbidden_actions:
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
      - git diff -- docs/v7_191_commander_mode_selection_autonomy_gate.md
      - git diff --check
    forbidden:
      - validator execution
      - script execution
      - PowerShell script execution
      - runtime execution
  commit:
    allowed: true
    message: "docs: add v7.191 commander mode selection autonomy"
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
  phase: v7.191_commander_mode_selection_autonomy_gate
  purpose: >
    Define Smart Commander mode selection for A4 docs-only work. The commander
    chooses direct execution, single worker, multiple workers, or stop-and-ask
    by evaluating task size, risk level, parallel benefit, write-set
    exclusivity, validation needs, and boundary risk.
  creates:
    - mode_selection_decision_model
    - direct_execution_rule
    - single_worker_rule
    - multiple_worker_rule
    - stop_and_ask_rule
    - boundary_risk_matrix
  does_not_create:
    - worker_trial
    - runtime_adapter
    - plugin_execution_path
    - provider_contact_path
    - memory_write_path
```

## Mode Selection Inputs

```yaml
mode_selection_inputs:
  task_size:
    values: [small, medium, large]
    meaning: "How much content, review, or file work is required"
  risk_level:
    values: [R0, R1, R2, R3, R4]
    meaning: "Boundary and reversibility risk"
  parallel_benefit:
    values: [none, low, clear]
    meaning: "Whether concurrent workers materially reduce time or improve review"
  write_set_clarity:
    values: [single_clear_file, multiple_disjoint_files, unclear_or_overlapping]
    meaning: "Whether file ownership is exact and non-overlapping"
  validation_need:
    values: [git_only, project_validator_needed, runtime_needed]
    meaning: "What evidence is required to complete truthfully"
  boundary_risk:
    values: [none, docs_only, non_docs_or_external, A5_or_secret]
    meaning: "Whether the work might cross hard-stop boundaries"
```

## Direct Commander Execution Rule

```yaml
direct_commander_execution:
  choose_when:
    - task_size in [small, medium]
    - risk_level in [R0, R1]
    - parallel_benefit in [none, low]
    - write_set_clarity == single_clear_file
    - validation_need == git_only
    - boundary_risk in [none, docs_only]
  allowed_for:
    - small single-file docs-only gates
    - narrow documentation patches
    - straightforward closeout or index documents
  commander_may:
    - define phase_delta
    - create or edit the allowlisted file
    - run allowed Git checks
    - stage the allowlisted file
    - commit the allowlisted file
    - output closeout
```

Small single-file docs-only gates should not spawn a worker by habit. Direct
execution is the preferred path when it is simpler, safer, and equally
verifiable.

## Commander Plus Single Worker Rule

```yaml
commander_plus_single_worker:
  choose_when:
    - task_size in [medium, large]
    - risk_level in [R0, R1]
    - parallel_benefit in [low, clear]
    - write_set_clarity == single_clear_file
    - validation_need == git_only
    - boundary_risk in [none, docs_only]
  allowed_for:
    - one larger docs-only gate
    - a bounded drafting task where commander review is useful
    - trialing worker protocol with one disjoint file
  worker_must_not:
    - decide next phase
    - stage
    - commit
    - push
    - run validator
    - run script
    - run PowerShell script
    - touch runtime/plugin/provider/image/memory
  commander_must:
    - assign exact worker_task
    - define disjoint write set
    - review worker_closeout
    - verify status and diff
    - perform any stage/commit itself
```

Single worker mode is for bounded execution assistance, not delegation of
authority.

## Commander Plus Multiple Workers Rule

```yaml
commander_plus_multiple_workers:
  choose_when:
    - task_size == large
    - risk_level in [R0, R1]
    - parallel_benefit == clear
    - write_set_clarity == multiple_disjoint_files
    - validation_need == git_only
    - boundary_risk in [none, docs_only]
  allowed_for:
    - multiple independent docs-only gates
    - read-only review slices
    - disjoint documentation packages with no shared write files
  requirements:
    - one worker per disjoint write set
    - no overlapping file ownership
    - commander integrates serially
    - commander stages and commits only after review
  forbidden:
    - parallel edits to same file
    - worker-owned next phase selection
    - worker stage or commit
    - multi-worker runtime or external work
```

Multiple workers are allowed only when disjoint write sets are clear and
parallelism materially helps. If the write sets overlap, stop or switch to
serial commander execution.

## Stop And Ask Rule

```yaml
stop_and_ask:
  required_when:
    - risk_level in [R3, R4]
    - write_set_clarity == unclear_or_overlapping
    - validation_need in [project_validator_needed, runtime_needed]
    - boundary_risk in [non_docs_or_external, A5_or_secret]
    - dirty_tree_detected
    - suspected_secret_detected
    - dependency_or_config_change_needed
    - push_tag_release_needed
    - VCPChat_or_VCPToolBox_or_real_manifest_read_needed
    - runtime_or_plugin_or_provider_or_image_or_memory_needed
  commander_must:
    - stop before action
    - summarize blocker
    - request explicit authorization or scope clarification
    - avoid worker spawn for unsafe work
```

High-risk or unclear work is not a worker-routing problem. It is an authorization
and scope problem.

## Boundary Risk Matrix

```yaml
boundary_risk_matrix:
  docs_only_single_file_clean:
    default_mode: direct_commander_execution
    worker_allowed: true
    stop_required: false

  docs_only_large_single_file_clean:
    default_mode: commander_plus_single_worker
    worker_allowed: true
    stop_required: false

  docs_only_multiple_disjoint_files_clean:
    default_mode: commander_plus_multiple_workers
    worker_allowed: true
    stop_required: false

  dirty_tree:
    default_mode: stop_and_ask
    worker_allowed: false
    stop_required: true

  unclear_write_set:
    default_mode: stop_and_ask
    worker_allowed: false
    stop_required: true

  validator_or_script_needed:
    default_mode: stop_and_ask
    worker_allowed: false
    stop_required: true

  A5_or_runtime_needed:
    default_mode: stop_and_ask
    worker_allowed: false
    stop_required: true

  push_tag_release_needed:
    default_mode: stop_and_ask
    worker_allowed: false
    stop_required: true

  secret_or_sensitive_data_risk:
    default_mode: stop_and_ask
    worker_allowed: false
    stop_required: true
```

## Explicit Non-Authorization Statement

```yaml
not_authorized_by_v7_191:
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

Mode selection is not permission escalation. It is a local execution-routing
policy inside existing safety boundaries.

## Pass Conditions

```yaml
pass_conditions:
  - only docs/v7_191_commander_mode_selection_autonomy_gate.md modified
  - fixed_gate_template_used
  - phase_delta_defined
  - mode_selection_inputs_defined
  - direct_commander_execution_rule_defined
  - single_worker_rule_defined
  - multiple_worker_rule_defined
  - stop_and_ask_rule_defined
  - boundary_risk_matrix_defined
  - explicit_non_authorization_statement_defined
  - git_diff_check_passed
  - no runtime/plugin/provider/image/memory path opened
```

## Block Conditions

```yaml
block_conditions:
  - more_than_one_file_modified
  - dirty_tree_detected_before_start
  - write_set_unclear
  - validator_or_script_required
  - PowerShell_script_required
  - runtime_access_required
  - VCPChat_or_VCPToolBox_or_real_manifest_read_required
  - plugin_or_provider_or_image_or_memory_required
  - dependency_or_config_change_required
  - suspected_secret_detected
  - external_side_effect_required
  - push_attempted
```

## Closeout Template

```yaml
closeout:
  phase: v7.191_commander_mode_selection_autonomy_gate
  execution_mode_selected_by_commander: direct_commander_execution
  commit_hash: <hash_or_null_if_not_committed>
  commit_message: "docs: add v7.191 commander mode selection autonomy"
  branch: master
  git_status: <status>
  changed_files: 1
  local_scope_result: passed | failed
  push: not_performed

  mode_selection:
    mode_selection_inputs_defined: true
    direct_commander_execution_rule_defined: true
    single_worker_rule_defined: true
    multiple_worker_rule_defined: true
    stop_and_ask_rule_defined: true
    boundary_risk_matrix_defined: true

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
    dependency_changed: false
    config_changed: false

final_state:
  commit_completed: true | false
  push_completed: false
  next_phase_started: false
```
