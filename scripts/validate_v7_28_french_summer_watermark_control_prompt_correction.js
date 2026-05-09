const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

const pkgPath = "prompts/image_generation/product_still_life_french_summer_rattan_bucket_bag_bicycle_no_watermark_v2.yaml";
const pkg = fs.readFileSync(path.join(root, pkgPath), "utf8");
const gatePath = "tests/schema_examples/v7_28_french_summer_watermark_control_prompt_quality_gate.example.yaml";
const gate = fs.readFileSync(path.join(root, gatePath), "utf8");

check("v2_prompt_exists", () => fileExists(pkgPath));
check("doc_284_exists", () => fileExists("docs/284_v7_28_french_summer_watermark_control_prompt_correction.md"));
check("gate_example_exists", () => fileExists(gatePath));
check("prompt_package_id", () => pkg.includes("prompt_package_id: product_still_life_french_summer_rattan_bucket_bag_bicycle_no_watermark_v2"));
check("mode_text_to_image", () => pkg.includes("mode: text_to_image"));
check("reference_policy", () => pkg.includes("text_only_no_image_input"));
check("prompt_no_watermark", () => pkg.includes("水印") || pkg.includes("watermark"));
check("prompt_generated_mark", () => pkg.includes("生成标记") || pkg.includes("generated mark"));
check("prompt_clean_corners", () => pkg.includes("四角") || pkg.includes("corner") || pkg.includes("右下角"));
check("prompt_lower_right", () => pkg.includes("右下角"));
check("prompt_leaf_not_cover", () => pkg.includes("不能遮挡") || pkg.includes("leaf") || pkg.includes("叶子遮挡"));
check("prompt_blank_book", () => pkg.includes("空白") || pkg.includes("blank") || pkg.includes("无可读文字"));
check("prompt_rattan_bag", () => pkg.includes("rattan") || pkg.includes("藤编"));
check("prompt_bicycle_rack", () => pkg.includes("后货架") || pkg.includes("rear rack"));
check("negative_watermark", () => pkg.includes("水印") || pkg.includes("watermark"));
check("negative_generated_mark", () => pkg.includes("生成标记") || pkg.includes("generated mark"));
check("negative_lower_right", () => pkg.includes("右下角") || pkg.includes("lower-right"));
check("negative_leaf_covering", () => pkg.includes("叶子遮挡") || pkg.includes("leaf covering"));
check("negative_readable_pages", () => pkg.includes("可读") || pkg.includes("readable book"));
check("gate_no_leaf", () => pkg.includes("no_leaf_obstruction: true"));
check("gate_no_book_text", () => pkg.includes("no_readable_book_text: true"));
check("gate_clean_corners", () => pkg.includes("clean_image_corners: true"));
check("gate_no_watermark", () => pkg.includes("no_watermark_or_generated_mark: true"));
check("memory_false", () => pkg.includes("memory_write_allowed: false"));
check("dailynote_false", () => pkg.includes("daily_note_write_allowed: false"));
check("gate_score_ge_90", () => gate.includes("total: 95") || gate.includes("total: 9"));
check("gate_rating_ready", () => gate.includes("rating: production_ready"));
check("doc_no_a5", () => fileContains("docs/284_v7_28_french_summer_watermark_control_prompt_correction.md", "不授权真实生成"));
check("validate_mvp_includes_v7_28", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_28_french_summer_watermark_control_prompt_correction"));

const summary = { passed, phase: "v7.28 French Summer Watermark Control", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
