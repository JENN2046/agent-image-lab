# Provider Preflight Validator Reference Map

Status: active reference map
Role: planning_record
Mode: Green Lane structure governance

This map keeps provider/A5-adjacent validators discoverable before any physical
movement. It does not authorize provider contact, plugin calls, API calls,
image generation, memory writes, production promotion, dependency changes,
commit, push, tag, release, deploy, or destructive filesystem actions.

## Root Validators

Root paths remain the compatibility surface:

```text
scripts/validate_exact_a5_provider_execution_activation_receipt.js
scripts/validate_exact_a5_provider_execution_packet_draft.js
scripts/validate_exact_a5_provider_retry_003_activation_receipt.js
scripts/validate_exact_a5_provider_retry_004_activation_receipt.js
scripts/validate_exact_a5_provider_retry_005_activation_receipt.js
scripts/validate_exact_a5_provider_retry_006_activation_receipt.js
scripts/validate_exact_a5_provider_retry_007_preflight_decision.js
scripts/validate_exact_a5_provider_retry_activation_receipt.js
scripts/validate_exact_a5_provider_retry_packet_draft.js
scripts/validate_provider_evidence_integrity_contract.js
scripts/validate_provider_payload_capture_preflight.js
scripts/validate_provider_preflight_no_provider_call.js
scripts/validate_provider_receipt_artifacts.js
scripts/validate_retry_006_artifact_integrity.js
```

## Buckets

```text
preflight_packet_drafts:
  - validate_exact_a5_provider_execution_packet_draft.js
  - validate_exact_a5_provider_retry_packet_draft.js
  - validate_exact_a5_provider_retry_007_preflight_decision.js
  - validate_provider_payload_capture_preflight.js
  - validate_provider_preflight_no_provider_call.js

activation_receipts:
  - validate_exact_a5_provider_execution_activation_receipt.js
  - validate_exact_a5_provider_retry_activation_receipt.js
  - validate_exact_a5_provider_retry_003_activation_receipt.js
  - validate_exact_a5_provider_retry_004_activation_receipt.js
  - validate_exact_a5_provider_retry_005_activation_receipt.js
  - validate_exact_a5_provider_retry_006_activation_receipt.js

evidence_and_artifact_integrity:
  - validate_provider_evidence_integrity_contract.js
  - validate_provider_receipt_artifacts.js
  - validate_retry_006_artifact_integrity.js
```

## Movement Rule

Do not move this family until a separate movement plan maps:

- all package scripts and aggregate validators that call these root paths;
- adapter, receipt, report, review handoff, and private audit references;
- wrappers that preserve root command compatibility;
- validation proving no provider/plugin/API/image side effect occurred.

Recommended next: create the `runtime` reference map before any provider or
runtime physical movement.
