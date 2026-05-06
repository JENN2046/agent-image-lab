const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v6.9 vcpchat embed implementation authorization request";
const previousPhase = "v6.8 vcpchat embed scope review gate";
const currentHead = "5e9c03e";
const nextPhase = "v7.0 First VCPChat Embed Runtime Patch Hard Authorization";

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
    "docs/151_v6_9_vcpchat_embed_implementation_authorization_request.md",
    "review_console/embed_contract/vcpchat_embed_implementation_authorization_request.md",
    "tests/schema_examples/v6_9_vcpchat_embed_implementation_authorization_request.example.yaml",
    "scripts/validate_v6_9_vcpchat_embed_implementation_authorization_request.js",
    "tests/validation_checklist.md",
    "docs/150_v6_8_vcpchat_embed_scope_review_gate.md",
    "review_console/embed_contract/vcpchat_embed_scope_review_gate.md",
    "docs/149_v6_7_vcpchat_embed_minimal_patch_scope.md",
    "review_console/embed_contract/vcpchat_embed_minimal_patch_scope.md",
    "docs/148_v6_6_vcpchat_embed_implementation_preflight.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v6.9 implementation authorization request evidence: ${missingFiles.join(", ")}`);

  const doc = read("docs/151_v6_9_vcpchat_embed_implementation_authorization_request.md");
  const contract = read("review_console/embed_contract/vcpchat_embed_implementation_authorization_request.md");
  const schema = read("tests/schema_examples/v6_9_vcpchat_embed_implementation_authorization_request.example.yaml");
  const checklist = read("tests/validation_checklist.md");
  const combined = `${doc}\n${contract}\n${schema}`;

  const baselineRecorded = includesAll(combined, [
    currentPhase,
    previousPhase,
    `current_head: ${currentHead}`,
    `head_commit_short: ${currentHead}`,
    nextPhase,
    "authorization_template_only: true",
    "implementation_not_authorized_by_this_record: true",
    "no_runtime_code_change_required: true",
    "no_external_read_required: true",
    "no_real_target_path_filled: true"
  ]);

  const evidenceRecorded = includesAll(combined, [
    "docs/150_v6_8_vcpchat_embed_scope_review_gate.md",
    "review_console/embed_contract/vcpchat_embed_scope_review_gate.md",
    "docs/149_v6_7_vcpchat_embed_minimal_patch_scope.md",
    "review_console/embed_contract/vcpchat_embed_minimal_patch_scope.md",
    "docs/148_v6_6_vcpchat_embed_implementation_preflight.md"
  ]);

  const templateRecorded = includesAll(combined, [
    "authorization_request_template",
    "authorization_request_id: v6-9-implementation-request-placeholder",
    "request_status: template_only_not_submitted",
    "requested_patch_name: vcpchat_review_console_embed_minimal_patch",
    "requested_real_target_paths_redacted: []",
    "raw_real_paths_stored: false",
    "requested_commands: []",
    "requested_write_scope: []",
    "requested_validation_commands: []",
    "implementation_authorization_granted: false",
    "implementation_allowed: false"
  ]);

  const prerequisitesRecorded = includesAll(combined, [
    "required_before_submission",
    "real_vcpchat_source_read_authorized: false",
    "real_vcpchat_source_read_completed: false",
    "sanitized_source_notes_available: false",
    "scope_request_filled: false",
    "scope_review_passed: false",
    "target_paths_redacted_and_reviewed: false",
    "user_owned_change_check_passed: false",
    "rollback_plan_reviewed: false",
    "validation_plan_reviewed: false",
    "electron_security_review_ready: false"
  ]);

  const humanChecklistRecorded = includesAll(combined, [
    "human_authorization_checklist",
    "must_name_repository: true",
    "must_name_branch: true",
    "must_name_exact_files_or_redacted_paths: true",
    "must_name_allowed_commands: true",
    "must_name_forbidden_commands: true",
    "must_name_validation_commands: true",
    "must_name_rollback_plan: true",
    "must_confirm_no_secret_copy: true",
    "must_confirm_no_plugin_api_daily_note_call: true",
    "must_confirm_no_image_creation: true",
    "must_confirm_user_owned_change_policy: true"
  ]);

  const hardStopRecorded = includesAll(combined, [
    "hard_stop_boundary",
    "next_phase_requires_explicit_hard_authorization: true",
    "current_record_authorizes_code_creation: false",
    "current_record_authorizes_source_read: false",
    "current_record_authorizes_remote_release: false",
    "v7.0 必须作为独立硬授权点"
  ]);

  const forbiddenTrueKeys = [
    "request_submitted",
    "implementation_authorization_granted",
    "implementation_allowed",
    "real_vcpchat_source_read_authorized",
    "real_vcpchat_source_read_completed",
    "sanitized_source_notes_available",
    "scope_request_filled",
    "scope_review_passed",
    "target_paths_redacted_and_reviewed",
    "user_owned_change_check_passed",
    "rollback_plan_reviewed",
    "validation_plan_reviewed",
    "electron_security_review_ready",
    "implementation_task_authorized",
    "runtime_code_modified",
    "adapter_code_modified",
    "github_release_published",
    "release_assets_uploaded",
    "real_vcpchat_source_read",
    "real_vcptoolbox_source_read",
    "real_manifest_read",
    "ipc_handler_created",
    "preload_runtime_code_created",
    "renderer_runtime_code_created",
    "adapter_execution_entrypoint_created",
    "api_called",
    "vcp_plugin_called",
    "daily_note_called",
    "vcp_memory_written",
    "disk_write_runtime_performed",
    "image_file_created"
  ];
  const noForbiddenTrue = excludesAll(
    combined,
    forbiddenTrueKeys.map((key) => `${key}: ${String(Boolean(1))}`)
  );

  const checklistCurrent = includesAll(checklist, [
    "## v6.9 VCPChat Embed Implementation Authorization Request 检查",
    "docs/151_v6_9_vcpchat_embed_implementation_authorization_request.md",
    "review_console/embed_contract/vcpchat_embed_implementation_authorization_request.md",
    "tests/schema_examples/v6_9_vcpchat_embed_implementation_authorization_request.example.yaml",
    "scripts/validate_v6_9_vcpchat_embed_implementation_authorization_request.js",
    currentPhase,
    currentHead,
    "authorization_template_only=true",
    "implementation_authorization_granted=false",
    "next_phase_requires_explicit_hard_authorization=true",
    nextPhase
  ]);

  assert(baselineRecorded, "v6.9 must record current baseline and v6.8 context.");
  assert(evidenceRecorded, "v6.9 must record source evidence.");
  assert(templateRecorded, "v6.9 must record authorization request template.");
  assert(prerequisitesRecorded, "v6.9 must record required prerequisites before submission.");
  assert(humanChecklistRecorded, "v6.9 must record human authorization checklist.");
  assert(hardStopRecorded, "v6.9 must record hard stop boundary.");
  assert(noForbiddenTrue, "v6.9 template must not set forbidden read/write/execute/image flags to true.");
  assert(checklistCurrent, "validation checklist must include v6.9 checks.");

  const result = {
    passed: true,
    vcpchat_embed_implementation_authorization_request: {
      version: "v6.9",
      current_phase: currentPhase,
      current_head: currentHead,
      previous_phase: previousPhase,
      recommended_next_phase: nextPhase,
      evidence_recorded: evidenceRecorded,
      authorization_template_recorded: templateRecorded,
      prerequisites_recorded: prerequisitesRecorded,
      human_checklist_recorded: humanChecklistRecorded,
      hard_stop_recorded: hardStopRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      checklist_current: checklistCurrent,
      authorization_template_only: true,
      implementation_authorization_granted: false,
      implementation_allowed: false,
      real_vcpchat_source_read: false,
      real_vcptoolbox_source_read: false,
      ipc_handler_created: false,
      preload_runtime_code_created: false,
      renderer_runtime_code_created: false,
      api_called: false,
      vcp_plugin_called: false,
      daily_note_called: false,
      image_file_created: false,
      next_phase_requires_explicit_hard_authorization: true
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
