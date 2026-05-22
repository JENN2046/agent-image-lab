# v0.4.4 Sample Registry Dry Run

base_contract: AGENTS.md
phase: v0_4_4_sample_registry_dry_run
status: local_doc_schema_fixture_validator_gate

## Purpose

This gate defines a metadata-only accepted/rejected sample registry dry run. It
records how the system would reason about accepted and rejected sample registry
entries after review, failure taxonomy, and prompt correction hints exist.

This is not a promotion gate. It does not create an accepted sample, write a VCP
memory record, write DailyNote, create a production candidate, generate an image,
call a provider, or run an executor.

## Source Binding

The dry-run registry must bind to:

- `reports/visual_asset_eval_dry_run/v0_4_1_safe_portrait_review_pack.json`
- `tests/schema_examples/visual_failure_taxonomy.example.json`
- `tests/schema_examples/visual_prompt_correction_hint.example.json`
- `assets/visual_asset_authorization_registry.example.json`

## Registry Contract

```yaml
visual_sample_registry_dry_run:
  phase: v0_4_4_sample_registry_dry_run
  registry_mode: dry_run_no_promotion
  accepted_registry_dry_run:
    registry_type: accepted_sample_dry_run
    entries:
      - accepted_sample_eligible: false
        human_accepted: false
        accepted_gate_id: null
        would_create_accepted_sample: false
        actual_accepted_sample_created: false
        accepted_sample_promotion: false
  rejected_registry_dry_run:
    registry_type: rejected_sample_dry_run
    entries:
      - would_register_rejected_sample: true
        actual_rejected_sample_created: false
        failure_categories: []
        correction_hint_ref: tests/schema_examples/visual_prompt_correction_hint.example.json
  registry_boundaries:
    accepted_sample_promotion: false
    VCP_memory_write_performed: false
    DailyNote_write_performed: false
    production_candidate_created: false
```

## Required Guardrails

- Accepted dry-run entries must remain non-promotional.
- Rejected dry-run entries may describe `would_register_rejected_sample`, but
  `actual_rejected_sample_created` must remain `false`.
- Failure categories must be drawn from v0.4.2 taxonomy categories.
- Correction hint references must point to v0.4.3 prompt correction hints.
- All provider, image generation, memory, runtime, secret, production,
  dependency, commit, and push side-effect flags must remain `false`.

## Negative Cases

The validator must fail closed for:

- missing accepted registry section
- missing rejected registry section
- `accepted_sample_eligible: true`
- `human_accepted: true`
- non-null `accepted_gate_id`
- `would_create_accepted_sample: true`
- `actual_accepted_sample_created: true`
- `accepted_sample_promotion: true`
- `actual_rejected_sample_created: true`
- unknown rejected failure category
- correction hint source drift
- review pack source drift
- `VCP_memory_write_performed: true`
- `DailyNote_write_performed: true`
- `production_candidate_created: true`
- provider/image/runtime/secret side-effect drift
- raw local drive path or secret/env path references

## Non-Actions

This gate did not read image binaries, call a provider, generate an image, write
DailyNote, write VCP memory, perform runtime calls, read secrets, create a
production candidate, promote an accepted sample, promote a memory seed, change
dependencies, push, tag, release, or deploy.

Recommended next: v0.4.5 Visual Eval Consistency Check.
