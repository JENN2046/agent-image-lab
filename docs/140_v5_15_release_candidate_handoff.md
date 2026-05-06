# v5.15 Release Candidate Handoff

本文记录 v5.14 release candidate validation baseline 的交接状态。该阶段只把 tag、package、SHA256 和包内验收结果整理成下一阶段可接手的 handoff；不发布 GitHub Release，不新增真实插件调用，不调用 API / DailyNote，不读取真实 VCPChat / VCPToolBox，不创建图片，也不写 VCP 记忆。

```yaml
status: completed_validated_project_local_v5_15_release_candidate_handoff
version: v5.15
current_phase: "v5.15 release candidate handoff"
validation_file: scripts/validate_v5_15_release_candidate_handoff.js
handoff_ready: true
github_release_published: false
github_release_publish_authorized: false
```

## Baseline State

```yaml
baseline_state:
  baseline_tag: v5.14-release-candidate-validation-baseline
  baseline_commit: 6fc0c401e739e93986e32d1797b80d7296e2d1c6
  baseline_commit_short: 6fc0c40
  tag_created: true
  tag_pushed: true
  master_origin_synced: true
  package_created: true
  sha256_created: true
  package_inside_validation_passed: true
```

## Package Evidence

```yaml
package_evidence:
  package_directory: release_packages/
  package_directory_git_ignored: true
  zip_name: agent-image-lab-v5.14-release-candidate-validation-baseline.zip
  sha256_name: agent-image-lab-v5.14-release-candidate-validation-baseline.zip.sha256
  zip_sha256: 2fa0204a855ea9b74a36c5f8bf701356dd35414d3b35d3e85e1bf367492197db
  verify_directory: release_packages/_verify_v5.14-release-candidate-validation-baseline/
  package_contains_git_directory: false
  package_contains_release_packages_directory: false
  package_contains_runs_directory: false
  package_contains_media_binary: false
  package_contains_secret_file: false
```

## Validation Evidence

```yaml
validation_evidence:
  git_diff_check_passed: true
  validate_mvp_passed: true
  local_validation_passed_with_manual_review_warnings: true
  v5_12_release_candidate_readiness_passed: true
  sha256_match: true
  package_inside_required_files_present: true
  package_inside_boundary_passed: true
```

## Release Boundary

```yaml
release_boundary:
  github_release_published: false
  github_release_publish_authorized: false
  release_assets_uploaded: false
  release_notes_finalized_for_public_release: false
  release_upload_allowed_now: false
  release_publish_next_requires_explicit_authorization: true
```

## Execution Boundary

```yaml
execution_boundary:
  real_vcpchat_source_read: false
  real_vcptoolbox_source_read: false
  real_manifest_read: false
  api_called: false
  vcp_plugin_called: false
  daily_note_called: false
  vcp_memory_written: false
  image_file_created: false
  additional_real_generation_authorized: false
```

## Next Milestone Options

```yaml
next_milestone_options:
  option_a:
    name: "GitHub Release preflight"
    phase_hint: "v5.16 release publication preflight"
    allowed_now: false
    requires_explicit_authorization: true
  option_b:
    name: "continue local product/runtime planning"
    phase_hint: "v6.0 next milestone planning"
    allowed_now: true
    requires_explicit_authorization: false
  option_c:
    name: "pause at handoff baseline"
    phase_hint: "no further action"
    allowed_now: true
    requires_explicit_authorization: false
```

## Acceptance Meaning

v5.15 表示 v5.14 的 tag、包、SHA256 和包内验收结果已经形成可交接记录。它不等同于 GitHub Release 发布，也不授权任何新的真实生图、DailyNote 写入、VCP 长期记忆写入、真实 VCPChat / VCPToolBox 读取或 VCPChat 集成实现。

下一步如果要公开发布 GitHub Release，必须先进入单独的 release preflight，并由用户明确授权发布和上传资产。
