# v7.185 Core Independent, VCP Native ADR Gate

## Executive Verdict

```yaml
executive_verdict:
  overall_status: pass
  base_contract: AGENTS.md
  gate_model: fixed_A4_docs_only_gate_template_plus_phase_delta
  adr_gate: completed
  adr_decision: "Core Independent, VCP Native"
  sequence_correction_after: v7.184_static_review_console_mockup_planning_gate
  source_reference_read_only: "C:/Users/617/Downloads/agent_image_lab_future/agent_image_lab_future_vcp_strategy_2026-05-10.md"
  image_generation_allowed_now: false
  plugin_call_allowed_now: false
  provider_contact_allowed_now: false
  production_candidate_002_allowed_now: false
  memory_write_path_allowed_now: false
  runtime_execution_allowed_now: false
  recommended_next_phase: v7.186_core_domain_boundary_policy_gate
```

This gate records the architecture decision that Agent Image Lab keeps an
independent visual-production core while treating VCP as the first-priority
native adapter and runtime platform. It is a documentation-only ADR gate and
does not authorize VCP runtime access, plugin calls, provider contact, image
generation, DailyNote write, or VCP memory write.

## Fixed Gate Template

```yaml
gate_template:
  phase: v7.185_core_independent_vcp_native_adr_gate
  base_contract: AGENTS.md
  mode: A4
  intent: local_implementation
  risk_level: R0
  allowed_files:
    - docs/v7_185_core_independent_vcp_native_adr_gate.md
  read_only_references:
    - C:/Users/617/Downloads/agent_image_lab_future/agent_image_lab_future_vcp_strategy_2026-05-10.md
  forbidden_files:
    - AGENTS.md
    - README.md
    - package.json
    - scripts/**
    - .agent_board/**
    - review_console/**
    - integrations/**
    - schemas/**
    - fixtures/**
  allowed_actions:
    - create docs-only architecture decision record gate
    - summarize the read-only reference document
    - define Core Independent, VCP Native decision
    - define VCP as first-priority adapter platform
    - define non-runtime boundaries
    - define sequence correction after v7.184
    - run allowed Git checks
    - stage only allowlisted file
    - commit only allowlisted file
  forbidden_actions:
    - push
    - tag
    - validator execution
    - script execution
    - PowerShell script execution
    - runtime execution
    - VCPChat access
    - VCPToolBox access
    - plugin call
    - provider contact
    - image generation
    - DailyNote write
    - VCP memory write
    - dependency change
  validation:
    required:
      - git status --short
      - git diff -- docs/v7_185_core_independent_vcp_native_adr_gate.md
      - git diff --check
    forbidden:
      - validator execution
      - script execution
      - PowerShell script execution
      - runtime execution
  commit:
    allowed: true
    message: "docs: add v7.185 core independent vcp native adr"
  push:
    allowed: false
  explicit_non_authorization:
    generation: false
    plugin_call: false
    provider_contact: false
    runtime: false
    memory_write: false
    DailyNote_write: false
```

## Phase Delta

```yaml
phase_delta:
  phase: v7.185_core_independent_vcp_native_adr_gate
  purpose: >
    提炼 Core Independent, VCP Native 架构决策，确立 Agent Image Lab
    保持独立核心、VCP 作为第一优先适配平台，并记录这是在
    v7.184_static_review_console_mockup_planning_gate 已完成后的顺序修正 gate。
  source_reference:
    path: C:/Users/617/Downloads/agent_image_lab_future/agent_image_lab_future_vcp_strategy_2026-05-10.md
    access_mode: read_only
    status: discussion_draft
    source_date: 2026-05-10
  creates:
    - architecture_decision_record
    - core_independent_boundary
    - vcp_native_adapter_priority
    - non_integration_boundary
    - sequence_correction_record
  does_not_create:
    - core_schema_files
    - adapters_vcp_files
    - runtime_adapter
    - VCPChat_integration
    - VCPToolBox_integration
    - plugin_execution_path
    - memory_write_path
```

## Sequence Correction

```yaml
sequence_correction:
  previous_completed_gate: v7.184_static_review_console_mockup_planning_gate
  current_gate: v7.185_core_independent_vcp_native_adr_gate
  correction_type: architecture_ordering
  reason: >
    Before turning static review console planning into specifications or files,
    the project should record the higher-level relationship between Agent Image
    Lab and VCP. The review console is a surface; the core/VCP boundary is an
    architectural root decision.
  effect_on_v7_184:
    invalidates_v7_184: false
    supersedes_v7_184: false
    refines_future_v7_184_followups: true
  next_planning_rule: >
    Future review console mockup and adapter work must preserve independent
    core ownership and treat VCP as an adapter/runtime surface, not as the owner
    of Agent Image Lab's domain truth.
```

v7.184 remains completed. v7.185 is a sequencing correction that records the
architectural root before deeper mockup specification or adapter planning.

## ADR Record

```yaml
adr:
  id: ADR-0001
  title: "Agent Image Lab Core Independent, VCP Native"
  status: accepted_for_project_direction
  phase: v7.185_core_independent_vcp_native_adr_gate
  date: 2026-05-12

  decision:
    summary: >
      Agent Image Lab keeps an independent visual-production core. VCP is the
      first-priority native adapter, execution platform, memory substrate, and
      review surface, but it does not own the core domain truth.
    short_name: "Core Independent, VCP Native"
    chinese_name: "核心独立，VCP 原生适配"

  not_deciding:
    - concrete repository layout
    - executable adapter implementation
    - VCP runtime integration
    - plugin selection
    - provider selection
    - memory write activation
    - image generation activation
```

## Decision Statement

```yaml
decision_statement:
  core_independent: true
  vcp_native: true
  vcp_first_priority_adapter: true
  vcp_only_runtime: false
  agent_image_lab_as_vcp_plugin_only: false
  fully_detached_from_vcp: false
```

Agent Image Lab should not collapse into a VCP internal module. It also should
not detach from VCP and rebuild memory, tool execution, distributed workers, and
chat/review surfaces from scratch. The selected path is strategic independence
with deep VCP-native adapter design.

## Rationale

```yaml
rationale:
  why_core_independent:
    - Agent Image Lab's core assets are visual domain models, review rubrics, sample memory, failure learning, and provenance.
    - These assets need stable project-owned semantics that are not dictated by a general runtime.
    - Sensitive visual assets require stricter public/private boundaries than a generic tool chain.
    - The project must be able to run or reason locally without VCP becoming the source of truth.

  why_vcp_native:
    - VCP already provides tool execution, plugin dispatch, memory/RAG, distributed workers, VCPChat surface, and approval channels.
    - Rebuilding all of that locally would slow the project and duplicate existing platform value.
    - VCP is the natural first adapter for generation, review, recall, and future distributed execution.
    - VCP can be the nerve path and tool substrate while Agent Image Lab remains the visual production core.
```

The guiding line is: VCP is the nerve path, not the skeleton. Agent Image Lab's
skeleton is its own visual domain model, review standard, sample memory, and
failure-learning loop.

## Core Ownership Boundary

```yaml
core_ownership_boundary:
  agent_image_lab_must_own:
    domain_models:
      - ShotPlan
      - Shot
      - PromptLineage
      - ImageCandidate
      - AcceptedSample
      - RejectedSample
      - ReviewRubric
      - VisualMemory
      - FailureTaxonomy
      - ProvenanceRecord
      - EvalReport

    policies:
      - acceptance_policy
      - rejection_taxonomy
      - commercial_fitness_policy
      - material_failure_policy
      - AI_artifact_policy
      - memory_write_policy
      - public_private_policy

    workflows:
      - plan
      - generate
      - review
      - compare
      - accept
      - reject
      - archive
      - learn
```

These are project-owned domain truths. They may be exposed to VCP adapters in a
future authorized phase, but they must not be defined by VCP internals.

## VCP Native Adapter Boundary

```yaml
vcp_native_adapter_boundary:
  vcp_should_provide:
    runtime:
      - agent_execution
      - tool_calling
      - plugin_dispatch
      - distributed_workers

    memory:
      - long_term_memory_access
      - RAG_retrieval
      - project_recall
      - accepted_sample_recall

    interface:
      - VCPChat_surface
      - RAG_observer
      - review_console_surface
      - human_approval_channel

    bridge:
      - file_tools
      - image_generation_tools
      - external_system_connections

  vcp_must_not_own:
    - core_domain_truth
    - final_visual_memory_truth
    - unfiltered_rejected_sample_memory
    - private_visual_asset_policy
    - project_acceptance_rubric
```

VCP is the first-priority adapter and execution surface. It is not the only
possible runtime and not the owner of the project's visual production semantics.

## Architecture Direction

```yaml
architecture_direction:
  recommended_shape:
    core:
      status: independent
      rule: "core must not import VCP"
      owns:
        - domain_models
        - workflow_protocols
        - review_rubrics
        - memory_policy
        - asset_registry
        - eval_policy

    adapters:
      vcp:
        status: first_class_adapter
        priority: first
        may_later_provide:
          - vcp_memory_provider
          - vcp_tool_executor
          - vcp_review_surface
          - vcp_distributed_worker_bridge

      local:
        status: required_baseline
        may_later_provide:
          - local_file_store
          - local_registry
          - offline_review
          - cli_runner

      mcp:
        status: future_optional
        may_later_provide:
          - resource_server
          - tool_server
          - external_agent_bridge
```

This is an architectural direction, not an implementation command. This gate
does not create `core/`, `adapters/`, `apps/`, or registry files.

## Alternatives Considered

```yaml
alternatives_considered:
  fully_inside_vcp:
    shape: "Agent Image Lab becomes a VCP internal module"
    benefit:
      - fastest initial integration
      - immediate reuse of VCP memory and plugin surfaces
    fatal_problem:
      - weakens independent visual domain model
      - makes safety and ownership boundaries harder
      - risks letting general runtime structures swallow image-specific governance
    decision: rejected_as_final_architecture

  fully_independent_from_vcp:
    shape: "Agent Image Lab rebuilds runtime, memory, tools, and UI independently"
    benefit:
      - maximum freedom
      - clearest standalone product boundary
    fatal_problem:
      - duplicates VCP capabilities
      - slows delivery
      - wastes existing tool, memory, and review infrastructure
    decision: rejected_as_near_term_route

  independent_core_vcp_native_adapter:
    shape: "Project-owned core with VCP as first-class adapter"
    benefit:
      - preserves domain ownership
      - reuses VCP platform strengths
      - keeps future runtime portability
      - supports staged authorization gates
    cost:
      - requires clear adapter boundaries
      - requires stricter contracts between core and VCP
    decision: selected
```

## Consequences

```yaml
consequences:
  future_design_rules:
    - core schemas and policies must remain project-owned
    - VCP integration must be adapter-shaped
    - VCP may execute future tasks only under explicit authorization
    - VCP memory writes require independent memory write authorization
    - VCPChat review surfaces must not become implicit execution approval
    - rejected/private visual memory must be filtered before any future external write

  future_gate_implications:
    - static review console gates must present VCP as a surface, not core owner
    - adapter gates must define read/write boundaries explicitly
    - generation gates must keep authorization separate from plan and review
    - memory gates must distinguish draft memory_delta from durable VCP memory writes
```

## Non-Runtime Boundary Matrix

```yaml
non_runtime_boundary_matrix:
  adr_document_creation:
    allowed_under_A4: true
    runtime_required: false

  read_only_reference_summarization:
    allowed_under_A4: true
    runtime_required: false
    approved_reference:
      - C:/Users/617/Downloads/agent_image_lab_future/agent_image_lab_future_vcp_strategy_2026-05-10.md

  core_schema_creation:
    allowed_by_this_gate: false
    requires_separate_gate: true

  adapters_vcp_creation:
    allowed_by_this_gate: false
    requires_separate_gate: true

  VCPChat_read:
    allowed_by_this_gate: false
    requires_active_A5: true

  VCPToolBox_read:
    allowed_by_this_gate: false
    requires_active_A5: true

  plugin_call:
    allowed_by_this_gate: false
    requires_active_A5: true

  provider_contact:
    allowed_by_this_gate: false
    requires_active_A5: true

  image_generation:
    allowed_by_this_gate: false
    requires_active_A5: true

  memory_write:
    allowed_by_this_gate: false
    requires_independent_memory_write_authorization: true
```

## Explicit Non-Authorization Statement

```yaml
not_authorized_by_v7_185:
  core_schema_creation: false
  adapter_code_creation: false
  executable_entrypoint_creation: false
  VCPChat_runtime: false
  VCPToolBox_runtime: false
  real_manifest_read: false
  CDP_access: false
  bridge_methods: false
  MCP_calls: false
  plugin_call: false
  provider_contact: false
  image_generation: false
  output_save: false
  DailyNote_write: false
  VCP_memory_write: false
  submitDraft: false
  push_tag_release: false
```

v7.185 records the architecture decision. It does not implement the architecture
and does not authorize production execution.

## Pass Conditions

```yaml
pass_conditions:
  - only docs/v7_185_core_independent_vcp_native_adr_gate.md modified
  - fixed_gate_template_used
  - phase_delta_defined
  - authorized_reference_read_only
  - ADR_0001_defined
  - core_independent_decision_defined
  - VCP_native_adapter_priority_defined
  - sequence_correction_after_v7_184_defined
  - core_ownership_boundary_defined
  - VCP_adapter_boundary_defined
  - alternatives_considered_defined
  - consequences_defined
  - explicit_non_authorization_statement_defined
  - git_diff_check_passed
  - no runtime/plugin/provider/image/memory path opened
```

## Block Conditions

```yaml
block_conditions:
  - more_than_one_file_modified
  - unauthorized_file_read_or_write
  - validator_or_script_executed
  - PowerShell_script_executed
  - runtime_access_attempted
  - VCPChat_access_attempted
  - VCPToolBox_access_attempted
  - plugin_call_authorized
  - provider_contact_authorized
  - image_generation_authorized
  - memory_write_authorized
  - external_side_effect_occurred
  - push_attempted
```

## Recommended Next Phase

```yaml
recommended_next_if_pass:
  phase: v7.186_core_domain_boundary_policy_gate
  purpose: >
    使用固定 A4 docs-only gate 模板定义 independent core 的边界政策，
    明确哪些 schema/policy/workflow 必须归 Agent Image Lab 自己拥有，
    不创建 runtime code、不接 VCP、不调用插件。

alternative_next:
  phase: v7.186_vcp_adapter_boundary_policy_gate
  purpose: >
    使用固定 A4 docs-only gate 模板定义 VCP adapter 的 read/write 边界，
    仅做文档政策，不读取真实 VCPChat/VCPToolBox。
```

## Closeout Template

```yaml
closeout:
  phase: v7.185_core_independent_vcp_native_adr_gate
  commit_hash: <hash_or_null_if_not_committed>
  commit_message: "docs: add v7.185 core independent vcp native adr"
  branch: master
  git_status: <status>
  changed_files: 1
  local_scope_result: passed | failed
  push: not_performed

  adr:
    fixed_gate_template_used: true
    phase_delta_defined: true
    read_only_reference_used: true
    reference_path: C:/Users/617/Downloads/agent_image_lab_future/agent_image_lab_future_vcp_strategy_2026-05-10.md
    ADR_0001_defined: true
    decision: "Core Independent, VCP Native"
    core_independent_decision_defined: true
    VCP_native_adapter_priority_defined: true
    sequence_correction_after_v7_184_defined: true
    core_ownership_boundary_defined: true
    VCP_adapter_boundary_defined: true
    alternatives_considered_defined: true
    consequences_defined: true

  authorization:
    core_schema_creation_allowed_now: false
    adapter_code_creation_allowed_now: false
    executable_entrypoint_creation_allowed_now: false
    VCPChat_runtime_allowed_now: false
    VCPToolBox_runtime_allowed_now: false
    real_manifest_read_allowed_now: false
    image_generation_allowed_now: false
    plugin_call_allowed_now: false
    provider_contact_allowed_now: false
    memory_write_path_allowed_now: false
    runtime_execution_allowed_now: false
    submitDraft_allowed_now: false

  validation:
    git_diff_check: passed | failed
    validator_executed: false
    script_executed: false
    powershell_script_executed: false
    node_check_required: false

  safety_boundaries:
    runtime_accessed: false
    VCPChat_accessed: false
    VCPToolBox_accessed: false
    real_manifest_read: false
    CDP_accessed: false
    bridge_methods_called: false
    plugin_called: false
    provider_contacted: false
    image_generated: false
    daily_note_written: false
    vcp_memory_written: false
    submitDraft_called: false
    dependency_added: false
    package_json_modified: false
    ci_or_hook_created: false

remote_sync_verification:
  push_performed: false
  remote_head_checked: false
  pending_push: true | false

final_state:
  commit_completed: true | false
  push_completed: false
  next_phase_started: false
```
