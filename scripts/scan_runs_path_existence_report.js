#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const scanRoots = ["docs", ".agent_board", "tests", "schemas", "scripts"];
const runsRootRef = "runs/";
const reportsDirRef = "reports/runs_path_existence_verification";

function toProjectPath(absolutePath) {
  return path.relative(root, absolutePath).replace(/\\/g, "/");
}

function isSafeProjectRelativeRunsPath(value) {
  return typeof value === "string"
    && value.startsWith(runsRootRef)
    && value.length > runsRootRef.length
    && /^[A-Za-z0-9._/-]+$/.test(value)
    && !value.includes("\\")
    && !value.includes("..")
    && !value.includes("*")
    && !value.includes("?")
    && !value.includes("<")
    && !value.includes(">")
    && !path.isAbsolute(value)
    && !/^[A-Za-z]:[\\/]/.test(value);
}

function normalizeCandidate(candidate) {
  return candidate
    .replace(/[),.;:]+$/g, "")
    .replace(/]$/g, "")
    .replace(/}$/, "");
}

function walkTextFiles(dirRef, files = []) {
  const absoluteDir = path.join(root, dirRef);
  if (!fs.existsSync(absoluteDir)) return files;

  for (const entry of fs.readdirSync(absoluteDir, { withFileTypes: true })) {
    const absoluteEntry = path.join(absoluteDir, entry.name);
    const ref = toProjectPath(absoluteEntry);
    if (entry.isDirectory()) {
      walkTextFiles(ref, files);
    } else if (entry.isFile()) {
      files.push(ref);
    }
  }

  return files;
}

function extractRunsCandidates() {
  const candidates = new Map();
  const candidatePattern = /runs\/[^\s`"'<>|{}[\]\\]+/g;
  const textFiles = scanRoots.flatMap((scanRoot) => walkTextFiles(scanRoot));

  for (const fileRef of textFiles) {
    const text = fs.readFileSync(path.join(root, fileRef), "utf8");
    for (const match of text.matchAll(candidatePattern)) {
      const candidate = normalizeCandidate(match[0]);
      if (!isSafeProjectRelativeRunsPath(candidate)) continue;
      if (!candidates.has(candidate)) {
        candidates.set(candidate, {
          project_relative_path: candidate,
          sources: [],
        });
      }
      candidates.get(candidate).sources.push(fileRef);
    }
  }

  return Array.from(candidates.values())
    .map((item) => ({
      ...item,
      sources: Array.from(new Set(item.sources)).sort(),
    }))
    .sort((a, b) => a.project_relative_path.localeCompare(b.project_relative_path));
}

function walkRunsMetadata() {
  const absoluteRunsRoot = path.join(root, runsRootRef);
  const files = [];
  const directories = [];

  function visit(absoluteDir) {
    for (const entry of fs.readdirSync(absoluteDir, { withFileTypes: true })) {
      const absoluteEntry = path.join(absoluteDir, entry.name);
      const stat = fs.lstatSync(absoluteEntry);
      const ref = toProjectPath(absoluteEntry);
      const metadata = {
        project_relative_path: ref,
        name: entry.name,
        extension: entry.isFile() ? path.extname(entry.name) : "",
        item_type: entry.isDirectory() ? "directory" : entry.isFile() ? "file" : entry.isSymbolicLink() ? "symlink" : "other",
        size_bytes: stat.size,
        last_write_time_utc: stat.mtime.toISOString(),
      };

      if (entry.isDirectory()) {
        directories.push(metadata);
        visit(absoluteEntry);
      } else if (entry.isFile()) {
        files.push(metadata);
      }
    }
  }

  if (fs.existsSync(absoluteRunsRoot)) {
    visit(absoluteRunsRoot);
  }

  return {
    files: files.sort((a, b) => a.project_relative_path.localeCompare(b.project_relative_path)),
    directories: directories.sort((a, b) => a.project_relative_path.localeCompare(b.project_relative_path)),
  };
}

function pathExists(candidateRef) {
  return fs.existsSync(path.join(root, candidateRef));
}

function main() {
  const candidates = extractRunsCandidates();
  const metadata = walkRunsMetadata();
  const scannedBasenames = new Map();

  for (const item of metadata.files) {
    if (!scannedBasenames.has(item.name)) scannedBasenames.set(item.name, []);
    scannedBasenames.get(item.name).push(item.project_relative_path);
  }

  const exactTargetResults = candidates.map((candidate) => {
    const exists = pathExists(candidate.project_relative_path);
    return {
      project_relative_path: candidate.project_relative_path,
      exists,
      item_type: exists
        ? (fs.lstatSync(path.join(root, candidate.project_relative_path)).isDirectory() ? "directory" : "file")
        : "missing",
      source_count: candidate.sources.length,
      sources: candidate.sources,
    };
  });

  const matchedRequiredBasenames = candidates
    .map((candidate) => ({
      candidate_path: candidate.project_relative_path,
      basename: path.basename(candidate.project_relative_path),
      matched_scanned_paths: scannedBasenames.get(path.basename(candidate.project_relative_path)) || [],
    }))
    .filter((item) => item.matched_scanned_paths.length > 0);

  const now = new Date();
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const reportFileRef = `${reportsDirRef}/${stamp}_runs_path_existence_scan_report.json`;
  const report = {
    report_version: "v1",
    phase: "runs_path_existence_verification_A5_scan_train_v1",
    generated_at_local: now.toString(),
    generated_at_utc: now.toISOString(),
    scan_root: runsRootRef,
    candidate_source_roots: scanRoots,
    candidate_path_count: candidates.length,
    scanned_file_count: metadata.files.length,
    scanned_directory_count: metadata.directories.length,
    exact_existing_count: exactTargetResults.filter((item) => item.exists).length,
    exact_missing_count: exactTargetResults.filter((item) => !item.exists).length,
    matched_by_basename_count: matchedRequiredBasenames.length,
    exact_target_results: exactTargetResults,
    matched_required_basenames: matchedRequiredBasenames,
    scanned_file_paths: metadata.files,
    scanned_directory_paths: metadata.directories,
    guard: {
      image_binary_read_performed: false,
      file_content_read_performed_under_runs: false,
      hash_extraction_performed: false,
      dimensions_extraction_performed: false,
      preview_generation_performed: false,
      runs_mutation_performed: false,
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
      DailyNote_write_performed: false,
      VCP_memory_write_performed: false,
      production_candidate_write_performed: false,
    },
  };

  fs.mkdirSync(path.join(root, reportsDirRef), { recursive: true });
  fs.writeFileSync(path.join(root, reportFileRef), `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(JSON.stringify({
    passed: true,
    status: "runs_path_existence_scan_report_written",
    report_ref: reportFileRef,
    candidate_path_count: report.candidate_path_count,
    scanned_file_count: report.scanned_file_count,
    scanned_directory_count: report.scanned_directory_count,
    exact_existing_count: report.exact_existing_count,
    exact_missing_count: report.exact_missing_count,
    matched_by_basename_count: report.matched_by_basename_count,
  }, null, 2));
}

main();
