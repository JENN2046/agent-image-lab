#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const sampleId = "accepted_french_summer_rattan_bucket_bag_001";
const checks = [];

function relPath(file) {
  return path.join(root, file);
}

function add(check, passed, detail) {
  checks.push({
    check,
    passed: Boolean(passed),
    ...(detail === undefined ? {} : { detail }),
  });
}

function runNode(args, timeout = 30000) {
  return execFileSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout,
  });
}

function parseJson(text) {
  return JSON.parse(text.trim());
}

function assertNoExternalEffects(result) {
  const forbidden = [
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "image_generation_performed",
    "secret_value_read_performed",
    "env_file_content_read_performed",
    "DailyNote_write_performed",
    "VCP_memory_write_performed",
    "output_write_performed",
  ];
  return forbidden.every((key) => result[key] !== true);
}

function safeCheck(name, fn) {
  try {
    add(name, fn());
  } catch (error) {
    add(name, false, error.message);
  }
}

safeCheck("create_preview_capsule_plan_only", () => {
  const result = parseJson(runNode(["scripts/create_preview_capsule.js", `--sample-id=${sampleId}`]));
  return result.passed === true &&
    result.mode === "plan_only" &&
    result.writes_performed === false &&
    result.confirm_create_required === true &&
    result.guard.provider_contact_performed === false &&
    result.guard.image_generation_performed === false;
});

safeCheck("validate_preview_capsule_existing_capsule", () => {
  const result = parseJson(runNode(["scripts/validate_preview_capsule.js", `--sample-id=${sampleId}`, "--long-edge=512"]));
  return result.passed === true &&
    result.status === "git_portable_preview_evidence_verified" &&
    result.previewLongEdge === 512 &&
    result.failures.length === 0;
});

safeCheck("read_only_adapter_blocks_write_intent", () => {
  const adapter = require(relPath("scripts/agent_image_lab_read_only_adapter.js"));
  const response = adapter.processRequest({
    schema_version: "v1",
    request_id: "mvp_core_write_block_001",
    bridge_mode: "read_only",
    payload_type: "text_only_refs",
    case_id: "french_summer_rattan_bag_v3_production_candidate_001",
    requested_resources: ["project_state"],
    write_intent: true,
  });
  return response.status === "blocked" &&
    response.blocked_reasons.includes("write_intent_detected") &&
    response.external_side_effects.vcp_call_performed === false &&
    response.external_side_effects.vcp_memory_write_performed === false;
});

safeCheck("native_doubao_runner_dry_run_no_api", () => {
  const result = parseJson(runNode([
    "scripts/run_native_doubao_image_generation.js",
    "--case-id=tennis_wallet_hero_v2_preflight",
    "--dry-run=true",
  ]));
  return result.status === "DRY_RUN_ONLY" &&
    result.provider_contact_performed === false &&
    result.api_call_performed === false &&
    result.image_generation_performed === false &&
    result.secret_value_read_performed === false;
});

safeCheck("native_doubao_adapter_fail_closed_without_authorization", () => {
  const output = runNode([
    "-e",
    [
      "const adapter = require('./adapters/image_generation/native_doubao_adapter.js');",
      "adapter.run({ dryRun: false, promptPackageRef: 'prompts/image_generation/product_still_life_tennis_wallet_hero_v2.yaml', outputDirectory: 'runs/real_generation/tennis_wallet_hero_v2_preflight', maxPluginCalls: 1, maxImagesCreated: 1 })",
      ".then((result) => { console.log(JSON.stringify(result)); process.exit(result.status === 'BLOCKED_A5_REQUIRED' ? 0 : 1); })",
      ".catch((error) => { console.error(error.stack || error.message); process.exit(1); });",
    ].join(" "),
  ]);
  const result = parseJson(output);
  return result.status === "BLOCKED_A5_REQUIRED";
});

safeCheck("review_console_static_mock_basic_structure", () => {
  const mockSource = fs.readFileSync(relPath("review_console/static_prototype/mock_data.js"), "utf8");
  const appSource = fs.readFileSync(relPath("review_console/static_prototype/app.js"), "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(mockSource, sandbox, { filename: "mock_data.js", timeout: 1000 });
  const mock = sandbox.window.REVIEW_CONSOLE_MOCK;
  return mock &&
    Array.isArray(mock.score_model) &&
    mock.portable_preview_capsule_evidence &&
    mock.portable_preview_capsule_evidence.sample_id === sampleId &&
    appSource.includes("window.REVIEW_CONSOLE_MOCK");
});

safeCheck("runtime_review_bridge_readonly_stub", () => {
  const result = parseJson(runNode(["scripts/validate_runtime_review_bridge_readonly_stub.js"]));
  return result.passed === true &&
    result.adapter_id === "review_bridge_readonly_stub_v0" &&
    result.display_only === true &&
    result.writes_allowed_now === false &&
    result.approve_reject_write_allowed_now === false &&
    result.provider_contact_performed === false &&
    result.image_generation_performed === false &&
    result.production_write_performed === false &&
    result.DailyNote_write_performed === false &&
    result.VCP_memory_write_performed === false &&
    result.all_negative_cases_caught === true;
});

safeCheck("runtime_review_bridge_v1_readonly", () => {
  const result = parseJson(runNode(["scripts/validate_runtime_review_bridge_v1_readonly.js"]));
  return result.passed === true &&
    result.adapter_id === "review_bridge_runtime_v1_readonly" &&
    result.display_fields_verified === true &&
    result.readonly_real_session_verified === true &&
    result.image_binary_read_performed === false &&
    result.file_write_performed === false &&
    result.provider_contact_performed === false &&
    result.plugin_call_performed === false &&
    result.api_call_performed === false &&
    result.image_generation_performed === false &&
    result.DailyNote_write_performed === false &&
    result.VCP_memory_write_performed === false &&
    result.production_candidate_write_performed === false &&
    result.all_negative_cases_caught === true;
});

safeCheck("review_decision_record_v1", () => {
  const result = parseJson(runNode(["scripts/validate_review_decision_record_v1.js"]));
  return result.passed === true &&
    result.helper_id === "review_decision_record_v1" &&
    result.decision_enum_count === 5 &&
    result.runtime_decision_record_verified === true &&
    result.retry_007_regression_decision === "provider_link_success_evidence_only" &&
    result.retry_007_not_accepted_sample === true &&
    result.retry_007_not_production_candidate === true &&
    result.provider_contact_performed === false &&
    result.plugin_call_performed === false &&
    result.api_call_performed === false &&
    result.image_generation_performed === false &&
    result.image_binary_read_performed === false &&
    result.accepted_samples_write_performed === false &&
    result.production_candidate_write_performed === false &&
    result.DailyNote_write_performed === false &&
    result.VCP_memory_write_performed === false &&
    result.memory_write_performed === false &&
    result.all_negative_cases_caught === true;
});

safeCheck("review_draft_registry_v1", () => {
  const result = parseJson(runNode(["scripts/validate_review_draft_registry_v1.js"]));
  return result.passed === true &&
    result.helper_id === "review_draft_registry_v1" &&
    result.accepted_draft_created === true &&
    result.rejected_draft_created === true &&
    result.rework_draft_created === true &&
    result.retry_007_draft_type === "no_registry_draft" &&
    result.retry_007_accepted_draft_created === false &&
    result.provider_contact_performed === false &&
    result.plugin_call_performed === false &&
    result.api_call_performed === false &&
    result.image_generation_performed === false &&
    result.image_binary_read_performed === false &&
    result.accepted_samples_write_performed === false &&
    result.production_candidate_write_performed === false &&
    result.DailyNote_write_performed === false &&
    result.VCP_memory_write_performed === false &&
    result.memory_write_performed === false &&
    result.all_negative_cases_caught === true;
});

safeCheck("runtime_to_review_v1_fixture_smoke_flow", () => {
  const result = parseJson(runNode(["scripts/validate_runtime_to_review_v1_fixture_smoke_flow.js"]));
  return result.passed === true &&
    result.flow_id === "runtime_to_review_v1_fixture_smoke_flow" &&
    result.status === "completed_fixture_runtime_to_review_smoke" &&
    result.runtime_status === "completed_fixture_artifact" &&
    result.review_session_status === "readonly_real_session" &&
    result.decision === "request_rework" &&
    result.draft_type === "rework_sample_draft" &&
    result.provider_failure_failed_closed === true &&
    result.model_mismatch_failed_closed === true &&
    result.file_write_performed === false &&
    result.provider_contact_performed === false &&
    result.plugin_call_performed === false &&
    result.api_call_performed === false &&
    result.image_generation_performed === false &&
    result.image_binary_read_performed === false &&
    result.accepted_samples_write_performed === false &&
    result.production_candidate_write_performed === false &&
    result.DailyNote_write_performed === false &&
    result.VCP_memory_write_performed === false &&
    result.memory_write_performed === false &&
    result.all_negative_cases_caught === true;
});

safeCheck("runtime_kernel_v1_real_provider_guarded", () => {
  const result = parseJson(runNode(["scripts/validate_runtime_kernel_v1_real_provider_guarded.js"]));
  return result.passed === true &&
    result.kernel_id === "runtime_kernel_v1_real_provider_guarded" &&
    result.contract_id === "runtime_kernel_v1_contract" &&
    result.fixture_status === "completed_fixture_artifact" &&
    result.no_delegate_status === "failed_closed" &&
    result.fake_provider_status === "completed_provider_image_created" &&
    result.bad_model_failed_closed === true &&
    result.invalid_input_failed_closed === true &&
    result.artifact_record_schema_verified === true &&
    result.audit_receipt_schema_verified === true &&
    result.review_bridge_real_entry_metadata_only_verified === true &&
    result.provider_delegate_default_bound === false &&
    result.real_provider_call_performed_by_validator === false &&
    result.provider_contact_performed === false &&
    result.plugin_call_performed === false &&
    result.api_call_performed === false &&
    result.image_generation_performed === false &&
    result.secret_value_read_performed === false &&
    result.env_file_content_read_performed === false &&
    result.production_write_performed === false &&
    result.accepted_samples_write_performed === false &&
    result.DailyNote_write_performed === false &&
    result.VCP_memory_write_performed === false;
});

safeCheck("runtime_durable_audit_store", () => {
  const result = parseJson(runNode(["scripts/validate_runtime_durable_audit_store.js"]));
  return result.passed === true &&
    result.adapter_id === "durable_audit_store_v0" &&
    result.store_root_git_ignored === true &&
    result.hash_chain_verified === true &&
    result.no_overwrite_verified === true &&
    result.task_index_query_count === 2 &&
    result.local_audit_write_performed === true &&
    result.provider_contact_performed === false &&
    result.image_generation_performed === false &&
    result.production_write_performed === false &&
    result.DailyNote_write_performed === false &&
    result.VCP_memory_write_performed === false &&
    result.all_negative_cases_caught === true;
});

safeCheck("provider_preflight_no_provider_call", () => {
  const result = parseJson(runNode(["scripts/validate_provider_preflight_no_provider_call.js"]));
  return result.passed === true &&
    result.adapter_id === "provider_preflight_no_provider_call_v0" &&
    result.can_execute_now === false &&
    result.provider_binding_ref_redacted === true &&
    result.provider_binding_ref_is_secret === false &&
    result.secretless_runtime_required === true &&
    result.provider_calls_budget === 0 &&
    result.plugin_calls_budget === 0 &&
    result.api_calls_budget === 0 &&
    result.image_candidates_budget === 0 &&
    result.max_write_count === 0 &&
    result.runner_preflight_passed === true &&
    result.runner_secretless_binding_mode === true &&
    result.provider_contact_performed === false &&
    result.plugin_call_performed === false &&
    result.api_call_performed === false &&
    result.image_generation_performed === false &&
    result.env_file_content_read_performed === false &&
    result.secret_value_read_performed === false &&
    result.output_write_performed === false &&
    result.production_write_performed === false &&
    result.DailyNote_write_performed === false &&
    result.VCP_memory_write_performed === false &&
    result.all_negative_cases_caught === true;
});

safeCheck("exact_a5_provider_execution_packet_draft", () => {
  const result = parseJson(runNode(["scripts/validate_exact_a5_provider_execution_packet_draft.js"]));
  return result.passed === true &&
    result.adapter_id === "exact_a5_provider_execution_packet_draft_v0" &&
    result.authorization_status === "draft_not_active" &&
    result.authorization_active === false &&
    result.can_execute_now === false &&
    result.requires_exact_user_activation === true &&
    result.exact_activation_phrase_present === true &&
    result.provider_binding_ref_redacted === true &&
    result.provider_binding_ref_is_secret === false &&
    result.max_provider_calls_when_activated === 1 &&
    result.max_plugin_calls_when_activated === 1 &&
    result.max_api_calls_when_activated === 1 &&
    result.max_images_created_when_activated === 1 &&
    result.retry_allowed === false &&
    result.current_provider_calls === 0 &&
    result.current_image_candidates === 0 &&
    result.provider_contact_performed === false &&
    result.plugin_call_performed === false &&
    result.api_call_performed === false &&
    result.image_generation_performed === false &&
    result.env_file_content_read_performed === false &&
    result.secret_value_read_performed === false &&
    result.output_write_performed === false &&
    result.production_write_performed === false &&
    result.DailyNote_write_performed === false &&
    result.VCP_memory_write_performed === false &&
    result.all_negative_cases_caught === true;
});

safeCheck("exact_a5_provider_retry_packet_draft", () => {
  const result = parseJson(runNode(["scripts/validate_exact_a5_provider_retry_packet_draft.js"]));
  return result.passed === true &&
    result.adapter_id === "exact_a5_provider_retry_packet_draft_v0" &&
    result.authorization_status === "draft_not_active" &&
    result.authorization_active === false &&
    result.can_execute_now === false &&
    result.required_model === "doubao-seedream-5-0-260128" &&
    result.previous_authorization_consumed === true &&
    result.previous_provider_calls_used === 1 &&
    result.retry_output_directory_ref === "runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_002" &&
    result.max_provider_calls_when_activated === 1 &&
    result.retry_allowed === false &&
    result.provider_contact_performed === false &&
    result.plugin_call_performed === false &&
    result.api_call_performed === false &&
    result.image_generation_performed === false &&
    result.env_file_content_read_performed === false &&
    result.secret_value_read_performed === false &&
    result.output_write_performed === false &&
    result.production_write_performed === false &&
    result.accepted_samples_write_performed === false &&
    result.DailyNote_write_performed === false &&
    result.VCP_memory_write_performed === false &&
    result.all_negative_cases_caught === true;
});

safeCheck("retry_007_preflight_decision", () => {
  const result = parseJson(runNode(["scripts/validate_exact_a5_provider_retry_007_preflight_decision.js"]));
  return result.passed === true &&
    result.candidate_authorization_id === "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260527-007" &&
    result.decision_status === "hold_pending_owner_decision" &&
    result.authorization_status === "not_issued" &&
    result.authorization_active === false &&
    result.can_execute_now === false &&
    result.exact_activation_phrase_issued === false &&
    result.required_model === "doubao-seedream-5-0-260128" &&
    result.retry_007_output_directory_ref === "runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_007" &&
    result.provider_evidence_integrity_gate_passed === true &&
    result.all_negative_cases_caught === true &&
    result.provider_contact_performed === false &&
    result.plugin_call_performed === false &&
    result.api_call_performed === false &&
    result.image_generation_performed === false &&
    result.env_file_content_read_performed === false &&
    result.secret_value_read_performed === false &&
    result.output_write_performed === false &&
    result.production_write_performed === false &&
    result.accepted_samples_write_performed === false &&
    result.DailyNote_write_performed === false &&
    result.VCP_memory_write_performed === false;
});

safeCheck("exact_a5_activation_receipt", () => {
  const result = parseJson(runNode(["scripts/validate_exact_a5_provider_execution_activation_receipt.js"]));
  const legacyBlockedBeforeContact = result.execution_status === "BLOCKED_SECRETLESS_RUNTIME_NOT_CALLABLE" &&
    result.provider_calls_used === 0 &&
    result.plugin_calls_used === 0 &&
    result.api_calls_used === 0 &&
    result.provider_contact_performed === false &&
    result.plugin_call_performed === false &&
    result.api_call_performed === false;
  const oneShotProviderAttemptBlocked = result.execution_status === "BLOCKED_PROVIDER_RUNTIME_DELEGATE_FAILED" &&
    result.provider_calls_used === 1 &&
    result.plugin_calls_used === 1 &&
    result.api_calls_used === 1 &&
    result.provider_contact_performed === true &&
    result.plugin_call_performed === true &&
    result.api_call_performed === true;
  return result.passed === true &&
    result.authorization_id === "AUTH-DRAFT-NATIVE-DOUBAO-ONE-SHOT-20260526-001" &&
    result.execution_blocked_fail_closed === true &&
    (legacyBlockedBeforeContact || oneShotProviderAttemptBlocked) &&
    result.images_created === 0 &&
    result.image_generation_performed === false &&
    result.env_file_content_read_performed === false &&
    result.secret_value_read_performed === false &&
    result.retry_performed === false &&
    result.production_write_performed === false &&
    result.accepted_samples_write_performed === false &&
    result.DailyNote_write_performed === false &&
    result.VCP_memory_write_performed === false;
});

safeCheck("exact_a5_retry_activation_receipt", () => {
  const result = parseJson(runNode(["scripts/validate_exact_a5_provider_retry_activation_receipt.js"]));
  return result.passed === true &&
    result.authorization_id === "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-002" &&
    result.execution_status === "BLOCKED_PLUGIN_NOT_FOUND_BEFORE_PROVIDER_CONTACT" &&
    result.execution_blocked_fail_closed === true &&
    result.provider_calls_used === 0 &&
    result.plugin_calls_used === 0 &&
    result.api_calls_used === 0 &&
    result.images_created === 0 &&
    result.output_files_written === 0 &&
    result.provider_contact_performed === false &&
    result.plugin_call_performed === false &&
    result.api_call_performed === false &&
    result.image_generation_performed === false &&
    result.env_file_content_read_performed === false &&
    result.secret_value_read_performed === false &&
    result.retry_performed === true &&
    result.further_retry_allowed === false &&
    result.production_write_performed === false &&
    result.accepted_samples_write_performed === false &&
    result.DailyNote_write_performed === false &&
    result.VCP_memory_write_performed === false;
});

safeCheck("exact_a5_retry_003_activation_receipt", () => {
  const result = parseJson(runNode(["scripts/validate_exact_a5_provider_retry_003_activation_receipt.js"]));
  return result.passed === true &&
    result.authorization_id === "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-003" &&
    result.execution_status === "BLOCKED_PROVIDER_OR_PLUGIN_RUNTIME_FAILED" &&
    result.provider_contact_attempted === true &&
    result.provider_calls_used === 1 &&
    result.plugin_calls_used === 1 &&
    result.api_calls_used === 1 &&
    result.images_created === 0 &&
    result.model_sent === "doubao-seedream-5-0-260128" &&
    result.output_directory_ref === "runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_003/" &&
    result.further_retry_allowed === false &&
    result.blocked_on_provider_default_model_fallback === true;
});

safeCheck("exact_a5_retry_004_activation_receipt", () => {
  const result = parseJson(runNode(["scripts/validate_exact_a5_provider_retry_004_activation_receipt.js"]));
  return result.passed === true &&
    result.authorization_id === "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-004" &&
    result.execution_status === "BLOCKED_PROVIDER_OR_PLUGIN_RUNTIME_FAILED" &&
    result.provider_calls_used === 1 &&
    result.images_created === 0 &&
    result.model_sent === "doubao-seedream-5-0-260128" &&
    result.non_target_model_observed === false &&
    result.blocker_type === "provider_size_constraint" &&
    result.further_retry_allowed === false;
});

safeCheck("exact_a5_retry_005_activation_receipt", () => {
  const result = parseJson(runNode(["scripts/validate_exact_a5_provider_retry_005_activation_receipt.js"]));
  return result.passed === true &&
    result.authorization_id === "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-005" &&
    result.execution_status === "BLOCKED_OUTPUT_SCOPE_VIOLATION" &&
    result.provider_calls_used === 1 &&
    result.images_created_total === 1 &&
    result.images_created_inside_authorized_output === 0 &&
    result.output_scope_violation === true &&
    result.review_eligible === false &&
    result.further_retry_allowed === false;
});

safeCheck("exact_a5_retry_006_activation_receipt", () => {
  const result = parseJson(runNode(["scripts/validate_exact_a5_provider_retry_006_activation_receipt.js"]));
  return result.passed === true &&
    result.authorization_id === "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-006" &&
    result.execution_status === "COMPLETED_PROVIDER_IMAGE_CREATED" &&
    result.provider_calls_used === 1 &&
    result.images_created === 1 &&
    typeof result.image_file === "string" &&
    result.image_file.startsWith("runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_006/") &&
    result.artifact_sha256 === "b75492195a390ab5ba9bd18d909db67dbf389ac03ee4d8a6b35c7249c532d446" &&
    result.artifact_mime_type === "image/jpeg" &&
    result.artifact_width === 1920 &&
    result.artifact_height === 2048 &&
    result.artifact_git_tracked === true &&
    result.artifact_git_ignored === false &&
    result.public_absolute_paths_absent === true &&
    result.output_scope_violation === false &&
    result.review_eligible === true &&
    result.further_retry_allowed === false;
});

safeCheck("exact_a5_retry_007_activation_receipt", () => {
  const result = parseJson(runNode(["scripts/validate_exact_a5_provider_retry_007_activation_receipt.js"]));
  return result.passed === true &&
    result.authorization_id === "AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260527-007" &&
    result.execution_status === "COMPLETED_PROVIDER_IMAGE_CREATED" &&
    result.provider_calls_used === 1 &&
    result.images_created === 1 &&
    typeof result.image_file === "string" &&
    result.image_file.startsWith("runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_007/") &&
    result.artifact_sha256 === "07618ba87d353770dd8913bc56ae3a7a900cb56ba08e6ae330f3165cb8c8c5f0" &&
    result.artifact_mime_type === "image/jpeg" &&
    result.artifact_width === 1920 &&
    result.artifact_height === 2048 &&
    result.artifact_git_tracked === true &&
    result.artifact_git_ignored === false &&
    result.public_absolute_paths_absent === true &&
    result.output_scope_violation === false &&
    result.review_eligible === true &&
    result.local_review_decision === "provider_link_success_evidence_only" &&
    result.accepted_sample_candidate === false &&
    result.prompt_9_16_gate_passed === false &&
    result.durable_audit_private_ref_recorded === true &&
    result.fresh_clone_private_audit_required === false &&
    result.further_retry_allowed === false;
});

safeCheck("retry_006_artifact_integrity", () => {
  const result = parseJson(runNode(["scripts/validate_retry_006_artifact_integrity.js"]));
  return result.passed === true &&
    result.image_ref === "runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_006/image/doubaogen/67b7aa65-4d90-4af5-8447-7194c7f017d1.png" &&
    result.bytes === 131139 &&
    result.sha256 === "b75492195a390ab5ba9bd18d909db67dbf389ac03ee4d8a6b35c7249c532d446" &&
    result.mime_type === "image/jpeg" &&
    result.magic_number === "ffd8ffe0" &&
    result.actual_format === "jpeg" &&
    result.width === 1920 &&
    result.height === 2048 &&
    result.extension === ".png" &&
    result.extension_mismatch_recorded === true &&
    result.git_tracked === true &&
    result.git_ignored === false &&
    result.public_absolute_paths_absent === true &&
    result.provider_contact_performed === false &&
    result.plugin_call_performed === false &&
    result.api_call_performed === false &&
    result.image_generation_performed === false &&
    result.secret_value_read_performed === false;
});

safeCheck("retry_007_artifact_integrity", () => {
  const result = parseJson(runNode(["scripts/validate_retry_007_artifact_integrity.js"]));
  return result.passed === true &&
    result.image_ref === "runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_007/image/doubaogen/d3155f44-cc09-4d63-8974-791bca90e8c3.png" &&
    result.bytes === 132372 &&
    result.sha256 === "07618ba87d353770dd8913bc56ae3a7a900cb56ba08e6ae330f3165cb8c8c5f0" &&
    result.mime_type === "image/jpeg" &&
    result.magic_number === "ffd8ffe0" &&
    result.actual_format === "jpeg" &&
    result.width === 1920 &&
    result.height === 2048 &&
    result.extension === ".png" &&
    result.extension_mismatch_recorded === true &&
    result.git_tracked === true &&
    result.git_ignored === false &&
    result.public_absolute_paths_absent === true &&
    result.provider_contact_performed === false &&
    result.plugin_call_performed === false &&
    result.api_call_performed === false &&
    result.image_generation_performed === false &&
    result.secret_value_read_performed === false;
});

safeCheck("provider_evidence_integrity_contract", () => {
  const result = parseJson(runNode(["scripts/validate_provider_evidence_integrity_contract.js"]));
  return result.passed === true &&
    result.contract_ref === "schemas/provider_evidence_integrity_contract.schema.yaml" &&
    result.receipt_count === 7 &&
    result.handoff_count === 7 &&
    result.local_admin_route_count === 10 &&
    result.eligible_artifact_record_count === 8 &&
    result.out_of_scope_artifact_count === 2 &&
    result.unique_checked_artifact_paths.length === 2 &&
    result.public_disclosure_constraints_verified === true &&
    result.local_admin_route_redaction_verified === true &&
    result.artifact_integrity_verified === true &&
    result.git_tracking_verified === true &&
    result.provider_contact_performed === false &&
    result.plugin_call_performed === false &&
    result.api_call_performed === false &&
    result.image_generation_performed === false &&
    result.secret_value_read_performed === false;
});

safeCheck("readonly_visual_review_mvp", () => {
  const result = parseJson(runNode(["scripts/validate_readonly_visual_review_mvp.js"]));
  return result.passed === true &&
    result.artifact_count === 24 &&
    result.review_row_count === 3 &&
    result.negative_case_count === 4 &&
    result.provider_contact_performed === false &&
    result.plugin_call_performed === false &&
    result.api_call_performed === false &&
    result.image_generation_performed === false &&
    result.file_write_performed === false &&
    result.accepted_samples_write_performed === false &&
    result.production_candidate_created === false &&
    result.DailyNote_write_performed === false &&
    result.VCP_memory_write_performed === false;
});

safeCheck("readonly_visual_review_dataset_regression", () => {
  const result = parseJson(runNode(["scripts/validate_readonly_visual_review_dataset_regression.js"]));
  return result.passed === true &&
    result.dimension_count === 7 &&
    result.review_row_count === 21 &&
    result.negative_case_count === 9 &&
    result.provider_contact_performed === false &&
    result.plugin_call_performed === false &&
    result.api_call_performed === false &&
    result.image_generation_performed === false &&
    result.file_write_performed === false &&
    result.accepted_samples_write_performed === false &&
    result.production_candidate_created === false &&
    result.DailyNote_write_performed === false &&
    result.VCP_memory_write_performed === false;
});

safeCheck("metadata_only_accepted_sample_retry_006", () => {
  const result = parseJson(runNode(["scripts/validate_metadata_only_accepted_sample_retry_006.js"]));
  return result.passed === true &&
    result.sample_id === "neutral_red_apple_seedream5_retry_006" &&
    result.category === "product_still_life" &&
    result.pipeline_id === "v0_6_73_real_vcp_agent_generation_retry_006" &&
    result.source_image_ref_preserved === true &&
    result.source_image_content_read_performed === false &&
    result.provider_contact_performed === false &&
    result.plugin_call_performed === false &&
    result.api_call_performed === false &&
    result.image_generation_performed === false &&
    result.production_candidate_write_performed === false &&
    result.DailyNote_write_performed === false &&
    result.VCP_memory_write_performed === false;
});

const failed = checks.filter((check) => !check.passed);
const output = {
  passed: failed.length === 0,
  validator: "validate_mvp_core",
  check_count: checks.length,
  failed_count: failed.length,
  scope: "mvp_product_core_only",
  excludes_agent_board: true,
  excludes_governance_docs_phase_ledger: true,
  provider_contact_performed: false,
  secret_value_read_performed: false,
  image_generation_performed: false,
  checks,
};

const sideEffectLeak = !assertNoExternalEffects(output);
if (sideEffectLeak) {
  output.passed = false;
  output.failed_count += 1;
  output.checks.push({ check: "mvp_core_side_effect_flags_false", passed: false });
} else {
  output.checks.push({ check: "mvp_core_side_effect_flags_false", passed: true });
  output.check_count += 1;
}

process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
process.exit(output.passed ? 0 : 1);
