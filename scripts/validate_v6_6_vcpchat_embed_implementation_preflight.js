const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v6.6 vcpchat embed implementation preflight";
const previousPhase = "v6.5 memory handoff runtime status";
const currentHead = "392701d";
const nextPhase = "v6.7 VCPChat Embed Minimal Patch Scope";

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
    "docs/148_v6_6_vcpchat_embed_implementation_preflight.md",
    "review_console/embed_contract/vcpchat_embed_implementation_preflight.md",
    "tests/schema_examples/v6_6_vcpchat_embed_implementation_preflight.example.yaml",
    "scripts/validate_v6_6_vcpchat_embed_implementation_preflight.js",
    "tests/validation_checklist.md",
    "docs/80_v2_1_vcpchat_embed_preflight.md",
    "docs/84_v2_1_real_vcpchat_read_authorization_request.md",
    "docs/145_v6_3_host_bridge_contract_v2.md",
    "docs/146_v6_4_adapter_review_console_roundtrip_fixture.md",
    "docs/147_v6_5_memory_handoff_runtime_status.md",
    "review_console/embed_contract/host_bridge_contract_v2.md",
    "review_console/embed_contract/memory_handoff_runtime_status.md",
    "review_console/runtime_prototype/FIELD_MAPPING.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v6.6 implementation preflight evidence: ${missingFiles.join(", ")}`);

  const doc = read("docs/148_v6_6_vcpchat_embed_implementation_preflight.md");
  const contract = read("review_console/embed_contract/vcpchat_embed_implementation_preflight.md");
  const schema = read("tests/schema_examples/v6_6_vcpchat_embed_implementation_preflight.example.yaml");
  const checklist = read("tests/validation_checklist.md");
  const combined = `${doc}\n${contract}\n${schema}`;

  const baselineRecorded = includesAll(combined, [
    currentPhase,
    previousPhase,
    `current_head: ${currentHead}`,
    `head_commit_short: ${currentHead}`,
    nextPhase,
    "preflight_only: true",
    "implementation_not_authorized_by_this_record: true",
    "no_runtime_code_change_required: true",
    "no_external_read_required: true",
    "no_ipc_or_preload_creation: true"
  ]);

  const evidenceRecorded = includesAll(combined, [
    "docs/80_v2_1_vcpchat_embed_preflight.md",
    "docs/84_v2_1_real_vcpchat_read_authorization_request.md",
    "docs/145_v6_3_host_bridge_contract_v2.md",
    "docs/146_v6_4_adapter_review_console_roundtrip_fixture.md",
    "docs/147_v6_5_memory_handoff_runtime_status.md",
    "review_console/embed_contract/host_bridge_contract_v2.md",
    "review_console/embed_contract/memory_handoff_runtime_status.md",
    "review_console/runtime_prototype/FIELD_MAPPING.md"
  ]);

  const preflightGateRecorded = includesAll(combined, [
    "implementation_preflight_gate",
    "implementation_task_authorized: false",
    "real_vcpchat_source_read_required_before_implementation: true",
    "real_vcpchat_source_read_authorized: false",
    "real_vcpchat_source_read_performed: false",
    "scope_fill_required: true",
    "scope_review_required: true",
    "final_human_authorization_required: true",
    "rollback_plan_required: true",
    "validation_plan_required: true",
    "user_owned_change_check_required: true"
  ]);

  const candidateRecorded = includesAll(combined, [
    "future_minimal_patch_candidate",
    "vcpchat_review_console_embed_minimal_patch",
    "candidate_status: planning_only",
    "target_files_allowed_now: []",
    "host_main_process_file_placeholder",
    "preload_bridge_file_placeholder",
    "renderer_mount_file_placeholder",
    "code_creation_allowed_now: false",
    "ipc_handler_creation_allowed_now: false",
    "preload_creation_allowed_now: false",
    "renderer_creation_allowed_now: false"
  ]);

  const securityRecorded = includesAll(combined, [
    "contextIsolation: true",
    "nodeIntegration: false",
    "preload_exposes_minimal_allowlist_only: true",
    "ipc_sender_validation_required: true",
    "origin_window_validation_required: true",
    "payload_schema_validation_required: true",
    "raw_ipc_payload_logging_allowed: false",
    "url_secret_transfer_blocked: false",
    "renderer_direct_side_effects_blocked: false"
  ]);

  const channelsRecorded = includesAll(combined, [
    "imageLabReview.loadSession",
    "imageLabReview.previewDraft",
    "imageLabReview.submitDraft",
    "imageLabReview.cancel"
  ]);

  const stopConditionsRecorded = includesAll(combined, [
    "real_vcpchat_source_path_missing",
    "user_owned_changes_detected_in_future_target",
    "ipc_or_preload_file_unclear",
    "secret_or_private_path_detected",
    "requested_action_can_call_plugin_api_or_daily_note"
  ]);

  const forbiddenTrueKeys = [
    "implementation_task_authorized",
    "real_vcpchat_source_read_authorized",
    "real_vcpchat_source_read_performed",
    "real_vcptoolbox_source_read_performed",
    "source_read_scope_filled",
    "source_read_scope_reviewed",
    "target_files_filled",
    "target_files_reviewed",
    "code_creation_allowed_now",
    "ipc_handler_creation_allowed_now",
    "preload_creation_allowed_now",
    "renderer_creation_allowed_now",
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
    "## v6.6 VCPChat Embed Implementation Preflight 检查",
    "docs/148_v6_6_vcpchat_embed_implementation_preflight.md",
    "review_console/embed_contract/vcpchat_embed_implementation_preflight.md",
    "tests/schema_examples/v6_6_vcpchat_embed_implementation_preflight.example.yaml",
    "scripts/validate_v6_6_vcpchat_embed_implementation_preflight.js",
    currentPhase,
    currentHead,
    "implementation_task_authorized=false",
    "target_files_allowed_now=[]",
    nextPhase
  ]);

  assert(baselineRecorded, "v6.6 must record current baseline and v6.5 context.");
  assert(evidenceRecorded, "v6.6 must record source evidence.");
  assert(preflightGateRecorded, "v6.6 must record implementation preflight gate.");
  assert(candidateRecorded, "v6.6 must record future minimal patch candidate without authorizing code.");
  assert(securityRecorded, "v6.6 must record Electron security preflight.");
  assert(channelsRecorded, "v6.6 must record host bridge channel names.");
  assert(stopConditionsRecorded, "v6.6 must record stop conditions.");
  assert(noForbiddenTrue, "v6.6 preflight must not set forbidden read/write/execute/image flags to true.");
  assert(checklistCurrent, "validation checklist must include v6.6 checks.");

  const result = {
    passed: true,
    vcpchat_embed_implementation_preflight: {
      version: "v6.6",
      current_phase: currentPhase,
      current_head: currentHead,
      previous_phase: previousPhase,
      recommended_next_phase: nextPhase,
      evidence_recorded: evidenceRecorded,
      preflight_gate_recorded: preflightGateRecorded,
      future_minimal_patch_candidate_recorded: candidateRecorded,
      electron_security_preflight_recorded: securityRecorded,
      host_bridge_channels_recorded: channelsRecorded,
      stop_conditions_recorded: stopConditionsRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      checklist_current: checklistCurrent,
      preflight_only: true,
      implementation_task_authorized: false,
      real_vcpchat_source_read: false,
      real_vcptoolbox_source_read: false,
      real_manifest_read: false,
      ipc_handler_created: false,
      preload_runtime_code_created: false,
      renderer_runtime_code_created: false,
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
