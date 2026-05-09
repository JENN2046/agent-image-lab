const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

check("v2_prompt_exists", () => fileExists("prompts/image_generation/product_still_life_outdoor_tennis_wallet_hero_v2.yaml"));
const v2 = fs.readFileSync(path.join(root, "prompts/image_generation/product_still_life_outdoor_tennis_wallet_hero_v2.yaml"), "utf8");
check("v2_has_hero_subject", () => v2.includes("hero subject") || v2.includes("45%") || v2.includes("60%"));
check("v2_has_close_up", () => v2.includes("Close-up") || v2.includes("close-up") || v2.includes("close up"));
check("v2_no_wide_court", () => v2.includes("no wide") || v2.includes("No wide") || v2.includes("wide-angle"));
check("v2_wallet_on_racket", () => v2.includes("strings") || v2.includes("racket strings"));
check("v2_has_acceptance_gate", () => v2.includes("acceptance_gate:"));
check("v2_memory_write_false", () => v2.includes("memory_write_allowed: false"));
check("v2_dailynote_false", () => v2.includes("daily_note_write_allowed: false"));
check("v2_reference_policy", () => v2.includes("text_only_no_image_input"));
check("doc_268_exists", () => fileExists("docs/268_v7_11_first_generation_prompt_correction.md"));
check("validate_mvp_includes_v7_11", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_11_prompt_correction"));

const summary = { passed, phase: "v7.11 Prompt Correction — Tennis Wallet Hero v2", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
