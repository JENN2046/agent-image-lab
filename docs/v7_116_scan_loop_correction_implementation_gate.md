# v7.116 — Scan Loop Correction Implementation Gate

> **Implementation authorization gate for the validator scan loop correction. Defines scope: 1-2 files, 10 requirements, read-only safety. Implementation not authorized. No validator execution.**
>
> **校验器扫描循环修正的实现授权门。定义范围：1-2 个文件，10 项要求，只读安全。未授权实现。不运行校验器。**

---

## 1. Gate Scope

```yaml
gate_scope:
  phase: v7.116
  gate_type: implementation_authorization_gate
  implementation_authorized_now: false
  validator_execution_authorized_now: false
  runtime_execution: false

  source:
    planning_phase: v7.115
    planning_commit: 5647db4
```

---

## 2. Files Allowed to Modify

| File | Reason | Required |
|------|--------|----------|
| `tools/redaction-validator/validator.js` | Must implement file reading and scan loop | yes |
| `tools/redaction-validator/rules/permissionDrift.js` | Minimal adjustment for YAML parsing | only if strictly needed |

---

## 3. Implementation Requirements

| # | Requirement | Priority |
|---|-------------|----------|
| 1 | Read explicit file paths from `process.argv` | P0 |
| 2 | Reject directory targets | P0 |
| 3 | Reject glob patterns | P1 |
| 4 | Read target files as UTF-8 | P0 |
| 5 | Invoke `forbiddenRawFields.scanForbiddenRawFields(text, filePath)` on each target | P0 |
| 6 | Invoke `closeoutIntegrity.checkCloseoutIntegrity(text, filePath)` on each target | P0 |
| 7 | Invoke `permissionDrift.checkPermissionDrift(matrixObject)` only when YAML has boundary_matrix shape | P1 |
| 8 | Aggregate violations, warnings, and notes across all files and rules | P0 |
| 9 | Preserve exit codes 0/1/2/3 | P0 |
| 10 | Preserve read-only behavior (no file writes, no network, no CDP, no bridge, no MCP) | P0 |

---

## 4. Post-implementation Verification

After implementation, the following must be confirmed:
- `node --check validator.js` passes
- `node --check rules/permissionDrift.js` passes
- Exit codes unchanged (0/1/2/3)
- No file writes
- No network calls
- No new dependencies

---

## 5. Safety Verification

| Check | Result |
|-------|--------|
| Code modified | false |
| Validator executed | false |
| Fixtures mutated | false |
| Dependencies added | false |
| CI / hook created | false |
| CDP / bridge / MCP called | false |
| Known untracked file touched | false |

---

## 6. Final State

| Field | Value |
|-------|-------|
| gate_type | implementation_authorization_gate |
| implementation_authorized_now | false |
| files_allowed_to_modify | 1-2 |
| requirements | 10 |
| code_modified | false |
| validator_executed | false |
| runtime_execution | false |
| next | v7.117 Scan Loop Correction Implementation |
