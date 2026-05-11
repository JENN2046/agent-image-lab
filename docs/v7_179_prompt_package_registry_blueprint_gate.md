# v7.179 Prompt Package Registry Blueprint Gate

## Executive Verdict

```yaml
executive_verdict:
  overall_status: pass
  product_workflow_blueprint: completed
  prompt_package_registry_blueprint: completed
  image_generation_allowed_now: false
  production_candidate_002_allowed_now: false
  memory_write_path_allowed_now: false
  recommended_next_phase: v7.180_review_console_surface_blueprint_gate
```

This blueprint defines the prompt package registry schema, status taxonomy, reuse/versioning policy, and authorization relationship. It establishes the documentation-level standards for all future prompt packages without authorizing any generation or execution.

---

## Current State

```yaml
current_state:
  v7_178_defined:
    core_workflow_phases_defined: true
    prompt_package_blueprint_defined: true
    generation_plan_blueprint_defined: true
    human_review_gate_defined: true
    asset_status_taxonomy_defined: true
    memory_suitability_rule_defined: true
    authorization_matrix_defined: true

  still_forbidden:
    image_generation_allowed_now: false
    production_candidate_002_allowed_now: false
    memory_write_path_allowed_now: false
    runtime_execution_allowed_now: false
    plugin_calls_allowed_now: false

  source_commit: b0c2994
  source_commit_message: "docs: add v7.178 image workflow blueprint"
```

---

## Registry Purpose

The prompt package registry is the structured catalog of all prompt packages designed for Agent Image Lab workflow runs. Its purpose is to:

1. **Standardize** prompt package structure across all workflow runs
2. **Track** prompt status from draft through retirement
3. **Enable** informed reuse decisions with compatibility checks
4. **Prevent** unauthorized generation by separating approval from authorization
5. **Record** review criteria, negative constraints, and forbidden elements for audit

The registry is a **documentation-level system**. It defines schema and policy but does not execute, generate, or store images.

---

## Prompt Package ID Policy

```yaml
prompt_package_id_policy:
  format: "PP-{YYYYMMDD}-{sequential_number}"
  example: "PP-20260512-001"
  uniqueness: "Globally unique across all prompt packages"
  assignment: "Assigned at creation (draft status)"
  immutability: "ID never changes; version tracks iterations"
  reference: "Used in generation_plan, closeout_package, and review records"
```

---

## Prompt Package Schema

```yaml
prompt_package_schema:
  required:
    - prompt_package_id
    - source_brief_ref
    - product_subject
    - visual_intent
    - composition
    - lighting
    - material_texture
    - background
    - negative_constraints
    - forbidden_elements
    - output_constraints
    - review_criteria
    - retry_policy
    - status
    - version

  optional:
    - reference_asset_refs
    - camera_or_lens_language
    - color_palette
    - prop_strategy
    - styling_notes
    - localization_notes
    - model_or_plugin_target
    - seed_strategy
    - aspect_ratio
```

---

## Required Fields

```yaml
required_fields:
  prompt_package_id:
    type: string
    format: "PP-{YYYYMMDD}-{N}"
    description: "Unique registry identifier"

  source_brief_ref:
    type: string
    description: "Reference to the originating product brief"

  product_subject:
    type: string
    description: "The subject, product, or scene being visualized"

  visual_intent:
    type: string
    description: "Overall visual goal, mood, and style direction"

  composition:
    type: string
    description: "Desired framing, angle, layout, and depth"

  lighting:
    type: string
    description: "Lighting direction, intensity, style, and sources"

  material_texture:
    type: string
    description: "Surface qualities and material properties"

  background:
    type: string
    description: "Background setting, environment, or negative space treatment"

  negative_constraints:
    type: array<string>
    description: "Style and quality constraints to explicitly avoid"

  forbidden_elements:
    type: array<string>
    description: "Hard elements that must never appear in output"

  output_constraints:
    type: object
    description: "Format, size, aspect ratio, color space, file type constraints"

  review_criteria:
    type: object
    description: "Structured criteria for human review pass/fail decisions"

  retry_policy:
    type: object
    description: "Conditions, limits, and escalation for regeneration attempts"

  status:
    type: string
    enum: [draft, review_ready, approved_for_planning, generation_authorization_required, generation_authorized, retired, rejected]
    description: "Current lifecycle status"

  version:
    type: string
    format: "v{N}"
    description: "Version identifier for iteration tracking"
```

---

## Optional Fields

```yaml
optional_fields:
  reference_asset_refs:
    type: array<string>
    description: "Links to reference assets or moodboard examples"

  camera_or_lens_language:
    type: string
    description: "Camera type, focal length, depth-of-field language"

  color_palette:
    type: array<string> | string
    description: "Specific color palette references or hex codes"

  prop_strategy:
    type: string
    description: "Props, accessories, or staging elements"

  styling_notes:
    type: string
    description: "Additional styling direction or references"

  localization_notes:
    type: string
    description: "Regional or cultural adaptation requirements"

  model_or_plugin_target:
    type: string
    description: "Preferred model or plugin for generation"

  seed_strategy:
    type: string
    description: "Seed selection, variation control, or randomization policy"

  aspect_ratio:
    type: string
    description: "Explicit aspect ratio if different from default"
```

---

## Negative Constraints And Forbidden Elements

```yaml
negative_constraints_rules:
  - "negative_constraints are style and quality constraints (e.g., no oversaturation, no motion blur)"
  - "forbidden_elements are hard prohibitions that must never appear in output"
  - "forbidden_elements take priority over positive prompt instructions"
  - "The following must be explicitly listed as high-risk forbidden elements: human faces, logos, brand text, readable text, private paths, real endpoints, secrets"
  - "If the brief requires people, logos, or text: must be explicitly recorded as intentional_exception in a note"
  - "intentional_exception does not override forbidden_elements unless explicitly approved in the A5 authorization"
  - "All negative_constraints and forbidden_elements are audited at human review gate"
```

---

## Review Criteria Blueprint

```yaml
review_criteria_blueprint:
  fields:
    subject_accuracy:
      description: "Does the output match the intended subject?"
      scale: "pass / needs_adjustment / fail"

    prompt_alignment:
      description: "Does the output follow the prompt package instructions?"
      scale: "pass / needs_adjustment / fail"

    composition_quality:
      description: "Is the composition aesthetically and commercially appropriate?"
      scale: "pass / needs_adjustment / fail"

    lighting_quality:
      description: "Does lighting match intent and appear natural/professional?"
      scale: "pass / needs_adjustment / fail"

    material_texture_accuracy:
      description: "Are materials and textures rendered correctly?"
      scale: "pass / needs_adjustment / fail"

    forbidden_element_absence:
      description: "Are forbidden_elements absent from the output?"
      scale: "pass / fail"
      note: "fail is permanent for this criterion — no retry without brief revision"

    commercial_usability:
      description: "Is the output commercially usable (resolution, quality, artifacts)?"
      scale: "pass / needs_retouch / fail"

    retouchability:
      description: "Can the output be retouched to meet standards?"
      scale: "yes / no"

    memory_suitability_precheck:
      description: "Pre-check whether the asset could qualify for memory (not a decision)"
      scale: "suitable / not_suitable"
      note: "Does not authorize memory write"

  review_rules:
    memory_suitability_precheck_does_not_authorize_memory_write: true
    commercial_usability_does_not_equal_accepted_candidate: true
    accepted_candidate_requires_human_review: true
```

---

## Prompt Status Taxonomy

```yaml
prompt_status_taxonomy:
  - draft:
      description: "Prompt package is being created; not ready for review"
      allows_review: false
      allows_generation_planning: false
      allows_generation: false

  - review_ready:
      description: "Prompt package is complete and ready for human review"
      allows_review: true
      allows_generation_planning: false
      allows_generation: false

  - approved_for_planning:
      description: "Prompt package approved for generation planning (docs only)"
      allows_review: false
      allows_generation_planning: true
      allows_generation: false
      note: "approved_for_planning does NOT authorize generation"

  - generation_authorization_required:
      description: "Generation plan exists; explicit A5 authorization needed"
      allows_review: false
      allows_generation_planning: false
      allows_generation: false
      note: "This status means 'ready for auth', not 'authorized'"

  - generation_authorized:
      description: "A5 authorization granted; generation may proceed"
      allows_review: false
      allows_generation_planning: false
      allows_generation: true

  - retired:
      description: "Prompt package retired from active use; kept for reference"
      allows_review: false
      allows_generation_planning: false
      allows_generation: false

  - rejected:
      description: "Prompt package rejected and must not be reused without revision"
      allows_review: false
      allows_generation_planning: false
      allows_generation: false

  status_rules:
    approved_for_planning_does_not_authorize_generation: true
    generation_authorization_required_is_not_generation_authorized: true
    generation_authorized_requires_independent_A5: true
    rejected_prompt_must_not_be_reused_without_revision: true
```

---

## Reuse Policy

```yaml
reuse_policy:
  reusable_when:
    - condition: "Prompt status is approved_for_planning or generation_authorization_required"
      rationale: "Only prompts that have passed initial review are eligible"
    - condition: "Product category and visual intent match the new brief"
      rationale: "Reuse requires semantic compatibility"
    - condition: "forbidden_elements remain compatible with the new brief"
      rationale: "New brief may introduce new forbidden_elements"
    - condition: "review_criteria remain compatible with the new asset type"
      rationale: "Review gate expectations must be consistent"

  not_reusable_when:
    - condition: "Prompt status is rejected"
      rationale: "Rejected prompts failed review and must be revised first"
    - condition: "Generated outputs repeatedly failed review for the same prompt"
      rationale: "Repeated failure indicates a systemic prompt issue"
    - condition: "Prompt includes stale model or plugin assumptions"
      rationale: "Model/plugin may have changed or been deprecated"
    - condition: "Prompt contains product-specific private information"
      rationale: "Private information must not propagate across different briefs"
```

---

## Versioning Policy

```yaml
versioning_policy:
  initial_version: "v1"
  version_increment: "Minor revision increments version by 1 (v1 -> v2 -> v3)"
  major_revision: "Reserved for structural schema changes or output direction changes"
  version_format: "v{integer}"
  revision_triggers:
    - "Modification to visual_intent, composition, or lighting"
    - "Addition or removal of forbidden_elements"
    - "Changes to review_criteria or retry_policy"
    - "Change in model_or_plugin_target"
  non_revision_triggers:
    - "Typo fixes or formatting"
    - "Adding reference_asset_refs without changing prompt direction"
    - "Adding localization_notes"
  version_history: "Each version should reference its predecessor (previous_version field)"
```

---

## Authorization Relationship

```yaml
authorization_relationship:
  prompt_package_creation:
    allowed_under_A4: true
    requires_explicit_authorization: false
    description: "Creating and editing prompt packages is docs-only work"

  prompt_package_approval_for_planning:
    allowed_under_A4: true
    requires_explicit_authorization: false
    description: "Approving a prompt package for generation planning is still docs-only"

  actual_generation:
    requires_independent_A5: true
    requires_explicit_authorization: true
    description: "Generation requires its own A5 authorization gate; prompt approval is not sufficient"

  production_candidate_002:
    requires_independent_A5: true
    requires_new_authorization_package: true
    description: "Production candidate execution requires a separate A5 authorization package"

  memory_write:
    requires_independent_memory_write_authorization: true
    requires_separate_memory_suitability_review: true
    description: "Memory write requires both suitability review and independent authorization"

  push_tag_release:
    requires_explicit_version_action_authorization: true
    description: "Version actions require explicit user authorization"
```

---

## Registry Closeout Blueprint

```yaml
registry_closeout_blueprint:
  fields:
    - registry_entry_id: "Same as prompt_package_id"
    - prompt_package_ref: "Full prompt package content or link"
    - status_history:
        - status: "Lifecycle status at each transition"
        - timestamp: "When the transition occurred"
        - authorized_by: "Who or what authorized the transition"
    - generation_authorization_ref: "Link to A5 authorization record (if generation was authorized)"
    - generation_run_refs: "Links to generation runs using this prompt package"
    - review_summary: "Summary of review outcomes across runs"
    - retry_count: "Total retries across all runs"
    - version_history: "List of all versions with change summaries"
```

---

## Explicit Non-Authorization Statement

```yaml
not_authorized_by_v7_179:
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

v7.179 is a **docs-only prompt package registry blueprint gate**. It defines the schema, policy, and taxonomy for prompt packages but does not authorize any generation, execution, memory write, or runtime access.

---

## Recommended Next Phase

```yaml
recommended_next_if_pass:
  phase: v7.180_review_console_surface_blueprint_gate
  purpose: >
    Define human review console wireframes, asset status
    tracking, and acceptance checklist. Continue docs-only
    planning. No generation, no production, no memory write.

alternative_next:
  phase: v7.180_generation_plan_package_blueprint_gate
  purpose: >
    Define generation_plan schema and authorization package
    relationship. Alternative path if execution planning is
    higher priority than review surface.
```

---

## Closeout Template

```yaml
closeout:
  phase: v7.179_prompt_package_registry_blueprint_gate
  commit_hash: "<set_by_commit>"
  commit_message: "docs: add v7.179 prompt package registry blueprint"
  branch: master
  git_status: clean
  changed_files: 1
  local_scope_result: passed
  push: not_performed

  registry:
    prompt_package_registry_blueprint_completed: true
    prompt_package_schema_defined: true
    required_fields_defined: true
    optional_fields_defined: true
    status_taxonomy_defined: true
    negative_constraints_rules_defined: true
    forbidden_elements_rules_defined: true
    review_criteria_blueprint_defined: true
    reuse_policy_defined: true
    versioning_policy_defined: true
    authorization_relationship_defined: true

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
  recommended_next: v7.180_review_console_surface_blueprint_gate

  remote_sync_verification:
    push_performed: false
    remote_head_checked: false
    pending_push: true

  final_state:
    commit_completed: true
    push_completed: false
    next_phase_started: false
```
