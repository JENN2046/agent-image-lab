# v0.6.86 Runtime Kernel / Backend Gap Map

```yaml
gate_template:
  phase: v0_6_86_runtime_kernel_backend_gap_map
  base_contract: AGENTS.md
  mode: A4.8
  intent: local_implementation
  risk_level: R1
  allowed_files:
    - docs/V0_6_86_RUNTIME_KERNEL_BACKEND_GAP_MAP.md
    - schemas/runtime_kernel_backend_gap_map.schema.yaml
    - tests/schema_examples/runtime_kernel_backend_gap_map.example.json
    - tests/schema_examples/runtime_kernel_backend_gap_map_fail.example.json
    - scripts/validate_runtime_kernel_backend_gap_map.js
    - scripts/validate_mvp.ps1
    - package.json
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
    - .agent_board/CHECKPOINT.md
    - .agent_board/VALIDATION_LOG.md
  forbidden_files:
    - .env
    - .env.local
    - real VCPChat source
    - real VCPToolBox source
    - real manifests outside this repository
    - provider runtime binding secrets
  allowed_actions:
    - define the current runtime/backend gap map
    - validate that runtime/backend implementation remains not started by this gate
    - update local validation wiring
    - update .agent_board resume surfaces
  forbidden_actions:
    - provider/API/plugin call
    - image generation
    - real manifest read
    - VCPChat/VCPToolBox read or modification
    - real backend/API/IPC/preload/renderer implementation
    - accepted_samples, failure_samples, production_candidate, DailyNote, or VCP memory write
    - dependency change
    - push/tag/release/deploy
  validation:
    required:
      - node --check scripts/validate_runtime_kernel_backend_gap_map.js
      - node scripts/validate_runtime_kernel_backend_gap_map.js
      - npm run validate:runtime-kernel-gap
      - npm run validate:mvp
  commit:
    allowed: false
    message: null
  push:
    allowed: false
  explicit_non_authorization:
    generation: false
    plugin_call: false
    provider_contact: false
    runtime: false
    memory_write: false
    DailyNote_write: false
```

## Purpose

This gate records the runtime/backend boundary after the local safety work:
provider output safety, NativeDoubao runner registry extraction, Review Console
static/mock boundary validation, and public disclosure audit are useful local
hardening steps. They still do not prove a mature Agent Runtime or production
Review Console backend.

The next runtime/backend phase must start from an explicit contract, not from a
broad rewrite.

## Current Implemented Capabilities

- Local preview capsule creation and validation.
- NativeDoubao one-shot runner and provider safety helpers.
- Static Review Console prototype with mock/in-memory state.
- Local validators for static boundaries, public disclosure, provider safety,
  and artifact recoverability.

## Missing Runtime Kernel Components

The minimum real runtime kernel still needs all of these components:

- `task_intake`
- `policy_gate`
- `executor_interface`
- `artifact_persistence`
- `review_gate`
- `state_transition`
- `audit_record`

## Missing Backend Components

The minimum Review Console backend still needs all of these components:

- `read_only_case_api`
- `artifact_metadata_api`
- `review_decision_persistence_api`
- `auth_session_boundary`
- `audit_log_store`

## Boundary

This gate does not create runtime kernel code, backend endpoints, IPC/preload
integration, database state, provider execution, or memory writes. It only makes
the remaining architecture gap explicit and machine-verifiable.

## Recommended Next Phase

Prepare a local runtime contract spec that defines data shapes, state
transitions, failure modes, and validation gates before writing executable
runtime/backend code.
