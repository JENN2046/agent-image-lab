# Runtime Validator Reference Map

Status: active reference map
Role: planning_record
Mode: Green Lane structure governance

This map keeps runtime-adjacent validators discoverable before any physical
movement. It does not authorize runtime execution, provider contact, plugin calls,
API calls, image generation, memory writes, production promotion, dependency changes,
commit, push, tag, release, deploy, or destructive filesystem actions.

## Root Validators

Root paths remain the compatibility surface:

```text
scripts/validate_durable_archive_copy_authorization_package.js
scripts/validate_durable_archive_copy_execution_report.js
scripts/validate_runtime_delivery_surface.js
scripts/validate_runtime_durable_audit_store.js
scripts/validate_runtime_guard_unit.js
scripts/validate_runtime_kernel_backend_gap_map.js
scripts/validate_runtime_kernel_entry_boundary_no_exec.js
scripts/validate_runtime_kernel_v0_artifact_adapter_stub.js
scripts/validate_runtime_kernel_v0_audit_write.js
scripts/validate_runtime_kernel_v0_contract.js
scripts/validate_runtime_kernel_v0.js
scripts/validate_runtime_prototype_smoke.js
scripts/validate_runtime_prototype_suite.js
scripts/validate_runtime_review_batch_10a_acceptance_matrix.js
scripts/validate_runtime_review_batch_10b_dry_run_replay_index.js
scripts/validate_runtime_review_batch_10c_auth_consolidation.js
scripts/validate_runtime_review_batch_9a_state_freshness.js
scripts/validate_runtime_review_batch_9b_session_compatibility.js
scripts/validate_runtime_review_batch_9c_operator_runbook.js
scripts/validate_runtime_review_bridge_readonly_stub.js
scripts/validate_runtime_review_full_chain.js
```

## Buckets

```text
runtime_kernel_and_guards:
  - validate_runtime_guard_unit.js
  - validate_runtime_kernel_backend_gap_map.js
  - validate_runtime_kernel_entry_boundary_no_exec.js
  - validate_runtime_kernel_v0_artifact_adapter_stub.js
  - validate_runtime_kernel_v0_audit_write.js
  - validate_runtime_kernel_v0_contract.js
  - validate_runtime_kernel_v0.js

runtime_review_and_bridge:
  - validate_runtime_review_batch_9a_state_freshness.js
  - validate_runtime_review_batch_9b_session_compatibility.js
  - validate_runtime_review_batch_9c_operator_runbook.js
  - validate_runtime_review_batch_10a_acceptance_matrix.js
  - validate_runtime_review_batch_10b_dry_run_replay_index.js
  - validate_runtime_review_batch_10c_auth_consolidation.js
  - validate_runtime_review_bridge_readonly_stub.js
  - validate_runtime_review_full_chain.js

runtime_prototype_and_delivery:
  - validate_runtime_delivery_surface.js
  - validate_runtime_prototype_smoke.js
  - validate_runtime_prototype_suite.js

durable_archive:
  - validate_durable_archive_copy_authorization_package.js
  - validate_durable_archive_copy_execution_report.js
  - validate_runtime_durable_audit_store.js
```

## Movement Rule

Do not move this family until a separate movement plan maps:

- all package scripts and aggregate validators that call these root paths;
- runtime prototype, durable audit, review bridge, and dry-run replay references;
- wrappers that preserve root command compatibility;
- validation proving no runtime/prod/provider side effect occurred.

Recommended next: inspect `other` root validators and create a classification
map before any broad physical movement.
