# CONTROLLED VISUAL PRODUCTION LOOP PRODUCTION CANDIDATE ACTIVATION PREFLIGHT

```yaml
gate_template:
  phase: controlled_visual_production_loop_production_candidate_activation_preflight
  base_contract: AGENTS.md
  mode: A4.8
  intent: local_implementation
  risk_level: R2
  allowed_files:
    - docs/CONTROLLED_VISUAL_PRODUCTION_LOOP_PRODUCTION_CANDIDATE_ACTIVATION_PREFLIGHT.md
    - reports/production_candidate_authorization/2026-05-21_tennis_wallet_production_candidate_A5_activation_preflight.json
    - scripts/validate_controlled_visual_production_loop_production_candidate_activation_preflight.js
    - scripts/validate_mvp_capsule_product_core.ps1
    - docs/00_project_roadmap.md
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
    - .agent_board/CHECKPOINT.md
  forbidden_actions:
    - git add .
    - staging files
    - commit
    - push
    - tag
    - release
    - deploy
    - provider/plugin/API call
    - image generation
    - .env or secret read
    - real manifest/VCPChat/VCPToolBox read
    - DailyNote or VCP memory write
    - production candidate write
    - runtime execution
  validation:
    required:
      - node --check scripts/validate_controlled_visual_production_loop_production_candidate_activation_preflight.js
      - node scripts/validate_controlled_visual_production_loop_production_candidate_activation_preflight.js
      - node scripts/validate_controlled_visual_production_loop_production_candidate_authorization.js
      - git diff --check
      - node scripts/validate_agent_board_state.js
      - powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
      - powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1
```

## Goal

Move the existing tennis-wallet `production_candidate` A5 package from draft
availability to activation preflight readiness, without executing the
production write.

This gate proves the activation door is narrow and inspectable:

- the source package still exists and remains `draft_not_active`,
- the exact future write targets are still absent,
- the accepted and failure route evidence still matches the tennis-wallet
  canonical route,
- image, memory, runtime, provider, plugin, API, and remote actions are still
  excluded,
- and the next step still requires the exact future A5 activation phrase.

## Preflight Record

```yaml
activation_preflight:
  preflight_ref: reports/production_candidate_authorization/2026-05-21_tennis_wallet_production_candidate_A5_activation_preflight.json
  source_authorization_ref: reports/production_candidate_authorization/2026-05-20_tennis_wallet_production_candidate_A5_authorization_package.json
  source_authorization_id: AUTH-PENDING-TENNIS-WALLET-PRODUCTION-CANDIDATE-20260520-001
  preflight_state: ready_for_explicit_activation
  activation_state_after_preflight: not_active
  execution_authorized_by_this_preflight: false
```

## Decision

```yaml
preflight_decision:
  ready_for_explicit_A5_activation: true
  production_candidate_write_allowed_now: false
  exact_future_write_path_count: 2
  exact_metadata_read_ref_count: 8
  future_write_targets_absent: true
  activation_phrase_required: true
  approval_phrase_ref: authorization_package.exact_future_approval_phrase
```

## Non-Authorization

```yaml
execution_performed:
  A5_activation_performed: false
  production_candidate_write_performed: false
  plan_yaml_created: false
  review_markdown_created: false
  image_binary_read_performed: false
  DailyNote_write_performed: false
  VCP_memory_write_performed: false
  provider_contact_performed: false
  plugin_call_performed: false
  api_call_performed: false
  runtime_execution_performed: false
  real_manifest_read_performed: false
  real_vcpchat_read_performed: false
  real_vcptoolbox_read_performed: false
  push_tag_release_deploy_performed: false
```

## Next

`explicit_local_commit_instruction_for_19_file_post_activation_slice`
