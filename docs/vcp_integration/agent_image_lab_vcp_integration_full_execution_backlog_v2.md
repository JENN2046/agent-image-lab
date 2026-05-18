# Agent Image Lab × VCP 完整接入执行 Backlog v2

**文件名**: `agent_image_lab_vcp_integration_full_execution_backlog_v2.md`  
**项目**: `JENN2046/agent-image-lab`  
**编排方式**: 按“长任务 Long Task”组织  
**当前远端基线**: `3717c30848665d0c961d5d63d61924313a549c9d`  
**当前状态**: `v7.50d–v7.51b Read-only VCP Integration Long Task` 已完成并推送  
**默认策略**: 只读优先，写入默认阻断。  

---

## 0. 总结论

这份 v2 不是路线图，而是施工 backlog。

它把后续工作按“能安全一起做的长任务”收拢，避免每一步都碎片化开新线程。  
但它也明确划出不能合并的门：真实 VCP 调用、真实 VCPChat / Electron 启动、真实图片生成、真实 memory write，必须单独授权。

一句话：

```text
先把只读桥修成路，再把 VCPChat 做成安全玻璃，再让 VCPToolBox 只读接入，最后才讨论新图与长期记忆。
```

---

## 1. 当前基线与已完成状态

### 1.1 当前远端基线

```yaml
current_remote_baseline:
  commit: 3717c30848665d0c961d5d63d61924313a549c9d
  commit_message: test: add v7.50d-v7.51b read-only integration pack
  branch: master
  status: synced
```

### 1.2 已完成主链

```yaml
completed_chain:
  prompt_package:
    v3: stable_candidate

  production_candidate_001:
    generated_phase: v7_52
    human_review_phase: v7_53
    asset_status: accepted_with_minor_warning
    commercial_usability: pass
    memory_suitability: false
    current_case_state: closed_no_memory_write

  memory_write_chain:
    v7_54_memory_delta_candidate: draft_only
    v7_55_authorization_package: prepared_not_granted
    v7_56_closeout: skip_memory_write

  read_only_bridge_validation:
    v7_50a_schema_validation: pass
    v7_50b_mock_payload_validation: pass
    v7_50c_repository_local_dry_run: pass

  vcpchat_surface:
    v7_50d_surface_planning: completed
    v7_50d_static_fixture: pass

  evidence_and_adapter_planning:
    v7_51a_read_only_evidence_index: defined
    v7_51b_adapter_skeleton: planned
```

### 1.3 当前不可重开的事实

```yaml
do_not_reopen:
  production_candidate_001:
    current_case_state: closed_no_memory_write
    memory_write_skipped: true
    daily_note_write_skipped: true
    vcp_memory_write_skipped: true
    can_be_used_as_test_evidence: true
    can_be_written_to_memory: false
```

---

## 2. 全局硬停止规则

所有长任务默认继承以下规则。

```yaml
global_hard_stops:
  - do_not_commit_runs_or_image_binary
  - do_not_call_vcp_without_explicit_authorization
  - do_not_call_vcpchat_bridge_without_explicit_authorization
  - do_not_start_electron_without_explicit_authorization
  - do_not_start_remote_debug_without_explicit_authorization
  - do_not_call_cdp_without_explicit_authorization
  - do_not_write_dailynote_without_independent_A5
  - do_not_write_vcp_memory_without_independent_A5
  - do_not_generate_image_without_independent_A5
  - do_not_reopen_closed_no_memory_write_case
  - do_not_treat_accepted_with_minor_warning_as_production_approved
```

所有长任务的 commit 后默认停止。  
push 仍然需要单独指令，除非任务书明确授权 push。

---

## 3. 长任务总览

| Long Task | 阶段范围 | 主题 | 性质 | 是否可一起做 | 当前建议 |
|---|---|---|---|---:|---|
| LT-01 | v7.50d–v7.51b | Surface fixture + evidence index + adapter skeleton | 已完成 | 是 | 已推送 |
| LT-02 | v7.51c | Adapter implementation planning | docs-only | 是 | 下一步 |
| LT-03 | v7.51d–v7.51h | Local read-only adapter runtime + validation | local code + test | 是，但需先完成 LT-02 | 第二步 |
| LT-04 | v7.50e–v7.50h | Real VCPChat surface check planning + guarded execution | planning + A5 execution | 部分可合并 | 第三步 |
| LT-05 | v7.52a–v7.52f | VCPToolBox read-only ingestion planning + mock | docs + mock | 是 | 第四步 |
| LT-06 | v7.52g | VCPToolBox real read-only dry-run A5 | real read-only | 不可合并 | 单独授权 |
| LT-07 | v7.53a–v7.53e | E2E read-only integration fixture + audit | docs + local fixture | 是 | 第五步 |
| LT-08 | v7.53f | E2E real read-only dry-run A5 | real read-only | 不可合并 | 单独授权 |
| LT-09 | v7.60–v7.64 | New production candidate with VCP surface | image + review | 部分可合并 | 后期 |
| LT-10 | v7.70–v7.76 | Memory write path | memory write | 必须拆门 | 最后 |
| LT-99 | v7.99 | Final integration closeout | docs-only | 是 | 终局 |

---

# LT-01 — v7.50d–v7.51b Read-only VCP Integration Pack

## 状态

```yaml
long_task_id: LT-01
phase_range: v7.50d-v7.51b
status: completed_and_pushed
commit: 3717c30848665d0c961d5d63d61924313a549c9d
```

## 已完成内容

```yaml
completed:
  surface_static_fixture_execution:
    result: pass
    gates: 12/12

  real_vcpchat_surface_check_planning:
    status: planned

  read_only_evidence_index:
    status: defined

  read_only_bridge_adapter_skeleton:
    status: planned

  adapter_runtime_implemented: false
  vcp_call_performed: false
  vcpchat_bridge_call_performed: false
  electron_started: false
  memory_write_performed: false
  image_binary_read: false
```

## 后续引用

LT-02 之后所有 adapter / VCPChat / VCPToolBox 任务都应把此 commit 视为基线。

---

# LT-02 — v7.51c Read-only Bridge Adapter Implementation Planning

## 目标

把 adapter runtime 实现前的工程边界写清楚：文件路径、接口、错误码、测试脚本、输入输出、禁止行为、回滚点。

这一步仍然不写 runtime code。

```yaml
long_task_id: LT-02
phase_range: v7.51c
task_type: docs_only_planning
adapter_runtime_implemented: false
```

## 包含内容

```yaml
included:
  - adapter implementation plan
  - adapter file path proposal
  - adapter request/response schema
  - adapter error code catalog
  - adapter test plan
  - adapter security gate plan
  - local scope update proposal, if required
```

## 禁止内容

```yaml
excluded:
  - adapter runtime code
  - real VCP call
  - real VCPChat bridge call
  - Electron launch
  - memory write
  - image generation
```

## 建议交付物

```yaml
deliverables:
  - docs/archive/phases/v7/v7_51c_read_only_bridge_adapter_implementation_planning.md
  - docs/archive/phases/v7/v7_51c_read_only_bridge_adapter_file_layout.md
  - docs/archive/phases/v7/v7_51c_read_only_bridge_adapter_error_codes.md
  - docs/archive/phases/v7/v7_51c_read_only_bridge_adapter_test_plan.md
  - docs/archive/phases/v7/v7_51c_read_only_bridge_adapter_security_gate_plan.md
  - docs/archive/phases/v7/v7_51c_read_only_bridge_adapter_implementation_plan.yaml
  - README.md
  - .agent_board/CHECKPOINT.md
```

## 完成门

```yaml
completion_gates:
  adapter_file_layout_defined: true
  runtime_not_implemented: true
  tests_planned: true
  hard_blockers_defined: true
  no_vcp_call: true
  no_bridge_call: true
```

## Commit

```bash
git commit -m "docs: add v7.51c read-only adapter implementation planning"
```

## 停止点

commit 后停止。  
不要实现 adapter runtime。  
不要 push，除非单独授权。

---

# LT-03 — v7.51d–v7.51h Local Read-only Adapter Runtime + Validation

## 目标

在 Agent Image Lab 仓库内实现一个本地只读 adapter runtime，并完成本地 schema、安全门、fixture 回归。

它不调用 VCPToolBox。  
它不调用 VCPChat。  
它只是本仓库的本地 read-only adapter。

```yaml
long_task_id: LT-03
phase_range: v7.51d-v7.51h
task_type: local_code_and_validation
requires_prior: LT-02
```

## 包含阶段

```yaml
included:
  v7_51d:
    name: local adapter runtime implementation
  v7_51e:
    name: adapter schema validation execution
  v7_51f:
    name: adapter security gate validation execution
  v7_51g:
    name: adapter fixture regression execution
  v7_51h:
    name: adapter implementation closeout
```

## 允许代码

```yaml
allowed_runtime_files_example:
  - scripts/agent_image_lab_read_only_adapter.js
  - scripts/validate_agent_image_lab_read_only_adapter_schema.js
  - scripts/validate_agent_image_lab_read_only_adapter_security_gates.js
  - scripts/validate_agent_image_lab_read_only_adapter_fixtures.js
```

## Adapter 必须做到

```yaml
adapter_requirements:
  input:
    - bridge_mode
    - requested_resources
    - case_id
    - write_intent
    - image_binary_requested
    - secrets_requested
  output:
    - status
    - payload_type: text_only_refs
    - returned_refs_only: true
    - repository_relative_refs_only
  must_block:
    - write_intent_true
    - image_binary_requested
    - secrets_requested
    - raw_payload_requested
    - private_absolute_path_requested
    - memory_write_attempted
    - dailynote_write_attempted
    - production_approved_claim_detected
    - closed_case_reopen_attempted
```

## 建议交付物

```yaml
deliverables:
  runtime:
    - scripts/agent_image_lab_read_only_adapter.js

  validators:
    - scripts/validate_agent_image_lab_read_only_adapter_schema.js
    - scripts/validate_agent_image_lab_read_only_adapter_security_gates.js
    - scripts/validate_agent_image_lab_read_only_adapter_fixtures.js

  reports:
    - docs/v7_51e_read_only_adapter_schema_validation_report.md
    - docs/v7_51e_read_only_adapter_schema_validation_result.yaml
    - docs/v7_51f_read_only_adapter_security_gate_validation_report.md
    - docs/v7_51f_read_only_adapter_security_gate_validation_result.yaml
    - docs/v7_51g_read_only_adapter_fixture_regression_report.md
    - docs/v7_51g_read_only_adapter_fixture_regression_result.yaml
    - docs/v7_51h_read_only_adapter_implementation_closeout.md
    - docs/v7_51h_read_only_adapter_implementation_closeout.yaml

  state:
    - README.md
    - .agent_board/CHECKPOINT.md
```

## 完成门

```yaml
completion_gates:
  adapter_runtime_implemented: true
  schema_validation: pass
  security_gate_validation: pass
  fixture_regression: pass
  no_vcp_call: true
  no_vcpchat_bridge_call: true
  no_memory_write: true
  no_image_binary_read: true
```

## Commit

```bash
git commit -m "test: implement v7.51d-v7.51h read-only adapter validation pack"
```

## 停止点

commit 后停止。  
不要 push，除非单独授权。  
不要调用真实 VCP。

---

# LT-04 — v7.50e–v7.50h VCPChat Surface Real Check Track

## 目标

从静态 surface fixture 走向真实 VCPChat surface 检查，但必须先规划，再执行。  
这条任务靠近 Electron / VCPChat 边界，不能直接和 adapter 实现混在一起。

```yaml
long_task_id: LT-04
phase_range: v7.50e-v7.50h
task_type: real_ui_boundary_planning_then_A5_execution
requires_prior:
  - LT-01
```

## 包含阶段

```yaml
included:
  v7_50e:
    name: real VCPChat surface check planning
    status: already_planned_in_LT_01
  v7_50f:
    name: real VCPChat surface fixture validation planning
  v7_50g:
    name: real VCPChat review console surface check A5
  v7_50h:
    name: VCPChat surface check closeout
```

## 真实执行前必须确认

```yaml
preflight_required:
  - VCPChat repo available
  - exact launch command defined
  - no secrets in URL or logs
  - no remote-debug unless explicitly authorized
  - no memory write button rendered
  - no image binary rendered
  - no production_approved claim rendered
```

## 明确风险

VCPChat / Electron 侧曾在审计中被标出若干边界风险：query string 传密钥、preload/API 暴露、桌面 widget 能力、直接工具面等。  
因此真实 surface check 不能跳过 planning 和 A5。

## 完成门

```yaml
completion_gates:
  electron_started_only_if_authorized: true
  vcpchat_bridge_call_only_if_authorized: true
  render_mode: read_only
  forbidden_actions_not_rendered: true
  image_binary_not_rendered: true
  private_absolute_path_not_rendered: true
  memory_write_action_not_rendered: true
```

## 单独授权

LT-04 的真实执行阶段不能并入其他长任务。  
它必须单独 A5 或明确授权包。

---

# LT-05 — v7.52a–v7.52f VCPToolBox Read-only Ingestion Planning + Mock

## 目标

让 VCPToolBox 能理解 Agent Image Lab 的 read-only evidence refs。  
先做 docs 和 mock，不碰真实 VCPToolBox。

```yaml
long_task_id: LT-05
phase_range: v7.52a-v7.52f
task_type: docs_and_mock
requires_prior:
  - LT-03
```

## 包含阶段

```yaml
included:
  v7_52a:
    name: VCPToolBox read-only ingestion planning
  v7_52b:
    name: VCP package schema mapping
  v7_52c:
    name: VCPToolBox no-write bridge contract
  v7_52d:
    name: VCPToolBox mock ingestion validation
  v7_52e:
    name: VCPToolBox real read-only dry-run A5 planning
  v7_52f:
    name: VCPToolBox read-only ingestion closeout
```

## 不包含

```yaml
excluded:
  - real VCPToolBox call
  - VCPToolBox repo code modification
  - plugin implementation
  - DailyNote write
  - memory write
```

## 建议交付物

```yaml
deliverables:
  docs:
    - docs/archive/phases/v7/v7_52a_vcptoolbox_read_only_ingestion_planning.md
    - docs/archive/phases/v7/v7_52b_vcp_package_schema_mapping.md
    - docs/archive/phases/v7/v7_52c_vcptoolbox_no_write_bridge_contract.md
    - docs/archive/phases/v7/v7_52e_vcptoolbox_real_read_only_dry_run_a5_planning.md
    - docs/archive/phases/v7/v7_52f_vcptoolbox_read_only_ingestion_closeout.md

  mock:
    - scripts/validate_vcptoolbox_read_only_ingestion_mock.js
    - docs/archive/phases/v7/v7_52d_vcptoolbox_mock_ingestion_validation_report.md
    - docs/archive/phases/v7/v7_52d_vcptoolbox_mock_ingestion_validation_result.yaml
```

## 完成门

```yaml
completion_gates:
  vcptoolbox_ingestion_contract_defined: true
  package_schema_mapping_defined: true
  no_write_contract_defined: true
  mock_ingestion_validation: pass
  real_vcptoolbox_call_performed: false
  memory_write_performed: false
```

## Commit

```bash
git commit -m "docs: add v7.52a-v7.52f VCPToolBox read-only ingestion pack"
```

---

# LT-06 — v7.52g VCPToolBox Real Read-only Dry-run A5

## 目标

执行一次真实 VCPToolBox read-only dry-run。  
只读，不写 memory，不写 DailyNote。

```yaml
long_task_id: LT-06
phase_range: v7.52g
task_type: real_read_only_A5
requires_prior:
  - LT-05
requires_independent_A5: true
```

## 只允许

```yaml
allowed:
  - one read-only VCPToolBox call
  - text_only_refs payload
  - no write intent
  - no memory write
  - no dailynote write
```

## 失败处理

如果 VCPToolBox 调用失败：

```yaml
failure_policy:
  retry_allowed: false
  write_allowed: false
  report_failure: true
  stop: true
```

## 完成门

```yaml
completion_gates:
  real_vcptoolbox_read_only_call_performed: true
  returned_refs_only: true
  memory_write_performed: false
  dailynote_write_performed: false
  image_binary_returned: false
```

---

# LT-07 — v7.53a–v7.53e E2E Read-only Integration Fixture + Audit

## 目标

完成端到端只读链路的本地 fixture 和安全审计。

```text
VCPChat Review Console
→ VCPToolBox Read-only Ingestion
→ Agent Image Lab Read-only Adapter
→ text-only refs
→ safe surface
```

```yaml
long_task_id: LT-07
phase_range: v7.53a-v7.53e
task_type: local_e2e_fixture_and_audit
requires_prior:
  - LT-03
  - LT-05
```

## 包含阶段

```yaml
included:
  v7_53a:
    name: E2E read-only integration plan
  v7_53b:
    name: E2E fixture validation
  v7_53c:
    name: E2E security audit
  v7_53d:
    name: E2E failure-mode validation
  v7_53e:
    name: E2E read-only closeout
```

## 完成门

```yaml
completion_gates:
  e2e_fixture_validation: pass
  e2e_security_audit: pass
  failure_modes_blocked: true
  payload_type: text_only_refs
  image_binary_included: false
  secrets_included: false
  memory_write_performed: false
  dailynote_write_performed: false
```

## Commit

```bash
git commit -m "test: add v7.53a-v7.53e E2E read-only integration fixture pack"
```

---

# LT-08 — v7.53f E2E Real Read-only Dry-run A5

## 目标

执行一次端到端真实只读 dry-run。  
这是 read-only integration 的真正试车。

```yaml
long_task_id: LT-08
phase_range: v7.53f
task_type: real_e2e_read_only_A5
requires_independent_A5: true
requires_prior:
  - LT-07
```

## 不允许

```yaml
forbidden:
  - memory_write
  - dailynote_write
  - image_generation
  - image_binary_transfer
  - production_approved_claim
  - reopen_closed_no_memory_write_case
```

## 完成门

```yaml
completion_gates:
  e2e_real_read_only_call: pass
  vcpchat_surface_safe: true
  vcptoolbox_ingestion_safe: true
  adapter_response_safe: true
  memory_write_performed: false
```

---

# LT-09 — v7.54a–v7.54d Read-only Integration Release Candidate

## 目标

把只读接入链路封为 release candidate。  
这一步不写代码，不调用真实服务，只做收口和治理文档。

```yaml
long_task_id: LT-09
phase_range: v7.54a-v7.54d
task_type: docs_closeout
```

## 交付物

```yaml
deliverables:
  - docs/v7_54a_read_only_integration_release_candidate.md
  - docs/v7_54b_read_only_integration_risk_register.md
  - docs/v7_54c_read_only_integration_operational_sop.md
  - docs/v7_54d_read_only_integration_closeout.yaml
```

## 完成门

```yaml
completion_gates:
  read_only_bridge_ready: true
  vcpchat_surface_ready: true
  vcptoolbox_ingestion_ready: true
  e2e_read_only_validated: true
  memory_write_ready: false
```

---

# LT-10 — v7.60–v7.64 New Production Candidate With VCP Read-only Surface

## 目标

开一张新的 production candidate，用已经建立的 VCP read-only surface 去展示生产证据链。

不要重开 production_candidate_001。

```yaml
long_task_id: LT-10
phase_range: v7.60-v7.64
task_type: new_production_image_chain
requires_independent_A5_for_generation: true
```

## 包含阶段

```yaml
included:
  v7_60:
    name: new production candidate 002 plan
  v7_61:
    name: one-shot production candidate 002 A5
  v7_62:
    name: human review
  v7_63:
    name: VCP read-only surface case display
  v7_64:
    name: production candidate 002 closeout
```

## 生成规则

```yaml
generation_policy:
  api_calls_allowed: 1
  images_allowed: 1
  retry_allowed: false
  batch_generation_allowed: false
  watermark_requested: false
  independent_A5_required: true
```

## 进入 memory path 的前置条件

```yaml
memory_path_preconditions:
  asset_status: accepted_candidate
  memory_suitability: true
  human_review_completed: true
  commercial_usability: pass
  no_watermark: true
  no_forbidden_text_or_logo: true
```

如果只是 `accepted_with_minor_warning`，默认不进入 memory write。

---

# LT-11 — v7.70–v7.76 Memory Write Path

## 目标

只有当新的 production candidate 被判定为 `memory_suitability: true` 时，才进入 memory write path。

```yaml
long_task_id: LT-11
phase_range: v7.70-v7.76
task_type: memory_write_governance_and_A5
default_state: blocked
```

## 包含阶段

```yaml
included:
  v7_70:
    name: memory write eligibility plan
  v7_71:
    name: memory_delta candidate draft
  v7_72:
    name: DailyNote / VCP memory authorization package
  v7_73:
    name: canonical write planning
  v7_74:
    name: one-shot VCP memory write A5
  v7_75:
    name: canonical verification
  v7_76:
    name: memory write closeout
```

## 不可破坏规则

```yaml
memory_write_laws:
  memory_write_without_A5: forbidden
  dailynote_write_without_A5: forbidden
  image_binary_written_to_memory: forbidden
  raw_payload_written_to_memory: forbidden
  plugin_success_is_not_enough: true
  canonical_file_verified_required: true
  hash_match_required_if_available: true
```

## 成功状态

```yaml
memory_write_success:
  write_requested: true
  writer_returned_success: true
  canonical_file_verified: true
  memory_write_complete: true
```

---

# LT-12 — v7.90–v7.99 Final VCP Integration Closeout

## 目标

收束完整接入 VCP 的最终状态。

```yaml
long_task_id: LT-12
phase_range: v7.90-v7.99
task_type: final_closeout
```

## 包含阶段

```yaml
included:
  v7_90:
    name: integration final audit
  v7_91:
    name: read-only bridge final closeout
  v7_92:
    name: VCPChat surface final closeout
  v7_93:
    name: VCPToolBox ingestion final closeout
  v7_94:
    name: production pipeline final closeout
  v7_95:
    name: memory write policy final closeout
  v7_99:
    name: Agent Image Lab × VCP integration final status
```

## 最终状态文件

```yaml
deliverables:
  - docs/v7_99_agent_image_lab_vcp_integration_final_closeout.md
  - docs/v7_99_agent_image_lab_vcp_integration_final_status.yaml
```

## 最终状态

```yaml
final_status:
  read_only_bridge_ready: true
  vcpchat_review_console_ready: true
  vcptoolbox_read_only_ingestion_ready: true
  e2e_read_only_integration_ready: true
  production_candidate_pipeline_ready: true
  memory_write_path_defined: true
  memory_write_default_blocked: true
  canonical_verification_required: true
```

---

# 4. 推荐执行顺序

## 立即下一步

```text
LT-02 — v7.51c Read-only Bridge Adapter Implementation Planning
```

理由：  
v7.50d–v7.51b 已经定义了 evidence index 和 adapter skeleton。  
下一步应该先把 implementation planning 做扎实，不要直接写 runtime。

## 中期顺序

```text
LT-02 → LT-03 → LT-05 → LT-07 → LT-09
```

这会完成完整只读接入的本地和 mock 闭环。

## 真实接入顺序

```text
LT-04 → LT-06 → LT-08
```

这些都需要单独授权，因为它们会接近真实 VCPChat / VCPToolBox / E2E 边界。

## 生产图与记忆顺序

```text
LT-10 → LT-11 → LT-12
```

必须在 read-only integration 站稳之后再做。

---

# 5. 每个长任务的通用执行模板

```text
继续 JENN2046/agent-image-lab。

执行 Long Task: <LONG_TASK_ID> <LONG_TASK_NAME>。

当前远端基线：
<BASELINE_COMMIT>

严格遵守：
- 不提交 runs/ 或图片文件
- 不调用 VCP / VCPChat bridge，除非本长任务明确授权
- 不启动 Electron / remote-debug / CDP，除非本长任务明确授权
- 不写 DailyNote / VCP memory
- 不生成图片，除非本长任务明确为 A5 generation
- 不修改 production_candidate_001 closed_no_memory_write 决策
- 完成后 commit，不 push
- 输出收尾报告并停止
```

---

# 6. Push 模板

每个长任务 commit 后，用独立 push 指令。

```text
继续 JENN2046/agent-image-lab。

当前本地已完成 Long Task commit，但尚未 push。

本次只授权 push 当前已有 commit：
<SHORT_HASH>

commit message:
<COMMIT_MESSAGE>

严格禁止：
- 不要新建 commit
- 不要 amend
- 不要修改文件
- 不要进入下一阶段

push 前确认：
1. git status --short --branch
2. git log --oneline origin/master..HEAD
3. git rev-parse HEAD
4. git show --name-status --oneline --no-renames HEAD
5. git diff --check HEAD~1..HEAD
6. node scripts/validate_local_commit_scope.js

全部通过后：
git push

push 后验证：
1. git status --short --branch
2. git rev-parse HEAD
3. git rev-parse origin/master
4. git ls-remote origin refs/heads/master

完成后停止。
```

---

# 7. 重要判断

这份 v2 已经把后续任务按长任务编排。

但它仍然故意没有把以下事情混入长任务：

```yaml
must_remain_separate:
  - real VCPToolBox call
  - real VCPChat bridge call
  - Electron launch
  - remote-debug
  - CDP
  - image generation
  - memory write
  - DailyNote write
```

原因很简单：这些不是“多做几步”的问题，而是系统边界。  
一旦越界，错误就会从纸面进入真实世界。

---

# 8. 下一道门

```text
LT-02 — v7.51c Read-only Bridge Adapter Implementation Planning
```

这一步是把 adapter 的钢筋图画清楚。  
还不是浇筑混凝土。
