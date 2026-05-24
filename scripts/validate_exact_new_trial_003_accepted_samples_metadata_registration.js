#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const YAML = require("yaml");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_56_EXACT_NEW_TRIAL_003_ACCEPTED_SAMPLES_METADATA_REGISTRATION.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_56_exact_new_trial_003_accepted_samples_metadata_registration.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_accepted_samples_metadata_registration.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_accepted_samples_metadata_registration_fail.example.json",
  approvalEvidence: "reports/human_approval_evidence/v0_3_3_exact_new_trial_003_shot_2_user_submitted_formal_human_approval_evidence.json",
  registry: "accepted_samples/accepted_sample_registry.yaml",
  categoryIndex: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expected = {
  phase: "v0_6_56_exact_new_trial_003_accepted_samples_metadata_registration",
  sourcePhase: "v0_6_55_exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  category: "fashion_lookbook_portrait",
  artifactRef: "runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/safe_adult_editorial_portrait_v1.png",
  sha256: "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b",
  dimensions: "941x1672",
  mime: "image/png",
  approvedBy: "Jenn",
  nextScope: "accepted_samples_metadata_registration_only",
  recommendedNext: "prepare_exact_new_trial_003_durable_archive_metadata_preflight_after_accepted_sample_registration"
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `Path escapes repository: ${relativePath}`);
  return resolved;
}

function read(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function readYaml(relativePath) {
  return YAML.parse(read(relativePath));
}

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertNoRawLocalDrivePath(value, context) {
  if (typeof value === "string") {
    assert(!/^[A-Za-z]:[\\/]/.test(value), `Raw local drive path found in ${context}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoRawLocalDrivePath(item, `${context}.${index}`));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => assertNoRawLocalDrivePath(item, `${context}.${key}`));
  }
}

function findRegistryEntry(registry) {
  const samples = registry?.accepted_sample_registry?.samples || [];
  return samples.find((sample) => sample.sample_id === expected.sampleId);
}

function countRegistryEntries(registry) {
  const samples = registry?.accepted_sample_registry?.samples || [];
  return samples.filter((sample) => sample.sample_id === expected.sampleId).length;
}

function validateRegistryState() {
  const registry = readYaml(files.registry);
  const category = readYaml(files.categoryIndex);
  const entry = findRegistryEntry(registry);
  const categorySamples = category.samples || [];
  const categoryMeta = category.recoverability_metadata?.[expected.sampleId] || {};

  assert(entry, "accepted sample registry entry missing");
  assert(countRegistryEntries(registry) === 1, "accepted sample registry must contain exactly one target entry");
  assert(entry.source_phase === "v0_6_56", "registry entry source phase mismatch");
  assert(entry.source_plan === "v0_3_3_exact_new_trial_003", "registry source plan mismatch");
  assert(entry.asset_status === "accepted_candidate", "registry asset status mismatch");
  assert(entry.category === expected.category, "registry category mismatch");
  assert(entry.image_path === expected.artifactRef, "registry image path mismatch");
  assert(entry.image_sha256 === expected.sha256, "registry sha mismatch");
  assert(entry.image_dimensions === expected.dimensions, "registry dimensions mismatch");
  assert(entry.verified_sha256 === expected.sha256, "registry verified sha mismatch");
  assert(entry.verified_dimensions === expected.dimensions, "registry verified dimensions mismatch");
  assert(entry.verified_mime === expected.mime, "registry verified mime mismatch");
  assert(entry.formal_sample_package_ref === files.phaseRecord, "registry formal sample package ref mismatch");
  assert(entry.approval_evidence_ref === files.approvalEvidence, "registry approval evidence ref mismatch");
  assert(entry.human_approval?.approved === true, "registry human approval flag missing");
  assert(entry.human_approval?.approved_by === expected.approvedBy, "registry approved_by mismatch");
  assert(entry.write_to_memory_allowed === false, "registry memory write must stay false");
  assert(entry.daily_note_write_allowed === false, "registry DailyNote write must stay false");
  assert(entry.acceptance_summary?.memory_suitability === false, "registry memory suitability must stay false");

  assert(category.category === expected.category, "category index category mismatch");
  assert(category.sample_count === 2, "category index sample_count mismatch");
  assert(categorySamples.includes(expected.sampleId), "category sample list missing target");
  assert(categorySamples.filter((sample) => sample === expected.sampleId).length === 1, "category sample list duplicate");
  assert(categoryMeta.verified_sha256 === expected.sha256, "category verified sha mismatch");
  assert(categoryMeta.verified_dimensions === expected.dimensions, "category verified dimensions mismatch");
  assert(categoryMeta.verified_mime === expected.mime, "category verified mime mismatch");
  assert(categoryMeta.approval_evidence_ref === files.approvalEvidence, "category approval evidence ref mismatch");
}

function validateApprovalEvidence() {
  const evidence = readJson(files.approvalEvidence).user_submitted_formal_human_approval_evidence;
  assert(evidence.phase === expected.sourcePhase, "approval evidence phase mismatch");
  assert(evidence.submitted_by === expected.approvedBy, "approval evidence submitter mismatch");
  assert(evidence.target.sample_id === expected.sampleId, "approval evidence sample mismatch");
  assert(evidence.target.candidate_id === expected.candidateId, "approval evidence candidate mismatch");
  assert(evidence.target.artifact_sha256 === expected.sha256, "approval evidence hash mismatch");
  assert(evidence.current_capture_state.next_write_scope === expected.nextScope, "approval evidence next scope mismatch");
  assert(evidence.routing_decision.accepted_samples_metadata_registration_allowed_next === true, "approval evidence did not unlock registration");
  assert(evidence.routing_decision.archive_or_memory_allowed_next === false, "approval evidence must keep archive and memory blocked");
}

function commonChecks(record) {
  const target = record.target || {};
  const result = record.registration_result || {};
  const guard = record.guard || {};
  return (
    record.version === "v1" &&
    record.phase === expected.phase &&
    record.status === "completed_validated_accepted_samples_metadata_registration_only" &&
    record.execution_mode === "accepted_samples_metadata_registration_only" &&
    record.lane === "Amber_E_exact_production_metadata_write" &&
    record.source_phase === expected.sourcePhase &&
    record.approval_evidence_ref === files.approvalEvidence &&
    record.registry_ref === files.registry &&
    record.category_index_ref === files.categoryIndex &&
    target.sample_id === expected.sampleId &&
    target.candidate_id === expected.candidateId &&
    target.category === expected.category &&
    target.artifact_ref === expected.artifactRef &&
    target.artifact_sha256 === expected.sha256 &&
    target.dimensions === expected.dimensions &&
    target.mime === expected.mime &&
    target.approved_by === expected.approvedBy &&
    result.accepted_samples_metadata_registered === true &&
    result.registry_entry_present === true &&
    result.category_index_updated === true &&
    result.category_sample_count === 2 &&
    result.duplicate_sample_id_count === 1 &&
    result.write_scope === expected.nextScope &&
    guard.image_file_copy_performed === false &&
    guard.runs_source_image_modified === false &&
    guard.archive_write_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false &&
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.image_generation_performed === false &&
    guard.secret_value_read_performed === false &&
    guard.staging_performed === false &&
    guard.commit_performed === false &&
    guard.push_tag_release_deploy_performed === false &&
    record.recommended_next === expected.recommendedNext &&
    record.recommended_next_auto_execution_allowed === "true_local_archive_metadata_preflight_only"
  );
}

function validateRecord(record, context) {
  assert(record && typeof record === "object", `${context} record missing`);
  assertNoRawLocalDrivePath(record, `${context}.record`);
  assert(commonChecks(record), `${context} common checks failed`);
}

function expectFailure(baseRecord, caseId, mutate) {
  const record = clone(baseRecord);
  mutate(record);
  try {
    validateRecord(record, caseId);
  } catch (error) {
    return { case_id: caseId, result: "caught", failure_message: error.message };
  }
  throw new Error(`${caseId} was not caught`);
}

function main() {
  for (const relativePath of Object.values(files)) {
    assert(exists(relativePath), `Missing required file: ${relativePath}`);
  }

  const phaseText = read(files.phaseRecord);
  const report = readJson(files.report).exact_new_trial_003_accepted_samples_metadata_registration;
  const passFixture = readJson(files.passFixture).exact_new_trial_003_accepted_samples_metadata_registration;
  const failFixture = readJson(files.failFixture).exact_new_trial_003_accepted_samples_metadata_registration;
  const mvpText = read(files.mvpValidator);

  for (const token of [
    `phase: ${expected.phase}`,
    expected.sampleId,
    expected.candidateId,
    "accepted_samples_metadata_registered: true",
    "image_file_copy_performed: false",
    "archive_write_performed: false",
    "DailyNote_write_performed: false"
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  assert(
    mvpText.includes("scripts/validate_exact_new_trial_003_accepted_samples_metadata_registration.js"),
    "validate_mvp missing accepted-samples metadata registration validator"
  );

  validateApprovalEvidence();
  validateRegistryState();
  validateRecord(report, "report");
  validateRecord(passFixture, "pass_fixture");

  let invalidFixtureCaught = false;
  try {
    validateRecord(failFixture, "invalid_fixture");
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid fixture must fail");

  const negativeCases = [
    expectFailure(passFixture, "wrong_sample_id_fails", (record) => {
      record.target.sample_id = "wrong_sample";
    }),
    expectFailure(passFixture, "wrong_hash_fails", (record) => {
      record.target.artifact_sha256 = "wrong_hash";
    }),
    expectFailure(passFixture, "wrong_write_scope_fails", (record) => {
      record.registration_result.write_scope = "archive_write";
    }),
    expectFailure(passFixture, "duplicate_count_fails", (record) => {
      record.registration_result.duplicate_sample_id_count = 2;
    }),
    expectFailure(passFixture, "archive_write_flag_fails", (record) => {
      record.guard.archive_write_performed = true;
    }),
    expectFailure(passFixture, "memory_write_flag_fails", (record) => {
      record.guard.DailyNote_write_performed = true;
      record.guard.VCP_memory_write_performed = true;
    }),
    expectFailure(passFixture, "provider_or_image_generation_flag_fails", (record) => {
      record.guard.provider_contact_performed = true;
      record.guard.image_generation_performed = true;
    })
  ];

  const summary = {
    phase: expected.phase,
    passed: true,
    target_sample_id: report.target.sample_id,
    target_candidate_id: report.target.candidate_id,
    category: report.target.category,
    approved_by: report.target.approved_by,
    artifact_sha256: report.target.artifact_sha256,
    accepted_samples_metadata_registered: report.registration_result.accepted_samples_metadata_registered,
    category_index_updated: report.registration_result.category_index_updated,
    duplicate_sample_id_count: report.registration_result.duplicate_sample_id_count,
    write_scope: report.registration_result.write_scope,
    archive_write_performed: report.guard.archive_write_performed,
    production_candidate_write_performed: report.guard.production_candidate_write_performed,
    DailyNote_write_performed: report.guard.DailyNote_write_performed,
    VCP_memory_write_performed: report.guard.VCP_memory_write_performed,
    negative_case_count: negativeCases.length,
    caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: negativeCases.every((item) => item.result === "caught"),
    recommended_next: report.recommended_next
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
