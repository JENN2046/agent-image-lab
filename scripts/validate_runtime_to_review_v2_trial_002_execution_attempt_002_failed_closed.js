#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v2_trial_002_execution_attempt_002_failed_closed";
const receiptRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_execution_attempt_002_failed_closed_20260609.json";
const rearmPacketRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_rearm_packet_attempt_002_20260609.json";
const attempt001ReceiptRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_execution_attempt_001_failed_closed_20260609.json";
const outputDir = "runs/real_generation/runtime_to_review_v2_trial_002_lantern_ecommerce_hero/";

let passed = true;
const results = [];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repo root: ${relativePath}`);
  }
  return resolved;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
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

function main() {
  const receipt = readJson(receiptRef);
  const rearmPacket = readJson(rearmPacketRef);
  const attempt001Receipt = readJson(attempt001ReceiptRef);

  check("receipt_schema_and_identity", () =>
    receipt.schema === "runtime_to_review_v2_trial_002_execution_attempt_failed_closed_receipt.v1" &&
    receipt.receipt_id === "r2r_v2_trial_002_lantern_ecommerce_hero_execution_attempt_002_failed_closed_20260609" &&
    receipt.trial_id === "r2r_v2_trial_002_lantern_ecommerce_hero" &&
    receipt.attempt_id === "attempt_002" &&
    receipt.status === "failed_closed_bearer_required_no_image" &&
    receipt.source_packet_ref === rearmPacketRef &&
    receipt.source_rearm_packet_ref === rearmPacketRef &&
    receipt.previous_attempt_receipt_ref === attempt001ReceiptRef
  );
  check("source_rearm_packet_was_executable_and_attempt_001_consumed", () =>
    rearmPacket.can_execute_now === true &&
    rearmPacket.binding_ready === true &&
    rearmPacket.attempt_id === "attempt_002" &&
    rearmPacket.dispatch_performed === false &&
    attempt001Receipt.attempt_id === "attempt_001" &&
    attempt001Receipt.status === "failed_closed_route_unreachable_no_image" &&
    attempt001Receipt.budget_consumption.attempt_consumed === true &&
    receipt.execution_started_from_rearm_packet === true &&
    receipt.can_execute_now_at_dispatch === true
  );
  check("command_was_exact_once_no_retry_no_attempt_001_reuse", () =>
    receipt.dispatch_command_executed_once.command === "node" &&
    receipt.dispatch_command_executed_once.args.includes("scripts/run_runtime_to_review_v1_guarded_live_probe.js") &&
    receipt.dispatch_command_executed_once.args.includes("tests/fixtures/runtime_kernel_v2_trial_002_lantern_ecommerce_hero_task.fixture.json") &&
    receipt.dispatch_command_executed_once.args.includes("adapters/runtime/native_doubao_runtime_v2_trial_002_lantern_ecommerce_broker_dispatch_adapter.js") &&
    receipt.dispatch_command_executed_once.args.includes("RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE") &&
    receipt.dispatch_command_executed_once.args.includes("1") &&
    receipt.dispatch_command_executed_once.retry_flags_added === false &&
    receipt.dispatch_command_executed_once.prompt_or_output_overridden === false &&
    receipt.dispatch_command_executed_once.attempt_001_reused === false
  );
  check("pre_dispatch_validation_chain_recorded", () =>
    receipt.pre_dispatch_validation_passed.includes("node scripts/validate_runtime_to_review_v2_trial_002_rearm_packet_attempt_002.js") &&
    receipt.pre_dispatch_validation_passed.includes("npm run validate:runtime-to-review-trial-002-binding-ready-execution") &&
    receipt.pre_dispatch_validation_passed.includes("npm run validate:runtime-to-review-trial-002-attempt-001-failed-closed") &&
    receipt.pre_dispatch_validation_passed.includes("node scripts/validate_runtime_to_review_v2_trial_002_ail_side_binding_preflight.js") &&
    receipt.pre_dispatch_validation_passed.includes("git diff --check")
  );
  check("vcptoolbox_state_and_route_head_recorded", () =>
    receipt.external_vcptoolbox_state_before_dispatch.branch === "main" &&
    receipt.external_vcptoolbox_state_before_dispatch.head === "ddfc2b1f94616c42712d57e5eb3b3de4fc212b03" &&
    receipt.external_vcptoolbox_state_before_dispatch.origin_main === "ddfc2b1f94616c42712d57e5eb3b3de4fc212b03" &&
    receipt.external_vcptoolbox_state_before_dispatch.worktree_clean_before_dispatch === true &&
    receipt.external_vcptoolbox_state_before_dispatch.route_head_status_before_dispatch === 204
  );
  check("failed_closed_bearer_required_not_route_unreachable", () =>
    receipt.result.runner_status === "failed_closed" &&
    receipt.result.runtime_status === "failed_closed" &&
    receipt.result.stop_reason === "provider_delegate_result_invalid" &&
    receipt.result.delegate_status === "BLOCKED_R2R_V2_TRIAL_002_BROKER_DISPATCH_FAILED_CLOSED" &&
    receipt.result.delegate_blocker === "runtime_bridge_blocker_unauthorized_bearer_required_http_401" &&
    receipt.result.route_http_request_attempted === true &&
    receipt.result.route_http_response_received === true &&
    receipt.result.route_http_status_code === 401 &&
    receipt.result.sanitized_http_error === "Unauthorized (Bearer <redacted> required)" &&
    !JSON.stringify(receipt).includes("Bearer ey") &&
    !JSON.stringify(receipt).includes("Bearer sk-")
  );
  check("no_provider_plugin_api_image_or_output", () =>
    receipt.result.provider_contact_performed === false &&
    receipt.result.plugin_call_performed === false &&
    receipt.result.api_call_performed === false &&
    receipt.result.image_generation_performed === false &&
    receipt.result.output_write_performed === false &&
    receipt.result.calls_used.provider === 0 &&
    receipt.result.calls_used.plugin === 0 &&
    receipt.result.calls_used.api === 0 &&
    receipt.result.image_count === 0 &&
    receipt.result.artifact_record_ref === null &&
    receipt.result.review_bridge_ref === null
  );
  check("post_attempt_snapshot_recorded_no_success_artifacts", () =>
    receipt.post_attempt_filesystem_observation.output_directory_ref === outputDir &&
    receipt.post_attempt_filesystem_observation.output_directory_existed_after_attempt === false &&
    receipt.post_attempt_filesystem_observation.success_receipt_existed_after_attempt === false &&
    receipt.post_attempt_filesystem_observation.artifact_record_existed_after_attempt === false &&
    receipt.post_attempt_filesystem_observation.review_bridge_existed_after_attempt === false
  );
  check("budget_consumed_without_retry", () =>
    receipt.budget_consumption.max_route_http_requests === 1 &&
    receipt.budget_consumption.route_http_requests_attempted === 1 &&
    receipt.budget_consumption.provider_calls_used === 0 &&
    receipt.budget_consumption.plugin_calls_used === 0 &&
    receipt.budget_consumption.api_calls_used === 0 &&
    receipt.budget_consumption.images_created === 0 &&
    receipt.budget_consumption.retry_allowed === false &&
    receipt.budget_consumption.retry_performed === false &&
    receipt.budget_consumption.attempt_consumed === true
  );
  check("side_effect_flags_match_failed_closed_boundary", () =>
    receipt.side_effect_flags.route_http_request_performed === true &&
    receipt.side_effect_flags.provider_contact_performed === false &&
    receipt.side_effect_flags.plugin_call_performed === false &&
    receipt.side_effect_flags.api_call_performed === false &&
    receipt.side_effect_flags.image_generation_performed === false &&
    receipt.side_effect_flags.output_write_performed === false &&
    receipt.side_effect_flags.secret_value_read_performed === false &&
    receipt.side_effect_flags.env_file_content_read_performed === false &&
    receipt.side_effect_flags.accepted_samples_write_performed === false &&
    receipt.side_effect_flags.production_candidate_write_performed === false &&
    receipt.side_effect_flags.DailyNote_write_performed === false &&
    receipt.side_effect_flags.VCP_memory_write_performed === false &&
    receipt.side_effect_flags.push_tag_release_deploy_performed === false
  );
  check("next_action_blocks_attempt_002_rerun", () =>
    receipt.next_allowed_action === "do_not_rerun_attempt_002; fix the Trial 002 POST secretless authorizer path or bearer bypass, then prepare a separate attempt 003 rearm packet before any future Trial 002 execution"
  );

  const output = {
    passed,
    validator,
    receipt_ref: receiptRef,
    source_rearm_packet_ref: rearmPacketRef,
    status: receipt.status,
    route_http_request_attempted: true,
    route_http_status_code: receipt.result.route_http_status_code,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results,
  };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
