#!/usr/bin/env node
"use strict";

const { execFileSync } = require("node:child_process");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const recommenderScript = path.join(root, "scripts", "recommend_validation_for_changed_files.js");

function parseArgs(argv) {
  return {
    includeStatus: argv.includes("--status"),
    recommenderArgs: argv.filter((arg) => arg !== "--status"),
  };
}

function gitOutput(args) {
  try {
    return execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch {
    return null;
  }
}

function quoteYaml(value) {
  return JSON.stringify(value == null ? "" : String(value));
}

function listYamlStrings(items, indent) {
  return items.map((item) => `${indent}- ${quoteYaml(item)}`);
}

function appendStringList(lines, key, items, indent) {
  if (!Array.isArray(items) || items.length === 0) {
    lines.push(`${indent}${key}: []`);
    return;
  }
  lines.push(`${indent}${key}:`);
  lines.push(...listYamlStrings(items, `${indent}  `));
}

function appendDeferredCommands(lines, key, items, indent) {
  if (!Array.isArray(items) || items.length === 0) {
    lines.push(`${indent}${key}: []`);
    return;
  }

  lines.push(`${indent}${key}:`);
  for (const item of items) {
    lines.push(`${indent}  - command: ${quoteYaml(item.command)}`);
    lines.push(`${indent}    deferred_to_command: ${quoteYaml(item.deferred_to_command)}`);
    appendStringList(lines, "matched_files", item.matched_files || [], `${indent}    `);
  }
}

function buildRecommenderArgs(argv) {
  return [
    recommenderScript,
    ...argv,
    "--next-commands=json",
  ];
}

function getRecommendation(argv) {
  const output = execFileSync(process.execPath, buildRecommenderArgs(argv), {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return JSON.parse(output);
}

function getGitStatusSummary() {
  const head = gitOutput(["rev-parse", "HEAD"]);
  const branch = gitOutput(["rev-parse", "--abbrev-ref", "HEAD"]);
  const upstream = gitOutput(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"]);
  const upstreamHead = upstream ? gitOutput(["rev-parse", upstream]) : null;
  const statusShort = gitOutput(["status", "--short"]);
  const aheadBehindRaw = upstream ? gitOutput(["rev-list", "--left-right", "--count", `${upstream}...HEAD`]) : null;
  const [behindRaw, aheadRaw] = (aheadBehindRaw || "").split(/\s+/);
  const ahead = Number.parseInt(aheadRaw || "0", 10);
  const behind = Number.parseInt(behindRaw || "0", 10);

  return {
    commit_hash: head,
    branch,
    local_equals_origin: Boolean(head && upstreamHead && head === upstreamHead),
    ahead_behind: upstream ? `${Number.isNaN(ahead) ? 0 : ahead}/${Number.isNaN(behind) ? 0 : behind}` : "unavailable",
    git_status: statusShort ? "dirty" : "clean",
  };
}

function buildStatusBlock(status) {
  return [
    `commit_hash: ${quoteYaml(status.commit_hash)}`,
    `branch: ${quoteYaml(status.branch)}`,
    `local_equals_origin: ${status.local_equals_origin ? "true" : "false"}`,
    `ahead_behind: ${quoteYaml(status.ahead_behind)}`,
    `git_status: ${quoteYaml(status.git_status)}`,
  ].join("\n");
}

function buildCloseoutValidationBlock(recommendation) {
  const lines = [
    "validation:",
    "  recommender:",
    "    command: \"npm run recommend:validation:next-commands\"",
    "    source: \"validation_decision_summary.next_commands\"",
    `    primary_profile: ${quoteYaml(recommendation.primary_profile)}`,
    `    primary_command: ${quoteYaml(recommendation.primary_command)}`,
  ];
  appendStringList(lines, "next_commands", recommendation.next_commands || [], "    ");
  appendDeferredCommands(lines, "deferred_commands", recommendation.deferred_commands || [], "    ");
  lines.push("    usage_decision: \"followed\"");
  lines.push("    usage_reason: \"Used recommender next_commands as the closeout validation plan.\"");
  return `${lines.join("\n")}\n`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const recommendation = getRecommendation(args.recommenderArgs);
  const blocks = [];
  if (args.includeStatus) {
    blocks.push(buildStatusBlock(getGitStatusSummary()));
  }
  blocks.push(buildCloseoutValidationBlock(recommendation).trimEnd());
  process.stdout.write(`${blocks.join("\n")}\n`);
}

main();
