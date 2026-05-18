# v11.002 Prompt Schema Hardening Route Activation Gate

```yaml
phase: v11_002_prompt_schema_hardening_route_activation_gate
base_contract: AGENTS.md
mode: A4.8
intent: route_activation
risk_level: R1
source_phase: v11_001_route_selection_gate
source_commit: baf109b7566515522020fbba5e3a7b9b2005c95b
selected_route: prompt_schema_hardening
```

## Purpose

This gate activates the V11 Prompt Schema Hardening route after human selection
of v11.001 Option A.

This is a docs-only route activation and schema planning gate. It defines the
schema hardening scope, file targets, validation target, and next phase plan. It
does not change runner behavior, create A5 authorization, contact a provider,
generate images, read `.env.local`, write memory, write `accepted_samples/`,
enter `production_candidate_002`, or enter runtime.

## Route Basis

```yaml
completed_product_lanes:
  - matte_ceramic_mug
  - multi_color_mesh_sports_visor
  - premium_serum_bottle
selected_route: prompt_schema_hardening
route_goal: stabilize reusable schemas for product brief, prompt package, static review, A5 authorization draft, human review, and accepted candidate evidence package
```

## Schema Hardening Scope

```yaml
schema_hardening_scope_created: true
scope_ref: docs/prompt_schema_hardening_scope.md
in_scope:
  - product_brief_schema_target
  - prompt_package_schema_target
  - static_review_schema_target
  - A5_authorization_draft_schema_target
  - human_review_schema_target
  - accepted_candidate_evidence_package_schema_target
  - validation_matrix
out_of_scope:
  - runner_behavior_change
  - provider_contact
  - image_generation
  - env_local_secret_value_read
  - memory_write
  - accepted_samples_write
  - production_candidate_002
  - runtime_implementation
  - dependency_change
```

## Schema Targets

### Product Brief Schema Target

```yaml
product_brief_schema_target_defined: true
required_sections:
  - product_identity
  - product_structure
  - material_texture
  - color_or_finish_system
  - target_scene_direction
  - commercial_main_image_boundary
  - lifestyle_image_boundary
  - acceptance_criteria_seed
  - known_risks
```

The product brief schema should prevent product identity drift before a prompt
package is drafted.

### Prompt Package Schema Target

```yaml
prompt_package_schema_target_defined: true
required_runner_fields:
  - prompt
  - positive_prompt
  - negative_prompt
required_control_fields:
  - product_identity
  - product_structure
  - material_texture
  - composition
  - lighting
  - camera_language
  - acceptance_criteria
  - human_review_checklist
  - A5_authorization_required_later
  - plugin_call_allowed_by_this_file
  - image_generation_allowed_by_this_file
  - memory_write_allowed
```

The canonical runner-facing field is `prompt`. `positive_prompt` may remain as a
review-facing alias, but the schema must make sync expectations explicit.

### Static Review Schema Target

```yaml
static_review_schema_target_defined: true
required_checks:
  - product_identity_preserved
  - structure_lock_present
  - material_constraints_present
  - prompt_field_present
  - positive_prompt_retained_or_synced
  - negative_prompt_present
  - label_fake_text_logo_boundary_present
  - A5_authorization_required_later
  - provider_contact_false
  - image_generation_false
  - memory_write_false
```

### A5 Authorization Draft Schema Target

```yaml
A5_authorization_schema_target_defined: true
required_boundaries:
  - approved_product
  - approved_prompt_package
  - provider_calls_max
  - generation_attempts_max
  - output_images_max
  - auto_retry
  - stop_after_generation
  - success_requires_verified_local_file
  - secret_read_boundary
  - output_directory
  - forbidden_actions
```

The A5 schema must keep authorization separate from execution. An authorization
draft must not itself imply provider contact, image generation, `.env.local`
read, or output directory creation.

### Human Review Schema Target

```yaml
human_review_schema_target_defined: true
required_decision_fields:
  - asset_status
  - accepted_candidate
  - commercial_delivery_ready
  - memory_suitability
  - reviewable_sample
  - local_persistence_verified
  - key_findings
  - watch_items
```

The schema must prevent conflating `accepted_candidate` with
`commercial_delivery_ready`.

### Accepted Candidate Evidence Package Schema Target

```yaml
evidence_package_schema_target_defined: true
required_fields:
  - product
  - source_output
  - prompt_package
  - asset_status
  - accepted_candidate
  - commercial_delivery_ready
  - memory_suitability
  - output_image_added_to_git
  - accepted_samples_written
  - memory_write_performed
  - production_candidate_002_started
```

The evidence package schema records proof and boundaries. It does not promote an
asset into memory, accepted samples, production, or commercial delivery.

## Schema Risks Covered

```yaml
schema_risks:
  prompt_positive_prompt_sync_risk: covered
  yaml_literal_block_shape_risk: covered
  runner_facing_canonical_field_missing: covered
  product_identity_drift: covered
  structure_lock_missing: covered
  material_constraints_missing: covered
  label_fake_text_logo_boundary_missing: covered
  A5_authorization_execution_confusion: covered
  accepted_candidate_commercial_delivery_ready_confusion: covered
  memory_suitability_auto_inference: covered
  runs_output_accidental_commit: covered
```

## Validation Matrix

```yaml
validation_matrix:
  docs_state_sync:
    - README.md
    - docs/00_project_roadmap.md
    - PROJECT_MASTER_PLAN.md
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
    - .agent_board/CHECKPOINT.md
    - .agent_board/VALIDATION_LOG.md
  required_commands:
    - git status -sb
    - git diff --check
    - node scripts/validate_native_doubao_sandbox.js
    - node scripts/validate_agent_board_state.js
    - node scripts/validate_current_state_alignment.js
    - powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1
    - powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
  exact_staging_required: true
  git_add_dot_allowed: false
```

## Next Phase Plan

```yaml
recommended_next:
  phase: v11_003_existing_prompt_artifact_schema_inventory_gate
  auto_execution_allowed: true
  purpose: 盘点现有 brief / prompt package / review / evidence / authorization 文档，形成 schema inventory；仍不接 provider、不生成图。
```

## Boundary Confirmation

```yaml
safety:
  provider_contact: false
  image_generation: false
  retry: false
  env_local_secret_value_read: false
  secret_value_printed: false
  DailyNote_write: false
  VCP_memory_write: false
  memory_write_path: false
  production_candidate_002: false
  Batch_005: false
  dependency_change: false
  package_json_modified: false
  runs_output_committed: false
  accepted_samples_written: false
  runtime_execution: false
  A5_generation_authorization_created: false
```
