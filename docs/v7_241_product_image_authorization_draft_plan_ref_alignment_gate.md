# v7.241 Product Image Authorization Draft Plan Ref Alignment Gate

```yaml
gate_template:
  phase: v7.241_product_image_authorization_draft_plan_ref_alignment_gate
  base_contract: AGENTS.md
  mode: A4.5
  intent: local_implementation
  risk_level: R1
  allowed_files:
    - docs/product_image_generation_authorization_draft.md
    - docs/v7_241_product_image_authorization_draft_plan_ref_alignment_gate.md
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
    - patch the non-active authorization draft with GP-DRAFT-20260512-001 / v1
    - remove only the resolved plan-ref missing blockers
    - keep all executable A5 fields as placeholders or blocked values
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
    - resolves only generation_plan_ref_missing and generation_plan_version_missing in the non-active authorization draft
    - preserves draft / not_requested status
    - keeps model, plugin, call budget, output, review console, expiry, and preflight blockers active
  source_match_review:
    - docs/product_image_generation_plan_authorization_match_review.md
  patched_artifact:
    - docs/product_image_generation_authorization_draft.md
```

## Gate Result

```yaml
gate_result:
  status: completed_validated
  authorization_draft_patched: true
  generation_plan_ref: GP-DRAFT-20260512-001
  generation_plan_version: v1
  resolved_blockers:
    - generation_plan_ref_missing
    - generation_plan_version_missing
  remaining_blockers:
    - authorization_status_is_draft
    - approval_status_is_not_requested
    - target_model_or_plugin_missing
    - allowed_call_count_missing
    - retry_limit_missing
    - output_directory_ref_missing
    - output_save_policy_missing
    - review_console_ref_missing
    - exact_approval_phrase_not_usable
    - expires_at_missing
    - pre_execution_lock_not_run
  ready_for_active_A5_execution: false
  active_A5_authorization_created: false
  provider_contact_allowed_now: false
  plugin_call_allowed_now: false
  image_generation_allowed_now: false
  output_save_allowed_now: false
  memory_write_allowed_now: false
  recommended_next: v7.242_product_image_authorization_activation_gap_review_gate
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
