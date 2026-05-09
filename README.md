# Agent Image Lab

Agent Image Lab 是一个接入 VCP 生态的视觉生产调度系统。它不重新造生图插件，也不重新造记忆系统，而是把 VCP 的生图 / 编辑插件、VCPChat 的窗口能力、VCP 的长期记忆系统组织成一条可评审、可迭代、可归档、可沉淀的视觉生产线。

## 当前状态

当前仓库处于：

```text
v6.7 Product Runtime Final Acceptance Baseline — v6.1~v6.6 consolidated into v6 Product Runtime Baseline. Accepted and pushed to origin/master (2b75fcb).
v6.8 Plugin Dashboard — Plugin Selector, Parameter Mapper, Dry-run Toggle, Dispatch Status added as draft-only surfaces. No real plugin execution.
v6.8B Plugin Dashboard Guard Hardening — v6DispatchPlanIsSafe() added to runtime_guard.js. Safety fields verified (dry_run_required, execution_blocked, max_plugin_calls, etc).
v6.9 Release Panel Planning — release_readiness_draft spec and implementation roadmap defined.
v6.9A Release Panel Draft Surface — Release Panel with commit/validator/readiness status, all safety fields locked.
v6.9B Release Panel Guard Hardening — v6ReleaseReadinessIsSafe() added to runtime_guard.js.
v6.10 Product Runtime RC Readiness Matrix — Full module matrix with status/validator/guard/boundary.
Validator Quality Gate — Meta-validator checks all v6 validators for quality.
v7.0 Real Production Landing Preflight — Preflight plan, A5 authorization template, failure taxonomy, rollback strategy defined. No real execution.
v7.1 Single Real Generation Controlled Run Package — Controlled run package with inactive authorization.
v7.2 Generation Failure Taxonomy + Retry Policy — 11 failure categories, strict retry policy (no auto retry).
v7.3 Asset Acceptance Gate — Asset statuses, gate checklist, memory/DailyNote write boundaries.
v7.4 Memory Write Gate Package — Memory write gate requiring separate A5 authorization.
v7.5 Production Run Dry Run Prep — Dry-run prep, A5 activation checklist, operator pre-flight checklist.
v7.6 Single Real Generation Activation Package — A5 activation package, operator activation checklist, pre-flight requirements.
v7.7 Single Real Generation Activation Readiness Check — Readiness check confirming all prerequisites met for first real A5 generation.
v7.8 A5 Template + Prompt Library Separation — Prompt library (20 packages), A5 unified template, schemas, runbooks.
v7.9 Prompt Library + A5 Activation UX Polish — Selection guide, Chinese UX polish, activation form with PluginDir manual confirmation.
v7.34 3-shot Stability Test Plan — First 3-shot stability test plan targeting French Summer Rattan Bag v2 watermark-off prompt. Plan only, no execution.
v7.44 Production Closeout — v3 production readiness closeout completed. 3/3 accepted_candidate, support-logic stable_pass. stable_candidate. No further stability testing.
v7.45 Production Usage SOP — one-image production policy defined. Allowed use: single_image_production_candidate, controlled_product_still_life_generation, human_reviewed_delivery_candidate.
v7.46 One-Shot A5 Template — reusable single-image A5 authorization template added. Fields: model, watermark, api_calls, retry, batch, output, review, commit, push, memory.
v7.47 Human Review Checklist — production human review gates added. 10 core gates + 6 v3 support-logic gates + 4 asset statuses.
v7.48 Project State Sync Pack — repository entry state aligned with v3 production candidate readiness.
v7.49 VCP Integration Readiness Pack — VCP integration layers, memory-write boundary, case_summary schema, and execution roadmap defined. Docs-only. No VCP call. No memory write.
v7.50 VCP Read-only Bridge Planning — read-only bridge planning, contract, security gates, and validation plan defined. Docs-only. No VCP call. No memory write. No bridge execution.
v7.51 Production Candidate Plan — first French Summer Rattan Bag v3 production candidate plan created. Docs-only. No image generation. No API call. v7.52 requires independent A5.
v7.54 Memory Delta Candidate Draft — memory_delta_candidate draft created for production candidate 001. Docs-only. No DailyNote write. No VCP memory write. Current write decision: do_not_write.
v7.55 Memory Write Authorization Package — DailyNote / VCP memory write authorization package created for production candidate 001. Package status: prepared_not_granted. No DailyNote write. No VCP memory write. authorization_decision: do_not_write_now.
v7.56 Memory Write Skip / Closeout Note — production candidate 001 closed with no DailyNote or VCP memory write. Final decision: skip_memory_write / closed_no_memory_write. Docs-only. No VCP call. No memory write.
```

current_prompt_package: product_still_life_french_summer_rattan_bucket_bag_bicycle_no_watermark_v3
production_readiness: candidate_ready_with_manual_visual_review
stability_status: stable_candidate
batch_dry_run_required_now: false
further_stability_testing_required_now: false
next_real_generation_requires_independent_a5: true

已经完成：

- v0.5 用户授权的 VCPToolBox Adapter-only dry-run 安装验证。
- v0.6 用户授权的单一真实生图插件 manifest 只读脱敏审查。
- v0.7 Gatekeeper 风险边界、Review Console 人工审批前置记录和真实执行前确认表。
- v0.7.1 Photo Studio OS 0 调用 dry-run rehearsal。
- v0.7 Photo Studio OS 首次真实执行记录，技术成功但资产拒收。
- v0.9 Photo Studio OS 重试记录和生图插件候选扫描。
- v0.10 GPTImageGen 尝试记录，因插件凭据阻断未产出图片。
- v0.10 DoubaoGen 重试真实执行，用户人工接受为可进入下一阶段的项目封面资产。
- v3.9 Review Console runtime prototype 共享 guard 抽取，并已打 `v3.9-runtime-guard-extraction-baseline` tag。
- v4.0 runtime smoke test 读取 `index.html` 实际脚本顺序，验证共享 guard API，防止页面加载契约漂移。
- v4.1 runtime guard unit harness 直接验证共享 guard 的拒绝策略、默认值和审批规则。
- v4.2 runtime validation suite 聚合 runtime 原型语法检查、guard unit 和 smoke test。
- v4.3 安装 Agent Image Lab autopilot overlay，并同步 `.agent_board` 续跑状态。
- v4.4 agent board state validation 机器检查 `.agent_board` 的硬停止门、handoff 和验证快照。
- v4.5 local checkpoint readiness 机器检查 v4.0-v4.5 本地 checkpoint 文件、看板状态、验证快照和 commit/tag/push 门。
- v4.6 local commit scope manifest 机器检查 v4.0-v4.6 本地批次的 changed-file allowlist，且不执行 staging。
- v4.7 post-push state reconciliation 记录 v4.6 已推送基线，并把 `.agent_board` 切换到新的本地续跑批次。
- v4.8 v4 index consistency validation 机器检查 v4.0-v4.8 阶段文档、schema、脚本和顶层索引一致性。
- v4.9 local tag push-readiness preflight 记录本地 v4.8 commit/tag 已就位，远端 push 仍需单独授权。
- v5.0 post-merge delivery readiness index 记录 PR #1 已合并、本地 `master` 已同步到 `origin/master`，并收束交付验收入口。
- v5.1 runtime delivery surface validation 机器检查 Review Console runtime prototype 的本地交付面、脚本顺序、DOM surface、host ack 和无外部副作用边界。
- v5.2 adapter delivery surface validation 机器检查 Adapter dry-run lab 和 VCPToolBox 导出级 dry-run 包的 manifest、stdio、fixture 和 no-execution guard。
- v5.3 review console adapter handoff validation 机器检查 Adapter dry-run accepted fixture 能以 no-execution handoff 草案进入 Review Console static prototype。
- v5.4 local sync readiness preflight 机器检查本地 `master` 相对 `origin/master` 的领先提交链，并保留 push/tag/PR/release 独立授权门。
- v5.5 post-commit reconciliation checkpoint 记录 v5.4 已落成本地 commit `a2ae539`，并把当前本地领先提交链更新为 4 个提交。
- v5.6 v5 index consistency validation 机器检查 v5.0-v5.6 文档、schema、脚本、顶层索引和 `.agent_board` 一致性。
- v5.7 local batch commit-readiness preflight 只读检查当前本地未提交批次的 tracked 修改、新文件、staged 状态和版本动作授权门。
- v5.8 handoff freshness validation 机器检查 `.agent_board` 续跑材料是否共同指向当前阶段，并保留硬停止门和 no-execution 边界。
- v5.9 expanded v5 index consistency validation 把 v5 index consistency validation 覆盖范围扩展到 v5.0-v5.9。
- v5.10 local true-loop candidate delivery closeout 收束本地 v1.0 真实闭环候选交付，记录 v5.9 本地提交、审查修复和交付授权边界。
- v5.11 post-merge reconciliation 记录 PR #2 已合并、本地 `master` 已同步到 `origin/master`、v5.10 交付 tag 已推送，并把 `.agent_board` 切换到合并后状态。
- v5.12 release candidate readiness 把真实闭环候选整理成最终交付候选包，并机器检查 release readiness、final acceptance、true-loop closeout、GitHub intake 和安全边界。
- v7.40 local A4/A5 autonomy mode alignment 把项目默认本地自动化提升为 `A4 — Sustained Local Autopilot`，并把 `A5 — Autonomous Production Execution` 固化为必须依赖独立授权包的真实生产执行模式。
- v7.41 external remote-debug verification script creation record 把原 v7.39 指向的脚本创建记录重新落位，并明确真实 remote-debug 脚本仍未创建，后续创建需要 active A5 authorization package 或独立脚本创建授权包。
- v7.42 external remote-debug verification script creation authorization package 固化未来创建真实 remote-debug 脚本所需的未激活授权包模板，并把下一步真实脚本创建标记为需要明确审批。
- v7.43 external remote-debug verification script creation execution record 在明确授权下创建 `scripts/run_vcpchat_review_console_remote_debug_smoke.ps1`，但脚本未运行，VCPChat 未启动，CDP 未访问。
- v7.44 remote-debug script run and VCPChat launch record 在明确授权下运行 dry-run-only 脚本并启动 VCPChat，但 CDP 未访问、bridge 未调用。
- v7.45 CDP read-only attempt record 在明确授权下尝试本机 CDP 只读访问；当前 VCPChat 未暴露可用 CDP endpoint，`Runtime.evaluate` 未执行。
- v7.46 remote-debug relaunch runtime verification record 在明确授权下关闭旧 VCPChat/Electron 进程，以 remote-debug 端口重启 VCPChat，并完成一次 CDP 只读 `Runtime.evaluate` surface 检查；bridge 方法只确认存在性，没有调用。
- v10.0 A5 end-to-end activation package readiness 接收单批 A5 授权包并执行 preflight；因外部 VCPChat / VCPToolBox 工作树不干净而安全停止，真实生产步骤未启动，`github_release_allowed: false`。
- v10.1 A5 resume after external worktree reconciliation 记录用户已报告外部目标工作树干净，并把恢复真实 A5 前必须重新执行 preflight 的条件机器化；本阶段仍未调用 bridge、插件、API、DailyNote、VCP memory 或图片生成。
- v10.2 A5 bridge smoke blocked record 重新执行 A5 preflight 并启动 remote-debug 运行时；preflight clean，但当前 VCPChat 未暴露 `imageLabReview` bridge，`bridge_calls_observed: 0`，因此未继续 DoubaoGen、DailyNote、VCP memory、图片或版本动作。
- v10.3 A5 bridge integration smoke record 在授权 VCPChat 文件集内添加 no-write bridge surface；严格 allowlist-only smoke 中 `cancel/loadSession/previewDraft` 通过，`bridge_calls_observed: 3`，但因初始 smoke 曾做一次 `submitDraft` rejected probe，继续 DoubaoGen 前需要人工复核。
- v10.3 gate: `human_review_required_before_production_continuation=true`。
- v10.4 A5 DoubaoGen single generation rejected asset record 在人工复核后继续 A5 生产链路；DoubaoGen 实际调用 1 次，生成资产 1 个，但审片发现可读文字和类似 logo/标记，`asset_status: rejected`，因此 DailyNote / VCP memory 写入被阻断。
- v10.4 gate: `memory_write_blocked_by_asset_review=true`。
- v10.5 A5 DoubaoGen no-text retry rejected asset record 在更强无文字约束下重试；DoubaoGen 实际调用 1 次，生成资产 1 个，但审片发现人物/脸、可读文字、logo/品牌标识和设备品牌标记，`asset_status: rejected`，因此继续阻断记忆写入和版本动作。
- v10.5 gate: `person_or_face_detected=true`、`readable_text_or_logo_detected=true`。
- v10.6 A5 prompt failure analysis and safer strategy 归档 v10.4 / v10.5 失败原因，确认 v10.5 prompt 模板由 agent 给出且设计失败；下一次真实调用前必须先展示候选 prompt 给用户确认，本阶段不执行真实生图。
- v10.6 gate: `next_real_generation_allowed_by_this_record=false`、`prompt_preview_required_before_real_call=true`。
- v10.7 A5 safer prompt review package 把候选 prompt 收束为 `a5_positive_still_life_prompt_v1`，并用 validator 扫描确认 prompt 不含 OS/app/software/interface/UI/cover/logo/brand/screen/monitor/person/portrait 等英文触发词；本阶段仍不执行真实生图。
- v10.7 gate: `user_prompt_approval_required=true`、`next_real_generation_allowed_by_this_record=false`。
- v10.8 A5 positive still-life generation preflight gate 锁定 `a5_positive_still_life_prompt_v1` 的下一次授权前检查项；`prompt_locked_for_future_authorization=true`，且仍保持 `next_real_generation_allowed_by_this_record=false`。
- v10.8 gate: 必须先由用户批准 prompt，再单独给出真实生成授权字段；本阶段不执行插件、API、图片、记忆或版本动作。
- v10.9 A5 positive still-life generation rejected asset record 在短批准模板和私有 ignored PluginDir 绑定通过 preflight 后执行一次 DoubaoGen 真实生成；`actual_plugin_calls: 1`，生成资产 1 个，但审片发现人物/脸和 prompt 主题完全偏离，`prompt_subject_match: false`、`asset_status: rejected`。
- v10.9 gate: DailyNote / VCP memory 写入、追加生图、commit/tag/push/PR/release 均继续阻断。
- v10.10 A5 prompt handoff diagnostic preflight 把 v10.9 失败拆成“模型遵循失败”和“插件请求传递失败”两个待诊断方向，并准备无生图、0 插件调用的脱敏传参诊断门；`max_plugin_calls_allowed: 0`、`diagnostic_authorization_active: false`。
- v10.10 gate: 本阶段不读取 PluginDir / `config.env`，不调用插件/API，不创建图片，不写 DailyNote/VCP memory。
- v10.11 A5 prompt handoff diagnostic result 在用户批准 `批准 v10.10 传参诊断` 后执行无生图诊断；prompt hash 与锁定记录一致，项目内 runner 层未发现 prompt 改写，`actual_plugin_calls: 0`，但 provider 侧请求仍未观测。
- v10.11 result: `prompt_hash_matches_expected: true`、`provider_side_request_observed: false`，因此本地 prompt 写错基本排除，模型遵循失败或 provider/plugin 侧 handoff 问题仍需后续单独授权定位。
- v10.12 A5 provider-side prompt fingerprint capture authorization package 准备 provider-side echo / sanitized request capture 授权包，专门验证 provider 侧收到的 prompt 指纹。
- v10.12 gate: `authorization_status: inactive_package`、`execution_authorized_by_this_record: false`；激活口令为 `批准 v10.12 provider侧指纹捕获`，且仍禁止真实生成、图片输出、raw request/response/endpoint/log/secret 记录、DailyNote / VCP memory 和版本动作。
- v10.26 real DailyNote/VCP memory write closeout 记录 v10.25 单次真实写入已完成：actual_write_calls=1、writer 为 DailyNoteWrite、保存文件名和 sha256 已脱敏记录；单次授权已消耗，不授权第二次写入或版本动作。
- v10.27 DailyNoteWrite root path correction 修正未来 DailyNoteWrite 写入根目录分类：从 `plugin_dir_dailynote` 改为 `vcp_root_dailynote`；本阶段不重跑 writer、不再次写 DailyNote/VCP memory。
- v10.28 DailyNote canonical location guard 固化后续写入成功判定：`plugin_success_sufficient=false`，必须通过 canonical file 存在和 hash 匹配后才能标记 memory write complete。
- Runtime Review follow-up requirements audit 梳理下一步本地审片台交付需求：accepted candidate delivery package、memory completion state split、human override traceability 和 inactive authorization capsule generator。
- Runtime Review follow-up Batch 2A/2C 在 runtime prototype 中增加 accepted candidate delivery package draft 和 human override traceability draft，并用 guard / smoke / delivery surface 校验保持 no-write。
- Runtime Review follow-up Batch 2B 在 runtime prototype 中增加 `memory_completion_state_draft`，把写入请求、写入授权、真实执行、canonical location 校验、hash 匹配和 `plugin_success_sufficient=false` 拆开。
- Runtime Review long task delivery plan 把后续长任务拆成 Batch 3A 到 Batch 8A，明确哪些能本地 A4 推进，哪些必须等待 A5 / 真实写入 / 远端版本动作授权。
- Runtime Review Batch 3A/3B/3C 在 runtime prototype 中落地未激活授权胶囊、Runtime 状态收敛和本地提交范围计划；所有新增面仍由 guard/smoke/delivery surface 校验为 no-execution 草案。
- Runtime Review Batch 4A 在 runtime prototype 中落地 `bridge_mock_roundtrip_candidate_draft`，用项目内 mock 证明 Adapter dry-run handoff -> Review Console -> `previewDraft` 的 no-write 回环；`submitDraft`、真实 CDP/bridge、插件/API/记忆/图片动作仍禁止。
- Runtime Review Batch 4B/5A/6A 在 runtime prototype 中落地真实 bridge 未激活授权包、DoubaoGen prompt 可靠性草案和 memory write completion candidate；真实 bridge/CDP、插件/API、DailyNote/VCP memory、图片和版本动作仍禁止。
- Runtime Review Batch 5B/6B/7A 在 runtime prototype 中落地单次真实生图重试授权门、真实记忆写入授权包和 no-binary 资产归档候选；当前仍只允许本地草案，不调用 DoubaoGen、DailyNote/VCP memory 或创建图片。
- Runtime Review Batch 8A 把 Runtime Review follow-up 累积工作收束为本地 release-candidate proposal 和提交范围清单；当前不 stage、不 commit、不 tag、不 push、不开 PR。
- Runtime Review Batch 8A post-merge checkpoint 记录 PR #6 已合并，本地 `master` 已同步到 `origin/master` 的 `563ccc4`，并确认 legacy `runtime_review_session_v1` import compatibility fix 已进入主线。
- Runtime Review Batch 8B vNext RC acceptance 把 post-merge checkpoint 上的本地 master 收束成下一轮 release-candidate 接受基线，记录接受证据链，但不触发版本动作。
- Runtime Review Batch 8C final acceptance summary 把 8A / 8B 收束成最终可读 acceptance 摘要，便于交付前审阅和索引检查。
- Runtime Review Batch 8D sustained autopilot task plan 把后续工作拆成默认自动队列和条件自动队列：A4/A4.5 本地任务满足条件即自动执行；真实执行、外部读取、记忆写入和版本动作在具体 active authorization package 与 preflight 通过后自动执行到授权上限。
- Runtime Review Batch 9A state freshness index 把当前阶段统一到 `docs/226_runtime_review_batch_9a_state_freshness_index.md`，并用 validator 交叉检查 README、roadmap、manifest、release notes、validation checklist 和 `.agent_board` 的当前状态。
- Runtime Review Batch 9C operator runbook and resume capsule 提供五分钟续跑入口、安全下一步、硬停止门、验证命令和版本动作状态；它只指向条件自动化契约，不授权 A5 生产动作。
- Runtime Review Batch 9B runtime session compatibility matrix 固化 `runtime_review_session_v1` legacy minimal / current draft-rich 兼容规则，新增本地 fixture 和 validator，防止新增 draft surface 后误拒历史 v1 会话草案。
- Runtime Review Batch 10B end-to-end dry-run replay index 把 Adapter dry-run → Review Console → mock bridge → session export 的完整回放路径做成可索引、可校验链，新增本地 validator（11 项检查）。
- Runtime Review Batch 10A release-candidate acceptance matrix 把 bridge、plugin、asset archive、memory lifecycle、runtime prototype、validator suite、operator docs 和 release readiness 八个领域收束成结构化验收矩阵（25 行）。
- Runtime Review Batch 10C future A5 authorization package consolidation 把 bridge、plugin、asset review、DailyNote/VCP memory、rollback、forbidden outputs 和 version actions 七个领域的 preflight 字段合并到一个可填入模板。
- Runtime Review final local checkpoint 汇总 sustained autopilot chain（7/7）的完整交付物和 worktree 状态；commits 和 tags 已落成本地，push 待用户统一执行。
- Phase E VCPChat subwindow integration preparation（3 deliverables）：`review_console/phase_e_vcpchat_subwindow_integration_task_plan.md`、`review_console/phase_e_ipc_contract_draft.md`（4 IPC 通道、sender 校验、错误处理）、`review_console/phase_e_security_acceptance_checklist.md`（77 项检查，8 个域）。
- Phase F MVP-B controlled real execution task plan（1 deliverable）：`review_console/phase_f_mvp_b_controlled_real_execution_task_plan.md`（8 阶段执行计划、回滚策略、历史教训整合），已完成 2 次 DoubaoGen 人像生图（双图 accepted）。
- v6.0 Product Runtime Kickoff：Task Panel、Asset Index、Session Store 三层叠加到 Review Console。`docs/236_v6_0_product_runtime_kickoff.md`
- v6.1 Task Panel Interaction：Task Panel 实现可交互表单（6 inputs/selects），runtime_guard 校验，smoke test 覆盖。`docs/237_v6_1_task_panel_interaction.md`
- v6.2 Asset Index Interaction：Asset Index 从只读展示变成可本地编辑、筛选、索引的 draft-only 资产索引面板。`docs/238_v6_2_asset_index_interaction.md`
- v6.3 Session Store Interaction：Session Store 从只读展示变成可交互草案管理面板——current_session 展示、linked_task_id/asset_refs 输入、import_preview 5 状态选择、restore_candidate 切换、session_list 草案。闭合 Task/Asset/Session 三角底座。`docs/239_v6_3_session_store_interaction.md`
- v6.4 Memory Queue Interaction：记忆草案队列——approval_status 切换、reviewer_role、should_write_to_vcp 意图、block/reject reason、队列计数。`docs/240_v6_4_memory_queue_interaction.md`
- v6.5 Review Console Product Shell：左栏→顶栏→工作区→裁决栏→底栏全产品壳升级，审片驾驶舱布局。`docs/241_v6_5_review_console_product_shell.md`
- v6.6 Product Shell QA + Visual Polish：v6.5 产品壳质量复查、布局修整、可读性优化、视觉一致性、裁决栏验收加固。`docs/242_v6_6_product_shell_qa_visual_polish.md`

当前 accepted asset 只以 ignored runtime 路径和哈希归档，不把图片二进制写入 Git、DailyNote 或 VCP 长期记忆。人工接受记录保留了已知视觉偏差：这是 `human_override` 通过，不是完美 prompt compliance。
当前 A5 v10.4 / v10.5 / v10.9 新资产均被拒收，只保留 ignored runtime ref、哈希、评分和规则摘要；未把图片二进制写入 Git、DailyNote 或 VCP memory。

## 一句话定义

> 让 AI 生图从一次性出图，变成有审片、有审批、有归档、有中文记忆沉淀的视觉生产流程。

## 第一阶段主战场

Photo Studio OS UI 生图生产线，以及 AI 图片评审与修正生产线。

## 项目边界

- Agent Image Lab 是 VCP 原生视觉生产调度系统，不是普通 AI 生图工具。
- Adapter dry-run 默认保持 0 调用，不越权调用真实插件。
- 真实生图必须单独授权插件、命令、最大调用次数、输入引用、输出目录和回滚方案。
- DailyNote 写入正文必须中文；英文提示词只作为执行素材，并必须附中文解释。
- 子 Agent 在 MVP 阶段是岗位流程，但必须有记忆署名并输出 memory_delta。
- 核心风格记忆必须经过 ImageLab_Master / Archivist_Agent / 人工审核。
- 图片大文件不写入 VCP 长期记忆，只写摘要、路径引用、评分和规则。
- API key、token、cookie、私密路径、客户隐私禁止进入长期记忆。

## MVP 闭环

```text
用户视觉需求
→ task_envelope
→ director_plan
→ prompt_package
→ review_score
→ human_review
→ memory_delta
→ case_summary
```

## 目录导读

- `stability_tests/`：3-shot Stability Test Plan 目录，包含 registry、plan 和协议定义。
- `docs/00_project_roadmap.md`：从 v0.2 基线到 v1.0 true-loop closeout 的总路线图。
- `docs/20_real_loop_completion_plan.md`：从 v0.4 到 v1.0 的真实闭环完成计划。
- `docs/30_release_readiness_report.md`：当前 release readiness 结论。
- `docs/31_install_and_operation_guide.md`：安装、校验和操作指南。
- `docs/32_final_acceptance_report.md`：当前最终验收报告。
- `docs/34_v1_0_true_loop_closeout.md`：v1.0 真实闭环收束记录。
- `docs/116_v3_9_runtime_guard_extraction.md`：runtime prototype 共享 guard 抽取记录。
- `docs/117_v4_0_runtime_contract_smoke_hardening.md`：runtime smoke test 契约加固记录。
- `docs/118_v4_1_runtime_guard_unit_validation.md`：runtime guard unit validation 记录。
- `docs/119_v4_2_runtime_validation_suite.md`：runtime validation suite 记录。
- `docs/120_v4_3_autopilot_overlay_installation.md`：autopilot overlay 安装与 agent board 同步记录。
- `docs/121_v4_4_agent_board_state_validation.md`：agent board state validation 记录。
- `docs/122_v4_5_local_checkpoint_readiness.md`：local checkpoint readiness 记录。
- `docs/123_v4_6_local_commit_scope_manifest.md`：local commit scope manifest 记录。
- `docs/124_v4_7_post_push_state_reconciliation.md`：post-push state reconciliation 记录。
- `docs/125_v4_8_v4_index_consistency_validation.md`：v4 index consistency validation 记录。
- `docs/126_v4_9_local_tag_push_readiness.md`：local tag push-readiness preflight 记录。
- `docs/127_v5_0_delivery_readiness_index.md`：post-merge delivery readiness index 记录。
- `docs/128_v5_1_runtime_delivery_surface.md`：runtime delivery surface validation 记录。
- `docs/129_v5_2_adapter_delivery_surface.md`：adapter delivery surface validation 记录。
- `docs/130_v5_3_review_console_adapter_handoff.md`：review console adapter handoff validation 记录。
- `docs/131_v5_4_local_sync_readiness.md`：local sync readiness preflight 记录。
- `docs/132_v5_5_post_commit_reconciliation.md`：post-commit reconciliation checkpoint 记录。
- `docs/133_v5_6_v5_index_consistency_validation.md`：v5 index consistency validation 记录。
- `docs/134_v5_7_local_batch_commit_readiness.md`：local batch commit-readiness preflight 记录。
- `docs/135_v5_8_handoff_freshness_validation.md`：handoff freshness validation 记录。
- `docs/136_v5_9_expanded_v5_index_consistency.md`：expanded v5 index consistency validation 记录。
- `docs/137_v5_10_local_true_loop_candidate_delivery.md`：local true-loop candidate delivery closeout 记录。
- `docs/138_v5_11_post_merge_reconciliation.md`：post-merge reconciliation 记录。
- `docs/139_v5_12_release_candidate_readiness.md`：release candidate readiness 记录。
- `docs/192_v7_40_local_a4_a5_autonomy_alignment.md`：local A4/A5 autonomy mode alignment 记录。
- `docs/198_v7_46_remote_debug_relaunch_runtime_verification_record.md`：remote-debug relaunch runtime verification 脱敏记录。
- `docs/199_v10_0_a5_end_to_end_activation_package_readiness.md`：A5 end-to-end activation package readiness 与 preflight-blocked 脱敏记录。
- `docs/200_v10_1_a5_resume_after_external_worktree_reconciliation.md`：A5 外部工作树清理后恢复 preflight 的脱敏接续记录。
- `docs/201_v10_2_a5_bridge_smoke_blocked_record.md`：A5 clean preflight 后 bridge surface 缺失的脱敏阻断记录。
- `docs/202_v10_3_a5_bridge_integration_smoke_record.md`：VCPChat no-write bridge 集成与严格 allowlist smoke 脱敏记录。
- `docs/207_v10_8_a5_positive_still_life_generation_preflight_gate.md`：下一次 DoubaoGen 正向静物生成前的 prompt 锁定与授权门记录。
- `docs/208_v10_9_a5_positive_still_life_generation_rejected_asset_record.md`：短批准模板触发的 DoubaoGen 正向静物单次生成拒收记录。
- `docs/209_v10_10_a5_prompt_handoff_diagnostic_preflight.md`：无生图 prompt handoff diagnostic preflight，区分模型遵循失败和插件请求传递失败。
- `docs/210_v10_11_a5_prompt_handoff_diagnostic_result.md`：无生图 prompt handoff diagnostic 结果，记录本地 prompt hash 与 runner handoff 结论。
- `docs/211_v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.md`：provider-side prompt fingerprint capture 的未激活 A5 授权包记录。
- `docs/212_v10_26_real_dailynote_write_closeout.md`：v10.25 单次 DailyNoteWrite 真实写入后的脱敏 closeout 记录，记录 `actual_write_calls=1` 和单次授权已消耗。
- `docs/213_v10_27_dailynotewrite_root_path_correction.md`：DailyNoteWrite 后续写入根目录修复记录，确认 no-write 复算已指向 `vcp_root_dailynote`。
- `docs/214_v10_28_dailynote_canonical_location_guard.md`：DailyNote 后续写入 canonical location guard，要求写后 canonical 位置存在和 hash 匹配。
- `docs/215_runtime_review_followup_requirements_audit.md`：Runtime Review Console 后续交付需求审计和 Batch 2A/2B/2C 本地实现记录，定义剩余 P0/P1 顺序和验证边界。
- `docs/216_runtime_review_long_task_delivery_plan.md`：Runtime Review 后续长任务总计划，覆盖 inactive authorization capsule generator、runtime state convergence、commit scope stabilization、bridge readiness、plugin reliability、memory lifecycle、asset archive 和 release candidate readiness。
- `docs/217_runtime_review_batch_3a_3b_3c_local_stabilization.md`：Runtime Review Batch 3A/3B/3C 本地稳定化记录，覆盖未激活授权胶囊、状态收敛和本地提交范围分组计划。
- `docs/218_runtime_review_batch_4a_bridge_mock_roundtrip.md`：Runtime Review Batch 4A 本地 bridge mock 回环记录，覆盖 loadSession / previewDraft mock、submitDraft 禁止和 no-write guard。
- `docs/219_runtime_review_batch_4b_5a_6a_local_readiness.md`：Runtime Review Batch 4B/5A/6A 本地 readiness 记录，覆盖真实 bridge 授权包、prompt 可靠性和记忆完成候选。
- `docs/220_runtime_review_batch_5b_6b_7a_local_gate_archive.md`：Runtime Review Batch 5B/6B/7A 本地 gate/archive 记录，覆盖真实重试授权门、真实记忆写入授权包和 no-binary 资产归档候选。
- `docs/221_runtime_review_batch_8a_release_candidate_readiness_local_proposal.md`：Runtime Review Batch 8A 本地 release-candidate proposal，固定提交范围、验证矩阵和版本动作阻断边界。
- `docs/222_runtime_review_batch_8a_post_merge_checkpoint.md`：PR #6 合并后的本地 `master` 同步和 post-merge checkpoint。
- `docs/223_runtime_review_batch_8b_vnext_rc_acceptance.md`：Runtime Review Batch 8B vNext RC acceptance，本地接受基线收束文档。
- `docs/224_runtime_review_batch_8c_final_acceptance_summary.md`：Runtime Review Batch 8C final acceptance summary，最终可读 acceptance 摘要。
- `docs/225_runtime_review_batch_8d_sustained_autopilot_task_plan.md`：Runtime Review Batch 8D sustained autopilot task plan，默认自动队列与条件自动队列的后续任务安排。
- `docs/226_runtime_review_batch_9a_state_freshness_index.md`：Runtime Review Batch 9A state freshness index，当前状态 freshness 入口与交叉校验说明。
- `docs/227_runtime_review_batch_9c_operator_runbook_and_resume_capsule.md`：Runtime Review Batch 9C operator runbook and resume capsule，五分钟续跑入口和 operator runbook。
- `docs/228_runtime_review_batch_9b_runtime_session_compatibility_matrix.md`：Runtime Review Batch 9B runtime session compatibility matrix，`runtime_review_session_v1` legacy/current 兼容规则、fixture 和 validator 入口。
- `docs/229_runtime_review_batch_10b_end_to_end_dry_run_replay_index.md`：Runtime Review Batch 10B end-to-end dry-run replay index，Adapter → Review Console → session export 回放路径。
- `docs/230_runtime_review_batch_10a_release_candidate_acceptance_matrix.md`：Runtime Review Batch 10A release-candidate acceptance matrix，八领域验收矩阵。
- `docs/231_runtime_review_batch_10c_future_a5_authorization_package_consolidation.md`：Runtime Review Batch 10C future A5 authorization package consolidation，七领域 preflight 模板。
- `docs/232_runtime_review_final_local_checkpoint_sustained_autopilot_chain_closeout.md`：Runtime Review final local checkpoint，sustained autopilot chain 收束。
- `scripts/validate_runtime_review_batch_10b_dry_run_replay_index.js`：Batch 10B dry-run replay index validator，11 项检查覆盖 fixture 链、脚本顺序、adapter 输出不变量和禁止外部访问。
- `scripts/validate_runtime_review_batch_10a_acceptance_matrix.js`：Batch 10A acceptance matrix validator，机器验证八领域覆盖、状态分布和禁止输出。
- `scripts/validate_runtime_review_batch_10c_auth_consolidation.js`：Batch 10C auth consolidation validator，机器验证七领域模板、占位符根路径、字段依赖图。
- `scripts/validate_runtime_review_full_chain.js`：全链 validator aggregator，一次运行全部 6 个 batch validator（12 项检查），自动识别 phase superseded 的历史批次。
- `scripts/validate_v6_0_product_runtime_kickoff.js`：v6.0 validator，10 项检查覆盖 kickoff doc、v6 draft surface、UI section、smoke test 扩展。
- `scripts/validate_v6_1_task_panel_interaction.js`：v6.1 validator，9 项检查覆盖 Task Panel 表单交互、guard、smoke test。
- `scripts/validate_v6_2_asset_index_interaction.js`：v6.2 validator，16 项检查覆盖 Asset Index 交互表单、guard、field mapping、smoke test 扩展和禁止输出。
- `docs/236_v6_0_product_runtime_kickoff.md`：v6.0 Product Runtime Kickoff。
- `docs/237_v6_1_task_panel_interaction.md`：v6.1 Task Panel Interaction。
- `docs/238_v6_2_asset_index_interaction.md`：v6.2 Asset Index Interaction。
- `review_console/phase_e_vcpchat_subwindow_integration_task_plan.md`：Phase E VCPChat 子窗口接入任务书。
- `review_console/phase_e_ipc_contract_draft.md`：Phase E IPC 契约草案，4 通道 + sender 校验 + 错误处理。
- `review_console/phase_e_security_acceptance_checklist.md`：Phase E 安全验收清单，77 项 8 域。
- `review_console/phase_f_mvp_b_controlled_real_execution_task_plan.md`：Phase F MVP-B 受控真实执行任务书，8 阶段执行计划。
- `integrations/vcp/v10_8_positive_still_life_real_generation_authorization_draft.md`：下一次正向静物真实生成的未激活 A5 授权草案；仅供人工审查，不构成执行授权。
- `integrations/vcp/v10_8_positive_still_life_short_approval_template.md`：短批准模板；允许在私有 ignored 插件路径绑定存在时用 `批准 v10.8 静物单次生成` 进入 preflight。
- `integrations/vcp/v10_10_prompt_handoff_diagnostic_authorization_template.md`：未来无生图传参诊断的未激活授权模板；`max_plugin_calls=0`。
- `integrations/vcp/v10_12_provider_side_prompt_fingerprint_capture_authorization_package.md`：未来 provider-side echo / sanitized request capture 的未激活授权包；`max_generation_calls_allowed=0`。
- `review_console/embed_contract/v10_26_real_dailynote_write_closeout.md`：v10.26 post-write handoff，供 Review Console 只读展示真实写入已完成和后续阻断边界。
- `review_console/embed_contract/v10_27_dailynotewrite_root_path_correction.md`：v10.27 root path correction handoff，供 Review Console 只读展示后续写入根目录已修正。
- `review_console/embed_contract/v10_28_dailynote_canonical_location_guard.md`：v10.28 canonical location guard handoff，供 Review Console 展示 success / wrong-location / hash-mismatch 判定。
- `.agent_board/`：本地 guarded autopilot 状态板，用于续跑、校验记录和 handoff。
- `docs/`：项目定义、SOP、评分表、VCP 记忆适配、审片台设计。
- `agents/`：ImageLab_Master 和岗位型子 Agent 的规则。
- `memory_policy/`：中文日记、memory_delta、写入权限、召回策略、禁写清单。
- `schemas/`：任务包、提示词包、评分、案例、记忆、调度、审片会话结构。
- `review_console/`：ImageLab Review Console 审片台规格。
- `integrations/vcp/`：VCP 接入草案、脱敏审查、执行授权和真实执行记录。
- `tests/schema_examples/`：schema 样例和阶段验收样例。

## 只读校验

```powershell
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
```

推荐附加检查：

```powershell
node --check adapter_dry_run_lab\adapter_dry_run.js
node --check review_console\static_prototype\app.js
node --check review_console\static_prototype\mock_data.js
node --check exports\vcptoolbox\Plugin\AgentImageLabAdapter\dry-run-adapter.js
node scripts\validate_runtime_guard_unit.js
node scripts\validate_runtime_prototype_smoke.js
node scripts\validate_runtime_delivery_surface.js
node scripts\validate_adapter_delivery_surface.js
node scripts\validate_review_console_adapter_handoff.js
node scripts\validate_v5_local_sync_readiness.js
node scripts\validate_v5_post_commit_reconciliation.js
node scripts\validate_v5_index_consistency.js
node scripts\validate_v5_local_batch_commit_readiness.js
node scripts\validate_v5_handoff_freshness.js
node scripts\validate_v5_true_loop_candidate_delivery.js
node scripts\validate_v5_post_merge_reconciliation.js
node scripts\validate_v5_12_release_candidate_readiness.js
node scripts\validate_v7_40_local_a4_a5_autonomy_alignment.js
node scripts\validate_v7_46_remote_debug_relaunch_runtime_verification_record.js
node scripts\validate_v10_0_a5_end_to_end_activation_package.js
node scripts\validate_v10_1_a5_resume_after_external_worktree_reconciliation.js
node scripts\validate_v10_2_a5_bridge_smoke_blocked_record.js
node scripts\validate_v10_3_a5_bridge_integration_smoke_record.js
node scripts\validate_v10_8_a5_positive_still_life_generation_preflight_gate.js
node scripts\validate_v10_9_a5_positive_still_life_generation_rejected_asset_record.js
node scripts\validate_v10_10_a5_prompt_handoff_diagnostic_preflight.js
node scripts\validate_v10_11_a5_prompt_handoff_diagnostic_result.js
node scripts\validate_v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.js
node scripts\validate_v10_15_runner_utf8_no_bom_transport.js
node scripts\validate_v10_20_plugin_reported_model_recording.js
node scripts\validate_v10_26_real_dailynote_write_closeout.js
node scripts\validate_v10_27_dailynotewrite_root_path_correction.js
node scripts\validate_v10_28_dailynote_canonical_location_guard.js
node scripts\validate_runtime_prototype_suite.js
node scripts\validate_agent_board_state.js
node scripts\validate_local_checkpoint_manifest.js
node scripts\validate_local_commit_scope.js
node scripts\validate_post_push_state.js
node scripts\validate_v4_index_consistency.js
node scripts\validate_local_tag_push_readiness.js
node scripts\validate_v5_delivery_readiness.js
powershell -ExecutionPolicy Bypass -File scripts\validate-agent-image-lab-local.ps1
git diff --check
```

## 真实执行授权门

任何新的真实执行前必须先阅读并确认：

- `integrations/vcp/v0_7_real_execution_authorization_gate.md`
- `integrations/vcp/v0_7_gatekeeper_risk_boundary.md`
- `review_console/v0_7_human_approval_preflight.md`
- `workflows/v0_7_real_execution_preflight_confirmation.md`
- `docs/199_v10_0_a5_end_to_end_activation_package_readiness.md`
- `docs/200_v10_1_a5_resume_after_external_worktree_reconciliation.md`
- `docs/201_v10_2_a5_bridge_smoke_blocked_record.md`
- `docs/202_v10_3_a5_bridge_integration_smoke_record.md`
- `docs/203_v10_4_a5_doubaogen_single_generation_rejected_asset_record.md`
- `docs/204_v10_5_a5_doubaogen_no_text_retry_rejected_asset_record.md`
- `docs/205_v10_6_a5_prompt_failure_analysis_and_safer_strategy.md`
- `docs/206_v10_7_a5_safer_prompt_review_package.md`
- `docs/207_v10_8_a5_positive_still_life_generation_preflight_gate.md`
- `docs/208_v10_9_a5_positive_still_life_generation_rejected_asset_record.md`
- `docs/209_v10_10_a5_prompt_handoff_diagnostic_preflight.md`
- `docs/210_v10_11_a5_prompt_handoff_diagnostic_result.md`
- `docs/211_v10_12_a5_provider_side_prompt_fingerprint_capture_authorization_package.md`
- `docs/212_v10_26_real_dailynote_write_closeout.md`
- `docs/213_v10_27_dailynotewrite_root_path_correction.md`
- `docs/214_v10_28_dailynote_canonical_location_guard.md`
- `docs/215_runtime_review_followup_requirements_audit.md`
- `integrations/vcp/v10_8_positive_still_life_real_generation_authorization_draft.md`
- `integrations/vcp/v10_8_positive_still_life_short_approval_template.md`
- `integrations/vcp/v10_10_prompt_handoff_diagnostic_authorization_template.md`
- `integrations/vcp/v10_12_provider_side_prompt_fingerprint_capture_authorization_package.md`
- `review_console/embed_contract/v10_26_real_dailynote_write_closeout.md`
- `review_console/embed_contract/v10_27_dailynotewrite_root_path_correction.md`
- `review_console/embed_contract/v10_28_dailynote_canonical_location_guard.md`

仅说“继续”不构成新的真实执行授权。即使存在 A5 授权包，如果外部目标工作树不干净、tag/分支冲突、输出目录冲突或会泄露 raw 敏感值，也必须停止。

## 不做什么

本包不包含密钥、不包含 raw 插件输出、不包含 raw endpoint、不包含运行日志、不把图片大文件纳入 Git。v0.5 曾在用户授权下把 Adapter-only dry-run 包安装到 VCPToolBox 预发布候选工作线；该安装不代表真实生图插件长期启用。v10.26 记录 v10.25 已完成一次 DailyNote/VCP memory 真实写入；v10.27 记录未来 DailyNoteWrite 写入根目录已修正为 `vcp_root_dailynote`；v10.28 记录插件 `success` 不再足以判定写入完成，必须通过 canonical location 和 hash 校验。该单次授权已消耗，第二次写入、追加生图、submitDraft、commit、push、tag、PR 和 release 仍需后续单独授权和通过对应安全门。
