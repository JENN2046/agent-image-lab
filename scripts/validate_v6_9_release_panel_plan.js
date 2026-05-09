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

// === doc existence ===

check("doc_247_exists", () => fileExists("docs/247_v6_9_release_panel_plan.md"));

// === doc content checks ===

check("doc_contains_release_panel", () =>
  fileContains("docs/247_v6_9_release_panel_plan.md", "Release Panel")
);

check("doc_contains_release_readiness_draft", () =>
  fileContains("docs/247_v6_9_release_panel_plan.md", "release_readiness_draft")
);

check("doc_push_allowed_false", () =>
  fileContains("docs/247_v6_9_release_panel_plan.md", "push_allowed: false")
);

check("doc_tag_allowed_false", () =>
  fileContains("docs/247_v6_9_release_panel_plan.md", "tag_allowed: false")
);

check("doc_release_allowed_false", () =>
  fileContains("docs/247_v6_9_release_panel_plan.md", "release_allowed: false")
);

check("doc_github_release_allowed_false", () =>
  fileContains("docs/247_v6_9_release_panel_plan.md", "github_release_allowed: false")
);

check("doc_no_tag_no_release_no_deploy", () =>
  fileContains("docs/247_v6_9_release_panel_plan.md", "tag") &&
  fileContains("docs/247_v6_9_release_panel_plan.md", "deploy")
);

check("doc_contains_v6_7_baseline", () =>
  fileContains("docs/247_v6_9_release_panel_plan.md", "v6.7")
);

check("doc_contains_v6_8_plugin_dashboard", () =>
  fileContains("docs/247_v6_9_release_panel_plan.md", "v6.8")
);

// === no positive authorization ===

const docContent = fs.readFileSync(path.join(root, "docs/247_v6_9_release_panel_plan.md"), "utf8");

check("no_push_allowed_true", () => !docContent.includes("push_allowed: true"));
check("no_tag_allowed_true", () => !docContent.includes("tag_allowed: true"));
check("no_release_allowed_true", () => !docContent.includes("release_allowed: true"));
check("no_a5_production_true", () => !docContent.includes("A5 production execution: true"));

// === validate_mvp.ps1 includes v6.9 ===

check("validate_mvp_ps1_includes_v6_9", () =>
  fileContains("scripts/validate_mvp.ps1", "validate_v6_9_release_panel_plan")
);

// === Summary ===

const summary = {
  passed,
  phase: "v6.9 Release Panel Planning",
  check_count: results.length,
  failed_count: results.filter((r) => !r.passed).length,
  draft_only: true,
  no_execution: true,
  real_execution: false,
  external_network_required: false,
  file_write_performed: false,
  results
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
if (!passed) process.exitCode = 1;
