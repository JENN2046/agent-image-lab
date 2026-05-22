# v0.3.4 Visual Asset Governance And Receipt State Reconciliation

Phase: `v0_3_4_visual_asset_governance_and_receipt_state_reconciliation`

Status: local docs and validator patch only.

This phase reconciles the post-push state after `bf5e54e` and makes the v0.3.3
visual asset boundary explicit. It does not perform a new provider call, image
generation, DailyNote write, VCP memory write, VCPToolBox/VCPChat runtime call,
or production candidate write.

## Post-Push State

```yaml
post_push_state:
  pushed_commit: bf5e54e
  pushed_ref: origin/master
  push_status: pushed_to_origin_master_after_user_authorization
  pushed_files_scope: provider receipt artifact repair slice
  post_push_reconciliation_required: true
  post_push_reconciliation_phase: v0_3_4_visual_asset_governance_and_receipt_state_reconciliation
```

## Receipt State

The v0.3.3 pilot now has four portable attempt-result records:

```yaml
receipt_state:
  failed_attempt_count: 2
  succeeded_diagnostic_count: 2
  first_trial:
    status: failed_no_image_generated
    attempt_result_path: runs/real_generation/v0_3_3_codex_sample_first_trial/generation_attempt_result.json
    receipt_path: reports/provider_receipts/v0_3_3_codex_sample_first_trial_receipt.json
  retry_001:
    status: failed_no_image_generated
    attempt_result_path: runs/real_generation/v0_3_3_retry_001_codex_sample/generation_attempt_result.json
    receipt_path: reports/provider_receipts/v0_3_3_retry_001_receipt.json
  smoke_001_neutral:
    status: succeeded_image_generated
    attempt_result_path: runs/real_generation/v0_3_3_smoke_001_neutral/generation_attempt_result.json
    output_image_path: runs/real_generation/v0_3_3_smoke_001_neutral/neutral_smoke_test_red_apple_v1.png
    receipt_path: reports/provider_receipts/v0_3_3_smoke_001_neutral_receipt.json
  safe_portrait_001:
    status: succeeded_image_generated
    attempt_result_path: runs/real_generation/v0_3_3_safe_portrait_001/generation_attempt_result.json
    output_image_path: runs/real_generation/v0_3_3_safe_portrait_001/safe_adult_editorial_portrait_v1.png
    receipt_path: reports/provider_receipts/v0_3_3_safe_portrait_001_receipt.json
```

## Asset Authorization Record

The owner-authorized generated PNG upload record is maintained in:

```yaml
asset_authorization_registry_ref: assets/visual_asset_authorization_registry.example.json
visual_asset_policy_version: visual_asset_policy_v0_3_4a
promotion_policy_version: visual_asset_promotion_policy_v0_3_5
authorized_png_count: 2
authorized_png_paths:
  - runs/real_generation/v0_3_3_smoke_001_neutral/neutral_smoke_test_red_apple_v1.png
  - runs/real_generation/v0_3_3_safe_portrait_001/safe_adult_editorial_portrait_v1.png
authorization_scope: upload generated PNG binaries as v0.3.3 diagnostic run evidence
private_source_path_policy: redacted_source_only
```

The registry uses `upload_authorized_by_user` as the canonical authorization
field. `owner_authorized_upload` may appear only as a compatibility alias and
must match the canonical value.

```yaml
asset_class_enum:
  - runs_artifact
  - user_authorized_test_image
  - review_candidate
  - eval_seed_candidate
  - accepted_sample
  - production_candidate
authorized_asset_classes:
  neutral_smoke_test_red_apple_v1.png:
    asset_class: runs_artifact
    upload_authorized_by_user: true
    accepted_sample: false
    production_candidate: false
    memory_seed: false
  safe_adult_editorial_portrait_v1.png:
    asset_class: user_authorized_test_image
    upload_authorized_by_user: true
    accepted_sample: false
    production_candidate: false
    memory_seed: false
```

## Asset Promotion Gates

Test and runs assets cannot become review, eval, accepted, production, or memory
assets by flipping one field. Every promotion must record both the source class
and the gate that authorized the transition.

```yaml
visual_asset_promotion_policy:
  policy_id: visual_asset_promotion_policy_v0_3_5
  promotion_by_field_flip_allowed: false
  every_promotion_requires:
    - promoted_from_asset_class
    - promotion_gate_id
  review_candidate:
    requires:
      - review_gate_id
  eval_seed_candidate:
    requires:
      - eval_gate_id
      - human_label
  accepted_sample:
    requires:
      - accepted_gate_id
      - human_accepted: true
  production_candidate:
    requires:
      - independent_A5_production_gate_id
      - production_candidate_write_allowed_by_active_gate: true
  memory_seed:
    requires:
      - memory_gate_id
      - memory_write_allowed_now: true
  current_counts:
    review_candidate: 0
    eval_seed_candidate: 0
    accepted_sample: 0
    production_candidate: 0
    memory_seed: 0
```

## Runs Artifact Boundary

```yaml
runs_artifact_boundary:
  role: provider-run evidence
  allowed_contents:
    - generation_attempt_result.json
    - user-authorized generated PNG diagnostic artifacts with receipt and SHA256 evidence
  not_durable_review_asset_by_default: true
  not_accepted_sample_by_default: true
  not_production_candidate_by_default: true
  not_memory_payload_by_default: true
  required_for_binary_commit:
    - owner authorization record
    - receipt path
    - attempt result path
    - output image SHA256
    - tracked file proof
    - raw local source path redacted
    - upload_authorized_by_user: true
    - accepted_sample: false
    - production_candidate: false
    - memory_seed: false
```

## Durable Review Asset Boundary

Durable review assets are separate from `runs/` artifacts.

```yaml
durable_review_asset_boundary:
  destination_family: asset_archive/ or accepted_samples/ only after a separate gate
  requires_separate_authorization: true
  requires_review_console_binding: true
  requires_asset_archive_policy_match: true
  requires_no_private_source_path: true
  production_candidate_write_allowed_by_this_phase: false
```

## Generated Image Binary Commit Policy

```yaml
generated_image_binary_commit_policy:
  policy_id: generated_image_binary_commit_policy_v1
  default: do_not_commit_generated_binaries
  exception:
    allowed_when:
      - upload_authorized_by_user: true
      - asset_class: runs_artifact or user_authorized_test_image
      - receipt_status: succeeded_image_generated
      - output_image_sha256_recorded: true
      - attempt_result_path_exists: true
      - source_image_path_redacted: true
      - asset_authorization_registry_entry_exists: true
      - accepted_sample: false
      - production_candidate_write_performed: false
      - memory_seed: false
      - DailyNote_write_performed: false
      - VCP_memory_write_performed: false
    forbidden_when:
      - missing_upload_authorized_by_user
      - missing_receipt
      - missing_attempt_result
      - missing_sha256
      - raw_private_source_path_present
      - review_candidate_without_review_gate_id
      - eval_seed_candidate_without_eval_gate_or_human_label
      - test_asset_promoted_to_accepted_sample_without_gate
      - production_candidate_claim_without_gate
      - durable_review_asset_claim_without_gate
      - memory_seed_true_without_memory_gate
      - memory_seed_true_without_explicit_VCP_memory_write_authorization
      - promotion_missing_promoted_from_asset_class
      - promotion_missing_promotion_gate_id
```

## Current Non-Actions

```yaml
provider_contact_performed_by_v0_3_4: false
plugin_call_performed_by_v0_3_4: false
api_call_performed_by_v0_3_4: false
image_generation_performed_by_v0_3_4: false
DailyNote_write_performed_by_v0_3_4: false
VCP_memory_write_performed_by_v0_3_4: false
VCPToolBox_runtime_call_performed_by_v0_3_4: false
VCPChat_runtime_call_performed_by_v0_3_4: false
production_candidate_write_performed_by_v0_3_4: false
```

## Validation

```yaml
validator: scripts/validate_visual_asset_authorization_policy.js
mvp_validator_ref: scripts/validate_mvp.ps1
v0_3_3_validator_ref: scripts/validate_v0_3_3_first_live_generation_pilot_gate.js
expected_result: visual_asset_authorization_policy_verified
```
