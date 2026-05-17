const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docPath = "docs/v14_081_pvos_evidence_collector_blocker_exact_A5_authorization_package_gate.md";
const outputDirectory = "runs/real_generation/v14_081_pvos_premium_portable_led_camping_lantern_first_trial/";

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function isDirectoryEmptyOrAbsent(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    return true;
  }
  const stat = fs.statSync(absolutePath);
  return stat.isDirectory() && fs.readdirSync(absolutePath).length === 0;
}

function has(content, pattern) {
  return content.includes(pattern);
}

function notHas(content, pattern) {
  return !content.includes(pattern);
}

function main() {
  const checks = [];
  const add = (name, passed) => checks.push({ name, passed: Boolean(passed) });

  const docExists = exists(docPath);
  add("authorization_doc_exists", docExists);
  const doc = docExists ? read(docPath) : "";

  [
    "authorization_package_id: AUTH-PENDING-PVOS-EVIDENCE-BLOCKER-20260517-001",
    "authorization_status: pending_human_preflight_approval",
    "approval_status: requested_for_preflight_only",
    "active: false",
    "execute_now: false",
    "active_A5_authorization_created: false",
    "A5_execution_allowed_now: false",
    "preflight_allowed_now: false",
    "provider_contact_allowed_now: false",
    "plugin_call_allowed_now: false",
    "api_call_allowed_now: false",
    "image_generation_allowed_now: false",
    "runtime_execution_allowed_now: false",
    "env_value_read_allowed_now: false",
    "output_directory_creation_allowed_now: false",
    "DailyNote_write_allowed_now: false",
    "VCP_memory_write_allowed_now: false",
    "accepted_samples_write_allowed_now: false",
    "production_candidate_write_allowed_now: false",
    "real_manifest_read_allowed_now: false",
    "real_VCPChat_read_allowed_now: false",
    "real_VCPToolBox_read_allowed_now: false",
    "selected_plugin_id: NativeDoubaoImage",
    "selected_plugin_command: generate",
    "selected_plugin_model: doubao-seedream-5-0-260128",
    "max_plugin_calls: 1",
    "max_images_created: 1",
    "retry_limit: 0",
    "retry_allowed: false",
    "overwrite_existing_files_allowed: false",
    "daily_note_direct_write_allowed: false",
    "memory_delta_only: true",
    "reviewer: Jenn",
    "--dry-run=true",
    "--execution-authorized=false",
    "批准进入 AUTH-PENDING-PVOS-EVIDENCE-BLOCKER-20260517-001 A5 preflight",
    "仅运行 preflight，不调用 provider，不生成图片",
    "A5_execution: false",
    "preflight_execution_now: false",
    "- --dry-run=false",
    "- --execution-authorized=true"
  ].forEach((pattern) => add(`doc_contains:${pattern}`, has(doc, pattern)));

  [
    "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml",
    "plugins/image_generation/native_doubao_image/plugin.profile.yaml",
    "scripts/run_native_doubao_image_generation.js",
    outputDirectory,
    "kernel/pvos_evidence_collector_blocker_pipeline.js",
    "schemas/pvos_evidence_collector_blocker_pipeline.schema.yaml",
    "scripts/validate_pvos_evidence_collector_blocker_pipeline.js",
    "tests/schema_examples/pvos_evidence_collector_blocker_pipeline.example.json"
  ].forEach((requiredPath) => add(`doc_names_allowed_path:${requiredPath}`, has(doc, requiredPath)));

  [
    "provider_contact_allowed_now: true",
    "plugin_call_allowed_now: true",
    "api_call_allowed_now: true",
    "image_generation_allowed_now: true",
    "env_value_read_allowed_now: true",
    "DailyNote_write_allowed_now: true",
    "VCP_memory_write_allowed_now: true",
    "accepted_samples_write_allowed_now: true",
    "production_candidate_write_allowed_now: true",
    "real_manifest_read_allowed_now: true",
    "real_VCPChat_read_allowed_now: true",
    "real_VCPToolBox_read_allowed_now: true",
    "output_directory_creation_allowed_now: true"
  ].forEach((pattern) => add(`doc_excludes:${pattern}`, notHas(doc, pattern)));

  [
    "docs/v14_080_pvos_evidence_collector_blocker_A5_authorization_package_draft_gate.md",
    "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml",
    "docs/premium_portable_led_camping_lantern_prompt_package_static_review_v1.md",
    "plugins/image_generation/native_doubao_image/plugin.profile.yaml",
    "scripts/run_native_doubao_image_generation.js",
    "kernel/pvos_evidence_collector_blocker_pipeline.js",
    "schemas/pvos_evidence_collector_blocker_pipeline.schema.yaml",
    "scripts/validate_pvos_evidence_collector_blocker_pipeline.js",
    "tests/schema_examples/pvos_evidence_collector_blocker_pipeline.example.json"
  ].forEach((requiredPath) => add(`required_source_exists:${requiredPath}`, exists(requiredPath)));

  add("output_directory_absent_or_empty", isDirectoryEmptyOrAbsent(outputDirectory));

  const failed = checks.filter((check) => !check.passed);
  const result = {
    passed: failed.length === 0,
    v14_081_pvos_exact_a5_authorization_package: {
      authorization_package_id: "AUTH-PENDING-PVOS-EVIDENCE-BLOCKER-20260517-001",
      authorization_status: "pending_human_preflight_approval",
      approval_status: "requested_for_preflight_only",
      active: false,
      execute_now: false,
      selected_plugin_id: "NativeDoubaoImage",
      selected_plugin_command: "generate",
      selected_plugin_model: "doubao-seedream-5-0-260128",
      prompt_package_ref: "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml",
      output_directory_ref: outputDirectory,
      max_plugin_calls: 1,
      max_images_created: 1,
      retry_limit: 0,
      overwrite_existing_files_allowed: false,
      daily_note_direct_write_allowed: false,
      memory_delta_only: true,
      output_directory_absent_or_empty: isDirectoryEmptyOrAbsent(outputDirectory),
      external_network_required: false,
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false,
      env_value_read_performed: false,
      output_directory_creation_performed: false,
      daily_note_write_performed: false,
      vcp_memory_write_performed: false,
      accepted_samples_write_performed: false,
      production_candidate_write_performed: false,
      real_manifest_read_performed: false,
      real_vcpchat_read_performed: false,
      real_vcptoolbox_read_performed: false,
      file_write_performed: false,
      check_count: checks.length,
      failed_count: failed.length
    },
    failed_checks: failed.map((check) => check.name)
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.passed) {
    process.exitCode = 1;
  }
}

main();
