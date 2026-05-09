# v7.38 Prompt Repair Note — French Summer Rattan Bag v2 Support Logic

## 1. Repair Target

- **prompt package:** `prompts/image_generation/product_still_life_french_summer_rattan_bucket_bag_bicycle_no_watermark_v2.yaml`
- **source stability test:** `french_summer_rattan_bag_v2_3shot`
- **final result:** `stable_candidate_needs_manual_review`
- **repair focus:** lower-left prop physical support logic

## 2. Evidence From 3-shot Test

| Shot | Phase | Status |
|------|-------|--------|
| Shot 1 | v7.35 | accepted_candidate |
| Shot 2 | v7.36 | accepted_candidate |
| Shot 3 | v7.37 | accepted_with_support_logic_warning |
| **final** | — | **stable_candidate_needs_manual_review** |

Shot 3 的主体（藤编水桶包、自行车后架、后轮）全部通过，无水印/无人物/无可读文字等核心 gate 均 pass，但左下角红色围巾、橙子、钥匙组合的支撑逻辑不清，降低了场景真实感。

## 3. Root Cause

当前 prompt 对左下角道具的"可出现性"描述足够，但对"物理支撑关系"约束不足。模型容易把 red knit / orange / keys 当作装饰贴片或画面填充，而不是有接触面、有挂点、有重力方向的真实物体。

具体表现为：
- prompt 说"自然下垂在货架边缘"、"自然垂落"，但未要求钥匙必须有明确挂点
- prompt 说"可以有一颗橙子"，但未要求橙子必须在可见承托面上
- prompt 未要求左下角道具与承托面之间产生接触阴影
- prompt 未禁止道具悬浮或贴边

## 4. Prompt Repair Direction

### 4.1 Replace vague lower-left prop clause

当前写法（概略）：
> 画面左下角可以有一颗橙子和一小块红色针织物或编织布料，红色织物自然下垂在货架边缘。左下角可以有一串金属钥匙自然垂落，作为生活化细节，但必须保持低调，不能抢走主视觉。

建议改写为：

> 画面左下角可以有一小块红色针织物或编织布料，但它必须清楚地搭在自行车后货架、牛皮纸包装物或可见金属支架上，并与承托面产生真实接触阴影。可以有一颗橙子，但橙子必须稳定地放在牛皮纸、后货架或织物形成的明确承托面上，不能悬空，不能贴在画面边缘。可以有一串金属钥匙，但钥匙必须有清晰可信的挂点，例如挂在货架边缘、皮革抽绳附近或织物折边上，并自然下垂，不能无支撑漂浮。左下角道具必须低调、少量、物理关系清晰，不能形成抢主体的杂乱道具堆。

### 4.2 Add physical support constraints

在每个受影响的道具描述后追加约束：
- every small prop must visibly rest on or hang from a plausible support surface
- clear contact shadows under orange and fabric
- visible anchor point for keys
- no floating props
- no edge-stuck props
- no ambiguous support logic
- props must follow realistic gravity

### 4.3 Add negative prompt terms

建议向 `negative_prompt` 追加以下关键词：

```
悬空道具, 无支撑的橙子, 无挂点钥匙, 道具贴片感,
物理支撑不清, 道具漂浮,
floating props, unsupported orange,
keys without anchor point, unclear physical support,
edge-stuck props, artificial prop cluster
```

### 4.4 Add acceptance gate items

建议在 `acceptance_gate` 中新增或在 review 中人工检查以下条目：

```yaml
lower_left_props_physically_supported: true
orange_has_visible_support_surface: true
keys_have_clear_anchor_point: true
red_knit_has_contact_shadow: true
no_floating_or_edge_stuck_props: true
```

## 5. Non-goals

- 不改变主产品：米黄色藤编水桶包
- 不改变自行车后货架语境
- 不改变 watermark:false 约束
- 不引入人物、手、脸
- 不增加复杂街景
- 不扩大道具数量
- 不进入新一轮生成
- 不授权 API call

## 6. Recommended Next Step

建议下一步为 v7.39 prompt package v3 draft 或 v7.39 repair patch——基于本 repair note 创建一个 `_v3` prompt package，修复左下角道具支撑逻辑，保持其余核心描述不变。

v7.39 需要独立授权后才能进入 prompt 修改和重新生成。
