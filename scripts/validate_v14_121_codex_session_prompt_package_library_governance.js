#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const codexPrompt = "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_codex_v1.yaml";

const files = {
  codexPrompt,
  promptSchemaValidator: "scripts/validate_prompt_schema.js",
  promptPackageLibraryValidator: "scripts/validate_prompt_package_library.js",
  codexSessionContract: "docs/codex_session_image_provider_minimal_contract.md",
  codexLanternReview: "docs/v14_103_codex_session_lantern_codex_v1_square_hero_candidate_review.md",
  codexImportValidator: "scripts/validate_codex_session_image_import.js",
  codexReviewChainValidator: "scripts/validate_codex_session_review_chain.js",
  scorecardGate: "docs/v14_120_visual_series_taxonomy_review_scorecard_alignment.md",
  phaseRecord: "docs/v14_121_codex_session_prompt_package_library_governance.md",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
  mvpValidator: "scripts/validate_mvp.ps1",
  currentValidator: "scripts/validate_v14_121_codex_session_prompt_package_library_governance.js",
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

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function runNode(args, label) {
  const result = childProcess.spawnSync(process.execPath, args.map((arg) => (arg.endsWith(".js") ? repoPath(arg) : arg)), {
    cwd: root,
    encoding: "utf8",
  });
  addResult(`${label}_passed`, result.status === 0, result.stderr || result.stdout);
  return result;
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

runNode(["--check", files.currentValidator], "current_validator_node_check");
runNode([files.promptSchemaValidator, "--type", "prompt_package", codexPrompt], "codex_prompt_schema_validation");
runNode([files.promptPackageLibraryValidator], "prompt_package_library_validation");

const promptText = read(codexPrompt);
for (const token of [
  "package_id: product_lifestyle_premium_portable_led_camping_lantern_codex_v1",
  "version: codex_v1",
  "reference_policy: text_only_no_image_input",
  "Codex Session Image Provider prompt package for manual session generation",
  "codex_session_provider_contract_ref: docs/codex_session_image_provider_minimal_contract.md",
  "runner_prompt_mapping:",
  "canonical_prompt_field: prompt",
  "positive_prompt_alias: positive_prompt",
  "positive_prompt_sync_required: true",
  "codex_session_image_provider:",
  "provider_id: codex_session_image",
  "import_mode_after_generation: manual_session_import",
  "separate_A5_authorization_required_for_codex_session_generation_now: false",
  "direct_user_request_is_sufficient_for_codex_session_generation_now: true",
  "direct_project_call_allowed: false",
  "mcp_runtime_allowed: false",
  "project_script_generation_allowed: false",
  "image_generation_by_project_script: false",
  "expected_import_schema: schemas/codex_session_image_import.schema.yaml",
  "prompt: |",
  "positive_prompt: |",
  "negative_prompt: |",
  "acceptance_criteria:",
  "human_review_checklist:",
  "codex_session_generation_requires_human_action: true",
  "codex_session_generation_direct_user_request_sufficient_now: true",
  "provider_contact_allowed: false",
  "image_generation_allowed: false",
  "image_generation_by_project_script_allowed: false",
  "mcp_runtime_allowed: false",
  "memory_write_allowed: false",
  "production_candidate_002_allowed: false",
  "prompt_package_is_A5_authorization: false",
  "output_directory_creation_allowed: false",
  "accepted_samples_write_allowed: false",
  "runs_output_commit_allowed: false",
]) {
  requireToken("codex_prompt", promptText, token);
}

const promptBlock = (promptText.match(/prompt: \|\n([\s\S]*?)\n\npositive_prompt: \|/) || [])[1]?.trim();
const positiveBlock = (promptText.match(/positive_prompt: \|\n([\s\S]*?)\n\nnegative_prompt: \|/) || [])[1]?.trim();
addResult("prompt_positive_prompt_synced", Boolean(promptBlock) && promptBlock === positiveBlock);

const contract = read(files.codexSessionContract);
for (const token of [
  "manual_session_import",
  "provider_id = codex_session_image",
  "project_script_generation_allowed: false",
  "provider_api_call_allowed: false",
  "mcp_runtime_allowed: false",
]) {
  requireToken("codex_session_contract", contract, token);
}

const review = read(files.codexLanternReview);
for (const token of [
  `prompt_package_ref: ${codexPrompt}`,
  "codex_session_generation_used: true",
  "image_generation_by_project_script_performed: false",
  "accepted_samples_write_performed: false",
  "production_candidate_write_performed: false",
]) {
  requireToken("codex_lantern_review", review, token);
}

const scorecardGate = read(files.scorecardGate);
requireToken("scorecard_gate", scorecardGate, "codex_session_prompt_package_library_governance");

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
  "codex_session_prompt_package_library_governance_aligned: true",
  "codex_prompt_schema_validation_passed: true",
  "codex_prompt_not_execution_authorization: true",
  "codex_prompt_project_script_generation_blocked: true",
  "codex_prompt_review_chain_linked: true",
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
requireToken("mvp_validator", read(files.mvpValidator), files.currentValidator);

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_121_codex_session_prompt_package_library_governance",
  version: "v1",
  passed,
  files_checked: Object.values(files),
  check_count: results.length,
  failed_count: errors.length,
  codex_session_prompt_package_library_governance_aligned: passed,
  codex_prompt_schema_validation_passed: passed,
  codex_prompt_not_execution_authorization: passed,
  codex_prompt_project_script_generation_blocked: passed,
  codex_prompt_review_chain_linked: passed,
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
