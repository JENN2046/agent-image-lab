# v11.008 Static Review Schema Draft Gate

```yaml
gate_template:
  phase: v11_008_static_review_schema_draft_gate
  base_contract: AGENTS.md
  mode: A4.8
  intent: local_draft
  risk_level: R1
  allowed_files:
    - docs/archive/phases/v11/v11_008_static_review_schema_draft_gate.md
    - docs/static_review_canonical_schema.md
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
    - draft canonical static review schema
    - document validation strategy
    - update local project status surfaces
    - run local validation
    - exact-file staging and guarded local commit
  forbidden_actions:
    - provider contact
    - image generation
    - retry
    - env local secret value read
    - memory write
    - production candidate promotion
    - runtime, CDP, bridge, or MCP
    - prompt package behavior change
    - review artifact migration
    - machine validator implementation
    - A5 generation authorization creation
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
    message: docs: draft static review canonical schema
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

V11.008 drafts a canonical static review schema from the v11.003 inventory and the v8.024 prompt v2 static review pattern. It does not migrate existing reviews, implement a validator, modify prompt packages, or create an A5 authorization.

## Schema Draft Output

The static review schema draft is recorded in [static_review_canonical_schema.md](static_review_canonical_schema.md).

It defines:

- review identity and target lineage
- source findings and review inputs
- checklist shape with result/evidence/risk level
- review verdict and authorization readiness boundary
- remaining risks and next gate
- no-execution safety fields
- validation strategy for future machine checks

## Risk Coverage

```yaml
risk_coverage:
  static_review_field_name_drift: covered
  pass_fail_semantics_prose_only: covered
  source_findings_missing: covered
  checklist_evidence_missing: covered
  A5_authorization_created_by_static_review_confusion: covered
  provider_contact_image_generation_confusion: covered
  memory_suitability_auto_inference: covered
  accepted_candidate_commercial_delivery_ready_confusion: covered
  next_gate_auto_execution_confusion: covered
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
  prompt_package_behavior_changed: false
  review_artifact_migration_performed: false
  machine_validator_implemented: false
```

## Recommended Next

```yaml
recommended_next:
  phase: v11_009_static_review_schema_static_review_gate
  auto_execution_allowed: true
  purpose: 静态审查 static review canonical schema 是否覆盖 v11.003 inventory 风险；仍不接 provider、不生成图、不写 memory。
```

## Closeout Template

```yaml
closeout:
  phase: v11_008_static_review_schema_draft_gate
  commit_message: "docs: draft static review canonical schema"
  branch: master
  source_commit: 8f8b3356326d49a7e0f14953aaa82d86ef374e7f
  push: not_performed
  git_status: clean
  final_state:
    next_phase_started: false
```
