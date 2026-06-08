#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const root = path.resolve(__dirname, "..");
const packageRef = "reports/runtime_to_review_v2/r2r_v2_trial_001_serum_detail_control_exact_file_staging_package_draft_20260608.json";
const expectedSha256 = "60af66aa0f26fc8e26eabd0719408d92b4efdc21b2f26737ae3e6fce1c1f9f82";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `Path escapes repository: ${relativePath}`);
  return resolved;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function flattenGroups(groups) {
  return Object.values(groups).flat();
}

function sha256File(relativePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(repoPath(relativePath))).digest("hex");
}

function assertNoRawLocalDrivePath(value, context) {
  if (typeof value === "string") {
    assert(!/^[A-Za-z]:[\\/]/.test(value), `Raw local drive path found in ${context}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoRawLocalDrivePath(item, `${context}.${index}`));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => assertNoRawLocalDrivePath(item, `${context}.${key}`));
  }
}

function main() {
  const pkg = readJson(packageRef);
  const allGroupedFiles = flattenGroups(pkg.exact_file_groups);
  const normalAdd = pkg.exact_stage_command_draft.normal_add;
  const forceAdd = pkg.exact_stage_command_draft.force_add;
  const allStageFiles = [...normalAdd, ...forceAdd];
  const checks = [];

  function check(name, fn) {
    fn();
    checks.push({ check: name, passed: true });
  }

  check("package_identity_and_no_remote_action", () => {
    assert(pkg.schema === "runtime_to_review_v2_trial_001_exact_file_staging_package_draft.v1", "schema mismatch");
    assert(pkg.status === "draft_validated_pending_human_stage_or_commit_decision", "status mismatch");
    assert(pkg.remote_action_authorized === false, "remote action must be false");
    assert(pkg.stage_performed === false, "stage must be false");
    assert(pkg.commit_performed === false, "commit must be false");
    assert(pkg.push_performed === false, "push must be false");
  });

  check("no_raw_local_paths_inside_stage_lists", () => {
    assertNoRawLocalDrivePath(pkg.exact_file_groups, "exact_file_groups");
    assertNoRawLocalDrivePath(pkg.exact_stage_command_draft.normal_add, "normal_add");
    assertNoRawLocalDrivePath(pkg.exact_stage_command_draft.force_add, "force_add");
  });

  check("all_stage_files_exist", () => {
    for (const file of allStageFiles) {
      assert(exists(file), `Missing staged package file: ${file}`);
    }
  });

  check("normal_add_covers_grouped_non_force_files", () => {
    const normalSet = new Set(normalAdd);
    const forceSet = new Set(forceAdd);
    for (const file of allGroupedFiles) {
      if (forceSet.has(file)) continue;
      assert(normalSet.has(file), `Grouped file missing from normal_add: ${file}`);
    }
  });

  check("force_add_contains_runtime_source_and_archive_binary", () => {
    assert(forceAdd.includes("asset_archive/original_assets/by_sha256/60af66aa0f26fc8e26eabd0719408d92b4efdc21b2f26737ae3e6fce1c1f9f82.jpg"), "archive binary missing from force_add");
    assert(forceAdd.includes("runs/real_generation/runtime_to_review_v2_trial_001_serum_detail_control/7bb59380-abb4-4180-9fa6-6a71549aec41.jpg"), "runtime source missing from force_add");
    for (const file of forceAdd) {
      assert(sha256File(file) === expectedSha256, `force_add binary hash mismatch: ${file}`);
    }
  });

  check("exclusions_block_temp_and_external_repo", () => {
    assert(pkg.exclude_from_agent_image_lab_stage.includes(".worktrees/"), ".worktrees exclusion missing");
    assert(pkg.exclude_from_agent_image_lab_stage.includes("A:/VCP/apps/VCPToolBox/"), "VCPToolBox exclusion missing");
    assert(pkg.exact_stage_command_draft.forbidden.includes("git add ."), "git add . forbidden marker missing");
    for (const file of allStageFiles) {
      assert(!file.startsWith(".worktrees/"), `Forbidden temp file in stage list: ${file}`);
      assert(!file.startsWith("A:/VCP/apps/VCPToolBox/"), `External repo file in stage list: ${file}`);
    }
  });

  check("final_validation_set_mentions_core_validators", () => {
    for (const command of [
      "node scripts/validate_runtime_to_review_v2_trial_001_durable_archive_gate.js",
      "node scripts/validate_runtime_to_review_v2_trial_001_memory_candidate_no_write_mapping_gate.js",
      "node scripts/validate_v7_32_accepted_sample_registry_update.js",
      "node scripts/validate_agent_board_state.js",
      "git diff --check"
    ]) {
      assert(pkg.validation_required_before_stage_or_commit.includes(command), `Missing validation command: ${command}`);
    }
    for (const command of [
      "node scripts/validate_runtime_to_review_v2_trial_001_activation_packet_no_execute.js",
      "node scripts/validate_runtime_to_review_v2_trial_001_future_execution_packet.js",
      "node scripts/validate_runtime_to_review_v2_trial_001_binding_ready_execution_packet.js",
      "node scripts/validate_runtime_to_review_v2_trial_001_execution_readiness_preflight.js",
      "node scripts/validate_runtime_to_review_v2_trial_001_exact_runtime_binding.js"
    ]) {
      assert(
        !pkg.validation_required_before_stage_or_commit.includes(command),
        `Pre-dispatch validator must not be final post-success validation: ${command}`
      );
      assert(
        pkg.historical_pre_dispatch_validators_not_final_after_success.includes(command),
        `Pre-dispatch validator missing from historical list: ${command}`
      );
    }
    assert(pkg.known_validation_note.includes("pre-dispatch gates"), "expected post-execution binding note missing");
  });

  check("go_no_go_preserves_human_commit_and_push_boundary", () => {
    assert(pkg.go_no_go.can_stage_exact_files_after_human_confirmation === true, "stage confirmation flag mismatch");
    assert(pkg.go_no_go.can_commit_after_exact_staging_and_staged_diff_review === true, "commit readiness flag mismatch");
    assert(pkg.go_no_go.can_push === false, "push must be false");
    assert(pkg.go_no_go.must_not_stage_dot_worktrees === true, "worktrees guard mismatch");
    assert(pkg.go_no_go.must_not_mix_vcptoolbox_repo === true, "external repo guard mismatch");
    assert(pkg.go_no_go.must_not_use_git_add_dot === true, "git add dot guard mismatch");
  });

  const result = {
    passed: true,
    validator: "runtime_to_review_v2_trial_001_exact_file_staging_package_draft",
    package_ref: packageRef,
    normal_add_count: normalAdd.length,
    force_add_count: forceAdd.length,
    total_stage_file_count: allStageFiles.length,
    binary_total_bytes: pkg.recommended_stage_sets.full_reproducible_local_package_with_binaries.binary_total_bytes,
    can_push: pkg.go_no_go.can_push,
    check_count: checks.length,
    failed_count: 0,
    results: checks
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
