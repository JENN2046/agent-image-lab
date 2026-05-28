#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { createRecoverabilityCore } = require("../../lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "../../..");
const core = createRecoverabilityCore(root);
const files = {
  app: "review_console/static_prototype/app.js",
  index: "review_console/static_prototype/index.html",
  styles: "review_console/static_prototype/styles.css",
  mock: "review_console/static_prototype/mock_data.js",
  fieldMapping: "review_console/static_prototype/FIELD_MAPPING.md",
  readme: "review_console/static_prototype/README.md"
};
const checks = [];
const add = (check, passed, detail = null) => checks.push({ check, passed: Boolean(passed), ...(detail === null ? {} : { detail }) });
for (const [key, file] of Object.entries(files)) add(`${key}_exists`, core.exists(file), file);
const app = core.read(files.app);
const index = core.read(files.index);
const styles = core.read(files.styles);
const mock = core.read(files.mock);
const fieldMapping = core.read(files.fieldMapping);
const readme = core.read(files.readme);
for (const token of ["unified_capsule_contract_report", "capsule_manifest_contract_v1", "manifest_validation_status", "relation_validation_status", "guard_validation_status"]) add(`mock_token_${token}`, mock.includes(token));
for (const token of ["unifiedCapsuleContractReportState", "renderUnifiedCapsuleContractReport", "unified_capsule_contract_report: unifiedCapsuleContractReportState()"]) add(`app_token_${token}`, app.includes(token));
for (const token of ["unifiedCapsuleContractSummary", "unifiedCapsuleContractRows", "unifiedCapsuleContractGuard"]) add(`index_token_${token}`, index.includes(token));
add("styles_include_dashboard", styles.includes("unified-capsule-contract-dashboard"));
for (const token of ["unified_capsule_contract_report", "manifest_validation_status", "relation_validation_status", "guard_validation_status"]) {
  add(`field_mapping_token_${token}`, fieldMapping.includes(token));
  add(`readme_token_${token}`, readme.includes(token));
}
for (const token of ["asset_archive_read_performed: false", "preview_loaded_or_rendered: false", "provider_contact_performed: false", "VCP_memory_write_performed: false"]) add(`mock_guard_${token}`, mock.includes(token));
const failed = checks.filter((check) => !check.passed);
const output = { validator: "validate_review_console_unified_capsule_contract", version: "v1", passed: failed.length === 0, status: failed.length === 0 ? "review_console_unified_capsule_contract_verified" : "review_console_unified_capsule_contract_failed", check_count: checks.length, failed_count: failed.length, draft_output_key: "unified_capsule_contract_report", checks, failures: failed };
console.log(JSON.stringify(output, null, 2));
process.exit(output.passed ? 0 : 1);
