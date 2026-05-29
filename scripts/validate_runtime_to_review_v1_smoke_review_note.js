#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_smoke_review_note";
const notePath = "review_console/live_receipt_bridge/runtime_v1_real_guarded_smoke_001/review_note.json";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

try {
  const note = readJson(notePath);
  assert(note.schema === "local_image_review_note.v0", "schema mismatch");
  assert(note.pipeline_id === "runtime_v1_real_guarded_smoke_001", "pipeline_id mismatch");
  assert(note.prompt_package_ref === "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml", "prompt package mismatch");
  assert(note.image_ref === "runs/real_generation/runtime_to_review_v1_guarded_live_probe/image/doubaogen/4e74519f-83c3-4470-9661-fa60e371376c.png", "image ref mismatch");
  assert(note.image_metadata && note.image_metadata.width === 1440 && note.image_metadata.height === 2560, "dimensions mismatch");
  assert(note.image_metadata.sha256 === "b33a3bb72c3c644da531a0585a49fe23abe00249a683ded34f04f5eb9ef832a3", "sha256 mismatch");
  assert(note.acceptance_gate && note.acceptance_gate.passed === true, "acceptance gate must pass");
  assert(note.acceptance_gate.vertical_9_16_composition === true, "9:16 gate must pass");
  assert(note.decision === "accept_for_neutral_smoke_runtime_evidence", "decision mismatch");
  assert(note.review_status === "accepted_for_runtime_smoke_evidence_only", "review status mismatch");
  assert(note.promotion_status === "not_promoted", "promotion status must be not_promoted");
  assert(note.accepted_sample_candidate === false, "must not be accepted sample candidate");
  assert(note.production_candidate === false, "must not be production candidate");
  for (const flag of [
    "accepted_samples_write_performed",
    "production_candidate_write_performed",
    "DailyNote_write_performed",
    "VCP_memory_write_performed",
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "image_generation_performed",
    "push_tag_release_deploy_performed",
    "secret_value_read_performed"
  ]) {
    assert(note[flag] === false, `${flag} must be false`);
  }
  assert(String(note.human_review_summary_cn || "").includes("不作为商业 KV"), "scope summary must exclude commercial KV");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    validator,
    note_path: notePath,
    decision: note.decision,
    review_status: note.review_status,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false
  }, null, 2)}\n`);
} catch (error) {
  process.stderr.write(`${JSON.stringify({
    passed: false,
    validator,
    error: error.message
  }, null, 2)}\n`);
  process.exitCode = 1;
}
