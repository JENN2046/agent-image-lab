# v13.002 Visual Production Loop Canonical Model Gate

```yaml
phase: v13_002_visual_production_loop_canonical_model_gate
base_contract: AGENTS.md
mode: A4.8
intent: planning
risk_level: R1
source_phase: v13_001_visual_production_loop_route_selection_gate
source_commit: 46df48201ce770b79797c4c41db225417da5e2fd
selected_option: visual_production_loop_canonical_model
commit_message: "docs: define visual production loop canonical model"
```

## Purpose

This gate defines the V13 Visual Production Loop canonical model. It creates a
shared object model and state machine for moving an asset from product intent to
reviewed production evidence without authorizing any real execution.

## Artifacts

- `docs/visual_production_loop_canonical_model.md`
- `docs/visual_production_loop_state_machine.md`

## Scope

The canonical loop is:

```text
ProductBrief
-> ShotPlan
-> Shot
-> PromptPackage
-> GenerationAuthorization
-> GenerationRun
-> LocalOutput
-> HumanReview
-> AcceptedCandidate
-> RetouchPlan
-> DeliveryReadinessPackage
-> MemorySuitabilityDecision
-> RouteCloseout
```

This gate is docs-only. It does not read image binaries, call a provider, create
images, write memory, execute retouch, execute delivery, migrate artifacts, or
modify existing prompt packages.

## Closeout

```yaml
closeout:
  phase: v13_002_visual_production_loop_canonical_model_gate
  visual_production_loop_canonical_model_created: true
  state_machine_created: true
  forbidden_transitions_defined: true
  asset_status_taxonomy_defined: true
  retouch_entry_conditions_defined: true
  delivery_entry_conditions_defined: true
  memory_entry_conditions_defined: true
  provider_contact: false
  image_generation: false
  memory_write: false
  production_candidate_002: false
  runtime_execution: false
  final_state:
    next_phase_started: false
```
