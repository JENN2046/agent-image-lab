# v6.9A Release Panel Draft Surface

## 目的

在 v6 Product Runtime Baseline 上增加 Release Panel 面板，展示发布准备状态草案。
不创建 tag，不创建 release，不触发 deploy。

## 当前基线

```text
commit: 299a513 (local, ahead of origin/master by 3 commits)
v6.8B guard hardening + v6.9 planning complete
```

## Release Panel 内容

### 版本信息（草案输入）
- `current_commit` — 当前 commit 草案
- `baseline_commit` — 基线 commit 草案
- `candidate_label` — 候选标签草案

### Validator 状态
- v6.9 / v6.8 / v6.7 / runtime_suite / validate_mvp
- 每个选择：pending / passed / failed

### Readiness 状态
- `dirty_tree_status` — clean / dirty / unknown
- `release_notes_status` — draft / ready / missing
- `tag_candidate` — 候选 tag 草案

### 安全字段（只读）
- `push_allowed: false`
- `tag_allowed: false`
- `release_allowed: false`
- `github_release_allowed: false`
- `deploy_allowed: false`
- `a5_production_execution_allowed: false`

## 数据结构

见 `review_console/runtime_prototype/app.js` 中 `release_readiness_draft` builder。

## no-execution 边界

- 不运行 git 命令读取真实状态
- 不调用 GitHub API
- 不创建 tag
- 不创建 release
- 不触发 deploy

## 验证命令

```powershell
node --check review_console/runtime_prototype/app.js
node --check review_console/runtime_prototype/runtime_guard.js
node --check scripts/validate_v6_9a_release_panel_draft_surface.js
node scripts/validate_v6_9a_release_panel_draft_surface.js
node scripts/validate_v6_8_plugin_dashboard.js
node scripts/validate_v6_7_product_runtime_final_acceptance.js
node scripts/validate_runtime_prototype_smoke.js
node scripts/validate_runtime_prototype_suite.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
```

## 后续

- **v6.9B**: Release Panel Guard Hardening
- **v6.10**: Product Runtime RC Readiness Matrix
