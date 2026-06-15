#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const workflowRef = ".github/workflows/validate-active.yml";
const workflowPath = path.join(repoRoot, workflowRef);
const checks = [];

function add(check, passed, detail) {
  checks.push({
    check,
    passed: Boolean(passed),
    ...(detail === undefined ? {} : { detail }),
  });
}

function readWorkflow() {
  return fs.readFileSync(workflowPath, "utf8");
}

function hasLine(text, line) {
  return text.split(/\r?\n/).some((candidate) => candidate.trim() === line);
}

function includes(text, value) {
  return text.includes(value);
}

function main() {
  const workflow = readWorkflow();

  add("workflow_exists", fs.existsSync(workflowPath), workflowRef);
  add("workflow_name_is_stable", hasLine(workflow, "name: Validate Active"));
  add("push_to_master_enabled", includes(workflow, "push:") && includes(workflow, "      - master"));
  add("pull_request_to_master_enabled", includes(workflow, "pull_request:") && includes(workflow, "      - master"));
  add("permissions_are_read_only", includes(workflow, "permissions:\n  contents: read"));
  add("uses_checkout_v4", hasLine(workflow, "uses: actions/checkout@v4"));
  add("uses_setup_node_v4", hasLine(workflow, "uses: actions/setup-node@v4"));
  add("node_version_matches_local_baseline", hasLine(workflow, "node-version: 24.x"));
  add("npm_cache_enabled", hasLine(workflow, "cache: npm"));
  add("uses_lockfile_install", hasLine(workflow, "run: npm ci"));
  add("runs_active_validation", hasLine(workflow, "run: npm run validate:active"));
  add("timeout_is_bounded", hasLine(workflow, "timeout-minutes: 15"));
  add("no_secret_reference", !/secrets\./.test(workflow));
  add("no_write_permissions", !/contents:\s*write|write-all/.test(workflow));
  add("no_remote_mutation_commands", !/\b(git\s+push|gh\s+release|npm\s+publish)\b/.test(workflow));

  const failed = checks.filter((check) => !check.passed);
  const output = {
    passed: failed.length === 0,
    validator: "github_actions_validate_active_workflow",
    workflow_ref: workflowRef,
    check_count: checks.length,
    failed_count: failed.length,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
    file_write_performed: false,
    results: checks,
  };

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  process.exit(output.passed ? 0 : 1);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${JSON.stringify({
    passed: false,
    validator: "github_actions_validate_active_workflow",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
