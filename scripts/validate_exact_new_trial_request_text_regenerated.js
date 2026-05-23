#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_6_9_exact_new_trial_request_text_regenerated";
const docPath = "docs/V0_6_9_EXACT_NEW_TRIAL_REQUEST_TEXT_REGENERATED.md";
const schemaPath = "schemas/exact_new_trial_request_text_regenerated.schema.yaml";
const reportPath = "reports/visual_asset_eval_dry_run/v0_6_9_exact_new_trial_request_text_regenerated.json";
const passFixturePath = "tests/schema_examples/exact_new_trial_request_text_regenerated.example.json";
const failFixturePath = "tests/schema_examples/exact_new_trial_request_text_regenerated_fail.example.json";
const fieldResolutionPath = "reports/visual_asset_eval_dry_run/v0_6_8_exact_new_trial_intake_field_resolution.json";
const draftPath = "reports/visual_asset_eval_dry_run/v0_6_6_exact_new_trial_a5_request_draft.json";
const authPacketPath = "reports/visual_asset_eval_dry_run/v0_6_0_first_controlled_generation_authorization_packet.json";
const mvpPath = "scripts/validate_mvp.ps1";
const slicePath = "scripts/lib/governance_tooling_maintenance_slice.js";
const packageId = "AUTH-PENDING-V0-3-3-EXACT-NEW-TRIAL-20260523-001";
const selectedPrompt = "prompts/image_generation/safe_adult_editorial_portrait_v1.yaml";
const selectedOutputDirectory = "runs/real_generation/v0_3_3_exact_new_trial_001/";
const selectedReceiptPath = "reports/provider_receipts/v0_3_3_exact_new_trial_001_receipt.json";
const selectedRegistryPath = "reports/provider_receipts/v0_3_3_exact_new_trial_001_registry.json";
const selectedBridgeRef = "review_console/live_receipt_bridge/v0_3_3_exact_new_trial_001";
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
  const fieldResolution = readJson(fieldResolutionPath).exact_new_trial_intake_field_resolution;
  const draft = readJson(draftPath).exact_new_trial_a5_request_draft;
  const auth = readJson(authPacketPath).first_controlled_generation_authorization_packet;
  assertNoSecretOrRawPath({ fieldResolution, draft, auth }, "exact_new_trial_request_text_regenerated_sources");
  assert(fieldResolution.phase === "v0_6_8_exact_new_trial_intake_field_resolution", "field resolution phase mismatch");
  assert(fieldResolution.pre_submission_assertions?.all_five_exact_fields_resolved_locally === true, "field resolution must confirm all five exact fields resolved");
  assert(fieldResolution.resolved_exact_fields?.prompt_package_ref_or_override?.selected_value === selectedPrompt, "field resolution selected prompt mismatch");
  assert(fieldResolution.resolved_exact_fields?.output_directory?.selected_value === selectedOutputDirectory, "field resolution output directory mismatch");
  assert(fieldResolution.resolved_exact_fields?.receipt_path?.selected_value === selectedReceiptPath, "field resolution receipt path mismatch");
  assert(fieldResolution.resolved_exact_fields?.registry_path?.selected_value === selectedRegistryPath, "field resolution registry path mismatch");
  assert(fieldResolution.resolved_exact_fields?.review_console_bridge_ref?.selected_value === selectedBridgeRef, "field resolution bridge ref mismatch");
  assert(draft.phase === "v0_6_6_exact_new_trial_a5_request_draft", "draft phase mismatch");
  assert(draft.exact_approval_phrase_draft?.draft_uses_placeholders_only === true, "draft must remain placeholder-based");
  assert(auth.phase === "v0_6_0_first_controlled_generation_authorization_packet", "authorization packet phase mismatch");
  assert(auth.exact_call_count?.configured_limit === 1, "authorization packet exact call count must remain 1");
}

function validateRecord(record) {
  assert(record && typeof record === "object", "exact new-trial request text regenerated missing");
  assertNoSecretOrRawPath(record, "exact_new_trial_request_text_regenerated");
  assert(record.authorization_package_id === packageId, "authorization_package_id mismatch");
  assert(record.version === "v0_1", "version mismatch");
  assert(record.phase === phase, "phase mismatch");
  assert(record.source_field_resolution_ref === fieldResolutionPath, "source_field_resolution_ref mismatch");
  assert(record.source_exact_new_trial_a5_request_draft_ref === draftPath, "source_exact_new_trial_a5_request_draft_ref mismatch");
  assert(record.source_first_controlled_generation_authorization_packet_ref === authPacketPath, "source_first_controlled_generation_authorization_packet_ref mismatch");

  validateSources();

  const status = record.regeneration_status;
  assert(status.authorization_status === "draft_not_submitted", "authorization_status must remain draft_not_submitted");
  assert(status.approval_status === "not_requested", "approval_status must remain not_requested");
  assert(status.active === false, "active must remain false");
  assert(status.execute_now === false, "execute_now must remain false");
  assert(status.submit_ready === false, "submit_ready must remain false");
  assert(status.exact_request_text_regenerated === true, "exact_request_text_regenerated must remain true");
  assert(status.request_text_regeneration_only === true, "request_text_regeneration_only must remain true");

  const regenerated = record.regenerated_request_text;
  assert(regenerated.approval_phrase_draft === exactPhrase, "approval_phrase_draft mismatch");
  assert(regenerated.contains_placeholder_tokens === false, "contains_placeholder_tokens must remain false");
  assert(!/[<][^>]+[>]/.test(regenerated.approval_phrase_draft), "approval_phrase_draft must not contain placeholder tokens");
  assert(regenerated.prompt_package_ref === selectedPrompt, "prompt_package_ref mismatch");
  assert(regenerated.output_directory === selectedOutputDirectory, "output_directory mismatch");
  assert(regenerated.receipt_path === selectedReceiptPath, "receipt_path mismatch");
  assert(regenerated.registry_path === selectedRegistryPath, "registry_path mismatch");
  assert(regenerated.review_console_bridge_ref === selectedBridgeRef, "review_console_bridge_ref mismatch");
  for (const token of [selectedPrompt, selectedOutputDirectory, selectedReceiptPath, selectedRegistryPath, selectedBridgeRef, "max_provider_calls=1", "max_image_candidates=1", "retry_limit=0"]) {
    assert(regenerated.approval_phrase_draft.includes(token), `approval phrase missing token: ${token}`);
  }

  const assertions = record.regeneration_assertions;
  assert(assertions.copyable_exact_request_text_present === true, "copyable_exact_request_text_present must remain true");
  assert(assertions.placeholders_remaining === false, "placeholders_remaining must remain false");
  assert(assertions.request_text_matches_v0_6_8_resolved_values === true, "request_text_matches_v0_6_8_resolved_values must remain true");
  assert(assertions.exact_request_text_regenerated === true, "regeneration_assertions.exact_request_text_regenerated must remain true");
  assert(assertions.human_approval_phrase_received === false, "human_approval_phrase_received must remain false");
  assert(assertions.human_send_step_still_required === true, "human_send_step_still_required must remain true");
  assert(assertions.request_not_submitted === true, "request_not_submitted must remain true");
  assert(assertions.can_submit_now === false, "can_submit_now must remain false");
  assert(assertions.can_execute_now === false, "can_execute_now must remain false");

  const fixed = record.fixed_constraints_confirmation;
  assert(fixed.provider_target === "codex_builtin_image_generation", "provider_target mismatch");
  assert(fixed.plugin_id_or_provider_route === "image_gen.imagegen", "plugin_id_or_provider_route mismatch");
  assert(fixed.model === "managed_by_codex_image_tool", "model mismatch");
  assert(fixed.command === "generate", "command mismatch");
  assert(fixed.exact_call_count === 1, "exact_call_count must remain 1");
  assert(fixed.max_image_candidates === 1, "max_image_candidates must remain 1");
  assert(fixed.retry_limit === 0, "retry_limit must remain 0");
  assert(fixed.review_required_after_generation === true, "review_required_after_generation must remain true");
  assert(fixed.no_memory_write_default === true, "no_memory_write_default must remain true");
  assert(fixed.overwrite_existing_files_allowed === false, "overwrite_existing_files_allowed must remain false");

  assert(Array.isArray(record.next_route_options) && record.next_route_options.length >= 3, "next_route_options required");
  assert(record.next_route_options.every((item) => !/^(submit_now|execute_real_generation_now|provider_call_now)$/i.test(item)), "next route options must not authorize submission or execution");

  assert(record.boundaries?.metadata_only === true, "metadata_only must be true");
  assert(record.boundaries?.request_text_regeneration_only === true, "request_text_regeneration_only must be true");
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
  assert(invalidFixtureCaught, "invalid regenerated request text fixture must fail");

  const cases = [
    expectFailure(validRecord, "active_true_fails", (candidate) => { candidate.regeneration_status.active = true; }),
    expectFailure(validRecord, "submit_ready_true_fails", (candidate) => { candidate.regeneration_status.submit_ready = true; }),
    expectFailure(validRecord, "request_text_regeneration_only_false_fails", (candidate) => { candidate.regeneration_status.request_text_regeneration_only = false; }),
    expectFailure(validRecord, "placeholder_reintroduced_fails", (candidate) => { candidate.regenerated_request_text.contains_placeholder_tokens = true; }),
    expectFailure(validRecord, "prompt_placeholder_text_fails", (candidate) => { candidate.regenerated_request_text.approval_phrase_draft = candidate.regenerated_request_text.approval_phrase_draft.replace(selectedPrompt, "<new_prompt_package_ref_under_prompts_image_generation_or_exact_override_statement>"); }),
    expectFailure(validRecord, "prompt_mismatch_fails", (candidate) => { candidate.regenerated_request_text.prompt_package_ref = "prompts/image_generation/fashion_night_balcony_vertical_portrait_v1.yaml"; }),
    expectFailure(validRecord, "output_mismatch_fails", (candidate) => { candidate.regenerated_request_text.output_directory = "runs/real_generation/v0_3_3_safe_portrait_001/"; }),
    expectFailure(validRecord, "receipt_mismatch_fails", (candidate) => { candidate.regenerated_request_text.receipt_path = "reports/provider_receipts/v0_3_3_safe_portrait_001_receipt.json"; }),
    expectFailure(validRecord, "registry_mismatch_fails", (candidate) => { candidate.regenerated_request_text.registry_path = "reports/provider_receipts/provider_receipt_registry.json"; }),
    expectFailure(validRecord, "bridge_wrong_root_fails", (candidate) => { candidate.regenerated_request_text.review_console_bridge_ref = "docs/live_bridge.md"; }),
    expectFailure(validRecord, "human_phrase_received_true_fails", (candidate) => { candidate.regeneration_assertions.human_approval_phrase_received = true; }),
    expectFailure(validRecord, "request_not_submitted_false_fails", (candidate) => { candidate.regeneration_assertions.request_not_submitted = false; }),
    expectFailure(validRecord, "can_submit_true_fails", (candidate) => { candidate.regeneration_assertions.can_submit_now = true; }),
    expectFailure(validRecord, "can_execute_true_fails", (candidate) => { candidate.regeneration_assertions.can_execute_now = true; }),
    expectFailure(validRecord, "exact_call_count_gt_1_fails", (candidate) => { candidate.fixed_constraints_confirmation.exact_call_count = 2; }),
    expectFailure(validRecord, "retry_limit_nonzero_fails", (candidate) => { candidate.fixed_constraints_confirmation.retry_limit = 1; }),
    expectFailure(validRecord, "review_required_false_fails", (candidate) => { candidate.fixed_constraints_confirmation.review_required_after_generation = false; }),
    expectFailure(validRecord, "memory_default_false_fails", (candidate) => { candidate.fixed_constraints_confirmation.no_memory_write_default = false; }),
    expectFailure(validRecord, "overwrite_true_fails", (candidate) => { candidate.fixed_constraints_confirmation.overwrite_existing_files_allowed = true; }),
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
  const reportRecord = readJson(reportPath).exact_new_trial_request_text_regenerated;
  const validRecord = readJson(passFixturePath).exact_new_trial_request_text_regenerated;
  const invalidRecord = readJson(failFixturePath).exact_new_trial_request_text_regenerated;

  for (const token of [
    `authorization_package_id: ${packageId}`,
    "authorization_status: draft_not_submitted",
    "approval_status: not_requested",
    "submit_ready: false",
    "exact_request_text_regenerated: true",
    "placeholders_remaining: false",
    "human_approval_phrase_received: false",
    "human_send_step_still_required: true",
    "request_not_submitted: true",
    "can_submit_now: false",
    "can_execute_now: false",
    exactPhrase
  ]) {
    assert(doc.includes(token), `request text regeneration doc missing token: ${token}`);
  }

  assert(schema.includes("exact_new_trial_request_text_regenerated"), "schema must define exact_new_trial_request_text_regenerated");
  assert(mvp.includes("validate_exact_new_trial_request_text_regenerated.js"), "MVP validator wiring missing");
  assert(slice.includes("EXPECTED_V0_6_9_EXACT_NEW_TRIAL_REQUEST_TEXT_REGENERATED_SLICE"), "exact-slice wiring missing");

  validateRecord(reportRecord);
  validateRecord(validRecord);
  const negativeCaseSummary = validateNegativeCases(validRecord, invalidRecord);

  const output = {
    passed: true,
    validator: "validate_exact_new_trial_request_text_regenerated",
    phase,
    regenerated_request_doc_present: true,
    regenerated_request_schema_present: true,
    regenerated_request_report_present: true,
    regenerated_request_fixture_present: true,
    regenerated_request_fail_fixture_present: true,
    authorization_package_id: packageId,
    authorization_status: "draft_not_submitted",
    approval_status: "not_requested",
    submit_ready: false,
    exact_request_text_regenerated: true,
    copyable_exact_request_text_present: true,
    placeholders_remaining: false,
    human_approval_phrase_received: false,
    human_send_step_still_required: true,
    request_not_submitted: true,
    selected_prompt_package_ref: selectedPrompt,
    selected_output_directory: selectedOutputDirectory,
    selected_receipt_path: selectedReceiptPath,
    selected_registry_path: selectedRegistryPath,
    selected_review_console_bridge_ref: selectedBridgeRef,
    exact_call_count: 1,
    max_image_candidates: 1,
    retry_limit: 0,
    review_required_after_generation: true,
    no_memory_write_default: true,
    overwrite_existing_files_allowed: false,
    metadata_only: true,
    request_text_regeneration_only: true,
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
