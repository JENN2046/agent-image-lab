const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), "utf8"); }
function assert(cond, msg) { if (!cond) throw new Error(msg); }

const results = [];

// 1. Design doc exists
assert(exists("docs/239_v6_3_session_store_interaction.md"), "docs/239 must exist");
results.push({ check: "doc_exists", passed: true });

// 2. app.js contains Session Store interaction controls
const app = read("review_console/runtime_prototype/app.js");
assert(/v6SessionTaskIdInput/.test(app), "v6SessionTaskIdInput must be in app.js");
assert(/v6SessionAssetRefsInput/.test(app), "v6SessionAssetRefsInput must be in app.js");
assert(/v6SessionImportStatusSelect/.test(app), "v6SessionImportStatusSelect must be in app.js");
assert(/v6SessionReasonInput/.test(app), "v6SessionReasonInput must be in app.js");
assert(/v6SessionRestoreCheck/.test(app), "v6SessionRestoreCheck must be in app.js");
assert(/v6SessionTaskIdRead/.test(app), "v6SessionTaskIdRead must be in app.js");
assert(/v6SessionAssetRefsRead/.test(app), "v6SessionAssetRefsRead must be in app.js");
assert(/v6SessionImportStatusRead/.test(app), "v6SessionImportStatusRead must be in app.js");
assert(/v6SessionVisibleCount/.test(app), "v6SessionVisibleCount must be in app.js");
results.push({ check: "session_store_in_app_js", passed: true });

// 3. index.html contains Session Store interactive DOM
const html = read("review_console/runtime_prototype/index.html");
assert(/v6SessionTaskIdInput/.test(html), "v6SessionTaskIdInput must be in index.html");
assert(/v6SessionAssetRefsInput/.test(html), "v6SessionAssetRefsInput must be in index.html");
assert(/v6SessionImportStatusSelect/.test(html), "v6SessionImportStatusSelect must be in index.html");
assert(/v6SessionReasonInput/.test(html), "v6SessionReasonInput must be in index.html");
assert(/v6SessionRestoreCheck/.test(html), "v6SessionRestoreCheck must be in index.html");
assert(/v6SessionListCount/.test(html), "v6SessionListCount must be in index.html");
assert(/v6SessionTaskIdRead/.test(html), "v6SessionTaskIdRead must be in index.html");
assert(/v6SessionAssetRefsRead/.test(html), "v6SessionAssetRefsRead must be in index.html");
assert(/v6SessionImportStatusRead/.test(html), "v6SessionImportStatusRead must be in index.html");
assert(/v6SessionVisibleCount/.test(html), "v6SessionVisibleCount must be in index.html");
results.push({ check: "session_store_in_html", passed: true });

// 4. runtime_guard.js contains v6SessionStoreIsSafe
const guard = read("review_console/runtime_prototype/runtime_guard.js");
assert(/v6SessionStoreIsSafe/.test(guard), "v6SessionStoreIsSafe must be in runtime_guard.js");
assert(/VALID_IMPORT_PREVIEW_STATUSES/.test(guard), "VALID_IMPORT_PREVIEW_STATUSES must be in runtime_guard.js");
assert(/not_loaded/.test(guard), "import preview enum must include not_loaded");
assert(/valid/.test(guard), "import preview enum must include valid");
assert(/stale/.test(guard), "import preview enum must include stale");
assert(/tampered/.test(guard), "import preview enum must include tampered");
assert(/incompatible/.test(guard), "import preview enum must include incompatible");
results.push({ check: "session_store_guard", passed: true });

// 5. FIELD_MAPPING.md records session_store field mapping
const fm = read("review_console/runtime_prototype/FIELD_MAPPING.md");
assert(/session_store/i.test(fm), "FIELD_MAPPING must document session_store");
results.push({ check: "field_mapping", passed: true });

// 6. Smoke test covers session_store element registrations
const smoke = read("scripts/validate_runtime_prototype_smoke.js");
assert(/v6SessionTaskIdInput/.test(smoke), "Smoke must register v6SessionTaskIdInput");
assert(/v6SessionAssetRefsInput/.test(smoke), "Smoke must register v6SessionAssetRefsInput");
assert(/v6SessionImportStatusSelect/.test(smoke), "Smoke must register v6SessionImportStatusSelect");
assert(/v6SessionRestoreCheck/.test(smoke), "Smoke must register v6SessionRestoreCheck");
results.push({ check: "smoke_elements", passed: true });

// 7. Smoke test covers linked_task_id toggle
assert(/v6SessionTaskIdInput.*value.*test-session-task/.test(smoke), "Smoke must toggle linked_task_id");
results.push({ check: "smoke_linked_task_id", passed: true });

// 8. Smoke test covers import_preview_status toggle
assert(/v6SessionImportStatusSelect.*value.*valid/.test(smoke), "Smoke must toggle import_preview status");
results.push({ check: "smoke_import_status", passed: true });

// 9. Smoke test covers restore_candidate toggle
assert(/v6SessionRestoreCheck.*checked.*true/.test(smoke), "Smoke must toggle restore_candidate");
results.push({ check: "smoke_restore_candidate", passed: true });

// 10. draft_only=true
const appContent = read("review_console/runtime_prototype/app.js");
assert(/draft_only.*true/.test(appContent), "draft_only must be true in app.js");
const guContent = read("review_console/runtime_prototype/runtime_guard.js");
assert(/draft_only\s*!==\s*true/.test(guContent), "guard must check draft_only===true");
results.push({ check: "draft_only", passed: true });

// 11. side_effects_performed=false
assert(/side_effects_performed\s*!==\s*false/.test(guContent), "guard must check side_effects_performed===false");
results.push({ check: "side_effects_performed", passed: true });

// 12. raw_payload_stored=false
assert(/raw_payload_stored\s*!==\s*false/.test(guContent), "guard must check raw_payload_stored===false");
results.push({ check: "raw_payload_stored", passed: true });

// 13. disk_write_performed=false
assert(/disk_write_performed\s*!==\s*false/.test(guContent), "guard must check disk_write_performed===false");
results.push({ check: "disk_write_performed", passed: true });

// 14. No forbidden flags in session_store guard
assert(/vcp_plugin_called.*false/.test(guContent), "guard must check vcp_plugin_called");
assert(/api_called.*false/.test(guContent), "guard must check api_called");
assert(/daily_note_called.*false/.test(guContent), "guard must check daily_note_called");
results.push({ check: "no_external_flags", passed: true });

// 15. No endpoint/secret/token/cookie/private path positive leak
const sessionStoreRelated = [
  app.match(/session_store[\s\S]{0,4000}/)?.[0] || "",
  html.match(/v6SessionStore[\s\S]{0,2000}/)?.[0] || "",
  guContent.match(/v6SessionStoreIsSafe[\s\S]{0,2000}/)?.[0] || ""
].join("\n");
const forbidden = [/endpoint\s*[:=]\s*['"]?\w/, /secret\s*[:=]\s*['"]?\w/, /token\s*[:=]\s*['"]?\w/, /cookie\s*[:=]\s*['"]?\w/];
for (const p of forbidden) {
  assert(!p.test(sessionStoreRelated), "Forbidden term not found in session_store related code: " + p.source);
}
results.push({ check: "no_forbidden_terms", passed: true });

// 16. v6.2 validator still loads
const v6validator = require("./validate_v6_2_asset_index_interaction");
results.push({ check: "v6_2_validator_still_loaded", passed: true });

const summary = {
  passed: true,
  phase: "v6.3 Session Store Interaction",
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
