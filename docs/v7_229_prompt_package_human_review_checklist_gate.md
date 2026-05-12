# v7.229 Prompt Package Human Review Checklist Gate

## Executive Verdict

```yaml
phase: v7.229_prompt_package_human_review_checklist_gate
base_contract: AGENTS.md
mode: A4_docs_only_product_review_gate
source_commit: cd3414b6ae8c42118894068f3ad73d765427b8c0
source_phase: v7.228_product_image_prompt_package_template_instance_gate
overall_status: pass
product_artifact:
  human_review_checklist_created: true
  status_taxonomy_created: true
  rejection_reason_taxonomy_created: true
  A5_generation_authorization_required_later: true
safety:
  A5_execution: false
  provider_contact: false
  plugin_call: false
  image_generation: false
  memory_write: false
  runtime_execution: false
recommended_next: v7.230_prompt_package_a5_authorization_handoff_gate
```

## Purpose

This gate defines how a human reviewer decides whether a product image prompt package instance is complete enough to become a candidate for a future A5 generation authorization request.

It reviews the package, not a generated image.

It does not authorize generation, provider contact, plugin calls, runtime execution, output saving, DailyNote write, or VCP memory write.

## Phase Difference Patch

```yaml
phase_delta:
  creates:
    - prompt_templates/product_image_prompt_package_human_review_checklist.md
    - docs/v7_229_prompt_package_human_review_checklist_gate.md
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
    - A5_authorization_package
    - executable_generation_request
    - provider_payload
    - plugin_request
    - runtime_entrypoint
    - memory_write_request
    - image_asset
```

## Review Object

```yaml
review_object:
  object_type: product_image_prompt_package_instance
  expected_source_template: prompt_templates/product_image_prompt_package_instance_template.md
  review_stage: pre_A5
  image_asset_present: false
  generated_output_present: false
```

The reviewer evaluates whether the package is structured, specific, safe, and narrow enough for a future A5 authorization request.

## Status Taxonomy

```yaml
prompt_package_review_status:
  draft:
    meaning: "Package is incomplete or still being assembled"
    allows_A5_request: false
  needs_revision:
    meaning: "Package has reviewable structure but must be revised before authorization"
    allows_A5_request: false
  review_ready:
    meaning: "Package is complete enough for final human approval review"
    allows_A5_request: false
  approved_for_A5_authorization:
    meaning: "Human reviewer approves creating a separate A5 authorization package"
    allows_A5_request: true
    note: "This still does not authorize generation"
  rejected:
    meaning: "Package should not proceed"
    allows_A5_request: false
  superseded:
    meaning: "Package was replaced by a newer package instance"
    allows_A5_request: false
```

## Required Review Sections

```yaml
required_review_sections:
  - package_metadata
  - brief_intake
  - product_identity
  - shot_intent
  - visual_direction
  - positive_prompt_draft
  - negative_constraints
  - acceptance_criteria
  - A5_generation_authorization_handoff
  - memory_suitability_decision
```

Each section must be either complete or explicitly marked as blocked with a revision note.

## Human Review Checklist

```yaml
human_review_checklist:
  package_metadata:
    instance_id_present: false
    instance_version_present: false
    instance_status_valid: false
    source_template_present: false
  brief_intake:
    product_goal_clear: false
    intended_use_clear: false
    target_audience_clear: false
    constraints_captured: false
    missing_information_empty_or_explained: false
  product_identity:
    product_name_clear: false
    product_category_clear: false
    hero_features_clear: false
    material_texture_finish_clear: false
    color_palette_clear: false
  shot_intent:
    shot_type_selected: false
    aspect_ratio_selected: false
    framing_selected: false
    angle_selected: false
    crop_safety_clear: false
    output_count_planning_only: true
  visual_direction:
    style_lock_clear: false
    composition_clear: false
    lighting_clear: false
    camera_language_clear: false
    reference_policy_safe: false
  positive_prompt_draft:
    subject_anchor_reviewable: false
    product_fidelity_reviewable: false
    material_texture_reviewable: false
    composition_reviewable: false
    lighting_reviewable: false
    camera_reviewable: false
    environment_reviewable: false
    quality_bar_reviewable: false
    provider_payload_not_created: true
  negative_constraints:
    text_logo_watermark_blockers_present: false
    malformed_geometry_blockers_present: false
    people_faces_policy_present: false
    style_drift_blockers_present: false
    background_blockers_present: false
  acceptance_criteria:
    must_have_reviewable: false
    must_not_have_reviewable: false
    reviewer_questions_reviewable: false
  authorization_boundary:
    A5_not_inferred: true
    provider_not_selected: true
    plugin_not_selected: true
    generation_not_allowed_now: true
    output_directory_not_bound: true
  memory_boundary:
    memory_write_not_allowed_now: true
    DailyNote_write_not_allowed_now: true
    memory_decision_is_draft: true
```

## Rejection Reason Taxonomy

```yaml
rejection_reasons:
  incomplete_brief:
    description: "Brief does not explain product goal, use, or constraints"
    revision_allowed: true
  ambiguous_product_identity:
    description: "Product category, hero features, or material details are unclear"
    revision_allowed: true
  unsafe_or_unreviewable_prompt:
    description: "Prompt draft contains private path, secret, raw payload, endpoint, or unreviewable instruction"
    revision_allowed: false
  weak_negative_constraints:
    description: "Known failure modes are not blocked clearly"
    revision_allowed: true
  overbroad_generation_scope:
    description: "Package tries to cover too many shots, variants, or output intents"
    revision_allowed: true
  unauthorized_execution_language:
    description: "Package implies generation, provider call, plugin call, runtime execution, or memory write"
    revision_allowed: false
  memory_boundary_violation:
    description: "Package implies DailyNote or VCP memory write before visual review and separate authorization"
    revision_allowed: false
```

## Approval Requirements

```yaml
approval_requirements:
  approved_for_A5_authorization_requires:
    - package_metadata_complete
    - brief_intake_complete
    - product_identity_complete
    - shot_intent_complete
    - visual_direction_complete
    - positive_prompt_draft_reviewable
    - negative_constraints_reviewable
    - acceptance_criteria_reviewable
    - no_secret_or_private_path
    - no_provider_payload
    - no_generation_request
    - no_memory_write_request
  approval_result:
    creates_A5_authorization: false
    permits_generation: false
    permits_provider_contact: false
    permits_plugin_call: false
```

Approval means the package may be referenced by a future A5 authorization package. It never means generation may begin.

## Reviewer Closeout

```yaml
prompt_package_review_closeout:
  prompt_package_instance_id: "<placeholder>"
  prompt_package_instance_version: "<placeholder>"
  reviewer: "<human reviewer placeholder>"
  review_status: draft | needs_revision | review_ready | approved_for_A5_authorization | rejected | superseded
  blocking_reasons: []
  required_revisions: []
  A5_authorization_allowed_to_be_drafted: false
  generation_allowed_now: false
  provider_contact_allowed_now: false
  plugin_call_allowed_now: false
  image_generation_allowed_now: false
  memory_write_allowed_now: false
```

## Explicit Non-Authorization

```yaml
not_authorized_by_v7_229:
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
  phase: v7.230_prompt_package_a5_authorization_handoff_gate
  type: A4_docs_only_authorization_handoff_planning
  purpose: >
    Define the handoff from approved prompt package instance to a separate A5
    generation authorization package, without activating A5 or selecting a provider.
  auto_execution_allowed: true
```

## Closeout Template

```yaml
closeout:
  phase: v7.229_prompt_package_human_review_checklist_gate
  source_commit: cd3414b6ae8c42118894068f3ad73d765427b8c0
  commit_hash: null
  commit_message: "docs: add prompt package human review checklist"
  branch: master
  changed_files: 0
  push: not_performed
  product_artifact:
    human_review_checklist_created: true
    status_taxonomy_created: true
    rejection_reason_taxonomy_created: true
    A5_generation_authorization_required_later: true
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
