const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

const js = fs.readFileSync(path.join(root, "plugins/image_generation/native_doubao_image/native_doubao_image.js"), "utf8");

check("doc_285_exists", () => fileExists("docs/285_v7_30_native_doubao_watermark_parameter_enforcement.md"));
check("schema_exists", () => fileExists("tests/schema_examples/v7_30_native_doubao_watermark_parameter_enforcement.example.yaml"));
check("watermark_false_in_build", () => js.includes("watermark: false"));
check("watermark_is_boolean", () => {
  var idx = js.indexOf("watermark: false");
  if (idx < 0) return false;
  return true;
});
check("buildDoubaoRequest_has_watermark", () => js.includes("function buildDoubaoRequest") && js.includes("watermark"));
check("code_has_watermark_requested", () => js.includes("watermark_requested"));
check("code_has_watermark_sent", () => js.includes("watermark_parameter_sent") || js.includes("watermark_parameter"));
check("code_has_disabled_policy", () => js.includes("disabled_by_request_payload"));
check("code_has_blocked_missing", () => js.includes("BLOCKED_WATERMARK_PARAMETER_MISSING"));
check("code_has_blocked_invalid", () => js.includes("BLOCKED_WATERMARK_PARAMETER_INVALID"));
check("validateWatermarkParameter", () => js.includes("function validateWatermarkParameter"));
check("validate_mvp_includes_v7_30", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_30_native_doubao_watermark_parameter_enforcement"));

const summary = { passed, phase: "v7.30 Native Doubao Watermark Parameter Enforcement", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
