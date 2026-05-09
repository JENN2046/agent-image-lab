const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

const doc = "docs/273_v7_16_native_doubao_real_api_activation_preflight.md";
const schema = "tests/schema_examples/v7_16_native_doubao_real_api_activation_preflight.example.yaml";
const profile = "plugins/image_generation/native_doubao_image/plugin.profile.yaml";
const pluginJs = "plugins/image_generation/native_doubao_image/native_doubao_image.js";
const adapterJs = "adapters/image_generation/native_doubao_adapter.js";
const config = "plugins/image_generation/native_doubao_image/config.example.yaml";

check("doc_273_exists", () => fileExists(doc));
check("schema_example_exists", () => fileExists(schema));
check("plugin_profile_exists", () => fileExists(profile));
check("native_js_exists", () => fileExists(pluginJs));
check("adapter_exists", () => fileExists(adapterJs));
check("doc_contains_baseline", () => fileContains(doc, "6528d6d"));
check("doc_contains_api_key_env", () => fileContains(doc, "DOUBAO_IMAGE_API_KEY"));
check("doc_contains_required_model", () => fileContains(doc, "doubao-seedream-5-0-260128"));
check("doc_states_preflight_not_authorize", () => fileContains(doc, "不授权真实 API 调用"));

const schemaContent = fs.readFileSync(path.join(root, schema), "utf8");
check("schema_execution_not_authorized", () => schemaContent.includes("execution_authorized_by_this_record: false"));
check("schema_api_key_not_stored", () => schemaContent.includes("api_key_value_stored_in_repo: false"));
check("schema_real_call_false", () => schemaContent.includes("real_api_call_performed: false"));
check("schema_image_created_false", () => schemaContent.includes("image_created: false"));
check("schema_max_calls_1", () => schemaContent.includes("max_plugin_calls: 1"));
check("schema_max_images_1", () => schemaContent.includes("max_images_created: 1"));
check("schema_retry_false", () => schemaContent.includes("retry_allowed: false"));
check("schema_memory_false", () => schemaContent.includes("memory_write_allowed: false"));
check("schema_dailynote_false", () => schemaContent.includes("daily_note_write_allowed: false"));
check("schema_push_false", () => schemaContent.includes("push_allowed: false"));
check("schema_tag_false", () => schemaContent.includes("tag_allowed: false"));
check("schema_release_false", () => schemaContent.includes("release_allowed: false"));

const profileContent = fs.readFileSync(path.join(root, profile), "utf8");
check("profile_required_model_5", () => profileContent.includes("required_model: doubao-seedream-5-0-260128"));
check("profile_a5_required", () => profileContent.includes("real_execution_requires_a5: true"));

const configContent = fs.readFileSync(path.join(root, config), "utf8");
check("config_uses_api_key_env", () => configContent.includes("api_key_env") && !configContent.includes("api_key: \""));

check("validate_mvp_includes_v7_16", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_16_native_doubao_real_api_activation_preflight"));

const summary = { passed, phase: "v7.16 Native Doubao Real API Activation Preflight", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
