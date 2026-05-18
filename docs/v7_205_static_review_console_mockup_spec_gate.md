# v7.205 Static Review Console Mockup Spec Gate

## Executive Verdict

```yaml
executive_verdict:
  overall_status: pass
  phase: v7.205_static_review_console_mockup_spec_gate
  phase_type: A4_docs_only_mainline_reentry_gate
  mainline_reentry_after: v7.203_smart_commander_portable_release_candidate_gate
  smart_commander_training_continues: false
  static_review_console_mockup_spec: completed
  review_console_layer: surface_app_layer
  review_console_owns_core_truth: false
  renderer_code_allowed_now: false
  preload_code_allowed_now: false
  ipc_code_allowed_now: false
  runtime_execution_allowed_now: false
  plugin_call_allowed_now: false
  provider_contact_allowed_now: false
  image_generation_allowed_now: false
  memory_write_allowed_now: false
  recommended_next_phase: v7.206_static_review_console_mockup_file_gate
```

v7.205 returns Agent Image Lab to the product mainline after the Smart Commander
support-model work reached portable release-candidate status in v7.203. This gate
defines the static Review Console mockup specification only. It does not build,
launch, wire, execute, or connect the mockup.

## Current State

```yaml
current_state:
  source_refs:
    - README.md
    - docs/00_project_roadmap.md
    - docs/archive/phases/v7/v7_184_static_review_console_mockup_planning_gate.md
    - docs/archive/phases/v7/v7_185_core_independent_vcp_native_adr_gate.md
    - docs/archive/phases/v7/v7_186_static_review_console_mockup_alignment_gate.md
    - docs/v7_203_smart_commander_portable_release_candidate_gate.md
  smart_commander_status: portable_release_candidate_complete_support_layer
  product_mainline_status: ready_for_static_review_console_mockup_spec
  pending_product_blockers:
    - real_generation_requires_independent_A5
    - provider_side_fingerprint_capture_requires_explicit_A5_activation
    - memory_write_requires_independent_authorization
  docs_only_continuation_allowed: true
```

The Review Console remains a review desk and product surface. It may show package
references, review status, blocked actions, draft decisions, and closeout state,
but it must not become the owner of generation truth, authorization truth,
provider truth, or memory truth.

## Phase Delta

```yaml
phase_delta:
  create:
    - docs/v7_205_static_review_console_mockup_spec_gate.md
  modify: []
  purpose:
    - define static Review Console mockup information architecture
    - define mockup panels, fields, states, and non-execution rules
    - connect v7.184 planning with v7.185 and v7.186 architecture boundaries
    - mark Smart Commander v7.203 as support-layer complete, not product-mainline work
  validation:
    - git status --short --branch
    - git diff -- docs/v7_205_static_review_console_mockup_spec_gate.md
    - git diff --check
```

## Mockup Purpose

```yaml
mockup_purpose:
  definition: >
    The static Review Console mockup is a documentation-level product surface
    specification for how Agent Image Lab should review generated assets,
    package references, authorization state, and closeout records.
  core_rule: >
    The mockup displays and explains review flow. It does not call VCP, own core
    records, execute plugins, create images, save outputs, or write memory.
  intended_reader:
    - Agent Image Lab product designer
    - Review Console implementer
    - commander reviewing future docs-only gates
    - human approver checking no-execution boundaries
```

## Layer Boundary

```yaml
layer_boundary:
  review_console_layer: surface_app_layer
  core_truth_owner: Agent_Image_Lab_core_records
  review_console_owns_core_truth: false
  review_console_may_display:
    - generation_plan_ref
    - prompt_package_ref
    - authorization_package_ref
    - review_session_ref
    - asset_review_summary
    - human_decision_state
    - memory_delta_draft_state
    - closeout_summary
  review_console_must_not_mutate:
    - generation_plan
    - prompt_package
    - authorization_package
    - provider_result
    - memory_record
    - external_runtime_state
```

## Screen Inventory

```yaml
screen_inventory:
  primary_screen:
    name: review_workbench
    purpose: "Single asset or candidate batch review surface"
    required_regions:
      - top_status_strip
      - left_package_rail
      - center_asset_stage
      - right_decision_panel
      - bottom_audit_timeline

  supporting_states:
    - no_authorization_selected
    - authorization_draft_only
    - authorization_expired
    - generation_blocked
    - asset_rejected
    - accepted_candidate_pending_memory_authorization
    - memory_write_blocked
    - closeout_ready
```

## Region Specification

```yaml
top_status_strip:
  required_fields:
    - project_phase
    - review_console_mode
    - no_execution_badge
    - authorization_status
    - call_budget_summary
    - memory_write_status
  required_behavior:
    - always_show_no_execution_state_when_static
    - never_present_static_mockup_as_active_runtime

left_package_rail:
  required_cards:
    - generation_plan_card
    - prompt_package_card
    - authorization_package_card
    - review_console_session_card
  required_fields:
    - package_ref
    - version
    - status
    - scope_summary
    - mismatch_or_blocker_summary
  forbidden_fields:
    - raw_prompt
    - raw_payload
    - raw_endpoint
    - raw_response
    - private_path
    - secret

center_asset_stage:
  required_views:
    - asset_placeholder_or_ref
    - visual_review_summary
    - rejection_reason_summary
    - accepted_candidate_indicator
  static_mockup_rules:
    - may_use_placeholder_asset_tiles
    - may_show redacted runtime refs
    - must_not_embed_image_binary
    - must_not_fetch_remote_assets

right_decision_panel:
  required_sections:
    - human_review_decision
    - ai_review_summary
    - override_reason
    - next_allowed_action
    - blocked_action_list
  decision_rules:
    - human_review_overrides_ai_review
    - accepted_asset_does_not_equal_memory_write_authorization
    - rejected_asset_blocks_memory_write
    - plugin_success_does_not_equal_asset_acceptance

bottom_audit_timeline:
  required_events:
    - package_loaded
    - preflight_checked
    - generation_result_recorded
    - review_decision_recorded
    - closeout_ready_or_blocked
  redaction_rules:
    - summarize_only
    - no_raw_payload
    - no_raw_response
    - no_private_paths
```

## Static Data Contract

```yaml
static_data_contract:
  required_refs:
    - generation_plan_ref
    - prompt_package_ref
    - authorization_package_ref
    - review_console_ref
    - asset_ref
    - closeout_ref
  optional_refs:
    - memory_delta_ref
    - provider_diagnostic_ref
    - rejection_record_ref
    - human_override_ref
  field_policy:
    refs_are_display_only: true
    raw_values_forbidden: true
    private_paths_forbidden: true
    secrets_forbidden: true
    runtime_fetch_forbidden: true
```

## Interaction Specification

```yaml
interaction_specification:
  allowed_in_static_mockup_spec:
    - describe tabs
    - describe filters
    - describe disabled buttons
    - describe blocked action messaging
    - describe local placeholder state transitions
  forbidden_in_this_gate:
    - implement tabs
    - implement filters
    - implement renderer code
    - implement preload code
    - implement IPC code
    - implement runtime state
    - connect to VCPChat
    - connect to VCPToolBox
    - call bridge methods
    - call provider or plugin
    - create or read images
    - write DailyNote or VCP memory
```

Disabled action affordances are allowed as product specification, but every
disabled action must identify the missing authorization or blocker. A disabled
button label in the future mockup must never imply hidden execution.

## Review States

```yaml
review_states:
  draft_review:
    meaning: "Review session exists only as a draft or placeholder."
    allows_execution: false

  blocked_for_authorization:
    meaning: "A real action requires explicit A5 or independent authorization."
    allows_execution: false

  asset_under_review:
    meaning: "An asset reference is available for human assessment."
    allows_execution: false

  rejected_asset:
    meaning: "Asset failed review and cannot trigger memory write."
    allows_execution: false

  accepted_candidate:
    meaning: "Human may treat asset as accepted candidate."
    allows_execution: false
    note: "Memory write still requires separate authorization."

  closeout_ready:
    meaning: "Review record can be summarized."
    allows_execution: false
```

## Visual Structure Guidance

```yaml
visual_structure_guidance:
  product_feel: "quiet operational review desk"
  avoid:
    - landing_page_layout
    - marketing_hero
    - decorative_orb_background
    - generic_saas_dashboard_hype
    - game_hud_style
  emphasize:
    - dense_scan_readable_status
    - clear package lineage
    - visible blockers
    - human review authority
    - no-execution boundary
```

The future mockup should make the product state legible before it makes the
surface pretty. Review confidence depends on clear lineage and blockers.

## Explicit Non-Authorization Statement

```yaml
not_authorized_by_v7_205:
  renderer_code: false
  preload_code: false
  ipc_code: false
  runtime_execution: false
  VCPChat_runtime: false
  VCPToolBox_runtime: false
  real_manifest_read: false
  bridge_methods: false
  plugin_call: false
  provider_contact: false
  image_generation: false
  output_save: false
  DailyNote_write: false
  VCP_memory_write: false
  submitDraft: false
  push_tag_release: false
```

v7.205 is a specification gate. It is not a prototype build gate, not a runtime
integration gate, and not an A5 authorization package.

## Acceptance Criteria

```yaml
acceptance_criteria:
  - static_review_console_mockup_spec_defined
  - screen_inventory_defined
  - region_specification_defined
  - static_data_contract_defined
  - interaction_specification_defined
  - review_states_defined
  - layer_boundary_preserved
  - no_runtime_code_created
  - no_renderer_preload_ipc_created
  - no_plugin_provider_image_memory_touched
  - git_diff_check_passed
```

## Recommended Next Phase

```yaml
recommended_next_if_pass:
  phase: v7.206_static_review_console_mockup_file_gate
  purpose: >
    Create an isolated static mockup artifact only if explicitly authorized.
    The file gate must keep the mockup offline, no-runtime, no-VCP, no-plugin,
    no-provider, no-image-generation, and no-memory-write.

alternative_next:
  phase: mainline_status_index_after_spec_gate
  purpose: >
    Update README and roadmap to point at v7.205 if the project chooses to
    pause before creating a static mockup file.
```

## Closeout Template

```yaml
closeout:
  phase: v7.205_static_review_console_mockup_spec_gate
  commit_hash: <hash_or_null_if_not_committed>
  commit_message: "docs: add v7.205 static review console mockup spec"
  branch: master
  changed_files: 1
  execution_mode_selected_by_commander: direct_commander_execution

  static_review_console_mockup_spec:
    completed: true
    mainline_reentry_after_v7_203: true
    screen_inventory_defined: true
    region_specification_defined: true
    static_data_contract_defined: true
    interaction_specification_defined: true
    review_states_defined: true
    layer_boundary_preserved: true

  validation:
    git_diff_check: passed | failed
    validator_executed: false
    script_executed: false
    powershell_script_executed: false

  boundaries:
    renderer_code_created: false
    preload_code_created: false
    ipc_code_created: false
    runtime_accessed: false
    plugin_called: false
    provider_contacted: false
    image_generated: false
    memory_written: false
    push_performed: false

  recommended_next: v7.206_static_review_console_mockup_file_gate
```
