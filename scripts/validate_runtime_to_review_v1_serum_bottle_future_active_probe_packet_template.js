#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_serum_bottle_future_active_probe_packet_template";
const templatePath = "reports/runtime_to_review_v1/serum_bottle_future_active_probe_packet_template_20260601.json";
const checklistPath = "reports/runtime_to_review_v1/serum_bottle_owner_activation_confirmation_checklist_20260601.json";
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
const packageScriptName = "validate:runtime-to-review-serum-bottle-future-active-template";
const manifestId = "runtime_to_review_serum_bottle_future_active_template";

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
  runNode(["--check", "scripts/validate_runtime_to_review_v1_serum_bottle_future_active_probe_packet_template.js"]);
  runNode(["--check", runnerPath]);
  runNode(["--check", ownerRuntimePath]);

  const template = readJson(templatePath);
  const checklist = readJson(checklistPath);
  const decision = readJson(decisionPath);
  const outputGate = readJson(outputGatePath);
  const activationDraft = readJson(activationDraftPath);
  const perPacketPreflight = readJson(perPacketPreflightPath);
  const inactivePacket = readJson(inactivePacketPath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const runner = require(repoPath(runnerPath));

  check("template_exists", () => fs.existsSync(repoPath(templatePath)));
  check("schema_and_inactive_status", () =>
    template.schema === "runtime_to_review_v1_serum_bottle_future_active_probe_packet_template.v1" &&
    template.status === "template_inactive_not_executed" &&
    template.can_execute_now === false &&
    template.template_authorizes_execution === false &&
    template.decision_authorized_by_this_template === false &&
    template.execution_authorized_by_this_template === false &&
    template.live_probe_authorized_by_this_template === false
  );
  check("phrases_are_exact_and_separate", () =>
    template.required_future_owner_confirmation_phrase === ownerPhrase &&
    template.runner_confirmation_phrase_still_required === runnerPhrase &&
    template.required_future_owner_confirmation_phrase !== template.runner_confirmation_phrase_still_required &&
    runner.exactConfirmation === runnerPhrase &&
    checklist.required_future_owner_confirmation_phrase === ownerPhrase &&
    decision.required_future_owner_confirmation_phrase === ownerPhrase &&
    activationDraft.required_future_owner_confirmation_phrase === ownerPhrase
  );
  check("source_refs_align", () =>
    template.source_owner_confirmation_checklist_ref === checklistPath &&
    template.source_decision_packet_ref === decisionPath &&
    template.source_output_directory_gate_ref === outputGatePath &&
    template.source_activation_draft_ref === activationDraftPath &&
    template.source_per_packet_activation_preflight_ref === perPacketPreflightPath &&
    template.source_inactive_packet_ref === inactivePacketPath &&
    template.owner_runtime_module === ownerRuntimePath &&
    template.provider_delegate_module === delegatePath &&
    template.runner === runnerPath &&
    template.target_fixture_ref === fixturePath &&
    template.target_prompt_package_ref === promptPath &&
    template.target_output_directory_ref === outputDir
  );
  check("upstream_chain_still_inactive_and_aligned", () =>
    checklist.can_execute_now === false &&
    checklist.checklist_authorizes_execution === false &&
    decision.can_execute_now === false &&
    decision.execution_authorized_by_this_packet === false &&
    outputGate.can_execute_now === false &&
    outputGate.output_write_authorized_by_this_gate === false &&
    activationDraft.can_execute_now === false &&
    activationDraft.execution_authorized_by_this_packet === false &&
    perPacketPreflight.can_execute_now === false &&
    inactivePacket.can_execute_now === false &&
    decision.target_output_directory_ref === outputDir &&
    outputGate.target_output_directory_ref === outputDir &&
    activationDraft.target_output_directory_ref === outputDir &&
    perPacketPreflight.target_output_directory_ref === outputDir &&
    inactivePacket.output_directory_ref === outputDir
  );
  check("future_active_values_are_fenced_not_effective", () =>
    template.future_active_packet_values_if_owner_issued_later.can_execute_now === true &&
    template.future_active_packet_values_if_owner_issued_later.decision_authorized_by_packet === true &&
    template.future_active_packet_values_if_owner_issued_later.execution_authorized_by_packet === true &&
    template.future_active_packet_values_if_owner_issued_later.live_probe_authorized_by_packet === true &&
    template.future_active_packet_values_if_owner_issued_later.activated_by_owner_confirmation === ownerPhrase &&
    template.future_active_packet_values_if_owner_issued_later.runner_confirmation_phrase === runnerPhrase &&
    template.future_active_packet_values_if_owner_issued_later.template_values_effective_now === false &&
    template.can_execute_now === false
  );
  check("budget_is_one_image_no_retry", () =>
    template.future_activation_budget_ceiling.max_provider_calls === 1 &&
    template.future_activation_budget_ceiling.max_plugin_calls === 1 &&
    template.future_activation_budget_ceiling.max_api_calls === 1 &&
    template.future_activation_budget_ceiling.max_images === 1 &&
    template.future_activation_budget_ceiling.max_live_probe_attempts === 1 &&
    template.future_activation_budget_ceiling.retry_allowed === false &&
    template.future_activation_budget_ceiling.max_runtime_probe_minutes === 10
  );
  check("pre_run_validators_include_full_chain_and_self", () =>
    template.pre_run_validators_required.includes("node --check scripts/run_runtime_to_review_v1_guarded_live_probe.js") &&
    template.pre_run_validators_required.includes("node --check adapters/runtime/native_doubao_runtime_v1_per_packet_owner_runtime.js") &&
    template.pre_run_validators_required.includes("npm run validate:runtime-to-review-serum-bottle-output-directory-preflight") &&
    template.pre_run_validators_required.includes("npm run validate:runtime-to-review-serum-bottle-exact-live-activation-draft") &&
    template.pre_run_validators_required.includes("npm run validate:runtime-to-review-per-packet-activation-preflight") &&
    template.pre_run_validators_required.includes("npm run validate:runtime-to-review-per-packet-owner-runtime") &&
    template.pre_run_validators_required.includes("npm run validate:runtime-to-review-serum-bottle-inactive-preflight") &&
    template.pre_run_validators_required.includes("npm run validate:runtime-to-review-serum-bottle-live-activation-decision-draft") &&
    template.pre_run_validators_required.includes("npm run validate:runtime-to-review-serum-bottle-owner-activation-checklist") &&
    template.pre_run_validators_required.includes(`npm run ${packageScriptName}`) &&
    template.pre_run_validators_required.includes("npm run validate:validation-manifest") &&
    template.pre_run_validators_required.includes("npm run validate:targeted-plan") &&
    template.pre_run_validators_required.includes("git diff --check")
  );
  check("command_shape_is_exact_but_not_authorized", () =>
    Array.isArray(template.exact_live_command_shape_if_separately_owner_issued_later) &&
    template.exact_live_command_shape_if_separately_owner_issued_later.includes(fixturePath) &&
    template.exact_live_command_shape_if_separately_owner_issued_later.includes(delegatePath) &&
    template.exact_live_command_shape_if_separately_owner_issued_later.includes(ownerRuntimePath) &&
    template.exact_live_command_shape_if_separately_owner_issued_later.includes(runnerPhrase) &&
    template.exact_live_command_shape_if_separately_owner_issued_later.includes("1") &&
    !template.exact_live_command_shape_if_separately_owner_issued_later.includes("--preflight-only") &&
    template.template_authorizes_execution === false
  );
  check("output_directory_and_receipts_bound", () =>
    template.output_directory_state_required_at_activation.gate_ref === outputGatePath &&
    template.output_directory_state_required_at_activation.directory_missing_or_empty_required === true &&
    template.output_directory_state_required_at_activation.unexpected_existing_files_allowed === false &&
    template.output_directory_state_required_at_activation.overwrite_existing_files_allowed === false &&
    template.output_directory_state_required_at_activation.directory_creation_allowed_by_template === false &&
    template.receipt_refs_if_activated_later.provider_receipt_ref === "reports/runtime_to_review_v1/serum_bottle_exact_live_probe_receipt_20260601.json" &&
    template.receipt_refs_if_activated_later.artifact_record_ref === "reports/runtime_to_review_v1/serum_bottle_exact_live_probe_artifact_record_20260601.json" &&
    template.receipt_refs_if_activated_later.review_bridge_ref === "review_console/live_receipt_bridge/serum_bottle_exact_live_probe_20260601.review_entry.json"
  );
  check("future_owner_action_must_create_new_packet", () =>
    template.must_be_filled_by_future_owner_action.required === true &&
    template.must_be_filled_by_future_owner_action.must_create_new_packet_ref === true &&
    template.must_be_filled_by_future_owner_action.must_not_modify_this_template_in_place === true &&
    template.must_be_filled_by_future_owner_action.must_rerun_pre_run_validators_immediately_before_execution === true &&
    template.must_be_filled_by_future_owner_action.must_record_receipt_after_execution === true
  );
  check("forbidden_now_all_false", () => Object.values(template.forbidden_now).every((value) => value === false));
  check("stop_conditions_preserve_template_boundary", () =>
    template.stop_conditions.includes("can_execute_now remains false in this template") &&
    template.stop_conditions.includes("template_authorizes_execution remains false") &&
    template.stop_conditions.includes("template values are treated as effective now") &&
    template.stop_conditions.includes("future owner action tries to modify this template in place instead of creating a separate packet") &&
    template.stop_conditions.includes(`missing exact owner confirmation phrase ${ownerPhrase}`) &&
    template.stop_conditions.includes(`missing runner confirmation phrase ${runnerPhrase}`) &&
    template.stop_conditions.includes("any pre-run validator fails") &&
    template.stop_conditions.includes("target output directory contains unexpected existing files") &&
    template.stop_conditions.includes("max_images is not exactly 1") &&
    template.stop_conditions.includes("retry is requested") &&
    template.stop_conditions.includes("provider budget is uncapped or unknown") &&
    template.stop_conditions.includes("overwrite, delete, memory write, accepted sample promotion, production candidate write, tag, release, deploy, push, force push, or history rewrite is required") &&
    template.stop_conditions.includes("secret value read or env file content read is required by Agent Image Lab")
  );
  check("package_script_registered", () =>
    packageJson.scripts &&
    packageJson.scripts[packageScriptName] === "node scripts/validate_runtime_to_review_v1_serum_bottle_future_active_probe_packet_template.js"
  );
  check("manifest_entry_registered", () => {
    const entry = manifest.validators.find((item) => item.id === manifestId);
    return entry &&
      entry.command === `npm run ${packageScriptName}` &&
      entry.script === "scripts/validate_runtime_to_review_v1_serum_bottle_future_active_probe_packet_template.js" &&
      entry.tier === "targeted" &&
      entry.domain === "runtime_to_review" &&
      entry.status === "active" &&
      entry.trigger_paths.includes(templatePath) &&
      entry.trigger_paths.includes(checklistPath) &&
      entry.trigger_paths.includes(decisionPath) &&
      entry.trigger_paths.includes(outputGatePath) &&
      entry.trigger_paths.includes(activationDraftPath) &&
      entry.trigger_paths.includes(perPacketPreflightPath) &&
      entry.trigger_paths.includes(inactivePacketPath) &&
      entry.trigger_paths.includes(ownerRuntimePath) &&
      entry.trigger_paths.includes(promptPath) &&
      entry.required_for.includes("runtime_to_review_serum_bottle_future_active_template_patch");
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    template: templatePath,
    can_execute_now: template.can_execute_now,
    template_authorizes_execution: template.template_authorizes_execution,
    required_future_owner_confirmation_phrase: template.required_future_owner_confirmation_phrase,
    runner_confirmation_phrase_still_required: template.runner_confirmation_phrase_still_required,
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
