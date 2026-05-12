# Product Image A5 Generation Authorization Draft

这是一页版 A5 生图授权草案。它记录了用户已经填写的授权信息，但当前仍停在 `preflight_pending`：必须先完成 fresh preflight，才能决定是否执行真实生成。

```yaml
a5_generation_authorization:
  package_id: AUTH-PENDING-20260512-001
  status: preflight_pending
  execute_now: false
  preflight_required: true

  source_generation_plan: GP-DRAFT-20260512-001
  source_authorization_draft: AUTH-DRAFT-20260512-001
  source_activation_gap_review: PI-AUTH-GAP-20260512-001

  plugin: DoubaoGen
  command: generate
  model: doubao-seedream-5-0-260128

  input_plan: GP-DRAFT-20260512-001
  output_dir: "A:\agent-image-lab-IMAGE-OUTPUT"
  output_save_policy: "只新建文件，不覆盖已有文件"

  max_calls: 1
  retry_limit: 0

  reviewer: Jenn
  approver: Jenn
  approved_at: "2026-05-12 23:30 Asia/Shanghai"
  expires_at: "2026-05-14 23:59 Asia/Shanghai"

  approval_phrase: "批准 AUTH-PENDING-20260512-001：使用 VCPToolBox / DoubaoGen，命令 generate，模型 doubao-seedream-5-0-260128，根据 GP-DRAFT-20260512-001 生成 1 张产品图；max_plugin_calls=1；retry_limit=0；输出目录为 A:\agent-image-lab-IMAGE-OUTPUT；只新建文件，不覆盖已有文件；不写 DailyNote；不写 VCP memory；有效期到 2026-05-14 23:59 Asia/Shanghai；审批人 Jenn。"
```

## 允许范围

```yaml
allowed:
  - "批准后的 preflight"
  - "preflight 通过后，根据 GP-DRAFT-20260512-001 生成 1 张产品图"
```

## 禁止范围

```yaml
forbidden:
  - "preflight 通过前执行生成"
  - "超过 1 次插件调用"
  - "重试"
  - "覆盖已有文件"
  - "写 DailyNote"
  - "写 VCP memory"
  - "push / tag / release / deploy"
  - "读取真实 VCPChat 源码"
  - "读取真实 VCPToolBox 源码"
  - "读取真实 plugin-manifest.json"
  - "读取 .env / config.env / secret / token / cookie / password"
```

## 停止条件

```yaml
stop_if:
  - "git status / diff 不安全"
  - "preflight 未通过"
  - "输出目录不符合授权"
  - "插件、命令、模型、调用次数与授权不一致"
  - "生成结果含人物/脸/可读文字/logo/品牌标识"
  - "出现任何 DailyNote 或 VCP memory 写入请求"
  - "出现任何未授权外部读取或远端动作"
```

## 当前边界

```yaml
current_boundary:
  A5_execution_started: false
  preflight_passed: false
  plugin_called: false
  image_generated: false
  output_saved: false
  DailyNote_written: false
  VCP_memory_written: false
  git_push_or_release_done: false
```

## 最新预检结果

```yaml
latest_preflight:
  run_id: A5-PREFLIGHT-20260512-001
  result: blocked
  result_cn: "本地预检已执行，但当前不允许进入真实 A5 生成"
  blocker: dirty_worktree
  blocker_cn: "当前工作区还有尚未整理的本地变更和未跟踪文件"
  validation_seen:
    git_diff_check: passed
    agent_board_state: passed
    local_validation: passed_with_manual_review_warnings
    mvp_validation: passed
  execution_allowed_now: false
  note_cn: "下一步应先整理当前本地变更或形成明确 checkpoint；不要直接调用插件。"
```

## 下一步

```yaml
next_step:
  recommended: resolve_dirty_worktree_before_a5_execution
  execute_generation_after_preflight: false
  note: "预检已跑但被 dirty worktree 阻塞；清理或确认本地变更后需要重新跑 preflight。"
```
