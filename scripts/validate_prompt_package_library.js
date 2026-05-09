const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

// Read prompt set to enumerate packages
const promptSetYaml = fs.readFileSync(path.join(root, "prompts/prompt_sets/doubao_product_still_life_20_v1.yaml"), "utf8");
const pkgRefs = promptSetYaml.match(/^  - (prompts\/image_generation\/.+\.yaml)$/gm) || [];

check("prompts_root_readme", () => fileExists("prompts/README.md"));
check("image_generation_readme", () => fileExists("prompts/image_generation/README.md"));
check("prompt_sets_readme", () => fileExists("prompts/prompt_sets/README.md"));
check("prompt_set_20_exists", () => fileExists("prompts/prompt_sets/doubao_product_still_life_20_v1.yaml"));

// Check all 20 packages from the set
check("all_20_packages_exist", () => {
  for (const ref of pkgRefs) {
    const fp = ref.replace(/^  - /, "").trim();
    if (!fileExists(fp)) return false;
  }
  return pkgRefs.length === 20;
});

// Spot-check format on first package
const tennisYaml = fs.readFileSync(path.join(root, "prompts/image_generation/product_still_life_outdoor_tennis_v1.yaml"), "utf8");
check("format_has_prompt_package_id", () => tennisYaml.includes("prompt_package_id:"));
check("format_has_prompt", () => tennisYaml.includes("prompt: |"));
check("format_has_negative_prompt", () => tennisYaml.includes("negative_prompt: |"));
check("format_has_acceptance_gate", () => tennisYaml.includes("acceptance_gate:"));
check("format_has_reference_policy", () => tennisYaml.includes("text_only_no_image_input"));
check("format_has_memory_write_blocked", () => tennisYaml.includes("memory_write_allowed: false"));
check("format_has_dailynote_blocked", () => tennisYaml.includes("daily_note_write_allowed: false"));

check("prompt_set_schema", () => fileExists("schemas/prompt_set.schema.yaml"));
check("prompt_package_schema", () => fileExists("schemas/prompt_package.schema.yaml"));

const summary = { passed, phase: "Prompt Package Library (20)", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
