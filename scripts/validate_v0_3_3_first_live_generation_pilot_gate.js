const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const phase = "v0_3_3_first_live_generation_pilot";
const sourcePhase = "v0_3_2_live_candidate_action_packet";
const longTermGoal = "v0_3_controlled_real_provider_production_loop";
const fixturePath = "tests/schema_examples/v0_3_3_first_live_generation_pilot_gate.example.json";
const promptPackageRef = "prompts/image_generation/fashion_night_balcony_vertical_portrait_v1.yaml";
const outputDirectory = "runs/real_generation/v0_3_3_codex_sample_first_trial/";
const receiptPath = "reports/provider_receipts/v0_3_3_codex_sample_first_trial_receipt.json";
const registryPath = "reports/provider_receipts/provider_receipt_registry.json";
const attemptResultPath = "runs/real_generation/v0_3_3_codex_sample_first_trial/generation_attempt_result.json";
const visualAssetAuthorizationRegistryPath = "assets/visual_asset_authorization_registry.example.json";
const v034PolicyDocPath = "docs/V0_3_4_VISUAL_ASSET_GOVERNANCE_AND_RECEIPT_STATE_RECONCILIATION.md";
const visualAssetPolicyVersion = "visual_asset_policy_v0_3_4a";
const visualAssetClassEnum = [
  "runs_artifact",
  "user_authorized_test_image",
  "review_candidate",
  "eval_seed_candidate",
  "accepted_sample",
  "production_candidate"
];

const attemptRecords = [
  {
    id: "first_trial",
    status: "failed_no_image_generated",
    receipt_path: receiptPath,
    attempt_result_path: attemptResultPath,
    output_image_path: null
  },
  {
    id: "retry_001",
    status: "failed_no_image_generated",
    receipt_path: "reports/provider_receipts/v0_3_3_retry_001_receipt.json",
    attempt_result_path: "runs/real_generation/v0_3_3_retry_001_codex_sample/generation_attempt_result.json",
    output_image_path: null
  },
  {
    id: "smoke_001_neutral",
    status: "succeeded_image_generated",
    receipt_path: "reports/provider_receipts/v0_3_3_smoke_001_neutral_receipt.json",
    attempt_result_path: "runs/real_generation/v0_3_3_smoke_001_neutral/generation_attempt_result.json",
    output_image_path: "runs/real_generation/v0_3_3_smoke_001_neutral/neutral_smoke_test_red_apple_v1.png"
  },
  {
    id: "safe_portrait_001",
    status: "succeeded_image_generated",
    receipt_path: "reports/provider_receipts/v0_3_3_safe_portrait_001_receipt.json",
    attempt_result_path: "runs/real_generation/v0_3_3_safe_portrait_001/generation_attempt_result.json",
    output_image_path: "runs/real_generation/v0_3_3_safe_portrait_001/safe_adult_editorial_portrait_v1.png"
  }
];

const requiredBeforeImageGeneration = [
  "exact_owner_authorization_phrase_for_v0_3_3_execution",
  "output_directory_creation_and_no_overwrite_plan",
  "receipt_write_plan",
  "provider_receipt_registry_update_plan",
  "image_tool_output_capture_or_manual_artifact_binding_plan",
  "post_generation_review_console_bridge_plan",
  "no_secret_read_confirmation",
  "no_raw_provider_payload_or_response_capture_confirmation",
  "one_provider_call_one_image_candidate_zero_retry_confirmation"
];

const stopConditions = [
  "missing_exact_v0_3_3_execution_authorization",
  "missing_prompt_package",
  "prompt_package_subject_mismatch",
  "output_path_collision_without_overwrite_authorization",
  "receipt_path_collision_without_overwrite_authorization",
  "missing_receipt_or_registry_write_plan",
  "missing_image_tool_output_capture_plan",
  "unknown_or_uncapped_cost",
  "retry_requested",
  "secret_value_required",
  "raw_request_or_response_capture_requested",
  "provider_or_image_call_requested_before_gate_passes",
  "push_tag_release_deploy_requested",
  "validation_failure_requiring_judgment"
];

const sideEffectFlags = {
  provider_contact_performed: true,
  plugin_call_performed: true,
  api_call_performed: false,
  image_generation_performed: false,
  output_directory_created: true,
  receipt_written: true,
  registry_written: true,
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

function validateSideEffectFlags(flags) {
  assert(flags.provider_contact_performed === true, "provider contact must be recorded as performed");
  assert(flags.plugin_call_performed === true, "plugin call must be recorded as performed");
  assert(flags.output_directory_created === true, "output directory creation must be recorded");
  assert(flags.receipt_written === true, "receipt write must be recorded");
  assert(flags.registry_written === true, "registry write must be recorded");
  for (const key of [
    "api_call_performed",
    "image_generation_performed",
    "DailyNote_write_performed",
    "VCP_memory_write_performed",
    "runtime_probe_performed",
    "real_manifest_read_performed",
    "real_vcpchat_read_performed",
    "real_vcptoolbox_read_performed",
    "secret_value_read_performed",
    "push_tag_release_deploy_performed"
  ]) {
    assert(flags[key] === false, `${key} must remain false`);
  }
}

function buildCanonicalGate() {
  return {
    version: "v1",
    phase,
    long_term_goal: longTermGoal,
    source_phase: sourcePhase,
    lane: "Red-to-Amber execution gate",
    gate_id: "gate-v0-3-3-first-live-generation-pilot",
    packet_id: "packet-v0-3-2-live-candidate-action-packet",
    visual_task_id: "v0_3_3_first_codex_sample_generation",
    gate_status: "attempted_failed_no_retry",
    candidate_packet_status: "filled_pending_v0_3_3_execution_gate",
    execution_authorized_by_this_gate: true,
    live_provider_call_allowed_now: false,
    plugin_call_allowed_now: false,
    api_call_allowed_now: false,
    image_generation_allowed_now: false,
    output_write_allowed_now: false,
    receipt_write_allowed_now: false,
    registry_write_allowed_now: false,
    daily_note_write_allowed_now: false,
    vcp_memory_write_allowed_now: false,
    runtime_probe_allowed_now: false,
    push_allowed_now: false,
    candidate_inputs: {
      provider_target: "codex_builtin_image_generation",
      plugin_id_or_provider_route: "image_gen.imagegen",
      model: "managed_by_codex_image_tool",
      command: "generate",
      prompt_package_ref: promptPackageRef,
      prompt_package_id: "fashion_night_balcony_vertical_portrait_v1",
      visual_task_id: "v0_3_3_first_codex_sample_generation",
      output_directory: outputDirectory,
      receipt_path: receiptPath,
      registry_path: registryPath,
      review_console_bridge_ref: "review_console/live_receipt_bridge/v0_3_3_codex_sample_first_trial",
      max_provider_calls: 1,
      max_plugin_calls: 1,
      max_api_calls: 1,
      max_image_candidates: 1,
      retry_limit: 0,
      cost_cap_amount: 1,
      cost_cap_currency: "usage_unit_or_lowest_available_quota",
      rollback_limitations_acknowledged: true,
      overwrite_existing_files_allowed: false,
      secret_value_read_allowed: false,
      raw_private_data_print_allowed: false,
      raw_provider_payload_capture_allowed: false,
      raw_provider_response_capture_allowed: false
    },
    gate_readiness: {
      v0_3_2_packet_filled: true,
      prompt_package_exists: true,
      prompt_package_allows_generation_by_itself: false,
      output_directory_exists_now: true,
      receipt_file_exists_now: true,
      output_path_collision: false,
      receipt_path_collision: false,
      registry_parent_write_plan_checked: true,
      image_tool_output_capture_plan_checked: true,
      exact_v0_3_3_execution_authorization_present: true,
      execution_runner_available_and_bound: true,
      can_execute_now: false,
      provider_calls_used: 1,
      image_candidates_generated: 0,
      failure_class: "provider_tool_user_error"
    },
    receipt_reconciliation: {
      failed_attempt_count: 2,
      succeeded_diagnostic_count: 2,
      total_attempt_result_count: 4,
      diagnostic_image_candidates_generated: 2,
      user_authorized_png_upload_count: 2,
      visual_asset_authorization_registry_ref: visualAssetAuthorizationRegistryPath,
      generated_image_binary_commit_policy_ref: v034PolicyDocPath,
      visual_asset_policy_version: visualAssetPolicyVersion,
      asset_class_enum: visualAssetClassEnum,
      runs_artifact_boundary: "diagnostic provider-run evidence, not durable review asset by default",
      runs_artifact_count: 1,
      user_authorized_test_image_count: 1,
      memory_seed_true_count: 0,
      invalid_memory_seed_count: 0,
      durable_review_asset_requires_separate_gate: true,
      production_candidate_write_allowed_by_v0_3_4: false
    },
    current_execution_budgets: {
      provider_calls: 0,
      plugin_calls: 0,
      api_calls: 0,
      image_candidates: 0,
      runtime_probe_minutes: 0,
      cost_amount: 0,
      cost_currency: "not_applicable",
      cost_unknown_is_red: true
    },
    candidate_budget_if_activated: {
      provider_calls: 1,
      plugin_calls: 1,
      api_calls: 1,
      image_candidates: 1,
      retry_limit: 0,
      cost_cap_amount: 1,
      cost_cap_currency: "usage_unit_or_lowest_available_quota"
    },
    required_before_image_generation: requiredBeforeImageGeneration,
    stop_conditions: stopConditions,
    side_effect_flags: sideEffectFlags,
    negative_cases: [],
    negative_case_count: 0,
    caught_negative_case_count: 0,
    all_negative_cases_caught: false,
    recommended_next: "inspect_failed_provider_tool_attempt_or_authorize_new_trial"
  };
}

function validatePromptPackage(gate) {
  const promptPackage = read(gate.candidate_inputs.prompt_package_ref);
  assert(promptPackage.includes("prompt_package_id: fashion_night_balcony_vertical_portrait_v1"), "prompt package id mismatch");
  assert(promptPackage.includes("aspect_ratio: \"9:16\""), "prompt package must preserve vertical 9:16 aspect ratio");
  assert(promptPackage.includes("image_generation_allowed_by_this_file: false"), "prompt package must not self-authorize generation");
  assert(promptPackage.includes("adult woman"), "prompt package must describe adult subject");
  assert(!promptPackage.includes("BLACKEDRAW"), "prompt package must not include source watermark text");
}

function validateGate(gate) {
  assert(gate.phase === phase, "phase mismatch");
  assert(gate.long_term_goal === longTermGoal, "long-term goal mismatch");
  assert(gate.source_phase === sourcePhase, "source phase mismatch");
  assert(gate.lane === "Red-to-Amber execution gate", "lane mismatch");
  assert(gate.gate_status === "attempted_failed_no_retry", "gate status mismatch");
  assert(gate.candidate_packet_status === "filled_pending_v0_3_3_execution_gate", "candidate packet status mismatch");
  assert(gate.execution_authorized_by_this_gate === true, "this gate must record execution authorization");
  assert(gate.live_provider_call_allowed_now === false, "provider call must be blocked now");
  assert(gate.plugin_call_allowed_now === false, "plugin call must be blocked now");
  assert(gate.api_call_allowed_now === false, "API call must be blocked now");
  assert(gate.image_generation_allowed_now === false, "image generation must be blocked now");
  assert(gate.output_write_allowed_now === false, "output write must be blocked now");
  assert(gate.receipt_write_allowed_now === false, "receipt write must be blocked now");
  assert(gate.registry_write_allowed_now === false, "registry write must be blocked now");
  assert(gate.daily_note_write_allowed_now === false, "DailyNote write must be blocked now");
  assert(gate.vcp_memory_write_allowed_now === false, "VCP memory write must be blocked now");
  assert(gate.runtime_probe_allowed_now === false, "runtime probe must be blocked now");
  assert(gate.push_allowed_now === false, "push must be blocked now");
  assert(gate.candidate_inputs.provider_target === "codex_builtin_image_generation", "provider target mismatch");
  assert(gate.candidate_inputs.plugin_id_or_provider_route === "image_gen.imagegen", "provider route mismatch");
  assert(gate.candidate_inputs.model === "managed_by_codex_image_tool", "model mismatch");
  assert(gate.candidate_inputs.command === "generate", "command mismatch");
  assert(gate.candidate_inputs.prompt_package_ref === promptPackageRef, "prompt package ref mismatch");
  assert(fs.existsSync(path.join(root, gate.candidate_inputs.prompt_package_ref)), "prompt package must exist");
  validatePromptPackage(gate);
  assert(gate.candidate_inputs.output_directory === outputDirectory, "output directory mismatch");
  assert(gate.candidate_inputs.receipt_path === receiptPath, "receipt path mismatch");
  assert(gate.candidate_inputs.registry_path === registryPath, "registry path mismatch");
  assert(fs.existsSync(path.join(root, gate.candidate_inputs.output_directory)), "output directory must exist after attempt");
  assert(fs.existsSync(path.join(root, gate.candidate_inputs.receipt_path)), "receipt file must exist after attempt");
  assert(fs.existsSync(path.join(root, registryPath)), "registry file must exist after attempt");
  assert(fs.existsSync(path.join(root, attemptResultPath)), "attempt result file must exist after attempt");
  assert(gate.candidate_inputs.max_provider_calls === 1, "provider call budget must be one");
  assert(gate.candidate_inputs.max_plugin_calls === 1, "plugin call budget must be one");
  assert(gate.candidate_inputs.max_api_calls === 1, "API call budget must be one");
  assert(gate.candidate_inputs.max_image_candidates === 1, "image candidate budget must be one");
  assert(gate.candidate_inputs.retry_limit === 0, "retry limit must be zero");
  assert(gate.candidate_inputs.cost_cap_amount === 1, "cost cap amount mismatch");
  assert(gate.candidate_inputs.rollback_limitations_acknowledged === true, "rollback acknowledgement must be true");
  assert(gate.candidate_inputs.overwrite_existing_files_allowed === false, "overwrite must stay blocked");
  assert(gate.candidate_inputs.secret_value_read_allowed === false, "secret reads must stay blocked");
  assert(gate.candidate_inputs.raw_private_data_print_allowed === false, "raw private data printing must stay blocked");
  assert(gate.candidate_inputs.raw_provider_payload_capture_allowed === false, "raw provider payload capture must stay blocked");
  assert(gate.candidate_inputs.raw_provider_response_capture_allowed === false, "raw provider response capture must stay blocked");
  assert(gate.gate_readiness.v0_3_2_packet_filled === true, "v0.3.2 packet must be filled");
  assert(gate.gate_readiness.prompt_package_exists === true, "prompt package readiness mismatch");
  assert(gate.gate_readiness.prompt_package_allows_generation_by_itself === false, "prompt package must not self-authorize generation");
  assert(gate.gate_readiness.output_directory_exists_now === true, "output directory must exist now");
  assert(gate.gate_readiness.receipt_file_exists_now === true, "receipt file must exist now");
  assert(gate.gate_readiness.output_path_collision === false, "output path collision must be false");
  assert(gate.gate_readiness.receipt_path_collision === false, "receipt path collision must be false");
  assert(gate.gate_readiness.registry_parent_write_plan_checked === true, "registry write plan must be checked");
  assert(gate.gate_readiness.image_tool_output_capture_plan_checked === true, "image tool capture plan must be checked");
  assert(gate.gate_readiness.exact_v0_3_3_execution_authorization_present === true, "exact v0.3.3 execution authorization must be present");
  assert(gate.gate_readiness.execution_runner_available_and_bound === true, "execution runner must be bound");
  assert(gate.gate_readiness.can_execute_now === false, "gate must not be executable now");
  assert(gate.gate_readiness.provider_calls_used === 1, "provider call must be consumed");
  assert(gate.gate_readiness.image_candidates_generated === 0, "no image candidate should be generated");
  assert(gate.gate_readiness.failure_class === "provider_tool_user_error", "failure class mismatch");
  assert(gate.receipt_reconciliation.failed_attempt_count === 2, "failed attempt count mismatch");
  assert(gate.receipt_reconciliation.succeeded_diagnostic_count === 2, "succeeded diagnostic count mismatch");
  assert(gate.receipt_reconciliation.total_attempt_result_count === 4, "total attempt result count mismatch");
  assert(gate.receipt_reconciliation.diagnostic_image_candidates_generated === 2, "diagnostic image candidate count mismatch");
  assert(gate.receipt_reconciliation.user_authorized_png_upload_count === 2, "authorized PNG count mismatch");
  assert(gate.receipt_reconciliation.visual_asset_authorization_registry_ref === visualAssetAuthorizationRegistryPath, "asset authorization registry ref mismatch");
  assert(gate.receipt_reconciliation.generated_image_binary_commit_policy_ref === v034PolicyDocPath, "binary policy ref mismatch");
  assert(gate.receipt_reconciliation.visual_asset_policy_version === visualAssetPolicyVersion, "visual asset policy version mismatch");
  assertDeepEqual(gate.receipt_reconciliation.asset_class_enum, visualAssetClassEnum, "asset class enum");
  assert(gate.receipt_reconciliation.runs_artifact_count === 1, "runs artifact count mismatch");
  assert(gate.receipt_reconciliation.user_authorized_test_image_count === 1, "user authorized test image count mismatch");
  assert(gate.receipt_reconciliation.memory_seed_true_count === 0, "memory seed count must stay zero");
  assert(gate.receipt_reconciliation.invalid_memory_seed_count === 0, "invalid memory seed count must stay zero");
  assert(gate.receipt_reconciliation.durable_review_asset_requires_separate_gate === true, "durable review asset boundary mismatch");
  assert(gate.receipt_reconciliation.production_candidate_write_allowed_by_v0_3_4 === false, "production candidate must be blocked by v0.3.4");
  assert(gate.current_execution_budgets.provider_calls === 0, "current provider budget must be zero");
  assert(gate.current_execution_budgets.plugin_calls === 0, "current plugin budget must be zero");
  assert(gate.current_execution_budgets.api_calls === 0, "current API budget must be zero");
  assert(gate.current_execution_budgets.image_candidates === 0, "current image budget must be zero");
  assert(gate.current_execution_budgets.cost_amount === 0, "current cost budget must be zero");
  assert(gate.current_execution_budgets.cost_unknown_is_red === true, "unknown cost must remain Red");
  assert(gate.candidate_budget_if_activated.provider_calls === 1, "activation provider budget mismatch");
  assert(gate.candidate_budget_if_activated.image_candidates === 1, "activation image budget mismatch");
  assert(gate.candidate_budget_if_activated.retry_limit === 0, "activation retry budget mismatch");
  assertDeepEqual(gate.required_before_image_generation, requiredBeforeImageGeneration, "required before image generation");
  assertDeepEqual(gate.stop_conditions, stopConditions, "stop conditions");
  validateSideEffectFlags(gate.side_effect_flags);
  validateReceiptAndRegistry();
  validateAttemptRecords();
  validateVisualAssetAuthorizationRegistry(gate);
  assert(gate.recommended_next === "inspect_failed_provider_tool_attempt_or_authorize_new_trial", "recommended next mismatch");
}

function validateReceiptAndRegistry() {
  const receipt = readJson(receiptPath);
  const registry = readJson(registryPath);
  const attempt = readJson(attemptResultPath);
  assert(receipt.status === "failed_no_image_generated", "receipt status mismatch");
  assert(receipt.calls_used.provider_calls === 1, "receipt provider calls mismatch");
  assert(receipt.calls_used.image_candidates_generated === 0, "receipt image candidate mismatch");
  assert(receipt.calls_used.retries_used === 0, "receipt retries mismatch");
  assert(receipt.failure.retry_allowed === false, "receipt retry must be blocked");
  assert(receipt.output_image_path === null, "receipt must not claim an output image");
  assert(attempt.attempt_status === "failed_no_image_generated", "attempt status mismatch");
  assert(attempt.provider_calls_used === 1, "attempt provider calls mismatch");
  assert(attempt.image_candidates_generated === 0, "attempt image candidates mismatch");
  assert(attempt.output_image_path === null, "attempt must not claim output image");
  assert(Array.isArray(registry.entries) && registry.entries.length === 1, "registry must contain one entry");
  assert(registry.entries[0].receipt_path === receiptPath, "registry receipt path mismatch");
  assert(registry.entries[0].attempt_result_path === attemptResultPath, "registry attempt result path mismatch");
  assert(registry.entries[0].status === "failed_no_image_generated", "registry status mismatch");
}

function validateAttemptRecords() {
  const failed = [];
  const succeeded = [];
  for (const record of attemptRecords) {
    assert(fs.existsSync(path.join(root, record.receipt_path)), `receipt missing: ${record.receipt_path}`);
    assert(fs.existsSync(path.join(root, record.attempt_result_path)), `attempt result missing: ${record.attempt_result_path}`);
    const receipt = readJson(record.receipt_path);
    const attempt = readJson(record.attempt_result_path);
    assert(receipt.status === record.status, `receipt status mismatch: ${record.id}`);
    assert(attempt.attempt_status === record.status, `attempt status mismatch: ${record.id}`);
    assert(receipt.attempt_result_path === record.attempt_result_path, `receipt attempt path mismatch: ${record.id}`);
    assert(attempt.output_image_path === record.output_image_path, `attempt output path mismatch: ${record.id}`);
    if (record.output_image_path) {
      assert(receipt.output_image_path === record.output_image_path, `receipt output path mismatch: ${record.id}`);
      assert(fs.existsSync(path.join(root, record.output_image_path)), `output image missing: ${record.output_image_path}`);
      assert(receipt.source_image_path_redacted === true, `receipt source path must be redacted: ${record.id}`);
      succeeded.push(record);
    } else {
      assert(receipt.output_image_path === null, `failed receipt must not bind output: ${record.id}`);
      failed.push(record);
    }
  }
  assert(failed.length === 2, "failed attempt count must be two");
  assert(succeeded.length === 2, "succeeded diagnostic count must be two");
}

function validateVisualAssetAuthorizationRegistry(gate) {
  assert(fs.existsSync(path.join(root, visualAssetAuthorizationRegistryPath)), "visual asset authorization registry must exist");
  assert(fs.existsSync(path.join(root, v034PolicyDocPath)), "v0.3.4 policy doc must exist");
  const registry = readJson(visualAssetAuthorizationRegistryPath);
  assert(registry.phase === "v0_3_4_visual_asset_governance_and_receipt_state_reconciliation", "asset registry phase mismatch");
  assert(registry.visual_asset_policy_version === visualAssetPolicyVersion, "asset registry policy version mismatch");
  assert(registry.pushed_commit === "bf5e54e", "asset registry must record pushed commit bf5e54e");
  assert(registry.binary_commit_policy_id === "generated_image_binary_commit_policy_v1", "binary commit policy id mismatch");
  assertDeepEqual(registry.asset_boundary.asset_class_enum, visualAssetClassEnum, "asset registry class enum");
  assert(registry.asset_boundary.memory_seed_requires_memory_gate === true, "asset registry must require memory gate for memory_seed");
  assert(registry.asset_boundary.VCP_memory_write_allowed_now === false, "asset registry must keep VCP memory writes unauthorized now");
  assert(Array.isArray(registry.entries) && registry.entries.length === gate.receipt_reconciliation.user_authorized_png_upload_count, "authorized PNG registry count mismatch");
  const classCounts = registry.entries.reduce((counts, entry) => {
    counts[entry.asset_class] = (counts[entry.asset_class] || 0) + 1;
    return counts;
  }, {});
  for (const entry of registry.entries) {
    assert(entry.upload_authorized_by_user === true, `asset upload must be user authorized: ${entry.asset_id}`);
    assert(entry.owner_authorized_upload === undefined || entry.owner_authorized_upload === entry.upload_authorized_by_user, `asset upload alias drift: ${entry.asset_id}`);
    assert(visualAssetClassEnum.includes(entry.asset_class), `asset class must be valid: ${entry.asset_id}`);
    assert(entry.asset_role === "runs_artifact", `asset role mismatch: ${entry.asset_id}`);
    assert(entry.durable_review_asset === false, `asset must not self-claim durable review status: ${entry.asset_id}`);
    assert(entry.accepted_sample === false, `asset must not self-claim accepted sample status: ${entry.asset_id}`);
    assert(entry.production_candidate === false, `asset must not self-claim production candidate status: ${entry.asset_id}`);
    assert(entry.memory_seed === false, `asset must not self-claim memory seed status: ${entry.asset_id}`);
    assert(entry.source_image_path_redacted === true, `asset source path redaction missing: ${entry.asset_id}`);
  }
  assert(classCounts.runs_artifact === gate.receipt_reconciliation.runs_artifact_count, "runs artifact registry count mismatch");
  assert(classCounts.user_authorized_test_image === gate.receipt_reconciliation.user_authorized_test_image_count, "user authorized test image registry count mismatch");
}

function expectFailure(caseId, mutate) {
  const gate = clone(buildCanonicalGate());
  mutate(gate);
  try {
    validateGate(gate);
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
  const gateDoc = read("docs/V0_3_3_FIRST_LIVE_GENERATION_PILOT_GATE.md");
  const packetDoc = read("docs/V0_3_2_LIVE_CANDIDATE_ACTION_PACKET.md");
  const longTermDoc = read("docs/V0_3_CONTROLLED_REAL_PROVIDER_PRODUCTION_LOOP.md");
  const v034Doc = read(v034PolicyDocPath);
  const roadmap = read("docs/00_project_roadmap.md");
  const runState = read(".agent_board/RUN_STATE.md");
  const taskQueue = read(".agent_board/TASK_QUEUE.md");
  const checkpoint = read(".agent_board/CHECKPOINT.md");
  const handoff = read(".agent_board/HANDOFF.md");
  const ledger = read(".agent_board/AUTOPILOT_LEDGER.md");
  const combined = [gateDoc, packetDoc, longTermDoc, v034Doc, roadmap, runState, taskQueue, checkpoint, handoff, ledger].join("\n");

  for (const token of [
    phase,
    sourcePhase,
    longTermGoal,
    "gate_status: attempted_failed_no_retry",
    "candidate_packet_status: filled_pending_v0_3_3_execution_gate",
    "execution_authorized_by_this_gate: true",
    "live_provider_call_allowed_now: false",
    "image_generation_allowed_now: false",
    "output_write_allowed_now: false",
    "receipt_write_allowed_now: false",
    "registry_write_allowed_now: false",
    "actual_image_generation_performed: false",
    "provider_contact_performed: true",
    "receipt_written: true",
    "registry_written: true",
    "failed_attempt_count: 2",
    "succeeded_diagnostic_count: 2",
    "asset_authorization_registry_ref: assets/visual_asset_authorization_registry.example.json",
    "generated_image_binary_commit_policy_v1",
    "recommended_next: inspect_failed_provider_tool_attempt_or_authorize_new_trial"
  ]) {
    assert(combined.includes(token), `missing required status token: ${token}`);
  }

  for (const forbidden of [
    "api_call_performed: true",
    "image_generation_performed: true",
    "secret_value_read_performed: true",
    "push_tag_release_deploy_performed: true"
  ]) {
    assert(!combined.includes(forbidden), `forbidden execution token present: ${forbidden}`);
  }
}

function buildReport() {
  const gate = buildCanonicalGate();
  validateGate(gate);
  validateDocsAndStatus();

  const negativeCases = [
    expectFailure("execution_not_authorized_fails", (candidate) => {
      candidate.execution_authorized_by_this_gate = false;
    }),
    expectFailure("image_generation_allowed_now_fails", (candidate) => {
      candidate.image_generation_allowed_now = true;
    }),
    expectFailure("output_write_allowed_now_fails", (candidate) => {
      candidate.output_write_allowed_now = true;
    }),
    expectFailure("prompt_package_missing_fails", (candidate) => {
      candidate.candidate_inputs.prompt_package_ref = "prompts/image_generation/missing.yaml";
    }),
    expectFailure("provider_budget_zero_drift_fails", (candidate) => {
      candidate.current_execution_budgets.provider_calls = 1;
    }),
    expectFailure("retry_budget_nonzero_fails", (candidate) => {
      candidate.candidate_inputs.retry_limit = 1;
    }),
    expectFailure("overwrite_allowed_fails", (candidate) => {
      candidate.candidate_inputs.overwrite_existing_files_allowed = true;
    }),
    expectFailure("raw_provider_response_capture_allowed_fails", (candidate) => {
      candidate.candidate_inputs.raw_provider_response_capture_allowed = true;
    }),
    expectFailure("missing_image_tool_capture_plan_fails", (candidate) => {
      candidate.gate_readiness.image_tool_output_capture_plan_checked = false;
    }),
    expectFailure("missing_provider_side_effect_record_fails", (candidate) => {
      candidate.side_effect_flags.provider_contact_performed = false;
    })
  ];

  gate.negative_cases = negativeCases;
  gate.negative_case_count = negativeCases.length;
  gate.caught_negative_case_count = negativeCases.filter((item) => item.result === "caught").length;
  gate.all_negative_cases_caught = negativeCases.every((item) => item.result === "caught" && item.expected_failure === true);

  return {
    v0_3_3_first_live_generation_pilot_gate: gate
  };
}

function main() {
  const report = buildReport();
  const actual = report.v0_3_3_first_live_generation_pilot_gate;

  if (process.argv.includes("--write-fixture")) {
    writeJson(fixturePath, report);
  }

  const expected = readJson(fixturePath);
  const actualAgain = buildReport();
  assertDeepEqual(actualAgain, report, "v0.3.3 deterministic output");
  assertDeepEqual(report, expected, "v0.3.3 fixture");
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
    gate_status: actual.gate_status,
    candidate_packet_status: actual.candidate_packet_status,
    execution_authorized_by_this_gate: actual.execution_authorized_by_this_gate,
    live_provider_call_allowed_now: actual.live_provider_call_allowed_now,
    image_generation_allowed_now: actual.image_generation_allowed_now,
    output_write_allowed_now: actual.output_write_allowed_now,
    receipt_write_allowed_now: actual.receipt_write_allowed_now,
    registry_write_allowed_now: actual.registry_write_allowed_now,
    current_live_call_budget: actual.current_execution_budgets.provider_calls,
    candidate_provider_call_budget_if_activated: actual.candidate_budget_if_activated.provider_calls,
    candidate_image_budget_if_activated: actual.candidate_budget_if_activated.image_candidates,
    current_cost_budget: actual.current_execution_budgets.cost_amount,
    candidate_cost_cap_amount_if_activated: actual.candidate_budget_if_activated.cost_cap_amount,
    cost_unknown_is_red: actual.current_execution_budgets.cost_unknown_is_red,
    can_execute_now: actual.gate_readiness.can_execute_now,
    exact_v0_3_3_execution_authorization_present: actual.gate_readiness.exact_v0_3_3_execution_authorization_present,
    provider_calls_used: actual.gate_readiness.provider_calls_used,
    image_candidates_generated: actual.gate_readiness.image_candidates_generated,
    failure_class: actual.gate_readiness.failure_class,
    failed_attempt_count: actual.receipt_reconciliation.failed_attempt_count,
    succeeded_diagnostic_count: actual.receipt_reconciliation.succeeded_diagnostic_count,
    total_attempt_result_count: actual.receipt_reconciliation.total_attempt_result_count,
    diagnostic_image_candidates_generated: actual.receipt_reconciliation.diagnostic_image_candidates_generated,
    user_authorized_png_upload_count: actual.receipt_reconciliation.user_authorized_png_upload_count,
    visual_asset_policy_version: actual.receipt_reconciliation.visual_asset_policy_version,
    runs_artifact_count: actual.receipt_reconciliation.runs_artifact_count,
    user_authorized_test_image_count: actual.receipt_reconciliation.user_authorized_test_image_count,
    memory_seed_true_count: actual.receipt_reconciliation.memory_seed_true_count,
    invalid_memory_seed_count: actual.receipt_reconciliation.invalid_memory_seed_count,
    generated_image_binary_commit_policy_ref: actual.receipt_reconciliation.generated_image_binary_commit_policy_ref,
    visual_asset_authorization_registry_ref: actual.receipt_reconciliation.visual_asset_authorization_registry_ref,
    durable_review_asset_requires_separate_gate: actual.receipt_reconciliation.durable_review_asset_requires_separate_gate,
    production_candidate_write_allowed_by_v0_3_4: actual.receipt_reconciliation.production_candidate_write_allowed_by_v0_3_4,
    output_path_collision: actual.gate_readiness.output_path_collision,
    receipt_path_collision: actual.gate_readiness.receipt_path_collision,
    negative_case_count: actual.negative_case_count,
    caught_negative_case_count: actual.caught_negative_case_count,
    all_negative_cases_caught: actual.all_negative_cases_caught,
    recommended_next: actual.recommended_next,
    provider_contact_performed: true,
    plugin_call_performed: true,
    api_call_performed: false,
    image_generation_performed: false,
    output_directory_created: true,
    receipt_written: true,
    registry_written: true,
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
  validateGate
};
