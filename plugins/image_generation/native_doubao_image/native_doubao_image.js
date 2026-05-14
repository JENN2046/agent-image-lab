// Native Doubao Image Plugin — Agent Image Lab 原生插件
// 默认 dry_run=true。真实 API 调用必须通过 validateRealExecutionGate。
// API key 只从 process.env.DOUBAO_IMAGE_API_KEY 读取，不硬编码。

var fs = require("node:fs");
var path = require("node:path");

var REPO_ROOT = path.resolve(__dirname, "..", "..", "..");
var PROMPT_ROOT = path.resolve(REPO_ROOT, "prompts", "image_generation");
var OUTPUT_ROOT = path.resolve(REPO_ROOT, "runs", "real_generation");

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
    return { verified: true, bytes: stat.size };
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
  var lines = content.split("\n");

  var promptLines = [];
  var negativeLines = [];
  var inPrompt = false;
  var inNeg = false;
  var safety = {};
  var execution = {};

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line.trim() === "prompt: |" || line.trim() === "prompt: >") {
      inPrompt = true; inNeg = false; continue;
    }
    if (line.trim() === "negative_prompt: |" || line.trim() === "negative_prompt: >") {
      inNeg = true; inPrompt = false; continue;
    }
    if (line.match(/^\w+:/) || line.trim().startsWith("---")) {
      if (inPrompt && !inNeg && line.trim().length > 0) { inPrompt = false; }
      if (inNeg && !inPrompt && line.trim().length > 0) { inNeg = false; }
      if (line.includes(":")) {
        var key = line.split(":")[0].trim();
        var val = line.split(":")[1]?.trim() || "";
        if (key === "person_or_face_allowed") safety.person_or_face_allowed = val === "false" ? false : true;
        if (key === "model") execution.model = val;
        if (key === "size") execution.size = val;
      }
      continue;
    }
    if (inPrompt) promptLines.push(line.replace(/^(\s{2}|\s{4}|\t)/, ""));
    if (inNeg) negativeLines.push(line.replace(/^(\s{2}|\s{4}|\t)/, ""));
  }

  return {
    prompt: promptLines.join(" ").trim(),
    negative_prompt: negativeLines.join(" ").trim(),
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

  try {
    var response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey,
      },
      body: JSON.stringify(requestBody),
    });

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

    var reportedModel = responseData.model || responseData.model_id || null;
    var modelMismatch = detectModelMismatch(
      options.modelOverride || "doubao-seedream-5-0-260128",
      reportedModel
    );

    var generatedImages = [];
    if (responseData.data && Array.isArray(responseData.data)) {
      for (var i = 0; i < responseData.data.length; i++) {
        var item = responseData.data[i];
        generatedImages.push({
          index: i,
          has_b64_json: Boolean(item.b64_json),
          has_url: Boolean(item.url),
          b64_json: item.b64_json || null,
          url: item.url || null,
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
      error_category: "network_or_provider_error",
      error: "HTTP request failed",
      model_requested: options.modelOverride || "doubao-seedream-5-0-260128",
      model_reported: null,
      retry_performed: false,
    };
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

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  var written = [];
  var failed = [];
  for (var i = 0; i < result.images.length; i++) {
    var img = result.images[i];
    var ext = ".jpg";
    var filename = "native_doubao_" + Date.now() + "_" + i + ext;
    var filepath = path.join(outDir, filename);

    if (img.b64_json) {
      var buffer = Buffer.from(img.b64_json, "base64");
      fs.writeFileSync(filepath, buffer);
      var b64Check = verifyLocalOutputFile(filepath, outDir);
      if (b64Check.verified) {
        written.push({ index: i, file: filename, bytes: b64Check.bytes, source: "b64_json" });
      } else {
        failed.push({ index: i, reason: b64Check.reason, source: "b64_json" });
      }
    } else if (img.url) {
      // Download from URL and save
      try {
        var parsedUrl = new URL(img.url);
        if (parsedUrl.protocol !== "https:") {
          failed.push({ index: i, reason: "download_blocked_non_https_url" });
          continue;
        }
        var imageResponse = await fetch(img.url);
        if (!imageResponse.ok) {
          failed.push({ index: i, reason: "download_http_failed" });
          continue;
        }
        var imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
        if (imageBuffer.length <= 0) {
          failed.push({ index: i, reason: "download_empty_body" });
          continue;
        }
        fs.writeFileSync(filepath, imageBuffer);
        var urlCheck = verifyLocalOutputFile(filepath, outDir);
        if (urlCheck.verified) {
          written.push({ index: i, file: filename, bytes: urlCheck.bytes, source: "url_download" });
        } else {
          failed.push({ index: i, reason: urlCheck.reason, source: "url_download" });
        }
      } catch (downloadErr) {
        failed.push({ index: i, reason: "download_failed" });
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
  validateBaseUrl: validateBaseUrl,
  validateA5Limits: validateA5Limits,
  validateRealExecutionGate: validateRealExecutionGate,
  buildDoubaoRequest: buildDoubaoRequest,
  validateWatermarkParameter: validateWatermarkParameter,
  realGenerate: realGenerate,
  writeImageOutput: writeImageOutput,
  dryRunGenerate: dryRunGenerate,
  normalizeResult: normalizeResult,
  detectModelMismatch: detectModelMismatch,
};
