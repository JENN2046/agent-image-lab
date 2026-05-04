# Adapter Runtime Contract

本文定义 AgentImageLabAdapter 在 MVP-B 真实接入前的 dry-run runtime contract。

当前文件是契约说明，不是插件实现，不包含可执行入口，不修改真实 VCPToolBox，不调用任何 VCP 插件。

## 适用阶段

- Phase 7：单插件候选评估与 dry-run 验收设计。
- 仅用于设计 Adapter 接收、校验、返回 dry-run 草案的边界。
- 不允许从本文件推导出 execution mode。

## 运行边界

Adapter MVP runtime 必须保持：

- `mode=dry_run`
- `selected_plugin=null`
- `max_plugin_calls=0`
- `external_api_allowed=false`
- `execution_blocked=true`
- `allow_file_write=false`
- `allow_image_binary=false`
- `daily_note_direct_write_allowed=false`

Adapter MVP runtime 禁止：

- 调用真实 VCP 生图插件。
- 调用外部 API。
- 写入 DailyNote。
- 写入 VCP 长期记忆。
- 写入图片文件。
- 写入任意磁盘资产。
- 读取、复制或输出 API key、token、cookie、密码、私密路径或客户隐私原文。
- 将占位能力矩阵升级为真实能力结论。

## 唯一允许命令

```text
dry_run
```

## 禁止命令

```text
execute
generate
run
call_plugin
write_memory
write_image_file
```

## 输入契约

Adapter 只能接收 `integrations/vcp/vcp_task_envelope.schema.yaml` 约束的草案对象。

最低要求：

- `task_id` 存在。
- `mode=dry_run`。
- `dry_run_controls.max_plugin_calls=0`。
- `dry_run_controls.allow_external_api=false`。
- `dry_run_controls.allow_file_write=false`。
- `dry_run_controls.allow_image_binary=false`。
- `approval_context.gatekeeper_required=true`。
- `approval_context.review_console_required=true`。
- `approval_context.daily_note_direct_write_allowed=false`。
- `safety.contains_secret=false`。
- `safety.contains_private_path=false`。
- `safety.contains_customer_private_data=false`。
- `safety.contains_image_binary=false`。

输入中的图片只能是占位引用或非私密引用，不得包含图片二进制。

## 输出契约

Adapter 只能返回 `integrations/vcp/vcp_dispatch_plan.schema.yaml` 约束的 dry-run 草案。

最低要求：

- `mode=dry_run`。
- `selected_plugin=null`。
- `capability_matrix_status=placeholder` 或 `pending_manifest_review`。
- `dry_run_required=true`。
- `approval_required=true`。
- `execution_blocked=true`。
- `external_api_allowed=false`。
- `gatekeeper_required=true`。
- `review_console_required=true`。
- `allow_file_write=false`。
- `allow_image_binary=false`。
- `max_plugin_calls=0`。
- `rollback_plan.external_rollback_required=false`。
- `audit_record.contains_sensitive_original=false`。

输出只能表达调度建议、拒绝原因、风险摘要和人工审批所需的中文脱敏信息。

## Preflight 状态机

```text
vcp_task_envelope 草案
→ 字段完整性检查
→ no-execution 不变量检查
→ safety 检查
→ 能力矩阵占位状态检查
→ vcp_dispatch_plan dry-run 草案
→ Gatekeeper_Agent 风险复查
→ Review Console 人工审批展示
```

任一检查失败时：

- 返回 `preflight_result.status=rejected`。
- 写入中文脱敏 `rejection_reason_cn`。
- 保持 `execution_blocked=true`。
- 保持 `max_plugin_calls=0`。
- 不调用插件、不写文件、不写 DailyNote。

## Gatekeeper handoff

Adapter 输出给 Gatekeeper 的信息只能包含：

- `task_id`
- `dispatch_id`
- `mode`
- `risk_level`
- `risk_summary_cn`
- `blocked_actions`
- `preflight_result`
- 中文脱敏拒绝原因

不得向 Gatekeeper 传递敏感原文。

## Review Console handoff

Adapter 输出给 Review Console 的信息只能用于人工展示：

- dry-run 风险摘要。
- 被阻止动作。
- 候选插件状态。
- rollback 草案。
- audit 摘要。
- memory_delta 写入申请草案所需的中文摘要。

Review Console 不得因为收到 Adapter handoff 而触发真实执行。

## 单插件候选接入前置条件

未来进入单插件候选评估时，必须先满足：

1. 用户另行授权读取真实插件 manifest。
2. manifest 内容经过人工复查。
3. 不复制 manifest 中任何密钥、token、cookie、密码、私密路径或客户隐私。
4. 能力矩阵状态只能从 `待实测` 进入 `pending_manifest_review`。
5. dry-run 验收记录完整。
6. Gatekeeper 完成风险复查。
7. Review Console 完成人工审批展示。
8. 用户另行批准真实执行任务。

未满足以上条件时，Adapter 必须保持 no-execution。

## 审计记录

审计记录只能保存中文脱敏摘要：

```yaml
audit_record:
  audit_id: audit-placeholder-001
  task_id: task-placeholder-001
  dispatch_id: dispatch-placeholder-001
  audit_summary_cn: "仅完成 dry-run preflight，未调用插件、API、DailyNote 或文件写入。"
  contains_sensitive_original: false
  max_plugin_calls_observed: 0
  external_api_observed: false
  file_write_observed: false
  image_binary_observed: false
```

## 不变量

- 本文件不授权真实执行。
- 本文件不授权安装插件。
- 本文件不授权修改 VCPToolBox。
- 本文件不授权修改 VCPChat。
- 本文件不授权写 DailyNote。
- 本文件不授权创建图片文件。
- 本文件不记录真实插件能力。
