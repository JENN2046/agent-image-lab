const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v6.4 adapter review console runtime roundtrip fixture";
const previousPhase = "v6.3 host bridge contract v2";
const currentHead = "43dc358";
const nextPhase = "v6.5 Memory Handoff Runtime Status";

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
    "docs/146_v6_4_adapter_review_console_roundtrip_fixture.md",
    "review_console/embed_contract/adapter_review_console_roundtrip_fixture.md",
    "tests/schema_examples/v6_4_adapter_review_console_roundtrip_fixture.example.yaml",
    "scripts/validate_v6_4_adapter_review_console_roundtrip_fixture.js",
    "tests/validation_checklist.md",
    "docs/145_v6_3_host_bridge_contract_v2.md",
    "review_console/embed_contract/host_bridge_contract_v2.md",
    "integrations/vcp/adapter_runtime_contract.md",
    "integrations/vcp/vcp_dispatch_plan.schema.yaml",
    "tests/schema_examples/phase_d_adapter_dry_run_minimal.example.yaml",
    "tests/schema_examples/phase13_dry_run_dispatch_readiness.example.yaml",
    "tests/schema_examples/v5_2_adapter_delivery_surface.example.yaml",
    "tests/schema_examples/v5_3_review_console_adapter_handoff.example.yaml",
    "review_console/runtime_prototype/FIELD_MAPPING.md",
    "docs/144_v6_2_runtime_state_model_alignment.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v6.4 roundtrip fixture evidence: ${missingFiles.join(", ")}`);

  const doc = read("docs/146_v6_4_adapter_review_console_roundtrip_fixture.md");
  const contract = read("review_console/embed_contract/adapter_review_console_roundtrip_fixture.md");
  const schema = read("tests/schema_examples/v6_4_adapter_review_console_roundtrip_fixture.example.yaml");
  const checklist = read("tests/validation_checklist.md");
  const combined = `${doc}\n${contract}\n${schema}`;

  const baselineRecorded = includesAll(combined, [
    currentPhase,
    previousPhase,
    `current_head: ${currentHead}`,
    `head_commit_short: ${currentHead}`,
    nextPhase,
    "fixture_only: true",
    "implementation_not_authorized_by_this_record: true",
    "no_runtime_code_change_required: true",
    "no_external_read_required: true",
    "no_plugin_selection_allowed: true"
  ]);

  const evidenceRecorded = includesAll(combined, [
    "integrations/vcp/adapter_runtime_contract.md",
    "integrations/vcp/vcp_dispatch_plan.schema.yaml",
    "tests/schema_examples/phase_d_adapter_dry_run_minimal.example.yaml",
    "tests/schema_examples/phase13_dry_run_dispatch_readiness.example.yaml",
    "tests/schema_examples/v5_2_adapter_delivery_surface.example.yaml",
    "tests/schema_examples/v5_3_review_console_adapter_handoff.example.yaml",
    "review_console/embed_contract/host_bridge_contract_v2.md",
    "review_console/runtime_prototype/FIELD_MAPPING.md",
    "docs/144_v6_2_runtime_state_model_alignment.md",
    "docs/145_v6_3_host_bridge_contract_v2.md"
  ]);

  const flowRecorded = includesAll(combined, [
    "adapter_dry_run_input",
    "adapter_dry_run_dispatch",
    "gatekeeper_display_handoff",
    "review_console_display_handoff",
    "host_bridge_load_session",
    "runtime_draft_bundle_built",
    "host_bridge_preview_ack",
    "host_bridge_submit_ack",
    "task_panel_projection"
  ]);

  const mappingRecorded = includesAll(combined, [
    "adapter_to_review_session",
    "adapter_to_image_case",
    "adapter_to_memory_delta",
    "gatekeeper_to_task_panel",
    "host_ack_to_task_panel",
    "review_session_draft",
    "image_case_draft",
    "memory_delta_draft",
    "prototype_guard",
    "host_submit_ack",
    "task_panel_state"
  ]);

  const guardRecorded = includesAll(combined, [
    "selected_plugin: null",
    "max_plugin_calls: 0",
    "execution_blocked: true",
    "external_api_allowed: false",
    "allow_file_write: false",
    "allow_image_binary: false",
    "api_called: false",
    "vcp_plugin_called: false",
    "daily_note_called: false",
    "vcp_memory_written: false",
    "disk_write_performed: false",
    "image_file_created: false",
    "side_effects_performed: false",
    "real_execution_allowed: false",
    "real_vcpchat_source_read: false",
    "real_vcptoolbox_source_read: false",
    "real_manifest_read: false"
  ]);

  const forbiddenTrueKeys = [
    "real_vcpchat_source_read",
    "real_vcptoolbox_source_read",
    "real_manifest_read",
    "real_execution_allowed",
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
    "## v6.4 Adapter -> Review Console Runtime Roundtrip Fixture 检查",
    "docs/146_v6_4_adapter_review_console_roundtrip_fixture.md",
    "review_console/embed_contract/adapter_review_console_roundtrip_fixture.md",
    "tests/schema_examples/v6_4_adapter_review_console_roundtrip_fixture.example.yaml",
    "scripts/validate_v6_4_adapter_review_console_roundtrip_fixture.js",
    currentPhase,
    currentHead,
    "Adapter dry-run dispatch -> Gatekeeper handoff -> Review Console handoff -> Host Bridge Contract v2 -> runtime draft bundle -> Task Panel 状态",
    nextPhase
  ]);

  assert(baselineRecorded, "v6.4 must record current baseline and v6.3 context.");
  assert(evidenceRecorded, "v6.4 must record source evidence.");
  assert(flowRecorded, "v6.4 must record roundtrip flow.");
  assert(mappingRecorded, "v6.4 must record mapping rules.");
  assert(guardRecorded, "v6.4 must record no-execution roundtrip guard.");
  assert(noForbiddenTrue, "v6.4 fixture must not set forbidden execution/read/write/image flags to true.");
  assert(checklistCurrent, "validation checklist must include v6.4 checks.");

  const result = {
    passed: true,
    adapter_review_console_roundtrip_fixture: {
      version: "v6.4",
      current_phase: currentPhase,
      current_head: currentHead,
      previous_phase: previousPhase,
      recommended_next_phase: nextPhase,
      evidence_recorded: evidenceRecorded,
      flow_recorded: flowRecorded,
      mapping_recorded: mappingRecorded,
      guard_recorded: guardRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      checklist_current: checklistCurrent,
      fixture_only: true,
      selected_plugin: null,
      max_plugin_calls: 0,
      execution_blocked: true,
      external_api_allowed: false,
      api_called: false,
      vcp_plugin_called: false,
      daily_note_called: false,
      vcp_memory_written: false,
      image_file_created: false,
      side_effects_performed: false,
      real_execution_allowed: false,
      real_vcpchat_source_read: false,
      real_vcptoolbox_source_read: false,
      real_manifest_read: false
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
