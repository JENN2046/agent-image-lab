# v7.37 Shot 3 Post-Run Review — French Summer Rattan Bag v2 3-shot Stability Test

## 运行结果

| 字段 | 值 |
|------|-----|
| shot_id | french_summer_rattan_bag_v2_shot_3 |
| status | completed_generated |
| asset_status | accepted_with_support_logic_warning |
| a5_activation_ref | A5-20260509-NATIVE-RATTAN-V2-3SHOT-003 |
| model_requested | doubao-seedream-5-0-260128 |
| model_reported | doubao-seedream-5-0-260128 |
| model_matches | true |
| watermark_requested | false |
| watermark_parameter_sent | true |
| watermark_policy | disabled_by_request_payload |
| api_calls_observed | 1 |
| images_created | 1 |
| retry_performed | false |
| image_path | runs/real_generation/v7_37_french_summer_rattan_bag_v2_3shot_shot_3/native_doubao_1778336695171_0.jpg |

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
| commercial_usability | pass_with_warning |

## 已知问题

1. 左下角红色围巾、橙子、钥匙组合的支撑逻辑不清晰（lower_left_props_red_knit_orange_and_keys_have_unclear_physical_support_logic）
2. 橙子和钥匙略悬浮/人工摆放感（orange_and_keys_feel_slightly_suspended_or_artificially_staged）
3. 左下角次要道具集群分散主体注意力，降低场景可信度（lower_left_secondary_prop_cluster_distracts_from_product_and_reduces_scene_believability）
4. 右侧自行车坐垫边缘轻微侵入画面（right_bicycle_saddle_edge_intrusion_minor）
5. 花束塑料包装纸略偏棚拍感（flower_plastic_wrap_feels_somewhat_studio_styled）

## 成功项

1. 模型锁定 doubao-seedream-5-0-260128，model_matches 确认
2. watermark:false 生效，无水印
3. 藤编包主体完整、纹理清晰
4. 自行车后货架与后轮结构成立
5. 书页不可读
6. 无人物/脸/手
7. 无可读 logo/品牌 monogram
8. 图片四角干净
9. 单次 API 调用单张生成，无重试
10. API key 未输出

## 最终 3-shot 稳定性结论

| Shot | asset_status |
|------|-------------|
| Shot 1 (v7.35) | accepted_candidate |
| Shot 2 (v7.36) | accepted_candidate |
| Shot 3 (v7.37) | accepted_with_support_logic_warning |

**final_stability_status: stable_candidate_needs_manual_review**

判定依据：
- 2/3 clean accepted_candidate + 1/3 accepted_with_support_logic_warning
- 核心 gate 均通过：主体完整、无水印、无人物、无可读文字、产品无遮挡、藤编纹理清晰
- Shot 3 左下角道具支撑逻辑问题不影响产品主体独立性，但降低了整体场景可信度
- 不满足 stable_candidate 的 3/3 无争议标准，但明显优于 conditional_stable_needs_review（2/3 clean）
- 建议人工确认是否将左下角道具问题纳入下一轮 prompt 修正，或直接进入批量干跑协议

## 边界

- retry_required: false
- manual_review_required: true
- 不授权再次生成
- 不授权批量生成
- 不授权写 memory / DailyNote
- 不授权 push / tag / release
