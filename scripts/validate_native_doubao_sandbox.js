"use strict";

const sharp = require("sharp");
const { ReadableStream } = require("node:stream/web");
const plugin = require("../plugins/image_generation/native_doubao_image/native_doubao_image.js");

let passed = true;
const results = [];
const pending = [];

function check(id, fn) {
  try {
    const value = fn();
    if (value && typeof value.then === "function") {
      pending.push(value.then((ok) => {
        results.push({ check: id, passed: Boolean(ok) });
        if (!ok) passed = false;
      }).catch((err) => {
        results.push({ check: id, passed: false, error: err.message });
        passed = false;
      }));
      return;
    }
    results.push({ check: id, passed: Boolean(value) });
    if (!value) passed = false;
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

check("sports_visor_v2_prompt_package_keeps_prompt_and_negative_separate", () => {
  const pkg = plugin.loadPromptPackage(sportsVisorPromptV2);
  return pkg.prompt.includes("Realistic premium urban sports lifestyle product photo") &&
    !pkg.prompt.includes("studio-only product shot") &&
    pkg.negative_prompt.includes("studio-only product shot");
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

check("resolved_ip_safety_allows_public_ipv4", () => {
  const result = plugin.classifyIpAddressForNetworkSafety("8.8.8.8");
  return result.allowed === true && result.family === "ipv4";
});

check("resolved_ip_safety_rejects_loopback_ipv4", () => {
  const result = plugin.classifyIpAddressForNetworkSafety("127.0.0.1");
  return result.allowed === false && result.reason === "resolved_ip_loopback";
});

check("resolved_ip_safety_rejects_metadata_ipv4", () => {
  const result = plugin.classifyIpAddressForNetworkSafety("169.254.169.254");
  return result.allowed === false && result.reason === "resolved_ip_link_local";
});

check("resolved_ip_safety_rejects_cgnat_ipv4", () => {
  const result = plugin.classifyIpAddressForNetworkSafety("100.64.0.1");
  return result.allowed === false && result.reason === "resolved_ip_carrier_grade_nat";
});

check("resolved_ip_safety_rejects_documentation_ipv4", () => {
  const result = plugin.classifyIpAddressForNetworkSafety("203.0.113.10");
  return result.allowed === false && result.reason === "resolved_ip_documentation";
});

check("resolved_ip_safety_allows_public_ipv6", () => {
  const result = plugin.classifyIpAddressForNetworkSafety("2606:4700:4700::1111");
  return result.allowed === true && result.family === "ipv6";
});

check("resolved_ip_safety_rejects_ipv6_loopback", () => {
  const result = plugin.classifyIpAddressForNetworkSafety("::1");
  return result.allowed === false && result.reason === "resolved_ip_loopback";
});

check("resolved_ip_safety_rejects_ipv6_unique_local", () => {
  const result = plugin.classifyIpAddressForNetworkSafety("fd00::1");
  return result.allowed === false && result.reason === "resolved_ip_unique_local";
});

check("resolved_ip_safety_rejects_ipv4_mapped_loopback", () => {
  const result = plugin.classifyIpAddressForNetworkSafety("::ffff:127.0.0.1");
  return result.allowed === false && result.reason === "resolved_ip_loopback";
});

check("resolved_download_addresses_rejects_mixed_public_private", () => {
  const result = plugin.validateResolvedDownloadAddresses(["8.8.8.8", "10.0.0.1"]);
  return result.valid === false &&
    result.reason === "resolved_ip_blocked" &&
    result.blocked.length === 1 &&
    result.blocked[0].reason === "resolved_ip_private";
});

check("resolved_download_addresses_accepts_public_set", () => {
  const result = plugin.validateResolvedDownloadAddresses(["8.8.8.8", "2606:4700:4700::1111"]);
  return result.valid === true && result.checked_count === 2;
});

check("resolved_download_host_accepts_public_dns_result", () => {
  const result = plugin.validateResolvedDownloadHost("example.com", ["93.184.216.34"]);
  return result.valid === true && result.checked_count === 1;
});

check("resolved_download_host_rejects_private_dns_result", () => {
  const result = plugin.validateResolvedDownloadHost("example.com", ["93.184.216.34", "10.0.0.5"]);
  return result.valid === false &&
    result.reason === "resolved_ip_blocked" &&
    result.blocked[0].reason === "resolved_ip_private";
});

check("resolved_download_host_rejects_literal_metadata_ip", () => {
  const result = plugin.validateResolvedDownloadHost("169.254.169.254", ["169.254.169.254"]);
  return result.valid === false && result.reason === "resolved_ip_link_local";
});

check("download_host_resolver_fails_closed_on_dns_error", () => {
  return plugin.resolveDownloadHostForSafety("example.com", async () => {
    throw new Error("mock dns failure");
  }).then((result) => result.valid === false && result.reason === "download_dns_lookup_failed");
});

check("base_url_host_resolver_accepts_public_mock_dns", () => {
  return plugin.resolveBaseUrlHostForSafety("api.example.com", async () => {
    return [{ address: "93.184.216.34", family: 4 }];
  }).then((result) => result.valid === true && result.checked_count === 1);
});

check("base_url_host_resolver_rejects_private_mock_dns", () => {
  return plugin.resolveBaseUrlHostForSafety("api.example.com", async () => {
    return [{ address: "10.0.0.5", family: 4 }];
  }).then((result) => result.valid === false && result.reason === "resolved_ip_blocked");
});

check("base_url_host_resolver_fails_closed_on_dns_error", () => {
  return plugin.resolveBaseUrlHostForSafety("api.example.com", async () => {
    throw new Error("mock base dns failure");
  }).then((result) => result.valid === false && result.reason === "download_dns_lookup_failed");
});

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

check("decoded_image_buffer_accepts_valid_png", () => {
  return sharp({
    create: {
      width: 1,
      height: 1,
      channels: 3,
      background: { r: 255, g: 0, b: 0 },
    },
  }).png().toBuffer().then((buffer) => plugin.validateDecodedImageBuffer(buffer, "image/png")).then((result) => {
    return result.valid === true &&
      result.decoded === true &&
      result.width === 1 &&
      result.height === 1 &&
      result.pixels === 1;
  });
});

check("decoded_image_buffer_rejects_magic_only_png", () => {
  const pngHeaderOnly = Buffer.from("89504e470d0a1a0a0000000d49484452", "hex");
  return plugin.validateDecodedImageBuffer(pngHeaderOnly, "image/png").then((result) => {
    return result.valid === false && result.reason === "image_decode_failed";
  });
});

check("stream_reader_rejects_content_length_over_limit", () => {
  const response = {
    headers: { get: (name) => name.toLowerCase() === "content-length" ? "5" : "" },
    body: new ReadableStream({
      start(controller) {
        controller.enqueue(Buffer.from("abc"));
        controller.close();
      },
    }),
  };
  return plugin.readImageResponseBodyWithLimit(response, 4).then((result) => {
    return result.valid === false && result.reason === "download_content_length_too_large";
  });
});

check("stream_reader_rejects_payload_over_limit", () => {
  const response = {
    headers: { get: () => "" },
    body: new ReadableStream({
      start(controller) {
        controller.enqueue(Buffer.from("abc"));
        controller.enqueue(Buffer.from("de"));
        controller.close();
      },
    }),
  };
  return plugin.readImageResponseBodyWithLimit(response, 4).then((result) => {
    return result.valid === false && result.reason === "download_payload_too_large";
  });
});

check("write_image_output_url_fake_fetch_rejects_stream_over_limit", () => {
  const response = {
    ok: true,
    headers: {
      get: (name) => {
        if (name.toLowerCase() === "content-type") return "image/png";
        return "";
      },
    },
    body: new ReadableStream({
      start(controller) {
        controller.enqueue(Buffer.from("abcde"));
        controller.close();
      },
    }),
  };
  return plugin.writeImageOutput(
    { images: [{ url: "https://example.com/image.png" }] },
    "runs/real_generation/validator_url_fake_fetch_over_limit",
    {
      fetchImpl: async () => response,
      resolveDownloadHostForSafety: async () => ({ valid: true, checked_count: 1 }),
      maxDownloadBytes: 4,
    }
  ).then((result) => {
    return result.success === false &&
      result.failed.length === 1 &&
      result.failed[0].reason === "download_payload_too_large";
  });
});

check("content_type_allows_jpeg_alias", () => plugin.contentTypeAllowsImageFormat("image/jpg", "jpeg") === true);

check("provider_response_schema_accepts_single_b64_item", () => {
  const result = plugin.validateProviderResponseData({ data: [{ b64_json: "QUJDRA==" }] }, 1);
  return result.valid === true && result.image_count === 1;
});

check("provider_response_schema_accepts_single_url_item", () => {
  const result = plugin.validateProviderResponseData({ data: [{ url: "https://example.com/image.png" }] }, 1);
  return result.valid === true && result.image_count === 1;
});

check("provider_response_schema_rejects_missing_data", () => {
  const result = plugin.validateProviderResponseData({ model: "doubao-seedream-5-0-260128" }, 1);
  return result.valid === false && result.reason === "provider_response_data_not_array";
});

check("provider_response_schema_rejects_empty_data", () => {
  const result = plugin.validateProviderResponseData({ data: [] }, 1);
  return result.valid === false && result.reason === "provider_response_data_empty";
});

check("provider_response_schema_rejects_too_many_images", () => {
  const result = plugin.validateProviderResponseData({ data: [{ url: "https://example.com/1.png" }, { url: "https://example.com/2.png" }] }, 1);
  return result.valid === false && result.reason === "provider_response_too_many_images";
});

check("provider_response_schema_rejects_item_without_payload", () => {
  const result = plugin.validateProviderResponseData({ data: [{ revised_prompt: "ok" }] }, 1);
  return result.valid === false && result.reason === "provider_response_image_item_missing_payload";
});

check("provider_response_schema_rejects_non_string_payloads", () => {
  const b64 = plugin.validateProviderResponseData({ data: [{ b64_json: 123 }] }, 1);
  const url = plugin.validateProviderResponseData({ data: [{ url: { href: "https://example.com/image.png" } }] }, 1);
  return b64.valid === false &&
    b64.reason === "provider_response_b64_json_not_string" &&
    url.valid === false &&
    url.reason === "provider_response_url_not_string";
});

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
    typeof plugin.validateDecodedImageBuffer === "function" &&
    typeof plugin.readImageResponseBodyWithLimit === "function" &&
    typeof plugin.validateDownloadUrl === "function" &&
    typeof plugin.classifyIpAddressForNetworkSafety === "function" &&
    typeof plugin.validateResolvedDownloadAddresses === "function" &&
    typeof plugin.validateResolvedDownloadHost === "function" &&
    typeof plugin.resolveDownloadHostForSafety === "function" &&
    typeof plugin.resolveBaseUrlHostForSafety === "function" &&
    typeof plugin.contentTypeAllowsImageFormat === "function" &&
    typeof plugin.validateProviderResponseData === "function";
});

function finish() {
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
}

Promise.all(pending).then(finish);
