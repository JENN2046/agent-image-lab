# v7.104 — Redaction Validator Spec

> **Formal specification for the Redaction Validator. Defines forbidden raw fields, allowed summary fields, detection rules, violation severity, and required closeout fields. Implementation not started. No script creation. No validator execution.**
>
> **脱敏校验器正式规格说明。定义禁止 raw 字段、允许摘要字段、检测规则、违规严重度和必需的 closeout 字段。未开始实现。不创建脚本。不运行校验器。**

---

## 1. Spec Scope

```yaml
spec_scope:
  phase: v7.104
  spec_type: redaction_validator_spec
  implementation_status: not_started
  runtime_execution: false

  source:
    planning_phase: v7.103
    planning_commit: 72f1d70
    planning_doc: docs/v7_103_boundary_matrix_hardening_redaction_validator_planning.md
```

---

## 2. Validator Purpose

The future Redaction Validator serves five purposes:

1. **Forbidden raw field scanning**: Detect presence of raw JSON, raw payloads, raw memory, and full runtime identifiers in documentation, YAML, and closeout reports.
2. **Redaction consistency checking**: Verify that `redacted_summary_only: true` is consistently applied and not contradicted by unredacted data in the same document.
3. **Closeout field integrity**: Verify each phase closeout contains the required safety fields (`runtime_execution`, `redacted_summary_only`, `raw_payload_recorded`, etc.).
4. **Permission transition detection**: Check that permission statuses have not drifted from `forbidden` to `allowed` without authorization.
5. **Submission guard**: Block commits or reports that contain forbidden raw data fields unless explicitly authorized.

---

## 3. Forbidden Raw Field Rules

The following fields are **forbidden** in documentation, YAML, and closeout reports without explicit authorization:

| # | Forbidden Field | Pattern | Category | Severity |
|---|----------------|---------|----------|----------|
| 1 | `raw_json` | key: `raw_json: true` or raw JSON value | CDP | high |
| 2 | `raw_response` | key: `raw_response: true` or raw response data | bridge | high |
| 3 | `full_webSocketDebuggerUrl` | key match or WS URL pattern `ws://...` | CDP | high |
| 4 | `webSocketDebuggerUrl` | key match or WS URL pattern | CDP | high |
| 5 | `full_raw_target_id` | key match or UUID pattern in target context | CDP | high |
| 6 | `raw_target_id` | key match | CDP | high |
| 7 | `full_url` | key match or file:///http:// URL | CDP | medium |
| 8 | `full_title` | key match or full page title | CDP | medium |
| 9 | `raw_payload` | key match or raw JSON payload | bridge | high |
| 10 | `raw_memory` | key match or raw memory content | MCP | critical |
| 11 | `memory_id` | key match or UUID in memory context | MCP | high |
| 12 | `source_file` | key match or file path | file | high |
| 13 | `absolute_path` | key match or absolute filesystem path | file | medium |
| 14 | `DailyNote_raw_content` | key match or daily note content | memory | critical |
| 15 | `VCP_memory_raw_content` | key match or VCP memory content | memory | critical |
| 16 | `private_runtime_data` | key match or private data pattern | runtime | critical |

---

## 4. Allowed Summary Field Rules

The following fields are **allowed** in redacted reports:

| # | Field | Type | Example |
|---|-------|------|---------|
| 1 | `short_fingerprint` | string (first 8 hex chars) | `A83B8623` |
| 2 | `boolean_presence` | boolean | `true`, `false` |
| 3 | `count` | integer | `target_count: 2` |
| 4 | `redacted_status` | boolean | `redacted_summary_only: true` |
| 5 | `method_names` | string array | `[cancel, loadSession]` |
| 6 | `success_boolean` | boolean | `true`, `false` |
| 7 | `result_type` | string | `object`, `string` |
| 8 | `error_name_redacted` | string | `none`, redacted class name |
| 9 | `error_message_redacted` | string | `none`, redacted text |
| 10 | `phase_id` | string | `v7.99` |
| 11 | `commit_hash` | string (full SHA) | `35b5417` |

---

## 5. Detection Rules

The following detection methods are specified (not implemented):

| # | Rule | Scope | Description |
|---|------|-------|-------------|
| 1 | `exact_key_match` | YAML frontmatter, markdown YAML blocks | Match exact key names (e.g., `raw_json:`) |
| 2 | `case_sensitive_key_match` | All text | Match case-sensitive key names |
| 3 | `suspicious_value_pattern_match` | YAML values, code blocks | Detect raw data patterns (URLs, UUIDs, absolute paths) |
| 4 | `raw_block_presence_check` | Code blocks | Check for unredacted code blocks containing raw data |
| 5 | `yaml_key_scan` | YAML files | Scan all YAML keys against forbidden list |
| 6 | `markdown_code_block_scan` | Markdown files | Check fenced code blocks for raw data patterns |
| 7 | `frontmatter_scan` | Markdown frontmatter | Check YAML frontmatter for forbidden keys |
| 8 | `false_positive_allowlist` | Cross-cutting | Allowlist for known false positives (schema definitions, negative examples) |

---

## 6. Violation Severity

### Critical

Automatic block / immediate flag. Requires human review before any commit or report.

| Field | Reason |
|-------|--------|
| `raw_memory` | Memory content is permanently private |
| `DailyNote_raw_content` | DailyNote content is permanently private |
| `VCP_memory_raw_content` | VCP memory content is permanently private |
| `private_runtime_data` | Runtime data is permanently private |

### High

Requires justification and explicit authorization. Default: block.

| Field | Reason |
|-------|--------|
| `raw_json` | CDP response data |
| `raw_response` | Bridge method response data |
| `webSocketDebuggerUrl` | Full WebSocket endpoint |
| `raw_target_id` | Full CDP target identifier |
| `raw_payload` | Bridge method payload |
| `memory_id` | Memory record identifier |
| `source_file` | Full source file path |

### Medium

Flag for review. Default: warn.

| Field | Reason |
|-------|--------|
| `full_url` | Page URL may contain path info |
| `full_title` | Page title may contain identifying info |
| `absolute_path` | Filesystem path exposure |

### Low

Informational only.

| Field | Reason |
|-------|--------|
| Formatting issues | Missing redaction flag, formatting inconsistencies |

---

## 7. Required Closeout Fields

Every phase closeout must contain the following fields for integrity validation:

| # | Field | Type | Required |
|---|-------|------|----------|
| 1 | `runtime_execution` | boolean | yes |
| 2 | `redacted_summary_only` | boolean | yes |
| 3 | `raw_payload_recorded` | boolean | yes |
| 4 | `known_untracked_file_touched` | boolean | yes |
| 5 | `next_phase_started` | boolean | yes |
| 6 | `commit_hash` | string | yes |
| 7 | `branch` | string | yes |
| 8 | `git_status` | string | yes |
| 9 | `local_scope_result` | string | yes |

---

## 8. Non-goals

```yaml
non_goals:
  script_creation: false
  validator_execution: false
  filesystem_scan: false
  cdp_access: false
  bridge_call: false
  mcp_call: false
  memory_write: false
  image_generation: false
```

This document is a specification only. No code, no execution, no filesystem access.

---

## 9. Safety Verification

| Check | Result |
|-------|--------|
| Validator script created | false |
| Validator executed | false |
| Filesystem scan performed | false |
| CDP WebSocket connected | false |
| Runtime.evaluate called | false |
| Bridge methods called | false |
| MCP called | false |
| Known untracked file touched | false |

---

## 10. Final State

| Field | Value |
|-------|-------|
| spec_type | redaction_validator_spec |
| implementation_status | not_started |
| forbidden_raw_field_rules | 16 |
| allowed_summary_field_rules | 11 |
| detection_rules | 8 |
| violation_severity_levels | 4 (critical, high, medium, low) |
| required_closeout_fields | 9 |
| validator_script_created | false |
| validator_executed | false |
| filesystem_scan_performed | false |
| cdp_accessed | false |
| bridge_called | false |
| mcp_called | false |
| next | v7.105 (Redaction Validator Skeleton Planning or Boundary Matrix Schema Spec) |
