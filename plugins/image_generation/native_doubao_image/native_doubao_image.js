// Native Doubao Image Plugin — Agent Image Lab 原生插件
// 默认 dry_run=true。真实 API 调用必须通过 validateRealExecutionGate。
// API key 只从 process.env.DOUBAO_IMAGE_API_KEY 读取，不硬编码。

function loadPromptPackage(promptPackageRef) {
  // Stub: 读取 prompts/image_generation/ 下的 YAML
  // 返回 { prompt, negative_prompt, safety, execution }
  return { prompt: "", negative_prompt: "", safety: {}, execution: {} };
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
    size: options.size || "1024x1024",
    n: 1,
    response_format: "b64_json",
  };
}

function realGenerate(options) {
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

  // Stub: 真实 HTTP 请求入口。预留 fetch/node:https 调用位置。
  // 本轮实现 contract 但不执行真实请求。
  // var apiKey = process.env.DOUBAO_IMAGE_API_KEY;
  // var requestBody = buildDoubaoRequest(options);
  // var response = await fetch(options.apiBaseUrl, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
  //   body: JSON.stringify(requestBody)
  // });

  return {
    status: "REAL_API_CONTRACT_READY",
    plugin_id: "NativeDoubaoImage",
    command: "generate",
    api_call_performed: false,
    image_created: false,
    model_requested: options.modelOverride || "doubao-seedream-5-0-260128",
    model_reported: null,
    max_plugin_calls: 1,
    max_images_created: 1,
    retry_performed: false,
    note: "Real API call stub — actual HTTP not executed. A5 activation required.",
  };
}

function writeImageOutput(result, outputDirectory) {
  // Stub: 将 API 返回的图片写入 runs/real_generation/ 下
  // outputDirectory 必须以 runs/real_generation/ 开头
  if (outputDirectory.indexOf("runs/real_generation/") !== 0) {
    return { success: false, error: "outputDirectory must be under runs/real_generation/" };
  }
  return { success: false, reason: "write_image_not_enabled_in_dry_run", output_directory: outputDirectory };
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
