const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), "utf8"); }
function assert(cond, msg) { if (!cond) throw new Error(msg); }

const results = [];

// 1. Design doc exists
assert(exists("docs/242_v6_6_product_shell_qa_visual_polish.md"), "docs/242 must exist");
results.push({ check: "v6_6_doc_exists", passed: true });

// 2-6. HTML contains 5 product shell layout regions
const html = read("review_console/runtime_prototype/index.html");
assert(/shell-left-nav/.test(html), "index.html must contain shell-left-nav");
results.push({ check: "shell_left_nav_present", passed: true });
assert(/top-workflow/.test(html), "index.html must contain top-workflow");
results.push({ check: "top_workflow_present", passed: true });
assert(/main-review-workspace/.test(html), "index.html must contain main-review-workspace");
results.push({ check: "main_review_workspace_present", passed: true });
assert(/shell-right-rail/.test(html), "index.html must contain shell-right-rail");
results.push({ check: "shell_right_rail_present", passed: true });
assert(/bottom-operations-grid/.test(html), "index.html must contain bottom-operations-grid");
results.push({ check: "bottom_operations_grid_present", passed: true });

// 7. v6 Product Runtime section preserved
assert(/v6ProductRuntime/.test(html), "index.html must retain v6ProductRuntime");
results.push({ check: "v6_product_runtime_section_present", passed: true });

// 8-11. v6 DOM IDs preserved
assert(/v6TaskPanel/.test(html), "index.html must retain v6TaskPanel");
results.push({ check: "v6_task_panel_present", passed: true });
assert(/v6AssetIndex/.test(html), "index.html must retain v6AssetIndex");
results.push({ check: "v6_asset_index_present", passed: true });
assert(/v6SessionStore/.test(html), "index.html must retain v6SessionStore");
results.push({ check: "v6_session_store_present", passed: true });
assert(/v6MemoryQueue/.test(html), "index.html must retain v6MemoryQueue");
results.push({ check: "v6_memory_queue_present", passed: true });

// 12. app.js contains decision rail render / projection
const app = read("review_console/runtime_prototype/app.js");
assert(/summarySessionStatus/.test(app), "app.js must project decision rail fields");
assert(/summaryScoreBand/.test(app), "app.js must project score band");
assert(/summaryMemoryStatus/.test(app), "app.js must project memory status");
assert(/verdictTitle/.test(app), "app.js must project verdict");
assert(/v6MQWriteAuthorizedRead/.test(app), "app.js must project write_authorized");
assert(/v6MQWritePerformedRead/.test(app), "app.js must project write_performed");
results.push({ check: "decision_rail_projection_present", passed: true });

// 13-14. styles.css contains product shell layout classes
const css = read("review_console/runtime_prototype/styles.css");
assert(/shell-left-nav/.test(css), "styles.css must contain shell-left-nav");
assert(/shell-right-rail/.test(css), "styles.css must contain shell-right-rail");
assert(/app-shell-body/.test(css), "styles.css must contain app-shell-body");
assert(/top-workflow/.test(css), "styles.css must contain top-workflow");
assert(/bottom-operations-grid/.test(css), "styles.css must contain bottom-operations-grid");
results.push({ check: "product_shell_css_layout", passed: true });

// Check responsive shell layout
assert(/@media\s*\(/.test(css), "styles.css must contain responsive breakpoints");
results.push({ check: "responsive_shell_layout", passed: true });

// Check left nav / top workflow / right rail styles
assert(/\.workflow-stepper/.test(css), "styles.css must contain workflow stepper styles");
assert(/\.nav-list/.test(css), "styles.css must contain left nav styles");
assert(/\.rail-card/.test(css), "styles.css must contain right rail styles");
results.push({ check: "nav_workflow_rail_styles", passed: true });

// 15. runtime_guard.js not relaxed
const guard = read("review_console/runtime_prototype/runtime_guard.js");
assert(/draftIsSafe/.test(guard), "guard must still contain draftIsSafe");
assert(/assertDraftSafe/.test(guard), "guard must still contain assertDraftSafe");
assert(/v6ProductRuntimeIsSafe/.test(guard), "guard must still contain v6ProductRuntimeIsSafe");
assert(/v6MemoryQueueIsSafe/.test(guard), "guard must still contain v6MemoryQueueIsSafe");
assert(/v6AssetIndexIsSafe/.test(guard), "guard must still contain v6AssetIndexIsSafe");
assert(/v6SessionStoreIsSafe/.test(guard), "guard must still contain v6SessionStoreIsSafe");
results.push({ check: "runtime_guard_not_relaxed", passed: true });

// 16-23. All v6 validators still load
const v6_0 = require("./validate_v6_0_product_runtime_kickoff");
results.push({ check: "v6_0_validator_loads", passed: true });
const v6_1 = require("./validate_v6_1_task_panel_interaction");
results.push({ check: "v6_1_validator_loads", passed: true });
const v6_2 = require("./validate_v6_2_asset_index_interaction");
results.push({ check: "v6_2_validator_loads", passed: true });
const v6_3 = require("./validate_v6_3_session_store_interaction");
results.push({ check: "v6_3_validator_loads", passed: true });
const v6_4 = require("./validate_v6_4_memory_queue_interaction");
results.push({ check: "v6_4_validator_loads", passed: true });
const v6_5 = require("./validate_v6_5_review_console_product_shell");
results.push({ check: "v6_5_validator_loads", passed: true });

// 24. No forbidden APIs or patterns
const allChanged = [app, html, css, guard].join("\n");
const forbidden = [/localStorage/, /sessionStorage/, /IndexedDB/, /\bfs\b/, /\bfetch\b/, /XMLHttpRequest/, /child_process/];
for (const p of forbidden) {
  assert(!p.test(allChanged), "Forbidden API not found: " + p.source);
}
results.push({ check: "no_forbidden_apis", passed: true });

// 25. No plugin/API/DailyNote/VCP memory/image action flags in guard
const guardFlags = [
  /api_called:\s*true/,
  /daily_note_called:\s*true/,
  /vcp_plugin_called:\s*true/,
  /disk_write_performed:\s*true/,
  /image_file_created:\s*true/
];
for (const p of guardFlags) {
  assert(!p.test(allChanged), "No dirty guard flag found: " + p.source);
}
results.push({ check: "no_dirty_guard_flags", passed: true });

// No positive secret/token/cookie/endpoint leaks
const forbiddenTerms = [
  /endpoint\s*[:=]\s*['"][^'"]+['"]/,
  /secret\s*[:=]\s*['"][^'"]+['"]/,
  /token\s*[:=]\s*['"][^'"]+['"]/,
  /cookie\s*[:=]\s*['"][^'"]+['"]/
];
for (const p of forbiddenTerms) {
  assert(!p.test(allChanged), "Forbidden term not found: " + p.source);
}
results.push({ check: "no_forbidden_terms", passed: true });

const summary = {
  passed: true,
  phase: "v6.6 Product Shell QA + Visual Polish",
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
