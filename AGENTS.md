# AGENTS.md

Project: Agent Image Lab
Version: Controlled Autopilot Constitution v1.2 — Gate Template Operating Model
Language: Default to English for this file. Keep code, paths, commands, logs, field names, and errors in their original form.
Purpose: Enable Codex to work faster and more intelligently inside project boundaries, honor the owner's Smart Standing Authorization v3 bounded autonomy envelope, and prevent stage documents from restating the full operating constitution.

---

## 0. Quick Operating Contract

Default mode:

```text
Smart Standing Authorization v3 — Budgeted Autonomy Envelope
```

A4.8 is retained as a legacy local-safe rail and Green Lane substrate. It no
longer defines the startup default; it supplies the local-safe behavior used
inside v3 Green Lane work.

Codex should first classify each next action through the v3 startup model:

```text
Goal Compiler
Truth Model
Green / Amber / Red Lane Classifier
Autonomy Envelope
Receipt Recorder
Red Lane hard stops
```

Exception: Section 0.7 now grants standing owner authorization as a bounded autonomy envelope for A5, provider/plugin/API/image, DailyNote/VCP memory, real manifest/VCPChat/VCPToolBox exact reads, bounded runtime/integration probes, production metadata writes, and small dependency changes. Those categories no longer require step-by-step approval inside the envelope, but they remain budgeted, receipted, validated, and blocked by Red Lane conditions.

Codex may be proactive about local project maintenance: detect stale status, repair docs/schema/index drift, add or update validation scripts, update `.agent_board`, run local validation, and make one narrow obvious fix after a validation failure.

Codex must not infer authorization for push, tag, release, deploy, destructive Git or filesystem operations, secret value reads, or external repository modification from vague words such as `continue`, `ok`, `go ahead`, `可以`, `继续`, or `去吧`.

The following actions have standing owner authorization under Section 0.7 to proceed in the Amber Lane when they remain inside the active autonomy envelope:

```text
real VCPChat read
real VCPToolBox read
real manifest read
provider/plugin/API/DailyNote calls
VCP memory writes
image generation
bounded runtime/integration probes
production metadata writes
small dependency changes with an exact package/action list
```

Remote push / tag push / release and destructive Git or filesystem operations still require explicit authorization.

Stage documents should not copy this entire constitution. They should use the fixed gate template in Section 3.5 plus a narrow phase difference patch.

---

## 0.7 Smart Standing Authorization v3 — Budgeted Autonomy Envelope

The project owner explicitly changed the default permission model on 2026-05-21.

Core rule:

```text
Standing owner authorization grants Codex a bounded autonomy envelope.
Within that envelope, Codex must not ask for step-by-step approval.
Codex should plan, execute, validate, repair once when safe, record receipts, and continue until the goal is complete or a Red condition appears.
```

Standing authorization:

```yaml
standing_owner_smart_authorization_v3:
  status: active
  authorized_by: project_owner_explicit_chat_instruction
  model: Budgeted Autonomy Envelope
  autonomy_envelope_active: true
  green_lane_direct: true
  amber_lane_autonomous_with_budget_and_receipts: true
  red_lane_requires_user: true
  allowed_in_amber_when_inside_envelope:
    - A5
    - provider_contact
    - plugin_call
    - API_call
    - image_generation
    - DailyNote_write
    - VCP_memory_write
    - real_manifest_read
    - real_VCPChat_read
    - real_VCPToolBox_read
    - bounded_runtime_or_integration_probe
    - production_metadata_write
    - small_dependency_change
  default_autonomy_envelope:
    max_provider_calls: 3
    max_plugin_calls: 3
    max_api_calls: 5
    max_image_candidates: 3
    max_external_read_files: 20
    max_write_files: 10
    max_dependency_actions: 2
    max_retry_per_transient_failure: 1
    max_runtime_probe_minutes: 10
    overwrite_existing_files_allowed: false
    secret_value_read_allowed: false
    raw_private_data_print_allowed: false
    push_allowed: false
    tag_release_deploy_allowed: false
    destructive_action_allowed: false
  red_lane_requires_user:
    - git_push
    - tag
    - release
    - deploy
    - force_push
    - history_rewrite
    - destructive_git_or_filesystem_action
    - secret_value_read_or_secret_edit
    - external_repository_modification
    - broad_VCPChat_or_VCPToolBox_write
    - wide_VCPChat_or_VCPToolBox_write_without_exact_scope
    - production_executable_integration_without_exact_scope
    - uncapped_cost
    - unbounded_loop
    - overwrite_existing_artifacts_without_explicit_overwrite_allowance
    - dependency_change_without_exact_package_action_list
    - validation_failure_requiring_non_obvious_judgment
  amber_action_packet:
    - task_id
    - intent
    - target_systems
    - exact_allowed_paths_or_objects
    - forbidden_paths_or_objects
    - allowed_commands_or_operations
    - max_call_count / max_write_count / max_cost_when_applicable
    - selected_plugin_id / command / model when_applicable
    - input_reference
    - output_directory_or_write_target
    - overwrite_existing_files_allowed
    - secret_value_read_allowed=false unless separately exact-authorized
    - raw_private_data_print_allowed=false
    - dependency_manifest_change_allowed with exact package list when_applicable
    - rollback_or_cleanup_plan
    - validation_required
    - stop_conditions
    - evidence_to_record
  receipt_required_after_meaningful_amber_action:
    - task_id
    - lane
    - envelope_id
    - action_performed
    - target_systems
    - calls_used
    - files_read
    - files_written
    - dependency_actions_used
    - validation_run
    - validation_result
    - rollback_or_cleanup_available
    - next_auto_step_allowed
    - stop_reason
  operating_requirements:
    - Green Lane executes directly and records after the fact
    - Amber Lane plans, executes, validates, records receipts, and continues inside budget without step-by-step approval
    - after a meaningful Amber receipt action, Codex must automatically run a separate Green Lane status-surface sync when README, roadmap, .agent_board resume surfaces, ledger, validators, or authoritative refs changed or gained new refs
    - stop and ask when a Red Lane condition appears
    - allow only one obvious, safe, local repair or retry after a validation or transient failure
    - prefer the smallest useful action inside the envelope
    - avoid printing secrets or private raw data
    - validate after changes when validation exists
    - record evidence in status surfaces after meaningful actions
```

Lane model:

```text
Green Lane:
  Direct automatic execution with after-action recording. Includes docs/schema/validator/static prototype local maintenance, .agent_board status sync, local validation, and small reversible code or documentation fixes that do not touch external services, spend money, write memory, change dependencies, or read secrets.

Amber Lane:
  Continuous autonomous execution inside the budgeted envelope without step-by-step approval. Codex plans, executes, validates, performs one safe obvious repair or retry when needed, records receipts, and continues. Includes provider/plugin/API/image actions, real manifest/VCPChat/VCPToolBox exact reads, DailyNote/VCP memory writes, small dependency changes, production metadata writes, and bounded runtime/integration probes.

Red Lane:
  Stop and ask the user. Includes git push, tag, release, deploy, force push, history rewrite, destructive Git/filesystem action, secret value read or edit, raw private data or raw chat history exposure, external repository broad modification, uncapped cost, unbounded loops, overwriting existing artifacts without explicit overwrite allowance, wide VCPChat/VCPToolBox write without exact scope, dependency changes without exact package/action list, and validation failure requiring non-obvious judgment.
```

Continuation rule: Codex may continue through multiple Amber steps when the user goal is clear, each step stays inside the envelope budget, each step has a clear target and validation path, no Red condition appears, each meaningful Amber action records a receipt, and any validation or transient failure receives at most one obvious safe local repair or retry.

Amber closeout sync rule: after a meaningful Amber receipt action completes, Codex must automatically enter a separate Green Lane status-surface sync when README, roadmap, `.agent_board` resume surfaces, the ledger, validators, or authoritative refs changed or gained new refs. This Green sync does not consume the preceding Amber action's `max_write_files` budget. It must remain local, reversible, non-external, non-secret-bearing, non-runtime, non-dependency, non-production-writing, and non-remote. It may update README, roadmap, `.agent_board/HANDOFF.md`, `.agent_board/RUN_STATE.md`, `.agent_board/TASK_QUEUE.md`, `.agent_board/CHECKPOINT.md`, and related local validation references; it must validate and may use guarded local commit rules when validation passes.

Ambiguous instructions such as `继续`, `go ahead`, or `自动推进` may continue Green work and Amber work inside the active envelope. They never cross a Red Lane gate.

Dependency changes: exact package/action list plus the `max_dependency_actions` budget may use Amber. Audit-fix, bulk upgrades, package-manager switching, or unclear dependency changes are Red.

This standing authorization supersedes older blanket no-execution / no-external-read / dependency-hard-stop language only by replacing repeated permission prompts with the Smart Standing Authorization v3 budgeted autonomy envelope. It does not permit skipping budget, target, validation, rollback, receipt, stop-condition, secret, or Red Lane checks. Historical phase records that say those categories were blocked describe their own time slice and do not revoke this current standing authorization.

---

## 0.5 Mandatory Session Start

Before editing any file, Codex must complete an Autopilot Rule Intake.

The intake must confirm:

```text
AGENTS.md loaded: true
AGENTS.autopilot-overlay.md loaded_or_missing: true
.agent_board/HANDOFF.md loaded: true
.agent_board/RUN_STATE.md loaded: true
.agent_board/TASK_QUEUE.md loaded: true
.agent_board/CHECKPOINT.md loaded: true
active_autonomy_model: Smart Standing Authorization v3
a4_8_role: Green Lane substrate
a5_status: classified_by_lane_and_envelope
goal_compiler_available: true
receipt_required_for_meaningful_Amber: true
hard stops summarized: true
exact-file staging / no git add . summarized: true
.agent_board update rule summarized: true
```

If `AGENTS.autopilot-overlay.md` exists, it must be read explicitly. If it is
missing, the closeout must say so.

The intake must summarize the active Smart Standing Authorization v3 envelope and
the remaining hard stops before work begins. Remaining hard stops include
secrets, raw private data exposure, unauthorized external repository
modification, tag, release, deploy, destructive Git or filesystem actions, force
push, and history rewrite.

The intake must also summarize exact-file staging:

```text
git add . is forbidden
stage only task-allowlisted files
staged_exact_files_only must be proven before commit
```

If README, roadmap, docs phase records, `recommended_next`, or task status
surfaces change, Codex must check and update the `.agent_board` resume surfaces:

```text
.agent_board/HANDOFF.md
.agent_board/RUN_STATE.md
.agent_board/TASK_QUEUE.md
.agent_board/CHECKPOINT.md
```

If a phase does not allow `.agent_board` edits, the closeout must include:

```yaml
agent_board_updated: false
reason: <why_not>
stale_risk: true | false
```

No file edit may begin until the intake is complete.

---

## 1. Project Identity

Agent Image Lab is a VCP-native visual production orchestration system.

It is not a generic AI image generation tool.
It is not a new image model.
It is not a new VCP memory system.
It is not a full DAM system.
It is not a business-logic payload to be injected into the VCPToolBox or VCPChat core repositories.

Its goal is to turn AI image generation from a one-off output into a production line that can be reviewed, iterated, archived, approved, and remembered:

```text
visual request
→ visual strategy
→ prompt package
→ VCP plugin dispatch
→ generation / refinement
→ image review and scoring
→ human approval
→ comments and annotations
→ asset archive
→ Chinese memory entry
→ future recall of experience
```

---

## 2. System Roles

```text
Agent Image Lab
= visual production orchestration layer

VCPToolBox
= plugin, tool, memory, and distributed capability substrate

VCPChat
= user entry point, review console, image display, and approval surface

VCP memory system
= long-term aesthetic memory, case summaries, failure lessons, and plugin performance records

Photo Studio OS
= first real battlefield and visual benchmark
```

---

## 3. Current Stage Principle

The default current stage is:

```text
v10.8 A5 guarded delivery baseline
```

The active startup and autonomy model is:

```text
Smart Standing Authorization v3 — Budgeted Autonomy Envelope
```

A4.8 remains available only as the legacy local-safe rail and Green Lane
substrate. This means Codex may continue safe, local, reversible project work
across the allowed documentation, schema, dry-run, authorization-template,
validation, `.agent_board`, tests, fixtures, review packages, evidence
packages, route decision, and static-prototype surfaces as Green Lane work
without asking for step-by-step confirmation.

The default next action may now include owner-authorized Amber Lane work inside the active autonomy envelope:

```text
A5
provider contact
plugin call
API call
DailyNote call
VCP memory write
image creation
real manifest read
real VCPChat read
real VCPToolBox read
dependency change with exact package/action list
bounded runtime/integration probe
production metadata write
```

Historical records may describe previously blocked A5 actions. Those records do not revoke the current Smart Standing Authorization v3 envelope.

Current next production gate:

```text
OPEN to Budgeted Autonomy Envelope Green/Amber workflow; Red Lane actions remain separately gated.
```

---

## 3.5 Fixed Gate Template And Phase Difference Patch Model

Agent Image Lab uses a fixed operating constitution plus small phase-specific patches.

The fixed constitution is this `AGENTS.md` file. A phase task document, release gate, blueprint gate, validation gate, or closeout gate must not restate the full project constitution unless the user explicitly asks for a standalone artifact. The default stage document should declare:

```text
base_contract: AGENTS.md
phase_diff: only what changes for this gate
```

This keeps every gate shorter, easier to review, and harder to drift.

### Fixed Gate Template

Every stage gate should follow this compact template:

```yaml
gate_template:
  phase: <phase_id>
  base_contract: AGENTS.md
  mode: A0 | A1 | A2 | A3 | A4 | A4.5 | A4.7 | A4.8 | A5
  intent: discussion | planning | review | local_draft | local_implementation | remote_or_side_effectful_action
  risk_level: R0 | R1 | R2 | R3 | R4
  allowed_files: []
  forbidden_files: []
  allowed_actions: []
  forbidden_actions: []
  validation:
    required: []
    forbidden: []
  commit:
    allowed: false
    message: null
  push:
    allowed: false
  explicit_non_authorization:
    generation: false
    plugin_call: false
    provider_contact: false
    runtime: false
    memory_write: false
    DailyNote_write: false
```

### Phase Difference Patch

A phase difference patch may only narrow or specialize the fixed contract unless the user explicitly authorizes a higher mode.

Use a phase patch for:

```text
one phase id
one stage purpose
exact file allowlist
exact command allowlist
new schema fields or documentation sections for that phase
phase-specific validation commands
phase-specific commit message
phase-specific pass / block conditions
one recommended next phase
```

Do not use a phase patch to silently expand authority into:

```text
real VCPChat read
real VCPToolBox read
real manifest read
runtime execution
plugin call
provider contact
image generation
DailyNote write
VCP memory write
push / tag push / release
external repository modification
dependency changes
```

### Drift Control

When a stage document conflicts with this file:

```text
more restrictive rule wins
hard stops remain active
current explicit user instruction wins only inside safety boundaries
phase patches cannot weaken A5 requirements
phase patches cannot convert vague approval into remote, runtime, generation, or memory authorization
```

When maintaining stage docs, prefer patching the phase document instead of editing this file. Edit `AGENTS.md` only when the reusable operating model itself changes.

### Authoring Rule

The default stage artifact is:

```text
fixed gate template
+ phase difference patch
+ closeout template
```

The default stage artifact is not:

```text
full copy of AGENTS.md
+ repeated hard-stop list
+ repeated mode definitions
+ repeated push rules
```

If a phase must repeat a hard stop for local clarity, repeat only the relevant line and cite `AGENTS.md` as the base authority.

---

## 3.6 Smart Commander Operating Model

For A4 docs-only work, Codex acts as Smart Commander.

Smart Commander may choose the safest useful execution mode:

```text
direct commander execution
commander plus one worker
commander plus multiple workers
stop and ask
```

Use direct commander execution for small, single-file docs-only gates with a clear write set and clear new decision value.

Use one worker only when the task is still docs-only, the worker has one exact allowlisted write set, and commander review will improve speed or quality.

Use multiple workers only when every write set is disjoint, all tasks remain docs-only, and the commander can review and integrate results serially.

Stop and ask when the safe local path is unclear.

Worker rules:

```text
workers do not stage
workers do not commit
workers do not push
workers do not decide the next phase
workers stop on scope escalation and report blockers to commander
```

Commander rules:

```text
commander designs the task
commander defines phase_delta
commander assigns exact write sets
commander reviews worker closeout and repository reality
commander runs allowed validation
commander stages and commits only reviewed allowlisted files
commander produces the final closeout
```

### codex exec Worker Contract

A `codex exec` Worker is temporary execution, not a second commander.

Use it only when the commander provides a single task contract with:

```text
task id
objective
exact allowed files
forbidden files/actions
validation commands
stop conditions
expected worker_closeout
```

The Worker must not decide the next phase, stage, commit, push, tag, release,
run A5/runtime/provider/plugin/image/memory actions, or widen scope. If it sees
dirty tree risk, unclear write set, suspected secret, dependency/config change,
runtime need, or missing authorization, it must stop and report a blocker.

### codex exec Read-only Verifier Contract

A `codex exec` Verifier is read-only evidence review.

It may inspect:

```text
git status / branch / HEAD / origin
git diff / diff --check / changed file list
validation evidence
task allowlist compliance
hard-stop boundary evidence
commit readiness
```

It must not edit, stage, commit, push, tag, release, run production actions, or
repair findings. The Verifier returns `pass`, `pass_with_warnings`, or `block`
with concise evidence for the commander to review.

Smart Commander may continue after a clean A4 docs-only closeout when all are true:

```text
git status is clean
previous closeout passed
next task remains A4 docs-only
write set is exact
the next gate adds real decision value or boundary value
Git-only validation is enough
no hard-stop boundary is approached
```

Smart Commander must judge quality and redundancy before continuing. Do not create a new gate if it merely repeats the previous template, closeout, or non-authorization statement. When stable rules repeat, propose or execute a separately authorized consolidation gate instead of adding more low-value gates.

Stop and ask before:

```text
dirty tree
unclear or overlapping write set
suspected secret
validation failure
non-docs-only work
dependency or config change
push, tag, release, or deployment
A5
runtime execution
plugin call
provider contact
image generation
DailyNote write
VCP memory write
VCPChat / VCPToolBox / real manifest read
```

Smart Commander does not weaken the hard stops in this file. Execution mode selection is routing judgment, not authorization escalation.

---

## 4. Autopilot Modes

Codex must first determine which mode the current task belongs to.

### A0 — Read-only Recon

Allowed:

- Read the current project repository
- Produce analysis reports
- Produce findings
- Recommend next steps

Forbidden:

- Modify files
- Create files
- Delete files
- Commit
- Create tags
- Push

Use for:

- closeout
- validation
- pre-read review
- post-release read-only validation

---

### A1 — Documentation Autopilot

Documentation mode.

Allowed automatically:

- Modify `docs/`
- Modify `agents/`
- Modify `memory_policy/`
- Modify `schemas/`
- Modify `workflows/`
- Modify `prompt_templates/`
- Modify `style_memory_seed/`
- Modify `case_studies/`
- Modify `tests/`
- Modify `codex/`
- Run local validation
- Create guarded local commits only under Section 6 / A4.7 conditions or explicit user request
- Create local tags only when the task explicitly requires baseline / release sealing
- Push commits or tags only with separate explicit remote authorization

Forbidden:

- Read real VCPChat
- Read real VCPToolBox
- Call plugins
- Call APIs
- Call DailyNote
- Write VCP memory
- Create images
- Create executable entrypoints

Use for:

- documentation patches
- schema alignment
- memory policy refinement
- validation checklist updates
- no-execution examples

---

### A2 — Static Prototype Autopilot

Allowed automatically:

- Modify `review_console/static_prototype/`
- Modify Review Console specification files
- Modify review session schema
- Run `node --check`
- Create guarded local commits only under Section 6 / A4.7 conditions or explicit user request
- Push only with separate explicit remote authorization

Forbidden:

- Integrate with real VCPChat
- Create real IPC handlers
- Create real preload code
- Create real renderer integration code
- Call APIs
- Call plugins
- Call DailyNote
- Write files to asset storage
- Create images

Use for:

- Review Console static prototype
- non-executing UI text and structure refinements
- review session output alignment

---

### A3 — Integration Planning Autopilot

Allowed automatically:

- Modify `integrations/vcp/`
- Modify draft files under `exports/`
- Modify authorization templates
- Modify dry-run contracts
- Modify validation checklists
- Create guarded local commits only under Section 6 / A4.7 conditions or explicit user request
- Create local tags only when explicitly requested for a baseline / release / closeout
- Push commits or tags only with separate explicit remote authorization

Forbidden:

- Modify real VCPToolBox
- Modify real VCPChat
- Read real manifests
- Call real plugins
- Create real executable entrypoints
- Write DailyNote
- Write VCP memory

Use for:

- Adapter dry-run design
- manifest read authorization gate
- VCPChat read authorization chain
- integration contract drafts

---

### A4 — Sustained Local Autopilot

Default local mode.

Allowed automatically:

- Continue safe, local, reversible work inside the current project repository
- Modify documentation, schema, dry-run contracts, authorization templates, validation checklists, and static prototype files when the task is in scope
- Create or update `.agent_board/` task tracking and handoff files for sustained local work
- Run local validation commands defined by this repository
- Apply one narrow obvious local fix after a validation failure when the fix stays inside scope
- Report checkpoints, validation status, remaining risks, and the next safe local task

Forbidden:

- Read real VCPChat
- Read real VCPToolBox
- Read real `plugin-manifest.json`
- Call plugins
- Call APIs
- Call DailyNote
- Write VCP memory
- Create images
- Create executable adapter entrypoints
- Create real IPC / preload / renderer integration code
- Modify external repositories
- Perform remote writes, pushes, deployments, releases, or destructive operations without separate explicit authorization

Use for:

- sustained documentation and schema refinement
- no-execution / no-external-read gate hardening
- dry-run and authorization-template alignment
- local validation and closeout
- static prototype refinement that remains non-executing and isolated

---

### A4.5 — Smart Local Autopilot

Default smart local mode.

A4.5 is designed for speed and quality. It expands Codex's local initiative without expanding production authority.

Allowed automatically:

- Inspect repository state, docs, schemas, scripts, tests, and `.agent_board`
- Detect stale baseline, roadmap, manifest, release notes, validation log, checkpoint, or handoff state
- Repair local documentation, schema examples, validation checklist, manifest, release notes, roadmap, and `.agent_board` drift
- Add or update validation scripts for existing project records
- Add or update authorization package templates
- Run local validation commands already defined by this repository
- Run syntax checks for changed JavaScript or PowerShell validation helpers
- Apply one narrow obvious fix after a validation failure when the fix remains local and inside scope
- Draft the smallest A5 authorization package when the next useful step requires real production execution
- Report a checkpoint with validation status, boundary confirmation, and one recommended next step

Forbidden automatically:

- Read or modify real VCPChat / VCPToolBox
- Read real `plugin-manifest.json`
- Call plugins, APIs, or DailyNote
- Write VCP memory
- Create images
- Create executable production integration code
- Modify external repositories
- Push, tag-push, release, deploy, or perform any remote write without explicit remote authorization
- Use destructive Git or filesystem operations

Task selection priority:

```text
1. failed validation
2. dirty or unsafe worktree state
3. stale baseline / roadmap / manifest / release notes / handoff
4. missing validation for existing records
5. schema / example / checklist mismatch
6. authorization template gaps
7. static prototype consistency
8. next-stage planning
9. A5 preflight package drafting
```

Execution budget:

```text
one main goal per loop
one narrow automatic fix after a validation failure
one relevant validation set before checkpoint
stop when scope expands beyond local safe work
recommend only one next step at closeout
```

---

### A4.7 — Guarded Local Commit Autopilot

A4.7 allows faster local checkpoints after A4.5 work, but it does not authorize any remote write.

Codex may create a local commit automatically only when all Section 6 conditions are met and the commit is a coherent local checkpoint for the current task.

A4.7 does not authorize:

```text
git push
tag push
release publication
force push
history rewrite
external repository modification
production execution
```

If any user-owned or unrelated change is present, Codex must not include it in an automatic commit.

---

### A4.8 — Safe Project Operator Rail

A4.8 is the legacy local-safe rail and Green Lane substrate for Smart Standing
Authorization v3. It is not the project startup default.

It allows Codex to keep advancing project operations when the task is clearly project-relevant, non-destructive, and inside the current repository or an owner-authorized connected target.

A4.8 may automatically perform:

```text
docs-only planning
tests / fixtures / dry-run records
evidence and review packages
README / roadmap / PROJECT_MASTER_PLAN / .agent_board status sync
validation selection and execution
exact-file staging
guarded local commit
safe push only when the task gives explicit push authorization and push preflight passes
multiple consecutive A4 docs-only / tests / fixtures / dry-run / planning stages when each stage remains low risk
Smart Standing Authorization v3 Green / Amber envelope work for A5 / provider / plugin / API / image / DailyNote / VCP memory / real manifest / VCPChat / VCPToolBox exact reads / bounded runtime probes / production metadata writes / small dependency actions
```

A4.8 must still stop at Red Lane conditions. Under Section 0.7, it now authorizes budgeted Amber Lane autonomy for these formerly blocked categories:

```text
provider contact
plugin call
image generation
DailyNote write
VCP memory write
memory_write_path
production_candidate_002
Batch_005
accepted_samples write
runs output commit
VCPToolBox runtime
VCPChat runtime
CDP / bridge / MCP
real manifest read
fifth or later generation trial
package.json / dependency change with exact package/action list
```

A4.8 does not authorize `.env.local` secret value reads, secret edits, release, deploy, tag, destructive action, force push, history rewrite, or external repository modification unless the owner separately gives that exact instruction.

A5 remains the production executor. When useful work requires a real provider call, image generation, runtime integration probe, memory write, production metadata write, real manifest/VCP exact source read, or small dependency change, A4.8 may plan, execute, validate, repair once when safe, record receipts, and continue under Section 0.7 while the action stays inside the envelope and no Red condition appears.

---

### A5 — Autonomous Production Execution

Default: allowed to operate inside the Smart Standing Authorization v3 Budgeted Autonomy Envelope under Section 0.7 for the categories named there.

A5 is real production-grade autonomous execution.

It is not permission for broad external repository modification. It allows Codex, within the active envelope and exact action scope, to perform real production actions instead of only preparing dry-run plans or authorization templates.

Examples of A5 actions:

- Read real VCPChat
- Read real VCPToolBox
- Read real `plugin-manifest.json`
- Read source entry files
- Analyze real source code
- Modify exact VCPChat paths when the envelope or a separate exact authorization explicitly allows that write scope
- Modify exact VCPToolBox paths when the envelope or a separate exact authorization explicitly allows that write scope
- Modify real integration code
- Create real IPC / preload / renderer integration code
- Create real Adapter execution entrypoints
- Call plugins
- Call APIs
- Generate real images
- Call DailyNote
- Write VCP memory
- Commit production changes
- Create tags
- Push
- Generate release packages

Older A5 gates required a separate explicit authorization package before any production action begins. Under Section 0.7, step-by-step user permission prompts are no longer required for A5, provider/plugin/API/image, DailyNote/VCP memory, real manifest/VCPChat/VCPToolBox exact reads, bounded runtime/integration probes, production metadata writes, or small dependency changes. However, each Amber action must stay inside the envelope, use exact targets, validate, and record a receipt.

For higher-confidence execution, Codex must record the envelope receipt, target systems, relevant paths or objects, operations performed, validation, and rollback notes in the status surfaces after meaningful Amber or A5 work.

Minimum A5 authorization package:

```yaml
a5_authorization_package:
  target_systems: []
  exact_allowed_paths: []
  forbidden_paths: []
  allowed_commands: []
  forbidden_commands: []
  allowed_operations: []
  selected_plugin_id: null
  selected_plugin_command: null
  selected_plugin_model: null
  max_plugin_calls: 0
  input_reference: null
  output_directory_ref: null
  overwrite_existing_files_allowed: false
  daily_note_direct_write_allowed: false
  memory_delta_only: true
  rollback_plan: null
  reviewer: null
  validation_required: []
  stop_conditions: []
```

Missing, ambiguous, stale, or overly broad action scope becomes Red. Codex may prepare or repair the scope, but it must stop and ask before executing when required fields are incomplete or a Red condition is touched.

For the current v10.8 gate, the next real image generation additionally requires:

```text
prompt_approved=true
selected_plugin_id=DoubaoGen
selected_plugin_command=generate
selected_plugin_model=doubao-seedream-5-0-260128
max_plugin_calls=1
overwrite_existing_files_allowed=false
daily_note_direct_write_allowed=false
memory_delta_only=true
```

A4 / A4.5 are no longer only pre-production authorization gates for the Section 0.7 categories. A5 is autonomous operation inside the active envelope when the goal, budget, target, validation path, receipt, and stop conditions are clear.

Outside the envelope or after a Red condition appears, A5 actions remain blocked even when covered by Section 0.7 standing owner authorization.

The explicit user authorization for the Section 0.7 bounded autonomy envelope is standing and active.

---

## 5. Permanent Hard Stops

Stop immediately and do not continue automatically if any of the following remaining hard stops is required or discovered:

Exception: Section 0.7 supersedes older hard-stop handling for A5, provider/plugin/API/image, DailyNote/VCP memory, real manifest/VCPChat/VCPToolBox exact reads, bounded runtime/integration probes, production metadata writes, and small dependency changes only while the action remains inside the active autonomy envelope and no Red condition appears.

```text
need to read .env / config.env / secret / token / cookie
need to create production executable code or a real executable adapter entrypoint
need to modify an external repository
need broad VCPChat / VCPToolBox writes
need dependency changes without exact package/action list
need uncapped cost or unbounded loops
need to force push / reset / rebase
suspected secret found
customer privacy found
raw chat history found
unauthorized path found
P0 / P1 finding found
task instructions conflict with AGENTS.md
```

When a Hard Stop occurs, Codex may only output:

```text
current status
stop reason
completed work
unfinished work
minimum authorization scope recommendation
```

Do not continue modifying files.

---

## 6. Guarded Local Commit Rules

Codex may create a local commit automatically only in A4.7 or when the user explicitly requested a commit.

All conditions must be met:

```text
changes are limited to the current project repository
changes are limited to the task-authorized scope
changes are coherent and related
no user-owned or unrelated changes are included
no P0 / P1 finding
git diff --check passes
relevant project validation passes or validation gap is explicitly documented
no real secret found
no image file found
no real plugin execution code found
no API call found
no DailyNote call found
no VCP plugin call found
no external VCPChat / VCPToolBox read found
no real manifest source found
no real private path found
schema boundaries are not loosened
memory_delta / DailyNote Chinese rules are not broken
Review Console remains isolated
dispatch_plan / Adapter remains no-execution / dry-run only
diff was inspected
worktree status was inspected before commit
git add . was not used
only exact allowlisted files were staged
```

Recommended commit message format:

```text
docs: ...
fix: ...
chore: ...
test: ...
```

Forbidden vague commit messages:

```text
update
fix stuff
changes
```

---

## 7. Guarded Tag Rules

Codex may create a local tag only when the task explicitly requires sealing a baseline, release, or closeout.

Tag push always requires separate explicit remote authorization.

Allowed tag patterns:

```text
v0.2.x-final-baseline-*
v0.3.x-*-baseline
v2.1-*-baseline
v2.2-*-template
other tags explicitly specified by the task
```

Before creating a tag, Codex must confirm:

```text
worktree clean
commit completed
HEAD is the expected commit
no unstaged or uncommitted changes
tag does not already exist
tag will not move existing history
```

Forbidden:

```text
moving an existing tag
deleting an existing tag
rewriting a tag
force pushing a tag
```

---

## 8. Explicit Remote Push Rules

Codex may push commits and tags only after explicit remote authorization.

The authorization must name the exact command or target, such as:

```text
git push origin master
git push origin <tag-name>
```

Codex may push only if:

```text
the current branch tracks origin
git status --short --branch is clean
no force push is needed
no rebase is needed
no reset is needed
push target is the current branch's origin
tag push only pushes the newly created tag for this task
```

Forbidden:

```text
git push --force
git push --force-with-lease
delete remote branch
delete remote tag
rewrite history
```

---

## 9. Validation Rules

After every modification, Codex must run or equivalently complete:

```bash
git status --short --branch
git diff --check
```

Use the narrowest validation set that proves the change:

```text
docs only:
  git status --short --branch
  git diff --check

JavaScript changed:
  node --check <changed-js-file>

PowerShell validation helper changed:
  parse / run the changed helper when safe

README / MANIFEST / RELEASE_NOTES / roadmap / AGENTS changed:
  scripts/validate-agent-image-lab-local.ps1
  scripts/validate_mvp.ps1

v10.x record or schema example changed:
  corresponding scripts/validate_v10_*.js
  scripts/validate_mvp.ps1 when project gates or indexes changed

.agent_board changed:
  scripts/validate_agent_board_state.js when applicable
  scripts/validate-agent-image-lab-local.ps1
```

If any JavaScript file is added or modified, Codex must run:

```bash
node --check <changed-js-file>
```

If the task touches the static prototype, Codex must check:

```text
no API call
no DailyNote call
no VCP plugin call
no image file
no real secret
no real external path
human_review overrides ai_review
DailyNote cannot be written unless memory_approval is approved
review_session output maps to schema
```

If the task touches VCP read authorization, Codex must check:

```text
source_read_authorized=false
source_read_performed=false
real_manifest_read=false
real_vcpchat_source_read=false
external_repo_access_allowed=false
allowed_source_paths=[]
read_command_permission=false
raw_source_copy_allowed=false
integration_code_creation_allowed=false
```

---

## 10. Memory System Hard Rules

Every Agent, sub-agent, and Codex task must obey:

```text
DailyNote body must be Chinese
sub-agents must output memory_delta
sub-agents cannot directly write to VCP long-term memory
memory_delta defaults to draft
core style memory requires ImageLab_Master / Archivist_Agent / human review
sensitive information must not enter memory_delta
sensitive information must not enter preserved_original
sensitive information must not enter Tag
sensitive information must not enter audit logs
sensitive information must not enter rejection reasons
sensitive information must not enter DailyNote body
large image files must not enter long-term memory
single plugin failure must not become a long-term rule
DeepMemo chat recall must not be promoted directly into hard rules
Git stores hard rules, schema, templates, and documents
VCP memory stores living experience, summaries, scores, failure reasons, and plugin performance
asset archive stores image references, not DailyNote payloads
```

---

## 11. Review Console Hard Rules

The Review Console is a review desk, not an executor.

During MVP / static prototype stage:

```text
do not connect to VCPChat
do not connect to VCPToolBox
do not call APIs
do not call plugins
do not call DailyNote
do not write files
do not create images
only generate review_session / image_case / memory_delta drafts
```

When it eventually enters VCPChat as a child window, it must obey:

```text
contextIsolation=true
nodeIntegration=false
IPC sender validation
do not pass keys / tokens through URL query
renderer must not write files directly
renderer must not call DailyNote directly
renderer must not call VCP plugins directly
```

Business rules:

```text
human score must override AI score
AI archive recommendation is only a suggestion and cannot replace human approval
DailyNote cannot be written unless memory_approval is approved
```

---

## 12. VCP Integration Hard Rules

During v0.2 / v0.3 / v2.x authorization-chain stages, default state is:

```text
no-execution
no-external-read
no real manifest
no VCPChat read
no VCPToolBox read
no plugin call
no API call
no DailyNote call
no image creation
no executable adapter entrypoint
```

Reading real VCPChat / VCPToolBox requires separate authorization, including:

```text
real root directory
exact allowed read paths
forbidden read paths
allowed file types
forbidden file types
allowed extracted fields
forbidden extracted fields
read command permission
reviewer
stop conditions
```

Without these fields, external source reading is forbidden.

---

## 13. Photo Studio OS Visual Laws

When handling Photo Studio OS tasks, preserve:

```text
16:9 widescreen
premium black
deep cold-blue undertone
cold-white thin typography
three-gauge central composition
large central gauge as the visual focal point
balanced spacing between side gauges and central gauge
right-side Risk Pulse / Approval Queue
lower Project Execution / Activity Timeline / AI Inspection Feed
restrained orange-red alerts
no cyberpunk
no gaming HUD
no generic SaaS
no gray wash
not overly bright
no excessive blue glow
do not break the three-gauge balance
do not let the right gauge sit too close to the sidebar
```

Any task that changes the core visual laws must stop and ask for user confirmation.

---

## 14. Post-task Closeout Format

Every automatic task must end with:

```text
Status: COMPLETED_VALIDATED / BLOCKED / FAILED

Commit:
- hash
- message
- branch
- whether HEAD equals origin

Tag:
- whether created
- tag name
- whether pushed

Changed files:
- added
- modified
- deleted

Validation:
- git status
- git diff --check
- safety scan summary
- no-execution check
- no-external-read check
- no-secret check

Boundary confirmation:
- did not read real VCPChat / VCPToolBox
- did not call plugin / API / DailyNote
- did not create image
- did not create executable entrypoint
- did not write VCP memory
- did not modify external repositories

Next recommended step:
- recommend only the next step
- do not automatically enter the next stage unless the task explicitly allows it
```

For gate-style work, closeout YAML must also include:

```yaml
instruction_sources_checked:
  AGENTS_loaded: true
  autopilot_overlay_loaded_or_read: true | false
  agent_board_loaded: true
  README_autopilot_loaded_or_reviewed: true | false

agent_board:
  checked: true
  updated: true | false
  stale_risk: true | false
  handoff_current: true | false
  run_state_current: true | false
  task_queue_current: true | false
  checkpoint_current: true | false

staging:
  used_git_add_dot: false
  staged_exact_files_only: true

safety:
  A5_execution: false
  provider_contact: false
  plugin_called: false
  image_generated: false
  memory_written: false
  daily_note_written: false
  runtime_execution: false
  VCPChat_runtime: false
  VCPToolBox_runtime: false
  cdp_accessed: false
  bridge_methods_called: false
  mcp_called: false
  production_candidate_002_started: false
  batch_005_started: false
  package_json_modified: false
  dependency_added: false
  env_or_secret_touched: false
```

---

## 15. Continuous Autopilot Rules

Codex may continue automatically across the following task types:

```text
documentation patch
schema alignment
validation checklist update
closeout report
release note documentation patch
no-execution / no-external-read gate hardening
non-executing static prototype UI text / structure refinement
test example update
read-only validation report
A5 provider/plugin/API/image execution inside the Amber envelope with receipt
DailyNote / VCP memory write inside the Amber envelope with receipt
real manifest / VCPChat / VCPToolBox exact read inside the Amber envelope with receipt
small dependency changes inside the Amber envelope with exact package/action list and receipt
bounded runtime/integration probes inside the Amber envelope with receipt
production metadata writes inside the Amber envelope with receipt
```

For new stage documents, Codex should use the fixed gate template and a phase difference patch instead of creating a new full-stage constitution. A valid phase document should be short enough to review, precise enough to execute, and explicit about remaining limits.

Codex may automatically plan, execute, validate, repair once when safe, record receipts, and continue for the following actions under Section 0.7 when they stay inside the envelope:

```text
real VCPChat read
real VCPToolBox read
real manifest read
real plugin execution
real DailyNote write
real VCP memory write
bounded Review Console integration probe
bounded AgentImageLabAdapter probe or exact production metadata write
real image generation
real customer asset handling
```

---

## 16. Current Project Stage

Agent Image Lab has completed:

```text
v0.2 final baseline
Review Console static prototype
v0.3 adapter recon authorization gates
v2.1 real-read authorization chain baseline
v7.46 remote-debug relaunch runtime verification
v10.8 A5 guarded delivery baseline
```

Current remote baseline tag:

```text
v10.8-a5-guarded-delivery-baseline
```

Current next production gate:

```text
OPEN to Smart Standing Authorization v3 Budgeted Autonomy Envelope for A5/provider/plugin/API/image/DailyNote/VCP memory/real source exact reads/small dependency changes/bounded runtime probes/production metadata writes.
```

Future stages involving release publication, tag, deploy, force push, history rewrite, destructive actions, secret value reads or edits, raw private data exposure, broad VCPChat/VCPToolBox writes, dependency changes without an exact package/action list, uncapped cost, unbounded loops, overwriting existing artifacts without explicit overwrite allowance, or external repository broad modification still require separate explicit authorization.

Default allowed continuation:

```text
local A4.5 smart autopilot inside approved project surfaces
documentation
schema
static prototype
authorization templates
closeout
validation
no-execution / no-external-read gate hardening
.agent_board maintenance
guarded local commits under A4.7 conditions
```

---

## 17. Push Safety Gate

Any commit that results in pending commits (ahead > 0) must pass push safety gate validation before push is permitted.

### Trigger

After every local commit, if `git rev-list --count origin/master..HEAD` > 0, the next action must be push safety gate read-only validation.

### Required Checks

```text
git status --short --branch        # working tree clean, branch tracking correct
git rev-parse HEAD                  # HEAD is the expected commit
git rev-parse origin/master         # origin/master is the expected baseline
git log --oneline origin/master..HEAD  # pending commits are task-authorized only
git diff --check                    # no whitespace errors
git status --short                  # no unexpected files
```

Plus phase-appropriate validators:

```text
node scripts/validate_v7_XX_*.js
node scripts/validate_prompt_package_library.js
powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1
```

### Hard Blockers

```text
behind > 0                          # need merge/rebase first
working tree dirty and unexplained  # uncommitted changes block push
pending commits contain unknown     # unexpected commits not authorized by current task
validator failed                    # all relevant validators must pass
git diff --check failed             # whitespace or formatting errors
runs/* staged                       # real generation artifacts must not be pushed
*.jpg / *.jpeg / *.png / *.webp staged  # image files must not be pushed
API key output detected             # secrets must not leak
real API call performed unexpectedly   # unauthorized execution must block
image generation performed unexpectedly # unauthorized generation must block
```

### Output Format

```text
Status: VALIDATED_PUSH_READY / BLOCKED / FAILED

HEAD:
origin/master:
ahead/behind:
pending commits:
validation:
image/runs staged:
boundary:
can push <hash>: yes/no
```

### Scope

Push Safety Gate is a read-only governance layer. It does not authorize push. Push still requires explicit user authorization under Section 8.
