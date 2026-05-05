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
