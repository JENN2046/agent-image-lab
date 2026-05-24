#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const files = {
  gapReviewDoc: "docs/vcp_integration/CODEX_SESSION_IMAGE_IMPORT_ROUTE_CLOSEOUT_OR_REAL_GENERATION_GAP_REVIEW.md",
  gapReviewFixture: "tests/schema_examples/codex_session_image_import_route_gap_review.example.yaml",
  minimalContract: "docs/codex_session_image_provider_minimal_contract.md",
  toolContract: "docs/vcp_integration/VCP_AGENT_IMAGE_GENERATION_TOOL_CONTRACT_V1.md",
  mockValidationDoc: "docs/vcp_integration/VCP_AGENT_IMAGE_GENERATION_CONTRACT_MOCK_VALIDATION.md",
  routeSelectionDoc: "docs/vcp_integration/VCP_AGENT_GENERATION_ROUTE_SELECTION_GATE.md",
  preflightDoc: "docs/vcp_integration/CODEX_SESSION_IMAGE_IMPORT_PREFLIGHT.md",
  recordContractDoc: "docs/vcp_integration/CODEX_SESSION_IMAGE_IMPORT_RECORD_CONTRACT.md",
  recordMockValidationDoc: "docs/vcp_integration/CODEX_SESSION_IMAGE_IMPORT_RECORD_MOCK_VALIDATION.md",
  trueA5GateDoc: "docs/archive/phases/v7/v7_265_true_A5_authorization_request_gate.md",
  dryRunVcpAdapterDoc: "docs/v14_115_dry_run_vcp_adapter_current_goal_alignment.md",
};

const requiredTokens = [
  "phase: v0_6_69_codex_session_image_import_route_closeout_or_real_generation_gap_review",
  "source_phase: v0_6_68a_exact_file_commit_readiness_gate",
  "route_review_only: true",
  "route_status: closed_as_safe_manual_import_path",
  "protocol_loop_completed: true",
  "manual_import_fallback_only: true",
  "can_generate_image_by_itself: false",
  "can_import_manual_session_image_later: true",
  "can_write_memory: false",
  "can_create_accepted_sample: false",
  "can_create_production_candidate: false",
  "requires_real_generation_route: true",
  "codex_session_image_import_directly_satisfies_real_generation: false",
  "recommended_route: NativeDoubaoImage_one_shot_project_plugin",
  "future_vcp_provider_adapter_retained: true",
  "future_vcp_provider_adapter_status: reserved_for_future_design_route",
  "exact selected plugin / adapter",
  "exact model",
  "prompt_package_ref",
  "output_directory_ref",
  "max_plugin_calls=1",
  "max_images_created=1",
  "retry_limit=0",
  "Amber_B action packet",
  "preflight no-call",
  "receipt",
  "review handoff",
  "selected_route: NativeDoubaoImage_one_shot_project_plugin",
  "prompt_package_ref_required_under: prompts/image_generation/",
  "output_directory_ref_required_under: runs/real_generation/",
  "amber_packet_type: Amber_B_provider_image",
  "preflight_no_call_required: true",
  "receipt_required: true",
  "review_handoff_required: true",
  "recommended_next: v0_6_70_real_vcp_agent_generation_route_activation_gate",
];

const reviewedSourceTokens = Object.values(files).filter((file) => ![
  files.gapReviewDoc,
  files.gapReviewFixture,
].includes(file));

const falseKeys = [
  "execution_allowed_by_this_review",
  "real_generation_performed",
  "image_binary_read_performed",
  "output_write_performed",
  "provider_contact_performed",
  "plugin_call_performed",
  "api_call_performed",
  "mcp_runtime_performed",
  "VCPToolBox_runtime_performed",
  "VCPChat_runtime_performed",
  "DailyNote_write_performed",
  "VCP_memory_write_performed",
  "accepted_samples_write_performed",
  "production_candidate_write_performed",
  "env_read_performed",
  "secret_read_performed",
  "push_tag_release_deploy_performed",
  "memory_write_allowed",
  "accepted_samples_write_allowed",
  "production_candidate_write_allowed",
];

const results = [];
const errors = [];

function repoPath(relativePath) {
  return path.join(root, relativePath);
}

function exists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function read(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function addResult(check, passed, detail) {
  const result = { check, passed: Boolean(passed) };
  if (detail !== undefined) result.detail = detail;
  results.push(result);
  if (!passed) errors.push({ check, detail: detail || "check failed" });
}

function valuesForKey(text, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return [...text.matchAll(new RegExp(`^\\s*${escaped}:\\s*(.*?)\\s*$`, "gm"))]
    .map((match) => match[1].replace(/^["']|["']$/g, ""));
}

function boolIsFalseOrAbsent(text, key) {
  return valuesForKey(text, key).every((value) => value === "false" || value === "null");
}

for (const [key, relativePath] of Object.entries(files)) {
  addResult(`${key}_exists`, exists(relativePath), relativePath);
}

const gapReviewDoc = read(files.gapReviewDoc);
const gapReviewFixture = read(files.gapReviewFixture);
const minimalContract = read(files.minimalContract);
const toolContract = read(files.toolContract);
const routeSelectionDoc = read(files.routeSelectionDoc);
const preflightDoc = read(files.preflightDoc);
const recordContractDoc = read(files.recordContractDoc);
const recordMockValidationDoc = read(files.recordMockValidationDoc);
const trueA5GateDoc = read(files.trueA5GateDoc);
const dryRunVcpAdapterDoc = read(files.dryRunVcpAdapterDoc);
const joinedReview = [gapReviewDoc, gapReviewFixture].join("\n");

for (const token of requiredTokens) {
  addResult(`gap_review_contains_${token}`, joinedReview.includes(token), token);
}

for (const token of reviewedSourceTokens) {
  addResult(`reviewed_sources_include_${token}`, joinedReview.includes(token), token);
}

for (const key of falseKeys) {
  const regex = new RegExp(`^\\s*${key}:\\s+true\\s*$`, "im");
  addResult(`gap_review_surfaces_do_not_claim_${regex}`, !regex.test(joinedReview), String(regex));
  addResult(`${key}_false_or_absent`, boolIsFalseOrAbsent(joinedReview, key), key);
}

addResult(
  "minimal_contract_confirms_manual_bridge_not_callable_provider",
  minimalContract.includes("manual bridge") &&
    minimalContract.includes("It is not a project-callable provider") &&
    minimalContract.includes("manual_session_import"),
  files.minimalContract
);

addResult(
  "tool_contract_includes_three_route_options_and_real_generation_budget",
  toolContract.includes("codex_session_image_import") &&
    toolContract.includes("future_vcp_provider_adapter") &&
    toolContract.includes("future_plugin_id_hint: NativeDoubaoImage") &&
    toolContract.includes("max_plugin_calls: 1") &&
    toolContract.includes("max_images_created: 1") &&
    toolContract.includes("retry_limit: 0"),
  files.toolContract
);

addResult(
  "route_selection_closed_manual_route_and_reserved_native_doubao",
  routeSelectionDoc.includes("selected_route: codex_session_image_import") &&
    routeSelectionDoc.includes("native_doubao_one_shot_project_plugin_status: reserved_for_later_exact_A5_preflight") &&
    routeSelectionDoc.includes("future_vcp_provider_adapter_status: reserved_for_future_design_route"),
  files.routeSelectionDoc
);

addResult(
  "codex_import_protocol_layers_are_present",
  preflightDoc.includes("preflight_only: true") &&
    recordContractDoc.includes("contract_only: true") &&
    recordMockValidationDoc.includes("mock_validation_only: true") &&
    recordMockValidationDoc.includes("valid_mock_import_record_passed: true"),
  "preflight + record + mock validation"
);

addResult(
  "true_a5_gate_supports_native_doubao_minimum_preflight_shape",
  trueA5GateDoc.includes("plugin_id: NativeDoubaoImage") &&
    trueA5GateDoc.includes("max_plugin_calls: 1") &&
    trueA5GateDoc.includes("max_images_created: 1") &&
    trueA5GateDoc.includes("retry_limit: 0") &&
    trueA5GateDoc.includes("human_review_required_after_any_future_asset: true"),
  files.trueA5GateDoc
);

addResult(
  "dry_run_vcp_adapter_remains_future_no_execution_route",
  dryRunVcpAdapterDoc.includes("dry-run VCP adapter") &&
    dryRunVcpAdapterDoc.includes("not a provider runner") &&
    dryRunVcpAdapterDoc.includes("real_manifest_read_performed: false") &&
    dryRunVcpAdapterDoc.includes("future VCPChat / VCPToolBox"),
  files.dryRunVcpAdapterDoc
);

const passed = errors.length === 0;
const summary = {
  validator: "validate_codex_session_image_import_route_gap_review",
  phase: "v0_6_69_codex_session_image_import_route_closeout_or_real_generation_gap_review",
  source_phase: "v0_6_68a_exact_file_commit_readiness_gate",
  passed,
  check_count: results.length,
  failed_count: errors.length,
  route_review_only: true,
  codex_session_image_import: {
    route_status: "closed_as_safe_manual_import_path",
    can_generate_image_by_itself: false,
    can_import_manual_session_image_later: true,
    can_write_memory: false,
    can_create_accepted_sample: false,
    can_create_production_candidate: false,
  },
  real_vcp_agent_generation_gap: {
    requires_real_generation_route: true,
    recommended_route: "NativeDoubaoImage_one_shot_project_plugin",
  },
  real_generation_performed: false,
  image_binary_read_performed: false,
  output_write_performed: false,
  provider_contact_performed: false,
  plugin_call_performed: false,
  api_call_performed: false,
  mcp_runtime_performed: false,
  VCPToolBox_runtime_performed: false,
  VCPChat_runtime_performed: false,
  DailyNote_write_performed: false,
  VCP_memory_write_performed: false,
  accepted_samples_write_performed: false,
  production_candidate_write_performed: false,
  push_performed: false,
  recommended_next: ["v0_6_70_real_vcp_agent_generation_route_activation_gate"],
  errors,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
process.exit(passed ? 0 : 1);
