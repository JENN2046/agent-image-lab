# v7.160 — Batch 004 Correction Planning

> **Planning for 23 closeoutIntegrity findings in Batch 004. Pattern matches batches 001-003. Batch 005 blocked.**
>
> **规划 Batch 004 的 23 项 closeoutIntegrity 发现。模式与批次 001-003 一致。Batch 005 已阻止。**

---

## 1. Planning Scope

```yaml
planning_scope:
  phase: v7.160
  source_phase: v7.159
  source_commit: 670b02f
  chain_name: Controlled Selected Docs Audit Chain
  batch_id: controlled_selected_docs_batch_004
  planning_type: batch_004_correction_planning
  correction_authorized_now: false
  validator_execution: false
  runtime_execution: false
```

---

## 2. Finding Summary

| Category | Count |
|----------|-------|
| violations_total | 23 |
| closeoutIntegrity_violations | 23 |
| permissionDrift_violations | 0 |
| forbiddenRawFields_violations | 0 |
| raw_data_exposure | 0 |
| permission_drift_scope_refinement_effective | true |

---

## 3. Affected Files

| File | Count | Fields |
|------|-------|--------|
| `docs/v7_157_batch_003_rescan_execution_closeout.yaml` | 7 | runtime_execution, redacted_summary_only, raw_payload_recorded, commit_hash, branch, git_status, local_scope_result |
| `docs/v7_156_batch_003_rescan_authorization_gate.md` | 8 | redacted_summary_only, raw_payload_recorded, known_untracked, next_phase_started, commit_hash, branch, git_status, local_scope_result |
| `docs/v7_153_batch_003_exact_finding_recovery.md` | 8 | redacted_summary_only, raw_payload_recorded, known_untracked, next_phase_started, commit_hash, branch, git_status, local_scope_result |

---

## 4. Correction Strategy

1. Add missing closeoutIntegrity fields only
2. Use real phase commit / closeout / YAML values
3. Do not rewrite historical facts
4. No broad autofix

---

## 5. Non-permissions

```yaml
non_permissions:
  batch_005_allowed_now: false
  correction_authorized_now: false
  validator_execution: false
  production_candidate_002: false
  memory_write_path: false
  submitDraft: false
  cdp_bridge_mcp: false
  autofix: false
```

---

## 6. Final State

| Field | Value |
|-------|-------|
| violations_total | 23 |
| batch_005_allowed_now | false |
| next | v7.161 |
