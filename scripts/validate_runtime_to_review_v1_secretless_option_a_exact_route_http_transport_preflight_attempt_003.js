#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_secretless_option_a_exact_route_http_transport_preflight_attempt_003";
const packetPath = "reports/runtime_to_review_v1/secretless_option_a_exact_route_http_transport_preflight_20260603_attempt_003.json";
const runnerPath = "scripts/run_runtime_to_review_v1_secretless_option_a_callable_runner.js";
const validatorPath = "scripts/validate_runtime_to_review_v1_secretless_option_a_exact_route_http_transport_preflight_attempt_003.js";
const packageScriptName = "validate:runtime-to-review-secretless-option-a-exact-route-http-transport-preflight-attempt-003";
const manifestId = "runtime_to_review_secretless_option_a_exact_route_http_transport_preflight_attempt_003";
const activationPackageId = "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-003";
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

function sourceConstructsAuthorizationHeader(source) {
  const patterns = [
    /\b(?:Authorization|authorization)\s*:/,
    /["'](?:Authorization|authorization)["']\s*:/,
    /\bheaders\s*\[\s*["'](?:Authorization|authorization)["']\s*\]\s*=/,
    /\bheaders\s*\.\s*(?:Authorization|authorization)\s*=/,
    /\b(?:setHeader|appendHeader)\s*\(\s*["']Authorization["']/i,
    /\bHeaders\s*\([^)]*["']Authorization["']/is
  ];
  return patterns.some((pattern) => pattern.test(source));
}

function main() {
  const packet = readJson(packetPath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const runner = require(repoPath(runnerPath));
  const runnerSource = fs.readFileSync(repoPath(runnerPath), "utf8");
  const validatorSource = fs.readFileSync(repoPath(validatorPath), "utf8");

  check("packet_schema_status_and_mode", () =>
    packet.schema === "runtime_to_review_v1_secretless_option_a_exact_route_http_transport_preflight.v1" &&
    packet.status === "prepared_not_activated" &&
    packet.mode === "exact_route_http_transport_from_vcptoolbox_bcb8219a_no_endpoint_guessing"
  );

  check("vcptoolbox_exact_read_evidence_bcb8219a", () =>
    packet.vcptoolbox_exact_read_evidence.head === pushedCommit &&
    packet.vcptoolbox_exact_read_evidence.origin_main === pushedCommit &&
    packet.vcptoolbox_exact_read_evidence.external_repo_modified === false &&
    includesAll(packet.vcptoolbox_exact_read_evidence.files_read, [
      "server.js",
      "routes/admin/aiImageAgents.js",
      "tests/aiImageAgentsRoute.test.js"
    ])
  );

  check("exact_method_path_from_vcptoolbox_sources", () =>
    packet.exact_route_http_transport.activation_package_id_required === activationPackageId &&
    packet.exact_route_http_transport.method === runner.exactRouteHttpMethod &&
    packet.exact_route_http_transport.path === runner.exactRouteHttpPath &&
    packet.exact_route_http_transport.method === "POST" &&
    packet.exact_route_http_transport.path === "/admin_api/ai-image-agents/execute/serum-bottle-secretless" &&
    packet.exact_route_http_transport.origin_required_from_future_activation === true &&
    packet.exact_route_http_transport.origin_value_included_now === false &&
    packet.exact_route_http_transport.endpoint_guessing_allowed === false
  );

  check("route_body_contract_matches_runner", () => {
    const body = runner.buildExactRouteHttpBody({
      activationPackageId,
      confirmationPhrase: packet.exact_route_http_transport.required_owner_confirmation_phrase,
      pipelineId: "secretless-serum-live-probe-attempt-003",
      taskId: activationPackageId,
      routeId: packet.exact_route_body_contract.selected_route_id,
      receiptRef: packet.exact_route_body_contract.planned_attempt_003_receipt_ref,
      artifactRecordRef: packet.exact_route_body_contract.planned_attempt_003_artifact_record_ref,
      outputDirectoryRef: packet.exact_route_body_contract.planned_attempt_003_output_directory_ref,
      modelId: packet.exact_route_body_contract.plan_steps_contract.model,
      prompt: "premium serum bottle product image, clean cosmetic studio lighting, one bottle, no text overlay",
      maxProviderCalls: 1,
      maxPluginCalls: 1,
      maxApiCalls: 1,
      maxImages: 1,
      retryAllowed: false
    });
    return body.route_id === packet.exact_route_body_contract.selected_route_id &&
      body.max_provider_calls === 1 &&
      body.max_plugin_calls === 1 &&
      body.max_api_calls === 1 &&
      body.max_images === 1 &&
      body.retry_allowed === false &&
      body.receipt_ref === packet.exact_route_body_contract.planned_attempt_003_receipt_ref &&
      body.artifact_record_ref === packet.exact_route_body_contract.planned_attempt_003_artifact_record_ref &&
      Array.isArray(body.plan.steps) &&
      body.plan.steps.length === 1 &&
      body.plan.steps[0].plugin === "DoubaoGen" &&
      body.plan.steps[0].type === "generate_image" &&
      typeof body.non_secret_payload_hash === "string";
  });

  check("missing_origin_fails_closed_without_http", () => {
    const result = runner.validateExactRouteHttpTransportInput({
      activationPackageId,
      confirmationPhrase: packet.exact_route_http_transport.required_owner_confirmation_phrase,
      routeHttpMethod: "POST",
      routeHttpPath: packet.exact_route_http_transport.path
    });
    return result.ok === false &&
      result.status === "secretless_option_a_route_http_origin_missing" &&
      result.route_http_request_performed === false &&
      result.provider_contact_performed === false &&
      result.image_generation_performed === false &&
      result.secret_value_read_performed === false;
  });

  check("stop_conditions_cover_no_guessing_and_secret_boundaries", () =>
    includesAll(packet.stop_conditions, [
      "route HTTP origin is missing from the future exact activation",
      "method or path differs from the VCPToolBox bcb8219a evidence",
      "endpoint host or port would need to be guessed",
      "secret, env, config, cookie, token, or private raw data read becomes necessary",
      "Authorization header construction by Agent Image Lab becomes necessary",
      "payload contains a forbidden secret-bearing key",
      "planned attempt-003 receipt, artifact record, or output directory already exists"
    ])
  );

  check("non_execution_boundary_all_false", () =>
    fieldsAreFalse(packet.non_execution_boundary, [
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
      "external_vcptoolbox_modified",
      "staging_performed",
      "commit_performed",
      "push_tag_release_deploy_performed"
    ])
  );

  check("runner_source_has_http_transport_but_no_env_or_auth_header", () =>
    runnerSource.includes("runSecretlessOptionAExactRouteHttpTransport") &&
    runnerSource.includes("fet" + "ch(validation.route_http_url") &&
    !runnerSource.includes("process" + "." + "env") &&
    !sourceConstructsAuthorizationHeader(runnerSource)
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
    activation_package_id_required: activationPackageId,
    method: packet.exact_route_http_transport.method,
    path: packet.exact_route_http_transport.path,
    origin_required_from_future_activation: packet.exact_route_http_transport.origin_required_from_future_activation,
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
