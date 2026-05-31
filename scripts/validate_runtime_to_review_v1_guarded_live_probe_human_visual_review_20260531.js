#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_guarded_live_probe_human_visual_review_20260531";
const reviewPath = "reports/runtime_to_review_v1/guarded_live_probe_human_visual_review_20260531.json";
const receiptPath = "reports/runtime_to_review_v1/guarded_live_probe_real_bound_owner_runtime_20260531_receipt.json";
const docPath = "docs/RUNTIME_TO_REVIEW_V1_GUARDED_LIVE_PROBE_HUMAN_VISUAL_REVIEW_20260531.md";

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

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function sha256File(relativePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(repoPath(relativePath))).digest("hex");
}

function magicHex(relativePath, byteCount = 12) {
  const buffer = fs.readFileSync(repoPath(relativePath));
  return buffer.slice(0, Math.min(byteCount, buffer.length)).toString("hex");
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

const review = readJson(reviewPath);
const receipt = readJson(receiptPath);
const doc = readText(docPath);
const artifactPath = review.artifact.path;

check("review_record_exists", () => fs.existsSync(repoPath(reviewPath)));
check("source_receipt_exists", () => fs.existsSync(repoPath(receiptPath)));
check("doc_exists", () => fs.existsSync(repoPath(docPath)));
check("schema", () => review.schema === "runtime_to_review_v1_human_visual_review_gate.v1");
check("source_receipt_trace", () => review.source_activation_receipt_ref === receiptPath);
check("receipt_completed_provider_image", () =>
  receipt.result.status === "completed_provider_image_created" &&
  receipt.result.image_count === 1 &&
  receipt.result.calls_used.provider === 1 &&
  receipt.result.calls_used.plugin === 1 &&
  receipt.result.calls_used.api === 1
);
check("artifact_matches_receipt", () =>
  review.artifact.path === receipt.artifact.path &&
  review.artifact.sha256 === receipt.artifact.sha256 &&
  review.artifact.mime_type === receipt.artifact.mime_type &&
  review.artifact.dimensions === receipt.artifact.dimensions &&
  review.artifact.magic_number === receipt.artifact.magic_number
);
check("artifact_exists_and_hash_matches", () =>
  fs.existsSync(repoPath(artifactPath)) &&
  sha256File(artifactPath) === review.artifact.sha256
);
check("artifact_magic_matches_jpeg", () =>
  review.artifact.mime_type === "image/jpeg" &&
  magicHex(artifactPath).startsWith("ffd8ffe000104a4649460001")
);
check("review_decision_is_smoke_pass", () =>
  review.visual_review.decision === "pass_as_runtime_smoke_evidence_with_watchpoint" &&
  review.visual_review.score >= 85 &&
  review.visual_review.target_match === "pass" &&
  review.visual_review.composition === "pass" &&
  review.visual_review.artifact_quality === "pass"
);
check("owner_approval_not_claimed", () =>
  review.reviewer.owner_final_approval_required === true &&
  review.reviewer.owner_final_approval_granted_by_this_record === false
);
check("route_blocks_promotion_memory_production", () =>
  review.route_decision.route === "runtime_smoke_evidence_only" &&
  review.route_decision.accepted_sample_candidate === false &&
  review.route_decision.accepted_sample_write_allowed_now === false &&
  review.route_decision.production_candidate_allowed_now === false &&
  review.route_decision.memory_write_allowed_now === false
);
check("watchpoint_recorded", () =>
  review.route_decision.runtime_tooling_patch_recommended === true &&
  review.route_decision.runtime_tooling_patch_status === "completed_by_followup_local_patch" &&
  review.route_decision.runtime_tooling_patch_ref === "docs/RUNTIME_TO_REVIEW_V1_OUTPUT_EXTENSION_NORMALIZATION_PATCH_20260531.md" &&
  review.visual_review.watchpoints.some((item) => item.includes(".png")) &&
  review.visual_review.watchpoints.some((item) => item.includes("JPEG") || item.includes("MIME"))
);
check("review_gate_has_no_live_side_effects", () =>
  Object.entries(review.boundary_checks).every(([, value]) => value === false)
);
check("doc_references_review_and_boundaries", () =>
  doc.includes(reviewPath) &&
  doc.includes("pass_as_runtime_smoke_evidence_with_watchpoint") &&
  doc.includes("RUNTIME_TO_REVIEW_V1_OUTPUT_EXTENSION_NORMALIZATION_PATCH_20260531.md") &&
  doc.includes("accepted_samples_write_performed: false") &&
  doc.includes("owner_final_approval_granted_by_this_record: false")
);

process.stdout.write(`${JSON.stringify({
  passed,
  validator,
  review_record: reviewPath,
  source_receipt: receiptPath,
  artifact: artifactPath,
  check_count: results.length,
  failed_count: results.filter((result) => !result.passed).length,
  decision: review.visual_review.decision,
  score: review.visual_review.score,
  accepted_sample_candidate: review.route_decision.accepted_sample_candidate,
  owner_final_approval_granted_by_this_record: review.reviewer.owner_final_approval_granted_by_this_record,
  runtime_tooling_patch_recommended: review.route_decision.runtime_tooling_patch_recommended,
  provider_contact_performed_by_this_review_gate: review.boundary_checks.provider_contact_performed_by_this_review_gate,
  image_generation_performed_by_this_review_gate: review.boundary_checks.image_generation_performed_by_this_review_gate,
  accepted_samples_write_performed: review.boundary_checks.accepted_samples_write_performed,
  production_candidate_write_performed: review.boundary_checks.production_candidate_write_performed,
  DailyNote_write_performed: review.boundary_checks.DailyNote_write_performed,
  VCP_memory_write_performed: review.boundary_checks.VCP_memory_write_performed,
  results,
}, null, 2)}\n`);

if (!passed) process.exitCode = 1;
