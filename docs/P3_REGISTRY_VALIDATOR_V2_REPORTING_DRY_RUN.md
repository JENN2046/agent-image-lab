# P3 Registry Validator v2 Reporting Dry Run

base_contract: AGENTS.md
mode: A4.8 local validator reporting enhancement
status: implemented_validated

## Purpose

Upgrade the registry-driven preview capsule validator from directory pass/fail
output to a multi-capsule report surface that remains stable as more accepted
sample capsules are added.

## Implemented Reporting Fields

The existing validator keeps its original fields and adds:

```yaml
report_version: v2
total_samples: <number>
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
  other: 0
samples:
  - sample_id: <sample_id>
    failure_classes: []
```

## Failure Class Policy

- `manifest_exists` becomes `missing_capsule_manifest`.
- `preview_file_exists` becomes `missing_preview_file`.
- `preview_webp_signature_valid` becomes `invalid_preview_signature`.
- preview long-edge failures become `preview_long_edge_mismatch`.
- preview sha256 failures become `preview_hash_mismatch`.
- missing `import_record.json`, `review_record.json`, or `approval_record.json`
  becomes `missing_chain_file`.
- manifest contract drift becomes `manifest_contract_mismatch`.

## Non-Authorization

- no preview capsule creation, copy, conversion, or generation
- no capsule manifest or preview file modification
- no provider, plugin, API, or image generation
- no DailyNote or VCP memory write
- no runtime, real manifest, VCPChat, or VCPToolBox read
- no production candidate
- no push, tag, release, or deploy

## Validation

```powershell
node --check scripts/validate_preview_capsule_registry.js
node --check scripts/validate_preview_capsule_registry_negative_cases.js
npm run validate-preview-capsule-registry
npm run validate-preview-capsule-negative-cases
git diff --check
node scripts/validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
```
