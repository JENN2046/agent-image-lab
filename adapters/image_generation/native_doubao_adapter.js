// Native Doubao Image Adapter — 统一 adapter 包装层
// 当前版本：dry-run contract only。真实 API 调用需后续 A5 授权。

var plugin = require("../../plugins/image_generation/native_doubao_image/native_doubao_image.js");

function run(options) {
  var limits = plugin.validateA5Limits(options);
  if (!limits.valid) {
    return {
      status: "BLOCKED",
      plugin_id: "NativeDoubaoImage",
      errors: limits.errors,
    };
  }

  if (options.dryRun !== false) {
    return plugin.dryRunGenerate(options);
  }

  // TODO: 真实 API 调用 — 需 A5 授权且实现 realGenerate
  return {
    status: "BLOCKED",
    plugin_id: "NativeDoubaoImage",
    reason: "real_api_call_not_implemented_without_a5",
  };
}

module.exports = { run: run };
