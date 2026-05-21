# v0.3 Controlled Real Provider Production Loop

Status: long-term mainline selected. Current phase is
`v0_3_3_first_live_generation_pilot`.

This roadmap moves Agent Image Lab from local full-autopilot readiness into a
controlled first real production loop. It does not itself authorize any live
provider, plugin, API, image generation, DailyNote, VCP memory, push, tag,
release, or deploy action.

## Goal

Turn the current local-only proof chain into a real but bounded production loop:

```text
visual task
-> Red-gated provider cost boundary
-> live candidate action packet
-> owner-authorized first live generation pilot
-> Review Console live receipt bridge
-> asset/archive review
-> optional memory write gate
```

## Phase Ladder

```yaml
v0_3_controlled_real_provider_production_loop:
  status: selected_long_term_goal
  current_phase: v0_3_3_first_live_generation_pilot
  execution_authorized_by_this_document: false
  live_provider_call_allowed_now: false
  image_generation_allowed_now: false
  push_allowed_now: false
  phases:
    - id: v0_3_1_real_provider_cost_boundary_plan
      lane: Red-gated planning
      purpose: Define exact provider/cost/budget/rollback requirements before any live call.
      execution_now: local_plan_only
    - id: v0_3_2_live_candidate_action_packet
      lane: Red-gated preflight
      purpose: Convert the chosen live task into a reviewable Amber packet candidate.
      execution_now: blocked_until_owner_fills_exact_target_and_cost_cap
    - id: v0_3_3_first_live_generation_pilot
      lane: Amber only after Red authorization clears
      purpose: Run the first bounded real generation pilot.
      execution_now: blocked_without_exact_owner_authorization
    - id: v0_3_4_review_console_live_receipt_bridge
      lane: Green/Amber depending on artifacts
      purpose: Surface live result, receipt, hash, approval, and blocker state in Review Console.
      execution_now: blocked_until_live_pilot_receipt_exists
    - id: v0_3_5_memory_write_candidate_gate
      lane: Amber/Red depending on memory target
      purpose: Draft and optionally authorize Chinese memory write from approved live result.
      execution_now: blocked_until_quality_and_suitability_are_verified
```

## Current Boundary

The active step is `v0_3_3_first_live_generation_pilot`. It entered the
Red-to-Amber execution gate from a filled v0.3.2 candidate packet and consumed
the one authorized built-in image generation call. The provider tool returned
`UserError`, no image artifact was produced, and `retry_limit=0` blocks
automatic retry. The failed attempt is recorded in the authorized output,
receipt, and registry paths.

## Red Stop Conditions

- Exact provider target is missing.
- Exact call budget is missing.
- Cost cap is missing or cost is unknown.
- Rollback limitations are not acknowledged.
- Secret value, raw request, raw response, endpoint, cookie, token, or private
  raw data would be read or recorded.
- Any live provider, plugin, API, image, DailyNote, VCP memory, runtime, push,
  tag, release, deploy, or destructive action is about to occur without the
  required authorization.

## Recommended Next

Inspect the failed provider tool attempt or authorize a new exactly scoped
trial:

```text
inspect_failed_provider_tool_attempt_or_authorize_new_trial
```
