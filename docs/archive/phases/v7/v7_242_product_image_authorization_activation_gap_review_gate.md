# v7.242 Product Image Authorization Activation Gap Review Gate

```yaml
gate_template:
  phase: v7.242_product_image_authorization_activation_gap_review_gate
  base_contract: AGENTS.md
  mode: A4.5
  intent: review
  risk_level: R1
  allowed_files:
    - docs/product_image_authorization_activation_gap_review.md
    - docs/archive/phases/v7/v7_242_product_image_authorization_activation_gap_review_gate.md
    - README.md
    - PROJECT_MASTER_PLAN.md
    - docs/00_project_roadmap.md
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
    - .agent_board/CHECKPOINT.md
    - .agent_board/VALIDATION_LOG.md
  forbidden_files:
    - real VCPChat source
    - real VCPToolBox source
    - real plugin-manifest.json
    - .env
    - config.env
    - runs/*
    - image binaries
  allowed_actions:
    - review remaining active A5 activation gaps after v7.241
    - classify which gaps are paper-preparable versus activation-only
    - update local documentation indexes
    - update agent_board resume surfaces
    - run local validation
  forbidden_actions:
    - A5 activation
    - provider or plugin selection
    - provider contact
    - plugin call
    - API call
    - image generation
    - output save
    - runtime execution
    - DailyNote write
    - VCP memory write
    - real manifest read
    - raw prompt payload creation
    - real output path selection
    - push
    - tag
    - release
  validation:
    required:
      - git status --short --branch
      - git diff --check
      - node scripts/validate_agent_board_state.js
      - powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1
      - powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
    forbidden:
      - provider calls
      - plugin/API calls
      - image generation
      - DailyNote/VCP memory writes
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

## Phase Difference Patch

```yaml
phase_diff:
  phase_value:
    - turns remaining blockers into a concrete activation gap matrix
    - separates A4 paper-preparable fields from fields that require active human authorization
    - defines the minimum future active package shape without activating it
  source_artifacts:
    - docs/product_image_generation_authorization_draft.md
    - docs/archive/phases/v7/v7_241_product_image_authorization_draft_plan_ref_alignment_gate.md
  created_artifact:
    - docs/product_image_authorization_activation_gap_review.md
```

## Gate Result

```yaml
gate_result:
  status: completed_validated
  activation_gap_review_created: true
  source_authorization_package: AUTH-DRAFT-20260512-001
  source_generation_plan: GP-DRAFT-20260512-001
  plan_ref_gap_closed: true
  remaining_gaps_classified: true
  active_A5_ready_now: false
  active_A5_authorization_created: false
  provider_contact_allowed_now: false
  plugin_call_allowed_now: false
  image_generation_allowed_now: false
  output_save_allowed_now: false
  memory_write_allowed_now: false
  recommended_next: v7.243_product_image_active_authorization_package_skeleton_gate
```

## Closeout

```yaml
closeout:
  instruction_sources_checked:
    AGENTS_loaded: true
    autopilot_overlay_loaded_or_read: true
    agent_board_loaded: true
    README_autopilot_loaded_or_reviewed: true
  agent_board:
    checked: true
    updated: true
    stale_risk: false
    handoff_current: true
    run_state_current: true
    task_queue_current: true
    checkpoint_current: true
  staging:
    used_git_add_dot: false
    staged_exact_files_only: true
  safety:
    A5_execution: false
    provider_contact: false
    plugin_called: false
    image_generated: false
    memory_written: false
    daily_note_written: false
    runtime_execution: false
    VCPChat_runtime: false
    VCPToolBox_runtime: false
    cdp_accessed: false
    bridge_methods_called: false
    mcp_called: false
    production_candidate_002_started: false
    batch_005_started: false
    package_json_modified: false
    dependency_added: false
    env_or_secret_touched: false
```
