# v7.247 Provider Path Decision Package Gate

```yaml
base_contract: AGENTS.md
phase: v7.247_provider_path_decision_package_gate
mode: A4_planning_only
source_commit: 1c3edebc8b61f08423643f6d621d7645dd0676b3
current_status: failed_no_image_repeated_quota_or_rate_limit
same_provider_retry_allowed_now: false
A5_execution_allowed_now: false
provider_contact_allowed_now: false
plugin_call_allowed_now: false
image_generation_allowed_now: false
```

## Purpose

v7.247 creates a paper-only provider path decision package after repeated
Doubao quota/rate-limit failure, state reconciliation, Native Doubao static
hardening, and no-generation diagnostic readiness.

This package helps a human choose one of three routes:

1. external quota resolution
2. provider/model/account path switch
3. continued stop

It does not execute any route.

## Decision Inputs

```yaml
decision_inputs:
  current_failure_category: failed_no_image_repeated_quota_or_rate_limit
  native_doubao_static_hardening_completed: true
  external_quota_resolution_evidence: not_provided
  alternate_provider_model_account_selected: false
  current_output_root_authorized_for_future_path: undecided
  raw_provider_error_available: false
  same_provider_retry_allowed_now: false
```

## Route 1 — External Quota Resolution

```yaml
route_id: ROUTE-1-EXTERNAL-QUOTA-RESOLUTION
status: selectable_later_not_selected_now
purpose: >
  Continue with the same provider/model/account only after a human confirms
  that quota/rate-limit is resolved outside Codex.
requires_before_future_A5:
  - sanitized human confirmation that quota/rate-limit is resolved
  - confirmation that same provider/model/account remains desired
  - fresh active A5 authorization package
  - fresh preflight after repository state is clean
  - max call count explicitly set
  - retry limit explicitly set, default 0
forbidden_evidence:
  - raw provider dashboard screenshots
  - raw provider endpoint dumps
  - secrets, tokens, cookies, billing identifiers
  - raw stderr/stdout from provider or plugin
allowed_now: false
```

## Route 2 — Provider / Model / Account Path Switch

```yaml
route_id: ROUTE-2-PROVIDER-MODEL-ACCOUNT-SWITCH
status: selectable_later_not_selected_now
purpose: >
  Prepare a different provider, model, or account path if Doubao same-path retry
  remains blocked or undesirable.
requires_before_future_A5:
  - human-selected provider/model/account path
  - non-active generation plan patch or new plan
  - non-active authorization package patch or new authorization
  - output root compatibility decision
  - provider-specific redaction policy
  - sandbox and validator plan for the selected route
  - fresh active A5 authorization package before any contact or generation
forbidden_now:
  - provider account login
  - provider console read
  - provider API call
  - plugin call
  - real manifest read
  - .env.local or config.env value read
allowed_now: false
```

## Route 3 — Continued Stop

```yaml
route_id: ROUTE-3-CONTINUED-STOP
status: selected_now
purpose: >
  Keep image generation stopped while preserving product planning, prompt
  package work, review workflows, static validators, and future authorization
  paperwork.
allowed_now: true
continue_allowed_work:
  - prompt package refinement
  - review surface planning
  - static validator hardening
  - non-active authorization templates
  - provider path decision paperwork
blocked_work:
  - same provider retry
  - alternate provider contact
  - plugin call
  - image generation
  - output save
  - memory write
```

## Decision Matrix

| Question | Route 1 | Route 2 | Route 3 |
|---|---|---|---|
| Quota/rate-limit resolved externally? | Required | Not required | Not required |
| Human route selection required? | Yes | Yes | No |
| New active A5 required before execution? | Yes | Yes | N/A |
| Provider contact allowed now? | No | No | No |
| Plugin call allowed now? | No | No | No |
| Image generation allowed now? | No | No | No |
| Safe current choice? | No | No | Yes |

## Current Decision

```yaml
selected_route_now: ROUTE-3-CONTINUED-STOP
reason: >
  No sanitized evidence confirms quota/rate-limit resolution, and no alternate
  provider/model/account path has been selected. Static hardening improves local
  safety but does not resolve provider capacity or authorize a call.
next_decision_needed_from_human:
  - continue stop
  - confirm external quota resolution
  - select alternate provider/model/account path
```

## Future Authorization Requirements

```yaml
future_A5_requirements:
  active_authorization_package_required: true
  provider_path_named: true
  model_named: true
  account_or_execution_surface_named_without_secret_values: true
  output_root_named: true
  max_call_count_named: true
  retry_limit_named: true
  raw_payload_recording_forbidden: true
  raw_response_recording_forbidden: true
  raw_image_payload_public_output_forbidden: true
  memory_write_independent_authorization_required: true
```

## Explicit Non-Authorization

```yaml
not_authorized:
  A5_execution: false
  provider_contact: false
  plugin_call: false
  image_generation: false
  output_save: false
  memory_write: false
  DailyNote_write: false
  runtime_execution: false
  VCPChat_runtime: false
  VCPToolBox_runtime: false
  real_manifest_read: false
  env_local_value_read_or_printed: false
  raw_provider_dashboard_capture: false
  CDP_bridge_MCP: false
  tag_release_deploy: false
```

## Recommended Next

```yaml
recommended_next:
  phase: v7.248_generation_stop_closeout_or_route_selection_request_gate
  type: A4_planning_only
  purpose: >
    Ask for or record the human route decision: continue stop, sanitized quota
    resolved confirmation, or alternate provider/model/account selection.
  auto_execution_allowed: false
```

## Closeout Template

```yaml
closeout:
  phase: v7.247_provider_path_decision_package_gate
  commit_hash:
  commit_message: "docs: add provider path decision package"
  branch: master
  source_commit: 1c3edebc8b61f08423643f6d621d7645dd0676b3
  decision_package:
    route_1_external_quota_resolution_defined: true
    route_2_provider_model_account_switch_defined: true
    route_3_continued_stop_defined: true
    selected_route_now: ROUTE-3-CONTINUED-STOP
    same_provider_retry_allowed_now: false
    A5_execution_allowed_now: false
  safety:
    A5_execution: false
    provider_contact: false
    plugin_call: false
    image_generation: false
    runtime_execution: false
    env_local_value_read_or_printed: false
    memory_write: false
    daily_note_write: false
  recommended_next:
    phase: v7.248_generation_stop_closeout_or_route_selection_request_gate
    auto_execution_allowed: false
  final_state:
    next_phase_started: false
```
