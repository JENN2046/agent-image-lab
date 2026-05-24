# Codex Session Image Import Record Mock Validation

```yaml
phase: v0_6_68_codex_session_image_import_record_mock_validation
source_phase: v0_6_67_codex_session_image_import_record_contract
base_contract: AGENTS.md
mode: Green local mock validation only
intent: local_implementation
risk_level: R1
status: completed_validated
mock_validation_only: true
execution: false
```

## Purpose

This gate validates the v0.6.67 `codex_session_image_import` record contract
against local mock fixtures only. It proves that a valid draft-only manual
session import record can pass, and that unsafe record mutations fail before any
future image import, output write, archive write, production candidate, or memory
action.

It does not import a real image, read image binaries, write output, create
accepted samples, create production candidates, write DailyNote, or write VCP
memory.

## Valid Mock Record

```yaml
valid_mock_import_record:
  import_record_id: codex_session_image_import_record_mock_001
  provider_id: codex_session_image
  import_mode: manual_session_import
  prompt_package_ref: prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v3.yaml
  generation_contract_ref: docs/vcp_integration/VCP_AGENT_IMAGE_GENERATION_TOOL_CONTRACT_V1.md
  route_selection_ref: docs/vcp_integration/VCP_AGENT_GENERATION_ROUTE_SELECTION_GATE.md
  preflight_ref: docs/vcp_integration/CODEX_SESSION_IMAGE_IMPORT_PREFLIGHT.md
  future_image_file_ref: runs/real_generation/v0_6_68_codex_session_image_import_record_mock_001/future_image_file_placeholder.png
  output_directory_ref: runs/real_generation/v0_6_68_codex_session_image_import_record_mock_001/
  review_case_ref: review_console/cases/codex_session_image_import_record_mock_001.review_case.yaml
  human_review_required: true
  imported_asset_status: draft_only
```

The future image path is a placeholder only. This mock validation must not check
whether that file exists and must not read, hash, decode, copy, or write any
image binary.

## Required Fail Cases

The mock validator must reject:

```yaml
blocked_cases:
  - invalid_provider_id
  - invalid_import_mode
  - missing_prompt_package_ref
  - prompt_package_ref_outside_prompts_image_generation
  - missing_preflight_ref
  - output_directory_ref_outside_runs_real_generation
  - imported_asset_status_not_draft_only
  - image_binary_read_performed_true
  - output_write_performed_true
  - accepted_samples_write_allowed_true
  - production_candidate_write_allowed_true
  - DailyNote_write_allowed_true
  - VCP_memory_write_allowed_true
  - private_absolute_path_present_true
  - secret_value_present_true
```

## Explicit Non-Authorization

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
VCPToolBox_runtime_performed: false
VCPChat_runtime_performed: false
image_generation_performed: false
image_binary_read_performed: false
output_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
accepted_samples_write_performed: false
production_candidate_write_performed: false
env_read_performed: false
secret_read_performed: false
push_tag_release_deploy_performed: false
```

## Validation

```powershell
node --check scripts/validate_codex_session_image_import_record_mock_validation.js
node scripts/validate_codex_session_image_import_record_mock_validation.js
node --check scripts/validate_codex_session_image_import_record_contract.js
node scripts/validate_codex_session_image_import_record_contract.js
node --check scripts/lib/governance_tooling_maintenance_slice.js
node scripts/lib/governance_tooling_maintenance_slice.js
git diff --check
npm run validate:mvp
```

## Closeout

```yaml
phase: v0_6_68_codex_session_image_import_record_mock_validation
source_phase: v0_6_67_codex_session_image_import_record_contract
result: COMPLETED_VALIDATED
mock_validation_only: true
valid_mock_import_record_passed: true
blocked_case_count: 15
image_generation_performed: false
image_binary_read_performed: false
output_write_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
VCPToolBox_runtime_performed: false
VCPChat_runtime_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
accepted_samples_write_performed: false
production_candidate_write_performed: false
push_performed: false
next_recommended:
  - v0_6_68a_exact_file_commit_readiness_gate
```
