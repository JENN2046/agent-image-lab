#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v2_formal_v11_live_activation_packet_checklist";
const checklistRef = "reports/runtime_to_review_v2/r2r_v2_formal_v11_live_activation_packet_checklist_20260616.json";
const gateRef = "reports/runtime_to_review_v2/r2r_v2_formal_v11_review_criteria_preflight_gate_20260616.json";
const promptRef = "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v11.yaml";
const readinessValidator = "scripts/validate_runtime_to_review_v1_real_bound_owner_runtime_local_readiness.js";
const realBoundOwnerRuntime = "adapters/runtime/native_doubao_runtime_v1_real_bound_owner_runtime.js";
const providerDelegate = "adapters/runtime/native_doubao_runtime_v1_provider_delegate.js";
const guardedRunner = "scripts/run_runtime_to_review_v1_guarded_live_probe.js";
const packageScriptName = "validate:runtime-to-review-formal-v11-live-activation-checklist";
const manifestId = "runtime_to_review_formal_v11_live_activation_packet_checklist";
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

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
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

function allFalse(flags) {
  return flags && Object.values(flags).every((value) => value === false);
}

function hasRequiredIds(items, ids) {
  const actual = new Set((items || []).map((item) => item.id));
  return ids.every((id) => actual.has(id));
}

function includesAll(values, tokens) {
  const text = (values || []).join("\n");
  return tokens.every((token) => text.includes(token));
}

function main() {
  runNode(["--check", "scripts/validate_runtime_to_review_v2_formal_v11_live_activation_packet_checklist.js"]);

  const checklist = readJson(checklistRef);
  const gate = readJson(gateRef);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const roadmap = readText("docs/RUNTIME_TO_PRODUCTION_LANDING_ROADMAP.md");
  const currentState = readText("CURRENT_STATE.md");

  check("checklist_exists_and_is_inactive", () =>
    checklist.schema === "runtime_to_review_v2_formal_v11_live_activation_packet_checklist.v1" &&
    checklist.checklist_id === "r2r_v2_formal_v11_live_activation_packet_checklist_20260616" &&
    checklist.status === "prepared_inactive_green_checklist_no_live_execution" &&
    checklist.can_execute_now === false &&
    checklist.checklist_authorizes_execution === false &&
    checklist.live_probe_authorized_by_this_checklist === false
  );
  check("source_refs_align_to_formal_v11_chain", () =>
    checklist.source_refs.formal_v11_review_criteria_preflight_gate_ref === gateRef &&
    checklist.source_refs.formal_v11_prompt_package_ref === promptRef &&
    checklist.source_refs.real_bound_owner_runtime_local_readiness_validator === readinessValidator &&
    checklist.source_refs.real_bound_owner_runtime_module === realBoundOwnerRuntime &&
    checklist.source_refs.provider_delegate_module === providerDelegate &&
    checklist.source_refs.guarded_live_probe_runner === guardedRunner &&
    fs.existsSync(repoPath(gateRef)) &&
    fs.existsSync(repoPath(promptRef)) &&
    fs.existsSync(repoPath(readinessValidator)) &&
    fs.existsSync(repoPath(realBoundOwnerRuntime)) &&
    fs.existsSync(repoPath(providerDelegate)) &&
    fs.existsSync(repoPath(guardedRunner))
  );
  check("upstream_gate_still_blocks_live_execution", () =>
    gate.pre_live_probe_gate.live_probe_allowed_now === false &&
    gate.pre_live_probe_gate.separate_exact_live_authorization_required === true &&
    gate.pre_live_probe_gate.required_future_exact_phrase === exactPhrase &&
    gate.pre_live_probe_gate.required_prompt_package_ref === promptRef &&
    gate.pre_live_probe_gate.required_review_criteria_gate_ref === gateRef &&
    gate.pre_live_probe_gate.required_owner_vcptoolbox_root === "explicit_owner_provided_root_only" &&
    gate.pre_live_probe_gate.max_provider_calls === 1 &&
    gate.pre_live_probe_gate.max_plugin_calls === 1 &&
    gate.pre_live_probe_gate.max_api_calls === 1 &&
    gate.pre_live_probe_gate.max_image_candidates === 1
  );
  check("future_activation_packet_required_and_separate", () =>
    checklist.future_activation_packet_required.required === true &&
    checklist.future_activation_packet_required.must_be_separate_from_this_checklist === true &&
    checklist.future_activation_packet_required.must_reference_this_checklist === checklistRef &&
    checklist.future_activation_packet_required.must_reference_review_criteria_gate === gateRef &&
    checklist.future_activation_packet_required.must_reference_prompt_package === promptRef &&
    checklist.future_activation_packet_required.must_flip_can_execute_now === true &&
    checklist.future_activation_packet_required.must_flip_live_probe_authorized === true &&
    checklist.future_activation_packet_required.must_include_owner_issued_exact_phrase === exactPhrase &&
    checklist.future_activation_packet_required.must_include_explicit_owner_vcptoolbox_root === true &&
    checklist.future_activation_packet_required.must_include_one_attempt_budget === true &&
    checklist.future_activation_packet_required.must_include_receipt_path === true &&
    checklist.future_activation_packet_required.must_include_rollback_or_cleanup_plan === true
  );
  check("preflight_checklist_is_complete", () =>
    hasRequiredIds(checklist.preflight_checklist, [
      "formal_v11_gate_reviewed",
      "exact_phrase_owner_issued",
      "explicit_owner_root_provided",
      "real_bound_owner_runtime_readiness_passed",
      "formal_v11_prompt_package_passed",
      "formal_v11_review_criteria_passed",
      "activation_checklist_self_passed",
      "worktree_scope_reviewed",
      "receipt_path_selected_before_execution",
    ]) &&
    checklist.preflight_checklist.every((item) => item.required === true) &&
    checklist.preflight_checklist.some((item) => item.command === "npm run validate:runtime-to-review-real-bound-owner-runtime-local-readiness") &&
    checklist.preflight_checklist.some((item) => item.command === "npm run validate:runtime-to-review-formal-v11-review-criteria-preflight") &&
    checklist.preflight_checklist.some((item) => item.command === `npm run ${packageScriptName}`)
  );
  check("future_budget_is_one_shot_and_no_promotion", () =>
    checklist.future_activation_budget.max_live_probe_attempts === 1 &&
    checklist.future_activation_budget.max_provider_calls === 1 &&
    checklist.future_activation_budget.max_plugin_calls === 1 &&
    checklist.future_activation_budget.max_api_calls === 1 &&
    checklist.future_activation_budget.max_image_candidates === 1 &&
    checklist.future_activation_budget.retry_allowed === false &&
    checklist.future_activation_budget.overwrite_existing_files_allowed === false &&
    checklist.future_activation_budget.secret_value_read_allowed === false &&
    checklist.future_activation_budget.raw_private_data_print_allowed === false &&
    checklist.future_activation_budget.accepted_samples_write_allowed === false &&
    checklist.future_activation_budget.production_candidate_write_allowed === false &&
    checklist.future_activation_budget.archive_write_allowed === false &&
    checklist.future_activation_budget.DailyNote_write_allowed === false &&
    checklist.future_activation_budget.VCP_memory_write_allowed === false &&
    checklist.future_activation_budget.push_allowed === false &&
    checklist.future_activation_budget.tag_release_deploy_allowed === false
  );
  check("receipt_checklist_covers_runtime_review_evidence", () =>
    hasRequiredIds(checklist.receipt_checklist, [
      "activation_packet_ref",
      "review_criteria_gate_ref",
      "prompt_package_ref",
      "owner_runtime_module_ref",
      "provider_delegate_module_ref",
      "exact_phrase_confirmed",
      "provider_call_count",
      "plugin_call_count",
      "api_call_count",
      "image_candidate_count",
      "output_refs",
      "artifact_record_ref",
      "audit_receipt_ref",
      "review_session_or_bridge_ref",
      "side_effect_flags",
      "human_review_next_step",
    ]) &&
    checklist.receipt_checklist.filter((item) => item.expected_max === 1).length === 4 &&
    checklist.receipt_checklist.find((item) => item.id === "output_refs").must_not_include_secret_values === true &&
    checklist.receipt_checklist.find((item) => item.id === "side_effect_flags").must_record_all_flags === true &&
    checklist.receipt_checklist.find((item) => item.id === "human_review_next_step").allowed_values.includes("patch_prompt_or_shot")
  );
  check("stop_conditions_block_red_lane_expansion", () =>
    includesAll(checklist.stop_conditions, [
      "missing separate future activation packet",
      "can_execute_now remains false",
      exactPhrase,
      "missing explicit owner-provided VCPToolBox root",
      "global env or inferred local path",
      "budget is above one or uncapped",
      "retry or loop",
      "secret/env/config raw value",
      "accepted_samples, production, archive, DailyNote, or VCP memory",
      "receipt path is missing",
      "push, tag, release, deploy",
      "validation failure requires non-obvious judgment",
    ])
  );
  check("side_effect_flags_all_false", () => allFalse(checklist.side_effect_flags));
  check("package_script_registered", () =>
    packageJson.scripts &&
    packageJson.scripts[packageScriptName] === "node scripts/validate_runtime_to_review_v2_formal_v11_live_activation_packet_checklist.js"
  );
  check("manifest_entry_registered", () => {
    const entry = manifest.validators.find((item) => item.id === manifestId);
    return entry &&
      entry.command === `npm run ${packageScriptName}` &&
      entry.script === "scripts/validate_runtime_to_review_v2_formal_v11_live_activation_packet_checklist.js" &&
      entry.tier === "targeted" &&
      entry.domain === "runtime_to_review" &&
      entry.status === "active" &&
      entry.trigger_paths.includes(checklistRef) &&
      entry.trigger_paths.includes(gateRef) &&
      entry.trigger_paths.includes(promptRef) &&
      entry.trigger_paths.includes(readinessValidator) &&
      entry.trigger_paths.includes(realBoundOwnerRuntime) &&
      entry.trigger_paths.includes(providerDelegate) &&
      entry.trigger_paths.includes(guardedRunner) &&
      entry.required_for.includes("formal_v11_gate_to_guarded_live_probe_exact_activation_packet_checklist");
  });
  check("roadmap_and_current_state_reference_checklist", () =>
    roadmap.includes("runtime_to_review_v2_formal_v11_live_activation_packet_checklist") &&
    roadmap.includes(checklistRef) &&
    currentState.includes("review_feedback_formal_v11_live_activation_packet_checklist") &&
    currentState.includes(checklistRef)
  );

  const output = {
    passed,
    validator,
    checklist_ref: checklistRef,
    formal_v11_review_criteria_gate_ref: gateRef,
    formal_v11_prompt_package_ref: promptRef,
    can_execute_now: checklist.can_execute_now,
    live_probe_authorized_by_this_checklist: checklist.live_probe_authorized_by_this_checklist,
    separate_future_activation_packet_required: true,
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
