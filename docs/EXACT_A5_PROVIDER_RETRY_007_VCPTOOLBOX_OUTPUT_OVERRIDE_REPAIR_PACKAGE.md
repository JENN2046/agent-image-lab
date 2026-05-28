# Exact A5 Provider Retry 007 VCPToolBox Output Override Repair Package

```yaml
phase: exact_a5_provider_retry_007_vcptoolbox_output_override_repair_package
status: repair_applied_and_validated
base_contract: AGENTS.md
validator: scripts/validate_exact_a5_provider_retry_007_vcptoolbox_output_override_repair_package.js
patch_preview_script: scripts/preview_exact_a5_provider_retry_007_vcptoolbox_output_override_patch.js
intent: external_repo_repair_record
lane: Amber_A_authorized_external_repo_two_file_repair
source_blocker: retry_007_execution_surface_reuse_review_20260528
authorization_id: AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260527-007
can_apply_now: false
real_vcptoolbox_patch_allowed_now: false
real_provider_execution_allowed_now: false
repair_authorization_phrase_issued_by_owner: true
repair_applied: true
repair_validated: true
```

## Purpose

Record the smallest exact VCPToolBox repair needed before `retry_007` can use
the existing admin route execution surface. This package is not a movement plan
or reference map, did not create a runner, and modified only the two authorized
VCPToolBox files.

## Current Evidence

```yaml
vcptoolbox_repo: A:\VCP\apps\VCPToolBox
vcptoolbox_branch: main
vcptoolbox_head_reviewed: 94f2f597_plus_authorized_local_two_file_repair
vcptoolbox_status_at_review: local_two_file_repair_applied_with_pre_existing_untracked_dailynote_entries_preserved
current_route_file: A:\VCP\apps\VCPToolBox\routes\admin\aiImageAgents.js
current_test_file: A:\VCP\apps\VCPToolBox\tests\aiImageAgentsRoute.test.js
current_allowlist_covers:
  - AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-003
  - AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-004
  - AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-005
  - AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260526-006
  - AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260527-007
current_route_authorizes_retry_007_output_override: true
current_route_test_covers_retry_007_output_override: true
missing_allowlist_entry: none
```

## Exact Applied Patch Scope

```yaml
authorized_vcptoolbox_files_changed:
  - A:\VCP\apps\VCPToolBox\routes\admin\aiImageAgents.js
  - A:\VCP\apps\VCPToolBox\tests\aiImageAgentsRoute.test.js
forbidden_vcptoolbox_files:
  - A:\VCP\apps\VCPToolBox\server.js
  - A:\VCP\apps\VCPToolBox\modules\aiImageExecutionAdapter.js
  - A:\VCP\apps\VCPToolBox\modules\aiImagePipelineExecutor.js
  - A:\VCP\apps\VCPToolBox\Plugin\DoubaoGen\
  - A:\VCP\apps\VCPToolBox\.env
  - A:\VCP\apps\VCPToolBox\config.env
new_runner_allowed: false
new_module_allowed: false
dependency_change_allowed: false
```

Applied patch delta:

```yaml
route_delta:
  target_constant: AUTHORIZED_DOUBAO_PROJECT_BASE_PATH_OVERRIDES
  add_exact_entry:
    key: AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260527-007
    value: A:\agent-image-lab\agent-image-lab-v0.2\runs\real_generation\v0_6_73_real_vcp_agent_generation_retry_007
test_delta:
  add_test_name: aiImageAgents execute route forwards exact retry 007 Doubao project base path override
  expected_task_id: AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260527-007
  expected_output_root: A:\agent-image-lab\agent-image-lab-v0.2\runs\real_generation\v0_6_73_real_vcp_agent_generation_retry_007
  preserve_negative_test: aiImageAgents execute route rejects unapproved Doubao project base path override
```

## Validation Without Provider

```text
node --check routes\admin\aiImageAgents.js
node --test tests\aiImageAgentsRoute.test.js
node --test tests\aiImageExecutionAdapter.test.js
```

Validate this repair package in Agent Image Lab:

```text
node scripts\preview_exact_a5_provider_retry_007_vcptoolbox_output_override_patch.js
node scripts\validate_exact_a5_provider_retry_007_vcptoolbox_output_override_repair_package.js
```

After the VCPToolBox patch is applied and validated, rerun in Agent Image Lab:

```text
npm run validate:core
npm run validate:public-disclosure
npm run validate:mvp
npm run validate:provider-evidence-integrity
npm run validate:all
node scripts\validate_exact_a5_provider_retry_007_activation_packet_draft.js
git diff --check
```

## Boundaries

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
image_generation_performed: false
secret_value_read_performed: false
env_file_content_read_performed: false
real_vcptoolbox_authorized_two_file_repair_performed: true
real_vcptoolbox_modified_files_count: 2
real_vcptoolbox_provider_runtime_executed: false
real_vcptoolbox_route_tests_executed: true
new_runner_created: false
accepted_samples_write_performed: false
production_candidate_write_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
tag_release_deploy_performed: false
```

## Stop Conditions

Stop before any future provider execution if any of these appear:

```yaml
stop_conditions:
  - retry_007 exact provider activation phrase is missing
  - repair validation becomes stale or fails
  - target route no longer authorizes the exact retry_007 output override
  - target route test no longer covers the exact retry_007 output override
  - provider activation would require a new runner, new module, dependency change, server change, or DoubaoGen change
  - validation would require provider/API contact or real image generation
  - secret value or env file content read is required
  - output overwrite is required
  - non-fast-forward push, tag, release, deploy, force push, or history rewrite is requested
```

## Exact Repair Authorization Phrase

The owner authorized only the VCPToolBox repair patch with:

```text
我授权修改 VCPToolBox retry_007 output override：只改 A:\VCP\apps\VCPToolBox\routes\admin\aiImageAgents.js 和 A:\VCP\apps\VCPToolBox\tests\aiImageAgentsRoute.test.js，添加 AUTH-DRAFT-NATIVE-DOUBAO-SEEDREAM5-RETRY-20260527-007 到 v0_6_73_real_vcp_agent_generation_retry_007 的 exact output override 和对应 route test；不创建 runner，不改 server/modules/DoubaoGen，不读 secret，不跑 provider/API/image，不 tag/release/deploy。
```

This phrase did not authorize `retry_007` provider execution. Provider/image
execution still requires the separate exact activation phrase in
`docs/EXACT_A5_PROVIDER_RETRY_007_ACTIVATION_PACKET_DRAFT.md` and all gates must
pass after the VCPToolBox repair.
