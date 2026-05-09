const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

check("doc_259_exists", () => fileExists("docs/259_v7_4_memory_write_gate_package.md"));
check("memory_write_authorized_false", () => fileContains("docs/259_v7_4_memory_write_gate_package.md", "memory_write_authorized: false"));
check("dailynote_write_authorized_false", () => fileContains("docs/259_v7_4_memory_write_gate_package.md", "daily_note_write_authorized: false"));
check("actual_write_performed_false", () => fileContains("docs/259_v7_4_memory_write_gate_package.md", "actual_write_performed: false"));
check("separate_a5_required", () => fileContains("docs/259_v7_4_memory_write_gate_package.md", "requires_separate_a5_authorization: true"));
check("rejected_blocks_memory", () => fileContains("docs/259_v7_4_memory_write_gate_package.md", "rejected_asset_blocks_memory: true"));
check("human_review_blocks_memory", () => fileContains("docs/259_v7_4_memory_write_gate_package.md", "needs_human_review_blocks_memory: true"));
check("blocked_blocks_memory", () => fileContains("docs/259_v7_4_memory_write_gate_package.md", "blocked_asset_blocks_memory: true"));
check("validate_mvp_includes_v7_4", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_4_memory_write_gate_package"));

const summary = { passed, phase: "v7.4 Memory Write Gate Package", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
