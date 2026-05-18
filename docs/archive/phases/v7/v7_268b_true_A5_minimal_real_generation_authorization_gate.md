# v7.268b True A5 Minimal Real Generation Authorization Gate

中文：真正 A5 最小真实生成试跑授权门。

```yaml
phase: v7.268b_true_A5_minimal_real_generation_authorization_gate
base_contract: AGENTS.md
mode: A5_authorization_gate
intent: remote_or_side_effectful_action
risk_level: R4
source_phase: v7.268a_prompt_package_yaml_parse_check
source_result: prompt_package_yaml_parse_passed
authorization_package_id: AUTH-A5-MIN-REAL-GEN-20260513-001
authorization_status: active_for_v7_269_only
commit_allowed: true
push_allowed_after_safety_gate: true
```

## Plain Meaning

```text
本门只授权一次最小真实生成试跑。
它不是全面开放 A5。
它不是第二批生成。
它不是 production_candidate_002、Batch 005、DailyNote 或 VCP memory。
v7.269 执行后必须立即停止，等待人工 review。
```

## Authorization Boundary

```yaml
authorization:
  route_B_selected: true
  minimal_real_generation_trial_authorized: true
  approved_product: matte_ceramic_mug
  approved_prompt_package: prompts/image_generation/product_still_life_matte_ceramic_mug_v1.yaml
  provider_path: current_project_established_generation_path_only
  output_directory: runs/real_generation/v7_269_matte_ceramic_mug_trial/
  provider_calls_max: 1
  generation_attempts_max: 1
  output_images_max: 4
  auto_retry: false
  memory_write: false
  DailyNote_write: false
  VCP_memory_write: false
  automatic_next_batch: false
  stop_after_generation: true
  human_review_required_after_generation: true
```

## v7.269 Only Execution Scope

```yaml
v7_269_allowed_once:
  provider_contact: true
  image_generation: true
  output_directory_creation: true
  save_outputs_under_authorized_directory: true
  run_level_closeout_record: true

  prompt_package_must_equal: prompts/image_generation/product_still_life_matte_ceramic_mug_v1.yaml
  output_directory_must_equal: runs/real_generation/v7_269_matte_ceramic_mug_trial/
  product_must_equal: matte_ceramic_mug
  provider_calls_must_be_at_most: 1
  generation_attempts_must_be_at_most: 1
  output_images_must_be_at_most: 4

  secret_handling:
    env_local_secret_value_read_allowed_for_v7_269: subprocess_only_if_required_by_existing_project_runner
    human_or_log_secret_read_allowed: false
    print_secret_value_allowed: false
    copy_secret_value_allowed: false
    commit_secret_value_allowed: false
    memory_secret_value_allowed: false
```

## Explicit Forbidden Scope

```yaml
forbidden:
  second_generation: true
  retry: true
  prompt_switch: true
  product_switch: true
  provider_path_switch: true
  Batch_005: true
  production_candidate_002: true
  memory_write_path: true
  DailyNote_write: true
  VCP_memory_write: true
  output_images_committed_to_git: true
  output_directory_added_to_git: true
  CDP_bridge_MCP: true
  submitDraft_previewDraft_loadSession_cancel: true
  dependency_change: true
  package_json_modified: true
  tag_release_deploy: true
  automatic_next_batch: true
```

## Required v7.269 Preflight

```yaml
required_before_v7_269_execution:
  - git_status_clean
  - prompt_package_path_verified
  - output_directory_absent_or_empty
  - output_directory_under_runs_real_generation
  - authorization_boundary_reconfirmed
  - provider_calls_max_equals_1
  - generation_attempts_max_equals_1
  - output_images_max_equals_4
  - auto_retry_false
  - memory_and_DailyNote_writes_false
```

## Stop Conditions

```yaml
stop_conditions:
  - dirty_worktree_before_execution
  - prompt_package_path_mismatch
  - output_directory_not_empty_with_unknown_files
  - any_retry_needed
  - second_provider_call_needed
  - model_or_provider_path_switch_needed
  - quota_or_rate_limit
  - credential_or_auth_failure
  - suspected_secret_exposure
  - more_than_4_outputs_would_be_created
  - any_memory_or_DailyNote_write_requested
```

## Recommended Next

```yaml
recommended_next:
  phase: v7.269_minimal_real_generation_trial_execution
  auto_execution_allowed: true
  purpose: >
    Execute exactly one bounded real generation trial, then stop immediately
    for human review.
```

## Closeout Template

```yaml
closeout:
  phase: v7.268b_true_A5_minimal_real_generation_authorization_gate
  commit_hash: <hash>
  commit_message: "docs: authorize minimal real generation trial"
  branch: master
  source_phase: v7.268a_prompt_package_yaml_parse_check
  push_performed: <true_or_false>
  local_equals_origin: <true_or_false>
  ahead_behind: <ahead behind>
  git_status: <status>

  authorization:
    route_B_selected: true
    minimal_real_generation_trial_authorized: true
    approved_product: matte_ceramic_mug
    approved_prompt_package: prompts/image_generation/product_still_life_matte_ceramic_mug_v1.yaml
    provider_calls_max: 1
    generation_attempts_max: 1
    output_images_max: 4
    auto_retry: false
    stop_after_generation: true
    human_review_required_after_generation: true

  safety:
    Batch_005: false
    production_candidate_002: false
    memory_write_path: false
    DailyNote_write: false
    VCP_memory_write: false
    dependency_change: false
    package_json_modified: false
    CDP_bridge_MCP: false

  recommended_next:
    phase: v7.269_minimal_real_generation_trial_execution
    auto_execution_allowed: true

  final_state:
    next_phase_started: false
```
