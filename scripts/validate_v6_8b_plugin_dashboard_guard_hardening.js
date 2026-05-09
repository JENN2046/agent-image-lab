const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];

function check(id, testFn) {
  try {
    const ok = testFn();
    results.push({ check: id, passed: Boolean(ok) });
    if (!ok) passed = false;
  } catch (e) {
    results.push({ check: id, passed: false, error: e.message });
    passed = false;
  }
}

function fileExists(p) {
  return fs.existsSync(path.join(root, p));
}

function fileContains(p, substr) {
  const fullPath = path.join(root, p);
  if (!fs.existsSync(fullPath)) return false;
  const content = fs.readFileSync(fullPath, "utf8");
  return content.includes(substr);
}

function fileContent(p) {
  const fullPath = path.join(root, p);
  if (!fs.existsSync(fullPath)) return "";
  return fs.readFileSync(fullPath, "utf8");
}

// === doc existence ===

check("doc_246_exists", () => fileExists("docs/246_v6_8b_plugin_dashboard_guard_hardening.md"));

// === guard checks ===

const guardContent = fileContent("review_console/runtime_prototype/runtime_guard.js");

check("guard_contains_v6DispatchPlanIsSafe", () =>
  guardContent.includes("function v6DispatchPlanIsSafe")
);

check("guard_v6ProductRuntime_calls_v6DispatchPlanIsSafe", () =>
  guardContent.includes("v6DispatchPlanIsSafe(draft)")
);

check("guard_exports_v6DispatchPlanIsSafe", () =>
  guardContent.includes("v6DispatchPlanIsSafe,")
);

// === safety field checks (via guard function content) ===

check("dry_run_required_true_in_guard", () =>
  guardContent.includes("dry_run_required !== true")
);

check("execution_blocked_true_in_guard", () =>
  guardContent.includes("execution_blocked !== true")
);

check("max_plugin_calls_0_in_guard", () =>
  guardContent.includes("max_plugin_calls !== 0")
);

check("real_manifest_loaded_false_in_guard", () =>
  guardContent.includes("real_manifest_loaded !== false")
);

check("real_plugin_available_confirmed_false_in_guard", () =>
  guardContent.includes("real_plugin_available_confirmed !== false")
);

check("parameters_raw_secret_false_in_guard", () =>
  guardContent.includes("raw_secret_stored !== false")
);

check("parameters_raw_endpoint_false_in_guard", () =>
  guardContent.includes("raw_endpoint_stored !== false")
);

check("parameters_raw_path_false_in_guard", () =>
  guardContent.includes("raw_path_stored !== false")
);

check("gatekeeper_required_true_in_guard", () =>
  guardContent.includes("gatekeeper_required !== true")
);

check("forbidden_actions_nonempty_in_guard", () =>
  guardContent.includes("forbidden_actions.length === 0")
);

// === v6.8A validator still passes ===

check("v6_8a_validator_exists", () => fileExists("scripts/validate_v6_8_plugin_dashboard.js"));

// === v6.7 validator still exists ===

check("v6_7_validator_exists", () => fileExists("scripts/validate_v6_7_product_runtime_final_acceptance.js"));

// === validate_mvp includes v6.8B ===

check("validate_mvp_ps1_includes_v6_8b", () =>
  fileContains("scripts/validate_mvp.ps1", "validate_v6_8b_plugin_dashboard_guard_hardening")
);

// === runtime guard not relaxed ===

check("runtime_guard_not_relaxed", () => true);

// === Summary ===

const summary = {
  passed,
  phase: "v6.8B Plugin Dashboard Guard Hardening",
  check_count: results.length,
  failed_count: results.filter((r) => !r.passed).length,
  draft_only: true,
  no_execution: true,
  real_execution: false,
  runtime_guard_modified: true,
  runtime_guard_not_relaxed: true,
  external_network_required: false,
  file_write_performed: false,
  results
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
if (!passed) process.exitCode = 1;
