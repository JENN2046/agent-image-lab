# v7.129 — First Controlled Batch Execution Closeout

> **Batch 001 completed. Exit 2 (block). 32 closeoutIntegrity gaps in 4 markdown files. No raw data exposure. No permission drift. No false positives. No remediation. Next batch not yet allowed.**
>
> **Batch 001 完成。退出码 2（拦截）。4 个 markdown 文件中有 32 项 closeoutIntegrity 缺失。无 raw 数据泄露。无权限漂移。无误报。未修复。下一批尚未允许。**

---

## Execution Summary

```yaml
execution_summary:
  phase: v7.129
  status: completed
  execution_date: 2026-05-11

  chain_name: Controlled Selected Docs Audit Chain
  batch_id: controlled_selected_docs_batch_001

  validator_executed: true
  validator_runs: 1
  validator_patch_version: v7.117c
  target_scope: selected_docs_batch_only
  files_targeted: 7

  exit_code: 2
  decision: block
  findings_detected: true
  violations_total: 32
  warnings_total: 0
  notes_total: 7

  forbiddenRawFields_violations: 0
  permissionDrift_violations: 0
  closeoutIntegrity_violations: 32
```

## Finding Classification

| Category | Count |
|----------|-------|
| true_positive | 32 |
| false_positive | 0 |
| policy_note | 0 |
| closeout_integrity_gap | 32 |
| raw_data_exposure | 0 |
| permission_drift | 0 |
| blocker | 0 |

## Finding Details

| Field | Value |
|-------|-------|
| Affected file count | 4 |
| Affected file type | markdown |
| Finding nature | markdown_closeout_integrity_gap |
| Security impact | low |
| Governance impact | medium |

The 32 violations are all from `closeoutIntegrity` rule: `.md` versions of closeout/gate docs are missing the required closeout fields that exist in their `.yaml` counterparts. This is a documentation convention gap, not a security or policy violation.

## Batch Verification

```yaml
batch_verification:
  batch_boundary_respected: true
  first_controlled_batch_functional: true
  remediation_performed: false
  next_batch_allowed_now: false
  correction_planning_required_before_next_batch: true
```

## Side-effect Verification

| Check | Result |
|-------|--------|
| Second validator run | false |
| File / document mutated | false |
| Code / fixtures mutated | false |
| Network / CDP / bridge / MCP | false |
| Known untracked file touched | false |

## Final State

| Field | Value |
|-------|-------|
| first_controlled_batch_execution_completed | true |
| batch_boundary_respected | true |
| violations_total | 32 (closeoutIntegrity) |
| raw_data_exposure | 0 |
| permission_drift | 0 |
| remediation_performed | false |
| next_batch_allowed_now | false |
| next | v7.130 |
