#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_failed_provider_attempt_or_new_trial_boundary_review";
const reviewPath = "reports/runtime_to_review_v1/failed_provider_attempt_or_new_trial_boundary_review_20260601.json";
const readinessAuditPath = "reports/runtime_to_review_v1/serum_bottle_readiness_audit_20260601.json";
const futureTemplatePath = "reports/runtime_to_review_v1/serum_bottle_future_active_probe_packet_template_20260601.json";
const decisionPath = "reports/runtime_to_review_v1/serum_bottle_live_activation_decision_packet_draft_20260601.json";
const checklistPath = "reports/runtime_to_review_v1/serum_bottle_owner_activation_confirmation_checklist_20260601.json";
const outputGatePath = "reports/runtime_to_review_v1/serum_bottle_output_directory_preflight_gate_20260601.json";
const activationDraftPath = "reports/runtime_to_review_v1/serum_bottle_exact_live_activation_packet_draft_20260601.json";
const perPacketPreflightPath = "reports/runtime_to_review_v1/per_packet_owner_runtime_activation_preflight_20260601.json";
const inactivePacketPath = "reports/runtime_to_review_v1/guarded_live_probe_serum_bottle_inactive_preflight_packet_20260601.json";
const ownerPhrase = "RUNTIME_TO_REVIEW_V1_SERUM_BOTTLE_ONE_PROVIDER_ONE_IMAGE";
const runnerPhrase = "RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE";
const outputDir = "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle/";
const packageScriptName = "validate:runtime-to-review-failed-provider-or-new-trial-boundary";
const manifestId = "runtime_to_review_failed_provider_or_new_trial_boundary";

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
  const review = readJson(reviewPath);
  const readinessAudit = readJson(readinessAuditPath);
  const futureTemplate = readJson(futureTemplatePath);
  const decision = readJson(decisionPath);
  const checklist = readJson(checklistPath);
  const outputGate = readJson(outputGatePath);
  const activationDraft = readJson(activationDraftPath);
  const perPacketPreflight = readJson(perPacketPreflightPath);
  const inactivePacket = readJson(inactivePacketPath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");

  check("review_exists_and_is_non_executing", () =>
    review.schema === "runtime_to_review_v1_failed_provider_attempt_or_new_trial_boundary_review.v1" &&
    review.status === "completed_local_boundary_review_not_executed" &&
    review.source_pending_task_id === "inspect_failed_provider_tool_attempt_or_authorize_new_trial" &&
    review.can_execute_now === false &&
    review.review_authorizes_execution === false &&
    review.decision_authorized_by_this_review === false &&
    review.execution_authorized_by_this_review === false &&
    review.live_probe_authorized_by_this_review === false
  );
  check("source_refs_cover_current_chain", () => includesAll(review.source_refs, [
    ".agent_board/TASK_QUEUE.md",
    readinessAuditPath,
    futureTemplatePath,
    decisionPath,
    checklistPath,
    outputGatePath,
    activationDraftPath,
    perPacketPreflightPath,
    inactivePacketPath,
    "scripts/validation_manifest.json",
    "package.json",
  ]));
  check("product_decision_maps_pending_to_serum_bottle_chain", () =>
    review.product_decision.recommended_route === "prepare_future_active_serum_bottle_packet_before_any_provider_attempt" &&
    review.product_decision.selected_product === "premium_serum_bottle" &&
    review.product_decision.old_pending_task_resolved_to === "current serum-bottle inactive readiness and future-active packet chain" &&
    review.product_decision.failed_attempt_inspection_result === "no_new_live_failure_inspected_or_created_by_this_review" &&
    review.product_decision.new_trial_status === "not_authorized_by_this_review" &&
    review.product_decision.next_executable_unit_required === "separate owner-issued active packet, not this boundary review"
  );
  check("upstream_chain_remains_inactive", () =>
    review.current_inactive_chain.all_current_packets_inactive === true &&
    review.current_inactive_chain.all_current_can_execute_now_false === true &&
    review.current_inactive_chain.future_template_must_not_be_modified_in_place === true &&
    readinessAudit.can_execute_now === false &&
    readinessAudit.audit_authorizes_execution === false &&
    futureTemplate.can_execute_now === false &&
    futureTemplate.template_authorizes_execution === false &&
    decision.can_execute_now === false &&
    decision.execution_authorized_by_this_packet === false &&
    checklist.can_execute_now === false &&
    checklist.execution_authorized_by_this_checklist === false &&
    outputGate.can_execute_now === false &&
    activationDraft.can_execute_now === false &&
    perPacketPreflight.can_execute_now === false &&
    inactivePacket.can_execute_now === false
  );
  check("future_activation_boundary_exact", () =>
    review.exact_future_activation_boundary.required_future_owner_confirmation_phrase === ownerPhrase &&
    review.exact_future_activation_boundary.runner_confirmation_phrase_still_required === runnerPhrase &&
    review.exact_future_activation_boundary.target_fixture_ref === "tests/fixtures/runtime_kernel_v1_real_guarded_serum_bottle_task.fixture.json" &&
    review.exact_future_activation_boundary.target_prompt_package_ref === "prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml" &&
    review.exact_future_activation_boundary.target_output_directory_ref === outputDir &&
    review.exact_future_activation_boundary.provider_delegate_module === "adapters/runtime/native_doubao_runtime_v1_provider_delegate.js" &&
    review.exact_future_activation_boundary.owner_runtime_module === "adapters/runtime/native_doubao_runtime_v1_per_packet_owner_runtime.js" &&
    review.exact_future_activation_boundary.runner === "scripts/run_runtime_to_review_v1_guarded_live_probe.js" &&
    review.exact_future_activation_boundary.max_provider_calls === 1 &&
    review.exact_future_activation_boundary.max_plugin_calls === 1 &&
    review.exact_future_activation_boundary.max_api_calls === 1 &&
    review.exact_future_activation_boundary.max_images === 1 &&
    review.exact_future_activation_boundary.max_live_probe_attempts === 1 &&
    review.exact_future_activation_boundary.retry_allowed === false &&
    review.exact_future_activation_boundary.overwrite_existing_files_allowed === false &&
    review.exact_future_activation_boundary.secret_value_read_allowed === false
  );
  check("future_boundary_matches_upstream_packets", () =>
    readinessAudit.audit_scope.required_future_owner_confirmation_phrase === ownerPhrase &&
    futureTemplate.required_future_owner_confirmation_phrase === ownerPhrase &&
    decision.required_future_owner_confirmation_phrase === ownerPhrase &&
    checklist.required_future_owner_confirmation_phrase === ownerPhrase &&
    readinessAudit.audit_scope.runner_confirmation_phrase_still_required === runnerPhrase &&
    futureTemplate.runner_confirmation_phrase_still_required === runnerPhrase &&
    checklist.runner_confirmation_phrase_still_required === runnerPhrase &&
    futureTemplate.target_output_directory_ref === outputDir &&
    decision.target_output_directory_ref === outputDir &&
    checklist.target_output_directory_ref === outputDir &&
    outputGate.target_output_directory_ref === outputDir &&
    activationDraft.target_output_directory_ref === outputDir
  );
  check("pre_run_validation_list_includes_required_gates", () => includesAll(review.pre_run_validation_required_before_future_execution, [
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
    "npm run validate:runtime-to-review-serum-bottle-readiness-audit",
    "npm run validate:runtime-to-review-serum-bottle-future-active-issuance-checklist",
    "npm run validate:runtime-to-review-serum-bottle-future-active-receipt-expectations",
    "npm run validate:validation-manifest",
    "git diff --check",
  ]));
  check("receipt_targets_match_future_template", () =>
    review.future_receipt_targets_if_activated_later.provider_receipt_ref === futureTemplate.receipt_refs_if_activated_later.provider_receipt_ref &&
    review.future_receipt_targets_if_activated_later.artifact_record_ref === futureTemplate.receipt_refs_if_activated_later.artifact_record_ref &&
    review.future_receipt_targets_if_activated_later.review_bridge_ref === futureTemplate.receipt_refs_if_activated_later.review_bridge_ref
  );
  check("no_side_effects_recorded", () => allFalse(review.actions_not_performed));
  check("stop_conditions_preserve_red_lanes", () =>
    review.stop_conditions.includes("attempting to treat this review as an active packet") &&
    review.stop_conditions.includes(`missing exact owner confirmation phrase ${ownerPhrase}`) &&
    review.stop_conditions.includes(`missing runner confirmation phrase ${runnerPhrase}`) &&
    review.stop_conditions.includes("max_images is not exactly 1") &&
    review.stop_conditions.includes("retry is requested") &&
    review.stop_conditions.includes("uncapped cost or unknown provider budget appears") &&
    review.stop_conditions.includes("secret value read or env file content read is required by Agent Image Lab") &&
    review.stop_conditions.includes("memory write, accepted_samples promotion, production candidate write, tag, release, deploy, push, force push, history rewrite, delete, or overwrite is required")
  );
  check("conclusion_resolves_preparation_not_execution", () =>
    review.conclusion.result === "boundary_review_complete" &&
    review.conclusion.old_pending_task_can_be_marked_prepared === true &&
    review.conclusion.new_trial_authorized_now === false &&
    review.conclusion.future_active_packet_required === true &&
    review.conclusion.current_chain_inactive === true &&
    review.conclusion.ready_for_owner_decision === true
  );
  check("package_script_registered", () =>
    packageJson.scripts &&
    packageJson.scripts[packageScriptName] === "node scripts/validate_runtime_to_review_v1_failed_provider_attempt_or_new_trial_boundary_review.js"
  );
  check("manifest_entry_registered", () => {
    const entry = manifest.validators.find((item) => item.id === manifestId);
    return entry &&
      entry.command === `npm run ${packageScriptName}` &&
      entry.script === "scripts/validate_runtime_to_review_v1_failed_provider_attempt_or_new_trial_boundary_review.js" &&
      entry.tier === "targeted" &&
      entry.domain === "runtime_to_review" &&
      entry.status === "active" &&
      entry.estimated_runtime_class === "fast" &&
      includesAll(entry.trigger_paths, [
        reviewPath,
        "scripts/validate_runtime_to_review_v1_failed_provider_attempt_or_new_trial_boundary_review.js",
        readinessAuditPath,
        futureTemplatePath,
        decisionPath,
        checklistPath,
        ".agent_board/TASK_QUEUE.md",
        "package.json",
      ]) &&
      entry.required_for.includes("runtime_to_review_failed_provider_or_new_trial_boundary_patch");
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    review: reviewPath,
    can_execute_now: review.can_execute_now,
    review_authorizes_execution: review.review_authorizes_execution,
    conclusion: review.conclusion.result,
    future_active_packet_required: review.conclusion.future_active_packet_required,
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
