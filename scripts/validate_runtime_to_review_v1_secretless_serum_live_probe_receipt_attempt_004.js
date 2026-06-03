#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_secretless_serum_live_probe_receipt_attempt_004";
const receiptPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_004.json";
const artifactPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_004.json";
const validatorPath = "scripts/validate_runtime_to_review_v1_secretless_serum_live_probe_receipt_attempt_004.js";
const packageScriptName = "validate:runtime-to-review-secretless-serum-live-probe-receipt-attempt-004";
const manifestId = "runtime_to_review_secretless_serum_live_probe_receipt_attempt_004";

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

  check("receipt_schema_and_status", () =>
    receipt.schema === "runtime_to_review_v1_secretless_serum_live_probe_receipt.v4" &&
    receipt.activation_package_id === "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-004" &&
    receipt.status === "failed_closed_route_http_unauthorized" &&
    receipt.result === "FAILED_CLOSED_ROUTE_HTTP_UNAUTHORIZED"
  );

  check("route_and_baseline_exact", () =>
    receipt.vcptoolbox_required_commit === "bcb8219a0990f9828df6789d62ed35e14293461d" &&
    receipt.route_http_transport.origin === "http://127.0.0.1:6005" &&
    receipt.route_http_transport.method === "POST" &&
    receipt.route_http_transport.path === "/admin_api/ai-image-agents/execute/serum-bottle-secretless" &&
    receipt.pre_execution_checks.listener_check.includes("TcpTestSucceeded=True") &&
    receipt.pre_execution_checks.route_surface_non_post_check === "OPTIONS returned 204 NoContent"
  );

  check("boundary_and_budget", () =>
    receipt.boundary.route_http_request_performed === true &&
    receipt.calls_used.route_http_request === 1 &&
    receipt.boundary.provider_contact_performed === false &&
    receipt.boundary.plugin_call_performed === false &&
    receipt.boundary.api_call_performed === false &&
    receipt.boundary.image_generation_performed === false &&
    receipt.boundary.output_write_performed === false &&
    receipt.boundary.secret_value_read_performed === false &&
    receipt.boundary.env_file_content_read_performed === false &&
    receipt.boundary.config_env_read_performed === false &&
    receipt.boundary.authorization_header_constructed_by_agent_image_lab === false &&
    receipt.boundary.retry_performed === false &&
    receipt.payload_summary.max_provider_calls === 1 &&
    receipt.payload_summary.max_plugin_calls === 1 &&
    receipt.payload_summary.max_api_calls === 1 &&
    receipt.payload_summary.max_images === 1 &&
    receipt.payload_summary.retry_allowed === false
  );

  check("artifact_record_matches_failed_no_output", () =>
    artifact.schema === "runtime_to_review_v1_secretless_serum_live_probe_artifact_record.v4" &&
    artifact.activation_package_id === receipt.activation_package_id &&
    artifact.receipt_ref === receiptPath &&
    artifact.result === "failed_closed_route_http_unauthorized" &&
    artifact.output_directory_created === false &&
    Array.isArray(artifact.artifacts) &&
    artifact.artifacts.length === 0 &&
    artifact.image_count === 0 &&
    artifact.provider_contact_performed === false &&
    artifact.output_write_performed === false
  );

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
