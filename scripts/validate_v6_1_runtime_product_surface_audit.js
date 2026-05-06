const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v6.1 runtime product surface audit";
const previousPhase = "v6.0 next milestone planning";
const currentHead = "926b2eb";
const nextPhase = "v6.2 Runtime State Model Alignment";

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
    "docs/143_v6_1_runtime_product_surface_audit.md",
    "tests/schema_examples/v6_1_runtime_product_surface_audit.example.yaml",
    "scripts/validate_v6_1_runtime_product_surface_audit.js",
    "tests/validation_checklist.md",
    "docs/142_v6_0_next_milestone_planning.md",
    "scripts/validate_v6_0_next_milestone_planning.js",
    "review_console/runtime_prototype/index.html",
    "review_console/runtime_prototype/styles.css",
    "review_console/runtime_prototype/runtime_guard.js",
    "review_console/runtime_prototype/host_bridge_mock.js",
    "review_console/runtime_prototype/app.js",
    "review_console/runtime_prototype/FIELD_MAPPING.md",
    "review_console/runtime_prototype/README.md",
    "scripts/validate_runtime_prototype_suite.js",
    "scripts/validate_runtime_delivery_surface.js",
    "scripts/validate_runtime_guard_unit.js",
    "scripts/validate_runtime_prototype_smoke.js",
    "docs/50_v2_0_productization_plan.md",
    "docs/70_v2_0_productization_baseline.md",
    "docs/128_v5_1_runtime_delivery_surface.md",
    "task_panel/task_panel_product_spec.md",
    "task_panel/task_panel_state.schema.yaml",
    "tests/schema_examples/v1_5_task_panel_state.example.yaml",
    "schemas/review_session.schema.yaml",
    "schemas/image_case.schema.yaml",
    "schemas/memory_delta.schema.yaml"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v6.1 runtime product surface audit evidence: ${missingFiles.join(", ")}`);

  const doc = read("docs/143_v6_1_runtime_product_surface_audit.md");
  const schema = read("tests/schema_examples/v6_1_runtime_product_surface_audit.example.yaml");
  const checklist = read("tests/validation_checklist.md");
  const combined = `${doc}\n${schema}`;

  const baselineRecorded = includesAll(combined, [
    currentPhase,
    previousPhase,
    `current_head: ${currentHead}`,
    `head_commit_short: ${currentHead}`,
    nextPhase,
    "can_enter_product_surface_planning: true",
    "implementation_not_authorized_by_this_record: true"
  ]);

  const evidenceRecorded = includesAll(combined, [
    "review_console/runtime_prototype/index.html",
    "review_console/runtime_prototype/styles.css",
    "review_console/runtime_prototype/runtime_guard.js",
    "review_console/runtime_prototype/host_bridge_mock.js",
    "review_console/runtime_prototype/app.js",
    "review_console/runtime_prototype/FIELD_MAPPING.md",
    "review_console/runtime_prototype/README.md",
    "scripts/validate_runtime_prototype_suite.js",
    "scripts/validate_runtime_delivery_surface.js",
    "scripts/validate_runtime_guard_unit.js",
    "scripts/validate_runtime_prototype_smoke.js",
    "task_panel/task_panel_product_spec.md",
    "task_panel/task_panel_state.schema.yaml",
    "schemas/review_session.schema.yaml",
    "schemas/image_case.schema.yaml",
    "schemas/memory_delta.schema.yaml"
  ]);

  const surfacesRecorded = includesAll(combined, [
    "product_surface_status: audit_ready_project_local",
    "browser_runtime_shell",
    "project_local_prototype",
    "shared_runtime_guard",
    "reusable_project_local_guard",
    "host_bridge_mock",
    "project_local_mock",
    "draft_field_mapping",
    "schema_mapping_reference",
    "runtime_validation_suite",
    "reusable_local_validation",
    "task_panel_status_backbone",
    "planning_surface_ready",
    "schema_contract_surface",
    "schema_reference_ready",
    "embed_contract_preflight_surface",
    "preflight_documentation_ready"
  ]);

  const notRuntimeYetRecorded = includesAll(combined, [
    "real_vcpchat_window",
    "real_ipc_preload_renderer_integration",
    "dailynote_executor",
    "plugin_executor",
    "image_binary_asset_store",
    "release_publication_automation"
  ]);

  const auditResultRecorded = includesAll(combined, [
    "runtime_product_surface_audit_passed: true",
    "can_use_runtime_prototype_as_product_surface_reference: true",
    "can_use_task_panel_as_status_surface_reference: true",
    "can_use_schema_as_draft_contract_reference: true",
    "can_use_runtime_validation_suite_for_future_local_patches: true",
    "can_start_real_vcpchat_integration_now: false",
    "can_create_ipc_preload_renderer_now: false",
    "can_call_plugin_or_api_now: false",
    "can_write_dailynote_or_vcp_memory_now: false"
  ]);

  const boundariesPreserved = includesAll(combined, [
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
    "## v6.1 Runtime Product Surface Audit 检查",
    "docs/143_v6_1_runtime_product_surface_audit.md",
    "tests/schema_examples/v6_1_runtime_product_surface_audit.example.yaml",
    "scripts/validate_v6_1_runtime_product_surface_audit.js",
    currentPhase,
    currentHead,
    "browser_runtime_shell",
    "shared_runtime_guard",
    "host_bridge_mock",
    "runtime_validation_suite",
    "task_panel_status_backbone",
    nextPhase
  ]);

  assert(baselineRecorded, "v6.1 must record current baseline and v6.0 context.");
  assert(evidenceRecorded, "v6.1 must record runtime, validation, task panel, and schema evidence.");
  assert(surfacesRecorded, "v6.1 must record audited product surfaces.");
  assert(notRuntimeYetRecorded, "v6.1 must record surfaces that are not product runtime yet.");
  assert(auditResultRecorded, "v6.1 must record audit result.");
  assert(boundariesPreserved, "v6.1 must preserve no-read, no-execution, no-release, no-image boundaries.");
  assert(checklistCurrent, "validation checklist must include v6.1 checks.");

  const result = {
    passed: true,
    runtime_product_surface_audit: {
      version: "v6.1",
      current_phase: currentPhase,
      current_head: currentHead,
      previous_phase: previousPhase,
      recommended_next_phase: nextPhase,
      evidence_recorded: evidenceRecorded,
      audited_surfaces_recorded: surfacesRecorded,
      not_runtime_yet_recorded: notRuntimeYetRecorded,
      audit_result_recorded: auditResultRecorded,
      boundaries_preserved: boundariesPreserved,
      checklist_current: checklistCurrent,
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
