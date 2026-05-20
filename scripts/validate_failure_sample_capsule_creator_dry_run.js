#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const creatorPath = path.join(repoRoot, "scripts", "create_failure_sample_capsule.js");
const commonPath = path.join(repoRoot, "scripts", "lib", "capsule_creator_common.js");
const sampleId = "failure_french_summer_rattan_bag_v7_29_001";
const sourceImage =
  "runs/real_generation/v7_29_native_doubao_french_summer_rattan_bag_v2_single_real_run/native_doubao_1778325901725_0.jpg";
const targetRoot = path.join(repoRoot, "asset_archive", "failure_samples", sampleId);

function runCreator(args) {
  const run = spawnSync(process.execPath, [creatorPath, ...args], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  let parsed = null;
  try {
    parsed = run.stdout ? JSON.parse(run.stdout) : null;
  } catch (error) {
    parsed = {
      passed: false,
      status: "creator_output_parse_failed",
      parse_error: error.message,
      stdout: run.stdout,
      stderr: run.stderr,
    };
  }
  return {
    exitCode: run.status,
    stdout: run.stdout,
    stderr: run.stderr,
    result: parsed,
  };
}

function expect(condition, check, detail = null) {
  return { check, passed: Boolean(condition), detail };
}

const checks = [];
const creatorSource = fs.readFileSync(creatorPath, "utf8");
const commonSource = fs.readFileSync(commonPath, "utf8");
const beforeTargetExists = fs.existsSync(targetRoot);
const beforeTargetEntries = beforeTargetExists ? fs.readdirSync(targetRoot).sort() : [];

const planOnly = runCreator([
  `--sample-id=${sampleId}`,
  `--source-image=${sourceImage}`,
  "--long-edge=512",
]);

const afterPlanTargetExists = fs.existsSync(targetRoot);
const afterPlanTargetEntries = afterPlanTargetExists ? fs.readdirSync(targetRoot).sort() : [];
checks.push(expect(planOnly.exitCode === 0, "plan_only_exits_zero", planOnly.exitCode));
checks.push(expect(planOnly.result?.passed === true, "plan_only_reports_passed_true", planOnly.result?.passed));
checks.push(expect(planOnly.result?.mode === "plan_only", "plan_only_mode_reported", planOnly.result?.mode));
checks.push(expect(planOnly.result?.writes_performed === false, "plan_only_writes_false", planOnly.result?.writes_performed));
checks.push(expect(planOnly.result?.confirm_create_required === true, "plan_only_confirm_required", planOnly.result?.confirm_create_required));
checks.push(expect(
  planOnly.result?.source_image_exists === true || beforeTargetExists === true,
  "plan_only_source_exists_or_capsule_already_portable",
  { source_image_exists: planOnly.result?.source_image_exists, target_capsule_exists: beforeTargetExists }
));
checks.push(expect(
  beforeTargetExists === afterPlanTargetExists &&
    JSON.stringify(beforeTargetEntries) === JSON.stringify(afterPlanTargetEntries),
  "plan_only_preserves_target_directory_state",
  { beforeTargetExists, afterPlanTargetExists, beforeTargetEntries, afterPlanTargetEntries }
));
checks.push(expect(planOnly.result?.planned_files?.length === 4, "plan_only_reports_four_planned_files", planOnly.result?.planned_files));
checks.push(expect(planOnly.result?.guard?.provider_contact_performed === false, "plan_only_no_provider_contact", planOnly.result?.guard));
checks.push(expect(planOnly.result?.guard?.plugin_call_performed === false, "plan_only_no_plugin_call", planOnly.result?.guard));
checks.push(expect(planOnly.result?.guard?.api_call_performed === false, "plan_only_no_api_call", planOnly.result?.guard));
checks.push(expect(planOnly.result?.guard?.image_generation_performed === false, "plan_only_no_image_generation", planOnly.result?.guard));
checks.push(expect(planOnly.result?.guard?.DailyNote_write_performed === false, "plan_only_no_dailynote_write", planOnly.result?.guard));
checks.push(expect(planOnly.result?.guard?.VCP_memory_write_performed === false, "plan_only_no_vcp_memory_write", planOnly.result?.guard));
checks.push(expect(creatorSource.includes("tempTargetRoot") && commonSource.includes(".tmp-"), "creator_uses_temp_capsule_directory"));
checks.push(expect(creatorSource.includes("renamePath") && commonSource.includes("fs.renameSync"), "creator_finalizes_with_rename"));
checks.push(expect(creatorSource.includes("removeTempTarget"), "creator_cleans_temp_target_on_failure"));

const badSource = runCreator([
  `--sample-id=${sampleId}`,
  "--source-image=runs/real_generation/not_authorized.jpg",
  "--long-edge=512",
]);
checks.push(expect(badSource.exitCode !== 0, "mismatched_source_exits_nonzero", badSource.exitCode));
checks.push(expect(badSource.stderr.includes("source image does not match authorized sample source"), "mismatched_source_reports_guard", badSource.stderr));

const badLongEdge = runCreator([
  `--sample-id=${sampleId}`,
  `--source-image=${sourceImage}`,
  "--long-edge=1024",
]);
checks.push(expect(badLongEdge.exitCode !== 0, "mismatched_long_edge_exits_nonzero", badLongEdge.exitCode));
checks.push(expect(badLongEdge.stderr.includes("long edge does not match authorized sample long_edge"), "mismatched_long_edge_reports_guard", badLongEdge.stderr));

const badSample = runCreator([
  "--sample-id=not_authorized_failure_sample",
  `--source-image=${sourceImage}`,
  "--long-edge=512",
]);
checks.push(expect(badSample.exitCode !== 0, "unsupported_sample_exits_nonzero", badSample.exitCode));
checks.push(expect(badSample.stderr.includes("unsupported failure sample id"), "unsupported_sample_reports_guard", badSample.stderr));

const finalTargetExists = fs.existsSync(targetRoot);
const finalTargetEntries = finalTargetExists ? fs.readdirSync(targetRoot).sort() : [];
checks.push(expect(
  beforeTargetExists === finalTargetExists &&
    JSON.stringify(beforeTargetEntries) === JSON.stringify(finalTargetEntries),
  "validator_preserves_target_directory_state",
  { beforeTargetExists, finalTargetExists, beforeTargetEntries, finalTargetEntries }
));

const failed = checks.filter((check) => !check.passed);
const result = {
  passed: failed.length === 0,
  status: failed.length === 0
    ? "failure_sample_capsule_creator_dry_run_verified"
    : "failure_sample_capsule_creator_dry_run_failed",
  check_count: checks.length,
  failed_count: failed.length,
  sample_id: sampleId,
  target_directory_existed_before_validation: beforeTargetExists,
  target_directory_exists_after_validation: finalTargetExists,
  confirm_create_executed: false,
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
  push_tag_release_deploy_performed: false,
  checks,
  failures: failed,
};

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
process.exit(result.passed ? 0 : 1);
