# v11.007 Product Brief Schema Static Review Gate

```yaml
gate_template:
  phase: v11_007_product_brief_schema_static_review_gate
  base_contract: AGENTS.md
  mode: A4.8
  intent: review
  risk_level: R1
  allowed_files:
    - docs/v11_007_product_brief_schema_static_review_gate.md
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
    - statically review product brief canonical schema
    - record coverage and gaps
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
    message: docs: review product brief canonical schema
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

V11.007 statically reviews [product_brief_canonical_schema.md](product_brief_canonical_schema.md) against the v11.003 product brief inventory findings. It does not edit existing briefs, implement a validator, create an A5 authorization, or change prompt package behavior.

## Static Review Result

```yaml
static_review:
  reviewed_schema: docs/product_brief_canonical_schema.md
  source_inventory: docs/prompt_artifact_schema_inventory.md
  review_record: docs/v11_007_product_brief_schema_static_review_gate.md
  result: pass_for_schema_static_review
  brief_identity_fields_covered: true
  product_identity_lock_covered: true
  structure_lock_covered: true
  material_texture_constraints_covered: true
  color_or_finish_strategy_covered: true
  scene_composition_boundary_covered: true
  label_fake_text_logo_boundary_covered: true
  acceptance_criteria_and_known_risks_covered: true
  no_execution_handoff_covered: true
  legacy_ceramic_mug_missing_brief_documented: true
  A5_authorization_not_created_by_brief: true
  memory_suitability_not_inferred: true
  runs_output_commit_boundary_covered: true
  post_push_status_wording_guard_referenced: true
```

## Review Checklist

| check | result | evidence |
|---|---|---|
| Brief identity and lineage are required | pass | `brief_id`, `brief_status`, `source_phase`, and `source_route` are required. |
| `brief_status` does not imply execution readiness | pass | Allowed values describe documentation maturity only. |
| Product identity drift is addressed | pass | `product` and `identity_lock` require product type, category terms, and `must_not_be`. |
| Structure lock is addressed before prompt drafting | pass | `structure_lock` requires locked structure, required parts, forbidden drift, and silhouette rules. |
| Material and texture constraints are addressed | pass | `material_texture` requires primary materials, texture, finish, and forbidden material drift. |
| Color or finish strategy is explicit | pass | `color_or_finish_strategy` separates collection, finish system, and neutral finish cases. |
| Scene and composition boundary is explicit | pass | `scene_composition_boundary` requires shot type, product dominance, background role, people, hands, and props boundaries. |
| Label, fake text, and logo policy is explicit | pass | `text_label_logo_policy` requires readable logo/text, fake text, watermark, and label/blank zone policy fields. |
| Acceptance criteria and known risks are carried forward | pass | Schema requires reviewer-facing `acceptance_criteria` and prompt-facing `known_risks`. |
| Brief cannot authorize A5 execution | pass | Handoff keeps provider contact, image generation, memory write, accepted_samples write, and runs output creation false. |
| Legacy ceramic mug missing brief is handled conservatively | pass | Legacy policy says do not fabricate a backfilled brief without an explicit future phase. |
| Machine validation strategy exists | pass_with_gap | Static checks are drafted, but no validator implementation is created in this gate. |

## Remaining Gaps

```yaml
remaining_gaps:
  machine_validator_implemented: false
  actual_product_briefs_migrated: false
  static_review_schema_drafted: false
  A5_authorization_schema_drafted: false
  human_review_schema_drafted: false
  evidence_package_schema_drafted: false
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
  phase: v11_008_static_review_schema_draft_gate
  auto_execution_allowed: true
  purpose: 基于 v11.003 inventory 起草 static review canonical schema；仍不接 provider、不生成图、不写 memory。
```

## Closeout Template

```yaml
closeout:
  phase: v11_007_product_brief_schema_static_review_gate
  commit_message: "docs: review product brief canonical schema"
  branch: master
  source_commit: 55f46669f425714912eb695f0b454de390bda8dd
  push: not_performed
  git_status: clean
  final_state:
    next_phase_started: false
```
