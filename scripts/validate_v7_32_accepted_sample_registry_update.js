const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

const registryPath = "accepted_samples/accepted_sample_registry.yaml";
const registry = fs.readFileSync(path.join(root, registryPath), "utf8");

check("accepted_samples_readme", () => fileExists("accepted_samples/README.md"));
check("registry_exists", () => fileExists(registryPath));
check("cat_product_exists", () => fileExists("accepted_samples/categories/product_still_life.yaml"));
check("cat_fashion_exists", () => fileExists("accepted_samples/categories/fashion_lifestyle_still_life.yaml"));
check("doc_287_exists", () => fileExists("docs/287_v7_32_accepted_sample_registry_update.md"));
check("schema_exists", () => fileExists("tests/schema_examples/v7_32_accepted_sample_registry_update.example.yaml"));
check("registry_version_v1", () => registry.includes("version: v1"));
check("registry_updated_v7_32", () => registry.includes("updated_by_phase: v7_32"));
check("images_not_committed", () => registry.includes("image_files_committed_to_git: false"));
check("registry_only", () => registry.includes("registry_only: true"));
check("sample_tennis_wallet", () => registry.includes("accepted_product_still_life_tennis_wallet_001"));
check("sample_rattan_bag", () => registry.includes("accepted_french_summer_rattan_bucket_bag_001"));
check("reg_v7_24", () => registry.includes("v7_24"));
check("reg_v7_31", () => registry.includes("v7_31"));
check("watermark_false", () => registry.includes("watermark_requested: false"));
check("validates_watermark", () => registry.includes("validates_watermark_false_parameter: true"));
check("memory_false", () => registry.includes("memory_suitability: false"));
check("write_memory_false", () => registry.includes("write_to_memory_allowed: false"));
check("dailynote_false", () => registry.includes("daily_note_write_allowed: false"));
check("cat_product_count_1", () => fileContains("accepted_samples/categories/product_still_life.yaml", "sample_count: 1"));
check("cat_fashion_count_1", () => fileContains("accepted_samples/categories/fashion_lifestyle_still_life.yaml", "sample_count: 1"));
check("validate_mvp_includes_v7_32", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_32_accepted_sample_registry_update"));

const summary = { passed, phase: "v7.32 Accepted Sample Registry", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
