const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v7.1 vcpchat preload surface read-only intake";
const previousPhase = "v7.0 vcpchat read-only intake sanitized record";
const currentHead = "d1bcf01";
const nextPhase = "v7.2 VCPChat Review Console Preload Design Gate";

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
    "docs/153_v7_1_vcpchat_preload_surface_read_only_intake.md",
    "review_console/embed_contract/vcpchat_preload_surface_read_only_intake.md",
    "tests/schema_examples/v7_1_vcpchat_preload_surface_read_only_intake.example.yaml",
    "scripts/validate_v7_1_vcpchat_preload_surface_read_only_intake.js",
    "tests/validation_checklist.md",
    "docs/152_v7_0_vcpchat_read_only_intake_sanitized_record.md",
    "review_console/embed_contract/vcpchat_read_only_intake_sanitized_record.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v7.1 preload surface intake evidence: ${missingFiles.join(", ")}`);

  const doc = read("docs/153_v7_1_vcpchat_preload_surface_read_only_intake.md");
  const contract = read("review_console/embed_contract/vcpchat_preload_surface_read_only_intake.md");
  const schema = read("tests/schema_examples/v7_1_vcpchat_preload_surface_read_only_intake.example.yaml");
  const checklist = read("tests/validation_checklist.md");
  const combined = `${doc}\n${contract}\n${schema}`;

  const baselineRecorded = includesAll(combined, [
    currentPhase,
    previousPhase,
    `current_head: ${currentHead}`,
    `head_commit_short: ${currentHead}`,
    nextPhase,
    "sanitized_record_only: true",
    "implementation_not_authorized_by_this_record: true"
  ]);

  const scopeRecorded = includesAll(combined, [
    "modules/services/preloadPaths.js",
    "preloads/shared/apiFactory.js",
    "preloads/shared/catalog.js",
    "preloads/shared/roles.js",
    "preloads/chat.js",
    "source_read_authorized: true",
    "authorized_preload_surface_observation_completed: true",
    "source_read_only: true",
    "source_write_performed: false"
  ]);

  const findingsRecorded = includesAll(combined, [
    "preload_role_resolver",
    "CHAT",
    "DESKTOP",
    "UTILITY",
    "api_factory",
    "createOps",
    "materializeApi",
    "createCompatApi",
    "exposeRoleApis",
    "chatAPI",
    "electronAPI",
    "imageLabReview_loadSession: false",
    "imageLabReview_previewDraft: false",
    "imageLabReview_submitDraft: false",
    "imageLabReview_cancel: false"
  ]);

  const designRecorded = includesAll(combined, [
    "review_console_should_not_reuse_broad_electron_api: true",
    "dedicated_review_console_allowlist",
    "recommended_future_api_name: imageLabReview",
    "imageLabReview.loadSession",
    "imageLabReview.previewDraft",
    "imageLabReview.submitDraft",
    "imageLabReview.cancel"
  ]);

  const sanitizerRecorded = includesAll(combined, [
    "raw_local_path_saved: false",
    "raw_source_code_copied: false",
    "env_file_read: false",
    "config_env_read: false",
    "secret_file_read: false",
    "token_or_cookie_read: false",
    "package_scripts_executed: false",
    "npm_install_executed: false",
    "plugin_called: false",
    "api_called: false",
    "daily_note_called: false",
    "vcp_memory_written: false",
    "image_file_created: false"
  ]);

  const forbiddenSubstrings = [
    `A:${"\\VCP"}`,
    `A:${"/VCP"}`,
    "config.env content",
    "API key value",
    "token value",
    "cookie value",
    "password value"
  ];
  const noRawSensitiveStrings = excludesAll(combined, forbiddenSubstrings);

  const forbiddenTrueKeys = [
    "source_write_performed",
    "raw_local_path_saved",
    "raw_source_code_copied",
    "env_file_read",
    "config_env_read",
    "secret_file_read",
    "token_or_cookie_read",
    "package_scripts_executed",
    "npm_install_executed",
    "plugin_called",
    "api_called",
    "daily_note_called",
    "vcp_memory_written",
    "image_file_created",
    "implementation_task_authorized",
    "implementation_allowed",
    "runtime_code_modified",
    "vcpchat_code_modified",
    "vcptoolbox_code_modified",
    "github_release_published",
    "release_assets_uploaded",
    "real_vcptoolbox_source_read",
    "real_manifest_read",
    "ipc_handler_created",
    "preload_runtime_code_created",
    "renderer_runtime_code_created",
    "adapter_execution_entrypoint_created",
    "disk_write_runtime_performed"
  ];
  const noForbiddenTrue = excludesAll(
    combined,
    forbiddenTrueKeys.map((key) => `${key}: ${String(Boolean(1))}`)
  );

  const checklistCurrent = includesAll(checklist, [
    "## v7.1 VCPChat Preload Surface Read-only Intake 检查",
    "docs/153_v7_1_vcpchat_preload_surface_read_only_intake.md",
    "review_console/embed_contract/vcpchat_preload_surface_read_only_intake.md",
    "tests/schema_examples/v7_1_vcpchat_preload_surface_read_only_intake.example.yaml",
    "scripts/validate_v7_1_vcpchat_preload_surface_read_only_intake.js",
    currentPhase,
    currentHead,
    "authorized_preload_surface_observation_completed=true",
    "source_write_performed=false",
    nextPhase
  ]);

  assert(baselineRecorded, "v7.1 must record current baseline and v7.0 context.");
  assert(scopeRecorded, "v7.1 must record authorized read scope.");
  assert(findingsRecorded, "v7.1 must record preload surface findings.");
  assert(designRecorded, "v7.1 must record design implications.");
  assert(sanitizerRecorded, "v7.1 must record sanitization guard.");
  assert(noRawSensitiveStrings, "v7.1 must not store raw private paths or secret-like raw values.");
  assert(noForbiddenTrue, "v7.1 must not set forbidden write/execute/image flags to true.");
  assert(checklistCurrent, "validation checklist must include v7.1 checks.");

  const result = {
    passed: true,
    vcpchat_preload_surface_read_only_intake: {
      version: "v7.1",
      current_phase: currentPhase,
      current_head: currentHead,
      previous_phase: previousPhase,
      recommended_next_phase: nextPhase,
      scope_recorded: scopeRecorded,
      findings_recorded: findingsRecorded,
      design_recorded: designRecorded,
      sanitization_guard_recorded: sanitizerRecorded,
      no_raw_sensitive_strings: noRawSensitiveStrings,
      no_forbidden_true_flags: noForbiddenTrue,
      checklist_current: checklistCurrent,
      source_read_authorized: true,
      authorized_preload_surface_observation_completed: true,
      source_write_performed: false,
      implementation_allowed: false,
      raw_local_path_saved: false,
      raw_source_code_copied: false,
      api_called: false,
      vcp_plugin_called: false,
      daily_note_called: false,
      image_file_created: false
    }
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
