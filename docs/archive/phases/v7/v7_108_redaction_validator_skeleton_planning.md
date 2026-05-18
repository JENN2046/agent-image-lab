# v7.108 — Redaction Validator Skeleton Planning

> **Skeleton planning for the Redaction Validator. Defines file layout, module responsibilities, input targets, output format, exit codes, rule categories, safety constraints, and testing strategy. No code creation. No validator execution.**
>
> **脱敏校验器的骨架规划。定义文件布局、模块职责、输入目标、输出格式、退出码、规则类别、安全约束和测试策略。不创建代码。不运行校验器。**

---

## 1. Planning Scope

```yaml
planning_scope:
  phase: v7.108
  planning_type: skeleton_planning_only
  implementation_status: not_started
  runtime_execution: false

  source:
    review_phase: v7.107
    review_commit: ec5c113
    spec_phase: v7.104
    spec_commit: b5fda3a
    matrix_phase: v7.106
    matrix_commit: e66f604
```

---

## 2. Proposed File Layout

The following directory structure is proposed for future implementation. **No directories or files will be created in this phase.**

```
tools/redaction-validator/
├── README.md                      # Validator overview and usage
├── validator.js                   # CLI entrypoint, config, orchestration
├── rules/
│   ├── forbiddenRawFields.js      # Scan for forbidden raw field keys/patterns
│   ├── allowedSummaryFields.js    # Preserve allowlist behavior
│   ├── closeoutIntegrity.js       # Check required closeout fields
│   └── permissionDrift.js         # Compare boundary matrix against invariants
├── fixtures/
│   ├── pass/
│   │   └── redacted_closeout.yaml
│   └── fail/
│       ├── raw_json_present.yaml
│       ├── websocket_url_present.yaml
│       ├── submitDraft_allowed.yaml
│       └── missing_required_fields.yaml
```

---

## 3. Module Responsibilities

### 3.1 `validator.js` — CLI Entrypoint

| Responsibility | Description |
|---------------|-------------|
| CLI parsing | Accept target paths, config flags |
| Config loading | Load rule configuration from args or defaults |
| File collection | Recursively collect `.md` and `.yaml` files from target paths |
| Rule orchestration | Run each rule module against collected files |
| Report aggregation | Aggregate results from all rule modules |
| Exit code | Return appropriate exit code (0/1/2/3) |

### 3.2 `forbiddenRawFields.js` — Forbidden Raw Field Scanner

| Responsibility | Description |
|---------------|-------------|
| Key scanning | Scan YAML frontmatter and inline blocks for forbidden keys |
| Pattern matching | Detect suspicious raw data value patterns |
| Raw field keys | `raw_json`, `raw_response`, `webSocketDebuggerUrl`, `raw_target_id`, `raw_payload`, `raw_memory`, `memory_id`, `source_file`, `absolute_path`, `DailyNote_raw_content`, `VCP_memory_raw_content`, `private_runtime_data` |
| Severity assignment | critical / high / medium / low per spec |

### 3.3 `allowedSummaryFields.js` — Allowed Summary Field Validator

| Responsibility | Description |
|---------------|-------------|
| Allowlist enforcement | Verify only allowed fields appear in redacted sections |
| Allowed fields | `short_fingerprint`, `boolean_presence`, `count`, `redacted_status`, `method_names`, `success_boolean`, `result_type`, `error_name_redacted`, `error_message_redacted`, `phase_id`, `commit_hash` |

### 3.4 `closeoutIntegrity.js` — Closeout Integrity Checker

| Responsibility | Description |
|---------------|-------------|
| Required fields | Check each closeout for: `runtime_execution`, `redacted_summary_only`, `raw_payload_recorded`, `known_untracked_file_touched`, `next_phase_started`, `commit_hash`, `branch`, `git_status`, `local_scope_result` |

### 3.5 `permissionDrift.js` — Permission Drift Detector

| Responsibility | Description |
|---------------|-------------|
| Matrix parsing | Load and parse `v7_106_boundary_matrix_yaml_draft.yaml` |
| Invariant checks | Verify `submitDraft` still `forbidden_permanent`, `production_candidate_002` still `forbidden_needs_auth`, etc. |
| Drift detection | Detect any entry where `allowed_now` changed without authorization |

---

## 4. Input Targets

```yaml
input_targets:
  - pattern: "docs/**/*.md"
    recursive: true
  - pattern: "docs/**/*.yaml"
    recursive: true
  - pattern: ".agent_board/CHECKPOINT.md"
    recursive: false
  - pattern: "README.md"
    recursive: false
  - pattern: "docs/v7_106_boundary_matrix_yaml_draft.yaml"
    recursive: false
```

---

## 5. Output Format

The validator will produce both a JSON summary (for machine consumption) and a human-readable markdown summary (for PR review).

```yaml
output_format:
  json_summary:
    scanned_files: integer
    rule_results:
      - rule_name: string
        files_scanned: integer
        violations: integer
        warnings: integer
        notes: integer
    overall:
      decision: pass | warning | block
      exit_code: 0 | 1 | 2 | 3

  markdown_summary:
    - Rule Results table
    - Violation Details table
    - Warnings table
    - Decision statement
```

---

## 6. Exit Codes

| Code | Description | Decision | When |
|------|-------------|----------|------|
| `0` | Pass | `pass` | No violations or warnings |
| `1` | Warning only | `warning` | Non-blocking issues found (formatting, notes) |
| `2` | Violation block | `block` | Forbidden raw field, permission drift, missing required field |
| `3` | Internal error | `error` | Validator itself failed to load or run |

---

## 7. Rule Categories

| # | Rule | Module | Violation Level |
|---|------|--------|-----------------|
| 1 | `forbidden_raw_field_scan` | `forbiddenRawFields.js` | block (critical/high), warning (medium) |
| 2 | `redaction_consistency_check` | `forbiddenRawFields.js` | warning |
| 3 | `closeout_required_fields_check` | `closeoutIntegrity.js` | block |
| 4 | `boundary_matrix_permission_drift_check` | `permissionDrift.js` | block |
| 5 | `known_untracked_policy_check` | `closeoutIntegrity.js` | note |

---

## 8. Safety Constraints

```yaml
safety_constraints:
  initial_version_must_be_read_only: true

  may_not:
    - call_cdp
    - call_bridge
    - call_mcp
    - write_memory
    - generate_images
    - modify_files
    - network_access

  file_access:
    read_only: true
    write_only: false

  autofix_mode:
    allowed: false
    note: future consideration only
```

---

## 9. Testing Strategy

| # | Test | Type | Expected |
|---|------|------|----------|
| 1 | Redacted closeout (pass fixture) | pass | exit 0, no violations |
| 2 | `raw_json: true` present | fail | exit 2, violation detected |
| 3 | `webSocketDebuggerUrl` present | fail | exit 2, violation detected |
| 4 | `submitDraft` marked `allowed_now: true` | fail | exit 2, drift detected |
| 5 | Missing required closeout fields | fail | exit 2, missing fields detected |

All fixtures are planning-only. No files will be created in this phase.

---

## 10. Non-goals

```yaml
non_goals:
  code_creation: false
  directory_creation: false
  script_creation: false
  validator_execution: false
  filesystem_scan: false
  permission_change: false
  runtime_action: false
  production_candidate_002: false
  memory_write_path: false
  submitDraft_probe: false
```

---

## 11. Safety Verification

| Check | Result |
|-------|--------|
| Code created | false |
| Directory created | false |
| Script created | false |
| Validator executed | false |
| Filesystem scan performed | false |
| CDP / bridge / MCP called | false |
| Known untracked file touched | false |

---

## 12. Final State

| Field | Value |
|-------|-------|
| planning_type | skeleton_planning_only |
| implementation_status | not_started |
| proposed_modules | 5 (validator.js + 4 rule modules) |
| proposed_fixtures | 5 (1 pass + 4 fail) |
| input_target_patterns | 5 |
| rule_categories | 5 |
| exit_codes | 4 |
| safety_constraints | 10 |
| code_created | false |
| directory_created | false |
| validator_executed | false |
| runtime_execution | false |
| next | v7.109 (Redaction Validator Skeleton Implementation Gate or Validator Fixture Planning) |
