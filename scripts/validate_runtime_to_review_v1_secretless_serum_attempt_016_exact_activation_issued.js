#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { verifyAttemptLockBinding, sha256Text } = require("./verify_runtime_to_review_v1_secretless_serum_attempt_lock_binding");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_secretless_serum_attempt_016_exact_activation_issued";
const lockPath = "reports/runtime_to_review_v1/secretless_serum_attempt_016.lock.json";
const activationIssuedPath = "reports/runtime_to_review_v1/secretless_serum_exact_activation_issued_20260604_attempt_016.json";
const validatorPath = "scripts/validate_runtime_to_review_v1_secretless_serum_attempt_016_exact_activation_issued.js";
const packageScriptName = "validate:runtime-to-review-secretless-serum-attempt-016-exact-activation-issued";
const manifestId = "runtime_to_review_secretless_serum_attempt_016_exact_activation_issued";

let passed = true;
const checks = [];

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
    checks.push({ check: id, passed: Boolean(ok) });
    if (!ok) passed = false;
  } catch (error) {
    checks.push({ check: id, passed: false, error: error.message });
    passed = false;
  }
}

function sha256File(relativePath) {
  const content = fs.readFileSync(repoPath(relativePath));
  return require("node:crypto").createHash("sha256").update(content).digest("hex");
}

function gitHead(cwd) {
  const result = spawnSync("git", ["rev-parse", "HEAD"], { cwd, encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : null;
}

function pathPending(relativePath) {
  return !fs.existsSync(repoPath(relativePath));
}

const lock = readJson(lockPath);
const activation = readJson(activationIssuedPath);
const packageJson = readJson("package.json");
const manifest = readJson("scripts/validation_manifest.json");
const verifier = verifyAttemptLockBinding({ lockPath });
const ailHead = gitHead(root);
const consumed = lock.authorization_boundary?.activation_consumed === true;
const receiptExists = fs.existsSync(repoPath(lock.receipt_ref));
const artifactExists = fs.existsSync(repoPath(lock.artifact_record_ref));
const receipt = receiptExists ? readJson(lock.receipt_ref) : null;
const artifact = artifactExists ? readJson(lock.artifact_record_ref) : null;

check("lock_is_attempt_016_active_or_consumed_one_shot", () => {
  const activeOneShot =
    lock.status === "exact_activation_issued_one_shot_active" &&
    lock.authorization_boundary.can_execute_now === true &&
    lock.authorization_boundary.route_http_allowed_by_this_lock === true &&
    lock.authorization_boundary.separate_exact_activation_required === false &&
    lock.authorization_boundary.activation_consumed === false &&
    lock.authorization_boundary.route_http_requests_used === 0;
  const consumedOneShot =
    lock.status === "exact_activation_consumed_failed_closed_before_provider_call" &&
    lock.authorization_boundary.can_execute_now === false &&
    lock.authorization_boundary.route_http_allowed_by_this_lock === false &&
    lock.authorization_boundary.separate_exact_activation_required === true &&
    lock.authorization_boundary.activation_consumed === true &&
    lock.authorization_boundary.route_http_requests_used === 1 &&
    lock.authorization_boundary.retry_allowed_after_consumption === false;
  return lock.attempt === "016" &&
    lock.activation_id === activation.activation_package_id &&
    lock.authorization_boundary.max_route_http_requests === 1 &&
    (activeOneShot || consumedOneShot);
});
check("lock_hash_matches_activation_record", () =>
  consumed
    ? sha256File(lockPath) === activation.lock_sha256_after_consumption
    : sha256File(lockPath) === activation.lock_sha256_after_activation
);
check("lock_prompt_hash_matches", () => lock.prompt_sha256 === sha256Text(lock.prompt || ""));
check("source_binding_verified_current_attempt", () =>
  verifier.passed === true &&
  verifier.status === "attempt_lock_binding_verified" &&
  verifier.vcptoolbox_head === lock.vcptoolbox_current_attempt_binding_commit_required &&
  verifier.vcptoolbox_head === activation.vcptoolbox_current_attempt_binding_commit_required
);
check("ail_head_contains_required_activation_baseline", () =>
  ailHead && lock.agent_image_lab_commit_required === activation.agent_image_lab_commit_required
);
check("binding_packet_and_outputs_match_lock", () =>
  lock.binding_packet.binding_packet_id === activation.binding_packet_id &&
  lock.binding_packet.binding_packet_ref === activation.binding_packet_ref &&
  lock.receipt_ref === activation.planned_outputs.receipt_ref &&
  lock.artifact_record_ref === activation.planned_outputs.artifact_record_ref &&
  lock.output_directory_ref === activation.planned_outputs.output_directory_ref
);
check("route_scope_matches_lock", () =>
  activation.scope.route_http_allowed === true &&
  activation.scope.origin === lock.route.origin &&
  activation.scope.method === lock.route.method &&
  activation.scope.path === lock.route.path &&
  activation.scope.max_provider_calls === lock.budget.max_provider_calls &&
  activation.scope.max_plugin_calls === lock.budget.max_plugin_calls &&
  activation.scope.max_api_calls === lock.budget.max_api_calls &&
  activation.scope.max_images === lock.budget.max_images &&
  activation.scope.retry_allowed === lock.budget.retry_allowed
);
check("pending_outputs_or_consumed_evidence_are_consistent", () => {
  if (!consumed) {
    return pathPending(lock.receipt_ref) &&
      pathPending(lock.artifact_record_ref) &&
      pathPending(lock.output_directory_ref);
  }
  return receipt &&
    artifact &&
    receipt.activation_attempt_consumed === true &&
    receipt.route_http_request_performed === true &&
    receipt.calls_used.route_http_request === 1 &&
    receipt.provider_contact_performed === false &&
    receipt.plugin_call_performed === false &&
    receipt.api_call_performed === false &&
    receipt.image_generation_performed === false &&
    receipt.image_count === 0 &&
    artifact.artifact_created === false &&
    artifact.image_generation_performed === false &&
    activation.consumption.activation_consumed === true &&
    activation.consumption.route_http_requests_used === 1 &&
    activation.consumption.route_result_status === "serum_bottle_secretless_real_execution_flag_disabled" &&
    activation.consumption.retry_allowed_after_consumption === false;
});
check("forbidden_secret_and_remote_boundaries_stay_false", () =>
  activation.forbidden.secret_value_read_allowed === false &&
  activation.forbidden.authorization_header_constructed_by_agent_image_lab === false &&
  activation.forbidden.overwrite_existing_files_allowed === false &&
  activation.forbidden.push_tag_release_deploy_allowed === false &&
  lock.authorization_boundary.secret_value_read_allowed === false &&
  lock.authorization_boundary.authorization_header_constructed_by_agent_image_lab === false &&
  lock.authorization_boundary.overwrite_existing_files_allowed === false &&
  lock.authorization_boundary.push_tag_release_deploy_performed === false
);
check("non_execution_boundary_at_issuance", () =>
  activation.non_execution_boundary_at_issuance.route_http_request_performed === false &&
  activation.non_execution_boundary_at_issuance.provider_contact_performed === false &&
  activation.non_execution_boundary_at_issuance.plugin_call_performed === false &&
  activation.non_execution_boundary_at_issuance.api_call_performed === false &&
  activation.non_execution_boundary_at_issuance.image_generation_performed === false &&
  activation.non_execution_boundary_at_issuance.output_write_performed === false
);
check("package_script_registered", () =>
  packageJson.scripts?.[packageScriptName] === `node ${validatorPath}`
);
check("manifest_entry_registered", () => {
  const entry = manifest.validators.find((item) => item.id === manifestId);
  return entry &&
    entry.command === `npm run ${packageScriptName}` &&
    entry.script === validatorPath &&
    entry.status === "active" &&
    entry.trigger_paths.includes(lockPath) &&
    entry.trigger_paths.includes(activationIssuedPath);
});

process.stdout.write(`${JSON.stringify({
  passed,
  validator,
  lock_ref: lockPath,
  activation_issued_ref: activationIssuedPath,
  agent_image_lab_head: ailHead,
  vcptoolbox_head: verifier.vcptoolbox_head,
  lock_sha256: sha256File(lockPath),
  can_execute_now: lock.authorization_boundary.can_execute_now,
  route_http_allowed_by_this_lock: lock.authorization_boundary.route_http_allowed_by_this_lock,
  activation_consumed: consumed,
  route_http_request_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  checks
}, null, 2)}\n`);

if (!passed) process.exitCode = 1;
