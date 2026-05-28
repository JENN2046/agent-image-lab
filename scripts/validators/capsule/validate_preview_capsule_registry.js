#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { createRecoverabilityCore } = require("../../lib/artifact_recoverability_core");
const {
  PREVIEW_FAILURE_CLASS_SUMMARY_KEYS,
  classifyPreviewFailures,
  summarizeFailureClasses,
} = require("../../lib/capsule_status_taxonomy");

const DEFAULT_ROOT = "asset_archive/accepted_samples";

function readArg(name, fallback) {
  const prefix = `--${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}

function normalizePath(value) {
  return value.replace(/\\/g, "/").replace(/\/+$/, "");
}

function summarizeSample(result) {
  const failures = result.failures || [];
  return {
    sample_id: result.sampleId,
    passed: result.passed,
    status: result.status,
    preview_sha256: result.previewSha256 || null,
    preview_width: result.previewDimensions?.width || null,
    preview_height: result.previewDimensions?.height || null,
    preview_long_edge: result.previewLongEdge || null,
    failures,
    failure_classes: classifyPreviewFailures(failures),
  };
}

function main() {
  const root = normalizePath(readArg("root", DEFAULT_ROOT));
  const mode = readArg("mode", "archive-directory");
  const requiredLongEdge = Number(readArg("long-edge", "512"));
  const requireAtLeast = Number(readArg("require-at-least", "1"));
  const core = createRecoverabilityCore(process.cwd());
  const failures = [];

  if (mode !== "archive-directory") {
    failures.push(`unsupported_mode:${mode}`);
  }

  if (root !== DEFAULT_ROOT) {
    failures.push(`unsupported_root:${root}`);
  }

  if (!Number.isInteger(requiredLongEdge) || requiredLongEdge <= 0) {
    failures.push("invalid_required_long_edge");
  }

  if (!Number.isInteger(requireAtLeast) || requireAtLeast < 0) {
    failures.push("invalid_require_at_least");
  }

  let sampleIds = [];
  if (failures.length === 0) {
    const rootPath = core.repoPath(root);
    if (!fs.existsSync(rootPath)) {
      failures.push("registry_root_missing");
    } else {
      sampleIds = fs.readdirSync(rootPath, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort((left, right) => left.localeCompare(right));
    }
  }

  if (sampleIds.length < requireAtLeast) {
    failures.push("sample_count_below_required_minimum");
  }

  const samples = sampleIds.map((sampleId) => {
    try {
      return summarizeSample(core.validatePreviewCapsule(sampleId, { requiredLongEdge }));
    } catch (error) {
      return {
        sample_id: sampleId,
        passed: false,
        status: "preview_capsule_validation_error",
        preview_sha256: null,
        preview_width: null,
        preview_height: null,
        preview_long_edge: null,
        failures: [error.message],
      };
    }
  });

  const failedSamples = samples.filter((sample) => !sample.passed);
  for (const sample of failedSamples) {
    failures.push(`sample_failed:${sample.sample_id}`);
  }

  const result = {
    passed: failures.length === 0,
    status: failures.length === 0
      ? "registry_driven_preview_capsules_verified"
      : "registry_driven_preview_capsules_failed",
    report_version: "v2",
    root,
    mode,
    required_long_edge: requiredLongEdge,
    required_sample_minimum: requireAtLeast,
    total_samples: samples.length,
    sample_count: samples.length,
    passed_count: samples.filter((sample) => sample.passed).length,
    failed_count: failedSamples.length,
    failed_sample_ids: failedSamples.map((sample) => sample.sample_id),
    failure_class_summary: summarizeFailureClasses(samples, failures, PREVIEW_FAILURE_CLASS_SUMMARY_KEYS),
    samples,
    guard: {
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      image_generation_performed: false,
      preview_creation_or_copy_performed: false,
      DailyNote_write_performed: false,
      VCP_memory_write_performed: false,
      runtime_execution_performed: false,
      real_manifest_read_performed: false,
      real_vcpchat_read_performed: false,
      real_vcptoolbox_read_performed: false,
      push_tag_release_deploy_performed: false,
    },
    failures,
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  process.exit(result.passed ? 0 : 1);
}

main();
