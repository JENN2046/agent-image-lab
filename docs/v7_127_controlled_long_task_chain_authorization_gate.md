# v7.127 — Controlled Long Task Chain Authorization Gate

> **Authorization gate for the first controlled long task chain. Chain name: Controlled Selected Docs Audit Chain. Prerequisites met: fixture dry-run passed, selected docs re-scan passed. Chain not authorized.**
>
> **第一条受控长任务链的授权门。链名称：受控选定文档审计链。前提条件已满足：fixture dry-run 通过，选定文档重扫描通过。链未授权。**

---

## 1. Gate Scope

```yaml
gate_scope:
  phase: v7.127
  gate_type: controlled_long_task_chain_gate
  chain_name: Controlled Selected Docs Audit Chain
  chain_authorized_now: false
  runtime_execution: false

  source:
    rescan_closeout_phase: v7.126
    rescan_closeout_commit: a78d71b
    validator_patch_version: v7.117c

  prerequisites:
    fixture_dry_run_passed: true
    selected_docs_rescan_passed: true
```

---

## 2. Chain Scope

```yaml
chain_scope:
  first_chain_scope: selected_docs_batch_only
  batch_size_max: 8
  max_validator_runs: 1
  selected_docs_only: true
```

---

## 3. Allowed / Forbidden

| Action | Status |
|--------|--------|
| **Allowed** | |
| Run validator on explicit file paths (batch ≤ 8) | ✅ |
| Record findings with classification | ✅ |
| Generate docs-only report | ✅ |
| **Forbidden** | |
| Glob patterns | ❌ |
| Directory scan | ❌ |
| Full repo scan | ❌ |
| Autofix | ❌ |
| Document mutation | ❌ |
| Code modification | ❌ |
| production_candidate_002 | ❌ |
| memory_write_path | ❌ |
| submitDraft invocation | ❌ |
| CDP access | ❌ |
| Bridge call | ❌ |
| MCP call | ❌ |
| Image generation | ❌ |

---

## 4. Finding Classification

| Category | Description |
|----------|-------------|
| `true_positive` | Valid security/policy finding |
| `false_positive` | Incorrect flag (e.g., schema field name in docs) |
| `policy_note` | Non-blocking policy observation |
| `closeout_integrity_gap` | Missing required closeout field |
| `raw_data_exposure` | Raw JSON/WebSocket/memory data in docs |
| `permission_drift` | Unauthorized permission status change |

---

## 5. Future Chain Output

```yaml
chain_output:
  scanned_files: integer
  findings_total: integer
  true_positive_count: integer
  false_positive_count: integer
  blocker_count: integer
  recommended_next: string
  no_remediation_performed: true
```

---

## 6. Hard Stops

| Condition | Action |
|-----------|--------|
| Validator exits 3 (internal error) | Stop chain, report error |
| Raw data exposure detected | Stop chain, escalate |
| Permission drift detected | Stop chain, escalate |
| Selected file missing | Stop chain, report |
| Path outside allowed list | Stop chain |
| Glob/directory/repo scan attempt | Stop chain |
| Any write attempt | Stop chain, escalate |
| Any runtime/CDP/bridge/MCP attempt | Stop chain, escalate |

---

## 7. Safety Verification

| Check | Result |
|-------|--------|
| Validator executed | false |
| Docs scanned | false |
| Batch scan performed | false |
| Document mutated | false |
| CDP / bridge / MCP | false |
| Known untracked file touched | false |

---

## 8. Final State

| Field | Value |
|-------|-------|
| gate_type | controlled_long_task_chain_gate |
| chain_name | Controlled Selected Docs Audit Chain |
| chain_authorized_now | false |
| batch_size_max | 8 |
| max_validator_runs | 1 |
| prerequisites_met | true |
| production_candidate_002_allowed | false |
| memory_write_path_allowed | false |
| submitDraft_allowed | false |
| next | v7.128 First Controlled Batch |
