#!/usr/bin/env node
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const validator = "runtime_to_review_v1_serum_bottle_output_directory_preflight_gate";
const gatePath = "reports/runtime_to_review_v1/serum_bottle_output_directory_preflight_gate_20260601.json";
const activationDraftPath = "reports/runtime_to_review_v1/serum_bottle_exact_live_activation_packet_draft_20260601.json";
const activationPreflightPath = "reports/runtime_to_review_v1/per_packet_owner_runtime_activation_preflight_20260601.json";
const inactivePacketPath = "reports/runtime_to_review_v1/guarded_live_probe_serum_bottle_inactive_preflight_packet_20260601.json";
const ownerRuntimePath = "adapters/runtime/native_doubao_runtime_v1_per_packet_owner_runtime.js";
const fixturePath = "tests/fixtures/runtime_kernel_v1_real_guarded_serum_bottle_task.fixture.json";
const promptPath = "prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml";
const expectedOutputDir = "runs/real_generation/runtime_to_review_v1_guarded_live_probe_serum_bottle/";
const packageScriptName = "validate:runtime-to-review-serum-bottle-output-directory-preflight";
const manifestId = "runtime_to_review_serum_bottle_output_directory_preflight";

let passed = true;
const results = [];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository: ${relativePath}`);
  }
  return resolved;
}

function normalizeRepoRelativePath(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string`);
  }
  if (path.isAbsolute(value)) {
    throw new Error(`${label} must be repository-relative`);
  }
  const normalized = value.replace(/\\/g, "/");
  if (normalized.split("/").includes("..")) {
    throw new Error(`${label} must not contain traversal`);
  }
  const resolved = path.resolve(root, normalized);
  const relative = path.relative(root, resolved).replace(/\\/g, "/");
  if (relative.startsWith("../") || relative === ".." || path.isAbsolute(relative)) {
    throw new Error(`${label} escapes repository root`);
  }
  return {
    relative: normalized.endsWith("/") ? `${relative.replace(/\/+$/, "")}/` : relative,
    resolved,
  };
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function runNode(args) {
  return childProcess.execFileSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function inspectOutputDirectory(relativePath) {
  const normalized = normalizeRepoRelativePath(relativePath, "output directory ref");
  const exists = fs.existsSync(normalized.resolved);
  if (!exists) {
    return {
      path_relative: normalized.relative,
      exists: false,
      is_directory: false,
      is_symlink: false,
      entry_count: 0,
      entries: [],
      unexpected_entries: [],
    };
  }
  const stat = fs.lstatSync(normalized.resolved);
  const isDirectory = stat.isDirectory();
  const isSymlink = stat.isSymbolicLink();
  const entries = isDirectory
    ? fs.readdirSync(normalized.resolved, { withFileTypes: true }).map((entry) => ({
      name: entry.name,
      kind: entry.isDirectory() ? "directory" : entry.isFile() ? "file" : entry.isSymbolicLink() ? "symlink" : "other",
    }))
    : [];
  return {
    path_relative: normalized.relative,
    exists,
    is_directory: isDirectory,
    is_symlink: isSymlink,
    entry_count: entries.length,
    entries,
    unexpected_entries: entries.map((entry) => entry.name),
  };
}

function check(id, fn) {
  try {
    const ok = fn();
    results.push({ check: id, passed: Boolean(ok) });
    if (!ok) passed = false;
  } catch (error) {
    results.push({ check: id, passed: false, error: error.message });
    passed = false;
  }
}

function main() {
  runNode(["--check", "scripts/validate_runtime_to_review_v1_serum_bottle_output_directory_preflight_gate.js"]);

  const gate = readJson(gatePath);
  const activationDraft = readJson(activationDraftPath);
  const activationPreflight = readJson(activationPreflightPath);
  const inactivePacket = readJson(inactivePacketPath);
  const packageJson = readJson("package.json");
  const manifest = readJson("scripts/validation_manifest.json");
  const ownerRuntime = require(repoPath(ownerRuntimePath));
  const observed = inspectOutputDirectory(gate.target_output_directory_ref);

  check("gate_exists", () => fs.existsSync(repoPath(gatePath)));
  check("schema_and_inactive_status", () =>
    gate.schema === "runtime_to_review_v1_output_directory_preflight_gate.v1" &&
    gate.status === "prepared_inactive_not_executed" &&
    gate.can_execute_now === false &&
    gate.execution_authorized_by_this_gate === false &&
    gate.output_write_authorized_by_this_gate === false &&
    gate.directory_creation_authorized_by_this_gate === false
  );
  check("source_refs_align", () =>
    gate.source_activation_draft_ref === activationDraftPath &&
    gate.source_activation_preflight_ref === activationPreflightPath &&
    gate.source_inactive_packet_ref === inactivePacketPath &&
    gate.owner_runtime_module === ownerRuntimePath &&
    gate.target_fixture_ref === fixturePath &&
    gate.target_prompt_package_ref === promptPath &&
    activationDraft.target_output_directory_ref === expectedOutputDir &&
    activationPreflight.target_output_directory_ref === expectedOutputDir &&
    inactivePacket.output_directory_ref === expectedOutputDir
  );
  check("output_ref_matches_runtime_and_packet", () =>
    gate.target_output_directory_ref === expectedOutputDir &&
    ownerRuntime.allowedOutputDirectory === expectedOutputDir &&
    gate.target_prompt_package_ref === ownerRuntime.allowedPromptPackageRef
  );
  check("path_policy_is_strict_repo_relative", () => {
    const normalized = normalizeRepoRelativePath(gate.target_output_directory_ref, "gate output directory");
    return normalized.relative === expectedOutputDir &&
      gate.path_policy.must_be_repository_relative === true &&
      gate.path_policy.must_not_be_absolute === true &&
      gate.path_policy.must_not_contain_traversal === true &&
      gate.path_policy.must_start_with === expectedOutputDir &&
      gate.path_policy.must_end_with_slash === true &&
      gate.path_policy.allowed_directory_missing === true &&
      gate.path_policy.directory_creation_allowed_now === false;
  });
  check("bad_path_examples_rejected", () => {
    let absoluteRejected = false;
    let traversalRejected = false;
    try {
      normalizeRepoRelativePath(path.resolve(root, expectedOutputDir), "absolute output dir");
    } catch {
      absoluteRejected = true;
    }
    try {
      normalizeRepoRelativePath("runs/real_generation/../outside/", "traversal output dir");
    } catch {
      traversalRejected = true;
    }
    return absoluteRejected && traversalRejected;
  });
  check("existing_content_policy_blocks_overwrite", () =>
    gate.existing_content_policy.unexpected_existing_files_allowed === false &&
    gate.existing_content_policy.overwrite_existing_files_allowed === false &&
    Array.isArray(gate.existing_content_policy.allowed_existing_entries) &&
    gate.existing_content_policy.allowed_existing_entries.length === 0 &&
    gate.existing_content_policy.allowed_existing_entry_count === 0 &&
    gate.existing_content_policy.empty_directory_allowed === true &&
    gate.existing_content_policy.missing_directory_allowed === true &&
    gate.existing_content_policy.symlink_allowed === false
  );
  check("observed_directory_state_is_safe", () =>
    observed.path_relative === expectedOutputDir &&
    observed.is_symlink === false &&
    (
      observed.exists === false ||
      (observed.is_directory === true && observed.entry_count === 0 && observed.unexpected_entries.length === 0)
    )
  );
  check("authoring_observed_state_matches_current_missing_or_empty", () =>
    gate.current_observed_state.checked_by === "scripts/validate_runtime_to_review_v1_serum_bottle_output_directory_preflight_gate.js" &&
    gate.current_observed_state.directory_exists_observed_at_authoring === false &&
    gate.current_observed_state.existing_entry_count_observed_at_authoring === 0 &&
    Array.isArray(gate.current_observed_state.unexpected_existing_entries_observed_at_authoring) &&
    gate.current_observed_state.unexpected_existing_entries_observed_at_authoring.length === 0
  );
  check("future_write_boundary_is_one_image_only", () =>
    gate.future_live_probe_write_boundary.max_new_output_files === 1 &&
    gate.future_live_probe_write_boundary.image_count === 1 &&
    gate.future_live_probe_write_boundary.write_scope === "run_directory_only" &&
    gate.future_live_probe_write_boundary.receipt_required_before_cleanup === true &&
    gate.future_live_probe_write_boundary.delete_or_overwrite_without_separate_cleanup_packet_allowed === false
  );
  check("forbidden_now_all_false", () => Object.values(gate.forbidden_now).every((value) => value === false));
  check("stop_conditions_include_overwrite_risks", () =>
    gate.stop_conditions.includes("target output directory exists and contains unexpected entries") &&
    gate.stop_conditions.includes("target output directory is a symlink") &&
    gate.stop_conditions.includes("overwrite or delete is required") &&
    gate.stop_conditions.includes("directory creation is requested during this preflight") &&
    gate.stop_conditions.includes("provider contact, plugin call, API call, image generation, or output write is requested")
  );
  check("required_validation_includes_self_and_activation", () =>
    gate.required_validation_before_future_activation.includes(`npm run ${packageScriptName}`) &&
    gate.required_validation_before_future_activation.includes("npm run validate:runtime-to-review-serum-bottle-exact-live-activation-draft") &&
    gate.required_validation_before_future_activation.includes("npm run validate:runtime-to-review-per-packet-owner-runtime") &&
    gate.required_validation_before_future_activation.includes("npm run validate:validation-manifest")
  );
  check("package_script_registered", () =>
    packageJson.scripts &&
    packageJson.scripts[packageScriptName] === "node scripts/validate_runtime_to_review_v1_serum_bottle_output_directory_preflight_gate.js"
  );
  check("manifest_entry_registered", () => {
    const entry = manifest.validators.find((item) => item.id === manifestId);
    return entry &&
      entry.command === `npm run ${packageScriptName}` &&
      entry.script === "scripts/validate_runtime_to_review_v1_serum_bottle_output_directory_preflight_gate.js" &&
      entry.tier === "targeted" &&
      entry.domain === "runtime_to_review" &&
      entry.status === "active" &&
      entry.trigger_paths.includes(gatePath) &&
      entry.trigger_paths.includes(activationDraftPath) &&
      entry.trigger_paths.includes(ownerRuntimePath) &&
      entry.trigger_paths.includes(expectedOutputDir) &&
      entry.required_for.includes("runtime_to_review_serum_bottle_output_directory_preflight_patch");
  });

  process.stdout.write(`${JSON.stringify({
    passed,
    validator,
    gate: gatePath,
    target_output_directory_ref: gate.target_output_directory_ref,
    directory_exists: observed.exists,
    directory_entry_count: observed.entry_count,
    unexpected_entries: observed.unexpected_entries,
    can_execute_now: gate.can_execute_now,
    output_write_authorized_by_this_gate: gate.output_write_authorized_by_this_gate,
    directory_creation_authorized_by_this_gate: gate.directory_creation_authorized_by_this_gate,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    output_write_performed: false,
    directory_creation_performed: false,
    file_delete_performed: false,
    overwrite_performed: false,
    secret_value_read_performed: false,
    env_file_content_read_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_write_performed: false,
    check_count: results.length,
    failed_count: results.filter((result) => !result.passed).length,
    results,
  }, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
