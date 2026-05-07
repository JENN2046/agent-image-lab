# Runtime Review Batch 5B + 6B + 7A Local Gate And Archive

本文记录 Runtime Review long task line 的组合批次：Batch 5B、Batch 6B、Batch 7A。

该组合只做本地 A4 readiness：真实重试授权门、真实记忆写入授权包、资产归档候选模板。它不读取真实 VCPChat / VCPToolBox，不启动 VCPChat，不连接 CDP，不调用真实 bridge，不调用插件/API，不写 DailyNote/VCP memory，不创建图片，不执行版本动作。

## Batch 5B: Single Real Generation Retry Gate

新增 runtime draft：

```yaml
single_real_generation_retry_gate_draft:
  package_status: draft_only
  gate_status: single_real_generation_retry_gate_inactive
  authorization_status: inactive_package
  selected_plugin_id: DoubaoGen
  selected_plugin_command: generate
  requested_model: doubao-seedream-5-0-260128
  max_plugin_calls_per_run: 1
  plugin_calls_observed: 0
  real_generation_performed: false
  image_created: false
```

验收重点：

- 未来真实重试仍需单独授权。
- 当前只定义一个未来插件调用上限，不代表当前允许调用。
- output directory 只保存 ref 策略，不保存 raw 私密路径。
- Review Console 只接收未来脱敏 run summary、output ref 和 hash。
- 记忆写入继续被阻断，必须等 accepted candidate、memory approval 和 safety review 同时通过。

## Batch 6B: Real Memory Write Authorization Package

新增 runtime draft：

```yaml
real_memory_write_authorization_package_draft:
  package_status: draft_only
  authorization_status: inactive_package
  max_daily_note_writes: 1
  max_vcp_memory_writes: 1
  max_retry_attempts: 1
  no_success_fabrication_rule: true
  daily_note_called: false
  vcp_memory_written: false
  write_complete_declared: false
```

验收重点：

- 正文必须是中文脱敏摘要。
- 禁止 raw path、endpoint、runtime log、raw plugin output、secret、token、cookie、password、客户隐私和图片二进制。
- 写入失败不得伪造成功。
- 最多一次安全重试，超过必须重新授权。

## Batch 7A: Asset Archive Candidate

新增 runtime draft：

```yaml
asset_archive_candidate_draft:
  package_status: draft_only
  archive_status: asset_archive_candidate_no_binary
  archive_policy: metadata_only_no_binary
  raw_output_path_stored: false
  binary_storage_allowed: false
  git_binary_stored: false
  memory_binary_stored: false
```

只允许归档：

- output path ref。
- asset hash。
- score。
- 中文脱敏 review summary。
- reusable rules。
- human override reason。

Closeout 模板固定区分：

- `accepted_candidate`
- `needs_human_review`
- `rejected`

## Guard Coverage

`runtime_guard.js` 新增三类校验：

- `singleRealGenerationRetryGateIsSafe()`
- `realMemoryWriteAuthorizationPackageIsSafe()`
- `assetArchiveCandidateIsSafe()`

guard 必须拒绝：

- 真实重试授权门中出现已观察插件调用、真实生图或图片创建标记。
- 真实记忆授权包中出现 DailyNote/VCP memory 调用或完成态。
- 资产归档候选中允许图片二进制、保存 raw 输出路径或写入 Git/记忆二进制。

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

下一组建议任务：Batch 8A。

- Batch 8A：Release Candidate Readiness，把 Runtime Review follow-up 收束成最终本地 release candidate proposal。
