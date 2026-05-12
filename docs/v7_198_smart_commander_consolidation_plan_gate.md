# v7.198 Smart Commander Consolidation Plan Gate

## Executive Verdict

```yaml
executive_verdict:
  overall_status: pass
  base_contract: AGENTS.md
  gate_model: fixed_A4_docs_only_gate_template_plus_phase_delta
  execution_mode_selected_by_commander: direct_commander_execution
  selection_reason: "single-file A4 docs-only consolidation plan with clear write set"
  source_review: v7.197_smart_commander_training_review_gate
  smart_commander_consolidation_plan_defined: true
  AGENTS_md_update_allowed_now: false
  image_generation_allowed_now: false
  plugin_call_allowed_now: false
  provider_contact_allowed_now: false
  memory_write_path_allowed_now: false
  runtime_execution_allowed_now: false
  recommended_next_phase: v7.199_AGENTS_smart_commander_slim_hardening_gate
```

This gate turns the v7.197 training review into a consolidation plan. It defines
what should be kept, dropped, merged, extracted for reuse, prepared for guarded
push authorization, and left for explicit approval. It does not modify
`AGENTS.md`.

## Fixed Gate Template

```yaml
gate_template:
  phase: v7.198_smart_commander_consolidation_plan_gate
  base_contract: AGENTS.md
  mode: A4
  intent: local_implementation
  risk_level: R0
  allowed_files:
    - docs/v7_198_smart_commander_consolidation_plan_gate.md
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
    - create docs-only smart commander consolidation plan
    - define AGENTS slim hardening plan
    - define portable protocol extraction plan
    - define guarded push authorization preparation plan
    - define rules to keep
    - define rules to drop
    - define rules to merge
    - define remaining approval points
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
      - git diff -- docs/v7_198_smart_commander_consolidation_plan_gate.md
      - git diff --check
    forbidden:
      - validator execution
      - script execution
      - PowerShell script execution
      - runtime execution
  commit:
    allowed: true
    message: "docs: add v7.198 smart commander consolidation plan"
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
  phase: v7.198_smart_commander_consolidation_plan_gate
  purpose: >
    Convert v7.197 training review into an actionable consolidation plan for
    Smart Commander. The plan separates compact AGENTS hardening, portable
    protocol extraction, guarded push preparation, rule pruning, and approval
    points.
  source:
    review_gate: v7.197_smart_commander_training_review_gate
    review_result: "stable rules are ready for slim consolidation"
  creates:
    - AGENTS_slim_hardening_plan
    - portable_protocol_extraction_plan
    - guarded_push_authorization_preparation_plan
    - rules_to_keep
    - rules_to_drop
    - rules_to_merge
    - remaining_approval_points
  does_not_create:
    - AGENTS_update
    - reusable_skill
    - push_authorization
    - push_execution
    - runtime_behavior
```

## AGENTS Slim Hardening Plan

```yaml
AGENTS_slim_hardening_plan:
  objective: >
    Add compact Smart Commander rules to AGENTS.md without copying v7.187-v7.198
    training history or long closeout templates.
  target_file:
    - AGENTS.md
  requires_separate_gate: true
  recommended_scope:
    - commander_mode_selection_rule
    - worker_boundary_rule
    - commander_review_and_commit_rule
    - continuation_preconditions
    - maturity_stop_conditions
    - anti_redundancy_rule
    - hard_stop_preservation_rule
  exclude:
    - phase_history
    - detailed scenario matrix
    - detailed scoring weights
    - per-phase closeout templates
    - experimental guarded auto-push mechanics
  validation:
    - git status --short
    - git diff -- AGENTS.md
    - git diff --check
```

The AGENTS hardening should be a slim operating-model update, not a training
archive.

## Portable Protocol Extraction Plan

```yaml
portable_protocol_extraction_plan:
  objective: >
    Identify reusable Smart Commander protocol pieces that could later become a
    local checklist, template, or skill if explicitly authorized.
  reusable_units:
    - commander_worker_docs_only_gate_template
    - worker_task_contract_template
    - worker_closeout_yaml_template
    - scope_escalation_blocker_template
    - commander_mode_selection_checklist
    - docs_only_quality_floor_checklist
    - commander_review_before_commit_checklist
  extraction_target_options:
    - docs index
    - local template document
    - future skill
  requires_separate_authorization_for_skill: true
  not_now:
    - create_skill
    - install_skill
    - change_global_config
```

Portable extraction should happen only after project rules are stable and the
target artifact is explicitly chosen.

## Guarded Push Authorization Preparation Plan

```yaml
guarded_push_authorization_preparation_plan:
  objective: >
    Prepare, but do not grant, a standing authorization model for guarded
    `git push origin master` after clean docs-only closeout and push safety
    review.
  source_policy:
    - v7.193_guarded_auto_push_and_review_policy_gate
  preparation_items:
    - define standing_authorization_fields
    - define authorized_commit_class
    - define excluded_commit_class
    - define push_safety_gate_evidence
    - define post_push_remote_head_verification
    - define revocation_or_expiry_rule
  hard_requirement:
    standing_authorization_must_be_explicit: true
  not_now:
    - create_standing_authorization
    - run_push_safety_gate
    - push
    - tag_push
    - release
```

Guarded push remains blocked until a separate authorization gate explicitly
opens it.

## Rules To Keep

```yaml
rules_to_keep:
  commander_selects_mode:
    summary: "Commander chooses direct, single worker, multiple workers, or stop-and-ask."
    destination: AGENTS_slim_candidate

  workers_do_not_stage_commit_push:
    summary: "Workers draft or execute bounded tasks only; commander integrates."
    destination: AGENTS_slim_candidate

  commander_reviews_before_commit:
    summary: "Commander reviews worker closeout, file diff, status, and boundary claims before stage or commit."
    destination: AGENTS_slim_candidate

  direct_execution_for_small_single_file_docs:
    summary: "Small single-file docs-only work should usually be direct commander execution."
    destination: AGENTS_slim_candidate

  stop_on_dirty_unclear_secret_or_hard_boundary:
    summary: "Dirty tree, unclear write set, suspected secret, push, A5, runtime, plugin, provider, image, memory, external source read, dependency, or config risk stops autonomy."
    destination: AGENTS_slim_candidate

  anti_redundancy_and_quality_floor:
    summary: "Do not continue with low-value repetitive gates; consolidate or ask."
    destination: AGENTS_slim_candidate
```

## Rules To Drop

```yaml
rules_to_drop:
  repeated_full_gate_closeout_templates:
    reason: "Useful for training, too verbose for AGENTS."

  per_phase_training_history:
    reason: "Historical sequence belongs in docs, not compact operating rules."

  numeric_backlog_scoring_weights:
    reason: "Helpful as a heuristic, but too brittle for top-level AGENTS rules."

  long_scenario_matrix:
    reason: "Keep as reference doc; summarize only the decision categories."

  verbose_non_authorization_repetition:
    reason: "Merge into compact hard-stop preservation rule."
```

Dropping means "do not copy into AGENTS," not deleting the source docs.

## Rules To Merge

```yaml
rules_to_merge:
  commander_mode_and_continuation:
    merge_from:
      - v7.190_commander_autonomy_rules_gate
      - v7.191_commander_mode_selection_autonomy_gate
      - v7.192_smart_commander_continuation_policy_gate
    merged_rule: "Commander may continue clean A4 docs-only work and choose mode when all preconditions pass."

  worker_protocol_and_scope_guard:
    merge_from:
      - v7.187_commander_worker_protocol_gate
      - v7.188_single_worker_trial_closeout_protocol_gate
      - v7.189_worker_scope_escalation_guard_gate
    merged_rule: "Workers receive one bounded task and stop on scope escalation."

  maturity_backlog_and_scenarios:
    merge_from:
      - v7.194_smart_commander_maturity_gate
      - v7.195_smart_commander_backlog_selection_gate
      - v7.196_smart_commander_scenario_training_gate
    merged_rule: "Commander should continue only when the next task has value; otherwise consolidate or stop."

  guarded_push_policy:
    merge_from:
      - v7.193_guarded_auto_push_and_review_policy_gate
    merged_rule: "Push remains separate and requires standing authorization plus safety review."
```

## Remaining Approval Points

```yaml
remaining_approval_points:
  AGENTS_update:
    required: true
    reason: "This gate plans AGENTS hardening but does not modify AGENTS.md."

  standing_push_authorization:
    required: true
    reason: "Guarded auto-push requires explicit standing authorization."

  portable_skill_or_template_creation:
    required: true
    reason: "Reusable extraction target must be chosen before creating artifacts."

  multiple_worker_routine_use:
    required: maybe
    reason: "Single worker was trialed; multiple workers need clearer disjoint-write trial before routine use."

  runtime_or_A5_work:
    required: true
    reason: "Still outside A4 docs-only and requires separate authorization."
```

## Consolidation Decision Matrix

```yaml
consolidation_decision_matrix:
  next_AGENTS_slim_hardening_gate:
    recommended: true
    condition: "User explicitly authorizes AGENTS.md as the allowlisted file"

  next_portable_protocol_index_gate:
    recommended: true
    condition: "User wants reusable templates before AGENTS hardening"

  next_guarded_push_authorization_gate:
    recommended: optional_after_consolidation
    condition: "User wants remote sync and explicitly authorizes push policy work"

  more_training_gates:
    recommended: false
    condition: "Only if a distinct new behavior must be tested"

  immediate_push:
    recommended: false
    condition: "Requires separate explicit push authorization"
```

## Explicit Non-Authorization Statement

```yaml
not_authorized_by_v7_198:
  AGENTS_md_update: false
  portable_skill_creation: false
  standing_push_authorization_created: false
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

This gate is a consolidation plan only. It does not perform consolidation.

## Pass Conditions

```yaml
pass_conditions:
  - only docs/v7_198_smart_commander_consolidation_plan_gate.md modified
  - fixed_gate_template_used
  - phase_delta_defined
  - AGENTS_slim_hardening_plan_defined
  - portable_protocol_extraction_plan_defined
  - guarded_push_authorization_preparation_plan_defined
  - rules_to_keep_defined
  - rules_to_drop_defined
  - rules_to_merge_defined
  - remaining_approval_points_defined
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
  phase: v7.198_smart_commander_consolidation_plan_gate
  execution_mode_selected_by_commander: direct_commander_execution
  commit_hash: <hash_or_null_if_not_committed>
  commit_message: "docs: add v7.198 smart commander consolidation plan"
  branch: master
  git_status: <status>
  changed_files: 1
  local_scope_result: passed | failed
  push: not_performed

  consolidation_plan:
    AGENTS_slim_hardening_plan_defined: true
    portable_protocol_extraction_plan_defined: true
    guarded_push_authorization_preparation_plan_defined: true
    rules_to_keep_defined: true
    rules_to_drop_defined: true
    rules_to_merge_defined: true
    remaining_approval_points_defined: true

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
