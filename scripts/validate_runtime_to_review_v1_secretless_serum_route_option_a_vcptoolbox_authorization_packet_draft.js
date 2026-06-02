#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_secretless_serum_route_option_a_vcptoolbox_authorization_packet_draft";
const packetPath = "reports/runtime_to_review_v1/secretless_serum_route_option_a_vcptoolbox_authorization_packet_draft_20260602.json";
const designPath = "reports/runtime_to_review_v1/secretless_serum_route_redesign_preflight_20260602.json";
const validatorPath = "scripts/validate_runtime_to_review_v1_secretless_serum_route_option_a_vcptoolbox_authorization_packet_draft.js";
const packageScriptName = "validate:runtime-to-review-secretless-serum-option-a-vcptoolbox-authorization-packet-draft";
const manifestId = "runtime_to_review_secretless_serum_option_a_vcptoolbox_authorization_packet_draft";

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
  return object && fields.every((field) => object[field] === false);
}

function main() {
  const packet = readJson(packetPath);
  const design = readJson(designPath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const validatorSource = fs.readFileSync(repoPath(validatorPath), "utf8");
  const processEnvToken = "process" + ".env";
  const authHeaderConstructionToken = "build" + "BasicAuthHeader";

  check("packet_schema_and_status", () =>
    packet.schema === "runtime_to_review_v1_secretless_serum_route_option_a_vcptoolbox_authorization_packet_draft.v1" &&
    packet.packet_id === "secretless_serum_route_option_a_vcptoolbox_authorization_packet_draft_20260602" &&
    packet.authorization_package_id === "AUTH-DRAFT-SECRETLESS-SERUM-OPTION-A-VCPTB-20260602-001" &&
    packet.lane === "Green_authorization_packet_draft_only" &&
    packet.status === "draft_inactive_not_executed" &&
    packet.mode === "future_exact_vcptoolbox_authorization_packet_draft_only"
  );
  check("source_design_selects_option_a", () =>
    design.preferred_route.option_id === "A" &&
    design.preferred_route.requires_future_external_authorization === true &&
    packet.source_refs.includes(designPath)
  );
  check("authorization_state_is_not_granted", () =>
    fieldsAreFalse(packet.authorization_state, [
      "authorization_granted_by_this_record",
      "external_vcptoolbox_modification_authorized_by_this_record",
      "real_vcptoolbox_read_authorized_by_this_record",
      "live_probe_authorized_by_this_record",
      "provider_plugin_api_image_authorized_by_this_record",
      "can_execute_now"
    ]) &&
    packet.authorization_state.reason_can_execute_now_false.includes("only a local draft")
  );
  check("option_a_target_is_secretless_and_external_unverified", () =>
    packet.option_a_target.preferred_route === "Option A - VCPToolBox internal authorized execution interface" &&
    packet.option_a_target.target_system === "VCPToolBox external repository" &&
    packet.option_a_target.target_system_status_this_task === "not_read_not_modified" &&
    packet.option_a_target.agent_image_lab_secret_contact_required === false &&
    packet.option_a_target.agent_image_lab_authorization_header_construction_required === false &&
    packet.option_a_target.future_exact_file_allowlist_status === "must_be_verified_by_separate_vcptoolbox_preflight_before_any_external_write"
  );
  check("future_request_requires_separate_preflight_and_packet", () =>
    packet.future_exact_authorization_request_draft.requested_future_stage === "external_vcptoolbox_exact_read_preflight_then_separate_implementation_packet" &&
    packet.future_exact_authorization_request_draft.requested_future_read_scope.max_external_read_files === 5 &&
    includesAll(packet.future_exact_authorization_request_draft.requested_future_read_scope.forbidden_read_kind, [
      ".env or config.env",
      "secret-bearing files",
      "private raw data",
      "broad repository scrape",
      "unrelated VCPToolBox modules",
      "VCPChat repository"
    ]) &&
    packet.future_exact_authorization_request_draft.future_implementation_scope_if_later_separately_authorized.max_external_write_files === 3 &&
    packet.future_exact_authorization_request_draft.future_live_execution_budget_if_a_separate_activation_is_later_issued.max_images === 1 &&
    packet.future_exact_authorization_request_draft.future_live_execution_budget_if_a_separate_activation_is_later_issued.retry_allowed === false
  );
  check("payload_contract_keeps_agent_image_lab_secretless", () =>
    includesAll(packet.future_non_secret_payload_contract_draft.payload_must_not_include, [
      "admin username",
      "admin password",
      "Basic auth header",
      "bearer token",
      "raw provider credential material"
    ]) &&
    includesAll(packet.future_non_secret_payload_contract_draft.payload_may_include, [
      "task_id",
      "route_id",
      "prompt_package_ref",
      "non_secret_payload_hash"
    ]) &&
    packet.future_non_secret_payload_contract_draft.vcptoolbox_responsibilities_future.includes("own and enforce authorization inside VCPToolBox") &&
    packet.future_non_secret_payload_contract_draft.agent_image_lab_responsibilities_future.includes("stop on any request to read or construct admin auth")
  );
  check("receipt_and_rollback_declared", () =>
    packet.receipt_plan.future_vcptoolbox_preflight_receipt_required === true &&
    packet.receipt_plan.secret_material_recording_allowed === false &&
    includesAll(packet.receipt_plan.agent_image_lab_receipt_fields, [
      "authorization_package_id",
      "exact_vcptoolbox_files_read",
      "exact_vcptoolbox_files_written_if_any",
      "secret_value_read_performed",
      "rollback_or_cleanup_available"
    ]) &&
    typeof packet.rollback_or_cleanup_plan.future_implementation === "string" &&
    packet.rollback_or_cleanup_plan.future_implementation.includes("exact VCPToolBox files")
  );
  check("stop_conditions_cover_red_boundaries", () =>
    includesAll(packet.stop_conditions, [
      "user has not issued a separate exact VCPToolBox read or write authorization",
      "future exact VCPToolBox file allowlist is missing or broad",
      "future preflight needs secret, .env, config.env, cookie, token, or private raw data access",
      "Agent Image Lab would need to read, construct, print, or store admin auth material",
      "provider/plugin/API/image execution is requested during preflight or implementation",
      "push, tag, release, deploy, force push, or history rewrite is requested"
    ])
  );
  check("current_guard_flags_are_non_executing", () =>
    packet.guard.authorization_packet_draft_only === true &&
    fieldsAreFalse(packet.guard, [
      "external_repo_read_performed",
      "external_repo_modified",
      "vcptoolbox_write_performed",
      "vcpchat_write_performed",
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
  check("go_no_go_blocks_auto_execution", () =>
    packet.go_no_go.authorization_packet_created === true &&
    packet.go_no_go.current_external_modification_allowed === false &&
    packet.go_no_go.current_live_probe_allowed === false &&
    packet.go_no_go.current_secretless_route_selected === true &&
    packet.go_no_go.future_preflight_requires_exact_authorization === true &&
    packet.go_no_go.future_implementation_requires_new_packet_after_preflight === true &&
    packet.go_no_go.next_auto_step_allowed === false
  );
  check("validator_source_does_not_read_env_or_construct_header", () =>
    !validatorSource.includes(processEnvToken) &&
    !validatorSource.includes(authHeaderConstructionToken)
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
        designPath,
        ".agent_board/HANDOFF.md",
        ".agent_board/RUN_STATE.md",
        ".agent_board/TASK_QUEUE.md",
        ".agent_board/CHECKPOINT.md",
        "package.json",
        "scripts/validation_manifest.json"
      ]) &&
      entry.required_for.includes("runtime_to_review_secretless_serum_option_a_vcptoolbox_authorization_packet_draft");
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    packet: packetPath,
    authorization_package_id: packet.authorization_package_id,
    can_execute_now: false,
    authorization_granted_by_this_record: false,
    real_vcptoolbox_read_authorized_by_this_record: false,
    external_vcptoolbox_modification_authorized_by_this_record: false,
    next_auto_step_allowed: false,
    external_repo_read_performed: false,
    external_repo_modified: false,
    secret_value_read_performed: false,
    authorization_header_constructed: false,
    live_probe_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results
  }, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
