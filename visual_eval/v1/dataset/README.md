# Local Visual Eval Dataset Seed v1.2

This directory contains the first repeatable metadata-only dataset seed for the local visual evaluation loop.

It is synthetic seed data. The samples are structured review records used to exercise schema validation, failure classification, policy evaluation, and deterministic accepted/rejected outcomes. The dataset does not contain real image files, real customer data, real private image paths, provider output, or human review records.

## Contents

- `dataset_manifest.json`: dataset contract, source label, sample counts, required failure codes, and validation expectations.
- `accepted.samples.json`: 10 synthetic metadata-only samples that compute to `accepted`.
- `rejected.samples.json`: 10 synthetic metadata-only samples that compute to `rejected`.
- `validate_dataset.js`: Node.js standard-library validator that imports the existing local `validateBundle`.

## Validation

Run from the repository root:

```bash
node visual_eval/v1/dataset/validate_dataset.js
```

The validator checks the manifest, sample counts, global `sample_id` uniqueness, metadata-only references, strict sample fields, existing bundle validation results, declared versus computed decisions, and failure coverage.

The expected dataset shape is:

- 10 accepted samples
- 10 rejected samples
- 20 total samples
- `record_origin: synthetic_seed`
- every required failure code appears at least twice across rejected samples

Required failure codes:

- `SUBJECT_DRIFT`
- `MATERIAL_PLASTICITY`
- `COMPOSITION_IMBALANCE`
- `DETAIL_OR_ANATOMY_ARTIFACT`
- `COMMERCIAL_UNFITNESS`

This seed only measures correction strategy presence. It does not measure correction effectiveness.

Future dataset versions may include explicitly provided, sanitized human review records. Those records must be added under a separate task and must not be inferred from this synthetic seed.
