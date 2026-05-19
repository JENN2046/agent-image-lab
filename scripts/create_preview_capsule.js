#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const repoRoot = path.resolve(__dirname, "..");

const SAMPLES = {
  accepted_product_still_life_tennis_wallet_001: {
    sampleId: "accepted_product_still_life_tennis_wallet_001",
    sourceImage:
      "runs/real_generation/v7_24_native_doubao_v3_single_real_run/native_doubao_1778322474131_0.jpg",
    targetRoot: "asset_archive/accepted_samples/accepted_product_still_life_tennis_wallet_001",
    registryRef: "accepted_samples/accepted_sample_registry.yaml",
    categoryRef: "accepted_samples/categories/product_still_life.yaml",
    reviewDocRef: "docs/281_v7_24_native_doubao_v3_post_run_review_accepted_candidate.md",
    promptPackageRef:
      "prompts/image_generation/product_still_life_outdoor_tennis_wallet_hero_no_text_v3.yaml",
    sourcePhase: "v7_24",
    category: "product_still_life",
    assetStatus: "accepted_candidate",
    providerType: "direct_api",
    pluginId: "NativeDoubaoImage",
    model: "doubao-seedream-5-0-260128",
    requiredLongEdge: 512,
  },
  accepted_french_summer_rattan_bucket_bag_001: {
    sampleId: "accepted_french_summer_rattan_bucket_bag_001",
    sourceImage:
      "runs/real_generation/v7_31_native_doubao_french_summer_rattan_bag_v2_watermark_off_run/native_doubao_1778327047448_0.jpg",
    targetRoot: "asset_archive/accepted_samples/accepted_french_summer_rattan_bucket_bag_001",
    registryRef: "accepted_samples/accepted_sample_registry.yaml",
    categoryRef: "accepted_samples/categories/fashion_lifestyle_still_life.yaml",
    reviewDocRef:
      "docs/286_v7_31_native_doubao_french_summer_rattan_bag_v2_watermark_off_post_run_review_accepted_candidate.md",
    promptPackageRef:
      "prompts/image_generation/product_still_life_french_summer_rattan_bucket_bag_bicycle_no_watermark_v2.yaml",
    sourcePhase: "v7_31",
    category: "fashion_lifestyle_still_life",
    assetStatus: "accepted_candidate",
    providerType: "direct_api",
    pluginId: "NativeDoubaoImage",
    model: "doubao-seedream-5-0-260128",
    requiredLongEdge: 512,
  },
};

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

function assertTargetClean(sample) {
  const targetRoot = repoPath(sample.targetRoot);
  if (!fs.existsSync(targetRoot)) return;
  const entries = fs.readdirSync(targetRoot).filter((entry) => entry !== ".gitkeep");
  if (entries.length > 0) {
    throw new Error(`target capsule directory is not empty: ${sample.targetRoot}`);
  }
}

async function createCapsule(sample) {
  requireExists(sample.sourceImage, "source image");
  requireExists(sample.registryRef, "registry");
  requireExists(sample.categoryRef, "category index");
  requireExists(sample.reviewDocRef, "review document");
  assertTargetClean(sample);

  fs.mkdirSync(repoPath(sample.targetRoot), { recursive: true });

  const paths = {
    manifest: `${sample.targetRoot}/manifest.json`,
    preview: `${sample.targetRoot}/preview.webp`,
    importRecord: `${sample.targetRoot}/import_record.json`,
    reviewRecord: `${sample.targetRoot}/review_record.json`,
    approvalRecord: `${sample.targetRoot}/approval_record.json`,
  };

  const plannedFiles = Object.values(paths);
  for (const plannedFile of plannedFiles) {
    if (fs.existsSync(repoPath(plannedFile))) {
      throw new Error(`refusing to overwrite existing capsule file: ${plannedFile}`);
    }
  }

  await sharp(repoPath(sample.sourceImage))
    .rotate()
    .resize({
      width: sample.requiredLongEdge,
      height: sample.requiredLongEdge,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 90 })
    .toFile(repoPath(paths.preview));

  const previewMetadata = await sharp(repoPath(paths.preview)).metadata();
  const previewLongEdge = Math.max(previewMetadata.width || 0, previewMetadata.height || 0);
  if (previewMetadata.format !== "webp" || previewLongEdge !== sample.requiredLongEdge) {
    throw new Error(
      `preview validation failed: format=${previewMetadata.format}, long_edge=${previewLongEdge}`
    );
  }

  const previewSha256 = sha256File(paths.preview);
  const registryText = readText(sample.registryRef);
  const sampleBlock = extractRegistrySampleBlock(registryText, sample.sampleId);
  if (!sampleBlock) {
    throw new Error(`sample not found in registry: ${sample.sampleId}`);
  }

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

  writeJson(paths.importRecord, {
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
    },
    imported_artifact: {
      path: "preview.webp",
      format: "webp",
      long_edge: sample.requiredLongEdge,
      sha256: previewSha256,
      git_tracked: true,
      width: previewMetadata.width,
      height: previewMetadata.height,
    },
    guard: commonGuard,
  });

  writeJson(paths.reviewRecord, {
    record_type: "git_portable_preview_capsule_review_record",
    version: "v1",
    sample_id: sample.sampleId,
    created_at: createdAt,
    review_doc_ref: sample.reviewDocRef,
    registry_sample_block: sampleBlock,
    review_summary: {
      asset_status: sample.assetStatus,
      category: sample.category,
      source_phase: sample.sourcePhase,
      commercial_use_level: "accepted_candidate",
      memory_suitability: false,
    },
    guard: commonGuard,
  });

  writeJson(paths.approvalRecord, {
    record_type: "git_portable_preview_capsule_approval_record",
    version: "v1",
    sample_id: sample.sampleId,
    created_at: createdAt,
    approval_source_ref: sample.reviewDocRef,
    approval_basis: "existing accepted_sample_registry entry and accepted_candidate post-run review",
    approval_state: {
      accepted_sample_registered: true,
      portable_preview_capsule_creation_authorized_by_user: true,
      production_candidate_authorized: false,
      memory_write_authorized: false,
      DailyNote_write_authorized: false,
    },
    guard: commonGuard,
  });

  writeJson(paths.manifest, {
    manifest_type: "git_portable_preview_capsule_manifest",
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
        sha256_in_manifest: false,
        required_for_portable_validation: false,
      },
    },
    chain: {
      import_record: "import_record.json",
      review_record: "review_record.json",
      approval_record: "approval_record.json",
    },
    source_refs: {
      registry_ref: sample.registryRef,
      category_ref: sample.categoryRef,
      review_doc_ref: sample.reviewDocRef,
      prompt_package_ref: sample.promptPackageRef,
    },
    guard: commonGuard,
  });

  return {
    sample_id: sample.sampleId,
    target_root: sample.targetRoot,
    preview: {
      path: paths.preview,
      width: previewMetadata.width,
      height: previewMetadata.height,
      long_edge: previewLongEdge,
      sha256: previewSha256,
    },
    created_files: plannedFiles,
  };
}

async function main() {
  const readArg = (name) => {
    const prefix = `--${name}=`;
    const found = process.argv.find((arg) => arg.startsWith(prefix));
    return found ? found.slice(prefix.length) : null;
  };
  const sampleId = readArg("sample-id") || "accepted_french_summer_rattan_bucket_bag_001";
  const sample = SAMPLES[sampleId];
  if (!sample) {
    throw new Error(`unsupported sample id: ${sampleId}`);
  }
  const sourceImage = readArg("source-image");
  if (sourceImage && sourceImage !== sample.sourceImage) {
    throw new Error(`source image does not match authorized sample source: ${sourceImage}`);
  }
  const longEdge = readArg("long-edge");
  if (longEdge && Number(longEdge) !== sample.requiredLongEdge) {
    throw new Error(`long edge does not match authorized sample long_edge: ${longEdge}`);
  }

  const result = await createCapsule(sample);
  process.stdout.write(`${JSON.stringify({ passed: true, result }, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exit(1);
});
