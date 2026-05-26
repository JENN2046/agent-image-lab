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

const sportsVisorPromptV2 = "prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v2.yaml";

check("prompt_ref_accepts_allowed_root", () => plugin.resolveSafePromptPackageRef("prompts/image_generation/example.yaml").valid === true);
check("prompt_ref_rejects_parent_traversal", () => invalidPrompt("../README.md"));
check("prompt_ref_rejects_nested_traversal", () => invalidPrompt("prompts/image_generation/../../README.md"));
check("prompt_ref_rejects_absolute_windows_path", () => invalidPrompt("C:\\temp\\prompt.yaml"));
check("prompt_ref_rejects_backslash_path", () => invalidPrompt("prompts\\image_generation\\example.yaml"));
check("prompt_ref_rejects_wrong_root", () => invalidPrompt("docs/00_project_roadmap.md"));

check("sports_visor_v2_prompt_package_loads_prompt_non_empty", () => {
  const pkg = plugin.loadPromptPackage(sportsVisorPromptV2);
  return typeof pkg.prompt === "string" && pkg.prompt.trim().length > 0;
});

check("sports_visor_v2_prompt_package_loads_negative_prompt_non_empty", () => {
  const pkg = plugin.loadPromptPackage(sportsVisorPromptV2);
  return typeof pkg.negative_prompt === "string" && pkg.negative_prompt.trim().length > 0;
});

check("output_dir_accepts_allowed_root", () => plugin.resolveSafeOutputDirectory("runs/real_generation/v7_245/").valid === true);
check("output_dir_rejects_parent_traversal", () => invalidOutput("runs/real_generation/../../../x"));
check("output_dir_rejects_absolute_windows_path", () => invalidOutput("C:\\temp\\runs"));
check("output_dir_rejects_backslash_path", () => invalidOutput("runs\\real_generation\\v7_245"));
check("output_dir_rejects_wrong_root", () => invalidOutput("runs/not_real_generation/v7_245"));

check("base_url_missing_blocks", () => plugin.validateBaseUrl("").valid === false);
check("base_url_http_blocks", () => plugin.validateBaseUrl("http://example.com").valid === false);
check("base_url_localhost_blocks", () => plugin.validateBaseUrl("https://localhost:8000").valid === false);
check("base_url_https_allows", () => plugin.validateBaseUrl("https://example.com/api/v3").valid === true);
check("download_url_rejects_http", () => plugin.validateDownloadUrl("http://example.com/image.png").valid === false);
check("download_url_rejects_localhost", () => plugin.validateDownloadUrl("https://localhost/image.png").valid === false);
check("download_url_rejects_private_ip", () => plugin.validateDownloadUrl("https://192.168.1.5/image.png").valid === false);
check("download_url_accepts_https_public_host", () => plugin.validateDownloadUrl("https://example.com/image.png").valid === true);

check("image_buffer_accepts_png_magic", () => {
  const png = Buffer.from("89504e470d0a1a0a0000000d49484452", "hex");
  const result = plugin.validateImageBuffer(png, "image/png");
  return result.valid === true && result.format === "png" && result.extension === ".png";
});

check("image_buffer_accepts_jpeg_magic", () => {
  const jpeg = Buffer.from("ffd8ffe000104a4649460001", "hex");
  const result = plugin.validateImageBuffer(jpeg, "image/jpeg");
  return result.valid === true && result.format === "jpeg" && result.extension === ".jpg";
});

check("image_buffer_rejects_magic_mismatch", () => {
  const notImage = Buffer.from("not-an-image-payload");
  const result = plugin.validateImageBuffer(notImage, "image/png");
  return result.valid === false && result.reason === "image_magic_number_unsupported";
});

check("image_buffer_rejects_content_type_mismatch", () => {
  const png = Buffer.from("89504e470d0a1a0a0000000d49484452", "hex");
  const result = plugin.validateImageBuffer(png, "image/jpeg");
  return result.valid === false && result.reason === "image_content_type_mismatch";
});

check("content_type_allows_jpeg_alias", () => plugin.contentTypeAllowsImageFormat("image/jpg", "jpeg") === true);

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

check("human_review_requires_verified_local_file_count", () => {
  const normalized = plugin.normalizeResult({
    status: "COMPLETED_GENERATED",
    api_call_performed: true,
    provider_request_success: true,
    provider_reported_image_count: 1,
    local_files_verified_count: 0,
  });
  return normalized.human_review_required_now === false &&
    normalized.image_created === false &&
    normalized.image_count === 0;
});

check("verify_local_output_file_rejects_missing_file", () => {
  const result = plugin.verifyLocalOutputFile(
    "runs/real_generation/does_not_exist/native_doubao_missing.jpg",
    "runs/real_generation/does_not_exist"
  );
  return result.verified === false;
});

check("plugin_exports_output_safety_helpers", () => {
  return typeof plugin.validateImageBuffer === "function" &&
    typeof plugin.validateDownloadUrl === "function" &&
    typeof plugin.contentTypeAllowsImageFormat === "function";
});

const summary = {
  passed,
  validator: "validate_native_doubao_sandbox",
  check_count: results.length,
  failed_count: results.filter((r) => !r.passed).length,
  provider_contact_performed: false,
  plugin_call_performed: false,
  image_generation_performed: false,
  file_write_performed: false,
  env_local_read: false,
  results,
};

process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
