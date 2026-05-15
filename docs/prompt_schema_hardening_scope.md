# Prompt Schema Hardening Scope

```yaml
scope_id: prompt_schema_hardening_scope_v1
route: V11 Prompt Schema Hardening
source_phase: v11_002_prompt_schema_hardening_route_activation_gate
source_commit: baf109b7566515522020fbba5e3a7b9b2005c95b
mode: A4.8 docs-only
```

## Scope Summary

V11 Prompt Schema Hardening turns the three proven product lanes into a more
stable schema system:

```yaml
product_lanes:
  - matte_ceramic_mug
  - multi_color_mesh_sports_visor
  - premium_serum_bottle
```

The route hardens documentation and validation expectations. It does not execute
providers, generate images, write memory, write accepted samples, change
dependencies, or promote production candidates.

## Product Brief Target

```yaml
product_brief:
  must_define_product_identity: true
  must_define_product_structure: true
  must_define_material_texture: true
  must_define_color_or_finish_system: true
  must_define_scene_boundary: true
  must_define_initial_acceptance_criteria: true
  must_define_known_risks: true
```

## Prompt Package Target

```yaml
prompt_package:
  canonical_runner_field: prompt
  positive_prompt_allowed_as_review_alias: true
  positive_prompt_sync_required: true
  negative_prompt_literal_block_required: true
  yaml_literal_block_expected:
    - "prompt: |"
    - "positive_prompt: |"
    - "negative_prompt: |"
  execution_flags_required:
    A5_authorization_required_later: true
    plugin_call_allowed_by_this_file: false
    image_generation_allowed_by_this_file: false
    memory_write_allowed: false
```

## Static Review Target

```yaml
static_review:
  must_check_prompt_field_present: true
  must_check_positive_prompt_retained_or_synced: true
  must_check_product_identity_preserved: true
  must_check_structure_lock_present: true
  must_check_material_constraints_present: true
  must_check_label_fake_text_logo_boundary: true
  must_check_no_A5_execution_authorized: true
```

## A5 Authorization Draft Target

```yaml
A5_authorization_draft:
  separates_authorization_from_execution: true
  requires_provider_call_budget: true
  requires_generation_attempt_budget: true
  requires_output_image_budget: true
  requires_no_retry_policy: true
  requires_secret_read_boundary: true
  requires_output_directory: true
  requires_success_local_persistence_rule: true
```

## Human Review Target

```yaml
human_review:
  asset_status_required: true
  accepted_candidate_required: true
  commercial_delivery_ready_required: true
  memory_suitability_required: true
  no_auto_memory_inference: true
  accepted_candidate_does_not_imply_commercial_delivery_ready: true
```

## Evidence Package Target

```yaml
accepted_candidate_evidence_package:
  source_output_required: true
  prompt_package_required: true
  accepted_candidate_required: true
  commercial_delivery_ready_required: true
  memory_suitability_required: true
  output_image_added_to_git_required: true
  accepted_samples_written_required: true
  memory_write_performed_required: true
  production_candidate_002_started_required: true
```

## Risk Register

```yaml
risks:
  prompt_positive_prompt_sync_risk:
    mitigation: require canonical prompt and explicit positive_prompt sync rule
  yaml_literal_block_shape_risk:
    mitigation: require prompt / positive_prompt / negative_prompt literal block checks
  runner_facing_canonical_field_missing:
    mitigation: inventory and validate prompt field presence
  product_identity_drift:
    mitigation: require product_identity and structure_lock fields from brief through review
  material_constraints_missing:
    mitigation: require material_texture and material_constraints checks
  label_fake_text_logo_boundary_missing:
    mitigation: require label / fake text / logo boundary fields where relevant
  A5_authorization_execution_confusion:
    mitigation: require separate authorization and execution status fields
  accepted_candidate_commercial_delivery_ready_confusion:
    mitigation: require both fields and allow accepted true while commercial ready false
  memory_suitability_auto_inference:
    mitigation: require explicit deferred / yes / no value, no automatic write
  runs_output_accidental_commit:
    mitigation: exact staging and validation of runs output not committed
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
A5_generation_authorization_created: false
```
