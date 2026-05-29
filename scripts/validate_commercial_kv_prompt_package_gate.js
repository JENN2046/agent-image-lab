#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const YAML = require("yaml");

const root = path.resolve(__dirname, "..");
const validator = "commercial_kv_prompt_package_gate";
const promptPath = "prompts/image_generation/product_commercial_kv_premium_portable_led_camping_lantern_v1.yaml";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readYaml(relativePath) {
  return YAML.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function includesAll(text, requiredTerms) {
  const source = String(text || "").toLowerCase();
  return requiredTerms.every((term) => source.includes(term.toLowerCase()));
}

try {
  const promptPackage = readYaml(promptPath);
  const acceptanceGate = promptPackage.acceptance_gate || {};
  const qualityGate = promptPackage.prompt_quality_gate || {};

  assert(
    promptPackage.prompt_package_id === "product_commercial_kv_premium_portable_led_camping_lantern_v1",
    "prompt_package_id mismatch"
  );
  assert(promptPackage.mode === "text_to_image", "mode must be text_to_image");
  assert(promptPackage.reference_policy === "text_only_no_image_input", "reference policy must be text only");
  assert(promptPackage.prompt === promptPackage.positive_prompt, "prompt and positive_prompt must stay synced");
  assert(promptPackage.A5_authorization_required_later === true, "A5 must remain separate");

  for (const flag of [
    "plugin_call_allowed_by_this_file",
    "provider_contact_allowed_by_this_file",
    "image_generation_allowed_by_this_file",
    "memory_write_allowed",
    "daily_note_write_allowed",
    "production_candidate_allowed_by_this_file",
    "accepted_samples_write_allowed",
    "runs_output_creation_allowed"
  ]) {
    assert(promptPackage[flag] === false, `${flag} must be false`);
  }

  assert(includesAll(promptPackage.prompt, [
    "commercial key visual",
    "portable LED camping lantern",
    "clean negative space",
    "No people",
    "no readable text",
    "no logo",
    "no watermark"
  ]), "prompt must contain commercial KV and safety anchors");

  assert(includesAll(promptPackage.negative_prompt, [
    "readable text",
    "logo",
    "watermark",
    "people",
    "hands",
    "extra lanterns",
    "overexposed light core"
  ]), "negative prompt must cover KV failure modes");

  for (const gateKey of [
    "prompt_subject_match",
    "style_direction_match",
    "commercial_kv_intent_clear",
    "product_identity_clear",
    "product_fully_visible",
    "product_dominant_hero",
    "product_structure_plausible",
    "handle_and_pivots_plausible",
    "led_diffuser_visible",
    "warm_glow_believable",
    "material_detail_premium",
    "grounded_contact_shadow",
    "clean_negative_space_for_headline",
    "no_generated_text_or_logo",
    "no_watermark_or_signature",
    "no_people_or_hands",
    "no_extra_products",
    "background_supports_product",
    "composition_campaign_grade",
    "commercial_usability",
    "archive_suitability",
    "accepted_candidate_requires_human_review",
    "accepted_candidate_does_not_authorize_delivery"
  ]) {
    assert(acceptanceGate[gateKey] === true, `acceptance_gate.${gateKey} must be true`);
  }
  assert(acceptanceGate.memory_suitability === false, "memory suitability must remain false before approval");
  assert(Array.isArray(acceptanceGate.asset_status_allowed_after_generation), "asset status list missing");
  assert(acceptanceGate.asset_status_allowed_after_generation.includes("accepted_candidate"), "accepted_candidate status missing");
  assert(acceptanceGate.asset_status_allowed_after_generation.includes("needs_human_review"), "needs_human_review status missing");

  assert(qualityGate.score >= 90, "quality score must be production_ready");
  assert(qualityGate.rating === "production_ready", "quality rating mismatch");
  assert(qualityGate.a5_single_test_allowed_later === true, "future A5 single test gate missing");
  assert(qualityGate.batch_generation_allowed_by_this_file === false, "batch generation must not be allowed");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    validator,
    prompt_package_ref: promptPath,
    prompt_package_id: promptPackage.prompt_package_id,
    quality_score: qualityGate.score,
    quality_rating: qualityGate.rating,
    commercial_kv_intent_clear: true,
    acceptance_gate_present: true,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    memory_write_allowed: false,
    daily_note_write_allowed: false
  }, null, 2)}\n`);
} catch (error) {
  process.stderr.write(`${JSON.stringify({
    passed: false,
    validator,
    error: error.message
  }, null, 2)}\n`);
  process.exitCode = 1;
}
