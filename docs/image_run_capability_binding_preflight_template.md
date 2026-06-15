# ImageRunCapability Binding Preflight Template

```yaml
phase: image_run_capability_binding_preflight_template_20260610
base_contract: AGENTS.md
parent_contract_ref: docs/generation_channel_contract_preflight.md
parent_plan_ref: docs/vcptoolbox_image_execution_broker_followup_plan.md
mode: A4_8_green_lane_binding_template_and_validator
intent: local_implementation
risk_level: R2
status: local_binding_template_no_execute
```

## Purpose

This preflight turns the AIL-side `ImageRunCapabilityRef` contract into the next
local binding template layer.

The template is deliberately not executable. It defines the exact fields and
guardrails that a future VCPToolBox-owned Image Execution Broker binding must
prove before any route HTTP request, provider call, plugin call, API call, or
image generation can happen.

It does not implement a broker, create a route, call VCPToolBox, call a provider,
call a plugin, call an API, generate an image, write external repository files,
or write memory.

## Source Contract

```yaml
source_contract:
  parent_contract_ref: docs/generation_channel_contract_preflight.md
  source_object: ImageRunCapabilityRef.v1
  source_dispatch_rule: VCPToolBox_internal_binding_is_authoritative
  source_required_gates:
    - VisualJobContract.v1
    - RestrictedPluginFacadeBoundary.v1
    - ArtifactReceiptGate.v1
    - ReviewQueueGate.v1
    - MemoryCandidateGate.v1
```

The AIL payload may carry `ImageRunCapabilityRef` as a reference. It must not
select arbitrary provider, plugin, API, delegate, model, output directory, retry
policy, receipt target, review queue target, or memory path.

## Binding Template Contract

```yaml
ImageRunCapabilityBindingPreflight.v1:
  owned_by: VCPToolBox
  prepared_by: Agent_Image_Lab
  authority_status: proposed_binding_template_only
  carried_by_AIL_as_no_execute_preflight: true
  can_execute_now: false
  route_http_allowed_by_template: false
  external_repo_write_allowed_by_template: false
  dispatch_authority: VCPToolBox_internal_binding
  ail_payload_dispatch_authority: false
  required_fields:
    - binding_preflight_id
    - capability_ref_id
    - activation_id_ref
    - visual_job_contract_ref
    - canonical_contract_hash_ref
    - route_id_or_endpoint_ref
    - binding_packet_ref
    - provider_id_ref
    - plugin_id_ref
    - api_id_ref
    - delegate_id_ref
    - model_allowlist
    - budget
    - output_policy_ref
    - restricted_plugin_facade_boundary_ref
    - artifact_receipt_gate_ref
    - review_queue_gate_ref
    - memory_candidate_gate_ref
    - stop_conditions
    - execution_boundary
```

Plain meaning: this object is the shape of a future binding proof, not the
permission to execute it.

## Required Stable Binding Values

```yaml
stable_binding_values:
  provider_id_ref: doubao
  plugin_id_ref: DoubaoGen
  api_id_ref: generate_image
  delegate_id_ref: native_doubao_runtime_v1_provider_delegate
  model_allowlist:
    - doubao-seedream-5-0-260128
  budget:
    max_route_http_requests: 1
    max_provider_calls: 1
    max_plugin_calls: 1
    max_api_calls: 1
    max_images: 1
    retry_allowed: false
  output_policy:
    output_scope: run_directory_only
    overwrite_existing_files_allowed: false
    expected_success_evidence:
      - receipt_ref
      - artifact_record_ref
      - review_bridge_ref
    initial_status_after_generation: generated_unreviewed
    review_queue_required_before_archive: true
```

These values are copied as references from Trial 001 and Trial 002 evidence. The
template does not make those historical binding packets executable.

## Required Boundary Refs

```yaml
required_boundary_refs:
  visual_job_contract_ref:
    owner: Agent_Image_Lab
    required_fields:
      - contract_id
      - canonical_contract_hash
      - prompt_package_ref
      - output_directory_ref
      - image_run_capability_ref
      - expected_receipt_ref
      - expected_artifact_record_ref
      - expected_review_bridge_ref
  restricted_plugin_facade_boundary_ref:
    owner: VCPToolBox
    required_controls:
      allowed_plugin_ref: DoubaoGen
      allowed_api_ref: generate_image
      allowed_delegate_ref: native_doubao_runtime_v1_provider_delegate
      max_calls: 1
      distributed_fallback: false
      manifest_scan_during_request: false
      arbitrary_plugin_name: false
      arbitrary_api_name: false
      full_pluginManager_exposed_to_route: false
  artifact_receipt_gate_ref:
    owner: shared_boundary
    required_success_refs:
      - receipt_ref
      - artifact_record_ref
      - review_bridge_ref
  review_queue_gate_ref:
    owner: Agent_Image_Lab
    human_review_required_before_archive_or_memory: true
    default_post_review_writes:
      accepted_samples_write_allowed: false
      production_candidate_write_allowed: false
      DailyNote_write_allowed: false
      VCP_memory_write_allowed: false
  memory_candidate_gate_ref:
    owner: Agent_Image_Lab
    mapping_only_allowed: true
    memory_write_default: false
    required_for_actual_write:
      - separate_memory_authorization_gate
      - exact_memory_target
      - sanitized_payload_or_delta
      - post_write_receipt
      - rollback_or_cleanup_plan
```

## Trial Binding Templates

The JSON example carries the full no-execute binding templates for the current
two evidence-backed trials:

```yaml
trial_templates:
  - r2r_v2_trial_001_serum_detail_control
  - r2r_v2_trial_002_lantern_ecommerce_hero
```

Each template must match the parent generation channel contract and the
historical binding-ready packet for:

- `capability_ref_id`
- `activation_id_ref`
- `route_id_or_endpoint_ref`
- `provider_id_ref`
- `plugin_id_ref`
- `api_id_ref`
- `delegate_id_ref`
- `model_allowlist`
- one-route / one-provider / one-plugin / one-API / one-image budget
- output policy references
- restricted plugin facade controls

The binding-ready packets may say `can_execute_now: true` because they describe
their own historical time slice. This template must still say
`can_execute_now: false`.

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

Stop before turning this template into execution when any of these are true:

- The next change would modify VCPToolBox or another external repository.
- The next change would add a real route, IPC handler, preload bridge, broker, or provider executor.
- The next action would call a route HTTP endpoint, provider, plugin, API, or image generator.
- The AIL payload would select arbitrary `provider`, `plugin`, `api`, `delegate`, model, or output path.
- The next action would read `.env`, secrets, cookies, tokens, private configs, or raw private data.
- The next action would overwrite historical binding packets, receipts, artifact records, review bridges, or image files.
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
  The ImageRunCapability reference, compatibility route thin-ingress plan, and
  VCPToolBox broker implementation proposal are now local no-execute surfaces.
  The next safe local step is to define the generic endpoint migration gate
  without enabling the endpoint or writing to VCPToolBox.
automatic_real_execution_allowed_by_this_template: false
external_repo_write_allowed_by_this_template: false
```
