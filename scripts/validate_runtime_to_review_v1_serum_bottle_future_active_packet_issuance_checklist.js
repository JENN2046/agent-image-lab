#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_serum_bottle_future_active_packet_issuance_checklist";
const checklistPath = "reports/runtime_to_review_v1/serum_bottle_owner_activation_confirmation_checklist_20260601.json";
const templatePath = "reports/runtime_to_review_v1/serum_bottle_future_active_probe_packet_template_20260601.json";
const decisionPath = "reports/runtime_to_review_v1/serum_bottle_live_activation_decision_packet_draft_20260601.json";
const outputGatePath = "reports/runtime_to_review_v1/serum_bottle_output_directory_preflight_gate_20260601.json";
const activationDraftPath = "reports/runtime_to_review_v1/serum_bottle_exact_live_activation_packet_draft_20260601.json";
const perPacketPreflightPath = "reports/runtime_to_review_v1/per_packet_owner_runtime_activation_preflight_20260601.json";
const inactivePacketPath = "reports/runtime_to_review_v1/guarded_live_probe_serum_bottle_inactive_preflight_packet_20260601.json";
const readinessAuditPath = "reports/runtime_to_review_v1/serum_bottle_readiness_audit_20260601.json";
const prePushSummaryPath = "reports/runtime_to_review_v1/serum_bottle_final_pre_push_readiness_summary_20260601.json";
const outputDir = "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle/";
const ownerPhrase = "RUNTIME_TO_REVIEW_V1_SERUM_BOTTLE_ONE_PROVIDER_ONE_IMAGE";
const runnerPhrase = "RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE";
const packageScriptName = "validate:runtime-to-review-serum-bottle-future-active-issuance-checklist";
const manifestId = "runtime_to_review_serum_bottle_future_active_issuance_checklist";

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

function main() {
  const checklist = readJson(checklistPath);
  const template = readJson(templatePath);
  const decision = readJson(decisionPath);
  const outputGate = readJson(outputGatePath);
  const activationDraft = readJson(activationDraftPath);
  const perPacketPreflight = readJson(perPacketPreflightPath);
  const inactivePacket = readJson(inactivePacketPath);
  const readinessAudit = readJson(readinessAuditPath);
  const prePushSummary = readJson(prePushSummaryPath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");

  check("issuance_sources_exist", () => [
    checklistPath,
    templatePath,
    decisionPath,
    outputGatePath,
    activationDraftPath,
    perPacketPreflightPath,
    inactivePacketPath,
    readinessAuditPath,
    prePushSummaryPath,
  ].every((relativePath) => fs.existsSync(repoPath(relativePath))));
  check("current_chain_remains_inactive", () =>
    checklist.can_execute_now === false &&
    checklist.checklist_authorizes_execution === false &&
    checklist.execution_authorized_by_this_checklist === false &&
    checklist.live_probe_authorized_by_this_checklist === false &&
    template.can_execute_now === false &&
    template.template_authorizes_execution === false &&
    template.execution_authorized_by_this_template === false &&
    template.live_probe_authorized_by_this_template === false &&
    decision.can_execute_now === false &&
    decision.execution_authorized_by_this_packet === false &&
    outputGate.can_execute_now === false &&
    outputGate.output_write_authorized_by_this_gate === false &&
    activationDraft.can_execute_now === false &&
    activationDraft.execution_authorized_by_this_packet === false &&
    perPacketPreflight.can_execute_now === false &&
    inactivePacket.can_execute_now === false &&
    readinessAudit.can_execute_now === false &&
    readinessAudit.audit_authorizes_execution === false &&
    prePushSummary.can_execute_now === false &&
    prePushSummary.summary_authorizes_execution === false
  );
  check("future_owner_phrase_and_runner_phrase_locked", () =>
    checklist.required_future_owner_confirmation_phrase === ownerPhrase &&
    checklist.runner_confirmation_phrase_still_required === runnerPhrase &&
    template.required_future_owner_confirmation_phrase === ownerPhrase &&
    template.runner_confirmation_phrase_still_required === runnerPhrase &&
    decision.required_future_owner_confirmation_phrase === ownerPhrase &&
    activationDraft.required_future_owner_confirmation_phrase === ownerPhrase &&
    readinessAudit.audit_scope.required_future_owner_confirmation_phrase === ownerPhrase &&
    readinessAudit.audit_scope.runner_confirmation_phrase_still_required === runnerPhrase &&
    prePushSummary.inactive_boundary_confirmation.required_future_owner_confirmation_phrase === ownerPhrase &&
    prePushSummary.inactive_boundary_confirmation.runner_confirmation_phrase_still_required === runnerPhrase &&
    ownerPhrase !== runnerPhrase
  );
  check("future_active_packet_must_be_separate_and_new", () =>
    checklist.future_active_packet_required_before_execution.required === true &&
    checklist.future_active_packet_required_before_execution.must_be_separate_from_this_checklist === true &&
    checklist.future_active_packet_required_before_execution.must_flip_can_execute_now === true &&
    checklist.future_active_packet_required_before_execution.must_flip_execution_authorized_by_packet === true &&
    checklist.future_active_packet_required_before_execution.must_reference_owner_confirmation_phrase === ownerPhrase &&
    checklist.future_active_packet_required_before_execution.must_reference_runner_confirmation_phrase === runnerPhrase &&
    checklist.future_active_packet_required_before_execution.must_reference_this_checklist === checklistPath &&
    template.must_be_filled_by_future_owner_action.required === true &&
    template.must_be_filled_by_future_owner_action.must_create_new_packet_ref === true &&
    template.must_be_filled_by_future_owner_action.must_not_modify_this_template_in_place === true &&
    template.must_be_filled_by_future_owner_action.must_rerun_pre_run_validators_immediately_before_execution === true &&
    template.must_be_filled_by_future_owner_action.must_record_receipt_after_execution === true
  );
  check("future_template_true_values_are_fenced", () =>
    template.future_active_packet_values_if_owner_issued_later.can_execute_now === true &&
    template.future_active_packet_values_if_owner_issued_later.decision_authorized_by_packet === true &&
    template.future_active_packet_values_if_owner_issued_later.execution_authorized_by_packet === true &&
    template.future_active_packet_values_if_owner_issued_later.live_probe_authorized_by_packet === true &&
    template.future_active_packet_values_if_owner_issued_later.activated_by_owner_confirmation === ownerPhrase &&
    template.future_active_packet_values_if_owner_issued_later.runner_confirmation_phrase === runnerPhrase &&
    template.future_active_packet_values_if_owner_issued_later.template_values_effective_now === false &&
    template.can_execute_now === false
  );
  check("future_probe_budget_is_exactly_one_image_no_retry", () =>
    checklist.future_activation_allowed_scope.max_provider_calls === 1 &&
    checklist.future_activation_allowed_scope.max_plugin_calls === 1 &&
    checklist.future_activation_allowed_scope.max_api_calls === 1 &&
    checklist.future_activation_allowed_scope.max_images === 1 &&
    checklist.future_activation_allowed_scope.max_live_probe_attempts === 1 &&
    checklist.future_activation_allowed_scope.retry_allowed === false &&
    template.future_activation_budget_ceiling.max_provider_calls === 1 &&
    template.future_activation_budget_ceiling.max_plugin_calls === 1 &&
    template.future_activation_budget_ceiling.max_api_calls === 1 &&
    template.future_activation_budget_ceiling.max_images === 1 &&
    template.future_activation_budget_ceiling.max_live_probe_attempts === 1 &&
    template.future_activation_budget_ceiling.retry_allowed === false
  );
  check("output_directory_and_overwrite_gate_locked", () =>
    checklist.target_output_directory_ref === outputDir &&
    template.target_output_directory_ref === outputDir &&
    decision.target_output_directory_ref === outputDir &&
    activationDraft.target_output_directory_ref === outputDir &&
    outputGate.target_output_directory_ref === outputDir &&
    perPacketPreflight.target_output_directory_ref === outputDir &&
    inactivePacket.output_directory_ref === outputDir &&
    checklist.pre_run_state_required.target_output_directory_missing_or_empty === true &&
    checklist.pre_run_state_required.unexpected_existing_files_allowed === false &&
    checklist.pre_run_state_required.overwrite_existing_files_allowed === false &&
    template.output_directory_state_required_at_activation.directory_missing_or_empty_required === true &&
    template.output_directory_state_required_at_activation.unexpected_existing_files_allowed === false &&
    template.output_directory_state_required_at_activation.overwrite_existing_files_allowed === false &&
    outputGate.existing_content_policy.overwrite_existing_files_allowed === false
  );
  check("required_pre_run_validators_are_declared_before_issuance", () =>
    includesAll(template.pre_run_validators_required, [
      "node --check scripts/run_runtime_to_review_v1_guarded_live_probe.js",
      "node --check adapters/runtime/native_doubao_runtime_v1_per_packet_owner_runtime.js",
      "npm run validate:runtime-to-review-serum-bottle-output-directory-preflight",
      "npm run validate:runtime-to-review-serum-bottle-exact-live-activation-draft",
      "npm run validate:runtime-to-review-per-packet-activation-preflight",
      "npm run validate:runtime-to-review-per-packet-owner-runtime",
      "npm run validate:runtime-to-review-serum-bottle-inactive-preflight",
      "npm run validate:runtime-to-review-serum-bottle-live-activation-decision-draft",
      "npm run validate:runtime-to-review-serum-bottle-owner-activation-checklist",
      "npm run validate:runtime-to-review-serum-bottle-future-active-template",
      "npm run validate:validation-manifest",
      "npm run validate:targeted-plan",
      "git diff --check",
    ]) &&
    readinessAudit.audit_conclusion.result === "pass_with_warnings" &&
    readinessAudit.audit_conclusion.block_count === 0 &&
    prePushSummary.conclusion.result === "ready_for_owner_push_decision_only" &&
    prePushSummary.conclusion.push_authorized_now === false
  );
  check("current_forbidden_now_flags_are_false", () =>
    allFalse(checklist.forbidden_now) &&
    allFalse(template.forbidden_now) &&
    allFalse(readinessAudit.actions_not_performed) &&
    allFalse(prePushSummary.actions_not_performed)
  );
  check("issuance_stop_conditions_preserve_red_lanes", () =>
    checklist.stop_conditions.includes("max_images is not exactly 1") &&
    checklist.stop_conditions.includes("retry is requested") &&
    checklist.stop_conditions.includes("provider budget is uncapped or unknown") &&
    checklist.stop_conditions.includes("secret value read or env file content read is required by Agent Image Lab") &&
    template.stop_conditions.includes("future owner action tries to modify this template in place instead of creating a separate packet") &&
    template.stop_conditions.includes("template values are treated as effective now") &&
    template.stop_conditions.includes("overwrite, delete, memory write, accepted sample promotion, production candidate write, tag, release, deploy, push, force push, or history rewrite is required") &&
    prePushSummary.stop_conditions.includes("any request expands into provider, plugin, API, image generation, memory write, tag, release, deploy, force push, history rewrite, or destructive action")
  );
  check("package_script_registered", () =>
    packageJson.scripts &&
    packageJson.scripts[packageScriptName] === "node scripts/validate_runtime_to_review_v1_serum_bottle_future_active_packet_issuance_checklist.js"
  );
  check("manifest_entry_registered", () => {
    const entry = manifest.validators.find((item) => item.id === manifestId);
    return entry &&
      entry.command === `npm run ${packageScriptName}` &&
      entry.script === "scripts/validate_runtime_to_review_v1_serum_bottle_future_active_packet_issuance_checklist.js" &&
      entry.tier === "targeted" &&
      entry.domain === "runtime_to_review" &&
      entry.status === "active" &&
      entry.estimated_runtime_class === "fast" &&
      includesAll(entry.trigger_paths, [
        "scripts/validate_runtime_to_review_v1_serum_bottle_future_active_packet_issuance_checklist.js",
        checklistPath,
        templatePath,
        decisionPath,
        outputGatePath,
        activationDraftPath,
        perPacketPreflightPath,
        inactivePacketPath,
        readinessAuditPath,
        prePushSummaryPath,
        "package.json",
      ]) &&
      entry.required_for.includes("runtime_to_review_serum_bottle_future_active_issuance_checklist_patch");
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    can_execute_now: false,
    issuance_authorized_by_this_validator: false,
    required_future_owner_confirmation_phrase: ownerPhrase,
    runner_confirmation_phrase_still_required: runnerPhrase,
    future_execution_requires_separate_active_packet: true,
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
