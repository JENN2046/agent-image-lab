#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const {
  BASE_NO_EXECUTION_GUARD,
} = require("../../lib/capsule_creator_common");
const {
  COMMON_GUARD_FALSE_FIELDS,
  MANIFEST_GUARD_FALSE_FIELDS,
  ACCEPTED_TOP_LEVEL_FALSE_FIELDS,
  FAILURE_TOP_LEVEL_FALSE_FIELDS,
} = require("../../lib/capsule_manifest_contract");

const repoRoot = path.resolve(__dirname, "../../..");
const acceptedCreatorPath = path.join(repoRoot, "scripts", "create_preview_capsule.js");
const failureCreatorPath = path.join(repoRoot, "scripts", "create_failure_sample_capsule.js");
const acceptedCreatorText = fs.readFileSync(acceptedCreatorPath, "utf8");
const failureCreatorText = fs.readFileSync(failureCreatorPath, "utf8");

function expect(condition, check, detail = null) {
  return {
    check,
    passed: Boolean(condition),
    ...(detail === null ? {} : { detail }),
  };
}

function sourceWritesFalseFields(sourceText, fields) {
  return fields.every((field) => new RegExp(`\\b${field}:\\s*false\\b`).test(sourceText));
}

function missingFalseFields(sourceText, fields) {
  return fields.filter((field) => !new RegExp(`\\b${field}:\\s*false\\b`).test(sourceText));
}

const manifestOnlyGuardFields = MANIFEST_GUARD_FALSE_FIELDS.filter(
  (field) => !COMMON_GUARD_FALSE_FIELDS.includes(field)
);

const checks = [];
checks.push(expect(
  COMMON_GUARD_FALSE_FIELDS.every((field) => BASE_NO_EXECUTION_GUARD[field] === false),
  "common_helper_base_guard_covers_contract_common_guard_fields",
  { fields: COMMON_GUARD_FALSE_FIELDS }
));
checks.push(expect(
  acceptedCreatorText.includes("guard: commonGuard"),
  "accepted_creator_manifest_uses_common_guard"
));
checks.push(expect(
  failureCreatorText.includes("guard: commonGuard"),
  "failure_creator_manifest_uses_common_guard"
));
checks.push(expect(
  sourceWritesFalseFields(acceptedCreatorText, manifestOnlyGuardFields),
  "accepted_creator_writes_manifest_only_guard_false_fields",
  { missing: missingFalseFields(acceptedCreatorText, manifestOnlyGuardFields) }
));
checks.push(expect(
  sourceWritesFalseFields(failureCreatorText, manifestOnlyGuardFields),
  "failure_creator_writes_manifest_only_guard_false_fields",
  { missing: missingFalseFields(failureCreatorText, manifestOnlyGuardFields) }
));
checks.push(expect(
  sourceWritesFalseFields(acceptedCreatorText, ACCEPTED_TOP_LEVEL_FALSE_FIELDS),
  "accepted_creator_writes_contract_top_level_false_fields",
  { missing: missingFalseFields(acceptedCreatorText, ACCEPTED_TOP_LEVEL_FALSE_FIELDS) }
));
checks.push(expect(
  sourceWritesFalseFields(failureCreatorText, FAILURE_TOP_LEVEL_FALSE_FIELDS),
  "failure_creator_writes_contract_top_level_false_fields",
  { missing: missingFalseFields(failureCreatorText, FAILURE_TOP_LEVEL_FALSE_FIELDS) }
));
checks.push(expect(
  acceptedCreatorText.includes("boolArg(\"confirm-create\") ? await createCapsule(sample) : planOnly(sample)"),
  "accepted_creator_preserves_confirm_create_gate"
));
checks.push(expect(
  failureCreatorText.includes("boolArg(\"confirm-create\") ? await createCapsule(sample) : planOnly(sample)"),
  "failure_creator_preserves_confirm_create_gate"
));
checks.push(expect(
  acceptedCreatorText.includes("tempTargetRoot") && acceptedCreatorText.includes("renamePath"),
  "accepted_creator_preserves_temp_dir_then_rename"
));
checks.push(expect(
  failureCreatorText.includes("tempTargetRoot") && failureCreatorText.includes("renamePath"),
  "failure_creator_preserves_temp_dir_then_rename"
));

const failed = checks.filter((check) => !check.passed);
const result = {
  validator: "validate_capsule_creator_manifest_contract_regression",
  version: "v1",
  passed: failed.length === 0,
  status: failed.length === 0
    ? "capsule_creator_manifest_contract_regression_verified"
    : "capsule_creator_manifest_contract_regression_failed",
  check_count: checks.length,
  failed_count: failed.length,
  contract_source: "scripts/lib/capsule_manifest_contract.js",
  accepted_creator: "scripts/create_preview_capsule.js",
  failure_creator: "scripts/create_failure_sample_capsule.js",
  accepted_top_level_contract_fields: ACCEPTED_TOP_LEVEL_FALSE_FIELDS,
  failure_top_level_contract_fields: FAILURE_TOP_LEVEL_FALSE_FIELDS,
  manifest_guard_contract_fields: MANIFEST_GUARD_FALSE_FIELDS,
  static_validator_only: true,
  real_capsule_created: false,
  preview_creation_or_copy_performed: false,
  image_generation_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  runtime_execution_performed: false,
  real_manifest_read_performed: false,
  real_vcpchat_read_performed: false,
  real_vcptoolbox_read_performed: false,
  production_candidate_write_performed: false,
  push_tag_release_deploy_performed: false,
  checks,
  failures: failed,
};

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
process.exit(result.passed ? 0 : 1);
