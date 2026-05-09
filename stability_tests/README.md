# Stability Tests — Agent Image Lab 3-shot Stability Test

本目录记录 Agent Image Lab 的 3-shot Stability Test Plan / 三连发稳定性测试计划。

## 目的

从"单张成功"验证到"多次稳定"——判断同一个 prompt 在相同条件下能否稳定产出可接受的资产。

## 方法

- 每轮 3 次独立 A5 单发（一次 API call、一张图、禁止 retry）
- 每枪独立 post-run review
- 根据 3 枪结果判定稳定性等级

## 稳定性判定

| 结果 | 评级 | 下一步 |
|------|------|--------|
| 3/3 accepted | stable_candidate | 允许进入 Batch 4 dry-run 协议 |
| 2/3 accepted | conditional_stable_needs_review | prompt 修正或重测 3-shot |
| 0/3 或 1/3 accepted | unstable | 进入 failure analysis |

## 文件结构

```text
stability_tests/
├── README.md
├── three_shot_stability_plan_registry.yaml    # 全局注册表
├── plans/
│   └── french_summer_rattan_bag_v2_3shot_plan.yaml  # 第一条 3-shot plan
└── results/         # 后续执行结果（计划中）
```

## 禁止

- 不批量生成（batch_generation_authorized: false）
- 每枪独立 A5 授权
- 不提交图片文件
- 不写 DailyNote / VCP memory（除非后续明确授权）
