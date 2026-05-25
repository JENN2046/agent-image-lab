# V0.6.73o Exact Real Execution Authorization Phrase Draft

```yaml
phase: v0_6_73o_exact_real_execution_authorization_phrase_draft
base_contract: AGENTS.md
mode: Green local authorization phrase draft only
source_phase: v0_6_73n_real_execution_go_no_go_review
source_status: COMPLETED_VALIDATED_NO_GO
result: COMPLETED_VALIDATED
```

## Purpose

This gate drafts the exact future human authorization sentence that would be required before the NativeDoubao one-shot real execution phase can start.

It is a draft only. It does not activate the phrase, bind a delegate, contact a provider, call a plugin, call an API, generate an image, read image binary data, write output, write a receipt, write a review handoff, read `.env` or `.env.local`, read a secret value, write DailyNote, write VCP memory, write `accepted_samples`, or write `production_candidate`.

## Authorization Phrase Contract

```yaml
authorization_phrase_contract_id: AUTH-PHRASE-DRAFT-V0-6-73O
target_execution_phase: v0_6_73_real_vcp_agent_generation_execution_one_shot
source_go_no_go_review_ref: docs/vcp_integration/V0_6_73N_REAL_EXECUTION_GO_NO_GO_REVIEW.md
source_bound_delegate_preflight_ref: docs/vcp_integration/V0_6_73M_BOUND_DELEGATE_PREFLIGHT_VALIDATOR.md
source_bound_delegate_authorization_ref: docs/vcp_integration/V0_6_73L_BOUND_DELEGATE_AUTHORIZATION_PACKET_DRAFT.md
authorization_phrase_active: false
authorization_phrase_draft_only: true
exact_phrase_required: true
partial_phrase_allowed: false
paraphrase_allowed: false
ambiguous_continue_allowed: false
remote_synced_required_before_phrase_can_be_active: true
exact_active_bound_delegate_authorization_required_before_phrase_can_be_active: true
mvp_validation_required_before_phrase_can_be_active: true
go_no_go_review_must_be_GO_before_phrase_can_be_active: true
current_go_no_go_decision: NO_GO
current_no_go_reason: remote_not_synced_and_exact_active_delegate_authorization_missing
v0_6_73_execution_allowed: false
```

## Draft Phrase Template

```text
I authorize v0_6_73_real_vcp_agent_generation_execution_one_shot now, using the exact active NativeDoubao bound delegate authorization packet, with max_provider_calls=1, max_plugin_calls=1, max_api_calls=1, max_images_created=1, retry_limit=0, output_directory_ref=runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/, receipt_ref=reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json, review_handoff_ref=review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json, human_review_required=true, review_console_required=true, no secret value exposure, and no automatic accepted_samples, production_candidate, DailyNote, or VCP memory write.
```

## Phrase Acceptance Rules

```yaml
phrase_acceptance_rules:
  must_name_exact_phase: v0_6_73_real_vcp_agent_generation_execution_one_shot
  must_reference_exact_active_bound_delegate_authorization_packet: true
  must_lock_max_provider_calls: 1
  must_lock_max_plugin_calls: 1
  must_lock_max_api_calls: 1
  must_lock_max_images_created: 1
  must_lock_retry_limit: 0
  must_lock_output_directory_ref: runs/real_generation/v0_6_73_real_vcp_agent_generation_one_shot/
  must_lock_receipt_ref: reports/provider_receipts/v0_6_73_real_vcp_agent_generation_one_shot_receipt.json
  must_lock_review_handoff_ref: review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_one_shot/bridge_entry.json
  must_require_human_review: true
  must_require_review_console: true
  must_forbid_secret_value_exposure: true
  must_forbid_automatic_accepted_samples_write: true
  must_forbid_automatic_production_candidate_write: true
  must_forbid_automatic_DailyNote_write: true
  must_forbid_automatic_VCP_memory_write: true
```

## Still Required Before Real Execution

```yaml
required_before_real_execution:
  - remote_synced_current_true
  - npm_run_validate_mvp_passed_after_remote_sync
  - exact_active_bound_delegate_authorization_present
  - go_no_go_decision_GO
  - exact_human_phrase_submitted_after_GO
  - pre_provider_contact_preflight_rerun_passed
```

## Rejection Rules

```yaml
reject_when:
  - phrase_submitted_before_remote_sync
  - phrase_submitted_before_exact_active_bound_delegate_authorization
  - phrase_submitted_while_go_no_go_decision_NO_GO
  - phrase_omits_target_execution_phase
  - phrase_omits_one_shot_budget
  - phrase_changes_output_directory
  - phrase_changes_receipt_path
  - phrase_changes_review_handoff_path
  - phrase_allows_retry
  - phrase_allows_secret_value_exposure
  - phrase_allows_auto_promotion_or_memory_write
  - phrase_is_paraphrase_or_ambiguous_continue
```

## Boundary Evidence

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
image_binary_read_performed: false
output_write_performed: false
receipt_write_performed: false
review_handoff_write_performed: false
env_file_content_read_performed: false
env_local_file_content_read_performed: false
secret_value_read_performed: false
accepted_samples_write_performed: false
production_candidate_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
v0_6_73_execution_allowed: false
next_safe_task: v0_6_73p_local_aggregate_readiness_review
```

## Validation

```yaml
required:
  - node --check scripts/validate_v0_6_73o_exact_real_execution_authorization_phrase_draft.js
  - node scripts/validate_v0_6_73o_exact_real_execution_authorization_phrase_draft.js
  - node --check scripts/validate_v0_6_73n_real_execution_go_no_go_review.js
  - node scripts/validate_v0_6_73n_real_execution_go_no_go_review.js
  - node scripts/lib/governance_tooling_maintenance_slice.js
  - npm run validate:mvp
  - git diff --check
```
