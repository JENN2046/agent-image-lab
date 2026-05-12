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
  A5_execution_started: true
  preflight_passed: false
  plugin_called: true
  image_generated: false
  output_saved: false
  DailyNote_written: false
  VCP_memory_written: false
  git_push_or_release_done: false
```

## 最新执行结果

```yaml
latest_execution_result:
  run_id: A5-GENERATION-ATTEMPT-20260513-001
  result: failed_no_image
  result_cn: "已按授权启动 1 次 DoubaoGen generate 子进程，但插件返回 error，未生成图片"
  plugin_process_started: true
  max_plugin_calls_consumed: 1
  retry_performed: false
  retry_allowed: false
  image_generated: false
  image_count: 0
  output_directory_cleaned_after_failure: true
  secret_value_printed: false
  secret_cache_removed: true
  runtime_plugin_copy_removed: true
  DailyNote_written: false
  VCP_memory_written: false
  raw_stdout_or_stderr_retained: false
  note_cn: "retry_limit=0，本授权下不允许再次调用；如果要继续，需要新的失败分析或重试授权。"
```

## 最新预检结果

```yaml
latest_preflight:
  run_id: A5-EXECUTION-ATTEMPT-20260513-001
  result: blocked
  result_cn: "授权语有效，但当前没有匹配的安全 VCPToolBox / DoubaoGen 调用入口"
  blocker: execution_surface_mismatch
  blocker_cn: "仓库中的 native Doubao runner 不是本次授权的 VCPToolBox / DoubaoGen 调用入口；历史 VCPToolBox runner 需要读取真实插件目录或 config.env，不在本次授权范围内"
  validation_seen:
    git_status: clean_ahead_1
    authorization_phrase_matched: true
    output_dir_exists: true
    direct_plugin_call_performed: false
    image_generated: false
  execution_allowed_now: false
  note_cn: "下一步需要补充一个精确的执行面：要么提供可调用的 VCPToolBox / DoubaoGen 工具入口，要么单独授权某个本地 runner 及其读取范围。"
```

```yaml
previous_preflight:
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
  recommended: provide_exact_vcptoolbox_doubaogen_execution_surface
  execute_generation_after_preflight: false
  note: "授权语已经通过；现在缺的是匹配授权的安全执行入口，不是继续补普通草案字段。"
```
