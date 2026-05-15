# v11.016 Prompt Schema Hardening Validation Strategy Gate

```yaml
gate_template:
  phase: v11_016_prompt_schema_hardening_validation_strategy_gate
  base_contract: AGENTS.md
  mode: A4.8
  intent: planning
  risk_level: R1
  allowed_files:
    - docs/v11_016_prompt_schema_hardening_validation_strategy_gate.md
    - docs/prompt_schema_hardening_validation_strategy.md
    - README.md
    - docs/00_project_roadmap.md
    - PROJECT_MASTER_PLAN.md
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
    - .agent_board/CHECKPOINT.md
    - .agent_board/VALIDATION_LOG.md
  forbidden_files:
    - reviews/
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
    - create route-level prompt schema hardening validation strategy
    - consolidate schema-level validation checks
    - update local project status surfaces
    - run local validation
    - exact-file staging and guarded local commit
  forbidden_actions:
    - provider contact
    - image generation
    - retry
    - env local secret value read
    - memory write
    - accepted samples write
    - runs output commit
    - production candidate promotion
    - runtime, CDP, bridge, or MCP
    - artifact migration
    - machine validator implementation
  validation:
    required:
      - git status -sb
      - git diff --check
      - exact diff review
      - node scripts/validate_native_doubao_sandbox.js
      - node scripts/validate_agent_board_state.js
      - node scripts/validate_current_state_alignment.js
      - powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1
      - powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
    forbidden:
      - scripts/run_native_doubao_image_generation.js
  commit:
    allowed: true
    message: docs: define prompt schema validation strategy
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

## Phase Diff

V11.016 creates [prompt_schema_hardening_validation_strategy.md](prompt_schema_hardening_validation_strategy.md), a route-level validation strategy that consolidates the field checks drafted across the V11 canonical schemas. It is a strategy document only. It does not implement a validator, change scripts, migrate artifacts, or alter runner behavior.

## Strategy Result

```yaml
validation_strategy:
  strategy_ref: docs/prompt_schema_hardening_validation_strategy.md
  source_inventory: docs/prompt_artifact_schema_inventory.md
  covers_product_brief_schema: true
  covers_prompt_package_schema: true
  covers_static_review_schema: true
  covers_A5_authorization_schema: true
  covers_human_review_schema: true
  covers_accepted_candidate_evidence_package_schema: true
  fail_warn_info_severity_model_defined: true
  legacy_warning_policy_defined: true
  future_validator_shape_defined: true
  route_level_pass_condition_defined: true
  machine_validator_implemented: false
  existing_artifacts_migrated: false
```

## Validation Matrix

| schema family | required strategy coverage | result |
|---|---|---|
| Product brief | identity, structure, material, scene, text/logo, non-goals | pass |
| Prompt package | `prompt`, YAML block shape, runner mapping, product/material/scene/text policy | pass |
| Static review | target, findings, checklist, verdict, A5 non-authorization | pass |
| A5 authorization | draft/confirmation/closeout split, budgets, no retry, secret boundary, local persistence | pass |
| Human review | reviewed output, local persistence, asset decision, delivery split, memory deferred, findings | pass |
| Accepted candidate evidence package | source output, prompt package, lineage, rationale, boundaries, no output copy | pass |
| Legacy drift | known older route shapes warn rather than fail | pass |
| Future validator | suggested script shape without implementation | pass |

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
  scripts_modified: false
  machine_validator_implemented: false
  artifact_migration_performed: false
  commercial_delivery_ready_changed: false
```

## Recommended Next

```yaml
recommended_next:
  phase: v11_017_prompt_schema_hardening_route_closeout_gate
  auto_execution_allowed: true
  purpose: 封存 V11 Prompt Schema Hardening 路线成果，确认 schema 与 validation strategy 已形成；仍不接 provider、不生成图、不写 memory。
```

## Closeout Template

```yaml
closeout:
  phase: v11_016_prompt_schema_hardening_validation_strategy_gate
  commit_message: "docs: define prompt schema validation strategy"
  branch: master
  source_commit: 37837e7a459a68df97be252702682b9411dc5bbd
  push: not_performed
  git_status: clean
  final_state:
    next_phase_started: false
```
