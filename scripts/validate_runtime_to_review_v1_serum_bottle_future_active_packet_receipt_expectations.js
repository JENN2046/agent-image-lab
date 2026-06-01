#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_serum_bottle_future_active_packet_receipt_expectations";
const templatePath = "reports/runtime_to_review_v1/serum_bottle_future_active_probe_packet_template_20260601.json";
const activationDraftPath = "reports/runtime_to_review_v1/serum_bottle_exact_live_activation_packet_draft_20260601.json";
const decisionPath = "reports/runtime_to_review_v1/serum_bottle_live_activation_decision_packet_draft_20260601.json";
const outputGatePath = "reports/runtime_to_review_v1/serum_bottle_output_directory_preflight_gate_20260601.json";
const checklistPath = "reports/runtime_to_review_v1/serum_bottle_owner_activation_confirmation_checklist_20260601.json";
const readinessAuditPath = "reports/runtime_to_review_v1/serum_bottle_readiness_audit_20260601.json";
const issuanceValidatorPath = "scripts/validate_runtime_to_review_v1_serum_bottle_future_active_packet_issuance_checklist.js";
const expectedProviderReceiptRef = "reports/runtime_to_review_v1/serum_bottle_exact_live_probe_receipt_20260601.json";
const expectedArtifactRecordRef = "reports/runtime_to_review_v1/serum_bottle_exact_live_probe_artifact_record_20260601.json";
const expectedReviewBridgeRef = "review_console/live_receipt_bridge/serum_bottle_exact_live_probe_20260601.review_entry.json";
const ownerPhrase = "RUNTIME_TO_REVIEW_V1_SERUM_BOTTLE_ONE_PROVIDER_ONE_IMAGE";
const runnerPhrase = "RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE";
const packageScriptName = "validate:runtime-to-review-serum-bottle-future-active-receipt-expectations";
const manifestId = "runtime_to_review_serum_bottle_future_active_receipt_expectations";

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

function main() {
  const template = readJson(templatePath);
  const activationDraft = readJson(activationDraftPath);
  const decision = readJson(decisionPath);
  const outputGate = readJson(outputGatePath);
  const checklist = readJson(checklistPath);
  const readinessAudit = readJson(readinessAuditPath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");

  check("receipt_expectation_sources_exist", () => [
    templatePath,
    activationDraftPath,
    decisionPath,
    outputGatePath,
    checklistPath,
    readinessAuditPath,
    issuanceValidatorPath,
  ].every((relativePath) => fs.existsSync(repoPath(relativePath))));
  check("validator_is_inactive_and_does_not_authorize_execution", () =>
    template.can_execute_now === false &&
    template.template_authorizes_execution === false &&
    template.execution_authorized_by_this_template === false &&
    template.live_probe_authorized_by_this_template === false &&
    activationDraft.can_execute_now === false &&
    activationDraft.execution_authorized_by_this_packet === false &&
    decision.can_execute_now === false &&
    decision.execution_authorized_by_this_packet === false &&
    checklist.can_execute_now === false &&
    checklist.checklist_authorizes_execution === false &&
    readinessAudit.can_execute_now === false &&
    readinessAudit.audit_authorizes_execution === false
  );
  check("receipt_refs_are_consistent_across_future_template_and_drafts", () =>
    template.receipt_refs_if_activated_later.provider_receipt_ref === expectedProviderReceiptRef &&
    template.receipt_refs_if_activated_later.artifact_record_ref === expectedArtifactRecordRef &&
    template.receipt_refs_if_activated_later.review_bridge_ref === expectedReviewBridgeRef &&
    decision.receipt_refs_if_activated_later.provider_receipt_ref === expectedProviderReceiptRef &&
    decision.receipt_refs_if_activated_later.artifact_record_ref === expectedArtifactRecordRef &&
    decision.receipt_refs_if_activated_later.review_bridge_ref === expectedReviewBridgeRef &&
    activationDraft.planned_receipt_ref_if_activated_later === expectedProviderReceiptRef &&
    activationDraft.planned_artifact_record_ref_if_activated_later === expectedArtifactRecordRef &&
    activationDraft.planned_review_bridge_ref_if_activated_later === expectedReviewBridgeRef
  );
  check("future_activation_must_write_receipt_and_fields", () =>
    activationDraft.future_activation_must_write_receipt === true &&
    includesAll(activationDraft.future_activation_receipt_required_fields, [
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
    ])
  );
  check("receipt_required_before_cleanup_is_preserved", () =>
    outputGate.future_live_probe_write_boundary.receipt_required_before_cleanup === true &&
    outputGate.future_live_probe_write_boundary.delete_or_overwrite_without_separate_cleanup_packet_allowed === false &&
    outputGate.existing_content_policy.overwrite_existing_files_allowed === false &&
    checklist.owner_confirmation_must_acknowledge.some((item) =>
      item.id === "receipt_before_cleanup" &&
      item.required === true &&
      item.expected_text === "generated output cleanup requires a later receipt-aware cleanup packet"
    )
  );
  check("future_owner_action_must_record_receipt", () =>
    template.must_be_filled_by_future_owner_action.required === true &&
    template.must_be_filled_by_future_owner_action.must_create_new_packet_ref === true &&
    template.must_be_filled_by_future_owner_action.must_not_modify_this_template_in_place === true &&
    template.must_be_filled_by_future_owner_action.must_record_receipt_after_execution === true &&
    readinessAudit.future_execution_still_requires.includes("A separate owner-issued active packet, not this audit report.")
  );
  check("receipt_expectations_remain_bound_to_exact_phrases", () =>
    template.required_future_owner_confirmation_phrase === ownerPhrase &&
    template.runner_confirmation_phrase_still_required === runnerPhrase &&
    decision.required_future_owner_confirmation_phrase === ownerPhrase &&
    decision.runner_confirmation_phrase_still_required === runnerPhrase &&
    activationDraft.required_future_owner_confirmation_phrase === ownerPhrase &&
    activationDraft.runner_confirmation_phrase_still_required === runnerPhrase &&
    ownerPhrase !== runnerPhrase
  );
  check("receipt_expectations_do_not_allow_runtime_side_effects_now", () =>
    Object.values(template.forbidden_now).every((value) => value === false) &&
    Object.values(checklist.forbidden_now).every((value) => value === false) &&
    Object.values(readinessAudit.actions_not_performed).every((value) => value === false)
  );
  check("cleanup_plans_require_separate_receipt_aware_cleanup", () =>
    template.rollback_or_cleanup_plan.includes("separate receipt-aware cleanup packet") &&
    activationDraft.rollback_or_cleanup_plan_if_activated_later.includes("receipt-aware") &&
    activationDraft.rollback_or_cleanup_plan_if_activated_later.includes("separate owner-authorized cleanup packet") &&
    decision.rollback_or_cleanup_plan_if_activated_later.includes("receipt-aware cleanup packet") &&
    outputGate.rollback_or_cleanup_plan.includes("separate receipt-aware cleanup packet") &&
    checklist.rollback_or_cleanup_plan.includes("separate receipt-aware cleanup packet")
  );
  check("pre_run_validators_include_issuance_and_receipt_chain_inputs", () =>
    template.pre_run_validators_required.includes("npm run validate:runtime-to-review-serum-bottle-future-active-template") &&
    template.pre_run_validators_required.includes("npm run validate:runtime-to-review-serum-bottle-owner-activation-checklist") &&
    template.pre_run_validators_required.includes("npm run validate:runtime-to-review-serum-bottle-live-activation-decision-draft") &&
    template.pre_run_validators_required.includes("npm run validate:runtime-to-review-serum-bottle-output-directory-preflight") &&
    template.pre_run_validators_required.includes("npm run validate:validation-manifest") &&
    template.pre_run_validators_required.includes("npm run validate:targeted-plan") &&
    fs.existsSync(repoPath(issuanceValidatorPath))
  );
  check("package_script_registered", () =>
    packageJson.scripts &&
    packageJson.scripts[packageScriptName] === "node scripts/validate_runtime_to_review_v1_serum_bottle_future_active_packet_receipt_expectations.js"
  );
  check("manifest_entry_registered", () => {
    const entry = manifest.validators.find((item) => item.id === manifestId);
    return entry &&
      entry.command === `npm run ${packageScriptName}` &&
      entry.script === "scripts/validate_runtime_to_review_v1_serum_bottle_future_active_packet_receipt_expectations.js" &&
      entry.tier === "targeted" &&
      entry.domain === "runtime_to_review" &&
      entry.status === "active" &&
      entry.estimated_runtime_class === "fast" &&
      includesAll(entry.trigger_paths, [
        "scripts/validate_runtime_to_review_v1_serum_bottle_future_active_packet_receipt_expectations.js",
        templatePath,
        activationDraftPath,
        decisionPath,
        outputGatePath,
        checklistPath,
        readinessAuditPath,
        issuanceValidatorPath,
        "package.json",
      ]) &&
      entry.required_for.includes("runtime_to_review_serum_bottle_future_active_receipt_expectations_patch");
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    can_execute_now: false,
    receipt_expectations_authorize_execution: false,
    expected_provider_receipt_ref: expectedProviderReceiptRef,
    expected_artifact_record_ref: expectedArtifactRecordRef,
    expected_review_bridge_ref: expectedReviewBridgeRef,
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
