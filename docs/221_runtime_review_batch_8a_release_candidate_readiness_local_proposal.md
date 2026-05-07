# Runtime Review Batch 8A Local Release Candidate Readiness Proposal

本文记录 Runtime Review Console follow-up 的 Batch 8A：把 2A/2B/2C 到 5B/6B/7A 的本地收束结果整合为一份“本地 release candidate 提交提案”，并固定提交范围；仅做本地文档、校验与索引更新，不执行真实执行动作、不执行版本动作。

当前状态：

```text
local_runtime_review_batch_8a_release_candidate_readiness_proposal_ready
```

## Scope Boundary

Batch 8A 的边界保持 A4，本地-only：

- 允许：
  - 文档/README/MANIFEST/RELEASE_NOTES/ROADMAP 更新
  - 运行时原型与验证脚本状态收束（不改 prototype 行为）
  - `agent_board` 的状态、handoff、checkpoint、validation_log 对齐
  - 本地可执行命令链的闭环记录
- 禁止：
  - 真实 VCPChat / VCPToolBox 读取
  - 真实 manifest / env / config / log / endpoint / secret / private path 读取
  - 插件/API/DailyNote/VCP memory/image 动作
  - commit/tag/push/PR/release
  - source root 外文件写入

本地目标：生成一份可执行的 `batch 8A 提交范围提案`，为下一次用户授权后的版本动作提供清晰边界。

## Batch 8A Deliverables

### 1) 文档收束（Local Proposal）

- `docs/220_runtime_review_batch_5b_6b_7a_local_gate_archive.md`：保持“真实执行/写入继续阻断”边界。
- `docs/216_runtime_review_long_task_delivery_plan.md`：更新 baseline 为 Batch 8A 本地提案完成状态，并明确 8A 本地提案为当前阶段结果。
- `README.md`：补充 Runtime Review Batch 5B/6B/7A 与 8A 路径、执行边界、索引映射。
- `MANIFEST.md`：补充 8A 已完成的本地收束与提案边界声明。
- `RELEASE_NOTES.md`：新增 Batch 8A 本地 RC proposal 与提交范围条目。
- `docs/00_project_roadmap.md`：更新里程碑为 8A 关闭状态，移除历史重复未完成项。
- `tests/validation_checklist.md`：新增 Batch 8A 检查清单（无副作用、验收与脚本要求）。
- `docs/221_runtime_review_batch_8a_release_candidate_readiness_local_proposal.md`：本提案文档（唯一新文档）。

### 2) Runtime Prototype / Validator 收束

- `scripts/validate_local_commit_scope.js`
  - 放行 8A 新提案文档（`docs/221...`）到本地提交范围白名单。
- `scripts/validate_mvp.ps1`
  - 与本提案同步，更新脚本白名单与运行时验收列表（保持 A4 本地边界）。
- `scripts/validate_runtime_guard_unit.js`
- `scripts/validate_runtime_prototype_smoke.js`
- `scripts/validate_runtime_delivery_surface.js`
- `scripts/validate_agent_board_state.js`
- 说明：Batch 8A 采用**当前已有 prototype/guard/smoke**行为为收束底线，不新增生产执行逻辑。

### 3) Agent Board 收束

- `.agent_board/RUN_STATE.md`：更新当前阶段为“Batch 8A release-candidate readiness（本地）”、当前任务与最近验证记录。
- `.agent_board/HANDOFF.md`：更新 handoff 摘要、历史里程与阻塞点。
- `.agent_board/TASK_QUEUE.md`：把 Batch 8A 加入当前进行中的本地任务/已完成项。
- `.agent_board/CHECKPOINT.md`：新增本地安全基线里程记录。
- `.agent_board/VALIDATION_LOG.md`：新增 Batch 8A 验证记录项。

## Planned Commit Scope (Local Proposal)

### 预期提交范围（仅本地，待用户明确版本动作授权后执行）

```text
README.md
MANIFEST.md
RELEASE_NOTES.md
docs/00_project_roadmap.md
docs/215_runtime_review_followup_requirements_audit.md
docs/216_runtime_review_long_task_delivery_plan.md
docs/217_runtime_review_batch_3a_3b_3c_local_stabilization.md
docs/218_runtime_review_batch_4a_bridge_mock_roundtrip.md
docs/219_runtime_review_batch_4b_5a_6a_local_readiness.md
docs/220_runtime_review_batch_5b_6b_7a_local_gate_archive.md
docs/221_runtime_review_batch_8a_release_candidate_readiness_local_proposal.md
tests/validation_checklist.md
review_console/runtime_prototype/README.md
review_console/runtime_prototype/FIELD_MAPPING.md
review_console/runtime_prototype/app.js
review_console/runtime_prototype/host_bridge_mock.js
review_console/runtime_prototype/index.html
review_console/runtime_prototype/runtime_guard.js
review_console/runtime_prototype/styles.css
scripts/validate_local_commit_scope.js
scripts/validate_mvp.ps1
scripts/validate_runtime_guard_unit.js
scripts/validate_runtime_prototype_smoke.js
scripts/validate_runtime_delivery_surface.js
scripts/validate_agent_board_state.js
.agent_board/CHECKPOINT.md
.agent_board/HANDOFF.md
.agent_board/RUN_STATE.md
.agent_board/TASK_QUEUE.md
.agent_board/VALIDATION_LOG.md
```

> 说明：不在本地提案内提交版本动作（commit/tag/push/PR/release）文件与结果，除非用户单独授权。

## Batch 8A Acceptance

- [x] Runtime Review long task plan baseline 已更新为 8A 本地收束状态。
- [x] 本地提交范围清单已覆盖 Runtime Review follow-up 累积文件集，并纳入 `scripts/validate_local_commit_scope.js`。
- [x] 关键验收命令已通过（含 runtime guard/smoke/delivery surface）。
- [x] 运行时边界保持 `A4`，并显式声明：无真实执行、无版本动作。
- [x] `agent_board` 当前状态文件纳入本次收束与后续阻塞边界。

## RC Proposal Summary

```yaml
proposal_id: runtime_review_batch_8a_local_rc_proposal
scope_status: local_proposal_ready
validation_status: completed_validated_local_rc_proposal
commit_scope_status: proposed_only_not_staged
version_action_authorized: false
real_execution_authorized: false
external_source_read_authorized: false
prototype_behavior_changed_in_8a: false
```

## Full Validation Matrix (for local phase)

```powershell
git diff --check
node --check review_console\runtime_prototype\app.js
node --check review_console\runtime_prototype\runtime_guard.js
node --check scripts\validate_runtime_guard_unit.js
node --check scripts\validate_runtime_prototype_smoke.js
node --check scripts\validate_runtime_delivery_surface.js
node scripts\validate_runtime_guard_unit.js
node scripts\validate_runtime_prototype_smoke.js
node scripts\validate_runtime_delivery_surface.js
node scripts\validate_runtime_prototype_suite.js
node scripts\validate_agent_board_state.js
node scripts\validate_local_commit_scope.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
powershell -ExecutionPolicy Bypass -File scripts\validate-agent-image-lab-local.ps1
```

## Version-Action Gate

本提案默认不做：

- commit
- tag
- push
- PR
- release

上述仅在你再次明确授权并给出版本范围（例如本地提交/tag/push/PR）后执行。
