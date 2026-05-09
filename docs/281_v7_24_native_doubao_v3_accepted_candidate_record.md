# v7.24 Native Doubao v3 Accepted Candidate Record

## 里程碑

```text
Native Doubao Image Plugin 首张 accepted_candidate 记录
Prompt Quality Gate v1 首次验证通过
v3 prompt 修正方向（无文字 / 无遮挡 / 真实材质）首次验证有效
```

## 运行结果

| 字段 | 值 |
|------|-----|
| Status | COMPLETED_GENERATED |
| asset_status | accepted_candidate |
| Plugin | NativeDoubaoImage |
| Provider | direct_api |
| Model requested | doubao-seedream-5-0-260128 |
| Model reported | doubao-seedream-5-0-260128 |
| Model matches | true |
| API calls | 1 |
| Images created | 1 |
| Retry | no |

## Asset Acceptance Gate

| 检查项 | 结果 |
|--------|------|
| prompt_subject_match | pass |
| style_direction_match | pass |
| product_fully_visible | pass |
| product_unobstructed | pass |
| no_person_or_face_unless_expected | pass |
| no_readable_text_or_logo_unless_expected | pass |
| no_watermark_or_generated_mark | pass |
| commercial_usability | pass |
| memory_suitability | false |

## 验收理由

1. 钱包是明确主体，完整可见，没有被球遮挡
2. 没有可读文字、logo、水印或生成标记
3. 网球只作为道具，位置比上一张干净很多
4. 球拍线材质回到真实网球拍方向，不再像烧烤网
5. 光线、皮革质感、构图都已经接近商业静物图

## 轻微可优化点（非拒收理由）

1. 钱包形态更像卡包/短夹，不是复杂 flap wallet
2. 画面稍偏硬光和粗粝水泥质感，精致感还能提升
3. 网球在画面边缘略大，但不再遮挡主体

## 边界确认

| 边界 | 状态 |
|------|------|
| DailyNote write | no ✅ |
| VCP memory write | no ✅ |
| push/tag/release | no ✅ |
| second API call | no ✅ |
| API key printed | no ✅ |

## 后续

- 这张图作为 Native Doubao v3 prompt 成功样本
- Prompt Quality Gate 有效证据
- 后续 3-shot stability test 的基准样本
- 不得自动写 memory / DailyNote
