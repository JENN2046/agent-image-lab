const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docPath = "docs/v14_082_pvos_metadata_only_preflight_authorization_correction_gate.md";
const runnerPath = "scripts/run_native_doubao_image_generation.js";
const outputDirectory = "runs/real_generation/v14_081_pvos_premium_portable_led_camping_lantern_first_trial/";

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function isDirectoryEmptyOrAbsent(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) return true;
  const stat = fs.statSync(absolutePath);
  return stat.isDirectory() && fs.readdirSync(absolutePath).length === 0;
}

function addCheck(checks, name, passed) {
  checks.push({ name, passed: Boolean(passed) });
}

function main() {
  const checks = [];
  const docExists = exists(docPath);
  const runnerExists = exists(runnerPath);
  const doc = docExists ? read(docPath) : "";
  const runner = runnerExists ? read(runnerPath) : "";

  addCheck(checks, "correction_doc_exists", docExists);
  addCheck(checks, "runner_exists", runnerExists);

  [
    "phase: v14_082_pvos_metadata_only_preflight_authorization_correction_gate",
    "authorization_package_id: AUTH-PENDING-PVOS-EVIDENCE-BLOCKER-20260517-001",
    "authorization_status: approved_for_metadata_only_preflight",
    "approval_status: approved_for_preflight_only",
    "active_A5_generation_authorization_created: false",
    "execute_now_generation: false",
    ".env.local_status_after: metadata_only_preflight_allowed_path",
    "- .env.local",
    "env_metadata_only_allowed_paths:",
    "env_metadata_only_allowed_operations:",
    "- readEnvFieldNames",
    "- check_env_file_exists",
    "- compare_required_field_names",
    "- return_env_field_counts",
    "- return_missing_required_field_names",
    "forbidden_env_operations:",
    "- loadDotEnv",
    "- loadEnvLocal",
    "- process.env mutation",
    "- read value after equals sign as a secret",
    "- print value after equals sign",
    "- store raw env line",
    "- copy .env.local content",
    "- commit .env.local",
    "--dry-run=true",
    "--execution-authorized=false",
    "selected_plugin_id: NativeDoubaoImage",
    "selected_plugin_model: doubao-seedream-5-0-260128",
    "max_plugin_calls: 1",
    "max_images_created: 1",
    "retry_limit: 0",
    "env_value_read: false",
    "provider_contact: false",
    "plugin_call: false",
    "api_call: false",
    "image_generation: false",
    "output_directory_creation: false",
    "output_write: false",
    "push_tag_release_deploy: false",
    "preflight_result:",
    "status: DRY_RUN_ONLY",
    "preflight_passed: true",
    "issues: []",
    "env_file_exists: true",
    "env_file_ignored: true",
    "env_fields_present: 5",
    "env_fields_total: 5",
    "adapter_status: DRY_RUN_ONLY",
    "image_count: 0",
    "api_key_value_printed: false",
    "local_files_written_count: 0",
    "local_files_verified_count: 0",
    "phase: wait_for_next_explicit_A5_decision",
    "auto_execution_allowed: false"
  ].forEach((pattern) => addCheck(checks, `doc_contains:${pattern}`, doc.includes(pattern)));

  [
    "provider_contact: true",
    "plugin_call: true",
    "api_call: true",
    "image_generation: true",
    "env_value_read: true",
    "output_directory_creation: true",
    "DailyNote_write: true",
    "VCP_memory_write: true"
  ].forEach((pattern) => addCheck(checks, `doc_excludes:${pattern}`, !doc.includes(pattern)));

  addCheck(checks, "runner_has_metadata_only_field_reader", runner.includes("function readEnvFieldNames"));
  addCheck(checks, "runner_preflight_uses_metadata_reader", runner.includes("const envFields = readEnvFieldNames(ENV_LOCAL_PATH);"));
  addCheck(checks, "runner_loads_env_values_only_for_real_execution", runner.includes("if (options.dryRun === false && options.execution_authorized === true)"));
  addCheck(checks, "runner_default_dry_run", runner.includes("if (options.dryRun === undefined) options.dryRun = true;"));
  addCheck(checks, "runner_cli_supports_execution_authorized_false", runner.includes('execution_authorized: args["--execution-authorized"] === "true"'));
  addCheck(checks, "runner_does_not_call_load_env_before_real_gate", runner.indexOf("const preflight = preflightCheck(options);") < runner.indexOf("if (options.dryRun === false && options.execution_authorized === true)"));
  addCheck(checks, "output_directory_absent_or_empty", isDirectoryEmptyOrAbsent(outputDirectory));

  const failed = checks.filter((check) => !check.passed);
  const result = {
    passed: failed.length === 0,
    v14_082_pvos_metadata_only_preflight_authorization_correction: {
      authorization_package_id: "AUTH-PENDING-PVOS-EVIDENCE-BLOCKER-20260517-001",
      authorization_status: "approved_for_metadata_only_preflight",
      approval_status: "approved_for_preflight_only",
      env_local_metadata_only_allowed: true,
      env_value_read_allowed: false,
      provider_contact_allowed: false,
      plugin_call_allowed: false,
      api_call_allowed: false,
      image_generation_allowed: false,
      output_directory_creation_allowed: false,
      output_write_allowed: false,
      daily_note_write_allowed: false,
      vcp_memory_write_allowed: false,
      push_tag_release_deploy_allowed: false,
      output_directory_absent_or_empty: isDirectoryEmptyOrAbsent(outputDirectory),
      external_network_required: false,
      file_write_performed: false,
      check_count: checks.length,
      failed_count: failed.length
    },
    failed_checks: failed.map((check) => check.name)
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.passed) process.exitCode = 1;
}

main();
