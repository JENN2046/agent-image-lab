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
Latest visible remote baseline before v7.257: 5d3c127 on master == origin/master.
Current mainline state: v7.257 static Review Surface quality stop or next product decision gate（静态审片台质量停止或下一产品决策门）.
Board calibration: v7.222 completed and pushed.
Task selection: v7.223 read-only review selected v7.224 mainline status freshness alignment as the only safe next task.
Current status: failed_no_image_repeated_quota_or_rate_limit.
same_provider_retry_allowed_now: false.
A5_execution_allowed_now: false.
provider_contact_allowed_now: false.
Native Doubao static hardening: syntax/path sandbox/base URL/raw output/env allowlist/validator drift patched.
Diagnostic decision: continue_generation_stop_until_route_selection.
Provider path decision: ROUTE-3-CONTINUED-STOP（路线 3：继续停止生成）selected now; Route 1 quota resolution and Route 2 provider/model/account switch remain available only after explicit human selection.
Review Surface mainline: static HTML mockup now exposes accepted_final as an explicit future_blocked status, and the static Review Surface track has reached A4 quality stop.
route_selection_required_before_new_A5: true.
Recommended next: v7.258_product_workflow_fixture_packet_gate（产品图工作流纸面样例包门）.
Master plan index: PROJECT_MASTER_PLAN.md.
Historical baseline: v1.0 true-loop closeout candidate + v10.28 DailyNote canonical location guard + Runtime Review sustained autopilot chain complete (9A→10C→final checkpoint, 7/7) + Smart Commander portable support model complete (v7.199→v7.203) + Static Review Console mockup quality stop reached (v7.205→v7.212) + Provider fingerprint preparation complete/inactive (v7.214→v7.216) + Release readiness delta quality stop (v7.219)
```

当前工作分支：

```text
master tracking origin/master
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
- v7.44 remote-debug script run and VCPChat launch record：在明确授权下运行 dry-run-only 脚本并启动 VCPChat，同时记录 CDP 未访问、bridge 未调用。
- v7.45 CDP read-only attempt record：在明确授权下尝试本机 CDP 只读访问；当前 VCPChat 未暴露可用 CDP endpoint，Runtime.evaluate 未执行。
- v7.46 remote-debug relaunch runtime verification record：在明确授权下关闭旧 VCPChat/Electron 进程，以 remote-debug 端口重启 VCPChat，读取 CDP targets，并执行一次只读 Runtime.evaluate surface 检查；bridge 方法未调用。
- v10.0 A5 end-to-end activation package readiness：接收单批 A5 授权包并执行 preflight；因外部 VCPChat / VCPToolBox 工作树不干净而停止，真实生产步骤未启动。
- v10.1 A5 resume after external worktree reconciliation：记录用户已报告外部目标工作树干净，并固化恢复前必须重新执行 A5 preflight 的接续条件；本阶段未执行真实生产步骤。
- v10.2 A5 bridge smoke blocked record：重新执行 A5 preflight 并启动 remote-debug 运行时；preflight clean，但当前 VCPChat 未暴露 `imageLabReview` bridge，`cancel` 未调用，真实生产链路停止。
- v10.3 A5 bridge integration smoke record：在授权 VCPChat 文件集中添加 no-write `imageLabReview` bridge，严格 allowlist-only smoke 中 `cancel/loadSession/previewDraft` 通过；因初始 `submitDraft` rejected probe 偏差，DoubaoGen 继续执行前需要人工复核。
- v10.4 A5 DoubaoGen single generation rejected asset record：人工复核后继续 A5 生产链路，DoubaoGen 实际调用 1 次并生成 1 个资产；自动审片发现可读文字和类似 logo/标记，资产拒收，DailyNote / VCP memory 写入被阻断。
- v10.5 A5 DoubaoGen no-text retry rejected asset record：更强无文字约束下执行一次 DoubaoGen 重试，实际调用 1 次并生成 1 个资产；自动审片发现人物/脸、可读文字、logo/品牌标识和设备品牌标记，资产拒收，记忆写入继续阻断。
- v10.6 A5 prompt failure analysis and safer strategy：归档 v10.4 / v10.5 prompt 失败原因，明确 v10.5 prompt 模板由 agent 给出且设计失败；下一次真实调用前必须先展示更安全的正向静物 prompt 草案。
- v10.7 A5 safer prompt review package：把候选 prompt 收束为 `a5_positive_still_life_prompt_v1` 并执行触发词扫描；本阶段不真实生图，下一步必须由用户确认 prompt 并单独授权。
- v10.8 A5 positive still-life generation preflight gate：把 `a5_positive_still_life_prompt_v1` 锁定为下一次真实生成前的候选 prompt，并把 prompt approval、单独授权字段、输出目录、回滚和 no-execution guard 机器化；本阶段不真实生图。
- v10.9 A5 positive still-life generation rejected asset record：在短批准模板和私有 ignored PluginDir 绑定通过 preflight 后执行一次 DoubaoGen 真实生成；实际调用 1 次并生成 1 个资产，但本地审片发现人物/脸和 prompt 主题偏离，资产拒收，记忆写入继续阻断。
- v10.10 A5 prompt handoff diagnostic preflight：把 v10.9 失败原因拆成模型遵循失败和插件请求传递失败两个待诊断方向，准备无生图、0 插件调用的脱敏传参诊断门；本阶段不读取 PluginDir / `config.env`，不调用插件/API，不创建图片。
- v10.11 A5 prompt handoff diagnostic result：在用户批准无生图传参诊断后，确认锁定 prompt hash 匹配、本地 runner payload prompt 来源为 InputReference，且没有执行插件/API/图片；provider 侧请求仍未观测。
- v10.12 A5 provider-side prompt fingerprint capture authorization package：准备 provider-side echo / sanitized request capture 授权包，目标是只验证 provider 侧收到的 prompt 指纹；当前为未激活授权包，不执行 provider echo、不调用插件/API、不创建图片。
- v10.26 real DailyNote/VCP memory write closeout：记录 v10.25 使用 DailyNoteWrite 完成一次真实写入，actual_write_calls=1，保存文件名/sha256 已脱敏记录，单次授权已消耗。
- v10.27 DailyNoteWrite root path correction：修正未来 DailyNoteWrite 写入根目录分类，从 `plugin_dir_dailynote` 改为 `vcp_root_dailynote`，并通过 no-write recomputation 验证。
- v10.28 DailyNote canonical location guard：固化后续 DailyNote 写入成功判定，要求 canonical file 存在和 hash 匹配，插件 `success` 不能单独判定完成。
- v7.199-v7.203 Smart Commander 支持层收束：AGENTS 精简固化、portable protocol、reuse package index、external adoption readiness 和 portable release candidate 已完成；该支线只改善本地 docs-only 指挥/审查/提交模型，不授权 A5、runtime、plugin/provider、image 或 memory，不再作为主线继续调教。
- v7.205 Static Review Console mockup spec：回到产品主线，完成静态 Review Console mockup 的 screen inventory、region specification、static data contract、interaction specification、review states 和 no-execution 边界；仍不创建 renderer/preload/IPC/runtime 代码。
- v7.206 Static Review Console mockup file：创建离线 standalone HTML mockup `review_console/static_mockups/v7_206_static_review_console_mockup.html`；仅供本地视觉检查，不引用外部资产或脚本，不导入 runtime，不接 VCPChat/VCPToolBox。
- v7.208-v7.209 Static mockup decision and cleanup：根据只读审查选择 product copy cleanup + light visual polish，补齐 generation_result_recorded、closeout_ready_or_blocked、asset_rejected 可见状态和 disabled action reason；仍不进入 runtime。
- v7.211-v7.212 Static mockup accessibility review and patch：完成静态 accessibility/readability 审查和小补丁，关联 disabled action reason，改善 static contract grouping semantics，静态 mockup 达到 quality stop。
- v7.214-v7.216 Provider fingerprint preparation：static mockup 后重新审查主线 backlog，选择 v10.12 provider-side prompt fingerprint capture 作为下一高价值准备项；完成 readiness review 和 activation briefing，但明确停止在 inactive package，不进入 A5/provider/plugin/image/memory。
- v7.219 Release readiness delta：说明 v1.0 release readiness baseline 与当前 post-v7.217 状态的差异；当前新增的是治理、静态审片台清晰度和 provider diagnostic 准备，不是 release/tag/A5 授权。
- Runtime Review follow-up requirements audit：梳理审片台下一步本地交付需求，优先处理 accepted candidate delivery package draft 和 memory completion state split。
- Runtime Review follow-up Batch 2A/2C：在 runtime prototype 中实现 accepted candidate delivery package draft 和 human override traceability draft，并把 no-write guard、UI、session export、smoke 和 delivery surface validation 同步。
- Runtime Review follow-up Batch 2B：在 runtime prototype 中实现 memory completion state split，把写入请求、写入授权、真实执行、canonical location 校验、hash 匹配和 `plugin_success_sufficient=false` 拆开。
- Runtime Review long task delivery plan：把后续长任务拆成 Batch 3A 到 Batch 8A，并明确 A4 本地任务、A5/真实写入/远端版本动作授权门、验收标准和停止条件。
- Runtime Review Batch 3A/3B/3C：在 runtime prototype 中实现 inactive authorization capsules、runtime review state convergence 和 local commit scope plan；所有新增面仍保持 no-execution、no-stage、no-version-action。
- Runtime Review Batch 4A：在 runtime prototype 中实现 bridge mock roundtrip candidate，用项目内 `loadSession` / `previewDraft` mock 证明 no-write 交接，`submitDraft` 和真实 CDP/bridge 仍禁止。
- Runtime Review Batch 4B/5A/6A：在 runtime prototype 中实现真实 bridge 授权包草案、prompt reliability/model lock 草案和 memory write completion candidate；所有新增面仍保持 no-execution、no-plugin、no-memory-write。
- Runtime Review Batch 5B/6B/7A：在 runtime prototype 中实现真实重试授权门、真实记忆写入授权包和 no-binary 资产归档候选；所有新增面仍保持 no-execution、no-plugin-call、no-memory-write、no-image-create。
- Runtime Review Batch 8A：把 Runtime Review follow-up 累积工作收束为本地 release-candidate proposal 和提交范围清单；仍不执行 commit/tag/push/PR/release。
- Runtime Review Batch 8A post-merge checkpoint：记录 PR #6 已合并，本地 `master` 已同步到 `origin/master` 的 `563ccc4`，并确认 legacy `runtime_review_session_v1` import compatibility fix 已进入主线。
- Runtime Review Batch 8B vNext RC acceptance：把 post-merge checkpoint 上的当前本地 master 收束成下一轮 release-candidate 接受基线；不触发版本动作。
- Runtime Review Batch 8C final acceptance summary：把 8A / 8B 的收束结果归并为最终可读 acceptance 摘要；不触发版本动作。
- Runtime Review Batch 8D sustained autopilot task plan：把后续任务拆成默认自动队列和条件自动队列；A4/A4.5 本地任务满足条件自动执行，真实执行、外部读取、记忆写入和版本动作只有在具体 active authorization package 与 preflight 通过后自动执行到授权上限。
- Runtime Review Batch 9A state freshness index：把当前阶段统一到 `docs/226_runtime_review_batch_9a_state_freshness_index.md`，并通过 `scripts/validate_runtime_review_batch_9a_state_freshness.js` 检查 README、roadmap、manifest、release notes、validation checklist 和 `.agent_board` 是否一致。
- Runtime Review Batch 9C operator runbook and resume capsule：新增 `docs/227_runtime_review_batch_9c_operator_runbook_and_resume_capsule.md`，把当前阶段、安全下一步、硬停止门、验证命令和版本动作状态收束成五分钟续跑入口。
- Runtime Review Batch 9B runtime session compatibility matrix：新增 `docs/228_runtime_review_batch_9b_runtime_session_compatibility_matrix.md`、legacy/current 两个 `runtime_review_session_v1` fixture 和 validator，固定旧版缺省字段与当前 draft-rich guard 的兼容规则。
- Runtime Review Batch 10B end-to-end dry-run replay index：新增 `docs/229_runtime_review_batch_10b_end_to_end_dry_run_replay_index.md` 和 `scripts/validate_runtime_review_batch_10b_dry_run_replay_index.js`，把 Adapter dry-run → Review Console → mock bridge → session export 的完整回放路径做成可索引、可校验链。
- Runtime Review Batch 10A release-candidate acceptance matrix：新增 `docs/230_runtime_review_batch_10a_release_candidate_acceptance_matrix.md`，把 bridge、plugin、asset archive、memory lifecycle、runtime prototype、validator suite、operator docs 和 release readiness 八个领域收束成结构化验收矩阵。
- Runtime Review Batch 10C future A5 authorization package consolidation：新增 `docs/231_runtime_review_batch_10c_future_a5_authorization_package_consolidation.md`，把 bridge、plugin、asset review、DailyNote/VCP memory、rollback、forbidden outputs 和 version actions 七个领域的 preflight 字段合并到一个可填入模板。
- Runtime Review final local checkpoint — sustained autopilot chain closeout：新增 `docs/232_runtime_review_final_local_checkpoint_sustained_autopilot_chain_closeout.md`，汇总 7 个 batch 的完整交付物、worktree 状态和 commit/push 就绪条件。
- Phase E VCPChat subwindow integration preparation：新增 `review_console/phase_e_vcpchat_subwindow_integration_task_plan.md`、`review_console/phase_e_ipc_contract_draft.md`、`review_console/phase_e_security_acceptance_checklist.md`（77 项检查），完成子窗口接入任务书、IPC 契约和安全验收清单。
- Phase F MVP-B controlled real execution：已完成 F1→F8 全流程。2 次 DoubaoGen 人像生图（双图 accepted_candidate），Bridge smoke 通过（VCPChat v4.4.2，4 通道 0 side effects）。收束记录：`review_console/phase_f_f8_closeout_record.md`
- Tag and version strategy：新增 `docs/233_tag_and_version_strategy.md`，定义 tag 命名规范、版本号策略和 release 发布条件。
- v6.0 Product Runtime Kickoff：Task Panel、Asset Index、Session Store 三层叠加到 Review Console。`docs/236_v6_0_product_runtime_kickoff.md`
- v6.1 Task Panel Interaction：Task Panel 实现可交互表单（6 inputs/selects），runtime_guard 校验，smoke test 覆盖。`docs/237_v6_1_task_panel_interaction.md`
- v6.2 Asset Index Interaction：Asset Index 从只读展示变成可本地编辑、筛选、索引的 draft-only 资产索引面板。`docs/238_v6_2_asset_index_interaction.md`
- v6.3 Session Store Interaction：Session Store 从只读展示变成可交互草案管理面板——current_session 展示、linked_task_id/asset_refs 输入、import_preview 5 状态选择、restore_candidate 切换、session_list 草案。闭合 Task/Asset/Session 三角底座。`docs/239_v6_3_session_store_interaction.md`
- v6.4 Memory Queue Interaction：记忆草案队列——approval_status 切换、reviewer_role、should_write_to_vcp 意图、block/reject reason、队列计数。`docs/240_v6_4_memory_queue_interaction.md`
- v6.5 Review Console Product Shell：全产品壳布局（左栏→顶栏→工作区→裁决栏→底栏），审片驾驶舱升级。`docs/241_v6_5_review_console_product_shell.md`
- v6.6 Product Shell QA + Visual Polish：v6.5 产品壳质量复查、布局修整、可读性优化、视觉一致性、裁决栏验收加固。`docs/242_v6_6_product_shell_qa_visual_polish.md`
- v6.7 Product Runtime Final Acceptance Baseline：把 v6.1～v6.6 收束成 v6 Product Runtime Baseline。`docs/243_v6_7_product_runtime_final_acceptance.md`，validator `scripts/validate_v6_7_product_runtime_final_acceptance.js`（33 checks）
- v6.8 Plugin Dashboard Draft Surface：Plugin Selector、Parameter Mapper、Dry-run Toggle、Dispatch Status 四个区块和 dispatch_plan_draft 数据结构。`docs/245_v6_8a_plugin_dashboard_draft_surface.md`，validator `scripts/validate_v6_8_plugin_dashboard.js`（30 checks）
- v6.8B Plugin Dashboard Guard Hardening：runtime_guard 新增 `v6DispatchPlanIsSafe()`。`docs/246_v6_8b_plugin_dashboard_guard_hardening.md`，validator `scripts/validate_v6_8b_plugin_dashboard_guard_hardening.js`（18 checks）
- v6.9 Release Panel Planning：发布面板规划书。`docs/247_v6_9_release_panel_plan.md`，validator `scripts/validate_v6_9_release_panel_plan.js`（15 checks）
- v6.9A Release Panel Draft Surface：Release Panel 面板实现。`docs/248_v6_9a_release_panel_draft_surface.md`，validator `scripts/validate_v6_9a_release_panel_draft_surface.js`（17 checks）
- v6.9B Release Panel Guard Hardening：runtime_guard 新增 `v6ReleaseReadinessIsSafe()`。`docs/249_v6_9b_release_panel_guard_hardening.md`，validator `scripts/validate_v6_9b_release_panel_guard_hardening.js`（12 checks）
- v6.10 Product Runtime RC Readiness Matrix：全模块验收矩阵。`docs/250_v6_10_product_runtime_rc_readiness_matrix.md`，validator `scripts/validate_v6_10_product_runtime_rc_readiness_matrix.js`（8 checks）
- Validator Quality Gate：v6 validators 质量 meta 检查。`docs/251_v6_validator_quality_gate.md`，validator `scripts/validate_v6_validator_quality_gate.js`（8 checks）
- v6 Operator Runbook + Resume Capsule：运维手册与续跑胶囊。`docs/252_v6_product_runtime_operator_runbook.md` + `docs/253_v6_10_resume_capsule.md`，validator `scripts/validate_v6_operator_runbook_and_resume_capsule.js`（14 checks）
- v7.0 Real Production Landing Preflight：真实生产落地预案 + A5 授权包模板。`docs/254_v7_0_real_production_landing_preflight.md` + `docs/255_v7_0_a5_single_generation_authorization_template.md`，validator `scripts/validate_v7_0_real_production_landing_preflight.js`（20 checks）
- v7.1 Single Real Generation Controlled Run Package：单次真实生成受控运行包。`docs/256`，validator `validate_v7_1.js`（13 checks）
- v7.2 Generation Failure Taxonomy + Retry Policy：失败分类（11 类）+ 重试策略。`docs/257`，validator `validate_v7_2.js`（16 checks）
- v7.3 Asset Acceptance Gate：资产验收门 + gate checklist。`docs/258`，validator `validate_v7_3.js`（17 checks）
- v7.4 Memory Write Gate Package：记忆写入闸门（需独立 A5 授权）。`docs/259`，validator `validate_v7_4.js`（9 checks）
- v7.5 Production Run Dry Run Prep：生产运行 dry-run 准备 + A5 激活清单。`docs/260` + `docs/261`，validator `validate_v7_5.js`（24 checks）
- v7.6 Single Real Generation Activation Package：A5 激活包 + 操作员确认清单。`docs/262` + `docs/263`，validator `validate_v7_6.js`（25 checks）
- v7.7 Single Real Generation Activation Readiness Check：准备就绪确认。`docs/264`，validator `validate_v7_7.js`（12 checks）
- v7.8 A5 Template + Prompt Library Separation：提示词库（20 包）+ A5 统一模板。
- v7.9 Prompt Library + A5 Activation UX Polish：选择指南 `docs/266` + 中文 UX 优化。validator `validate_v7_9.js`（16 checks）
- v7.34 3-shot Stability Test Plan：3-shot 稳定性测试计划。`stability_tests/` + `docs/289` + validator `validate_v7_34.js`（51 checks）。plan_only, no-execution。
- 只读校验脚本 `scripts/validate_mvp.ps1`。

仍未完成：

- VCPChat 子窗口接入（Phase E 任务书已完成，Phase F Bridge smoke 已验证通过 VCPChat v4.4.2）。
- 后续 DailyNote / VCP 长期记忆写入仍需单独授权。
- 正式 release 发布仍需单独授权（tag 策略已定义：`docs/233_tag_and_version_strategy.md`）。
- 后续更多真实图片生成需新 A5 授权包（Phase F 已消耗 2/2 calls，双图 accepted）。
- version actions 需要匹配当前授权和 preflight；v7.224 只允许白名单 docs/status 文件的 commit + push。
- Product image A5 path 已进入 repeated quota/rate-limit stop；Native Doubao static syntax / sandbox 已硬化；v7.257 判断静态审片台已达到 A4 quality stop。下一步不自动重试生成，应创建产品图工作流纸面样例包。

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

- 形成 VCPChat 子窗口接入任务书。`review_console/phase_e_vcpchat_subwindow_integration_task_plan.md`
- 形成 IPC 契约草案。`review_console/phase_e_ipc_contract_draft.md`
- 形成安全验收清单。`review_console/phase_e_security_acceptance_checklist.md`（77 项检查）
- 三项交付物已在本 Phase E 完成；不修改真实 VCPChat，不创建真实 IPC handler。

### Phase F：MVP-B 受控真实执行 ✅ 已完成

状态：**已完成**（2026-05-08）。收束记录：`review_console/phase_f_f8_closeout_record.md`

执行摘要：
- F1 Preflight ✅ → F2 Bridge Smoke ✅ (VCPChat v4.4.2, 4 通道) → F3 Adapter ✅ → F4 生图 x2 ✅ (DoubaoGen, both success) → F5 审片 ✅ (双图 accepted) → F6 Memory Draft ✅ → F7 ⏭️ (memory write not authorized) → F8 Closeout ✅
- 2 张人像均 accepted_candidate，run_1 为首选。
- 授权包已消耗（2/2 calls），再次生图需新 A5 授权。
- Review Console 可人工评分和审批。
- 资产只保存路径引用和摘要，不把图片二进制写入长期记忆。
- memory_delta 只生成写入申请，不绕过审批写 DailyNote。

## 当前优先队列

1. v7.243_product_image_active_authorization_package_skeleton_gate 已完成，一页版 preflight-pending 授权草案已整理完成。
2. 下一步只允许运行 active A5 preflight，不得直接生成图片。
3. A5/provider/runtime/image/memory 仍未执行；如需推进，必须先让 preflight 通过，再单独确认是否执行。
4. tag/release/deploy 仍未授权；任何版本动作都必须匹配当前授权、白名单和 push safety gate。
5. 若下一步仍为 A4，必须说明新的产品价值、写集、验证方式和 agent_board_freshness 检查。

## 永久安全门

任何阶段都不能绕过以下规则：

- 不复制密钥、token、cookie、密码、私密路径或客户隐私。
- 不把图片二进制写入 Git 或 VCP 长期记忆。
- 不把英文提示词作为 DailyNote 正文。
- 不让子 Agent 直接批准核心风格记忆。
- 不让 Review Console renderer 直接调用 DailyNote、插件、API 或文件写入。
- 不把 `tested` 理解为真实执行授权。
