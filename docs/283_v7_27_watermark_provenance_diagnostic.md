# v7.27 Watermark Provenance Diagnostic

## 目的

诊断 v7.26 French Summer Rattan Bucket Bag 生成结果中出现的半透明水印来源。

## v7.26 运行结果

```text
Status: COMPLETED_GENERATED
NativeDoubaoImage direct_api 路线跑通
model lock 成功（requested == reported == doubao-seedream-5-0-260128）
API calls observed: 1
images_created: 1
retry_performed: false
```

## 视觉结果

- 法式夏日生活方式方向成立
- 藤编包主体清楚
- 自行车后货架、玫瑰、葡萄、书、橙子、钥匙进入画面

## 偏差项

1. watermark_or_generated_mark_present — 右下角明显半透明"AI生成"水印痕迹
2. product_partially_obstructed_by_leaf — 绿叶部分遮挡包包右侧
3. readable_page_texture_risk — 书页有轻微可读文字纹理风险

## 水印来源诊断

| 来源 | 可能性 | 依据 |
|------|--------|------|
| prompt_watermark_failure | possible | prompt 中未明确禁止 provider 侧水印 |
| provider_watermark_failure | possible | 同一 provider 同一模型，v7.24 无明显水印，v7.26 出现 |
| downloader_or_runner_overlay_failure | unlikely | runner/adapter/plugin 均无 overlay/draw/canvas/text 代码 |
| unknown_watermark_source | true | 需后续对照实验确认 |

当前判断：`provider_side_watermark_risk`，但 v7.24 accepted image 无明显水印，不能直接断定 provider always forces watermark。需后续 prompt 修正后对照实验。

## 边界

- 本文档不授权再次生成
- 下一次真实生成必须独立 A5
- memory / DailyNote 仍默认禁止
