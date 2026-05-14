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
  var safeOutput = plugin.resolveSafeOutputDirectory(outDir);
  if (!safeOutput.valid) {
    return {
      status: "BLOCKED_OUTPUT_DIRECTORY",
      plugin_id: "NativeDoubaoImage",
      error: safeOutput.error,
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
    return plugin.normalizeResult(result);
  }
  var providerReportedImageCount = result.images && Array.isArray(result.images) ? result.images.length : 0;
  result.provider_request_success = result.api_call_performed === true && result.http_status >= 200 && result.http_status < 300;
  result.provider_reported_image_count = providerReportedImageCount;

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
  if (result._raw_images && result._raw_images.length > 0) {
    var writeResult = await plugin.writeImageOutput({ images: result._raw_images }, options.outputDirectory);
    result.local_files_written_count = writeResult.local_files_written_count || 0;
    result.local_files_verified_count = writeResult.local_files_verified_count || 0;
    result.local_persistence_success = writeResult.local_persistence_success === true;
    result.output_files = writeResult.files.map(function (item) { return item.file; }).filter(Boolean);
    result.files_written_count = result.local_files_verified_count;
    if (!writeResult.success || result.local_files_verified_count === 0) {
      result.status = "failed_no_local_output_file";
      result.image_created = false;
      result.error_category = "output_persistence_anomaly";
      result.error = writeResult.error || writeResult.reason || "no verified local output file";
      return plugin.normalizeResult(result);
    }
    result.image_created = true;
  } else {
    result.local_files_written_count = 0;
    result.local_files_verified_count = 0;
    result.local_persistence_success = false;
    result.output_files = [];
    result.files_written_count = 0;
    result.status = "failed_no_local_output_file";
    result.image_created = false;
    result.error_category = "output_persistence_anomaly";
    result.error = "provider returned no writable image payload";
    return plugin.normalizeResult(result);
  }

  return plugin.normalizeResult(result);
}

module.exports = { run: run };
