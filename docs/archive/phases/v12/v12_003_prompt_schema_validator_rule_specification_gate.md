# v12.003 Prompt Schema Validator Rule Specification Gate

```yaml
gate_template:
  phase: v12_003_prompt_schema_validator_rule_specification_gate
  base_contract: AGENTS.md
  mode: A4.8
  intent: planning
  risk_level: R1
  allowed_files:
    - docs/archive/phases/v12/v12_003_prompt_schema_validator_rule_specification_gate.md
    - docs/prompt_schema_validator_rule_specification.md
    - docs/prompt_schema_validator_fixture_matrix.md
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
    - tests/fixtures/
    - prompts/image_generation/
    - runs/
    - accepted_samples/
    - package.json
    - package-lock.json
    - .env
    - .env.local
  allowed_actions:
    - specify future prompt schema validator rules
    - define planned fixture matrix and file names
    - update docs and state surfaces
    - run local validation
    - exact-file staging and guarded commit plus guarded push
  forbidden_actions:
    - implement machine validator
    - modify scripts
    - create fixture files
    - modify package files
    - add dependencies
    - migrate artifacts
    - modify prompt packages
    - enter provider/image/memory/production/runtime execution
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
    message: docs: specify prompt schema validator rules
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

v12.003 refines v12.002's implementation planning into exact rule categories, severity behavior, legacy compatibility cases, and planned fixture names. It does not create fixture files and does not implement validator code.

## Outputs

```yaml
rule_specification:
  selected_route: prompt_schema_machine_validator_implementation_planning
  rule_specification_created: true
  rule_specification_path: docs/prompt_schema_validator_rule_specification.md
  fixture_matrix_created: true
  fixture_matrix_path: docs/prompt_schema_validator_fixture_matrix.md
  severity_model_created: true
  pass_fail_warn_policy_created: true
  legacy_compatibility_cases_created: true
  planned_fixture_names_created: true
  machine_validator_implemented: false
  fixture_files_created: false
  scripts_modified: false
  package_json_modified: false
  dependency_change: false
  existing_artifacts_migrated: false
```

## Rule Scope

```yaml
rule_scope:
  prompt_package_rules_specified: true
  product_brief_rules_specified: true
  static_review_rules_specified: true
  A5_authorization_rules_specified: true
  human_review_rules_specified: true
  accepted_candidate_evidence_rules_specified: true
  route_level_validation_rules_specified: true
```

## Non-Authorization

```yaml
non_authorization:
  validator_implementation: false
  scripts_modified: false
  fixture_files_created: false
  package_json_modified: false
  package_lock_modified: false
  dependency_change: false
  existing_artifacts_migrated: false
  prompt_packages_modified: false
  provider_contact: false
  image_generation: false
  memory_write: false
  production_candidate_002: false
  runtime_execution: false
```

## Recommended Next

```yaml
recommended_next:
  phase: v12_004_prompt_schema_validator_fixture_planning_closeout_or_implementation_decision_gate
  auto_execution_allowed: false
  purpose: 人工决定是否继续细化 fixture planning、进入 implementation authorization gate，或暂时封存 V12 planning。
```
