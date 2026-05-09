const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

const fc = ["plugin_call_failed","api_timeout","image_created_but_rejected","prompt_mismatch","unsafe_output","person_face_detected","readable_text_or_logo_detected","wrong_style_direction","memory_write_blocked","asset_archive_blocked","unknown_failure"];

check("doc_257_exists", () => fileExists("docs/257_v7_2_generation_failure_taxonomy_and_retry_policy.md"));
for (const c of fc) {
  check("failure_category_" + c, () => fileContains("docs/257_v7_2_generation_failure_taxonomy_and_retry_policy.md", c));
}
check("automatic_retry_false", () => fileContains("docs/257_v7_2_generation_failure_taxonomy_and_retry_policy.md", "automatic_retry_allowed: false"));
check("max_retry_0", () => fileContains("docs/257_v7_2_generation_failure_taxonomy_and_retry_policy.md", "max_retry_without_new_authorization: 0"));
check("manual_retry_requires_auth", () => fileContains("docs/257_v7_2_generation_failure_taxonomy_and_retry_policy.md", "manual_retry_requires_new_authorization: true"));
check("validate_mvp_includes_v7_2", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_2_generation_failure_taxonomy_and_retry_policy"));

const summary = { passed, phase: "v7.2 Generation Failure Taxonomy and Retry Policy", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
