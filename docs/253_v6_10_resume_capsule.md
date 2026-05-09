# v6.10 Resume Capsule

让下一个 agent 或下一条线程快速接手，不需要重新读完整历史。

## Current Remote Baseline

```text
origin/master: eb4fade
message: fix: v6.8A Patch 01 — preserve v6.7 baseline handoff reference
```

## Latest Local Phase

```text
commit: 189bb0f
message: test: add v6 validator quality gate
ahead of origin/master: 7 commits

Pending commits:
- f3ff180 feat: add v6.9A release panel draft surface
- 03d86ea fix: add v6.9B release panel guard hardening
- 9f7107b docs: add v6.10 product runtime RC readiness matrix
- 189bb0f test: add v6 validator quality gate
```

## Validators

```text
v6.0 — validate_v6_0_product_runtime_kickoff.js (10 checks)
v6.1 — validate_v6_1_task_panel_interaction.js (9 checks)
v6.2 — validate_v6_2_asset_index_interaction.js (16 checks)
v6.3 — validate_v6_3_session_store_interaction.js (16 checks)
v6.4 — validate_v6_4_memory_queue_interaction.js (25 checks)
v6.5 — validate_v6_5_review_console_product_shell.js (18 checks)
v6.6 — validate_v6_6_product_shell_qa.js (25 checks)
v6.7 — validate_v6_7_product_runtime_final_acceptance.js (33 checks)
v6.8 — validate_v6_8_plugin_dashboard.js (30 checks)
v6.8B — validate_v6_8b_plugin_dashboard_guard_hardening.js (18 checks)
v6.9A — validate_v6_9a_release_panel_draft_surface.js (17 checks)
v6.9B — validate_v6_9b_release_panel_guard_hardening.js (12 checks)
v6.10 — validate_v6_10_product_runtime_rc_readiness_matrix.js (8 checks)
Quality Gate — validate_v6_validator_quality_gate.js (8 checks)
```

## Hard Stop Gates

```text
- 真实 VCPChat / VCPToolBox 读取 → stop
- 真实 PluginDir / plugin-manifest.json → stop
- 插件/API/DailyNote/VCP memory/image → stop
- push/tag/release/PR/deploy → stop
- 新增依赖 → stop
- runtime_guard 放宽 → stop
- validate_mvp.ps1 失败且无法修复 → stop
- 出现 secret/token/cookie/private path → stop
- 工作树有无关用户改动 → stop
```

## Next Safe Task

```text
Push 7 commits to origin/master, then:
A. v6.9A Release Panel operator usability enhancements
B. v7 Real Production Expansion planning (requires A5 authorization package)
C. Branch management / tag strategy for v6 RC
```

## Do Not Do

```text
- 不要读取真实 PluginDir
- 不要调用真实插件/API
- 不要创建图片
- 不要写 DailyNote / VCP memory
- 不要 push / tag / release / PR / deploy（除非明确授权）
- 不要新增依赖
- 不要修改 runtime_guard 旧规则
- 不要使用 localStorage / sessionStorage / IndexedDB / fs / fetch / XMLHttpRequest / child_process
```
