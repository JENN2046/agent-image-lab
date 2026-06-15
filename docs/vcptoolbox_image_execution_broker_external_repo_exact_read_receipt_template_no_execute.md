# VCPToolBox Image Execution Broker External Repo Exact Read Receipt Template

```yaml
phase: vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute_20260610
base_contract: AGENTS.md
parent_read_authorization_packet_ref: docs/vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute.md
parent_followup_plan_ref: docs/vcptoolbox_image_execution_broker_followup_plan.md
mode: A4_8_green_lane_receipt_template_and_validator
intent: local_implementation
risk_level: R2
status: local_exact_read_receipt_template_no_execute
```

## Purpose

This template fixes the future sanitized receipt format for the exact
VCPToolBox external-repo read that was authorized as a later, separate action.

It does not perform the read, write a receipt, inspect VCPToolBox, verify a
VCPToolBox branch or head, read candidate external files, store a private local
path, copy raw VCPToolBox source, modify VCPToolBox, call route HTTP, call a
provider, call a plugin, call an API, generate an image, read secrets, change
dependencies, write memory, commit, push, tag, release, or deploy.

Plain meaning: if the future exact read is separately invoked, its output must
fit this receipt shape. The executor may populate placeholders with sanitized
evidence only; it must not improvise extra authority, extra file reads, raw
source dumps, private paths, or a write gate.

## Source Refs

```yaml
source_refs:
  broker_followup_plan_ref: docs/vcptoolbox_image_execution_broker_followup_plan.md
  external_repo_read_authorization_packet_ref: docs/vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute.md
  external_repo_read_preflight_ref: docs/vcptoolbox_image_execution_broker_external_repo_read_preflight_no_execute.md
  external_repo_readiness_review_ref: docs/vcptoolbox_image_execution_broker_external_repo_readiness_review_no_execute.md
  external_repo_authorization_packet_ref: docs/vcptoolbox_image_execution_broker_external_repo_authorization_packet_no_execute.md
  ail_core_vcp_adapter_split_plan_ref: docs/ail_core_vcp_adapter_split_plan_no_execute.md
```

## Receipt Template Contract

```yaml
VCPToolBoxImageExecutionBrokerExternalRepoExactReadReceiptTemplate.v1:
  prepared_by: Agent_Image_Lab
  target_system: VCPToolBox
  target_repo: JENN2046/VCPToolBox
  authority_status: exact_read_receipt_template_only_no_external_access
  template_result: ready_for_future_exact_read_receipt_population
  can_execute_now: false
  external_repo_read_allowed_now: false
  external_repo_write_allowed_now: false
  receipt_write_allowed_now: false
  receipt_population_allowed_now: false
  route_http_allowed_now: false
  provider_plugin_api_image_allowed_now: false
  secret_value_read_allowed: false
  dependency_change_allowed: false
  raw_source_copy_allowed: false
  private_path_print_allowed: false
  push_allowed: false
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
```

## Future Receipt Target

```yaml
future_receipt_target:
  target_directory: reports/external_repo_reads/
  filename_pattern: vcptoolbox_image_execution_broker_exact_read_receipt_<yyyymmdd>.json
  target_write_allowed_now: false
  overwrite_existing_receipt_allowed: false
  receipt_must_reference_this_template: true
  receipt_must_reference_read_authorization_packet: true
```

The future receipt write, if separately authorized as part of the exact read,
must create a new sanitized receipt only. It must not overwrite historical
receipts or write source code, generated images, accepted samples, production
candidate metadata, DailyNote entries, VCP memory, or Codex memory.
It must not overwrite historical receipts.

## Authorized Future Git Evidence

```yaml
authorized_future_git_commands:
  - id: current_branch
    command_template: git -C <VCPTOOLBOX_WORKSPACE> branch --show-current
    required_receipt_field: current_branch
  - id: working_tree_status
    command_template: git -C <VCPTOOLBOX_WORKSPACE> status --short
    required_receipt_field: working_tree_status_summary
  - id: current_head
    command_template: git -C <VCPTOOLBOX_WORKSPACE> rev-parse HEAD
    required_receipt_field: current_head
  - id: remote_tracking_head
    command_template: git -C <VCPTOOLBOX_WORKSPACE> rev-parse origin/main
    required_receipt_field: remote_tracking_head_or_unavailable
  - id: recent_history
    command_template: git -C <VCPTOOLBOX_WORKSPACE> log --oneline --decorate -n 10
    required_receipt_field: validation_summary.recent_history_summary
```

The future receipt must list only these command ids in
`allowed_git_commands_used`. No `git fetch`, checkout, reset, clean, commit,
tag, push, or history rewrite may appear in the receipt.

## Candidate File Matrix Template

```yaml
candidate_file_matrix_template:
  entry_required_fields:
    - path
    - exists
    - read_attempted
    - if_missing
    - summary_fields
    - missing_or_conflict_notes
    - raw_source_included
    - secret_value_detected_or_read
  allowed_summary_fields:
    - path
    - exists
    - inferred_role
    - exported_symbol_names_if_obvious
    - import_dependency_names_if_obvious
    - route_or_module_boundary_summary
    - dispatch_authority_risk_summary
    - missing_or_conflict_notes
  entries:
    - path: services/agentImageLab/ImageExecutionBroker.js
      if_missing: record_absent_without_creating
      raw_source_included: false
      secret_value_detected_or_read: false
    - path: services/agentImageLab/ImageRunCapabilityRegistry.js
      if_missing: record_absent_without_creating
      raw_source_included: false
      secret_value_detected_or_read: false
    - path: services/agentImageLab/RestrictedPluginFacade.js
      if_missing: record_absent_without_creating
      raw_source_included: false
      secret_value_detected_or_read: false
    - path: services/agentImageLab/ArtifactReceiptWriter.js
      if_missing: record_absent_without_creating
      raw_source_included: false
      secret_value_detected_or_read: false
    - path: routes/agentImageLabImageExecution.js
      if_missing: record_absent_without_creating
      raw_source_included: false
      secret_value_detected_or_read: false
    - path: tests/agentImageLab/imageExecutionBroker.test.js
      if_missing: record_absent_without_creating
      raw_source_included: false
      secret_value_detected_or_read: false
```

The future receipt must include exactly these six candidate paths. Missing files
must be recorded as absent; the read must not create files or infer write
authority from absence.

## Forbidden Receipt Fields

```yaml
forbidden_receipt_fields:
  - raw_source_text
  - raw_private_paths
  - raw_secret_values
  - raw_env_values
  - full_file_dump
  - unrelated_file_content
  - write_patch
  - generated_artifact_path_with_content
  - package_or_lockfile_content
```

The receipt is evidence, not a source mirror.

## Required False Evidence Flags

```yaml
required_false_evidence_flags:
  workspace_private_path_recorded: false
  secret_value_read_performed: false
  raw_source_copied_into_AIL: false
  external_write_performed: false
  route_http_request_performed: false
  provider_plugin_api_image_performed: false
  dependency_change_performed: false
  next_write_gate_allowed: false
```

`read_receipt_written` may only be true in the future receipt itself after a
separate exact read execution instruction. It is false in this no-execute
template phase.

## Future Receipt Validation Rules

```yaml
future_receipt_validation_rules:
  - receipt_schema_id equals vcptoolbox_image_execution_broker_external_repo_exact_read_receipt.v1
  - read_authorization_packet_ref matches docs/vcptoolbox_image_execution_broker_external_repo_read_authorization_packet_no_execute.md
  - receipt_template_ref matches docs/vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute.md
  - allowed_git_commands_used contains only the five authorized command ids
  - allowed_file_reads_used contains only the six authorized candidate paths
  - candidate_file_matrix contains exactly the six authorized candidate paths
  - forbidden_paths_attempted is an empty array
  - sanitized_summary_only is true
  - all required false evidence flags are false
  - next_write_gate_allowed is false
```

## Validation Plan

```yaml
validation_plan:
  local_AIL_no_execute_validation:
    - npm run validate:vcptoolbox-image-execution-broker-external-repo-exact-read-receipt-template-no-execute
    - npm run validate:vcptoolbox-image-execution-broker-external-repo-read-authorization-packet-no-execute
    - npm run validate:vcptoolbox-image-execution-broker-followup-plan
    - npm run validate:ail-core-vcp-adapter-split-plan-no-execute
    - npm run validate:validation-manifest
```

## Execution Boundary

```yaml
can_execute_now: false
external_VCPToolBox_read_performed: false
external_VCPToolBox_write_performed: false
external_repo_branch_or_head_checked: false
external_repo_target_files_checked: false
read_receipt_written_now: false
receipt_population_performed_now: false
raw_source_copied_into_AIL: false
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

- Actually read VCPToolBox instead of preparing or validating this local no-execute receipt template.
- Populate or write the future read receipt without a separate exact read execution instruction.
- Store or print a raw private local VCPToolBox path.
- Read `.env`, secrets, credentials, cookies, tokens, private configs, logs, package manifests, lockfiles, dependency trees, unrelated source files, or raw private data.
- Read files outside the six candidate file allowlist.
- Copy raw VCPToolBox source into AIL docs, reports, memory, or chat closeout.
- Add receipt fields for raw source, private paths, secrets, full file dumps, package or lockfile content, unrelated files, or write patches.
- Change VCPToolBox files, dependencies, package managers, lockfiles, generated artifacts, or route behavior.
- Enable `/internal/agent-image-lab/executions/run`.
- Call route HTTP, provider, plugin, API, or image generation.
- Write accepted samples, production candidate metadata, DailyNote, VCP memory, Codex memory, generated images, run artifacts, or the future read receipt in this no-execute phase.
- Commit, push, tag, release, deploy, force push, rewrite history, or perform destructive filesystem actions.

## Recommended Next

```yaml
completed_previous: prepare_vcptoolbox_image_execution_broker_external_repo_exact_read_receipt_template_no_execute
recommended_next: perform_vcptoolbox_image_execution_broker_external_repo_exact_read_with_receipt_only_after_separate_authorization
why: >
  The future exact VCPToolBox read now has a fixed no-execute receipt template.
  A future read, if separately authorized, must populate this sanitized receipt
  shape and stop before any write, runtime call, dependency change, or source
  copying.
automatic_real_execution_allowed_by_this_template: false
external_repo_read_performed_by_this_template: false
external_repo_write_allowed_by_this_template: false
read_receipt_written_by_this_template: false
broker_implementation_allowed_by_this_template: false
generic_endpoint_enablement_allowed_by_this_template: false
```
