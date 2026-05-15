# Prompt Schema Validator Fixture Matrix

```yaml
matrix_id: prompt_schema_validator_fixture_matrix_v1
source_phase: v12_003_prompt_schema_validator_rule_specification_gate
source_spec: docs/prompt_schema_validator_rule_specification.md
fixture_files_created: false
machine_validator_implemented: false
scripts_modified: false
```

This matrix defines planned fixture names and expected outcomes for a future Prompt Schema Machine Validator. It does not create fixture files.

## Planned Fixture Directory

```yaml
planned_fixture_root: tests/fixtures/prompt_schema_validator/
fixture_files_created_now: false
directory_created_now: false
```

## Pass Fixtures

| planned file | artifact type | expected result | coverage |
|---|---|---|---|
| `pass/prompt_package_serum_bottle_v1.yaml` | prompt package | PASS | canonical prompt fields, synchronized prompt alias, negative prompt, product identity, constraints, execution boundary |
| `pass/product_brief_serum_bottle_v1.md` | product brief | PASS | selected product, identity, structure, material, label boundary, risks, acceptance criteria |
| `pass/static_review_prompt_package_v1.md` | static review | PASS | reviewed artifact ref, static review result, watch items, A5 false, provider/image/memory false |
| `pass/A5_authorization_gate_minimal_generation.md` | A5 authorization gate | PASS | approved product/package/output dir, one-call budgets, no retry, secret boundary, execution not started |
| `pass/human_review_accepted_candidate.md` | human review | PASS | reviewed output, asset status, accepted candidate, commercial delivery boundary, memory suitability, key findings, local persistence |
| `pass/accepted_candidate_evidence_package.md` | evidence package | PASS | source output, prompt package, asset status, accepted decision, commercial delivery false, memory deferred, output not committed |

## Fail Fixtures

| planned file | artifact type | expected result | triggering rule |
|---|---|---|---|
| `fail/prompt_missing_canonical_prompt.yaml` | prompt package | ERROR | PP-001, PP-005 |
| `fail/positive_prompt_not_synced.yaml` | prompt package | ERROR | PP-004 |
| `fail/negative_prompt_not_literal_block.yaml` | prompt package | ERROR | PP-003 |
| `fail/prompt_package_implies_provider_contact.yaml` | prompt package | ERROR | PP-016, RT-003 |
| `fail/A5_auth_missing_budget.md` | A5 authorization | ERROR | A5-004, A5-005, A5-006 |
| `fail/static_review_claims_image_generation.md` | static review | ERROR | SR-006 |
| `fail/human_review_missing_commercial_delivery_boundary.md` | human review | ERROR | HR-004 |
| `fail/evidence_package_missing_memory_suitability.md` | evidence package | ERROR | EP-006 |

## Warn Fixtures

| planned file | artifact type | expected result | warning reason |
|---|---|---|---|
| `warn/legacy_prompt_package_missing_product_brief_ref.yaml` | prompt package | WARN | legacy route predates product brief refs |
| `warn/legacy_review_missing_watch_items.md` | human/static review | WARN | older review has verdict but no explicit watch item list |

## Expected Result Contract

```yaml
expected_result_contract:
  pass:
    exit_code_future: 0
    errors: 0
    warnings: 0
  warn:
    exit_code_future: 0
    errors: 0
    warnings_greater_than_zero: true
  fail:
    exit_code_future: nonzero
    errors_greater_than_zero: true
```

## Fixture Authoring Boundaries

```yaml
fixture_authoring_boundaries:
  fixture_files_created_in_v12_003: false
  future_fixture_files_must_be_synthetic_or_sanitized: true
  no_real_provider_payloads: true
  no_real_secret_values: true
  no_generated_images: true
  no_runs_output_copy: true
  no_accepted_samples_write: true
```

## Future Fixture Planning Questions

```yaml
open_questions_for_next_gate:
  fixture_format: markdown_and_yaml_mixed
  expected_result_manifest_needed: true
  legacy_fixture_scope: only_known_legacy_shapes
  negative_fixture_minimality: one_primary_failure_per_file_when_possible
  implementation_authorization_required_before_creation: true
```
