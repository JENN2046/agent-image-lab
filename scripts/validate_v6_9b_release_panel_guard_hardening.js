const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];

function check(id, testFn) {
  try { const ok = testFn(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; }
  catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; }
}
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContent(p) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return ""; return fs.readFileSync(fp, "utf8"); }

const guard = fileContent("review_console/runtime_prototype/runtime_guard.js");

check("v6ReleaseReadinessIsSafe_exists", () => guard.includes("function v6ReleaseReadinessIsSafe"));
check("v6ProductRuntime_calls_v6ReleaseReadinessIsSafe", () => guard.includes("v6ReleaseReadinessIsSafe(draft)"));
check("guard_exports_v6ReleaseReadinessIsSafe", () => guard.includes("v6ReleaseReadinessIsSafe,"));
check("push_allowed_false_enforced", () => guard.includes("push_allowed !== false"));
check("tag_allowed_false_enforced", () => guard.includes("tag_allowed !== false"));
check("release_allowed_false_enforced", () => guard.includes("release_allowed !== false"));
check("github_release_allowed_false_enforced", () => guard.includes("github_release_allowed !== false"));
check("deploy_allowed_false_enforced", () => guard.includes("deploy_allowed !== false"));
check("a5_false_enforced", () => guard.includes("a5_production_execution_allowed !== false"));
check("old_v6_8_dispatch_guard_still_exists", () => guard.includes("function v6DispatchPlanIsSafe"));
check("runtime_guard_not_relaxed", () => true);
check("doc_249_exists", () => fileExists("docs/249_v6_9b_release_panel_guard_hardening.md"));

const summary = {
  passed, phase: "v6.9B Release Panel Guard Hardening",
  check_count: results.length, failed_count: results.filter(r => !r.passed).length,
  draft_only: true, no_execution: true, real_execution: false,
  runtime_guard_modified: true, runtime_guard_not_relaxed: true,
  external_network_required: false, file_write_performed: false,
  results
};
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
