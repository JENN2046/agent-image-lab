#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const manifestPath = path.join(root, "scripts", "validation_manifest.json");

function parseArgs(argv) {
  const args = {
    tier: null,
    domain: null,
    dryRun: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--tier") {
      args.tier = argv[++index];
    } else if (arg.startsWith("--tier=")) {
      args.tier = arg.slice("--tier=".length);
    } else if (arg === "--domain") {
      args.domain = argv[++index];
    } else if (arg.startsWith("--domain=")) {
      args.domain = arg.slice("--domain=".length);
    } else if (arg === "--dry-run" || arg === "--plan") {
      args.dryRun = true;
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }
  return args;
}

function loadManifest() {
  return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
}

function selectValidators(manifest, args) {
  return (manifest.validators || []).filter((entry) => {
    if (args.tier && entry.tier !== args.tier) return false;
    if (args.domain && entry.domain !== args.domain) return false;
    return true;
  });
}

function runCommand(command) {
  const start = process.hrtime.bigint();
  try {
    execSync(command, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
      timeout: 240000,
    });
    return {
      command,
      passed: true,
      seconds: Number((Number(process.hrtime.bigint() - start) / 1e9).toFixed(3)),
    };
  } catch (error) {
    return {
      command,
      passed: false,
      seconds: Number((Number(process.hrtime.bigint() - start) / 1e9).toFixed(3)),
      detail: String(error.stderr || error.stdout || error.message).slice(0, 1000),
    };
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const manifest = loadManifest();
  const selected = selectValidators(manifest, args);
  const uniqueCommands = [...new Set(selected.map((entry) => entry.command))];
  const runResults = args.dryRun ? [] : uniqueCommands.map(runCommand);
  const failed = runResults.filter((result) => !result.passed);

  const output = {
    passed: args.dryRun ? true : failed.length === 0,
    runner: "run_validation_manifest_tier",
    manifest_ref: "scripts/validation_manifest.json",
    tier: args.tier || "all",
    domain: args.domain || "all",
    dry_run: args.dryRun,
    selected_validator_count: selected.length,
    selected_command_count: uniqueCommands.length,
    selected_commands: uniqueCommands,
    failed_count: failed.length,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
    file_write_performed: false,
    results: runResults,
  };

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  process.exit(output.passed ? 0 : 1);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${JSON.stringify({
    passed: false,
    runner: "run_validation_manifest_tier",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
