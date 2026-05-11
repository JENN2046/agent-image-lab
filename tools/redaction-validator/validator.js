#!/usr/bin/env node
// Redaction Validator — v7.117 scan loop correction
// Read-only. No network. No CDP. No bridge. No MCP.
// Exit codes: 0=pass, 1=warning, 2=block, 3=internal_error

'use strict';

const fs = require('fs');

const EXIT_PASS = 0;
const EXIT_WARNING = 1;
const EXIT_BLOCK = 2;
const EXIT_ERROR = 3;

const VALIDATOR_VERSION = 'v7.117c-patched';
const GLOB_PATTERN = /[*?[\]{}]/;

function printUsage() {
  console.error(`Redaction Validator ${VALIDATOR_VERSION}`);
  console.error('Usage: node validator.js <file1> [file2] ...');
  console.error('Explicit file paths only. No directories. No glob patterns.');
  console.error('Read-only. Does not modify files, access network, CDP, bridge, or MCP.');
}

function isGlobPattern(str) {
  return GLOB_PATTERN.test(str);
}

function buildSummaryReport(results) {
  const totals = { scanned_files: 0, violations: 0, warnings: 0, notes: 0 };

  for (const r of results) {
    totals.scanned_files += r.filesScanned || 0;
    totals.violations += r.violations || 0;
    totals.warnings += r.warnings || 0;
    totals.notes += r.notes || 0;
  }

  let decision = 'pass';
  let exitCode = EXIT_PASS;
  if (totals.violations > 0) {
    decision = 'block';
    exitCode = EXIT_BLOCK;
  } else if (totals.warnings > 0) {
    decision = 'warning';
    exitCode = EXIT_WARNING;
  }

  return {
    validator_version: VALIDATOR_VERSION,
    summary: totals,
    decision,
    exit_code: exitCode,
    results,
  };
}

function printReport(report) {
  console.log(JSON.stringify(report, null, 2));
}

// Minimal YAML shape parser for boundary matrix detection.
// Does NOT require npm yaml parser. Handles only the known matrix shape:
// entries: / non_permissions: at top level, with action_id / allowed_now / permission_status fields.
function parseMinimalMatrix(text, filePath) {
  const matrix = { entries: [], non_permissions: {} };

  // Detect if this file looks like a boundary matrix
  if (!/\bentries\s*:/i.test(text) && !/\bnon_permissions\s*:/i.test(text)) {
    return null; // Not a matrix file
  }

  // Simple line-by-line parse for entries
  const lines = text.split('\n');
  let currentEntry = null;
  let inEntries = false;
  let inNonPermissions = false;

  for (const rawLine of lines) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;

    if (/^entries\s*:$/i.test(line)) {
      inEntries = true;
      inNonPermissions = false;
      continue;
    }

    if (/^non_permissions\s*:$/i.test(line)) {
      inEntries = false;
      inNonPermissions = true;
      continue;
    }

    if (inEntries) {
      // Start of a new entry block: key: only (after entries:)
      const entryStartSimple = line.match(/^([a-zA-Z_]\w*)\s*:\s*$/);
      // Start of a list entry: - key: value (YAML list format)
      const entryStartList = line.match(/^- ([a-zA-Z_]\w*)\s*:\s*(.*)$/);

      if (entryStartSimple) {
        if (currentEntry) matrix.entries.push(currentEntry);
        currentEntry = {};
        continue;
      }

      if (entryStartList) {
        if (currentEntry) matrix.entries.push(currentEntry);
        currentEntry = {};
        const listKey = entryStartList[1];
        const listVal = entryStartList[2].trim();
        if (listVal === 'true') currentEntry[listKey] = true;
        else if (listVal === 'false') currentEntry[listKey] = false;
        else if (/^\d+$/.test(listVal)) currentEntry[listKey] = parseInt(listVal, 10);
        else currentEntry[listKey] = listVal.replace(/^["']|["']$/g, '');
        continue;
      }
    }

    const keyVal = line.match(/^([a-zA-Z_]\w*)\s*:\s*(.+)$/);
    if (!keyVal) continue;

    const key = keyVal[1];
    const valRaw = keyVal[2].trim();

    if (inEntries && currentEntry) {
      if (valRaw === 'true') currentEntry[key] = true;
      else if (valRaw === 'false') currentEntry[key] = false;
      else if (/^\d+$/.test(valRaw)) currentEntry[key] = parseInt(valRaw, 10);
      else currentEntry[key] = valRaw.replace(/^["']|["']$/g, '');
    }

    if (inNonPermissions) {
      if (valRaw === 'true') matrix.non_permissions[key] = true;
      else if (valRaw === 'false') matrix.non_permissions[key] = false;
      else if (/^\d+$/.test(valRaw)) matrix.non_permissions[key] = parseInt(valRaw, 10);
      else matrix.non_permissions[key] = valRaw.replace(/^["']|["']$/g, '');
    }
  }

  // Push last entry
  if (currentEntry) {
    matrix.entries.push(currentEntry);
  }

  return matrix;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(EXIT_PASS);
  }

  // Load rule modules
  const forbiddenRawFields = require('./rules/forbiddenRawFields');
  const allowedSummaryFields = require('./rules/allowedSummaryFields');
  const closeoutIntegrity = require('./rules/closeoutIntegrity');
  const permissionDrift = require('./rules/permissionDrift');

  // Separate results per rule
  const ruleResults = {
    forbiddenRawFields: { rule: 'forbiddenRawFields', filesScanned: 0, violations: 0, warnings: 0, notes: 0, details: [] },
    allowedSummaryFields: { rule: 'allowedSummaryFields', filesScanned: 0, violations: 0, warnings: 0, notes: 0, details: [] },
    closeoutIntegrity: { rule: 'closeoutIntegrity', filesScanned: 0, violations: 0, warnings: 0, notes: 0, details: [] },
    permissionDrift: { rule: 'permissionDrift', filesScanned: 0, violations: 0, warnings: 0, notes: 0, details: [] },
  };

  // Process each file
  for (const filePath of args) {
    // Reject glob patterns first (before fs.statSync)
    if (isGlobPattern(filePath)) {
      ruleResults.forbiddenRawFields.notes++;
      ruleResults.forbiddenRawFields.details.push({ file: filePath, message: 'Skipped glob pattern (not allowed)' });
      continue;
    }

    // Reject directory targets
    try {
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        ruleResults.forbiddenRawFields.notes++;
        ruleResults.forbiddenRawFields.details.push({ file: filePath, message: 'Skipped directory target (not allowed)' });
        continue;
      }
    } catch {
      ruleResults.forbiddenRawFields.warnings++;
      ruleResults.forbiddenRawFields.details.push({ file: filePath, message: 'Cannot access file' });
      continue;
    }

    // Read file
    let text;
    try {
      text = fs.readFileSync(filePath, 'utf-8');
    } catch (err) {
      ruleResults.forbiddenRawFields.warnings++;
      ruleResults.forbiddenRawFields.details.push({ file: filePath, message: `Read error: ${err.message}` });
      continue;
    }

    // Count as scanned
    ruleResults.forbiddenRawFields.filesScanned++;
    ruleResults.allowedSummaryFields.filesScanned++;
    ruleResults.closeoutIntegrity.filesScanned++;
    ruleResults.permissionDrift.filesScanned++;

    // Run forbiddenRawFields scan
    const rawFieldViolations = forbiddenRawFields.scanForbiddenRawFields(text, filePath);
    for (const v of rawFieldViolations) {
      ruleResults.forbiddenRawFields.violations++;
      ruleResults.forbiddenRawFields.details.push(v);
    }

    // Run closeoutIntegrity scan
    const integrityViolations = closeoutIntegrity.checkCloseoutIntegrity(text, filePath);
    for (const v of integrityViolations) {
      ruleResults.closeoutIntegrity.violations++;
      ruleResults.closeoutIntegrity.details.push(v);
    }

    // Run permissionDrift if file looks like boundary matrix
    const matrix = parseMinimalMatrix(text, filePath);
    if (matrix && (matrix.entries.length > 0 || Object.keys(matrix.non_permissions).length > 0)) {
      const driftViolations = permissionDrift.checkPermissionDrift(matrix);
      for (const v of driftViolations) {
        ruleResults.permissionDrift.violations++;
        ruleResults.permissionDrift.details.push(v);
      }
    } else {
      ruleResults.permissionDrift.notes++;
      ruleResults.permissionDrift.details.push({ file: filePath, message: 'Not a boundary matrix file — permissionDrift skipped' });
    }
  }

  // Build summary
  const results = Object.values(ruleResults);
  const report = buildSummaryReport(results);
  printReport(report);
  process.exit(report.exit_code);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(JSON.stringify({ error: err.message, exit_code: EXIT_ERROR }));
    process.exit(EXIT_ERROR);
  });
}

module.exports = { buildSummaryReport, EXIT_PASS, EXIT_WARNING, EXIT_BLOCK, EXIT_ERROR, VALIDATOR_VERSION, parseMinimalMatrix };
