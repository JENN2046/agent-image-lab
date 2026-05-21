# DECISIONS.md — Agent Image Lab Autopilot Overlay

## Decisions

### DECISION-AIL-AUTO-013 — Receipt registry and cost/rollback hardening

Context: Smart Standing Authorization v3 had envelope and receipt examples, but governance validation still depended on hardcoded receipt fixtures and did not yet require explicit cost and rollback structures.
Chosen: Add a receipt registry fixture as the local entry point for receipt validation, extend envelope budgets with cost fields, and extend receipts with cost accounting plus structured rollback.
Reason: Future real Amber provider/plugin/API/image/runtime actions need bounded cost, registry coverage, and rollback evidence before autonomous execution can be trusted.
Risk: A receipt could appear valid while omitting cost or irreversible-action evidence.
Mitigation: `scripts/validate_autopilot_governance_kernel.js` now iterates registry entries, checks cost accounting, checks rollback structure, preserves Amber-01 / Amber-02 protections, and keeps all real side-effect guard flags false.

### DECISION-AIL-AUTO-011 — Smart Standing Authorization v3 is the default startup model

Context: The project now has Smart Standing Authorization v3, the governance kernel, receipts, and Goal Compiler v1. Startup instructions still contained legacy A4.8 default wording.
Chosen: Make Smart Standing Authorization v3 — Budgeted Autonomy Envelope the default startup and autonomy model for future Codex sessions.
Reason: Every session should begin by compiling the goal, checking truth, assigning Green / Amber / Red lanes, applying the autonomy envelope, requiring receipts for meaningful Amber actions, and preserving Red Lane hard stops.
Compatibility: A4.8 is retained for compatibility only as the legacy local-safe rail and Green Lane substrate.
Mitigation: Validators check that AGENTS.md no longer declares A4.8 as the Default mode, that overlay and status surfaces declare v3 startup, and that Red Lane hard stops remain present.

### DECISION-AIL-AUTO-012 — Goal Compiler v1 route and task queue baseline

Context: Smart Autopilot v3 already has a governance kernel, autonomy envelope, and receipt validation, but it still needs a machine-verifiable way to compile a user goal into current truth, route options, selected route, near-term tasks, lane assignments, validation, and stop conditions.
Chosen: Add Goal Compiler v1 as Green Lane local infrastructure with goal, route plan, and task queue schemas, example fixtures, and `scripts/validate_autopilot_goal_compiler.js` wired into `scripts/validate_mvp.ps1`.
Reason: Future autonomous work should start from a checked goal/route/task queue baseline instead of prose-only planning.
Risk: If Red routes are accidentally copied into executable task queues, the compiler could turn blocked work into apparent permission.
Mitigation: The validator requires rejected Red routes, verifies that Red routes are excluded from executable tasks, keeps `push_allowed=false`, requires Amber tasks to include `receipt_required=true` and a non-empty `envelope_ref`, and checks all provider/plugin/API/image/memory/source-read/dependency/runtime execution signals remain false.

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

### DECISION-AIL-AUTO-009 — Smart Standing Authorization v3 budgeted autonomy envelope

Context: The project owner explicitly instructed that A5, provider/plugin/API/image, DailyNote/VCP memory, real manifest/VCPChat/VCPToolBox read, and dependency change should move from repeated permission prompts to standing authorization.
Chosen: Treat those categories as Smart Standing Authorization v3 Green/Amber/Red lanes. Standing owner authorization grants Codex a bounded autonomy envelope. Inside that envelope, Codex must not ask for step-by-step approval; it should plan, execute, validate, repair once when safe, record receipts, and continue until the goal is complete or a Red condition appears.
Policy ref: docs/STANDING_OWNER_AUTOMATIC_AUTHORIZATION_POLICY.md.
Default envelope: max_provider_calls=3; max_plugin_calls=3; max_api_calls=5; max_image_candidates=3; max_external_read_files=20; max_write_files=10; max_dependency_actions=2; max_retry_per_transient_failure=1; max_runtime_probe_minutes=10; overwrite_existing_files_allowed=false; secret_value_read_allowed=false; raw_private_data_print_allowed=false; push_allowed=false; tag_release_deploy_allowed=false; destructive_action_allowed=false.
Green Lane: docs/schema/validator/static prototype local maintenance, .agent_board sync, local validation, and small reversible fixes that do not touch external services, cost, memory, dependencies, or secrets.
Amber Lane: provider/plugin/API/image actions, real manifest/VCPChat/VCPToolBox exact reads, DailyNote/VCP memory writes, small dependency changes, production metadata writes, and bounded runtime/integration probes inside the envelope with receipts.
Receipt fields: task_id; lane; envelope_id; action_performed; target_systems; calls_used; files_read; files_written; dependency_actions_used; validation_run; validation_result; rollback_or_cleanup_available; next_auto_step_allowed; stop_reason.
Still gated as Red Lane: git push, tag, release, deploy, force push, history rewrite, destructive Git/filesystem actions, secret value reads or edits, raw private data/raw chat history exposure, external repository broad modification, wide VCPChat/VCPToolBox writes without exact scope, uncapped cost, unbounded loops, overwrite without explicit overwrite allowance, dependency changes without exact package/action list, and validation failure requiring non-obvious judgment.
Reason: The owner wants faster autonomous progress across production and integration surfaces.
Risk: Production actions can create cost, external side effects, long-term memory pollution, dependency churn, or private-source exposure if envelope budgets and receipts are skipped.
Mitigation: Standing authorization permits bounded autonomy, not unchecked execution; stop if a Red condition appears; do not print secrets, raw private data, or raw chat history; record receipts in status surfaces; run validation after changes; preserve exact-file staging and separate push authorization.

### DECISION-AIL-AUTO-010 — Smart Autopilot Governance Kernel validation baseline

Context: Smart Standing Authorization v3 needs machine-verifiable local infrastructure before any real Amber external action is attempted.
Chosen: Define a Green Lane local governance kernel with envelope and receipt schemas, example JSON fixtures, and `scripts/validate_autopilot_governance_kernel.js`, then wire it into `scripts/validate_mvp.ps1`.
Kernel components: Goal Compiler; Truth Model; Lane Classifier; Budget Engine; Receipt Recorder; Continuation Judge.
Reason: The autonomy envelope should be testable before it controls provider/plugin/API/image/memory/source-read/dependency/runtime actions.
Risk: If the receipt or budget model stays prose-only, future Amber actions could drift without machine checks.
Mitigation: The validator checks lane definitions, default budgets, Red gates, Amber receipt requirements, example fixtures, and no-real-A5 guard flags.
