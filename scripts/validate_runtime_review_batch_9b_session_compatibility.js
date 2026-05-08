const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const cleanGuard = Object.freeze({
  api_called: false,
  daily_note_called: false,
  vcp_plugin_called: false,
  disk_write_performed: false,
  image_file_created: false
});

const compatibilityDoc = "docs/228_runtime_review_batch_9b_runtime_session_compatibility_matrix.md";
const legacyFixturePath = "tests/schema_examples/runtime_review_session_v1_legacy_minimal.example.json";
const currentFixturePath = "tests/schema_examples/runtime_review_session_v1_current_draft_rich.example.json";
const currentPhase = "Runtime Review Batch 9B runtime session compatibility matrix";

const optionalDraftRichBlocks = [
  "batch_decision_draft",
  "a5_preauthorization_review_package_draft",
  "human_override_traceability_draft",
  "accepted_candidate_delivery_package_draft",
  "inactive_authorization_capsules_draft",
  "runtime_review_state_draft",
  "local_commit_scope_plan_draft",
  "bridge_mock_roundtrip_candidate_draft",
  "real_bridge_authorization_package_draft",
  "plugin_reliability_prompt_discipline_draft",
  "memory_write_completion_candidate_draft",
  "single_real_generation_retry_gate_draft",
  "real_memory_write_authorization_package_draft",
  "asset_archive_candidate_draft"
];

const currentDraftRichBlocks = [
  "batch_review_summary_draft",
  "batch_decision_draft",
  "risk_review_summary_draft",
  "a5_preauthorization_review_package_draft",
  "human_inspection_checklist_draft",
  "human_override_traceability_draft",
  "accepted_candidate_delivery_package_draft",
  "inactive_authorization_capsules_draft",
  "runtime_review_state_draft",
  "local_commit_scope_plan_draft",
  "bridge_mock_roundtrip_candidate_draft",
  "real_bridge_authorization_package_draft",
  "plugin_reliability_prompt_discipline_draft",
  "memory_write_completion_candidate_draft",
  "single_real_generation_retry_gate_draft",
  "real_memory_write_authorization_package_draft",
  "asset_archive_candidate_draft"
];

const requiredFalseFlags = [
  "side_effects_performed",
  "plugin_called",
  "api_called",
  "daily_note_called",
  "vcp_memory_written",
  "image_created"
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
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

function stableStringify(value) {
  if (value === undefined) return "null";
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function payloadForFingerprint(payload) {
  const nextPayload = JSON.parse(JSON.stringify(payload || {}));
  delete nextPayload.session_fingerprint;
  delete nextPayload.session_fingerprint_cn;
  return nextPayload;
}

function fingerprintString(value) {
  const text = stableStringify(value);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function guardIsClean(guard) {
  if (!guard || typeof guard !== "object") return false;
  const keys = Object.keys(cleanGuard);
  const observedKeys = Object.keys(guard);
  return observedKeys.every((key) => keys.includes(key)) && keys.every((key) => guard[key] === cleanGuard[key]);
}

function assertBaseV1Package(payload, label) {
  assert(payload.package_status === "draft_only", `${label} must stay draft_only.`);
  assert(payload.export_format === "runtime_review_session_v1", `${label} must use runtime_review_session_v1.`);
  assert(typeof payload.session_id === "string" && payload.session_id.length > 0, `${label} must include session_id.`);
  assert(typeof payload.task_id === "string" && payload.task_id.length > 0, `${label} must include task_id.`);
  assert(typeof payload.case_id === "string" && payload.case_id.length > 0, `${label} must include case_id.`);
  assert(Array.isArray(payload.review_session_snapshot?.review_queue), `${label} must include review_session_snapshot.review_queue.`);
  assert(payload.review_session_snapshot.review_queue.length > 0, `${label} must include at least one queue item.`);
  assert(guardIsClean(payload.prototype_guard), `${label} must include a clean prototype_guard.`);
  for (const flag of requiredFalseFlags) {
    assert(payload[flag] === false, `${label} must keep ${flag}=false.`);
  }
  const expectedFingerprint = fingerprintString(payloadForFingerprint(payload));
  assert(payload.session_fingerprint === expectedFingerprint, `${label} session_fingerprint must match ${expectedFingerprint}.`);
  assert(payload.session_fingerprint_cn === `会话指纹：${expectedFingerprint}`, `${label} session_fingerprint_cn must match.`);
}

function assertOptionalGuardsClean(payload, label) {
  for (const blockName of optionalDraftRichBlocks) {
    const block = payload[blockName];
    if (block === undefined) continue;
    if (Object.prototype.hasOwnProperty.call(block, "no_execution_guard")) {
      assert(guardIsClean(block.no_execution_guard), `${label}.${blockName}.no_execution_guard must be clean.`);
    }
  }
}

function assertLegacyFixture(payload) {
  assertBaseV1Package(payload, "legacy fixture");
  assert(payload.compatibility_profile === "legacy_minimal", "Legacy fixture must declare legacy_minimal profile.");
  assert(payload.compatibility_status === "accepted_legacy_minimal", "Legacy fixture must declare accepted legacy status.");
  assert(payload.new_draft_blocks_present === false, "Legacy fixture must declare that new draft blocks are absent.");
  for (const blockName of currentDraftRichBlocks) {
    assert(payload[blockName] === undefined, `Legacy fixture must omit ${blockName}.`);
  }
  assertOptionalGuardsClean(payload, "legacy fixture");
  assert(
    payload.compatibility_notes_cn.every((text) => /[\u4e00-\u9fff]/.test(text)),
    "Legacy fixture compatibility notes must be Chinese."
  );
}

function assertCurrentFixture(payload) {
  assertBaseV1Package(payload, "current fixture");
  assert(payload.compatibility_profile === "current_draft_rich", "Current fixture must declare current_draft_rich profile.");
  assert(payload.compatibility_status === "accepted_current_draft_rich", "Current fixture must declare accepted current status.");
  assert(payload.new_draft_blocks_present === true, "Current fixture must declare that new draft blocks are present.");
  for (const blockName of currentDraftRichBlocks) {
    assert(payload[blockName] && typeof payload[blockName] === "object", `Current fixture must include ${blockName}.`);
    assert(
      guardIsClean(payload[blockName].no_execution_guard),
      `Current fixture must include clean no_execution_guard for ${blockName}.`
    );
  }
  assertOptionalGuardsClean(payload, "current fixture");
  assert(
    payload.compatibility_notes_cn.every((text) => /[\u4e00-\u9fff]/.test(text)),
    "Current fixture compatibility notes must be Chinese."
  );
}

function main() {
  const requiredFiles = [
    compatibilityDoc,
    legacyFixturePath,
    currentFixturePath,
    "review_console/runtime_prototype/app.js",
    "review_console/runtime_prototype/README.md",
    "tests/validation_checklist.md",
    "README.md",
    "MANIFEST.md",
    "RELEASE_NOTES.md",
    "docs/00_project_roadmap.md",
    ".agent_board/RUN_STATE.md",
    ".agent_board/HANDOFF.md",
    ".agent_board/TASK_QUEUE.md",
    ".agent_board/VALIDATION_LOG.md"
  ];
  const missing = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missing.length === 0, `Missing Batch 9B compatibility files: ${missing.join(", ")}`);

  const doc = read(compatibilityDoc);
  const appJs = read("review_console/runtime_prototype/app.js");
  const runtimeReadme = read("review_console/runtime_prototype/README.md");
  const validationChecklist = read("tests/validation_checklist.md");
  const topLevelReadme = read("README.md");
  const manifest = read("MANIFEST.md");
  const releaseNotes = read("RELEASE_NOTES.md");
  const roadmap = read("docs/00_project_roadmap.md");
  const runState = read(".agent_board/RUN_STATE.md");
  const handoff = read(".agent_board/HANDOFF.md");
  const taskQueue = read(".agent_board/TASK_QUEUE.md");
  const validationLog = read(".agent_board/VALIDATION_LOG.md");
  const legacyFixture = readJson(legacyFixturePath);
  const currentFixture = readJson(currentFixturePath);

  assert(
    includesAll(doc, [
      currentPhase,
      "runtime_review_session_v1",
      "legacy_minimal",
      "current_draft_rich",
      "Missing-field Fallback Rules",
      legacyFixturePath,
      currentFixturePath,
      "future format"
    ]),
    "Compatibility doc must define formats, fallback rules, fixtures, and future version policy."
  );
  assert(
    includesAll(doc, [
      "real_vcpchat_read: false",
      "real_vcptoolbox_read: false",
      "plugin_called: false",
      "api_called: false",
      "daily_note_called: false",
      "vcp_memory_written: false",
      "image_created: false",
      "version_action_performed: false"
    ]),
    "Compatibility doc must preserve no-execution/no-version boundaries."
  );
  assert(
    includesAll(appJs, [
      "export_format: \"runtime_review_session_v1\"",
      "const optionalImportGuardFields",
      "if (draft === undefined) return true;",
      "payload.session_fingerprint !== expectedFingerprint",
      "导入草案包含真实执行标记"
    ]),
    "Runtime app must expose v1 export and optional draft-rich guard fallback behavior."
  );
  assert(
    includesAll(runtimeReadme, [
      "Runtime Session Compatibility Matrix",
      compatibilityDoc,
      legacyFixturePath,
      currentFixturePath,
      "runtime_review_session_v1"
    ]),
    "Runtime README must link the Batch 9B compatibility matrix and fixtures."
  );
  assert(
    includesAll(validationChecklist, [
      "Runtime Review Batch 9B",
      "scripts/validate_runtime_review_batch_9b_session_compatibility.js",
      legacyFixturePath,
      currentFixturePath
    ]),
    "Validation checklist must include Batch 9B compatibility checks."
  );

  for (const [relativePath, content] of [
    ["README.md", topLevelReadme],
    ["MANIFEST.md", manifest],
    ["RELEASE_NOTES.md", releaseNotes],
    ["docs/00_project_roadmap.md", roadmap],
    [".agent_board/RUN_STATE.md", runState],
    [".agent_board/HANDOFF.md", handoff],
    [".agent_board/TASK_QUEUE.md", taskQueue],
    [".agent_board/VALIDATION_LOG.md", validationLog]
  ]) {
    assert(content.includes(currentPhase), `${relativePath} must include the Batch 9B current phase.`);
  }

  assertLegacyFixture(legacyFixture);
  assertCurrentFixture(currentFixture);

  const result = {
    passed: true,
    runtime_review_batch_9b_session_compatibility: {
      current_phase: currentPhase,
      compatibility_doc: compatibilityDoc,
      legacy_fixture: legacyFixturePath,
      current_fixture: currentFixturePath,
      legacy_fixture_status: legacyFixture.compatibility_status,
      current_fixture_status: currentFixture.compatibility_status,
      export_format: "runtime_review_session_v1",
      legacy_missing_draft_rich_blocks_accepted: true,
      current_draft_rich_blocks_guarded: true,
      fingerprint_checks_passed: true,
      no_execution_boundary_preserved: true,
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
