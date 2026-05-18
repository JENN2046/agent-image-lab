# v7.115 — Validator Scan Loop Correction Planning

> **Planning phase for correcting the Redaction Validator scan loop. The skeleton CLI currently accepts file arguments but does not invoke rule modules against them. This plan defines the correction scope, goals, constraints, and expected behavior. No implementation. No validator execution.**
>
> **为修正脱敏校验器扫描循环的规划阶段。骨架 CLI 当前接受文件参数但不调用规则模块。本规划定义修正范围、目标、约束和预期行为。不实现。不运行校验器。**

---

## 1. Planning Scope

```yaml
planning_scope:
  phase: v7.115
  planning_type: correction_planning_only
  implementation_authorized_now: false
  validator_execution: false
  runtime_execution: false

  source:
    dry_run_closeout_phase: v7.114
    dry_run_closeout_commit: c3fddde
```

---

## 2. Observed Limitation

```yaml
observed_limitation:
  validator_accepts_file_args: true
  validator_imports_rule_modules: true
  validator_produces_static_skeleton_report: true
  validator_reads_target_file_contents: false
  validator_calls_scanForbiddenRawFields: false
  validator_calls_checkCloseoutIntegrity: false
  validator_parses_boundary_matrix: false
  expected_fail_fixtures_detected: false
  expected_pass_fixture_result: unknown
```

The core gap is in `validator.js`: the `main()` function iterates over rule module names but does **not** read the target files from `process.argv` or pass them to any rule module's scanning function.

---

## 3. Correction Goals

| # | Goal | Priority |
|---|------|----------|
| 1 | Read explicit target files from `process.argv` | P0 |
| 2 | Reject directory targets (initial version) | P0 |
| 3 | Reject glob patterns (initial version) | P1 |
| 4 | Read files as UTF-8 | P0 |
| 5 | Invoke `forbiddenRawFields.scanForbiddenRawFields(text, path)` on each target | P0 |
| 6 | Invoke `closeoutIntegrity.checkCloseoutIntegrity(text, path)` on each target | P0 |
| 7 | Invoke `permissionDrift.checkPermissionDrift()` only when YAML has `boundary_matrix` / `entries` | P1 |
| 8 | Collect warnings from `allowedSummaryFields` if feasible | P2 |
| 9 | Aggregate violations/warnings/notes across all files and rules | P0 |
| 10 | Preserve exit codes 0/1/2/3 | P0 |
| 11 | Preserve read-only behavior | P0 |

---

## 4. Scope Limits

### Allowed to modify

| File | Rationale |
|------|-----------|
| `tools/redaction-validator/validator.js` | Core orchestrator needs scan loop |
| `tools/redaction-validator/rules/permissionDrift.js` | Minimal adjustment if YAML path handling needed |

### Not allowed to modify

| File | Rationale |
|------|-----------|
| `tools/redaction-validator/fixtures/*` | Fixtures are correct; not the issue |
| `tools/redaction-validator/README.md` | May update only if interface changes |
| `package.json` | No dependencies needed |
| CI / hooks | Not in scope |
| Unrelated files | Out of scope |

---

## 5. Safety Constraints

```yaml
safety_constraints:
  file_writes: false
  network_access: false
  cdp_access: false
  bridge_calls: false
  mcp_calls: false
  memory_write: false
  image_generation: false
  autofix_mode: false
  recursive_directory_scan: false
  glob_patterns: false
  explicit_file_paths_only: true
```

---

## 6. Expected Post-correction Dry-run Behavior

| Fixture | Expected exit | Expected violations |
|---------|---------------|---------------------|
| `pass/redacted_closeout.yaml` (alone) | `0` | 0 |
| `fail/raw_json_present.yaml` | `2` | ≥1 (forbiddenRawFields) |
| `fail/websocket_url_present.yaml` | `2` | ≥1 (forbiddenRawFields) |
| `fail/submitDraft_allowed.yaml` | `2` | ≥1 (permissionDrift) |
| `fail/missing_required_fields.yaml` | `2` | ≥1 (closeoutIntegrity) |
| All 5 fixtures | `2` | ≥4 |

---

## 7. Required Future Gates

```text
v7.116 Scan Loop Correction Implementation Gate   → gate only, no change
v7.117 Scan Loop Correction Implementation         → code change
v7.118 Corrected Fixture Dry-run Authorization Gate → gate only
v7.119 Corrected Fixture Dry-run Execution          → run validator
```

**No real docs scan before corrected fixture dry-run passes.**

---

## 8. Non-goals

```yaml
non_goals:
  implementation: false
  validator_execution: false
  fixture_mutation: false
  docs_scan: false
  full_repo_scan: false
  production_candidate_002: false
  memory_write_path: false
  submitDraft_probe: false
```

---

## 9. Safety Verification

| Check | Result |
|-------|--------|
| Code modified | false |
| Validator executed | false |
| Fixtures mutated | false |
| Docs scanned | false |
| CDP / bridge / MCP called | false |
| Known untracked file touched | false |

---

## 10. Final State

| Field | Value |
|-------|-------|
| planning_type | correction_planning_only |
| implementation_authorized_now | false |
| correction_goals | 11 (7 P0, 2 P1, 1 P2, 1 invariant) |
| files_allowed_to_modify | 1–2 |
| future_gates_required | 4 (v7.116–v7.119) |
| code_modified | false |
| validator_executed | false |
| runtime_execution | false |
| next | v7.116 Scan Loop Correction Implementation Gate |
