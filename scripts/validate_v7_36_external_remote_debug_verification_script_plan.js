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
  if (!condition) throw new Error(message);
}

function includesAll(content, values) {
  return values.every((value) => content.includes(value));
}

function excludesAll(content, values) {
  return values.every((value) => !content.includes(value));
}

function excludesExactTrueFlags(content, keys) {
  const lines = content.split(/\r?\n/).map((line) => line.trim());
  return keys.every((key) => !lines.some((line) => line === `${key}: true`));
}

function main() {
  const requiredFiles = [
    "docs/188_v7_36_external_remote_debug_verification_script_plan.md",
    "review_console/embed_contract/vcpchat_external_remote_debug_verification_script_plan.md",
    "tests/schema_examples/v7_36_external_remote_debug_verification_script_plan.example.yaml",
    "scripts/validate_v7_36_external_remote_debug_verification_script_plan.js",
    "tests/validation_checklist.md",
    "docs/187_v7_35_vcpchat_review_console_runtime_followup_planning.md"
  ];
  const missing = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missing.length === 0, `Missing v7.36 external remote-debug verification script plan files: ${missing.join(", ")}`);

  const currentFiles = [
    "docs/188_v7_36_external_remote_debug_verification_script_plan.md",
    "review_console/embed_contract/vcpchat_external_remote_debug_verification_script_plan.md",
    "tests/schema_examples/v7_36_external_remote_debug_verification_script_plan.example.yaml"
  ];
  const contents = requiredFiles
    .filter((relativePath) => !relativePath.endsWith(".js"))
    .map((relativePath) => read(relativePath))
    .join("\n");
  const currentContents = currentFiles.map((relativePath) => read(relativePath)).join("\n");
  const checklist = read("tests/validation_checklist.md");

  const phaseRecorded = includesAll(contents, [
    "v7.36 external remote-debug verification script plan",
    "current_head: a2fb6cb",
    "head_commit_short: a2fb6cb",
    "docs/187_v7_35_vcpchat_review_console_runtime_followup_planning.md",
    "v7.37 External Remote Debug Verification Script Authorization Gate"
  ]);

  const planningGoalRecorded = includesAll(currentContents, [
    "scripts/run_vcpchat_review_console_remote_debug_smoke.ps1",
    "script_created_by_this_phase: false",
    "target_head_short: b320e39",
    "Review Console bridge runtime surface"
  ]);

  const responsibilitiesRecorded = includesAll(currentContents, [
    "确认 VCPChat 分支、HEAD 和工作树状态",
    "确认 remote-debug 端口没有被占用",
    "只允许 Runtime.evaluate",
    "确认不会调用 bridge loadSession / previewDraft / submitDraft / cancel",
    "输出脱敏 JSON 结果"
  ]);

  const outputShapeRecorded = includesAll(currentContents, [
    "v7_36_external_remote_debug_verification_result",
    "target_repo_summary",
    "allowlist_methods_detected",
    "prototype_guard_summary",
    "sanitized_audit_summary_cn",
    "raw_local_root",
    "raw_cdp_endpoint",
    "raw_source_code"
  ]);

  const forbiddenActionsRecorded = includesAll(currentContents, [
    "dom_mutation_allowed: false",
    "navigation_allowed: false",
    "user_input_simulation_allowed: false",
    "plugin_call_allowed: false",
    "api_call_allowed: false",
    "daily_note_call_allowed: false",
    "vcp_memory_write_allowed: false",
    "image_creation_allowed: false",
    "vcpchat_remote_push_allowed: false"
  ]);

  const phaseBoundaryRecorded = includesAll(currentContents, [
    "app_launch_performed_by_this_phase: false",
    "remote_debug_used_by_this_phase: false",
    "cdp_endpoint_accessed_by_this_phase: false",
    "runtime_evaluate_performed_by_this_phase: false",
    "external_script_created_by_this_phase: false",
    "vcpchat_modified_by_this_phase: false",
    "bridge_load_session_called: false",
    "bridge_preview_draft_called: false",
    "bridge_submit_draft_called: false",
    "bridge_cancel_called: false",
    "plugin_called: false",
    "api_called: false",
    "daily_note_called: false",
    "vcp_memory_written: false",
    "image_created: false",
    "dependency_changed: false",
    "package_manifest_changed: false",
    "lockfile_changed: false",
    "vcpchat_pushed: false",
    "github_release_performed: false"
  ]);

  const forbiddenTrueKeys = [
    "app_launch_performed_by_this_phase",
    "remote_debug_used_by_this_phase",
    "cdp_endpoint_accessed_by_this_phase",
    "runtime_evaluate_performed_by_this_phase",
    "external_script_created_by_this_phase",
    "vcpchat_modified_by_this_phase",
    "vcpchat_formal_smoke_test_created_by_this_phase",
    "bridge_load_session_called",
    "bridge_preview_draft_called",
    "bridge_submit_draft_called",
    "bridge_cancel_called",
    "plugin_called",
    "api_called",
    "daily_note_called",
    "vcp_memory_written",
    "image_created",
    "dependency_changed",
    "package_manifest_changed",
    "lockfile_changed",
    "vcpchat_pushed",
    "github_release_performed"
  ];
  const noForbiddenTrue = excludesExactTrueFlags(currentContents, forbiddenTrueKeys);

  const noRawLocalPath = excludesAll(currentContents, [
    "A:\\VCP",
    "A:/VCP",
    "C:\\Users",
    "C:/Users"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v7.36 External Remote Debug Verification Script Plan 检查",
    "docs/188_v7_36_external_remote_debug_verification_script_plan.md",
    "review_console/embed_contract/vcpchat_external_remote_debug_verification_script_plan.md",
    "tests/schema_examples/v7_36_external_remote_debug_verification_script_plan.example.yaml",
    "scripts/validate_v7_36_external_remote_debug_verification_script_plan.js",
    "script_created_by_this_phase=false",
    "external_script_created_by_this_phase=false",
    "v7.37 External Remote Debug Verification Script Authorization Gate"
  ]);

  assert(phaseRecorded, "v7.36 phase must be recorded.");
  assert(planningGoalRecorded, "v7.36 planning goal must be recorded.");
  assert(responsibilitiesRecorded, "v7.36 future script responsibilities must be recorded.");
  assert(outputShapeRecorded, "v7.36 output shape must be recorded.");
  assert(forbiddenActionsRecorded, "v7.36 forbidden actions must be recorded.");
  assert(phaseBoundaryRecorded, "v7.36 phase boundary must be recorded.");
  assert(noForbiddenTrue, "v7.36 must not set execution flags to true.");
  assert(noRawLocalPath, "v7.36 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.36 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_36_external_remote_debug_verification_script_plan: {
      phase_recorded: phaseRecorded,
      planning_goal_recorded: planningGoalRecorded,
      responsibilities_recorded: responsibilitiesRecorded,
      output_shape_recorded: outputShapeRecorded,
      forbidden_actions_recorded: forbiddenActionsRecorded,
      phase_boundary_recorded: phaseBoundaryRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      script_created_by_this_phase: false,
      app_launch_performed_by_this_phase: false,
      next_safe_phase: "v7.37 External Remote Debug Verification Script Authorization Gate"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
