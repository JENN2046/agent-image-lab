# v7.31 Native Doubao French Summer Rattan Bag v2 Watermark-Off Post-Run Review

## 目的

记录 watermark:false 后的首张 accepted_candidate。

## v7.30 修正

Native Doubao request payload 强制 `watermark: false`。
官方参数依据：watermark 为 boolean 参数，默认 true，false 表示不添加"AI生成"水印。

## 运行结果

| 字段 | 值 |
|------|-----|
| status | completed_generated |
| asset_status | accepted_candidate |
| model_matches | true |
| watermark_requested | false |
| watermark_parameter_sent | true |
| watermark_policy | disabled_by_request_payload |
| api_calls_observed | 1 |
| images_created | 1 |
| retry_performed | false |

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

1. watermark:false 生效，右下角"AI生成"水印消失
2. 图片四角干净
3. 藤编包主体完整可见
4. 书页不可读
5. 无人物/脸/手
6. 无可读 logo/品牌 monogram
7. 自行车后货架与后轮结构成立
8. 模型锁定成功
9. 单次调用单张生成

## 边界

- 本文档不授权再次生成
- 下一次生成、批量生成、写 memory/DailyNote 均需独立授权
