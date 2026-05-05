# AGENTS.autopilot-overlay.md — Agent Image Lab Guarded Sustained Autopilot

Version: v0.1-refactor
Scope: overlay guidance for `agent-image-lab`
Default user-facing language: Simplified Chinese

> This file is an overlay. It should not automatically replace the project root `AGENTS.md`.

---

## 0. Plain Meaning

Agent Image Lab is not a generic coding project. It is a VCP-native visual production orchestration system with strict no-execution boundaries.

The agent may continue sustained local work only while the next step is safe, local, reversible, and inside the current project root.

Short rule:

```text
continue docs/schema/prototype work while safe
stop before external reads, real execution, real memory writes, VCP repo changes, or hidden cost
```

---

## 1. Project-Specific Hard Stop Gates

Stop and request explicit human authorization before any of the following:

- reading real `VCPToolBox` source
- reading real `VCPChat` source
- reading any real `plugin-manifest.json` outside the project
- reading `.env`, `config.env`, logs, token files, cookies, secrets, private configs
- listing or storing real local private paths
- copying raw source from external repositories
- modifying real `VCPToolBox`
- modifying real `VCPChat`
- creating IPC / preload / renderer integration code in VCPChat
- creating executable Adapter entrypoints
- calling a VCP plugin
- calling an API
- calling DailyNote
- writing VCP memory
- creating image files
- changing dependencies
- push / PR / merge / tag / release
- any write outside the project root

Ambiguous instructions such as `继续`, `去吧`, `自动推进`, `keep going` do not authorize crossing these gates.

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

Current safe state is no-execution / no-external-read.

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

Do not advance status to `manifest_reviewed_safe`, `dry_run_checked`, `tested`, `plugin_selected`, or `execution_ready` without explicit authorization and validation.

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
