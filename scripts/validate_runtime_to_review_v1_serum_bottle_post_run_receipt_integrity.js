#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_serum_bottle_post_run_receipt_integrity";
const templatePath = "reports/runtime_to_review_v1/serum_bottle_future_active_probe_packet_template_20260601.json";
const activationDraftPath = "reports/runtime_to_review_v1/serum_bottle_exact_live_activation_packet_draft_20260601.json";
const decisionPath = "reports/runtime_to_review_v1/serum_bottle_live_activation_decision_packet_draft_20260601.json";
const outputGatePath = "reports/runtime_to_review_v1/serum_bottle_output_directory_preflight_gate_20260601.json";
const checklistPath = "reports/runtime_to_review_v1/serum_bottle_owner_activation_confirmation_checklist_20260601.json";
const readinessAuditPath = "reports/runtime_to_review_v1/serum_bottle_readiness_audit_20260601.json";
const receiptExpectationsValidatorPath = "scripts/validate_runtime_to_review_v1_serum_bottle_future_active_packet_receipt_expectations.js";
const expectedProviderReceiptRef = "reports/runtime_to_review_v1/serum_bottle_exact_live_probe_receipt_20260601.json";
const expectedArtifactRecordRef = "reports/runtime_to_review_v1/serum_bottle_exact_live_probe_artifact_record_20260601.json";
const expectedReviewBridgeRef = "review_console/live_receipt_bridge/serum_bottle_exact_live_probe_20260601.review_entry.json";
const expectedOutputDir = "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle/";
const expectedPromptRef = "prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml";
const expectedFixtureRef = "tests/fixtures/runtime_kernel_v1_real_guarded_serum_bottle_task.fixture.json";
const expectedModel = "doubao-seedream-5-0-260128";
const expectedProduct = "premium_serum_bottle";
const ownerPhrase = "RUNTIME_TO_REVIEW_V1_SERUM_BOTTLE_ONE_PROVIDER_ONE_IMAGE";
const runnerPhrase = "RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE";
const packageScriptName = "validate:runtime-to-review-serum-bottle-post-run-receipt-integrity";
const manifestId = "runtime_to_review_serum_bottle_post_run_receipt_integrity";

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

function includesAll(values, expectedValues) {
  return Array.isArray(values) && expectedValues.every((value) => values.includes(value));
}

function allFalse(object) {
  return object && Object.values(object).every((value) => value === false);
}

function plannedRefsMatch(template, activationDraft, decision) {
  return template.receipt_refs_if_activated_later.provider_receipt_ref === expectedProviderReceiptRef &&
    template.receipt_refs_if_activated_later.artifact_record_ref === expectedArtifactRecordRef &&
    template.receipt_refs_if_activated_later.review_bridge_ref === expectedReviewBridgeRef &&
    activationDraft.planned_receipt_ref_if_activated_later === expectedProviderReceiptRef &&
    activationDraft.planned_artifact_record_ref_if_activated_later === expectedArtifactRecordRef &&
    activationDraft.planned_review_bridge_ref_if_activated_later === expectedReviewBridgeRef &&
    decision.receipt_refs_if_activated_later.provider_receipt_ref === expectedProviderReceiptRef &&
    decision.receipt_refs_if_activated_later.artifact_record_ref === expectedArtifactRecordRef &&
    decision.receipt_refs_if_activated_later.review_bridge_ref === expectedReviewBridgeRef;
}

function main() {
  const template = readJson(templatePath);
  const activationDraft = readJson(activationDraftPath);
  const decision = readJson(decisionPath);
  const outputGate = readJson(outputGatePath);
  const checklist = readJson(checklistPath);
  const readinessAudit = readJson(readinessAuditPath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");

  const expectedPostRunFiles = [
    expectedProviderReceiptRef,
    expectedArtifactRecordRef,
    expectedReviewBridgeRef,
  ];
  const futureProviderReceiptRequiredFields = [
    "packet_id",
    "activated_by_owner_confirmation",
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "image_generation_performed",
    "output_files",
    "calls_used",
    "validation_run",
    "rollback_or_cleanup_available",
  ];
  const futureArtifactMetadataRequiredFields = [
    "path",
    "bytes",
    "sha256",
    "mime_type",
    "width",
    "height",
  ];
  const futureCrossRecordRequiredRefs = [
    "provider_receipt_ref",
    "artifact_record_ref",
    "review_bridge_ref",
  ];

  check("post_run_integrity_sources_exist", () => [
    templatePath,
    activationDraftPath,
    decisionPath,
    outputGatePath,
    checklistPath,
    readinessAuditPath,
    receiptExpectationsValidatorPath,
  ].every((relativePath) => fs.existsSync(repoPath(relativePath))));
  check("validator_is_inactive_and_does_not_authorize_execution", () =>
    template.can_execute_now === false &&
    template.template_authorizes_execution === false &&
    activationDraft.can_execute_now === false &&
    activationDraft.execution_authorized_by_this_packet === false &&
    decision.can_execute_now === false &&
    decision.execution_authorized_by_this_packet === false &&
    checklist.can_execute_now === false &&
    checklist.checklist_authorizes_execution === false &&
    readinessAudit.can_execute_now === false &&
    readinessAudit.audit_authorizes_execution === false
  );
  check("planned_post_run_refs_are_exact_and_consistent", () =>
    plannedRefsMatch(template, activationDraft, decision)
  );
  check("planned_post_run_files_absent_before_execution", () =>
    expectedPostRunFiles.every((relativePath) => !fs.existsSync(repoPath(relativePath)))
  );
  check("future_provider_receipt_required_fields_locked", () =>
    activationDraft.future_activation_must_write_receipt === true &&
    includesAll(activationDraft.future_activation_receipt_required_fields, futureProviderReceiptRequiredFields)
  );
  check("future_post_run_cross_record_contract_locked", () =>
    includesAll(futureCrossRecordRequiredRefs, [
      "provider_receipt_ref",
      "artifact_record_ref",
      "review_bridge_ref",
    ]) &&
    expectedProviderReceiptRef.endsWith("_receipt_20260601.json") &&
    expectedArtifactRecordRef.endsWith("_artifact_record_20260601.json") &&
    expectedReviewBridgeRef.endsWith(".review_entry.json")
  );
  check("future_artifact_metadata_fields_are_explicit", () =>
    includesAll(futureArtifactMetadataRequiredFields, [
      "path",
      "bytes",
      "sha256",
      "mime_type",
      "width",
      "height",
    ])
  );
  check("future_receipt_must_bind_exact_scope", () =>
    template.target_output_directory_ref === expectedOutputDir &&
    template.target_prompt_package_ref === expectedPromptRef &&
    template.target_fixture_ref === expectedFixtureRef &&
    template.required_model === expectedModel &&
    template.target_product === expectedProduct &&
    activationDraft.target_output_directory_ref === expectedOutputDir &&
    activationDraft.target_prompt_package_ref === expectedPromptRef &&
    activationDraft.target_fixture_ref === expectedFixtureRef &&
    activationDraft.required_model === expectedModel &&
    activationDraft.target_product === expectedProduct &&
    decision.target_output_directory_ref === expectedOutputDir &&
    decision.target_prompt_package_ref === expectedPromptRef &&
    decision.target_fixture_ref === expectedFixtureRef &&
    decision.required_model === expectedModel &&
    decision.target_product === expectedProduct
  );
  check("future_receipt_must_bind_exact_phrases", () =>
    template.required_future_owner_confirmation_phrase === ownerPhrase &&
    template.runner_confirmation_phrase_still_required === runnerPhrase &&
    activationDraft.required_future_owner_confirmation_phrase === ownerPhrase &&
    activationDraft.runner_confirmation_phrase_still_required === runnerPhrase &&
    decision.required_future_owner_confirmation_phrase === ownerPhrase &&
    decision.runner_confirmation_phrase_still_required === runnerPhrase &&
    ownerPhrase !== runnerPhrase
  );
  check("future_post_run_budget_integrity_is_one_image_no_retry", () =>
    template.future_activation_budget_ceiling.max_provider_calls === 1 &&
    template.future_activation_budget_ceiling.max_plugin_calls === 1 &&
    template.future_activation_budget_ceiling.max_api_calls === 1 &&
    template.future_activation_budget_ceiling.max_images === 1 &&
    template.future_activation_budget_ceiling.max_live_probe_attempts === 1 &&
    template.future_activation_budget_ceiling.retry_allowed === false &&
    decision.future_activation_budget_ceiling.max_provider_calls === 1 &&
    decision.future_activation_budget_ceiling.max_plugin_calls === 1 &&
    decision.future_activation_budget_ceiling.max_api_calls === 1 &&
    decision.future_activation_budget_ceiling.max_images === 1 &&
    decision.future_activation_budget_ceiling.max_live_probe_attempts === 1 &&
    decision.future_activation_budget_ceiling.retry_allowed === false
  );
  check("post_run_cleanup_must_be_receipt_aware", () =>
    outputGate.future_live_probe_write_boundary.receipt_required_before_cleanup === true &&
    outputGate.future_live_probe_write_boundary.delete_or_overwrite_without_separate_cleanup_packet_allowed === false &&
    outputGate.existing_content_policy.overwrite_existing_files_allowed === false &&
    template.rollback_or_cleanup_plan.includes("separate receipt-aware cleanup packet") &&
    activationDraft.rollback_or_cleanup_plan_if_activated_later.includes("receipt-aware") &&
    checklist.rollback_or_cleanup_plan.includes("separate receipt-aware cleanup packet")
  );
  check("current_chain_has_no_runtime_side_effects", () =>
    allFalse(template.forbidden_now) &&
    allFalse(activationDraft.forbidden_now) &&
    allFalse(checklist.forbidden_now) &&
    allFalse(readinessAudit.actions_not_performed)
  );
  check("post_run_integrity_stop_conditions_preserve_red_lanes", () =>
    template.stop_conditions.includes("any pre-run validator fails") &&
    template.stop_conditions.includes("target output directory contains unexpected existing files") &&
    template.stop_conditions.includes("max_images is not exactly 1") &&
    template.stop_conditions.includes("retry is requested") &&
    activationDraft.stop_conditions.includes("secret value read or env file content read is required by Agent Image Lab") &&
    decision.rollback_or_cleanup_plan_if_activated_later.includes("write a receipt before any cleanup") &&
    decision.rollback_or_cleanup_plan_if_activated_later.includes("separate receipt-aware cleanup packet")
  );
  check("receipt_expectations_validator_precedes_post_run_integrity", () =>
    fs.existsSync(repoPath(receiptExpectationsValidatorPath)) &&
    packageJson.scripts["validate:runtime-to-review-serum-bottle-future-active-receipt-expectations"] ===
      "node scripts/validate_runtime_to_review_v1_serum_bottle_future_active_packet_receipt_expectations.js"
  );
  check("package_script_registered", () =>
    packageJson.scripts &&
    packageJson.scripts[packageScriptName] === "node scripts/validate_runtime_to_review_v1_serum_bottle_post_run_receipt_integrity.js"
  );
  check("manifest_entry_registered", () => {
    const entry = manifest.validators.find((item) => item.id === manifestId);
    return entry &&
      entry.command === `npm run ${packageScriptName}` &&
      entry.script === "scripts/validate_runtime_to_review_v1_serum_bottle_post_run_receipt_integrity.js" &&
      entry.tier === "targeted" &&
      entry.domain === "runtime_to_review" &&
      entry.status === "active" &&
      entry.estimated_runtime_class === "fast" &&
      includesAll(entry.trigger_paths, [
        "scripts/validate_runtime_to_review_v1_serum_bottle_post_run_receipt_integrity.js",
        templatePath,
        activationDraftPath,
        decisionPath,
        outputGatePath,
        checklistPath,
        readinessAuditPath,
        receiptExpectationsValidatorPath,
        "package.json",
      ]) &&
      entry.required_for.includes("runtime_to_review_serum_bottle_post_run_receipt_integrity_patch");
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    can_execute_now: false,
    post_run_integrity_authorizes_execution: false,
    post_run_integrity_check_performed_now: false,
    expected_provider_receipt_ref: expectedProviderReceiptRef,
    expected_artifact_record_ref: expectedArtifactRecordRef,
    expected_review_bridge_ref: expectedReviewBridgeRef,
    expected_post_run_files_present_now: expectedPostRunFiles.some((relativePath) => fs.existsSync(repoPath(relativePath))),
    future_receipt_files_required_after_execution: true,
    future_artifact_metadata_required_fields: futureArtifactMetadataRequiredFields,
    future_cross_record_required_refs: futureCrossRecordRequiredRefs,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
    directory_creation_performed: false,
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results,
  }, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
