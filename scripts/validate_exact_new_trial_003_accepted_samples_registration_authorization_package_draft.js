#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  phaseRecord: "docs/V0_6_36_EXACT_NEW_TRIAL_003_ACCEPTED_SAMPLES_REGISTRATION_AUTHORIZATION_PACKAGE_DRAFT.md",
  report: "reports/visual_asset_eval_dry_run/v0_6_36_exact_new_trial_003_accepted_samples_registration_authorization_package_draft.json",
  passFixture: "tests/schema_examples/exact_new_trial_003_accepted_samples_registration_authorization_package_draft.example.json",
  failFixture: "tests/schema_examples/exact_new_trial_003_accepted_samples_registration_authorization_package_draft_fail.example.json",
  humanReview: "reports/visual_asset_eval_dry_run/v0_6_32_exact_new_trial_003_human_review.json",
  gateAlignment: "reports/visual_asset_eval_dry_run/v0_6_34_exact_new_trial_003_selected_candidate_post_approval_gate_alignment.json",
  preflightDraft: "reports/visual_asset_eval_dry_run/v0_6_35_exact_new_trial_003_post_approval_registration_preflight_draft.json",
  registry: "accepted_samples/accepted_sample_registry.yaml",
  categoryIndex: "accepted_samples/categories/fashion_lookbook_portrait.yaml",
  mvpValidator: "scripts/validate_mvp.ps1"
};

const expected = {
  phase: "v0_6_36_exact_new_trial_003_accepted_samples_registration_authorization_package_draft",
  sampleId: "accepted_safe_adult_editorial_portrait_exact_new_trial_003_shot_2_001",
  candidateId: "v0_3_3_exact_new_trial_003_shot_2",
  artifactRef: "runs/real_generation/v0_3_3_exact_new_trial_003_shot_2/safe_adult_editorial_portrait_v1.png",
  sha256: "8bd7b81a916f0f6333392562d84e32368a3f28dd6a6456fc2f9e49d835a62c3b",
  dimensions: "941x1672",
  mime: "image/png",
  status: "prepared_blocked_not_granted",
  blocker: "human_approval_missing",
  recommendedNext: "prepare_exact_new_trial_003_accepted_samples_registration_execution_preflight_with_authorization_package_and_human_approval_blocker_preserved"
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

function evaluate(input) {
  const sourceRefs = input.source_refs || {};
  const target = input.target || {};
  const scope = input.draft_scope || {};
  const guard = input.guard || {};
  const allowedFiles = scope.would_modify_files || [];
  const forbiddenPaths = scope.forbidden_paths || [];
  const validationRequired = scope.validation_required || [];
  const statement = input.exact_approval_statement_draft || "";

  const humanReview = readJson(files.humanReview).exact_new_trial_003_human_review;
  const gateAlignment = readJson(files.gateAlignment).exact_new_trial_003_selected_candidate_post_approval_gate_alignment;
  const preflightDraft = readJson(files.preflightDraft).exact_new_trial_003_post_approval_registration_preflight_draft;
  const registryText = read(files.registry);
  const categoryText = read(files.categoryIndex);
  const targetSampleRegisteredNow =
    registryText.includes(`sample_id: ${expected.sampleId}`) &&
    registryText.includes(`image_sha256: ${expected.sha256}`) &&
    registryText.includes("source_phase: v0_6_56") &&
    categoryText.includes(`  - ${expected.sampleId}`) &&
    categoryText.includes(`  ${expected.sampleId}:`);

  const sourceRefsOk =
    sourceRefs.human_review === files.humanReview &&
    sourceRefs.post_approval_gate_alignment === files.gateAlignment &&
    sourceRefs.registration_preflight_draft === files.preflightDraft &&
    sourceRefs.accepted_sample_registry === files.registry &&
    sourceRefs.category_index === files.categoryIndex;

  const targetOk =
    input.phase === expected.phase &&
    input.execution_mode === "authorization_package_draft_only" &&
    input.authorization_package_status === expected.status &&
    input.authorization_granted_by_this_record === false &&
    input.execution_ready === false &&
    input.blocker === expected.blocker &&
    target.sample_id === expected.sampleId &&
    target.candidate_id === expected.candidateId &&
    target.review_record_ref === files.humanReview &&
    target.gate_alignment_ref === files.gateAlignment &&
    target.preflight_draft_ref === files.preflightDraft &&
    target.artifact_ref === expected.artifactRef &&
    target.verified_sha256 === expected.sha256 &&
    target.verified_dimensions === expected.dimensions &&
    target.verified_mime === expected.mime &&
    target.human_approval_status === "pending" &&
    target.approved_by === null &&
    target.registration_ready === false &&
    humanReview.candidate_comparison.selected_candidate_attempt_id === expected.candidateId &&
    humanReview.candidate_comparison.selected_candidate_output_image_sha256 === expected.sha256 &&
    gateAlignment.target.proposed_sample_id === expected.sampleId &&
    preflightDraft.proposed_registration.sample_id === expected.sampleId &&
    preflightDraft.eligibility.human_approval_present === false &&
    ((!registryText.includes(expected.sampleId) && !categoryText.includes(expected.sampleId)) || targetSampleRegisteredNow);

  const statementOk =
    statement.includes("AUTH-PENDING-EXACT-NEW-TRIAL-003-SHOT-2-ACCEPTED-SAMPLES-REGISTRATION-20260524-001") &&
    statement.includes(expected.sampleId) &&
    statement.includes("允许仅修改 accepted_samples/accepted_sample_registry.yaml 和 accepted_samples/categories/fashion_lookbook_portrait.yaml") &&
    statement.includes("不允许复制或提交图片文件") &&
    statement.includes("不允许写 production_candidate") &&
    statement.includes("不允许写 DailyNote") &&
    statement.includes("不允许写 VCP memory") &&
    statement.includes("不允许 provider/API/plugin/MCP 调用") &&
    statement.includes("审批人 Jenn");

  const scopeOk =
    allowedFiles.length === 2 &&
    allowedFiles.includes("accepted_samples/accepted_sample_registry.yaml") &&
    allowedFiles.includes("accepted_samples/categories/fashion_lookbook_portrait.yaml") &&
    forbiddenPaths.includes("runs/real_generation/") &&
    forbiddenPaths.includes("production_candidate/") &&
    forbiddenPaths.includes("failure_samples/") &&
    forbiddenPaths.includes(".env") &&
    forbiddenPaths.includes(".env.local") &&
    forbiddenPaths.includes("real manifest") &&
    forbiddenPaths.includes("VCPChat") &&
    forbiddenPaths.includes("VCPToolBox") &&
    validationRequired.includes("git diff --check") &&
    validationRequired.includes("node scripts/validate_exact_new_trial_003_accepted_samples_registration_authorization_package_draft.js") &&
    validationRequired.includes("node scripts/validate_controlled_visual_production_loop_checkpoint_readiness.js") &&
    validationRequired.includes("node scripts/validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js") &&
    validationRequired.includes("powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1");

  const noWrites =
    guard.draft_only === true &&
    guard.accepted_samples_write_performed === false &&
    guard.category_index_write_performed === false &&
    guard.image_file_copy_performed === false &&
    guard.runs_source_image_modified === false &&
    guard.failure_samples_write_performed === false &&
    guard.production_candidate_write_performed === false &&
    guard.DailyNote_write_performed === false &&
    guard.VCP_memory_write_performed === false &&
    guard.staging_performed === false &&
    guard.commit_performed === false;

  const noExternal =
    guard.provider_contact_performed === false &&
    guard.plugin_call_performed === false &&
    guard.api_call_performed === false &&
    guard.mcp_runtime_performed === false &&
    guard.real_manifest_read_performed === false &&
    guard.real_vcpchat_read_performed === false &&
    guard.real_vcptoolbox_read_performed === false &&
    guard.push_tag_release_deploy_performed === false;

  const noRuntimeClaim =
    guard.artifact_recoverability_is_not_vcp_runtime_integration === true &&
    guard.vcp_runtime_integration_proven === false;

  return {
    passed: sourceRefsOk && targetOk && statementOk && scopeOk && noWrites && noExternal && noRuntimeClaim,
    sourceRefsOk,
    targetOk,
    statementOk,
    scopeOk,
    noWrites,
    noExternal,
    noRuntimeClaim
  };
}

function validateRecord(record, context) {
  assert(record && typeof record === "object", `${context} missing`);
  assertNoRawLocalDrivePath(record, context);
  const result = evaluate(record);
  assert(result.passed, `${context} evaluation failed: ${JSON.stringify(result)}`);
  assert(record.recommended_next === expected.recommendedNext, `${context}.recommended_next mismatch`);
}

function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validateRecord(candidate, caseId);
  } catch (error) {
    return { case_id: caseId, result: "caught", failure_message: error.message };
  }
  throw new Error(`${caseId} was not caught`);
}

function validateNegativeCases(validRecord, invalidRecord) {
  let invalidFixtureCaught = false;
  try {
    validateRecord(invalidRecord, "invalid_fixture");
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid fixture must fail");

  const cases = [
    expectFailure(validRecord, "granted_package_fails", (candidate) => {
      candidate.authorization_package_status = "granted";
      candidate.authorization_granted_by_this_record = true;
      candidate.blocker = null;
    }),
    expectFailure(validRecord, "execution_ready_without_approval_fails", (candidate) => {
      candidate.execution_ready = true;
      candidate.target.registration_ready = true;
    }),
    expectFailure(validRecord, "missing_exact_statement_fails", (candidate) => {
      candidate.exact_approval_statement_draft = "";
    }),
    expectFailure(validRecord, "broad_write_scope_fails", (candidate) => {
      candidate.draft_scope.would_modify_files.push("accepted_samples/");
    }),
    expectFailure(validRecord, "accepted_samples_write_flag_fails", (candidate) => {
      candidate.guard.accepted_samples_write_performed = true;
    }),
    expectFailure(validRecord, "runtime_claim_fails", (candidate) => {
      candidate.guard.artifact_recoverability_is_not_vcp_runtime_integration = false;
      candidate.guard.vcp_runtime_integration_proven = true;
    })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught")
  };
}

function main() {
  for (const relativePath of Object.values(files)) {
    assert(exists(relativePath), `Missing required file: ${relativePath}`);
  }

  const phaseText = read(files.phaseRecord);
  const mvpText = read(files.mvpValidator);
  const report = readJson(files.report).exact_new_trial_003_accepted_samples_registration_authorization_package_draft;
  const passFixture = readJson(files.passFixture).exact_new_trial_003_accepted_samples_registration_authorization_package_draft;
  const failFixture = readJson(files.failFixture).exact_new_trial_003_accepted_samples_registration_authorization_package_draft;

  for (const token of [
    `phase: ${expected.phase}`,
    expected.sampleId,
    expected.candidateId,
    "authorization_package_status: prepared_blocked_not_granted",
    "authorization_granted_by_this_record: false",
    "execution_ready: false",
    "draft_only: true"
  ]) {
    assert(phaseText.includes(token), `phase record missing token: ${token}`);
  }

  assert(mvpText.includes("scripts/validate_exact_new_trial_003_accepted_samples_registration_authorization_package_draft.js"), "validate_mvp missing new validator");

  validateRecord(report, "report");
  validateRecord(passFixture, "pass_fixture");
  const negativeCases = validateNegativeCases(passFixture, failFixture);

  const summary = {
    phase: expected.phase,
    passed: true,
    target_sample_id: report.target.sample_id,
    target_candidate_id: report.target.candidate_id,
    blocker: report.blocker,
    authorization_package_status: report.authorization_package_status,
    authorization_granted_by_this_record: report.authorization_granted_by_this_record,
    execution_ready: report.execution_ready,
    human_approval_status: report.target.human_approval_status,
    approved_by: report.target.approved_by,
    negative_case_count: negativeCases.negative_case_count,
    caught_negative_case_count: negativeCases.caught_negative_case_count,
    all_negative_cases_caught: negativeCases.all_negative_cases_caught
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
