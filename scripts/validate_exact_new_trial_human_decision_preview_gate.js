#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_6_10_exact_new_trial_human_decision_preview_gate";
const docPath = "docs/V0_6_10_EXACT_NEW_TRIAL_HUMAN_DECISION_PREVIEW_GATE.md";
const schemaPath = "schemas/exact_new_trial_human_decision_preview_gate.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_6_10_exact_new_trial_human_decision_preview_gate.json";
const passFixturePath = "tests/schema_examples/exact_new_trial_human_decision_preview_gate.example.json";
const failFixturePath = "tests/schema_examples/exact_new_trial_human_decision_preview_gate_fail.example.json";
const requestTextPath = "reports/visual_asset_eval_dry_run/v0_6_9_exact_new_trial_request_text_regenerated.json";
const readyCheckpointPath = "reports/visual_asset_eval_dry_run/v0_6_5_ready_for_exact_new_trial_authorization_checkpoint.json";
const monthPlanPath = "docs/V0_6_2_FIRST_MONTH_LIVE_PILOT_RECOVERY_PLAN.md";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";
const packageId = "AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001";
const falseFlags = [
  "provider_call_performed",
  "image_generation_performed",
  "VCP_memory_write_performed",
  "DailyNote_write_performed",
  "runtime_call_performed",
  "secret_value_read_performed",
  "production_candidate_created",
  "accepted_sample_auto_promotion",
  "memory_seed_promoted",
  "package_dependency_change_performed",
  "commit_performed",
  "push_performed"
];

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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertNoSecretOrRawPath(value, context) {
  if (typeof value === "string") {
    assert(!/^[A-Za-z]:[\\/]/.test(value), `Raw local drive path found in ${context}`);
    assert(!/\.env(\.|$)|config\.env/i.test(value), `Secret/env path reference found in ${context}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoSecretOrRawPath(item, `${context}.${index}`));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => assertNoSecretOrRawPath(item, `${context}.${key}`));
  }
}

function assertFalseFlags(container, context) {
  assert(container && typeof container === "object", `${context} missing`);
  for (const flag of falseFlags) {
    assert(container[flag] === false, `${context}.${flag} must remain false`);
  }
}

function validateSources() {
  const requestText = readJson(requestTextPath).exact_new_trial_request_text_regenerated;
  const ready = readJson(readyCheckpointPath).ready_for_exact_new_trial_authorization_checkpoint;
  const monthPlan = read(monthPlanPath);
  assertNoSecretOrRawPath({ requestText, ready, monthPlanPath }, "exact_new_trial_human_decision_preview_gate_sources");
  assert(requestText.phase === "v0_6_9_exact_new_trial_request_text_regenerated", "request text phase mismatch");
  assert(requestText.regeneration_assertions?.copyable_exact_request_text_present === true, "request text must remain copyable");
  assert(requestText.regeneration_assertions?.human_approval_phrase_received === false, "request text must not record a human approval phrase");
  assert(requestText.regeneration_assertions?.request_not_submitted === true, "request text must remain unsubmitted");
  assert(ready.phase === "v0_6_5_ready_for_exact_new_trial_authorization_checkpoint", "ready checkpoint phase mismatch");
  assert(ready.checkpoint_assertions?.ready_for_exact_new_trial_authorization === true, "ready checkpoint must preserve authorization readiness");
  assert(monthPlan.includes("Batch B - Days 16 to 30"), "month plan must keep Batch B context");
  assert(monthPlan.includes("no_new_A5_authorization -> ready_for_exact_new_trial_authorization"), "month plan must keep no-new-A5 branch");
}

function validateRecord(record) {
  assert(record && typeof record === "object", "exact new-trial human decision preview gate missing");
  assertNoSecretOrRawPath(record, "exact_new_trial_human_decision_preview_gate");
  assert(record.authorization_package_id === packageId, "authorization_package_id mismatch");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  assert(record.source_exact_request_text_regenerated_ref === requestTextPath, "source_exact_request_text_regenerated_ref mismatch");
  assert(record.source_ready_for_exact_new_trial_authorization_checkpoint_ref === readyCheckpointPath, "source_ready_for_exact_new_trial_authorization_checkpoint_ref mismatch");
  assert(record.source_month_plan_ref === monthPlanPath, "source_month_plan_ref mismatch");

  validateSources();

  const status = record.decision_preview_status;
  assert(status.authorization_status === "draft_not_submitted", "authorization_status must remain draft_not_submitted");
  assert(status.approval_status === "not_requested", "approval_status must remain not_requested");
  assert(status.preview_only === true, "preview_only must remain true");
  assert(status.human_decision_recorded === false, "human_decision_recorded must remain false");
  assert(status.selected_option === "not_selected", "selected_option must remain not_selected");
  assert(status.submit_requested === false, "submit_requested must remain false");
  assert(status.execute_requested === false, "execute_requested must remain false");

  const keepDraft = record.decision_preview_options?.keep_draft_unissued;
  const futureIssue = record.decision_preview_options?.future_issue_phrase_in_separate_human_turn_only;
  const decline = record.decision_preview_options?.decline_current_wording_and_return_to_local_revision;
  assert(keepDraft?.option_available === true, "keep_draft_unissued.option_available must be true");
  assert(keepDraft?.preserves_not_requested === true, "keep_draft_unissued.preserves_not_requested must be true");
  assert(keepDraft?.preserves_not_submitted === true, "keep_draft_unissued.preserves_not_submitted must be true");
  assert(keepDraft?.preserves_non_executable === true, "keep_draft_unissued.preserves_non_executable must be true");
  assert(futureIssue?.option_available === true, "future issue option must be available");
  assert(futureIssue?.requires_explicit_human_phrase_turn === true, "future issue option must require a human phrase turn");
  assert(futureIssue?.does_not_submit_by_itself === true, "future issue option must not submit by itself");
  assert(futureIssue?.does_not_execute_by_itself === true, "future issue option must not execute by itself");
  assert(decline?.option_available === true, "decline option must be available");
  assert(decline?.returns_to_local_revision_route === true, "decline option must return to local revision");
  assert(decline?.does_not_submit === true, "decline option must not submit");
  assert(decline?.does_not_execute === true, "decline option must not execute");

  const assertions = record.decision_preview_assertions;
  assert(assertions.copyable_exact_request_text_available === true, "copyable_exact_request_text_available must remain true");
  assert(assertions.human_decision_still_required === true, "human_decision_still_required must remain true");
  assert(assertions.no_option_auto_selected === true, "no_option_auto_selected must remain true");
  assert(assertions.request_not_submitted === true, "request_not_submitted must remain true");
  assert(assertions.can_submit_now === false, "can_submit_now must remain false");
  assert(assertions.can_execute_now === false, "can_execute_now must remain false");
  assert(assertions.any_real_approval_phrase_received === false, "any_real_approval_phrase_received must remain false");
  assert(assertions.future_submit_step_still_separate === true, "future_submit_step_still_separate must remain true");
  assert(assertions.future_execute_step_still_separate === true, "future_execute_step_still_separate must remain true");

  const boundary = record.human_decision_boundary;
  assert(boundary.issuing_the_exact_phrase_is_not_performed_in_this_phase === true, "exact phrase issuance must not be performed in this phase");
  assert(boundary.submission_is_not_performed_in_this_phase === true, "submission must not be performed in this phase");
  assert(boundary.provider_execution_is_not_performed_in_this_phase === true, "provider execution must not be performed in this phase");
  assert(boundary.human_turn_required_before_any_status_change === true, "human turn must be required before any status change");
  assert(boundary.human_turn_required_before_any_submit_request === true, "human turn must be required before any submit request");
  assert(boundary.human_turn_required_before_any_execute_request === true, "human turn must be required before any execute request");

  assert(Array.isArray(record.next_route_options) && record.next_route_options.length >= 3, "next_route_options required");
  assert(record.next_route_options.every((item) => !/^(submit_now|execute_real_generation_now|provider_call_now)$/i.test(item)), "next route options must not authorize submission or execution");

  assert(record.boundaries?.metadata_only === true, "metadata_only must remain true");
  assert(record.boundaries?.preview_only === true, "boundary preview_only must remain true");
  assert(record.boundaries?.human_decision_recorded === false, "boundary human_decision_recorded must remain false");
  assert(record.boundaries?.request_not_submitted === true, "boundary request_not_submitted must remain true");
  assert(record.boundaries?.can_submit_now === false, "boundary can_submit_now must remain false");
  assert(record.boundaries?.can_execute_now === false, "boundary can_execute_now must remain false");
  assert(record.boundaries?.real_executor_implemented_now === false, "real_executor_implemented_now must remain false");
  assert(record.boundaries?.Push_L2_exercised === false, "Push_L2_exercised must remain false");
  assertFalseFlags(record.boundaries, "boundaries");
  assertFalseFlags(record.side_effects, "side_effects");
}

function expectFailure(baseRecord, caseId, mutate) {
  const candidate = clone(baseRecord);
  mutate(candidate);
  try {
    validateRecord(candidate);
  } catch (error) {
    return { case_id: caseId, result: "caught", failure_message: error.message };
  }
  throw new Error(`${caseId} was not caught`);
}

function validateNegativeCases(validRecord, invalidRecord) {
  let invalidFixtureCaught = false;
  try {
    validateRecord(invalidRecord);
  } catch {
    invalidFixtureCaught = true;
  }
  assert(invalidFixtureCaught, "invalid human decision preview fixture must fail");

  const cases = [
    expectFailure(validRecord, "preview_only_false_fails", (candidate) => { candidate.decision_preview_status.preview_only = false; }),
    expectFailure(validRecord, "human_decision_recorded_true_fails", (candidate) => { candidate.decision_preview_status.human_decision_recorded = true; }),
    expectFailure(validRecord, "selected_option_changed_fails", (candidate) => { candidate.decision_preview_status.selected_option = "keep_draft_unissued"; }),
    expectFailure(validRecord, "submit_requested_true_fails", (candidate) => { candidate.decision_preview_status.submit_requested = true; }),
    expectFailure(validRecord, "execute_requested_true_fails", (candidate) => { candidate.decision_preview_status.execute_requested = true; }),
    expectFailure(validRecord, "future_issue_no_human_turn_fails", (candidate) => { candidate.decision_preview_options.future_issue_phrase_in_separate_human_turn_only.requires_explicit_human_phrase_turn = false; }),
    expectFailure(validRecord, "future_issue_submits_by_itself_fails", (candidate) => { candidate.decision_preview_options.future_issue_phrase_in_separate_human_turn_only.does_not_submit_by_itself = false; }),
    expectFailure(validRecord, "future_issue_executes_by_itself_fails", (candidate) => { candidate.decision_preview_options.future_issue_phrase_in_separate_human_turn_only.does_not_execute_by_itself = false; }),
    expectFailure(validRecord, "copyable_text_false_fails", (candidate) => { candidate.decision_preview_assertions.copyable_exact_request_text_available = false; }),
    expectFailure(validRecord, "human_decision_required_false_fails", (candidate) => { candidate.decision_preview_assertions.human_decision_still_required = false; }),
    expectFailure(validRecord, "no_option_auto_selected_false_fails", (candidate) => { candidate.decision_preview_assertions.no_option_auto_selected = false; }),
    expectFailure(validRecord, "request_not_submitted_false_fails", (candidate) => { candidate.decision_preview_assertions.request_not_submitted = false; }),
    expectFailure(validRecord, "can_submit_true_fails", (candidate) => { candidate.decision_preview_assertions.can_submit_now = true; }),
    expectFailure(validRecord, "can_execute_true_fails", (candidate) => { candidate.decision_preview_assertions.can_execute_now = true; }),
    expectFailure(validRecord, "approval_phrase_received_true_fails", (candidate) => { candidate.decision_preview_assertions.any_real_approval_phrase_received = true; }),
    expectFailure(validRecord, "future_submit_not_separate_fails", (candidate) => { candidate.decision_preview_assertions.future_submit_step_still_separate = false; }),
    expectFailure(validRecord, "future_execute_not_separate_fails", (candidate) => { candidate.decision_preview_assertions.future_execute_step_still_separate = false; }),
    expectFailure(validRecord, "boundary_status_change_allowed_fails", (candidate) => { candidate.human_decision_boundary.human_turn_required_before_any_status_change = false; }),
    expectFailure(validRecord, "boundary_submit_allowed_fails", (candidate) => { candidate.human_decision_boundary.human_turn_required_before_any_submit_request = false; }),
    expectFailure(validRecord, "boundary_execute_allowed_fails", (candidate) => { candidate.human_decision_boundary.human_turn_required_before_any_execute_request = false; }),
    expectFailure(validRecord, "next_route_submission_fails", (candidate) => { candidate.next_route_options = ["submit_now"]; }),
    expectFailure(validRecord, "provider_call_true_fails", (candidate) => { candidate.side_effects.provider_call_performed = true; }),
    expectFailure(validRecord, "image_generation_true_fails", (candidate) => { candidate.side_effects.image_generation_performed = true; }),
    expectFailure(validRecord, "raw_local_path_fails", (candidate) => { candidate.authorization_package_id = "C:\\private\\AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001"; }),
    expectFailure(validRecord, "secret_env_path_fails", (candidate) => { candidate.authorization_package_id = ".env.local"; })
  ];

  return {
    invalid_fixture_failure_caught: invalidFixtureCaught,
    negative_case_count: cases.length,
    caught_negative_case_count: cases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: cases.every((item) => item.result === "caught")
  };
}

function main() {
  const doc = read(docPath);
  const schema = read(schemaPath);
  const mvp = read(mvpPath);
  const slice = read(slicePath);
  const reportRecord = readJson(reportPath).exact_new_trial_human_decision_preview_gate;
  const validRecord = readJson(passFixturePath).exact_new_trial_human_decision_preview_gate;
  const invalidRecord = readJson(failFixturePath).exact_new_trial_human_decision_preview_gate;

  for (const token of [
    `authorization_package_id: ${packageId}`,
    "authorization_status: draft_not_submitted",
    "approval_status: not_requested",
    "human_decision_recorded: false",
    "selected_option: not_selected",
    "submit_requested: false",
    "execute_requested: false",
    "human_decision_still_required: true",
    "can_submit_now: false",
    "can_execute_now: false",
    "future_issue_phrase_in_separate_human_turn_only",
    "decline_current_wording_and_return_to_local_revision"
  ]) {
    assert(doc.includes(token), `human decision preview doc missing token: ${token}`);
  }

  assert(schema.includes("exact_new_trial_human_decision_preview_gate"), "schema must define exact_new_trial_human_decision_preview_gate");
  assert(mvp.includes("validate_exact_new_trial_human_decision_preview_gate.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_6_10_EXACT_NEW_TRIAL_HUMAN_DECISION_PREVIEW_GATE_SLICE"), "exact-slice wiring missing");

  validateRecord(reportRecord);
  validateRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_exact_new_trial_human_decision_preview_gate",
    phase,
    human_decision_preview_doc_present: true,
    human_decision_preview_schema_present: true,
    human_decision_preview_report_present: true,
    human_decision_preview_fixture_present: true,
    human_decision_preview_fail_fixture_present: true,
    authorization_package_id: packageId,
    authorization_status: "draft_not_submitted",
    approval_status: "not_requested",
    preview_only: true,
    human_decision_recorded: false,
    selected_option: "not_selected",
    submit_requested: false,
    execute_requested: false,
    copyable_exact_request_text_available: true,
    human_decision_still_required: true,
    no_option_auto_selected: true,
    request_not_submitted: true,
    any_real_approval_phrase_received: false,
    future_submit_step_still_separate: true,
    future_execute_step_still_separate: true,
    metadata_only: true,
    can_submit_now: false,
    can_execute_now: false,
    provider_call_performed: false,
    image_generation_performed: false,
    VCP_memory_write_performed: false,
    DailyNote_write_performed: false,
    runtime_call_performed: false,
    secret_value_read_performed: false,
    production_candidate_created: false,
    accepted_sample_auto_promotion: false,
    memory_seed_promoted: false,
    real_executor_implemented_now: false,
    Push_L2_exercised: false,
    package_dependency_change_performed: false,
    commit_performed: false,
    push_performed: false,
    negative_case_count: negativeCaseSummary.negative_case_count,
    caught_negative_case_count: negativeCaseSummary.caught_negative_case_count,
    all_negative_cases_caught: negativeCaseSummary.all_negative_cases_caught
  };

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
