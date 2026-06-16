#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v2_formal_v11_prompt_package";
const promptRef = "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v11.yaml";
const sourcePromptRef = "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v2.yaml";
const blockedTargetRef = "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v3.yaml";
const previewRef = "reports/runtime_to_review_v2/r2r_v2_review_feedback_prompt_patch_preview_20260616.json";
const selectionRef = "reports/runtime_to_review_v2/r2r_v2_review_feedback_fresh_prompt_target_selection_20260616.json";
const reviewDecisionRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_review_decision_accepted_candidate_20260609.json";
const reviewCriteriaRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_review_criteria_no_execute_20260608.json";

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

function runNodeCheck(relativePath) {
  childProcess.execFileSync(process.execPath, ["--check", relativePath], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return true;
}

function runPromptSchema() {
  childProcess.execFileSync(process.execPath, [
    "scripts/validate_prompt_schema.js",
    "--type",
    "prompt_package",
    promptRef,
  ], {
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

function literalBlock(text, key) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => line === `${key}: |`);
  if (start === -1) return null;
  const block = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^[A-Za-z0-9_]+:/.test(line)) break;
    block.push(line.startsWith("  ") ? line.slice(2) : line);
  }
  return block.join("\n").trim();
}

function includesAll(text, tokens) {
  return tokens.every((token) => text.includes(token));
}

function falseFlag(text, field) {
  return new RegExp(`^${field}: false$`, "m").test(text);
}

function trueFlag(text, field) {
  return new RegExp(`^${field}: true$`, "m").test(text);
}

function allFalseExceptMetadata(flags) {
  return flags &&
    Object.entries(flags).every(([key, value]) => key === "metadata_only" ? value === true : value === false);
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
  const prompt = readText(promptRef);
  const sourcePrompt = readText(sourcePromptRef);
  const blockedTarget = readText(blockedTargetRef);
  const preview = readJson(previewRef);
  const selection = readJson(selectionRef);
  const reviewDecision = readJson(reviewDecisionRef);
  const reviewCriteria = readJson(reviewCriteriaRef);
  const currentState = readText("CURRENT_STATE.md");
  const roadmap = readText("docs/RUNTIME_TO_PRODUCTION_LANDING_ROADMAP.md");
  const promptBlock = literalBlock(prompt, "prompt");
  const positiveBlock = literalBlock(prompt, "positive_prompt");

  check("syntax_clean", () =>
    runNodeCheck("scripts/validate_runtime_to_review_v2_formal_v11_prompt_package.js")
  );
  check("base_prompt_schema_passes", runPromptSchema);
  check("prompt_identity_and_target_match_selection", () =>
    prompt.includes("package_id: product_lifestyle_premium_portable_led_camping_lantern_v11") &&
    prompt.includes("version: v11") &&
    prompt.includes(`source_prompt_package: ${sourcePromptRef}`) &&
    prompt.includes(`source_prompt_patch_preview: ${previewRef}`) &&
    prompt.includes(`source_fresh_target_selection: ${selectionRef}`) &&
    selection.future_prompt_package_contract.future_prompt_package_ref === promptRef &&
    selection.future_prompt_package_contract.future_package_id === "product_lifestyle_premium_portable_led_camping_lantern_v11" &&
    selection.future_prompt_package_contract.future_version === "v11"
  );
  check("source_refs_exist_and_are_expected_trial_002_inputs", () =>
    fs.existsSync(repoPath(sourcePromptRef)) &&
    fs.existsSync(repoPath(previewRef)) &&
    fs.existsSync(repoPath(selectionRef)) &&
    fs.existsSync(repoPath(reviewDecisionRef)) &&
    fs.existsSync(repoPath(reviewCriteriaRef)) &&
    sourcePrompt.includes("package_id: product_lifestyle_premium_portable_led_camping_lantern_v2") &&
    reviewDecision.decision === "accepted_candidate" &&
    reviewDecision.commercial_delivery_ready === false &&
    reviewCriteria.schema === "runtime_to_review_v2_review_criteria_no_execute.v1"
  );
  check("blocked_v3_is_not_overwritten", () =>
    fs.existsSync(repoPath(blockedTargetRef)) &&
    gitTracks(blockedTargetRef) &&
    blockedTarget.includes("package_id: product_lifestyle_premium_portable_led_camping_lantern_v3") &&
    blockedTarget.includes("version: v3") &&
    prompt.includes("existing_v3_prompt_package_overwrite_allowed: false") &&
    !prompt.includes("package_id: product_lifestyle_premium_portable_led_camping_lantern_v3")
  );
  check("prompt_and_positive_prompt_are_synchronized", () =>
    Boolean(promptBlock) &&
    promptBlock === positiveBlock &&
    promptBlock.includes("clean ecommerce SKU main image") &&
    promptBlock.includes("The wider scene hero route remains separate")
  );
  check("preview_preserve_items_are_carried", () =>
    includesAll(prompt, [
      "single modern rechargeable LED camping lantern",
      "full handle, diffuser, side control, body, and base",
      "warm frosted diffuser",
      "premium outdoor electronics",
      "no readable brand text",
      "no people",
      "no hands",
      "no extra lanterns",
    ])
  );
  check("preview_tighten_items_are_carried", () =>
    includesAll(prompt, [
      "cleaner background",
      "less scene detail",
      "foreground table dominance",
      "lower body detail",
      "side control knob",
      "attached handle geometry",
      "review criteria update required before any live probe",
    ])
  );
  check("preview_avoid_items_are_carried_in_negative_prompt", () => {
    const negative = literalBlock(prompt, "negative_prompt") || "";
    return includesAll(negative, [
      "foreground table dominance",
      "surface reflection becoming the main subject",
      "featureless black lower body",
      "missing side control knob",
      "handle geometry lost or cropped",
      "busy campsite background for strict SKU framing",
    ]);
  });
  check("acceptance_criteria_cover_clean_sku_watch_items", () =>
    includesAll(prompt, [
      "strict_ecommerce_sku_main_image_direction_present: true",
      "product_dominance_72_to_82_percent: true",
      "cleaner_background_less_scene_detail: true",
      "scene_hero_route_not_overwritten: true",
      "foreground_surface_secondary: true",
      "lower_body_detail_readable: true",
      "side_control_knob_visible: true",
      "handle_geometry_attached_and_plausible: true",
    ])
  );
  check("formal_prompt_package_boundaries_are_no_provider", () =>
    falseFlag(prompt, "A5_authorization_created") &&
    falseFlag(prompt, "provider_contact_allowed") &&
    falseFlag(prompt, "image_generation_allowed") &&
    falseFlag(prompt, "memory_write_allowed") &&
    falseFlag(prompt, "production_candidate_002_allowed") &&
    falseFlag(prompt, "plugin_call_allowed") &&
    falseFlag(prompt, "api_call_allowed") &&
    falseFlag(prompt, "route_http_request_allowed") &&
    falseFlag(prompt, "output_write_allowed") &&
    falseFlag(prompt, "accepted_samples_write_allowed") &&
    falseFlag(prompt, "image_binary_read_allowed") &&
    trueFlag(prompt, "future_live_probe_requires_separate_exact_authorization")
  );
  check("upstream_preview_and_selection_remain_no_execution_metadata", () =>
    preview.no_execution_guard.prompt_package_write_performed === false &&
    selection.target_selection.selected_fresh_target.prompt_package_write_performed_now === false &&
    selection.target_selection.selected_fresh_target.path === promptRef &&
    allFalseExceptMetadata(selection.no_execution_guard)
  );
  check("current_state_and_roadmap_name_formal_v11_package", () =>
    currentState.includes("review_feedback_formal_v11_prompt_package") &&
    currentState.includes(promptRef) &&
    currentState.includes("formal v11 prompt package now exists as a no-provider local draft") &&
    roadmap.includes("runtime_to_review_v2_formal_v11_prompt_package") &&
    roadmap.includes(promptRef) &&
    roadmap.includes("no provider, image, memory, production, or accepted_samples write")
  );

  const output = {
    passed,
    validator,
    prompt_package_ref: promptRef,
    source_prompt_package_ref: sourcePromptRef,
    source_prompt_patch_preview_ref: previewRef,
    source_fresh_target_selection_ref: selectionRef,
    prompt_package_schema_validated: results.some((result) => result.check === "base_prompt_schema_passes" && result.passed),
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
    image_binary_read_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    secret_value_read_performed: false,
    existing_v3_prompt_overwrite_performed: false,
    future_live_probe_requires_separate_exact_authorization: true,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results,
  };

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
