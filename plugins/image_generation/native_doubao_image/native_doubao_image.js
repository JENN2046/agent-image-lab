// Native Doubao Image Plugin — Agent Image Lab 原生插件
// 默认 dry_run=true。真实 API 调用必须通过 validateRealExecutionGate。
// API key 只从 process.env.DOUBAO_IMAGE_API_KEY 读取，不硬编码。

function loadPromptPackage(promptPackageRef) {
  // 读取 prompts/image_generation/ 下的 YAML
  var fs = require("node:fs");
  var path = require("node:path");
  var root = path.resolve(__dirname, "..", "..", "..");
  var fullPath = path.join(root, promptPackageRef);

  if (!fs.existsSync(fullPath)) {
    return { prompt: "", negative_prompt: "", error: "prompt package not found: " + promptPackageRef };
  }

  var content = fs.readFileSync(fullPath, "utf8");
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
  if (options.maxPluginCalls > 1) errors.push("max_plugin_calls must be 1");
  if (options.maxImagesCreated > 1) errors.push("max_images_created must be 1");
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
  if (options.maxPluginCalls > 1) {
    errors.push("maxPluginCalls must be 1");
  }
  if (options.maxImagesCreated > 1) {
    errors.push("maxImagesCreated must be 1");
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
  var promptText = pkg.prompt || options.prompt || "";
  var negPrompt = pkg.negative_prompt || options.negativePrompt || "";

  // Append endpoint path for image generation API
  var apiUrl = baseUrl.replace(/\/+$/, "") + "/images/generations";
  var requestBody = buildDoubaoRequest({
    modelOverride: options.modelOverride || "doubao-seedream-5-0-260128",
    prompt: promptText,
    negativePrompt: negPrompt,
    size: options.size || pkg.execution.size || "1920x1920",
  });

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
          b64_json: item.b64_json || null,
          url: item.url || null,
        });
      }
    }

    if (modelMismatch.mismatch) {
      return {
        status: "BLOCKED_MODEL_MISMATCH",
        plugin_id: "NativeDoubaoImage",
        command: "generate",
        api_call_performed: true,
        image_created: generatedImages.length > 0,
        model_requested: options.modelOverride || "doubao-seedream-5-0-260128",
        model_reported: reportedModel,
        model_matches: false,
        images: generatedImages,
        http_status: response.status,
        retry_performed: false,
      };
    }

    return {
      status: "COMPLETED_GENERATED",
      plugin_id: "NativeDoubaoImage",
      command: "generate",
      api_call_performed: true,
      image_created: generatedImages.length > 0,
      model_requested: options.modelOverride || "doubao-seedream-5-0-260128",
      model_reported: reportedModel,
      model_matches: true,
      images: generatedImages,
      http_status: response.status,
      retry_performed: false,
    };
  } catch (err) {
    return {
      status: "FAILED",
      plugin_id: "NativeDoubaoImage",
      command: "generate",
      api_call_performed: true,
      image_created: false,
      error: "HTTP request failed: " + (err.message || String(err)),
      model_requested: options.modelOverride || "doubao-seedream-5-0-260128",
      model_reported: null,
      retry_performed: false,
    };
  }
}

async function writeImageOutput(result, outputDirectory) {
  if (outputDirectory.indexOf("runs/real_generation/") !== 0) {
    return { success: false, error: "outputDirectory must be under runs/real_generation/" };
  }
  if (!result.images || result.images.length === 0) {
    return { success: false, reason: "no_images_to_write" };
  }

  var fs = require("node:fs");
  var path = require("node:path");
  var root = path.resolve(__dirname, "..", "..", "..");
  var outDir = path.join(root, outputDirectory);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  var written = [];
  for (var i = 0; i < result.images.length; i++) {
    var img = result.images[i];
    var ext = ".jpg";
    var filename = "native_doubao_" + Date.now() + "_" + i + ext;
    var filepath = path.join(outDir, filename);

    if (img.b64_json) {
      var buffer = Buffer.from(img.b64_json, "base64");
      fs.writeFileSync(filepath, buffer);
      written.push({ index: i, file: filename, bytes: buffer.length, source: "b64_json" });
    } else if (img.url) {
      // Download from URL and save
      try {
        var imageResponse = await fetch(img.url);
        var imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
        fs.writeFileSync(filepath, imageBuffer);
        written.push({ index: i, file: filename, bytes: imageBuffer.length, source: "url_download" });
      } catch (downloadErr) {
        written.push({ index: i, url: img.url, note: "download_failed: " + downloadErr.message });
      }
    }
  }

  return { success: written.length > 0, files: written, output_directory: outputDirectory };
}

function normalizeResult(result) {
  return {
    status: result.status || "unknown",
    images: [],
    model_reported: result.model || null,
    error: result.error || null,
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
  validateA5Limits: validateA5Limits,
  validateRealExecutionGate: validateRealExecutionGate,
  buildDoubaoRequest: buildDoubaoRequest,
  realGenerate: realGenerate,
  writeImageOutput: writeImageOutput,
  dryRunGenerate: dryRunGenerate,
  normalizeResult: normalizeResult,
  detectModelMismatch: detectModelMismatch,
};
