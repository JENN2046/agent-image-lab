# v12.004 Prompt Schema Validator Fixture Planning Closeout Or Implementation Decision Gate

```yaml
gate_template:
  phase: v12_004_prompt_schema_validator_fixture_planning_closeout_or_implementation_decision_gate
  base_contract: AGENTS.md
  mode: A4.8
  intent: planning
  risk_level: R1
  allowed_files:
    - docs/v12_004_prompt_schema_validator_fixture_planning_closeout_or_implementation_decision_gate.md
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
    - present v12.004 path options
    - record recommended implementation authorization gate route
    - update docs and state surfaces
    - run local validation
    - exact-file staging and guarded commit plus guarded push
  forbidden_actions:
    - implement machine validator
    - create scripts/validate_prompt_schema*.js
    - modify scripts
    - create fixture files
    - create tests/fixtures/
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
    message: docs: decide prompt schema validator implementation path
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

v12.004 is a docs-only decision gate after v12.003 rule specification and fixture matrix planning. It presents the next path choices for the Prompt Schema Machine Validator route and stops before any implementation, fixture creation, script modification, artifact migration, provider contact, image generation, memory write, production action, or runtime execution.

## Current Inputs

```yaml
source_phase: v12_003_prompt_schema_validator_rule_specification_gate
source_commit: c27e77afb5e9cdd3b3a5b5d7ad25a52fe4ee9af5
selected_route: prompt_schema_machine_validator_implementation_planning
rule_specification_created: true
fixture_matrix_created: true
severity_model_created: true
pass_fail_warn_policy_created: true
legacy_compatibility_cases_created: true
planned_fixture_names_created: true
machine_validator_implemented: false
fixture_files_created: false
scripts_modified: false
existing_artifacts_migrated: false
```

## Decision Options

### Option A - continue_fixture_planning_as_docs_only

Continue with docs-only fixture planning. This would refine fixture authoring policy, expected result manifests, legacy fixture scope, and negative fixture minimality without creating real fixture files or modifying scripts.

```yaml
meaning: continue fixture authoring policy and expected-result planning as documentation only
risk: low
creates_fixture_files: false
modifies_scripts: false
implements_validator: false
```

### Option B - enter_validator_implementation_authorization_gate

Enter a dedicated authorization gate for future implementation. The authorization gate would decide whether a later phase may create files such as `scripts/validate_prompt_schema*.js` and `tests/fixtures/prompt_schema_validator/*`.

```yaml
meaning: prepare the exact implementation authorization boundary before any code or fixture files are created
risk: medium
recommended: true
implements_validator_in_this_phase: false
creates_fixture_files_in_this_phase: false
next_phase_must_remain_authorization_only_until_explicitly_approved: true
```

### Option C - close_v12_planning_route

Close V12 planning without moving toward implementation. This preserves the rule specification and fixture matrix as planning assets and returns the project to route selection for image workflow, Review Console, delivery work, or another track.

```yaml
meaning: stop the Prompt Schema Machine Validator planning route here
risk: lowest
implements_validator: false
preserves_planning_artifacts: true
```

## Recommendation

```yaml
recommended_option: enter_validator_implementation_authorization_gate
reason:
  - v12.002 and v12.003 have already created enough planning detail to make an implementation authorization gate meaningful.
  - a separate authorization gate keeps script and fixture writes explicit before any validator implementation begins.
  - continuing only documentation planning risks repeating the same boundary statements without materially reducing implementation risk.
human_decision_required: true
auto_implementation_allowed: false
```

## Decision Gate Closeout

```yaml
decision_gate:
  selected_route: prompt_schema_machine_validator_implementation_planning
  rule_specification_created: true
  fixture_matrix_created: true
  options_presented:
    - continue_fixture_planning_as_docs_only
    - enter_validator_implementation_authorization_gate
    - close_v12_planning_route
  recommended_option: enter_validator_implementation_authorization_gate
  human_decision_required: true
  machine_validator_implemented: false
  fixture_files_created: false
  scripts_modified: false
  existing_artifacts_migrated: false
```

## Non-Authorization

```yaml
safety:
  provider_contact: false
  image_generation: false
  retry: false
  env_local_secret_value_read: false
  DailyNote_write: false
  VCP_memory_write: false
  memory_write_path: false
  production_candidate_002: false
  Batch_005: false
  runtime_execution: false
  CDP_bridge_MCP: false
  accepted_samples_written: false
  runs_output_committed: false
  dependency_change: false
  package_json_modified: false
  package_lock_modified: false
  scripts_modified: false
  validator_implementation_created: false
  fixture_files_created: false
  tests_fixtures_directory_created: false
  existing_artifacts_migrated: false
  prompt_packages_modified: false
```

## Recommended Next

```yaml
recommended_next:
  phase: pending_human_prompt_schema_validator_implementation_path_selection
  auto_execution_allowed: false
  purpose: 等待人工选择 Option A/B/C；不得自动进入 validator implementation、fixture creation、artifact migration、provider、image generation、memory、production 或 runtime。
```

## Final State

```yaml
final_state:
  next_phase_started: false
```
