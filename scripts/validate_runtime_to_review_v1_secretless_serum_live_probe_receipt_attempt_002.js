#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_secretless_serum_live_probe_receipt_attempt_002";
const receiptPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_002.json";
const artifactPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_002.json";
const activationPreflightPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_activation_preflight_20260603_attempt_002.json";
const bindingPacketPath = "reports/runtime_to_review_v1/secretless_option_a_exact_binding_packet_draft_20260603_attempt_002.json";
const runnerPath = "scripts/run_runtime_to_review_v1_secretless_option_a_callable_runner.js";
const validatorPath = "scripts/validate_runtime_to_review_v1_secretless_serum_live_probe_receipt_attempt_002.js";
const packageScriptName = "validate:runtime-to-review-secretless-serum-live-probe-receipt-attempt-002";
const manifestId = "runtime_to_review_secretless_serum_live_probe_receipt_attempt_002";
const activationPackageId = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-002";
const activationPhrase = "RUNTIME_TO_REVIEW_V1_SECRETLESS_SERUM_BOTTLE_ONE_PROVIDER_ONE_IMAGE";
const pushedCommit = "bcb8219a0990f9828df6789d62ed35e14293461d";

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

function allTrue(object, fields) {
  return Boolean(object) && fields.every((field) => object[field] === true);
}

function main() {
  const receipt = readJson(receiptPath);
  const artifact = readJson(artifactPath);
  const activationPreflight = readJson(activationPreflightPath);
  const bindingPacket = readJson(bindingPacketPath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const runner = require(repoPath(runnerPath));
  const validatorSource = fs.readFileSync(repoPath(validatorPath), "utf8");

  check("receipt_and_artifact_identity", () =>
    receipt.schema === "runtime_to_review_v1_secretless_serum_live_probe_receipt.v1" &&
    receipt.receipt_id === "secretless_serum_live_probe_receipt_20260603_attempt_002" &&
    receipt.activation_package_id === activationPackageId &&
    receipt.activation_phrase_received === activationPhrase &&
    receipt.binding_packet_ref === bindingPacketPath &&
    receipt.artifact_record_ref === artifactPath &&
    artifact.receipt_ref === receiptPath &&
    artifact.activation_package_id === activationPackageId
  );

  check("preflight_and_binding_match_attempt_002", () =>
    activationPreflight.activation_package_id === activationPackageId &&
    activationPreflight.future_execution_scope_if_later_separately_activated.binding_packet_ref === bindingPacketPath &&
    bindingPacket.exact_binding_packet_draft.activation_package_id_required === activationPackageId &&
    bindingPacket.exact_binding_packet_draft.vcptoolbox_required_commit === pushedCommit
  );

  check("vcptoolbox_baseline_verified_bcb8219a", () =>
    receipt.vcptoolbox_baseline_verification.branch === "main" &&
    receipt.vcptoolbox_baseline_verification.status === "## main...origin/main" &&
    receipt.vcptoolbox_baseline_verification.head === pushedCommit &&
    receipt.vcptoolbox_baseline_verification.origin_main === pushedCommit &&
    receipt.vcptoolbox_baseline_verification.vcptoolbox_commit_verified === true &&
    receipt.vcptoolbox_baseline_verification.external_repo_modified === false
  );

  check("attempt_consumed_failed_closed_before_route_http", () =>
    receipt.status === "failed_closed_before_route_http_request" &&
    receipt.result === "failed_closed" &&
    receipt.activation_attempt_consumed === true &&
    receipt.live_route_attempt_performed === false &&
    receipt.agent_image_lab_execution_entry.runner_status === "secretless_option_a_callable_runner_failed_closed_route_http_not_authorized" &&
    receipt.agent_image_lab_execution_entry.route_http_shape_guessed === false &&
    artifact.status === "failed_no_artifact_created" &&
    artifact.result === "failed_closed_before_route_http_request"
  );

  check("non_secret_payload_matches_runner_allowlist", () =>
    includesAll(receipt.non_secret_payload_fields, runner.allowedNonSecretPayloadFields) &&
    receipt.non_secret_payload_fields.length === runner.allowedNonSecretPayloadFields.length &&
    receipt.non_secret_payload.max_provider_calls === 1 &&
    receipt.non_secret_payload.max_plugin_calls === 1 &&
    receipt.non_secret_payload.max_api_calls === 1 &&
    receipt.non_secret_payload.max_images === 1 &&
    receipt.non_secret_payload.retry_allowed === false &&
    receipt.forbidden_payload_keys_detected.length === 0
  );

  check("side_effect_boundaries_false", () =>
    receipt.provider_contact_performed === false &&
    receipt.plugin_call_performed === false &&
    receipt.api_call_performed === false &&
    receipt.image_generation_performed === false &&
    receipt.output_write_performed === false &&
    receipt.secret_value_read_performed === false &&
    receipt.env_file_content_read_performed === false &&
    receipt.config_env_read_performed === false &&
    receipt.authorization_header_constructed_by_agent_image_lab === false &&
    receipt.route_http_request_performed === false &&
    receipt.old_admin_auth_route_used === false &&
    receipt.retry_performed === false &&
    allTrue(receipt.boundary, [
      "no_env_or_config_read",
      "no_secret_value_read",
      "no_authorization_header_constructed_by_agent_image_lab",
      "no_live_route_http_request",
      "no_provider_plugin_api_image",
      "no_output_write",
      "no_retry",
      "no_stage_commit_push_tag_release_deploy",
      "no_vcptoolbox_file_modification"
    ]) &&
    artifact.artifact_created === false &&
    artifact.output_write_performed === false &&
    artifact.route_http_request_performed === false &&
    artifact.provider_contact_performed === false &&
    artifact.image_generation_performed === false
  );

  check("planned_paths_only_no_output_directory_created", () =>
    artifact.output_directory_overwrite_check.performed === true &&
    artifact.output_directory_overwrite_check.path_existed_before_attempt === false &&
    artifact.output_directory_overwrite_check.overwrite_required === false &&
    artifact.output_refs.length === 0 &&
    !fs.existsSync(repoPath(receipt.target_scope.output_directory_ref))
  );

  check("validator_source_does_not_access_env_or_http", () =>
    !validatorSource.includes("process" + "." + "env") &&
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
        activationPreflightPath,
        bindingPacketPath,
        runnerPath,
        "package.json",
        "scripts/validation_manifest.json"
      ]) &&
      entry.required_for.includes(manifestId);
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    receipt: receiptPath,
    artifact: artifactPath,
    activation_package_id: receipt.activation_package_id,
    status: receipt.status,
    result: receipt.result,
    activation_attempt_consumed: receipt.activation_attempt_consumed,
    route_http_request_performed: receipt.route_http_request_performed,
    provider_contact_performed: receipt.provider_contact_performed,
    plugin_call_performed: receipt.plugin_call_performed,
    api_call_performed: receipt.api_call_performed,
    image_generation_performed: receipt.image_generation_performed,
    output_write_performed: receipt.output_write_performed,
    secret_value_read_performed: receipt.secret_value_read_performed,
    next_safe_action: receipt.next_safe_action,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results
  }, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
