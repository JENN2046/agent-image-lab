const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v7.3 vcpchat review console ipc handler design gate";
const previousPhase = "v7.2 vcpchat review console preload design gate";
const currentHead = "154993d";
const nextPhase = "v7.4 VCPChat Review Console Renderer Mount Design Gate";

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
    "docs/155_v7_3_vcpchat_review_console_ipc_handler_design_gate.md",
    "review_console/embed_contract/vcpchat_review_console_ipc_handler_design_gate.md",
    "tests/schema_examples/v7_3_vcpchat_review_console_ipc_handler_design_gate.example.yaml",
    "scripts/validate_v7_3_vcpchat_review_console_ipc_handler_design_gate.js",
    "tests/validation_checklist.md",
    "docs/154_v7_2_vcpchat_review_console_preload_design_gate.md",
    "review_console/embed_contract/vcpchat_review_console_preload_design_gate.md",
    "review_console/embed_contract/host_bridge_contract_v2.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v7.3 IPC handler design gate evidence: ${missingFiles.join(", ")}`);

  const doc = read("docs/155_v7_3_vcpchat_review_console_ipc_handler_design_gate.md");
  const contract = read("review_console/embed_contract/vcpchat_review_console_ipc_handler_design_gate.md");
  const schema = read("tests/schema_examples/v7_3_vcpchat_review_console_ipc_handler_design_gate.example.yaml");
  const checklist = read("tests/validation_checklist.md");
  const combined = `${doc}\n${contract}\n${schema}`;

  const baselineRecorded = includesAll(combined, [
    currentPhase,
    previousPhase,
    `current_head: ${currentHead}`,
    `head_commit_short: ${currentHead}`,
    nextPhase,
    "design_gate_only: true",
    "implementation_not_authorized_by_this_record: true",
    "no_runtime_code_change_required: true",
    "no_external_read_required: true",
    "no_vcpchat_write_allowed: true"
  ]);

  const channelAllowlistRecorded = includesAll(combined, [
    "ipc_channel_allowlist",
    "allowed_channels",
    "imageLabReview.loadSession",
    "imageLabReview.previewDraft",
    "imageLabReview.submitDraft",
    "imageLabReview.cancel",
    "wildcard_channel_allowed: false",
    "broad_passthrough_allowed: false"
  ]);

  const senderValidationRecorded = includesAll(combined, [
    "sender_validation_design",
    "registered_review_console_window",
    "sender_webcontents_matches_registered_window",
    "session_id_matches_host_registered_session",
    "request_correlation_id_present",
    "unknown_window",
    "arbitrary_renderer",
    "url_query_token_source",
    "hash_token_source",
    "return_sanitized_ack: true",
    "log_raw_payload: false"
  ]);

  const payloadValidationRecorded = includesAll(combined, [
    "payload_validation_design",
    "prototype_guard",
    "api_called: false",
    "vcp_plugin_called: false",
    "daily_note_called: false",
    "disk_write_performed: false",
    "image_file_created: false",
    "raw_source_code",
    "raw_private_path",
    "secret_or_token",
    "image_binary",
    "plugin_output_raw",
    "audit_summary_cn"
  ]);

  const ackContractRecorded = includesAll(combined, [
    "ack_contract",
    "ack_id",
    "request_id",
    "channel",
    "session_id",
    "accepted_by_handler",
    "validation_passed",
    "rejection_reason_cn",
    "side_effects_performed: false",
    "next_authorization_point"
  ]);

  const implementationBlocked = includesAll(combined, [
    "create_ipcMain_handle: false",
    "create_preload_bridge: false",
    "create_renderer_mount: false",
    "modify_vcpchat_source: false",
    "vcpchat_code_modified: false",
    "additional_vcpchat_read_performed: false"
  ]);

  const forbiddenTrueKeys = [
    "implementation_task_authorized",
    "implementation_allowed",
    "runtime_code_modified",
    "vcpchat_code_modified",
    "vcptoolbox_code_modified",
    "github_release_published",
    "release_assets_uploaded",
    "additional_vcpchat_read_performed",
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
    "image_file_created",
    "side_effects_allowed",
    "wildcard_channels_allowed",
    "wildcard_channel_allowed",
    "broad_passthrough_allowed",
    "unknown_sender_allowed",
    "raw_private_path_allowed",
    "url_query_secret_allowed",
    "hash_secret_allowed"
  ];
  const noForbiddenTrue = excludesAll(
    combined,
    forbiddenTrueKeys.map((key) => `${key}: ${String(Boolean(1))}`)
  );

  const checklistCurrent = includesAll(checklist, [
    "## v7.3 VCPChat Review Console IPC Handler Design Gate 检查",
    "docs/155_v7_3_vcpchat_review_console_ipc_handler_design_gate.md",
    "review_console/embed_contract/vcpchat_review_console_ipc_handler_design_gate.md",
    "tests/schema_examples/v7_3_vcpchat_review_console_ipc_handler_design_gate.example.yaml",
    "scripts/validate_v7_3_vcpchat_review_console_ipc_handler_design_gate.js",
    currentPhase,
    currentHead,
    "sender 校验",
    "payload 校验",
    "ack contract",
    "additional_vcpchat_read_performed=false",
    nextPhase
  ]);

  assert(baselineRecorded, "v7.3 must record current baseline and v7.2 context.");
  assert(channelAllowlistRecorded, "v7.3 must record dedicated IPC channel allowlist.");
  assert(senderValidationRecorded, "v7.3 must record sender validation design.");
  assert(payloadValidationRecorded, "v7.3 must record payload validation design.");
  assert(ackContractRecorded, "v7.3 must record ack contract.");
  assert(implementationBlocked, "v7.3 must keep implementation blocked.");
  assert(noForbiddenTrue, "v7.3 must not set forbidden read/write/execute/image flags to true.");
  assert(checklistCurrent, "validation checklist must include v7.3 checks.");

  const result = {
    passed: true,
    vcpchat_review_console_ipc_handler_design_gate: {
      version: "v7.3",
      current_phase: currentPhase,
      current_head: currentHead,
      previous_phase: previousPhase,
      recommended_next_phase: nextPhase,
      channel_allowlist_recorded: channelAllowlistRecorded,
      sender_validation_recorded: senderValidationRecorded,
      payload_validation_recorded: payloadValidationRecorded,
      ack_contract_recorded: ackContractRecorded,
      implementation_blocked: implementationBlocked,
      no_forbidden_true_flags: noForbiddenTrue,
      checklist_current: checklistCurrent,
      design_gate_only: true,
      implementation_allowed: false,
      additional_vcpchat_read_performed: false,
      vcpchat_code_modified: false,
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
