# v7.30 Native Doubao Watermark Parameter Enforcement

## 目的

将水印问题从 prompt 层转移到 API 参数层解决。

## 背景

- v7.26 / v7.29 均出现右下角 AI 生成水印
- v7.27 排除本端 overlay 叠加（runner/adapter/plugin 无叠水印代码）
- v7.28 prompt 控制不足以解决 provider-side watermark
- 官方文档显示 `watermark` 参数默认 true，false 为不添加水印

## 修正

- NativeDoubaoImage 所有请求显式发送 `watermark: false`
- 缺失 `watermark` 参数时返回 BLOCKED_WATERMARK_PARAMETER_MISSING
- watermark 不是 boolean false 时返回 BLOCKED_WATERMARK_PARAMETER_INVALID
- 每次生成记录 `watermark_requested` 和 `watermark_parameter_sent`

## 边界

- `watermark: false` 不等于保证输出绝对无水印，仍需 Asset Acceptance Gate 视觉验收
- 本文档不授权真实生成
- 下一次真实生成仍需独立 A5
