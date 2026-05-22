# Next 30-Day Route Options

base_contract: AGENTS.md
source_phase: v0_3_15_fifteen_day_architecture_checkpoint
status: planning_options_only

## Route A: No-Op Executor Simulator

Goal: build a no-op executor simulator that consumes the existing Bounded L4
preflight contract and proves stop/receipt/repair_once behavior without
executing provider, image, memory, dependency, runtime, push, or filesystem side
effects.

Allowed only after review:

- no-op action execution only
- metadata-only receipts
- fixture task queue
- fixture preflight packet
- validation-only loop

Not allowed:

- real executor
- provider/image generation
- VCP memory write
- DailyNote write
- dependency change
- Push_L2 auto-push test
- production_candidate
- accepted_sample auto promotion

## Route B: Visual Asset Eval Dataset Fixtures

Goal: add more metadata-only review report fixtures that exercise pass,
reject, and needs_revision outcomes across the seven Visual Asset Eval v0.1
dimensions.

Allowed:

- schema examples
- validator negative cases
- docs-only rubric refinement

Not allowed:

- image binary reads
- provider calls
- generated binaries
- runs artifacts
- memory writes
- accepted_sample promotion

## Route C: Sample Memory Policy Expansion

Goal: refine accepted/rejected sample records with additional metadata fields
while staying schema-only.

Allowed:

- schema refinement
- metadata fixtures
- validator hardening
- redacted learning summary templates

Not allowed:

- VCP memory write
- DailyNote write
- accepted_samples registry write
- rejected_samples registry write
- production_candidate

## Route D: Push_L1 Maintenance Only

Goal: keep Push_L1 narrow and maintain regression coverage when status-sync
patterns evolve.

Allowed:

- Push_L1 checklist clarification
- negative case additions
- exact status-slice fixture updates

Not allowed:

- widening Push_L1 to arbitrary docs
- Push_L2 auto-push trial
- runtime/provider/image/memory/package commits
- force push, tag, release, deploy

## Recommendation

Recommended next route: Route B or Route C if the priority is visual workflow
quality; Route A only after a separate reviewed no-op simulator gate. Push_L2
Push_L2 should remain paused until Push_L1 has more status-only repetitions and a
separate Push_L2 preflight review exists.
