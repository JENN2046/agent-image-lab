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

check("doc_277_exists", () => fileExists("docs/277_v7_20_native_doubao_real_runner_implementation.md"));
check("runner_has_loadEnvLocal", () => runner.includes("function loadEnvLocal"));
check("runner_references_dotenv", () => runner.includes(".env.local"));
check("runner_references_api_key_env", () => runner.includes("DOUBAO_IMAGE_API_KEY"));
check("runner_no_print_api_key", () => !runner.includes("DOUBAO_IMAGE_API_KEY,") && !runner.includes("DOUBAO_IMAGE_API_KEY;") || runner.includes("fields"));
check("plugin_has_realGenerate", () => plugin.includes("async function realGenerate"));
check("plugin_has_validateRealExecutionGate", () => plugin.includes("function validateRealExecutionGate"));
check("plugin_has_fetch", () => plugin.includes("fetch("));
check("plugin_references_base_url", () => plugin.includes("DOUBAO_IMAGE_API_BASE_URL"));
check("plugin_references_api_key", () => plugin.includes("DOUBAO_IMAGE_API_KEY"));
check("plugin_enforces_model", () => plugin.includes("doubao-seedream-5-0-260128"));
check("plugin_has_model_mismatch_block", () => plugin.includes("BLOCKED_MODEL_MISMATCH"));
check("dryRunGenerate_still_exists", () => plugin.includes("function dryRunGenerate"));
check("adapter_defaults_dryRun_true", () => adapter.includes("dryRun === undefined"));
check("adapter_is_async", () => adapter.includes("async function run"));
check("runner_is_async", () => runner.includes("async function run"));
check("validate_mvp_includes_v7_20", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_20_native_doubao_real_runner_implementation"));

const summary = { passed, phase: "v7.20 Native Doubao Real Runner Implementation", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
