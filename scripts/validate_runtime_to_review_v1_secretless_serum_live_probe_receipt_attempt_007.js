#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_secretless_serum_live_probe_receipt_attempt_007";
const activationPackageId = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-007";
const requiredCommit = "0d10ff306b20abd1aac00389711f0a67d01ece58";
const routePath = "/internal/ai-image-agents/execute/serum-bottle-secretless";
const bindingPacketPath = "reports/runtime_to_review_v1/secretless_option_a_exact_binding_packet_draft_20260603_attempt_007.json";
const activationPreflightPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_activation_preflight_20260603_attempt_007.json";
const receiptPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_007.json";
const artifactPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_007.json";
const runnerPath = "scripts/run_runtime_to_review_v1_secretless_option_a_callable_runner.js";
const packageScriptName = "validate:runtime-to-review-secretless-serum-live-probe-receipt-attempt-007";
const manifestId = "runtime_to_review_secretless_serum_live_probe_receipt_attempt_007";
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

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
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
  const binding = readJson(bindingPacketPath);
  const preflight = readJson(activationPreflightPath);
  const runner = require(repoPath(runnerPath));
  const runnerSource = fs.readFileSync(repoPath(runnerPath), "utf8");

  check("runner_exports_attempt_007_activation_and_defaults", () =>
    runner.exactRouteHttpActivationPackageIdAttempt007 === activationPackageId &&
    runner.exactRouteHttpPathAttempt005 === routePath &&
    runner.defaultRouteHttpInputAttempt007.activationPackageId === activationPackageId &&
    runner.defaultRouteHttpInputAttempt007.routeHttpPath === routePath &&
    runner.defaultRouteHttpInputAttempt007.routeHttpEndpointSource.includes(requiredCommit) &&
    runner.defaultRouteHttpInputAttempt007.receiptRef === receiptPath &&
    runner.defaultRouteHttpInputAttempt007.artifactRecordRef === artifactPath &&
    runner.defaultRouteHttpInputAttempt007.outputDirectoryRef === "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_007/" &&
    runner.allowedExactRouteHttpActivationPackageIds.includes(activationPackageId)
  );

  check("runner_attempt_007_transport_preflight_validates", () => {
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
      result.body.pipeline_id === "secretless-serum-live-probe-attempt-007" &&
      result.body.plan.steps[0].plugin === "DoubaoGen" &&
      result.body.plan.steps[0].type === "generate_image" &&
      result.body.plan.steps[0].output_directory_ref === "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_007/" &&
      result.body.max_provider_calls === 1 &&
      result.body.max_plugin_calls === 1 &&
      result.body.max_api_calls === 1 &&
      result.body.max_images === 1 &&
      result.body.retry_allowed === false &&
      result.route_http_request_performed === false;
  });

  check("binding_packet_attempt_007_scope", () =>
    binding.packet_id === "BINDING-DRAFT-SECRETLESS-OPTION-A-SERUM-20260603-007" &&
    binding.status === "draft_not_active_non_executable" &&
    binding.exact_binding_packet_draft.activation_package_id_required === activationPackageId &&
    binding.exact_binding_packet_draft.vcptoolbox_required_commit === requiredCommit &&
    binding.exact_binding_packet_draft.route_http_path === routePath &&
    binding.exact_binding_packet_draft.vcptoolbox_required_controls.delegate_id === "serum_bottle_secretless_doubao_v1" &&
    binding.exact_binding_packet_draft.vcptoolbox_required_controls.plugin_id === "DoubaoGen" &&
    binding.exact_binding_packet_draft.vcptoolbox_required_controls.api_id === "generate_image" &&
    binding.exact_binding_packet_draft.vcptoolbox_required_controls.internal_command === "generate" &&
    binding.planned_attempt_007_outputs.receipt_ref === receiptPath &&
    binding.planned_attempt_007_outputs.artifact_record_ref === artifactPath
  );

  check("activation_preflight_attempt_007_scope", () =>
    preflight.activation_package_id === activationPackageId &&
    preflight.status === "prepared_inactive_not_executed" &&
    preflight.authorization_state.can_execute_now === false &&
    preflight.future_execution_scope_if_later_separately_activated.binding_packet_ref === bindingPacketPath &&
    preflight.future_execution_scope_if_later_separately_activated.vcptoolbox_required_commit === requiredCommit &&
    preflight.future_execution_scope_if_later_separately_activated.path === routePath &&
    preflight.planned_receipt_ref_if_activated_later === receiptPath &&
    preflight.planned_artifact_record_ref_if_activated_later === artifactPath
  );

  check("package_script_registered", () =>
    packageJson.scripts &&
    packageJson.scripts[packageScriptName] === `node scripts/validate_runtime_to_review_v1_secretless_serum_live_probe_receipt_attempt_007.js`
  );

  check("manifest_entry_registered_for_attempt_007", () => {
    const entry = manifest.validators.find((item) => item.id === manifestId);
    return entry &&
      entry.command === `npm run ${packageScriptName} -- --allow-pending` &&
      entry.script === "scripts/validate_runtime_to_review_v1_secretless_serum_live_probe_receipt_attempt_007.js" &&
      entry.tier === "targeted" &&
      entry.domain === "runtime_to_review" &&
      entry.status === "active" &&
      includesAll(entry.trigger_paths, [
        bindingPacketPath,
        activationPreflightPath,
        receiptPath,
        artifactPath,
        runnerPath,
        "package.json",
        "scripts/validation_manifest.json"
      ]) &&
      entry.required_for.includes(manifestId);
  });

  check("runner_source_remains_secretless", () =>
    !runnerSource.includes("process" + "." + "env") &&
    !runnerSource.includes("dot" + "env") &&
    !runnerSource.includes(".env") &&
    !runnerSource.includes("Authorization:")
  );
}

function receiptChecks() {
  const receipt = readJson(receiptPath);
  const artifact = readJson(artifactPath);
  check("receipt_attempt_007_scope", () =>
    receipt.activation_package_id === activationPackageId &&
    receipt.vcptoolbox_required_commit === requiredCommit &&
    receipt.route_http_transport.origin === "http://127.0.0.1:6005" &&
    receipt.route_http_transport.method === "POST" &&
    receipt.route_http_transport.path === routePath &&
    receipt.payload_summary.task_id === activationPackageId &&
    receipt.payload_summary.route_id === "serum_bottle_vcptoolbox_route_owner_runtime" &&
    receipt.payload_summary.max_provider_calls === 1 &&
    receipt.payload_summary.max_plugin_calls === 1 &&
    receipt.payload_summary.max_api_calls === 1 &&
    receipt.payload_summary.max_images === 1 &&
    receipt.payload_summary.retry_allowed === false &&
    receipt.boundary.authorization_header_constructed_by_agent_image_lab === false
  );

  check("artifact_attempt_007_scope", () =>
    artifact.activation_package_id === activationPackageId &&
    artifact.receipt_ref === receiptPath &&
    artifact.output_directory_ref === "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_007/"
  );
}

registrationChecks();
const receiptExists = exists(receiptPath);
const artifactExists = exists(artifactPath);
if (receiptExists || artifactExists || !allowPending) {
  check("receipt_and_artifact_files_exist_for_full_validation", () => receiptExists && artifactExists);
  if (receiptExists && artifactExists) receiptChecks();
} else {
  check("pending_receipt_artifact_not_created_before_live_probe", () => true);
}

process.stdout.write(`${JSON.stringify({
  passed,
  validator,
  mode: allowPending && !receiptExists && !artifactExists ? "registration_pending_receipt_artifact" : "full_receipt_artifact_validation",
  activation_package_id: activationPackageId,
  vcptoolbox_required_commit: requiredCommit,
  receipt: receiptPath,
  artifact_record: artifactPath,
  route_http_request_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  checks: results
}, null, 2)}\n`);

if (!passed) process.exitCode = 1;
