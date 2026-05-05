const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const requiredFiles = [
  "adapter_dry_run_lab/adapter_dry_run.js",
  "adapter_dry_run_lab/README.md",
  "adapter_dry_run_lab/fixtures/accepted_request.json",
  "adapter_dry_run_lab/fixtures/rejected_request.json",
  "adapter_dry_run_lab/fixtures/photo_studio_os_v0_7_rehearsal_request.json",
  "exports/vcptoolbox/Plugin/AgentImageLabAdapter/dry-run-adapter.js",
  "exports/vcptoolbox/Plugin/AgentImageLabAdapter/plugin-manifest.json",
  "exports/vcptoolbox/Plugin/AgentImageLabAdapter/README.md",
  "exports/vcptoolbox/Plugin/AgentImageLabAdapter/config.env.example"
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`${label} must be valid JSON: ${error.message}`);
  }
}

function hasForbiddenRuntimeCall(source) {
  return [
    /fetch\s*\(/,
    /XMLHttpRequest/,
    /https\.request/,
    /http\.request/,
    /net\.connect/,
    /child_process/,
    /exec\s*\(/,
    /spawn\s*\(/,
    /writeFile/,
    /appendFile/,
    /createWriteStream/,
    /DailyNote\.write/,
    /callPlugin\s*\(/,
    /writeImage/i
  ].some((pattern) => pattern.test(source));
}

function assertNoExecutionGuard(response, label) {
  const guard = response.no_execution_guard || response;
  assert(guard.selected_plugin === null, `${label} must keep selected_plugin null.`);
  assert(guard.max_plugin_calls === 0, `${label} must keep max_plugin_calls 0.`);
  assert(guard.api_called === false, `${label} must keep api_called false.`);
  assert(guard.vcp_plugin_called === false, `${label} must keep vcp_plugin_called false.`);
  assert(guard.daily_note_called === false, `${label} must keep daily_note_called false.`);
  assert(guard.file_write_performed === false, `${label} must keep file_write_performed false.`);
  assert(guard.image_file_created === false, `${label} must keep image_file_created false.`);
}

function validateManifest() {
  const manifest = parseJson(
    read("exports/vcptoolbox/Plugin/AgentImageLabAdapter/plugin-manifest.json"),
    "plugin manifest"
  );
  const allowedCommands = manifest.allowedCommands || [];
  const forbiddenCommands = manifest.forbiddenCommands || [];
  const contract = manifest.dryRunContract || {};

  assert(manifest.name === "AgentImageLabAdapter", "Manifest name must be AgentImageLabAdapter.");
  assert(
    manifest.displayName === "Agent Image Lab Adapter Dry-Run",
    "Manifest display name must be the dry-run adapter."
  );
  assert(manifest.entryPoint?.command === "node dry-run-adapter.js", "Manifest entry point must be dry-run adapter.");
  assert(allowedCommands.length === 1 && allowedCommands[0] === "dry_run", "Manifest must only allow dry_run.");
  for (const command of ["execute", "generate", "run", "call_plugin", "write_memory", "write_image_file"]) {
    assert(forbiddenCommands.includes(command), `Manifest must forbid ${command}.`);
  }
  assert(contract.external_api_allowed === false, "dryRunContract.external_api_allowed must be false.");
  assert(contract.execution_blocked === true, "dryRunContract.execution_blocked must be true.");
  assert(contract.max_plugin_calls === 0, "dryRunContract.max_plugin_calls must be 0.");
  assert(contract.allow_file_write === false, "dryRunContract.allow_file_write must be false.");
  assert(contract.allow_image_binary === false, "dryRunContract.allow_image_binary must be false.");
  assert(contract.gatekeeper_required === true, "dryRunContract.gatekeeper_required must be true.");
  assert(contract.review_console_required === true, "dryRunContract.review_console_required must be true.");
  assert(
    contract.daily_note_direct_write_allowed === false,
    "dryRunContract.daily_note_direct_write_allowed must be false."
  );

  return manifest;
}

function validateLabCli() {
  const labAdapter = require(path.join(root, "adapter_dry_run_lab/adapter_dry_run.js"));
  const accepted = labAdapter.run(
    path.join(root, "adapter_dry_run_lab/fixtures/accepted_request.json")
  ).adapter_dry_run_response;
  assert(accepted.status === "accepted_draft", "Lab accepted fixture must return accepted_draft.");
  assert(accepted.dispatch_plan_draft.selected_plugin === null, "Lab accepted fixture must not select a plugin.");
  assert(accepted.dispatch_plan_draft.max_plugin_calls === 0, "Lab accepted fixture must keep max_plugin_calls 0.");
  assert(accepted.dispatch_plan_draft.execution_blocked === true, "Lab accepted fixture must block execution.");
  assertNoExecutionGuard(accepted, "lab accepted fixture");

  const rejected = labAdapter.run(
    path.join(root, "adapter_dry_run_lab/fixtures/rejected_request.json")
  ).adapter_dry_run_response;
  assert(rejected.status === "rejected", "Lab rejected fixture must return rejected.");
  assert(rejected.selected_plugin === null, "Lab rejected fixture must not select a plugin.");
  assert(rejected.max_plugin_calls === 0, "Lab rejected fixture must keep max_plugin_calls 0.");
  assert(rejected.execution_blocked === true, "Lab rejected fixture must block execution.");
  assertNoExecutionGuard(rejected, "lab rejected fixture");
}

function validateExportStdio() {
  const exportAdapter = require(path.join(root, "exports/vcptoolbox/Plugin/AgentImageLabAdapter/dry-run-adapter.js"));
  const acceptedInput = parseJson(read("adapter_dry_run_lab/fixtures/accepted_request.json"), "accepted fixture");
  const acceptedEnvelope = exportAdapter.toVcpPluginResult(exportAdapter.dryRun(acceptedInput));
  const accepted = acceptedEnvelope.result.adapter_dry_run_response;
  assert(acceptedEnvelope.status === "success", "Export accepted stdio fixture must return VCP status success.");
  assert(accepted.status === "accepted_draft", "Export accepted stdio fixture must return accepted_draft.");
  assert(accepted.dispatch_plan_draft.selected_plugin === null, "Export accepted stdio fixture must not select plugin.");
  assert(accepted.dispatch_plan_draft.max_plugin_calls === 0, "Export accepted stdio fixture must keep max_plugin_calls 0.");
  assert(accepted.dispatch_plan_draft.execution_blocked === true, "Export accepted stdio fixture must block execution.");
  assertNoExecutionGuard(accepted, "export accepted stdio fixture");
  assertNoExecutionGuard(acceptedEnvelope.meta, "export accepted stdio meta");

  const rejectedInput = parseJson(read("adapter_dry_run_lab/fixtures/rejected_request.json"), "rejected fixture");
  const rejectedEnvelope = exportAdapter.toVcpPluginResult(exportAdapter.dryRun(rejectedInput));
  const rejected = rejectedEnvelope.result.adapter_dry_run_response;
  assert(rejectedEnvelope.status === "success", "Export rejected stdio fixture must return VCP status success.");
  assert(rejected.status === "rejected", "Export rejected stdio fixture must return rejected.");
  assert(rejected.selected_plugin === null, "Export rejected stdio fixture must not select plugin.");
  assert(rejected.max_plugin_calls === 0, "Export rejected stdio fixture must keep max_plugin_calls 0.");
  assert(rejected.execution_blocked === true, "Export rejected stdio fixture must block execution.");
  assertNoExecutionGuard(rejected, "export rejected stdio fixture");
  assertNoExecutionGuard(rejectedEnvelope.meta, "export rejected stdio meta");
}

function validateDocsAndConfig() {
  const labReadme = read("adapter_dry_run_lab/README.md");
  const exportReadme = read("exports/vcptoolbox/Plugin/AgentImageLabAdapter/README.md");
  const configExample = read("exports/vcptoolbox/Plugin/AgentImageLabAdapter/config.env.example");

  for (const required of ["不调用 VCP 插件", "不调用外部 API", "不写文件", "不写 DailyNote", "不创建图片"]) {
    assert(labReadme.includes(required), `Adapter lab README must declare: ${required}`);
  }
  for (const required of ["Only allowed command: `dry_run`", "No external API call", "No DailyNote write", "No file write"]) {
    assert(exportReadme.includes(required), `Export adapter README must declare: ${required}`);
  }
  assert(
    configExample.includes("AGENT_IMAGE_LAB_MODE=dry_run") &&
      configExample.includes("AGENT_IMAGE_LAB_MAX_PLUGIN_CALLS=0") &&
      configExample.includes("AGENT_IMAGE_LAB_EXTERNAL_API_ALLOWED=false"),
    "Config example must keep dry-run no-execution placeholders."
  );
  assert(
    !/=\s*(sk-|AKIA|eyJ|ghp_|xox|Bearer\s+)/i.test(configExample),
    "Config example must not contain credential-looking values."
  );
}

function main() {
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing adapter delivery surface files: ${missingFiles.join(", ")}`);

  const labSource = read("adapter_dry_run_lab/adapter_dry_run.js");
  const exportSource = read("exports/vcptoolbox/Plugin/AgentImageLabAdapter/dry-run-adapter.js");
  for (const required of ["buildViolationList", "buildAcceptedResponse", "buildRejectedResponse"]) {
    assert(labSource.includes(required), `Lab adapter must include ${required}.`);
    assert(exportSource.includes(required), `Export adapter must include ${required}.`);
  }
  assert(labSource.includes("fs.readFileSync"), "Lab adapter may only read local fixtures.");
  assert(exportSource.includes("readStdin"), "Export adapter must read controlled stdin.");
  assert(!hasForbiddenRuntimeCall(labSource), "Lab adapter contains a forbidden runtime call pattern.");
  assert(!hasForbiddenRuntimeCall(exportSource), "Export adapter contains a forbidden runtime call pattern.");

  validateManifest();
  validateLabCli();
  validateExportStdio();
  validateDocsAndConfig();

  const result = {
    passed: true,
    adapter_delivery_surface: {
      adapter_file_count: requiredFiles.length,
      adapter_files_present: true,
      manifest_dry_run_only: true,
      allowed_command_dry_run_only: true,
      forbidden_commands_declared: true,
      dry_run_contract_current: true,
      lab_accepted_fixture_passed: true,
      lab_rejected_fixture_passed: true,
      export_accepted_stdio_passed: true,
      export_rejected_stdio_passed: true,
      no_execution_guard_verified: true,
      readme_boundary_current: true,
      config_example_secret_free: true,
      forbidden_runtime_calls_present: false,
      external_network_required: false,
      external_service_required: false,
      file_write_performed: false
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
