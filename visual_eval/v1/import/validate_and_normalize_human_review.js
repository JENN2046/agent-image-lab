"use strict";

const fs = require("fs");
const path = require("path");
const { validateBundle } = require("../validate_local_visual_eval.js");

const EXIT_OK = 0;
const EXIT_POLICY_ERROR = 2;
const EXIT_TOOL_ERROR = 1;

const REQUIRED_IMPORT_SCHEMA_VERSION = "1.0.0";
const IMPORT_KEYS = [
  "import_schema_version",
  "import_id",
  "record_origin",
  "reviewer_alias",
  "reviewed_at",
  "consent_basis",
  "source_disposition",
  "sanitization_attestation",
  "sample"
];
const ATTESTATION_KEYS = [
  "raw_source_retained",
  "contains_personal_data",
  "contains_secret",
  "contains_absolute_path"
];
const IMPORT_POLICY_KEYS = [
  "policy_version",
  "compatible_import_schema_versions",
  "required_import_fields",
  "allowed_record_origins",
  "forbidden_record_origins",
  "allowed_consent_basis",
  "required_source_disposition",
  "raw_source_storage_allowed",
  "required_sanitization_attestation",
  "import_id_contract",
  "reviewed_at_contract",
  "reviewer_alias_contract",
  "unsafe_pattern_classes",
  "forbidden_key_rules",
  "unsafe_string_rules",
  "stable_violation_codes",
  "normalization"
];
const REVIEWER_ALIAS_PATTERN_SOURCE = "^[a-z][a-z0-9_]{2,63}$";
const IMPORT_ID_PATTERN_SOURCE = "^import_[a-z0-9]+(?:_[a-z0-9]+)*_[0-9]{3}$";
const REVIEWED_AT_PATTERN_SOURCE = "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{3})?(?:Z|[+-]\\d{2}:\\d{2})$";
const REQUIRED_UNSAFE_PATTERN_CLASSES = [
  "email_address",
  "telephone_number",
  "bearer_token",
  "api_key_assignment",
  "secret_key_prefix",
  "jwt_like_token",
  "credential_bearing_url",
  "absolute_windows_path",
  "absolute_unix_path",
  "UNC_path",
  "file_url",
  "parent_directory_traversal",
  "raw_payload_field",
  "cookie_or_session_field"
];
const EMITTED_VIOLATION_CODES = [
  "UNSUPPORTED_IMPORT_SCHEMA_VERSION",
  "UNKNOWN_IMPORT_FIELD",
  "MISSING_IMPORT_FIELD",
  "INVALID_IMPORT_ID",
  "INVALID_REVIEWED_AT",
  "IMPORT_SCHEMA_INVALID",
  "IMPORT_POLICY_INVALID",
  "INVALID_RECORD_ORIGIN",
  "INVALID_CONSENT_BASIS",
  "RAW_SOURCE_RETENTION_FORBIDDEN",
  "SANITIZATION_ATTESTATION_FAILED",
  "INVALID_REVIEWER_ALIAS",
  "PERSONAL_DATA_PATTERN_DETECTED",
  "SECRET_PATTERN_DETECTED",
  "ABSOLUTE_PATH_DETECTED",
  "PATH_TRAVERSAL_DETECTED",
  "CREDENTIAL_URL_DETECTED",
  "RAW_PAYLOAD_FIELD_FORBIDDEN",
  "IMPORT_SAMPLE_INVALID",
  "IMPORT_DECISION_MISMATCH"
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function addViolation(violations, code, pathRef, message) {
  violations.push({ code, path: pathRef, message });
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function sortViolations(violations) {
  return violations.slice().sort((left, right) => {
    const pathCompare = left.path.localeCompare(right.path);
    if (pathCompare !== 0) {
      return pathCompare;
    }
    return left.code.localeCompare(right.code);
  });
}

function compilePolicyRegexRule(rule, pathRef, violations) {
  if (!isObject(rule)) {
    addViolation(violations, "IMPORT_POLICY_INVALID", pathRef, "Policy rule must be an object.");
    return null;
  }
  if (!EMITTED_VIOLATION_CODES.includes(rule.code)) {
    addViolation(violations, "IMPORT_POLICY_INVALID", `${pathRef}.code`, "Policy rule emits an unknown violation code.");
    return null;
  }
  if (!isNonEmptyString(rule.pattern)) {
    addViolation(violations, "IMPORT_POLICY_INVALID", `${pathRef}.pattern`, "Policy rule pattern is required.");
    return null;
  }
  try {
    return {
      code: rule.code,
      pattern: new RegExp(rule.pattern, typeof rule.flags === "string" ? rule.flags : ""),
      message: isNonEmptyString(rule.message) ? rule.message : "Policy rule violated."
    };
  } catch (_error) {
    addViolation(violations, "IMPORT_POLICY_INVALID", `${pathRef}.pattern`, "Policy rule pattern must compile.");
    return null;
  }
}

function compilePolicyRegexRules(rules, pathRef, violations) {
  if (!Array.isArray(rules) || rules.length === 0) {
    addViolation(violations, "IMPORT_POLICY_INVALID", pathRef, "Policy regex rules are required.");
    return [];
  }
  return rules
    .map((rule, index) => compilePolicyRegexRule(rule, `${pathRef}[${index}]`, violations))
    .filter(Boolean);
}

function buildPolicyContext(importSchema, importPolicy, violations) {
  const importIdPattern = isObject(importPolicy) && isObject(importPolicy.import_id_contract)
    ? compilePolicyRegexRule({ code: "INVALID_IMPORT_ID", pattern: importPolicy.import_id_contract.pattern }, "$.importPolicy.import_id_contract.pattern", violations)
    : null;
  const reviewedAtPattern = isObject(importPolicy) && isObject(importPolicy.reviewed_at_contract)
    ? compilePolicyRegexRule({ code: "INVALID_REVIEWED_AT", pattern: importPolicy.reviewed_at_contract.pattern }, "$.importPolicy.reviewed_at_contract.pattern", violations)
    : null;
  const reviewerAliasPattern = isObject(importPolicy) && isObject(importPolicy.reviewer_alias_contract)
    ? compilePolicyRegexRule({ code: "INVALID_REVIEWER_ALIAS", pattern: importPolicy.reviewer_alias_contract.pattern }, "$.importPolicy.reviewer_alias_contract.pattern", violations)
    : null;

  return {
    wrapperKeys: getSchemaWrapperKeys(importSchema),
    requiredImportFields: getRequiredImportFields(importPolicy),
    allowedOrigins: isObject(importPolicy) && Array.isArray(importPolicy.allowed_record_origins)
      ? importPolicy.allowed_record_origins
      : [],
    allowedConsent: isObject(importPolicy) && Array.isArray(importPolicy.allowed_consent_basis)
      ? importPolicy.allowed_consent_basis
      : [],
    requiredSourceDisposition: isObject(importPolicy) ? importPolicy.required_source_disposition : undefined,
    expectedAttestation: isObject(importPolicy) ? importPolicy.required_sanitization_attestation : null,
    importIdPattern: importIdPattern ? importIdPattern.pattern : null,
    reviewedAtPattern: reviewedAtPattern ? reviewedAtPattern.pattern : null,
    reviewerAliasPattern: reviewerAliasPattern ? reviewerAliasPattern.pattern : null,
    forbiddenKeyRules: isObject(importPolicy)
      ? compilePolicyRegexRules(importPolicy.forbidden_key_rules, "$.importPolicy.forbidden_key_rules", violations)
      : [],
    unsafeStringRules: isObject(importPolicy)
      ? compilePolicyRegexRules(importPolicy.unsafe_string_rules, "$.importPolicy.unsafe_string_rules", violations)
      : []
  };
}

function validateNoUnknownFields(value, allowedKeys, pathRef, violations, forbiddenKeyRules = []) {
  if (!isObject(value)) {
    addViolation(violations, "IMPORT_SAMPLE_INVALID", pathRef, "Expected object.");
    return;
  }

  for (const key of Object.keys(value).sort()) {
    const childPath = `${pathRef}.${key}`;
    for (const rule of forbiddenKeyRules) {
      if (rule.pattern.test(key)) {
        addViolation(violations, rule.code, childPath, rule.message);
      }
    }
    if (!allowedKeys.includes(key)) {
      addViolation(violations, "UNKNOWN_IMPORT_FIELD", childPath, "Unknown import field.");
    }
  }
}

function validateRequiredFields(value, requiredKeys, pathRef, code, message, violations) {
  if (!isObject(value)) {
    return;
  }
  for (const key of requiredKeys) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) {
      addViolation(violations, code, `${pathRef}.${key}`, message);
    }
  }
}

function getSchemaWrapperKeys(importSchema) {
  if (!isObject(importSchema) || !isObject(importSchema.properties)) {
    return [];
  }
  return Object.keys(importSchema.properties);
}

function getRequiredImportFields(importPolicy) {
  return isObject(importPolicy) && Array.isArray(importPolicy.required_import_fields)
    ? importPolicy.required_import_fields
    : [];
}

function scanUnsafeStrings(value, pathRef, violations, unsafeStringRules, forbiddenKeyRules) {
  if (typeof value === "string") {
    for (const rule of unsafeStringRules) {
      if (rule.pattern.test(value)) {
        addViolation(violations, rule.code, pathRef, rule.message);
      }
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => scanUnsafeStrings(item, `${pathRef}[${index}]`, violations, unsafeStringRules, forbiddenKeyRules));
    return;
  }

  if (isObject(value)) {
    for (const key of Object.keys(value).sort()) {
      const childPath = `${pathRef}.${key}`;
      for (const rule of forbiddenKeyRules) {
        if (rule.pattern.test(key)) {
          addViolation(violations, rule.code, childPath, rule.message);
        }
      }
      scanUnsafeStrings(value[key], childPath, violations, unsafeStringRules, forbiddenKeyRules);
    }
  }
}

function validateImportId(importId, importIdPattern, violations) {
  if (typeof importId !== "string" || importId.trim().length === 0 || !(importIdPattern && importIdPattern.test(importId))) {
    addViolation(violations, "INVALID_IMPORT_ID", "$.import_id", "Import id must be a deterministic pseudonymous identifier.");
  }
}

function validateReviewedAt(reviewedAt, reviewedAtPattern, violations) {
  if (typeof reviewedAt !== "string"
    || reviewedAt.trim().length === 0
    || !(reviewedAtPattern && reviewedAtPattern.test(reviewedAt))
    || Number.isNaN(Date.parse(reviewedAt))) {
    addViolation(violations, "INVALID_REVIEWED_AT", "$.reviewed_at", "Reviewed timestamp must be valid ISO-8601 with timezone.");
  }
}

function validateReviewerAlias(alias, reviewerAliasPattern, violations) {
  if (!isNonEmptyString(alias) || !(reviewerAliasPattern && reviewerAliasPattern.test(alias))) {
    addViolation(violations, "INVALID_REVIEWER_ALIAS", "$.reviewer_alias", "Reviewer alias must be pseudonymous.");
  }
}

function validateAttestation(attestation, expectedAttestation, violations) {
  if (!isObject(attestation)) {
    addViolation(violations, "SANITIZATION_ATTESTATION_FAILED", "$.sanitization_attestation", "Sanitization attestation must be an object.");
    return;
  }

  validateNoUnknownFields(attestation, ATTESTATION_KEYS, "$.sanitization_attestation", violations);
  validateRequiredFields(attestation, ATTESTATION_KEYS, "$.sanitization_attestation", "SANITIZATION_ATTESTATION_FAILED", "Sanitization attestation field is required.", violations);
  if (!isObject(expectedAttestation)) {
    return;
  }
  if (attestation.raw_source_retained !== expectedAttestation.raw_source_retained) {
    addViolation(violations, "RAW_SOURCE_RETENTION_FORBIDDEN", "$.sanitization_attestation.raw_source_retained", "Raw source retention is forbidden.");
  }
  for (const key of [
    "contains_personal_data",
    "contains_secret",
    "contains_absolute_path"
  ]) {
    if (attestation[key] !== expectedAttestation[key]) {
      addViolation(violations, "SANITIZATION_ATTESTATION_FAILED", `$.sanitization_attestation.${key}`, "Sanitization attestation must be false.");
    }
  }
}

function validateImportPolicy(importPolicy, violations) {
  if (!isObject(importPolicy)) {
    addViolation(violations, "IMPORT_POLICY_INVALID", "$.importPolicy", "Import policy is required.");
    return;
  }
  validateNoUnknownFields(importPolicy, IMPORT_POLICY_KEYS, "$.importPolicy", violations);
  validateRequiredFields(importPolicy, IMPORT_POLICY_KEYS, "$.importPolicy", "IMPORT_POLICY_INVALID", "Import policy field is required.", violations);
  if (!Array.isArray(importPolicy.compatible_import_schema_versions)
    || !importPolicy.compatible_import_schema_versions.includes(REQUIRED_IMPORT_SCHEMA_VERSION)) {
    addViolation(violations, "UNSUPPORTED_IMPORT_SCHEMA_VERSION", "$.importPolicy.compatible_import_schema_versions", "Import policy must support schema 1.0.0.");
  }
  if (!Array.isArray(importPolicy.required_import_fields)
    || IMPORT_KEYS.some((key) => !importPolicy.required_import_fields.includes(key))
    || importPolicy.required_import_fields.some((key) => !IMPORT_KEYS.includes(key))) {
    addViolation(violations, "IMPORT_POLICY_INVALID", "$.importPolicy.required_import_fields", "Import policy must define exact required import fields.");
  }
  if (!Array.isArray(importPolicy.allowed_record_origins) || importPolicy.allowed_record_origins.length === 0) {
    addViolation(violations, "IMPORT_POLICY_INVALID", "$.importPolicy.allowed_record_origins", "Import policy must define allowed origins.");
  }
  if (!Array.isArray(importPolicy.allowed_consent_basis) || importPolicy.allowed_consent_basis.length === 0) {
    addViolation(violations, "IMPORT_POLICY_INVALID", "$.importPolicy.allowed_consent_basis", "Import policy must define allowed consent basis.");
  }
  if (importPolicy.required_source_disposition !== "raw_source_not_retained") {
    addViolation(violations, "IMPORT_POLICY_INVALID", "$.importPolicy.required_source_disposition", "Import policy must forbid raw source retention.");
  }
  if (importPolicy.raw_source_storage_allowed !== false) {
    addViolation(violations, "IMPORT_POLICY_INVALID", "$.importPolicy.raw_source_storage_allowed", "Import policy must forbid raw source storage.");
  }
  if (!isObject(importPolicy.required_sanitization_attestation)
    || ATTESTATION_KEYS.some((key) => importPolicy.required_sanitization_attestation[key] !== false)) {
    addViolation(violations, "IMPORT_POLICY_INVALID", "$.importPolicy.required_sanitization_attestation", "Import policy must require false sanitization attestation flags.");
  }
  if (!Array.isArray(importPolicy.stable_violation_codes)
    || EMITTED_VIOLATION_CODES.some((code) => !importPolicy.stable_violation_codes.includes(code))) {
    addViolation(violations, "IMPORT_POLICY_INVALID", "$.importPolicy.stable_violation_codes", "Import policy must list every emitted violation code.");
  }
  if (!isObject(importPolicy.import_id_contract)
    || importPolicy.import_id_contract.format !== "deterministic_pseudonymous_identifier"
    || importPolicy.import_id_contract.pattern !== IMPORT_ID_PATTERN_SOURCE) {
    addViolation(violations, "IMPORT_POLICY_INVALID", "$.importPolicy.import_id_contract", "Import policy must define deterministic pseudonymous import id contract.");
  }
  if (!isObject(importPolicy.reviewed_at_contract)
    || importPolicy.reviewed_at_contract.format !== "iso_8601_with_timezone"
    || importPolicy.reviewed_at_contract.pattern !== REVIEWED_AT_PATTERN_SOURCE) {
    addViolation(violations, "IMPORT_POLICY_INVALID", "$.importPolicy.reviewed_at_contract", "Import policy must define reviewed_at timezone contract.");
  }
  if (!isObject(importPolicy.reviewer_alias_contract)
    || importPolicy.reviewer_alias_contract.format !== "pseudonymous_identifier"
    || importPolicy.reviewer_alias_contract.pattern !== REVIEWER_ALIAS_PATTERN_SOURCE) {
    addViolation(violations, "IMPORT_POLICY_INVALID", "$.importPolicy.reviewer_alias_contract", "Import policy must define reviewer alias contract.");
  }
  if (!Array.isArray(importPolicy.unsafe_pattern_classes)
    || REQUIRED_UNSAFE_PATTERN_CLASSES.some((patternClass) => !importPolicy.unsafe_pattern_classes.includes(patternClass))) {
    addViolation(violations, "IMPORT_POLICY_INVALID", "$.importPolicy.unsafe_pattern_classes", "Import policy must list every required unsafe pattern class.");
  }
  compilePolicyRegexRules(importPolicy.forbidden_key_rules, "$.importPolicy.forbidden_key_rules", violations);
  compilePolicyRegexRules(importPolicy.unsafe_string_rules, "$.importPolicy.unsafe_string_rules", violations);
  if (!isObject(importPolicy.normalization)
    || importPolicy.normalization.persist_raw_source !== false
    || importPolicy.normalization.persist_wrapper !== false
    || importPolicy.normalization.normalized_sample_returned_in_memory_only !== true) {
    addViolation(violations, "IMPORT_POLICY_INVALID", "$.importPolicy.normalization", "Import policy must keep normalization in memory only.");
  }
}

function validateImportSchema(importSchema, violations) {
  if (!isObject(importSchema)) {
    addViolation(violations, "IMPORT_SCHEMA_INVALID", "$.importSchema", "Import schema is required.");
    return;
  }
  if (importSchema.type !== "object" || importSchema.additionalProperties !== false) {
    addViolation(violations, "IMPORT_SCHEMA_INVALID", "$.importSchema", "Import schema must be a closed object.");
  }
  if (!Array.isArray(importSchema.required)
    || IMPORT_KEYS.some((key) => !importSchema.required.includes(key))
    || importSchema.required.some((key) => !IMPORT_KEYS.includes(key))) {
    addViolation(violations, "IMPORT_SCHEMA_INVALID", "$.importSchema.required", "Import schema must require exact wrapper fields.");
  }
  if (!isObject(importSchema.properties)) {
    addViolation(violations, "IMPORT_SCHEMA_INVALID", "$.importSchema.properties", "Import schema properties are required.");
    return;
  }
  if (IMPORT_KEYS.some((key) => !Object.prototype.hasOwnProperty.call(importSchema.properties, key))) {
    addViolation(violations, "IMPORT_SCHEMA_INVALID", "$.importSchema.properties", "Import schema must define every wrapper property.");
  }
  if (importSchema.properties.import_schema_version
    && importSchema.properties.import_schema_version.const !== REQUIRED_IMPORT_SCHEMA_VERSION) {
    addViolation(violations, "IMPORT_SCHEMA_INVALID", "$.importSchema.properties.import_schema_version", "Import schema must define import_schema_version.");
  }
  if (!importSchema.properties.import_id || importSchema.properties.import_id.pattern !== IMPORT_ID_PATTERN_SOURCE) {
    addViolation(violations, "IMPORT_SCHEMA_INVALID", "$.importSchema.properties.import_id", "Import schema must define import_id pattern.");
  }
  if (!importSchema.properties.reviewed_at || importSchema.properties.reviewed_at.pattern !== REVIEWED_AT_PATTERN_SOURCE) {
    addViolation(violations, "IMPORT_SCHEMA_INVALID", "$.importSchema.properties.reviewed_at", "Import schema must define reviewed_at pattern.");
  }
}

function validateWrapper(importRecord, policyContext, violations) {
  if (!isObject(importRecord)) {
    addViolation(violations, "IMPORT_SAMPLE_INVALID", "$", "Import record must be an object.");
    return;
  }

  validateNoUnknownFields(importRecord, policyContext.wrapperKeys, "$", violations, policyContext.forbiddenKeyRules);
  validateRequiredFields(importRecord, policyContext.requiredImportFields, "$", "MISSING_IMPORT_FIELD", "Required import field is missing.", violations);
  scanUnsafeStrings(importRecord, "$", violations, policyContext.unsafeStringRules, policyContext.forbiddenKeyRules);

  if (importRecord.import_schema_version !== REQUIRED_IMPORT_SCHEMA_VERSION) {
    addViolation(violations, "UNSUPPORTED_IMPORT_SCHEMA_VERSION", "$.import_schema_version", "Unsupported import schema version.");
  }

  if (Object.prototype.hasOwnProperty.call(importRecord, "import_id")) {
    validateImportId(importRecord.import_id, policyContext.importIdPattern, violations);
  }
  if (Object.prototype.hasOwnProperty.call(importRecord, "reviewed_at")) {
    validateReviewedAt(importRecord.reviewed_at, policyContext.reviewedAtPattern, violations);
  }

  if (!policyContext.allowedOrigins.includes(importRecord.record_origin)) {
    addViolation(violations, "INVALID_RECORD_ORIGIN", "$.record_origin", "Invalid record origin.");
  }

  if (!policyContext.allowedConsent.includes(importRecord.consent_basis)) {
    addViolation(violations, "INVALID_CONSENT_BASIS", "$.consent_basis", "Invalid consent basis.");
  }

  if (importRecord.source_disposition !== policyContext.requiredSourceDisposition) {
    addViolation(violations, "RAW_SOURCE_RETENTION_FORBIDDEN", "$.source_disposition", "Raw source must not be retained.");
  }

  validateReviewerAlias(importRecord.reviewer_alias, policyContext.reviewerAliasPattern, violations);
  validateAttestation(importRecord.sanitization_attestation, policyContext.expectedAttestation, violations);
}

function validateSample(importRecord, schema, taxonomy, policy, violations) {
  if (!isObject(importRecord) || !Object.prototype.hasOwnProperty.call(importRecord, "sample")) {
    addViolation(violations, "IMPORT_SAMPLE_INVALID", "$.sample", "Sample is required.");
    return {
      declared_decision: null,
      computed_decision: null,
      normalized_sample: null
    };
  }

  const sample = importRecord.sample;
  const result = validateBundle({
    schema: cloneJson(schema),
    taxonomy: cloneJson(taxonomy),
    policy: cloneJson(policy),
    sample: cloneJson(sample)
  });

  if (!result.valid) {
    for (const violation of result.violations) {
      const samplePath = violation.path === "$" ? "$.sample" : `$.sample${violation.path.slice(1)}`;
      if (violation.code === "DECLARED_ACCEPTED_COMPUTED_REJECTED"
        || violation.code === "DECLARED_REJECTED_COMPUTED_ACCEPTED") {
        addViolation(violations, "IMPORT_DECISION_MISMATCH", samplePath, "Sample decision does not match computed decision.");
      } else {
        addViolation(violations, "IMPORT_SAMPLE_INVALID", samplePath, "Sample failed visual validation.");
      }
    }
  }

  return {
    declared_decision: result.declared_decision,
    computed_decision: result.computed_decision,
    normalized_sample: result.valid ? cloneJson(sample) : null
  };
}

function validateAndNormalizeHumanReview(input) {
  const importRecord = input && input.importRecord;
  const schema = input && input.schema;
  const taxonomy = input && input.taxonomy;
  const policy = input && input.policy;
  const importSchema = input && input.importSchema;
  const importPolicy = input && input.importPolicy;
  const violations = [];

  validateImportSchema(importSchema, violations);
  validateImportPolicy(importPolicy, violations);
  const policyContext = buildPolicyContext(importSchema, importPolicy, violations);
  validateWrapper(importRecord, policyContext, violations);
  const sampleResult = validateSample(importRecord, schema, taxonomy, policy, violations);
  const sortedViolations = sortViolations(violations);
  const valid = sortedViolations.length === 0;
  const importId = importRecord && typeof importRecord.import_id === "string"
    ? importRecord.import_id
    : null;
  const sampleId = importRecord && importRecord.sample && typeof importRecord.sample.sample_id === "string"
    ? importRecord.sample.sample_id
    : null;

  return {
    valid,
    import_id: importId,
    sample_id: valid ? sampleId : null,
    declared_decision: sampleResult.declared_decision,
    computed_decision: sampleResult.computed_decision,
    violations: sortedViolations,
    normalized_sample: valid ? sampleResult.normalized_sample : null
  };
}

function loadBundle(importPath) {
  const baseDir = __dirname;
  const visualEvalDir = path.resolve(baseDir, "..");
  return {
    importRecord: readJson(importPath),
    schema: readJson(path.join(visualEvalDir, "visual_sample.schema.json")),
    taxonomy: readJson(path.join(visualEvalDir, "failure_taxonomy.json")),
    policy: readJson(path.join(visualEvalDir, "evaluation_policy.json")),
    importSchema: readJson(path.join(baseDir, "human_review_import.schema.json")),
    importPolicy: readJson(path.join(baseDir, "import_policy.json"))
  };
}

function runCli() {
  try {
    const importPath = process.argv[2];
    if (!importPath) {
      console.log(JSON.stringify({
        valid: false,
        import_id: null,
        sample_id: null,
        declared_decision: null,
        computed_decision: null,
        violations: [
          {
            code: "USAGE_ERROR",
            path: "$",
            message: "usage: node validate_and_normalize_human_review.js <import-record.json>"
          }
        ],
        normalized_sample: null
      }, null, 2));
      process.exit(EXIT_POLICY_ERROR);
    }

    const result = validateAndNormalizeHumanReview(loadBundle(path.resolve(importPath)));
    const output = result.valid
      ? {
        valid: true,
        import_id: result.import_id,
        sample_id: result.sample_id,
        declared_decision: result.declared_decision,
        computed_decision: result.computed_decision,
        violation_count: 0
      }
      : {
        valid: false,
        import_id: result.import_id,
        sample_id: null,
        declared_decision: result.declared_decision,
        computed_decision: result.computed_decision,
        violations: result.violations,
        normalized_sample: null
      };

    console.log(JSON.stringify(output, null, 2));
    process.exit(result.valid ? EXIT_OK : EXIT_POLICY_ERROR);
  } catch (_error) {
    console.log(JSON.stringify({
      valid: false,
      error: "normalizer_internal_error"
    }, null, 2));
    process.exit(EXIT_TOOL_ERROR);
  }
}

if (require.main === module) {
  runCli();
}

module.exports = {
  validateAndNormalizeHumanReview
};
