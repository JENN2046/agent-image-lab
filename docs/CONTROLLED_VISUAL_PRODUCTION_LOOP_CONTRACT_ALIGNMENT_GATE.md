# CONTROLLED VISUAL PRODUCTION LOOP CONTRACT ALIGNMENT GATE

```yaml
gate_template:
  phase: controlled_visual_production_loop_contract_alignment_gate
  base_contract: AGENTS.md
  mode: A4.8
  intent: local_implementation
  risk_level: R1
  allowed_files:
    - review_console/static_prototype/index.html
    - review_console/static_prototype/mock_data.js
    - review_console/static_prototype/app.js
    - review_console/static_prototype/FIELD_MAPPING.md
    - review_console/static_prototype/README.md
    - tests/schema_examples/CONTROLLED_VISUAL_PRODUCTION_LOOP_CONTRACT.example.json
    - scripts/validate_controlled_visual_production_loop_contract.js
    - scripts/validate_mvp_capsule_product_core.ps1
    - docs/CONTROLLED_VISUAL_PRODUCTION_LOOP_CONTRACT_ALIGNMENT_GATE.md
    - docs/00_project_roadmap.md
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
    - .agent_board/CHECKPOINT.md
  forbidden_files:
    - asset_archive/original_assets/**
    - runs/**
    - production_candidate/**
    - accepted_samples/**
    - failure_samples/**
  allowed_actions:
    - static contract alignment
    - Review Console draft output alignment
    - local validator creation
    - .agent_board continuity update
  forbidden_actions:
    - asset archive file reads
    - preview load or render
    - provider/plugin/API/runtime actions
    - DailyNote or VCP memory write
    - production candidate write
    - push/tag/release/deploy
  validation:
    required:
      - node --check review_console/static_prototype/mock_data.js
      - node --check review_console/static_prototype/app.js
      - node --check scripts/validate_controlled_visual_production_loop_contract.js
      - node scripts/validate_controlled_visual_production_loop_contract.js
      - git diff --check
      - node scripts/validate_agent_board_state.js
      - powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
      - powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1
    forbidden:
      - browser runtime validation
      - asset_archive file read
      - preview load
      - provider/plugin/API/image generation
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

## Goal

Create one explicit local-only contract that anchors the current controlled
visual production loop around the tennis-wallet route:

- accepted preview capsule evidence,
- failure-learning relation,
- unified capsule contract,
- verified durable archive baseline,
- and the remaining review-report / production / memory / runtime blockers.

The gate must remain static-only. It must not read `asset_archive/` files in the
browser, load previews, execute runtime code, or open any new A5 authority.

## Result

- `controlled_visual_production_loop_contract` is now present in static mock data
  and in `#draftOutput`.
- The static Review Console shows a dedicated controlled-loop contract panel.
- The local validator locks the canonical tennis-wallet route and keeps the
  current review-report binding gap explicit instead of implicit.

## Next

`controlled_visual_production_loop_checkpoint_readiness_gate_exact_files_only`
