# v7.43 v3 Dry-run Shot 3 Post-Run Review — French Summer Rattan Bag v3 Final

## 运行结果

| 字段 | 值 |
|------|-----|
| shot_id | french_summer_rattan_bag_v3_dry_run_shot_3 |
| phase | v7_43 |
| status | completed_generated |
| asset_status | accepted_candidate |
| a5_activation_ref | A5-20260509-NATIVE-RATTAN-V3-DRYRUN-003 |
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
| image_path | runs/real_generation/v7_43_french_summer_rattan_bag_v3_dry_run_shot_3/native_doubao_1778339914744_0.jpg |

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

## v3 修复最终评估

**结论：v3 左下角道具支撑逻辑修复通过全部 3 枪稳定性测试。**

跨枪稳定性记录：
- Shot 1: accepted_candidate, v3 support-logic pass（1 项 minor warning）
- Shot 2: accepted_candidate, v3 support-logic clean pass（7/7 clean）
- Shot 3: accepted_candidate, v3 support-logic clean pass（7/7 clean）

v3 修复对比 v2：
- v2 最终结论：stable_candidate_needs_manual_review（Shot 3 因支撑逻辑问题被降级）
- v3 最终结论：stable_candidate（3/3 accepted_candidate，支撑逻辑全部通过）

## 已知小问题（不构成拒收）

1. 红色针织物面积仍较明显，但已有物理支撑（red_knit_area_remains_visually_strong_but_physically_supported）
2. 右侧自行车坐垫边缘轻微侵入（right_bicycle_saddle_edge_intrusion_minor）
3. 玫瑰塑料包装纸仍略偏棚拍感（rose_plastic_wrap_still_slightly_studio_styled）

## 最终稳定性结论

| Shot | Phase | Result |
|------|-------|--------|
| Shot 1 | v7.41 | accepted_candidate |
| Shot 2 | v7.42 | accepted_candidate |
| Shot 3 | v7.43 | accepted_candidate |
| **final** | — | **stable_candidate** |

- acceptance_count: 3/3
- v3_support_logic_result: stable_pass
- retry_required: false
- manual_review_required: false
- next_allowed_phase: batch_dry_run_protocol

## 边界

- 不授权再次生成
- 不授权批量生成
- 不授权写 memory / DailyNote
- 不授权 push / tag / release
