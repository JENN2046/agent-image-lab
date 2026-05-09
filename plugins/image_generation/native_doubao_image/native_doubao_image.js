// Native Doubao Image Plugin — Agent Image Lab 原生插件
// 当前版本：dry-run contract only。真实 API 调用需后续 A5 授权。
// 禁止真实 HTTP 请求，禁止真实图片创建。

function loadPromptPackage(promptPackageRef) {
  // Stub: 读取 prompts/image_generation/ 下的 YAML
  // 返回 { prompt, negative_prompt, safety, execution }
  return { prompt: "", negative_prompt: "", safety: {}, execution: {} };
}

function buildRequestPayload(promptPackage, options) {
  return {
    model: options.modelOverride || "doubao-seedream-5-0-260128",
    prompt: promptPackage.prompt,
    negative_prompt: promptPackage.negative_prompt,
    size: "1024x1024",
    count: Math.min(options.maxImagesCreated || 1, 1),
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

function normalizeResult(result) {
  // Stub: 将 API 返回结果归一化
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
  return { mismatch: !match, requested: requestedModel, reported: reportedModel, match: match };
}

module.exports = {
  loadPromptPackage: loadPromptPackage,
  buildRequestPayload: buildRequestPayload,
  validateA5Limits: validateA5Limits,
  dryRunGenerate: dryRunGenerate,
  normalizeResult: normalizeResult,
  detectModelMismatch: detectModelMismatch,
};
