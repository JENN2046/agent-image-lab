# Prompt Schema Machine Validator Rule Inventory

```yaml
inventory_id: prompt_schema_machine_validator_rule_inventory_v1
source_phase: v12_002_prompt_schema_machine_validator_implementation_planning_gate
source_plan: docs/prompt_schema_machine_validator_implementation_plan.md
machine_validator_implemented: false
fixture_files_created: false
scripts_modified: false
```

This inventory lists future validator rules. It is not executable and does not create any validator implementation.

## Rule Inventory

| rule_id | schema | check | severity for new artifacts | legacy posture |
|---|---|---|---|---|
| PP-YAML-001 | prompt package | `prompt: |` is an independent line | fail | warn if older package has usable `prompt` but no canonical literal block |
| PP-YAML-002 | prompt package | `positive_prompt: |` is an independent line | fail | warn for older package without alias if runner `prompt` exists |
| PP-YAML-003 | prompt package | `negative_prompt: |` is an independent line | fail | fail if missing negative safety content in active package |
| PP-SYNC-001 | prompt package | `prompt` and `positive_prompt` are synchronized | fail | warn if alias absent in older package |
| PP-MAP-001 | prompt package | runner-facing canonical prompt field exists and maps to `prompt` | fail | fail |
| PP-ID-001 | prompt package | `product_identity` exists | fail | warn only for known old fixture records |
| PP-ID-002 | prompt package | `selected_product` exists | fail | warn only for known old fixture records |
| PP-STRUCT-001 | prompt package | `locked_structure` exists | fail | warn only for known old fixture records |
| PP-BRIEF-001 | prompt package | `product_brief_ref` exists or explicit legacy exception is recorded | fail | warn for ceramic mug legacy lane |
| PP-MAT-001 | prompt package | `material_constraints` exists | fail | warn only for known old fixture records |
| PP-STRUCT-002 | prompt package | `structure_constraints` exists | fail | warn only for known old fixture records |
| PP-SCENE-001 | prompt package | `scene_constraints` exists | fail | warn only for known old fixture records |
| PP-FORBID-001 | prompt package | `forbidden_elements` exists | fail | fail if text/logo/person/material/shape drift boundary is absent |
| PP-ACCEPT-001 | prompt package | `acceptance_criteria` exists | fail | warn for older planning docs only |
| PP-HRC-001 | prompt package | `human_review_checklist` exists | fail | warn for older packages |
| PB-ID-001 | product brief | product name/category/direction exist | fail | warn for legacy route without dedicated brief |
| PB-LOCK-001 | product brief | identity lock exists | fail | warn for legacy route without dedicated brief |
| PB-LOCK-002 | product brief | structure lock exists | fail | warn for legacy route without dedicated brief |
| PB-MAT-001 | product brief | material/texture constraints exist | fail | warn for legacy route without dedicated brief |
| PB-SCENE-001 | product brief | scene/composition boundary exists | fail | warn for legacy route without dedicated brief |
| PB-TEXT-001 | product brief | label/text/logo policy exists | fail | warn for legacy route without dedicated brief |
| SR-TARGET-001 | static review | review target path and type exist | fail | warn for historical review records only |
| SR-FIND-001 | static review | source findings are recorded | fail | warn for older reviews |
| SR-CHECK-001 | static review | checklist with evidence exists | fail | warn for older reviews |
| SR-AUTH-001 | static review | authorization boundary records provider/image/memory/production false | fail | fail if any boundary is loosened |
| A5-SEP-001 | A5 authorization | authorization draft, execution confirmation, and execution closeout are not collapsed | fail | warn for older docs if execution state is still clear |
| A5-BUDGET-001 | A5 authorization | provider_calls_max = 1 | fail | fail |
| A5-BUDGET-002 | A5 authorization | generation_attempts_max = 1 | fail | fail |
| A5-BUDGET-003 | A5 authorization | auto_retry = false | fail | fail |
| A5-SECRET-001 | A5 authorization | secret read boundary is false unless execution confirmation explicitly allows it | fail | fail |
| A5-PERSIST-001 | A5 authorization | success requires verified local file | fail | warn only before v8.030 historical guard |
| HR-LINEAGE-001 | human review | reviewed output and prompt/product lineage exist | fail | warn for older reviews |
| HR-PERSIST-001 | human review | local persistence fields exist where post-guard output is reviewed | fail | warn for pre-guard historical reviews |
| HR-DECISION-001 | human review | accepted_candidate is separate from commercial_delivery_ready | fail | fail |
| HR-MEM-001 | human review | memory_suitability is explicit and not auto-inferred | fail | fail |
| HR-WATCH-001 | human review | watch items or remaining risks exist | fail | warn for older reviews |
| EP-SOURCE-001 | evidence package | source_output exists | fail | warn if older package uses accepted_candidate_path |
| EP-PROMPT-001 | evidence package | prompt_package exists | fail | warn if older package uses source_prompt_package |
| EP-HR-001 | evidence package | accepted candidate decision is backed by human review | fail | fail |
| EP-DELIVERY-001 | evidence package | commercial_delivery_ready is separate from accepted_candidate | fail | fail |
| EP-MEM-001 | evidence package | memory_suitability and memory write boundary are explicit | fail | fail |
| EP-OUTPUT-001 | evidence package | runs_output_committed is false | fail | fail |
| EP-SAMPLES-001 | evidence package | accepted_samples_written is false unless separately authorized | fail | fail |
| ROUTE-SEV-001 | route strategy | fail/warn/info severity model exists | fail | warn only for pre-V11 docs |
| ROUTE-NEXT-001 | route strategy | risky next step has auto_execution_allowed false | fail | fail |
| GLOBAL-A4-001 | all A4.8 docs | provider_contact_allowed/provider_contact is false | fail | fail |
| GLOBAL-A4-002 | all A4.8 docs | image_generation_allowed/image_generation is false | fail | fail |
| GLOBAL-A4-003 | all A4.8 docs | memory_write is false unless separately authorized | fail | fail |
| GLOBAL-A4-004 | all A4.8 docs | production_candidate_002 is false | fail | fail |
| GLOBAL-A4-005 | all A4.8 docs | runtime_execution is false | fail | fail |
| GLOBAL-OUTPUT-001 | all docs | runs output is not committed | fail | fail |
| GLOBAL-SAMPLES-001 | all docs | accepted_samples write is not performed | fail | fail |

## Future Fixture Matrix

```yaml
fixture_matrix:
  positive_cases:
    prompt_package_complete: should_pass
    product_brief_complete: should_pass
    static_review_complete: should_pass
    A5_authorization_draft_complete_no_execution: should_pass
    human_review_complete_not_commercial_ready: should_pass
    evidence_package_complete_no_output_commit: should_pass
  negative_cases:
    prompt_missing_literal_block: should_fail
    positive_prompt_embedded_inside_prompt: should_fail
    prompt_positive_mismatch: should_fail
    negative_prompt_missing: should_fail
    missing_selected_product: should_fail
    missing_locked_structure: should_fail
    provider_contact_true_in_A4_doc: should_fail
    image_generation_true_in_A4_doc: should_fail
    memory_suitability_auto_inferred: should_fail
    accepted_candidate_equals_commercial_delivery_ready: should_fail
    runs_output_committed_true: should_fail
    accepted_samples_written_true_without_auth: should_fail
    A5_retry_allowed: should_fail
  legacy_warning_cases:
    ceramic_mug_missing_dedicated_brief: should_warn
    pre_guard_human_review_missing_local_persistence: should_warn
    older_evidence_package_accepted_candidate_path: should_warn
```

## Non-Goals For Future Validator

```yaml
non_goals:
  provider_contact: false
  image_generation: false
  prompt_quality_scoring: false
  model_output_judgment: false
  memory_write: false
  DailyNote_write: false
  production_candidate_promotion: false
  commercial_delivery_execution: false
  artifact_migration: false
  automatic_rewrite_or_autofix: false
```
