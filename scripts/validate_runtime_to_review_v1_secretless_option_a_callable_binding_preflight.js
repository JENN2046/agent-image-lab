#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_secretless_option_a_callable_binding_preflight";
const bindingPreflightPath = "reports/runtime_to_review_v1/secretless_option_a_callable_binding_preflight_20260603.json";
const runnerImplementationPath = "reports/runtime_to_review_v1/secretless_option_a_callable_runner_implementation_preflight_20260603.json";
const runnerContractPath = "reports/runtime_to_review_v1/secretless_option_a_callable_runner_contract_preflight_20260603.json";
const pushedReceiptPath = "reports/runtime_to_review_v1/secretless_serum_route_option_a_vcptoolbox_implementation_pushed_receipt_20260603.json";
const activationPreflightPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_activation_preflight_20260603.json";
const failedReceiptPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_001.json";
const failedArtifactPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_001.json";
const runnerPath = "scripts/run_runtime_to_review_v1_secretless_option_a_callable_runner.js";
const validatorPath = "scripts/validate_runtime_to_review_v1_secretless_option_a_callable_binding_preflight.js";
const packageScriptName = "validate:runtime-to-review-secretless-option-a-callable-binding-preflight";
const manifestId = "runtime_to_review_secretless_option_a_callable_binding_preflight";
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
  const binding = readJson(bindingPreflightPath);
  const implementation = readJson(runnerImplementationPath);
  const contract = readJson(runnerContractPath);
  const pushedReceipt = readJson(pushedReceiptPath);
  const activationPreflight = readJson(activationPreflightPath);
  const failedReceipt = readJson(failedReceiptPath);
  const failedArtifact = readJson(failedArtifactPath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const runner = require(repoPath(runnerPath));
  const runnerSource = fs.readFileSync(repoPath(runnerPath), "utf8");
  const validatorSource = fs.readFileSync(repoPath(validatorPath), "utf8");
  const processEnvToken = "process" + "." + "env";
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
  const requiredFutureBindingFields = [
    "binding_id",
    "activation_package_id",
    "required_owner_confirmation_phrase",
    "route_id",
    "transport_kind",
    "callable_target_ref",
    "method_or_operation",
    "request_payload_schema_ref",
    "allowed_non_secret_payload_fields",
    "forbidden_payload_keys_normalized_anywhere",
    "max_provider_calls",
    "max_plugin_calls",
    "max_api_calls",
    "max_images",
    "retry_allowed",
    "receipt_ref",
    "artifact_record_ref",
    "output_directory_ref",
    "route_gate_expected",
    "vcptoolbox_required_commit",
    "overwrite_existing_files_allowed",
    "secret_value_read_allowed",
    "agent_image_lab_authorization_header_construction_allowed",
    "validation_required",
    "stop_conditions"
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

  check("binding_preflight_schema_status_and_mode", () =>
    binding.schema === "runtime_to_review_v1_secretless_option_a_callable_binding_preflight.v1" &&
    binding.preflight_id === "secretless_option_a_callable_binding_preflight_20260603" &&
    binding.lane === "Green_local_binding_preflight_validator_only" &&
    binding.mode === "callable_binding_preflight_no_route_http_no_external_read" &&
    binding.status === "completed_local_binding_preflight_no_execution"
  );
  check("source_refs_exist_and_prior_gap_is_preserved", () =>
    includesAll(binding.source_refs, [
      runnerImplementationPath,
      runnerContractPath,
      pushedReceiptPath,
      activationPreflightPath,
      failedReceiptPath,
      failedArtifactPath
    ]) &&
    binding.source_refs.every((relativePath) => fs.existsSync(repoPath(relativePath))) &&
    failedReceipt.status === "failed_closed_before_route_http_request" &&
    failedArtifact.result === "failed_closed_before_route_http_request" &&
    implementation.runner_contract.current_route_http_binding_status === "not_implemented_not_guessed_by_this_task" &&
    contract.callable_runner_contract.runner_must_not_guess_http_shape === true
  );
  check("current_permission_stays_non_executable", () =>
    binding.current_permission.current_live_probe_allowed === false &&
    binding.current_permission.can_execute_now === false &&
    binding.current_permission.authorization_granted_by_this_record === false &&
    binding.current_permission.activation_granted_by_this_record === false &&
    binding.current_permission.route_http_binding_granted_by_this_record === false &&
    binding.current_permission.binding_executable_now === false &&
    binding.current_permission.new_exact_activation_required_before_any_live_probe === true
  );
  check("scope_forbids_guessing_vcptoolbox_and_old_admin_route", () =>
    binding.binding_preflight_scope.runner_ref === runnerPath &&
    binding.binding_preflight_scope.runner_status === "local_preflight_only_fail_closed_runner_exists" &&
    binding.binding_preflight_scope.binding_status === "design_preflight_only_no_callable_binding_implemented" &&
    binding.binding_preflight_scope.must_not_guess_http_shape === true &&
    binding.binding_preflight_scope.must_not_read_vcptoolbox_source === true &&
    binding.binding_preflight_scope.must_not_modify_vcptoolbox === true &&
    binding.binding_preflight_scope.must_not_use_old_admin_auth_route === true &&
    binding.binding_preflight_scope.must_not_construct_agent_image_lab_authorization_header === true
  );
  check("future_binding_contract_requires_exact_packet_and_no_current_binding", () =>
    binding.future_binding_contract.binding_packet_required === true &&
    binding.future_binding_contract.future_binding_packet_kind === "exact_secretless_option_a_callable_binding_packet" &&
    includesAll(binding.future_binding_contract.required_fields, requiredFutureBindingFields) &&
    equalSet(binding.future_binding_contract.transport_kind_allowed_values, [
      "future_exact_local_http",
      "future_exact_local_callable"
    ]) &&
    binding.future_binding_contract.current_transport_kind_selected === null &&
    binding.future_binding_contract.current_callable_target_ref === null &&
    binding.future_binding_contract.current_method_or_operation === null &&
    binding.future_binding_contract.current_request_url_or_endpoint === null &&
    binding.future_binding_contract.current_binding_executable_now === false
  );
  check("payload_contract_matches_runner_exports", () =>
    equalSet(binding.payload_contract.allowed_non_secret_payload_fields, expectedAllowedFields) &&
    equalSet(binding.payload_contract.forbidden_payload_keys_normalized_anywhere, expectedForbiddenKeys) &&
    equalSet(runner.allowedNonSecretPayloadFields, expectedAllowedFields) &&
    equalSet(runner.forbiddenPayloadKeysNormalized, expectedForbiddenKeys) &&
    binding.payload_contract.payload_hash_required === true &&
    binding.payload_contract.secret_value_read_allowed === false &&
    binding.payload_contract.agent_image_lab_authorization_header_construction_allowed === false
  );
  check("runner_stays_preflight_only_or_failed_closed", () => {
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
  check("runner_rejects_transport_header_and_secret_like_payload_keys", () => {
    const cases = [
      { body: { context: { authorization: "blocked" } }, path: "body.context.authorization" },
      { body: { headers: { Authorization: "blocked" } }, path: "body.headers" },
      { body: { basic_auth: "blocked" }, path: "body.basic_auth" },
      { body: { token: "blocked" }, path: "body.token" },
      { body: { context: { auth: "blocked" } }, path: "body.context.auth" }
    ];
    return cases.every((testCase) => {
      const result = runner.validateRunnerInput({ body: testCase.body, preflightOnly: true });
      return result.ok === false &&
        result.status === "secretless_option_a_payload_contains_forbidden_secret_key" &&
        result.provider_contact_performed === false &&
        result.authorizer_call_count === 0 &&
        result.executor_call_count === 0 &&
        result.forbidden_payload_keys_detected.some((item) => item.path === testCase.path || item.path.startsWith(`${testCase.path}.`));
    });
  });
  check("stop_conditions_cover_binding_and_execution_boundaries", () =>
    includesAll(binding.stop_conditions, [
      "binding packet missing",
      "transport kind, method, endpoint, or callable target must be guessed",
      "VCPToolBox read is required to discover binding",
      "VCPToolBox modification is required by this task",
      "secret, env, config, cookie, token, or private raw data read becomes necessary",
      "Authorization header construction by Agent Image Lab becomes necessary",
      "old admin-auth route would be used",
      "forbidden payload key appears",
      "budget drifts from one provider / one plugin / one API / one image / no retry",
      "route HTTP is requested by this preflight",
      "live probe, provider, plugin, API, image, or output action is requested by this preflight"
    ])
  );
  check("validator_contract_declares_proof_limits", () =>
    binding.validator_contract.validator_ref === validatorPath &&
    binding.validator_contract.package_script === packageScriptName &&
    binding.validator_contract.manifest_id === manifestId &&
    includesAll(binding.validator_contract.can_prove, [
      "binding design package exists and has the expected schema",
      "current binding remains non-executable",
      "future binding fields are explicit and not guessed",
      "runner exists and remains preflight-only/fail-closed under the current task",
      "payload allowlist and forbidden-key contract match the runner",
      "package.json and validation_manifest register this validator"
    ]) &&
    includesAll(binding.validator_contract.cannot_prove, [
      "VCPToolBox endpoint, method, or callable target",
      "route gate enabled in a live process",
      "route reachable at runtime",
      "future live activation authorized",
      "provider, plugin, API, or image success"
    ])
  );
  check("prior_option_a_evidence_matches_expected_commit", () =>
    pushedReceipt.pushed_implementation_event.pushed_commit === pushedCommit &&
    activationPreflight.future_execution_scope_if_later_separately_activated.vcptoolbox_required_commit === pushedCommit &&
    failedReceipt.agent_image_lab_execution_entry_discovery.old_admin_auth_guarded_live_probe_runner_used === false
  );
  check("non_execution_boundary_all_false", () =>
    fieldsAreFalse(binding.non_execution_boundary, boundaryFalseFields)
  );
  check("sources_do_not_access_secret_or_uncontrolled_http_surface", () =>
    !runnerSource.includes(processEnvToken) &&
    !validatorSource.includes(processEnvToken) &&
    !runnerSource.includes("require(\"node:http\")") &&
    !runnerSource.includes("require('node:http')") &&
    !runnerSource.includes("require(\"node:https\")") &&
    !runnerSource.includes("require('node:https')") &&
    !runnerSource.includes("axios") &&
    !runnerSource.includes("Authorization:") &&
    runnerSource.includes("function probeTcpListener") &&
    runnerSource.includes("tcp_listener_probe_observed_no_route_http_request") &&
    runnerSource.includes("expected_status = \"tcp_connect_success_without_http_route_request\"") &&
    runnerSource.includes("route_http_request_performed: false")
  );
  check("conclusion_keeps_live_probe_closed", () =>
    binding.conclusion.result === "callable_binding_preflight_drafted_no_execution" &&
    binding.conclusion.current_permission === "cannot_run_live_probe_now" &&
    binding.conclusion.current_route_selection === "secretless_option_a_runner_exists_binding_still_missing"
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
        bindingPreflightPath,
        validatorPath,
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
    binding_preflight: bindingPreflightPath,
    current_permission: binding.conclusion.current_permission,
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
    next_safe_action: binding.conclusion.next_safe_action,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results
  }, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
