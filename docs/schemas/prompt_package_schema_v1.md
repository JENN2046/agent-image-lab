# Prompt Package Schema v1

```yaml
schema_id: prompt_package_schema_v1
route: V11 Prompt Schema Hardening
source_phase: v11_004_prompt_package_schema_draft_gate
source_inventory: docs/prompt_artifact_schema_inventory.md
mode: A4.8 docs-only canonical schema
schema_status: canonical_path_alignment
related_schema: docs/prompt_package_canonical_schema.md
```

This schema defines the canonical prompt package shape for future product image prompt packages. It is a documentation schema only. It does not authorize provider contact, image generation, `.env.local` reading, memory write, accepted_samples write, production candidate promotion, runtime work, runner behavior changes, or migration of existing prompt packages.

## Canonical Shape

```yaml
prompt_package:
  package_id: string_required
  product_identity:
    product_id: string_required
    product_name: string_required
    product_category: string_required
    selected_product: string_required
    must_remain: list_required
    must_not_be: list_required

  selected_product: string_required
  locked_structure:
    summary: string_required
    required_parts: list_required
    forbidden_structure_drift: list_required

  product_brief_ref: string_required_or_null_for_legacy_routes

  prompt: literal_block_required
  positive_prompt: literal_block_required
  negative_prompt: literal_block_required

  runner_prompt_mapping:
    runner_canonical_prompt_field: prompt
    positive_prompt_role: human_review_alias
    prompt_positive_prompt_sync_required: true

  visual_intent:
    image_goal: string_required
    target_aesthetic: string_required
    product_hierarchy: string_required

  material_constraints:
    primary_materials: list_required
    texture_requirements: list_required
    finish_requirements: list_required
    forbidden_material_drift: list_required

  structure_constraints:
    silhouette: string_required
    required_geometry: list_required
    forbidden_shape_drift: list_required

  scene_constraints:
    allowed_scene: string_required
    background_role: string_required
    clutter_policy: string_required
    people_allowed: false
    hands_allowed: false

  lighting_camera:
    lighting_style: string_required
    camera_angle: string_required
    lens_or_framing: string_required
    depth_of_field: string_required

  forbidden_elements:
    logo_text_person: list_required
    material_drift: list_required
    shape_drift: list_required
    scene_drift: list_required

  acceptance_criteria:
    product_identity_correct: boolean_required
    structure_readable: boolean_required
    material_constraints_met: boolean_required
    scene_constraints_met: boolean_required
    no_forbidden_text_or_logo: boolean_required

  human_review_checklist:
    - product identity
    - structure lock
    - material and texture
    - scene and background role
    - lighting and camera
    - forbidden elements
    - accepted candidate readiness
    - commercial delivery boundary

  execution_boundary:
    A5_authorization_required_later: true
    provider_contact_allowed: false
    image_generation_allowed: false
    memory_write_allowed: false
    production_candidate_002_allowed: false
    accepted_samples_write_allowed: false
    runs_output_commit_allowed: false
```

## Field Rules

### Prompt Field Shape

`prompt: |` must be an independent YAML literal block line.

`positive_prompt: |` must be an independent YAML literal block line.

`negative_prompt: |` must be an independent YAML literal block line.

The prompt package must not embed `positive_prompt` or `negative_prompt` inside another prompt string.

### Runner-Facing Canonical Field

`prompt` is the runner-facing canonical field. Any runner or adapter that consumes a prompt package should use `prompt` as the canonical generation text field.

`positive_prompt` is a human-review alias. It exists to keep reviewer-facing prompt text visible and comparable, not to replace the runner-facing `prompt`.

`prompt` and `positive_prompt` must be synchronized unless a later explicit review gate records a deliberate exception.

### Negative Prompt Coverage

`negative_prompt` must cover:

- logo drift
- readable text drift
- fake text or random letter drift
- person, hand, or model drift when not authorized
- material drift
- shape drift
- scene clutter or background dominance

### Authorization Boundary

A prompt package is not an A5 authorization package.

A prompt package does not authorize provider contact.

A prompt package does not authorize image generation.

A prompt package does not authorize `.env.local` secret value read.

A prompt package does not authorize memory write, accepted_samples write, runs output commit, production candidate promotion, or runtime execution.

Future A5 use requires a separate authorization gate naming the product, prompt package, output directory, provider call budget, generation attempt budget, output image budget, no-retry policy, and secret boundary.

## Future Validator Requirements

Future machine validation should check:

```yaml
prompt_package_schema_v1_static_checks:
  has_package_id: true
  has_product_identity: true
  has_selected_product: true
  has_locked_structure: true
  has_product_brief_ref: true
  prompt_literal_block_independent: true
  positive_prompt_literal_block_independent: true
  negative_prompt_literal_block_independent: true
  prompt_is_runner_canonical_field: true
  positive_prompt_is_human_review_alias: true
  prompt_positive_prompt_synchronized: true
  negative_prompt_covers_logo_text_person_material_shape_drift: true
  has_runner_prompt_mapping: true
  has_visual_intent: true
  has_material_constraints: true
  has_structure_constraints: true
  has_scene_constraints: true
  has_lighting_camera: true
  has_forbidden_elements: true
  has_acceptance_criteria: true
  has_human_review_checklist: true
  A5_authorization_required_later_true: true
  provider_contact_allowed_false: true
  image_generation_allowed_false: true
  memory_write_allowed_false: true
  production_candidate_002_allowed_false: true
```

Future validation should warn, not fail, for older historical prompt packages that predate this schema path but still preserve the core runner-facing `prompt` field.

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
machine_validator_implemented: false
existing_prompt_packages_migrated: false
```
