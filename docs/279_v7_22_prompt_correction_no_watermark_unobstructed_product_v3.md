# v7.22 Prompt Correction — No Watermark / Unobstructed Product Hero v3

## 背景

v7.21 原生豆包第一发已跑通：

- native direct_api 链路跑通 ✅
- model lock 成功（requested == reported == doubao-seedream-5-0-260128）✅
- 单次 API 调用成功 ✅

v7.21 偏差项：

1. watermark_or_generation_mark_risk — 右下角半透明水印/中文痕迹
2. foreground_tennis_balls_too_large — 前景网球过大
3. background_material_direction_drift — 背景偏离网球拍/水泥

## v3 Prompt 修正策略

- wallet hero subject — 钱包为清晰英雄主体
- unobstructed product — 产品无遮挡
- no watermark / no generated mark — 无水印/生成标记
- no readable text / no logo — 无可读文字/品牌
- real tennis racket strings — 真实网球拍线
- tennis balls as small supporting props only — 网球仅作小型辅助道具

## 边界

- 本文档不授权真实生成
- 下一次真实生成必须重新 A5
- memory / DailyNote 仍默认禁止
