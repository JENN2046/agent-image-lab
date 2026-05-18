# v7.60 — VCPChat Surface Check Planning

> **Planning only. No real VCPChat access. No Electron launch. No bridge call. No MCP call.**

---

## 1. Context

Post-LT-06 context:

- LT-06 memory_overview real read-only dry-run executed successfully (v7.59)
- A5 authorization pattern established: exact payload, one-call, no-retry, no-fallback, redacted summary only
- A5 consumed, remaining = 0
- VCPToolBox embedded MCP route at `http://127.0.0.1:6005/mcp/codex-memory` confirmed reachable
- Previous VCPChat surface planning recorded at v7.50e (already defined surface goals, safety gates, and execution boundary)

## 2. Proposed VCPChat Surface Inventory

The following VCPChat surfaces are candidates for future read-only surface check:

```yaml
vcpchat_surface_inventory:
  review_console:
    - imageLabReview bridge surface (loadSession, previewDraft)
    - candidate_review_state display
    - preauthorization_status display
    - batch_decision_draft display
    - a5_preauthorization_review_package_draft display

  subwindow_integration:
    - Phase E IPC channels (4 channels defined)
    - sender validation
    - payload validation
    - error handling

  security_boundary:
    - Electron context isolation
    - preload script allowlist
    - IPC sender origin check
    - no memory write button
    - no image generation button
    - no retry button
    - no raw payload display
    - no private path exposure
```

## 3. Allowed Read-only Planning Checks

```yaml
allowed_planning_checks:
  - review_existing_vcpchat_docs: true
  - review_existing_safety_gates: true
  - review_existing_ipc_contract: true
  - review_existing_security_checklist: true
  - define_surface_check_criteria: true
  - define_authorization_gates: true
  - define_risk_matrix: true
```

## 4. Forbidden Execution Paths

```yaml
forbidden_in_this_phase:
  - start_electron: true
  - start_remote_debug: true
  - start_cdp: true
  - call_vcpchat_bridge: true
  - call_loadSession: true
  - call_previewDraft: true
  - call_submitDraft: true
  - call_mcp_codex_memory: true
  - call_search_memory: true
  - call_record_memory: true
  - call_native_vcp_routes: true
  - call_v1_api: true
  - call_plugin_callback: true
  - write_dailynote: true
  - write_vcp_memory: true
  - generate_image: true
  - execute_lt06: true
```

## 5. Authorization Gates for Future Real Execution

Any future real VCPChat surface check requires passing all gates:

```yaml
future_authorization_gates:
  gate_1_exact_scope:
    - exact_surfaces_to_check
    - exact_bridge_methods
    - exact_payloads
    - max_calls

  gate_2_security_preflight:
    - electron_context_isolation_confirmed
    - preload_allowlist_confirmed
    - ipc_channel_allowlist_confirmed
    - no_raw_payload_exposure
    - no_private_path_exposure
    - no_write_button_present

  gate_3_independent_authorization:
    - requires_new_independent_a5_or_equivalent
    - lt06_a5_does_not_cover_vcpchat
    - single_use_only
    - no_retry
    - no_fallback

  gate_4_reporting:
    - redacted_summary_only
    - no_raw_bridge_response
    - no_raw_structuredContent
    - numeric_counts_only
```

## 6. Risk Matrix

```yaml
risk_matrix:
  high_risk:
    - risk: accidental_submitDraft_call
      mitigation: strict allowlist in preload, no submitDraft in scope
    - risk: raw_payload_exposure_in_report
      mitigation: redacted_summary_only, no raw bridge response recording
    - risk: private_path_exposure
      mitigation: text-only refs, no absolute path display

  medium_risk:
    - risk: bridge_method_drift
      mitigation: pre-check bridge surface before each authorized session
    - risk: electron_version_change
      mitigation: verify context isolation settings before each launch

  low_risk:
    - risk: ui_layout_change
      mitigation: visual check only, no functional impact
```

## 7. Preconditions for Next Step

```yaml
preconditions_for_next_step:
  - v7_60_planning_completed: true
  - v7_50e_reviewed: true
  - phase_e_docs_reviewed: true
  - independent_authorization_obtained: false
  - real_vcpchat_surface_check_executed: false
  - recommended_next_phase: v7.61 VCPChat Surface Check Authorization Package
```
