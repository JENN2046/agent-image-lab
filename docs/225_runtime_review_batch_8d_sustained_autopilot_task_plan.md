# Runtime Review Batch 8D Sustained Autopilot Task Plan

本文把 Runtime Review Batch 8C 之后的后续任务重新整理成可持续自动推进的计划。目标是让后续 agent 能在 A4 / A4.5 边界内连续推进文档、schema、fixture、validator、runtime prototype 和交付索引；对真实执行、远端动作和外部写入，则进入条件自动队列：只有具体 active authorization package 已存在且所有 preflight 条件满足时，才自动执行到授权上限。

本计划定义两级自动持续推进条件：

- 默认自动队列：凡是满足 A4 / A4.5 条件、位于项目根目录内、可回滚、可验证、不会触发外部副作用的任务，agent 应自动执行到本地验证完成。
- 条件自动队列：真实 VCPChat / VCPToolBox 读取、插件/API/DailyNote/VCP memory/image 动作、dependency change、commit/tag/push/PR/release 只有在当前任务已经提供具体 active authorization package，且 preflight 全部通过时，agent 才能在授权边界内自动执行。没有 active package 时必须停止并交接。

```yaml
status: local_sustained_autopilot_plan_ready
current_phase: "Runtime Review Batch 8D sustained autopilot task plan"
baseline_branch: master
baseline_remote_tracking: origin/master
baseline_head_short: 178529e
baseline_tag: v5.17-runtime-review-batch-8c-final-acceptance-summary
safe_local_autopilot_allowed: true
auto_execute_when_conditions_met: true
real_execution_in_default_auto_queue: false
remote_action_in_default_auto_queue: false
external_write_in_default_auto_queue: false
real_execution_in_conditional_auto_queue: true
remote_action_in_conditional_auto_queue: true
external_write_in_conditional_auto_queue: true
conditional_auto_queue_requires_active_authorization_package: true
```

## Autonomy Lanes

| Lane | Autonomy | Allowed work | Stop before |
| --- | --- | --- | --- |
| Lane A | A4 auto | docs, indexes, runbooks, schema examples, fixtures, no-execution authorization templates, `.agent_board` sync | commit, tag, push, PR, release |
| Lane B | A4.5 auto with local validation | runtime prototype no-write UI, import/export compatibility, local validators, mock-only bridge records | real VCPChat/VCPToolBox read, real bridge/CDP call |
| Lane C | A4 checkpoint | release-candidate scope review, final acceptance matrix, operator handoff package | staging/commit unless explicitly authorized |
| Lane D | conditional auto | real bridge, real plugin/API, real DailyNote/VCP memory, real image generation, source reads, external writes, commit/tag/push/PR/release | require active package, pass preflight, execute only within limits |

## Continuous Execution Loop

Every future local batch should use this loop:

1. Inspect `git status --short --branch` and treat unrelated changes as user-owned.
2. Pick the next highest-value task from the safe local queue.
3. Keep the batch small enough to validate in one turn.
4. Update docs, schema examples, fixtures, validators, runtime prototype, or `.agent_board` only when those files are in scope.
5. Run the narrowest relevant validation.
6. Record a checkpoint in `.agent_board` after meaningful progress.
7. If a hard gate is reached, check whether a concrete active authorization package covers that exact action. If yes, run the required preflight and execute only within the package limits. If no, stop and hand off.

Hard gates are conditional auto-execution work only when the active package is concrete and current. Otherwise they are stop-and-handoff conditions:

```yaml
real_vcpchat_read: conditional_auto_with_active_package
real_vcptoolbox_read: conditional_auto_with_active_package
real_manifest_read: conditional_auto_with_active_package
bridge_or_cdp_call: conditional_auto_with_active_package
plugin_or_api_call: conditional_auto_with_active_package
daily_note_write: conditional_auto_with_active_package
vcp_memory_write: conditional_auto_with_active_package
image_creation: conditional_auto_with_active_package
dependency_change: conditional_auto_with_active_package
commit_tag_push_pr_release: conditional_auto_with_active_package
write_outside_project_root: conditional_auto_with_active_package
```

## Conditional Automation Activation Contract

真实执行、远端动作和外部写入可以进入条件自动队列，但必须同时满足以下条件：

```yaml
active_authorization_package_required: true
package_must_be_current_for_this_turn: true
target_system_required: true
target_branch_or_path_required_when_relevant: true
allowed_actions_required: true
forbidden_actions_required: true
max_call_or_write_counts_required: true
input_reference_required: true
output_or_destination_ref_required_when_relevant: true
overwrite_policy_required: true
rollback_plan_required: true
forbidden_outputs_required: true
validation_commands_required: true
stop_conditions_required: true
```

When all fields are present and preflight passes, the agent should execute automatically up to the package limits. It should not pause between safe substeps that are already covered by the package.

If any field is missing, stale, ambiguous, too broad, or would expose raw secrets / raw paths / raw endpoints / raw runtime logs / raw plugin output / image binaries, the package is invalid and the task stops.

Conditional auto examples:

| Action class | Auto-execute when package includes | Required preflight |
| --- | --- | --- |
| real bridge call | method allowlist, max calls, runtime target ref, forbidden payload/log outputs | target reachable, allowlist exact, submitDraft state explicit |
| real plugin call | plugin id, command, model, max calls, prompt/input ref, output dir, no-overwrite, rollback | output dir collision check, call counter, forbidden output scan |
| DailyNote / VCP memory write | writer id, max writes, Chinese sanitized body, target category ref, hash/canonical verification | no raw path/secret/image binary, canonical target rule present |
| commit/tag/push/PR | exact files or commit scope, message/tag/branch/PR target, push/tag policy | clean status check, diff check, staged scope check, remote divergence check |
| external write | target ref, allowed write type, max writes, rollback, audit summary | destination scope check, no private raw output, write count guard |

## Next Local Batches

### Batch 9A: Current State Freshness Index

Goal: make the top-level status, roadmap, manifest, release notes, validation checklist, and `.agent_board` agree on the current post-v5.17 baseline.

Work allowed:

- Add or update a state freshness doc.
- Add a validator that checks current phase strings across README, roadmap, `.agent_board/RUN_STATE.md`, `.agent_board/HANDOFF.md`, and validation checklist.
- Record that `.omc/` is unrelated untracked workspace noise and must not be staged automatically if still present.

Acceptance:

- The current phase is discoverable from one place and cross-checked.
- Historical docs remain historical; new docs record the current baseline.
- No version action is performed.

Validation:

```powershell
node --check scripts\validate_local_commit_scope.js
node scripts\validate_agent_board_state.js
git diff --check
```

### Batch 9B: Runtime Session Compatibility Matrix

Goal: prevent import/export regressions after the legacy `runtime_review_session_v1` compatibility fix.

Work allowed:

- Document the accepted export formats and missing-field fallback rules.
- Add local fixture examples for legacy v1 and current draft-rich sessions.
- Add or extend validator coverage for legacy imports without requiring newly added draft blocks.

Acceptance:

- Legacy v1 exports can be described as accepted when new draft blocks are absent.
- Current exports still require guard blocks.
- Versioning rules are explicit before any future schema bump.

Validation:

```powershell
node --check review_console\runtime_prototype\app.js
node --check review_console\runtime_prototype\runtime_guard.js
node scripts\validate_runtime_prototype_suite.js
```

### Batch 9C: Operator Runbook And Resume Capsule

Goal: make the project easier to resume by a future agent without re-reading the whole history.

Work allowed:

- Add a short operator runbook.
- Add a resume capsule with current phase, safe next tasks, hard gates, validation commands, and version action status.
- Link the runbook from README, MANIFEST, roadmap, and `.agent_board/HANDOFF.md`.

Acceptance:

- A new agent can identify safe local work in under five minutes.
- The runbook does not contain raw secrets, raw private paths, raw runtime logs, or plugin output.
- It does not authorize A5 production actions by itself; it only points to the conditional automation activation contract.

Validation:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
powershell -ExecutionPolicy Bypass -File scripts\validate-agent-image-lab-local.ps1
git diff --check
```

### Batch 10A: Release-Candidate Acceptance Matrix

Goal: turn the vNext acceptance chain into a structured matrix for future release decisions.

Work allowed:

- Add acceptance matrix rows for bridge, plugin, asset archive, memory lifecycle, runtime prototype, validator suite, operator docs, and release readiness.
- Mark each row as `complete`, `local_only_complete`, `blocked_by_authorization`, or `requires_future_work`.
- Add no-execution evidence for each blocked row.

Acceptance:

- Release readiness can be reviewed without scanning dozens of historical docs.
- Real execution gaps are not hidden behind local validation.
- GitHub Release remains blocked unless separately authorized.

Validation:

```powershell
node scripts\validate_local_commit_scope.js
git diff --check
```

### Batch 10B: End-To-End Dry-Run Replay Index

Goal: make Adapter dry-run -> Review Console -> mock bridge preview -> memory_delta draft replayable from project-local fixtures.

Work allowed:

- Index the fixture chain.
- Add a dry-run replay checklist.
- Extend validators only if they remain local and no-write.

Acceptance:

- The replay path is clear without touching real VCPChat, VCPToolBox, DoubaoGen, DailyNote, or VCP memory.
- `submitDraft` remains blocked.
- `max_plugin_calls=0` for replay.

Validation:

```powershell
node scripts\validate_runtime_prototype_smoke.js
node scripts\validate_runtime_delivery_surface.js
node scripts\validate_runtime_prototype_suite.js
```

### Batch 10C: Future A5 Authorization Package Consolidation

Goal: consolidate future production preflight fields into one reviewable template so production execution can enter the conditional auto queue only when a concrete package is active.

Work allowed:

- Combine bridge, plugin, asset review, DailyNote/VCP memory, rollback, and forbidden output fields into a single preflight template.
- Keep all real roots as placeholders.
- Add a checklist for missing required fields.

Acceptance:

- Missing fields block activation.
- Raw local paths, endpoints, logs, source snippets, secrets, plugin output, and image binaries are forbidden outputs.
- The template is not an auto-execution trigger by itself; once filled as a concrete active package and preflight passes, it can drive conditional auto execution within limits.

Validation:

```powershell
node scripts\validate_local_commit_scope.js
git diff --check
```

## Parallelizable Work Groups

These groups can be advanced together when the worktree is clean enough and the edits remain disjoint:

| Group | Can run together | Files likely touched | Notes |
| --- | --- | --- | --- |
| G1 | Batch 9A + 9C | docs, README, MANIFEST, roadmap, `.agent_board` | documentation and resume state only |
| G2 | Batch 9B + 10B | runtime prototype docs, fixtures, validators | requires runtime validator reruns |
| G3 | Batch 10A + 10C | release readiness docs, conditional authorization templates | no real execution unless a concrete active package is present |
| G4 | final local checkpoint | `.agent_board`, validation checklist, commit scope validator | commit/tag/push/PR may auto-run only with concrete version-action package |

Avoid parallel edits when multiple tasks need the same runtime prototype files; do those sequentially and validate after each batch.

## Recommended Sustained Order

```yaml
recommended_order:
  - batch: 9A
    reason: "fresh state index reduces stale handoff risk"
    auto_continue: true
  - batch: 9C
    reason: "operator resume capsule improves future task throughput"
    auto_continue: true
  - batch: 9B
    reason: "schema/import compatibility is the highest runtime regression risk"
    auto_continue: true_if_runtime_files_are_clean
  - batch: 10B
    reason: "dry-run replay proves local chain without real execution"
    auto_continue: true_if_validators_pass
  - batch: 10A
    reason: "acceptance matrix prepares release review"
    auto_continue: true
  - batch: 10C
    reason: "production preflight template keeps future handoff structured"
    auto_continue: true
  - batch: final_checkpoint
    reason: "commit/tag/push/PR require a concrete version-action package"
    auto_continue: true_if_version_action_package_is_active_and_preflight_passes
```

## Validation Matrix

Baseline commands for local batches:

```powershell
git diff --check
node --check scripts\validate_local_commit_scope.js
node scripts\validate_local_commit_scope.js
node scripts\validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
powershell -ExecutionPolicy Bypass -File scripts\validate-agent-image-lab-local.ps1
```

Runtime prototype batches should also run:

```powershell
node --check review_console\runtime_prototype\app.js
node --check review_console\runtime_prototype\runtime_guard.js
node scripts\validate_runtime_guard_unit.js
node scripts\validate_runtime_prototype_smoke.js
node scripts\validate_runtime_delivery_surface.js
node scripts\validate_runtime_prototype_suite.js
```

Static prototype batches should also run:

```powershell
node --check review_console\static_prototype\app.js
node --check review_console\static_prototype\mock_data.js
```

## Stop Conditions

Stop immediately if any of these become true and no concrete active authorization package covers the exact action:

- worktree contains unrelated edits that overlap target files.
- validation fails twice and the fix is not obvious.
- a task would require real VCPChat or VCPToolBox source.
- a task would require `plugin-manifest.json` outside this repository.
- a task would call a plugin, API, DailyNote, VCP memory, or create an image.
- a task would require dependency changes.
- a task would require commit, tag, push, PR, merge, release, or GitHub action.
- a task would write outside the project root.

Stop even with an active package if:

- the package omits max counts, rollback, forbidden outputs, or target refs.
- remote has diverged from the package baseline.
- output directory or destination has a collision and overwrite is not explicitly allowed.
- validation fails twice.
- raw sensitive values would need to be recorded.
- the next step would exceed the authorized maximum call/write/action count.

## Next Recommended Task

Start with Batch 9A. It is the safest high-value next step because it reduces stale state risk before more runtime or release work is added.
