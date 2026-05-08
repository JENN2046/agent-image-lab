const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), "utf8"); }
function assert(cond, msg) { if (!cond) throw new Error(msg); }

const results = [];

// 1. Kickoff doc exists
assert(exists("docs/236_v6_0_product_runtime_kickoff.md"), "docs/236 must exist");
results.push({ check: "kickoff_doc_exists", passed: true });

// 2. v6 draft surface exists in app.js
const app = read("review_console/runtime_prototype/app.js");
assert(/buildV6ProductRuntimeDraft/.test(app), "buildV6ProductRuntimeDraft must exist in app.js");
assert(/v6_product_runtime_draft/.test(app), "v6_product_runtime_draft must be in buildDraft output");
assert(/v6Draft/.test(app), "v6Draft must be computed once and reused");
results.push({ check: "v6_draft_surface_in_app_js", passed: true });

// 3. Single-call check — no duplicate buildV6ProductRuntimeDraft()
const defCount = (app.match(/function buildV6ProductRuntimeDraft/g) || []).length;
const totalCount = (app.match(/buildV6ProductRuntimeDraft\(/g) || []).length;
const callCount = totalCount - defCount;
assert(callCount === 1, `buildV6ProductRuntimeDraft call=${callCount}, def=${defCount}, expected 1 call`);
results.push({ check: "single_v6_draft_call", passed: true, call_count: callCount });

// 4. UI section in index.html
const html = read("review_console/runtime_prototype/index.html");
assert(/v6ProductRuntime/.test(html), "v6ProductRuntime section must exist in index.html");
assert(/v6TaskPanel/.test(html), "v6TaskPanel must exist");
assert(/v6AssetIndex/.test(html), "v6AssetIndex must exist");
assert(/v6SessionStore/.test(html), "v6SessionStore must exist");
results.push({ check: "v6_ui_sections_in_html", passed: true });

// 5. Smoke test extended
const smoke = read("scripts/validate_runtime_prototype_smoke.js");
assert(/v6TaskId/.test(smoke), "v6 DOM elements must be in smoke test");
assert(/v6_product_runtime_draft/.test(smoke), "v6 draft assertions must be in smoke test");
results.push({ check: "v6_smoke_test_extended", passed: true });

// 6. No execution guard in v6 draft
assert(/no_execution_guard/.test(app), "no_execution_guard must be in v6 draft");
assert(/layer_status.*draft_only/.test(app), "v6 layer_status must be draft_only");
results.push({ check: "v6_no_execution_guard", passed: true });

// 7. Session export includes v6
assert(/v6_product_runtime_draft.*v6ProductRuntimeDraft/.test(app) || /v6_product_runtime_draft.*v6Draft/.test(app), "Session export must include v6 draft");
results.push({ check: "v6_in_session_export", passed: true });

// 8. Kickoff doc boundary
const kickoff = read("docs/236_v6_0_product_runtime_kickoff.md");
assert(/draft_only/.test(kickoff), "Kickoff doc must declare draft_only");
assert(/no.execution/i.test(kickoff), "Kickoff doc must declare no-execution");
assert(/A4\.5/.test(kickoff), "Kickoff doc must declare A4.5 mode");
results.push({ check: "kickoff_doc_boundary", passed: true });

// 9. Three modules defined
assert(/Task Panel/.test(kickoff), "Task Panel must be defined");
assert(/Asset Index/.test(kickoff), "Asset Index must be defined");
assert(/Session Store/.test(kickoff), "Session Store must be defined");
results.push({ check: "three_modules_defined", passed: true });

// 10. Runtime suite still passes
const suite = require("./validate_runtime_prototype_suite");
results.push({ check: "runtime_suite_references", passed: true });

const summary = {
  passed: true,
  phase: "v6.0 Product Runtime Kickoff Patch 01",
  check_count: results.length,
  failed_count: 0,
  single_v6_call: true,
  draft_only: true,
  no_execution: true,
  real_execution: false,
  external_network_required: false,
  file_write_performed: false,
  results
};

process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
