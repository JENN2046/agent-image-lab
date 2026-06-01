#!/usr/bin/env node
"use strict";

const path = require("node:path");
const fs = require("node:fs");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const recommenderScript = path.join(root, "scripts", "recommend_validation_for_changed_files.js");
const closeoutHelperScript = path.join(root, "scripts", "build_validation_closeout_summary.js");
const benchmarkScript = path.join(root, "scripts", "benchmark_validation_efficiency.js");
const packageJsonPath = path.join(root, "package.json");
const agentsPath = path.join(root, "AGENTS.md");
const closeoutSchemaPath = path.join(root, ".agent_board", "CLOSEOUT_SCHEMA.md");
const validationSelectionMatrixPath = path.join(root, "docs", "VALIDATION_SELECTION_MATRIX.md");
const benchmarkReportsDir = path.join(root, "reports", "validation_benchmarks");

const checks = [];

function add(check, passed, detail) {
  checks.push({
    check,
    passed: Boolean(passed),
    ...(detail === undefined ? {} : { detail }),
  });
}

function runRecommender(files) {
  return runRecommenderArgs([
    recommenderScript,
    "--files",
    files.join(","),
  ]);
}

function runRecommenderArgs(args) {
  const output = execFileSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return JSON.parse(output);
}

function runRecommenderRaw(args) {
  return execFileSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function normalizePath(file) {
  return file.replace(/\\/g, "/").replace(/^\.\//, "");
}

function gitList(args) {
  return execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).split(/\r?\n/).map((line) => normalizePath(line.trim())).filter(Boolean);
}

function gitScalar(args) {
  return execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function sameMembers(left, right) {
  const leftSet = new Set(left || []);
  const rightSet = new Set(right || []);
  return leftSet.size === rightSet.size && [...leftSet].every((item) => rightSet.has(item));
}

function hasCommand(result, command) {
  return Array.isArray(result.recommended_commands) && result.recommended_commands.includes(command);
}

function hasProfileCommand(profile, command) {
  return Array.isArray(profile?.profile_commands) && profile.profile_commands.includes(command);
}

function hasReason(profile, expectedProfile, expectedCommand, expectedFile) {
  return Array.isArray(profile?.reasons) && profile.reasons.some((reason) =>
    reason.profile === expectedProfile &&
    reason.command === expectedCommand &&
    Array.isArray(reason.matched_files) &&
    reason.matched_files.includes(expectedFile)
  );
}

function hasCatalogEntry(profile, expectedProfile, expectedCommand, expectedRecommended, expectedFile, expectedCoveredByCommand) {
  const entry = profile?.profile_catalog?.[expectedProfile];
  return entry &&
    entry.command === expectedCommand &&
    entry.covered_by_command === expectedCoveredByCommand &&
    entry.recommended === expectedRecommended &&
    Array.isArray(entry.matched_files) &&
    (expectedFile === null || entry.matched_files.includes(expectedFile));
}

function hasPlanStep(result, command, expectedKind) {
  const step = result.validation_plan?.steps?.find((entry) => entry.command === command);
  return step &&
    Array.isArray(step.sources) &&
    step.sources.some((source) => source.kind === expectedKind);
}

function hasCoveredPlanProfile(result, expectedProfile, expectedCoveredByCommand) {
  return Array.isArray(result.validation_plan?.covered_profiles) &&
    result.validation_plan.covered_profiles.some((entry) =>
      entry.profile === expectedProfile &&
      entry.covered_by_command === expectedCoveredByCommand
    );
}

function hasCoveredPlanCommand(result, expectedCommand, expectedCoveredByCommand) {
  return Array.isArray(result.validation_plan?.covered_commands) &&
    result.validation_plan.covered_commands.some((entry) =>
      entry.command === expectedCommand &&
      entry.covered_by_command === expectedCoveredByCommand
    );
}

function hasCoveredPlanCommandFile(result, expectedCommand, expectedFile) {
  return Array.isArray(result.validation_plan?.covered_commands) &&
    result.validation_plan.covered_commands.some((entry) =>
      entry.command === expectedCommand &&
      Array.isArray(entry.matched_files) &&
      entry.matched_files.includes(expectedFile)
    );
}

function hasCoveredPlanCommandValidator(result, expectedCommand, expectedValidatorId) {
  return Array.isArray(result.validation_plan?.covered_commands) &&
    result.validation_plan.covered_commands.some((entry) =>
      entry.command === expectedCommand &&
      Array.isArray(entry.matched_validator_ids) &&
      entry.matched_validator_ids.includes(expectedValidatorId)
    );
}

function hasDeferredPlanCommand(result, expectedCommand, expectedDeferredToCommand) {
  return Array.isArray(result.validation_plan?.deferred_commands) &&
    result.validation_plan.deferred_commands.some((entry) =>
      entry.command === expectedCommand &&
      entry.deferred_to_command === expectedDeferredToCommand
    );
}

function hasDeferredPlanCommandFile(result, expectedCommand, expectedFile) {
  return Array.isArray(result.validation_plan?.deferred_commands) &&
    result.validation_plan.deferred_commands.some((entry) =>
      entry.command === expectedCommand &&
      Array.isArray(entry.matched_files) &&
      entry.matched_files.includes(expectedFile)
    );
}

function hasDeferredPlanCommandValidator(result, expectedCommand, expectedValidatorId) {
  return Array.isArray(result.validation_plan?.deferred_commands) &&
    result.validation_plan.deferred_commands.some((entry) =>
      entry.command === expectedCommand &&
      Array.isArray(entry.matched_validator_ids) &&
      entry.matched_validator_ids.includes(expectedValidatorId)
    );
}

function validateCase(caseId, files, expected) {
  const result = runRecommender(files);
  const profile = result.recommended_validation_profile;
  const plan = result.validation_plan;
  const efficiency = result.efficiency_summary;
  const decision = result.validation_decision_summary;
  add(`${caseId}_recommender_passed`, result.passed === true);
  add(`${caseId}_recommendation_contract_version_v1`, result.recommendation_contract_version === 1, result.recommendation_contract_version);
  add(`${caseId}_change_selection_present`, result.change_selection && typeof result.change_selection === "object", result.change_selection);
  add(`${caseId}_change_selection_file_count`, result.change_selection?.file_count === result.changed_files.length, result.change_selection);
  add(`${caseId}_change_selection_source_matches_output`, result.change_selection?.source === result.source, result.change_selection);
  add(`${caseId}_change_selection_counts_present`, typeof result.change_selection?.tracked_diff_file_count === "number" &&
    typeof result.change_selection?.untracked_file_count === "number" &&
    typeof result.change_selection?.explicit_file_count === "number", result.change_selection);
  add(`${caseId}_change_selection_file_lists_present`, Array.isArray(result.change_selection?.tracked_diff_files) &&
    Array.isArray(result.change_selection?.untracked_files) &&
    Array.isArray(result.change_selection?.explicit_file_list), result.change_selection);
  add(`${caseId}_change_selection_argv_counts`, result.change_selection?.explicit_file_count === result.changed_files.length &&
    result.change_selection?.tracked_diff_file_count === 0 &&
    result.change_selection?.untracked_file_count === 0, result.change_selection);
  add(`${caseId}_profile_present`, profile && typeof profile === "object");
  add(`${caseId}_validation_plan_present`, plan && typeof plan === "object");
  add(`${caseId}_efficiency_summary_present`, efficiency && typeof efficiency === "object");
  add(`${caseId}_validation_decision_summary_present`, decision && typeof decision === "object");
  add(`${caseId}_validation_plan_v1`, plan?.version === 1, plan?.version);
  add(`${caseId}_validation_decision_summary_v1`, decision?.version === 1, decision?.version);
  add(`${caseId}_validation_plan_primary_profile`, plan?.primary_profile === expected.primaryProfile, plan?.primary_profile);
  add(`${caseId}_validation_plan_primary_command`, plan?.primary_command === expected.primaryCommand, plan?.primary_command);
  add(`${caseId}_decision_primary_profile`, decision?.primary_profile === expected.primaryProfile, decision?.primary_profile);
  add(`${caseId}_decision_primary_command`, decision?.primary_command === expected.primaryCommand, decision?.primary_command);
  add(`${caseId}_validation_plan_commands_match_recommended`, JSON.stringify(plan?.execution_commands || []) === JSON.stringify(result.recommended_commands || []));
  add(`${caseId}_decision_next_commands_match_recommended`, JSON.stringify(decision?.next_commands || []) === JSON.stringify(result.recommended_commands || []));
  add(`${caseId}_manifest_coverage_present`, result.manifest_coverage && typeof result.manifest_coverage === "object");
  add(`${caseId}_manifest_coverage_matches_plan`, JSON.stringify(result.manifest_coverage || {}) === JSON.stringify(plan?.manifest_coverage || {}));
  add(`${caseId}_manifest_coverage_all_files_matched`, result.manifest_coverage?.all_files_matched === expected.allFilesMatched, result.manifest_coverage);
  add(`${caseId}_efficiency_execution_command_count`, efficiency?.execution_command_count === (result.recommended_commands || []).length, efficiency);
  add(`${caseId}_efficiency_matched_validator_count`, efficiency?.matched_validator_count === result.matched_validator_count, efficiency);
  add(`${caseId}_efficiency_all_files_matched`, efficiency?.all_files_matched === expected.allFilesMatched, efficiency);
  add(`${caseId}_efficiency_unmatched_file_count`, efficiency?.unmatched_file_count === (result.manifest_coverage?.unmatched_file_count || 0), efficiency);
  add(`${caseId}_efficiency_covered_command_count`, efficiency?.covered_command_count === (plan?.covered_commands || []).length, efficiency);
  add(`${caseId}_efficiency_covered_profile_count`, efficiency?.covered_profile_count === (plan?.covered_profiles || []).length, efficiency);
  add(`${caseId}_efficiency_deferred_command_count`, efficiency?.deferred_command_count === (plan?.deferred_commands || []).length, efficiency);
  add(`${caseId}_decision_execution_command_count`, decision?.execution_command_count === (result.recommended_commands || []).length, decision);
  add(`${caseId}_decision_deferred_command_count`, decision?.deferred_command_count === (plan?.deferred_commands || []).length, decision);
  add(`${caseId}_decision_unmatched_file_count`, decision?.unmatched_file_count === (result.manifest_coverage?.unmatched_file_count || 0), decision);
  for (const file of expected.unmatchedFiles || []) {
    add(`${caseId}_manifest_coverage_unmatched:${file}`, Array.isArray(result.manifest_coverage?.unmatched_files) && result.manifest_coverage.unmatched_files.includes(file));
  }
  add(`${caseId}_primary_profile`, profile?.primary_profile === expected.primaryProfile, profile?.primary_profile);
  add(`${caseId}_profiles_include_primary`, Array.isArray(profile?.profiles) && profile.profiles.includes(expected.primaryProfile), profile?.profiles);
  add(`${caseId}_primary_command`, profile?.primary_command === expected.primaryCommand, profile?.primary_command);
  add(`${caseId}_daily_flag`, profile?.daily_recommended === expected.dailyRecommended, profile?.daily_recommended);
  add(`${caseId}_observability_flag`, profile?.observability_recommended === expected.observabilityRecommended, profile?.observability_recommended);
  add(`${caseId}_mvp_flag`, profile?.mvp_recommended === expected.mvpRecommended, profile?.mvp_recommended);

  for (const command of expected.commands || []) {
    add(`${caseId}_command:${command}`, hasCommand(result, command));
  }
  for (const step of expected.planSteps || []) {
    add(`${caseId}_plan_step:${step.command}:${step.kind}`, hasPlanStep(result, step.command, step.kind));
  }
  for (const covered of expected.coveredProfiles || []) {
    add(`${caseId}_plan_covered_profile:${covered.profile}`, hasCoveredPlanProfile(result, covered.profile, covered.coveredByCommand));
  }
  for (const covered of expected.coveredCommands || []) {
    add(`${caseId}_plan_covered_command:${covered.command}`, hasCoveredPlanCommand(result, covered.command, covered.coveredByCommand));
    add(`${caseId}_recommended_command_omits_covered_command:${covered.command}`, !hasCommand(result, covered.command));
    for (const file of covered.files || []) {
      add(`${caseId}_plan_covered_command_file:${covered.command}:${file}`, hasCoveredPlanCommandFile(result, covered.command, file));
    }
    for (const validatorId of covered.validatorIds || []) {
      add(`${caseId}_plan_covered_command_validator:${covered.command}:${validatorId}`, hasCoveredPlanCommandValidator(result, covered.command, validatorId));
    }
  }
  for (const deferred of expected.deferredCommands || []) {
    add(`${caseId}_plan_deferred_command:${deferred.command}`, hasDeferredPlanCommand(result, deferred.command, deferred.deferredToCommand));
    add(`${caseId}_recommended_command_omits_deferred_command:${deferred.command}`, !hasCommand(result, deferred.command));
    for (const file of deferred.files || []) {
      add(`${caseId}_plan_deferred_command_file:${deferred.command}:${file}`, hasDeferredPlanCommandFile(result, deferred.command, file));
    }
    for (const validatorId of deferred.validatorIds || []) {
      add(`${caseId}_plan_deferred_command_validator:${deferred.command}:${validatorId}`, hasDeferredPlanCommandValidator(result, deferred.command, validatorId));
    }
  }
  if (expected.minimumOmittedRedundantItemCount !== undefined) {
    add(
      `${caseId}_efficiency_minimum_omitted_redundant_item_count`,
      efficiency?.omitted_redundant_item_count >= expected.minimumOmittedRedundantItemCount,
      efficiency
    );
  }
  for (const command of expected.profileCommands || []) {
    add(`${caseId}_profile_command:${command}`, hasProfileCommand(profile, command));
    add(`${caseId}_recommended_command_includes_profile_command:${command}`, hasCommand(result, command));
  }
  for (const reason of expected.reasons || []) {
    add(
      `${caseId}_reason:${reason.profile}`,
      hasReason(profile, reason.profile, reason.command, reason.file)
    );
  }
  for (const catalog of expected.catalog || []) {
    add(
      `${caseId}_catalog:${catalog.profile}`,
      hasCatalogEntry(profile, catalog.profile, catalog.command, catalog.recommended, catalog.file, catalog.coveredByCommand || null)
    );
  }
}

function validateWiring() {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const scripts = packageJson.scripts || {};
  const validateActive = scripts["validate:active"] || "";
  const recommenderSource = fs.readFileSync(recommenderScript, "utf8");
  const closeoutHelperSource = fs.readFileSync(closeoutHelperScript, "utf8");
  const benchmarkSource = fs.readFileSync(benchmarkScript, "utf8");
  const agents = fs.readFileSync(agentsPath, "utf8");
  const closeoutSchema = fs.readFileSync(closeoutSchemaPath, "utf8");
  const validationSelectionMatrix = fs.readFileSync(validationSelectionMatrixPath, "utf8");

  add(
    "package_json_recommendation_profiles_script",
    scripts["validate:recommendation-profiles"] === "node scripts/validate_validation_recommendation_profiles.js",
    scripts["validate:recommendation-profiles"]
  );
  add(
    "package_json_recommendation_next_commands_script",
    scripts["recommend:validation:next-commands"] === "node scripts/recommend_validation_for_changed_files.js --next-commands",
    scripts["recommend:validation:next-commands"]
  );
  add(
    "package_json_closeout_validation_summary_script",
    scripts["closeout:validation-summary"] === "node scripts/build_validation_closeout_summary.js",
    scripts["closeout:validation-summary"]
  );
  add(
    "package_json_closeout_status_summary_validator_script",
    scripts["validate:closeout-status-summary"] === "node scripts/validate_closeout_status_summary.js",
    scripts["validate:closeout-status-summary"]
  );
  add(
    "validate_active_includes_manifest_validator",
    validateActive.includes("npm run validate:validation-manifest")
  );
  add(
    "validate_active_includes_recommendation_profiles",
    validateActive.includes("npm run validate:recommendation-profiles")
  );
  add(
    "package_json_targeted_plan_script",
    scripts["validate:targeted-plan"] === "node scripts/run_validation_manifest_tier.js --tier targeted --dry-run",
    scripts["validate:targeted-plan"]
  );
  add(
    "recommender_default_worktree_reads_untracked_files",
    recommenderSource.includes('"ls-files", "--others", "--exclude-standard"') &&
      recommenderSource.includes("const untracked = untrackedOutput.split") &&
      recommenderSource.includes("files: [...new Set([...changed, ...untracked])]") &&
      recommenderSource.includes("tracked_diff_files: changed") &&
      recommenderSource.includes("untracked_files: untracked")
  );
  add(
    "recommender_cached_mode_excludes_untracked_files",
    recommenderSource.includes("if (cached)") &&
      recommenderSource.includes("untracked_files: []") &&
      recommenderSource.indexOf("untracked_files: []") < recommenderSource.indexOf('"ls-files", "--others", "--exclude-standard"')
  );
  const nextCommandsText = runRecommenderRaw([
    recommenderScript,
    "--files",
    "package.json",
    "--next-commands",
  ]).trim().split(/\r?\n/).filter(Boolean);
  const nextCommandsJson = JSON.parse(runRecommenderRaw([
    recommenderScript,
    "--files",
    "package.json",
    "--next-commands=json",
  ]));
  add(
    "recommender_next_commands_text_output",
    nextCommandsText[0] === "node scripts/validate_validation_manifest.js" &&
      nextCommandsText.includes("npm run validate:active") &&
      nextCommandsText.includes("npm run validate:runtime-to-review-serum-bottle-owner-activation-checklist") &&
      new Set(nextCommandsText).size === nextCommandsText.length,
    nextCommandsText
  );
  add(
    "recommender_next_commands_json_lite_output",
    nextCommandsJson.passed === true &&
      nextCommandsJson.primary_profile === "daily" &&
      Array.isArray(nextCommandsJson.next_commands) &&
      nextCommandsJson.next_commands.includes("npm run validate:active") &&
      Array.isArray(nextCommandsJson.deferred_commands),
    nextCommandsJson
  );
  const closeoutSummaryPackage = runRecommenderRaw([
    closeoutHelperScript,
    "--files",
    "package.json",
  ]);
  const closeoutSummaryAgentBoard = runRecommenderRaw([
    closeoutHelperScript,
    "--files",
    ".agent_board/CLOSEOUT_SCHEMA.md",
  ]);
  const closeoutSummaryStatus = runRecommenderRaw([
    closeoutHelperScript,
    "--status",
    "--files",
    "package.json",
  ]);
  const expectedHead = gitScalar(["rev-parse", "HEAD"]);
  const expectedBranch = gitScalar(["rev-parse", "--abbrev-ref", "HEAD"]);
  const expectedStatus = gitScalar(["status", "--short"]) ? "dirty" : "clean";
  const upstream = gitScalar(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"]);
  const upstreamHead = gitScalar(["rev-parse", upstream]);
  const [behindRaw, aheadRaw] = gitScalar(["rev-list", "--left-right", "--count", `${upstream}...HEAD`]).split(/\s+/);
  const expectedAheadBehind = `${Number.parseInt(aheadRaw || "0", 10)}/${Number.parseInt(behindRaw || "0", 10)}`;
  add(
    "closeout_helper_uses_recommender_json_lite",
    closeoutHelperSource.includes('"--next-commands=json"') &&
      closeoutHelperSource.includes("argv.filter((arg) => arg !== \"--status\")") &&
      closeoutHelperSource.includes('gitOutput(["rev-list", "--left-right", "--count"') &&
      closeoutHelperSource.includes("recommend_validation_for_changed_files.js") &&
      closeoutHelperSource.includes("validation_decision_summary.next_commands")
  );
  add(
    "closeout_helper_package_json_outputs_daily_block",
    closeoutSummaryPackage.includes("validation:") &&
      closeoutSummaryPackage.includes("recommender:") &&
      closeoutSummaryPackage.includes('primary_profile: "daily"') &&
      closeoutSummaryPackage.includes('primary_command: "npm run validate:active"') &&
      closeoutSummaryPackage.includes('- "node scripts/validate_validation_manifest.js"') &&
      closeoutSummaryPackage.includes('- "npm run validate:active"') &&
      closeoutSummaryPackage.includes('usage_decision: "followed"'),
    closeoutSummaryPackage
  );
  add(
    "closeout_helper_agent_board_outputs_deferred_block",
    closeoutSummaryAgentBoard.includes('primary_profile: "targeted"') &&
      closeoutSummaryAgentBoard.includes('- "npm run validate:targeted-plan"') &&
      closeoutSummaryAgentBoard.includes('command: "npm run validate:governance"') &&
      closeoutSummaryAgentBoard.includes('deferred_to_command: "npm run validate:archive-plan"') &&
      closeoutSummaryAgentBoard.includes('- ".agent_board/CLOSEOUT_SCHEMA.md"'),
    closeoutSummaryAgentBoard
  );
  add(
    "closeout_helper_status_outputs_git_block",
    closeoutSummaryStatus.includes(`commit_hash: "${expectedHead}"`) &&
      closeoutSummaryStatus.includes(`branch: "${expectedBranch}"`) &&
      closeoutSummaryStatus.includes(`local_equals_origin: ${expectedHead === upstreamHead ? "true" : "false"}`) &&
      closeoutSummaryStatus.includes(`ahead_behind: "${expectedAheadBehind}"`) &&
      closeoutSummaryStatus.includes(`git_status: "${expectedStatus}"`) &&
      closeoutSummaryStatus.includes('primary_profile: "daily"') &&
      closeoutSummaryStatus.includes('primary_command: "npm run validate:active"'),
    closeoutSummaryStatus
  );
  add(
    "benchmark_summary_keeps_active_recommended",
    benchmarkSource.includes('"active_recommended"')
  );
  add(
    "benchmark_summary_keeps_recommended_validation_profile",
    benchmarkSource.includes('"recommended_validation_profile"')
  );
  add(
    "benchmark_summary_keeps_recommendation_contract_version",
    benchmarkSource.includes('"recommendation_contract_version"') &&
      benchmarkSource.includes("recommendation_contract_version: parsed.recommendation_contract_version || null")
  );
  add(
    "benchmark_summary_keeps_recommendation_source",
    benchmarkSource.includes('"source"') &&
      benchmarkSource.includes('"comparison_base"') &&
      benchmarkSource.includes('"change_selection"') &&
      benchmarkSource.includes("source: parsed.source || null") &&
      benchmarkSource.includes("comparison_base: parsed.comparison_base || null") &&
      benchmarkSource.includes("change_selection: parsed.change_selection || null")
  );
  add(
    "benchmark_summary_keeps_profile_catalog",
    benchmarkSource.includes("profile_catalog: profile?.profile_catalog || {}")
  );
  add(
    "benchmark_summary_keeps_profile_commands",
    benchmarkSource.includes("profile_commands: profile?.profile_commands || []")
  );
  add(
    "benchmark_summary_keeps_manifest_coverage",
    benchmarkSource.includes('"manifest_coverage"') &&
      benchmarkSource.includes("manifest_coverage: parsed.manifest_coverage || null")
  );
  add(
    "benchmark_summary_keeps_validation_plan",
    benchmarkSource.includes('"validation_plan"') &&
      benchmarkSource.includes("validation_plan: parsed.validation_plan || null")
  );
  add(
    "benchmark_summary_keeps_efficiency_summary",
    benchmarkSource.includes('"efficiency_summary"') &&
      benchmarkSource.includes("efficiency_summary: parsed.efficiency_summary || null")
  );
  add(
    "benchmark_summary_keeps_validation_decision_summary",
    benchmarkSource.includes('"validation_decision_summary"') &&
      benchmarkSource.includes("validation_decision_summary: parsed.validation_decision_summary || null")
  );
  add(
    "benchmark_summary_keeps_next_commands_json_lite",
    benchmarkSource.includes('"primary_profile"') &&
      benchmarkSource.includes('"primary_command"') &&
      benchmarkSource.includes('"next_commands"') &&
      benchmarkSource.includes("next_commands_baseline") &&
      benchmarkSource.includes("function summarizeNextCommandsBaseline")
  );
  add(
    "benchmark_summary_keeps_covered_commands",
    benchmarkSource.includes("covered_commands: parsed.validation_plan?.covered_commands || []")
  );
  add(
    "benchmark_top_level_profile_baselines_present",
    benchmarkSource.includes("function summarizeRecommendationProfiles") &&
      benchmarkSource.includes("recommendation_profile_baselines")
  );
  add(
    "benchmark_daily_profile_probe_present",
    benchmarkSource.includes('id: "recommend_validation_daily_profile"') &&
      benchmarkSource.includes("node scripts/recommend_validation_for_changed_files.js --files package.json")
  );
  add(
    "benchmark_next_commands_json_lite_probe_present",
    benchmarkSource.includes('id: "recommend_validation_next_commands_json_lite"') &&
      benchmarkSource.includes("node scripts/recommend_validation_for_changed_files.js --files package.json --next-commands=json")
  );
  add(
    "benchmark_observability_profile_probe_present",
    benchmarkSource.includes('id: "recommend_validation_observability_profile"') &&
      benchmarkSource.includes("node scripts/recommend_validation_for_changed_files.js --files reports/validation_benchmarks/validation_efficiency_baseline_example.json")
  );
  add(
    "benchmark_mvp_profile_probe_present",
    benchmarkSource.includes('id: "recommend_validation_mvp_profile"') &&
      benchmarkSource.includes("node scripts/recommend_validation_for_changed_files.js --files review_console/static_prototype/app.js")
  );
  add(
    "benchmark_targeted_profile_probe_present",
    benchmarkSource.includes('id: "recommend_validation_targeted_profile"') &&
      benchmarkSource.includes("node scripts/recommend_validation_for_changed_files.js --files scripts/recommend_validation_for_changed_files.js")
  );
  add(
    "selection_matrix_recommender_contract_section_present",
    validationSelectionMatrix.includes("## Recommender Output Contract")
  );
  add(
    "agents_closeout_consumes_recommender_next_commands",
    agents.includes("For validation selection, daily closeouts should first consult") &&
      agents.includes("npm run recommend:validation") &&
      agents.includes("validation_decision_summary.next_commands") &&
      agents.includes("recommendation was broadened, narrowed, deferred, or skipped") &&
      agents.includes("recommender next_commands from `validation_decision_summary`")
  );
  add(
    "agent_board_closeout_schema_consumes_next_commands",
    closeoutSchema.includes("recommender:") &&
      closeoutSchema.includes("command: npm run recommend:validation:next-commands") &&
      closeoutSchema.includes("source: validation_decision_summary.next_commands") &&
      closeoutSchema.includes("primary_profile:") &&
      closeoutSchema.includes("primary_command:") &&
      closeoutSchema.includes("next_commands: []") &&
      closeoutSchema.includes("deferred_commands: []") &&
      closeoutSchema.includes("usage_decision: followed | broadened | narrowed | deferred | skipped") &&
      closeoutSchema.includes("usage_reason:")
  );
  add(
    "selection_matrix_documents_daily_closeout_consumption",
    validationSelectionMatrix.includes("## Daily Closeout Consumption") &&
      validationSelectionMatrix.includes("run `npm run recommend:validation`") &&
      validationSelectionMatrix.includes("before selecting") &&
      validationSelectionMatrix.includes("validation_decision_summary.next_commands") &&
      validationSelectionMatrix.includes("first validation plan to consider") &&
      validationSelectionMatrix.includes("broadened for shared-risk coverage") &&
      validationSelectionMatrix.includes("narrowed for a targeted spot check") &&
      validationSelectionMatrix.includes("deferred") &&
      validationSelectionMatrix.includes("archive/governance entrypoint") &&
      validationSelectionMatrix.includes("skipped because the task was read-only")
  );
  add(
    "selection_matrix_names_profile_contract_fields",
    validationSelectionMatrix.includes("recommended_validation_profile.primary_profile") &&
      validationSelectionMatrix.includes("recommended_validation_profile.primary_command") &&
      validationSelectionMatrix.includes("validation_plan.execution_commands") &&
      validationSelectionMatrix.includes("efficiency_summary") &&
      validationSelectionMatrix.includes("validation_decision_summary") &&
      validationSelectionMatrix.includes("manifest_coverage") &&
      validationSelectionMatrix.includes("change_selection.source") &&
      validationSelectionMatrix.includes("change_selection.tracked_diff_file_count") &&
      validationSelectionMatrix.includes("change_selection.untracked_file_count") &&
      validationSelectionMatrix.includes("change_selection.explicit_file_count")
  );
  add(
    "selection_matrix_documents_next_commands_light_outputs",
    validationSelectionMatrix.includes("npm run recommend:validation:next-commands") &&
      validationSelectionMatrix.includes("node scripts/recommend_validation_for_changed_files.js --next-commands=json") &&
      validationSelectionMatrix.includes("npm run --silent closeout:validation-summary") &&
      validationSelectionMatrix.includes("paste-ready closeout") &&
      validationSelectionMatrix.includes("validation.recommender") &&
      validationSelectionMatrix.includes("one command per line") &&
      validationSelectionMatrix.includes("JSON-lite form") &&
      validationSelectionMatrix.includes("primary_profile") &&
      validationSelectionMatrix.includes("primary_command") &&
      validationSelectionMatrix.includes("next_commands") &&
      validationSelectionMatrix.includes("deferred_commands")
  );
  add(
    "selection_matrix_names_recommendation_profiles",
    validationSelectionMatrix.includes("| `daily` |") &&
      validationSelectionMatrix.includes("| `observability` |") &&
      validationSelectionMatrix.includes("| `mvp` |") &&
      validationSelectionMatrix.includes("| `targeted` |")
  );
  add(
    "selection_matrix_documents_change_selection_modes",
    validationSelectionMatrix.includes("Change selection modes:") &&
    validationSelectionMatrix.includes("`git_diff_worktree`") &&
      validationSelectionMatrix.includes("untracked non-ignored files") &&
      validationSelectionMatrix.includes("`git_diff_cached`") &&
      validationSelectionMatrix.includes("intentionally excludes untracked files") &&
      validationSelectionMatrix.includes("`git_diff_base`") &&
      validationSelectionMatrix.includes("`argv`") &&
      validationSelectionMatrix.includes("tracked_diff_files") &&
      validationSelectionMatrix.includes("untracked_files") &&
      validationSelectionMatrix.includes("explicit_file_list")
  );
  add(
    "selection_matrix_documents_legacy_aliases",
    validationSelectionMatrix.includes("active_recommended") &&
      validationSelectionMatrix.includes("mvp_recommended") &&
      validationSelectionMatrix.includes("compatibility aliases") &&
      validationSelectionMatrix.includes("New") &&
      validationSelectionMatrix.includes("consumers should not branch primarily on them")
  );
}

function validateGitBaseMode() {
  const result = runRecommenderArgs([recommenderScript, "--base", "HEAD"]);
  add("git_base_mode_passed", result.passed === true);
  add("git_base_mode_source", result.source === "git_diff_base", result.source);
  add("git_base_mode_comparison_base", result.comparison_base === "HEAD", result.comparison_base);
  add("git_base_mode_contract_version_v1", result.recommendation_contract_version === 1, result.recommendation_contract_version);
  add("git_base_mode_change_selection_source", result.change_selection?.source === "git_diff_base", result.change_selection);
  add("git_base_mode_change_selection_comparison_base", result.change_selection?.comparison_base === "HEAD", result.change_selection);
  add("git_base_mode_change_selection_file_count", result.change_selection?.file_count === result.changed_files.length, result.change_selection);
  add("git_base_mode_change_selection_counts_present", typeof result.change_selection?.tracked_diff_file_count === "number" &&
    typeof result.change_selection?.untracked_file_count === "number" &&
    typeof result.change_selection?.explicit_file_count === "number", result.change_selection);
  add("git_base_mode_change_selection_file_count_reconciles", result.change_selection?.file_count ===
    new Set([...(result.change_selection?.tracked_diff_files || []), ...(result.change_selection?.untracked_files || [])]).size, result.change_selection);
  add("git_base_mode_changed_files_array", Array.isArray(result.changed_files), result.changed_files);
  add("git_base_mode_profile_present", result.recommended_validation_profile && typeof result.recommended_validation_profile === "object");
  add("git_base_mode_validation_plan_present", result.validation_plan && typeof result.validation_plan === "object");
  add("git_base_mode_efficiency_summary_present", result.efficiency_summary && typeof result.efficiency_summary === "object");
  add("git_base_mode_validation_decision_summary_present", result.validation_decision_summary && typeof result.validation_decision_summary === "object");
  add("git_base_mode_manifest_coverage_present", result.manifest_coverage && typeof result.manifest_coverage === "object");
  add("git_base_mode_provider_contact_false", result.provider_contact_performed === false, result.provider_contact_performed);
  add("git_base_mode_file_write_false", result.file_write_performed === false, result.file_write_performed);
}

function validateDefaultWorktreeMode() {
  const result = runRecommenderArgs([recommenderScript]);
  const trackedDiffFiles = gitList(["diff", "--name-only"]);
  const untrackedFiles = gitList(["ls-files", "--others", "--exclude-standard"]);
  const expectedFiles = [...new Set([...trackedDiffFiles, ...untrackedFiles])];

  add("default_worktree_mode_passed", result.passed === true);
  add("default_worktree_mode_source", result.source === "git_diff_worktree", result.source);
  add("default_worktree_mode_comparison_base_null", result.comparison_base === null, result.comparison_base);
  add("default_worktree_mode_change_selection_source", result.change_selection?.source === "git_diff_worktree", result.change_selection);
  add("default_worktree_mode_file_count", result.change_selection?.file_count === result.changed_files.length, result.change_selection);
  add("default_worktree_mode_explicit_file_count_zero", result.change_selection?.explicit_file_count === 0, result.change_selection);
  add("default_worktree_mode_tracked_diff_matches_git", sameMembers(result.change_selection?.tracked_diff_files, trackedDiffFiles), {
    expected: trackedDiffFiles,
    actual: result.change_selection?.tracked_diff_files,
  });
  add("default_worktree_mode_untracked_matches_git", sameMembers(result.change_selection?.untracked_files, untrackedFiles), {
    expected: untrackedFiles,
    actual: result.change_selection?.untracked_files,
  });
  add("default_worktree_mode_changed_files_match_union", sameMembers(result.changed_files, expectedFiles), {
    expected: expectedFiles,
    actual: result.changed_files,
  });
  add("default_worktree_mode_manifest_coverage_count_matches", result.manifest_coverage?.changed_file_count === expectedFiles.length, result.manifest_coverage);
}

function validateEffectiveChangeSelection() {
  const explicitFilesWithBase = runRecommenderArgs([
    recommenderScript,
    "--base",
    "HEAD",
    "--files",
    "package.json",
  ]);
  add("effective_selection_argv_source_wins", explicitFilesWithBase.source === "argv", explicitFilesWithBase);
  add("effective_selection_argv_omits_comparison_base", explicitFilesWithBase.comparison_base === null, explicitFilesWithBase);
  add("effective_selection_argv_change_selection_omits_comparison_base", explicitFilesWithBase.change_selection?.comparison_base === null, explicitFilesWithBase.change_selection);
  add("effective_selection_argv_explicit_files_true", explicitFilesWithBase.change_selection?.explicit_files === true, explicitFilesWithBase.change_selection);
  add("effective_selection_argv_cached_false", explicitFilesWithBase.change_selection?.cached === false, explicitFilesWithBase.change_selection);
  add("effective_selection_argv_explicit_count", explicitFilesWithBase.change_selection?.explicit_file_count === explicitFilesWithBase.changed_files.length, explicitFilesWithBase.change_selection);
  add("effective_selection_argv_no_git_file_counts", explicitFilesWithBase.change_selection?.tracked_diff_file_count === 0 &&
    explicitFilesWithBase.change_selection?.untracked_file_count === 0, explicitFilesWithBase.change_selection);

  const cachedWithBase = runRecommenderArgs([recommenderScript, "--cached", "--base", "HEAD"]);
  add("effective_selection_cached_source_wins", cachedWithBase.source === "git_diff_cached", cachedWithBase);
  add("effective_selection_cached_omits_comparison_base", cachedWithBase.comparison_base === null, cachedWithBase);
  add("effective_selection_cached_change_selection_omits_comparison_base", cachedWithBase.change_selection?.comparison_base === null, cachedWithBase.change_selection);
  add("effective_selection_cached_flag_true", cachedWithBase.change_selection?.cached === true, cachedWithBase.change_selection);
  add("effective_selection_cached_explicit_files_false", cachedWithBase.change_selection?.explicit_files === false, cachedWithBase.change_selection);
  add("effective_selection_cached_untracked_count_zero", cachedWithBase.change_selection?.untracked_file_count === 0 &&
    Array.isArray(cachedWithBase.change_selection?.untracked_files) &&
    cachedWithBase.change_selection.untracked_files.length === 0, cachedWithBase.change_selection);
}

function validateLatestBenchmarkReportContract() {
  const reportNames = fs.readdirSync(benchmarkReportsDir)
    .filter((name) => /^validation_efficiency_baseline_\d{4}-\d{2}-\d{2}T.*\.json$/.test(name))
    .sort();
  const latestReportName = reportNames[reportNames.length - 1];
  add("latest_benchmark_report_present", Boolean(latestReportName), reportNames);
  if (!latestReportName) return;

  const reportPath = path.join(benchmarkReportsDir, latestReportName);
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  const profiles = report.recommendation_profile_baselines || {};
  const benchmarkInProgress = process.env.AIL_VALIDATION_BENCHMARK_IN_PROGRESS === "1";
  add("latest_benchmark_report_passed", benchmarkInProgress || report.passed === true, {
    latestReportName,
    passed: report.passed,
    benchmarkInProgress,
  });
  add("latest_benchmark_report_kind", report.benchmark === "validation_efficiency_baseline", report.benchmark);
  add("latest_benchmark_report_written_mode", report.file_write_performed === true, report.file_write_performed);
  add("latest_benchmark_report_output_path_matches", normalizePath(report.output_path || "") === `reports/validation_benchmarks/${latestReportName}`, report.output_path);
  add("latest_benchmark_report_active_baseline_present", benchmarkInProgress || (Array.isArray(report.summary) && report.summary.some((entry) =>
    entry.id === "validate_active" &&
    entry.command === "npm run validate:active" &&
    entry.passed_iterations >= 1
  )), {
    benchmarkInProgress,
    summary: report.summary,
  });
  add("latest_benchmark_report_provider_contact_false", report.provider_contact_performed === false, report.provider_contact_performed);
  add("latest_benchmark_report_plugin_call_false", report.plugin_call_performed === false, report.plugin_call_performed);
  add("latest_benchmark_report_api_call_false", report.api_call_performed === false, report.api_call_performed);
  add("latest_benchmark_report_image_generation_false", report.image_generation_performed === false, report.image_generation_performed);
  add("latest_benchmark_report_secret_value_read_false", report.secret_value_read_performed === false, report.secret_value_read_performed);
  const nextCommandsBaseline = report.next_commands_baseline || null;
  add("latest_benchmark_report_next_commands_baseline_present", benchmarkInProgress || (nextCommandsBaseline && typeof nextCommandsBaseline === "object"), {
    benchmarkInProgress,
    next_commands_baseline: nextCommandsBaseline,
  });
  add("latest_benchmark_report_next_commands_baseline_passed", benchmarkInProgress || nextCommandsBaseline?.passed === true, {
    benchmarkInProgress,
    next_commands_baseline: nextCommandsBaseline,
  });
  add("latest_benchmark_report_next_commands_baseline_contract_v1", benchmarkInProgress || nextCommandsBaseline?.recommendation_contract_version === 1, nextCommandsBaseline?.recommendation_contract_version);
  add("latest_benchmark_report_next_commands_baseline_daily_profile", benchmarkInProgress || nextCommandsBaseline?.primary_profile === "daily", nextCommandsBaseline?.primary_profile);
  add("latest_benchmark_report_next_commands_baseline_active_command", benchmarkInProgress || nextCommandsBaseline?.primary_command === "npm run validate:active", nextCommandsBaseline?.primary_command);
  add("latest_benchmark_report_next_commands_baseline_commands_array", benchmarkInProgress || (Array.isArray(nextCommandsBaseline?.next_commands) &&
    nextCommandsBaseline.next_commands.includes("node scripts/validate_validation_manifest.js") &&
    nextCommandsBaseline.next_commands.includes("npm run validate:active")), nextCommandsBaseline?.next_commands);
  add("latest_benchmark_report_next_commands_baseline_deferred_array", benchmarkInProgress || Array.isArray(nextCommandsBaseline?.deferred_commands), nextCommandsBaseline?.deferred_commands);

  for (const profileName of ["daily", "observability", "mvp", "targeted"]) {
    const profile = profiles[profileName];
    add(`latest_benchmark_report_${profileName}_profile_present`, profile && typeof profile === "object", profile);
    add(`latest_benchmark_report_${profileName}_contract_v1`, profile?.recommendation_contract_version === 1, profile?.recommendation_contract_version);
    add(`latest_benchmark_report_${profileName}_source_present`, typeof profile?.source === "string" && profile.source.length > 0, profile?.source);
    add(`latest_benchmark_report_${profileName}_change_selection_present`, profile?.change_selection && typeof profile.change_selection === "object", profile?.change_selection);
    add(`latest_benchmark_report_${profileName}_change_selection_source_matches`, profile?.change_selection?.source === profile?.source, profile?.change_selection);
    add(`latest_benchmark_report_${profileName}_validation_plan_present`, profile?.validation_plan && typeof profile.validation_plan === "object", profile?.validation_plan);
    add(`latest_benchmark_report_${profileName}_efficiency_summary_present`, profile?.efficiency_summary && typeof profile.efficiency_summary === "object", profile?.efficiency_summary);
    add(`latest_benchmark_report_${profileName}_decision_summary_present`, benchmarkInProgress || (profile?.validation_decision_summary && typeof profile.validation_decision_summary === "object"), {
      benchmarkInProgress,
      validation_decision_summary: profile?.validation_decision_summary,
    });
    add(`latest_benchmark_report_${profileName}_deferred_commands_array`, Array.isArray(profile?.deferred_commands), profile?.deferred_commands);
    add(`latest_benchmark_report_${profileName}_plan_deferred_commands_array`, Array.isArray(profile?.validation_plan?.deferred_commands), profile?.validation_plan);
  }

  const mvpProfile = profiles.mvp;
  add("latest_benchmark_report_mvp_omits_redundant_readonly_mvp_command", Array.isArray(mvpProfile?.recommended_commands) &&
    !mvpProfile.recommended_commands.includes("node scripts/validate_readonly_visual_review_mvp.js"), mvpProfile?.recommended_commands);
  add("latest_benchmark_report_mvp_covers_readonly_mvp_command", Array.isArray(mvpProfile?.covered_commands) &&
    mvpProfile.covered_commands.some((entry) =>
      entry.command === "node scripts/validate_readonly_visual_review_mvp.js" &&
      entry.covered_by_command === "npm run validate:mvp"
    ), mvpProfile?.covered_commands);
  add("latest_benchmark_report_mvp_defers_capsule_regression", Array.isArray(mvpProfile?.deferred_commands) &&
    mvpProfile.deferred_commands.some((entry) =>
      entry.command === "npm run validate:capsule-regression" &&
      entry.deferred_to_command === "npm run validate:archive-plan"
    ), mvpProfile?.deferred_commands);
}

function main() {
  validateCase("daily_package_json", ["package.json"], {
    primaryProfile: "daily",
    primaryCommand: "npm run validate:active",
    dailyRecommended: true,
    observabilityRecommended: false,
    mvpRecommended: true,
    allFilesMatched: true,
    commands: ["npm run validate:active"],
    planSteps: [
      { command: "node scripts/validate_validation_manifest.js", kind: "base" },
      { command: "npm run validate:active", kind: "profile" },
    ],
    coveredProfiles: [
      { profile: "mvp", coveredByCommand: "npm run validate:active" },
    ],
    coveredCommands: [
      { command: "node scripts/validate_validation_recommendation_profiles.js", coveredByCommand: "npm run validate:active" },
      { command: "npm run validate:smoke", coveredByCommand: "npm run validate:active" },
    ],
    minimumOmittedRedundantItemCount: 3,
    profileCommands: ["npm run validate:active"],
    reasons: [
      { profile: "daily", command: "npm run validate:active", file: "package.json" },
      { profile: "mvp", command: "npm run validate:mvp", file: "package.json" },
    ],
    catalog: [
      { profile: "daily", command: "npm run validate:active", recommended: true, file: "package.json" },
      { profile: "mvp", command: "npm run validate:mvp", recommended: true, file: "package.json", coveredByCommand: "npm run validate:active" },
    ],
  });

  validateCase("daily_package_plus_adapter_smoke_aggregation", ["package.json", "adapters/image_generation/native_doubao_adapter.js"], {
    primaryProfile: "daily",
    primaryCommand: "npm run validate:active",
    dailyRecommended: true,
    observabilityRecommended: false,
    mvpRecommended: true,
    allFilesMatched: true,
    commands: [
      "npm run validate:active",
      "node scripts/run_native_doubao_image_generation.js --case-id=tennis_wallet_hero_v2_preflight --dry-run=true",
    ],
    planSteps: [
      { command: "node scripts/validate_validation_manifest.js", kind: "base" },
      { command: "npm run validate:active", kind: "profile" },
      {
        command: "node scripts/run_native_doubao_image_generation.js --case-id=tennis_wallet_hero_v2_preflight --dry-run=true",
        kind: "matched_validator",
      },
    ],
    coveredProfiles: [
      { profile: "mvp", coveredByCommand: "npm run validate:active" },
    ],
    coveredCommands: [
      {
        command: "npm run validate:smoke",
        coveredByCommand: "npm run validate:active",
        files: ["package.json", "adapters/image_generation/native_doubao_adapter.js"],
        validatorIds: ["smoke", "native_doubao_adapter_authorization_boundary"],
      },
    ],
    minimumOmittedRedundantItemCount: 3,
    profileCommands: ["npm run validate:active"],
    reasons: [
      { profile: "daily", command: "npm run validate:active", file: "package.json" },
      { profile: "mvp", command: "npm run validate:mvp", file: "package.json" },
    ],
    catalog: [
      { profile: "daily", command: "npm run validate:active", recommended: true, file: "package.json" },
      { profile: "mvp", command: "npm run validate:mvp", recommended: true, file: "package.json", coveredByCommand: "npm run validate:active" },
    ],
  });

  validateCase("observability_benchmark_report", ["reports/validation_benchmarks/validation_efficiency_baseline_example.json"], {
    primaryProfile: "observability",
    primaryCommand: "node scripts/benchmark_validation_efficiency.js --no-write --iterations=1",
    dailyRecommended: false,
    observabilityRecommended: true,
    mvpRecommended: false,
    allFilesMatched: true,
    commands: ["node scripts/benchmark_validation_efficiency.js --no-write --iterations=1"],
    planSteps: [
      { command: "node scripts/validate_validation_manifest.js", kind: "base" },
      { command: "node scripts/benchmark_validation_efficiency.js --no-write --iterations=1", kind: "profile" },
    ],
    profileCommands: ["node scripts/benchmark_validation_efficiency.js --no-write --iterations=1"],
    reasons: [
      {
        profile: "observability",
        command: "node scripts/benchmark_validation_efficiency.js --no-write --iterations=1",
        file: "reports/validation_benchmarks/validation_efficiency_baseline_example.json",
      },
    ],
    catalog: [
      {
        profile: "observability",
        command: "node scripts/benchmark_validation_efficiency.js --no-write --iterations=1",
        recommended: true,
        file: "reports/validation_benchmarks/validation_efficiency_baseline_example.json",
      },
    ],
  });

  validateCase("mvp_review_console", ["review_console/static_prototype/app.js"], {
    primaryProfile: "mvp",
    primaryCommand: "npm run validate:mvp",
    dailyRecommended: false,
    observabilityRecommended: false,
    mvpRecommended: true,
    allFilesMatched: true,
    commands: ["npm run validate:mvp"],
    planSteps: [
      { command: "node scripts/validate_validation_manifest.js", kind: "base" },
      { command: "npm run validate:mvp", kind: "profile" },
    ],
    coveredCommands: [
      {
        command: "node scripts/validate_readonly_visual_review_mvp.js",
        coveredByCommand: "npm run validate:mvp",
        files: ["review_console/static_prototype/app.js"],
        validatorIds: ["readonly_visual_review_mvp"],
      },
    ],
    deferredCommands: [
      {
        command: "npm run validate:capsule-regression",
        deferredToCommand: "npm run validate:archive-plan",
        files: ["review_console/static_prototype/app.js"],
        validatorIds: ["capsule_product_core_regression"],
      },
    ],
    minimumOmittedRedundantItemCount: 2,
    profileCommands: ["npm run validate:mvp"],
    reasons: [
      { profile: "mvp", command: "npm run validate:mvp", file: "review_console/static_prototype/app.js" },
    ],
    catalog: [
      { profile: "mvp", command: "npm run validate:mvp", recommended: true, file: "review_console/static_prototype/app.js" },
    ],
  });

  validateCase("targeted_recommender_script", ["scripts/recommend_validation_for_changed_files.js"], {
    primaryProfile: "targeted",
    primaryCommand: "npm run validate:targeted-plan",
    dailyRecommended: false,
    observabilityRecommended: false,
    mvpRecommended: false,
    allFilesMatched: true,
    commands: ["node scripts/validate_validation_manifest.js", "npm run validate:targeted-plan"],
    planSteps: [
      { command: "node scripts/validate_validation_manifest.js", kind: "base" },
      { command: "npm run validate:targeted-plan", kind: "profile" },
      { command: "node scripts/validate_validation_recommendation_profiles.js", kind: "matched_validator" },
    ],
    profileCommands: ["npm run validate:targeted-plan"],
    reasons: [
      { profile: "targeted", command: "npm run validate:targeted-plan", file: "scripts/recommend_validation_for_changed_files.js" },
    ],
    catalog: [
      { profile: "targeted", command: "npm run validate:targeted-plan", recommended: true, file: "scripts/recommend_validation_for_changed_files.js" },
    ],
  });

  validateCase("targeted_selection_matrix_contract_doc", ["docs/VALIDATION_SELECTION_MATRIX.md"], {
    primaryProfile: "targeted",
    primaryCommand: "npm run validate:targeted-plan",
    dailyRecommended: false,
    observabilityRecommended: false,
    mvpRecommended: false,
    allFilesMatched: true,
    commands: [
      "node scripts/validate_validation_manifest.js",
      "npm run validate:smoke",
      "npm run validate:targeted-plan",
      "node scripts/validate_validation_recommendation_profiles.js",
    ],
    planSteps: [
      { command: "node scripts/validate_validation_manifest.js", kind: "base" },
      { command: "npm run validate:smoke", kind: "base" },
      { command: "npm run validate:targeted-plan", kind: "profile" },
      { command: "node scripts/validate_validation_recommendation_profiles.js", kind: "matched_validator" },
    ],
    deferredCommands: [
      {
        command: "npm run validate:governance",
        deferredToCommand: "npm run validate:archive-plan",
        files: ["docs/VALIDATION_SELECTION_MATRIX.md"],
        validatorIds: ["governance"],
      },
    ],
    minimumOmittedRedundantItemCount: 1,
    profileCommands: ["npm run validate:targeted-plan"],
    reasons: [
      { profile: "targeted", command: "npm run validate:targeted-plan", file: "docs/VALIDATION_SELECTION_MATRIX.md" },
    ],
    catalog: [
      { profile: "targeted", command: "npm run validate:targeted-plan", recommended: true, file: "docs/VALIDATION_SELECTION_MATRIX.md" },
    ],
  });

  validateCase("unmatched_local_note", ["local_notes/unindexed_surface.txt"], {
    primaryProfile: "targeted",
    primaryCommand: "npm run validate:targeted-plan",
    dailyRecommended: false,
    observabilityRecommended: false,
    mvpRecommended: false,
    allFilesMatched: false,
    unmatchedFiles: ["local_notes/unindexed_surface.txt"],
    commands: ["node scripts/validate_validation_manifest.js", "npm run validate:smoke", "npm run validate:targeted-plan"],
    planSteps: [
      { command: "node scripts/validate_validation_manifest.js", kind: "base" },
      { command: "npm run validate:smoke", kind: "base" },
      { command: "npm run validate:targeted-plan", kind: "profile" },
    ],
    profileCommands: ["npm run validate:targeted-plan"],
    reasons: [
      { profile: "targeted", command: "npm run validate:targeted-plan", file: "local_notes/unindexed_surface.txt" },
    ],
    catalog: [
      { profile: "targeted", command: "npm run validate:targeted-plan", recommended: true, file: "local_notes/unindexed_surface.txt" },
    ],
  });
  validateWiring();
  validateDefaultWorktreeMode();
  validateGitBaseMode();
  validateEffectiveChangeSelection();
  validateLatestBenchmarkReportContract();

  const failed = checks.filter((check) => !check.passed);
  const output = {
    passed: failed.length === 0,
    validator: "validate_validation_recommendation_profiles",
    failed_count: failed.length,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
    file_write_performed: false,
    checks,
  };

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  process.exit(output.passed ? 0 : 1);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${JSON.stringify({
    passed: false,
    validator: "validate_validation_recommendation_profiles",
    error: error.message,
  }, null, 2)}\n`);
  process.exit(1);
}
