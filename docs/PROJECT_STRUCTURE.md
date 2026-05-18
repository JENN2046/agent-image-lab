# Agent Image Lab Project Structure

This document defines the current repository structure and the safe navigation rules for agents and maintainers.

## Current Authority

Use these files as the current operating entry points:

1. `AGENTS.md`
2. `AGENTS.autopilot-overlay.md`
3. `.agent_board/RUN_STATE.md`
4. `.agent_board/TASK_QUEUE.md`
5. `.agent_board/HANDOFF.md`
6. `scripts/validate_mvp.ps1`

Historical phase documents under `docs/` are audit records. They are not active authorization by themselves.

## Top-Level Directory Map

```text
.agent_board/        current local task rail, checkpoint, handoff, blockers
accepted_samples/    accepted sample registry and category indexes
asset_archive/       Git-portable asset references and preview evidence capsules
asset_index/         asset index policy and schema
docs/                product, gate, architecture, and historical phase records
failure_samples/     failure taxonomy and registry
integrations/        VCP planning, dry-run contracts, and authorization records
memory_policy/       memory rules, memory delta policies, and memory governance
production/          production-candidate paperwork; not automatic execution authority
prompts/             prompt package instances
prompt_templates/    reusable prompt templates
review_console/      static prototype, runtime prototype records, and embed contracts
schemas/             reusable YAML/JSON schema definitions
scripts/             local validators, suites, helper scripts, and blocked execution runners
tests/               schema examples and validation fixtures
tools/               local helper tools
workflows/           operating workflows and task procedures
runs/                local runtime outputs; ignored by default except historical tracked records
release_packages/    local release package outputs; ignored by Git
configs/             local configuration examples and local path placeholders
```

## Git-Portable Versus Local-Only

Git-portable project evidence should live in:

```text
docs/
schemas/
tests/schema_examples/
accepted_samples/
failure_samples/
asset_archive/accepted_samples/
scripts/
.agent_board/
```

Local-only or ignored evidence should live in:

```text
runs/
release_packages/
.agent_private/
.omc/
.claude/
configs/local_secrets/
```

Do not use ignored `runs/` artifacts as the long-term recoverability baseline.

## Asset Archive Contract

The current portable accepted-sample evidence path is:

```text
asset_archive/accepted_samples/<sample_id>/
  manifest.json
  preview.webp
  import_record.json
  review_record.json
  approval_record.json
```

Rules:

- `preview.webp` is the Git-tracked portable preview evidence.
- The preview long edge is `512`.
- `manifest.json` tracks the preview sha256.
- Base64 evidence is not used.
- Original image sha256 is not required for portable validation.
- Creating or copying `preview.webp` requires explicit source or generation authorization.

## Legacy Buckets

`asset_archive/accepted/` is a legacy bucket name. New accepted-sample evidence capsules should use `asset_archive/accepted_samples/<sample_id>/`.

Existing historical folders are not moved by this structure policy.

## Script Layout Policy

Current script reality:

- `scripts/validate_mvp.ps1` is the aggregate validation entry point.
- `scripts/validate_v*.js` are historical/versioned validators and remain in place for now.
- `scripts/lib/` contains shared validator helpers.
- `scripts/run_*`, `scripts/execute_*`, and runtime/debug scripts may cross A5 boundaries and must not be run without explicit authorization.

New validators should prefer:

```text
scripts/validators/<domain_or_version>/
```

Old validators are not moved as part of this policy.

## Review Console Boundaries

`review_console/static_prototype/` is the safe static prototype surface.

`review_console/runtime_prototype/` and `review_console/embed_contract/` contain runtime and integration planning records. They do not authorize runtime integration, VCPChat reads, IPC/preload/renderer work, provider calls, plugin calls, DailyNote writes, or VCP memory writes.

## Hard Stops

The following remain blocked without explicit A5 authorization:

- provider contact
- plugin calls
- API calls
- image generation
- image conversion or `preview.webp` creation
- DailyNote writes
- VCP memory writes
- real manifest reads
- VCPChat or VCPToolBox source reads
- runtime integration
- production candidate promotion
- Batch 005
- dependency changes
- secret reads or edits
- push, tag, release, deploy
- destructive Git or filesystem actions

## Current Maintenance Policy

Prefer small structure patches over broad moves:

- Add directory README files before moving files.
- Mark legacy paths before deleting or relocating them.
- Keep old phase docs as historical records.
- Add new validators under the new policy while old validators remain stable.
- Validate with `git diff --check`, `node scripts/validate_agent_board_state.js`, and `powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1` when structure or status surfaces change.
