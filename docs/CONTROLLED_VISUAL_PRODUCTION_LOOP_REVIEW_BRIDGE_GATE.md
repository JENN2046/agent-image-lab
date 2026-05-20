# CONTROLLED VISUAL PRODUCTION LOOP REVIEW BRIDGE GATE

```yaml
gate_template:
  phase: controlled_visual_production_loop_review_bridge_gate
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
    - tests/schema_examples/CONTROLLED_VISUAL_PRODUCTION_LOOP_REVIEW_BRIDGE_STATE.example.json
    - tests/schema_examples/CONTROLLED_VISUAL_PRODUCTION_LOOP_CONTRACT.example.json
    - scripts/validate_controlled_visual_production_loop_review_bridge.js
    - scripts/validate_controlled_visual_production_loop_contract.js
    - scripts/validate_mvp_capsule_product_core.ps1
    - docs/CONTROLLED_VISUAL_PRODUCTION_LOOP_REVIEW_BRIDGE_GATE.md
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
    - static review-bridge alignment
    - draft output state alignment
    - local validator creation
    - .agent_board continuity update
  forbidden_actions:
    - asset archive file reads
    - preview load or render
    - provider/plugin/API/runtime actions
    - DailyNote or VCP memory write
    - production candidate write
    - push/tag/release/deploy
```

## Goal

Bind the local review flow to the same tennis-wallet canonical route that already
anchors the accepted capsule, failure-learning relation, and durable archive
baseline, without changing the older generic adapter handoff chain.

## Result

- `controlled_visual_production_loop_review_bridge_state` is now present in
  static mock data and in `#draftOutput`.
- The static Review Console exposes a dedicated review-bridge panel for the
  current canonical route.
- The controlled loop contract no longer treats review binding as the current
  local blocker; remaining blockers move back to authorization and runtime.

## Next

`controlled_visual_production_loop_checkpoint_readiness_gate_exact_files_only`
