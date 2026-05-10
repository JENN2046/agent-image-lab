# Agent Image Lab × VCP Long-term Evolution Plan

## 1. North Star

```yaml
north_star:
  statement: >
    Agent Image Lab should not remain a one-off image generation tool or a
    loose VCP plugin. It should evolve into a VCP-audited creative workflow
    object with long-term memory, review history, prompt lineage, approval
    trails, and controlled memory writeback.

  chinese_summary: >
    Agent Image Lab 最终不是 VCP 的一个普通插件，而是 VCP 记忆系统里的
    一个可审计创作工作流对象。
```

## 2. Route Philosophy

```yaml
route_philosophy:
  current_native_VCP_big_road:
    status: blocked_for_read_only_LT06
    reason: >
      Existing native VCP routes are powerful but too wide: chat completions
      can enter tool loops, human tool endpoint can directly execute plugins,
      plugin callback path exists, and no endpoint-level no-write gate has
      been proven.

  current_sidecar_bridge:
    name: Codex Memory MCP sidecar read-only candidate
    role: exploratory_bridge
    reason: >
      It is narrow enough to test read-only memory lookup through search_memory
      and memory_overview, while explicitly excluding record_memory.

  future_native_road:
    name: VCP native read-only lane
    role: final_bridge
    reason: >
      Long-term integration should move from sidecar bridge to native VCP
      read-only lane, but only after endpoint-level allowlist, no-write gate,
      callback exclusion, and write-path unreachable proof exist.
```

## 3. Memory Integration Principle

```yaml
memory_integration_principle:
  use_full_VCP_memory_eventually: true
  do_not_open_full_memory_now: true
  phased_activation_required: true

  why_full_memory_is_needed:
    - project_memory
    - visual_style_memory
    - approval_history
    - prompt_lineage
    - failure_patterns
    - safety_and_gate_history
    - production_candidate_evidence
    - long_term_agent_governance

  why_full_memory_is_dangerous_now:
    - DailyNote write path exists
    - CodexMemoryBridge write path exists
    - native VCP no-write lane not built
    - public_private_boundary not fully enforced
    - memory write approval path not implemented
```

## 4. Six-layer Memory Roadmap

```yaml
six_layer_memory_roadmap:
  layer_1_text_only_refs:
    status: mostly_completed
    write_allowed: false
    purpose: adapter returns repository-relative text refs only

  layer_2_sidecar_read_only_probe:
    status: current_near_term
    route: Codex Memory MCP sidecar
    allowed:
      - search_memory
      - memory_overview
    excluded:
      - record_memory
    next_gate: v7.58

  layer_3_native_vcp_read_only_lane:
    status: future_design_required
    purpose: build or specify true native VCP read-only bridge
    requirements:
      - endpoint_level_allowlist
      - no_write_gate
      - write_tools_excluded
      - DailyNote_unreachable
      - CodexMemoryBridge_write_excluded
      - plugin_callback_disabled
      - post_response_memory_hook_absent

  layer_4_vcp_read_only_memory_recall:
    status: future
    allowed:
      - project history lookup
      - visual style lookup
      - failure case lookup
      - review evidence lookup
    forbidden:
      - memory write
      - DailyNote write
      - automatic memory update

  layer_5_memory_write_draft:
    status: future_late_stage
    write_mode: draft_only
    requires:
      - human approval
      - redacted payload
      - explicit target
      - rollback record

  layer_6_full_vcp_memory_loop:
    status: final_stage
    includes:
      - read memory
      - reason with memory
      - generate evidence
      - propose memory update
      - human approve
      - write memory
      - later recall
      - compare before_after_behavior
```

## 5. Long-term Object Model

```yaml
image_lab_memory_object:
  project_id: string
  case_id: string
  prompt_version: string
  image_version: string
  review_result: string
  failure_reason: string
  visual_traits: list
  style_constraints: list
  approved_by: string | null
  rejected_by: string | null
  final_decision: string
  should_write_to_memory: boolean
  memory_visibility: string
  audit_refs: list
  rollback_refs: list
```

## 6. Route Evolution

```yaml
route_evolution:
  v7_58:
    name: Route Identity Clarification + Codex Memory MCP Sidecar No-write Probe
    goal: prove whether sidecar bridge is truly read-only
    A5_request: false
    LT06_execution: false

  v7_59:
    name: Native VCP Read-only Lane Design
    goal: design true VCP-native read-only bridge
    A5_request: false
    LT06_execution: false

  v7_60_plus:
    name: Native read-only fixture / static gate
    goal: validate native VCP read-only lane locally

  later_LT06_A5:
    name: one-call real read-only dry-run
    goal: execute only after gates and independent A5

  later_memory_write_path:
    name: memory write draft / approval / rollback
    goal: controlled memory write path

  final_closeout:
    name: full VCP integration closeout
    goal: Agent Image Lab becomes formal VCP memory-integrated creative workflow
```

## 7. Current Final Decision

```yaml
current_final_decision:
  future_use_full_VCP_memory: true
  current_full_memory_write: false
  current_native_VCP_big_road: blocked
  current_best_path: Codex_Memory_MCP_sidecar_bridge_first
  final_goal: native_VCP_read_only_bridge_then_full_memory_loop

  request_A5_now: false
  execute_LT06_now: false
  real_LT06_execution_ready: false

## 8. Wording Guard — Safety Boundary

Full VCP memory integration is a **long-term target**, not a current execution capability.

- Current phases must not open memory write path.
- Any future memory write requires separate design, approval, audit trail, rollback, and independent authorization.
- The six-layer roadmap describes a phased progression. Each phase must be explicitly gated and independently authorized before execution.
- No statement in this document authorizes any real VCPToolBox call, VCPChat bridge call, DailyNote write, VCP memory write, or image generation.
```
