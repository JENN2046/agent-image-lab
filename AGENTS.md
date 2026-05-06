# AGENTS.md

Project: Agent Image Lab
Version: Controlled Autopilot Constitution v1.0
Language: Default to English for this file. Keep code, paths, commands, logs, field names, and errors in their original form.
Purpose: Enable Codex to continue working autonomously within safe boundaries, without contaminating the VCP core repositories, the VCP memory system, or any real external source.

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
docs / schema / dry-run / authorization / static prototype
```

The default local automation mode is:

```text
A4 — Sustained Local Autopilot
```

This means Codex may continue safe, local, reversible project work across the allowed documentation, schema, dry-run, authorization-template, validation, and static-prototype surfaces without asking for step-by-step confirmation.

The default state must remain:

```text
no-execution
no-external-read
no real manifest
no VCPChat read
no VCPToolBox read
no plugin call
no API call
no DailyNote call
no VCP memory write
no image creation
no executable adapter entrypoint
```

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
- Commit
- Push
- Create tags when the task explicitly requires baseline / release sealing

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
- Commit / push

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
- Commit / push / tag

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

### A5 — Real External Access

Default: forbidden.

Any of the following belongs to A5 and requires explicit user authorization:

- Read real VCPChat
- Read real VCPToolBox
- Read real `plugin-manifest.json`
- Read source entry files
- Modify VCPChat
- Modify VCPToolBox
- Call plugins
- Call APIs
- Call DailyNote
- Write VCP memory
- Create images
- Create real Adapter execution code
- Create real IPC / preload / renderer integration code

Without explicit user authorization, do not enter A5.

---

## 5. Permanent Hard Stops

Stop immediately and do not continue automatically if any of the following is required or discovered:

```text
need to read real VCPChat
need to read real VCPToolBox
need to fill in a real local path
need to read a real manifest
need to read .env / config.env / secret / token / cookie
need to call a plugin
need to call an API
need to call DailyNote
need to write VCP memory
need to create an image
need to create executable code
need to modify an external repository
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

## 6. Automatic Commit Rules

Codex may commit automatically only if all conditions are met:

```text
changes are limited to the current project repository
changes are limited to the task-authorized scope
no P0 / P1 finding
git diff --check passes
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

## 7. Automatic Tag Rules

Codex may create a tag only when the task explicitly requires sealing a baseline, release, or closeout.

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

## 8. Automatic Push Rules

Codex may push commits and tags only if:

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
```

Codex must stop before:

```text
real VCPChat read
real VCPToolBox read
real manifest read
real plugin execution
real DailyNote write
real VCP memory write
real Review Console integration into VCPChat
real AgentImageLabAdapter execution entrypoint
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
```

Any future stage involving real external source reading, real source analysis, real integration, or real execution must be separately authorized.

Default allowed continuation:

```text
local A4 sustained autopilot inside approved project surfaces
documentation
schema
static prototype
authorization templates
closeout
validation
no-execution / no-external-read gate hardening
```
