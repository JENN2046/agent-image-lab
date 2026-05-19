# DECISIONS.md — Agent Image Lab Autopilot Overlay

## Decisions

### DECISION-AIL-AUTO-001 — Overlay, not overwrite

Context: The universal autopilot pack contains a root `AGENTS.md`, but Agent Image Lab already has project-specific rules.
Chosen: Provide `AGENTS.autopilot-overlay.md` instead of overwriting root `AGENTS.md`.
Reason: Prevent loss of project-specific memory, VCP, Review Console, and no-execution policies.
Risk: Codex will not automatically read overlay unless instructed.
Mitigation: Prompt Codex to read both files.

### DECISION-AIL-AUTO-002 — No-external-read by default

Context: Agent Image Lab is close to real VCPChat/VCPToolBox read gates.
Chosen: Default all external reads to hard stop.
Reason: Prevent accidental source, config, or private path exposure.

### DECISION-AIL-AUTO-003 — Validation warns on forbidden terms

Context: Project docs intentionally mention forbidden terms like `index.js` or `A:\\VCP` in negative checks.
Chosen: Validation scripts warn on these patterns rather than always fail.
Reason: Avoid false positives while preserving human review visibility.

### DECISION-AIL-AUTO-004 — Historical real-execution records are explicit exceptions

Context: The repository contains user-authorized historical real-execution records where API-called and VCP-plugin-called flags are expected evidence, not current execution permission.
Chosen: The overlay local validation helper skips only the known archived real-execution record files for hard false-flag scanning.
Reason: Preserve strict scanning for ordinary files while avoiding false failures on validated historical records.
Risk: Future real-execution record files must be consciously added to the allowlist after review.
Mitigation: `scripts/validate_mvp.ps1` remains the authoritative project validation gate, and new real execution still requires explicit authorization.

### DECISION-AIL-AUTO-005 — Keep overlay separate from root AGENTS.md

Context: The overlay has been installed, but the root `AGENTS.md` already contains project-specific policy.
Chosen: Keep `AGENTS.autopilot-overlay.md` as a separate overlay for now.
Reason: Avoid accidental policy overwrite or broad behavioral changes.
Risk: Future agents must read both files to get the full local autopilot context.
Mitigation: `.agent_board/HANDOFF.md` and `README_AGENT_IMAGE_LAB_AUTOPILOT.md` both instruct future sessions to read both files.

### DECISION-AIL-AUTO-006 — Recalibrate board before sustained autopilot

Context: After v7.221 mainline quality stop, `.agent_board` still pointed at the old v7.170 validator-governance route.
Chosen: Treat `.agent_board` current-state calibration as the next task before further autopilot progression.
Reason: Sustained autopilot should steer from current repository reality, not stale handoff text.
Risk: Over-updating the board could erase useful historical records.
Mitigation: Replace only current-state rail files and preserve checkpoint/validation history by prepending the new calibration entry.

### DECISION-AIL-AUTO-007 — Quality stop overrides momentum

Context: Smart Commander and static mockup tracks reached stable quality stops, and v7.221 declared that repetitive A4 docs-only continuation should not proceed by default.
Chosen: Continue only when a next task creates new product value, or when explicit A5/runtime/version authorization exists and preflight passes.
Reason: Autonomy should improve the project, not generate redundant gates.
Risk: Useful maintenance could be delayed if value is not recognized.
Mitigation: Commander may still run a value test and propose or execute a small safe local task when repository reality shows a real gap.

### DECISION-AIL-AUTO-008 — Guarded local auto-commit authorized

Context: The project owner explicitly authorized future local commits without repeated approval when the work meets the project standard.
Chosen: Codex may automatically create local commits for coherent completed local work when all guarded commit conditions are met.
Required conditions: exact-file staging only; no `git add .`; validation passed or documented; no secrets; no `.env` changes; no dependency changes unless separately authorized; no A5/provider/plugin/API/image generation/DailyNote/VCP memory/runtime/real manifest/VCPChat/VCPToolBox action; no tag/release/deploy; no user-owned unrelated changes; no destructive action; diff inspected.
Still not authorized: push, tag, release, deploy, force push, destructive Git/filesystem actions, provider/plugin/API calls, image generation, DailyNote/VCP memory writes, runtime integration, real manifest reads, VCPChat/VCPToolBox reads, dependency changes, or secrets edits.
Reason: Reduce unnecessary project-owner interruptions while preserving safety boundaries.
Risk: A future agent may over-broaden "local" work into unrelated commits.
Mitigation: Commits must remain exact-file, coherent, task-scoped, validated, and reviewable; remote actions remain separately authorized.
