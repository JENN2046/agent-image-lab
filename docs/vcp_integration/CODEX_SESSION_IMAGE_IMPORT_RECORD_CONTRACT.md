# Codex Session Image Import Record Contract

```yaml
phase: v0_6_67_codex_session_image_import_record_contract
source_phase: v0_6_66a_exact_file_commit_readiness_gate
base_contract: AGENTS.md
mode: Green local contract only
intent: local_implementation
risk_level: R1
status: completed_validated
contract_only: true
execution: false
```

## Purpose

This gate defines the import record contract for the selected manual route:

```yaml
import_route_id: codex_session_image_import
provider_id: codex_session_image
import_mode: manual_session_import
```

The record is a draft-only local contract for a future Codex-session image import. It names the required references, future placeholder paths, review linkage, and write boundaries. It does not perform the import, read image binaries, write outputs, create accepted samples, create production candidates, write DailyNote, or write VCP memory.

## Required Record

```yaml
codex_session_image_import_record_v1:
  phase: v0_6_67_codex_session_image_import_record_contract
  source_phase: v0_6_66a_exact_file_commit_readiness_gate
  contract_only: true
  import_record_id: codex_session_image_import_record_001
  provider_id: codex_session_image
  import_mode: manual_session_import
  prompt_package_ref: prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v3.yaml
  generation_contract_ref: docs/vcp_integration/VCP_AGENT_IMAGE_GENERATION_TOOL_CONTRACT_V1.md
  route_selection_ref: docs/vcp_integration/VCP_AGENT_GENERATION_ROUTE_SELECTION_GATE.md
  preflight_ref: docs/vcp_integration/CODEX_SESSION_IMAGE_IMPORT_PREFLIGHT.md
  output_directory_ref: runs/real_generation/v0_6_67_codex_session_image_import_record_candidate_001/
  future_image_file_ref: runs/real_generation/v0_6_67_codex_session_image_import_record_candidate_001/future_image_file_placeholder.png
  future_image_file_ref_placeholder_only: true
  review_case_ref: review_console/cases/codex_session_image_import_record_001.review_case.yaml
  human_review_required: true
  imported_asset_status: draft_only
```

The `future_image_file_ref` and `review_case_ref` are placeholders only. This phase must not check whether the image exists and must not read, hash, inspect, copy, decode, or write the image file.

## Write Boundaries

```yaml
accepted_samples_write_allowed: false
production_candidate_write_allowed: false
DailyNote_write_allowed: false
VCP_memory_write_allowed: false
```

The import record cannot mark an image accepted, archive an asset, promote a production candidate, write memory, or authorize provider execution. It only gives the next mock-validation gate a stable record shape to test.

## Blocked Cases

The validator must reject:

```yaml
blocked_cases:
  - provider_id_not_codex_session_image
  - import_mode_not_manual_session_import
  - prompt_package_ref_missing
  - prompt_package_ref_outside_prompts_image_generation
  - preflight_ref_missing
  - output_directory_ref_outside_runs_real_generation
  - imported_asset_status_not_draft_only
  - accepted_samples_write_allowed_true
  - production_candidate_write_allowed_true
  - DailyNote_write_allowed_true
  - VCP_memory_write_allowed_true
  - image_binary_read_performed_true
  - output_write_performed_true
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
node --check scripts/validate_codex_session_image_import_record_contract.js
node scripts/validate_codex_session_image_import_record_contract.js
node --check scripts/validate_codex_session_image_import_preflight.js
node scripts/validate_codex_session_image_import_preflight.js
node --check scripts/validate_vcp_agent_generation_route_selection_gate.js
node scripts/validate_vcp_agent_generation_route_selection_gate.js
node --check scripts/lib/governance_tooling_maintenance_slice.js
node scripts/lib/governance_tooling_maintenance_slice.js
git diff --check
npm run validate:mvp
```

## Closeout

```yaml
phase: v0_6_67_codex_session_image_import_record_contract
source_phase: v0_6_66a_exact_file_commit_readiness_gate
result: COMPLETED_VALIDATED
contract_only: true
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
  - v0_6_68_codex_session_image_import_record_mock_validation
```
