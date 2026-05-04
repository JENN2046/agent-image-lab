# Validation Checklist

## 结构检查

- [ ] 所有任务书要求的 MVP 文件存在。
- [ ] 文件直接位于项目根目录下，没有创建第二套 `agent-image-lab/` 嵌套目录。
- [ ] 未修改 `codex/00_MASTER_TASK.md`。
- [ ] 未修改 VCPToolBox。
- [ ] 未修改 VCPChat。

## 安全检查

- [ ] 没有 API key、token、cookie、密码、私密路径或客户隐私。
- [ ] 没有真实插件执行代码。
- [ ] 没有真实 VCP 生图 API 调用。
- [ ] 没有真实图片文件。
- [ ] asset_archive 只包含 README 和 `.gitkeep`。

## 记忆检查

- [ ] 所有 DailyNote / memory_delta 示例正文都是中文。
- [ ] `memory_delta.example.yaml` 包含 `agent_name`、`target_notebook`、`write_mode`、`approval_required`、`chinese_diary_content`、`tags`、`memory_safety`。
- [ ] 所有子 Agent 文件都包含 `memory_delta` 要求。
- [ ] 禁止写入长期记忆清单包含密钥、私密路径、客户隐私、图片二进制、未经确认的核心风格规则、单次 AI 推测和插件偶发失败结论。

## 视觉规则检查

- [ ] Photo Studio OS 视觉规则出现在 `docs/08_photo_studio_os_visual_rules.md`。
- [ ] Photo Studio OS 视觉规则出现在 `style_memory_seed/photo_studio_os.md`。
- [ ] Photo Studio OS 禁止方向出现在 `prompt_templates/photo_studio_os/negative_prompt.md`。
- [ ] 三处规则没有互相矛盾。

## Review Console 检查

- [ ] Review Console 只做规格和 schema，不做真实 UI。
- [ ] 明确人工评分覆盖 AI 评分。
- [ ] 明确 renderer 不直接写 DailyNote。
- [ ] 明确不直接调用 VCP 插件。

## VCP dry-run 检查

- [ ] `integrations/vcp/` 只包含文档和 schema 草案。
- [ ] `exports/vcptoolbox/` 只包含导出草案，不代表真实 VCPToolBox 已修改。
- [ ] AgentImageLabAdapter 只允许 `dry_run` 命令。
- [ ] AgentImageLabAdapter 不包含 execution mode。
- [ ] AgentImageLabAdapter 没有 `index.js` 或其他真实执行入口。
- [ ] `plugin-manifest.json` 中 `external_api_allowed=false`。
- [ ] `plugin-manifest.json` 中 `execution_blocked=true`。
- [ ] `plugin-manifest.json` 中 `max_plugin_calls=0`。
- [ ] 插件能力矩阵仅包含待实测 / 占位行，不推测真实插件能力。
- [ ] VCP 工具请求示例标注不代表真实执行、不含真实插件调用、不含密钥。

## 无执行闭环检查

- [ ] `tests/schema_examples/task_envelope.example.yaml` 是 Photo Studio OS 无执行样例。
- [ ] `tests/schema_examples/review_score.example.yaml` 有分项评分和中文评审。
- [ ] `tests/schema_examples/memory_delta.example.yaml` 有中文正文和安全检查。
- [ ] MVP-A 闭环能串联：用户需求 → task_envelope → prompt_package → review_score → human_review → memory_delta → case_summary。
