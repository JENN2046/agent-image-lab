#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const receiptRef = "reports/provider_receipts/v0_6_73_real_vcp_agent_generation_retry_006_receipt.json";
const reviewHandoffRef = "review_console/live_receipt_bridge/v0_6_73_real_vcp_agent_generation_retry_006/bridge_entry.json";
const imageRef = "runs/real_generation/v0_6_73_real_vcp_agent_generation_retry_006/image/doubaogen/67b7aa65-4d90-4af5-8447-7194c7f017d1.png";
const expected = {
  bytes: 131139,
  sha256: "b75492195a390ab5ba9bd18d909db67dbf389ac03ee4d8a6b35c7249c532d446",
  mimeType: "image/jpeg",
  format: "jpeg",
  magicNumber: "ffd8ffe0",
  width: 1920,
  height: 2048,
  trackedByGit: true,
  ignoredByGit: false,
  extensionMismatchRecorded: true,
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `Path escapes repository: ${relativePath}`);
  return resolved;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function git(args, allowFailure = false) {
  try {
    return execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (error) {
    if (allowFailure) return "";
    throw error;
  }
}

function assertNoAbsoluteLocalPath(value, label) {
  const text = JSON.stringify(value);
  assert(!/[A-Z]:[\\/]/.test(text), `${label} must not expose Windows absolute paths`);
}

function assertArtifactMetadata(record, label) {
  assert(record.path === imageRef, `${label} path mismatch`);
  assert(record.bytes === expected.bytes, `${label} byte count mismatch`);
  assert(record.sha256 === expected.sha256, `${label} sha256 mismatch`);
  assert(record.mime_type === expected.mimeType, `${label} mime type mismatch`);
  assert(record.magic_number === expected.magicNumber, `${label} magic number mismatch`);
  assert(record.width === expected.width, `${label} width mismatch`);
  assert(record.height === expected.height, `${label} height mismatch`);
  assert(record.extension_mismatch_recorded === expected.extensionMismatchRecorded, `${label} extension mismatch flag mismatch`);
}

async function main() {
  const receipt = readJson(receiptRef);
  const handoff = readJson(reviewHandoffRef);
  assertNoAbsoluteLocalPath(receipt, "receipt");
  assertNoAbsoluteLocalPath(handoff, "handoff");
  assert(receipt.output_directory_abs === "<redacted-local-path>", "receipt output_directory_abs must be redacted");
  assert(receipt.doubao_project_base_path_override_ref === "<redacted-local-path>", "receipt PROJECT_BASE_PATH ref must be redacted");
  assert(handoff.output_directory_abs === "<redacted-local-path>", "handoff output_directory_abs must be redacted");
  assert(handoff.doubao_project_base_path_override_ref === "<redacted-local-path>", "handoff PROJECT_BASE_PATH ref must be redacted");

  const receiptImage = receipt.image_files && receipt.image_files[0];
  const handoffImage = handoff.image_files && handoff.image_files[0];
  const receiptOutput = receipt.output_files && receipt.output_files[0];
  const handoffOutput = handoff.output_files && handoff.output_files[0];
  assertArtifactMetadata(receiptImage, "receipt image");
  assertArtifactMetadata(handoffImage, "handoff image");
  assertArtifactMetadata(receiptOutput, "receipt output");
  assertArtifactMetadata(handoffOutput, "handoff output");

  const imagePath = repoPath(imageRef);
  const bytes = fs.readFileSync(imagePath);
  const metadata = await sharp(imagePath).metadata();
  const sha256 = crypto.createHash("sha256").update(bytes).digest("hex");
  const magicNumber = bytes.subarray(0, 4).toString("hex");
  const tracked = git(["ls-files", "--", imageRef]) === imageRef;
  const ignored = git(["check-ignore", "--", imageRef], true) !== "";

  assert(bytes.length === expected.bytes, "image byte count mismatch");
  assert(sha256 === expected.sha256, "image sha256 mismatch");
  assert(magicNumber === expected.magicNumber, "image magic number mismatch");
  assert(metadata.format === expected.format, "image format mismatch");
  assert(metadata.width === expected.width, "image width mismatch");
  assert(metadata.height === expected.height, "image height mismatch");
  assert(tracked === expected.trackedByGit, "image git tracking status mismatch");
  assert(ignored === expected.ignoredByGit, "image git ignore status mismatch");
  assert(path.extname(imageRef) === ".png", "historical image extension changed unexpectedly");

  process.stdout.write(`${JSON.stringify({
    passed: true,
    validator: "validate_retry_006_artifact_integrity",
    image_ref: imageRef,
    bytes: bytes.length,
    sha256,
    mime_type: expected.mimeType,
    magic_number: magicNumber,
    actual_format: metadata.format,
    width: metadata.width,
    height: metadata.height,
    extension: ".png",
    extension_mismatch_recorded: true,
    git_tracked: tracked,
    git_ignored: ignored,
    public_absolute_paths_absent: true,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
  }, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${JSON.stringify({
    passed: false,
    validator: "validate_retry_006_artifact_integrity",
    error: error.message,
  }, null, 2)}\n`);
  process.exitCode = 1;
});
