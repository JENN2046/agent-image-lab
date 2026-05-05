const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const v4Records = [
  {
    id: "v4.0",
    doc: "docs/117_v4_0_runtime_contract_smoke_hardening.md",
    schema: "tests/schema_examples/v4_0_runtime_contract_smoke_hardening.example.yaml"
  },
  {
    id: "v4.1",
    doc: "docs/118_v4_1_runtime_guard_unit_validation.md",
    schema: "tests/schema_examples/v4_1_runtime_guard_unit_validation.example.yaml"
  },
  {
    id: "v4.2",
    doc: "docs/119_v4_2_runtime_validation_suite.md",
    schema: "tests/schema_examples/v4_2_runtime_validation_suite.example.yaml"
  },
  {
    id: "v4.3",
    doc: "docs/120_v4_3_autopilot_overlay_installation.md",
    schema: "tests/schema_examples/v4_3_autopilot_overlay_installation.example.yaml"
  },
  {
    id: "v4.4",
    doc: "docs/121_v4_4_agent_board_state_validation.md",
    schema: "tests/schema_examples/v4_4_agent_board_state_validation.example.yaml"
  },
  {
    id: "v4.5",
    doc: "docs/122_v4_5_local_checkpoint_readiness.md",
    schema: "tests/schema_examples/v4_5_local_checkpoint_readiness.example.yaml"
  },
  {
    id: "v4.6",
    doc: "docs/123_v4_6_local_commit_scope_manifest.md",
    schema: "tests/schema_examples/v4_6_local_commit_scope_manifest.example.yaml"
  },
  {
    id: "v4.7",
    doc: "docs/124_v4_7_post_push_state_reconciliation.md",
    schema: "tests/schema_examples/v4_7_post_push_state_reconciliation.example.yaml"
  },
  {
    id: "v4.8",
    doc: "docs/125_v4_8_v4_index_consistency_validation.md",
    schema: "tests/schema_examples/v4_8_v4_index_consistency_validation.example.yaml"
  }
];

const validationScripts = [
  "scripts/validate_runtime_guard_unit.js",
  "scripts/validate_runtime_prototype_smoke.js",
  "scripts/validate_runtime_prototype_suite.js",
  "scripts/validate_agent_board_state.js",
  "scripts/validate_local_checkpoint_manifest.js",
  "scripts/validate_local_commit_scope.js",
  "scripts/validate_post_push_state.js",
  "scripts/validate_v4_index_consistency.js"
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
  return values.every((value) => {
    return content.includes(value) || content.includes(value.replace(/\//g, "\\"));
  });
}

function allFilesExist(values) {
  return values.every((value) => exists(value));
}

function main() {
  const docs = v4Records.map((record) => record.doc);
  const schemas = v4Records.map((record) => record.schema);
  const requiredTopFiles = [
    "README.md",
    "MANIFEST.md",
    "RELEASE_NOTES.md",
    "docs/00_project_roadmap.md",
    "tests/validation_checklist.md",
    "scripts/validate_mvp.ps1",
    ".agent_board/RUN_STATE.md",
    ".agent_board/HANDOFF.md",
    ".agent_board/VALIDATION_LOG.md"
  ];

  const docsPresent = allFilesExist(docs);
  const schemaExamplesPresent = allFilesExist(schemas);
  const validationScriptsPresent = allFilesExist(validationScripts);
  const topFilesPresent = allFilesExist(requiredTopFiles);
  assert(docsPresent, `Missing v4 docs: ${docs.filter((doc) => !exists(doc)).join(", ")}`);
  assert(schemaExamplesPresent, `Missing v4 schema examples: ${schemas.filter((schema) => !exists(schema)).join(", ")}`);
  assert(validationScriptsPresent, `Missing v4 validation scripts: ${validationScripts.filter((script) => !exists(script)).join(", ")}`);
  assert(topFilesPresent, `Missing top index files: ${requiredTopFiles.filter((file) => !exists(file)).join(", ")}`);

  const readme = read("README.md");
  const manifest = read("MANIFEST.md");
  const releaseNotes = read("RELEASE_NOTES.md");
  const roadmap = read("docs/00_project_roadmap.md");
  const checklist = read("tests/validation_checklist.md");
  const validateMvp = read("scripts/validate_mvp.ps1");
  const runState = read(".agent_board/RUN_STATE.md");
  const handoff = read(".agent_board/HANDOFF.md");
  const validationLog = read(".agent_board/VALIDATION_LOG.md");

  const readmeIndexCurrent =
    readme.includes("v4.8 v4 index consistency validation") &&
    includesAll(readme, docs) &&
    includesAllPathVariants(readme, validationScripts);
  const manifestIndexCurrent =
    manifest.includes("v4.3-v4.8") &&
    includesAll(manifest, docs.slice(1)) &&
    includesAll(manifest, validationScripts.slice(3));
  const releaseNotesCurrent = releaseNotes.includes("Added v4.8 v4 index consistency validation.");
  const roadmapCurrent =
    roadmap.includes("v4.8 v4 index consistency validation") &&
    roadmap.includes("v4.x 阶段索引一致性");
  const checklistCurrent =
    checklist.includes("## v4.8 V4 Index Consistency Validation 检查") &&
    checklist.includes("validate_v4_index_consistency.js");
  const validateMvpCurrent =
    includesAll(validateMvp, docs) &&
    includesAll(validateMvp, schemas) &&
    includesAll(validateMvp, validationScripts);
  const agentBoardCurrent =
    runState.includes("v4.8 v4 index consistency validation") &&
    handoff.includes("v4.8 v4 index consistency validation") &&
    validationLog.includes("node scripts/validate_v4_index_consistency.js");

  assert(readmeIndexCurrent, "README v4 index is not current.");
  assert(manifestIndexCurrent, "MANIFEST v4 index is not current.");
  assert(releaseNotesCurrent, "RELEASE_NOTES v4.8 entry is missing.");
  assert(roadmapCurrent, "Roadmap v4.8 entry is missing.");
  assert(checklistCurrent, "Validation checklist v4.8 section is missing.");
  assert(validateMvpCurrent, "validate_mvp.ps1 v4 index is not current.");
  assert(agentBoardCurrent, "Agent board v4.8 state is not current.");

  const result = {
    passed: true,
    v4_index_consistency: {
      v4_record_count: v4Records.length,
      docs_present: docsPresent,
      schema_examples_present: schemaExamplesPresent,
      validation_scripts_present: validationScriptsPresent,
      readme_index_current: readmeIndexCurrent,
      manifest_index_current: manifestIndexCurrent,
      release_notes_current: releaseNotesCurrent,
      roadmap_current: roadmapCurrent,
      checklist_current: checklistCurrent,
      validate_mvp_current: validateMvpCurrent,
      agent_board_current: agentBoardCurrent,
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
