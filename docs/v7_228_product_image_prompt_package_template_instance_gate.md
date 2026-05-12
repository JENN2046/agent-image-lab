# v7.228 Product Image Prompt Package Template Instance Gate

## Executive Verdict

```yaml
phase: v7.228_product_image_prompt_package_template_instance_gate
base_contract: AGENTS.md
mode: A4_docs_only_product_template_instance
source_commit: 5f31426cd3a33a29fbf802487a4bc1ed9eaf20a0
source_phase: v7.227_prompt_package_builder_taskbook_gate
overall_status: pass
product_artifact:
  prompt_package_instance_template_created: true
  executable_generation_request_created: false
  A5_generation_authorization_required_later: true
  human_review_handoff_created: true
  memory_suitability_handoff_created: true
safety:
  A5_execution: false
  provider_contact: false
  plugin_call: false
  image_generation: false
  memory_write: false
  runtime_execution: false
recommended_next: v7.229_prompt_package_human_review_checklist_gate
```

## Purpose

This gate turns the v7.227 Prompt Package Builder schema into the first reusable product image prompt package instance template.

The template is fillable and reviewable. It is not a real generation task, not a provider payload, not an A5 authorization package, and not a memory write request.

## Phase Difference Patch

```yaml
phase_delta:
  creates:
    - prompt_templates/product_image_prompt_package_instance_template.md
    - docs/v7_228_product_image_prompt_package_template_instance_gate.md
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
    - executable_generation_request
    - provider_payload
    - plugin_request
    - runtime_entrypoint
    - memory_write_request
    - image_asset
```

## Template Coverage

The instance template covers:

1. brief intake section
2. product identity section
3. shot intent section
4. visual direction section
5. positive prompt draft section
6. negative constraints section
7. acceptance criteria section
8. human review checklist section
9. A5 generation authorization handoff section
10. memory suitability decision section

## Instance Template Rules

```yaml
instance_template_rules:
  placeholder_only: true
  no_real_generation_task: true
  no_provider_binding: true
  no_plugin_binding: true
  no_output_directory_binding: true
  no_real_customer_private_data: true
  no_secret_or_env_value: true
  no_image_asset_reference_required: true
  future_generation_requires_A5: true
```

## Product Brief Intake

The template requires the brief to be captured as structured intent:

```yaml
brief_intake:
  brief_id: "<placeholder>"
  brief_source: "<human_brief | internal_request | product_sheet_summary>"
  product_goal: "<what the image should help decide or communicate>"
  intended_use: "<catalog | campaign | review | exploration | other>"
  target_audience: "<placeholder>"
  known_constraints:
    - "<placeholder constraint>"
  missing_information:
    - "<placeholder missing item>"
```

## Product Identity

```yaml
product_identity:
  product_name: "<placeholder>"
  product_category: "<placeholder>"
  product_variant: "<placeholder or none>"
  hero_features:
    - "<placeholder feature>"
  material_and_texture:
    material:
      - "<placeholder material>"
    texture:
      - "<placeholder texture>"
    finish:
      - "<placeholder finish>"
  color_palette:
    - "<placeholder color>"
```

## Shot Intent

```yaml
shot_intent:
  shot_type: "<hero | detail | lifestyle | packshot | texture_macro | comparison>"
  aspect_ratio: "<1:1 | 4:5 | 3:2 | 16:9 | review_only_custom>"
  framing: "<full_product | close_up | medium | flat_lay | three_quarter>"
  angle: "<front | side | three_quarter | top_down | low_angle>"
  crop_safety: "<placeholder>"
  output_count_request: "<planning_only_integer>"
```

`output_count_request` remains planning-only. Future allowed calls must be set in a separate A5 authorization package.

## Visual Direction

```yaml
visual_direction:
  style_lock:
    style_name: "<placeholder>"
    mood: "<placeholder>"
    realism_level: "<product_photo | editorial_photo | stylized_but_realistic>"
    color_temperature: "<warm | neutral | cool | mixed>"
    contrast_level: "<low | medium | high>"
  composition:
    product_anchor: "<placeholder>"
    supporting_scene: "<placeholder>"
    negative_space: "<placeholder>"
  lighting:
    light_quality: "<soft | crisp | diffused | directional>"
    shadow_behavior: "<placeholder>"
    highlight_control: "<placeholder>"
  camera_language:
    lens_feel: "<placeholder>"
    depth_of_field: "<deep | moderate | shallow | macro>"
    perspective: "<placeholder>"
```

## Positive Prompt Draft

```yaml
positive_prompt_draft:
  subject_anchor: "<placeholder sentence>"
  product_fidelity: "<placeholder sentence>"
  material_texture_language: "<placeholder sentence>"
  composition_language: "<placeholder sentence>"
  lighting_language: "<placeholder sentence>"
  camera_language: "<placeholder sentence>"
  environment_language: "<placeholder sentence>"
  quality_bar: "<placeholder sentence>"
```

This draft is review text. It is not a provider payload and must not be submitted to any model or plugin without a future A5 package.

## Negative Constraints

```yaml
negative_constraints:
  forbidden_subjects:
    - "<placeholder>"
  forbidden_text_or_logo:
    - "no readable accidental text"
    - "no watermark"
    - "no unapproved logo-like mark"
  forbidden_artifacts:
    - "no malformed product geometry"
    - "no duplicate product parts"
    - "no blur that hides material detail"
  forbidden_people_or_faces:
    - "no people, faces, hands, or body parts unless the brief explicitly allows them"
  forbidden_style_drift:
    - "<placeholder>"
  forbidden_background_elements:
    - "<placeholder>"
```

## Acceptance Criteria

```yaml
acceptance_criteria:
  must_have:
    - "product identity matches the brief"
    - "hero features remain visible"
    - "material and texture remain recognizable"
    - "shot intent is followed"
    - "style lock is respected"
  must_not_have:
    - "wrong product category"
    - "readable accidental text or logo-like marks"
    - "watermark"
    - "people/faces/hands unless explicitly allowed"
    - "broken geometry or duplicate product parts"
  reviewer_questions:
    - "Is the package narrow enough for one future generation authorization?"
    - "Are the known failure modes blocked clearly?"
    - "Would a human reviewer know what to accept or reject?"
```

## Human Review Checklist

```yaml
human_review_checklist:
  package_complete: false
  placeholders_resolved: false
  product_brief_preserved: false
  shot_intent_clear: false
  positive_prompt_reviewable: false
  negative_constraints_reviewable: false
  acceptance_criteria_reviewable: false
  A5_authorization_not_inferred: true
  reviewer_decision: draft | needs_revision | review_ready | approved_for_A5_authorization | rejected
  reviewer_notes: "<placeholder>"
```

## A5 Generation Authorization Handoff

```yaml
A5_generation_authorization_handoff:
  package_is_authorization: false
  future_A5_required: true
  future_A5_must_name:
    - prompt_package_instance_id
    - prompt_package_instance_version
    - selected_plugin_or_provider
    - selected_model
    - allowed_call_count
    - retry_limit
    - output_directory_ref
    - output_save_policy
    - human_approval_phrase
    - review_console_ref
  current_generation_allowed: false
```

## Memory Suitability Decision

```yaml
memory_suitability_decision:
  default_status: draft
  memory_write_allowed_now: false
  daily_note_write_allowed_now: false
  suitability_may_be_reviewed_after:
    - human_visual_review
    - asset_status_assignment
    - acceptance_or_rejection_reason
  possible_future_decisions:
    - do_not_write
    - draft_memory_delta_after_accepted_asset
    - needs_human_memory_review
```

## Explicit Non-Authorization

```yaml
not_authorized_by_v7_228:
  A5_execution: false
  provider_contact: false
  plugin_call: false
  image_generation: false
  runtime_execution: false
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
  phase: v7.229_prompt_package_human_review_checklist_gate
  type: A4_docs_only_product_review_gate
  purpose: >
    Define the human review checklist and status taxonomy for prompt package
    instances before any A5 generation authorization.
  auto_execution_allowed: false
```

## Closeout Template

```yaml
closeout:
  phase: v7.228_product_image_prompt_package_template_instance_gate
  source_commit: 5f31426cd3a33a29fbf802487a4bc1ed9eaf20a0
  commit_hash: null
  commit_message: "docs: add product image prompt package instance template"
  branch: master
  local_equals_origin: false
  ahead_behind: "0/1"
  changed_files: 0
  push: not_performed
  v7_227_remote_sync:
    performed: true
    local_equals_origin_after_push: true
  product_artifact:
    prompt_package_instance_template_created: true
    executable_generation_request_created: false
    A5_generation_authorization_required_later: true
    human_review_handoff_created: true
    memory_suitability_handoff_created: true
  validation:
    git_diff_check: pass
    exact_diff_reviewed: true
    agent_board_state_validator: pass
    redaction_validator: not_run
    full_repo_validator: not_run
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
