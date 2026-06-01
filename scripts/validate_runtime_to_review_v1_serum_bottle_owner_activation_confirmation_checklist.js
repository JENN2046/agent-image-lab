#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_serum_bottle_owner_activation_confirmation_checklist";
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
const packageScriptName = "validate:runtime-to-review-serum-bottle-owner-activation-checklist";
const manifestId = "runtime_to_review_serum_bottle_owner_activation_checklist";

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
  runNode(["--check", "scripts/validate_runtime_to_review_v1_serum_bottle_owner_activation_confirmation_checklist.js"]);
  runNode(["--check", runnerPath]);
  runNode(["--check", ownerRuntimePath]);

  const checklist = readJson(checklistPath);
  const decision = readJson(decisionPath);
  const outputGate = readJson(outputGatePath);
  const activationDraft = readJson(activationDraftPath);
  const perPacketPreflight = readJson(perPacketPreflightPath);
  const inactivePacket = readJson(inactivePacketPath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const runner = require(repoPath(runnerPath));

  check("checklist_exists", () => fs.existsSync(repoPath(checklistPath)));
  check("schema_and_inactive_status", () =>
    checklist.schema === "runtime_to_review_v1_owner_activation_confirmation_checklist.v1" &&
    checklist.status === "draft_inactive_not_executed" &&
    checklist.can_execute_now === false &&
    checklist.checklist_authorizes_execution === false &&
    checklist.decision_authorized_by_this_checklist === false &&
    checklist.execution_authorized_by_this_checklist === false &&
    checklist.live_probe_authorized_by_this_checklist === false
  );
  check("phrases_are_exact_and_separate", () =>
    checklist.required_future_owner_confirmation_phrase === ownerPhrase &&
    checklist.runner_confirmation_phrase_still_required === runnerPhrase &&
    checklist.required_future_owner_confirmation_phrase !== checklist.runner_confirmation_phrase_still_required &&
    runner.exactConfirmation === runnerPhrase &&
    decision.required_future_owner_confirmation_phrase === ownerPhrase &&
    activationDraft.required_future_owner_confirmation_phrase === ownerPhrase
  );
  check("source_refs_align", () =>
    checklist.source_decision_packet_ref === decisionPath &&
    checklist.source_output_directory_gate_ref === outputGatePath &&
    checklist.source_activation_draft_ref === activationDraftPath &&
    checklist.source_per_packet_activation_preflight_ref === perPacketPreflightPath &&
    checklist.source_inactive_packet_ref === inactivePacketPath &&
    checklist.owner_runtime_module === ownerRuntimePath &&
    checklist.provider_delegate_module === delegatePath &&
    checklist.runner === runnerPath &&
    checklist.target_fixture_ref === fixturePath &&
    checklist.target_prompt_package_ref === promptPath &&
    checklist.target_output_directory_ref === outputDir
  );
  check("upstream_chain_still_inactive_and_aligned", () =>
    decision.can_execute_now === false &&
    decision.execution_authorized_by_this_packet === false &&
    decision.target_output_directory_ref === outputDir &&
    outputGate.can_execute_now === false &&
    outputGate.output_write_authorized_by_this_gate === false &&
    outputGate.directory_creation_authorized_by_this_gate === false &&
    outputGate.target_output_directory_ref === outputDir &&
    activationDraft.can_execute_now === false &&
    activationDraft.execution_authorized_by_this_packet === false &&
    activationDraft.target_output_directory_ref === outputDir &&
    perPacketPreflight.can_execute_now === false &&
    perPacketPreflight.target_output_directory_ref === outputDir &&
    inactivePacket.can_execute_now === false &&
    inactivePacket.output_directory_ref === outputDir
  );
  check("owner_acknowledgement_items_are_complete", () => {
    const ids = checklist.owner_confirmation_must_acknowledge.map((item) => item.id);
    return checklist.owner_confirmation_must_acknowledge.length === 5 &&
      ["exact_owner_phrase", "runner_phrase_separate", "single_image_budget", "output_overwrite_boundary", "receipt_before_cleanup"].every((id) => ids.includes(id)) &&
      checklist.owner_confirmation_must_acknowledge.every((item) => item.required === true && typeof item.expected_text === "string" && item.expected_text.length > 0);
  });
  check("future_scope_is_one_image_no_retry_no_overwrite", () =>
    checklist.future_activation_allowed_scope.max_provider_calls === 1 &&
    checklist.future_activation_allowed_scope.max_plugin_calls === 1 &&
    checklist.future_activation_allowed_scope.max_api_calls === 1 &&
    checklist.future_activation_allowed_scope.max_images === 1 &&
    checklist.future_activation_allowed_scope.max_live_probe_attempts === 1 &&
    checklist.future_activation_allowed_scope.retry_allowed === false &&
    checklist.future_activation_allowed_scope.overwrite_existing_files_allowed === false &&
    checklist.future_activation_allowed_scope.directory_creation_allowed_by_this_checklist === false &&
    checklist.future_activation_allowed_scope.output_write_authorized_by_this_checklist === false &&
    checklist.future_activation_allowed_scope.memory_write_allowed === false &&
    checklist.future_activation_allowed_scope.DailyNote_write_allowed === false &&
    checklist.future_activation_allowed_scope.accepted_samples_write_allowed === false &&
    checklist.future_activation_allowed_scope.production_candidate_write_allowed === false &&
    checklist.future_activation_allowed_scope.push_allowed === false &&
    checklist.future_activation_allowed_scope.tag_allowed === false &&
    checklist.future_activation_allowed_scope.release_allowed === false &&
    checklist.future_activation_allowed_scope.deploy_allowed === false
  );
  check("pre_run_validators_include_full_chain_and_self", () =>
    checklist.pre_run_validators_required.includes("node --check scripts/run_runtime_to_review_v1_guarded_live_probe.js") &&
    checklist.pre_run_validators_required.includes("node --check adapters/runtime/native_doubao_runtime_v1_per_packet_owner_runtime.js") &&
    checklist.pre_run_validators_required.includes("npm run validate:runtime-to-review-serum-bottle-output-directory-preflight") &&
    checklist.pre_run_validators_required.includes("npm run validate:runtime-to-review-serum-bottle-exact-live-activation-draft") &&
    checklist.pre_run_validators_required.includes("npm run validate:runtime-to-review-per-packet-activation-preflight") &&
    checklist.pre_run_validators_required.includes("npm run validate:runtime-to-review-per-packet-owner-runtime") &&
    checklist.pre_run_validators_required.includes("npm run validate:runtime-to-review-serum-bottle-inactive-preflight") &&
    checklist.pre_run_validators_required.includes("npm run validate:runtime-to-review-serum-bottle-live-activation-decision-draft") &&
    checklist.pre_run_validators_required.includes(`npm run ${packageScriptName}`) &&
    checklist.pre_run_validators_required.includes("npm run validate:validation-manifest") &&
    checklist.pre_run_validators_required.includes("npm run validate:targeted-plan") &&
    checklist.pre_run_validators_required.includes("git diff --check")
  );
  check("pre_run_state_blocks_overwrite_secret_uncapped_cost", () =>
    checklist.pre_run_state_required.worktree_must_be_clean_or_explicitly_scoped === true &&
    checklist.pre_run_state_required.target_output_directory_missing_or_empty === true &&
    checklist.pre_run_state_required.unexpected_existing_files_allowed === false &&
    checklist.pre_run_state_required.overwrite_existing_files_allowed === false &&
    checklist.pre_run_state_required.secret_value_read_allowed === false &&
    checklist.pre_run_state_required.raw_private_data_print_allowed === false &&
    checklist.pre_run_state_required.uncapped_cost_allowed === false &&
    checklist.pre_run_state_required.unbounded_loop_allowed === false
  );
  check("separate_active_packet_required_before_execution", () =>
    checklist.future_active_packet_required_before_execution.required === true &&
    checklist.future_active_packet_required_before_execution.must_be_separate_from_this_checklist === true &&
    checklist.future_active_packet_required_before_execution.must_flip_can_execute_now === true &&
    checklist.future_active_packet_required_before_execution.must_flip_execution_authorized_by_packet === true &&
    checklist.future_active_packet_required_before_execution.must_reference_owner_confirmation_phrase === ownerPhrase &&
    checklist.future_active_packet_required_before_execution.must_reference_runner_confirmation_phrase === runnerPhrase &&
    checklist.future_active_packet_required_before_execution.must_reference_this_checklist === checklistPath
  );
  check("future_owner_template_is_not_authorization", () =>
    checklist.owner_confirmation_template_for_future_use_only.status === "template_inactive_not_owner_issued" &&
    checklist.owner_confirmation_template_for_future_use_only.exact_phrase === ownerPhrase &&
    checklist.owner_confirmation_template_for_future_use_only.must_not_be_treated_as_authorization_from_this_file === true
  );
  check("forbidden_now_all_false", () => Object.values(checklist.forbidden_now).every((value) => value === false));
  check("stop_conditions_preserve_red_lanes", () =>
    checklist.stop_conditions.includes("can_execute_now remains false in this checklist") &&
    checklist.stop_conditions.includes("checklist_authorizes_execution remains false") &&
    checklist.stop_conditions.includes(`missing exact owner confirmation phrase ${ownerPhrase}`) &&
    checklist.stop_conditions.includes(`missing runner confirmation phrase ${runnerPhrase}`) &&
    checklist.stop_conditions.includes("any pre-run validator fails") &&
    checklist.stop_conditions.includes("target output directory contains unexpected existing files") &&
    checklist.stop_conditions.includes("overwrite, delete, memory write, accepted sample promotion, production candidate write, tag, release, deploy, push, force push, or history rewrite is required") &&
    checklist.stop_conditions.includes("secret value read or env file content read is required by Agent Image Lab") &&
    checklist.stop_conditions.includes("max_images is not exactly 1") &&
    checklist.stop_conditions.includes("retry is requested") &&
    checklist.stop_conditions.includes("provider budget is uncapped or unknown")
  );
  check("package_script_registered", () =>
    packageJson.scripts &&
    packageJson.scripts[packageScriptName] === "node scripts/validate_runtime_to_review_v1_serum_bottle_owner_activation_confirmation_checklist.js"
  );
  check("manifest_entry_registered", () => {
    const entry = manifest.validators.find((item) => item.id === manifestId);
    return entry &&
      entry.command === `npm run ${packageScriptName}` &&
      entry.script === "scripts/validate_runtime_to_review_v1_serum_bottle_owner_activation_confirmation_checklist.js" &&
      entry.tier === "targeted" &&
      entry.domain === "runtime_to_review" &&
      entry.status === "active" &&
      entry.trigger_paths.includes(checklistPath) &&
      entry.trigger_paths.includes(decisionPath) &&
      entry.trigger_paths.includes(outputGatePath) &&
      entry.trigger_paths.includes(activationDraftPath) &&
      entry.trigger_paths.includes(perPacketPreflightPath) &&
      entry.trigger_paths.includes(inactivePacketPath) &&
      entry.trigger_paths.includes(ownerRuntimePath) &&
      entry.trigger_paths.includes(promptPath) &&
      entry.required_for.includes("runtime_to_review_serum_bottle_owner_activation_checklist_patch");
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    checklist: checklistPath,
    can_execute_now: checklist.can_execute_now,
    checklist_authorizes_execution: checklist.checklist_authorizes_execution,
    required_future_owner_confirmation_phrase: checklist.required_future_owner_confirmation_phrase,
    runner_confirmation_phrase_still_required: checklist.runner_confirmation_phrase_still_required,
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
