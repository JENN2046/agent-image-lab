# Local Visual Eval Baseline v1

This folder defines a fully offline visual evaluation baseline for metadata-only
sample review:

```text
Visual Sample -> Schema Validation -> Failure Classification -> Policy Evaluation -> accepted / rejected result
```

It does not contact providers, call APIs or plugins, read image binaries,
generate images, write memory, or update accepted/rejected registries.

## Files

- `visual_sample.schema.json` defines the strict sample shape.
- `failure_taxonomy.json` defines machine-readable failure codes.
- `evaluation_policy.json` defines deterministic accept/reject rules.
- `validate_local_visual_eval.js` validates taxonomy, policy, schema, and one sample.
- `robustness_manifest.json` defines adversarial and boundary mutation cases.
- `run_robustness_suite.js` builds mutated samples, policies, and taxonomies in memory.
- `fixtures/accepted.sample.json` must compute to `accepted`.
- `fixtures/rejected.sample.json` must compute to `rejected`.
- `fixtures/invalid.sample.json` must fail closed with exit code `2`.

## Validation

```powershell
node --check visual_eval/v1/validate_local_visual_eval.js
node --check visual_eval/v1/run_robustness_suite.js
node visual_eval/v1/validate_local_visual_eval.js visual_eval/v1/fixtures/accepted.sample.json
node visual_eval/v1/validate_local_visual_eval.js visual_eval/v1/fixtures/rejected.sample.json
node visual_eval/v1/validate_local_visual_eval.js visual_eval/v1/fixtures/invalid.sample.json
node visual_eval/v1/run_robustness_suite.js
```

Expected exits:

- syntax: `0`
- suite syntax: `0`
- accepted fixture: `0`
- rejected fixture: `0`
- invalid fixture: `2`
- robustness suite: `0`

The validator also exports `validateBundle({ schema, taxonomy, policy, sample })`
for in-memory regression use. The exported result contains stable `valid`,
`declared_decision`, `computed_decision`, and sorted `violations` fields. Tests
must depend only on violation `code` and `path`, not full human messages.
