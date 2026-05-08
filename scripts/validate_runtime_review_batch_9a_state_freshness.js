const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "Runtime Review Batch 9A state freshness index";
const previousPhase = "Runtime Review Batch 8D sustained autopilot task plan";
const freshnessDoc = "docs/226_runtime_review_batch_9a_state_freshness_index.md";

const requiredFiles = [
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
  assert(missing.length === 0, `Missing freshness files: ${missing.join(", ")}`);

  const contents = Object.fromEntries(
    requiredFiles.map((relativePath) => [relativePath, read(relativePath)])
  );
  const canonical = contents[freshnessDoc];

  assert(
    includesAll(canonical, [
      currentPhase,
      previousPhase,
      "baseline_head_short_before_batch: 2d34eb0",
      "current_state_discoverable_from_single_doc: true",
      "version_action_performed: false",
      "commit_performed: false",
      "push_performed: false"
    ]),
    "Freshness doc must define the current phase, baseline context, and no-version-action boundary."
  );

  assert(
    includesAll(canonical, [
      "real_vcpchat_read: false",
      "real_vcptoolbox_read: false",
      "plugin_called: false",
      "api_called: false",
      "daily_note_called: false",
      "vcp_memory_written: false",
      "image_created: false"
    ]),
    "Freshness doc must preserve no-execution and no-external-read boundaries."
  );

  assert(
    includesAll(canonical, [".omc/", "not be staged automatically", "omc_staged_automatically: false"]),
    "Freshness doc must record .omc/ as local tooling noise that is not staged automatically."
  );

  const crossCheckedFiles = requiredFiles.filter((relativePath) => relativePath !== freshnessDoc);
  const missingCurrentPhase = crossCheckedFiles.filter(
    (relativePath) => !contents[relativePath].includes(currentPhase)
  );
  assert(
    missingCurrentPhase.length === 0,
    `Current phase phrase missing from: ${missingCurrentPhase.join(", ")}`
  );

  const missingFreshnessDocRef = [
    "README.md",
    "MANIFEST.md",
    "docs/00_project_roadmap.md",
    "tests/validation_checklist.md",
    ".agent_board/HANDOFF.md"
  ].filter((relativePath) => !contents[relativePath].includes(freshnessDoc));
  assert(
    missingFreshnessDocRef.length === 0,
    `Freshness doc reference missing from: ${missingFreshnessDocRef.join(", ")}`
  );

  assert(
    contents["tests/validation_checklist.md"].includes("scripts/validate_runtime_review_batch_9a_state_freshness.js"),
    "Validation checklist must include the Batch 9A state freshness validator."
  );

  assert(
    contents[".agent_board/TASK_QUEUE.md"].includes("Batch 9C"),
    "Task queue must point the next local batch to Batch 9C after Batch 9A."
  );

  assert(
    contents[".agent_board/VALIDATION_LOG.md"].includes("node scripts/validate_runtime_review_batch_9a_state_freshness.js"),
    "Validation log must record the Batch 9A validator command."
  );

  const result = {
    passed: true,
    runtime_review_batch_9a_state_freshness: {
      current_phase: currentPhase,
      previous_phase: previousPhase,
      canonical_doc: freshnessDoc,
      cross_checked_files: crossCheckedFiles,
      missing_current_phase_count: 0,
      freshness_doc_references_present: true,
      omc_local_noise_policy_recorded: true,
      no_execution_boundary_preserved: true,
      version_action_performed: false,
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
