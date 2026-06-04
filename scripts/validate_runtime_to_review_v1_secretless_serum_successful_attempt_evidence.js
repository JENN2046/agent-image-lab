#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_secretless_serum_successful_attempt_evidence";
const validatorPath = "scripts/validate_runtime_to_review_v1_secretless_serum_successful_attempt_evidence.js";
const packageScriptName = "validate:runtime-to-review-secretless-serum-successful-attempt-evidence";
const manifestId = "runtime_to_review_secretless_serum_successful_attempt_evidence";

const attempts = [
  {
    attempt: "017",
    activationPackageId: "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-017",
    lockPath: "reports/runtime_to_review_v1/secretless_serum_attempt_017.lock.json",
    activationPath: "reports/runtime_to_review_v1/secretless_serum_exact_activation_issued_20260604_attempt_017.json",
    receiptPath: "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_017.json",
    artifactPath: "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_017.json",
    expectedOutputRefs: [
      "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_017/a504b6e8-e47c-44f4-831b-71fb31a610ff.jpg"
    ],
    expectedRouteOutputRefs: [],
    evidenceMode: "archived_consumed_evidence",
    routeResponseOutputRefsReturned: false,
    artifactSha256: "1a73684dd24bad53c50d36fb5b8183f2fe2a2d2aa2361a428dc5717c1d26bd93"
  },
  {
    attempt: "018",
    activationPackageId: "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-018",
    lockPath: "reports/runtime_to_review_v1/secretless_serum_attempt_018.lock.json",
    activationPath: "reports/runtime_to_review_v1/secretless_serum_exact_activation_issued_20260604_attempt_018.json",
    receiptPath: "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_018.json",
    artifactPath: "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_018.json",
    qualityPath: "reports/runtime_to_review_v1/secretless_serum_attempt_018_quality_channel_review_20260604.json",
    expectedOutputRefs: [
      "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_018/3551a0c1-029b-4631-aa5b-45a900e1718a.jpg"
    ],
    expectedRouteOutputRefs: [
      "image/doubaogen/3551a0c1-029b-4631-aa5b-45a900e1718a.png"
    ],
    evidenceMode: "archived_consumed_evidence",
    routeResponseOutputRefsReturned: true,
    artifactSha256: "950eec0c7afa7c86567c10f2e73b657e872cbee12c2e85d77a9f75c82de49075"
  }
];

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
  return crypto.createHash("sha256").update(fs.readFileSync(repoPath(relativePath))).digest("hex");
}

function sameArray(actual, expected) {
  return Array.isArray(actual) &&
    actual.length === expected.length &&
    expected.every((value, index) => actual[index] === value);
}

function falseSecretAndRemoteBoundary(boundary) {
  return boundary &&
    boundary.secret_value_read_performed === false &&
    boundary.env_file_content_read_performed === false &&
    boundary.config_env_read_performed === false &&
    boundary.authorization_header_constructed_by_agent_image_lab === false &&
    boundary.old_admin_auth_route_used === false &&
    boundary.retry_performed === false &&
    boundary.push_tag_release_deploy_performed === false;
}

function validateAttempt(config) {
  const lock = readJson(config.lockPath);
  const activation = readJson(config.activationPath);
  const receipt = readJson(config.receiptPath);
  const artifact = readJson(config.artifactPath);
  const lockOutputRefs = lock.authorization_boundary.output_refs ||
    lock.authorization_boundary.consumed_output_refs ||
    [];
  const prefix = `attempt_${config.attempt}`;

  check(`${prefix}_ids_and_refs_match`, () =>
    lock.attempt === config.attempt &&
    lock.activation_id === config.activationPackageId &&
    activation.attempt === config.attempt &&
    activation.activation_package_id === config.activationPackageId &&
    activation.lock_ref === config.lockPath &&
    receipt.activation_package_id === config.activationPackageId &&
    artifact.activation_package_id === config.activationPackageId &&
    lock.receipt_ref === config.receiptPath &&
    lock.artifact_record_ref === config.artifactPath &&
    activation.planned_outputs.receipt_ref === config.receiptPath &&
    activation.planned_outputs.artifact_record_ref === config.artifactPath &&
    artifact.receipt_ref === config.receiptPath
  );

  check(`${prefix}_required_ail_commit_is_archived_reference`, () =>
    /^[0-9a-f]{40}$/.test(lock.agent_image_lab_commit_required) &&
    lock.agent_image_lab_commit_required === activation.agent_image_lab_commit_required &&
    config.evidenceMode === "archived_consumed_evidence"
  );

  check(`${prefix}_consumed_success_no_retry_shape`, () =>
    lock.status === "exact_activation_consumed_succeeded_no_retry" &&
    lock.authorization_boundary.can_execute_now === false &&
    lock.authorization_boundary.route_http_allowed_by_this_lock === false &&
    lock.authorization_boundary.separate_exact_activation_required === true &&
    lock.authorization_boundary.activation_consumed === true &&
    lock.authorization_boundary.route_http_requests_used === 1 &&
    lock.authorization_boundary.retry_allowed_after_consumption === false &&
    activation.consumption.activation_consumed === true &&
    activation.consumption.route_http_request_performed === true &&
    activation.consumption.route_http_requests_used === 1 &&
    activation.consumption.result === "succeeded" &&
    activation.consumption.retry_allowed_after_consumption === false &&
    receipt.activation_attempt_consumed === true &&
    receipt.route_http_request_performed === true &&
    receipt.calls_used.route_http_request === 1
  );

  check(`${prefix}_successful_generation_and_output_write_recorded`, () =>
    receipt.status === "succeeded" &&
    receipt.result === "succeeded" &&
    receipt.provider_contact_performed === true &&
    receipt.plugin_call_performed === true &&
    receipt.api_call_performed === true &&
    receipt.image_generation_performed === true &&
    receipt.image_count === 1 &&
    receipt.output_write_performed === true &&
    sameArray(receipt.output_refs, config.expectedOutputRefs) &&
    artifact.result === "succeeded" &&
    artifact.artifact_created === true &&
    artifact.output_write_performed === true &&
    sameArray(artifact.output_refs, config.expectedOutputRefs) &&
    activation.consumption.output_write_performed === true &&
    sameArray(activation.consumption.output_refs, config.expectedOutputRefs) &&
    sameArray(lockOutputRefs, config.expectedOutputRefs)
  );

  check(`${prefix}_route_response_output_ref_claim_is_accurate`, () => {
    const receiptOutputRefs = receipt.route_response_summary?.outputRefs || [];
    const artifactOutputRefs = artifact.route_response_summary?.outputRefs || [];
    if (config.routeResponseOutputRefsReturned) {
      return sameArray(receiptOutputRefs, config.expectedRouteOutputRefs) &&
        sameArray(artifactOutputRefs, config.expectedRouteOutputRefs) &&
        receipt.post_run_evidence_copy.route_response_output_refs_returned === true &&
        artifact.post_run_evidence_copy.route_response_output_refs_returned === true;
    }
    return receiptOutputRefs.length === 0 &&
      artifactOutputRefs.length === 0 &&
      receipt.post_run_evidence_copy.route_response_output_refs_returned === false &&
      artifact.post_run_evidence_copy.route_response_output_refs_returned === false &&
      activation.consumption.route_response_output_refs_returned === false;
  });

  check(`${prefix}_artifact_sha_and_copy_match`, () => {
    const copyRef = artifact.post_run_evidence_copy.copy_ref;
    return artifact.artifact_evidence.sha256 === config.artifactSha256 &&
      receipt.route_response_summary.artifact.sha256 === config.artifactSha256 &&
      artifact.route_response_summary.artifact.sha256 === config.artifactSha256 &&
      artifact.post_run_evidence_copy.sha256 === config.artifactSha256 &&
      receipt.post_run_evidence_copy.sha256 === config.artifactSha256 &&
      fs.existsSync(repoPath(copyRef)) &&
      sha256File(copyRef) === config.artifactSha256;
  });

  check(`${prefix}_jpeg_archive_refs_use_jpg_extension`, () =>
    artifact.artifact_evidence.mime === "image/jpeg" &&
    receipt.output_refs.every((outputRef) => outputRef.endsWith(".jpg")) &&
    artifact.output_refs.every((outputRef) => outputRef.endsWith(".jpg")) &&
    activation.consumption.output_refs.every((outputRef) => outputRef.endsWith(".jpg")) &&
    lockOutputRefs.every((outputRef) => outputRef.endsWith(".jpg")) &&
    artifact.post_run_evidence_copy.copy_ref.endsWith(".jpg")
  );

  if (config.qualityPath) {
    const quality = readJson(config.qualityPath);
    check(`${prefix}_quality_review_refs_use_jpg_archive_and_raw_route_ref`, () =>
      quality.source_output_ref === config.expectedOutputRefs[0] &&
      quality.source_route_output_ref === config.expectedRouteOutputRefs[0] &&
      quality.source_artifact_evidence.sha256 === config.artifactSha256 &&
      quality.source_artifact_evidence.mime === "image/jpeg" &&
      Array.isArray(quality.visual_review?.watch_items) &&
      quality.visual_review.watch_items.some((item) => item.includes("archived AIL evidence copy now uses .jpg")) &&
      quality.visual_review.watch_items.every((item) => !item.includes("file extension remains .png while artifact mime is image/jpeg"))
    );
  }

  check(`${prefix}_boundaries_stay_secretless_and_no_retry`, () =>
    falseSecretAndRemoteBoundary(receipt.boundary) &&
    falseSecretAndRemoteBoundary(artifact.boundary) &&
    activation.forbidden.secret_value_read_allowed === false &&
    activation.forbidden.authorization_header_constructed_by_agent_image_lab === false &&
    activation.forbidden.overwrite_existing_files_allowed === false &&
    activation.forbidden.push_tag_release_deploy_allowed === false &&
    activation.forbidden.retry_allowed === false &&
    lock.authorization_boundary.secret_value_read_allowed === false &&
    lock.authorization_boundary.authorization_header_constructed_by_agent_image_lab === false &&
    lock.authorization_boundary.overwrite_existing_files_allowed === false &&
    lock.authorization_boundary.push_tag_release_deploy_performed === false
  );
}

for (const attempt of attempts) validateAttempt(attempt);

const packageJson = readJson("package.json");
const manifest = readJson("scripts/validation_manifest.json");

check("package_script_registered", () =>
  packageJson.scripts?.[packageScriptName] === `node ${validatorPath}`
);

check("manifest_entry_registered_for_successful_attempt_evidence", () => {
  const entry = manifest.validators.find((item) => item.id === manifestId);
  const expectedTriggers = attempts.flatMap((attempt) => [
    attempt.lockPath,
    attempt.activationPath,
    attempt.receiptPath,
    attempt.artifactPath,
    attempt.qualityPath
  ]).filter(Boolean);
  return entry &&
    entry.command === `npm run ${packageScriptName}` &&
    entry.script === validatorPath &&
    entry.tier === "targeted" &&
    entry.domain === "runtime_to_review" &&
    entry.status === "active" &&
    expectedTriggers.every((triggerPath) => entry.trigger_paths.includes(triggerPath)) &&
    entry.trigger_paths.includes("runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_017/**") &&
    entry.trigger_paths.includes("runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_018/**") &&
    entry.required_for.includes(manifestId);
});

process.stdout.write(`${JSON.stringify({
  passed,
  validator,
  attempts: attempts.map((attempt) => attempt.attempt),
  evidence_mode: "archived_consumed_evidence",
  commit_reachability_required: false,
  route_http_request_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  output_write_performed: false,
  secret_value_read_performed: false,
  file_write_performed: false,
  checks
}, null, 2)}\n`);

if (!passed) process.exitCode = 1;
