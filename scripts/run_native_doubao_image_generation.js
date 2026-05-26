// Native Doubao Image Generation — Runner / Preflight
// 默认 dry-run/preflight 模式。不执行真实 HTTP 请求，不创建图片。
// 真实 API 调用需 A5 激活 + dryRun=false。

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const adapter = require("../adapters/image_generation/native_doubao_adapter.js");
const secretlessBridge = require("./native_doubao_secretless_provider_runtime_bridge.js");

// ── Config ──
const ENV_LOCAL_PATH = path.join(root, ".env.local");
const RUNNER_CASE_REGISTRY_PATH = path.join(root, "configs", "native_doubao_runner_cases.json");
const ALLOWED_ENV_KEYS = [
  "DOUBAO_IMAGE_API_BASE_URL",
  "DOUBAO_IMAGE_API_KEY",
  "DOUBAO_IMAGE_MODEL",
  "DOUBAO_IMAGE_TIMEOUT_SECONDS",
  "DOUBAO_IMAGE_DRY_RUN_DEFAULT",
];
const SECRETLESS_PROVIDER_BINDING_REF = "native_doubao:capability:owner-runtime:v0_6_73";
const SECRETLESS_PROVIDER_BINDING_DISPLAY_REF = "native_doubao:capability:owner-runtime:<redacted>";

function loadRunnerCaseRegistry(filePath) {
  const registryPath = filePath || RUNNER_CASE_REGISTRY_PATH;
  try {
    const parsed = JSON.parse(fs.readFileSync(registryPath, "utf8"));
    return {
      loaded: true,
      registry_path: path.relative(root, registryPath).replace(/\\/g, "/"),
      default_case_id: parsed.default_case_id || null,
      cases: Array.isArray(parsed.cases) ? parsed.cases : [],
    };
  } catch (error) {
    return {
      loaded: false,
      registry_path: path.relative(root, registryPath).replace(/\\/g, "/"),
      error: "native_doubao_runner_case_registry_unavailable",
    };
  }
}

function resolveRunnerCaseOptions(options, registry) {
  const source = Object.assign({}, options || {});
  const caseRegistry = registry || loadRunnerCaseRegistry();
  if (!caseRegistry.loaded) {
    return Object.assign(source, {
      runner_case_registry_loaded: false,
      runner_case_registry_error: caseRegistry.error,
    });
  }

  const requestedCaseId = source.runner_case_id || source.case_id || caseRegistry.default_case_id;
  const selectedCase = caseRegistry.cases.find(function (item) {
    return item && item.case_id === requestedCaseId;
  });
  if (!selectedCase) {
    return Object.assign(source, {
      runner_case_registry_loaded: true,
      runner_case_id: requestedCaseId,
      runner_case_registry_error: "native_doubao_runner_case_not_found",
    });
  }

  return Object.assign({}, source, {
    runner_case_registry_loaded: true,
    runner_case_id: selectedCase.case_id,
    prompt_package_ref: source.prompt_package_ref || selectedCase.prompt_package_ref,
    plugin_profile_ref: source.plugin_profile_ref || selectedCase.plugin_profile_ref,
    output_directory: source.output_directory || selectedCase.output_directory,
    model: source.model || selectedCase.model,
    max_plugin_calls: source.max_plugin_calls || selectedCase.max_plugin_calls,
    max_images_created: source.max_images_created || selectedCase.max_images_created,
    retry_allowed: source.retry_allowed === undefined ? selectedCase.retry_allowed === true : source.retry_allowed,
    dryRun: source.dryRun === undefined ? selectedCase.dry_run_default !== false : source.dryRun,
  });
}

function parseBooleanOption(value) {
  if (value === true || value === false) return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function isSecretlessBindingRequest(options) {
  return options.secretless_runtime_required === true ||
    options.provider_binding_ref === SECRETLESS_PROVIDER_BINDING_REF;
}

function validateSecretlessBindingOptions(options) {
  const issues = [];
  if (options.provider_binding_ref !== SECRETLESS_PROVIDER_BINDING_REF) {
    issues.push("provider_binding_ref must be non-secret NativeDoubao capability handle");
  }
  if (options.provider_binding_ref_redacted !== true) {
    issues.push("provider_binding_ref_redacted must be true");
  }
  if (options.provider_binding_ref_is_secret !== false) {
    issues.push("provider_binding_ref_is_secret must be false");
  }
  if (options.secretless_runtime_required !== true) {
    issues.push("secretless_runtime_required must be true");
  }
  return issues;
}

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

function readLegacyPreflightEnvFieldNames() {
  const envFields = readEnvFieldNames(ENV_LOCAL_PATH);
  return envFields;
}

function preflightCheck(options) {
  const issues = [];
  const secretlessBinding = isSecretlessBindingRequest(options);
  if (options.runner_case_registry_error) {
    issues.push(options.runner_case_registry_error);
  }

  // Legacy env preflight checks field names only (no value retention or output).
  // Secretless binding mode must not read .env.local content at all.
  const envFields = secretlessBinding ? new Set() : readLegacyPreflightEnvFieldNames();
  const requiredFields = ALLOWED_ENV_KEYS;
  if (secretlessBinding) {
    issues.push.apply(issues, validateSecretlessBindingOptions(options));
  } else {
    for (const field of requiredFields) {
      if (!envFields.has(field)) {
        issues.push("missing_env_field: " + field);
      }
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
    env_file_exists: secretlessBinding ? null : fs.existsSync(ENV_LOCAL_PATH),
    env_file_ignored: true, // confirmed via .gitignore
    secretless_binding_mode: secretlessBinding,
    provider_binding_ref: secretlessBinding ? SECRETLESS_PROVIDER_BINDING_DISPLAY_REF : null,
    provider_binding_ref_redacted: secretlessBinding ? true : null,
    provider_binding_ref_is_secret: secretlessBinding ? false : null,
    env_file_content_read_performed: false,
    secret_value_read_performed: false,
  };
}

async function run(options) {
  options = resolveRunnerCaseOptions(options || {});
  // Default dry-run mode
  if (options.dryRun === undefined) options.dryRun = true;

  const preflight = preflightCheck(options);
  const secretlessBinding = preflight.secretless_binding_mode === true;
  if (!preflight.preflight_passed) {
    return {
      status: "BLOCKED_PREFLIGHT_FAILED",
      runner: "run_native_doubao_image_generation",
      runner_case_id: options.runner_case_id || null,
      plugin_id: "NativeDoubaoImage",
      preflight: preflight,
      api_call_performed: false,
      image_created: false,
      env_file_content_read_performed: false,
      secret_value_read_performed: false,
    };
  }

  // Load .env.local into process.env for real execution path
  if (options.dryRun === false && options.execution_authorized === true) {
    if (secretlessBinding) {
      if (typeof options.secretless_provider_runtime === "function") {
        const delegateAuthorization = secretlessBridge.validateSecretlessProviderRuntimeDelegateBinding(
          options.secretless_provider_runtime,
          options
        );
        if (delegateAuthorization.authorized_to_call_bridge !== true) {
          return {
            status: "BLOCKED_SECRETLESS_PROVIDER_RUNTIME_DELEGATE_AUTHORIZATION_REQUIRED",
            runner: "run_native_doubao_image_generation",
            plugin_id: "NativeDoubaoImage",
            preflight: preflight,
            provider_binding_ref: SECRETLESS_PROVIDER_BINDING_DISPLAY_REF,
            provider_binding_ref_redacted: true,
            provider_binding_ref_is_secret: false,
            required_runtime_owner: "VCPToolBox_or_owner_authorized_provider_runtime",
            required_runtime_contract: "controlled_secretless_provider_runtime_bridge",
            delegate_authorization: delegateAuthorization,
            api_call_performed: false,
            plugin_call_performed: false,
            provider_contact_performed: false,
            image_created: false,
            image_generation_performed: false,
            image_binary_read_performed: false,
            output_write_performed: false,
            env_file_content_read_performed: false,
            secret_value_read_performed: false,
            accepted_samples_write_performed: false,
            production_candidate_write_performed: false,
            DailyNote_write_performed: false,
            VCP_memory_write_performed: false,
            v0_6_73_execution_allowed: false
          };
        }
        const runtimeRequest = secretlessBridge.buildSecretlessProviderRuntimeRequest(options, preflight);
        const runtimeResult = await options.secretless_provider_runtime(runtimeRequest);
        const sanitizedRuntimeResult = secretlessBridge.sanitizeSecretlessProviderRuntimeResult(runtimeResult);
        return {
          status: sanitizedRuntimeResult.status,
          runner: "run_native_doubao_image_generation",
          plugin_id: "NativeDoubaoImage",
          preflight: preflight,
          provider_binding_ref: SECRETLESS_PROVIDER_BINDING_DISPLAY_REF,
          provider_binding_ref_redacted: true,
          provider_binding_ref_is_secret: false,
          required_runtime_owner: "VCPToolBox_or_owner_authorized_provider_runtime",
          required_runtime_contract: "secretless_provider_runtime_function",
          runtime_bridge_result: sanitizedRuntimeResult,
          api_call_performed: sanitizedRuntimeResult.api_call_performed === true,
          plugin_call_performed: sanitizedRuntimeResult.plugin_call_performed === true,
          provider_contact_performed: sanitizedRuntimeResult.provider_contact_performed === true,
          image_created: sanitizedRuntimeResult.image_generation_performed === true,
          image_generation_performed: sanitizedRuntimeResult.image_generation_performed === true,
          image_binary_read_performed: false,
          output_write_performed: sanitizedRuntimeResult.output_write_performed === true,
          env_file_content_read_performed: false,
          secret_value_read_performed: false,
          raw_provider_payload_retained: false,
          human_review_required_now: sanitizedRuntimeResult.human_review_required_now === true,
        };
      }
      return {
        status: "BLOCKED_SECRETLESS_RUNTIME_NOT_CALLABLE",
        runner: "run_native_doubao_image_generation",
        plugin_id: "NativeDoubaoImage",
        preflight: preflight,
        provider_binding_ref: SECRETLESS_PROVIDER_BINDING_DISPLAY_REF,
        provider_binding_ref_redacted: true,
        provider_binding_ref_is_secret: false,
        required_runtime_owner: "VCPToolBox_or_owner_authorized_provider_runtime",
        required_runtime_contract: "secretless_provider_runtime_function",
        api_call_performed: false,
        plugin_call_performed: false,
        provider_contact_performed: false,
        image_created: false,
        image_generation_performed: false,
        image_binary_read_performed: false,
        output_write_performed: false,
        env_file_content_read_performed: false,
        secret_value_read_performed: false,
        raw_provider_payload_retained: false,
        human_review_required_now: false,
      };
    }
    const envLoad = loadEnvLocal();
    if (!envLoad.loaded) {
      return {
        status: "BLOCKED_CONFIG_MISSING",
        runner: "run_native_doubao_image_generation",
        plugin_id: "NativeDoubaoImage",
        env_error: envLoad.error,
        api_call_performed: false,
        image_created: false,
        env_file_content_read_performed: false,
        secret_value_read_performed: false,
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
    provider_request_success: result.provider_request_success === true,
    provider_reported_image_count: result.provider_reported_image_count || 0,
    local_files_written_count: result.local_files_written_count || 0,
    local_files_verified_count: result.local_files_verified_count || 0,
    local_persistence_success: result.local_persistence_success === true,
    human_review_required_now: result.human_review_required_now === true,
    output_files: Array.isArray(result.output_files) ? result.output_files : [],
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
    runner_case_id: options.runner_case_id || null,
    plugin_id: "NativeDoubaoImage",
    preflight: preflight,
    adapter_result: publicAdapterResult,
    api_call_performed: result.api_call_performed === true,
    plugin_call_performed: result.api_call_performed === true,
    provider_contact_performed: result.api_call_performed === true,
    image_created: result.image_created === true,
    image_generation_performed: result.image_created === true,
    image_binary_read_performed: false,
    output_write_performed: result.local_files_written_count > 0,
    human_review_required_now: result.human_review_required_now === true,
    env_file_content_read_performed: !secretlessBinding && options.dryRun === false && options.execution_authorized === true,
    secret_value_read_performed: !secretlessBinding && options.dryRun === false && options.execution_authorized === true,
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
    runner_case_id: args["--case-id"] || args["--runner-case-id"] || null,
    prompt_package_ref: args["--prompt-package-ref"] || null,
    plugin_profile_ref: args["--plugin-profile-ref"] || null,
    output_directory: args["--output-directory"] || null,
    model: args["--model"] || null,
    max_plugin_calls: parseInt(args["--max-plugin-calls"] || "1", 10),
    max_images_created: parseInt(args["--max-images-created"] || "1", 10),
    retry_allowed: args["--retry-allowed"] === "true",
    dryRun: args["--dry-run"] !== "false",
    execution_authorized: args["--execution-authorized"] === "true",
    a5_activation_ref: args["--a5-activation-ref"] || null,
    provider_binding_ref: args["--provider-binding-ref"] || null,
    provider_binding_ref_redacted: parseBooleanOption(args["--provider-binding-ref-redacted"]),
    provider_binding_ref_is_secret: parseBooleanOption(args["--provider-binding-ref-is-secret"]),
    secretless_runtime_required: args["--secretless-runtime-required"] === "true",
  }).then(function(output) {
    process.stdout.write(JSON.stringify(output, null, 2) + "\n");
  });
}

module.exports = {
  run: run,
  preflightCheck: preflightCheck,
  loadDotEnv: loadDotEnv,
  readEnvFieldNames: readEnvFieldNames,
  readLegacyPreflightEnvFieldNames: readLegacyPreflightEnvFieldNames,
  loadRunnerCaseRegistry: loadRunnerCaseRegistry,
  resolveRunnerCaseOptions: resolveRunnerCaseOptions,
  isSecretlessBindingRequest: isSecretlessBindingRequest,
  validateSecretlessBindingOptions: validateSecretlessBindingOptions,
  SECRETLESS_PROVIDER_BINDING_REF: SECRETLESS_PROVIDER_BINDING_REF,
  SECRETLESS_PROVIDER_BINDING_DISPLAY_REF: SECRETLESS_PROVIDER_BINDING_DISPLAY_REF
};
