#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_serum_bottle_live_activation_decision_packet_draft";
const decisionPath = "reports/runtime_to_review_v1/serum_bottle_live_activation_decision_packet_draft_20260601.json";
const outputGatePath = "reports/runtime_to_review_v1/serum_bottle_output_directory_preflight_gate_20260601.json";
const activationDraftPath = "reports/runtime_to_review_v1/serum_bottle_exact_live_activation_packet_draft_20260601.json";
const perPacketPreflightPath = "reports/runtime_to_review_v1/per_packet_owner_runtime_activation_preflight_20260601.json";
const inactivePacketPath = "reports/runtime_to_review_v1/guarded_live_probe_serum_bottle_inactive_preflight_packet_20260601.json";
const ownerRuntimePath = "adapters/runtime/native_doubao_runtime_v1_per_packet_owner_runtime.js";
const delegatePath = "adapters/runtime/native_doubao_runtime_v1_provider_delegate.js";
const runnerPath = "scripts/run_runtime_to_review_v1_guarded_live_probe.js";
const fixturePath = "tests/fixtures/runtime_kernel_v1_real_guarded_serum_bottle_task.fixture.json";
const promptPath = "prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml";
const outputDir = "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle/";
const ownerPhrase = "RUNTIME_TO_REVIEW_V1_SERUM_BOTTLE_ONE_PROVIDER_ONE_IMAGE";
const runnerPhrase = "RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE";
const packageScriptName = "validate:runtime-to-review-serum-bottle-live-activation-decision-draft";
const manifestId = "runtime_to_review_serum_bottle_live_activation_decision_draft";

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

function runNode(args) {
  return childProcess.execFileSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
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

function main() {
  runNode(["--check", "scripts/validate_runtime_to_review_v1_serum_bottle_live_activation_decision_packet_draft.js"]);
  runNode(["--check", runnerPath]);

  const decision = readJson(decisionPath);
  const outputGate = readJson(outputGatePath);
  const activationDraft = readJson(activationDraftPath);
  const perPacketPreflight = readJson(perPacketPreflightPath);
  const inactivePacket = readJson(inactivePacketPath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const runner = require(repoPath(runnerPath));

  check("decision_exists", () => fs.existsSync(repoPath(decisionPath)));
  check("schema_and_inactive_status", () =>
    decision.schema === "runtime_to_review_v1_live_activation_decision_packet_draft.v1" &&
    decision.status === "draft_inactive_not_executed" &&
    decision.can_execute_now === false &&
    decision.decision_authorized_by_this_packet === false &&
    decision.execution_authorized_by_this_packet === false &&
    decision.live_probe_authorized_by_this_packet === false &&
    decision.activation_mode === "future_owner_decision_required"
  );
  check("activation_transition_requires_all_flags_and_owner_phrase", () =>
    decision.activation_transition_required_fields.can_execute_now === true &&
    decision.activation_transition_required_fields.decision_authorized_by_this_packet === true &&
    decision.activation_transition_required_fields.execution_authorized_by_this_packet === true &&
    decision.activation_transition_required_fields.live_probe_authorized_by_this_packet === true &&
    decision.activation_transition_required_fields.activated_by_owner_confirmation === ownerPhrase &&
    decision.required_future_owner_confirmation_phrase === ownerPhrase &&
    decision.runner_confirmation_phrase_still_required === runnerPhrase &&
    runner.exactConfirmation === runnerPhrase
  );
  check("source_refs_align", () =>
    decision.source_output_directory_gate_ref === outputGatePath &&
    decision.source_activation_draft_ref === activationDraftPath &&
    decision.source_per_packet_activation_preflight_ref === perPacketPreflightPath &&
    decision.source_inactive_packet_ref === inactivePacketPath &&
    decision.owner_runtime_module === ownerRuntimePath &&
    decision.provider_delegate_module === delegatePath &&
    decision.runner === runnerPath &&
    decision.target_fixture_ref === fixturePath &&
    decision.target_prompt_package_ref === promptPath &&
    decision.target_output_directory_ref === outputDir
  );
  check("upstream_gate_chain_still_inactive_and_aligned", () =>
    outputGate.can_execute_now === false &&
    outputGate.output_write_authorized_by_this_gate === false &&
    outputGate.target_output_directory_ref === outputDir &&
    activationDraft.can_execute_now === false &&
    activationDraft.execution_authorized_by_this_packet === false &&
    activationDraft.target_output_directory_ref === outputDir &&
    perPacketPreflight.can_execute_now === false &&
    perPacketPreflight.target_output_directory_ref === outputDir &&
    inactivePacket.can_execute_now === false &&
    inactivePacket.output_directory_ref === outputDir
  );
  check("current_budget_zero_future_budget_one_image", () =>
    decision.current_budget.max_provider_calls === 0 &&
    decision.current_budget.max_plugin_calls === 0 &&
    decision.current_budget.max_api_calls === 0 &&
    decision.current_budget.max_images === 0 &&
    decision.current_budget.max_live_probe_attempts === 0 &&
    decision.current_budget.retry_allowed === false &&
    decision.future_activation_budget_ceiling.max_provider_calls === 1 &&
    decision.future_activation_budget_ceiling.max_plugin_calls === 1 &&
    decision.future_activation_budget_ceiling.max_api_calls === 1 &&
    decision.future_activation_budget_ceiling.max_images === 1 &&
    decision.future_activation_budget_ceiling.max_live_probe_attempts === 1 &&
    decision.future_activation_budget_ceiling.retry_allowed === false &&
    decision.future_activation_budget_ceiling.max_runtime_probe_minutes === 10
  );
  check("commands_are_exact_and_preflight_required", () =>
    Array.isArray(decision.exact_live_command_shape_after_separate_activation) &&
    decision.exact_live_command_shape_after_separate_activation.includes(fixturePath) &&
    decision.exact_live_command_shape_after_separate_activation.includes(delegatePath) &&
    decision.exact_live_command_shape_after_separate_activation.includes(ownerRuntimePath) &&
    decision.exact_live_command_shape_after_separate_activation.includes(runnerPhrase) &&
    decision.exact_live_command_shape_after_separate_activation.includes("1") &&
    !decision.exact_live_command_shape_after_separate_activation.includes("--preflight-only") &&
    Array.isArray(decision.preflight_only_command_must_pass_first) &&
    decision.preflight_only_command_must_pass_first.includes("--preflight-only") &&
    decision.preflight_only_command_must_pass_first.includes(runnerPhrase)
  );
  check("receipt_refs_bound", () =>
    decision.receipt_refs_if_activated_later.provider_receipt_ref === "reports/runtime_to_review_v1/serum_bottle_exact_live_probe_receipt_20260601.json" &&
    decision.receipt_refs_if_activated_later.artifact_record_ref === "reports/runtime_to_review_v1/serum_bottle_exact_live_probe_artifact_record_20260601.json" &&
    decision.receipt_refs_if_activated_later.review_bridge_ref === "review_console/live_receipt_bridge/serum_bottle_exact_live_probe_20260601.review_entry.json"
  );
  check("output_directory_state_required", () =>
    decision.output_directory_state_required_at_activation.gate_ref === outputGatePath &&
    decision.output_directory_state_required_at_activation.unexpected_existing_files_allowed === false &&
    decision.output_directory_state_required_at_activation.overwrite_existing_files_allowed === false &&
    decision.output_directory_state_required_at_activation.directory_creation_allowed_by_gate === false &&
    decision.output_directory_state_required_at_activation.directory_missing_or_empty_required === true
  );
  check("pre_activation_validation_includes_gate_chain", () =>
    decision.pre_activation_validation_required.includes("npm run validate:runtime-to-review-serum-bottle-output-directory-preflight") &&
    decision.pre_activation_validation_required.includes("npm run validate:runtime-to-review-serum-bottle-exact-live-activation-draft") &&
    decision.pre_activation_validation_required.includes("npm run validate:runtime-to-review-per-packet-activation-preflight") &&
    decision.pre_activation_validation_required.includes("npm run validate:runtime-to-review-per-packet-owner-runtime") &&
    decision.pre_activation_validation_required.includes(`npm run ${packageScriptName}`) &&
    decision.pre_activation_validation_required.includes("npm run validate:validation-manifest") &&
    decision.pre_activation_validation_required.includes("git diff --check")
  );
  check("forbidden_now_all_false", () => Object.values(decision.forbidden_now).every((value) => value === false));
  check("stop_conditions_preserve_manual_activation_boundary", () =>
    decision.stop_conditions.includes("can_execute_now remains false in this draft") &&
    decision.stop_conditions.includes(`missing exact owner confirmation phrase ${ownerPhrase}`) &&
    decision.stop_conditions.includes(`missing runner confirmation phrase ${runnerPhrase}`) &&
    decision.stop_conditions.includes("output directory preflight gate is missing or failing") &&
    decision.stop_conditions.includes("memory, accepted_samples, production candidate, tag, release, deploy, push, force push, or history rewrite is required")
  );
  check("package_script_registered", () =>
    packageJson.scripts &&
    packageJson.scripts[packageScriptName] === "node scripts/validate_runtime_to_review_v1_serum_bottle_live_activation_decision_packet_draft.js"
  );
  check("manifest_entry_registered", () => {
    const entry = manifest.validators.find((item) => item.id === manifestId);
    return entry &&
      entry.command === `npm run ${packageScriptName}` &&
      entry.script === "scripts/validate_runtime_to_review_v1_serum_bottle_live_activation_decision_packet_draft.js" &&
      entry.tier === "targeted" &&
      entry.domain === "runtime_to_review" &&
      entry.status === "active" &&
      entry.trigger_paths.includes(decisionPath) &&
      entry.trigger_paths.includes(outputGatePath) &&
      entry.trigger_paths.includes(activationDraftPath) &&
      entry.trigger_paths.includes(ownerRuntimePath) &&
      entry.trigger_paths.includes(promptPath) &&
      entry.required_for.includes("runtime_to_review_serum_bottle_live_activation_decision_draft_patch");
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    decision: decisionPath,
    can_execute_now: decision.can_execute_now,
    decision_authorized_by_this_packet: decision.decision_authorized_by_this_packet,
    execution_authorized_by_this_packet: decision.execution_authorized_by_this_packet,
    required_future_owner_confirmation_phrase: decision.required_future_owner_confirmation_phrase,
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
