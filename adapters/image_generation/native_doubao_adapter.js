// Native Doubao Image Adapter — 统一 adapter 包装层
// 默认 dryRun=true。dryRun=false 时先通过 validateRealExecutionGate，否则 BLOCKED。

var plugin = require("../../plugins/image_generation/native_doubao_image/native_doubao_image.js");

async function run(options) {
  // 默认 dryRun=true
  if (options.dryRun === undefined) options.dryRun = true;

  var limits = plugin.validateA5Limits(options);
  if (!limits.valid) {
    return {
      status: "BLOCKED",
      plugin_id: "NativeDoubaoImage",
      errors: limits.errors,
    };
  }

  // 输出目录校验
  var outDir = options.outputDirectory || "";
  if (outDir.indexOf("runs/real_generation/") !== 0) {
    return {
      status: "BLOCKED_OUTPUT_DIRECTORY",
      plugin_id: "NativeDoubaoImage",
      error: "outputDirectory must be under runs/real_generation/",
    };
  }

  if (options.dryRun !== false) {
    return plugin.dryRunGenerate(options);
  }

  // 真实调用模式 — 先过 gate
  var gate = plugin.validateRealExecutionGate(options);
  if (!gate.gate_passed) {
    return {
      status: "BLOCKED_A5_REQUIRED",
      plugin_id: "NativeDoubaoImage",
      gate_errors: gate.errors,
    };
  }

  // 调用 realGenerate（async）
  var result = await plugin.realGenerate(options);
  if (result.status === "BLOCKED_A5_REQUIRED" || result.status.indexOf("BLOCKED") === 0 || result.status === "FAILED") {
    return result;
  }

  // 模型 mismatch 检测（冗余检查）
  var modelCheck = plugin.detectModelMismatch(
    options.modelOverride || "doubao-seedream-5-0-260128",
    result.model_reported
  );
  if (modelCheck.mismatch) {
    return {
      status: "BLOCKED_MODEL_MISMATCH",
      plugin_id: "NativeDoubaoImage",
      requested: modelCheck.requested,
      reported: modelCheck.reported,
    };
  }

  // 图片写入
  if (result.images && result.images.length > 0) {
    var writeResult = await plugin.writeImageOutput(result, options.outputDirectory);
    if (!writeResult.success) {
      return {
        status: "BLOCKED_WRITE_FAILED",
        plugin_id: "NativeDoubaoImage",
        error: writeResult.error,
      };
    }
  }

  return result;
}

module.exports = { run: run };
