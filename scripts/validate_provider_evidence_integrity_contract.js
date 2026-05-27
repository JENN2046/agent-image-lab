#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const sharp = require("sharp");
const YAML = require("yaml");

const root = path.resolve(__dirname, "..");
const schemaRef = "schemas/provider_evidence_integrity_contract.schema.yaml";
const receiptDir = "reports/provider_receipts";
const handoffDir = "review_console/live_receipt_bridge";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  assert(!relative.startsWith("..") && !path.isAbsolute(relative), `Path escapes repository: ${relativePath}`);
  return resolved;
}

function toRel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
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

function discoverReceiptRefs() {
  return fs.readdirSync(repoPath(receiptDir))
    .filter((name) => /^v0_6_73_real_vcp_agent_generation_(?:one_shot|retry_\d{3})_receipt\.json$/.test(name))
    .map((name) => `${receiptDir}/${name}`)
    .sort();
}

function discoverHandoffRefs() {
  return fs.readdirSync(repoPath(handoffDir), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `${handoffDir}/${entry.name}/bridge_entry.json`)
    .filter((ref) => /^review_console\/live_receipt_bridge\/v0_6_73_real_vcp_agent_generation_(?:one_shot|retry_\d{3})\/bridge_entry\.json$/.test(ref))
    .filter((ref) => fs.existsSync(repoPath(ref)))
    .sort();
}

function assertSchemaContract() {
  const schema = YAML.parse(fs.readFileSync(repoPath(schemaRef), "utf8"));
  assert(schema.id === "provider_evidence_integrity_contract", "schema id mismatch");
  assert(schema.version === "v0_1", "schema version mismatch");
  assert(schema.phase === "p2_1_provider_evidence_integrity_phase_2", "schema phase mismatch");
  assert(schema.public_disclosure_constraints.local_absolute_paths === "forbidden", "local path disclosure policy mismatch");
  assert(schema.public_disclosure_constraints.loopback_urls === "forbidden", "loopback disclosure policy mismatch");
  assert(schema.public_disclosure_constraints.local_admin_route_url_ref === "<redacted-local-admin-route>", "admin route redaction policy mismatch");
  assert(schema.artifact_integrity_contract.eligible_artifacts_require.includes("sha256"), "sha256 requirement missing");
  assert(schema.artifact_integrity_contract.eligible_artifacts_require.includes("mime_type"), "mime requirement missing");
  assert(schema.artifact_integrity_contract.eligible_artifacts_require.includes("width"), "width requirement missing");
  assert(schema.artifact_integrity_contract.eligible_artifacts_require.includes("git_tracked_true"), "git tracked requirement missing");
  return schema;
}

function assertNoPublicDisclosureLeak(value, label) {
  const text = JSON.stringify(value);
  assert(!/\b[A-Za-z]:[\\/][^"',\s)]*/.test(text), `${label} exposes a Windows absolute path`);
  assert(!/\/(?:Users|home)\/[A-Za-z0-9._-]+\/[^"',\s)]*/.test(text), `${label} exposes a home absolute path`);
  assert(!/https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\]|::1)(?::\d+)?[^"',\s)]*/i.test(text), `${label} exposes a loopback URL`);
  assert(!/Basic\s+[A-Za-z0-9+/=._~-]+/i.test(text), `${label} exposes Basic auth material`);
  assert(!/Bearer\s+[A-Za-z0-9._~+/-]+/i.test(text), `${label} exposes bearer token material`);
  assert(!/sk-[A-Za-z0-9_-]{8,}/.test(text), `${label} exposes sk-* token material`);
  assert(!/AKLT[A-Za-z0-9_-]{8,}/.test(text), `${label} exposes provider key material`);
}

function assertRedactedLocalRefs(value, label) {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if ((key === "output_directory_abs" || key === "doubao_project_base_path_override_ref" || key === "authorized_output_directory") && child !== undefined) {
      assert(child === "<redacted-local-path>", `${label}.${key} must be <redacted-local-path>`);
    }
    if (key === "out_of_scope_output_files" && Array.isArray(child)) {
      for (const [index, file] of child.entries()) {
        assert(typeof file.path === "string" && file.path.startsWith("<redacted-local-path>/"), `${label}.out_of_scope_output_files[${index}].path must be redacted`);
        assert(file.sha256 === undefined, `${label}.out_of_scope_output_files[${index}] must not publish hash for non-reviewable local artifact`);
        assert(file.mime_type === undefined, `${label}.out_of_scope_output_files[${index}] must not publish MIME for non-reviewable local artifact`);
      }
    }
    if (child && typeof child === "object") assertRedactedLocalRefs(child, `${label}.${key}`);
  }
}

function assertLocalAdminRoute(route, label) {
  if (route === undefined) return false;
  assert(route && typeof route === "object", `${label}.local_admin_route must be object`);
  assert(route.method === "POST", `${label}.local_admin_route.method mismatch`);
  assert(route.url_ref === "<redacted-local-admin-route>", `${label}.local_admin_route.url_ref must be redacted`);
  assert(route.local_admin_route_used === true, `${label}.local_admin_route_used must be true`);
  assert(route.local_admin_route_scope === "loopback_redacted", `${label}.local_admin_route_scope mismatch`);
  assert(Number.isInteger(route.http_status), `${label}.local_admin_route.http_status must be integer`);
  assert(typeof route.route_reached === "boolean", `${label}.local_admin_route.route_reached must be boolean`);
  assertNoPublicDisclosureLeak(route, `${label}.local_admin_route`);
  return true;
}

function assertRepoRelativePath(artifactPath, label) {
  assert(typeof artifactPath === "string" && artifactPath.length > 0, `${label}.path missing`);
  assert(!path.isAbsolute(artifactPath), `${label}.path must be repo-relative`);
  assert(!artifactPath.startsWith("../") && !artifactPath.includes("/../"), `${label}.path must not traverse`);
  assert(artifactPath.startsWith("runs/real_generation/"), `${label}.path must stay under runs/real_generation`);
}

async function assertEligibleArtifact(record, label) {
  assert(record && typeof record === "object", `${label} missing`);
  assertRepoRelativePath(record.path, label);
  assert(Number.isInteger(record.bytes) && record.bytes > 0, `${label}.bytes missing`);
  assert(/^[a-f0-9]{64}$/.test(record.sha256), `${label}.sha256 invalid`);
  assert(/^image\/[a-z0-9.+-]+$/.test(record.mime_type), `${label}.mime_type invalid`);
  assert(/^[a-f0-9]{8,}$/.test(record.magic_number), `${label}.magic_number invalid`);
  assert(Number.isInteger(record.width) && record.width > 0, `${label}.width invalid`);
  assert(Number.isInteger(record.height) && record.height > 0, `${label}.height invalid`);

  const artifactPath = repoPath(record.path);
  assert(fs.existsSync(artifactPath), `${label}.path file missing`);
  const bytes = fs.readFileSync(artifactPath);
  const metadata = await sharp(artifactPath).metadata();
  const sha256 = crypto.createHash("sha256").update(bytes).digest("hex");
  const magicNumber = bytes.subarray(0, 4).toString("hex");
  const tracked = git(["ls-files", "--", record.path]) === record.path;
  const ignored = git(["check-ignore", "--", record.path], true) !== "";

  assert(bytes.length === record.bytes, `${label}.bytes mismatch`);
  assert(sha256 === record.sha256, `${label}.sha256 mismatch`);
  assert(record.magic_number.startsWith(magicNumber), `${label}.magic_number mismatch`);
  assert(record.mime_type === `image/${metadata.format === "jpeg" ? "jpeg" : metadata.format}`, `${label}.mime_type mismatch`);
  assert(metadata.width === record.width, `${label}.width mismatch`);
  assert(metadata.height === record.height, `${label}.height mismatch`);
  assert(tracked === true, `${label}.path must be git tracked`);
  assert(ignored === false, `${label}.path must not be git ignored`);

  return {
    path: record.path,
    bytes: bytes.length,
    sha256,
    mime_type: record.mime_type,
    width: metadata.width,
    height: metadata.height,
    git_tracked: tracked,
    git_ignored: ignored,
  };
}

function collectArtifactRecords(record) {
  return [
    ...(Array.isArray(record.output_files) ? record.output_files.map((artifact) => ({ source: "output_files", artifact })) : []),
    ...(Array.isArray(record.image_files) ? record.image_files.map((artifact) => ({ source: "image_files", artifact })) : []),
  ];
}

async function assertRecordArtifactSemantics(record, label) {
  const artifacts = collectArtifactRecords(record);
  const outputScopeViolation = record.output_scope_violation === true;
  const completedWithReviewableImage = record.execution_status === "COMPLETED_PROVIDER_IMAGE_CREATED" || record.review_status === "ready_for_human_review";
  const result = {
    eligible_artifacts_checked: [],
    out_of_scope_artifact_count: Array.isArray(record.out_of_scope_output_files) ? record.out_of_scope_output_files.length : 0,
  };

  if (outputScopeViolation) {
    assert(record.review_eligible === false || record.review_status === "blocked_output_scope_violation_no_review", `${label} output-scope violation must not be review eligible`);
    assert(artifacts.length === 0, `${label} output-scope violation must not publish eligible artifact records`);
    assert(result.out_of_scope_artifact_count >= 1, `${label} output-scope violation must preserve redacted out-of-scope evidence`);
    return result;
  }

  if (completedWithReviewableImage) {
    assert(artifacts.length >= 2, `${label} completed image evidence must include output_files and image_files records`);
  }

  for (const { source, artifact } of artifacts) {
    result.eligible_artifacts_checked.push(await assertEligibleArtifact(artifact, `${label}.${source}`));
  }
  return result;
}

async function main() {
  assertSchemaContract();
  const receiptRefs = discoverReceiptRefs();
  const handoffRefs = discoverHandoffRefs();
  assert(receiptRefs.length === 6, "expected six v0.6.73 real execution receipts");
  assert(handoffRefs.length === 6, "expected six v0.6.73 real execution review handoffs");

  let localAdminRouteCount = 0;
  let eligibleArtifactRecordCount = 0;
  let outOfScopeArtifactCount = 0;
  const checkedArtifacts = [];

  for (const ref of [...receiptRefs, ...handoffRefs]) {
    const record = readJson(ref);
    const label = toRel(repoPath(ref));
    assertNoPublicDisclosureLeak(record, label);
    assertRedactedLocalRefs(record, label);
    if (assertLocalAdminRoute(record.local_admin_route, label)) localAdminRouteCount += 1;
    const artifactResult = await assertRecordArtifactSemantics(record, label);
    eligibleArtifactRecordCount += artifactResult.eligible_artifacts_checked.length;
    outOfScopeArtifactCount += artifactResult.out_of_scope_artifact_count;
    checkedArtifacts.push(...artifactResult.eligible_artifacts_checked);
  }

  const output = {
    passed: true,
    validator: "validate_provider_evidence_integrity_contract",
    contract_ref: schemaRef,
    receipt_count: receiptRefs.length,
    handoff_count: handoffRefs.length,
    local_admin_route_count: localAdminRouteCount,
    eligible_artifact_record_count: eligibleArtifactRecordCount,
    out_of_scope_artifact_count: outOfScopeArtifactCount,
    unique_checked_artifact_paths: [...new Set(checkedArtifacts.map((artifact) => artifact.path))],
    checked_artifacts: checkedArtifacts,
    public_disclosure_constraints_verified: true,
    local_admin_route_redaction_verified: true,
    artifact_integrity_verified: true,
    git_tracking_verified: true,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
  };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${JSON.stringify({
    passed: false,
    validator: "validate_provider_evidence_integrity_contract",
    error: error.message,
  }, null, 2)}\n`);
  process.exitCode = 1;
});
