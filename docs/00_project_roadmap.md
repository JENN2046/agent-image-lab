# 00 项目路线图

本文是 Agent Image Lab 的总路线图，用来把 v0.2 基线、v0.3 授权门槛、MVP-B dry-run 和未来真实闭环串成一条可执行路径。

## 完成定义

Agent Image Lab 不是在第一次能生成图片时才算完成。项目完成分为四层：

| 层级 | 状态 | 完成标准 |
|---|---|---|
| L1 规格基线 | 已基本完成 | 文档、Agent 规则、schema、记忆策略、审片台规格、无执行样例完整，并能通过只读校验。 |
| L2 审片台原型 | 已基本完成 | 静态 Review Console 能展示版本、评分、人工覆盖、审批和 memory_delta 草案，不调用 API、不写文件。 |
| L3 MVP-B dry-run | 已基本完成 | Adapter dry-run 已有项目内实现、VCPToolBox 导出包和 v0.5 安装验证，仍保持 `max_plugin_calls=0`、不调用真实插件、不写 DailyNote。 |
| L4 受控真实闭环 | 已完成 v1.0 closeout 候选 | 已完成单一真实生图 manifest 脱敏审查、v0.7 前置包、Photo Studio OS 0 调用 dry-run rehearsal、受控真实执行、脱敏记录和人工接受通过。 |

## 当前基线

当前仓库处于：

```text
v1.0 true-loop closeout candidate + v7.43 external remote-debug verification script creation execution record
```

已经完成：

- MVP-A 无执行闭环的文档、schema、样例和角色规则。
- Review Console 静态原型。
- VCPChat 接入设计边界。
- Adapter dry-run planning。
- v0.3 manifest recon / authorization gate / sanitized read preflight 文档。
- v0.3 authorization planning closeout。
- 仓库内 AgentImageLabAdapter 草案 manifest 的 Phase C 脱敏审查记录。
- Phase D 项目内 Adapter dry-run lab 最小实现。
- v0.4 VCPToolBox 导出级 dry-run Adapter 候选文件。
- v0.5 VCPToolBox Adapter-only dry-run 安装验证记录。
- v0.6 单一真实生图插件 manifest 只读脱敏审查记录。
- v0.7 Gatekeeper 风险边界、Review Console 人工审批前置记录和真实执行前确认表。
- v0.7 独立真实执行授权门和 Photo Studio OS 0 调用 dry-run rehearsal。
- v0.8 release readiness 报告、安装操作指南和最终验收报告。
- v0.9 post-execution checkpoint、retry authorization gate、retry 真实执行记录和候选插件扫描。
- v0.10 GPTImageGen 脱敏失败记录。
- v0.10 DoubaoGen model-explicit retry 真实执行记录，已由用户人工接受进入下一阶段。
- v1.0 true-loop closeout 记录和最终验收材料。
- v3.9 Review Console runtime prototype 共享 guard 抽取，并已形成 baseline tag。
- v4.0 runtime smoke test 加固：从 `index.html` 读取真实脚本顺序，并验证共享 guard API。
- v4.1 runtime guard unit harness：直接验证共享 guard 的拒绝策略、默认值和审批规则。
- v4.2 runtime validation suite：聚合 runtime 原型语法检查、guard unit 和 smoke test。
- v4.3 guarded autopilot overlay：安装 `.agent_board`、overlay 规则和本地校验 helper，且保持不覆盖根 `AGENTS.md`。
- v4.4 agent board state validation：机器检查 `.agent_board` 必需文件、硬停止门、handoff 和验证快照。
- v4.5 local checkpoint readiness：机器检查 v4.0-v4.5 本地 checkpoint、overlay、agent board、验证脚本和 commit/tag/push 门。
- v4.6 local commit scope manifest：机器检查 v4.0-v4.6 本地 changed-file allowlist、staging 状态和 commit/tag/push 门。
- v4.7 post-push state reconciliation：记录 v4.6 pushed baseline，并校正 `.agent_board` 续跑状态。
- v4.8 v4 index consistency validation：机器检查 v4.x 阶段索引一致性，覆盖 README、MANIFEST、roadmap、checklist、release notes、schema、脚本和 `.agent_board`。
- v4.9 local tag push-readiness preflight：记录本地 v4.8 commit/tag 已就位，远端 push 仍需单独授权。
- v5.0 post-merge delivery readiness index：记录 PR #1 已合并、本地 `master` 已同步到 `origin/master`，并把交付验收入口机器可查化。
- v5.1 runtime delivery surface validation：机器检查 Review Console runtime prototype 的本地交付面、脚本顺序、DOM surface、host ack 和无外部副作用边界。
- v5.2 adapter delivery surface validation：机器检查 Adapter dry-run lab 和 VCPToolBox 导出级 dry-run 包的 manifest、stdio、fixture、README 边界和 no-execution guard。
- v5.3 review console adapter handoff validation：机器检查 Adapter dry-run accepted fixture 能以 no-execution handoff 草案进入 Review Console static prototype。
- v5.4 local sync readiness preflight：机器检查本地 `master` 相对 `origin/master` 的领先提交链，并保留 push/tag/PR/release 独立授权门。
- v5.5 post-commit reconciliation checkpoint：记录 v5.4 已落成本地 commit `a2ae539`，并把当前本地领先提交链更新为 4 个提交。
- v5.6 v5 index consistency validation：机器检查 v5.0-v5.6 阶段文档、schema、脚本、顶层索引和 `.agent_board` 一致性。
- v5.7 local batch commit-readiness preflight：只读检查当前本地未提交批次的 tracked 修改、新文件、staged 状态和版本动作授权门。
- v5.8 handoff freshness validation：机器检查 `.agent_board` 续跑材料是否共同指向当前阶段，并保留硬停止门、远端动作授权门和 no-execution 边界。
- v5.9 expanded v5 index consistency validation：把 v5 index consistency validation 覆盖范围扩展到 v5.0-v5.9。
- v5.10 local true-loop candidate delivery closeout：收束本地 v1.0 真实闭环候选交付，记录 v5.9 本地提交、审查修复和交付授权边界。
- v5.11 post-merge reconciliation：记录 PR #2 已合并、本地 `master` 已同步到 `origin/master`、v5.10 交付 tag 已推送，并把 `.agent_board` 切换到合并后状态。
- v5.12 release candidate readiness：把真实闭环候选整理成最终交付候选包，并机器检查 release readiness、final acceptance、true-loop closeout、GitHub intake 和安全边界。
- v7.40 local A4/A5 autonomy mode alignment：把项目默认本地自动化提升为 `A4 — Sustained Local Autopilot`，并把 `A5 — Autonomous Production Execution` 固化为必须依赖独立授权包的真实生产执行模式。
- v7.41 external remote-debug verification script creation record：把原 v7.39 指向的脚本创建记录重新落位，确认真实 remote-debug 脚本仍未创建，并把后续创建授权包要求机器化。
- v7.42 external remote-debug verification script creation authorization package：把未来创建真实 remote-debug 脚本所需的未激活授权包模板、禁止动作、验证要求、回滚路径和停止条件固化下来。
- v7.43 external remote-debug verification script creation execution record：在明确授权下创建 dry-run-only remote-debug smoke 脚本，并记录脚本未运行、VCPChat 未启动、CDP 未访问。
- 只读校验脚本 `scripts/validate_mvp.ps1`。

仍未完成：

- VCPChat 子窗口接入。
- DailyNote / VCP 长期记忆真实写入。
- 正式 release 发布和后续版本 tag 策略。
- 后续更多真实图片生成、编辑、归档。

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

当前已完成一次仓库内草案 manifest 的授权脱敏读取，记录位于 `integrations/vcp/phase_c_manifest_sanitized_review_record.md`。该记录只允许进入 Phase D dry-run 设计评估，不代表真实插件选择、dry-run 已执行或真实执行授权。

v0.6 已在用户授权下完成一次单一真实生图插件 manifest 的只读脱敏审查，记录位于 `integrations/vcp/v0_6_real_plugin_manifest_sanitized_review.md`。该记录可把候选推进到 `manifest_reviewed_safe`，但不代表 dry-run 已完成、插件已选择或真实执行已授权。

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

当前已有项目内实验实现 `adapter_dry_run_lab/adapter_dry_run.js`，只读 JSON fixture 并向 stdout 输出 dry-run 草案；它不是 VCP 插件，不写文件、不调用插件、不调用 API。

v0.5 已在用户授权下把 `exports/vcptoolbox/Plugin/AgentImageLabAdapter/` 的 Adapter-only dry-run 包安装到 VCPToolBox 预发布候选工作线中验证，记录位于 `integrations/vcp/v0_5_adapter_install_verification.md`。该验证只证明 `dry_run` 可返回草案，不代表真实插件选择或真实执行授权。

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

1. 运行完整校验，确保文档、Adapter、Review Console、agent board、执行记录和 v5.12 release candidate readiness 均通过。
2. 保持本地默认 `A4 — Sustained Local Autopilot`，继续推进 docs/schema/dry-run/authorization/static prototype/validation 安全面。
3. 等待用户单独授权任何新的 A5 真实生产动作、tag、push 或正式 release 发布。
4. 下一步 remote-debug 脚本执行、VCPChat 启动或 CDP 访问已经到达明确审批边界；没有用户批准时继续停在 no-execution / no-external-read 轨道。
5. 后续任何新增真实生图调用或真实 remote-debug 脚本创建都必须重新确认目标、允许文件、禁止动作、验证要求和回滚方案，并形成 active authorization package。

## 永久安全门

任何阶段都不能绕过以下规则：

- 不复制密钥、token、cookie、密码、私密路径或客户隐私。
- 不把图片二进制写入 Git 或 VCP 长期记忆。
- 不把英文提示词作为 DailyNote 正文。
- 不让子 Agent 直接批准核心风格记忆。
- 不让 Review Console renderer 直接调用 DailyNote、插件、API 或文件写入。
- 不把 `tested` 理解为真实执行授权。
