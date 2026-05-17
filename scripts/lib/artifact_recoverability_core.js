"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

function createRecoverabilityCore(root) {
  const repositoryRoot = path.resolve(root);

  function repoPath(relativePath) {
    const resolved = path.resolve(repositoryRoot, relativePath);
    const relative = path.relative(repositoryRoot, resolved);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      throw new Error(`path escapes repository root: ${relativePath}`);
    }
    return resolved;
  }

  function exists(relativePath) {
    return fs.existsSync(repoPath(relativePath));
  }

  function read(relativePath) {
    return fs.readFileSync(repoPath(relativePath), "utf8");
  }

  function parseJson(relativePath) {
    return JSON.parse(read(relativePath));
  }

  function sha256File(relativePath) {
    const hash = crypto.createHash("sha256");
    hash.update(fs.readFileSync(repoPath(relativePath)));
    return hash.digest("hex");
  }

  function readPngDimensions(relativePath) {
    const buffer = fs.readFileSync(repoPath(relativePath));
    const signature = buffer.subarray(0, 8).toString("hex");
    return {
      signature,
      signatureValid: signature === "89504e470d0a1a0a",
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  }

  function extractRegistrySampleBlock(registryText, id) {
    const marker = `sample_id: ${id}`;
    const start = registryText.indexOf(marker);
    if (start < 0) return "";
    const rest = registryText.slice(start);
    const next = rest.search(/\n\s+- sample_id: /);
    return next >= 0 ? rest.slice(0, next) : rest;
  }

  function validateRecordChain(record, expected, options = {}) {
    const wrapper = record.codex_session_image_import;
    const failures = [];
    const artifact = wrapper?.imported_asset || {};
    const source = wrapper?.source || {};
    const guard = wrapper?.no_execution_guard || {};
    const reviewBridge = wrapper?.review_bridge || {};
    const closeoutText = options.closeoutText || "";
    const artifactRelativePath = typeof artifact.relative_path === "string" ? artifact.relative_path : null;

    function check(condition, label) {
      if (!condition) failures.push(label);
    }

    check(Boolean(wrapper), "wrapper_present");
    check(wrapper?.import_id === expected.importId, "import_id_matches");
    check(wrapper?.provider_id === expected.providerId, "provider_id_matches");
    check(wrapper?.import_mode === expected.importMode, "import_mode_matches");
    check(wrapper?.prompt_package_ref === expected.promptPackageRef, "prompt_package_ref_matches");
    check(artifact.relative_path === expected.imagePath, "artifact_path_matches");
    check(artifact.sha256 === (options.sha256 || expected.sha256), "artifact_sha256_matches_expected");
    check(Boolean(artifactRelativePath) && exists(artifactRelativePath), "artifact_file_exists");

    if (artifactRelativePath && exists(artifactRelativePath)) {
      const actualSha256 = sha256File(artifactRelativePath);
      const actualDimensions = readPngDimensions(artifactRelativePath);
      check(actualDimensions.signatureValid, "artifact_png_signature_valid");
      check(actualSha256 === artifact.sha256, "artifact_file_sha256_matches_record");
      check(actualSha256 === expected.sha256, "artifact_file_sha256_matches_expected");
      check(actualDimensions.width === artifact.width_px, "artifact_file_width_matches_record");
      check(actualDimensions.height === artifact.height_px, "artifact_file_height_matches_record");
    }

    check(artifact.width_px === expected.width, "artifact_width_matches");
    check(artifact.height_px === expected.height, "artifact_height_matches");
    check(artifact.mime_type === expected.mimeType, "artifact_mime_matches");
    check(artifact.local_file_verified === true, "artifact_local_file_verified_true");
    check(artifact.copied_by_project_script === false, "artifact_not_copied_by_project_script");
    check(reviewBridge.review_record_ref === expected.reviewRecordPath, "review_record_ref_matches");
    check(reviewBridge.image_case_id === expected.imageCaseId, "image_case_id_matches");
    check(closeoutText.includes("approved_by: Jenn"), "human_approval_present");
    check(source.codex_session_generation === true, "codex_session_generation_true");
    check(source.codex_image_direct_call_allowed === false, "codex_direct_call_disallowed");
    check(source.mcp_runtime_allowed === false, "mcp_runtime_disallowed");
    check(source.provider_api_call_allowed === false, "provider_api_disallowed");
    check(source.project_script_generation_allowed === false, "project_script_generation_disallowed");
    check(source.image_generation_by_script === false, "image_generation_by_script_false");

    for (const [field, value] of Object.entries(guard)) {
      if (field.endsWith("_allowed") || field.endsWith("_performed") || field.endsWith("_performed_by_project")) {
        check(value === false, `guard_${field}_false`);
      }
    }

    return { passed: failures.length === 0, failures };
  }

  return {
    repoPath,
    exists,
    read,
    parseJson,
    sha256File,
    readPngDimensions,
    extractRegistrySampleBlock,
    validateRecordChain,
  };
}

module.exports = {
  createRecoverabilityCore,
};
