# v0.6.2 First-Month Live Pilot Recovery Plan

Phase: `v0_6_2_first_month_live_pilot_recovery_plan`

Status: local planning route defined; Batch A completed; Batch B no-new-A5
request draft in progress; no new execution performed.

This document turns the current first-month objective into an exact local plan.
It does not authorize provider contact, plugin calls, API calls, image
generation, output directory creation, receipt writes, registry writes,
DailyNote write, VCP memory write, runtime integration, real source read, push,
tag, release, deploy, or destructive action.

## Gate Template

```yaml
gate_template:
  phase: v0_6_2_first_month_live_pilot_recovery_plan
  base_contract: AGENTS.md
  mode: A4
  intent: planning
  risk_level: R1
  allowed_files:
    - docs/V0_6_2_FIRST_MONTH_LIVE_PILOT_RECOVERY_PLAN.md
    - docs/00_project_roadmap.md
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
    - .agent_board/CHECKPOINT.md
  forbidden_files:
    - .env.local
    - package.json
    - package-lock.json
    - pnpm-lock.yaml
    - yarn.lock
    - runs/**
    - reports/provider_receipts/**
  allowed_actions:
    - local_plan_doc_creation
    - roadmap_sync
    - agent_board_status_sync
    - local_validation
  forbidden_actions:
    - provider_contact
    - plugin_call
    - API_call
    - image_generation
    - output_write
    - receipt_write
    - registry_write
    - DailyNote_write
    - VCP_memory_write
    - runtime_probe
    - push
    - tag
    - release
    - deploy
  validation:
    required:
      - git diff --check
      - node scripts/validate_agent_board_state.js
      - npm run validate:mvp
    forbidden:
      - provider_call_smoke_test
      - image_generation_test
  commit:
    allowed: false
    message: null
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

## Phase Difference Patch

```yaml
phase_diff:
  source_phase: v0_6_1_fifteen_day_controlled_generation_readiness_checkpoint
  active_current_phase: v0_3_3_first_live_generation_pilot
  resume_guard_source_phase: v0_3_2_live_candidate_action_packet
  current_baseline_commit: 1f02ff0750f9a3e22876130875437b86a899b524
  current_remote_commit: 1f02ff0750f9a3e22876130875437b86a899b524
  current_first_attempt_status: attempted_failed_no_retry
  current_failure_class: provider_tool_user_error
  month_objective: move_v0_3_3_from_failed_no_retry_to_re_authorizable_new_trial_state
  batch_structure:
    - batch_id: batch_a
      days: 1-15
      theme: failed_attempt_inspection_and_reauthorization_refresh
    - batch_id: batch_b
      days: 16-30
      theme: authorization_branch_for_new_minimal_trial_or_ready_checkpoint
```

## Current Starting Point

The month does not start from zero-preflight readiness. It starts from a real
but bounded failed attempt:

```yaml
starting_state:
  source_packet_ref: docs/V0_3_2_LIVE_CANDIDATE_ACTION_PACKET.md
  source_gate_ref: docs/V0_3_3_FIRST_LIVE_GENERATION_PILOT_GATE.md
  provider_target: codex_builtin_image_generation
  provider_route: image_gen.imagegen
  prompt_package_ref: prompts/image_generation/fashion_night_balcony_vertical_portrait_v1.yaml
  first_attempt_consumed_call_budget: true
  first_attempt_image_artifact_created: false
  retry_limit: 0
  auto_retry_allowed: false
  failure_class: provider_tool_user_error
  current_safe_next_decision: inspect_failed_provider_tool_attempt_or_authorize_new_trial
```

## Month Outcome Definition

This month is successful when all conditions below are true:

```yaml
month_outcome_definition:
  failed_attempt_evidence_is_consolidated: true
  failed_attempt_is_not_misreported_as_generation_capability: true
  reauthorization_fields_for_next_trial_are_explicit: true
  batch_a_exit_state_is_reviewable: true
  batch_b_has_clear_branching:
    - no_new_A5_authorization -> ready_for_exact_new_trial_authorization
    - explicit_new_A5_authorization -> one_minimal_new_trial_then_post_trial_checkpoint
  default_memory_write_state_remains_false: true
```

## Batch A - Days 1 to 15

Objective:

```text
Turn the first failed live attempt into an inspected, documented, and
re-authorizable state without performing a new real trial.
```

Tasks:

1. Inventory the first attempt evidence surface:
   - receipt path
   - registry path
   - output directory state
   - review bridge reference
   - any validator or roadmap references already pointing at the failed attempt
2. Create a failed-attempt inspection slice that locks:
   - failure classification
   - no-artifact-produced fact
   - zero-auto-retry fact
   - boundary-preservation fact
3. Refresh the next-trial reauthorization requirements for `v0_3_2`:
   - whether the same prompt package is retained
   - whether `max_provider_calls=1` remains fixed
   - whether `retry_limit=0` remains fixed
   - whether `no_memory_write_default=true` remains fixed
   - whether new output and receipt paths are required to avoid ambiguity
4. Refresh the `v0_3_3` pilot preflight for one future new trial:
   - exact approval phrase requirements
   - output collision checks
   - receipt and registry write plan checks
   - post-generation review requirements
5. Sync roadmap and `.agent_board` to show:
   - first attempt handled as a failed attempt, not a success
   - current month focus is recovery and reauthorization readiness

Expected Batch A deliverables:

```yaml
batch_a_deliverables:
  - failed_attempt_inspection_doc
  - any_supporting_schema_or_fixture_if_needed_by_the_selected_slice
  - refreshed_v0_3_2_reauthorization_requirements
  - refreshed_v0_3_3_new_trial_preflight
  - roadmap_and_agent_board_sync
```

Batch A exit criteria:

```yaml
batch_a_exit_criteria:
  failed_attempt_cause_classified: true
  no_artifact_fact_locked: true
  no_auto_retry_fact_locked: true
  next_trial_refresh_fields_explicit: true
  new_trial_still_not_executed: true
```

## Batch B - Days 16 to 30

Objective:

```text
Close the month either as a ready-for-authorization checkpoint or, if and only
if explicit new A5 authorization exists, one new minimal real trial plus
post-trial review.
```

Branch 1 - No new explicit A5 authorization:

```yaml
batch_b_branch_no_new_A5:
  action: close_preflight_only
  target_state: ready_for_exact_new_trial_authorization
  required_outputs:
    - authorization_readiness_checkpoint
    - recommended_exact_approval_phrase
    - unchanged_no_memory_write_default
```

Branch 2 - Explicit new A5 authorization exists:

```yaml
batch_b_branch_explicit_new_A5:
  action: one_new_minimal_real_trial
  hard_limits:
    provider_calls: 1
    image_candidates: 1
    retry_limit: 0
    memory_write_default: false
  required_followup:
    - receipt_and_registry_evidence
    - human_review
    - post_trial_checkpoint
    - allow_next_trial_or_stop_decision
```

Batch B exit criteria:

```yaml
batch_b_exit_criteria:
  one_of:
    - ready_for_exact_new_trial_authorization
    - one_new_trial_executed_and_reviewed
  memory_write_still_blocked_by_default: true
  accepted_sample_auto_promotion_still_false: true
```

## Weekly Cadence

```yaml
weekly_cadence:
  week_1: failed_evidence_inventory_and_gap_lock
  week_2: reauthorization_packet_refresh_and_validation_alignment
  week_3: wait_for_explicit_A5_or_prepare_ready_checkpoint_branch
  week_4: post_branch_checkpoint_and_next_month_decision
```

## Stop Conditions

```yaml
stop_conditions:
  automatic_retry_of_the_failed_attempt: Red
  treating_failed_attempt_as_success_capability: Red
  provider_or_image_call_without_explicit_new_A5_when_required: Red
  memory_write_default_flips_true_without_exact_authorization: Red
  accepted_sample_auto_promotion_requested: Red
  broad_or_uncapped_provider_usage: Red
  secret_value_read_required: Red
  validation_failure_requiring_non_obvious_judgment: Red
```

## Recommended Next

```text
Start Batch A: failed attempt inspection and reauthorization refresh.
```
