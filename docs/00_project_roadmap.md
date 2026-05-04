# 00 项目路线图

本文是 Agent Image Lab 的总路线图，用来把 v0.2 基线、v0.3 授权门槛、MVP-B dry-run 和未来真实闭环串成一条可执行路径。

## 完成定义

Agent Image Lab 不是在第一次能生成图片时才算完成。项目完成分为四层：

| 层级 | 状态 | 完成标准 |
|---|---|---|
| L1 规格基线 | 已基本完成 | 文档、Agent 规则、schema、记忆策略、审片台规格、无执行样例完整，并能通过只读校验。 |
| L2 审片台原型 | 已基本完成 | 静态 Review Console 能展示版本、评分、人工覆盖、审批和 memory_delta 草案，不调用 API、不写文件。 |
| L3 MVP-B dry-run | 未完成 | Adapter dry-run 有最小可验证实现，仍保持 `max_plugin_calls=0`、不调用真实插件、不写 DailyNote。 |
| L4 受控真实闭环 | 未开始 | 在独立授权下读取单一 manifest 脱敏摘要、选择单一插件、完成人工审批后的最小真实执行与回滚策略。 |

## 当前基线

当前仓库处于：

```text
v0.2.5 final baseline + v0.3.0 manifest authorization planning
```

已经完成：

- MVP-A 无执行闭环的文档、schema、样例和角色规则。
- Review Console 静态原型。
- VCPChat 接入设计边界。
- Adapter dry-run planning。
- v0.3 manifest recon / authorization gate / sanitized read preflight 文档。
- v0.3 authorization planning closeout。
- 只读校验脚本 `scripts/validate_mvp.ps1`。

仍未完成：

- 真实 manifest 读取。
- 真实插件选择。
- Adapter dry-run 的真实运行实现。
- VCPChat 子窗口接入。
- DailyNote / VCP 长期记忆真实写入。
- 真实图片生成、编辑、归档。

## 阶段路线

### Phase A：项目基线收束

目标：让仓库自身可被复查、校验和交付。

必须完成：

- `scripts/validate_mvp.ps1` 通过。
- `node --check review_console/static_prototype/app.js` 通过。
- `node --check review_console/static_prototype/mock_data.js` 通过。
- `git diff --check` 通过。
- README 指向路线图、验收标准和校验脚本。
- `AGENTS.md` 不写死本地解压路径。

禁止：

- 调用 API。
- 调用 VCP 插件。
- 写 DailyNote。
- 写图片文件。
- 修改 VCPToolBox / VCPChat。

### Phase B：v0.3 manifest 读取授权闭环

目标：完成真实 manifest 读取前的授权记录链，但不读取 manifest。

必须完成：

- 明确唯一候选 manifest 的脱敏引用格式。
- 明确读取方式必须只读。
- 明确允许摘录字段和禁止字段。
- 明确 Gatekeeper、Review Console、Archivist、ImageLab_Master 的审批顺序。
- 所有样例保持 `source_authorized=false`、`source_read_performed=false`、`real_manifest_read=false`。

进入下一阶段的条件：

- 用户单独授权读取一个候选 manifest。
- 授权中必须写明读取对象、读取方式、可摘录字段、禁止字段和拒绝条件。

### Phase C：单一 manifest 脱敏读取

目标：在独立授权下，只读取一个候选 manifest，并只输出中文脱敏摘要。

进入 Phase C 前必须先使用 `integrations/vcp/phase_c_manifest_sanitized_read_contract.md` 形成独立授权申请。没有唯一候选和用户明确授权时，只允许维护授权模板，不得读取真实 manifest。

允许输出：

- 脱敏插件显示名摘要。
- 命令集合中文摘要。
- 输入输出模式中文摘要。
- 权限风险中文摘要。
- Gatekeeper 需要复查的风险点。

禁止输出：

- raw manifest 原文。
- API key、token、cookie、密码。
- endpoint、webhook、数据库地址原文。
- 私密路径。
- 客户隐私或客户未公开信息。
- 真实插件输出。
- 真实运行日志。

完成标准：

- 形成 manifest review record。
- 能力矩阵可从 `pending_manifest_review` 推进到 `manifest_reviewed_safe` 或 `rejected`。
- 不进入 `dry_run_checked`、`tested` 或 `execution_ready`。

### Phase D：Adapter dry-run 最小实现

目标：实现一个只接受 dry-run 输入、只返回草案对象的最小 Adapter 骨架。

Phase D 的实现边界以 `integrations/vcp/phase_d_adapter_dry_run_minimal_contract.md` 为准。未获得真实执行授权前，不得在 `exports/vcptoolbox/Plugin/AgentImageLabAdapter/` 中创建 `index.js` 或任何真实 VCP 插件执行入口。

必须保持：

```yaml
selected_plugin: null
max_plugin_calls: 0
external_api_allowed: false
execution_blocked: true
daily_note_called: false
```

必须完成：

- 输入字段校验。
- 敏感字段拒绝。
- `vcp_task_envelope` 到 `vcp_dispatch_plan` 草案转换。
- Gatekeeper handoff 草案。
- Review Console handoff 草案。
- 中文脱敏 audit summary。

禁止：

- 调用真实插件。
- 调用外部 API。
- 写文件。
- 写 DailyNote。
- 保存图片。

### Phase E：Review Console 集成准备

目标：把静态原型升级为可嵌入 VCPChat 的设计实现准备，但仍不改真实 VCPChat。

必须完成：

- 明确输入对象只允许受控 `review_session` 草案。
- 明确输出只允许 `review_session_draft`、`image_case_draft`、`memory_delta_draft`。
- 保持 `contextIsolation=true`、`nodeIntegration=false`、IPC sender 校验。
- renderer 不直接写 DailyNote、不直接调用插件、不写磁盘。

完成标准：

- 形成 VCPChat 子窗口接入任务书。
- 形成 IPC 契约草案。
- 形成安全验收清单。

### Phase F：MVP-B 受控真实执行

目标：在人工审批和回滚策略完整后，接入单一真实插件的最小执行闭环。

进入条件：

- Phase C 已完成单一 manifest 脱敏审查。
- Phase D dry-run 已完成并通过验收。
- 用户单独授权真实插件、真实输入、真实输出目录和最大调用次数。
- 有备份、回滚、日志脱敏和失败停止条件。

完成标准：

- 单一插件可在审批后执行一次最小任务。
- Review Console 可人工评分和审批。
- 资产只保存路径引用和摘要，不把图片二进制写入长期记忆。
- memory_delta 只生成写入申请，不绕过审批写 DailyNote。

## 当前优先队列

1. 收束 Phase A：补路线图、README 入口、只读校验脚本并提交。
2. 给当前 HEAD 打 `v0.3.0-planning-baseline` 或类似 tag。
3. 等待用户单独授权后，才进入 Phase C 的单一 manifest 脱敏读取。
4. 未授权前，只允许继续完善只读校验、文档一致性和 Review Console 设计。

## 永久安全门

任何阶段都不能绕过以下规则：

- 不复制密钥、token、cookie、密码、私密路径或客户隐私。
- 不把图片二进制写入 Git 或 VCP 长期记忆。
- 不把英文提示词作为 DailyNote 正文。
- 不让子 Agent 直接批准核心风格记忆。
- 不让 Review Console renderer 直接调用 DailyNote、插件、API 或文件写入。
- 不把 `tested` 理解为真实执行授权。
