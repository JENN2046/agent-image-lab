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

## 脱敏失败分析

```yaml
failure_analysis:
  analysis_id: A5-FAILURE-ANALYSIS-20260513-001
  result: inconclusive_provider_or_api_layer_failure
  result_cn: "可判断为插件进入 provider/API 调用路径后失败，但无法在不读取原始错误的前提下确认具体原因"
  ruled_out:
    - "output_directory_not_empty"
    - "missing_prompt"
    - "invalid_json_input"
    - "image_file_write_failure"
    - "retained_secret_cache"
    - "retained_runtime_plugin_copy"
  possible_causes:
    - "credential_auth_failed"
    - "quota_or_rate_limit"
    - "model_or_parameter_rejected"
    - "network_or_provider_error"
    - "provider_response_parse_error"
  exact_error_available_now: false
  reason_exact_error_unavailable_cn: "原始 stdout/stderr 未打印也未保留，符合本次安全约束"
  retry_allowed_under_current_authorization: false
  next_step_cn: "现有证据分析已结束；如需继续，必须批准新的单次重试/诊断包，并明确允许只采集脱敏错误类别。"
```

## 单次重试/诊断结果

```yaml
diagnostic_retry_result:
  run_id: A5-DIAGNOSTIC-RETRY-20260513-001
  result: failed_no_image
  result_cn: "已按新授权执行 1 次 DoubaoGen generate 重试/诊断，插件返回 error，脱敏错误类别为 quota_or_rate_limit，未生成图片。"
  selected_plugin_id: DoubaoGen
  selected_plugin_command: generate
  selected_plugin_model: doubao-seedream-5-0-260128
  max_plugin_calls_consumed: 1
  retry_limit: 0
  process_exit_code: 1
  plugin_status: error
  sanitized_error_category: quota_or_rate_limit
  image_generated: false
  image_count: 0
  output_directory_ref: "A:\\agent-image-lab-IMAGE-OUTPUT"
  overwrite_existing_files: false
  secret_value_printed: false
  raw_stdout_printed: false
  raw_stderr_printed: false
  raw_stdout_or_stderr_retained: false
  secret_cache_removed: true
  runtime_plugin_copy_removed: true
  DailyNote_written: false
  VCP_memory_written: false
  push_tag_release: false
  no_additional_retry_allowed_under_this_authorization: true
  next_step_cn: "不要继续立即重试；先处理 provider 配额/限流侧问题，或另行批准切换 provider/模型/账号的诊断方案。"
```

```yaml
diagnostic_retry_result_002:
  run_id: A5-DIAGNOSTIC-RETRY-20260513-002
  result: failed_no_image
  result_cn: "已按新的单次授权再次执行 1 次 DoubaoGen generate 重试/诊断，插件仍返回 error，脱敏错误类别仍为 quota_or_rate_limit，未生成图片。"
  selected_plugin_id: DoubaoGen
  selected_plugin_command: generate
  selected_plugin_model: doubao-seedream-5-0-260128
  max_plugin_calls_consumed: 1
  retry_limit: 0
  process_exit_code: 1
  plugin_status: error
  sanitized_error_category: quota_or_rate_limit
  repeated_same_category: true
  image_generated: false
  image_count: 0
  output_directory_ref: "A:\\agent-image-lab-IMAGE-OUTPUT"
  overwrite_existing_files: false
  secret_value_printed: false
  raw_stdout_printed: false
  raw_stderr_printed: false
  raw_stdout_or_stderr_retained: false
  secret_cache_removed: true
  runtime_plugin_copy_removed: true
  DailyNote_written: false
  VCP_memory_written: false
  push_tag_release: false
  no_additional_retry_allowed_under_this_authorization: true
  next_step_cn: "连续两次诊断均指向 quota_or_rate_limit；不要继续同账号/同模型即时重试，应先处理配额/限流或另行批准切换路径。"
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
  recommended: resolve_provider_quota_or_rate_limit_before_any_new_generation_attempt
  execute_generation_after_preflight: false
  note: "连续两次单次重试/诊断均为 quota_or_rate_limit；不要继续同账号/同模型即时重试。"
```
