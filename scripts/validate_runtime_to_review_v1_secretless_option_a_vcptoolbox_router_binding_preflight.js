#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_secretless_option_a_vcptoolbox_router_binding_preflight";
const preflightPath = "reports/runtime_to_review_v1/secretless_option_a_vcptoolbox_router_binding_preflight_20260603.json";
const readonlyReceiptPath = "reports/runtime_to_review_v1/secretless_option_a_vcptoolbox_binding_readonly_verification_receipt_20260603.json";
const exactBindingPacketPath = "reports/runtime_to_review_v1/secretless_option_a_exact_binding_packet_draft_20260603.json";
const callableBindingPreflightPath = "reports/runtime_to_review_v1/secretless_option_a_callable_binding_preflight_20260603.json";
const runnerImplementationPath = "reports/runtime_to_review_v1/secretless_option_a_callable_runner_implementation_preflight_20260603.json";
const runnerContractPath = "reports/runtime_to_review_v1/secretless_option_a_callable_runner_contract_preflight_20260603.json";
const pushedReceiptPath = "reports/runtime_to_review_v1/secretless_serum_route_option_a_vcptoolbox_implementation_pushed_receipt_20260603.json";
const failedReceiptPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_001.json";
const failedArtifactPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_001.json";
const validatorPath = "scripts/validate_runtime_to_review_v1_secretless_option_a_vcptoolbox_router_binding_preflight.js";
const packageScriptName = "validate:runtime-to-review-secretless-option-a-vcptoolbox-router-binding-preflight";
const manifestId = "runtime_to_review_secretless_option_a_vcptoolbox_router_binding_preflight";

let passed = true;
const results = [];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository: ${relativePath}`);
  }
  return resolved;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function check(id, fn) {
  try {
    const ok = fn();
    results.push({ check: id, passed: Boolean(ok) });
    if (!ok) passed = false;
  } catch (error) {
    results.push({ check: id, passed: false, error: error.message });
    passed = false;
  }
}

function includesAll(values, expectedValues) {
  return Array.isArray(values) && expectedValues.every((value) => values.includes(value));
}

function equalSet(values, expectedValues) {
  return Array.isArray(values) &&
    values.length === expectedValues.length &&
    expectedValues.every((value) => values.includes(value));
}

function fieldsAreFalse(object, fields) {
  return Boolean(object) && fields.every((field) => object[field] === false);
}

function main() {
  const preflight = readJson(preflightPath);
  const readonlyReceipt = readJson(readonlyReceiptPath);
  const exactBindingPacket = readJson(exactBindingPacketPath);
  const callableBinding = readJson(callableBindingPreflightPath);
  const runnerImplementation = readJson(runnerImplementationPath);
  const runnerContract = readJson(runnerContractPath);
  const pushedReceipt = readJson(pushedReceiptPath);
  const failedReceipt = readJson(failedReceiptPath);
  const failedArtifact = readJson(failedArtifactPath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const validatorSource = fs.readFileSync(repoPath(validatorPath), "utf8");
  const processEnvToken = "process" + "." + "env";
  const forbiddenSourceTokens = [
    processEnvToken,
    "fet" + "ch(",
    "axi" + "os",
    "require(" + "\"node:" + "http" + "\")",
    "require(" + "'node:" + "http" + "')",
    "require(" + "\"node:" + "https" + "\")",
    "require(" + "'node:" + "https" + "')",
    "A:" + "\\\\VCP"
  ];
  const boundaryFalseFields = [
    "external_vcptoolbox_read_performed_by_this_task",
    "external_vcptoolbox_modified_by_this_task",
    "route_http_request_performed",
    "live_probe_performed",
    "runtime_execution_performed",
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "image_generation_performed",
    "output_write_performed",
    "secret_value_read_performed",
    "env_file_content_read_performed",
    "config_env_read_performed",
    "authorization_header_constructed_by_agent_image_lab",
    "DailyNote_write_performed",
    "VCP_memory_write_performed",
    "staging_performed",
    "commit_performed",
    "push_tag_release_deploy_performed"
  ];

  check("preflight_schema_status_and_mode", () =>
    preflight.schema === "runtime_to_review_v1_secretless_option_a_vcptoolbox_router_binding_preflight.v1" &&
    preflight.preflight_id === "secretless_option_a_vcptoolbox_router_binding_preflight_20260603" &&
    preflight.lane === "Green_local_router_binding_preflight_validator_only" &&
    preflight.mode === "agent_image_lab_local_preflight_no_vcptoolbox_read_no_route_http" &&
    preflight.status === "completed_local_router_binding_preflight_no_execution"
  );
  check("source_refs_exist", () =>
    includesAll(preflight.source_refs, [
      readonlyReceiptPath,
      exactBindingPacketPath,
      callableBindingPreflightPath,
      runnerImplementationPath,
      runnerContractPath,
      pushedReceiptPath,
      failedReceiptPath,
      failedArtifactPath
    ]) &&
    preflight.source_refs.every((relativePath) => fs.existsSync(repoPath(relativePath)))
  );
  check("source_receipt_still_blocks_router_binding", () =>
    readonlyReceipt.status === "completed_read_only_verification_blocked_not_bound_in_router_refs" &&
    readonlyReceipt.verification_result.result === "blocked_not_bound_in_router_refs" &&
    readonlyReceipt.verification_result.can_run_route_http_now === false &&
    readonlyReceipt.verification_result.can_run_live_probe_now === false &&
    readonlyReceipt.binding_evidence.secretless_route_gate_enabled_in_server_refs === false &&
    readonlyReceipt.binding_evidence.authorizer_bound_in_server_refs === false
  );
  check("current_problem_tracks_source_receipt", () =>
    preflight.current_problem.source_receipt_ref === readonlyReceiptPath &&
    preflight.current_problem.source_receipt_status === readonlyReceipt.status &&
    preflight.current_problem.current_gap === "vcptoolbox_router_refs_do_not_enable_secretless_route_gate_or_bind_internal_authorizer" &&
    preflight.current_problem.current_permission === "cannot_run_live_probe_now"
  );
  check("current_permission_non_executable_and_no_authorization", () =>
    preflight.current_permission.current_live_probe_allowed === false &&
    preflight.current_permission.can_execute_now === false &&
    preflight.current_permission.route_http_allowed_by_this_record === false &&
    preflight.current_permission.authorization_granted_by_this_record === false &&
    preflight.current_permission.activation_granted_by_this_record === false &&
    preflight.current_permission.future_external_repo_modification_authorized_by_this_record === false &&
    preflight.current_permission.future_router_binding_implementation_authorized_by_this_record === false &&
    preflight.current_permission.binding_executable_now === false &&
    preflight.current_permission.new_exact_activation_required_before_any_live_probe === true
  );
  check("source_receipt_summary_matches_readonly_evidence", () =>
    preflight.source_receipt_summary.verification_result === readonlyReceipt.verification_result.result &&
    preflight.source_receipt_summary.can_run_route_http_now === readonlyReceipt.verification_result.can_run_route_http_now &&
    preflight.source_receipt_summary.can_run_live_probe_now === readonlyReceipt.verification_result.can_run_live_probe_now &&
    preflight.source_receipt_summary.route_factory_ref === readonlyReceipt.binding_evidence.route_factory_ref &&
    preflight.source_receipt_summary.router_mount_base_observed === readonlyReceipt.binding_evidence.router_mount_base_observed &&
    preflight.source_receipt_summary.secretless_route_gate === readonlyReceipt.binding_evidence.secretless_route_gate &&
    preflight.source_receipt_summary.authorizer_option === readonlyReceipt.binding_evidence.authorizer_option
  );
  check("router_binding_preflight_scope_is_local_and_narrow", () =>
    preflight.router_binding_preflight_scope.target_system === "VCPToolBox" &&
    preflight.router_binding_preflight_scope.external_repo_modification_by_this_task === false &&
    preflight.router_binding_preflight_scope.external_repo_read_by_this_task === false &&
    preflight.router_binding_preflight_scope.route_http_by_this_task === false &&
    equalSet(preflight.router_binding_preflight_scope.candidate_future_exact_file_allowlist, [
      "Server.js",
      "server.js"
    ]) &&
    includesAll(preflight.router_binding_preflight_scope.non_default_files_require_separate_exact_authorization, [
      "routes/admin/aiImageAgents.js",
      "tests/aiImageAgentsRoute.test.js",
      "package.json",
      "adminServer.js",
      "any other VCPToolBox file"
    ]) &&
    preflight.router_binding_preflight_scope.clean_main_baseline_required_before_external_patch === true &&
    preflight.router_binding_preflight_scope.branch_required_before_external_patch === "main" &&
    preflight.router_binding_preflight_scope.worktree_required_before_external_patch === "clean"
  );
  check("future_router_binding_contract_preserves_secretless_boundary", () =>
    preflight.future_router_binding_contract.future_packet_kind === "exact_vcptoolbox_router_binding_implementation_authorization" &&
    includesAll(preflight.future_router_binding_contract.expected_route_options_after_patch, [
      "enableSerumBottleSecretlessInternalRoute",
      "authorizeSerumBottleSecretlessExecution"
    ]) &&
    preflight.future_router_binding_contract.expected_authorizer_boundary.agent_image_lab_secret_touch_allowed === false &&
    preflight.future_router_binding_contract.expected_authorizer_boundary.agent_image_lab_authorization_header_construction_allowed === false &&
    preflight.future_router_binding_contract.expected_authorizer_boundary.admin_basic_auth_dependency_allowed_for_agent_image_lab === false &&
    preflight.future_router_binding_contract.expected_authorizer_boundary.payload_secret_bearing_keys_allowed === false &&
    preflight.future_router_binding_contract.expected_authorizer_boundary.authorizer_must_fail_closed_on_invalid_or_drifting_payload === true &&
    preflight.future_router_binding_contract.expected_authorizer_boundary.authorizer_must_not_require_agent_image_lab_to_send_headers_payload === true
  );
  check("future_router_binding_contract_preserves_existing_guards", () =>
    includesAll(preflight.future_router_binding_contract.preserve_existing_contracts, [
      "one provider / one plugin / one API / one image / no retry",
      "recursive forbidden payload key rejection including headers, authorization, basic_auth, auth, and token",
      "missing authorizer fails closed before executor",
      "budget drift fails closed before authorizer/executor",
      "multiple plugin steps fail closed before authorizer/executor",
      "route remains under the AI Image Agents admin route mount",
      "old admin-auth serum route remains disallowed for the secretless path"
    ])
  );
  check("future_validation_required_stops_before_live", () =>
    includesAll(preflight.future_router_binding_contract.future_validation_required, [
      "clean-main read-only baseline before patch",
      "exact changed-file proof after patch",
      "node --check for any changed VCPToolBox JavaScript files",
      "VCPToolBox route tests if exact authorized",
      "Agent Image Lab receipt/status sync after any separately authorized VCPToolBox implementation",
      "no route HTTP/live probe until a new exact activation is issued"
    ])
  );
  check("stop_conditions_cover_no_vcptoolbox_no_secret_no_http", () =>
    includesAll(preflight.stop_conditions, [
      "VCPToolBox read is requested by this Agent Image Lab preflight",
      "VCPToolBox modification is requested by this Agent Image Lab preflight",
      "route HTTP is requested",
      "live probe, provider, plugin, API, image generation, or output write is requested",
      "secret, env, config, cookie, token, or private raw data read becomes necessary",
      "Authorization header construction by Agent Image Lab becomes necessary",
      "future exact file allowlist cannot be kept narrow",
      "future patch would need files beyond Server.js/server.js without separate exact authorization",
      "future patch would weaken the recursive forbidden payload key guard",
      "future patch would permit headers or secret-bearing payload keys",
      "future patch would use the old admin-auth serum route",
      "stage, commit, push, tag, release, deploy, destructive action, or history rewrite is requested"
    ])
  );
  check("prior_chain_remains_non_executable", () =>
    exactBindingPacket.current_permission.can_execute_now === false &&
    exactBindingPacket.current_permission.binding_executable_now === false &&
    callableBinding.current_permission.can_execute_now === false &&
    callableBinding.current_permission.binding_executable_now === false &&
    runnerImplementation.runner_contract.current_route_http_binding_status === "not_implemented_not_guessed_by_this_task" &&
    runnerContract.current_permission.can_execute_now === false &&
    pushedReceipt.current_agent_image_lab_execution_boundary.current_permission === "cannot_run_live_probe_now" &&
    failedReceipt.status === "failed_closed_before_route_http_request" &&
    failedArtifact.result === "failed_closed_before_route_http_request"
  );
  check("non_execution_boundary_all_false", () =>
    fieldsAreFalse(preflight.non_execution_boundary, boundaryFalseFields)
  );
  check("validator_contract_declares_scope_and_limits", () =>
    preflight.validator_contract.validator_ref === validatorPath &&
    preflight.validator_contract.package_script === packageScriptName &&
    preflight.validator_contract.manifest_id === manifestId &&
    includesAll(preflight.validator_contract.can_prove, [
      "router binding preflight package exists and has the expected schema",
      "source binding readonly receipt exists and still records blocked_not_bound_in_router_refs",
      "this preflight does not authorize route HTTP, live probe, VCPToolBox read/write, provider, plugin, API, image, output, secret, env, config, staging, commit, push, tag, release, or deploy",
      "future router binding implementation is limited to exact separate authorization",
      "candidate file allowlist is narrow and derived from the binding readonly receipt",
      "package.json and validation_manifest register this validator"
    ]) &&
    includesAll(preflight.validator_contract.cannot_prove, [
      "VCPToolBox clean-main current state",
      "that Server.js/server.js are still the only files needed at future implementation time",
      "route gate enabled in a live process",
      "route reachable over HTTP",
      "future live activation authorized",
      "provider, plugin, API, image, or artifact success"
    ])
  );
  check("validator_source_does_not_access_env_http_or_vcptoolbox", () =>
    forbiddenSourceTokens.every((token) => !validatorSource.includes(token))
  );
  check("conclusion_keeps_live_probe_closed", () =>
    preflight.conclusion.result === "router_binding_preflight_drafted_no_execution" &&
    preflight.conclusion.current_permission === "cannot_run_live_probe_now" &&
    preflight.conclusion.current_route_selection === "secretless_option_a_router_binding_preflight_only"
  );
  check("package_script_registered", () =>
    packageJson.scripts &&
    packageJson.scripts[packageScriptName] === `node ${validatorPath}`
  );
  check("manifest_entry_registered", () => {
    const entry = manifest.validators.find((item) => item.id === manifestId);
    return entry &&
      entry.command === `npm run ${packageScriptName}` &&
      entry.script === validatorPath &&
      entry.tier === "targeted" &&
      entry.domain === "runtime_to_review" &&
      entry.status === "active" &&
      entry.estimated_runtime_class === "fast" &&
      includesAll(entry.trigger_paths, [
        preflightPath,
        validatorPath,
        readonlyReceiptPath,
        exactBindingPacketPath,
        callableBindingPreflightPath,
        runnerImplementationPath,
        runnerContractPath,
        pushedReceiptPath,
        failedReceiptPath,
        failedArtifactPath,
        ".agent_board/HANDOFF.md",
        ".agent_board/RUN_STATE.md",
        ".agent_board/TASK_QUEUE.md",
        ".agent_board/CHECKPOINT.md",
        ".agent_board/BLOCKERS.md",
        "package.json",
        "scripts/validation_manifest.json"
      ]) &&
      entry.required_for.includes(manifestId);
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    preflight: preflightPath,
    current_permission: preflight.conclusion.current_permission,
    current_route_selection: preflight.conclusion.current_route_selection,
    future_external_repo_modification_authorized_by_this_record: false,
    route_http_request_performed: false,
    live_probe_performed: false,
    external_vcptoolbox_read_performed_by_this_task: false,
    external_vcptoolbox_modified_by_this_task: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
    secret_value_read_performed: false,
    authorization_header_constructed_by_agent_image_lab: false,
    staging_performed: false,
    commit_performed: false,
    push_tag_release_deploy_performed: false,
    recommended_next: preflight.conclusion.recommended_next,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results
  }, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
