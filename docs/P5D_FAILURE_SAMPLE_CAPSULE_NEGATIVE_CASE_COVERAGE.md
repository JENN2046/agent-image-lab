# P5d Failure Sample Capsule Negative Case Coverage

base_contract: AGENTS.md
mode: A4.8 local validation helper
status: completed_validated

## Purpose

Prove the failure sample capsule validator fails closed for malformed future
failure capsules while still allowing the current zero-sample policy state.

## Validator

```text
scripts/validate_failure_sample_capsule_registry_negative_cases.js
```

## Covered Cases

- empty registry passes by default
- empty registry fails with `--require-at-least=1`
- missing manifest fails
- missing preview fails
- preview hash mismatch fails
- missing `failure_record.json` fails
- missing `review_record.json` fails
- production candidate allowed flag fails
- memory write allowed flag fails
- DailyNote write allowed flag fails

## Fixture Boundary

Temporary fixtures are created only under ignored `.agent_private/` workspaces
and are removed before the validator exits.

The real `asset_archive/failure_samples/` directory is not modified by negative
case execution.

## Non-Authorization

This coverage does not authorize:

- creating a real `asset_archive/failure_samples/<sample_id>/` capsule
- creating real sample `manifest.json`, `preview.webp`, `failure_record.json`, or `review_record.json`
- copying, converting, or generating preview images
- provider/plugin/API/image generation
- DailyNote or VCP memory writes
- runtime, real manifest, VCPChat, or VCPToolBox reads
- production candidate promotion
- push, tag, release, or deploy

## Recommended Next

Decide whether to wire the zero-sample validator and negative-case validator
into `scripts/validate_mvp.ps1`, or keep them as targeted P5 validators until a
real failure capsule authorization exists.
