# Visual Sample Memory Policy v0.1

base_contract: AGENTS.md
phase: v0_3_7e_visual_sample_memory_policy_gate
status: local_schema_validator_gate

## Purpose

Visual Sample Memory Policy v0.1 defines the smallest accepted/rejected sample
memory structure that can sit after Visual Asset Eval v0.1 without writing VCP
memory, writing DailyNote, creating production candidates, or promoting samples
by field flip.

This is a schema and validator gate only. It does not write real memory, create
accepted sample registry entries, copy image binaries, read image binaries, call
providers, run a runtime executor, or create production candidates.

## Accepted Sample Record

An `accepted_sample_record` is allowed only as a schema-only planning record.
It must include:

- `accepted_gate_id`
- `human_accepted: true`
- `review_report_ref`
- `visual_traits`
- `reuse_conditions`

The record is not an automatic promotion. It must keep:

```yaml
schema_only: true
accepted_sample_auto_promotion: false
accepted_sample_created: false
production_candidate: false
VCP_memory_write_performed: false
DailyNote_write_performed: false
```

## Rejected Sample Record

A `rejected_sample_record` is allowed only as a schema-only learning structure.
It must include:

- `rejection_reason`
- `failure_taxonomy`
- `correction_hint`
- `do_not_reuse_conditions`

Rejected samples can preserve negative learning for future review, but the
record must not write memory directly. Any future memory route requires a
separate `memory_gate_id`, `memory_write_allowed_now: true`, and a redacted
learning summary.

## Shared Boundaries

Both accepted and rejected sample records must keep these boundaries:

```yaml
schema_only: true
image_binary_included: false
raw_local_path_included: false
provider_call_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
runtime_call_performed: false
secret_value_read_performed: false
production_candidate: false
production_candidate_created: false
accepted_sample_auto_promotion: false
push_performed: false
```

The records must use redacted or project-relative references only. Raw local
paths, `.env` references, secret-bearing paths, and image binary paths are
invalid.

## Validator Coverage

`scripts/validate_visual_sample_memory_policy.js` must verify:

- accepted sample records require `accepted_gate_id`
- accepted sample records require `human_accepted: true`
- accepted sample records require `review_report_ref`
- accepted sample records require `visual_traits`
- accepted sample records require `reuse_conditions`
- rejected sample records require `rejection_reason`
- rejected sample records require `failure_taxonomy`
- rejected sample records require `correction_hint`
- rejected sample records require `do_not_reuse_conditions`
- both records remain schema-only
- accepted sample auto promotion remains false
- VCP memory and DailyNote writes remain false
- production candidate creation remains false
- raw local paths and image binary paths are absent
