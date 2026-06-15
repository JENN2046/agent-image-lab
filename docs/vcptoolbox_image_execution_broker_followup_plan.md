# VCPToolBox Image Execution Broker Followup Plan

```yaml
phase: vcptoolbox_image_execution_broker_followup_plan_20260609
base_contract: AGENTS.md
source_draft: docs/vcptoolbox_image_execution_broker_design_input_sanitized.md
source_draft_use: sanitized_repo_local_design_input
source_draft_private_path_recorded: false
mode: A4_8_green_lane_planning_and_validator
intent: local_implementation
risk_level: R2
status: adopted_local_plan_no_execute
```

## Purpose

This plan adopts the sanitized repo-local Image Execution Broker design input
into the Agent Image Lab followup queue without treating any private local draft
path as project authority.

The draft's central decision is accepted:

```text
Route = transport
Activation = permission
VisualJobContract = intent
Broker = execution coordinator
Delegate = provider boundary
RestrictedPluginFacade = plugin safety boundary
Artifact/Receipt = evidence
ReviewQueue = production gate
MemoryCandidate = delayed, reviewed, non-default
```

The project-local version updates that route for the current Runtime-To-Review V2
state. Attempt 007 and the serum-specific route remain historical context, not
the current implementation target.

## Current Baseline

```yaml
current_runtime_to_review_state:
  attempt_018: accepted_sample_registered_and_closed_out
  v2_trial_001: completed_as_controlled_detail_trial
  v2_trial_002: generated_reviewed_memory_candidate_preflighted
  v2_trial_003: not_started
current_architecture_state: successful_specific_routes_but_no_final_channel_abstraction
external_draft_status: adopted_as_design_input_only
```

The current repository has enough evidence to define the next AIL-side generation
channel contract. It does not yet have enough evidence to implement the full
VCPToolBox Image Execution Broker or to replace all routes with a generic
execution endpoint.

## Target Architecture

```text
Agent Image Lab Core
  -> VisualJobContract / ShotPlan / ReviewPolicy
  -> VCP Adapter
  -> secretless activation-bound request
  -> VCPToolBox Image Execution Broker
  -> Internal Authorizer
  -> ImageRunCapability Registry
  -> Native Delegate Registry
  -> Restricted Plugin Facade
  -> provider delegate
  -> Artifact Store
  -> Review Queue
  -> Archive / Memory Candidate Gate
```

Ownership boundary:

```text
Agent Image Lab owns visual intent, review truth, archive policy, and delayed
memory-candidate policy.

VCPToolBox owns controlled execution, exact authorization, runtime binding,
provider/plugin access, delegate invocation, artifact evidence, and receipts.
```

## Adopted Design Rules

```yaml
design_rules:
  route_role: transport_only
  activation_role: permission_only
  visual_job_contract_role: visual_intent_and_constraints
  image_run_capability_role: VCPToolBox_internal_dispatch_authority
  payload_dispatch_rule: payload_must_not_select_arbitrary_plugin_or_api
  broker_role: execution_coordinator
  delegate_role: provider_boundary
  restricted_facade_role: narrow_plugin_invocation_boundary
  artifact_receipt_role: evidence
  review_queue_role: production_gate
  memory_candidate_role: delayed_reviewed_non_default
```

The AIL payload may carry activation and contract identifiers. It must not become
the source of truth for arbitrary `provider`, `plugin`, or `api` dispatch.

## Followup Work Packages

### WP1 - AIL Generation Channel Contract Preflight

```yaml
work_package_id: ail_generation_channel_contract_preflight_no_execute
lane: Green
status: completed_validated_20260609
goal: define the repo-local generation channel contract before any broader broker extraction
expected_outputs:
  - docs/generation_channel_contract_preflight.md
  - tests/schema_examples/generation_channel_contract_preflight.example.json
  - scripts/validate_generation_channel_contract_preflight.js
completion_refs:
  - docs/generation_channel_contract_preflight.md
  - tests/schema_examples/generation_channel_contract_preflight.example.json
  - scripts/validate_generation_channel_contract_preflight.js
scope:
  - VisualJobContract stable fields
  - ShotPlan stable fields
  - ReviewPolicy stable fields
  - ImageRunCapability reference shape
  - Artifact/Receipt evidence references
  - ReviewQueue and MemoryCandidate gates
forbidden:
  - provider call
  - plugin call
  - API call
  - image generation
  - external VCPToolBox modification
  - secret value read
  - accepted sample write
  - DailyNote or VCP memory write
```

### WP2 - Broker Binding Preflight Packet Template

```yaml
work_package_id: image_run_capability_binding_preflight_template
lane: Green
status: completed_validated_20260610
goal: define the shape of a future exact ImageRunCapability binding packet
completion_refs:
  - docs/image_run_capability_binding_preflight_template.md
  - tests/schema_examples/image_run_capability_binding_preflight_template.example.json
  - scripts/validate_image_run_capability_binding_preflight_template.js
must_include:
  - route_id_or_generic_endpoint_ref
  - activation_id_ref
  - canonical_contract_hash
  - provider_id_ref
  - plugin_id_ref
  - api_id_ref
  - delegate_id_ref
  - model_allowlist_ref
  - max_provider_calls: 1
  - max_plugin_calls: 1
  - max_api_calls: 1
  - max_images: 1
  - retry_allowed: false
  - overwrite_existing_files_allowed: false
  - secret_value_read_allowed: false
```

### WP3 - Compatibility Route Cleanup Plan

```yaml
work_package_id: compatibility_route_thin_ingress_plan
lane: Green_or_future_Amber_runtime_probe
status: completed_validated_20260610
goal: keep existing task-specific routes as bootstrap ingress while moving identity into VisualJobContract
rule: do_not_replace_current_trial_routes_until_contract_and_binding_preflight_validate
generic_endpoint_candidate: /internal/agent-image-lab/executions/run
current_endpoint_status: compatibility_shim_until_broker_ready
completion_refs:
  - docs/compatibility_route_thin_ingress_plan_no_execute.md
  - tests/schema_examples/compatibility_route_thin_ingress_plan_no_execute.example.json
  - scripts/validate_compatibility_route_thin_ingress_plan_no_execute.js
```

### WP4 - VCPToolBox Broker Implementation Proposal

```yaml
work_package_id: vcptoolbox_image_execution_broker_implementation_proposal
lane: Red_until_external_repo_write_is_exactly_authorized
status: completed_validated_no_execute_proposal_20260610
goal: prepare a separate VCPToolBox-side implementation packet only after AIL contract preflight passes
completion_refs:
  - docs/vcptoolbox_image_execution_broker_implementation_proposal_no_execute.md
  - tests/schema_examples/vcptoolbox_image_execution_broker_implementation_proposal_no_execute.example.json
  - scripts/validate_vcptoolbox_image_execution_broker_implementation_proposal_no_execute.js
requires:
  - exact external repository target
  - exact allowed files
  - rollback plan
  - local validation commands
  - no secret value read
  - no broad external modification
```

### WP5 - Generic Endpoint Migration Gate

```yaml
work_package_id: generic_image_execution_endpoint_gate
lane: future_Amber_runtime_or_external_repo_gate
status: completed_validated_no_execute_gate_20260610
goal: introduce a generic endpoint only after comparable trial evidence or repeated runtime boundary evidence exists
generic_endpoint_candidate: /internal/agent-image-lab/executions/run
generic_endpoint_enabled_now: false
migration_allowed_now: false
minimum_evidence:
  - at_least_two_v2_trials_with_comparable_artifact_review_evidence
  - or_one_trial_exposes_clear_repeated_runtime_boundary
compatibility_rule: current_task_specific_endpoint_remains_as_shim
completion_refs:
  - docs/generic_image_execution_endpoint_gate_no_execute.md
  - tests/schema_examples/generic_image_execution_endpoint_gate_no_execute.example.json
  - scripts/validate_generic_image_execution_endpoint_gate_no_execute.js
```

### WP6 - AIL Core / VCP Adapter Split

```yaml
work_package_id: ail_core_vcp_adapter_split_plan
lane: future_Green_design_then_staged_implementation
status: completed_validated_no_execute_plan_20260610
goal: separate visual domain objects from VCP execution adapter objects
ail_core_owns:
  - ProductBrief
  - ShotPlan
  - PromptLineage
  - ImageCandidate
  - ReviewReport
  - AcceptedCandidate
  - MemorySuitabilityDecision
vcp_adapter_owns:
  - activation_binding_refs
  - ImageRunCapability refs
  - broker request mapping
  - receipt evidence mapping
completion_refs:
  - docs/ail_core_vcp_adapter_split_plan_no_execute.md
  - tests/schema_examples/ail_core_vcp_adapter_split_plan_no_execute.example.json
  - scripts/validate_ail_core_vcp_adapter_split_plan_no_execute.js
```

### WP7 - VCPToolBox External Repo Authorization Packet

```yaml
work_package_id: vcptoolbox_image_execution_broker_external_repo_authorization_packet
lane: Red_until_external_repo_read_or_write_is_exactly_authorized
status: completed_validated_no_execute_packet_20260610
goal: prepare the exact no-execute external-repo authorization packet before any VCPToolBox access
target_system: VCPToolBox
target_repo: JENN2046/VCPToolBox
target_branch_required_before_future_write: main
external_repo_read_allowed_now: false
external_repo_write_allowed_now: false
can_execute_now: false
completion_refs:
  - docs/vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute.md
  - tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute.example.json
  - scripts/validate_vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute.js
```

### WP8 - VCPToolBox External Repo Readiness Review

```yaml
work_package_id: vcptoolbox_image_execution_broker_external_repo_readiness_review
lane: Green_local_readiness_review_only
status: completed_validated_no_execute_review_20260610
goal: review the no-execute authorization packet before preparing any exact VCPToolBox read preflight
target_system: VCPToolBox
target_repo: JENN2046/VCPToolBox
readiness_result: pass_ready_for_read_preflight_template
external_repo_read_allowed_now: false
external_repo_write_allowed_now: false
can_execute_now: false
completion_refs:
  - docs/vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute.md
  - tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute.example.json
  - scripts/validate_vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute.js
```

### WP9 - VCPToolBox External Repo Read Preflight

```yaml
work_package_id: vcptoolbox_image_execution_broker_external_repo_read_preflight
lane: Green_local_read_preflight_template_only
status: completed_validated_no_execute_preflight_20260610
goal: lock the exact future VCPToolBox read method without executing it
target_system: VCPToolBox
target_repo: JENN2046/VCPToolBox
preflight_result: ready_for_separate_exact_read_authorization_packet
allowed_future_git_command_count: 5
allowed_future_file_read_count: 6
external_repo_read_allowed_now: false
external_repo_write_allowed_now: false
can_execute_now: false
completion_refs:
  - docs/vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.md
  - tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.example.json
  - scripts/validate_vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.js
```

### WP10 - VCPToolBox External Repo Read Authorization Packet

```yaml
work_package_id: vcptoolbox_image_execution_broker_external_repo_read_authorization_packet
lane: Green_local_read_authorization_packet_only
status: completed_validated_no_execute_packet_20260610
goal: authorize the exact future VCPToolBox read request shape without executing it
target_system: VCPToolBox
target_repo: JENN2046/VCPToolBox
packet_result: ready_for_separate_exact_read_execution_with_receipt
allowed_future_git_command_count: 5
allowed_future_file_read_count: 6
external_repo_read_allowed_now: false
external_repo_write_allowed_now: false
read_receipt_written_now: false
can_execute_now: false
completion_refs:
  - docs/vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute.md
  - tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute.example.json
  - scripts/validate_vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute.js
```

### WP11 - VCPToolBox External Repo Exact Read Receipt Template

```yaml
work_package_id: vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template
lane: Green_local_exact_read_receipt_template_only
status: completed_validated_no_execute_template_20260610
goal: lock the future exact VCPToolBox read receipt format before any real external read
target_system: VCPToolBox
target_repo: JENN2046/VCPToolBox
receipt_template_result: ready_for_future_exact_read_receipt_population
receipt_target_directory: reports/external_repo_reads/
allowed_future_git_command_count: 5
allowed_future_file_read_count: 6
external_repo_read_allowed_now: false
external_repo_write_allowed_now: false
read_receipt_written_now: false
can_execute_now: false
completion_refs:
  - docs/vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.md
  - tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.example.json
  - scripts/validate_vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.js
```

## Execution Boundary

This plan does not execute any runtime action.

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
route_http_request_performed: false
real_manifest_read_performed: false
real_VCPChat_read_performed: false
real_VCPToolBox_read_performed: false
external_VCPToolBox_read_performed: false
external_VCPToolBox_write_performed: false
read_receipt_written_now: false
secret_value_read_performed: false
accepted_samples_write_performed: false
production_candidate_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
push_tag_release_deploy_performed: false
```

## Stop Rules

Stop before implementation when any of these are true:

- The next task would write outside this repository.
- The next task would modify VCPToolBox without an exact external-repo packet.
- The task would read secret values, cookies, tokens, `.env`, private configs, or raw private data.
- The task would let the payload choose arbitrary `provider`, `plugin`, or `api`.
- The task would overwrite historical trial packets or image artifacts.
- The task would call a provider, plugin, API, route HTTP endpoint, or image generator without a separate exact activation packet.
- The task would write accepted samples, production candidate metadata, DailyNote, or VCP memory directly.
- The task would require push, tag, release, deploy, force push, history rewrite, or destructive filesystem action.

## Recommended Next

```yaml
completed_previous: prepare_vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute
completion_refs:
  - docs/vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.md
  - tests/schema_examples/vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.example.json
  - scripts/validate_vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.js
recommended_next: perform_vcptoolbox_image_execution_broker_external_repo_exact_read_with_receipt_only_after_separate_authorization
why: >
  The AIL-side generation channel contract, ImageRunCapability no-execute
  binding template, compatibility route thin-ingress plan, and VCPToolBox broker
  implementation proposal are explicit and validated, and the generic endpoint
  migration gate plus AIL Core / VCP Adapter split are defined without enabling
  runtime execution. The external-repo authorization packet is explicit and the
  local readiness review passes only for preparing a bounded no-execute
  read-preflight template. That preflight locks the future read method, the read
  authorization packet locks the future one-action receipt-producing read shape,
  and the exact read receipt template now locks the future receipt format. Real
  VCPToolBox access still requires a separate exact execution instruction.
automatic_real_execution_allowed_by_this_plan: false
external_repo_read_allowed_by_this_plan: false
external_repo_write_allowed_by_this_plan: false
generic_endpoint_enablement_allowed_by_this_plan: false
adapter_code_write_allowed_by_this_plan: false
```
