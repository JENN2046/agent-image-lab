# v7.144 — Batch 002 Permission Drift Analysis

> **Analysis of 3 permissionDrift findings. Conclusion: rule-scope false positive. No actual permission loosened. Recommended route: validator scope refinement (option B).**
>
> **对 3 项 permissionDrift 发现的分析。结论：规则范围误报。无实际权限放宽。推荐路线：校验器范围精炼（选项 B）。**

---

## 1. Analysis Scope

```yaml
analysis_scope:
  phase: v7.144
  type: permission_drift_analysis
  analysis_executed: true
  correction_authorized_now: false
  runtime_execution: false

  source:
    gate_phase: v7.143
    gate_commit: caf4ea0
  chain_name: Controlled Selected Docs Audit Chain
  batch_id: controlled_selected_docs_batch_002
```

---

## 2. Methodology

| # | File examined | Purpose |
|---|---------------|---------|
| 1 | `tools/redaction-validator/rules/permissionDrift.js` | Rule scope and matching logic |
| 2 | `docs/v7_135_batch_001_residual_correction_planning.yaml` | Source of non_permissions block |
| 3 | `docs/v7_135_batch_001_residual_correction_planning.md` | Markdown version with YAML code block |
| 4 | `docs/v7_142_batch_002_correction_planning.md` | Correction planning context |
| 5 | `docs/v7_142_batch_002_correction_planning.yaml` | Correction planning YAML |

No files were modified. Read-only analysis only.

---

## 3. Root Cause

```yaml
root_cause:
  trigger: "v7_135_batch_001_residual_correction_planning.md contains a YAML code block with a 'non_permissions:' section documenting policy constraints."
  mechanism: "parseMinimalMatrix() in validator.js detects the 'non_permissions:' key pattern, creates a partial matrix object with empty 'entries' and partially populated 'non_permissions'."
  result: "checkPermissionDrift() finds no submitDraft entry (entries empty) and checks non_permissions values, producing 3 false positive violations."
```

## 4. Key Findings

### Q1: True governance violation or rule-scope false positive?

**Rule-scope false positive.** The `non_permissions:` block in v7.135 is a *policy declaration* documenting existing forbidden states. It is not a boundary matrix entry that changes permission status.

### Q2: Does permissionDrift distinguish boundary_matrix/entries from non_permissions declarations?

**No.** `parseMinimalMatrix()` triggers on any YAML text containing `entries:` or `non_permissions:` key patterns, regardless of context. It does not require the file to be a dedicated `boundary_matrix` document.

### Q3: Is any permission actually loosened?

**No.** The v7.135 non_permissions block lists permissions that remain `false`:
- `next_batch_allowed_now: false`
- All other permissions remain forbidden
- No permission was changed from `false` to `true`

### Q4: Are production/memory/submitDraft/CDP/bridge/MCP boundaries affected?

**No.** All boundaries remain intact. The false positive is purely a rule-scope artifact.

---

## 5. Decision

```yaml
drift_decision: rule_scope_false_positive
actual_permission_loosened: false
boundary_affected: false
recommended_route: option_b_validator_scope_refinement
correction_before_rescan_required: true
```

---

## 6. Recommended Route: Option B — Validator Scope Refinement

| Step | Description |
|------|-------------|
| 1 | Modify `parseMinimalMatrix()` to require BOTH `entries:` AND `non_permissions:` keys (or a `boundary_matrix:` top-level key) |
| 2 | Files containing only `non_permissions:` without `entries:` should return `null` |
| 3 | This prevents policy documentation files from triggering permissionDrift rules |
| 4 | No change to `permissionDrift.js` logic itself |
| 5 | Keep existing invariants — they remain valid for actual boundary matrix documents |

### Alternative Option A (doc-side clarification) is second choice.

### Options C and D are not recommended.

---

## 7. Safety Verification

| Check | Result |
|-------|--------|
| Code mutated | false |
| Docs mutated | false |
| Validator executed | false |
| CDP / bridge / MCP | false |
| Known untracked file touched | false |

---

## 8. Final State

| Field | Value |
|-------|-------|
| analysis_executed | true |
| drift_decision | rule_scope_false_positive |
| recommended_route | option_b_validator_scope_refinement |
| actual_permission_loosened | false |
| boundary_affected | false |
| correction_before_rescan_required | true |
| batch_003_allowed_now | false |
| next | v7.145 Batch 002 Correction Implementation Gate |
