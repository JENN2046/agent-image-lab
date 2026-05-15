# Review Console Productization Plan v14

```yaml
plan_id: review_console_productization_plan_v14
source_phase: v14_002_review_console_productization_planning_gate
source_commit: 110ac1e842f3e70dd2a44d78f98e928eb8cdadee
selected_route: review_console_productization_planning
status: docs_only_productization_plan
```

## Product Intent

Review Console should become the operating surface for the visual production
loop after a prompt package or generated output exists. In V14, the product
surface is planned around review evidence, asset status, watch items, delivery
readiness, route decisions, and hard safety boundaries.

This plan does not implement UI or runtime behavior. It defines the product
information architecture and data objects that a future implementation can use.

## Core Views

### Asset Overview

Purpose: show the current state of one reviewed asset or planned asset lane.

Primary signals:

- product identity
- source output reference
- prompt package reference
- asset status
- accepted candidate state
- commercial delivery readiness
- memory suitability
- accepted samples readiness
- route status

### Review Timeline

Purpose: show the sequence of review, authorization, generation, evidence,
delivery readiness, and closeout events.

Primary signals:

- phase
- commit hash
- event type
- result
- reviewer
- source document
- phase timestamp or phase time

### Evidence Package Panel

Purpose: summarize accepted candidate evidence without copying image binaries.

Primary signals:

- source output path
- prompt package path
- evidence package path
- accepted candidate explicitness
- commercial delivery boundary
- memory suitability boundary
- runs output commit boundary

### Delivery Readiness Panel

Purpose: show whether the asset can move toward retouch, delivery review,
accepted_samples entry planning, or memory suitability planning.

Primary signals:

- delivery readiness package
- delivery readiness review
- commercial delivery blockers
- retouch watch items
- export naming policy draft
- QA checklist status

### Watch Items Panel

Purpose: keep human review findings visible across route decisions.

Primary signals:

- watch item severity
- delivery impact
- retouch requirement
- whether it blocks delivery
- product identity protection during future retouch

### Safety Boundary Panel

Purpose: make forbidden actions visible before a reviewer chooses the next
route.

Primary signals:

- provider contact boundary
- image generation boundary
- memory write boundary
- accepted_samples write boundary
- runs output commit boundary
- production_candidate_002 boundary
- retouch and delivery execution boundary

### Next Action Queue

Purpose: present route choices as product actions with risk and authorization
requirements.

Primary signals:

- next action type
- risk level
- human authorization required
- forbidden until authorized
- recommended action

### Route Closeout Panel

Purpose: show the lane's final state and what downstream actions remain
unperformed.

Primary signals:

- final asset status
- route status
- accepted candidate retained
- commercial delivery readiness
- memory suitability
- accepted_samples readiness
- closeout document

## Core Objects

### ReviewAsset

```yaml
ReviewAsset:
  asset_id: string
  product: string
  source_output: string
  prompt_package: string
  asset_status: string
  accepted_candidate: boolean
  commercial_delivery_ready: boolean
  memory_suitability: explicit_value
  accepted_samples_ready: boolean
  route_status: string
```

### ReviewEvent

```yaml
ReviewEvent:
  phase: string
  commit_hash: string
  event_type: route_selection | planning | authorization | generation | review | evidence | delivery_readiness | closeout
  result: string
  reviewer: human | codex | mixed
  timestamp_or_phase_time: string
  source_doc: string
```

### EvidencePackage

```yaml
EvidencePackage:
  evidence_id: string
  asset_id: string
  source_output: string
  prompt_package: string
  evidence_doc: string
  accepted_candidate: boolean
  commercial_delivery_ready: boolean
  memory_suitability: explicit_value
  output_image_added_to_git: false
  accepted_samples_written: false
  memory_write_performed: false
```

### DeliveryReadinessPackage

```yaml
DeliveryReadinessPackage:
  package_id: string
  asset_id: string
  evidence_package: string
  current_asset_status: string
  commercial_delivery_ready: boolean
  retouch_needed: string
  delivery_readiness_review_required: boolean
  qa_checklist_ref: string
  blocker_summary: string
```

### WatchItem

```yaml
WatchItem:
  id: string
  severity: info | minor | major | blocker
  description: string
  delivery_impact: none | low | medium | high
  retouch_required: boolean
  blocks_delivery: boolean
```

### RouteDecision

```yaml
RouteDecision:
  decision_id: string
  phase: string
  options_presented: list
  selected_option: string
  recommended_option: string
  backup_option: string
  human_decision_required: boolean
  auto_execution_allowed: boolean
  next_phase: string
```

### SafetyBoundary

```yaml
SafetyBoundary:
  boundary_id: string
  asset_id: string
  provider_contact_allowed: boolean
  image_generation_allowed: boolean
  memory_write_allowed: boolean
  accepted_samples_write_allowed: boolean
  runs_output_commit_allowed: boolean
  retouch_execution_allowed: boolean
  delivery_execution_allowed: boolean
  production_candidate_002_allowed: boolean
```

### NextAction

```yaml
NextAction:
  action_id: string
  action_type: route_selection | retouch_authorization | delivery_review | memory_planning | accepted_samples_planning | stop
  risk_level: low | medium | high
  requires_human_authorization: boolean
  forbidden_until_authorized: list
  recommended: boolean
```

## V13 Asset Chains

### premium_serum_bottle_v10_011

```yaml
ReviewAsset:
  asset_id: premium_serum_bottle_v10_011
  product: premium_serum_bottle
  source_output: runs/real_generation/v10_010_premium_serum_bottle_first_trial/native_doubao_1778809662218_0.jpg
  prompt_package: prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml
  asset_status: accepted_candidate
  accepted_candidate: true
  commercial_delivery_ready: false
  memory_suitability: deferred
  accepted_samples_ready: false
  route_status: reconstructed_as_visual_production_loop_sample
```

Review Console should show this chain as the first reconstructed Visual
Production Loop sample: brief, shot strategy, prompt package, A5 authorization,
generation run, human review, evidence package, route closeout, and deferred
downstream decisions.

### premium_portable_led_camping_lantern_v13_013

```yaml
ReviewAsset:
  asset_id: premium_portable_led_camping_lantern_v13_013
  product: premium_portable_led_camping_lantern
  source_output: runs/real_generation/v13_012_premium_portable_led_camping_lantern_first_trial/native_doubao_1778838659034_0.jpg
  prompt_package: prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml
  asset_status: accepted_candidate_with_minor_watch_items
  accepted_candidate: true
  commercial_delivery_ready: false
  memory_suitability: deferred
  accepted_samples_ready: false
  route_status: closed_as_accepted_candidate_with_delivery_readiness_package
```

Review Console should show this chain as the first V13 fourth-product trial
with a full lane closeout: prompt package, static review, A5 draft,
pre-execution package, one authorized generation, human review, evidence
package, delivery readiness package, delivery readiness review, and route
closeout.

Relevant watch items:

```yaml
watch_items:
  - id: diffuser_center_brightness
    severity: minor
    description: Diffuser center brightness should remain controlled in any future delivery crop.
    delivery_impact: low
    retouch_required: false
    blocks_delivery: false
  - id: lower_body_darkness
    severity: minor
    description: Lower body darkness should be reviewed before commercial delivery.
    delivery_impact: low
    retouch_required: false
    blocks_delivery: false
  - id: base_body_separation
    severity: minor
    description: Base and body separation should remain readable.
    delivery_impact: low
    retouch_required: false
    blocks_delivery: false
  - id: edge_readability_in_crop
    severity: minor
    description: Edges should remain readable under tighter crop.
    delivery_impact: low
    retouch_required: false
    blocks_delivery: false
```

### Earlier Lane Examples

```yaml
earlier_lane_examples:
  ceramic_mug_v4:
    role: earlier accepted candidate lane example
    source_output_reference_only: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
  sports_visor_v8_033:
    role: earlier accepted candidate lane example
    source_output_reference_only: runs/real_generation/v8_033_multi_color_mesh_sports_visor_v2_after_persistence_fix_trial/native_doubao_1778748094308_0.jpg
```

These examples may help future information architecture, but V14.002 does not
reconstruct them again and does not read or copy their image binaries.

## Productization Boundaries

Review Console productization is a planning surface only in this phase.

```yaml
review_console_does_not:
  generate_images: true
  execute_provider: true
  write_memory: true
  write_accepted_samples: true
  execute_retouch: true
  execute_delivery: true
  commit_runs_output: true
  act_as_production_candidate_002: true
```

The future Review Console may recommend or display next actions, but it must not
perform side effects unless a separate gate grants explicit authorization.

## Next Productization Questions

The next docs-only lane should turn this product plan into information
architecture:

- Which view is the default first screen?
- Which fields are primary versus secondary?
- Which fields are required to render a route safely?
- Which actions must appear disabled until authorization?
- How should historical assets and live current-lane assets be separated?

```yaml
recommended_next:
  phase: v14_003_review_console_information_architecture_gate
  auto_execution_allowed: true
final_state:
  next_phase_started: false
```
