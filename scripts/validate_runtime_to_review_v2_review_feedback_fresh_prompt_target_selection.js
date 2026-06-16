#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v2_review_feedback_fresh_prompt_target_selection";
const selectionRef = "reports/runtime_to_review_v2/r2r_v2_review_feedback_fresh_prompt_target_selection_20260616.json";
const previewRef = "reports/runtime_to_review_v2/r2r_v2_review_feedback_prompt_patch_preview_20260616.json";
const visualEvalRef = "reports/runtime_to_review_v2/r2r_v2_visual_eval_min_repeatable_fixture_set_20260616.json";
const routingRef = "reports/runtime_to_review_v2/r2r_v2_review_feedback_routing_min_fixture_20260615.json";
const sourcePromptRef = "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v2.yaml";
const blockedTargetRef = "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v3.yaml";
const selectedTargetRef = "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v11.yaml";

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

function lanternPromptVersionsExcludingSelected() {
  const promptDir = repoPath("prompts/image_generation");
  return fs.readdirSync(promptDir)
    .map((file) => {
      const match = file.match(/^product_lifestyle_premium_portable_led_camping_lantern_v(\d+)\.yaml$/);
      return match ? { file, version: Number(match[1]) } : null;
    })
    .filter(Boolean)
    .filter((entry) => entry.file !== path.basename(selectedTargetRef))
    .sort((a, b) => a.version - b.version);
}

function allFalseExceptMetadata(flags) {
  return flags &&
    Object.entries(flags).every(([key, value]) => key === "metadata_only" ? value === true : value === false);
}

function arrayIncludesAll(values, required) {
  const joined = (values || []).join("\n");
  return required.every((token) => joined.includes(token));
}

function selectedTargetCurrentStatus() {
  const exists = fs.existsSync(repoPath(selectedTargetRef));
  if (!exists) {
    return gitTracks(selectedTargetRef) ? "missing_but_git_tracked_unexpected" : "absent_untracked_non_colliding";
  }
  if (!gitTracks(selectedTargetRef)) {
    return "exists_untracked_future_prompt_candidate";
  }
  const text = readText(selectedTargetRef);
  return text.includes("package_id: product_lifestyle_premium_portable_led_camping_lantern_v11") &&
    text.includes("version: v11") ? "tracked_exact_v11_prompt_package" : "tracked_target_mismatch";
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
  const selection = readJson(selectionRef);
  const preview = readJson(previewRef);
  const visualEval = readJson(visualEvalRef);
  const routing = readJson(routingRef);
  const sourcePrompt = readText(sourcePromptRef);
  const blockedTarget = readText(blockedTargetRef);
  const existingVersions = lanternPromptVersionsExcludingSelected();
  const highestExistingVersion = Math.max(...existingVersions.map((entry) => entry.version));
  const selectedStatus = selectedTargetCurrentStatus();

  check("syntax_clean", () =>
    runNodeCheck("scripts/validate_runtime_to_review_v2_review_feedback_fresh_prompt_target_selection.js")
  );
  check("selection_schema_identity_and_status", () =>
    selection.schema === "runtime_to_review_v2_review_feedback_fresh_prompt_target_selection.v1" &&
    selection.selection_id === "r2r_v2_review_feedback_fresh_prompt_target_selection_20260616" &&
    selection.status === "selected_metadata_only_fresh_non_colliding_prompt_target"
  );
  check("source_refs_exist_and_align", () =>
    selection.source_refs.prompt_patch_preview_ref === previewRef &&
    selection.source_refs.visual_eval_min_repeatable_fixture_ref === visualEvalRef &&
    selection.source_refs.feedback_routing_fixture_ref === routingRef &&
    selection.source_refs.source_prompt_package_ref === sourcePromptRef &&
    selection.source_refs.blocked_collision_target_ref === blockedTargetRef &&
    selection.source_refs.selected_fresh_target_ref === selectedTargetRef &&
    fs.existsSync(repoPath(previewRef)) &&
    fs.existsSync(repoPath(visualEvalRef)) &&
    fs.existsSync(repoPath(routingRef)) &&
    fs.existsSync(repoPath(sourcePromptRef)) &&
    fs.existsSync(repoPath(blockedTargetRef))
  );
  check("preview_collision_requires_retarget", () =>
    preview.prompt_patch_preview.target_prompt_package_if_later_approved === blockedTargetRef &&
    preview.prompt_patch_preview.formal_write_target_collision_detected === true &&
    preview.prompt_patch_preview.overwrite_existing_prompt_package_allowed === false &&
    preview.prompt_patch_preview.retarget_required_before_formal_write === true &&
    preview.review_before_write.fresh_non_colliding_target_required_before_write === true
  );
  check("blocked_v3_target_is_real_tracked_collision", () =>
    fs.existsSync(repoPath(blockedTargetRef)) &&
    gitTracks(blockedTargetRef) &&
    blockedTarget.includes("package_id: product_lifestyle_premium_portable_led_camping_lantern_v3") &&
    blockedTarget.includes("version: v3") &&
    selection.target_selection.blocked_collision_target.path === blockedTargetRef &&
    selection.target_selection.blocked_collision_target.collision_detected === true &&
    selection.target_selection.blocked_collision_target.overwrite_allowed === false
  );
  check("selected_target_is_next_numeric_non_colliding_version", () =>
    highestExistingVersion === 10 &&
    selection.target_selection.selected_fresh_target.path === selectedTargetRef &&
    selection.target_selection.selected_fresh_target.package_id === "product_lifestyle_premium_portable_led_camping_lantern_v11" &&
    selection.target_selection.selected_fresh_target.version === "v11" &&
    selection.target_selection.selected_fresh_target.selection_time_highest_existing_numeric_version === "v10" &&
    selection.target_selection.selected_fresh_target.selection_rule === "next_numeric_version_after_existing_lantern_prompt_packages" &&
    selectedStatus !== "missing_but_git_tracked_unexpected" &&
    selectedStatus !== "tracked_target_mismatch"
  );
  check("selection_does_not_write_prompt_package_now", () =>
    selection.decision_context.prompt_patch_preview_accepted_for_formal_prompt_write === false &&
    selection.decision_context.human_acceptance_required_before_prompt_package_write === true &&
    selection.decision_context.target_selection_allowed_without_prompt_file_write === true &&
    selection.decision_context.formal_prompt_package_write_allowed_now === false &&
    selection.target_selection.selected_fresh_target.write_target_created_now === false &&
    selection.target_selection.selected_fresh_target.prompt_package_write_performed_now === false
  );
  check("future_prompt_contract_matches_preview_deltas", () =>
    selection.future_prompt_package_contract.future_prompt_package_ref === selectedTargetRef &&
    selection.future_prompt_package_contract.future_package_id === "product_lifestyle_premium_portable_led_camping_lantern_v11" &&
    selection.future_prompt_package_contract.future_version === "v11" &&
    selection.future_prompt_package_contract.source_prompt_package_ref === sourcePromptRef &&
    sourcePrompt.includes("package_id: product_lifestyle_premium_portable_led_camping_lantern_v2") &&
    arrayIncludesAll(selection.future_prompt_package_contract.must_preserve_from_preview, [
      "single modern rechargeable LED camping lantern",
      "full handle, diffuser, side control, body, and base visible",
      "warm frosted diffuser with readable edges",
      "no readable brand text",
    ]) &&
    arrayIncludesAll(selection.future_prompt_package_contract.must_tighten_from_preview, [
      "cleaner background",
      "foreground table dominance",
      "lower body detail",
      "side control knob",
      "review watch items",
    ]) &&
    arrayIncludesAll(selection.future_prompt_package_contract.must_avoid_from_preview, [
      "foreground surface becoming the visual subject",
      "featureless dark lower body",
      "losing side control knob",
      "wider scene hero framing",
      "new provider run",
    ])
  );
  check("visual_eval_fixture_and_routing_evidence_are_reused", () =>
    visualEval.schema === "runtime_to_review_v2_visual_eval_min_repeatable_fixture_set.v1" &&
    visualEval.aggregate.core_outcomes_covered.includes("pass") &&
    routing.routing_cases.some((item) => item.case_id === "trial_002_accepted_candidate_watch_items_to_next_prompt") &&
    selection.decision_context.route_action === "continue_same_product_family_with_tightened_prompt_constraints"
  );
  check("current_state_names_fresh_target_selection", () => {
    const currentState = readText("CURRENT_STATE.md");
    return currentState.includes("review_feedback_fresh_prompt_target_selection") &&
      currentState.includes(selectedTargetRef) &&
      currentState.includes("formal prompt package write remains blocked until human acceptance");
  });
  check("roadmap_names_fresh_target_selection", () => {
    const roadmap = readText("docs/RUNTIME_TO_PRODUCTION_LANDING_ROADMAP.md");
    return roadmap.includes("runtime_to_review_v2_review_feedback_fresh_prompt_target_selection") &&
      roadmap.includes(selectedTargetRef) &&
      roadmap.includes("formal v11 prompt package draft remains blocked until human acceptance");
  });
  check("no_execution_guard_is_clean", () =>
    allFalseExceptMetadata(selection.no_execution_guard)
  );
  check("recommended_next_blocks_formal_write_until_human_acceptance", () =>
    selection.recommended_next === "wait_for_human_acceptance_before_formal_v11_prompt_package_write_or_continue_no_provider_validation_work"
  );

  const output = {
    passed,
    validator,
    selection_ref: selectionRef,
    blocked_collision_target_ref: blockedTargetRef,
    selected_fresh_target_ref: selectedTargetRef,
    selected_target_current_status: selectedStatus,
    highest_existing_lantern_prompt_version_excluding_selected: `v${highestExistingVersion}`,
    formal_prompt_package_write_allowed_now: false,
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
