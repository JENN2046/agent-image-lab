# VCPToolBox Image Execution Broker External Repo Readiness Review

```yaml
phase: vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute_20260610
base_contract: AGENTS.md
parent_authorization_packet_ref: docs/vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute.md
parent_split_plan_ref: docs/ail_core_vcp_adapter_split_plan_no_execute.md
parent_followup_plan_ref: docs/vcptoolbox_image_execution_broker_followup_plan.md
mode: A4_8_green_lane_readiness_review_and_validator
intent: local_implementation
risk_level: R2
status: local_external_repo_readiness_review_no_execute
```

## Purpose

This review checks whether the no-execute VCPToolBox external-repo
authorization packet is complete enough to prepare the next local read-preflight
template.

It does not perform that read preflight. It does not read VCPToolBox, modify
VCPToolBox, verify a VCPToolBox branch or head, inspect candidate external
files, implement broker code, enable the generic endpoint, call route HTTP, call
a provider, call a plugin, call an API, generate an image, read secrets, change
dependencies, write memory, commit, push, tag, release, or deploy.

The readiness decision is deliberately split:

```text
local contract readiness: pass for preparing a no-execute read-preflight template
real external read readiness: blocked until a separate exact read preflight exists
real external write readiness: blocked until read evidence and separate write confirmation exist
```

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
  external_repo_authorization_packet_ref: docs/vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute.md
```

## Readiness Contract

```yaml
VCPToolBoxImageExecutionBrokerExternalRepoReadinessReview.v1:
  prepared_by: Agent_Image_Lab
  target_system: VCPToolBox
  target_repo: JENN2046/VCPToolBox
  target_branch_required_before_future_write: main
  authority_status: readiness_review_only_no_external_access
  readiness_result: pass_ready_for_read_preflight_template
  can_execute_now: false
  external_repo_read_allowed_now: false
  external_repo_write_allowed_now: false
  route_http_allowed_now: false
  provider_plugin_api_image_allowed_now: false
  secret_value_read_allowed: false
  dependency_change_allowed: false
  push_allowed: false
  required_fields:
    - review_id
    - target_system
    - target_repo
    - target_branch_required_before_future_write
    - reviewed_authorization_packet_ref
    - readiness_result
    - local_readiness_criteria
    - deliberate_not_checked
    - blocking_items_for_real_external_read
    - blocking_items_for_real_external_write
    - next_read_preflight_template_requirements
    - execution_boundary
```

Plain meaning: the packet is coherent enough for the next local planning layer.
It is still not permission to touch VCPToolBox.

## Local Readiness Criteria

```yaml
local_readiness_criteria:
  target_repo_and_system_are_explicit: pass
  candidate_external_file_allowlist_is_exact: pass
  candidate_external_file_count: 6
  candidate_external_files_match_implementation_proposal: pass
  forbidden_external_actions_cover_secrets_dependencies_dispatch_runtime_and_git: pass
  future_read_scope_is_bounded_and_secretless: pass
  future_write_envelope_is_bounded_and_separately_confirmed: pass
  local_validation_commands_are_explicit: pass
  rollback_or_cleanup_plan_is_present: pass
  stop_conditions_cover_red_boundaries: pass
  raw_private_local_vcptoolbox_path_recorded: false
  external_access_performed_by_review: false
```

The review result is positive only for preparing a no-execute read-preflight
template. It is not positive for performing a real read.

## Candidate External File Review

```yaml
candidate_external_files_reviewed_from_packet:
  - services/agentImageLab/ImageExecutionBroker.js
  - services/agentImageLab/ImageRunCapabilityRegistry.js
  - services/agentImageLab/RestrictedPluginFacade.js
  - services/agentImageLab/ArtifactReceiptWriter.js
  - routes/agentImageLabImageExecution.js
  - tests/agentImageLab/imageExecutionBroker.test.js
allowlist_status: exact_candidate_only
external_file_existence_checked_now: false
```

These are still candidate paths only. Their existence, branch context, and
surrounding source context remain unknown until a separate read preflight is
prepared and authorized.

## Deliberately Not Checked

```yaml
deliberate_not_checked:
  exact_local_VCPToolBox_workspace_path: not_checked_by_this_review
  VCPToolBox_current_branch: not_checked_by_this_review
  VCPToolBox_current_head: not_checked_by_this_review
  VCPToolBox_remote_head: not_checked_by_this_review
  candidate_external_file_existence_or_absence: not_checked_by_this_review
  package_or_test_commands_inside_VCPToolBox: not_checked_by_this_review
```

This review keeps those unknowns explicit instead of pretending they were
verified.

## Blocking Items

```yaml
blocking_items_for_read_preflight_template: []
blocking_items_for_real_external_read:
  - exact_local_VCPToolBox_workspace_path_not_verified
  - VCPToolBox_branch_and_head_not_verified
  - VCPToolBox_remote_head_not_verified
  - candidate_external_files_not_checked
  - secretless_read_scope_not_yet_issued_as_exact_preflight
blocking_items_for_real_external_write:
  - real_external_read_not_performed
  - VCPToolBox_context_not_summarized
  - exact_write_packet_not_issued
  - external_validation_commands_not_discovered
  - separate_write_confirmation_not_present
```

The absence of blockers for the read-preflight template means only that another
local no-execute artifact may be prepared next.

## Read Preflight Status

```yaml
read_preflight_ref: docs/vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.md
read_preflight_status: completed_validated_no_execute_preflight_20260610
preflight_result: ready_for_separate_exact_read_authorization_packet
real_external_read_still_allowed_now: false
real_external_write_still_allowed_now: false
```

The read preflight locks the future read method. It does not approve the real
external repository read.

## Read Authorization Packet Status

```yaml
read_authorization_packet_ref: docs/vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute.md
read_authorization_packet_status: completed_validated_no_execute_packet_20260610
packet_result: ready_for_separate_exact_read_execution_with_receipt
real_external_read_still_allowed_now: false
real_external_write_still_allowed_now: false
```

The read authorization packet prepares the future one-action read request shape.
It does not execute VCPToolBox access.

## Next Read Preflight Template Requirements

```yaml
next_read_preflight_template_requirements:
  recommended_next: prepare_vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute
  can_execute_now: false
  read_allowed_by_this_review_now: false
  must_define_before_any_real_read:
    - exact external repository workspace target without printing private path
    - exact branch/head/status commands
    - exact candidate file read allowlist
    - exact forbidden secret/private/log paths
    - maximum external read file count
    - sanitized-summary-only output rule
    - stop conditions
    - validation command for the preflight packet
  must_not_include:
    - raw secret values
    - raw private local VCPToolBox path
    - broad source-tree read
    - route HTTP request
    - provider/plugin/API/image execution
    - dependency change
    - external repo write
    - commit/push/tag/release/deploy
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

Stop before any action when the next task would:

- Read or modify VCPToolBox instead of preparing a local no-execute read-preflight template.
- Store a raw private local VCPToolBox path in project docs, reports, memory, or chat closeout.
- Read `.env`, secrets, cookies, tokens, private configs, logs, or raw private data.
- Inspect files outside the exact future candidate file allowlist.
- Change dependencies, package managers, lockfiles, or install commands.
- Expose full `pluginManager` to the route or to AIL payloads.
- Allow payload-selected `provider`, `plugin`, `api`, `delegate`, model, output directory, budget, retry, receipt target, or review queue.
- Enable `/internal/agent-image-lab/executions/run`.
- Call route HTTP, provider, plugin, API, or image generation.
- Write accepted samples, production candidate metadata, DailyNote, VCP memory, Codex memory, generated images, or run artifacts.
- Commit, push, tag, release, deploy, force push, rewrite history, or perform destructive filesystem actions.

## Recommended Next

```yaml
completed_previous: prepare_vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute
recommended_next: perform_vcptoolbox_image_execution_broker_external_repo_exact_read_with_receipt_only_after_separate_authorization
why: >
  The local authorization packet was complete enough to prepare a bounded,
  secretless, no-execute read-preflight template, and that template now exists.
  The read authorization packet now locks the future one-action read request
  shape. Real VCPToolBox access remains blocked until a separate exact execution
  instruction exists.
automatic_real_execution_allowed_by_this_review: false
external_repo_read_allowed_by_this_review: false
external_repo_write_allowed_by_this_review: false
broker_implementation_allowed_by_this_review: false
generic_endpoint_enablement_allowed_by_this_review: false
```
