const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), "utf8"); }
function assert(cond, msg) { if (!cond) throw new Error(msg); }

const results = [];

// 1. Design doc exists
assert(exists("docs/241_v6_5_review_console_product_shell.md"), "docs/241 must exist");
results.push({ check: "doc_exists", passed: true });

// 2-6. HTML contains product shell layout sections
const html = read("review_console/runtime_prototype/index.html");
assert(/shell-left-nav/.test(html), "index.html must contain left-nav");
results.push({ check: "left_nav_present", passed: true });
assert(/top-workflow/.test(html), "index.html must contain top-workflow");
results.push({ check: "top_workflow_present", passed: true });
assert(/main-review-workspace/.test(html), "index.html must contain main-review-workspace");
results.push({ check: "main_review_workspace_present", passed: true });
assert(/shell-right-rail/.test(html), "index.html must contain right-decision-rail");
results.push({ check: "right_decision_rail_present", passed: true });
assert(/bottom-operations-grid/.test(html), "index.html must contain bottom-operations-grid");
results.push({ check: "bottom_operations_grid_present", passed: true });

// 7. app.js still has render function (no regression)
const app = read("review_console/runtime_prototype/app.js");
assert(/function render\(\)/.test(app), "app.js must contain render()");
results.push({ check: "render_function_present", passed: true });

// 8. styles.css contains product shell layout classes
const css = read("review_console/runtime_prototype/styles.css");
assert(/shell-left-nav/.test(css), "styles.css must contain shell-left-nav");
assert(/shell-right-rail/.test(css), "styles.css must contain shell-right-rail");
assert(/app-shell-body/.test(css), "styles.css must contain app-shell-body");
assert(/top-workflow/.test(css), "styles.css must contain top-workflow");
assert(/bottom-operations-grid/.test(css), "styles.css must contain bottom-operations-grid");
results.push({ check: "product_shell_css", passed: true });

// 9. runtime_guard.js not relaxed — verify key guard checks still present
const guard = read("review_console/runtime_prototype/runtime_guard.js");
assert(/draftIsSafe/.test(guard), "guard must still contain draftIsSafe");
assert(/assertDraftSafe/.test(guard), "guard must still contain assertDraftSafe");
assert(/v6ProductRuntimeIsSafe/.test(guard), "guard must still contain v6ProductRuntimeIsSafe");
assert(/v6MemoryQueueIsSafe/.test(guard), "guard must still contain v6MemoryQueueIsSafe");
results.push({ check: "runtime_guard_not_relaxed", passed: true });

// 10-14. All v6 validators still load and pass
const v6_0 = require("./validate_v6_0_product_runtime_kickoff");
results.push({ check: "v6_0_validator_passes", passed: true });
const v6_1 = require("./validate_v6_1_task_panel_interaction");
results.push({ check: "v6_1_validator_passes", passed: true });
const v6_2 = require("./validate_v6_2_asset_index_interaction");
results.push({ check: "v6_2_validator_passes", passed: true });
const v6_3 = require("./validate_v6_3_session_store_interaction");
results.push({ check: "v6_3_validator_passes", passed: true });
const v6_4 = require("./validate_v6_4_memory_queue_interaction");
results.push({ check: "v6_4_validator_passes", passed: true });

// 15. Runtime suite still loads
const suite = require("./validate_runtime_prototype_suite");
results.push({ check: "runtime_suite_loads", passed: true });

// 16. MVP validator references present
const mvp = read("scripts/validate_mvp.ps1");
assert(/validate_v6_5/.test(mvp), "validate_mvp.ps1 must reference v6.5 validator");
results.push({ check: "mvp_references_v6_5", passed: true });

// 17-18. No forbidden APIs or patterns
const allChanged = [app, html, css, guard].join("\n");
const forbidden = [/localStorage/, /sessionStorage/, /IndexedDB/, /\bfs\b/, /\bfetch\b/, /XMLHttpRequest/, /child_process/];
for (const p of forbidden) {
  assert(!p.test(allChanged), "Forbidden API not found: " + p.source);
}
results.push({ check: "no_forbidden_apis", passed: true });

// No positive secret/token/cookie/endpoint leaks
const forbiddenTerms = [/endpoint\s*[:=]\s*['"][^'"]+['"]/, /secret\s*[:=]\s*['"][^'"]+['"]/, /token\s*[:=]\s*['"][^'"]+['"]/, /cookie\s*[:=]\s*['"][^'"]+['"]/];
for (const p of forbiddenTerms) {
  assert(!p.test(allChanged), "Forbidden term not found: " + p.source);
}
results.push({ check: "no_forbidden_terms", passed: true });

const summary = {
  passed: true,
  phase: "v6.5 Review Console Product Shell",
  check_count: results.length,
  failed_count: 0,
  draft_only: true,
  no_execution: true,
  real_execution: false,
  external_network_required: false,
  file_write_performed: false,
  results
};

process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
