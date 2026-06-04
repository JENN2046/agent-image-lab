#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_secretless_serum_live_probe_receipt_attempt_006";
const receiptPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_006.json";
const artifactPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_006.json";
const validatorPath = "scripts/validate_runtime_to_review_v1_secretless_serum_live_probe_receipt_attempt_006.js";
const runnerPath = "scripts/run_runtime_to_review_v1_secretless_option_a_callable_runner.js";
const packageScriptName = "validate:runtime-to-review-secretless-serum-live-probe-receipt-attempt-006";
const manifestId = "runtime_to_review_secretless_serum_live_probe_receipt_attempt_006";
const activationPackageId = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-006";
const requiredCommit = "d0d5c104ae741e7be993cf1c760126bea9a44567";
const routePath = "/internal/ai-image-agents/execute/serum-bottle-secretless";
const allowPending = process.argv.includes("--allow-pending");

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

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
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

function registrationChecks() {
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const runner = require(repoPath(runnerPath));
  const runnerSource = fs.readFileSync(repoPath(runnerPath), "utf8");
  const validatorSource = fs.readFileSync(repoPath(validatorPath), "utf8");

  check("runner_exports_attempt_006_activation_and_defaults", () =>
    runner.exactRouteHttpActivationPackageIdAttempt006 === activationPackageId &&
    runner.exactRouteHttpPathAttempt005 === routePath &&
    runner.defaultRouteHttpInputAttempt006.activationPackageId === activationPackageId &&
    runner.defaultRouteHttpInputAttempt006.routeHttpPath === routePath &&
    runner.defaultRouteHttpInputAttempt006.routeHttpEndpointSource.includes(requiredCommit) &&
    runner.defaultRouteHttpInputAttempt006.receiptRef === receiptPath &&
    runner.defaultRouteHttpInputAttempt006.artifactRecordRef === artifactPath &&
    runner.defaultRouteHttpInputAttempt006.outputDirectoryRef === "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_006/" &&
    runner.allowedExactRouteHttpActivationPackageIds.includes(activationPackageId)
  );

  check("runner_attempt_006_transport_preflight_validates", () => {
    const result = runner.validateExactRouteHttpTransportInput({
      activationPackageId,
      confirmationPhrase: "RUNTIME_TO_REVIEW_V1_SECRETLESS_SERUM_BOTTLE_ONE_PROVIDER_ONE_IMAGE",
      routeHttpOrigin: "http://127.0.0.1:6005",
      routeHttpMethod: "POST",
      routeHttpPath: routePath
    });
    return result.ok === true &&
      result.route_http_url === `http://127.0.0.1:6005${routePath}` &&
      result.body.task_id === activationPackageId &&
      result.body.pipeline_id === "secretless-serum-live-probe-attempt-006" &&
      result.body.max_provider_calls === 1 &&
      result.body.max_plugin_calls === 1 &&
      result.body.max_api_calls === 1 &&
      result.body.max_images === 1 &&
      result.body.retry_allowed === false &&
      result.route_http_request_performed === false;
  });

  check("runner_attempt_006_wrong_path_fails_closed", () => {
    const result = runner.validateExactRouteHttpTransportInput({
      activationPackageId,
      confirmationPhrase: "RUNTIME_TO_REVIEW_V1_SECRETLESS_SERUM_BOTTLE_ONE_PROVIDER_ONE_IMAGE",
      routeHttpOrigin: "http://127.0.0.1:6005",
      routeHttpMethod: "POST",
      routeHttpPath: "/admin_api/ai-image-agents/execute/serum-bottle-secretless"
    });
    return result.ok === false &&
      result.status === "secretless_option_a_route_http_path_mismatch" &&
      result.route_http_request_performed === false;
  });

  check("package_script_registered", () =>
    packageJson.scripts &&
    packageJson.scripts[packageScriptName] === `node ${validatorPath}`
  );

  check("manifest_entry_registered_for_attempt_006", () => {
    const entry = manifest.validators.find((item) => item.id === manifestId);
    return entry &&
      entry.command === `npm run ${packageScriptName} -- --allow-pending` &&
      entry.script === validatorPath &&
      entry.tier === "targeted" &&
      entry.domain === "runtime_to_review" &&
      entry.status === "active" &&
      includesAll(entry.trigger_paths, [
        receiptPath,
        artifactPath,
        validatorPath,
        runnerPath,
        "package.json",
        "scripts/validation_manifest.json"
      ]) &&
      entry.required_for.includes(manifestId);
  });

  check("sources_do_not_access_env_or_construct_auth_header", () =>
    !runnerSource.includes("process" + "." + "env") &&
    !runnerSource.includes("dot" + "env") &&
    !runnerSource.includes(".env") &&
    !runnerSource.includes("Authorization:") &&
    !validatorSource.includes("process" + "." + "env") &&
    !validatorSource.includes("dot" + "env") &&
    !validatorSource.includes("fet" + "ch(") &&
    !validatorSource.includes("node:" + "http") &&
    !validatorSource.includes("node:" + "https")
  );
}

function receiptChecks() {
  const receipt = readJson(receiptPath);
  const artifact = readJson(artifactPath);
  const terminalStatuses = [
    "completed_live_probe_output_recorded",
    "failed_closed_route_http_response_not_ok",
    "failed_closed_route_http_response_received_not_ok"
  ];
  const terminalResults = [
    "COMPLETED_LIVE_PROBE_OUTPUT_RECORDED",
    "FAILED_CLOSED_ROUTE_HTTP_RESPONSE_NOT_OK",
    "FAILED_CLOSED_ROUTE_HTTP_RESPONSE_RECEIVED_NOT_OK"
  ];

  check("receipt_schema_and_activation", () =>
    receipt.schema === "runtime_to_review_v1_secretless_serum_live_probe_receipt.v5" &&
    receipt.activation_package_id === activationPackageId &&
    receipt.confirmation_phrase === "RUNTIME_TO_REVIEW_V1_SECRETLESS_SERUM_BOTTLE_ONE_PROVIDER_ONE_IMAGE" &&
    terminalStatuses.includes(receipt.status) &&
    terminalResults.includes(receipt.result)
  );

  check("route_and_baseline_exact", () =>
    receipt.vcptoolbox_required_commit === requiredCommit &&
    receipt.route_http_transport.origin === "http://127.0.0.1:6005" &&
    receipt.route_http_transport.method === "POST" &&
    receipt.route_http_transport.path === routePath &&
    receipt.route_http_transport.url === `http://127.0.0.1:6005${routePath}` &&
    receipt.pre_execution_checks.vcptoolbox_head_verified === requiredCommit &&
    (
      receipt.pre_execution_checks.listener_check.includes("TcpTestSucceeded=True") ||
      receipt.pre_execution_checks.listener_check.includes("Listen")
    ) &&
    receipt.pre_execution_checks.route_surface_non_post_check === "OPTIONS returned 204 NoContent"
  );

  check("binding_and_preflight_checks_recorded", () =>
    receipt.binding_packet_ref === "reports/runtime_to_review_v1/secretless_option_a_exact_binding_packet_draft_20260603_attempt_002.json" &&
    receipt.pre_execution_checks.binding_packet_validation === "passed" &&
    receipt.pre_execution_checks.attempt_006_transport_input_validation === "passed" &&
    receipt.pre_execution_checks.authorization_header_required === false &&
    receipt.pre_execution_checks.old_admin_auth_route_used === false
  );

  check("boundary_and_budget", () =>
    receipt.boundary.route_http_request_performed === true &&
    receipt.calls_used.route_http_request === 1 &&
    receipt.calls_used.provider <= 1 &&
    receipt.calls_used.plugin <= 1 &&
    receipt.calls_used.api <= 1 &&
    receipt.calls_used.image <= 1 &&
    receipt.boundary.secret_value_read_performed === false &&
    receipt.boundary.env_file_content_read_performed === false &&
    receipt.boundary.config_env_read_performed === false &&
    receipt.boundary.authorization_header_constructed_by_agent_image_lab === false &&
    receipt.boundary.retry_performed === false &&
    receipt.boundary.push_tag_release_deploy_performed === false &&
    receipt.payload_summary.max_provider_calls === 1 &&
    receipt.payload_summary.max_plugin_calls === 1 &&
    receipt.payload_summary.max_api_calls === 1 &&
    receipt.payload_summary.max_images === 1 &&
    receipt.payload_summary.retry_allowed === false
  );

  check("artifact_record_matches_receipt", () =>
    artifact.schema === "runtime_to_review_v1_secretless_serum_live_probe_artifact_record.v5" &&
    artifact.activation_package_id === receipt.activation_package_id &&
    artifact.receipt_ref === receiptPath &&
    artifact.result === receipt.status &&
    artifact.image_count === receipt.boundary.image_count &&
    artifact.provider_contact_performed === receipt.boundary.provider_contact_performed &&
    artifact.output_write_performed === receipt.boundary.output_write_performed
  );

  check("success_or_failed_closed_artifact_shape", () => {
    if (receipt.status === "completed_live_probe_output_recorded") {
      return artifact.output_directory_created === true &&
        Array.isArray(artifact.artifacts) &&
        artifact.artifacts.length === 1 &&
        artifact.image_count === 1 &&
        receipt.boundary.image_generation_performed === true &&
        receipt.boundary.output_write_performed === true;
    }
    return artifact.output_directory_created === false &&
      Array.isArray(artifact.artifacts) &&
      artifact.artifacts.length === 0 &&
      artifact.image_count === 0 &&
      receipt.boundary.image_generation_performed === false &&
      receipt.boundary.output_write_performed === false;
  });
}

function main() {
  registrationChecks();
  const receiptExists = exists(receiptPath);
  const artifactExists = exists(artifactPath);

  if (receiptExists || artifactExists || !allowPending) {
    check("receipt_and_artifact_files_exist_for_full_validation", () => receiptExists && artifactExists);
    if (receiptExists && artifactExists) {
      receiptChecks();
    }
  } else {
    check("pending_receipt_artifact_not_created_before_live_probe", () => true);
  }

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    mode: allowPending && !receiptExists && !artifactExists ? "registration_pending_receipt_artifact" : "full_receipt_artifact_validation",
    receipt: receiptPath,
    artifact_record: artifactPath,
    activation_package_id: activationPackageId,
    vcptoolbox_required_commit: requiredCommit,
    route_http_path: routePath,
    route_http_request_performed: false,
    provider_contact_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results
  }, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
