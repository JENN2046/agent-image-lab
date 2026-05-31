#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync, execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const defaultIterations = 3;
const defaultTimeoutMs = 300000;
const commands = [
  {
    id: "validate_smoke",
    command: "npm run validate:smoke"
  },
  {
    id: "recommend_validation",
    command: "npm run recommend:validation"
  },
  {
    id: "validate_mvp",
    command: "npm run validate:mvp"
  },
  {
    id: "validate_active",
    command: "npm run validate:active"
  },
  {
    id: "agent_board_state",
    command: "node scripts/validate_agent_board_state.js"
  }
];

function parseArgs(argv) {
  const options = {
    iterations: defaultIterations,
    timeoutMs: defaultTimeoutMs,
    output: null,
    write: true
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--no-write") {
      options.write = false;
    } else if (arg === "--iterations" || arg === "-n") {
      options.iterations = Number.parseInt(argv[index + 1], 10);
      index += 1;
    } else if (arg.startsWith("--iterations=")) {
      options.iterations = Number.parseInt(arg.slice("--iterations=".length), 10);
    } else if (arg === "--timeout-ms") {
      options.timeoutMs = Number.parseInt(argv[index + 1], 10);
      index += 1;
    } else if (arg.startsWith("--timeout-ms=")) {
      options.timeoutMs = Number.parseInt(arg.slice("--timeout-ms=".length), 10);
    } else if (arg === "--output") {
      options.output = argv[index + 1];
      index += 1;
    } else if (arg.startsWith("--output=")) {
      options.output = arg.slice("--output=".length);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!Number.isInteger(options.iterations) || options.iterations < 1 || options.iterations > 20) {
    throw new Error("--iterations must be an integer from 1 to 20");
  }
  if (!Number.isInteger(options.timeoutMs) || options.timeoutMs < 1000) {
    throw new Error("--timeout-ms must be an integer >= 1000");
  }

  return options;
}

function timestampForFile(date) {
  return date.toISOString().replace(/[:.]/g, "-");
}

function gitOutput(args) {
  return commandOutput("git", args);
}

function commandOutput(command, args) {
  if (process.platform === "win32" && command === "npm") {
    try {
      return execFileSync("powershell", ["-NoProfile", "-Command", "npm --version"], {
        cwd: root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"]
      }).trim();
    } catch (error) {
      return null;
    }
  }
  try {
    return execFileSync(command, args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    }).trim();
  } catch (error) {
    return null;
  }
}

function resolveOutputPath(outputPath) {
  const resolved = path.resolve(root, outputPath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`--output must stay inside the repository: ${outputPath}`);
  }
  return {
    absolute: resolved,
    relative: relative.replace(/\\/g, "/")
  };
}

function parseJsonFromOutput(stdout) {
  const firstBrace = stdout.indexOf("{");
  const lastBrace = stdout.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) return null;
  try {
    return JSON.parse(stdout.slice(firstBrace, lastBrace + 1));
  } catch (error) {
    return null;
  }
}

function summarizeParsedOutput(parsed) {
  if (!parsed || typeof parsed !== "object") return null;
  const summary = {};
  for (const key of [
    "passed",
    "validator",
    "recommender",
    "runner",
    "check_count",
    "failed_count",
    "matched_validator_count",
    "mvp_recommended",
    "recommended_commands",
    "timing_summary"
  ]) {
    if (Object.prototype.hasOwnProperty.call(parsed, key)) {
      summary[key] = parsed[key];
    }
  }
  if (parsed.agent_board_state) {
    summary.agent_board_state = {
      required_files_present: parsed.agent_board_state.required_files_present,
      current_branch: parsed.agent_board_state.current_branch,
      ahead_behind: parsed.agent_board_state.ahead_behind,
      phase_freshness_verified: parsed.agent_board_state.phase_freshness_verified
    };
  }
  return Object.keys(summary).length > 0 ? summary : null;
}

function runCommand(commandConfig, iteration, timeoutMs) {
  const start = process.hrtime.bigint();
  const result = spawnSync(commandConfig.command, {
    cwd: root,
    shell: true,
    encoding: "utf8",
    timeout: timeoutMs,
    maxBuffer: 20 * 1024 * 1024
  });
  const seconds = Number((Number(process.hrtime.bigint() - start) / 1e9).toFixed(3));
  const stdout = result.stdout || "";
  const stderr = result.stderr || "";
  const parsed = parseJsonFromOutput(stdout);
  const timedOut = result.error && result.error.code === "ETIMEDOUT";
  return {
    id: commandConfig.id,
    command: commandConfig.command,
    iteration,
    passed: result.status === 0 && !timedOut,
    exit_code: result.status,
    timed_out: Boolean(timedOut),
    error_code: result.error ? result.error.code || null : null,
    error_message: result.error ? result.error.message : null,
    seconds,
    stdout_bytes: Buffer.byteLength(stdout),
    stderr_bytes: Buffer.byteLength(stderr),
    parsed_summary: summarizeParsedOutput(parsed)
  };
}

function summarizeDurations(results) {
  return commands.map((commandConfig) => {
    const commandResults = results.filter((item) => item.id === commandConfig.id);
    const seconds = commandResults.map((item) => item.seconds);
    const passedResults = commandResults.filter((item) => item.passed);
    const passedSeconds = passedResults.map((item) => item.seconds);
    const passedCount = passedResults.length;
    const total = seconds.reduce((sum, value) => sum + value, 0);
    const passedTotal = passedSeconds.reduce((sum, value) => sum + value, 0);
    return {
      id: commandConfig.id,
      command: commandConfig.command,
      iterations: commandResults.length,
      passed_iterations: passedCount,
      failed_iterations: commandResults.length - passedCount,
      min_seconds: Number(Math.min(...seconds).toFixed(3)),
      max_seconds: Number(Math.max(...seconds).toFixed(3)),
      all_iterations_avg_seconds: Number((total / seconds.length).toFixed(3)),
      passed_min_seconds: passedSeconds.length > 0 ? Number(Math.min(...passedSeconds).toFixed(3)) : null,
      passed_max_seconds: passedSeconds.length > 0 ? Number(Math.max(...passedSeconds).toFixed(3)) : null,
      passed_avg_seconds: passedSeconds.length > 0 ? Number((passedTotal / passedSeconds.length).toFixed(3)) : null
    };
  });
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const startedAt = new Date();
  const results = [];
  const outputPath = options.output || path.join(
    "reports",
    "validation_benchmarks",
    `validation_efficiency_baseline_${timestampForFile(startedAt)}.json`
  );
  const resolvedOutput = resolveOutputPath(outputPath);

  for (let iteration = 1; iteration <= options.iterations; iteration += 1) {
    for (const commandConfig of commands) {
      results.push(runCommand(commandConfig, iteration, options.timeoutMs));
    }
  }

  const finishedAt = new Date();
  const summary = summarizeDurations(results);
  const passed = results.every((item) => item.passed);
  const report = {
    passed,
    benchmark: "validation_efficiency_baseline",
    daily_efficiency_baseline_command: "npm run validate:active",
    full_regression_baseline_command: "npm run validate:all",
    full_regression_excluded_from_daily_baseline: true,
    started_at: startedAt.toISOString(),
    finished_at: finishedAt.toISOString(),
    total_seconds: Number(((finishedAt.getTime() - startedAt.getTime()) / 1000).toFixed(3)),
    iterations: options.iterations,
    timeout_ms: options.timeoutMs,
    output_path: options.write ? resolvedOutput.relative : null,
    environment: {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      npm: commandOutput("npm", ["--version"])
    },
    git: {
      branch: gitOutput(["branch", "--show-current"]),
      head: gitOutput(["rev-parse", "--short=8", "HEAD"]),
      status_short: gitOutput(["status", "--short"]) || "clean"
    },
    commands,
    summary,
    results,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
    file_write_performed: options.write
  };

  if (options.write) {
    fs.mkdirSync(path.dirname(resolvedOutput.absolute), { recursive: true });
    fs.writeFileSync(resolvedOutput.absolute, `${JSON.stringify(report, null, 2)}\n`);
  }

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!passed) {
    process.exitCode = 1;
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
