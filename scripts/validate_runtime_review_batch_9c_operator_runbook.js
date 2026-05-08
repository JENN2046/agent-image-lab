const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "Runtime Review Batch 9C operator runbook and resume capsule";
const previousPhase = "Runtime Review Batch 9A state freshness index";
const runbookDoc = "docs/227_runtime_review_batch_9c_operator_runbook_and_resume_capsule.md";
const activationContractDoc = "docs/225_runtime_review_batch_8d_sustained_autopilot_task_plan.md";
const freshnessDoc = "docs/226_runtime_review_batch_9a_state_freshness_index.md";

const requiredFiles = [
  runbookDoc,
  activationContractDoc,
  freshnessDoc,
  "README.md",
  "MANIFEST.md",
  "RELEASE_NOTES.md",
  "docs/00_project_roadmap.md",
  "tests/validation_checklist.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/VALIDATION_LOG.md"
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function includesAll(content, values) {
  return values.every((value) => content.includes(value));
}

function main() {
  const missing = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missing.length === 0, `Missing operator runbook files: ${missing.join(", ")}`);

  const contents = Object.fromEntries(
    requiredFiles.map((relativePath) => [relativePath, read(relativePath)])
  );
  const runbook = contents[runbookDoc];

  assert(
    includesAll(runbook, [
      currentPhase,
      previousPhase,
      activationContractDoc,
      freshnessDoc,
      "Five-minute Operator Runbook",
      "Safe Next Tasks",
      "Hard Gates",
      "Validation Commands",
      "Forbidden Outputs"
    ]),
    "Runbook must contain the resume capsule, safe next tasks, hard gates, validation commands, and forbidden output policy."
  );

  assert(
    includesAll(runbook, [
      "version_action_performed: false",
      "commit_performed: false",
      "tag_performed: false",
      "push_performed: false",
      "release_created: false"
    ]),
    "Runbook must preserve the no-version-action boundary."
  );

  assert(
    includesAll(runbook, [
      "real_vcpchat_read: false",
      "real_vcptoolbox_read: false",
      "plugin_called: false",
      "api_called: false",
      "daily_note_called: false",
      "vcp_memory_written: false",
      "image_created: false"
    ]),
    "Runbook must preserve no-execution and no-external-read boundaries."
  );

  assert(
    includesAll(runbook, [
      "raw_secret_values: true",
      "raw_private_paths: true",
      "raw_runtime_logs: true",
      "raw_plugin_output: true",
      "image_binaries: true",
      "customer_private_data: true"
    ]),
    "Runbook must forbid raw sensitive outputs."
  );

  const linkedFiles = [
    "README.md",
    "MANIFEST.md",
    "docs/00_project_roadmap.md",
    ".agent_board/HANDOFF.md"
  ];
  const missingRunbookRef = linkedFiles.filter(
    (relativePath) => !contents[relativePath].includes(runbookDoc)
  );
  assert(missingRunbookRef.length === 0, `Runbook link missing from: ${missingRunbookRef.join(", ")}`);

  const phaseFiles = [
    "README.md",
    "MANIFEST.md",
    "RELEASE_NOTES.md",
    "docs/00_project_roadmap.md",
    "tests/validation_checklist.md",
    ".agent_board/RUN_STATE.md",
    ".agent_board/HANDOFF.md",
    ".agent_board/TASK_QUEUE.md",
    ".agent_board/VALIDATION_LOG.md"
  ];
  const missingPhase = phaseFiles.filter(
    (relativePath) => !contents[relativePath].includes(currentPhase)
  );
  assert(missingPhase.length === 0, `Current phase missing from: ${missingPhase.join(", ")}`);

  assert(
    contents["tests/validation_checklist.md"].includes("scripts/validate_runtime_review_batch_9c_operator_runbook.js"),
    "Validation checklist must include the Batch 9C runbook validator."
  );

  const result = {
    passed: true,
    runtime_review_batch_9c_operator_runbook: {
      current_phase: currentPhase,
      previous_phase: previousPhase,
      runbook_doc: runbookDoc,
      activation_contract_doc: activationContractDoc,
      freshness_doc: freshnessDoc,
      top_level_links_present: true,
      current_phase_cross_checked: true,
      no_execution_boundary_preserved: true,
      no_version_action_boundary_preserved: true,
      forbidden_outputs_declared: true,
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
