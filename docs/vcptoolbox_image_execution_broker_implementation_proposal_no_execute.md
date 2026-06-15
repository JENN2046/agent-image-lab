# VCPToolBox Image Execution Broker Implementation Proposal

```yaml
phase: vcptoolbox_image_execution_broker_implementation_proposal_no_execute_20260610
base_contract: AGENTS.md
parent_thin_ingress_plan_ref: docs/compatibility_route_thin_ingress_plan_no_execute.md
parent_plan_ref: docs/vcptoolbox_image_execution_broker_followup_plan.md
mode: A4_8_green_lane_external_repo_proposal_and_validator
intent: local_implementation
risk_level: R3
status: local_external_repo_implementation_proposal_no_execute
```

## Purpose

This proposal turns the broker followup WP4 into a local, no-execute
implementation proposal packet for a future VCPToolBox-side Image Execution
Broker.

It defines the target external repository boundary, candidate owned surfaces,
allowed implementation intent, validation requirements, rollback expectations,
and hard stop conditions. It does not authorize the external repository write.

It does not read VCPToolBox, modify VCPToolBox, implement a broker, create a
route, call route HTTP, call a provider, call a plugin, call an API, generate an
image, read secrets, write memory, commit, push, tag, release, or deploy.

## Source Refs

```yaml
source_refs:
  broker_followup_plan_ref: docs/vcptoolbox_image_execution_broker_followup_plan.md
  generation_channel_contract_ref: docs/generation_channel_contract_preflight.md
  image_run_capability_binding_template_ref: docs/image_run_capability_binding_preflight_template.md
  compatibility_route_thin_ingress_plan_ref: docs/compatibility_route_thin_ingress_plan_no_execute.md
```

The source refs already define the AIL-side contract, capability refs, binding
preflight templates, and compatibility route thin-ingress constraints. This
proposal only packages what a future VCPToolBox-side implementation packet must
prove.

## Proposal Contract

```yaml
VCPToolBoxImageExecutionBrokerImplementationProposal.v1:
  prepared_by: Agent_Image_Lab
  target_system: VCPToolBox
  target_repo: JENN2046/VCPToolBox
  authority_status: proposal_only_no_external_write
  external_repo_write_allowed_now: false
  route_http_allowed_now: false
  provider_plugin_api_image_allowed_now: false
  secret_value_read_allowed: false
  target_branch_required_before_future_write: main
  required_fields:
    - proposal_id
    - target_system
    - target_repo
    - target_branch_required_before_future_write
    - external_repo_write_allowed_now
    - implementation_intent
    - candidate_external_files
    - forbidden_external_files_or_actions
    - required_broker_components
    - required_contract_inputs
    - required_runtime_guards
    - required_outputs
    - validation_plan
    - rollback_or_cleanup_plan
    - future_authorization_packet_requirements
    - stop_conditions
    - execution_boundary
```

Plain meaning: this is the shape of a future implementation request. It is not
the permission to touch VCPToolBox.

## Implementation Intent

```yaml
implementation_intent:
  broker_role: execution_coordinator
  route_role: thin_ingress_or_generic_transport_only
  activation_role: permission_only
  visual_job_contract_role: visual_intent_and_constraints
  image_run_capability_role: internal_dispatch_authority
  restricted_plugin_facade_role: narrow_plugin_invocation_boundary
  delegate_role: provider_boundary
  artifact_receipt_role: evidence
  review_queue_role: production_gate
  memory_candidate_role: delayed_reviewed_non_default
```

The broker may coordinate only from validated refs. It must not treat arbitrary
payload provider/plugin/API fields as dispatch authority.

## Candidate External Files

```yaml
candidate_external_files:
  - path: services/agentImageLab/ImageExecutionBroker.js
    action: add
    purpose: broker coordinator boundary
  - path: services/agentImageLab/ImageRunCapabilityRegistry.js
    action: add
    purpose: internal capability lookup and binding proof
  - path: services/agentImageLab/RestrictedPluginFacade.js
    action: add
    purpose: narrow plugin/API/delegate invocation facade
  - path: services/agentImageLab/ArtifactReceiptWriter.js
    action: add
    purpose: receipt and artifact evidence writer boundary
  - path: routes/agentImageLabImageExecution.js
    action: add_or_update
    purpose: thin ingress or future generic route binding
  - path: tests/agentImageLab/imageExecutionBroker.test.js
    action: add
    purpose: contract and dispatch-boundary tests
```

These are candidate paths only. A future exact external-repo authorization
packet must confirm the real VCPToolBox tree before any write.

## Forbidden External Files Or Actions

```yaml
forbidden_external_files_or_actions:
  - broad_repository_rewrite
  - package_manager_or_dependency_change
  - secret_or_env_file_read
  - credential_or_token_edit
  - unrelated_plugin_manager_refactor
  - full_pluginManager_exposure_to_route
  - arbitrary_provider_plugin_api_payload_dispatch
  - accepted_samples_or_production_candidate_write
  - DailyNote_or_VCP_memory_write
  - route_http_probe
  - provider_plugin_api_or_image_call
  - push_tag_release_deploy
  - force_push_history_rewrite_or_destructive_action
```

## Required Broker Components

```yaml
required_broker_components:
  internal_authorizer:
    activation_id_ref_required: true
    canonical_contract_hash_ref_required: true
    secret_value_read_allowed: false
  capability_registry:
    ImageRunCapabilityBindingPreflight_ref_required: true
    VCPToolBox_internal_binding_is_authoritative: true
    payload_dispatch_authority: false
  restricted_plugin_facade:
    allowed_plugin_ref: DoubaoGen
    allowed_api_ref: generate_image
    max_calls: 1
    full_pluginManager_exposed_to_route: false
  artifact_receipt_writer:
    receipt_ref_required: true
    artifact_record_ref_required: true
    review_bridge_ref_required: true
  review_queue_bridge:
    generated_unreviewed_default: true
    human_review_required_before_archive_or_memory: true
  memory_candidate_gate:
    mapping_only_allowed: true
    memory_write_default: false
```

## Required Contract Inputs

```yaml
required_contract_inputs:
  - VisualJobContract.v1
  - ImageRunCapabilityBindingPreflight.v1
  - CompatibilityRouteThinIngressPlan.v1
  - RestrictedPluginFacadeBoundary.v1
  - ArtifactReceiptGate.v1
  - ReviewQueueGate.v1
  - MemoryCandidateGate.v1
```

## Required Runtime Guards

```yaml
required_runtime_guards:
  max_route_http_requests: 1
  max_provider_calls: 1
  max_plugin_calls: 1
  max_api_calls: 1
  max_images: 1
  retry_allowed: false
  overwrite_existing_files_allowed: false
  secret_value_read_allowed: false
  output_directory_must_match_bound_contract_ref: true
  payload_provider_plugin_api_override_allowed: false
  authorization_header_constructed_by_AIL: false
```

## Required Outputs

```yaml
required_outputs:
  - receipt_ref
  - artifact_record_ref
  - review_bridge_ref
  - validation_receipt_for_external_repo_write
```

## Validation Plan

```yaml
validation_plan:
  local_AIL_pre_authorization_validation:
    - npm run validate:vcptoolbox-image-execution-broker-implementation-proposal-no-execute
    - npm run validate:compatibility-route-thin-ingress-plan-no-execute
    - npm run validate:image-run-capability-binding-preflight-template
    - npm run validate:generation-channel-contract-preflight
    - npm run validate:vcptoolbox-image-execution-broker-followup-plan
  future_external_repo_validation_required:
    - exact VCPToolBox package/test command list from the future authorization packet
    - route/broker unit tests proving payload cannot select provider/plugin/API
    - receipt/artifact/review bridge tests proving output refs agree
    - git diff --check inside VCPToolBox
```

## Rollback Or Cleanup Plan

```yaml
rollback_or_cleanup_plan:
  required_before_future_write: true
  minimum_required:
    - exact file list to revert
    - no generated artifacts to delete unless separately authorized
    - no dependency or lockfile rollback unless exact package action is authorized
    - no force push or history rewrite
    - restore task-specific compatibility routes if generic endpoint migration fails
```

## Future Authorization Packet Requirements

```yaml
future_authorization_packet_requirements:
  can_execute_now: false
  required_before_any_external_write:
    - exact local VCPToolBox workspace path verified without secret reads
    - current VCPToolBox branch and head verified
    - origin/main or target remote head verified
    - exact allowed external files
    - exact forbidden external files
    - exact validation commands
    - rollback_or_cleanup_plan
    - stop_conditions
    - no secret/env/config reads
    - no provider/plugin/API/image call
    - no push/tag/release/deploy
```

## Execution Boundary

```yaml
external_VCPToolBox_read_performed: false
external_VCPToolBox_write_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
route_http_request_performed: false
real_manifest_read_performed: false
real_VCPChat_read_performed: false
real_VCPToolBox_read_performed: false
secret_value_read_performed: false
dependency_change_performed: false
accepted_samples_write_performed: false
production_candidate_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
push_tag_release_deploy_performed: false
```

## Stop Rules

Stop before implementation when any of these are true:

- The next task would read or modify VCPToolBox without a separate exact external-repo authorization packet.
- The next task would read `.env`, secrets, cookies, tokens, private configs, or raw private data.
- The next task would change dependencies, package managers, lockfiles, or install commands without an exact package/action list.
- The next task would implement a broker, route, provider executor, IPC handler, preload bridge, or plugin facade directly.
- The next task would call a route HTTP endpoint, provider, plugin, API, or image generator.
- The next task would let payload fields choose arbitrary `provider`, `plugin`, `api`, `delegate`, model, output directory, budget, or retry policy.
- The next task would overwrite historical binding packets, receipts, artifact records, review bridges, or image files.
- The next task would write accepted samples, production candidates, DailyNote, VCP memory, or Codex memory without a separate exact gate.
- The next task would require commit, push, tag, release, deploy, force push, history rewrite, or destructive filesystem action.

## Recommended Next

```yaml
completed_previous: prepare_vcptoolbox_image_execution_broker_implementation_proposal_no_execute
recommended_next: prepare_generic_image_execution_endpoint_gate_no_execute
why: >
  The VCPToolBox broker implementation is now packaged as a no-execute
  proposal with exact external-repo boundaries. The next safe local step is to
  define the generic endpoint migration gate without enabling the endpoint or
  writing to VCPToolBox.
automatic_real_execution_allowed_by_this_proposal: false
external_repo_write_allowed_by_this_proposal: false
```
