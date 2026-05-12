# v7.231 Review Console Asset Status Taxonomy Gate

## Executive Verdict

```yaml
phase: v7.231_review_console_asset_status_taxonomy_gate
base_contract: AGENTS.md
mode: A4_docs_only_product_review_surface_planning
source_commit: 3936ce7dfa0265818fd68df01b8f94de33f368a2
source_phase: v7.230_prompt_package_a5_authorization_handoff_gate
overall_status: pass
product_artifact:
  asset_status_taxonomy_created: true
  review_surface_fields_created: true
  runtime_surface_created: false
  image_asset_created: false
safety:
  A5_execution: false
  provider_contact: false
  plugin_call: false
  image_generation: false
  memory_write: false
  runtime_execution: false
recommended_next: v7.232_memory_suitability_decision_matrix_gate
```

## Purpose

This gate defines the status language and review surface fields that a future Review Console will need after a separately authorized A5 generation produces reviewable assets.

It does not build the Review Console.
It does not create renderer, preload, IPC, adapter, runtime, provider, plugin, memory, or image files.
It does not assume any generated asset exists now.

## Phase Difference Patch

```yaml
phase_delta:
  creates:
    - docs/review_console_asset_status_taxonomy.md
    - docs/v7_231_review_console_asset_status_taxonomy_gate.md
  updates_status_surfaces:
    - README.md
    - docs/00_project_roadmap.md
    - PROJECT_MASTER_PLAN.md
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
    - .agent_board/CHECKPOINT.md
    - .agent_board/VALIDATION_LOG.md
  does_not_create:
    - review_console_runtime
    - renderer_code
    - preload_code
    - IPC_handlers
    - generated_image_asset
    - accepted_sample
    - memory_write_request
```

## Review Surface Placement

```yaml
review_surface_placement:
  layer: surface_app_layer
  owns_core_truth: false
  calls_runtime_directly: false
  input_expected_later: generated_asset_reference_from_authorized_A5_run
  output_allowed_now: taxonomy_and_field_spec
```

The Review Console remains a review desk. It can display future generated assets and collect human review decisions only after a separate authorized flow provides those assets.

## Asset Status Taxonomy

```yaml
asset_status_taxonomy:
  not_created:
    meaning: "No generated asset exists"
    allows_memory_suitability_review: false
  generated_pending_review:
    meaning: "Future authorized generation produced an asset that awaits human review"
    allows_memory_suitability_review: false
  needs_revision:
    meaning: "Asset may be useful but needs another prompt or generation iteration"
    allows_memory_suitability_review: false
  rejected:
    meaning: "Asset should not be used or remembered as a success"
    allows_memory_suitability_review: true
    memory_note_scope: "failure lesson draft only, no write"
  accepted_candidate:
    meaning: "Asset is visually acceptable enough for final approval consideration"
    allows_memory_suitability_review: true
  accepted_final:
    meaning: "Human has approved asset as final delivery candidate"
    allows_memory_suitability_review: true
  archived_reference_only:
    meaning: "Asset may be retained as a reference but is not an accepted output"
    allows_memory_suitability_review: true
  superseded:
    meaning: "Asset was replaced by a newer candidate"
    allows_memory_suitability_review: false
```

## Required Review Fields

```yaml
required_review_fields:
  asset_ref:
    description: "Sanitized future asset reference; no raw private path in public summary"
  source_authorization_ref:
    description: "Future A5 authorization package reference"
  prompt_package_ref:
    description: "Prompt package instance used by the future authorized generation"
  review_status:
    description: "One value from asset_status_taxonomy"
  human_score:
    description: "Human visual score or categorical rating"
  product_fidelity_result:
    description: "Whether product identity, material, and hero features survived"
  composition_result:
    description: "Whether shot, framing, crop, and layout match intent"
  artifact_result:
    description: "Whether defects, watermark, malformed geometry, or accidental text appear"
  rejection_reasons:
    description: "Structured reasons when rejected or needs_revision"
  revision_request:
    description: "Human-readable revision guidance when another attempt is needed"
  memory_suitability_status:
    description: "Draft status only; no memory write"
```

## Rejection Reason Taxonomy

```yaml
asset_rejection_reasons:
  wrong_product_identity: "Generated asset does not match product category or intended product"
  missing_hero_feature: "Required feature, material, texture, color, or shape is absent"
  broken_geometry: "Product shape, handles, seams, proportions, or edges are malformed"
  text_logo_watermark: "Unapproved readable text, logo-like mark, watermark, or label appears"
  poor_material_fidelity: "Material, texture, finish, weave, or surface quality is wrong"
  composition_mismatch: "Shot type, framing, angle, crop, or negative space misses the brief"
  lighting_failure: "Lighting hides detail, blows highlights, or creates unsuitable shadows"
  background_distraction: "Background competes with product or adds forbidden elements"
  style_drift: "Visual style diverges from the approved prompt package"
  unsafe_or_private_content: "Asset includes sensitive, private, or disallowed content"
```

## Status Transition Rules

```yaml
status_transition_rules:
  not_created_can_move_to:
    - generated_pending_review
  generated_pending_review_can_move_to:
    - needs_revision
    - rejected
    - accepted_candidate
    - archived_reference_only
  accepted_candidate_can_move_to:
    - accepted_final
    - needs_revision
    - rejected
  accepted_final_can_move_to:
    - archived_reference_only
    - superseded
  rejected_can_move_to:
    - archived_reference_only
    - superseded
  needs_revision_can_move_to:
    - superseded
  superseded_can_move_to: []
```

No status transition may call a provider, retry generation, write memory, or save output by itself.

## Review Console Field Groups

```yaml
review_console_field_groups:
  asset_identity:
    - asset_ref
    - source_authorization_ref
    - prompt_package_ref
    - generated_at_later
  visual_review:
    - review_status
    - human_score
    - product_fidelity_result
    - composition_result
    - artifact_result
  decision_detail:
    - rejection_reasons
    - revision_request
    - accepted_candidate_notes
    - final_approval_notes
  boundary_state:
    - generation_allowed_now
    - retry_allowed_now
    - memory_write_allowed_now
    - DailyNote_write_allowed_now
  memory_suitability:
    - memory_suitability_status
    - memory_candidate_reason
    - failure_lesson_candidate
```

## Memory Suitability Handoff

```yaml
memory_suitability_handoff:
  allowed_by_this_gate: draft_only
  memory_write_allowed_now: false
  DailyNote_write_allowed_now: false
  can_begin_after_status:
    - rejected
    - accepted_candidate
    - accepted_final
    - archived_reference_only
  requires_future_gate: v7.232_memory_suitability_decision_matrix_gate
```

The asset status can make a memory decision reviewable. It cannot write memory.

## Explicit Non-Authorization

```yaml
not_authorized_by_v7_231:
  A5_execution: false
  provider_contact: false
  plugin_call: false
  image_generation: false
  runtime_execution: false
  review_console_runtime: false
  renderer_code_creation: false
  preload_code_creation: false
  IPC_handler_creation: false
  output_save: false
  accepted_samples_write: false
  runs_write: false
  DailyNote_write: false
  VCP_memory_write: false
  VCPChat_runtime: false
  VCPToolBox_runtime: false
  real_manifest_read: false
  CDP_access: false
  bridge_methods: false
  MCP_calls: false
  production_candidate_002: false
  batch_005: false
  tag_release_deploy: false
  dependency_change: false
```

## Recommended Next Phase

```yaml
recommended_next:
  phase: v7.232_memory_suitability_decision_matrix_gate
  type: A4_docs_only_memory_suitability_planning
  purpose: >
    Define how accepted, rejected, or archived future assets become memory
    suitability candidates without writing DailyNote or VCP memory.
  auto_execution_allowed: true
```

## Closeout Template

```yaml
closeout:
  phase: v7.231_review_console_asset_status_taxonomy_gate
  source_commit: 3936ce7dfa0265818fd68df01b8f94de33f368a2
  commit_hash: null
  commit_message: "docs: add review console asset status taxonomy"
  branch: master
  changed_files: 0
  push: not_performed
  product_artifact:
    asset_status_taxonomy_created: true
    review_surface_fields_created: true
    runtime_surface_created: false
    image_asset_created: false
  validation:
    git_diff_check: pass
    exact_diff_reviewed: true
    agent_board_state_validator: pass
  safety:
    A5_execution: false
    provider_contact: false
    plugin_call: false
    image_generation: false
    memory_write: false
    runtime_execution: false
  final_state:
    next_phase_started: false
```
