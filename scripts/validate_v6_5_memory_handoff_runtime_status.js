const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v6.5 memory handoff runtime status";
const previousPhase = "v6.4 adapter review console runtime roundtrip fixture";
const currentHead = "8ac78c7";
const nextPhase = "v6.6 VCPChat Embed Implementation Preflight";

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
    "docs/147_v6_5_memory_handoff_runtime_status.md",
    "review_console/embed_contract/memory_handoff_runtime_status.md",
    "tests/schema_examples/v6_5_memory_handoff_runtime_status.example.yaml",
    "scripts/validate_v6_5_memory_handoff_runtime_status.js",
    "tests/validation_checklist.md",
    "memory_policy/v1_3_daily_note_handoff_contract.md",
    "memory_policy/memory_delta.schema.yaml",
    "schemas/memory_delta.schema.yaml",
    "review_console/runtime_prototype/FIELD_MAPPING.md",
    "tests/schema_examples/v1_2_runtime_prototype_output.example.yaml",
    "tests/schema_examples/v1_3_memory_write_authorization_chain.example.yaml",
    "tests/schema_examples/phase15_memory_handoff_no_write.example.yaml",
    "tests/schema_examples/v6_4_adapter_review_console_roundtrip_fixture.example.yaml"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v6.5 memory handoff runtime status evidence: ${missingFiles.join(", ")}`);

  const doc = read("docs/147_v6_5_memory_handoff_runtime_status.md");
  const contract = read("review_console/embed_contract/memory_handoff_runtime_status.md");
  const schema = read("tests/schema_examples/v6_5_memory_handoff_runtime_status.example.yaml");
  const checklist = read("tests/validation_checklist.md");
  const combined = `${doc}\n${contract}\n${schema}`;

  const baselineRecorded = includesAll(combined, [
    currentPhase,
    previousPhase,
    `current_head: ${currentHead}`,
    `head_commit_short: ${currentHead}`,
    nextPhase,
    "status_only: true",
    "implementation_not_authorized_by_this_record: true",
    "no_runtime_code_change_required: true",
    "no_daily_note_write_allowed: true"
  ]);

  const evidenceRecorded = includesAll(combined, [
    "memory_policy/v1_3_daily_note_handoff_contract.md",
    "memory_policy/memory_delta.schema.yaml",
    "schemas/memory_delta.schema.yaml",
    "review_console/runtime_prototype/FIELD_MAPPING.md",
    "tests/schema_examples/v1_2_runtime_prototype_output.example.yaml",
    "tests/schema_examples/v1_3_memory_write_authorization_chain.example.yaml",
    "tests/schema_examples/phase15_memory_handoff_no_write.example.yaml",
    "tests/schema_examples/v6_4_adapter_review_console_roundtrip_fixture.example.yaml"
  ]);

  const flowRecorded = includesAll(combined, [
    "memory_preview_displayed",
    "memory_approval_reviewed",
    "memory_delta_draft_built",
    "write_request_status_projected",
    "archivist_review_pending",
    "imagelab_master_review_pending",
    "daily_note_preflight_blocked",
    "execution_audit_stub_no_write",
    "task_panel_memory_status_projected"
  ]);

  const routesRecorded = includesAll(combined, [
    "pending_memory_request",
    "approved_request_no_write",
    "forbidden_sensitive_rejection",
    "memory_delta.write_mode: draft",
    "memory_delta.write_mode: confirmed",
    "memory_delta.write_mode: forbidden",
    "should_write_to_vcp=true 只表示写入申请获批",
    "write_mode=confirmed 只表示审批不变量满足"
  ]);

  const noWriteGuardRecorded = includesAll(combined, [
    "daily_note_write_authorized: false",
    "daily_note_called: false",
    "vcp_memory_written: false",
    "actual_write_performed: false",
    "daily_note_write_proof_present: false",
    "disk_write_performed: false",
    "image_file_created: false",
    "image_binary_saved_to_memory: false",
    "raw_sensitive_content_saved: false",
    "preserved_original_contains_sensitive_text: false",
    "tags_contain_sensitive_text: false",
    "audit_log_contains_sensitive_text: false"
  ]);

  const forbiddenTrueKeys = [
    "daily_note_called",
    "vcp_memory_written",
    "actual_write_performed",
    "daily_note_write_proof_present",
    "disk_write_performed",
    "image_file_created",
    "raw_sensitive_content_saved",
    "api_called",
    "vcp_plugin_called",
    "real_vcpchat_source_read",
    "real_vcptoolbox_source_read",
    "real_manifest_read"
  ];
  const noForbiddenTrue = excludesAll(
    combined,
    forbiddenTrueKeys.map((key) => `${key}: ${String(Boolean(1))}`)
  );

  const checklistCurrent = includesAll(checklist, [
    "## v6.5 Memory Handoff Runtime Status 检查",
    "docs/147_v6_5_memory_handoff_runtime_status.md",
    "review_console/embed_contract/memory_handoff_runtime_status.md",
    "tests/schema_examples/v6_5_memory_handoff_runtime_status.example.yaml",
    "scripts/validate_v6_5_memory_handoff_runtime_status.js",
    currentPhase,
    currentHead,
    "pending_memory_request",
    "approved_request_no_write",
    "forbidden_sensitive_rejection",
    nextPhase
  ]);

  assert(baselineRecorded, "v6.5 must record current baseline and v6.4 context.");
  assert(evidenceRecorded, "v6.5 must record source evidence.");
  assert(flowRecorded, "v6.5 must record memory runtime status flow.");
  assert(routesRecorded, "v6.5 must record pending, approved no-write, and forbidden routes.");
  assert(noWriteGuardRecorded, "v6.5 must record no-write guard.");
  assert(noForbiddenTrue, "v6.5 status must not set forbidden write/read/execute/image flags to true.");
  assert(checklistCurrent, "validation checklist must include v6.5 checks.");

  const result = {
    passed: true,
    memory_handoff_runtime_status: {
      version: "v6.5",
      current_phase: currentPhase,
      current_head: currentHead,
      previous_phase: previousPhase,
      recommended_next_phase: nextPhase,
      evidence_recorded: evidenceRecorded,
      flow_recorded: flowRecorded,
      routes_recorded: routesRecorded,
      no_write_guard_recorded: noWriteGuardRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      checklist_current: checklistCurrent,
      status_only: true,
      daily_note_called: false,
      vcp_memory_written: false,
      actual_write_performed: false,
      daily_note_write_proof_present: false,
      image_file_created: false,
      api_called: false,
      vcp_plugin_called: false,
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
