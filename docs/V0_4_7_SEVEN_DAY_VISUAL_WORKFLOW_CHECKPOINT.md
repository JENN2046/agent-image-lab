# v0.4.7 Seven/Fifteen-Day Visual Workflow Checkpoint

base_contract: AGENTS.md
phase: v0_4_7_seven_day_visual_workflow_checkpoint
status: local_doc_validator_checkpoint

## Purpose

This checkpoint closes the current dry-run visual judgment loop:

```text
review_pack -> failure_taxonomy -> prompt_correction_hint -> sample_registry_dry_run -> consistency_check -> no_op_runner_plan
```

It confirms that the system can explain why an existing authorized asset should
be kept for review, rejected, or corrected next without generating a new image
or writing memory.

## Required Artifact Check

- `review_pack exists: true`
- `failure_taxonomy exists: true`
- `prompt_correction_hint exists: true`
- `sample_registry_dry_run exists: true`
- `consistency_check exists: true`
- `no_op_runner_plan exists: true`

## Boundary Check

- `image_generation: false`
- `memory_write: false`
- `real_executor: false`
- `provider_call_performed: false`
- `DailyNote_write_performed: false`
- `VCP_memory_write_performed: false`
- `production_candidate_created: false`
- `accepted_sample_auto_promotion: false`
- `memory_seed_promoted: false`
- `Push_L2_exercised: false`
- `package_dependency_change_performed: false`

## Current Result

The reusable visual judgment loop is locally defined and validator-backed. The
loop remains a metadata-only dry run; it does not inspect pixels or execute a
provider/tool/runtime path.

## Recommended Next

Use `docs/next_14_day_route_options.md` to choose the next route:

- keep hardening dry-run review semantics
- prepare a separately authorized manual guarded push
- draft a future A5 preflight packet without executing it

No v0.4.8 or v0.5 action is authorized by this checkpoint alone.
