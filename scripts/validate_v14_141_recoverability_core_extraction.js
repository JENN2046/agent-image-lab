#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_141_recoverability_core_extraction.md",
  coreModule: "scripts/lib/artifact_recoverability_core.js",
  sourceValidator: "scripts/validate_v14_131_real_artifact_validation_and_accepted_sample_recoverability.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
};

const results = [];
const errors = [];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository root: ${relativePath}`);
  }
  return resolved;
}

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function read(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

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

function runJsonValidator(relativePath) {
  const output = execFileSync("node", [relativePath], { cwd: root, encoding: "utf8" });
  const parsed = JSON.parse(output);
  addResult(`${relativePath}_passed`, parsed.passed === true);
  return parsed;
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, exists(relativePath), relativePath);
}

const phase = read(files.phaseRecord);
const coreSource = read(files.coreModule);
const sourceValidator = read(files.sourceValidator);
const mvpValidator = read(files.mvpValidator);
const currentSurfaces = [
  phase,
  read(files.runState),
  read(files.taskQueue),
  read(files.checkpoint),
  read(files.handoff),
  read(files.validationLog),
  mvpValidator,
].join("\n");

const v14_131 = runJsonValidator(files.sourceValidator);

const expected = {
  importId: "v14_105_codex_session_womens_resort_relaxed_knit_final_v2",
  imageCaseId: "v14_105_womens_resort_relaxed_knit_final_v2",
  providerId: "codex_session_image",
  importMode: "manual_session_import",
  promptPackageRef: "session_prompt_inline:womens_resort_relaxed_knit_final_v2",
  imagePath: "runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/codex_session_womens_resort_relaxed_knit_final_v2.png",
  reviewRecordPath: "docs/v14_105_codex_session_womens_resort_relaxed_knit_final_review.md",
  sha256: "9d23208d05427b02ffc177664c1918ed73bf57831a9694be16522fe9a8f3c910",
  width: 1254,
  height: 1254,
  mimeType: "image/png",
};

const record = core.parseJson("runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/resort_relaxed_knit_final_import_record.json");
const closeout = core.read("docs/v14_107_womens_resort_relaxed_knit_accepted_sample_closeout.md");
const positive = core.validateRecordChain(record, expected, { closeoutText: closeout });
addResult("core_positive_chain_passes", positive.passed, positive.failures.join("; "));

const badHashRecord = JSON.parse(JSON.stringify(record));
badHashRecord.codex_session_image_import.imported_asset.sha256 = "0".repeat(64);
const badHash = core.validateRecordChain(badHashRecord, expected, { closeoutText: closeout });
addResult("core_negative_hash_mismatch_fails", badHash.passed === false && badHash.failures.includes("artifact_file_sha256_matches_record"));

const missingArtifactRecord = JSON.parse(JSON.stringify(record));
missingArtifactRecord.codex_session_image_import.imported_asset.relative_path = "runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/missing_artifact_for_negative_case.png";
const missingArtifact = core.validateRecordChain(missingArtifactRecord, expected, { closeoutText: closeout });
addResult("core_negative_missing_artifact_fails", missingArtifact.passed === false && missingArtifact.failures.includes("artifact_file_exists"));

const missingApproval = core.validateRecordChain(record, expected, { closeoutText: closeout.replace("approved_by: Jenn", "approved_by: null") });
addResult("core_negative_missing_human_approval_fails", missingApproval.passed === false && missingApproval.failures.includes("human_approval_present"));

for (const token of [
  "function createRecoverabilityCore(root)",
  "function validateRecordChain(record, expected, options = {})",
  "function sha256File(relativePath)",
  "function readPngDimensions(relativePath)",
  "function extractRegistrySampleBlock(registryText, id)",
  "module.exports",
]) {
  requireToken("core_module", coreSource, token);
}

for (const token of [
  "createRecoverabilityCore",
  "recoverabilityCore.validateRecordChain",
  "recoverabilityCore.sha256File",
  "recoverabilityCore.readPngDimensions",
  "recoverabilityCore.extractRegistrySampleBlock",
]) {
  requireToken("source_validator", sourceValidator, token);
}

for (const token of [
  "phase: v14_141_recoverability_core_extraction",
  "recoverability_core_extracted: true",
  "v14_131_validator_uses_recoverability_core: true",
  "core_positive_chain_passes: true",
  "core_negative_hash_mismatch_fails: true",
  "core_negative_missing_artifact_fails: true",
  "core_negative_missing_human_approval_fails: true",
  "artifact_recoverability_is_not_vcp_runtime_integration: true",
  "vcp_runtime_integration_proven: false",
]) {
  requireToken("phase_record", phase, token);
}

for (const token of [
  "v14_141_recoverability_core_extraction",
  "recoverability_core_extracted: true",
  "v14_131_validator_uses_recoverability_core: true",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "mcp_runtime_performed: false",
  "image_generation_performed: false",
  "DailyNote_write_performed: false",
  "VCP_memory_write_performed: false",
  "failure_samples_write_performed: false",
  "production_candidate_created: false",
  "real_manifest_read_performed: false",
  "real_vcpchat_read_performed: false",
  "real_vcptoolbox_read_performed: false",
  "push_tag_release_deploy_performed: false",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

requireToken("mvp_validator", mvpValidator, files.coreModule);
requireToken("mvp_validator", mvpValidator, files.sourceValidator);
requireToken("mvp_validator", mvpValidator, files.phaseRecord);

forbidPattern("current_surfaces", currentSurfaces, /vcp_runtime_integration_proven:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /provider_contact_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /plugin_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /api_call_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /mcp_runtime_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /image_generation_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /DailyNote_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /VCP_memory_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /failure_samples_write_performed:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /production_candidate_created:\s+true/i);
forbidPattern("current_surfaces", currentSurfaces, /push_tag_release_deploy_performed:\s+true/i);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_141_recoverability_core_extraction",
  version: "v1",
  passed,
  files_checked: Object.values(files),
  check_count: results.length,
  failed_count: errors.length,
  recoverability_core_extracted: true,
  v14_131_validator_uses_recoverability_core: true,
  core_positive_chain_passes: positive.passed,
  core_negative_hash_mismatch_fails: badHash.passed === false && badHash.failures.includes("artifact_file_sha256_matches_record"),
  core_negative_missing_artifact_fails: missingArtifact.passed === false && missingArtifact.failures.includes("artifact_file_exists"),
  core_negative_missing_human_approval_fails: missingApproval.passed === false && missingApproval.failures.includes("human_approval_present"),
  v14_131_validator_still_passes: v14_131.passed === true,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  image_generation_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  failure_samples_write_performed: false,
  production_candidate_created: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  push_tag_release_deploy_performed: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
