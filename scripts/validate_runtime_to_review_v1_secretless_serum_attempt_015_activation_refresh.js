#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { verifyAttemptLockBinding, sha256Text } = require("./verify_runtime_to_review_v1_secretless_serum_attempt_lock_binding");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_secretless_serum_attempt_015_activation_refresh";
const lockPath = "reports/runtime_to_review_v1/secretless_serum_attempt_015.lock.json";
const bindingPacketPath = "reports/runtime_to_review_v1/secretless_option_a_exact_binding_packet_draft_20260603_attempt_015.json";
const activationPath = "reports/runtime_to_review_v1/secretless_serum_live_probe_activation_preflight_20260603_attempt_015.json";
const validatorPath = "scripts/validate_runtime_to_review_v1_secretless_serum_attempt_015_activation_refresh.js";
const packageScriptName = "validate:runtime-to-review-secretless-serum-attempt-015-activation-refresh";
const manifestId = "runtime_to_review_secretless_serum_attempt_015_activation_refresh";

let passed = true;
const checks = [];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository: ${relativePath}`);
  }
  return resolved;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function check(id, fn) {
  try {
    const ok = fn();
    checks.push({ check: id, passed: Boolean(ok) });
    if (!ok) passed = false;
  } catch (error) {
    checks.push({ check: id, passed: false, error: error.message });
    passed = false;
  }
}

function includesAll(values, expected) {
  return Array.isArray(values) && expected.every((value) => values.includes(value));
}

function fieldsAreFalse(object, fields) {
  return Boolean(object) && fields.every((field) => object[field] === false);
}

function gitHead() {
  const result = spawnSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : null;
}

function gitCommitIsAncestor(requiredCommit, headCommit) {
  if (!/^[0-9a-f]{40}$/.test(String(requiredCommit || "")) ||
      !/^[0-9a-f]{40}$/.test(String(headCommit || ""))) {
    return false;
  }
  if (requiredCommit === headCommit) return true;
  const result = spawnSync("git", ["merge-base", "--is-ancestor", requiredCommit, headCommit], { cwd: root, encoding: "utf8" });
  return result.status === 0;
}

const lock = readJson(lockPath);
const binding = readJson(bindingPacketPath);
const activation = readJson(activationPath);
const packageJson = readJson("package.json");
const manifest = readJson("scripts/validation_manifest.json");
const verifier = verifyAttemptLockBinding({ lockPath });
const ailHead = gitHead();
const boundaryFalseFields = [
  "route_http_request_performed",
  "live_probe_performed",
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "image_generation_performed",
  "output_write_performed",
  "secret_value_read_performed",
  "env_file_content_read_performed",
  "config_env_read_performed",
  "authorization_header_constructed_by_agent_image_lab",
  "push_tag_release_deploy_performed"
];

check("lock_is_attempt_015_and_authorization_shape_valid", () => {
  const auth = lock.authorization_boundary || {};
  const inactive =
    auth.can_execute_now === false &&
    auth.route_http_allowed_by_this_lock === false &&
    auth.separate_exact_activation_required === true;
  const active =
    auth.can_execute_now === true &&
    auth.route_http_allowed_by_this_lock === true &&
    auth.separate_exact_activation_required === false;
  return (
  lock.schema === "runtime_to_review_v1_secretless_serum_attempt_lock.v1" &&
  lock.attempt === "015" &&
  lock.activation_id === "AUTH-SECRETLESS-SERUM-LIVE-PROBE-20260603-015" &&
  lock.pipeline_id === "secretless-serum-live-probe-attempt-015" &&
  (inactive || active)
  );
});
check("lock_prompt_hash_matches", () => lock.prompt_sha256 === sha256Text(lock.prompt || ""));
check("verifier_passes_current_source_binding", () =>
  verifier.passed === true &&
  verifier.status === "attempt_lock_binding_verified" &&
  verifier.vcptoolbox_head === lock.vcptoolbox_current_attempt_binding_commit_required
);
check("activation_and_binding_point_to_same_lock_refs", () =>
  activation.lock_ref === lockPath &&
  binding.lock_ref === lockPath &&
  activation.future_execution_scope_if_later_separately_activated.binding_packet_ref === bindingPacketPath &&
  lock.binding_packet.binding_packet_ref === bindingPacketPath &&
  lock.binding_packet.binding_packet_id === binding.packet_id &&
  activation.future_execution_scope_if_later_separately_activated.binding_packet_id === binding.packet_id
);
check("activation_and_binding_match_attempt_identity", () =>
  binding.exact_binding_packet_draft.activation_package_id_required === lock.activation_id &&
  activation.activation_package_id === lock.activation_id &&
  binding.exact_binding_packet_draft.route_http_origin_required === lock.route.origin &&
  binding.exact_binding_packet_draft.route_http_method === lock.route.method &&
  binding.exact_binding_packet_draft.route_http_path === lock.route.path &&
  activation.future_execution_scope_if_later_separately_activated.routeHttpOrigin === lock.route.origin &&
  activation.future_execution_scope_if_later_separately_activated.method === lock.route.method &&
  activation.future_execution_scope_if_later_separately_activated.path === lock.route.path
);
check("activation_and_binding_match_output_refs", () =>
  binding.exact_binding_packet_draft.receipt_ref === lock.receipt_ref &&
  binding.exact_binding_packet_draft.artifact_record_ref === lock.artifact_record_ref &&
  binding.exact_binding_packet_draft.output_directory_ref === lock.output_directory_ref &&
  activation.planned_receipt_ref_if_activated_later === lock.receipt_ref &&
  activation.planned_artifact_record_ref_if_activated_later === lock.artifact_record_ref &&
  activation.future_execution_scope_if_later_separately_activated.target_output_directory_ref === lock.output_directory_ref
);
check("current_attempt_commit_is_not_evidence_repair", () =>
  binding.exact_binding_packet_draft.vcptoolbox_current_attempt_binding_commit_required === lock.vcptoolbox_current_attempt_binding_commit_required &&
  activation.future_execution_scope_if_later_separately_activated.vcptoolbox_current_attempt_binding_commit_required === lock.vcptoolbox_current_attempt_binding_commit_required &&
  lock.vcptoolbox_evidence_repair_commit_accepted_as_binding_commit === false &&
  binding.exact_binding_packet_draft.vcptoolbox_evidence_repair_commit_accepted_as_binding_commit === false &&
  activation.future_execution_scope_if_later_separately_activated.vcptoolbox_binding_commit_label.includes("current-attempt binding commit")
);
check("ail_head_contains_lock_seal_and_guard_commits", () =>
  gitCommitIsAncestor(binding.exact_binding_packet_draft.agent_image_lab_lock_seal_commit_required, ailHead) &&
  gitCommitIsAncestor(activation.future_execution_scope_if_later_separately_activated.agent_image_lab_lock_seal_commit_required, ailHead) &&
  gitCommitIsAncestor(lock.agent_image_lab_commit_required, ailHead)
);
check("budget_matches_lock", () =>
  binding.budget.max_provider_calls === lock.budget.max_provider_calls &&
  binding.budget.max_plugin_calls === lock.budget.max_plugin_calls &&
  binding.budget.max_api_calls === lock.budget.max_api_calls &&
  binding.budget.max_images === lock.budget.max_images &&
  binding.budget.retry_allowed === lock.budget.retry_allowed &&
  activation.future_execution_scope_if_later_separately_activated.max_provider_calls === lock.budget.max_provider_calls &&
  activation.future_execution_scope_if_later_separately_activated.max_images === lock.budget.max_images &&
  activation.future_execution_scope_if_later_separately_activated.retry_allowed === lock.budget.retry_allowed
);
check("activation_refresh_is_non_executing", () =>
  activation.authorization_state.can_execute_now === false &&
  activation.authorization_state.route_http_authorized_by_this_record === false &&
  activation.authorization_state.next_auto_step_allowed === false &&
  fieldsAreFalse(activation.non_execution_boundary, boundaryFalseFields) &&
  fieldsAreFalse(binding.non_execution_boundary, boundaryFalseFields)
);
check("stop_conditions_include_lock_and_source_binding", () =>
  includesAll(activation.stop_conditions, [
    "separate exact activation is missing",
    "attempt lock source binding verifier fails",
    "evidence repair commit is used as route binding commit"
  ]) &&
  includesAll(binding.stop_conditions, [
    "new exact activation is missing",
    "attempt lock source binding verifier fails",
    "evidence repair commit is used as route binding commit"
  ])
);
check("package_script_registered", () =>
  packageJson.scripts?.[packageScriptName] === `node ${validatorPath}`
);
check("manifest_entry_registered", () => {
  const entry = manifest.validators.find((item) => item.id === manifestId);
  return entry &&
    entry.command === `npm run ${packageScriptName}` &&
    entry.script === validatorPath &&
    entry.tier === "targeted" &&
    entry.domain === "runtime_to_review" &&
    entry.status === "active" &&
    includesAll(entry.trigger_paths, [
      lockPath,
      bindingPacketPath,
      activationPath,
      validatorPath,
      "scripts/verify_runtime_to_review_v1_secretless_serum_attempt_lock_binding.js",
      "scripts/run_runtime_to_review_v1_secretless_option_a_callable_runner.js",
      "package.json",
      "scripts/validation_manifest.json"
    ]);
});

process.stdout.write(`${JSON.stringify({
  passed,
  validator,
  lock_ref: lockPath,
  binding_packet_ref: bindingPacketPath,
  activation_preflight_ref: activationPath,
  agent_image_lab_head: ailHead,
  vcptoolbox_head: verifier.vcptoolbox_head,
  verifier_status: verifier.status,
  can_execute_now: lock.authorization_boundary?.can_execute_now === true,
  route_http_request_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  image_generation_performed: false,
  checks
}, null, 2)}\n`);

if (!passed) process.exitCode = 1;
