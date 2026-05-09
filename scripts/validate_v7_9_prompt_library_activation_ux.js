const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

// ── Phase 1: Prompt library completeness ──
const pkgDir = path.join(root, "prompts/image_generation");
const pkgFiles = fs.readdirSync(pkgDir).filter(f => f.endsWith(".yaml"));
check("all_20_packages_exist", () => pkgFiles.length === 20);

// Spot-check all packages have required fields
const requiredFields = ["prompt_package_id", "title_cn", "purpose_cn", "mode: text_to_image", "reference_policy: text_only_no_image_input", "prompt:", "negative_prompt:", "acceptance_gate:", "memory_write_allowed: false", "daily_note_write_allowed: false"];
check("all_packages_have_required_fields", () => {
  for (const f of pkgFiles) {
    const content = fs.readFileSync(path.join(pkgDir, f), "utf8");
    for (const field of requiredFields) {
      if (!content.includes(field)) return false;
    }
  }
  return true;
});

// Prompt set references all 20
const setContent = fs.readFileSync(path.join(root, "prompts/prompt_sets/doubao_product_still_life_20_v1.yaml"), "utf8");
const refs = setContent.match(/^  - .+\.yaml$/gm) || [];
check("prompt_set_references_20", () => refs.length === 20);

// ── Phase 2: A5 UX ──
check("a5_template_exists", () => fileExists("docs/a5_templates/A5_SINGLE_REAL_GENERATION_TEMPLATE.md"));
check("a5_form_exists", () => fileExists("docs/a5_templates/a5_activation_form.md"));

const tmpl = fs.readFileSync(path.join(root, "docs/a5_templates/A5_SINGLE_REAL_GENERATION_TEMPLATE.md"), "utf8");
check("template_has_prompt_package_ref", () => tmpl.includes("prompt_package_ref"));
check("template_says_agent_must_not_guess_plugindir", () => tmpl.includes("手动确认"));
check("template_says_continue_is_not_activation", () => tmpl.includes("不是 A5 激活"));

const form = fs.readFileSync(path.join(root, "docs/a5_templates/a5_activation_form.md"), "utf8");
check("form_has_PluginDir_field", () => form.includes("PluginDir"));
check("form_says_agent_must_not_guess", () => form.includes("手动确认"));
check("form_says_continue_not_activation", () => form.includes("不是 A5 激活"));

// ── Phase 3: Selection guide ──
check("doc_266_exists", () => fileExists("docs/266_prompt_library_selection_guide.md"));
check("guide_recommends_first_prompt", () => fileContains("docs/266_prompt_library_selection_guide.md", "outdoor_tennis_v1"));
check("guide_has_20_prompts", () => fileContains("docs/266_prompt_library_selection_guide.md", "prompt_package_id"));

// ── No image-to-image ──
check("no_image_to_image_in_packages", () => {
  for (const f of pkgFiles) {
    const content = fs.readFileSync(path.join(pkgDir, f), "utf8");
    if (!content.includes("text_only_no_image_input")) return false;
  }
  return true;
});

// ── validate_mvp includes v7.9 ──
check("validate_mvp_includes_v7_9", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_9_prompt_library_activation_ux"));

const summary = { passed, phase: "v7.9 Prompt Library and A5 Activation UX Polish", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
