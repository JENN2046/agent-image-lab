# v10.003 Third Product Prompt Workflow Expansion Route Gate

```yaml
phase: v10_003_third_product_prompt_workflow_expansion_route_gate
base_contract: AGENTS.md
mode: A4.8_docs_only_route_selection_product_candidate_planning_gate
source_phase: v10_002_next_project_route_selection_gate
source_commit: 266bbaa79fd49fc784830297b385ca5248ca9a4f
selected_route: third_product_prompt_workflow_expansion
selected_product_category: cosmetic_skincare_bottle
selected_product_direction: premium_serum_bottle
A5_authorization_created: false
provider_contact_allowed_now: false
image_generation_allowed_now: false
memory_write_allowed_now: false
production_candidate_002_allowed_now: false
runtime_allowed_now: false
```

## Purpose

v10.003 records the human selection of V10 Option C: `third_product_prompt_workflow_expansion`.

This gate chooses the third product direction and defines the safe boundary for the next product-loop expansion. It does not create a prompt package, authorize A5, generate images, contact a provider, read `.env.local`, write memory, enter `production_candidate_002`, write `accepted_samples/`, copy or move `runs/` outputs, or enter runtime.

## Selected Third Product Category

```yaml
selected_third_product:
  category: cosmetic_skincare_bottle
  direction: premium_serum_bottle
  working_label: premium serum bottle / cosmetic skincare bottle
  route_fit: high
  selected_for_next_brief: true
```

The selected third product is a premium cosmetic skincare bottle, with the initial working direction of a premium serum bottle.

## Selection Rationale

The premium serum bottle is the strongest third-product candidate because it is visually and technically different from the previous V7 and V8 products:

- Ceramic mug tested clean ecommerce still-life composition, matte ceramic surface, handle geometry, rim edge quality, and warm-gray premium background control.
- Sports visor tested lifestyle context, fabric / mesh material, multi-color product hierarchy, stitched edges, and urban sports composition.
- Premium serum bottle now tests transparent or semi-transparent material, reflective edges, liquid / glass / cap interactions, label boundary discipline, packaging finish, and brand-whitespace control.

This product type also supports both ecommerce hero imagery and premium lifestyle variants, making it a useful bridge between strict product still life and more atmospheric product storytelling.

## Product Risk Matrix

| Candidate | New capability tested | Primary risk | Fit | Decision |
|---|---|---|---|---|
| Cosmetic skincare bottle / premium serum bottle | Transparent or translucent material, reflections, liquid bottle body, label boundary, cap finish, packaging whitespace | Reflection artifacts, fake glass / plastic drift, unreadable or hallucinated label marks | High | Selected |
| Small leather handbag | Soft structure, leather grain, seam quality, strap geometry, premium accessory staging | Handle / strap deformation, over-textured leather, fashion styling drift | Medium | Backup |
| Premium candle jar | Glass jar, wax surface, label discipline, warm product mood, reflection control | Label artifacts, wax / glass ambiguity, over-dark lifestyle mood | Medium | Backup |
| Minimalist wireless earbuds case | Small glossy product, precise radius, hinge / seam control, tech packaging | Plastic over-sharpening, scale ambiguity, generic electronics look | Medium | Backup |
| Outdoor water bottle | Cylindrical geometry, cap detail, metal / plastic reflection, lifestyle durability | Bottle shape drift, cap artifacts, background overpowering product | Medium | Backup |

## Why This Product Tests A New Capability

The serum bottle expands the workflow into materials that are more fragile than matte ceramic or fabric. It forces the prompt workflow to control:

- transparent or semi-transparent surfaces without turning the product into generic plastic;
- controlled reflections that read as premium rather than noisy;
- a label / blank-label boundary without unwanted text, logo, or brand hallucination;
- cap and pump geometry without malformed joints;
- liquid or glass-body depth without muddy interiors;
- cosmetic packaging quality without props, people, or unauthorized branding.

This makes the third product a meaningful stress test for material realism, reflection discipline, and packaging governance.

## Route C Boundary

```yaml
route_C_boundary:
  route: third_product_prompt_workflow_expansion
  allowed_now:
    - product category selection
    - selection rationale
    - risk matrix
    - docs-only next brief recommendation
    - README / roadmap / master plan / agent board status sync
  not_allowed_now:
    provider_contact: true
    image_generation: true
    retry: true
    env_local_secret_value_read: true
    memory_write: true
    DailyNote_write: true
    VCP_memory_write: true
    production_candidate_002: true
    Batch_005: true
    runtime_CDP_bridge_MCP: true
    accepted_samples_write: true
    runs_output_commit: true
    derivative_image_creation: true
    real_retouch_execution: true
    A5_generation_authorization_creation: true
```

Route C can proceed in A4.8 only while it remains docs-only: brief, strategy, prompt planning, static review, and authorization-package drafting. Real generation requires a separate explicit A5 authorization package later.

## A5 Authorization Not Created

```yaml
A5_authorization:
  created: false
  prompt_approved: false
  selected_plugin_id: null
  selected_plugin_command: null
  selected_plugin_model: null
  max_plugin_calls: 0
  provider_contact: false
  image_generation: false
```

This gate intentionally stops before A5. It selects the third product lane but does not authorize a provider call, image generation, or prompt execution.

## Recommended Next

```yaml
recommended_next:
  phase: v10_004_third_product_brief_gate
  auto_execution_allowed: true
  purpose: 为第三商品创建 product brief；仍不生成图、不接 provider、不写 memory。
final_state:
  next_phase_started: false
```
