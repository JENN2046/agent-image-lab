# Pro Review Reality Triage

Date: 2026-05-26
Mode: Green local review triage only.
Source: external Pro review supplied by user in chat.
Status: completed_validated

## Summary

The Pro review is useful as an external reality check, but it is not repository
truth by itself. It was treated as an A0 review input and checked against the
current local repository after syncing `origin/master`.

High-level judgment retained:

- The repository is stronger as a local governance, evidence capsule, dry-run,
  fixture, and validator lab than as a mature Agent Runtime.
- Local artifact tooling has real value.
- The provider path exists, but its output safety and runtime integration are
  not production-grade.
- The Review Console remains a static prototype backed by mock state.
- Autopilot orchestration is still mostly fixture/materialized-state selection,
  not a closed-loop executor.

## Repository State Checked

- Local merge sync completed: `dc26eba Merge origin/master runtime binding records`.
- Remote head included: `319ee3e docs: record vcptoolbox runtime binding setup`.
- Worktree was clean after merge.
- `npm run validate:mvp` passed after the merge commit.
- During this triage edit, `npm run validate:mvp` failed while files were
  uncommitted because readiness validators require a clean committed state.
  `git diff --check` and
  `node scripts/validate_autopilot_agent_board_resume_compaction_guard.js`
  passed before commit.

## Verified Or Updated Claims

| Claim | Current triage result | Evidence |
| --- | --- | --- |
| `validate:mvp` points to an empty script | Updated: no longer true in current repository | `scripts/validate_mvp.ps1` contains required file/directory checks and validation dispatch; `npm run validate:mvp` passed after merge |
| Provider real path exists | Verified true | `plugins/image_generation/native_doubao_image/native_doubao_image.js` calls `fetch(apiUrl, ...)` and writes returned image payloads |
| Provider path lacks production-grade output hardening | Verified likely true | no observed `AbortController`, direct `response.json()`, direct base64 write, URL download checks only `https:` before `fetch(img.url)` |
| Review Console is static/mock-backed | Verified true | `review_console/static_prototype/app.js` initializes from `window.REVIEW_CONSOLE_MOCK`; `index.html` marks `Dry-run only` |
| Autopilot orchestrator is not a real executor | Verified true | `scripts/orchestrate_next_safe_task.js` reads `tests/schema_examples/autopilot_goal_decomposition_materialized.example.json`, reports `writes_real_state_now: false`, and exports side-effect flags as false |
| Validator pass can overstate runtime maturity | Retained as a risk | MVP validation now exists, but many validators still verify docs, fixtures, status surfaces, or string tokens rather than live runtime behavior |

## Priority Fix Queue

1. Provider output safety hardening.
   - Add request timeout with `AbortController`.
   - Validate response `Content-Type` before JSON parsing.
   - Validate response schema before accessing `data`.
   - Add image byte size cap.
   - Decode and validate image format/dimensions before writing final output.
   - Avoid hardcoded `.jpg` unless image type proves JPEG.
   - Harden URL download with redirect policy, content-type validation, and
     stronger host/IP safety.

2. Runtime truth boundary.
   - Define a small runtime kernel contract separately from docs validators.
   - Make task state transition explicit: intake -> policy gate -> executor ->
     artifact persistence -> review gate -> audit record.
   - Keep fixture selectors clearly labeled as fixture selectors.

3. Review Console product boundary.
   - Keep static prototype intact.
   - Add an explicit real-backend gap list before claiming product maturity.
   - Separate mock data demos from future read-only metadata API requirements.

4. Validator quality.
   - Preserve `validate:mvp`, but split checks into evidence categories:
     repository presence, static syntax, fixture contract, artifact behavior,
     runtime behavior.
   - Avoid treating docs/status-surface token checks as runtime proof.

5. Public repository disclosure audit.
   - Review mock data, reports, production candidates, and real generation
     attempt JSON for minimum disclosure.
   - Keep secret values and raw private data out of docs, fixtures, logs, and
     receipts.

## Explicit Non-Actions

- No provider contact.
- No plugin/API call.
- No image generation.
- No image binary read.
- No output asset write.
- No `.env` or secret value read.
- No DailyNote write.
- No VCP memory write.
- No push, tag, release, or deploy.

## Validation Plan

- `git diff --check`
- `npm run validate:mvp`

Final validation status is recorded in `.agent_board/VALIDATION_LOG.md`.
