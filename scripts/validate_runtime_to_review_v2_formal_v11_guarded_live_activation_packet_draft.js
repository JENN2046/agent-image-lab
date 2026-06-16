#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v2_formal_v11_guarded_live_activation_packet_draft";
const draftRef = "reports/runtime_to_review_v2/r2r_v2_formal_v11_guarded_live_activation_packet_draft_20260616.json";
const checklistRef = "reports/runtime_to_review_v2/r2r_v2_formal_v11_live_activation_packet_checklist_20260616.json";
const gateRef = "reports/runtime_to_review_v2/r2r_v2_formal_v11_review_criteria_preflight_gate_20260616.json";
const promptRef = "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v11.yaml";
const fixtureRef = "tests/fixtures/runtime_kernel_v2_formal_v11_lantern_sku_task.fixture.json";
const ownerRuntimeRef = "adapters/runtime/native_doubao_runtime_v1_real_bound_owner_runtime.js";
const delegateRef = "adapters/runtime/native_doubao_runtime_v1_provider_delegate.js";
const runnerRef = "scripts/run_runtime_to_review_v1_guarded_live_probe.js";
const packageScriptName = "validate:runtime-to-review-formal-v11-activation-draft";
const manifestId = "runtime_to_review_formal_v11_guarded_live_activation_packet_draft";
const exactPhrase = "RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE";

let passed = true;
const results = [];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repo root: ${relativePath}`);
  }
  return resolved;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
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

function includesAll(values, tokens) {
  const text = (values || []).join("\n");
  return tokens.every((token) => text.includes(token));
}

function allFalse(flags) {
  return flags && Object.values(flags).every((value) => value === false);
}

function main() {
  runNode(["--check", runnerRef]);
  runNode(["--check", "scripts/validate_runtime_to_review_v2_formal_v11_guarded_live_activation_packet_draft.js"]);

  const draft = readJson(draftRef);
  const checklist = readJson(checklistRef);
  const gate = readJson(gateRef);
  const fixture = readJson(fixtureRef);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const roadmap = readText("docs/RUNTIME_TO_PRODUCTION_LANDING_ROADMAP.md");
  const currentState = readText("CURRENT_STATE.md");
  const runner = require(repoPath(runnerRef));

  check("draft_is_inactive_and_not_authorization", () =>
    draft.schema === "runtime_to_review_v2_formal_v11_guarded_live_activation_packet_draft.v1" &&
    draft.status === "draft_inactive_not_executed" &&
    draft.can_execute_now === false &&
    draft.execution_authorized_by_this_packet === false &&
    draft.live_probe_authorized_by_this_packet === false &&
    draft.requires_separate_owner_activation === true
  );
  check("source_refs_match_checklist_gate_prompt", () =>
    draft.source_checklist_ref === checklistRef &&
    draft.source_review_criteria_gate_ref === gateRef &&
    draft.target_prompt_package_ref === promptRef &&
    draft.target_fixture_ref === fixtureRef &&
    checklist.future_activation_packet_required.must_reference_this_checklist === checklistRef &&
    checklist.future_activation_packet_required.must_reference_review_criteria_gate === gateRef &&
    gate.pre_live_probe_gate.required_prompt_package_ref === promptRef
  );
  check("fixture_is_formal_v11_one_image_task", () =>
    fixture.prompt_package_ref === promptRef &&
    fixture.max_images === 1 &&
    fixture.output_scope === "run_directory_only" &&
    fixture.output_directory_ref === draft.target_output_directory_ref &&
    fixture.review_criteria_ref === gateRef &&
    fixture.activation_checklist_ref === checklistRef &&
    fixture.secret_value_read_allowed === false &&
    fixture.retry_allowed === false
  );
  check("future_active_command_shape_is_exact_but_not_authorized", () =>
    draft.exact_live_command_shape_if_separately_activated.includes(fixtureRef) &&
    draft.exact_live_command_shape_if_separately_activated.includes(delegateRef) &&
    draft.exact_live_command_shape_if_separately_activated.includes(ownerRuntimeRef) &&
    draft.exact_live_command_shape_if_separately_activated.includes(exactPhrase) &&
    draft.exact_live_command_shape_if_separately_activated.includes("1") &&
    !draft.exact_live_command_shape_if_separately_activated.includes("--preflight-only") &&
    draft.can_execute_now === false
  );
  check("preflight_only_command_is_required", () =>
    draft.preflight_only_command_required_before_activation.includes("--preflight-only") &&
    draft.preflight_only_command_required_before_activation.includes(fixtureRef) &&
    draft.preflight_only_command_required_before_activation.includes(ownerRuntimeRef) &&
    draft.preflight_only_command_required_before_activation.includes(exactPhrase)
  );
  check("runner_phrase_matches_packet", () =>
    runner.exactConfirmation === exactPhrase &&
    draft.required_future_owner_confirmation_phrase === exactPhrase
  );
  check("budget_is_zero_now_one_shot_later", () =>
    draft.current_budget.max_provider_calls === 0 &&
    draft.current_budget.max_plugin_calls === 0 &&
    draft.current_budget.max_api_calls === 0 &&
    draft.current_budget.max_images === 0 &&
    draft.current_budget.max_live_probe_attempts === 0 &&
    draft.future_activation_budget_ceiling.max_provider_calls === 1 &&
    draft.future_activation_budget_ceiling.max_plugin_calls === 1 &&
    draft.future_activation_budget_ceiling.max_api_calls === 1 &&
    draft.future_activation_budget_ceiling.max_images === 1 &&
    draft.future_activation_budget_ceiling.max_live_probe_attempts === 1 &&
    draft.future_activation_budget_ceiling.retry_allowed === false
  );
  check("output_and_receipt_refs_are_planned_only", () =>
    draft.target_output_directory_ref === "runs/real_generation/runtime_to_review_v2_formal_v11_lantern_sku/" &&
    draft.planned_receipt_ref_if_activated_later === "reports/runtime_to_review_v2/r2r_v2_formal_v11_guarded_live_probe_receipt_20260616.json" &&
    draft.planned_artifact_record_ref_if_activated_later === "reports/runtime_to_review_v2/r2r_v2_formal_v11_guarded_live_probe_artifact_record_20260616.json" &&
    draft.planned_review_bridge_ref_if_activated_later === "review_console/live_receipt_bridge/r2r_v2_formal_v11_lantern_sku/bridge_entry.json" &&
    draft.output_directory_preflight_required.overwrite_existing_files_allowed === false &&
    draft.output_directory_preflight_required.unexpected_existing_files_allowed === false
  );
  check("receipt_requirements_cover_review_loop", () =>
    includesAll(draft.future_activation_receipt_required_fields, [
      "packet_id",
      "source_checklist_ref",
      "source_review_criteria_gate_ref",
      "target_prompt_package_ref",
      "activated_by_owner_confirmation",
      "provider_contact_performed",
      "plugin_call_performed",
      "api_call_performed",
      "image_generation_performed",
      "output_refs",
      "artifact_record_ref",
      "audit_receipt_ref",
      "review_bridge_ref",
      "human_review_next_step",
    ])
  );
  check("owner_runtime_scope_alignment_is_explicit", () =>
    draft.owner_runtime_module_required === ownerRuntimeRef &&
    draft.owner_runtime_scope_alignment_required === true &&
    draft.owner_runtime_scope_alignment_note.includes("v11 prompt package") &&
    draft.stop_conditions.includes("owner runtime scope is not aligned to formal v11 prompt and output directory")
  );
  check("required_checks_include_gate_checklist_self_and_manifest", () =>
    draft.required_checks_before_any_future_execution.includes("npm run validate:runtime-to-review-real-bound-owner-runtime-local-readiness") &&
    draft.required_checks_before_any_future_execution.includes("npm run validate:runtime-to-review-formal-v11-prompt-package") &&
    draft.required_checks_before_any_future_execution.includes("npm run validate:runtime-to-review-formal-v11-review-criteria-preflight") &&
    draft.required_checks_before_any_future_execution.includes("npm run validate:runtime-to-review-formal-v11-live-activation-checklist") &&
    draft.required_checks_before_any_future_execution.includes(`npm run ${packageScriptName}`) &&
    draft.required_checks_before_any_future_execution.includes("npm run validate:validation-manifest")
  );
  check("forbidden_now_all_false", () => allFalse(draft.forbidden_now));
  check("stop_conditions_preserve_red_lanes", () =>
    includesAll(draft.stop_conditions, [
      "can_execute_now remains false",
      "missing separate owner activation phrase",
      "missing explicit owner-provided VCPToolBox root",
      "preflight-only command fails",
      "output directory contains unexpected existing files",
      "retry is requested",
      "secret value read",
      "memory, accepted_samples, production candidate, archive, tag, release, deploy, push",
    ])
  );
  check("package_script_registered", () =>
    packageJson.scripts &&
    packageJson.scripts[packageScriptName] === "node scripts/validate_runtime_to_review_v2_formal_v11_guarded_live_activation_packet_draft.js"
  );
  check("manifest_entry_registered", () => {
    const entry = manifest.validators.find((item) => item.id === manifestId);
    return entry &&
      entry.command === `npm run ${packageScriptName}` &&
      entry.script === "scripts/validate_runtime_to_review_v2_formal_v11_guarded_live_activation_packet_draft.js" &&
      entry.tier === "targeted" &&
      entry.domain === "runtime_to_review" &&
      entry.status === "active" &&
      entry.trigger_paths.includes(draftRef) &&
      entry.trigger_paths.includes(fixtureRef) &&
      entry.trigger_paths.includes(checklistRef) &&
      entry.trigger_paths.includes(gateRef) &&
      entry.trigger_paths.includes(promptRef) &&
      entry.required_for.includes("formal_v11_guarded_live_activation_packet_draft");
  });
  check("roadmap_and_current_state_reference_draft", () =>
    roadmap.includes("runtime_to_review_v2_formal_v11_guarded_live_activation_packet_draft") &&
    roadmap.includes(draftRef) &&
    currentState.includes("review_feedback_formal_v11_guarded_live_activation_packet_draft") &&
    currentState.includes(draftRef)
  );

  const output = {
    passed,
    validator,
    draft_ref: draftRef,
    fixture_ref: fixtureRef,
    can_execute_now: draft.can_execute_now,
    live_probe_authorized_by_this_packet: draft.live_probe_authorized_by_this_packet,
    separate_owner_activation_required: true,
    exact_phrase_required: exactPhrase,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
    archive_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    secret_value_read_performed: false,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results,
  };

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
