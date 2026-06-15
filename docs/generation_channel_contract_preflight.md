# AIL Generation Channel Contract Preflight

```yaml
phase: ail_generation_channel_contract_preflight_20260609
base_contract: AGENTS.md
parent_plan_ref: docs/vcptoolbox_image_execution_broker_followup_plan.md
mode: A4_8_green_lane_contract_and_validator
intent: local_implementation
risk_level: R2
status: local_contract_preflight_no_execute
```

## Purpose

This preflight freezes the Agent Image Lab side of the generation channel before
any broader VCPToolBox Image Execution Broker implementation.

It turns the Trial 001 and Trial 002 runtime-to-review evidence into a local,
validated contract for `VisualJobContract`, `ImageRunCapabilityRef`,
`RestrictedPluginFacadeBoundary`, `ArtifactReceiptGate`, `ReviewQueueGate`, and
`MemoryCandidateGate`.

It does not implement the VCPToolBox broker, add a generic endpoint, call a
provider, call a plugin, call an API, or generate an image.

## Evidence Base

```yaml
evidence_base:
  trial_001:
    binding_packet_ref: reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_binding_ready_execution_packet_20260608.json
    artifact_record_ref: reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_artifact_record.json
    review_decision_ref: reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_review_decision_accepted_candidate_20260608.json
    runtime_task_fixture_ref: tests/fixtures/runtime_kernel_v2_trial_001_serum_detail_control_task.fixture.json
  trial_002:
    binding_packet_ref: reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_binding_ready_execution_packet_20260609.json
    artifact_record_ref: reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_artifact_record.json
    review_decision_ref: reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_review_decision_accepted_candidate_20260609.json
    memory_candidate_gate_ref: reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_memory_candidate_no_write_mapping_gate_20260609.json
    runtime_task_fixture_ref: tests/fixtures/runtime_kernel_v2_trial_002_lantern_ecommerce_hero_task.fixture.json
```

Stable observations across both trials:

```yaml
stable_observations:
  output_scope: run_directory_only
  max_images: 1
  retry_allowed: false
  secret_value_read_allowed: false
  provider_route: native_doubao_guarded
  provider_id_ref: doubao
  plugin_id_ref: DoubaoGen
  api_id_ref: generate_image
  model_allowlist:
    - doubao-seedream-5-0-260128
  initial_status_after_generation: generated_unreviewed
  required_success_evidence:
    - receipt_ref
    - artifact_record_ref
    - review_bridge_ref
  post_generation_default_writes:
    accepted_samples: false
    production_candidate: false
    DailyNote: false
    VCP_memory: false
  memory_candidate_default: delayed_reviewed_non_default
```

## Contract Objects

```yaml
VisualJobContract.v1:
  owned_by: Agent_Image_Lab
  role: visual_intent_and_constraints
  required_fields:
    - contract_id
    - trial_id
    - product_family
    - product_category
    - subject
    - shot_id
    - shot_role
    - visual_goal
    - prompt_package_ref
    - output_directory_ref
    - review_policy_ref
    - image_run_capability_ref
    - expected_receipt_ref
    - expected_artifact_record_ref
    - expected_review_bridge_ref
    - canonical_contract_hash
  stable_constraints:
    max_images: 1
    retry_allowed: false
    overwrite_existing_files_allowed: false
    secret_value_read_allowed: false
    review_required: true
    initial_status_after_generation: generated_unreviewed
  must_not_include_dispatch_authority:
    - arbitrary_provider
    - arbitrary_plugin
    - arbitrary_api
    - arbitrary_delegate
```

Plain meaning: AIL may name the intended image and reference an authorized
capability, but the payload must not become the authority that chooses arbitrary
provider/plugin/API dispatch.

```yaml
ShotPlan.v1:
  owned_by: Agent_Image_Lab
  role: visual_strategy_for_one_generation_attempt
  required_fields:
    - shot_id
    - shot_role
    - composition_intent
    - product_geometry_anchors
    - material_and_lighting_controls
    - background_or_context_policy
    - negative_controls
    - review_focus
  must_not_include:
    - provider_secret
    - plugin_secret
    - live_auth_header
    - arbitrary_runtime_route
```

```yaml
ReviewPolicy.v1:
  owned_by: Agent_Image_Lab
  role: post_generation_truth_gate
  stable_defaults:
    required_status_after_generation: generated_unreviewed
    human_review_required_before_archive: true
    accepted_candidate_allowed_after_review: true
    commercial_delivery_ready_default: false
    accepted_samples_write_default: false
    production_candidate_write_default: false
    DailyNote_write_default: false
    VCP_memory_write_default: false
    memory_candidate_allowed_after_human_review: true
```

```yaml
ImageRunCapabilityRef.v1:
  owned_by: VCPToolBox
  role: internal_dispatch_authority_reference
  carried_by_AIL_payload_as_ref_only: true
  required_fields:
    - capability_ref_id
    - activation_id_ref
    - route_id_or_endpoint_ref
    - binding_packet_ref
    - provider_id_ref
    - plugin_id_ref
    - api_id_ref
    - delegate_id_ref
    - model_allowlist
    - budget
    - output_policy_ref
  stable_budget:
    max_route_http_requests: 1
    max_provider_calls: 1
    max_plugin_calls: 1
    max_api_calls: 1
    max_images: 1
    retry_allowed: false
  dispatch_rule: VCPToolBox_internal_binding_is_authoritative
```

```yaml
RestrictedPluginFacadeBoundary.v1:
  owned_by: VCPToolBox
  role: plugin_safety_boundary
  required_controls:
    allowed_plugin_ref: DoubaoGen
    allowed_api_ref: generate_image
    allowed_delegate_ref: required
    max_calls: 1
    distributed_fallback: false
    manifest_scan_during_request: false
    arbitrary_plugin_name: false
    arbitrary_api_name: false
    full_pluginManager_exposed_to_route: false
```

```yaml
ArtifactReceiptGate.v1:
  owned_by: shared_boundary
  role: evidence_after_generation
  required_success_refs:
    - receipt_ref
    - artifact_record_ref
    - review_bridge_ref
  artifact_record_required_fields:
    - schema
    - artifact_record_id
    - trial_id
    - status
    - source_prompt_package_ref
    - provider_route
    - provider_id
    - plugin_id
    - api_id
    - model_required
    - model_sent
    - output_files
    - image_count
    - receipt_ref
    - review_bridge_ref
```

```yaml
ReviewQueueGate.v1:
  owned_by: Agent_Image_Lab
  role: human_review_before_archive_or_memory
  required_before_archive_or_memory:
    - artifact_record_ref
    - receipt_ref
    - review_bridge_ref
    - review_decision_ref
    - commercial_delivery_ready
  allowed_decisions:
    - accepted_candidate
    - needs_revision
    - rejected
  default_post_review_writes:
    accepted_samples_write_allowed: false
    production_candidate_write_allowed: false
    DailyNote_write_allowed: false
    VCP_memory_write_allowed: false
```

```yaml
MemoryCandidateGate.v1:
  owned_by: Agent_Image_Lab
  role: delayed_reviewed_non_default_memory_path
  can_exist_after_human_review: true
  mapping_only_allowed: true
  memory_write_default: false
  required_for_actual_write:
    - separate_memory_authorization_gate
    - exact_memory_target
    - sanitized_payload_or_delta
    - post_write_receipt
    - rollback_or_cleanup_plan
  forbidden_without_separate_gate:
    - call_record_memory
    - call_daily_note_writer
    - call_vcp_memory_writer
    - accepted_samples_write
    - production_candidate_write
```

## Execution Boundary

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
route_http_request_performed: false
real_manifest_read_performed: false
real_VCPChat_read_performed: false
real_VCPToolBox_read_performed: false
external_VCPToolBox_write_performed: false
secret_value_read_performed: false
accepted_samples_write_performed: false
production_candidate_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
push_tag_release_deploy_performed: false
```

## Stop Rules

Stop before turning this contract into implementation when any of these are true:

- The next change would modify VCPToolBox or another external repository.
- The next change would add a real runtime route, IPC handler, preload bridge, or provider executor.
- The payload would choose arbitrary provider/plugin/API dispatch instead of referencing `ImageRunCapabilityRef`.
- The next action would read `.env`, secrets, cookies, tokens, private configs, or raw private data.
- The next action would overwrite historical trial packets, receipts, artifact records, or image files.
- The next action would call a provider, plugin, API, route HTTP endpoint, or image generator.
- The next action would write accepted samples, production candidates, DailyNote, VCP memory, or Codex memory without a separate exact gate.
- The next action would require push, tag, release, deploy, force push, history rewrite, or destructive filesystem action.

## Recommended Next

```yaml
completed_previous: prepare_vcptoolbox_image_execution_broker_implementation_proposal_no_execute
completion_refs:
  - docs/vcptoolbox_image_execution_broker_implementation_proposal_no_execute.md
  - tests/schema_examples/vcptoolbox_image_execution_broker_implementation_proposal_no_execute.example.json
  - scripts/validate_vcptoolbox_image_execution_broker_implementation_proposal_no_execute.js
recommended_next: prepare_generic_image_execution_endpoint_gate_no_execute
why: >
  The AIL-side generation channel contract, ImageRunCapability binding template,
  compatibility route thin-ingress plan, and VCPToolBox broker implementation
  proposal are now explicit. The next safe local step is to define the generic
  endpoint migration gate before any external repository write or real image
  execution.
automatic_real_execution_allowed_by_this_contract: false
external_repo_write_allowed_by_this_contract: false
```
