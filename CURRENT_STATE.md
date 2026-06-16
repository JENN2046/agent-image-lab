# Current State

Snapshot date: 2026-06-15

Base contract: `AGENTS.md`

This file is a current-state orientation surface, not an authority source. Before
acting, recheck:

```text
git status --short --branch
git rev-parse HEAD
git rev-parse origin/master
git rev-list --left-right --count origin/master...HEAD
```

## Readiness Means Ready For What

```yaml
local_governance_chain_ready: true
green_validation_ready: true
runtime_to_review_metadata_chain_ready: true
real_bound_owner_runtime_module_present: true
real_provider_execution_ready_without_exact_authorization: false
production_ready: false
memory_write_ready_without_separate_gate: false
```

`local_full_autopilot_ready` means the local governance and validation chain can
select, validate, and report safe local work. It does not mean unrestricted
provider execution, image generation, memory write, production promotion, push,
tag, release, or deploy.

## Latest Engineering State

The master branch has advanced beyond the older public release baseline.

Use this split:

```yaml
latest_release:
  meaning: public packaged baseline
  not_the_same_as: latest_engineering_state

latest_engineering_state:
  meaning: current master after git verification
  source: git_status_and_rev_parse
```

Do not treat the latest release page as the complete current capability map.
Do not treat README readiness words as permission to cross Red Lane gates.

## Current Safe Mainline

The safe local mainline is:

```text
brief / fixture
-> runtime metadata
-> artifact metadata
-> readonly review bridge
-> human decision metadata
-> accepted/rejected/rework draft metadata
```

This path is useful because it can be validated without provider contact, image
generation, secret reads, memory writes, or production writes.

## Current Real Execution Boundary

The real-bound owner runtime module now requires an explicit owner-provided
VCPToolBox root. Missing root fails closed with:

```text
owner_vcptoolbox_root_not_explicitly_configured
```

A future live probe still requires exact owner authorization, exact confirmation,
bounded call and image limits, receipt/status sync, and no secret value read.

## Product Pain Now

The biggest pain is no longer lack of execution capability. It is the need to
turn engineering proof into a repeatable visual production loop.

Priorities:

```yaml
P1_now:
  - keep script tiers readable before running commands
  - harden visual eval into repeatable review evidence
  - make accepted/rejected samples affect the next prompt or shot decision
  - keep AIL Core visual truth separate from VCP execution transport
  - keep memory write behind an independent gate

P0_do_not_auto_advance:
  - unrestricted live probe
  - direct native runner real execution
  - production candidate promotion
  - memory write
  - secret/env/config raw value read
```

## Existing Refs

```yaml
command_tiers: docs/COMMAND_TIERS.md
runtime_roadmap: docs/RUNTIME_TO_PRODUCTION_LANDING_ROADMAP.md
visual_rubric: docs/VISUAL_EVAL_RUBRIC.md
visual_eval_min_repeatable_fixture_set: reports/runtime_to_review_v2/r2r_v2_visual_eval_min_repeatable_fixture_set_20260616.json
visual_eval_min_repeatable_fixture_set_status: "Turn `docs/VISUAL_EVAL_RUBRIC.md` into a minimum repeatable eval fixture set is now represented by runtime_to_review_v2_visual_eval_min_repeatable_fixture_set."
review_feedback_routing: reports/runtime_to_review_v2/r2r_v2_review_feedback_routing_min_fixture_20260615.json
review_feedback_prompt_patch_preview: reports/runtime_to_review_v2/r2r_v2_review_feedback_prompt_patch_preview_20260616.json
review_feedback_prompt_target_guard: original preview target points at an existing tracked v3 prompt package; select a fresh non-colliding target before any formal write.
review_feedback_fresh_prompt_target_selection: reports/runtime_to_review_v2/r2r_v2_review_feedback_fresh_prompt_target_selection_20260616.json
review_feedback_selected_future_prompt_target: prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v11.yaml
review_feedback_selected_future_prompt_target_status: "v11 was selected as the fresh non-colliding target and must not overwrite the existing tracked v3 prompt package."
review_feedback_formal_v11_prompt_package: prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v11.yaml
review_feedback_formal_v11_prompt_package_status: "formal v11 prompt package now exists as a no-provider local draft from the human-accepted prompt patch preview; it is not live execution, memory, production, or accepted_samples authorization."
review_feedback_formal_v11_review_criteria_preflight_gate: reports/runtime_to_review_v2/r2r_v2_formal_v11_review_criteria_preflight_gate_20260616.json
review_feedback_formal_v11_review_criteria_preflight_gate_status: "formal v11 review criteria/preflight gate now carries the v11 watch items into a repeatable pass/patch/reject criteria set; it still does not authorize live probe, provider, image, memory, production, archive, or accepted_samples writes."
review_feedback_formal_v11_live_activation_packet_checklist: reports/runtime_to_review_v2/r2r_v2_formal_v11_live_activation_packet_checklist_20260616.json
review_feedback_formal_v11_live_activation_packet_checklist_status: "formal v11 gate to guarded live probe exact activation checklist is fixed as an inactive Green preflight/receipt checklist; it is not live authorization and cannot execute provider, image, output, accepted_samples, production, archive, or memory writes."
core_vcp_split: docs/ail_core_vcp_adapter_split_plan_no_execute.md
memory_policy:
  - memory_policy/write_permissions.md
  - memory_policy/memory_review_checklist.md
  - schemas/memory_write_gate.schema.yaml
```

## Next Safe Local Work

The next safe local product work is not another broad governance chain.

Recommended order:

1. Use `docs/COMMAND_TIERS.md` to classify risky commands before running them.
2. Use `runtime_to_review_v2_visual_eval_min_repeatable_fixture_set` as the
   minimum repeatable review evidence before any fresh prompt target or live
   probe decision.
3. Use `runtime_to_review_v2_review_feedback_fresh_prompt_target_selection`
   when preparing any later formal prompt package write; the selected future
   target is `prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v11.yaml`,
   and the existing tracked v3 prompt package must not be overwritten.
4. Use the formal v11 review criteria/preflight gate as the no-provider review
   contract before any separate exact live probe authorization.
5. Use the formal v11 live activation packet checklist before issuing any
   separate exact guarded live probe activation packet.
6. Keep any live probe, production promotion, accepted_samples write, archive
   write, or memory write behind separate exact authorization gates.

No live provider, image generation, production write, or memory write is
authorized by this file.
