# VCP 插件能力矩阵

> 当前仅为占位矩阵，禁止凭空填写真实插件能力。真实能力必须根据本地 VCPToolBox 插件 manifest、人工测试和审计结果补充。

## 使用边界

- 只用于 dry-run 选择说明。
- 不代表真实插件可用。
- 不代表真实插件质量。
- 不代表插件已经通过安全审计。
- 不允许基于猜测填写真实插件名称或能力。

## 矩阵字段

| plugin_name | task_type | input_mode | output_mode | best_for_cn | not_suitable_for_cn | approval_required | risk_level | current_status | notes_cn |
|---|---|---|---|---|---|---|---|---|---|
| 待实测插件占位 | photo_studio_os_review | unknown | unknown | 待读取 manifest 后确认 | 待读取 manifest 后确认 | true | medium | 待实测 | 占位行，不代表真实插件能力 |
| 待实测插件占位 | image_refinement | unknown | unknown | 待读取 manifest 后确认 | 待读取 manifest 后确认 | true | medium | 待实测 | 占位行，不代表真实插件能力 |
| 待实测插件占位 | product_photography | unknown | unknown | 待读取 manifest 后确认 | 待读取 manifest 后确认 | true | high | 待实测 | 涉及真实商品或客户素材时必须人工审批 |

## 更新规则

补充真实能力前必须完成：

1. 人工确认读取的是真实 VCPToolBox 插件 manifest。
2. 不暴露 manifest 中的密钥或私密配置。
3. 运行 dry-run，不调用真实生图 API。
4. 记录测试日期、测试者和审计结论。
5. 经 Gatekeeper 和人工审批后再更新矩阵。

## 禁止

- 不要写真实 API key、token、cookie、密码。
- 不要写私密路径。
- 不要写客户信息。
- 不要把偶发失败写成长期插件结论。
- 不要把待实测插件标记为可用。
