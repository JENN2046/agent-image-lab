#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const adapterPath = "adapters/runtime/exact_a5_provider_execution_packet_draft.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `Path escapes repository: ${relativePath}`);
  return resolved;
}

function runNode(args) {
  return execFileSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 30000,
  });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertPacket(packet, label) {
  assert(packet.packet_schema === "exact_a5_provider_execution_packet_draft.v0", `${label} schema mismatch`);
  assert(packet.adapter_id === "exact_a5_provider_execution_packet_draft_v0", `${label} adapter mismatch`);
  assert(packet.authorization_id === "AUTH-DRAFT-NATIVE-DOUBAO-ONE-SHOT-20260526-001", `${label} authorization id mismatch`);
  assert(packet.authorization_status === "draft_not_active", `${label} must remain inactive draft`);
  assert(packet.authorization_active === false, `${label} authorization_active must be false`);
  assert(packet.can_execute_now === false, `${label} can_execute_now must be false`);
  assert(packet.requires_exact_user_activation === true, `${label} exact activation must be required`);
  assert(packet.exact_activation_phrase.includes("AUTH-DRAFT-NATIVE-DOUBAO-ONE-SHOT-20260526-001"), `${label} activation phrase must name authorization id`);
  assert(packet.exact_activation_phrase.includes("最多 1 次 provider/plugin/API 调用"), `${label} activation phrase must state one-shot call budget`);
  assert(packet.exact_activation_phrase.includes("禁止读取 secret 值"), `${label} activation phrase must forbid secret value reads`);
  assert(packet.selected_provider.provider_id === "NativeDoubaoImage", `${label} provider mismatch`);
  assert(packet.selected_provider.provider_binding_ref === "native_doubao:capability:owner-runtime:<redacted>", `${label} binding ref must be redacted`);
  assert(packet.selected_provider.provider_binding_ref_is_secret === false, `${label} binding ref must be non-secret`);
  assert(packet.selected_provider.secretless_runtime_required === true, `${label} secretless runtime mismatch`);
  assert(packet.activation_budget.max_provider_calls === 1, `${label} provider call budget mismatch`);
  assert(packet.activation_budget.max_plugin_calls === 1, `${label} plugin call budget mismatch`);
  assert(packet.activation_budget.max_api_calls === 1, `${label} api call budget mismatch`);
  assert(packet.activation_budget.max_images_created === 1, `${label} image budget mismatch`);
  assert(packet.activation_budget.retry_allowed === false, `${label} retry must be false`);
  assert(packet.activation_budget.max_retry_count === 0, `${label} max retry must be 0`);
  assert(packet.current_budget_before_activation.provider_calls === 0, `${label} current provider calls must be 0`);
  assert(packet.current_budget_before_activation.image_candidates === 0, `${label} current image candidates must be 0`);
  assert(packet.allowed_operation_when_activated.output_directory_ref === "runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot", `${label} output dir mismatch`);
  assert(packet.allowed_operation_when_activated.provider_receipt_ref === "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json", `${label} receipt ref mismatch`);
  assert(packet.allowed_operation_when_activated.review_handoff_ref === "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json", `${label} review handoff ref mismatch`);
  assert(packet.write_boundaries_when_activated.overwrite_existing_files_allowed === false, `${label} overwrite must be false`);
  assert(packet.write_boundaries_when_activated.production_candidate_write_allowed === false, `${label} production write must be false`);
  assert(packet.write_boundaries_when_activated.accepted_samples_write_allowed === false, `${label} accepted samples write must be false`);
  assert(packet.write_boundaries_when_activated.DailyNote_write_allowed === false, `${label} DailyNote write must be false`);
  assert(packet.write_boundaries_when_activated.VCP_memory_write_allowed === false, `${label} VCP memory write must be false`);
  assert(packet.validation_required_before_activation.includes("npm run validate:exact-a5-provider-packet"), `${label} validator missing`);
  for (const [field, value] of Object.entries(packet.current_side_effect_flags)) {
    assert(value === false, `${label} current_side_effect_flags.${field} must be false`);
  }
}

function expectFailure(caseId, fn) {
  try {
    fn();
  } catch (_error) {
    return { case_id: caseId, result: "caught" };
  }
  throw new Error(`${caseId} was not caught`);
}

function main() {
  const skipAdapterCli = process.argv.includes("--skip-adapter-cli");
  assert(fs.existsSync(repoPath(adapterPath)), "exact A5 packet adapter missing");
  runNode(["--check", adapterPath]);

  const adapter = require(repoPath(adapterPath));
  assert(typeof adapter.buildExactA5ProviderExecutionPacketDraft === "function", "builder export missing");
  assert(typeof adapter.validateExactA5ProviderExecutionPacketDraft === "function", "validator export missing");

  const packet = adapter.buildExactA5ProviderExecutionPacketDraft();
  assertPacket(packet, "direct");
  assert(adapter.validateExactA5ProviderExecutionPacketDraft(packet) === true, "direct packet should validate");

  if (!skipAdapterCli) {
    const cliPacket = JSON.parse(runNode([adapterPath]));
    assertPacket(cliPacket, "cli");
  }

  const negativeCases = [
    expectFailure("authorization_active_true_rejected", () => {
      const dirty = clone(packet);
      dirty.authorization_active = true;
      adapter.validateExactA5ProviderExecutionPacketDraft(dirty);
    }),
    expectFailure("can_execute_now_true_rejected", () => {
      const dirty = clone(packet);
      dirty.can_execute_now = true;
      adapter.validateExactA5ProviderExecutionPacketDraft(dirty);
    }),
    expectFailure("activation_phrase_drift_rejected", () => {
      const dirty = clone(packet);
      dirty.exact_activation_phrase = "授权执行";
      adapter.validateExactA5ProviderExecutionPacketDraft(dirty);
    }),
    expectFailure("unredacted_binding_rejected", () => {
      const dirty = clone(packet);
      dirty.selected_provider.provider_binding_ref = "native_doubao:capability:owner-runtime:v0_6_73";
      adapter.validateExactA5ProviderExecutionPacketDraft(dirty);
    }),
    expectFailure("provider_budget_overrun_rejected", () => {
      const dirty = clone(packet);
      dirty.activation_budget.max_provider_calls = 2;
      adapter.validateExactA5ProviderExecutionPacketDraft(dirty);
    }),
    expectFailure("retry_allowed_rejected", () => {
      const dirty = clone(packet);
      dirty.activation_budget.retry_allowed = true;
      adapter.validateExactA5ProviderExecutionPacketDraft(dirty);
    }),
    expectFailure("production_write_allowed_rejected", () => {
      const dirty = clone(packet);
      dirty.write_boundaries_when_activated.production_candidate_write_allowed = true;
      adapter.validateExactA5ProviderExecutionPacketDraft(dirty);
    }),
    expectFailure("current_side_effect_true_rejected", () => {
      const dirty = clone(packet);
      dirty.current_side_effect_flags.provider_contact_performed = true;
      adapter.validateExactA5ProviderExecutionPacketDraft(dirty);
    }),
    expectFailure("unsafe_output_path_rejected", () => {
      const dirty = clone(packet);
      dirty.allowed_operation_when_activated.output_directory_ref = "tmp/a5-output/";
      adapter.validateExactA5ProviderExecutionPacketDraft(dirty);
    }),
  ];

  console.log(JSON.stringify({
    passed: true,
    validator: "validate_exact_a5_provider_execution_packet_draft",
    adapter_id: packet.adapter_id,
    packet_schema: packet.packet_schema,
    authorization_id: packet.authorization_id,
    authorization_status: packet.authorization_status,
    authorization_active: false,
    can_execute_now: false,
    requires_exact_user_activation: true,
    exact_activation_phrase_present: true,
    selected_provider_id: packet.selected_provider.provider_id,
    provider_binding_ref_redacted: true,
    provider_binding_ref_is_secret: false,
    max_provider_calls_when_activated: packet.activation_budget.max_provider_calls,
    max_plugin_calls_when_activated: packet.activation_budget.max_plugin_calls,
    max_api_calls_when_activated: packet.activation_budget.max_api_calls,
    max_images_created_when_activated: packet.activation_budget.max_images_created,
    retry_allowed: packet.activation_budget.retry_allowed,
    current_provider_calls: packet.current_budget_before_activation.provider_calls,
    current_image_candidates: packet.current_budget_before_activation.image_candidates,
    negative_case_count: negativeCases.length,
    caught_negative_case_count: negativeCases.filter((item) => item.result === "caught").length,
    all_negative_cases_caught: negativeCases.every((item) => item.result === "caught"),
    adapter_cli_skipped: skipAdapterCli,
    adapter_cli_deferred_to_full_validator: skipAdapterCli,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    env_file_content_read_performed: false,
    secret_value_read_performed: false,
    output_write_performed: false,
    production_write_performed: false,
    accepted_samples_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
  }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(JSON.stringify({
    passed: false,
    validator: "validate_exact_a5_provider_execution_packet_draft",
    error: error.message,
  }, null, 2));
  process.exitCode = 1;
}
