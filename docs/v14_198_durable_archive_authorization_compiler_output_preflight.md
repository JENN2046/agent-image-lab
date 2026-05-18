# v14.198 Durable Archive Authorization Compiler Output Preflight

```yaml
phase: v14_198_durable_archive_authorization_compiler_output_preflight
base_contract: AGENTS.md
mode: A4.8
intent: local_draft
risk_level: R2
execution_mode: durable_archive_authorization_compiler_output_preflight_only
```

## Purpose

Produce the first concrete compiler output preflight for the `durable_archive`
package type defined in v14.196. This phase prepares the gate shape for a
future artifact archive copy, but it does not copy image files, create archive
files, or modify `runs/real_generation/`.

## Decision

```yaml
package_type: durable_archive
package_status: draft_blocked_missing_archive_copy_authorization
archive_copy_authorized: false
archive_copy_performed: false
target_archive_path_provided: false
write_command_permission: false
execution_allowed_now: false
```

## Empty Write Scope

```yaml
source_artifact_ref: runs/real_generation/v14_166_codex_session_premium_portable_led_camping_lantern_v3_generation_trial/codex_session_v14_166_premium_portable_led_camping_lantern_v3_candidate_001.png
source_artifact_hash_ref: eaa52095be5af66854f80ba3f6a0b94c93bc1105e6e7ecf984b8dfb3dfff275c
target_archive_path: null
exact_allowed_write_paths: []
forbidden_write_paths:
  - runs/real_generation/
  - accepted_samples/
  - failure_samples/
  - production_candidate/
  - DailyNote
  - VCP memory
```

## Guard

```yaml
preflight_only: true
durable_archive_copy_performed: false
image_file_copy_performed: false
runs_source_image_modified: false
accepted_samples_write_performed: false
failure_samples_write_performed: false
production_candidate_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
push_tag_release_deploy_performed: false
artifact_recoverability_is_not_vcp_runtime_integration: true
vcp_runtime_integration_proven: false
```

## Closeout

The durable archive package can be compiled as a blocked local draft. It cannot
copy or move an artifact until Jenn provides exact A5 archive authorization
with source artifact, target archive path, hash verification, rollback, reviewer,
validation, and stop conditions.
