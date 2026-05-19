#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/P5L_REVIEW_CONSOLE_FAILURE_CAPSULE_SNAPSHOT_VALIDATOR.md",
  snapshot: "tests/schema_examples/P5L_REVIEW_CONSOLE_FAILURE_CAPSULE_SNAPSHOT.example.json",
  sourceRecord: "docs/P5K_REVIEW_CONSOLE_STATIC_FAILURE_CAPSULE_DISPLAY.md",
  app: "review_console/static_prototype/app.js",
  mock: "review_console/static_prototype/mock_data.js",
  readme: "review_console/static_prototype/README.md",
  fieldMapping: "review_console/static_prototype/FIELD_MAPPING.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md"
};

const expected = {
  phase: "p5l_review_console_failure_capsule_snapshot_validator",
  sampleId: "failure_french_summer_rattan_bag_v7_29_001",
  previewSha256: "8addc3084099c1f2aab11a27c7b730f475ced21f80fff0b2e67d877c49d8c43e",
  route: "failure_learning_only_never_production",
  resolvedBy: "accepted_french_summer_rattan_bucket_bag_001"
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

function evaluate(snapshot) {
  const guard = snapshot.guard || {};
  const keys = snapshot.draft_output_keys || [];
  const tags = snapshot.failure_tags || [];
  const ui = snapshot.ui_summary_expectations || {};

  const identityOk =
    snapshot.phase === expected.phase &&
    snapshot.snapshot_status === "golden_static_snapshot" &&
    snapshot.source_display_record_ref === files.sourceRecord &&
    snapshot.source_static_mock_ref === "review_console/static_prototype/mock_data.js#portable_failure_capsule_evidence" &&
    snapshot.source_static_app_ref === "review_console/static_prototype/app.js#failureStateStaticWorkbenchState" &&
    snapshot.execution_mode === "review_console_static_failure_capsule_snapshot_only" &&
    snapshot.sample_id === expected.sampleId;

  const draftKeysOk =
    keys.includes("portable_failure_capsule_evidence") &&
    keys.includes("portable_failure_capsule_evidence_list") &&
    keys.includes("failure_state_static_workbench_state.portable_failure_capsule_records");

  const capsuleOk =
    snapshot.capsule_root === `asset_archive/failure_samples/${expected.sampleId}/` &&
    snapshot.manifest_ref === `asset_archive/failure_samples/${expected.sampleId}/manifest.json` &&
    snapshot.preview_ref === `asset_archive/failure_samples/${expected.sampleId}/preview.webp` &&
    snapshot.failure_record_ref === `asset_archive/failure_samples/${expected.sampleId}/failure_record.json` &&
    snapshot.review_record_ref === `asset_archive/failure_samples/${expected.sampleId}/review_record.json` &&
    snapshot.preview?.format === "webp" &&
    snapshot.preview?.dimensions === "512x512" &&
    snapshot.preview?.long_edge === 512 &&
    snapshot.preview?.sha256 === expected.previewSha256 &&
    snapshot.clone_portable_validation_status === "passed" &&
    snapshot.registry_validator_status === "failure_sample_capsules_verified" &&
    snapshot.final_route === expected.route &&
    snapshot.resolved_by_accepted_sample === expected.resolvedBy &&
    tags.includes("watermark_or_generated_mark_present") &&
    tags.includes("clean_image_corners_failed") &&
    tags.includes("prompt_watermark_control_insufficient") &&
    tags.includes("api_payload_missing_watermark_false");

  const policyOk =
    snapshot.source_original_required_for_portable_validation === false &&
    snapshot.old_source_present_in_clean_clone === false &&
    snapshot.base64_evidence_used === false &&
    snapshot.production_candidate_allowed === false &&
    snapshot.memory_write_allowed === false &&
    snapshot.DailyNote_write_allowed === false;

  const uiOk =
    ui.artifact_evidence_summary_shows_failure_count === true &&
    ui.artifact_evidence_summary_shows_failure_id === true &&
    ui.failure_state_workbench_shows_capsule_record === true &&
    ui.draft_output_carries_capsule_evidence === true;

  const noWrites =
    guard.static_snapshot_only === true &&
    guard.static_mock_only === true &&
    guard.in_memory_only === true &&
    guard.preview_loaded_or_rendered === false &&
    guard.asset_archive_read_performed === false &&
    guard.fetch_performed === false &&
    guard.file_write_performed === false &&
    guard.accepted_samples_write_performed === false &&
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
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false &&
    guard.push_tag_release_deploy_performed === false &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: identityOk && draftKeysOk && capsuleOk && policyOk && uiOk && noWrites && noExternal,
    identityOk,
    draftKeysOk,
    capsuleOk,
    policyOk,
    uiOk,
    noWrites,
    noExternal
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const snapshot = core.parseJson(files.snapshot).review_console_failure_capsule_snapshot;
const phaseRecord = core.read(files.phaseRecord);
const sourceRecord = core.read(files.sourceRecord);
const app = core.read(files.app);
const mock = core.read(files.mock);
const readme = core.read(files.readme);
const fieldMapping = core.read(files.fieldMapping);
const currentSurfaces = [
  Object.values(files).join("\n"),
  phaseRecord,
  sourceRecord,
  JSON.stringify(snapshot, null, 2),
  app,
  mock,
  readme,
  fieldMapping,
  core.read(files.mvpValidator),
  currentBoardBlock(core.read(files.runState)),
  currentBoardBlock(core.read(files.taskQueue)),
  currentBoardBlock(core.read(files.checkpoint)),
  currentBoardBlock(core.read(files.handoff))
].join("\n");

const baseEval = evaluate(snapshot);
addResult("failure_capsule_snapshot_evaluation_passes", baseEval.passed);

const wrongHash = clone(snapshot);
wrongHash.preview.sha256 = "bad";
const wrongRoute = clone(snapshot);
wrongRoute.final_route = "production_candidate";
const missingDraftKey = clone(snapshot);
missingDraftKey.draft_output_keys = ["portable_failure_capsule_evidence"];
const memoryAllowed = clone(snapshot);
memoryAllowed.memory_write_allowed = true;
memoryAllowed.DailyNote_write_allowed = true;
const fetchClaim = clone(snapshot);
fetchClaim.guard.fetch_performed = true;
const runtimeClaim = clone(snapshot);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
const imageGeneration = clone(snapshot);
imageGeneration.guard.image_generation_performed = true;

const wrongHashEval = evaluate(wrongHash);
const wrongRouteEval = evaluate(wrongRoute);
const missingDraftKeyEval = evaluate(missingDraftKey);
const memoryAllowedEval = evaluate(memoryAllowed);
const fetchClaimEval = evaluate(fetchClaim);
const runtimeClaimEval = evaluate(runtimeClaim);
const imageGenerationEval = evaluate(imageGeneration);

addResult("negative_case_preview_hash_drift_fails", wrongHashEval.passed === false && wrongHashEval.capsuleOk === false);
addResult("negative_case_route_drift_fails", wrongRouteEval.passed === false && wrongRouteEval.capsuleOk === false);
addResult("negative_case_missing_draft_key_fails", missingDraftKeyEval.passed === false && missingDraftKeyEval.draftKeysOk === false);
addResult("negative_case_memory_or_dailynote_allowed_fails", memoryAllowedEval.passed === false && memoryAllowedEval.policyOk === false);
addResult("negative_case_fetch_claim_fails", fetchClaimEval.passed === false && fetchClaimEval.noWrites === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noExternal === false);
addResult("negative_case_image_generation_claim_fails", imageGenerationEval.passed === false && imageGenerationEval.noExternal === false);

for (const token of [
  "portable_failure_capsule_evidence",
  "portable_failure_capsule_evidence_list",
  "portable_failure_capsule_records",
  "failureCapsules.length",
  "failureCapsuleIds"
]) {
  requireToken("app", app, token);
}

for (const token of [
  expected.sampleId,
  expected.previewSha256,
  "failure_learning_only_never_production",
  "failure_sample_capsules_verified"
]) {
  requireToken("mock", mock, token);
}

for (const token of [
  "P5K",
  "portable_failure_capsule_evidence"
]) {
  requireToken("readme", readme, token);
}

for (const token of [
  "P5K Portable Failure Capsule Static Display",
  "portable_failure_capsule_records"
]) {
  requireToken("field_mapping", fieldMapping, token);
}

for (const token of [
  "p5l_review_console_failure_capsule_snapshot_validator",
  "docs/P5L_REVIEW_CONSOLE_FAILURE_CAPSULE_SNAPSHOT_VALIDATOR.md",
  "tests/schema_examples/P5L_REVIEW_CONSOLE_FAILURE_CAPSULE_SNAPSHOT.example.json",
  "scripts/validate_review_console_failure_capsule_snapshot.js"
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_review_console_failure_capsule_snapshot",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  phase: snapshot.phase,
  snapshot_status: snapshot.snapshot_status,
  sample_id: snapshot.sample_id,
  preview_sha256: snapshot.preview.sha256,
  preview_long_edge: snapshot.preview.long_edge,
  final_route: snapshot.final_route,
  clone_portable_validation_status: snapshot.clone_portable_validation_status,
  registry_validator_status: snapshot.registry_validator_status,
  production_candidate_allowed: snapshot.production_candidate_allowed,
  memory_write_allowed: snapshot.memory_write_allowed,
  daily_note_write_allowed: snapshot.DailyNote_write_allowed,
  fetch_performed: snapshot.guard.fetch_performed,
  file_write_performed: snapshot.guard.file_write_performed,
  image_generation_performed: snapshot.guard.image_generation_performed,
  runtime_execution_performed: false,
  real_manifest_read_performed: snapshot.guard.real_manifest_read_performed,
  real_vcpchat_read_performed: snapshot.guard.real_vcpchat_read_performed,
  real_vcptoolbox_read_performed: snapshot.guard.real_vcptoolbox_read_performed,
  vcp_runtime_integration_proven: snapshot.guard.vcp_runtime_integration_proven,
  negative_case_preview_hash_drift_fails: wrongHashEval.passed === false && wrongHashEval.capsuleOk === false,
  negative_case_route_drift_fails: wrongRouteEval.passed === false && wrongRouteEval.capsuleOk === false,
  negative_case_missing_draft_key_fails: missingDraftKeyEval.passed === false && missingDraftKeyEval.draftKeysOk === false,
  negative_case_memory_or_dailynote_allowed_fails: memoryAllowedEval.passed === false && memoryAllowedEval.policyOk === false,
  negative_case_fetch_claim_fails: fetchClaimEval.passed === false && fetchClaimEval.noWrites === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noExternal === false,
  negative_case_image_generation_claim_fails: imageGenerationEval.passed === false && imageGenerationEval.noExternal === false,
  errors,
  results
};

console.log(JSON.stringify(summary, null, 2));
process.exit(passed ? 0 : 1);
