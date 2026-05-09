const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
let passed = true;
const results = [];
function check(id, f) { try { const ok = f(); results.push({ check: id, passed: Boolean(ok) }); if (!ok) passed = false; } catch (e) { results.push({ check: id, passed: false, error: e.message }); passed = false; } }
function fileExists(p) { return fs.existsSync(path.join(root, p)); }
function fileContains(p, s) { const fp = path.join(root, p); if (!fs.existsSync(fp)) return false; return fs.readFileSync(fp, "utf8").includes(s); }

const regPath = "stability_tests/three_shot_stability_plan_registry.yaml";
const reg = fs.existsSync(path.join(root, regPath)) ? fs.readFileSync(path.join(root, regPath), "utf8") : "";
const planPath = "stability_tests/plans/french_summer_rattan_bag_v2_3shot_plan.yaml";
const plan = fs.existsSync(path.join(root, planPath)) ? fs.readFileSync(path.join(root, planPath), "utf8") : "";
const schemaPath = "tests/schema_examples/v7_34_3_shot_stability_test_plan.example.yaml";
const schema = fs.existsSync(path.join(root, schemaPath)) ? fs.readFileSync(path.join(root, schemaPath), "utf8") : "";
const docPath = "docs/289_v7_34_3_shot_stability_test_plan.md";
const doc = fs.existsSync(path.join(root, docPath)) ? fs.readFileSync(path.join(root, docPath), "utf8") : "";

// File existence checks (1-5)
check("stability_readme_exists", () => fileExists("stability_tests/README.md"));
check("registry_exists", () => fileExists(regPath));
check("plan_exists", () => fileExists(planPath));
check("doc_289_exists", () => fileExists(docPath));
check("schema_exists", () => fileExists(schemaPath));

// Registry content checks (6-12)
check("reg_version_v1", () => reg.includes("version: v1"));
check("reg_updated_v7_34", () => reg.includes("updated_by_phase: v7_34"));
check("reg_no_execution", () => reg.includes("execution_authorized_by_this_record: false"));
check("reg_contains_plan", () => reg.includes("french_summer_rattan_bag_v2_3shot"));
check("reg_target_prompt", () => reg.includes("product_still_life_french_summer_rattan_bucket_bag_bicycle_no_watermark_v2.yaml"));
check("reg_shot_count_3", () => reg.includes("shot_count: 3"));
check("reg_sequential_independent", () => reg.includes("sequential_independent_a5_single_runs"));

// Plan file shot checks (13-20)
check("plan_has_3_shots", () => { const shots = (plan.match(/shot_id:/g) || []).length; return shots === 3; });
check("plan_shot_1_v7_35", () => plan.includes("future_phase: v7_35"));
check("plan_shot_2_v7_36", () => plan.includes("future_phase: v7_36"));
check("plan_shot_3_v7_37", () => plan.includes("future_phase: v7_37"));
check("plan_each_shot_independent_a5", () => {
  const independentA5 = (plan.match(/requires_independent_a5: true/g) || []).length;
  return independentA5 === 3;
});
check("plan_each_shot_max_calls_1", () => { const m = (plan.match(/max_plugin_calls: 1/g) || []).length; return m === 3; });
check("plan_each_shot_max_images_1", () => { const m = (plan.match(/max_images_created: 1/g) || []).length; return m === 3; });
check("plan_each_shot_no_retry", () => { const m = (plan.match(/retry_allowed: false/g) || []).length; return m === 3; });

// Provider and watermark checks (21-22)
check("plan_watermark_false", () => plan.includes("watermark_required: false"));
check("plan_watermark_param_sent", () => plan.includes("watermark_parameter_must_be_sent: true"));

// Hard blocker checks (23-25)
check("plan_hard_blockers", () => plan.includes("hard_blockers:"));
check("plan_blocker_watermark", () => plan.includes("visible_watermark_or_generated_mark"));
check("plan_blocker_api_key", () => plan.includes("api_key_output"));

// Acceptance gate checks (26-28)
check("plan_per_shot_gate", () => plan.includes("per_shot_acceptance_gate:"));
check("plan_gate_no_watermark", () => plan.includes("no_watermark_or_generated_mark: required_pass"));
check("plan_gate_clean_corners", () => plan.includes("clean_image_corners: required_pass"));

// Stability scoring checks (29-32)
check("plan_stability_scoring", () => plan.includes("stability_scoring:"));
check("plan_3_of_3_stable", () => plan.includes("accepted_3_of_3") && plan.includes("stable_candidate"));
check("plan_2_of_3_conditional", () => plan.includes("accepted_2_of_3") && plan.includes("conditional_stable_needs_review"));
check("plan_0_or_1_unstable", () => plan.includes("accepted_0_or_1_of_3") && plan.includes("unstable"));

// Schema content checks (33-38)
check("schema_plan_only", () => schema.includes("status: plan_only"));
check("schema_no_execution", () => schema.includes("execution_authorized_by_this_record: false"));
check("schema_shot_count_3", () => schema.includes("shot_count: 3"));
check("schema_no_batch", () => schema.includes("batch_generation_authorized: false"));
check("schema_no_api", () => schema.includes("real_api_call_performed: false"));
check("schema_no_image", () => schema.includes("image_created: false"));

// Doc content checks (39-41)
check("doc_no_real_generation", () => doc.includes("不授权真实生成") || doc.includes("does not authorize real generation"));
check("doc_each_shot_independent_a5", () => doc.includes("独立 A5") || doc.includes("independent A5"));
check("doc_no_batch_generation", () => doc.includes("batch generation") || doc.includes("不授权 batch"));

// Validate MVP inclusion check (42)
check("validate_mvp_includes_v7_34", () => fileContains("scripts/validate_mvp.ps1", "validate_v7_34_3_shot_stability_test_plan"));

// Backward compatibility — ensure existing validators still exist (43-46)
check("v7_33_validator_exists", () => fileExists("scripts/validate_v7_33_failure_registry.js"));
check("v7_32_validator_exists", () => fileExists("scripts/validate_v7_32_accepted_sample_registry_update.js"));
check("v7_31_validator_exists", () => fileExists("scripts/validate_v7_31_native_doubao_french_summer_rattan_bag_v2_watermark_off_post_run_review_accepted_candidate.js"));
check("v7_30_validator_exists", () => fileExists("scripts/validate_v7_30_native_doubao_watermark_parameter_enforcement.js"));

// Safety boundary checks (47-51)
check("no_doubao_api", () => !fileContains("stability_tests/plans/french_summer_rattan_bag_v2_3shot_plan.yaml", "real_api_call_performed: true"));
check("no_image_generation", () => !fileContains("stability_tests/plans/french_summer_rattan_bag_v2_3shot_plan.yaml", "image_created: true"));
check("no_api_key_output", () => !fileContains("stability_tests/plans/french_summer_rattan_bag_v2_3shot_plan.yaml", "api_key_output: true"));
check("no_images_committed", () => {
  const imgExts = [/\.jpg$/i, /\.jpeg$/i, /\.png$/i, /\.webp$/i];
  const planContent = plan;
  const docContent = doc;
  const schemaContent = schema;
  // Check that new files don't contain image file paths
  const combined = planContent + docContent + schemaContent;
  return !imgExts.some(re => re.test(combined));
});
check("no_runs_committed", () => {
  // Plan references future output dirs; check no actual artifacts exist
  const dirs = [
    "runs/real_generation/v7_35_french_summer_rattan_bag_v2_3shot_shot_1",
    "runs/real_generation/v7_36_french_summer_rattan_bag_v2_3shot_shot_2",
    "runs/real_generation/v7_37_french_summer_rattan_bag_v2_3shot_shot_3"
  ];
  return !dirs.some(d => fs.existsSync(path.join(root, d)));
});

const summary = { passed, phase: "v7.34 3-shot Stability Test Plan", check_count: results.length, failed_count: results.filter(r => !r.passed).length, draft_only: true, no_execution: true, real_execution: false, external_network_required: false, file_write_performed: false, results };
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
if (!passed) process.exitCode = 1;
