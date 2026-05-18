# v7.103 — Boundary Matrix Hardening / Redaction Validator Planning

> **Planning phase for hardening the v7.102 boundary matrix into a verifiable schema and designing a redaction validator. Docs-only. No script creation. No validator execution.**
>
> **规划阶段：将 v7.102 边界矩阵加固为可验证模式，并设计脱敏校验器。仅文档。不创建脚本。不运行校验器。**

---

## 1. Scope

```yaml
scope:
  phase: v7.103
  document_type: planning_only
  hardening_type: planning_only
  runtime_execution: false
  source_phase: v7.102
  source_commit: aeaf8e5
  matrix_source: docs/v7_102_cross_repo_boundary_audit.md
```

---

## 2. Boundary Matrix Schema Planning

The following schema fields are proposed for formalizing the boundary matrix into a machine-readable YAML or JS-validateable format:

| # | Field | Type | Required | Description |
|---|-------|------|----------|-------------|
| 1 | `action_id` | string | yes | Unique action identifier (e.g. `vcpchat_cancel`) |
| 2 | `repo_scope` | enum | yes | `agent-image-lab`, `VCPChat`, `VCPToolBox` |
| 3 | `action_type` | enum | yes | `read_only`, `write_capable`, `write_blocked` |
| 4 | `allowed_now` | boolean | yes | Current permission status |
| 5 | `permission_status` | enum | yes | `allowed`, `forbidden_permanent`, `forbidden_needs_auth`, `not_scoped` |
| 6 | `evidence_source` | string | yes | Phase ID referencing the evidence doc |
| 7 | `required_future_authorization` | string | conditional | A5-style authorization description if not currently allowed |
| 8 | `raw_data_policy` | enum | yes | `redacted_summary_only`, `forbidden`, `allowed_if_authorized` |
| 9 | `max_calls` | integer | conditional | Maximum calls per authorization |
| 10 | `retry_allowed` | boolean | conditional | Retry policy |
| 11 | `fallback_allowed` | boolean | conditional | Fallback policy |
| 12 | `redaction_required` | boolean | yes | Whether output must be redacted |
| 13 | `validator_required` | boolean | no | Whether a machine validator should verify this |
| 14 | `forbidden_reason` | string | conditional | Reason if permanently forbidden |
| 15 | `escalation_level` | enum | no | `low`, `medium`, `high`, `critical` |

---

## 3. Redaction Validator Planning

### 3.1 Forbidden Raw Fields (scanner targets)

The future redaction validator should detect presence of the following forbidden raw fields in documentation and reports:

| # | Forbidden Field | Category | Severity |
|---|----------------|----------|----------|
| 1 | `raw_json` | CDP | high |
| 2 | `raw_response` | bridge | high |
| 3 | `full_webSocketDebuggerUrl` | CDP | high |
| 4 | `webSocketDebuggerUrl` | CDP | high |
| 5 | `full_raw_target_id` | CDP | high |
| 6 | `raw_target_id` | CDP | high |
| 7 | `full_url` | CDP | high |
| 8 | `full_title` | CDP | medium |
| 9 | `raw_payload` | bridge | high |
| 10 | `raw_memory` | MCP | critical |
| 11 | `memory_id` | MCP | high |
| 12 | `source_file` | file | high |
| 13 | `absolute_path` | file | medium |
| 14 | `DailyNote_raw_content` | memory | critical |
| 15 | `VCP_memory_raw_content` | memory | critical |
| 16 | `private_runtime_data` | runtime | critical |

**Scanner logic sketch**: Each phase closeout doc and YAML should be scanned for patterns matching these fields (e.g., `raw_json:\s*true` or presence of potential raw data output).

### 3.2 Allowed Summary Fields

The following fields are permitted in redacted reports:

| # | Field | Example |
|---|-------|---------|
| 1 | Short fingerprint | `A83B8623` |
| 2 | Boolean presence | `true` / `false` |
| 3 | Count | `target_count: 2` |
| 4 | Redacted status | `redacted_summary_only: true` |
| 5 | Method names | `cancel`, `loadSession` |
| 6 | Success boolean | `true` / `false` |
| 7 | Result type | `object`, `string` |
| 8 | Redacted error name | `error_name_redacted: none` |
| 9 | Redacted error message | `error_message_redacted: none` |
| 10 | Phase ID | `v7.99` |
| 11 | Commit hash | `35b5417` |

---

## 4. Validator Non-goals

```yaml
validator_non_goals:
  script_creation: false
  runtime_execution: false
  cdp_access: false
  bridge_call: false
  mcp_call: false
  memory_write: false
  image_generation: false
```

This document does not create or run any validator. All validator planning is hypothetical and schema-only.

---

## 5. Future Validator Candidates

| # | Validator | Purpose | Priority |
|---|-----------|---------|----------|
| 1 | `boundary_matrix_schema_validator` | Validate boundary matrix YAML against schema | high |
| 2 | `redaction_report_validator` | Check closeout docs for forbidden raw fields | high |
| 3 | `forbidden_raw_field_scanner` | Scan all docs for accidental raw data presence | medium |
| 4 | `phase_closeout_integrity_checker` | Verify each phase closeout has required fields | medium |
| 5 | `runtime_permission_transition_checker` | Verify no unauthorized permission transitions | medium |

All candidates are planning-only. No implementation in this phase.

---

## 6. Current Non-permissions

```yaml
current_non_permissions:
  production_candidate_002_allowed_now: false
  memory_write_path_allowed_now: false
  submitDraft_invocation_allowed: false
  second_LT06_allowed_now: false
  DailyNote_write_allowed_now: false
  VCP_memory_write_allowed_now: false
  image_generation_allowed_now: false
  MCP_search_memory_allowed_now: false
  MCP_record_memory_allowed_now: false
  VCPToolBox_native_routes_allowed_now: false
```

---

## 7. Safety Verification

| Check | Result |
|-------|--------|
| CDP WebSocket connected | false |
| Runtime.evaluate called | false |
| Bridge methods called | false |
| MCP / VCPToolBox runtime called | false |
| Validator script created | false |
| Validator executed | false |
| Known untracked file touched | false |

---

## 8. Final State

| Field | Value |
|-------|-------|
| hardening_type | planning_only |
| schema_fields_proposed | 15 |
| forbidden_raw_fields_identified | 16 |
| allowed_summary_fields | 11 |
| future_validator_candidates | 5 |
| validator_script_created | false |
| validator_executed | false |
| cdp_accessed | false |
| bridge_methods_called | false |
| mcp_called | false |
| current_non_permissions_maintained | true |
| next | v7.104 Redaction Validator Spec |
