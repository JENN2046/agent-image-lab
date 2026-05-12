# v7.243 Product Image Active Authorization Package Skeleton Gate

```yaml
gate_template:
  phase: v7.243_product_image_active_authorization_package_skeleton_gate
  base_contract: AGENTS.md
  mode: A4.5
  intent: local_draft
  risk_level: R1
  allowed_files:
    - docs/product_image_active_authorization_package_skeleton.md
    - docs/v7_243_product_image_active_authorization_package_skeleton_gate.md
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
    - create a simplified preflight-pending authorization draft
    - record user-filled approval fields without executing generation
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
    - creates a one-page preflight-pending authorization draft for a future A5 generation
    - records plugin, model, call count, output directory, approval phrase, approver, and expiry in one place
    - keeps execute_now=false and preflight_required=true
    - closes the A4 paper-preparation loop without starting A5 execution
  source_artifacts:
    - docs/product_image_generation_authorization_draft.md
    - docs/product_image_authorization_activation_gap_review.md
  created_artifact:
    - docs/product_image_active_authorization_package_skeleton.md
```

## Gate Result

```yaml
gate_result:
  status: completed_validated
  simplified_preflight_pending_draft_created: true
  draft_id: AUTH-PENDING-20260512-001
  package_status: preflight_pending
  execute_now: false
  preflight_required: true
  selected_plugin_id: DoubaoGen
  selected_plugin_command: generate
  selected_plugin_model: doubao-seedream-5-0-260128
  max_plugin_calls: 1
  retry_limit: 0
  output_directory_ref: A:\agent-image-lab-IMAGE-OUTPUT
  active_A5_ready_now: false
  active_A5_authorization_created: false
  provider_contact_allowed_now: false
  plugin_call_allowed_now: false
  image_generation_allowed_now: false
  output_save_allowed_now: false
  memory_write_allowed_now: false
  recommended_next: run_active_a5_preflight_only
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
