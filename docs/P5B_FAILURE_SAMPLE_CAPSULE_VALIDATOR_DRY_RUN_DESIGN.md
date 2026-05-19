# P5b Failure Sample Capsule Validator Dry Run Design

base_contract: AGENTS.md
mode: A4.8 validator design dry-run
status: prepared_validated_no_execution

## Purpose

Design the future failure sample capsule validator without creating failure sample
capsules, converting previews, or changing validator behavior in this phase.

The validator should eventually prove that rejected or blocked visual evidence can
be tracked as Git-portable learning material while remaining permanently outside
production candidate and memory write paths.

## Target Root

```text
asset_archive/failure_samples/
```

Future sample layout:

```text
asset_archive/failure_samples/<sample_id>/
  manifest.json
  preview.webp
  failure_record.json
  review_record.json
```

## Proposed Validator

Future script name:

```text
scripts/validate_failure_sample_capsule_registry.js
```

Initial mode:

```yaml
mode: archive-directory
root: asset_archive/failure_samples
required_long_edge: 512
require_at_least: 0
```

The first implementation should allow zero samples so the project can carry the
directory policy before any failure capsule is authorized.

## Expected Report Shape

```yaml
passed: true | false
status: failure_sample_capsules_verified | failure_sample_capsules_failed
report_version: v1
root: asset_archive/failure_samples
total_samples: <number>
passed_count: <number>
failed_count: <number>
failed_sample_ids: []
failure_class_summary:
  registry_configuration: 0
  sample_failed: 0
  missing_capsule_manifest: 0
  missing_preview_file: 0
  invalid_preview_signature: 0
  preview_long_edge_mismatch: 0
  preview_hash_mismatch: 0
  missing_chain_file: 0
  manifest_contract_mismatch: 0
  production_or_memory_guard_violation: 0
samples: []
guard:
  provider_contact_performed: false
  plugin_call_performed: false
  api_call_performed: false
  image_generation_performed: false
  preview_creation_or_copy_performed: false
  DailyNote_write_performed: false
  VCP_memory_write_performed: false
  runtime_execution_performed: false
  real_manifest_read_performed: false
  real_vcpchat_read_performed: false
  real_vcptoolbox_read_performed: false
  push_tag_release_deploy_performed: false
```

## Per-Sample Checks

The future validator should fail closed when any of these are missing or drift:

- `manifest.json` exists
- `preview.webp` exists
- `preview.webp` has a valid WebP signature
- preview long edge is `512`
- preview sha256 matches manifest
- `failure_record.json` exists
- `review_record.json` exists
- manifest `sample_id` matches directory name
- manifest preview path is `preview.webp`
- manifest preview format is `webp`
- `production_candidate_allowed` is `false`
- `memory_write_allowed` is `false`
- `DailyNote_write_allowed` is `false`
- no Base64 evidence is present
- original sha256 is not required for portable validation

## Negative Cases

Future negative coverage should include:

- empty registry passes when `require_at_least=0`
- empty registry fails when `require_at_least=1`
- missing manifest fails
- missing preview fails
- invalid WebP signature fails
- preview hash mismatch fails
- wrong long edge fails
- missing failure record fails
- missing review record fails
- production candidate allowed flag fails
- memory write allowed flag fails
- DailyNote write allowed flag fails

Temporary negative fixtures must live under ignored `.agent_private/` and must
not modify real `asset_archive/failure_samples/` capsules.

## Non-Authorization

This dry run does not authorize:

- creating `asset_archive/failure_samples/<sample_id>/`
- creating `manifest.json`, `preview.webp`, `failure_record.json`, or `review_record.json`
- copying, converting, or generating `preview.webp`
- provider/plugin/API/image generation
- DailyNote or VCP memory write
- runtime, real manifest, VCPChat, or VCPToolBox read
- production candidate promotion
- push, tag, release, or deploy

## Recommended Next

Implement `scripts/validate_failure_sample_capsule_registry.js` as a zero-sample
safe validator, then add negative-case coverage before any real failure capsule
authorization package is accepted.
