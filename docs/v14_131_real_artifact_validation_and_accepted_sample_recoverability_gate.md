# V14.131 Real Artifact Validation And Accepted Sample Recoverability Gate

```yaml
phase: v14_131_real_artifact_validation_and_accepted_sample_recoverability_gate
base_contract: AGENTS.md
mode: A4_8_safe_project_operator_rail
intent: local_implementation
risk_level: R2
source_phase: v14_130_legacy_docs_context_quarantine_refresh
status: completed_validated
```

## Purpose

This phase moves the current goal from document alignment toward real local
artifact recoverability.

It validates the v14.105 Codex-session accepted sample as a real workspace-local
artifact event by reading the real import record, re-hashing the real PNG,
checking PNG dimensions, and cross-checking the review, formal package,
accepted registry, and category index.

This gate does not prove VCP runtime integration.

## Artifact Chain

```yaml
accepted_sample_id: accepted_womens_resort_relaxed_knit_codex_v2_001
source_phase: v14_105_codex_session_womens_resort_relaxed_knit_final_candidate
import_record_ref: runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/resort_relaxed_knit_final_import_record.json
artifact_ref: runs/real_generation/v14_105_codex_session_womens_resort_relaxed_knit_final_candidate/codex_session_womens_resort_relaxed_knit_final_v2.png
review_record_ref: docs/v14_105_codex_session_womens_resort_relaxed_knit_final_review.md
formal_sample_package_ref: docs/v14_106_womens_resort_relaxed_knit_formal_sample_promotion_package.md
accepted_sample_closeout_ref: docs/v14_107_womens_resort_relaxed_knit_accepted_sample_closeout.md
accepted_sample_registry_ref: accepted_samples/accepted_sample_registry.yaml
category_index_ref: accepted_samples/categories/fashion_lookbook_portrait.yaml
```

## Recoverability Result

```yaml
artifact_recoverability_validator_created: true
real_import_record_parsed: true
real_artifact_file_exists: true
artifact_hash_validation: local_file_hash_passed
artifact_dimensions_validation: png_header_dimensions_passed
registry_import_review_category_chain_verified: true
negative_case_hash_mismatch_fails: true
negative_case_missing_artifact_fails: true
negative_case_missing_human_approval_fails: true
recoverability_status: workspace_local_verified
artifact_locator_scope: project_relative_runs
verification_mode: local_file_hash
verified_sha256: 9d23208d05427b02ffc177664c1918ed73bf57831a9694be16522fe9a8f3c910
verified_dimensions: 1254x1254
portable_after_clone: false
artifact_recoverability_is_not_vcp_runtime_integration: true
vcp_runtime_integration_proven: false
```

## Meaning

The accepted sample is recoverable on the current workspace because its
project-relative `runs/` artifact exists and matches the import record and
registry hash.

It is not yet durable across a clean clone because the image file is not
committed to Git and no external archive reference has been verified.

The current status is therefore:

```yaml
durable_committed: false
external_archive_verified: false
workspace_local_verified: true
metadata_only_unverified: false
dangling_reference: false
hash_mismatch: false
```

## Human Approval Evidence

The accepted state is supported by the v14.107 authorized registry closeout:

```yaml
authorization_id: AUTH-PENDING-WOMENS-RESORT-KNIT-FORMAL-SAMPLE-20260517-001
approved_by: Jenn
accepted_sample_registry_write_completed: true
```

The registry still needs a future metadata hardening patch to carry explicit
recoverability fields directly in the sample entry. That patch is v14.136 and
must not copy images or modify `runs/`.

## Explicit Non-Authorization

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
accepted_samples_write_performed: false
failure_samples_write_performed: false
production_candidate_created: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
output_file_write_performed: false
push_tag_release_deploy_performed: false
```

## Validation

```text
node --check scripts/validate_v14_131_real_artifact_validation_and_accepted_sample_recoverability.js: passed
node scripts/validate_v14_131_real_artifact_validation_and_accepted_sample_recoverability.js: passed
```

## Next Council Cycle

```yaml
commander_decision:
  next_safe_cycle: state_scope_canonicalization
  reason: >
    The current artifact is workspace-local verified but not portable. The next
    safe local step is to split current status surfaces into active, artifact,
    authorization, side-effect, and history scopes so future progress reports do
    not mix phase-current facts with project-history facts.
domain_leads_queue:
  - canonicalize status scope fields
  - keep artifact recoverability separate from VCP runtime integration
  - preserve failure_samples and production_candidate authorization stops
worker_scope:
  allowed:
    - local docs
    - local validators
    - .agent_board sync
  forbidden:
    - modifying runs artifacts
    - copying image binaries
    - provider/API/plugin/MCP
    - real manifest/VCPChat/VCPToolBox reads
    - DailyNote or VCP memory write
    - production_candidate or failure_samples write
    - push/tag/release/deploy
```
