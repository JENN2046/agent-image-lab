"use strict";

const plugin = require("../plugins/image_generation/native_doubao_image/native_doubao_image.js");

let passed = true;
const results = [];

function check(id, fn) {
  try {
    const ok = Boolean(fn());
    results.push({ check: id, passed: ok });
    if (!ok) passed = false;
  } catch (err) {
    results.push({ check: id, passed: false, error: err.message });
    passed = false;
  }
}

function invalidPrompt(ref) {
  return plugin.resolveSafePromptPackageRef(ref).valid === false;
}

function invalidOutput(ref) {
  return plugin.resolveSafeOutputDirectory(ref).valid === false;
}

check("prompt_ref_accepts_allowed_root", () => plugin.resolveSafePromptPackageRef("prompts/image_generation/example.yaml").valid === true);
check("prompt_ref_rejects_parent_traversal", () => invalidPrompt("../README.md"));
check("prompt_ref_rejects_nested_traversal", () => invalidPrompt("prompts/image_generation/../../README.md"));
check("prompt_ref_rejects_absolute_windows_path", () => invalidPrompt("C:\\temp\\prompt.yaml"));
check("prompt_ref_rejects_backslash_path", () => invalidPrompt("prompts\\image_generation\\example.yaml"));
check("prompt_ref_rejects_wrong_root", () => invalidPrompt("docs/00_project_roadmap.md"));

check("output_dir_accepts_allowed_root", () => plugin.resolveSafeOutputDirectory("runs/real_generation/v7_245/").valid === true);
check("output_dir_rejects_parent_traversal", () => invalidOutput("runs/real_generation/../../../x"));
check("output_dir_rejects_absolute_windows_path", () => invalidOutput("C:\\temp\\runs"));
check("output_dir_rejects_backslash_path", () => invalidOutput("runs\\real_generation\\v7_245"));
check("output_dir_rejects_wrong_root", () => invalidOutput("runs/not_real_generation/v7_245"));

check("base_url_missing_blocks", () => plugin.validateBaseUrl("").valid === false);
check("base_url_http_blocks", () => plugin.validateBaseUrl("http://example.com").valid === false);
check("base_url_localhost_blocks", () => plugin.validateBaseUrl("https://localhost:8000").valid === false);
check("base_url_https_allows", () => plugin.validateBaseUrl("https://example.com/api/v3").valid === true);

check("call_budget_exact_one_accepts", () => plugin.validateA5Limits({ maxPluginCalls: 1, maxImagesCreated: 1, retryAllowed: false }).valid === true);
check("call_budget_rejects_zero", () => plugin.validateA5Limits({ maxPluginCalls: 0, maxImagesCreated: 1, retryAllowed: false }).valid === false);
check("image_budget_rejects_zero", () => plugin.validateA5Limits({ maxPluginCalls: 1, maxImagesCreated: 0, retryAllowed: false }).valid === false);
check("call_budget_rejects_two", () => plugin.validateA5Limits({ maxPluginCalls: 2, maxImagesCreated: 1, retryAllowed: false }).valid === false);
check("retry_rejected", () => plugin.validateA5Limits({ maxPluginCalls: 1, maxImagesCreated: 1, retryAllowed: true }).valid === false);

check("normalize_result_redacts_raw_image_fields", () => {
  const normalized = plugin.normalizeResult({
    status: "COMPLETED_GENERATED",
    api_call_performed: true,
    image_created: true,
    images: [{ b64_json: "RAW", url: "https://example.com/image.png" }],
    model_reported: "doubao-seedream-5-0-260128",
  });
  const serialized = JSON.stringify(normalized);
  return normalized.raw_image_payload_returned === false &&
    normalized.provider_url_returned === false &&
    !serialized.includes("RAW") &&
    !serialized.includes("image.png");
});

check("json_result_can_hide_non_enumerable_raw_images", () => {
  const result = { status: "COMPLETED_GENERATED", images: [{ index: 0, has_b64_json: true, has_url: true }] };
  Object.defineProperty(result, "_raw_images", {
    value: [{ b64_json: "RAW", url: "https://example.com/image.png" }],
    enumerable: false,
  });
  const serialized = JSON.stringify(result);
  return !serialized.includes("_raw_images") &&
    !serialized.includes("RAW") &&
    !serialized.includes("image.png");
});

check("normalize_result_requires_local_persistence_for_image_count", () => {
  const normalized = plugin.normalizeResult({
    status: "COMPLETED_GENERATED",
    api_call_performed: true,
    provider_request_success: true,
    provider_reported_image_count: 1,
    image_created: true,
    images: [{ index: 0, has_b64_json: true }],
    files_written_count: 0,
    local_files_verified_count: 0,
    local_persistence_success: false,
  });
  return normalized.provider_reported_image_count === 1 &&
    normalized.image_count === 0 &&
    normalized.image_created === false &&
    normalized.human_review_required_now === false &&
    normalized.local_persistence_success === false;
});

check("normalize_result_rejects_legacy_files_written_overcount", () => {
  const normalized = plugin.normalizeResult({
    status: "COMPLETED_GENERATED",
    api_call_performed: true,
    provider_request_success: true,
    provider_reported_image_count: 1,
    image_created: true,
    files_written_count: 1,
    local_persistence_success: true,
  });
  return normalized.provider_reported_image_count === 1 &&
    normalized.files_written_count === 0 &&
    normalized.local_files_verified_count === 0 &&
    normalized.image_count === 0 &&
    normalized.image_created === false &&
    normalized.human_review_required_now === false &&
    normalized.local_persistence_success === false;
});

check("normalize_result_requires_verified_count_even_if_flag_true", () => {
  const normalized = plugin.normalizeResult({
    status: "COMPLETED_GENERATED",
    api_call_performed: true,
    provider_request_success: true,
    provider_reported_image_count: 1,
    local_files_verified_count: 0,
    local_persistence_success: true,
  });
  return normalized.image_count === 0 &&
    normalized.image_created === false &&
    normalized.human_review_required_now === false &&
    normalized.local_persistence_success === false;
});

check("verify_local_output_file_rejects_missing_file", () => {
  const result = plugin.verifyLocalOutputFile(
    "runs/real_generation/does_not_exist/native_doubao_missing.jpg",
    "runs/real_generation/does_not_exist"
  );
  return result.verified === false;
});

const summary = {
  passed,
  validator: "validate_native_doubao_sandbox",
  check_count: results.length,
  failed_count: results.filter((r) => !r.passed).length,
  provider_contact_performed: false,
  plugin_call_performed: false,
  image_generation_performed: false,
  env_local_read: false,
  results,
};

process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
