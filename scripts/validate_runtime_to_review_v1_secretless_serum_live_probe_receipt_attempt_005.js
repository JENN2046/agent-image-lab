#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_secretless_serum_live_probe_receipt_attempt_005";
const receiptPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_005.json";
const artifactPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_005.json";
const validatorPath = "scripts/validate_runtime_to_review_v1_secretless_serum_live_probe_receipt_attempt_005.js";
const packageScriptName = "validate:runtime-to-review-secretless-serum-live-probe-receipt-attempt-005";
const manifestId = "runtime_to_review_secretless_serum_live_probe_receipt_attempt_005";
const activationPackageId = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-005";
const requiredCommit = "f8ba23130f714e1e1d7641f5f89726846aaf8bb2";
const routePath = "/internal/ai-image-agents/execute/serum-bottle-secretless";

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

function main() {
  const receipt = readJson(receiptPath);
  const artifact = readJson(artifactPath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const validatorSource = fs.readFileSync(repoPath(validatorPath), "utf8");

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
    receipt.pre_execution_checks.listener_check.includes("TcpTestSucceeded=True") &&
    receipt.pre_execution_checks.route_surface_non_post_check === "OPTIONS returned 204 NoContent"
  );

  check("binding_and_preflight_checks_recorded", () =>
    receipt.binding_packet_ref === "reports/runtime_to_review_v1/secretless_option_a_exact_binding_packet_draft_20260603_attempt_002.json" &&
    receipt.pre_execution_checks.binding_packet_validation === "passed" &&
    receipt.pre_execution_checks.attempt_005_transport_input_validation === "passed" &&
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

  check("validator_source_does_not_access_env_or_http", () =>
    !validatorSource.includes("process" + "." + "env") &&
    !validatorSource.includes("dot" + "env") &&
    !validatorSource.includes("fet" + "ch(") &&
    !validatorSource.includes("node:" + "http") &&
    !validatorSource.includes("node:" + "https")
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
      includesAll(entry.trigger_paths, [
        receiptPath,
        artifactPath,
        validatorPath,
        "scripts/run_runtime_to_review_v1_secretless_option_a_callable_runner.js",
        "package.json",
        "scripts/validation_manifest.json"
      ]) &&
      entry.required_for.includes(manifestId);
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    receipt: receiptPath,
    artifact_record: artifactPath,
    status: receipt.status,
    route_http_request_performed: true,
    provider_contact_performed: receipt.boundary.provider_contact_performed,
    image_generation_performed: receipt.boundary.image_generation_performed,
    image_count: receipt.boundary.image_count,
    secret_value_read_performed: false,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results
  }, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
