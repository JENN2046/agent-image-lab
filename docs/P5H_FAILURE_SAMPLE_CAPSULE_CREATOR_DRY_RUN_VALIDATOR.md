# P5H Failure Sample Capsule Creator Dry Run Validator

```yaml
phase: p5h_failure_sample_capsule_creator_dry_run_validator
base_contract: AGENTS.md
mode: A4.8
intent: local_implementation
risk_level: R2
status: completed_validated_pending_guarded_local_commit
```

## Purpose

Validate that `scripts/create_failure_sample_capsule.js` is safe by default and cannot create the first failure capsule unless a later command explicitly includes `--confirm-create=true`.

## Added Validator

```text
scripts/validate_failure_sample_capsule_creator_dry_run.js
```

The validator checks:

- default command exits successfully in `plan_only` mode
- `writes_performed` remains `false`
- `confirm_create_required` is `true`
- the target capsule directory state is preserved
- source image availability is required only before the capsule exists; once the Git-tracked capsule exists, clone-portable validation may pass without `runs/`
- mismatched source image fails
- mismatched long edge fails
- unsupported sample id fails
- provider/plugin/API/image generation/memory/runtime/source-read/push guards remain false

## MVP Wiring

`scripts/validate_mvp.ps1` now runs the creator dry-run validator after the failure sample registry validators.

This keeps the new creator entrypoint inside the stable validation surface without executing capsule creation.

## Explicit Non-Authorization

This phase does not authorize:

- running `--confirm-create=true`
- creating `asset_archive/failure_samples/failure_french_summer_rattan_bag_v7_29_001/`
- writing `manifest.json`, `preview.webp`, `failure_record.json`, or `review_record.json`
- creating, copying, converting, or generating `preview.webp`
- provider/plugin/API/image generation
- DailyNote or VCP memory writes
- runtime, real manifest, VCPChat, or VCPToolBox reads
- production candidate creation
- push, tag, release, or deploy

## Result

```yaml
creator_dry_run_validator_added: true
mvp_wiring_added: true
confirm_create_executed: false
failure_sample_capsule_created: false
preview_created_or_copied: false
```
