# Sanitized Human Review Import Protocol v1.5

This directory defines a local, metadata-only import protocol for sanitized human review wrappers.

It is an import protocol, not an actual import of real review data. The included fixtures are synthetic and exist only to test privacy validation, existing visual sample validation, deterministic normalization, and import regression behavior.

## Contents

- `human_review_import.schema.json`: strict wrapper shape for sanitized review imports.
- `import_policy.json`: allowed source labels, attestation rules, unsafe pattern classes, and stable violation codes.
- `validate_and_normalize_human_review.js`: standard-library validator and in-memory normalizer.
- `import_regression_manifest.json`: required mutation cases and expected stable `code` / `path` assertions.
- `run_import_regression.js`: standard-library in-memory mutation runner.
- `fixtures/accepted.sanitized.review.json`: synthetic accepted wrapper fixture.
- `fixtures/rejected.sanitized.review.json`: synthetic rejected wrapper fixture.

## Boundaries

This protocol does not store raw source payloads, does not write to the dataset, does not write to a registry, does not write memory, does not read real images, and does not call providers, APIs, plugins, VCPToolBox, VCPChat, or Electron.

The fixtures use `consent_basis: synthetic_fixture`. They do not prove that a real reviewer exists, do not verify reviewer identity, and do not prove that real human review has occurred.

The only non-synthetic consent mode is `explicit_user_provided_sanitized_dry_run`. It means the user explicitly supplied an already-sanitized record for in-process validation and normalization only. It does not mean raw source is available, retained, independently verified, or persisted. It does not authorize dataset writes, registry writes, DailyNote writes, VCP memory writes, provider calls, plugin calls, image reads, or image generation. Here, memory-only means the Node.js process object lifetime; it is not VCP memory and it is not durable storage.

The wrapper contract fails closed when required wrapper fields are missing, when `import_id` is not a deterministic pseudonymous identifier, when `reviewed_at` is not valid ISO-8601 with an explicit timezone, or when the import schema or policy is missing, malformed, or weaker than the required contract. Allowed origins, consent basis, source disposition, sanitization attestation, and normalization behavior come from `import_policy.json`; the validator does not provide permissive default fallbacks.

Policy semantic integrity is part of validation: mandatory regex rules must keep stable `rule_id` and `pattern_class` values, canonical minimum `code` / `pattern` / `flags`, and non-stateful flags only. The policy also keeps exact allowed and forbidden origins, exact consent basis, exact stable violation codes, exact unsafe pattern classes, and summary-only CLI output.

## Validation

Run a fixture through the normalizer:

```bash
node visual_eval/v1/import/validate_and_normalize_human_review.js visual_eval/v1/import/fixtures/accepted.sanitized.review.json
```

Run the import regression suite:

```bash
node visual_eval/v1/import/run_import_regression.js
```

The normalizer rejects unsupported wrapper versions, unknown wrapper fields, missing wrapper fields, invalid import identifiers, invalid review timestamps, invalid import schema or policy contracts, invalid source labels, unsafe consent/source-retention states, failed sanitization attestations, unsafe reviewer aliases, personal data patterns, secret-like patterns, absolute paths, file URLs, UNC paths, parent traversal, credential-bearing URLs, raw payload fields, invalid visual samples, and sample decision mismatches.

The regression runner uses exact `code` / `path` matching by default. Additional violations are rejected unless a case explicitly opts into them. Every invalid result must keep `normalized_sample: null`, validation must not mutate the input object, and the import regression suite must contain at least 65 synthetic cases.

Successful CLI output is a summary only. The in-memory API can return a normalized sample, but this protocol does not persist it.

Future work may run explicitly provided sanitized human review records through the dry-run mode under a separate task. That future step must still reject raw private data, must not infer production review or identity verification, and must not persist the wrapper or normalized sample.
