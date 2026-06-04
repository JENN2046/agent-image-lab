#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_secretless_serum_live_probe_activation_preflight_attempt_003";
const packetPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_activation_preflight_20260603_attempt_003.json";
const transportPacketPath = "reports/runtime_to_review_v1/secretless_option_a_exact_route_http_transport_preflight_20260603_attempt_003.json";
const refreshedBindingPacketPath = "reports/runtime_to_review_v1/secretless_option_a_exact_binding_packet_draft_20260603_attempt_002.json";
const consumedReceiptPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_002.json";
const consumedArtifactPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_002.json";
const runnerPath = "scripts/run_runtime_to_review_v1_secretless_option_a_callable_runner.js";
const validatorPath = "scripts/validate_runtime_to_review_v1_secretless_serum_live_probe_activation_preflight_attempt_003.js";
const packageScriptName = "validate:runtime-to-review-secretless-serum-live-probe-activation-preflight-attempt-003";
const manifestId = "runtime_to_review_secretless_serum_live_probe_activation_preflight_attempt_003";
const activationPackageId = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-003";
const activationPhrase = "RUNTIME_TO_REVIEW_V1_SECRETLESS_SERUM_BOTTLE_ONE_PROVIDER_ONE_IMAGE";
const pushedCommit = "bcb8219a0990f9828df6789d62ed35e14293461d";

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

function fieldsAreFalse(object, fields) {
  return Boolean(object) && fields.every((field) => object[field] === false);
}

function main() {
  const packet = readJson(packetPath);
  const transportPacket = readJson(transportPacketPath);
  const refreshedBindingPacket = readJson(refreshedBindingPacketPath);
  const consumedReceipt = readJson(consumedReceiptPath);
  const consumedArtifact = readJson(consumedArtifactPath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const validatorSource = fs.readFileSync(repoPath(validatorPath), "utf8");
  const runner = require(repoPath(runnerPath));

  check("packet_schema_status_and_mode", () =>
    packet.schema === "runtime_to_review_v1_secretless_serum_live_probe_activation_preflight.v3" &&
    packet.packet_id === "secretless_serum_live_probe_activation_preflight_20260603_attempt_003" &&
    packet.activation_package_id === activationPackageId &&
    packet.status === "prepared_inactive_not_executed" &&
    packet.mode === "new_exact_secretless_serum_live_probe_activation_preflight_no_execution_with_exact_route_http_transport"
  );

  check("source_refs_exist", () =>
    includesAll(packet.source_refs, [
      transportPacketPath,
      refreshedBindingPacketPath,
      consumedReceiptPath,
      consumedArtifactPath,
      runnerPath
    ]) &&
    packet.source_refs.every((relativePath) => fs.existsSync(repoPath(relativePath)))
  );

  check("route_http_transport_matches_exact_vcptoolbox_evidence", () =>
    packet.exact_route_http_transport.method === "POST" &&
    packet.exact_route_http_transport.path === "/admin_api/ai-image-agents/execute/serum-bottle-secretless" &&
    packet.exact_route_http_transport.method === transportPacket.exact_route_http_transport.method &&
    packet.exact_route_http_transport.path === transportPacket.exact_route_http_transport.path &&
    packet.exact_route_http_transport.method === runner.exactRouteHttpMethod &&
    packet.exact_route_http_transport.path === runner.exactRouteHttpPath &&
    packet.exact_route_http_transport.routeHttpOrigin_required_in_future_exact_activation === true &&
    packet.exact_route_http_transport.endpoint_guessing_allowed === false &&
    packet.exact_route_http_transport.authorization_header_allowed === false
  );

  check("current_context_and_authorization_are_inactive", () =>
    packet.current_context.vcptoolbox_required_commit === pushedCommit &&
    packet.current_context.route_http_endpoint_guessing_allowed === false &&
    packet.current_context.route_http_origin_required_from_future_activation === true &&
    packet.current_context.route_http_origin_value_included_now === false &&
    fieldsAreFalse(packet.authorization_state, [
      "authorization_granted_by_this_record",
      "activation_granted_by_this_record",
      "live_probe_authorized_by_this_record",
      "route_http_authorized_by_this_record",
      "provider_plugin_api_image_authorized_by_this_record",
      "secret_value_read_authorized_by_this_record",
      "can_execute_now",
      "next_auto_step_allowed"
    ])
  );

  check("activation_statement_requires_origin_and_no_guessing", () =>
    packet.exact_activation_statement_to_request.includes(activationPackageId) &&
    packet.exact_activation_statement_to_request.includes("routeHttpOrigin supplied explicitly by the owner") &&
    packet.exact_activation_statement_to_request.includes("POST /admin_api/ai-image-agents/execute/serum-bottle-secretless") &&
    packet.exact_activation_statement_to_request.includes(pushedCommit) &&
    packet.required_future_owner_confirmation_phrase === activationPhrase
  );

  check("future_scope_budget_and_paths_are_attempt_003", () =>
    packet.future_execution_scope_if_later_separately_activated.route_id === "serum_bottle_vcptoolbox_route_owner_runtime" &&
    packet.future_execution_scope_if_later_separately_activated.target_product === "premium_serum_bottle" &&
    packet.future_execution_scope_if_later_separately_activated.vcptoolbox_required_commit === pushedCommit &&
    packet.future_execution_scope_if_later_separately_activated.binding_packet_ref === refreshedBindingPacketPath &&
    packet.future_execution_scope_if_later_separately_activated.binding_packet_id === "BINDING-DRAFT-SECRETLESS-OPTION-A-SERUM-20260603-002" &&
    packet.future_execution_scope_if_later_separately_activated.max_provider_calls === 1 &&
    packet.future_execution_scope_if_later_separately_activated.max_plugin_calls === 1 &&
    packet.future_execution_scope_if_later_separately_activated.max_api_calls === 1 &&
    packet.future_execution_scope_if_later_separately_activated.max_images === 1 &&
    packet.future_execution_scope_if_later_separately_activated.retry_allowed === false &&
    packet.future_execution_scope_if_later_separately_activated.target_output_directory_ref.endsWith("_attempt_003/") &&
    packet.planned_receipt_ref_if_activated_later.endsWith("_attempt_003.json") &&
    packet.planned_artifact_record_ref_if_activated_later.endsWith("_attempt_003.json")
  );

  check("binding_packet_and_prior_attempt_are_consistent", () =>
    refreshedBindingPacket.exact_binding_packet_draft.vcptoolbox_required_commit === pushedCommit &&
    refreshedBindingPacket.exact_binding_packet_draft.activation_package_id_required === "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-002" &&
    consumedReceipt.status === "failed_closed_before_route_http_request" &&
    consumedReceipt.activation_package_id === "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-002" &&
    consumedArtifact.result === "failed_closed_before_route_http_request"
  );

  check("missing_origin_fails_closed_without_http", () => {
    const result = runner.validateExactRouteHttpTransportInput({
      activationPackageId,
      confirmationPhrase: activationPhrase,
      routeHttpMethod: "POST",
      routeHttpPath: packet.exact_route_http_transport.path
    });
    return result.ok === false &&
      result.status === "secretless_option_a_route_http_origin_missing" &&
      result.route_http_request_performed === false &&
      result.provider_contact_performed === false &&
      result.image_generation_performed === false;
  });

  check("stop_conditions_cover_exact_origin_secret_and_remote_boundaries", () =>
    includesAll(packet.stop_conditions, [
      "routeHttpOrigin is missing from the separate exact activation",
      "routeHttpOrigin contains a path, query, or hash",
      "method or path differs from POST /admin_api/ai-image-agents/execute/serum-bottle-secretless",
      "endpoint host or port would need to be guessed",
      "Agent Image Lab must read .env, config.env, secrets, cookies, tokens, or private raw data",
      "Agent Image Lab must construct or send an Authorization header",
      "budget drifts from one provider / one plugin / one API / one image / no retry",
      "planned attempt-003 receipt, artifact record, or output directory already exists",
      "push, tag, release, deploy, force push, history rewrite, or destructive action is requested"
    ])
  );

  check("guard_and_go_no_go_stay_non_executing", () =>
    packet.guard.activation_preflight_packet_only === true &&
    fieldsAreFalse(packet.guard, [
      "authorization_granted_by_this_record",
      "activation_granted_by_this_record",
      "can_execute_now",
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
      "staging_performed",
      "commit_performed",
      "push_tag_release_deploy_performed"
    ]) &&
    packet.go_no_go.activation_preflight_prepared === true &&
    packet.go_no_go.current_live_probe_allowed === false &&
    packet.go_no_go.future_live_probe_requires_separate_exact_activation === true &&
    packet.go_no_go.future_live_probe_requires_routeHttpOrigin === true &&
    packet.go_no_go.next_auto_step_allowed === false
  );

  check("validator_source_does_not_access_env_or_http", () =>
    !validatorSource.includes("process" + "." + "env") &&
    !validatorSource.includes("dot" + "env") &&
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
        transportPacketPath,
        refreshedBindingPacketPath,
        consumedReceiptPath,
        consumedArtifactPath,
        runnerPath,
        validatorPath,
        "package.json",
        "scripts/validation_manifest.json"
      ]) &&
      entry.required_for.includes(manifestId);
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    packet: packetPath,
    activation_package_id: activationPackageId,
    current_live_probe_allowed: false,
    routeHttpOrigin_required_from_future_activation: true,
    route_http_request_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results
  }, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
