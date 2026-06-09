#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v2_trial_002_execution_attempt_003_success";
const attemptReceiptRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_execution_attempt_003_success_20260609.json";
const receiptRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_receipt.json";
const artifactRecordRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_artifact_record.json";
const reviewBridgeRef = "review_console/live_receipt_bridge/r2r_v2_trial_002_lantern_ecommerce_hero/bridge_entry.json";
const reviewDecisionRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_review_decision_accepted_candidate_20260609.json";
const rearmPacketRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_rearm_packet_attempt_003_20260609.json";
const attempt001ReceiptRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_execution_attempt_001_failed_closed_20260609.json";
const attempt002ReceiptRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_execution_attempt_002_failed_closed_20260609.json";
const outputDir = "runs/real_generation/runtime_to_review_v2_trial_002_lantern_ecommerce_hero/";
const outputFile = "runs/real_generation/runtime_to_review_v2_trial_002_lantern_ecommerce_hero/image/doubaogen/3e31d80a-5e43-4504-95bd-cef1decc720d.jpg";
const expectedSha256 = "775b9f584daaa28eebc5e1eb100479d3efd1ce0c30379c6750038e6930952f36";
const expectedBytes = 213479;

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

function magicNumber(relativePath, byteCount = 12) {
  return fs.readFileSync(repoPath(relativePath)).subarray(0, byteCount).toString("hex");
}

function listImageFiles(relativePath) {
  const dir = repoPath(relativePath);
  if (!fs.existsSync(dir)) return [];
  const files = [];
  function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (/\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
        files.push(path.relative(root, full).replace(/\\/g, "/"));
      }
    }
  }
  walk(dir);
  return files.sort();
}

function parseJpegDimensions(relativePath) {
  const buffer = fs.readFileSync(repoPath(relativePath));
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (
      marker === 0xc0 ||
      marker === 0xc1 ||
      marker === 0xc2 ||
      marker === 0xc3
    ) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + length;
  }
  return null;
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
  const attemptReceipt = readJson(attemptReceiptRef);
  const receipt = readJson(receiptRef);
  const artifactRecord = readJson(artifactRecordRef);
  const reviewBridge = readJson(reviewBridgeRef);
  const reviewDecision = fs.existsSync(repoPath(reviewDecisionRef)) ? readJson(reviewDecisionRef) : null;
  const rearmPacket = readJson(rearmPacketRef);
  const attempt001Receipt = readJson(attempt001ReceiptRef);
  const attempt002Receipt = readJson(attempt002ReceiptRef);
  const imageFiles = listImageFiles(outputDir);
  const dimensions = parseJpegDimensions(outputFile);

  check("success_receipts_and_bridge_exist", () =>
    fs.existsSync(repoPath(attemptReceiptRef)) &&
    fs.existsSync(repoPath(receiptRef)) &&
    fs.existsSync(repoPath(artifactRecordRef)) &&
    fs.existsSync(repoPath(reviewBridgeRef)) &&
    fs.existsSync(repoPath(outputFile))
  );
  check("attempt_receipt_schema_and_identity", () =>
    attemptReceipt.schema === "runtime_to_review_v2_execution_attempt_receipt.v1" &&
    attemptReceipt.receipt_id === "r2r_v2_trial_002_lantern_ecommerce_hero_execution_attempt_003_success_20260609" &&
    attemptReceipt.trial_id === "r2r_v2_trial_002_lantern_ecommerce_hero" &&
    attemptReceipt.attempt_id === "attempt_003" &&
    attemptReceipt.attempt_number === 3 &&
    attemptReceipt.status === "completed_provider_image_created_review_pending" &&
    attemptReceipt.execution_completed === true &&
    attemptReceipt.retry_performed === false &&
    attemptReceipt.source_rearm_packet_ref === rearmPacketRef
  );
  check("predecessors_are_consumed_and_not_reused", () =>
    rearmPacket.attempt_id === "attempt_003" &&
    rearmPacket.can_execute_now === true &&
    rearmPacket.dispatch_performed === false &&
    attempt001Receipt.attempt_id === "attempt_001" &&
    attempt001Receipt.budget_consumption.attempt_consumed === true &&
    attempt002Receipt.attempt_id === "attempt_002" &&
    attempt002Receipt.budget_consumption.attempt_consumed === true &&
    attemptReceipt.dispatch_command_executed_once.attempt_001_reused === false &&
    attemptReceipt.dispatch_command_executed_once.attempt_002_reused === false &&
    attemptReceipt.dispatch_command_executed_once.retry_flags_added === false
  );
  check("pre_dispatch_validation_chain_recorded", () =>
    attemptReceipt.pre_dispatch_validation_passed.includes("node scripts/validate_runtime_to_review_v2_trial_002_rearm_packet_attempt_003.js") &&
    attemptReceipt.pre_dispatch_validation_passed.includes("npm run validate:runtime-to-review-trial-002-binding-ready-execution") &&
    attemptReceipt.pre_dispatch_validation_passed.includes("npm run validate:runtime-to-review-trial-002-attempt-001-failed-closed") &&
    attemptReceipt.pre_dispatch_validation_passed.includes("npm run validate:runtime-to-review-trial-002-attempt-002-failed-closed") &&
    attemptReceipt.pre_dispatch_validation_passed.includes("node scripts/validate_runtime_to_review_v2_trial_002_ail_side_binding_preflight.js") &&
    attemptReceipt.pre_dispatch_validation_passed.includes("git diff --check")
  );
  check("budget_and_calls_are_exactly_one_each", () =>
    attemptReceipt.budget_consumption.route_http_requests_attempted === 1 &&
    attemptReceipt.budget_consumption.provider_calls_used === 1 &&
    attemptReceipt.budget_consumption.plugin_calls_used === 1 &&
    attemptReceipt.budget_consumption.api_calls_used === 1 &&
    attemptReceipt.budget_consumption.images_created === 1 &&
    attemptReceipt.budget_consumption.retry_allowed === false &&
    attemptReceipt.budget_consumption.retry_performed === false &&
    attemptReceipt.budget_consumption.attempt_consumed === true &&
    receipt.calls_used.provider === 1 &&
    receipt.calls_used.plugin === 1 &&
    receipt.calls_used.api === 1 &&
    receipt.image_count === 1
  );
  check("output_file_integrity", () =>
    imageFiles.length === 1 &&
    imageFiles[0] === outputFile &&
    fs.statSync(repoPath(outputFile)).size === expectedBytes &&
    sha256(outputFile) === expectedSha256 &&
    magicNumber(outputFile).startsWith("ffd8ffe000104a4649460001") &&
    dimensions &&
    dimensions.width === 1920 &&
    dimensions.height === 1920
  );
  check("receipt_artifact_bridge_refs_align", () =>
    receipt.artifact_record_ref === artifactRecordRef &&
    receipt.review_bridge_ref === reviewBridgeRef &&
    artifactRecord.receipt_ref === receiptRef &&
    artifactRecord.review_bridge_ref === reviewBridgeRef &&
    reviewBridge.artifact_record_ref === artifactRecordRef &&
    reviewBridge.audit_receipt_ref === receiptRef &&
    attemptReceipt.result.artifact_record_ref === artifactRecordRef &&
    attemptReceipt.result.audit_receipt_ref === receiptRef &&
    attemptReceipt.result.review_bridge_ref === reviewBridgeRef
  );
  check("artifact_record_matches_image_and_prompt", () =>
    artifactRecord.schema === "runtime_to_review_v2_artifact_record.v1" &&
    ["review_pending", "accepted_candidate"].includes(artifactRecord.status) &&
    artifactRecord.source_prompt_package_ref === "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v2.yaml" &&
    artifactRecord.output_files.length === 1 &&
    artifactRecord.output_files[0].path === outputFile &&
    artifactRecord.output_files[0].bytes === expectedBytes &&
    artifactRecord.output_files[0].sha256 === expectedSha256 &&
    artifactRecord.output_files[0].mime_type === "image/jpeg" &&
    artifactRecord.output_files[0].dimensions === "1920x1920" &&
    artifactRecord.image_count === 1
  );
  check("review_bridge_is_metadata_only_review_safe", () =>
    reviewBridge.schema === "runtime_to_review_v2_review_bridge_entry.v1" &&
    ["pending_human_review", "accepted_candidate"].includes(reviewBridge.current_review_status) &&
    reviewBridge.display_only === true &&
    reviewBridge.metadata_only === true &&
    reviewBridge.image_binary_read_performed_by_bridge === false &&
    reviewBridge.image.path === outputFile &&
    reviewBridge.image.sha256 === expectedSha256 &&
    reviewBridge.guard_summary.accepted_sample_write_allowed_now === false &&
    reviewBridge.guard_summary.production_candidate_allowed_now === false &&
    reviewBridge.guard_summary.memory_write_allowed_now === false
  );
  check("side_effect_flags_match_success_boundary", () =>
    attemptReceipt.side_effect_flags.route_http_request_performed === true &&
    attemptReceipt.side_effect_flags.provider_contact_performed === true &&
    attemptReceipt.side_effect_flags.plugin_call_performed === true &&
    attemptReceipt.side_effect_flags.api_call_performed === true &&
    attemptReceipt.side_effect_flags.image_generation_performed === true &&
    attemptReceipt.side_effect_flags.output_write_performed === true &&
    attemptReceipt.side_effect_flags.artifact_store_import_performed === true &&
    attemptReceipt.side_effect_flags.secret_value_read_performed === false &&
    attemptReceipt.side_effect_flags.env_file_content_read_performed === false &&
    attemptReceipt.side_effect_flags.authorization_header_constructed_by_Agent_Image_Lab === false &&
    attemptReceipt.side_effect_flags.accepted_samples_write_performed === false &&
    attemptReceipt.side_effect_flags.production_candidate_write_performed === false &&
    attemptReceipt.side_effect_flags.DailyNote_write_performed === false &&
    attemptReceipt.side_effect_flags.VCP_memory_write_performed === false &&
    attemptReceipt.side_effect_flags.push_tag_release_deploy_performed === false
  );
  check("review_gate_blocks_promotion_memory_after_optional_decision", () =>
    attemptReceipt.review_gate.accepted_samples_write_allowed_now === false &&
    attemptReceipt.review_gate.production_candidate_write_allowed_now === false &&
    attemptReceipt.review_gate.DailyNote_write_allowed_now === false &&
    attemptReceipt.review_gate.VCP_memory_write_allowed_now === false &&
    receipt.human_review_decision_ref === (reviewDecision ? reviewDecisionRef : null) &&
    (!reviewDecision || (
      reviewDecision.decision === "accepted_candidate" &&
      artifactRecord.status === "accepted_candidate" &&
      artifactRecord.review_policy.current_review_status === "accepted_candidate" &&
      artifactRecord.human_review_decision.decision === "accepted_candidate" &&
      reviewBridge.current_review_status === "accepted_candidate" &&
      reviewBridge.human_review_decision.review_decision_ref === reviewDecisionRef &&
      reviewDecision.explicit_non_actions.accepted_samples_write_performed === false &&
      reviewDecision.explicit_non_actions.production_candidate_write_performed === false &&
      reviewDecision.explicit_non_actions.archive_write_performed === false &&
      reviewDecision.explicit_non_actions.DailyNote_write_performed === false &&
      reviewDecision.explicit_non_actions.VCP_memory_write_performed === false
    ))
  );
  check("next_action_blocks_rerun_and_requires_review_gate", () =>
    attemptReceipt.next_allowed_action === "human_review_trial_002_candidate; do not rerun attempt_003; promotion/archive/memory require separate gate after review decision"
  );

  const output = {
    passed,
    validator,
    attempt_receipt_ref: attemptReceiptRef,
    receipt_ref: receiptRef,
    artifact_record_ref: artifactRecordRef,
    review_bridge_ref: reviewBridgeRef,
    output_file: outputFile,
    sha256: expectedSha256,
    image_count: 1,
    calls_used: { provider: 1, plugin: 1, api: 1 },
    current_review_status: reviewBridge.current_review_status,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results,
  };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
