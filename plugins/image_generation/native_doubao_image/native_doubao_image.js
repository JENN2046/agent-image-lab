// Native Doubao Image Plugin — Agent Image Lab 原生插件
// 默认 dry_run=true。真实 API 调用必须通过 validateRealExecutionGate。
// API key 只从 process.env.DOUBAO_IMAGE_API_KEY 读取，不硬编码。

var fs = require("node:fs");
var dns = require("node:dns");
var path = require("node:path");
var YAML = require("yaml");

var REPO_ROOT = path.resolve(__dirname, "..", "..", "..");
var PROMPT_ROOT = path.resolve(REPO_ROOT, "prompts", "image_generation");
var OUTPUT_ROOT = path.resolve(REPO_ROOT, "runs", "real_generation");
var MAX_IMAGE_OUTPUT_BYTES = 25 * 1024 * 1024;
var DEFAULT_TIMEOUT_MS = 120000;
var MIN_TIMEOUT_MS = 1000;
var MAX_TIMEOUT_MS = 300000;

function timeoutMsFromSeconds(value) {
  var parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_TIMEOUT_MS;
  var ms = Math.floor(parsed * 1000);
  return Math.max(MIN_TIMEOUT_MS, Math.min(ms, MAX_TIMEOUT_MS));
}

function createTimeoutController(timeoutSeconds) {
  var controller = new AbortController();
  var timeoutMs = timeoutMsFromSeconds(timeoutSeconds || process.env.DOUBAO_IMAGE_TIMEOUT_SECONDS);
  var timer = setTimeout(function () {
    controller.abort();
  }, timeoutMs);
  return {
    signal: controller.signal,
    timeoutMs: timeoutMs,
    clear: function () { clearTimeout(timer); },
  };
}

function hasUnsafePathSegment(ref) {
  var value = String(ref || "");
  if (value.indexOf("//") !== -1 || value.indexOf("\\\\") !== -1) return true;
  return value.split(/[\\/]/).some(function (segment) {
    return segment === "..";
  });
}

function resolveSafePromptPackageRef(promptPackageRef) {
  if (typeof promptPackageRef !== "string" || promptPackageRef.length === 0) {
    return { valid: false, error: "promptPackageRef is required" };
  }
  if (path.isAbsolute(promptPackageRef) || /^[A-Za-z]:[\\/]/.test(promptPackageRef)) {
    return { valid: false, error: "promptPackageRef must be repository-relative" };
  }
  if (promptPackageRef.indexOf("\\") !== -1 || hasUnsafePathSegment(promptPackageRef)) {
    return { valid: false, error: "promptPackageRef contains unsafe path segment" };
  }
  if (promptPackageRef.indexOf("prompts/image_generation/") !== 0) {
    return { valid: false, error: "promptPackageRef must be under prompts/image_generation/" };
  }

  var fullPath = path.resolve(REPO_ROOT, promptPackageRef);
  if (fullPath.indexOf(PROMPT_ROOT + path.sep) !== 0) {
    return { valid: false, error: "promptPackageRef escapes prompts/image_generation/" };
  }
  return { valid: true, fullPath: fullPath };
}

function resolveSafeOutputDirectory(outputDirectory) {
  if (typeof outputDirectory !== "string" || outputDirectory.length === 0) {
    return { valid: false, error: "outputDirectory is required" };
  }
  if (path.isAbsolute(outputDirectory) || /^[A-Za-z]:[\\/]/.test(outputDirectory)) {
    return { valid: false, error: "outputDirectory must be repository-relative" };
  }
  if (outputDirectory.indexOf("\\") !== -1 || hasUnsafePathSegment(outputDirectory)) {
    return { valid: false, error: "outputDirectory contains unsafe path segment" };
  }
  if (outputDirectory.indexOf("runs/real_generation/") !== 0) {
    return { valid: false, error: "outputDirectory must be under runs/real_generation/" };
  }

  var fullPath = path.resolve(REPO_ROOT, outputDirectory);
  if (fullPath.indexOf(OUTPUT_ROOT + path.sep) !== 0) {
    return { valid: false, error: "outputDirectory escapes runs/real_generation/" };
  }
  return { valid: true, fullPath: fullPath };
}

function imageFormatFromBuffer(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpeg";
  }
  if (
    buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47 &&
    buffer[4] === 0x0d && buffer[5] === 0x0a && buffer[6] === 0x1a && buffer[7] === 0x0a
  ) {
    return "png";
  }
  if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "webp";
  }
  return null;
}

function extensionForImageFormat(format) {
  if (format === "jpeg") return ".jpg";
  if (format === "png") return ".png";
  if (format === "webp") return ".webp";
  return null;
}

function contentTypeAllowsImageFormat(contentType, format) {
  if (!contentType) return true;
  var normalized = String(contentType).toLowerCase().split(";")[0].trim();
  if (format === "jpeg") return normalized === "image/jpeg" || normalized === "image/jpg";
  if (format === "png") return normalized === "image/png";
  if (format === "webp") return normalized === "image/webp";
  return false;
}

function validateImageBuffer(buffer, contentType) {
  if (!Buffer.isBuffer(buffer)) {
    return { valid: false, reason: "image_payload_not_buffer" };
  }
  if (buffer.length <= 0) {
    return { valid: false, reason: "image_payload_empty" };
  }
  if (buffer.length > MAX_IMAGE_OUTPUT_BYTES) {
    return { valid: false, reason: "image_payload_too_large", bytes: buffer.length, max_bytes: MAX_IMAGE_OUTPUT_BYTES };
  }
  var format = imageFormatFromBuffer(buffer);
  if (!format) {
    return { valid: false, reason: "image_magic_number_unsupported", bytes: buffer.length };
  }
  if (!contentTypeAllowsImageFormat(contentType, format)) {
    return {
      valid: false,
      reason: "image_content_type_mismatch",
      bytes: buffer.length,
      format: format,
      content_type: contentType,
    };
  }
  return {
    valid: true,
    bytes: buffer.length,
    format: format,
    extension: extensionForImageFormat(format),
  };
}

function isLikelyBase64(value) {
  if (typeof value !== "string" || value.length === 0 || value.length % 4 !== 0) return false;
  return /^[A-Za-z0-9+/]+={0,2}$/.test(value);
}

function parseIpv4Address(value) {
  var parts = String(value || "").split(".");
  if (parts.length !== 4) return null;
  var nums = [];
  for (var i = 0; i < parts.length; i++) {
    if (!/^\d{1,3}$/.test(parts[i])) return null;
    var n = Number(parts[i]);
    if (!Number.isInteger(n) || n < 0 || n > 255) return null;
    nums.push(n);
  }
  return nums;
}

function normalizeIpv6Address(value) {
  var input = String(value || "").toLowerCase();
  if (input[0] === "[" && input[input.length - 1] === "]") {
    input = input.slice(1, -1);
  }
  var zoneIndex = input.indexOf("%");
  if (zoneIndex !== -1) input = input.slice(0, zoneIndex);
  return input;
}

function classifyIpAddressForNetworkSafety(address) {
  var raw = String(address || "").trim();
  if (!raw) return { allowed: false, reason: "resolved_ip_missing" };

  var ipv4 = parseIpv4Address(raw);
  if (ipv4) {
    var a = ipv4[0];
    var b = ipv4[1];
    if (a === 0) return { allowed: false, reason: "resolved_ip_unspecified_or_this_network" };
    if (a === 10) return { allowed: false, reason: "resolved_ip_private" };
    if (a === 127) return { allowed: false, reason: "resolved_ip_loopback" };
    if (a === 169 && b === 254) return { allowed: false, reason: "resolved_ip_link_local" };
    if (a === 172 && b >= 16 && b <= 31) return { allowed: false, reason: "resolved_ip_private" };
    if (a === 192 && b === 168) return { allowed: false, reason: "resolved_ip_private" };
    if (a === 100 && b >= 64 && b <= 127) return { allowed: false, reason: "resolved_ip_carrier_grade_nat" };
    if (a === 192 && b === 0) return { allowed: false, reason: "resolved_ip_ietf_protocol_assignment" };
    if (a === 192 && b === 0 && ipv4[2] === 2) return { allowed: false, reason: "resolved_ip_documentation" };
    if (a === 198 && (b === 18 || b === 19)) return { allowed: false, reason: "resolved_ip_benchmarking" };
    if (a === 198 && b === 51 && ipv4[2] === 100) return { allowed: false, reason: "resolved_ip_documentation" };
    if (a === 203 && b === 0 && ipv4[2] === 113) return { allowed: false, reason: "resolved_ip_documentation" };
    if (a >= 224) return { allowed: false, reason: "resolved_ip_multicast_or_reserved" };
    return { allowed: true, family: "ipv4" };
  }

  var ipv6 = normalizeIpv6Address(raw);
  if (ipv6 === "::" || ipv6 === "0:0:0:0:0:0:0:0") {
    return { allowed: false, reason: "resolved_ip_unspecified" };
  }
  if (ipv6 === "::1" || ipv6 === "0:0:0:0:0:0:0:1") {
    return { allowed: false, reason: "resolved_ip_loopback" };
  }
  if (ipv6.indexOf("::ffff:") === 0) {
    return classifyIpAddressForNetworkSafety(ipv6.slice("::ffff:".length));
  }
  if (ipv6.indexOf("fc") === 0 || ipv6.indexOf("fd") === 0) {
    return { allowed: false, reason: "resolved_ip_unique_local" };
  }
  if (/^fe[89ab]/.test(ipv6)) {
    return { allowed: false, reason: "resolved_ip_link_local" };
  }
  if (ipv6.indexOf("ff") === 0) {
    return { allowed: false, reason: "resolved_ip_multicast" };
  }
  if (ipv6.indexOf("2001:db8") === 0) {
    return { allowed: false, reason: "resolved_ip_documentation" };
  }
  if (ipv6.indexOf(":") !== -1) {
    return { allowed: true, family: "ipv6" };
  }
  return { allowed: false, reason: "resolved_ip_not_parseable" };
}

function validateResolvedDownloadAddresses(addresses) {
  if (!Array.isArray(addresses) || addresses.length === 0) {
    return { valid: false, reason: "resolved_ip_list_empty" };
  }
  var blocked = [];
  for (var i = 0; i < addresses.length; i++) {
    var classification = classifyIpAddressForNetworkSafety(addresses[i]);
    if (!classification.allowed) {
      blocked.push({ address: addresses[i], reason: classification.reason });
    }
  }
  if (blocked.length > 0) {
    return { valid: false, reason: "resolved_ip_blocked", blocked: blocked };
  }
  return { valid: true, checked_count: addresses.length };
}

function validateResolvedDownloadHost(hostname, addresses) {
  var host = String(hostname || "").toLowerCase();
  if (!host) {
    return { valid: false, reason: "download_host_missing" };
  }
  if (host === "localhost") {
    return { valid: false, reason: "download_blocked_localhost" };
  }

  var literalHostSafety = classifyIpAddressForNetworkSafety(host);
  if (parseIpv4Address(host) || normalizeIpv6Address(host).indexOf(":") !== -1) {
    if (!literalHostSafety.allowed) {
      return { valid: false, reason: literalHostSafety.reason };
    }
    return { valid: true, checked_count: 1, literal_ip: true };
  }

  return validateResolvedDownloadAddresses(addresses);
}

async function resolveDownloadHostForSafety(hostname, resolver) {
  var host = String(hostname || "").toLowerCase();
  var literalCheck = validateResolvedDownloadHost(host, [host]);
  if (parseIpv4Address(host) || normalizeIpv6Address(host).indexOf(":") !== -1) {
    return literalCheck;
  }
  if (!host || host === "localhost") {
    return literalCheck;
  }

  var lookup = resolver || function (name) {
    return dns.promises.lookup(name, { all: true, verbatim: true });
  };

  try {
    var records = await lookup(host);
    if (!Array.isArray(records)) records = [records];
    var addresses = records.map(function (record) {
      return typeof record === "string" ? record : record && record.address;
    }).filter(Boolean);
    return validateResolvedDownloadHost(host, addresses);
  } catch (err) {
    return { valid: false, reason: "download_dns_lookup_failed" };
  }
}

async function resolveBaseUrlHostForSafety(hostname, resolver) {
  return resolveDownloadHostForSafety(hostname, resolver);
}

function validateDownloadUrl(rawUrl) {
  try {
    var parsed = new URL(rawUrl);
    var host = parsed.hostname.toLowerCase();
    if (parsed.protocol !== "https:") {
      return { valid: false, reason: "download_blocked_non_https_url" };
    }
    if (host === "localhost") {
      return { valid: false, reason: "download_blocked_localhost" };
    }
    var literalHostSafety = classifyIpAddressForNetworkSafety(host);
    if (literalHostSafety.family && !literalHostSafety.allowed) {
      return { valid: false, reason: literalHostSafety.reason };
    }
    if (parseIpv4Address(host) || normalizeIpv6Address(host).indexOf(":") !== -1) {
      if (!literalHostSafety.allowed) {
        return { valid: false, reason: literalHostSafety.reason };
      }
    }
    return { valid: true, url: parsed };
  } catch (err) {
    return { valid: false, reason: "download_url_invalid" };
  }
}

function writeVerifiedImageBuffer(buffer, outDir, baseName, contentType) {
  var validation = validateImageBuffer(buffer, contentType);
  if (!validation.valid) {
    return { verified: false, reason: validation.reason, bytes: validation.bytes || buffer.length };
  }
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  var filename = baseName + validation.extension;
  var filepath = path.join(outDir, filename);
  var tempPath = filepath + ".tmp-" + process.pid;
  if (fs.existsSync(filepath) || fs.existsSync(tempPath)) {
    return { verified: false, reason: "output_file_already_exists" };
  }
  fs.writeFileSync(tempPath, buffer, { flag: "wx" });
  var tempCheck = verifyLocalOutputFile(tempPath, outDir);
  if (!tempCheck.verified) {
    try { fs.unlinkSync(tempPath); } catch (err) {}
    return tempCheck;
  }
  fs.renameSync(tempPath, filepath);
  var finalCheck = verifyLocalOutputFile(filepath, outDir);
  if (!finalCheck.verified) {
    return finalCheck;
  }
  return {
    verified: true,
    file: filename,
    bytes: finalCheck.bytes,
    format: finalCheck.format,
  };
}

function verifyLocalOutputFile(filePath, outputRoot) {
  try {
    var resolvedFile = path.resolve(filePath);
    var resolvedRoot = path.resolve(outputRoot);
    if (resolvedFile.indexOf(resolvedRoot + path.sep) !== 0) {
      return { verified: false, reason: "file_outside_output_directory" };
    }
    if (!fs.existsSync(resolvedFile)) {
      return { verified: false, reason: "file_missing" };
    }
    var stat = fs.statSync(resolvedFile);
    if (!stat.isFile()) {
      return { verified: false, reason: "not_a_file" };
    }
    if (stat.size <= 0) {
      return { verified: false, reason: "empty_file" };
    }
    if (stat.size > MAX_IMAGE_OUTPUT_BYTES) {
      return { verified: false, reason: "file_too_large", bytes: stat.size, max_bytes: MAX_IMAGE_OUTPUT_BYTES };
    }
    var validation = validateImageBuffer(fs.readFileSync(resolvedFile));
    if (!validation.valid) {
      return { verified: false, reason: validation.reason, bytes: stat.size };
    }
    return { verified: true, bytes: stat.size, format: validation.format };
  } catch (err) {
    return { verified: false, reason: "stat_failed" };
  }
}

function validateBaseUrl(rawBaseUrl) {
  if (!rawBaseUrl) {
    return { valid: false, error: "DOUBAO_IMAGE_API_BASE_URL environment variable is not set" };
  }
  try {
    var parsed = new URL(rawBaseUrl);
    var host = parsed.hostname.toLowerCase();
    if (parsed.protocol !== "https:") {
      return { valid: false, error: "DOUBAO_IMAGE_API_BASE_URL must use https" };
    }
    if (host === "localhost" || host === "127.0.0.1" || host === "::1") {
      return { valid: false, error: "DOUBAO_IMAGE_API_BASE_URL must not target localhost" };
    }
    if (/^10\./.test(host) || /^192\.168\./.test(host) || /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)) {
      return { valid: false, error: "DOUBAO_IMAGE_API_BASE_URL must not target private network hosts" };
    }
    return { valid: true, url: parsed };
  } catch (err) {
    return { valid: false, error: "DOUBAO_IMAGE_API_BASE_URL is not a valid URL" };
  }
}

function normalizePromptPackageText(value) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function loadPromptPackage(promptPackageRef) {
  // 读取 prompts/image_generation/ 下的 YAML
  var safeRef = resolveSafePromptPackageRef(promptPackageRef);
  if (!safeRef.valid) {
    return { prompt: "", negative_prompt: "", error: safeRef.error };
  }

  if (!fs.existsSync(safeRef.fullPath)) {
    return { prompt: "", negative_prompt: "", error: "prompt package not found: " + promptPackageRef };
  }

  var content = fs.readFileSync(safeRef.fullPath, "utf8");
  var parsed;
  try {
    parsed = YAML.parse(content) || {};
  } catch (err) {
    return { prompt: "", negative_prompt: "", error: "prompt package YAML parse failed" };
  }

  var execution = parsed.execution && typeof parsed.execution === "object" ? parsed.execution : {};
  if (!execution.model && typeof parsed.model === "string") execution.model = parsed.model;
  if (!execution.size && typeof parsed.size === "string") execution.size = parsed.size;

  var safety = parsed.safety && typeof parsed.safety === "object" ? parsed.safety : {};
  if (typeof parsed.person_or_face_allowed === "boolean") {
    safety.person_or_face_allowed = parsed.person_or_face_allowed;
  }

  return {
    prompt: normalizePromptPackageText(parsed.prompt),
    negative_prompt: normalizePromptPackageText(parsed.negative_prompt),
    safety: safety,
    execution: execution,
  };
}

function validateA5Limits(options) {
  var errors = [];
  if (options.maxPluginCalls !== 1) errors.push("maxPluginCalls must be exactly 1");
  if (options.maxImagesCreated !== 1) errors.push("maxImagesCreated must be exactly 1");
  if (options.retryAllowed) errors.push("retry not allowed");
  return { valid: errors.length === 0, errors: errors };
}

function dryRunGenerate(options) {
  var limits = validateA5Limits(options);
  return {
    status: "DRY_RUN_ONLY",
    plugin_id: "NativeDoubaoImage",
    command: "generate",
    api_call_performed: false,
    image_created: false,
    model_requested: options.modelOverride || "doubao-seedream-5-0-260128",
    model_reported: null,
    max_plugin_calls: options.maxPluginCalls || 1,
    max_images_created: options.maxImagesCreated || 1,
    retry_performed: false,
    limits_valid: limits.valid,
    limit_errors: limits.errors,
  };
}

function validateRealExecutionGate(options) {
  var errors = [];

  if (options.dryRun !== false) {
    errors.push("dry_run must be false for real execution");
  }
  if (options.executionAuthorized !== true) {
    errors.push("executionAuthorized must be true");
  }
  if (!options.a5ActivationRef) {
    errors.push("a5ActivationRef is required");
  }
  if (!options.apiKeyEnv || options.apiKeyEnv !== "DOUBAO_IMAGE_API_KEY") {
    errors.push("apiKeyEnv must be DOUBAO_IMAGE_API_KEY");
  }
  if (!process.env.DOUBAO_IMAGE_API_KEY) {
    errors.push("DOUBAO_IMAGE_API_KEY environment variable is not set");
  }
  var baseUrlCheck = validateBaseUrl(process.env.DOUBAO_IMAGE_API_BASE_URL);
  if (!baseUrlCheck.valid) {
    errors.push(baseUrlCheck.error);
  }
  if (options.maxPluginCalls !== 1) {
    errors.push("maxPluginCalls must be exactly 1");
  }
  if (options.maxImagesCreated !== 1) {
    errors.push("maxImagesCreated must be exactly 1");
  }
  if (options.retryAllowed) {
    errors.push("retry not allowed");
  }

  return { gate_passed: errors.length === 0, errors: errors };
}

function buildDoubaoRequest(options) {
  // Provider-specific payload builder. All Doubao API fields centralized here.
  return {
    model: options.modelOverride || "doubao-seedream-5-0-260128",
    prompt: options.prompt || "",
    negative_prompt: options.negativePrompt || "",
    size: options.size || "1920x1920",
    n: 1,
    watermark: false,
  };
}

function validateWatermarkParameter(requestBody) {
  if (!requestBody || typeof requestBody !== "object") {
    return { valid: false, error: "BLOCKED_WATERMARK_PARAMETER_MISSING", detail: "request body is missing" };
  }
  if (!("watermark" in requestBody)) {
    return { valid: false, error: "BLOCKED_WATERMARK_PARAMETER_MISSING", detail: "watermark field is missing from request" };
  }
  if (requestBody.watermark !== false) {
    return { valid: false, error: "BLOCKED_WATERMARK_PARAMETER_INVALID", detail: "watermark must be boolean false, got: " + typeof requestBody.watermark + " " + JSON.stringify(requestBody.watermark) };
  }
  return { valid: true, error: null };
}

function validateProviderResponseData(responseData, maxImagesCreated) {
  if (!responseData || typeof responseData !== "object" || Array.isArray(responseData)) {
    return { valid: false, reason: "provider_response_not_object" };
  }
  if (!Array.isArray(responseData.data)) {
    return { valid: false, reason: "provider_response_data_not_array" };
  }
  if (responseData.data.length <= 0) {
    return { valid: false, reason: "provider_response_data_empty" };
  }
  var maxImages = Number.isFinite(Number(maxImagesCreated)) ? Number(maxImagesCreated) : 1;
  if (responseData.data.length > maxImages) {
    return {
      valid: false,
      reason: "provider_response_too_many_images",
      image_count: responseData.data.length,
      max_images: maxImages,
    };
  }
  for (var i = 0; i < responseData.data.length; i++) {
    var item = responseData.data[i];
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return { valid: false, reason: "provider_response_image_item_not_object", index: i };
    }
    if (item.b64_json !== undefined && typeof item.b64_json !== "string") {
      return { valid: false, reason: "provider_response_b64_json_not_string", index: i };
    }
    if (item.url !== undefined && typeof item.url !== "string") {
      return { valid: false, reason: "provider_response_url_not_string", index: i };
    }
    var hasB64 = typeof item.b64_json === "string" && item.b64_json.length > 0;
    var hasUrl = typeof item.url === "string" && item.url.length > 0;
    if (!hasB64 && !hasUrl) {
      return { valid: false, reason: "provider_response_image_item_missing_payload", index: i };
    }
  }
  return {
    valid: true,
    image_count: responseData.data.length,
  };
}

async function realGenerate(options) {
  var gate = validateRealExecutionGate(options);
  if (!gate.gate_passed) {
    return {
      status: "BLOCKED_A5_REQUIRED",
      plugin_id: "NativeDoubaoImage",
      command: "generate",
      api_call_performed: false,
      image_created: false,
      gate_errors: gate.errors,
    };
  }

  var apiKey = process.env.DOUBAO_IMAGE_API_KEY;
  var baseUrl = process.env.DOUBAO_IMAGE_API_BASE_URL;

  // Load prompt from package
  var pkgRef = options.promptPackageRef || "";
  var pkg = loadPromptPackage(pkgRef);
  if (pkg.error) {
    return {
      status: "BLOCKED_PROMPT_PACKAGE_REF",
      plugin_id: "NativeDoubaoImage",
      command: "generate",
      api_call_performed: false,
      image_created: false,
      error: pkg.error,
    };
  }
  var promptText = pkg.prompt || options.prompt || "";
  var negPrompt = pkg.negative_prompt || options.negativePrompt || "";

  // Append endpoint path for image generation API
  var baseUrlCheck = validateBaseUrl(baseUrl);
  if (!baseUrlCheck.valid) {
    return {
      status: "BLOCKED_BASE_URL",
      plugin_id: "NativeDoubaoImage",
      command: "generate",
      api_call_performed: false,
      image_created: false,
      error_category: "base_url_invalid",
      error: baseUrlCheck.error,
    };
  }
  var baseHostSafety = await resolveBaseUrlHostForSafety(baseUrlCheck.url.hostname);
  if (!baseHostSafety.valid) {
    return {
      status: "BLOCKED_BASE_URL",
      plugin_id: "NativeDoubaoImage",
      command: "generate",
      api_call_performed: false,
      image_created: false,
      error_category: "base_url_resolved_host_blocked",
      error: baseHostSafety.reason,
    };
  }
  var apiUrl = baseUrlCheck.url.toString().replace(/\/+$/, "") + "/images/generations";
  var requestBody = buildDoubaoRequest({
    modelOverride: options.modelOverride || "doubao-seedream-5-0-260128",
    prompt: promptText,
    negativePrompt: negPrompt,
    size: options.size || pkg.execution.size || "1920x1920",
  });

  // Watermark parameter enforcement
  var wmCheck = validateWatermarkParameter(requestBody);
  if (!wmCheck.valid) {
    return {
      status: wmCheck.error,
      plugin_id: "NativeDoubaoImage",
      command: "generate",
      api_call_performed: false,
      image_created: false,
      watermark_requested: false,
      watermark_parameter_sent: "watermark" in requestBody,
      watermark_validation_error: wmCheck.detail,
    };
  }

  var requestTimeout = createTimeoutController(options.timeoutSeconds);
  try {
    var response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey,
      },
      body: JSON.stringify(requestBody),
      signal: requestTimeout.signal,
    });

    var responseContentType = response.headers && response.headers.get ? response.headers.get("content-type") : "";
    if (!String(responseContentType || "").toLowerCase().includes("application/json")) {
      return {
        status: "FAILED",
        plugin_id: "NativeDoubaoImage",
        command: "generate",
        api_call_performed: true,
        image_created: false,
        http_status: response.status,
        error_category: "provider_invalid_content_type",
        error: "API response content-type was not application/json",
        model_requested: options.modelOverride || "doubao-seedream-5-0-260128",
        model_reported: null,
        retry_performed: false,
      };
    }

    var responseData = await response.json();

    if (!response.ok) {
      return {
        status: "FAILED",
        plugin_id: "NativeDoubaoImage",
        command: "generate",
        api_call_performed: true,
        image_created: false,
        http_status: response.status,
        error: "API returned error",
        model_requested: options.modelOverride || "doubao-seedream-5-0-260128",
        model_reported: null,
        retry_performed: false,
      };
    }

    var responseSchema = validateProviderResponseData(responseData, options.maxImagesCreated || 1);
    if (!responseSchema.valid) {
      return {
        status: "FAILED",
        plugin_id: "NativeDoubaoImage",
        command: "generate",
        api_call_performed: true,
        image_created: false,
        http_status: response.status,
        error_category: "provider_invalid_response_schema",
        error: responseSchema.reason,
        provider_reported_image_count: responseSchema.image_count || 0,
        model_requested: options.modelOverride || "doubao-seedream-5-0-260128",
        model_reported: null,
        retry_performed: false,
      };
    }

    var reportedModel = responseData.model || responseData.model_id || null;
    var modelMismatch = detectModelMismatch(
      options.modelOverride || "doubao-seedream-5-0-260128",
      reportedModel
    );

    var generatedImages = [];
    if (responseData.data && Array.isArray(responseData.data)) {
      for (var i = 0; i < responseData.data.length; i++) {
        var item = responseData.data[i] || {};
        var b64 = typeof item.b64_json === "string" ? item.b64_json : null;
        var url = typeof item.url === "string" ? item.url : null;
        generatedImages.push({
          index: i,
          has_b64_json: Boolean(b64),
          has_url: Boolean(url),
          b64_json: b64,
          url: url,
        });
      }
    }
    var publicImageSummary = generatedImages.map(function (item) {
      return {
        index: item.index,
        has_b64_json: item.has_b64_json,
        has_url: item.has_url,
      };
    });

    if (modelMismatch.mismatch) {
      var mismatchResult = {
        status: "BLOCKED_MODEL_MISMATCH",
        plugin_id: "NativeDoubaoImage",
        command: "generate",
        api_call_performed: true,
        image_created: generatedImages.length > 0,
        model_requested: options.modelOverride || "doubao-seedream-5-0-260128",
        model_reported: reportedModel,
        model_matches: false,
        images: publicImageSummary,
        public_images: publicImageSummary,
        raw_image_payload_returned: false,
        provider_url_returned: false,
        http_status: response.status,
        retry_performed: false,
      };
      Object.defineProperty(mismatchResult, "_raw_images", {
        value: generatedImages,
        enumerable: false,
      });
      return mismatchResult;
    }

    var successResult = {
      status: "COMPLETED_GENERATED",
      plugin_id: "NativeDoubaoImage",
      command: "generate",
      api_call_performed: true,
      image_created: generatedImages.length > 0,
      model_requested: options.modelOverride || "doubao-seedream-5-0-260128",
      model_reported: reportedModel,
      model_matches: true,
      images: publicImageSummary,
      public_images: publicImageSummary,
      raw_image_payload_returned: false,
      provider_url_returned: false,
      http_status: response.status,
      retry_performed: false,
      watermark_requested: false,
      watermark_parameter_sent: true,
      watermark_policy: "disabled_by_request_payload",
    };
    Object.defineProperty(successResult, "_raw_images", {
      value: generatedImages,
      enumerable: false,
    });
    return successResult;
  } catch (err) {
    return {
      status: "FAILED",
      plugin_id: "NativeDoubaoImage",
      command: "generate",
      api_call_performed: true,
      image_created: false,
      error_category: err && err.name === "AbortError" ? "provider_timeout" : "network_or_provider_error",
      error: err && err.name === "AbortError" ? "HTTP request timed out" : "HTTP request failed",
      model_requested: options.modelOverride || "doubao-seedream-5-0-260128",
      model_reported: null,
      retry_performed: false,
    };
  } finally {
    requestTimeout.clear();
  }
}

async function writeImageOutput(result, outputDirectory) {
  var safeOutput = resolveSafeOutputDirectory(outputDirectory);
  if (!safeOutput.valid) {
    return { success: false, error: safeOutput.error };
  }
  if (!result.images || result.images.length === 0) {
    return { success: false, reason: "no_images_to_write" };
  }

  var outDir = safeOutput.fullPath;
  var written = [];
  var failed = [];
  for (var i = 0; i < result.images.length; i++) {
    var img = result.images[i];
    var baseName = "native_doubao_" + Date.now() + "_" + process.hrtime.bigint().toString() + "_" + i;

    if (img.b64_json) {
      if (!isLikelyBase64(img.b64_json)) {
        failed.push({ index: i, reason: "b64_json_invalid_base64", source: "b64_json" });
        continue;
      }
      var buffer = Buffer.from(img.b64_json, "base64");
      var b64Check = writeVerifiedImageBuffer(buffer, outDir, baseName, null);
      if (b64Check.verified) {
        written.push({ index: i, file: b64Check.file, bytes: b64Check.bytes, format: b64Check.format, source: "b64_json" });
      } else {
        failed.push({ index: i, reason: b64Check.reason, source: "b64_json" });
      }
    } else if (img.url) {
      // Download from URL and save
      try {
        var urlCheck = validateDownloadUrl(img.url);
        if (!urlCheck.valid) {
          failed.push({ index: i, reason: urlCheck.reason, source: "url_download" });
          continue;
        }
        var hostSafety = await resolveDownloadHostForSafety(urlCheck.url.hostname);
        if (!hostSafety.valid) {
          failed.push({ index: i, reason: hostSafety.reason, source: "url_download" });
          continue;
        }
        var downloadTimeout = createTimeoutController();
        try {
          var imageResponse = await fetch(urlCheck.url.toString(), {
            redirect: "error",
            signal: downloadTimeout.signal,
          });
          if (!imageResponse.ok) {
            failed.push({ index: i, reason: "download_http_failed" });
            continue;
          }
          var downloadContentType = imageResponse.headers && imageResponse.headers.get ? imageResponse.headers.get("content-type") : "";
          if (!/^image\/(jpeg|jpg|png|webp)(;|$)/i.test(String(downloadContentType || ""))) {
            failed.push({ index: i, reason: "download_content_type_missing_or_invalid", source: "url_download" });
            continue;
          }
          var imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
          var outputCheck = writeVerifiedImageBuffer(imageBuffer, outDir, baseName, downloadContentType);
          if (outputCheck.verified) {
            written.push({ index: i, file: outputCheck.file, bytes: outputCheck.bytes, format: outputCheck.format, source: "url_download" });
          } else {
            failed.push({ index: i, reason: outputCheck.reason, source: "url_download" });
          }
        } finally {
          downloadTimeout.clear();
        }
      } catch (downloadErr) {
        failed.push({ index: i, reason: downloadErr && downloadErr.name === "AbortError" ? "download_timeout" : "download_failed" });
      }
    } else {
      failed.push({ index: i, reason: "no_supported_image_payload" });
    }
  }

  return {
    success: written.length > 0,
    files: written,
    failed: failed,
    output_directory: outputDirectory,
    local_files_written_count: written.length,
    local_files_verified_count: written.length,
    local_persistence_success: written.length > 0,
  };
}

function normalizeResult(result) {
  var providerReportedImageCount = typeof result.provider_reported_image_count === "number"
    ? result.provider_reported_image_count
    : (result.images && Array.isArray(result.images) ? result.images.length : 0);
  var localFilesVerifiedCount = typeof result.local_files_verified_count === "number"
    ? result.local_files_verified_count
    : 0;
  var localPersistenceSuccess = localFilesVerifiedCount > 0;
  return {
    status: result.status || "unknown",
    plugin_id: result.plugin_id || "NativeDoubaoImage",
    command: result.command || "generate",
    api_call_performed: result.api_call_performed === true,
    provider_request_success: result.provider_request_success === true,
    provider_reported_image_count: providerReportedImageCount,
    image_created: localPersistenceSuccess,
    image_count: localFilesVerifiedCount,
    model_requested: result.model_requested || null,
    model_reported: result.model_reported || null,
    model_matches: result.model_matches === true,
    http_status: result.http_status || null,
    files_written_count: localFilesVerifiedCount,
    local_files_written_count: typeof result.local_files_written_count === "number" ? result.local_files_written_count : localFilesVerifiedCount,
    local_files_verified_count: localFilesVerifiedCount,
    local_persistence_success: localPersistenceSuccess,
    human_review_required_now: localPersistenceSuccess,
    output_files: Array.isArray(result.output_files) ? result.output_files : [],
    error: result.error || null,
    error_category: result.error_category || null,
    raw_image_payload_returned: false,
    provider_url_returned: false,
  };
}

function detectModelMismatch(requestedModel, reportedModel) {
  if (!requestedModel || !reportedModel) return { mismatch: false, reason: "insufficient_data" };
  var match = requestedModel === reportedModel;
  if (!match) {
    return { mismatch: true, requested: requestedModel, reported: reportedModel, match: false, blocked: true };
  }
  return { mismatch: false, requested: requestedModel, reported: reportedModel, match: true };
}

module.exports = {
  loadPromptPackage: loadPromptPackage,
  resolveSafePromptPackageRef: resolveSafePromptPackageRef,
  resolveSafeOutputDirectory: resolveSafeOutputDirectory,
  verifyLocalOutputFile: verifyLocalOutputFile,
  validateImageBuffer: validateImageBuffer,
  validateDownloadUrl: validateDownloadUrl,
  classifyIpAddressForNetworkSafety: classifyIpAddressForNetworkSafety,
  validateResolvedDownloadAddresses: validateResolvedDownloadAddresses,
  validateResolvedDownloadHost: validateResolvedDownloadHost,
  resolveDownloadHostForSafety: resolveDownloadHostForSafety,
  resolveBaseUrlHostForSafety: resolveBaseUrlHostForSafety,
  contentTypeAllowsImageFormat: contentTypeAllowsImageFormat,
  validateBaseUrl: validateBaseUrl,
  validateA5Limits: validateA5Limits,
  validateRealExecutionGate: validateRealExecutionGate,
  buildDoubaoRequest: buildDoubaoRequest,
  validateWatermarkParameter: validateWatermarkParameter,
  validateProviderResponseData: validateProviderResponseData,
  realGenerate: realGenerate,
  writeImageOutput: writeImageOutput,
  dryRunGenerate: dryRunGenerate,
  normalizeResult: normalizeResult,
  detectModelMismatch: detectModelMismatch,
};
