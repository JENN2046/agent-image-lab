#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_secretless_option_a_callable_runner";
const implementationPreflightPath = "reports/runtime_to_review_v1/secretless_option_a_callable_runner_implementation_preflight_20260603.json";
const contractPreflightPath = "reports/runtime_to_review_v1/secretless_option_a_callable_runner_contract_preflight_20260603.json";
const pushedReceiptPath = "reports/runtime_to_review_v1/secretless_serum_route_option_a_vcptoolbox_implementation_pushed_receipt_20260603.json";
const failedReceiptPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_001.json";
const failedArtifactPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_001.json";
const activationPreflightPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_activation_preflight_20260603.json";
const runnerPath = "scripts/run_runtime_to_review_v1_secretless_option_a_callable_runner.js";
const validatorPath = "scripts/validate_runtime_to_review_v1_secretless_option_a_callable_runner.js";
const packageScriptName = "validate:runtime-to-review-secretless-option-a-callable-runner";
const manifestId = "runtime_to_review_secretless_option_a_callable_runner";

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

function allBoundaryFalse(object) {
  return Boolean(object) &&
    object.route_http_request_performed === false &&
    object.live_probe_performed === false &&
    object.provider_contact_performed === false &&
    object.plugin_call_performed === false &&
    object.api_call_performed === false &&
    object.image_generation_performed === false &&
    object.output_write_performed === false &&
    object.secret_value_read_performed === false &&
    object.env_file_content_read_performed === false &&
    object.config_env_read_performed === false &&
    object.authorization_header_constructed_by_agent_image_lab === false &&
    object.authorizer_call_count === 0 &&
    object.executor_call_count === 0 &&
    object.retry_performed === false;
}

function main() {
  const implementationPreflight = readJson(implementationPreflightPath);
  const contractPreflight = readJson(contractPreflightPath);
  const pushedReceipt = readJson(pushedReceiptPath);
  const failedReceipt = readJson(failedReceiptPath);
  const failedArtifact = readJson(failedArtifactPath);
  const activationPreflight = readJson(activationPreflightPath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const runnerSource = fs.readFileSync(repoPath(runnerPath), "utf8");
  const runner = require(repoPath(runnerPath));
  const processEnvToken = "process" + "." + "env";
  const expectedAllowedFiles = [
    implementationPreflightPath,
    runnerPath,
    validatorPath,
    "package.json",
    "scripts/validation_manifest.json",
    ".agent_board/HANDOFF.md",
    ".agent_board/RUN_STATE.md",
    ".agent_board/TASK_QUEUE.md",
    ".agent_board/CHECKPOINT.md",
    ".agent_board/BLOCKERS.md"
  ];
  const expectedAllowedPayloadFields = [
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
  const forbiddenCases = [
    {
      name: "context.authorization",
      body: { task_id: "x", context: { authorization: "blocked" } },
      expectedPath: "body.context.authorization"
    },
    {
      name: "headers.Authorization",
      body: { task_id: "x", headers: { Authorization: "blocked" } },
      expectedPath: "body.headers"
    },
    {
      name: "basic_auth",
      body: { task_id: "x", basic_auth: "blocked" },
      expectedPath: "body.basic_auth"
    },
    {
      name: "token",
      body: { task_id: "x", token: "blocked" },
      expectedPath: "body.token"
    },
    {
      name: "context.auth",
      body: { task_id: "x", context: { auth: "blocked" } },
      expectedPath: "body.context.auth"
    }
  ];

  check("implementation_preflight_schema_and_allowlist", () =>
    implementationPreflight.schema === "runtime_to_review_v1_secretless_option_a_callable_runner_implementation_preflight.v1" &&
    implementationPreflight.preflight_id === "secretless_option_a_callable_runner_implementation_preflight_20260603" &&
    implementationPreflight.mode === "exact_file_local_runner_implementation_no_route_http" &&
    implementationPreflight.status === "completed_validated_local_runner_implementation_no_route_http" &&
    equalSet(implementationPreflight.exact_file_allowlist, expectedAllowedFiles)
  );
  check("source_refs_exist_and_prior_gap_is_preserved", () =>
    includesAll(implementationPreflight.source_refs, [
      contractPreflightPath,
      pushedReceiptPath,
      activationPreflightPath,
      failedReceiptPath,
      failedArtifactPath
    ]) &&
    implementationPreflight.source_refs.every((relativePath) => fs.existsSync(repoPath(relativePath))) &&
    contractPreflight.current_problem.blocker === "exact_secretless_execution_entry_missing_in_agent_image_lab" &&
    failedReceipt.status === "failed_closed_before_route_http_request" &&
    failedArtifact.result === "failed_closed_before_route_http_request"
  );
  check("runner_contract_is_local_no_route_http", () =>
    implementationPreflight.runner_contract.runner_ref === runnerPath &&
    implementationPreflight.runner_contract.default_behavior === "preflight_only_no_route_http" &&
    implementationPreflight.runner_contract.non_preflight_behavior_now === "failed_closed_route_http_not_authorized" &&
    implementationPreflight.runner_contract.current_route_http_binding_status === "not_implemented_not_guessed_by_this_task" &&
    implementationPreflight.runner_contract.new_exact_activation_required_before_route_http === true &&
    implementationPreflight.runner_contract.old_admin_auth_route_allowed === false &&
    implementationPreflight.runner_contract.agent_image_lab_authorization_header_construction_allowed === false &&
    implementationPreflight.runner_contract.secret_value_read_allowed === false &&
    implementationPreflight.runner_contract.max_provider_calls === 1 &&
    implementationPreflight.runner_contract.max_plugin_calls === 1 &&
    implementationPreflight.runner_contract.max_api_calls === 1 &&
    implementationPreflight.runner_contract.max_images === 1 &&
    implementationPreflight.runner_contract.retry_allowed === false
  );
  check("payload_contract_matches_runner_exports", () =>
    equalSet(implementationPreflight.payload_contract.allowed_non_secret_payload_fields, expectedAllowedPayloadFields) &&
    equalSet(implementationPreflight.payload_contract.forbidden_payload_keys_normalized_anywhere, expectedForbiddenKeys) &&
    equalSet(runner.allowedNonSecretPayloadFields, expectedAllowedPayloadFields) &&
    equalSet(runner.forbiddenPayloadKeysNormalized, expectedForbiddenKeys)
  );
  check("payload_builder_returns_exact_allowed_fields_and_hash", () => {
    const payload = runner.buildNonSecretPayload();
    const keys = Object.keys(payload);
    const secondPayload = runner.buildNonSecretPayload();
    return equalSet(keys, expectedAllowedPayloadFields) &&
      payload.non_secret_payload_hash === secondPayload.non_secret_payload_hash &&
      payload.max_provider_calls === 1 &&
      payload.max_plugin_calls === 1 &&
      payload.max_api_calls === 1 &&
      payload.max_images === 1 &&
      payload.retry_allowed === false;
  });
  check("forbidden_nested_payload_keys_fail_before_execution", () =>
    forbiddenCases.every((testCase) => {
      const result = runner.validateRunnerInput({ body: testCase.body, preflightOnly: true });
      return result.ok === false &&
        result.status === "secretless_option_a_payload_contains_forbidden_secret_key" &&
        result.provider_contact_performed === false &&
        result.executor_call_count === 0 &&
        result.authorizer_call_count === 0 &&
        result.forbidden_payload_keys_detected.some((item) => item.path === testCase.expectedPath || item.path.startsWith(`${testCase.expectedPath}.`));
    })
  );
  check("preflight_only_runner_executes_no_external_action", () => {
    const result = runner.runSecretlessOptionACallableRunner({ preflightOnly: true });
    return result.ok === true &&
      result.passed === true &&
      result.status === "secretless_option_a_callable_runner_preflight_only_passed_no_route_http" &&
      allBoundaryFalse(result) &&
      allBoundaryFalse(result.result) &&
      result.result.payload.target_product === "premium_serum_bottle";
  });
  check("route_http_request_fails_closed_now", () => {
    const result = runner.runSecretlessOptionACallableRunner({ confirmRouteHttp: true });
    return result.ok === false &&
      result.passed === false &&
      result.status === "secretless_option_a_route_http_not_allowed_by_current_task" &&
      allBoundaryFalse(result) &&
      allBoundaryFalse(result.result);
  });
  check("non_preflight_without_route_binding_fails_closed", () => {
    const result = runner.runSecretlessOptionACallableRunner({});
    return result.ok === false &&
      result.passed === false &&
      result.status === "secretless_option_a_callable_runner_failed_closed_route_http_not_authorized" &&
      allBoundaryFalse(result) &&
      allBoundaryFalse(result.result);
  });
  check("default_runner_source_has_no_secret_or_legacy_http_surface", () =>
    !runnerSource.includes(processEnvToken) &&
    !runnerSource.includes("require(\"node:http\")") &&
    !runnerSource.includes("require('node:http')") &&
    !runnerSource.includes("require(\"node:https\")") &&
    !runnerSource.includes("require('node:https')") &&
    !runnerSource.includes("axios") &&
    !runnerSource.includes("dotenv") &&
    !runnerSource.includes(".env") &&
    !runnerSource.includes("Authorization:") &&
    runner.runSecretlessOptionACallableRunner({ preflightOnly: true }).route_http_request_performed === false &&
    runner.runSecretlessOptionACallableRunner({}).route_http_request_performed === false
  );
  check("prior_option_a_evidence_still_matches", () =>
    pushedReceipt.pushed_implementation_event.pushed_commit === "cf1fa55b36e9aeece2718bf2c9425c44db24cb25" &&
    activationPreflight.future_execution_scope_if_later_separately_activated.vcptoolbox_required_commit === "cf1fa55b36e9aeece2718bf2c9425c44db24cb25" &&
    failedReceipt.agent_image_lab_execution_entry_discovery.old_admin_auth_guarded_live_probe_runner_used === false
  );
  check("non_execution_boundary_all_false", () =>
    Object.values(implementationPreflight.non_execution_boundary).every((value) => value === false)
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
        implementationPreflightPath,
        runnerPath,
        validatorPath,
        contractPreflightPath,
        failedReceiptPath,
        failedArtifactPath,
        pushedReceiptPath,
        activationPreflightPath,
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
    implementation_preflight: implementationPreflightPath,
    runner: runnerPath,
    route_http_request_performed: false,
    live_probe_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    config_env_read_performed: false,
    authorization_header_constructed_by_agent_image_lab: false,
    authorizer_call_count: 0,
    executor_call_count: 0,
    commit_performed: false,
    push_tag_release_deploy_performed: false,
    current_permission: implementationPreflight.conclusion.current_permission,
    next_safe_action: implementationPreflight.conclusion.next_safe_action,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results
  }, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
