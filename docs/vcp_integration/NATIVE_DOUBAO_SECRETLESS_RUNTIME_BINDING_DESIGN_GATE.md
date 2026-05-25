# NativeDoubao Secretless Runtime Binding Design Gate

```yaml
phase_name: v0_6_72b_native_doubao_secretless_runtime_binding_design_gate
mode: Green local design / docs / validator only
source_phase: v0_6_72_real_vcp_agent_generation_preflight_no_call
source_commit: ee23ce11912f5142c9e628cb27a52a9ec0d798ea
result: COMPLETED_TARGET_VALIDATED_WITH_KNOWN_UNRELATED_MVP_BLOCKER
v0_6_73_execution_allowed: false
```

## Purpose

This gate defines a future non-secret callable runtime binding path for
`NativeDoubaoImage`. It does not execute image generation, contact a provider,
call a plugin, call an API, read `.env`, read `.env.local`, read secret values,
write output files, write review handoff records, or create a successful
generation receipt.

The design keeps `v0_6_73_real_vcp_agent_generation_execution_one_shot` blocked
until a later execution gate can prove that Agent Image Lab receives only a
redacted provider binding reference and never handles the raw provider secret.

## Design Answers

```yaml
provider_binding_as_non_secret_capability_handle: true
agent_image_lab_receives_only_redacted_provider_binding_reference: true
secret_owner_process: VCPToolBox_or_owner_authorized_provider_runtime
agent_image_lab_secret_ownership: false
provider_contact_count_owner: provider_runtime_receipt_bridge
provider_contact_count_recorded_in: reports/provider_receipts/<phase>_receipt.json
raw_provider_payload_retention_policy: forbidden
raw_provider_payload_retained_by_agent_image_lab: false
output_directory_ref: runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/
output_directory_ref_under_runs_real_generation: true
receipt_proves_zero_secret_exposure: true
human_review_receives_only_sanitized_result_metadata: true
review_handoff_raw_payload_allowed: false
```

1. A provider binding can be passed as a non-secret capability handle instead of
   a raw env value. The handle is an opaque capability reference such as
   `provider_binding_ref: native_doubao:capability:owner-runtime:v0_6_73`.
2. Agent Image Lab receives only a redacted provider binding reference. It never
   receives `DOUBAO_IMAGE_API_KEY`, `.env.local` contents, endpoint secrets,
   credential tokens, cookie material, raw request auth headers, or raw
   provider responses.
3. The actual secret is owned by an owner-authorized provider runtime process,
   expected to be VCPToolBox or a future provider-runtime bridge. Agent Image Lab
   owns the production contract, prompt package reference, output directory
   reference, and sanitized receipt expectations only.
4. Provider contact is counted by the provider runtime receipt bridge. The
   future execution receipt must record `provider_call_count`, `plugin_call_count`,
   `api_call_count`, and `image_count` without exposing secret values.
5. Raw provider payload retention is forbidden. Agent Image Lab may retain only
   sanitized fields required for audit, such as route id, model id, redacted
   provider binding ref, call counts, output file references, safe dimensions,
   safe mime type, and status.
6. Output may be written only under
   `runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/`. The
   execution gate must reject absolute paths, `..`, any other `runs/` target,
   `accepted_samples/`, `production_candidate/`, or review-console write targets
   unless separately authorized by that later gate.
7. The receipt proves zero secret exposure by recording explicit false flags for
   env file reads, secret reads, raw payload retention, raw response retention,
   private absolute path retention, and raw stdout/stderr retention.
8. Human review receives only sanitized result metadata. The future review
   handoff may reference image artifacts only after the execution gate writes
   them, but it must not include raw prompts containing secrets, raw provider
   payloads, raw responses, headers, env values, or private absolute paths.

## Future Binding Packet Shape

```yaml
binding_packet_kind: native_doubao_secretless_runtime_binding
phase_name: v0_6_72b_native_doubao_secretless_runtime_binding_design_gate
selected_plugin_id: NativeDoubaoImage
selected_route: NativeDoubaoImage_one_shot_project_plugin
provider_id: native_doubao
model: doubao-seedream-5-0-260128
provider_binding_ref: native_doubao:capability:owner-runtime:v0_6_73
provider_binding_ref_redacted: true
provider_binding_ref_is_secret: false
provider_binding_secret_value_present: false
agent_image_lab_may_read_env_file: false
agent_image_lab_may_read_env_local_file: false
agent_image_lab_may_read_secret_value: false
secret_owner_process: VCPToolBox_or_owner_authorized_provider_runtime
provider_contact_count_owner: provider_runtime_receipt_bridge
max_provider_calls: 1
max_plugin_calls: 1
max_api_calls: 1
max_images_created: 1
raw_provider_payload_retention_policy: forbidden
raw_provider_payload_allowed_in_receipt: false
raw_provider_response_allowed_in_receipt: false
raw_stdout_stderr_allowed_in_receipt: false
private_absolute_path_allowed_in_receipt: false
output_directory_ref: runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/
output_write_allowed_by_this_gate: false
review_handoff_write_allowed_by_this_gate: false
human_review_sanitized_metadata_only: true
v0_6_73_execution_allowed: false
```

## Future Receipt Requirements

The future execution receipt must prove that Agent Image Lab stayed secretless:

```yaml
env_file_content_read_performed: false
env_local_file_content_read_performed: false
secret_value_read_performed: false
secret_value_recorded: false
raw_provider_payload_recorded: false
raw_provider_response_recorded: false
raw_stdout_stderr_recorded: false
private_absolute_path_recorded: false
provider_binding_ref_redacted: true
provider_contact_count_recorded: true
human_review_metadata_sanitized: true
```

## This Gate Non-Execution Evidence

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
image_binary_read_performed: false
output_write_performed: false
receipt_for_successful_generation_written: false
review_handoff_write_performed: false
accepted_samples_write_performed: false
production_candidate_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
env_file_content_read_performed: false
env_local_file_content_read_performed: false
secret_value_read_performed: false
dependency_change_performed: false
package_json_change_performed: false
push_tag_release_deploy_performed: false
next_phase_started: false
```

## Blocker Preserved

```yaml
v0_6_73_execution_allowed: false
blocked_next_phase: v0_6_73_real_vcp_agent_generation_execution_one_shot
blocker: validated_secretless_runtime_binding_implementation_not_present
unblock_condition: future execution gate must provide a callable non-secret capability handle and a receipt bridge that proves zero secret exposure before any provider contact or image generation.
```

## v0.6.72d Exact-File Commit Readiness

```yaml
phase_name: v0_6_72d_exact_file_commit_readiness_gate_with_mvp_exception_record
source_phase: v0_6_72c_mvp_blocker_isolation_gate
source_status: ISOLATED
result: COMPLETED_TARGET_VALIDATED_WITH_KNOWN_UNRELATED_MVP_BLOCKER
target_validator_passed: true
preflight_no_call_validator_passed: true
npm_validate_mvp_passed: false
npm_validate_mvp_failure_phrase: legacy_runs_missing_git_preview_capsule_pending
blocker_unrelated_to_v0_6_72b: true
accepted_sample_preview_capsule_migration_modified: false
v0_6_73_execution_allowed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
image_binary_read_performed: false
output_write_performed: false
env_file_content_read_performed: false
secret_value_read_performed: false
accepted_samples_write_performed: false
production_candidate_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
push_status: not_performed
next_phase_started: false
commit_candidate_exact_files:
  - docs/vcp_integration/NATIVE_DOUBAO_SECRETLESS_RUNTIME_BINDING_DESIGN_GATE.md
  - tests/schema_examples/native_doubao_secretless_runtime_binding_design.example.yaml
  - scripts/validate_native_doubao_secretless_runtime_binding_design.js
known_unrelated_mvp_blocker:
  command: npm run validate:mvp
  failing_validator: scripts/validate_v14_142_multi_accepted_sample_matrix.js
  blocker_phrase: legacy_runs_missing_git_preview_capsule_pending
  touches_v0_6_72b_files: false
```
