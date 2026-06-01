#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_serum_bottle_active_packet_candidate_no_execute";
const packetPath = "reports/runtime_to_review_v1/serum_bottle_active_packet_candidate_no_execute_20260601.json";
const boundaryReviewPath = "reports/runtime_to_review_v1/failed_provider_attempt_or_new_trial_boundary_review_20260601.json";
const futureTemplatePath = "reports/runtime_to_review_v1/serum_bottle_future_active_probe_packet_template_20260601.json";
const checklistPath = "reports/runtime_to_review_v1/serum_bottle_owner_activation_confirmation_checklist_20260601.json";
const decisionPath = "reports/runtime_to_review_v1/serum_bottle_live_activation_decision_packet_draft_20260601.json";
const outputGatePath = "reports/runtime_to_review_v1/serum_bottle_output_directory_preflight_gate_20260601.json";
const activationDraftPath = "reports/runtime_to_review_v1/serum_bottle_exact_live_activation_packet_draft_20260601.json";
const ownerPhrase = "RUNTIME_TO_REVIEW_V1_SERUM_BOTTLE_ONE_PROVIDER_ONE_IMAGE";
const runnerPhrase = "RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE";
const outputDir = "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle/";
const packageScriptName = "validate:runtime-to-review-serum-bottle-active-candidate";
const manifestId = "runtime_to_review_serum_bottle_active_packet_candidate";

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
  const packet = readJson(packetPath);
  const boundaryReview = readJson(boundaryReviewPath);
  const futureTemplate = readJson(futureTemplatePath);
  const checklist = readJson(checklistPath);
  const decision = readJson(decisionPath);
  const outputGate = readJson(outputGatePath);
  const activationDraft = readJson(activationDraftPath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");

  check("packet_is_candidate_not_executable", () =>
    packet.schema === "runtime_to_review_v1_serum_bottle_active_packet_candidate_no_execute.v1" &&
    packet.status === "candidate_prepared_not_executed" &&
    packet.can_execute_now === false &&
    packet.candidate_authorizes_execution === false &&
    packet.decision_authorized_by_this_packet === false &&
    packet.execution_authorized_by_this_packet === false &&
    packet.live_probe_authorized_by_this_packet === false
  );
  check("source_refs_link_to_existing_chain", () =>
    packet.source_boundary_review_ref === boundaryReviewPath &&
    packet.source_future_template_ref === futureTemplatePath &&
    packet.source_owner_checklist_ref === checklistPath &&
    packet.source_decision_draft_ref === decisionPath &&
    packet.source_output_directory_gate_ref === outputGatePath &&
    packet.source_activation_draft_ref === activationDraftPath
  );
  check("activation_state_preserves_no_execute_boundary", () =>
    packet.activation_state.owner_phrase_present_in_this_packet === false &&
    packet.activation_state.required_future_owner_confirmation_phrase === ownerPhrase &&
    packet.activation_state.runner_confirmation_phrase_still_required === runnerPhrase &&
    packet.activation_state.activation_transition_allowed_by_this_packet === false &&
    packet.activation_state.must_create_separate_execution_receipt_if_later_activated === true
  );
  check("target_matches_serum_bottle_chain", () =>
    packet.target.product === "premium_serum_bottle" &&
    packet.target.fixture_ref === "tests/fixtures/runtime_kernel_v1_real_guarded_serum_bottle_task.fixture.json" &&
    packet.target.prompt_package_ref === "prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml" &&
    packet.target.output_directory_ref === outputDir &&
    packet.target.provider_delegate_module === "adapters/runtime/native_doubao_runtime_v1_provider_delegate.js" &&
    packet.target.owner_runtime_module === "adapters/runtime/native_doubao_runtime_v1_per_packet_owner_runtime.js" &&
    packet.target.runner === "scripts/run_runtime_to_review_v1_guarded_live_probe.js" &&
    packet.target.model === "doubao-seedream-5-0-260128"
  );
  check("budget_exactly_one_no_retry", () =>
    packet.budget.max_provider_calls === 1 &&
    packet.budget.max_plugin_calls === 1 &&
    packet.budget.max_api_calls === 1 &&
    packet.budget.max_images === 1 &&
    packet.budget.max_live_probe_attempts === 1 &&
    packet.budget.retry_allowed === false &&
    packet.budget.max_runtime_probe_minutes === 10 &&
    packet.budget.uncapped_cost_allowed === false
  );
  check("pre_run_validators_include_boundary_and_serum_chain", () => includesAll(packet.pre_run_validators_required, [
    "node --check scripts/run_runtime_to_review_v1_guarded_live_probe.js",
    "node --check adapters/runtime/native_doubao_runtime_v1_per_packet_owner_runtime.js",
    "npm run validate:runtime-to-review-failed-provider-or-new-trial-boundary",
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
  check("command_shapes_are_preflight_and_future_live", () =>
    packet.preflight_only_command_shape.includes("--preflight-only") &&
    !packet.future_live_command_shape_if_separately_activated_later.includes("--preflight-only") &&
    packet.preflight_only_command_shape.includes(runnerPhrase) &&
    packet.future_live_command_shape_if_separately_activated_later.includes(runnerPhrase) &&
    packet.preflight_only_command_shape.includes("1") &&
    packet.future_live_command_shape_if_separately_activated_later.includes("1")
  );
  check("receipt_refs_match_template_and_boundary_review", () =>
    packet.receipt_refs_if_activated_later.provider_receipt_ref === futureTemplate.receipt_refs_if_activated_later.provider_receipt_ref &&
    packet.receipt_refs_if_activated_later.artifact_record_ref === futureTemplate.receipt_refs_if_activated_later.artifact_record_ref &&
    packet.receipt_refs_if_activated_later.review_bridge_ref === futureTemplate.receipt_refs_if_activated_later.review_bridge_ref &&
    packet.receipt_refs_if_activated_later.provider_receipt_ref === boundaryReview.future_receipt_targets_if_activated_later.provider_receipt_ref
  );
  check("output_policy_does_not_authorize_write", () =>
    packet.output_directory_policy.directory_missing_or_empty_required === true &&
    packet.output_directory_policy.unexpected_existing_files_allowed === false &&
    packet.output_directory_policy.overwrite_existing_files_allowed === false &&
    packet.output_directory_policy.directory_creation_authorized_by_this_packet === false &&
    packet.output_directory_policy.output_write_authorized_by_this_packet === false
  );
  check("upstream_sources_still_inactive", () =>
    boundaryReview.can_execute_now === false &&
    futureTemplate.can_execute_now === false &&
    checklist.can_execute_now === false &&
    decision.can_execute_now === false &&
    outputGate.can_execute_now === false &&
    activationDraft.can_execute_now === false
  );
  check("no_side_effects_recorded", () => allFalse(packet.forbidden_now));
  check("stop_conditions_preserve_red_lanes", () =>
    packet.stop_conditions.includes("attempting to execute this candidate packet") &&
    packet.stop_conditions.includes("setting can_execute_now=true in this candidate") &&
    packet.stop_conditions.includes(`missing separate owner activation phrase ${ownerPhrase}`) &&
    packet.stop_conditions.includes(`missing runner confirmation phrase ${runnerPhrase}`) &&
    packet.stop_conditions.includes("max_images is not exactly 1") &&
    packet.stop_conditions.includes("retry is requested") &&
    packet.stop_conditions.includes("secret value read or env file content read is required by Agent Image Lab") &&
    packet.stop_conditions.includes("memory write, accepted_samples promotion, production candidate write, tag, release, deploy, push, force push, history rewrite, delete, or overwrite is required")
  );
  check("conclusion_is_ready_for_decision_not_execution", () =>
    packet.conclusion.result === "active_packet_candidate_prepared_without_execution" &&
    packet.conclusion.ready_for_owner_activation_decision === true &&
    packet.conclusion.new_trial_authorized_now === false &&
    packet.conclusion.provider_attempt_performed === false &&
    packet.conclusion.future_execution_requires_separate_activation === true
  );
  check("package_script_registered", () =>
    packageJson.scripts &&
    packageJson.scripts[packageScriptName] === "node scripts/validate_runtime_to_review_v1_serum_bottle_active_packet_candidate_no_execute.js"
  );
  check("manifest_entry_registered", () => {
    const entry = manifest.validators.find((item) => item.id === manifestId);
    return entry &&
      entry.command === `npm run ${packageScriptName}` &&
      entry.script === "scripts/validate_runtime_to_review_v1_serum_bottle_active_packet_candidate_no_execute.js" &&
      entry.tier === "targeted" &&
      entry.domain === "runtime_to_review" &&
      entry.status === "active" &&
      entry.estimated_runtime_class === "fast" &&
      includesAll(entry.trigger_paths, [
        packetPath,
        "scripts/validate_runtime_to_review_v1_serum_bottle_active_packet_candidate_no_execute.js",
        boundaryReviewPath,
        futureTemplatePath,
        checklistPath,
        "package.json",
      ]) &&
      entry.required_for.includes("runtime_to_review_serum_bottle_active_packet_candidate_patch");
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    packet: packetPath,
    can_execute_now: packet.can_execute_now,
    candidate_authorizes_execution: packet.candidate_authorizes_execution,
    conclusion: packet.conclusion.result,
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
