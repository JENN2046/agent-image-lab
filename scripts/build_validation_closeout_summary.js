#!/usr/bin/env node
"use strict";

const { execFileSync } = require("node:child_process");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const recommenderScript = path.join(root, "scripts", "recommend_validation_for_changed_files.js");

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
  const recommendation = getRecommendation(process.argv.slice(2));
  process.stdout.write(buildCloseoutValidationBlock(recommendation));
}

main();
