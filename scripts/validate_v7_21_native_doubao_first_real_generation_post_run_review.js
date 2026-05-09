const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

const schemaPath = "tests/schema_examples/v7_21_native_doubao_first_real_generation_post_run_review.example.yaml";
const schema = fs.readFileSync(path.join(root, schemaPath), "utf8");

check("doc_278_exists", () => fileExists("docs/278_v7_21_native_doubao_first_real_generation_post_run_review.md"));
check("schema_example_exists", () => fileExists(schemaPath));
check("schema_status_completed", () => schema.includes("status: completed_generated"));
check("schema_asset_needs_review", () => schema.includes("asset_status: needs_human_review"));
check("schema_model_matches", () => schema.includes("model_matches: true"));
check("schema_api_calls_1", () => schema.includes("api_calls_observed: 1"));
check("schema_images_1", () => schema.includes("images_created: 1"));
check("schema_retry_false", () => schema.includes("retry_performed: false"));
check("schema_output_path", () => schema.includes("output_path:"));
check("schema_deviation_watermark", () => schema.includes("watermark_or_generation_mark_risk"));
check("schema_deviation_balls", () => schema.includes("foreground_tennis_balls_too_large"));
check("schema_deviation_background", () => schema.includes("background_material_direction_drift"));
check("schema_new_a5_true", () => schema.includes("new_a5_required: true"));
check("schema_memory_false", () => schema.includes("memory_write_allowed: false"));
check("schema_dailynote_false", () => schema.includes("daily_note_write_allowed: false"));
check("validate_mvp_includes_v7_21", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_21_native_doubao_first_real_generation_post_run_review"));

const summary = { passed, phase: "v7.21 Native Doubao First Gen Post-Run Review", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
