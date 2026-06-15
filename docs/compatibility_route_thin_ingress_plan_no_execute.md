# Compatibility Route Thin Ingress Plan

```yaml
phase: compatibility_route_thin_ingress_plan_no_execute_20260610
base_contract: AGENTS.md
parent_binding_template_ref: docs/image_run_capability_binding_preflight_template.md
parent_plan_ref: docs/vcptoolbox_image_execution_broker_followup_plan.md
mode: A4_8_green_lane_route_plan_and_validator
intent: local_implementation
risk_level: R2
status: local_thin_ingress_plan_no_execute
```

## Purpose

This plan constrains the existing Runtime-To-Review V2 task-specific Trial
routes into compatibility thin ingress.

The route is transport and identity admission only. It is not the authority for
provider, plugin, API, delegate, model, output directory, retry policy, artifact
receipt, review queue, archive, or memory decisions.

It does not implement a route, modify VCPToolBox, call a route HTTP endpoint,
call a provider, call a plugin, call an API, generate an image, write external
repository files, or write memory.

## Source Refs

```yaml
source_refs:
  broker_followup_plan_ref: docs/vcptoolbox_image_execution_broker_followup_plan.md
  generation_channel_contract_ref: docs/generation_channel_contract_preflight.md
  image_run_capability_binding_template_ref: docs/image_run_capability_binding_preflight_template.md
  image_run_capability_binding_template_example_ref: tests/schema_examples/image_run_capability_binding_preflight_template.example.json
```

The source binding template already freezes the allowed capability refs for
Trial 001 and Trial 002. This plan only defines how current route paths should
behave as compatibility ingress while the future VCPToolBox Image Execution
Broker remains unimplemented.

## Thin Ingress Contract

```yaml
CompatibilityRouteThinIngressPlan.v1:
  owned_by: VCPToolBox
  prepared_by: Agent_Image_Lab
  authority_status: compatibility_plan_only
  route_role: identity_and_transport_only
  current_endpoint_status: compatibility_shim_until_broker_ready
  generic_endpoint_candidate: /internal/agent-image-lab/executions/run
  generic_endpoint_enabled_now: false
  route_http_allowed_by_this_plan: false
  external_repo_write_allowed_by_this_plan: false
  provider_dispatch_allowed_by_route: false
  plugin_dispatch_allowed_by_route: false
  api_dispatch_allowed_by_route: false
  output_path_decision_allowed_by_route: false
  retry_decision_allowed_by_route: false
  required_fields:
    - route_id_or_endpoint_ref
    - route_identity
    - activation_id_ref
    - visual_job_contract_ref
    - canonical_contract_hash_ref
    - image_run_capability_binding_preflight_ref
    - binding_packet_ref
    - output_policy_ref
    - restricted_plugin_facade_boundary_ref
    - artifact_receipt_gate_ref
    - review_queue_gate_ref
    - memory_candidate_gate_ref
    - thin_ingress_constraints
    - migration_gate
    - stop_conditions
    - execution_boundary
```

Plain meaning: a route can identify which pre-bound job is being transported. It
cannot become the execution brain.

## Allowed Thin Ingress Behavior

```yaml
allowed_thin_ingress_behavior:
  - accept activation_id_ref as an identifier
  - accept visual_job_contract_ref as an identifier
  - accept canonical_contract_hash_ref as an identifier
  - accept image_run_capability_binding_preflight_ref as an identifier
  - map task-specific route identity to the already-bound capability template
  - pass refs forward to a future broker boundary only after a separate exact gate
  - reject payload-supplied provider/plugin/API/delegate/model/output/retry overrides
```

## Forbidden Route Authority

```yaml
forbidden_route_authority:
  - provider_id_selection
  - plugin_id_selection
  - api_id_selection
  - delegate_id_selection
  - model_selection
  - output_directory_selection
  - receipt_target_selection
  - review_queue_target_selection
  - retry_or_budget_selection
  - accepted_samples_or_production_candidate_write
  - DailyNote_or_VCP_memory_write
  - secret_or_auth_header_construction_by_AIL
  - full_pluginManager_access
```

The route may only refer to `ImageRunCapabilityBindingPreflight` and
`VisualJobContract` refs. It must not inspect payload fields to decide a runtime
dispatch path.

## Current Compatibility Routes

```yaml
compatibility_routes:
  - trial_id: r2r_v2_trial_001_serum_detail_control
    route_id_or_endpoint_ref: /internal/ai-image-agents/execute/r2r-v2-trial-001-serum-detail-control
    route_identity: task_specific_trial_001_compatibility_ingress
    current_status: compatibility_shim_until_broker_ready
    route_replacement_allowed_now: false
  - trial_id: r2r_v2_trial_002_lantern_ecommerce_hero
    route_id_or_endpoint_ref: /internal/ai-image-agents/execute/r2r-v2-trial-002-lantern-ecommerce-hero
    route_identity: task_specific_trial_002_compatibility_ingress
    current_status: compatibility_shim_until_broker_ready
    route_replacement_allowed_now: false
```

These routes remain as compatibility shims. Do not remove or replace them from
this plan.

## Generic Endpoint Migration Gate

```yaml
generic_endpoint_migration_gate:
  generic_endpoint_candidate: /internal/agent-image-lab/executions/run
  generic_endpoint_enabled_now: false
  migration_allowed_now: false
  required_before_enable:
    - compatibility_route_thin_ingress_plan_validated
    - VCPToolBox_broker_implementation_packet_exactly_authorized
    - VCPToolBox_broker_implementation_validated
    - generic_endpoint_gate_validated
    - comparable_trial_evidence_or_repeated_runtime_boundary_present
    - rollback_or_route_restore_plan_present
```

This gate keeps generic endpoint migration separate from compatibility cleanup.

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

Stop before implementation when any of these are true:

- The next change would modify VCPToolBox or another external repository.
- The next change would add or edit a real route, broker, IPC handler, preload bridge, or provider executor.
- The next action would call a route HTTP endpoint, provider, plugin, API, or image generator.
- The route would select arbitrary `provider`, `plugin`, `api`, `delegate`, model, output directory, budget, or retry policy.
- The next action would read `.env`, secrets, cookies, tokens, private configs, or raw private data.
- The next action would overwrite historical binding packets, receipts, artifact records, review bridges, or image files.
- The next action would enable the generic endpoint without a separate migration gate and rollback plan.
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
  The current Trial routes are constrained as compatibility thin ingress and
  the VCPToolBox broker implementation is packaged as a no-execute proposal.
  The next safe local step is to define the generic endpoint migration gate
  without enabling the endpoint or writing to VCPToolBox.
automatic_real_execution_allowed_by_this_plan: false
external_repo_write_allowed_by_this_plan: false
```
