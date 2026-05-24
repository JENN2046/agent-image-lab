# VCP Agent Image Generation Tool Contract V1

```yaml
phase: v0_6_63_vcp_agent_image_generation_tool_contract_v1
base_contract: AGENTS.md
mode: Green local docs/schema/fixtures/validator only
intent: local_implementation
risk_level: R1
execution: false
status: draft_contract
```

## Purpose

This contract defines how a future VCP Agent may ask Agent Image Lab for one controlled image-generation attempt without owning the visual-production truth and without executing any provider, plugin, API, MCP, VCPToolBox, VCPChat, or image-generation action in this phase.

The contract answers one question:

```text
How does a VCP Agent knock on the Agent Image Lab door for a controlled image-generation request?
```

It does not choose or execute the route behind that door.

## Architecture Boundary

Agent Image Lab core independent is the controlling architecture rule for this
contract: VCP may call and orchestrate, but Agent Image Lab keeps the visual
production core and evidence truth.

```yaml
architecture_principles:
  agent_image_lab_core_independent: true
  vcp_native_adapter: true
  vcp_agent_role: caller_or_orchestrator
  vcp_agent_owns_visual_core_truth: false
  agent_image_lab_owns:
    - prompt_package_policy
    - generation_plan_policy
    - review_handoff_policy
    - receipt_policy
    - archive_registry_policy
  vcp_role:
    - runtime_adapter
    - memory_substrate
    - review_surface
  provider_plugin_role: bounded_image_executor_after_later_gate
```

Reference anchors:

- `docs/vcp_integration/agent_image_lab_vcp_integration_full_landing_plan_v1.md`
- `docs/agent_image_lab_vcp_long_term_evolution_plan.md`
- `docs/archive/phases/v7/v7_185_core_independent_vcp_native_adr_gate.md`
- `docs/archive/phases/v7/v7_265_true_A5_authorization_request_gate.md`
- `docs/v14_115_dry_run_vcp_adapter_current_goal_alignment.md`
- `docs/codex_session_image_provider_minimal_contract.md`

## Caller Identity

Every request must identify the caller as a VCP Agent acting as caller/orchestrator only.

```yaml
caller_identity:
  vcp_agent_id: required_string
  vcp_agent_role: caller_or_orchestrator
  caller_owns_visual_core_truth: false
  requested_for_project: agent_image_lab
  request_scope: one_controlled_image_generation_attempt
```

The VCP Agent may request a route. It may not bypass Agent Image Lab's prompt package, generation plan, review handoff, receipt, archive, registry, approval, or memory gates.

## Allowed Request Packet

The allowed request packet is defined by:

```text
schemas/vcp_agent_image_generation_request.schema.yaml
```

Minimum request invariants:

```yaml
request_invariants:
  exact_prompt_package_ref_required: true
  prompt_package_ref_must_be_under: prompts/image_generation/
  exact_generation_plan_ref_required: true
  output_directory_ref_must_be_under: runs/real_generation/
  selected_route_required: true
  selected_route_options:
    - codex_session_image_import
    - native_doubao_project_plugin
    - future_vcp_provider_adapter
  max_plugin_calls: 1
  max_images_created: 1
  retry_limit: 0
  review_console_required: true
  human_review_required: true
  memory_write_allowed: false
  accepted_samples_write_allowed: false
```

## Route Options

```yaml
selected_route_options:
  codex_session_image_import:
    route_type: manual_import_contract
    current_default_safe_route: true
    execution_by_this_contract: false
    meaning: >
      A Codex-session image may later be imported into Agent Image Lab using
      the minimal import contract. This contract does not call the image tool.

  native_doubao_project_plugin:
    route_type: one_shot_project_plugin_route
    execution_by_this_contract: false
    future_plugin_id_hint: NativeDoubaoImage
    requires_later_preflight: true
    requires_later_exact_execution_gate: true

  future_vcp_provider_adapter:
    route_type: future_adapter_contract
    execution_by_this_contract: false
    status: planned_not_callable_here
    requires_later_adapter_validation: true
```

## Forbidden Fields

The request packet must not include:

```yaml
forbidden_fields:
  - raw_prompt_payload
  - secret_value
  - env_value
  - provider_raw_response
  - provider_endpoint
  - api_key
  - token
  - cookie
  - image_binary
  - private_absolute_path
  - raw_stdout
  - raw_stderr
```

Prompt text must be referenced by `prompt_package_ref`; generation intent must be referenced by `generation_plan_ref`.

## Response Receipt Shape

The response packet is defined by:

```text
schemas/vcp_agent_image_generation_response.schema.yaml
```

The response is a no-execution contract receipt. It records request acceptance or rejection for the next local mock-validation phase; it is not proof of generation.

```yaml
response_receipt_shape:
  request_id: required_string
  response_status: contract_validated_no_execution | contract_rejected
  selected_route: required_route_option
  prompt_package_ref: required_same_as_request
  generation_plan_ref: required_same_as_request
  output_directory_ref: required_same_as_request
  budget:
    max_plugin_calls: 1
    max_images_created: 1
    retry_limit: 0
  side_effects:
    provider_contact_performed: false
    plugin_call_performed: false
    api_call_performed: false
    mcp_runtime_performed: false
    image_generation_performed: false
    image_binary_read_performed: false
    output_write_performed: false
    DailyNote_write_performed: false
    VCP_memory_write_performed: false
    accepted_samples_write_performed: false
    production_candidate_write_performed: false
```

## Review Handoff Shape

```yaml
review_handoff:
  review_console_required: true
  human_review_required: true
  handoff_ref_required_after_future_execution: true
  handoff_must_include:
    - request_id
    - selected_route
    - prompt_package_ref
    - generation_plan_ref
    - output_directory_ref
    - receipt_ref
    - artifact_refs_or_empty_list
    - side_effect_flags
    - memory_write_allowed
    - accepted_samples_write_allowed
```

If a future execution creates an image, the image must still enter review before any accepted-sample, archive, production-candidate, or memory decision.

## Non-Authorization

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
image_generation_performed: false
image_binary_read_performed: false
output_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
accepted_samples_write_performed: false
production_candidate_write_performed: false
real_vcpchat_runtime_performed: false
real_vcptoolbox_runtime_performed: false
env_read_performed: false
secret_read_performed: false
push_tag_release_deploy_performed: false
```

## Validation

```powershell
node --check scripts/validate_vcp_agent_image_generation_tool_contract.js
node scripts/validate_vcp_agent_image_generation_tool_contract.js
git diff --check
npm run validate:mvp
```

## Next Sequence

```yaml
next_sequence:
  v0_6_64:
    name: VCP Agent Image Generation Contract Mock Validation
    type: local_dry_run
    execution: false
  v0_6_65:
    name: Route Selection Gate
    choice:
      - codex_session_image_import
      - NativeDoubaoImage one-shot plugin route
      - future VCP provider adapter
    execution: false
  v0_6_66:
    name: NativeDoubao / VCP Agent Preflight Only
    execution: false
  v0_6_67:
    name: One-shot Image Generation Execution
    execution: true_only_after_exact_gate
  v0_6_68:
    name: Review Console Handoff + Human Review
    memory_write: false
  v0_6_69:
    name: Accepted Sample / Archive Decision
    memory_write: false
  later:
    name: DailyNote / VCP Memory Writer Target
    only_after:
      - accepted sample
      - durable archive
      - production readiness
      - exact writer target exists
```

## Closeout Template

```yaml
phase: v0_6_63_vcp_agent_image_generation_tool_contract_v1
result: COMPLETED_VALIDATED | BLOCKED
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
output_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
accepted_samples_write_performed: false
production_candidate_write_performed: false
push_performed: false
next_recommended:
  - v0_6_64_vcp_agent_image_generation_contract_mock_validation
```
