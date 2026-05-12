# v7.240 Product Image Generation Plan Authorization Match Review Gate

```yaml
gate_template:
  phase: v7.240_product_image_generation_plan_authorization_match_review_gate
  base_contract: AGENTS.md
  mode: A4.5
  intent: review
  risk_level: R1
  allowed_files:
    - docs/product_image_generation_plan_authorization_match_review.md
    - docs/v7_240_product_image_generation_plan_authorization_match_review_gate.md
    - README.md
    - PROJECT_MASTER_PLAN.md
    - docs/00_project_roadmap.md
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
    - .agent_board/BLOCKERS.md
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
    - compare non-executing generation plan draft to non-active authorization draft
    - create paper-level match review
    - update local documentation indexes
    - update agent_board resume surfaces
    - run local validation
  forbidden_actions:
    - A5 activation
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
    - verifies whether GP-DRAFT-20260512-001 can safely reduce the authorization draft's missing generation_plan_ref blocker
    - separates paper-level compatibility from active execution readiness
    - identifies the smallest next non-active authorization draft patch
  reviewed_inputs:
    - docs/product_image_generation_plan_draft.md
    - docs/product_image_generation_authorization_draft.md
    - docs/product_image_generation_authorization_draft_review.md
  output_artifact:
    - docs/product_image_generation_plan_authorization_match_review.md
```

## Gate Result

```yaml
gate_result:
  status: completed_validated
  paper_level_match_review_created: true
  prompt_package_scope_matches: true
  generation_plan_ref_available: true
  authorization_draft_references_plan_now: false
  ready_to_patch_authorization_draft_with_plan_ref: true
  ready_for_active_A5_execution: false
  active_A5_authorization_created: false
  provider_contact_allowed_now: false
  plugin_call_allowed_now: false
  image_generation_allowed_now: false
  output_save_allowed_now: false
  memory_write_allowed_now: false
  recommended_next: v7.241_product_image_authorization_draft_plan_ref_alignment_gate
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
