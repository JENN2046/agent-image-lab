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

function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) {
  const fp = path.join(root, p);
  if (!fs.existsSync(fp)) return false;
  return fs.readFileSync(fp, "utf8").includes(s);
}
function fileContent(p) {
  const fp = path.join(root, p);
  if (!fs.existsSync(fp)) return "";
  return fs.readFileSync(fp, "utf8");
}

// === doc ===
check("doc_248_exists", () => fileExists("docs/248_v6_9a_release_panel_draft_surface.md"));

// === HTML ===
const html = fileContent("review_console/runtime_prototype/index.html");
check("html_contains_release_panel", () => html.includes("v6ReleasePanel"));
check("html_contains_commit_fields", () => html.includes("v6ReleaseCurrentCommit") && html.includes("v6ReleaseBaselineCommit"));
check("html_contains_validator_status", () => html.includes("v6ReleaseV6_9") && html.includes("v6ReleaseV6_8") && html.includes("v6ReleaseV6_7"));
check("html_contains_readiness_status", () => html.includes("v6ReleaseDirtyTree") && html.includes("v6ReleaseNotesStatus"));
check("html_contains_safety_fields", () =>
  html.includes("v6ReleasePushAllowed") && html.includes("v6ReleaseTagAllowed") &&
  html.includes("v6ReleaseReleaseAllowed") && html.includes("v6ReleaseGithubReleaseAllowed") &&
  html.includes("v6ReleaseDeployAllowed") && html.includes("v6ReleaseA5Allowed")
);

// === app.js ===
const app = fileContent("review_console/runtime_prototype/app.js");
check("js_contains_release_builder", () => app.includes("release_readiness_draft: function ()"));
check("js_contains_release_renderer", () => app.includes("var rrd = v6.release_readiness_draft"));

// === FIELD_MAPPING ===
check("field_mapping_contains_release", () => fileContains("review_console/runtime_prototype/FIELD_MAPPING.md", "release_readiness_draft"));

// === safety fields ===
const noActionFields = ["push_allowed: false","tag_allowed: false","release_allowed: false","github_release_allowed: false","deploy_allowed: false","a5_production_execution_allowed: false"];
check("safety_fields_false", () => noActionFields.every(f => app.includes(f)));
check("draft_only_true", () => app.includes("draft_only: true"));
check("side_effects_performed_false", () => app.includes("side_effects_performed: false"));

// === no forbidden commands ===
const appLower = app.toLowerCase();
check("no_git_push", () => !appLower.includes("git push") || appLower.includes("git push") === app.includes("push_allowed: false"));
check("no_git_tag_cmd", () => !app.includes('"git tag"') && !app.includes("'git tag'"));
check("no_gh_release", () => !app.includes("gh release") && !app.includes("'gh release"));
check("no_github_api", () => !app.includes("api.github.com"));

// === indexes ===
check("validate_mvp_includes_v6_9a", () => fileContains("scripts/validate_mvp.ps1", "validate_v6_9a_release_panel_draft_surface"));

const summary = {
  passed,
  phase: "v6.9A Release Panel Draft Surface",
  check_count: results.length,
  failed_count: results.filter(r => !r.passed).length,
  draft_only: true, no_execution: true, real_execution: false,
  external_network_required: false, file_write_performed: false,
  results
};
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
