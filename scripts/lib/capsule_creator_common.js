"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const BASE_NO_EXECUTION_GUARD = Object.freeze({
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
});

function createNoExecutionGuard(extra = {}) {
  return { ...BASE_NO_EXECUTION_GUARD, ...extra };
}

function createCapsuleCreatorCommon(repoRoot, options = {}) {
  const tempRootParent = options.tempRootParent;
  if (!tempRootParent) {
    throw new Error("tempRootParent is required");
  }

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

  function exists(relativePath) {
    return fs.existsSync(repoPath(relativePath));
  }

  function requireExists(relativePath, label) {
    if (!exists(relativePath)) {
      throw new Error(`${label} missing: ${relativePath}`);
    }
  }

  function tempTargetRoot(sample) {
    return `${tempRootParent}/.tmp-${sample.sampleId}-${process.pid}-${Date.now()}`;
  }

  function removeTempTarget(relativePath) {
    const resolved = repoPath(relativePath);
    const relative = path.relative(repoRoot, resolved).replace(/\\/g, "/");
    if (!relative.startsWith(`${tempRootParent}/.tmp-`)) {
      throw new Error(`refusing to remove non-temp capsule path: ${relativePath}`);
    }
    fs.rmSync(resolved, { recursive: true, force: true });
  }

  function assertTargetClean(sample) {
    if (exists(sample.targetRoot)) {
      throw new Error(`target capsule directory already exists: ${sample.targetRoot}`);
    }
  }

  function ensureDir(relativePath) {
    fs.mkdirSync(repoPath(relativePath), { recursive: true });
  }

  function renamePath(fromRelativePath, toRelativePath) {
    fs.renameSync(repoPath(fromRelativePath), repoPath(toRelativePath));
  }

  return {
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
  };
}

module.exports = {
  BASE_NO_EXECUTION_GUARD,
  createNoExecutionGuard,
  createCapsuleCreatorCommon,
};
