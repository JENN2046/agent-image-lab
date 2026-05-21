const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_3_1_real_provider_cost_boundary_plan";
const longTermGoal = "v0_3_controlled_real_provider_production_loop";
const fixturePath = "tests/schema_examples/v0_3_1_real_provider_cost_boundary_plan.example.json";

const requiredFields = [
  "provider_target",
  "plugin_id_or_provider_route",
  "model",
  "command",
  "visual_task_id",
  "prompt_package_ref",
  "max_provider_calls",
  "max_image_candidates",
  "retry_limit",
  "cost_cap_amount",
  "cost_cap_currency",
  "output_directory",
  "receipt_path",
  "registry_path",
  "rollback_limitations_acknowledged",
  "owner_authorization_phrase"
];

const stopConditions = [
  "missing_exact_provider_target",
  "missing_call_budget",
  "missing_cost_cap",
  "unknown_or_uncapped_cost",
  "missing_rollback_limitations",
  "secret_value_required",
  "raw_request_or_response_would_be_recorded",
  "endpoint_or_token_would_be_recorded",
  "output_path_collision_without_overwrite_authorization",
  "owner_authorization_phrase_missing",
  "validation_failure_requiring_judgment"
];

const sideEffectFlags = {
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  runtime_probe_performed: false,
  secret_value_read_performed: false,
  push_tag_release_deploy_performed: false
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function writeJson(relativePath, value) {
  fs.writeFileSync(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertDeepEqual(actual, expected, label) {
  assert(JSON.stringify(actual, null, 2) === JSON.stringify(expected, null, 2), `${label} mismatch`);
}

function assertFalseFlags(flags) {
  for (const [key, value] of Object.entries(flags)) {
    assert(value === false, `${key} must remain false`);
  }
}

function validatePlan(plan) {
  assert(plan.phase === phase, "phase mismatch");
  assert(plan.long_term_goal === longTermGoal, "long-term goal mismatch");
  assert(plan.lane === "Red-gated planning", "lane must be Red-gated planning");
  assert(plan.execution_authorized_by_this_plan === false, "plan must not authorize execution");
  assert(plan.live_provider_call_allowed_now === false, "live provider call must be blocked now");
  assert(plan.plugin_call_allowed_now === false, "plugin call must be blocked now");
  assert(plan.api_call_allowed_now === false, "API call must be blocked now");
  assert(plan.image_generation_allowed_now === false, "image generation must be blocked now");
  assert(plan.current_live_call_budget === 0, "current live call budget must be zero");
  assert(plan.current_image_generation_budget === 0, "current image generation budget must be zero");
  assert(plan.current_cost_budget === 0, "current cost budget must be zero");
  assert(plan.exact_provider_target_required === true, "exact provider target is required");
  assert(plan.selected_provider_target_now === null, "provider target must not be selected by this plan");
  assert(plan.max_provider_calls_after_authorization_cap <= 3, "future provider call cap must stay within standing envelope");
  assert(plan.max_image_candidates_after_authorization_cap <= 3, "future image candidate cap must stay within standing envelope");
  assert(plan.retry_limit_after_authorization_cap <= 1, "future retry cap must stay within standing envelope");
  assert(plan.cost_cap_required === true, "cost cap is required before future live call");
  assert(plan.cost_unknown_is_red === true, "unknown cost must remain Red");
  assert(plan.rollback_limitations_acknowledged === true, "rollback limitations must be acknowledged");
  assert(plan.provider_cost_spend_reversible === false, "provider cost spend must be treated as irreversible");
  assert(plan.external_provider_request_reversible === false, "external provider request must be treated as irreversible");
  assert(plan.receipt_required === true, "receipt is required");
  assert(plan.registry_entry_required === true, "registry entry is required");
  assert(plan.review_console_bridge_required === true, "Review Console bridge is required");
  assertDeepEqual(plan.future_authorization_required_fields, requiredFields, "future authorization required fields");
  assertDeepEqual(plan.stop_conditions, stopConditions, "stop conditions");
  assertFalseFlags(plan.side_effect_flags);
}

function expectFailure(caseId, mutate) {
  const plan = clone(buildCanonicalPlan());
  mutate(plan);
  try {
    validatePlan(plan);
  } catch (error) {
    return {
      case_id: caseId,
      result: "caught",
      expected_failure: true,
      failure_message: error.message
    };
  }
  throw new Error(`${caseId} was not caught`);
}

function buildCanonicalPlan() {
  return {
    version: "v1",
    phase,
    long_term_goal: longTermGoal,
    lane: "Red-gated planning",
    selected_task: "define_real_provider_cost_boundary_before_live_calls",
    execution_authorized_by_this_plan: false,
    live_provider_call_allowed_now: false,
    plugin_call_allowed_now: false,
    api_call_allowed_now: false,
    image_generation_allowed_now: false,
    current_live_call_budget: 0,
    current_image_generation_budget: 0,
    current_cost_budget: 0,
    exact_provider_target_required: true,
    selected_provider_target_now: null,
    max_provider_calls_after_authorization_cap: 3,
    max_image_candidates_after_authorization_cap: 3,
    retry_limit_after_authorization_cap: 1,
    cost_cap_required: true,
    cost_unknown_is_red: true,
    rollback_limitations_acknowledged: true,
    provider_cost_spend_reversible: false,
    external_provider_request_reversible: false,
    receipt_required: true,
    registry_entry_required: true,
    review_console_bridge_required: true,
    future_authorization_required_fields: requiredFields,
    stop_conditions: stopConditions,
    negative_cases: [],
    negative_case_count: 0,
    caught_negative_case_count: 0,
    all_negative_cases_caught: false,
    side_effect_flags: sideEffectFlags,
    recommended_next: "v0_3_2_live_candidate_action_packet"
  };
}

function validateDocsAndStatus() {
  const longTermDoc = read("docs/V0_3_CONTROLLED_REAL_PROVIDER_PRODUCTION_LOOP.md");
  const planDoc = read("docs/V0_3_1_REAL_PROVIDER_COST_BOUNDARY_PLAN.md");
  const roadmap = read("docs/00_project_roadmap.md");
  const runState = read(".agent_board/RUN_STATE.md");
  const taskQueue = read(".agent_board/TASK_QUEUE.md");
  const checkpoint = read(".agent_board/CHECKPOINT.md");
  const handoff = read(".agent_board/HANDOFF.md");
  const ledger = read(".agent_board/AUTOPILOT_LEDGER.md");
  const combined = [longTermDoc, planDoc, roadmap, runState, taskQueue, checkpoint, handoff, ledger].join("\n");

  for (const token of [
    phase,
    longTermGoal,
    "execution_authorized_by_this_plan: false",
    "live_provider_call_allowed_now: false",
    "image_generation_allowed_now: false",
    "cost_unknown_is_red: true",
    "rollback_limitations_acknowledged",
    "v0_3_2_live_candidate_action_packet"
  ]) {
    assert(combined.includes(token), `missing required status token: ${token}`);
  }

  for (const forbidden of [
    "provider_contact_performed: true",
    "plugin_call_performed: true",
    "api_call_performed: true",
    "image_generation_performed: true",
    "secret_value_read_performed: true",
    "push_tag_release_deploy_performed: true"
  ]) {
    assert(!combined.includes(forbidden), `forbidden execution token present: ${forbidden}`);
  }
}

function buildReport() {
  const plan = buildCanonicalPlan();
  validatePlan(plan);
  validateDocsAndStatus();

  const negativeCases = [
    expectFailure("execution_authorized_by_plan_fails", (candidate) => {
      candidate.execution_authorized_by_this_plan = true;
    }),
    expectFailure("live_provider_call_allowed_now_fails", (candidate) => {
      candidate.live_provider_call_allowed_now = true;
    }),
    expectFailure("missing_cost_cap_requirement_fails", (candidate) => {
      candidate.cost_cap_required = false;
    }),
    expectFailure("cost_unknown_not_red_fails", (candidate) => {
      candidate.cost_unknown_is_red = false;
    }),
    expectFailure("future_provider_budget_too_high_fails", (candidate) => {
      candidate.max_provider_calls_after_authorization_cap = 4;
    }),
    expectFailure("missing_rollback_limitations_fails", (candidate) => {
      candidate.rollback_limitations_acknowledged = false;
    }),
    expectFailure("secret_boundary_weakened_fails", (candidate) => {
      candidate.side_effect_flags.secret_value_read_performed = true;
    }),
    expectFailure("side_effect_flag_true_fails", (candidate) => {
      candidate.side_effect_flags.provider_contact_performed = true;
    })
  ];

  plan.negative_cases = negativeCases;
  plan.negative_case_count = negativeCases.length;
  plan.caught_negative_case_count = negativeCases.filter((item) => item.result === "caught").length;
  plan.all_negative_cases_caught = negativeCases.every((item) => item.result === "caught" && item.expected_failure === true);

  return {
    v0_3_1_real_provider_cost_boundary_plan: plan
  };
}

function main() {
  const report = buildReport();
  const actual = report.v0_3_1_real_provider_cost_boundary_plan;

  if (process.argv.includes("--write-fixture")) {
    writeJson(fixturePath, report);
  }

  const expected = readJson(fixturePath);
  const actualAgain = buildReport();
  assertDeepEqual(actualAgain, report, "v0.3.1 deterministic output");
  assertDeepEqual(report, expected, "v0.3.1 fixture");
  assert(actual.negative_case_count >= 8, "at least eight negative cases are required");
  assert(actual.caught_negative_case_count === actual.negative_case_count, "all negative cases must be caught");
  assert(actual.all_negative_cases_caught === true, "all negative cases must be caught");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    phase: actual.phase,
    long_term_goal: actual.long_term_goal,
    deterministic_output_verified: true,
    fixture_verified: true,
    lane: actual.lane,
    execution_authorized_by_this_plan: actual.execution_authorized_by_this_plan,
    live_provider_call_allowed_now: actual.live_provider_call_allowed_now,
    image_generation_allowed_now: actual.image_generation_allowed_now,
    current_live_call_budget: actual.current_live_call_budget,
    current_cost_budget: actual.current_cost_budget,
    cost_cap_required: actual.cost_cap_required,
    cost_unknown_is_red: actual.cost_unknown_is_red,
    rollback_limitations_acknowledged: actual.rollback_limitations_acknowledged,
    negative_case_count: actual.negative_case_count,
    caught_negative_case_count: actual.caught_negative_case_count,
    all_negative_cases_caught: actual.all_negative_cases_caught,
    recommended_next: actual.recommended_next,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    runtime_probe_performed: false,
    secret_value_read_performed: false,
    push_tag_release_deploy_performed: false
  }, null, 2)}\n`);
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
  validatePlan
};
