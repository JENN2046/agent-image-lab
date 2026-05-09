const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

const pf = "plugin_calls/image_generation/doubaogen_generate_v1.yaml";
const p = fs.readFileSync(path.join(root, pf), "utf8");

check("profile_exists", () => fileExists(pf));
check("local_paths_exists", () => fileExists("configs/local_paths/doubaogen_plugin_dir.local.yaml"));
check("plugin_id_DoubaoGen", () => p.includes("plugin_id: DoubaoGen"));
check("command_generate", () => p.includes("plugin_command: generate"));
check("plugin_dir_ref_exists", () => p.includes("plugin_dir_ref:"));
check("allow_scan_parent_dir_false", () => p.includes("allow_scan_parent_dir: false"));
check("allow_read_other_plugins_false", () => p.includes("allow_read_other_plugins: false"));
check("mode_text_to_image", () => p.includes("mode: text_to_image"));
check("prompt_source_ref", () => p.includes("source: prompt_package_ref"));
check("allowed_prompt_root", () => p.includes("allowed_prompt_root: prompts/image_generation/"));
check("output_root_runs", () => p.includes("root: runs/real_generation/"));
check("allow_outside_repo_false", () => p.includes("allow_outside_repo: false"));
check("max_plugin_calls_1", () => p.includes("max_plugin_calls: 1"));
check("max_images_created_1", () => p.includes("max_images_created: 1"));
check("retry_allowed_false", () => p.includes("retry_allowed: false"));
check("requires_a5", () => p.includes("real_execution_requires_a5: true"));
check("memory_write_false", () => p.includes("memory_write_allowed: false"));
check("dailynote_false", () => p.includes("daily_note_write_allowed: false"));
check("push_false", () => p.includes("push_allowed: false"));
check("tag_false", () => p.includes("tag_allowed: false"));
check("release_false", () => p.includes("release_allowed: false"));
check("result_contract", () => p.includes("COMPLETED_GENERATED") && p.includes("BLOCKED") && p.includes("FAILED"));
check("v7_10_doc_exists", () => fileExists("docs/267_v7_10_image_generation_plugin_call_library.md"));
check("schema_exists", () => fileExists("schemas/plugin_call_profile.schema.yaml"));
check("a5_template_has_profile_ref", () => fileContains("docs/a5_templates/A5_SINGLE_REAL_GENERATION_TEMPLATE.md", "plugin_call_profile_ref"));
check("validate_mvp_includes_v7_10", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_10_image_generation_plugin_call_library"));

const summary = { passed, phase: "v7.10 Image Generation Plugin Call Library", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
