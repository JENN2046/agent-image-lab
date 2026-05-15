# v14.003 Review Console Information Architecture Gate

```yaml
phase: v14_003_review_console_information_architecture_gate
base_contract: AGENTS.md
mode: A4.8
intent: planning
risk_level: R2
source_phase: v14_002_review_console_productization_planning_gate
source_commit: e172e5a25bcdb4ea95cc9f9dece39cdec5082a27
selected_route: review_console_productization_planning
commit_message: "docs: define review console information architecture"
```

## Purpose

This docs-only gate turns the V14 Review Console productization plan into a
future implementation-ready information architecture. It defines page
structure, navigation structure, data blocks, status display rules, safety
boundaries, and example asset coverage.

This phase does not implement UI, create frontend files, modify runtime,
contact a provider, generate images, retry, read `.env.local`, write memory,
write `accepted_samples/`, copy or commit `runs/` output, execute real retouch,
create derivative images, execute commercial delivery, or start
`production_candidate_002`.

## Source State

```yaml
source_phase: v14_002_review_console_productization_planning_gate
source_commit: e172e5a25bcdb4ea95cc9f9dece39cdec5082a27
selected_route: review_console_productization_planning
productization_plan_created: true
productization_plan: docs/review_console_productization_plan_v14.md
UI_implementation_started: false
runtime_execution: false
provider_contact: false
image_generation: false
memory_write: false
accepted_samples_written: false
```

## Information Architecture Document

```yaml
information_architecture: docs/review_console_information_architecture_v14.md
```

The IA document defines:

- Review Console page structure
- navigation structure
- core information blocks
- status taxonomy mapping
- existing asset examples
- observation and decision boundary
- future authorization requirements

## Required Coverage

```yaml
page_structure_defined: true
navigation_structure_defined: true
core_information_blocks_defined: true
asset_status_taxonomy_mapped: true
existing_asset_examples_covered: true
Review_Console_is_observation_and_decision_surface: true
```

## Explicit Non-Authorization

```yaml
UI_implementation_started: false
runtime_execution: false
frontend_files_created: false
provider_contact: false
image_generation: false
retry: false
env_local_secret_value_read: false
memory_write: false
accepted_samples_written: false
runs_output_committed: false
real_retouch_execution: false
derivative_image_created: false
real_commercial_delivery_execution: false
production_candidate_002: false
```

## Closeout

```yaml
closeout:
  phase: v14_003_review_console_information_architecture_gate
  commit_message: "docs: define review console information architecture"
  branch: master
  source_commit: e172e5a25bcdb4ea95cc9f9dece39cdec5082a27
  information_architecture:
    selected_route: review_console_productization_planning
    information_architecture_created: true
    information_architecture_path: docs/review_console_information_architecture_v14.md
    page_structure_defined: true
    navigation_structure_defined: true
    core_information_blocks_defined: true
    asset_status_taxonomy_mapped: true
    existing_asset_examples_covered: true
    Review_Console_is_observation_and_decision_surface: true
    UI_implementation_started: false
    runtime_execution: false
  safety:
    provider_contact: false
    image_generation: false
    retry: false
    env_local_secret_value_read: false
    memory_write: false
    accepted_samples_written: false
    runs_output_committed: false
    real_retouch_execution: false
    derivative_image_created: false
    real_commercial_delivery_execution: false
    production_candidate_002: false
    scripts_modified: false
    package_json_modified: false
    prompt_package_modified: false
    frontend_files_created: false
  recommended_next:
    phase: v14_004_review_console_wireframe_and_data_contract_gate
    auto_execution_allowed: true
  final_state:
    next_phase_started: false
```
