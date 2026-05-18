#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(root);

const files = {
  phaseRecord: "docs/v14_208_review_console_browser_static_review_blocker_handoff.md",
  fixture: "tests/schema_examples/v14_208_review_console_browser_static_review_blocker_handoff.example.json",
  html: "review_console/static_prototype/index.html",
  v205Validator: "scripts/validate_v14_205_review_console_runtime_gap_static_ui_panel.js",
  v206Validator: "scripts/validate_v14_206_review_console_runtime_gap_draft_output_snapshot_static_regression.js",
  v207Validator: "scripts/validate_v14_207_review_console_runtime_gap_trace_matrix_static_regression.js",
  v205Phase: "docs/v14_205_review_console_runtime_gap_static_ui_panel.md",
  v206Fixture: "tests/schema_examples/v14_206_review_console_runtime_gap_draft_output_snapshot_static_regression.example.json",
  v207Fixture: "tests/schema_examples/v14_207_review_console_runtime_gap_trace_matrix_static_regression.example.json",
  mvpValidator: "scripts/validate_mvp.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
};

const expected = {
  phase: "v14_208_review_console_browser_static_review_blocker_handoff",
  status: "blocked_unavailable",
  refs: [
    "scripts/validate_v14_205_review_console_runtime_gap_static_ui_panel.js",
    "scripts/validate_v14_206_review_console_runtime_gap_draft_output_snapshot_static_regression.js",
    "scripts/validate_v14_207_review_console_runtime_gap_trace_matrix_static_regression.js",
  ],
};

const results = [];
const errors = [];

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), ...(detail ? { detail } : {}) });
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function requireToken(label, text, token) {
  addResult(`${label}_token_${token}_present`, text.includes(token));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function evaluate(input) {
  const evidence = input.current_attempt_evidence || {};
  const guard = input.guard || {};
  const refs = Array.isArray(input.validated_static_regression_refs) ? input.validated_static_regression_refs : [];
  const covered = Array.isArray(input.covered_review_console_surfaces) ? input.covered_review_console_surfaces : [];
  const options = Array.isArray(input.unblock_options) ? input.unblock_options : [];

  const identityOk =
    input.phase === expected.phase &&
    input.blocker_status === "active" &&
    input.browser_static_review_status === expected.status;
  const browserBlocked =
    input.browser_static_review_passed === false &&
    input.browser_static_review_artifact_present === false &&
    input.browser_static_review_claim_allowed === false &&
    input.static_regression_substitute_present === true &&
    input.static_regression_substitute_is_browser_review === false;
  const refsOk =
    refs.length === expected.refs.length &&
    expected.refs.every((ref) => refs.includes(ref)) &&
    refs.every((ref) => core.exists(ref));
  const coveredOk =
    covered.includes(files.v205Phase) &&
    covered.includes(files.v206Fixture) &&
    covered.includes(files.v207Fixture) &&
    core.exists(files.html);
  const evidenceOk =
    evidence.browser_skill_read === true &&
    evidence.node_repl_js_tool_exposed === false &&
    evidence.local_playwright_project_binary_present === false &&
    evidence.local_browser_command_discovered === false &&
    evidence.static_html_present === true &&
    evidence.browser_screenshot_artifact_ref === null &&
    evidence.browser_dom_snapshot_artifact_ref === null;
  const optionsOk =
    options.length === 3 &&
    options.some((option) => option.option_id === "restore_browser_node_repl_tool" && option.requires_dependency_change === false && option.requires_a5 === false) &&
    options.some((option) => option.option_id === "use_existing_local_browser_automation" && option.requires_dependency_change === false && option.requires_a5 === false) &&
    options.some((option) => option.option_id === "request_dependency_install_approval_for_browser_validation" && option.requires_dependency_change === true && option.requires_a5 === false);
  const noWrites =
    guard.file_write_performed_by_review_console === false &&
    guard.accepted_samples_write_performed === false &&
    guard.failure_samples_write_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false;
  const noExternal =
    guard.fetch_performed === false &&
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false &&
    guard.push_tag_release_deploy_performed === false;
  const noDependencyChange =
    guard.blocker_handoff_only === true &&
    guard.dependency_install_allowed === false &&
    guard.package_json_modified === false &&
    guard.package_lock_modified === false;
  const noRuntimeClaim =
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: identityOk && browserBlocked && refsOk && coveredOk && evidenceOk && optionsOk && noWrites && noExternal && noDependencyChange && noRuntimeClaim,
    identityOk,
    browserBlocked,
    refsOk,
    coveredOk,
    evidenceOk,
    optionsOk,
    noWrites,
    noExternal,
    noDependencyChange,
    noRuntimeClaim,
  };
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, core.exists(relativePath), relativePath);
}

const fixture = core.parseJson(files.fixture).review_console_browser_static_review_blocker_handoff;
const phaseRecord = core.read(files.phaseRecord);
const validationLog = core.read(files.validationLog);
const currentSurfaces = [
  phaseRecord,
  JSON.stringify(fixture, null, 2),
  core.read(files.runState),
  core.read(files.taskQueue),
  core.read(files.checkpoint),
  core.read(files.handoff),
  core.read(files.mvpValidator),
].join("\n");

const baseEval = evaluate(fixture);
addResult("blocker_handoff_evaluation_passes", baseEval.passed);
addResult("browser_review_is_blocked_not_passed", baseEval.browserBlocked);
addResult("static_regression_refs_exist", baseEval.refsOk);
addResult("covered_review_console_surfaces_exist", baseEval.coveredOk);
addResult("attempt_evidence_is_unavailable_not_claimed", baseEval.evidenceOk);

const browserPassed = clone(fixture);
browserPassed.browser_static_review_status = "passed";
browserPassed.browser_static_review_passed = true;
browserPassed.browser_static_review_claim_allowed = true;
const staticClaimedAsBrowser = clone(fixture);
staticClaimedAsBrowser.static_regression_substitute_is_browser_review = true;
const missingRef = clone(fixture);
missingRef.validated_static_regression_refs.pop();
const missingHtml = clone(fixture);
missingHtml.current_attempt_evidence.static_html_present = false;
const dependencyAllowed = clone(fixture);
dependencyAllowed.guard.dependency_install_allowed = true;
const packageModified = clone(fixture);
packageModified.guard.package_json_modified = true;
const runtimeClaim = clone(fixture);
runtimeClaim.guard.vcp_runtime_integration_proven = true;
runtimeClaim.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;

const browserPassedEval = evaluate(browserPassed);
const staticClaimedAsBrowserEval = evaluate(staticClaimedAsBrowser);
const missingRefEval = evaluate(missingRef);
const missingHtmlEval = evaluate(missingHtml);
const dependencyAllowedEval = evaluate(dependencyAllowed);
const packageModifiedEval = evaluate(packageModified);
const runtimeClaimEval = evaluate(runtimeClaim);

addResult("negative_case_browser_review_marked_passed_fails", browserPassedEval.passed === false && browserPassedEval.browserBlocked === false);
addResult("negative_case_static_regression_claimed_as_browser_review_fails", staticClaimedAsBrowserEval.passed === false && staticClaimedAsBrowserEval.browserBlocked === false);
addResult("negative_case_missing_static_regression_ref_fails", missingRefEval.passed === false && missingRefEval.refsOk === false);
addResult("negative_case_missing_html_surface_fails", missingHtmlEval.passed === false && missingHtmlEval.evidenceOk === false);
addResult("negative_case_dependency_install_allowed_fails", dependencyAllowedEval.passed === false && dependencyAllowedEval.noDependencyChange === false);
addResult("negative_case_package_json_modified_fails", packageModifiedEval.passed === false && packageModifiedEval.noDependencyChange === false);
addResult("negative_case_runtime_claim_fails", runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false);

for (const token of [
  "browser_static_review: not_run_node_repl_browser_tool_unavailable_and_local_playwright_missing",
  "v14_205_review_console_runtime_gap_static_ui_panel",
]) {
  requireToken("validation_log", validationLog, token);
}

for (const token of [
  "scripts/validate_v14_208_review_console_browser_static_review_blocker_handoff.js",
  "tests/schema_examples/v14_208_review_console_browser_static_review_blocker_handoff.example.json",
  "docs/v14_208_review_console_browser_static_review_blocker_handoff.md",
  "v14_208_review_console_browser_static_review_blocker_handoff",
]) {
  requireToken("current_surfaces", currentSurfaces, token);
}

const passed = errors.length === 0;
const summary = {
  validator: "validate_v14_208_review_console_browser_static_review_blocker_handoff",
  version: "v1",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  blocker_status: fixture.blocker_status,
  browser_static_review_status: fixture.browser_static_review_status,
  browser_static_review_passed: fixture.browser_static_review_passed,
  browser_static_review_artifact_present: fixture.browser_static_review_artifact_present,
  browser_static_review_claim_allowed: fixture.browser_static_review_claim_allowed,
  static_regression_substitute_present: fixture.static_regression_substitute_present,
  static_regression_substitute_is_browser_review: fixture.static_regression_substitute_is_browser_review,
  static_regression_ref_count: fixture.validated_static_regression_refs.length,
  covered_surface_count: fixture.covered_review_console_surfaces.length,
  node_repl_js_tool_exposed: fixture.current_attempt_evidence.node_repl_js_tool_exposed,
  local_playwright_project_binary_present: fixture.current_attempt_evidence.local_playwright_project_binary_present,
  local_browser_command_discovered: fixture.current_attempt_evidence.local_browser_command_discovered,
  static_html_present: fixture.current_attempt_evidence.static_html_present,
  dependency_install_allowed: fixture.guard.dependency_install_allowed,
  package_json_modified: fixture.guard.package_json_modified,
  package_lock_modified: fixture.guard.package_lock_modified,
  fetch_performed: false,
  file_write_performed_by_review_console: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  accepted_samples_write_performed: false,
  failure_samples_write_performed: false,
  production_candidate_write_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  push_tag_release_deploy_performed: false,
  artifact_recoverability_is_not_vcp_runtime_integration: true,
  vcp_runtime_integration_proven: false,
  negative_case_browser_review_marked_passed_fails: browserPassedEval.passed === false && browserPassedEval.browserBlocked === false,
  negative_case_static_regression_claimed_as_browser_review_fails: staticClaimedAsBrowserEval.passed === false && staticClaimedAsBrowserEval.browserBlocked === false,
  negative_case_missing_static_regression_ref_fails: missingRefEval.passed === false && missingRefEval.refsOk === false,
  negative_case_missing_html_surface_fails: missingHtmlEval.passed === false && missingHtmlEval.evidenceOk === false,
  negative_case_dependency_install_allowed_fails: dependencyAllowedEval.passed === false && dependencyAllowedEval.noDependencyChange === false,
  negative_case_package_json_modified_fails: packageModifiedEval.passed === false && packageModifiedEval.noDependencyChange === false,
  negative_case_runtime_claim_fails: runtimeClaimEval.passed === false && runtimeClaimEval.noRuntimeClaim === false,
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
