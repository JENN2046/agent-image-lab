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

const SENSITIVE_STRING_RULES = [
  {
    code: "CREDENTIAL_URL_DETECTED",
    pattern: /^[a-z][a-z0-9+.-]*:\/\/[^/\s:@]+:[^/\s:@]+@/i,
    message: "Credential-bearing URL is not allowed."
  },
  {
    code: "SECRET_PATTERN_DETECTED",
    pattern: /\bBearer\s+[A-Za-z0-9._~+/-]+=*/i,
    message: "Secret-like token is not allowed."
  },
  {
    code: "SECRET_PATTERN_DETECTED",
    pattern: /\b(?:api[_-]?key|token|password|secret)\s*=/i,
    message: "Secret-like assignment is not allowed."
  },
  {
    code: "SECRET_PATTERN_DETECTED",
    pattern: /\bsk-[A-Za-z0-9_-]{12,}\b/,
    message: "Secret-like key prefix is not allowed."
  },
  {
    code: "SECRET_PATTERN_DETECTED",
    pattern: /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/,
    message: "JWT-like token is not allowed."
  },
  {
    code: "PERSONAL_DATA_PATTERN_DETECTED",
    pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
    message: "Personal data pattern is not allowed."
  },
  {
    code: "PERSONAL_DATA_PATTERN_DETECTED",
    pattern: /(?:\+\d{1,3}[\s.-]?)?(?:\(?\d{3}\)?[\s.-])\d{3}[\s.-]\d{4}\b/,
    message: "Telephone-like pattern is not allowed."
  },
  {
    code: "ABSOLUTE_PATH_DETECTED",
    pattern: /^[A-Za-z]:[\\/]/,
    message: "Absolute path is not allowed."
  },
  {
    code: "ABSOLUTE_PATH_DETECTED",
    pattern: /^\\\\/,
    message: "UNC path is not allowed."
  },
  {
    code: "ABSOLUTE_PATH_DETECTED",
    pattern: /^\//,
    message: "Absolute path is not allowed."
  },
  {
    code: "ABSOLUTE_PATH_DETECTED",
    pattern: /^file:\/\//i,
    message: "File URL is not allowed."
  },
  {
    code: "PATH_TRAVERSAL_DETECTED",
    pattern: /(^|[\\/])(?:\.\.|%2e%2e)([\\/]|$)/i,
    message: "Parent directory traversal is not allowed."
  }
];

const RAW_PAYLOAD_KEY_PATTERN = /(?:raw_payload|provider_payload|raw_transcript|source_text|original_payload)/i;
const COOKIE_OR_SESSION_KEY_PATTERN = /(?:cookie|session)/i;

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

function validateNoUnknownFields(value, allowedKeys, pathRef, violations) {
  if (!isObject(value)) {
    addViolation(violations, "IMPORT_SAMPLE_INVALID", pathRef, "Expected object.");
    return;
  }

  for (const key of Object.keys(value).sort()) {
    const childPath = `${pathRef}.${key}`;
    if (RAW_PAYLOAD_KEY_PATTERN.test(key)) {
      addViolation(violations, "RAW_PAYLOAD_FIELD_FORBIDDEN", childPath, "Raw payload fields are forbidden.");
    }
    if (COOKIE_OR_SESSION_KEY_PATTERN.test(key)) {
      addViolation(violations, "SECRET_PATTERN_DETECTED", childPath, "Cookie or session fields are forbidden.");
    }
    if (!allowedKeys.includes(key)) {
      addViolation(violations, "UNKNOWN_IMPORT_FIELD", childPath, "Unknown import field.");
    }
  }
}

function scanUnsafeStrings(value, pathRef, violations) {
  if (typeof value === "string") {
    if (value.trim().length === 0) {
      addViolation(violations, "PERSONAL_DATA_PATTERN_DETECTED", pathRef, "Blank string is not allowed in import text.");
      return;
    }
    for (const rule of SENSITIVE_STRING_RULES) {
      if (rule.pattern.test(value)) {
        addViolation(violations, rule.code, pathRef, rule.message);
      }
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => scanUnsafeStrings(item, `${pathRef}[${index}]`, violations));
    return;
  }

  if (isObject(value)) {
    for (const key of Object.keys(value).sort()) {
      const childPath = `${pathRef}.${key}`;
      if (RAW_PAYLOAD_KEY_PATTERN.test(key)) {
        addViolation(violations, "RAW_PAYLOAD_FIELD_FORBIDDEN", childPath, "Raw payload fields are forbidden.");
      }
      if (COOKIE_OR_SESSION_KEY_PATTERN.test(key)) {
        addViolation(violations, "SECRET_PATTERN_DETECTED", childPath, "Cookie or session fields are forbidden.");
      }
      scanUnsafeStrings(value[key], childPath, violations);
    }
  }
}

function validateReviewerAlias(alias, violations) {
  if (!isNonEmptyString(alias) || !/^[a-z][a-z0-9_]{2,63}$/.test(alias)) {
    addViolation(violations, "INVALID_REVIEWER_ALIAS", "$.reviewer_alias", "Reviewer alias must be pseudonymous.");
  }
}

function validateAttestation(attestation, violations) {
  if (!isObject(attestation)) {
    addViolation(violations, "SANITIZATION_ATTESTATION_FAILED", "$.sanitization_attestation", "Sanitization attestation must be an object.");
    return;
  }

  validateNoUnknownFields(attestation, ATTESTATION_KEYS, "$.sanitization_attestation", violations);
  if (attestation.raw_source_retained !== false) {
    addViolation(violations, "RAW_SOURCE_RETENTION_FORBIDDEN", "$.sanitization_attestation.raw_source_retained", "Raw source retention is forbidden.");
  }
  for (const key of [
    "contains_personal_data",
    "contains_secret",
    "contains_absolute_path"
  ]) {
    if (attestation[key] !== false) {
      addViolation(violations, "SANITIZATION_ATTESTATION_FAILED", `$.sanitization_attestation.${key}`, "Sanitization attestation must be false.");
    }
  }
}

function validateImportPolicy(importPolicy, violations) {
  if (!isObject(importPolicy)) {
    addViolation(violations, "IMPORT_SAMPLE_INVALID", "$.importPolicy", "Import policy is required.");
    return;
  }
  if (!Array.isArray(importPolicy.compatible_import_schema_versions)
    || !importPolicy.compatible_import_schema_versions.includes(REQUIRED_IMPORT_SCHEMA_VERSION)) {
    addViolation(violations, "UNSUPPORTED_IMPORT_SCHEMA_VERSION", "$.importPolicy.compatible_import_schema_versions", "Import policy must support schema 1.0.0.");
  }
}

function validateImportSchema(importSchema, violations) {
  if (!isObject(importSchema)) {
    addViolation(violations, "IMPORT_SAMPLE_INVALID", "$.importSchema", "Import schema is required.");
    return;
  }
  if (!importSchema.properties || !importSchema.properties.import_schema_version) {
    addViolation(violations, "IMPORT_SAMPLE_INVALID", "$.importSchema.properties.import_schema_version", "Import schema must define import_schema_version.");
  }
}

function validateWrapper(importRecord, importPolicy, violations) {
  if (!isObject(importRecord)) {
    addViolation(violations, "IMPORT_SAMPLE_INVALID", "$", "Import record must be an object.");
    return;
  }

  validateNoUnknownFields(importRecord, IMPORT_KEYS, "$", violations);
  scanUnsafeStrings(importRecord, "$", violations);

  if (importRecord.import_schema_version !== REQUIRED_IMPORT_SCHEMA_VERSION) {
    addViolation(violations, "UNSUPPORTED_IMPORT_SCHEMA_VERSION", "$.import_schema_version", "Unsupported import schema version.");
  }

  const allowedOrigins = importPolicy && Array.isArray(importPolicy.allowed_record_origins)
    ? importPolicy.allowed_record_origins
    : ["human_review_sanitized"];
  if (!allowedOrigins.includes(importRecord.record_origin)) {
    addViolation(violations, "INVALID_RECORD_ORIGIN", "$.record_origin", "Invalid record origin.");
  }

  const allowedConsent = importPolicy && Array.isArray(importPolicy.allowed_consent_basis)
    ? importPolicy.allowed_consent_basis
    : ["synthetic_fixture"];
  if (!allowedConsent.includes(importRecord.consent_basis)) {
    addViolation(violations, "INVALID_CONSENT_BASIS", "$.consent_basis", "Invalid consent basis.");
  }

  if (importRecord.source_disposition !== "raw_source_not_retained") {
    addViolation(violations, "RAW_SOURCE_RETENTION_FORBIDDEN", "$.source_disposition", "Raw source must not be retained.");
  }

  validateReviewerAlias(importRecord.reviewer_alias, violations);
  validateAttestation(importRecord.sanitization_attestation, violations);
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
  validateWrapper(importRecord, importPolicy, violations);
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
