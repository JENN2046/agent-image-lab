# Visual Asset Eval v0.1

base_contract: AGENTS.md
phase: v0_3_7d_visual_asset_eval_v0_1_gate
status: local_schema_validator_gate

## Purpose

Visual Asset Eval v0.1 defines the smallest review report that can explain why
a visual asset passes, why it is rejected, which visual dimension failed, and
whether it is suitable for commercial use, accepted_sample review, or memory
seeding.

This is a schema and validator gate only. It does not read image binaries,
generate images, call providers, write memory, create accepted_sample records,
or create production_candidate records.

## Required Dimensions

Every `visual_asset_review_report` must evaluate all dimensions below:

- composition
- lighting
- material_realism
- product_fidelity
- commercial_fitness
- AI_artifact_risk
- memory_suitability

Each dimension records:

- `score`: integer from 0 to 5
- `verdict`: `pass`, `watch`, or `fail`
- `rationale`: non-empty text explaining the judgment

## Required Questions

The report must answer:

- why_did_it_pass
- why_was_it_rejected
- failed_dimension
- commercial_use_suitability
- accepted_sample_eligibility
- memory_seed_eligibility

The report may recommend future review routes, but it cannot promote an asset
by field flip. It must keep gate requirements explicit.

## Decision Model

`review_outcome` may be:

- `pass`
- `reject`
- `needs_revision`

Pass reports require at least one `pass_reason_code`.

Reject and needs_revision reports require:

- at least one `rejection_reason_code`
- `primary_failure_dimension`

The `primary_failure_dimension` must be one of the required dimensions.

## Promotion Boundaries

Visual Asset Eval v0.1 can only make recommendations:

```yaml
accepted_sample_recommendation:
  eligible: true | false
  actual_accepted_sample_created: false
  requires:
    - accepted_gate_id
    - human_accepted: true
    - review_report_ref

memory_seed_recommendation:
  eligible: true | false
  actual_memory_seed_created: false
  requires:
    - memory_gate_id
    - memory_write_allowed_now: true
    - redacted_learning_summary

production_candidate_recommendation:
  eligible: false
  actual_production_candidate_created: false
  requires:
    - independent_A5_production_gate_id
```

Rules:

- `accepted_sample: true` is invalid without `accepted_gate_id` and
  `human_accepted: true`.
- `memory_seed: true` is invalid without `memory_gate_id` and
  `memory_write_allowed_now: true`.
- `production_candidate: true` is invalid in this v0.1 gate.
- The report must not write DailyNote or VCP memory.
- The report must not include raw local paths or image binary paths.

## Boundary Flags

Every report must keep these flags false:

```yaml
image_binary_read_performed: false
provider_call_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
runtime_call_performed: false
secret_value_read_performed: false
accepted_sample_created: false
memory_seed_created: false
production_candidate_created: false
push_performed: false
```

## Validator Coverage

`scripts/validate_visual_asset_eval_v0_1.js` must verify:

- required dimensions are present
- every dimension has score, verdict, and rationale
- scores stay in the 0 to 5 range
- pass requires pass reasons
- reject/needs_revision requires rejection reasons and primary failure dimension
- accepted_sample cannot be created by field flip
- memory_seed cannot be created without a memory gate
- production_candidate remains blocked
- image/provider/memory/runtime/secret side-effect flags remain false
- raw local paths and image binary paths are absent
