# Runtime Review Long Task Delivery Plan

本文把 Agent Image Lab 在 `Runtime Review Console follow-up Batch 2A/2B/2C` 之后的长任务拆成可持续推进的本地计划。

该计划只授权本地规划、文档、schema、runtime prototype 和 validator 工作；不授权真实 VCPChat / VCPToolBox 读取，不授权插件/API/DailyNote/VCP memory/image 动作，也不授权 commit、tag、push、PR、release。

## Current Baseline

```yaml
baseline_branch: codex/runtime-review-followup
baseline_status: local_runtime_review_batch_8a_release_candidate_readiness_proposal_ready
runtime_prototype_completed:
  - accepted_candidate_delivery_package_draft
  - memory_completion_state_draft
  - human_override_traceability_draft
  - queue_level_traceability_matrix
  - inactive_authorization_capsules_draft
  - runtime_review_state_draft
  - local_commit_scope_plan_draft
  - bridge_mock_roundtrip_candidate_draft
  - real_bridge_authorization_package_draft
  - plugin_reliability_prompt_discipline_draft
  - memory_write_completion_candidate_draft
  - single_real_generation_retry_gate_draft
  - real_memory_write_authorization_package_draft
  - asset_archive_candidate_draft
  - runtime_review_batch_8a_local_rc_proposal
no_execution_boundary:
  real_vcpchat_read: false
  real_vcptoolbox_read: false
  plugin_called: false
  api_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_created: false
  submitDraft_production_called: false
  remote_action_performed: false
```

## Planning Rules

- Local A4 work may continue for docs, runtime prototype surfaces, schema examples, fixtures, validators, and `.agent_board` updates.
- A5 / production work requires a fresh active authorization package with explicit target roots, allowed calls, maximum counts, output refs, rollback plan, and forbidden outputs.
- Real VCPChat or VCPToolBox source reads require single-purpose authorization and must not store raw source, raw local paths, endpoints, logs, secrets, or private data.
- Git commit / tag / push / PR / release are separate version actions and are not implied by this plan.
- DailyNote / VCP memory write completion must follow v10.28: plugin success is required but not sufficient; canonical target existence and hash match are required.

## Workstream Map

| ID | Workstream | Mode | Purpose | Main output |
| --- | --- | --- | --- | --- |
| LT-1 | Runtime Console completion | A4 local | Finish no-write Review Console product surface | Runtime prototype, docs, validators |
| LT-2 | Authorization capsule generator | A4 local | Generate inactive approval packages safely | Templates, fixture, validator |
| LT-3 | Memory lifecycle hardening | A4 local first, A5 gated later | Separate request / approval / write / canonical verification | Schema, UI, validator, future write gate |
| LT-4 | Bridge roundtrip readiness | A4 local first, A5 gated later | Prepare loadSession / previewDraft / submitDraft path | Mock roundtrip and authorization gates |
| LT-5 | Adapter and plugin reliability | A4 local first, A5 gated later | Make plugin execution measurable and bounded | Dry-run records, model lock checks, failure taxonomy |
| LT-6 | Asset review and archive | A4 local | Turn accepted_candidate into delivery package | Review package, archive record, no-binary policy |
| LT-7 | Release candidate stabilization | A4 local plus explicit version actions | Convert dirty local batch into clean candidate | Commit scope plan, validation matrix, PR plan |
| LT-8 | Operator handoff | A4 local | Make the project usable by future agents/operators | Runbook, dashboard checklist, resume capsule |

## Execution Order

### Batch 3A: Inactive Authorization Capsule Generator

Goal: create a local-only generator pattern for inactive authorization packages.

Scope:

- Add a runtime prototype section or local fixture that can display inactive authorization capsules.
- Capsule types:
  - real generation retry.
  - DailyNote / VCP memory write.
  - VCPChat bridge call.
  - provider-side prompt fingerprint capture.
  - commit / tag / push / PR.
- Every capsule must carry `authorization_status=inactive_package` until the user explicitly activates it.

Acceptance:

- Capsule output contains allowed actions, forbidden actions, max call counts, rollback plan, and sanitization rules.
- Capsule output never stores raw real paths, endpoints, logs, plugin output, source code, secrets, or image binaries.
- Validator rejects any capsule with live execution flags set.

Validation:

```powershell
node --check review_console\runtime_prototype\app.js
node scripts\validate_runtime_prototype_smoke.js
node scripts\validate_runtime_delivery_surface.js
node scripts\validate_runtime_prototype_suite.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
```

Stop before:

- real plugin call.
- real bridge call.
- real memory write.
- external source read.
- version action.

### Batch 3B: Runtime Review Console State Convergence

Goal: make the runtime prototype show one coherent review state from candidate review, memory split, delivery package, and human override traceability.

Scope:

- Add a top-level `runtime_review_state_draft`.
- Normalize status names across:
  - `review_session_draft`.
  - `image_case_draft`.
  - `memory_delta_draft`.
  - `memory_completion_state_draft`.
  - `accepted_candidate_delivery_package_draft`.
  - `human_override_traceability_draft`.
- Add mismatch detection for states that cannot both be true.

Acceptance:

- A single summary panel can explain whether the asset is `candidate`, `accepted_candidate`, `accepted_by_human_override`, `rejected`, or `blocked`.
- Memory status is not confused with asset status.
- `write_authorized=true` cannot imply `write_performed=true`.
- `human_override=true` cannot imply prompt compliance is complete.

Validation:

```powershell
node scripts\validate_runtime_guard_unit.js
node scripts\validate_runtime_prototype_smoke.js
node scripts\validate_runtime_delivery_surface.js
```

### Batch 3C: Local Commit Scope Stabilization

Goal: prepare the current accumulated local work for an intentional commit candidate without doing the commit yet.

Scope:

- Produce a commit-scope plan that groups files by:
  - runtime prototype.
  - validators.
  - docs and indexes.
  - agent board state.
- Add or update a validator if the current scope needs a tighter allowlist.
- Record files that are intentionally untracked or should remain ignored.

Acceptance:

- No staged changes unless commit is explicitly authorized.
- Commit scope validator passes.
- The plan includes rollback-by-file guidance without destructive commands.

Validation:

```powershell
node scripts\validate_local_commit_scope.js
git diff --check
```

Stop before:

- `git add`.
- commit.
- tag.
- push.
- PR.

### Batch 4A: Bridge Mock Roundtrip Candidate

Goal: prove Adapter dry-run -> Review Console -> bridge preview flow entirely inside project-local mocks.

Status: completed locally and validated.

Scope:

- Use existing fixtures only.
- Build a no-write `loadSession` fixture and `previewDraft` fixture.
- Keep `submitDraft` production semantics forbidden.
- Record only sanitized ack summaries.

Acceptance:

- `bridge_calls_observed` stays mock-only.
- `side_effects_performed=false`.
- `plugin_called=false`.
- `api_called=false`.
- `daily_note_called=false`.
- `vcp_memory_written=false`.
- `image_created=false`.

Stop before:

- real CDP / VCPChat bridge invocation.
- real source read.
- production `submitDraft`.

### Batch 4B: Real Bridge Authorization Package

Goal: prepare a fresh authorization package for future real VCPChat bridge invocation.

Status: completed locally and validated.

Scope:

- Define allowed methods and max calls.
- Default allowed methods:
  - `cancel`.
  - `loadSession`.
  - `previewDraft`.
- Keep `submitDraft` forbidden until separate submit semantics approval.

Acceptance:

- Package includes real target root refs supplied by user at execution time only.
- Package forbids raw CDP endpoint, websocket URL, runtime log, IPC payload, source snippet, token, cookie, password, and private path storage.
- Package includes rollback and process cleanup rules.

Stop before:

- launching or relaunching VCPChat.
- CDP target read.
- bridge call.

### Batch 5A: Plugin Reliability and Prompt Discipline

Goal: make future image generation less dependent on ad hoc prompts and more observable.

Status: completed locally and validated.

Scope:

- Keep a prompt registry for approved prompt families.
- Add prompt lint rules for banned trigger words and subject drift.
- Record requested model and sanitized plugin-reported model.
- Keep provider-side capture as an inactive authorization package.

Acceptance:

- Prompt package has a stable hash.
- Runner records requested model and sanitized model match fields.
- Failure taxonomy distinguishes:
  - prompt design failure.
  - model compliance failure.
  - plugin handoff failure.
  - provider-side unknown.

Stop before:

- real generation retry.
- provider-side capture.
- PluginDir / config read.

### Batch 5B: Single Real Generation Retry Gate

Goal: prepare, not execute, a safer single-call real generation retry flow.

Status: completed locally and validated.

Scope:

- One plugin only.
- One generation call only.
- Controlled output directory ref.
- No overwrite.
- Explicit rollback.
- No memory write until asset review passes.

Acceptance:

- Authorization template is complete and inactive.
- Review Console can receive the future run summary and classify asset status.
- Memory write remains blocked unless accepted candidate and memory approval both pass.

Stop before:

- actual plugin call.
- image creation.
- API call.

### Batch 6A: Memory Write Completion Candidate

Goal: turn v10.28 memory write completion rules into a repeatable local preflight.

Status: completed locally and validated.

Scope:

- Add memory write preflight fixture.
- Add canonical location / hash match checklist.
- Add wrong-location classification.
- Add failure closeout template.

Acceptance:

- Completion requires:
  - write requested.
  - write authorized.
  - writer executed.
  - canonical target exists.
  - canonical target hash matches.
- `plugin_success_sufficient=false` remains enforced.

Stop before:

- real DailyNote / VCP memory write.
- reading external config.
- raw path storage.

### Batch 6B: Real Memory Write Authorization Package

Goal: prepare the next single-write authorization package, but do not activate it.

Status: completed locally and validated.

Scope:

- Max DailyNote writes: 1.
- Max VCP memory writes: 1.
- Chinese desensitized body only.
- No image binary.
- No raw plugin output.
- No raw private path.

Acceptance:

- Package has a reject path and no-success-fabrication rule.
- Package records that failure cannot be retried more than once unless separately authorized.

Stop before:

- actual write.
- external config read.

### Batch 7A: Asset Archive Candidate

Goal: make accepted candidate assets auditable without storing binaries.

Status: completed locally and validated.

Scope:

- Archive only:
  - output path ref.
  - hash.
  - score.
  - sanitized review summary.
  - reusable rules.
  - human override reason.
- Add rejected / needs_human_review closeout records.

Acceptance:

- No image binary in Git.
- No image binary in DailyNote / VCP memory.
- Accepted candidate and rejected assets have different closeout templates.

### Batch 8A: Release Candidate Readiness

Goal: prepare a final local release candidate package after the runtime follow-up work stabilizes.

Status: local proposal ready; version actions remain blocked.

Scope:

- Update README / MANIFEST / RELEASE_NOTES / roadmap / validation checklist.
- Produce final acceptance delta for runtime follow-up.
- Produce commit/tag/PR proposal only.

Acceptance:

- Full local validation matrix is defined and run before any version-action request.
- Commit scope is reviewed as a proposal only, with no staged changes required by this record.
- Remote actions remain blocked until explicit approval.
- Runtime Review follow-up accumulated files are grouped as runtime prototype, validators, docs/indexes, and agent-board state.

Validation:

```powershell
git diff --check
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
powershell -ExecutionPolicy Bypass -File scripts\validate-agent-image-lab-local.ps1
node scripts\validate_agent_board_state.js
node scripts\validate_local_commit_scope.js
node scripts\validate_runtime_prototype_suite.js
```

## Long Task Dependency Graph

```text
Batch 2A/2B/2C completed
  -> Batch 3A inactive authorization capsule generator
  -> Batch 3B runtime state convergence
  -> Batch 3C local commit scope stabilization
  -> Batch 4A local bridge mock roundtrip candidate
  -> Batch 4B real bridge authorization package
  -> Batch 5A plugin reliability and prompt discipline
  -> Batch 5B single real generation retry gate
  -> Batch 6A memory write completion candidate
  -> Batch 6B real memory write authorization package
  -> Batch 7A asset archive candidate
  -> Batch 8A release candidate readiness
```

## Standing Validation Matrix

Run the narrowest relevant subset per batch, and run the full matrix before any commit proposal:

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

## Stop Conditions

Stop and ask for explicit authorization before:

- reading real VCPChat or VCPToolBox source.
- reading external manifest, config, env, log, endpoint, token, cookie, password, or private path.
- launching, relaunching, or attaching to real VCPChat for bridge calls.
- invoking any VCP plugin or API.
- creating image files.
- writing DailyNote or VCP memory.
- calling production `submitDraft`.
- committing, tagging, pushing, opening PR, merging, or releasing.
- changing dependencies.
- writing outside the project root.

## Next Recommended Local Batch

```text
Batch 8A is the current local RC proposal closeout. Next safe step is local validation refresh or an explicit version-action authorization request.
```

Reason:

```text
Batch 5B, 6B, and 7A are now represented by validated local inactive/draft runtime surfaces, and Batch 8A has collected them into a local release-candidate proposal. The next action is limited to validation refresh or a separately authorized commit/tag/push/PR sequence.
```
