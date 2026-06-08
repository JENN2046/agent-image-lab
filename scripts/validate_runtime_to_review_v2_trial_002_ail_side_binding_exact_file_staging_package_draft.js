#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v2_trial_002_ail_side_binding_exact_file_staging_package_draft";
const packageRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_ail_side_binding_exact_file_staging_package_draft_20260608.json";
const preflightPacketRef = "reports/runtime_to_review_v2/r2r_v2_trial_002_lantern_ecommerce_hero_ail_side_binding_preflight_20260608.json";

const expectedNormalAdd = [
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md",
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  "adapters/runtime/native_doubao_runtime_v2_trial_002_lantern_ecommerce_broker_dispatch_adapter.js",
  packageRef,
  preflightPacketRef,
  "scripts/native_doubao_secretless_provider_runtime_bridge.js",
  "scripts/validate_runtime_to_review_v2_trial_002_ail_side_binding_exact_file_staging_package_draft.js",
  "scripts/validate_runtime_to_review_v2_trial_002_ail_side_binding_preflight.js",
  "tests/fixtures/runtime_kernel_v2_trial_002_lantern_ecommerce_hero_task.fixture.json",
];

const results = [];

function repoPath(ref) {
  const resolved = path.resolve(root, ref);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository root: ${ref}`);
  }
  return resolved;
}

function readJson(ref) {
  return JSON.parse(fs.readFileSync(repoPath(ref), "utf8"));
}

function check(name, predicate) {
  let passed = false;
  let detail = null;
  try {
    passed = Boolean(predicate());
  } catch (error) {
    detail = error.message;
  }
  results.push(detail ? { check: name, passed, detail } : { check: name, passed });
}

function sameArray(left, right) {
  return Array.isArray(left) &&
    left.length === right.length &&
    left.every((value, index) => value === right[index]);
}

function isRepoRelative(ref) {
  return typeof ref === "string" &&
    ref.trim() !== "" &&
    !path.isAbsolute(ref) &&
    !ref.split(/[\\/]/).includes("..");
}

function gitLines(args) {
  const output = childProcess.execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
  return output ? output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean) : [];
}

const pkg = readJson(packageRef);
const preflight = readJson(preflightPacketRef);
const normalAdd = pkg.exact_stage_command_draft.normal_add;
const forceAdd = pkg.exact_stage_command_draft.force_add;
const forbidden = pkg.exact_stage_command_draft.forbidden;
const modified = gitLines(["diff", "--name-only"]);
const untracked = gitLines(["ls-files", "--others", "--exclude-standard"]);
const dirty = [...modified, ...untracked].sort();
const expectedDirty = [...expectedNormalAdd].sort();

check("package_schema_and_status", () =>
  pkg.schema === "runtime_to_review_v2_trial_002_ail_side_binding_exact_file_staging_package_draft.v1" &&
  pkg.status === "draft_validated_pending_exact_stage_and_commit" &&
  pkg.remote_action_authorized === false &&
  pkg.stage_performed === false &&
  pkg.commit_performed === false &&
  pkg.push_performed === false
);
check("preflight_remains_non_executable", () =>
  preflight.can_execute_now === false &&
  preflight.binding_ready === false &&
  preflight.dispatch_performed === false &&
  preflight.activation_consumed === false &&
  preflight.blocking_reason_before_binding_ready === "external_vcptoolbox_trial_002_internal_route_and_authorizer_not_bound"
);
check("exact_stage_list_matches_expected", () => sameArray(normalAdd, expectedNormalAdd));
check("force_add_is_empty", () => Array.isArray(forceAdd) && forceAdd.length === 0);
check("all_stage_paths_exist_and_are_repo_relative", () =>
  normalAdd.every((ref) => isRepoRelative(ref) && fs.existsSync(repoPath(ref)))
);
check("dirty_worktree_matches_exact_package", () => sameArray(dirty, expectedDirty));
check("forbidden_paths_exclude_external_and_dot_add", () =>
  forbidden.includes("git add .") &&
  forbidden.includes("A:/VCP/apps/VCPToolBox/") &&
  forbidden.includes(".worktrees/") &&
  forbidden.includes(".env") &&
  forbidden.includes(".env.local")
);
check("vcptoolbox_boundary_explicit", () =>
  pkg.vcptoolbox_boundary.external_repo === "A:/VCP/apps/VCPToolBox" &&
  pkg.vcptoolbox_boundary.stage_external_repo_files === false &&
  pkg.vcptoolbox_boundary.modify_external_repo_files === false
);
check("validation_list_includes_trial_002_chain", () =>
  pkg.validation_required_before_stage_or_commit.includes("node scripts/validate_runtime_to_review_v2_trial_002_ail_side_binding_preflight.js") &&
  pkg.validation_required_before_stage_or_commit.includes("node scripts/validate_runtime_to_review_v2_trial_002_activation_packet_no_execute.js") &&
  pkg.validation_required_before_stage_or_commit.includes("node scripts/validate_agent_board_state.js") &&
  pkg.validation_required_before_stage_or_commit.includes("git diff --check")
);
check("go_no_go_blocks_push_and_dot_add", () =>
  pkg.go_no_go.can_stage_exact_files === true &&
  pkg.go_no_go.can_commit_after_exact_staging_and_staged_diff_review === true &&
  pkg.go_no_go.can_push === false &&
  pkg.go_no_go.must_not_use_git_add_dot === true &&
  pkg.go_no_go.must_not_mix_vcptoolbox_repo === true
);

const failed = results.filter((result) => !result.passed);
const output = {
  passed: failed.length === 0,
  validator,
  package_ref: packageRef,
  normal_add_count: normalAdd.length,
  force_add_count: forceAdd.length,
  dirty_count: dirty.length,
  check_count: results.length,
  failed_count: failed.length,
  route_http_request_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  external_vcptoolbox_write_performed: false,
  stage_performed: false,
  commit_performed: false,
  push_performed: false,
  results,
};

process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
if (failed.length > 0) process.exit(1);
