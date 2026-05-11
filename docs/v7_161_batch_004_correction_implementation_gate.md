# v7.161 — Batch 004 Correction Implementation Gate

> **Implementation gate for Batch 004 closeoutIntegrity correction. 3 files to fix with exact field mapping. Correction not authorized.**
>
> **Batch 004 closeoutIntegrity 修正的实现门。精确字段映射的 3 个文件待修复。未授权修正。**

---

## 1. Gate Scope

```yaml
gate_scope:
  phase: v7.161
  gate_type: batch_004_correction_implementation_gate
  correction_authorized_now: false
  validator_execution_authorized_now: false
  runtime_execution: false

  source:
    planning_phase: v7.160
    planning_commit: b5620de
    prior_closeout_phase: v7.159
    prior_closeout_commit: 670b02f
  chain_name: Controlled Selected Docs Audit Chain
  batch_id: controlled_selected_docs_batch_004
```

---

## 2. Exact Correction Scope

| # | File | Fields to add | Count |
|---|------|---------------|-------|
| 1 | `docs/v7_157_batch_003_rescan_execution_closeout.yaml` | runtime_execution, redacted_summary_only, raw_payload_recorded, commit_hash, branch, git_status, local_scope_result | 7 |
| 2 | `docs/v7_156_batch_003_rescan_authorization_gate.md` | redacted_summary_only, raw_payload_recorded, known_untracked_file_touched, next_phase_started, commit_hash, branch, git_status, local_scope_result | 8 |
| 3 | `docs/v7_153_batch_003_exact_finding_recovery.md` | redacted_summary_only, raw_payload_recorded, known_untracked_file_touched, next_phase_started, commit_hash, branch, git_status, local_scope_result | 8 |

---

## 3. Required Field Values

### v7_157 YAML (commit: 911aa2c)

```yaml
runtime_execution: false
redacted_summary_only: true
raw_payload_recorded: false
commit_hash: 911aa2c
branch: master
git_status: synced
local_scope_result: passed
```

### v7_156 gate .md (commit: 7ab0b33)

```yaml
redacted_summary_only: true
raw_payload_recorded: false
known_untracked_file_touched: false
next_phase_started: false
commit_hash: 7ab0b33
branch: master
git_status: synced
local_scope_result: passed
```

### v7_153 recovery .md (commit: 1d9646b)

```yaml
redacted_summary_only: true
raw_payload_recorded: false
known_untracked_file_touched: false
next_phase_started: false
commit_hash: 1d9646b
branch: master
git_status: synced
local_scope_result: passed
```

---

## 4. Correction Rules

1. Add missing fields only
2. Do not rewrite historical facts
3. Do not touch clean files
4. Do not run validator during implementation

---

## 5. Future Gates

```text
v7.162 Batch 004 Correction Implementation   → fix 3 files
v7.163 Batch 004 Re-scan Authorization Gate  → gate only
v7.164 Batch 004 Re-scan Execution           → run validator
v7.165 Batch 004 Re-scan Closeout            → closeout
v7.166 Validator Governance Chain v1 Closeout Gate → chain closeout
```

---

## 6. Safety Verification

| Check | Result |
|-------|--------|
| Docs mutated | false |
| Validator code mutated | false |
| Validator executed | false |
| Batch 005 | false |
| CDP / bridge / MCP | false |
| Known untracked file touched | false |

---

## 7. Final State

| Field | Value |
|-------|-------|
| gate_type | batch_004_correction_implementation_gate |
| correction_authorized_now | false |
| files_to_modify | 3 |
| fields_to_add | 23 |
| batch_005_allowed_now | false |
| next | v7.162 Batch 004 Correction Implementation |
