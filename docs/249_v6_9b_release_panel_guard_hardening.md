# v6.9B Release Panel Guard Hardening

## 目的

为 v6.9A 的 `release_readiness_draft` 增加 runtime_guard 安全校验函数 `v6ReleaseReadinessIsSafe()`，在 `v6ProductRuntimeIsSafe()` 中接入调用。

## 新增内容

- `v6ReleaseReadinessIsSafe(draft)` — 校验 release_readiness_draft 的安全字段
- 三个新枚举：`VALID_VALIDATOR_STATUSES`、`VALID_DIRTY_TREE_STATUSES`、`VALID_RELEASE_NOTES_STATUSES`
- 在 `v6ProductRuntimeIsSafe()` 中调用 `v6ReleaseReadinessIsSafe(draft)`

## 校验内容

```text
release_readiness_draft 存在时：
- draft_only === true
- side_effects_performed === false
- no_execution_guard clean
- push_allowed === false
- tag_allowed === false
- release_allowed === false
- github_release_allowed === false
- deploy_allowed === false
- a5_production_execution_allowed === false
- validator_status 值只能是 pending / passed / failed
- dirty_tree_status 只能是 clean / dirty / unknown
- release_notes_status 只能是 draft / ready / missing
```

## 不修改项

- 不放宽旧 guard
- 不删除旧 guard
- 不修改 dispatch_plan_draft 护栏
