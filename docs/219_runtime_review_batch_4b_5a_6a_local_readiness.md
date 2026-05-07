# Runtime Review Batch 4B + 5A + 6A Local Readiness

本文记录 Runtime Review long task line 的组合批次：Batch 4B、Batch 5A、Batch 6A。

该组合只做本地 A4 readiness：授权包、prompt discipline、memory completion 判定。它不读取真实 VCPChat / VCPToolBox，不启动 VCPChat，不连接 CDP，不调用真实 bridge，不调用插件/API，不写 DailyNote/VCP memory，不创建图片，不执行版本动作。

## Batch 4B: Real Bridge Authorization Package

新增 runtime draft：

```yaml
real_bridge_authorization_package_draft:
  package_status: draft_only
  authorization_status: inactive_package
  allowed_methods:
    - cancel
    - loadSession
    - previewDraft
  forbidden_methods:
    - submitDraft
  max_bridge_calls_per_method: 1
  execution_authorized_by_this_record: false
  production_bridge_invocation_performed: false
  real_cdp_called: false
  source_read_performed: false
  submitDraft_allowed: false
  submitDraft_called: false
```

验收重点：

- 真实 root 只允许在未来执行授权消息中提供，仓库只保存策略和脱敏 ref。
- `submitDraft` 继续作为单独授权点。
- 只允许保存中文脱敏 ack 摘要和 no-write flags。

## Batch 5A: Plugin Reliability And Prompt Discipline

新增 runtime draft：

```yaml
plugin_reliability_prompt_discipline_draft:
  package_status: draft_only
  reliability_status: local_prompt_reliability_candidate
  prompt_registry_status: local_registry_candidate
  selected_plugin_id: DoubaoGen
  requested_model: doubao-seedream-5-0-260128
  max_plugin_calls_allowed: 0
  provider_side_capture:
    authorization_status: inactive_package
    execution_authorized_by_this_record: false
```

本批把 Photo Studio OS 正向静物 prompt 家族固化为本地 registry 候选，并记录：

- prompt hash。
- banned subjects。
- prompt lint rules。
- requested model lock。
- failure taxonomy：prompt design failure、model compliance failure、plugin handoff failure、provider-side unknown。

本批不执行 DoubaoGen，不调用 API，不创建图片。

## Batch 6A: Memory Write Completion Candidate

新增 runtime draft：

```yaml
memory_write_completion_candidate_draft:
  package_status: draft_only
  candidate_status: memory_write_completion_preflight_candidate
  completion_required_sequence:
    - write_requested
    - write_authorized
    - writer_executed
    - canonical_target_exists
    - canonical_target_hash_matches
  completion_criteria:
    plugin_success_sufficient: false
  observed_state:
    writer_executed: false
    canonical_target_exists: false
    canonical_target_hash_matches: false
    write_complete_declared: false
```

完成判定规则：

- 插件 success 不是完成充分条件。
- 必须确认 canonical 位置存在。
- 必须确认 canonical hash 匹配。
- wrong-location 分类固定为 `plugin_success_wrong_location`。
- 任一失败不得伪造 memory write complete。

## Guard Coverage

`runtime_guard.js` 新增三类校验：

- `realBridgeAuthorizationPackageIsSafe()`
- `pluginReliabilityPromptDisciplineIsSafe()`
- `memoryWriteCompletionCandidateIsSafe()`

guard 必须拒绝：

- 激活真实 bridge 授权包。
- 真实 CDP / bridge / source read 标记。
- `submitDraft` 被允许或调用。
- prompt reliability 中出现插件调用额度或 provider capture 激活。
- memory completion 中出现 writer/canonical/hash 完成态或 `plugin_success_sufficient=true`。

## Validation

本批次需要通过：

```powershell
node --check review_console\runtime_prototype\host_bridge_mock.js
node --check review_console\runtime_prototype\runtime_guard.js
node --check review_console\runtime_prototype\app.js
node --check scripts\validate_runtime_guard_unit.js
node --check scripts\validate_runtime_prototype_smoke.js
node --check scripts\validate_runtime_delivery_surface.js
node scripts\validate_runtime_guard_unit.js
node scripts\validate_runtime_prototype_smoke.js
node scripts\validate_runtime_delivery_surface.js
node scripts\validate_runtime_prototype_suite.js
node scripts\validate_local_commit_scope.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
powershell -ExecutionPolicy Bypass -File scripts\validate-agent-image-lab-local.ps1
git diff --check
```

## Stop Boundary

仍然禁止：

- 真实 VCPChat / VCPToolBox 源码读取。
- 真实 manifest、env、config、log、endpoint 或私密路径读取。
- 启动 / 重启 / 附加 VCPChat。
- CDP target 读取或 Runtime.evaluate。
- 真实 bridge 调用。
- VCP 插件/API/DailyNote/VCP memory/image 动作。
- commit、tag、push、PR、release。

## Next

下一组建议任务：Batch 5B + 6B + 7A。

- Batch 5B：Single Real Generation Retry Gate，只准备单次真实生成重试授权门。
- Batch 6B：Real Memory Write Authorization Package，只准备下一次单写授权包。
- Batch 7A：Asset Archive Candidate，把 accepted / rejected / needs_human_review 归档模板收束。
