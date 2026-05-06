const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v6.3 host bridge contract v2";
const previousPhase = "v6.2 runtime state model alignment";
const currentHead = "abf0c1d";
const nextPhase = "v6.4 Adapter -> Review Console Runtime Roundtrip Fixture";

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
    "docs/145_v6_3_host_bridge_contract_v2.md",
    "review_console/embed_contract/host_bridge_contract_v2.md",
    "tests/schema_examples/v6_3_host_bridge_contract_v2.example.yaml",
    "scripts/validate_v6_3_host_bridge_contract_v2.js",
    "tests/validation_checklist.md",
    "docs/144_v6_2_runtime_state_model_alignment.md",
    "review_console/embed_contract/vcpchat_embed_contract.md",
    "review_console/embed_contract/review_console_runtime_handoff.md",
    "review_console/runtime_prototype/host_bridge_mock.js",
    "review_console/runtime_prototype/FIELD_MAPPING.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v6.3 host bridge contract v2 evidence: ${missingFiles.join(", ")}`);

  const doc = read("docs/145_v6_3_host_bridge_contract_v2.md");
  const contract = read("review_console/embed_contract/host_bridge_contract_v2.md");
  const schema = read("tests/schema_examples/v6_3_host_bridge_contract_v2.example.yaml");
  const checklist = read("tests/validation_checklist.md");
  const combined = `${doc}\n${contract}\n${schema}`;

  const baselineRecorded = includesAll(combined, [
    currentPhase,
    previousPhase,
    `current_head: ${currentHead}`,
    `head_commit_short: ${currentHead}`,
    nextPhase,
    "contract_only: true",
    "implementation_not_authorized_by_this_record: true",
    "no_runtime_code_change_required: true",
    "no_external_read_required: true",
    "no_ipc_or_preload_creation: true"
  ]);

  const evidenceRecorded = includesAll(combined, [
    "review_console/embed_contract/vcpchat_embed_contract.md",
    "review_console/embed_contract/review_console_runtime_handoff.md",
    "review_console/runtime_prototype/host_bridge_mock.js",
    "review_console/runtime_prototype/FIELD_MAPPING.md",
    "docs/144_v6_2_runtime_state_model_alignment.md",
    "tests/schema_examples/v1_2_runtime_prototype_output.example.yaml"
  ]);

  const channelAllowlistRecorded = includesAll(combined, [
    "imageLabReview.loadSession",
    "imageLabReview.previewDraft",
    "imageLabReview.submitDraft",
    "imageLabReview.cancel",
    "host_to_renderer",
    "renderer_to_host"
  ]);

  const methodContractsRecorded = includesAll(combined, [
    "loadSession:",
    "previewDraft:",
    "submitDraft:",
    "cancel:",
    "review_session_seed",
    "image_case_seed",
    "memory_preview_seed",
    "review_session_draft",
    "image_case_draft",
    "memory_delta_draft",
    "prototype_guard",
    "host_submit_ack",
    "next_authorization_point"
  ]);

  const securityRecorded = includesAll(combined, [
    "context_isolation_required: true",
    "context_isolation_expected_value: true",
    "node_integration_allowed: false",
    "node_integration_expected_value: false",
    "preload_allowlist_required: true",
    "ipc_sender_validation_required: true",
    "origin_window_validation_required: true",
    "ipc_channel_allowlist_required: true",
    "payload_schema_validation_required: true",
    "url_query_secret_transfer_allowed: false",
    "url_hash_secret_transfer_allowed: false",
    "raw_ipc_payload_logging_allowed: false"
  ]);

  const boundariesPreserved = includesAll(combined, [
    "runtime_code_modified: false",
    "tag_created: false",
    "package_created: false",
    "github_release_published: false",
    "release_assets_uploaded: false",
    "real_vcpchat_source_read: false",
    "real_vcptoolbox_source_read: false",
    "real_manifest_read: false",
    "ipc_handler_created: false",
    "preload_runtime_code_created: false",
    "renderer_runtime_code_created: false",
    "adapter_execution_entrypoint_created: false",
    "api_called: false",
    "vcp_plugin_called: false",
    "daily_note_called: false",
    "vcp_memory_written: false",
    "disk_write_runtime_performed: false",
    "image_file_created: false"
  ]);

  const forbiddenTrueKeys = [
    "real_vcpchat_source_read",
    "real_vcptoolbox_source_read",
    "real_manifest_read",
    "ipc_handler_created",
    "preload_runtime_code_created",
    "renderer_runtime_code_created",
    "api_called",
    "vcp_plugin_called",
    "daily_note_called",
    "vcp_memory_written",
    "image_file_created",
    "side_effects_performed"
  ];
  const noForbiddenTrue = excludesAll(
    combined,
    forbiddenTrueKeys.map((key) => `${key}: ${String(Boolean(1))}`)
  );

  const checklistCurrent = includesAll(checklist, [
    "## v6.3 Host Bridge Contract v2 检查",
    "docs/145_v6_3_host_bridge_contract_v2.md",
    "review_console/embed_contract/host_bridge_contract_v2.md",
    "tests/schema_examples/v6_3_host_bridge_contract_v2.example.yaml",
    "scripts/validate_v6_3_host_bridge_contract_v2.js",
    currentPhase,
    currentHead,
    "imageLabReview.loadSession",
    "imageLabReview.previewDraft",
    "imageLabReview.submitDraft",
    "imageLabReview.cancel",
    nextPhase
  ]);

  assert(baselineRecorded, "v6.3 must record current baseline and v6.2 context.");
  assert(evidenceRecorded, "v6.3 must record source evidence.");
  assert(channelAllowlistRecorded, "v6.3 must record channel allowlist.");
  assert(methodContractsRecorded, "v6.3 must record method contracts and draft bundle sections.");
  assert(securityRecorded, "v6.3 must record Electron security boundary.");
  assert(boundariesPreserved, "v6.3 must preserve no-read, no-execution, no-runtime-code, no-release, no-image boundaries.");
  assert(noForbiddenTrue, "v6.3 contract must not set forbidden execution/read/write/image flags to true.");
  assert(checklistCurrent, "validation checklist must include v6.3 checks.");

  const result = {
    passed: true,
    host_bridge_contract_v2: {
      version: "v6.3",
      current_phase: currentPhase,
      current_head: currentHead,
      previous_phase: previousPhase,
      recommended_next_phase: nextPhase,
      evidence_recorded: evidenceRecorded,
      channel_allowlist_recorded: channelAllowlistRecorded,
      method_contracts_recorded: methodContractsRecorded,
      security_recorded: securityRecorded,
      boundaries_preserved: boundariesPreserved,
      no_forbidden_true_flags: noForbiddenTrue,
      checklist_current: checklistCurrent,
      contract_only: true,
      runtime_code_modified: false,
      real_vcpchat_source_read: false,
      real_vcptoolbox_source_read: false,
      real_manifest_read: false,
      ipc_handler_created: false,
      preload_runtime_code_created: false,
      renderer_runtime_code_created: false,
      api_called: false,
      vcp_plugin_called: false,
      daily_note_called: false,
      vcp_memory_written: false,
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
