# v7.51 Production Candidate Plan — French Summer Rattan Bag v3 Candidate 001

## 1. Purpose

本文件规划第一张真实生产候选图。
本文件不授权生成。
本文件不授权 API call。
本文件不授权 VCP call。
本文件不授权 memory / DailyNote 写入。

## 2. Candidate Identity

```yaml
production_candidate_id: french_summer_rattan_bag_v3_production_candidate_001
phase: v7_51
planned_execution_phase: v7_52
product_line: French Summer Rattan Bag
prompt_package: prompts/image_generation/product_still_life_french_summer_rattan_bucket_bag_bicycle_no_watermark_v3.yaml
prompt_package_id: product_still_life_french_summer_rattan_bucket_bag_bicycle_no_watermark_v3
model: doubao-seedream-5-0-260128
production_readiness_source: candidate_ready_with_manual_visual_review
```

## 3. Execution Boundary

```yaml
execution_authorized_by_this_record: false
image_generation_authorized: false
api_call_authorized: false
vcp_call_authorized: false
memory_write_authorized: false
daily_note_write_authorized: false
requires_independent_a5_for_generation: true
```

## 4. Planned v7.52 Generation Rules

```yaml
planned_generation:
  phase: v7_52
  a5_required: true
  api_calls_allowed: 1
  images_allowed: 1
  retry_allowed: false
  batch_generation_allowed: false
  watermark_requested: false
  watermark_parameter_must_be_sent: true
  output_directory: runs/real_generation/v7_52_french_summer_rattan_bag_v3_production_candidate_001/
```

## 5. Visual Goal

- 不是继续稳定性测试
- 是真实生产候选图
- 保持 French summer / rattan bag / bicycle rear rack / lifestyle still-life 方向
- 使用 v3 prompt package，不修改 prompt
- 重点继续人工检查左下角道具支撑逻辑，但不要为了测试而重复生成

## 6. Human Review Requirements

引用 `docs/v7_47_french_summer_rattan_bag_v3_human_review_checklist.md`。

### Core Gates

- prompt_subject_match
- product_fully_visible
- product_unobstructed
- rattan_texture_visible
- bicycle_rear_rack_visible
- partial_rear_wheel_visible
- no_readable_book_text
- no_watermark_or_generated_mark
- clean_image_corners
- commercial_usability

### V3 Support-Logic Gates

- lower_left_props_physically_supported
- orange_has_visible_support_surface
- keys_have_clear_anchor_point
- red_knit_has_contact_shadow
- no_floating_or_edge_stuck_props
- support_logic_believable_under_real_gravity

## 7. Possible Outcomes

```yaml
allowed_asset_status:
  - accepted_candidate
  - accepted_with_minor_warning
  - rejected
  - needs_retry_new_a5_required
```

## 8. VCP / Memory Boundary

- 本 production candidate plan 不授权 VCP memory
- 只有 v7.52 真实生成 + v7.53 人工审图通过后，才允许 v7.54 memory_delta candidate draft
- 不能从 stable_candidate prompt 直接写 VCP memory
- 不能把未审图生产图写入 memory
- 不能把 rejected asset 写成成功记忆

## 9. Stop Line

- 不进入 v7.52
- 不生成图片
- 不调用图片 API
- 不调用 VCP
- 不写 memory / DailyNote
- 不 push
- 本文件只是一张发车单，不是发车
