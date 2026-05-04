# 中文记忆写入规则

## 硬规则

1. 所有写入 VCP DailyNote 的 `Content` 正文必须使用中文。
2. 审批摘要、失败原因、评分说明、风格规则、插件表现评价必须中文。
3. 英文提示词可以保留，但必须附中文解释。
4. 插件名、模型名、项目名、schema 字段名可以保留英文。
5. Tag 以中文为主，可以保留少量稳定英文锚点，如 `PhotoStudioOS`。
6. 未转换为中文的记忆不得写入长期记忆。

## 合格示例

```yaml
chinese_diary_title: "Photo Studio OS 三仪表构图经验"
chinese_diary_content: "本次评审确认：右侧小仪表不能贴近 Risk Pulse 区域，否则会破坏三仪表横向平衡。英文提示词中的 balanced three gauges 表示三仪表需要保持均衡间距。"
preserved_original:
  prompt_en: "balanced three gauges"
```

## 不合格示例

```yaml
chinese_diary_title: "Gauge layout"
chinese_diary_content: "The right gauge is too close to the sidebar, fix spacing next time."
```

不合格原因：正文是英文，无法直接进入 DailyNote 长期记忆。

## 审批要求

涉及核心风格规则、长期审美偏好、插件表现结论时，即使正文已经中文，也必须经过 Review Console 或等价人工审批。
