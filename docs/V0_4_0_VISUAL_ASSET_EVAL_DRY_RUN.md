# v0.4.0 Visual Asset Eval Dry Run

base_contract: AGENTS.md
phase: v0_4_0_visual_asset_eval_dry_run
status: local_docs_schema_validator_fixture_gate

## Purpose

This gate moves Visual Asset Eval v0.1 from a defined schema into a metadata-only
dry-run review flow for existing authorized test assets.

The dry run may reference existing authorization registry entries, provider
receipts, generation attempt result JSON, and the existing Visual Asset Eval
v0.1 schema or fixture. It must not read image binaries, generate images, call a
provider, write memory, create a production candidate, promote an accepted
sample, or implement a real executor.

## Allowed Input Surface

The dry run is limited to existing repository records:

- `assets/visual_asset_authorization_registry.example.json`
- `reports/provider_receipts/*.json`
- `runs/real_generation/*/generation_attempt_result.json`
- `tests/schema_examples/visual_asset_review_report.example.json`

The validator may read those JSON metadata records only. It must not open the
referenced image binary path.

## Dry-Run Output Contract

```yaml
visual_asset_eval_dry_run:
  phase: v0_4_0_visual_asset_eval_dry_run
  asset_ref:
    registry_ref: assets/visual_asset_authorization_registry.example.json
    asset_id: <existing registry asset id>
    receipt_path: <existing provider receipt>
    attempt_result_path: <existing generation_attempt_result.json>
    image_binary_read_performed: false
  asset_class: test_asset | user_authorized_test_image | runs_artifact
  review_mode: dry_run
  review_report:
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
      reason: memory write remains blocked in dry-run
  decision:
    result: pass | patch | reject
    accepted_sample_eligible: false
    production_candidate_eligible: false
    memory_seed_eligible: false
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
- The referenced receipt path and attempt result path must match that registry
  entry.
- The receipt and attempt result files must be JSON metadata records.
- `review_mode` must be `dry_run`.
- `memory_suitability.value` must remain `false`.
- `decision.accepted_sample_eligible` must remain `false`.
- `decision.production_candidate_eligible` must remain `false`.
- `decision.memory_seed_eligible` must remain `false`.
- All side-effect flags must remain `false`.
- `Push_L2_exercised: false`
- `real_executor_implemented_now: false`
- `no_v0_4_1_started` must remain `true`.

## Negative Cases

The validator must fail closed for:

- missing `asset_ref`
- missing `review_report`
- `accepted_sample_eligible: true`
- `production_candidate_eligible: true`
- `memory_seed_eligible: true`
- `VCP_memory_write_performed: true`
- `image_generation_performed: true`
- `provider_call_performed: true`
- asset class outside the allowed enum
- decision result outside `pass`, `patch`, or `reject`
- missing `commercial_fitness`
- missing `ai_artifact_risk`
- missing `memory_suitability`

## Non-Actions

This gate did not perform provider calls, image generation, DailyNote writes,
VCP memory writes, runtime calls, secret reads, accepted sample promotion,
production candidate creation, dependency changes, commit, or push.
