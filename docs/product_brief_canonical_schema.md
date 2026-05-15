# Product Brief Canonical Schema

```yaml
schema_id: product_brief_canonical_schema_v1
route: V11 Prompt Schema Hardening
source_phase: v11_006_product_brief_schema_draft_gate
source_inventory: docs/prompt_artifact_schema_inventory.md
mode: A4.8 docs-only schema draft
```

This schema draft captures the product brief fields that stabilized in the sports visor and premium serum bottle lanes. It also records the ceramic mug lane as a legacy product route that predates the dedicated `briefs/` artifact pattern.

A product brief is not a generation request. It does not authorize provider contact, image generation, memory write, accepted_samples write, production promotion, output directory creation, or runtime work.

## Canonical Shape

```yaml
product_brief:
  brief_id: string_required
  brief_status: draft_for_prompt_package | reviewed_for_prompt_package | archived_legacy
  source_phase: string_required
  source_route: string_required

  product:
    product_name: string_required
    product_name_zh: string_optional
    product_category: string_required
    product_direction: string_required
    ecommerce_role: list_required

  identity_lock:
    product_type: string_required
    category_terms: list_required
    must_not_be: list_required
    target_use_or_audience: list_or_string_optional

  structure_lock:
    locked_structure: string_required
    required_parts: map_or_list_required
    forbidden_structure_drift: list_required
    silhouette_must_read_as: string_required
    silhouette_must_not_read_as: list_required

  material_texture:
    primary_materials: list_required
    texture_requirements: list_required
    finish_requirements: list_required
    forbidden_material_drift: list_required

  color_or_finish_strategy:
    strategy_type: color_collection | finish_system | neutral_product_finish
    required_or_preferred_colors: list_optional
    hierarchy_rule: string_required
    forbidden_color_or_finish_drift: list_optional

  scene_composition_boundary:
    primary_shot: string_required
    alternate_shot: string_optional
    aspect_ratio_preference: string_optional
    product_dominance_rule: string_required
    background_role: string_required
    people_allowed: boolean_required
    hands_allowed: boolean_required
    props_allowed: boolean_required

  text_label_logo_policy:
    readable_logo_allowed: boolean_required
    readable_text_allowed: boolean_required
    fake_text_allowed: boolean_required
    watermark_allowed: boolean_required
    label_or_blank_zone_policy: string_optional

  acceptance_criteria: list_required
  known_risks: list_required

  handoff:
    next_artifact: string_required
    next_phase: string_required
    A5_authorization_required_later: true
    plugin_call_allowed_by_this_brief: false
    provider_contact_allowed_by_this_brief: false
    image_generation_allowed_by_this_brief: false
    memory_write_allowed_by_this_brief: false
    accepted_samples_write_allowed_by_this_brief: false
    runs_output_creation_allowed_by_this_brief: false
```

## Field Rules

### Brief Identity

`brief_id`, `brief_status`, `source_phase`, and `source_route` are required for all new product briefs.

`brief_status` must not imply execution readiness. The allowed values describe documentation maturity only.

### Product And Identity Lock

The `product` block records the commercial object and its intended role. The `identity_lock` block prevents category drift before prompt drafting begins.

Examples:

- A sports visor brief must forbid baseball cap, cycling cap, bucket hat, helmet, and full crown cap drift.
- A premium serum bottle brief must forbid perfume bottle, medicine bottle, candle jar, beverage bottle, lotion pump bottle, and generic plastic container drift.

### Structure Lock

`structure_lock` must name the required object structure before prompt drafting. It should define both required parts and forbidden shape drift.

This field is the brief-level source of truth for later prompt package `structure_lock`.

### Material And Texture

`material_texture` must identify the expected material system and the common material drift risks.

Examples:

- Sports visor: lightweight matte athletic textile, breathable mesh, stitching, no glossy plastic or helmet-like rubber shell.
- Serum bottle: frosted translucent glass, soft edge highlights, clean dropper cap, no cheap plastic or metallic bottle body drift.

### Color Or Finish Strategy

The brief must define whether the product depends on a color collection, a finish system, or a stable neutral finish.

This avoids later prompt drift where a supporting color or finish becomes visually dominant.

### Scene And Composition Boundary

The brief must state whether the first prompt should be studio, lifestyle, ecommerce hero, or product-only. It must explicitly set people, hands, and props boundaries.

If people, hands, readable text, logos, or branded labels are required later, that must be an explicit exception in a future phase.

### Text, Label, And Logo Policy

The brief must define the label/text/logo boundary before prompt drafting:

- readable logo allowed or forbidden
- readable text allowed or forbidden
- fake text allowed or forbidden
- watermark allowed or forbidden
- label or blank zone policy when relevant

### Acceptance Criteria And Known Risks

`acceptance_criteria` must be reviewer-facing and product-specific. `known_risks` must list likely failure modes that should be carried into prompt package negative constraints.

### Handoff Boundary

The handoff block must keep the brief non-executing. A brief can point to a next prompt package phase, but it cannot authorize provider contact, image generation, memory write, accepted_samples write, runs output creation, or production promotion.

## Legacy Policy

```yaml
legacy_policy:
  ceramic_mug_route:
    dedicated_brief_artifact_exists: false
    status: legacy_route_without_briefs_artifact
    action: do_not_fabricate_backfilled_brief
    future_reuse_policy: create a new brief only if a future phase explicitly reopens or revises the mug product lane
  sports_visor_route:
    dedicated_brief_artifact_exists: true
    reference_file: briefs/product_brief_multi_color_mesh_sports_visor_v1.md
  premium_serum_bottle_route:
    dedicated_brief_artifact_exists: true
    reference_file: briefs/product_brief_premium_serum_bottle_v1.md
```

## Validation Strategy

Future machine validation should check:

```yaml
product_brief_static_checks:
  path_under_briefs: true
  has_brief_id: true
  has_brief_status: true
  has_source_phase: true
  has_source_route: true
  has_product_block: true
  has_identity_lock: true
  has_structure_lock: true
  has_material_texture: true
  has_color_or_finish_strategy: true
  has_scene_composition_boundary: true
  has_text_label_logo_policy: true
  has_acceptance_criteria: true
  has_known_risks: true
  has_handoff: true
  handoff_requires_A5_later: true
  handoff_provider_contact_false: true
  handoff_image_generation_false: true
  handoff_memory_write_false: true
  handoff_accepted_samples_false: true
  handoff_runs_output_creation_false: true
```

Future validation should warn, not fail, when legacy product routes lack dedicated briefs:

```yaml
legacy_warning_checks:
  ceramic_mug_missing_dedicated_brief: warn
  route_docs_used_as_legacy_brief_source: warn
```

## Non-Authorization

```yaml
provider_contact: false
image_generation: false
retry: false
env_local_secret_value_read: false
DailyNote_write: false
VCP_memory_write: false
memory_write_path: false
production_candidate_002: false
Batch_005: false
accepted_samples_written: false
runs_output_committed: false
runtime_execution: false
brief_behavior_changed: false
prompt_package_behavior_changed: false
A5_generation_authorization_created: false
```
