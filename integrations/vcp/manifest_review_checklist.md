# Manifest Review Checklist

本文定义未来读取真实 VCP 插件 manifest 前后的人工审查流程。

当前文件只是审查清单，不读取真实 VCPToolBox，不读取真实 VCPChat，不调用插件，不调用 API，不写 DailyNote，不写图片文件。

## 当前阶段

Phase 8 只设计 manifest 审查流程。真实 manifest 读取必须另行授权，且授权范围必须明确：

- 读取对象。
- 读取方式。
- 是否允许摘录字段。
- 是否允许更新能力矩阵。
- 是否允许进入 dry-run 实测。

未获得单独授权前，所有插件状态必须保持 `待实测` 或 `pending_manifest_review`。

## Phase 9 manifest 授权读取前置门槛

Phase 9 只规划真实 manifest 读取前的授权门槛，不读取真实 VCPToolBox，不读取真实 VCPChat，不读取真实 manifest，不调用插件，不调用 API，不写 DailyNote，不写图片文件。

真实 manifest 读取必须作为独立授权点。授权前必须先形成一份前置审查记录，并明确：

- 读取对象：只能写占位引用或人工可读的脱敏目标说明，不写真实私密路径。
- 读取方式：只说明未来人工读取或受控只读读取方式，不执行读取。
- 允许摘录字段：只能是脱敏插件显示名、命令集合中文摘要、输入输出模式中文摘要、权限风险中文摘要。
- 禁止摘录字段：API key、token、cookie、密码、私密路径、客户隐私、webhook、数据库地址、服务端点原文、图片二进制、真实插件输出。
- 审查人：必须指定人工审查角色或 Gatekeeper 复查角色。
- 拒绝条件：任何无法脱敏、权限不明、暗示外部调用、暗示写文件或写 DailyNote 的情况都必须拒绝。

授权前置记录默认必须保持：

```yaml
source_authorized: false
source_read_performed: false
next_allowed_state: pending_manifest_review
real_execution_allowed: false
```

前置审查通过也只允许进入“等待授权读取”状态，不自动进入 `manifest_reviewed_safe`。`manifest_reviewed_safe` 只能在未来真实 manifest 被单独授权读取并完成脱敏审查后产生。

## 审查目标

manifest 审查只回答以下问题：

- manifest 是否存在。
- manifest 是否看起来属于目标插件。
- manifest 是否声明命令、输入、输出和权限。
- manifest 是否包含需要脱敏的字段。
- manifest 是否允许进入 dry-run 候选评估。

manifest 审查不回答以下问题：

- 插件是否真实可用。
- 插件输出质量是否合格。
- 插件是否允许真实执行。
- 插件是否可以写文件、写图片或调用外部 API。
- 插件是否可以写 DailyNote 或 VCP 长期记忆。

## 允许记录的脱敏摘要

审查记录只能保存：

- 脱敏插件显示名或占位名。
- manifest 审查状态。
- 命令集合的安全摘要。
- 输入输出模式的人工摘要。
- 权限风险的中文摘要。
- Gatekeeper 需要复查的风险项。
- 审查人、审查日期和中文审查结论。

## 禁止记录的内容

不得复制或保存：

- 任何密钥、令牌、cookie、密码。
- 任何私密绝对路径。
- 任何客户隐私或客户未公开信息。
- 任何 webhook、数据库地址或服务端点原文。
- 任何 manifest 中的敏感配置原文。
- 任何图片二进制。
- 任何真实插件输出。

拒绝原因也必须脱敏，例如：

```text
本 manifest 含敏感配置字段，拒绝进入 dry-run 候选评估。
```

## 审查状态机

```text
待实测
→ pending_manifest_review
→ manifest_reviewed_safe
→ dry_run_checked
→ tested
```

状态含义：

| 状态 | 含义 | 是否允许真实执行 |
|---|---|---|
| 待实测 | 尚未读取或审查 manifest | 否 |
| pending_manifest_review | 已获授权准备审查 manifest，但尚无安全结论 | 否 |
| manifest_reviewed_safe | manifest 脱敏审查通过，可进入 dry-run 评估 | 否 |
| dry_run_checked | dry-run 验收完成，真实调用仍为 0 | 否 |
| tested | 人工确认测试记录完整，但仍不自动授权真实执行 | 否 |
| rejected | 存在安全、隐私、权限或越界风险 | 否 |

`tested` 只表示测试记录完整，不表示可以真实执行。

## 人工审查清单

- [ ] 是否有单独授权读取真实 manifest。
- [ ] 是否确认未读取真实 VCPToolBox 之外的路径。
- [ ] 是否确认未读取真实 VCPChat。
- [ ] 是否确认未复制密钥、令牌、cookie 或密码原文。
- [ ] 是否确认未复制私密路径。
- [ ] 是否确认未复制客户隐私或客户未公开信息。
- [ ] 是否确认未复制 webhook、数据库地址或服务端点原文。
- [ ] 是否确认未保存图片二进制。
- [ ] 是否确认未调用插件。
- [ ] 是否确认未调用外部 API。
- [ ] 是否确认未写文件或图片。
- [ ] 是否确认未写 DailyNote。
- [ ] 是否确认未修改真实 VCPToolBox。
- [ ] 是否确认未修改真实 VCPChat。
- [ ] 是否确认仅记录中文脱敏摘要。
- [ ] 是否确认能力矩阵状态推进有人工签名。
- [ ] 是否确认进入真实执行需要另行授权。

## 审查记录模板

```yaml
manifest_review_record:
  review_id: manifest-review-placeholder-001
  review_date: "YYYY-MM-DD"
  reviewer_role: human_reviewer
  candidate_id: candidate-plugin-placeholder-001
  plugin_display_name_cn: "待确认插件"
  source_authorized: false
  source_read_performed: false
  manifest_review_status_before: "待实测"
  manifest_review_status_after: pending_manifest_review
  sanitized_summary_cn: "尚未读取真实 manifest，仅记录审查准备状态。"
  command_summary_cn: "未确认。"
  input_mode_observed: unknown
  output_mode_observed: unknown
  permission_risk_cn: "未确认。"
  sensitive_original_copied: false
  private_path_copied: false
  customer_private_data_copied: false
  image_binary_copied: false
  external_api_called: false
  plugin_called: false
  file_write_observed: false
  daily_note_write_observed: false
  gatekeeper_required: true
  review_console_required: true
  next_allowed_state: pending_manifest_review
  real_execution_allowed: false
  audit_summary_cn: "Phase 8 仅准备 manifest 审查流程，未读取真实 manifest，未调用插件。"
```

## 拒绝条件

出现以下任一情况，状态必须改为 `rejected`：

- 无授权读取真实 manifest。
- manifest 内容无法脱敏记录。
- manifest 暗示需要未授权外部 API。
- manifest 暗示需要写文件或图片。
- manifest 暗示需要直接写 DailyNote 或长期记忆。
- manifest 包含不应保存的敏感原文。
- 审查人无法确认字段含义。
- Gatekeeper 要求拒绝。

## 不变量

- 本文件不授权真实 manifest 读取。
- 本文件不授权真实插件执行。
- 本文件不授权修改 VCPToolBox。
- 本文件不授权修改 VCPChat。
- 本文件不授权调用 API。
- 本文件不授权写 DailyNote。
- 本文件不授权创建图片文件。
