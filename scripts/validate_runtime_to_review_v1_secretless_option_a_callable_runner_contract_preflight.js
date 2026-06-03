#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_secretless_option_a_callable_runner_contract_preflight";
const packagePath = "reports/runtime_to_review_v1/secretless_option_a_callable_runner_contract_preflight_20260603.json";
const pushedReceiptPath = "reports/runtime_to_review_v1/secretless_serum_route_option_a_vcptoolbox_implementation_pushed_receipt_20260603.json";
const failedReceiptPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_001.json";
const failedArtifactPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_001.json";
const redesignPath = "reports/runtime_to_review_v1/secretless_serum_route_redesign_preflight_20260602.json";
const activationPreflightPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_activation_preflight_20260603.json";
const validatorPath = "scripts/validate_runtime_to_review_v1_secretless_option_a_callable_runner_contract_preflight.js";
const packageScriptName = "validate:runtime-to-review-secretless-option-a-callable-runner-contract-preflight";
const manifestId = "runtime_to_review_secretless_option_a_callable_runner_contract_preflight";
const pushedCommit = "cf1fa55b36e9aeece2718bf2c9425c44db24cb25";

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

function normalizeKey(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function fieldsAreFalse(object, fields) {
  return Boolean(object) && fields.every((field) => object[field] === false);
}

function main() {
  const contract = readJson(packagePath);
  const pushedReceipt = readJson(pushedReceiptPath);
  const failedReceipt = readJson(failedReceiptPath);
  const failedArtifact = readJson(failedArtifactPath);
  const redesign = readJson(redesignPath);
  const activationPreflight = readJson(activationPreflightPath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const validatorSource = fs.readFileSync(repoPath(validatorPath), "utf8");
  const processEnvToken = "process" + "." + "env";
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

  check("contract_schema_status_and_mode", () =>
    contract.schema === "runtime_to_review_v1_secretless_option_a_callable_runner_contract_preflight.v1" &&
    contract.preflight_id === "secretless_option_a_callable_runner_contract_preflight_20260603" &&
    contract.lane === "Green_local_contract_preflight_validator_only" &&
    contract.mode === "callable_runner_contract_preflight_no_runtime_no_external_read" &&
    contract.status === "draft_contract_validated_no_execution"
  );
  check("source_refs_exist", () =>
    includesAll(contract.source_refs, [
      redesignPath,
      pushedReceiptPath,
      activationPreflightPath,
      failedReceiptPath,
      failedArtifactPath
    ]) &&
    contract.source_refs.every((relativePath) => fs.existsSync(repoPath(relativePath)))
  );
  check("prior_failed_closed_gap_is_named", () =>
    contract.current_problem.blocker_id === "BLOCKER-20260603-01" &&
    contract.current_problem.blocker === "exact_secretless_execution_entry_missing_in_agent_image_lab" &&
    failedReceipt.status === "failed_closed_before_route_http_request" &&
    failedReceipt.agent_image_lab_execution_entry_discovery.secretless_option_a_runner_found === false &&
    failedReceipt.agent_image_lab_execution_entry_discovery.route_http_shape_guessed === false &&
    failedArtifact.result === "failed_closed_before_route_http_request"
  );
  check("current_permission_stays_closed", () =>
    contract.current_permission.current_live_probe_allowed === false &&
    contract.current_permission.can_execute_now === false &&
    contract.current_permission.authorization_granted_by_this_record === false &&
    contract.current_permission.activation_granted_by_this_record === false &&
    contract.current_permission.historical_packet_fact_not_current_permission === true &&
    contract.current_permission.historical_activation_attempt_consumed === true &&
    contract.current_permission.new_exact_activation_required_before_any_live_probe === true
  );
  check("option_a_basis_matches_prior_receipts", () =>
    redesign.preferred_route.option_id === "A" &&
    pushedReceipt.pushed_implementation_event.pushed_commit === pushedCommit &&
    pushedReceipt.implementation_summary.agent_image_lab_secret_contact_required === false &&
    pushedReceipt.implementation_summary.agent_image_lab_authorization_header_construction_required === false &&
    activationPreflight.future_execution_scope_if_later_separately_activated.vcptoolbox_required_commit === pushedCommit
  );
  check("callable_contract_is_draft_only_and_no_guessing", () =>
    contract.callable_runner_contract.contract_status === "draft_only_runner_not_implemented_by_this_task" &&
    contract.callable_runner_contract.route === "vcptoolbox_option_a_secretless_internal_authorized_execution_interface" &&
    contract.callable_runner_contract.required_vcptoolbox_commit_from_prior_receipt === pushedCommit &&
    contract.callable_runner_contract.runner_must_not_guess_http_shape === true &&
    contract.callable_runner_contract.runner_must_not_use_old_admin_auth_route === true &&
    contract.callable_runner_contract.runner_must_not_read_vcptoolbox_source_to_discover_contract === true
  );
  check("one_shot_input_contract_is_preserved", () =>
    contract.input_contract.required_current_preflight_pass === true &&
    contract.input_contract.required_clean_agent_image_lab_worktree_before_live_attempt === true &&
    contract.input_contract.required_output_overwrite_check === true &&
    contract.input_contract.required_receipt_paths_must_not_exist_before_live_attempt === true &&
    contract.input_contract.max_provider_calls === 1 &&
    contract.input_contract.max_plugin_calls === 1 &&
    contract.input_contract.max_api_calls === 1 &&
    contract.input_contract.max_images === 1 &&
    contract.input_contract.max_live_attempts === 1 &&
    contract.input_contract.retry_allowed === false &&
    contract.input_contract.overwrite_existing_files_allowed === false
  );
  check("allowed_payload_fields_are_exact_and_non_secret", () => {
    const allowed = contract.payload_contract.allowed_non_secret_payload_fields;
    const forbidden = contract.payload_contract.forbidden_payload_keys_normalized_anywhere;
    const normalizedAllowed = allowed.map(normalizeKey);
    const overlaps = forbidden.filter((key) => normalizedAllowed.includes(key));
    return equalSet(allowed, expectedAllowedFields) &&
      equalSet(forbidden, expectedForbiddenKeys) &&
      overlaps.length === 0 &&
      contract.payload_contract.payload_hash_required === true &&
      contract.payload_contract.secret_value_read_allowed === false &&
      contract.payload_contract.agent_image_lab_authorization_header_construction_allowed === false;
  });
  check("forbidden_nested_payload_examples_are_covered", () =>
    includesAll(contract.payload_contract.forbidden_nested_payload_examples, [
      "body.authorization",
      "body.context.authorization",
      "body.headers.Authorization",
      "body.context.headers.authorization",
      "body.basic_auth",
      "body.token",
      "body.context.auth"
    ]) &&
    includesAll(pushedReceipt.implementation_summary.forbidden_payload_keys_guarded, expectedForbiddenKeys)
  );
  check("stop_conditions_cover_missing_contract_and_secret_drift", () =>
    includesAll(contract.runner_stop_conditions, [
      "separate exact activation is missing",
      "current activation is historical or consumed",
      "exact callable route binding is missing",
      "HTTP route shape must be guessed",
      "old admin-auth guarded live probe runner would be used",
      "Agent Image Lab must read .env, config.env, secrets, cookies, tokens, or private raw data",
      "Agent Image Lab must construct or send an Authorization header",
      "payload contains any forbidden normalized key anywhere in the body tree",
      "payload contains a headers object",
      "budget drifts from one provider / one plugin / one API / one image / no retry",
      "route requires admin auth/header construction by Agent Image Lab",
      "VCPToolBox source read or modification is needed",
      "provider/plugin/API/image action is requested by this preflight"
    ])
  );
  check("future_receipt_contract_records_boundary", () =>
    contract.future_receipt_contract.write_receipt_on_success_or_failed_closed === true &&
    includesAll(contract.future_receipt_contract.must_record_fields, [
      "activation_package_id",
      "vcptoolbox_commit_verified",
      "secretless_route_gate_enabled",
      "forbidden_payload_keys_detected",
      "provider_contact_performed",
      "plugin_call_performed",
      "api_call_performed",
      "image_generation_performed",
      "image_count",
      "output_write_performed",
      "secret_value_read_performed",
      "authorization_header_constructed_by_agent_image_lab",
      "retry_performed"
    ])
  );
  check("validator_contract_declares_scope_and_limits", () =>
    contract.validator_contract.validator_ref === validatorPath &&
    contract.validator_contract.package_script === packageScriptName &&
    contract.validator_contract.manifest_id === manifestId &&
    includesAll(contract.validator_contract.can_prove, [
      "design package exists and has the expected schema",
      "contract remains draft-only and cannot execute now",
      "prior failed-closed receipt identifies the missing callable execution entry",
      "payload allowlist contains only non-secret fields",
      "this stage performed no route HTTP request, live probe, provider contact, plugin/API call, image generation, output write, secret/env/config read, VCPToolBox read, VCPToolBox modification, stage, commit, push, tag, release, or deploy",
      "package.json and validation_manifest register this validator"
    ]) &&
    includesAll(contract.validator_contract.cannot_prove, [
      "the VCPToolBox route is reachable at runtime",
      "the route gate is enabled in a live process",
      "the exact HTTP/callable binding shape is implemented in Agent Image Lab",
      "provider/plugin/API/image execution would succeed",
      "future live activation is authorized"
    ])
  );
  check("non_execution_boundary_all_false", () =>
    fieldsAreFalse(contract.non_execution_boundary, [
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
      "DailyNote_write_performed",
      "VCP_memory_write_performed",
      "staging_performed",
      "commit_performed",
      "push_tag_release_deploy_performed"
    ])
  );
  check("validator_source_does_not_access_runtime_env", () =>
    !validatorSource.includes(processEnvToken)
  );
  check("conclusion_keeps_live_probe_closed", () =>
    contract.conclusion.result === "callable_runner_contract_preflight_drafted_no_execution" &&
    contract.conclusion.current_permission === "cannot_run_live_probe_now" &&
    contract.conclusion.current_route_selection === "secretless_option_a_callable_runner_contract_needed_before_new_activation"
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
        packagePath,
        validatorPath,
        failedReceiptPath,
        failedArtifactPath,
        pushedReceiptPath,
        activationPreflightPath,
        redesignPath,
        ".agent_board/HANDOFF.md",
        ".agent_board/RUN_STATE.md",
        ".agent_board/TASK_QUEUE.md",
        ".agent_board/CHECKPOINT.md",
        "package.json",
        "scripts/validation_manifest.json"
      ]) &&
      entry.required_for.includes("runtime_to_review_secretless_option_a_callable_runner_contract_preflight")
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    contract: packagePath,
    can_execute_now: false,
    current_live_probe_allowed: false,
    route_http_request_performed: false,
    live_probe_performed: false,
    external_vcptoolbox_read_performed_by_this_task: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
    secret_value_read_performed: false,
    authorization_header_constructed_by_agent_image_lab: false,
    staging_performed: false,
    commit_performed: false,
    push_tag_release_deploy_performed: false,
    current_route_selection: contract.conclusion.current_route_selection,
    next_safe_action: contract.conclusion.next_safe_action,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results
  }, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
