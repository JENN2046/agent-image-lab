const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_3_2_live_candidate_action_packet";
const sourcePhase = "v0_3_1_real_provider_cost_boundary_plan";
const longTermGoal = "v0_3_controlled_real_provider_production_loop";
const fixturePath = "tests/schema_examples/v0_3_2_live_candidate_action_packet.example.json";

const requiredFields = [
  "provider_target",
  "plugin_id_or_provider_route",
  "model",
  "command",
  "visual_task_id",
  "prompt_package_ref",
  "max_provider_calls_greater_than_zero_and_within_cap",
  "max_image_candidates_greater_than_zero_and_within_cap",
  "retry_limit_within_cap",
  "cost_cap_amount",
  "cost_cap_currency",
  "output_directory",
  "receipt_path",
  "registry_path",
  "review_console_bridge_ref",
  "rollback_limitations_acknowledged",
  "owner_authorization_phrase"
];

const ownerAuthorizationPhrase = "批准填充 v0_3_2 候选包：使用 Codex 内置 image generation，生成 1 张夜景城市阳台竖屏时装人像，prompt_package_ref=prompts/image_generation/fashion_night_balcony_vertical_portrait_v1.yaml，max_provider_calls=1，max_image_candidates=1，retry_limit=0，成本上限为 1 usage unit；仅写入指定 output/receipt/registry 路径，不覆盖已有文件，不读 secret，不写 DailyNote/VCP memory，不 push/tag/release；审批人 Jenn。";

const stopConditions = [
  "missing_exact_provider_target",
  "missing_prompt_package",
  "missing_cost_cap",
  "unknown_or_uncapped_cost",
  "missing_output_directory",
  "output_path_collision_without_overwrite_authorization",
  "missing_receipt_or_registry_path",
  "missing_review_console_bridge_ref",
  "missing_rollback_limitations_acknowledgement",
  "owner_authorization_phrase_missing",
  "secret_value_required",
  "raw_request_or_response_capture_requested",
  "live_provider_or_plugin_or_api_or_image_action_requested_now",
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
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
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

function buildCanonicalPacket() {
  return {
    version: "v1",
    phase,
    long_term_goal: longTermGoal,
    source_phase: sourcePhase,
    lane: "Red-gated preflight",
    packet_id: "packet-v0-3-2-live-candidate-action-packet",
    task_id: "first_controlled_real_generation_candidate",
    packet_status: "filled_pending_v0_3_3_execution_gate",
    selected_task: "fill_first_live_candidate_action_packet_without_execution",
    execution_authorized_by_this_packet: false,
    live_provider_call_allowed_now: false,
    plugin_call_allowed_now: false,
    api_call_allowed_now: false,
    image_generation_allowed_now: false,
    output_write_allowed_now: false,
    daily_note_write_allowed_now: false,
    vcp_memory_write_allowed_now: false,
    runtime_probe_allowed_now: false,
    push_allowed_now: false,
    current_candidate_fields: {
      provider_target: "codex_builtin_image_generation",
      plugin_id_or_provider_route: "image_gen.imagegen",
      model: "managed_by_codex_image_tool",
      command: "generate",
      visual_task_id: "v0_3_3_first_codex_sample_generation",
      prompt_package_ref: "prompts/image_generation/fashion_night_balcony_vertical_portrait_v1.yaml",
      max_provider_calls: 1,
      max_image_candidates: 1,
      retry_limit: 0,
      cost_cap_amount: 1,
      cost_cap_currency: "usage_unit_or_lowest_available_quota",
      output_directory: "runs/real_generation/v0_3_3_codex_sample_first_trial/",
      receipt_path: "reports/provider_receipts/v0_3_3_codex_sample_first_trial_receipt.json",
      registry_path: "reports/provider_receipts/provider_receipt_registry.json",
      review_console_bridge_ref: "review_console/live_receipt_bridge/v0_3_3_codex_sample_first_trial",
      rollback_limitations_acknowledged: true,
      owner_authorization_phrase: ownerAuthorizationPhrase
    },
    missing_required_fields: [],
    filled_required_fields: requiredFields,
    current_execution_budgets: {
      provider_calls: 0,
      plugin_calls: 0,
      api_calls: 0,
      image_candidates: 0,
      runtime_probe_minutes: 0,
      cost_amount: 0,
      cost_currency: "not_applicable",
      cost_tracking_required: true,
      cost_unknown_is_red: true
    },
    candidate_fill_budgets: {
      provider_calls: 1,
      plugin_calls: 1,
      api_calls: 1,
      image_candidates: 1,
      retry_limit: 0,
      cost_cap_amount: 1,
      cost_cap_currency: "usage_unit_or_lowest_available_quota"
    },
    future_fill_limits: {
      max_provider_calls_cap: 1,
      max_plugin_calls_cap: 1,
      max_api_calls_cap: 1,
      max_image_candidates_cap: 1,
      retry_limit_cap: 0,
      overwrite_existing_files_allowed: false,
      secret_value_read_allowed: false,
      raw_private_data_print_allowed: false,
      raw_provider_payload_capture_allowed: false,
      raw_provider_response_capture_allowed: false
    },
    stop_conditions: stopConditions,
    side_effect_flags: sideEffectFlags,
    activation_blocked_by_missing_exact_owner_target: false,
    execution_still_requires_v0_3_3_gate: true,
    candidate_packet_reviewable: true,
    negative_cases: [],
    negative_case_count: 0,
    caught_negative_case_count: 0,
    all_negative_cases_caught: false,
    recommended_next: "v0_3_3_first_live_generation_pilot",
    next_phase_after_owner_fill: "v0_3_3_first_live_generation_pilot"
  };
}

function validatePacket(packet) {
  assert(packet.phase === phase, "phase mismatch");
  assert(packet.long_term_goal === longTermGoal, "long-term goal mismatch");
  assert(packet.source_phase === sourcePhase, "source phase mismatch");
  assert(packet.lane === "Red-gated preflight", "lane must be Red-gated preflight");
  assert(packet.packet_status === "filled_pending_v0_3_3_execution_gate", "packet must be filled but pending v0.3.3 execution gate");
  assert(packet.execution_authorized_by_this_packet === false, "packet must not authorize execution");
  assert(packet.live_provider_call_allowed_now === false, "live provider call must be blocked now");
  assert(packet.plugin_call_allowed_now === false, "plugin call must be blocked now");
  assert(packet.api_call_allowed_now === false, "API call must be blocked now");
  assert(packet.image_generation_allowed_now === false, "image generation must be blocked now");
  assert(packet.output_write_allowed_now === false, "output write must be blocked now");
  assert(packet.current_execution_budgets.provider_calls === 0, "current provider call budget must be zero");
  assert(packet.current_execution_budgets.plugin_calls === 0, "current plugin call budget must be zero");
  assert(packet.current_execution_budgets.api_calls === 0, "current API call budget must be zero");
  assert(packet.current_execution_budgets.image_candidates === 0, "current image candidate budget must be zero");
  assert(packet.current_execution_budgets.cost_amount === 0, "current cost budget must be zero");
  assert(packet.current_execution_budgets.cost_unknown_is_red === true, "unknown cost must remain Red");
  assert(packet.candidate_fill_budgets.provider_calls === 1, "candidate provider budget must be one-shot");
  assert(packet.candidate_fill_budgets.plugin_calls === 1, "candidate plugin budget must be one-shot");
  assert(packet.candidate_fill_budgets.api_calls === 1, "candidate API budget must be one-shot");
  assert(packet.candidate_fill_budgets.image_candidates === 1, "candidate image budget must be one-shot");
  assert(packet.candidate_fill_budgets.retry_limit === 0, "candidate retry limit must be zero");
  assert(packet.candidate_fill_budgets.cost_cap_amount === 1, "candidate cost cap amount mismatch");
  assert(packet.future_fill_limits.max_provider_calls_cap <= 1, "future provider cap must stay one-shot");
  assert(packet.future_fill_limits.max_plugin_calls_cap <= 1, "future plugin cap must stay one-shot");
  assert(packet.future_fill_limits.max_api_calls_cap <= 1, "future API cap must stay one-shot");
  assert(packet.future_fill_limits.max_image_candidates_cap <= 1, "future image cap must stay one-shot");
  assert(packet.future_fill_limits.retry_limit_cap === 0, "future retry cap must stay zero until separately authorized");
  assert(packet.future_fill_limits.overwrite_existing_files_allowed === false, "overwrite must remain false");
  assert(packet.future_fill_limits.secret_value_read_allowed === false, "secret reads must remain false");
  assert(packet.future_fill_limits.raw_private_data_print_allowed === false, "raw private data print must remain false");
  assert(packet.future_fill_limits.raw_provider_payload_capture_allowed === false, "raw provider payload capture must remain false");
  assert(packet.future_fill_limits.raw_provider_response_capture_allowed === false, "raw provider response capture must remain false");
  assert(packet.current_candidate_fields.provider_target === "codex_builtin_image_generation", "provider target mismatch");
  assert(packet.current_candidate_fields.plugin_id_or_provider_route === "image_gen.imagegen", "provider route mismatch");
  assert(packet.current_candidate_fields.model === "managed_by_codex_image_tool", "model mismatch");
  assert(packet.current_candidate_fields.command === "generate", "command mismatch");
  assert(packet.current_candidate_fields.visual_task_id === "v0_3_3_first_codex_sample_generation", "visual task mismatch");
  assert(packet.current_candidate_fields.prompt_package_ref === "prompts/image_generation/fashion_night_balcony_vertical_portrait_v1.yaml", "prompt package mismatch");
  assert(fs.existsSync(path.join(root, packet.current_candidate_fields.prompt_package_ref)), "prompt package file must exist");
  assert(packet.current_candidate_fields.output_directory === "runs/real_generation/v0_3_3_codex_sample_first_trial/", "output directory mismatch");
  const outputDirectoryExists = fs.existsSync(path.join(root, packet.current_candidate_fields.output_directory));
  const v0_3_3ReceiptExists = fs.existsSync(path.join(root, "reports/provider_receipts/v0_3_3_codex_sample_first_trial_receipt.json"));
  assert(!outputDirectoryExists || v0_3_3ReceiptExists, "output directory may exist only after a recorded v0.3.3 attempt");
  assert(packet.current_candidate_fields.rollback_limitations_acknowledged === true, "rollback acknowledgement must be true");
  assert(packet.current_candidate_fields.owner_authorization_phrase === ownerAuthorizationPhrase, "owner authorization phrase mismatch");
  assert(packet.current_candidate_fields.owner_authorization_phrase.includes("夜景城市阳台竖屏时装人像"), "owner phrase must match prompt subject");
  assert(!packet.current_candidate_fields.owner_authorization_phrase.includes("still life"), "owner phrase must not drift to still life");
  assertDeepEqual(packet.missing_required_fields, [], "missing required fields");
  assertDeepEqual(packet.filled_required_fields, requiredFields, "filled required fields");
  assertDeepEqual(packet.stop_conditions, stopConditions, "stop conditions");
  assertFalseFlags(packet.side_effect_flags);
  assert(packet.activation_blocked_by_missing_exact_owner_target === false, "activation should no longer be blocked by missing exact owner target");
  assert(packet.execution_still_requires_v0_3_3_gate === true, "execution must still require v0.3.3 gate");
  assert(packet.candidate_packet_reviewable === true, "packet should be reviewable");
}

function expectFailure(caseId, mutate) {
  const packet = clone(buildCanonicalPacket());
  mutate(packet);
  try {
    validatePacket(packet);
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

function validateDocsAndStatus() {
  const longTermDoc = read("docs/V0_3_CONTROLLED_REAL_PROVIDER_PRODUCTION_LOOP.md");
  const packetDoc = read("docs/V0_3_2_LIVE_CANDIDATE_ACTION_PACKET.md");
  const roadmap = read("docs/00_project_roadmap.md");
  const runState = read(".agent_board/RUN_STATE.md");
  const taskQueue = read(".agent_board/TASK_QUEUE.md");
  const checkpoint = read(".agent_board/CHECKPOINT.md");
  const handoff = read(".agent_board/HANDOFF.md");
  const ledger = read(".agent_board/AUTOPILOT_LEDGER.md");
  const combined = [longTermDoc, packetDoc, roadmap, runState, taskQueue, checkpoint, handoff, ledger].join("\n");
  const v0_3_2_only = packetDoc;

  for (const token of [
    phase,
    longTermGoal,
    sourcePhase,
    "packet_status: filled_pending_v0_3_3_execution_gate",
    "execution_authorized_by_this_packet: false",
    "live_provider_call_allowed_now: false",
    "image_generation_allowed_now: false",
    "activation_blocked_by_missing_exact_owner_target: false",
    "execution_still_requires_v0_3_3_gate: true",
    "v0_3_3_first_live_generation_pilot"
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
    assert(!v0_3_2_only.includes(forbidden), `forbidden v0.3.2 execution token present: ${forbidden}`);
  }
}

function buildReport() {
  const packet = buildCanonicalPacket();
  validatePacket(packet);
  validateDocsAndStatus();

  const negativeCases = [
    expectFailure("execution_authorized_by_packet_fails", (candidate) => {
      candidate.execution_authorized_by_this_packet = true;
    }),
    expectFailure("live_provider_call_allowed_now_fails", (candidate) => {
      candidate.live_provider_call_allowed_now = true;
    }),
    expectFailure("provider_target_drift_fails", (candidate) => {
      candidate.current_candidate_fields.provider_target = "invented_provider";
    }),
    expectFailure("current_provider_budget_nonzero_fails", (candidate) => {
      candidate.current_execution_budgets.provider_calls = 1;
    }),
    expectFailure("future_provider_cap_too_high_fails", (candidate) => {
      candidate.future_fill_limits.max_provider_calls_cap = 2;
    }),
    expectFailure("cost_unknown_not_red_fails", (candidate) => {
      candidate.current_execution_budgets.cost_unknown_is_red = false;
    }),
    expectFailure("overwrite_allowed_fails", (candidate) => {
      candidate.future_fill_limits.overwrite_existing_files_allowed = true;
    }),
    expectFailure("raw_provider_payload_capture_allowed_fails", (candidate) => {
      candidate.future_fill_limits.raw_provider_payload_capture_allowed = true;
    }),
    expectFailure("owner_phrase_subject_drift_fails", (candidate) => {
      candidate.current_candidate_fields.owner_authorization_phrase = candidate.current_candidate_fields.owner_authorization_phrase.replace("夜景城市阳台竖屏时装人像", "示例 still life 图");
    }),
    expectFailure("side_effect_flag_true_fails", (candidate) => {
      candidate.side_effect_flags.image_generation_performed = true;
    })
  ];

  packet.negative_cases = negativeCases;
  packet.negative_case_count = negativeCases.length;
  packet.caught_negative_case_count = negativeCases.filter((item) => item.result === "caught").length;
  packet.all_negative_cases_caught = negativeCases.every((item) => item.result === "caught" && item.expected_failure === true);

  return {
    v0_3_2_live_candidate_action_packet: packet
  };
}

function main() {
  const report = buildReport();
  const actual = report.v0_3_2_live_candidate_action_packet;

  if (process.argv.includes("--write-fixture")) {
    writeJson(fixturePath, report);
  }

  const expected = readJson(fixturePath);
  const actualAgain = buildReport();
  assertDeepEqual(actualAgain, report, "v0.3.2 deterministic output");
  assertDeepEqual(report, expected, "v0.3.2 fixture");
  assert(actual.negative_case_count >= 10, "at least ten negative cases are required");
  assert(actual.caught_negative_case_count === actual.negative_case_count, "all negative cases must be caught");
  assert(actual.all_negative_cases_caught === true, "all negative cases must be caught");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    phase: actual.phase,
    long_term_goal: actual.long_term_goal,
    source_phase: actual.source_phase,
    deterministic_output_verified: true,
    fixture_verified: true,
    lane: actual.lane,
    packet_status: actual.packet_status,
    execution_authorized_by_this_packet: actual.execution_authorized_by_this_packet,
    live_provider_call_allowed_now: actual.live_provider_call_allowed_now,
    image_generation_allowed_now: actual.image_generation_allowed_now,
    current_live_call_budget: actual.current_execution_budgets.provider_calls,
    candidate_provider_call_budget: actual.candidate_fill_budgets.provider_calls,
    candidate_image_budget: actual.candidate_fill_budgets.image_candidates,
    current_cost_budget: actual.current_execution_budgets.cost_amount,
    candidate_cost_cap_amount: actual.candidate_fill_budgets.cost_cap_amount,
    cost_unknown_is_red: actual.current_execution_budgets.cost_unknown_is_red,
    activation_blocked_by_missing_exact_owner_target: actual.activation_blocked_by_missing_exact_owner_target,
    execution_still_requires_v0_3_3_gate: actual.execution_still_requires_v0_3_3_gate,
    missing_required_field_count: actual.missing_required_fields.length,
    filled_required_field_count: actual.filled_required_fields.length,
    negative_case_count: actual.negative_case_count,
    caught_negative_case_count: actual.caught_negative_case_count,
    all_negative_cases_caught: actual.all_negative_cases_caught,
    recommended_next: actual.recommended_next,
    next_phase_after_owner_fill: actual.next_phase_after_owner_fill,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    runtime_probe_performed: false,
    real_manifest_read_performed: false,
    real_vcpchat_read_performed: false,
    real_vcptoolbox_read_performed: false,
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
  validatePacket
};
