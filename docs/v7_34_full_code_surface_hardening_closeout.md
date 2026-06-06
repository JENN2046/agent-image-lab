# v7_34 Full Code Surface Hardening Closeout

```yaml
phase: v7_34_full_code_surface_hardening_closeout
base_contract: AGENTS.md
phase_type: docs_schema_validator_hardening
source_review:
  repo: JENN2046/agent-image-lab
  observed_remote_head: 7e21d7da645407d50c4c9623cc29943445d7d6de
  decision: pass_with_warnings
local_context:
  prior_local_reconciliation_commit: 4af8f2ae0241454afd8b3b8c3aa7ea8a99193b12
  origin_master_at_start: 7e21d7da645407d50c4c9623cc29943445d7d6de
lane: Green
runtime_execution: false
provider_contact: false
plugin_call: false
api_call: false
image_generation: false
DailyNoteWrite_execution: false
VCP_memory_write: false
additional_Codex_memory_write: false
external_repository_modification: false
secret_env_config_read: false
production_candidate_registry_write: false
tag_release_deploy: false
push: false
```

## Purpose

This phase records the Pro static review warnings as hard local surfaces, without
performing any new runtime action. It turns the highest-risk wording collisions
into explicit fields and validator expectations.

## Hardened Boundary Rules

```yaml
memory_layers:
  Codex_knowledge_memory:
    written: true
    receipt_ref: reports/memory_write_receipts/secretless_serum_attempt_018_codex_knowledge_memory_write_receipt_20260606.json
    layer: Codex workspace knowledge
  AIL_DailyNoteWrite_adapter:
    preflight: true
    writes_now: false
  VCPToolBox_DailyNoteWrite:
    called: false
  VCP_long_term_memory_or_project_DailyNote:
    written: false

route_identity:
  AIL_native_Doubao_plugin:
    role: local_A5_guarded_provider_plugin
    secretless_delegate: false
  VCPToolBox_secretless_delegate:
    required_owner: VCPToolBox
    owns_provider_secret: true
    owns_Authorization_header: true
    AIL_may_record_receipt_refs: true

execution_authorization:
  standing_authorization_allows_planning: true
  exact_execution_packet_required_for_side_effects: true
  generic_Amber_envelope_alone_is_not_enough_for_live_provider_or_memory_write: true
```

## VCP Broker Proof Checklist

Before Agent Image Lab can label the VCP route as the preferred production
secretless channel, a VCP-side source review must prove:

```yaml
VCP_broker_proof_required:
  - route handler does not accept payload-selected provider/plugin/API identity
  - route handler does not expose full pluginManager dispatch to AIL payloads
  - provider/plugin/API binding is selected by a VCP-owned internal registry
  - distributed fallback is disabled for the exact route
  - max route/provider/plugin/API/image counts are enforced outside delegate self-report
  - provider secret and Authorization header stay inside VCPToolBox
  - receipt records binding source, facade policy, call counts, output refs, and artifact hash
  - AIL receives only activation id, contract refs, sanitized receipt refs, and artifact refs
```

## Migration Script Policy

`scripts/prepare_runtime_to_review_v1_secretless_serum_attempt.js` remains
historical migration/bootstrap tooling only. It must not be treated as the
default runtime path, and any future external VCPToolBox patch or commit still
requires an exact external-repository authorization packet.

## DailyNote Schema Plan

The current AIL DailyNoteWrite adapter remains a no-write preflight. Before any
real DailyNoteWrite call, split the current contract into strict JSON schemas:

```yaml
future_strict_json_schemas:
  - ail_dailynote_write_envelope.v1.schema.json
  - ail_dailynote_write_execution_audit_stub.v1.schema.json
  - ail_dailynote_write_rollback_or_revoke_plan.v1.schema.json
```

These schemas must preserve `can_execute_now: false` until a future exact
one-write packet names the callable command, canonical root class, target file
check, and post-write hash verification.

## Validation Debt Repaired

The recommender surfaced one stale historical validator:
`scripts/validate_v14_212_six_month_goal_prompt_to_artifact_completion_audit.js`.
That validator treated `recoverable_accepted_sample_count` as exactly `6`,
which became brittle after later accepted samples were added. The hardened rule
is now:

```yaml
recoverable_accepted_sample_count:
  minimum_required: 6
  current_observed: 7
  remaining_full_recoverable_sample_gap: 0
```

This repair does not mark the historical v14.212 goal complete, does not claim
VCP runtime integration, and preserves all no-provider/no-plugin/no-API/no-image
and no-memory-write guards.

## Closeout Decision

```yaml
decision: pass_with_warnings_hardened
release_ready: false
production_ready: false
new_generation_allowed: false
DailyNoteWrite_allowed_now: false
next_best_move: push_safety_or_exact_commit_only_if_user_requests
```
