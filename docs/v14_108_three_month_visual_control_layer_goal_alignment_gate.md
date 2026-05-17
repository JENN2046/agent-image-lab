# V14.108 Three-Month Visual Control Layer Goal Alignment Gate

```yaml
phase: v14_108_three_month_visual_control_layer_goal_alignment_gate
base_contract: AGENTS.md
mode: A4_8_safe_project_operator_rail
intent: local_draft
risk_level: R1
source_instruction: user_goal_2026_05_17
status: completed_validated
```

## Purpose

This gate records the active three-month operating goal:

```text
Agent Image Lab should become the VCP ecosystem visual production control layer.
```

The local route is to keep advancing from a verifiable visual production MVP
toward a controlled system that can later connect to VCPChat and VCPToolBox
through explicit authorization gates.

## Active Route Decision

```yaml
default_generation_route_for_next_three_months: codex_session_image
native_doubao_default_route: false
provider_api_default_route: false
plugin_default_route: false
mcp_default_route: false
```

Codex session image generation remains a session capability and must stay
available. The project should preserve the local import, review, record, and
metadata-registration path around Codex session images without turning it into a
provider API, plugin, or MCP runtime.

## Local Work Now Allowed By Current Goal

```yaml
codex_session_image_generation_by_user_goal: allowed_in_session
prompt_iteration: allowed
internal_review: allowed
local_import_record: allowed
review_record: allowed
agent_board_sync: allowed
local_validation: allowed
accepted_samples_metadata_registration_after_local_review:
  allowed: true
  exact_allowed_files:
    - accepted_samples/accepted_sample_registry.yaml
    - accepted_samples/categories/*.yaml
  image_copy_allowed: false
  runs_source_image_modification_allowed: false
  production_candidate_upgrade_allowed: false
  DailyNote_write_allowed: false
  VCP_memory_write_allowed: false
```

The accepted sample relaxation is metadata-only. It does not authorize copying
or committing image binaries, changing source images under `runs/real_generation`,
promoting a production candidate, or writing memory.

## Hard Stops Still Active

```yaml
failure_samples_write_requires_separate_authorization: true
production_candidate_promotion_requires_separate_authorization: true
DailyNote_write_requires_separate_authorization: true
VCP_memory_write_requires_separate_authorization: true
env_or_env_local_value_read_requires_separate_authorization: true
provider_api_plugin_mcp_requires_separate_authorization: true
real_manifest_read_requires_separate_authorization: true
real_VCPChat_or_VCPToolBox_read_requires_separate_authorization: true
VCPChat_or_VCPToolBox_modification_requires_separate_authorization: true
push_tag_release_deploy_requires_separate_authorization: true
destructive_git_or_filesystem_action_requires_separate_authorization: true
```

## Prompt-To-Artifact Completion Audit

```yaml
goal_component_status:
  pvos_evidence_collector_blocker_pipeline:
    status: present_and_validator_wired
    evidence:
      - kernel/pvos_evidence_collector_blocker_pipeline.js
      - schemas/pvos_evidence_collector_blocker_pipeline.schema.yaml
      - tests/schema_examples/pvos_evidence_collector_blocker_pipeline.example.json
      - scripts/validate_pvos_evidence_collector_blocker_pipeline.js
  EvidenceRecord:
    status: present
    evidence:
      - kernel/evidence_blocker_contract.js
      - schemas/evidence_blocker_contract.schema.yaml
  BlockerDecision:
    status: present
    evidence:
      - kernel/evidence_blocker_contract.js
      - kernel/review_blocker_arbiter.js
  ReviewReport:
    status: present
    evidence:
      - kernel/review_report_contract.js
      - scripts/validate_review_report_contract.js
  memory_delta_draft:
    status: present_as_draft_register
    evidence:
      - tests/schema_examples/review_report_memory_delta_draft_register.example.json
      - scripts/validate_review_report_memory_delta_draft_register.js
  production_exclusion_draft:
    status: present_as_register
    evidence:
      - tests/schema_examples/review_report_production_exclusion_register.example.json
      - scripts/validate_review_report_production_exclusion_register.js
  Review_Console_handoff:
    status: present_display_only
    evidence:
      - review_console/static_prototype/FIELD_MAPPING.md
      - review_console/static_prototype/README.md
  codex_session_image_route:
    status: present_manual_import_contract
    evidence:
      - docs/codex_session_image_provider_minimal_contract.md
      - schemas/codex_session_image_import.schema.yaml
      - scripts/validate_codex_session_image_import.js
  accepted_samples_metadata:
    status: present
    evidence:
      - accepted_samples/accepted_sample_registry.yaml
      - accepted_samples/categories/fashion_lookbook_portrait.yaml
  failure_samples_metadata:
    status: blocked_pending_separate_authorization
    reason: current user goal keeps failure_samples writes behind explicit authorization
  dry_run_vcp_adapter_contract:
    status: present
    evidence:
      - adapters/pvos_kernel_dry_run_adapter.js
      - schemas/pvos_kernel_dry_run_adapter.schema.yaml
  plugin_dispatch_preflight:
    status: present_as_authorization_chain_not_default_generation_route
    evidence:
      - docs/v14_080_pvos_evidence_collector_blocker_A5_authorization_package_draft_gate.md
      - docs/v14_081_pvos_evidence_collector_blocker_exact_A5_authorization_package_gate.md
      - docs/v14_082_pvos_metadata_only_preflight_authorization_correction_gate.md
  manifest_read_authorization_package:
    status: present_in_review_console_embed_contracts
    evidence:
      - review_console/embed_contract/real_vcpchat_read_authorization_request.md
      - review_console/embed_contract/real_vcpchat_read_authorization_fill.md
  DailyNote_VCP_memory_write_authorization_chain:
    status: present_as_blocked_handoff_contracts
    evidence:
      - memory_policy/v1_3_daily_note_handoff_contract.md
      - memory_policy/memory_delta.schema.yaml
  production_candidate_gate:
    status: present_as_blocked_path
    evidence:
      - docs/v9_delivery_readiness_layer_route_selection_gate.md
      - docs/v14_079_review_report_final_local_closeout_gate.md
  rollback_audit_validation_package:
    status: present_but_needs_continuous_stage_evidence
    evidence:
      - scripts/validate_mvp.ps1
      - scripts/validate-agent-image-lab-local.ps1
      - .agent_board/VALIDATION_LOG.md
```

## Current Gap

The main technical pipeline exists. The active gap is operating-state drift:
the `.agent_board` resume surfaces still pointed at the v14.107 accepted sample
closeout as the active local objective. This phase corrects the board direction
so the next cycles select work from the three-month control-layer objective.

## Validation

```text
git diff --check: passed
node scripts/validate_pvos_evidence_collector_blocker_pipeline.js: passed
node scripts/validate_codex_session_image_import.js: passed
node scripts/validate_agent_board_state.js: passed
powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1: passed
powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1: passed_with_existing_manual_review_warnings
```

Verifier result:

```yaml
result: completed_validated
pvos_pipeline_verified: true
codex_session_image_route_preserved: true
agent_board_current_phase_verified: true
prompt_to_artifact_audit_completed: true
external_or_high_risk_action_performed: false
```

## Next Council Cycle

```yaml
commander_decision:
  next_safe_cycle: accepted_samples_metadata_policy_validator_alignment
  reason: >
    The PVOS pipeline and Codex session image route validated under the new
    goal boundary. The next useful local step is to align accepted_samples
    metadata-only automation with validators without touching images or
    production_candidate state.
domain_leads_queue:
  - validate PVOS evidence collector + blocker pipeline against approved fixtures
  - verify Codex session image route remains available and not replaced
  - verify accepted_samples metadata-only path is separated from production_candidate
worker_scope:
  allowed:
    - local docs
    - local validators
    - .agent_board sync
  forbidden:
    - provider/API/plugin/MCP
    - env value reads
    - DailyNote or VCP memory writes
    - production_candidate promotion
    - push/tag/release/deploy
verifier_scope:
  required_validation:
    - git diff --check
    - accepted_samples registry/category metadata validation
    - node scripts/validate_agent_board_state.js
    - powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
    - powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1
```

## Explicit Non-Authorization

```yaml
provider_contact: false
plugin_call: false
api_call: false
mcp_runtime: false
image_generation_by_project_script: false
env_value_read: false
real_manifest_read: false
real_VCPChat_read: false
real_VCPToolBox_read: false
DailyNote_write: false
VCP_memory_write: false
failure_samples_write: false
production_candidate_write: false
image_binary_copy_or_commit: false
push_tag_release_deploy: false
```
