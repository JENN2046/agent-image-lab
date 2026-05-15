# Visual Production Loop State Machine

## Canonical States

| State | Meaning | Minimum evidence |
|---|---|---|
| `brief_created` | Product intent and constraints are recorded. | Product brief document |
| `shot_plan_created` | Visual strategy and shot direction are recorded. | Shot plan or visual strategy section |
| `prompt_package_created` | Runner-facing prompt package exists. | Prompt package path |
| `prompt_static_reviewed` | Prompt package is reviewed without execution. | Static review record |
| `generation_authorized` | A5 generation authorization exists. | Authorization gate and confirmation boundary |
| `generation_executed` | Authorized provider call was attempted. | Execution record |
| `local_output_verified` | Local output persistence passed. | Verified local file count and output path |
| `human_review_completed` | Human review records status and findings. | Human review document |
| `accepted_candidate_created` | Output is accepted as candidate evidence. | Evidence package or accepted candidate record |
| `retouch_planned` | Retouch goals and boundaries are planned. | Retouch plan |
| `delivery_readiness_planned` | Delivery checklist and export/handoff planning exist. | Delivery readiness package |
| `memory_suitability_planned` | Memory suitability is planned or deferred. | Memory suitability decision |
| `route_closed` | Route state is finalized. | Route closeout |

## Allowed Forward Transitions

```text
brief_created
-> shot_plan_created
-> prompt_package_created
-> prompt_static_reviewed
-> generation_authorized
-> generation_executed
-> local_output_verified
-> human_review_completed
-> accepted_candidate_created
-> retouch_planned
-> delivery_readiness_planned
-> memory_suitability_planned
-> route_closed
```

Some paths may close early, but early closeout must record what did not happen.

## Required Separation Rules

- `prompt_package_created` may lead to `prompt_static_reviewed`, but not directly to `generation_executed`.
- `generation_authorized` is separate from `generation_executed`.
- `local_output_verified` is separate from `human_review_completed`.
- `accepted_candidate_created` is separate from `commercial_delivery_ready`.
- `memory_suitability_planned` is separate from `memory_write`.
- `retouch_planned` is separate from real retouch execution.
- `delivery_readiness_planned` is separate from real delivery.

## Forbidden Transitions

| Forbidden transition | Reason |
|---|---|
| `prompt_package_created -> generation_executed` without A5 authorization | Prompt packages cannot trigger provider contact. |
| `generation_executed -> accepted_candidate_created` without `human_review_completed` | Local output is not accepted without human review. |
| `accepted_candidate_created -> commercial_delivery_ready` without delivery readiness review | Candidate evidence is not commercial delivery approval. |
| `accepted_candidate_created -> memory_write` without `memory_suitability: true` and independent authorization | Memory suitability and memory write are separate gates. |
| `accepted_candidate_created -> accepted_samples_written` without separate authorization | Accepted samples are an independent write surface. |
| `any state -> production_candidate_002` without independent gate | Production candidate promotion is never inferred. |
| `any state -> provider_contact` without generation authorization | Provider contact is A5-only. |
| `any state -> runs_output_committed` | Generated output files remain ignored unless separately authorized. |

## Closeout Requirements

Every route closeout must explicitly state:

- whether a generation run happened.
- whether local output was verified.
- whether human review completed.
- whether an accepted candidate exists.
- whether retouch was planned or executed.
- whether delivery readiness was planned or commercial delivery was executed.
- whether memory suitability was planned and whether memory write happened.
- whether accepted_samples were written.
- whether runs outputs were committed.
- whether production_candidate_002 started.
