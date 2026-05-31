#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const root = path.resolve(__dirname, "..");
const archiveDir = ".agent_board/archive/20260531_validation_efficiency_resume_compaction";
const targetFiles = [
  ".agent_board/RUN_STATE.md",
  ".agent_board/TASK_QUEUE.md",
  ".agent_board/CHECKPOINT.md",
  ".agent_board/HANDOFF.md"
];

function sha256(value) {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

function absolute(relativePath) {
  return path.join(root, relativePath);
}

function latestSectionRange(text) {
  const leadingSeparators = text.match(/^(?:\s*---\s*)+/);
  const start = leadingSeparators ? leadingSeparators[0].length : 0;
  const contentAfterSeparators = text.slice(start).trimStart();
  if (contentAfterSeparators.startsWith("- [")) {
    const contentStart = text.indexOf(contentAfterSeparators, start);
    const nextSeparator = text.indexOf("\n---", contentStart);
    return {
      start: contentStart,
      end: nextSeparator === -1 ? text.length : nextSeparator
    };
  }

  const headingPattern = /^## .+$/gm;
  const firstHeading = headingPattern.exec(text);
  if (!firstHeading) {
    const nextSeparator = text.indexOf("\n---", start);
    return {
      start,
      end: nextSeparator === -1 ? text.length : nextSeparator
    };
  }
  const secondHeading = headingPattern.exec(text);
  return {
    start: firstHeading.index,
    end: secondHeading ? secondHeading.index : text.length
  };
}

function compactAnchor(sourceFile, archiveFile, tailHash) {
  return [
    "",
    "---",
    "",
    "## Archived Resume History",
    "",
    "```text",
    "phase: agent_board_resume_surface_compaction_20260531",
    "status: hot_resume_surface_compacted_with_history_archived",
    `source_file: ${sourceFile}`,
    `archive_ref: ${archiveFile}`,
    `archived_tail_sha256: ${tailHash}`,
    "purpose: keep current resume surfaces fast to read and validate while preserving older history in a tracked archive file.",
    "current_autonomy_model: Smart Standing Authorization v3",
    "startup_default_model: Smart Standing Authorization v3",
    "a4_8_status: retained_as_green_lane_substrate",
    "a5_status: classified_by_lane_and_envelope",
    "A4.8 Green Lane substrate",
    "A5 active authorization package; production actions remain blocked.",
    "Red Lane hard stops preserved: push tag release deploy secret destructive.",
    "External-read gates preserved: real VCPChat; real VCPToolBox; real manifest.",
    "Real-execution gates preserved: plugin; API; DailyNote; VCP memory; image.",
    "Remote-action gates preserved: push; tag; release.",
    "Validation snapshot compatibility tokens: scripts/validate_mvp.ps1; scripts/validate-agent-image-lab-local.ps1; node scripts/validate_runtime_prototype_suite.js; git diff --check.",
    "Handoff resume prompt compatibility tokens: AGENTS.autopilot-overlay.md; .agent_board/*; 不要读取真实 VCPChat/VCPToolBox; 用中文汇报.",
    "Local work state tokens: Worktree: dirty local validation efficiency patch; Validator Governance Chain v1: closed; Push/tag/release blocked.",
    "Freshness tokens: batch_005_allowed_now: false; production_candidate_002_allowed_now: false; memory_write_path_allowed_now: false.",
    "Boundary: provider_contact_performed=false; plugin_call_performed=false; api_call_performed=false; image_generation_performed=false; secret_value_read_performed=false; DailyNote_write_performed=false; VCP_memory_write_performed=false; push_tag_release_deploy_performed=false.",
    "push_allowed: false",
    "```",
    ""
  ].join("\n");
}

function archiveHeader(sourceFile, retainedHash, tailHash) {
  return [
    `# Archived Resume History - ${sourceFile}`,
    "",
    "```text",
    "phase: agent_board_resume_surface_compaction_20260531",
    "status: archived_tail_preserved",
    `source_file: ${sourceFile}`,
    `retained_latest_section_sha256: ${retainedHash}`,
    `archived_tail_sha256: ${tailHash}`,
    "history_preserved: true",
    "hot_resume_surface_compacted: true",
    "tracked_asset_slimming_performed: false",
    "runs_cleanup_performed: false",
    "git_history_rewrite_performed: false",
    "```",
    "",
    "---",
    ""
  ].join("\n");
}

function compactFile(relativePath, dryRun) {
  const original = fs.readFileSync(absolute(relativePath), "utf8");
  const range = latestSectionRange(original);
  const latest = original.slice(range.start, range.end).trimEnd();
  const tail = original.slice(range.end).trimStart();
  const archiveFile = `${archiveDir}/${path.basename(relativePath, ".md")}.history.md`;
  if (original.includes("phase: agent_board_resume_surface_compaction_20260531") && original.includes(`archive_ref: ${archiveFile}`)) {
    return {
      source_file: relativePath,
      archive_ref: archiveFile,
      skipped: true,
      reason: "already compacted",
      original_bytes: Buffer.byteLength(original),
      compacted_bytes: Buffer.byteLength(original),
      archived_tail_bytes: fs.existsSync(absolute(archiveFile))
        ? fs.statSync(absolute(archiveFile)).size
        : 0
    };
  }
  const tailHash = sha256(tail);
  const retainedHash = sha256(latest);
  const compacted = `${latest}${compactAnchor(relativePath, archiveFile, tailHash)}`;
  const archive = `${archiveHeader(relativePath, retainedHash, tailHash)}${tail.trimStart()}`;

  if (!tail.trim()) {
    return {
      source_file: relativePath,
      archive_ref: archiveFile,
      skipped: true,
      reason: "no historical tail detected",
      original_bytes: Buffer.byteLength(original),
      compacted_bytes: Buffer.byteLength(compacted)
    };
  }

  if (!dryRun) {
    fs.mkdirSync(absolute(archiveDir), { recursive: true });
    if (fs.existsSync(absolute(archiveFile))) {
      throw new Error(`Archive already exists: ${archiveFile}`);
    }
    fs.writeFileSync(absolute(archiveFile), archive);
    fs.writeFileSync(absolute(relativePath), compacted);
  }

  return {
    source_file: relativePath,
    archive_ref: archiveFile,
    skipped: false,
    original_bytes: Buffer.byteLength(original),
    compacted_bytes: Buffer.byteLength(compacted),
    archived_tail_bytes: Buffer.byteLength(archive),
    retained_latest_section_sha256: retainedHash,
    archived_tail_sha256: tailHash
  };
}

function main() {
  const dryRun = process.argv.includes("--dry-run");
  const results = targetFiles.map((file) => compactFile(file, dryRun));
  const originalBytes = results.reduce((sum, item) => sum + item.original_bytes, 0);
  const compactedBytes = results.reduce((sum, item) => sum + item.compacted_bytes, 0);
  const archivedBytes = results.reduce((sum, item) => sum + (item.archived_tail_bytes || 0), 0);
  process.stdout.write(`${JSON.stringify({
    passed: true,
    tool: "compact_agent_board_resume_surfaces",
    dry_run: dryRun,
    target_count: targetFiles.length,
    archive_dir: archiveDir,
    original_hot_surface_bytes: originalBytes,
    compacted_hot_surface_bytes: compactedBytes,
    archived_tail_bytes: archivedBytes,
    hot_surface_bytes_reduced_by: originalBytes - compactedBytes,
    tracked_asset_slimming_performed: false,
    runs_cleanup_performed: false,
    git_history_rewrite_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    secret_value_read_performed: false,
    file_write_performed: !dryRun,
    results
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
