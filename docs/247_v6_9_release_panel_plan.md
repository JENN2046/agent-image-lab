# v6.9 Release Panel Planning

## 目的

为后续实现 Release Panel（发布面板）做规划，让 Review Console 能展示 release readiness draft，但不创建 tag、不创建 GitHub release、不触发真实发布。

这是规划书，不是实现。本轮不做 UI，不做 release。

## 和已有模块的关系

| 模块 | 关系 |
|---|---|
| v6.7 Product Runtime Final Acceptance Baseline | Release Panel 的 readiness 基线参照 |
| v6.8A Plugin Dashboard Draft Surface | Plugin 调度状态可纳入 release readiness |
| v6.8B Plugin Dashboard Guard Hardening | 安全护栏策略可扩展到 Release Panel |

## 不是真实 release

Release Panel 的所有字段停留在 release_readiness_draft，不创建 tag，不创建 GitHub release，不触发 CI/CD，不进行 deploy。

```text
push_allowed: false
tag_allowed: false
release_allowed: false
github_release_allowed: false
```

## 建议的 release_readiness_draft 数据结构

```yaml
release_readiness_draft:
  draft_only: true
  side_effects_performed: false
  no_execution_guard:
    api_called: false
    daily_note_called: false
    vcp_plugin_called: false
    disk_write_performed: false
    image_file_created: false

  current_commit: string
  baseline_commit: string

  validator_status:
    all_required_validators_pass: boolean
    passed_count: integer
    total_count: integer
    failed_validators:
      - string

  dirty_tree_status: boolean
  pending_changes_count: integer

  tag_candidate: string | null
  release_notes_status: draft | needs_review | ready | blocked

  push_allowed: false
  tag_allowed: false
  release_allowed: false
  github_release_allowed: false

  blocker_summary_cn: string
  warning_summary_cn: string
  boundary_cn: string
```

## 禁止动作

```text
- push
- tag
- release
- PR
- deploy
- A5 production execution
```

## UI 建议

后续实现时可考虑在 Product Shell 底部操作区或右侧裁决栏增加 Release Panel 区块：

- 顶部：current_commit + baseline_commit 展示
- 中部：validator_status 绿/红指标
- 下半部：blocker + warning 摘要
- 底部：固定 no-action 声明（push/tag/release allowed = false）

## 后续可选实现路线

```text
v6.9A — Release Panel Draft Surface
  Release Panel DOM + release_readiness_draft builder + renderer
  validator: validate_v6_9a_release_panel_draft_surface.js

v6.9B — Release Panel Guard Hardening
  runtime_guard v6ReleasePanelIsSafe()
  validator: validate_v6_9b_release_panel_guard_hardening.js

v6.10 — Product Runtime RC (Release Candidate)
  整合 v6.7 Baseline + v6.8 Plugin Dashboard + v6.9 Release Panel
  作为 v6 Product Runtime 的完整发布候选
```

## 不纳入范围

```text
- 真实 GitHub release 发布（需独立 A5 授权包）
- 真实 tag 创建（需独立版本动作授权）
- CI/CD 集成
- 部署脚本
- 版本号自动推进
- npm/bundler 发布
```

## 验证命令

```powershell
node --check scripts/validate_v6_9_release_panel_plan.js
node scripts/validate_v6_9_release_panel_plan.js
```
