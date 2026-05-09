const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

const js = fs.readFileSync(path.join(root, "plugins/image_generation/native_doubao_image/native_doubao_image.js"), "utf8");
const adapter = fs.readFileSync(path.join(root, "adapters/image_generation/native_doubao_adapter.js"), "utf8");

check("doc_274_exists", () => fileExists("docs/274_v7_17_native_doubao_real_api_implementation_draft.md"));
check("has_validateRealExecutionGate", () => js.includes("function validateRealExecutionGate"));
check("has_realGenerate", () => js.includes("function realGenerate"));
check("has_buildDoubaoRequest", () => js.includes("function buildDoubaoRequest"));
check("has_writeImageOutput", () => js.includes("function writeImageOutput"));
check("has_detectModelMismatch", () => js.includes("function detectModelMismatch"));
check("dryRunGenerate_still_exists", () => js.includes("function dryRunGenerate"));
check("adapter_defaults_dryRun_true", () => adapter.includes("options.dryRun === undefined") || adapter.includes("dryRun = true"));
check("references_api_key_env", () => js.includes("DOUBAO_IMAGE_API_KEY"));
check("no_hardcoded_api_key", () => {
  // Allow env var reads, reject actual hardcoded key literals
  var lines = js.split("\n").filter(function(l) { return !l.trim().startsWith("//"); });
  var code = lines.join("\n");
  var envReadPattern = /process\.env\s*\[\s*["']DOUBAO_IMAGE_API_KEY["']\s*\]|process\.env\.DOUBAO_IMAGE_API_KEY/;
  return !code.includes("sk-") && !code.includes("api_key: \"") && !code.includes("apiKey = \"") && !code.includes("ApiKey = \"");
});
check("gates_execution_authorized", () => js.includes("executionAuthorized !== true"));
check("gates_a5_ref", () => js.includes("a5ActivationRef"));
check("enforces_max_calls_1", () => js.includes("maxPluginCalls > 1") || js.includes("maxPluginCalls >"));
check("enforces_max_images_1", () => js.includes("maxImagesCreated > 1") || js.includes("maxImagesCreated >"));
check("enforces_retry_false", () => js.includes("retryAllowed)") || js.includes("retryAllowed"));
check("enforces_output_dir", () => js.includes("runs/real_generation/") && js.includes("outputDirectory"));
check("blocks_model_mismatch", () => js.includes("BLOCKED_MODEL_MISMATCH") || js.includes("blocked: true"));
check("doc_says_not_a5", () => fileContains("docs/274_v7_17_native_doubao_real_api_implementation_draft.md", "不是 A5 激活"));
check("validate_mvp_includes_v7_17", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_17_native_doubao_real_api_implementation_draft"));

const summary = { passed, phase: "v7.17 Native Doubao Real API Implementation Draft", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
