#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_secretless_option_a_exact_binding_packet_draft";
const packetPath = "reports/runtime_to_review_v1/secretless_option_a_exact_binding_packet_draft_20260603.json";
const bindingPreflightPath = "reports/runtime_to_review_v1/secretless_option_a_callable_binding_preflight_20260603.json";
const runnerImplementationPath = "reports/runtime_to_review_v1/secretless_option_a_callable_runner_implementation_preflight_20260603.json";
const runnerContractPath = "reports/runtime_to_review_v1/secretless_option_a_callable_runner_contract_preflight_20260603.json";
const pushedReceiptPath = "reports/runtime_to_review_v1/secretless_serum_route_option_a_vcptoolbox_implementation_pushed_receipt_20260603.json";
const activationPreflightPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_activation_preflight_20260603.json";
const failedReceiptPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_001.json";
const failedArtifactPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_001.json";
const runnerPath = "scripts/run_runtime_to_review_v1_secretless_option_a_callable_runner.js";
const validatorPath = "scripts/validate_runtime_to_review_v1_secretless_option_a_exact_binding_packet_draft.js";
const packageScriptName = "validate:runtime-to-review-secretless-option-a-exact-binding-packet-draft";
const manifestId = "runtime_to_review_secretless_option_a_exact_binding_packet_draft";
const pushedCommit = "cf1fa55b36e9aeece2718bf2c9425c44db24cb25";

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

function allRunnerBoundaryFalse(result) {
  return Boolean(result) &&
    result.route_http_request_performed === false &&
    result.live_probe_performed === false &&
    result.provider_contact_performed === false &&
    result.plugin_call_performed === false &&
    result.api_call_performed === false &&
    result.image_generation_performed === false &&
    result.output_write_performed === false &&
    result.secret_value_read_performed === false &&
    result.env_file_content_read_performed === false &&
    result.config_env_read_performed === false &&
    result.authorization_header_constructed_by_agent_image_lab === false &&
    result.authorizer_call_count === 0 &&
    result.executor_call_count === 0 &&
    result.retry_performed === false;
}

function main() {
  const packet = readJson(packetPath);
  const bindingPreflight = readJson(bindingPreflightPath);
  const runnerImplementation = readJson(runnerImplementationPath);
  const runnerContract = readJson(runnerContractPath);
  const pushedReceipt = readJson(pushedReceiptPath);
  const activationPreflight = readJson(activationPreflightPath);
  const failedReceipt = readJson(failedReceiptPath);
  const failedArtifact = readJson(failedArtifactPath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const runner = require(repoPath(runnerPath));
  const validatorSource = fs.readFileSync(repoPath(validatorPath), "utf8");
  const processEnvToken = "process" + "." + "env";
  const forbiddenValidatorSourceTokens = [
    processEnvToken,
    "fet" + "ch(",
    "axi" + "os",
    "require(" + "\"node:" + "http" + "\")",
    "require(" + "'node:" + "http" + "')",
    "require(" + "\"node:" + "https" + "\")",
    "require(" + "'node:" + "https" + "')"
  ];
  const expectedAllowedFields = [
    "task_id",
    "route_id",
    "target_product",
    "prompt_package_ref",
    "model_id",
    "max_provider_calls",
    "max_plugin_calls",
    "max_api_calls",
    "max_images",
    "retry_allowed",
    "receipt_ref",
    "artifact_record_ref",
    "output_directory_ref",
    "non_secret_payload_hash"
  ];
  const expectedForbiddenKeys = [
    "adminusername",
    "adminpassword",
    "basicauthheader",
    "authorizationheader",
    "authorization",
    "basicauth",
    "auth",
    "bearertoken",
    "token",
    "secretenvvarvalue",
    "apikey",
    "accesstoken",
    "refreshtoken",
    "password",
    "cookie",
    "headers"
  ];
  const boundaryFalseFields = [
    "external_vcptoolbox_read_performed_by_this_task",
    "external_vcptoolbox_modified_by_this_task",
    "route_http_request_performed",
    "live_probe_performed",
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "image_generation_performed",
    "output_write_performed",
    "secret_value_read_performed",
    "env_file_content_read_performed",
    "config_env_read_performed",
    "authorization_header_constructed_by_agent_image_lab",
    "authorizer_call_performed",
    "executor_call_performed",
    "DailyNote_write_performed",
    "VCP_memory_write_performed",
    "staging_performed",
    "commit_performed",
    "push_tag_release_deploy_performed"
  ];

  check("packet_schema_status_and_mode", () =>
    packet.schema === "runtime_to_review_v1_secretless_option_a_exact_binding_packet_draft.v1" &&
    packet.packet_id === "BINDING-DRAFT-SECRETLESS-OPTION-A-SERUM-20260603-001" &&
    packet.lane === "Green_local_exact_binding_packet_draft_validator_only" &&
    packet.mode === "exact_binding_packet_draft_no_route_http_no_external_read" &&
    packet.status === "draft_not_active_non_executable"
  );
  check("source_refs_exist_and_link_prior_binding_preflight", () =>
    includesAll(packet.source_refs, [
      bindingPreflightPath,
      runnerImplementationPath,
      runnerContractPath,
      pushedReceiptPath,
      activationPreflightPath,
      failedReceiptPath,
      failedArtifactPath
    ]) &&
    packet.source_refs.every((relativePath) => fs.existsSync(repoPath(relativePath))) &&
    bindingPreflight.future_binding_contract.future_binding_packet_kind === "exact_secretless_option_a_callable_binding_packet" &&
    runnerImplementation.runner_contract.current_route_http_binding_status === "not_implemented_not_guessed_by_this_task" &&
    runnerContract.callable_runner_contract.runner_must_not_guess_http_shape === true
  );
  check("current_permission_stays_inactive", () =>
    packet.current_permission.current_live_probe_allowed === false &&
    packet.current_permission.can_execute_now === false &&
    packet.current_permission.authorization_granted_by_this_record === false &&
    packet.current_permission.activation_granted_by_this_record === false &&
    packet.current_permission.binding_active === false &&
    packet.current_permission.binding_executable_now === false &&
    packet.current_permission.route_http_allowed_by_this_packet === false &&
    packet.current_permission.route_http_binding_granted_by_this_record === false &&
    packet.current_permission.new_exact_activation_required_before_any_live_probe === true
  );
  check("exact_local_callable_binding_target_is_explicit", () =>
    packet.exact_binding_packet_draft.binding_id === "secretless_option_a_serum_bottle_callable_binding_draft_20260603_001" &&
    packet.exact_binding_packet_draft.binding_status === "draft_not_active" &&
    packet.exact_binding_packet_draft.binding_kind === "agent_image_lab_local_callable_runner_binding_draft" &&
    packet.exact_binding_packet_draft.transport_kind === "future_exact_local_callable" &&
    packet.exact_binding_packet_draft.callable_target_ref === runnerPath &&
    packet.exact_binding_packet_draft.callable_export === "runSecretlessOptionACallableRunner" &&
    packet.exact_binding_packet_draft.method_or_operation === "module_export_call" &&
    typeof runner[packet.exact_binding_packet_draft.callable_export] === "function"
  );
  check("route_http_shape_is_not_guessed_or_authorized", () =>
    packet.exact_binding_packet_draft.request_url_or_endpoint === null &&
    packet.exact_binding_packet_draft.request_url_or_endpoint_source === "not_included_no_vcptoolbox_read_no_http_shape_guessing" &&
    packet.exact_binding_packet_draft.route_http_method === null &&
    packet.exact_binding_packet_draft.route_http_endpoint_resolution_required_before_live_probe === true &&
    packet.exact_binding_packet_draft.route_http_request_allowed_by_this_packet === false &&
    packet.exact_binding_packet_draft.route_http_implementation_status === "not_implemented_not_guessed_by_this_packet" &&
    packet.exact_binding_packet_draft.old_admin_auth_route_allowed === false &&
    packet.exact_binding_packet_draft.agent_image_lab_authorization_header_construction_allowed === false &&
    packet.exact_binding_packet_draft.secret_value_read_allowed === false
  );
  check("payload_contract_matches_runner_exports", () =>
    equalSet(packet.payload_contract.allowed_non_secret_payload_fields, expectedAllowedFields) &&
    equalSet(packet.payload_contract.forbidden_payload_keys_normalized_anywhere, expectedForbiddenKeys) &&
    equalSet(runner.allowedNonSecretPayloadFields, expectedAllowedFields) &&
    equalSet(runner.forbiddenPayloadKeysNormalized, expectedForbiddenKeys) &&
    packet.payload_contract.payload_hash_required === true &&
    packet.payload_contract.secret_value_read_allowed === false &&
    packet.payload_contract.agent_image_lab_authorization_header_construction_allowed === false
  );
  check("budget_is_one_provider_one_plugin_one_api_one_image_no_retry", () =>
    packet.budget.max_provider_calls === 1 &&
    packet.budget.max_plugin_calls === 1 &&
    packet.budget.max_api_calls === 1 &&
    packet.budget.max_images === 1 &&
    packet.budget.max_live_attempts === 1 &&
    packet.budget.retry_allowed === false &&
    packet.exact_binding_packet_draft.retry_allowed === false &&
    packet.exact_binding_packet_draft.overwrite_existing_files_allowed === false
  );
  check("runner_still_preflight_only_or_failed_closed", () => {
    const preflight = runner.runSecretlessOptionACallableRunner({ preflightOnly: true });
    const nonPreflight = runner.runSecretlessOptionACallableRunner({});
    return preflight.ok === true &&
      preflight.status === "secretless_option_a_callable_runner_preflight_only_passed_no_route_http" &&
      allRunnerBoundaryFalse(preflight) &&
      allRunnerBoundaryFalse(preflight.result) &&
      nonPreflight.ok === false &&
      nonPreflight.status === "secretless_option_a_callable_runner_failed_closed_route_http_not_authorized" &&
      allRunnerBoundaryFalse(nonPreflight) &&
      allRunnerBoundaryFalse(nonPreflight.result);
  });
  check("future_activation_requirements_are_explicit", () =>
    includesAll(packet.future_activation_requirements, [
      "new exact activation naming this binding packet id or a successor packet id",
      "current Agent Image Lab worktree clean before live attempt",
      "current VCPToolBox baseline verified separately without secret reads",
      "route gate enabled verified by a separately authorized preflight",
      "route HTTP endpoint or local callable route transport supplied by exact binding evidence without guessing",
      "output directory overwrite check passes",
      "planned receipt and artifact record paths do not already exist",
      "payload contains only allowed non-secret fields",
      "payload contains no forbidden secret-bearing key anywhere in the body tree",
      "budget remains one provider / one plugin / one API / one image / no retry"
    ])
  );
  check("stop_conditions_cover_no_vcptoolbox_no_secret_no_http", () =>
    includesAll(packet.stop_conditions, [
      "binding packet is treated as active without a new exact activation",
      "route HTTP is requested by this draft",
      "request URL, endpoint, HTTP method, or VCPToolBox callable target must be guessed",
      "VCPToolBox read is required to discover binding",
      "VCPToolBox modification is required by this task",
      "secret, env, config, cookie, token, or private raw data read becomes necessary",
      "Authorization header construction by Agent Image Lab becomes necessary",
      "old admin-auth route would be used",
      "forbidden payload key appears",
      "payload contains a headers object",
      "budget drifts from one provider / one plugin / one API / one image / no retry",
      "live probe, provider, plugin, API, image, or output action is requested by this draft"
    ])
  );
  check("prior_option_a_evidence_matches_expected_commit", () =>
    pushedReceipt.pushed_implementation_event.pushed_commit === pushedCommit &&
    activationPreflight.future_execution_scope_if_later_separately_activated.vcptoolbox_required_commit === pushedCommit &&
    failedReceipt.status === "failed_closed_before_route_http_request" &&
    failedArtifact.result === "failed_closed_before_route_http_request"
  );
  check("validator_contract_declares_scope_and_limits", () =>
    packet.validator_contract.validator_ref === validatorPath &&
    packet.validator_contract.package_script === packageScriptName &&
    packet.validator_contract.manifest_id === manifestId &&
    includesAll(packet.validator_contract.can_prove, [
      "binding packet draft exists and has the expected schema",
      "binding packet draft remains inactive and non-executable",
      "local callable runner target and export are explicit",
      "route HTTP endpoint and method are not guessed",
      "payload allowlist and forbidden-key contract match the runner",
      "runner still fails closed for non-preflight route HTTP",
      "package.json and validation_manifest register this validator"
    ]) &&
    includesAll(packet.validator_contract.cannot_prove, [
      "VCPToolBox endpoint, method, or callable target",
      "route gate enabled in a live process",
      "route reachable at runtime",
      "future live activation authorized",
      "provider, plugin, API, or image success"
    ])
  );
  check("non_execution_boundary_all_false", () =>
    fieldsAreFalse(packet.non_execution_boundary, boundaryFalseFields)
  );
  check("validator_source_does_not_access_runtime_env_or_http", () =>
    forbiddenValidatorSourceTokens.every((token) => !validatorSource.includes(token))
  );
  check("conclusion_keeps_live_probe_closed", () =>
    packet.conclusion.result === "exact_binding_packet_draft_created_no_execution" &&
    packet.conclusion.current_permission === "cannot_run_live_probe_now" &&
    packet.conclusion.current_route_selection === "secretless_option_a_exact_binding_packet_draft_inactive"
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
        packetPath,
        validatorPath,
        bindingPreflightPath,
        runnerImplementationPath,
        runnerPath,
        "scripts/validate_runtime_to_review_v1_secretless_option_a_callable_runner.js",
        runnerContractPath,
        pushedReceiptPath,
        activationPreflightPath,
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
      entry.required_for.includes(manifestId)
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    packet: packetPath,
    current_permission: packet.conclusion.current_permission,
    binding_active: false,
    binding_executable_now: false,
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
    next_safe_action: packet.conclusion.next_safe_action,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results
  }, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
