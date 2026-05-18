# v14.204 Review Console Runtime Gap Dashboard Contract

```yaml
gate_template:
  phase: v14_204_review_console_runtime_gap_dashboard_contract
  base_contract: AGENTS.md
  mode: A4.8
  intent: local_implementation
  risk_level: R1
  allowed_files:
    - docs/v14_204_review_console_runtime_gap_dashboard_contract.md
    - tests/schema_examples/v14_204_review_console_runtime_gap_dashboard_contract.example.json
    - scripts/validate_v14_204_review_console_runtime_gap_dashboard_contract.js
    - scripts/validate_mvp.ps1
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
    - real manifest files
  allowed_actions:
    - define static runtime-gap dashboard contract
    - validate local evidence rows against v14.168 and v14.203 fixtures
    - update local validation wiring
    - update .agent_board resume surfaces
  forbidden_actions:
    - provider/API/plugin/MCP call
    - real manifest read
    - VCPChat/VCPToolBox read or modification
    - real IPC/preload/renderer/runtime integration
    - package execution
    - accepted_samples, failure_samples, production_candidate, DailyNote, or VCP memory write
    - image generation
    - push/tag/release/deploy
  validation:
    required:
      - node --check scripts/validate_v14_204_review_console_runtime_gap_dashboard_contract.js
      - node scripts/validate_v14_204_review_console_runtime_gap_dashboard_contract.js
      - git diff --check
      - node scripts/validate_agent_board_state.js
      - powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
      - powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1
    forbidden:
      - runtime validation
      - provider/plugin/API/MCP validation
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

## Phase Difference

v14.204 defines a static dashboard contract for a runtime gap view. The purpose
is to keep local product progress honest: artifact recoverability, static
handoff state, dry-run contracts, and authorization preflights are local
control-layer capabilities, not proof of real VCP runtime integration.

## Contract Snapshot

```text
phase_id: v14_204_review_console_runtime_gap_dashboard_contract
dashboard_contract_status: static_runtime_gap_contract_ready
source_dashboard_evidence_ref: tests/schema_examples/v14_168_three_sample_dashboard_evidence_alignment.example.json
source_review_console_handoff_ref: tests/schema_examples/v14_203_authorization_compiler_review_console_handoff_state.example.json
runtime_gap_row_count: 7
local_capability_row_count: 3
a5_boundary_row_count: 4
dashboard_progress_basis: validator_outputs_and_static_fixtures_only
runtime_claim_allowed: false
vcp_runtime_integration_proven: false
```

## Required Rows

The dashboard must show these rows:

- `artifact_recoverability`: local evidence available, not runtime integration
- `accepted_samples_gap`: two complete samples plus one remaining gap
- `authorization_handoff_cards`: five blocked cards, no execution
- `manifest_read`: not performed, requires exact A5 authorization
- `vcpchat_vcptoolbox_runtime`: not performed, requires exact A5 authorization
- `daily_note_vcp_memory`: not performed, requires exact A5 authorization
- `production_candidate_archive`: not performed, requires exact A5 authorization

## Negative Case Coverage

```text
negative_case_missing_gap_row_fails: true
negative_case_docs_progress_basis_fails: true
negative_case_runtime_claim_fails: true
negative_case_manifest_read_flag_fails: true
negative_case_package_execution_flag_fails: true
negative_case_memory_write_flag_fails: true
```

## Closeout

This gate prepares a static Review Console dashboard contract only. It does not
read VCPChat, VCPToolBox, real manifests, or memory systems, and it does not
perform runtime integration.
