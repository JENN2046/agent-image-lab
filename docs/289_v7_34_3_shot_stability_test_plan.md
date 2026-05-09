# v7.34 3-shot Stability Test Plan

## 目的

建立第一版 **3-shot Stability Test Plan / 三连发稳定性测试计划**，从"单张成功"验证到"多次稳定"。

## 第一条测试对象

选择 **法式夏日藤编包 v2 watermark-off prompt**（`product_still_life_french_summer_rattan_bucket_bag_bicycle_no_watermark_v2`）作为第一条 3-shot 测试对象。

### 选择原因

1. v7.31 已获得 `accepted_candidate`（`docs/286`）
2. v7.30 已修复 `watermark:false` API 参数（`docs/285`）
3. v7.32 已登记为 accepted sample（`accepted_samples/accepted_sample_registry.yaml`）
4. v7.33 已登记相关失败样本和修正路径（`failure_samples/failure_registry.yaml`）
5. 这条线适合验证"单张成功"是否能转为"多次稳定"

## 3-shot 协议

每一枪都必须是独立 A5 单发：

```yaml
execution_mode: sequential_independent_a5_single_runs
one_api_call_per_shot: true
one_image_per_shot: true
retry_allowed: false
batch_generation_authorized: false
```

### 三枪定义

| Shot | Phase | A5 Ref | 输出目录 |
|------|-------|--------|----------|
| Shot 1 | v7.35 | A5-20260509-NATIVE-RATTAN-V2-3SHOT-001 | runs/real_generation/v7_35/ |
| Shot 2 | v7.36 | A5-20260509-NATIVE-RATTAN-V2-3SHOT-002 | runs/real_generation/v7_36/ |
| Shot 3 | v7.37 | A5-20260509-NATIVE-RATTAN-V2-3SHOT-003 | runs/real_generation/v7_37/ |

### 每枪检查门

每张图必须独立进行 post-run review，检查项包括：

- prompt_subject_match: required_pass
- style_direction_match: required_pass
- product_fully_visible: required_pass
- no_watermark_or_generated_mark: required_pass
- clean_image_corners: required_pass
- commercial_usability: required_pass

完整 gate 见 `stability_tests/plans/french_summer_rattan_bag_v2_3shot_plan.yaml`。

### 硬阻断

- model_mismatch
- watermark_parameter_missing / watermark_parameter_not_false
- api_calls_more_than_one / images_created_more_than_one
- retry_performed
- visible_watermark_or_generated_mark
- readable_logo_or_brand_monogram
- product_missing_or_heavily_obstructed
- api_key_output

## 稳定性判定

| 结果 | 评级 | 下一步 |
|------|------|--------|
| 3/3 accepted | stable_candidate | 允许进入 Batch 4 dry-run 协议 |
| 2/3 accepted | conditional_stable_needs_review | prompt 修正或重测 3-shot |
| 0/3 或 1/3 accepted | unstable | 进入 failure analysis |

## 安全边界

- 本文档不授权真实生成
- 本文档不授权 batch generation
- memory / DailyNote 仍默认禁止
- 每枪需要独立 A5 授权包
- 不添加图片文件到 Git
- 不调用 API
- 不读取或输出 API key

## 下一步建议

**v7.35 French Summer Rattan Bag v2 3-shot Shot 1 A5**：
- 创建第一次独立 A5 授权包
- 执行一次 DoubaoGen 调用
- 产出一张图
- 独立 post-run review
