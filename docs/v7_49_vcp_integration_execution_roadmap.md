# v7.49 VCP Integration Execution Roadmap

## 1. Purpose

定义 Agent Image Lab VCP 集成的后续执行阶段。每个阶段明确 execution type、VCP call 状态和授权要求。

## 2. Stage Definitions

```yaml
stages:
  v7_50:
    name: "VCP read-only bridge planning"
    execution: docs_only
    vcp_call: false
    image_generation: false
    memory_write: false
    requires_independent_a5: false

  v7_51:
    name: "production candidate plan"
    execution: docs_only
    image_generation: false
    vcp_call: false
    memory_write: false
    requires_independent_a5: false

  v7_52:
    name: "one-shot production candidate A5"
    execution: real_generation
    image_generation: true
    vcp_call: false
    memory_write: false
    requires_independent_a5: true

  v7_53:
    name: "production candidate human review"
    execution: docs_only
    image_generation: false
    vcp_call: false
    memory_write: false
    requires_independent_a5: false

  v7_54:
    name: "memory delta candidate draft"
    execution: docs_only
    memory_write: false
    image_generation: false
    vcp_call: false
    requires_independent_a5: false

  v7_55:
    name: "DailyNote / VCP memory write authorization package"
    execution: docs_only
    memory_write: false
    image_generation: false
    vcp_call: false
    requires_independent_a5: false

  v7_56:
    name: "one-shot canonical memory write"
    execution: real_vcp_write
    memory_write: true
    image_generation: false
    vcp_call: true
    requires_independent_a5: true
```

## 3. Rules

- **不跳过 production candidate human review (v7.53)** — 任何 production asset 在写入 memory 前必须先经过人工审片
- **不从 prompt stable_candidate 直接写 VCP memory** — `stable_candidate` 不等于 `production_approved`，必须先经过真实生产候选和审片
- **只有真实 production candidate accepted 后，才允许 memory_delta draft**
- **memory write 只能一次一授权** — 一次 A5 授权只允许一次 memory write
- **写完必须 canonical verification** — 必须按 `docs/214_v10_28_dailynote_canonical_location_guard.md` 校验

## 4. Current Allowed Next Steps

当前阶段只允许以下两步继续：

1. **v7.50** — VCP read-only bridge planning（docs-only）
2. **v7.51** — production candidate plan（docs-only）

## 5. Hard Stops

- do_not_call_vcp_without_independent_a5
- do_not_write_dailynote_without_independent_a5
- do_not_write_vcp_memory_without_independent_a5
- do_not_generate_image_without_independent_a5
- do_not_store_image_binary_in_git_or_memory
- do_not_treat_stable_prompt_as_final_production_asset
