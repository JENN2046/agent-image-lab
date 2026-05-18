# v7.131 — Batch 001 Markdown Correction Implementation Gate

> **Implementation gate for correcting 32 closeoutIntegrity gaps in 4 markdown files from Batch 001. Markdown only. YAML counterparts must not be modified. Correction not authorized.**
>
> **修复 Batch 001 中 4 个 markdown 文件的 32 项 closeoutIntegrity 缺失的实现门。仅 markdown。不得修改 YAML 对应文件。未授权修正。**

---

## 1. Gate Scope

```yaml
gate_scope:
  phase: v7.131
  gate_type: markdown_correction_implementation_gate
  correction_authorized_now: false
  validator_execution_authorized_now: false
  runtime_execution: false

  source:
    planning_phase: v7.130
    planning_commit: d52b418
  chain_name: Controlled Selected Docs Audit Chain
  batch_id: controlled_selected_docs_batch_001
```

---

## 2. Target Clarification

```yaml
target_clarification:
  target_file_type: markdown_only
  yaml_counterparts_modification_allowed: false
  v7_130_yaml_counterpart_entry_treated_as_planning_note_not_patch_target: true
  v7_132_must_not_modify_yaml_files: true
```

---

## 3. Future Correction Scope

### Allowed to modify

| # | File | Reason |
|---|------|--------|
| 1 | `docs/v7_127_controlled_long_task_chain_authorization_gate.md` | Batch 001 selected |
| 2 | `docs/v7_126_selected_docs_rescan_execution_closeout.md` | Batch 001 selected |
| 3 | `docs/v7_125_selected_docs_rescan_authorization_gate.md` | Batch 001 selected |
| 4 | `docs/v7_123_closeout_integrity_correction_implementation_gate.md` | Batch 001 selected |

### Not allowed to modify

- Any `.yaml` file
- validator code
- fixtures
- files outside the allowed list

---

## 4. Required Correction Pattern

Each affected markdown file may receive:

| Field | Source |
|-------|--------|
| `runtime_execution` | From corresponding phase closeout YAML |
| `redacted_summary_only` | From corresponding phase closeout YAML |
| `raw_payload_recorded` | From corresponding phase closeout YAML |
| `commit_hash` | Actual commit of corresponding phase |
| `branch` | `master` |
| `git_status` | `synced` |
| `local_scope_result` | From corresponding phase closeout YAML |
| `known_untracked_file_touched` | `false` |

---

## 5. Correction Rules

1. Add missing field blocks only
2. Do not remove existing content
3. Do not rewrite historical facts
4. Do not modify YAML counterparts
5. Do not run validator during correction
6. Do not perform docs scan during correction
7. Do not touch unaffected files

---

## 6. Safety Constraints

```yaml
safety_constraints:
  validator_execution: false
  docs_scan: false
  repo_scan: false
  code_change: false
  fixture_change: false
  runtime_call: false
  cdp_bridge_mcp: false
  memory_write: false
  image_generation: false
  next_batch: false
```

---

## 7. Safety Verification

| Check | Result |
|-------|--------|
| Markdown files modified | false |
| YAML files modified | false |
| Validator executed | false |
| Docs scanned | false |
| CDP / bridge / MCP | false |
| Known untracked file touched | false |

---

## 8. Final State

| Field | Value |
|-------|-------|
| gate_type | markdown_correction_implementation_gate |
| correction_authorized_now | false |
| target_file_type | markdown_only |
| yaml_modification_allowed | false |
| files_allowed_to_modify | 4 |
| correction_rules_defined | 8 |
| next | v7.132 Batch 001 Markdown Correction Implementation |
