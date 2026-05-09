# v7.42 v3 Dry-run Shot 2 Post-Run Review — French Summer Rattan Bag v3 Support Logic

## 运行结果

| 字段 | 值 |
|------|-----|
| shot_id | french_summer_rattan_bag_v3_dry_run_shot_2 |
| phase | v7_42 |
| status | completed_generated |
| asset_status | accepted_candidate |
| a5_activation_ref | A5-20260509-NATIVE-RATTAN-V3-DRYRUN-002 |
| prompt_package_used | product_still_life_french_summer_rattan_bucket_bag_bicycle_no_watermark_v3 |
| model_requested | doubao-seedream-5-0-260128 |
| model_reported | doubao-seedream-5-0-260128 |
| model_matches | true |
| watermark_requested | false |
| watermark_parameter_sent | true |
| watermark_policy | disabled_by_request_payload |
| api_calls_observed | 1 |
| images_created | 1 |
| retry_performed | false |
| v3_support_logic_result | pass |
| image_path | runs/real_generation/v7_42_french_summer_rattan_bag_v3_dry_run_shot_2/native_doubao_1778339431356_0.jpg |

## Asset Acceptance Gate

| 检查项 | 结果 |
|--------|------|
| prompt_subject_match | pass |
| style_direction_match | pass |
| product_fully_visible | pass |
| product_unobstructed | pass |
| rattan_texture_visible | pass |
| bicycle_rear_rack_visible | pass |
| partial_rear_wheel_visible | pass |
| no_leaf_obstruction | pass |
| no_readable_book_text | pass |
| no_person_or_face_unless_expected | pass |
| no_readable_text_or_logo_unless_expected | pass |
| no_watermark_or_generated_mark | pass |
| clean_image_corners | pass |
| commercial_usability | pass |

## V3 Support-Logic Gates

| 检查项 | 结果 |
|--------|------|
| lower_left_props_physically_supported | pass |
| orange_has_visible_support_surface | pass |
| keys_have_clear_anchor_point | pass |
| red_knit_has_contact_shadow | pass |
| no_floating_or_edge_stuck_props | pass |
| lower_left_prop_cluster_not_overpowering | pass |
| support_logic_believable_under_real_gravity | pass |

## v3 稳定性评估

**支撑逻辑修复在 Shot 2 中持续有效。** Shot 2 的所有 v3 support-logic gates 均为 clean pass（无 minor warning），比 Shot 1 的 `pass_with_minor_warning` 更进一步改善。

v3 修复效果跨枪稳定：
- Shot 1：accepted_candidate, v3 support-logic passed with minor warning
- Shot 2：accepted_candidate, v3 support-logic clean pass
- 左下角红色织物、橙子、钥匙均有明确物理支撑和接触阴影
- 无悬浮/贴边/人工漂浮感

## 已知小问题（不构成拒收）

1. 红色针织物面积仍较大，但已有物理整合（red_knit_area_still_large_but_now_physically_integrated）
2. 包身侧面抽绳略多（bag_drawstring_side_straps_slightly_busy）
3. 右侧书和葡萄区域略拥挤，但未遮挡主体（right_book_and_grapes_area_slightly_crowded_but_not_blocking_product）

## 边界

- retry_required: false
- manual_review_required: false
- 不授权再次生成
- 不授权批量生成
- 不授权写 memory / DailyNote
- 不授权 push / tag / release
- Shot 3 需独立 A5 授权
