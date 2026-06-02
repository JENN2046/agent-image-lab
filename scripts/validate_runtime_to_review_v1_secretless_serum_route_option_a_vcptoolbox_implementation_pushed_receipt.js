#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_secretless_serum_route_option_a_vcptoolbox_implementation_pushed_receipt";
const receiptPath = "reports/runtime_to_review_v1/secretless_serum_route_option_a_vcptoolbox_implementation_pushed_receipt_20260603.json";
const designPath = "reports/runtime_to_review_v1/secretless_serum_route_redesign_preflight_20260602.json";
const authorizationPacketPath = "reports/runtime_to_review_v1/secretless_serum_route_option_a_vcptoolbox_authorization_packet_draft_20260602.json";
const exactReadReceiptPath = "reports/runtime_to_review_v1/secretless_serum_route_option_a_vcptoolbox_exact_read_preflight_receipt_20260602.json";
const implementationAuthorizationPacketPath = "reports/runtime_to_review_v1/secretless_serum_route_option_a_vcptoolbox_implementation_authorization_packet_draft_20260602.json";
const validatorPath = "scripts/validate_runtime_to_review_v1_secretless_serum_route_option_a_vcptoolbox_implementation_pushed_receipt.js";
const packageScriptName = "validate:runtime-to-review-secretless-serum-option-a-vcptoolbox-implementation-pushed-receipt";
const manifestId = "runtime_to_review_secretless_serum_option_a_vcptoolbox_implementation_pushed_receipt";

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
  const receipt = readJson(receiptPath);
  const design = readJson(designPath);
  const authorizationPacket = readJson(authorizationPacketPath);
  const exactReadReceipt = readJson(exactReadReceiptPath);
  const implementationAuthorizationPacket = readJson(implementationAuthorizationPacketPath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const validatorSource = fs.readFileSync(repoPath(validatorPath), "utf8");
  const processEnvToken = "process" + ".env";
  const envLoaderToken = "dot" + "env";

  check("receipt_schema_and_status", () =>
    receipt.schema === "runtime_to_review_v1_secretless_serum_route_option_a_vcptoolbox_implementation_pushed_receipt.v1" &&
    receipt.receipt_id === "secretless_serum_route_option_a_vcptoolbox_implementation_pushed_receipt_20260603" &&
    receipt.lane === "Green_local_documentation_validator_status_sync" &&
    receipt.mode === "local_receipt_and_agent_board_sync_only_after_external_exact_implementation_push" &&
    receipt.status === "completed_pushed_external_implementation_recorded_locally"
  );
  check("source_refs_exist_and_match_prior_packets", () =>
    includesAll(receipt.source_refs, [
      designPath,
      authorizationPacketPath,
      exactReadReceiptPath,
      implementationAuthorizationPacketPath
    ]) &&
    design.preferred_route.option_id === "A" &&
    authorizationPacket.option_a_target.agent_image_lab_secret_contact_required === false &&
    exactReadReceipt.optional_third_file_required_now === false &&
    implementationAuthorizationPacket.confirmed_basis.exact_allowlist_confirmed === true
  );
  check("recording_context_is_local_only", () =>
    receipt.agent_image_lab_recording_context.repository === "Agent Image Lab" &&
    receipt.agent_image_lab_recording_context.branch === "master" &&
    receipt.agent_image_lab_recording_context.local_head_before_task === "b102b3e7" &&
    receipt.agent_image_lab_recording_context.worktree_before_task === "clean" &&
    fieldsAreFalse(receipt.agent_image_lab_recording_context, [
      "this_task_writes_external_repo",
      "this_task_reads_external_repo",
      "this_task_runs_live_probe"
    ])
  );
  check("pushed_commit_and_refs_are_recorded", () =>
    receipt.pushed_implementation_event.target_repo_alias === "VCPToolBox" &&
    receipt.pushed_implementation_event.target_branch === "main" &&
    receipt.pushed_implementation_event.target_remote_ref === "origin/main" &&
    receipt.pushed_implementation_event.pushed_commit === "cf1fa55b36e9aeece2718bf2c9425c44db24cb25" &&
    receipt.pushed_implementation_event.short_commit === "cf1fa55b" &&
    receipt.pushed_implementation_event.commit_subject === "fix: guard serum bottle secretless payload secrets" &&
    receipt.pushed_implementation_event.push_command_authorized === "git push origin main" &&
    receipt.pushed_implementation_event.push_performed_before_this_agent_image_lab_sync === true &&
    receipt.pushed_implementation_event.push_performed_by_this_agent_image_lab_sync_task === false &&
    receipt.pushed_implementation_event.post_push_verification_observed_before_this_sync === true &&
    Object.values(receipt.pushed_implementation_event.post_push_verified_refs).every(
      (value) => value === "cf1fa55b36e9aeece2718bf2c9425c44db24cb25"
    )
  );
  check("pushed_scope_is_exact_two_files", () =>
    receipt.pushed_implementation_scope.exact_file_scope_count === 2 &&
    receipt.pushed_implementation_scope.scope_matches_prior_authorization_packet === true &&
    receipt.pushed_implementation_scope.scope_matches_confirmed_read_preflight_allowlist === true &&
    receipt.pushed_implementation_scope.outside_exact_file_scope_modified === false &&
    includesAll(receipt.pushed_implementation_scope.exact_files_changed, [
      "routes/admin/aiImageAgents.js",
      "tests/aiImageAgentsRoute.test.js"
    ])
  );
  check("secretless_option_a_contract_recorded", () =>
    receipt.implementation_summary.preferred_route === "Option A - VCPToolBox internal authorized execution interface" &&
    receipt.implementation_summary.route_gate === "enableSerumBottleSecretlessInternalRoute === true" &&
    receipt.implementation_summary.agent_image_lab_secret_contact_required === false &&
    receipt.implementation_summary.agent_image_lab_authorization_header_construction_required === false &&
    receipt.implementation_summary.one_provider_one_plugin_one_api_one_image_no_retry_budget_preserved === true &&
    includesAll(receipt.implementation_summary.behavior, [
      "keeps Agent Image Lab payload non-secret",
      "rejects secret-bearing payload keys recursively before authorizer or executor",
      "fails closed when authorizer is missing",
      "fails closed before authorizer or executor when budget drifts"
    ])
  );
  check("forbidden_payload_secret_keys_cover_review_gap", () =>
    includesAll(receipt.implementation_summary.forbidden_payload_keys_guarded, [
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
    ]) &&
    includesAll(receipt.implementation_summary.nested_secret_key_examples_rejected, [
      "body.context.authorization",
      "body.headers.Authorization",
      "body.basic_auth",
      "body.token",
      "body.context.auth"
    ])
  );
  check("vcptoolbox_validation_observed_before_sync", () =>
    receipt.vcptoolbox_validation_observed_before_this_sync.node_check_routes_admin_aiImageAgents_js === "passed" &&
    receipt.vcptoolbox_validation_observed_before_this_sync.node_check_tests_aiImageAgentsRoute_test_js === "passed" &&
    receipt.vcptoolbox_validation_observed_before_this_sync.node_test_tests_aiImageAgentsRoute_test_js === "passed_17_of_17" &&
    receipt.vcptoolbox_validation_observed_before_this_sync.git_diff_check === "passed" &&
    receipt.vcptoolbox_validation_observed_before_this_sync.read_only_commit_review_push_preflight === "passed_unique_pending_commit_cf1fa55b" &&
    receipt.vcptoolbox_validation_observed_before_this_sync.post_push_remote_head_verification === "passed_cf1fa55b"
  );
  check("agent_image_lab_sync_guard_is_non_executing", () =>
    receipt.agent_image_lab_local_sync_guard.documentation_validator_status_only === true &&
    fieldsAreFalse(receipt.agent_image_lab_local_sync_guard, [
      "external_repo_read_performed_by_this_sync_task",
      "external_repo_modified_by_this_sync_task",
      "vcptoolbox_write_performed_by_this_sync_task",
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
      "push_tag_release_deploy_performed_by_this_sync_task"
    ])
  );
  check("current_execution_boundary_stays_closed", () =>
    receipt.current_agent_image_lab_execution_boundary.current_permission === "cannot_run_live_probe_now" &&
    receipt.current_agent_image_lab_execution_boundary.historical_packet_fact_not_current_permission === true &&
    receipt.current_agent_image_lab_execution_boundary.current_route_selection === "secretless_option_a_implementation_pushed_but_not_live_activated" &&
    receipt.current_agent_image_lab_execution_boundary.new_exact_activation_required_before_any_live_probe === true &&
    receipt.current_agent_image_lab_execution_boundary.current_live_probe_allowed === false &&
    receipt.go_no_go.agent_image_lab_live_probe_allowed_now === false &&
    receipt.go_no_go.new_exact_secretless_activation_required === true &&
    receipt.go_no_go.next_auto_step_allowed === false
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
        receiptPath,
        validatorPath,
        implementationAuthorizationPacketPath,
        exactReadReceiptPath,
        ".agent_board/HANDOFF.md",
        ".agent_board/RUN_STATE.md",
        ".agent_board/TASK_QUEUE.md",
        ".agent_board/CHECKPOINT.md",
        "package.json",
        "scripts/validation_manifest.json"
      ]) &&
      entry.required_for.includes("runtime_to_review_secretless_serum_option_a_vcptoolbox_implementation_pushed_receipt");
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    receipt: receiptPath,
    target_repo_alias: receipt.pushed_implementation_event.target_repo_alias,
    pushed_commit: receipt.pushed_implementation_event.pushed_commit,
    exact_files_changed: receipt.pushed_implementation_scope.exact_files_changed,
    agent_image_lab_live_probe_allowed_now: false,
    secret_value_read_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    external_repo_modified_by_this_sync_task: false,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results
  }, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
