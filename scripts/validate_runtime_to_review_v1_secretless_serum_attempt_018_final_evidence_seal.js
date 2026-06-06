#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const YAML = require("yaml");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_secretless_serum_attempt_018_final_evidence_seal";
const validatorPath = "scripts/validate_runtime_to_review_v1_secretless_serum_attempt_018_final_evidence_seal.js";
const packageScriptName = "validate:runtime-to-review-secretless-serum-attempt-018-final-evidence-seal";
const manifestId = "runtime_to_review_secretless_serum_attempt_018_final_evidence_seal";

const refs = {
  seal: "reports/runtime_to_review_v1/secretless_serum_attempt_018_final_evidence_seal_20260606.json",
  candidate: "reports/runtime_to_review_v1/secretless_serum_attempt_018_accepted_candidate_record_20260606.json",
  reviewSession: "reports/runtime_to_review_v1/secretless_serum_attempt_018_review_session_draft_20260606.json",
  imageCase: "reports/runtime_to_review_v1/secretless_serum_attempt_018_image_case_draft_20260606.json",
  memoryDelta: "reports/runtime_to_review_v1/secretless_serum_attempt_018_memory_delta_draft_20260606.yaml",
  checklist: "reports/runtime_to_review_v1/secretless_serum_attempt_018_final_validation_checklist_20260606.md",
  lock: "reports/runtime_to_review_v1/secretless_serum_attempt_018.lock.json",
  receipt: "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_018.json",
  artifact: "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_018.json",
  quality: "reports/runtime_to_review_v1/secretless_serum_attempt_018_quality_channel_review_20260604.json",
  output: "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle_secretless_attempt_018/3551a0c1-029b-4631-aa5b-45a900e1718a.jpg"
};

const expectedSha = "950eec0c7afa7c86567c10f2e73b657e872cbee12c2e85d77a9f75c82de49075";
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

function readYaml(relativePath) {
  return YAML.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function sha256File(relativePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(repoPath(relativePath))).digest("hex");
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

const seal = readJson(refs.seal);
const candidate = readJson(refs.candidate);
const reviewSession = readJson(refs.reviewSession).review_session;
const imageCase = readJson(refs.imageCase).image_case;
const memoryDelta = readYaml(refs.memoryDelta).memory_delta;
const checklist = fs.readFileSync(repoPath(refs.checklist), "utf8");
const lock = readJson(refs.lock);
const receipt = readJson(refs.receipt);
const artifact = readJson(refs.artifact);
const quality = readJson(refs.quality);
const packageJson = readJson("package.json");
const manifest = readJson("scripts/validation_manifest.json");

check("source_attempt_018_success_evidence_matches", () =>
  lock.attempt === "018" &&
  lock.status === "exact_activation_consumed_succeeded_no_retry" &&
  lock.authorization_boundary.activation_consumed === true &&
  lock.authorization_boundary.retry_allowed_after_consumption === false &&
  receipt.status === "succeeded" &&
  artifact.result === "succeeded" &&
  receipt.calls_used.route_http_request === 1 &&
  receipt.calls_used.provider === 1 &&
  receipt.calls_used.plugin === 1 &&
  receipt.calls_used.api === 1 &&
  receipt.calls_used.image === 1
);

check("artifact_sha_mime_dimensions_and_file_match", () =>
  fs.existsSync(repoPath(refs.output)) &&
  sha256File(refs.output) === expectedSha &&
  artifact.artifact_evidence.sha256 === expectedSha &&
  artifact.artifact_evidence.mime === "image/jpeg" &&
  artifact.artifact_evidence.dimensions.width === 1920 &&
  artifact.artifact_evidence.dimensions.height === 1920 &&
  seal.artifact_evidence.sha256 === expectedSha &&
  candidate.artifact_evidence.sha256 === expectedSha
);

check("final_seal_links_all_drafts_and_keeps_boundaries", () =>
  seal.status === "sealed_final_accepted_candidate_pending_formal_registry" &&
  seal.decision.accepted_candidate === true &&
  seal.decision.formal_accepted_sample_registered === false &&
  seal.decision.attempt_019_needed === false &&
  seal.source_refs.accepted_candidate_record === refs.candidate &&
  seal.source_refs.review_session_draft === refs.reviewSession &&
  seal.source_refs.image_case_draft === refs.imageCase &&
  seal.source_refs.memory_delta_draft === refs.memoryDelta &&
  seal.boundary_checks_for_this_seal.new_route_http_request_performed === false &&
  seal.boundary_checks_for_this_seal.new_image_generation_performed === false &&
  seal.boundary_checks_for_this_seal.accepted_samples_registry_write_performed === false &&
  seal.boundary_checks_for_this_seal.DailyNote_write_performed === false &&
  seal.boundary_checks_for_this_seal.VCP_memory_write_performed === false
);

check("candidate_record_is_approved_with_notes_but_not_registry_write", () =>
  candidate.record_type === "accepted_candidate" &&
  candidate.human_brand_review.decision === "approved_with_notes" &&
  candidate.human_brand_review.attempt_019_needed_immediately === false &&
  candidate.promotion_boundaries.accepted_sample_created === false &&
  candidate.promotion_boundaries.accepted_registry_entry_created === false &&
  candidate.promotion_boundaries.requires_separate_accepted_samples_registry_gate === true &&
  candidate.side_effect_flags.image_generation_performed_by_this_record === false &&
  candidate.side_effect_flags.DailyNote_write_performed === false
);

check("review_session_uses_human_review_and_keeps_memory_pending", () =>
  reviewSession.status === "approved" &&
  reviewSession.human_review.decision === "approved_with_notes" &&
  reviewSession.final_review.uses_human_review === true &&
  reviewSession.final_review.attempt_019_needed_immediately === false &&
  reviewSession.archive_decision.asset_status === "candidate" &&
  reviewSession.archive_decision.accepted_samples_registry_write_allowed_by_this_draft === false &&
  reviewSession.memory_approval.status === "pending" &&
  reviewSession.memory_preview.chinese_diary_content.includes("完整瓶身")
);

check("image_case_is_candidate_with_human_approval_notes", () =>
  imageCase.case_id === "image-case-secretless-serum-attempt-018-final-candidate" &&
  imageCase.asset_status === "candidate" &&
  imageCase.human_approval.approved === true &&
  imageCase.human_approval.approval_notes_cn.includes("正式 accepted_samples registry 写入仍需单独 gate") &&
  imageCase.output_assets.includes(refs.output) &&
  imageCase.memory_entries.includes(refs.memoryDelta)
);

check("memory_delta_is_chinese_draft_no_vcp_write", () =>
  memoryDelta.write_mode === "draft" &&
  memoryDelta.approval_required === true &&
  memoryDelta.approval_status === "pending" &&
  memoryDelta.final_decision.should_write_to_vcp === false &&
  memoryDelta.final_decision.should_show_in_review_console === true &&
  memoryDelta.memory_safety.contains_secret === false &&
  memoryDelta.memory_safety.contains_private_path === false &&
  memoryDelta.memory_safety.contains_image_binary === false &&
  memoryDelta.chinese_diary_content.includes("尚未写入 DailyNote 或 VCP 长期记忆")
);

check("quality_review_supports_final_candidate", () =>
  quality.visual_review.overall_outcome === "production_candidate" &&
  quality.visual_review.score === 91 &&
  quality.decision.attempt_019_needed_immediately === false &&
  quality.source_output_ref === refs.output &&
  quality.source_artifact_evidence.sha256 === expectedSha
);

check("checklist_names_required_final_validation", () =>
  checklist.includes("node scripts\\validate_runtime_to_review_v1_secretless_serum_attempt_018_final_evidence_seal.js") &&
  checklist.includes("npm run validate:runtime-to-review-secretless-serum-successful-attempt-evidence") &&
  checklist.includes("node scripts\\validate_agent_board_state.js") &&
  checklist.includes("git diff --check")
);

check("package_script_registered", () =>
  packageJson.scripts?.[packageScriptName] === `node ${validatorPath}`
);

check("manifest_entry_registered", () => {
  const entry = manifest.validators.find((item) => item.id === manifestId);
  const triggers = Object.values(refs).filter((value) => value !== refs.output).concat([refs.output, validatorPath, "package.json", "scripts/validation_manifest.json"]);
  return entry &&
    entry.command === `npm run ${packageScriptName}` &&
    entry.script === validatorPath &&
    entry.tier === "targeted" &&
    entry.domain === "runtime_to_review" &&
    entry.status === "active" &&
    triggers.every((trigger) => entry.trigger_paths.includes(trigger)) &&
    entry.required_for.includes(manifestId);
});

process.stdout.write(`${JSON.stringify({
  passed,
  validator,
  seal_ref: refs.seal,
  candidate_ref: refs.candidate,
  route_http_request_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  output_write_performed: false,
  accepted_samples_registry_write_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  secret_value_read_performed: false,
  checks
}, null, 2)}\n`);

if (!passed) process.exitCode = 1;
