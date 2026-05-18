# Single-Window 4-Agent Compact Autopilot

```yaml
mode_name: Single-Window 4-Agent Compact Autopilot
project: Agent Image Lab
base_contract: AGENTS.md
project_binding: AGENTS.md Section 3.6 + A4.8 Safe Project Operator Rail
status: project-local operating mode record
authorization_level: local_A4_8_only
```

## Purpose

This record binds the Single-Window 4-Agent Compact Autopilot pattern to Agent
Image Lab.

It is a local operating model, not a runtime, MCP contract, external service,
production executor, or A5 authorization.

The model is useful when Agent Image Lab needs sustained local progress with a
single commander, narrow worker contracts, read-only verification, exact file
boundaries, and clear handoff evidence.

## Roles

```yaml
roles:
  Commander:
    owns:
      - repository reality check
      - task contract
      - file allowlist
      - stop conditions
      - validation selection
      - final integration
  Worker_Alpha:
    owns:
      - one narrow local task
      - exact allowed files only
      - no staging
      - no commit
      - no push
  Worker_Beta:
    owns:
      - optional second narrow local task
      - disjoint write set from Worker_Alpha
      - no staging
      - no commit
      - no push
  Read_Only_Verifier:
    owns:
      - scope review
      - hard-stop review
      - validation evidence review
      - agent_board freshness review
    writes_files: false
```

The four agents are logical roles. They do not require four live processes. The
default compact form is one commander window simulating the full loop; temporary
workers are only useful when write sets are exact and disjoint.

## Allowed Use

```yaml
allowed_under_A4_8:
  - documentation refinement
  - schema and fixture alignment
  - local validator repair
  - review_console_static_productization
  - dry_run_contracts
  - authorization_template_drafts
  - evidence and closeout packages
  - .agent_board maintenance
  - read-only verifier review
```

## Project Hard Stops

This mode does not weaken Agent Image Lab boundaries.

```yaml
not_authorized_by_this_mode:
  A5_execution_blocked: true
  provider_contact_blocked: true
  plugin_call_blocked: true
  api_call_blocked: true
  DailyNote_write_blocked: true
  VCP_memory_write_blocked: true
  image_generation_blocked: true
  runtime_execution_blocked: true
  real_manifest_read_blocked: true
  real_VCPChat_read_blocked: true
  real_VCPToolBox_read_blocked: true
  CDP_bridge_MCP_runtime_blocked: true
  dependency_change_blocked: true
  secret_or_env_read_blocked: true
  production_candidate_write_blocked: true
  accepted_samples_write_without_exact_authorization_blocked: true
  durable_archive_copy_without_exact_authorization_blocked: true
  push_tag_release_deploy_blocked: true
  destructive_git_or_filesystem_action_blocked: true
```

Any action above still requires a separate explicit authorization package that
names exact targets, allowed paths, forbidden paths, validation, rollback, and
stop conditions.

## Minimal Task Contract

```yaml
task_contract:
  task_id: null
  objective: null
  mode: A4.8
  intent: local_implementation | review | planning | local_draft
  exact_allowed_files: []
  forbidden_files: []
  allowed_commands: []
  forbidden_actions:
    - git add .
    - push
    - tag
    - release
    - deployment
    - provider_contact
    - plugin_call
    - api_call
    - DailyNote_write
    - VCP_memory_write
    - image_generation
    - runtime_execution
    - real_manifest_read
    - real_VCPChat_read
    - real_VCPToolBox_read
    - secret_or_env_read
  validation:
    required:
      - git status --short --branch
      - git diff --check
  stop_conditions:
    - dirty_tree_outside_task_scope
    - overlapping_write_set
    - validation_failure_without_obvious_local_fix
    - suspected_secret
    - A5_boundary_reached
```

## Verifier Result

```yaml
verifier_result:
  decision: PASS | PASS_WITH_WARNINGS | NEEDS_FIX | BLOCKED
  scope_ok: true | false
  hard_stops_ok: true | false
  validation_ok: true | false
  agent_board_current: true | false
  notes: []
```

## Current Best Fit

For the current Agent Image Lab state, this mode is best suited to:

```yaml
recommended_tracks:
  - review_console_static_productization_from_three_sample_evidence_baseline
  - artifact_portability_or_durable_archive_authorization_gate_planning
  - local_validator_and_fixture_alignment
  - evidence_gap_review
```

It should not be used as implicit approval for durable archive copy, image file
copy, production candidate promotion, memory write, provider contact, runtime
integration, push, tag, release, or deployment.

## Known Limitations

```yaml
known_limitations:
  not_a_runtime:
    meaning: The mode coordinates local work only; it does not execute VCP runtime paths.
  not_an_A5_authorization:
    meaning: It cannot authorize provider contact, plugin calls, image generation, memory writes, or durable archive copies.
  verifier_is_a_gate_not_a_fix:
    meaning: The verifier reviews evidence and returns a decision; it does not repair files.
  parallelism_requires_file_locks:
    meaning: Worker Alpha and Worker Beta may only run together when .agent_board/FILE_LOCKS.md proves disjoint write sets.
  risk_tracking_requires_register:
    meaning: Current non-obvious blockers should be recorded in .agent_board/RISK_REGISTER.md before new task selection.
  token_validators_are_brittle:
    meaning: Markdown token validators are useful but can drift from real state; prefer structured fixtures when practical.
```

## Execution Profiles

Use the smallest profile that can complete the task.

```yaml
execution_profiles:
  solo_commander:
    use_when:
      - one narrow write set
      - low or medium local risk
      - docs/schema/fixture/validator work
    required_evidence:
      - exact_allowed_files
      - validation_plan
      - stop_conditions
  commander_worker_verifier:
    use_when:
      - one worker can make a bounded patch
      - verifier review materially reduces risk
      - files are locked before work starts
    required_evidence:
      - task_contract
      - .agent_board/FILE_LOCKS.md active lock
      - worker_closeout
      - verifier_result
  full_compact_4_agent:
    use_when:
      - two independent tasks have disjoint write sets
      - Commander can integrate serially
      - validation is available for both work sets
    required_evidence:
      - separate Worker_Alpha and Worker_Beta locks
      - no overlapping files
      - separate worker closeouts
      - final read-only verifier result
```

Default to `solo_commander`. Escalate only when parallelism or independent
verification adds real safety or speed.

## File Lock Rule

Before any worker writes, Commander must reserve exact files in
`.agent_board/FILE_LOCKS.md`.

```yaml
file_lock_rule:
  no_lock_no_parallel_worker: true
  overlapping_lock_blocks_worker: true
  workers_must_not_edit_unlocked_files: true
  locks_are_released_after_commander_review: true
```

## Risk Register Rule

Non-obvious project risks should be recorded in `.agent_board/RISK_REGISTER.md`
before Commander selects the next task.

```yaml
risk_register_rule:
  record_when:
    - validation fails due to missing local evidence
    - next useful action approaches A5
    - state surfaces disagree
    - artifact portability is uncertain
    - verifier returns PASS_WITH_WARNINGS or BLOCKED
  do_not_record:
    - secrets
    - raw env values
    - private absolute paths
    - transient guesses
```

## Verifier Checklist

```yaml
verifier_checklist:
  - git_status_matches_expected_state
  - changed_files_match_exact_allowlist
  - no_git_add_dot_used
  - no_unlocked_worker_file_writes
  - hard_stops_not_crossed
  - no_secret_or_env_read
  - no_provider_plugin_api_daily_note_memory_image_runtime_action
  - validation_matches_risk
  - agent_board_updated_when_state_changes
  - risk_register_updated_when_new_risk_is_found
```

## Do Not Continue Rule

```yaml
do_not_continue_when:
  - next_task_only_repeats_prior_non_authorization
  - no_new_decision_value
  - no_new_validation_value
  - no_product_capability_improvement
  - current_blocker_requires_A5_authorization
  - file_locks_overlap
  - risk_register_has_unresolved_blocking_risk
```

## Closeout Rule

Every task using this mode should close with:

```yaml
closeout:
  status: COMPLETED_VALIDATED | COMPLETED_UNVALIDATED | PARTIAL | BLOCKED | FAILED
  mode: Single-Window 4-Agent Compact Autopilot
  changed_files: []
  validation_run: []
  validation_not_run: []
  boundary_confirmation:
    A5_execution: false
    provider_contact: false
    plugin_call: false
    api_call: false
    DailyNote_write: false
    VCP_memory_write: false
    image_generation: false
    runtime_execution: false
    real_manifest_read: false
    real_VCPChat_read: false
    real_VCPToolBox_read: false
    push_tag_release_deploy: false
  next_recommended_step: null
```
