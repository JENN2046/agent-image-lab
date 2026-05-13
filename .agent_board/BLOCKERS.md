# BLOCKERS.md — Agent Image Lab

## Active Blockers

```text
1. Default A4 docs-only continuation is blocked unless the next task creates clear non-redundant product value.
2. Active A5 product image execution is blocked by repeated Doubao quota/rate-limit failure; same provider/model/account retry is not allowed now.
3. Active A5 product image execution is blocked by execution surface mismatch: the approval phrase matches AUTH-PENDING-20260512-001, but no safe callable VCPToolBox / DoubaoGen execution entry is available in the current tool surface. Native/local runners require additional scope such as env/config or plugin-dir access and must not be substituted silently.
4. AUTH-PENDING-20260512-001 has been consumed by one DoubaoGen process attempt. It failed with no image, and retry_limit=0 blocks another generation call without a new explicit retry authorization.
5. Exact DoubaoGen provider root cause is unavailable from retained evidence because raw stdout/stderr was not printed or retained; only an inconclusive provider/API-layer failure category can be recorded.
6. The newly approved diagnostic retry was also consumed once and failed with sanitized_error_category=quota_or_rate_limit. Immediate further retries are blocked unless provider quota/rate-limit conditions are resolved or a new explicit generation path is approved.
7. A second newly approved diagnostic retry was consumed once and again failed with sanitized_error_category=quota_or_rate_limit. Continuing the same provider/model/account path without resolving quota or switching path is blocked.
8. current_status: failed_no_image_repeated_quota_or_rate_limit.
9. Native Doubao execution surface has completed v7.245_native_doubao_syntax_and_sandbox_hardening, but same provider/model/account retry remains blocked until v7.246_no_generation_quota_or_provider_path_diagnostic_readiness_gate resolves the path decision.
10. v7.246 diagnostic decision is continue_generation_stop_until_route_selection; next paper-only step is v7.247_provider_path_decision_package_gate.
11. v7.247 provider path decision selected ROUTE-3-CONTINUED-STOP now.
12. v7.248 generation stop closeout is complete; any new A5 path now requires explicit human route selection: Route 1 quota resolution, Route 2 provider/model/account switch, or Route 3 continued stop.
13. recommended_next: human_route_selection_required_before_any_new_A5.
14. v7.249 static Review Surface product spec keeps generation stopped and recommends v7.250_review_record_template_and_status_flow_gate.
15. v7.250 review record template and status flow keeps generation stopped and recommends v7.251_static_review_surface_acceptance_checklist_gate.
16. v7.251 static Review Surface acceptance checklist keeps generation stopped and recommends v7.252_static_review_surface_mockup_readiness_review_gate.
```

## Current Mainline Quality Stop

```text
latest_quality_stop: v7.221
latest_synced_commit_before_board_calibration: c605bd7
continue_A4_docs_only_by_default: false
next_requires_new_value_or_explicit_authorization: true
```

## Standing External-Read Gate

```text
Real VCPChat, real VCPToolBox, and real manifest reads are blocked until the user provides explicit authorization with exact paths, allowed file list, allowed excerpts, forbidden excerpts, reviewer, and stop conditions.
```

## Standing Remote-Action Gate

```text
Guarded local commits are authorized only when all project auto-commit conditions pass. Push, tag, release, PR, merge, or remote issue changes require explicit separate authorization, standing authorization, and passing preflight.
```

## Standing Real-Execution Gate

```text
Plugin calls, API calls, DailyNote writes, VCP memory writes, image creation, runtime execution, and executable Adapter entrypoints require explicit separate authorization.
```

## Standing A5 Production-Execution Gate

```text
Without an active authorization package, production actions remain blocked. A5 authorization must name exact target systems, allowed paths or objects, allowed commands or operations, forbidden operations, write boundaries, validation requirements, rollback path, reviewer, and stop conditions.
```

## Historical Closed Gates

```text
Validator Governance Chain v1: closed
batch_005_allowed_now: false
production_candidate_002_allowed_now: false
memory_write_path_allowed_now: false

Historical A5 actions consumed their respective authorizations. They do not authorize new provider contact, plugin/API calls, DailyNote writes, VCP memory writes, image creation, runtime integration, tag, push, release, or external repository modification.
```

## Blocker Template

```text
## BLOCKER-YYYYMMDD-NN — Title

Status:
Detected during:
Task:
Reason:
Hard stop gate:
Files involved:
Validation state:
Why the agent stopped:
Required human decision:
Safe next action:
Rollback or cleanup path:
```
