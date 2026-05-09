const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

const runner = fs.readFileSync(path.join(root, "scripts/run_v0_7_photo_studio_os_real_execution.ps1"), "utf8");
check("runner_has_model_override_param", () => runner.includes("ModelOverride"));
check("runner_sets_payload_model", () => runner.includes("$payload.model"));
check("runner_records_model_ref", () => runner.includes("model_ref"));
check("runner_verifies_model_match", () => runner.includes("plugin_reported_model_matches_requested"));
check("doc_269_exists", () => fileExists("docs/269_v7_12_runner_model_override_preflight.md"));
check("validate_mvp_includes_v7_12", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_12_runner_model_override_preflight"));

const summary = { passed, phase: "v7.12 Runner ModelOverride Preflight", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
