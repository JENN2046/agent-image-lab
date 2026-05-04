# Memory Review Checklist

## 用途

本清单用于人工审查 `memory_delta`、DailyNote 草案、案例摘要和风格规则候选。通过本清单不代表自动写入 VCP 长期记忆；写入仍需审批链完成。

## 基础字段检查

- [ ] 是否有 `agent_name`。
- [ ] 是否有 `agent_role`。
- [ ] 是否有 `task_id`。
- [ ] 是否有 `case_id`，或明确说明为何为空。
- [ ] 是否有 `source`。
- [ ] 是否有 `target_notebook`。
- [ ] 是否有 `tags`。
- [ ] 是否有 `approval_status`。
- [ ] 是否有 `write_mode`。

## 中文正文检查

- [ ] `chinese_diary_title` 是否为中文或中文为主。
- [ ] `chinese_diary_content` 是否为中文正文。
- [ ] 英文提示词是否只存在于 `preserved_original` 等原文保留字段。
- [ ] 英文提示词是否附有中文解释。
- [ ] DailyNote 正文是否没有英文段落作为主体。

## 敏感信息检查

- [ ] 是否包含 API key。
- [ ] 是否包含 token。
- [ ] 是否包含 cookie。
- [ ] 是否包含密码。
- [ ] 是否包含私密路径。
- [ ] 是否包含客户隐私。
- [ ] 是否包含客户未公开产品细节。
- [ ] 是否包含客户原图完整描述。
- [ ] 是否包含图片二进制。
- [ ] 是否已经设置 `memory_safety.contains_secret`。
- [ ] 是否已经设置 `memory_safety.contains_private_path`。
- [ ] 是否已经设置 `memory_safety.contains_customer_private_data`。
- [ ] 是否已经设置 `memory_safety.contains_image_binary`。

## 敏感原文禁止检查

如果发现敏感内容：

- [ ] 是否没有复制敏感原文进 `memory_delta`。
- [ ] 是否没有复制敏感原文进 `preserved_original`。
- [ ] 是否没有复制敏感原文进 Tag。
- [ ] 是否没有复制敏感原文进审计日志。
- [ ] 是否没有复制敏感原文进拒绝原因。
- [ ] 是否没有复制敏感原文进 DailyNote 中文正文。
- [ ] 是否只保留脱敏摘要和安全标记。
- [ ] `final_decision.should_write_to_vcp` 是否为 false。

## write_mode 不变量检查

- [ ] `write_mode: confirmed` 时，`approval_status` 是否为 `approved`。
- [ ] `write_mode: confirmed` 时，`approved_by` 是否存在。
- [ ] `write_mode: confirmed` 时，`approved_at` 是否存在。
- [ ] `write_mode: confirmed` 时，`final_decision.should_write_to_vcp` 是否为 true。
- [ ] `write_mode: draft` 时，`final_decision.should_write_to_vcp` 是否默认为 false。
- [ ] `write_mode: audit_only` 时，`final_decision.should_write_to_vcp` 是否为 false。
- [ ] `write_mode: audit_only` 是否只进入审计记录，不进入长期经验记忆。
- [ ] `write_mode: forbidden` 时，`approval_status` 是否为 `rejected`。
- [ ] `write_mode: forbidden` 时，`final_decision.should_write_to_vcp` 是否为 false。
- [ ] `write_mode: forbidden` 时，`rejection_reason_cn` 是否存在。
- [ ] `approval_status: not_required` 是否没有配合 `write_mode: confirmed` 使用。

## 权限与审批检查

- [ ] 是否试图写核心风格规则。
- [ ] 是否需要 ImageLab_Master 审核。
- [ ] 是否需要 Archivist_Agent 审核。
- [ ] 是否需要 Gatekeeper_Agent 安全审查。
- [ ] 是否需要 Review Console 人工审批。
- [ ] 子 Agent 是否只生成 `memory_delta`，没有直接写入 VCP 长期记忆。
- [ ] 是否应该只保留审计摘要。
- [ ] 是否可升级为 Git 硬规则候选。

## 最终处理建议

- [ ] 可以进入 Review Console 预览。
- [ ] 可以提交写入申请。
- [ ] 只能保留审计摘要。
- [ ] 必须拒绝写入。
- [ ] 需要人工改写中文正文。
- [ ] 需要移除或脱敏敏感内容。
