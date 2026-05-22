# v0.4.1 Visual Asset Review Pack

base_contract: AGENTS.md
phase: v0_4_1_visual_asset_review_pack
status: local_docs_report_validator_gate

## Purpose

This gate turns the v0.4.0 metadata-only Visual Asset Eval dry-run into a
reusable review pack for an existing authorized test asset.

The review pack proves that Agent Image Lab can emit a structured review report
from existing asset metadata, an existing authorization registry entry, an
existing provider receipt, an existing generation attempt result, and the
existing v0.4.0 dry-run fixture. It does not inspect image pixels and does not
promote the asset.

## Allowed Input Surface

The review pack may read JSON/text metadata only:

- `assets/visual_asset_authorization_registry.example.json`
- `reports/provider_receipts/v0_3_3_safe_portrait_001_receipt.json`
- `runs/real_generation/v0_3_3_safe_portrait_001/generation_attempt_result.json`
- `tests/schema_examples/visual_asset_eval_dry_run.example.json`
- `schemas/visual_asset_review_report.schema.yaml`

The validator must not read the referenced image binary path.

## Review Pack Output Contract

```yaml
visual_asset_review_pack:
  phase: v0_4_1_visual_asset_review_pack
  source_dry_run_ref: tests/schema_examples/visual_asset_eval_dry_run.example.json
  asset_ref:
    registry_ref: assets/visual_asset_authorization_registry.example.json
    asset_id: <existing registry asset id>
    receipt_path: <existing provider receipt>
    attempt_result_path: <existing generation_attempt_result.json>
    asset_class: <registry entry asset_class>
    image_binary_read_performed: false
  review_mode: dry_run_review_pack
  existing_asset_metadata_only: true
  structured_review_report:
    composition:
      score: 0-10
      finding: <text>
    lighting:
      score: 0-10
      finding: <text>
    material_realism:
      score: 0-10
      finding: <text>
    product_fidelity:
      score: 0-10
      finding: <text>
    commercial_fitness:
      score: 0-10
      finding: <text>
    ai_artifact_risk:
      score: 0-10
      finding: <text>
    memory_suitability:
      value: false
      reason: memory write remains blocked in dry-run review pack
  review_summary:
    overall_result: pass | patch | reject
    why_keep_for_review: <text>
    why_not_accept: <text>
    next_dry_run_action: define_failure_taxonomy
  review_pack_decision:
    result: pass | patch | reject
    accepted_sample_eligible: false
    production_candidate_eligible: false
    memory_seed_eligible: false
    requires_human_review: true
  side_effects:
    provider_call_performed: false
    image_generation_performed: false
    VCP_memory_write_performed: false
    DailyNote_write_performed: false
    production_candidate_created: false
    accepted_sample_promoted: false
```

## Required Guardrails

- The referenced asset must already exist in the authorization registry.
- `asset_ref.asset_class` must match the referenced registry entry.
- The review pack must bind back to the v0.4.0 dry-run fixture for the same
  asset id, task id, receipt path, attempt result path, and asset class.
- The receipt and attempt result files are read as JSON metadata only.
- `existing_asset_metadata_only` must remain `true`.
- `image_binary_read_performed` must remain `false`.
- `structured_review_report.memory_suitability.value` must remain `false`.
- `review_pack_decision.accepted_sample_eligible` must remain `false`.
- `review_pack_decision.production_candidate_eligible` must remain `false`.
- `review_pack_decision.memory_seed_eligible` must remain `false`.
- `Push_L2_exercised: false`
- `real_executor_implemented_now: false`
- All provider, image generation, memory, runtime, secret, dependency, commit,
  and push side-effect flags must remain `false`.

## Negative Cases

The validator must fail closed for:

- missing review pack
- missing `asset_ref`
- registry `asset_class` mismatch
- dry-run binding mismatch
- missing structured review report
- missing commercial fitness
- `memory_suitability.value: true`
- `accepted_sample_eligible: true`
- `production_candidate_eligible: true`
- `memory_seed_eligible: true`
- `image_binary_read_performed: true`
- `provider_call_performed: true`
- `image_generation_performed: true`
- `VCP_memory_write_performed: true`
- raw local drive paths
- secret/env path references

## Non-Actions

This gate did not read image binaries, call a provider, generate an image, write
DailyNote, write VCP memory, perform runtime calls, read secrets, create a
production candidate, promote an accepted sample, promote a memory seed, change
dependencies, commit, or push.

Recommended next: define the v0.4.2 Visual Failure Taxonomy after post-commit
review and Push_L3 manual guarded push classification.
