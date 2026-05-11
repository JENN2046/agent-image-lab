# v7.145 — Batch 002 Correction Implementation Gate

> **Implementation gate for Batch 002 corrections. Two scopes: (1) validator parseMinimalMatrix scope refinement, (2) closeoutIntegrity fields for 7 docs. Correction not authorized.**
>
> **Batch 002 修正的实现门。两个范围：(1) 校验器 parseMinimalMatrix 范围精炼，(2) 7 个文档的 closeoutIntegrity 字段。未授权修正。**

---

## 1. Gate Scope

```yaml
gate_scope:
  phase: v7.145
  gate_type: batch_002_correction_implementation_gate
  correction_authorized_now: false
  validator_execution_authorized_now: false
  runtime_execution: false

  source:
    analysis_phase: v7.144
    analysis_commit: c47cf78
  chain_name: Controlled Selected Docs Audit Chain
  batch_id: controlled_selected_docs_batch_002
```

---

## 2. Correction Targets

### Validator-side scope refinement

| File | Purpose |
|------|---------|
| `tools/redaction-validator/validator.js` | Refine `parseMinimalMatrix` to require explicit matrix shape |

**Allowed change**: Only files containing `boundary_matrix` top-level key OR `entries` + `non_permissions` shape should trigger permissionDrift. `non_permissions`-only policy declarations must return `null`.

### Docs-side closeoutIntegrity correction

| # | File | Reason |
|---|------|--------|
| 1 | `docs/v7_139_batch_001_final_rescan_execution_closeout.md` | closeoutIntegrity violations |
| 2 | `docs/v7_139_batch_001_final_rescan_execution_closeout.yaml` | closeoutIntegrity violations |
| 3 | `docs/v7_138_batch_001_final_rescan_authorization_gate.md` | closeoutIntegrity violations |
| 4 | `docs/v7_138_batch_001_final_rescan_authorization_gate.yaml` | closeoutIntegrity violations |
| 5 | `docs/v7_136_batch_001_residual_correction_implementation_gate.md` | closeoutIntegrity violations |
| 6 | `docs/v7_136_batch_001_residual_correction_implementation_gate.yaml` | closeoutIntegrity violations |
| 7 | `docs/v7_135_batch_001_residual_correction_planning.md` | closeoutIntegrity violations |

---

## 3. Allowed Correction Pattern

1. Add missing closeoutIntegrity fields only
2. Refine validator scope only for permissionDrift false positive
3. Do not rewrite historical facts
4. Do not remove existing content
5. Do not touch files outside explicit allowed list
6. Do not execute validator during implementation

---

## 4. Validator Scope Refinement Requirements

`parseMinimalMatrix()` should require:
- `boundary_matrix` top-level key, OR
- `entries` plus `non_permissions` shape

`non_permissions`-only policy declarations must not trigger permissionDrift.

---

## 5. Safety Constraints

```yaml
safety_constraints:
  validator_execution: false
  docs_scan: false
  repo_scan: false
  batch_003: false
  production_candidate: false
  memory_write: false
  submitDraft: false
  cdp_bridge_mcp: false
  image_generation: false
  ci_hook: false
  dependency_change: false
```

---

## 6. Safety Verification

| Check | Result |
|-------|--------|
| Validator code mutated | false |
| Docs mutated | false |
| Validator executed | false |
| CDP / bridge / MCP | false |
| Known untracked file touched | false |

---

## 7. Final State

| Field | Value |
|-------|-------|
| gate_type | batch_002_correction_implementation_gate |
| correction_authorized_now | false |
| validator_files_to_modify | 1 |
| docs_files_to_modify | 7 |
| batch_003_allowed_now | false |
| next | v7.146 Batch 002 Correction Implementation |
