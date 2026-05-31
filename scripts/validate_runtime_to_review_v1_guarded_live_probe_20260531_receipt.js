#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const receiptPath = "reports/runtime_to_review_v1/guarded_live_probe_real_bound_owner_runtime_20260531_receipt.json";
const preflightPath = "reports/runtime_to_review_v1/guarded_live_probe_real_bound_owner_runtime_20260531_preflight_packet.json";
const docPath = "docs/RUNTIME_TO_REVIEW_V1_GUARDED_LIVE_PROBE_REAL_BOUND_ACTIVATION_20260531.md";
const validator = "runtime_to_review_v1_guarded_live_probe_20260531_receipt";

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

function jpegDimensions(relativePath) {
  const buffer = fs.readFileSync(repoPath(relativePath));
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      const height = buffer.readUInt16BE(offset + 5);
      const width = buffer.readUInt16BE(offset + 7);
      return `${width}x${height}`;
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

const receipt = readJson(receiptPath);
const preflight = readJson(preflightPath);
const doc = readText(docPath);
const artifactPath = receipt.artifact.path;

check("receipt_exists", () => fs.existsSync(repoPath(receiptPath)));
check("activation_doc_exists", () => fs.existsSync(repoPath(docPath)));
check("preflight_exists", () => fs.existsSync(repoPath(preflightPath)));
check("schema", () => receipt.schema === "runtime_to_review_v1_guarded_live_probe_activation_receipt.v1");
check("preflight_trace", () => receipt.source_preflight_packet_ref === preflightPath);
check("exact_phrase_matches_preflight", () =>
  receipt.authorization.exact_confirmation_phrase_received === true &&
  receipt.authorization.exact_confirmation_phrase === preflight.exact_confirmation_phrase
);
check("budget_exactly_one", () =>
  receipt.authorization.max_provider_calls === 1 &&
  receipt.authorization.max_plugin_calls === 1 &&
  receipt.authorization.max_api_calls === 1 &&
  receipt.authorization.max_images === 1 &&
  receipt.authorization.retry_allowed === false
);
check("command_matches_preflight", () =>
  JSON.stringify(receipt.command) === JSON.stringify(preflight.future_live_command)
);
check("result_completed_one_image", () =>
  receipt.result.passed === true &&
  receipt.result.status === "completed_provider_image_created" &&
  receipt.result.calls_used.provider === 1 &&
  receipt.result.calls_used.plugin === 1 &&
  receipt.result.calls_used.api === 1 &&
  receipt.result.image_count === 1 &&
  receipt.result.stop_reason === null
);
check("artifact_exists", () => fs.existsSync(repoPath(artifactPath)));
check("artifact_hash_matches", () => sha256File(artifactPath) === receipt.artifact.sha256);
check("artifact_magic_matches_jpeg", () =>
  magicHex(artifactPath).startsWith("ffd8ffe000104a4649460001") &&
  receipt.artifact.magic_number === "ffd8ffe000104a4649460001" &&
  receipt.artifact.mime_type === "image/jpeg"
);
check("artifact_dimensions_match", () => jpegDimensions(artifactPath) === receipt.artifact.dimensions);
check("artifact_is_workspace_local_not_git_tracked", () =>
  receipt.artifact.workspace_local_artifact === true &&
  receipt.artifact.git_tracked_artifact === false &&
  receipt.artifact.gitignore_rule === "/runs/real_generation/*/*"
);
check("extension_mime_watchpoint_recorded", () =>
  artifactPath.endsWith(".png") &&
  receipt.artifact.mime_type === "image/jpeg" &&
  receipt.artifact.extension_mime_mismatch_watchpoint === true
);
check("review_gate_blocks_promotion_production_memory", () =>
  receipt.review_gate.human_review_required === true &&
  receipt.review_gate.current_review_status === "pending_human_review" &&
  receipt.review_gate.accepted_sample_write_allowed_now === false &&
  receipt.review_gate.production_candidate_allowed_now === false &&
  receipt.review_gate.memory_write_allowed_now === false
);
check("expected_live_side_effects_true", () =>
  receipt.side_effect_flags.provider_contact_performed === true &&
  receipt.side_effect_flags.plugin_call_performed === true &&
  receipt.side_effect_flags.api_call_performed === true &&
  receipt.side_effect_flags.image_generation_performed === true
);
check("forbidden_side_effects_false", () =>
  receipt.side_effect_flags.forbidden_disk_write_performed === false &&
  receipt.side_effect_flags.production_write_performed === false &&
  receipt.side_effect_flags.accepted_samples_write_performed === false &&
  receipt.side_effect_flags.DailyNote_write_performed === false &&
  receipt.side_effect_flags.VCP_memory_write_performed === false &&
  receipt.side_effect_flags.secret_value_read_performed === false &&
  receipt.side_effect_flags.env_file_content_read_performed === false &&
  receipt.side_effect_flags.secret_values_printed === false &&
  receipt.side_effect_flags.secret_values_written === false &&
  receipt.side_effect_flags.push_tag_release_deploy_performed === false
);
check("doc_references_receipt_and_watchpoint", () =>
  doc.includes(receiptPath) &&
  doc.includes(artifactPath) &&
  doc.includes("JPEG") &&
  doc.includes("accepted_samples_write_performed: false")
);

process.stdout.write(`${JSON.stringify({
  passed,
  validator,
  receipt: receiptPath,
  artifact: artifactPath,
  check_count: results.length,
  failed_count: results.filter((result) => !result.passed).length,
  status: receipt.result.status,
  calls_used: receipt.result.calls_used,
  image_count: receipt.result.image_count,
  artifact_sha256_verified: results.find((result) => result.check === "artifact_hash_matches")?.passed === true,
  artifact_magic_verified: results.find((result) => result.check === "artifact_magic_matches_jpeg")?.passed === true,
  extension_mime_mismatch_watchpoint: receipt.artifact.extension_mime_mismatch_watchpoint,
  secret_value_read_performed: receipt.side_effect_flags.secret_value_read_performed,
  accepted_samples_write_performed: receipt.side_effect_flags.accepted_samples_write_performed,
  production_candidate_write_performed: receipt.side_effect_flags.production_write_performed,
  DailyNote_write_performed: receipt.side_effect_flags.DailyNote_write_performed,
  VCP_memory_write_performed: receipt.side_effect_flags.VCP_memory_write_performed,
  results,
}, null, 2)}\n`);

if (!passed) process.exitCode = 1;
