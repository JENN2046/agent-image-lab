const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

const runner = fs.readFileSync(path.join(root, "scripts/run_v0_7_photo_studio_os_real_execution.ps1"), "utf8");

check("doc_271_exists", () => fileExists("docs/271_v7_14_doubaogen_model_lock_enforcement.md"));
check("runner_has_model_override", () => runner.includes("ModelOverride"));
check("runner_records_requested_model", () => runner.includes("requested_model_sha256_utf8"));
check("runner_records_reported_model", () => runner.includes("plugin_reported_model_ref"));
check("runner_detects_mismatch", () => runner.includes("plugin_reported_model_matches_requested"));
check("runner_blocks_on_mismatch", () => runner.includes("blocked_model_mismatch"));
check("runner_blocks_asset_acceptance", () => runner.includes("asset_status = 'blocked'") || runner.includes('asset_status = "blocked"'));
check("runner_blocks_memory_write", () => runner.includes("memory_write_allowed = \$false"));
check("runner_blocks_dailynote_write", () => runner.includes("daily_note_write_allowed = \$false"));
check("validate_mvp_includes_v7_14", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_14_doubaogen_model_lock_enforcement"));

const summary = { passed, phase: "v7.14 DoubaoGen Model Lock Enforcement", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
