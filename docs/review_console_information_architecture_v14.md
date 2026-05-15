# Review Console Information Architecture v14

```yaml
ia_id: review_console_information_architecture_v14
source_phase: v14_003_review_console_information_architecture_gate
source_commit: e172e5a25bcdb4ea95cc9f9dece39cdec5082a27
selected_route: review_console_productization_planning
status: docs_only_information_architecture
```

## IA Intent

This document defines how Review Console should organize reviewed visual assets,
evidence, delivery readiness, watch items, route decisions, and safety
boundaries. It is a structure handoff for future UI or runtime work, not a UI
implementation.

Review Console is an observation and decision surface. It is not an executor.

It must not directly trigger providers, generate images, write memory, write
`accepted_samples/`, commit `runs/` output, execute retouch, execute delivery,
or promote `production_candidate_002`. Future implementation requires an
independent authorization gate.

## Page Structure

### Review Console Home

Purpose: provide the entry point for all reviewable assets and pending route
decisions.

Primary regions:

- asset list by current status
- pending next action list
- risk boundary summary
- recent route closeouts
- filter rail for asset, product, status, pending action, risk boundary, and
  route closeout

Default sort:

```yaml
sort_order:
  - pending_human_authorization
  - accepted_candidate_with_delivery_blockers
  - generated_local_output_verified
  - prompt_static_reviewed
  - route_closed
```

### Asset Detail View

Purpose: show a single asset lane from source prompt through current route
status.

Primary regions:

- Asset Summary
- Review Timeline
- Evidence Panel
- Delivery Readiness Panel
- Watch Items Panel
- Safety Boundary Panel
- Next Action Queue
- Route Closeout Panel

### Evidence View

Purpose: inspect evidence packages without copying or opening image binaries.

Primary regions:

- evidence package reference
- prompt package reference
- generation output path reference
- local persistence state
- key findings
- accepted candidate boundary
- commercial delivery boundary
- memory suitability boundary

### Delivery Readiness View

Purpose: show whether an accepted candidate can proceed toward commercial
delivery planning.

Primary regions:

- delivery readiness package
- delivery readiness review
- commercial delivery readiness
- retouch needed later
- QA blockers
- export naming policy
- accepted_samples entry blockers

### Watch Items View

Purpose: group all unresolved review concerns across assets.

Primary regions:

- watch item list
- severity
- delivery impact
- retouch requirement
- delivery blocking state
- resolution status

### Route Decision View

Purpose: present route options and the authorization boundary for each option.

Primary regions:

- route decision summary
- options presented
- recommended option
- backup option
- human decision requirement
- auto execution allowance
- next phase target

### Safety Boundary View

Purpose: make side-effect boundaries explicit before any next action is chosen.

Primary regions:

- provider contact state
- image generation state
- memory write state
- accepted_samples write state
- runs output commit state
- real retouch execution state
- production_candidate_002 state

### Next Action Queue

Purpose: list proposed future actions with risk, authorization requirement, and
blocker reasons.

Primary regions:

- action type
- risk level
- allowed now
- human authorization requirement
- recommendation marker
- blocker reason

## Navigation Structure

Review Console should support navigation by the following axes:

```yaml
navigation_axes:
  by_asset:
    examples:
      - premium_serum_bottle_v10_011
      - premium_portable_led_camping_lantern_v13_013
      - ceramic_mug_v4
      - sports_visor_v8_033
  by_product:
    examples:
      - premium_serum_bottle
      - premium_portable_led_camping_lantern
      - matte_ceramic_mug
      - multi_color_mesh_sports_visor
  by_status:
    examples:
      - prompt_static_reviewed
      - generated_local_output_verified
      - accepted_candidate_with_minor_watch_items
      - commercial_delivery_ready
      - route_closed
  by_pending_action:
    examples:
      - delivery_readiness_review
      - retouch_authorization
      - accepted_samples_entry_planning
      - memory_suitability_planning
      - stop
  by_risk_boundary:
    examples:
      - provider_contact
      - image_generation
      - memory_write
      - accepted_samples_written
      - real_retouch_execution
  by_route_closeout:
    examples:
      - reconstructed_as_visual_production_loop_sample
      - closed_as_accepted_candidate_with_delivery_readiness_package
```

## Core Information Blocks

### Asset Summary

```yaml
Asset_Summary:
  asset_id: string
  product: string
  source_output: string
  asset_status: string
  accepted_candidate: boolean
  commercial_delivery_ready: boolean
  memory_suitability: explicit_value
  accepted_samples_ready: boolean
  route_status: string
```

Display rule: this block should be visible on Home summary rows and always
expanded on Asset Detail View.

### Review Timeline

```yaml
Review_Timeline:
  phase: string
  commit_hash: string
  event_type: route_selection | planning | authorization | generation | review | evidence | delivery_readiness | closeout
  result: string
  source_doc: string
  validation_status: pass | pass_with_warnings | blocked | failed | not_run
```

Display rule: timeline entries should never imply execution unless the source
document explicitly records execution and authorization.

### Evidence Panel

```yaml
Evidence_Panel:
  evidence_package: string
  prompt_package: string
  generation_output: string
  local_persistence: verified | not_verified | not_applicable
  key_findings: list
```

Display rule: source output paths are references only. The panel must not copy
or stage generated image files.

### Delivery Readiness Panel

```yaml
Delivery_Readiness_Panel:
  delivery_readiness_package: string
  delivery_readiness_review: string
  commercial_delivery_ready: boolean
  retouch_needed_later: string
  QA_blockers: list
  export_naming_policy: draft | approved | not_defined
```

Display rule: `commercial_delivery_ready: false` must remain distinct from
`accepted_candidate: true`.

### Watch Items Panel

```yaml
Watch_Items_Panel:
  watch_item_id: string
  severity: info | minor | major | blocker
  delivery_impact: none | low | medium | high
  retouch_required: boolean
  blocks_delivery: boolean
  resolved_status: unresolved | deferred | resolved | not_applicable
```

Display rule: unresolved watch items may coexist with accepted candidate status
when they do not block candidate retention.

### Safety Boundary Panel

```yaml
Safety_Boundary_Panel:
  provider_contact: boolean
  image_generation: boolean
  memory_write: boolean
  accepted_samples_written: boolean
  runs_output_committed: boolean
  real_retouch_execution: boolean
  production_candidate_002: boolean
```

Display rule: false means not performed or not allowed in the current gate. The
panel must not include controls that perform those actions.

### Next Action Queue

```yaml
Next_Action_Queue:
  action_type: route_selection | prompt_revision | generation_authorization | retouch_authorization | delivery_review | memory_planning | accepted_samples_planning | stop
  risk_level: low | medium | high
  requires_human_authorization: boolean
  allowed_now: boolean
  recommended: boolean
  blocker_reason: string
```

Display rule: actions with `allowed_now: false` may be shown as future options,
but must not be executable.

## Status Classification Mapping

```yaml
asset_status_taxonomy:
  draft_prompt_only:
    meaning: prompt or planning exists but prompt package is not ready for execution
    execution_allowed: false
  prompt_static_reviewed:
    meaning: prompt package has passed static review but A5 execution is not implied
    execution_allowed: false
  generated_local_output_verified:
    meaning: authorized generation produced at least one verified local file
    human_review_required: true
  accepted_candidate_with_minor_watch_items:
    meaning: asset is retained as accepted candidate while minor watch items remain
    commercial_delivery_ready: false
  accepted_candidate_with_minor_retouch:
    meaning: asset is accepted as candidate but future retouch authorization is likely
    commercial_delivery_ready: false
  needs_minor_retouch:
    meaning: asset requires a future retouch gate before delivery review
    retouch_authorization_required: true
  needs_final_retouch:
    meaning: asset requires final retouch before delivery readiness can be true
    retouch_authorization_required: true
  commercial_delivery_ready:
    meaning: delivery readiness review has approved the asset for commercial delivery
    requires_delivery_review_record: true
  rejected:
    meaning: asset is not suitable for accepted candidate use
    downstream_execution_allowed: false
  route_closed:
    meaning: lane has a closeout record and no automatic next execution
    next_phase_started: false
```

## Existing Asset Examples

### premium_serum_bottle_v10_011

```yaml
asset_id: premium_serum_bottle_v10_011
product: premium_serum_bottle
source_output: runs/real_generation/v10_010_premium_serum_bottle_first_trial/native_doubao_1778809662218_0.jpg
asset_status: accepted_candidate
accepted_candidate: true
commercial_delivery_ready: false
memory_suitability: deferred
accepted_samples_ready: false
route_status: reconstructed_as_visual_production_loop_sample
default_view: Asset Detail View
primary_panels:
  - Asset Summary
  - Review Timeline
  - Evidence Panel
  - Route Closeout Panel
```

### premium_portable_led_camping_lantern_v13_013

```yaml
asset_id: premium_portable_led_camping_lantern_v13_013
product: premium_portable_led_camping_lantern
source_output: runs/real_generation/v13_012_premium_portable_led_camping_lantern_first_trial/native_doubao_1778838659034_0.jpg
asset_status: accepted_candidate_with_minor_watch_items
accepted_candidate: true
commercial_delivery_ready: false
memory_suitability: deferred
accepted_samples_ready: false
route_status: closed_as_accepted_candidate_with_delivery_readiness_package
default_view: Asset Detail View
primary_panels:
  - Asset Summary
  - Evidence Panel
  - Delivery Readiness Panel
  - Watch Items Panel
  - Safety Boundary Panel
  - Route Closeout Panel
```

### ceramic_mug_v4

```yaml
asset_id: ceramic_mug_v4
product: matte_ceramic_mug
source_output: runs/real_generation/v7_281_matte_ceramic_mug_v4_trial/native_doubao_1778690863339_0.jpg
asset_status: accepted_candidate
accepted_candidate: true
commercial_delivery_ready: false
memory_suitability: deferred
accepted_samples_ready: false
route_status: earlier_lane_example
default_view: Asset Detail View
primary_panels:
  - Asset Summary
  - Evidence Panel
  - Delivery Readiness Panel
```

### sports_visor_v8_033

```yaml
asset_id: sports_visor_v8_033
product: multi_color_mesh_sports_visor
source_output: runs/real_generation/v8_033_multi_color_mesh_sports_visor_v2_after_persistence_fix_trial/native_doubao_1778748094308_0.jpg
asset_status: accepted_candidate
accepted_candidate: true
commercial_delivery_ready: false
memory_suitability: deferred
accepted_samples_ready: false
route_status: earlier_lane_example
default_view: Asset Detail View
primary_panels:
  - Asset Summary
  - Evidence Panel
  - Delivery Readiness Panel
```

## Execution Boundary

```yaml
Review_Console_is_observation_and_decision_surface: true
direct_provider_trigger_allowed: false
direct_memory_write_allowed: false
direct_accepted_samples_write_allowed: false
direct_runs_output_commit_allowed: false
direct_retouch_execution_allowed: false
direct_delivery_execution_allowed: false
future_implementation_requires_independent_authorization: true
```

The Review Console may display recommended next actions, but a displayed action
is not authorization. Each side-effectful lane needs its own future gate.

## Recommended Next

```yaml
recommended_next:
  phase: v14_004_review_console_wireframe_and_data_contract_gate
  auto_execution_allowed: true
final_state:
  next_phase_started: false
```
