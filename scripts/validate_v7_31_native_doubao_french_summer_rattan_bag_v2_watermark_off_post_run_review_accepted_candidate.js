const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

const examplePath = "tests/schema_examples/v7_31_native_doubao_french_summer_rattan_bag_v2_watermark_off_post_run_review_accepted_candidate.example.yaml";
const example = fs.readFileSync(path.join(root, examplePath), "utf8");

check("doc_286_exists", () => fileExists("docs/286_v7_31_native_doubao_french_summer_rattan_bag_v2_watermark_off_post_run_review_accepted_candidate.md"));
check("schema_exists", () => fileExists(examplePath));
check("status_completed", () => example.includes("status: completed_generated"));
check("asset_accepted", () => example.includes("asset_status: accepted_candidate"));
check("execution_not_authorized", () => example.includes("execution_authorized_by_this_record: false"));
check("phase_v7_31", () => example.includes("phase: v7_31"));
check("prompt_ref_v2", () => example.includes("product_still_life_french_summer_rattan_bucket_bag_bicycle_no_watermark_v2"));
check("model_matches", () => example.includes("model_matches: true"));
check("watermark_false", () => example.includes("watermark_requested: false"));
check("watermark_sent", () => example.includes("watermark_parameter_sent: true"));
check("watermark_policy", () => example.includes("watermark_policy: disabled_by_request_payload"));
check("api_calls_1", () => example.includes("api_calls_observed: 1"));
check("images_1", () => example.includes("images_created: 1"));
check("retry_false", () => example.includes("retry_performed: false"));
check("output_path", () => example.includes("output_path:"));
check("product_visible_pass", () => example.includes("product_fully_visible: pass"));
check("product_unobstructed_pass", () => example.includes("product_unobstructed: pass"));
check("no_leaf_pass", () => example.includes("no_leaf_obstruction: pass"));
check("no_book_text_pass", () => example.includes("no_readable_book_text: pass"));
check("no_watermark_pass", () => example.includes("no_watermark_or_generated_mark: pass"));
check("clean_corners_pass", () => example.includes("clean_image_corners: pass"));
check("commercial_pass", () => example.includes("commercial_usability: pass"));
check("memory_false", () => example.includes("memory_suitability: false"));
check("first_accepted", () => example.includes("qualifies_as_french_summer_rattan_bag_first_accepted_candidate: true"));
check("validates_watermark", () => example.includes("validates_watermark_false_parameter: true"));
check("write_memory_false", () => example.includes("write_to_memory_allowed: false"));
check("dailynote_false", () => example.includes("daily_note_write_allowed: false"));
check("batch_not_auth", () => example.includes("batch_generation_authorized: false"));
check("doc_no_new_gen", () => fileContains("docs/286_v7_31_native_doubao_french_summer_rattan_bag_v2_watermark_off_post_run_review_accepted_candidate.md", "不授权再次生成"));
check("validate_mvp_includes_v7_31", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_31_"));

const summary = { passed, phase: "v7.31 Watermark-Off Accepted Candidate Review", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
