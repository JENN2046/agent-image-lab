const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v7.4 vcpchat review console renderer mount design gate";
const previousPhase = "v7.3 vcpchat review console ipc handler design gate";
const currentHead = "856e7a8";
const nextPhase = "v7.5 VCPChat Review Console Runtime Integration Authorization Gate";

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
    "docs/156_v7_4_vcpchat_review_console_renderer_mount_design_gate.md",
    "review_console/embed_contract/vcpchat_review_console_renderer_mount_design_gate.md",
    "tests/schema_examples/v7_4_vcpchat_review_console_renderer_mount_design_gate.example.yaml",
    "scripts/validate_v7_4_vcpchat_review_console_renderer_mount_design_gate.js",
    "tests/validation_checklist.md",
    "docs/155_v7_3_vcpchat_review_console_ipc_handler_design_gate.md",
    "review_console/embed_contract/vcpchat_review_console_ipc_handler_design_gate.md",
    "review_console/embed_contract/vcpchat_review_console_preload_design_gate.md",
    "review_console/runtime_prototype/README.md",
    "review_console/runtime_prototype/FIELD_MAPPING.md",
    "review_console/runtime_prototype/runtime_guard.js",
    "review_console/runtime_prototype/host_bridge_mock.js"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v7.4 renderer mount design gate evidence: ${missingFiles.join(", ")}`);

  const doc = read("docs/156_v7_4_vcpchat_review_console_renderer_mount_design_gate.md");
  const contract = read("review_console/embed_contract/vcpchat_review_console_renderer_mount_design_gate.md");
  const schema = read("tests/schema_examples/v7_4_vcpchat_review_console_renderer_mount_design_gate.example.yaml");
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

  const rendererMountRecorded = includesAll(combined, [
    "renderer_mount_boundary",
    "future_renderer_global_dependency: imageLabReview",
    "future_mount_root_id: image-lab-review-root",
    "isolated_review_console_surface",
    "auto_mount_into_chat_surface_allowed: false",
    "broad_dom_scraping_allowed: false",
    "direct_vcpchat_state_mutation_allowed: false",
    "direct_file_system_access_allowed: false",
    "direct_daily_note_access_allowed: false",
    "direct_plugin_access_allowed: false"
  ]);

  const hostBridgeMockRecorded = includesAll(combined, [
    "host_bridge_mock_boundary",
    "review_console/runtime_prototype/host_bridge_mock.js",
    "future_real_bridge_global_name: imageLabReview",
    "loadSession: imageLabReview.loadSession",
    "previewDraft: imageLabReview.previewDraft",
    "submitDraft: imageLabReview.submitDraft",
    "cancel: imageLabReview.cancel",
    "mock_side_effects_allowed: false",
    "real_bridge_side_effects_allowed: false"
  ]);

  const runtimeContractRecorded = includesAll(combined, [
    "runtime_input_contract",
    "runtime_output_contract",
    "review_session_seed",
    "image_case_seed",
    "memory_preview_seed",
    "prototype_guard",
    "review_session_draft",
    "image_case_draft",
    "memory_delta_draft",
    "requested_route",
    "side_effects_performed: false"
  ]);

  const runtimeGuardRecorded = includesAll(combined, [
    "runtime_guard_boundary",
    "review_console/runtime_prototype/runtime_guard.js",
    "api_called: false",
    "vcp_plugin_called: false",
    "daily_note_called: false",
    "disk_write_performed: false",
    "image_file_created: false",
    "human_review_overrides_ai_review: true",
    "accepted_requires_human_approval: true",
    "memory_approval_not_approved_keeps_draft: true",
    "memory_preview_chinese_required: true"
  ]);

  const implementationBlocked = includesAll(combined, [
    "create_renderer_mount_code: false",
    "create_preload_bridge: false",
    "create_ipcMain_handle: false",
    "modify_vcpchat_source: false",
    "read_additional_vcpchat_source: false",
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
    "auto_mount_into_chat_surface_allowed",
    "broad_dom_scraping_allowed",
    "chat_history_access_allowed",
    "direct_vcpchat_state_mutation_allowed",
    "direct_file_system_access_allowed",
    "direct_daily_note_access_allowed",
    "direct_plugin_access_allowed"
  ];
  const noForbiddenTrue = excludesAll(
    combined,
    forbiddenTrueKeys.map((key) => `${key}: ${String(Boolean(1))}`)
  );

  const checklistCurrent = includesAll(checklist, [
    "## v7.4 VCPChat Review Console Renderer Mount Design Gate 检查",
    "docs/156_v7_4_vcpchat_review_console_renderer_mount_design_gate.md",
    "review_console/embed_contract/vcpchat_review_console_renderer_mount_design_gate.md",
    "tests/schema_examples/v7_4_vcpchat_review_console_renderer_mount_design_gate.example.yaml",
    "scripts/validate_v7_4_vcpchat_review_console_renderer_mount_design_gate.js",
    currentPhase,
    currentHead,
    "renderer mount",
    "host bridge mock",
    "runtime 挂载边界",
    "additional_vcpchat_read_performed=false",
    nextPhase
  ]);

  assert(baselineRecorded, "v7.4 must record current baseline and v7.3 context.");
  assert(rendererMountRecorded, "v7.4 must record renderer mount boundary.");
  assert(hostBridgeMockRecorded, "v7.4 must record host bridge mock boundary.");
  assert(runtimeContractRecorded, "v7.4 must record runtime input/output contract.");
  assert(runtimeGuardRecorded, "v7.4 must record runtime guard boundary.");
  assert(implementationBlocked, "v7.4 must keep implementation blocked.");
  assert(noForbiddenTrue, "v7.4 must not set forbidden read/write/execute/image flags to true.");
  assert(checklistCurrent, "validation checklist must include v7.4 checks.");

  const result = {
    passed: true,
    vcpchat_review_console_renderer_mount_design_gate: {
      version: "v7.4",
      current_phase: currentPhase,
      current_head: currentHead,
      previous_phase: previousPhase,
      recommended_next_phase: nextPhase,
      renderer_mount_recorded: rendererMountRecorded,
      host_bridge_mock_recorded: hostBridgeMockRecorded,
      runtime_contract_recorded: runtimeContractRecorded,
      runtime_guard_recorded: runtimeGuardRecorded,
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
