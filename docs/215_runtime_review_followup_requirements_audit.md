# Runtime Review Follow-up Requirements Audit

本文记录 `codex/runtime-review-followup` 分支上的 Runtime Review Console 后续需求审计和首批本地实现。当前阶段只做项目内 runtime prototype / validator / index 同步，不调用 bridge，不读取真实 VCPChat / VCPToolBox，不调用插件/API/DailyNote/VCP memory，不创建图片，不执行 commit/tag/push/PR/release。

```yaml
status: batch_2a_2c_completed_local_runtime_draft
branch: codex/runtime-review-followup
baseline: origin/master
scope: runtime_review_console_followup
real_execution_authorized: false
external_source_read_authorized: false
```

## Current Runtime Surface

已存在能力：

- queue search / sort / filter。
- compact queue cards。
- batch candidate selection and batch actions。
- undo history。
- session export/import draft with fingerprint and import preview。
- Chinese status glossary。
- candidate review state and preauthorization status。
- draft-only A5 preauthorization review package。
- accepted candidate delivery package draft with sanitized asset fingerprint。
- human override traceability draft for decision source, deviation, prompt compliance, and memory suitability。
- runtime guard checks for batch/review/preauthorization/inspection/export side surfaces。
- host bridge mock submit ack with `side_effects_performed=false`。

已存在验证：

```text
node scripts/validate_runtime_guard_unit.js
node scripts/validate_runtime_prototype_smoke.js
node scripts/validate_runtime_delivery_surface.js
node scripts/validate_runtime_prototype_suite.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
git diff --check
```

## Delivery Gaps

### P0: Accepted Candidate Delivery Package Draft

目标：把已接受候选图整理成本地 no-write 交付包草案。

Batch 2A 本地实现状态：已完成并纳入 runtime smoke / delivery surface / guard unit validation。

应包含：

- selected candidate ref。
- sanitized asset hash。
- review score band。
- risk summary。
- human approval summary。
- memory_delta preview。
- reusable rule summary。
- `draft_only=true`。
- `submitDraft_called=false`。
- no-write guard 全 false。

不得包含：

- image binary。
- raw plugin output。
- raw runtime log。
- raw endpoint。
- secret / token / cookie / password。
- raw private path。
- customer private data。

建议改动范围：

```text
review_console/runtime_prototype/app.js
review_console/runtime_prototype/index.html
review_console/runtime_prototype/styles.css
scripts/validate_runtime_prototype_smoke.js
scripts/validate_runtime_delivery_surface.js
```

### P0: Memory Completion State Split

目标：把 memory 相关状态拆成四段，避免把插件 `success` 当成写入完成。

需要展示或记录：

- write requested。
- write authorized。
- write performed。
- canonical location verified。
- canonical hash matched。
- `plugin_success_sufficient=false`。

成功判定必须继承 v10.28：

```yaml
plugin_success_required: true
plugin_success_sufficient: false
canonical_target_file_exists_required: true
canonical_target_hash_match_required: true
wrong_location_requires_status: plugin_success_wrong_location
```

建议改动范围：

```text
review_console/runtime_prototype/runtime_guard.js
review_console/runtime_prototype/app.js
scripts/validate_runtime_guard_unit.js
scripts/validate_runtime_prototype_smoke.js
```

### P1: Human Override Traceability

目标：让 `accepted`、`accepted_candidate`、`human_override`、`rejected`、`needs_human_review` 的区别在审片台里可读、可导出、可验证。

Batch 2C 本地实现状态：已完成并纳入 runtime smoke / delivery surface / guard unit validation。

需要展示：

- human decision source。
- override reason。
- known deviation summary。
- whether prompt compliance is complete。
- whether asset is suitable for memory。

停止条件：

- 若需要真实图片重新审查，必须停止并要求新的受控审片授权。
- 若需要读取 ignored `runs/` 图片二进制，必须停止并要求用户明确授权。

### P1: Authorization Capsule Generator

目标：把未来 A5 vNext 授权包做成本地草案生成面板，但保持 inactive。

应包含：

- selected plugin。
- selected command。
- selected model。
- max calls。
- output ref。
- memory write policy。
- rollback plan。
- forbidden outputs。
- exact approval phrase。
- authorization consumed tracking。

默认状态：

```yaml
authorization_status: inactive_package
real_execution_allowed: false
plugin_call_allowed: false
daily_note_write_allowed: false
vcp_memory_write_allowed: false
image_creation_allowed: false
version_action_allowed: false
```

## Recommended Execution Order

```text
1. Implement accepted candidate delivery package draft. [done: Batch 2A]
2. Add human override traceability fields. [done: Batch 2C]
3. Add memory completion state split to runtime guard and UI.
4. Add inactive authorization capsule generator.
5. Update docs, indexes, validation checklist, agent board, and validators.
6. Run full local validation.
```

## Validation Plan

Minimum validation for the next implementation batch:

```text
node --check review_console/runtime_prototype/app.js
node --check review_console/runtime_prototype/runtime_guard.js
node scripts/validate_runtime_guard_unit.js
node scripts/validate_runtime_prototype_smoke.js
node scripts/validate_runtime_delivery_surface.js
node scripts/validate_runtime_prototype_suite.js
node scripts/validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
git diff --check
```

## Boundary Confirmation

```yaml
real_vcpchat_read: false
real_vcptoolbox_read: false
real_manifest_read: false
plugin_called: false
api_called: false
daily_note_called: false
vcp_memory_written: false
image_created: false
submitDraft_called: false
commit_performed: false
tag_performed: false
push_performed: false
pr_created: false
release_created: false
```

## Next Safe Action

```yaml
next_safe_action: implement P0 memory completion state split locally
requires_new_authorization_before:
  - real VCPChat read
  - real VCPToolBox read
  - plugin/API call
  - DailyNote/VCP memory write
  - image creation or binary inspection
  - submitDraft
  - commit/tag/push/PR/release
```
