const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

check("doc_260_exists", () => fileExists("docs/260_v7_5_production_run_dry_run_prep.md"));
check("doc_261_exists", () => fileExists("docs/261_v7_5_a5_activation_checklist.md"));
check("schema_example_exists", () => fileExists("tests/schema_examples/v7_5_production_run_dry_run_prep.example.yaml"));
check("doc_260_contains_f13c6c3", () => fileContains("docs/260_v7_5_production_run_dry_run_prep.md", "f13c6c3"));
check("doc_260_not_real_generation", () => fileContains("docs/260_v7_5_production_run_dry_run_prep.md", "不等于真实生成") || fileContains("docs/260_v7_5_production_run_dry_run_prep.md", "不执行插件"));
check("doc_261_execution_not_authorized", () => fileContains("docs/261_v7_5_a5_activation_checklist.md", "execution_authorized_by_this_record: false"));
check("doc_261_max_plugin_calls_1", () => fileContains("docs/261_v7_5_a5_activation_checklist.md", "max_plugin_calls: 1"));
check("doc_261_max_images_1", () => fileContains("docs/261_v7_5_a5_activation_checklist.md", "max_images_created: 1"));
check("doc_261_retry_false", () => fileContains("docs/261_v7_5_a5_activation_checklist.md", "retry_allowed: false"));
check("doc_261_memory_write_false", () => fileContains("docs/261_v7_5_a5_activation_checklist.md", "memory_write_allowed: false"));
check("doc_261_dailynote_false", () => fileContains("docs/261_v7_5_a5_activation_checklist.md", "daily_note_write_allowed: false"));
check("doc_261_push_false", () => fileContains("docs/261_v7_5_a5_activation_checklist.md", "push_allowed: false"));
check("doc_261_tag_false", () => fileContains("docs/261_v7_5_a5_activation_checklist.md", "tag_allowed: false"));
check("doc_261_release_false", () => fileContains("docs/261_v7_5_a5_activation_checklist.md", "release_allowed: false"));
check("schema_plugin_call_false", () => fileContains("tests/schema_examples/v7_5_production_run_dry_run_prep.example.yaml", "plugin_call_performed: false"));
check("schema_image_created_false", () => fileContains("tests/schema_examples/v7_5_production_run_dry_run_prep.example.yaml", "image_created: false"));
check("schema_dailynote_false", () => fileContains("tests/schema_examples/v7_5_production_run_dry_run_prep.example.yaml", "daily_note_written: false"));
check("schema_vcp_memory_false", () => fileContains("tests/schema_examples/v7_5_production_run_dry_run_prep.example.yaml", "vcp_memory_written: false"));
check("readme_mentions_v7_5", () => fileContains("README.md", "v7.5"));
check("manifest_mentions_v7_5", () => fileContains("MANIFEST.md", "v7.5"));
check("release_notes_mentions_v7_5", () => fileContains("RELEASE_NOTES.md", "v7.5"));
check("roadmap_mentions_v7_5", () => fileContains("docs/00_project_roadmap.md", "v7.5"));
check("validation_checklist_mentions_v7_5", () => fileContains("tests/validation_checklist.md", "v7.5"));
check("validate_mvp_includes_v7_5", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_5_production_run_dry_run_prep"));

const summary = { passed, phase: "v7.5 Production Run Dry Run Prep", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
