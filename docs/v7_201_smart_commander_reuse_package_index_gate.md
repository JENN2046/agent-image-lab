# v7.201 Smart Commander Reuse Package Index Gate

## Executive Verdict

```yaml
executive_verdict:
  overall_status: pass
  base_contract: AGENTS.md
  gate_model: fixed_A4_docs_only_gate_template_plus_phase_delta
  execution_mode_selected_by_commander: direct_commander_execution
  selection_reason: "single-file A4 docs-only reuse package index with clear write set"
  source_AGENTS_hardening: v7.199_agents_smart_commander_slim_hardening_gate
  source_portable_protocol: v7.200_smart_commander_portable_protocol_extraction_gate
  reuse_package_index_defined: true
  AGENTS_md_update_allowed_now: false
  runtime_execution_allowed_now: false
  recommended_next_phase: optional_reuse_template_materialization_gate
```

This gate indexes the reusable Smart Commander artifacts created by the project
hardening and portable protocol extraction work. It distinguishes reusable
artifacts from project-specific artifacts and recommends an adoption order.

## Fixed Gate Template

```yaml
gate_template:
  phase: v7.201_smart_commander_reuse_package_index_gate
  base_contract: AGENTS.md
  mode: A4
  intent: local_implementation
  risk_level: R0
  allowed_files:
    - docs/v7_201_smart_commander_reuse_package_index_gate.md
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
    - create docs-only smart commander reuse package index
    - identify reusable artifacts
    - identify project-specific artifacts
    - index portable protocol
    - define AGENTS patch candidate
    - define task template candidate
    - define worker closeout template candidate
    - define guarded push template candidate
    - define stop conditions checklist
    - define recommended adoption order
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
      - git diff -- docs/v7_201_smart_commander_reuse_package_index_gate.md
      - git diff --check
    forbidden:
      - validator execution
      - script execution
      - PowerShell script execution
      - runtime execution
  commit:
    allowed: true
    message: "docs: add v7.201 smart commander reuse package index"
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
  phase: v7.201_smart_commander_reuse_package_index_gate
  purpose: >
    Build a reuse package index for Smart Commander by linking the slim project
    AGENTS hardening and the project-independent portable protocol extraction.
  source_material:
    - v7.199_agents_smart_commander_slim_hardening_gate
    - v7.200_smart_commander_portable_protocol_extraction_gate
  creates:
    - reusable_artifacts_index
    - project_specific_artifacts_index
    - portable_protocol_index
    - AGENTS_patch_candidate
    - task_template_candidate
    - worker_closeout_template_candidate
    - guarded_push_template_candidate
    - stop_conditions_checklist
    - recommended_adoption_order
  does_not_create:
    - AGENTS_update
    - reusable_skill
    - template_files
    - push_authorization
    - runtime_behavior
```

## Reusable Artifacts

```yaml
reusable_artifacts:
  portable_protocol:
    source: v7.200_smart_commander_portable_protocol_extraction_gate
    purpose: "Project-independent Smart Sustained Commander protocol"
    reuse_value: high

  task_template:
    source: v7.200_smart_commander_portable_protocol_extraction_gate
    purpose: "Neutral task contract for direct and delegated work"
    reuse_value: high

  worker_closeout_template:
    source: v7.187-v7.200
    purpose: "Structured worker evidence for commander review"
    reuse_value: high

  scope_escalation_blocker_template:
    source: v7.189_worker_scope_escalation_guard_gate
    purpose: "Worker blocker format for unsafe scope escalation"
    reuse_value: high

  mode_selection_checklist:
    source: v7.191_commander_mode_selection_autonomy_gate
    purpose: "Choose direct, single worker, multiple workers, or stop-and-ask"
    reuse_value: high

  quality_redundancy_consolidation_checklist:
    source: v7.194-v7.198
    purpose: "Prevent low-value repetition and trigger consolidation"
    reuse_value: medium
```

## Project-Specific Artifacts

```yaml
project_specific_artifacts:
  Agent_Image_Lab_AGENTS_patch:
    source: v7.199_agents_smart_commander_slim_hardening_gate
    reason_project_specific: "Written into this repository's project constitution"

  v7_x_gate_sequence:
    source: v7.187-v7.201
    reason_project_specific: "Uses this project's phase numbering and gate history"

  VCP_and_image_hard_stops:
    source: AGENTS.md
    reason_project_specific: "Specific to Agent Image Lab's VCP-native visual production boundaries"

  guarded_push_policy_for_master_origin:
    source: v7.193_guarded_auto_push_and_review_policy_gate
    reason_project_specific: "Names this repository's master/origin policy shape"
```

Project-specific artifacts may inspire reuse, but they must be adapted before
being applied elsewhere.

## Portable Protocol Index

```yaml
portable_protocol_index:
  protocol_name: Smart Sustained Commander
  source_doc: docs/v7_200_smart_commander_portable_protocol_extraction_gate.md
  core_components:
    - mode_selection
    - disjoint_write_set
    - worker_closeout
    - commander_review
    - quality_redundancy_consolidation_judgment
    - guarded_commit
    - guarded_push_preconditions
    - stop_conditions
    - reusable_task_template
  portability_status: ready_as_reference_document
  requires_before_external_reuse:
    - remove repository-specific path examples
    - adapt validation commands
    - adapt branch and remote policy
    - adapt hard-stop list to target project
```

## AGENTS Patch Candidate

```yaml
AGENTS_patch_candidate:
  source: AGENTS.md
  status: already_applied_to_this_project
  portable_status: candidate_after_adaptation
  compact_rules_to_reuse:
    - commander chooses direct, single worker, multiple workers, or stop-and-ask
    - workers do not stage, commit, push, or decide next phase
    - commander reviews output and repository reality before validation, stage, or commit
    - clean local docs-only work may continue when it adds value
    - quality, redundancy, and consolidation judgment is required
    - hard-stop boundaries override autonomy
  not_portable_without_changes:
    - project-specific hard stops
    - project-specific path lists
    - branch-specific push policy
```

## Task Template Candidate

```yaml
task_template_candidate:
  fields:
    - task_id
    - mode_options
    - intent
    - risk_level
    - allowed_files
    - forbidden_files
    - allowed_commands
    - forbidden_commands
    - validation_required
    - commit_allowed
    - push_allowed
    - worker_tasks
    - commander_review
    - closeout_required

  recommended_use:
    - new docs-only gate
    - bounded code change
    - delegated worker task
    - review-only task
```

## Worker Closeout Template Candidate

```yaml
worker_closeout_template_candidate:
  required_fields:
    - worker_task_id
    - assigned_write_set
    - changed_files
    - validation_run
    - validation_result
    - validation_not_run
    - blockers
    - forbidden_actions_performed
    - stage_performed
    - commit_performed
    - push_performed
    - next_phase_decided

  commander_must_verify:
    - changed_files_match_write_set
    - validation_claim_matches_observed_output
    - no_forbidden_actions_occurred
    - no_unexpected_files_changed
```

## Guarded Push Template Candidate

```yaml
guarded_push_template_candidate:
  status: reference_only
  required_before_use:
    - explicit_push_authorization
    - exact_remote
    - exact_branch
    - exact_command
    - clean_worktree
    - not_behind_remote
    - pending_commits_known_and_authorized
    - validation_passed
    - no_sensitive_or_unreviewed_artifacts
    - post_push_verification_plan

  forbidden_without_explicit_authorization:
    - force_push
    - tag_push
    - release
    - deployment
    - deleting_remote_refs
```

## Stop Conditions Checklist

```yaml
stop_conditions_checklist:
  repository:
    - dirty_tree_with_unexplained_changes
    - user_owned_changes_at_risk
    - unclear_or_overlapping_write_set

  validation:
    - validation_failed
    - required_validation_not_allowed
    - validation_gap_cannot_be_truthfully_reported

  authority:
    - remote_write_needed
    - production_or_real_data_risk
    - destructive_or_irreversible_action_needed
    - dependency_or_global_config_change_needed

  safety:
    - suspected_secret
    - sensitive_data_risk
    - forbidden_tool_or_external_service_needed

  quality:
    - output_would_be_redundant
    - task_has_no_clear_value
    - commander_cannot_truthfully_claim_completion
```

## Recommended Adoption Order

```yaml
recommended_adoption_order:
  - step: 1
    action: "Adopt compact commander mode selection"
    reason: "Improves routing without changing authority"

  - step: 2
    action: "Adopt disjoint write set and worker closeout templates"
    reason: "Makes delegation reviewable and reversible"

  - step: 3
    action: "Adopt commander review before stage/commit"
    reason: "Prevents worker summaries from becoming unverified truth"

  - step: 4
    action: "Adopt quality/redundancy/consolidation checks"
    reason: "Prevents sustained work from becoming repetitive noise"

  - step: 5
    action: "Adapt guarded commit and guarded push rules"
    reason: "Requires project-specific branch, remote, and validation policy"

  - step: 6
    action: "Optionally convert reusable pieces into templates or a skill"
    reason: "Only after the target project and artifact format are chosen"
```

## Explicit Non-Authorization Statement

```yaml
not_authorized_by_v7_201:
  AGENTS_md_update: false
  template_file_creation: false
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

This gate indexes reusable packages only. It does not materialize them into
separate files or install them anywhere.

## Pass Conditions

```yaml
pass_conditions:
  - only docs/v7_201_smart_commander_reuse_package_index_gate.md modified
  - fixed_gate_template_used
  - phase_delta_defined
  - reusable_artifacts_defined
  - project_specific_artifacts_defined
  - portable_protocol_index_defined
  - AGENTS_patch_candidate_defined
  - task_template_candidate_defined
  - worker_closeout_template_candidate_defined
  - guarded_push_template_candidate_defined
  - stop_conditions_checklist_defined
  - recommended_adoption_order_defined
  - git_diff_check_passed
  - no_AGENTS_md_update
  - no runtime/plugin/provider/image/memory path opened
```

## Block Conditions

```yaml
block_conditions:
  - more_than_one_file_modified
  - AGENTS_md_update_attempted
  - template_file_creation_attempted
  - skill_creation_attempted
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
  phase: v7.201_smart_commander_reuse_package_index_gate
  execution_mode_selected_by_commander: direct_commander_execution
  commit_hash: <hash_or_null_if_not_committed>
  commit_message: "docs: add v7.201 smart commander reuse package index"
  branch: master
  git_status: <status>
  changed_files: 1
  local_scope_result: passed | failed
  push: not_performed

  reuse_package_index:
    reusable_artifacts_defined: true
    project_specific_artifacts_defined: true
    portable_protocol_index_defined: true
    AGENTS_patch_candidate_defined: true
    task_template_candidate_defined: true
    worker_closeout_template_candidate_defined: true
    guarded_push_template_candidate_defined: true
    stop_conditions_checklist_defined: true
    recommended_adoption_order_defined: true

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
