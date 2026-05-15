# Review Console Data Contract v1

```yaml
contract_id: review_console_data_contract_v1
source_phase: v14_004_review_console_wireframe_and_data_contract_gate
source_commit: 33e26855758a9205f7e3c53342e81302017d7867
status: docs_only_data_contract
```

## Contract Boundary

This contract defines planned data shapes for future Review Console
implementation. It is not executable code and does not create a runtime reader.

The contract is read-only by default. It may reference text records in `docs/`
and `.agent_board/`, but it must not read image binaries, secrets, runtime
sessions, external APIs, provider payloads, or accepted_samples contents.

## ReviewAsset

```yaml
ReviewAsset:
  asset_id: string
  product: string
  source_output: string
  prompt_package: string
  asset_status: string
  accepted_candidate: boolean
  commercial_delivery_ready: boolean
  memory_suitability: deferred | true | false | not_applicable
  accepted_samples_ready: boolean
  route_status: string
  evidence_package_ref: string | null
  delivery_readiness_package_ref: string | null
  route_closeout_ref: string | null
```

Rules:

- `source_output` is a path reference only.
- `accepted_candidate: true` must not imply `commercial_delivery_ready: true`.
- `memory_suitability` must be explicit and must not be inferred.
- `accepted_samples_ready` must be explicit and must not cause writes.

## ReviewEvent

```yaml
ReviewEvent:
  event_id: string
  phase: string
  commit_hash: string
  event_type: route_selection | planning | authorization | generation | review | evidence | delivery_readiness | closeout
  result: string
  source_doc: string
  validation_status: pass | pass_with_warnings | blocked | failed | not_run
  safety_boundary_summary:
    provider_contact: boolean
    image_generation: boolean
    memory_write: boolean
    accepted_samples_written: boolean
    runs_output_committed: boolean
    real_retouch_execution: boolean
```

Rules:

- `event_type: generation` may be displayed only when the source doc records
  prior authorization and execution.
- Timeline display must preserve validation status and safety boundary state.

## EvidencePackage

```yaml
EvidencePackage:
  evidence_package_id: string
  source_output: string
  prompt_package: string
  local_persistence_success: boolean | not_applicable
  provider_calls_used: number | not_applicable
  generation_attempts_used: number | not_applicable
  accepted_candidate: boolean
  key_findings:
    - string
  watch_items:
    - watch_item_id: string
```

Rules:

- `source_output` is a text reference and must not trigger binary ingestion.
- `provider_calls_used` and `generation_attempts_used` are historical counters,
  not execution permissions.

## DeliveryReadiness

```yaml
DeliveryReadiness:
  delivery_readiness_package_id: string
  commercial_delivery_ready: boolean
  retouch_needed_later: none | optional_minor_retouch | minor_retouch_required | final_retouch_required
  QA_blockers:
    - string
  export_naming_policy: draft | approved | not_defined
  accepted_samples_ready: boolean
  memory_suitability: deferred | true | false | not_applicable
```

Rules:

- `commercial_delivery_ready` requires a delivery readiness review record.
- `retouch_needed_later` never authorizes retouch execution.
- `accepted_samples_ready` never writes to `accepted_samples/`.

## WatchItem

```yaml
WatchItem:
  watch_item_id: string
  severity: info | minor | major | blocker
  description: string
  delivery_impact: none | low | medium | high
  retouch_required: boolean
  blocks_delivery: boolean
  resolved_status: unresolved | deferred | resolved | not_applicable
```

Rules:

- `retouch_required: true` only creates a future planning or authorization need.
- `blocks_delivery: true` must force `commercial_delivery_ready: false`.

## SafetyBoundary

```yaml
SafetyBoundary:
  provider_contact: boolean
  image_generation: boolean
  retry: boolean
  env_local_secret_value_read: boolean
  memory_write: boolean
  accepted_samples_written: boolean
  runs_output_committed: boolean
  real_retouch_execution: boolean
  production_candidate_002: boolean
```

Rules:

- All side-effect flags must be explicit.
- The contract must not convert false flags into executable controls.
- If any side-effect flag is true in a historical record, the Review Console
  must show it as history, not as permission to repeat it.

## NextAction

```yaml
NextAction:
  action_id: string
  action_type: route_selection | static_review | prompt_revision | generation_authorization | retouch_authorization | delivery_review | memory_planning | accepted_samples_planning | stop
  risk_level: low | medium | high
  allowed_now: boolean
  requires_human_authorization: boolean
  recommended: boolean
  blocker_reason: string
```

Rules:

- `allowed_now: false` means display-only.
- `recommended: true` must not bypass `requires_human_authorization`.
- High-risk actions must be non-executable until a separate gate authorizes
  them.

## Read-Only Data Sources

Future implementation may request authorization to read only explicit text
records from:

```yaml
readonly_data_sources:
  docs_evidence_packages: docs/*evidence_package*.md
  docs_delivery_readiness: docs/*delivery_readiness*.md
  docs_route_closeouts: docs/*route_closeout*.md
  agent_board_checkpoint: .agent_board/CHECKPOINT.md
  agent_board_run_state: .agent_board/RUN_STATE.md
```

The future implementation must use an exact file allowlist, not broad recursive
scanning.

## Forbidden Data Sources

```yaml
must_not_read:
  runs_image_binary: runs/
  env_local: .env.local
  accepted_samples: accepted_samples/
  provider_secret: provider secret values
  runtime_session: runtime session state
  external_APIs: external APIs
```

These sources require separate authorization if ever needed. V14.004 does not
grant that authorization.

## Read/Write Boundary

```yaml
read_boundary:
  docs_records: future_allowlisted_read_only
  agent_board_records: future_allowlisted_read_only
  image_binary_ingestion: false
  secrets_read: false
  runtime_read: false
write_boundary:
  docs_write: false_for_future_runtime
  accepted_samples_write: false
  memory_write: false
  runs_output_commit: false
  provider_execution: false
  retouch_execution: false
  delivery_execution: false
```

## Future Implementation Prerequisites

```yaml
future_implementation_prerequisites:
  independent_UI_implementation_authorization: true
  exact_read_only_file_allowlist: true
  no_image_binary_ingestion_unless_separately_authorized: true
  no_accepted_samples_write: true
  no_memory_write: true
  no_provider_execution: true
  no_runtime_CDP_bridge_MCP: true
  validation_required_before_runtime: true
```

Any future runtime or UI implementation must start from a separate gate and must
not treat this contract as execution authorization.
