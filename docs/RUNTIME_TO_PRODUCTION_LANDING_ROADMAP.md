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
- `AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260527-007` 已完成一次真实 provider 链路验证，但人工审片结论固定为 `provider_link_success_evidence_only`；它不是 accepted sample，也不是 production candidate，不能作为 retry 008 的自动继续轨。
- `runtime_kernel_v1_real_provider_guarded` 已在 v0 stub 旁启动：fixture mode 产出 canonical artifact record、audit receipt、review bridge metadata entry；real-guarded mode 默认 fail-closed，只有注入结构化 provider delegate 时才会进入 provider-success result。
- `review_bridge_runtime_v1_readonly` 已接到 runtime v1 bridge metadata entry：它输出 metadata-only readonly review session，显示 run id、prompt ref、provider route、model sent/required、dimensions/hash、artifact/audit refs，并拒绝缺字段、failed result、secret/production/memory side effect、image binary read。
- `review_decision_record_v1` 已接到 runtime v1 readonly session 和 retry 007 historical review note：它固定 `accept_sample_draft`、`reject_sample_draft`、`request_rework`、`provider_link_success_evidence_only`、`invalid_artifact` 五个 decision enum，只写 metadata-only local decision record，不复制图、不写 production、不写 memory。
- `review_draft_registry_v1` 已接到 `review_decision_record.v1`：`accept_sample_draft` 生成 accepted draft，`reject_sample_draft` / `invalid_artifact` 生成 rejected draft，`request_rework` 生成 rework draft；所有 draft 都保持 `production_candidate: false`，retry 007 的 `provider_link_success_evidence_only` 只能生成 `no_registry_draft`。
- `run_runtime_to_review_v1_fixture_smoke_flow.js` 已建立 no-provider fixture smoke flow：prompt fixture -> runtime v1 -> artifact record -> audit receipt -> review bridge entry -> readonly review session -> `request_rework` decision record -> rework draft registry metadata，全程不写文件、不读图像二进制、不触发 provider/plugin/API/image/memory/production。
- Phase 7 validation split 已建立三层命令：`validate:runtime-to-review-default-local` 跑无 provider 默认本地链路；`validate:runtime-to-review-evidence` 校验已有 receipt/artifact/review evidence；`validate:runtime-to-review-guarded-live-probe-gate` 只校验 live probe 门禁不会默认执行。显式 live runner 为 `runtime-to-review:guarded-live-probe`，没有 provider delegate module 和精确确认短语时会 fail-closed。
- `adapters/runtime/native_doubao_runtime_v1_provider_delegate.js` 已建立 NativeDoubao runtime v1 provider delegate module：它验证 `runtime_v1_provider_delegate_request.v1`，只映射到 secretless controlled bridge path，默认没有 bound owner runtime 时 fail-closed，不走 legacy `.env.local` secret-reading path。`validate:runtime-to-review-native-doubao-delegate` 用 fake runner 验证 provider-success shape 可被 runtime v1 接收，同时证明 validator 不执行 live probe。
- 精确确认短语固定为 `RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE`。`validate:runtime-to-review-guarded-live-probe-gate` 现在验证 delegate module + 精确确认短语会通过 preflight-only，错误短语会阻断；这仍然不是 provider 执行。
- Review Console 已有独立 runtime v1 readonly real-entry 静态入口：`review_console/static_prototype/runtime_v1_real_entry_viewer.html` 只加载 `runtime_v1_real_entry_session.js` 与 `runtime_v1_real_entry_viewer.js`，不依赖 `mock_data.js`；它显示 run id、prompt package ref、provider route/mode、model sent/required、dimensions/hash、artifact/audit refs、review status 与 guard fields，缺字段、image binary loaded、provider side effect 会被 validator 阻断。
- Green fixture 可以走到 `completed_stub`，路径为 `queued -> gated -> executed_stub -> artifact_recorded -> artifact_adapter_stubbed -> review_pending -> completed_stub`。
- Green fixture runtime result can be mapped to Review Console-readable `image_case_draft` and `review_session_draft` with no write actions.
- Runtime v1 fixture result 可以走到 `completed_fixture_artifact`，real-guarded 缺少 delegate 或缺少 bound owner runtime 时走到 `failed_closed`，validator 使用 fake delegate/runner 只验证结构，不触发真实 provider/plugin/API/image action；Review bridge v1 validator 能把 fixture/fake-provider bridge entry 打开为 readonly real session；decision record 和 draft registry validators 能写入并清理本地 metadata-only probe；fixture smoke validator 能验证完整 no-provider runtime-to-review metadata chain，并捕获 provider failure、model mismatch、invalid MIME metadata、invalid review decision、forbidden production flag、forbidden memory write；Phase 7 gate validator 能证明默认本地验证不包含 live probe，evidence validation 只检查既有证据，live probe runner 缺少 delegate/精确确认时不执行，错误精确短语会阻断。
- Red fixture 可以在 policy gate 进入 `blocked_red`，executor 不运行。
- audit write and durable audit store 已进入受控本地 `.agent_private` 路线。
- 这仍不是 production runtime；当前只证明了 runtime-to-review metadata envelope、fail-closed NativeDoubao delegate module、精确确认短语 preflight gate、readonly review session read path、metadata-only human decision record、draft registry metadata route、no-provider fixture smoke flow、三层 validation gate split 和独立 Review Console static real-entry viewer。

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

1. Keep default local validation no-provider and repeatable.
2. Bind an owner-authorized secretless provider runtime for `adapters/runtime/native_doubao_runtime_v1_provider_delegate.js`, without reading or printing secret values.
3. Execute `runtime-to-review:guarded-live-probe` only with `RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE`, one provider/plugin/API call, one image max, and receipt/status sync.
4. Start production workflow only after provider output can enter artifact / review / audit and human decision records safely.

## Anti-Drift Rules

- Do not add pure governance checkpoint unless it directly validates a runtime/artifact/review/audit capability.
- Do not use validator pass as a substitute for runtime behavior.
- Do not connect provider before artifact and review paths are stable.
- Do not call stub runtime production-ready.
- Do not push, tag, release, deploy, read secrets, or write production without explicit authorization.
