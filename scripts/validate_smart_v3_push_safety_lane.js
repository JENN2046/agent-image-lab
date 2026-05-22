"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  doc: "docs/V0_3_7A_PUSH_SAFETY_LANE_GATE.md",
  schema: "schemas/smart_v3_push_safety_lane.schema.yaml",
  fixture: "tests/schema_examples/smart_v3_push_safety_lane.example.json",
  usageRule: "docs/PUSH_L1_USAGE_RULE.md",
  regressionCases: "docs/PUSH_L1_REGRESSION_CASES.md",
  l1StatusSyncPassFixture: "tests/schema_examples/push_l1_status_sync_pass.example.json",
  l1ForbiddenPathsFailFixture: "tests/schema_examples/push_l1_forbidden_paths_fail.example.json",
  roadmap: "docs/00_project_roadmap.md",
  agents: "AGENTS.md",
  overlay: "AGENTS.autopilot-overlay.md",
  kernel: "docs/SMART_AUTOPILOT_GOVERNANCE_KERNEL.md",
  standingPolicy: "docs/STANDING_OWNER_AUTOMATIC_AUTHORIZATION_POLICY.md",
  runState: ".agent_board/RUN_STATE.md",
  handoff: ".agent_board/HANDOFF.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  validationLog: ".agent_board/VALIDATION_LOG.md",
  mvp: "scripts/validate_mvp.ps1",
  sliceHelper: "scripts/lib/governance_tooling_maintenance_slice.js"
};

const l0AlwaysManualOrForbidden = [
  "force_push",
  "history_rewrite",
  "tag",
  "release",
  "deploy",
  "destructive_git_or_filesystem_action",
  "secret_value_read_or_secret_file_change",
  "external_repository_broad_modification",
  "non_fast_forward_push",
  "branch_mismatch",
  "unreviewed_or_broad_diff",
  "uncapped_cost",
  "unbounded_loop"
];

const l1RequiredConditions = [
  "worktree_clean",
  "exactly_one_commit_ahead",
  "fast_forward_only",
  "upstream_branch_exactly_origin_master",
  "exact_slice_recognized",
  "changed_files_only_docs_status_or_validator_slice",
  "no_assets_paths",
  "no_runs_paths",
  "no_image_files",
  "no_package_json_or_lockfile",
  "no_runtime_code",
  "no_provider_image_memory_runtime_secret_side_effects",
  "no_untracked_files",
  "no_staged_files_before_push",
  "git_diff_check_passed",
  "npm_run_validate_mvp_passed",
  "post_push_verification_required",
  "post_push_state_sync_required"
];

const l2RequiredConditions = [
  "bounded_commit_count_max_2",
  "exact_changed_files_known",
  "phase_validator_passed",
  "push_preflight_packet_exists",
  "rollback_or_revert_plan_exists",
  "receipt_or_action_packet_if_amber_side_effect_exists",
  "no_secret_or_private_path",
  "no_generated_binary_unless_separate_gate",
  "no_memory_write",
  "no_production_candidate",
  "remote_head_verified_before_push",
  "post_push_state_sync_required"
];

const l2MustNotCover = [
  "generated_image_binaries",
  "runs_artifacts",
  "accepted_sample_promotion",
  "production_candidate_creation",
  "memory_write",
  "package_or_dependency_change",
  "real_executor_runtime_code"
];

const l3Examples = [
  "image_binary_commit",
  "runs_artifact_commit",
  "package_or_dependency_change",
  "runtime_code_change",
  "real_executor_change",
  "memory_write",
  "production_candidate",
  "accepted_sample_promotion",
  "provider_side_effect_without_receipt",
  "unreviewed_diff",
  "broad_diff",
  "branch_or_upstream_uncertain"
];

const negativeCaseIds = [
  "Push_L1_assets_path_fails",
  "Push_L1_runs_path_fails",
  "Push_L1_image_file_fails",
  "Push_L1_package_file_fails",
  "Push_L1_runtime_code_fails",
  "Push_L1_requires_exactly_one_commit_ahead",
  "Push_L1_requires_fast_forward_only",
  "Push_L1_requires_validation_pass",
  "Push_L1_requires_post_push_verification",
  "Push_L1_requires_post_push_state_sync",
  "Push_L2_requires_bounded_commit_count",
  "Push_L2_requires_phase_validator_pass",
  "Push_L2_blocks_generated_binary_memory_production",
  "Push_L3_requires_user_authorization",
  "force_push_auto_allowed_false",
  "tag_release_deploy_auto_allowed_false",
  "secret_destructive_auto_allowed_false"
];

const l1RegressionCaseIds = [
  "Push_L1_status_sync_pass_fixture_passes",
  "Push_L1_assets_path_fixture_fails",
  "Push_L1_runs_path_fixture_fails",
  "Push_L1_image_file_fixture_fails",
  "Push_L1_package_json_fixture_fails",
  "Push_L1_package_lock_fixture_fails",
  "Push_L1_runtime_code_fixture_fails"
];

const imageFilePattern = /\.(png|jpe?g|gif|webp|svg)$/i;
const runtimeFilePattern = /(^|\/)(src|kernel|adapters|exports|review_console\/static_prototype)\//;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function includesAll(content, values, label) {
  const missing = values.filter((value) => !content.includes(value));
  assert(missing.length === 0, `${label} missing: ${missing.join(", ")}`);
}

function ensureArrayContainsAll(actual, required, label) {
  assert(Array.isArray(actual), `${label} must be an array`);
  const missing = required.filter((value) => !actual.includes(value));
  assert(missing.length === 0, `${label} missing: ${missing.join(", ")}`);
}

function validatePushL1Candidate(candidate) {
  assert(candidate.level === "Push_L1_green_auto", "Push_L1 candidate required");
  assert(candidate.auto_push_allowed === true, "Push_L1 auto_push_allowed must be true");
  assert(candidate.worktree_clean === true, "worktree_clean required");
  assert(candidate.commit_count_ahead === 1, "exactly_one_commit_ahead required");
  assert(candidate.fast_forward_only === true, "fast_forward_only required");
  assert(candidate.upstream_branch === "origin/master", "upstream_branch_exactly_origin_master required");
  assert(candidate.exact_slice_recognized === true, "exact_slice_recognized required");
  assert(candidate.no_untracked_files === true, "no_untracked_files required");
  assert(candidate.no_staged_files_before_push === true, "no_staged_files_before_push required");
  assert(candidate.git_diff_check_passed === true, "git_diff_check_passed required");
  assert(candidate.npm_run_validate_mvp_passed === true, "npm_run_validate_mvp_passed required");
  assert(candidate.post_push_verification_required === true, "post_push_verification_required required");
  assert(candidate.post_push_state_sync_required === true, "post_push_state_sync_required required");
  assert(Array.isArray(candidate.changed_files) && candidate.changed_files.length > 0, "changed_files required");
  assert(!candidate.changed_files.some((file) => file.startsWith("assets/")), "Push_L1 assets path forbidden");
  assert(!candidate.changed_files.some((file) => file.startsWith("runs/")), "Push_L1 runs path forbidden");
  assert(!candidate.changed_files.some((file) => imageFilePattern.test(file)), "Push_L1 image file forbidden");
  assert(!candidate.changed_files.some((file) => file === "package.json" || file === "package-lock.json"), "Push_L1 package file forbidden");
  assert(!candidate.changed_files.some((file) => runtimeFilePattern.test(file)), "Push_L1 runtime code forbidden");
  if (candidate.side_effect_flags) {
    for (const [key, value] of Object.entries(candidate.side_effect_flags)) {
      assert(value === false, `Push_L1 side effect flag must be false: ${key}`);
    }
  }
  assert(candidate.push_l2_exercised !== true, "Push_L1 must not exercise Push_L2");
  assert(candidate.real_executor_implemented_now !== true, "Push_L1 must not implement a real executor");
  return true;
}

function validatePushL2Candidate(candidate) {
  assert(candidate.level === "Push_L2_amber_auto_guarded", "Push_L2 candidate required");
  assert(candidate.auto_push_allowed === true, "Push_L2 auto_push_allowed must be true");
  assert(candidate.commit_count_ahead <= 2, "Push_L2 bounded_commit_count required");
  assert(candidate.exact_changed_files_known === true, "exact_changed_files_known required");
  assert(candidate.phase_validator_passed === true, "phase_validator_passed required");
  assert(candidate.push_preflight_packet_exists === true, "push_preflight_packet_exists required");
  assert(candidate.rollback_or_revert_plan_exists === true, "rollback_or_revert_plan_exists required");
  assert(candidate.no_secret_or_private_path === true, "no_secret_or_private_path required");
  assert(candidate.remote_head_verified_before_push === true, "remote_head_verified_before_push required");
  assert(candidate.post_push_state_sync_required === true, "post_push_state_sync_required required");
  assert(candidate.generated_binary_included !== true, "Push_L2 generated binary forbidden by default");
  assert(candidate.memory_write_included !== true, "Push_L2 memory write forbidden");
  assert(candidate.production_candidate_included !== true, "Push_L2 production candidate forbidden");
  assert(candidate.package_or_dependency_change_included !== true, "Push_L2 package/dependency forbidden");
  assert(candidate.real_executor_runtime_code_included !== true, "Push_L2 real executor runtime code forbidden");
  return true;
}

function validatePolicy(policy) {
  assert(policy.phase === "v0_3_7a_push_safety_lane_gate", "phase mismatch");
  assert(policy.push_not_always_red_after_policy === true, "push_not_always_red_after_policy required");
  assert(policy.push_safety_lane_independent_from_task_lane === true, "push_safety_lane_independent_from_task_lane required");
  assert(policy.push_execution_performed_by_this_gate === false, "push execution must not occur in this gate");

  assert(policy.Push_L0_forbidden.auto_push_allowed === false, "Push_L0 auto push must be false");
  ensureArrayContainsAll(policy.Push_L0_forbidden.always_manual_or_forbidden, l0AlwaysManualOrForbidden, "Push_L0 always_manual_or_forbidden");

  assert(policy.Push_L1_green_auto.auto_push_allowed === true, "Push_L1 auto push must be true");
  ensureArrayContainsAll(policy.Push_L1_green_auto.required_conditions, l1RequiredConditions, "Push_L1 required_conditions");

  assert(policy.Push_L2_amber_auto_guarded.auto_push_allowed === true, "Push_L2 auto push must be true");
  ensureArrayContainsAll(policy.Push_L2_amber_auto_guarded.required_conditions, l2RequiredConditions, "Push_L2 required_conditions");
  ensureArrayContainsAll(policy.Push_L2_amber_auto_guarded.must_not_cover, l2MustNotCover, "Push_L2 must_not_cover");

  assert(policy.Push_L3_red_manual.user_authorization_required === true, "Push_L3 user authorization required");
  ensureArrayContainsAll(policy.Push_L3_red_manual.examples, l3Examples, "Push_L3 examples");

  assert(policy.push_preflight_validator.push_preflight_validator_required === true, "push preflight validator required");
  assert(policy.push_preflight_validator.no_force_push === true, "force push must be blocked");
  assert(policy.push_preflight_validator.no_tag_release_deploy === true, "tag/release/deploy must be blocked");
  assert(policy.push_preflight_validator.no_secret_or_destructive_action === true, "secret/destructive action must be blocked");
  assert(policy.post_push_verification.post_push_verification_required === true, "post-push verification required");
  assert(policy.post_push_reconciliation.post_push_state_sync_required === true, "post-push sync required");
  ensureArrayContainsAll(policy.negative_cases_required, negativeCaseIds, "negative cases");

  const flags = policy.current_phase_boundaries;
  for (const key of [
    "provider_call_performed",
    "image_generation_performed",
    "DailyNote_write_performed",
    "VCP_memory_write_performed",
    "runtime_call_performed",
    "secret_value_read_performed",
    "real_executor_implemented_now",
    "commit_performed",
    "push_performed"
  ]) {
    assert(flags[key] === false, `boundary must keep ${key}=false`);
  }

  validatePushL1Candidate({
    level: "Push_L1_green_auto",
    auto_push_allowed: true,
    worktree_clean: true,
    commit_count_ahead: 1,
    fast_forward_only: true,
    upstream_branch: "origin/master",
    exact_slice_recognized: true,
    no_untracked_files: true,
    no_staged_files_before_push: true,
    git_diff_check_passed: true,
    npm_run_validate_mvp_passed: true,
    post_push_verification_required: true,
    post_push_state_sync_required: true,
    changed_files: policy.Push_L1_green_auto.example_allowed_changed_files
  });

  validatePushL2Candidate({
    level: "Push_L2_amber_auto_guarded",
    auto_push_allowed: true,
    commit_count_ahead: 2,
    exact_changed_files_known: true,
    phase_validator_passed: true,
    push_preflight_packet_exists: true,
    rollback_or_revert_plan_exists: true,
    no_secret_or_private_path: true,
    remote_head_verified_before_push: true,
    post_push_state_sync_required: true,
    generated_binary_included: false,
    memory_write_included: false,
    production_candidate_included: false,
    package_or_dependency_change_included: false,
    real_executor_runtime_code_included: false
  });

  return true;
}

function expectFailure(caseId, mutate) {
  const fixture = readJson(files.fixture).smart_v3_push_safety_lane;
  try {
    mutate(clone(fixture));
  } catch (error) {
    return { case_id: caseId, result: "caught", failure_message: error.message };
  }
  throw new Error(`${caseId} was not caught`);
}

function runNegativeCases() {
  const l1Base = {
    level: "Push_L1_green_auto",
    auto_push_allowed: true,
    worktree_clean: true,
    commit_count_ahead: 1,
    fast_forward_only: true,
    upstream_branch: "origin/master",
    exact_slice_recognized: true,
    no_untracked_files: true,
    no_staged_files_before_push: true,
    git_diff_check_passed: true,
    npm_run_validate_mvp_passed: true,
    post_push_verification_required: true,
    post_push_state_sync_required: true,
    changed_files: ["docs/00_project_roadmap.md", ".agent_board/RUN_STATE.md"]
  };
  const l2Base = {
    level: "Push_L2_amber_auto_guarded",
    auto_push_allowed: true,
    commit_count_ahead: 2,
    exact_changed_files_known: true,
    phase_validator_passed: true,
    push_preflight_packet_exists: true,
    rollback_or_revert_plan_exists: true,
    no_secret_or_private_path: true,
    remote_head_verified_before_push: true,
    post_push_state_sync_required: true,
    generated_binary_included: false,
    memory_write_included: false,
    production_candidate_included: false,
    package_or_dependency_change_included: false,
    real_executor_runtime_code_included: false
  };

  return [
    expectFailure("Push_L1_assets_path_fails", () => validatePushL1Candidate({ ...l1Base, changed_files: ["assets/file.json"] })),
    expectFailure("Push_L1_runs_path_fails", () => validatePushL1Candidate({ ...l1Base, changed_files: ["runs/output.json"] })),
    expectFailure("Push_L1_image_file_fails", () => validatePushL1Candidate({ ...l1Base, changed_files: ["docs/example.png"] })),
    expectFailure("Push_L1_package_file_fails", () => validatePushL1Candidate({ ...l1Base, changed_files: ["package.json"] })),
    expectFailure("Push_L1_runtime_code_fails", () => validatePushL1Candidate({ ...l1Base, changed_files: ["kernel/executor.js"] })),
    expectFailure("Push_L1_requires_exactly_one_commit_ahead", () => validatePushL1Candidate({ ...l1Base, commit_count_ahead: 2 })),
    expectFailure("Push_L1_requires_fast_forward_only", () => validatePushL1Candidate({ ...l1Base, fast_forward_only: false })),
    expectFailure("Push_L1_requires_validation_pass", () => validatePushL1Candidate({ ...l1Base, npm_run_validate_mvp_passed: false })),
    expectFailure("Push_L1_requires_post_push_verification", () => validatePushL1Candidate({ ...l1Base, post_push_verification_required: false })),
    expectFailure("Push_L1_requires_post_push_state_sync", () => validatePushL1Candidate({ ...l1Base, post_push_state_sync_required: false })),
    expectFailure("Push_L2_requires_bounded_commit_count", () => validatePushL2Candidate({ ...l2Base, commit_count_ahead: 3 })),
    expectFailure("Push_L2_requires_phase_validator_pass", () => validatePushL2Candidate({ ...l2Base, phase_validator_passed: false })),
    expectFailure("Push_L2_blocks_generated_binary_memory_production", () => validatePushL2Candidate({ ...l2Base, generated_binary_included: true, memory_write_included: true, production_candidate_included: true })),
    expectFailure("Push_L3_requires_user_authorization", (fixture) => {
      fixture.Push_L3_red_manual.user_authorization_required = false;
      validatePolicy(fixture);
    }),
    expectFailure("force_push_auto_allowed_false", (fixture) => {
      fixture.Push_L0_forbidden.auto_push_allowed = true;
      validatePolicy(fixture);
    }),
    expectFailure("tag_release_deploy_auto_allowed_false", (fixture) => {
      fixture.push_preflight_validator.no_tag_release_deploy = false;
      validatePolicy(fixture);
    }),
    expectFailure("secret_destructive_auto_allowed_false", (fixture) => {
      fixture.push_preflight_validator.no_secret_or_destructive_action = false;
      validatePolicy(fixture);
    })
  ];
}

function candidateFromPatch(base, patch) {
  return {
    ...base,
    ...patch,
    side_effect_flags: {
      ...(base.side_effect_flags || {}),
      ...(patch.side_effect_flags || {})
    }
  };
}

function validatePushL1RegressionFixtures() {
  const passFixture = readJson(files.l1StatusSyncPassFixture).push_l1_status_sync_pass;
  const failFixture = readJson(files.l1ForbiddenPathsFailFixture).push_l1_forbidden_paths_fail;
  const passCandidate = passFixture.candidate;

  assert(passFixture.expected_classification === "Push_L1_green_auto", "Push_L1 pass fixture must expect Push_L1");
  validatePushL1Candidate(passCandidate);
  assert(passCandidate.changed_files.length === 6, "Push_L1 status-sync pass fixture must use exactly six status files");
  assert(failFixture.expected_classification === "not_Push_L1_green_auto", "Push_L1 fail fixture must reject Push_L1");
  assert(failFixture.push_l2_exercised === false, "Push_L1 fail fixture must not exercise Push_L2");
  assert(failFixture.real_executor_implemented_now === false, "Push_L1 fail fixture must not implement real executor");

  const caughtFailures = failFixture.negative_cases.map((negativeCase) => {
    const candidate = candidateFromPatch(passCandidate, negativeCase.candidate_patch || {});
    try {
      validatePushL1Candidate(candidate);
    } catch (error) {
      assert(
        String(error.message).includes(negativeCase.expected_error_contains),
        `${negativeCase.case_id} expected error to include ${negativeCase.expected_error_contains}, got ${error.message}`
      );
      return {
        case_id: `Push_L1_${negativeCase.case_id.replace(/_fails$/, "")}_fixture_fails`,
        result: "caught",
        failure_message: error.message
      };
    }
    throw new Error(`${negativeCase.case_id} was not caught`);
  });

  return [
    {
      case_id: "Push_L1_status_sync_pass_fixture_passes",
      result: "passed"
    },
    ...caughtFailures
  ];
}

function buildReport() {
  for (const file of Object.values(files)) {
    assert(fs.existsSync(path.join(root, file)), `Missing required file: ${file}`);
  }

  const doc = read(files.doc);
  const usageRule = read(files.usageRule);
  const regressionCasesDoc = read(files.regressionCases);
  const schema = read(files.schema);
  const fixture = readJson(files.fixture).smart_v3_push_safety_lane;
  const governanceDocs = [read(files.agents), read(files.overlay), read(files.kernel), read(files.standingPolicy)].join("\n");
  const statusSurfaces = [read(files.roadmap), read(files.runState), read(files.handoff), read(files.taskQueue), read(files.checkpoint), read(files.validationLog)].join("\n");
  const mvp = read(files.mvp);
  const sliceHelper = read(files.sliceHelper);

  includesAll(doc, ["Push_L0_forbidden", "Push_L1_green_auto", "Push_L2_amber_auto_guarded", "Push_L3_red_manual"], "push safety doc levels");
  includesAll(usageRule, l1RequiredConditions, "Push_L1 usage rule checklist");
  includesAll(usageRule, ["Push_L2_amber_auto_guarded: defined_not_exercised", "real_executor_implemented_now: false", "no_assets", "no_runs", "no_images", "no_package_files", "no_runtime_code"], "Push_L1 usage boundaries");
  includesAll(regressionCasesDoc, ["push_l1_status_sync_pass", "assets_path_fails", "runs_path_fails", "image_file_fails", "package_json_fails", "runtime_code_fails", "Push_L2_tested: false"], "Push_L1 regression cases doc");
  includesAll(doc, l0AlwaysManualOrForbidden, "push safety doc L0");
  includesAll(doc, l1RequiredConditions, "push safety doc L1");
  includesAll(doc, l2RequiredConditions, "push safety doc L2 required");
  includesAll(doc, l2MustNotCover, "push safety doc L2 must_not_cover");
  includesAll(doc, l3Examples, "push safety doc L3 examples");
  includesAll(doc, negativeCaseIds, "push safety doc negative cases");
  includesAll(schema, ["smart_v3_push_safety_lane", "Push_L0_forbidden", "Push_L1_green_auto", "Push_L2_amber_auto_guarded", "Push_L3_red_manual"], "push safety schema");
  includesAll(schema, negativeCaseIds, "push safety schema negative cases");
  includesAll(governanceDocs, ["Push Safety Lane", "Push_L1_green_auto", "Push_L2_amber_auto_guarded", "Push_L3_red_manual"], "governance docs push lane refs");
  includesAll(statusSurfaces, ["v0_3_7a_push_safety_lane_gate", "b5cb845ac280e463c3825ca0bc20e5abc772c421"], "status surfaces");
  includesAll(mvp, ["scripts/validate_smart_v3_push_safety_lane.js", "smart_v3_push_safety_lane.example.json"], "MVP wiring");
  includesAll(sliceHelper, ["v0_3_7a_push_safety_lane_slice", "docs/V0_3_7A_PUSH_SAFETY_LANE_GATE.md"], "slice helper wiring");

  validatePolicy(fixture);
  const negativeCases = runNegativeCases();
  const l1RegressionCases = validatePushL1RegressionFixtures();

  return {
    passed: true,
    phase: fixture.phase,
    push_not_always_red_after_policy: fixture.push_not_always_red_after_policy === true,
    push_safety_lane_independent_from_task_lane: fixture.push_safety_lane_independent_from_task_lane === true,
    Push_L0_forbidden_defined: fixture.Push_L0_forbidden.auto_push_allowed === false,
    Push_L1_green_auto_defined: fixture.Push_L1_green_auto.auto_push_allowed === true,
    Push_L2_amber_auto_guarded_defined: fixture.Push_L2_amber_auto_guarded.auto_push_allowed === true,
    Push_L3_red_manual_defined: fixture.Push_L3_red_manual.user_authorization_required === true,
    force_push_always_manual_or_forbidden: fixture.Push_L0_forbidden.always_manual_or_forbidden.includes("force_push") && fixture.push_preflight_validator.no_force_push === true,
    tag_release_deploy_always_manual_or_forbidden: ["tag", "release", "deploy"].every((item) => fixture.Push_L0_forbidden.always_manual_or_forbidden.includes(item)) && fixture.push_preflight_validator.no_tag_release_deploy === true,
    secret_destructive_always_manual_or_forbidden: fixture.Push_L0_forbidden.always_manual_or_forbidden.includes("secret_value_read_or_secret_file_change") && fixture.Push_L0_forbidden.always_manual_or_forbidden.includes("destructive_git_or_filesystem_action") && fixture.push_preflight_validator.no_secret_or_destructive_action === true,
    Push_L1_no_assets_runs_images_package_files: l1RequiredConditions.includes("no_assets_paths") && l1RequiredConditions.includes("no_runs_paths") && l1RequiredConditions.includes("no_image_files") && l1RequiredConditions.includes("no_package_json_or_lockfile"),
    Push_L2_no_memory_production_generated_binary_by_default: l2MustNotCover.includes("generated_image_binaries") && l2MustNotCover.includes("memory_write") && l2MustNotCover.includes("production_candidate_creation"),
    negative_case_count: negativeCases.length,
    caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: negativeCases.every((item) => item.result === "caught"),
    Push_L1_regression_fixture_count: l1RegressionCases.length,
    Push_L1_regression_pass_fixture_valid: l1RegressionCases.some((item) => item.case_id === "Push_L1_status_sync_pass_fixture_passes" && item.result === "passed"),
    Push_L1_regression_negative_case_count: l1RegressionCases.filter((item) => item.result === "caught").length,
    Push_L1_regression_all_cases_valid: l1RegressionCases.length === l1RegressionCaseIds.length && l1RegressionCases.every((item) => item.result === "passed" || item.result === "caught"),
    Push_L1_usage_rule_present: true,
    Push_L1_regression_cases_doc_present: true,
    Push_L1_not_expanded_to_any_docs: true,
    Push_L2_exercised: false,
    force_push_auto_allowed: false,
    tag_release_deploy_auto_allowed: false,
    secret_destructive_auto_allowed: false,
    provider_call_performed: false,
    image_generation_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    runtime_call_performed: false,
    secret_value_read_performed: false,
    commit_performed: false,
    push_performed: false
  };
}

function main() {
  const report = buildReport();
  assert(report.negative_case_count === negativeCaseIds.length, "All required negative cases must be modeled");
  assert(report.all_negative_cases_caught === true, "All negative cases must be caught");
  assert(report.Push_L1_regression_all_cases_valid === true, "Push_L1 regression fixtures must pass and fail closed");
  assert(report.Push_L2_exercised === false, "Push_L2 must remain unexercised");
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  buildReport,
  validatePushL1Candidate,
  validatePushL2Candidate,
  validatePolicy
};
