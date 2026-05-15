# v13.001 Visual Production Loop Route Selection Gate

```yaml
phase: v13_001_visual_production_loop_route_selection_gate
base_contract: AGENTS.md
mode: A4.8
intent: planning
risk_level: R1
source_phase: v12_009_v12_prompt_schema_machine_validator_final_closeout
source_commit: 8cced3101864ac90f787d8854db862cc71ddbcb6
commit_message: "docs: select v13 visual production loop route"
```

## Purpose

V13 returns the project center of gravity from prompt schema validator work back
to the Visual Production Loop.

V12 is closed. The prompt schema validator exists, synthetic fixtures exist, and
the validator has proved it can distinguish PASS / WARN / FAIL on controlled
fixtures. That does not mean historical artifacts have been migrated or that the
next value lies in more validator work. The next route should decide how visual
production itself becomes a reusable loop again.

## Current State

```yaml
v12_closed: true
machine_validator_implemented: true
validator_passed_on_synthetic_fixtures: true
existing_artifacts_migrated: false
provider_contact_allowed_now: false
image_generation_allowed_now: false
memory_write_allowed_now: false
production_candidate_002_allowed_now: false
```

## Route Options

### Option A: Visual Production Loop Canonical Model

Define the canonical model for a reusable visual production loop:

```text
brief
-> shot / visual strategy
-> prompt package
-> generation authorization
-> generation result
-> human review
-> accepted candidate
-> retouch / delivery readiness
-> memory suitability planning
```

This route would turn the V7 / V8 / V10 product experiences into a shared
operating model without generating a new image, touching provider systems, or
writing memory.

Risk: low.

Recommendation: highest.

### Option B: One Existing Asset Loop Reconstruction

Reconstruct one existing accepted candidate from the already documented evidence
chain and show the full loop from initial product intent to accepted candidate
and delivery/memory boundary.

Risk: low.

Value: makes the canonical loop concrete using one real project example.

Recommendation: backup option.

### Option C: Next Product Visual Production Trial Planning

Plan a future fourth product visual production trial through brief, shot
strategy, prompt package, static review, and A5 decision gate.

Risk: low to medium.

Boundary: no provider contact and no image generation in this route selection
gate.

### Option D: Retouch / Delivery Loop Planning

Plan how accepted candidates move into final retouch package, export naming,
client review package, delivery checklist, and commercial delivery readiness
review.

Risk: low.

Boundary: no real retouch, no derivative image creation, and no commercial
delivery execution.

### Option E: Visual Memory Policy Planning

Plan when a visual production case is suitable for memory, what evidence is
required, and how memory write authorization should remain separate from review
or delivery gates.

Risk: medium.

Boundary: no DailyNote write, no VCP memory write, and no memory_write_path.

## Recommendation

```yaml
recommended_option: visual_production_loop_canonical_model
backup_option: one_existing_asset_loop_reconstruction
human_decision_required: true
auto_execution_allowed: false
```

Option A is recommended because it converts the proven product work into a
stable production model before the project starts another product, retouch,
memory, or production path. Option B is the best backup because it can ground
the model in one existing asset without creating new external side effects.

## Explicit Non-Authorization

This gate does not authorize:

```yaml
provider_contact: false
image_generation: false
retry: false
env_local_secret_value_read: false
memory_write: false
DailyNote_write: false
VCP_memory_write: false
memory_write_path: false
production_candidate_002: false
Batch_005: false
runtime_execution: false
real_retouch_execution: false
commercial_delivery_execution: false
accepted_samples_written: false
runs_output_committed: false
existing_artifacts_migrated: false
existing_prompt_packages_modified: false
```

## Closeout

```yaml
closeout:
  phase: v13_001_visual_production_loop_route_selection_gate
  source_commit: 8cced3101864ac90f787d8854db862cc71ddbcb6
  route_selection:
    v12_closed: true
    machine_validator_implemented: true
    validator_passed_on_synthetic_fixtures: true
    existing_artifacts_migrated: false
    options_presented:
      - visual_production_loop_canonical_model
      - one_existing_asset_loop_reconstruction
      - next_product_visual_production_trial_planning
      - retouch_delivery_loop_planning
      - visual_memory_policy_planning
    recommended_option: visual_production_loop_canonical_model
    backup_option: one_existing_asset_loop_reconstruction
    human_decision_required: true
  safety:
    provider_contact: false
    image_generation: false
    memory_write: false
    production_candidate_002: false
    runtime_execution: false
    runs_output_committed: false
    accepted_samples_written: false
  recommended_next:
    phase: pending_human_v13_route_selection
    auto_execution_allowed: false
    purpose: Wait for human selection before any V13 execution route begins.
  final_state:
    next_phase_started: false
```
