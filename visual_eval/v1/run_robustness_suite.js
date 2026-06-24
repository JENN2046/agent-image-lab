"use strict";

const fs = require("fs");
const path = require("path");
const { validateBundle } = require("./validate_local_visual_eval.js");

const EXIT_TOOL_ERROR = 1;
const EXIT_POLICY_ERROR = 2;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getAtPath(object, pathParts) {
  return pathParts.reduce((current, part) => current[part], object);
}

function parentAtPath(object, pathParts) {
  if (pathParts.length === 0) {
    throw new Error("mutation path must not be empty");
  }
  return getAtPath(object, pathParts.slice(0, -1));
}

function applyMutation(root, mutation) {
  const before = JSON.stringify(root);
  const parent = parentAtPath(root, mutation.path);
  const key = mutation.path[mutation.path.length - 1];

  if (mutation.type === "set" || mutation.type === "replace") {
    parent[key] = clone(mutation.value);
  } else if (mutation.type === "delete") {
    delete parent[key];
  } else if (mutation.type === "append") {
    if (!Array.isArray(parent[key])) {
      throw new Error(`append target is not an array at ${mutation.path.join(".")}`);
    }
    parent[key].push(clone(mutation.value));
  } else {
    throw new Error(`unsupported mutation type ${mutation.type}`);
  }

  const after = JSON.stringify(root);
  return before !== after;
}

function sorted(values) {
  return values.slice().sort();
}

function sameArray(a, b) {
  return JSON.stringify(sorted(a)) === JSON.stringify(sorted(b));
}

function loadBundle(baseDir, caseDef) {
  const sample = readJson(path.join(baseDir, caseDef.base_ref));
  const schema = readJson(path.join(baseDir, "visual_sample.schema.json"));
  const taxonomy = readJson(path.join(baseDir, "failure_taxonomy.json"));
  const policy = readJson(path.join(baseDir, "evaluation_policy.json"));
  return { schema, taxonomy, policy, sample };
}

function mutationTarget(bundle, caseDef) {
  if (caseDef.target === "sample") return bundle.sample;
  if (caseDef.target === "policy") return bundle.policy;
  if (caseDef.target === "taxonomy") return bundle.taxonomy;
  throw new Error(`unsupported case target ${caseDef.target}`);
}

function validateManifest(manifest) {
  const failures = [];
  const requiredCaseIds = new Set([
    "SCORE_FLOAT",
    "SCORE_BELOW_MIN",
    "SCORE_ABOVE_MAX",
    "UNKNOWN_FAILURE_CODE",
    "ACCEPTED_WITH_BLOCKING_FAILURE",
    "REJECTED_WITHOUT_CORRECTION_STRATEGY",
    "DECLARED_ACCEPTED_COMPUTED_REJECTED",
    "DECLARED_REJECTED_COMPUTED_ACCEPTED",
    "UNSUPPORTED_SCHEMA_VERSION",
    "UNKNOWN_TOP_LEVEL_FIELD",
    "UNKNOWN_REVIEW_SCORE_FIELD",
    "MALFORMED_PROVENANCE",
    "DUPLICATE_FAILURE_CODE",
    "EMPTY_CORRECTION_STRATEGY",
    "POLICY_MISSING_CRITICAL_THRESHOLD",
    "TAXONOMY_UNKNOWN_AFFECTED_SCORE",
    "SAMPLE_MISSING_REQUIRED_FIELD",
    "FAILURE_CODES_WRONG_TYPE",
    "REVIEW_SCORE_BOOLEAN",
    "EMPTY_REVIEWER_NOTES"
  ]);

  if (!Array.isArray(manifest.cases)) {
    failures.push({ case_id: "manifest", reason: "cases must be an array" });
    return failures;
  }

  const seen = new Set();
  for (const caseDef of manifest.cases) {
    if (seen.has(caseDef.case_id)) {
      failures.push({ case_id: caseDef.case_id, reason: "duplicate case_id" });
    }
    seen.add(caseDef.case_id);
    if (/skip|todo|only|disabled/i.test(caseDef.case_id)) {
      failures.push({ case_id: caseDef.case_id, reason: "case_id contains disabled marker" });
    }
    if (!Array.isArray(caseDef.mutations) || caseDef.mutations.length === 0) {
      failures.push({ case_id: caseDef.case_id, reason: "case must contain at least one mutation" });
    }
    if (!Array.isArray(caseDef.expected_violation_codes) || caseDef.expected_violation_codes.length === 0) {
      failures.push({ case_id: caseDef.case_id, reason: "case must declare expected violation codes" });
    }
  }

  for (const caseId of requiredCaseIds) {
    if (!seen.has(caseId)) {
      failures.push({ case_id: caseId, reason: "required case missing" });
    }
  }
  return failures;
}

function runCase(baseDir, caseDef) {
  const bundle = loadBundle(baseDir, caseDef);
  const target = mutationTarget(bundle, caseDef);
  let changedCount = 0;
  for (const mutation of caseDef.mutations) {
    if (applyMutation(target, mutation)) {
      changedCount += 1;
    }
  }
  const result = validateBundle(bundle);
  const actualCodes = result.violations.map((violation) => violation.code);
  const actualPaths = result.violations.map((violation) => violation.path);
  const passed = changedCount === caseDef.mutations.length &&
    result.valid === caseDef.expected_valid &&
    result.declared_decision === caseDef.expected_declared_decision &&
    result.computed_decision === caseDef.expected_computed_decision &&
    sameArray(actualCodes, caseDef.expected_violation_codes) &&
    sameArray(actualPaths, caseDef.expected_violation_paths);

  return {
    case_id: caseDef.case_id,
    passed,
    changed_mutations: changedCount,
    expected_valid: caseDef.expected_valid,
    actual_valid: result.valid,
    expected_declared_decision: caseDef.expected_declared_decision,
    actual_declared_decision: result.declared_decision,
    expected_computed_decision: caseDef.expected_computed_decision,
    actual_computed_decision: result.computed_decision,
    expected_violation_codes: caseDef.expected_violation_codes,
    actual_violation_codes: actualCodes,
    expected_violation_paths: caseDef.expected_violation_paths,
    actual_violation_paths: actualPaths
  };
}

function runSuite() {
  const baseDir = __dirname;
  const manifest = readJson(path.join(baseDir, "robustness_manifest.json"));
  const manifestFailures = validateManifest(manifest);
  const caseResults = manifestFailures.length === 0
    ? manifest.cases.map((caseDef) => runCase(baseDir, caseDef))
    : [];
  const failedCases = caseResults.filter((result) => !result.passed);
  const summary = {
    valid: manifestFailures.length === 0 && failedCases.length === 0,
    total: caseResults.length,
    passed: caseResults.filter((result) => result.passed).length,
    failed: failedCases.length + manifestFailures.length,
    skipped: 0,
    manifest_failures: manifestFailures,
    failed_cases: failedCases
  };

  console.log(JSON.stringify(summary, null, 2));
  return summary.valid ? 0 : EXIT_POLICY_ERROR;
}

try {
  process.exit(runSuite());
} catch (error) {
  console.log(JSON.stringify({
    valid: false,
    total: 0,
    passed: 0,
    failed: 1,
    skipped: 0,
    error_detail: error && typeof error.toString === "function" ? error.toString() : String(error)
  }, null, 2));
  process.exit(EXIT_TOOL_ERROR);
}
