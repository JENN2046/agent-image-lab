const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), "utf8"); }
function assert(cond, msg) { if (!cond) throw new Error(msg); }

const results = [];

// 1. Design doc exists
assert(exists("docs/238_v6_2_asset_index_interaction.md"), "docs/238 must exist");
results.push({ check: "doc_exists", passed: true });

// 2. app.js contains Asset Index interaction builder / renderer / state update
const app = read("review_console/runtime_prototype/app.js");
assert(/v6AssetRefInput/.test(app), "v6AssetRefInput must be in app.js");
assert(/v6AssetRefRead/.test(app), "v6AssetRefRead must be in app.js");
assert(/v6AssetFilterSelect/.test(app), "v6AssetFilterSelect must be in app.js");
assert(/v6AssetStatusSelect/.test(app), "v6AssetStatusSelect must be in app.js");
assert(/v6AssetDecisionSelect/.test(app), "v6AssetDecisionSelect must be in app.js");
assert(/v6AssetMemorySelect/.test(app), "v6AssetMemorySelect must be in app.js");
assert(/v6AssetVisibleCount/.test(app), "v6AssetVisibleCount must be in app.js");
results.push({ check: "asset_index_in_app_js", passed: true });

// 3. index.html contains Asset Index input/select/filter DOM
const html = read("review_console/runtime_prototype/index.html");
assert(/v6AssetRefInput/.test(html), "v6AssetRefInput must be in index.html");
assert(/v6AssetHashInput/.test(html), "v6AssetHashInput must be in index.html");
assert(/v6AssetStatusSelect/.test(html), "v6AssetStatusSelect must be in index.html");
assert(/v6AssetScoreInput/.test(html), "v6AssetScoreInput must be in index.html");
assert(/v6AssetDecisionSelect/.test(html), "v6AssetDecisionSelect must be in index.html");
assert(/v6AssetMemorySelect/.test(html), "v6AssetMemorySelect must be in index.html");
assert(/v6AssetFilterSelect/.test(html), "v6AssetFilterSelect must be in index.html");
assert(/v6AssetFilterCount/.test(html), "v6AssetFilterCount must be in index.html");
results.push({ check: "asset_index_in_html", passed: true });

// 4. runtime_guard.js contains v6AssetIndexIsSafe or equivalent
const guard = read("review_console/runtime_prototype/runtime_guard.js");
assert(/v6AssetIndexIsSafe/.test(guard), "v6AssetIndexIsSafe must be in runtime_guard.js");
assert(/VALID_ASSET_STATUSES/.test(guard), "VALID_ASSET_STATUSES must be in runtime_guard.js");
assert(/VALID_HUMAN_DECISIONS/.test(guard), "VALID_HUMAN_DECISIONS must be in runtime_guard.js");
assert(/VALID_MEMORY_SUITABILITIES/.test(guard), "VALID_MEMORY_SUITABILITIES must be in runtime_guard.js");
assert(/VALID_FILTER_STATUSES/.test(guard), "VALID_FILTER_STATUSES must be in runtime_guard.js");
results.push({ check: "asset_index_guard", passed: true });

// 5. FIELD_MAPPING.md records asset_index field mapping
const fm = read("review_console/runtime_prototype/FIELD_MAPPING.md");
assert(/asset_index/i.test(fm), "FIELD_MAPPING must document asset_index");
results.push({ check: "field_mapping", passed: true });

// 6. Smoke test covers asset_status switch
const smoke = read("scripts/validate_runtime_prototype_smoke.js");
assert(/v6AssetStatusSelect.*value.*accepted_candidate/.test(smoke), "Smoke must toggle asset_status");
results.push({ check: "smoke_asset_status", passed: true });

// 7. Smoke test covers human_decision switch
assert(/v6AssetDecisionSelect.*value.*accepted/.test(smoke), "Smoke must toggle human_decision");
results.push({ check: "smoke_human_decision", passed: true });

// 8. Smoke test covers memory_suitability switch
assert(/v6AssetMemorySelect.*value.*suitable/.test(smoke), "Smoke must toggle memory_suitability");
results.push({ check: "smoke_memory_suitability", passed: true });

// 9. Smoke test covers filter status
assert(/v6AssetFilterSelect.*value.*accepted_candidate/.test(smoke), "Smoke must toggle filter status");
results.push({ check: "smoke_filter_status", passed: true });

// 10. draft_only=true
const appContent = read("review_console/runtime_prototype/app.js");
assert(/draft_only.*true/.test(appContent), "draft_only must be true in app.js");
const guContent = read("review_console/runtime_prototype/runtime_guard.js");
assert(/draft_only\s*!==\s*true/.test(guContent), "guard must check draft_only===true");
results.push({ check: "draft_only", passed: true });

// 11. side_effects_performed=false
assert(/side_effects_performed\s*!==\s*false/.test(guContent), "guard must check side_effects_performed===false");
results.push({ check: "side_effects_performed", passed: true });

// 12. binary_stored=false
assert(/binary_stored\s*!==\s*false/.test(guContent), "guard must check binary_stored===false");
results.push({ check: "binary_stored", passed: true });

// 13. raw_path_stored=false
assert(/raw_path_stored\s*!==\s*false/.test(guContent), "guard must check raw_path_stored===false");
results.push({ check: "raw_path_stored", passed: true });

// 14. No plugin/API/DailyNote/VCP memory/image flags in asset_index
assert(/vcp_plugin_called.*false/.test(guContent), "guard must check vcp_plugin_called");
assert(/api_called.*false/.test(guContent), "guard must check api_called");
assert(/daily_note_called.*false/.test(guContent), "guard must check daily_note_called");
results.push({ check: "no_external_flags", passed: true });

// 15. No endpoint/secret/token/cookie/private path positive leak in asset_index related code
const assetIndexRelated = [
  app.match(/asset_index[\s\S]{0,4000}/)?.[0] || "",
  html.match(/v6AssetRefInput[\s\S]{0,2000}/)?.[0] || "",
  guContent.match(/v6AssetIndexIsSafe[\s\S]{0,2000}/)?.[0] || ""
].join("\n");
const forbidden = [/endpoint\s*[:=]\s*['"]?\w/, /secret\s*[:=]\s*['"]?\w/, /token\s*[:=]\s*['"]?\w/, /cookie\s*[:=]\s*['"]?\w/];
for (const p of forbidden) {
  assert(!p.test(assetIndexRelated), `Forbidden term not found in asset_index related code: ${p.source}`);
}
results.push({ check: "no_forbidden_terms", passed: true });

// 16. v6.1 validator still passes
const v6validator = require("./validate_v6_1_task_panel_interaction");
results.push({ check: "v6_1_validator_still_loaded", passed: true });

const summary = {
  passed: true,
  phase: "v6.2 Asset Index Interaction",
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
