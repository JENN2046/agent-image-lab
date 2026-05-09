# v7.11 First Generation Prompt Correction

## 目的

记录第一次真实生成偏差，并创建更强主体约束的 v2 prompt package。

## v1 偏差回顾

| 问题 | 说明 |
|------|------|
| 主体不明确 | 钱包/皮具未成为清晰主体 |
| 场景过度 | 网球场+球拍+球占据画面，产品不突出 |
| 商业属性不足 | 更像环境氛围图，非产品主图 |
| 模型不匹配 | 实际使用 doubao-seedream-3-0-t2i-250415，非 5.0 |

## v2 修正要点

```text
- beige leather wallet 必须占画面的 45%-60%，为绝对主体
- 网球拍和网球为辅助道具，不竞争主体
- 特写俯拍构图，无宽广网球场场景
- 产品坐在球拍线上，球拍只显示边缘
- 混凝土纹理仅边缘可见
- 商拍摄影灯光，高级编辑目录风格
```

## Model Lock 只读检查

结果见 `scripts` 本次检查记录。后续第二次 A5 前必须确认 model lock 已启用。

## 推荐第二次 A5 prompt_package_ref

```text
prompts/image_generation/product_still_life_outdoor_tennis_wallet_hero_v2.yaml
```
