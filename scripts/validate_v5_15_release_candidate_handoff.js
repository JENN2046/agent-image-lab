const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v5.15 release candidate handoff";
const baselineTag = "v5.14-release-candidate-validation-baseline";
const baselineCommit = "6fc0c401e739e93986e32d1797b80d7296e2d1c6";
const baselineCommitShort = "6fc0c40";
const packageName = "agent-image-lab-v5.14-release-candidate-validation-baseline.zip";
const shaName = `${packageName}.sha256`;
const packageSha = "2fa0204a855ea9b74a36c5f8bf701356dd35414d3b35d3e85e1bf367492197db";

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function includesAll(content, values) {
  return values.every((value) => content.includes(value));
}

function artifactState() {
  const zipPath = path.join(root, "release_packages", packageName);
  const shaPath = path.join(root, "release_packages", shaName);
  const verifyRoot = path.join(
    root,
    "release_packages",
    `_verify_${baselineTag}`,
    `agent-image-lab-${baselineTag}`
  );
  const zipExists = fs.existsSync(zipPath);
  const shaExists = fs.existsSync(shaPath);
  let recordedSha = null;
  if (shaExists) {
    recordedSha = fs.readFileSync(shaPath, "utf8").trim().split(/\s+/)[0] || null;
  }
  const requiredInside = [
    "README.md",
    "AGENTS.md",
    "MANIFEST.md",
    "RELEASE_NOTES.md",
    "scripts/validate_mvp.ps1",
    "scripts/validate-agent-image-lab-local.ps1",
    "docs/139_v5_12_release_candidate_readiness.md"
  ];
  const verifyExists = fs.existsSync(verifyRoot);
  const missingInside = verifyExists
    ? requiredInside.filter((relativePath) => !fs.existsSync(path.join(verifyRoot, relativePath)))
    : requiredInside;
  const forbiddenInside = [".git", "release_packages", "runs"].filter((relativePath) =>
    verifyExists ? fs.existsSync(path.join(verifyRoot, relativePath)) : false
  );

  return {
    zip_exists: zipExists,
    sha_file_exists: shaExists,
    recorded_sha: recordedSha,
    sha_matches_record: recordedSha === packageSha,
    verify_root_exists: verifyExists,
    package_inside_required_files_present: missingInside.length === 0,
    package_inside_forbidden_paths_absent: forbiddenInside.length === 0,
    missing_inside: missingInside,
    forbidden_inside: forbiddenInside
  };
}

function main() {
  const requiredFiles = [
    "docs/140_v5_15_release_candidate_handoff.md",
    "tests/schema_examples/v5_15_release_candidate_handoff.example.yaml",
    "scripts/validate_v5_15_release_candidate_handoff.js",
    "tests/validation_checklist.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v5.15 handoff files: ${missingFiles.join(", ")}`);

  const doc = read("docs/140_v5_15_release_candidate_handoff.md");
  const schema = read("tests/schema_examples/v5_15_release_candidate_handoff.example.yaml");
  const checklist = read("tests/validation_checklist.md");
  const combined = `${doc}\n${schema}`;

  const baselineRecorded = includesAll(combined, [
    currentPhase,
    baselineTag,
    baselineCommit,
    baselineCommitShort,
    "tag_created: true",
    "tag_pushed: true",
    "master_origin_synced: true"
  ]);

  const packageRecorded = includesAll(combined, [
    "package_directory: release_packages/",
    "package_directory_git_ignored: true",
    `zip_name: ${packageName}`,
    `sha256_name: ${shaName}`,
    `zip_sha256: ${packageSha}`,
    `verify_directory: release_packages/_verify_${baselineTag}/`,
    "package_created: true",
    "sha256_created: true",
    "package_inside_validation_passed: true"
  ]);

  const releaseBoundaryPreserved = includesAll(combined, [
    "github_release_published: false",
    "github_release_publish_authorized: false",
    "release_assets_uploaded: false",
    "release_upload_allowed_now: false",
    "release_publish_next_requires_explicit_authorization: true"
  ]);

  const executionBoundaryPreserved = includesAll(combined, [
    "real_vcpchat_source_read: false",
    "real_vcptoolbox_source_read: false",
    "real_manifest_read: false",
    "api_called: false",
    "vcp_plugin_called: false",
    "daily_note_called: false",
    "vcp_memory_written: false",
    "image_file_created: false",
    "additional_real_generation_authorized: false"
  ]);

  const nextMilestonesRecorded = includesAll(combined, [
    "v5.16 release publication preflight",
    "v6.0 next milestone planning",
    "requires_explicit_authorization: true",
    "requires_explicit_authorization: false"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v5.15 Release Candidate Handoff 检查",
    "docs/140_v5_15_release_candidate_handoff.md",
    "tests/schema_examples/v5_15_release_candidate_handoff.example.yaml",
    "scripts/validate_v5_15_release_candidate_handoff.js",
    baselineTag,
    packageSha
  ]);

  assert(baselineRecorded, "v5.15 must record v5.14 tag and commit handoff state.");
  assert(packageRecorded, "v5.15 must record package and SHA256 evidence.");
  assert(releaseBoundaryPreserved, "v5.15 must preserve GitHub Release boundary.");
  assert(executionBoundaryPreserved, "v5.15 must preserve execution boundary.");
  assert(nextMilestonesRecorded, "v5.15 must record next milestone options.");
  assert(checklistCurrent, "validation checklist must include v5.15 checks.");

  const artifacts = artifactState();
  const result = {
    passed: true,
    release_candidate_handoff: {
      version: "v5.15",
      current_phase: currentPhase,
      baseline_tag: baselineTag,
      baseline_commit: baselineCommit,
      baseline_commit_short: baselineCommitShort,
      package_name: packageName,
      sha256_name: shaName,
      zip_sha256: packageSha,
      baseline_recorded: baselineRecorded,
      package_recorded: packageRecorded,
      release_boundary_preserved: releaseBoundaryPreserved,
      execution_boundary_preserved: executionBoundaryPreserved,
      next_milestones_recorded: nextMilestonesRecorded,
      checklist_current: checklistCurrent,
      local_package_artifacts_present: artifacts.zip_exists && artifacts.sha_file_exists,
      local_package_sha_matches_record: artifacts.sha_matches_record,
      local_package_inside_validation_present: artifacts.verify_root_exists,
      local_package_inside_required_files_present: artifacts.package_inside_required_files_present,
      local_package_inside_forbidden_paths_absent: artifacts.package_inside_forbidden_paths_absent,
      github_release_published: false,
      release_assets_uploaded: false,
      external_network_required: false,
      external_service_required: false,
      file_write_performed: false
    }
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
