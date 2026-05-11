# v7.105 — Boundary Matrix Schema Spec

> **Formal schema specification for the Boundary Matrix data structure. Defines the object structure, entry schema, enum definitions, current entries, non-permissions, and validation rules. Implementation not started. No script creation. No validator execution.**
>
> **边界矩阵数据结构的正式模式规格。定义对象结构、条目模式、枚举定义、当前条目、非权限和校验规则。未开始实现。不创建脚本。不运行校验器。**

---

## 1. Schema Scope

```yaml
schema_scope:
  phase: v7.105
  spec_type: boundary_matrix_schema_spec
  implementation_status: not_started
  runtime_execution: false

  source:
    planning_phase: v7.103
    planning_commit: 72f1d70
    related_redaction_spec_phase: v7.104
    related_redaction_spec_commit: b5fda3a
```

---

## 2. Boundary Matrix Object Structure

```yaml
boundary_matrix:
  schema_version: string       # e.g. "v1"
  matrix_id: string             # unique matrix identifier
  generated_from_phase: string  # source phase ID
  generated_from_commit: string # source commit hash
  generated_date: string        # ISO date

  entries:
    - action_id: string
      # ... entry fields (see section 3)

  non_permissions:
    # ... boolean statuses (see section 6)

  validator_requirements:
    # ... validator references

  recommended_next: string
```

---

## 3. Boundary Matrix Entry Schema

Each action entry in the boundary matrix must contain the following fields:

| # | Field | Type | Required | Description |
|---|-------|------|----------|-------------|
| 1 | `action_id` | string | yes | Unique action identifier |
| 2 | `repo_scope` | enum | yes | One of `repo_scope` values |
| 3 | `action_type` | enum | yes | One of `action_type` values |
| 4 | `allowed_now` | boolean | yes | Current permission status |
| 5 | `permission_status` | enum | yes | One of `permission_status` values |
| 6 | `evidence_source` | string | yes | Phase ID referencing evidence |
| 7 | `required_future_authorization` | string | conditional | Required if not currently allowed |
| 8 | `raw_data_policy` | enum | yes | One of `raw_data_policy` values |
| 9 | `max_calls` | integer | conditional | Required for runtime_probe entries |
| 10 | `retry_allowed` | boolean | conditional | Required for runtime_probe entries |
| 11 | `fallback_allowed` | boolean | conditional | Required for runtime_probe entries |
| 12 | `redaction_required` | boolean | yes | Whether output must be redacted |
| 13 | `validator_required` | boolean | no | Whether a validator should verify this |
| 14 | `forbidden_reason` | string | conditional | Required if `permission_status` is `forbidden_permanent` |
| 15 | `escalation_level` | enum | no | One of `escalation_level` values |

### Example Entry (YAML)

```yaml
- action_id: vcpchat_cancel
  repo_scope: VCPChat
  action_type: read_only
  allowed_now: true
  permission_status: allowed_with_new_authorization
  evidence_source: v7.93
  required_future_authorization: "New A5-style authorization per invocation"
  raw_data_policy: redacted_summary_only
  max_calls: 1
  retry_allowed: false
  fallback_allowed: false
  redaction_required: true
  validator_required: true
  escalation_level: low
```

---

## 4. Enum Definitions

### repo_scope

| Value | Description |
|-------|-------------|
| `agent-image-lab` | This repository (docs, validation, governance) |
| `VCPChat` | VCPChat Electron runtime / UI bridge |
| `VCPToolBox` | VCPToolBox backend / memory / plugin substrate |

### action_type

| Value | Description |
|-------|-------------|
| `read_only` | Read-only operation, no side effects |
| `write_capable` | Operation capable of writing (may be blocked in current implementation) |
| `write_blocked` | Write operation that is permanently blocked |
| `runtime_probe` | Controlled runtime probe with exact scope |
| `docs_only` | Documentation-only operation, no runtime execution |

### permission_status

| Value | Description |
|-------|-------------|
| `allowed_with_new_authorization` | Previously probed; new authorization required per invocation |
| `forbidden_permanent` | Permanently forbidden, never authorized |
| `forbidden_needs_auth` | Currently forbidden; could be authorized with proper A5 package |
| `not_scoped` | Not in current scope; requires new planning |
| `docs_only_allowed` | Documentation only; no runtime execution |

### raw_data_policy

| Value | Description |
|-------|-------------|
| `redacted_summary_only` | Only redacted summary may be recorded |
| `raw_forbidden` | Raw data is permanently forbidden |
| `allowed_if_explicitly_authorized` | Raw data may be recorded if separately authorized |

### escalation_level

| Value | Description |
|-------|-------------|
| `low` | Low risk; standard review sufficient |
| `medium` | Medium risk; requires justification |
| `high` | High risk; requires explicit A5 authorization |
| `critical` | Critical risk; requires maximum security review |

---

## 5. Current Boundary Entries

| # | action_id | repo_scope | action_type | allowed_now | permission_status | evidence |
|---|-----------|------------|-------------|-------------|-------------------|----------|
| 1 | `vcpchat_cancel` | VCPChat | read_only | true | allowed_with_new_authorization | v7.93 |
| 2 | `vcpchat_loadSession` | VCPChat | read_only | true | allowed_with_new_authorization | v7.96 |
| 3 | `vcpchat_previewDraft` | VCPChat | read_only | true | allowed_with_new_authorization | v7.99 |
| 4 | `vcpchat_submitDraft` | VCPChat | write_capable | false | forbidden_permanent | v7.64 |
| 5 | `cdp_instrumental_json` | agent-image-lab | runtime_probe | true | allowed_with_new_authorization | v7.87 |
| 6 | `cdp_websocket_connect` | agent-image-lab | runtime_probe | true | allowed_with_new_authorization | v7.87 |
| 7 | `cdp_runtime_evaluate_surface_probe` | agent-image-lab | runtime_probe | true | allowed_with_new_authorization | v7.90 |
| 8 | `mcp_memory_overview` | VCPToolBox | read_only | false | forbidden_needs_auth | v7.59 |
| 9 | `mcp_search_memory` | VCPToolBox | write_blocked | false | forbidden_permanent | v7.58h |
| 10 | `mcp_record_memory` | VCPToolBox | write_blocked | false | forbidden_permanent | v7.58 |
| 11 | `vcptoolbox_native_routes` | VCPToolBox | write_blocked | false | not_scoped | v7.55j |
| 12 | `production_candidate_002` | agent-image-lab | write_blocked | false | forbidden_needs_auth | v7.100 |
| 13 | `dailynote_write` | VCPToolBox | write_blocked | false | forbidden_needs_auth | global |
| 14 | `vcp_memory_write` | VCPToolBox | write_blocked | false | forbidden_needs_auth | global |
| 15 | `image_generation` | VCPToolBox | write_blocked | false | forbidden_needs_auth | global |
| 16 | `second_LT06` | VCPToolBox | runtime_probe | false | forbidden_needs_auth | v7.59 |

---

## 6. Required Non-permissions Block

```yaml
non_permissions:
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

## 7. Schema Validation Rules

The following validation rules are defined for future implementation:

| # | Rule | Severity | Description |
|---|------|----------|-------------|
| 1 | `UNIQUE_ACTION_ID` | error | Every `action_id` must be unique across all entries |
| 2 | `FORBIDDEN_REASON_REQUIRED` | error | Every `forbidden_permanent` entry must include `forbidden_reason` |
| 3 | `FUTURE_AUTH_REQUIRED` | error | Every `allowed_with_new_authorization` entry must include `required_future_authorization` |
| 4 | `RUNTIME_FIELDS_REQUIRED` | error | Every `runtime_probe` entry must include `max_calls`, `retry_allowed`, `fallback_allowed` |
| 5 | `RAW_DATA_POLICY_EXPLICIT` | error | Every entry must have an explicit `raw_data_policy` |
| 6 | `SUBMIT_DRAFT_FORBIDDEN` | error | `vcpchat_submitDraft` must always be `forbidden_permanent` |
| 7 | `PROD_CANDIDATE_FORBIDDEN` | error | `production_candidate_002` must always be `forbidden_needs_auth` |
| 8 | `MEMORY_WRITE_FORBIDDEN` | error | `memory_write_path` must always be `forbidden_needs_auth` |
| 9 | `NO_STANDING_PERMISSION` | warning | No entry may imply standing runtime permission without explicit authorization |
| 10 | `EVIDENCE_PHASE_EXISTS` | warning | `evidence_source` should reference an existing phase |

---

## 8. Non-goals

```yaml
non_goals:
  schema_file_generation: false
  validator_script_creation: false
  validator_execution: false
  filesystem_scan: false
  runtime_action: false
  permission_change: false
```

This document is a specification only. No code, no execution, no filesystem access, no permission changes.

---

## 9. Safety Verification

| Check | Result |
|-------|--------|
| Validator script created | false |
| Validator executed | false |
| Schema file generated | false |
| Filesystem scan performed | false |
| CDP / bridge / MCP called | false |
| Known untracked file touched | false |
| Permission changed | false |

---

## 10. Final State

| Field | Value |
|-------|-------|
| spec_type | boundary_matrix_schema_spec |
| implementation_status | not_started |
| schema_fields_per_entry | 15 |
| enum_definitions | 5 (repo_scope, action_type, permission_status, raw_data_policy, escalation_level) |
| enum_values_total | 23 |
| current_boundary_entries | 16 |
| validation_rules | 10 |
| validator_script_created | false |
| schema_file_generated | false |
| runtime_execution | false |
| permission_changed | false |
| next | v7.106 (Boundary Matrix YAML Draft or Redaction Validator Skeleton Planning) |
