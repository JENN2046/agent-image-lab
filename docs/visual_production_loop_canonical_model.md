# Visual Production Loop Canonical Model

## Purpose

The Visual Production Loop describes how Agent Image Lab turns a visual product
idea into reviewed production evidence while preserving hard boundaries around
provider calls, generated outputs, retouch, delivery, memory, and production
promotion.

This model is canonical for planning and review. It is not an execution
authorization.

## Core Objects

| Object | Role | Required fields |
|---|---|---|
| `ProductBrief` | Defines the product, intended visual goal, structure lock, material constraints, risks, and acceptance draft. | `selected_product`, `product_identity`, `locked_structure`, `material_constraints`, `forbidden_elements`, `acceptance_criteria_draft` |
| `ShotPlan` | Turns the brief into a visual strategy and one or more planned shots. | `visual_direction`, `scene_direction`, `composition_goal`, `material_focus`, `risk_watch_items` |
| `Shot` | A concrete planned image attempt or visual composition unit. | `shot_id`, `shot_role`, `product_role`, `camera_lighting`, `scene_context`, `success_criteria` |
| `PromptPackage` | Runner-facing prompt artifact with human-review aliases and negative boundaries. | `package_id`, `prompt`, `positive_prompt`, `negative_prompt`, `product_identity`, `selected_product`, `locked_structure`, `runner_prompt_mapping` |
| `GenerationAuthorization` | Explicit A5 gate that may allow exactly scoped provider contact and generation. | `approved_product`, `approved_prompt_package`, `output_directory`, `provider_calls_max`, `generation_attempts_max`, `output_images_max`, `auto_retry`, `secret_read_boundary` |
| `GenerationRun` | Record of one authorized execution attempt. | `provider_calls_used`, `generation_attempts_used`, `auto_retry_used`, `execution_status`, `stopped_after_generation` |
| `LocalOutput` | Local file evidence created by a generation run. | `output_directory`, `output_file`, `local_files_verified_count`, `local_persistence_success`, `output_image_added_to_git` |
| `HumanReview` | Human evaluation of a local output. | `reviewed_output`, `asset_status`, `accepted_candidate`, `commercial_delivery_ready`, `memory_suitability`, `key_findings`, `watch_items` |
| `AcceptedCandidate` | A reviewed asset that is useful as candidate evidence but not automatically delivery-ready. | `source_output`, `asset_status`, `accepted_candidate`, `commercial_delivery_ready`, `evidence_package_ref`, `watch_items` |
| `RetouchPlan` | Non-executing plan for visual polish or final correction. | `source_candidate`, `retouch_goals`, `non_goals`, `retouch_entry_conditions`, `execution_authorization_required` |
| `DeliveryReadinessPackage` | Delivery checklist and export/handoff planning. | `candidate_ref`, `export_spec`, `QA_checklist`, `client_review_package`, `commercial_delivery_ready_review_gate` |
| `MemorySuitabilityDecision` | Decision about whether a case is suitable for future memory planning. | `candidate_ref`, `memory_suitability`, `memory_write_allowed`, `independent_authorization_required`, `sensitive_data_check` |
| `RouteCloseout` | Final state record for a product or route. | `route_closed`, `accepted_candidate_created`, `commercial_delivery_ready`, `memory_write_performed`, `production_candidate_002_started`, `recommended_next` |

## Entry Conditions

### Retouch Entry

Retouch planning may begin only when:

- `accepted_candidate: true` is explicitly recorded.
- `commercial_delivery_ready: false` or watch items justify retouch planning.
- the source output path is referenced as documentation only unless a separate image handling authorization exists.
- no real retouch execution is implied by the plan.

### Delivery Entry

Delivery readiness planning may begin only when:

- candidate evidence exists.
- human review has separated `accepted_candidate` from `commercial_delivery_ready`.
- export spec, QA checklist, and client review package remain planning artifacts until a delivery execution gate exists.

### Memory Entry

Memory suitability planning may begin only when:

- human review or evidence package records `memory_suitability`.
- memory write is explicitly separate from memory suitability.
- any future write has independent authorization and avoids secret, private path, raw payload, image binary, and sensitive data leakage.

## Asset Status Taxonomy

| Status | Meaning |
|---|---|
| `draft_prompt_only` | Brief or prompt work exists, no generation authorization or local output. |
| `generation_authorized_not_executed` | A5 authorization exists, but no provider call has occurred. |
| `generated_local_output_verified` | A generation run produced a local file and local persistence verification passed. |
| `needs_revision` | Human review found the output useful but below accepted candidate threshold. |
| `accepted_candidate_with_minor_watch_items` | Candidate accepted for evidence with non-blocking watch items. |
| `accepted_candidate_with_minor_retouch` | Candidate accepted and likely needs light retouch planning before delivery. |
| `needs_minor_retouch` | Retouch should happen before any delivery readiness review. |
| `needs_final_retouch` | Final polish or correction is required before delivery readiness. |
| `commercial_delivery_ready` | Delivery readiness review has explicitly approved commercial delivery. |
| `rejected` | Output should not continue as candidate evidence. |

## Boundaries

`PromptPackage` is not `GenerationAuthorization`.

`AcceptedCandidate` is not `commercial_delivery_ready`.

`MemorySuitabilityDecision` is not `memory_write`.

`DeliveryReadinessPackage` is not real commercial delivery.

`RetouchPlan` is not real retouch execution.

No object in this model authorizes provider contact, image generation, memory
write, accepted_samples write, production_candidate_002, runtime execution, or
runs output commits by itself.
