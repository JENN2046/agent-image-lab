"use strict";

const fs = require("node:fs");
const YAML = require("yaml");
const {
  classifyManifestFailures,
  createFailureClassSummary,
  MANIFEST_FAILURE_CLASS_SUMMARY_KEYS,
} = require("./capsule_status_taxonomy");

const ACCEPTED_ROOT = "asset_archive/accepted_samples";
const FAILURE_ROOT = "asset_archive/failure_samples";
const SCHEMA_REF = "schemas/capsule_manifest_contract.schema.yaml";
const REQUIRED_LONG_EDGE = 512;
const COMMON_GUARD_FALSE_FIELDS = [
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "image_generation_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "runtime_execution_performed",
  "real_manifest_read_performed",
  "real_vcpchat_read_performed",
  "real_vcptoolbox_read_performed",
];
const MANIFEST_GUARD_FALSE_FIELDS = [
  ...COMMON_GUARD_FALSE_FIELDS,
  "production_candidate_created",
  "push_tag_release_deploy_performed",
];
const COMMON_TOP_LEVEL_FALSE_FIELDS = [
  "production_candidate_allowed",
  "memory_write_allowed",
  "DailyNote_write_allowed",
];
const ACCEPTED_TOP_LEVEL_FALSE_FIELDS = [
  ...COMMON_TOP_LEVEL_FALSE_FIELDS,
  "VCP_memory_write_allowed",
  "commercial_delivery_allowed",
];
const FAILURE_TOP_LEVEL_FALSE_FIELDS = COMMON_TOP_LEVEL_FALSE_FIELDS;
const FAIL_CLOSED_CLASSES = [
  "missing_capsule_manifest",
  "manifest_contract_mismatch",
  "missing_preview_file",
  "invalid_preview_signature",
  "preview_long_edge_mismatch",
  "preview_hash_mismatch",
  "missing_chain_file",
  "chain_record_mismatch",
  "production_or_memory_guard_violation",
];

function capsuleRoot(lane, sampleId) {
  if (typeof sampleId !== "string" || !/^[A-Za-z0-9_.-]+$/.test(sampleId)) {
    throw new Error(`invalid capsule sample id: ${sampleId}`);
  }
  if (lane === "accepted") return `${ACCEPTED_ROOT}/${sampleId}`;
  if (lane === "failure") return `${FAILURE_ROOT}/${sampleId}`;
  throw new Error(`unsupported capsule lane: ${lane}`);
}

function chainSpec(lane) {
  if (lane === "accepted") {
    return {
      manifestType: "git_portable_preview_capsule_manifest",
      files: {
        import_record: { file: "import_record.json", type: "git_portable_preview_capsule_import_record" },
        review_record: { file: "review_record.json", type: "git_portable_preview_capsule_review_record" },
        approval_record: { file: "approval_record.json", type: "git_portable_preview_capsule_approval_record" },
      },
    };
  }
  return {
    manifestType: "git_portable_failure_sample_capsule_manifest",
    files: {
      failure_record: { file: "failure_record.json", type: "git_portable_failure_sample_capsule_failure_record" },
      review_record: { file: "review_record.json", type: "git_portable_failure_sample_capsule_review_record" },
    },
  };
}

function validateGuardFalse(value, prefix, failures) {
  const guard = value || {};
  for (const field of COMMON_GUARD_FALSE_FIELDS) {
    if (guard[field] !== false) failures.push(`${prefix}_guard_${field}_false`);
  }
}

function arraysEqual(left, right) {
  return Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((value, index) => value === right[index]);
}

function loadCapsuleManifestSchema(core, schemaRef = SCHEMA_REF) {
  if (!core.exists(schemaRef)) {
    return { schema: null, schemaRef, failures: ["schema_exists"] };
  }
  const schemaText = core.read(schemaRef);
  const parsed = YAML.parse(schemaText);
  return { schema: parsed?.capsule_manifest_contract_schema || null, schemaRef, failures: parsed?.capsule_manifest_contract_schema ? [] : ["schema_root_present"] };
}

function validateSchemaRuntimeBinding(schema) {
  const failures = [];
  const acceptedSpec = chainSpec("accepted");
  const failureSpec = chainSpec("failure");
  const check = (condition, label) => { if (!condition) failures.push(label); };

  check(schema?.version === "v1", "schema_version_v1");
  check(schema?.accepted_manifest_type === acceptedSpec.manifestType, "schema_accepted_manifest_type_matches_runtime");
  check(schema?.failure_manifest_type === failureSpec.manifestType, "schema_failure_manifest_type_matches_runtime");
  check(arraysEqual(schema?.accepted_chain_required, Object.keys(acceptedSpec.files)), "schema_accepted_chain_matches_runtime");
  check(arraysEqual(schema?.failure_chain_required, Object.keys(failureSpec.files)), "schema_failure_chain_matches_runtime");
  check(arraysEqual(schema?.fail_closed_classes, FAIL_CLOSED_CLASSES), "schema_fail_closed_classes_match_runtime");
  check(arraysEqual(schema?.guard_required_false, COMMON_GUARD_FALSE_FIELDS), "schema_common_guard_fields_match_runtime");
  check(arraysEqual(schema?.manifest_guard_required_false, MANIFEST_GUARD_FALSE_FIELDS), "schema_manifest_guard_fields_match_runtime");
  check(arraysEqual(schema?.accepted_top_level_required_false, ACCEPTED_TOP_LEVEL_FALSE_FIELDS), "schema_accepted_top_level_false_fields_match_runtime");
  check(arraysEqual(schema?.failure_top_level_required_false, FAILURE_TOP_LEVEL_FALSE_FIELDS), "schema_failure_top_level_false_fields_match_runtime");
  check(schema?.forbidden_authorizations?.provider_contact_performed === true, "schema_forbidden_authorizations_present");
  return { passed: failures.length === 0, failures };
}

function validateCapsuleManifest(core, lane, sampleId, options = {}) {
  const requiredLongEdge = options.requiredLongEdge || REQUIRED_LONG_EDGE;
  const root = capsuleRoot(lane, sampleId);
  const spec = chainSpec(lane);
  const manifestRef = `${root}/manifest.json`;
  const manifest = core.parseJsonIfExists(manifestRef);
  const failures = [];
  const check = (condition, label) => { if (!condition) failures.push(label); };

  check(Boolean(manifest), "manifest_exists");
  if (!manifest) {
    return { lane, sample_id: sampleId, passed: false, manifest_validation_status: "manifest_missing", manifest_ref: manifestRef, preview_ref: `${root}/preview.webp`, preview_sha256: null, preview_long_edge: null, chain_refs: [], failures, failure_classes: classifyManifestFailures(failures) };
  }

  const previewPath = manifest.artifact?.preview?.path || "preview.webp";
  const previewRef = `${root}/${previewPath}`;
  const previewExists = core.exists(previewRef);
  const previewSha256 = previewExists ? core.sha256File(previewRef) : null;
  const previewDimensions = previewExists ? core.readWebpDimensions(previewRef) : null;
  const previewLongEdge = previewDimensions?.width && previewDimensions?.height ? Math.max(previewDimensions.width, previewDimensions.height) : null;
  const text = JSON.stringify(manifest);

  check(manifest.manifest_type === spec.manifestType, "manifest_type_matches");
  check(manifest.version === "v1", "manifest_version_v1");
  check(manifest.sample_id === sampleId, "sample_id_matches");
  check(previewPath === "preview.webp", "preview_path_matches");
  check(manifest.artifact?.preview?.format === "webp", "preview_format_webp");
  check(manifest.artifact?.preview?.long_edge === requiredLongEdge, "preview_manifest_long_edge_matches");
  check(manifest.artifact?.preview?.git_tracked === true, "preview_git_tracked_true");
  check(manifest.artifact?.original?.required_for_portable_validation === false, "original_not_required");
  check(!text.includes("base64"), "base64_absent_from_manifest");
  check(previewExists, "preview_file_exists");
  check(previewDimensions?.signatureValid === true, "preview_webp_signature_valid");
  check(previewLongEdge === requiredLongEdge, "preview_file_long_edge_matches");
  check(Boolean(manifest.artifact?.preview?.sha256), "preview_manifest_sha256_present");
  check(previewSha256 === manifest.artifact?.preview?.sha256, "preview_sha256_matches_manifest");
  validateGuardFalse(manifest.guard, "manifest", failures);
  for (const field of MANIFEST_GUARD_FALSE_FIELDS.filter((item) => !COMMON_GUARD_FALSE_FIELDS.includes(item))) {
    check(manifest.guard?.[field] === false, `manifest_guard_${field}_false`);
  }

  const topLevelFalseFields = lane === "accepted" ? ACCEPTED_TOP_LEVEL_FALSE_FIELDS : FAILURE_TOP_LEVEL_FALSE_FIELDS;
  for (const field of topLevelFalseFields) check(manifest[field] === false, `${field}_false`);

  const chainRefs = [];
  for (const [chainKey, expected] of Object.entries(spec.files)) {
    const fileName = manifest.chain?.[chainKey] || expected.file;
    const ref = `${root}/${fileName}`;
    chainRefs.push(ref);
    const record = core.parseJsonIfExists(ref);
    check(Boolean(record), `${chainKey}_exists`);
    if (record) {
      check(record.record_type === expected.type, `${chainKey}_record_type_matches`);
      check(record.sample_id === sampleId, `${chainKey}_sample_id_matches`);
      validateGuardFalse(record.guard, chainKey, failures);
      if (lane === "failure" && chainKey === "review_record") {
        check(record.review_summary?.final_route === "failure_learning_only_never_production", "failure_review_final_route_matches");
      }
    }
  }

  return { lane, sample_id: sampleId, passed: failures.length === 0, manifest_validation_status: failures.length === 0 ? "capsule_manifest_contract_verified" : "capsule_manifest_contract_failed", manifest_ref: manifestRef, preview_ref: previewRef, preview_sha256: previewSha256, preview_width: previewDimensions?.width || null, preview_height: previewDimensions?.height || null, preview_long_edge: previewLongEdge, chain_refs: chainRefs, failures, failure_classes: classifyManifestFailures(failures) };
}

function listCapsules(core, lane) {
  const root = lane === "accepted" ? ACCEPTED_ROOT : FAILURE_ROOT;
  const rootPath = core.repoPath(root);
  return fs.readdirSync(rootPath, { withFileTypes: true }).filter((entry) => entry.isDirectory() && !entry.name.startsWith(".tmp-")).map((entry) => entry.name).sort((left, right) => left.localeCompare(right));
}

function validateAllCapsuleManifests(core, options = {}) {
  const schemaLoad = loadCapsuleManifestSchema(core, options.schemaRef);
  const schemaBinding = schemaLoad.schema ? validateSchemaRuntimeBinding(schemaLoad.schema) : { passed: false, failures: schemaLoad.failures };
  const accepted = listCapsules(core, "accepted").map((sampleId) => validateCapsuleManifest(core, "accepted", sampleId, options));
  const failure = listCapsules(core, "failure").map((sampleId) => validateCapsuleManifest(core, "failure", sampleId, options));
  const samples = accepted.concat(failure);
  const failed = samples.filter((sample) => !sample.passed);
  const failureClassSummary = createFailureClassSummary(MANIFEST_FAILURE_CLASS_SUMMARY_KEYS);
  for (const sample of samples) for (const failureClass of sample.failure_classes) failureClassSummary[failureClass] = (failureClassSummary[failureClass] || 0) + 1;
  const passed = failed.length === 0 && schemaBinding.passed;
  return { passed, status: passed ? "capsule_manifest_contract_verified" : "capsule_manifest_contract_failed", report_version: "capsule_manifest_contract_v1", schema_ref: schemaLoad.schemaRef, schema_runtime_binding_status: schemaBinding.passed ? "schema_runtime_binding_verified" : "schema_runtime_binding_failed", schema_runtime_binding_failures: schemaBinding.failures, totals: { accepted: accepted.length, failure: failure.length, total: samples.length, passed: samples.length - failed.length, failed: failed.length }, samples, failed_sample_ids: failed.map((sample) => sample.sample_id), failure_class_summary: failureClassSummary, guard: { static_validator_only: true, preview_creation_or_copy_performed: false, provider_contact_performed: false, plugin_call_performed: false, api_call_performed: false, image_generation_performed: false, DailyNote_write_performed: false, VCP_memory_write_performed: false, runtime_execution_performed: false, real_manifest_read_performed: false, real_vcpchat_read_performed: false, real_vcptoolbox_read_performed: false, push_tag_release_deploy_performed: false } };
}

module.exports = { ACCEPTED_ROOT, FAILURE_ROOT, SCHEMA_REF, REQUIRED_LONG_EDGE, classifyFailures: classifyManifestFailures, loadCapsuleManifestSchema, validateSchemaRuntimeBinding, validateCapsuleManifest, validateAllCapsuleManifests };
