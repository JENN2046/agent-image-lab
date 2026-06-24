"use strict";

const fs = require("fs");
const path = require("path");

const EXIT_TOOL_ERROR = 1;
const EXIT_POLICY_ERROR = 2;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function add(errors, message) {
  errors.push(message);
}

function exactKeys(object, allowedKeys, label, errors) {
  if (!isPlainObject(object)) {
    add(errors, `${label} must be an object`);
    return;
  }
  for (const key of Object.keys(object)) {
    if (!allowedKeys.includes(key)) {
      add(errors, `${label}.${key} is not allowed`);
    }
  }
}

function requireKeys(object, keys, label, errors) {
  if (!isPlainObject(object)) {
    add(errors, `${label} must be an object`);
    return;
  }
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(object, key)) {
      add(errors, `${label}.${key} is required`);
    }
  }
}

function requireString(value, label, errors) {
  if (typeof value !== "string" || value.length === 0) {
    add(errors, `${label} must be a non-empty string`);
  }
}

function requireBoolean(value, expected, label, errors) {
  if (typeof value !== "boolean") {
    add(errors, `${label} must be a boolean`);
    return;
  }
  if (value !== expected) {
    add(errors, `${label} must be ${expected}`);
  }
}

function requireStringArray(value, label, errors, options = {}) {
  if (!Array.isArray(value)) {
    add(errors, `${label} must be an array`);
    return;
  }
  if (options.minItems !== undefined && value.length < options.minItems) {
    add(errors, `${label} must contain at least ${options.minItems} item(s)`);
  }
  for (const item of value) {
    if (typeof item !== "string" || item.length === 0) {
      add(errors, `${label} must contain only non-empty strings`);
    }
  }
  if (options.unique) {
    const unique = new Set(value);
    if (unique.size !== value.length) {
      add(errors, `${label} must not contain duplicates`);
    }
  }
}

function validateSchema(schema, errors) {
  const allowed = [
    "schema_version",
    "title",
    "type",
    "additionalProperties",
    "required",
    "properties"
  ];
  exactKeys(schema, allowed, "schema", errors);
  if (schema.schema_version !== "local_visual_eval.visual_sample.schema.v1") {
    add(errors, "schema.schema_version is unsupported");
  }
  if (schema.type !== "object" || schema.additionalProperties !== false) {
    add(errors, "schema must define a strict object");
  }
  requireStringArray(schema.required, "schema.required", errors, { minItems: 1, unique: true });
  if (!isPlainObject(schema.properties)) {
    add(errors, "schema.properties must be an object");
  }
}

function validateTaxonomy(taxonomy, policy, errors) {
  exactKeys(taxonomy, ["taxonomy_version", "failure_types"], "taxonomy", errors);
  if (taxonomy.taxonomy_version !== "local_visual_eval.failure_taxonomy.v1") {
    add(errors, "taxonomy.taxonomy_version is unsupported");
  }
  if (!Array.isArray(taxonomy.failure_types)) {
    add(errors, "taxonomy.failure_types must be an array");
    return new Map();
  }
  const requiredCodes = [
    "SUBJECT_DRIFT",
    "MATERIAL_PLASTICITY",
    "COMPOSITION_IMBALANCE",
    "DETAIL_OR_ANATOMY_ARTIFACT",
    "COMMERCIAL_UNFITNESS"
  ];
  const allowedTypeKeys = [
    "code",
    "title",
    "description",
    "severity",
    "blocking",
    "observable_signals",
    "recommended_corrections",
    "affected_scores"
  ];
  const allowedSeverities = ["warning", "minor", "major", "critical"];
  const byCode = new Map();
  for (const failureType of taxonomy.failure_types) {
    exactKeys(failureType, allowedTypeKeys, "failure_type", errors);
    requireKeys(failureType, allowedTypeKeys, "failure_type", errors);
    requireString(failureType.code, "failure_type.code", errors);
    requireString(failureType.title, "failure_type.title", errors);
    requireString(failureType.description, "failure_type.description", errors);
    if (!allowedSeverities.includes(failureType.severity)) {
      add(errors, `failure_type.${failureType.code}.severity is unsupported`);
    }
    if (typeof failureType.blocking !== "boolean") {
      add(errors, `failure_type.${failureType.code}.blocking must be boolean`);
    }
    requireStringArray(failureType.observable_signals, `failure_type.${failureType.code}.observable_signals`, errors, { minItems: 1 });
    requireStringArray(failureType.recommended_corrections, `failure_type.${failureType.code}.recommended_corrections`, errors, { minItems: 1 });
    requireStringArray(failureType.affected_scores, `failure_type.${failureType.code}.affected_scores`, errors, { minItems: 1, unique: true });
    for (const score of failureType.affected_scores || []) {
      if (!policy.score_fields.includes(score)) {
        add(errors, `failure_type.${failureType.code}.affected_scores contains unknown score ${score}`);
      }
    }
    if (byCode.has(failureType.code)) {
      add(errors, `failure_type.code duplicate ${failureType.code}`);
    } else {
      byCode.set(failureType.code, failureType);
    }
  }
  for (const code of requiredCodes) {
    if (!byCode.has(code)) {
      add(errors, `taxonomy missing required failure code ${code}`);
    }
  }
  return byCode;
}

function validatePolicy(policy, errors) {
  const allowed = [
    "policy_version",
    "compatible_sample_schema_versions",
    "score_fields",
    "critical_score_fields",
    "accepted_minimum_thresholds",
    "blocking_failure_behavior",
    "rejected_sample_requirements",
    "unknown_failure_code_behavior",
    "schema_version_compatibility",
    "deterministic_decision_rules"
  ];
  exactKeys(policy, allowed, "policy", errors);
  requireKeys(policy, allowed, "policy", errors);
  if (policy.policy_version !== "local_visual_eval.evaluation_policy.v1") {
    add(errors, "policy.policy_version is unsupported");
  }
  requireStringArray(policy.compatible_sample_schema_versions, "policy.compatible_sample_schema_versions", errors, { minItems: 1, unique: true });
  requireStringArray(policy.score_fields, "policy.score_fields", errors, { minItems: 1, unique: true });
  requireStringArray(policy.critical_score_fields, "policy.critical_score_fields", errors, { minItems: 1, unique: true });
  for (const field of policy.critical_score_fields || []) {
    if (!policy.score_fields.includes(field)) {
      add(errors, `policy.critical_score_fields contains unknown score ${field}`);
    }
  }
  if (!isPlainObject(policy.accepted_minimum_thresholds)) {
    add(errors, "policy.accepted_minimum_thresholds must be an object");
  } else {
    exactKeys(policy.accepted_minimum_thresholds, policy.score_fields, "policy.accepted_minimum_thresholds", errors);
    for (const field of policy.score_fields) {
      const value = policy.accepted_minimum_thresholds[field];
      if (!Number.isInteger(value) || value < 0 || value > 5) {
        add(errors, `policy.accepted_minimum_thresholds.${field} must be an integer from 0 to 5`);
      }
    }
  }
  if (policy.unknown_failure_code_behavior !== "fail_closed") {
    add(errors, "policy.unknown_failure_code_behavior must be fail_closed");
  }
  if (!isPlainObject(policy.rejected_sample_requirements)) {
    add(errors, "policy.rejected_sample_requirements must be an object");
  }
  requireStringArray(policy.deterministic_decision_rules, "policy.deterministic_decision_rules", errors, { minItems: 1 });
}

function validateSampleShape(sample, schema, policy, errors) {
  const rootKeys = schema.required || [];
  exactKeys(sample, rootKeys, "sample", errors);
  requireKeys(sample, rootKeys, "sample", errors);
  if (!policy.compatible_sample_schema_versions.includes(sample.schema_version)) {
    add(errors, "sample.schema_version is not compatible");
  }
  requireString(sample.sample_id, "sample.sample_id", errors);
  if (!["accepted", "rejected"].includes(sample.decision)) {
    add(errors, "sample.decision must be accepted or rejected");
  }

  exactKeys(sample.asset_ref, ["kind", "ref", "image_binary_read_performed"], "sample.asset_ref", errors);
  requireKeys(sample.asset_ref, ["kind", "ref", "image_binary_read_performed"], "sample.asset_ref", errors);
  if (sample.asset_ref && sample.asset_ref.kind !== "metadata_only_reference") {
    add(errors, "sample.asset_ref.kind must be metadata_only_reference");
  }
  if (sample.asset_ref) {
    requireString(sample.asset_ref.ref, "sample.asset_ref.ref", errors);
    requireBoolean(sample.asset_ref.image_binary_read_performed, false, "sample.asset_ref.image_binary_read_performed", errors);
  }

  requireString(sample.shot_id, "sample.shot_id", errors);
  requireString(sample.prompt_ref, "sample.prompt_ref", errors);

  exactKeys(sample.review_scores, policy.score_fields, "sample.review_scores", errors);
  requireKeys(sample.review_scores, policy.score_fields, "sample.review_scores", errors);
  for (const field of policy.score_fields) {
    const value = sample.review_scores && sample.review_scores[field];
    if (!Number.isInteger(value) || value < 0 || value > 5) {
      add(errors, `sample.review_scores.${field} must be an integer from 0 to 5`);
    }
  }

  requireStringArray(sample.failure_codes, "sample.failure_codes", errors, { unique: true });
  requireStringArray(sample.correction_strategies, "sample.correction_strategies", errors);

  exactKeys(sample.reviewer_notes, ["summary", "positive_reasons", "watch_items"], "sample.reviewer_notes", errors);
  requireKeys(sample.reviewer_notes, ["summary", "positive_reasons", "watch_items"], "sample.reviewer_notes", errors);
  if (sample.reviewer_notes) {
    requireString(sample.reviewer_notes.summary, "sample.reviewer_notes.summary", errors);
    requireStringArray(sample.reviewer_notes.positive_reasons, "sample.reviewer_notes.positive_reasons", errors);
    requireStringArray(sample.reviewer_notes.watch_items, "sample.reviewer_notes.watch_items", errors);
  }

  const provenanceKeys = [
    "metadata_only",
    "provider_contact_performed",
    "image_generation_performed",
    "memory_write_performed"
  ];
  exactKeys(sample.provenance, provenanceKeys, "sample.provenance", errors);
  requireKeys(sample.provenance, provenanceKeys, "sample.provenance", errors);
  if (sample.provenance) {
    requireBoolean(sample.provenance.metadata_only, true, "sample.provenance.metadata_only", errors);
    requireBoolean(sample.provenance.provider_contact_performed, false, "sample.provenance.provider_contact_performed", errors);
    requireBoolean(sample.provenance.image_generation_performed, false, "sample.provenance.image_generation_performed", errors);
    requireBoolean(sample.provenance.memory_write_performed, false, "sample.provenance.memory_write_performed", errors);
  }
  requireString(sample.created_at, "sample.created_at", errors);
}

function evaluateDecision(sample, policy, taxonomyByCode, errors) {
  const blockingFailureCodes = [];
  const scoreFailures = [];
  for (const code of sample.failure_codes || []) {
    const failureType = taxonomyByCode.get(code);
    if (!failureType) {
      add(errors, `sample.failure_codes contains unknown code ${code}`);
      continue;
    }
    if (failureType.blocking) {
      blockingFailureCodes.push(code);
    }
  }
  for (const field of policy.critical_score_fields || []) {
    const score = sample.review_scores && sample.review_scores[field];
    const threshold = policy.accepted_minimum_thresholds[field];
    if (Number.isInteger(score) && Number.isInteger(threshold) && score < threshold) {
      scoreFailures.push({ field, score, threshold });
    }
  }
  const computedDecision = blockingFailureCodes.length > 0 || scoreFailures.length > 0
    ? "rejected"
    : "accepted";

  if (sample.decision === "rejected") {
    const requirements = policy.rejected_sample_requirements || {};
    if ((sample.failure_codes || []).length < requirements.minimum_failure_codes) {
      add(errors, "rejected sample must contain at least one failure code");
    }
    if ((sample.correction_strategies || []).length < requirements.minimum_correction_strategies) {
      add(errors, "rejected sample must contain at least one correction strategy");
    }
  }

  if (sample.decision === "accepted" && blockingFailureCodes.length > 0) {
    add(errors, "accepted sample must not contain blocking failure codes");
  }
  if (sample.decision !== computedDecision) {
    add(errors, `declared decision ${sample.decision} does not match computed decision ${computedDecision}`);
  }

  return {
    computedDecision,
    blockingFailureCodes,
    scoreFailures
  };
}

function main() {
  try {
    const samplePath = process.argv[2];
    if (!samplePath) {
      console.log(JSON.stringify({
        ok: false,
        error_type: "usage",
        errors: ["usage: node validate_local_visual_eval.js <sample.json>"]
      }, null, 2));
      process.exit(EXIT_POLICY_ERROR);
    }

    const baseDir = __dirname;
    const schema = readJson(path.join(baseDir, "visual_sample.schema.json"));
    const taxonomy = readJson(path.join(baseDir, "failure_taxonomy.json"));
    const policy = readJson(path.join(baseDir, "evaluation_policy.json"));
    const sample = readJson(path.resolve(samplePath));
    const errors = [];

    validateSchema(schema, errors);
    validatePolicy(policy, errors);
    const taxonomyByCode = validateTaxonomy(taxonomy, policy, errors);
    validateSampleShape(sample, schema, policy, errors);
    const evaluation = errors.length === 0
      ? evaluateDecision(sample, policy, taxonomyByCode, errors)
      : { computedDecision: "unknown", blockingFailureCodes: [], scoreFailures: [] };

    const summary = {
      ok: errors.length === 0,
      sample_id: sample.sample_id || null,
      declared_decision: sample.decision || null,
      computed_decision: evaluation.computedDecision,
      failure_codes: Array.isArray(sample.failure_codes) ? sample.failure_codes : [],
      blocking_failure_codes: evaluation.blockingFailureCodes,
      score_failures: evaluation.scoreFailures,
      correction_strategy_count: Array.isArray(sample.correction_strategies)
        ? sample.correction_strategies.length
        : 0,
      errors
    };

    console.log(JSON.stringify(summary, null, 2));
    process.exit(errors.length === 0 ? 0 : EXIT_POLICY_ERROR);
  } catch (error) {
    console.log(JSON.stringify({
      ok: false,
      error_type: "tool_error",
      message: error && error.message ? error.message : String(error)
    }, null, 2));
    process.exit(EXIT_TOOL_ERROR);
  }
}

main();
