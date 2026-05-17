# V14.128 Failure Samples Authorization Template Current Goal Gap Review

```yaml
phase: v14_128_failure_samples_authorization_template_current_goal_gap_review
base_contract: AGENTS.md
mode: A4_8_safe_project_operator_rail
intent: local_implementation
risk_level: R2
source_phase: v14_127_production_exclusion_draft_current_goal_gap_review
status: completed_validated
```

## Purpose

This phase turns the current failure_samples boundary into a reusable exact
authorization template for future Codex-session rejection or failure learning
records.

It does not request, grant, or execute authorization.

## Inactive Authorization Template

```text
批准进入 AUTH-PENDING-CODEX-SESSION-FAILURE-SAMPLES-YYYYMMDD-001 A5 failure_samples metadata registry write execution：将 <review_record_ref> 中已通过本地审查且被判定为 reject / failure_learning 的 Codex 会话图片记录，登记到项目 failure_samples 元数据；允许仅修改 failure_samples/failure_registry.yaml、failure_samples/failure_taxonomy.yaml 和 failure_samples/categories/ 下的分类索引；允许创建缺失的 failure_samples/categories/*.yaml 分类索引；不允许复制、移动、读取或提交图片二进制文件，不允许修改 runs/real_generation/ 源图片，不允许修改 accepted_samples，不允许晋级 production_candidate，不允许写 DailyNote，不允许写 VCP memory，不允许读取 .env 或 .env.local 密钥值，不允许 provider/API/plugin/MCP 调用，不允许读取 real manifest/VCPChat/VCPToolBox，不允许 push/tag/release/deploy；写入后运行 git diff --check、node scripts/validate_agent_board_state.js、powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1、powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1 并停止汇报结果；审批人 <reviewer>。
```

## Template Field Requirements

```yaml
authorization_id_required: true
review_record_ref_required: true
review_outcome_must_be_reject_or_failure_learning: true
reviewer_required: true
exact_allowed_files:
  - failure_samples/failure_registry.yaml
  - failure_samples/failure_taxonomy.yaml
  - failure_samples/categories/*.yaml
allowed_creates:
  - failure_samples/categories/*.yaml
forbidden_files:
  - accepted_samples/*
  - runs/real_generation/*
  - production/*
  - .env
  - .env.local
forbidden_actions:
  - image_binary_copy
  - image_binary_read
  - runs_source_image_modification
  - accepted_samples_write
  - production_candidate_promotion
  - DailyNote_write
  - VCP_memory_write
  - provider_API_plugin_MCP_call
  - real_manifest_VCPChat_VCPToolBox_read
  - push_tag_release_deploy
```

## Current Status

```yaml
template_created: true
template_active: false
authorization_granted_by_this_record: false
failure_samples_write_performed: false
failure_samples_registry_write_performed: false
failure_samples_taxonomy_write_performed: false
accepted_samples_write_performed: false
production_candidate_created: false
```

## Explicit Non-Authorization

```yaml
provider_contact_performed: false
plugin_call_performed: false
api_call_performed: false
mcp_runtime_performed: false
image_generation_performed: false
DailyNote_write_performed: false
VCP_memory_write_performed: false
accepted_samples_write_performed: false
failure_samples_write_performed: false
failure_samples_registry_write_performed: false
failure_samples_taxonomy_write_performed: false
production_candidate_created: false
real_manifest_read_performed: false
real_vcpchat_read_performed: false
real_vcptoolbox_read_performed: false
output_file_write_performed: false
```

## Validation

```text
node --check scripts/validate_v14_128_failure_samples_authorization_template_current_goal_gap_review.js: passed
node scripts/validate_v14_128_failure_samples_authorization_template_current_goal_gap_review.js: passed
```

## Stop Boundary

```yaml
next_useful_action: actual_failure_samples_registry_write
status: blocked_until_separate_exact_A5_authorization
reason: >
  The template is prepared. Any real failure_samples write remains a high-risk
  metadata write and must wait for a separate exact human authorization package.
```
