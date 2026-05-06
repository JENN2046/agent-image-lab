const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v6.2 runtime state model alignment";
const previousPhase = "v6.1 runtime product surface audit";
const currentHead = "b2ab526";
const nextPhase = "v6.3 Host Bridge Contract v2";

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

function main() {
  const requiredFiles = [
    "docs/144_v6_2_runtime_state_model_alignment.md",
    "tests/schema_examples/v6_2_runtime_state_model_alignment.example.yaml",
    "scripts/validate_v6_2_runtime_state_model_alignment.js",
    "tests/validation_checklist.md",
    "docs/143_v6_1_runtime_product_surface_audit.md",
    "scripts/validate_v6_1_runtime_product_surface_audit.js",
    "review_console/runtime_prototype/FIELD_MAPPING.md",
    "tests/schema_examples/v1_2_runtime_prototype_output.example.yaml",
    "tests/schema_examples/v1_5_task_panel_state.example.yaml",
    "schemas/review_session.schema.yaml",
    "schemas/image_case.schema.yaml",
    "schemas/memory_delta.schema.yaml",
    "task_panel/task_panel_state.schema.yaml"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v6.2 runtime state model alignment evidence: ${missingFiles.join(", ")}`);

  const doc = read("docs/144_v6_2_runtime_state_model_alignment.md");
  const schema = read("tests/schema_examples/v6_2_runtime_state_model_alignment.example.yaml");
  const checklist = read("tests/validation_checklist.md");
  const combined = `${doc}\n${schema}`;

  const baselineRecorded = includesAll(combined, [
    currentPhase,
    previousPhase,
    `current_head: ${currentHead}`,
    `head_commit_short: ${currentHead}`,
    nextPhase,
    "implementation_not_authorized_by_this_record: true",
    "no_runtime_code_change_required: true",
    "no_external_read_required: true"
  ]);

  const evidenceRecorded = includesAll(combined, [
    "review_console/runtime_prototype/FIELD_MAPPING.md",
    "tests/schema_examples/v1_2_runtime_prototype_output.example.yaml",
    "tests/schema_examples/v1_5_task_panel_state.example.yaml",
    "schemas/review_session.schema.yaml",
    "schemas/image_case.schema.yaml",
    "schemas/memory_delta.schema.yaml",
    "task_panel/task_panel_state.schema.yaml",
    "docs/143_v6_1_runtime_product_surface_audit.md"
  ]);

  const flowRecorded = includesAll(combined, [
    "host_input_normalized",
    "review_session_draft_built",
    "image_case_draft_built",
    "memory_delta_draft_built",
    "prototype_guard_checked",
    "host_submit_ack_generated",
    "task_panel_state_projected",
    "review_session_draft",
    "image_case_draft",
    "memory_delta_draft",
    "prototype_guard",
    "host_submit_ack",
    "task_panel_state"
  ]);

  const alignmentRulesRecorded = includesAll(combined, [
    "ai_review_is_suggestion: true",
    "human_review_overrides_ai: true",
    "final_review_source_required: human_review",
    "accepted_requires_human_approval: true",
    "ai_archive_recommendation_is_final: false",
    "memory_preview_is_preview_only: true",
    "chinese_diary_content_required: true",
    "memory_approval_pending_maps_to_write_mode: draft",
    "memory_approval_rejected_maps_to_write_mode: forbidden",
    "memory_approval_approved_maps_to_write_mode: confirmed",
    "confirmed_is_write_request_not_daily_note_execution: true",
    "daily_note_called_by_runtime: false",
    "next_authorization_point_required: true",
    "guard_must_pass_before_host_ack: true",
    "side_effects_performed_must_be_false: true"
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

  const checklistCurrent = includesAll(checklist, [
    "## v6.2 Runtime State Model Alignment 检查",
    "docs/144_v6_2_runtime_state_model_alignment.md",
    "tests/schema_examples/v6_2_runtime_state_model_alignment.example.yaml",
    "scripts/validate_v6_2_runtime_state_model_alignment.js",
    currentPhase,
    currentHead,
    "review_session_draft -> image_case_draft -> memory_delta_draft -> task_panel_state -> prototype_guard -> host_submit_ack",
    nextPhase
  ]);

  assert(baselineRecorded, "v6.2 must record current baseline and v6.1 context.");
  assert(evidenceRecorded, "v6.2 must record source evidence.");
  assert(flowRecorded, "v6.2 must record runtime state flow.");
  assert(alignmentRulesRecorded, "v6.2 must record state alignment rules.");
  assert(boundariesPreserved, "v6.2 must preserve no-read, no-execution, no-runtime-code, no-release, no-image boundaries.");
  assert(checklistCurrent, "validation checklist must include v6.2 checks.");

  const result = {
    passed: true,
    runtime_state_model_alignment: {
      version: "v6.2",
      current_phase: currentPhase,
      current_head: currentHead,
      previous_phase: previousPhase,
      recommended_next_phase: nextPhase,
      evidence_recorded: evidenceRecorded,
      flow_recorded: flowRecorded,
      alignment_rules_recorded: alignmentRulesRecorded,
      boundaries_preserved: boundariesPreserved,
      checklist_current: checklistCurrent,
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
