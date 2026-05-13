# v7.271 Prompt Revision Plan From First Real Output

```yaml
phase: v7.271_prompt_revision_plan_from_first_real_output
base_contract: AGENTS.md
mode: A4
intent: local_draft
risk_level: R1
source_phase: v7.270_human_review_of_real_outputs
reviewed_output: runs/real_generation/v7_269_matte_ceramic_mug_trial/native_doubao_1778681238211_0.jpg
source_asset_status: needs_revision
```

## Phase Purpose

This phase converts the first real output review into a static prompt revision
plan and a v2 prompt package draft. It does not authorize A5, provider contact,
plugin calls, retry, second generation, DailyNote write, VCP memory write,
accepted sample promotion, production candidate creation, or Batch 005.

## 1. First Real Output Issue Summary

The first real matte ceramic mug output is usable as evidence that the pipeline
can produce a recognizable product sample, but it is not a commercial candidate.
The review found eight revision drivers:

- 产品占比偏小。
- 上方留白过多。
- 光线偏平。
- 背景层次不足。
- 杯口边缘略粗糙。
- 把手连接处略糊。
- 左上角有微小彩色杂点。
- 商业主图高级感不足。

## 2. Prompt Revision Goals

- Make the mug occupy a stronger hero-product share of the frame.
- Reduce top negative space while keeping enough clean catalog breathing room.
- Add premium directional studio lighting with visible shape and shadow depth.
- Increase subtle background layering without adding clutter or secondary props.
- Improve rim smoothness, handle connection clarity, and ceramic edge fidelity.
- Preserve matte ceramic texture without turning the mug glossy or plastic.
- Add explicit artifact controls for specks, color noise, and random marks.
- Keep the output text-free, logo-free, person-free, and single-product only.

## 3. Positive Prompt Modification Suggestions

The v2 positive prompt should replace soft general phrases such as "quiet
negative space" with measurable composition intent:

- "large centered hero mug occupying about 70 percent of frame height".
- "reduced top margin, balanced margins on all sides".
- "premium directional key light from upper left with soft fill".
- "subtle layered warm-gray studio backdrop with gentle depth gradient".
- "crisp clean rim, clean handle joint, precise ceramic edge definition".
- "matte warm-white ceramic, low-sheen surface, fine tactile texture".
- "catalog-ready premium ecommerce main image".

## 4. Negative Constraints Modification Suggestions

The v2 negative prompt should explicitly block the defects observed in v7.270:

- excessive top whitespace
- tiny colored specks
- color noise
- flat lighting
- weak background separation
- rough rim edge
- blurry handle joint
- small product in frame

These should be added while preserving the v1 prohibitions against people,
hands, faces, readable text, logos, watermarks, extra products, duplicate mugs,
warped geometry, clutter, cyberpunk/gaming/cartoon style, and low resolution.

## 5. Revision Items

### Composition

Use a tighter product hero crop. The mug should be full product visible, but the
frame should prioritize product presence over empty top space. The target is a
large centered hero mug occupying roughly 65-75 percent of the image height.

### Lighting

Move from purely soft diffuse lighting to premium directional studio lighting:
soft upper-left key, gentle fill, visible form modeling on the ceramic body, and
a controlled contact shadow that grounds the mug without making the scene harsh.

### Background

Replace the flat neutral tabletop feel with a subtle layered warm-gray studio
set: clean surface, gentle backdrop gradient, mild depth separation, and no
props or patterns that compete with the mug.

### Material Texture

Keep the ceramic matte and warm-white. Ask for precise rim smoothness, clean
handle attachment, low-sheen surface, fine tactile ceramic texture, and no
plastic CGI gloss.

## 6. v2 Prompt Package Field Change Plan

```yaml
new_file: prompts/image_generation/product_still_life_matte_ceramic_mug_v2.yaml
version: v2
source_prompt_package: prompts/image_generation/product_still_life_matte_ceramic_mug_v1.yaml
source_review_record: reviews/v7_270_matte_ceramic_mug_human_review.md
status_cn: 静态修订草案；不是执行请求
new_fields:
  - revision_source
  - revision_goals_cn
  - composition_controls
  - lighting_controls
  - background_controls
  - material_texture_controls
  - defect_controls
changed_fields:
  prompt: tighten composition, strengthen lighting, improve background depth and ceramic edge fidelity
  negative_prompt: add v7.270 defect-specific constraints
  acceptance_gate: add product scale, top margin, lighting depth, background depth, rim/handle clarity, no speck checks
unchanged_safety_fields:
  memory_write_allowed: false
  daily_note_write_allowed: false
  plugin_call_allowed_by_this_file: false
  image_generation_allowed_by_this_file: false
```

## 7. Authorization Preconditions For Next Trial

Before any second minimal real generation trial, v7.272 must statically review
the v2 prompt package and the human owner must separately authorize the exact
generation action. A valid next authorization must include:

- approved prompt package path: `prompts/image_generation/product_still_life_matte_ceramic_mug_v2.yaml`.
- product: `matte_ceramic_mug`.
- provider/plugin/model path explicitly selected.
- provider call max and generation attempt max explicitly set.
- output image max explicitly set.
- output directory explicitly set.
- auto retry explicitly false unless separately approved.
- no DailyNote write.
- no VCP memory write.
- no accepted sample promotion during generation.
- stop after generation for human review.

## 8. Human Review Acceptance Criteria Update Suggestions

For the next human review, acceptance should require:

- Mug occupies roughly 65-75 percent of frame height without cropped product.
- Top whitespace is controlled and does not dominate the image.
- Lighting creates premium shape and depth, not flat catalog gray.
- Background has subtle studio depth but remains clean and distraction-free.
- Rim edge is smooth and credible at product-detail level.
- Handle joint is sharp and anatomically plausible.
- No colored specks, random marks, logo, watermark, readable text, person, hand,
  duplicate mug, or extra product.
- Commercial readiness remains false unless the image feels premium enough for a
  product main image.

## Boundary Confirmation

```yaml
A5_execution: false
provider_contact: false
plugin_call: false
image_generation: false
retry: false
second_generation_started: false
memory_write: false
DailyNote_write: false
VCP_memory_write: false
accepted_samples_written: false
production_candidate_002: false
Batch_005: false
image_added_to_git: false
```

## Recommended Next

```yaml
phase: v7.272_prompt_v2_static_review_and_second_trial_authorization_gate
purpose: 静态审查 prompt v2，并由人决定是否授权第二次最小生成试跑
auto_execution_allowed: false
```
