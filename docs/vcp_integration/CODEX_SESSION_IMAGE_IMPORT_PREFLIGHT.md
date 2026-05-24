# Codex Session Image Import Preflight

```yaml
phase: v0_6_66_codex_session_image_import_preflight_only
source_phase: v0_6_65a_exact_file_commit_readiness_gate
base_contract: AGENTS.md
mode: Green local preflight only
intent: local_implementation
risk_level: R1
status: completed_validated
preflight_only: true
execution: false
```

## Purpose

This gate defines the preflight-only layer for the selected route:

```yaml
import_route_id: codex_session_image_import
provider_id: codex_session_image
import_mode: manual_session_import
```

It checks whether a future Codex-session image import request has the correct references and guard flags before any import record contract is written. It does not generate an image, read image binaries, write output files, write accepted_samples, create production_candidate records, write DailyNote, or write VCP memory.

## Required Packet

```yaml
codex_session_image_import_preflight_v1:
  phase: v0_6_66_codex_session_image_import_preflight_only
  import_route_id: codex_session_image_import
  provider_id: codex_session_image
  import_mode: manual_session_import
  prompt_package_ref:
    required: true
    must_exist: true
    required_prefix: prompts/image_generation/
  generation_contract_ref: docs/vcp_integration/VCP_AGENT_IMAGE_GENERATION_TOOL_CONTRACT_V1.md
  route_selection_ref: docs/vcp_integration/VCP_AGENT_GENERATION_ROUTE_SELECTION_GATE.md
  output_directory_ref:
    required_prefix: runs/real_generation/
    future_directory_only: true
  future_image_file_path:
    placeholder_only: true
    image_binary_read_allowed_now: false
```

The future image file path may be named in the packet only as a project-relative placeholder under the future output directory. This phase must not check whether that image exists and must not read, hash, inspect, copy, or decode it.

## Review And Write Boundaries

```yaml
review_handoff_required: true
human_review_required: true
accepted_samples_write_allowed: false
production_candidate_write_allowed: false
DailyNote_write_allowed: false
VCP_memory_write_allowed: false
```

This preflight only decides whether a later import-record contract can be drafted. It cannot mark an image accepted, archive an asset, create a production candidate, write memory, or authorize a provider/plugin route.

## Blocked Cases

The validator must reject:

```yaml
blocked_cases:
  - provider_id_not_codex_session_image
  - import_mode_not_manual_session_import
  - prompt_package_ref_missing
  - prompt_package_ref_outside_prompts_image_generation
  - output_directory_ref_outside_runs_real_generation
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
env_read_performed: false
secret_read_performed: false
push_tag_release_deploy_performed: false
```

## Validation

```powershell
node --check scripts/validate_codex_session_image_import_preflight.js
node scripts/validate_codex_session_image_import_preflight.js
node --check scripts/validate_vcp_agent_generation_route_selection_gate.js
node scripts/validate_vcp_agent_generation_route_selection_gate.js
node --check scripts/validate_vcp_agent_image_generation_tool_contract.js
node scripts/validate_vcp_agent_image_generation_tool_contract.js
node --check scripts/lib/governance_tooling_maintenance_slice.js
node scripts/lib/governance_tooling_maintenance_slice.js
git diff --check
npm run validate:mvp
```

## Closeout

```yaml
phase: v0_6_66_codex_session_image_import_preflight_only
source_phase: v0_6_65a_exact_file_commit_readiness_gate
result: COMPLETED_VALIDATED
preflight_only: true
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
  - v0_6_67_codex_session_image_import_record_contract
```
