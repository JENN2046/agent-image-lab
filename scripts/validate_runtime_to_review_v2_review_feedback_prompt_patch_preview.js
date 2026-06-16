#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v2_review_feedback_prompt_patch_preview";
const previewRef = "reports/runtime_to_review_v2/r2r_v2_review_feedback_prompt_patch_preview_20260616.json";
const routingRef = "reports/runtime_to_review_v2/r2r_v2_review_feedback_routing_min_fixture_20260615.json";
const promptRef = "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v2.yaml";
const decisionRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_review_decision_accepted_candidate_20260609.json";
const criteriaRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_review_criteria_no_execute_20260608.json";
const targetPromptRef = "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v3.yaml";

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

function runNodeCheck(relativePath) {
  childProcess.execFileSync(process.execPath, ["--check", relativePath], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return true;
}

function gitTracks(relativePath) {
  try {
    childProcess.execFileSync("git", ["ls-files", "--error-unmatch", relativePath], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return true;
  } catch (_) {
    return false;
  }
}

function allFalseExceptMetadata(flags) {
  return flags &&
    Object.entries(flags).every(([key, value]) => key === "metadata_only" ? value === true : value === false);
}

function arrayIncludesAll(values, required) {
  const joined = (values || []).join("\n");
  return required.every((token) => joined.includes(token));
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
  const preview = readJson(previewRef);
  const routing = readJson(routingRef);
  const decision = readJson(decisionRef);
  const criteria = readJson(criteriaRef);
  const prompt = readText(promptRef);
  const targetPrompt = readText(targetPromptRef);
  const acceptedCase = routing.routing_cases.find((item) =>
    item.case_id === "trial_002_accepted_candidate_watch_items_to_next_prompt"
  );

  check("syntax_clean", () =>
    runNodeCheck("scripts/validate_runtime_to_review_v2_review_feedback_prompt_patch_preview.js")
  );
  check("preview_schema_and_identity", () =>
    preview.schema === "runtime_to_review_v2_review_feedback_prompt_patch_preview.v1" &&
    preview.preview_id === "r2r_v2_review_feedback_prompt_patch_preview_20260616" &&
    preview.status === "prepared_metadata_only_prompt_patch_preview" &&
    preview.prompt_patch_preview.patch_mode === "preview_only_no_prompt_file_write" &&
    preview.prompt_patch_preview.write_target_created_now === false
  );
  check("source_refs_exist_and_align", () =>
    preview.source_refs.feedback_routing_fixture_ref === routingRef &&
    preview.source_refs.source_prompt_package_ref === promptRef &&
    preview.source_refs.source_review_decision_ref === decisionRef &&
    preview.source_refs.source_review_criteria_ref === criteriaRef &&
    fs.existsSync(repoPath(routingRef)) &&
    fs.existsSync(repoPath(promptRef)) &&
    fs.existsSync(repoPath(decisionRef)) &&
    fs.existsSync(repoPath(criteriaRef))
  );
  check("decision_context_matches_routing_and_review", () =>
    preview.decision_context.trial_id === decision.trial_id &&
    preview.decision_context.source_review_decision === decision.decision &&
    preview.decision_context.review_outcome === acceptedCase.review_outcome &&
    preview.decision_context.commercial_delivery_ready === decision.commercial_delivery_ready &&
    preview.decision_context.route_action === acceptedCase.next_route.route_action &&
    preview.decision_context.shot_decision === acceptedCase.next_route.shot_decision &&
    preview.decision_context.new_provider_run_allowed_now === false
  );
  check("preview_preserves_identity_from_prompt_and_routing", () =>
    prompt.includes("single premium rechargeable portable LED camping lantern") &&
    prompt.includes("full handle, diffuser, dimmer knob, body, and base visible") &&
    arrayIncludesAll(preview.prompt_patch_preview.preserve, [
      "single modern rechargeable LED camping lantern",
      "full handle, diffuser, side control, body, and base visible",
      "warm frosted diffuser with readable edges",
      "no readable brand text",
    ]) &&
    arrayIncludesAll(acceptedCase.next_route.prompt_delta.preserve, [
      "single modern rechargeable LED camping lantern",
      "side control",
    ])
  );
  check("watch_items_turn_into_tighten_delta", () => {
    const watch = decision.watch_items_for_next_gate.join("\n");
    return watch.includes("cleaner background") &&
      watch.includes("foreground table dominance") &&
      watch.includes("side control knob and handle geometry") &&
      watch.includes("lower body too featureless") &&
      arrayIncludesAll(preview.prompt_patch_preview.tighten, [
        "cleaner background",
        "reduce foreground table dominance",
        "lower body detail readable",
        "side control knob and attached handle geometry",
      ]);
  });
  check("negative_prompt_additions_block_known_watch_items", () =>
    arrayIncludesAll(preview.proposed_prompt_delta_preview.negative_prompt_additions, [
      "foreground table dominance",
      "featureless black lower body",
      "missing side control knob",
      "handle geometry lost or cropped",
    ])
  );
  check("preview_does_not_overwrite_scene_hero_route", () =>
    preview.proposed_prompt_delta_preview.visual_intent_delta.some((item) =>
      item.includes("Keep the scene hero route alive separately")
    ) &&
    preview.prompt_patch_preview.avoid.includes("strict SKU request accidentally reusing the wider scene hero framing") &&
    criteria.review_decision_options.includes("accepted_candidate")
  );
  check("formal_write_and_live_probe_remain_gated", () =>
    preview.review_before_write.human_review_required_before_prompt_package_write === true &&
    preview.review_before_write.formal_prompt_package_write_allowed_now === false &&
    preview.review_before_write.write_to_existing_v3_prompt_package_allowed_now === false &&
    preview.review_before_write.fresh_non_colliding_target_required_before_write === true &&
    preview.review_before_write.future_prompt_package_validator_required === true &&
    preview.review_before_write.future_review_criteria_update_required === true &&
    preview.review_before_write.future_live_probe_requires_separate_exact_authorization === true
  );
  check("existing_v3_target_collision_is_explicit_and_blocked", () =>
    preview.prompt_patch_preview.target_prompt_package_if_later_approved === targetPromptRef &&
    fs.existsSync(repoPath(targetPromptRef)) &&
    gitTracks(targetPromptRef) &&
    targetPrompt.includes("package_id: product_lifestyle_premium_portable_led_camping_lantern_v3") &&
    targetPrompt.includes("source_phase: v14_085_pvos_lantern_v3_prompt_revision_plan") &&
    preview.prompt_patch_preview.target_prompt_package_path_status === "existing_tracked_prompt_package_detected" &&
    preview.prompt_patch_preview.formal_write_target_collision_detected === true &&
    preview.prompt_patch_preview.overwrite_existing_prompt_package_allowed === false &&
    preview.prompt_patch_preview.retarget_required_before_formal_write === true &&
    preview.prompt_patch_preview.formal_write_target_requirement === "select_a_fresh_non_colliding_prompt_package_path_before_any_prompt_package_write"
  );
  check("no_execution_guard_is_clean", () =>
    allFalseExceptMetadata(preview.no_execution_guard)
  );
  check("recommended_next_requires_fresh_target_only_if_approved", () =>
    preview.recommended_next === "review_prompt_patch_preview_then_select_fresh_non_colliding_prompt_package_target_only_if_approved" &&
    preview.prompt_patch_preview.target_prompt_package_if_later_approved === targetPromptRef &&
    preview.prompt_patch_preview.retarget_required_before_formal_write === true
  );

  const output = {
    passed,
    validator,
    preview_ref: previewRef,
    source_routing_ref: routingRef,
    source_prompt_ref: promptRef,
    preview_target_prompt_package_ref: preview.prompt_patch_preview.target_prompt_package_if_later_approved,
    preview_target_collision_detected: preview.prompt_patch_preview.formal_write_target_collision_detected,
    fresh_non_colliding_target_required_before_write: preview.review_before_write.fresh_non_colliding_target_required_before_write,
    route_action: preview.decision_context.route_action,
    prompt_package_write_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results,
  };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
