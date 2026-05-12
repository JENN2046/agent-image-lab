# Product Image Workflow Runbook

Status: A4 docs-only operator runbook.

This runbook explains how to operate the current Agent Image Lab product image workflow without entering A5 or runtime execution. It does not generate images, contact providers, call plugins, write DailyNote, or write VCP memory.

## Operating Principle

```text
Build the package.
Review the package.
Prepare authorization inputs.
Stop before generation.
After a separate future A5 run, review assets.
Prepare memory suitability.
Deliver the review package.
```

## Workflow Steps

### 1. Product Brief Intake

Input:

```yaml
product_brief:
  product_goal: "<placeholder>"
  intended_use: "<placeholder>"
  product_identity: "<placeholder>"
  known_constraints: []
```

Output:

```yaml
structured_brief_ready: true
```

Stop if the brief requires secrets, private paths, real customer data, or immediate generation.

### 2. Prompt Package Build

Use:

```text
docs/v7_227_prompt_package_builder_taskbook_gate.md
prompt_templates/product_image_prompt_package_instance_template.md
```

Output:

```yaml
prompt_package_instance:
  status: draft
  positive_prompt_draft: "<review text only>"
  negative_constraints: []
  acceptance_criteria: []
```

### 3. Human Prompt-Package Review

Use:

```text
prompt_templates/product_image_prompt_package_human_review_checklist.md
```

Allowed outcomes:

```yaml
review_status:
  - draft
  - needs_revision
  - review_ready
  - approved_for_A5_authorization
  - rejected
  - superseded
```

Only `approved_for_A5_authorization` may proceed to A5 handoff drafting. It still does not authorize generation.

### 4. A5 Authorization Handoff

Use:

```text
prompt_templates/product_image_prompt_package_a5_authorization_handoff.md
```

Output:

```yaml
future_A5_authorization_draft_inputs:
  prompt_package_ref: "<placeholder>"
  generation_plan_ref: "<required later>"
  allowed_call_count: "<required later>"
  selected_provider_or_plugin: "<required later>"
  active_A5_authorization_created: false
```

Stop here unless a separate active A5 authorization package exists.

### 5. Future A5 Generation

Current status:

```yaml
allowed_now: false
requires_active_A5_authorization: true
```

This runbook does not perform this step.

### 6. Asset Status Review

Use after a future authorized generation only:

```text
docs/review_console_asset_status_taxonomy.md
```

Allowed statuses:

```yaml
asset_status:
  - generated_pending_review
  - needs_revision
  - rejected
  - accepted_candidate
  - accepted_final
  - archived_reference_only
  - superseded
```

### 7. Memory Suitability Decision

Use:

```text
docs/memory_suitability_decision_matrix.md
```

Allowed decisions:

```yaml
memory_suitability:
  - yes
  - no
  - deferred
```

`yes` means future memory authorization candidate only. It does not write memory.

### 8. Delivery / Review Package

Use:

```text
docs/delivery_review_surface_package.md
```

Output:

```yaml
delivery_review_surface_package:
  package_status: draft | review_ready | delivered_for_review | closed | superseded
  prompt_package_ref: "<placeholder>"
  A5_authorization_ref: "<required later>"
  asset_status_records: []
  human_review_records: []
  memory_suitability_records: []
```

## Stop Rules

```yaml
stop_before:
  A5_execution: true
  provider_contact: true
  plugin_call: true
  image_generation: true
  runtime_execution: true
  output_save: true
  DailyNote_write: true
  VCP_memory_write: true
  real_manifest_read: true
  dependency_change: true
  tag_release_deploy: true
```

## Minimal Operator Closeout

```yaml
operator_closeout:
  brief_intake_completed: false
  prompt_package_created: false
  prompt_package_review_status: draft
  A5_handoff_created: false
  active_A5_authorization_present: false
  generated_assets_present: false
  asset_status_review_completed: false
  memory_suitability_completed: false
  delivery_review_package_created: false
  generation_allowed_now: false
  memory_write_allowed_now: false
```
