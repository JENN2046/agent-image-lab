#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");
const { loadAcceptedSampleFromRegistry } = require("./lib/accepted_sample_registry_source");

const repoRoot = path.resolve(__dirname, "..");
const core = createRecoverabilityCore(repoRoot);

function repoPath(relativePath) {
  const resolved = path.resolve(repoRoot, relativePath);
  const relative = path.relative(repoRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository root: ${relativePath}`);
  }
  return resolved;
}

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function writeJson(relativePath, value) {
  fs.writeFileSync(repoPath(relativePath), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function sha256File(relativePath) {
  const hash = crypto.createHash("sha256");
  hash.update(fs.readFileSync(repoPath(relativePath)));
  return hash.digest("hex");
}

function extractRegistrySampleBlock(registryText, sampleId) {
  const marker = `sample_id: ${sampleId}`;
  const start = registryText.indexOf(marker);
  if (start < 0) return "";
  const rest = registryText.slice(start);
  const next = rest.search(/\n\s+- sample_id: /);
  return next >= 0 ? rest.slice(0, next).trimEnd() : rest.trimEnd();
}

function requireExists(relativePath, label) {
  if (!fs.existsSync(repoPath(relativePath))) {
    throw new Error(`${label} missing: ${relativePath}`);
  }
}

function capsulePaths(sample) {
  return {
    manifest: `${sample.targetRoot}/manifest.json`,
    preview: `${sample.targetRoot}/preview.webp`,
    importRecord: `${sample.targetRoot}/import_record.json`,
    reviewRecord: `${sample.targetRoot}/review_record.json`,
    approvalRecord: `${sample.targetRoot}/approval_record.json`,
  };
}

function tempTargetRoot(sample) {
  return `asset_archive/accepted_samples/.tmp-${sample.sampleId}-${process.pid}-${Date.now()}`;
}

function removeTempTarget(relativePath) {
  const resolved = repoPath(relativePath);
  const relative = path.relative(repoRoot, resolved).replace(/\\/g, "/");
  if (!relative.startsWith("asset_archive/accepted_samples/.tmp-")) {
    throw new Error(`refusing to remove non-temp capsule path: ${relativePath}`);
  }
  fs.rmSync(resolved, { recursive: true, force: true });
}

function assertTargetClean(sample) {
  const targetRoot = repoPath(sample.targetRoot);
  if (fs.existsSync(targetRoot)) {
    throw new Error(`target capsule directory already exists: ${sample.targetRoot}`);
  }
}

function readArg(name) {
  const prefix = `--${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : null;
}

function boolArg(name) {
  return readArg(name) === "true";
}

function resolveSampleFromRegistry(sampleId) {
  return loadAcceptedSampleFromRegistry(core, sampleId);
}

function validateCliAgainstRegistry(sample, sourceImage, longEdge) {
  if (sourceImage && sourceImage !== sample.sourceImage) {
    throw new Error(`source image does not match accepted registry image_path: ${sourceImage}`);
  }
  if (longEdge && Number(longEdge) !== sample.requiredLongEdge) {
    throw new Error(`long edge does not match accepted registry preview long_edge: ${longEdge}`);
  }
}

function planOnly(sample) {
  const paths = capsulePaths(sample);
  return {
    passed: true,
    mode: "plan_only",
    sample_id: sample.sampleId,
    registry_driven_source: true,
    source_image: sample.sourceImage,
    source_image_exists: fs.existsSync(repoPath(sample.sourceImage)),
    target_root: sample.targetRoot,
    target_root_exists: fs.existsSync(repoPath(sample.targetRoot)),
    required_long_edge: sample.requiredLongEdge,
    planned_files: Object.values(paths),
    writes_performed: false,
    confirm_create_required: true,
    guard: {
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false,
      DailyNote_write_performed: false,
      VCP_memory_write_performed: false,
      runtime_execution_performed: false,
      real_manifest_read_performed: false,
      real_vcpchat_read_performed: false,
      real_vcptoolbox_read_performed: false,
      production_candidate_created: false,
      push_tag_release_deploy_performed: false,
      commercial_delivery_performed: false,
    },
  };
}

async function createCapsule(sample) {
  requireExists(sample.sourceImage, "source image");
  requireExists(sample.registryRef, "registry");
  requireExists(sample.categoryRef, "category index");
  requireExists(sample.reviewDocRef, "review document");
  assertTargetClean(sample);

  const finalPaths = capsulePaths(sample);
  const plannedFiles = Object.values(finalPaths);
  for (const plannedFile of plannedFiles) {
    if (fs.existsSync(repoPath(plannedFile))) {
      throw new Error(`refusing to overwrite existing capsule file: ${plannedFile}`);
    }
  }

  const tempSample = { ...sample, targetRoot: tempTargetRoot(sample) };
  const tempPaths = capsulePaths(tempSample);
  fs.mkdirSync(repoPath(tempSample.targetRoot), { recursive: true });

  try {
    await sharp(repoPath(sample.sourceImage))
      .rotate()
      .resize({ width: sample.requiredLongEdge, height: sample.requiredLongEdge, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 90 })
      .toFile(repoPath(tempPaths.preview));

    const previewMetadata = await sharp(repoPath(tempPaths.preview)).metadata();
    const previewLongEdge = Math.max(previewMetadata.width || 0, previewMetadata.height || 0);
    if (previewMetadata.format !== "webp" || previewLongEdge !== sample.requiredLongEdge) {
      throw new Error(`preview validation failed: format=${previewMetadata.format}, long_edge=${previewLongEdge}`);
    }

    const previewSha256 = sha256File(tempPaths.preview);
    const registryText = readText(sample.registryRef);
    const sampleBlock = extractRegistrySampleBlock(registryText, sample.sampleId);
    if (!sampleBlock) throw new Error(`sample not found in registry: ${sample.sampleId}`);

    const createdAt = new Date().toISOString();
    const commonGuard = {
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false,
      DailyNote_write_performed: false,
      VCP_memory_write_performed: false,
      runtime_execution_performed: false,
      real_manifest_read_performed: false,
      real_vcpchat_read_performed: false,
      real_vcptoolbox_read_performed: false,
    };

    writeJson(tempPaths.importRecord, {
      record_type: "git_portable_preview_capsule_import_record",
      version: "v1",
      sample_id: sample.sampleId,
      created_at: createdAt,
      source: {
        source_phase: sample.sourcePhase,
        source_image_path: sample.sourceImage,
        source_image_git_tracked: false,
        source_image_hash_recorded: false,
        registry_ref: sample.registryRef,
        category_ref: sample.categoryRef,
        prompt_package_ref: sample.promptPackageRef,
        registry_driven_source: true,
      },
      imported_artifact: { path: "preview.webp", format: "webp", long_edge: sample.requiredLongEdge, sha256: previewSha256, git_tracked: true, width: previewMetadata.width, height: previewMetadata.height },
      guard: commonGuard,
    });

    writeJson(tempPaths.reviewRecord, {
      record_type: "git_portable_preview_capsule_review_record",
      version: "v1",
      sample_id: sample.sampleId,
      created_at: createdAt,
      review_doc_ref: sample.reviewDocRef,
      registry_sample_block: sampleBlock,
      review_summary: { asset_status: sample.assetStatus, category: sample.category, source_phase: sample.sourcePhase, commercial_use_level: sample.assetStatus, memory_suitability: false },
      guard: commonGuard,
    });

    writeJson(tempPaths.approvalRecord, {
      record_type: "git_portable_preview_capsule_approval_record",
      version: "v1",
      sample_id: sample.sampleId,
      created_at: createdAt,
      approval_source_ref: sample.reviewDocRef,
      approval_basis: "existing accepted_sample_registry entry and accepted_candidate post-run review",
      approval_state: { accepted_sample_registered: true, portable_preview_capsule_creation_authorized_by_user: true, production_candidate_authorized: false, memory_write_authorized: false, DailyNote_write_authorized: false, commercial_delivery_authorized: false },
      guard: commonGuard,
    });

    writeJson(tempPaths.manifest, {
      manifest_type: "git_portable_preview_capsule_manifest",
      version: "v1",
      sample_id: sample.sampleId,
      created_at: createdAt,
      artifact: {
        preview: { path: "preview.webp", format: "webp", long_edge: sample.requiredLongEdge, width: previewMetadata.width, height: previewMetadata.height, sha256: previewSha256, git_tracked: true },
        original: { git_tracked: false, sha256_in_manifest: false, required_for_portable_validation: false },
      },
      chain: { import_record: "import_record.json", review_record: "review_record.json", approval_record: "approval_record.json" },
      source_refs: { registry_ref: sample.registryRef, category_ref: sample.categoryRef, review_doc_ref: sample.reviewDocRef, prompt_package_ref: sample.promptPackageRef },
      guard: commonGuard,
    });

    fs.renameSync(repoPath(tempSample.targetRoot), repoPath(sample.targetRoot));

    return { sample_id: sample.sampleId, target_root: sample.targetRoot, registry_driven_source: true, preview: { path: finalPaths.preview, width: previewMetadata.width, height: previewMetadata.height, long_edge: previewLongEdge, sha256: previewSha256 }, created_files: plannedFiles };
  } catch (error) {
    removeTempTarget(tempSample.targetRoot);
    throw error;
  }
}

async function main() {
  const sampleId = readArg("sample-id") || "accepted_french_summer_rattan_bucket_bag_001";
  const sample = resolveSampleFromRegistry(sampleId);
  validateCliAgainstRegistry(sample, readArg("source-image"), readArg("long-edge"));
  const result = boolArg("confirm-create") ? await createCapsule(sample) : planOnly(sample);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

module.exports = { resolveSampleFromRegistry, validateCliAgainstRegistry, planOnly, createCapsule };

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exit(1);
  });
}
