const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const currentPhase = "v5.16 release publication preflight";
const targetTag = "v5.14-release-candidate-validation-baseline";
const targetCommit = "6fc0c401e739e93986e32d1797b80d7296e2d1c6";
const targetCommitShort = "6fc0c40";
const releaseTitle = "Agent Image Lab v5.14 Release Candidate Validation Baseline";
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
    `_verify_${targetTag}`,
    `agent-image-lab-${targetTag}`
  );
  const zipExists = fs.existsSync(zipPath);
  const shaExists = fs.existsSync(shaPath);
  const recordedSha = shaExists
    ? fs.readFileSync(shaPath, "utf8").trim().split(/\s+/)[0] || null
    : null;
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
    package_inside_forbidden_paths_absent: forbiddenInside.length === 0
  };
}

function main() {
  const requiredFiles = [
    "docs/141_v5_16_release_publication_preflight.md",
    "tests/schema_examples/v5_16_release_publication_preflight.example.yaml",
    "scripts/validate_v5_16_release_publication_preflight.js",
    "tests/validation_checklist.md"
  ];
  const missingFiles = requiredFiles.filter((relativePath) => !exists(relativePath));
  assert(missingFiles.length === 0, `Missing v5.16 release publication preflight files: ${missingFiles.join(", ")}`);

  const doc = read("docs/141_v5_16_release_publication_preflight.md");
  const schema = read("tests/schema_examples/v5_16_release_publication_preflight.example.yaml");
  const checklist = read("tests/validation_checklist.md");
  const combined = `${doc}\n${schema}`;

  const targetRecorded = includesAll(combined, [
    currentPhase,
    `target_tag: ${targetTag}`,
    `target_commit: ${targetCommit}`,
    `target_commit_short: ${targetCommitShort}`,
    `release_title: "${releaseTitle}"`,
    "release_prerelease: true",
    "release_latest: false"
  ]);

  const notesRecorded = includesAll(combined, [
    "release_notes_draft:",
    "v5.12 release candidate readiness",
    "v5.13 local validation scan scope reconciliation",
    "v5.14 baseline tag",
    "v5.15 release candidate handoff",
    "本 release 不授权新的真实插件调用",
    "本 release 不授权 DailyNote 写入或 VCP 长期记忆写入"
  ]);

  const assetsRecorded = includesAll(combined, [
    "release_packages_directory: release_packages/",
    "release_packages_git_ignored: true",
    `name: ${packageName}`,
    `path: release_packages/${packageName}`,
    `sha256: ${packageSha}`,
    `name: ${shaName}`,
    `path: release_packages/${shaName}`,
    "release_assets_uploaded: false",
    "upload_authorized: false"
  ]);

  const preflightChecksRecorded = includesAll(combined, [
    "git_worktree_clean_required: true",
    "target_tag_exists_required: true",
    "target_tag_pushed_required: true",
    "zip_exists_required: true",
    "sha256_exists_required: true",
    "sha256_match_required: true",
    "package_inside_validation_required: true",
    "release_notes_review_required: true",
    "explicit_publish_authorization_required: true"
  ]);

  const boundaryPreserved = includesAll(combined, [
    "tag_creation_required_now: false",
    "package_creation_required_now: false",
    "github_release_created: false",
    "github_release_published: false",
    "release_assets_uploaded: false",
    "release_publish_authorized: false",
    "external_network_required_for_this_record: false",
    "external_service_required_for_this_record: false",
    "real_vcpchat_source_read: false",
    "real_vcptoolbox_source_read: false",
    "real_manifest_read: false",
    "api_called: false",
    "vcp_plugin_called: false",
    "daily_note_called: false",
    "vcp_memory_written: false",
    "image_file_created: false"
  ]);

  const stopGateRecorded = includesAll(combined, [
    "can_publish_without_new_authorization: false",
    "required_next_authorization:",
    "publish_command_allowed_now: false",
    "asset_upload_allowed_now: false"
  ]);

  const checklistCurrent = includesAll(checklist, [
    "## v5.16 Release Publication Preflight 检查",
    "docs/141_v5_16_release_publication_preflight.md",
    "tests/schema_examples/v5_16_release_publication_preflight.example.yaml",
    "scripts/validate_v5_16_release_publication_preflight.js",
    targetTag,
    packageSha,
    releaseTitle
  ]);

  assert(targetRecorded, "v5.16 must record release target.");
  assert(notesRecorded, "v5.16 must record release notes draft.");
  assert(assetsRecorded, "v5.16 must record asset upload plan.");
  assert(preflightChecksRecorded, "v5.16 must record publication preflight checks.");
  assert(boundaryPreserved, "v5.16 must preserve publication and execution boundaries.");
  assert(stopGateRecorded, "v5.16 must preserve publication stop gate.");
  assert(checklistCurrent, "validation checklist must include v5.16 checks.");

  const artifacts = artifactState();
  const result = {
    passed: true,
    release_publication_preflight: {
      version: "v5.16",
      current_phase: currentPhase,
      target_tag: targetTag,
      target_commit: targetCommit,
      release_title: releaseTitle,
      package_name: packageName,
      sha256_name: shaName,
      zip_sha256: packageSha,
      target_recorded: targetRecorded,
      notes_recorded: notesRecorded,
      assets_recorded: assetsRecorded,
      preflight_checks_recorded: preflightChecksRecorded,
      boundary_preserved: boundaryPreserved,
      stop_gate_recorded: stopGateRecorded,
      checklist_current: checklistCurrent,
      local_package_artifacts_present: artifacts.zip_exists && artifacts.sha_file_exists,
      local_package_sha_matches_record: artifacts.sha_matches_record,
      local_package_inside_validation_present: artifacts.verify_root_exists,
      local_package_inside_required_files_present: artifacts.package_inside_required_files_present,
      local_package_inside_forbidden_paths_absent: artifacts.package_inside_forbidden_paths_absent,
      github_release_created: false,
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
