const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const {
  auditedMissingExactNewTrial003Artifacts
} = require("./lib/exact_new_trial_legacy_artifacts");

const root = path.resolve(__dirname, "..");
const receiptsRoot = path.join(root, "reports", "provider_receipts");
const artifactTruthReviewPath = "reports/visual_asset_eval_dry_run/v0_6_25_exact_new_trial_artifact_persistence_truth_review.json";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function repoPath(relativePath) {
  const absolutePath = path.resolve(root, relativePath);
  assert(
    absolutePath === root || absolutePath.startsWith(`${root}${path.sep}`),
    `Path escapes repository: ${relativePath}`
  );
  return absolutePath;
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function walkStrings(value, visitor, keyPath = []) {
  if (typeof value === "string") {
    visitor(value, keyPath);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkStrings(item, visitor, keyPath.concat(String(index))));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => walkStrings(item, visitor, keyPath.concat(key)));
  }
}

function collectReceiptArtifacts() {
  const jsonFiles = fs.readdirSync(receiptsRoot)
    .filter((file) => file.endsWith(".json"))
    .map((file) => path.join(receiptsRoot, file));
  const records = [];
  const rawPrivatePathHits = [];

  for (const filePath of jsonFiles) {
    const relativeFilePath = path.relative(root, filePath).replace(/\\/g, "/");
    const json = readJson(filePath);
    walkStrings(json, (value, keyPath) => {
      if (/^[A-Za-z]:[\\/]/.test(value) || value.includes("/.codex/generated_images/") || value.includes("\\.codex\\generated_images\\")) {
        rawPrivatePathHits.push({ file: relativeFilePath, key_path: keyPath.join("."), value });
      }
    });

    if (json.attempt_result_path) {
      records.push({ source_file: relativeFilePath, record: json });
    }
    if (Array.isArray(json.entries)) {
      for (const entry of json.entries) {
        if (entry.attempt_result_path) {
          records.push({ source_file: relativeFilePath, record: entry });
        }
      }
    }
  }

  return { records, rawPrivatePathHits };
}

function loadAuditedMissingArtifactState() {
  const auditedMissing = auditedMissingExactNewTrial003Artifacts();
  const absolute = repoPath(artifactTruthReviewPath);
  if (!fs.existsSync(absolute)) return auditedMissing;

  const report = readJson(absolute).exact_new_trial_artifact_persistence_truth_review;
  if (!report || report.phase !== "v0_6_25_exact_new_trial_artifact_persistence_truth_review") return auditedMissing;
  if (report.truth_findings?.current_project_output_missing !== true) return auditedMissing;
  if (report.truth_findings?.local_persistence_verified_now !== false) return auditedMissing;
  if (report.truth_findings?.reviewable_sample_now !== false) return auditedMissing;
  if (report.truth_findings?.human_review_allowed_now !== false) return auditedMissing;

  auditedMissing.set(report.artifact_claim.claimed_output_image_path, {
    attempt_id: report.attempt_id,
    report_ref: artifactTruthReviewPath,
    current_project_output_missing: true,
    local_persistence_verified_now: false,
    reviewable_sample_now: false,
    human_review_allowed_now: false
  });
  return auditedMissing;
}

function validateRecord({ source_file: sourceFile, record }, auditedMissingArtifacts) {
  const attemptPath = repoPath(record.attempt_result_path);
  assert(fs.existsSync(attemptPath), `Missing attempt result for ${sourceFile}: ${record.attempt_result_path}`);
  const attempt = readJson(attemptPath);

  if (record.status) {
    assert(attempt.attempt_status === record.status, `Attempt status mismatch for ${record.attempt_result_path}`);
  }
  if (record.task_id) {
    assert(attempt.task_id === record.task_id, `Attempt task_id mismatch for ${record.attempt_result_path}`);
  }
  if (record.visual_task_id) {
    assert(attempt.visual_task_id === record.visual_task_id, `Attempt visual_task_id mismatch for ${record.attempt_result_path}`);
  }
  if (typeof record.provider_calls_used === "number") {
    assert(attempt.provider_calls_used === record.provider_calls_used, `Attempt provider_calls_used mismatch for ${record.attempt_result_path}`);
  }
  if (typeof record.image_candidates_generated === "number") {
    assert(attempt.image_candidates_generated === record.image_candidates_generated, `Attempt image_candidates_generated mismatch for ${record.attempt_result_path}`);
  }
  if (Object.prototype.hasOwnProperty.call(record, "output_image_path")) {
    assert(attempt.output_image_path === record.output_image_path, `Attempt output_image_path mismatch for ${record.attempt_result_path}`);
  }

  if (record.output_image_path) {
    const imagePath = repoPath(record.output_image_path);
    if (fs.existsSync(imagePath)) {
      if (record.output_image_sha256) {
        assert(sha256File(imagePath) === record.output_image_sha256, `Output image hash mismatch for ${record.output_image_path}`);
      }
      if (attempt.output_image_sha256) {
        assert(sha256File(imagePath) === attempt.output_image_sha256, `Attempt output image hash mismatch for ${record.output_image_path}`);
      }
      return { audited_missing_output_image: false };
    }

    const auditedMissing = auditedMissingArtifacts.get(record.output_image_path);
    assert(auditedMissing, `Missing output image for ${sourceFile}: ${record.output_image_path}`);
    assert(attempt.attempt_id === auditedMissing.attempt_id, `Audited missing output image attempt_id mismatch for ${record.output_image_path}`);
    return { audited_missing_output_image: true };
  } else {
    assert(attempt.output_image_path === null, `Failed attempt must not bind output image: ${record.attempt_result_path}`);
    return { audited_missing_output_image: false };
  }
}

function main() {
  const { records, rawPrivatePathHits } = collectReceiptArtifacts();
  const auditedMissingArtifacts = loadAuditedMissingArtifactState();
  assert(records.length > 0, "Provider receipt artifact records must exist");
  assert(rawPrivatePathHits.length === 0, `Raw private local paths found: ${JSON.stringify(rawPrivatePathHits)}`);

  let auditedMissingOutputImageCount = 0;
  const auditedMissingOutputImagePaths = new Set();
  for (const item of records) {
    const result = validateRecord(item, auditedMissingArtifacts);
    if (result.audited_missing_output_image) {
      auditedMissingOutputImageCount += 1;
      auditedMissingOutputImagePaths.add(item.record.output_image_path);
    }
  }

  const uniqueAttemptPaths = new Set(records.map((item) => item.record.attempt_result_path));
  const succeededRecords = records.filter((item) => item.record.status === "succeeded_image_generated");
  const failedRecords = records.filter((item) => item.record.status === "failed_no_image_generated");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    validator: "validate_provider_receipt_artifacts",
    status: "provider_receipt_artifacts_verified",
    receipt_artifact_record_count: records.length,
    unique_attempt_result_count: uniqueAttemptPaths.size,
    succeeded_record_count: succeededRecords.length,
    failed_record_count: failedRecords.length,
    missing_attempt_result_count: 0,
    audited_missing_output_image_count: auditedMissingOutputImageCount,
    audited_missing_output_image_path_count: auditedMissingOutputImagePaths.size,
    raw_private_path_count: 0,
    output_hash_mismatch_count: 0,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    runtime_probe_performed: false,
    secret_value_read_performed: false,
    push_tag_release_deploy_performed: false
  }, null, 2)}\n`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exit(1);
  }
}
