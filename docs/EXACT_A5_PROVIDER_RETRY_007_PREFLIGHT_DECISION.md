# Exact A5 Provider Retry 007 Preflight Decision

```yaml
phase: p2_2_retry_007_preflight_decision
status: hold_pending_owner_decision
adapter: adapters/runtime/exact_a5_provider_retry_007_preflight_decision_packet.js
validator: scripts/validate_exact_a5_provider_retry_007_preflight_decision.js
candidate_authorization_id: AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260527-007
can_execute_now: false
exact_activation_phrase_issued: false
```

## Purpose

This packet decides the boundary for a possible `retry_007` after P1/P2 evidence
governance is stable. It is not an execution authorization and does not contain
an activation phrase.

## Required Gates Before Any Future Activation

```text
npm run validate:core
npm run validate:public-disclosure
npm run validate:mvp
npm run validate:provider-evidence-integrity
npm run validate:all
git diff --check
```

## Candidate Boundary

```yaml
required_model: doubao-seedream-5-0-260128
output_directory_ref: runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_007/
provider_receipt_ref: reports/provider_receipts/v0_6_73_real_vcp_agent_generation_retry_007_receipt.json
review_handoff_ref: review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_007/bridge_entry.json
durable_audit_store_root: .agent_private/runtime_audit_store/v0_6_73_real_vcp_agent_generation_retry_007/
max_provider_calls_if_later_authorized: 1
max_plugin_calls_if_later_authorized: 1
max_api_calls_if_later_authorized: 1
max_images_if_later_authorized: 1
retry_allowed_after_retry_007: false
```

## Current Decision

```yaml
decision_status: hold_pending_owner_decision
authorization_status: not_issued
authorization_active: false
provider_execution_allowed_now: false
requires_separate_owner_authorization: true
requires_new_activation_packet_before_execution: true
```

The next action is a human decision: hold, reject, or authorize a separate exact
retry_007 activation packet.
