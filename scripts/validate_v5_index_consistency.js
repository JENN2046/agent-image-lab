const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const v5Records = [
  {
    id: "v5.0",
    label: "v5.0 post-merge delivery readiness index",
    doc: "docs/127_v5_0_delivery_readiness_index.md",
    schema: "tests/schema_examples/v5_0_delivery_readiness.example.yaml"
  },
  {
    id: "v5.1",
    label: "v5.1 runtime delivery surface validation",
    doc: "docs/128_v5_1_runtime_delivery_surface.md",
    schema: "tests/schema_examples/v5_1_runtime_delivery_surface.example.yaml"
  },
  {
    id: "v5.2",
    label: "v5.2 adapter delivery surface validation",
    doc: "docs/129_v5_2_adapter_delivery_surface.md",
    schema: "tests/schema_examples/v5_2_adapter_delivery_surface.example.yaml"
  },
  {
    id: "v5.3",
    label: "v5.3 review console adapter handoff validation",
    doc: "docs/130_v5_3_review_console_adapter_handoff.md",
    schema: "tests/schema_examples/v5_3_review_console_adapter_handoff.example.yaml"
  },
  {
    id: "v5.4",
    label: "v5.4 local sync readiness preflight",
    doc: "docs/131_v5_4_local_sync_readiness.md",
    schema: "tests/schema_examples/v5_4_local_sync_readiness.example.yaml"
  },
  {
    id: "v5.5",
    label: "v5.5 post-commit reconciliation checkpoint",
    doc: "docs/132_v5_5_post_commit_reconciliation.md",
    schema: "tests/schema_examples/v5_5_post_commit_reconciliation.example.yaml"
  },
  {
    id: "v5.6",
    label: "v5.6 v5 index consistency validation",
    doc: "docs/133_v5_6_v5_index_consistency_validation.md",
    schema: "tests/schema_examples/v5_6_v5_index_consistency_validation.example.yaml"
  },
  {
    id: "v5.7",
    label: "v5.7 local batch commit-readiness preflight",
    doc: "docs/134_v5_7_local_batch_commit_readiness.md",
    schema: "tests/schema_examples/v5_7_local_batch_commit_readiness.example.yaml"
  },
  {
    id: "v5.8",
    label: "v5.8 handoff freshness validation",
    doc: "docs/135_v5_8_handoff_freshness_validation.md",
    schema: "tests/schema_examples/v5_8_handoff_freshness_validation.example.yaml"
  },
  {
    id: "v5.9",
    label: "v5.9 expanded v5 index consistency validation",
    doc: "docs/136_v5_9_expanded_v5_index_consistency.md",
    schema: "tests/schema_examples/v5_9_expanded_v5_index_consistency.example.yaml"
  }
];

const validationScripts = [
  "scripts/validate_v5_delivery_readiness.js",
  "scripts/validate_runtime_delivery_surface.js",
  "scripts/validate_adapter_delivery_surface.js",
  "scripts/validate_review_console_adapter_handoff.js",
  "scripts/validate_v5_local_sync_readiness.js",
  "scripts/validate_v5_post_commit_reconciliation.js",
  "scripts/validate_v5_index_consistency.js",
  "scripts/validate_v5_local_batch_commit_readiness.js",
  "scripts/validate_v5_handoff_freshness.js"
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

function includesAll(content, values) {
  return values.every((value) => content.includes(value));
}

function includesAllPathVariants(content, values) {
  return values.every((value) => content.includes(value) || content.includes(value.replace(/\//g, "\\")));
}

function allFilesExist(values) {
  return values.every((value) => exists(value));
}

function main() {
  const docs = v5Records.map((record) => record.doc);
  const schemas = v5Records.map((record) => record.schema);
  const labels = v5Records.map((record) => record.label);
  const requiredTopFiles = [
    "README.md",
    "MANIFEST.md",
    "RELEASE_NOTES.md",
    "docs/00_project_roadmap.md",
    "tests/validation_checklist.md",
    "scripts/validate_mvp.ps1",
    "scripts/validate_local_commit_scope.js",
    ".agent_board/RUN_STATE.md",
    ".agent_board/HANDOFF.md",
    ".agent_board/VALIDATION_LOG.md",
    ".agent_board/TASK_QUEUE.md"
  ];

  const docsPresent = allFilesExist(docs);
  const schemaExamplesPresent = allFilesExist(schemas);
  const validationScriptsPresent = allFilesExist(validationScripts);
  const topFilesPresent = allFilesExist(requiredTopFiles);
  assert(docsPresent, `Missing v5 docs: ${docs.filter((doc) => !exists(doc)).join(", ")}`);
  assert(schemaExamplesPresent, `Missing v5 schema examples: ${schemas.filter((schema) => !exists(schema)).join(", ")}`);
  assert(validationScriptsPresent, `Missing v5 validation scripts: ${validationScripts.filter((script) => !exists(script)).join(", ")}`);
  assert(topFilesPresent, `Missing top index files: ${requiredTopFiles.filter((file) => !exists(file)).join(", ")}`);

  const readme = read("README.md");
  const manifest = read("MANIFEST.md");
  const releaseNotes = read("RELEASE_NOTES.md");
  const roadmap = read("docs/00_project_roadmap.md");
  const checklist = read("tests/validation_checklist.md");
  const validateMvp = read("scripts/validate_mvp.ps1");
  const localCommitScope = read("scripts/validate_local_commit_scope.js");
  const runState = read(".agent_board/RUN_STATE.md");
  const handoff = read(".agent_board/HANDOFF.md");
  const validationLog = read(".agent_board/VALIDATION_LOG.md");
  const taskQueue = read(".agent_board/TASK_QUEUE.md");

  const readmeIndexCurrent =
    readme.includes("v5.9 expanded v5 index consistency validation") &&
    includesAll(readme, docs) &&
    includesAllPathVariants(readme, validationScripts);
  const manifestIndexCurrent =
    manifest.includes("v5.9 expanded v5 index consistency validation") &&
    includesAll(manifest, docs) &&
    includesAll(manifest, validationScripts);
  const releaseNotesCurrent =
    releaseNotes.includes("Added v5.8 handoff freshness validation.") &&
    releaseNotes.includes("Added v5.9 expanded v5 index consistency validation.");
  const roadmapCurrent =
    roadmap.includes("v5.9 expanded v5 index consistency validation") &&
    includesAll(roadmap, labels.slice(0, 9));
  const checklistCurrent =
    checklist.includes("## v5.9 Expanded V5 Index Consistency Validation 检查") &&
    checklist.includes("validate_v5_index_consistency.js");
  const validateMvpCurrent =
    includesAll(validateMvp, docs) &&
    includesAll(validateMvp, schemas) &&
    includesAll(validateMvp, validationScripts);
  const localCommitScopeCurrent =
    includesAll(localCommitScope, [
      "docs/136_v5_9_expanded_v5_index_consistency.md",
      "tests/schema_examples/v5_9_expanded_v5_index_consistency.example.yaml",
      "scripts/validate_v5_index_consistency.js"
    ]);
  const agentBoardCurrent =
    runState.includes("v5.9 expanded v5 index consistency validation") &&
    handoff.includes("v5.9 expanded v5 index consistency validation") &&
    validationLog.includes("node scripts/validate_v5_index_consistency.js") &&
    taskQueue.includes("Completed v5.9 expanded v5 index consistency validation.");
  const remoteGatePreserved =
    runState.includes("Remote action in current batch: none") &&
    runState.includes("Commit/tag/push authorization: not active") &&
    handoff.includes("Commit/tag/push/release require explicit separate authorization");

  assert(readmeIndexCurrent, "README v5 index is not current.");
  assert(manifestIndexCurrent, "MANIFEST v5 index is not current.");
  assert(releaseNotesCurrent, "RELEASE_NOTES v5.9 entry is missing.");
  assert(roadmapCurrent, "Roadmap v5.9 entry is missing.");
  assert(checklistCurrent, "Validation checklist v5.9 section is missing.");
  assert(validateMvpCurrent, "validate_mvp.ps1 v5 index is not current.");
  assert(localCommitScopeCurrent, "local commit scope v5.9 allowlist is not current.");
  assert(agentBoardCurrent, "Agent board v5.9 state is not current.");
  assert(remoteGatePreserved, "v5.9 must preserve remote action gate.");

  const result = {
    passed: true,
    v5_index_consistency: {
      v5_record_count: v5Records.length,
      docs_present: docsPresent,
      schema_examples_present: schemaExamplesPresent,
      validation_scripts_present: validationScriptsPresent,
      readme_index_current: readmeIndexCurrent,
      manifest_index_current: manifestIndexCurrent,
      release_notes_current: releaseNotesCurrent,
      roadmap_current: roadmapCurrent,
      checklist_current: checklistCurrent,
      validate_mvp_current: validateMvpCurrent,
      local_commit_scope_current: localCommitScopeCurrent,
      agent_board_current: agentBoardCurrent,
      push_authorized: false,
      tag_authorized: false,
      pr_authorized: false,
      release_authorized: false,
      remote_write_performed: false,
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
