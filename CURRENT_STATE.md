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
review_feedback_routing: reports/runtime_to_review_v2/r2r_v2_review_feedback_routing_min_fixture_20260615.json
review_feedback_prompt_patch_preview: reports/runtime_to_review_v2/r2r_v2_review_feedback_prompt_patch_preview_20260616.json
review_feedback_prompt_target_guard: original preview target points at an existing tracked v3 prompt package; select a fresh non-colliding target before any formal write.
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
2. Turn `docs/VISUAL_EVAL_RUBRIC.md` into a minimum repeatable eval fixture set.
3. Review `runtime_to_review_v2_review_feedback_prompt_patch_preview`, then
   choose a fresh non-colliding prompt package target only if that preview is
   accepted; do not overwrite the existing tracked v3 prompt package.
4. Keep memory write as a separate gate after human approval and suitability.

No live provider, image generation, production write, or memory write is
authorized by this file.
