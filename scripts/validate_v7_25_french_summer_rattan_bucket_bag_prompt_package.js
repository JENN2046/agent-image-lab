const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

const pkgPath = "prompts/image_generation/product_still_life_french_summer_rattan_bucket_bag_bicycle_v1.yaml";
const pkg = fs.readFileSync(path.join(root, pkgPath), "utf8");
const gatePath = "tests/schema_examples/v7_25_french_summer_rattan_bucket_bag_prompt_quality_gate.example.yaml";
const gate = fs.readFileSync(path.join(root, gatePath), "utf8");

check("prompt_exists", () => fileExists(pkgPath));
check("doc_282_exists", () => fileExists("docs/282_v7_25_french_summer_rattan_bucket_bag_prompt_package.md"));
check("quality_gate_example_exists", () => fileExists(gatePath));
check("prompt_package_id", () => pkg.includes("prompt_package_id: product_still_life_french_summer_rattan_bucket_bag_bicycle_v1"));
check("mode_text_to_image", () => pkg.includes("mode: text_to_image"));
check("reference_policy", () => pkg.includes("text_only_no_image_input"));
check("prompt_contains_rattan_bag", () => pkg.includes("rattan") || pkg.includes("藤编"));
check("prompt_contains_bicycle_rack", () => pkg.includes("后货架") || pkg.includes("rack"));
check("prompt_contains_fully_visible", () => pkg.includes("完整可见") || pkg.includes("fully visible"));
check("prompt_contains_unobstructed", () => pkg.includes("不被") || pkg.includes("unobstructed") || pkg.includes("遮挡"));
check("prompt_no_readable_letters", () => pkg.includes("不能出现可读字母") || pkg.includes("可读字母"));
check("prompt_no_logo", () => pkg.includes("不能出现真实品牌 logo") || pkg.includes("no logo"));
check("prompt_no_watermark", () => pkg.includes("水印") || pkg.includes("watermark"));
check("prompt_abstract_floral", () => pkg.includes("抽象复古花卉") || pkg.includes("abstract"));
check("negative_contains_readable_text", () => pkg.includes("可读文字") || pkg.includes("readable"));
check("negative_contains_logo", () => pkg.includes("logo") || pkg.includes("品牌标识"));
check("negative_contains_watermark", () => pkg.includes("水印") || pkg.includes("watermark"));
check("negative_contains_obstruction", () => pkg.includes("遮挡") || pkg.includes("obstruction"));
check("gate_product_visible", () => pkg.includes("product_fully_visible: true"));
check("gate_product_unobstructed", () => pkg.includes("product_unobstructed: true"));
check("gate_no_watermark", () => pkg.includes("no_watermark_or_generated_mark: true"));
check("memory_write_false", () => pkg.includes("memory_write_allowed: false"));
check("dailynote_false", () => pkg.includes("daily_note_write_allowed: false"));
check("gate_score_ge_90", () => gate.includes("total: 92") || gate.includes("total: 9"));
check("gate_rating_ready", () => gate.includes("rating: production_ready"));
check("doc_says_no_a5", () => fileContains("docs/282_v7_25_french_summer_rattan_bucket_bag_prompt_package.md", "不授权真实生成"));
check("validate_mvp_includes_v7_25", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_25_french_summer_rattan_bucket_bag_prompt_package"));

const summary = { passed, phase: "v7.25 French Summer Rattan Bucket Bag", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
