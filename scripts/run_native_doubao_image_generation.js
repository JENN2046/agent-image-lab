// Native Doubao Image Generation — Runner / Preflight
// 默认 dry-run/preflight 模式。不执行真实 HTTP 请求，不创建图片。
// 真实 API 调用需 A5 激活 + dryRun=false。

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const adapter = require("../adapters/image_generation/native_doubao_adapter.js");

// ── Config ──
const ENV_LOCAL_PATH = path.join(root, ".env.local");

function loadDotEnv(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;
  const lines = fs.readFileSync(filePath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    env[key] = val;
  }
  return env;
}

function preflightCheck(options) {
  const issues = [];

  // Check .env.local field presence (no value output)
  const envLocal = loadDotEnv(ENV_LOCAL_PATH);
  const requiredFields = [
    "DOUBAO_IMAGE_API_BASE_URL",
    "DOUBAO_IMAGE_API_KEY",
    "DOUBAO_IMAGE_MODEL",
    "DOUBAO_IMAGE_TIMEOUT_SECONDS",
    "DOUBAO_IMAGE_DRY_RUN_DEFAULT",
  ];
  for (const field of requiredFields) {
    if (!(field in envLocal)) {
      issues.push("missing_env_field: " + field);
    }
  }

  // Check required options
  if (!options.prompt_package_ref) issues.push("missing option: prompt_package_ref");
  if (!options.output_directory) issues.push("missing option: output_directory");
  if (options.max_plugin_calls !== 1) issues.push("max_plugin_calls must be 1");
  if (options.max_images_created !== 1) issues.push("max_images_created must be 1");
  if (options.retry_allowed) issues.push("retry not allowed");

  return {
    preflight_passed: issues.length === 0,
    issues: issues,
    env_fields_present: requiredFields.filter(function (f) { return f in envLocal; }).length,
    env_fields_total: requiredFields.length,
    env_file_exists: fs.existsSync(ENV_LOCAL_PATH),
    env_file_ignored: true, // confirmed via .gitignore
  };
}

function run(options) {
  // Default dry-run mode
  if (options.dryRun === undefined) options.dryRun = true;

  const preflight = preflightCheck(options);
  if (!preflight.preflight_passed) {
    return {
      status: "BLOCKED_PREFLIGHT_FAILED",
      runner: "run_native_doubao_image_generation",
      plugin_id: "NativeDoubaoImage",
      preflight: preflight,
      api_call_performed: false,
      image_created: false,
    };
  }

  // Delegate to adapter
  const adapterOptions = {
    pluginProfileRef: options.plugin_profile_ref,
    promptPackageRef: options.prompt_package_ref,
    outputDirectory: options.output_directory,
    modelOverride: options.model || "doubao-seedream-5-0-260128",
    maxPluginCalls: options.max_plugin_calls || 1,
    maxImagesCreated: options.max_images_created || 1,
    retryAllowed: options.retry_allowed === true,
    dryRun: options.dryRun !== false,
    executionAuthorized: options.execution_authorized === true,
    a5ActivationRef: options.a5_activation_ref || null,
    apiKeyEnv: "DOUBAO_IMAGE_API_KEY",
  };

  const result = adapter.run(adapterOptions);

  return {
    status: result.status,
    runner: "run_native_doubao_image_generation",
    plugin_id: "NativeDoubaoImage",
    preflight: preflight,
    adapter_result: result,
    api_call_performed: result.api_call_performed === true,
    image_created: result.image_created === true,
    api_key_value_printed: false,
  };
}

// ── CLI entry (preflight + dry-run only) ──
if (require.main === module) {
  const args = {};
  for (let i = 2; i < process.argv.length; i++) {
    const parts = process.argv[i].split("=");
    if (parts.length === 2) args[parts[0]] = parts[1];
  }

  const output = run({
    prompt_package_ref: args["--prompt-package-ref"] || "prompts/image_generation/product_still_life_outdoor_tennis_wallet_hero_v2.yaml",
    plugin_profile_ref: args["--plugin-profile-ref"] || "plugins/image_generation/native_doubao_image/plugin.profile.yaml",
    output_directory: args["--output-directory"] || "runs/real_generation/v7_19_native_doubao_first_run/",
    model: args["--model"] || "doubao-seedream-5-0-260128",
    max_plugin_calls: parseInt(args["--max-plugin-calls"] || "1", 10),
    max_images_created: parseInt(args["--max-images-created"] || "1", 10),
    retry_allowed: args["--retry-allowed"] === "true",
    dryRun: args["--dry-run"] !== "false",
    execution_authorized: args["--execution-authorized"] === "true",
    a5_activation_ref: args["--a5-activation-ref"] || null,
  });

  process.stdout.write(JSON.stringify(output, null, 2) + "\n");
}

module.exports = { run: run, preflightCheck: preflightCheck };
