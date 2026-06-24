"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
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

function snapshotDirectory(directoryPath) {
  const entries = [];

  function visit(currentPath) {
    for (const name of fs.readdirSync(currentPath).sort()) {
      const fullPath = path.join(currentPath, name);
      const relativePath = path.relative(directoryPath, fullPath).replace(/\\/g, "/");
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        entries.push({
          path: `${relativePath}/`,
          type: "directory"
        });
        visit(fullPath);
      } else if (stats.isFile()) {
        entries.push({
          path: relativePath,
          type: "file",
          sha256: crypto.createHash("sha256").update(fs.readFileSync(fullPath)).digest("hex")
        });
      }
    }
  }

  visit(directoryPath);
  return stableJson(entries);
}

function violationPair(violation) {
  return {
    code: violation.code,
    path: violation.path
  };
}

function violationKey(violation) {
  return `${violation.code}\u0000${violation.path}`;
}

function normalizeViolationPairs(violations) {
  const seen = new Set();
  const pairs = [];
  for (const violation of violations.map(violationPair)) {
    const key = violationKey(violation);
    if (!seen.has(key)) {
      seen.add(key);
      pairs.push(violation);
    }
  }
  return pairs.sort((left, right) => {
    const leftKey = violationKey(left);
    const rightKey = violationKey(right);
    return leftKey.localeCompare(rightKey);
  });
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
  EXPLICIT_SANITIZED_DRY_RUN_CONSENT_ACCEPTED(input) {
    input.importRecord.consent_basis = "explicit_user_provided_sanitized_dry_run";
  },
  UNKNOWN_DRY_RUN_CONSENT_REJECTED(input) {
    input.importRecord.consent_basis = "explicit_user_provided_sanitized_persistent_run";
  },
  PRODUCTION_REVIEW_CONSENT_REJECTED(input) {
    input.importRecord.consent_basis = "production_review";
  },
  DRY_RUN_WITH_RAW_SOURCE_RETAINED_REJECTED(input) {
    input.importRecord.consent_basis = "explicit_user_provided_sanitized_dry_run";
    input.importRecord.sanitization_attestation.raw_source_retained = true;
  },
  DRY_RUN_WITH_PERSONAL_DATA_ATTESTATION_REJECTED(input) {
    input.importRecord.consent_basis = "explicit_user_provided_sanitized_dry_run";
    input.importRecord.sanitization_attestation.contains_personal_data = true;
  },
  DRY_RUN_WITH_SECRET_ATTESTATION_REJECTED(input) {
    input.importRecord.consent_basis = "explicit_user_provided_sanitized_dry_run";
    input.importRecord.sanitization_attestation.contains_secret = true;
  },
  DRY_RUN_INVALID_SAMPLE_REJECTED(input) {
    input.importRecord.consent_basis = "explicit_user_provided_sanitized_dry_run";
    input.importRecord.sample.review_scores.subject_fidelity = 6;
  },
  DRY_RUN_RESULT_NOT_PERSISTED(input) {
    input.importRecord.consent_basis = "explicit_user_provided_sanitized_dry_run";
  },
  RAW_PAYLOAD_KEY_PRESENT(input) {
    input.importRecord.raw_payload = "synthetic fixture only";
  },
  PROVIDER_PAYLOAD_KEY_PRESENT(input) {
    input.importRecord.provider_payload = "synthetic fixture only";
  },
  COOKIE_KEY_PRESENT(input) {
    input.importRecord.cookie = "synthetic fixture only";
  },
  SESSION_KEY_PRESENT(input) {
    input.importRecord.session = "synthetic fixture only";
  },
  NOTES_CONTAIN_API_KEY_ASSIGNMENT(input) {
    input.importRecord.sample.reviewer_notes.summary = "Synthetic note with api_key=example_value.";
  },
  NOTES_CONTAIN_SK_PREFIX(input) {
    input.importRecord.sample.reviewer_notes.summary = "Synthetic note with sk-abcdefghijklmnop.";
  },
  NOTES_CONTAIN_JWT(input) {
    input.importRecord.sample.reviewer_notes.summary = "Synthetic note with eyJabc.def.ghi token shape.";
  },
  WRONG_SOURCE_DISPOSITION(input) {
    input.importRecord.source_disposition = "raw_source_retained";
  },
  POLICY_UNSAFE_STRING_RULES_MISSING(input) {
    delete input.importPolicy.unsafe_string_rules;
  },
  POLICY_FORBIDDEN_KEY_RULES_MISSING(input) {
    delete input.importPolicy.forbidden_key_rules;
  },
  POLICY_REQUIRED_RULE_REMOVED(input) {
    input.importPolicy.unsafe_string_rules = input.importPolicy.unsafe_string_rules.filter((rule) => {
      return rule.rule_id !== "unsafe_string.credential_bearing_url";
    });
  },
  POLICY_REQUIRED_RULE_PATTERN_WEAKENED(input) {
    input.importPolicy.unsafe_string_rules[0].pattern = ".*";
  },
  POLICY_REQUIRED_RULE_CODE_CHANGED(input) {
    input.importPolicy.unsafe_string_rules[0].code = "SECRET_PATTERN_DETECTED";
  },
  POLICY_DUPLICATE_RULE_ID(input) {
    input.importPolicy.unsafe_string_rules[1].rule_id = input.importPolicy.unsafe_string_rules[0].rule_id;
  },
  POLICY_STATEFUL_REGEX_FLAG(input) {
    input.importPolicy.unsafe_string_rules[0].flags = "g";
  },
  POLICY_INVALID_REGEX(input) {
    input.importPolicy.unsafe_string_rules[0].pattern = "[";
  },
  IMPORT_SCHEMA_EXTRA_PROPERTY(input) {
    input.importSchema.properties.extra_wrapper_field = {
      type: "string"
    };
  },
  IMPOSSIBLE_REVIEWED_AT_DATE(input) {
    input.importRecord.reviewed_at = "2026-02-30T10:00:00Z";
  },
  POLICY_ALLOWED_ORIGINS_EXTRA(input) {
    input.importPolicy.allowed_record_origins.push("human_review");
  },
  POLICY_FORBIDDEN_ORIGINS_MISSING(input) {
    input.importPolicy.forbidden_record_origins = input.importPolicy.forbidden_record_origins.filter((origin) => origin !== "human_review");
  },
  POLICY_CONSENT_EXTRA(input) {
    input.importPolicy.allowed_consent_basis.push("human_verified");
  },
  POLICY_STABLE_CODES_EXTRA(input) {
    input.importPolicy.stable_violation_codes.push("OPTIONAL_UNKNOWN_CODE");
  },
  POLICY_UNSAFE_CLASSES_EXTRA(input) {
    input.importPolicy.unsafe_pattern_classes.push("optional_unknown_class");
  },
  POLICY_NORMALIZATION_CLI_OUTPUT_WEAKENED(input) {
    input.importPolicy.normalization.cli_success_output = "full_record";
  },
  POLICY_VERSION_MISMATCH(input) {
    input.importPolicy.policy_version = "local_visual_eval.human_review_import_policy.v1.4.1";
  },
  MISSING_IMPORT_ID(input) {
    delete input.importRecord.import_id;
  },
  MISSING_REVIEWED_AT(input) {
    delete input.importRecord.reviewed_at;
  },
  EMPTY_IMPORT_ID(input) {
    input.importRecord.import_id = "";
  },
  INVALID_IMPORT_ID(input) {
    input.importRecord.import_id = "reviewer alpha";
  },
  INVALID_REVIEWED_AT(input) {
    input.importRecord.reviewed_at = "2026-06-01 10:00:00";
  },
  IMPORT_SCHEMA_REQUIRED_FIELD_REMOVED(input) {
    input.importSchema.required = input.importSchema.required.filter((field) => field !== "import_id");
  },
  IMPORT_POLICY_ORIGINS_MISSING(input) {
    delete input.importPolicy.allowed_record_origins;
  },
  IMPORT_POLICY_CONSENT_MISSING(input) {
    delete input.importPolicy.allowed_consent_basis;
  },
  IMPORT_POLICY_ATTESTATION_MISSING(input) {
    delete input.importPolicy.required_sanitization_attestation;
  },
  EMBEDDED_WINDOWS_PATH_IN_NOTES(input) {
    input.importRecord.sample.reviewer_notes.summary = "Synthetic note references C:\\Users\\Example\\review.png inside text.";
  },
  EMBEDDED_CREDENTIAL_URL_IN_NOTES(input) {
    input.importRecord.sample.reviewer_notes.summary = "Synthetic note references https://user:pass@example.test/review.png inside text.";
  },
  EMBEDDED_FILE_URL_IN_NOTES(input) {
    input.importRecord.sample.reviewer_notes.summary = "Synthetic note references file:///C:/Users/Example/review.png inside text.";
  },
  INVALID_RESULT_RETURNS_NO_NORMALIZED_SAMPLE(input) {
    input.importRecord.import_schema_version = "9.9.9";
  },
  INPUT_OBJECT_REMAINS_UNCHANGED(_input) {
  },
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

function compareViolationPairs(actualViolations, expectedViolations, allowAdditionalViolations) {
  const actual = normalizeViolationPairs(actualViolations);
  const expected = normalizeViolationPairs(expectedViolations);
  const expectedKeys = new Set(expected.map(violationKey));
  const actualKeys = new Set(actual.map(violationKey));
  const missing = expected.filter((violation) => !actualKeys.has(violationKey(violation)));
  const extra = allowAdditionalViolations
    ? []
    : actual.filter((violation) => !expectedKeys.has(violationKey(violation)));

  return {
    actual,
    expected,
    missing,
    extra,
    matched: missing.length === 0 && extra.length === 0
  };
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
  const afterMutation = stableJson(input);
  const changed = before !== afterMutation;
  const diskBefore = caseDef.assert_result_not_persisted === true
    ? snapshotDirectory(__dirname)
    : null;
  const result = validateAndNormalizeHumanReview(input);
  const diskAfter = caseDef.assert_result_not_persisted === true
    ? snapshotDirectory(__dirname)
    : null;
  const afterValidation = stableJson(input);
  const expectedValid = caseDef.expected_valid === true;
  const skipMutationChangeCheck = caseDef.skip_mutation_change_check === true;
  const inputUnchanged = afterMutation === afterValidation;
  const expectedViolations = Array.isArray(caseDef.expected_violations)
    ? caseDef.expected_violations
    : [];
  const comparison = compareViolationPairs(
    result.violations,
    expectedViolations,
    caseDef.allow_additional_violations === true
  );
  const normalizedSampleOk = expectedValid
    ? true
    : result.normalized_sample === null;
  const explicitNullCheckOk = caseDef.assert_normalized_sample_null === true
    ? result.normalized_sample === null
    : true;
  const explicitUnchangedCheckOk = caseDef.assert_input_unchanged === true
    ? inputUnchanged
    : true;
  const resultNotPersistedOk = caseDef.assert_result_not_persisted === true
    ? diskBefore === diskAfter
    : true;
  const passed = (changed || skipMutationChangeCheck)
    && result.valid === expectedValid
    && comparison.matched
    && normalizedSampleOk
    && explicitNullCheckOk
    && explicitUnchangedCheckOk
    && resultNotPersistedOk
    && inputUnchanged;

  return {
    case_id: caseDef.case_id,
    passed,
    changed,
    valid: result.valid,
    expected_valid: expectedValid,
    input_unchanged_by_validator: inputUnchanged,
    result_not_persisted: resultNotPersistedOk,
    normalized_sample_is_null: result.normalized_sample === null,
    expected_violations: caseDef.expected_violations,
    missing_expected_violations: comparison.missing,
    extra_observed_violations: comparison.extra,
    observed_violations: comparison.actual
  };
}

function runRegression() {
  const baseDir = __dirname;
  const manifest = readJson(path.join(baseDir, "import_regression_manifest.json"));
  const baseInput = loadBaseInput();
  const baseBeforeValidation = stableJson(baseInput);
  const baseResult = validateAndNormalizeHumanReview(baseInput);
  const baseInputUnchanged = baseBeforeValidation === stableJson(baseInput);
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
  if (!baseInputUnchanged) {
    failures.push({
      case_id: "BASE_IMPORT_INPUT_UNCHANGED",
      reason: "base_input_must_not_be_mutated_by_validator"
    });
  }

  const cases = Array.isArray(manifest.required_cases) ? manifest.required_cases : [];
  if (cases.length < 65) {
    failures.push({
      case_id: "REGRESSION_CASE_COUNT",
      reason: "regression_total_must_be_at_least_65",
      total: cases.length
    });
  }
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
