const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

const pkgPath = "prompts/image_generation/product_still_life_outdoor_tennis_v1.yaml";
const pkg = fs.readFileSync(path.join(root, pkgPath), "utf8");

check("prompt_package_exists", () => fileExists(pkgPath));
check("prompt_package_id_exists", () => pkg.includes("prompt_package_id:"));
check("prompt_exists", () => pkg.includes("prompt:"));
check("negative_prompt_exists", () => pkg.includes("negative_prompt:"));
check("reference_policy_is_text_only", () => pkg.includes("text_only_no_image_input"));
check("safety_person_face_not_allowed", () => pkg.includes("person_or_face_allowed: false"));
check("safety_text_logo_not_allowed", () => pkg.includes("readable_text_or_logo_allowed: false"));

check("a5_template_exists", () => fileExists("docs/a5_templates/A5_SINGLE_REAL_GENERATION_TEMPLATE.md"));
const tmpl = fs.readFileSync(path.join(root, "docs/a5_templates/A5_SINGLE_REAL_GENERATION_TEMPLATE.md"), "utf8");
check("template_contains_prompt_package_ref", () => tmpl.includes("prompt_package_ref"));
check("template_does_not_inline_prompt", () => !tmpl.includes("Create a premium commercial still-life"));
check("template_contains_limits", () => tmpl.includes("memory_write_allowed: false") && tmpl.includes("push_allowed: false") && tmpl.includes("release_allowed: false"));

check("doc_265_exists", () => fileExists("docs/265_v7_8_a5_template_prompt_library_separation.md"));
check("validate_mvp_includes_v7_8", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_8_a5_template_prompt_library"));

const summary = { passed, phase: "v7.8 A5 Template + Prompt Library Separation", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
