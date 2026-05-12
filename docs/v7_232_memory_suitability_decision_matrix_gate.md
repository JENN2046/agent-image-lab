# v7.232 Memory Suitability Decision Matrix Gate

## Executive Verdict

```yaml
phase: v7.232_memory_suitability_decision_matrix_gate
base_contract: AGENTS.md
mode: A4_docs_only_memory_suitability_planning
source_commit: 476bb01b745f56c42f5f78fc51f25b3ed17d7ccb
source_phase: v7.231_review_console_asset_status_taxonomy_gate
overall_status: pass
product_artifact:
  memory_suitability_decision_matrix_created: true
  memory_write_authorization_created: false
  DailyNote_write_created: false
safety:
  A5_execution: false
  provider_contact: false
  plugin_call: false
  image_generation: false
  memory_write: false
  runtime_execution: false
recommended_next: v7.233_delivery_review_surface_package_gate
```

## Purpose

This gate defines how a future reviewed asset can become a memory suitability candidate.

It does not write memory.
It does not write DailyNote.
It does not create a memory authorization package.
It does not read real VCP memory, VCPChat, VCPToolBox, or manifests.

## Phase Difference Patch

```yaml
phase_delta:
  creates:
    - docs/memory_suitability_decision_matrix.md
    - docs/v7_232_memory_suitability_decision_matrix_gate.md
  updates_status_surfaces:
    - README.md
    - docs/00_project_roadmap.md
    - PROJECT_MASTER_PLAN.md
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
    - .agent_board/CHECKPOINT.md
    - .agent_board/VALIDATION_LOG.md
  does_not_create:
    - DailyNote_payload
    - VCP_memory_record
    - memory_write_request
    - runtime_entrypoint
    - provider_payload
    - plugin_request
```

## Suitability Inputs

```yaml
memory_suitability_inputs:
  asset_status_ref: required
  prompt_package_ref: required
  human_review_status: required
  human_score: required
  rejection_reasons: optional
  revision_request: optional
  acceptance_notes: optional
  source_authorization_ref: required_later
```

Inputs are reviewed records only. Raw prompts, raw payloads, private paths, endpoints, secrets, and raw provider responses must not enter memory suitability records.

## Decision Taxonomy

```yaml
memory_suitability_status:
  not_reviewable:
    meaning: "Asset status is too early for memory consideration"
    memory_write_allowed: false
  do_not_write:
    meaning: "No durable learning value or unsafe to remember"
    memory_write_allowed: false
  draft_failure_lesson:
    meaning: "Rejected asset may teach a reusable failure pattern"
    memory_write_allowed: false
  draft_success_case:
    meaning: "Accepted asset may teach a reusable success pattern"
    memory_write_allowed: false
  needs_human_memory_review:
    meaning: "A human should decide whether a memory authorization is worthwhile"
    memory_write_allowed: false
  eligible_for_future_memory_authorization:
    meaning: "Candidate may be used to draft a separate memory write authorization"
    memory_write_allowed: false
```

Every status remains non-writing in this gate.

## Decision Matrix

```yaml
decision_matrix:
  not_created:
    default_memory_suitability: not_reviewable
    reason: "No asset exists"
  generated_pending_review:
    default_memory_suitability: not_reviewable
    reason: "Human visual decision is missing"
  needs_revision:
    default_memory_suitability: do_not_write
    optional_next: draft_failure_lesson
    condition: "Only if revision reason captures a reusable prompt failure"
  rejected:
    default_memory_suitability: draft_failure_lesson
    condition: "Rejection reason is specific, non-sensitive, and reusable"
  accepted_candidate:
    default_memory_suitability: needs_human_memory_review
    condition: "Candidate is promising but not final"
  accepted_final:
    default_memory_suitability: draft_success_case
    condition: "Acceptance notes identify reusable prompt/style learning"
  archived_reference_only:
    default_memory_suitability: needs_human_memory_review
    condition: "Reference has reusable learning value"
  superseded:
    default_memory_suitability: do_not_write
    optional_next: draft_failure_lesson
    condition: "Supersession reason captures reusable lesson"
```

## Memory Candidate Record

```yaml
memory_candidate_record:
  candidate_id: "MEMCAND-{YYYYMMDD}-{NNN}"
  candidate_status: draft
  asset_status_ref: string
  prompt_package_ref: string
  lesson_type: success_case | failure_lesson | style_preference | constraint_update | do_not_write
  sanitized_summary: string
  reusable_learning: string
  sensitive_content_present: false
  raw_prompt_included: false
  raw_payload_included: false
  raw_endpoint_included: false
  private_path_included: false
  DailyNote_write_allowed_now: false
  VCP_memory_write_allowed_now: false
```

## Sensitive Content Filters

```yaml
sensitive_content_filters:
  must_exclude:
    - secrets
    - tokens
    - env_values
    - private_paths
    - raw_chat_history
    - raw_provider_payload
    - raw_provider_response
    - raw_endpoint
    - customer_private_data
    - unreviewed_image_assets
  must_sanitize:
    - product_identifiers_when_private
    - reviewer_names_when_not_needed
    - local_file_references
    - source_authorization_details
```

## Future Authorization Boundary

```yaml
future_memory_authorization_boundary:
  required_for_write: true
  this_gate_creates_authorization: false
  this_gate_allows_DailyNote_write: false
  this_gate_allows_VCP_memory_write: false
  future_authorization_must_name:
    - memory_candidate_id
    - asset_status_ref
    - allowed_memory_destination
    - reviewer
    - exact_write_scope
    - rollback_or_correction_path
```

## Explicit Non-Authorization

```yaml
not_authorized_by_v7_232:
  A5_execution: false
  provider_contact: false
  plugin_call: false
  image_generation: false
  runtime_execution: false
  output_save: false
  DailyNote_write: false
  VCP_memory_write: false
  memory_authorization_activation: false
  VCPChat_runtime: false
  VCPToolBox_runtime: false
  real_manifest_read: false
  CDP_access: false
  bridge_methods: false
  MCP_calls: false
  production_candidate_002: false
  batch_005: false
  tag_release_deploy: false
  dependency_change: false
```

## Recommended Next Phase

```yaml
recommended_next:
  phase: v7.233_delivery_review_surface_package_gate
  type: A4_docs_only_delivery_surface_planning
  purpose: >
    Define the delivery and review-surface package that summarizes prompt,
    authorization, asset status, and memory suitability records without runtime
    execution or asset generation.
  auto_execution_allowed: false
```

## Closeout Template

```yaml
closeout:
  phase: v7.232_memory_suitability_decision_matrix_gate
  source_commit: 476bb01b745f56c42f5f78fc51f25b3ed17d7ccb
  commit_hash: null
  commit_message: "docs: add memory suitability decision matrix"
  branch: master
  changed_files: 0
  push: not_performed
  product_artifact:
    memory_suitability_decision_matrix_created: true
    memory_write_authorization_created: false
    DailyNote_write_created: false
  validation:
    git_diff_check: pass
    exact_diff_reviewed: true
    agent_board_state_validator: pass
  safety:
    A5_execution: false
    provider_contact: false
    plugin_call: false
    image_generation: false
    memory_write: false
    runtime_execution: false
  final_state:
    next_phase_started: false
```
