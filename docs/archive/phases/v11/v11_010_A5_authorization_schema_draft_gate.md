# v11.010 A5 Authorization Schema Draft Gate

```yaml
gate_template:
  phase: v11_010_A5_authorization_schema_draft_gate
  base_contract: AGENTS.md
  mode: A4.8
  intent: local_draft
  risk_level: R1
  allowed_files:
    - docs/archive/phases/v11/v11_010_A5_authorization_schema_draft_gate.md
    - docs/a5_authorization_canonical_schema.md
    - README.md
    - docs/00_project_roadmap.md
    - PROJECT_MASTER_PLAN.md
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
    - .agent_board/CHECKPOINT.md
    - .agent_board/VALIDATION_LOG.md
  forbidden_files:
    - briefs/
    - prompts/image_generation/
    - schemas/
    - scripts/
    - plugins/
    - adapters/
    - runs/
    - accepted_samples/
    - .env
    - .env.local
    - package.json
    - package-lock.json
  allowed_actions:
    - draft A5 authorization canonical schema
    - document authorization draft, execution confirmation, and execution closeout separation
    - update local project status surfaces
    - run local validation
    - exact-file staging and guarded local commit
  forbidden_actions:
    - create real A5 authorization
    - provider contact
    - image generation
    - retry
    - env local secret value read
    - memory write
    - production candidate promotion
    - runtime, CDP, bridge, or MCP
    - runner behavior change
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
    message: docs: draft A5 authorization canonical schema
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

V11.010 drafts a canonical schema for A5 authorization records and the adjacent execution confirmation / execution closeout records. This gate is a schema draft only. It does not create a real A5 authorization, contact a provider, read `.env.local`, create an output directory, generate an image, or run the native Doubao runner.

## Schema Draft Output

The A5 authorization schema draft is recorded in [a5_authorization_canonical_schema.md](a5_authorization_canonical_schema.md).

It defines:

- authorization draft schema
- execution confirmation schema
- execution closeout schema
- secret read boundary fields
- provider/generation/output budgets
- local persistence success requirements
- no-retry and stop-after-generation policies
- non-inheritance and new-authorization markers
- validation strategy for future machine checks

## Risk Coverage

```yaml
risk_coverage:
  A5_authorization_execution_confusion: covered
  authorization_draft_treated_as_execution: covered
  secret_read_boundary_missing: covered
  provider_call_budget_missing: covered
  generation_attempt_budget_missing: covered
  output_image_budget_missing: covered
  retry_policy_missing: covered
  output_persistence_success_rule_missing: covered
  previous_authorization_reuse_confusion: covered
  execution_closeout_missing_local_persistence_result: covered
```

## Boundary Confirmation

```yaml
safety:
  A5_authorization_created: false
  A5_execution_started: false
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
  runner_behavior_changed: false
  machine_validator_implemented: false
```

## Recommended Next

```yaml
recommended_next:
  phase: v11_011_A5_authorization_schema_static_review_gate
  auto_execution_allowed: true
  purpose: 静态审查 A5 authorization canonical schema 是否覆盖 v11.003 inventory 风险；仍不接 provider、不生成图、不读 .env.local。
```

## Closeout Template

```yaml
closeout:
  phase: v11_010_A5_authorization_schema_draft_gate
  commit_message: "docs: draft A5 authorization canonical schema"
  branch: master
  source_commit: 7c8f782813b0c87025987c696a95a022cb8af591
  push: not_performed
  git_status: clean
  final_state:
    next_phase_started: false
```
