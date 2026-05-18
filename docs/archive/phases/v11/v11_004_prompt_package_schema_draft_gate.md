# v11.004 Prompt Package Schema Draft Gate

```yaml
gate_template:
  phase: v11_004_prompt_package_schema_draft_gate
  base_contract: AGENTS.md
  mode: A4.8
  intent: local_draft
  risk_level: R1
  allowed_files:
    - docs/archive/phases/v11/v11_004_prompt_package_schema_draft_gate.md
    - docs/prompt_package_canonical_schema.md
    - docs/schemas/prompt_package_schema_v1.md
    - README.md
    - docs/00_project_roadmap.md
    - PROJECT_MASTER_PLAN.md
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
    - .agent_board/CHECKPOINT.md
    - .agent_board/VALIDATION_LOG.md
  forbidden_files:
    - prompts/image_generation/
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
    - draft canonical prompt package schema
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
    - runner behavior change
    - prompt package behavior change
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
    message: docs: draft prompt package canonical schema
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

V11.004 turns the v11.003 inventory findings into a canonical prompt package schema draft. It is scoped to schema documentation only:

- no existing prompt package YAML is modified
- no runner, adapter, plugin, or validation script behavior is changed
- no A5 authorization is created
- no provider contact, image generation, memory write, production candidate, or runtime work is performed

## Schema Draft Output

The original canonical schema draft is recorded in [prompt_package_canonical_schema.md](prompt_package_canonical_schema.md).

The stable schema path requested for V11 schema hardening is recorded in [schemas/prompt_package_schema_v1.md](schemas/prompt_package_schema_v1.md). It preserves the same non-execution boundary and makes the v1 schema path explicit for future validators.

It defines:

- required identity and lineage fields
- runner-facing prompt fields
- prompt / positive_prompt sync policy
- YAML literal block expectations
- product identity, structure lock, material constraints, scene constraints, and text/logo boundary fields
- acceptance criteria and human review checklist fields
- no-execution safety flags
- validation strategy and migration policy for older prompt packages

## Risk Coverage

```yaml
risk_coverage:
  prompt_positive_prompt_sync_risk: covered
  yaml_literal_block_shape_risk: covered
  runner_facing_canonical_field_missing: covered
  product_identity_drift: covered
  structure_lock_missing: covered
  material_constraints_missing: covered
  label_fake_text_logo_boundary_missing: covered
  A5_authorization_execution_confusion: covered
  accepted_candidate_commercial_delivery_ready_confusion: separated_downstream
  memory_suitability_auto_inference: covered_by_no_execution_flags
  runs_output_accidental_commit: covered_by_no_output_flags
  post_push_status_wording_drift: kept_in_project_validation
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
  runner_behavior_changed: false
  stable_schema_path_added: docs/schemas/prompt_package_schema_v1.md
  machine_validator_implemented: false
  existing_prompt_packages_migrated: false
```

## Recommended Next

```yaml
recommended_next:
  phase: v11_005_prompt_package_schema_static_review_gate
  auto_execution_allowed: true
  purpose: 静态审查 prompt package canonical schema 是否覆盖 v11.003 inventory 风险；仍不接 provider、不生成图、不写 memory。
```

## Closeout Template

```yaml
closeout:
  phase: v11_004_prompt_package_schema_draft_gate
  commit_message: "docs: draft prompt package canonical schema"
  branch: master
  source_commit: 8331dc09c381946d9b93637c3478c837ab53d6e4
  push: not_performed
  git_status: clean
  final_state:
    next_phase_started: false
```

## Schema Path Alignment Addendum

```yaml
schema_path_alignment:
  added_schema_path: docs/schemas/prompt_package_schema_v1.md
  prompt_package_schema_created: true
  runner_canonical_prompt_field_defined: true
  positive_prompt_alias_defined: true
  prompt_positive_sync_required: true
  negative_prompt_required: true
  A5_authorization_separation_defined: true
  provider_contact_allowed_by_schema: false
  image_generation_allowed_by_schema: false
  memory_write_allowed_by_schema: false
  production_candidate_002_allowed_by_schema: false
  machine_validator_implemented: false
  existing_artifacts_migrated: false
```
