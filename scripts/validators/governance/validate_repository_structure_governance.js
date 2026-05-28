#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../../..");
const checks = [];

const validatorBucketRules = [
  ["readonly_visual_review", (name) => name.startsWith("validate_visual_eval_readonly_")],
  ["readonly_operator_console", (name) => name.startsWith("validate_readonly_operator_console")],
  ["visual_eval", (name) => name.startsWith("validate_visual_eval_")],
  ["review_console", (name) => name.startsWith("validate_review_console")],
  ["legacy_versioned", (name) => /^validate_v\d/.test(name)],
  ["provider_preflight", (name) => /^validate_exact_a5|^validate_provider|^validate_retry/.test(name)],
  ["autopilot_governance", (name) => /^validate_autopilot|^validate_agent_board|^validate_smart/.test(name)],
  ["capsule", (name) => /^validate_capsule|^validate_preview/.test(name)],
  ["runtime", (name) => /^validate_runtime|^validate_durable|^validate_review_bridge/.test(name)],
];

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

function wrapperDelegatesTo(wrapperContent, implementationPath) {
  const slashPath = implementationPath.replace(/^scripts\//, "./");
  return wrapperContent.includes(implementationPath) || wrapperContent.includes(slashPath);
}

function rootValidatorNames() {
  return fs.readdirSync(path.join(root, "scripts"), { withFileTypes: true })
    .filter((entry) => entry.isFile() && /^validate_.*\.js$/.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

function bucketRootValidators(names) {
  const counts = Object.fromEntries(validatorBucketRules.map(([bucket]) => [bucket, 0]));
  counts.other = 0;

  for (const name of names) {
    const matched = validatorBucketRules.find(([, predicate]) => predicate(name));
    counts[matched ? matched[0] : "other"] += 1;
  }

  return counts;
}

function main() {
  const standardPath = "docs/REPOSITORY_ORGANIZATION_STANDARD.md";
  const structurePath = "docs/PROJECT_STRUCTURE.md";
  const validatorReadmePath = "scripts/validators/README.md";
  const validatorIndexPath = "scripts/validators/VALIDATOR_INDEX.md";
  const rootWrapperPath = "scripts/validate_repository_structure_governance.js";
  const implementationPath = "scripts/validators/governance/validate_repository_structure_governance.js";
  const readonlyOperatorWrapperPath = "scripts/validate_readonly_operator_console_static_surface.js";
  const readonlyOperatorImplementationPath = "scripts/validators/readonly_operator_console/validate_readonly_operator_console_static_surface.js";

  add("repository_organization_standard_exists", exists(standardPath), standardPath);
  add("project_structure_exists", exists(structurePath), structurePath);
  add("validator_layout_readme_exists", exists(validatorReadmePath), validatorReadmePath);
  add("validator_index_exists", exists(validatorIndexPath), validatorIndexPath);
  add("root_compatibility_wrapper_exists", exists(rootWrapperPath), rootWrapperPath);
  add("governance_validator_implementation_exists", exists(implementationPath), implementationPath);
  add("readonly_operator_console_wrapper_exists", exists(readonlyOperatorWrapperPath), readonlyOperatorWrapperPath);
  add("readonly_operator_console_implementation_exists", exists(readonlyOperatorImplementationPath), readonlyOperatorImplementationPath);

  const standard = exists(standardPath) ? read(standardPath) : "";
  const structure = exists(structurePath) ? read(structurePath) : "";
  const validatorReadme = exists(validatorReadmePath) ? read(validatorReadmePath) : "";
  const validatorIndex = exists(validatorIndexPath) ? read(validatorIndexPath) : "";
  const rootWrapper = exists(rootWrapperPath) ? read(rootWrapperPath) : "";
  const readonlyOperatorWrapper = exists(readonlyOperatorWrapperPath) ? read(readonlyOperatorWrapperPath) : "";
  const rootValidators = rootValidatorNames();
  const validatorBuckets = bucketRootValidators(rootValidators);

  add("project_structure_references_standard", structure.includes(standardPath), standardPath);
  add("validator_readme_references_standard", validatorReadme.includes(standardPath), standardPath);
  add("validator_readme_references_index", validatorReadme.includes(validatorIndexPath), validatorIndexPath);
  add("project_structure_references_validator_index", structure.includes(validatorIndexPath), validatorIndexPath);
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
  add(
    "root_wrapper_delegates_to_governance_validator",
    wrapperDelegatesTo(rootWrapper, implementationPath)
  );
  add(
    "readonly_operator_console_wrapper_delegates_to_implementation",
    wrapperDelegatesTo(readonlyOperatorWrapper, readonlyOperatorImplementationPath)
  );
  add(
    "validator_index_lists_current_splits",
    includesAll(validatorIndex, [
      implementationPath,
      rootWrapperPath,
      readonlyOperatorImplementationPath,
      readonlyOperatorWrapperPath,
    ])
  );
  add(
    "validator_index_root_total_matches",
    validatorIndex.includes(`root_validator_total: ${rootValidators.length}`),
    `expected root_validator_total: ${rootValidators.length}`
  );
  for (const [bucket, count] of Object.entries(validatorBuckets)) {
    add(
      `validator_index_bucket_${bucket}_matches`,
      validatorIndex.includes(`| \`${bucket}\` | ${count} |`),
      `expected ${bucket}: ${count}`
    );
  }
  add(
    "validator_index_split_rules_present",
    includesAll(validatorIndex, [
      "Move one family at a time.",
      "Keep the old root path as a wrapper",
      "Do not change `package.json` scripts unless the task explicitly targets the",
    ])
  );

  const failed = checks.filter((check) => !check.passed);
  const result = {
    validator: "validate_repository_structure_governance",
    passed: failed.length === 0,
    files_checked: [
      standardPath,
      structurePath,
      validatorReadmePath,
      validatorIndexPath,
      rootWrapperPath,
      implementationPath,
      readonlyOperatorWrapperPath,
      readonlyOperatorImplementationPath,
    ],
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
