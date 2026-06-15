#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const docRef = "docs/generation_channel_contract_preflight.md";
const fixtureRef = "tests/schema_examples/generation_channel_contract_preflight.example.json";

function readText(ref) {
  return fs.readFileSync(path.join(repoRoot, ref), "utf8");
}

function readJson(ref) {
  return JSON.parse(readText(ref));
}

function exists(ref) {
  return fs.existsSync(path.join(repoRoot, ref));
}

const doc = readText(docRef);
const fixture = readJson(fixtureRef).generation_channel_contract_preflight;
const results = [];

function check(name, predicate) {
  let passed = false;
  let detail = null;
  try {
    passed = Boolean(predicate());
  } catch (error) {
    detail = error.message;
  }
  results.push(detail ? { check: name, passed, detail } : { check: name, passed });
}

function allFlagsFalse(flags) {
  return Object.values(flags).every((value) => value === false);
}

function loadEvidence(trialKey) {
  const refs = fixture.evidence_base[trialKey];
  return {
    refs,
    binding: readJson(refs.binding_packet_ref),
    artifact: readJson(refs.artifact_record_ref),
    review: readJson(refs.review_decision_ref),
    task: readJson(refs.runtime_task_fixture_ref),
    memory: refs.memory_candidate_gate_ref ? readJson(refs.memory_candidate_gate_ref) : null,
  };
}

const trial001 = loadEvidence("trial_001");
const trial002 = loadEvidence("trial_002");
const objects = fixture.contract_objects;
const snapshots = fixture.trial_contract_snapshots;

check("doc_exists", () => doc.length > 0);
check("fixture_phase_matches_doc", () => doc.includes(fixture.phase));
check("parent_plan_ref_exists", () => fixture.parent_plan_ref === "docs/vcptoolbox_image_execution_broker_followup_plan.md" && exists(fixture.parent_plan_ref));
check("status_is_no_execute", () =>
  fixture.status === "local_contract_preflight_no_execute" &&
  fixture.automatic_real_execution_allowed_by_this_contract === false &&
  fixture.external_repo_write_allowed_by_this_contract === false &&
  doc.includes("It does not implement the VCPToolBox broker")
);
check("evidence_refs_exist", () =>
  Object.values(fixture.evidence_base).every((refs) =>
    Object.values(refs).every((ref) => typeof ref === "string" && exists(ref))
  )
);
check("contract_objects_present", () =>
  [
    "VisualJobContract",
    "ShotPlan",
    "ReviewPolicy",
    "ImageRunCapabilityRef",
    "RestrictedPluginFacadeBoundary",
    "ArtifactReceiptGate",
    "ReviewQueueGate",
    "MemoryCandidateGate",
  ].every((name) => Boolean(objects[name]))
);
check("visual_job_contract_boundary", () =>
  objects.VisualJobContract.owned_by === "Agent_Image_Lab" &&
  objects.VisualJobContract.required_fields.includes("image_run_capability_ref") &&
  objects.VisualJobContract.required_fields.includes("canonical_contract_hash") &&
  objects.VisualJobContract.stable_constraints.max_images === 1 &&
  objects.VisualJobContract.stable_constraints.retry_allowed === false &&
  objects.VisualJobContract.stable_constraints.secret_value_read_allowed === false &&
  objects.VisualJobContract.must_not_include_dispatch_authority.includes("arbitrary_plugin")
);
check("shot_plan_is_visual_not_runtime_secret", () =>
  objects.ShotPlan.required_fields.includes("product_geometry_anchors") &&
  objects.ShotPlan.required_fields.includes("negative_controls") &&
  objects.ShotPlan.must_not_include.includes("provider_secret") &&
  objects.ShotPlan.must_not_include.includes("live_auth_header")
);
check("review_policy_defaults_block_writes", () => {
  const defaults = objects.ReviewPolicy.stable_defaults;
  return defaults.required_status_after_generation === "generated_unreviewed" &&
    defaults.human_review_required_before_archive === true &&
    defaults.commercial_delivery_ready_default === false &&
    defaults.accepted_samples_write_default === false &&
    defaults.production_candidate_write_default === false &&
    defaults.DailyNote_write_default === false &&
    defaults.VCP_memory_write_default === false &&
    defaults.memory_candidate_allowed_after_human_review === true;
});
check("image_run_capability_is_ref_only", () =>
  objects.ImageRunCapabilityRef.owned_by === "VCPToolBox" &&
  objects.ImageRunCapabilityRef.carried_by_AIL_payload_as_ref_only === true &&
  objects.ImageRunCapabilityRef.dispatch_rule === "VCPToolBox_internal_binding_is_authoritative" &&
  objects.ImageRunCapabilityRef.required_fields.includes("provider_id_ref") &&
  objects.ImageRunCapabilityRef.required_fields.includes("plugin_id_ref") &&
  objects.ImageRunCapabilityRef.stable_budget.max_provider_calls === 1 &&
  objects.ImageRunCapabilityRef.stable_budget.max_images === 1 &&
  objects.ImageRunCapabilityRef.stable_budget.retry_allowed === false
);
check("restricted_facade_boundary_is_narrow", () => {
  const controls = objects.RestrictedPluginFacadeBoundary.required_controls;
  const facade = fixture.restricted_plugin_facade_boundary;
  return controls.allowed_plugin_ref === "DoubaoGen" &&
    controls.allowed_api_ref === "generate_image" &&
    controls.max_calls === 1 &&
    controls.distributed_fallback === false &&
    controls.manifest_scan_during_request === false &&
    controls.arbitrary_plugin_name === false &&
    controls.full_pluginManager_exposed_to_route === false &&
    facade.allowed_plugin_ref === controls.allowed_plugin_ref &&
    facade.allowed_api_ref === controls.allowed_api_ref &&
    facade.full_pluginManager_exposed_to_route === false;
});
check("artifact_receipt_review_memory_gates_present", () =>
  objects.ArtifactReceiptGate.required_success_refs.includes("receipt_ref") &&
  objects.ArtifactReceiptGate.required_success_refs.includes("artifact_record_ref") &&
  objects.ArtifactReceiptGate.required_success_refs.includes("review_bridge_ref") &&
  objects.ArtifactReceiptGate.artifact_record_required_fields.includes("output_files") &&
  objects.ArtifactReceiptGate.output_file_required_fields.includes("sha256") &&
  objects.ReviewQueueGate.allowed_decisions.includes("accepted_candidate") &&
  objects.ReviewQueueGate.default_post_review_writes.accepted_samples_write_allowed === false &&
  objects.MemoryCandidateGate.memory_write_default === false &&
  objects.MemoryCandidateGate.required_for_actual_write.includes("separate_memory_authorization_gate")
);
check("two_trial_snapshots_present", () =>
  snapshots.length === 2 &&
  snapshots[0].trial_id === "r2r_v2_trial_001_serum_detail_control" &&
  snapshots[1].trial_id === "r2r_v2_trial_002_lantern_ecommerce_hero"
);

function snapshotMatchesEvidence(snapshot, evidence) {
  const binding = evidence.binding;
  const artifact = evidence.artifact;
  const review = evidence.review;
  const task = evidence.task;
  const executionBinding = binding.execution_binding;
  const outputPolicy = binding.output_policy;
  const visualJob = snapshot.visual_job_contract;
  const capability = snapshot.image_run_capability_ref;

  return visualJob.prompt_package_ref === binding.source_refs.prompt_package_ref &&
    visualJob.prompt_package_ref === task.prompt_package_ref &&
    visualJob.output_directory_ref === outputPolicy.output_directory_ref &&
    visualJob.output_directory_ref === task.output_directory_ref &&
    visualJob.expected_receipt_ref === outputPolicy.expected_receipt_ref &&
    visualJob.expected_artifact_record_ref === outputPolicy.expected_artifact_record_ref &&
    visualJob.expected_review_bridge_ref === outputPolicy.expected_review_bridge_ref &&
    visualJob.expected_artifact_record_ref === evidence.refs.artifact_record_ref &&
    visualJob.expected_review_bridge_ref === artifact.review_bridge_ref &&
    capability.activation_id_ref === executionBinding.activation_package_id &&
    capability.route_id_or_endpoint_ref === executionBinding.path &&
    capability.binding_packet_ref === evidence.refs.binding_packet_ref &&
    capability.provider_id_ref === executionBinding.provider_id &&
    capability.provider_id_ref === artifact.provider_id &&
    capability.plugin_id_ref === executionBinding.plugin_id &&
    capability.plugin_id_ref === artifact.plugin_id &&
    capability.api_id_ref === executionBinding.api_id &&
    capability.api_id_ref === artifact.api_id &&
    capability.model_allowlist.includes(executionBinding.model_required) &&
    capability.model_allowlist.includes(artifact.model_required) &&
    capability.payload_must_not_dispatch_arbitrary_plugin_api === true &&
    binding.single_dispatch_budget.max_provider_calls === 1 &&
    binding.single_dispatch_budget.max_plugin_calls === 1 &&
    binding.single_dispatch_budget.max_api_calls === 1 &&
    binding.single_dispatch_budget.max_images === 1 &&
    binding.single_dispatch_budget.retry_allowed === false &&
    task.max_images === 1 &&
    task.retry_allowed === false &&
    task.secret_value_read_allowed === false &&
    artifact.schema === fixture.artifact_receipt_review_memory_gates.artifact_record_schema &&
    artifact.image_count === 1 &&
    artifact.output_files.length === 1 &&
    artifact.output_files[0].dimensions === "1920x1920" &&
    review.decision === "accepted_candidate" &&
    (review.commercial_delivery_ready === false ||
      review.accepted_reason_summary?.commercial_delivery_ready === false);
}

check("trial_001_snapshot_matches_evidence", () => snapshotMatchesEvidence(snapshots[0], trial001));
check("trial_002_snapshot_matches_evidence", () => {
  const base = snapshotMatchesEvidence(snapshots[1], trial002);
  return base && trial002.review.commercial_delivery_ready === false;
});
check("trial_002_memory_candidate_is_no_write_mapping", () =>
  trial002.memory.schema === "runtime_to_review_v2_memory_candidate_no_write_mapping_gate.v1" &&
  trial002.memory.candidate_mapping.mapping_created === true &&
  trial002.memory.candidate_mapping.memory_write_can_execute_now === false &&
  trial002.memory.candidate_mapping.daily_note_write_can_execute_now === false &&
  trial002.memory.candidate_mapping.future_write_requirements.includes("separate_memory_authorization_gate") &&
  trial002.memory.guard.record_memory_called === false &&
  trial002.memory.guard.DailyNote_write_performed === false &&
  trial002.memory.guard.VCP_memory_write_performed === false &&
  trial002.memory.guard.image_generation_performed === false
);
check("gate_defaults_match_artifacts", () =>
  [trial001.artifact, trial002.artifact].every((artifact) =>
    artifact.review_policy.accepted_samples_write_allowed_now === false &&
    artifact.review_policy.production_candidate_write_allowed_now === false &&
    artifact.review_policy.DailyNote_write_allowed_now === false &&
    artifact.review_policy.VCP_memory_write_allowed_now === false
  ) &&
  fixture.artifact_receipt_review_memory_gates.memory_write_default === false &&
  fixture.artifact_receipt_review_memory_gates.accepted_samples_write_default === false
);
check("execution_boundary_flags_false", () => allFlagsFalse(fixture.execution_boundary));
check("doc_boundary_flags_present", () =>
  Object.keys(fixture.execution_boundary).every((key) => doc.includes(`${key}: false`))
);
check("stop_rules_cover_red_boundaries", () =>
  doc.includes("modify VCPToolBox or another external repository") &&
  doc.includes("read `.env`, secrets, cookies, tokens") &&
  doc.includes("call a provider, plugin, API, route HTTP endpoint, or image generator") &&
  doc.includes("write accepted samples, production candidates, DailyNote, VCP memory, or Codex memory") &&
  doc.includes("push, tag, release, deploy")
);
check("recommended_next_is_generic_endpoint_gate_after_broker_proposal", () =>
  fixture.completed_previous === "prepare_vcptoolbox_image_execution_broker_implementation_proposal_no_execute" &&
  fixture.completion_refs.includes("docs/vcptoolbox_image_execution_broker_implementation_proposal_no_execute.md") &&
  fixture.completion_refs.includes("tests/schema_examples/vcptoolbox_image_execution_broker_implementation_proposal_no_execute.example.json") &&
  fixture.completion_refs.includes("scripts/validate_vcptoolbox_image_execution_broker_implementation_proposal_no_execute.js") &&
  fixture.completion_refs.every((ref) => exists(ref)) &&
  fixture.recommended_next === "prepare_generic_image_execution_endpoint_gate_no_execute" &&
  fixture.automatic_real_execution_allowed_by_this_contract === false &&
  fixture.external_repo_write_allowed_by_this_contract === false &&
  doc.includes("prepare_generic_image_execution_endpoint_gate_no_execute")
);

const failed = results.filter((result) => !result.passed);
const output = {
  passed: failed.length === 0,
  validator: "generation_channel_contract_preflight",
  phase: fixture.phase,
  doc_ref: docRef,
  fixture_ref: fixtureRef,
  check_count: results.length,
  failed_count: failed.length,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  route_http_request_performed: false,
  real_VCPToolBox_read_performed: false,
  external_VCPToolBox_write_performed: false,
  secret_value_read_performed: false,
  file_write_performed: false,
  results,
};

console.log(JSON.stringify(output, null, 2));
if (failed.length > 0) process.exit(1);
