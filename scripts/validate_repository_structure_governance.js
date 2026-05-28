#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const checks = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function add(check, passed, detail) {
  checks.push({
    check,
    passed: Boolean(passed),
    ...(detail === undefined ? {} : { detail }),
  });
}

function includesAll(content, tokens) {
  return tokens.every((token) => content.includes(token));
}

function forbiddenPositiveClaim(content) {
  const forbidden = [
    "authorizes physical moves",
    "authorizes deletion",
    "authorizes provider contact",
    "authorizes plugin calls",
    "authorizes API calls",
    "authorizes image generation",
    "authorizes memory writes",
    "authorizes production promotion",
    "authorizes dependency changes",
    "authorizes push",
    "authorizes tag",
    "authorizes release",
    "authorizes deploy",
  ];
  return forbidden.find((token) => content.includes(token));
}

function main() {
  const standardPath = "docs/REPOSITORY_ORGANIZATION_STANDARD.md";
  const structurePath = "docs/PROJECT_STRUCTURE.md";
  const validatorReadmePath = "scripts/validators/README.md";

  add("repository_organization_standard_exists", exists(standardPath), standardPath);
  add("project_structure_exists", exists(structurePath), structurePath);
  add("validator_layout_readme_exists", exists(validatorReadmePath), validatorReadmePath);

  const standard = exists(standardPath) ? read(standardPath) : "";
  const structure = exists(structurePath) ? read(structurePath) : "";
  const validatorReadme = exists(validatorReadmePath) ? read(validatorReadmePath) : "";

  add("project_structure_references_standard", structure.includes(standardPath), standardPath);
  add("validator_readme_references_standard", validatorReadme.includes(standardPath), standardPath);
  add(
    "standard_core_sections_present",
    includesAll(standard, [
      "## Core Rule",
      "## Top-Level Directories",
      "## Documentation",
      "## Validators",
      "## Test Fixtures",
      "## Review Console",
      "## Asset And Run Artifacts",
      "## Agent Board",
      "## Before Moving Files",
      "## Validation",
    ])
  );
  add(
    "standard_defines_index_before_move_rule",
    standard.includes("Prefer discoverability and compatibility before movement.") &&
      standard.includes("Do not start with broad directory movement.")
  );
  add(
    "standard_validator_default_path_declared",
    standard.includes("scripts/validators/<domain_or_version>/") &&
      structure.includes("New validators must default to:") &&
      validatorReadme.includes("Default layout for new validators")
  );
  add(
    "standard_root_validator_exception_bounded",
    includesAll(standard, [
      "Root-level `scripts/validate_*.js` files are legacy-compatible entry points.",
      "small governance guard",
      "document why it stays at root",
    ])
  );
  add(
    "standard_review_console_boundaries_present",
    includesAll(standard, [
      "`review_console/static_prototype/` is the safe static UI surface.",
      "do not authorize real VCPChat integration",
      "provider calls",
      "VCP memory writes",
    ])
  );
  add(
    "standard_agent_board_compaction_guard_present",
    includesAll(standard.toLowerCase(), [
      "`.agent_board/` is the active resume rail.",
      "silently delete old resume material",
    ])
  );
  add(
    "standard_non_authorization_present",
    includesAll(standard, [
      "does not authorize physical moves",
      "provider contact",
      "plugin calls",
      "API calls",
      "image generation",
      "memory writes",
      "production promotion",
      "dependency changes",
      "commit",
      "push",
      "tag",
      "release",
      "deploy",
    ])
  );
  add("standard_has_no_forbidden_positive_claims", !forbiddenPositiveClaim(standard), forbiddenPositiveClaim(standard) || "");
  add(
    "structure_maintenance_policy_references_standard",
    structure.includes("Follow `docs/REPOSITORY_ORGANIZATION_STANDARD.md` before adding or moving")
  );

  const failed = checks.filter((check) => !check.passed);
  const result = {
    validator: "validate_repository_structure_governance",
    passed: failed.length === 0,
    files_checked: [standardPath, structurePath, validatorReadmePath],
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    memory_written: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    production_candidate_002_started: false,
    Batch_005_started: false,
    failed_count: failed.length,
    errors: failed.map((check) => `${check.check}${check.detail ? `: ${check.detail}` : ""}`),
    results: checks,
  };

  console.log(JSON.stringify(result, null, 2));
  process.exit(result.passed ? 0 : 1);
}

main();
