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

check("doc_250_exists", () => fileExists("docs/250_v6_10_product_runtime_rc_readiness_matrix.md"));
check("matrix_contains_v6_1", () => fileContains("docs/250_v6_10_product_runtime_rc_readiness_matrix.md", "v6.1"));
check("matrix_contains_v6_9B", () => fileContains("docs/250_v6_10_product_runtime_rc_readiness_matrix.md", "v6.9B"));
check("matrix_lists_validators", () => fileContains("docs/250_v6_10_product_runtime_rc_readiness_matrix.md", "validate_v6_"));
check("matrix_no_release_auth", () => fileContains("docs/250_v6_10_product_runtime_rc_readiness_matrix.md", "no release"));
check("matrix_no_a5_auth", () => fileContains("docs/250_v6_10_product_runtime_rc_readiness_matrix.md", "A5"));
check("validate_mvp_includes_v6_10", () => fileContains("scripts/validate_mvp.ps1", "validate_v6_10_product_runtime_rc_readiness_matrix"));

const summary = {
  passed, phase: "v6.10 Product Runtime RC Readiness Matrix",
  check_count: results.length, failed_count: results.filter(r => !r.passed).length,
  draft_only: true, no_execution: true, real_execution: false,
  external_network_required: false, file_write_performed: false,
  results
};
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
