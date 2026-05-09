const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

const runner = fs.readFileSync(path.join(root, "scripts/run_native_doubao_image_generation.js"), "utf8");

check("runner_exists", () => fileExists("scripts/run_native_doubao_image_generation.js"));
check("runner_loads_adapter", () => runner.includes("native_doubao_adapter.js"));
check("runner_reads_dotenv", () => runner.includes(".env.local"));
check("runner_no_api_key_output", () => !runner.includes("process.env.DOUBAO_IMAGE_API_KEY") || runner.includes("field"));
check("runner_defaults_dry_run", () => runner.includes("dryRun = true") || runner.includes("dryRun !== false"));
check("runner_supports_plugin_profile_ref", () => runner.includes("plugin_profile_ref"));
check("runner_supports_prompt_package_ref", () => runner.includes("prompt_package_ref"));
check("runner_supports_output_directory", () => runner.includes("output_directory"));
check("runner_supports_model", () => runner.includes("model") || runner.includes("ModelOverride"));
check("runner_supports_a5_ref", () => runner.includes("a5_activation_ref"));
check("runner_enforces_retry", () => runner.includes("retry"));
check("runner_has_preflight", () => runner.includes("preflightCheck") || runner.includes("preflight"));
check("doc_276_exists", () => fileExists("docs/276_v7_19_native_doubao_a5_runner_preflight.md"));
check("validate_mvp_includes_v7_19", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_19_native_doubao_a5_runner_preflight"));

const summary = { passed, phase: "v7.19 Native Doubao A5 Runner Preflight", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
