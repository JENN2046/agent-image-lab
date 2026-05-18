# v7.279 Best Candidate Selection Or Fourth Trial Decision Gate

## Phase Summary

```yaml
phase: v7.279_best_candidate_selection_or_fourth_trial_decision_gate
mode: A4_decision_gate
source_phase: v7.278_human_review_of_third_real_outputs
selected_route: fourth_minimal_generation_trial
```

This phase records the human decision after the third real
`matte_ceramic_mug` output review. It does not generate an image, contact a
provider, call a plugin, retry, write memory, write DailyNote, write VCP memory,
or promote any production candidate.

## Best Candidate Decision

```yaml
current_best_candidate: runs/real_generation/v7_274_matte_ceramic_mug_v2_trial/native_doubao_1778685572407_0.jpg
v3_review_result: needs_revision
v3_failed_reason: handle attachment geometry regression
selected_route: fourth_minimal_generation_trial
fourth_trial_goal: restore v2 composition while fixing handle geometry and preserving artifact control
```

The current best candidate remains the v2 output from v7.274. The v3 output is
useful negative feedback because it improved background, speck control, and rim
detail, but it regressed the ceramic handle attachment enough to lose candidate
status.

## Decision Rationale

- v2 remains the best available candidate because it has the strongest overall product composition and commercial candidate feel.
- v3 should not replace v2 because the upper handle attachment shows a blocky or gap-like artifact.
- A fourth trial is justified only as a narrow handle-geometry repair, not as a new style exploration.
- The fourth trial must preserve v2 composition, product scale, matte ceramic direction, artifact control, and clean no-logo/no-text/no-people boundaries.

## Fourth Trial Direction

```yaml
fourth_trial_scope:
  product: matte_ceramic_mug
  intent: handle_geometry_refinement_only
  preserve_v2_composition: true
  preserve_product_scale: true
  preserve_artifact_control: true
  style_exploration_allowed: false
  provider_calls_max_future_gate: 1
  generation_attempts_max_future_gate: 1
  auto_retry_future_gate: false
  fifth_generation_auto_start: false
```

## Recommended Next

```yaml
recommended_next:
  phase: v7.280_prompt_v4_handle_geometry_refinement_authorization_gate
  purpose: "Create prompt v4 from the v2 best candidate and v3 negative feedback, then record the exact fourth-trial authorization boundary."
  auto_execution_allowed: false
```

## Safety Record

```yaml
provider_contact: false
plugin_call: false
image_generation: false
retry: false
memory_write: false
DailyNote_write: false
VCP_memory_write: false
accepted_samples_written: false
output_image_added_to_git: false
production_candidate_002_started: false
Batch_005_started: false
fourth_generation_started_in_this_phase: false
next_phase_started: false
```
