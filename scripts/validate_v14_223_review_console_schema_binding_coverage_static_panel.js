#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_223_review_console_schema_binding_coverage_static_panel.md",
  fixture: "tests/schema_examples/v14_223_review_console_schema_binding_coverage_static_panel.example.json",
  schemaBinding: "review_console/static_prototype/SCHEMA_BINDING.md",
  sourceMatrix: "tests/schema_examples/v14_221_review_console_recoverability_matrix_static_workbench.example.json",
  importSchema: "schemas/codex_session_image_import.schema.yaml",
  reviewSchema: "schemas/local_review_record.schema.yaml",
  registrySchema: "schemas/accepted_sample_registry.schema.yaml",
  app: "review_console/static_prototype/app.js",
  index: "review_console/static_prototype/index.html",
  styles: "review_console/static_prototype/styles.css",
  readme: "review_console/static_prototype/README.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
};

const expected = {
  phase: "v14_223_review_console_schema_binding_coverage_static_panel",
  draftOutputKey: "review_console_schema_binding_coverage_state",
  executionMode: "review_console_static_schema_binding_coverage_only",
  bindingStatus: "covered_static_read_only",
  requiredFields: [
    "artifact_ref",
    "sha256",
    "dimensions",
    "mime",
    "prompt_package_ref",
    "import_record_ref",
    "review_record_ref",
    "human_approval_status",
    "category_index_ref",
    "accepted_registry_ref",
  ],
  schemaKeys: [
    "codex_session_image_import",
    "local_review_record",
    "accepted_sample_registry",
  ],
};

const results = [];
const errors = [];

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function currentBoardBlock(text) {
  return text.split(/\r?\n---\r?\n/)[0];
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function evaluate(panel, sourceMatrix) {
  const guard = panel.guard || {};
  const boundSchemas = panel.bound_schemas || [];
  const sourceRequiredFields = sourceMatrix.required_fields || [];
  const coveredFields = Array.from(new Set(boundSchemas.flatMap((schema) => schema.covered_fields || [])));

  const identityOk =
    panel.phase === expected.phase &&
    panel.execution_mode === expected.executionMode &&
    panel.draft_output_key === expected.draftOutputKey &&
    panel.source_schema_binding_ref === files.schemaBinding &&
    panel.source_recoverability_matrix_ref === files.sourceMatrix;

  const schemasOk =
    panel.bound_schema_count === 3 &&
    boundSchemas.length === 3 &&
    expected.schemaKeys.every((schemaKey) => boundSchemas.some((schema) => schema.schema_key === schemaKey)) &&
    boundSchemas.every((schema) => schema.source_ref === files.schemaBinding && core.exists(schema.schema_ref));

  const coverageOk =
    panel.matrix_required_field_count === 10 &&
    panel.covered_matrix_required_field_count === 10 &&
    panel.matrix_required_field_count === sourceRequiredFields.length &&
    expected.requiredFields.every((field) => sourceRequiredFields.includes(field)) &&
    expected.requiredFields.every((field) => coveredFields.includes(field)) &&
    Array.isArray(panel.missing_matrix_required_fields) &&
    panel.missing_matrix_required_fields.length === 0 &&
    panel.binding_status === expected.bindingStatus &&
    panel.schema_binding_coverage_complete === true &&
    panel.pending_candidate_counted_as_accepted === false &&
    panel.hard_acceptance_three_full_samples_met === false;

  const noWrites =
    guard.local_static_panel_only === true &&
    guard.fetch_performed === false &&
    guard.file_write_performed === false &&
    guard.accepted_samples_write_performed === false &&
    guard.category_index_write_performed === false &&
    guard.failure_samples_write_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false;

  const noExternal =
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.image_generation_performed === false &&
    guard.env_or_secret_read_performed === false &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false &&
    guard.push_tag_release_deploy_performed === false;

  const noRuntimeClaim =
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: identityOk && schemasOk && coverageOk && noWrites && noExternal && noRuntimeClaim,
    identityOk,
    schemasOk,
    coverageOk,
    noWrites,
    noExternal,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).review_console_schema_binding_coverage_static_panel;
const sourceMatrix = core.parseJson(files.sourceMatrix).review_console_recoverability_matrix_static_workbench;
const phaseRecord = core.read(files.phaseRecord);
const schemaBinding = core.read(files.schemaBinding);
const app = core.read(files.app);
const index = core.read(files.index);
const styles = core.read(files.styles);
const readme = core.read(files.readme);
const currentSurfaces = [
  phaseRecord,
  JSON.stringify(fixture, null, 2),
  schemaBinding,
  app,
  index,
  styles,
  readme,
  core.read(files.mvpValidator),
  currentBoardBlock(core.read(files.runState)),
  currentBoardBlock(core.read(files.taskQueue)),
  currentBoardBlock(core.read(files.checkpoint)),
  currentBoardBlock(core.read(files.handoff)),
].join("\n");

const baseEval = evaluate(fixture, sourceMatrix);
addResult("schema_binding_coverage_static_panel_evaluation_passes", baseEval.passed);

const missingSchema = clone(fixture);
missingSchema.bound_schemas = missingSchema.bound_schemas.filter((schema) => schema.schema_key !== "local_review_record");
missingSchema.bound_schema_count = 2;
const missingFieldCoverage = clone(fixture);
missingFieldCoverage.covered_matrix_required_field_count = 9;
missingFieldCoverage.missing_matrix_required_fields = ["human_approval_status"];
missingFieldCoverage.binding_status = "missing_schema_binding";
missingFieldCoverage.schema_binding_coverage_complete = false;
const acceptedWrite = clone(fixture);
acceptedWrite.guard.accepted_samples_write_performed = true;
const externalAction = clone(fixture);
externalAction.guard.provider_contact_performed = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const missingSchemaEval = evaluate(missingSchema, sourceMatrix);
const missingFieldCoverageEval = evaluate(missingFieldCoverage, sourceMatrix);
const acceptedWriteEval = evaluate(acceptedWrite, sourceMatrix);
const externalActionEval = evaluate(externalAction, sourceMatrix);
const runtimeClaimEval = evaluate(runtimeClaim, sourceMatrix);

addResult("negative_case_missing_bound_schema_fails", missingSchemaEval.passed === false && missingSchemaEval.schemasOk === false);
addResult("negative_case_missing_matrix_field_coverage_fails", missingFieldCoverageEval.passed === false && missingFieldCoverageEval.coverageOk === false);
addResult("negative_case_accepted_samples_write_flag_fails", acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false);
addResult("negative_case_external_action_flag_fails", externalActionEval.passed === false && externalActionEval.noExternal === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "reviewConsoleSchemaBindingCoverageState",
  "renderReviewConsoleSchemaBindingCoverage",
  "review_console_schema_binding_coverage_state: reviewConsoleSchemaBindingCoverageState()",
]) {
  requireToken("app", app, token);
}

for (const token of [
  "schema-binding-coverage",
  "schemaBindingCoverageSummary",
  "schemaBindingCoverageBody",
  "schemaBindingCoverageGuard",
]) {
  requireToken("index", index, token);
}

for (const token of [
  "schema-binding-coverage-body",
  "schema-binding-coverage-card",
]) {
  requireToken("styles", styles, token);
}

for (const token of [
  "v14.223",
  "review_console_schema_binding_coverage_state",
]) {
  requireToken("readme", readme, token);
}

for (const token of [
  "v14_223_review_console_schema_binding_coverage_static_panel",
  "docs/v14_223_review_console_schema_binding_coverage_static_panel.md",
  "tests/schema_examples/v14_223_review_console_schema_binding_coverage_static_panel.example.json",
  "scripts/validate_v14_223_review_console_schema_binding_coverage_static_panel.js",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_223_review_console_schema_binding_coverage_static_panel",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  phase: fixture.phase,
  draft_output_key: fixture.draft_output_key,
  execution_mode: fixture.execution_mode,
  binding_status: fixture.binding_status,
  bound_schema_count: fixture.bound_schema_count,
  matrix_required_field_count: fixture.matrix_required_field_count,
  covered_matrix_required_field_count: fixture.covered_matrix_required_field_count,
  missing_matrix_required_fields: fixture.missing_matrix_required_fields,
  schema_binding_coverage_complete: fixture.schema_binding_coverage_complete,
  pending_candidate_counted_as_accepted: fixture.pending_candidate_counted_as_accepted,
  hard_acceptance_three_full_samples_met: fixture.hard_acceptance_three_full_samples_met,
  accepted_samples_write_performed: fixture.guard.accepted_samples_write_performed,
  production_candidate_write_performed: fixture.guard.production_candidate_write_performed,
  daily_note_write_performed: fixture.guard.DailyNote_write_performed,
  vcp_memory_write_performed: fixture.guard.VCP_memory_write_performed,
  provider_contact_performed: fixture.guard.provider_contact_performed,
  plugin_call_performed: fixture.guard.plugin_call_performed,
  api_call_performed: fixture.guard.api_call_performed,
  mcp_runtime_performed: fixture.guard.mcp_runtime_performed,
  image_generation_performed: fixture.guard.image_generation_performed,
  env_or_secret_read_performed: fixture.guard.env_or_secret_read_performed,
  real_manifest_read_performed: fixture.guard.real_manifest_read_performed,
  real_vcpchat_read_performed: fixture.guard.real_vcpchat_read_performed,
  real_vcptoolbox_read_performed: fixture.guard.real_vcptoolbox_read_performed,
  push_tag_release_deploy_performed: fixture.guard.push_tag_release_deploy_performed,
  vcp_runtime_integration_proven: fixture.guard.vcp_runtime_integration_proven,
  negative_case_missing_bound_schema_fails: missingSchemaEval.passed === false && missingSchemaEval.schemasOk === false,
  negative_case_missing_matrix_field_coverage_fails: missingFieldCoverageEval.passed === false && missingFieldCoverageEval.coverageOk === false,
  negative_case_accepted_samples_write_flag_fails: acceptedWriteEval.passed === false && acceptedWriteEval.noWrites === false,
  negative_case_external_action_flag_fails: externalActionEval.passed === false && externalActionEval.noExternal === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

console.log(JSON.stringify(summary, null, 2));
process.exit(passed ? 0 : 1);
