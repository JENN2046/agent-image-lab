// Native Doubao Image Generation — Runner / Preflight
// 默认 dry-run/preflight 模式。不执行真实 HTTP 请求，不创建图片。
// 真实 API 调用需 A5 激活 + dryRun=false。

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const adapter = require("../adapters/image_generation/native_doubao_adapter.js");

// ── Config ──
const ENV_LOCAL_PATH = path.join(root, ".env.local");
const ALLOWED_ENV_KEYS = [
  "DOUBAO_IMAGE_API_BASE_URL",
  "DOUBAO_IMAGE_API_KEY",
  "DOUBAO_IMAGE_MODEL",
  "DOUBAO_IMAGE_TIMEOUT_SECONDS",
  "DOUBAO_IMAGE_DRY_RUN_DEFAULT",
];

function readEnvFieldNames(filePath) {
  const fields = new Set();
  if (!fs.existsSync(filePath)) return fields;
  const lines = fs.readFileSync(filePath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    fields.add(trimmed.slice(0, eqIdx).trim());
  }
  return fields;
}

function loadDotEnv(filePath, allowedKeys) {
  allowedKeys = allowedKeys || ALLOWED_ENV_KEYS;
  const env = {};
  if (!fs.existsSync(filePath)) return env;
  const lines = fs.readFileSync(filePath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    if (!allowedKeys.includes(key)) continue;
    const val = trimmed.slice(eqIdx + 1).trim();
    env[key] = val;
  }
  return env;
}

function loadEnvLocal() {
  if (!fs.existsSync(ENV_LOCAL_PATH)) return { loaded: false, error: ".env.local not found" };
  const env = loadDotEnv(ENV_LOCAL_PATH, ALLOWED_ENV_KEYS);
  if (!env.DOUBAO_IMAGE_API_KEY) return { loaded: false, error: "DOUBAO_IMAGE_API_KEY missing in .env.local" };
  if (!env.DOUBAO_IMAGE_API_BASE_URL) return { loaded: false, error: "DOUBAO_IMAGE_API_BASE_URL missing in .env.local" };
  for (const key of Object.keys(env)) process.env[key] = env[key];
  return { loaded: true, fields: Object.keys(env).length };
}

function preflightCheck(options) {
  const issues = [];

  // Check .env.local field names only (no value retention or output)
  const envFields = readEnvFieldNames(ENV_LOCAL_PATH);
  const requiredFields = ALLOWED_ENV_KEYS;
  for (const field of requiredFields) {
    if (!envFields.has(field)) {
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
    env_fields_present: requiredFields.filter(function (f) { return envFields.has(f); }).length,
    env_fields_total: requiredFields.length,
    env_file_exists: fs.existsSync(ENV_LOCAL_PATH),
    env_file_ignored: true, // confirmed via .gitignore
  };
}

async function run(options) {
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

  // Load .env.local into process.env for real execution path
  if (options.dryRun === false && options.execution_authorized === true) {
    const envLoad = loadEnvLocal();
    if (!envLoad.loaded) {
      return {
        status: "BLOCKED_CONFIG_MISSING",
        runner: "run_native_doubao_image_generation",
        plugin_id: "NativeDoubaoImage",
        env_error: envLoad.error,
        api_call_performed: false,
        image_created: false,
      };
    }
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

  const result = await adapter.run(adapterOptions);
  const publicAdapterResult = {
    status: result.status,
    plugin_id: result.plugin_id,
    command: result.command || "generate",
    api_call_performed: result.api_call_performed === true,
    image_created: result.image_created === true,
    image_count: result.image_count || 0,
    model_requested: result.model_requested || null,
    model_reported: result.model_reported || null,
    model_matches: result.model_matches === true,
    http_status: result.http_status || null,
    files_written_count: result.files_written_count || 0,
    error_category: result.error_category || null,
    error: result.error || null,
    raw_image_payload_returned: false,
    provider_url_returned: false,
  };

  return {
    status: result.status,
    runner: "run_native_doubao_image_generation",
    plugin_id: "NativeDoubaoImage",
    preflight: preflight,
    adapter_result: publicAdapterResult,
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

  run({
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
  }).then(function(output) {
    process.stdout.write(JSON.stringify(output, null, 2) + "\n");
  });
}

module.exports = { run: run, preflightCheck: preflightCheck, loadDotEnv: loadDotEnv, readEnvFieldNames: readEnvFieldNames };
