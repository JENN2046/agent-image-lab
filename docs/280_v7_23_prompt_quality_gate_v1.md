# v7.23 Prompt Quality Gate v1

## 为什么需要

v1/v2 的失败教训：
- 场景权重过重，产品主体不够突出
- 伪文字/水印风险未覆盖
- 道具（网球）遮挡主体
- 背景材质漂移（球拍→炭火网格）

Prompt Quality Gate 确保进入 A5 前质量达标。

## 评分标准（100 分）

| 维度 | 满分 | 说明 |
|------|------|------|
| subject_clarity | 25 | 主体清晰度 |
| composition_control | 20 | 构图可控性 |
| material_lighting_control | 15 | 材质与光影 |
| failure_mode_coverage | 20 | 失败模式覆盖 |
| commercial_usability | 20 | 商业可用性 |

## 评级

| 分数 | 评级 | 含义 |
|------|------|------|
| 90-100 | production_ready | 可进入 A5 单次 + 批量 |
| 85-89 | a5_single_test_allowed | 可进入 A5 单次测试 |
| 70-84 | needs_prompt_revision | 需修改提示词 |
| 0-69 | rejected | 不允许进入 A5 |

## 硬性门槛

- 低于 85 分，不允许 A5 真实生成
- 低于 90 分，不允许批量生成
- 缺少 no text / no logo / no watermark，不允许进入真实生成
- 缺少 acceptance_gate，不允许进入真实生成
- 缺少 memory_write_allowed=false，不允许进入真实生成
- 缺少 daily_note_write_allowed=false，不允许进入真实生成

## 重要声明

- Prompt Quality Gate 不授权真实生成
- A5 仍然是单独门禁
- rejected prompt 不得进入 A5
- batch generation 需要独立授权
