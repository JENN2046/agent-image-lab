# VCP Agent Generation Route Selection Gate

```yaml
phase: v0_6_65_vcp_agent_generation_route_selection_gate
source_phase: v0_6_64_vcp_agent_image_generation_contract_mock_validation
base_contract: AGENTS.md
mode: Green local route selection gate only
intent: local_implementation
risk_level: R1
status: completed_validated
execution: false
```

## Purpose

This gate selects the first landing route for the VCP Agent Image Generation Tool Contract v1 without executing image generation and without contacting any provider, plugin, API, MCP runtime, VCPToolBox, or VCPChat runtime.

The decision keeps the core architecture intact:

```yaml
vcp_agent_role: caller_or_orchestrator
agent_image_lab_role: visual_production_core_gatekeeper_and_evidence_system
vcp_role: runtime_adapter_memory_substrate_review_surface
provider_plugin_role: bounded_image_executor_only_after_later_gate
agent_image_lab_core_independent: true
vcp_native_adapter_preserved: true
vcp_agent_owns_visual_core_truth: false
```

## Selected Route

```yaml
selected_route: codex_session_image_import
selection_status: selected_first_landing_route
selection_reason: lowest_operational_risk_and_already_aligned_with_manual_import_contract
execution_allowed_by_this_gate: false
route_selected_for_execution_now: false
native_doubao_one_shot_project_plugin_status: reserved_for_later_exact_A5_preflight
future_vcp_provider_adapter_status: reserved_for_future_design_route
next_recommended_phase: v0_6_66_codex_session_image_import_preflight_only
```

Plain meaning:

```text
First let VCP Agent knock on the Agent Image Lab door through a controlled Codex-session image import contract. Keep NativeDoubaoImage as the later exact A5 preflight route. Keep the future VCP provider adapter as design work until adapter contracts and runtime boundaries are mature.
```

## Route Risk Matrix

| Route | Decision | Benefits | Main Risks | Current Gate Result |
| --- | --- | --- | --- | --- |
| `codex_session_image_import` | Select as first landing route | Uses existing manual import contract, avoids provider/plugin/API calls, keeps Agent Image Lab as evidence gatekeeper, supports review handoff before archive or memory. | Requires a later explicit human/operator import step; does not prove native VCP execution; imported asset still needs separate review and approval. | `selected_first_landing_route` |
| `NativeDoubaoImage_one_shot_project_plugin` | Reserve | Closest path to a real bounded provider/plugin execution later; maps well to max one plugin call, max one image, retry zero. | Requires provider/plugin contact, possible secret/env boundary, output write risk, quota/rate-limit risk, and exact A5 preflight before execution. | `reserved_for_later_exact_A5_preflight` |
| `future_vcp_provider_adapter` | Reserve | Long-term VCP-native architecture path; can eventually reduce manual handoff and centralize route behavior. | Adapter is not yet callable here; runtime boundary, manifest/read scope, provider payload redaction, and review handoff need more design and validation. | `reserved_for_future_design_route` |

## Required Preflight For Selected Route

Before any later Codex-session import gate can proceed, the next phase must prove:

```yaml
required_preflight_for_selected_route:
  - exact_vcp_agent_request_exists
  - caller_identity_is_VCP_Agent
  - prompt_package_ref_under_prompts_image_generation
  - generation_plan_ref_present
  - selected_route_equals_codex_session_image_import
  - output_directory_ref_under_runs_real_generation
  - max_plugin_calls_equals_1
  - max_images_created_equals_1
  - retry_limit_equals_0
  - review_console_required_equals_true
  - human_review_required_equals_true
  - memory_write_allowed_equals_false
  - accepted_samples_write_allowed_equals_false
  - production_candidate_write_allowed_equals_false
  - no_raw_prompt_payload
  - no_secret_value
  - no_provider_raw_response
  - no_private_absolute_path
  - no_image_binary_read_in_preflight
  - no_output_write_in_preflight
  - codex_session_image_import_schema_available
  - later_manual_import_record_required_before_review
```

The selected route still does not authorize image generation, file output, archive, accepted-sample registration, production-candidate creation, DailyNote write, or VCP memory write.

## Blocked Conditions

```yaml
blocked_conditions:
  - provider_contact_required
  - plugin_call_required
  - api_call_required
  - mcp_runtime_required
  - VCPToolBox_runtime_required
  - VCPChat_runtime_required
  - image_generation_required
  - image_binary_read_required
  - output_write_required
  - DailyNote_write_requested
  - VCP_memory_write_requested
  - accepted_samples_write_requested
  - production_candidate_write_requested
  - env_or_secret_read_required
  - raw_prompt_payload_requested
  - raw_provider_response_requested
  - private_absolute_path_requested
  - selected_route_not_in_contract_options
  - selected_route_requires_exact_A5_preflight_now
  - route_selection_expands_into_v0_6_67_execution
  - push_tag_release_deploy_requested
  - git_add_dot_required
```

## Side Effect Boundary

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

## Next Phase

```yaml
next_recommended:
  - v0_6_66_codex_session_image_import_preflight_only
later_routes:
  - v0_6_66b_native_doubao_vcp_agent_exact_A5_preflight_only
  - v0_6_70_future_vcp_provider_adapter_design_gate
```
