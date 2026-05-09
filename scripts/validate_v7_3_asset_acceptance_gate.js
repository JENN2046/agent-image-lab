const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

const statuses = ["accepted_candidate","needs_human_review","rejected","blocked"];
const checklist = ["prompt_subject_match","style_direction_match","no_person_or_face_unless_expected","no_readable_text_or_logo_unless_expected","composition_acceptable","commercial_usability","memory_suitability","archive_suitability"];

check("doc_258_exists", () => fileExists("docs/258_v7_3_asset_acceptance_gate.md"));
for (const s of statuses) {
  check("status_" + s, () => fileContains("docs/258_v7_3_asset_acceptance_gate.md", s));
}
for (const c of checklist) {
  check("checklist_" + c, () => fileContains("docs/258_v7_3_asset_acceptance_gate.md", c));
}
check("accepted_not_auto_delivery", () => fileContains("docs/258_v7_3_asset_acceptance_gate.md", "不等于自动交付") || fileContains("docs/258_v7_3_asset_acceptance_gate.md", "accepted_candidate 不等于自动交付"));
check("memory_separate_auth", () => fileContains("docs/258_v7_3_asset_acceptance_gate.md", "separate authorization"));
check("dailynote_separate_auth", () => fileContains("docs/258_v7_3_asset_acceptance_gate.md", "DailyNote write requires separate"));
check("validate_mvp_includes_v7_3", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_3_asset_acceptance_gate"));

const summary = { passed, phase: "v7.3 Asset Acceptance Gate", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
