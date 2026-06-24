"use strict";

const fs = require("fs");
const path = require("path");

const EXIT_TOOL_ERROR = 1;
const EXIT_POLICY_ERROR = 2;

const SCORE_FIELDS = [
  "subject_fidelity",
  "composition",
  "lighting",
  "material_realism",
  "commercial_fitness"
];

const REQUIRED_FAILURE_CODES = [
  "SUBJECT_DRIFT",
  "MATERIAL_PLASTICITY",
  "COMPOSITION_IMBALANCE",
  "DETAIL_OR_ANATOMY_ARTIFACT",
  "COMMERCIAL_UNFITNESS"
];

const ROOT_KEYS = [
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

const ASSET_REF_KEYS = ["kind", "ref", "image_binary_read_performed"];
const REVIEWER_NOTES_KEYS = ["summary", "positive_reasons", "watch_items"];
const PROVENANCE_KEYS = [
  "metadata_only",
  "provider_contact_performed",
  "image_generation_performed",
  "memory_write_performed"
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function createViolation(code, pathRef, message) {
  return { code, path: pathRef, message };
}

function addViolation(violations, code, pathRef, message) {
  violations.push(createViolation(code, pathRef, message));
}

function sortViolations(violations) {
  return violations.slice().sort((a, b) => {
    if (a.path < b.path) return -1;
    if (a.path > b.path) return 1;
    if (a.code < b.code) return -1;
    if (a.code > b.code) return 1;
    return 0;
  });
}

function unknownKeys(object, allowedKeys) {
  if (!isPlainObject(object)) return [];
  return Object.keys(object).filter((key) => !allowedKeys.includes(key));
}

function requireObject(value, code, pathRef, message, violations) {
  if (!isPlainObject(value)) {
    addViolation(violations, code, pathRef, message);
    return false;
  }
  return true;
}

function validateStringArray(value, options, violations) {
  const {
    pathRef,
    wrongTypeCode,
    emptyCode,
    duplicateCode,
    minItems,
    minItemsCode
  } = options;
  if (!Array.isArray(value)) {
    addViolation(violations, wrongTypeCode, pathRef, `${pathRef} must be an array`);
    return false;
  }

  let ok = true;
  const seen = new Set();
  value.forEach((item, index) => {
    const itemPath = `${pathRef}[${index}]`;
    if (!isNonEmptyString(item)) {
      addViolation(violations, emptyCode, itemPath, `${itemPath} must be a non-empty string`);
      ok = false;
      return;
    }
    if (seen.has(item)) {
      addViolation(violations, duplicateCode, pathRef, `${pathRef} contains duplicate value ${item}`);
      ok = false;
    }
    seen.add(item);
  });

  if (minItems !== undefined && value.length < minItems) {
    addViolation(violations, minItemsCode, pathRef, `${pathRef} must contain at least ${minItems} item(s)`);
    ok = false;
  }
  return ok;
}

function validateSchema(schema, violations) {
  if (!requireObject(schema, "SCHEMA_INVALID", "$.schema", "schema must be an object", violations)) {
    return false;
  }
  if (schema.schema_version !== "local_visual_eval.visual_sample.schema.v1") {
    addViolation(violations, "SCHEMA_INVALID", "$.schema_version", "schema version is unsupported");
  }
  if (schema.type !== "object" || schema.additionalProperties !== false) {
    addViolation(violations, "SCHEMA_INVALID", "$", "schema must define a strict object");
  }
  if (!Array.isArray(schema.required)) {
    addViolation(violations, "SCHEMA_INVALID", "$.required", "schema.required must be an array");
  } else {
    for (const key of ROOT_KEYS) {
      if (!schema.required.includes(key)) {
        addViolation(violations, "SCHEMA_INVALID", `$.required.${key}`, `schema.required must include ${key}`);
      }
    }
  }
  if (!isPlainObject(schema.properties)) {
    addViolation(violations, "SCHEMA_INVALID", "$.properties", "schema.properties must be an object");
  }
}

function validatePolicy(policy, violations) {
  if (!requireObject(policy, "POLICY_INVALID", "$.policy", "policy must be an object", violations)) {
    return;
  }
  if (policy.policy_version !== "local_visual_eval.evaluation_policy.v1") {
    addViolation(violations, "POLICY_INVALID", "$.policy_version", "policy version is unsupported");
  }
  if (!Array.isArray(policy.compatible_sample_schema_versions) ||
      !policy.compatible_sample_schema_versions.includes("local_visual_eval.sample.v1")) {
    addViolation(violations, "POLICY_INVALID", "$.compatible_sample_schema_versions", "policy must support local_visual_eval.sample.v1");
  }
  if (!Array.isArray(policy.score_fields) ||
      JSON.stringify(policy.score_fields) !== JSON.stringify(SCORE_FIELDS)) {
    addViolation(violations, "POLICY_INVALID", "$.score_fields", "policy score fields do not match the frozen contract");
  }
  if (!Array.isArray(policy.critical_score_fields) ||
      JSON.stringify(policy.critical_score_fields) !== JSON.stringify(SCORE_FIELDS)) {
    addViolation(violations, "POLICY_INVALID", "$.critical_score_fields", "policy critical score fields do not match score fields");
  }
  if (!isPlainObject(policy.accepted_minimum_thresholds)) {
    addViolation(violations, "POLICY_MISSING_CRITICAL_THRESHOLD", "$.accepted_minimum_thresholds", "policy thresholds must be an object");
  } else {
    for (const field of SCORE_FIELDS) {
      if (!hasOwn(policy.accepted_minimum_thresholds, field)) {
        addViolation(
          violations,
          "POLICY_MISSING_CRITICAL_THRESHOLD",
          `$.accepted_minimum_thresholds.${field}`,
          `policy is missing accepted threshold for ${field}`
        );
      } else {
        const threshold = policy.accepted_minimum_thresholds[field];
        if (!Number.isInteger(threshold) || threshold < 0 || threshold > 5) {
          addViolation(
            violations,
            "POLICY_INVALID",
            `$.accepted_minimum_thresholds.${field}`,
            `policy threshold for ${field} must be an integer from 0 to 5`
          );
        }
      }
    }
    for (const key of Object.keys(policy.accepted_minimum_thresholds)) {
      if (!SCORE_FIELDS.includes(key)) {
        addViolation(violations, "POLICY_INVALID", `$.accepted_minimum_thresholds.${key}`, "policy threshold uses unknown score field");
      }
    }
  }
  if (policy.unknown_failure_code_behavior !== "fail_closed") {
    addViolation(violations, "POLICY_INVALID", "$.unknown_failure_code_behavior", "unknown failure code behavior must be fail_closed");
  }
  if (!isPlainObject(policy.rejected_sample_requirements)) {
    addViolation(violations, "POLICY_INVALID", "$.rejected_sample_requirements", "rejected sample requirements must be an object");
  } else {
    if (policy.rejected_sample_requirements.minimum_failure_codes !== 1) {
      addViolation(violations, "POLICY_INVALID", "$.rejected_sample_requirements.minimum_failure_codes", "minimum_failure_codes must be 1");
    }
    if (policy.rejected_sample_requirements.minimum_correction_strategies !== 1) {
      addViolation(violations, "POLICY_INVALID", "$.rejected_sample_requirements.minimum_correction_strategies", "minimum_correction_strategies must be 1");
    }
  }
}

function validateTaxonomy(taxonomy, policy, violations) {
  const byCode = new Map();
  if (!requireObject(taxonomy, "TAXONOMY_INVALID", "$.taxonomy", "taxonomy must be an object", violations)) {
    return byCode;
  }
  if (taxonomy.taxonomy_version !== "local_visual_eval.failure_taxonomy.v1") {
    addViolation(violations, "TAXONOMY_INVALID", "$.taxonomy_version", "taxonomy version is unsupported");
  }
  if (!Array.isArray(taxonomy.failure_types)) {
    addViolation(violations, "TAXONOMY_INVALID", "$.failure_types", "taxonomy.failure_types must be an array");
    return byCode;
  }

  taxonomy.failure_types.forEach((failureType, index) => {
    const basePath = `$.failure_types[${index}]`;
    if (!isPlainObject(failureType)) {
      addViolation(violations, "TAXONOMY_INVALID", basePath, "failure type must be an object");
      return;
    }
    if (!isNonEmptyString(failureType.code)) {
      addViolation(violations, "TAXONOMY_INVALID", `${basePath}.code`, "failure code must be a non-empty string");
    } else if (byCode.has(failureType.code)) {
      addViolation(violations, "TAXONOMY_INVALID", `${basePath}.code`, `duplicate taxonomy code ${failureType.code}`);
    } else {
      byCode.set(failureType.code, failureType);
    }
    if (typeof failureType.blocking !== "boolean") {
      addViolation(violations, "TAXONOMY_INVALID", `${basePath}.blocking`, "blocking must be boolean");
    }
    ["observable_signals", "recommended_corrections", "affected_scores"].forEach((field) => {
      if (!Array.isArray(failureType[field]) || failureType[field].length === 0) {
        addViolation(violations, "TAXONOMY_INVALID", `${basePath}.${field}`, `${field} must be a non-empty array`);
      }
    });
    if (Array.isArray(failureType.affected_scores)) {
      failureType.affected_scores.forEach((scoreField, scoreIndex) => {
        if (!SCORE_FIELDS.includes(scoreField)) {
          addViolation(
            violations,
            "TAXONOMY_UNKNOWN_AFFECTED_SCORE",
            `${basePath}.affected_scores[${scoreIndex}]`,
            `taxonomy affected score ${scoreField} is not in the frozen score contract`
          );
        }
      });
    }
  });

  for (const code of REQUIRED_FAILURE_CODES) {
    if (!byCode.has(code)) {
      addViolation(violations, "TAXONOMY_INVALID", `$.failure_types.${code}`, `taxonomy missing required failure code ${code}`);
    }
  }

  if (policy && Array.isArray(policy.score_fields)) {
    for (const field of policy.score_fields) {
      if (!SCORE_FIELDS.includes(field)) {
        addViolation(violations, "POLICY_INVALID", `$.score_fields.${field}`, "policy references a score outside the frozen contract");
      }
    }
  }

  return byCode;
}

function validateSampleShape(sample, policy, violations) {
  if (!requireObject(sample, "SAMPLE_INVALID", "$", "sample must be an object", violations)) {
    return false;
  }

  for (const key of Object.keys(sample)) {
    if (!ROOT_KEYS.includes(key)) {
      addViolation(violations, "UNKNOWN_TOP_LEVEL_FIELD", `$.${key}`, `unknown top-level field ${key}`);
    }
  }
  for (const key of ROOT_KEYS) {
    if (!hasOwn(sample, key)) {
      addViolation(violations, "SAMPLE_MISSING_REQUIRED_FIELD", `$.${key}`, `${key} is required`);
    }
  }

  if (sample.schema_version !== "local_visual_eval.sample.v1") {
    addViolation(violations, "UNSUPPORTED_SCHEMA_VERSION", "$.schema_version", "sample schema version is not supported");
  }
  if (!isNonEmptyString(sample.sample_id)) {
    addViolation(violations, "SAMPLE_INVALID", "$.sample_id", "sample_id must be a non-empty string");
  }
  if (!["accepted", "rejected"].includes(sample.decision)) {
    addViolation(violations, "SAMPLE_INVALID", "$.decision", "decision must be accepted or rejected");
  }

  if (hasOwn(sample, "asset_ref") &&
      requireObject(sample.asset_ref, "SAMPLE_MISSING_REQUIRED_FIELD", "$.asset_ref", "asset_ref must be an object", violations)) {
    for (const key of Object.keys(sample.asset_ref)) {
      if (!ASSET_REF_KEYS.includes(key)) {
        addViolation(violations, "UNKNOWN_NESTED_FIELD", `$.asset_ref.${key}`, `unknown asset_ref field ${key}`);
      }
    }
    for (const key of ASSET_REF_KEYS) {
      if (!hasOwn(sample.asset_ref, key)) {
        addViolation(violations, "SAMPLE_MISSING_REQUIRED_FIELD", `$.asset_ref.${key}`, `asset_ref.${key} is required`);
      }
    }
    if (sample.asset_ref.kind !== "metadata_only_reference") {
      addViolation(violations, "SAMPLE_INVALID", "$.asset_ref.kind", "asset_ref.kind must be metadata_only_reference");
    }
    if (!isNonEmptyString(sample.asset_ref.ref)) {
      addViolation(violations, "SAMPLE_INVALID", "$.asset_ref.ref", "asset_ref.ref must be a non-empty string");
    }
    if (sample.asset_ref.image_binary_read_performed !== false) {
      addViolation(violations, "SAMPLE_INVALID", "$.asset_ref.image_binary_read_performed", "image_binary_read_performed must be false");
    }
  }

  if (!isNonEmptyString(sample.shot_id)) {
    addViolation(violations, "SAMPLE_INVALID", "$.shot_id", "shot_id must be a non-empty string");
  }
  if (!isNonEmptyString(sample.prompt_ref)) {
    addViolation(violations, "SAMPLE_INVALID", "$.prompt_ref", "prompt_ref must be a non-empty string");
  }

  if (hasOwn(sample, "review_scores")) {
    validateReviewScores(sample.review_scores, violations);
  }
  if (hasOwn(sample, "failure_codes")) {
    validateFailureCodes(sample.failure_codes, violations);
  }
  if (hasOwn(sample, "correction_strategies")) {
    validateCorrectionStrategies(sample.correction_strategies, violations);
  }
  if (hasOwn(sample, "reviewer_notes")) {
    validateReviewerNotes(sample.reviewer_notes, violations);
  }
  if (hasOwn(sample, "provenance")) {
    validateProvenance(sample.provenance, violations);
  }

  if (!isNonEmptyString(sample.created_at)) {
    addViolation(violations, "SAMPLE_INVALID", "$.created_at", "created_at must be a non-empty string");
  }
}

function validateReviewScores(reviewScores, violations) {
  if (!requireObject(reviewScores, "SAMPLE_MISSING_REQUIRED_FIELD", "$.review_scores", "review_scores must be an object", violations)) {
    return;
  }
  for (const key of Object.keys(reviewScores)) {
    if (!SCORE_FIELDS.includes(key)) {
      addViolation(violations, "UNKNOWN_REVIEW_SCORE_FIELD", `$.review_scores.${key}`, `unknown review score field ${key}`);
    }
  }
  for (const field of SCORE_FIELDS) {
    const value = reviewScores[field];
    const pathRef = `$.review_scores.${field}`;
    if (!hasOwn(reviewScores, field)) {
      addViolation(violations, "SAMPLE_MISSING_REQUIRED_FIELD", pathRef, `${field} is required`);
      continue;
    }
    if (typeof value === "boolean") {
      addViolation(violations, "REVIEW_SCORE_BOOLEAN", pathRef, `${field} must be an integer, not boolean`);
    } else if (typeof value === "number" && !Number.isInteger(value)) {
      addViolation(violations, "SCORE_FLOAT", pathRef, `${field} must be an integer`);
    } else if (!Number.isInteger(value)) {
      addViolation(violations, "SCORE_NOT_INTEGER", pathRef, `${field} must be an integer`);
    } else if (value < 0) {
      addViolation(violations, "SCORE_BELOW_MIN", pathRef, `${field} must be at least 0`);
    } else if (value > 5) {
      addViolation(violations, "SCORE_ABOVE_MAX", pathRef, `${field} must be at most 5`);
    }
  }
}

function validateFailureCodes(failureCodes, violations) {
  if (!Array.isArray(failureCodes)) {
    addViolation(violations, "FAILURE_CODES_WRONG_TYPE", "$.failure_codes", "failure_codes must be an array");
    return;
  }
  const seen = new Set();
  failureCodes.forEach((code, index) => {
    if (!isNonEmptyString(code)) {
      addViolation(violations, "FAILURE_CODES_WRONG_TYPE", `$.failure_codes[${index}]`, "failure code must be a non-empty string");
      return;
    }
    if (seen.has(code)) {
      addViolation(violations, "DUPLICATE_FAILURE_CODE", "$.failure_codes", `duplicate failure code ${code}`);
    }
    seen.add(code);
  });
}

function validateCorrectionStrategies(correctionStrategies, violations) {
  validateStringArray(correctionStrategies, {
    pathRef: "$.correction_strategies",
    wrongTypeCode: "SAMPLE_INVALID",
    emptyCode: "EMPTY_CORRECTION_STRATEGY",
    duplicateCode: "SAMPLE_INVALID"
  }, violations);
}

function validateReviewerNotes(reviewerNotes, violations) {
  if (!requireObject(reviewerNotes, "SAMPLE_MISSING_REQUIRED_FIELD", "$.reviewer_notes", "reviewer_notes must be an object", violations)) {
    return;
  }
  for (const key of Object.keys(reviewerNotes)) {
    if (!REVIEWER_NOTES_KEYS.includes(key)) {
      addViolation(violations, "UNKNOWN_NESTED_FIELD", `$.reviewer_notes.${key}`, `unknown reviewer_notes field ${key}`);
    }
  }
  for (const key of REVIEWER_NOTES_KEYS) {
    if (!hasOwn(reviewerNotes, key)) {
      addViolation(violations, "SAMPLE_MISSING_REQUIRED_FIELD", `$.reviewer_notes.${key}`, `reviewer_notes.${key} is required`);
    }
  }
  if (!isNonEmptyString(reviewerNotes.summary)) {
    addViolation(violations, "EMPTY_REVIEWER_NOTES", "$.reviewer_notes.summary", "reviewer_notes.summary must be non-empty");
  }
  validateStringArray(reviewerNotes.positive_reasons, {
    pathRef: "$.reviewer_notes.positive_reasons",
    wrongTypeCode: "SAMPLE_INVALID",
    emptyCode: "EMPTY_REVIEWER_NOTES",
    duplicateCode: "SAMPLE_INVALID"
  }, violations);
  validateStringArray(reviewerNotes.watch_items, {
    pathRef: "$.reviewer_notes.watch_items",
    wrongTypeCode: "SAMPLE_INVALID",
    emptyCode: "EMPTY_REVIEWER_NOTES",
    duplicateCode: "SAMPLE_INVALID"
  }, violations);
}

function validateProvenance(provenance, violations) {
  if (!requireObject(provenance, "MALFORMED_PROVENANCE", "$.provenance", "provenance must be an object", violations)) {
    return;
  }
  for (const key of Object.keys(provenance)) {
    if (!PROVENANCE_KEYS.includes(key)) {
      addViolation(violations, "UNKNOWN_NESTED_FIELD", `$.provenance.${key}`, `unknown provenance field ${key}`);
    }
  }
  for (const key of PROVENANCE_KEYS) {
    if (!hasOwn(provenance, key)) {
      addViolation(violations, "MALFORMED_PROVENANCE", `$.provenance.${key}`, `provenance.${key} is required`);
    }
  }
  if (provenance.metadata_only !== true) {
    addViolation(violations, "MALFORMED_PROVENANCE", "$.provenance.metadata_only", "metadata_only must be true");
  }
  ["provider_contact_performed", "image_generation_performed", "memory_write_performed"].forEach((key) => {
    if (provenance[key] !== false) {
      addViolation(violations, "MALFORMED_PROVENANCE", `$.provenance.${key}`, `${key} must be false`);
    }
  });
}

function knownShapeIsValid(violations) {
  return violations.length === 0;
}

function computeDecision(sample, policy, taxonomyByCode, violations) {
  if (!knownShapeIsValid(violations)) {
    return {
      computedDecision: "unknown",
      blockingFailureCodes: [],
      scoreFailures: []
    };
  }

  const blockingFailureCodes = [];
  const scoreFailures = [];

  for (const code of sample.failure_codes) {
    const failureType = taxonomyByCode.get(code);
    if (!failureType) {
      addViolation(violations, "UNKNOWN_FAILURE_CODE", `$.failure_codes[${sample.failure_codes.indexOf(code)}]`, `unknown failure code ${code}`);
      continue;
    }
    if (failureType.blocking) {
      blockingFailureCodes.push(code);
    }
  }

  for (const field of policy.critical_score_fields) {
    const score = sample.review_scores[field];
    const threshold = policy.accepted_minimum_thresholds[field];
    if (score < threshold) {
      scoreFailures.push({ field, score, threshold });
    }
  }

  const computedDecision = blockingFailureCodes.length > 0 || scoreFailures.length > 0
    ? "rejected"
    : "accepted";

  if (sample.decision === "accepted" && blockingFailureCodes.length > 0) {
    addViolation(violations, "ACCEPTED_WITH_BLOCKING_FAILURE", "$.failure_codes", "accepted sample contains a blocking failure code");
  }

  if (sample.decision === "rejected") {
    const requirements = policy.rejected_sample_requirements;
    if (sample.failure_codes.length < requirements.minimum_failure_codes) {
      addViolation(violations, "REJECTED_WITHOUT_CORRECTION_STRATEGY", "$.failure_codes", "rejected sample must contain at least one failure code");
    }
    if (sample.correction_strategies.length < requirements.minimum_correction_strategies) {
      addViolation(violations, "REJECTED_WITHOUT_CORRECTION_STRATEGY", "$.correction_strategies", "rejected sample must contain at least one correction strategy");
    }
  }

  if (sample.decision === "accepted" && computedDecision === "rejected") {
    addViolation(violations, "DECLARED_ACCEPTED_COMPUTED_REJECTED", "$.decision", "declared accepted but policy computed rejected");
  } else if (sample.decision === "rejected" && computedDecision === "accepted") {
    addViolation(violations, "DECLARED_REJECTED_COMPUTED_ACCEPTED", "$.decision", "declared rejected but policy computed accepted");
  }

  return { computedDecision, blockingFailureCodes, scoreFailures };
}

function validateBundle(input) {
  const schema = input && input.schema;
  const taxonomy = input && input.taxonomy;
  const policy = input && input.policy;
  const sample = input && input.sample;
  const violations = [];

  validateSchema(schema, violations);
  validatePolicy(policy, violations);
  const taxonomyByCode = validateTaxonomy(taxonomy, policy, violations);
  validateSampleShape(sample, policy || {}, violations);
  const evaluation = computeDecision(sample, policy, taxonomyByCode, violations);
  const sortedViolations = sortViolations(violations);

  return {
    valid: sortedViolations.length === 0,
    declared_decision: sample && typeof sample.decision === "string" ? sample.decision : null,
    computed_decision: evaluation.computedDecision,
    violations: sortedViolations,
    failure_codes: sample && Array.isArray(sample.failure_codes) ? sample.failure_codes.slice() : [],
    blocking_failure_codes: evaluation.blockingFailureCodes,
    score_failures: evaluation.scoreFailures,
    correction_strategy_count: sample && Array.isArray(sample.correction_strategies)
      ? sample.correction_strategies.length
      : 0
  };
}

function runCli() {
  try {
    const samplePath = process.argv[2];
    if (!samplePath) {
      console.log(JSON.stringify({
        valid: false,
        declared_decision: null,
        computed_decision: "unknown",
        violations: [
          createViolation("USAGE_ERROR", "$", "usage: node validate_local_visual_eval.js <sample.json>")
        ]
      }, null, 2));
      process.exit(EXIT_POLICY_ERROR);
    }

    const baseDir = __dirname;
    const result = validateBundle({
      schema: readJson(path.join(baseDir, "visual_sample.schema.json")),
      taxonomy: readJson(path.join(baseDir, "failure_taxonomy.json")),
      policy: readJson(path.join(baseDir, "evaluation_policy.json")),
      sample: readJson(path.resolve(samplePath))
    });

    console.log(JSON.stringify(result, null, 2));
    process.exit(result.valid ? 0 : EXIT_POLICY_ERROR);
  } catch (error) {
    console.log(JSON.stringify({
      valid: false,
      declared_decision: null,
      computed_decision: "unknown",
      violations: [
        createViolation("TOOL_ERROR", "$", error && error.message ? error.message : String(error))
      ]
    }, null, 2));
    process.exit(EXIT_TOOL_ERROR);
  }
}

if (require.main === module) {
  runCli();
}

module.exports = {
  validateBundle
};
