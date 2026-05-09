const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

check("env_example_exists", () => fileExists(".env.example"));
check("env_local_example_exists", () => fileExists(".env.local.example"));
check("env_example_has_base_url", () => fileContains(".env.example", "DOUBAO_IMAGE_API_BASE_URL"));
check("env_example_has_api_key", () => fileContains(".env.example", "DOUBAO_IMAGE_API_KEY"));
check("env_example_has_model", () => fileContains(".env.example", "doubao-seedream-5-0-260128"));

const gitignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
check("gitignore_ignores_dot_env", () => gitignore.includes(".env"));
check("gitignore_ignores_dot_env_local", () => gitignore.includes(".env.local"));
check("gitignore_ignores_dot_env_dot_local", () => gitignore.includes(".env.*.local"));

check("doc_275_exists", () => fileExists("docs/275_v7_18_local_native_doubao_env_setup.md"));
check("doc_says_config_not_auth", () => fileContains("docs/275_v7_18_local_native_doubao_env_setup.md", "不等于授权执行") || fileContains("docs/275_v7_18_local_native_doubao_env_setup.md", "不授权") || fileContains("docs/275_v7_18_local_native_doubao_env_setup.md", "配置存在不等于"));
check("doc_says_dry_run_default", () => fileContains("docs/275_v7_18_local_native_doubao_env_setup.md", "dry-run"));

const envExample = fs.readFileSync(path.join(root, ".env.example"), "utf8");
check("env_example_no_real_key", () => !envExample.includes("sk-") && !envExample.includes("secret"));

check("validate_mvp_includes_v7_18", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_18_local_native_doubao_env_setup"));

const summary = { passed, phase: "v7.18 Local Native Doubao Env Setup", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
