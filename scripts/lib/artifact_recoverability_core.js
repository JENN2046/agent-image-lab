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

  function parseJsonIfExists(relativePath) {
    return exists(relativePath) ? parseJson(relativePath) : null;
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

  function readJpegDimensions(relativePath) {
    const buffer = fs.readFileSync(repoPath(relativePath));
    if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
      return {
        signature: buffer.subarray(0, 2).toString("hex"),
        signatureValid: false,
        width: null,
        height: null,
      };
    }

    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }

      const marker = buffer[offset + 1];
      offset += 2;

      if (marker === 0xd9 || marker === 0xda) break;
      if (offset + 2 > buffer.length) break;

      const length = buffer.readUInt16BE(offset);
      if (length < 2 || offset + length > buffer.length) break;

      const isStartOfFrame =
        (marker >= 0xc0 && marker <= 0xc3) ||
        (marker >= 0xc5 && marker <= 0xc7) ||
        (marker >= 0xc9 && marker <= 0xcb) ||
        (marker >= 0xcd && marker <= 0xcf);

      if (isStartOfFrame && length >= 7) {
        return {
          signature: buffer.subarray(0, 2).toString("hex"),
          signatureValid: true,
          width: buffer.readUInt16BE(offset + 5),
          height: buffer.readUInt16BE(offset + 3),
        };
      }

      offset += length;
    }

    return {
      signature: buffer.subarray(0, 2).toString("hex"),
      signatureValid: true,
      width: null,
      height: null,
    };
  }

  function readImageMetadata(relativePath) {
    const buffer = fs.readFileSync(repoPath(relativePath));
    const pngSignature = buffer.subarray(0, 8).toString("hex");
    if (pngSignature === "89504e470d0a1a0a") {
      const dimensions = readPngDimensions(relativePath);
      return {
        mimeType: "image/png",
        signatureValid: dimensions.signatureValid,
        width: dimensions.width,
        height: dimensions.height,
      };
    }

    if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xd8) {
      const dimensions = readJpegDimensions(relativePath);
      return {
        mimeType: "image/jpeg",
        signatureValid: dimensions.signatureValid,
        width: dimensions.width,
        height: dimensions.height,
      };
    }

    return {
      mimeType: "application/octet-stream",
      signatureValid: false,
      width: null,
      height: null,
    };
  }

  function readWebpDimensions(relativePath) {
    const buffer = fs.readFileSync(repoPath(relativePath));
    const riff = buffer.subarray(0, 4).toString("ascii");
    const webp = buffer.subarray(8, 12).toString("ascii");
    if (buffer.length < 30 || riff !== "RIFF" || webp !== "WEBP") {
      return {
        signature: buffer.subarray(0, Math.min(buffer.length, 12)).toString("hex"),
        signatureValid: false,
        width: null,
        height: null,
      };
    }

    const chunkType = buffer.subarray(12, 16).toString("ascii");
    if (chunkType === "VP8X" && buffer.length >= 30) {
      const width = 1 + buffer.readUIntLE(24, 3);
      const height = 1 + buffer.readUIntLE(27, 3);
      return { signature: "RIFF_WEBP_VP8X", signatureValid: true, width, height };
    }

    if (chunkType === "VP8 " && buffer.length >= 30) {
      const startCodeOffset = 20;
      const startCode = buffer.subarray(startCodeOffset, startCodeOffset + 3).toString("hex");
      if (startCode !== "9d012a") {
        return { signature: "RIFF_WEBP_VP8", signatureValid: false, width: null, height: null };
      }
      const width = buffer.readUInt16LE(26) & 0x3fff;
      const height = buffer.readUInt16LE(28) & 0x3fff;
      return { signature: "RIFF_WEBP_VP8", signatureValid: true, width, height };
    }

    if (chunkType === "VP8L" && buffer.length >= 25 && buffer[20] === 0x2f) {
      const b1 = buffer[21];
      const b2 = buffer[22];
      const b3 = buffer[23];
      const b4 = buffer[24];
      const width = 1 + (((b2 & 0x3f) << 8) | b1);
      const height = 1 + ((b4 << 6) | (b3 >> 2) | ((b2 & 0xc0) << 6));
      return { signature: "RIFF_WEBP_VP8L", signatureValid: true, width, height };
    }

    return {
      signature: `RIFF_WEBP_${chunkType}`,
      signatureValid: false,
      width: null,
      height: null,
    };
  }

  function previewCapsuleRoot(sampleId) {
    if (typeof sampleId !== "string" || !/^[A-Za-z0-9_.-]+$/.test(sampleId)) {
      throw new Error(`invalid preview capsule sample id: ${sampleId}`);
    }
    return `asset_archive/accepted_samples/${sampleId}`;
  }

  function previewCapsulePaths(sampleId) {
    const rootPath = previewCapsuleRoot(sampleId);
    return {
      root: rootPath,
      manifest: `${rootPath}/manifest.json`,
      preview: `${rootPath}/preview.webp`,
      importRecord: `${rootPath}/import_record.json`,
      reviewRecord: `${rootPath}/review_record.json`,
      approvalRecord: `${rootPath}/approval_record.json`,
    };
  }

  function validatePreviewCapsule(sampleId, options = {}) {
    const requiredLongEdge = options.requiredLongEdge || 512;
    const paths = previewCapsulePaths(sampleId);
    const manifest = parseJsonIfExists(paths.manifest);
    const failures = [];

    function check(condition, label) {
      if (!condition) failures.push(label);
    }

    check(Boolean(manifest), "manifest_exists");
    if (!manifest) {
      return {
        passed: false,
        status: "preview_capsule_missing",
        sampleId,
        paths,
        manifest: null,
        failures,
      };
    }

    const previewPath = manifest?.artifact?.preview?.path || "preview.webp";
    const previewRelativePath = `${paths.root}/${previewPath}`;
    const previewExists = exists(previewRelativePath);
    const previewSha256 = previewExists ? sha256File(previewRelativePath) : null;
    const previewDimensions = previewExists ? readWebpDimensions(previewRelativePath) : null;
    const previewLongEdge = previewDimensions?.width && previewDimensions?.height
      ? Math.max(previewDimensions.width, previewDimensions.height)
      : null;

    check(manifest.sample_id === sampleId, "sample_id_matches");
    check(previewPath === "preview.webp", "preview_path_matches");
    check(manifest.artifact?.preview?.format === "webp", "preview_format_webp");
    check(manifest.artifact?.preview?.long_edge === requiredLongEdge, "preview_manifest_long_edge_matches");
    check(manifest.artifact?.preview?.git_tracked === true, "preview_git_tracked_true");
    check(manifest.artifact?.original?.sha256_in_manifest === false, "original_sha256_not_in_manifest");
    check(!JSON.stringify(manifest).includes("base64"), "base64_absent_from_manifest");
    check(previewExists, "preview_file_exists");
    check(previewDimensions?.signatureValid === true, "preview_webp_signature_valid");
    check(previewLongEdge === requiredLongEdge, "preview_file_long_edge_matches");
    check(Boolean(manifest.artifact?.preview?.sha256), "preview_manifest_sha256_present");
    check(previewSha256 === manifest.artifact?.preview?.sha256, "preview_sha256_matches_manifest");
    check(exists(paths.importRecord), "import_record_exists");
    check(exists(paths.reviewRecord), "review_record_exists");
    check(exists(paths.approvalRecord), "approval_record_exists");

    return {
      passed: failures.length === 0,
      status: failures.length === 0 ? "git_portable_preview_evidence_verified" : "preview_capsule_incomplete",
      sampleId,
      paths,
      manifest,
      previewExists,
      previewSha256,
      previewDimensions,
      previewLongEdge,
      failures,
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

  function listRegistrySampleBlocks(registryText) {
    const rows = [];
    let currentId = null;
    let currentLines = [];

    for (const line of registryText.split(/\r?\n/)) {
      const match = line.match(/^\s*-\s+sample_id:\s*(\S+)/);
      if (match) {
        if (currentId) {
          rows.push({ sampleId: currentId, block: currentLines.join("\n") });
        }
        currentId = match[1];
        currentLines = [line];
      } else if (currentId) {
        currentLines.push(line);
      }
    }

    if (currentId) {
      rows.push({ sampleId: currentId, block: currentLines.join("\n") });
    }

    return rows;
  }

  function extractScalarField(block, fieldName) {
    const escaped = fieldName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = block.match(new RegExp(`^\\s*${escaped}:\\s*(.+?)\\s*$`, "m"));
    if (!match) return null;
    const value = match[1].trim();
    return value === "null" ? null : value;
  }

  function extractCategoryIndexSamples(categoryIndexText) {
    return categoryIndexText
      .split(/\r?\n/)
      .map((line) => line.match(/^\s*-\s+(\S+)/))
      .filter(Boolean)
      .map((match) => match[1]);
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
    parseJsonIfExists,
    sha256File,
    readPngDimensions,
    readJpegDimensions,
    readWebpDimensions,
    readImageMetadata,
    previewCapsuleRoot,
    previewCapsulePaths,
    validatePreviewCapsule,
    extractRegistrySampleBlock,
    listRegistrySampleBlocks,
    extractScalarField,
    extractCategoryIndexSamples,
    validateRecordChain,
  };
}

module.exports = {
  createRecoverabilityCore,
};
