# VCP Agent Image Generation Contract Mock Validation

```yaml
phase: v0_6_64_vcp_agent_image_generation_contract_mock_validation
source_phase: v0_6_63_vcp_agent_image_generation_tool_contract_v1
base_contract: AGENTS.md
mode: Green local mock validation only
intent: local_implementation
risk_level: R1
execution: false
mock_validation_only: true
```

## Purpose

This phase validates that the VCP Agent Image Generation Tool Contract v1 can accept a safe local request, produce a no-side-effect mock response, and block unsafe request or response shapes.

It does not contact a provider, call a plugin, call an API, run MCP, run VCPToolBox, run VCPChat, generate images, read image binaries, write outputs, write DailyNote, write VCP memory, write accepted_samples, or write production_candidate.

## Pass Case

The mock validator must accept exactly the local contract request/response shape:

```yaml
pass_case:
  caller: VCP_Agent
  vcp_agent_role: caller_or_orchestrator
  prompt_package_ref_under: prompts/image_generation/
  generation_plan_ref_present: true
  selected_route_one_of:
    - codex_session_image_import
    - native_doubao_project_plugin
    - future_vcp_provider_adapter
  max_plugin_calls: 1
  max_images_created: 1
  retry_limit: 0
  memory_write_allowed: false
  accepted_samples_write_allowed: false
  production_candidate_write_allowed: false
  response_status: blocked_or_mock_ok
  side_effects_performed: false
```

## Blocked Cases

The mock validator must reject all blocked cases listed in:

```text
tests/schema_examples/vcp_agent_image_generation_mock_blocked_cases.example.yaml
```

The blocked set covers:

```yaml
blocked_cases:
  - missing_prompt_package_ref
  - arbitrary_plugin_id
  - max_plugin_calls_gt_1
  - max_images_created_gt_1
  - retry_limit_gt_0
  - memory_write_allowed_true
  - accepted_samples_write_allowed_true
  - production_candidate_write_allowed_true
  - raw_prompt_payload_present
  - secret_value_present
  - raw_provider_response_present
  - private_absolute_path_present
  - output_directory_outside_runs_real_generation
  - mock_response_claims_image_generation
  - mock_response_claims_output_write
```

## Validation

```powershell
node --check scripts/validate_vcp_agent_image_generation_tool_contract.js
node scripts/validate_vcp_agent_image_generation_tool_contract.js
node --check scripts/validate_vcp_agent_image_generation_contract_mock.js
node scripts/validate_vcp_agent_image_generation_contract_mock.js
node --check scripts/lib/governance_tooling_maintenance_slice.js
git diff --check
npm run validate:mvp
```

## Closeout

```yaml
phase: v0_6_64_vcp_agent_image_generation_contract_mock_validation
source_phase: v0_6_63_vcp_agent_image_generation_tool_contract_v1
result: COMPLETED_VALIDATED
mock_validation_only: true
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
push_performed: false
next_recommended:
  - v0_6_65_vcp_agent_generation_route_selection_gate
```
