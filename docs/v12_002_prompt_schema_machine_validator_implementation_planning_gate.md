# v12.002 Prompt Schema Machine Validator Implementation Planning Gate

```yaml
gate_template:
  phase: v12_002_prompt_schema_machine_validator_implementation_planning_gate
  base_contract: AGENTS.md
  mode: A4.8
  intent: planning
  risk_level: R1
  allowed_files:
    - docs/v12_002_prompt_schema_machine_validator_implementation_planning_gate.md
    - docs/prompt_schema_machine_validator_implementation_plan.md
    - docs/prompt_schema_machine_validator_rule_inventory.md
    - README.md
    - docs/00_project_roadmap.md
    - PROJECT_MASTER_PLAN.md
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
    - .agent_board/CHECKPOINT.md
    - .agent_board/VALIDATION_LOG.md
  forbidden_files:
    - scripts/
    - prompts/image_generation/
    - runs/
    - accepted_samples/
    - plugins/
    - adapters/
    - package.json
    - package-lock.json
    - .env
    - .env.local
  allowed_actions:
    - plan future prompt schema machine validator implementation
    - map canonical schemas to future validator rule groups
    - define fixture strategy and legacy compatibility policy
    - update docs and state surfaces
    - run local validation
    - exact-file staging and guarded commit plus guarded push
  forbidden_actions:
    - implement machine validator
    - create scripts/validate_prompt_schema*.js
    - modify scripts
    - modify package files or dependencies
    - migrate existing artifacts
    - modify prompt packages
    - change runner behavior
    - provider contact
    - image generation
    - retry
    - env local secret value read
    - memory write
    - production candidate promotion
    - runtime, CDP, bridge, or MCP
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
    message: docs: plan prompt schema machine validator implementation
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

## Phase Diff

v12.002 starts the selected V12 route from v12.001 Option A: `prompt_schema_machine_validator_implementation_planning`. It converts the V11 canonical schema set into a future implementation plan, without implementing the validator or touching executable code.

## Planning Outputs

```yaml
implementation_planning:
  selected_route: prompt_schema_machine_validator_implementation_planning
  implementation_plan_created: true
  implementation_plan_path: docs/prompt_schema_machine_validator_implementation_plan.md
  rule_inventory_created: true
  rule_inventory_path: docs/prompt_schema_machine_validator_rule_inventory.md
  fixture_strategy_created: true
  schema_to_validator_mapping_created: true
  legacy_artifact_compatibility_policy_created: true
  machine_validator_implemented: false
  existing_artifacts_migrated: false
  runner_behavior_changed: false
  scripts_modified: false
  dependency_change: false
  package_json_modified: false
```

## Schema Scope

```yaml
schema_scope:
  prompt_package_schema_v1: planned
  product_brief_schema: planned
  static_review_schema: planned
  A5_authorization_schema: planned
  human_review_schema: planned
  accepted_candidate_evidence_package_schema: planned
  route_level_validation_strategy: planned
```

## Non-Authorization

This gate does not create `scripts/validate_prompt_schema*.js`, does not modify existing scripts, does not add dependencies, does not migrate legacy artifacts, and does not modify existing prompt packages.

```yaml
non_authorization:
  machine_validator_implemented: false
  validator_script_created: false
  scripts_modified: false
  package_json_modified: false
  package_lock_modified: false
  dependency_change: false
  existing_artifacts_migrated: false
  prompts_modified: false
  runner_behavior_changed: false
  V12_execution_started: false
```

## Recommended Next

```yaml
recommended_next:
  phase: v12_003_prompt_schema_validator_rule_specification_gate
  auto_execution_allowed: true
  purpose: 基于 implementation plan 细化 validator rule spec 与 fixture matrix；仍不实现 validator、不改 scripts、不迁移 artifacts。
```

## Closeout Template

```yaml
closeout:
  phase: v12_002_prompt_schema_machine_validator_implementation_planning_gate
  commit_message: "docs: plan prompt schema machine validator implementation"
  branch: master
  source_commit: f789f72dfbb104932e6b482fd9543bbb02ca6ed9
  final_state:
    next_phase_started: false
```
