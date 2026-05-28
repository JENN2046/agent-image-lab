#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../../..");
const checks = [];

const validatorBucketRules = [
  ["readonly_visual_review", (name) => name.startsWith("validate_visual_eval_readonly_")],
  ["readonly_operator_console", (name) => name.startsWith("validate_readonly_operator_console")],
  ["visual_eval", (name) => name.startsWith("validate_visual_eval_")],
  ["review_console", (name) => name.startsWith("validate_review_console")],
  ["legacy_versioned", (name) => /^validate_v\d/.test(name)],
  ["provider_preflight", (name) => /^validate_exact_a5|^validate_provider|^validate_retry/.test(name)],
  ["autopilot_governance", (name) => /^validate_autopilot|^validate_agent_board|^validate_smart/.test(name)],
  ["capsule", (name) => /^validate_capsule|^validate_preview/.test(name)],
  ["runtime", (name) => /^validate_runtime|^validate_durable|^validate_review_bridge/.test(name)],
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function add(check, passed, detail) {
  checks.push({
    check,
    passed: Boolean(passed),
    ...(detail === undefined ? {} : { detail }),
  });
}

function includesAll(content, tokens) {
  return tokens.every((token) => content.includes(token));
}

function forbiddenPositiveClaim(content) {
  const forbidden = [
    "authorizes physical moves",
    "authorizes deletion",
    "authorizes provider contact",
    "authorizes plugin calls",
    "authorizes API calls",
    "authorizes image generation",
    "authorizes memory writes",
    "authorizes production promotion",
    "authorizes dependency changes",
    "authorizes push",
    "authorizes tag",
    "authorizes release",
    "authorizes deploy",
  ];
  return forbidden.find((token) => content.includes(token));
}

function wrapperDelegatesTo(wrapperContent, implementationPath) {
  const slashPath = implementationPath.replace(/^scripts\//, "./");
  return wrapperContent.includes(implementationPath) || wrapperContent.includes(slashPath);
}

function implementationUsesRequireMainGuard(content) {
  return content.includes("if (require.main === module)");
}

function implementationExportsMain(content) {
  return /module\.exports\s*=\s*\{[\s\S]*?\bmain\b/.test(content);
}

function wrapperInvokesExportedMain(content) {
  return content.includes("typeof validator.main === \"function\"") &&
    content.includes("validator.main();");
}

function rootValidatorNames() {
  return fs.readdirSync(path.join(root, "scripts"), { withFileTypes: true })
    .filter((entry) => entry.isFile() && /^validate_.*\.js$/.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

function topLevelDirectoryNames() {
  return fs.readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== ".git")
    .map((entry) => entry.name)
    .sort();
}

function bucketRootValidators(names) {
  const counts = Object.fromEntries(validatorBucketRules.map(([bucket]) => [bucket, 0]));
  counts.other = 0;

  for (const name of names) {
    const matched = validatorBucketRules.find(([, predicate]) => predicate(name));
    counts[matched ? matched[0] : "other"] += 1;
  }

  return counts;
}

function main() {
  const standardPath = "docs/REPOSITORY_ORGANIZATION_STANDARD.md";
  const structurePath = "docs/PROJECT_STRUCTURE.md";
  const topLevelOwnershipPath = "docs/TOP_LEVEL_DIRECTORY_OWNERSHIP.md";
  const validatorReadmePath = "scripts/validators/README.md";
  const validatorIndexPath = "scripts/validators/VALIDATOR_INDEX.md";
  const otherValidatorClassificationMapPath = "scripts/validators/OTHER_VALIDATOR_CLASSIFICATION_MAP.md";
  const providerPreflightReferenceMapPath = "scripts/validators/PROVIDER_PREFLIGHT_REFERENCE_MAP.md";
  const runtimeReferenceMapPath = "scripts/validators/RUNTIME_REFERENCE_MAP.md";
  const rootWrapperPath = "scripts/validate_repository_structure_governance.js";
  const implementationPath = "scripts/validators/governance/validate_repository_structure_governance.js";
  const readonlyOperatorWrapperPath = "scripts/validate_readonly_operator_console_static_surface.js";
  const readonlyOperatorImplementationPath = "scripts/validators/readonly_operator_console/validate_readonly_operator_console_static_surface.js";
  const reviewConsoleValidatorFiles = [
    "validate_review_console_adapter_handoff.js",
    "validate_review_console_blocker_arbiter_boundary_scan.js",
    "validate_review_console_blocker_arbiter_regression_matrix.js",
    "validate_review_console_failure_capsule_snapshot.js",
    "validate_review_console_full_asset_archive_baseline.js",
    "validate_review_console_registry_report_v2_negative_visibility.js",
    "validate_review_console_registry_report_v2_state.js",
    "validate_review_console_static_mock_boundary.js",
    "validate_review_console_unified_capsule_contract.js",
  ];
  const reviewConsoleValidatorPaths = reviewConsoleValidatorFiles.map((fileName) => ({
    wrapperPath: `scripts/${fileName}`,
    implementationPath: `scripts/validators/review_console/${fileName}`,
  }));
  const readonlyVisualReviewValidatorFiles = [
    "validate_visual_eval_readonly_artifact_graph.js",
    "validate_visual_eval_readonly_metadata_accumulation_queue.js",
    "validate_visual_eval_readonly_metadata_accumulation_queue_consumer.js",
    "validate_visual_eval_readonly_metadata_accumulation_queue_detail_navigation.js",
    "validate_visual_eval_readonly_metadata_accumulation_queue_detail_view.js",
    "validate_visual_eval_readonly_metadata_accumulation_queue_query.js",
    "validate_visual_eval_readonly_metadata_accumulation_queue_surface_snapshot.js",
    "validate_visual_eval_readonly_review_artifact_catalog.js",
    "validate_visual_eval_readonly_review_artifact_system.js",
    "validate_visual_eval_readonly_review_bundle.js",
    "validate_visual_eval_readonly_review_bundle_consumer.js",
    "validate_visual_eval_readonly_review_collection_consumer.js",
    "validate_visual_eval_readonly_review_collection_query.js",
    "validate_visual_eval_readonly_review_corpus_renderer.js",
    "validate_visual_eval_readonly_review_detail_navigation.js",
    "validate_visual_eval_readonly_review_detail_view.js",
    "validate_visual_eval_readonly_review_session_drilldown.js",
    "validate_visual_eval_readonly_review_surface_snapshot.js",
    "validate_visual_eval_readonly_review_workspace.js",
    "validate_visual_eval_readonly_review_workspace_case_matrix.js",
    "validate_visual_eval_readonly_review_workspace_corpus.js",
  ];
  const readonlyVisualReviewValidatorPaths = readonlyVisualReviewValidatorFiles.map((fileName) => ({
    wrapperPath: `scripts/${fileName}`,
    implementationPath: `scripts/validators/readonly_visual_review/${fileName}`,
  }));
  const autopilotGovernanceValidatorFiles = [
    "validate_agent_board_queue_reconciliation.js",
    "validate_agent_board_state.js",
    "validate_autopilot_agent_board_resume_compaction_guard.js",
    "validate_autopilot_amber_action_packet_preflight.js",
    "validate_autopilot_amber_packet_to_receipt_traceability.js",
    "validate_autopilot_evolution_engine.js",
    "validate_autopilot_false_readiness_negative_cases.js",
    "validate_autopilot_goal_compiler.js",
    "validate_autopilot_governance_kernel.js",
    "validate_autopilot_readiness_receipt_registry_cross_claims.js",
    "validate_autopilot_receipt_registry_negative_cases.js",
    "validate_smart_v3_push_safety_lane.js",
  ];
  const autopilotGovernanceValidatorPaths = autopilotGovernanceValidatorFiles.map((fileName) => ({
    wrapperPath: `scripts/${fileName}`,
    implementationPath: `scripts/validators/autopilot_governance/${fileName}`,
  }));
  const visualEvalValidatorFiles = [
    "validate_visual_eval_consistency_check.js",
    "validate_visual_eval_review_console_readonly_corpus_renderer.js",
    "validate_visual_eval_review_result_protocol.js",
    "validate_visual_eval_review_result_review_bridge_wiring.js",
    "validate_visual_eval_seed_record_schema.js",
    "validate_visual_eval_seed_registry_schema.js",
  ];
  const visualEvalValidatorPaths = visualEvalValidatorFiles.map((fileName) => ({
    wrapperPath: `scripts/${fileName}`,
    implementationPath: `scripts/validators/visual_eval/${fileName}`,
  }));
  const capsuleValidatorFiles = [
    "validate_capsule_code_debt_completion_audit.js",
    "validate_capsule_creator_common_safety.js",
    "validate_capsule_creator_manifest_contract_regression.js",
    "validate_capsule_manifest_contract_negative_cases.js",
    "validate_capsule_manifest_contract.js",
    "validate_capsule_manifest_schema_runtime_binding.js",
    "validate_capsule_operator_reviewer_action_matrix.js",
    "validate_capsule_registry_report_v2_negative_states.js",
    "validate_capsule_registry_report_v2.js",
    "validate_capsule_static_operator_checklist_ui_mapping.js",
    "validate_capsule_static_product_smoke_fixture.js",
    "validate_capsule_static_product_smoke_review_console_snapshot.js",
    "validate_capsule_status_taxonomy.js",
    "validate_preview_capsule_registry_negative_cases.js",
    "validate_preview_capsule_registry.js",
    "validate_preview_capsule.js",
  ];
  const capsuleValidatorPaths = capsuleValidatorFiles.map((fileName) => ({
    wrapperPath: `scripts/${fileName}`,
    implementationPath: `scripts/validators/capsule/${fileName}`,
  }));
  const protectedValidatorPaths = [
    { wrapperPath: rootWrapperPath, implementationPath },
    { wrapperPath: readonlyOperatorWrapperPath, implementationPath: readonlyOperatorImplementationPath },
    ...reviewConsoleValidatorPaths,
    ...readonlyVisualReviewValidatorPaths,
    ...autopilotGovernanceValidatorPaths,
    ...visualEvalValidatorPaths,
    ...capsuleValidatorPaths,
  ];

  add("repository_organization_standard_exists", exists(standardPath), standardPath);
  add("project_structure_exists", exists(structurePath), structurePath);
  add("top_level_directory_ownership_exists", exists(topLevelOwnershipPath), topLevelOwnershipPath);
  add("validator_layout_readme_exists", exists(validatorReadmePath), validatorReadmePath);
  add("validator_index_exists", exists(validatorIndexPath), validatorIndexPath);
  add("other_validator_classification_map_exists", exists(otherValidatorClassificationMapPath), otherValidatorClassificationMapPath);
  add("provider_preflight_reference_map_exists", exists(providerPreflightReferenceMapPath), providerPreflightReferenceMapPath);
  add("runtime_reference_map_exists", exists(runtimeReferenceMapPath), runtimeReferenceMapPath);
  add("root_compatibility_wrapper_exists", exists(rootWrapperPath), rootWrapperPath);
  add("governance_validator_implementation_exists", exists(implementationPath), implementationPath);
  add("readonly_operator_console_wrapper_exists", exists(readonlyOperatorWrapperPath), readonlyOperatorWrapperPath);
  add("readonly_operator_console_implementation_exists", exists(readonlyOperatorImplementationPath), readonlyOperatorImplementationPath);
  for (const { wrapperPath, implementationPath: reviewConsoleImplementationPath } of reviewConsoleValidatorPaths) {
    add(`review_console_wrapper_exists_${path.basename(wrapperPath, ".js")}`, exists(wrapperPath), wrapperPath);
    add(
      `review_console_implementation_exists_${path.basename(reviewConsoleImplementationPath, ".js")}`,
      exists(reviewConsoleImplementationPath),
      reviewConsoleImplementationPath
    );
  }
  for (const { wrapperPath, implementationPath: readonlyVisualReviewImplementationPath } of readonlyVisualReviewValidatorPaths) {
    add(`readonly_visual_review_wrapper_exists_${path.basename(wrapperPath, ".js")}`, exists(wrapperPath), wrapperPath);
    add(
      `readonly_visual_review_implementation_exists_${path.basename(readonlyVisualReviewImplementationPath, ".js")}`,
      exists(readonlyVisualReviewImplementationPath),
      readonlyVisualReviewImplementationPath
    );
  }
  for (const { wrapperPath, implementationPath: autopilotGovernanceImplementationPath } of autopilotGovernanceValidatorPaths) {
    add(`autopilot_governance_wrapper_exists_${path.basename(wrapperPath, ".js")}`, exists(wrapperPath), wrapperPath);
    add(
      `autopilot_governance_implementation_exists_${path.basename(autopilotGovernanceImplementationPath, ".js")}`,
      exists(autopilotGovernanceImplementationPath),
      autopilotGovernanceImplementationPath
    );
  }
  for (const { wrapperPath, implementationPath: visualEvalImplementationPath } of visualEvalValidatorPaths) {
    add(`visual_eval_wrapper_exists_${path.basename(wrapperPath, ".js")}`, exists(wrapperPath), wrapperPath);
    add(
      `visual_eval_implementation_exists_${path.basename(visualEvalImplementationPath, ".js")}`,
      exists(visualEvalImplementationPath),
      visualEvalImplementationPath
    );
  }
  for (const { wrapperPath, implementationPath: capsuleImplementationPath } of capsuleValidatorPaths) {
    add(`capsule_wrapper_exists_${path.basename(wrapperPath, ".js")}`, exists(wrapperPath), wrapperPath);
    add(
      `capsule_implementation_exists_${path.basename(capsuleImplementationPath, ".js")}`,
      exists(capsuleImplementationPath),
      capsuleImplementationPath
    );
  }

  const standard = exists(standardPath) ? read(standardPath) : "";
  const structure = exists(structurePath) ? read(structurePath) : "";
  const topLevelOwnership = exists(topLevelOwnershipPath) ? read(topLevelOwnershipPath) : "";
  const validatorReadme = exists(validatorReadmePath) ? read(validatorReadmePath) : "";
  const validatorIndex = exists(validatorIndexPath) ? read(validatorIndexPath) : "";
  const otherValidatorClassificationMap = exists(otherValidatorClassificationMapPath) ? read(otherValidatorClassificationMapPath) : "";
  const providerPreflightReferenceMap = exists(providerPreflightReferenceMapPath) ? read(providerPreflightReferenceMapPath) : "";
  const runtimeReferenceMap = exists(runtimeReferenceMapPath) ? read(runtimeReferenceMapPath) : "";
  const rootWrapper = exists(rootWrapperPath) ? read(rootWrapperPath) : "";
  const readonlyOperatorWrapper = exists(readonlyOperatorWrapperPath) ? read(readonlyOperatorWrapperPath) : "";
  const rootValidators = rootValidatorNames();
  const topLevelDirectories = topLevelDirectoryNames();
  const validatorBuckets = bucketRootValidators(rootValidators);
  const otherValidatorNames = rootValidators.filter((name) => !validatorBucketRules.some(([, predicate]) => predicate(name)));

  add("project_structure_references_standard", structure.includes(standardPath), standardPath);
  add("project_structure_references_top_level_ownership", structure.includes(topLevelOwnershipPath), topLevelOwnershipPath);
  add("validator_readme_references_standard", validatorReadme.includes(standardPath), standardPath);
  add("validator_readme_references_index", validatorReadme.includes(validatorIndexPath), validatorIndexPath);
  add("project_structure_references_validator_index", structure.includes(validatorIndexPath), validatorIndexPath);
  add(
    "standard_core_sections_present",
    includesAll(standard, [
      "## Core Rule",
      "## Top-Level Directories",
      "## Documentation",
      "## Validators",
      "## Test Fixtures",
      "## Review Console",
      "## Asset And Run Artifacts",
      "## Agent Board",
      "## Before Moving Files",
      "## Validation",
    ])
  );
  add(
    "top_level_ownership_covers_current_directories",
    includesAll(topLevelOwnership, topLevelDirectories.map((directoryName) => `\`${directoryName}/\``)),
    `expected ${topLevelDirectories.length} top-level directories`
  );
  add(
    "top_level_ownership_columns_present",
    includesAll(topLevelOwnership, [
      "| Directory | Owner / domain | Current role | Portability | Top-level decision | Next safe action |",
      "## Current Gaps",
      "visual production line",
    ])
  );
  add(
    "top_level_ownership_non_authorization_present",
    includesAll(topLevelOwnership, [
      "does not authorize physical moves",
      "deletion",
      "runtime execution",
      "provider contact",
      "plugin calls",
      "API calls",
      "image generation",
      "memory writes",
      "production promotion",
      "dependency changes",
      "commit",
      "push",
      "tag",
      "release",
      "deploy",
      "destructive filesystem actions",
    ])
  );
  add(
    "standard_defines_index_before_move_rule",
    standard.includes("Prefer discoverability and compatibility before movement.") &&
      standard.includes("Do not start with broad directory movement.")
  );
  add(
    "standard_validator_default_path_declared",
    standard.includes("scripts/validators/<domain_or_version>/") &&
      structure.includes("New validators must default to:") &&
      validatorReadme.includes("Default layout for new validators")
  );
  add(
    "standard_root_validator_exception_bounded",
    includesAll(standard, [
      "Root-level `scripts/validate_*.js` files are legacy-compatible entry points.",
      "small governance guard",
      "document why it stays at root",
    ])
  );
  add(
    "standard_review_console_boundaries_present",
    includesAll(standard, [
      "`review_console/static_prototype/` is the safe static UI surface.",
      "do not authorize real VCPChat integration",
      "provider calls",
      "VCP memory writes",
    ])
  );
  add(
    "standard_agent_board_compaction_guard_present",
    includesAll(standard.toLowerCase(), [
      "`.agent_board/` is the active resume rail.",
      "silently delete old resume material",
    ])
  );
  add(
    "standard_non_authorization_present",
    includesAll(standard, [
      "does not authorize physical moves",
      "provider contact",
      "plugin calls",
      "API calls",
      "image generation",
      "memory writes",
      "production promotion",
      "dependency changes",
      "commit",
      "push",
      "tag",
      "release",
      "deploy",
    ])
  );
  add("standard_has_no_forbidden_positive_claims", !forbiddenPositiveClaim(standard), forbiddenPositiveClaim(standard) || "");
  add(
    "structure_maintenance_policy_references_standard",
    structure.includes("Follow `docs/REPOSITORY_ORGANIZATION_STANDARD.md` before adding or moving")
  );
  add(
    "root_wrapper_delegates_to_governance_validator",
    wrapperDelegatesTo(rootWrapper, implementationPath)
  );
  add(
    "readonly_operator_console_wrapper_delegates_to_implementation",
    wrapperDelegatesTo(readonlyOperatorWrapper, readonlyOperatorImplementationPath)
  );
  for (const { wrapperPath, implementationPath: reviewConsoleImplementationPath } of reviewConsoleValidatorPaths) {
    const wrapper = exists(wrapperPath) ? read(wrapperPath) : "";
    add(
      `review_console_wrapper_delegates_${path.basename(wrapperPath, ".js")}`,
      wrapperDelegatesTo(wrapper, reviewConsoleImplementationPath),
      reviewConsoleImplementationPath
    );
  }
  for (const { wrapperPath, implementationPath: readonlyVisualReviewImplementationPath } of readonlyVisualReviewValidatorPaths) {
    const wrapper = exists(wrapperPath) ? read(wrapperPath) : "";
    add(
      `readonly_visual_review_wrapper_delegates_${path.basename(wrapperPath, ".js")}`,
      wrapperDelegatesTo(wrapper, readonlyVisualReviewImplementationPath),
      readonlyVisualReviewImplementationPath
    );
  }
  for (const { wrapperPath, implementationPath: autopilotGovernanceImplementationPath } of autopilotGovernanceValidatorPaths) {
    const wrapper = exists(wrapperPath) ? read(wrapperPath) : "";
    add(
      `autopilot_governance_wrapper_delegates_${path.basename(wrapperPath, ".js")}`,
      wrapperDelegatesTo(wrapper, autopilotGovernanceImplementationPath),
      autopilotGovernanceImplementationPath
    );
  }
  for (const { wrapperPath, implementationPath: visualEvalImplementationPath } of visualEvalValidatorPaths) {
    const wrapper = exists(wrapperPath) ? read(wrapperPath) : "";
    add(
      `visual_eval_wrapper_delegates_${path.basename(wrapperPath, ".js")}`,
      wrapperDelegatesTo(wrapper, visualEvalImplementationPath),
      visualEvalImplementationPath
    );
  }
  for (const { wrapperPath, implementationPath: capsuleImplementationPath } of capsuleValidatorPaths) {
    const wrapper = exists(wrapperPath) ? read(wrapperPath) : "";
    add(
      `capsule_wrapper_delegates_${path.basename(wrapperPath, ".js")}`,
      wrapperDelegatesTo(wrapper, capsuleImplementationPath),
      capsuleImplementationPath
    );
  }
  for (const { wrapperPath, implementationPath: protectedImplementationPath } of protectedValidatorPaths) {
    const wrapper = exists(wrapperPath) ? read(wrapperPath) : "";
    const protectedImplementation = exists(protectedImplementationPath) ? read(protectedImplementationPath) : "";
    const usesRequireMainGuard = implementationUsesRequireMainGuard(protectedImplementation);
    add(
      `root_wrapper_executes_guarded_main_${path.basename(wrapperPath, ".js")}`,
      !usesRequireMainGuard || (implementationExportsMain(protectedImplementation) && wrapperInvokesExportedMain(wrapper)),
      protectedImplementationPath
    );
  }
  add(
    "validator_index_lists_current_splits",
    includesAll(validatorIndex, [
      implementationPath,
      rootWrapperPath,
      readonlyOperatorImplementationPath,
      readonlyOperatorWrapperPath,
      "scripts/validators/review_console/validate_review_console_adapter_handoff.js",
      "scripts/validators/review_console/validate_review_console_blocker_arbiter_boundary_scan.js",
      "scripts/validators/review_console/validate_review_console_blocker_arbiter_regression_matrix.js",
      "scripts/validators/review_console/validate_review_console_failure_capsule_snapshot.js",
      "scripts/validators/review_console/validate_review_console_full_asset_archive_baseline.js",
      "scripts/validators/review_console/validate_review_console_registry_report_v2_negative_visibility.js",
      "scripts/validators/review_console/validate_review_console_registry_report_v2_state.js",
      "scripts/validators/review_console/validate_review_console_static_mock_boundary.js",
      "scripts/validators/review_console/validate_review_console_unified_capsule_contract.js",
      "scripts/validate_review_console_adapter_handoff.js",
      "scripts/validate_review_console_blocker_arbiter_boundary_scan.js",
      "scripts/validate_review_console_blocker_arbiter_regression_matrix.js",
      "scripts/validate_review_console_failure_capsule_snapshot.js",
      "scripts/validate_review_console_full_asset_archive_baseline.js",
      "scripts/validate_review_console_registry_report_v2_negative_visibility.js",
      "scripts/validate_review_console_registry_report_v2_state.js",
      "scripts/validate_review_console_static_mock_boundary.js",
      "scripts/validate_review_console_unified_capsule_contract.js",
      ...readonlyVisualReviewValidatorPaths.flatMap(({ wrapperPath, implementationPath: readonlyVisualReviewImplementationPath }) => [
        wrapperPath,
        readonlyVisualReviewImplementationPath,
      ]),
      ...autopilotGovernanceValidatorPaths.flatMap(({ wrapperPath, implementationPath: autopilotGovernanceImplementationPath }) => [
        wrapperPath,
        autopilotGovernanceImplementationPath,
      ]),
      ...visualEvalValidatorPaths.flatMap(({ wrapperPath, implementationPath: visualEvalImplementationPath }) => [
        wrapperPath,
        visualEvalImplementationPath,
      ]),
      ...capsuleValidatorPaths.flatMap(({ wrapperPath, implementationPath: capsuleImplementationPath }) => [
        wrapperPath,
        capsuleImplementationPath,
      ]),
    ])
  );
  add(
    "validator_index_root_total_matches",
    validatorIndex.includes(`root_validator_total: ${rootValidators.length}`),
    `expected root_validator_total: ${rootValidators.length}`
  );
  for (const [bucket, count] of Object.entries(validatorBuckets)) {
    add(
      `validator_index_bucket_${bucket}_matches`,
      validatorIndex.includes(`| \`${bucket}\` | ${count} |`),
      `expected ${bucket}: ${count}`
    );
  }
  add(
    "validator_index_split_rules_present",
    includesAll(validatorIndex, [
      "Move one family at a time.",
      "Keep the old root path as a wrapper",
      "Do not change `package.json` scripts unless the task explicitly targets the",
    ])
  );
  add(
    "other_validator_classification_map_count_matches",
    otherValidatorClassificationMap.includes(`other_root_validator_total: ${otherValidatorNames.length}`),
    `expected other_root_validator_total: ${otherValidatorNames.length}`
  );
  add(
    "other_validator_classification_map_lists_all_root_family",
    includesAll(otherValidatorClassificationMap, otherValidatorNames.map((name) => `scripts/${name}`)),
    `expected ${otherValidatorNames.length} root validators`
  );
  add(
    "other_validator_classification_map_boundaries_present",
    includesAll(otherValidatorClassificationMap, [
      "does not authorize physical moves",
      "deletion",
      "provider contact",
      "plugin calls",
      "API calls",
      "runtime execution",
      "image generation",
      "memory writes",
      "production promotion",
      "dependency changes",
      "commit",
      "push",
      "tag",
      "release",
      "deploy",
      "destructive filesystem actions",
    ])
  );
  add(
    "other_validator_classification_map_referenced",
    validatorIndex.includes(otherValidatorClassificationMapPath) &&
      validatorReadme.includes(otherValidatorClassificationMapPath),
    otherValidatorClassificationMapPath
  );
  add(
    "provider_preflight_reference_map_lists_root_family",
    includesAll(providerPreflightReferenceMap, [
      "scripts/validate_exact_a5_provider_execution_activation_receipt.js",
      "scripts/validate_exact_a5_provider_execution_packet_draft.js",
      "scripts/validate_exact_a5_provider_retry_003_activation_receipt.js",
      "scripts/validate_exact_a5_provider_retry_004_activation_receipt.js",
      "scripts/validate_exact_a5_provider_retry_005_activation_receipt.js",
      "scripts/validate_exact_a5_provider_retry_006_activation_receipt.js",
      "scripts/validate_exact_a5_provider_retry_007_activation_packet_draft.js",
      "scripts/validate_exact_a5_provider_retry_007_preflight_decision.js",
      "scripts/validate_exact_a5_provider_retry_007_vcptoolbox_output_override_repair_package.js",
      "scripts/validate_exact_a5_provider_retry_activation_receipt.js",
      "scripts/validate_exact_a5_provider_retry_packet_draft.js",
      "scripts/validate_provider_evidence_integrity_contract.js",
      "scripts/validate_provider_payload_capture_preflight.js",
      "scripts/validate_provider_preflight_no_provider_call.js",
      "scripts/validate_provider_receipt_artifacts.js",
      "scripts/validate_retry_006_artifact_integrity.js",
    ])
  );
  add(
    "provider_preflight_reference_map_boundaries_present",
    includesAll(providerPreflightReferenceMap, [
      "does not authorize provider contact",
      "plugin calls",
      "API calls",
      "image generation",
      "memory writes",
      "production promotion",
      "dependency changes",
      "commit",
      "push",
      "tag",
      "release",
      "deploy",
      "destructive filesystem actions",
    ])
  );
  add(
    "provider_preflight_reference_map_referenced",
    validatorIndex.includes(providerPreflightReferenceMapPath) &&
      validatorReadme.includes(providerPreflightReferenceMapPath),
    providerPreflightReferenceMapPath
  );
  add(
    "runtime_reference_map_lists_root_family",
    includesAll(runtimeReferenceMap, [
      "scripts/validate_durable_archive_copy_authorization_package.js",
      "scripts/validate_durable_archive_copy_execution_report.js",
      "scripts/validate_runtime_delivery_surface.js",
      "scripts/validate_runtime_durable_audit_store.js",
      "scripts/validate_runtime_guard_unit.js",
      "scripts/validate_runtime_kernel_backend_gap_map.js",
      "scripts/validate_runtime_kernel_entry_boundary_no_exec.js",
      "scripts/validate_runtime_kernel_v0_artifact_adapter_stub.js",
      "scripts/validate_runtime_kernel_v0_audit_write.js",
      "scripts/validate_runtime_kernel_v0_contract.js",
      "scripts/validate_runtime_kernel_v0.js",
      "scripts/validate_runtime_prototype_smoke.js",
      "scripts/validate_runtime_prototype_suite.js",
      "scripts/validate_runtime_review_batch_10a_acceptance_matrix.js",
      "scripts/validate_runtime_review_batch_10b_dry_run_replay_index.js",
      "scripts/validate_runtime_review_batch_10c_auth_consolidation.js",
      "scripts/validate_runtime_review_batch_9a_state_freshness.js",
      "scripts/validate_runtime_review_batch_9b_session_compatibility.js",
      "scripts/validate_runtime_review_batch_9c_operator_runbook.js",
      "scripts/validate_runtime_review_bridge_readonly_stub.js",
      "scripts/validate_runtime_review_full_chain.js",
    ])
  );
  add(
    "runtime_reference_map_boundaries_present",
    includesAll(runtimeReferenceMap, [
      "does not authorize runtime execution",
      "provider contact",
      "plugin calls",
      "API calls",
      "image generation",
      "memory writes",
      "production promotion",
      "dependency changes",
      "commit",
      "push",
      "tag",
      "release",
      "deploy",
      "destructive filesystem actions",
    ])
  );
  add(
    "runtime_reference_map_referenced",
    validatorIndex.includes(runtimeReferenceMapPath) &&
      validatorReadme.includes(runtimeReferenceMapPath),
    runtimeReferenceMapPath
  );

  const failed = checks.filter((check) => !check.passed);
  const result = {
    validator: "validate_repository_structure_governance",
    passed: failed.length === 0,
    files_checked: [
      standardPath,
      structurePath,
      topLevelOwnershipPath,
      validatorReadmePath,
      validatorIndexPath,
      otherValidatorClassificationMapPath,
      providerPreflightReferenceMapPath,
      runtimeReferenceMapPath,
      rootWrapperPath,
      implementationPath,
      readonlyOperatorWrapperPath,
      readonlyOperatorImplementationPath,
      ...reviewConsoleValidatorPaths.flatMap(({ wrapperPath, implementationPath: reviewConsoleImplementationPath }) => [
        wrapperPath,
        reviewConsoleImplementationPath,
      ]),
      ...readonlyVisualReviewValidatorPaths.flatMap(({ wrapperPath, implementationPath: readonlyVisualReviewImplementationPath }) => [
        wrapperPath,
        readonlyVisualReviewImplementationPath,
      ]),
      ...autopilotGovernanceValidatorPaths.flatMap(({ wrapperPath, implementationPath: autopilotGovernanceImplementationPath }) => [
        wrapperPath,
        autopilotGovernanceImplementationPath,
      ]),
      ...visualEvalValidatorPaths.flatMap(({ wrapperPath, implementationPath: visualEvalImplementationPath }) => [
        wrapperPath,
        visualEvalImplementationPath,
      ]),
      ...capsuleValidatorPaths.flatMap(({ wrapperPath, implementationPath: capsuleImplementationPath }) => [
        wrapperPath,
        capsuleImplementationPath,
      ]),
    ],
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    memory_written: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    production_candidate_002_started: false,
    Batch_005_started: false,
    failed_count: failed.length,
    errors: failed.map((check) => `${check.check}${check.detail ? `: ${check.detail}` : ""}`),
    results: checks,
  };

  console.log(JSON.stringify(result, null, 2));
  process.exit(result.passed ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = {
  main,
};
