# Prompt Schema Validator Rule Specification

```yaml
spec_id: prompt_schema_validator_rule_specification_v1
source_phase: v12_003_prompt_schema_validator_rule_specification_gate
source_plan: docs/prompt_schema_machine_validator_implementation_plan.md
source_inventory: docs/prompt_schema_machine_validator_rule_inventory.md
machine_validator_implemented: false
scripts_modified: false
fixture_files_created: false
```

This document specifies rules for a future Prompt Schema Machine Validator. It is not executable and does not create a validator script.

## Severity Model

```yaml
severity_model:
  ERROR:
    meaning: unsafe or schema-breaking condition; future validator exits nonzero
    use_for:
      - missing required canonical field in new artifacts
      - provider/image/memory/production/runtime boundary loosened
      - prompt package cannot be mapped to runner-facing canonical prompt
      - accepted_candidate treated as commercial_delivery_ready
      - memory_suitability inferred without explicit review
      - runs output or accepted_samples write allowed without authorization
  WARN:
    meaning: legacy artifact compatibility gap or non-critical completeness gap
    use_for:
      - pre-schema historical artifact lacks a newer field
      - legacy prompt package has no product_brief_ref but has a documented exception
      - older review lacks watch items but declares a bounded review result
  INFO:
    meaning: optional metadata quality suggestion
    use_for:
      - optional score rubric improvements
      - clearer source phase references
      - documentation-only readability improvements
```

## Pass / Fail / Warn Policy

```yaml
policy:
  pass:
    condition: artifact satisfies all required rules for its declared type and does not loosen safety boundaries
  fail:
    condition: any ERROR rule is triggered
    future_exit_code: nonzero
  warn:
    condition: only WARN rules are triggered
    future_exit_code: zero_with_warnings
  info:
    condition: only INFO rules are triggered
    future_exit_code: zero
```

## A. Prompt Package Rules

| rule_id | rule_name | severity | required condition |
|---|---|---|---|
| PP-001 | prompt_literal_block_independent | ERROR | `prompt: |` appears as an independent YAML literal block line. |
| PP-002 | positive_prompt_literal_block_independent | ERROR | `positive_prompt: |` appears as an independent YAML literal block line. |
| PP-003 | negative_prompt_literal_block_independent | ERROR | `negative_prompt: |` appears as an independent YAML literal block line. |
| PP-004 | prompt_positive_prompt_synchronized | ERROR | `prompt` and `positive_prompt` contain synchronized positive prompt content. |
| PP-005 | runner_canonical_prompt_field_present | ERROR | Runner-facing canonical prompt field exists and maps to `prompt`. |
| PP-006 | product_identity_present | ERROR | `product_identity` exists and identifies the product. |
| PP-007 | selected_product_present | ERROR | `selected_product` exists. |
| PP-008 | locked_structure_present | ERROR | `locked_structure` exists. |
| PP-009 | product_brief_ref_present_or_legacy_exception | ERROR/WARN | New packages require `product_brief_ref`; known legacy route may warn with explicit exception. |
| PP-010 | material_constraints_present | ERROR | `material_constraints` exists. |
| PP-011 | structure_constraints_present | ERROR | `structure_constraints` exists. |
| PP-012 | scene_constraints_present | ERROR | `scene_constraints` exists. |
| PP-013 | forbidden_elements_present | ERROR | `forbidden_elements` exists and covers logo/text/person/material/shape drift. |
| PP-014 | acceptance_criteria_present | ERROR | `acceptance_criteria` exists. |
| PP-015 | human_review_checklist_present | ERROR | `human_review_checklist` exists. |
| PP-016 | prompt_package_is_not_A5_authorization | ERROR | Prompt package does not imply provider contact, image generation, secret read, memory write, or production authorization. |

## B. Product Brief Rules

| rule_id | rule_name | severity | required condition |
|---|---|---|---|
| PB-001 | selected_product_present | ERROR | Brief names the selected product. |
| PB-002 | product_identity_present | ERROR | Product identity or identity lock exists. |
| PB-003 | structure_lock_present | ERROR | Structure lock and required parts are present. |
| PB-004 | material_texture_description_present | ERROR | Material and texture requirements are present. |
| PB-005 | packaging_label_boundary_present | ERROR | Label, text, logo, watermark, and fake text policy is explicit. |
| PB-006 | visual_goal_present | ERROR | Visual goal or product direction is present. |
| PB-007 | risk_matrix_present | ERROR | Known risks or risk matrix is present. |
| PB-008 | negative_constraints_present | ERROR | Must-not-be or forbidden drift constraints are present. |
| PB-009 | acceptance_criteria_draft_present | ERROR | Acceptance criteria draft is present. |

## C. Static Review Rules

| rule_id | rule_name | severity | required condition |
|---|---|---|---|
| SR-001 | reviewed_artifact_ref_present | ERROR | Review target path and type are present. |
| SR-002 | static_review_result_present | ERROR | Verdict or review result is present. |
| SR-003 | watch_items_present_or_none_declared | WARN | Watch items are present or explicitly declared none. |
| SR-004 | A5_authorization_created_false_for_static_review | ERROR | Static review does not create A5 authorization. |
| SR-005 | provider_contact_false | ERROR | Provider contact is false. |
| SR-006 | image_generation_false | ERROR | Image generation is false. |
| SR-007 | memory_write_false | ERROR | Memory write is false. |

## D. A5 Authorization Rules

| rule_id | rule_name | severity | required condition |
|---|---|---|---|
| A5-001 | approved_product_present | ERROR | Approved product is present. |
| A5-002 | approved_prompt_package_present | ERROR | Approved prompt package is present. |
| A5-003 | output_directory_present | ERROR | Output directory is present. |
| A5-004 | provider_calls_max_present | ERROR | Provider call budget is present, expected one for minimal trials. |
| A5-005 | generation_attempts_max_present | ERROR | Generation attempt budget is present, expected one for minimal trials. |
| A5-006 | output_images_max_present | ERROR | Output image budget is present. |
| A5-007 | auto_retry_false | ERROR | Auto retry is false. |
| A5-008 | stop_after_generation_true | ERROR | Stop after generation is true. |
| A5-009 | secret_read_boundary_present | ERROR | Secret read boundary is explicit. |
| A5-010 | A5_execution_started_false_for_authorization_gate | ERROR | Authorization gate has not started execution. |
| A5-011 | provider_contact_false_for_authorization_gate | ERROR | Authorization gate has no provider contact. |

## E. Human Review Rules

| rule_id | rule_name | severity | required condition |
|---|---|---|---|
| HR-001 | reviewed_output_present | ERROR | Reviewed output path or no-image explanation is present. |
| HR-002 | asset_status_present | ERROR | Asset status is present. |
| HR-003 | accepted_candidate_present | ERROR | Accepted candidate boolean is present. |
| HR-004 | commercial_delivery_ready_present | ERROR | Commercial delivery readiness boolean is present. |
| HR-005 | memory_suitability_present | ERROR | Memory suitability is present and explicit. |
| HR-006 | key_findings_present | ERROR | Key findings, strengths, or watch items are present. |
| HR-007 | local_persistence_verified_present_if_generation_success | ERROR | Successful generation review includes local persistence verification. |
| HR-008 | no_memory_write | ERROR | Memory write is false unless separately authorized. |
| HR-009 | no_accepted_samples_write | ERROR | accepted_samples write is false unless separately authorized. |

## F. Accepted Candidate Evidence Rules

| rule_id | rule_name | severity | required condition |
|---|---|---|---|
| EP-001 | source_output_present | ERROR | Source output path is present. |
| EP-002 | prompt_package_present | ERROR | Prompt package reference is present. |
| EP-003 | asset_status_present | ERROR | Asset status is present. |
| EP-004 | accepted_candidate_true_or_false_explicit | ERROR | Accepted candidate decision is explicit. |
| EP-005 | commercial_delivery_ready_explicit | ERROR | Commercial delivery readiness is explicit. |
| EP-006 | memory_suitability_explicit | ERROR | Memory suitability is explicit. |
| EP-007 | evidence_package_created_true | ERROR | Evidence package creation is explicit. |
| EP-008 | output_image_added_to_git_false | ERROR | Output image added to Git is false. |
| EP-009 | accepted_samples_written_false | ERROR | accepted_samples written is false. |
| EP-010 | memory_write_performed_false | ERROR | Memory write performed is false. |
| EP-011 | production_candidate_002_started_false | ERROR | production_candidate_002 started is false. |

## G. Route-Level Validation Rules

| rule_id | rule_name | severity | required condition |
|---|---|---|---|
| RT-001 | machine_validator_implemented_explicit | ERROR | Machine validator implementation status is explicit. |
| RT-002 | existing_artifacts_migrated_explicit | ERROR | Existing artifact migration status is explicit. |
| RT-003 | provider_contact_false | ERROR | Provider contact is false. |
| RT-004 | image_generation_false | ERROR | Image generation is false. |
| RT-005 | memory_write_false | ERROR | Memory write is false. |
| RT-006 | production_candidate_002_false | ERROR | production_candidate_002 is false. |
| RT-007 | recommended_next_present | ERROR | Recommended next phase is present. |
| RT-008 | next_phase_started_false | ERROR | Next phase started is false at closeout. |

## Legacy Compatibility Cases

```yaml
legacy_compatibility_cases:
  legacy_prompt_package_missing_product_brief_ref:
    severity: WARN
    condition: older prompt package predates product brief ref and has explicit legacy exception
  legacy_review_missing_watch_items:
    severity: WARN
    condition: older review has verdict and rationale but no watch item list
  pre_persistence_guard_review_missing_local_persistence:
    severity: WARN
    condition: review predates local persistence guard and does not claim verified output
  older_evidence_package_accepted_candidate_path:
    severity: WARN
    condition: older evidence package uses accepted_candidate_path but source output is inferable
  any_legacy_record_with_safety_loosened:
    severity: ERROR
    condition: provider/image/memory/production/runtime/output boundary is loosened
```

## Validator Execution Boundary

```yaml
execution_boundary:
  future_validator_must_be_read_only: true
  future_validator_must_not_contact_provider: true
  future_validator_must_not_generate_image: true
  future_validator_must_not_read_env_local: true
  future_validator_must_not_write_memory: true
  future_validator_must_not_modify_artifacts: true
  future_validator_must_not_stage_or_commit: true
```

## Next Implementation Gate Prerequisites

```yaml
implementation_gate_prerequisites:
  rule_specification_created: true
  fixture_matrix_created: true
  implementation_write_set_named: true
  scripts_write_authorization_required: true
  fixture_file_creation_authorization_required: true
  no_dependency_addition_expected: true
  no_package_json_change_expected: true
  legacy_warn_policy_accepted: true
  future_validator_read_only_default: true
```
