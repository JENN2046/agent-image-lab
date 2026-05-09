const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

const examplePath = "tests/schema_examples/v7_27_watermark_provenance_diagnostic.example.yaml";
const example = fs.readFileSync(path.join(root, examplePath), "utf8");

check("doc_283_exists", () => fileExists("docs/283_v7_27_watermark_provenance_diagnostic.md"));
check("schema_exists", () => fileExists(examplePath));
check("status_diagnostic", () => example.includes("status: diagnostic_only"));
check("execution_not_authorized", () => example.includes("execution_authorized_by_this_record: false"));
check("source_v7_26", () => example.includes("phase: v7_26"));
check("model_matches", () => example.includes("model_matches: true"));
check("api_calls_1", () => example.includes("api_calls_observed: 1"));
check("images_1", () => example.includes("images_created: 1"));
check("retry_false", () => example.includes("retry_performed: false"));
check("output_path", () => example.includes("output_path:"));
check("asset_needs_review", () => example.includes("asset_status: needs_human_review"));
check("watermark_fail", () => example.includes("no_watermark_or_generated_mark: fail"));
check("deviation_watermark", () => example.includes("watermark_or_generated_mark_present"));
check("deviation_leaf", () => example.includes("product_partially_obstructed_by_leaf"));
check("deviation_text", () => example.includes("readable_page_texture_risk"));
check("provenance_prompt", () => example.includes("prompt_watermark_failure"));
check("provenance_provider", () => example.includes("provider_watermark_failure"));
check("provenance_unknown", () => example.includes("unknown_watermark_source"));
check("new_a5_true", () => example.includes("new_a5_required: true"));
check("memory_false", () => example.includes("memory_write_allowed: false"));
check("dailynote_false", () => example.includes("daily_note_write_allowed: false"));
check("doc_says_no_gen", () => fileContains("docs/283_v7_27_watermark_provenance_diagnostic.md", "不授权再次生成"));
check("validate_mvp_includes_v7_27", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_27_watermark_provenance_diagnostic"));

const summary = { passed, phase: "v7.27 Watermark Provenance Diagnostic", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
