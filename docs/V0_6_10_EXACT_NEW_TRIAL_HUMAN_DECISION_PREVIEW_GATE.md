# v0.6.10 Exact New-Trial Human Decision Preview Gate

base_contract: AGENTS.md
phase: v0_6_10_exact_new_trial_human_decision_preview_gate
status: local_human_decision_preview_validator

## Purpose

This phase turns the post-`v0.6.9` state into one explicit local-only preview
gate for the next human decision.

It does not issue the exact approval phrase.
It does not submit any request.
It does not grant A5.
It does not authorize provider contact, image generation, output-directory
creation, receipt writing, registry writing, memory writing, DailyNote writing,
runtime integration, or a real executor.

## Preview Header

```yaml
exact_new_trial_human_decision_preview_gate:
  authorization_package_id: AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001
  phase: v0_6_10_exact_new_trial_human_decision_preview_gate
  authorization_status: draft_not_submitted
  approval_status: not_requested
  preview_only: true
  human_decision_recorded: false
  selected_option: not_selected
  submit_requested: false
  execute_requested: false
```

## Source Bindings

- `reports/visual_asset_eval_dry_run/v0_6_9_exact_new_trial_request_text_regenerated.json`
- `reports/visual_asset_eval_dry_run/v0_6_5_ready_for_exact_new_trial_authorization_checkpoint.json`
- `docs/V0_6_2_FIRST_MONTH_LIVE_PILOT_RECOVERY_PLAN.md`

## Decision Preview Options

1. `keep_draft_unissued`
   - Keep the regenerated request text local-only.
   - Preserve `approval_status: not_requested`.
   - Preserve `request_not_submitted: true`.
   - Preserve `can_execute_now: false`.

2. `future_issue_phrase_in_separate_human_turn_only`
   - A future human may explicitly issue the exact phrase in a separate turn.
   - That future human phrase is still separate from any submission step.
   - That future human phrase is still separate from any execution step.

3. `decline_current_wording_and_return_to_local_revision`
   - Reject the current wording and return to local-only edits.
   - Keep the route non-submitted and non-executable.

## Preview Assertions

- `copyable_exact_request_text_available: true`
- `human_decision_still_required: true`
- `no_option_auto_selected: true`
- `request_not_submitted: true`
- `can_submit_now: false`
- `can_execute_now: false`
- `any_real_approval_phrase_received: false`
- `future_submit_step_still_separate: true`
- `future_execute_step_still_separate: true`

## Human Decision Boundary

- `issuing_the_exact_phrase_is_not_performed_in_this_phase`
- `submission_is_not_performed_in_this_phase`
- `provider_execution_is_not_performed_in_this_phase`
- `human_turn_required_before_any_status_change`
- `human_turn_required_before_any_submit_request`
- `human_turn_required_before_any_execute_request`

## Explicit Non-Authorization

- `provider_call_performed: false`
- `image_generation_performed: false`
- `VCP_memory_write_performed: false`
- `DailyNote_write_performed: false`
- `runtime_call_performed: false`
- `secret_value_read_performed: false`
- `production_candidate_created: false`
- `accepted_sample_auto_promotion: false`
- `memory_seed_promoted: false`
- `Push_L2_exercised: false`
- `package_dependency_change_performed: false`
- `commit_performed: false`
- `push_performed: false`

## Current Result

The route now has:

```text
ready_for_exact_new_trial_authorization
+ exact_new_trial_intake_field_resolution
+ exact_new_trial_request_text_regenerated
+ exact_new_trial_human_decision_preview_gate
```

That means the route is fully prepared for a later human decision, but still
does not contain a recorded decision, a submitted request, or executable
authority.

## Recommended Next

Wait for an explicit human decision on whether to keep the draft unissued or
later issue the exact phrase in a separate turn. Do not submit or execute
anything by default.
