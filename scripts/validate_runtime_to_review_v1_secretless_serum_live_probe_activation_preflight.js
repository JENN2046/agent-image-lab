#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_secretless_serum_live_probe_activation_preflight";
const packetPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_activation_preflight_20260603.json";
const designPath = "reports/runtime_to_review_v1/secretless_serum_route_redesign_preflight_20260602.json";
const optionAAuthorizationPath = "reports/runtime_to_review_v1/secretless_serum_route_option_a_vcptoolbox_authorization_packet_draft_20260602.json";
const exactReadReceiptPath = "reports/runtime_to_review_v1/secretless_serum_route_option_a_vcptoolbox_exact_read_preflight_receipt_20260602.json";
const implementationAuthorizationPath = "reports/runtime_to_review_v1/secretless_serum_route_option_a_vcptoolbox_implementation_authorization_packet_draft_20260602.json";
const pushedReceiptPath = "reports/runtime_to_review_v1/secretless_serum_route_option_a_vcptoolbox_implementation_pushed_receipt_20260603.json";
const historicalActivePacketPath = "reports/runtime_to_review_v1/serum_bottle_owner_activated_live_probe_packet_20260601.json";
const historicalReceiptPath = "reports/runtime_to_review_v1/serum_bottle_exact_live_probe_receipt_20260601_attempt_004.json";
const historicalArtifactPath = "reports/runtime_to_review_v1/serum_bottle_exact_live_probe_artifact_record_20260601_attempt_004.json";
const validatorPath = "scripts/validate_runtime_to_review_v1_secretless_serum_live_probe_activation_preflight.js";
const packageScriptName = "validate:runtime-to-review-secretless-serum-live-probe-activation-preflight";
const manifestId = "runtime_to_review_secretless_serum_live_probe_activation_preflight";
const pushedCommit = "cf1fa55b36e9aeece2718bf2c9425c44db24cb25";
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

function fieldsAreFalse(object, fields) {
  return Boolean(object) && fields.every((field) => object[field] === false);
}

function normalizeKey(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function main() {
  const packet = readJson(packetPath);
  const design = readJson(designPath);
  const optionAAuthorization = readJson(optionAAuthorizationPath);
  const exactReadReceipt = readJson(exactReadReceiptPath);
  const implementationAuthorization = readJson(implementationAuthorizationPath);
  const pushedReceipt = readJson(pushedReceiptPath);
  const historicalActivePacket = readJson(historicalActivePacketPath);
  const historicalReceipt = readJson(historicalReceiptPath);
  const historicalArtifact = readJson(historicalArtifactPath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const validatorSource = fs.readFileSync(repoPath(validatorPath), "utf8");
  const processEnvToken = "process" + ".env";
  const envLoaderToken = "dot" + "env";
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
    packet.schema === "runtime_to_review_v1_secretless_serum_live_probe_activation_preflight.v1" &&
    packet.packet_id === "secretless_serum_live_probe_activation_preflight_20260603" &&
    packet.activation_package_id === "AUTH-DRAFT-SECRETLESS-SERUM-LIVE-PROBE-20260603-001" &&
    packet.lane === "Green_activation_preflight_packet_taskbook_draft_only" &&
    packet.mode === "future_exact_secretless_serum_live_probe_activation_packet_and_taskbook_draft_only" &&
    packet.status === "draft_inactive_not_executed"
  );
  check("source_refs_exist_and_match_option_a_chain", () =>
    includesAll(packet.source_refs, [
      designPath,
      optionAAuthorizationPath,
      exactReadReceiptPath,
      implementationAuthorizationPath,
      pushedReceiptPath
    ]) &&
    design.preferred_route.option_id === "A" &&
    optionAAuthorization.option_a_target.agent_image_lab_secret_contact_required === false &&
    exactReadReceipt.optional_third_file_required_now === false &&
    implementationAuthorization.confirmed_basis.exact_allowlist_confirmed === true &&
    pushedReceipt.pushed_implementation_event.pushed_commit === pushedCommit
  );
  check("current_context_is_secretless_and_closed", () =>
    packet.current_context.repository === "Agent Image Lab" &&
    packet.current_context.branch === "master" &&
    packet.current_context.local_head_before_task === "f543ecfa" &&
    packet.current_context.worktree_before_task === "clean_and_aligned_with_origin_master" &&
    packet.current_context.current_permission === "cannot_run_live_probe_now" &&
    packet.current_context.historical_packet_fact_not_current_permission === true &&
    packet.current_context.historical_active_packet_ref === historicalActivePacketPath &&
    packet.current_context.secretless_option_a_pushed_receipt_ref === pushedReceiptPath &&
    packet.current_context.vcptoolbox_option_a_pushed_commit === pushedCommit &&
    packet.current_context.agent_image_lab_secret_contact_required === false &&
    packet.current_context.admin_auth_header_constructable_by_agent_image_lab === false
  );
  check("historical_active_packet_is_not_current_permission", () =>
    historicalActivePacket.can_execute_now === true &&
    packet.current_context.historical_packet_fact_not_current_permission === true &&
    packet.authorization_state.can_execute_now === false &&
    packet.go_no_go.current_live_probe_allowed === false
  );
  check("authorization_state_is_inactive", () =>
    fieldsAreFalse(packet.authorization_state, [
      "authorization_granted_by_this_record",
      "activation_granted_by_this_record",
      "live_probe_authorized_by_this_record",
      "provider_plugin_api_image_authorized_by_this_record",
      "external_vcptoolbox_read_authorized_by_this_record",
      "external_vcptoolbox_modification_authorized_by_this_record",
      "secret_value_read_authorized_by_this_record",
      "can_execute_now",
      "next_auto_step_allowed"
    ])
  );
  check("future_activation_statement_is_draft_only", () =>
    packet.future_exact_activation_statement_draft.includes(packet.activation_package_id) &&
    packet.future_exact_activation_statement_draft.includes(pushedCommit) &&
    packet.future_exact_activation_statement_draft.includes("This draft does not authorize execution now.") &&
    packet.required_future_owner_confirmation_phrase === activationPhrase &&
    packet.runner_confirmation_phrase_still_required_if_runner_is_used === "RUNTIME_TO_REVIEW_V1_ONE_PROVIDER_ONE_IMAGE"
  );
  check("future_scope_budget_is_one_shot_secretless", () =>
    packet.future_execution_scope_if_later_separately_activated.route === "vcptoolbox_option_a_secretless_internal_authorized_execution_interface" &&
    packet.future_execution_scope_if_later_separately_activated.target_product === "premium_serum_bottle" &&
    packet.future_execution_scope_if_later_separately_activated.vcptoolbox_required_commit === pushedCommit &&
    packet.future_execution_scope_if_later_separately_activated.max_provider_calls === 1 &&
    packet.future_execution_scope_if_later_separately_activated.max_plugin_calls === 1 &&
    packet.future_execution_scope_if_later_separately_activated.max_api_calls === 1 &&
    packet.future_execution_scope_if_later_separately_activated.max_images === 1 &&
    packet.future_execution_scope_if_later_separately_activated.max_live_probe_attempts === 1 &&
    packet.future_execution_scope_if_later_separately_activated.retry_allowed === false &&
    packet.future_execution_scope_if_later_separately_activated.overwrite_existing_files_allowed === false &&
    packet.future_execution_scope_if_later_separately_activated.secret_value_read_allowed_by_agent_image_lab === false &&
    packet.future_execution_scope_if_later_separately_activated.agent_image_lab_authorization_header_construction_allowed === false
  );
  check("payload_secret_key_guard_contract_is_complete", () =>
    includesAll(packet.future_execution_scope_if_later_separately_activated.forbidden_payload_keys_normalized_anywhere, expectedForbiddenKeys) &&
    includesAll(packet.future_execution_scope_if_later_separately_activated.forbidden_nested_payload_examples, [
      "body.context.authorization",
      "body.headers.Authorization",
      "body.basic_auth",
      "body.token",
      "body.context.auth"
    ]) &&
    includesAll(pushedReceipt.implementation_summary.forbidden_payload_keys_guarded, expectedForbiddenKeys)
  );
  check("allowed_payload_fields_are_non_secret_contract_fields", () => {
    const normalizedAllowed = packet.future_execution_scope_if_later_separately_activated.allowed_non_secret_payload_fields.map(normalizeKey);
    const forbiddenAllowed = expectedForbiddenKeys.filter((key) => normalizedAllowed.includes(key));
    return forbiddenAllowed.length === 0 &&
      includesAll(packet.future_execution_scope_if_later_separately_activated.allowed_non_secret_payload_fields, [
        "task_id",
        "route_id",
        "prompt_package_ref",
        "max_provider_calls",
        "max_plugin_calls",
        "max_api_calls",
        "max_images",
        "retry_allowed",
        "receipt_ref",
        "artifact_record_ref",
        "non_secret_payload_hash"
      ]);
  });
  check("taskbook_requires_preflight_and_separate_activation", () =>
    Array.isArray(packet.future_taskbook_if_later_activated) &&
    packet.future_taskbook_if_later_activated.length === 6 &&
    packet.future_taskbook_if_later_activated.every((step) => step.required_before_execution === true) &&
    packet.future_taskbook_if_later_activated.some((step) => step.name === "receive_exact_activation") &&
    packet.future_taskbook_if_later_activated.some((step) => step.name === "construct_non_secret_payload_only") &&
    packet.future_taskbook_if_later_activated.some((step) => step.name === "execute_one_secretless_live_probe_if_and_only_if_activated")
  );
  check("future_validation_set_is_non_executing", () =>
    includesAll(packet.future_validation_required_before_any_activation, [
      `node --check ${validatorPath}`,
      `npm run ${packageScriptName}`,
      "npm run validate:runtime-to-review-secretless-serum-option-a-vcptoolbox-implementation-pushed-receipt",
      "npm run validate:runtime-to-review-secretless-serum-route-redesign-preflight",
      "node scripts/validate_validation_manifest.js",
      "node scripts/validate_agent_board_state.js",
      "git diff --check"
    ]) &&
    includesAll(packet.future_validation_must_not_include, [
      "live probe",
      "route HTTP request",
      "provider contact",
      "plugin call",
      "API call",
      "image generation",
      "secret/env/config read",
      "Authorization header construction by Agent Image Lab",
      "DailyNote or VCP memory write",
      "push/tag/release/deploy"
    ])
  );
  check("future_receipt_fields_capture_execution_boundary", () =>
    includesAll(packet.future_receipt_required_fields, [
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
    ]) &&
    packet.planned_receipt_ref_if_activated_later === "reports/runtime_to_review_v1/secretless_serum_live_probe_receipt_20260603_attempt_001.json" &&
    packet.planned_artifact_record_ref_if_activated_later === "reports/runtime_to_review_v1/secretless_serum_live_probe_artifact_record_20260603_attempt_001.json"
  );
  check("historical_serum_evidence_refs_are_still_present", () =>
    historicalReceipt.status === "failed_closed" &&
    historicalArtifact.status === "failed_no_artifact_created" &&
    includesAll(packet.immutable_serum_evidence_refs, [
      historicalActivePacketPath,
      historicalReceiptPath,
      historicalArtifactPath,
      pushedReceiptPath
    ]) &&
    packet.stop_conditions.includes("historical can_execute_now=true packet is used as current permission")
  );
  check("stop_conditions_cover_live_secret_and_scope_drift", () =>
    includesAll(packet.stop_conditions, [
      "separate exact activation is missing",
      "Agent Image Lab must read .env, config.env, secrets, cookies, tokens, or private raw data",
      "Agent Image Lab must construct or send an Authorization header",
      "payload includes authorization, headers, basic_auth, auth, token, cookie, password, apikey, or related forbidden secret key",
      "budget drifts from one provider / one plugin / one API / one image / no retry",
      "provider/plugin/API/image action is requested by this draft instead of a separate activation",
      "external VCPToolBox read/write is requested without separate exact authorization",
      "push, tag, release, deploy, force push, history rewrite, or destructive action is requested"
    ])
  );
  check("guard_is_draft_and_non_executing", () =>
    packet.guard.activation_preflight_packet_taskbook_draft_only === true &&
    fieldsAreFalse(packet.guard, [
      "authorization_granted_by_this_record",
      "activation_granted_by_this_record",
      "can_execute_now",
      "external_repo_read_performed_by_this_task",
      "external_repo_modified_by_this_task",
      "vcptoolbox_write_performed",
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
    ])
  );
  check("go_no_go_stays_closed", () =>
    packet.go_no_go.activation_preflight_draft_created === true &&
    packet.go_no_go.current_live_probe_allowed === false &&
    packet.go_no_go.future_live_probe_requires_separate_exact_activation === true &&
    packet.go_no_go.future_live_probe_requires_current_preflight_pass === true &&
    packet.go_no_go.future_payload_must_be_secretless === true &&
    packet.go_no_go.next_auto_step_allowed === false
  );
  check("validator_source_does_not_access_env", () =>
    !validatorSource.includes(processEnvToken) &&
    !validatorSource.includes(envLoaderToken)
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
        pushedReceiptPath,
        designPath,
        ".agent_board/HANDOFF.md",
        ".agent_board/RUN_STATE.md",
        ".agent_board/TASK_QUEUE.md",
        ".agent_board/CHECKPOINT.md",
        "package.json",
        "scripts/validation_manifest.json"
      ]) &&
      entry.required_for.includes("runtime_to_review_secretless_serum_live_probe_activation_preflight");
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    packet: packetPath,
    activation_package_id: packet.activation_package_id,
    can_execute_now: false,
    current_live_probe_allowed: false,
    required_future_owner_confirmation_phrase: activationPhrase,
    vcptoolbox_option_a_pushed_commit: pushedCommit,
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
