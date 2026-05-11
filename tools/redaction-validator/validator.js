#!/usr/bin/env node
// Redaction Validator — Skeleton
// Read-only. No network. No CDP. No bridge. No MCP.
// Exit codes: 0=pass, 1=warning, 2=block, 3=internal_error

'use strict';

const EXIT_PASS = 0;
const EXIT_WARNING = 1;
const EXIT_BLOCK = 2;
const EXIT_ERROR = 3;

const VALIDATOR_VERSION = 'v7.110-skeleton';

function printUsage() {
  console.error(`Redaction Validator ${VALIDATOR_VERSION}`);
  console.error('Usage: node validator.js <path1> [path2] ...');
  console.error('Read-only. Does not modify files, access network, CDP, bridge, or MCP.');
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

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(EXIT_PASS);
  }

  // Skeleton: load rule modules (modules are not auto-executed)
  const forbiddenRawFields = require('./rules/forbiddenRawFields');
  const allowedSummaryFields = require('./rules/allowedSummaryFields');
  const closeoutIntegrity = require('./rules/closeoutIntegrity');
  const permissionDrift = require('./rules/permissionDrift');

  // Skeleton: results placeholder
  const results = [];

  // Skeleton: each rule module defines a run(files) function signature
  // In this skeleton, we report that no scanning was performed.
  results.push({
    rule: 'forbiddenRawFields',
    filesScanned: 0,
    violations: 0,
    warnings: 0,
    notes: 1,
    message: 'Skeleton — no scanning performed',
  });
  results.push({
    rule: 'allowedSummaryFields',
    filesScanned: 0,
    violations: 0,
    warnings: 0,
    notes: 1,
    message: 'Skeleton — no scanning performed',
  });
  results.push({
    rule: 'closeoutIntegrity',
    filesScanned: 0,
    violations: 0,
    warnings: 0,
    notes: 1,
    message: 'Skeleton — no scanning performed',
  });
  results.push({
    rule: 'permissionDrift',
    filesScanned: 0,
    violations: 0,
    warnings: 0,
    notes: 1,
    message: 'Skeleton — no scanning performed',
  });

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

module.exports = { buildSummaryReport, EXIT_PASS, EXIT_WARNING, EXIT_BLOCK, EXIT_ERROR, VALIDATOR_VERSION };
