# v7.117a — Scan Loop Correction Patch Planning

> **Patch planning for the scan loop correction. Three findings identified: P1 (list item parsing gap), P2 (glob rejection order), P3 (unused import). No code modification. No validator execution.**
>
> **扫描循环修正的补丁规划。发现三个问题：P1（列表项解析缺陷）、P2（glob 拒绝顺序）、P3（未使用的导入）。不修改代码。不运行校验器。**

---

## 1. Planning Scope

```yaml
planning_scope:
  phase: v7.117a
  planning_type: patch_planning_only
  implementation_authorized_now: false
  validator_execution: false
  runtime_execution: false

  source:
    implementation_phase: v7.117
    implementation_commit: 8594127
```

---

## 2. Findings

### P1 — List Item Parsing Gap (Priority: P1)

**Location**: `parseMinimalMatrix()` in `validator.js`

**Observation**: The current parser uses the regex `^[a-zA-Z_]\w*\s*:$` to detect the start of a new entry block. This matches `action_id:` but **does not** match YAML list item entries starting with `- ` such as:

```yaml
  - action_id: vcpchat_submitDraft
    repo_scope: VCPChat
    allowed_now: true
```

The leading `- ` prefix prevents the parser from recognizing these lines as entry starts. As a result, the `submitDraft_allowed.yaml` fixture (which uses list syntax) may not be parsed into a matrix object with entries, and `permissionDrift.checkPermissionDrift()` will find no entries to check.

**Impact**: `fail/submitDraft_allowed.yaml` fixture may not trigger permissionDrift violations during dry-run.

**Fix scope**: Update the entry-start regex to also match `  - some_key:` patterns (optional dash prefix with whitespace).

### P2 — Glob Rejection Order (Priority: P2)

**Location**: `main()` in `validator.js`

**Observation**: Glob pattern check (`isGlobPattern`) runs **after** `fs.statSync()`. If a file path contains a glob-like character (e.g., `*`), `fs.statSync()` will throw an error, which gets caught as a generic "Cannot access file" warning rather than a clear "Glob pattern rejected" message.

**Fix scope**: Move `isGlobPattern()` check before `fs.statSync()` so glob patterns are explicitly rejected with a clear message.

### P3 — Unused Import (Priority: P3)

**Location**: Top of `validator.js`

**Observation**: `const pathModule = require('path');` is imported but never used in the code.

**Fix scope**: Remove the unused import.

---

## 3. Required Future Patch

### Allowed to modify

| File | Changes required |
|------|-----------------|
| `tools/redaction-validator/validator.js` | 3 fixes: P1 parser, P2 glob order, P3 remove unused import |

### Not allowed to modify

| File | Reason |
|------|--------|
| `tools/redaction-validator/fixtures/*` | Fixtures are correct; not the issue |
| `tools/redaction-validator/rules/*` | Rule logic is correct |
| `package.json` | No dependencies needed |
| CI / hooks | Not in scope |

---

## 4. Safety Constraints

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
  fixture_mutation: false
```

---

## 5. Required Future Gates

```text
v7.117b Scan Loop Correction Patch Implementation Gate  → gate only, no change
v7.117c Scan Loop Correction Patch Implementation       → code change (3 fixes)
v7.118  Corrected Fixture Dry-run Authorization Gate     → gate only
v7.119  Corrected Fixture Dry-run Execution              → run validator
```

---

## 6. Non-goals

```yaml
non_goals:
  code_modification: false
  validator_execution: false
  fixture_mutation: false
  docs_scan: false
  full_repo_scan: false
  production_candidate_002: false
  memory_write_path: false
  submitDraft_probe: false
```

---

## 7. Safety Verification

| Check | Result |
|-------|--------|
| Code modified | false |
| Validator executed | false |
| Fixtures mutated | false |
| CDP / bridge / MCP called | false |
| Known untracked file touched | false |

---

## 8. Final State

| Field | Value |
|-------|-------|
| planning_type | patch_planning_only |
| implementation_authorized_now | false |
| findings_total | 3 (P1, P2, P3) |
| files_allowed_to_modify | 1 |
| future_gates_required | 2 (v7.117b, v7.117c) before dry-run |
| code_modified | false |
| validator_executed | false |
| next | v7.117b Scan Loop Correction Patch Implementation Gate |
