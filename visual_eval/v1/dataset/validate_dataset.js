"use strict";

const fs = require("fs");
const path = require("path");
const { validateBundle } = require("../validate_local_visual_eval.js");

const EXIT_OK = 0;
const EXIT_POLICY_ERROR = 2;
const EXIT_TOOL_ERROR = 1;

const DATASET_VERSION = "local_visual_eval.dataset_seed.v1.2";
const REQUIRED_FAILURE_CODES = [
  "SUBJECT_DRIFT",
  "MATERIAL_PLASTICITY",
  "COMPOSITION_IMBALANCE",
  "DETAIL_OR_ANATOMY_ARTIFACT",
  "COMMERCIAL_UNFITNESS"
];

const MANIFEST_KEYS = [
  "dataset_version",
  "visual_sample_schema_version",
  "taxonomy_version",
  "policy_version",
  "accepted_count",
  "rejected_count",
  "total_count",
  "record_origin",
  "required_failure_codes",
  "minimum_occurrences_per_failure_code",
  "sample_files",
  "validation_contract"
];

const SAMPLE_KEYS = [
  "schema_version",
  "sample_id",
  "decision",
  "asset_ref",
  "shot_id",
  "prompt_ref",
  "review_scores",
  "failure_codes",
  "correction_strategies",
  "reviewer_notes",
  "provenance",
  "created_at"
];

const DISALLOWED_STRING_PATTERNS = [
  {
    code: "ABSOLUTE_WINDOWS_REFERENCE",
    pattern: /^[A-Za-z]:[\\/]/,
    message: "value must not be a Windows absolute path"
  },
  {
    code: "UNC_REFERENCE",
    pattern: /^\\\\/,
    message: "value must not be a UNC path"
  },
  {
    code: "ABSOLUTE_PATH_REFERENCE",
    pattern: /^\//,
    message: "value must not be an absolute path"
  },
  {
    code: "PATH_TRAVERSAL_REFERENCE",
    pattern: /(^|[\\/])(?:\.\.|%2e%2e)([\\/]|$)/i,
    message: "value must not contain path traversal"
  },
  {
    code: "CREDENTIAL_BEARING_URL_REFERENCE",
    pattern: /^[a-z][a-z0-9+.-]*:\/\/[^/\s:@]+:[^/\s:@]+@/i,
    message: "value must not contain URL credentials"
  },
  {
    code: "FILE_URL_REFERENCE",
    pattern: /^file:\/\//i,
    message: "value must not be a file URL"
  },
  {
    code: "UNAPPROVED_URL_REFERENCE",
    pattern: /^https?:\/\//i,
    message: "value must not be a real URL"
  },
  {
    code: "SECRET_LIKE_VALUE",
    pattern: /\b(?:sk-[A-Za-z0-9_-]{12,}|api[_-]?key\s*=|token\s*=|password\s*=|secret\s*=)/i,
    message: "value must not contain secret-like material"
  }
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

function sameArray(left, right) {
  return Array.isArray(left)
    && Array.isArray(right)
    && left.length === right.length
    && left.every((value, index) => value === right[index]);
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

function validateObjectKeys(value, allowedKeys, pathRef, violations) {
  if (!isObject(value)) {
    addViolation(violations, "WRONG_TYPE", pathRef, `${pathRef} must be an object`);
    return;
  }

  for (const key of Object.keys(value).sort()) {
    if (!allowedKeys.includes(key)) {
      addViolation(violations, "UNKNOWN_FIELD", `${pathRef}.${key}`, `${pathRef}.${key} is not allowed`);
    }
  }
}

function validateSafeString(value, pathRef, violations) {
  if (!isNonEmptyString(value)) {
    addViolation(violations, "EMPTY_STRING", pathRef, `${pathRef} must be a non-empty string`);
    return;
  }

  for (const rule of DISALLOWED_STRING_PATTERNS) {
    if (rule.pattern.test(value)) {
      addViolation(violations, rule.code, pathRef, rule.message);
    }
  }
}

function scanStrings(value, pathRef, violations) {
  if (typeof value === "string") {
    validateSafeString(value, pathRef, violations);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => scanStrings(item, `${pathRef}[${index}]`, violations));
    return;
  }

  if (isObject(value)) {
    for (const key of Object.keys(value).sort()) {
      scanStrings(value[key], `${pathRef}.${key}`, violations);
    }
  }
}

function validateManifest(manifest, schema, taxonomy, policy, violations) {
  validateObjectKeys(manifest, MANIFEST_KEYS, "$.manifest", violations);
  if (!isObject(manifest)) {
    return;
  }

  const schemaVersion = schema
    && schema.properties
    && schema.properties.schema_version
    && schema.properties.schema_version.const;

  if (manifest.dataset_version !== DATASET_VERSION) {
    addViolation(violations, "MANIFEST_INVALID", "$.manifest.dataset_version", `dataset_version must be ${DATASET_VERSION}`);
  }
  if (manifest.visual_sample_schema_version !== schemaVersion) {
    addViolation(violations, "MANIFEST_SCHEMA_VERSION_MISMATCH", "$.manifest.visual_sample_schema_version", "visual_sample_schema_version must match visual sample schema");
  }
  if (manifest.taxonomy_version !== (taxonomy && taxonomy.taxonomy_version)) {
    addViolation(violations, "MANIFEST_INVALID", "$.manifest.taxonomy_version", "taxonomy_version must match taxonomy");
  }
  if (manifest.policy_version !== (policy && policy.policy_version)) {
    addViolation(violations, "MANIFEST_INVALID", "$.manifest.policy_version", "policy_version must match policy");
  }
  if (manifest.accepted_count !== 10) {
    addViolation(violations, "MANIFEST_ACCEPTED_COUNT_MISMATCH", "$.manifest.accepted_count", "accepted_count must be 10");
  }
  if (manifest.rejected_count !== 10) {
    addViolation(violations, "MANIFEST_REJECTED_COUNT_MISMATCH", "$.manifest.rejected_count", "rejected_count must be 10");
  }
  if (manifest.total_count !== 20) {
    addViolation(violations, "MANIFEST_TOTAL_COUNT_MISMATCH", "$.manifest.total_count", "total_count must be 20");
  }
  if (manifest.record_origin === "human_review") {
    addViolation(violations, "SYNTHETIC_DATA_MISLABELED_AS_HUMAN", "$.manifest.record_origin", "synthetic seed dataset must not be marked as human_review");
  }
  if (manifest.record_origin !== "synthetic_seed") {
    addViolation(violations, "MANIFEST_INVALID", "$.manifest.record_origin", "record_origin must be synthetic_seed");
  }
  if (!Array.isArray(manifest.required_failure_codes)) {
    addViolation(violations, "MANIFEST_INVALID", "$.manifest.required_failure_codes", "required_failure_codes must be an array");
  } else {
    for (const requiredCode of REQUIRED_FAILURE_CODES) {
      if (!manifest.required_failure_codes.includes(requiredCode)) {
        addViolation(violations, "REQUIRED_FAILURE_CODE_MISSING", "$.manifest.required_failure_codes", `${requiredCode} must be present`);
      }
    }
    if (!sameArray(manifest.required_failure_codes, REQUIRED_FAILURE_CODES)) {
      addViolation(violations, "MANIFEST_INVALID", "$.manifest.required_failure_codes", "required_failure_codes must match the v1.2 contract order");
    }
  }
  if (manifest.minimum_occurrences_per_failure_code !== 2) {
    addViolation(violations, "MANIFEST_INVALID", "$.manifest.minimum_occurrences_per_failure_code", "minimum_occurrences_per_failure_code must be 2");
  }

  if (!isObject(manifest.sample_files)) {
    addViolation(violations, "MANIFEST_INVALID", "$.manifest.sample_files", "sample_files must be an object");
  } else {
    validateObjectKeys(manifest.sample_files, ["accepted", "rejected"], "$.manifest.sample_files", violations);
    if (manifest.sample_files.accepted !== "accepted.samples.json") {
      addViolation(violations, "SAMPLE_FILE_NAME_MISMATCH", "$.manifest.sample_files.accepted", "accepted sample file must be accepted.samples.json");
    }
    if (manifest.sample_files.rejected !== "rejected.samples.json") {
      addViolation(violations, "SAMPLE_FILE_NAME_MISMATCH", "$.manifest.sample_files.rejected", "rejected sample file must be rejected.samples.json");
    }
  }

  if (!isObject(manifest.validation_contract)) {
    addViolation(violations, "MANIFEST_INVALID", "$.manifest.validation_contract", "validation_contract must be an object");
  } else {
    if (manifest.validation_contract.correction_strategy_assessment !== "presence_only_not_effectiveness") {
      addViolation(violations, "MANIFEST_INVALID", "$.manifest.validation_contract.correction_strategy_assessment", "correction strategy assessment must be presence only");
    }
    for (const flag of [
      "metadata_only",
      "provider_contact_performed",
      "image_generation_performed",
      "memory_write_performed"
    ]) {
      const expected = flag === "metadata_only";
      if (manifest.validation_contract[flag] !== expected) {
        addViolation(violations, "MANIFEST_INVALID", `$.manifest.validation_contract.${flag}`, `${flag} must be ${expected}`);
      }
    }
  }
}

function buildTaxonomyByCode(taxonomy) {
  const byCode = new Map();
  if (taxonomy && Array.isArray(taxonomy.failure_types)) {
    for (const failureType of taxonomy.failure_types) {
      if (failureType && typeof failureType.code === "string") {
        byCode.set(failureType.code, failureType);
      }
    }
  }
  return byCode;
}

function validateCoverageContract(manifest, taxonomyByCode, violations) {
  const codes = manifest && Array.isArray(manifest.required_failure_codes)
    ? manifest.required_failure_codes
    : [];

  codes.forEach((code, index) => {
    if (!taxonomyByCode.has(code)) {
      addViolation(violations, "UNKNOWN_FAILURE_CODE", `$.manifest.required_failure_codes[${index}]`, `${code} is not defined in taxonomy`);
    }
  });
}

function validateSample(
  sample,
  samplePath,
  expectedDecision,
  schema,
  taxonomy,
  policy,
  taxonomyByCode,
  seenSampleIds,
  seenAssetRefs,
  failureFrequency,
  counters,
  violations
) {
  validateObjectKeys(sample, SAMPLE_KEYS, samplePath, violations);

  if (!isObject(sample)) {
    return;
  }

  scanStrings(sample, samplePath, violations);

  if (seenSampleIds.has(sample.sample_id)) {
    addViolation(violations, "DUPLICATE_SAMPLE_ID", `${samplePath}.sample_id`, `${sample.sample_id} appears more than once`);
  } else {
    seenSampleIds.add(sample.sample_id);
  }

  if (sample.asset_ref && seenAssetRefs.has(sample.asset_ref.ref)) {
    addViolation(violations, "DUPLICATE_ASSET_REF", `${samplePath}.asset_ref.ref`, `${sample.asset_ref.ref} appears more than once`);
  } else if (sample.asset_ref && typeof sample.asset_ref.ref === "string") {
    seenAssetRefs.add(sample.asset_ref.ref);
  }

  if (sample.decision !== expectedDecision) {
    addViolation(violations, "WRONG_DECLARED_DECISION", `${samplePath}.decision`, `${samplePath} must declare ${expectedDecision}`);
  }

  if (Array.isArray(sample.failure_codes)) {
    const localCodes = new Set();
    sample.failure_codes.forEach((code, index) => {
      if (localCodes.has(code)) {
        addViolation(violations, "DUPLICATE_FAILURE_CODE", `${samplePath}.failure_codes[${index}]`, `${code} is repeated within one sample`);
      }
      localCodes.add(code);

      if (Object.prototype.hasOwnProperty.call(failureFrequency, code)) {
        failureFrequency[code] += 1;
      }
    });
  }

  const result = validateBundle({
    schema: cloneJson(schema),
    taxonomy: cloneJson(taxonomy),
    policy: cloneJson(policy),
    sample: cloneJson(sample)
  });

  if (!result.valid) {
    for (const violation of result.violations) {
      addViolation(
        violations,
        violation.code,
        `${samplePath}${violation.path === "$" ? "" : violation.path.slice(1)}`,
        violation.message
      );
    }
  }

  if (result.declared_decision !== result.computed_decision) {
    addViolation(violations, "DECISION_MISMATCH", `${samplePath}.decision`, "declared decision must match computed decision");
  }
  if (result.computed_decision !== expectedDecision) {
    addViolation(violations, "UNEXPECTED_COMPUTED_DECISION", `${samplePath}.decision`, `computed decision must be ${expectedDecision}`);
  }

  const blockingCodes = Array.isArray(result.blocking_failure_codes)
    ? result.blocking_failure_codes
    : [];

  if (expectedDecision === "accepted") {
    if (Array.isArray(sample.failure_codes) && sample.failure_codes.length !== 0) {
      addViolation(violations, "ACCEPTED_HAS_FAILURE_CODE", `${samplePath}.failure_codes`, "accepted dataset seed samples must have no failure codes");
    }
    if (blockingCodes.length !== 0) {
      addViolation(violations, "ACCEPTED_HAS_BLOCKING_FAILURE", `${samplePath}.failure_codes`, "accepted samples must not contain blocking failures");
    }
    return;
  }

  if (!Array.isArray(sample.correction_strategies) || sample.correction_strategies.length === 0) {
    addViolation(violations, "REJECTED_WITHOUT_CORRECTION_STRATEGY", `${samplePath}.correction_strategies`, "rejected samples must include at least one correction strategy");
  } else {
    counters.rejectedWithCorrectionStrategy += 1;
  }

  if (blockingCodes.length === 0) {
    addViolation(violations, "REJECTED_WITHOUT_BLOCKING_FAILURE", `${samplePath}.failure_codes`, "rejected samples must include at least one blocking failure");
  }

  if (Array.isArray(sample.failure_codes)) {
    sample.failure_codes.forEach((code, index) => {
      if (!taxonomyByCode.has(code)) {
        addViolation(violations, "UNKNOWN_FAILURE_CODE", `${samplePath}.failure_codes[${index}]`, `${code} is not defined in taxonomy`);
      }
    });
  }
}

function validateDatasetBundle(input) {
  const manifest = input && input.manifest;
  const acceptedInput = input && input.acceptedSamples;
  const rejectedInput = input && input.rejectedSamples;
  const schema = input && input.schema;
  const taxonomy = input && input.taxonomy;
  const policy = input && input.policy;
  const violations = [];
  const taxonomyByCode = buildTaxonomyByCode(taxonomy);
  const failureFrequency = {};
  for (const code of REQUIRED_FAILURE_CODES) {
    failureFrequency[code] = 0;
  }

  validateManifest(manifest, schema, taxonomy, policy, violations);
  validateCoverageContract(manifest, taxonomyByCode, violations);

  if (!Array.isArray(acceptedInput)) {
    addViolation(violations, "DATASET_INVALID", "$.acceptedSamples", "acceptedSamples must be an array");
  }
  if (!Array.isArray(rejectedInput)) {
    addViolation(violations, "DATASET_INVALID", "$.rejectedSamples", "rejectedSamples must be an array");
  }

  const acceptedSamples = Array.isArray(acceptedInput) ? acceptedInput : [];
  const rejectedSamples = Array.isArray(rejectedInput) ? rejectedInput : [];
  const total = acceptedSamples.length + rejectedSamples.length;

  if (isObject(manifest) && acceptedSamples.length !== manifest.accepted_count) {
    addViolation(violations, "COUNT_MISMATCH", "$.acceptedSamples", "accepted sample count must match manifest");
  }
  if (isObject(manifest) && rejectedSamples.length !== manifest.rejected_count) {
    addViolation(violations, "COUNT_MISMATCH", "$.rejectedSamples", "rejected sample count must match manifest");
  }
  if (isObject(manifest) && total !== manifest.total_count) {
    addViolation(violations, "COUNT_MISMATCH", "$.total", "total sample count must match manifest");
  }
  if (acceptedSamples.length !== 10) {
    addViolation(violations, "COUNT_MISMATCH", "$.acceptedSamples", "accepted sample count must be exactly 10");
  }
  if (rejectedSamples.length !== 10) {
    addViolation(violations, "COUNT_MISMATCH", "$.rejectedSamples", "rejected sample count must be exactly 10");
  }

  const seenSampleIds = new Set();
  const seenAssetRefs = new Set();
  const counters = { rejectedWithCorrectionStrategy: 0 };

  acceptedSamples.forEach((sample, index) => {
    validateSample(
      sample,
      `$.acceptedSamples[${index}]`,
      "accepted",
      schema,
      taxonomy,
      policy,
      taxonomyByCode,
      seenSampleIds,
      seenAssetRefs,
      failureFrequency,
      counters,
      violations
    );
  });

  rejectedSamples.forEach((sample, index) => {
    validateSample(
      sample,
      `$.rejectedSamples[${index}]`,
      "rejected",
      schema,
      taxonomy,
      policy,
      taxonomyByCode,
      seenSampleIds,
      seenAssetRefs,
      failureFrequency,
      counters,
      violations
    );
  });

  const minimumCoverage = isObject(manifest)
    ? manifest.minimum_occurrences_per_failure_code
    : 2;
  for (const code of REQUIRED_FAILURE_CODES) {
    if (failureFrequency[code] < minimumCoverage) {
      addViolation(violations, "COVERAGE_UNDER_MINIMUM", `$.failure_frequency.${code}`, `${code} must occur at least twice`);
    }
  }

  const sortedViolations = sortViolations(violations);
  const summary = {
    dataset_version: manifest && manifest.dataset_version ? manifest.dataset_version : DATASET_VERSION,
    total,
    accepted: acceptedSamples.length,
    rejected: rejectedSamples.length,
    failure_frequency: failureFrequency,
    correction_strategy_presence: {
      required: rejectedSamples.length,
      present: counters.rejectedWithCorrectionStrategy
    },
    sample_ids_unique: seenSampleIds.size === total
  };

  return {
    valid: sortedViolations.length === 0,
    violations: sortedViolations,
    summary
  };
}

function loadDatasetBundle() {
  const baseDir = __dirname;
  const visualEvalDir = path.resolve(baseDir, "..");
  return {
    manifest: readJson(path.join(baseDir, "dataset_manifest.json")),
    acceptedSamples: readJson(path.join(baseDir, "accepted.samples.json")),
    rejectedSamples: readJson(path.join(baseDir, "rejected.samples.json")),
    schema: readJson(path.join(visualEvalDir, "visual_sample.schema.json")),
    taxonomy: readJson(path.join(visualEvalDir, "failure_taxonomy.json")),
    policy: readJson(path.join(visualEvalDir, "evaluation_policy.json"))
  };
}

function validateDataset() {
  return validateDatasetBundle(loadDatasetBundle());
}

function runCli() {
  try {
    const result = validateDataset();
    const output = result.valid
      ? Object.assign({ valid: true }, result.summary)
      : result;

    console.log(JSON.stringify(output, null, 2));
    process.exit(result.valid ? EXIT_OK : EXIT_POLICY_ERROR);
  } catch (_error) {
    console.log(JSON.stringify({
      valid: false,
      error: "validator_internal_error"
    }, null, 2));
    process.exit(EXIT_TOOL_ERROR);
  }
}

if (require.main === module) {
  runCli();
}

module.exports = {
  validateDataset,
  validateDatasetBundle
};
