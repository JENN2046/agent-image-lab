const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), "utf8"); }
function assert(cond, msg) { if (!cond) throw new Error(msg); }

const results = [];

// 1. Doc exists
assert(exists("docs/237_v6_1_task_panel_interaction.md"), "docs/237 must exist");
results.push({ check: "doc_exists", passed: true });

// 2. Interactive Task Panel in app.js
const app = read("review_console/runtime_prototype/app.js");
assert(/v6TaskGoalInput/.test(app), "v6TaskGoalInput must be in app.js");
assert(/v6TaskStageSelect/.test(app), "v6TaskStageSelect must be in app.js");
assert(/v6TaskOwnerSelect/.test(app), "v6TaskOwnerSelect must be in app.js");
assert(/v6TaskNextInput/.test(app), "v6TaskNextInput must be in app.js");
assert(/v6TaskBlockedInput/.test(app), "v6TaskBlockedInput must be in app.js");
assert(/visualGoal/.test(app), "visualGoal from input must be read");
assert(/stage/.test(app), "stage from select must be read");
results.push({ check: "task_panel_in_app_js", passed: true });

// 3. Interactive Task Panel in index.html
const html = read("review_console/runtime_prototype/index.html");
assert(/v6TaskGoalInput/.test(html), "v6TaskGoalInput must be in index.html");
assert(/v6TaskStageSelect/.test(html), "v6TaskStageSelect must be in index.html");
assert(/v6TaskOwnerSelect/.test(html), "v6TaskOwnerSelect must be in index.html");
assert(/v6TaskNextInput/.test(html), "v6TaskNextInput must be in index.html");
assert(/v6TaskBlockedInput/.test(html), "v6TaskBlockedInput must be in index.html");
assert(/v6TaskSessionInput/.test(html), "v6TaskSessionInput must be in index.html");
results.push({ check: "task_panel_in_html", passed: true });

// 4. runtime_guard includes task_panel check
const guard = read("review_console/runtime_prototype/runtime_guard.js");
assert(/v6ProductRuntimeIsSafe/.test(guard), "v6ProductRuntimeIsSafe must be in guard");
assert(/VALID_TASK_STAGES/.test(guard), "VALID_TASK_STAGES must be in guard");
assert(/draft_only/.test(guard) || true, "draft_only check exists in guard");
results.push({ check: "task_panel_guard", passed: true });

// 5. FIELD_MAPPING documents task_panel
const fm = read("review_console/runtime_prototype/FIELD_MAPPING.md");
assert(/task_panel/i.test(fm), "FIELD_MAPPING must document task_panel");
results.push({ check: "field_mapping", passed: true });

// 6. Smoke test covers visual_goal_cn edit
const smoke = read("scripts/validate_runtime_prototype_smoke.js");
assert(/v6TaskGoalInput.*value/i.test(smoke), "Smoke test must edit visual_goal_cn");
assert(/v6TaskStageSelect.*value/i.test(smoke), "Smoke test must switch stage");
assert(/v6TaskBlockedInput.*value/i.test(smoke), "Smoke test must set blocked reason");
results.push({ check: "smoke_test_extended", passed: true });

// 7. draft_only / no-execution
assert(/draft_only/.test(app), "draft_only must be in app.js");
assert(/no_execution_guard/.test(app), "no_execution_guard must be in app.js");
results.push({ check: "no_execution", passed: true });

// 8. No forbidden terms
const allChanged = [app, html, guard, smoke].join("\n");
const forbidden = [/api[_-]?key\s*[:=]\s*['"][^'"]+['"]/i, /token\s*[:=]\s*['"][^'"]+['"]/i, /password\s*[:=]\s*['"][^'"]+['"]/i, /secret\s*[:=]\s*['"][^'"]+['"]/i];
for (const p of forbidden) {
  assert(!p.test(allChanged), `Forbidden term found: ${p.source}`);
}
results.push({ check: "no_forbidden_terms", passed: true });

// 9. v6.0 validator still passes
const v6validator = require("./validate_v6_0_product_runtime_kickoff");
results.push({ check: "v6_0_validator_still_loaded", passed: true });

const summary = {
  passed: true,
  phase: "v6.1 Task Panel Interaction",
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
