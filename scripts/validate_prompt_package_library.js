const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

const packages = [
  "product_still_life_outdoor_tennis_v1",
  "product_still_life_outdoor_hiking_v1",
  "product_still_life_dark_luxury_v1",
  "product_still_life_white_ecommerce_v1",
];

check("prompts_root_readme", () => fileExists("prompts/README.md"));
check("image_generation_readme", () => fileExists("prompts/image_generation/README.md"));
check("prompt_sets_readme", () => fileExists("prompts/prompt_sets/README.md"));

for (const pkg of packages) {
  const fp = `prompts/image_generation/${pkg}.yaml`;
  check(`pkg_${pkg}_exists`, () => fileExists(fp));
  check(`pkg_${pkg}_has_prompt`, () => fileContains(fp, "prompt:"));
  check(`pkg_${pkg}_reference_policy`, () => fileContains(fp, "text_only_no_image_input"));
  check(`pkg_${pkg}_safety`, () => fileContains(fp, "person_or_face_allowed: false"));
}

check("prompt_sets_exists", () => fileExists("prompts/prompt_sets/first_real_generation_set_v1.yaml"));
check("prompt_set_schema", () => fileExists("schemas/prompt_set.schema.yaml"));
check("prompt_package_schema", () => fileExists("schemas/prompt_package.schema.yaml"));

const summary = { passed, phase: "Prompt Package Library", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
