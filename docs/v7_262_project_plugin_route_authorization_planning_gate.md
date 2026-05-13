# v7.262 Project Plugin Route Authorization Planning Gate

中文：项目内插件路线授权规划门。

```yaml
base_contract: AGENTS.md
phase: v7.262_project_plugin_route_authorization_planning_gate
mode: A4
intent: planning
risk_level: R1
source_commit: f947582
source_phase: v7.261_human_product_route_selection_request_gate
human_selection_interpreted: use_project_plugin_route_for_planning
current_status: failed_no_image_repeated_quota_or_rate_limit
selected_planning_route: project_plugin_route
candidate_project_plugin: NativeDoubaoImage
automatic_generation_allowed_now: false
A5_execution_allowed_now: false
provider_contact_allowed_now: false
plugin_call_allowed_now: false
image_generation_allowed_now: false
memory_write_allowed_now: false
```

## Executive Verdict

```yaml
overall_status: pass
project_plugin_route_planned: true
candidate_plugin_profile_reviewed: true
authorization_gap_identified: true
same_provider_retry_allowed_now: false
generation_retry_allowed_now: false
provider_contact_allowed_now: false
recommended_next_phase: v7.263_project_plugin_A5_authorization_package_draft_gate
auto_execution_allowed_for_next_phase: false
```

This gate does not call the project plugin.
This gate does not contact Doubao or any provider.
This gate does not generate an image.
This gate does not read `.env.local` values.
This gate does not authorize A5 execution.

## Plain Meaning

The owner selected the project plugin route for planning. In practical terms, this means the next paper lane should prepare the project-local plugin path for a future authorization package.

It does not mean:

- run `NativeDoubaoImage`
- call Doubao
- retry the same provider/model/account path
- read secrets
- write files under `runs/`
- create an image

## Candidate Project Plugin

```yaml
candidate_plugin:
  plugin_id: NativeDoubaoImage
  plugin_name: Native Doubao Image Plugin
  provider_type: direct_api
  command: generate
  mode: text_to_image
  required_model: doubao-seedream-5-0-260128
  prompt_root: prompts/image_generation/
  output_root: runs/real_generation/
  max_plugin_calls: 1
  max_images_created: 1
  retry_allowed: false
  real_execution_requires_a5: true
```

The plugin is project-local. Planning may reference its checked-in profile and placeholder config. Real execution still needs A5 authorization and a passing preflight.

## Current Blocker

```yaml
current_blocker:
  status: failed_no_image_repeated_quota_or_rate_limit
  same_provider_retry_allowed_now: false
  reason: >
    The latest Doubao diagnostic attempts consumed authorized calls and returned
    quota_or_rate_limit without generating an image.
```

If the project plugin route uses the same Doubao provider/model/account path, activation remains blocked until the quota/rate-limit condition is resolved outside Codex and the owner explicitly authorizes a new A5 attempt.

## Route Variants

```yaml
route_variants:
  variant_a_same_plugin_after_quota_resolution:
    meaning_zh: 外部解决 quota/rate-limit 后，继续使用项目内 NativeDoubaoImage
    A5_required: true
    provider_contact_required: true
    allowed_now: false

  variant_b_same_plugin_different_model_or_account:
    meaning_zh: 仍使用项目内插件，但切换 model/account/path
    A5_required: true
    provider_contact_required: true
    compatibility_review_required: true
    allowed_now: false

  variant_c_authorization_package_draft_only:
    meaning_zh: 只写未来 A5 授权包草案，不执行
    A4_docs_only_possible: true
    plugin_call_required: false
    provider_contact_required: false
    recommended_next: true
```

## Future A5 Authorization Fields

A future A5 package must explicitly name:

```yaml
required_future_authorization_fields:
  - authorization_package_id
  - selected_project_plugin_id
  - selected_plugin_command
  - selected_model
  - provider_path_status
  - quota_or_rate_limit_resolution_evidence
  - prompt_package_ref
  - generation_plan_ref
  - max_plugin_calls
  - max_images_created
  - retry_limit
  - output_directory_ref
  - overwrite_existing_files_allowed
  - raw_stdout_stderr_retention_policy
  - raw_provider_payload_retention_policy
  - env_value_handling_policy
  - public_result_redaction_policy
  - failure_stop_conditions
  - post_run_cleanup_requirements
  - human_review_handoff
  - memory_write_allowed
```

Minimum safe defaults:

```yaml
future_safe_defaults:
  selected_project_plugin_id: NativeDoubaoImage
  selected_plugin_command: generate
  max_plugin_calls: 1
  max_images_created: 1
  retry_limit: 0
  overwrite_existing_files_allowed: false
  raw_stdout_stderr_retention_policy: forbidden
  raw_provider_payload_retention_policy: forbidden
  env_value_handling_policy: field_names_only_until_A5_preflight
  memory_write_allowed: false
```

## Preflight Requirements Before Any Plugin Call

```yaml
preflight_required_before_plugin_call:
  - worktree_clean
  - branch_and_origin_checked
  - active_A5_authorization_package_exists
  - authorization_names_NativeDoubaoImage_or_selected_project_plugin
  - quota_or_rate_limit_resolution_or_new_path_selected
  - prompt_package_ref_inside_prompts_image_generation
  - output_directory_inside_runs_real_generation
  - max_plugin_calls_equals_1
  - max_images_created_equals_1
  - retry_limit_equals_0
  - raw_output_retention_forbidden
  - memory_write_forbidden
  - failure_stop_conditions_accepted
```

## Explicit Non-Authorization

```yaml
not_authorized_by_v7_262:
  A5_execution: false
  provider_contact: false
  plugin_call: false
  image_generation: false
  output_write: false
  memory_write: false
  DailyNote_write: false
  runtime_execution: false
  VCPChat_runtime: false
  VCPToolBox_runtime: false
  real_manifest_read: false
  env_local_value_read: false
  cdp_access: false
  bridge_methods: false
  mcp_calls: false
  tag_release_deploy: false
```

## Recommended Next Phase

```yaml
recommended_next:
  phase: v7.263_project_plugin_A5_authorization_package_draft_gate
  中文: 项目内插件 A5 授权包草案门
  type: A4_docs_only
  purpose: >
    Draft, but do not activate, the exact A5 authorization package that would be
    required before any project plugin generation attempt.
  auto_execution_allowed: false
```

## Closeout Template

```yaml
closeout:
  phase: v7.262_project_plugin_route_authorization_planning_gate
  project_plugin_route_planned: true
  candidate_project_plugin: NativeDoubaoImage
  plugin_call_performed: false
  provider_contact_performed: false
  image_generation_performed: false
  A5_execution_performed: false
  recommended_next:
    phase: v7.263_project_plugin_A5_authorization_package_draft_gate
    auto_execution_allowed: false
  final_state:
    next_phase_started: false
```
