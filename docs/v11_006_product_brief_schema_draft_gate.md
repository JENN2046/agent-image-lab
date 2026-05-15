# v11.006 Product Brief Schema Draft Gate

```yaml
gate_template:
  phase: v11_006_product_brief_schema_draft_gate
  base_contract: AGENTS.md
  mode: A4.8
  intent: local_draft
  risk_level: R1
  allowed_files:
    - docs/v11_006_product_brief_schema_draft_gate.md
    - docs/product_brief_canonical_schema.md
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
    - draft canonical product brief schema
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
    - brief behavior change
    - prompt package behavior change
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
    message: docs: draft product brief canonical schema
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

V11.006 drafts a canonical product brief schema from the existing sports visor and premium serum bottle briefs, while preserving the ceramic mug route as a legacy route without a dedicated `briefs/` artifact.

This gate does not edit existing brief files, create prompt packages, implement a validator, create A5 authorization, or perform generation.

## Schema Draft Output

The product brief schema draft is recorded in [product_brief_canonical_schema.md](product_brief_canonical_schema.md).

It defines:

- brief identity and route lineage
- product identity lock
- structure lock
- material and texture constraints
- color or finish strategy
- scene and composition boundary
- text / label / logo policy
- acceptance criteria and known risks
- no-execution handoff fields
- legacy policy for routes without dedicated brief artifacts

## Risk Coverage

```yaml
risk_coverage:
  product_identity_drift: covered
  structure_lock_missing: covered
  material_constraints_missing: covered
  color_or_finish_strategy_missing: covered
  scene_boundary_missing: covered
  label_fake_text_logo_boundary_missing: covered
  A5_authorization_confusion: covered_by_no_execution_handoff
  memory_suitability_auto_inference: covered_by_no_memory_write_boundary
  runs_output_accidental_commit: covered_by_no_output_boundary
  legacy_ceramic_mug_missing_brief: documented_as_legacy_gap
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
  brief_behavior_changed: false
  prompt_package_behavior_changed: false
  machine_validator_implemented: false
```

## Recommended Next

```yaml
recommended_next:
  phase: v11_007_product_brief_schema_static_review_gate
  auto_execution_allowed: true
  purpose: 静态审查 product brief canonical schema 是否覆盖 v11.003 inventory 风险；仍不接 provider、不生成图、不写 memory。
```

## Closeout Template

```yaml
closeout:
  phase: v11_006_product_brief_schema_draft_gate
  commit_message: "docs: draft product brief canonical schema"
  branch: master
  source_commit: 28852990878776dcc32b0febcab84a5328165c60
  push: not_performed
  git_status: clean
  final_state:
    next_phase_started: false
```
