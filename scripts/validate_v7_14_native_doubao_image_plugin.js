const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

check("profile_exists", () => fileExists("plugins/image_generation/native_doubao_image/plugin.profile.yaml"));
check("config_exists", () => fileExists("plugins/image_generation/native_doubao_image/config.example.yaml"));
check("plugin_js_exists", () => fileExists("plugins/image_generation/native_doubao_image/native_doubao_image.js"));
check("adapter_js_exists", () => fileExists("adapters/image_generation/native_doubao_adapter.js"));
check("dry_run_fixture_exists", () => fileExists("plugins/image_generation/native_doubao_image/dry_run_fixture.json"));
check("doc_272_exists", () => fileExists("docs/272_v7_14_native_doubao_image_plugin.md"));
check("schema_exists", () => fileExists("schemas/native_doubao_image_plugin.schema.yaml"));

const profile = fs.readFileSync(path.join(root, "plugins/image_generation/native_doubao_image/plugin.profile.yaml"), "utf8");
check("plugin_id_native", () => profile.includes("plugin_id: NativeDoubaoImage"));
check("provider_direct_api", () => profile.includes("provider_type: direct_api"));
check("command_generate", () => profile.includes("command: generate"));
check("required_model_5", () => profile.includes("required_model: doubao-seedream-5-0-260128"));
check("block_on_mismatch", () => profile.includes("block_on_model_mismatch: true"));
check("a5_required", () => profile.includes("real_execution_requires_a5: true"));
check("memory_write_false", () => profile.includes("memory_write_allowed: false"));
check("dailynote_false", () => profile.includes("daily_note_write_allowed: false"));
check("push_false", () => profile.includes("push_allowed: false"));
check("tag_false", () => profile.includes("tag_allowed: false"));
check("release_false", () => profile.includes("release_allowed: false"));
check("max_calls_1", () => profile.includes("max_plugin_calls: 1"));
check("max_images_1", () => profile.includes("max_images_created: 1"));
check("retry_false", () => profile.includes("retry_allowed: false"));

const config = fs.readFileSync(path.join(root, "plugins/image_generation/native_doubao_image/config.example.yaml"), "utf8");
check("config_uses_env_var", () => config.includes("api_key_env") && !config.includes("sk-") && !config.includes("api_key: \"") && !config.includes("secret:"));

const js = fs.readFileSync(path.join(root, "plugins/image_generation/native_doubao_image/native_doubao_image.js"), "utf8");
check("has_dry_run_generate", () => js.includes("function dryRunGenerate"));
check("has_detect_mismatch", () => js.includes("function detectModelMismatch"));
check("no_real_api_call", () => !js.includes("fetch(") && !js.includes("http.") && !js.includes("https."));

const fixture = JSON.parse(fs.readFileSync(path.join(root, "plugins/image_generation/native_doubao_image/dry_run_fixture.json"), "utf8"));
check("fixture_api_call_false", () => fixture.api_call_performed === false);
check("fixture_image_false", () => fixture.image_created === false);

check("validate_mvp_includes_native", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_14_native_doubao_image_plugin"));

const summary = { passed, phase: "v7.14 Native Doubao Image Plugin", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
