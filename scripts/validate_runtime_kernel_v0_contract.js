#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const kernelPath = "kernel/runtime_kernel_v0.js";
const greenFixturePath = "tests/fixtures/runtime_kernel_v0_green_task.fixture.json";
const redFixturePath = "tests/fixtures/runtime_kernel_v0_red_task.fixture.json";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `Path escapes repository: ${relativePath}`);
  return resolved;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function runNode(args) {
  return execFileSync("node", args, { cwd: root, encoding: "utf8" });
}

function assertArrayIncludesAll(actual, expected, label) {
  expected.forEach((value) => {
    assert(Array.isArray(actual) && actual.includes(value), `${label} missing ${value}`);
  });
}

function assertRuntimeContract(contract, label) {
  assert(contract.contract_id === "runtime_kernel_v0_contract", `${label} contract_id mismatch`);
  assert(contract.contract_version === "v0.1", `${label} contract_version mismatch`);
  assert(contract.kernel_id === "runtime_kernel_v0_no_provider", `${label} kernel_id mismatch`);

  assert(contract.task_input.task_type === "fixture.visual_generation.no_provider.v0", `${label} task_type mismatch`);
  assertArrayIncludesAll(contract.task_input.required_root_fields, ["task_id", "task_type", "input", "policy", "review"], `${label} required_root_fields`);
  assertArrayIncludesAll(contract.task_input.required_input_fields, ["prompt_ref", "fixture_asset_ref", "artifact_capsule_plan"], `${label} required_input_fields`);
  assertArrayIncludesAll(contract.task_input.required_policy_allowed_capabilities, ["local_fixture_execution", "in_memory_artifact_persistence"], `${label} required_policy_allowed_capabilities`);
  assertArrayIncludesAll(contract.task_input.blocked_capability_classes, ["provider_contact", "plugin_call", "api_call", "image_generation", "production_write", "disk_write"], `${label} blocked_capability_classes`);
  assert(contract.task_input.required_review_stub_decision === "mark_review_pending", `${label} review decision contract mismatch`);

  assertArrayIncludesAll(contract.output_envelope.required_root_fields, ["kernel_id", "version", "contract", "task_id", "final_state", "intake", "policy", "transition", "audit_record"], `${label} required output root fields`);
  assertArrayIncludesAll(contract.output_envelope.green_required_fields, ["execution", "persistence", "review"], `${label} green required fields`);
  assertArrayIncludesAll(contract.output_envelope.red_forbidden_fields, ["execution", "persistence", "review"], `${label} red forbidden fields`);
  assertArrayIncludesAll(contract.output_envelope.terminal_states, ["completed_stub", "blocked_red"], `${label} terminal states`);

  assert(contract.adapter_slots.artifact_adapter.status === "planned_next_adapter", `${label} artifact adapter status mismatch`);
  assert(contract.adapter_slots.artifact_adapter.input_ref === "persistence.artifact_record", `${label} artifact adapter input ref mismatch`);
  assert(contract.adapter_slots.artifact_adapter.output_ref === "persistence.persisted_ref", `${label} artifact adapter output ref mismatch`);
  assert(contract.adapter_slots.artifact_adapter.writes_allowed_now === false, `${label} artifact adapter writes must be false`);
  assert(contract.adapter_slots.review_bridge.status === "planned_next_adapter", `${label} review bridge status mismatch`);
  assert(contract.adapter_slots.review_bridge.input_ref === "review", `${label} review bridge input ref mismatch`);
  assert(contract.adapter_slots.review_bridge.output_ref === "review.review_decision", `${label} review bridge output ref mismatch`);
  assert(contract.adapter_slots.review_bridge.writes_allowed_now === false, `${label} review bridge writes must be false`);
  assert(contract.adapter_slots.provider_adapter.status === "blocked_until_explicit_provider_phase", `${label} provider adapter status mismatch`);
  assert(contract.adapter_slots.provider_adapter.input_ref === "execution.output.provider_output_ref", `${label} provider adapter input ref mismatch`);
  assert(contract.adapter_slots.provider_adapter.calls_allowed_now === false, `${label} provider adapter calls must be false`);

  assert(contract.audit_write.optional_cli_flag === "--audit-output", `${label} audit cli flag mismatch`);
  assert(contract.audit_write.payload_schema === "runtime_kernel_v0.audit_write.v0", `${label} audit payload schema mismatch`);
  assert(contract.audit_write.allowed_output_root === ".agent_private/runtime_kernel_v0/audits", `${label} audit output root mismatch`);
  assert(contract.audit_write.git_ignored_required === true, `${label} audit ignore requirement mismatch`);
  assert(contract.audit_write.overwrite_existing_allowed === false, `${label} audit overwrite must be false`);

  assertArrayIncludesAll(contract.side_effect_policy.forbidden_flags, [
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "image_generation_performed",
    "forbidden_disk_write_performed",
    "production_write_performed",
    "secret_value_read_performed",
    "env_file_content_read_performed",
    "push_tag_release_deploy_performed",
  ], `${label} forbidden side effect flags`);
  assertArrayIncludesAll(contract.side_effect_policy.allowed_local_side_effects, ["audit_write_performed"], `${label} allowed local side effects`);
  assert(contract.side_effect_policy.provider_contact_allowed_now === false, `${label} provider contact must not be allowed`);
  assert(contract.side_effect_policy.image_generation_allowed_now === false, `${label} image generation must not be allowed`);
  assert(contract.side_effect_policy.production_write_allowed_now === false, `${label} production write must not be allowed`);
}

function assertOutputEnvelope(result, expected) {
  assertRuntimeContract(result.contract, expected.label);
  result.contract.output_envelope.required_root_fields.forEach((field) => {
    assert(Object.prototype.hasOwnProperty.call(result, field), `${expected.label} output missing root field ${field}`);
  });
  assert(result.final_state === expected.finalState, `${expected.label} final state mismatch`);
  assert(result.audit_record.contract_id === result.contract.contract_id, `${expected.label} audit contract id mismatch`);
  assert(result.audit_record.contract_version === result.contract.contract_version, `${expected.label} audit contract version mismatch`);

  if (expected.finalState === "completed_stub") {
    result.contract.output_envelope.green_required_fields.forEach((field) => {
      assert(Object.prototype.hasOwnProperty.call(result, field), `${expected.label} green output missing field ${field}`);
    });
  }

  if (expected.finalState === "blocked_red") {
    result.contract.output_envelope.red_forbidden_fields.forEach((field) => {
      assert(!Object.prototype.hasOwnProperty.call(result, field), `${expected.label} red output must not include ${field}`);
    });
  }
}

function main() {
  assert(fs.existsSync(repoPath(kernelPath)), "kernel file missing");
  runNode(["--check", kernelPath]);

  const kernel = require(repoPath(kernelPath));
  assertRuntimeContract(kernel.getRuntimeContract(), "exported");

  const greenResult = kernel.runRuntimeKernelV0(readJson(greenFixturePath));
  assertOutputEnvelope(greenResult, { label: "green", finalState: "completed_stub" });

  const redResult = kernel.runRuntimeKernelV0(readJson(redFixturePath));
  assertOutputEnvelope(redResult, { label: "red", finalState: "blocked_red" });

  const auditPayload = kernel.buildAuditWritePayload(
    greenResult,
    ".agent_private/runtime_kernel_v0/audits/runtime_kernel_v0_contract_probe.json"
  );
  assertRuntimeContract(auditPayload.contract, "audit payload");
  assert(auditPayload.allowed_local_side_effects.audit_write_performed === true, "audit payload must allow audit write");
  assert(auditPayload.allowed_local_side_effects.disk_write_kind === "local_ignored_audit_record", "audit payload disk write kind mismatch");
  assert(auditPayload.production_write_performed === false, "audit payload production write must be false");

  console.log(JSON.stringify({
    passed: true,
    validator: "validate_runtime_kernel_v0_contract",
    contract_id: greenResult.contract.contract_id,
    contract_version: greenResult.contract.contract_version,
    kernel_id: greenResult.kernel_id,
    green_final_state: greenResult.final_state,
    red_final_state: redResult.final_state,
    adapter_slots: Object.keys(greenResult.contract.adapter_slots),
    audit_write_contract_present: true,
    provider_contact_allowed_now: false,
    image_generation_allowed_now: false,
    production_write_allowed_now: false,
  }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(JSON.stringify({
    passed: false,
    validator: "validate_runtime_kernel_v0_contract",
    error: error.message,
  }, null, 2));
  process.exitCode = 1;
}
