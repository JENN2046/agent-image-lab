"use strict";

const YAML = require("yaml");

const ACCEPTED_REGISTRY_REF = "accepted_samples/accepted_sample_registry.yaml";
const ACCEPTED_CAPSULE_ROOT = "asset_archive/accepted_samples";
const DEFAULT_LONG_EDGE = 512;

function parseRegistryRows(registryText) {
  const document = YAML.parse(registryText);
  const registry = document && document.accepted_sample_registry;
  if (!registry || !Array.isArray(registry.samples)) return [];
  return registry.samples.map((sample) => ({
    sample_id: sample && sample.sample_id,
    data: sample || {},
    block: YAML.stringify(sample || {}).trim(),
  }));
}

function scalar(row, field) {
  const value = row && row.data ? row.data[field] : null;
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return null;
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
  const rows = parseRegistryRows(registryText);
  const row = rows.find((item) => item.sample_id === sampleId);
  if (!row) throw new Error(`sample not found in accepted registry: ${sampleId}`);

  const duplicateCount = rows.filter((item) => item.sample_id === sampleId).length;
  if (duplicateCount > 1) throw new Error(`duplicate sample_id in accepted registry: ${sampleId}`);

  const registry = YAML.parse(registryText).accepted_sample_registry;

  const sample = {
    sampleId,
    sourceImage: scalar(row, "image_path"),
    targetRoot: `${ACCEPTED_CAPSULE_ROOT}/${sampleId}`,
    registryRef,
    category: scalar(row, "category"),
    reviewDocRef: scalar(row, "review_doc_ref"),
    promptPackageRef: scalar(row, "prompt_package_ref"),
    sourcePhase: scalar(row, "source_phase"),
    assetStatus: scalar(row, "asset_status"),
    providerType: scalar(row, "provider_type"),
    pluginId: scalar(row, "plugin_id"),
    model: scalar(row, "model"),
    requiredLongEdge: DEFAULT_LONG_EDGE,
    registrySampleBlock: row.block,
    source: "accepted_sample_registry",
  };

  const failures = [];
  if (!registry.version) failures.push("registry_field_missing:version");
  if (registry.memory_write_allowed !== false) failures.push("registry_field_not_false:memory_write_allowed");
  if (registry.daily_note_write_allowed !== false) failures.push("registry_field_not_false:daily_note_write_allowed");
  for (const field of ["sourceImage", "category", "reviewDocRef", "promptPackageRef", "sourcePhase", "assetStatus", "providerType", "model"]) {
    if (!sample[field]) failures.push(`registry_field_missing:${field}`);
  }
  if (row.data.write_to_memory_allowed !== false) failures.push("sample_field_not_false:write_to_memory_allowed");
  if (row.data.daily_note_write_allowed !== false) failures.push("sample_field_not_false:daily_note_write_allowed");

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
