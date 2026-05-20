#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const {
  BASE_NO_EXECUTION_GUARD,
  createNoExecutionGuard,
  createCapsuleCreatorCommon,
} = require("./lib/capsule_creator_common");

const repoRoot = path.resolve(__dirname, "..");
const acceptedCreatorText = fs.readFileSync(path.join(repoRoot, "scripts", "create_preview_capsule.js"), "utf8");
const failureCreatorText = fs.readFileSync(path.join(repoRoot, "scripts", "create_failure_sample_capsule.js"), "utf8");
const commonText = fs.readFileSync(path.join(repoRoot, "scripts", "lib", "capsule_creator_common.js"), "utf8");

function expect(condition, check, detail = null) {
  return { check, passed: Boolean(condition), ...(detail === null ? {} : { detail }) };
}

function capturesThrow(fn) {
  try {
    fn();
    return null;
  } catch (error) {
    return error.message;
  }
}

const checks = [];

checks.push(expect(acceptedCreatorText.includes("createCapsuleCreatorCommon"), "accepted_creator_uses_common_helper"));
checks.push(expect(failureCreatorText.includes("createCapsuleCreatorCommon"), "failure_creator_uses_common_helper"));
checks.push(expect(!acceptedCreatorText.includes("function repoPath("), "accepted_creator_repo_path_not_duplicated"));
checks.push(expect(!failureCreatorText.includes("function repoPath("), "failure_creator_repo_path_not_duplicated"));
checks.push(expect(!acceptedCreatorText.includes("function writeJson("), "accepted_creator_write_json_not_duplicated"));
checks.push(expect(!failureCreatorText.includes("function writeJson("), "failure_creator_write_json_not_duplicated"));
checks.push(expect(!acceptedCreatorText.includes("function assertTargetClean("), "accepted_creator_target_clean_not_duplicated"));
checks.push(expect(!failureCreatorText.includes("function assertTargetClean("), "failure_creator_target_clean_not_duplicated"));
checks.push(expect(!acceptedCreatorText.includes("function removeTempTarget("), "accepted_creator_temp_cleanup_not_duplicated"));
checks.push(expect(!failureCreatorText.includes("function removeTempTarget("), "failure_creator_temp_cleanup_not_duplicated"));
checks.push(expect(commonText.includes("path escapes repository root"), "common_helper_keeps_repo_escape_guard"));
checks.push(expect(commonText.includes("refusing to remove non-temp capsule path"), "common_helper_keeps_temp_delete_guard"));
checks.push(expect(commonText.includes("target capsule directory already exists"), "common_helper_keeps_target_overwrite_guard"));

const acceptedCommon = createCapsuleCreatorCommon(repoRoot, {
  tempRootParent: "asset_archive/accepted_samples",
});
const failureCommon = createCapsuleCreatorCommon(repoRoot, {
  tempRootParent: "asset_archive/failure_samples",
});

const repoEscapeError = capturesThrow(() => acceptedCommon.repoPath("../outside"));
checks.push(expect(/path escapes repository root/.test(repoEscapeError || ""), "common_repo_escape_fails_closed", repoEscapeError));

const acceptedNonTempError = capturesThrow(() => acceptedCommon.removeTempTarget("asset_archive/accepted_samples/not-temp"));
checks.push(expect(/refusing to remove non-temp capsule path/.test(acceptedNonTempError || ""), "accepted_non_temp_delete_refused", acceptedNonTempError));

const failureNonTempError = capturesThrow(() => failureCommon.removeTempTarget("asset_archive/failure_samples/not-temp"));
checks.push(expect(/refusing to remove non-temp capsule path/.test(failureNonTempError || ""), "failure_non_temp_delete_refused", failureNonTempError));

const acceptedTemp = acceptedCommon.tempTargetRoot({ sampleId: "sample_001" });
const failureTemp = failureCommon.tempTargetRoot({ sampleId: "failure_001" });
checks.push(expect(acceptedTemp.startsWith("asset_archive/accepted_samples/.tmp-sample_001-"), "accepted_temp_path_scoped", acceptedTemp));
checks.push(expect(failureTemp.startsWith("asset_archive/failure_samples/.tmp-failure_001-"), "failure_temp_path_scoped", failureTemp));

const guard = createNoExecutionGuard({
  production_candidate_created: false,
  push_tag_release_deploy_performed: false,
});
checks.push(expect(BASE_NO_EXECUTION_GUARD.provider_contact_performed === false, "base_guard_blocks_provider_contact"));
checks.push(expect(guard.plugin_call_performed === false, "derived_guard_blocks_plugin_call"));
checks.push(expect(guard.api_call_performed === false, "derived_guard_blocks_api_call"));
checks.push(expect(guard.image_generation_performed === false, "derived_guard_blocks_image_generation"));
checks.push(expect(guard.DailyNote_write_performed === false, "derived_guard_blocks_dailynote_write"));
checks.push(expect(guard.VCP_memory_write_performed === false, "derived_guard_blocks_vcp_memory_write"));
checks.push(expect(guard.runtime_execution_performed === false, "derived_guard_blocks_runtime"));
checks.push(expect(guard.real_manifest_read_performed === false, "derived_guard_blocks_real_manifest_read"));
checks.push(expect(guard.real_vcpchat_read_performed === false, "derived_guard_blocks_real_vcpchat_read"));
checks.push(expect(guard.real_vcptoolbox_read_performed === false, "derived_guard_blocks_real_vcptoolbox_read"));
checks.push(expect(guard.production_candidate_created === false, "derived_guard_blocks_production_candidate"));
checks.push(expect(guard.push_tag_release_deploy_performed === false, "derived_guard_blocks_push_tag_release_deploy"));

const failed = checks.filter((check) => !check.passed);
const result = {
  passed: failed.length === 0,
  status: failed.length === 0
    ? "capsule_creator_common_safety_verified"
    : "capsule_creator_common_safety_failed",
  check_count: checks.length,
  failed_count: failed.length,
  duplicated_creator_safety_logic_reduced: failed.length === 0,
  writes_performed: false,
  preview_creation_or_copy_performed: false,
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
  production_candidate_write_performed: false,
  push_tag_release_deploy_performed: false,
  checks,
  failures: failed,
};

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
process.exit(result.passed ? 0 : 1);
