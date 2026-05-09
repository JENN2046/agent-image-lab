const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

check("a5_template_exists", () => fileExists("docs/a5_templates/A5_SINGLE_REAL_GENERATION_TEMPLATE.md"));
check("a5_memory_template_exists", () => fileExists("docs/a5_templates/A5_MEMORY_WRITE_TEMPLATE.md"));
check("a5_form_exists", () => fileExists("docs/a5_templates/a5_activation_form.md"));

const tmpl = fs.readFileSync(path.join(root, "docs/a5_templates/A5_SINGLE_REAL_GENERATION_TEMPLATE.md"), "utf8");
check("template_has_prompt_package_ref", () => tmpl.includes("prompt_package_ref"));
check("template_has_limits", () => tmpl.includes("memory_write_allowed: false") && tmpl.includes("push_allowed: false"));
check("template_has_post_run", () => tmpl.includes("asset_review_required: true") && tmpl.includes("human_review_required: true"));

check("a5_activation_schema", () => fileExists("schemas/a5_activation.schema.yaml"));
check("production_run_schema", () => fileExists("schemas/production_run.schema.yaml"));
check("runbook_exists", () => fileExists("docs/production_runbooks/v7_real_generation_operator_runbook.md"));
check("checklist_exists", () => fileExists("docs/production_runbooks/v7_first_real_generation_checklist.md"));

const summary = { passed, phase: "A5 Generation Template", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
