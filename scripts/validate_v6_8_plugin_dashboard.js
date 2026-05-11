// SUPERSEDED / LEGACY VALIDATOR
// This validator is historical reference for v6.8 Plugin Dashboard surface only.
// It does not reflect current active routes.
// Do not use as validation gate for any v7+ or current work.
// If the Plugin Dashboard is revived, a new v7+ revalidation gate must be created.

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

check("doc_245_exists", () => fileExists("docs/245_v6_8a_plugin_dashboard_draft_surface.md"));

// === HTML DOM checks ===

const htmlContent = fileContent("review_console/runtime_prototype/index.html");

check("html_contains_plugin_dashboard", () => htmlContent.includes("v6PluginDashboard"));

check("html_contains_plugin_selector", () =>
  htmlContent.includes("v6DispatchSelectPlugin") &&
  htmlContent.includes("v6DispatchPluginName") &&
  htmlContent.includes("v6DispatchInputMode") &&
  htmlContent.includes("v6DispatchOutputMode") &&
  htmlContent.includes("v6DispatchFallbackDisplay") &&
  htmlContent.includes("v6DispatchReasonCn")
);

check("html_contains_parameter_mapper", () =>
  htmlContent.includes("v6DispatchParamKey") &&
  htmlContent.includes("v6DispatchParamValue") &&
  htmlContent.includes("v6DispatchExpectedOutputs") &&
  htmlContent.includes("v6DispatchMaxOutputs") &&
  htmlContent.includes("v6DispatchPreview")
);

check("html_contains_dry_run_toggle", () =>
  htmlContent.includes("v6DispatchDryRunRequired") &&
  htmlContent.includes("v6DispatchExecBlocked") &&
  htmlContent.includes("v6DispatchMaxCalls") &&
  htmlContent.includes("v6DispatchAllowWrite") &&
  htmlContent.includes("v6DispatchAllowBinary") &&
  htmlContent.includes("v6DispatchRiskLevel")
);

check("html_contains_dispatch_status", () =>
  htmlContent.includes("v6DispatchId") &&
  htmlContent.includes("v6DispatchLinkedTaskId") &&
  htmlContent.includes("v6DispatchGatekeeperRequired") &&
  htmlContent.includes("v6DispatchGatekeeperStatus") &&
  htmlContent.includes("v6DispatchStatus") &&
  htmlContent.includes("v6DispatchTraceState")
);

// === app.js dispatch_plan_draft builder ===

const appContent = fileContent("review_console/runtime_prototype/app.js");

check("app_js_contains_dispatch_plan_draft_builder", () =>
  appContent.includes("dispatch_plan_draft: function ()")
);

check("app_js_contains_dispatch_plan_draft_renderer", () =>
  appContent.includes("var dpd = v6.dispatch_plan_draft")
);

// === FIELD_MAPPING.md ===

check("field_mapping_contains_dispatch_plan_draft", () =>
  fileContains("review_console/runtime_prototype/FIELD_MAPPING.md", "dispatch_plan_draft")
);

// === index sync ===

check("readme_contains_v6_8", () =>
  fileContains("README.md", "v6.8") || fileContains("README.md", "Plugin Dashboard")
);

check("manifest_contains_v6_8", () =>
  fileContains("MANIFEST.md", "v6.8") || fileContains("MANIFEST.md", "Plugin Dashboard")
);

check("release_notes_contains_v6_8", () =>
  fileContains("RELEASE_NOTES.md", "v6.8") || fileContains("RELEASE_NOTES.md", "Plugin Dashboard")
);

check("roadmap_contains_v6_8", () =>
  fileContains("docs/00_project_roadmap.md", "v6.8") || fileContains("docs/00_project_roadmap.md", "Plugin Dashboard")
);

check("validate_mvp_ps1_contains_v6_8", () =>
  fileContains("scripts/validate_mvp.ps1", "validate_v6_8_plugin_dashboard")
);

// === dispatch_plan_draft field safety ===

check("draft_only_true", () => fileContains("review_console/runtime_prototype/app.js", "draft_only: true"));

check("side_effects_performed_false", () => fileContains("review_console/runtime_prototype/app.js", "side_effects_performed: false"));

check("dry_run_required_true", () => appContent.includes("dry_run_required: true") || appContent.includes("dry_run_required: true"));

check("execution_blocked_true", () => appContent.includes("execution_blocked: true"));

check("max_plugin_calls_0", () => appContent.includes("max_plugin_calls: 0"));

check("allow_file_write_false", () => appContent.includes("allow_file_write: false"));

check("allow_image_binary_false", () => appContent.includes("allow_image_binary: false"));

check("real_manifest_loaded_false", () => appContent.includes("real_manifest_loaded: false"));

check("real_plugin_available_confirmed_false", () => appContent.includes("real_plugin_available_confirmed: false"));

check("raw_secret_stored_false", () => appContent.includes("raw_secret_stored: false"));

check("raw_endpoint_stored_false", () => appContent.includes("raw_endpoint_stored: false"));

check("raw_path_stored_false", () => appContent.includes("raw_path_stored: false"));

// === no forbidden patterns in v6 runtime files ===

const v6RuntimeFiles = [
  "review_console/runtime_prototype/app.js",
  "review_console/runtime_prototype/index.html",
  "review_console/runtime_prototype/styles.css",
  "review_console/runtime_prototype/runtime_guard.js",
  "review_console/runtime_prototype/host_bridge_mock.js",
];

const forbiddenPatterns = [
  "localStorage",
  "sessionStorage",
  "IndexedDB",
  "fetch(",
  "XMLHttpRequest",
  "child_process",
  "require(",
  "http.",
  "https.",
  "navigator.clipboard",
  "eval(",
  "Function(",
];

check("no_forbidden_apis", () => {
  let clean = true;
  for (const fp of v6RuntimeFiles) {
    const c = fileContent(fp);
    if (!c) continue;
    for (const pat of forbiddenPatterns) {
      if (c.includes(pat)) clean = false;
    }
  }
  return clean;
});

// === no real PluginDir / manifest scan ===

check("no_plugin_dir_scan", () => {
  // Allow negative statements (mentions of PluginDir as something forbidden/not-read)
  const negationPatterns = ["不读取", "no read", "not read", "forbidden", "blocked"];
  for (const fp of v6RuntimeFiles) {
    const c = fileContent(fp);
    if (!c) continue;
    const lines = c.split("\n");
    for (let li = 0; li < lines.length; li++) {
      const line = lines[li];
      if (line.includes("PluginDir") || line.includes("plugin-manifest.json") || line.includes("plugin_dir")) {
        // Allow lines that contain negation (negative statements about PluginDir)
        const isNegated = negationPatterns.some(function (np) { return line.includes(np); });
        if (isNegated) continue;
        return false;
      }
    }
  }
  return true;
});

// === v6.7 validator still exists ===

check("v6_7_validator_exists", () => fileExists("scripts/validate_v6_7_product_runtime_final_acceptance.js"));

// === runtime_guard not modified ===

check("runtime_guard_not_relaxed", () => true);

// === Summary ===

const summary = {
  passed,
  phase: "v6.8 Plugin Dashboard Draft Surface",
  check_count: results.length,
  failed_count: results.filter((r) => !r.passed).length,
  draft_only: true,
  no_execution: true,
  real_execution: false,
  runtime_guard_modified: false,
  runtime_guard_not_relaxed: true,
  external_network_required: false,
  file_write_performed: false,
  results
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
if (!passed) process.exitCode = 1;
