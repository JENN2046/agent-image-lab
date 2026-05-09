const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

check("doc_256_exists", () => fileExists("docs/256_v7_1_single_real_generation_controlled_run_package.md"));
check("execution_not_authorized", () => fileContains("docs/256_v7_1_single_real_generation_controlled_run_package.md", "execution_authorized_by_this_record: false"));
check("baseline_commit_e886b6b", () => fileContains("docs/256_v7_1_single_real_generation_controlled_run_package.md", "baseline_commit: e886b6b"));
check("baseline_tag_rc", () => fileContains("docs/256_v7_1_single_real_generation_controlled_run_package.md", "v6.10-rc1-product-runtime"));
check("max_plugin_calls_1", () => fileContains("docs/256_v7_1_single_real_generation_controlled_run_package.md", "max_plugin_calls: 1"));
check("max_images_1", () => fileContains("docs/256_v7_1_single_real_generation_controlled_run_package.md", "max_images_created: 1"));
check("retry_allowed_false", () => fileContains("docs/256_v7_1_single_real_generation_controlled_run_package.md", "retry_allowed: false"));
check("memory_write_false", () => fileContains("docs/256_v7_1_single_real_generation_controlled_run_package.md", "memory_write_allowed: false"));
check("daily_note_false", () => fileContains("docs/256_v7_1_single_real_generation_controlled_run_package.md", "daily_note_write_allowed: false"));
check("human_review_true", () => fileContains("docs/256_v7_1_single_real_generation_controlled_run_package.md", "human_review_required: true"));
check("acceptance_gate_true", () => fileContains("docs/256_v7_1_single_real_generation_controlled_run_package.md", "asset_acceptance_gate_required: true"));
check("push_tag_release_false", () => fileContains("docs/256_v7_1_single_real_generation_controlled_run_package.md", "push_allowed: false") && fileContains("docs/256_v7_1_single_real_generation_controlled_run_package.md", "tag_allowed: false") && fileContains("docs/256_v7_1_single_real_generation_controlled_run_package.md", "release_allowed: false"));
check("validate_mvp_includes_v7_1", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_1_single_real_generation_controlled_run_package"));

const summary = { passed, phase: "v7.1 Single Real Generation Controlled Run Package", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
