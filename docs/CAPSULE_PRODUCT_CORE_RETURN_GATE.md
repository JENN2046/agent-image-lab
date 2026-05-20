# Capsule Product Core Return Gate

```yaml
gate_template:
  phase: capsule_product_core_return_gate
  base_contract: AGENTS.md
  mode: A4.8
  intent: review
  risk_level: R1
  allowed_files:
    - docs/CAPSULE_PRODUCT_CORE_RETURN_GATE.md
    - docs/00_project_roadmap.md
    - .agent_board/CHECKPOINT.md
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
  forbidden_files:
    - runs/
    - asset_archive/**/*.png
    - asset_archive/**/*.jpg
    - asset_archive/**/*.jpeg
    - asset_archive/**/*.webp
  allowed_actions:
    - summarize the closed runs stewardship support branch
    - record that real runs verification remains blocked
    - return the roadmap to capsule product core
    - choose one next product move
  forbidden_actions:
    - actual runs scan
    - runs mutation
    - image binary reads
    - hash or dimensions extraction
    - preview generation
    - cloud-drive read or write
    - provider, plugin, or API call
    - DailyNote or VCP memory write
    - production candidate
  validation:
    required:
      - git status --short --branch
      - git diff --check
      - node scripts/validate_agent_board_state.js
      - scripts/validate-agent-image-lab-local.ps1
    forbidden:
      - runs scan
      - image binary read
      - provider/plugin/API call
      - DailyNote/VCP memory write
  commit:
    allowed: false
    message: null
  push:
    allowed: false
  explicit_non_authorization:
    generation: false
    plugin_call: false
    provider_contact: false
    runtime: false
    memory_write: false
    DailyNote_write: false
```

## Closeout

```yaml
phase: capsule_product_core_return_gate
status: completed_validated
mode: A4.8 review / docs-light
support_branch_closed:
  name: runs_stewardship_support_branch
  closed_as: documentation_and_governance_support_branch
  sealed_commits:
    - 5408b9e docs: define runs backup restore protocol
    - ff5a934 test: add runs backup manifest schema
    - c8a5193 test: add runs restore report dry-run schema
    - 9a55f86 docs: checkpoint runs data stewardship
    - 99539b4 docs: draft runs restore verification authorization
    - 331ed5f docs: close runs restore verification authorization draft
real_runs_verification:
  status: blocked
  reason: the latest authorization package remains draft_not_active and lists only fake project-relative example paths
  future_unblock_requires:
    - explicit real project-relative paths
    - explicit read booleans
    - explicit report output path
    - reviewer and stop conditions
roadmap_return:
  target: capsule_product_core
  state: returned_from_runs_stewardship_support_branch
  product_core_focus: Git-portable accepted/failure capsule evidence, manifest validation, Review Console static contracts, and operator decision surfaces
next_product_move:
  selected: B_capsule_code_debt_audit
  rationale: >-
    After the runs stewardship branch, the safest high-value product move is a
    read-only/docs-light audit of capsule code debt. It can inspect local
    capsule creators, validators, schema bindings, and Review Console static
    contract drift without reading image binaries, mutating runs, or entering
    provider/plugin/runtime paths.
  not_selected:
    A_full_asset_archive_design: useful later, but better after confirming product-core code debt and validator drift
    C_review_console_static_ux_polish: useful later, but lower priority until core capsule contracts and validators are audited
forbidden_actions_performed:
  actual_runs_scan: false
  runs_mutation: false
  image_binary_read: false
  hash_extraction: false
  dimensions_extraction: false
  preview_generation: false
  cloud_drive_read: false
  cloud_drive_write: false
  provider_contact: false
  plugin_call: false
  api_call: false
  DailyNote_write: false
  VCP_memory_write: false
  production_candidate: false
validation:
  - git diff --check: passed
  - node scripts/validate_agent_board_state.js: passed
  - scripts/validate-agent-image-lab-local.ps1: passed_with_manual_review_warnings
  - scripts/validate_mvp.ps1: passed
recommended_next: capsule_code_debt_audit_gate_read_only_docs_light
```
