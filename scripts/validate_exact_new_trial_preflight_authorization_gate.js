#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_6_11_exact_new_trial_preflight_authorization_gate";
const docPath = "docs/V0_6_11_EXACT_NEW_TRIAL_PREFLIGHT_AUTHORIZATION_GATE.md";
const schemaPath = "schemas/exact_new_trial_preflight_authorization_gate.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_6_11_exact_new_trial_preflight_authorization_gate.json";
const passFixturePath = "tests/schema_examples/exact_new_trial_preflight_authorization_gate.example.json";
const failFixturePath = "tests/schema_examples/exact_new_trial_preflight_authorization_gate_fail.example.json";
const requestTextPath = "reports/visual_asset_eval_dry_run/v0_6_9_exact_new_trial_request_text_regenerated.json";
const humanDecisionPreviewPath = "reports/visual_asset_eval_dry_run/v0_6_10_exact_new_trial_human_decision_preview_gate.json";
const readyCheckpointPath = "reports/visual_asset_eval_dry_run/v0_6_5_ready_for_exact_new_trial_authorization_checkpoint.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";
const packageId = "AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001";
const exactPhrase = "批准进入 AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001 A5 preflight：使用 Codex 内置 image generation，命令 generate，provider_route=image_gen.imagegen，model=managed_by_codex_image_tool，prompt_package_ref=prompts/image_generation/safe_adult_editorial_portrait_v1.yaml，output_directory=runs/real_generation/v0_3_3_exact_new_trial_001/，receipt_path=reports/provider_receipts/v0_3_3_exact_new_trial_001_receipt.json，registry_path=reports/provider_receipts/v0_3_3_exact_new_trial_001_registry.json，review_console_bridge_ref=review_console/live_receipt_bridge/v0_3_3_exact_new_trial_001，max_provider_calls=1，max_image_candidates=1，retry_limit=0；仅运行 preflight，不调用 provider，不生成图片，不读取任何 env 密钥值，不写 DailyNote，不写 VCP memory，不 push/tag/release/deploy；审批人 Jenn。";
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
  const humanDecisionPreview = readJson(humanDecisionPreviewPath).exact_new_trial_human_decision_preview_gate;
  const ready = readJson(readyCheckpointPath).ready_for_exact_new_trial_authorization_checkpoint;
  assertNoSecretOrRawPath({ requestText, humanDecisionPreview, ready }, "exact_new_trial_preflight_authorization_gate_sources");
  assert(requestText.phase === "v0_6_9_exact_new_trial_request_text_regenerated", "request text phase mismatch");
  assert(requestText.regenerated_request_text?.approval_phrase_draft === exactPhrase, "request text exact phrase mismatch");
  assert(requestText.regeneration_assertions?.human_approval_phrase_received === false, "request text must not pre-record approval");
  assert(humanDecisionPreview.phase === "v0_6_10_exact_new_trial_human_decision_preview_gate", "human decision preview phase mismatch");
  assert(humanDecisionPreview.decision_preview_status?.human_decision_recorded === false, "human decision preview must remain preview-only");
  assert(ready.phase === "v0_6_5_ready_for_exact_new_trial_authorization_checkpoint", "ready checkpoint phase mismatch");
  assert(ready.checkpoint_assertions?.ready_for_exact_new_trial_authorization === true, "ready checkpoint must remain true");
}

function validateRecord(record) {
  assert(record && typeof record === "object", "exact new-trial preflight authorization gate missing");
  assertNoSecretOrRawPath(record, "exact_new_trial_preflight_authorization_gate");
  assert(record.authorization_package_id === packageId, "authorization_package_id mismatch");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  assert(record.source_exact_request_text_regenerated_ref === requestTextPath, "source_exact_request_text_regenerated_ref mismatch");
  assert(record.source_human_decision_preview_gate_ref === humanDecisionPreviewPath, "source_human_decision_preview_gate_ref mismatch");
  assert(record.source_ready_for_exact_new_trial_authorization_checkpoint_ref === readyCheckpointPath, "source_ready_for_exact_new_trial_authorization_checkpoint_ref mismatch");

  validateSources();

  const status = record.authorization_status_record;
  assert(status.authorization_status === "approved_for_metadata_only_preflight", "authorization_status must remain approved_for_metadata_only_preflight");
  assert(status.approval_status === "approved_for_preflight_only", "approval_status must remain approved_for_preflight_only");
  assert(status.approved_by === "Jenn", "approved_by must remain Jenn");
  assert(status.approved_at_local === "2026-05-23", "approved_at_local must remain 2026-05-23");
  assert(status.approval_source === "explicit_user_chat_instruction_real_authorization", "approval_source mismatch");
  assert(status.exact_approval_phrase_received === true, "exact_approval_phrase_received must remain true");
  assert(status.preflight_authorization_received === true, "preflight_authorization_received must remain true");
  assert(status.preflight_authorization_consumed === false, "preflight_authorization_consumed must remain false");
  assert(status.active === true, "active must remain true");
  assert(status.execute_now === false, "execute_now must remain false");

  const phrase = record.issued_exact_approval_phrase;
  assert(phrase.exact_phrase_text === exactPhrase, "exact_phrase_text mismatch");
  assert(phrase.matches_v0_6_9_regenerated_request_text === true, "matches_v0_6_9_regenerated_request_text must remain true");

  const scope = record.authorization_scope;
  assert(scope.preflight_only === true, "preflight_only must remain true");
  assert(scope.local_preflight_allowed_now === true, "local_preflight_allowed_now must remain true");
  for (const key of [
    "provider_contact_allowed_now",
    "plugin_call_allowed_now",
    "api_call_allowed_now",
    "image_generation_allowed_now",
    "output_directory_creation_allowed_now",
    "receipt_write_allowed_now",
    "registry_write_allowed_now",
    "DailyNote_write_allowed_now",
    "VCP_memory_write_allowed_now",
    "runtime_execution_allowed_now",
    "real_manifest_read_allowed_now",
    "real_VCPChat_read_allowed_now",
    "real_VCPToolBox_read_allowed_now"
  ]) {
    assert(scope[key] === false, `${key} must remain false`);
  }

  const assertions = record.authorization_assertions;
  assert(assertions.real_human_authorization_recorded === true, "real_human_authorization_recorded must remain true");
  assert(assertions.human_decision_recorded === true, "human_decision_recorded must remain true");
  assert(assertions.selected_option === "issue_exact_phrase_for_preflight_only", "selected_option mismatch");
  assert(assertions.request_not_submitted === true, "request_not_submitted must remain true");
  assert(assertions.preflight_allowed_now === true, "preflight_allowed_now must remain true");
  assert(assertions.can_execute_now === false, "can_execute_now must remain false");
  assert(assertions.generation_execution_authorized_by_this_record === false, "generation_execution_authorized_by_this_record must remain false");
  assert(assertions.future_provider_execution_requires_new_step === true, "future_provider_execution_requires_new_step must remain true");
  assert(assertions.future_image_generation_requires_new_step === true, "future_image_generation_requires_new_step must remain true");

  assert(Array.isArray(record.next_route_options) && record.next_route_options.length >= 3, "next_route_options required");
  assert(record.next_route_options.every((item) => !/^(submit_now|execute_real_generation_now|provider_call_now)$/i.test(item)), "next route options must not authorize execution");

  assert(record.boundaries?.metadata_only === true, "metadata_only must remain true");
  assert(record.boundaries?.request_not_submitted === true, "boundary request_not_submitted must remain true");
  assert(record.boundaries?.preflight_allowed_now === true, "boundary preflight_allowed_now must remain true");
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
  assert(invalidFixtureCaught, "invalid preflight authorization gate fixture must fail");

  const cases = [
    expectFailure(validRecord, "authorization_status_changed_fails", (candidate) => { candidate.authorization_status_record.authorization_status = "active_execution"; }),
    expectFailure(validRecord, "approval_status_changed_fails", (candidate) => { candidate.authorization_status_record.approval_status = "approved"; }),
    expectFailure(validRecord, "approved_by_changed_fails", (candidate) => { candidate.authorization_status_record.approved_by = "Other"; }),
    expectFailure(validRecord, "phrase_not_received_fails", (candidate) => { candidate.authorization_status_record.exact_approval_phrase_received = false; }),
    expectFailure(validRecord, "preflight_not_received_fails", (candidate) => { candidate.authorization_status_record.preflight_authorization_received = false; }),
    expectFailure(validRecord, "preflight_consumed_true_fails", (candidate) => { candidate.authorization_status_record.preflight_authorization_consumed = true; }),
    expectFailure(validRecord, "active_false_fails", (candidate) => { candidate.authorization_status_record.active = false; }),
    expectFailure(validRecord, "execute_now_true_fails", (candidate) => { candidate.authorization_status_record.execute_now = true; }),
    expectFailure(validRecord, "phrase_mismatch_fails", (candidate) => { candidate.issued_exact_approval_phrase.exact_phrase_text = "altered"; }),
    expectFailure(validRecord, "scope_not_preflight_only_fails", (candidate) => { candidate.authorization_scope.preflight_only = false; }),
    expectFailure(validRecord, "local_preflight_false_fails", (candidate) => { candidate.authorization_scope.local_preflight_allowed_now = false; }),
    expectFailure(validRecord, "provider_contact_true_fails", (candidate) => { candidate.authorization_scope.provider_contact_allowed_now = true; }),
    expectFailure(validRecord, "image_generation_true_fails", (candidate) => { candidate.authorization_scope.image_generation_allowed_now = true; }),
    expectFailure(validRecord, "output_creation_true_fails", (candidate) => { candidate.authorization_scope.output_directory_creation_allowed_now = true; }),
    expectFailure(validRecord, "decision_not_recorded_fails", (candidate) => { candidate.authorization_assertions.human_decision_recorded = false; }),
    expectFailure(validRecord, "selected_option_changed_fails", (candidate) => { candidate.authorization_assertions.selected_option = "keep_draft_unissued"; }),
    expectFailure(validRecord, "request_submitted_fails", (candidate) => { candidate.authorization_assertions.request_not_submitted = false; }),
    expectFailure(validRecord, "preflight_allowed_false_fails", (candidate) => { candidate.authorization_assertions.preflight_allowed_now = false; }),
    expectFailure(validRecord, "can_execute_true_fails", (candidate) => { candidate.authorization_assertions.can_execute_now = true; }),
    expectFailure(validRecord, "generation_authorized_true_fails", (candidate) => { candidate.authorization_assertions.generation_execution_authorized_by_this_record = true; }),
    expectFailure(validRecord, "future_provider_step_false_fails", (candidate) => { candidate.authorization_assertions.future_provider_execution_requires_new_step = false; }),
    expectFailure(validRecord, "future_image_step_false_fails", (candidate) => { candidate.authorization_assertions.future_image_generation_requires_new_step = false; }),
    expectFailure(validRecord, "next_route_submission_fails", (candidate) => { candidate.next_route_options = ["submit_now"]; }),
    expectFailure(validRecord, "provider_call_performed_true_fails", (candidate) => { candidate.side_effects.provider_call_performed = true; }),
    expectFailure(validRecord, "image_generation_performed_true_fails", (candidate) => { candidate.side_effects.image_generation_performed = true; }),
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
  const reportRecord = readJson(reportPath).exact_new_trial_preflight_authorization_gate;
  const validRecord = readJson(passFixturePath).exact_new_trial_preflight_authorization_gate;
  const invalidRecord = readJson(failFixturePath).exact_new_trial_preflight_authorization_gate;

  for (const token of [
    `authorization_package_id: ${packageId}`,
    "authorization_status: approved_for_metadata_only_preflight",
    "approval_status: approved_for_preflight_only",
    "approved_by: Jenn",
    "approved_at_local: 2026-05-23",
    "exact_approval_phrase_received: true",
    "preflight_authorization_received: true",
    "preflight_authorization_consumed: false",
    "preflight_only: true",
    "local_preflight_allowed_now: true",
    "can_execute_now: false",
    exactPhrase
  ]) {
    assert(doc.includes(token), `preflight authorization gate doc missing token: ${token}`);
  }

  assert(schema.includes("exact_new_trial_preflight_authorization_gate"), "schema must define exact_new_trial_preflight_authorization_gate");
  assert(mvp.includes("validate_exact_new_trial_preflight_authorization_gate.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_6_11_EXACT_NEW_TRIAL_PREFLIGHT_AUTHORIZATION_GATE_SLICE"), "exact-slice wiring missing");

  validateRecord(reportRecord);
  validateRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_exact_new_trial_preflight_authorization_gate",
    phase,
    preflight_authorization_doc_present: true,
    preflight_authorization_schema_present: true,
    preflight_authorization_report_present: true,
    preflight_authorization_fixture_present: true,
    preflight_authorization_fail_fixture_present: true,
    authorization_package_id: packageId,
    authorization_status: "approved_for_metadata_only_preflight",
    approval_status: "approved_for_preflight_only",
    approved_by: "Jenn",
    approved_at_local: "2026-05-23",
    exact_approval_phrase_received: true,
    preflight_authorization_received: true,
    preflight_authorization_consumed: false,
    active: true,
    execute_now: false,
    preflight_only: true,
    local_preflight_allowed_now: true,
    provider_contact_allowed_now: false,
    image_generation_allowed_now: false,
    request_not_submitted: true,
    preflight_allowed_now: true,
    can_execute_now: false,
    generation_execution_authorized_by_this_record: false,
    future_provider_execution_requires_new_step: true,
    future_image_generation_requires_new_step: true,
    metadata_only: true,
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
