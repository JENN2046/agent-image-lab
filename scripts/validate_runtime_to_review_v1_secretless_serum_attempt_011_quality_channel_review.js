#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_secretless_serum_attempt_011_quality_channel_review";
const reviewPath = "reports/runtime_to_review_v1/secretless_serum_attempt_011_quality_channel_review_20260603.json";
const attempt012PackagePath = "reports/runtime_to_review_v1/secretless_serum_attempt_012_prompt_quality_package_20260603.json";
const receiptPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_011.json";
const artifactPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_011.json";
const outputRef = "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_011/8380a822-d81a-47ea-88d3-acf6898a920a.png";
const packageScriptName = "validate:runtime-to-review-secretless-serum-attempt-011-quality-channel-review";
const manifestId = "runtime_to_review_secretless_serum_attempt_011_quality_channel_review";

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

const review = readJson(reviewPath);
const attempt012Package = readJson(attempt012PackagePath);
const receipt = readJson(receiptPath);
const artifact = readJson(artifactPath);
const packageJson = readJson("package.json");
const manifest = readJson("scripts/validation_manifest.json");

check("review_refs_attempt_011_evidence", () =>
  review.schema === "runtime_to_review_v1_secretless_serum_quality_channel_review.v1" &&
  review.source_activation_package_id === "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-011" &&
  review.source_receipt_ref === receiptPath &&
  review.source_artifact_record_ref === artifactPath &&
  review.source_output_ref === outputRef &&
  review.source_artifact_evidence.sha256 === receipt.artifact_evidence.sha256 &&
  review.source_artifact_evidence.mime === receipt.artifact_evidence.mime &&
  review.source_artifact_evidence.dimensions.width === receipt.artifact_evidence.dimensions.width &&
  artifact.artifact_evidence.sha256 === receipt.artifact_evidence.sha256
);

check("execution_counts_and_boundaries_match_receipt", () =>
  review.execution_evidence_summary.route_http_request_performed === true &&
  review.execution_evidence_summary.provider_contact_performed === true &&
  review.execution_evidence_summary.plugin_call_performed === true &&
  review.execution_evidence_summary.api_call_performed === true &&
  review.execution_evidence_summary.image_generation_performed === true &&
  review.execution_evidence_summary.calls_used.route_http_request === 1 &&
  review.execution_evidence_summary.calls_used.provider === 1 &&
  review.execution_evidence_summary.calls_used.plugin === 1 &&
  review.execution_evidence_summary.calls_used.api === 1 &&
  review.execution_evidence_summary.calls_used.image === 1 &&
  review.execution_evidence_summary.retry_performed === false &&
  review.execution_evidence_summary.secret_value_read_performed === false &&
  review.execution_evidence_summary.env_file_content_read_performed === false &&
  review.execution_evidence_summary.config_env_read_performed === false &&
  review.execution_evidence_summary.authorization_header_constructed_by_agent_image_lab === false &&
  review.execution_evidence_summary.old_admin_auth_route_used === false &&
  receipt.calls_used.provider === 1 &&
  receipt.boundary.retry_performed === false
);

check("visual_review_decision_is_patch_not_production_candidate", () =>
  review.visual_review.overall_outcome === "patch" &&
  review.visual_review.score >= 70 &&
  review.visual_review.score < 85 &&
  review.visual_review.dimension_scores.subject_integrity === 5 &&
  review.visual_review.dimension_scores.composition === 3 &&
  review.visual_review.dimension_scores.production_readiness === 3 &&
  review.decision.image_asset_production_candidate_decision === "no_patch_first" &&
  review.boundary_checks.production_candidate_write_performed === false
);

check("channel_upgrade_is_controlled_only", () =>
  review.channel_review.channel_outcome === "upgrade_to_controlled_production_candidate_channel" &&
  review.channel_review.channel_score >= 90 &&
  review.channel_review.upgrade_allowed_by_this_review === true &&
  review.channel_review.not_upgraded_to.includes("unbounded production runtime") &&
  review.channel_review.required_controls_for_future_use.includes("new exact activation per attempt") &&
  review.decision.channel_upgrade_decision === "yes_controlled_production_candidate_channel"
);

check("attempt_012_package_is_inactive_and_secretless", () =>
  attempt012Package.schema === "runtime_to_review_v1_secretless_serum_attempt_012_prompt_quality_package.v1" &&
  attempt012Package.status === "inactive_prompt_quality_package_not_executable" &&
  attempt012Package.execution_authorized_by_this_package === false &&
  attempt012Package.activation_package_id_future === "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-012" &&
  attempt012Package.binding_packet_id_future === "BINDING-DRAFT-SECRETLESS-OPTION-A-SERUM-20260603-012" &&
  attempt012Package.source_review_ref === reviewPath &&
  attempt012Package.budget.max_provider_calls === 1 &&
  attempt012Package.budget.max_plugin_calls === 1 &&
  attempt012Package.budget.max_api_calls === 1 &&
  attempt012Package.budget.max_images === 1 &&
  attempt012Package.budget.retry_allowed === false &&
  attempt012Package.boundary_checks.route_http_request_performed_by_this_package === false &&
  attempt012Package.boundary_checks.secret_value_read_performed === false &&
  attempt012Package.decision.ready_for_live_execution_now === false
);

check("attempt_012_prompt_targets_attempt_011_gaps", () =>
  attempt012Package.proposed_prompt.prompt.includes("blank satin cream label panel") &&
  attempt012Package.proposed_prompt.prompt.includes("product fills most of a square frame") &&
  attempt012Package.proposed_prompt.negative_prompt.includes("no readable text") &&
  attempt012Package.quality_targets.composition.includes("less unused top whitespace") &&
  attempt012Package.required_future_baselines.vcptoolbox_attempt_012_exact_binding_refresh_required === false &&
  attempt012Package.required_future_baselines.vcptoolbox_attempt_012_exact_binding_refresh_commit === "24b9f887b77c1db48da2d23d6ef9fb9cd080ea83" &&
  attempt012Package.required_future_baselines.agent_image_lab_attempt_012_runner_refresh_required === false &&
  attempt012Package.pre_execution_requirements.includes("receive separate exact activation before any POST")
);

check("package_script_registered", () =>
  packageJson.scripts &&
  packageJson.scripts[packageScriptName] === `node scripts/validate_runtime_to_review_v1_secretless_serum_attempt_011_quality_channel_review.js`
);

check("manifest_entry_registered", () => {
  const entry = manifest.validators.find((item) => item.id === manifestId);
  return entry &&
    entry.command === `npm run ${packageScriptName}` &&
    entry.script === "scripts/validate_runtime_to_review_v1_secretless_serum_attempt_011_quality_channel_review.js" &&
    entry.tier === "targeted" &&
    entry.domain === "runtime_to_review" &&
    entry.status === "active" &&
    includesAll(entry.trigger_paths, [
      reviewPath,
      attempt012PackagePath,
      receiptPath,
      artifactPath,
      outputRef,
      "package.json",
      "scripts/validation_manifest.json"
    ]) &&
    entry.required_for.includes(manifestId);
});

process.stdout.write(`${JSON.stringify({
  passed,
  validator,
  review: reviewPath,
  attempt_012_package: attempt012PackagePath,
  route_http_request_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  secret_value_read_performed: false,
  file_write_performed_by_validator: false,
  checks: results
}, null, 2)}\n`);

if (!passed) process.exitCode = 1;
