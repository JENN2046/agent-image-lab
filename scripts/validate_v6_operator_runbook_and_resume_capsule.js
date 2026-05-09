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
function fileContains(p, s) {
  const fp = path.join(root, p);
  if (!fs.existsSync(fp)) return false;
  return fs.readFileSync(fp, "utf8").includes(s);
}

check("doc_252_exists", () => fileExists("docs/252_v6_product_runtime_operator_runbook.md"));
check("doc_253_exists", () => fileExists("docs/253_v6_10_resume_capsule.md"));
check("runbook_contains_architecture", () => fileContains("docs/252_v6_product_runtime_operator_runbook.md", "v6 Product Runtime"));
check("runbook_contains_startup_cmd", () => fileContains("docs/252_v6_product_runtime_operator_runbook.md", "index.html"));
check("runbook_contains_validation_cmd", () => fileContains("docs/252_v6_product_runtime_operator_runbook.md", "validate_v6_"));
check("runbook_contains_forbidden_actions", () => fileContains("docs/252_v6_product_runtime_operator_runbook.md", "不允许执行"));
check("runbook_contains_six_modules", () => fileContains("docs/252_v6_product_runtime_operator_runbook.md", "Task Panel") && fileContains("docs/252_v6_product_runtime_operator_runbook.md", "Release Panel"));
check("runbook_contains_push_criteria", () => fileContains("docs/252_v6_product_runtime_operator_runbook.md", "可以 push"));
check("runbook_contains_blocked_criteria", () => fileContains("docs/252_v6_product_runtime_operator_runbook.md", "BLOCKED"));
check("capsule_contains_remote_baseline", () => fileContains("docs/253_v6_10_resume_capsule.md", "origin/master"));
check("capsule_contains_validators", () => fileContains("docs/253_v6_10_resume_capsule.md", "validate_v6_"));
check("capsule_contains_hard_stops", () => fileContains("docs/253_v6_10_resume_capsule.md", "Hard Stop"));
check("capsule_contains_next_safe_task", () => fileContains("docs/253_v6_10_resume_capsule.md", "Next Safe Task"));
check("capsule_contains_do_not_do", () => fileContains("docs/253_v6_10_resume_capsule.md", "Do Not Do"));

const summary = {
  passed, phase: "v6 Operator Runbook and Resume Capsule",
  check_count: results.length, failed_count: results.filter(r => !r.passed).length,
  draft_only: true, no_execution: true, real_execution: false,
  external_network_required: false, file_write_performed: false,
  results
};
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
