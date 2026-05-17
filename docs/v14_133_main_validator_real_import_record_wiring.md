# V14.133 Main Validator Real Import Record Wiring

```yaml
phase: v14_133_main_validator_real_import_record_wiring
base_contract: AGENTS.md
mode: A4_8_safe_project_operator_rail
intent: local_implementation
risk_level: R2
source_phase: v14_132_state_scope_canonicalization
status: completed_validated
```

## Purpose

This phase proves that the main MVP validation chain now covers the real v14.105
Codex-session import record and artifact recoverability validator.

It does not replace the older fixture validator. It prevents the fixture
validator from being treated as the sole import evidence.

## Wiring Result

```yaml
main_validator_real_import_record_wiring_verified: true
mvp_invokes_real_artifact_validator: true
mvp_still_runs_fixture_validator: true
fixture_validator_not_sole_import_evidence: true
real_v14_105_import_record_in_main_validation_chain: true
artifact_hash_negative_case_covered_by_main_validator: true
missing_artifact_negative_case_covered_by_main_validator: true
missing_human_approval_negative_case_covered_by_main_validator: true
main_validator_requires_workspace_local_not_clone_portable_claim: true
```

## Evidence

```yaml
main_validator_ref: scripts/validate_mvp.ps1
real_artifact_validator_ref: scripts/validate_v14_131_real_artifact_validation_and_accepted_sample_recoverability.js
fixture_validator_ref: scripts/validate_codex_session_image_import.js
real_import_record_ref: runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/resort_relaxed_knit_final_import_record.json
```

## Explicit Non-Authorization

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
failure_samples_write_performed: false
production_candidate_created: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
push_tag_release_deploy_performed: false
```

## Validation

```text
node --check scripts/validate_v14_133_main_validator_real_import_record_wiring.js: passed
node scripts/validate_v14_133_main_validator_real_import_record_wiring.js: passed
```

## Next Council Cycle

```yaml
commander_decision:
  next_safe_cycle: review_console_static_import_record_reader
  reason: >
    Main validation now covers real artifact recoverability. The next product
    capability step is a static Review Console import record reader that parses
    a user-provided or project-local import record in memory without fetch,
    runtime, VCP, or file writes.
worker_scope:
  allowed:
    - review_console/static_prototype
    - local docs
    - local validators
    - .agent_board sync
  forbidden:
    - fetch/API/plugin/MCP
    - file writes from Review Console
    - VCPChat/VCPToolBox/runtime integration
    - modifying runs artifacts
    - DailyNote or VCP memory write
    - production_candidate or failure_samples write
    - push/tag/release/deploy
```
