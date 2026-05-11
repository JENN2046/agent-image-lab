# v7.151 — Batch 003 Correction Planning

> **Planning for 23 closeoutIntegrity findings in Batch 003. Exact finding recovery needed before implementation (2 unitemized findings). Batch 004 blocked.**
>
> **规划 Batch 003 的 23 项 closeoutIntegrity 发现。实现前需要精确发现恢复（2 项未列明）。Batch 004 已阻止。**

---

## 1. Planning Scope

```yaml
planning_scope:
  phase: v7.151
  source_phase: v7.150
  source_commit: ae5719f
  chain_name: Controlled Selected Docs Audit Chain
  batch_id: controlled_selected_docs_batch_003
  planning_type: batch_003_correction_planning
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
| raw_data_exposure_count | 0 |
| false_positive_count | 0 |
| permission_drift_scope_refinement_effective | true |
| security_impact | low |
| governance_impact | medium |

---

## 3. Affected Detail

| File | Status | Missing count |
|------|--------|---------------|
| `docs/v7_148_batch_002_rescan_execution_closeout.yaml` | affected | 7 |
| `docs/v7_147_batch_002_rescan_authorization_gate.md` | affected | 7 |
| `docs/v7_145_batch_002_correction_implementation_gate.md` | affected | 7 |
| `docs/v7_148_batch_002_rescan_execution_closeout.md` | clean | 0 |
| `docs/v7_147_batch_002_rescan_authorization_gate.yaml` | clean | 0 |
| `docs/v7_145_batch_002_correction_implementation_gate.yaml` | clean | 0 |
| `docs/v7_144_batch_002_permission_drift_analysis.md` | clean | 0 |

**Count note**: Listed detail totals 21. Reported total is 23. **2 unitemized findings remain**. Exact recovery required before implementation.

---

## 4. Recovery Strategy

| Option | Description |
|--------|-------------|
| **A** | Recover exact affected fields from redacted validator summary |
| **B** | Read-only check affected YAML/markdown against closeoutIntegrity required fields |
| **C** | Do not re-run validator, do not expand scan scope |
| **D** | If exact 2 findings cannot be recovered, open separate analysis gate |

**Recommended route**: Option B (read-only check) within a dedicated recovery phase (v7.152–v7.153).

---

## 5. Correction Strategy

1. Add missing closeoutIntegrity fields only
2. Use real phase commit / closeout / YAML values
3. Do not rewrite historical facts
4. Do not remove existing content
5. Do not touch clean files
6. No broad autofix

---

## 6. Future Gates

```text
v7.152 Batch 003 Exact Finding Recovery Gate    → gate only
v7.153 Batch 003 Exact Finding Recovery          → read-only recovery
v7.154 Batch 003 Correction Implementation Gate  → gate only
v7.155 Batch 003 Correction Implementation       → fix
v7.156 Batch 003 Re-scan Authorization Gate      → gate only
v7.157 Batch 003 Re-scan Execution               → run validator
v7.158 Batch 003 Re-scan Closeout                → closeout
```

---

## 7. Non-permissions

```yaml
non_permissions:
  batch_004_allowed_now: false
  correction_authorized_now: false
  validator_execution_allowed_now: false
  closeout_integrity_fix_allowed_now: false
  production_candidate_002_allowed: false
  memory_write_path_allowed: false
  submitDraft_allowed: false
  cdp_allowed: false
  bridge_allowed: false
  mcp_allowed: false
  image_generation_allowed: false
  autofix_allowed: false
```

---

## 8. Safety Verification

| Check | Result |
|-------|--------|
| Docs mutated | false |
| Validator executed | false |
| CDP / bridge / MCP | false |
| Known untracked file touched | false |

---

## 9. Final State

| Field | Value |
|-------|-------|
| planning_type | batch_003_correction_planning |
| violations_total | 23 |
| unitemized_findings | 2 |
| future_gates | 7 |
| batch_004_allowed_now | false |
| next | v7.152 Exact Finding Recovery Gate |
