#!/usr/bin/env node
"use strict";

const path = require("node:path");
const sharp = require("sharp");
const { createCapsuleCreatorCommon } = require("./lib/capsule_creator_common");
const {
  FAILURE_REGISTRY_REF,
  loadFailureSampleFromRegistry,
} = require("./lib/failure_sample_registry_source");

const repoRoot = path.resolve(__dirname, "..");
const creatorCommon = createCapsuleCreatorCommon(repoRoot, {
  tempRootParent: "asset_archive/failure_samples",
});
const {
  repoPath,
  readText,
  writeJson,
  sha256File,
  exists,
  requireExists,
  tempTargetRoot,
  removeTempTarget,
  assertTargetClean,
  ensureDir,
  renamePath,
  createNoExecutionGuard,
} = creatorCommon;

function readArg(name) {
  const prefix = `--${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : null;
}

function boolArg(name) {
  return readArg(name) === "true";
}

function loadSample(sampleId) {
  try {
    return loadFailureSampleFromRegistry({ exists, readText }, sampleId);
  } catch (error) {
    if (/failure sample not found/.test(error.message)) {
      throw new Error(`unsupported failure sample id: ${sampleId}`);
    }
    throw error;
  }
}

function capsulePaths(sample) {
  return {
    manifest: `${sample.targetRoot}/manifest.json`,
    preview: `${sample.targetRoot}/preview.webp`,
    failureRecord: `${sample.targetRoot}/failure_record.json`,
    reviewRecord: `${sample.targetRoot}/review_record.json`,
  };
}

function planOnly(sample) {
  const paths = capsulePaths(sample);
  return {
    passed: true,
    mode: "plan_only",
    sample_id: sample.sampleId,
    source_image: sample.sourceImage,
    source_image_exists: exists(sample.sourceImage),
    target_root: sample.targetRoot,
    required_long_edge: sample.requiredLongEdge,
    planned_files: Object.values(paths),
    writes_performed: false,
    confirm_create_required: true,
    guard: createNoExecutionGuard({
      production_candidate_created: false,
      push_tag_release_deploy_performed: false,
    }),
  };
}

async function createCapsule(sample) {
  requireExists(sample.sourceImage, "source image");
  requireExists(sample.failureRegistryRef, "failure registry");
  requireExists(sample.reviewDocRef, "review document");
  requireExists(sample.promptPackageRef, "prompt package");
  assertTargetClean(sample);

  const finalPaths = capsulePaths(sample);
  for (const plannedFile of Object.values(finalPaths)) {
    if (exists(plannedFile)) {
      throw new Error(`refusing to overwrite existing capsule file: ${plannedFile}`);
    }
  }

  const tempSample = { ...sample, targetRoot: tempTargetRoot(sample) };
  const tempPaths = capsulePaths(tempSample);
  ensureDir(tempSample.targetRoot);

  try {
    await sharp(repoPath(sample.sourceImage))
      .rotate()
      .resize({
        width: sample.requiredLongEdge,
        height: sample.requiredLongEdge,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 90 })
      .toFile(repoPath(tempPaths.preview));

    const previewMetadata = await sharp(repoPath(tempPaths.preview)).metadata();
    const previewLongEdge = Math.max(previewMetadata.width || 0, previewMetadata.height || 0);
    if (previewMetadata.format !== "webp" || previewLongEdge !== sample.requiredLongEdge) {
      throw new Error(
        `preview validation failed: format=${previewMetadata.format}, long_edge=${previewLongEdge}`
      );
    }

    const previewSha256 = sha256File(tempPaths.preview);
    const failureBlock = sample.registryFailureBlock;
    if (!failureBlock) {
      throw new Error(`failure sample not found in registry: ${sample.sampleId}`);
    }

    const createdAt = new Date().toISOString();
    const commonGuard = createNoExecutionGuard({
      production_candidate_created: false,
    });

    writeJson(tempPaths.failureRecord, {
      record_type: "git_portable_failure_sample_capsule_failure_record",
      version: "v1",
      sample_id: sample.sampleId,
      created_at: createdAt,
      source: {
        source_phase: sample.sourcePhase,
        source_image_path: sample.sourceImage,
        source_image_git_tracked: false,
        source_image_hash_recorded: false,
        failure_registry_ref: sample.failureRegistryRef,
        prompt_package_ref: sample.promptPackageRef,
      },
      failure_summary: {
        failure_tags: sample.failureTags,
        resolved_by_accepted_sample: sample.resolvedByAcceptedSample,
        memory_suitability: false,
        production_candidate_allowed: false,
      },
      registry_failure_block: failureBlock,
      guard: commonGuard,
    });

    writeJson(tempPaths.reviewRecord, {
      record_type: "git_portable_failure_sample_capsule_review_record",
      version: "v1",
      sample_id: sample.sampleId,
      created_at: createdAt,
      review_doc_ref: sample.reviewDocRef,
      review_summary: {
        final_route: "failure_learning_only_never_production",
        production_candidate_allowed: false,
        DailyNote_write_allowed: false,
        VCP_memory_write_allowed: false,
      },
      guard: commonGuard,
    });

    writeJson(tempPaths.manifest, {
      manifest_type: "git_portable_failure_sample_capsule_manifest",
      version: "v1",
      sample_id: sample.sampleId,
      created_at: createdAt,
      artifact: {
        preview: {
          path: "preview.webp",
          format: "webp",
          long_edge: sample.requiredLongEdge,
          width: previewMetadata.width,
          height: previewMetadata.height,
          sha256: previewSha256,
          git_tracked: true,
        },
        original: {
          git_tracked: false,
          required_for_portable_validation: false,
        },
      },
      chain: {
        failure_record: "failure_record.json",
        review_record: "review_record.json",
      },
      source_refs: {
        failure_registry_ref: sample.failureRegistryRef,
        review_doc_ref: sample.reviewDocRef,
        prompt_package_ref: sample.promptPackageRef,
      },
      production_candidate_allowed: false,
      memory_write_allowed: false,
      DailyNote_write_allowed: false,
      guard: commonGuard,
    });

    renamePath(tempSample.targetRoot, sample.targetRoot);

    return {
      passed: true,
      mode: "create",
      sample_id: sample.sampleId,
      target_root: sample.targetRoot,
      created_files: Object.values(finalPaths),
      preview: {
        path: finalPaths.preview,
        width: previewMetadata.width,
        height: previewMetadata.height,
        long_edge: previewLongEdge,
        sha256: previewSha256,
      },
    };
  } catch (error) {
    removeTempTarget(tempSample.targetRoot);
    throw error;
  }
}

async function main() {
  const sampleId = readArg("sample-id") || "failure_french_summer_rattan_bag_v7_29_001";
  const sample = loadSample(sampleId);

  const sourceImage = readArg("source-image");
  if (sourceImage && sourceImage !== sample.sourceImage) {
    throw new Error(`source image does not match authorized sample source: ${sourceImage}`);
  }

  const longEdge = readArg("long-edge");
  if (longEdge && Number(longEdge) !== sample.requiredLongEdge) {
    throw new Error(`long edge does not match authorized sample long_edge: ${longEdge}`);
  }

  const result = boolArg("confirm-create") ? await createCapsule(sample) : planOnly(sample);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exit(1);
});
