# Runtime Review Batch 3A + 3B + 3C Local Stabilization

本文记录 Runtime Review follow-up 后续三批本地长任务的落地结果。该批次只修改 Agent Image Lab 仓库内文档、runtime prototype 和 validator，不授权真实 VCPChat/VCPToolBox 读取、bridge 调用、插件/API、DailyNote、VCP memory、图片生成或远端版本动作。

## Scope

```yaml
batch: runtime_review_batch_3a_3b_3c
mode: local_a4_no_execution
branch_ref: codex/runtime-review-followup
real_vcpchat_read: false
real_vcptoolbox_read: false
bridge_called: false
plugin_called: false
api_called: false
daily_note_called: false
vcp_memory_written: false
image_created: false
git_add_performed: false
commit_performed: false
tag_performed: false
push_performed: false
pr_created: false
release_created: false
```

## Batch 3A: Inactive Authorization Capsule Generator

Added `inactive_authorization_capsules_draft` to the runtime prototype.

Capsule types:

- `real_generation_retry`
- `memory_write`
- `vcpchat_bridge_call`
- `provider_prompt_fingerprint_capture`
- `version_action`

Each capsule is fixed to:

```yaml
authorization_status: inactive_package
activation_required: true
side_effects_performed: false
```

Every capsule records allowed actions, forbidden actions, max call counts, rollback plan, sanitization rules, and no-execution flags. The runtime guard rejects any capsule that is activated inside the prototype or reports bridge/plugin/API/DailyNote/VCP memory/image/version side effects.

## Batch 3B: Runtime Review Console State Convergence

Added `runtime_review_state_draft` to explain one selected candidate as a single readable state while preserving separate dimensions:

- asset state.
- review status.
- memory approval status.
- write request / authorization / execution state.
- delivery package readiness.
- human override and prompt compliance state.

Allowed asset state keys:

```text
candidate
accepted_candidate
accepted_by_human_override
rejected
blocked
```

The state convergence guard rejects mismatches such as:

- memory write authorized without write request.
- no-write prototype claiming `write_performed=true`.
- human override implying prompt compliance is complete.
- accepted asset without human approval.
- accepted delivery package while memory approval or risk gate is not satisfied.

## Batch 3C: Local Commit Scope Stabilization

Added `local_commit_scope_plan_draft` and this document to prepare the accumulated local work for a future explicit commit authorization. This plan does not stage or commit anything.

Commit scope groups:

| Group | Purpose |
| --- | --- |
| `runtime_prototype` | Review Console runtime UI, guard, styles, field mapping and README |
| `validators` | Runtime smoke/unit/delivery validators plus local scope validators |
| `docs_indexes` | README, MANIFEST, RELEASE_NOTES, roadmap, planning docs and validation checklist |
| `agent_board` | `.agent_board` state, handoff, checkpoint, task queue and validation log |

Intentionally untracked refs:

```text
docs/215_runtime_review_followup_requirements_audit.md
docs/216_runtime_review_long_task_delivery_plan.md
docs/217_runtime_review_batch_3a_3b_3c_local_stabilization.md
```

Version boundaries:

```yaml
staged_changes_present: false
commit_allowed: false
tag_allowed: false
push_allowed: false
pr_allowed: false
release_allowed: false
```

Rollback guidance is by file group only. Do not use destructive cleanup or history rewrite commands.

## Validation Plan

```powershell
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
git diff --check
```

## Stop Conditions

Stop before:

- reading real VCPChat or VCPToolBox source.
- invoking bridge/CDP/plugin/API/DailyNote/VCP memory.
- creating or writing image files.
- reading secrets, endpoints, logs, cookies, tokens, passwords or private configs.
- running `git add`, commit, tag, push, PR, release or merge.
- writing outside the project root.
