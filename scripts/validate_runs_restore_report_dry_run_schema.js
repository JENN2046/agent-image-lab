const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const schemaRef = "schemas/runs_restore_report.schema.yaml";
const exampleRef = "tests/schema_examples/runs_restore_report.example.json";
const protocolRef = "docs/CAPSULE_RUNS_BACKUP_RESTORE_PROTOCOL.md";

function readText(projectRelativePath) {
  return fs.readFileSync(path.join(root, projectRelativePath), "utf8");
}

const schemaText = readText(schemaRef);
const example = JSON.parse(readText(exampleRef));
const protocolText = readText(protocolRef);
const checks = [];

function check(name, passed, details) {
  checks.push({ check: name, passed: Boolean(passed), ...(details ? { details } : {}) });
}

function isProjectRelativeRunsPath(value) {
  return typeof value === "string"
    && value.startsWith("runs/")
    && !path.isAbsolute(value)
    && !/^[A-Za-z]:[\\/]/.test(value)
    && !value.includes("..")
    && !value.includes("\\");
}

check("schema_exists", schemaText.includes("schema_id: runs_restore_report_dry_run_v1"));
check("example_report_version", example.report_version === "v1");
check("restore_root_runs", example.restore_root_project_relative === "runs/");
check("summary_user_reported", example.restored_path_summary?.source_type === "user_reported");
check("summary_not_filesystem_verified", example.restored_path_summary?.verified_by_filesystem_scan === false);
check("path_scope_under_runs", example.restored_path_summary?.path_scope === "project_relative_under_runs");
check("selected_paths_project_relative_runs", Array.isArray(example.restored_path_examples) && example.restored_path_examples.every(isProjectRelativeRunsPath));
check("counts_not_scanned", example.user_reported_counts?.count_source === "unknown_not_scanned" || example.user_reported_counts?.count_source === "user_reported");
check("verification_later_required", example.verification_handoff?.later_verification_required === true);
check("verification_authorization_required", example.verification_handoff?.authorization_required_before_verification === true);
check("future_hash_requires_separate_authorization", example.verification_handoff?.allowed_future_verification?.includes("hash_verification_after_separate_image_binary_read_authorization"));
check("future_dimensions_requires_separate_authorization", example.verification_handoff?.allowed_future_verification?.includes("dimensions_verification_after_separate_image_binary_read_authorization"));

const forbiddenFields = [
  "absolute_source_path",
  "absolute_restore_path",
  "cloud_drive_path",
  "secret",
  "token",
  "cookie",
  "password",
  "api_key",
  "provider_credential",
  "raw_chat_history",
  "customer_private_data",
  "image_binary_inline",
  "base64_image",
  "extracted_sha256",
  "extracted_width",
  "extracted_height",
  "preview_binary",
  "production_candidate_path"
];

for (const field of forbiddenFields) {
  check(`forbidden_field_${field}_null`, example.forbidden_fields?.[field] === null);
  check(`schema_mentions_forbidden_${field}`, schemaText.includes(field));
}

const guardFalseFields = [
  "actual_runs_scan_performed",
  "runs_mutation_performed",
  "image_binary_read_performed",
  "hash_extraction_performed",
  "dimensions_extraction_performed",
  "preview_generation_performed",
  "cloud_drive_read_performed",
  "cloud_drive_write_performed",
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "production_candidate_write_performed"
];

for (const field of guardFalseFields) {
  check(`guard_${field}_false`, example.guard?.[field] === false);
  check(`schema_guard_${field}`, schemaText.includes(field));
}

check("protocol_ref_present", /runs/i.test(protocolText) && /backup/i.test(protocolText) && /restore/i.test(protocolText));
check("schema_forbids_actual_runs_scan", schemaText.includes("actual_runs_scan_performed"));
check("schema_forbids_hash_dimensions_extraction", schemaText.includes("hash_extraction_performed") && schemaText.includes("dimensions_extraction_performed"));

const failures = checks.filter((item) => !item.passed);
const result = {
  validator: "validate_runs_restore_report_dry_run_schema",
  version: "v1",
  passed: failures.length === 0,
  status: failures.length === 0 ? "runs_restore_report_dry_run_schema_verified" : "runs_restore_report_dry_run_schema_failed",
  schema_ref: schemaRef,
  example_ref: exampleRef,
  actual_runs_scan_performed: false,
  runs_mutation_performed: false,
  image_binary_read_performed: false,
  hash_extraction_performed: false,
  dimensions_extraction_performed: false,
  preview_generation_performed: false,
  cloud_drive_read_performed: false,
  cloud_drive_write_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  production_candidate_write_performed: false,
  check_count: checks.length,
  failed_count: failures.length,
  checks,
  failures
};

console.log(JSON.stringify(result, null, 2));
process.exit(result.passed ? 0 : 1);