const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

const regPath = "failure_samples/failure_registry.yaml";
const reg = fs.readFileSync(path.join(root, regPath), "utf8");
const taxPath = "failure_samples/failure_taxonomy.yaml";
const tax = fs.readFileSync(path.join(root, taxPath), "utf8");

check("readme_exists", () => fileExists("failure_samples/README.md"));
check("registry_exists", () => fileExists(regPath));
check("taxonomy_exists", () => fileExists(taxPath));
check("cat_watermark", () => fileExists("failure_samples/categories/provider_watermark.yaml"));
check("cat_obstruction", () => fileExists("failure_samples/categories/product_obstruction.yaml"));
check("cat_text", () => fileExists("failure_samples/categories/readable_text_risk.yaml"));
check("cat_material", () => fileExists("failure_samples/categories/material_direction_drift.yaml"));
check("cat_commercial", () => fileExists("failure_samples/categories/commercial_usability_partial.yaml"));
check("doc_288_exists", () => fileExists("docs/288_v7_33_failure_registry.md"));
check("schema_exists", () => fileExists("tests/schema_examples/v7_33_failure_registry.example.yaml"));
check("reg_version_v1", () => reg.includes("version: v1"));
check("reg_updated_v7_33", () => reg.includes("updated_by_phase: v7_33"));
check("reg_images_not_committed", () => reg.includes("image_files_committed_to_git: false"));
check("reg_registry_only", () => reg.includes("registry_only: true"));
check("reg_failure_count_3", () => reg.includes("failure_count: 3"));
check("reg_failure_tennis", () => reg.includes("failure_tennis_wallet_v7_21_001"));
check("reg_failure_rattan_v26", () => reg.includes("failure_french_summer_rattan_bag_v7_26_001"));
check("reg_failure_rattan_v29", () => reg.includes("failure_french_summer_rattan_bag_v7_29_001"));
check("reg_watermark_present", () => reg.includes("watermark_or_generated_mark_present"));
check("reg_balls_large", () => reg.includes("foreground_tennis_balls_too_large"));
check("reg_leaf_obstruction", () => reg.includes("product_partially_obstructed_by_leaf"));
check("reg_text_risk", () => reg.includes("readable_page_texture_risk"));
check("reg_material_drift", () => reg.includes("background_material_direction_drift"));
check("reg_api_missing_watermark", () => reg.includes("api_payload_missing_watermark_false"));
check("reg_prompt_watermark_insufficient", () => reg.includes("prompt_watermark_control_insufficient"));
check("reg_corrected_by_prompt", () => reg.includes("corrected_by_prompt_ref"));
check("reg_corrected_by_code", () => reg.includes("corrected_by_code_ref"));
check("reg_resolved", () => reg.includes("resolved_by_accepted_sample"));
check("tax_watermark_present", () => tax.includes("watermark_or_generated_mark_present"));
check("tax_api_missing", () => tax.includes("api_payload_missing_watermark_false"));
check("tax_blocks_accepted_true", () => tax.includes("blocks_accepted_candidate: true"));
check("tax_enforce_watermark", () => tax.includes("enforce_watermark_false_in_api_payload"));
check("cat_wm_count_2", () => fileContains("failure_samples/categories/provider_watermark.yaml", "sample_count: 2"));
check("cat_obs_count_2", () => fileContains("failure_samples/categories/product_obstruction.yaml", "sample_count: 2"));
check("cat_text_count_1", () => fileContains("failure_samples/categories/readable_text_risk.yaml", "sample_count: 1"));
check("cat_mat_count_1", () => fileContains("failure_samples/categories/material_direction_drift.yaml", "sample_count: 1"));
check("cat_com_count_2", () => fileContains("failure_samples/categories/commercial_usability_partial.yaml", "sample_count: 2"));
check("validate_mvp_includes_v7_33", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_33_failure_registry"));

const summary = { passed, phase: "v7.33 Failure Registry", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
