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
7. `docs/REPOSITORY_ORGANIZATION_STANDARD.md`

Historical phase documents under `docs/` are audit records. They are not active authorization by themselves.

## Repository Organization Standard

`docs/REPOSITORY_ORGANIZATION_STANDARD.md` is the standing local structure
standard for future agents and maintainers. It defines how to add files,
classify documentation, place validators and fixtures, preserve Review Console
boundaries, and prepare any future file movement.

The default rule is:

```text
index, document, and validate before moving
```

Do not create new top-level directories, move validator families, relocate
fixtures, split historical docs, or compact `.agent_board` without following
that standard and naming the validation that proves the change.

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
- `scripts/validators/VALIDATOR_INDEX.md` is the current root validator discovery index.
- `scripts/validators/governance/` contains repository structure and governance validators with root compatibility wrappers when needed.
- `scripts/validators/readonly_operator_console/` contains readonly operator console validators with root compatibility wrappers.
- `scripts/validators/review_console/` contains Review Console validator implementations with root compatibility wrappers for `scripts/validate_review_console*.js`.
- `scripts/run_*`, `scripts/execute_*`, and runtime/debug scripts may cross A5 boundaries and must not be run without explicit authorization.

New validators must default to:

```text
scripts/validators/<domain_or_version>/
```

Root-level `scripts/validate_*.js` files are legacy-compatible entry points.
Add new root-level validators only for explicit compatibility, small
repository-wide governance guards, or task-required consistency with an
existing root-level validator family. Old validators are not moved as part of
this policy.

## Validation Gate Semantics

Current gate responsibilities:

- `npm run validate:core` is the current runtime core gate. It checks smoke, runtime-kernel including audit-write, read-only review bridge, durable audit store, and provider preflight without provider contact. Use it as the normal current-runtime safety gate.
- `npm run validate:mvp` is the product MVP core gate. It checks the current MVP product surface, metadata-only accepted-sample chain, retry_006 artifact integrity, and no-side-effect flags while excluding `.agent_board` and historical governance ledgers.
- `npm run validate:public-disclosure` is the public evidence disclosure gate. It scans public mock data, real-generation attempt records, production refs, provider receipts, and live receipt bridge handoffs for local absolute paths, loopback URLs, secret-like strings, and raw prompt fields.
- `npm run validate:all` is the historical archive and full-regression gate. It intentionally includes the current core gates, historical A5 provider packet and receipt validators, retry_006 artifact integrity, capsule regression, and governance validation.

Daily development should not treat `validate:all` as the only definition of current runtime health. The normal current-development gate is:

```text
npm run validate:core
npm run validate:public-disclosure
```

Run `npm run validate:mvp` when a change affects product MVP behavior, accepted-sample metadata, review handoff semantics, or artifact integrity. Run `npm run validate:all` before release-like closeout, governance changes, receipt/evidence governance changes, or when a failure may be caused by historical regression drift rather than current runtime behavior.

If `validate:all` fails after `validate:core`, `validate:mvp`, and `validate:public-disclosure` pass, classify the failure before fixing it:

- current runtime/product failure: fix the affected runtime, MVP, or disclosure surface.
- historical archive/governance drift: reconcile the exact historical validator or explicit dirty slice without broadening the gate.

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

- Follow `docs/REPOSITORY_ORGANIZATION_STANDARD.md` before adding or moving
  repository structure.
- Add directory README files before moving files.
- Mark legacy paths before deleting or relocating them.
- Keep old phase docs as historical records.
- Add new validators under the new policy while old validators remain stable.
- Validate with `git diff --check`, `node scripts/validate_agent_board_state.js`, and `powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1` when structure or status surfaces change.
