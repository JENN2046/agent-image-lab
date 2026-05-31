#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "scripts", "validation_manifest.json"), "utf8"));
const targetedPlanCommand = "npm run validate:targeted-plan";
const recommendationContractVersion = 1;

function parseArgs(argv) {
  const args = {
    base: null,
    cached: false,
    files: [],
    nextCommandsFormat: null,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--cached") {
      args.cached = true;
    } else if (arg === "--base") {
      args.base = argv[index + 1] || "";
      index += 1;
    } else if (arg.startsWith("--base=")) {
      args.base = arg.slice("--base=".length);
    } else if (arg === "--files") {
      const value = argv[index + 1] || "";
      index += 1;
      args.files.push(...value.split(",").map((item) => item.trim()).filter(Boolean));
    } else if (arg === "--next-commands") {
      args.nextCommandsFormat = "text";
    } else if (arg.startsWith("--next-commands=")) {
      const value = arg.slice("--next-commands=".length).trim().toLowerCase();
      args.nextCommandsFormat = value === "json" || value === "json-lite" ? "json" : "text";
    } else {
      args.files.push(arg);
    }
  }
  return args;
}

function changedFilesFromGit({ cached, base }) {
  const diffArgs = ["diff", "--name-only"];
  if (cached) {
    diffArgs.push("--cached");
  } else if (base) {
    diffArgs.push(base, "--");
  }
  const output = execFileSync("git", diffArgs, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const changed = output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (cached) {
    return {
      files: changed,
      tracked_diff_files: changed,
      untracked_files: [],
    };
  }

  const untrackedOutput = execFileSync("git", ["ls-files", "--others", "--exclude-standard"], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const untracked = untrackedOutput.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return {
    files: [...new Set([...changed, ...untracked])],
    tracked_diff_files: changed,
    untracked_files: untracked,
  };
}

function normalizePath(file) {
  return file.replace(/\\/g, "/").replace(/^\.\//, "");
}

function globToRegExp(pattern) {
  const normalized = normalizePath(pattern);
  let source = "";
  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index];
    const next = normalized[index + 1];
    if (char === "*" && next === "*") {
      source += ".*";
      index += 1;
    } else if (char === "*") {
      source += "[^/]*";
    } else {
      source += char.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
    }
  }
  return new RegExp(`^${source}$`);
}

function matchesTrigger(file, trigger) {
  const normalizedFile = normalizePath(file);
  const normalizedTrigger = normalizePath(trigger);
  if (normalizedTrigger.endsWith("/**")) {
    return normalizedFile.startsWith(normalizedTrigger.slice(0, -3));
  }
  if (normalizedTrigger.includes("*")) {
    return globToRegExp(normalizedTrigger).test(normalizedFile);
  }
  return normalizedFile === normalizedTrigger;
}

function buildRecommendedValidationProfile({
  activeRecommended,
  observabilityRecommended,
  mvpRecommended,
  matches,
  normalizedFiles,
}) {
  const reasons = [];
  const dailyMatchedFiles = normalizedFiles.filter((file) => file === "package.json");
  if (activeRecommended) {
    reasons.push({
      profile: "daily",
      command: "npm run validate:active",
      reason: "package.json changed; run the daily active aggregate to cover validation entrypoint drift.",
      matched_files: dailyMatchedFiles,
    });
  }

  const observabilityMatches = matches.filter((entry) => entry.domain === "validation_observability");
  const observabilityMatchedFiles = [...new Set(observabilityMatches.flatMap((entry) => entry.matched_files))];
  if (observabilityRecommended) {
    reasons.push({
      profile: "observability",
      command: "node scripts/benchmark_validation_efficiency.js --no-write --iterations=1",
      reason: "benchmark tooling or report changed; run a no-write one-iteration observability check.",
      matched_files: observabilityMatchedFiles,
    });
  }

  const mvpMatches = matches.filter((entry) => entry.tier === "mvp");
  const mvpMatchedFiles = [...new Set([
    ...mvpMatches.flatMap((entry) => entry.matched_files),
    ...normalizedFiles.filter((file) => file === "scripts/validate_mvp_core.js" || file === "package.json"),
  ])];
  if (mvpRecommended) {
    reasons.push({
      profile: "mvp",
      command: "npm run validate:mvp",
      reason: "MVP-tier validation surface changed or package.json can affect MVP validation wiring.",
      matched_files: mvpMatchedFiles,
    });
  }

  const primaryProfile = activeRecommended
    ? "daily"
    : (observabilityRecommended ? "observability" : (mvpRecommended ? "mvp" : "targeted"));
  const targetedRecommended = primaryProfile === "targeted";
  const targetedMatchedFiles = targetedRecommended ? normalizedFiles : [];
  if (targetedRecommended) {
    reasons.push({
      profile: "targeted",
      command: targetedPlanCommand,
      reason: "No aggregate profile triggered; use the targeted plan entry plus recommended_commands for manifest, smoke, and matched targeted validators.",
      matched_files: targetedMatchedFiles,
    });
  }
  const profileCatalog = {
    daily: {
      command: "npm run validate:active",
      covered_by_command: null,
      recommended: activeRecommended,
      primary: primaryProfile === "daily",
      matched_files: dailyMatchedFiles,
      reason: "package.json changed; run the daily active aggregate to cover validation entrypoint drift.",
    },
    observability: {
      command: "node scripts/benchmark_validation_efficiency.js --no-write --iterations=1",
      covered_by_command: null,
      recommended: observabilityRecommended,
      primary: primaryProfile === "observability",
      matched_files: observabilityMatchedFiles,
      reason: "benchmark tooling or report changed; run a no-write one-iteration observability check.",
    },
    mvp: {
      command: "npm run validate:mvp",
      covered_by_command: activeRecommended ? "npm run validate:active" : null,
      recommended: mvpRecommended,
      primary: primaryProfile === "mvp",
      matched_files: mvpMatchedFiles,
      reason: "MVP-tier validation surface changed or package.json can affect MVP validation wiring.",
    },
    targeted: {
      command: targetedPlanCommand,
      covered_by_command: null,
      recommended: targetedRecommended,
      primary: targetedRecommended,
      matched_files: targetedMatchedFiles,
      reason: "No aggregate profile triggered; use the targeted plan entry plus recommended_commands for manifest, smoke, and matched targeted validators.",
    },
  };
  const profileCommands = [...new Set(Object.values(profileCatalog)
    .filter((entry) => entry.recommended && entry.command && !entry.covered_by_command)
    .map((entry) => entry.command))];

  return {
    primary_profile: primaryProfile,
    profiles: reasons.map((entry) => entry.profile),
    primary_command: profileCatalog[primaryProfile].command,
    profile_commands: profileCommands,
    profile_catalog: profileCatalog,
    daily_recommended: activeRecommended,
    observability_recommended: observabilityRecommended,
    mvp_recommended: mvpRecommended,
    reasons,
  };
}

function buildManifestCoverage({ normalizedFiles, matches }) {
  const matchedFiles = [...new Set(matches.flatMap((entry) => entry.matched_files))];
  const unmatchedFiles = normalizedFiles.filter((file) => !matchedFiles.includes(file));
  return {
    all_files_matched: unmatchedFiles.length === 0,
    changed_file_count: normalizedFiles.length,
    matched_file_count: matchedFiles.length,
    unmatched_file_count: unmatchedFiles.length,
    matched_files: matchedFiles,
    unmatched_files: unmatchedFiles,
  };
}

function buildValidationPlan({ commands, baseCommands, recommendedValidationProfile, matches, manifestCoverage, coveredCommands, deferredCommands }) {
  const baseReasons = new Map([
    ["node scripts/validate_validation_manifest.js", "Always validate the validation manifest before trusting selected validators."],
    ["npm run validate:active", "package.json changed; run the daily active aggregate."],
    ["npm run validate:smoke", "Run smoke validation unless the changed files already directly trigger it."],
  ]);
  const profileCatalog = recommendedValidationProfile.profile_catalog || {};
  const coveredProfiles = Object.entries(profileCatalog)
    .filter(([, entry]) => entry.recommended && entry.covered_by_command)
    .map(([profile, entry]) => ({
      profile,
      command: entry.command,
      covered_by_command: entry.covered_by_command,
      matched_files: entry.matched_files,
      reason: entry.reason,
    }));

  const steps = commands.map((command, index) => {
    const sources = [];
    if (baseCommands.includes(command)) {
      sources.push({
        kind: "base",
        reason: baseReasons.get(command) || "Base validation command selected by recommender policy.",
      });
    }

    for (const [profile, entry] of Object.entries(profileCatalog)) {
      if (entry.recommended && entry.command === command && !entry.covered_by_command) {
        sources.push({
          kind: "profile",
          profile,
          primary: entry.primary,
          matched_files: entry.matched_files,
          reason: entry.reason,
        });
      }
    }

    for (const match of matches.filter((entry) => entry.command === command)) {
      sources.push({
        kind: "matched_validator",
        validator_id: match.id,
        tier: match.tier,
        domain: match.domain,
        estimated_runtime_class: match.estimated_runtime_class,
        matched_files: match.matched_files,
      });
    }

    return {
      order: index + 1,
      command,
      sources,
    };
  });

  return {
    version: 1,
    primary_profile: recommendedValidationProfile.primary_profile,
    primary_command: recommendedValidationProfile.primary_command,
    manifest_coverage: manifestCoverage,
    execution_commands: commands,
    steps,
    covered_commands: coveredCommands,
    covered_profiles: coveredProfiles,
    deferred_commands: deferredCommands,
  };
}

function buildEfficiencySummary({ commands, matches, manifestCoverage, recommendedValidationProfile, validationPlan }) {
  const coveredCommandValidatorIds = new Set(
    validationPlan.covered_commands.flatMap((entry) => entry.matched_validator_ids || [])
  );
  const coveredCommandFiles = new Set(
    validationPlan.covered_commands.flatMap((entry) => entry.matched_files || [])
  );
  return {
    execution_command_count: commands.length,
    matched_validator_count: matches.length,
    profile_count: recommendedValidationProfile.profiles.length,
    profile_command_count: recommendedValidationProfile.profile_commands.length,
    covered_command_count: validationPlan.covered_commands.length,
    covered_profile_count: validationPlan.covered_profiles.length,
    covered_validator_count: coveredCommandValidatorIds.size,
    covered_file_count: coveredCommandFiles.size,
    deferred_command_count: validationPlan.deferred_commands.length,
    omitted_redundant_item_count: validationPlan.covered_commands.length + validationPlan.covered_profiles.length + validationPlan.deferred_commands.length,
    all_files_matched: manifestCoverage.all_files_matched,
    unmatched_file_count: manifestCoverage.unmatched_file_count,
  };
}

function buildValidationDecisionSummary({ recommendedValidationProfile, validationPlan, efficiencySummary, manifestCoverage }) {
  return {
    version: 1,
    primary_profile: recommendedValidationProfile.primary_profile,
    primary_command: recommendedValidationProfile.primary_command,
    execution_command_count: efficiencySummary.execution_command_count,
    matched_validator_count: efficiencySummary.matched_validator_count,
    all_files_matched: manifestCoverage.all_files_matched,
    unmatched_file_count: manifestCoverage.unmatched_file_count,
    covered_command_count: efficiencySummary.covered_command_count,
    covered_profile_count: efficiencySummary.covered_profile_count,
    deferred_command_count: efficiencySummary.deferred_command_count,
    next_commands: validationPlan.execution_commands,
    deferred_commands: validationPlan.deferred_commands.map((entry) => ({
      command: entry.command,
      deferred_to_command: entry.deferred_to_command,
      matched_files: entry.matched_files,
    })),
    reasons: recommendedValidationProfile.reasons.map((entry) => ({
      profile: entry.profile,
      command: entry.command,
      reason: entry.reason,
      matched_files: entry.matched_files,
    })),
  };
}

function buildNextCommandsOutput(output, format) {
  const summary = output.validation_decision_summary || {};
  const nextCommands = Array.isArray(summary.next_commands) ? summary.next_commands : [];
  const deferredCommands = Array.isArray(summary.deferred_commands) ? summary.deferred_commands : [];
  if (format === "json") {
    return `${JSON.stringify({
      passed: output.passed === true,
      recommender: output.recommender,
      recommendation_contract_version: output.recommendation_contract_version,
      primary_profile: summary.primary_profile || null,
      primary_command: summary.primary_command || null,
      next_commands: nextCommands,
      deferred_commands: deferredCommands,
    }, null, 2)}\n`;
  }
  return `${nextCommands.join("\n")}${nextCommands.length > 0 ? "\n" : ""}`;
}

function buildCoveredCommands({ activeRecommended, mvpRecommended, matches }) {
  const activeCoveredCommands = new Set([
    "npm run validate:smoke",
    "node scripts/validate_validation_recommendation_profiles.js",
    "npm run validate:mvp",
  ]);

  const coveredByCommand = new Map();

  if (activeRecommended) {
    for (const entry of matches.filter((match) => activeCoveredCommands.has(match.command))) {
      const existing = coveredByCommand.get(entry.command) || {
        command: entry.command,
        covered_by_command: "npm run validate:active",
        reason: "validate:active already runs this command; omit it from execution_commands to avoid redundant daily validation.",
        matched_files: [],
        matched_validator_ids: [],
      };
      existing.matched_files = [...new Set([...existing.matched_files, ...entry.matched_files])];
      existing.matched_validator_ids = [...new Set([...existing.matched_validator_ids, entry.id])];
      coveredByCommand.set(entry.command, existing);
    }
  }

  if (mvpRecommended && !activeRecommended) {
    for (const entry of matches.filter((match) => match.tier === "mvp" && match.command !== "npm run validate:mvp")) {
      const existing = coveredByCommand.get(entry.command) || {
        command: entry.command,
        covered_by_command: "npm run validate:mvp",
        reason: "npm run validate:mvp already runs this MVP-tier check; omit it from execution_commands to avoid redundant profile validation.",
        matched_files: [],
        matched_validator_ids: [],
      };
      existing.matched_files = [...new Set([...existing.matched_files, ...entry.matched_files])];
      existing.matched_validator_ids = [...new Set([...existing.matched_validator_ids, entry.id])];
      coveredByCommand.set(entry.command, existing);
    }
  }

  return [...coveredByCommand.values()];
}

function buildDeferredCommands({ matches }) {
  const deferredByCommand = new Map();
  for (const entry of matches.filter((match) => match.tier === "archive")) {
    const existing = deferredByCommand.get(entry.command) || {
      command: entry.command,
      deferred_to_command: "npm run validate:archive-plan",
      reason: "Archive-tier validators remain discoverable but are deferred from the default execution plan.",
      matched_files: [],
      matched_validator_ids: [],
    };
    existing.matched_files = [...new Set([...existing.matched_files, ...entry.matched_files])];
    existing.matched_validator_ids = [...new Set([...existing.matched_validator_ids, entry.id])];
    deferredByCommand.set(entry.command, existing);
  }

  return [...deferredByCommand.values()];
}

function recommend(files) {
  const normalizedFiles = files.map(normalizePath);
  const matches = [];

  for (const entry of manifest.validators || []) {
    const matched_files = normalizedFiles.filter((file) =>
      (entry.trigger_paths || []).some((trigger) => matchesTrigger(file, trigger))
    );
    if (matched_files.length > 0) {
      matches.push({
        id: entry.id,
        tier: entry.tier,
        domain: entry.domain,
        command: entry.command,
        estimated_runtime_class: entry.estimated_runtime_class,
        matched_files,
      });
    }
  }

  const baseCommands = [
    "node scripts/validate_validation_manifest.js",
  ];
  const activeRecommended = normalizedFiles.some((file) => file === "package.json");
  if (activeRecommended) {
    baseCommands.push("npm run validate:active");
  }
  if (!matches.some((entry) => entry.id === "smoke")) {
    baseCommands.push("npm run validate:smoke");
  }

  const mvpRecommended = matches.some((entry) => entry.tier === "mvp") ||
    normalizedFiles.some((file) => file === "scripts/validate_mvp_core.js" || file === "package.json");
  const observabilityRecommended = matches.some((entry) => entry.domain === "validation_observability");
  const manifestCoverage = buildManifestCoverage({ normalizedFiles, matches });
  const recommendedValidationProfile = buildRecommendedValidationProfile({
    activeRecommended,
    observabilityRecommended,
    mvpRecommended,
    matches,
    normalizedFiles,
  });
  const coveredCommands = buildCoveredCommands({ activeRecommended, mvpRecommended, matches });
  const deferredCommands = buildDeferredCommands({ matches });
  const coveredCommandSet = new Set(coveredCommands.map((entry) => entry.command));
  const deferredCommandSet = new Set(deferredCommands.map((entry) => entry.command));
  const commands = [...new Set([
    ...baseCommands,
    ...recommendedValidationProfile.profile_commands,
    ...matches
      .map((entry) => entry.command)
      .filter((command) => !coveredCommandSet.has(command) && !deferredCommandSet.has(command)),
  ])];
  const validationPlan = buildValidationPlan({
    commands,
    baseCommands,
    recommendedValidationProfile,
    matches,
    manifestCoverage,
    coveredCommands,
    deferredCommands,
  });
  const efficiencySummary = buildEfficiencySummary({
    commands,
    matches,
    manifestCoverage,
    recommendedValidationProfile,
    validationPlan,
  });
  const validationDecisionSummary = buildValidationDecisionSummary({
    recommendedValidationProfile,
    validationPlan,
    efficiencySummary,
    manifestCoverage,
  });

  return {
    recommendation_contract_version: recommendationContractVersion,
    changed_files: normalizedFiles,
    manifest_coverage: manifestCoverage,
    matched_validator_count: matches.length,
    recommended_commands: commands,
    deferred_commands: deferredCommands,
    validation_plan: validationPlan,
    efficiency_summary: efficiencySummary,
    validation_decision_summary: validationDecisionSummary,
    recommended_validation_profile: recommendedValidationProfile,
    active_recommended: activeRecommended,
    validate_active_command: "npm run validate:active",
    mvp_recommended: mvpRecommended,
    validate_mvp_command: "npm run validate:mvp",
    matches,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const gitSelection = args.files.length > 0 ? null : changedFilesFromGit({
    cached: args.cached,
    base: args.base,
  });
  const files = args.files.length > 0 ? args.files : gitSelection.files;
  const result = recommend(files);
  const source = args.files.length > 0 ? "argv" : (args.cached ? "git_diff_cached" : (args.base ? "git_diff_base" : "git_diff_worktree"));
  const comparisonBase = source === "git_diff_base" ? args.base : null;
  const trackedDiffFiles = (gitSelection?.tracked_diff_files || []).map(normalizePath);
  const untrackedFiles = (gitSelection?.untracked_files || []).map(normalizePath);
  const explicitFiles = source === "argv" ? result.changed_files : [];
  const output = {
    passed: true,
    recommender: "recommend_validation_for_changed_files",
    source,
    comparison_base: comparisonBase,
    change_selection: {
      source,
      comparison_base: comparisonBase,
      cached: source === "git_diff_cached",
      explicit_files: source === "argv",
      file_count: result.changed_files.length,
      tracked_diff_file_count: trackedDiffFiles.length,
      untracked_file_count: untrackedFiles.length,
      explicit_file_count: explicitFiles.length,
      tracked_diff_files: trackedDiffFiles,
      untracked_files: untrackedFiles,
      explicit_file_list: explicitFiles,
    },
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
    file_write_performed: false,
    ...result,
  };
  if (args.nextCommandsFormat) {
    process.stdout.write(buildNextCommandsOutput(output, args.nextCommandsFormat));
    return;
  }
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

main();
