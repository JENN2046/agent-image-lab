# v12.001 Route Selection Gate

```yaml
gate_template:
  phase: v12_001_route_selection_gate
  base_contract: AGENTS.md
  mode: A4.8
  intent: planning
  risk_level: R1
  allowed_files:
    - docs/v12_001_route_selection_gate.md
    - README.md
    - docs/00_project_roadmap.md
    - PROJECT_MASTER_PLAN.md
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
    - .agent_board/CHECKPOINT.md
    - .agent_board/VALIDATION_LOG.md
  forbidden_files:
    - runs/
    - accepted_samples/
    - prompts/image_generation/
    - scripts/
    - plugins/
    - adapters/
    - .env
    - .env.local
    - package.json
    - package-lock.json
  allowed_actions:
    - present V12 route options
    - record recommended V12 route
    - update current state surfaces
    - run local validation
    - exact-file staging and guarded commit plus guarded push
  forbidden_actions:
    - provider contact
    - image generation
    - retry
    - env local secret value read
    - DailyNote write
    - VCP memory write
    - memory write path
    - production_candidate_002
    - Batch_005
    - runtime, CDP, bridge, or MCP
    - accepted_samples write
    - runs output commit
    - dependency or package change
    - machine validator implementation
    - existing artifact migration
    - V12 route execution
  validation:
    required:
      - git status -sb
      - git diff --check
      - exact diff review
      - node scripts/validate_agent_board_state.js
      - node scripts/validate_current_state_alignment.js
      - node scripts/validate_native_doubao_sandbox.js
      - powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1
      - powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
  commit:
    allowed: true
    message: docs: select v12 project route
  push:
    allowed: true
  explicit_non_authorization:
    generation: false
    plugin_call: false
    provider_contact: false
    runtime: false
    memory_write: false
    DailyNote_write: false
```

## Source State

```yaml
source:
  source_phase: v11_018_post_remote_sync_state_reconciliation_gate
  source_commit: b8dec73f116841525c1c1cca26b8d7fa5a16ae57
  selected_previous_route: prompt_schema_hardening
  v11_prompt_schema_hardening_closed: true
  prompt_package_schema_path_alignment_included: true
  canonical_schemas_created: true
  canonical_schema_static_reviews_completed: true
  validation_strategy_created: true
  machine_validator_implemented: false
  existing_artifacts_migrated: false
```

## Route Options

### Option A - Prompt Schema Machine Validator Implementation Planning

Plan how to turn the V11 canonical schemas into a future machine validator. This route is recommended because it converts the schema hardening work into a validation-ready implementation plan without implementing code in this gate.

```yaml
option_A:
  route: prompt_schema_machine_validator_implementation_planning
  risk: medium
  action_now: planning_only
  machine_validator_implemented_now: false
  value: prepares future validation for prompt package, product brief, static review, A5 authorization, human review, and evidence package schemas
```

### Option B - Existing Artifact Migration Planning

Plan how legacy brief, prompt package, review, evidence, and authorization artifacts would migrate toward the V11 schemas. This gate does not migrate anything.

```yaml
option_B:
  route: existing_artifact_migration_planning
  risk: medium
  action_now: planning_only
  existing_artifacts_migrated_now: false
  forbidden_now:
    - batch historical artifact rewrite
    - runs output modification
    - accepted_samples write
```

### Option C - Review Console Productization Planning

Plan how asset status, human review, schema compliance, evidence packages, and route gates could become future Review Console product surfaces. This route is the backup option, but it remains planning-only.

```yaml
option_C:
  route: review_console_productization_planning
  risk: medium
  action_now: planning_only
  runtime_implementation_now: false
```

### Option D - Fourth Product Prompt Workflow Expansion

Select a fourth product and continue the brief to prompt package to static review to A5 decision gate paperwork chain. This is not recommended immediately because the V11 validator has not been planned or implemented.

```yaml
option_D:
  route: fourth_product_prompt_workflow_expansion
  risk: low_to_medium
  default_generation_allowed: false
  recommended_now: false
```

### Option E - Delivery Completion Package Track

Add export naming, QA sheet, delivery checklist, and handoff materials around the existing accepted candidates without modifying images or performing delivery.

```yaml
option_E:
  route: delivery_completion_package_track
  risk: low
  image_modification_allowed_now: false
  commercial_delivery_execution_now: false
```

### Option F - Memory Suitability Planning

Plan memory suitability and possible memory write boundaries. This does not authorize DailyNote or VCP memory writes.

```yaml
option_F:
  route: memory_suitability_planning
  risk: medium_high
  memory_write_allowed_now: false
  recommended_now: false
```

### Option G - Production Candidate 002 Readiness Planning

Plan production_candidate_002 readiness without entering production execution.

```yaml
option_G:
  route: production_candidate_002_readiness_planning
  risk: high
  production_candidate_002_allowed_now: false
  recommended_now: false
```

## Recommendation

```yaml
route_selection:
  recommended_option: prompt_schema_machine_validator_implementation_planning
  backup_option: review_console_productization_planning
  human_decision_required: true
  auto_execution_allowed: false
```

## Boundary Confirmation

```yaml
safety:
  provider_contact: false
  image_generation: false
  retry: false
  env_local_secret_value_read: false
  secret_value_printed: false
  DailyNote_write: false
  VCP_memory_write: false
  memory_write_path: false
  production_candidate_002: false
  Batch_005: false
  dependency_change: false
  package_json_modified: false
  runs_output_committed: false
  accepted_samples_written: false
  machine_validator_implemented: false
  existing_artifacts_migrated: false
  runtime_execution: false
```

## Recommended Next

```yaml
recommended_next:
  phase: pending_human_v12_route_selection
  auto_execution_allowed: false
  purpose: 等待人工选择 V12 路线；不得自动进入 validator implementation、artifact migration、provider、image generation、memory、production 或 runtime。
```
