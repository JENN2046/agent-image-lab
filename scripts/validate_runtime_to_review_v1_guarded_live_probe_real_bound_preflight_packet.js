#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_guarded_live_probe_real_bound_preflight_packet";
const packetPath = "reports/runtime_to_review_v1/guarded_live_probe_real_bound_owner_runtime_20260531_preflight_packet.json";
const docPath = "docs/RUNTIME_TO_REVIEW_V1_GUARDED_LIVE_PROBE_REAL_BOUND_PREFLIGHT.md";
const runnerPath = "scripts/run_runtime_to_review_v1_guarded_live_probe.js";
const delegatePath = "adapters/runtime/native_doubao_runtime_v1_provider_delegate.js";
const ownerRuntimePath = "adapters/runtime/native_doubao_runtime_v1_real_bound_owner_runtime.js";
const previousReceiptPath = "reports/runtime_to_review_v1/guarded_live_probe_real_bound_owner_runtime_20260529_failed_closed.json";

let passed = true;
const results = [];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository: ${relativePath}`);
  }
  return resolved;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function check(id, fn) {
  try {
    const ok = fn();
    results.push({ check: id, passed: Boolean(ok) });
    if (!ok) passed = false;
  } catch (error) {
    results.push({ check: id, passed: false, error: error.message });
    passed = false;
  }
}

function runNode(args) {
  return childProcess.execFileSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function commandEquals(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

const packet = readJson(packetPath);
const previousReceipt = readJson(previousReceiptPath);
const doc = readText(docPath);
const runner = require(repoPath(runnerPath));
const futureLiveCommand = [
  "node",
  runnerPath,
  "--provider-delegate-module",
  delegatePath,
  "--owner-runtime-module",
  ownerRuntimePath,
  "--confirm-live-provider-probe",
  runner.exactConfirmation,
  "--max-images",
  "1",
];
const preflightOnlyCommand = [...futureLiveCommand, "--preflight-only"];

check("packet_exists", () => fs.existsSync(repoPath(packetPath)));
check("doc_exists", () => fs.existsSync(repoPath(docPath)));
check("runner_exists", () => fs.existsSync(repoPath(runnerPath)));
check("delegate_exists", () => fs.existsSync(repoPath(delegatePath)));
check("owner_runtime_exists", () => fs.existsSync(repoPath(ownerRuntimePath)));
check("previous_failed_closed_receipt_exists", () => fs.existsSync(repoPath(previousReceiptPath)));
check("packet_schema", () => packet.schema === "runtime_to_review_v1_guarded_live_probe_preflight_packet.v1");
check("packet_inactive", () =>
  packet.status === "prepared_inactive_not_executed" &&
  packet.can_execute_now === false &&
  packet.execution_authorized_by_this_packet === false
);
check("exact_confirmation_matches_runner", () =>
  packet.exact_confirmation_phrase === "RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE" &&
  packet.exact_confirmation_phrase === runner.exactConfirmation
);
check("future_live_command_exact", () => commandEquals(packet.future_live_command, futureLiveCommand));
check("preflight_only_command_exact", () => commandEquals(packet.preflight_only_validation_command, preflightOnlyCommand));
check("budget_one_provider_one_image", () =>
  packet.budget.max_provider_calls === 1 &&
  packet.budget.max_plugin_calls === 1 &&
  packet.budget.max_api_calls === 1 &&
  packet.budget.max_images === 1 &&
  packet.budget.max_live_probe_attempts === 1 &&
  packet.budget.retry_allowed === false
);
check("output_and_receipt_paths_scoped", () =>
  packet.output_directory_ref === "runs/real_generation/runtime_to_review_v1_guarded_live_probe/" &&
  packet.planned_receipt_ref === "reports/runtime_to_review_v1/guarded_live_probe_real_bound_owner_runtime_20260531_receipt.json" &&
  !path.isAbsolute(packet.output_directory_ref) &&
  !path.isAbsolute(packet.planned_receipt_ref)
);
check("forbidden_now_all_false", () => Object.values(packet.forbidden_now).every((value) => value === false));
check("stop_conditions_include_secret_and_uncapped_cost", () =>
  packet.stop_conditions.includes("secret value read required by Agent Image Lab") &&
  packet.stop_conditions.includes("unknown cost or uncapped retry")
);
check("previous_receipt_failed_closed_baseline", () =>
  previousReceipt.live_probe_attempted === true &&
  previousReceipt.live_probe_attempt_count === 1 &&
  previousReceipt.live_probe_status === "failed_closed" &&
  previousReceipt.output_file_count_after_probe === 0 &&
  previousReceipt.secret_values_printed === false &&
  previousReceipt.memory_write_performed === false &&
  previousReceipt.production_candidate_created === false
);
check("runner_validate_preflight_passes_for_future_command", () =>
  runner.validatePreflight({
    max_images: 1,
    provider_delegate_module: delegatePath,
    owner_runtime_module: ownerRuntimePath,
    confirm_live_provider_probe: runner.exactConfirmation,
  }).passed === true
);
check("runner_validate_preflight_blocks_wrong_phrase", () =>
  runner.validatePreflight({
    max_images: 1,
    provider_delegate_module: delegatePath,
    owner_runtime_module: ownerRuntimePath,
    confirm_live_provider_probe: "WRONG_CONFIRMATION",
  }).passed === false
);
check("runner_validate_preflight_blocks_two_images", () =>
  runner.validatePreflight({
    max_images: 2,
    provider_delegate_module: delegatePath,
    owner_runtime_module: ownerRuntimePath,
    confirm_live_provider_probe: runner.exactConfirmation,
  }).passed === false
);
check("preflight_only_runner_does_not_call_provider", () => {
  const output = JSON.parse(runNode(preflightOnlyCommand.slice(1)));
  return output.status === "preflight_only_no_live_probe_executed" &&
    output.preflight_would_pass_with_current_args === true &&
    output.real_provider_call_performed === false &&
    output.provider_contact_performed === false &&
    output.plugin_call_performed === false &&
    output.api_call_performed === false &&
    output.image_generation_performed === false &&
    output.secret_value_read_performed_by_runner === false;
});
check("doc_references_packet_and_command", () =>
  doc.includes(packetPath) &&
  doc.includes("can_execute_now: false") &&
  doc.includes("node scripts/run_runtime_to_review_v1_guarded_live_probe.js --provider-delegate-module")
);

process.stdout.write(`${JSON.stringify({
  passed,
  validator,
  packet: packetPath,
  doc: docPath,
  check_count: results.length,
  failed_count: results.filter((result) => !result.passed).length,
  can_execute_now: packet.can_execute_now,
  exact_confirmation_phrase: packet.exact_confirmation_phrase,
  future_live_command_recorded: true,
  preflight_only_verified_no_live_call: results.find((result) => result.check === "preflight_only_runner_does_not_call_provider")?.passed === true,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  secret_value_read_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  accepted_samples_write_performed: false,
  production_candidate_write_performed: false,
  results,
}, null, 2)}\n`);
if (!passed) process.exitCode = 1;
