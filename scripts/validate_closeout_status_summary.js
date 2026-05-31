#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const closeoutHelperScript = path.join(root, "scripts", "build_validation_closeout_summary.js");

const checks = [];

function add(check, passed, detail) {
  checks.push({
    check,
    passed: Boolean(passed),
    ...(detail === undefined ? {} : { detail }),
  });
}

function commandOutput(command, args) {
  return execFileSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function gitOutput(args) {
  return commandOutput("git", args);
}

function expectedGitStatus() {
  const head = gitOutput(["rev-parse", "HEAD"]);
  const branch = gitOutput(["rev-parse", "--abbrev-ref", "HEAD"]);
  const upstream = gitOutput(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"]);
  const upstreamHead = gitOutput(["rev-parse", upstream]);
  const statusShort = gitOutput(["status", "--short"]);
  const [behindRaw, aheadRaw] = gitOutput(["rev-list", "--left-right", "--count", `${upstream}...HEAD`]).split(/\s+/);
  const ahead = Number.parseInt(aheadRaw || "0", 10);
  const behind = Number.parseInt(behindRaw || "0", 10);

  return {
    commit_hash: head,
    branch,
    local_equals_origin: head === upstreamHead,
    ahead_behind: `${Number.isNaN(ahead) ? 0 : ahead}/${Number.isNaN(behind) ? 0 : behind}`,
    git_status: statusShort ? "dirty" : "clean",
  };
}

function runCloseoutStatusSummary() {
  return commandOutput("node", [
    closeoutHelperScript,
    "--status",
    "--files",
    "package.json",
  ]);
}

function main() {
  const expected = expectedGitStatus();
  const output = runCloseoutStatusSummary();
  const lines = output.split(/\r?\n/);
  const statusBlock = lines.slice(0, 5);

  add("status_block_first", lines[0]?.startsWith("commit_hash: "), statusBlock);
  add("commit_hash_matches_head", output.includes(`commit_hash: "${expected.commit_hash}"`), expected.commit_hash);
  add("branch_matches_current_branch", output.includes(`branch: "${expected.branch}"`), expected.branch);
  add(
    "local_equals_origin_matches_upstream_head",
    output.includes(`local_equals_origin: ${expected.local_equals_origin ? "true" : "false"}`),
    expected.local_equals_origin
  );
  add("ahead_behind_matches_upstream", output.includes(`ahead_behind: "${expected.ahead_behind}"`), expected.ahead_behind);
  add("git_status_matches_worktree", output.includes(`git_status: "${expected.git_status}"`), expected.git_status);
  add("validation_block_still_present", output.includes("validation:") && output.includes("recommender:"));
  add("next_commands_still_present", output.includes("next_commands:") && output.includes('- "npm run validate:active"'));
  add("daily_profile_still_selected_for_package_json", output.includes('primary_profile: "daily"'));

  const failed = checks.filter((check) => !check.passed);
  const result = {
    passed: failed.length === 0,
    validator: "validate_closeout_status_summary",
    failed_count: failed.length,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
    file_write_performed: false,
    checks,
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  process.exit(result.passed ? 0 : 1);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${JSON.stringify({
    passed: false,
    validator: "validate_closeout_status_summary",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
