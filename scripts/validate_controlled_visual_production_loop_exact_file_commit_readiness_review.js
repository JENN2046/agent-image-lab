#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const {
  buildGovernanceToolingMaintenanceSliceReport,
  governanceToolingMaintenanceSliceSelfCheck: runGovernanceToolingMaintenanceSliceSelfCheck
} = require("./lib/governance_tooling_maintenance_slice");

const root = path.resolve(__dirname, "..");
const files = {
  fixture: "tests/schema_examples/CONTROLLED_VISUAL_PRODUCTION_LOOP_EXACT_FILE_COMMIT_READINESS_REVIEW.example.json",
  phaseRecord: "docs/CONTROLLED_VISUAL_PRODUCTION_LOOP_EXACT_FILE_COMMIT_READINESS_REVIEW.md",
  mvpWiring: "scripts/validate_mvp_capsule_product_core.ps1",
  runState: ".agent_board/RUN_STATE.md",
  taskQueue: ".agent_board/TASK_QUEUE.md",
  checkpoint: ".agent_board/CHECKPOINT.md",
  handoff: ".agent_board/HANDOFF.md"
};

function readText(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

function readJson(relPath) {
  return JSON.parse(readText(relPath));
}

function runGit(args) {
  return childProcess.execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  }).trim();
}

function lines(value) {
  return value ? value.split(/\r?\n/).filter(Boolean) : [];
}

function findPostCommitProof(subject, expectedFiles) {
  const commits = lines(runGit(["log", "--format=%H%x00%s", "-n", "60"]));
  for (const commit of commits) {
    const [hash, commitSubject] = commit.split("\u0000");
    if (commitSubject !== subject) continue;
    const files = lines(runGit(["show", "--name-only", "--format=", hash])).sort();
    if (JSON.stringify(files) === JSON.stringify(expectedFiles)) {
      return { hash, subject: commitSubject, file_count: files.length };
    }
  }

  return null;
}

const results = [];
const failures = [];
const add = (check, passed, detail = null) => {
  results.push({ check, passed: Boolean(passed), ...(detail === null ? {} : { detail }) });
  if (!passed) failures.push({ check, ...(detail === null ? {} : { detail }) });
};

const fixture = readJson(files.fixture).controlled_visual_production_loop_exact_file_commit_readiness_review;
const stagedFiles = lines(runGit(["diff", "--cached", "--name-only"]));
const modifiedTracked = lines(runGit(["diff", "--name-only"]));
const untrackedFiles = lines(runGit(["ls-files", "--others", "--exclude-standard"]));
const changedFiles = [...modifiedTracked, ...untrackedFiles].sort();
const branch = runGit(["branch", "--show-current"]);
const ahead = Number(runGit(["rev-list", "--count", "origin/master..HEAD"]));
const behind = Number(runGit(["rev-list", "--count", "HEAD..origin/master"]));
const headSubject = runGit(["log", "-1", "--format=%s"]);
const headFiles = lines(runGit(["show", "--name-only", "--format=", "HEAD"])).sort();

const exactExpected = [...fixture.exact_stage_files].sort();
const candidateGroupsTotal = fixture.candidate_groups.reduce((sum, group) => sum + group.count, 0);
const expectedPostCommitSubject = fixture.commit_readiness_decision.suggested_commit_message;
const postCommitProof = findPostCommitProof(expectedPostCommitSubject, exactExpected);
const headMatchesExpectedPostCommit = postCommitProof !== null;
const validatorMaintenanceFiles = [
  "scripts/validate_mvp_capsule_product_core.ps1",
  "scripts/validate_controlled_visual_production_loop_checkpoint_readiness.js",
  "scripts/validate_controlled_visual_production_loop_commit_and_authorization_readiness_audit.js",
  "scripts/validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js"
].sort();
const selfMaintenanceAllowed = process.env.AGENT_IMAGE_LAB_VALIDATOR_MAINTENANCE === "1";
const isCleanCommittedState = behind === 0
  && stagedFiles.length === 0
  && modifiedTracked.length === 0
  && untrackedFiles.length === 0;
const isCleanPostCommit = isCleanCommittedState && headMatchesExpectedPostCommit;
const isCleanSyncedPostCommit = isCleanCommittedState && ahead === 0;
const isCleanLocalAheadPostCommit = isCleanCommittedState && ahead > 0;
const isValidatorSelfMaintenancePatch = selfMaintenanceAllowed
  && ahead === 0
  && behind === 0
  && stagedFiles.length === 0
  && untrackedFiles.length === 0
  && JSON.stringify([...modifiedTracked].sort()) === JSON.stringify(validatorMaintenanceFiles);
const governanceToolingMaintenanceSliceReport = buildGovernanceToolingMaintenanceSliceReport({
  changedFiles,
  stagedFiles,
  behind,
  currentPackageJson: readJson("package.json"),
  baselinePackageJson: JSON.parse(runGit(["show", "HEAD:package.json"]))
});
const governanceToolingMaintenanceSliceSelfCheck = runGovernanceToolingMaintenanceSliceSelfCheck();
const isGovernanceToolingMaintenanceSlice = governanceToolingMaintenanceSliceReport.passed;
const shouldValidateGovernanceToolingSlice = changedFiles.length > 0
  && !isValidatorSelfMaintenancePatch
  && governanceToolingMaintenanceSliceReport.path_allowed;
const acceptsCurrentGitShape = isCleanCommittedState || isValidatorSelfMaintenancePatch || isGovernanceToolingMaintenanceSlice;
const currentPendingSliceEvidence = JSON.stringify(changedFiles) === JSON.stringify(exactExpected)
  || isValidatorSelfMaintenancePatch
  || isGovernanceToolingMaintenanceSlice
  || isCleanCommittedState;

add("phase_record_exists", fs.existsSync(path.join(root, files.phaseRecord)));
add("fixture_phase", fixture.phase === "controlled_visual_production_loop_exact_file_commit_readiness_review");
add("execution_mode", fixture.execution_mode === "exact_file_commit_readiness_review_only");
add("commit_ready_after_human_review", fixture.commit_readiness_decision.local_commit_ready_after_explicit_human_review === true);
add("auto_commit_blocked", fixture.commit_readiness_decision.auto_commit_allowed_now === false);
add("staging_blocked", fixture.commit_readiness_decision.staging_allowed_now === false);
add("commit_blocked", fixture.commit_readiness_decision.commit_allowed_now === false);
add("push_blocked", fixture.commit_readiness_decision.push_allowed_now === false);
add("commit_message_present", typeof fixture.commit_readiness_decision.suggested_commit_message === "string" && fixture.commit_readiness_decision.suggested_commit_message.length > 0);
add("commit_trailer_present", fixture.commit_readiness_decision.commit_trailer_required === "Co-authored-by: Codex <noreply@openai.com>");
add("governance_tooling_slice_helper_self_check", governanceToolingMaintenanceSliceSelfCheck.passed, governanceToolingMaintenanceSliceSelfCheck.failures);
add("governance_tooling_slice_exact_current_files", !shouldValidateGovernanceToolingSlice || governanceToolingMaintenanceSliceReport.exact_slice_matches, governanceToolingMaintenanceSliceReport);
add("governance_tooling_package_preview_script_only", !shouldValidateGovernanceToolingSlice || !changedFiles.includes("package.json") || governanceToolingMaintenanceSliceReport.package_change_allowed, governanceToolingMaintenanceSliceReport.package_change_mode);
add("branch", branch === fixture.git_expectation.branch, branch);
add("ahead_count_or_clean_post_commit", acceptsCurrentGitShape || ahead === fixture.git_expectation.ahead_count, String(ahead));
add("behind_count", behind === fixture.git_expectation.behind_count, String(behind));
add("staged_file_count", stagedFiles.length === fixture.git_expectation.staged_file_count, String(stagedFiles.length));
add("tracked_modified_count_or_allowed_post_commit_state", acceptsCurrentGitShape || modifiedTracked.length === fixture.git_expectation.tracked_modified_file_count, String(modifiedTracked.length));
add("untracked_file_count_or_allowed_post_commit_state", acceptsCurrentGitShape || untrackedFiles.length === fixture.git_expectation.untracked_file_count, String(untrackedFiles.length));
add("exact_stage_file_count_or_allowed_post_commit_state", acceptsCurrentGitShape || changedFiles.length === fixture.git_expectation.exact_stage_file_count, String(changedFiles.length));
add("candidate_groups_total_matches", candidateGroupsTotal === fixture.git_expectation.exact_stage_file_count, String(candidateGroupsTotal));
add("exact_stage_files_match_or_allowed_post_commit_state", acceptsCurrentGitShape || JSON.stringify(changedFiles) === JSON.stringify(exactExpected));
add("post_commit_proof_exists_or_pending_slice", postCommitProof !== null || currentPendingSliceEvidence, postCommitProof?.hash || (isCleanCommittedState ? "current_clean_committed_state" : currentPendingSliceEvidence ? "current_pending_slice_evidence" : null));
add("no_staged_files_now", stagedFiles.length === 0);

for (const forbidden of fixture.forbidden_path_families) {
  const packageJsonAllowed = forbidden === "package.json" && isGovernanceToolingMaintenanceSlice;
  const providerReceiptAttemptResultsAllowed = forbidden === "runs/"
    && (
      governanceToolingMaintenanceSliceReport.matched_slice_id === "provider_receipt_artifact_repair_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_12_to_v0_6_18_exact_new_trial_execution_preflight_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_12_to_v0_6_20_failed_no_image_post_run_review_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_12_to_v0_6_21_raw_provider_payload_capture_policy_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_12_to_v0_6_22_provider_payload_extraction_preflight_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_12_to_v0_6_23_single_generation_with_payload_trace_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_27_exact_new_trial_003_shot_1_execution_closeout_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_28_exact_new_trial_003_shot_2_pre_call_payload_capture_preflight_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_29_exact_new_trial_003_shot_2_execution_closeout_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_30_exact_new_trial_003_shot_3_pre_call_payload_capture_preflight_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_31_exact_new_trial_003_shot_3_execution_closeout_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_32_exact_new_trial_003_human_review_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_33_exact_new_trial_003_selected_candidate_human_approval_intake_package_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_34_exact_new_trial_003_selected_candidate_post_approval_gate_alignment_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_35_exact_new_trial_003_post_approval_registration_preflight_draft_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_36_exact_new_trial_003_accepted_samples_registration_authorization_package_draft_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_37_exact_new_trial_003_accepted_samples_registration_execution_preflight_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_38_exact_new_trial_003_durable_archive_authorization_compiler_output_preflight_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_39_exact_new_trial_003_production_candidate_authorization_compiler_output_preflight_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_40_exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_preflight_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_41_exact_new_trial_003_memory_delta_draft_package_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_42_exact_new_trial_003_sensitive_data_scan_preflight_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_43_exact_new_trial_003_daily_note_vcp_memory_authorization_compiler_output_refresh_preflight_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_44_exact_new_trial_003_exact_allowed_memory_targets_package_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_45_exact_new_trial_003_daily_note_vcp_memory_write_authorization_package_draft_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_46_exact_new_trial_003_daily_note_vcp_memory_write_execution_preflight_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_47_exact_new_trial_003_daily_note_vcp_memory_write_payload_refresh_package_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_48_exact_new_trial_003_daily_note_vcp_memory_write_receipt_contract_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_49_exact_new_trial_003_daily_note_vcp_memory_write_registry_contract_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_50_exact_new_trial_003_daily_note_vcp_memory_write_go_no_go_checkpoint_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_51_exact_new_trial_003_workflow_prerequisite_reconciliation_packet_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_52_exact_new_trial_003_formal_human_approval_evidence_capture_packet_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_53_exact_new_trial_003_formal_human_approval_capture_surface_static_panel_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_54_exact_new_trial_003_formal_human_approval_evidence_ingestion_packet_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_55_exact_new_trial_003_user_submitted_formal_human_approval_evidence_capture_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_56_exact_new_trial_003_accepted_samples_metadata_registration_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_57_exact_new_trial_003_durable_archive_metadata_preflight_after_accepted_sample_registration_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_58_exact_new_trial_003_durable_archive_write_authorization_package_after_metadata_preflight_slice"
    )
    && changedFiles
      .filter((file) => file.startsWith("runs/"))
      .every((file) => file.startsWith("runs/real_generation/") && file.endsWith("/generation_attempt_result.json"));
  const acceptedSamplesMetadataRegistrationAllowed = forbidden === "accepted_samples/"
    && (
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_56_exact_new_trial_003_accepted_samples_metadata_registration_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_57_exact_new_trial_003_durable_archive_metadata_preflight_after_accepted_sample_registration_slice" ||
      governanceToolingMaintenanceSliceReport.matched_slice_id === "v0_6_58_exact_new_trial_003_durable_archive_write_authorization_package_after_metadata_preflight_slice"
    )
    && changedFiles
      .filter((file) => file.startsWith("accepted_samples/"))
      .every((file) => (
        file === "accepted_samples/accepted_sample_registry.yaml" ||
        file === "accepted_samples/categories/fashion_lookbook_portrait.yaml"
      ));
  add(`forbidden_path_${forbidden}_untouched`, packageJsonAllowed || providerReceiptAttemptResultsAllowed || acceptedSamplesMetadataRegistrationAllowed || !changedFiles.some((file) => file === forbidden || file.startsWith(forbidden)));
}

for (const [key, expected] of Object.entries(fixture.guard)) {
  add(`guard_${key}`, expected === (key === "exact_file_commit_readiness_review_only" ? true : false));
}

for (const token of [
  "controlled_visual_production_loop_exact_file_commit_readiness_review",
  fixture.commit_readiness_decision.suggested_commit_message,
  "Co-authored-by: Codex <noreply@openai.com>"
]) {
  add(`phase_record_token_${token}`, readText(files.phaseRecord).includes(token));
}

for (const token of [
  "validate_controlled_visual_production_loop_checkpoint_readiness.js",
  "validate_controlled_visual_production_loop_memory_write_authorization.js",
  "validate_controlled_visual_production_loop_production_candidate_authorization.js",
  "validate_controlled_visual_production_loop_exact_file_commit_readiness_review.js"
]) {
  add(`mvp_token_${token}`, readText(files.mvpWiring).includes(token));
}

for (const token of [
  "controlled_visual_production_loop_exact_file_commit_readiness_review",
  "explicit_A5_activation_decision_for_controlled_visual_production_loop_production_candidate_static_only"
]) {
  add(`run_state_token_${token}`, readText(files.runState).includes(token));
  add(`task_queue_token_${token}`, readText(files.taskQueue).includes(token));
  add(`checkpoint_token_${token}`, readText(files.checkpoint).includes(token));
  add(`handoff_token_${token}`, readText(files.handoff).includes(token));
}

const output = {
  validator: "validate_controlled_visual_production_loop_exact_file_commit_readiness_review",
  version: "v1",
  passed: failures.length === 0,
  status: failures.length === 0
    ? "controlled_visual_production_loop_exact_file_commit_readiness_review_verified"
    : "controlled_visual_production_loop_exact_file_commit_readiness_review_failed",
  branch,
  ahead_count: ahead,
  behind_count: behind,
  staged_file_count: stagedFiles.length,
  tracked_modified_file_count: modifiedTracked.length,
  untracked_file_count: untrackedFiles.length,
  exact_stage_file_count: changedFiles.length,
  head_subject: headSubject,
  head_file_count: headFiles.length,
  post_commit_proof_commit: postCommitProof?.hash || null,
  post_commit_proof_file_count: postCommitProof?.file_count || 0,
  post_commit_files_match_expected: headMatchesExpectedPostCommit,
  governance_tooling_maintenance_slice_report: governanceToolingMaintenanceSliceReport,
  git_validation_mode: isCleanSyncedPostCommit
    ? "clean_synced_post_commit"
    : isCleanLocalAheadPostCommit
      ? "clean_local_ahead_post_commit"
      : isValidatorSelfMaintenancePatch
        ? "validator_self_maintenance_patch"
        : isGovernanceToolingMaintenanceSlice
          ? "governance_tooling_maintenance_slice"
          : "pending_exact_file_slice",
  governance_tooling_maintenance_slice: isGovernanceToolingMaintenanceSlice,
  local_commit_ready_after_explicit_human_review: fixture.commit_readiness_decision.local_commit_ready_after_explicit_human_review,
  auto_commit_allowed_now: fixture.commit_readiness_decision.auto_commit_allowed_now,
  staging_allowed_now: fixture.commit_readiness_decision.staging_allowed_now,
  commit_allowed_now: fixture.commit_readiness_decision.commit_allowed_now,
  push_allowed_now: fixture.commit_readiness_decision.push_allowed_now,
  exact_stage_files: changedFiles,
  suggested_commit_message: fixture.commit_readiness_decision.suggested_commit_message,
  commit_trailer_required: fixture.commit_readiness_decision.commit_trailer_required,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  runtime_execution_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  push_tag_release_deploy_performed: false,
  production_candidate_write_performed: false,
  dependency_change_performed: false,
  check_count: results.length,
  failed_count: failures.length,
  checks: results,
  failures
};

console.log(JSON.stringify(output, null, 2));
process.exit(output.passed ? 0 : 1);
