"use strict";

const fs = require("fs");
const path = require("path");
const { validateDatasetBundle } = require("./validate_dataset.js");

const EXIT_OK = 0;
const EXIT_REGRESSION_MISMATCH = 2;
const EXIT_TOOL_ERROR = 1;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function stableJson(value) {
  return JSON.stringify(value);
}

function loadBaseBundle() {
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

function setAllScores(sample, score) {
  for (const field of Object.keys(sample.review_scores)) {
    sample.review_scores[field] = score;
  }
}

const MUTATIONS = {
  DUPLICATE_ID_WITHIN_ACCEPTED(bundle) {
    bundle.acceptedSamples[1].sample_id = bundle.acceptedSamples[0].sample_id;
  },
  DUPLICATE_ID_ACROSS_DECISIONS(bundle) {
    bundle.rejectedSamples[0].sample_id = bundle.acceptedSamples[0].sample_id;
  },
  MANIFEST_ACCEPTED_COUNT_MISMATCH(bundle) {
    bundle.manifest.accepted_count = 9;
  },
  MANIFEST_REJECTED_COUNT_MISMATCH(bundle) {
    bundle.manifest.rejected_count = 9;
  },
  MANIFEST_TOTAL_COUNT_MISMATCH(bundle) {
    bundle.manifest.total_count = 19;
  },
  FAILURE_CODE_UNDER_MINIMUM_COVERAGE(bundle) {
    for (const sample of bundle.rejectedSamples) {
      sample.failure_codes = sample.failure_codes.filter((code) => code !== "MATERIAL_PLASTICITY");
    }
  },
  REQUIRED_FAILURE_CODE_MISSING(bundle) {
    bundle.manifest.required_failure_codes = bundle.manifest.required_failure_codes
      .filter((code) => code !== "COMMERCIAL_UNFITNESS");
  },
  SYNTHETIC_DATA_MISLABELED_AS_HUMAN(bundle) {
    bundle.manifest.record_origin = "human_review";
  },
  ABSOLUTE_WINDOWS_REFERENCE(bundle) {
    bundle.acceptedSamples[0].asset_ref.ref = "C:\\Users\\owner\\image.png";
  },
  UNC_REFERENCE(bundle) {
    bundle.acceptedSamples[0].asset_ref.ref = "\\\\server\\share\\image.png";
  },
  PATH_TRAVERSAL_REFERENCE(bundle) {
    bundle.acceptedSamples[0].asset_ref.ref = "../private/image.png";
  },
  CREDENTIAL_BEARING_URL_REFERENCE(bundle) {
    bundle.acceptedSamples[0].asset_ref.ref = "https://user:pass@example.test/image.png";
  },
  DECLARED_ACCEPTED_COMPUTED_REJECTED(bundle) {
    bundle.acceptedSamples[0].review_scores.subject_fidelity = 3;
  },
  DECLARED_REJECTED_COMPUTED_ACCEPTED(bundle) {
    setAllScores(bundle.rejectedSamples[0], 4);
    bundle.rejectedSamples[0].failure_codes = [];
    bundle.rejectedSamples[0].correction_strategies = [
      "Keep one corrected product review route after removing failure triggers."
    ];
  },
  REJECTED_WITHOUT_CORRECTION_STRATEGY(bundle) {
    bundle.rejectedSamples[0].correction_strategies = [];
  },
  UNKNOWN_FAILURE_CODE(bundle) {
    bundle.rejectedSamples[0].failure_codes.push("NOT_A_TAXONOMY_CODE");
  }
};

function hasExpectedViolation(actualViolations, expectedViolation) {
  return actualViolations.some((violation) => {
    return violation.code === expectedViolation.code
      && violation.path === expectedViolation.path;
  });
}

function runCase(baseBundle, caseDef) {
  const mutate = MUTATIONS[caseDef.case_id];
  if (!mutate) {
    return {
      case_id: caseDef.case_id,
      passed: false,
      reason: "missing_mutation"
    };
  }

  const mutatedBundle = cloneJson(baseBundle);
  const before = stableJson(mutatedBundle);
  mutate(mutatedBundle);
  const changed = before !== stableJson(mutatedBundle);
  const result = validateDatasetBundle(mutatedBundle);
  const missing = caseDef.expected_violations.filter((expectedViolation) => {
    return !hasExpectedViolation(result.violations, expectedViolation);
  });
  const passed = changed && result.valid === false && missing.length === 0;

  return {
    case_id: caseDef.case_id,
    passed,
    changed,
    valid: result.valid,
    expected_violations: caseDef.expected_violations,
    missing_expected_violations: missing,
    observed_violations: result.violations.map((violation) => ({
      code: violation.code,
      path: violation.path
    }))
  };
}

function runRegression() {
  const baseDir = __dirname;
  const manifest = readJson(path.join(baseDir, "dataset_regression_manifest.json"));
  const baseBundle = loadBaseBundle();
  const baseResult = validateDatasetBundle(baseBundle);
  const failures = [];

  if (!baseResult.valid) {
    failures.push({
      case_id: "BASE_DATASET_VALIDATION",
      reason: "base_dataset_must_be_valid",
      observed_violations: baseResult.violations.map((violation) => ({
        code: violation.code,
        path: violation.path
      }))
    });
  }

  const cases = Array.isArray(manifest.required_cases) ? manifest.required_cases : [];
  const caseResults = cases.map((caseDef) => runCase(baseBundle, caseDef));
  for (const caseResult of caseResults) {
    if (!caseResult.passed) {
      failures.push(caseResult);
    }
  }

  const passed = caseResults.filter((caseResult) => caseResult.passed).length;
  return {
    valid: failures.length === 0,
    regression_version: manifest.regression_version,
    total: cases.length,
    passed,
    failed: failures.length,
    skipped: 0,
    failed_cases: failures
  };
}

function runCli() {
  try {
    const summary = runRegression();
    console.log(JSON.stringify(summary, null, 2));
    process.exit(summary.valid ? EXIT_OK : EXIT_REGRESSION_MISMATCH);
  } catch (_error) {
    console.log(JSON.stringify({
      valid: false,
      error: "runner_internal_error"
    }, null, 2));
    process.exit(EXIT_TOOL_ERROR);
  }
}

if (require.main === module) {
  runCli();
}
