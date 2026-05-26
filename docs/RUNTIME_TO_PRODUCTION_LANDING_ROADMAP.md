# Runtime To Production Landing Roadmap

本文记录 Agent Image Lab 从当前 runtime kernel v0 stub 走到完整产品落地的主路线。

它不是新的权限模型，也不授权 provider、secret、production write、push、tag、release 或 deploy。所有执行仍以 `AGENTS.md`、当前用户授权、现有 validator 和实际仓库状态为准。

## Direction

```text
runtime first
artifact second
review third
provider fourth
production last
```

项目过去的问题是治理、validator、receipt 和生产叙事走在 runtime 前面。后续每一步都必须增加真实可运行能力，而不是继续堆纯治理 checkpoint。

## Runnable Capability Gate

每个阶段开始前先问：

```text
这一步有没有让系统更能跑？
```

如果答案不是明确的“有”，就不做，或把任务改成能提升 runtime / artifact / review / audit / provider preflight 可运行能力的更小步骤。

## Current Baseline

当前 baseline：

- `runtime kernel v0 stub loop` 已完成并验证。
- `runtime_kernel_v0_contract@v0.2` 已固定输入 / 输出 envelope / adapter slots / side-effect policy。
- `artifact_adapter_stub_v0` 已接入 Green path。
- `review_bridge_readonly_stub_v0` 已接入 Green read-only path。
- `durable_audit_store_v0` 已接入 Green local audit path。
- `provider_preflight_no_provider_call_v0` 已接入 Green provider preflight path。
- `exact_a5_provider_execution_packet_draft_v0` 已生成 inactive exact A5 one-shot packet draft。
- `AUTH-DRAFT-NATIVE-DOUBAO-ONE-SHOT-20260526-001` 已按精确授权短语尝试一次，结果为 `BLOCKED_SECRETLESS_RUNTIME_NOT_CALLABLE`，在 provider contact 前 fail-closed。
- Green fixture 可以走到 `completed_stub`，路径为 `queued -> gated -> executed_stub -> artifact_recorded -> artifact_adapter_stubbed -> review_pending -> completed_stub`。
- Green fixture runtime result can be mapped to Review Console-readable `image_case_draft` and `review_session_draft` with no write actions.
- Red fixture 可以在 policy gate 进入 `blocked_red`，executor 不运行。
- audit write and durable audit store 已进入受控本地 `.agent_private` 路线。
- 这仍是 stub runtime，不是 production runtime。

## Landing Stages

### 1. Runtime Kernel

目标：本地任务闭环稳定。

核心组件：

- `task_intake`
- `policy_gate`
- `executor_interface`
- `artifact_persistence`
- `artifact_adapter_stub`
- `review_gate`
- `state_transition`
- `audit_record`

完成标志：

- 一个 fixture task 可以从输入跑到 audit record。
- Green / Red / failure path 都可验证。
- side-effect policy 明确区分 forbidden side effects 与 allowed local audit writes。

### 2. Artifact System

目标：runtime 产物可管理。

要做：

- artifact record schema
- artifact adapter stub
- artifact id / ref / hash
- preview capsule plan 对接
- no-overwrite policy
- recoverability validator

完成标志：

- runtime 每次运行都能产出统一 artifact record。
- artifact record 可验证、可追踪、可接 Review Console。

### 3. Review Console Bridge

目标：产物能被审查。

先做 read-only bridge，不做 approve / reject 写入。

要做：

- runtime audit -> review session
- artifact metadata -> Review Console case data
- read-only case view
- state / evidence / audit 展示

完成标志：

- runtime 跑完后，Review Console 能读到 task、artifact、audit 和 state。
- 不写 production，不写 accepted_samples，不写 memory。

### 4. Durable Audit Store

目标：所有 runtime run 可追溯。

要做：

- local audit store under `.agent_private`
- run index
- task index
- hash chain or stable hash record
- no-overwrite write mode
- cleanup / retention policy
- audit store validator

完成标志：

- 每次 runtime run 都有不可覆盖 audit record。
- 可以按 task/run 查询。
- audit JSON 不进入 Git。

### 5. Provider Preflight Layer

目标：接真实生成前先把安全门补齐。

仍不调用真实 provider。

要做：

- provider adapter contract
- authorization gate
- budget / cost gate
- timeout gate
- response schema validation
- MIME / magic / size validation
- URL download guard
- DNS / private IP guard
- output path guard

完成标志：

- 不调用 provider，也能证明真实调用前的参数、安全和输出边界都被检查。

### 6. First Guarded Real Generation

目标：第一次真实视觉生产 runtime 闭环。

只在明确授权后执行。

要做：

- one small authorized task
- provider output -> artifact record
- artifact -> review bridge
- audit -> durable store
- failure path record

完成标志：

- 一次真实生成能完整进入 artifact / review / audit。
- 不泄露 secret。
- 不写 production。

### 7. Production Workflow

目标：从“能生成”变成“可生产”。

要做：

- approval persistence
- production candidate
- accepted / rejected archive
- memory write packet
- DailyNote / VCP memory gate
- versioned asset lineage
- rollback / reject path

完成标志：

- 一个视觉任务可以从请求到生成、审查、批准、归档、记忆沉淀。

### 8. Productization / CI / Ops

目标：从本地实验仓库变成稳定产品系统。

要做：

- stable `validate:all`
- standard CI
- local API or dev server
- auth / session boundary
- observability
- release policy
- operator docs

完成标志：

- 新操作者可以 clone、配置、运行 validation、跑本地 demo，并理解所有边界。

## Immediate Next Tasks

推荐顺序：

1. Bind an owner-authorized secretless provider runtime delegate for the NativeDoubao route, without reading or printing secret values.
2. Start production workflow only after provider output can enter artifact / review / audit safely.

## Anti-Drift Rules

- Do not add pure governance checkpoint unless it directly validates a runtime/artifact/review/audit capability.
- Do not use validator pass as a substitute for runtime behavior.
- Do not connect provider before artifact and review paths are stable.
- Do not call stub runtime production-ready.
- Do not push, tag, release, deploy, read secrets, or write production without explicit authorization.
