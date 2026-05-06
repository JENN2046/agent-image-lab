const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v7.40 local A4/A5 autonomy mode alignment";
const previousPhase = "v7.39 external remote-debug verification script creation authorization point";
const baselineHeadShort = "5a7f5ba";

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function includesAll(content, values) {
  return values.every((value) => content.includes(value));
}

function excludesAll(content, values) {
  return values.every((value) => !content.includes(value));
}

function excludesExactTrueFlags(content, keys) {
  const lines = content.split(/\r?\n/).map((line) => line.trim());
  return keys.every((key) => !lines.some((line) => line === `${key}: true`));
}

function main() {
  const requiredFiles = [
    "AGENTS.md",
    "docs/192_v7_40_local_a4_a5_autonomy_alignment.md",
    "tests/schema_examples/v7_40_local_a4_a5_autonomy_alignment.example.yaml",
    "scripts/validate_v7_40_local_a4_a5_autonomy_alignment.js",
    "docs/191_v7_39_external_remote_debug_verification_script_creation_authorization_point.md",
    "README.md",
    "MANIFEST.md",
    "RELEASE_NOTES.md",
    "docs/00_project_roadmap.md",
    "tests/validation_checklist.md",
    ".agent_board/RUN_STATE.md",
    ".agent_board/HANDOFF.md",
    ".agent_board/CHECKPOINT.md",
    ".agent_board/TASK_QUEUE.md",
    ".agent_board/VALIDATION_LOG.md",
    ".agent_board/BLOCKERS.md"
  ];
  const missing = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missing.length === 0, `Missing v7.40 autonomy alignment files: ${missing.join(", ")}`);

  const agents = read("AGENTS.md");
  const record = read("docs/192_v7_40_local_a4_a5_autonomy_alignment.md");
  const schema = read("tests/schema_examples/v7_40_local_a4_a5_autonomy_alignment.example.yaml");
  const readme = read("README.md");
  const manifest = read("MANIFEST.md");
  const releaseNotes = read("RELEASE_NOTES.md");
  const roadmap = read("docs/00_project_roadmap.md");
  const checklist = read("tests/validation_checklist.md");
  const runState = read(".agent_board/RUN_STATE.md");
  const handoff = read(".agent_board/HANDOFF.md");
  const checkpoint = read(".agent_board/CHECKPOINT.md");
  const taskQueue = read(".agent_board/TASK_QUEUE.md");
  const validationLog = read(".agent_board/VALIDATION_LOG.md");
  const blockers = read(".agent_board/BLOCKERS.md");
  const currentContents = [record, schema].join("\n");
  const board = [runState, handoff, checkpoint, taskQueue, validationLog, blockers].join("\n");
  const indexes = [readme, manifest, releaseNotes, roadmap, checklist].join("\n");

  const a4DefaultRecorded = includesAll(agents, [
    "The default local automation mode is:",
    "A4 — Sustained Local Autopilot",
    "### A4 — Sustained Local Autopilot",
    "Default local mode.",
    "Continue safe, local, reversible work inside the current project repository",
    "Modify documentation, schema, dry-run contracts, authorization templates, validation checklists, and static prototype files when the task is in scope",
    "Perform remote writes, pushes, deployments, releases, or destructive operations without separate explicit authorization"
  ]);

  const a5ProductionRecorded = includesAll(agents, [
    "### A5 — Autonomous Production Execution",
    "A5 is real production-grade autonomous execution.",
    "within an explicit authorization scope",
    "Analyze real source code",
    "Modify real integration code",
    "Create real IPC / preload / renderer integration code",
    "Create real Adapter execution entrypoints",
    "Generate real images",
    "Commit production changes",
    "Create tags",
    "Push",
    "Generate release packages",
    "A5 requires a separate explicit authorization package",
    "Without an active A5 authorization package, every A5 action remains a Hard Stop."
  ]);

  const hardStopExceptionRecorded = includesAll(agents, [
    "Exception: an action listed below may proceed only when an active A5 authorization package explicitly covers that exact action",
    "Without explicit user authorization, do not enter A5."
  ]);

  const phaseRecorded = includesAll(currentContents, [
    currentPhase,
    previousPhase,
    "current_head: 5a7f5ba",
    "origin_master_short: 5a7f5ba",
    "local_head_short: 5a7f5ba",
    "docs/191_v7_39_external_remote_debug_verification_script_creation_authorization_point.md",
    "v7.41 External Remote Debug Verification Script Creation Record"
  ]);

  const a4A5SemanticsRecorded = includesAll(currentContents, [
    "root_agents_default_local_mode: \"A4 — Sustained Local Autopilot\"",
    "production_mode_name: \"A5 — Autonomous Production Execution\"",
    "a4_default_local_autopilot: true",
    "a5_real_production_execution: true",
    "a5_active_authorization_package_present: false",
    "a5_actions_authorized_now: false",
    "requires_active_authorization_package: true",
    "read_real_vcpchat",
    "read_real_vcptoolbox",
    "analyze_real_source_code",
    "create_real_adapter_execution_entrypoint",
    "call_real_vcp_plugin",
    "generate_real_image",
    "write_daily_note",
    "write_vcp_memory",
    "commit_production_changes",
    "push",
    "generate_release_packages"
  ]);

  const requiredA5PackageRecorded = includesAll(currentContents, [
    "required_a5_authorization_package",
    "authorization_id",
    "authorized_by",
    "authorized_at",
    "target_systems",
    "exact_allowed_paths_or_objects",
    "exact_allowed_commands_or_operations",
    "forbidden_paths_or_operations",
    "write_boundaries",
    "validation_requirements",
    "rollback_path",
    "reviewer",
    "stop_conditions"
  ]);

  const forbiddenTrueKeys = [
    "a5_active_authorization_package_present",
    "a5_actions_authorized_now",
    "a5_authorization_package_created",
    "a5_authorization_package_active",
    "real_vcpchat_read",
    "real_vcptoolbox_read",
    "real_manifest_read",
    "real_source_analyzed",
    "vcpchat_modified",
    "vcptoolbox_modified",
    "real_ipc_preload_renderer_created",
    "real_adapter_execution_entrypoint_created",
    "remote_debug_script_created",
    "app_launch_performed",
    "cdp_access_performed",
    "plugin_called",
    "api_called",
    "daily_note_called",
    "vcp_memory_written",
    "image_created",
    "production_commit_performed",
    "tag_created",
    "push_performed",
    "release_package_generated",
    "github_release_performed"
  ];
  const noForbiddenTrue = excludesExactTrueFlags(currentContents, forbiddenTrueKeys);

  const noRawLocalPath = excludesAll(currentContents, [
    "A:\\VCP",
    "A:/VCP",
    "C:\\Users",
    "C:/Users"
  ]);

  const indexesCurrent = includesAll(indexes, [
    "v7.40 local A4/A5 autonomy mode alignment",
    "docs/192_v7_40_local_a4_a5_autonomy_alignment.md",
    "tests/schema_examples/v7_40_local_a4_a5_autonomy_alignment.example.yaml",
    "scripts/validate_v7_40_local_a4_a5_autonomy_alignment.js"
  ]);

  const boardCurrent = includesAll(board, [
    currentPhase,
    "A4 — Sustained Local Autopilot",
    "A5 — Autonomous Production Execution",
    "Local A4 default commit: 2450f85",
    "Local A5 production execution commit: da18330",
    `Origin master baseline: ${baselineHeadShort}`,
    `Local head before v7.40 batch: ${baselineHeadShort}`,
    "pending local commits before v7.40: 0",
    "Local pending commit chain before v7.40: none",
    "master...origin/master before v7.40: 0 0",
    "node scripts/validate_v7_40_local_a4_a5_autonomy_alignment.js",
    "Without an active A5 authorization package, production actions remain blocked"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v7.40 Local A4/A5 Autonomy Mode Alignment 检查",
    "`AGENTS.md` 默认本地自动化模式为 `A4 — Sustained Local Autopilot`",
    "`AGENTS.md` 包含 `A5 — Autonomous Production Execution`",
    "a5_active_authorization_package_present=false",
    "Without an active A5 authorization package",
    "`node scripts/validate_v7_40_local_a4_a5_autonomy_alignment.js` 通过"
  ]);

  assert(a4DefaultRecorded, "AGENTS.md must record A4 as default local sustained autopilot.");
  assert(a5ProductionRecorded, "AGENTS.md must define A5 as autonomous production execution.");
  assert(hardStopExceptionRecorded, "AGENTS.md must keep the active A5 authorization package hard-stop exception.");
  assert(phaseRecorded, "v7.40 phase and baseline must be recorded.");
  assert(a4A5SemanticsRecorded, "v7.40 record and schema must capture A4/A5 semantics.");
  assert(requiredA5PackageRecorded, "v7.40 must record required A5 authorization package fields.");
  assert(noForbiddenTrue, "v7.40 must not set any A5 execution flag to true.");
  assert(noRawLocalPath, "v7.40 must not save raw local VCP or user paths.");
  assert(indexesCurrent, "Top-level indexes must reference v7.40 autonomy alignment.");
  assert(boardCurrent, "Agent board must be synchronized to v7.40 autonomy alignment.");
  assert(checklistCurrent, "Validation checklist must include v7.40 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_40_local_a4_a5_autonomy_alignment: {
      phase_recorded: phaseRecorded,
      a4_default_recorded: a4DefaultRecorded,
      a5_production_recorded: a5ProductionRecorded,
      hard_stop_exception_recorded: hardStopExceptionRecorded,
      required_a5_package_recorded: requiredA5PackageRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      indexes_current: indexesCurrent,
      agent_board_current: boardCurrent,
      checklist_current: checklistCurrent,
      origin_master_short: baselineHeadShort,
      local_head_before_batch: baselineHeadShort,
      pending_local_commits_before_batch: 0,
      a5_actions_authorized_now: false,
      next_safe_phase: "v7.41 External Remote Debug Verification Script Creation Record"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
