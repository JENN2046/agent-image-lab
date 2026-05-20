# Capsule Code Debt Audit

```yaml
gate_template:
  phase: capsule_code_debt_audit_gate_read_only_docs_light
  base_contract: AGENTS.md
  mode: A4.8
  intent: review
  risk_level: R1
  allowed_files:
    - docs/CAPSULE_CODE_DEBT_AUDIT.md
    - .agent_board/CHECKPOINT.md
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
  forbidden_files:
    - scripts/**/*.js
    - scripts/**/*.ps1
    - schemas/**/*.yaml
    - review_console/static_prototype/**
    - runs/**
    - asset_archive/**/*.png
    - asset_archive/**/*.jpg
    - asset_archive/**/*.jpeg
    - asset_archive/**/*.webp
  allowed_actions:
    - inspect capsule creators
    - inspect validators
    - inspect schema/runtime binding drift
    - inspect Review Console static contracts
    - inspect validate_mvp.ps1 growth
    - produce code debt audit and fix order
  forbidden_actions:
    - code changes
    - actual runs scan
    - runs mutation
    - image binary reads
    - hash or dimensions extraction
    - preview generation
    - provider/plugin/API call
    - DailyNote/VCP memory write
    - production candidate
  commit:
    allowed: false
    message: null
  push:
    allowed: false
```

## Scope Inspected

```yaml
inspected_surfaces:
  capsule_creators:
    - scripts/create_preview_capsule.js
    - scripts/create_failure_sample_capsule.js
  capsule_registry_and_manifest:
    - scripts/lib/accepted_sample_registry_source.js
    - scripts/lib/capsule_manifest_contract.js
    - schemas/capsule_manifest_contract.schema.yaml
    - scripts/validate_preview_capsule_registry.js
    - scripts/validate_failure_sample_capsule_registry.js
    - scripts/validate_capsule_manifest_contract.js
    - scripts/validate_capsule_manifest_schema_runtime_binding.js
    - scripts/validate_capsule_registry_report_v2.js
    - scripts/validate_capsule_registry_report_v2_negative_states.js
  review_console_static_contracts:
    - review_console/static_prototype/app.js
    - review_console/static_prototype/mock_data.js
    - review_console/static_prototype/README.md
    - review_console/static_prototype/FIELD_MAPPING.md
    - review_console/static_prototype/SCHEMA_BINDING.md
    - review_console/static_prototype/HANDOFF_CONTRACT.md
  aggregate_validation:
    - scripts/validate_mvp.ps1
    - package.json
read_only_boundaries:
  actual_runs_scan_performed: false
  runs_mutation_performed: false
  image_binary_read_performed: false
  hash_extraction_performed: false
  dimensions_extraction_performed: false
  preview_generation_performed: false
  provider_contact_performed: false
  plugin_call_performed: false
  api_call_performed: false
  DailyNote_write_performed: false
  VCP_memory_write_performed: false
  production_candidate_write_performed: false
```

## Size Signals

```yaml
line_counts_observed:
  scripts/create_preview_capsule.js: 268
  scripts/create_failure_sample_capsule.js: 343
  scripts/lib/capsule_manifest_contract.js: 219
  scripts/validate_capsule_registry_report_v2.js: 402
  scripts/validate_mvp.ps1: 12083
  review_console/static_prototype/app.js: 3282
  review_console/static_prototype/mock_data.js: 2109
  review_console/static_prototype/README.md: 225
  review_console/static_prototype/FIELD_MAPPING.md: 674
  review_console/static_prototype/SCHEMA_BINDING.md: 90
```

## Findings

### P1-1: Capsule creator duplication

`scripts/create_preview_capsule.js` and
`scripts/create_failure_sample_capsule.js` both implement repository path
guards, CLI argument parsing, `writeJson`, `sha256File`, temp target cleanup,
plan-only output, `--confirm-create=true`, sharp-based WebP creation, manifest
writing, and final temp-dir rename.

The current behavior is deliberately guarded and useful, but the duplication
raises maintenance risk: future safety fixes must be patched twice, and the
accepted/failure lanes may drift in guard field names, manifest layout, temp
path rules, or preview validation behavior.

Fix direction:

```yaml
recommended_fix:
  id: capsule_creator_shared_utils_gate
  type: local_code_refactor_later
  scope:
    - extract shared repo path guard
    - extract CLI arg helpers
    - extract temp target lifecycle
    - extract preview WebP creation and metadata verification
    - extract common guard false object
  preserve:
    - plan-only default
    - explicit --confirm-create=true write gate
    - target directory already exists fail-closed behavior
    - temp-dir then rename behavior
  requires_later_authorization: true
```

### P1-2: Registry parsing is uneven across lanes

Accepted sample loading uses `yaml` through
`scripts/lib/accepted_sample_registry_source.js`. Failure sample creation still
uses string block extraction and scalar/list regex parsing inside
`scripts/create_failure_sample_capsule.js`.

That means the accepted lane has structured registry parsing while the failure
lane remains more fragile around indentation, nested fields, comments, and
future schema growth.

Fix direction:

```yaml
recommended_fix:
  id: failure_registry_yaml_parser_alignment_gate
  type: local_code_refactor_later
  scope:
    - create scripts/lib/failure_sample_registry_source.js
    - parse failure_samples/failure_registry.yaml with YAML.parse
    - expose duplicate failure_id checks
    - reuse typed row extraction in creator and validators
  requires_later_authorization: true
```

### P1-3: MVP validator is a monolith

`scripts/validate_mvp.ps1` is 12083 lines. Capsule checks appear near the end of
the file, including manifest contract, registry report v2, negative states,
static smoke fixture, Review Console snapshot, runs backup/restore schemas, and
operator checklist/action matrix checks.

The validator still passes, but its size makes every product-core change harder
to review. It also increases the chance that unrelated project phases touch the
same large file and create merge or audit friction.

Fix direction:

```yaml
recommended_fix:
  id: capsule_mvp_validator_slice_gate
  type: local_code_refactor_later
  scope:
    - add a capsule-focused validation helper script
    - move only capsule/product-core aggregate calls out of validate_mvp.ps1
    - keep validate_mvp.ps1 as the top-level orchestrator
    - preserve exact output semantics and existing pass/fail behavior
  requires_later_authorization: true
```

### P2-1: Package scripts do not expose the full capsule product core

`package.json` exposes preview capsule creation and accepted preview capsule
validation. It does not expose failure capsule creator checks, manifest contract
validation, registry report v2, or Review Console capsule contract validators as
npm scripts.

This is not a runtime bug because the validators can still be run directly and
`validate_mvp.ps1` includes the project gate. It is a usability and handoff debt:
new contributors have to know script names by memory or search.

Fix direction:

```yaml
recommended_fix:
  id: capsule_npm_script_index_gate
  type: package_script_patch_later
  scope:
    - add read-only validation script aliases
    - do not add dependencies
    - do not change lockfiles unless package manager requires it
  requires_later_authorization: true
```

### P2-2: Schema/runtime binding exists, but is custom and narrow

`schemas/capsule_manifest_contract.schema.yaml` is bound to
`scripts/lib/capsule_manifest_contract.js` by
`scripts/validate_capsule_manifest_schema_runtime_binding.js`. The binding checks
the runtime arrays and expected fields, but it is not a general manifest schema
validator.

This is acceptable for the current compact contract. The risk is future drift:
new manifest fields can be added to examples, creators, or validators without a
single schema-enforced shape gate.

Fix direction:

```yaml
recommended_fix:
  id: capsule_manifest_schema_validation_depth_gate
  type: validation_design_or_code_later
  scope:
    - decide whether current YAML contract remains a compact binding contract
    - or add a real JSON/YAML schema validation layer for manifest examples
    - keep no image binary read and no preview generation boundaries
  requires_later_authorization: true
```

### P2-3: Review Console static contract surface is very large

`review_console/static_prototype/app.js` is 3282 lines and
`mock_data.js` is 2109 lines. The static surface now holds artifact lifecycle,
recoverability matrix, schema binding coverage, registry report v2, negative
visibility, unified capsule contract report, failure state workbench, and older
review report handoff surfaces.

The static prototype remains properly isolated and no-execution, but the surface
is becoming hard to reason about as one file pair. Future UX polish should not
start until the product-core state modules and snapshots are easier to isolate.

Fix direction:

```yaml
recommended_fix:
  id: review_console_static_contract_slicing_gate
  type: static_refactor_later
  scope:
    - split capsule dashboard state/render helpers from app.js
    - split review report legacy handoff helpers separately
    - preserve static-only and no-fetch/no-write behavior
    - keep snapshot validators passing
  requires_later_authorization: true
```

### P3-1: Status taxonomy is spread across validators

Capsule status strings and failure classes appear in creator output, registry
validators, manifest contract validation, registry report v2, Review Console
state validators, and MVP checks. Examples include registry-driven preview
capsule states, Git-portable preview evidence states, manifest contract states,
negative classes, and operator action labels.

The current strings are validated, but they are distributed enough that future
status additions could require many hand edits.

Fix direction:

```yaml
recommended_fix:
  id: capsule_status_taxonomy_index_gate
  type: docs_or_light_code_later
  scope:
    - create one capsule status taxonomy index
    - map validator output status strings to Review Console fields
    - identify which strings are public contract versus internal validator detail
  requires_later_authorization: true
```

## Recommended Fix Order

```yaml
fix_order:
  - order: 1
    task_id: capsule_mvp_validator_slice_gate
    reason: reduce the highest-review-friction file before more capsule product work
    risk: medium
    code_change_required: true
  - order: 2
    task_id: capsule_creator_shared_utils_gate
    reason: remove duplicated safety-critical creator behavior across accepted/failure lanes
    risk: medium
    code_change_required: true
  - order: 3
    task_id: failure_registry_yaml_parser_alignment_gate
    reason: align failure registry parsing with accepted registry structured YAML parsing
    risk: medium
    code_change_required: true
  - order: 4
    task_id: capsule_status_taxonomy_index_gate
    reason: make future schema/runtime/UI changes cheaper and safer to review
    risk: low
    code_change_required: false_or_light
  - order: 5
    task_id: capsule_manifest_schema_validation_depth_gate
    reason: decide whether current binding contract is enough before adding more manifest fields
    risk: medium
    code_change_required: maybe
  - order: 6
    task_id: review_console_static_contract_slicing_gate
    reason: defer larger static UI refactor until validation and creator debt are reduced
    risk: medium_high
    code_change_required: true
```

## Decision

```yaml
phase: capsule_code_debt_audit_gate_read_only_docs_light
status: completed_validated
decision: product_core_debt_identified_without_code_changes
highest_priority_next: capsule_mvp_validator_slice_gate
why_not_asset_archive_design_next: code debt in creators and validators should be reduced before expanding the archive design
why_not_review_console_ux_polish_next: static UI surface is large and should be sliced after validation debt is reduced
recommended_next: capsule_mvp_validator_slice_gate_docs_first_or_authorized_code_refactor
next_phase_started: false
validation:
  - git diff --check: passed
  - node scripts/validate_agent_board_state.js: passed
  - scripts/validate-agent-image-lab-local.ps1: passed_with_manual_review_warnings
  - scripts/validate_mvp.ps1: passed
```

## Boundary Confirmation

```yaml
code_changes_performed: false
actual_runs_scan_performed: false
runs_mutation_performed: false
image_binary_read_performed: false
hash_extraction_performed: false
dimensions_extraction_performed: false
preview_generation_performed: false
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
production_candidate_write_performed: false
push_tag_release_deploy_performed: false
```
