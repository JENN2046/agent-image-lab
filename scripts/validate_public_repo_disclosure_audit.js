#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const scopeRoots = [
  "review_console/static_prototype/mock_data.js",
  "runs/real_generation",
  "reports/production_candidate_authorization",
  "reports/visual_asset_eval_dry_run",
  "reports/production",
  "reports/provider_receipts",
  "review_console/live_receipt_bridge",
];

const fileIncludePatterns = [
  /review_console[\\/]static_prototype[\\/]mock_data\.js$/,
  /runs[\\/]real_generation[\\/][^\\/]+[\\/]generation_attempt_result\.json$/,
  /reports[\\/]production_candidate_authorization[\\/][^\\/]+\.json$/,
  /reports[\\/]visual_asset_eval_dry_run[\\/][^\\/]*production_candidate[^\\/]*\.json$/,
  /reports[\\/]production[\\/].+\.(json|ya?ml|md|txt)$/,
  /reports[\\/]provider_receipts[\\/].+\.(json|ya?ml|md|txt)$/,
  /review_console[\\/]live_receipt_bridge[\\/].+\.(json|ya?ml|md|txt)$/,
];

const textFinders = [
  {
    kind: "local_absolute_path",
    pattern: /\b[A-Za-z]:[\\/](?:Users|\.codex|agent-image-lab|agent-image-lab-v0\.2)[^\s"',)]*/g,
  },
  {
    kind: "unix_home_path",
    pattern: /\/(?:Users|home)\/[A-Za-z0-9._-]+\/[^\s"',)]*/g,
  },
  {
    kind: "localhost_url",
    pattern: /https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\]|::1)(?::\d+)?[^\s"',)]*/gi,
  },
  {
    kind: "secret_string_assignment",
    pattern: /\b(?:api[_-]?key|token|password|secret)\b["']?\s*[:=]\s*["'][^"<\s][^"']{7,}["']/gi,
  },
];

function toRel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function filePath(relPath) {
  return path.join(root, relPath);
}

function exists(relPath) {
  return fs.existsSync(filePath(relPath));
}

function walkFiles(startRel, out = []) {
  const start = filePath(startRel);
  if (!fs.existsSync(start)) return out;
  const stat = fs.statSync(start);
  if (stat.isFile()) {
    out.push(start);
    return out;
  }
  for (const entry of fs.readdirSync(start, { withFileTypes: true })) {
    const full = path.join(start, entry.name);
    if (entry.isDirectory()) {
      walkFiles(toRel(full), out);
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

function scopedFiles() {
  const allFiles = [];
  for (const scope of scopeRoots) walkFiles(scope, allFiles);
  return [...new Set(allFiles)]
    .map((file) => ({ abs: file, rel: toRel(file) }))
    .filter(({ rel }) => fileIncludePatterns.some((pattern) => pattern.test(rel)))
    .sort((a, b) => a.rel.localeCompare(b.rel));
}

function scanText(rel, text) {
  const findings = [];
  for (const finder of textFinders) {
    for (const match of text.matchAll(finder.pattern)) {
      findings.push({
        file: rel,
        kind: finder.kind,
        match: match[0].slice(0, 160),
      });
    }
  }
  return findings;
}

function loadMockObject(text) {
  const sandbox = { window: {} };
  vm.runInNewContext(text, sandbox, { filename: "review_console/static_prototype/mock_data.js", timeout: 1000 });
  return sandbox.window.REVIEW_CONSOLE_MOCK;
}

function parseStructured(rel, text) {
  if (rel.endsWith("mock_data.js")) return loadMockObject(text);
  if (rel.endsWith(".json")) return JSON.parse(text);
  return null;
}

function shouldTreatAsRawPromptKey(key) {
  const normalized = key.toLowerCase();
  if (normalized.includes("prompt_package")) return false;
  if (normalized.includes("prompt_to_artifact")) return false;
  if (normalized.includes("prompt_watermark")) return false;
  if (normalized.includes("prompt_ref")) return false;
  if (normalized.includes("prompt_id")) return false;
  return [
    "prompt",
    "prompt_text",
    "raw_prompt",
    "positive_prompt",
    "negative_prompt",
    "system_prompt",
    "user_prompt",
    "final_prompt",
    "prompt_en",
    "prompt_cn",
  ].includes(normalized);
}

function collectRawPromptFindings(value, rel, currentPath = "$", findings = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectRawPromptFindings(item, rel, `${currentPath}[${index}]`, findings));
    return findings;
  }
  if (!value || typeof value !== "object") return findings;

  for (const [key, child] of Object.entries(value)) {
    const childPath = `${currentPath}.${key}`;
    if (typeof child === "string" && shouldTreatAsRawPromptKey(key) && child.trim().length > 0) {
      findings.push({
        file: rel,
        kind: "raw_prompt_field",
        path: childPath,
        length: child.length,
        sample: child.slice(0, 120),
      });
    }
    collectRawPromptFindings(child, rel, childPath, findings);
  }
  return findings;
}

const checks = [];
function add(check, passed, detail = null) {
  checks.push({ check, passed: Boolean(passed), ...(detail === null ? {} : { detail }) });
}

add("mock_data_scope_exists", exists("review_console/static_prototype/mock_data.js"));
add("runs_real_generation_scope_exists", exists("runs/real_generation"));
add("production_authorization_scope_exists", exists("reports/production_candidate_authorization"));

const files = scopedFiles();
const allTextFindings = [];
const allPromptFindings = [];
const parseFailures = [];

for (const file of files) {
  const text = fs.readFileSync(file.abs, "utf8");
  allTextFindings.push(...scanText(file.rel, text));
  try {
    const structured = parseStructured(file.rel, text);
    if (structured) allPromptFindings.push(...collectRawPromptFindings(structured, file.rel));
  } catch (error) {
    parseFailures.push({ file: file.rel, error: error.message });
  }
}

const generationAttemptResults = files.filter((file) => /runs\/real_generation\/[^/]+\/generation_attempt_result\.json$/.test(file.rel));
const productionRefs = files.filter((file) => file.rel.startsWith("reports/production") || file.rel.includes("production_candidate"));
const providerReceipts = files.filter((file) => file.rel.startsWith("reports/provider_receipts/"));
const liveReceiptBridgeEntries = files.filter((file) => file.rel.startsWith("review_console/live_receipt_bridge/"));

add("scoped_files_present", files.length >= 1, files.map((file) => file.rel));
add("generation_attempt_results_scanned", generationAttemptResults.length >= 1, generationAttemptResults.map((file) => file.rel));
add("production_refs_scanned", productionRefs.length >= 1, productionRefs.map((file) => file.rel));
add("provider_receipts_scanned", providerReceipts.length >= 1, providerReceipts.map((file) => file.rel));
add("live_receipt_bridge_scanned", liveReceiptBridgeEntries.length >= 1, liveReceiptBridgeEntries.map((file) => file.rel));
add("structured_files_parse", parseFailures.length === 0, parseFailures);
add("no_local_absolute_paths_or_localhost_urls_or_secret_strings", allTextFindings.length === 0, allTextFindings);
add("no_raw_prompt_fields_in_public_scope", allPromptFindings.length === 0, allPromptFindings);

const failed = checks.filter((check) => !check.passed);
const output = {
  validator: "validate_public_repo_disclosure_audit",
  phase: "v0_6_85_public_repo_disclosure_audit",
  passed: failed.length === 0,
  status: failed.length === 0 ? "public_repo_disclosure_audit_verified" : "public_repo_disclosure_audit_failed",
  scope_roots: scopeRoots,
  scanned_file_count: files.length,
  generation_attempt_result_count: generationAttemptResults.length,
  production_ref_count: productionRefs.length,
  provider_receipt_count: providerReceipts.length,
  live_receipt_bridge_count: liveReceiptBridgeEntries.length,
  disclosure_finding_count: allTextFindings.length + allPromptFindings.length,
  local_absolute_path_or_localhost_url_or_secret_string_findings: allTextFindings,
  raw_prompt_findings: allPromptFindings,
  parse_failures: parseFailures,
  side_effects: {
    file_write_performed: false,
    secret_value_read_performed: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    push_tag_release_deploy_performed: false,
  },
  check_count: checks.length,
  failed_count: failed.length,
  checks,
  failures: failed,
};

console.log(JSON.stringify(output, null, 2));
process.exit(output.passed ? 0 : 1);
