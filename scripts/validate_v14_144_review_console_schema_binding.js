#!/usr/bin/env node
"use strict";

const { execFileSync } = require("node:child_process");
const path = require("node:path");
const vm = require("node:vm");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_144_review_console_schema_binding.md",
  schemaBinding: "review_console/static_prototype/SCHEMA_BINDING.md",
  readme: "review_console/static_prototype/README.md",
  fieldMapping: "review_console/static_prototype/FIELD_MAPPING.md",
  mockData: "review_console/static_prototype/mock_data.js",
  app: "review_console/static_prototype/app.js",
  importSchema: "schemas/codex_session_image_import.schema.yaml",
  reviewSchema: "schemas/local_review_record.schema.yaml",
  acceptedRegistrySchema: "schemas/accepted_sample_registry.schema.yaml",
  acceptedRegistry: "accepted_samples/accepted_sample_registry.yaml",
  categoryIndex: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  importRecord: "runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/resort_relaxed_knit_final_import_record.json",
  reviewRecord: "docs/v14_105_codex_session_womens_resort_relaxed_knit_final_review.md",
  approvalRecord: "docs/v14_107_womens_resort_relaxed_knit_accepted_sample_closeout.md",
  v14_134_validator: "scripts/validate_v14_134_review_console_static_import_record_reader.js",
  v14_135_validator: "scripts/validate_v14_135_review_console_import_reader_safety_review.js",
  v14_143_validator: "scripts/validate_v14_143_import_review_registry_schema_hardening.js",
  currentValidator: "scripts/validate_v14_144_review_console_schema_binding.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
};

const sampleId = "accepted_womens_resort_relaxed_knit_codex_v2_001";
const results = [];
const errors = [];

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function forbidPattern(label, text, pattern) {
  addResult(`${label}_forbidden_${pattern}_absent`, !pattern.test(text), `${pattern}`);
}

function runValidator(relativePath) {
  return JSON.parse(execFileSync(process.execPath, [relativePath], { cwd: root, encoding: "utf8" }));
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const schemaBinding = core.read(files.schemaBinding);
const readme = core.read(files.readme);
const fieldMapping = core.read(files.fieldMapping);
const mockText = core.read(files.mockData);
const app = core.read(files.app);
const importSchema = core.read(files.importSchema);
const reviewSchema = core.read(files.reviewSchema);
const acceptedRegistrySchema = core.read(files.acceptedRegistrySchema);
const registry = core.read(files.acceptedRegistry);
const categoryIndex = core.read(files.categoryIndex);
const importRecord = core.parseJson(files.importRecord).codex_session_image_import;
const phaseRecord = core.read(files.phaseRecord);
const currentSurfaces = [
  phaseRecord,
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.validationLog),
  core.read(files.mvpValidator),
].join("\n");

const context = { window: {} };
vm.runInNewContext(mockText, context, { filename: files.mockData });
const mock = context.window.REVIEW_CONSOLE_MOCK;
const importSeed = mock.codex_session_import_record_seed.codex_session_image_import;
const evidence = mock.artifact_recoverability_dashboard_evidence;
const sampleBlock = core.extractRegistrySampleBlock(registry, sampleId);

for (const token of [
  "binding_id: v14_144_review_console_schema_binding",
  "mode: static_local_reader_only",
  "codex_session_image_import: schemas/codex_session_image_import.schema.yaml",
  "local_review_record: schemas/local_review_record.schema.yaml",
  "accepted_sample_registry: schemas/accepted_sample_registry.schema.yaml",
  "import_record_seed: mock_data.js.codex_session_import_record_seed",
  "artifact_evidence_seed: mock_data.js.artifact_recoverability_dashboard_evidence",
  "pending_human_review_is_not_approval: true",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "fetch_performed: false",
  "file_write_performed: false",
  "runtime_vcp_integration_performed: false",
  "accepted_samples_write_performed: false",
  "production_candidate_created: false",
]) {
  requireToken("schema_binding", schemaBinding, token);
}

for (const token of [
  "SCHEMA_BINDING.md",
  "review_console_static_schema_binding",
  "schemas/codex_session_image_import.schema.yaml",
  "schemas/local_review_record.schema.yaml",
  "schemas/accepted_sample_registry.schema.yaml",
  "不 fetch",
  "不写文件",
  "不调用 runtime",
]) {
  requireToken("readme", readme, token);
  requireToken("field_mapping", fieldMapping, token);
}

for (const token of [
  "recoverability_contract:",
  "required_artifact_link_fields:",
  "full_recoverability_metadata:",
]) {
  addResult(`bound_schema_token_${token}_present`, [importSchema, reviewSchema, acceptedRegistrySchema].some((text) => text.includes(token)));
}

addResult("import_seed_matches_real_import_id", importSeed.import_id === importRecord.import_id);
addResult("import_seed_matches_real_provider", importSeed.provider_id === importRecord.provider_id);
addResult("import_seed_matches_real_prompt_ref", importSeed.prompt_package_ref === importRecord.prompt_package_ref);
addResult("import_seed_matches_real_artifact_path", importSeed.imported_asset.relative_path === importRecord.imported_asset.relative_path);
addResult("import_seed_matches_real_sha256", importSeed.imported_asset.sha256 === importRecord.imported_asset.sha256);
addResult("import_seed_matches_real_dimensions", importSeed.imported_asset.width_px === importRecord.imported_asset.width_px && importSeed.imported_asset.height_px === importRecord.imported_asset.height_px);
addResult("import_seed_matches_real_mime", importSeed.imported_asset.mime_type === importRecord.imported_asset.mime_type);
addResult("import_seed_matches_real_review_record_ref", importSeed.review_bridge.review_record_ref === importRecord.review_bridge.review_record_ref);

addResult("artifact_evidence_matches_registry_sample_id", evidence.accepted_sample_id === sampleId && sampleBlock.includes(`sample_id: ${sampleId}`));
addResult("artifact_evidence_matches_registry_sha256", evidence.verified_sha256 === core.extractScalarField(sampleBlock, "verified_sha256"));
addResult("artifact_evidence_matches_registry_dimensions", evidence.verified_dimensions === core.extractScalarField(sampleBlock, "verified_dimensions"));
addResult("artifact_evidence_matches_registry_mime", evidence.verified_mime === core.extractScalarField(sampleBlock, "verified_mime"));
addResult("artifact_evidence_matches_registry_import_ref", evidence.import_record_ref === core.extractScalarField(sampleBlock, "import_record_ref"));
addResult("artifact_evidence_matches_category_index_ref", evidence.category_index_ref === files.categoryIndex && categoryIndex.includes(sampleId));
addResult("artifact_evidence_matches_review_ref", evidence.review_record_ref === importRecord.review_bridge.review_record_ref);
addResult("artifact_evidence_matches_human_approval_ref", evidence.human_approval_record_ref === files.approvalRecord);
addResult("artifact_evidence_keeps_runtime_claim_false", evidence.artifact_recoverability_is_not_vcp_runtime_integration === true && evidence.vcp_runtime_integration_proven === false);

let v14_134 = null;
let v14_135 = null;
let v14_143 = null;
try {
  v14_134 = runValidator(files.v14_134_validator);
  addResult("v14_134_static_import_reader_still_passes", v14_134.passed === true);
  v14_135 = runValidator(files.v14_135_validator);
  addResult("v14_135_import_reader_safety_still_passes", v14_135.passed === true);
  v14_143 = runValidator(files.v14_143_validator);
  addResult("v14_143_schema_hardening_still_passes", v14_143.passed === true);
} catch (error) {
  addResult("dependent_validators_still_pass", false, error.message);
}

for (const token of [
  "phase: v14_144_review_console_schema_binding",
  "review_console_static_schema_binding_created: true",
  "import_record_reader_bound_to_import_schema: true",
  "artifact_evidence_bound_to_accepted_registry_schema: true",
  "review_record_bound_to_local_review_schema: true",
  "v14_134_static_import_reader_still_passes: true",
  "v14_135_import_reader_safety_still_passes: true",
  "v14_143_schema_hardening_still_passes: true",
  "accepted_samples_write_performed: false",
  "image_binary_copy_performed: false",
  "vcp_runtime_integration_proven: false",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
]) {
  requireToken("phase_record", phaseRecord, token);
}

for (const token of [
  "scripts/validate_v14_144_review_console_schema_binding.js",
  "docs/v14_144_review_console_schema_binding.md",
  "review_console/static_prototype/SCHEMA_BINDING.md",
  "v14_144_review_console_schema_binding",
  "review_console_static_schema_binding_created: true",
  "import_record_reader_bound_to_import_schema: true",
  "artifact_evidence_bound_to_accepted_registry_schema: true",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

forbidPattern("app", app, /fetch\s*\(/);
forbidPattern("app", app, /XMLHttpRequest/);
forbidPattern("app", app, /WebSocket/);
forbidPattern("app", app, /EventSource/);
forbidPattern("app", app, /sendBeacon/);
forbidPattern("app", app, /localStorage/);
forbidPattern("app", app, /sessionStorage/);
forbidPattern("app", app, /indexedDB/);
forbidPattern("app", app, /writeFile/);
forbidPattern("current_surfaces", currentSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /plugin_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /api_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /mcp_runtime_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_generation_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /accepted_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_binary_copy_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_created:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_manifest_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcpchat_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /real_vcptoolbox_read_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /push_tag_release_deploy_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /vcp_runtime_integration_proven:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_144_review_console_schema_binding",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  review_console_static_schema_binding_created: true,
  import_record_reader_bound_to_import_schema: true,
  artifact_evidence_bound_to_accepted_registry_schema: true,
  review_record_bound_to_local_review_schema: true,
  v14_134_static_import_reader_still_passes: v14_134?.passed === true,
  v14_135_import_reader_safety_still_passes: v14_135?.passed === true,
  v14_143_schema_hardening_still_passes: v14_143?.passed === true,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  fetch_performed: false,
  file_write_performed: false,
  runtime_vcp_integration_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  image_generation_performed: false,
  image_binary_copy_performed: false,
  accepted_samples_write_performed: false,
  failure_samples_write_performed: false,
  production_candidate_created: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  push_tag_release_deploy_performed: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
