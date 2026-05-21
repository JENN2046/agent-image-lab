const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  doc: "docs/SMART_AUTOPILOT_GOVERNANCE_KERNEL.md",
  envelopeSchema: "schemas/autopilot_autonomy_envelope.schema.yaml",
  receiptSchema: "schemas/autopilot_execution_receipt.schema.yaml",
  envelopeExample: "tests/schema_examples/autopilot_autonomy_envelope.example.json",
  receiptExample: "tests/schema_examples/autopilot_execution_receipt.example.json"
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
  "validation_run",
  "validation_result",
  "rollback_or_cleanup_available",
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

function main() {
  for (const relativePath of Object.values(files)) {
    assert(fs.existsSync(path.join(root, relativePath)), `Missing required file: ${relativePath}`);
  }

  const doc = read(files.doc);
  const envelopeSchema = read(files.envelopeSchema);
  const receiptSchema = read(files.receiptSchema);
  const envelopeExampleRoot = readJson(files.envelopeExample);
  const receiptExampleRoot = readJson(files.receiptExample);
  const envelope = envelopeExampleRoot.autopilot_autonomy_envelope;
  const receipt = receiptExampleRoot.autopilot_execution_receipt;

  includesAll(doc, requiredKernelComponents, "kernel doc components");
  includesAll(doc, ["Green Lane", "Amber Lane", "Red Lane"], "kernel doc lanes");
  includesAll(envelopeSchema, ["Green", "Amber", "Red"], "envelope schema lanes");
  includesAll(envelopeSchema, requiredBudgetKeys, "envelope schema budget");
  includesAll(envelopeSchema, requiredRedGates, "envelope schema Red gates");
  includesAll(envelopeSchema, requiredReceiptFields, "envelope schema receipt requirements");
  includesAll(receiptSchema, requiredReceiptFields, "receipt schema fields");
  includesAll(receiptSchema, ["receipt_required_after_meaningful_action", "stop_if_red_condition_seen"], "receipt schema Amber guard");

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
  assert(receipt.calls_used.provider_calls === 0, "Receipt fixture must not use provider calls");
  assert(receipt.calls_used.plugin_calls === 0, "Receipt fixture must not use plugin calls");
  assert(receipt.calls_used.api_calls === 0, "Receipt fixture must not use API calls");
  assert(receipt.calls_used.image_candidates === 0, "Receipt fixture must not use image candidates");
  assert(receipt.calls_used.runtime_probe_minutes === 0, "Receipt fixture must not use runtime probe minutes");
  assert(Array.isArray(receipt.files_read), "Receipt files_read must be an array");
  assert(Array.isArray(receipt.files_written), "Receipt files_written must be an array");
  assert(Array.isArray(receipt.dependency_actions_used) && receipt.dependency_actions_used.length === 0, "Receipt fixture must not use dependency actions");
  assert(Array.isArray(receipt.validation_run) && receipt.validation_run.length > 0, "Receipt must record validation_run");
  assert(receipt.validation_result === "passed", "Receipt fixture validation_result must be passed");
  assert(receipt.rollback_or_cleanup_available === true, "Receipt must record rollback/cleanup availability");
  assert(receipt.stop_reason === "none", "Receipt fixture stop_reason must be none");
  assertGuardFalse(receipt.guard, "Receipt example");

  const result = {
    passed: true,
    phase: "smart_autopilot_governance_kernel",
    kernel_components_verified: requiredKernelComponents.length,
    default_budget_verified: true,
    red_gates_verified: requiredRedGates,
    amber_receipt_required: true,
    examples_verified: [
      files.envelopeExample,
      files.receiptExample
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
