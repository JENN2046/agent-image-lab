# Capsule Operator Surface Closeout

```yaml
phase: capsule_operator_surface_closeout_gate
base_contract: AGENTS.md
mode: A4.8 review / docs-light
status: completed_validated
sealed_remote_head: 9dedc70
sealed_operator_surfaces:
  unified_smoke_fixture:
    commit: 37a9bb1
    surface: unified_capsule_contract_report checked-in fixture
  review_console_snapshot:
    commit: 3f8a8a7
    surface: Review Console static mock consumes smoke fixture shape
  baseline_closeout:
    commit: b9bc5b8
    surface: accepted/failure static smoke baseline summary
  reviewer_action_matrix:
    commit: 8b5aed1
    surface: static human operator action matrix
  checklist_ui_mapping:
    commit: 9dedc70
    surface: operator_reviewer_checklist_state static checklist field
current_capability:
  accepted: 2
  failure: 2
  total: 4
  summary:
    - Review Console static state can show unified capsule contract totals and per-capsule status.
    - Reviewer actions are represented as human checklist text, not executable UI controls.
    - Fail-closed states remain visible for manifest, relation, guard, and stale-validator cases.
remaining_hard_boundaries:
  runtime: false
  executable_ui_buttons: false
  browser_validator: false
  asset_archive_ui_read: false
  preview_load: false
  capsule_creation: false
  provider_plugin_api: false
  image_generation: false
  DailyNote_or_VCP_memory: false
  production_candidate: false
next_move_decision:
  selected: A_runs_backup_restore_protocol
  rejected:
    B_full_asset_archive_design: "Premature before runs ownership, backup, and restore rules are explicit."
    C_pause_and_code_debt_audit: "Useful later, but current operator surface has no active validation failure and the next risk is data stewardship."
  rationale: >
    The operator-facing static surfaces are now sealed. The highest-leverage next product move is a
    no-runtime, no-mutation backup/restore protocol for user-owned runs data, especially because runs
    recovery has been part of the recent workflow. This should remain protocol-only until separately authorized.
recommended_next_phase:
  phase: capsule_runs_backup_restore_protocol_gate
  mode: A4.8 docs/protocol only
  objective: define how restored runs data is named, backed up, checked, and handed off without reading image binaries, mutating runs, generating previews, calling providers, writing memory, or promoting production.
  validated_now: git diff --check; node scripts/validate_agent_board_state.js; powershell -ExecutionPolicy Bypass -File scripts\\validate-agent-image-lab-local.ps1
```
