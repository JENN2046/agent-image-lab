# v7.113 — Validator Fixture Dry-run Authorization Gate

> **Dry-run authorization gate for the Redaction Validator. Defines scope: fixtures only, 1 run max, read-only. No full repo scan. No docs scan. No CI. No hooks. Dry-run not authorized.**
>
> **脱敏校验器的 dry-run 授权门。定义范围：仅 fixture，最多 1 次运行，只读。不扫描全仓库。不扫描 docs。不集成 CI。不创建 hooks。Dry-run 未授权。**

---

## 1. Gate Scope

```yaml
gate_scope:
  phase: v7.113
  gate_type: dry_run_authorization_gate
  dry_run_authorized_now: false
  runtime_execution: false

  source:
    fixture_review_phase: v7.112
    fixture_review_commit: db38da0
```

---

## 2. Dry-run Authorization

```yaml
dry_run_authorization:
  dry_run_authorization_gate_defined: true
  dry_run_authorized_now: false
  max_validator_runs: 1
  allowed_target_scope: fixtures_only
```

---

## 3. Allowed / Forbidden Scope

| Action | Status |
|--------|--------|
| **Allowed** | |
| Run validator on `fixtures/` directory only | ✅ |
| Observe validator output | ✅ |
| Record violations/warnings | ✅ |
| **Forbidden** | |
| Full repo scan | ❌ |
| `docs/` scan | ❌ |
| `.agent_board/` scan | ❌ |
| `README.md` scan | ❌ |
| File write | ❌ |
| Network access | ❌ |
| CDP access | ❌ |
| Bridge call | ❌ |
| MCP call | ❌ |
| CI integration | ❌ |
| Hook creation | ❌ |

---

## 4. Exact Authorized Command

If dry-run is authorized, the exact command allowed is:

```bash
node tools/redaction-validator/validator.js \
  tools/redaction-validator/fixtures/pass/redacted_closeout.yaml \
  tools/redaction-validator/fixtures/fail/raw_json_present.yaml \
  tools/redaction-validator/fixtures/fail/websocket_url_present.yaml \
  tools/redaction-validator/fixtures/fail/submitDraft_allowed.yaml \
  tools/redaction-validator/fixtures/fail/missing_required_fields.yaml
```

No additional arguments, no glob patterns, no directory traversal.

---

## 5. Expected Outcomes

```yaml
expected_outcomes:
  pass_fixture:
    - id: redacted_closeout.yaml
    - expected_behavior: ideally produces no violation
    - note: skeleton may not fully implement scan; partial results are acceptable

  fail_fixtures:
    - id: raw_json_present.yaml
      expected_violation_type: forbiddenRawFields
    - id: websocket_url_present.yaml
      expected_violation_type: forbiddenRawFields
    - id: submitDraft_allowed.yaml
      expected_violation_type: permissionDrift
    - id: missing_required_fields.yaml
      expected_violation_type: closeoutIntegrity

  skeleton_limitation:
    any_mismatch_must_be_recorded_as_skeleton_limitation: true
    no_code_modification_during_dry_run: true
```

---

## 6. Future Execution Constraint

```yaml
future_execution_constraint:
  dry_run_authorization_required: true
  separate_authorization_phrase_required: true
  max_one_run: true
  file_mutation_forbidden: true
  scan_scope_mutation_forbidden: true
```

---

## 7. Safety Verification

| Check | Result |
|-------|--------|
| Validator executed | false |
| Full repo scan performed | false |
| File write performed | false |
| Network access | false |
| CDP / bridge / MCP called | false |
| CI / hook created | false |
| Known untracked file touched | false |

---

## 8. Final State

| Field | Value |
|-------|-------|
| gate_type | dry_run_authorization_gate |
| dry_run_authorized_now | false |
| max_validator_runs | 1 |
| allowed_target_scope | fixtures_only |
| full_repo_scan_allowed | false |
| docs_scan_allowed | false |
| agent_board_scan_allowed | false |
| file_write_allowed | false |
| network_access_allowed | false |
| cdp_access_allowed | false |
| bridge_call_allowed | false |
| mcp_call_allowed | false |
| ci_integration_allowed | false |
| validator_executed | false |
| runtime_execution | false |
| next | v7.114 Validator Fixture Dry-run Execution |
