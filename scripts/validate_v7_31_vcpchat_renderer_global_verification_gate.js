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
    "docs/183_v7_31_vcpchat_renderer_global_verification_gate.md",
    "review_console/embed_contract/vcpchat_renderer_global_verification_gate.md",
    "tests/schema_examples/v7_31_vcpchat_renderer_global_verification_gate.example.yaml",
    "scripts/validate_v7_31_vcpchat_renderer_global_verification_gate.js",
    "tests/validation_checklist.md",
    "docs/182_v7_30_vcpchat_runtime_smoke_test_partial_execution_record.md"
  ];
  const missing = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missing.length === 0, `Missing v7.31 renderer global verification gate files: ${missing.join(", ")}`);

  const currentFiles = [
    "docs/183_v7_31_vcpchat_renderer_global_verification_gate.md",
    "review_console/embed_contract/vcpchat_renderer_global_verification_gate.md",
    "tests/schema_examples/v7_31_vcpchat_renderer_global_verification_gate.example.yaml"
  ];
  const contents = requiredFiles
    .filter((relativePath) => !relativePath.endsWith(".js"))
    .map((relativePath) => read(relativePath))
    .join("\n");
  const currentContents = currentFiles.map((relativePath) => read(relativePath)).join("\n");
  const checklist = read("tests/validation_checklist.md");

  const phaseRecorded = includesAll(contents, [
    "v7.31 vcpchat renderer global verification gate",
    "current_head: 241965b",
    "head_commit_short: 241965b",
    "docs/182_v7_30_vcpchat_runtime_smoke_test_partial_execution_record.md",
    "v7.32 VCPChat One-time Remote Debug Runtime Verification Preflight"
  ]);

  const optionsRecorded = includesAll(currentContents, [
    "manual_devtools",
    "one_time_remote_debug",
    "reversible_local_test_harness",
    "reproducibility: low",
    "reproducibility: high",
    "modifies_vcpchat: true"
  ]);

  const recommendationRecorded = includesAll(currentContents, [
    "selected_strategy: one_time_remote_debug",
    "不修改 VCPChat",
    "比人工 DevTools 更可复现",
    "风险低于新增 test harness"
  ]);

  const scopeRecorded = includesAll(currentContents, [
    "window.imageLabReview",
    "window.imageLabReview.loadSession",
    "window.imageLabReview.previewDraft",
    "window.imageLabReview.submitDraft",
    "window.imageLabReview.cancel",
    "imageLabReviewMount",
    "window.imageLabReviewRuntime",
    "review_session_draft",
    "image_case_draft",
    "memory_delta_draft",
    "prototype_guard.api_called=false",
    "prototype_guard.image_file_created=false"
  ]);

  const sideEffectGuardRecorded = includesAll(currentContents, [
    "app_launch_performed_by_this_phase: false",
    "remote_debug_used_by_this_phase: false",
    "devtools_used_by_this_phase: false",
    "vcpchat_modified_by_this_phase: false",
    "test_harness_created_by_this_phase: false",
    "review_console_bridge_plugin_called: false",
    "review_console_bridge_api_called: false",
    "review_console_bridge_daily_note_called: false",
    "review_console_bridge_vcp_memory_written: false",
    "review_console_bridge_disk_write_performed: false",
    "review_console_bridge_image_created: false",
    "dependency_changed: false",
    "vcpchat_pushed: false"
  ]);

  const forbiddenTrueKeys = [
    "app_launch_performed_by_this_phase",
    "remote_debug_used_by_this_phase",
    "devtools_used_by_this_phase",
    "vcpchat_modified_by_this_phase",
    "test_harness_created_by_this_phase",
    "review_console_bridge_plugin_called",
    "review_console_bridge_api_called",
    "review_console_bridge_daily_note_called",
    "review_console_bridge_vcp_memory_written",
    "review_console_bridge_disk_write_performed",
    "review_console_bridge_image_created",
    "dependency_changed",
    "vcpchat_pushed"
  ];
  const noForbiddenTrue = excludesExactTrueFlags(currentContents, forbiddenTrueKeys);

  const noRawLocalPath = excludesAll(currentContents, [
    "A:\\VCP",
    "A:/VCP",
    "C:\\Users",
    "C:/Users"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v7.31 VCPChat Renderer Global Verification Gate 检查",
    "docs/183_v7_31_vcpchat_renderer_global_verification_gate.md",
    "review_console/embed_contract/vcpchat_renderer_global_verification_gate.md",
    "tests/schema_examples/v7_31_vcpchat_renderer_global_verification_gate.example.yaml",
    "scripts/validate_v7_31_vcpchat_renderer_global_verification_gate.js",
    "selected_strategy=one_time_remote_debug",
    "remote_debug_used_by_this_phase=false",
    "v7.32 VCPChat One-time Remote Debug Runtime Verification Preflight"
  ]);

  assert(phaseRecorded, "v7.31 phase must be recorded.");
  assert(optionsRecorded, "v7.31 options must be recorded.");
  assert(recommendationRecorded, "v7.31 recommendation must be recorded.");
  assert(scopeRecorded, "v7.31 verification scope must be recorded.");
  assert(sideEffectGuardRecorded, "v7.31 side effect guard must be recorded.");
  assert(noForbiddenTrue, "v7.31 must not set execution flags to true.");
  assert(noRawLocalPath, "v7.31 must not save raw local VCP or user paths.");
  assert(checklistCurrent, "validation checklist must include v7.31 checks.");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v7_31_renderer_global_verification_gate: {
      phase_recorded: phaseRecorded,
      options_recorded: optionsRecorded,
      recommendation_recorded: recommendationRecorded,
      scope_recorded: scopeRecorded,
      side_effect_guard_recorded: sideEffectGuardRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      no_raw_local_path: noRawLocalPath,
      checklist_current: checklistCurrent,
      selected_strategy: "one_time_remote_debug",
      app_launch_performed_by_this_phase: false,
      remote_debug_used_by_this_phase: false,
      vcpchat_modified_by_this_phase: false,
      next_safe_phase: "v7.32 VCPChat One-time Remote Debug Runtime Verification Preflight"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
