const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v7.2 vcpchat review console preload design gate";
const previousPhase = "v7.1 vcpchat preload surface read-only intake";
const currentHead = "cfffec3";
const nextPhase = "v7.3 VCPChat Review Console IPC Handler Design Gate";

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
    "docs/154_v7_2_vcpchat_review_console_preload_design_gate.md",
    "review_console/embed_contract/vcpchat_review_console_preload_design_gate.md",
    "tests/schema_examples/v7_2_vcpchat_review_console_preload_design_gate.example.yaml",
    "scripts/validate_v7_2_vcpchat_review_console_preload_design_gate.js",
    "tests/validation_checklist.md",
    "docs/153_v7_1_vcpchat_preload_surface_read_only_intake.md",
    "review_console/embed_contract/vcpchat_preload_surface_read_only_intake.md",
    "review_console/embed_contract/host_bridge_contract_v2.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v7.2 preload design gate evidence: ${missingFiles.join(", ")}`);

  const doc = read("docs/154_v7_2_vcpchat_review_console_preload_design_gate.md");
  const contract = read("review_console/embed_contract/vcpchat_review_console_preload_design_gate.md");
  const schema = read("tests/schema_examples/v7_2_vcpchat_review_console_preload_design_gate.example.yaml");
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

  const allowlistRecorded = includesAll(combined, [
    "api_name: imageLabReview",
    "must_not_reuse_broad_electronAPI: true",
    "must_not_expose_chatAPI_wholesale: true",
    "loadSession",
    "previewDraft",
    "submitDraft",
    "cancel",
    "imageLabReview.loadSession",
    "imageLabReview.previewDraft",
    "imageLabReview.submitDraft",
    "imageLabReview.cancel"
  ]);

  const payloadRecorded = includesAll(combined, [
    "channel_payload_contract",
    "review_session_seed",
    "image_case_seed",
    "memory_preview_seed",
    "prototype_guard",
    "review_session_draft",
    "image_case_draft",
    "memory_delta_draft",
    "host_submit_ack",
    "next_authorization_point",
    "side_effects_performed: false"
  ]);

  const forbiddenBindingsRecorded = includesAll(combined, [
    "sendToVCP: forbidden",
    "getFileAsBase64: forbidden",
    "getTextContent: forbidden",
    "writeTxtNote: forbidden",
    "savePastedImageToFile: forbidden",
    "desktopGetCredentials: forbidden",
    "executePythonCode: forbidden",
    "readImageFromClipboard: forbidden"
  ]);

  const implementationBlocked = includesAll(combined, [
    "implementation_allowed_now: false",
    "ipc_handler_creation_allowed_now: false",
    "preload_code_creation_allowed_now: false",
    "renderer_mount_creation_allowed_now: false",
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
    "side_effects_allowed"
  ];
  const noForbiddenTrue = excludesAll(
    combined,
    forbiddenTrueKeys.map((key) => `${key}: ${String(Boolean(1))}`)
  );

  const checklistCurrent = includesAll(checklist, [
    "## v7.2 VCPChat Review Console Preload Design Gate 检查",
    "docs/154_v7_2_vcpchat_review_console_preload_design_gate.md",
    "review_console/embed_contract/vcpchat_review_console_preload_design_gate.md",
    "tests/schema_examples/v7_2_vcpchat_review_console_preload_design_gate.example.yaml",
    "scripts/validate_v7_2_vcpchat_review_console_preload_design_gate.js",
    currentPhase,
    currentHead,
    "imageLabReview",
    "must_not_reuse_broad_electronAPI=true",
    "additional_vcpchat_read_performed=false",
    nextPhase
  ]);

  assert(baselineRecorded, "v7.2 must record current baseline and v7.1 context.");
  assert(allowlistRecorded, "v7.2 must record dedicated imageLabReview allowlist.");
  assert(payloadRecorded, "v7.2 must record channel payload contract.");
  assert(forbiddenBindingsRecorded, "v7.2 must record forbidden broad preload bindings.");
  assert(implementationBlocked, "v7.2 must keep implementation blocked.");
  assert(noForbiddenTrue, "v7.2 must not set forbidden read/write/execute/image flags to true.");
  assert(checklistCurrent, "validation checklist must include v7.2 checks.");

  const result = {
    passed: true,
    vcpchat_review_console_preload_design_gate: {
      version: "v7.2",
      current_phase: currentPhase,
      current_head: currentHead,
      previous_phase: previousPhase,
      recommended_next_phase: nextPhase,
      allowlist_recorded: allowlistRecorded,
      payload_contract_recorded: payloadRecorded,
      forbidden_bindings_recorded: forbiddenBindingsRecorded,
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
