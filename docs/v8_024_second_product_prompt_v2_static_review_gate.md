# v8.024 Second Product Prompt V2 Static Review Gate

```yaml
phase: v8_024_second_product_prompt_v2_static_review_gate
base_contract: AGENTS.md
mode: A4.8_docs_only_static_review
intent: review
risk_level: R1
source_phase: v8_023_second_product_prompt_revision_plan_from_first_real_output
prompt_package_reviewed: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v2.yaml
provider_contact: false
image_generation: false
retry: false
memory_write: false
```

## Purpose

This gate statically reviews the second-product prompt v2 package against the
v8.021 real output review gaps. It does not authorize, request, or perform a
new generation.

## Static Review Result

```yaml
review_result: pass_ready_for_authorization_decision
prompt_v2_static_review_completed: true
A5_authorization_created: false
provider_contact: false
image_generation: false
retry: false
memory_write: false
```

Prompt v2 is materially stronger than v1 for the second round objective. It
explicitly addresses missing colors, weak lifestyle context, weak mesh/stitch
language, and product hierarchy.

## Checklist

| Check | Result | Evidence |
|---|---:|---|
| Includes all 6 target colors | Pass | `bright turquoise blue`, `soft pink`, `warm white`, `deep navy`, `black`, `muted olive green` are all required. |
| Turquoise or pink is visual highlight | Pass | `hero_color_priority` and `prompt` make turquoise or pink the first visual anchor. |
| Black / navy cannot dominate | Pass | Both structured fields and negative prompt forbid black or navy dominance. |
| Warm white cannot dominate | Pass | `warm_white_dominance_allowed: false` and negative prompt blocks cream dominance. |
| Moves away from studio look | Pass | Uses outdoor cafe table, city greenway, sports rest area, racket-sport club entrance, concrete, glass, greenery, city pavement. |
| Product remains 65-75% frame | Pass | `product_frame_coverage: 65_to_75_percent` appears in structured fields and prompt. |
| Mesh / stitching / brim / open-top structure strengthened | Pass | Honeycomb mesh, perforated weave, stitched edges, flexible curved brim, and open-top structure are all explicit. |
| Background cannot dominate | Pass | Background is softly out of focus and subordinate to product. |
| Future generation still requires A5 | Pass | `A5_authorization_required_later: true`; provider and image generation flags are false. |
| Memory write remains blocked | Pass | `memory_write_allowed: false` and `daily_note_write_allowed: false`. |

## Watch Items Before Any Future Generation

```yaml
watch_items:
  - future_A5_authorization_must_name_prompt_v2_exactly
  - future_A5_authorization_must_limit_provider_calls_and_output_images
  - runner_payload_mapping_should_use_prompt_field
  - no_retry_without_new_authorization
```

These are authorization and preflight concerns, not blockers for the static
prompt package itself.

## Non-Authorization Boundary

```yaml
A5_authorization_created: false
provider_contact: false
image_generation: false
retry: false
env_local_secret_value_read: false
DailyNote_write: false
VCP_memory_write: false
memory_write_path: false
production_candidate_002: false
Batch_005: false
runs_output_committed: false
accepted_samples_written: false
```

## Recommended Next

```yaml
phase: v8_025_second_product_next_minimal_generation_authorization_decision_gate
auto_execution_allowed: false
purpose: human decides whether to authorize one next minimal generation attempt using prompt v2
```
