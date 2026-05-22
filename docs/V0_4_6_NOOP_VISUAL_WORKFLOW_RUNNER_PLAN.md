# v0.4.6 No-op Visual Workflow Runner Plan

base_contract: AGENTS.md
phase: v0_4_6_noop_visual_workflow_runner_plan
status: local_doc_schema_fixture_validator_gate

## Purpose

This gate defines a no-op runner plan for the reusable visual judgment loop. The
runner plan may read existing metadata records, select the next dry-run action,
and emit hypothetical `would_*` outputs. It must not execute the action.

Allowed no-op behavior:

- read review pack
- select next dry-run action
- emit `would_apply_correction_hint`
- emit `would_register_rejected_sample`

Forbidden behavior:

- actual prompt mutation
- actual rejected sample creation
- accepted sample promotion
- production candidate creation
- image generation
- provider call
- VCP memory write
- DailyNote write
- runtime / bridge / MCP / VCPToolBox / VCPChat action

## Source Binding

The plan binds to:

- `reports/visual_asset_eval_dry_run/v0_4_1_safe_portrait_review_pack.json`
- `tests/schema_examples/visual_prompt_correction_hint.example.json`
- `reports/visual_asset_eval_dry_run/v0_4_4_sample_registry_dry_run.json`
- `tests/schema_examples/visual_eval_consistency_check.example.json`

## Plan Contract

```yaml
visual_noop_workflow_runner_plan:
  phase: v0_4_6_noop_visual_workflow_runner_plan
  runner_mode: no_op_plan_only
  allowed_noop_steps:
    - read_review_pack
    - select_next_dry_run_action
    - emit_would_apply_correction_hint
    - emit_would_register_rejected_sample
  selected_next_dry_run_action: would_apply_correction_hint_then_register_rejected_sample
  would_apply_correction_hint:
    emit: true
    actual_prompt_change_applied: false
    generation_action_allowed: false
  would_register_rejected_sample:
    emit: true
    registry_write_performed: false
    actual_rejected_sample_created: false
```

## Non-Actions

This gate did not read image binaries, call a provider, generate an image, write
DailyNote, write VCP memory, perform runtime calls, read secrets, create a
production candidate, promote an accepted sample, promote a memory seed, change
dependencies, push, tag, release, or deploy.

Recommended next: v0.4.7 Seven/Fifteen-Day Visual Workflow Checkpoint.
