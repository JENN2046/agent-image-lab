"use strict";

const ACCEPTED_REGISTRY_REF = "accepted_samples/accepted_sample_registry.yaml";
const ACCEPTED_CAPSULE_ROOT = "asset_archive/accepted_samples";
const DEFAULT_LONG_EDGE = 512;

function parseRegistryRows(registryText) {
  const rows = [];
  let currentId = null;
  let currentLines = [];

  for (const line of registryText.split(/\r?\n/)) {
    const match = line.match(/^\s*-\s+sample_id:\s*(\S+)/);
    if (match) {
      if (currentId) rows.push({ sample_id: currentId, block: currentLines.join("\n") });
      currentId = match[1];
      currentLines = [line];
    } else if (currentId) {
      currentLines.push(line);
    }
  }

  if (currentId) rows.push({ sample_id: currentId, block: currentLines.join("\n") });
  return rows;
}

function scalar(block, field) {
  const escaped = field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = block.match(new RegExp("^\\s*" + escaped + ":\\s*(.+?)\\s*$", "m"));
  if (!match) return null;
  const value = match[1].trim();
  return value === "null" ? null : value;
}

function categoryContainsSample(categoryText, sampleId) {
  return categoryText.split(/\r?\n/).some((line) => {
    const match = line.match(/^\s*-\s+(\S+)/);
    return match && match[1] === sampleId;
  });
}

function loadAcceptedSampleFromRegistry(core, sampleId, options = {}) {
  if (typeof sampleId !== "string" || !/^[A-Za-z0-9_.-]+$/.test(sampleId)) {
    throw new Error(`invalid accepted sample id: ${sampleId}`);
  }

  const registryRef = options.registryRef || ACCEPTED_REGISTRY_REF;
  if (!core.exists(registryRef)) throw new Error(`accepted sample registry missing: ${registryRef}`);

  const registryText = core.read(registryRef);
  const row = parseRegistryRows(registryText).find((item) => item.sample_id === sampleId);
  if (!row) throw new Error(`sample not found in accepted registry: ${sampleId}`);

  const sample = {
    sampleId,
    sourceImage: scalar(row.block, "image_path"),
    targetRoot: `${ACCEPTED_CAPSULE_ROOT}/${sampleId}`,
    registryRef,
    category: scalar(row.block, "category"),
    reviewDocRef: scalar(row.block, "review_doc_ref"),
    promptPackageRef: scalar(row.block, "prompt_package_ref"),
    sourcePhase: scalar(row.block, "source_phase"),
    assetStatus: scalar(row.block, "asset_status"),
    providerType: scalar(row.block, "provider_type"),
    pluginId: scalar(row.block, "plugin_id"),
    model: scalar(row.block, "model"),
    requiredLongEdge: DEFAULT_LONG_EDGE,
    registrySampleBlock: row.block,
    source: "accepted_sample_registry",
  };

  const failures = [];
  for (const field of ["sourceImage", "category", "reviewDocRef", "promptPackageRef", "sourcePhase", "assetStatus", "providerType", "model"]) {
    if (!sample[field]) failures.push(`registry_field_missing:${field}`);
  }

  if (sample.category) {
    sample.categoryRef = `accepted_samples/categories/${sample.category}.yaml`;
    if (!core.exists(sample.categoryRef)) {
      failures.push(`category_index_missing:${sample.categoryRef}`);
    } else if (!categoryContainsSample(core.read(sample.categoryRef), sampleId)) {
      failures.push(`category_index_missing_sample:${sampleId}`);
    }
  }

  if (failures.length > 0) {
    throw new Error(`accepted registry metadata incomplete for ${sampleId}: ${failures.join(",")}`);
  }

  return sample;
}

module.exports = {
  ACCEPTED_REGISTRY_REF,
  ACCEPTED_CAPSULE_ROOT,
  DEFAULT_LONG_EDGE,
  parseRegistryRows,
  loadAcceptedSampleFromRegistry,
};
