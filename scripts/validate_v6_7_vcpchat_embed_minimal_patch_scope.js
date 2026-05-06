const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v6.7 vcpchat embed minimal patch scope";
const previousPhase = "v6.6 vcpchat embed implementation preflight";
const currentHead = "01859d3";
const nextPhase = "v6.8 VCPChat Embed Scope Review Gate";

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
    "docs/149_v6_7_vcpchat_embed_minimal_patch_scope.md",
    "review_console/embed_contract/vcpchat_embed_minimal_patch_scope.md",
    "tests/schema_examples/v6_7_vcpchat_embed_minimal_patch_scope.example.yaml",
    "scripts/validate_v6_7_vcpchat_embed_minimal_patch_scope.js",
    "tests/validation_checklist.md",
    "docs/148_v6_6_vcpchat_embed_implementation_preflight.md",
    "review_console/embed_contract/vcpchat_embed_implementation_preflight.md",
    "review_console/embed_contract/host_bridge_contract_v2.md",
    "review_console/embed_contract/memory_handoff_runtime_status.md",
    "review_console/runtime_prototype/FIELD_MAPPING.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v6.7 minimal patch scope evidence: ${missingFiles.join(", ")}`);

  const doc = read("docs/149_v6_7_vcpchat_embed_minimal_patch_scope.md");
  const contract = read("review_console/embed_contract/vcpchat_embed_minimal_patch_scope.md");
  const schema = read("tests/schema_examples/v6_7_vcpchat_embed_minimal_patch_scope.example.yaml");
  const checklist = read("tests/validation_checklist.md");
  const combined = `${doc}\n${contract}\n${schema}`;

  const baselineRecorded = includesAll(combined, [
    currentPhase,
    previousPhase,
    `current_head: ${currentHead}`,
    `head_commit_short: ${currentHead}`,
    nextPhase,
    "scope_only: true",
    "implementation_not_authorized_by_this_record: true",
    "no_runtime_code_change_required: true",
    "no_external_read_required: true",
    "no_real_target_path_filled: true"
  ]);

  const evidenceRecorded = includesAll(combined, [
    "docs/148_v6_6_vcpchat_embed_implementation_preflight.md",
    "review_console/embed_contract/vcpchat_embed_implementation_preflight.md",
    "review_console/embed_contract/host_bridge_contract_v2.md",
    "review_console/embed_contract/memory_handoff_runtime_status.md",
    "review_console/runtime_prototype/FIELD_MAPPING.md"
  ]);

  const scopeTemplateRecorded = includesAll(combined, [
    "minimal_patch_scope_template",
    "scope_status: placeholder_only",
    "source_read_authorized: false",
    "source_read_performed: false",
    "real_vcpchat_root_filled: false",
    "real_target_paths_filled: false",
    "target_files_allowed_now: []",
    "host_main_process",
    "preload_bridge",
    "renderer_mount",
    "static_asset_reference"
  ]);

  const futureShapeRecorded = includesAll(combined, [
    "allowed_future_change_shape",
    "minimal_embed_wiring",
    "受控 IPC channel allowlist",
    "preload 最小 API 映射",
    "Review Console runtime 的嵌入入口",
    "host_submit_ack 的无副作用返回路径",
    "大范围重构 VCPChat"
  ]);

  const reviewFieldsRecorded = includesAll(combined, [
    "required_future_review_fields",
    "scope_request_id",
    "candidate_target_category",
    "real_target_path_redacted",
    "raw_real_path_stored: false",
    "intended_change_cn",
    "rollback_method_cn",
    "validation_commands",
    "implementation_allowed: false"
  ]);

  const forbiddenTrueKeys = [
    "implementation_allowed",
    "source_read_authorized",
    "source_read_performed",
    "real_vcpchat_root_filled",
    "real_target_paths_filled",
    "raw_source_copy_allowed",
    "raw_private_path_stored",
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
    "## v6.7 VCPChat Embed Minimal Patch Scope 检查",
    "docs/149_v6_7_vcpchat_embed_minimal_patch_scope.md",
    "review_console/embed_contract/vcpchat_embed_minimal_patch_scope.md",
    "tests/schema_examples/v6_7_vcpchat_embed_minimal_patch_scope.example.yaml",
    "scripts/validate_v6_7_vcpchat_embed_minimal_patch_scope.js",
    currentPhase,
    currentHead,
    "source_read_authorized=false",
    "real_target_paths_filled=false",
    "target_files_allowed_now=[]",
    nextPhase
  ]);

  assert(baselineRecorded, "v6.7 must record current baseline and v6.6 context.");
  assert(evidenceRecorded, "v6.7 must record source evidence.");
  assert(scopeTemplateRecorded, "v6.7 must record minimal patch scope template.");
  assert(futureShapeRecorded, "v6.7 must record allowed future change shape.");
  assert(reviewFieldsRecorded, "v6.7 must record future review fields.");
  assert(noForbiddenTrue, "v6.7 scope must not set forbidden read/write/execute/image flags to true.");
  assert(checklistCurrent, "validation checklist must include v6.7 checks.");

  const result = {
    passed: true,
    vcpchat_embed_minimal_patch_scope: {
      version: "v6.7",
      current_phase: currentPhase,
      current_head: currentHead,
      previous_phase: previousPhase,
      recommended_next_phase: nextPhase,
      evidence_recorded: evidenceRecorded,
      scope_template_recorded: scopeTemplateRecorded,
      future_change_shape_recorded: futureShapeRecorded,
      review_fields_recorded: reviewFieldsRecorded,
      no_forbidden_true_flags: noForbiddenTrue,
      checklist_current: checklistCurrent,
      scope_only: true,
      implementation_allowed: false,
      source_read_authorized: false,
      source_read_performed: false,
      real_target_paths_filled: false,
      real_vcpchat_source_read: false,
      real_vcptoolbox_source_read: false,
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
