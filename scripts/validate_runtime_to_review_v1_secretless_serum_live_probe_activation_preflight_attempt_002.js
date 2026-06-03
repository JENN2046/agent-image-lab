#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_secretless_serum_live_probe_activation_preflight_attempt_002";
const packetPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_activation_preflight_20260603_attempt_002.json";
const routerBindingPushedReceiptPath = "reports/runtime_to_review_v1/secretless_option_a_vcptoolbox_router_binding_implementation_pushed_receipt_20260603.json";
const exactBindingPacketPath = "reports/runtime_to_review_v1/secretless_option_a_exact_binding_packet_draft_20260603.json";
const callableRunnerPath = "reports/runtime_to_review_v1/secretless_option_a_callable_runner_implementation_preflight_20260603.json";
const consumedReceiptPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_001.json";
const consumedArtifactPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_001.json";
const validatorPath = "scripts/validate_runtime_to_review_v1_secretless_serum_live_probe_activation_preflight_attempt_002.js";
const packageScriptName = "validate:runtime-to-review-secretless-serum-live-probe-activation-preflight-attempt-002";
const manifestId = "runtime_to_review_secretless_serum_live_probe_activation_preflight_attempt_002";
const pushedCommit = "bcb8219a0990f9828df6789d62ed35e14293461d";
const oldCommit = "cf1fa55b36e9aeece2718bf2c9425c44db24cb25";
const activationPhrase = "RUNTIME_TO_REVIEW_V1_SECRETLESS_SERUM_BOTTLE_ONE_PROVIDER_ONE_IMAGE";

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

function includesAll(values, expectedValues) {
  return Array.isArray(values) && expectedValues.every((value) => values.includes(value));
}

function equalSet(values, expectedValues) {
  return Array.isArray(values) &&
    values.length === expectedValues.length &&
    expectedValues.every((value) => values.includes(value));
}

function fieldsAreFalse(object, fields) {
  return Boolean(object) && fields.every((field) => object[field] === false);
}

function main() {
  const packet = readJson(packetPath);
  const routerBindingReceipt = readJson(routerBindingPushedReceiptPath);
  const exactBindingPacket = readJson(exactBindingPacketPath);
  const callableRunner = readJson(callableRunnerPath);
  const consumedReceipt = readJson(consumedReceiptPath);
  const consumedArtifact = readJson(consumedArtifactPath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const validatorSource = fs.readFileSync(repoPath(validatorPath), "utf8");
  const processEnvToken = "process" + ".env";
  const envLoaderToken = "dot" + "env";
  const expectedAllowedFields = [
    "task_id",
    "route_id",
    "target_product",
    "prompt_package_ref",
    "model_id",
    "max_provider_calls",
    "max_plugin_calls",
    "max_api_calls",
    "max_images",
    "retry_allowed",
    "receipt_ref",
    "artifact_record_ref",
    "output_directory_ref",
    "non_secret_payload_hash"
  ];
  const expectedForbiddenKeys = [
    "adminusername",
    "adminpassword",
    "basicauthheader",
    "authorizationheader",
    "authorization",
    "basicauth",
    "auth",
    "bearertoken",
    "token",
    "secretenvvarvalue",
    "apikey",
    "accesstoken",
    "refreshtoken",
    "password",
    "cookie",
    "headers"
  ];

  check("packet_schema_status_and_mode", () =>
    packet.schema === "runtime_to_review_v1_secretless_serum_live_probe_activation_preflight.v2" &&
    packet.packet_id === "secretless_serum_live_probe_activation_preflight_20260603_attempt_002" &&
    packet.activation_package_id === "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-002" &&
    packet.lane === "Green_activation_preflight_successor_packet_only" &&
    packet.mode === "new_exact_secretless_serum_live_probe_activation_preflight_no_execution" &&
    packet.status === "prepared_inactive_not_executed"
  );

  check("source_refs_exist_and_include_current_router_binding", () =>
    includesAll(packet.source_refs, [
      routerBindingPushedReceiptPath,
      exactBindingPacketPath,
      callableRunnerPath,
      consumedReceiptPath,
      consumedArtifactPath
    ]) &&
    packet.source_refs.every((relativePath) => fs.existsSync(repoPath(relativePath))) &&
    routerBindingReceipt.pushed_router_binding_event.pushed_commit === pushedCommit &&
    routerBindingReceipt.current_agent_image_lab_execution_boundary.route_binding_implementation_pushed === true
  );

  check("current_context_points_to_bcb8219a_and_stays_closed", () =>
    packet.current_context.repository === "Agent Image Lab" &&
    packet.current_context.branch === "master" &&
    packet.current_context.local_head_before_task === "d2ce7542" &&
    packet.current_context.current_permission === "cannot_run_live_probe_now" &&
    packet.current_context.consumed_attempt_retry_allowed === false &&
    packet.current_context.vcptoolbox_required_commit === pushedCommit &&
    packet.current_context.agent_image_lab_secret_contact_required === false &&
    packet.current_context.agent_image_lab_authorization_header_construction_allowed === false
  );

  check("old_cf1_activation_and_binding_are_not_current_permission", () =>
    packet.superseded_or_historical_refs.prior_vcptoolbox_commit === oldCommit &&
    packet.superseded_or_historical_refs.exact_binding_packet_vcptoolbox_commit === oldCommit &&
    exactBindingPacket.exact_binding_packet_draft.vcptoolbox_required_commit === oldCommit &&
    packet.superseded_or_historical_refs.new_binding_packet_required_before_execution === true &&
    packet.go_no_go.future_live_probe_requires_binding_packet_refresh_for_bcb8219a === true
  );

  check("authorization_state_is_inactive", () =>
    fieldsAreFalse(packet.authorization_state, [
      "authorization_granted_by_this_record",
      "activation_granted_by_this_record",
      "live_probe_authorized_by_this_record",
      "route_http_authorized_by_this_record",
      "provider_plugin_api_image_authorized_by_this_record",
      "external_vcptoolbox_read_authorized_by_this_record",
      "external_vcptoolbox_modification_authorized_by_this_record",
      "secret_value_read_authorized_by_this_record",
      "can_execute_now",
      "next_auto_step_allowed"
    ])
  );

  check("exact_activation_statement_names_bcb8219a_and_phrase", () =>
    packet.exact_activation_statement_to_request.includes(packet.activation_package_id) &&
    packet.exact_activation_statement_to_request.includes(pushedCommit) &&
    packet.exact_activation_statement_to_request.includes("one provider / one plugin / one API / one image / no retry") &&
    packet.required_future_owner_confirmation_phrase === activationPhrase
  );

  check("future_scope_budget_and_secretless_payload_are_locked", () =>
    packet.future_execution_scope_if_later_separately_activated.route === "vcptoolbox_option_a_secretless_internal_authorized_execution_interface" &&
    packet.future_execution_scope_if_later_separately_activated.target_product === "premium_serum_bottle" &&
    packet.future_execution_scope_if_later_separately_activated.vcptoolbox_required_commit === pushedCommit &&
    packet.future_execution_scope_if_later_separately_activated.binding_packet_required_before_execution === true &&
    packet.future_execution_scope_if_later_separately_activated.binding_packet_must_reference_commit === pushedCommit &&
    packet.future_execution_scope_if_later_separately_activated.max_provider_calls === 1 &&
    packet.future_execution_scope_if_later_separately_activated.max_plugin_calls === 1 &&
    packet.future_execution_scope_if_later_separately_activated.max_api_calls === 1 &&
    packet.future_execution_scope_if_later_separately_activated.max_images === 1 &&
    packet.future_execution_scope_if_later_separately_activated.max_live_probe_attempts === 1 &&
    packet.future_execution_scope_if_later_separately_activated.retry_allowed === false &&
    packet.future_execution_scope_if_later_separately_activated.overwrite_existing_files_allowed === false &&
    packet.future_execution_scope_if_later_separately_activated.secret_value_read_allowed_by_agent_image_lab === false &&
    packet.future_execution_scope_if_later_separately_activated.agent_image_lab_authorization_header_construction_allowed === false &&
    equalSet(packet.future_execution_scope_if_later_separately_activated.allowed_non_secret_payload_fields, expectedAllowedFields) &&
    equalSet(packet.future_execution_scope_if_later_separately_activated.forbidden_payload_keys_normalized_anywhere, expectedForbiddenKeys)
  );

  check("taskbook_requires_binding_refresh_before_activation_execution", () =>
    Array.isArray(packet.preflight_taskbook_before_any_execution) &&
    packet.preflight_taskbook_before_any_execution.length === 6 &&
    packet.preflight_taskbook_before_any_execution.every((step) => step.required_before_execution === true) &&
    packet.preflight_taskbook_before_any_execution.some((step) => step.name === "refresh_exact_binding_packet") &&
    packet.preflight_taskbook_before_any_execution.some((step) => step.name === "receive_exact_activation") &&
    packet.preflight_taskbook_before_any_execution.some((step) => step.name === "execute_one_live_probe_only_after_activation")
  );

  check("planned_output_paths_are_attempt_002", () =>
    packet.future_execution_scope_if_later_separately_activated.target_output_directory_ref.endsWith("_attempt_002/") &&
    packet.planned_receipt_ref_if_activated_later === "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_002.json" &&
    packet.planned_artifact_record_ref_if_activated_later === "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_002.json" &&
    consumedReceipt.status === "failed_closed_before_route_http_request" &&
    consumedArtifact.result === "failed_closed_before_route_http_request"
  );

  check("validation_required_now_is_non_executing", () =>
    includesAll(packet.validation_required_now, [
      `node --check ${validatorPath}`,
      `npm run ${packageScriptName}`,
      "node scripts/validate_validation_manifest.js",
      "node scripts/recommend_validation_for_changed_files.js",
      "node scripts/validate_agent_board_state.js",
      "git diff --check"
    ])
  );

  check("stop_conditions_cover_secret_http_scope_and_remote_boundaries", () =>
    includesAll(packet.stop_conditions, [
      "this record is treated as current execution permission",
      "separate exact activation is missing",
      "new binding packet for bcb8219a is missing when execution would begin",
      "old cf1fa55b activation or binding packet is used as current permission",
      "Agent Image Lab must read .env, config.env, secrets, cookies, tokens, or private raw data",
      "Agent Image Lab must construct or send an Authorization header",
      "payload includes authorization, headers, basic_auth, auth, token, cookie, password, apikey, or related forbidden secret key",
      "budget drifts from one provider / one plugin / one API / one image / no retry",
      "provider/plugin/API/image action is requested by this preflight instead of a separate activation",
      "external VCPToolBox read/write is requested without separate exact authorization",
      "push, tag, release, deploy, force push, history rewrite, or destructive action is requested"
    ])
  );

  check("guard_and_go_no_go_stay_non_executing", () =>
    packet.guard.activation_preflight_packet_only === true &&
    fieldsAreFalse(packet.guard, [
      "authorization_granted_by_this_record",
      "activation_granted_by_this_record",
      "can_execute_now",
      "external_repo_read_performed_by_this_task",
      "external_repo_modified_by_this_task",
      "secret_value_read_performed",
      "env_file_content_read_performed",
      "config_env_read_performed",
      "authorization_header_constructed",
      "live_probe_performed",
      "route_http_request_performed",
      "provider_contact_performed",
      "plugin_call_performed",
      "api_call_performed",
      "image_generation_performed",
      "output_write_performed",
      "DailyNote_write_performed",
      "VCP_memory_write_performed",
      "staging_performed",
      "commit_performed",
      "push_tag_release_deploy_performed"
    ]) &&
    packet.go_no_go.activation_preflight_prepared === true &&
    packet.go_no_go.current_live_probe_allowed === false &&
    packet.go_no_go.future_live_probe_requires_separate_exact_activation === true &&
    packet.go_no_go.next_auto_step_allowed === false
  );

  check("validator_source_does_not_access_env_or_http", () =>
    !validatorSource.includes(processEnvToken) &&
    !validatorSource.includes(envLoaderToken) &&
    !validatorSource.includes("fet" + "ch(") &&
    !validatorSource.includes("node:" + "http") &&
    !validatorSource.includes("node:" + "https")
  );

  check("callable_runner_evidence_remains_non_executing", () =>
    callableRunner.runner_contract.current_route_http_binding_status === "not_implemented_not_guessed_by_this_task" &&
    callableRunner.non_execution_boundary.route_http_request_performed === false &&
    callableRunner.non_execution_boundary.live_probe_performed === false &&
    callableRunner.non_execution_boundary.provider_contact_performed === false
  );

  check("package_script_registered", () =>
    packageJson.scripts &&
    packageJson.scripts[packageScriptName] === `node ${validatorPath}`
  );

  check("manifest_entry_registered", () => {
    const entry = manifest.validators.find((item) => item.id === manifestId);
    return entry &&
      entry.command === `npm run ${packageScriptName}` &&
      entry.script === validatorPath &&
      entry.tier === "targeted" &&
      entry.domain === "runtime_to_review" &&
      entry.status === "active" &&
      entry.estimated_runtime_class === "fast" &&
      includesAll(entry.trigger_paths, [
        packetPath,
        validatorPath,
        routerBindingPushedReceiptPath,
        exactBindingPacketPath,
        callableRunnerPath,
        consumedReceiptPath,
        consumedArtifactPath,
        ".agent_board/HANDOFF.md",
        ".agent_board/RUN_STATE.md",
        ".agent_board/TASK_QUEUE.md",
        ".agent_board/CHECKPOINT.md",
        ".agent_board/BLOCKERS.md",
        "package.json",
        "scripts/validation_manifest.json"
      ]) &&
      entry.required_for.includes(manifestId)
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    packet: packetPath,
    activation_package_id: packet.activation_package_id,
    current_permission: packet.current_context.current_permission,
    can_execute_now: false,
    current_live_probe_allowed: false,
    required_future_owner_confirmation_phrase: activationPhrase,
    vcptoolbox_required_commit: pushedCommit,
    binding_packet_refresh_required_before_execution: true,
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    authorization_header_constructed: false,
    live_probe_performed: false,
    route_http_request_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results
  }, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
