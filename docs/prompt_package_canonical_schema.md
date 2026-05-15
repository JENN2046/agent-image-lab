# Prompt Package Canonical Schema

```yaml
schema_id: prompt_package_canonical_schema_v1
route: V11 Prompt Schema Hardening
source_phase: v11_004_prompt_package_schema_draft_gate
source_inventory: docs/prompt_artifact_schema_inventory.md
mode: A4.8 docs-only schema draft
```

This schema draft captures the prompt package fields that stabilized across the ceramic mug, sports visor, and premium serum bottle routes. It is a documentation schema, not an execution contract. A prompt package that conforms to this schema still does not authorize provider contact, image generation, memory write, accepted_samples write, production promotion, or runtime work.

## Canonical Shape

```yaml
prompt_package:
  prompt_package_id: string_required
  version: string_required
  language: string_required
  mode: text_to_image
  reference_policy: text_only_no_image_input
  title_cn: string_required
  purpose_cn: string_required
  status_cn: string_required

  lineage:
    product_brief_ref: string_optional
    source_phase: string_required
    source_review_ref: string_optional
    source_output_ref: string_optional
    source_prompt_package: string_optional

  product_identity:
    product_type: string_required
    product_category: string_optional
    category_terms: list_required
    must_not_be: list_required

  structure_lock:
    locked_structure: string_required
    required_parts: map_or_list_required
    forbidden_structure_drift: list_required
    extra_product_allowed: boolean_required

  material_constraints:
    primary_material: string_required
    texture_behavior: string_required
    finish: string_required
    forbidden_material_drift: list_required

  scene_constraints:
    shot_type: string_required
    usage: string_required
    allowed_environment: list_or_string_required
    background_role: string_required
    props_allowed: boolean_required
    people_allowed: boolean_required
    hands_allowed: boolean_required

  composition:
    product_frame_coverage: string_required
    product_dominance: string_required
    layout: string_required
    camera_angle: string_required
    crop_policy: string_required

  text_logo_policy:
    readable_logo_allowed: boolean_required
    readable_text_allowed: boolean_required
    fake_text_allowed: boolean_required
    watermark_allowed: boolean_required
    label_area_policy: string_optional

  runner_prompt_mapping:
    canonical_prompt_field: prompt
    runner_expected_prompt_field: prompt
    positive_prompt_retained_for_review: boolean_required
    positive_prompt_sync_required: boolean_required

  prompt: literal_block_required
  positive_prompt: literal_block_required_for_new_packages
  negative_prompt: literal_block_required

  negative_constraints:
    product_identity: list_required
    structure: list_optional
    material: list_required
    scene: list_required
    text_logo: list_required
    safety: list_required

  acceptance_criteria: map_required
  human_review_checklist: list_required

  execution_safety_flags:
    A5_authorization_required_later: true
    plugin_call_allowed_by_this_file: false
    provider_contact_allowed_by_this_file: false
    image_generation_allowed_by_this_file: false
    memory_write_allowed: false
    daily_note_write_allowed: false
    production_candidate_002_allowed: false
    accepted_samples_write_allowed: false
    runs_output_creation_allowed: false
```

## Field Rules

### Identity And Lineage

`prompt_package_id`, `version`, `language`, `mode`, `reference_policy`, `title_cn`, `purpose_cn`, and `status_cn` are required for every new executable prompt package.

`lineage` must record the closest available source:

- `product_brief_ref` for new product routes.
- `source_review_ref` and `source_output_ref` for prompt revision routes.
- `source_prompt_package` when a package revises an earlier package.

Older routes without a dedicated product brief should mark `product_brief_ref: null` or explain the legacy source in the phase record. They should not fabricate a missing brief.

### Runner-Facing Prompt Fields

`prompt: |` is the canonical runner-facing field.

New prompt packages must also include `positive_prompt: |` as a review alias unless a phase explicitly records why it is omitted. When `positive_prompt` is present, it must be textually synchronized with `prompt` unless the phase records an intentional difference.

`negative_prompt: |` must be independent and must not be embedded inside `prompt` or `positive_prompt`.

Required YAML shape for new packages:

```yaml
prompt: |
  <positive runner prompt>

positive_prompt: |
  <same content as prompt unless documented otherwise>

negative_prompt: |
  <negative prompt>
```

### Product Identity And Structure

`product_identity` locks what the object is and is not. `structure_lock` locks required geometry, silhouette, and product parts.

Examples:

- A sports visor must remain an open-top visor, not a baseball cap or cycling cap.
- A serum bottle must remain a frosted translucent glass bottle with a clean dropper cap, not a perfume bottle or pump bottle.
- A mug must remain a believable ceramic mug with a continuous handle and stable rim geometry.

### Material And Scene Constraints

`material_constraints` must name the main material, texture behavior, finish, and forbidden material drift.

`scene_constraints` must describe the scene role without authorizing generation. It should separate allowed context from forbidden clutter, people, hands, and props.

### Text, Logo, And Label Boundary

Every new prompt package must include `text_logo_policy`. If the product can include a label area, the policy must distinguish:

- blank label
- non-readable minimal label
- readable logo
- fake text
- random letters
- watermark

Readable brand/logo/text remains forbidden unless explicitly required by a future authorized product brief and review gate.

### Acceptance Criteria And Human Review

`acceptance_criteria` must be machine-readable enough for static review. `human_review_checklist` must be short enough for a reviewer to use directly.

Accepted candidate status is downstream review data and must not be inferred from a prompt package.

Commercial delivery readiness is downstream delivery review data and must not be inferred from a prompt package.

Memory suitability is downstream review/evidence data and must not be inferred from a prompt package.

### Execution Safety Flags

Every new prompt package must explicitly state that the file itself does not authorize:

- provider contact
- image generation
- plugin calls
- memory write
- DailyNote write
- production candidate promotion
- accepted_samples write
- runs output creation

`A5_authorization_required_later: true` is required for executable packages that might later be used in real generation.

## Validation Strategy

### Static Checks

Future machine validation should check:

```yaml
prompt_package_static_checks:
  path_under_prompts_image_generation: true
  has_prompt_package_id: true
  has_version: true
  has_mode_text_to_image: true
  has_reference_policy_text_only: true
  has_prompt_literal_block: true
  has_positive_prompt_literal_block_for_new_packages: true
  prompt_positive_prompt_sync_or_documented_exception: true
  has_negative_prompt_literal_block: true
  has_runner_prompt_mapping: true
  runner_canonical_prompt_field_is_prompt: true
  has_product_identity: true
  has_structure_lock: true
  has_material_constraints: true
  has_scene_constraints: true
  has_text_logo_policy: true
  has_acceptance_criteria: true
  has_human_review_checklist: true
  execution_safety_flags_all_false_except_A5_required_later: true
```

### Warning Checks

Future machine validation should warn, not fail, when legacy packages omit fields that were not required when they were created:

```yaml
legacy_warning_checks:
  missing_positive_prompt_in_legacy_mug_package: warn
  legacy_control_group_names_without_structure_lock: warn
  missing_text_logo_policy_but_negative_prompt_contains_no_text_no_logo: warn
```

### Failure Checks

Future machine validation should fail new packages when:

```yaml
new_package_fail_checks:
  missing_prompt: fail
  missing_negative_prompt: fail
  runner_canonical_field_not_prompt: fail
  positive_prompt_present_but_unsynced_without_exception: fail
  missing_no_execution_flags: fail
  provider_contact_allowed_by_this_file_true: fail
  image_generation_allowed_by_this_file_true: fail
  memory_write_allowed_true: fail
  accepted_samples_write_allowed_true: fail
  production_candidate_002_allowed_true: fail
```

## Migration Policy

Existing prompt packages should not be rewritten mechanically. Migration should happen only when a route actually revises or reuses a package.

```yaml
migration_policy:
  ceramic_mug_v4:
    status: legacy_accepted_candidate_prompt
    action: do_not_rewrite_without_new_phase
    known_gap: positive_prompt_not_retained
  sports_visor_v2:
    status: near_canonical
    action: use_as_reference_for_new_multi_product_packages
  premium_serum_bottle_v1:
    status: near_canonical
    action: use_as_reference_for_new_single_product_packages
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
runner_behavior_changed: false
prompt_package_behavior_changed: false
A5_generation_authorization_created: false
```
