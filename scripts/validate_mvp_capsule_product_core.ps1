function Invoke-CapsuleProductCoreValidation {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Root,

    [Parameter(Mandatory = $true)]
    [scriptblock]$AddFailure,

    [ValidateSet('PreRuns', 'PostRuns', 'All')]
    [string]$Section = 'All'
  )

  function Invoke-CapsuleNodeJsonValidator {
    param(
      [Parameter(Mandatory = $true)]
      [string]$ScriptRelativePath,

      [Parameter(Mandatory = $true)]
      [string]$FailureMessage
    )

    $validatorOutput = & node (Join-Path $Root $ScriptRelativePath)
    if ($LASTEXITCODE -ne 0) {
      & $AddFailure $FailureMessage
      return $null
    }

    return ($validatorOutput -join "`n") | ConvertFrom-Json
  }

  function Test-CapsuleNoExternalActionFlags {
    param(
      [Parameter(Mandatory = $true)]
      [object]$Report,

      [Parameter(Mandatory = $true)]
      [string]$FailureMessage,

      [string[]]$ExtraFields = @()
    )

    $fields = @(
      'provider_contact_performed',
      'plugin_call_performed',
      'api_call_performed',
      'image_generation_performed',
      'DailyNote_write_performed',
      'VCP_memory_write_performed',
      'runtime_execution_performed',
      'real_manifest_read_performed',
      'real_vcpchat_read_performed',
      'real_vcptoolbox_read_performed',
      'push_tag_release_deploy_performed'
    ) + $ExtraFields

    foreach ($field in $fields) {
      if ($Report.$field -ne $false) {
        & $AddFailure $FailureMessage
        return
      }
    }
  }

  function Test-CapsuleExpectedStatus {
    param(
      [Parameter(Mandatory = $true)]
      [object]$Report,

      [Parameter(Mandatory = $true)]
      [string]$ExpectedStatus,

      [Parameter(Mandatory = $true)]
      [string]$FailureMessage
    )

    if ($Report.passed -ne $true -or $Report.status -ne $ExpectedStatus) {
      & $AddFailure $FailureMessage
    }
  }

  if ($Section -eq 'PreRuns' -or $Section -eq 'All') {
  $capsuleStatusTaxonomy = Invoke-CapsuleNodeJsonValidator 'scripts/validate_capsule_status_taxonomy.js' "Capsule status taxonomy validation exited with failure"
  if ($null -ne $capsuleStatusTaxonomy) {
    Test-CapsuleExpectedStatus $capsuleStatusTaxonomy 'capsule_status_taxonomy_verified' "Capsule status taxonomy validation must pass"
    if ($capsuleStatusTaxonomy.taxonomy_shared_by_registry_validators -ne $true -or $capsuleStatusTaxonomy.writes_performed -ne $false -or $capsuleStatusTaxonomy.preview_creation_or_copy_performed -ne $false) {
      & $AddFailure "Capsule status taxonomy validation must prove shared registry validator taxonomy without writes or preview creation/copy"
    }
    Test-CapsuleNoExternalActionFlags $capsuleStatusTaxonomy "Capsule status taxonomy validation must remain local-only with no external, memory, runtime, production, or remote actions" @('production_candidate_write_performed')
  }

  $capsuleManifestContractNegative = Invoke-CapsuleNodeJsonValidator 'scripts/validate_capsule_manifest_contract_negative_cases.js' "Capsule manifest contract negative-case validation exited with failure"
  if ($null -ne $capsuleManifestContractNegative) {
    Test-CapsuleExpectedStatus $capsuleManifestContractNegative 'capsule_manifest_contract_negative_cases_verified' "Capsule manifest contract negative-case validation must pass"
    if ($capsuleManifestContractNegative.fixture_count -lt 4 -or $capsuleManifestContractNegative.failed_count -ne 0) {
      & $AddFailure "Capsule manifest contract negative-case validation must keep fail-closed coverage"
    }
    if ($capsuleManifestContractNegative.temp_workspace_root_class -ne '.agent_private' -or $capsuleManifestContractNegative.real_capsule_modified -ne $false -or $capsuleManifestContractNegative.preview_creation_or_copy_performed -ne $false) {
      & $AddFailure "Capsule manifest contract negative-case fixtures must stay in .agent_private and must not modify real capsules or create/copy previews"
    }
    Test-CapsuleNoExternalActionFlags $capsuleManifestContractNegative "Capsule manifest contract negative-case validation must remain local-only with no external, memory, runtime, source read, push, tag, release, or deploy actions"
  }

  $capsuleCreatorCommonSafety = Invoke-CapsuleNodeJsonValidator 'scripts/validate_capsule_creator_common_safety.js' "Capsule creator common safety validation exited with failure"
  if ($null -ne $capsuleCreatorCommonSafety) {
    Test-CapsuleExpectedStatus $capsuleCreatorCommonSafety 'capsule_creator_common_safety_verified' "Capsule creator common safety validation must pass"
    if ($capsuleCreatorCommonSafety.duplicated_creator_safety_logic_reduced -ne $true -or $capsuleCreatorCommonSafety.writes_performed -ne $false -or $capsuleCreatorCommonSafety.preview_creation_or_copy_performed -ne $false) {
      & $AddFailure "Capsule creator common safety validation must reduce duplication without writes or preview creation/copy"
    }
    Test-CapsuleNoExternalActionFlags $capsuleCreatorCommonSafety "Capsule creator common safety validation must remain local-only with no external, memory, runtime, production, or remote actions" @('production_candidate_write_performed')
  }

  $capsuleCreatorManifestContractRegression = Invoke-CapsuleNodeJsonValidator 'scripts/validate_capsule_creator_manifest_contract_regression.js' "Capsule creator manifest contract regression validation exited with failure"
  if ($null -ne $capsuleCreatorManifestContractRegression) {
    Test-CapsuleExpectedStatus $capsuleCreatorManifestContractRegression 'capsule_creator_manifest_contract_regression_verified' "Capsule creator manifest contract regression validation must pass"
    if ($capsuleCreatorManifestContractRegression.static_validator_only -ne $true -or $capsuleCreatorManifestContractRegression.real_capsule_created -ne $false -or $capsuleCreatorManifestContractRegression.preview_creation_or_copy_performed -ne $false) {
      & $AddFailure "Capsule creator manifest contract regression must stay static-only without capsule creation or preview creation/copy"
    }
    Test-CapsuleNoExternalActionFlags $capsuleCreatorManifestContractRegression "Capsule creator manifest contract regression must remain local-only with no external, memory, runtime, production, or remote actions" @('production_candidate_write_performed')
  }

  $fullAssetArchiveManifest = Invoke-CapsuleNodeJsonValidator 'scripts/validate_full_asset_archive_manifest.js' "Full asset archive manifest validation exited with failure"
  if ($null -ne $fullAssetArchiveManifest) {
    Test-CapsuleExpectedStatus $fullAssetArchiveManifest 'full_asset_archive_manifest_verified' "Full asset archive manifest validation must pass"
    if ($fullAssetArchiveManifest.static_validator_only -ne $true -or $fullAssetArchiveManifest.existing_git_tracked_preview_static_validation_allowed -ne $true) {
      & $AddFailure "Full asset archive manifest validation must stay static-only while allowing only existing Git-tracked preview static validation"
    }
    Test-CapsuleNoExternalActionFlags $fullAssetArchiveManifest "Full asset archive manifest validation must remain local-only with no external, memory, runtime, production, or remote actions" @('actual_runs_scan_performed', 'runs_mutation_performed', 'source_image_binary_read_performed', 'image_binary_read_performed', 'hash_extraction_performed', 'dimensions_extraction_performed', 'preview_generation_performed', 'original_copy_performed', 'production_candidate_write_performed')
  }

  $gitTrackedPreviewEvidenceCapsuleBaselineOutput = & node (Join-Path $Root 'scripts/validate_v14_231_git_tracked_preview_evidence_capsule_baseline.js')
  if ($LASTEXITCODE -ne 0) {
    & $AddFailure "Git-tracked preview evidence capsule baseline validation exited with failure"
  } else {
    $gitTrackedPreviewEvidenceCapsuleBaseline = ($gitTrackedPreviewEvidenceCapsuleBaselineOutput -join "`n") | ConvertFrom-Json
    if ($gitTrackedPreviewEvidenceCapsuleBaseline.passed -ne $true) {
      & $AddFailure "Git-tracked preview evidence capsule baseline validation must pass"
    }
    if ($gitTrackedPreviewEvidenceCapsuleBaseline.phase -ne 'v14_231_git_tracked_preview_evidence_capsule_baseline' -or $gitTrackedPreviewEvidenceCapsuleBaseline.preview_format -ne 'webp' -or $gitTrackedPreviewEvidenceCapsuleBaseline.preview_long_edge -ne 512) {
      & $AddFailure "v14.231 must define preview.webp with long_edge 512"
    }
    if ($gitTrackedPreviewEvidenceCapsuleBaseline.base64_allowed -ne $false -or $gitTrackedPreviewEvidenceCapsuleBaseline.original_sha256_tracked -ne $false -or $gitTrackedPreviewEvidenceCapsuleBaseline.original_required_for_portable_validation -ne $false) {
      & $AddFailure "v14.231 must forbid Base64 and original sha256 as portable validation requirements"
    }
    if ($gitTrackedPreviewEvidenceCapsuleBaseline.old_runs_as_long_term_evidence -ne $false -or $gitTrackedPreviewEvidenceCapsuleBaseline.portable_evidence_verified -ne $true -or $gitTrackedPreviewEvidenceCapsuleBaseline.full_original_recoverability_required -ne $false) {
      & $AddFailure "v14.231 must replace old runs recovery with Git-portable preview evidence"
    }
    if ($gitTrackedPreviewEvidenceCapsuleBaseline.A5_execution -ne $false -or $gitTrackedPreviewEvidenceCapsuleBaseline.provider_contact -ne $false -or $gitTrackedPreviewEvidenceCapsuleBaseline.plugin_call -ne $false -or $gitTrackedPreviewEvidenceCapsuleBaseline.api_call -ne $false -or $gitTrackedPreviewEvidenceCapsuleBaseline.image_generation -ne $false -or $gitTrackedPreviewEvidenceCapsuleBaseline.runs_write -ne $false) {
      & $AddFailure "v14.231 must not perform A5, provider, plugin, API, image generation, or runs writes"
    }
    if ($gitTrackedPreviewEvidenceCapsuleBaseline.daily_note_write -ne $false -or $gitTrackedPreviewEvidenceCapsuleBaseline.vcp_memory_write -ne $false -or $gitTrackedPreviewEvidenceCapsuleBaseline.runtime_execution -ne $false -or $gitTrackedPreviewEvidenceCapsuleBaseline.real_manifest_read -ne $false -or $gitTrackedPreviewEvidenceCapsuleBaseline.real_vcpchat_read -ne $false -or $gitTrackedPreviewEvidenceCapsuleBaseline.real_vcptoolbox_read -ne $false -or $gitTrackedPreviewEvidenceCapsuleBaseline.push_tag_release_deploy -ne $false) {
      & $AddFailure "v14.231 must not perform memory, runtime, real manifest, VCP source reads, push, tag, release, or deploy"
    }
    if ($gitTrackedPreviewEvidenceCapsuleBaseline.negative_case_base64_allowed_fails -ne $true -or $gitTrackedPreviewEvidenceCapsuleBaseline.negative_case_original_sha256_tracked_fails -ne $true -or $gitTrackedPreviewEvidenceCapsuleBaseline.negative_case_original_required_fails -ne $true -or $gitTrackedPreviewEvidenceCapsuleBaseline.negative_case_preview_long_edge_drift_fails -ne $true -or $gitTrackedPreviewEvidenceCapsuleBaseline.negative_case_missing_preview_webp_fails -ne $true -or $gitTrackedPreviewEvidenceCapsuleBaseline.negative_case_A5_execution_flag_fails -ne $true) {
      & $AddFailure "v14.231 must fail Base64, original-sha, original-required, preview-size, missing-preview, and A5 negative cases"
    }
  }

  $previewCapsuleRegistryOutput = & node (Join-Path $Root 'scripts/validate_preview_capsule_registry.js')
  if ($LASTEXITCODE -ne 0) {
    & $AddFailure "Preview capsule registry validation exited with failure"
  } else {
    $previewCapsuleRegistry = ($previewCapsuleRegistryOutput -join "`n") | ConvertFrom-Json
    Test-CapsuleExpectedStatus $previewCapsuleRegistry 'registry_driven_preview_capsules_verified' "Preview capsule registry validation must pass"
    if ($previewCapsuleRegistry.report_version -ne 'v2') {
      & $AddFailure "Preview capsule registry validation must pass"
    }
    if ($previewCapsuleRegistry.sample_count -lt 1 -or $previewCapsuleRegistry.total_samples -lt 1 -or $previewCapsuleRegistry.failed_count -ne 0) {
      & $AddFailure "Preview capsule registry must verify at least one sample with zero failures"
    }
    if ($previewCapsuleRegistry.failed_sample_ids.Count -ne 0 -or $previewCapsuleRegistry.failure_class_summary.sample_failed -ne 0) {
      & $AddFailure "Preview capsule registry v2 report must expose zero failed sample ids and zero sample_failed summary for the current capsule set"
    }
    if ($previewCapsuleRegistry.guard.provider_contact_performed -ne $false -or $previewCapsuleRegistry.guard.plugin_call_performed -ne $false -or $previewCapsuleRegistry.guard.api_call_performed -ne $false -or $previewCapsuleRegistry.guard.image_generation_performed -ne $false -or $previewCapsuleRegistry.guard.preview_creation_or_copy_performed -ne $false) {
      & $AddFailure "Preview capsule registry validation must not perform provider, plugin, API, image generation, preview creation, or preview copy"
    }
    if ($previewCapsuleRegistry.guard.DailyNote_write_performed -ne $false -or $previewCapsuleRegistry.guard.VCP_memory_write_performed -ne $false -or $previewCapsuleRegistry.guard.runtime_execution_performed -ne $false -or $previewCapsuleRegistry.guard.real_manifest_read_performed -ne $false -or $previewCapsuleRegistry.guard.real_vcpchat_read_performed -ne $false -or $previewCapsuleRegistry.guard.real_vcptoolbox_read_performed -ne $false -or $previewCapsuleRegistry.guard.push_tag_release_deploy_performed -ne $false) {
      & $AddFailure "Preview capsule registry validation must not perform memory, runtime, real manifest, VCP source reads, push, tag, release, or deploy"
    }
  }

  $previewCapsuleNegativeOutput = & node (Join-Path $Root 'scripts/validate_preview_capsule_registry_negative_cases.js')
  if ($LASTEXITCODE -ne 0) {
    & $AddFailure "Preview capsule registry negative-case validation exited with failure"
  } else {
    $previewCapsuleNegative = ($previewCapsuleNegativeOutput -join "`n") | ConvertFrom-Json
    Test-CapsuleExpectedStatus $previewCapsuleNegative 'registry_preview_capsule_negative_cases_verified' "Preview capsule registry negative-case validation must pass"
    if ($previewCapsuleNegative.failed_count -ne 0 -or $previewCapsuleNegative.check_count -lt 10) {
      & $AddFailure "Preview capsule registry negative-case validation must include passing fail-closed checks"
    }
    if ($previewCapsuleNegative.temp_workspace_root_class -ne '.agent_private' -or $previewCapsuleNegative.real_capsule_modified -ne $false -or $previewCapsuleNegative.preview_creation_or_copy_performed -ne $false) {
      & $AddFailure "Preview capsule negative-case fixtures must stay in .agent_private and must not modify real capsules or create/copy product previews"
    }
    if ($previewCapsuleNegative.provider_contact_performed -ne $false -or $previewCapsuleNegative.plugin_call_performed -ne $false -or $previewCapsuleNegative.api_call_performed -ne $false -or $previewCapsuleNegative.image_generation_performed -ne $false -or $previewCapsuleNegative.DailyNote_write_performed -ne $false -or $previewCapsuleNegative.VCP_memory_write_performed -ne $false -or $previewCapsuleNegative.runtime_execution_performed -ne $false -or $previewCapsuleNegative.real_manifest_read_performed -ne $false -or $previewCapsuleNegative.real_vcpchat_read_performed -ne $false -or $previewCapsuleNegative.real_vcptoolbox_read_performed -ne $false -or $previewCapsuleNegative.push_tag_release_deploy_performed -ne $false) {
      & $AddFailure "Preview capsule negative-case validation must not perform external, memory, runtime, source read, push, tag, release, or deploy actions"
    }
  }

  $failureSampleCapsuleRegistryOutput = & node (Join-Path $Root 'scripts/validate_failure_sample_capsule_registry.js')
  if ($LASTEXITCODE -ne 0) {
    & $AddFailure "Failure sample capsule registry validation exited with failure"
  } else {
    $failureSampleCapsuleRegistry = ($failureSampleCapsuleRegistryOutput -join "`n") | ConvertFrom-Json
    Test-CapsuleExpectedStatus $failureSampleCapsuleRegistry 'failure_sample_capsules_verified' "Failure sample capsule registry validation must pass in zero-sample-safe mode"
    if ($failureSampleCapsuleRegistry.report_version -ne 'v1') {
      & $AddFailure "Failure sample capsule registry validation must pass in zero-sample-safe mode"
    }
    if ($failureSampleCapsuleRegistry.root -ne 'asset_archive/failure_samples' -or $failureSampleCapsuleRegistry.sample_count -lt 1 -or $failureSampleCapsuleRegistry.failed_count -ne 0) {
      & $AddFailure "Failure sample capsule registry must validate at least one failure sample with zero failures"
    }
    if ($failureSampleCapsuleRegistry.guard.provider_contact_performed -ne $false -or $failureSampleCapsuleRegistry.guard.plugin_call_performed -ne $false -or $failureSampleCapsuleRegistry.guard.api_call_performed -ne $false -or $failureSampleCapsuleRegistry.guard.image_generation_performed -ne $false -or $failureSampleCapsuleRegistry.guard.preview_creation_or_copy_performed -ne $false) {
      & $AddFailure "Failure sample capsule registry validation must not perform provider, plugin, API, image generation, preview creation, or preview copy"
    }
    if ($failureSampleCapsuleRegistry.guard.DailyNote_write_performed -ne $false -or $failureSampleCapsuleRegistry.guard.VCP_memory_write_performed -ne $false -or $failureSampleCapsuleRegistry.guard.runtime_execution_performed -ne $false -or $failureSampleCapsuleRegistry.guard.real_manifest_read_performed -ne $false -or $failureSampleCapsuleRegistry.guard.real_vcpchat_read_performed -ne $false -or $failureSampleCapsuleRegistry.guard.real_vcptoolbox_read_performed -ne $false -or $failureSampleCapsuleRegistry.guard.push_tag_release_deploy_performed -ne $false) {
      & $AddFailure "Failure sample capsule registry validation must not perform memory, runtime, real manifest, VCP source reads, push, tag, release, or deploy"
    }
  }

  $failureSampleCapsuleNegativeOutput = & node (Join-Path $Root 'scripts/validate_failure_sample_capsule_registry_negative_cases.js')
  if ($LASTEXITCODE -ne 0) {
    & $AddFailure "Failure sample capsule registry negative-case validation exited with failure"
  } else {
    $failureSampleCapsuleNegative = ($failureSampleCapsuleNegativeOutput -join "`n") | ConvertFrom-Json
    Test-CapsuleExpectedStatus $failureSampleCapsuleNegative 'failure_sample_capsule_negative_cases_verified' "Failure sample capsule registry negative-case validation must pass"
    if ($failureSampleCapsuleNegative.failed_count -ne 0 -or $failureSampleCapsuleNegative.check_count -lt 10) {
      & $AddFailure "Failure sample capsule registry negative-case validation must include passing fail-closed checks"
    }
    if ($failureSampleCapsuleNegative.temp_workspace_root_class -ne '.agent_private' -or $failureSampleCapsuleNegative.real_failure_capsule_modified -ne $false -or $failureSampleCapsuleNegative.preview_creation_or_copy_performed -ne $false) {
      & $AddFailure "Failure sample capsule negative-case fixtures must stay in .agent_private and must not modify real failure capsules or create/copy previews"
    }
    if ($failureSampleCapsuleNegative.provider_contact_performed -ne $false -or $failureSampleCapsuleNegative.plugin_call_performed -ne $false -or $failureSampleCapsuleNegative.api_call_performed -ne $false -or $failureSampleCapsuleNegative.image_generation_performed -ne $false -or $failureSampleCapsuleNegative.DailyNote_write_performed -ne $false -or $failureSampleCapsuleNegative.VCP_memory_write_performed -ne $false -or $failureSampleCapsuleNegative.runtime_execution_performed -ne $false -or $failureSampleCapsuleNegative.real_manifest_read_performed -ne $false -or $failureSampleCapsuleNegative.real_vcpchat_read_performed -ne $false -or $failureSampleCapsuleNegative.real_vcptoolbox_read_performed -ne $false -or $failureSampleCapsuleNegative.push_tag_release_deploy_performed -ne $false) {
      & $AddFailure "Failure sample capsule negative-case validation must not perform external, memory, runtime, source read, push, tag, release, or deploy actions"
    }
  }

  $failureSampleRegistrySourceOutput = & node (Join-Path $Root 'scripts/validate_failure_sample_registry_source.js')
  if ($LASTEXITCODE -ne 0) {
    & $AddFailure "Failure sample registry source validation exited with failure"
  } else {
    $failureSampleRegistrySource = ($failureSampleRegistrySourceOutput -join "`n") | ConvertFrom-Json
    if ($failureSampleRegistrySource.passed -ne $true -or $failureSampleRegistrySource.status -ne 'failure_sample_registry_source_verified') {
      & $AddFailure "Failure sample registry source validation must pass"
    }
    if ($failureSampleRegistrySource.registry_driven_source -ne $true -or $failureSampleRegistrySource.yaml_parser_aligned_with_accepted_lane -ne $true -or $failureSampleRegistrySource.shared_registry_source_common -ne $true -or $failureSampleRegistrySource.writes_performed -ne $false -or $failureSampleRegistrySource.preview_creation_or_copy_performed -ne $false) {
      & $AddFailure "Failure sample registry source validation must use structured YAML parsing without writes or preview creation/copy"
    }
    if ($failureSampleRegistrySource.provider_contact_performed -ne $false -or $failureSampleRegistrySource.plugin_call_performed -ne $false -or $failureSampleRegistrySource.api_call_performed -ne $false -or $failureSampleRegistrySource.image_generation_performed -ne $false -or $failureSampleRegistrySource.DailyNote_write_performed -ne $false -or $failureSampleRegistrySource.VCP_memory_write_performed -ne $false -or $failureSampleRegistrySource.runtime_execution_performed -ne $false -or $failureSampleRegistrySource.real_manifest_read_performed -ne $false -or $failureSampleRegistrySource.real_vcpchat_read_performed -ne $false -or $failureSampleRegistrySource.real_vcptoolbox_read_performed -ne $false -or $failureSampleRegistrySource.production_candidate_write_performed -ne $false -or $failureSampleRegistrySource.push_tag_release_deploy_performed -ne $false) {
      & $AddFailure "Failure sample registry source validation must remain local-only with no external, memory, runtime, production, or remote actions"
    }
  }

  $capsuleCodeDebtCompletionAudit = Invoke-CapsuleNodeJsonValidator 'scripts/validate_capsule_code_debt_completion_audit.js' "Capsule code debt completion audit validation exited with failure"
  if ($null -ne $capsuleCodeDebtCompletionAudit) {
    if ($capsuleCodeDebtCompletionAudit.passed -ne $true -or $capsuleCodeDebtCompletionAudit.status -ne 'capsule_code_debt_completion_audit_verified') {
      & $AddFailure "Capsule code debt completion audit validation must pass"
    }
    if ($capsuleCodeDebtCompletionAudit.docs_pile_created -ne $false -or $capsuleCodeDebtCompletionAudit.writes_performed -ne $false -or $capsuleCodeDebtCompletionAudit.preview_creation_or_copy_performed -ne $false) {
      & $AddFailure "Capsule code debt completion audit must remain read-only and avoid docs pile or preview creation/copy"
    }
    Test-CapsuleNoExternalActionFlags $capsuleCodeDebtCompletionAudit "Capsule code debt completion audit must remain local-only with no external, memory, runtime, production, or remote actions" @('production_candidate_write_performed')
  }

  $failureSampleCapsuleCreatorDryRunOutput = & node (Join-Path $Root 'scripts/validate_failure_sample_capsule_creator_dry_run.js')
  if ($LASTEXITCODE -ne 0) {
    & $AddFailure "Failure sample capsule creator dry-run validation exited with failure"
  } else {
    $failureSampleCapsuleCreatorDryRun = ($failureSampleCapsuleCreatorDryRunOutput -join "`n") | ConvertFrom-Json
    if ($failureSampleCapsuleCreatorDryRun.passed -ne $true -or $failureSampleCapsuleCreatorDryRun.status -ne 'failure_sample_capsule_creator_dry_run_verified') {
      & $AddFailure "Failure sample capsule creator dry-run validation must pass"
    }
    if ($failureSampleCapsuleCreatorDryRun.confirm_create_executed -ne $false -or $failureSampleCapsuleCreatorDryRun.writes_performed -ne $false -or $failureSampleCapsuleCreatorDryRun.target_directory_existed_before_validation -ne $failureSampleCapsuleCreatorDryRun.target_directory_exists_after_validation) {
      & $AddFailure "Failure sample capsule creator dry-run validation must not execute confirm-create, write files, or change target directory state"
    }
    if ($failureSampleCapsuleCreatorDryRun.preview_creation_or_copy_performed -ne $false -or $failureSampleCapsuleCreatorDryRun.provider_contact_performed -ne $false -or $failureSampleCapsuleCreatorDryRun.plugin_call_performed -ne $false -or $failureSampleCapsuleCreatorDryRun.api_call_performed -ne $false -or $failureSampleCapsuleCreatorDryRun.image_generation_performed -ne $false) {
      & $AddFailure "Failure sample capsule creator dry-run validation must not perform preview creation/copy, provider, plugin, API, or image generation"
    }
    if ($failureSampleCapsuleCreatorDryRun.DailyNote_write_performed -ne $false -or $failureSampleCapsuleCreatorDryRun.VCP_memory_write_performed -ne $false -or $failureSampleCapsuleCreatorDryRun.runtime_execution_performed -ne $false -or $failureSampleCapsuleCreatorDryRun.real_manifest_read_performed -ne $false -or $failureSampleCapsuleCreatorDryRun.real_vcpchat_read_performed -ne $false -or $failureSampleCapsuleCreatorDryRun.real_vcptoolbox_read_performed -ne $false -or $failureSampleCapsuleCreatorDryRun.push_tag_release_deploy_performed -ne $false) {
      & $AddFailure "Failure sample capsule creator dry-run validation must not perform memory, runtime, real manifest, VCP source reads, push, tag, release, or deploy"
    }
  }

  $reviewConsoleFailureCapsuleSnapshotOutput = & node (Join-Path $Root 'scripts/validate_review_console_failure_capsule_snapshot.js')
  if ($LASTEXITCODE -ne 0) {
    & $AddFailure "Review Console failure capsule snapshot validation exited with failure"
  } else {
    $reviewConsoleFailureCapsuleSnapshot = ($reviewConsoleFailureCapsuleSnapshotOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleFailureCapsuleSnapshot.passed -ne $true -or $reviewConsoleFailureCapsuleSnapshot.phase -ne 'p5l_review_console_failure_capsule_snapshot_validator') {
      & $AddFailure "Review Console failure capsule snapshot validation must pass"
    }
    if ($reviewConsoleFailureCapsuleSnapshot.sample_id -ne 'failure_french_summer_rattan_bag_v7_29_001' -or $reviewConsoleFailureCapsuleSnapshot.preview_long_edge -ne 512 -or $reviewConsoleFailureCapsuleSnapshot.final_route -ne 'failure_learning_only_never_production') {
      & $AddFailure "Review Console failure capsule snapshot must pin sample id, long_edge 512, and never-production route"
    }
    if ($reviewConsoleFailureCapsuleSnapshot.clone_portable_validation_status -ne 'passed' -or $reviewConsoleFailureCapsuleSnapshot.registry_validator_status -ne 'failure_sample_capsules_verified') {
      & $AddFailure "Review Console failure capsule snapshot must preserve clone-portable and registry validation status"
    }
    if ($reviewConsoleFailureCapsuleSnapshot.production_candidate_allowed -ne $false -or $reviewConsoleFailureCapsuleSnapshot.memory_write_allowed -ne $false -or $reviewConsoleFailureCapsuleSnapshot.daily_note_write_allowed -ne $false) {
      & $AddFailure "Review Console failure capsule snapshot must not allow production, memory write, or DailyNote write"
    }
  if ($reviewConsoleFailureCapsuleSnapshot.fetch_performed -ne $false -or $reviewConsoleFailureCapsuleSnapshot.file_write_performed -ne $false -or $reviewConsoleFailureCapsuleSnapshot.image_generation_performed -ne $false -or $reviewConsoleFailureCapsuleSnapshot.real_manifest_read_performed -ne $false -or $reviewConsoleFailureCapsuleSnapshot.real_vcpchat_read_performed -ne $false -or $reviewConsoleFailureCapsuleSnapshot.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleFailureCapsuleSnapshot.vcp_runtime_integration_proven -ne $false) {
      & $AddFailure "Review Console failure capsule snapshot must remain static-only with no fetch, writes, image generation, real source reads, or runtime claim"
    }
  }

  $multiCapsuleDashboardOutput = & node (Join-Path $Root 'scripts/validate_multi_capsule_dashboard.js')
  if ($LASTEXITCODE -ne 0) {
    & $AddFailure "Multi-capsule dashboard validation exited with failure"
  } else {
    $multiCapsuleDashboard = ($multiCapsuleDashboardOutput -join "`n") | ConvertFrom-Json
    if ($multiCapsuleDashboard.passed -ne $true -or $multiCapsuleDashboard.phase -ne 'p6_multi_capsule_accepted_failure_dashboard_productization') {
      & $AddFailure "Multi-capsule dashboard validation must pass"
    }
    if ($multiCapsuleDashboard.accepted_capsule_count -ne 2 -or $multiCapsuleDashboard.failure_capsule_count -ne 2 -or $multiCapsuleDashboard.total_capsule_count -ne 4) {
      & $AddFailure "Multi-capsule dashboard must preserve accepted=2, failure=2, total=4"
    }
    if ($multiCapsuleDashboard.linked_relation_count -lt 2 -or $multiCapsuleDashboard.report_version -ne 'accepted_failure_capsule_report_v1' -or $multiCapsuleDashboard.report_passed -ne 4 -or $multiCapsuleDashboard.report_failed -ne 0) {
      & $AddFailure "Multi-capsule dashboard must expose linked accepted/failure relation and passing unified report shape"
    }
    if ($multiCapsuleDashboard.old_runs_source_required_for_portable_validation -ne $false -or $multiCapsuleDashboard.directory_as_registry_currently_sufficient -ne $true) {
      & $AddFailure "Multi-capsule dashboard must not require old runs source and must keep directory-as-registry sufficient for current state"
    }
    if ($multiCapsuleDashboard.next_capsule_creation_allowed_now -ne $false -or $multiCapsuleDashboard.second_failure_capsule_requires_separate_authorization -ne $true) {
      & $AddFailure "Multi-capsule dashboard must keep second failure capsule creation blocked pending separate authorization"
    }
  if ($multiCapsuleDashboard.provider_contact_performed -ne $false -or $multiCapsuleDashboard.plugin_call_performed -ne $false -or $multiCapsuleDashboard.api_call_performed -ne $false -or $multiCapsuleDashboard.image_generation_performed -ne $false -or $multiCapsuleDashboard.DailyNote_write_performed -ne $false -or $multiCapsuleDashboard.VCP_memory_write_performed -ne $false -or $multiCapsuleDashboard.runtime_execution_performed -ne $false -or $multiCapsuleDashboard.real_manifest_read_performed -ne $false -or $multiCapsuleDashboard.real_vcpchat_read_performed -ne $false -or $multiCapsuleDashboard.real_vcptoolbox_read_performed -ne $false -or $multiCapsuleDashboard.production_candidate_write_performed -ne $false -or $multiCapsuleDashboard.push_tag_release_deploy_performed -ne $false -or $multiCapsuleDashboard.vcp_runtime_integration_proven -ne $false) {
      & $AddFailure "Multi-capsule dashboard must remain static-only with no external, memory, runtime, production, or remote actions"
    }
  }

  $capsuleManifestContractOutput = & node (Join-Path $Root 'scripts/validate_capsule_manifest_contract.js')
  if ($LASTEXITCODE -ne 0) {
    & $AddFailure "Capsule manifest contract validation exited with failure"
  } else {
    $capsuleManifestContract = ($capsuleManifestContractOutput -join "`n") | ConvertFrom-Json
    if ($capsuleManifestContract.passed -ne $true -or $capsuleManifestContract.status -ne 'capsule_manifest_contract_verified' -or $capsuleManifestContract.schema_runtime_binding_status -ne 'schema_runtime_binding_verified') {
      & $AddFailure "Capsule manifest contract must pass and verify schema/runtime binding"
    }
    if ($capsuleManifestContract.totals.accepted -ne 2 -or $capsuleManifestContract.totals.failure -ne 2 -or $capsuleManifestContract.totals.total -ne 4) {
      & $AddFailure "Capsule manifest contract must preserve accepted=2, failure=2, total=4"
    }
    if ($capsuleManifestContract.guard.preview_creation_or_copy_performed -ne $false -or $capsuleManifestContract.guard.image_generation_performed -ne $false -or $capsuleManifestContract.guard.provider_contact_performed -ne $false -or $capsuleManifestContract.guard.plugin_call_performed -ne $false -or $capsuleManifestContract.guard.api_call_performed -ne $false -or $capsuleManifestContract.guard.DailyNote_write_performed -ne $false -or $capsuleManifestContract.guard.VCP_memory_write_performed -ne $false -or $capsuleManifestContract.guard.runtime_execution_performed -ne $false -or $capsuleManifestContract.guard.real_manifest_read_performed -ne $false -or $capsuleManifestContract.guard.real_vcpchat_read_performed -ne $false -or $capsuleManifestContract.guard.real_vcptoolbox_read_performed -ne $false) {
      & $AddFailure "Capsule manifest contract validation must remain local-only with no external, memory, runtime, image, or source-read actions"
    }
  }

  $capsuleManifestSchemaBindingOutput = & node (Join-Path $Root 'scripts/validate_capsule_manifest_schema_runtime_binding.js')
  if ($LASTEXITCODE -ne 0) {
    & $AddFailure "Capsule manifest schema/runtime binding validation exited with failure"
  } else {
    $capsuleManifestSchemaBinding = ($capsuleManifestSchemaBindingOutput -join "`n") | ConvertFrom-Json
    if ($capsuleManifestSchemaBinding.passed -ne $true -or $capsuleManifestSchemaBinding.status -ne 'capsule_manifest_schema_runtime_binding_verified') {
      & $AddFailure "Capsule manifest schema/runtime binding validator must pass"
    }
    if ($capsuleManifestSchemaBinding.no_capsule_created -ne $true -or $capsuleManifestSchemaBinding.preview_creation_or_copy_performed -ne $false -or $capsuleManifestSchemaBinding.image_generation_performed -ne $false -or $capsuleManifestSchemaBinding.provider_contact_performed -ne $false -or $capsuleManifestSchemaBinding.plugin_call_performed -ne $false -or $capsuleManifestSchemaBinding.api_call_performed -ne $false -or $capsuleManifestSchemaBinding.DailyNote_write_performed -ne $false -or $capsuleManifestSchemaBinding.VCP_memory_write_performed -ne $false -or $capsuleManifestSchemaBinding.runtime_execution_performed -ne $false -or $capsuleManifestSchemaBinding.real_manifest_read_performed -ne $false -or $capsuleManifestSchemaBinding.real_vcpchat_read_performed -ne $false -or $capsuleManifestSchemaBinding.real_vcptoolbox_read_performed -ne $false) {
      & $AddFailure "Capsule manifest schema/runtime binding validator must remain no-capsule, local-only, and no-external"
    }
  }
  $capsuleRegistryReportV2Output = & node (Join-Path $Root 'scripts/validate_capsule_registry_report_v2.js')
  if ($LASTEXITCODE -ne 0) {
    & $AddFailure "Capsule registry report v2 validation exited with failure"
  } else {
    $capsuleRegistryReportV2 = ($capsuleRegistryReportV2Output -join "`n") | ConvertFrom-Json
    if ($capsuleRegistryReportV2.passed -ne $true -or $capsuleRegistryReportV2.phase -ne 'p6b_capsule_registry_report_v2' -or $capsuleRegistryReportV2.report_version -ne 'accepted_failure_capsule_registry_report_v2') {
      & $AddFailure "Capsule registry report v2 must pass with the expected phase and report version"
    }
    if ($capsuleRegistryReportV2.totals.accepted -ne 2 -or $capsuleRegistryReportV2.totals.failure -ne 2 -or $capsuleRegistryReportV2.totals.total -ne 4 -or $capsuleRegistryReportV2.totals.passed -ne 4 -or $capsuleRegistryReportV2.totals.failed -ne 0) {
      & $AddFailure "Capsule registry report v2 must preserve accepted=2, failure=2, total=4, passed=4, failed=0"
    }
    if ($capsuleRegistryReportV2.resolved_by_links.Count -lt 2 -or $capsuleRegistryReportV2.failure_class_summary.missing_resolved_by_link -ne 0 -or $capsuleRegistryReportV2.failure_class_summary.production_or_memory_guard_violation -ne 0) {
      & $AddFailure "Capsule registry report v2 must preserve resolved-by links and clean failure guard summary"
    }
    if ($capsuleRegistryReportV2.guard.old_runs_source_required_for_portable_validation -ne $false -or $capsuleRegistryReportV2.guard.preview_creation_or_copy_performed -ne $false -or $capsuleRegistryReportV2.guard.accepted_samples_write_performed -ne $false -or $capsuleRegistryReportV2.guard.failure_samples_write_performed -ne $false) {
      & $AddFailure "Capsule registry report v2 must not require old runs source or mutate capsule files"
    }
  if ($capsuleRegistryReportV2.guard.provider_contact_performed -ne $false -or $capsuleRegistryReportV2.guard.plugin_call_performed -ne $false -or $capsuleRegistryReportV2.guard.api_call_performed -ne $false -or $capsuleRegistryReportV2.guard.image_generation_performed -ne $false -or $capsuleRegistryReportV2.guard.DailyNote_write_performed -ne $false -or $capsuleRegistryReportV2.guard.VCP_memory_write_performed -ne $false -or $capsuleRegistryReportV2.guard.runtime_execution_performed -ne $false -or $capsuleRegistryReportV2.guard.real_manifest_read_performed -ne $false -or $capsuleRegistryReportV2.guard.real_vcpchat_read_performed -ne $false -or $capsuleRegistryReportV2.guard.real_vcptoolbox_read_performed -ne $false -or $capsuleRegistryReportV2.guard.production_candidate_write_performed -ne $false -or $capsuleRegistryReportV2.guard.push_tag_release_deploy_performed -ne $false -or $capsuleRegistryReportV2.guard.vcp_runtime_integration_proven -ne $false) {
      & $AddFailure "Capsule registry report v2 must remain local-only with no external, memory, runtime, production, or remote actions"
    }
  }

  $capsuleRegistryReportV2NegativeOutput = & node (Join-Path $Root 'scripts/validate_capsule_registry_report_v2_negative_states.js')
  if ($LASTEXITCODE -ne 0) {
    & $AddFailure "Capsule registry report v2 negative-state validation exited with failure"
  } else {
    $capsuleRegistryReportV2Negative = ($capsuleRegistryReportV2NegativeOutput -join "`n") | ConvertFrom-Json
    if ($capsuleRegistryReportV2Negative.passed -ne $true -or $capsuleRegistryReportV2Negative.phase -ne 'p6g_registry_report_v2_negative_state_design' -or $capsuleRegistryReportV2Negative.scenario_count -ne 4) {
      & $AddFailure "Capsule registry report v2 negative-state validation must pass with expected phase and scenario count"
    }
    foreach ($requiredNegativeClass in @('accepted_registry_failed', 'failure_registry_failed', 'missing_resolved_by_link', 'production_or_memory_guard_violation')) {
      if ($capsuleRegistryReportV2Negative.negative_state_classes -notcontains $requiredNegativeClass) {
        & $AddFailure "Capsule registry report v2 negative-state validation must cover $requiredNegativeClass"
      }
    }
    if ($capsuleRegistryReportV2Negative.no_real_capsule_modified -ne $true -or $capsuleRegistryReportV2Negative.no_third_capsule_creation -ne $true) {
      & $AddFailure "Capsule registry report v2 negative-state validation must avoid real capsule mutation and third capsule creation"
    }
    if ($capsuleRegistryReportV2Negative.guard.provider_contact_performed -ne $false -or $capsuleRegistryReportV2Negative.guard.plugin_call_performed -ne $false -or $capsuleRegistryReportV2Negative.guard.api_call_performed -ne $false -or $capsuleRegistryReportV2Negative.guard.image_generation_performed -ne $false -or $capsuleRegistryReportV2Negative.guard.DailyNote_write_performed -ne $false -or $capsuleRegistryReportV2Negative.guard.VCP_memory_write_performed -ne $false -or $capsuleRegistryReportV2Negative.guard.runtime_execution_performed -ne $false -or $capsuleRegistryReportV2Negative.guard.real_manifest_read_performed -ne $false -or $capsuleRegistryReportV2Negative.guard.real_vcpchat_read_performed -ne $false -or $capsuleRegistryReportV2Negative.guard.real_vcptoolbox_read_performed -ne $false -or $capsuleRegistryReportV2Negative.guard.production_candidate_write_performed -ne $false -or $capsuleRegistryReportV2Negative.guard.push_tag_release_deploy_performed -ne $false) {
      & $AddFailure "Capsule registry report v2 negative-state validation must remain local-only with no external, memory, runtime, production, or remote actions"
    }
  }

  $capsuleStaticProductSmokeFixtureOutput = & node (Join-Path $Root 'scripts/validate_capsule_static_product_smoke_fixture.js')
  if ($LASTEXITCODE -ne 0) {
    & $AddFailure "Capsule static product smoke fixture validation exited with failure"
  } else {
    $capsuleStaticProductSmokeFixture = ($capsuleStaticProductSmokeFixtureOutput -join "`n") | ConvertFrom-Json
    if ($capsuleStaticProductSmokeFixture.passed -ne $true -or $capsuleStaticProductSmokeFixture.status -ne 'capsule_static_product_smoke_fixture_verified') {
      & $AddFailure "Capsule static product smoke fixture must pass"
    }
    if ($capsuleStaticProductSmokeFixture.accepted_count -ne 2 -or $capsuleStaticProductSmokeFixture.failure_count -ne 2 -or $capsuleStaticProductSmokeFixture.total_count -ne 4) {
      & $AddFailure "Capsule static product smoke fixture must preserve accepted=2, failure=2, total=4"
    }
    if ($capsuleStaticProductSmokeFixture.browser_runtime_validator_executed -ne $false -or $capsuleStaticProductSmokeFixture.asset_archive_ui_read_performed -ne $false -or $capsuleStaticProductSmokeFixture.preview_loaded_or_rendered -ne $false -or $capsuleStaticProductSmokeFixture.provider_contact_performed -ne $false -or $capsuleStaticProductSmokeFixture.plugin_call_performed -ne $false -or $capsuleStaticProductSmokeFixture.api_call_performed -ne $false -or $capsuleStaticProductSmokeFixture.image_generation_performed -ne $false -or $capsuleStaticProductSmokeFixture.DailyNote_write_performed -ne $false -or $capsuleStaticProductSmokeFixture.VCP_memory_write_performed -ne $false -or $capsuleStaticProductSmokeFixture.production_candidate_write_performed -ne $false) {
      & $AddFailure "Capsule static product smoke fixture must remain static-only with no browser runtime, asset UI read, preview load, external, memory, or production actions"
    }
  }
  $capsuleStaticProductSmokeReviewConsoleSnapshotOutput = & node (Join-Path $Root 'scripts/validate_capsule_static_product_smoke_review_console_snapshot.js')
  if ($LASTEXITCODE -ne 0) {
    & $AddFailure "Capsule static product smoke Review Console snapshot validation exited with failure"
  } else {
    $capsuleStaticProductSmokeReviewConsoleSnapshot = ($capsuleStaticProductSmokeReviewConsoleSnapshotOutput -join "`n") | ConvertFrom-Json
    if ($capsuleStaticProductSmokeReviewConsoleSnapshot.passed -ne $true -or $capsuleStaticProductSmokeReviewConsoleSnapshot.status -ne 'capsule_static_product_smoke_review_console_snapshot_verified') {
      & $AddFailure "Capsule static product smoke Review Console snapshot must pass"
    }
    if ($capsuleStaticProductSmokeReviewConsoleSnapshot.totals.accepted -ne 2 -or $capsuleStaticProductSmokeReviewConsoleSnapshot.totals.failure -ne 2 -or $capsuleStaticProductSmokeReviewConsoleSnapshot.totals.total -ne 4) {
      & $AddFailure "Capsule static product smoke Review Console snapshot must preserve accepted=2, failure=2, total=4"
    }
    if ($capsuleStaticProductSmokeReviewConsoleSnapshot.browser_runtime_validator_executed -ne $false -or $capsuleStaticProductSmokeReviewConsoleSnapshot.asset_archive_ui_read_performed -ne $false -or $capsuleStaticProductSmokeReviewConsoleSnapshot.preview_loaded_or_rendered -ne $false) {
      & $AddFailure "Capsule static product smoke Review Console snapshot must remain static-only with no browser runtime, asset UI read, or preview load"
    }
  }

  }

  if ($Section -eq 'PostRuns' -or $Section -eq 'All') {
  $capsuleStaticOperatorChecklistUiMappingOutput = & node (Join-Path $Root 'scripts/validate_capsule_static_operator_checklist_ui_mapping.js')
  if ($LASTEXITCODE -ne 0) {
    & $AddFailure "Capsule static operator checklist UI mapping validation exited with failure"
  } else {
    $capsuleStaticOperatorChecklistUiMapping = ($capsuleStaticOperatorChecklistUiMappingOutput -join "`n") | ConvertFrom-Json
    if ($capsuleStaticOperatorChecklistUiMapping.passed -ne $true -or $capsuleStaticOperatorChecklistUiMapping.status -ne 'capsule_static_operator_checklist_ui_mapping_verified') {
      & $AddFailure "Capsule static operator checklist UI mapping must pass"
    }
    if ($capsuleStaticOperatorChecklistUiMapping.accepted_count -ne 2 -or $capsuleStaticOperatorChecklistUiMapping.failure_count -ne 2 -or $capsuleStaticOperatorChecklistUiMapping.total_count -ne 4) {
      & $AddFailure "Capsule static operator checklist UI mapping must preserve accepted=2, failure=2, total=4"
    }
    if ($capsuleStaticOperatorChecklistUiMapping.executable_ui_buttons_created -ne $false -or $capsuleStaticOperatorChecklistUiMapping.browser_validator_executed -ne $false -or $capsuleStaticOperatorChecklistUiMapping.runtime_execution_performed -ne $false -or $capsuleStaticOperatorChecklistUiMapping.asset_archive_ui_read_performed -ne $false -or $capsuleStaticOperatorChecklistUiMapping.preview_loaded_or_rendered -ne $false -or $capsuleStaticOperatorChecklistUiMapping.provider_contact_performed -ne $false -or $capsuleStaticOperatorChecklistUiMapping.plugin_call_performed -ne $false -or $capsuleStaticOperatorChecklistUiMapping.api_call_performed -ne $false -or $capsuleStaticOperatorChecklistUiMapping.image_generation_performed -ne $false -or $capsuleStaticOperatorChecklistUiMapping.DailyNote_write_performed -ne $false -or $capsuleStaticOperatorChecklistUiMapping.VCP_memory_write_performed -ne $false -or $capsuleStaticOperatorChecklistUiMapping.production_candidate_write_performed -ne $false) {
      & $AddFailure "Capsule static operator checklist UI mapping must remain static-only with no executable UI, runtime, asset UI read, preview load, external, memory, or production actions"
    }
  }
  $capsuleOperatorReviewerActionMatrixOutput = & node (Join-Path $Root 'scripts/validate_capsule_operator_reviewer_action_matrix.js')
  if ($LASTEXITCODE -ne 0) {
    & $AddFailure "Capsule operator reviewer action matrix validation exited with failure"
  } else {
    $capsuleOperatorReviewerActionMatrix = ($capsuleOperatorReviewerActionMatrixOutput -join "`n") | ConvertFrom-Json
    if ($capsuleOperatorReviewerActionMatrix.passed -ne $true -or $capsuleOperatorReviewerActionMatrix.status -ne 'capsule_operator_reviewer_action_matrix_verified') {
      & $AddFailure "Capsule operator reviewer action matrix must pass"
    }
    if ($capsuleOperatorReviewerActionMatrix.accepted_count -ne 2 -or $capsuleOperatorReviewerActionMatrix.failure_count -ne 2 -or $capsuleOperatorReviewerActionMatrix.total_count -ne 4) {
      & $AddFailure "Capsule operator reviewer action matrix must preserve accepted=2, failure=2, total=4"
    }
    if ($capsuleOperatorReviewerActionMatrix.runtime_execution_performed -ne $false -or $capsuleOperatorReviewerActionMatrix.asset_archive_ui_read_performed -ne $false -or $capsuleOperatorReviewerActionMatrix.preview_loaded_or_rendered -ne $false -or $capsuleOperatorReviewerActionMatrix.provider_contact_performed -ne $false -or $capsuleOperatorReviewerActionMatrix.plugin_call_performed -ne $false -or $capsuleOperatorReviewerActionMatrix.api_call_performed -ne $false -or $capsuleOperatorReviewerActionMatrix.image_generation_performed -ne $false -or $capsuleOperatorReviewerActionMatrix.DailyNote_write_performed -ne $false -or $capsuleOperatorReviewerActionMatrix.VCP_memory_write_performed -ne $false -or $capsuleOperatorReviewerActionMatrix.production_candidate_write_performed -ne $false) {
      & $AddFailure "Capsule operator reviewer action matrix must remain static-only with no runtime, asset UI read, preview load, external, memory, or production actions"
    }
  }
  $reviewConsoleRegistryReportV2Output = & node (Join-Path $Root 'scripts/validate_review_console_registry_report_v2_state.js')
  if ($LASTEXITCODE -ne 0) {
    & $AddFailure "Review Console registry report v2 state validation exited with failure"
  } else {
    $reviewConsoleRegistryReportV2 = ($reviewConsoleRegistryReportV2Output -join "`n") | ConvertFrom-Json
    if ($reviewConsoleRegistryReportV2.passed -ne $true -or $reviewConsoleRegistryReportV2.phase -ne 'p6c_review_console_registry_report_v2_state' -or $reviewConsoleRegistryReportV2.draft_output_key -ne 'registry_report_v2_state') {
      & $AddFailure "Review Console registry report v2 state must pass with expected phase and draft output key"
    }
    if ($reviewConsoleRegistryReportV2.accepted_count -ne 2 -or $reviewConsoleRegistryReportV2.failure_count -ne 2 -or $reviewConsoleRegistryReportV2.total_count -ne 4 -or $reviewConsoleRegistryReportV2.passed_count -ne 4 -or $reviewConsoleRegistryReportV2.failed_count_total -ne 0) {
      & $AddFailure "Review Console registry report v2 state must preserve accepted=2, failure=2, total=4, passed=4, failed=0"
    }
    if ($reviewConsoleRegistryReportV2.relation_count -lt 2 -or $reviewConsoleRegistryReportV2.old_runs_source_required_for_portable_validation -ne $false) {
      & $AddFailure "Review Console registry report v2 state must expose relation and avoid old runs dependency"
    }
    if ($reviewConsoleRegistryReportV2.fetch_performed -ne $false -or $reviewConsoleRegistryReportV2.file_write_performed -ne $false -or $reviewConsoleRegistryReportV2.asset_archive_read_performed -ne $false -or $reviewConsoleRegistryReportV2.preview_loaded_or_rendered -ne $false -or $reviewConsoleRegistryReportV2.preview_creation_or_copy_performed -ne $false) {
      & $AddFailure "Review Console registry report v2 state must not fetch, write, read asset_archive, load preview, or create/copy preview"
    }
    if ($reviewConsoleRegistryReportV2.provider_contact_performed -ne $false -or $reviewConsoleRegistryReportV2.plugin_call_performed -ne $false -or $reviewConsoleRegistryReportV2.api_call_performed -ne $false -or $reviewConsoleRegistryReportV2.image_generation_performed -ne $false -or $reviewConsoleRegistryReportV2.DailyNote_write_performed -ne $false -or $reviewConsoleRegistryReportV2.VCP_memory_write_performed -ne $false -or $reviewConsoleRegistryReportV2.runtime_execution_performed -ne $false -or $reviewConsoleRegistryReportV2.real_manifest_read_performed -ne $false -or $reviewConsoleRegistryReportV2.real_vcpchat_read_performed -ne $false -or $reviewConsoleRegistryReportV2.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleRegistryReportV2.production_candidate_write_performed -ne $false -or $reviewConsoleRegistryReportV2.push_tag_release_deploy_performed -ne $false -or $reviewConsoleRegistryReportV2.vcp_runtime_integration_proven -ne $false) {
      & $AddFailure "Review Console registry report v2 state must remain static-only with no external, memory, runtime, production, or remote actions"
    }
  }

  $reviewConsoleRegistryReportV2NegativeVisibilityOutput = & node (Join-Path $Root 'scripts/validate_review_console_registry_report_v2_negative_visibility.js')
  if ($LASTEXITCODE -ne 0) {
    & $AddFailure "Review Console registry report v2 negative visibility validation exited with failure"
  } else {
    $reviewConsoleRegistryReportV2NegativeVisibility = ($reviewConsoleRegistryReportV2NegativeVisibilityOutput -join "`n") | ConvertFrom-Json
    if ($reviewConsoleRegistryReportV2NegativeVisibility.passed -ne $true -or $reviewConsoleRegistryReportV2NegativeVisibility.phase -ne 'p6i_review_console_registry_report_v2_negative_visibility' -or $reviewConsoleRegistryReportV2NegativeVisibility.draft_output_key -ne 'registry_report_v2_negative_visibility_state') {
      & $AddFailure "Review Console registry report v2 negative visibility must pass with expected phase and draft output key"
    }
    if ($reviewConsoleRegistryReportV2NegativeVisibility.scenario_count -ne 4 -or $reviewConsoleRegistryReportV2NegativeVisibility.negative_state_class_count -ne 4) {
      & $AddFailure "Review Console registry report v2 negative visibility must preserve four negative-state classes and scenarios"
    }
    if ($reviewConsoleRegistryReportV2NegativeVisibility.report_can_stay_green -ne $false -or $reviewConsoleRegistryReportV2NegativeVisibility.relation_can_be_hidden -ne $false -or $reviewConsoleRegistryReportV2NegativeVisibility.guard_violation_can_be_summarized_away -ne $false) {
      & $AddFailure "Review Console registry report v2 negative visibility must keep fail-closed contract visible"
    }
    if ($reviewConsoleRegistryReportV2NegativeVisibility.fetch_performed -ne $false -or $reviewConsoleRegistryReportV2NegativeVisibility.file_write_performed -ne $false -or $reviewConsoleRegistryReportV2NegativeVisibility.asset_archive_read_performed -ne $false -or $reviewConsoleRegistryReportV2NegativeVisibility.preview_loaded_or_rendered -ne $false -or $reviewConsoleRegistryReportV2NegativeVisibility.preview_creation_or_copy_performed -ne $false) {
      & $AddFailure "Review Console registry report v2 negative visibility must not fetch, write, read asset_archive, load preview, or create/copy preview"
    }
    if ($reviewConsoleRegistryReportV2NegativeVisibility.provider_contact_performed -ne $false -or $reviewConsoleRegistryReportV2NegativeVisibility.plugin_call_performed -ne $false -or $reviewConsoleRegistryReportV2NegativeVisibility.api_call_performed -ne $false -or $reviewConsoleRegistryReportV2NegativeVisibility.image_generation_performed -ne $false -or $reviewConsoleRegistryReportV2NegativeVisibility.DailyNote_write_performed -ne $false -or $reviewConsoleRegistryReportV2NegativeVisibility.VCP_memory_write_performed -ne $false -or $reviewConsoleRegistryReportV2NegativeVisibility.runtime_execution_performed -ne $false -or $reviewConsoleRegistryReportV2NegativeVisibility.real_manifest_read_performed -ne $false -or $reviewConsoleRegistryReportV2NegativeVisibility.real_vcpchat_read_performed -ne $false -or $reviewConsoleRegistryReportV2NegativeVisibility.real_vcptoolbox_read_performed -ne $false -or $reviewConsoleRegistryReportV2NegativeVisibility.production_candidate_write_performed -ne $false -or $reviewConsoleRegistryReportV2NegativeVisibility.push_tag_release_deploy_performed -ne $false -or $reviewConsoleRegistryReportV2NegativeVisibility.vcp_runtime_integration_proven -ne $false) {
      & $AddFailure "Review Console registry report v2 negative visibility must remain static-only with no external, memory, runtime, production, or remote actions"
    }
  }

  }
}

if ($MyInvocation.InvocationName -ne '.') {
  $capsuleProductCoreFailures = @()
  $addCapsuleProductCoreFailure = {
    param([string]$Message)
    $script:capsuleProductCoreFailures += $Message
  }
  $repoRoot = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
  Invoke-CapsuleProductCoreValidation -Root $repoRoot -AddFailure $addCapsuleProductCoreFailure -Section All

  if ($capsuleProductCoreFailures.Count -gt 0) {
    foreach ($failure in $capsuleProductCoreFailures) {
      Write-Error $failure
    }
    exit 1
  }

  Write-Output "Capsule product-core validation passed."
}
