# v7.28 French Summer Watermark Control Prompt Correction

## 目的

修复 v7.26 法式夏日藤编包第一发的视觉偏差。

## v7.26 成功项

- 新题材方向成立
- 法式夏日生活方式气质成立
- 藤编包主体明确
- 模型锁定成功
- direct_api 单次生成成功

## v7.26 偏差项

1. watermark_or_generated_mark_present
2. product_partially_obstructed_by_leaf
3. readable_page_texture_risk

## v7.27 诊断结论

- runner / adapter / plugin 本端无 overlay 代码
- 当前判断为 provider_side_watermark_risk / unknown_watermark_source

## v2 Prompt 修正策略

- clean image corners — 图片四角和边缘必须干净
- no lower-right watermark — 右下角不能出现文字/标识
- no generated mark / no AI generated text
- leaf must not cover bag — 叶子不能遮挡包身正面
- blank or unreadable book pages — 书页必须空白/模糊
- fewer obstruction risks

## Prompt Quality Gate 评分

95/100 — production_ready

## 边界

- 本文档不授权真实生成
- 下一次真实生成必须独立 A5
- memory / DailyNote 仍默认禁止
