const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const runnerPath = "scripts/run_v0_7_photo_studio_os_real_execution.ps1";

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function main() {
  const runner = read(runnerPath);
  const validationLog = read(".agent_board/VALIDATION_LOG.md");
  const runState = read(".agent_board/RUN_STATE.md");

  const requiredRunnerSnippets = [
    "function Get-Sha256Utf8",
    "$pluginReportedModelRef = if ($details.model) { ConvertTo-SafeText ([string]$details.model) } else { '<model-ref-not-reported>' }",
    "$success.plugin_reported_model_ref = $pluginReportedModelRef",
    "$success.plugin_reported_model_sha256_utf8 = if ($details.model) { Get-Sha256Utf8 ([string]$details.model) } else { $null }",
    "$success.requested_model_sha256_utf8 = if ([string]::IsNullOrWhiteSpace($ModelOverride)) { $null } else { Get-Sha256Utf8 $ModelOverride }",
    "$success.plugin_reported_model_matches_requested = if ($details.model -and -not [string]::IsNullOrWhiteSpace($ModelOverride)) { ([string]$details.model) -eq $ModelOverride } else { $null }"
  ];

  for (const snippet of requiredRunnerSnippets) {
    assert(runner.includes(snippet), `Missing runner snippet: ${snippet}`);
  }

  assert(!runner.includes("$success.plugin_reported_model_ref = if ($details.model) { '<model-ref-present>' }"), "Runner must not collapse reported model to presence-only marker.");
  assert(
    validationLog.includes("v10.20") && runState.includes("v10.20"),
    ".agent_board must record the v10.20 plugin reported model recording patch."
  );
  assert(
    validationLog.includes("actual generation calls: 0") && runState.includes("actual generation calls: 0"),
    "v10.20 board record must confirm no generation."
  );

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v10_20_plugin_reported_model_recording: {
      runner_path: runnerPath,
      records_plugin_reported_model_ref: true,
      records_plugin_reported_model_sha256_utf8: true,
      records_requested_model_sha256_utf8: true,
      records_model_match_boolean: true,
      generation_performed: false,
      api_called: false,
      image_created: false,
      daily_note_called: false,
      vcp_memory_written: false
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
