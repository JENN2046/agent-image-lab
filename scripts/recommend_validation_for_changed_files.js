#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "scripts", "validation_manifest.json"), "utf8"));

function parseArgs(argv) {
  const args = {
    cached: false,
    files: [],
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--cached") {
      args.cached = true;
    } else if (arg === "--files") {
      const value = argv[index + 1] || "";
      index += 1;
      args.files.push(...value.split(",").map((item) => item.trim()).filter(Boolean));
    } else {
      args.files.push(arg);
    }
  }
  return args;
}

function changedFilesFromGit(cached) {
  const args = ["diff", "--name-only"];
  if (cached) args.push("--cached");
  const output = execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const changed = output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (cached) return changed;

  const untrackedOutput = execFileSync("git", ["ls-files", "--others", "--exclude-standard"], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const untracked = untrackedOutput.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return [...new Set([...changed, ...untracked])];
}

function normalizePath(file) {
  return file.replace(/\\/g, "/").replace(/^\.\//, "");
}

function globToRegExp(pattern) {
  const normalized = normalizePath(pattern);
  let source = "";
  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index];
    const next = normalized[index + 1];
    if (char === "*" && next === "*") {
      source += ".*";
      index += 1;
    } else if (char === "*") {
      source += "[^/]*";
    } else {
      source += char.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
    }
  }
  return new RegExp(`^${source}$`);
}

function matchesTrigger(file, trigger) {
  const normalizedFile = normalizePath(file);
  const normalizedTrigger = normalizePath(trigger);
  if (normalizedTrigger.endsWith("/**")) {
    return normalizedFile.startsWith(normalizedTrigger.slice(0, -3));
  }
  if (normalizedTrigger.includes("*")) {
    return globToRegExp(normalizedTrigger).test(normalizedFile);
  }
  return normalizedFile === normalizedTrigger;
}

function recommend(files) {
  const normalizedFiles = files.map(normalizePath);
  const matches = [];

  for (const entry of manifest.validators || []) {
    const matched_files = normalizedFiles.filter((file) =>
      (entry.trigger_paths || []).some((trigger) => matchesTrigger(file, trigger))
    );
    if (matched_files.length > 0) {
      matches.push({
        id: entry.id,
        tier: entry.tier,
        domain: entry.domain,
        command: entry.command,
        estimated_runtime_class: entry.estimated_runtime_class,
        matched_files,
      });
    }
  }

  const baseCommands = [
    "node scripts/validate_validation_manifest.js",
  ];
  if (!matches.some((entry) => entry.id === "smoke")) {
    baseCommands.push("npm run validate:smoke");
  }

  const commands = [...new Set([...baseCommands, ...matches.map((entry) => entry.command)])];
  const mvpRecommended = matches.some((entry) => entry.tier === "mvp") ||
    normalizedFiles.some((file) => file === "scripts/validate_mvp_core.js" || file === "package.json");

  return {
    changed_files: normalizedFiles,
    matched_validator_count: matches.length,
    recommended_commands: commands,
    mvp_recommended: mvpRecommended,
    validate_mvp_command: "npm run validate:mvp",
    matches,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const files = args.files.length > 0 ? args.files : changedFilesFromGit(args.cached);
  const result = recommend(files);
  const output = {
    passed: true,
    recommender: "recommend_validation_for_changed_files",
    source: args.files.length > 0 ? "argv" : (args.cached ? "git_diff_cached" : "git_diff_worktree"),
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
    file_write_performed: false,
    ...result,
  };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

main();
