# v10.006 Third Product Prompt Package Static Review And YAML Format Fix Gate

```yaml
phase: v10_006_third_product_prompt_package_static_review_and_yaml_format_fix_gate
base_contract: AGENTS.md
mode: A4.8_docs_only_static_review_yaml_format_fix_gate
source_phase: v10_005_third_product_prompt_package_draft_gate
source_commit: 19c6a5a7f71d2af208c381a23a4c5ab0771ba533
selected_route: third_product_prompt_workflow_expansion
selected_product: cosmetic_skincare_bottle / premium_serum_bottle
prompt_package_path: prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml
yaml_format_fixed: true
A5_authorization_created: false
provider_contact_allowed_now: false
image_generation_allowed_now: false
memory_write_allowed_now: false
production_candidate_002_allowed_now: false
```

## Purpose

v10.006 statically reviews the premium serum bottle prompt package draft and applies a small YAML readability / runner-shape fix.

This gate does not generate images, contact a provider, read `.env.local`, write memory, enter `production_candidate_002`, create A5 authorization, write `accepted_samples/`, create `runs/` outputs, or enter runtime.

## YAML Shape Review

```yaml
yaml_shape:
  prompt_field: independent_multiline_literal_block
  positive_prompt_field: independent_multiline_literal_block
  negative_prompt_field: independent_multiline_literal_block
  prompt_positive_sync: required_and_verified
  format_fix_applied: negative_prompt_split_into_readable_multiline_literal_block
```

The canonical runner-facing `prompt: |` remains an independent top-level field. The human-review alias `positive_prompt: |` remains synchronized with `prompt: |`. The `negative_prompt: |` field remains independent and was reformatted from one long comma-separated line into a more readable multi-line literal block.

## Static Review Result

```yaml
static_review_result: pass_for_static_review
prompt_package_ready_for_authorization_decision_gate: true
generation_authorized_now: false
```

The package is suitable to proceed to a future A5 authorization decision gate. It is not authorization to execute.

## Product Identity Review

The product identity is clear:

- `premium_serum_bottle`
- `cosmetic_skincare_bottle`
- single hero beauty product
- not a perfume bottle, medicine bottle, candle jar, beverage bottle, lotion pump bottle, or generic plastic container

## Structure Lock Review

The structure lock is clear:

- frosted translucent glass bottle;
- clean dropper cap;
- smooth symmetric cap collar;
- simple dropper top;
- pump dispenser drift forbidden;
- malformed, fused, broken, or crooked cap geometry forbidden.

## Material And Reflection Review

The material constraints are clear:

- frosted or softly translucent glass;
- subtle internal depth;
- soft edge highlights;
- controlled premium reflections;
- no cheap plastic material drift;
- no metallic bottle body drift;
- no noisy or impossible reflections.

## Label And Text Boundary Review

The label and text boundary is clear:

- blank or non-readable label zone;
- no readable brand logo;
- no fake text;
- no random text or letters;
- no broken label;
- no watermark.

## Composition And Scene Review

The composition is constrained:

- single bottle only;
- product dominant at roughly 60-75% visual importance;
- full bottle visible;
- straight-on or slight three-quarter front angle;
- subtle premium background;
- no people, hands, extra bottles, or overdecorated spa clutter.

## Boundary Confirmation

```yaml
A5_authorization_required_later: true
A5_authorization_created: false
provider_contact: false
image_generation: false
memory_write: false
production_candidate_002: false
accepted_samples_write: false
runs_output_creation: false
```

## Recommended Next

```yaml
recommended_next:
  phase: v10_007_third_product_A5_authorization_decision_gate
  auto_execution_allowed: false
  purpose: 人工决定是否为第三商品授权一次最小真实生成试跑。
final_state:
  next_phase_started: false
```
