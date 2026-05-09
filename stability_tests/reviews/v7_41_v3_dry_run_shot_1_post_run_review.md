# v7.41 v3 Dry-run Shot 1 Post-Run Review — French Summer Rattan Bag v3 Support Logic

## 运行结果

| 字段 | 值 |
|------|-----|
| shot_id | french_summer_rattan_bag_v3_dry_run_shot_1 |
| phase | v7_41 |
| status | completed_generated |
| asset_status | accepted_candidate |
| a5_activation_ref | A5-20260509-NATIVE-RATTAN-V3-DRYRUN-001 |
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
| image_path | runs/real_generation/v7_41_french_summer_rattan_bag_v3_dry_run_shot_1/native_doubao_1778338702762_0.jpg |

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
| lower_left_prop_cluster_not_overpowering | pass_with_minor_warning |
| support_logic_believable_under_real_gravity | pass |

## v3 修复效果评估

**结论：v3 左下角道具支撑逻辑修复有效。**

与 v2 Shot 3 的对比：
- v2 Shot 3：左下角红色织物、橙子、钥匙存在明显支撑逻辑不清问题（悬浮/贴片感），导致 `accepted_with_support_logic_warning`
- v3 Shot 1：左下角道具均有明确承托面、挂点、接触阴影，物理支撑逻辑可信，达到 `accepted_candidate`

v3 新增的 negative_prompt 关键词（悬浮道具、无支撑的橙子、无挂点钥匙、道具贴片感等）和 prompt 段落改写共同起了作用。

## 已知小问题（不构成拒收）

1. 红色针织物面积仍然略大，但已有物理支撑（red_knit_area_still_visually_large_but_physically_supported）
2. 包身绣花纹理略偏装饰化（bag_floral_lace_texture_slightly_more_decorative_than_plain_rattan_reference）
3. 右侧后部光线轻微侵入边缘（right_rear_light_edge_intrusion_minor）

## 边界

- retry_required: false
- manual_review_required: false
- 不授权再次生成
- 不授权批量生成
- 不授权写 memory / DailyNote
- 不授权 push / tag / release
- Shot 2 和 Shot 3 需独立 A5 授权
