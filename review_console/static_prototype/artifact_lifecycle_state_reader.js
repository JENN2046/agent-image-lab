"use strict";

(function exposeArtifactLifecycleStateReader(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ArtifactLifecycleStateReader = api;
  }
})(typeof window !== "undefined" ? window : globalThis, function createArtifactLifecycleStateReader() {
  const forbiddenGuardFields = [
    "fetch_performed",
    "file_write_performed",
    "provider_contact_performed",
    "plugin_call_performed",
    "api_call_performed",
    "mcp_runtime_performed",
    "DailyNote_write_performed",
    "VCP_memory_write_performed",
    "accepted_samples_write_performed",
    "failure_samples_write_performed",
    "production_candidate_write_performed",
    "durable_archive_copy_performed",
    "real_manifest_read_performed",
    "real_vcpchat_read_performed",
    "real_vcptoolbox_read_performed",
    "push_tag_release_deploy_performed",
    "vcp_runtime_integration_proven"
  ];

  function arrayOf(value) {
    return Array.isArray(value) ? value : [];
  }

  function bool(value) {
    return value === true;
  }

  function isMissing(value) {
    return value === undefined || value === null || value === "";
  }

  function normalizeRecord(record) {
    const humanApproved = record.human_approval_status === "approved" && !isMissing(record.approved_by);
    const hasRecoverabilityEvidence =
      !isMissing(record.artifact_ref) &&
      !isMissing(record.sha256) &&
      !isMissing(record.dimensions) &&
      !isMissing(record.mime) &&
      !isMissing(record.prompt_package_ref) &&
      !isMissing(record.import_record_ref) &&
      !isMissing(record.review_record_ref);
    const categoryLinked = !isMissing(record.category_index_ref);
    const registryLinked = !isMissing(record.accepted_registry_ref);
    const acceptedMetadataRegistered = record.accepted_samples_metadata_registered === true;
    const recoverable =
      record.lifecycle_state === "recoverable" &&
      acceptedMetadataRegistered &&
      humanApproved &&
      hasRecoverabilityEvidence &&
      categoryLinked &&
      registryLinked;
    const blockedRegistration =
      record.accepted_samples_registration_eligible === false ||
      record.registration_blocker === "human_approval_missing" ||
      record.human_approval_status === "pending";

    return {
      sample_id: record.sample_id || null,
      candidate_id: record.candidate_id || null,
      visual_task: record.visual_task || null,
      lifecycle_state: record.lifecycle_state || "unknown",
      recoverability_status: recoverable ? "workspace_local_verified" : (record.recoverability_status || "not_recoverable"),
      artifact_ref: record.artifact_ref || null,
      sha256: record.sha256 || null,
      dimensions: record.dimensions || null,
      mime: record.mime || null,
      prompt_package_ref: record.prompt_package_ref || null,
      import_record_ref: record.import_record_ref || null,
      review_record_ref: record.review_record_ref || null,
      human_approval_status: record.human_approval_status || "missing",
      approved_by: record.approved_by || null,
      accepted_samples_metadata_registered: acceptedMetadataRegistered,
      accepted_samples_registration_eligible: record.accepted_samples_registration_eligible === true,
      registration_blocker: record.registration_blocker || null,
      category_index_ref: record.category_index_ref || null,
      accepted_registry_ref: record.accepted_registry_ref || null,
      production_candidate_status: record.production_candidate_status || "not_created",
      prompt_to_artifact_completion: {
        score: typeof record.prompt_to_artifact_completion?.score === "number" ? record.prompt_to_artifact_completion.score : null,
        status: record.prompt_to_artifact_completion?.status || "not_assessed",
        evidence: arrayOf(record.prompt_to_artifact_completion?.evidence),
        blocker: record.prompt_to_artifact_completion?.blocker || null
      },
      artifact_recoverability_is_not_vcp_runtime_integration: record.artifact_recoverability_is_not_vcp_runtime_integration === true,
      vcp_runtime_integration_proven: bool(record.vcp_runtime_integration_proven),
      has_recoverability_evidence: hasRecoverabilityEvidence,
      human_approved: humanApproved,
      category_linked: categoryLinked,
      registry_linked: registryLinked,
      recoverable,
      blocked_registration: blockedRegistration
    };
  }

  function normalizeArtifactLifecycleState(input) {
    const source = input || {};
    const records = arrayOf(source.records).map(normalizeRecord);
    const guard = source.guard || {};
    const guardFailures = forbiddenGuardFields.filter((field) => guard[field] === true);
    const recoverableAccepted = records.filter((record) => record.recoverable);
    const blockedCandidates = records.filter((record) => record.blocked_registration && !record.recoverable);
    const runtimeClaims = records.filter((record) => record.vcp_runtime_integration_proven === true);
    const pendingCountedAsAccepted = source.dashboard_counts?.pending_candidate_counted_as_accepted === true;
    const hardAcceptanceMet = recoverableAccepted.length >= 3;
    const errors = [];

    if (guardFailures.length > 0) {
      errors.push(`forbidden guard flags are true: ${guardFailures.join(", ")}`);
    }
    if (runtimeClaims.length > 0) {
      errors.push("one or more lifecycle records claim VCP runtime integration");
    }
    if (pendingCountedAsAccepted) {
      errors.push("pending candidate was counted as accepted");
    }
    if (source.dashboard_counts?.hard_acceptance_three_full_samples_met === true && !hardAcceptanceMet) {
      errors.push("three-sample hard acceptance was overclaimed");
    }

    return {
      reader_version: "v1",
      source_mode: source.source_mode || "static_local_object",
      parse_status: errors.length === 0 ? "parsed" : "blocked",
      errors,
      records,
      counts: {
        total_records: records.length,
        recoverable_accepted_sample_count: recoverableAccepted.length,
        blocked_registration_candidate_count: blockedCandidates.length,
        remaining_full_recoverable_sample_gap: Math.max(0, 3 - recoverableAccepted.length),
        hard_acceptance_three_full_samples_met: hardAcceptanceMet,
        pending_candidate_counted_as_accepted: pendingCountedAsAccepted
      },
      guard: {
        parsed_in_memory: true,
        static_reader_only: true,
        fetch_performed: false,
        file_write_performed: false,
        provider_contact_performed: false,
        plugin_call_performed: false,
        api_call_performed: false,
        mcp_runtime_performed: false,
        DailyNote_write_performed: false,
        VCP_memory_write_performed: false,
        accepted_samples_write_performed: false,
        failure_samples_write_performed: false,
        production_candidate_write_performed: false,
        durable_archive_copy_performed: false,
        real_manifest_read_performed: false,
        real_vcpchat_read_performed: false,
        real_vcptoolbox_read_performed: false,
        push_tag_release_deploy_performed: false,
        artifact_recoverability_is_not_vcp_runtime_integration: true,
        vcp_runtime_integration_proven: false,
        guard_failures: guardFailures
      }
    };
  }

  return {
    normalizeArtifactLifecycleState,
    forbiddenGuardFields
  };
});
