#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const repoRoot = path.resolve(__dirname, "..");

const FAILURE_REGISTRY_REF = "failure_samples/failure_registry.yaml";

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

function readArg(name) {
  const prefix = `--${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : null;
}

function boolArg(name) {
  return readArg(name) === "true";
}

function requireExists(relativePath, label) {
  if (!fs.existsSync(repoPath(relativePath))) {
    throw new Error(`${label} missing: ${relativePath}`);
  }
}

function extractFailureBlock(registryText, sampleId) {
  const marker = `failure_id: ${sampleId}`;
  const start = registryText.indexOf(marker);
  if (start < 0) return "";
  const rest = registryText.slice(start);
  const next = rest.search(/\n\s+- failure_id: /);
  return next >= 0 ? rest.slice(0, next).trimEnd() : rest.trimEnd();
}

function parseScalar(block, key) {
  const match = block.match(new RegExp(`^\\s*${key}:\\s*(.*)$`, "m"));
  if (!match) return null;
  const value = match[1].trim();
  return value === "null" ? null : value;
}

function parseList(block, key) {
  const lines = block.split(/\r?\n/);
  const start = lines.findIndex((line) => line.match(new RegExp(`^\\s*${key}:\\s*$`)));
  if (start < 0) return [];
  const values = [];
  for (const line of lines.slice(start + 1)) {
    const item = line.match(/^\s*-\s*(.+?)\s*$/);
    if (item) {
      values.push(item[1]);
      continue;
    }
    if (line.trim() && line.match(/^\s*[a-zA-Z_]+:/)) break;
  }
  return values;
}

function loadSample(sampleId) {
  const registryText = readText(FAILURE_REGISTRY_REF);
  const block = extractFailureBlock(registryText, sampleId);
  if (!block) {
    throw new Error(`unsupported failure sample id: ${sampleId}`);
  }

  return {
    sampleId,
    sourceImage: parseScalar(block, "image_path"),
    targetRoot: `asset_archive/failure_samples/${sampleId}`,
    failureRegistryRef: FAILURE_REGISTRY_REF,
    reviewDocRef: parseScalar(block, "review_doc_ref"),
    promptPackageRef: parseScalar(block, "prompt_package_ref"),
    sourcePhase: parseScalar(block, "source_phase"),
    providerType: parseScalar(block, "provider_type"),
    pluginId: parseScalar(block, "plugin_id"),
    model: parseScalar(block, "model"),
    requiredLongEdge: 512,
    failureTags: parseList(block, "failure_tags"),
    resolvedByAcceptedSample: parseScalar(block, "resolved_by_accepted_sample"),
  };
}

function capsulePaths(sample) {
  return {
    manifest: `${sample.targetRoot}/manifest.json`,
    preview: `${sample.targetRoot}/preview.webp`,
    failureRecord: `${sample.targetRoot}/failure_record.json`,
    reviewRecord: `${sample.targetRoot}/review_record.json`,
  };
}

function assertTargetClean(sample) {
  const targetRoot = repoPath(sample.targetRoot);
  if (!fs.existsSync(targetRoot)) return;
  const entries = fs.readdirSync(targetRoot).filter((entry) => entry !== ".gitkeep");
  if (entries.length > 0) {
    throw new Error(`target capsule directory is not empty: ${sample.targetRoot}`);
  }
}

function planOnly(sample) {
  const paths = capsulePaths(sample);
  return {
    passed: true,
    mode: "plan_only",
    sample_id: sample.sampleId,
    source_image: sample.sourceImage,
    source_image_exists: fs.existsSync(repoPath(sample.sourceImage)),
    target_root: sample.targetRoot,
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
    },
  };
}

async function createCapsule(sample) {
  requireExists(sample.sourceImage, "source image");
  requireExists(sample.failureRegistryRef, "failure registry");
  requireExists(sample.reviewDocRef, "review document");
  requireExists(sample.promptPackageRef, "prompt package");
  assertTargetClean(sample);

  const paths = capsulePaths(sample);
  fs.mkdirSync(repoPath(sample.targetRoot), { recursive: true });

  for (const plannedFile of Object.values(paths)) {
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
  const registryText = readText(sample.failureRegistryRef);
  const failureBlock = extractFailureBlock(registryText, sample.sampleId);
  if (!failureBlock) {
    throw new Error(`failure sample not found in registry: ${sample.sampleId}`);
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
    production_candidate_created: false,
  };

  writeJson(paths.failureRecord, {
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

  writeJson(paths.reviewRecord, {
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

  writeJson(paths.manifest, {
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

  return {
    passed: true,
    mode: "create",
    sample_id: sample.sampleId,
    target_root: sample.targetRoot,
    created_files: Object.values(paths),
    preview: {
      path: paths.preview,
      width: previewMetadata.width,
      height: previewMetadata.height,
      long_edge: previewLongEdge,
      sha256: previewSha256,
    },
  };
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
