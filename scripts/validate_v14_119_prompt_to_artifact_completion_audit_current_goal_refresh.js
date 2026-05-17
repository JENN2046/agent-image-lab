#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  goalGate: "docs/v14_108_three_month_visual_control_layer_goal_alignment_gate.md",
  acceptedSamplesPolicyGate: "docs/v14_109_accepted_samples_metadata_policy_validator_alignment.md",
  codexReviewChainGate: "docs/v14_110_codex_session_import_review_chain_validator_alignment.md",
  memoryDeltaGate: "docs/v14_111_review_record_to_memory_delta_draft_suitability_gate.md",
  productionCandidateGate: "docs/v14_112_production_candidate_gate_local_policy_refresh.md",
  failureSamplesGate: "docs/v14_113_failure_samples_authorization_and_taxonomy_draft_without_write.md",
  reviewConsoleHandoffGate: "docs/v14_114_review_console_handoff_taxonomy_index_alignment.md",
  dryRunAdapterGate: "docs/v14_115_dry_run_vcp_adapter_current_goal_alignment.md",
  manifestReadGate: "docs/v14_116_manifest_read_authorization_current_goal_alignment.md",
  memoryAuthorizationGate: "docs/v14_117_daily_note_vcp_memory_authorization_current_goal_alignment.md",
  rollbackAuditValidationGate: "docs/v14_118_rollback_audit_validation_package_current_goal_alignment.md",
  phaseRecord: "docs/v14_119_prompt_to_artifact_completion_audit_current_goal_refresh.md",
  acceptedRegistry: "accepted_samples/accepted_sample_registry.yaml",
  acceptedCategory: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  codexImportValidator: "scripts/validate_codex_session_image_import.js",
  codexReviewChainValidator: "scripts/validate_codex_session_review_chain.js",
  acceptedRegistryValidator: "scripts/validate_v7_32_accepted_sample_registry_update.js",
  memoryDeltaValidator: "scripts/validate_v14_111_codex_session_memory_delta_draft.js",
  productionCandidateValidator: "scripts/validate_v14_112_production_candidate_gate_policy.js",
  failureSamplesValidator: "scripts/validate_v14_113_failure_samples_authorization_boundary.js",
  reviewConsoleValidator: "scripts/validate_v14_114_review_console_handoff_taxonomy_alignment.js",
  dryRunAdapterValidator: "scripts/validate_v14_115_dry_run_vcp_adapter_current_goal_alignment.js",
  manifestReadValidator: "scripts/validate_v14_116_manifest_read_authorization_current_goal_alignment.js",
  memoryAuthorizationValidator: "scripts/validate_v14_117_daily_note_vcp_memory_authorization_current_goal_alignment.js",
  rollbackAuditValidationValidator: "scripts/validate_v14_118_rollback_audit_validation_package_current_goal_alignment.js",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
  currentValidator: "scripts/validate_v14_119_prompt_to_artifact_completion_audit_current_goal_refresh.js",
};

const importRecords = [
  "runs/real_generation/v14_103_codex_session_premium_portable_led_camping_lantern_codex_v1_square_hero_candidate/codex_session_image_import_record.json",
  "runs/real_generation/v14_104_codex_session_womens_fashion_three_outfit_first_round_candidates/commuter_tailored_suit_import_record.json",
  "runs/real_generation/v14_104_codex_session_womens_fashion_three_outfit_first_round_candidates/outdoor_technical_import_record.json",
  "runs/real_generation/v14_104_codex_session_womens_fashion_three_outfit_first_round_candidates/resort_relaxed_knit_import_record.json",
  "runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/resort_relaxed_knit_final_import_record.json",
];

const reviewRecords = [
  "docs/v14_103_codex_session_lantern_codex_v1_square_hero_candidate_review.md",
  "docs/v14_104_codex_session_womens_fashion_three_outfit_first_round_review.md",
  "docs/v14_105_codex_session_womens_resort_relaxed_knit_final_review.md",
];

const executableValidators = [
  files.codexImportValidator,
  files.codexReviewChainValidator,
  files.acceptedRegistryValidator,
  files.memoryDeltaValidator,
  files.productionCandidateValidator,
  files.failureSamplesValidator,
  files.reviewConsoleValidator,
  files.dryRunAdapterValidator,
  files.manifestReadValidator,
  files.memoryAuthorizationValidator,
  files.rollbackAuditValidationValidator,
];

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

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function fileExists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function read(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function runNodeCheck(relativePath) {
  const result = childProcess.spawnSync(process.execPath, ["--check", repoPath(relativePath)], {
    cwd: root,
    encoding: "utf8",
  });
  addResult(`${relativePath}_node_check_passed`, result.status === 0, result.stderr || result.stdout);
}

function runJsonValidator(relativePath, label) {
  const result = childProcess.spawnSync(process.execPath, [repoPath(relativePath)], {
    cwd: root,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    addResult(`${label}_exec_passed`, false, result.stderr || result.stdout);
    return null;
  }
  addResult(`${label}_exec_passed`, true);
  try {
    const parsed = JSON.parse(result.stdout);
    addResult(`${label}_json_parseable`, true);
    addResult(`${label}_reported_passed`, parsed.passed === true);
    return parsed;
  } catch (error) {
    addResult(`${label}_json_parseable`, false, error.message);
    return null;
  }
}

function assertNoForbiddenTrue(label, text) {
  const forbiddenTruePatterns = [
    /provider_contact_performed:\s+true/i,
    /plugin_call_performed:\s+true/i,
    /api_call_performed:\s+true/i,
    /mcp_runtime_performed:\s+true/i,
    /image_generation_performed:\s+true/i,
    /DailyNote_write_performed:\s+true/i,
    /VCP_memory_write_performed:\s+true/i,
    /accepted_samples_write_performed:\s+true/i,
    /failure_samples_write_performed:\s+true/i,
    /production_candidate_created:\s+true/i,
    /real_manifest_read_performed:\s+true/i,
    /real_vcpchat_read_performed:\s+true/i,
    /real_vcptoolbox_read_performed:\s+true/i,
    /output_file_write_performed:\s+true/i,
  ];
  for (const pattern of forbiddenTruePatterns) {
    addResult(`${label}_forbidden_${pattern}_absent`, !pattern.test(text), `${pattern}`);
  }
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, fileExists(relativePath), relativePath);
}
for (const relativePath of [...importRecords, ...reviewRecords]) {
  addResult(`${relativePath}_exists`, fileExists(relativePath), relativePath);
}
for (const relativePath of [...executableValidators, files.currentValidator]) {
  runNodeCheck(relativePath);
}

const goalGate = read(files.goalGate);
for (const token of [
  "default_generation_route_for_next_three_months: codex_session_image",
  "Codex session image generation remains a session capability and must stay",
  "Prompt-To-Artifact Completion Audit",
  "codex_session_image_route:",
  "accepted_samples_metadata:",
  "failure_samples_metadata:",
  "dry_run_vcp_adapter_contract:",
  "plugin_dispatch_preflight:",
  "manifest_read_authorization_package:",
  "DailyNote_VCP_memory_write_authorization_chain:",
  "production_candidate_gate:",
  "rollback_audit_validation_package:",
]) {
  requireToken("goal_gate", goalGate, token);
}

const acceptedPolicyGate = read(files.acceptedSamplesPolicyGate);
for (const token of [
  "validator_updated: scripts/validate_v7_32_accepted_sample_registry_update.js",
  "codex_session_sample_verified: true",
  "metadata_only: true",
  "status: updated_and_passed",
]) {
  requireToken("accepted_policy_gate", acceptedPolicyGate, token);
}

const codexReviewChainGate = read(files.codexReviewChainGate);
for (const token of [
  "Codex session image -> local import record -> review record -> optional accepted_samples metadata",
  "import_record_count: 5",
  "review_record_count: 3",
  "accepted_samples_metadata_registration:",
  "sample_id: accepted_womens_resort_relaxed_knit_codex_v2_001",
]) {
  requireToken("codex_review_chain_gate", codexReviewChainGate, token);
}

const acceptedRegistry = read(files.acceptedRegistry);
for (const token of [
  "sample_id: accepted_womens_resort_relaxed_knit_codex_v2_001",
  "provider_type: codex_session_image",
  "plugin_id: null",
  "model: codex_session_builtin_image_generation",
  "review_doc_ref: docs/v14_105_codex_session_womens_resort_relaxed_knit_final_review.md",
  "image_path: runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/codex_session_womens_resort_relaxed_knit_final_v2.png",
  "image_files_committed_to_git: false",
  "write_to_memory_allowed: false",
  "daily_note_write_allowed: false",
]) {
  requireToken("accepted_registry", acceptedRegistry, token);
}
requireToken("accepted_category", read(files.acceptedCategory), "accepted_womens_resort_relaxed_knit_codex_v2_001");

const importRecordObjects = importRecords.map((relativePath) => readJson(relativePath).codex_session_image_import);
addResult("import_record_count_5", importRecordObjects.length === 5);
addResult(
  "all_import_records_codex_session_provider",
  importRecordObjects.every((record) => record.provider_id === "codex_session_image")
);
addResult(
  "all_import_records_manual_session_import",
  importRecordObjects.every((record) => record.import_mode === "manual_session_import")
);
addResult(
  "all_import_records_project_generation_false",
  importRecordObjects.every((record) => record.source?.project_script_generation_allowed === false)
);
addResult(
  "all_import_records_provider_api_false",
  importRecordObjects.every((record) => record.source?.provider_api_call_allowed === false)
);
addResult(
  "all_import_records_review_linked",
  importRecordObjects.every((record) => record.status === "review_linked" && record.review_bridge?.review_record_ref)
);

const reviewText = reviewRecords.map(read).join("\n");
for (const token of [
  "codex_session_generation_used: true",
  "image_generation_by_project_script_performed: false",
  "DailyNote_write_performed: false",
  "VCP_memory_write_performed: false",
  "production_candidate_write_performed: false",
]) {
  requireToken("review_records", reviewText, token);
}

const childSummaries = {
  codexImport: runJsonValidator(files.codexImportValidator, "codex_import_validator"),
  codexReviewChain: runJsonValidator(files.codexReviewChainValidator, "codex_review_chain_validator"),
  acceptedRegistry: runJsonValidator(files.acceptedRegistryValidator, "accepted_registry_validator"),
  memoryDelta: runJsonValidator(files.memoryDeltaValidator, "memory_delta_validator"),
  productionCandidate: runJsonValidator(files.productionCandidateValidator, "production_candidate_validator"),
  failureSamples: runJsonValidator(files.failureSamplesValidator, "failure_samples_validator"),
  reviewConsole: runJsonValidator(files.reviewConsoleValidator, "review_console_validator"),
  dryRunAdapter: runJsonValidator(files.dryRunAdapterValidator, "dry_run_adapter_validator"),
  manifestRead: runJsonValidator(files.manifestReadValidator, "manifest_read_validator"),
  memoryAuthorization: runJsonValidator(files.memoryAuthorizationValidator, "memory_authorization_validator"),
  rollbackAuditValidation: runJsonValidator(files.rollbackAuditValidationValidator, "rollback_audit_validation_validator"),
};

addResult(
  "codex_review_chain_child_summary_import_count",
  childSummaries.codexReviewChain?.import_record_count === 5
);
addResult(
  "accepted_registry_child_summary_metadata_only",
  childSummaries.acceptedRegistry?.metadata_only === true &&
    childSummaries.acceptedRegistry?.image_files_committed_to_git === false
);
addResult(
  "memory_delta_child_summary_draft_only",
  childSummaries.memoryDelta?.memory_delta_draft?.write_mode === "draft" &&
    childSummaries.memoryDelta?.memory_delta_draft?.daily_note_write_performed === false &&
    childSummaries.memoryDelta?.memory_delta_draft?.vcp_memory_write_performed === false
);
addResult(
  "production_candidate_child_summary_blocked",
  childSummaries.productionCandidate?.accepted_samples_auto_promote_to_production_candidate === false &&
    childSummaries.productionCandidate?.production_candidate_write_allowed === false &&
    childSummaries.productionCandidate?.production_candidate_write_performed === false
);
addResult(
  "failure_samples_child_summary_authorization_required",
  childSummaries.failureSamples?.failure_samples_write_allowed_without_separate_authorization === false &&
    childSummaries.failureSamples?.failure_samples_write_performed === false
);
addResult(
  "rollback_child_summary_continuous_evidence",
  childSummaries.rollbackAuditValidation?.continuous_stage_evidence_present === true &&
    childSummaries.rollbackAuditValidation?.mvp_validator_wired === true
);

const currentSurfaces = [
  read(files.phaseRecord),
  read(files.runState),
  read(files.taskQueue),
  read(files.checkpoint),
  read(files.handoff),
  read(files.validationLog),
  read(files.mvpValidator),
].join("\n");
for (const token of [
  "prompt_to_artifact_completion_audit_current_goal_refresh",
  "prompt_to_artifact_completion_audit_aligned: true",
  "goal_to_artifact_trace_complete: true",
  "codex_session_generation_route_preserved: true",
  "import_review_registry_chain_verified: true",
  "review_to_memory_and_production_boundaries_verified: true",
  "rollback_audit_validation_chain_verified: true",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "mcp_runtime_performed: false",
  "image_generation_performed: false",
  "DailyNote_write_performed: false",
  "VCP_memory_write_performed: false",
  "accepted_samples_write_performed: false",
  "failure_samples_write_performed: false",
  "production_candidate_created: false",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}
assertNoForbiddenTrue("current_surfaces", currentSurfaces);

const mvpValidator = read(files.mvpValidator);
requireToken("mvp_validator", mvpValidator, files.currentValidator);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_119_prompt_to_artifact_completion_audit_current_goal_refresh",
  version: "v1",
  passed,
  files_checked: [...Object.values(files), ...importRecords, ...reviewRecords],
  check_count: results.length,
  failed_count: errors.length,
  prompt_to_artifact_completion_audit_aligned: passed,
  goal_to_artifact_trace_complete: passed,
  codex_session_generation_route_preserved: passed,
  import_review_registry_chain_verified: passed,
  review_to_memory_and_production_boundaries_verified: passed,
  rollback_audit_validation_chain_verified: passed,
  prompt_to_artifact_completion_audit_not_proxy_only: passed,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  image_generation_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  accepted_samples_write_performed: false,
  failure_samples_write_performed: false,
  production_candidate_created: false,
  output_file_write_performed: false,
  file_write_performed: false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exitCode = passed ? 0 : 1;
