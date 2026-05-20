"use strict";

const {
  countRowsById,
  parseRegistryRows: parseCommonRegistryRows,
  parseYamlDocument,
  scalar,
  stringList,
} = require("./capsule_registry_source_common");

const FAILURE_REGISTRY_REF = "failure_samples/failure_registry.yaml";
const FAILURE_CAPSULE_ROOT = "asset_archive/failure_samples";
const DEFAULT_LONG_EDGE = 512;

function parseRegistryRows(registryText) {
  return parseCommonRegistryRows(registryText, "failure_registry", "failures", "failure_id");
}

function loadFailureSampleFromRegistry(reader, sampleId, options = {}) {
  if (typeof sampleId !== "string" || !/^[A-Za-z0-9_.-]+$/.test(sampleId)) {
    throw new Error(`invalid failure sample id: ${sampleId}`);
  }

  const registryRef = options.registryRef || FAILURE_REGISTRY_REF;
  if (!reader.exists(registryRef)) throw new Error(`failure sample registry missing: ${registryRef}`);

  const registryText = reader.readText(registryRef);
  const document = parseYamlDocument(registryText);
  const registry = document && document.failure_registry;
  const rows = parseRegistryRows(registryText);
  const row = rows.find((item) => item.failure_id === sampleId);
  if (!row) throw new Error(`failure sample not found in registry: ${sampleId}`);

  const duplicateCount = countRowsById(rows, "failure_id", sampleId);
  if (duplicateCount > 1) throw new Error(`duplicate failure_id in failure registry: ${sampleId}`);

  const sample = {
    sampleId,
    sourceImage: scalar(row, "image_path"),
    targetRoot: `${FAILURE_CAPSULE_ROOT}/${sampleId}`,
    failureRegistryRef: registryRef,
    reviewDocRef: scalar(row, "review_doc_ref"),
    promptPackageRef: scalar(row, "prompt_package_ref"),
    sourcePhase: scalar(row, "source_phase"),
    assetStatus: scalar(row, "asset_status"),
    providerType: scalar(row, "provider_type"),
    pluginId: scalar(row, "plugin_id"),
    model: scalar(row, "model"),
    requiredLongEdge: DEFAULT_LONG_EDGE,
    failureTags: stringList(row, "failure_tags"),
    resolvedByAcceptedSample: scalar(row, "resolved_by_accepted_sample"),
    registryFailureBlock: row.block,
    source: "failure_sample_registry",
  };

  const failures = [];
  if (!registry || !registry.version) failures.push("registry_field_missing:version");
  if (registry && registry.memory_write_allowed !== false) failures.push("registry_field_not_false:memory_write_allowed");
  if (registry && registry.daily_note_write_allowed !== false) failures.push("registry_field_not_false:daily_note_write_allowed");
  if (registry && Number(registry.failure_count) !== rows.length) failures.push("registry_field_mismatch:failure_count");

  for (const field of ["sourceImage", "reviewDocRef", "promptPackageRef", "sourcePhase", "assetStatus", "providerType", "pluginId", "model"]) {
    if (!sample[field]) failures.push(`registry_field_missing:${field}`);
  }
  if (sample.failureTags.length === 0) failures.push("registry_field_missing:failureTags");
  if (row.data.image_file_committed_to_git !== false) failures.push("sample_field_not_false:image_file_committed_to_git");
  if (row.data.memory_suitability !== false) failures.push("sample_field_not_false:memory_suitability");

  if (failures.length > 0) {
    throw new Error(`failure registry metadata incomplete for ${sampleId}: ${failures.join(",")}`);
  }

  return sample;
}

module.exports = {
  FAILURE_REGISTRY_REF,
  FAILURE_CAPSULE_ROOT,
  DEFAULT_LONG_EDGE,
  parseRegistryRows,
  loadFailureSampleFromRegistry,
};
