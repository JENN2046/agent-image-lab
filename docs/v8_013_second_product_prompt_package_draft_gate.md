# v8.013 Second Product Prompt Package Draft Gate

```yaml
base_contract: AGENTS.md
phase: v8_013_second_product_prompt_package_draft_gate
mode: A4.8
intent: local_implementation
risk_level: R1
```

## Purpose

Create the first prompt package draft for the Route B second product: multi-color breathable mesh sports visor / open-top sun visor.

This gate does not generate images, contact providers, call plugins, read `.env.local`, write memory, or authorize A5.

## Inputs

```yaml
source_route: Route_B_multi_product_prompt_package_expansion
source_phase: v8_012_second_product_candidate_and_brief_gate
product_brief_ref: briefs/product_brief_multi_color_mesh_sports_visor_v1.md
prompt_package_ref: prompts/image_generation/product_lifestyle_multi_color_mesh_sports_visor_v1.yaml
```

## Prompt Package Coverage

```yaml
required_fields:
  product_identity: true
  product_structure: true
  material_texture: true
  color_collection: true
  hero_color_priority: true
  shot_type: true
  composition: true
  environment: true
  lighting: true
  camera_language: true
  positive_prompt: true
  negative_constraints: true
  acceptance_criteria: true
  human_review_checklist: true
```

## Key Draft Decisions

```yaml
draft_decisions:
  product_must_read_as: open_top_sports_visor
  must_not_read_as:
    - baseball_cap
    - cycling_cap
    - bucket_hat
    - helmet
  visual_priority:
    - open_top_structure
    - curved_brim
    - mesh_panels
    - lightweight_fabric
    - coordinated_multi_color_family
  hero_color_rule: light_neutral_or_soft_pastel_leads
  dark_color_rule: black_or_navy_supporting_only
  people_allowed: false
  props_allowed: false
```

## Non-Authorization Boundary

```yaml
package_is_execution_request: false
A5_authorization_required_later: true
provider_contact_allowed_by_this_gate: false
plugin_call_allowed_by_this_gate: false
image_generation_allowed_by_this_gate: false
memory_write_allowed_by_this_gate: false
runtime_execution_allowed_by_this_gate: false
```

## Next Review

```yaml
recommended_next: v8_014_second_product_prompt_static_review_gate
purpose: statically review the prompt package before any future A5 decision
auto_execution_allowed: true
stop_after_review: true
```
