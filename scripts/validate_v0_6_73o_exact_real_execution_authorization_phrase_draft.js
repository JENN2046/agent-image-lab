#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docPath = "docs/vcp_integration/V0_6_73O_EXACT_REAL_EXECUTION_AUTHORIZATION_PHRASE_DRAFT.md";
const fixturePath = "tests/schema_examples/v0_6_73o_exact_real_execution_authorization_phrase_draft.example.yaml";
const nDocPath = "docs/vcp_integration/V0_6_73N_REAL_EXECUTION_GO_NO_GO_REVIEW.md";

const requiredFiles = [docPath, fixturePath, nDocPath];
const phrase = "I authorize v0_6_73_real_vcp_agent_generation_execution_one_shot now, using the exact active NativeDoubao bound delegate authorization packet, with max_provider_calls=1, max_plugin_calls=1, max_api_calls=1, max_images_created=1, retry_limit=0, output_directory_ref=runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/, receipt_ref=reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json, review_handoff_ref=review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json, human_review_required=true, review_console_required=true, no secret value exposure, and no automatic accepted_samples, production_candidate, DailyNote, or VCP memory write.";

const requiredTokens = [
  "phase: v0_6_73o_exact_real_execution_authorization_phrase_draft",
  "result: COMPLETED_VALIDATED",
  "authorization_phrase_contract_id: AUTH-PHRASE-DRAFT-V0-6-73O",
  "target_execution_phase: v0_6_73_real_vcp_agent_generation_execution_one_shot",
  "source_go_no_go_review_ref: docs/vcp_integration/V0_6_73N_REAL_EXECUTION_GO_NO_GO_REVIEW.md",
  "source_bound_delegate_preflight_ref: docs/vcp_integration/V0_6_73M_BOUND_DELEGATE_PREFLIGHT_VALIDATOR.md",
  "source_bound_delegate_authorization_ref: docs/vcp_integration/V0_6_73L_BOUND_DELEGATE_AUTHORIZATION_PACKET_DRAFT.md",
  "authorization_phrase_active: false",
  "authorization_phrase_draft_only: true",
  "exact_phrase_required: true",
  "partial_phrase_allowed: false",
  "paraphrase_allowed: false",
  "ambiguous_continue_allowed: false",
  "remote_synced_required_before_phrase_can_be_active: true",
  "exact_active_bound_delegate_authorization_required_before_phrase_can_be_active: true",
  "mvp_validation_required_before_phrase_can_be_active: true",
  "go_no_go_review_must_be_GO_before_phrase_can_be_active: true",
  "current_go_no_go_decision: NO_GO",
  "current_no_go_reason: remote_not_synced_and_exact_active_delegate_authorization_missing",
  "must_name_exact_phase: v0_6_73_real_vcp_agent_generation_execution_one_shot",
  "must_reference_exact_active_bound_delegate_authorization_packet: true",
  "must_lock_max_provider_calls: 1",
  "must_lock_max_plugin_calls: 1",
  "must_lock_max_api_calls: 1",
  "must_lock_max_images_created: 1",
  "must_lock_retry_limit: 0",
  "must_lock_output_directory_ref: runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/",
  "must_lock_receipt_ref: reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json",
  "must_lock_review_handoff_ref: review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json",
  "must_require_human_review: true",
  "must_require_review_console: true",
  "must_forbid_secret_value_exposure: true",
  "must_forbid_automatic_accepted_samples_write: true",
  "must_forbid_automatic_production_candidate_write: true",
  "must_forbid_automatic_DailyNote_write: true",
  "must_forbid_automatic_VCP_memory_write: true",
  "remote_synced_current_true",
  "npm_run_validate_mvp_passed_after_remote_sync",
  "exact_active_bound_delegate_authorization_present",
  "go_no_go_decision_GO",
  "exact_human_phrase_submitted_after_GO",
  "pre_provider_contact_preflight_rerun_passed",
  "provider_contact_performed: false",
  "plugin_call_performed: false",
  "api_call_performed: false",
  "image_generation_performed: false",
  "image_binary_read_performed: false",
  "output_write_performed: false",
  "receipt_write_performed: false",
  "review_handoff_write_performed: false",
  "env_file_content_read_performed: false",
  "secret_value_read_performed: false",
  "accepted_samples_write_performed: false",
  "production_candidate_write_performed: false",
  "DailyNote_write_performed: false",
  "VCP_memory_write_performed: false",
  "v0_6_73_execution_allowed: false",
  "next_safe_task: v0_6_73p_local_aggregate_readiness_review"
];

const rejectionTokens = [
  "phrase_submitted_before_remote_sync",
  "phrase_submitted_before_exact_active_bound_delegate_authorization",
  "phrase_submitted_while_go_no_go_decision_NO_GO",
  "phrase_omits_target_execution_phase",
  "phrase_omits_one_shot_budget",
  "phrase_changes_output_directory",
  "phrase_changes_receipt_path",
  "phrase_changes_review_handoff_path",
  "phrase_allows_retry",
  "phrase_allows_secret_value_exposure",
  "phrase_allows_auto_promotion_or_memory_write",
  "phrase_is_paraphrase_or_ambiguous_continue"
];

const results = [];
const errors = [];

function repoPath(relativePath) {
  return path.join(root, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function addResult(check, passed, detail) {
  results.push({ check, passed: Boolean(passed), detail });
  if (!passed) errors.push({ check, detail });
}

function main() {
  for (const file of requiredFiles) {
    addResult(`file_exists:${file}`, fs.existsSync(repoPath(file)), file);
  }

  const doc = read(docPath);
  const fixture = read(fixturePath);
  const nDoc = read(nDocPath);
  const joined = `${doc}\n${fixture}`;

  for (const token of requiredTokens) {
    addResult(`phrase_contract_contains:${token}`, joined.includes(token), token);
  }
  for (const token of rejectionTokens) {
    addResult(`rejection_rule:${token}`, doc.includes(token), token);
  }

  addResult("exact_phrase_template_present", joined.includes(phrase), "draft phrase");
  addResult("phrase_is_inactive_because_n_is_no_go", nDoc.includes("go_no_go_decision: NO_GO") &&
    nDoc.includes("remote_synced_current: false") &&
    nDoc.includes("exact_active_delegate_authorization_present: false") &&
    joined.includes("authorization_phrase_active: false"), nDocPath);
  addResult("phrase_locks_one_shot_budget_and_paths", phrase.includes("max_provider_calls=1") &&
    phrase.includes("max_plugin_calls=1") &&
    phrase.includes("max_api_calls=1") &&
    phrase.includes("max_images_created=1") &&
    phrase.includes("retry_limit=0") &&
    phrase.includes("output_directory_ref=runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/") &&
    phrase.includes("receipt_ref=reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json") &&
    phrase.includes("review_handoff_ref=review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json"), "one-shot phrase locks");
  addResult("phrase_forbids_secret_and_auto_promotion", phrase.includes("no secret value exposure") &&
    phrase.includes("no automatic accepted_samples, production_candidate, DailyNote, or VCP memory write"), "secret and promotion boundary");

  const passed = errors.length === 0;
  const summary = {
    validator: "validate_v0_6_73o_exact_real_execution_authorization_phrase_draft",
    phase: "v0_6_73o_exact_real_execution_authorization_phrase_draft",
    result: passed ? "COMPLETED_VALIDATED" : "BLOCKED",
    passed,
    check_count: results.length,
    failed_count: errors.length,
    authorization_phrase_active: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    image_binary_read_performed: false,
    output_write_performed: false,
    receipt_write_performed: false,
    review_handoff_write_performed: false,
    env_file_content_read_performed: false,
    secret_value_read_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    v0_6_73_execution_allowed: false,
    next_safe_task: "v0_6_73p_local_aggregate_readiness_review",
    errors,
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  process.exit(passed ? 0 : 1);
}

main();
