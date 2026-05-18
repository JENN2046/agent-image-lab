# Agent Image Lab × VCP 完整接入落地计划

**项目**: `JENN2046/agent-image-lab`  
**计划版本**: v1.0  
**当前远端基线**: `0543585a9ca53dad7656ed42b5906d5847b08da9`  
**当前阶段**: `v7.50d VCPChat Review Console Surface Planning` 已完成并推送  
**当前原则**: 先只读、再显示、再 adapter、再真实桥接、最后才考虑 memory write。  
**总判断**: 现在不是继续造图，而是把 Agent Image Lab 安全接入 VCP 的只读链路做成可验证、可封存、可回滚的生产级通道。

---

## 0. 当前状态快照

### 0.1 已完成链路

```yaml
completed:
  prompt_package:
    v3: stable_candidate

  production_candidate_001:
    generated_phase: v7_52
    review_phase: v7_53
    asset_status: accepted_with_minor_warning
    commercial_usability: pass
    memory_suitability: false
    final_case_state: closed_no_memory_write

  memory_write_decision:
    v7_54_memory_delta_candidate: draft_only
    v7_55_authorization_package: prepared_not_granted
    v7_56_closeout: skip_memory_write

  read_only_bridge_validation:
    v7_50a_schema_validation: pass
    v7_50b_mock_payload_validation: pass
    v7_50c_repository_local_dry_run: pass

  vcpchat_surface:
    v7_50d_surface_planning: completed
```

### 0.2 当前硬边界

```yaml
hard_boundaries:
  image_binary_committed: false
  runs_committed: false
  vcp_call_performed: false
  vcpchat_bridge_call_performed: false
  dailynote_write_performed: false
  vcp_memory_write_performed: false
  current_case_state: closed_no_memory_write
```

当前这张 `production_candidate_001` 的结论已经定死：

```yaml
production_candidate_001:
  can_be_used_as_repository_evidence: true
  can_be_used_for_bridge_testing: true
  can_be_written_to_vcp_memory: false
  can_be_reopened_for_memory_write_without_override: false
```

它是证据，不是记忆。  
它是路标，不是路本身。

---

## 1. 最终接入目标

完整接入 VCP，不是把图片写进 VCP memory，而是形成四层能力：

```yaml
vcp_integration_final_state:
  layer_1_read_only_evidence_bridge:
    status: ready
    purpose: VCP / VCPChat can safely read Agent Image Lab text-only evidence refs

  layer_2_vcpchat_review_console_surface:
    status: ready
    purpose: VCPChat can display read-only bridge output without leaking binary, secrets, raw payloads, or write actions

  layer_3_vcptoolbox_read_only_ingestion:
    status: ready
    purpose: VCPToolBox can consume Agent Image Lab case refs without writing memory

  layer_4_memory_write_path:
    status: defined_but_blocked_by_default
    purpose: memory write is possible only after independent A5, accepted human review, and canonical verification
```

### 1.1 不变铁律

```yaml
non_negotiable_rules:
  no_image_binary_in_git: true
  no_runs_commit: true
  no_memory_write_without_independent_A5: true
  no_dailynote_write_without_independent_A5: true
  no_vcp_call_without_explicit_authorization: true
  no_vcpchat_bridge_call_without_explicit_authorization: true
  no_electron_launch_without_explicit_authorization: true
  no_reopen_closed_no_memory_write_case_without_human_override: true
```

---

## 2. 总路线图

```text
Phase A — Surface + Evidence + Adapter Planning
  ↓
Phase B — Local Adapter Implementation + Validation
  ↓
Phase C — VCPToolBox Read-only Ingestion Planning + Mock
  ↓
Phase D — End-to-end Read-only Dry-run
  ↓
Phase E — New Production Candidate With VCP Read-only Surface
  ↓
Phase F — Memory Write Eligibility Path, blocked by default
  ↓
Phase G — Full VCP Integration Closeout
```

### 2.1 阶段完成定义

```yaml
done_means:
  read_only_bridge_done:
    - local schema validation passed
    - mock payload validation passed
    - repository-local dry-run passed
    - adapter implementation tested locally
    - VCPToolBox read-only ingestion dry-run passed

  vcpchat_surface_done:
    - surface planning completed
    - static fixture execution passed
    - real surface check planned
    - real VCPChat surface check executed under explicit authorization
    - no forbidden UI action rendered

  full_read_only_integration_done:
    - VCPChat -> VCPToolBox -> Agent Image Lab chain can return text-only refs
    - no memory write
    - no image binary
    - no secrets
    - no raw payloads
    - no private absolute paths

  memory_integration_done:
    - only after a new production candidate is accepted and marked memory_suitability=true
    - memory_delta drafted
    - authorization package granted
    - one-shot memory write A5 executed
    - canonical verification completed
```

---

# 3. Long Task 1 — v7.50d–v7.51b Read-only VCP Integration Pack

## 3.1 目标

把当前能安全一起做的内容收敛为一个长任务：

```yaml
long_task_1:
  name: v7.50d-v7.51b Read-only VCP Integration Pack
  nature: local_static_fixture_plus_docs
  can_start_now: true
```

## 3.2 包含阶段

```yaml
included:
  - v7.50d VCPChat review console surface static fixture execution
  - v7.50e real VCPChat surface check planning
  - v7.51a Agent Image Lab read-only evidence index spec
  - v7.51b read-only bridge adapter skeleton planning
```

## 3.3 明确排除

```yaml
excluded:
  - real VCPChat launch
  - real Electron launch
  - remote-debug
  - CDP
  - real VCPToolBox call
  - real VCPChat bridge call
  - adapter runtime implementation
  - memory write
  - dailynote write
  - image generation
  - image binary read
```

## 3.4 交付物

```yaml
deliverables:
  static_surface_fixture:
    - scripts/validate_vcpchat_review_console_surface_static_fixture.js
    - docs/archive/phases/v7/v7_50d_vcpchat_review_console_surface_static_fixture_execution_report.md
    - docs/v7_50d_vcpchat_review_console_surface_static_fixture_result.yaml

  v7_50e_planning:
    - docs/v7_50e_real_vcpchat_surface_check_planning.md
    - docs/archive/phases/v7/v7_50e_real_vcpchat_surface_check_safety_gates.md

  v7_51a_evidence_index:
    - docs/archive/phases/v7/v7_51a_agent_image_lab_read_only_evidence_index_spec.md
    - docs/archive/phases/v7/v7_51a_agent_image_lab_read_only_evidence_index.yaml

  v7_51b_adapter_skeleton:
    - docs/archive/phases/v7/v7_51b_read_only_bridge_adapter_skeleton_plan.md
    - docs/archive/phases/v7/v7_51b_read_only_bridge_adapter_contract.yaml

  state_files:
    - README.md
    - .agent_board/CHECKPOINT.md
```

## 3.5 完成门

```yaml
completion_gates:
  surface_static_fixture_result: pass
  vcp_call_performed: false
  vcpchat_bridge_call_performed: false
  electron_started: false
  memory_write_performed: false
  dailynote_write_performed: false
  image_binary_read: false
  production_candidate_001_closeout_modified: false
```

## 3.6 Commit

```bash
git commit -m "test: add v7.50d-v7.51b read-only integration pack"
```

## 3.7 停止点

commit 后停止。  
不要 push，除非单独授权。  
不要进入 adapter runtime implementation。

---

# 4. Long Task 2 — v7.51c–v7.51f Local Read-only Adapter Implementation

## 4.1 目标

在 Agent Image Lab 仓库内实现一个本地只读 adapter。  
它不是 VCPToolBox 插件，也不是 VCPChat bridge。  
它只是本仓库的本地 read-only adapter runtime。

```yaml
long_task_2:
  name: v7.51c-v7.51f Local Read-only Adapter Implementation
  nature: local_code_plus_validation
  can_start_after: Long Task 1 pushed
```

## 4.2 包含阶段

```yaml
included:
  - v7.51c local read-only adapter implementation
  - v7.51d adapter schema validation execution
  - v7.51e adapter security gate validation execution
  - v7.51f adapter implementation closeout
```

## 4.3 允许实现的能力

```yaml
adapter_capabilities:
  input:
    - read-only request
    - case_id
    - requested_resources
  output:
    - text_only_refs
    - repository_relative_paths_only
    - status: ok | blocked | not_found | failed
  forbidden:
    - image_binary
    - file_full_content_by_default
    - raw_payloads
    - secrets
    - private_absolute_paths
    - memory_write
    - dailynote_write
```

## 4.4 可能交付物

```yaml
deliverables:
  adapter_runtime:
    - scripts/agent_image_lab_read_only_adapter.js

  validators:
    - scripts/validate_agent_image_lab_read_only_adapter_schema.js
    - scripts/validate_agent_image_lab_read_only_adapter_security_gates.js

  reports:
    - docs/v7_51d_read_only_adapter_schema_validation_report.md
    - docs/v7_51d_read_only_adapter_schema_validation_result.yaml
    - docs/v7_51e_read_only_adapter_security_gate_validation_report.md
    - docs/v7_51e_read_only_adapter_security_gate_validation_result.yaml
    - docs/v7_51f_read_only_adapter_closeout.md
```

## 4.5 完成门

```yaml
completion_gates:
  adapter_runtime_implemented: true
  adapter_returns_text_only_refs: true
  adapter_blocks_image_binary: true
  adapter_blocks_secrets: true
  adapter_blocks_write_intent: true
  adapter_blocks_private_absolute_paths: true
  vcp_call_performed: false
  vcpchat_bridge_call_performed: false
```

## 4.6 注意

这一步可以写本仓库代码。  
但它仍然不能调用真实 VCP，也不能启动 VCPChat。

---

# 5. Long Task 3 — v7.52a–v7.52f VCPToolBox Read-only Ingestion

## 5.1 目标

让 VCPToolBox 能理解 Agent Image Lab 返回的 read-only evidence refs。

这一步开始触碰 VCPToolBox 接入边界。  
如果当前工作区没有 VCPToolBox 仓库，不能伪造实现，只能先做 docs / contract / mock。

```yaml
long_task_3:
  name: v7.52a-v7.52f VCPToolBox Read-only Ingestion
  nature: docs_then_mock_then_real_read_only_A5
  requires_vcptoolbox_repo_access_for_real_code: true
```

## 5.2 包含阶段

```yaml
included:
  - v7.52a VCPToolBox read-only ingestion planning
  - v7.52b VCP package schema mapping
  - v7.52c VCPToolBox no-write bridge contract
  - v7.52d VCPToolBox mock ingestion validation
  - v7.52e VCPToolBox real read-only dry-run A5
  - v7.52f VCPToolBox read-only closeout
```

## 5.3 VCPToolBox 接入原则

```yaml
vcptoolbox_ingestion_policy:
  mode: read_only
  accepted_payload: text_only_refs
  memory_write: false
  dailynote_write: false
  plugin_success_is_not_memory_success: true
  raw_payloads_allowed: false
  image_binary_allowed: false
```

## 5.4 交付物

```yaml
deliverables:
  docs:
    - docs/archive/phases/v7/v7_52a_vcptoolbox_read_only_ingestion_planning.md
    - docs/archive/phases/v7/v7_52b_vcp_package_schema_mapping.md
    - docs/archive/phases/v7/v7_52c_vcptoolbox_no_write_bridge_contract.md

  mock:
    - scripts/validate_vcptoolbox_read_only_ingestion_mock.js
    - docs/archive/phases/v7/v7_52d_vcptoolbox_mock_ingestion_validation_report.md
    - docs/archive/phases/v7/v7_52d_vcptoolbox_mock_ingestion_validation_result.yaml

  real_read_only:
    - docs/v7_52e_vcptoolbox_real_read_only_dry_run_a5.md
    - docs/v7_52f_vcptoolbox_read_only_closeout.md
```

## 5.5 完成门

```yaml
completion_gates:
  vcptoolbox_read_only_ingestion_ready: true
  real_vcptoolbox_call_performed_only_if_A5: true
  memory_write_performed: false
  dailynote_write_performed: false
```

---

# 6. Long Task 4 — v7.53a–v7.53e End-to-end Read-only Integration

## 6.1 目标

完成端到端只读链路：

```text
VCPChat Review Console
→ VCPToolBox read-only ingestion
→ Agent Image Lab read-only adapter
→ text-only refs response
→ VCPChat safe surface
```

## 6.2 包含阶段

```yaml
included:
  - v7.53a E2E read-only integration plan
  - v7.53b E2E fixture validation
  - v7.53c E2E read-only dry-run A5
  - v7.53d E2E security audit
  - v7.53e E2E read-only closeout
```

## 6.3 完成门

```yaml
completion_gates:
  vcpchat_to_vcptoolbox_to_agent_image_lab: pass
  payload_type: text_only_refs
  image_binary_included: false
  secrets_included: false
  write_performed: false
  memory_write_performed: false
  dailynote_write_performed: false
  private_absolute_path_included: false
```

## 6.4 输出状态

```yaml
vcp_read_only_integration_ready: true
vcp_write_integration_ready: false
```

这一点很重要。  
读通了，不等于写通了。  
看到证据，不等于沉淀记忆。

---

# 7. Long Task 5 — v7.60–v7.64 New Production Candidate With VCP Read-only Surface

## 7.1 目标

开一张新的 production candidate。  
不要重开 `production_candidate_001` 的 memory write。

```yaml
long_task_5:
  name: v7.60-v7.64 New Production Candidate With VCP Read-only Surface
  nature: new_production_image_chain
  requires_A5_for_generation: true
```

## 7.2 包含阶段

```yaml
included:
  - v7.60 new production candidate 002 plan
  - v7.61 one-shot production candidate A5
  - v7.62 human review
  - v7.63 VCP read-only surface case display
  - v7.64 production candidate closeout
```

## 7.3 生产图规则

```yaml
generation_policy:
  api_calls_allowed: 1
  images_allowed: 1
  retry_allowed: false
  batch_generation_allowed: false
  watermark_requested: false
  independent_A5_required: true
```

## 7.4 如果 candidate 通过

只有满足以下条件，才允许进入 memory path：

```yaml
memory_path_preconditions:
  asset_status: accepted_candidate
  memory_suitability: true
  human_review_completed: true
  no_watermark: true
  no_forbidden_text_or_logo: true
  commercial_usability: pass
```

如果只是 `accepted_with_minor_warning`，默认仍不写 memory。

---

# 8. Long Task 6 — v7.70–v7.76 Memory Write Path

## 8.1 目标

把未来真正适合记忆的 production case 写入 VCP memory。  
这是最高风险层。默认关闭。

```yaml
long_task_6:
  name: v7.70-v7.76 Memory Write Path
  nature: docs_then_A5_real_write_then_verification
  default_state: blocked
```

## 8.2 包含阶段

```yaml
included:
  - v7.70 memory write eligibility plan
  - v7.71 memory_delta candidate draft
  - v7.72 DailyNote / VCP memory authorization package
  - v7.73 canonical write planning
  - v7.74 one-shot VCP memory write A5
  - v7.75 canonical verification
  - v7.76 memory write closeout
```

## 8.3 记忆写入铁律

```yaml
memory_write_laws:
  memory_write_without_A5: forbidden
  dailynote_write_without_A5: forbidden
  plugin_success_is_not_enough: true
  canonical_file_verified_required: true
  hash_match_required_if_available: true
  final_status_must_distinguish:
    - write_requested
    - writer_returned_success
    - canonical_file_verified
    - memory_write_complete
```

## 8.4 成功标准

```yaml
memory_write_success:
  daily_note_write_performed: true
  vcp_memory_write_performed: true
  canonical_location_verified: true
  hash_verified: true
  image_binary_written_to_memory: false
  raw_payload_written_to_memory: false
```

---

# 9. 必须分开的任务

以下任务不能并入长任务，必须单独授权：

## 9.1 真实 VCP / VCPChat 调用

```yaml
must_be_separate:
  - real VCPToolBox call
  - real VCPChat bridge call
  - Electron launch
  - remote-debug
  - CDP
```

原因：一旦进入真实 UI / bridge，就可能触碰本地窗口、端口、密钥、日志、路径和插件面。

## 9.2 真实图片生成

```yaml
must_be_separate:
  - any image generation
  - any retry
  - any batch generation
```

原因：会消耗 API、产生图片资产、改变生产证据链。

## 9.3 真实 memory write

```yaml
must_be_separate:
  - DailyNote write
  - VCP memory write
  - TopicMemo write
  - LightMemo / DeepMemo write candidate
```

原因：写错就是历史，不是草稿。

---

# 10. 推荐执行顺序

## 10.1 近期三步

```text
1. v7.50d–v7.51b Read-only VCP Integration Long Task
2. push long task
3. v7.51c–v7.51f Local Read-only Adapter Implementation
```

## 10.2 中期三步

```text
4. v7.52a–v7.52f VCPToolBox Read-only Ingestion
5. v7.53a–v7.53e End-to-end Read-only Integration
6. v7.53e Read-only Integration Closeout
```

## 10.3 后期三步

```text
7. v7.60–v7.64 New Production Candidate With VCP Read-only Surface
8. v7.70–v7.76 Memory Write Path, only if eligible
9. Full VCP Integration Final Closeout
```

---

# 11. Full Closeout Definition

最终完整接入 VCP 的收口文件建议命名：

```text
docs/v7_99_agent_image_lab_vcp_integration_final_closeout.md
docs/v7_99_agent_image_lab_vcp_integration_final_status.yaml
```

## 11.1 final_status.yaml 应包含

```yaml
agent_image_lab_vcp_integration_final_status:
  schema_version: v1
  phase: v7_99
  read_only_bridge_ready: true
  vcpchat_review_console_ready: true
  vcptoolbox_read_only_ingestion_ready: true
  e2e_read_only_integration_ready: true

  production_candidate_pipeline_ready: true

  memory_write_path_defined: true
  memory_write_default_blocked: true
  memory_write_requires_independent_A5: true
  canonical_verification_required: true

  current_production_candidate_001:
    case_state: closed_no_memory_write
    memory_write_skipped: true

  forbidden_by_default:
    - image_binary_commit
    - runs_commit
    - memory_write_without_A5
    - dailynote_write_without_A5
    - VCP_call_without_authorization
    - VCPChat_bridge_call_without_authorization
    - Electron_launch_without_authorization
```

## 11.2 最终一句话

```text
Agent Image Lab 已完成 VCP 只读接入闭环；生产证据可被安全展示，长期记忆写入仍受 A5、人工审图和 canonical verification 严格控制。
```

---

# 12. 下一步可直接执行的长任务

建议下一步执行：

```text
v7.50d–v7.51b Read-only VCP Integration Long Task
```

这是当前还能安全合并推进的最大包。  
它不碰真实 VCP、不启动 VCPChat、不写 memory、不生成图。  
再往后就进入 adapter runtime 和真实桥接边界，必须拆开。

---

## 13. 给执行代理的短指令模板

```text
继续 JENN2046/agent-image-lab。

执行 v7.50d–v7.51b Read-only VCP Integration Long Task。

严格按计划文件执行：
- 只做 static fixture + docs-only planning
- 不调用 VCP
- 不调用 VCPChat bridge
- 不启动 Electron
- 不写 DailyNote / VCP memory
- 不生成图片
- 不读取图片二进制
- 不修改 production candidate 001 closeout 决策
- 完成后 commit，不 push

commit message:
test: add v7.50d-v7.51b read-only integration pack

完成后输出收尾报告并停止。
```
