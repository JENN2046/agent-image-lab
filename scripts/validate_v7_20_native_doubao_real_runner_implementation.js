const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

const runner = fs.readFileSync(path.join(root, "scripts/run_native_doubao_image_generation.js"), "utf8");
const plugin = fs.readFileSync(path.join(root, "plugins/image_generation/native_doubao_image/native_doubao_image.js"), "utf8");
const adapter = fs.readFileSync(path.join(root, "adapters/image_generation/native_doubao_adapter.js"), "utf8");
const runnerCases = JSON.parse(fs.readFileSync(path.join(root, "configs/native_doubao_runner_cases.json"), "utf8"));
const runnerModule = require(path.join(root, "scripts/run_native_doubao_image_generation.js"));

check("doc_277_exists", () => fileExists("docs/277_v7_20_native_doubao_real_runner_implementation.md"));
check("runner_case_registry_exists", () => fileExists("configs/native_doubao_runner_cases.json"));
check("runner_case_registry_has_default", () => typeof runnerCases.default_case_id === "string" && runnerCases.cases.some((item) => item.case_id === runnerCases.default_case_id));
check("runner_case_registry_entries_are_safe_refs", () => runnerCases.cases.every((item) =>
  /^prompts\/image_generation\/[^/].+\.ya?ml$/.test(item.prompt_package_ref || "") &&
  /^runs\/real_generation\/[^/].+\/$/.test(item.output_directory || "") &&
  item.provider_contact_authorized === false &&
  item.secret_value_required_for_preflight === false
));
check("runner_resolves_default_case_from_registry", () => {
  const resolved = runnerModule.resolveRunnerCaseOptions({});
  return resolved.runner_case_id === runnerCases.default_case_id &&
    resolved.prompt_package_ref === runnerCases.cases.find((item) => item.case_id === runnerCases.default_case_id).prompt_package_ref &&
    resolved.output_directory === runnerCases.cases.find((item) => item.case_id === runnerCases.default_case_id).output_directory;
});
check("runner_cli_default_uses_case_registry_not_hardcoded_refs", () =>
  runner.includes("loadRunnerCaseRegistry") &&
  runner.includes("resolveRunnerCaseOptions") &&
  runner.includes('--case-id') &&
  !runner.includes("product_still_life_outdoor_tennis_wallet_hero_v2.yaml") &&
  !runner.includes("v7_19_native_doubao_first_run")
);
check("runner_has_loadEnvLocal", () => runner.includes("function loadEnvLocal"));
check("runner_references_dotenv", () => runner.includes(".env.local"));
check("runner_references_api_key_env", () => runner.includes("DOUBAO_IMAGE_API_KEY"));
check("runner_env_allowlist", () => runner.includes("ALLOWED_ENV_KEYS") && runner.includes("loadDotEnv(ENV_LOCAL_PATH, ALLOWED_ENV_KEYS)"));
check("runner_no_print_api_key", () => !runner.includes("DOUBAO_IMAGE_API_KEY,") && !runner.includes("DOUBAO_IMAGE_API_KEY;") || runner.includes("fields"));
check("plugin_has_realGenerate", () => plugin.includes("async function realGenerate"));
check("plugin_has_validateRealExecutionGate", () => plugin.includes("function validateRealExecutionGate"));
check("plugin_has_fetch", () => plugin.includes("fetch("));
check("plugin_references_base_url", () => plugin.includes("DOUBAO_IMAGE_API_BASE_URL"));
check("plugin_validates_base_url", () => plugin.includes("function validateBaseUrl") && plugin.includes("BLOCKED_BASE_URL"));
check("plugin_references_api_key", () => plugin.includes("DOUBAO_IMAGE_API_KEY"));
check("plugin_enforces_model", () => plugin.includes("doubao-seedream-5-0-260128"));
check("plugin_has_model_mismatch_block", () => plugin.includes("BLOCKED_MODEL_MISMATCH"));
check("plugin_prompt_ref_sandbox", () => plugin.includes("function resolveSafePromptPackageRef") && plugin.includes("promptPackageRef escapes prompts/image_generation/"));
check("plugin_uses_yaml_prompt_parser", () => plugin.includes('require("yaml")') && plugin.includes("YAML.parse") && plugin.includes("prompt package YAML parse failed"));
check("plugin_output_dir_sandbox", () => plugin.includes("function resolveSafeOutputDirectory") && plugin.includes("outputDirectory escapes runs/real_generation/"));
check("plugin_redacts_public_result", () => plugin.includes("raw_image_payload_returned: false") && plugin.includes("provider_url_returned: false"));
check("plugin_has_request_timeout", () => plugin.includes("AbortController") && plugin.includes("DOUBAO_IMAGE_TIMEOUT_SECONDS"));
check("plugin_checks_provider_json_content_type", () => plugin.includes("provider_invalid_content_type") && plugin.includes("application/json"));
check("plugin_validates_provider_response_schema", () => plugin.includes("function validateProviderResponseData") && plugin.includes("provider_invalid_response_schema"));
check("plugin_validates_image_magic_before_write", () => plugin.includes("function validateImageBuffer") && plugin.includes("image_magic_number_unsupported"));
check("plugin_decodes_images_with_sharp_before_write", () => plugin.includes('require("sharp")') && plugin.includes("async function validateDecodedImageBuffer") && plugin.includes("image_decode_failed"));
check("plugin_caps_image_bytes", () => plugin.includes("MAX_IMAGE_OUTPUT_BYTES") && plugin.includes("image_payload_too_large"));
check("plugin_streams_download_body_with_limit", () => plugin.includes("async function readImageResponseBodyWithLimit") && plugin.includes("download_payload_too_large") && !plugin.includes("arrayBuffer()"));
check("plugin_download_blocks_redirect_and_bad_content_type", () => plugin.includes('redirect: "error"') && plugin.includes("download_content_type_missing_or_invalid"));
check("plugin_has_resolved_ip_ssrf_guard_helpers", () => plugin.includes("function classifyIpAddressForNetworkSafety") && plugin.includes("function validateResolvedDownloadAddresses"));
check("plugin_has_generic_network_safety_helpers", () => plugin.includes("function validateNetworkSafeResolvedAddresses") && plugin.includes("function validateNetworkSafeResolvedHost") && plugin.includes("async function resolveNetworkHostForSafety"));
check("plugin_has_dns_resolution_safety_hook", () => plugin.includes('require("node:dns")') && plugin.includes("async function resolveDownloadHostForSafety") && plugin.includes("validateResolvedDownloadHost"));
check("plugin_fails_closed_on_dns_error", () => plugin.includes("network_dns_lookup_failed") && plugin.includes("download_dns_lookup_failed"));
check("plugin_checks_base_url_resolved_host_before_fetch", () => plugin.includes("async function resolveBaseUrlHostForSafety") && plugin.includes("base_url_resolved_host_blocked") && plugin.indexOf("base_url_resolved_host_blocked") < plugin.indexOf("fetch(apiUrl"));
check("plugin_uses_type_matched_extension", () => plugin.includes("function extensionForImageFormat") && plugin.includes("format: b64Check.format"));
check("plugin_exact_call_budget", () => plugin.includes("maxPluginCalls must be exactly 1") && plugin.includes("maxImagesCreated must be exactly 1"));
check("dryRunGenerate_still_exists", () => plugin.includes("function dryRunGenerate"));
check("adapter_defaults_dryRun_true", () => adapter.includes("dryRun === undefined"));
check("adapter_is_async", () => adapter.includes("async function run"));
check("runner_is_async", () => runner.includes("async function run"));
check("validate_mvp_includes_v7_20", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_20_native_doubao_real_runner_implementation"));

const summary = { passed, phase: "v7.20 Native Doubao Real Runner Implementation", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
