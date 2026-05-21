const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  doc: "docs/SMART_AUTOPILOT_GOVERNANCE_KERNEL.md",
  envelopeSchema: "schemas/autopilot_autonomy_envelope.schema.yaml",
  receiptSchema: "schemas/autopilot_execution_receipt.schema.yaml",
  envelopeExample: "tests/schema_examples/autopilot_autonomy_envelope.example.json",
  receiptRegistryExample: "tests/schema_examples/autopilot_receipt_registry.example.json",
  receiptExample: "tests/schema_examples/autopilot_execution_receipt.example.json",
  amber01Doc: "docs/AMBER_01_LOCAL_RECEIPT_TRIAL.md",
  amber01ReceiptExample: "tests/schema_examples/autopilot_execution_receipt.amber_01_local_trial.example.json",
  amber02Doc: "docs/AMBER_02_PRODUCTION_CANDIDATE_RECEIPT_REPLAY.md",
  amber02ReceiptExample: "tests/schema_examples/autopilot_execution_receipt.amber_02_production_candidate_replay.example.json",
  autopilotLedger: ".agent_board/AUTOPILOT_LEDGER.md",
  agents: "AGENTS.md",
  overlay: "AGENTS.autopilot-overlay.md",
  readme: "README.md",
  roadmap: "docs/00_project_roadmap.md",
  runState: ".agent_board/RUN_STATE.md",
  handoff: ".agent_board/HANDOFF.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md"
};

const requiredKernelComponents = [
  "Goal Compiler",
  "Truth Model",
  "Lane Classifier",
  "Budget Engine",
  "Receipt Recorder",
  "Continuation Judge"
];

const requiredBudgetKeys = [
  "max_provider_calls",
  "max_plugin_calls",
  "max_api_calls",
  "max_image_candidates",
  "max_external_read_files",
  "max_write_files",
  "max_dependency_actions",
  "max_retry_per_transient_failure",
  "max_runtime_probe_minutes",
  "max_cost_amount",
  "max_cost_currency",
  "cost_tracking_required",
  "cost_unknown_is_red",
  "overwrite_existing_files_allowed",
  "secret_value_read_allowed",
  "raw_private_data_print_allowed",
  "push_allowed",
  "tag_release_deploy_allowed",
  "destructive_action_allowed"
];

const requiredRedGates = [
  "git push",
  "tag",
  "release",
  "deploy",
  "secret value read or edit",
  "destructive Git/filesystem action",
  "uncapped cost",
  "unbounded loops"
];

const requiredReceiptFields = [
  "task_id",
  "lane",
  "envelope_id",
  "action_performed",
  "target_systems",
  "calls_used",
  "files_read",
  "files_written",
  "dependency_actions_used",
  "cost_accounting",
  "validation_run",
  "validation_result",
  "rollback_or_cleanup_available",
  "rollback_or_cleanup_plan",
  "files_to_revert",
  "cleanup_targets",
  "irreversible_actions_performed",
  "next_auto_step_allowed",
  "stop_reason"
];

const guardFlags = [
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "image_generation_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "real_manifest_read_performed",
  "real_vcpchat_read_performed",
  "real_vcptoolbox_read_performed",
  "dependency_change_performed",
  "runtime_probe_performed",
  "secret_value_read_performed",
  "push_tag_release_deploy_performed"
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function includesAll(content, values, label) {
  const missing = values.filter((value) => !content.includes(value));
  assert(missing.length === 0, `${label} missing: ${missing.join(", ")}`);
}

function assertGuardFalse(guard, label) {
  for (const flag of guardFlags) {
    assert(Object.prototype.hasOwnProperty.call(guard, flag), `${label} missing guard flag ${flag}`);
    assert(guard[flag] === false, `${label} must keep ${flag}=false`);
  }
}

function assertZeroCalls(callsUsed, label) {
  assert(callsUsed.provider_calls === 0, `${label} must not use provider calls`);
  assert(callsUsed.plugin_calls === 0, `${label} must not use plugin calls`);
  assert(callsUsed.api_calls === 0, `${label} must not use API calls`);
  assert(callsUsed.image_candidates === 0, `${label} must not use image candidates`);
  assert(callsUsed.runtime_probe_minutes === 0, `${label} must not use runtime probe minutes`);
}

function assertCostAccounting(costAccounting, registryEntry, label) {
  assert(costAccounting && typeof costAccounting === "object", `${label} missing cost_accounting`);
  assert(costAccounting.cost_tracking_required === true, `${label} must require cost tracking`);
  assert(costAccounting.cost_unknown === false, `${label} must not have unknown cost`);
  assert(costAccounting.cost_unknown_is_red === true, `${label} must declare cost_unknown_is_red`);
  assert(
    typeof costAccounting.cost_amount === "number" || costAccounting.cost_amount === "not_applicable",
    `${label} cost_amount must be numeric or not_applicable`
  );
  assert(typeof costAccounting.cost_currency === "string", `${label} cost_currency must be a string`);
  if (typeof registryEntry.max_cost_amount === "number" && typeof costAccounting.cost_amount === "number") {
    assert(costAccounting.cost_amount <= registryEntry.max_cost_amount, `${label} cost exceeds registry budget`);
  }
  if (registryEntry.max_cost_currency === "not_applicable") {
    assert(costAccounting.cost_currency === "not_applicable", `${label} cost currency must be not_applicable`);
  }
}

function assertRollbackStructure(receipt, label) {
  assert(typeof receipt.rollback_or_cleanup_available === "boolean", `${label} rollback availability must be boolean`);
  assert(typeof receipt.rollback_or_cleanup_plan === "string" && receipt.rollback_or_cleanup_plan.length > 0, `${label} rollback plan required`);
  assert(Array.isArray(receipt.files_to_revert), `${label} files_to_revert must be an array`);
  assert(Array.isArray(receipt.cleanup_targets), `${label} cleanup_targets must be an array`);
  assert(Array.isArray(receipt.irreversible_actions_performed), `${label} irreversible_actions_performed must be an array`);
  assert(receipt.irreversible_actions_performed.length === 0, `${label} must not record irreversible actions in local fixture/replay receipts`);
}

function assertArrayIncludesAll(actual, expected, label) {
  assert(Array.isArray(actual), `${label} must be an array`);
  const missing = expected.filter((value) => !actual.includes(value));
  assert(missing.length === 0, `${label} missing: ${missing.join(", ")}`);
}

function main() {
  for (const relativePath of Object.values(files)) {
    assert(fs.existsSync(path.join(root, relativePath)), `Missing required file: ${relativePath}`);
  }

  const doc = read(files.doc);
  const envelopeSchema = read(files.envelopeSchema);
  const receiptSchema = read(files.receiptSchema);
  const envelopeExampleRoot = readJson(files.envelopeExample);
  const receiptRegistryRoot = readJson(files.receiptRegistryExample);
  const receiptExampleRoot = readJson(files.receiptExample);
  const amber01ReceiptExampleRoot = readJson(files.amber01ReceiptExample);
  const amber02ReceiptExampleRoot = readJson(files.amber02ReceiptExample);
  const envelope = envelopeExampleRoot.autopilot_autonomy_envelope;
  const receiptRegistry = receiptRegistryRoot.autopilot_receipt_registry;
  const receipt = receiptExampleRoot.autopilot_execution_receipt;
  const amber01Receipt = amber01ReceiptExampleRoot.autopilot_execution_receipt;
  const amber02Receipt = amber02ReceiptExampleRoot.autopilot_execution_receipt;
  const agents = read(files.agents);
  const overlay = read(files.overlay);
  const startupSurfaces = [
    agents,
    overlay,
    read(files.readme),
    read(files.roadmap),
    read(files.runState),
    read(files.handoff),
    read(files.taskQueue),
    read(files.checkpoint),
    doc
  ].join("\n");
  const defaultModeBlock = (agents.match(/Default mode:\s*```text\s*([\s\S]*?)```/) || [])[1] || "";

  includesAll(doc, requiredKernelComponents, "kernel doc components");
  includesAll(doc, ["Green Lane", "Amber Lane", "Red Lane"], "kernel doc lanes");
  includesAll(doc, ["receipt registry", "cost unknown", "structured rollback"], "kernel doc registry hardening");
  assert(defaultModeBlock.includes("Smart Standing Authorization v3") && !defaultModeBlock.includes("A4.8"), "AGENTS.md Default mode must be Smart Standing Authorization v3, not A4.8");
  assert(overlay.includes("Active startup model: Smart Standing Authorization v3."), "Overlay must declare v3 active startup model");
  includesAll(startupSurfaces, [
    "current_autonomy_model: Smart Standing Authorization v3",
    "startup_default_model: Smart Standing Authorization v3",
    "a4_8_status: retained_as_green_lane_substrate",
    "A4.8",
    "Green Lane substrate"
  ], "startup model surfaces");
  includesAll(startupSurfaces, ["push", "tag", "release", "deploy", "secret", "destructive"], "startup Red Lane hard stops");
  includesAll(envelopeSchema, ["Green", "Amber", "Red"], "envelope schema lanes");
  includesAll(envelopeSchema, requiredBudgetKeys, "envelope schema budget");
  includesAll(envelopeSchema, requiredRedGates, "envelope schema Red gates");
  includesAll(envelopeSchema, ["cost unknown or unbounded for real external Amber action"], "envelope schema cost Red gate");
  includesAll(envelopeSchema, requiredReceiptFields, "envelope schema receipt requirements");
  includesAll(receiptSchema, requiredReceiptFields, "receipt schema fields");
  includesAll(receiptSchema, ["receipt_required_after_meaningful_action", "stop_if_red_condition_seen", "irreversible_actions_require_stop_or_review", "cost_unknown_is_red_for_real_external_amber"], "receipt schema Amber guard");

  assert(receiptRegistry.version === "v1", "Receipt registry version must be v1");
  assert(receiptRegistry.contract_type === "autopilot_receipt_registry", "Receipt registry contract_type mismatch");
  assert(receiptRegistry.receipt_schema_ref === files.receiptSchema, "Receipt registry must reference receipt schema");
  assert(receiptRegistry.envelope_schema_ref === files.envelopeSchema, "Receipt registry must reference envelope schema");
  assert(receiptRegistry.cost_unknown_is_red === true, "Receipt registry must declare cost_unknown_is_red");
  assert(receiptRegistry.rollback_structure_required === true, "Receipt registry must require rollback structure");
  assert(Array.isArray(receiptRegistry.receipts) && receiptRegistry.receipts.length >= 3, "Receipt registry must list at least three receipts");
  for (const entry of receiptRegistry.receipts) {
    assert(entry.path && fs.existsSync(path.join(root, entry.path)), `Receipt registry missing file: ${entry.path}`);
    assert(entry.receipt_id && entry.task_id && entry.envelope_id && entry.lane, `Receipt registry entry missing identity for ${entry.path}`);
    assert(["Green", "Amber"].includes(entry.lane), `Receipt registry entry lane invalid for ${entry.path}`);
    assert(entry.receipt_only_or_replay === true, `Receipt registry entry must be marked receipt_only_or_replay for ${entry.path}`);
    assert(typeof entry.max_write_files === "number", `Receipt registry entry missing max_write_files for ${entry.path}`);
    assert(typeof entry.max_dependency_actions === "number", `Receipt registry entry missing max_dependency_actions for ${entry.path}`);
    assert(Object.prototype.hasOwnProperty.call(entry, "max_cost_amount"), `Receipt registry entry missing max_cost_amount for ${entry.path}`);

    const registeredReceipt = readJson(entry.path).autopilot_execution_receipt;
    assert(registeredReceipt, `Registered receipt missing root object for ${entry.path}`);
    for (const field of requiredReceiptFields) {
      assert(Object.prototype.hasOwnProperty.call(registeredReceipt, field), `Registered receipt ${entry.path} missing ${field}`);
    }
    assert(registeredReceipt.receipt_id === entry.receipt_id, `Receipt registry receipt_id mismatch for ${entry.path}`);
    assert(registeredReceipt.task_id === entry.task_id, `Receipt registry task_id mismatch for ${entry.path}`);
    assert(registeredReceipt.envelope_id === entry.envelope_id, `Receipt registry envelope_id mismatch for ${entry.path}`);
    assert(registeredReceipt.lane === entry.lane, `Receipt registry lane mismatch for ${entry.path}`);
    assert(["passed", "pending", "failed", "blocked", "not_run", "passed_with_warnings"].includes(registeredReceipt.validation_result), `Registered receipt validation_result invalid for ${entry.path}`);
    assert(typeof registeredReceipt.next_auto_step_allowed === "boolean", `Registered receipt next_auto_step_allowed must be boolean for ${entry.path}`);
    assertZeroCalls(registeredReceipt.calls_used, `Registered receipt ${entry.path}`);
    assert(Array.isArray(registeredReceipt.files_written), `Registered receipt files_written must be array for ${entry.path}`);
    assert(registeredReceipt.files_written.length <= entry.max_write_files, `Registered receipt files_written exceeds max_write_files for ${entry.path}`);
    assert(Array.isArray(registeredReceipt.dependency_actions_used), `Registered receipt dependency_actions_used must be array for ${entry.path}`);
    assert(registeredReceipt.dependency_actions_used.length <= entry.max_dependency_actions, `Registered receipt dependency actions exceed budget for ${entry.path}`);
    assertCostAccounting(registeredReceipt.cost_accounting, entry, `Registered receipt ${entry.path}`);
    assertRollbackStructure(registeredReceipt, `Registered receipt ${entry.path}`);
    assertGuardFalse(registeredReceipt.guard, `Registered receipt ${entry.path}`);
  }

  assert(envelope.version === "v1", "Envelope example version must be v1");
  assert(envelope.contract_type === "autopilot_autonomy_envelope", "Envelope example contract_type mismatch");
  assert(envelope.policy_model === "Smart Standing Authorization v3 — Budgeted Autonomy Envelope", "Envelope policy model mismatch");
  assert(envelope.envelope_id && envelope.task_id && envelope.goal, "Envelope identity fields required");
  assert(["Green", "Amber", "Red"].includes(envelope.lane), "Envelope lane must be Green, Amber, or Red");
  includesAll(envelope.kernel_components.join("\n"), requiredKernelComponents, "envelope example components");

  for (const key of requiredBudgetKeys) {
    assert(Object.prototype.hasOwnProperty.call(envelope.budget_limits, key), `Envelope budget missing ${key}`);
  }
  assert(envelope.budget_limits.max_provider_calls === 3, "Default max_provider_calls must be 3");
  assert(envelope.budget_limits.max_plugin_calls === 3, "Default max_plugin_calls must be 3");
  assert(envelope.budget_limits.max_api_calls === 5, "Default max_api_calls must be 5");
  assert(envelope.budget_limits.max_image_candidates === 3, "Default max_image_candidates must be 3");
  assert(envelope.budget_limits.max_dependency_actions === 2, "Default max_dependency_actions must be 2");
  assert(envelope.budget_limits.cost_tracking_required === true, "Envelope must require cost tracking");
  assert(envelope.budget_limits.cost_unknown_is_red === true, "Envelope must treat unknown cost as Red");
  assert(envelope.budget_limits.secret_value_read_allowed === false, "Envelope must block secret reads by default");
  assert(envelope.budget_limits.push_allowed === false, "Envelope must block push by default");
  assert(envelope.budget_limits.tag_release_deploy_allowed === false, "Envelope must block tag/release/deploy by default");
  assert(envelope.budget_limits.destructive_action_allowed === false, "Envelope must block destructive actions by default");
  includesAll(envelope.red_lane_stop_conditions.join("\n"), requiredRedGates, "envelope example Red gates");
  includesAll(envelope.receipt_requirements.join("\n"), requiredReceiptFields, "envelope example receipt requirements");
  assertGuardFalse(envelope.guard, "Envelope example");

  assert(receipt.version === "v1", "Receipt example version must be v1");
  assert(receipt.contract_type === "autopilot_execution_receipt", "Receipt example contract_type mismatch");
  assert(receipt.policy_model === "Smart Standing Authorization v3 — Budgeted Autonomy Envelope", "Receipt policy model mismatch");
  assert(receipt.task_id === envelope.task_id, "Receipt task_id must match envelope example task_id");
  assert(receipt.envelope_id === envelope.envelope_id, "Receipt envelope_id must match envelope example envelope_id");
  assert(["Green", "Amber"].includes(receipt.lane), "Receipt example lane must be Green or Amber for local fixture");
  assertZeroCalls(receipt.calls_used, "Receipt fixture");
  assert(Array.isArray(receipt.files_read), "Receipt files_read must be an array");
  assert(Array.isArray(receipt.files_written), "Receipt files_written must be an array");
  assert(Array.isArray(receipt.dependency_actions_used) && receipt.dependency_actions_used.length === 0, "Receipt fixture must not use dependency actions");
  assertCostAccounting(receipt.cost_accounting, receiptRegistry.receipts.find((entry) => entry.path === files.receiptExample), "Receipt example");
  assert(Array.isArray(receipt.validation_run) && receipt.validation_run.length > 0, "Receipt must record validation_run");
  assert(receipt.validation_result === "passed", "Receipt fixture validation_result must be passed");
  assert(receipt.rollback_or_cleanup_available === true, "Receipt must record rollback/cleanup availability");
  assertRollbackStructure(receipt, "Receipt example");
  assert(receipt.stop_reason === "none", "Receipt fixture stop_reason must be none");
  assertGuardFalse(receipt.guard, "Receipt example");

  const amber01ExpectedWrittenFiles = [
    "docs/AMBER_01_LOCAL_RECEIPT_TRIAL.md",
    "tests/schema_examples/autopilot_execution_receipt.amber_01_local_trial.example.json",
    ".agent_board/AUTOPILOT_LEDGER.md",
    "scripts/validate_autopilot_governance_kernel.js"
  ];

  assert(amber01Receipt.version === "v1", "Amber-01 receipt version must be v1");
  assert(amber01Receipt.contract_type === "autopilot_execution_receipt", "Amber-01 receipt contract_type mismatch");
  assert(amber01Receipt.policy_model === "Smart Standing Authorization v3 — Budgeted Autonomy Envelope", "Amber-01 policy model mismatch");
  assert(amber01Receipt.task_id === "amber_01_local_receipt_trial", "Amber-01 task_id mismatch");
  assert(amber01Receipt.lane === "Amber", "Amber-01 receipt lane must be Amber");
  assert(amber01Receipt.envelope_id === "envelope-amber-01-local-receipt-trial", "Amber-01 envelope_id mismatch");
  assert(amber01Receipt.action_performed === "local_repository_truth_snapshot_and_receipt_record", "Amber-01 action_performed mismatch");
  assertArrayIncludesAll(amber01Receipt.target_systems, ["local_repository_only"], "Amber-01 target_systems");
  assertZeroCalls(amber01Receipt.calls_used, "Amber-01 receipt");
  assert(Array.isArray(amber01Receipt.files_read), "Amber-01 files_read must be an array");
  assert(!amber01Receipt.files_read.some((file) => file.toLowerCase().includes(".env") || file.toLowerCase().includes("secret")), "Amber-01 files_read must not include secret paths");
  assertArrayIncludesAll(amber01Receipt.files_written, amber01ExpectedWrittenFiles, "Amber-01 files_written");
  assert(amber01Receipt.files_written.length <= 4, "Amber-01 files_written must not exceed max_write_files=4");
  assert(Array.isArray(amber01Receipt.dependency_actions_used) && amber01Receipt.dependency_actions_used.length === 0, "Amber-01 must not use dependency actions");
  assertCostAccounting(amber01Receipt.cost_accounting, receiptRegistry.receipts.find((entry) => entry.path === files.amber01ReceiptExample), "Amber-01 receipt");
  assert(Array.isArray(amber01Receipt.validation_run) && amber01Receipt.validation_run.length > 0, "Amber-01 must record validation_run");
  assert(["passed", "pending", "failed", "passed_with_warnings"].includes(amber01Receipt.validation_result), "Amber-01 validation_result must be recognized");
  assert(amber01Receipt.validation_result === "passed", "Amber-01 validation_result must be passed");
  assert(amber01Receipt.rollback_or_cleanup_available === true, "Amber-01 must record rollback/cleanup availability");
  assertRollbackStructure(amber01Receipt, "Amber-01 receipt");
  assert(typeof amber01Receipt.next_auto_step_allowed === "boolean", "Amber-01 next_auto_step_allowed must be boolean");
  assert(amber01Receipt.stop_reason === "none", "Amber-01 stop_reason must be none");
  assertGuardFalse(amber01Receipt.guard, "Amber-01 receipt");
  assert(read(files.amber01Doc).includes("Continuation Judge"), "Amber-01 doc must record Continuation Judge");
  assert(read(files.autopilotLedger).includes("amber_01_local_receipt_trial"), "Autopilot ledger must record Amber-01");

  const amber02ExpectedWrittenFiles = [
    "docs/AMBER_02_PRODUCTION_CANDIDATE_RECEIPT_REPLAY.md",
    "tests/schema_examples/autopilot_execution_receipt.amber_02_production_candidate_replay.example.json",
    ".agent_board/AUTOPILOT_LEDGER.md",
    "scripts/validate_autopilot_governance_kernel.js"
  ];
  const amber02ExpectedReadFiles = [
    "reports/production_candidate_authorization/2026-05-21_tennis_wallet_production_candidate_A5_activation_preflight.json",
    "production/plans/accepted_product_still_life_tennis_wallet_001_production_candidate_001_plan.yaml",
    "production/reviews/accepted_product_still_life_tennis_wallet_001_production_candidate_001_review.md"
  ];

  assert(amber02Receipt.version === "v1", "Amber-02 receipt version must be v1");
  assert(amber02Receipt.contract_type === "autopilot_execution_receipt", "Amber-02 receipt contract_type mismatch");
  assert(amber02Receipt.policy_model === "Smart Standing Authorization v3 — Budgeted Autonomy Envelope", "Amber-02 policy model mismatch");
  assert(amber02Receipt.task_id === "amber_02_production_candidate_metadata_receipt_replay", "Amber-02 task_id mismatch");
  assert(amber02Receipt.lane === "Amber", "Amber-02 receipt lane must be Amber");
  assert(amber02Receipt.envelope_id === "envelope-amber-02-production-candidate-receipt-replay", "Amber-02 envelope_id mismatch");
  assert(amber02Receipt.action_performed === "local_production_candidate_metadata_receipt_replay", "Amber-02 action_performed mismatch");
  assertArrayIncludesAll(amber02Receipt.target_systems, ["local_repository_only", "existing_production_candidate_metadata"], "Amber-02 target_systems");
  assertZeroCalls(amber02Receipt.calls_used, "Amber-02 receipt");
  assertArrayIncludesAll(amber02Receipt.files_read, amber02ExpectedReadFiles, "Amber-02 files_read");
  assert(!amber02Receipt.files_read.some((file) => file.toLowerCase().includes(".env") || file.toLowerCase().includes("secret")), "Amber-02 files_read must not include secret paths");
  assertArrayIncludesAll(amber02Receipt.files_written, amber02ExpectedWrittenFiles, "Amber-02 files_written");
  assert(amber02Receipt.files_written.length <= 4, "Amber-02 files_written must not exceed max_write_files=4");
  assert(Array.isArray(amber02Receipt.dependency_actions_used) && amber02Receipt.dependency_actions_used.length === 0, "Amber-02 must not use dependency actions");
  assertCostAccounting(amber02Receipt.cost_accounting, receiptRegistry.receipts.find((entry) => entry.path === files.amber02ReceiptExample), "Amber-02 receipt");
  assert(Array.isArray(amber02Receipt.validation_run) && amber02Receipt.validation_run.length > 0, "Amber-02 must record validation_run");
  assert(amber02Receipt.validation_result === "passed", "Amber-02 validation_result must be passed");
  assert(amber02Receipt.rollback_or_cleanup_available === true, "Amber-02 must record rollback/cleanup availability");
  assertRollbackStructure(amber02Receipt, "Amber-02 receipt");
  assert(typeof amber02Receipt.next_auto_step_allowed === "boolean", "Amber-02 next_auto_step_allowed must be boolean");
  assert(amber02Receipt.stop_reason === "none", "Amber-02 stop_reason must be none");
  assert(amber02Receipt.replay && amber02Receipt.replay.replayed_prior_action === true, "Amber-02 must mark replayed prior action");
  assert(amber02Receipt.replay.new_production_candidate_created_now === false, "Amber-02 must not create a new production candidate");
  assert(amber02Receipt.replay.production_candidate_metadata_written_now === false, "Amber-02 must not write production metadata now");
  assert(amber02Receipt.replay.historical_production_candidate_write_performed === true, "Amber-02 must bind to the historical production candidate write");
  assertGuardFalse(amber02Receipt.guard, "Amber-02 receipt");
  assert(read(files.amber02Doc).includes("local replay"), "Amber-02 doc must record local replay");
  assert(read(files.autopilotLedger).includes("amber_02_production_candidate_metadata_receipt_replay"), "Autopilot ledger must record Amber-02");

  const result = {
    passed: true,
    phase: "smart_autopilot_governance_kernel",
    kernel_components_verified: requiredKernelComponents.length,
    default_budget_verified: true,
    red_gates_verified: requiredRedGates,
    amber_receipt_required: true,
    receipt_registry_verified: true,
    receipt_registry_count: receiptRegistry.receipts.length,
    cost_budget_hardening_verified: true,
    rollback_structure_verified: true,
    amber_01_local_receipt_trial_verified: true,
    amber_01_files_written_count: amber01Receipt.files_written.length,
    amber_01_max_write_files: 4,
    amber_02_production_candidate_receipt_replay_verified: true,
    amber_02_files_written_count: amber02Receipt.files_written.length,
    amber_02_max_write_files: 4,
    startup_default_v3_verified: true,
    a4_8_green_lane_substrate_verified: true,
    red_lane_hard_stops_verified: true,
    examples_verified: [
      files.envelopeExample,
      files.receiptRegistryExample,
      files.receiptExample,
      files.amber01ReceiptExample,
      files.amber02ReceiptExample
    ],
    no_real_a5_execution_signals: true,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    real_manifest_read_performed: false,
    real_vcpchat_read_performed: false,
    real_vcptoolbox_read_performed: false,
    dependency_change_performed: false,
    runtime_probe_performed: false,
    secret_value_read_performed: false,
    push_tag_release_deploy_performed: false
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exit(1);
}
