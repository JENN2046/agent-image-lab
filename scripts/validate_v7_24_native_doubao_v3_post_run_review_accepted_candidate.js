const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

const examplePath = "tests/schema_examples/v7_24_native_doubao_v3_post_run_review_accepted_candidate.example.yaml";
const example = fs.readFileSync(path.join(root, examplePath), "utf8");

check("doc_281_exists", () => fileExists("docs/281_v7_24_native_doubao_v3_post_run_review_accepted_candidate.md"));
check("schema_example_exists", () => fileExists(examplePath));
check("status_completed", () => example.includes("status: completed_generated"));
check("asset_accepted", () => example.includes("asset_status: accepted_candidate"));
check("prompt_ref_v3", () => example.includes("product_still_life_outdoor_tennis_wallet_hero_no_text_v3"));
check("model_matches", () => example.includes("model_matches: true"));
check("api_calls_1", () => example.includes("api_calls_observed: 1"));
check("images_1", () => example.includes("images_created: 1"));
check("retry_false", () => example.includes("retry_performed: false"));
check("output_path", () => example.includes("output_path:"));
check("subject_match_pass", () => example.includes("prompt_subject_match: pass"));
check("product_visible_pass", () => example.includes("product_fully_visible: pass"));
check("product_unobstructed_pass", () => example.includes("product_unobstructed: pass"));
check("no_watermark_pass", () => example.includes("no_watermark_or_generated_mark: pass"));
check("commercial_pass", () => example.includes("commercial_usability: pass"));
check("memory_false", () => example.includes("memory_suitability: false"));
check("write_to_memory_false", () => example.includes("write_to_memory_allowed: false"));
check("dailynote_false", () => example.includes("daily_note_write_allowed: false"));
check("batch_not_authorized", () => example.includes("batch_generation_authorized: false"));
check("validate_mvp_includes_v7_24", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_24_native_doubao_v3_post_run_review_accepted_candidate"));

const summary = { passed, phase: "v7.24 Native Doubao Accepted Candidate Review", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
