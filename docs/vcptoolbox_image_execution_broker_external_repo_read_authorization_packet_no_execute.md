# VCPToolBox Image Execution Broker External Repo Read Authorization Packet

```yaml
phase: vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute_20260610
base_contract: AGENTS.md
parent_read_preflight_ref: docs/vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.md
parent_readiness_review_ref: docs/vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute.md
parent_authorization_packet_ref: docs/vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute.md
parent_followup_plan_ref: docs/vcptoolbox_image_execution_broker_followup_plan.md
mode: A4_8_green_lane_read_authorization_packet_and_validator
intent: local_implementation
risk_level: R2
status: local_external_repo_read_authorization_packet_no_execute
```

## Purpose

This packet turns the read-preflight contract into the exact future VCPToolBox
external-repo read authorization shape without performing that read.

It locks one future action: a bounded, sanitized, local-only read of the exact
git context and six candidate source files already defined by the read
preflight. It does not approve any write, implementation, route HTTP probe,
provider/plugin/API call, image generation, dependency change, memory write,
commit, push, tag, release, or deploy.

This packet does not read VCPToolBox, verify a VCPToolBox branch or head, inspect
candidate external files, discover package scripts, store a private local
VCPToolBox path, copy raw VCPToolBox source, modify VCPToolBox, implement broker
code, enable the generic endpoint, call route HTTP, call a provider, call a
plugin, call an API, generate an image, read secrets, change dependencies, write
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
  external_repo_authorization_packet_ref: docs/vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute.md
  external_repo_readiness_review_ref: docs/vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute.md
  external_repo_read_preflight_ref: docs/vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.md
  external_repo_exact_read_receipt_template_ref: docs/vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.md
```

## Read Authorization Contract

```yaml
VCPToolBoxImageExecutionBrokerExternalRepoReadAuthorizationPacket.v1:
  prepared_by: Agent_Image_Lab
  target_system: VCPToolBox
  target_repo: JENN2046/VCPToolBox
  target_branch_required_before_future_write: main
  authority_status: read_authorization_packet_only_no_external_access
  packet_result: ready_for_separate_exact_read_execution_with_receipt
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
    - workspace_target_policy
    - requested_future_operation
    - authorized_future_git_commands
    - authorized_future_file_reads
    - forbidden_future_reads_or_actions
    - max_read_budget
    - sanitized_output_policy
    - read_execution_sequence
    - read_receipt_contract
    - validation_plan
    - stop_conditions
    - execution_boundary
```

Plain meaning: this packet is ready for a later exact read execution decision.
It does not perform or approve that read in this no-execute phase.

## Requested Future Operation

```yaml
requested_future_operation:
  operation_id: vcptoolbox_image_execution_broker_exact_external_repo_read
  operation_type: exact_external_repo_read_only
  one_action_only: true
  future_operation_requires_separate_execution_confirmation: true
  future_write_requires_separate_confirmation: true
  no_external_access_granted_by_this_packet_now: true
  future_read_purpose: verify branch, head, dirty state, and six candidate file summaries
  future_read_output: sanitized_read_receipt_only
```

The future action may only produce a read receipt. A read receipt is not a write
approval.

## Workspace Target Policy

```yaml
workspace_target_policy:
  workspace_ref: VCPTOOLBOX_WORKSPACE_RESOLVED_AT_EXECUTION_TIME
  private_local_path_recorded_now: false
  raw_private_path_print_allowed: false
  path_must_be_verified_without_secret_reads: true
  workspace_must_be_git_repo: true
  expected_remote_repo: JENN2046/VCPToolBox
  expected_future_write_branch: main
```

The future executor may receive an exact local workspace path at execution time.
This packet must not store or print that private path.

## Authorized Future Git Commands

```yaml
authorized_future_git_commands:
  - id: current_branch
    command_template: git -C <VCPTOOLBOX_WORKSPACE> branch --show-current
    purpose: verify current branch without network access
    output_policy: sanitized_single_line
  - id: working_tree_status
    command_template: git -C <VCPTOOLBOX_WORKSPACE> status --short
    purpose: detect dirty external worktree before any read summary
    output_policy: summarized_status_only
  - id: current_head
    command_template: git -C <VCPTOOLBOX_WORKSPACE> rev-parse HEAD
    purpose: record current local head for the read receipt
    output_policy: commit_sha_only
  - id: remote_tracking_head
    command_template: git -C <VCPTOOLBOX_WORKSPACE> rev-parse origin/main
    purpose: record local remote-tracking head if present without fetch
    output_policy: commit_sha_only_or_unavailable
  - id: recent_history
    command_template: git -C <VCPTOOLBOX_WORKSPACE> log --oneline --decorate -n 10
    purpose: summarize recent local context without remote writes
    output_policy: sanitized_commit_summary
```

No `git fetch`, network call, checkout, reset, clean, commit, tag, push, or
history rewrite is authorized by this packet.

## Authorized Future File Reads

```yaml
authorized_future_file_reads:
  - path: services/agentImageLab/ImageExecutionBroker.js
    purpose: broker coordinator boundary
    if_missing: record_absent_without_creating
  - path: services/agentImageLab/ImageRunCapabilityRegistry.js
    purpose: internal capability lookup and binding proof
    if_missing: record_absent_without_creating
  - path: services/agentImageLab/RestrictedPluginFacade.js
    purpose: narrow plugin/API/delegate invocation facade
    if_missing: record_absent_without_creating
  - path: services/agentImageLab/ArtifactReceiptWriter.js
    purpose: receipt and artifact evidence writer boundary
    if_missing: record_absent_without_creating
  - path: routes/agentImageLabImageExecution.js
    purpose: thin ingress or future generic route binding
    if_missing: record_absent_without_creating
  - path: tests/agentImageLab/imageExecutionBroker.test.js
    purpose: contract and dispatch-boundary tests
    if_missing: record_absent_without_creating
```

These six paths are the complete future source-file read allowlist. Missing files
must be recorded as absent; the future reader must not create, update, or infer
authorization to add them.

## Forbidden Future Reads Or Actions

```yaml
forbidden_future_reads_or_actions:
  - .env
  - config.env
  - secrets
  - credentials
  - tokens
  - cookies
  - private_configs
  - logs
  - raw_private_data
  - package_json_or_lockfile_read
  - node_modules_or_dependency_tree_read
  - unrelated_source_tree_read
  - broad_repository_scan
  - raw_source_copy_into_AIL
  - route_http_probe
  - provider_plugin_api_or_image_call
  - generic_endpoint_enablement
  - accepted_samples_or_production_candidate_write
  - DailyNote_or_VCP_memory_write
  - generated_image_or_run_artifact_write
  - dependency_or_package_manager_change
  - external_repo_write
  - external_repo_commit_push_tag_release_deploy
  - force_push_history_rewrite_or_destructive_action
```

## Max Read Budget

```yaml
max_read_budget:
  max_git_commands: 5
  max_candidate_source_files: 6
  max_external_source_file_reads: 6
  max_external_read_operations_total: 11
  max_retry_per_failed_read: 0
  network_access_allowed: false
  external_write_allowed: false
```

This authorization packet intentionally matches the read-preflight's narrowed
budget.

## Sanitized Output Policy

```yaml
sanitized_output_policy:
  raw_source_copy_into_AIL_allowed: false
  raw_private_local_path_allowed: false
  secret_value_print_allowed: false
  full_file_dump_allowed: false
  allowed_summary_fields:
    - path
    - exists
    - inferred_role
    - exported_symbol_names_if_obvious
    - import_dependency_names_if_obvious
    - route_or_module_boundary_summary
    - dispatch_authority_risk_summary
    - missing_or_conflict_notes
  forbidden_summary_fields:
    - raw_secret_values
    - raw_private_paths
    - raw_env_values
    - full_source_text
    - unrelated_file_content
```

The future read may produce enough summary for a later write proposal. It must
not copy VCPToolBox source into AIL.

## Read Execution Sequence

```yaml
read_execution_sequence:
  - verify_workspace_without_printing_private_path
  - run_exact_authorized_git_commands
  - read_only_authorized_candidate_files_if_present
  - record_missing_candidate_files_as_absent
  - produce_sanitized_read_receipt
  - stop_before_any_write_or_runtime_action
```

## Read Receipt Contract

```yaml
read_receipt_contract:
  future_receipt_required: true
  future_receipt_target_directory: reports/external_repo_reads/
  receipt_template_ref: docs/vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.md
  receipt_write_allowed_now: false
  required_fields:
    - receipt_schema_id
    - read_packet_id
    - read_authorization_packet_ref
    - receipt_template_ref
    - target_system
    - target_repo
    - workspace_verified_without_printing_private_path
    - workspace_private_path_recorded
    - current_branch
    - current_head
    - remote_tracking_head_or_unavailable
    - working_tree_status_summary
    - allowed_git_commands_used
    - allowed_file_reads_used
    - candidate_file_matrix
    - forbidden_paths_attempted
    - sanitized_summary_only
    - secret_value_read_performed
    - raw_source_copied_into_AIL
    - external_write_performed
    - route_http_request_performed
    - provider_plugin_api_image_performed
    - dependency_change_performed
    - read_receipt_written
    - next_write_gate_allowed
    - stop_reason
    - validation_summary
  next_write_gate_allowed: false
  next_write_gate_requires_separate_packet: true
```

The future receipt shape is fixed by
`docs/vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.md`.
The future reader may populate that template only after a separate exact read
execution instruction.

## Validation Plan

```yaml
validation_plan:
  local_AIL_no_execute_validation:
    - npm run validate:vcptoolbox-image-execution-broker-external-repo-read-authorization-packet-no-execute
    - npm run validate:vcptoolbox-image-execution-broker-external-repo-exact-read-receipt-template-no-execute
    - npm run validate:vcptoolbox-image-execution-broker-external-repo-read-preflight-no-execute
    - npm run validate:vcptoolbox-image-execution-broker-external-repo-readiness-review-no-execute
    - npm run validate:vcptoolbox-image-execution-broker-external-repo-authorization-packet-no-execute
    - npm run validate:vcptoolbox-image-execution-broker-followup-plan
    - npm run validate:ail-core-vcp-adapter-split-plan-no-execute
    - npm run validate:validation-manifest
  future_external_read_receipt_validation_required:
    - exact read receipt validates allowed git commands only
    - exact candidate file matrix matches six-path allowlist
    - forbidden path attempts equal empty list
    - secret_value_read_performed is false
    - raw_source_copied_into_AIL is false
    - external_write_performed is false
    - next_write_gate_allowed is false
```

## Execution Boundary

```yaml
can_execute_now: false
external_VCPToolBox_read_performed: false
external_VCPToolBox_write_performed: false
external_repo_branch_or_head_checked: false
external_repo_target_files_checked: false
external_repo_package_or_test_commands_discovered: false
read_receipt_written_now: false
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

- Actually read VCPToolBox instead of preparing or validating this local no-execute read authorization packet.
- Execute the future read without a separate exact execution instruction.
- Store or print a raw private local VCPToolBox path.
- Read `.env`, secrets, credentials, cookies, tokens, private configs, logs, package manifests, lockfiles, dependency trees, unrelated source files, or raw private data.
- Read files outside the six candidate file allowlist.
- Copy raw VCPToolBox source into AIL docs, reports, memory, or chat closeout.
- Change VCPToolBox files, dependencies, package managers, lockfiles, generated artifacts, or route behavior.
- Enable `/internal/agent-image-lab/executions/run`.
- Call route HTTP, provider, plugin, API, or image generation.
- Write accepted samples, production candidate metadata, DailyNote, VCP memory, Codex memory, generated images, run artifacts, or the future read receipt in this no-execute phase.
- Commit, push, tag, release, deploy, force push, rewrite history, or perform destructive filesystem actions.

## Recommended Next

```yaml
exact_read_receipt_template_ref: docs/vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.md
exact_read_receipt_template_status: completed_validated_no_execute_template_20260610
receipt_template_result: ready_for_future_exact_read_receipt_population
completed_previous: prepare_vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute
recommended_next: perform_vcptoolbox_image_execution_broker_external_repo_exact_read_with_receipt_only_after_separate_authorization
why: >
  The no-execute read authorization packet now converts the read-preflight into
  an exact future one-action read request, and the exact read receipt template
  fixes the future sanitized receipt shape. The future read must still be
  separately invoked, must populate only that receipt shape, and must stop
  before any VCPToolBox write or runtime action.
automatic_real_execution_allowed_by_this_packet: false
external_repo_read_performed_by_this_packet: false
external_repo_write_allowed_by_this_packet: false
broker_implementation_allowed_by_this_packet: false
generic_endpoint_enablement_allowed_by_this_packet: false
```
