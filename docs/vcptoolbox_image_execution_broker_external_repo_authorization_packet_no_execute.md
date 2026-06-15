# VCPToolBox Image Execution Broker External Repo Authorization Packet

```yaml
phase: vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute_20260610
base_contract: AGENTS.md
parent_split_plan_ref: docs/ail_core_vcp_adapter_split_plan_no_execute.md
parent_proposal_ref: docs/vcptoolbox_image_execution_broker_implementation_proposal_no_execute.md
parent_plan_ref: docs/vcptoolbox_image_execution_broker_followup_plan.md
mode: A4_8_green_lane_authorization_packet_and_validator
intent: local_implementation
risk_level: R2
status: local_external_repo_authorization_packet_no_execute
```

## Purpose

This packet turns the future VCPToolBox Image Execution Broker work into an
exact authorization request shape without performing the external repository
read or write.

It records the target repository, candidate file allowlist, forbidden files and
actions, evidence required before any future external access, validation
requirements, rollback expectations, and stop conditions. It is a packet for a
future decision, not that future decision.

This packet does not read VCPToolBox, modify VCPToolBox, implement broker code,
enable the generic endpoint, call route HTTP, call a provider, call a plugin,
call an API, generate an image, read secrets, change dependencies, write
memory, commit, push, tag, release, or deploy.

## Source Refs

```yaml
source_refs:
  broker_followup_plan_ref: docs/vcptoolbox_image_execution_broker_followup_plan.md
  generation_channel_contract_ref: docs/generation_channel_contract_preflight.md
  image_run_capability_binding_template_ref: docs/image_run_capability_binding_preflight_template.md
  compatibility_route_thin_ingress_plan_ref: docs/compatibility_route_thin_ingress_plan_no_execute.md
  vcptoolbox_broker_implementation_proposal_ref: docs/vcptoolbox_image_execution_broker_implementation_proposal_no_execute.md
  generic_endpoint_gate_ref: docs/generic_image_execution_endpoint_gate_no_execute.md
  ail_core_vcp_adapter_split_plan_ref: docs/ail_core_vcp_adapter_split_plan_no_execute.md
  external_repo_readiness_review_ref: docs/vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute.md
  external_repo_read_preflight_ref: docs/vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.md
```

The source refs define the AIL-owned visual contract, binding refs, compatibility
route constraints, future endpoint gate, external-repo proposal, and AIL Core /
VCP Adapter boundary. This packet converts those prior gates into the exact
external-repo authorization request format.

## Readiness Review Status

```yaml
readiness_review_ref: docs/vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute.md
readiness_review_status: completed_validated_no_execute_review_20260610
readiness_result: pass_ready_for_read_preflight_template
real_external_read_still_allowed_now: false
real_external_write_still_allowed_now: false
```

The readiness review passes only for preparing the next no-execute read-preflight
template. It does not approve the real external repository read.

## Read Preflight Status

```yaml
read_preflight_ref: docs/vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.md
read_preflight_status: completed_validated_no_execute_preflight_20260610
preflight_result: ready_for_separate_exact_read_authorization_packet
real_external_read_still_allowed_now: false
real_external_write_still_allowed_now: false
```

The read preflight defines the future read method only. It does not execute or
approve VCPToolBox access.

## Read Authorization Packet Status

```yaml
read_authorization_packet_ref: docs/vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute.md
read_authorization_packet_status: completed_validated_no_execute_packet_20260610
packet_result: ready_for_separate_exact_read_execution_with_receipt
real_external_read_still_allowed_now: false
real_external_write_still_allowed_now: false
```

The read authorization packet narrows the future read to one receipt-producing
action. It does not execute or approve VCPToolBox access in this phase.

## Authorization Contract

```yaml
VCPToolBoxImageExecutionBrokerExternalRepoAuthorizationPacket.v1:
  prepared_by: Agent_Image_Lab
  target_system: VCPToolBox
  target_repo: JENN2046/VCPToolBox
  target_branch_required_before_future_write: main
  authority_status: authorization_packet_only_no_external_access
  can_execute_now: false
  external_repo_read_allowed_now: false
  external_repo_write_allowed_now: false
  route_http_allowed_now: false
  provider_plugin_api_image_allowed_now: false
  secret_value_read_allowed: false
  dependency_change_allowed: false
  push_allowed: false
  required_fields:
    - packet_id
    - target_system
    - target_repo
    - target_branch_required_before_future_write
    - requested_future_operation
    - candidate_external_files
    - forbidden_external_files_or_actions
    - required_pre_authorization_evidence
    - future_read_preflight
    - future_write_envelope
    - future_validation_plan
    - rollback_or_cleanup_plan
    - stop_conditions
    - execution_boundary
```

Plain meaning: the packet is ready to be reviewed. It does not authorize the
external repo operation by itself.

## Requested Future Operation

```yaml
requested_future_operation:
  operation_id: vcptoolbox_image_execution_broker_exact_external_repo_binding
  operation_type: exact_external_repo_read_then_bounded_write_proposal
  future_read_purpose: verify VCPToolBox branch, head, and target file context
  future_write_purpose: add or update only the broker allowlist after read evidence passes
  future_execution_requires_separate_confirmation: true
  future_write_requires_separate_confirmation: true
  no_external_access_granted_by_this_packet: true
```

The future operation must be split into an exact read preflight and a bounded
write packet. A read result is not a write approval.

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

These paths are candidate allowlist entries only. They are not authorization to
inspect or modify VCPToolBox now.

## Forbidden External Files Or Actions

```yaml
forbidden_external_files_or_actions:
  - broad_repository_rewrite
  - package_manager_or_dependency_change
  - package_json_or_lockfile_change
  - secret_or_env_file_read
  - credential_or_token_edit
  - cookie_or_private_config_read
  - log_or_raw_private_data_read
  - unrelated_plugin_manager_refactor
  - full_pluginManager_exposure_to_route
  - arbitrary_provider_plugin_api_payload_dispatch
  - route_http_probe
  - provider_plugin_api_or_image_call
  - generic_endpoint_enablement
  - accepted_samples_or_production_candidate_write
  - DailyNote_or_VCP_memory_write
  - generated_image_or_run_artifact_write
  - external_repo_commit_push_tag_release_deploy
  - force_push_history_rewrite_or_destructive_action
```

## Required Pre-Authorization Evidence

```yaml
required_pre_authorization_evidence:
  local_ail_gates:
    - generation_channel_contract_preflight_validated
    - image_run_capability_binding_preflight_template_validated
    - compatibility_route_thin_ingress_plan_validated
    - vcptoolbox_image_execution_broker_implementation_proposal_validated
    - generic_image_execution_endpoint_gate_validated
    - ail_core_vcp_adapter_split_plan_validated
  future_external_repo_read_evidence_required:
    - exact_local_VCPToolBox_workspace_path_verified_without_secret_reads
    - VCPToolBox_current_branch_verified
    - VCPToolBox_current_head_verified
    - VCPToolBox_remote_head_verified
    - exact_target_files_existence_or_absence_checked
    - no_secret_env_cookie_token_private_config_or_log_read
  current_packet_external_evidence_status:
    exact_local_VCPToolBox_workspace_path_recorded_now: false
    VCPToolBox_branch_or_head_checked_now: false
    external_target_files_checked_now: false
```

This repository may record that a future path/head check is required. It must not
store a private local VCPToolBox path in this packet.

## Future Read Preflight

```yaml
future_read_preflight:
  can_execute_now: false
  read_allowed_by_this_packet_now: false
  allowed_future_read_scope:
    - git branch --show-current in exact VCPToolBox workspace
    - git status --short in exact VCPToolBox workspace
    - git log --oneline --decorate -n 10 in exact VCPToolBox workspace
    - read candidate external files only if they exist
  forbidden_future_read_scope:
    - .env
    - config.env
    - secrets
    - cookies
    - tokens
    - private configs
    - logs
    - unrelated source trees
    - raw private data
  max_external_read_files: 20
  raw_source_copy_into_AIL_allowed: false
  sanitized_summary_only: true
```

## Future Write Envelope

```yaml
future_write_envelope:
  can_execute_now: false
  write_allowed_by_this_packet_now: false
  future_external_repo_write_requires_separate_confirmation: true
  exact_allowed_files_must_match_candidate_external_files: true
  max_write_files: 6
  overwrite_existing_files_allowed: false
  dependency_manifest_change_allowed: false
  lockfile_change_allowed: false
  generated_artifact_write_allowed: false
  route_http_allowed_during_write: false
  provider_plugin_api_image_allowed_during_write: false
  memory_write_allowed_during_write: false
  commit_allowed: false
  push_allowed: false
```

## Future Validation Plan

```yaml
future_validation_plan:
  local_AIL_packet_validation:
    - npm run validate:vcptoolbox-image-execution-broker-external-repo-authorization-packet-no-execute
    - npm run validate:ail-core-vcp-adapter-split-plan-no-execute
    - npm run validate:vcptoolbox-image-execution-broker-followup-plan
    - npm run validate:vcptoolbox-image-execution-broker-implementation-proposal-no-execute
    - npm run validate:validation-manifest
  future_external_repo_validation_required:
    - exact VCPToolBox package/test command list from the future read preflight
    - route/broker unit tests proving payload cannot select provider/plugin/API
    - ImageRunCapability registry tests proving VCPToolBox binding refs are authoritative
    - RestrictedPluginFacade tests proving no full pluginManager exposure
    - receipt/artifact/review bridge tests proving output refs agree
    - memory candidate tests proving no default memory write
    - git diff --check inside VCPToolBox
```

## Rollback Or Cleanup Plan

```yaml
rollback_or_cleanup_plan:
  required_before_future_write: true
  minimum_required:
    - exact file list to revert
    - exact test files to revert
    - no generated artifacts to delete unless separately authorized
    - no dependency or lockfile rollback unless exact package action is authorized
    - no force push or history rewrite
    - restore task-specific compatibility routes if generic endpoint migration fails
  current_packet_cleanup_required: false
```

## Execution Boundary

```yaml
can_execute_now: false
external_VCPToolBox_read_performed: false
external_VCPToolBox_write_performed: false
external_repo_branch_or_head_checked: false
external_repo_target_files_checked: false
broker_implementation_performed: false
route_implementation_performed: false
generic_endpoint_enabled: false
migration_allowed_now: false
route_http_request_performed: false
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
Codex_memory_write_performed: false
commit_performed: false
push_tag_release_deploy_performed: false
```

## Stop Rules

Stop before external repo action when any of these are true:

- The next task would read or modify VCPToolBox without a separate exact
  external-repo read or write authorization.
- The next task would store a raw private local VCPToolBox path in project docs
  or memory.
- The next task would read `.env`, secrets, cookies, tokens, private configs,
  logs, or raw private data.
- The next task would change `package.json`, lockfiles, package managers, or
  dependencies without an exact package/action list.
- The next task would write files outside the candidate external file allowlist.
- The next task would expose full `pluginManager` to the route or AIL payload.
- The next task would allow payload-selected `provider`, `plugin`, `api`,
  `delegate`, model, output directory, budget, retry, receipt target, or review
  queue.
- The next task would enable `/internal/agent-image-lab/executions/run`.
- The next task would call route HTTP, provider, plugin, API, or image
  generation.
- The next task would write accepted samples, production candidate metadata,
  DailyNote, VCP memory, Codex memory, generated images, or run artifacts.
- The next task would require commit, push, tag, release, deploy, force push,
  history rewrite, or destructive filesystem action.

## Recommended Next

```yaml
completed_previous: prepare_vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute
recommended_next: perform_vcptoolbox_image_execution_broker_external_repo_exact_read_with_receipt_only_after_separate_authorization
why: >
  The external-repo authorization packet is explicit and has passed local
  readiness review only for preparing a bounded no-execute read-preflight
  template. That read-preflight now exists and the read authorization packet
  locks the future one-action read request shape; real VCPToolBox read/write
  execution remains separate.
automatic_real_execution_allowed_by_this_packet: false
external_repo_read_allowed_by_this_packet: false
external_repo_write_allowed_by_this_packet: false
broker_implementation_allowed_by_this_packet: false
generic_endpoint_enablement_allowed_by_this_packet: false
```
