# v7.35 Shot 1 Post-Run Review — French Summer Rattan Bag v2 3-shot Stability Test

## 运行结果

| 字段 | 值 |
|------|-----|
| shot_id | french_summer_rattan_bag_v2_shot_1 |
| status | completed_generated |
| asset_status | accepted_candidate |
| a5_activation_ref | A5-20260509-NATIVE-RATTAN-V2-3SHOT-001 |
| model_requested | doubao-seedream-5-0-260128 |
| model_reported | doubao-seedream-5-0-260128 |
| model_matches | true |
| watermark_requested | false |
| watermark_parameter_sent | true |
| watermark_policy | disabled_by_request_payload |
| api_calls_observed | 1 |
| images_created | 1 |
| retry_performed | false |
| image_path | runs/real_generation/v7_35_french_summer_rattan_bag_v2_3shot_shot_1/native_doubao_1778334266796_0.jpg |

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
| memory_suitability | false |

## 成功项

1. 模型锁定 doubao-seedream-5-0-260128，model_matches 确认
2. watermark:false 生效，无水印
3. 藤编包主体完整、纹理清晰
4. 自行车后货架与后轮结构成立
5. 书页不可读
6. 无人物/脸/手
7. 无可读 logo/品牌 monogram
8. 单次 API 调用单张生成，无重试
9. API key 未输出

## 已知小问题（不构成拒收）

1. 背景偏棚拍，南法街头空气感不强
2. 自行车结构略简化，但无严重变形

## 稳定性评分贡献

Shot 1/3：accepted_candidate ✓

按 3-shot 协议，等三枪完成后统一评分：
- 3/3 accepted → stable_candidate
- 2/3 accepted → conditional_stable_needs_review
- 0-1/3 accepted → unstable

## 边界

- 本文档不授权再次生成或批量生成
- 下一次生成（Shot 2）需独立 A5 授权
- memory/DailyNote 写操作需独立 A5 授权
- push/tag/release 不在本次授权范围内
