# v7.226 Image Workflow Product Return Gate

## Executive Verdict

```yaml
phase: v7.226_image_workflow_product_return_gate
mode: A4_product_planning
source_commit: cbe3fc6
overall_status: pass
governance_polishing_stopped: true
product_mainline_returned: true
recommended_unique_route: prompt_package_builder
recommended_next_phase: v7.227_prompt_package_builder_taskbook_gate
```

This gate returns Agent Image Lab from governance hardening to the image
workflow product line. It does not authorize A5, runtime execution, provider
contact, plugin calls, image generation, DailyNote write, VCP memory write,
real manifest read, CDP, bridge, MCP, tag, release, or deploy.

## Repository State

```yaml
branch: master
source_head: cbe3fc6
origin_master_at_start: cbe3fc6
ahead_behind_at_start: "0/0"
worktree_start_clean: true
latest_closed_track: v7.225_balanced_codex_exec_worker_verifier_contract_patch
current_operating_model: Single-Window 4-Agent Compact Autopilot
```

## Product Chain

The image workflow product chain is:

```text
product brief
→ prompt package
→ generation authorization
→ human visual review
→ asset status
→ memory suitability decision
→ delivery / review surface
```

The next valuable task should strengthen one product segment without crossing
into A5, runtime, provider contact, plugin call, image generation, or memory
write.

## Candidate Route Review

| Route | Product Value | Risk | Needs A5 | Needs Runtime | Decision |
|---|---|---|---:|---:|---|
| Prompt Package Builder | High. It turns product briefs into reusable prompt packages with positive prompt, negative constraints, shot spec, style lock, and acceptance criteria. It directly addresses prior prompt failure modes before any real generation. | Low. Can be specified as docs/templates only. | No | No | Recommended |
| Human Review Surface | High, but much of the review status, scorecard, human override, and asset state language already exists. Additional work should wait until prompt packages feed it clearer cases. | Low to medium. Risk of repeating existing Review Console work. | No | No | Defer |
| Image Workflow Runbook | Medium-high. Useful as SOP, but broad; without a stronger prompt package contract it can become another governance document. | Low. Docs-only, but high redundancy risk. | No | No | Defer |
| Review Console Product Spec | Medium. Existing static mockup/spec reached quality stop; another spec pass risks polish without product movement. | Medium. Easy to drift toward renderer/preload/IPC/runtime. | No | No | Defer |

## Unique Recommendation

```yaml
recommended_unique_route: prompt_package_builder
reason: >
  Prompt Package Builder is the highest-leverage A4 product-mainline task
  because it improves the first controllable product artifact before generation.
  It can reduce prompt handoff failures, define acceptance criteria before
  provider contact, and feed both future authorization and human review without
  executing image generation.
```

The recommended next phase should not build a UI, call a provider, generate an
image, or write memory. It should define the reusable taskbook/schema for a
product-image prompt package.

## Recommended Next Phase

```yaml
phase: v7.227_prompt_package_builder_taskbook_gate
type: A4_docs_only_product_taskbook
purpose: >
  Define the Prompt Package Builder taskbook for product image workflows:
  input product brief fields, positive prompt sections, negative constraints,
  shot spec, style lock, acceptance criteria, review handoff, and authorization
  handoff.
auto_execution_allowed: true
```

### Exact Allowed Files For v7.227

```yaml
allowed_files:
  - docs/v7_227_prompt_package_builder_taskbook_gate.md
  - prompt_templates/product_image_prompt_package_builder_taskbook.md
  - .agent_board/HANDOFF.md
  - .agent_board/RUN_STATE.md
  - .agent_board/TASK_QUEUE.md
  - .agent_board/CHECKPOINT.md
  - .agent_board/VALIDATION_LOG.md
```

The next phase may update README, roadmap, or PROJECT_MASTER_PLAN only if the
task result changes current status or recommended_next. It must not use
`git add .`.

## Hard Stops

```yaml
hard_stops:
  A5_execution: blocked
  provider_contact: blocked
  plugin_call: blocked
  image_generation: blocked
  memory_write: blocked
  DailyNote_write: blocked
  runtime_execution: blocked
  VCPChat_runtime: blocked
  VCPToolBox_runtime: blocked
  real_manifest_read: blocked
  CDP_access: blocked
  bridge_methods: blocked
  MCP_calls: blocked
  production_candidate_002: blocked
  batch_005: blocked
  dependency_change: blocked
  env_or_secret_touch: blocked
  tag_release_deploy: blocked
```

## Pass Conditions

```yaml
pass_conditions:
  - four_candidate_routes_reviewed
  - unique_route_selected
  - next_phase_named
  - next_phase_exact_allowed_files_defined
  - no_A5_runtime_provider_plugin_image_memory_actions
  - status_surfaces_updated
  - git_diff_check_passed
```

## Closeout Template

```yaml
closeout:
  phase: v7.226_image_workflow_product_return_gate
  product_mainline:
    governance_polishing_stopped: true
    candidate_routes_reviewed:
      - prompt_package_builder
      - human_review_surface
      - image_workflow_runbook
      - review_console_product_spec
    recommended_unique_route: prompt_package_builder
  recommended_next:
    phase: v7.227_prompt_package_builder_taskbook_gate
    type: A4_docs_only_product_taskbook
    auto_execution_allowed: true
```
