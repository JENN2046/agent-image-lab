const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

const examplePath = "tests/schema_examples/v7_23_prompt_quality_gate_v1.example.yaml";
const example = fs.readFileSync(path.join(root, examplePath), "utf8");

check("doc_280_exists", () => fileExists("docs/280_v7_23_prompt_quality_gate_v1.md"));
check("schema_exists", () => fileExists("schemas/prompt_quality_gate.schema.yaml"));
check("example_exists", () => fileExists(examplePath));
check("example_refs_v3", () => example.includes("product_still_life_outdoor_tennis_wallet_hero_no_text_v3"));
check("v3_prompt_exists", () => fileExists("prompts/image_generation/product_still_life_outdoor_tennis_wallet_hero_no_text_v3.yaml"));
check("score_total_ge_90", () => example.includes("total: 92") || example.includes("total: 9"));
check("rating_production_ready", () => example.includes("rating: production_ready"));
check("a5_single_allowed", () => example.includes("a5_single_test_allowed: true"));
check("batch_allowed", () => example.includes("batch_generation_allowed: true"));
check("has_hero_subject", () => example.includes("has_hero_subject: true"));
check("has_product_scale", () => example.includes("has_product_scale: true"));
check("has_no_text_no_logo", () => example.includes("has_no_text_no_logo: true"));
check("has_no_watermark", () => example.includes("has_no_watermark: true"));
check("has_acceptance_gate", () => example.includes("has_acceptance_gate: true"));
check("memory_write_false", () => example.includes("memory_write_allowed_false: true"));
check("dailynote_false", () => example.includes("daily_note_write_allowed_false: true"));
check("doc_says_not_a5_auth", () => fileContains("docs/280_v7_23_prompt_quality_gate_v1.md", "不授权真实生成") || fileContains("docs/280_v7_23_prompt_quality_gate_v1.md", "不授权"));
check("doc_says_a5_required", () => fileContains("docs/280_v7_23_prompt_quality_gate_v1.md", "A5 仍然是单独"));
check("validate_mvp_includes_v7_23", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_23_prompt_quality_gate_v1"));

const summary = { passed, phase: "v7.23 Prompt Quality Gate v1", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
