# AIL Core / VCP Adapter Split Plan

```yaml
phase: ail_core_vcp_adapter_split_plan_no_execute_20260610
base_contract: AGENTS.md
parent_endpoint_gate_ref: docs/generic_image_execution_endpoint_gate_no_execute.md
parent_plan_ref: docs/vcptoolbox_image_execution_broker_followup_plan.md
mode: A4_8_green_lane_split_plan_and_validator
intent: local_implementation
risk_level: R2
status: local_split_plan_no_execute
```

## Purpose

This plan separates Agent Image Lab visual-domain ownership from VCP execution
adapter ownership before any future VCPToolBox Image Execution Broker
implementation.

It keeps visual intent, review truth, archive policy, and memory suitability in
AIL Core. It keeps activation refs, ImageRunCapability refs, broker request
mapping, route/generic endpoint transport refs, and receipt evidence mapping in
the VCP Adapter layer.

This plan does not implement adapter code, implement a broker, enable a generic
endpoint, modify VCPToolBox, call route HTTP, call a provider, call a plugin,
call an API, generate an image, read secrets, change dependencies, write memory,
commit, push, tag, release, or deploy.

## Source Refs

```yaml
source_refs:
  broker_followup_plan_ref: docs/vcptoolbox_image_execution_broker_followup_plan.md
  generation_channel_contract_ref: docs/generation_channel_contract_preflight.md
  image_run_capability_binding_template_ref: docs/image_run_capability_binding_preflight_template.md
  compatibility_route_thin_ingress_plan_ref: docs/compatibility_route_thin_ingress_plan_no_execute.md
  generic_endpoint_gate_ref: docs/generic_image_execution_endpoint_gate_no_execute.md
  vcptoolbox_broker_implementation_proposal_ref: docs/vcptoolbox_image_execution_broker_implementation_proposal_no_execute.md
  external_repo_authorization_packet_ref: docs/vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute.md
  external_repo_readiness_review_ref: docs/vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute.md
  external_repo_read_preflight_ref: docs/vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.md
  external_repo_read_authorization_packet_ref: docs/vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute.md
  external_repo_exact_read_receipt_template_ref: docs/vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.md
```

The source refs already define the generation contract, ImageRunCapability
binding refs, route thin-ingress constraints, generic endpoint migration gate,
future VCPToolBox broker proposal, and no-execute external-repo authorization
packet plus readiness review, read preflight, read authorization packet, and
exact read receipt template. This split plan defines
ownership boundaries so later packets do not mix visual intent with runtime
transport.

## Split Contract

```yaml
AILCoreVCPAdapterSplitPlan.v1:
  prepared_by: Agent_Image_Lab
  authority_status: split_plan_only_no_runtime_implementation
  adapter_code_write_allowed_now: false
  broker_implementation_allowed_now: false
  generic_endpoint_enablement_allowed_now: false
  external_repo_write_allowed_now: false
  route_http_allowed_now: false
  provider_plugin_api_image_allowed_now: false
  secret_value_read_allowed: false
  required_fields:
    - split_plan_id
    - ail_core_owns
    - vcp_adapter_owns
    - shared_refs
    - forbidden_cross_boundary_moves
    - object_boundary_matrix
    - data_flow
    - pre_implementation_requirements
    - validation_plan
    - future_authorization_packet_requirements
    - stop_conditions
    - execution_boundary
```

Plain meaning: this is the boundary map for future implementation. It is not
the implementation.

## Ownership Rule

```yaml
ownership_rule:
  ail_core_plain_meaning: visual truth and production judgment
  vcp_adapter_plain_meaning: execution transport and evidence refs
  route_plain_meaning: transport only
  broker_plain_meaning: VCPToolBox-side execution coordinator
  payload_plain_meaning: refs only, not dispatch authority
```

The split is intentionally asymmetrical: AIL Core may describe what image work
means; VCP Adapter may describe how a pre-authorized execution boundary is
addressed.

## AIL Core Owns

```yaml
ail_core_owns:
  - ProductBrief
  - ShotPlan
  - PromptLineage
  - VisualJobContract
  - ReviewPolicy
  - ImageCandidate
  - ReviewReport
  - AcceptedCandidate
  - ArchivePolicy
  - MemorySuitabilityDecision
```

AIL Core fields must stay visual, review, archive, or memory-suitability
oriented. They must not choose runtime provider/plugin/API/delegate/model,
credentials, auth headers, retry policy, route implementation, or VCPToolBox
file paths.

## VCP Adapter Owns

```yaml
vcp_adapter_owns:
  - activation_binding_refs
  - ImageRunCapability refs
  - route_id_or_generic_endpoint_ref
  - broker_request_mapping
  - restricted_plugin_facade_boundary_ref
  - output_policy_ref_mapping
  - receipt evidence mapping
  - artifact_record_ref_mapping
  - review_bridge_ref_mapping
  - external_authorization_packet_refs
```

VCP Adapter fields must stay refs and mapping only until a separate exact
external-repo authorization packet exists. They must not contain raw prompts,
secrets, raw endpoint configs, provider credentials, raw plugin output, or
private paths.

## Shared Refs

```yaml
shared_refs:
  - visual_job_contract_ref
  - canonical_contract_hash_ref
  - image_run_capability_binding_preflight_ref
  - artifact_receipt_gate_ref
  - review_queue_gate_ref
  - memory_candidate_gate_ref
```

Shared refs are identity and evidence handles. They are not a backdoor for
payload dispatch authority.

## Forbidden Cross-Boundary Moves

```yaml
forbidden_cross_boundary_moves:
  - moving_provider_plugin_api_selection_into_AIL_Core
  - moving_secret_or_auth_header_construction_into_AIL_Core
  - moving_raw_prompt_or_raw_request_storage_into_VCP_Adapter
  - moving_review_decision_authority_into_VCP_Adapter
  - moving_memory_write_decision_into_VCP_Adapter
  - moving_archive_admission_decision_into_VCP_Adapter
  - moving_output_directory_decision_into_payload
  - moving_retry_budget_decision_into_payload
  - exposing_full_pluginManager_to_route_or_AIL_Core
  - allowing_generic_endpoint_payload_to_override_bound_refs
```

## Object Boundary Matrix

```yaml
object_boundary_matrix:
  ProductBrief:
    owner: AIL_Core
    may_reference_vcp_adapter: false
    dispatch_authority: false
  ShotPlan:
    owner: AIL_Core
    may_reference_vcp_adapter: false
    dispatch_authority: false
  PromptLineage:
    owner: AIL_Core
    may_reference_vcp_adapter: false
    raw_prompt_storage_allowed: false
  VisualJobContract:
    owner: AIL_Core
    may_reference_vcp_adapter: true
    allowed_adapter_refs:
      - image_run_capability_ref
      - expected_receipt_ref
      - expected_artifact_record_ref
      - expected_review_bridge_ref
    dispatch_authority: false
  ImageRunCapabilityRef:
    owner: VCP_Adapter
    source_of_truth: VCPToolBox_binding_preflight
    payload_override_allowed: false
  BrokerRequestMapping:
    owner: VCP_Adapter
    allowed_input: refs_from_VisualJobContract_and_binding_preflight
    payload_provider_plugin_api_override_allowed: false
  ArtifactReceiptMapping:
    owner: VCP_Adapter
    allowed_output:
      - receipt_ref
      - artifact_record_ref
      - review_bridge_ref
    raw_plugin_output_storage_allowed: false
  ReviewReport:
    owner: AIL_Core
    may_reference_receipt_artifact_review_bridge: true
    production_admission_authority: true
  MemorySuitabilityDecision:
    owner: AIL_Core
    default_memory_write_allowed: false
```

## Data Flow

```text
AIL Core ProductBrief / ShotPlan / ReviewPolicy
  -> VisualJobContract refs
  -> VCP Adapter binding refs and broker request mapping
  -> future VCPToolBox Image Execution Broker
  -> receipt_ref / artifact_record_ref / review_bridge_ref
  -> AIL Core ReviewReport
  -> AcceptedCandidate / ArchivePolicy / MemorySuitabilityDecision gates
```

The future adapter may translate refs. It must not reinterpret visual intent or
make review/archive/memory decisions.

## Pre-Implementation Requirements

```yaml
pre_implementation_requirements:
  - ail_core_vcp_adapter_split_plan_validated
  - generic_image_execution_endpoint_gate_validated
  - vcptoolbox_image_execution_broker_implementation_proposal_validated
  - vcptoolbox_image_execution_broker_external_repo_authorization_packet_validated
  - vcptoolbox_image_execution_broker_external_repo_readiness_review_validated
  - vcptoolbox_image_execution_broker_external_repo_read_preflight_validated
  - vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_validated
  - vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_validated
  - exact_external_repo_read_preflight_prepared_before_VCPToolBox_read
  - exact_external_repo_read_authorization_packet_prepared_before_VCPToolBox_read
  - exact_external_repo_read_receipt_template_prepared_before_VCPToolBox_read
  - exact_external_repo_authorization_packet_issued_before_VCPToolBox_write
  - exact_adapter_file_allowlist_defined_before_code_write
  - no secret/env/config reads
  - no route HTTP/provider/plugin/API/image call
  - no dependency or lockfile change without exact package/action list
```

## Validation Plan

```yaml
validation_plan:
  local_AIL_no_execute_validation:
    - npm run validate:ail-core-vcp-adapter-split-plan-no-execute
    - npm run validate:vcptoolbox-image-execution-broker-external-repo-authorization-packet-no-execute
    - npm run validate:vcptoolbox-image-execution-broker-external-repo-readiness-review-no-execute
    - npm run validate:vcptoolbox-image-execution-broker-external-repo-read-preflight-no-execute
    - npm run validate:vcptoolbox-image-execution-broker-external-repo-read-authorization-packet-no-execute
    - npm run validate:vcptoolbox-image-execution-broker-external-repo-exact-read-receipt-template-no-execute
    - npm run validate:generic-image-execution-endpoint-gate-no-execute
    - npm run validate:vcptoolbox-image-execution-broker-followup-plan
    - npm run validate:validation-manifest
  future_code_validation_required:
    - exact adapter boundary tests proving AIL Core cannot choose provider/plugin/API
    - exact adapter mapping tests proving refs pass through unchanged
    - exact ReviewReport tests proving review/archive/memory decisions remain AIL-owned
```

## Future Authorization Packet Requirements

```yaml
future_authorization_packet_requirements:
  can_execute_now: false
  required_before_any_code_or_external_repo_write:
    - exact allowed local AIL adapter files if local implementation is proposed
    - exact allowed external VCPToolBox files if external implementation is proposed
    - exact forbidden files
    - exact validation commands
    - rollback_or_cleanup_plan
    - stop_conditions
    - no secret/env/config reads
    - no provider/plugin/API/image call
    - no push/tag/release/deploy
```

## Execution Boundary

```yaml
adapter_code_write_performed: false
broker_implementation_performed: false
generic_endpoint_enabled: false
migration_allowed_now: false
route_http_request_performed: false
external_VCPToolBox_read_performed: false
external_VCPToolBox_write_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
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

- The next task would write adapter, broker, route, IPC, preload, renderer, or provider executor code.
- The next task would read or modify VCPToolBox without a separate exact external-repo authorization packet.
- The next task would enable `/internal/agent-image-lab/executions/run`.
- The next task would call a route HTTP endpoint, provider, plugin, API, or image generator.
- The next task would let AIL Core or endpoint payload choose arbitrary `provider`, `plugin`, `api`, `delegate`, model, output directory, budget, retry policy, receipt target, or review queue.
- The next task would move review, archive, accepted sample, or memory-write authority into VCP Adapter.
- The next task would read `.env`, secrets, cookies, tokens, private configs, endpoint configs, or raw private data.
- The next task would change dependencies, package managers, lockfiles, or install commands without an exact package/action list.
- The next task would overwrite historical binding packets, receipts, artifact records, review bridges, or image files.
- The next task would require commit, push, tag, release, deploy, force push, history rewrite, or destructive filesystem action.

## Recommended Next

```yaml
completed_previous: prepare_vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute
recommended_next: perform_vcptoolbox_image_execution_broker_external_repo_exact_read_with_receipt_only_after_separate_authorization
why: >
  The AIL Core / VCP Adapter boundary is explicit and the exact no-execute
  external-repo authorization packet plus readiness review and read preflight
  now exist. The read authorization packet locks the future one-action read
  request shape, and the exact read receipt template locks the future receipt
  shape; actual VCPToolBox read/write access remains separately gated.
automatic_real_execution_allowed_by_this_plan: false
external_repo_read_allowed_by_this_plan: false
external_repo_write_allowed_by_this_plan: false
adapter_code_write_allowed_by_this_plan: false
```
