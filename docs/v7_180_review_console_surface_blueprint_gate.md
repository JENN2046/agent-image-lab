# v7.180 Review Console Surface Blueprint Gate

## Executive Verdict

```yaml
executive_verdict:
  overall_status: pass
  product_workflow_blueprint: completed
  prompt_package_registry_blueprint: completed
  review_console_surface_blueprint: completed
  image_generation_allowed_now: false
  production_candidate_002_allowed_now: false
  memory_write_path_allowed_now: false
  real_review_console_runtime_allowed_now: false
  recommended_next_phase: v7.181_generation_plan_package_blueprint_gate
```

This blueprint defines the human review console surface: review session model, asset card fields, decision panel, acceptance checklist, rejection taxonomy, retry decision flow, memory suitability panel, and closeout panel. It defines the surface without implementing runtime, UI, or VCPChat integration.

---

## Current State

```yaml
current_state:
  product_planning_completed:
    v7_178_image_workflow_blueprint: completed
    v7_179_prompt_package_registry_blueprint: completed

  still_forbidden:
    image_generation_allowed_now: false
    production_candidate_002_allowed_now: false
    memory_write_path_allowed_now: false
    runtime_execution_allowed_now: false
    plugin_calls_allowed_now: false

  source_commit: 0a6a605
  source_commit_message: "docs: add v7.179 prompt package registry blueprint"
```

---

## Review Console Purpose

The review console is the human-facing surface for reviewing generated assets within an image workflow run. Its purpose is to:

1. **Present** generated assets alongside their prompt package and generation plan for comparative review
2. **Guide** the reviewer through structured acceptance criteria
3. **Record** review decisions with timestamped, auditable reasons
4. **Prevent** automatic memory writes — acceptance does not equal memory suitability
5. **Track** asset status through the complete lifecycle from draft to closeout
6. **Support** retry decisions with clear policy guardrails

The console blueprint defines **what** the review surface contains, **not** how it is implemented. No runtime, no VCPChat, no CDP, no bridge.

---

## Review Session Model

```yaml
review_session_model:
  purpose: >
    A review session wraps one workflow run's assets for structured human review.
    It aggregates prompt package, generation plan, and asset outputs into a
    single review context.

  required_fields:
    - review_session_id:
        type: string
        format: "RS-{YYYYMMDD}-{sequential_number}"
        description: "Unique review session identifier"
    - workflow_run_id:
        type: string
        description: "Link to the originating workflow run"
    - prompt_package_ref:
        type: string
        description: "Link to the prompt package used for generation"
    - generation_plan_ref:
        type: string
        description: "Link to the generation plan executed"
    - asset_refs:
        type: array<string>
        description: "List of asset references in this session"
    - reviewer:
        type: string
        description: "Reviewer identifier or name"
    - review_started_at:
        type: string
        format: "ISO 8601 timestamp"
        description: "When the review session started"
    - review_status:
        type: string
        enum: [draft, ready_for_review, in_review, accepted, needs_human_review, rejected, closed]
        description: "Current session status"
    - final_decision:
        type: string
        enum: [accepted, needs_human_review, rejected, partially_accepted]
        description: "Overall session decision after all assets reviewed"

  review_session_status:
    - draft:
        description: "Session created but not yet populated with assets"
    - ready_for_review:
        description: "Session fully populated; awaiting reviewer"
    - in_review:
        description: "Reviewer actively reviewing assets"
    - accepted:
        description: "All assets in session accepted"
    - needs_human_review:
        description: "Some or all assets flagged for additional review"
    - rejected:
        description: "Session-level rejection (e.g., all assets rejected)"
    - closed:
        description: "Session completed; closeout package generated"

  session_rules:
    - "Each workflow run produces exactly one review session"
    - "Session cannot be reopened after closed"
    - "Session does not authorize generation, memory write, or plugin calls"
```

---

## Asset Card Blueprint

```yaml
asset_card_blueprint:
  purpose: >
    An asset card displays one generated asset within the review console,
    along with its metadata, review status, and reviewer annotations.

  fields:
    - asset_ref:
        type: string
        description: "Unique reference to the asset"
    - asset_hash:
        type: string
        description: "Content hash for integrity verification"
    - source_prompt_package_id:
        type: string
        description: "Link to the prompt package used"
    - generation_plan_ref:
        type: string
        description: "Link to the generation plan"
    - generated_at:
        type: string
        format: "ISO 8601 timestamp"
        description: "When the asset was generated"
    - model_or_plugin_target:
        type: string
        description: "Model or plugin that generated the asset"
    - displayed_preview:
        type: "reference"
        description: "Preview image reference (read-only, no modification)"
    - asset_status:
        type: string
        enum: [generated_candidate, accepted_candidate, needs_human_review, rejected, memory_suitable, memory_rejected]
        description: "Current asset lifecycle status"
    - reviewer_notes:
        type: string
        description: "Free-text notes from the reviewer"
    - rejection_reasons:
        type: array<string>
        description: "Structured rejection reason codes"
    - memory_suitability_precheck:
        type: string
        enum: [not_evaluated, precheck_suitable, precheck_not_suitable]
        description: "Preliminary memory suitability indicator (not a decision)"

  rules:
    displayed_preview_is_read_only: true
    asset_card_does_not_write_memory: true
    asset_card_does_not_trigger_generation: true
    asset_card_does_not_call_plugin: true
    displayed_preview_must_not_be_confused_with_asset_source: true
```

---

## Review Decision Panel

```yaml
review_decision_panel:
  purpose: >
    The panel where the reviewer selects a decision for each asset card.
    Decision options and their implications are defined below.

  decision_options:
    accepted_candidate:
      meaning: "Asset passes visual review; accepted as a valid output"
      allows_generation: false
      allows_memory_write: false
      auto_promotes: false
      next_status: accepted_candidate
      notes: "accepted_candidate is NOT memory_suitable. Memory requires separate review."

    needs_human_review:
      meaning: "Asset partially meets criteria; reviewer uncertainty or edge case"
      allows_generation: false
      allows_memory_write: false
      auto_promotes: false
      next_status: needs_human_review
      notes: "This status blocks auto-promotion. Must not be silently upgraded."

    rejected:
      meaning: "Asset fails review criteria; not acceptable"
      allows_generation: false
      allows_memory_write: false
      auto_promotes: false
      next_status: rejected
      notes: >
        Rejected assets may be retried per retry_policy.
        They must never enter memory, never be submitted as deliverables,
        and never auto-escalate.

    memory_suitable:
      meaning: >
        ONLY selectable if a separate memory suitability review has been completed.
        Not a standard review decision — it appears only when the memory suitability
        panel has concluded.
      allows_generation: false
      allows_memory_write: false
      requires_separate_memory_write_authorization: true
      notes: >
        Even memory_suitable does NOT authorize memory write.
        A separate memory write authorization is required.
```

---

## Acceptance Checklist

```yaml
acceptance_checklist:
  purpose: "Structured checklist that the reviewer works through for each asset"
  items:
    - subject_accuracy:
        description: "Does the asset match the intended subject from the brief?"
        severity: critical
        possible_values: [pass, fail]

    - prompt_alignment:
        description: "Does the asset follow the prompt package instructions?"
        severity: critical
        possible_values: [pass, fail]

    - composition_quality:
        description: "Is the composition appropriate for the intended use?"
        severity: normal
        possible_values: [pass, needs_adjustment, fail]

    - lighting_quality:
        description: "Does lighting match the visual intent?"
        severity: normal
        possible_values: [pass, needs_adjustment, fail]

    - material_texture_accuracy:
        description: "Are materials and textures rendered correctly?"
        severity: normal
        possible_values: [pass, needs_adjustment, fail]

    - forbidden_element_absence:
        description: "No forbidden_elements detected in the asset"
        severity: critical
        possible_values: [pass, fail]
        rule: "fail here is permanent — retry requires brief revision"

    - commercial_usability:
        description: "Is the asset commercially usable (resolution, artifacts, quality)?"
        severity: normal
        possible_values: [pass, needs_retouch, fail]

    - retouchability:
        description: "Can the asset be retouched to meet standards?"
        severity: optional
        possible_values: [yes, no]
        condition: "Only assessed if commercial_usability is needs_retouch"

    - no_logo_or_brand_violation:
        description: "No unwanted logos, brand marks, or branding elements"
        severity: critical
        possible_values: [pass, fail]

    - no_readable_unwanted_text:
        description: "No readable text that should not appear"
        severity: critical
        possible_values: [pass, fail]

    - no_private_or_secret_leak:
        description: "No private paths, endpoints, secrets, or internal data exposed"
        severity: critical
        possible_values: [pass, fail]
        rule: "fail here is permanent — asset must be destroyed"

  decision_rules:
    - "Any critical fail → asset status = rejected (unless intentional_exception authorized)"
    - "All critical pass AND all normal pass → asset status = accepted_candidate"
    - "Any normal fail → asset status = needs_human_review"
    - "no_private_or_secret_leak fail → permanent rejection, no retry"
    - "forbidden_element_absence fail → permanent rejection, retry requires brief revision"
```

---

## Rejection Reason Taxonomy

```yaml
rejection_reason_taxonomy:
  purpose: "Standardized rejection reasons for structured tracking and audit"
  reasons:
    - wrong_subject:
        description: "Generated asset does not match the intended subject"
        severity: critical

    - wrong_style:
        description: "Visual style diverges from the intended direction"
        severity: normal

    - poor_composition:
        description: "Composition is unbalanced or commercially unusable"
        severity: normal

    - lighting_failure:
        description: "Lighting does not match intent or introduces artifacts"
        severity: normal

    - material_texture_failure:
        description: "Materials or textures rendered incorrectly"
        severity: normal

    - human_face_unwanted:
        description: "Unintended human face appeared in output"
        severity: critical

    - logo_or_brand_mark:
        description: "Unwanted logo, brand mark, or trademark visible"
        severity: critical

    - readable_unwanted_text:
        description: "Unintended readable text present"
        severity: critical

    - private_or_secret_leak:
        description: "Private path, endpoint, secret, or internal data visible"
        severity: critical
        permanent: true

    - low_resolution_or_artifact:
        description: "Output resolution too low or visible artifacts"
        severity: normal

    - prompt_noncompliance:
        description: "Asset does not follow prompt package instructions"
        severity: critical

    - commercial_unusable:
        description: "Asset not usable for commercial or intended purpose"
        severity: normal

  rules:
    - "critical rejection reasons block acceptance"
    - "permanent rejection reasons forbid retry without brief revision"
    - "multiple rejection reasons can apply to one asset"
    - "rejection reasons are recorded in closeout for audit"
```

---

## Retry Decision Flow

```yaml
retry_decision_flow:
  purpose: "Define when and how retry is allowed after rejection"

  retry_allowed_when:
    - condition: "Rejection reason is correctable by prompt revision"
      rationale: "E.g., wrong_style, poor_composition, lighting_failure can be fixed in prompt"
    - condition: "Retry policy has remaining attempts"
      rationale: "prompt_package.retry_policy defines max_retries"
    - condition: "A5 generation authorization remains valid or is renewed"
      rationale: "Expired authorization requires re-authorization"

  retry_forbidden_when:
    - condition: "forbidden_elements were violated due to unclear brief"
      rationale: "Brief must be revised before retry"
    - condition: "Authorization scope has expired"
      rationale: "Cannot generate outside authorized scope"
    - condition: "Memory write path is being used as shortcut to retry"
      rationale: "Memory write is not a retry mechanism"
    - condition: "Retry would exceed authorized generation count"
      rationale: "Authorized limits must be respected"
    - condition: "Rejection reason is permanent (private_or_secret_leak)"
      rationale: "Permanent rejections cannot be retried"

  retry_requires:
    - "Updated prompt package version reflecting the revision"
    - "Updated generation plan if parameters changed"
    - "Explicit authorization check — re-authorization needed if original scope expired"
    - "New review session for retry outputs"

  retry_flow:
    - "1. Asset rejected with correctable reason"
    - "2. Reviewer or prompt designer revises prompt package (new version)"
    - "3. Generation plan updated if needed"
    - "4. Authorization check: is A5 auth still valid?"
    - "5. If valid → proceed with regeneration"
    - "6. If expired → request new A5 authorization"
    - "7. New output enters new review session"
```

---

## Memory Suitability Panel

```yaml
memory_suitability_panel:
  purpose: >
    A separate panel (not part of the standard review decision) that evaluates
    whether an accepted asset is suitable for VCP memory storage. This panel
    is intentionally decoupled from the visual acceptance decision.

  allowed_decisions:
    - not_evaluated:
        meaning: "No memory suitability review has been performed"
        allows_memory_write: false
        default: true

    - precheck_suitable:
        meaning: "Initial precheck indicates asset could be memory-suitable"
        allows_memory_write: false
        note: "Preliminary only; not a binding decision"

    - precheck_not_suitable:
        meaning: "Initial precheck indicates asset is not memory-suitable"
        allows_memory_write: false

    - memory_suitable:
        meaning: "Full memory suitability review completed; asset qualifies"
        allows_memory_write: false
        note: "Still does NOT authorize actual memory write"

    - memory_rejected:
        meaning: "Asset reviewed and rejected for memory storage"
        allows_memory_write: false

  display_rules:
    - "Panel is hidden by default; visible only for accepted_candidate assets"
    - "Panel does not appear for rejected or needs_human_review assets"
    - "Precheck results are displayed but clearly labeled as preliminary"
    - "memory_suitable decision requires separate reviewer action, not auto-derived"
    - "Panel never triggers memory write — write requires independent authorization"

  hard_rules:
    visual_acceptance_does_not_authorize_memory_write: true
    memory_suitable_does_not_write_memory_by_itself: true
    memory_write_requires_independent_authorization: true
    memory_suitability_review_cannot_be_bypassed_by_auto_decision: true
```

---

## Closeout Panel

```yaml
closeout_panel:
  purpose: "Aggregates the full review session into a closeout summary"

  fields:
    - review_session_id: "Link to the review session"
    - workflow_run_id: "Link to the workflow run"
    - prompt_package_ref: "Link to the prompt package"
    - generation_plan_ref: "Link to the generation plan"
    - authorization_ref: "Link to A5 authorization (if generation was authorized)"
    - review_summary:
        total_assets: "Number of assets reviewed"
        accepted_count: "Number of accepted assets"
        needs_human_review_count: "Number of assets flagged"
        rejected_count: "Number of rejected assets"
        retry_count: "Number of retries performed (if any)"
    - acceptance_checklist_results: "Per-asset checklist pass/fail matrix"
    - rejection_reasons_log: "All rejection reasons recorded"
    - memory_suitability_summary: "Memory suitability decisions (if evaluated)"
    - final_decision: "Overall session decision"
    - reviewed_by: "Reviewer identifier"
    - reviewed_at: "ISO 8601 timestamp of review completion"
    - closeout_generated_at: "ISO 8601 timestamp of closeout creation"

  rules:
    - "Closeout panel is read-only after session is closed"
    - "Closeout does not trigger any write, generation, or memory action"
    - "Closeout is the final artifact of the review process"
```

---

## Authorization Matrix

```yaml
authorization_matrix:
  review_console_blueprint:
    description: "Documentation-level blueprint for the review console"
    allowed_under_A4: true
    requires_explicit_authorization: false

  static_review_console_mockup:
    description: "Static HTML/JS mockup of the review console (no runtime)"
    allowed_under_A4: true
    requires_explicit_authorization: false

  real_runtime_review_console:
    description: "Real review console connected to VCPChat or runtime"
    requires_separate_runtime_authorization: true
    requires_independent_authorization_package: true

  image_generation:
    description: "Actual image generation via plugin or model"
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
```

---

## Explicit Non-Authorization Statement

```yaml
not_authorized_by_v7_180:
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
  real_review_console_runtime: false
```

v7.180 is a **docs-only review console surface blueprint gate**. It defines the review surface structure but does not authorize any runtime, UI implementation, VCPChat integration, generation, or memory write.

---

## Recommended Next Phase

```yaml
recommended_next_if_pass:
  phase: v7.181_generation_plan_package_blueprint_gate
  purpose: >
    Define generation_plan schema and A5 authorization package relationship.
    Continue docs-only planning. No generation, no production, no memory write.

alternative_next:
  phase: v7.181_static_review_console_mockup_planning_gate
  purpose: >
    Plan a static HTML/JS mockup of the review console.
    No VCPChat, no CDP, no bridge, no runtime.
```

---

## Closeout Template

```yaml
closeout:
  phase: v7.180_review_console_surface_blueprint_gate
  commit_hash: "<set_by_commit>"
  commit_message: "docs: add v7.180 review console surface blueprint"
  branch: master
  git_status: clean
  changed_files: 1
  local_scope_result: passed
  push: not_performed

  review_console:
    review_console_surface_blueprint_completed: true
    review_session_model_defined: true
    asset_card_blueprint_defined: true
    review_decision_panel_defined: true
    acceptance_checklist_defined: true
    rejection_reason_taxonomy_defined: true
    retry_decision_flow_defined: true
    memory_suitability_panel_defined: true
    closeout_panel_defined: true
    authorization_matrix_defined: true

  authorization:
    image_generation_allowed_now: false
    production_candidate_002_allowed_now: false
    memory_write_path_allowed_now: false
    runtime_execution_allowed_now: false
    real_review_console_runtime_allowed_now: false

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
  recommended_next: v7.181_generation_plan_package_blueprint_gate

  remote_sync_verification:
    push_performed: false
    remote_head_checked: false
    pending_push: true

  final_state:
    commit_completed: true
    push_completed: false
    next_phase_started: false
```
