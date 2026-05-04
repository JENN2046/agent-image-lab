# v0.9 Photo Studio OS Retry Authorization Gate

This file is a retry gate for the next Photo Studio OS real execution. It does
not authorize a plugin call by itself.

## Current Decision

```yaml
retry_gate:
  phase: v0.9_retry_authorization_gate
  previous_execution_status: completed_validated_with_visual_rejection
  previous_max_plugin_calls_consumed: true
  retry_allowed_without_new_authorization: false
  selected_plugin_for_retry: null
  max_plugin_calls_authorized: 0
  real_execution_allowed: false
  daily_note_direct_write_allowed: false
```

## Required User Authorization

The next retry requires a separate user message with concrete values:

```yaml
required_retry_authorization:
  selected_plugin_id: DoubaoGen
  max_plugin_calls: 1
  input_reference: "<safe concrete prompt; must explicitly exclude people, faces, portraits, logos, brands, private data>"
  output_directory_ref: "runs/photo_studio_os_v0_9_retry"
  overwrite_existing_files_allowed: false
  rollback_plan: "delete only files created under the retry output directory; keep sanitized records; do not edit config; do not write DailyNote"
  gatekeeper_approved: true
  review_console_human_approved: true
  daily_note_direct_write_allowed: false
  memory_delta_only: true
```

## Recommended Prompt Constraints

```yaml
prompt_constraints:
  must_include:
    - product still life
    - bright photography studio
    - no people
    - no face
    - no portrait
    - no human body
    - no brand
    - no logo
    - clean project-cover composition
  must_not_include:
    - person
    - model
    - portrait
    - face
    - celebrity
    - brand name
    - private data
```

## Stop Conditions

```yaml
stop_conditions:
  missing_concrete_input_reference: true
  missing_output_directory_ref: true
  max_plugin_calls_not_exactly_one: true
  overwrite_requested: true
  daily_note_direct_write_requested: true
  real_call_without_gatekeeper_or_review_console_approval: true
```

