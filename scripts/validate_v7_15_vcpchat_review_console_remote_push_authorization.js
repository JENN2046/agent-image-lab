const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function includesAll(content, values) {
  return values.every((value) => content.includes(value));
}

function excludesAll(content, values) {
  return values.every((value) => !content.includes(value));
}

function main() {
  const requiredFiles = [
    "docs/167_v7_15_vcpchat_review_console_remote_push_authorization.md",
    "review_console/embed_contract/vcpchat_review_console_remote_push_authorization.md",
    "tests/schema_examples/v7_15_vcpchat_review_console_remote_push_authorization.example.yaml",
    "scripts/validate_v7_15_vcpchat_review_console_remote_push_authorization.js",
    "tests/validation_checklist.md",
    "docs/166_v7_14_vcpchat_review_console_post_commit_record.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v7.15 remote push authorization files: ${missingFiles.join(", ")}`);

  const currentRecordFiles = [
    "docs/167_v7_15_vcpchat_review_console_remote_push_authorization.md",
    "review_console/embed_contract/vcpchat_review_console_remote_push_authorization.md",
    "tests/schema_examples/v7_15_vcpchat_review_console_remote_push_authorization.example.yaml"
  ];
  const recordFiles = requiredFiles.filter((relativePath) => !relativePath.endsWith(".js"));
  const contents = recordFiles
    .map((relativePath) => read(relativePath))
    .join("\n");
  const currentContents = currentRecordFiles
    .map((relativePath) => read(relativePath))
    .join("\n");
  const checklist = read("tests/validation_checklist.md");

  const phaseRecorded = includesAll(contents, [
    "v7.15 vcpchat review console remote push authorization",
    "current_head: b09b815",
    "head_commit_short: b09b815",
    "docs/166_v7_14_vcpchat_review_console_post_commit_record.md",
    "v7.16 VCPChat Review Console Remote Push Execution Record"
  ]);

  const pushReadinessRecorded = includesAll(contents, [
    "observed_branch: main",
    "observed_head_short: 426a2a9",
    "observed_origin_main_short: c97ff0c",
    "observed_status: \"main...origin/main [ahead 1]\"",
    "local_remote_divergence: \"1 0\"",
    "remote_has_unpulled_commits: false",
    "vcpchat_worktree_clean: true",
    "push_candidate_ready: true",
    "vcpchat_remote_push_performed: false"
  ]);

  const candidateCommitRecorded = includesAll(contents, [
    "candidate_commit",
    "commit_short: 426a2a9",
    "commit_subject: \"feat: add image lab review console bridge\"",
    "previous_remote_head_short: c97ff0c",
    "committed_files_only_inside_allowed_scope: true",
    "modules/ipc/imageLabReviewHandlers.js",
    "modules/renderer/imageLabReviewMount.js"
  ]);

  const authorizationRequestRecorded = includesAll(contents, [
    "push_authorization_request",
    "approval_required_before_push: true",
    "git push origin main",
    "commit_to_push: 426a2a9",
    "expected_remote_before_push: c97ff0c",
    "我明确授权推送 VCPChat commit 426a2a9 到 origin/main。",
    "ambiguous_continue_is_not_enough: true"
  ]);

  const sideEffectGuardRecorded = includesAll(currentContents, [
    "plugin_called: false",
    "api_called: false",
    "daily_note_called: false",
    "vcp_memory_written: false",
    "image_created: false",
    "dependency_changed: false",
    "package_manifest_changed: false",
    "lockfile_changed: false",
    "env_or_secret_file_read: false",
    "secret_value_copied: false",
    "raw_local_path_saved: false",
    "vcpchat_remote_push_performed: false",
    "github_release_performed: false"
  ]);

  const stopBoundaryRecorded = includesAll(contents, [
    "this_record_does_not_push_vcpchat: true",
    "vcpchat_commit_is_still_local_only: true",
    "vcpchat_remote_push_requires_separate_user_authorization: true",
    "vcpchat_remote_push_blocked_until_user_approval: true",
    "stop_here: true"
  ]);

  const forbiddenTrueKeys = [
    "plugin_called",
    "api_called",
    "daily_note_called",
    "vcp_memory_written",
    "image_created",
    "dependency_changed",
    "package_manifest_changed",
    "lockfile_changed",
    "env_or_secret_file_read",
    "secret_value_copied",
    "raw_local_path_saved",
    "vcpchat_remote_push_performed",
    "github_release_performed"
  ];
  const noForbiddenTrue = excludesAll(
    currentContents,
    forbiddenTrueKeys.map((key) => `${key}: true`)
  );

  const noRawLocalPath = excludesAll(currentContents, [
    "A:\\VCP",
    "A:/VCP",
    "C:\\Users",
    "C:/Users"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v7.15 VCPChat Review Console Remote Push Authorization 检查",
    "docs/167_v7_15_vcpchat_review_console_remote_push_authorization.md",
    "review_console/embed_contract/vcpchat_review_console_remote_push_authorization.md",
    "tests/schema_examples/v7_15_vcpchat_review_console_remote_push_authorization.example.yaml",
    "scripts/validate_v7_15_vcpchat_review_console_remote_push_authorization.js",
    "observed_head_short=426a2a9",
    "local_remote_divergence=1 0",
    "vcpchat_remote_push_performed=false",
    "git push origin main"
  ]);

  assert(phaseRecorded, "v7.15 phase and baseline must be recorded.");
  assert(pushReadinessRecorded, "v7.15 must record push readiness.");
  assert(candidateCommitRecorded, "v7.15 must record candidate commit.");
  assert(authorizationRequestRecorded, "v7.15 must record push authorization request.");
  assert(sideEffectGuardRecorded, "v7.15 must record side effect guard.");
  assert(stopBoundaryRecorded, "v7.15 must stop before VCPChat remote push.");
  assert(noForbiddenTrue, "v7.15 must not set forbidden side-effect flags to true.");
  assert(noRawLocalPath, "v7.15 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.15 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_15_remote_push_authorization: {
      phase_recorded: phaseRecorded,
      push_readiness_recorded: pushReadinessRecorded,
      candidate_commit_recorded: candidateCommitRecorded,
      authorization_request_recorded: authorizationRequestRecorded,
      side_effect_guard_recorded: sideEffectGuardRecorded,
      stop_boundary_recorded: stopBoundaryRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      candidate_commit: "426a2a9",
      vcpchat_remote_push_performed: false,
      next_safe_phase: "v7.16 VCPChat Review Console Remote Push Execution Record"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
