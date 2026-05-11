// Closeout Integrity Rule — Skeleton
// Checks that each phase closeout contains required safety fields.
// Read-only. No network. No CDP. No bridge. No MCP.

'use strict';

const REQUIRED_CLOSEOUT_FIELDS = [
  'runtime_execution',
  'redacted_summary_only',
  'raw_payload_recorded',
  'known_untracked_file_touched',
  'next_phase_started',
  'commit_hash',
  'branch',
  'git_status',
  'local_scope_result',
];

const CLOSEOUT_PATTERNS = [
  /closeout:/i,
  /_closeout_completed/i,
  /execution_closeout/i,
  /##\s+.*Closeout/i,
];

function isLikelyCloseout(text) {
  return CLOSEOUT_PATTERNS.some((pattern) => pattern.test(text));
}

function extractYamlKeys(text) {
  // Simple YAML key extraction (not a full parser)
  const keys = new Set();
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    // Match key: value or key: at start of line after indent
    const match = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*:/);
    if (match) {
      keys.add(match[1]);
    }
  }

  return keys;
}

function checkCloseoutIntegrity(text, filePath) {
  if (!isLikelyCloseout(text)) {
    return []; // Not a closeout document, skip
  }

  const violations = [];
  const keys = extractYamlKeys(text);

  for (const required of REQUIRED_CLOSEOUT_FIELDS) {
    if (!keys.has(required)) {
      violations.push({
        missing_field: required,
        file: filePath || '(unknown)',
        severity: 'high',
        message: `Required closeout field missing: ${required}`,
      });
    }
  }

  return violations;
}

module.exports = {
  REQUIRED_CLOSEOUT_FIELDS,
  CLOSEOUT_PATTERNS,
  checkCloseoutIntegrity,
};
