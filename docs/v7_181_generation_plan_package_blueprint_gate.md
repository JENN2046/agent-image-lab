# v7.181 Generation Plan Package Blueprint Gate

## Executive Verdict

```yaml
executive_verdict:
  overall_status: pass
  product_workflow_blueprint: completed
  prompt_package_registry_blueprint: completed
  review_console_surface_blueprint: completed
  generation_plan_package_blueprint: completed
  image_generation_allowed_now: false
  plugin_call_allowed_now: false
  provider_contact_allowed_now: false
  production_candidate_002_allowed_now: false
  memory_write_path_allowed_now: false
  runtime_execution_allowed_now: false
  recommended_next_phase: v7.182_generation_authorization_package_blueprint_gate
```

This blueprint defines the generation plan package schema, status taxonomy, A5 authorization relationship, preflight checklist, generation limits, output directory policy, redaction rules, and closeout linkage. It documents what must be in place before any generation can be authorized — without authorizing any generation itself.

---

## Current State

```yaml
current_state:
  product_planning_completed:
    v7_178_image_workflow_blueprint: completed
    v7_179_prompt_package_registry_blueprint: completed
    v7_180_review_console_surface_blueprint: completed

  still_forbidden:
    image_generation_allowed_now: false
    production_candidate_002_allowed_now: false
    memory_write_path_allowed_now: false
    runtime_execution_allowed_now: false
    plugin_calls_allowed_now: false

  source_commit: cd86a75
  source_commit_message: "docs: add v7.180 review console surface blueprint"
```

---

## Generation Plan Purpose

A generation plan is the **execution contract** between planning and generation. It captures all parameters needed for a controlled generation run, bridges the prompt package to the actual generation call, and defines the safety boundaries that the generation must operate within.

The plan does not authorize generation — it specifies **what** generation would look like if authorized. Actual generation requires a separate A5 authorization that explicitly references and matches the plan's scope.

---

## Generation Plan ID Policy

```yaml
generation_plan_id_policy:
  format: "GP-{YYYYMMDD}-{sequential_number}"
  example: "GP-20260512-001"
  uniqueness: "Globally unique across all generation plans"
  assignment: "Assigned at creation (draft status)"
  immutability: "ID never changes; version tracks revisions"
  reference: "Used in A5 authorization, review console, and closeout"
```

---

## Generation Plan Schema

```yaml
generation_plan_schema:
  required:
    - generation_plan_id
    - workflow_run_id
    - prompt_package_ref
    - prompt_package_version
    - target_model_or_plugin
    - output_count
    - max_generation_calls
    - output_constraints
    - review_console_ref
    - success_criteria
    - failure_policy
    - retry_policy
    - authorization_status
    - A5_authorization_ref
    - status
    - version

  optional:
    - seed_strategy
    - model_parameters
    - provider_constraints
    - output_directory_ref
    - expected_runtime_environment
    - fallback_model_or_plugin
    - reviewer_notes
    - risk_notes
```

---

## Required Fields

```yaml
required_fields:
  generation_plan_id:
    type: string
    format: "GP-{YYYYMMDD}-{N}"
    description: "Unique generation plan identifier"

  workflow_run_id:
    type: string
    description: "Link to the originating workflow run"

  prompt_package_ref:
    type: string
    description: "Link to the prompt package used"

  prompt_package_version:
    type: string
    format: "v{N}"
    description: "Specific version of the prompt package"

  target_model_or_plugin:
    type: string
    description: "Model or plugin to use for generation"

  output_count:
    type: integer
    description: "Number of output assets expected"

  max_generation_calls:
    type: integer
    description: "Maximum number of generation API calls allowed"

  output_constraints:
    type: object
    description: "Format, resolution, aspect ratio, color space constraints"

  review_console_ref:
    type: string
    description: "Link to the review console session"

  success_criteria:
    type: object
    description: "Definition of acceptable output quality"

  failure_policy:
    type: object
    description: "What to do on generation failure"

  retry_policy:
    type: object
    description: "Retry conditions, limits, and escalation"

  authorization_status:
    type: string
    enum: [not_requested, requested, authorized, denied, expired]
    description: "Current A5 authorization status"

  A5_authorization_ref:
    type: string | null
    description: "Link to A5 authorization record (null if not authorized)"

  status:
    type: string
    enum: [draft, review_ready, approved_for_authorization_request, A5_authorization_required, A5_authorized, execution_ready, executed, failed, retired]
    description: "Current lifecycle status"

  version:
    type: string
    format: "v{N}"
    description: "Version identifier for plan revisions"
```

---

## Optional Fields

```yaml
optional_fields:
  seed_strategy:
    type: string
    description: "Seed selection, variation control, or randomization approach"

  model_parameters:
    type: object
    description: "Model-specific parameters (temperature, steps, guidance, etc.)"

  provider_constraints:
    type: object
    description: "Provider-specific constraints (rate limits, region, etc.)"

  output_directory_ref:
    type: string
    description: "Target output directory for generated assets"

  expected_runtime_environment:
    type: string
    description: "Expected runtime context (VCPToolBox, local, etc.)"

  fallback_model_or_plugin:
    type: string
    description: "Fallback target if primary model/plugin is unavailable"

  reviewer_notes:
    type: string
    description: "Notes from the plan reviewer"

  risk_notes:
    type: string
    description: "Risk assessment notes for the generation"
```

---

## Relation To Prompt Package

```yaml
relation_to_prompt_package:
  one_generation_plan_one_prompt_package: true
  prompt_package_must_be_approved_before_generation_plan: true
  prompt_package_version_is_fixed_in_generation_plan: true
  generation_plan_must_reference_exact_prompt_package_version: true
  prompt_package_update_requires_generation_plan_revision: true
  relation:
    - "generation_plan.prompt_package_ref = prompt_package.prompt_package_id"
    - "generation_plan.prompt_package_version = prompt_package.version"
    - "generation_plan.output_constraints compatible with prompt_package.output_constraints"
    - "generation_plan.success_criteria derived from prompt_package.review_criteria"
    - "generation_plan.retry_policy compatible with prompt_package.retry_policy"
```

---

## Relation To Review Console

```yaml
relation_to_review_console:
  generation_plan_review_console_pair: true
  review_console_must_be_ready_before_generation_authorization: true
  generation_plan_defines_review_scope: true
  relation:
    - "generation_plan.review_console_ref = review_session.review_session_id"
    - "review_session.asset_refs populated after generation execution"
    - "review_session.review_criteria derived from generation_plan.success_criteria"
    - "generation conclusions feed back to generation_plan for retry decisions"
```

---

## Generation Plan Status Taxonomy

```yaml
generation_plan_status_taxonomy:
  - draft:
      description: "Plan is being created; not ready for review"
      allows_generation: false
      allows_authorization_request: false

  - review_ready:
      description: "Plan is complete and ready for human review"
      allows_generation: false
      allows_authorization_request: false

  - approved_for_authorization_request:
      description: "Plan approved; ready to prepare A5 authorization request"
      allows_generation: false
      allows_authorization_request: true
      note: "approved_for_authorization_request does NOT authorize generation"

  - A5_authorization_required:
      description: "Plan exists and is ready; explicit A5 authorization needed"
      allows_generation: false
      allows_authorization_request: false
      note: "A5_authorization_required is NOT A5_authorized"

  - A5_authorized:
      description: "A5 authorization granted for this plan"
      allows_generation: false
      allows_authorization_request: false
      note: "A5_authorized means authorization exists; execution_ready follows"

  - execution_ready:
      description: "Preflight passed; plan is ready to execute"
      allows_generation: true
      allows_authorization_request: false
      note: "execution_ready does not execute by itself — requires explicit trigger"

  - executed:
      description: "Generation has been executed"
      allows_generation: false
      allows_authorization_request: false

  - failed:
      description: "Generation failed and will not be retried"
      allows_generation: false
      allows_authorization_request: false

  - retired:
      description: "Plan retired from active use; kept for reference"
      allows_generation: false
      allows_authorization_request: false

  status_rules:
    approved_for_authorization_request_does_not_authorize_generation: true
    A5_authorization_required_is_not_A5_authorized: true
    A5_authorized_requires_matching_scope: true
    execution_ready_does_not_execute_by_itself: true
    executed_requires_prior_A5_authorization: true
```

---

## A5 Authorization Package Relation

```yaml
A5_authorization_relation:
  generation_plan_can_request_authorization: true
  generation_plan_cannot_self_authorize: true
  generation_plan_authorization_is_one_to_one: true
  authorization_dependent_on_plan_validity: true

  authorization_must_match:
    - field: generation_plan_id
      reason: "Authorization is tied to a specific plan"
    - field: prompt_package_ref
      reason: "Scope must reference the same prompt package"
    - field: max_generation_calls
      reason: "Authorization must cap the number of calls"
    - field: target_model_or_plugin
      reason: "Authorization is model/plugin specific"
    - field: output_constraints
      reason: "Output must match authorized constraints"
    - field: output_directory_ref
      reason: "Output location must be authorized"
    - field: review_expectations
      reason: "Review expectations must be authorized"

  authorization_must_explicitly_state:
    - allowed_call_count: "Maximum number of generation calls permitted"
    - retry_limit: "Maximum retries permitted"
    - whether_output_may_be_saved: "Yes or no"
    - whether_provider_contact_is_allowed: "Yes or no"
    - whether_plugin_call_is_allowed: "Yes or no"
    - whether_memory_write_is_forbidden: "Must default to forbidden"
```

---

## Preflight Checklist

```yaml
preflight_checklist:
  purpose: >
    Executed immediately before generation to verify all conditions are met.
    All items must pass before generation can proceed.

  items:
    - repo_clean:
        description: "Git working tree is clean"
        severity: block

    - generation_plan_status_valid:
        description: "Status is execution_ready"
        severity: block

    - prompt_package_status_valid:
        description: "Referenced prompt package has valid status"
        severity: block

    - A5_authorization_present:
        description: "A5 authorization record exists and is not expired"
        severity: block

    - A5_authorization_scope_matches_plan:
        description: "Authorization fields match generation_plan fields"
        severity: block

    - output_directory_policy_confirmed:
        description: "Output directory is gitignored or runtime-scoped"
        severity: block

    - max_generation_calls_confirmed:
        description: "Generation call count will not exceed max"
        severity: block

    - retry_limit_confirmed:
        description: "Retry count is explicit and bounded"
        severity: block

    - forbidden_elements_confirmed:
        description: "forbidden_elements from prompt package are confirmed"
        severity: block

    - review_console_ready:
        description: "Review console session is ready to receive assets"
        severity: block

    - memory_write_forbidden_by_default:
        description: "Memory write is explicitly not authorized"
        severity: block

    - raw_payload_recording_forbidden:
        description: "Raw payload recording is disabled"
        severity: block

    - secrets_and_paths_redaction_confirmed:
        description: "Secrets and private paths redaction is confirmed"
        severity: block
```

---

## Generation Limits

```yaml
generation_limits:
  default_generation_calls_allowed_without_A5: 0
  max_generation_calls_must_be_explicit: true
  retry_count_must_be_explicit: true
  no_batch_generation_by_default: true
  no_auto_retry_after_failure: true
  no_hidden_second_call: true
  scope:
    - "Generation is limited to the target_model_or_plugin specified in the plan"
    - "Generation is limited to the output_count specified"
    - "Generation is limited to the max_generation_calls specified"
    - "Retry counts count against max_generation_calls"
    - "Any deviation requires plan revision and re-authorization"
```

---

## Retry And Failure Policy

```yaml
retry_and_failure_policy:
  retry_trigger:
    - "Generation API call failed (network, provider, timeout)"
    - "Output does not meet success_criteria (detected programmatically)"
    - "Human reviewer rejects output with correctable reason"

  retry_limits:
    - "Retry count is bounded by generation_plan.retry_policy"
    - "Total calls (initial + retries) must not exceed max_generation_calls"
    - "Retry without A5 re-authorization requires retry_policy to permit it"

  failure_escalation:
    - "If retry count exceeded → plan status = failed"
    - "If failure is provider-side → consider fallback_model_or_plugin if defined"
    - "If failure is security-related → stop immediately, no fallback"
    - "If failure is persistent → require plan revision and new authorization"

  no_auto_retry:
    - "No automatic retry without explicit check"
    - "No silent retry across authorization boundaries"
    - "No retry that would exceed max_generation_calls"
```

---

## Output Directory Policy

```yaml
output_directory_policy:
  output_directory_must_be_explicit: true
  output_directory_must_be_gitignored_or_runtime_scoped: true
  no_private_path_in_closeout: true
  no_raw_file_path_in_public_summary: true
  asset_ref_should_be_sanitized: true

  rules:
    - "Output directory is defined in generation_plan.output_directory_ref"
    - "Output directory must be under a designated, gitignored path"
    - "No output is written outside the designated directory"
    - "Asset references in closeout use sanitized paths, not absolute paths"
    - "Private paths, home directories, and temp paths are forbidden as output targets"
```

---

## Redaction And Summary Policy

```yaml
redaction_summary_policy:
  raw_prompt_recording: false
  raw_payload_recording: false
  raw_endpoint_recording: false
  raw_response_recording: false
  private_path_recording: false

  allowed_summary:
    - prompt_package_id:
        description: "Identifier of the prompt package used"
    - generation_plan_id:
        description: "Identifier of the generation plan"
    - sanitized_model_ref:
        description: "Model/plugin reference with identifying details removed"
    - output_count:
        description: "Number of output assets generated"
    - asset_status:
        description: "Asset status from the review console"
    - review_decision:
        description: "Human review decision (accepted/needs_human_review/rejected)"
    - local_scope_result:
        description: "Overall result of the workflow run"

  rules:
    - "No raw prompt text in closeout summary"
    - "No raw model response in closeout summary"
    - "No API endpoint paths in closeout summary"
    - "No absolute file paths in closeout summary"
    - "No secrets, tokens, or credentials in closeout summary"
    - "Redaction is applied before any summary is generated"
```

---

## Closeout Package Link

```yaml
closeout_package_link:
  relationship:
    - "generation_plan is a core input to the closeout package"
    - "closeout references generation_plan_id and prompt_package_ref"
    - "closeout records the actual output_count vs planned output_count"
    - "closeout records the retry_count vs max_generation_calls"
    - "closeout records the final authorization_status"

  closeout_contributes:
    - generation_plan_id
    - workflow_run_id
    - prompt_package_ref
    - target_model_or_plugin (sanitized)
    - actual_output_count
    - retry_count
    - final_status
    - authorization_ref
    - review_decision_summary
```

---

## Authorization Matrix

```yaml
authorization_matrix:
  generation_plan_blueprint:
    description: "Documentation-level blueprint for generation plans"
    allowed_under_A4: true
    requires_explicit_authorization: false

  generation_plan_draft:
    description: "Drafting a generation plan"
    allowed_under_A4: true
    requires_explicit_authorization: false

  A5_authorization_request_draft:
    description: "Drafting an A5 authorization request"
    allowed_under_A4: true
    requires_explicit_authorization: false

  actual_generation:
    description: "Executing image generation via plugin or model"
    requires_independent_A5: true
    requires_explicit_authorization: true

  plugin_call:
    description: "Calling a plugin for generation"
    requires_independent_A5: true
    requires_explicit_authorization: true

  provider_contact:
    description: "Contacting an external provider for generation"
    requires_independent_A5: true
    requires_explicit_authorization: true

  memory_write:
    description: "Writing to VCP memory"
    requires_independent_memory_write_authorization: true
    requires_separate_memory_suitability_review: true
```

---

## Explicit Non-Authorization Statement

```yaml
not_authorized_by_v7_181:
  image_generation: false
  plugin_call: false
  provider_contact: false
  production_candidate_002_execution: false
  memory_write_path_execution: false
  VCPToolBox_runtime: false
  VCPChat_runtime: false
  CDP_access: false
  bridge_methods: false
  MCP_calls: false
  DailyNote_write: false
  VCP_memory_write: false
  push_tag_release: false
```

v7.181 is a **docs-only generation plan package blueprint gate**. It defines the schema, status model, authorization relationship, preflight checks, and safety policies for generation plans — but does not authorize any generation, plugin call, provider contact, or runtime execution.

---

## Recommended Next Phase

```yaml
recommended_next_if_pass:
  phase: v7.182_generation_authorization_package_blueprint_gate
  purpose: >
    Define the A5 generation authorization package schema, including
    authorization request format, scope matching, approval workflow,
    expiry policy, and revocation rules. Continue docs-only planning.

alternative_next:
  phase: v7.182_static_review_console_mockup_planning_gate
  purpose: >
    Plan a static HTML/JS mockup of the review console.
    No VCPChat, no CDP, no bridge, no runtime.
```

---

## Closeout Template

```yaml
closeout:
  phase: v7.181_generation_plan_package_blueprint_gate
  commit_hash: "<set_by_commit>"
  commit_message: "docs: add v7.181 generation plan package blueprint"
  branch: master
  git_status: clean
  changed_files: 1
  local_scope_result: passed
  push: not_performed

  generation_plan:
    generation_plan_package_blueprint_completed: true
    generation_plan_schema_defined: true
    status_taxonomy_defined: true
    A5_authorization_relation_defined: true
    preflight_checklist_defined: true
    generation_limits_defined: true
    output_directory_policy_defined: true
    redaction_summary_policy_defined: true
    authorization_matrix_defined: true

  authorization:
    image_generation_allowed_now: false
    plugin_call_allowed_now: false
    provider_contact_allowed_now: false
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
    provider_contacted: false
    daily_note_written: false
    vcp_memory_written: false
    image_generated: false
    dependency_added: false
    package_json_modified: false
    ci_or_hook_created: false

  known_untracked_file_touched: false
  recommended_next: v7.182_generation_authorization_package_blueprint_gate

  remote_sync_verification:
    push_performed: false
    remote_head_checked: false
    pending_push: true

  final_state:
    commit_completed: true
    push_completed: false
    next_phase_started: false
```
