"use strict";

const fs = require("fs");
const path = require("path");
const { validateAndNormalizeHumanReview } = require("./validate_and_normalize_human_review.js");

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

function loadBaseInput() {
  const baseDir = __dirname;
  const visualEvalDir = path.resolve(baseDir, "..");
  return {
    importRecord: readJson(path.join(baseDir, "fixtures", "accepted.sanitized.review.json")),
    schema: readJson(path.join(visualEvalDir, "visual_sample.schema.json")),
    taxonomy: readJson(path.join(visualEvalDir, "failure_taxonomy.json")),
    policy: readJson(path.join(visualEvalDir, "evaluation_policy.json")),
    importSchema: readJson(path.join(baseDir, "human_review_import.schema.json")),
    importPolicy: readJson(path.join(baseDir, "import_policy.json"))
  };
}

const MUTATIONS = {
  UNSUPPORTED_IMPORT_SCHEMA_VERSION(input) {
    input.importRecord.import_schema_version = "9.9.9";
  },
  UNKNOWN_IMPORT_TOP_LEVEL_FIELD(input) {
    input.importRecord.unexpected_field = "synthetic fixture only";
  },
  WRONG_RECORD_ORIGIN(input) {
    input.importRecord.record_origin = "real_customer_review";
  },
  HUMAN_ORIGIN_WITHOUT_SANITIZED_MARKER(input) {
    input.importRecord.record_origin = "human_review";
  },
  WRONG_CONSENT_BASIS(input) {
    input.importRecord.consent_basis = "production_review";
  },
  RAW_SOURCE_RETAINED_TRUE(input) {
    input.importRecord.sanitization_attestation.raw_source_retained = true;
  },
  PERSONAL_DATA_ATTESTATION_TRUE(input) {
    input.importRecord.sanitization_attestation.contains_personal_data = true;
  },
  SECRET_ATTESTATION_TRUE(input) {
    input.importRecord.sanitization_attestation.contains_secret = true;
  },
  ABSOLUTE_PATH_ATTESTATION_TRUE(input) {
    input.importRecord.sanitization_attestation.contains_absolute_path = true;
  },
  REVIEWER_ALIAS_IS_EMAIL(input) {
    input.importRecord.reviewer_alias = "reviewer@example.test";
  },
  NOTES_CONTAIN_EMAIL(input) {
    input.importRecord.sample.reviewer_notes.summary = "Synthetic note with reviewer@example.test embedded.";
  },
  NOTES_CONTAIN_PHONE(input) {
    input.importRecord.sample.reviewer_notes.watch_items[0] = "Call +1 555 010 1234 for details.";
  },
  NOTES_CONTAIN_BEARER_TOKEN(input) {
    input.importRecord.sample.reviewer_notes.summary = "Bearer abcdefghijklmnopqrstuvwxyz012345";
  },
  ASSET_REF_ABSOLUTE_WINDOWS_PATH(input) {
    input.importRecord.sample.asset_ref.ref = "C:\\Users\\owner\\private\\image.png";
  },
  PROMPT_REF_UNIX_ABSOLUTE_PATH(input) {
    input.importRecord.sample.prompt_ref = "/home/owner/private/prompt.yaml";
  },
  ASSET_REF_UNC_PATH(input) {
    input.importRecord.sample.asset_ref.ref = "\\\\server\\share\\image.png";
  },
  REFERENCE_PATH_TRAVERSAL(input) {
    input.importRecord.sample.asset_ref.ref = "../private/image.png";
  },
  CREDENTIAL_BEARING_URL(input) {
    input.importRecord.sample.asset_ref.ref = "https://user:pass@example.test/image.png";
  }
};

function hasExpectedViolation(actualViolations, expectedViolation) {
  return actualViolations.some((violation) => {
    return violation.code === expectedViolation.code
      && violation.path === expectedViolation.path;
  });
}

function runCase(baseInput, caseDef) {
  const mutate = MUTATIONS[caseDef.case_id];
  if (!mutate) {
    return {
      case_id: caseDef.case_id,
      passed: false,
      reason: "missing_mutation"
    };
  }

  const input = cloneJson(baseInput);
  const before = stableJson(input);
  mutate(input);
  const changed = before !== stableJson(input);
  const result = validateAndNormalizeHumanReview(input);
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
  const manifest = readJson(path.join(baseDir, "import_regression_manifest.json"));
  const baseInput = loadBaseInput();
  const baseResult = validateAndNormalizeHumanReview(baseInput);
  const failures = [];

  if (!baseResult.valid) {
    failures.push({
      case_id: "BASE_IMPORT_FIXTURE_VALIDATION",
      reason: "base_import_fixture_must_be_valid",
      observed_violations: baseResult.violations.map((violation) => ({
        code: violation.code,
        path: violation.path
      }))
    });
  }

  const cases = Array.isArray(manifest.required_cases) ? manifest.required_cases : [];
  const caseResults = cases.map((caseDef) => runCase(baseInput, caseDef));
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
