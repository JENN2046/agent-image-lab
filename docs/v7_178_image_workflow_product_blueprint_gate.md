# v7.178 Image Workflow Product Blueprint Gate

## Executive Verdict

```yaml
executive_verdict:
  overall_status: pass
  governance_chain_v1: closed
  product_route_planning_reopened: true
  core_workflow_blueprint_defined: true
  image_generation_allowed_now: false
  production_candidate_002_allowed_now: false
  memory_write_path_allowed_now: false
  recommended_next_phase: v7.179_prompt_package_registry_blueprint_gate
```

This blueprint defines the end-to-end product workflow skeleton for Agent Image Lab, from product brief intake through closeout. It explicitly gates generation behind A5 authorization and prohibits automatic memory writes.

---

## Current State

```yaml
current_state:
  validator_governance_chain_v1: closed
  governance_blockers_known: none
  product_route_planning_reopened: true
  generation_execution_allowed_now: false
  production_candidate_002_allowed_now: false
  memory_write_path_allowed_now: false
  runtime_execution_allowed_now: false
  source_commit: bf7902f
  source_commit_message: "docs: add v7.177 product route reopen gate"
```

---

## Product Workflow Purpose

Agent Image Lab's core product workflow transforms a visual product brief into a reviewed, statused asset with explicit authorization gates. The workflow is designed to:

1. Separate **planning** (docs-only, A4) from **execution** (generation, A5-required)
2. Ensure every generated asset passes human review before acceptance
3. Prevent automatic memory writes — memory suitability requires a separate decision
4. Provide clear asset status taxonomy for tracking and audit
5. Produce a standardized closeout package for each workflow run

---

## Core Workflow Phases

```yaml
recommended_workflow_phases:
  1_intake:
    name: Product Brief Intake
    output: product_brief_package
    execution: docs_only
    description: >
      The entry point. Captures the user's visual requirements:
      subject, style, format, constraints, reference material.
      No generation at this stage.

  2_prompt:
    name: Prompt Package Design
    output: prompt_package
    execution: docs_only
    description: >
      Translate the brief into a structured prompt package:
      visual intent, composition, lighting, material, background,
      negative constraints, forbidden elements, model target,
      output constraints, review criteria, retry policy.

  3_generation_plan:
    name: Generation Plan Draft
    output: generation_plan
    execution: docs_only
    description: >
      Define the generation parameters: model, resolution,
      iteration count, success criteria, fallback strategy.
      Still docs-only. No image generation occurs.

  4_authorization:
    name: A5 Generation Authorization Gate
    output: explicit_generation_authorization
    execution: human_authorized_only
    description: >
      The critical safety gate. Generation proceeds only after
      explicit A5 authorization. No implicit approval.
      Authorization must cover scope, model, asset count,
      and review expectations.

  5_generation:
    name: Controlled Generation
    output: generated_asset_candidate
    execution: A5_only
    description: >
      Actual image generation via VCP plugin or external model.
      Only after A5 authorization. All generation metadata
      recorded for audit. No automatic acceptance.

  6_human_review:
    name: Human Visual Review
    output: asset_review_decision
    execution: human_review_required
    description: >
      Human reviews the generated asset against review criteria
      defined in the prompt package. Decision: accepted,
      needs_human_review, or rejected.

  7_closeout:
    name: Asset Closeout
    output: closeout_package
    execution: docs_only
    description: >
      Package the workflow run: brief, prompt package,
      generation plan, authorization record, review decision,
      asset status, timestamps, and metadata.

  8_memory_decision:
    name: Memory Suitability Decision
    output: memory_delta_draft_or_no_write_decision
    execution: no_write_by_default
    description: >
      Separate decision gate after closeout. Accepted assets
      do NOT automatically enter memory. A memory suitability
      review must determine whether the asset and its metadata
      qualify for VCP memory storage. No write by default.
```

---

## Required Input Packages

```yaml
required_input_packages:
  product_brief:
    description: "The user's original visual requirements"
    fields:
      - subject
      - visual_goal
      - preferred_style_or_reference
      - output_format
      - constraints_or_boundaries
      - priority_or_deadline

  prompt_package:
    description: "Structured prompt design (see Prompt Package Blueprint below)"

  generation_plan:
    description: "Execution parameters for the generation phase"
    fields:
      - model_or_plugin_target
      - resolution_or_quality
      - iteration_count
      - success_criteria
      - fallback_strategy
      - expected_output_count
```

---

## Prompt Package Blueprint

```yaml
prompt_package_blueprint:
  fields:
    - prompt_id: "Unique identifier for the prompt package"
    - product_subject: "The subject or product being visualized"
    - visual_intent: "Overall visual goal and mood"
    - composition: "Desired framing, angle, layout"
    - lighting: "Lighting direction, intensity, style"
    - material_texture: "Surface qualities, materials"
    - background: "Background setting or environment"
    - negative_constraints: "What to explicitly avoid"
    - forbidden_elements: "Elements that must never appear"
    - model_or_plugin_target: "Target model or plugin identifier"
    - output_constraints: "Format, size, aspect ratio, color space"
    - review_criteria: "Criteria for human review pass/fail"
    - retry_policy: "Conditions and limits for regeneration"
```

---

## Generation Plan Blueprint

```yaml
generation_plan_blueprint:
  fields:
    - generation_id: "Unique identifier"
    - prompt_package_ref: "Link to prompt package"
    - target_model: "Model or plugin to use"
    - parameters:
        - resolution
        - quality_or_style_strength
        - seed_or_variation_control
    - iteration_count: "Number of generation attempts"
    - success_criteria: "Definition of acceptable output"
    - fallback_strategy: "What to do on failure"
    - authorization_ref: "Link to A5 authorization record"
    - expected_output_count: "Number of assets to generate"
```

---

## Human Review Gate

```yaml
human_review_gate:
  review_criteria_source: prompt_package.review_criteria
  participants: human_reviewer
  decision_options:
    - accepted:
        condition: "Asset meets all review criteria"
        next_status: accepted_candidate
        auto_memory_write: false
    - needs_human_review:
        condition: "Asset partially meets criteria; reviewer uncertainty"
        next_status: needs_human_review
        auto_promote: false
    - rejected:
        condition: "Asset fails review criteria"
        next_status: rejected
        retry_allowed: "Per retry_policy in prompt package"
  rules:
    - accepted_candidate_does_not_equal_memory_write
    - needs_human_review_must_not_auto_promote
    - rejected_asset_must_not_write_memory
```

---

## Asset Status Taxonomy

```yaml
asset_status_taxonomy:
  statuses:
    - draft_plan:
        description: "Workflow phase is in planning; no generation attempted"
        allows_generation: false
    - generation_authorized:
        description: "A5 authorization granted; ready for generation"
        allows_generation: true
    - generated_candidate:
        description: "Asset has been generated but not yet reviewed"
        allows_generation: false
        requires_review: true
    - accepted_candidate:
        description: "Asset passed human review"
        allows_generation: false
        auto_memory_write: false
    - needs_human_review:
        description: "Asset requires additional human review"
        allows_generation: false
        auto_promote: false
    - rejected:
        description: "Asset failed review; may be retried per policy"
        allows_generation: false
        must_not_write_memory: true
    - archived_reference:
        description: "Closed workflow run retained for reference"
        allows_generation: false
    - memory_suitable:
        description: "Asset reviewed and approved for VCP memory"
        allows_generation: false
        separate_review_completed: true
    - memory_rejected:
        description: "Asset reviewed but rejected for memory storage"
        allows_generation: false

  status_rules:
    accepted_candidate_does_not_equal_memory_write: true
    memory_suitable_requires_separate_review: true
    rejected_asset_must_not_write_memory: true
    needs_human_review_must_not_auto_promote: true
```

---

## Rejection And Retry Policy

```yaml
rejection_and_retry_policy:
  retry_trigger: "Asset status = rejected AND retry_policy permits retry"
  max_retries: "Defined in prompt_package.retry_policy"
  retry_scope:
    - "Adjust prompt package within defined constraints"
    - "Regenerate with updated parameters"
    - "Escalate to needs_human_review if unclear"
  retry_prohibited:
    - "Retry cannot bypass A5 authorization"
    - "Retry cannot modify forbidden_elements or negative_constraints"
  after_exhaustion:
    - "If all retries exhausted, asset status remains rejected"
    - "Closeout records retry history"
    - "No automatic fallback to generation"
```

---

## Memory Suitability Rule

```yaml
memory_suitability_rule:
  rule: "accepted_candidate does NOT equal memory write"
  intent: "An image that passes human review does not automatically enter VCP memory"
  process:
    - step_1: "Asset reaches accepted_candidate status via human review"
    - step_2: "Separate memory suitability review evaluates the asset"
    - step_3: "Decision: memory_suitable or memory_rejected"
    - step_4: "Only memory_suitable assets may proceed to memory write"
    - step_5: "Memory write itself requires independent authorization"

  constraints:
    - "Memory suitability review is not automatic"
    - "Memory suitability review requires different criteria than visual review"
    - "Rejected assets must never enter memory"
    - "needs_human_review assets cannot be evaluated for memory suitability"
```

---

## Closeout Package Blueprint

```yaml
closeout_package_blueprint:
  fields:
    - workflow_run_id: "Unique run identifier"
    - source_brief_ref: "Link to original product brief"
    - prompt_package_ref: "Link to prompt package used"
    - generation_plan_ref: "Link to generation plan"
    - authorization_ref: "Link to A5 authorization record"
    - generation_log:
        - model_used
        - parameters
        - iterations
        - output_count
    - review_decision: "accepted | needs_human_review | rejected"
    - asset_status: "Final status from taxonomy"
    - memory_decision: "suitable | rejected | not_evaluated"
    - timestamps:
        - intake_timestamp
        - authorization_timestamp
        - generation_timestamp
        - review_timestamp
        - closeout_timestamp
    - changed_files: "List of files produced"
    - local_scope_result: "passed | passed_with_warnings | failed"
```

---

## Authorization Matrix

```yaml
authorization_matrix:
  docs_only_planning:
    description: "Planning and blueprint documentation"
    allowed_under_A4: true
    requires_explicit_authorization: false

  prompt_package_design:
    description: "Designing prompt packages for future generation"
    allowed_under_A4: true
    requires_explicit_authorization: false

  generation_plan_draft:
    description: "Writing generation plans"
    allowed_under_A4: true
    requires_explicit_authorization: false

  actual_generation:
    description: "Executing image generation via plugin or model"
    requires_A5: true
    requires_explicit_authorization: true

  production_candidate_002:
    description: "Entering production_candidate_002 execution"
    requires_independent_A5: true
    requires_new_authorization_package: true

  memory_write:
    description: "Writing to VCP memory"
    requires_independent_memory_write_authorization: true
    requires_separate_memory_suitability_review: true

  push_tag_release:
    description: "Pushing, tagging, or releasing"
    requires_explicit_version_action_authorization: true
```

---

## Explicit Non-Authorization Statement

```yaml
not_authorized_by_v7_178:
  image_generation: false
  production_candidate_002_execution: false
  memory_write_path_execution: false
  VCPToolBox_runtime: false
  VCPChat_runtime: false
  CDP_access: false
  bridge_methods: false
  MCP_calls: false
  plugin_calls: false
  DailyNote_write: false
  VCP_memory_write: false
  push_tag_release: false
```

v7.178 is a **docs-only product blueprint gate**. It defines the workflow skeleton but does not authorize any execution, generation, memory write, or runtime access. Each execution action listed above requires its own independent A5 authorization gate before proceeding.

---

## Recommended Next Phase

```yaml
recommended_next_if_pass:
  phase: v7.179_prompt_package_registry_blueprint_gate
  purpose: >
    Define the prompt_package registry schema, review criteria,
    and reuse policy. Continue docs-only planning.
    No generation, no production, no memory write.

alternative_next:
  phase: v7.179_review_console_surface_blueprint_gate
  purpose: >
    Define human review console wireframes, asset status
    tracking, and acceptance checklist. Alternative path
    if review surface is higher priority than prompt registry.
```

---

## Closeout Template

```yaml
closeout:
  phase: v7.178_image_workflow_product_blueprint_gate
  commit_hash: "<set_by_commit>"
  commit_message: "docs: add v7.178 image workflow blueprint"
  branch: master
  git_status: clean
  changed_files: 1
  local_scope_result: passed
  push: not_performed

  blueprint:
    product_workflow_blueprint_completed: true
    core_workflow_phases_defined: true
    prompt_package_blueprint_defined: true
    generation_plan_blueprint_defined: true
    human_review_gate_defined: true
    asset_status_taxonomy_defined: true
    memory_suitability_rule_defined: true
    authorization_matrix_defined: true

  authorization:
    image_generation_allowed_now: false
    production_candidate_002_allowed_now: false
    memory_write_path_allowed_now: false
    runtime_execution_allowed_now: false

  validation:
    git_diff_check: passed
    validator_executed: false
    script_executed: false
    powershell_executed: false
    node_check_required: false

  safety_boundaries:
    batch_005_opened: false
    production_candidate_002_opened: false
    memory_write_path_opened: false
    cdp_accessed: false
    bridge_methods_called: false
    mcp_called: false
    plugin_called: false
    daily_note_written: false
    vcp_memory_written: false
    image_generated: false
    dependency_added: false
    package_json_modified: false
    ci_or_hook_created: false

  known_untracked_file_touched: false
  recommended_next: v7.179_prompt_package_registry_blueprint_gate

  remote_sync_verification:
    push_performed: false
    remote_head_checked: false
    pending_push: true

  final_state:
    commit_completed: true
    push_completed: false
    next_phase_started: false
```
