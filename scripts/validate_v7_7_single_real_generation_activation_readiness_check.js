const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

check("doc_264_exists", () => fileExists("docs/264_v7_7_single_real_generation_activation_readiness_check.md"));
check("schema_exists", () => fileExists("tests/schema_examples/v7_7_single_real_generation_activation_readiness_check.example.yaml"));
check("baseline_1577777", () => fileContains("docs/264_v7_7_single_real_generation_activation_readiness_check.md", "1577777"));
check("execution_not_authorized", () => fileContains("docs/264_v7_7_single_real_generation_activation_readiness_check.md", "execution_authorized_by_this_record: false"));
check("ready_for_user_decision", () => fileContains("docs/264_v7_7_single_real_generation_activation_readiness_check.md", "ready_for_user_a5_decision: true"));
check("schema_plugin_call_false", () => fileContains("tests/schema_examples/v7_7_single_real_generation_activation_readiness_check.example.yaml", "plugin_call_performed: false"));
check("schema_api_call_false", () => fileContains("tests/schema_examples/v7_7_single_real_generation_activation_readiness_check.example.yaml", "api_call_performed: false"));
check("schema_image_false", () => fileContains("tests/schema_examples/v7_7_single_real_generation_activation_readiness_check.example.yaml", "image_created: false"));
check("schema_dailynote_false", () => fileContains("tests/schema_examples/v7_7_single_real_generation_activation_readiness_check.example.yaml", "daily_note_written: false"));
check("schema_vcp_memory_false", () => fileContains("tests/schema_examples/v7_7_single_real_generation_activation_readiness_check.example.yaml", "vcp_memory_written: false"));
check("validate_mvp_includes_v7_7", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_7_single_real_generation_activation_readiness_check"));
check("v7_6_validator_passes", () => { const c = require("child_process"); const r = c.execSync("node scripts/validate_v7_6_single_real_generation_activation_package.js", { encoding: "utf8" }); const j = JSON.parse(r); return j.passed === true; });

const summary = { passed, phase: "v7.7 Single Real Generation Activation Readiness Check", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
