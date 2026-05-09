const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

const pkgPath = "prompts/image_generation/product_still_life_outdoor_tennis_wallet_hero_no_text_v3.yaml";
const pkg = fs.readFileSync(path.join(root, pkgPath), "utf8");

check("v3_prompt_exists", () => fileExists(pkgPath));
check("prompt_package_id", () => pkg.includes("prompt_package_id: product_still_life_outdoor_tennis_wallet_hero_no_text_v3"));
check("mode_text_to_image", () => pkg.includes("mode: text_to_image"));
check("reference_policy", () => pkg.includes("text_only_no_image_input"));
check("prompt_contains_no_watermark", () => pkg.includes("no watermark") || pkg.includes("No watermark"));
check("prompt_contains_no_generated_mark", () => pkg.includes("generated mark") || pkg.includes("No generated"));
check("prompt_contains_no_logo", () => pkg.includes("No logo") || pkg.includes("no logo"));
check("prompt_contains_no_readable_text", () => pkg.includes("No text") || pkg.includes("no readable"));
check("prompt_contains_fully_visible", () => pkg.includes("fully visible"));
check("prompt_contains_unobstructed", () => pkg.includes("unobstructed"));
check("prompt_tennis_balls_supporting", () => pkg.includes("supporting props") || pkg.includes("small supporting"));
check("prompt_real_racket_strings", () => pkg.includes("real tennis racket string") || pkg.includes("authentic racket"));
check("negative_contains_watermark", () => pkg.includes("watermark"));
check("negative_contains_generated_mark", () => pkg.includes("generated mark"));
check("negative_contains_fake_text", () => pkg.includes("fake text"));
check("negative_contains_oversized_ball", () => pkg.includes("oversized tennis ball"));
check("gate_product_unobstructed", () => pkg.includes("product_unobstructed: true"));
check("gate_no_watermark", () => pkg.includes("no_watermark_or_generated_mark: true"));
check("memory_write_false", () => pkg.includes("memory_write_allowed: false"));
check("dailynote_false", () => pkg.includes("daily_note_write_allowed: false"));

const schema = fs.readFileSync(path.join(root, "tests/schema_examples/v7_22_prompt_correction_no_watermark_unobstructed_product_v3.example.yaml"), "utf8");
check("schema_execution_not_authorized", () => schema.includes("execution_authorized_by_this_record: false"));
check("schema_api_call_false", () => schema.includes("real_api_call_performed: false"));
check("schema_image_false", () => schema.includes("image_created: false"));

check("doc_279_exists", () => fileExists("docs/279_v7_22_prompt_correction_no_watermark_unobstructed_product_v3.md"));
check("validate_mvp_includes_v7_22", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_22_prompt_correction_no_watermark_unobstructed_product_v3"));

const summary = { passed, phase: "v7.22 Prompt Correction No Watermark Product Hero v3", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
