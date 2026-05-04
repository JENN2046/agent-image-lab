# VCP 插件能力矩阵

> 当前仅为占位矩阵，禁止凭空填写真实插件能力。真实能力必须根据本地 VCPToolBox 插件 manifest、人工测试和审计结果补充。

## 使用边界

- 只用于 dry-run 选择说明。
- 不代表真实插件可用。
- 不代表真实插件质量。
- 不代表插件已经通过安全审计。
- 不允许基于猜测填写真实插件名称或能力。
- Phase 4 不选择真实插件，只规划未来单插件接入前置条件。
- Phase 8 只设计 manifest 审查流程，不读取真实 VCPToolBox，不更新真实插件能力。

## 矩阵字段

| plugin_name | task_type | input_mode | output_mode | best_for_cn | not_suitable_for_cn | approval_required | risk_level | current_status | notes_cn |
|---|---|---|---|---|---|---|---|---|---|
| 待实测插件占位 | photo_studio_os_review | unknown | unknown | 待读取 manifest 后确认 | 待读取 manifest 后确认 | true | medium | 待实测 | 占位行，不代表真实插件能力 |
| 待实测插件占位 | image_refinement | unknown | unknown | 待读取 manifest 后确认 | 待读取 manifest 后确认 | true | medium | 待实测 | 占位行，不代表真实插件能力 |
| 待实测插件占位 | product_photography | unknown | unknown | 待读取 manifest 后确认 | 待读取 manifest 后确认 | true | high | 待实测 | 涉及真实商品或客户素材时必须人工审批 |

## 状态推进规则

能力矩阵状态只能按人工审查顺序推进：

```text
待实测
→ pending_manifest_review
→ manifest_reviewed_safe
→ dry_run_checked
→ tested
```

状态说明：

| current_status | 含义 | 是否允许真实执行 |
|---|---|---|
| 待实测 | 尚未读取或审查 manifest | 否 |
| pending_manifest_review | 已准备进入 manifest 审查，但尚无安全结论 | 否 |
| manifest_reviewed_safe | manifest 脱敏审查通过，可进入 dry-run 评估 | 否 |
| dry_run_checked | dry-run 验收完成，真实插件调用仍为 0 | 否 |
| tested | 人工确认测试记录完整，但不自动授权真实执行 | 否 |
| rejected | 存在安全、隐私、权限或越界风险 | 否 |

`tested` 只表示记录完整，不代表插件可真实执行。

## 更新规则

补充真实能力前必须完成：

1. 人工确认读取的是真实 VCPToolBox 插件 manifest。
2. 不暴露 manifest 中的密钥或私密配置。
3. 运行 dry-run，不调用真实生图 API。
4. 记录测试日期、测试者和审计结论。
5. 经 Gatekeeper 和人工审批后再更新矩阵。

Phase 8 期间只能新增或更新脱敏审查记录，不得把占位插件标记为可用。

## Phase 4 单插件前置条件

Phase 4 不填真实插件名，也不把任何占位行标记为可用。未来如果只接一个真实插件，必须先完成：

| 条件 | 要求 | 未满足时处理 |
|---|---|---|
| manifest 人工复查 | 确认真正读取到插件 manifest，且不复制敏感配置 | 保持 `待实测` |
| 能力矩阵状态 | 只能按 `待实测` → `pending_manifest_review` → `manifest_reviewed_safe` → `dry_run_checked` → `tested` 推进 | 不允许选择插件 |
| 安全审计 | 不包含 API key、token、cookie、密码、私密路径或客户隐私原文 | 拒绝进入真实执行 |
| dry-run preflight | `max_plugin_calls=0`、`execution_blocked=true` | 只返回拒绝草案 |
| Gatekeeper | 完成执行风险与越界风险复查 | 不进入 Review Console 执行审批 |
| Review Console | 完成人工审批，但只批准草案 | 不触发插件执行 |
| rollback | 明确如何回退到 dry-run 草案 | 不允许真实执行 |
| audit | 记录中文脱敏摘要 | 不记录敏感原文 |

## 禁止

- 不要写真实 API key、token、cookie、密码。
- 不要写私密路径。
- 不要写客户信息。
- 不要把偶发失败写成长期插件结论。
- 不要把待实测插件标记为可用。
- 不要把 `manifest_reviewed_safe`、`dry_run_checked` 或 `tested` 解释为真实执行授权。
