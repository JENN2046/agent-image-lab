# AGENTS.autopilot-overlay.md — Agent Image Lab Smart Standing Autopilot

Version: v0.1-refactor
Scope: overlay guidance for `agent-image-lab`
Default user-facing language: Simplified Chinese
Active startup model: Smart Standing Authorization v3.

> This file is an overlay. It should not automatically replace the project root `AGENTS.md`.

---

## 0. Plain Meaning

Agent Image Lab is not a generic coding project. It is a VCP-native visual production orchestration system with owner-approved Smart Standing Authorization v3.

The agent may continue sustained work while the next step is project-relevant, non-destructive, inside the active autonomy envelope, and not a Red Lane condition. The owner has explicitly authorized Green direct work and Amber budgeted autonomy for A5/provider/plugin/API/image/DailyNote/VCP memory/real source exact read/small dependency actions.

Short rule:

```text
continue Green work directly and Amber work inside the budgeted envelope while the goal is clear
stop before Red Lane conditions such as secrets, destructive actions, push/tag/release/deploy, uncapped cost, unbounded loops, or broad external repository modification
```

---

## 0.5 Mandatory Autopilot Rule Intake

Before editing, read `AGENTS.md`, this overlay, and the current `.agent_board`
resume surfaces:

```text
.agent_board/HANDOFF.md
.agent_board/RUN_STATE.md
.agent_board/TASK_QUEUE.md
.agent_board/CHECKPOINT.md
```

Summarize Smart Standing Authorization v3, the active autonomy envelope, remaining Red Lane stops,
exact-file staging, `git add .` prohibition, and whether `.agent_board` must be
updated for the current task. Do not edit files until that intake is complete.

The intake must treat A4.8 as a Green Lane substrate only. Ambiguous
continuation words may continue Green work and Amber work inside the active
envelope, but Red Lane conditions must stop.

---

## 0.7 Smart Standing Authorization v3 — Budgeted Autonomy Envelope

Core rule:

```text
Standing owner authorization grants Codex a bounded autonomy envelope.
Within that envelope, Codex must not ask for step-by-step approval.
Codex should plan, execute, validate, repair once when safe, record receipts, and continue until the goal is complete or a Red condition appears.
```

The project owner explicitly requires the following categories to be allowed in Amber Lane without step-by-step permission prompts when they remain inside the default envelope:

```text
A5
provider/plugin/API/image
DailyNote/VCP memory
real manifest/VCPChat/VCPToolBox read
dependency change
```

Default envelope:

```yaml
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
```

Green Lane executes directly and records after the fact. Amber Lane plans, executes, validates, records receipts, and continues inside budget without step-by-step approval. Red Lane stops and asks.

After a meaningful Amber receipt action completes, Codex must automatically run
a separate Green Lane status-surface sync when README, roadmap, `.agent_board`
resume surfaces, ledger, validators, or authoritative refs changed or gained new
refs. This Green sync is local closeout work and does not consume the preceding
Amber action's `max_write_files` budget. It must not cross Red Lane gates.

Red Lane includes push, tag, release, deploy, destructive actions, force push/history rewrite, secret value read/edit, raw private data or raw chat history exposure, external repository broad modification, broad VCPChat/VCPToolBox writes, uncapped cost, unbounded loops, overwriting existing artifacts without explicit overwrite allowance, dependency changes without exact package/action lists, and validation failure requiring non-obvious judgment.

---

## 1. Project-Specific Hard Stop Gates

Stop and request explicit human authorization before any of the following:

- reading `.env`, `config.env`, logs, token files, cookies, secrets, private configs
- listing or storing real local private paths
- copying raw source from external repositories
- modifying real `VCPToolBox`
- modifying real `VCPChat`
- creating IPC / preload / renderer integration code in VCPChat
- push / PR / merge / tag / release
- any write outside the project root

Ambiguous instructions such as `继续`, `去吧`, `自动推进`, `keep going` may continue Green work and Amber work inside the active envelope. They do not authorize crossing Red Lane gates such as push, tag, release, deploy, destructive action, secret value access, uncapped cost, unbounded loops, or broad external repository modification.

---

## 2. Current Safe Work Classes

Allowed without additional authorization, if inside the project root:

- documentation refinement
- schema alignment
- validation checklist refinement
- Review Console static prototype refinements that do not call APIs or write files
- no-execution examples
- `.agent_board` updates
- local validation scripts
- dry-run planning docs
- authorization request templates that keep real paths empty or redacted
- owner-authorized real manifest / VCPChat / VCPToolBox exact reads inside the Amber envelope with receipts
- owner-authorized provider / plugin / API / image execution inside the Amber envelope with receipts
- owner-authorized DailyNote / VCP memory writes inside the Amber envelope with receipts
- owner-authorized bounded runtime/integration probes inside the Amber envelope with receipts
- owner-authorized production metadata writes inside the Amber envelope with receipts
- owner-authorized small dependency changes inside the Amber envelope with exact package/action list and receipts

---

## 2.5 BHA-Aware Governance Vocabulary

This project may use BHA terminology as a governance vocabulary, but it is not
BHA-dependent by default.

Valid BHA state labels:

```text
BHA_ABSENT
BHA_DETECTED
BHA_VERIFIED
BHA_STALE
BHA_INVALID
```

Use them as follows:

- `BHA_ABSENT`: no BHA runtime surfaces are present.
- `BHA_DETECTED`: BHA-like files or directories exist, but verifier evidence was not checked.
- `BHA_VERIFIED`: readable BHA policy/mission plus verifier checks passed for the current claim.
- `BHA_STALE`: BHA evidence exists, but freshness is not proven for the current claim.
- `BHA_INVALID`: BHA verifier, policy, mission, or evidence failed.

Rules:

- `.agent_board` is continuity state, not runtime proof.
- BHA file existence is not proof.
- Only `BHA_VERIFIED` may support a BHA-backed trust claim.
- If BHA is absent, continue under `AGENTS.md` text governance and `.agent_board`
  continuity only.
- Do not make BHA runtime mandatory for existing Agent Image Lab A5 authorization
  packages unless a later explicit policy gate approves that change.
- Do not create `.bha/`, run BHA commands, issue capabilities, or consume
  capabilities unless a later exact allowlist authorizes those actions.

---

## 3. Memory Policy Summary

DailyNote and memory-related examples must obey:

- Chinese diary content only
- no raw secrets or sensitive original text
- no private path originals
- no customer private data
- no image binaries
- every sub-agent task must produce `memory_delta`
- `memory_delta` is draft by default
- `confirmed` memory requires approval metadata
- `audit_only` and `forbidden` must not write to VCP long-term memory

Never place sensitive original text into:

- `memory_delta`
- `preserved_original`
- `Tag`
- audit logs
- rejection reasons
- DailyNote body

Only write desensitized Chinese summaries and safety markers.

---

## 4. Review Console Policy

Review Console is a gate, not a production execution engine.

MVP / prototype rules:

- human review overrides AI review
- `memory_preview` is only a preview
- `memory_approval.status != approved` means DailyNote must not be called
- static prototypes must not call APIs
- static prototypes must not write files
- static prototypes must not create images
- VCPChat integration code requires separate authorization

---

## 5. Adapter Recon Policy

Adapter recon proceeds in stages:

```text
planning baseline
→ authorization gate
→ authorization fill template
→ single-file read authorization
→ real read only after explicit user approval
```

Current safe state includes owner-authorized Smart Standing Authorization v3 Green / Amber lanes.

Default locks:

```yaml
source_authorized: false
source_read_performed: false
real_manifest_read: false
real_execution_allowed: false
selected_plugin: null
max_plugin_calls: 0
api_called: false
vcp_plugin_called: false
daily_note_called: false
external_repo_access_allowed: false
allowed_source_paths: []
read_commands_allowed: false
```

Under Smart Standing Authorization v3, Codex may advance status to `manifest_reviewed_safe`, `dry_run_checked`, `tested`, `plugin_selected`, or `execution_ready` only when the action stayed inside the envelope, the action was actually performed, validation passed or was honestly recorded, and the required receipt was recorded.

---

## 6. Validation Contract

Before claiming completion, run the narrowest safe validation available.

Common local checks:

```powershell
git status --short
git diff --check
.\scripts\validate-agent-image-lab-local.ps1
```

or:

```bash
git status --short
git diff --check
bash scripts/validate-agent-image-lab-local.sh
```

Do not claim validation that was not run.

Evidence and closeout rules:

- Do not claim BHA-backed proof unless BHA state is `BHA_VERIFIED`.
- Do not claim `.agent_board` status as machine-verifiable proof.
- Name the actual evidence source: command output, validator result, checked file,
  or explicit closeout record.
- Mark skipped validation plainly.
- Targeted checks do not equal full validation.

Use result labels:

```text
COMPLETED_VALIDATED
COMPLETED_UNVALIDATED
PARTIAL
BLOCKED
FAILED
```

---

## 7. Auto-Commit Policy

Local commits are allowed only when explicitly authorized or already part of a narrow accepted flow.

Never push, tag, create releases, or move tags without explicit user approval.

Before any local commit:

```bash
git diff --check
git diff --cached --check
git diff --cached --name-only
git diff --cached --stat
```

Do not use `git add .`.
Stage only the files in the current task scope.

---

## 8. Reporting Format

After each task, report in Chinese:

```text
Status:
Mode:
Risk:
Changed files:
Validation:
Boundary checks:
Findings:
Next recommended task:
```

If blocked, update `.agent_board/BLOCKERS.md` and `.agent_board/HANDOFF.md`.
