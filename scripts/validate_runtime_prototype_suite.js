const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");

function syntaxCheck(id, filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  new vm.Script(source, { filename: filePath });
  return {
    id,
    passed: true,
    parsed_output_passed: null
  };
}

function runNodeScript(id, filePath) {
  const previousStdoutWrite = process.stdout.write;
  const previousStderrWrite = process.stderr.write;
  const previousExitCode = process.exitCode;
  let stdout = "";
  let stderr = "";

  process.stdout.write = (chunk, ..._args) => {
    stdout += String(chunk);
    return true;
  };
  process.stderr.write = (chunk, ..._args) => {
    stderr += String(chunk);
    return true;
  };
  process.exitCode = 0;

  try {
    delete require.cache[require.resolve(filePath)];
    require(filePath);
  } catch (error) {
    stderr += `${error.stack || error.message}\n`;
    process.exitCode = 1;
  }

  const exitCode = process.exitCode || 0;
  process.stdout.write = previousStdoutWrite;
  process.stderr.write = previousStderrWrite;
  process.exitCode = previousExitCode;

  let parsedOutput = null;
  const trimmedStdout = stdout.trim();
  if (trimmedStdout.startsWith("{")) {
    try {
      parsedOutput = JSON.parse(trimmedStdout);
    } catch (_error) {
      parsedOutput = null;
    }
  }

  return {
    id,
    passed: exitCode === 0,
    exit_code: exitCode,
    stderr_present: Boolean(stderr.trim()),
    parsed_output_passed: parsedOutput?.passed === true || null
  };
}

function runCheck(check) {
  try {
    if (check.kind === "syntax") {
      return syntaxCheck(check.id, check.filePath);
    }
    return runNodeScript(check.id, check.filePath);
  } catch (error) {
    return {
      id: check.id,
      passed: false,
      exit_code: 1,
      stderr_present: true,
      parsed_output_passed: null,
      error_message: error.message
    };
  }
}

function main() {
  const checks = [
    {
      id: "runtime_guard_syntax",
      kind: "syntax",
      filePath: path.join(root, "review_console", "runtime_prototype", "runtime_guard.js")
    },
    {
      id: "host_bridge_mock_syntax",
      kind: "syntax",
      filePath: path.join(root, "review_console", "runtime_prototype", "host_bridge_mock.js")
    },
    {
      id: "runtime_app_syntax",
      kind: "syntax",
      filePath: path.join(root, "review_console", "runtime_prototype", "app.js")
    },
    {
      id: "runtime_guard_unit_syntax",
      kind: "syntax",
      filePath: path.join(root, "scripts", "validate_runtime_guard_unit.js")
    },
    {
      id: "runtime_guard_unit",
      kind: "run",
      filePath: path.join(root, "scripts", "validate_runtime_guard_unit.js")
    },
    {
      id: "runtime_smoke_syntax",
      kind: "syntax",
      filePath: path.join(root, "scripts", "validate_runtime_prototype_smoke.js")
    },
    {
      id: "runtime_smoke",
      kind: "run",
      filePath: path.join(root, "scripts", "validate_runtime_prototype_smoke.js")
    }
  ];
  const results = checks.map(runCheck);
  const failed = results.filter((result) => !result.passed);
  const resultById = Object.fromEntries(results.map((result) => [result.id, result]));
  const summary = {
    passed: failed.length === 0,
    runtime_validation_suite: {
      check_count: results.length,
      failed_count: failed.length,
      runtime_guard_syntax: resultById.runtime_guard_syntax.passed,
      host_bridge_mock_syntax: resultById.host_bridge_mock_syntax.passed,
      runtime_app_syntax: resultById.runtime_app_syntax.passed,
      runtime_guard_unit_syntax: resultById.runtime_guard_unit_syntax.passed,
      runtime_guard_unit: resultById.runtime_guard_unit.passed,
      runtime_guard_unit_output_passed: resultById.runtime_guard_unit.parsed_output_passed === true,
      runtime_smoke_syntax: resultById.runtime_smoke_syntax.passed,
      runtime_smoke: resultById.runtime_smoke.passed,
      runtime_smoke_output_passed: resultById.runtime_smoke.parsed_output_passed === true,
      external_network_required: false,
      external_service_required: false,
      file_write_performed: false
    },
    results
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

main();
