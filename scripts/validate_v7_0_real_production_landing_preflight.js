const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];

function check(id, testFn) {
  try { const ok = testFn(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; }
  catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; }
}
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) {
  const fp = path.join(root, p);
  if (!fs.existsSync(fp)) return false;
  return fs.readFileSync(fp, "utf8").includes(s);
}

check("doc_254_exists", () => fileExists("docs/254_v7_0_real_production_landing_preflight.md"));
check("doc_255_exists", () => fileExists("docs/255_v7_0_a5_single_generation_authorization_template.md"));
check("doc_254_contains_e886b6b", () => fileContains("docs/254_v7_0_real_production_landing_preflight.md", "e886b6b"));
check("doc_254_contains_rc_tag", () => fileContains("docs/254_v7_0_real_production_landing_preflight.md", "v6.10-rc1-product-runtime"));
check("doc_254_no_real_generation", () => fileContains("docs/254_v7_0_real_production_landing_preflight.md", "不执行真实生成"));
check("doc_255_execution_not_authorized", () => fileContains("docs/255_v7_0_a5_single_generation_authorization_template.md", "execution_authorized_by_this_record: false"));
check("doc_255_max_plugin_calls_1", () => fileContains("docs/255_v7_0_a5_single_generation_authorization_template.md", "max_plugin_calls: 1"));
check("doc_255_image_forbidden", () => fileContains("docs/255_v7_0_a5_single_generation_authorization_template.md", "image_creation: true"));
check("doc_255_dailynote_forbidden", () => fileContains("docs/255_v7_0_a5_single_generation_authorization_template.md", "dailynote_write: true"));
check("doc_255_vcp_memory_forbidden", () => fileContains("docs/255_v7_0_a5_single_generation_authorization_template.md", "vcp_memory_write: true"));
check("doc_255_memory_write_blocked", () => fileContains("docs/255_v7_0_a5_single_generation_authorization_template.md", "memory_write_allowed: false"));
check("readme_mentions_v7_0", () => fileContains("README.md", "v7.0") || fileContains("README.md", "real production"));
check("manifest_mentions_v7_0", () => fileContains("MANIFEST.md", "v7.0"));
check("release_notes_mentions_v7_0", () => fileContains("RELEASE_NOTES.md", "v7.0"));
check("roadmap_mentions_v7_0", () => fileContains("docs/00_project_roadmap.md", "v7.0"));
check("validation_checklist_includes_v7_0", () => fileContains("tests/validation_checklist.md", "v7.0"));
check("validate_mvp_includes_v7_0", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_0_real_production_landing_preflight"));

const summary = {
  passed, phase: "v7.0 Real Production Landing Preflight",
  check_count: results.length, failed_count: results.filter(r => !r.passed).length,
  draft_only: true, no_execution: true, real_execution: false,
  external_network_required: false, file_write_performed: false,
  results
};
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
