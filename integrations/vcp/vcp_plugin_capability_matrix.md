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
- v0.6 已完成一次单一真实生图插件 manifest 脱敏审查；状态推进仅限 `manifest_reviewed_safe`，不代表 dry-run、测试或真实执行。

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

## Phase 12 state governance

Phase 12 将能力矩阵状态推进规则固定为 v0.2 的治理口径。v0.2 final baseline 不读取真实 VCPToolBox，不读取真实 VCPChat，不读取真实 manifest，不调用插件，不调用 API，不写 DailyNote，不创建图片。

v0.2 可以记录状态规则和未来状态模板，但不得声称任何真实插件已经达到 `manifest_reviewed_safe`、`dry_run_checked` 或 `tested`。

状态进入条件：

| 状态 | v0.2 是否可作为当前真实状态 | 进入条件 |
|---|---|---|
| `待实测` | 是 | 默认占位状态，未读取 manifest，未形成候选审查记录 |
| `pending_manifest_review` | 是 | 已有 no-read 候选记录或授权门槛草案，但未读取真实 manifest |
| `manifest_reviewed_safe` | 否 | 未来必须先完成单独授权的真实 manifest 读取和脱敏审查 |
| `dry_run_checked` | 否 | 未来必须先有 `manifest_reviewed_safe`，再完成 max_plugin_calls=0 的 dry-run 验收 |
| `tested` | 否 | 未来必须先有 dry-run 记录和人工确认；仍不代表真实执行授权 |
| `rejected` | 是 | 发现无授权、无法脱敏、敏感原文、越界权限或 Gatekeeper 拒绝 |

反向规则：

- 未授权读取真实 manifest 时，不能进入 `manifest_reviewed_safe`。
- 未完成 dry-run 验收时，不能进入 `dry_run_checked`。
- 未完成人工确认时，不能进入 `tested`。
- 任何状态都不改变 `selected_plugin=null`、`max_plugin_calls=0`、`execution_blocked=true` 和 `real_execution_allowed=false`。
- `manifest_reviewed_safe`、`dry_run_checked`、`tested` 在 v0.2 中只能作为未来状态说明或模板字段，不得作为真实当前状态。

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

## Phase C 脱敏审查记录

以下记录只表示候选 manifest 已完成中文脱敏审查，不代表插件已安装、已测试或允许真实执行。

| candidate_id | plugin_display_name_summary_cn | review_status | allowed_next_step | real_execution_allowed | notes_cn |
|---|---|---|---|---|---|
| agent-image-lab-adapter-draft | Agent Image Lab Adapter 草案桥接组件 | manifest_reviewed_safe | Phase D dry-run 设计评估 | false | 仅限仓库内草案 manifest；不选择真实插件，不调用插件，不写 DailyNote。 |

## v0.6 真实生图 manifest 脱敏审查记录

以下记录只表示单一真实生图插件 manifest 已完成中文脱敏审查，不代表插件已选择、已调用、已测试或允许真实执行。

| candidate_id | plugin_display_name_summary_cn | review_status | allowed_next_step | real_execution_allowed | notes_cn |
|---|---|---|---|---|---|
| DoubaoGen | 图像生成类候选插件 | manifest_reviewed_safe | dry-run evaluation planning | false | 只保存中文脱敏摘要；存在凭据类和服务地址类配置声明，后续必须复查凭据注入、输出目录、图片二进制边界、最大调用次数和回滚方案。 |

## 禁止

- 不要写真实 API key、token、cookie、密码。
- 不要写私密路径。
- 不要写客户信息。
- 不要把偶发失败写成长期插件结论。
- 不要把待实测插件标记为可用。
- 不要把 `manifest_reviewed_safe`、`dry_run_checked` 或 `tested` 解释为真实执行授权。
