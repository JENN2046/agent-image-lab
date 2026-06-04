#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_secretless_option_a_exact_binding_packet_draft_attempt_002";
const packetPath = "reports/runtime_to_review_v1/secretless_option_a_exact_binding_packet_draft_20260603_attempt_002.json";
const priorPacketPath = "reports/runtime_to_review_v1/secretless_option_a_exact_binding_packet_draft_20260603.json";
const activationPreflightPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_activation_preflight_20260603_attempt_002.json";
const routerBindingReceiptPath = "reports/runtime_to_review_v1/secretless_option_a_vcptoolbox_router_binding_implementation_pushed_receipt_20260603.json";
const runnerPath = "scripts/run_runtime_to_review_v1_secretless_option_a_callable_runner.js";
const validatorPath = "scripts/validate_runtime_to_review_v1_secretless_option_a_exact_binding_packet_draft_attempt_002.js";
const packageScriptName = "validate:runtime-to-review-secretless-option-a-exact-binding-packet-draft-attempt-002";
const manifestId = "runtime_to_review_secretless_option_a_exact_binding_packet_draft_attempt_002";
const pushedCommit = "bcb8219a0990f9828df6789d62ed35e14293461d";
const oldCommit = "cf1fa55b36e9aeece2718bf2c9425c44db24cb25";
const activationPackageId = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-002";

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

function allRunnerBoundaryFalse(result) {
  return Boolean(result) &&
    result.route_http_request_performed === false &&
    result.live_probe_performed === false &&
    result.provider_contact_performed === false &&
    result.plugin_call_performed === false &&
    result.api_call_performed === false &&
    result.image_generation_performed === false &&
    result.output_write_performed === false &&
    result.secret_value_read_performed === false &&
    result.env_file_content_read_performed === false &&
    result.config_env_read_performed === false &&
    result.authorization_header_constructed_by_agent_image_lab === false &&
    result.authorizer_call_count === 0 &&
    result.executor_call_count === 0 &&
    result.retry_performed === false;
}

function main() {
  const packet = readJson(packetPath);
  const priorPacket = readJson(priorPacketPath);
  const activationPreflight = readJson(activationPreflightPath);
  const routerBindingReceipt = readJson(routerBindingReceiptPath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const runner = require(repoPath(runnerPath));
  const validatorSource = fs.readFileSync(repoPath(validatorPath), "utf8");
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
    packet.schema === "runtime_to_review_v1_secretless_option_a_exact_binding_packet_draft.v2" &&
    packet.packet_id === "BINDING-DRAFT-SECRETLESS-OPTION-A-SERUM-20260603-002" &&
    packet.status === "draft_not_active_non_executable" &&
    packet.mode === "exact_binding_packet_refreshed_for_bcb8219a_no_route_http_no_external_read"
  );
  check("supersedes_old_cf1_packet", () =>
    packet.supersedes.prior_binding_packet_ref === priorPacketPath &&
    packet.supersedes.prior_vcptoolbox_commit === oldCommit &&
    priorPacket.exact_binding_packet_draft.vcptoolbox_required_commit === oldCommit
  );
  check("references_current_activation_and_router_binding", () =>
    includesAll(packet.source_refs, [activationPreflightPath, routerBindingReceiptPath]) &&
    activationPreflight.activation_package_id === activationPackageId &&
    activationPreflight.future_execution_scope_if_later_separately_activated.vcptoolbox_required_commit === pushedCommit &&
    routerBindingReceipt.pushed_router_binding_event.pushed_commit === pushedCommit
  );
  check("current_permission_stays_inactive", () =>
    packet.current_permission.current_live_probe_allowed === false &&
    packet.current_permission.can_execute_now === false &&
    packet.current_permission.authorization_granted_by_this_record === false &&
    packet.current_permission.activation_granted_by_this_record === false &&
    packet.current_permission.binding_active === false &&
    packet.current_permission.binding_executable_now === false &&
    packet.current_permission.route_http_allowed_by_this_packet === false &&
    packet.current_permission.route_http_binding_granted_by_this_record === false &&
    packet.current_permission.new_exact_activation_required_before_any_live_probe === true
  );
  check("binding_points_to_bcb8219a_attempt_002", () =>
    packet.exact_binding_packet_draft.activation_package_id_required === activationPackageId &&
    packet.exact_binding_packet_draft.vcptoolbox_required_commit === pushedCommit &&
    packet.exact_binding_packet_draft.receipt_ref === "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_002.json" &&
    packet.exact_binding_packet_draft.artifact_record_ref === "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_002.json" &&
    packet.exact_binding_packet_draft.output_directory_ref.endsWith("_attempt_002/")
  );
  check("callable_binding_target_is_explicit_and_http_not_guessed", () =>
    packet.exact_binding_packet_draft.transport_kind === "future_exact_local_callable" &&
    packet.exact_binding_packet_draft.callable_target_ref === runnerPath &&
    packet.exact_binding_packet_draft.callable_export === "runSecretlessOptionACallableRunner" &&
    typeof runner[packet.exact_binding_packet_draft.callable_export] === "function" &&
    packet.exact_binding_packet_draft.request_url_or_endpoint === null &&
    packet.exact_binding_packet_draft.route_http_method === null &&
    packet.exact_binding_packet_draft.route_http_request_allowed_by_this_packet === false
  );
  check("payload_contract_matches_runner", () =>
    equalSet(packet.payload_contract.allowed_non_secret_payload_fields, expectedAllowedFields) &&
    equalSet(packet.payload_contract.forbidden_payload_keys_normalized_anywhere, expectedForbiddenKeys) &&
    equalSet(runner.allowedNonSecretPayloadFields, expectedAllowedFields) &&
    equalSet(runner.forbiddenPayloadKeysNormalized, expectedForbiddenKeys)
  );
  check("budget_is_one_shot_no_retry", () =>
    packet.budget.max_provider_calls === 1 &&
    packet.budget.max_plugin_calls === 1 &&
    packet.budget.max_api_calls === 1 &&
    packet.budget.max_images === 1 &&
    packet.budget.max_live_attempts === 1 &&
    packet.budget.retry_allowed === false
  );
  check("runner_still_preflight_only_or_failed_closed", () => {
    const preflight = runner.runSecretlessOptionACallableRunner({ preflightOnly: true });
    const nonPreflight = runner.runSecretlessOptionACallableRunner({});
    return preflight.ok === true &&
      allRunnerBoundaryFalse(preflight) &&
      allRunnerBoundaryFalse(preflight.result) &&
      nonPreflight.ok === false &&
      nonPreflight.status === "secretless_option_a_callable_runner_failed_closed_route_http_not_authorized" &&
      allRunnerBoundaryFalse(nonPreflight) &&
      allRunnerBoundaryFalse(nonPreflight.result);
  });
  check("stop_conditions_cover_risk_boundaries", () =>
    includesAll(packet.stop_conditions, [
      "binding packet is treated as active without a new exact activation",
      "route HTTP is requested by this draft",
      "VCPToolBox read is required to discover binding",
      "VCPToolBox modification is required by this task",
      "secret, env, config, cookie, token, or private raw data read becomes necessary",
      "Authorization header construction by Agent Image Lab becomes necessary",
      "budget drifts from one provider / one plugin / one API / one image / no retry",
      "live probe, provider, plugin, API, image, or output action is requested by this draft"
    ])
  );
  check("non_execution_boundary_all_false", () =>
    fieldsAreFalse(packet.non_execution_boundary, [
      "external_vcptoolbox_read_performed_by_this_task",
      "external_vcptoolbox_modified_by_this_task",
      "route_http_request_performed",
      "live_probe_performed",
      "provider_contact_performed",
      "plugin_call_performed",
      "api_call_performed",
      "image_generation_performed",
      "output_write_performed",
      "secret_value_read_performed",
      "env_file_content_read_performed",
      "config_env_read_performed",
      "authorization_header_constructed_by_agent_image_lab",
      "authorizer_call_performed",
      "executor_call_performed",
      "DailyNote_write_performed",
      "VCP_memory_write_performed",
      "staging_performed",
      "commit_performed",
      "push_tag_release_deploy_performed"
    ])
  );
  check("validator_source_does_not_access_env_or_http", () =>
    !validatorSource.includes("process" + "." + "env") &&
    !validatorSource.includes("fet" + "ch(") &&
    !validatorSource.includes("node:" + "http") &&
    !validatorSource.includes("node:" + "https")
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
      includesAll(entry.trigger_paths, [
        packetPath,
        validatorPath,
        activationPreflightPath,
        routerBindingReceiptPath,
        priorPacketPath,
        "package.json",
        "scripts/validation_manifest.json"
      ]) &&
      entry.required_for.includes(manifestId);
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    packet: packetPath,
    current_permission: packet.conclusion.current_permission,
    vcptoolbox_required_commit: packet.exact_binding_packet_draft.vcptoolbox_required_commit,
    activation_package_id_required: packet.exact_binding_packet_draft.activation_package_id_required,
    binding_active: false,
    binding_executable_now: false,
    route_http_request_performed: false,
    live_probe_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
    secret_value_read_performed: false,
    authorization_header_constructed_by_agent_image_lab: false,
    next_safe_action: packet.conclusion.next_safe_action,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results
  }, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
