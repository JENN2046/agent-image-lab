const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

check("doc_270_exists", () => fileExists("docs/270_v7_13_post_run_review_correction_loop.md"));
check("schema_exists", () => fileExists("schemas/post_run_review.schema.yaml"));

const doc = fs.readFileSync(path.join(root, "docs/270_v7_13_post_run_review_correction_loop.md"), "utf8");
const schema = fs.readFileSync(path.join(root, "schemas/post_run_review.schema.yaml"), "utf8");

check("retry_allowed_false", () => doc.includes("retry_allowed: false") || schema.includes("retry_allowed: false"));
check("new_a5_required_true", () => doc.includes("new_a5_required: true") || schema.includes("new_a5_required: true"));
check("memory_write_false", () => doc.includes("memory_write_allowed: false") || schema.includes("memory_write_allowed: false"));
check("dailynote_false", () => doc.includes("daily_note_write_allowed: false") || schema.includes("daily_note_write_allowed: false"));
check("deviation_output_dir", () => doc.includes("output_directory_deviation") || schema.includes("output_directory_deviation"));
check("deviation_prompt_mismatch", () => doc.includes("prompt_subject_mismatch") || schema.includes("prompt_subject_mismatch"));
check("deviation_model_mismatch", () => doc.includes("model_mismatch") || schema.includes("model_mismatch"));
check("review_not_auto_retry", () => doc.includes("不等于自动重试") || doc.includes("automatic retry") || doc.includes("auto retry"));
check("validate_mvp_includes_v7_13", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_13_post_run_review_correction_loop"));

const summary = { passed, phase: "v7.13 Post-Run Review & Correction Loop", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
