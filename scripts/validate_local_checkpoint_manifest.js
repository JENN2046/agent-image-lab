const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const checkpointFiles = [
  "docs/117_v4_0_runtime_contract_smoke_hardening.md",
  "docs/118_v4_1_runtime_guard_unit_validation.md",
  "docs/119_v4_2_runtime_validation_suite.md",
  "docs/120_v4_3_autopilot_overlay_installation.md",
  "docs/121_v4_4_agent_board_state_validation.md",
  "docs/122_v4_5_local_checkpoint_readiness.md",
  "tests/schema_examples/v4_0_runtime_contract_smoke_hardening.example.yaml",
  "tests/schema_examples/v4_1_runtime_guard_unit_validation.example.yaml",
  "tests/schema_examples/v4_2_runtime_validation_suite.example.yaml",
  "tests/schema_examples/v4_3_autopilot_overlay_installation.example.yaml",
  "tests/schema_examples/v4_4_agent_board_state_validation.example.yaml",
  "tests/schema_examples/v4_5_local_checkpoint_readiness.example.yaml"
];

const overlayFiles = [
  "AGENTS.autopilot-overlay.md",
  "README_AGENT_IMAGE_LAB_AUTOPILOT.md",
  "AUTOPILOT_REFACTOR_REPORT.md",
  "codex/AGENT_IMAGE_LAB_AUTOPILOT_PROMPT.md",
  ".agent_board/BLOCKERS.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/DECISIONS.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md"
];

const validationFiles = [
  "scripts/validate-agent-image-lab-local.ps1",
  "scripts/validate-agent-image-lab-local.sh",
  "scripts/validate_agent_board_state.js",
  "scripts/validate_local_checkpoint_manifest.js",
  "scripts/validate_runtime_guard_unit.js",
  "scripts/validate_runtime_prototype_smoke.js",
  "scripts/validate_runtime_prototype_suite.js"
];

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function missingFrom(paths) {
  return paths.filter((relativePath) => !exists(relativePath));
}

function main() {
  const missingCheckpointFiles = missingFrom(checkpointFiles);
  const missingOverlayFiles = missingFrom(overlayFiles);
  const missingValidationFiles = missingFrom(validationFiles);
  assert(missingCheckpointFiles.length === 0, `Missing checkpoint files: ${missingCheckpointFiles.join(", ")}`);
  assert(missingOverlayFiles.length === 0, `Missing overlay files: ${missingOverlayFiles.join(", ")}`);
  assert(missingValidationFiles.length === 0, `Missing validation files: ${missingValidationFiles.join(", ")}`);

  const runState = read(".agent_board/RUN_STATE.md");
  const handoff = read(".agent_board/HANDOFF.md");
  const validationLog = read(".agent_board/VALIDATION_LOG.md");
  const roadmap = read("docs/00_project_roadmap.md");

  const localUncommittedStateDeclared =
    runState.includes("local uncommitted changes present") &&
    handoff.includes("local uncommitted changes present");
  const commitTagPushNotAuthorized =
    runState.includes("Commit/tag/push authorization: not active") &&
    handoff.includes("Commit/tag/push/release require explicit separate authorization");
  const validationSnapshotPresent =
    validationLog.includes("scripts/validate_mvp.ps1") &&
    validationLog.includes("scripts/validate-agent-image-lab-local.ps1") &&
    validationLog.includes("node scripts/validate_runtime_prototype_suite.js") &&
    validationLog.includes("node scripts/validate_agent_board_state.js") &&
    validationLog.includes("node scripts/validate_local_checkpoint_manifest.js") &&
    validationLog.includes("git diff --check");
  const roadmapCurrentStateUpdated = roadmap.includes("v4.5 local checkpoint readiness");

  assert(localUncommittedStateDeclared, "Checkpoint manifest must declare local uncommitted state.");
  assert(commitTagPushNotAuthorized, "Checkpoint manifest must preserve commit/tag/push authorization gate.");
  assert(validationSnapshotPresent, "Checkpoint manifest must include validation snapshot.");
  assert(roadmapCurrentStateUpdated, "Roadmap must mention v4.5 local checkpoint readiness.");

  const result = {
    passed: true,
    local_checkpoint_manifest: {
      checkpoint_files_present: true,
      overlay_files_present: true,
      validation_files_present: true,
      local_uncommitted_state_declared: localUncommittedStateDeclared,
      commit_tag_push_not_authorized: commitTagPushNotAuthorized,
      validation_snapshot_present: validationSnapshotPresent,
      roadmap_current_state_updated: roadmapCurrentStateUpdated,
      external_network_required: false,
      external_service_required: false,
      file_write_performed: false
    }
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
