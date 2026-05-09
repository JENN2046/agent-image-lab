const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

check("doc_262_exists", () => fileExists("docs/262_v7_6_single_real_generation_activation_package.md"));
check("doc_263_exists", () => fileExists("docs/263_v7_6_operator_activation_checklist.md"));
check("schema_example_exists", () => fileExists("tests/schema_examples/v7_6_single_real_generation_activation_package.example.yaml"));
check("doc_262_contains_9fd0931", () => fileContains("docs/262_v7_6_single_real_generation_activation_package.md", "9fd0931"));
check("doc_262_execution_not_authorized", () => fileContains("docs/262_v7_6_single_real_generation_activation_package.md", "execution_authorized_by_this_record: false"));
check("doc_262_status_inactive", () => fileContains("docs/262_v7_6_single_real_generation_activation_package.md", "inactive_package"));
check("doc_262_max_plugin_calls_1", () => fileContains("docs/262_v7_6_single_real_generation_activation_package.md", "max_plugin_calls: 1"));
check("doc_262_max_images_1", () => fileContains("docs/262_v7_6_single_real_generation_activation_package.md", "max_images_created: 1"));
check("doc_262_retry_false", () => fileContains("docs/262_v7_6_single_real_generation_activation_package.md", "retry_allowed: false"));
check("doc_262_memory_write_false", () => fileContains("docs/262_v7_6_single_real_generation_activation_package.md", "memory_write_allowed: false"));
check("doc_262_dailynote_false", () => fileContains("docs/262_v7_6_single_real_generation_activation_package.md", "daily_note_write_allowed: false"));
check("doc_262_push_tag_release_false", () => fileContains("docs/262_v7_6_single_real_generation_activation_package.md", "push_allowed: false") && fileContains("docs/262_v7_6_single_real_generation_activation_package.md", "tag_allowed: false") && fileContains("docs/262_v7_6_single_real_generation_activation_package.md", "release_allowed: false"));
check("doc_262_asset_review_required", () => fileContains("docs/262_v7_6_single_real_generation_activation_package.md", "asset_review_required: true"));
check("doc_262_human_review_required", () => fileContains("docs/262_v7_6_single_real_generation_activation_package.md", "human_review_required: true"));
check("doc_263_activation_not_authorized", () => fileContains("docs/263_v7_6_operator_activation_checklist.md", "activation_authorized: false"));
check("doc_263_preflight_fields", () => fileContains("docs/263_v7_6_operator_activation_checklist.md", "working_tree_clean") && fileContains("docs/263_v7_6_operator_activation_checklist.md", "validator_chain_passed"));
check("schema_plugin_call_false", () => fileContains("tests/schema_examples/v7_6_single_real_generation_activation_package.example.yaml", "plugin_call_performed: false"));
check("schema_image_created_false", () => fileContains("tests/schema_examples/v7_6_single_real_generation_activation_package.example.yaml", "image_created: false"));
check("schema_dailynote_false", () => fileContains("tests/schema_examples/v7_6_single_real_generation_activation_package.example.yaml", "daily_note_written: false"));
check("schema_vcp_memory_false", () => fileContains("tests/schema_examples/v7_6_single_real_generation_activation_package.example.yaml", "vcp_memory_written: false"));
check("readme_mentions_v7_6", () => fileContains("README.md", "v7.6"));
check("manifest_mentions_v7_6", () => fileContains("MANIFEST.md", "v7.6"));
check("release_notes_mentions_v7_6", () => fileContains("RELEASE_NOTES.md", "v7.6"));
check("roadmap_mentions_v7_6", () => fileContains("docs/00_project_roadmap.md", "v7.6"));
check("validate_mvp_includes_v7_6", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_6_single_real_generation_activation_package"));

const summary = { passed, phase: "v7.6 Single Real Generation Activation Package", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
