#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v2_trial_002_review_decision_accepted_candidate";
const decisionRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_review_decision_accepted_candidate_20260609.json";
const receiptRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_receipt.json";
const artifactRecordRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_artifact_record.json";
const reviewBridgeRef = "review_console/live_receipt_bridge/r2r_v2_trial_002_lantern_ecommerce_hero/bridge_entry.json";
const criteriaRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_review_criteria_no_execute_20260608.json";
const attemptSuccessRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_execution_attempt_003_success_20260609.json";
const outputFile = "runs/real_generation/runtime_to_review_v2_trial_002_lantern_ecommerce_hero/image/doubaogen/3e31d80a-5e43-4504-95bd-cef1decc720d.jpg";
const expectedSha256 = "775b9f584daaa28eebc5e1eb100479d3efd1ce0c30379c6750038e6930952f36";

let passed = true;
const results = [];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repo root: ${relativePath}`);
  }
  return resolved;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function sha256(relativePath) {
  const hash = crypto.createHash("sha256");
  hash.update(fs.readFileSync(repoPath(relativePath)));
  return hash.digest("hex");
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

function main() {
  const decision = readJson(decisionRef);
  const receipt = readJson(receiptRef);
  const artifactRecord = readJson(artifactRecordRef);
  const reviewBridge = readJson(reviewBridgeRef);
  const criteria = readJson(criteriaRef);
  const attemptSuccess = readJson(attemptSuccessRef);

  check("decision_schema_and_identity", () =>
    decision.schema === "runtime_to_review_v2_visual_review_decision.v1" &&
    decision.decision_id === "r2r_v2_trial_002_lantern_ecommerce_hero_review_decision_accepted_candidate_20260609" &&
    decision.trial_id === "r2r_v2_trial_002_lantern_ecommerce_hero" &&
    decision.attempt_number === 3 &&
    decision.reviewer === "Codex visual reviewer" &&
    decision.decision === "accepted_candidate" &&
    decision.commercial_delivery_ready === false
  );
  check("source_refs_exist_and_align", () =>
    fs.existsSync(repoPath(decisionRef)) &&
    fs.existsSync(repoPath(receiptRef)) &&
    fs.existsSync(repoPath(artifactRecordRef)) &&
    fs.existsSync(repoPath(reviewBridgeRef)) &&
    fs.existsSync(repoPath(criteriaRef)) &&
    fs.existsSync(repoPath(attemptSuccessRef)) &&
    decision.artifact_record_ref === artifactRecordRef &&
    decision.receipt_ref === receiptRef &&
    decision.review_bridge_ref === reviewBridgeRef &&
    decision.review_criteria_ref === criteriaRef &&
    receipt.human_review_decision_ref === decisionRef &&
    artifactRecord.review_decision_ref === decisionRef &&
    reviewBridge.human_review_decision.review_decision_ref === decisionRef
  );
  check("image_integrity_matches_success_receipt", () =>
    fs.existsSync(repoPath(outputFile)) &&
    sha256(outputFile) === expectedSha256 &&
    decision.image.path === outputFile &&
    decision.image.sha256 === expectedSha256 &&
    attemptSuccess.output_file.path === outputFile &&
    attemptSuccess.output_file.sha256 === expectedSha256 &&
    receipt.output_files[0].path === outputFile &&
    artifactRecord.output_files[0].path === outputFile &&
    reviewBridge.image.path === outputFile
  );
  check("criteria_minimum_bar_was_reviewed", () => {
    const expectedKeys = Object.keys(criteria.minimum_acceptance_bar);
    return expectedKeys.length > 0 &&
      expectedKeys.every((key) => decision.criteria_result[key]) &&
      decision.criteria_result.single_product_only === "pass" &&
      decision.criteria_result.modern_premium_led_camping_lantern_read === "pass" &&
      decision.criteria_result.no_readable_brand_text_logo_or_watermark === "pass" &&
      decision.criteria_result.no_people_hands_fire_smoke === "pass" &&
      decision.criteria_result.no_extra_lanterns_or_wrong_product_drift === "pass";
  });
  check("scoring_is_accepted_but_not_final_delivery", () => {
    const score = decision.scoring_result;
    const sum =
      score.product_identity_and_geometry.score +
      score.commercial_hero_composition.score +
      score.material_and_light_control.score +
      score.safety_and_brand_cleanliness.score +
      score.pipeline_learning_value.score;
    return Math.abs(sum - score.total_score) < 0.0001 &&
      score.total_score >= 0.85 &&
      decision.accepted_reason_summary.commercial_hero_use === "accepted_scene_hero_not_final_sku_main_image" &&
      decision.commercial_delivery_ready === false &&
      decision.watch_items_for_next_gate.length >= 3;
  });
  check("artifact_receipt_bridge_status_updated_to_accepted_candidate", () =>
    artifactRecord.status === "accepted_candidate" &&
    artifactRecord.review_policy.current_review_status === "accepted_candidate" &&
    artifactRecord.human_review_decision.decision === "accepted_candidate" &&
    artifactRecord.human_review_decision.commercial_delivery_ready === false &&
    receipt.human_review_required === false &&
    receipt.human_review_decision_ref === decisionRef &&
    reviewBridge.current_review_status === "accepted_candidate" &&
    reviewBridge.guard_summary.human_review_required === false &&
    reviewBridge.human_review_decision.decision === "accepted_candidate"
  );
  check("promotion_archive_memory_stay_blocked", () =>
    artifactRecord.review_policy.accepted_samples_write_allowed_now === false &&
    artifactRecord.review_policy.production_candidate_write_allowed_now === false &&
    artifactRecord.review_policy.DailyNote_write_allowed_now === false &&
    artifactRecord.review_policy.VCP_memory_write_allowed_now === false &&
    reviewBridge.guard_summary.accepted_sample_write_allowed_now === false &&
    reviewBridge.guard_summary.production_candidate_allowed_now === false &&
    reviewBridge.guard_summary.memory_write_allowed_now === false &&
    decision.explicit_non_actions.accepted_samples_write_performed === false &&
    decision.explicit_non_actions.production_candidate_write_performed === false &&
    decision.explicit_non_actions.archive_write_performed === false &&
    decision.explicit_non_actions.DailyNote_write_performed === false &&
    decision.explicit_non_actions.VCP_memory_write_performed === false &&
    decision.explicit_non_actions.Codex_memory_write_performed === false &&
    decision.explicit_non_actions.push_tag_release_deploy_performed === false
  );
  check("next_gate_remains_separate", () =>
    decision.next_gate_required === "separate_promotion_archive_or_memory_candidate_gate_only_if_owner_wants_to_advance_this_accepted_candidate" &&
    attemptSuccess.next_allowed_action === "human_review_trial_002_candidate; do not rerun attempt_003; promotion/archive/memory require separate gate after review decision"
  );

  const output = {
    passed,
    validator,
    decision_ref: decisionRef,
    decision: decision.decision,
    total_score: decision.scoring_result.total_score,
    commercial_delivery_ready: decision.commercial_delivery_ready,
    output_file: outputFile,
    sha256: expectedSha256,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
    archive_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results,
  };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
