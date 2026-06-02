#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_secretless_serum_route_option_a_vcptoolbox_authorization_packet_draft";
const packetPath = "reports/runtime_to_review_v1/secretless_serum_route_option_a_vcptoolbox_authorization_packet_draft_20260602.json";
const receiptPath = "reports/runtime_to_review_v1/secretless_serum_route_option_a_vcptoolbox_exact_read_preflight_receipt_20260602.json";
const implementationPacketPath = "reports/runtime_to_review_v1/secretless_serum_route_option_a_vcptoolbox_implementation_authorization_packet_draft_20260602.json";
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
  const receipt = readJson(receiptPath);
  const implementationPacket = readJson(implementationPacketPath);
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
  check("exact_read_receipt_schema_and_scope", () =>
    receipt.schema === "runtime_to_review_v1_secretless_serum_route_option_a_vcptoolbox_exact_read_preflight_receipt.v1" &&
    receipt.receipt_id === "secretless_serum_route_option_a_vcptoolbox_exact_read_preflight_receipt_20260602" &&
    receipt.lane === "Amber_A_exact_read" &&
    receipt.mode === "external_vcptoolbox_read_only_exact_preflight" &&
    receipt.status === "completed_read_only_exact_file_allowlist_confirmed" &&
    receipt.source_authorization.authorized_by_user_in_current_chat === true &&
    receipt.source_authorization.external_repo_write_authorized === false &&
    receipt.source_authorization.secret_value_read_authorized === false &&
    receipt.source_authorization.live_probe_authorized === false
  );
  check("exact_read_receipt_confirms_two_file_allowlist", () =>
    includesAll(receipt.exact_files_read, [
      "routes/admin/aiImageAgents.js",
      "tests/aiImageAgentsRoute.test.js"
    ]) &&
    receipt.exact_files_read.length === 2 &&
    includesAll(receipt.confirmed_option_a_exact_file_allowlist, [
      "routes/admin/aiImageAgents.js",
      "tests/aiImageAgentsRoute.test.js"
    ]) &&
    receipt.confirmed_option_a_exact_file_allowlist.length === 2 &&
    receipt.optional_third_file_required_now === false
  );
  check("exact_read_receipt_preserves_non_execution_boundary", () =>
    receipt.guard.external_repo_read_performed === true &&
    fieldsAreFalse(receipt.guard, [
      "external_repo_modified",
      "vcptoolbox_write_performed",
      "vcpchat_read_performed",
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
      "staging_performed_in_vcptoolbox",
      "commit_performed_in_vcptoolbox",
      "push_tag_release_deploy_performed"
    ])
  );
  check("exact_read_receipt_requires_future_write_authorization", () =>
    receipt.future_implementation_packet_requirements.requires_new_exact_vcptoolbox_write_authorization === true &&
    receipt.future_implementation_packet_requirements.implementation_must_be_limited_to_confirmed_allowlist === true &&
    receipt.future_implementation_packet_requirements.max_external_write_files === 2 &&
    includesAll(receipt.future_implementation_packet_requirements.allowed_future_files_if_separately_authorized, [
      "routes/admin/aiImageAgents.js",
      "tests/aiImageAgentsRoute.test.js"
    ]) &&
    receipt.result.exact_file_allowlist_confirmed === true &&
    receipt.result.can_implement_now === false
  );
  check("implementation_packet_schema_and_status", () =>
    implementationPacket.schema === "runtime_to_review_v1_secretless_serum_route_option_a_vcptoolbox_implementation_authorization_packet_draft.v1" &&
    implementationPacket.packet_id === "secretless_serum_route_option_a_vcptoolbox_implementation_authorization_packet_draft_20260602" &&
    implementationPacket.authorization_package_id === "AUTH-DRAFT-SECRETLESS-SERUM-OPTION-A-VCPTB-IMPLEMENT-20260602-001" &&
    implementationPacket.lane === "Green_authorization_packet_draft_only" &&
    implementationPacket.status === "draft_inactive_not_executed" &&
    implementationPacket.mode === "future_exact_vcptoolbox_implementation_authorization_packet_draft_only" &&
    includesAll(implementationPacket.source_refs, [designPath, packetPath, receiptPath])
  );
  check("implementation_packet_does_not_authorize_execution", () =>
    fieldsAreFalse(implementationPacket.authorization_state, [
      "authorization_granted_by_this_record",
      "external_vcptoolbox_modification_authorized_by_this_record",
      "implementation_authorized_by_this_record",
      "real_vcptoolbox_read_authorized_by_this_record",
      "live_probe_authorized_by_this_record",
      "provider_plugin_api_image_authorized_by_this_record",
      "can_execute_now"
    ]) &&
    implementationPacket.authorization_state.reason_can_execute_now_false.includes("implementation authorization draft only")
  );
  check("implementation_packet_confirmed_basis_matches_receipt", () =>
    implementationPacket.confirmed_basis.read_only_preflight_receipt_ref === receiptPath &&
    implementationPacket.confirmed_basis.exact_allowlist_confirmed === true &&
    implementationPacket.confirmed_basis.optional_third_file_required_now === false &&
    implementationPacket.confirmed_basis.confirmed_vcptoolbox_branch === "main" &&
    implementationPacket.confirmed_basis.vcptoolbox_worktree_was_clean_during_preflight === true &&
    implementationPacket.confirmed_basis.confirmed_exact_file_allowlist.length === 2 &&
    includesAll(implementationPacket.confirmed_basis.confirmed_exact_file_allowlist, receipt.confirmed_option_a_exact_file_allowlist)
  );
  check("implementation_packet_scope_limited_to_two_confirmed_files", () =>
    implementationPacket.future_implementation_scope_if_later_separately_approved.target_repo_alias === "VCPToolBox" &&
    implementationPacket.future_implementation_scope_if_later_separately_approved.target_branch_expected === "main" &&
    implementationPacket.future_implementation_scope_if_later_separately_approved.max_external_write_files === 2 &&
    implementationPacket.future_implementation_scope_if_later_separately_approved.allowed_files.length === 2 &&
    includesAll(implementationPacket.future_implementation_scope_if_later_separately_approved.allowed_files, [
      "routes/admin/aiImageAgents.js",
      "tests/aiImageAgentsRoute.test.js"
    ]) &&
    includesAll(implementationPacket.future_implementation_scope_if_later_separately_approved.forbidden_files, [
      "VCPChat repository",
      ".env",
      "config.env",
      "secret-bearing files",
      "provider/plugin implementation files",
      "unrelated VCPToolBox modules",
      "package.json unless separately authorized",
      "deployment/release/tag/push surfaces"
    ])
  );
  check("implementation_packet_payload_keeps_agent_image_lab_secretless", () =>
    includesAll(implementationPacket.future_non_secret_interface_contract.agent_image_lab_payload_must_not_include, [
      "admin username",
      "admin password",
      "Basic auth header",
      "bearer token",
      "secret env var value",
      "absolute private local path",
      "raw provider credential material"
    ]) &&
    includesAll(implementationPacket.future_non_secret_interface_contract.agent_image_lab_payload_may_include, [
      "task_id",
      "route_id",
      "prompt_package_ref",
      "max_provider_calls=1",
      "max_plugin_calls=1",
      "max_api_calls=1",
      "max_images=1",
      "retry_allowed=false",
      "non_secret_payload_hash"
    ]) &&
    includesAll(implementationPacket.future_non_secret_interface_contract.vcptoolbox_must_enforce, [
      "serum-bottle scope only",
      "one provider / one plugin / one API / one image / no retry budget",
      "internal authorization resolution before provider contact",
      "failed-closed behavior when authorization or budget is invalid",
      "no secret-derived values returned to Agent Image Lab"
    ])
  );
  check("implementation_packet_validation_plan_is_stubbed_and_non_live", () =>
    includesAll(implementationPacket.future_validation_if_later_implemented.vcptoolbox_required, [
      "git status -sb",
      "node --check routes/admin/aiImageAgents.js",
      "node --check tests/aiImageAgentsRoute.test.js",
      "node --test tests/aiImageAgentsRoute.test.js"
    ]) &&
    includesAll(implementationPacket.future_validation_if_later_implemented.agent_image_lab_required, [
      "npm run validate:runtime-to-review-secretless-serum-option-a-vcptoolbox-authorization-packet-draft",
      "npm run validate:runtime-to-review-secretless-serum-route-redesign-preflight",
      "node scripts/validate_agent_board_state.js",
      "git diff --check"
    ]) &&
    includesAll(implementationPacket.future_validation_if_later_implemented.validation_must_not_include, [
      "live probe",
      "provider contact",
      "plugin call",
      "API call",
      "image generation",
      "secret/env/config read",
      "DailyNote or VCP memory write",
      "push/tag/release/deploy"
    ])
  );
  check("implementation_packet_receipt_and_rollback_declared", () =>
    includesAll(implementationPacket.future_receipt_required_fields, [
      "authorization_package_id",
      "target_repo_alias",
      "exact_vcptoolbox_files_changed",
      "secret_value_read_performed",
      "env_file_content_read_performed",
      "validation_run",
      "validation_result",
      "rollback_or_cleanup_available",
      "next_auto_step_allowed"
    ]) &&
    implementationPacket.rollback_or_cleanup_plan.must_preserve_receipts === true &&
    implementationPacket.rollback_or_cleanup_plan.must_not_delete_outputs === true &&
    implementationPacket.rollback_or_cleanup_plan.future_implementation_if_uncommitted.includes("routes/admin/aiImageAgents.js and tests/aiImageAgentsRoute.test.js")
  );
  check("implementation_packet_stop_conditions_cover_red_boundaries", () =>
    includesAll(implementationPacket.stop_conditions, [
      "explicit future implementation authorization is missing",
      "target file set expands beyond routes/admin/aiImageAgents.js and tests/aiImageAgentsRoute.test.js",
      "future implementation requires reading .env, config.env, secrets, cookies, tokens, or private raw data",
      "Agent Image Lab would need to read, construct, print, or store VCPToolBox admin auth",
      "provider/plugin/API/image execution is requested",
      "live probe is requested",
      "budget is not exactly one provider / one plugin / one API / one image / no retry",
      "VCPToolBox worktree has unrelated dirty changes in the two allowed files",
      "push, tag, release, deploy, force push, or history rewrite is requested"
    ])
  );
  check("implementation_packet_guard_flags_are_non_executing", () =>
    implementationPacket.guard.authorization_packet_draft_only === true &&
    fieldsAreFalse(implementationPacket.guard, [
      "implementation_authorized_by_this_record",
      "external_repo_read_performed_by_this_draft",
      "external_repo_modified",
      "vcptoolbox_write_performed",
      "vcpchat_read_performed",
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
  check("implementation_packet_go_no_go_blocks_auto_execution", () =>
    implementationPacket.go_no_go.implementation_authorization_packet_created === true &&
    implementationPacket.go_no_go.current_external_modification_allowed === false &&
    implementationPacket.go_no_go.current_live_probe_allowed === false &&
    implementationPacket.go_no_go.confirmed_file_allowlist_count === 2 &&
    implementationPacket.go_no_go.future_implementation_requires_separate_exact_authorization === true &&
    implementationPacket.go_no_go.next_auto_step_allowed === false
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
        receiptPath,
        implementationPacketPath,
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
    receipt: receiptPath,
    implementation_packet: implementationPacketPath,
    authorization_package_id: packet.authorization_package_id,
    implementation_authorization_package_id: implementationPacket.authorization_package_id,
    can_execute_now: false,
    authorization_granted_by_this_record: false,
    real_vcptoolbox_read_authorized_by_this_record: false,
    external_vcptoolbox_modification_authorized_by_this_record: false,
    next_auto_step_allowed: false,
    external_repo_read_performed: receipt.guard.external_repo_read_performed === true,
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
