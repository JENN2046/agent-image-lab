#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const helperPath = "adapters/runtime/review_draft_registry_v1.js";
const decisionHelperPath = "adapters/runtime/review_decision_record_v1.js";
const schemaPath = "schemas/review_draft_registry_record.schema.yaml";
const retry007DecisionPath = "review_console/review_decisions/v0_6_73_real_vcp_agent_generation_retry_007/decision_record.json";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `Path escapes repository: ${relativePath}`);
  return resolved;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function runNode(args) {
  return childProcess.execFileSync(process.execPath, args, { cwd: root, encoding: "utf8" });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function expectFailure(caseId, fn) {
  try {
    fn();
  } catch (_error) {
    return { case_id: caseId, result: "caught" };
  }
  throw new Error(`${caseId} was not caught`);
}

function decisionRecord(decision) {
  return {
    schema: "review_decision_record.v1",
    helper_id: "review_decision_record_v1",
    decision_id: `decision_fixture_${decision}`,
    artifact_record_ref: "runtime-to-review-v1://fixture/artifact_record.json",
    audit_receipt_ref: "runtime-to-review-v1://fixture/audit_receipt.json",
    artifact_sha256: "c".repeat(64),
    artifact_dimensions: "1024x1024",
    source_review_session_ref: "runtime_v1_review_session_fixture",
    reviewer_note: `Fixture decision ${decision}`,
    decision,
    production_candidate: false,
    memory_write_performed: false,
    accepted_samples_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    created_at: "2026-05-29T00:00:00.000Z",
    metadata_only: true,
    image_binary_copied: false,
    image_binary_read_performed: false,
    source_image_moved_or_copied: false,
    formal_registry_write_performed: false,
    side_effect_flags: {
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false,
      image_binary_read_performed: false,
      file_write_performed: false,
      accepted_samples_write_performed: false,
      production_candidate_write_performed: false,
      DailyNote_write_performed: false,
      VCP_memory_write_performed: false,
      memory_write_performed: false,
      secret_value_read_performed: false,
      push_tag_release_deploy_performed: false,
    },
  };
}

function assertCleanDraft(record, label) {
  assert(record.schema === "review_draft_registry_record.v1", `${label} schema mismatch`);
  assert(typeof record.draft_id === "string" && record.draft_id.length > 0, `${label} draft id missing`);
  assert(record.production_candidate === false, `${label} production candidate must be false`);
  assert(record.production_candidate_write_performed === false, `${label} production write must be false`);
  assert(record.accepted_samples_write_performed === false, `${label} accepted samples write must be false`);
  assert(record.memory_write_performed === false, `${label} memory write must be false`);
  assert(record.DailyNote_write_performed === false, `${label} DailyNote write must be false`);
  assert(record.VCP_memory_write_performed === false, `${label} VCP memory write must be false`);
  assert(record.metadata_only === true, `${label} metadata only must be true`);
  assert(record.image_binary_copied === false, `${label} image binary copied must be false`);
  assert(record.image_binary_read_performed === false, `${label} image binary read must be false`);
  assert(record.source_image_moved_or_copied === false, `${label} source image moved/copy must be false`);
  Object.entries(record.side_effect_flags || {}).forEach(([field, value]) => {
    assert(value === false, `${label}.side_effect_flags.${field} must be false`);
  });
}

function main() {
  [helperPath, decisionHelperPath, schemaPath, retry007DecisionPath].forEach((file) => {
    assert(fs.existsSync(repoPath(file)), `${file} missing`);
  });
  runNode(["--check", helperPath]);
  runNode(["--check", "scripts/validate_review_draft_registry_v1.js"]);

  const helper = require(repoPath(helperPath));
  const schema = readText(schemaPath);
  [
    "accepted_sample_draft",
    "rejected_sample_draft",
    "rework_sample_draft",
    "no_registry_draft",
    "production_candidate: false",
    "provider_link_success_evidence_only_creates_no_registry_draft: true",
  ].forEach((token) => assert(schema.includes(token), `${token} missing from schema`));

  const acceptedDraft = helper.buildReviewDraftRegistryRecord(decisionRecord("accept_sample_draft"));
  const rejectedDraft = helper.buildReviewDraftRegistryRecord(decisionRecord("reject_sample_draft"));
  const reworkDraft = helper.buildReviewDraftRegistryRecord(decisionRecord("request_rework"));
  const invalidDraft = helper.buildReviewDraftRegistryRecord(decisionRecord("invalid_artifact"));
  [acceptedDraft, rejectedDraft, reworkDraft, invalidDraft].forEach((record, index) => assertCleanDraft(record, `draft_${index}`));

  assert(acceptedDraft.draft_type === "accepted_sample_draft", "accepted draft type mismatch");
  assert(acceptedDraft.route_summary.accepted_draft_created === true, "accepted draft not marked created");
  assert(rejectedDraft.draft_type === "rejected_sample_draft", "rejected draft type mismatch");
  assert(rejectedDraft.route_summary.rejected_draft_created === true, "rejected draft not marked created");
  assert(reworkDraft.draft_type === "rework_sample_draft", "rework draft type mismatch");
  assert(reworkDraft.route_summary.rework_draft_created === true, "rework draft not marked created");
  assert(invalidDraft.draft_type === "rejected_sample_draft", "invalid artifact should map to rejected draft");

  const retry007Draft = helper.buildReviewDraftRegistryRecord(readJson(retry007DecisionPath));
  assertCleanDraft(retry007Draft, "retry_007_draft");
  assert(retry007Draft.draft_type === "no_registry_draft", "retry_007 must not create a registry draft");
  assert(retry007Draft.route_summary.accepted_draft_created === false, "retry_007 must not create accepted draft");
  assert(retry007Draft.route_summary.no_registry_draft_reason === "provider_link_success_evidence_only", "retry_007 no-draft reason mismatch");

  const writeDir = "review_console/draft_registry/_validator_probe";
  const writeResult = helper.writeReviewDraftRegistryRecord(acceptedDraft, { outputDir: writeDir, overwrite: true });
  assert(writeResult.output_path.startsWith(`${writeDir}/`), "write output path mismatch");
  const written = readJson(writeResult.output_path);
  assertCleanDraft(written, "written_probe_draft");
  fs.unlinkSync(repoPath(writeResult.output_path));
  fs.rmdirSync(repoPath(writeDir));

  const negativeCases = [
    expectFailure("missing_artifact_hash_for_accepted_rejected", () => {
      const dirty = decisionRecord("accept_sample_draft");
      dirty.artifact_sha256 = null;
      helper.buildReviewDraftRegistryRecord(dirty);
    }),
    expectFailure("production_candidate_true_rejected", () => {
      const dirty = clone(acceptedDraft);
      dirty.production_candidate = true;
      helper.validateReviewDraftRegistryRecord(dirty);
    }),
    expectFailure("accepted_samples_write_true_rejected", () => {
      const dirty = clone(acceptedDraft);
      dirty.accepted_samples_write_performed = true;
      helper.validateReviewDraftRegistryRecord(dirty);
    }),
    expectFailure("memory_write_true_rejected", () => {
      const dirty = clone(acceptedDraft);
      dirty.memory_write_performed = true;
      helper.validateReviewDraftRegistryRecord(dirty);
    }),
  ];

  console.log(JSON.stringify({
    passed: true,
    validator: "validate_review_draft_registry_v1",
    helper_id: helper.helperId,
    accepted_draft_created: acceptedDraft.route_summary.accepted_draft_created,
    rejected_draft_created: rejectedDraft.route_summary.rejected_draft_created,
    rework_draft_created: reworkDraft.route_summary.rework_draft_created,
    retry_007_draft_type: retry007Draft.draft_type,
    retry_007_accepted_draft_created: retry007Draft.route_summary.accepted_draft_created,
    write_probe_output_dir: writeDir,
    write_probe_cleaned_up: true,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    image_binary_read_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    memory_write_performed: false,
    negative_case_count: negativeCases.length,
    caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: negativeCases.every((item) => item.result === "caught"),
  }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(JSON.stringify({
    passed: false,
    validator: "validate_review_draft_registry_v1",
    error: error.message,
  }, null, 2));
  process.exitCode = 1;
}
