# REVIEW CONSOLE FULL ASSET ARCHIVE BASELINE BRIDGE GATE

```yaml
gate_template:
  phase: review_console_full_asset_archive_baseline_bridge_gate
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
    - tests/schema_examples/REVIEW_CONSOLE_FULL_ASSET_ARCHIVE_BASELINE_STATE.example.json
    - scripts/validate_review_console_full_asset_archive_baseline.js
    - scripts/validate_mvp_capsule_product_core.ps1
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
    - static Review Console mock update
    - draft output state alignment
    - local validator creation
    - .agent_board continuity update
  forbidden_actions:
    - asset archive file reads
    - preview load or render
    - durable archive copy
    - provider/plugin/API/runtime actions
    - DailyNote or VCP memory write
    - production candidate write
    - push/tag/release/deploy
  validation:
    required:
      - node --check review_console/static_prototype/mock_data.js
      - node --check review_console/static_prototype/app.js
      - node --check scripts/validate_review_console_full_asset_archive_baseline.js
      - node scripts/validate_review_console_full_asset_archive_baseline.js
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

Expose the verified durable-original archive baseline inside the static Review
Console so the local product loop can show:

- the Git-portable preview capsule evidence,
- the verified durable original by-sha256 archive ref,
- the exact execution report and tracking-policy refs,
- and the remaining production / memory / runtime blockers.

The bridge must remain static-only. It must not read `asset_archive/` files in
the browser, load preview images, execute runtime code, or open any new A5
authority.

## Result

- `full_asset_archive_baseline_state` is now present in static mock data and in
  `#draftOutput`.
- The static Review Console shows a dedicated full-archive baseline panel.
- A local validator locks the panel, draft output key, field mapping, and
  no-runtime/no-read guard.

## Next

`controlled_visual_production_loop_contract_alignment_gate_static_only_no_runtime_no_file_reads`
